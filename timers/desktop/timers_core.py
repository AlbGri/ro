#!/usr/bin/env python3
"""Modello dati, persistenza e audio del Timer Ragnarok.

Questo modulo non importa tkinter: contiene solo la logica utilizzabile e
testabile senza interfaccia grafica.
"""

from __future__ import annotations

import ctypes
import io
import itertools
import json
import logging
import math
import os
import re
import shutil
import struct
import subprocess
import sys
import threading
import wave
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from functools import lru_cache
from logging.handlers import RotatingFileHandler
from pathlib import Path

__version__ = "1.1.0"

log = logging.getLogger(__name__)

DATA_FILENAME = "ragnarok_timers.json"
LOG_FILENAME = "ragnarok_timers.log"
DATA_VERSION = 4

DEFAULT_CATEGORIES = ("MvP", "Quest")
HISTORY_KEYS = ("nome", "mappa", "categoria")

# Rinomine di categoria applicate ai file salvati con un formato precedente.
CATEGORY_RENAMES = {"Mostro": "MvP", "MVP": "MvP"}

MAX_ARCHIVE = 200

# Un HH:MM inserito a mano che cade oltre questo margine nel futuro viene letto
# come "ieri": serve per le uccisioni a cavallo della mezzanotte.
FUTURE_TOLERANCE = timedelta(hours=12)

TIME_RE = re.compile(r"^([0-1]?[0-9]|2[0-3])[:.]([0-5][0-9])$")
DURATION_HM_RE = re.compile(r"(\d+)\s*[h:]\s*(\d{1,2})")
DURATION_H_RE = re.compile(r"(\d+(?:\.\d+)?)\s*h")
GEOMETRY_RE = re.compile(r"^(\d+)x(\d+)(?:\+(-?\d+)\+(-?\d+))?$")

# Quanti pixel della finestra devono restare dentro lo schermo perche' la barra
# del titolo sia ancora afferrabile con il mouse.
MIN_VISIBLE_PIXELS = 120


# --------------------------------------------------------------- percorsi ---


def base_dir() -> Path:
    """Restituisce la cartella di lavoro dell'applicazione.

    Returns:
        La cartella dell'eseguibile quando l'app e' congelata con PyInstaller,
        altrimenti quella dei sorgenti. I dati devono stare accanto all'exe e
        non nella cartella temporanea di PyInstaller.
    """
    if getattr(sys, "frozen", False):
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parent


def default_data_file() -> Path:
    """Percorso predefinito del file dati."""
    return base_dir() / DATA_FILENAME


def setup_logging(level: int = logging.INFO) -> None:
    """Configura il logging su file rotante e su stderr.

    Args:
        level: Livello minimo dei messaggi registrati.
    """
    handlers: list[logging.Handler] = [logging.StreamHandler()]
    try:
        handlers.append(
            RotatingFileHandler(
                base_dir() / LOG_FILENAME, maxBytes=256_000, backupCount=1,
                encoding="utf-8",
            )
        )
    except OSError as exc:
        # Cartella di sola lettura: si resta con il solo stream handler.
        print(f"Log su file non disponibile: {exc}", file=sys.stderr)
    logging.basicConfig(
        level=level,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
        handlers=handlers,
    )


# ------------------------------------------------------------- date e ore ---


def now_local() -> datetime:
    """Ora corrente con offset esplicito.

    Returns:
        Un datetime aware: i confronti e le differenze restano corretti anche
        attraverso il cambio dell'ora legale.
    """
    return datetime.now().astimezone()


def as_aware(moment: datetime) -> datetime:
    """Aggiunge il fuso locale a un datetime naive, lasciando invariati gli altri."""
    return moment.astimezone() if moment.tzinfo is None else moment


def parse_hhmm(text: str) -> tuple[int, int] | None:
    """Interpreta un orario nel formato HH:MM.

    Args:
        text: Testo inserito dall'utente, per esempio "23:50" o "23.50".

    Returns:
        La coppia (ora, minuti), oppure None se il testo non e' un orario valido.
    """
    match = TIME_RE.match(text.strip())
    if not match:
        return None
    return int(match.group(1)), int(match.group(2))


def local_at(hour: int, minute: int) -> datetime:
    """Costruisce l'istante piu' plausibile per un orario inserito a mano.

    Args:
        hour: Ora del giorno, da 0 a 23.
        minute: Minuti, da 0 a 59.

    Returns:
        L'istante di oggi corrispondente, oppure quello di ieri se cade oltre
        FUTURE_TOLERANCE nel futuro. Senza questa correzione un'uccisione delle
        23:50 registrata alle 00:05 partirebbe fra quasi 24 ore.
    """
    base = datetime.now().replace(hour=hour, minute=minute, second=0, microsecond=0)
    moment = base.astimezone()
    if moment - now_local() > FUTURE_TOLERANCE:
        moment = (base - timedelta(days=1)).astimezone()
    return moment


def parse_minutes(text: str) -> float | None:
    """Interpreta una durata espressa in minuti.

    Args:
        text: Testo inserito dall'utente: "190", "90,5", "1h30", "3:10".

    Returns:
        I minuti come float, oppure None se il testo non e' una durata valida
        o non e' positivo.
    """
    text = text.strip().lower().replace(",", ".")
    if not text:
        return None

    match = DURATION_HM_RE.fullmatch(text)
    if match:
        value = float(int(match.group(1)) * 60 + int(match.group(2)))
    else:
        match = DURATION_H_RE.fullmatch(text)
        if match:
            value = float(match.group(1)) * 60
        else:
            try:
                value = float(text)
            except ValueError:
                return None
    return value if value > 0 else None


def format_duration(total_seconds: float) -> str:
    """Formatta una durata in H:MM:SS, oppure MM:SS se sotto l'ora."""
    total = int(total_seconds)
    hours, rest = divmod(total, 3600)
    minutes, seconds = divmod(rest, 60)
    if hours:
        return f"{hours:d}:{minutes:02d}:{seconds:02d}"
    return f"{minutes:02d}:{seconds:02d}"


def format_minutes(minutes: float) -> str:
    """Formatta un numero di minuti senza decimali inutili."""
    return str(int(minutes)) if float(minutes).is_integer() else f"{minutes:g}"


# -------------------------------------------------------- geometria finestra -


def parse_geometry(geometry: str) -> tuple[int, int, int | None, int | None] | None:
    """Scompone una stringa di geometria Tk.

    Args:
        geometry: Testo nel formato "820x560" oppure "820x560+100+50".

    Returns:
        La tupla (larghezza, altezza, x, y), con x e y a None quando la
        stringa non contiene la posizione, oppure None se non e' valida.
    """
    match = GEOMETRY_RE.match(geometry.strip())
    if not match:
        return None
    width, height, x, y = match.groups()
    return (
        int(width),
        int(height),
        int(x) if x is not None else None,
        int(y) if y is not None else None,
    )


def geometry_is_reachable(geometry: str, bounds: tuple[int, int, int, int],
                          margin: int = MIN_VISIBLE_PIXELS) -> bool:
    """Verifica che una finestra salvata ricada in un'area raggiungibile.

    Serve a non riaprire l'applicazione fuori dallo schermo dopo che un monitor
    e' stato scollegato o la risoluzione e' cambiata: la finestra risulterebbe
    avviata ma invisibile.

    Args:
        geometry: Geometria salvata.
        bounds: Rettangolo (x, y, larghezza, altezza) del desktop disponibile.
        margin: Pixel della finestra che devono restare visibili.

    Returns:
        True se la geometria e' valida e la finestra e' raggiungibile. Una
        geometria senza posizione e' sempre accettabile.
    """
    parsed = parse_geometry(geometry)
    if parsed is None:
        return False
    width, _height, x, y = parsed
    if x is None or y is None:
        return True

    left, top, screen_width, screen_height = bounds
    right, bottom = left + screen_width, top + screen_height
    return (
        x + width > left + margin
        and x < right - margin
        and top <= y < bottom - margin
    )


def virtual_screen_bounds() -> tuple[int, int, int, int] | None:
    """Rettangolo del desktop virtuale, monitor multipli inclusi.

    Returns:
        La tupla (x, y, larghezza, altezza) su Windows, None altrove: sugli
        altri sistemi il chiamante ricava i valori da Tk.
    """
    if not sys.platform.startswith("win"):
        return None
    try:
        metrics = ctypes.windll.user32.GetSystemMetrics
        # SM_XVIRTUALSCREEN, SM_YVIRTUALSCREEN, SM_CXVIRTUALSCREEN, SM_CYVIRTUALSCREEN
        return (metrics(76), metrics(77), metrics(78), metrics(79))
    except OSError:
        log.exception("Lettura delle dimensioni del desktop fallita")
        return None


# ----------------------------------------------------------------- audio ----


@lru_cache(maxsize=32)
def make_beep(volume: int, freq: int = 880, duration: float = 0.3,
              rate: int = 44100) -> bytes:
    """Genera in memoria un wav mono con la nota di allarme.

    Args:
        volume: Volume da 0 a 100.
        freq: Frequenza della nota in hertz.
        duration: Durata in secondi.
        rate: Frequenza di campionamento.

    Returns:
        Il contenuto completo di un file wav. Il risultato e' in cache: lo
        stesso volume non viene rigenerato a ogni allarme.
    """
    n_samples = int(rate * duration)
    amplitude = 32767 * max(0, min(volume, 100)) / 100
    fade = max(1, int(rate * 0.01))

    samples = []
    for i in range(n_samples):
        if i < fade:
            envelope = i / fade
        elif i > n_samples - fade:
            envelope = max(0.0, (n_samples - i) / fade)
        else:
            envelope = 1.0
        samples.append(int(amplitude * envelope * math.sin(2 * math.pi * freq * i / rate)))

    body = struct.pack("<%dh" % n_samples, *samples)
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        wav.writeframes(body)
    return buffer.getvalue()


# Un solo beep alla volta: piu' timer che scadono insieme si accodano invece di
# sovrapporsi o troncarsi a vicenda.
_beep_lock = threading.Lock()


def _play_beep_blocking(volume: int) -> None:
    data = make_beep(volume)
    with _beep_lock:
        if sys.platform.startswith("win"):
            import winsound

            winsound.PlaySound(data, winsound.SND_MEMORY)
            return
        try:
            subprocess.run(
                ["aplay", "-q", "-"],
                input=data,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                check=False,
            )
        except FileNotFoundError:
            log.warning("aplay non disponibile: allarme sonoro non riprodotto")


def play_beep(volume: int) -> None:
    """Riproduce l'allarme sonoro senza bloccare il chiamante.

    Args:
        volume: Volume da 0 a 100. A zero non viene riprodotto nulla.
    """
    if volume <= 0:
        return

    def worker() -> None:
        try:
            _play_beep_blocking(volume)
        except Exception:
            # Un problema audio non deve mai fermare l'applicazione.
            log.exception("Riproduzione dell'allarme fallita")

    threading.Thread(target=worker, daemon=True).start()


def flash_taskbar(window_id: int, count: int = 8) -> None:
    """Fa lampeggiare l'icona nella barra delle applicazioni.

    Args:
        window_id: Identificatore nativo della finestra (winfo_id di Tk).
        count: Numero di lampeggi.

    Note:
        Ha effetto solo su Windows; altrove non fa nulla.
    """
    if not sys.platform.startswith("win"):
        return
    try:
        user32 = ctypes.windll.user32
        user32.GetParent.restype = ctypes.c_void_p
        user32.GetParent.argtypes = [ctypes.c_void_p]
        hwnd = user32.GetParent(ctypes.c_void_p(window_id))
        if not hwnd:
            return

        class FlashWInfo(ctypes.Structure):
            _fields_ = [
                ("cbSize", ctypes.c_uint),
                ("hwnd", ctypes.c_void_p),
                ("dwFlags", ctypes.c_uint),
                ("uCount", ctypes.c_uint),
                ("dwTimeout", ctypes.c_uint),
            ]

        info = FlashWInfo(ctypes.sizeof(FlashWInfo), hwnd, 0x03, count, 0)
        user32.FlashWindowEx(ctypes.byref(info))
    except OSError:
        log.exception("Lampeggio della barra delle applicazioni fallito")


# ---------------------------------------------------------------- modello ---


class TimerState(Enum):
    """Stato di un timer rispetto alla sua finestra di respawn."""

    PENDING = "pending"
    OPEN = "open"
    CLOSED = "closed"


_STATE_RANK = {TimerState.OPEN: 0, TimerState.PENDING: 1, TimerState.CLOSED: 2}


@dataclass
class Timer:
    """Un respawn da sorvegliare.

    La finestra di respawn va da `start + dmin` a `start + dmax`. Quando le due
    durate coincidono il timer si comporta come un countdown classico.

    Attributes:
        name: Nome del mostro o della quest.
        mappa: Mappa di riferimento.
        categoria: Categoria usata per il colore della riga.
        start: Istante di partenza, tipicamente l'uccisione.
        dmin: Durata minima prima dell'apertura della finestra.
        dmax: Durata massima, oltre la quale la finestra e' chiusa.
        sound: False se questo timer non deve emettere allarmi sonori.
        acked: True se l'utente ha preso atto dell'allarme.
        alerts_sent: Quanti allarmi sono gia' stati emessi.
        next_alert: Istante del prossimo allarme, None se non programmato.
    """

    name: str
    mappa: str
    categoria: str
    start: datetime
    dmin: timedelta
    dmax: timedelta
    sound: bool = True
    acked: bool = False
    alerts_sent: int = 0
    next_alert: datetime | None = None

    @property
    def open_at(self) -> datetime:
        """Istante di apertura della finestra."""
        return self.start + self.dmin

    @property
    def close_at(self) -> datetime:
        """Istante di chiusura della finestra."""
        return self.start + self.dmax

    @property
    def is_fixed(self) -> bool:
        """True se non c'e' finestra, cioe' se le due durate coincidono."""
        return self.dmin == self.dmax

    def state(self, now: datetime) -> TimerState:
        """Stato del timer a un dato istante."""
        if now < self.open_at:
            return TimerState.PENDING
        if now < self.close_at:
            return TimerState.OPEN
        return TimerState.CLOSED

    def countdown(self, now: datetime) -> float:
        """Secondi alla prossima soglia.

        Returns:
            Secondi mancanti all'apertura se il timer e' in attesa, alla
            chiusura se la finestra e' aperta, e un valore negativo pari al
            tempo trascorso dalla chiusura se e' chiusa.
        """
        state = self.state(now)
        if state is TimerState.PENDING:
            return (self.open_at - now).total_seconds()
        if state is TimerState.OPEN:
            return (self.close_at - now).total_seconds()
        return (self.close_at - now).total_seconds()

    def sort_key(self, now: datetime) -> tuple[int, float]:
        """Chiave di ordinamento: prima gli aperti, poi gli attesi, poi i chiusi."""
        state = self.state(now)
        if state is TimerState.CLOSED:
            return (_STATE_RANK[state], (now - self.close_at).total_seconds())
        target = self.close_at if state is TimerState.OPEN else self.open_at
        return (_STATE_RANK[state], (target - now).total_seconds())

    def reschedule(self, start: datetime) -> None:
        """Sposta la partenza e riarma l'allarme.

        Args:
            start: Nuovo istante di partenza.
        """
        self.start = as_aware(start)
        self.acked = False
        self.alerts_sent = 0
        self.next_alert = None

    def set_window(self, dmin: timedelta, dmax: timedelta) -> None:
        """Imposta la finestra di respawn, ordinando le durate se invertite."""
        self.dmin, self.dmax = (dmin, dmax) if dmin <= dmax else (dmax, dmin)
        self.acked = False
        self.alerts_sent = 0
        self.next_alert = None

    def alert_due(self, now: datetime, max_alerts: int) -> bool:
        """Indica se va emesso un allarme adesso.

        Args:
            now: Istante corrente.
            max_alerts: Numero massimo di allarmi per questo timer.

        Returns:
            True se il suono e' attivo per questo timer, la finestra e' aperta
            o chiusa, l'utente non ha ancora preso atto e il numero massimo di
            allarmi non e' stato raggiunto.
        """
        if not self.sound or self.acked or self.state(now) is TimerState.PENDING:
            return False
        if self.alerts_sent >= max_alerts:
            return False
        return self.next_alert is None or now >= self.next_alert

    def register_alert(self, now: datetime, repeat_seconds: int) -> None:
        """Registra un allarme emesso e programma la ripetizione."""
        self.alerts_sent += 1
        self.next_alert = now + timedelta(seconds=repeat_seconds)

    def acknowledge(self) -> bool:
        """Segna l'allarme come visto.

        Returns:
            True se lo stato e' cambiato, False se era gia' stato preso atto.
        """
        if self.acked:
            return False
        self.acked = True
        self.next_alert = None
        return True

    def to_dict(self) -> dict:
        """Serializza il timer per il file dati."""
        return {
            "name": self.name,
            "mappa": self.mappa,
            "categoria": self.categoria,
            "start": self.start.isoformat(),
            "duration_min_minutes": self.dmin.total_seconds() / 60,
            "duration_max_minutes": self.dmax.total_seconds() / 60,
            "sound": self.sound,
            "acked": self.acked,
            "alerts_sent": self.alerts_sent,
        }

    @classmethod
    def from_dict(cls, payload: dict) -> Timer | None:
        """Ricostruisce un timer dal file dati.

        Accetta anche il formato della versione 1, che aveva la sola chiave
        `duration_minutes` e il flag `notified`.

        Args:
            payload: Dizionario letto dal JSON.

        Returns:
            Il timer, oppure None se la voce e' incompleta o malformata.
        """
        try:
            start = as_aware(datetime.fromisoformat(payload["start"]))
        except (KeyError, TypeError, ValueError):
            log.warning("Voce del file dati scartata, partenza non valida: %r", payload)
            return None

        raw_min = payload.get("duration_min_minutes", payload.get("duration_minutes"))
        raw_max = payload.get("duration_max_minutes", raw_min)
        try:
            dmin, dmax = float(raw_min), float(raw_max)
        except (TypeError, ValueError):
            log.warning("Voce del file dati scartata, durata non valida: %r", payload)
            return None
        if dmin <= 0:
            log.warning("Voce del file dati scartata, durata non positiva: %r", payload)
            return None
        if dmax < dmin:
            dmin, dmax = dmax, dmin

        return cls(
            name=str(payload.get("name", "Timer")),
            mappa=str(payload.get("mappa", "")),
            categoria=str(payload.get("categoria", DEFAULT_CATEGORIES[0])),
            start=start,
            dmin=timedelta(minutes=dmin),
            dmax=timedelta(minutes=dmax),
            sound=bool(payload.get("sound", True)),
            acked=bool(payload.get("acked", payload.get("notified", False))),
            alerts_sent=int(payload.get("alerts_sent", 0)),
        )


@dataclass
class Preset:
    """Valori ricordati per un nome, usati per compilare il form."""

    name: str
    mappa: str
    categoria: str
    dmin: float
    dmax: float

    def to_dict(self) -> dict:
        """Serializza il preset per il file dati."""
        return {
            "nome": self.name,
            "mappa": self.mappa,
            "categoria": self.categoria,
            "min": self.dmin,
            "max": self.dmax,
        }

    @classmethod
    def from_dict(cls, payload: dict) -> Preset | None:
        """Ricostruisce un preset dal file dati, o None se malformato."""
        try:
            return cls(
                name=str(payload["nome"]),
                mappa=str(payload.get("mappa", "")),
                categoria=str(payload.get("categoria", DEFAULT_CATEGORIES[0])),
                dmin=float(payload["min"]),
                dmax=float(payload.get("max", payload["min"])),
            )
        except (KeyError, TypeError, ValueError):
            log.warning("Preset scartato, formato non valido: %r", payload)
            return None

    @classmethod
    def from_timer(cls, timer: Timer) -> Preset:
        """Crea un preset a partire da un timer esistente."""
        return cls(
            name=timer.name,
            mappa=timer.mappa,
            categoria=timer.categoria,
            dmin=timer.dmin.total_seconds() / 60,
            dmax=timer.dmax.total_seconds() / 60,
        )


@dataclass
class Settings:
    """Preferenze dell'utente, salvate insieme ai timer."""

    volume: int = 60
    topmost: bool = False
    geometry: str = ""
    repeat_alert: bool = True
    alert_repeat_seconds: int = 15
    alert_max_count: int = 6

    def to_dict(self) -> dict:
        """Serializza le impostazioni per il file dati."""
        return {
            "volume": self.volume,
            "topmost": self.topmost,
            "geometry": self.geometry,
            "repeat_alert": self.repeat_alert,
            "alert_repeat_seconds": self.alert_repeat_seconds,
            "alert_max_count": self.alert_max_count,
        }

    @classmethod
    def from_dict(cls, payload: dict) -> Settings:
        """Legge le impostazioni scartando le chiavi sconosciute o non valide."""
        settings = cls()
        if not isinstance(payload, dict):
            return settings
        for key, default in settings.to_dict().items():
            if key not in payload:
                continue
            value = payload[key]
            try:
                setattr(settings, key, type(default)(value))
            except (TypeError, ValueError):
                log.warning("Impostazione %s ignorata, valore non valido: %r", key, value)
        if not GEOMETRY_RE.match(settings.geometry):
            settings.geometry = ""
        return settings


# ------------------------------------------------------------ persistenza ---


@dataclass
class TimerStore:
    """Contiene lo stato dell'applicazione e lo legge e scrive su disco.

    Attributes:
        path: Percorso del file dati JSON.
        timers: Timer attivi, indicizzati per identificatore.
        history: Valori gia' usati per nome, mappa e categoria.
        presets: Valori ricordati per nome, usati per compilare il form.
        archive: Timer archiviati, serializzati.
        settings: Preferenze dell'utente.
    """

    path: Path = field(default_factory=default_data_file)
    timers: dict[str, Timer] = field(default_factory=dict)
    history: dict[str, list[str]] = field(
        default_factory=lambda: {"nome": [], "mappa": [], "categoria": list(DEFAULT_CATEGORIES)}
    )
    presets: dict[str, Preset] = field(default_factory=dict)
    archive: list[dict] = field(default_factory=list)
    settings: Settings = field(default_factory=Settings)
    _ids: itertools.count = field(default_factory=lambda: itertools.count(1), repr=False)

    @property
    def tmp_path(self) -> Path:
        """File temporaneo usato per la scrittura atomica."""
        return self.path.with_suffix(self.path.suffix + ".tmp")

    @property
    def backup_path(self) -> Path:
        """Copia di sicurezza dell'ultimo file dati valido."""
        return self.path.with_suffix(self.path.suffix + ".bak")

    # ---- timer ----

    def add(self, timer: Timer) -> str:
        """Inserisce un timer e restituisce il suo identificatore."""
        timer_id = str(next(self._ids))
        self.timers[timer_id] = timer
        return timer_id

    def remove(self, timer_ids: list[str]) -> list[dict]:
        """Elimina i timer indicati.

        Args:
            timer_ids: Identificatori da eliminare.

        Returns:
            I timer serializzati, nell'ordine ricevuto, per poterli ripristinare.
        """
        payloads = []
        for timer_id in timer_ids:
            timer = self.timers.pop(timer_id, None)
            if timer is not None:
                payloads.append(timer.to_dict())
        return payloads

    def restore(self, payloads: list[dict]) -> list[str]:
        """Reinserisce timer precedentemente serializzati."""
        restored = []
        for payload in payloads:
            timer = Timer.from_dict(payload)
            if timer is not None:
                restored.append(self.add(timer))
        return restored

    def stale_ids(self, now: datetime, older_than: timedelta) -> list[str]:
        """Identificatori dei timer con la finestra chiusa da abbastanza tempo.

        Args:
            now: Istante corrente.
            older_than: Anzianita' minima della chiusura.
        """
        cutoff = now - older_than
        return [tid for tid, timer in self.timers.items() if timer.close_at < cutoff]

    def archive_ids(self, timer_ids: list[str], now: datetime) -> list[dict]:
        """Sposta i timer indicati nell'archivio.

        Args:
            timer_ids: Identificatori da archiviare.
            now: Istante da registrare come momento dell'archiviazione.

        Returns:
            I timer serializzati, senza il campo di archiviazione, per poterli
            ripristinare.
        """
        payloads = self.remove(timer_ids)
        stamp = now.isoformat(timespec="seconds")
        self.archive.extend(dict(payload, archived_at=stamp) for payload in payloads)
        del self.archive[:-MAX_ARCHIVE]
        return payloads

    # ---- storico e preset ----

    def remember(self, key: str, value: str) -> bool:
        """Aggiunge un valore allo storico di un campo.

        Args:
            key: Uno fra "nome", "mappa" e "categoria".
            value: Valore inserito dall'utente.

        Returns:
            True se lo storico e' cambiato.
        """
        value = value.strip()
        if not value or any(v.lower() == value.lower() for v in self.history[key]):
            return False
        self.history[key].append(value)
        self.history[key].sort(key=str.lower)
        return True

    def remember_preset(self, timer: Timer) -> None:
        """Memorizza mappa, categoria e durate associate al nome del timer."""
        self.presets[timer.name.strip().lower()] = Preset.from_timer(timer)

    def preset_for(self, name: str) -> Preset | None:
        """Preset associato a un nome, se esiste."""
        return self.presets.get(name.strip().lower())

    # ---- file ----

    def save(self) -> bool:
        """Scrive il file dati in modo atomico.

        La scrittura avviene su un file temporaneo che viene poi spostato al
        posto dell'originale, cosi' un'interruzione a meta' non puo' troncare
        i dati buoni. Il file precedente resta come copia di sicurezza.

        Returns:
            True se il salvataggio e' riuscito.
        """
        data = {
            "version": DATA_VERSION,
            "settings": self.settings.to_dict(),
            "timers": [timer.to_dict() for timer in self.timers.values()],
            "history": self.history,
            "presets": {key: preset.to_dict() for key, preset in self.presets.items()},
            "archive": self.archive,
        }
        try:
            with open(self.tmp_path, "w", encoding="utf-8") as handle:
                json.dump(data, handle, ensure_ascii=False, indent=2)
                handle.flush()
                os.fsync(handle.fileno())
            if self.path.exists():
                shutil.copyfile(self.path, self.backup_path)
            self.tmp_path.replace(self.path)
            return True
        except OSError:
            log.exception("Salvataggio del file dati fallito: %s", self.path)
            return False

    def _read_file(self) -> tuple[dict | None, bool]:
        """Legge il file dati, ripiegando sulla copia di sicurezza.

        Returns:
            La coppia (dati, from_backup). I dati sono None se nessuno dei due
            file e' leggibile.
        """
        for candidate in (self.path, self.backup_path):
            if not candidate.exists():
                continue
            try:
                with open(candidate, "r", encoding="utf-8") as handle:
                    data = json.load(handle)
            except (OSError, json.JSONDecodeError):
                log.warning("File dati illeggibile: %s", candidate, exc_info=True)
                continue
            if isinstance(data, dict):
                return data, candidate == self.backup_path
            log.warning("File dati con struttura inattesa: %s", candidate)
        return None, False

    def _migrate_categories(self) -> None:
        """Applica le rinomine di categoria ai dati appena caricati.

        Viene eseguita solo sui file salvati prima della versione corrente, in
        modo che una categoria riscritta a mano dall'utente non venga cambiata.
        """
        for timer in self.timers.values():
            timer.categoria = CATEGORY_RENAMES.get(timer.categoria, timer.categoria)
        for preset in self.presets.values():
            preset.categoria = CATEGORY_RENAMES.get(preset.categoria, preset.categoria)
        for entry in self.archive:
            if entry.get("categoria") in CATEGORY_RENAMES:
                entry["categoria"] = CATEGORY_RENAMES[entry["categoria"]]

        rinominate = [CATEGORY_RENAMES.get(v, v) for v in self.history["categoria"]]
        unica: list[str] = []
        for value in rinominate:
            if not any(value.lower() == existing.lower() for existing in unica):
                unica.append(value)
        self.history["categoria"] = sorted(unica, key=str.lower)
        log.info("Categorie migrate: %s", CATEGORY_RENAMES)

    def load(self, now: datetime | None = None) -> bool:
        """Carica timer, storico, preset, archivio e impostazioni.

        I timer la cui finestra risulta gia' aperta all'avvio vengono segnati
        come visti: altrimenti riaprendo l'applicazione partirebbero tutti gli
        allarmi arretrati insieme.

        Args:
            now: Istante di riferimento, utile nei test.

        Returns:
            True se i dati provengono dalla copia di sicurezza.
        """
        now = now or now_local()
        data, from_backup = self._read_file()
        if data is None:
            return False

        self.settings = Settings.from_dict(data.get("settings", {}))

        history = data.get("history", {})
        if isinstance(history, dict):
            for key in HISTORY_KEYS:
                seen = {value.lower() for value in self.history[key]}
                for value in history.get(key, []):
                    if isinstance(value, str) and value.lower() not in seen:
                        self.history[key].append(value)
                        seen.add(value.lower())
                self.history[key].sort(key=str.lower)

        presets = data.get("presets", {})
        if isinstance(presets, dict):
            for key, payload in presets.items():
                preset = Preset.from_dict(payload) if isinstance(payload, dict) else None
                if preset is not None:
                    self.presets[key] = preset

        archive = data.get("archive", [])
        if isinstance(archive, list):
            self.archive = archive[-MAX_ARCHIVE:]

        for payload in data.get("timers", []):
            if not isinstance(payload, dict):
                continue
            timer = Timer.from_dict(payload)
            if timer is None:
                continue
            if timer.open_at <= now:
                timer.acked = True
            self.add(timer)
            self.presets.setdefault(timer.name.strip().lower(), Preset.from_timer(timer))

        if data.get("version", 1) < DATA_VERSION:
            self._migrate_categories()

        log.info("Caricati %d timer da %s", len(self.timers), self.path)
        return from_backup
