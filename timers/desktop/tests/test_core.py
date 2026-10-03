"""Test della logica non grafica del Timer Ragnarok."""

from __future__ import annotations

import json
from datetime import timedelta

import pytest

from timers_core import (
    DATA_VERSION,
    MAX_ARCHIVE,
    Preset,
    Settings,
    Timer,
    TimerState,
    TimerStore,
    format_duration,
    format_minutes,
    geometry_is_reachable,
    local_at,
    make_beep,
    now_local,
    parse_geometry,
    parse_hhmm,
    parse_minutes,
)

# Schermo singolo 1920x1080 usato dai test sulla geometria.
SCHERMO = (0, 0, 1920, 1080)


@pytest.fixture
def store(tmp_path) -> TimerStore:
    """Archivio isolato su file temporaneo."""
    return TimerStore(path=tmp_path / "ragnarok_timers.json")


def make_timer(name: str = "Atroce", minutes_ago: float = 0.0, dmin: float = 190,
               dmax: float = 370) -> Timer:
    """Crea un timer partito un dato numero di minuti fa."""
    return Timer(
        name=name,
        mappa="ve_fild01",
        categoria="MvP",
        start=now_local() - timedelta(minutes=minutes_ago),
        dmin=timedelta(minutes=dmin),
        dmax=timedelta(minutes=dmax),
    )


# ----------------------------------------------------------------- durate ---


@pytest.mark.parametrize(
    "text,expected",
    [
        ("190", 190),
        ("90.5", 90.5),
        ("90,5", 90.5),
        ("1h30", 90),
        ("3:10", 190),
        ("2h", 120),
        ("  60  ", 60),
    ],
)
def test_parse_minutes_formati_validi(text, expected):
    assert parse_minutes(text) == expected


@pytest.mark.parametrize("text", ["", "   ", "abc", "0", "-30", "h", "10:99x", "1h2m"])
def test_parse_minutes_formati_non_validi(text):
    assert parse_minutes(text) is None


@pytest.mark.parametrize("text,expected", [("23:50", (23, 50)), ("09.05", (9, 5))])
def test_parse_hhmm_validi(text, expected):
    assert parse_hhmm(text) == expected


@pytest.mark.parametrize("text", ["24:00", "12:60", "1250", "", "abc"])
def test_parse_hhmm_non_validi(text):
    assert parse_hhmm(text) is None


def test_format_duration():
    assert format_duration(3725) == "1:02:05"
    assert format_duration(65) == "01:05"
    assert format_duration(0) == "00:00"


def test_format_minutes_senza_decimali_inutili():
    assert format_minutes(190.0) == "190"
    assert format_minutes(90.5) == "90.5"


# -------------------------------------------------------------- orari HH:MM -


def test_local_at_orario_recente_resta_nel_passato():
    now = now_local()
    due_ore_fa = now - timedelta(hours=2)
    assert local_at(due_ore_fa.hour, due_ore_fa.minute) < now


def test_local_at_orario_serale_registrato_dopo_mezzanotte():
    """Un orario oltre 12 ore nel futuro vale come ieri, non come oggi.

    Senza questa regola un'uccisione delle 23:50 registrata alle 00:05
    partirebbe fra quasi 24 ore invece che 15 minuti fa.
    """
    now = now_local()
    lontano = now + timedelta(hours=13)
    assert local_at(lontano.hour, lontano.minute) < now


def test_local_at_permette_programmazione_a_breve():
    now = now_local()
    fra_un_ora = now + timedelta(hours=1)
    assert local_at(fra_un_ora.hour, fra_un_ora.minute) > now


# ------------------------------------------------ finestra di respawn -------


def test_stati_della_finestra():
    now = now_local()
    timer = make_timer(minutes_ago=0, dmin=60, dmax=90)
    assert timer.state(now) is TimerState.PENDING
    assert timer.state(now + timedelta(minutes=70)) is TimerState.OPEN
    assert timer.state(now + timedelta(minutes=100)) is TimerState.CLOSED


def test_timer_fisso_non_ha_finestra():
    now = now_local()
    timer = make_timer(minutes_ago=0, dmin=60, dmax=60)
    assert timer.is_fixed
    assert timer.state(now + timedelta(minutes=61)) is TimerState.CLOSED


def test_countdown_segue_la_soglia_corrente():
    now = now_local()
    timer = make_timer(minutes_ago=0, dmin=60, dmax=90)
    assert timer.countdown(now) == pytest.approx(3600, abs=1)
    # A finestra aperta il conto passa alla chiusura.
    assert timer.countdown(now + timedelta(minutes=70)) == pytest.approx(1200, abs=1)
    # A finestra chiusa diventa negativo.
    assert timer.countdown(now + timedelta(minutes=100)) < 0


def test_ordinamento_prima_aperti_poi_attesi_poi_chiusi():
    now = now_local()
    aperto = make_timer("Aperto", minutes_ago=30, dmin=10, dmax=90)
    atteso = make_timer("Atteso", minutes_ago=0, dmin=60, dmax=90)
    chiuso = make_timer("Chiuso", minutes_ago=200, dmin=10, dmax=20)

    ordinati = sorted([chiuso, atteso, aperto], key=lambda t: t.sort_key(now))
    assert [t.name for t in ordinati] == ["Aperto", "Atteso", "Chiuso"]


def test_set_window_scambia_le_durate_invertite():
    timer = make_timer(dmin=190, dmax=370)
    timer.set_window(timedelta(minutes=400), timer.dmax)
    assert timer.dmin == timedelta(minutes=370)
    assert timer.dmax == timedelta(minutes=400)


def test_reschedule_riarma_allarme():
    timer = make_timer(minutes_ago=500)
    timer.acked = True
    timer.alerts_sent = 6
    timer.reschedule(now_local())
    assert not timer.acked
    assert timer.alerts_sent == 0
    assert timer.next_alert is None


# ---------------------------------------------------------------- allarmi ---


def test_allarme_non_scatta_prima_dell_apertura():
    now = now_local()
    timer = make_timer(minutes_ago=0, dmin=60, dmax=90)
    assert not timer.alert_due(now, max_alerts=6)


def test_allarme_si_ripete_fino_al_massimo():
    now = now_local()
    timer = make_timer(minutes_ago=30, dmin=10, dmax=90)

    for emessi in range(6):
        assert timer.alert_due(now, max_alerts=6)
        timer.register_alert(now, repeat_seconds=15)
        # Subito dopo non deve ripetersi: si aspetta l'intervallo.
        assert not timer.alert_due(now, max_alerts=6)
        now += timedelta(seconds=15)
        assert timer.alerts_sent == emessi + 1

    assert not timer.alert_due(now, max_alerts=6)


def test_acknowledge_ferma_gli_allarmi():
    now = now_local()
    timer = make_timer(minutes_ago=30, dmin=10, dmax=90)
    assert timer.acknowledge() is True
    assert timer.acknowledge() is False
    assert not timer.alert_due(now, max_alerts=6)


def test_suono_disattivato_non_produce_allarmi():
    """La casella Sound tolta zittisce il singolo timer, non tutta la lista."""
    now = now_local()
    timer = make_timer(minutes_ago=30, dmin=10, dmax=90)
    assert timer.alert_due(now, max_alerts=6)
    timer.sound = False
    assert not timer.alert_due(now, max_alerts=6)


def test_suono_attivo_per_impostazione_predefinita():
    assert make_timer().sound is True


def test_beep_in_cache_e_volume_zero_muto():
    assert make_beep(60) is make_beep(60)
    # Oltre l'intestazione wav di 44 byte tutti i campioni sono a zero.
    assert set(make_beep(0)[44:]) == {0}


# ----------------------------------------------------- serializzazione -----


def test_round_trip_del_timer():
    timer = make_timer(minutes_ago=10, dmin=190, dmax=370)
    timer.alerts_sent = 3
    timer.sound = False
    ricostruito = Timer.from_dict(timer.to_dict())
    assert ricostruito == timer


def test_timer_senza_campo_sound_ha_il_suono_attivo():
    """I file scritti prima della colonna Sound non devono restare muti."""
    payload = {
        "name": "Atroce",
        "start": now_local().isoformat(),
        "duration_min_minutes": 190,
        "duration_max_minutes": 370,
    }
    assert Timer.from_dict(payload).sound is True


def test_migrazione_dal_formato_versione_1():
    """Il vecchio formato aveva una sola durata e il flag notified."""
    payload = {
        "name": "Gryphon",
        "mappa": "ra_fild01",
        "categoria": "Mostro",
        "start": "2026-09-01T22:58:00",
        "duration_minutes": 60.0,
        "notified": True,
    }
    timer = Timer.from_dict(payload)
    assert timer is not None
    assert timer.dmin == timer.dmax == timedelta(minutes=60)
    assert timer.acked is True
    assert timer.is_fixed
    # Le date naive del vecchio file ricevono il fuso locale.
    assert timer.start.tzinfo is not None


def test_durate_invertite_nel_file_vengono_ordinate():
    payload = {
        "name": "Atroce",
        "start": now_local().isoformat(),
        "duration_min_minutes": 370,
        "duration_max_minutes": 190,
    }
    timer = Timer.from_dict(payload)
    assert timer is not None
    assert timer.dmin < timer.dmax


@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"start": "non-una-data", "duration_minutes": 60},
        {"start": "2026-09-01T22:58:00", "duration_minutes": "abc"},
        {"start": "2026-09-01T22:58:00", "duration_minutes": 0},
    ],
)
def test_voci_malformate_vengono_scartate(payload):
    assert Timer.from_dict(payload) is None


def test_settings_ignora_chiavi_sconosciute_e_geometria_non_valida():
    settings = Settings.from_dict(
        {"volume": 33, "topmost": True, "geometry": "non-valida", "sconosciuta": 1}
    )
    assert settings.volume == 33
    assert settings.topmost is True
    assert settings.geometry == ""
    assert not hasattr(settings, "sconosciuta")


def test_settings_accetta_geometria_valida():
    assert Settings.from_dict({"geometry": "820x560+100+50"}).geometry == "820x560+100+50"


# ------------------------------------------------------ geometria finestra ---


def test_parse_geometry():
    assert parse_geometry("820x560+100+50") == (820, 560, 100, 50)
    assert parse_geometry("820x560") == (820, 560, None, None)
    assert parse_geometry("820x560+-1900+50") == (820, 560, -1900, 50)
    assert parse_geometry("non-valida") is None


def test_geometria_dentro_lo_schermo_e_accettata():
    assert geometry_is_reachable("820x560+100+50", SCHERMO)
    assert geometry_is_reachable("820x560+0+0", SCHERMO)


def test_geometria_senza_posizione_e_sempre_accettata():
    assert geometry_is_reachable("820x560", SCHERMO)


def test_geometria_fuori_schermo_e_rifiutata():
    """Con un monitor scollegato l'app si riaprirebbe invisibile."""
    assert not geometry_is_reachable("820x560+3000+3000", SCHERMO)
    assert not geometry_is_reachable("820x560+1900+50", SCHERMO)  # quasi tutta a destra
    assert not geometry_is_reachable("820x560+-800+50", SCHERMO)  # quasi tutta a sinistra
    assert not geometry_is_reachable("820x560+100+1050", SCHERMO)  # sotto il bordo
    assert not geometry_is_reachable("820x560+100+-30", SCHERMO)  # titolo sopra il bordo


def test_geometria_valida_su_monitor_secondario_a_sinistra():
    schermo_esteso = (-1920, 0, 3840, 1080)
    assert geometry_is_reachable("820x560+-1800+100", schermo_esteso)
    assert not geometry_is_reachable("820x560+-1800+100", SCHERMO)


def test_geometria_non_valida_e_rifiutata():
    assert not geometry_is_reachable("", SCHERMO)
    assert not geometry_is_reachable("non-valida", SCHERMO)


def test_preset_da_timer():
    preset = Preset.from_timer(make_timer(dmin=190, dmax=370))
    assert (preset.dmin, preset.dmax) == (190, 370)
    assert Preset.from_dict(preset.to_dict()) == preset


# ------------------------------------------------------------ persistenza ---


def test_salvataggio_atomico_senza_temporanei_residui(store):
    store.add(make_timer())
    assert store.save() is True
    assert store.path.exists()
    assert not store.tmp_path.exists()

    dati = json.loads(store.path.read_text(encoding="utf-8"))
    assert dati["version"] == DATA_VERSION
    assert "duration_max_minutes" in dati["timers"][0]
    assert "sound" in dati["timers"][0]


def test_backup_creato_al_secondo_salvataggio(store):
    store.add(make_timer())
    store.save()
    assert not store.backup_path.exists()
    store.save()
    assert store.backup_path.exists()


def test_round_trip_completo(store):
    store.add(make_timer("Atroce", minutes_ago=10))
    store.add(make_timer("Valkyrie", minutes_ago=200, dmin=120, dmax=120))
    store.remember("mappa", "odin_tem02")
    store.remember_preset(store.timers["1"])
    store.settings.volume = 33
    store.settings.topmost = True
    store.save()

    riletto = TimerStore(path=store.path)
    riletto.load()
    assert [t.name for t in riletto.timers.values()] == ["Atroce", "Valkyrie"]
    assert "odin_tem02" in riletto.history["mappa"]
    assert riletto.presets["atroce"].dmax == 370
    assert riletto.settings.volume == 33
    assert riletto.settings.topmost is True


def test_ripiego_sul_backup_se_il_file_e_corrotto(store):
    store.add(make_timer())
    store.save()
    store.save()  # crea il backup
    store.path.write_text("{ questo non e' json", encoding="utf-8")

    riletto = TimerStore(path=store.path)
    assert riletto.load() is True
    assert len(riletto.timers) == 1


def test_file_assente_non_e_un_errore(store):
    assert store.load() is False
    assert store.timers == {}


def test_finestre_gia_aperte_all_avvio_sono_silenziate(store):
    """Riaprendo l'applicazione non devono partire tutti gli allarmi arretrati."""
    store.add(make_timer("Aperto", minutes_ago=200, dmin=10, dmax=400))
    store.add(make_timer("Atteso", minutes_ago=0, dmin=60, dmax=90))
    store.save()

    riletto = TimerStore(path=store.path)
    riletto.load()
    per_nome = {t.name: t for t in riletto.timers.values()}
    assert per_nome["Aperto"].acked is True
    assert per_nome["Atteso"].acked is False


def test_categoria_mostro_migrata_a_mvp(store):
    """I file salvati prima della versione 3 usavano Mostro come categoria."""
    vecchio = {
        "version": 2,
        "timers": [
            {"name": "Atroce", "mappa": "ve_fild01", "categoria": "Mostro",
             "start": now_local().isoformat(), "duration_min_minutes": 190,
             "duration_max_minutes": 370},
        ],
        "history": {"nome": ["Atroce"], "mappa": ["ve_fild01"],
                    "categoria": ["Mostro", "Quest"]},
        "presets": {"atroce": {"nome": "Atroce", "mappa": "ve_fild01",
                               "categoria": "Mostro", "min": 190, "max": 370}},
        "archive": [{"name": "Gryphon", "categoria": "Mostro",
                     "start": now_local().isoformat(), "duration_min_minutes": 60,
                     "duration_max_minutes": 60}],
    }
    store.path.write_text(json.dumps(vecchio), encoding="utf-8")

    store.load()
    assert [t.categoria for t in store.timers.values()] == ["MvP"]
    assert store.history["categoria"] == ["MvP", "Quest"]
    assert store.presets["atroce"].categoria == "MvP"
    assert store.archive[0]["categoria"] == "MvP"


def test_categoria_non_migrata_sui_file_gia_aggiornati(store):
    """Su un file della versione corrente Mostro e' una scelta dell'utente."""
    store.add(make_timer("Atroce"))
    store.timers["1"].categoria = "Mostro"
    store.remember("categoria", "Mostro")
    store.save()

    riletto = TimerStore(path=store.path)
    riletto.load()
    assert riletto.timers["1"].categoria == "Mostro"
    assert "Mostro" in riletto.history["categoria"]


def test_preset_appresi_dai_timer_del_file(store):
    store.add(make_timer("Atroce", dmin=190, dmax=370))
    store.save()

    riletto = TimerStore(path=store.path)
    riletto.load()
    assert riletto.preset_for("atroce").dmin == 190
    assert riletto.preset_for("  ATROCE  ").dmax == 370
    assert riletto.preset_for("sconosciuto") is None


# -------------------------------------------------------------- archivio ---


def test_stale_ids_seleziona_solo_le_finestre_chiuse_da_tempo(store):
    now = now_local()
    vecchio = store.add(make_timer("Vecchio", minutes_ago=3000, dmin=10, dmax=20))
    store.add(make_timer("Recente", minutes_ago=30, dmin=10, dmax=90))
    assert store.stale_ids(now, timedelta(hours=24)) == [vecchio]


def test_archive_ids_sposta_nell_archivio(store):
    now = now_local()
    vecchio = store.add(make_timer("Vecchio", minutes_ago=3000, dmin=10, dmax=20))
    payloads = store.archive_ids([vecchio], now)

    assert vecchio not in store.timers
    assert len(payloads) == 1
    assert store.archive[0]["name"] == "Vecchio"
    assert "archived_at" in store.archive[0]
    # I payload restituiti servono per l'annullamento e non hanno la data.
    assert "archived_at" not in payloads[0]


def test_archivio_limitato(store):
    now = now_local()
    for _ in range(MAX_ARCHIVE + 10):
        timer_id = store.add(make_timer("Vecchio", minutes_ago=3000, dmin=10, dmax=20))
        store.archive_ids([timer_id], now)
    assert len(store.archive) == MAX_ARCHIVE


def test_restore_reinserisce_i_timer(store):
    timer_id = store.add(make_timer("Atroce"))
    payloads = store.remove([timer_id])
    assert store.timers == {}

    nuovi = store.restore(payloads)
    assert len(nuovi) == 1
    assert store.timers[nuovi[0]].name == "Atroce"


# ---------------------------------------------------------------- storico ---


def test_remember_ignora_duplicati_e_maiuscole(store):
    assert store.remember("nome", "Atroce") is True
    assert store.remember("nome", "atroce") is False
    assert store.remember("nome", "  ") is False
    assert store.history["nome"] == ["Atroce"]


def test_remember_mantiene_ordine_alfabetico(store):
    for nome in ("Valkyrie", "Atroce", "gryphon"):
        store.remember("nome", nome)
    assert store.history["nome"] == ["Atroce", "gryphon", "Valkyrie"]
