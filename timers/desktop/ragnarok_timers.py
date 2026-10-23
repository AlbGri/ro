#!/usr/bin/env python3
"""Interfaccia tkinter di RO Timers.

Sorveglia le finestre di respawn di MVP e quest: la riga resta neutra finche'
la finestra non si apre, diventa gialla mentre e' aperta e rossa quando si e'
chiusa. Tutta la logica non grafica sta in timers_core.
"""

from __future__ import annotations

import logging
import sys
import tkinter as tk
from datetime import timedelta
from pathlib import Path
from tkinter import filedialog, messagebox, ttk

from timers_core import (
    DEFAULT_CATEGORIES,
    Timer,
    TimerState,
    TimerStore,
    __version__,
    flash_taskbar,
    format_duration,
    format_minutes,
    geometry_is_reachable,
    local_at,
    now_local,
    parse_beeps,
    parse_hhmm,
    parse_minutes,
    play_beep,
    setup_logging,
    virtual_screen_bounds,
)

log = logging.getLogger(__name__)

APP_NAME = "RO Timers"

BG = "#1e1e1e"
BG_ALT = "#2b2b2b"
BG_HEAD = "#3a3a3a"
BG_HOVER = "#4a4a4a"
FG = "#e8e8e8"
FG_MUTED = "#8a8a8a"
ACCENT = "#4a7fb5"
COLOR_OPEN = "#e5c07b"
COLOR_CLOSED = "#cc3333"
COLOR_PALETTE = ("#e07b39", "#3b82c4", "#4caf82", "#c9a227", "#a15fcb", "#d1495b")

CAT_TAG_PREFIX = "cat::"
TAG_OPEN = "state::open"
TAG_CLOSED = "state::closed"

TICK_MS = 500
STATUS_CLEAR_MS = 6000
PURGE_MIN_AGE = timedelta(hours=1)
# Oltre questa anzianita' il contatore di Left smette di essere informativo:
# "-111:25:21" non dice niente di piu' di "e' passato da un pezzo".
LEFT_HIDE_AFTER = timedelta(hours=24)
MAX_UNDO = 20
HINT_WRAP = 760

COLUMNS = ("beeps", "name", "map", "category", "time", "spawn", "maxspawn", "left")
# Colonna -> ((italiano, inglese), larghezza, allineamento). Le scritte sono
# quelle della versione web.
HEADINGS = {
    "#0": (("Suono", "Sound"), 55, "center"),
    "beeps": (("Bip", "Beeps"), 45, "center"),
    "name": (("Nome", "Name"), 130, "w"),
    "map": (("Mappa", "Map"), 100, "center"),
    "category": (("Categoria", "Category"), 85, "center"),
    "time": (("Ora", "Time"), 60, "center"),
    "spawn": (("Spawn", "Spawn"), 65, "center"),
    "maxspawn": (("Spawn max", "Max. Spawn"), 85, "center"),
    "left": (("Manca", "Left"), 90, "center"),
}
# Colonna del Treeview -> campo modificabile con doppio clic.
EDITABLE_COLUMNS = {
    "#1": "beeps",
    "#2": "name",
    "#3": "mappa",
    "#4": "categoria",
    "#5": "orario",
    "#6": "dmin",
    "#7": "dmax",
}
# Caselle della colonna Sound: BALLOT BOX WITH CHECK e BALLOT BOX. Sono simboli
# Unicode e non emoji, quindi restano monocromatici: aggiungere il selettore di
# variante U+FE0F li trasformerebbe in emoji a colori. Scritti come escape
# perche' a vista non si distinguono da altri simboli simili.
SOUND_ON = "☑"
SOUND_OFF = "☐"
NO_TIME = "-"
TIME_FORMAT = "%H:%M:%S"


def resource_path(name: str) -> Path:
    """Percorso di un file distribuito con l'applicazione.

    Nell'eseguibile di PyInstaller i file di supporto stanno in `sys._MEIPASS`,
    non accanto all'exe.
    """
    return Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parent)) / name


class AutocompleteCombobox(ttk.Combobox):
    """Combobox che filtra la tendina in base al testo digitato."""

    IGNORED_KEYS = frozenset(
        {
            "BackSpace", "Delete", "Left", "Right", "Up", "Down", "Home", "End",
            "Return", "Escape", "Tab", "Shift_L", "Shift_R", "Control_L",
            "Control_R", "Alt_L", "Alt_R", "Prior", "Next",
        }
    )

    def __init__(self, master=None, completion_values: list[str] | None = None, **kwargs):
        """Inizializza la combobox.

        Args:
            master: Widget contenitore.
            completion_values: Valori proposti nella tendina.
            **kwargs: Opzioni passate a ttk.Combobox.
        """
        super().__init__(master, **kwargs)
        self._all_values: list[str] = list(completion_values or [])
        self["values"] = self._all_values
        self.bind("<KeyRelease>", self._on_key_release, add="+")

    def set_completion_list(self, values: list[str]) -> None:
        """Sostituisce i valori proposti."""
        self._all_values = list(values)
        self["values"] = self._all_values

    def popdown_visible(self) -> bool:
        """Indica se la tendina e' aperta.

        Aprire la tendina genera un evento di uscita dal campo che non va
        scambiato per la fine della modifica.
        """
        try:
            popdown = self.tk.call("ttk::combobox::PopdownWindow", self)
            return bool(self.tk.call("winfo", "ismapped", popdown))
        except tk.TclError:
            return False

    def _on_key_release(self, event: tk.Event) -> None:
        if event.keysym in self.IGNORED_KEYS:
            return
        text = self.get().strip().lower()
        if not text:
            self["values"] = self._all_values
            return
        matches = [value for value in self._all_values if text in value.lower()]
        self["values"] = matches or self._all_values


class TimerApp:
    """Finestra principale: form di inserimento, tabella dei timer e allarmi."""

    def __init__(self, root: tk.Tk, store: TimerStore | None = None) -> None:
        """Costruisce l'interfaccia e carica i dati.

        Args:
            root: Finestra Tk radice.
            store: Archivio dei dati; se omesso ne viene creato uno sul file
                predefinito.
        """
        self.root = root
        self.store = store or TimerStore()

        self.category_colors: dict[str, str] = {}
        self.row_cells: dict[str, tuple[str, ...]] = {}
        self.row_tags: dict[str, str] = {}
        self.undo_stack: list[list[dict]] = []

        self.editor: tk.Widget | None = None
        self.editor_row: str | None = None
        self.current_order: list[str] = []
        self._after_id: str | None = None
        self._status_token = 0

        root.title(f"{APP_NAME} {__version__}")
        root.geometry("860x600")
        root.minsize(760, 460)
        root.configure(bg=BG)
        self._set_icon()

        # La lingua sta nel file dati: va letta prima di scrivere le scritte.
        from_backup = self.store.load()
        self._build_ui()
        self._show_store()
        self._apply_geometry()
        if from_backup:
            self.set_status(
                self.tr(
                    "Dati principali illeggibili: recuperati dalla copia di sicurezza.",
                    "Main data was unreadable: restored from the backup copy.",
                ),
                error=True,
            )
        root.protocol("WM_DELETE_WINDOW", self.close)
        self._update_loop()

    def tr(self, italian: str, english: str) -> str:
        """Sceglie una scritta nella lingua dell'applicazione, come `tr()` del sito.

        Ogni scritta nuova va data in entrambe le lingue.
        """
        return english if self.store.settings.language == "en" else italian

    # ------------------------------------------------------------ interfaccia

    def _set_icon(self) -> None:
        try:
            self._icon = tk.PhotoImage(file=str(resource_path("icon.png")))
            self.root.iconphoto(True, self._icon)
        except tk.TclError:
            log.warning("Icona della finestra non caricata", exc_info=True)

    def _build_ui(self) -> None:
        self._configure_style()

        top = tk.Frame(self.root, bg=BG)
        top.pack(fill="x", padx=8, pady=(6, 0))
        self.topmost_var = tk.BooleanVar(value=False)
        self._dark_checkbutton(
            top, self.tr("Sempre in primo piano", "Always on top"),
            self.topmost_var, self._toggle_topmost,
        ).pack(side="left")
        tk.Label(
            top,
            text=self.tr(
                "Doppio clic su una cella per modificarla", "Double-click a cell to edit it"
            ),
            bg=BG, fg=FG_MUTED,
        ).pack(side="left", padx=(12, 0))
        # Mostra la lingua in cui si passa, come il pulsante del sito.
        ttk.Button(
            top, text=self.tr("EN", "IT"), style="Dark.TButton", width=4,
            command=self.toggle_language,
        ).pack(side="right")
        self.clock_label = tk.Label(top, text="--:--:--", bg=BG, fg=FG, font=("Segoe UI", 11))
        self.clock_label.pack(side="right", padx=(0, 12))

        self._build_form()
        self._build_tree()
        self._build_buttons()
        self._build_footer()

        self.root.bind("<Control-d>", lambda _e: self.duplicate_selected())
        self.root.bind("<Control-r>", lambda _e: self.refresh_selected())
        self.root.bind("<Control-z>", lambda _e: self.undo_last())

    def _configure_style(self) -> None:
        style = ttk.Style()
        style.theme_use("clam")
        style.configure(
            "Treeview", background=BG_ALT, fieldbackground=BG_ALT, foreground=FG,
            rowheight=24, borderwidth=0,
        )
        style.map(
            "Treeview",
            background=[("selected", ACCENT)],
            foreground=[("selected", "white")],
        )
        style.configure("Treeview.Heading", background=BG_HEAD, foreground=FG, borderwidth=0)
        style.map("Treeview.Heading", background=[("active", BG_HOVER)])
        style.configure(
            "Dark.TButton", background=BG_HEAD, foreground=FG, borderwidth=0, padding=(8, 4)
        )
        style.map(
            "Dark.TButton",
            background=[("active", BG_HOVER), ("pressed", BG_ALT)],
            foreground=[("disabled", "#777777")],
        )
        style.configure(
            "TCombobox", fieldbackground=BG_ALT, background=BG_HEAD, foreground=FG,
            arrowcolor=FG, borderwidth=0,
        )
        style.map("TCombobox", fieldbackground=[("readonly", BG_ALT)])
        style.configure(
            "Vertical.TScrollbar", background=BG_HEAD, troughcolor=BG, borderwidth=0,
            arrowcolor=FG,
        )

        for option, value in (
            ("background", BG_ALT),
            ("foreground", FG),
            ("selectBackground", ACCENT),
            ("selectForeground", "white"),
        ):
            self.root.option_add(f"*TCombobox*Listbox.{option}", value)

    def _build_form(self) -> None:
        form = tk.Frame(self.root, bg=BG)
        form.pack(fill="x", padx=8, pady=6)

        self.name_entry = self._form_combo(form, self.tr("Nome", "Name"), 0, width=15)
        self.mappa_entry = self._form_combo(form, self.tr("Mappa", "Map"), 1, width=14)
        self.category_entry = self._form_combo(
            form, self.tr("Categoria", "Category"), 2, width=11
        )
        self.start_entry = self._form_entry(form, self.tr("Ora", "Time"), 3, width=9)
        self.min_entry = self._form_entry(form, "Min", 4, width=7, default="60")
        self.max_entry = self._form_entry(form, "Max", 5, width=7)

        ttk.Button(
            form, text=self.tr("Aggiungi", "Add"), style="Dark.TButton", command=self.add_timer
        ).grid(row=1, column=6, padx=(8, 2))

        hints = (
            self.tr(
                "Ora: quando è morto il MVP o hai finito la quest, come 23:50 o 23:50:30. "
                "Vuota vale adesso.",
                "Time: when the MVP died or you finished the quest, like 23:50 or 23:50:30. "
                "Empty means now.",
            ),
            self.tr(
                "Min e Max: minuti che mancano al respawn, oppure 1h30 e 3:10. "
                "Lascia vuoto Max per un conto alla rovescia fisso.",
                "Min and Max: minutes until the respawn, or 1h30 and 3:10. "
                "Leave Max empty for a fixed countdown.",
            ),
            self.tr(
                "Bip: quante volte suona l'allarme di quel timer, una ogni 15 secondi, "
                "finché non selezioni la riga. Vuoto vale 1.",
                "Beeps: how many times that timer's alarm rings, once every 15 seconds, "
                "until you select the row. Empty means 1.",
            ),
        )
        for offset, text in enumerate(hints):
            tk.Label(
                form, text=text, bg=BG, fg=FG_MUTED, justify="left", anchor="w",
                wraplength=HINT_WRAP,
            ).grid(row=2 + offset, column=0, columnspan=7, sticky="w", padx=2,
                   pady=(4 if offset == 0 else 0, 0))

        self.name_entry.bind("<<ComboboxSelected>>", self._apply_preset)
        self.name_entry.bind("<FocusOut>", self._apply_preset, add="+")
        for widget in (
            self.name_entry, self.mappa_entry, self.category_entry,
            self.min_entry, self.max_entry, self.start_entry,
        ):
            widget.bind("<Return>", lambda _e: self.add_timer())

    def _build_tree(self) -> None:
        frame = tk.Frame(self.root, bg=BG)
        frame.pack(fill="both", expand=True, padx=8, pady=4)
        frame.rowconfigure(0, weight=1)
        frame.columnconfigure(0, weight=1)

        self.tree = ttk.Treeview(frame, columns=COLUMNS, show="tree headings", height=12)
        for column, ((italian, english), width, anchor) in HEADINGS.items():
            self.tree.heading(column, text=self.tr(italian, english))
            self.tree.column(column, width=width, anchor=anchor, stretch=(column == "name"))
        self.tree.grid(row=0, column=0, sticky="nsew")

        scrollbar = ttk.Scrollbar(
            frame, orient="vertical", command=self.tree.yview, style="Vertical.TScrollbar"
        )
        scrollbar.grid(row=0, column=1, sticky="ns")
        self.tree.configure(yscrollcommand=scrollbar.set)

        self.tree.tag_configure(TAG_CLOSED, foreground=COLOR_CLOSED)
        self.tree.tag_configure(TAG_OPEN, foreground=COLOR_OPEN)
        self.tree.bind("<Button-1>", self._on_click)
        self.tree.bind("<Double-1>", self._on_double_click)
        self.tree.bind("<<TreeviewSelect>>", self._on_select)
        self.tree.bind("<Delete>", lambda _e: self.remove_selected())

    def _build_buttons(self) -> None:
        frame = tk.Frame(self.root, bg=BG)
        frame.pack(fill="x", padx=8, pady=4)
        for text, command in (
            (self.tr("+1 (duplica da adesso)", "+1 (duplicate from now)"),
             self.duplicate_selected),
            (self.tr("Riparti da adesso", "Restart from now"), self.refresh_selected),
            (self.tr("Rimuovi", "Remove"), self.remove_selected),
            (self.tr("Togli gli scaduti", "Clear expired"), self.purge_expired),
            (self.tr("Annulla (Ctrl+Z)", "Undo (Ctrl+Z)"), self.undo_last),
        ):
            ttk.Button(frame, text=text, style="Dark.TButton", command=command).pack(
                side="left", padx=2
            )

    def _build_footer(self) -> None:
        frame = tk.Frame(self.root, bg=BG)
        frame.pack(fill="x", padx=8, pady=(4, 0))
        self.volume_var = tk.IntVar(value=self.store.settings.volume)
        tk.Label(
            frame, text=self.tr("Volume dell'allarme:", "Alarm volume:"), bg=BG, fg=FG
        ).pack(side="left")
        tk.Label(
            frame, textvariable=self.volume_var, width=3, anchor="w", bg=BG, fg=FG
        ).pack(side="left")

        # Senza showvalue: il numero sopra il cursore spostava la barra piu' in
        # basso della scritta e dei pulsanti. Il valore sta nell'etichetta accanto.
        scale = tk.Scale(
            frame, from_=0, to=100, orient="horizontal", variable=self.volume_var,
            showvalue=False, bg=BG, troughcolor=BG_HEAD, highlightthickness=0,
            activebackground=ACCENT,
        )
        scale.pack(side="left", fill="x", expand=True, padx=(4, 6))
        scale.bind("<ButtonRelease-1>", lambda _e: self._save())

        for text, command in (
            (self.tr("Prova", "Test"), lambda: play_beep(self.volume_var.get())),
            (self.tr("Backup dei dati", "Data backup"), self.export_backup),
            (self.tr("Ripristina da backup", "Restore from backup"), self.restore_backup),
        ):
            ttk.Button(frame, text=text, style="Dark.TButton", command=command).pack(
                side="left", padx=2
            )

        self.status_label = tk.Label(self.root, text="", bg=BG, fg=FG_MUTED, anchor="w")
        self.status_label.pack(fill="x", padx=10, pady=(2, 6))

    def _dark_checkbutton(self, parent, text, variable, command) -> tk.Checkbutton:
        return tk.Checkbutton(
            parent, text=text, variable=variable, command=command, bg=BG, fg=FG,
            selectcolor=BG_ALT, activebackground=BG, activeforeground=FG,
            highlightthickness=0,
        )

    def _form_combo(self, parent, label: str, column: int, width: int) -> AutocompleteCombobox:
        tk.Label(parent, text=label, bg=BG, fg=FG).grid(row=0, column=column, sticky="w", padx=2)
        combo = AutocompleteCombobox(parent, width=width)
        combo.grid(row=1, column=column, padx=2)
        return combo

    def _form_entry(self, parent, label: str, column: int, width: int,
                    default: str = "") -> tk.Entry:
        tk.Label(parent, text=label, bg=BG, fg=FG).grid(row=0, column=column, sticky="w", padx=2)
        entry = tk.Entry(
            parent, width=width, bg=BG_ALT, fg=FG, insertbackground=FG, relief="flat",
            highlightthickness=1, highlightbackground=BG_HEAD, highlightcolor=ACCENT,
        )
        if default:
            entry.insert(0, default)
        entry.grid(row=1, column=column, padx=2)
        return entry

    def _toggle_topmost(self) -> None:
        self.root.attributes("-topmost", self.topmost_var.get())
        self._save()

    def toggle_language(self) -> None:
        """Passa all'altra lingua e ridisegna la finestra, come il pulsante del sito."""
        settings = self.store.settings
        settings.language = "it" if settings.language == "en" else "en"
        self._save()
        self._rebuild_ui()

    def _rebuild_ui(self) -> None:
        """Ricostruisce tutti i widget, per esempio nell'altra lingua."""
        self._destroy_editor()
        for child in self.root.winfo_children():
            child.destroy()
        self.category_colors.clear()
        self.row_cells.clear()
        self.row_tags.clear()
        self.current_order = []
        self._build_ui()
        self._show_store()

    def set_status(self, message: str, error: bool = False) -> None:
        """Mostra un messaggio nella barra di stato, cancellandolo dopo qualche secondo.

        Args:
            message: Testo da mostrare.
            error: Se True il messaggio viene evidenziato in rosso.
        """
        self._status_token += 1
        token = self._status_token
        self.status_label.config(text=message, fg=COLOR_CLOSED if error else FG_MUTED)

        def clear() -> None:
            if token == self._status_token:
                self.status_label.config(text="")

        self.root.after(STATUS_CLEAR_MS, clear)

    # ------------------------------------------------------------- storico ---

    def _category_tag(self, category: str) -> str:
        """Tag Treeview del colore associato a una categoria."""
        tag = CAT_TAG_PREFIX + category
        if category not in self.category_colors:
            color = COLOR_PALETTE[len(self.category_colors) % len(COLOR_PALETTE)]
            self.category_colors[category] = color
            self.tree.tag_configure(tag, foreground=color)
        return tag

    def _refresh_history_widgets(self) -> None:
        self.name_entry.set_completion_list(self.store.history["nome"])
        self.mappa_entry.set_completion_list(self.store.history["mappa"])
        self.category_entry.set_completion_list(self.store.history["categoria"])

    def _apply_preset(self, _event: tk.Event | None = None) -> None:
        """Compila i campi vuoti del form con i valori dell'ultimo timer omonimo."""
        preset = self.store.preset_for(self.name_entry.get())
        if preset is None:
            return
        if not self.mappa_entry.get().strip():
            self.mappa_entry.set(preset.mappa)
        if not self.category_entry.get().strip():
            self.category_entry.set(preset.categoria)
        current = self.min_entry.get().strip()
        if not current or current == "60":
            self._fill(self.min_entry, format_minutes(preset.dmin))
            self._fill(
                self.max_entry,
                "" if preset.dmax == preset.dmin else format_minutes(preset.dmax),
            )

    @staticmethod
    def _fill(entry: tk.Entry, value: str) -> None:
        entry.delete(0, "end")
        if value:
            entry.insert(0, value)

    # --------------------------------------------------------------- azioni ---

    def add_timer(self) -> None:
        """Crea un timer con i valori del form, segnalando gli input non validi."""
        dmin = parse_minutes(self.min_entry.get())
        if dmin is None:
            self.set_status(
                self.tr(
                    "Min deve essere una durata positiva, come 190 o 1h30.",
                    "Min must be a positive duration, like 190 or 1h30.",
                ),
                error=True,
            )
            self.min_entry.focus_set()
            return

        max_text = self.max_entry.get().strip()
        dmax = dmin
        if max_text:
            parsed = parse_minutes(max_text)
            if parsed is None:
                self.set_status(
                    self.tr(
                        "Max non è una durata valida. Lascialo vuoto per un timer fisso.",
                        "Max is not a valid duration. Leave it empty for a fixed timer.",
                    ),
                    error=True,
                )
                self.max_entry.focus_set()
                return
            dmin, dmax = min(dmin, parsed), max(dmin, parsed)

        start_text = self.start_entry.get().strip()
        if start_text:
            parsed_time = parse_hhmm(start_text)
            if parsed_time is None:
                self.set_status(self._invalid_time_message(), error=True)
                self.start_entry.focus_set()
                return
            start = local_at(*parsed_time)
        else:
            start = now_local()

        timer = Timer(
            name=self.name_entry.get().strip() or "Timer",
            mappa=self.mappa_entry.get().strip(),
            categoria=self.category_entry.get().strip() or DEFAULT_CATEGORIES[0],
            start=start,
            dmin=timedelta(minutes=dmin),
            dmax=timedelta(minutes=dmax),
        )
        self._add_row(self.store.add(timer))

        history_changed = any(
            (
                self.store.remember("nome", timer.name),
                self.store.remember("mappa", timer.mappa),
                self.store.remember("categoria", timer.categoria),
            )
        )
        if history_changed:
            self._refresh_history_widgets()
        self.store.remember_preset(timer)
        self._save()

        window = (
            f"{format_minutes(dmin)} min"
            if timer.is_fixed
            else f"{format_minutes(dmin)}-{format_minutes(dmax)} min"
        )
        clock = start.strftime(TIME_FORMAT)
        self.set_status(
            self.tr(
                f"Aggiunto {timer.name} ({window}) dalle {clock}.",
                f"Added {timer.name} ({window}) from {clock}.",
            )
        )
        self.start_entry.delete(0, "end")

    def _invalid_time_message(self) -> str:
        return self.tr(
            "L'ora va scritta come 23:50 o 23:50:30. Lasciala vuota per partire da adesso.",
            "The time must look like 23:50 or 23:50:30. Leave it empty to start from now.",
        )

    def duplicate_selected(self) -> None:
        """Ricrea i timer selezionati facendoli partire da adesso."""
        selection = self._selection()
        if not selection:
            return
        now = now_local()
        for timer_id in selection:
            source = self.store.timers[timer_id]
            copy = Timer(
                name=source.name, mappa=source.mappa, categoria=source.categoria,
                start=now, dmin=source.dmin, dmax=source.dmax, sound=source.sound,
                beeps=source.beeps,
            )
            self._add_row(self.store.add(copy))
        self._save()
        self.set_status(
            self.tr(
                f"Timer duplicati da adesso: {len(selection)}.",
                f"Timers duplicated from now: {len(selection)}.",
            )
        )

    def refresh_selected(self) -> None:
        """Fa ripartire i timer selezionati da adesso."""
        selection = self._selection()
        if not selection:
            return
        now = now_local()
        for timer_id in selection:
            self.store.timers[timer_id].reschedule(now)
            self._render_row(timer_id, now)
        self.current_order = []
        self._save()
        self.set_status(
            self.tr(
                f"Timer ripartiti da adesso: {len(selection)}.",
                f"Timers restarted from now: {len(selection)}.",
            )
        )

    def remove_selected(self) -> None:
        """Elimina i timer selezionati, previa conferma."""
        selection = self._selection()
        if not selection:
            return
        names = [self.store.timers[tid].name for tid in selection]
        preview = ", ".join(names[:5]) + ("..." if len(names) > 5 else "")
        if not messagebox.askyesno(
            self.tr("Rimuovi", "Remove"),
            self.tr(
                f"Rimuovere i timer selezionati ({len(selection)})?\n\n{preview}\n\n"
                "Si può annullare con Ctrl+Z.",
                f"Remove the selected timers ({len(selection)})?\n\n{preview}\n\n"
                "You can undo with Ctrl+Z.",
            ),
            parent=self.root,
        ):
            return
        self._drop_rows(selection, self.store.remove(selection))
        self.set_status(
            self.tr(
                f"Timer rimossi: {len(selection)}. Ctrl+Z per annullare.",
                f"Timers removed: {len(selection)}. Ctrl+Z to undo.",
            )
        )

    def purge_expired(self) -> None:
        """Archivia i timer con la finestra chiusa da almeno un'ora."""
        now = now_local()
        stale = self.store.stale_ids(now, PURGE_MIN_AGE)
        if not stale:
            self.set_status(
                self.tr(
                    "Niente da togliere: nessuna finestra chiusa da più di un'ora.",
                    "Nothing to clear: no window closed more than an hour ago.",
                )
            )
            return
        if not messagebox.askyesno(
            self.tr("Togli gli scaduti", "Clear expired"),
            self.tr(
                f"Archiviare i timer con la finestra chiusa da più di un'ora ({len(stale)})?"
                "\n\nSi può annullare con Ctrl+Z.",
                f"Archive the timers whose window closed more than an hour ago ({len(stale)})?"
                "\n\nYou can undo with Ctrl+Z.",
            ),
            parent=self.root,
        ):
            return
        self._drop_rows(stale, self.store.archive_ids(stale, now))
        self.set_status(
            self.tr(
                f"Timer archiviati: {len(stale)}. Ctrl+Z per annullare.",
                f"Timers archived: {len(stale)}. Ctrl+Z to undo.",
            )
        )

    def undo_last(self) -> None:
        """Ripristina l'ultimo gruppo di timer rimossi o archiviati."""
        if not self.undo_stack:
            self.set_status(self.tr("Niente da annullare.", "Nothing to undo."))
            return
        payloads = self.undo_stack.pop()
        for timer_id in self.store.restore(payloads):
            self._add_row(timer_id)
        self._save()
        self.set_status(
            self.tr(f"Timer ripristinati: {len(payloads)}.", f"Timers restored: {len(payloads)}.")
        )

    def export_backup(self) -> None:
        """Salva il backup dei dati in un file scelto dall'utente."""
        target = filedialog.asksaveasfilename(
            parent=self.root,
            title=self.tr("Backup dei dati", "Data backup"),
            # Non ragnarok_timers.json: accanto all'exe sostituirebbe il file dati.
            initialfile="ragnarok_timers_backup.json",
            defaultextension=".json",
            filetypes=[("JSON", "*.json")],
        )
        if not target:
            return
        self._collect_settings()
        if self.store.export_to(Path(target)):
            self.set_status(
                self.tr(f"Backup salvato: {Path(target).name}.",
                        f"Backup saved: {Path(target).name}.")
            )
        else:
            self.set_status(
                self.tr("Backup non riuscito, vedi il log.", "Backup failed, see the log."),
                error=True,
            )

    def restore_backup(self) -> None:
        """Sostituisce i dati con quelli di un backup, del desktop o del web."""
        source = filedialog.askopenfilename(
            parent=self.root,
            title=self.tr("Ripristina da backup", "Restore from backup"),
            filetypes=[("JSON", "*.json")],
        )
        if not source:
            return
        if not messagebox.askyesno(
            self.tr("Ripristina da backup", "Restore from backup"),
            self.tr(
                "I timer di adesso vengono sostituiti da quelli del backup. Continuare?",
                "The current timers are replaced by those in the backup. Continue?",
            ),
            parent=self.root,
        ):
            return
        self._collect_settings()
        restored = self.store.restore_backup(Path(source))
        if restored is None:
            self.set_status(
                self.tr("Quel file non è un backup dei timer.", "That file is not a timers backup."),
                error=True,
            )
            return
        self.store = restored
        self.undo_stack.clear()
        # Prima i widget, poi il salvataggio: _save rilegge il volume dal cursore.
        self._rebuild_ui()
        self._save()
        self.set_status(
            self.tr(
                f"Timer ripristinati dal backup: {len(self.store.timers)}.",
                f"Timers restored from backup: {len(self.store.timers)}.",
            )
        )

    def _selection(self) -> list[str]:
        selection = [tid for tid in self.tree.selection() if tid in self.store.timers]
        if not selection:
            self.set_status(self.tr("Seleziona prima un timer.", "Select a timer first."),
                            error=True)
        return selection

    def _drop_rows(self, timer_ids: list[str], payloads: list[dict]) -> None:
        """Rimuove le righe dalla tabella e registra l'operazione per l'annullamento."""
        self._close_editor_on(timer_ids)
        for timer_id in timer_ids:
            self.tree.delete(timer_id)
            self.row_cells.pop(timer_id, None)
            self.row_tags.pop(timer_id, None)
        if payloads:
            self.undo_stack.append(payloads)
            del self.undo_stack[:-MAX_UNDO]
        self.current_order = []
        self._save()

    def _on_select(self, _event: tk.Event | None = None) -> None:
        # Selezionare una riga vale come "l'ho visto" e ferma la ripetizione.
        acknowledged = [
            self.store.timers[tid].acknowledge()
            for tid in self.tree.selection()
            if tid in self.store.timers
        ]
        if any(acknowledged):
            self._save()

    # ------------------------------------------------------------- tabella ---

    def _add_row(self, timer_id: str) -> None:
        self.tree.insert("", "end", iid=timer_id, text="", values=("",) * len(COLUMNS))
        self._render_row(timer_id, now_local())
        self.current_order = []

    def _row_values(self, timer: Timer, now) -> tuple[str, tuple[str, ...], TimerState]:
        """Testo della colonna Sound, valori delle altre colonne e stato."""
        state = timer.state(now)
        if state is TimerState.CLOSED:
            elapsed = -timer.countdown(now)
            left = (
                NO_TIME
                if elapsed > LEFT_HIDE_AFTER.total_seconds()
                else "-" + format_duration(elapsed)
            )
        else:
            left = format_duration(timer.countdown(now))

        values = (
            str(timer.beeps),
            timer.name,
            timer.mappa,
            timer.categoria,
            timer.start.strftime("%H:%M"),
            timer.open_at.strftime("%H:%M"),
            NO_TIME if timer.is_fixed else timer.close_at.strftime("%H:%M"),
            left,
        )
        return (SOUND_ON if timer.sound else SOUND_OFF), values, state

    def _render_row(self, timer_id: str, now) -> TimerState:
        """Aggiorna una riga solo se il contenuto o il colore sono cambiati."""
        timer = self.store.timers[timer_id]
        sound, values, state = self._row_values(timer, now)
        if self.row_cells.get(timer_id) != (sound,) + values:
            self.row_cells[timer_id] = (sound,) + values
            self.tree.item(timer_id, text=sound, values=values)

        if state is TimerState.OPEN:
            tag = TAG_OPEN
        elif state is TimerState.CLOSED:
            tag = TAG_CLOSED
        else:
            tag = self._category_tag(timer.categoria)
        if self.row_tags.get(timer_id) != tag:
            self.row_tags[timer_id] = tag
            self.tree.item(timer_id, tags=(tag,))
        return state

    # ------------------------------------------------------- modifica riga ---

    def _on_click(self, event: tk.Event) -> None:
        """Attiva o disattiva il suono cliccando la casella nella colonna Sound."""
        if self.tree.identify_region(event.x, event.y) != "tree":
            return
        row_id = self.tree.identify_row(event.y)
        if row_id not in self.store.timers:
            return
        timer = self.store.timers[row_id]
        timer.sound = not timer.sound
        if not timer.sound:
            # Togliere la spunta zittisce anche un allarme gia' in corso.
            timer.acknowledge()
        self._render_row(row_id, now_local())
        self._save()

    def _on_double_click(self, event: tk.Event) -> None:
        if self.tree.identify_region(event.x, event.y) not in ("cell", "tree"):
            return
        row_id = self.tree.identify_row(event.y)
        column = self.tree.identify_column(event.x)
        field = EDITABLE_COLUMNS.get(column)
        if not row_id or row_id not in self.store.timers or field is None:
            return
        bbox = self.tree.bbox(row_id, column)
        if not bbox:
            return

        if field in ("mappa", "categoria"):
            self.edit_combo(row_id, field, bbox)
        else:
            self.edit_entry(row_id, field, bbox)

    def _destroy_editor(self) -> None:
        editor, self.editor, self.editor_row = self.editor, None, None
        if editor is not None:
            editor.destroy()

    def _close_editor_on(self, timer_ids: list[str]) -> None:
        if self.editor_row in set(timer_ids):
            self._destroy_editor()

    def _current_text(self, timer: Timer, field: str) -> str:
        if field == "beeps":
            return str(timer.beeps)
        if field == "name":
            return timer.name
        if field == "orario":
            return timer.start.strftime(TIME_FORMAT)
        if field == "dmin":
            return format_minutes(timer.dmin.total_seconds() / 60)
        return "" if timer.is_fixed else format_minutes(timer.dmax.total_seconds() / 60)

    def edit_entry(self, row_id: str, field: str, bbox: tuple[int, int, int, int]) -> tk.Entry:
        """Apre un campo di testo sopra una cella.

        Args:
            row_id: Identificatore del timer.
            field: Campo modificato: "beeps", "name", "orario", "dmin" o "dmax".
            bbox: Rettangolo della cella restituito dal Treeview.

        Returns:
            Il widget di modifica creato.
        """
        self._destroy_editor()
        entry = tk.Entry(
            self.tree, bg=BG_ALT, fg=FG, insertbackground=FG, relief="solid", borderwidth=1
        )
        entry.insert(0, self._current_text(self.store.timers[row_id], field))
        entry.select_range(0, "end")
        entry.place(x=bbox[0], y=bbox[1], width=bbox[2], height=bbox[3])
        entry.focus_set()
        self.editor, self.editor_row = entry, row_id

        done = {"value": False}

        def commit(_event: tk.Event | None = None) -> None:
            # Return distrugge il widget, e la distruzione genera a sua volta un
            # evento di uscita dal campo: senza questa guardia il secondo commit
            # leggerebbe un widget gia' morto.
            if done["value"]:
                return
            done["value"] = True
            text = entry.get().strip()
            self._destroy_editor()
            if row_id in self.store.timers:
                self.commit_field(row_id, field, text)

        def cancel(_event: tk.Event | None = None) -> None:
            if done["value"]:
                return
            done["value"] = True
            self._destroy_editor()

        entry.bind("<Return>", commit)
        entry.bind("<FocusOut>", commit)
        entry.bind("<Escape>", cancel)
        return entry

    def edit_combo(self, row_id: str, field: str,
                   bbox: tuple[int, int, int, int]) -> AutocompleteCombobox:
        """Apre una combobox con storico sopra una cella.

        Args:
            row_id: Identificatore del timer.
            field: Campo modificato: "mappa" o "categoria".
            bbox: Rettangolo della cella restituito dal Treeview.

        Returns:
            Il widget di modifica creato.
        """
        self._destroy_editor()
        history_key = "mappa" if field == "mappa" else "categoria"
        combo = AutocompleteCombobox(self.tree, completion_values=self.store.history[history_key])
        combo.set(getattr(self.store.timers[row_id], field))
        combo.place(x=bbox[0], y=bbox[1], width=bbox[2], height=bbox[3])
        combo.focus_set()
        self.editor, self.editor_row = combo, row_id

        done = {"value": False}

        def commit(_event: tk.Event | None = None) -> None:
            if done["value"]:
                return
            done["value"] = True
            value = combo.get().strip()
            self._destroy_editor()
            if not value or row_id not in self.store.timers:
                return
            timer = self.store.timers[row_id]
            setattr(timer, field, value)
            if self.store.remember(history_key, value):
                self._refresh_history_widgets()
            self._render_row(row_id, now_local())
            self._save()

        def commit_on_focus_out(_event: tk.Event | None = None) -> None:
            if not combo.popdown_visible():
                commit()

        def cancel(_event: tk.Event | None = None) -> None:
            if done["value"]:
                return
            done["value"] = True
            self._destroy_editor()

        combo.bind("<Return>", commit)
        combo.bind("<<ComboboxSelected>>", commit)
        combo.bind("<FocusOut>", commit_on_focus_out)
        combo.bind("<Escape>", cancel)
        return combo

    def commit_field(self, row_id: str, field: str, text: str) -> None:
        """Applica una modifica fatta con l'editor inline.

        Args:
            row_id: Identificatore del timer.
            field: Campo modificato.
            text: Testo inserito dall'utente.
        """
        timer = self.store.timers[row_id]
        if field == "beeps":
            timer.beeps = parse_beeps(text)
        elif field == "name":
            if not text:
                return
            timer.name = text
            if self.store.remember("nome", text):
                self._refresh_history_widgets()
        elif field == "orario":
            # Ora non toccata: resta l'istante esatto. Rileggerla dal campo
            # perderebbe i decimali e il giorno, e la differenza riarmerebbe l'allarme.
            if text == timer.start.strftime(TIME_FORMAT):
                return
            parsed = parse_hhmm(text)
            if parsed is None:
                self.set_status(self._invalid_time_message(), error=True)
                return
            timer.reschedule(local_at(*parsed))
        else:
            if field == "dmax" and not text:
                minutes = timer.dmin.total_seconds() / 60
            else:
                parsed_minutes = parse_minutes(text)
                if parsed_minutes is None:
                    self.set_status(
                        self.tr(
                            "Durata non valida: scrivi i minuti, come 190, 1h30 o 3:10.",
                            "Invalid duration: write the minutes, like 190, 1h30 or 3:10.",
                        ),
                        error=True,
                    )
                    return
                minutes = parsed_minutes
            duration = timedelta(minutes=minutes)
            if field == "dmin":
                timer.set_window(duration, timer.dmax)
            else:
                timer.set_window(timer.dmin, duration)

        self._render_row(row_id, now_local())
        self.current_order = []
        self._save()

    # ----------------------------------------------------------- countdown ---

    def _update_loop(self) -> None:
        try:
            self.tick()
        except Exception:
            # La riprogrammazione avviene comunque: se saltasse, tutti i
            # countdown si fermerebbero in silenzio.
            log.exception("Errore durante l'aggiornamento dei timer")
            self.set_status(
                self.tr("Errore nell'aggiornamento, vedi il log.", "Update error, see the log."),
                error=True,
            )
        finally:
            self._after_id = self.root.after(TICK_MS, self._update_loop)

    def tick(self) -> None:
        """Aggiorna orologio, righe, allarmi e ordinamento."""
        now = now_local()
        self.clock_label.config(text=now.strftime(TIME_FORMAT))
        dirty = False
        alerting = False

        for timer_id, timer in list(self.store.timers.items()):
            self._render_row(timer_id, now)
            # Quante volte suonare lo dice la colonna Bip del timer.
            if timer.alert_due(now, timer.beeps):
                timer.register_alert(now, self.store.settings.alert_repeat_seconds)
                alerting = True
                dirty = True
            elif (
                not timer.acked
                and timer.state(now) is not TimerState.PENDING
                and timer.alerts_sent >= timer.beeps
            ):
                timer.acknowledge()
                dirty = True

        if alerting:
            play_beep(self.volume_var.get())
            flash_taskbar(self.root.winfo_id())

        order = sorted(
            self.store.timers, key=lambda tid: (self.store.timers[tid].sort_key(now), tid)
        )
        # Si riordina solo a ordine effettivamente cambiato, e mai con un editor
        # aperto: la riga scivolerebbe sotto un widget fermo a coordinate fisse.
        if order != self.current_order and self.editor is None:
            for index, timer_id in enumerate(order):
                self.tree.move(timer_id, "", index)
            self.current_order = order

        if dirty:
            self._save()

    # --------------------------------------------------------- persistenza ---

    def _collect_settings(self) -> None:
        try:
            self.store.settings.volume = self.volume_var.get()
            self.store.settings.topmost = bool(self.topmost_var.get())
            self.store.settings.geometry = self.root.geometry()
        except tk.TclError:
            log.warning("Impostazioni non leggibili, finestra gia' chiusa")

    def _save(self) -> None:
        self._collect_settings()
        if not self.store.save():
            self.set_status(
                self.tr("Salvataggio non riuscito, vedi il log.", "Save failed, see the log."),
                error=True,
            )

    def _show_store(self) -> None:
        """Riempie tabella, storico e impostazioni con il contenuto dello store."""
        for timer_id in self.store.timers:
            self._add_row(timer_id)
        self._refresh_history_widgets()
        settings = self.store.settings
        self.volume_var.set(settings.volume)
        self.topmost_var.set(settings.topmost)
        self.root.attributes("-topmost", settings.topmost)

    def _apply_geometry(self) -> None:
        settings = self.store.settings
        if not settings.geometry:
            return
        if not geometry_is_reachable(settings.geometry, self._screen_bounds()):
            # Monitor scollegato o risoluzione cambiata: riaprire la finestra
            # dove era salvata la renderebbe invisibile.
            log.warning("Geometria salvata fuori schermo, ignorata: %s", settings.geometry)
            settings.geometry = ""
            return
        try:
            self.root.geometry(settings.geometry)
        except tk.TclError:
            log.warning("Geometria non applicabile: %s", settings.geometry)

    def _screen_bounds(self) -> tuple[int, int, int, int]:
        """Rettangolo del desktop disponibile, monitor multipli inclusi."""
        bounds = virtual_screen_bounds()
        if bounds is not None:
            return bounds
        return (
            self.root.winfo_vrootx(),
            self.root.winfo_vrooty(),
            self.root.winfo_vrootwidth(),
            self.root.winfo_vrootheight(),
        )

    def close(self) -> None:
        """Ferma il countdown, salva e chiude la finestra."""
        if self._after_id is not None:
            try:
                self.root.after_cancel(self._after_id)
            except tk.TclError:
                pass
            self._after_id = None
        self._destroy_editor()
        self._save()
        self.root.destroy()


def main() -> None:
    """Avvia l'applicazione."""
    setup_logging()
    log.info("%s %s", APP_NAME, __version__)
    root = tk.Tk()
    TimerApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
