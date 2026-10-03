#!/usr/bin/env python3
"""Interfaccia tkinter del Timer Ragnarok.

Sorveglia le finestre di respawn di MvP e quest: la riga resta neutra finche'
la finestra non si apre, diventa gialla mentre e' aperta e rossa quando si e'
chiusa. Tutta la logica non grafica sta in timers_core.
"""

from __future__ import annotations

import logging
import tkinter as tk
from datetime import timedelta
from tkinter import messagebox, ttk

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
    parse_hhmm,
    parse_minutes,
    play_beep,
    setup_logging,
    virtual_screen_bounds,
)

log = logging.getLogger(__name__)

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

COLUMNS = ("name", "map", "category", "time", "spawn", "maxspawn", "left")
HEADINGS = {
    "#0": ("Sound", 55, "center"),
    "name": ("Name", 130, "w"),
    "map": ("Map", 100, "center"),
    "category": ("Category", 85, "center"),
    "time": ("Time", 60, "center"),
    "spawn": ("Spawn", 65, "center"),
    "maxspawn": ("Max. Spawn", 85, "center"),
    "left": ("Left", 90, "center"),
}
# Colonna del Treeview -> campo modificabile con doppio clic.
EDITABLE_COLUMNS = {
    "#1": "name",
    "#2": "mappa",
    "#3": "categoria",
    "#4": "orario",
    "#5": "dmin",
    "#6": "dmax",
}
# Caselle della colonna Sound: BALLOT BOX WITH CHECK e BALLOT BOX. Sono simboli
# Unicode e non emoji, quindi restano monocromatici: aggiungere il selettore di
# variante U+FE0F li trasformerebbe in emoji a colori. Scritti come escape per
# tenere il sorgente in ASCII.
SOUND_ON = "\u2611"
SOUND_OFF = "\u2610"
NO_TIME = "-"


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

        root.title(f"Timer Ragnarok {__version__}")
        root.geometry("820x560")
        root.minsize(700, 420)
        root.configure(bg=BG)

        self._build_ui()
        self._load()
        root.protocol("WM_DELETE_WINDOW", self.close)
        self._update_loop()

    # ------------------------------------------------------------ interfaccia

    def _build_ui(self) -> None:
        self._configure_style()

        top = tk.Frame(self.root, bg=BG)
        top.pack(fill="x", padx=8, pady=(6, 0))
        self.topmost_var = tk.BooleanVar(value=False)
        self._dark_checkbutton(
            top, "Always on top", self.topmost_var, self._toggle_topmost
        ).pack(side="left")
        tk.Label(
            top, text="Double-click a cell to edit it", bg=BG, fg=FG_MUTED
        ).pack(side="right")

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

        self.name_entry = self._form_combo(form, "Name", 0, width=15)
        self.mappa_entry = self._form_combo(form, "Map", 1, width=14)
        self.category_entry = self._form_combo(form, "Category", 2, width=11)
        self.start_entry = self._form_entry(form, "Time (HH:MM)", 3, width=9)
        self.min_entry = self._form_entry(form, "Min", 4, width=7, default="60")
        self.max_entry = self._form_entry(form, "Max", 5, width=7)

        ttk.Button(
            form, text="Add", style="Dark.TButton", command=self.add_timer
        ).grid(row=1, column=6, padx=(8, 2))

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
        for column, (text, width, anchor) in HEADINGS.items():
            self.tree.heading(column, text=text)
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
            ("+1 (duplicate)", self.duplicate_selected),
            ("Refresh", self.refresh_selected),
            ("Remove", self.remove_selected),
            ("Clear expired", self.purge_expired),
            ("Undo (Ctrl+Z)", self.undo_last),
        ):
            ttk.Button(frame, text=text, style="Dark.TButton", command=command).pack(
                side="left", padx=2
            )

    def _build_footer(self) -> None:
        frame = tk.Frame(self.root, bg=BG)
        frame.pack(fill="x", padx=8, pady=(4, 0))
        tk.Label(frame, text="Beep volume", bg=BG, fg=FG).pack(side="left")

        self.volume_var = tk.IntVar(value=self.store.settings.volume)
        scale = tk.Scale(
            frame, from_=0, to=100, orient="horizontal", variable=self.volume_var,
            bg=BG, fg=FG, troughcolor=BG_HEAD, highlightthickness=0, activebackground=ACCENT,
        )
        scale.pack(side="left", fill="x", expand=True)
        scale.bind("<ButtonRelease-1>", lambda _e: self._save())

        self.repeat_var = tk.BooleanVar(value=self.store.settings.repeat_alert)
        self._dark_checkbutton(frame, "Repeat alert", self.repeat_var, self._save).pack(
            side="left", padx=(8, 0)
        )
        ttk.Button(
            frame, text="Test", style="Dark.TButton",
            command=lambda: play_beep(self.volume_var.get()),
        ).pack(side="left", padx=4)

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
                "Invalid Min: enter a number of minutes (e.g. 190, 1h30, 3:10).",
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
                    "Invalid Max: leave it empty for a fixed timer.", error=True
                )
                self.max_entry.focus_set()
                return
            dmin, dmax = min(dmin, parsed), max(dmin, parsed)

        start_text = self.start_entry.get().strip()
        if start_text:
            parsed_time = parse_hhmm(start_text)
            if parsed_time is None:
                self.set_status(
                    "Invalid Time: expected format HH:MM (e.g. 23:50).", error=True
                )
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
        self.set_status(f"Added {timer.name} ({window}) from {start.strftime('%H:%M')}.")
        self.start_entry.delete(0, "end")

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
            )
            self._add_row(self.store.add(copy))
        self._save()
        self.set_status(f"Duplicated {len(selection)} timers from now.")

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
        self.set_status(f"Restarted {len(selection)} timers.")

    def remove_selected(self) -> None:
        """Elimina i timer selezionati, previa conferma."""
        selection = self._selection()
        if not selection:
            return
        names = [self.store.timers[tid].name for tid in selection]
        preview = ", ".join(names[:5]) + ("..." if len(names) > 5 else "")
        if not messagebox.askyesno(
            "Remove timers",
            f"Remove {len(selection)} timers?\n\n{preview}\n\nYou can undo with Ctrl+Z.",
            parent=self.root,
        ):
            return
        self._drop_rows(selection, self.store.remove(selection))
        self.set_status(f"Removed {len(selection)} timers. Ctrl+Z to undo.")

    def purge_expired(self) -> None:
        """Archivia i timer con la finestra chiusa da almeno un'ora."""
        now = now_local()
        stale = self.store.stale_ids(now, PURGE_MIN_AGE)
        if not stale:
            self.set_status("No expired timers to clear.")
            return
        if not messagebox.askyesno(
            "Clear expired",
            f"Archive {len(stale)} timers whose window is already closed?\n\n"
            "You can undo with Ctrl+Z.",
            parent=self.root,
        ):
            return
        self._drop_rows(stale, self.store.archive_ids(stale, now))
        self.set_status(f"Archived {len(stale)} expired timers. Ctrl+Z to undo.")

    def undo_last(self) -> None:
        """Ripristina l'ultimo gruppo di timer rimossi o archiviati."""
        if not self.undo_stack:
            self.set_status("Nothing to undo.")
            return
        payloads = self.undo_stack.pop()
        for timer_id in self.store.restore(payloads):
            self._add_row(timer_id)
        self._save()
        self.set_status(f"Restored {len(payloads)} timers.")

    def _selection(self) -> list[str]:
        selection = [tid for tid in self.tree.selection() if tid in self.store.timers]
        if not selection:
            self.set_status("Select a timer first.", error=True)
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
        if field == "name":
            return timer.name
        if field == "orario":
            return timer.start.strftime("%H:%M")
        if field == "dmin":
            return format_minutes(timer.dmin.total_seconds() / 60)
        return "" if timer.is_fixed else format_minutes(timer.dmax.total_seconds() / 60)

    def edit_entry(self, row_id: str, field: str, bbox: tuple[int, int, int, int]) -> tk.Entry:
        """Apre un campo di testo sopra una cella.

        Args:
            row_id: Identificatore del timer.
            field: Campo modificato: "name", "orario", "dmin" o "dmax".
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
        if field == "name":
            if not text:
                return
            timer.name = text
            if self.store.remember("nome", text):
                self._refresh_history_widgets()
        elif field == "orario":
            parsed = parse_hhmm(text)
            if parsed is None:
                self.set_status("Invalid Time: use HH:MM.", error=True)
                return
            timer.reschedule(local_at(*parsed))
        else:
            if field == "dmax" and not text:
                minutes = timer.dmin.total_seconds() / 60
            else:
                parsed_minutes = parse_minutes(text)
                if parsed_minutes is None:
                    self.set_status(
                        "Invalid duration: use minutes (e.g. 190, 1h30, 3:10).", error=True
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
            self.set_status("Update error, see the log.", error=True)
        finally:
            self._after_id = self.root.after(TICK_MS, self._update_loop)

    def tick(self) -> None:
        """Aggiorna righe, allarmi e ordinamento."""
        now = now_local()
        dirty = False
        alerting = False
        max_alerts = self.store.settings.alert_max_count if self.repeat_var.get() else 1

        for timer_id, timer in list(self.store.timers.items()):
            self._render_row(timer_id, now)
            if timer.alert_due(now, max_alerts):
                timer.register_alert(now, self.store.settings.alert_repeat_seconds)
                alerting = True
                dirty = True
            elif (
                not timer.acked
                and timer.state(now) is not TimerState.PENDING
                and timer.alerts_sent >= max_alerts
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
            self.store.settings.repeat_alert = bool(self.repeat_var.get())
            self.store.settings.geometry = self.root.geometry()
        except tk.TclError:
            log.warning("Impostazioni non leggibili, finestra gia' chiusa")

    def _save(self) -> None:
        self._collect_settings()
        if not self.store.save():
            self.set_status("Save failed, see the log.", error=True)

    def _load(self) -> None:
        from_backup = self.store.load()
        for timer_id in self.store.timers:
            self._add_row(timer_id)
        self._refresh_history_widgets()
        self._apply_settings()
        if from_backup:
            self.set_status("Data file unreadable: restored from backup.", error=True)

    def _apply_settings(self) -> None:
        settings = self.store.settings
        self.volume_var.set(settings.volume)
        self.repeat_var.set(settings.repeat_alert)
        self.topmost_var.set(settings.topmost)
        self.root.attributes("-topmost", settings.topmost)
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
    log.info("Timer Ragnarok %s", __version__)
    root = tk.Tk()
    TimerApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
