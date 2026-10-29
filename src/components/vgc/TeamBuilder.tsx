"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PoolIndex } from "@/lib/vgc/pool";
import { battleForm, loadPool } from "@/lib/vgc/pool";
import { decodeTeam, encodeTeam, exportTeam, importTeam } from "@/lib/vgc/paste";
import { autoSet, validateTeam } from "@/lib/vgc/sets";
import type { Suggestion } from "@/lib/vgc/suggest";
import { suggesters } from "@/lib/vgc/suggest";
import type { PokemonSet, Team } from "@/lib/vgc/types";
import { TEAM_SIZE } from "@/lib/vgc/types";
import { Analysis } from "./Analysis";
import { SetEditor } from "./SetEditor";
import { Sidebar } from "./Sidebar";
import { SlotCard } from "./SlotCard";
import { Sprite } from "./bits";

const STORAGE_KEY = "vgc:team:v1";
const emptyTeam = (): Team => Array.from({ length: TEAM_SIZE }, () => ({ set: null, locked: false }));

const btn = "rounded bg-bg px-3 py-1.5 font-sans text-sm hover:bg-ink hover:text-bg disabled:opacity-40 disabled:hover:bg-bg disabled:hover:text-ink";
const primary = "rounded bg-accent px-3 py-1.5 font-sans text-sm text-accent-ink hover:-translate-y-0.5 transition-transform disabled:opacity-40";

export function TeamBuilder() {
  const [pool, setPool] = useState<PoolIndex | null>(null);
  const [error, setError] = useState("");
  const [team, setTeamState] = useState<Team>(emptyTeam);
  const [history, setHistory] = useState<Team[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [dialog, setDialog] = useState<"paste" | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [suggesterId, setSuggesterId] = useState(suggesters[0].id);
  const restored = useRef(false);

  useEffect(() => {
    loadPool().then(setPool, (e: Error) => setError(e.message));
  }, []);

  // Restore from a share link first, then from this browser's last session.
  useEffect(() => {
    if (!pool || restored.current) return;
    restored.current = true;
    const code = new URLSearchParams(window.location.hash.slice(1)).get("t");
    let t = code ? decodeTeam(pool, code) : null;
    if (!t)
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) t = decodeTeam(pool, saved);
      } catch {}
    if (t) setTeamState(t);
  }, [pool]);

  useEffect(() => {
    if (!pool || !restored.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, encodeTeam(team));
    } catch {}
  }, [pool, team]);

  const problems = useMemo(() => (pool ? validateTeam(pool, team) : []), [pool, team]);
  const onTeam = useMemo(() => new Set(team.flatMap((s) => (s.set && pool ? [pool.byId.get(s.set.species)!.num] : []))), [team, pool]);

  if (error)
    return (
      <p role="alert" className="rounded-md bg-surface p-4 font-sans">
        {error} Reload the page to try again.
      </p>
    );
  if (!pool) return <p className="animate-pulse rounded-md bg-surface p-8 font-sans text-muted">Loading the Reg M-B Pokémon…</p>;

  const setTeam = (next: Team | ((t: Team) => Team), say?: string) => {
    const t = typeof next === "function" ? next(team) : next;
    setHistory((h) => [...h.slice(-29), team]);
    setTeamState(t);
    if (say) setStatus(say);
  };

  const nameOf = (id: string) => pool.byId.get(id)?.name ?? id;

  const put = (i: number, id: string) => {
    const sp = pool.byId.get(id);
    if (!sp || team[i].locked) return;
    const clash = team.findIndex((s, j) => j !== i && s.set && pool.byId.get(s.set.species)?.num === sp.num);
    if (clash >= 0) return setStatus(`${sp.name} is already in slot ${clash + 1} (Species Clause).`);
    const others = team.filter((_, j) => j !== i).flatMap((s) => (s.set ? [s.set] : []));
    const taken = new Set(others.map((s) => s.item).filter(Boolean));
    const hasMega = others.some((s) => battleForm(pool.byId.get(s.species)!, s).mega);
    const set = autoSet(pool, sp, taken, !hasMega);
    setTeam((t) => t.map((s, j) => (j === i ? { set, locked: false } : s)), `Added ${sp.name} to slot ${i + 1}.`);
    setSelected(i);
  };

  const firstFree = () => {
    if (selected !== null && !team[selected].set && !team[selected].locked) return selected;
    return team.findIndex((s) => !s.set && !s.locked);
  };

  const add = (id: string) => {
    const i = firstFree();
    if (i < 0) return setStatus("The team is full. Remove or replace a Pokémon first.");
    put(i, id);
  };

  const swap = (from: number, to: number) => {
    if (from === to || team[from].locked || team[to].locked) return;
    setTeam((t) => t.map((s, j) => (j === from ? t[to] : j === to ? t[from] : s)), `Swapped slots ${from + 1} and ${to + 1}.`);
    setSelected(to);
  };

  const update = (i: number, set: PokemonSet) => setTeam((t) => t.map((s, j) => (j === i ? { ...s, set } : s)));

  const undo = () => {
    const prev = history.at(-1);
    if (!prev) return;
    setHistory((h) => h.slice(0, -1));
    setTeamState(prev);
    setStatus("Undone.");
  };

  const suggest = async () => {
    const s = suggesters.find((x) => x.id === suggesterId) ?? suggesters[0];
    setBusy(true);
    setSuggestions(null);
    try {
      const res = await s.suggest({ team, format: pool.format, count: 3, seed: Date.now() }, pool);
      setSuggestions(res);
      setStatus(`${res.length} suggestions ready.`);
    } catch (e) {
      setStatus((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#t=${encodeTeam(team)}`;
    window.history.replaceState(null, "", url);
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Share link copied.");
    } catch {
      setStatus("Share link is in the address bar.");
    }
  };

  const filled = team.filter((s) => s.set).length;
  const unlockedFilled = team.filter((s) => s.set && !s.locked).length;
  const sel = selected !== null ? team[selected] : null;

  return (
    <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <div className="order-2 lg:order-1">
        <Sidebar pool={pool} onAdd={add} onTeam={onTeam} canAdd={firstFree() >= 0} />
      </div>

      <div className="order-1 grid min-w-0 content-start gap-4 lg:order-2">
        <div className="flex flex-wrap items-center gap-2 rounded-md bg-surface p-3">
          <button type="button" className={primary} onClick={suggest} disabled={busy || team.every((s) => s.locked)}>
            {busy ? "Searching…" : filled ? "Suggest teams for unlocked slots" : "Suggest a team"}
          </button>
          {suggesters.length > 1 && (
            <select value={suggesterId} onChange={(e) => setSuggesterId(e.target.value)} aria-label="Suggestion method" className="rounded bg-bg px-2 py-1.5 font-sans text-sm">
              {suggesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          )}
          <button type="button" className={btn} onClick={undo} disabled={!history.length}>
            Undo
          </button>
          <button type="button" className={btn} onClick={() => setTeam((t) => t.map((s) => (s.locked ? s : { set: null, locked: false })), "Cleared the unlocked slots.")} disabled={!unlockedFilled}>
            Clear unlocked
          </button>
          <button type="button" className={btn} onClick={() => setTeam((t) => t.map((s) => (s.set ? { ...s, locked: !t.every((x) => !x.set || x.locked) } : s)))} disabled={!filled}>
            {team.every((s) => !s.set || s.locked) && filled ? "Unlock all" : "Lock all"}
          </button>
          <button type="button" className={btn} onClick={() => setDialog("paste")}>
            Import / export
          </button>
          <button type="button" className={btn} onClick={share} disabled={!filled}>
            Copy share link
          </button>
          <p role="status" aria-live="polite" className="ml-auto font-sans text-xs text-muted">
            {status}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {team.map((slot, i) => (
            <SlotCard
              key={i}
              pool={pool}
              index={i}
              slot={slot}
              selected={selected === i}
              hasProblem={problems.some((p) => p.slot === i)}
              onSelect={() => setSelected(selected === i ? null : i)}
              onTarget={() => setSelected(i)}
              onPut={(id) => put(i, id)}
              onSwap={(from) => swap(from, i)}
              onClear={() => {
                setTeam((t) => t.map((s, j) => (j === i ? { set: null, locked: false } : s)), `Removed ${nameOf(slot.set!.species)}.`);
                setSelected(i);
              }}
              onToggleLock={() => setTeam((t) => t.map((s, j) => (j === i ? { ...s, locked: !s.locked } : s)), `${slot.locked ? "Unlocked" : "Locked"} slot ${i + 1}.`)}
            />
          ))}
        </div>

        {suggestions && (
          <section aria-label="Suggested teams" className="rounded-md bg-surface p-4">
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <h2 className="text-lg font-medium">Suggestions</h2>
              <button type="button" className="font-sans text-xs text-muted hover:text-ink" onClick={() => setSuggestions(null)}>
                Dismiss
              </button>
            </div>
            <p className="mb-3 font-sans text-xs text-muted">
              Locked slots are kept. These come from a quick heuristic that patches shared weaknesses; the genetic search will replace it and score teams by simulated battles.
            </p>
            <ol className="grid gap-3 md:grid-cols-3">
              {suggestions.map((s, k) => (
                <li key={k} className="flex flex-col gap-2 rounded bg-bg p-3">
                  <div className="grid grid-cols-6 gap-0.5">
                    {s.team.map((slot, i) => {
                      const sp = slot.set && pool.byId.get(slot.set.species);
                      const f = sp && slot.set ? battleForm(sp, slot.set) : null;
                      return f ? (
                        <span key={i} title={f.name} className={team[i].locked ? "rounded bg-field-4/40" : ""}>
                          <Sprite sprite={f.sprite} name={f.name} size={40} />
                        </span>
                      ) : (
                        <span key={i} />
                      );
                    })}
                  </div>
                  <ul className="flex-1 font-sans text-xs text-muted">
                    {s.rationale.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={primary}
                    onClick={() => {
                      setTeam(s.team.map((slot, i) => ({ ...slot, locked: team[i].locked })), `Using suggestion ${k + 1}. Undo restores your team.`);
                      setSuggestions(null);
                    }}
                  >
                    Use this team
                  </button>
                </li>
              ))}
            </ol>
          </section>
        )}

        {sel?.set && selected !== null && <SetEditor pool={pool} set={sel.set} locked={sel.locked} slot={selected} onChange={(s) => update(selected, s)} />}

        <Analysis pool={pool} team={team} problems={problems} />
      </div>

      {dialog === "paste" && (
        <PasteDialog
          pool={pool}
          team={team}
          onClose={() => setDialog(null)}
          onImport={(sets, warnings) => {
            const locked = team.filter((s) => s.locked && s.set);
            const room = TEAM_SIZE - locked.length;
            const incoming = sets.slice(0, room).map((set) => ({ set, locked: false }));
            let n = 0;
            const next = team.map((s) => (s.locked && s.set ? s : incoming[n++] ?? { set: null, locked: false }));
            setTeam(next, `Imported ${incoming.length} Pokémon${warnings.length ? `; ${warnings.length} warning(s)` : ""}.`);
            setDialog(null);
          }}
        />
      )}
    </div>
  );
}

function PasteDialog({ pool, team, onClose, onImport }: { pool: PoolIndex; team: Team; onClose: () => void; onImport: (s: PokemonSet[], w: string[]) => void }) {
  const exported = exportTeam(pool, team);
  const [text, setText] = useState(exported);
  const [warnings, setWarnings] = useState<string[]>([]);
  // Text the player has already seen warnings for; importing it again goes ahead.
  const [warned, setWarned] = useState<string | null>(null);
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog ref={ref} onClose={onClose} className="m-auto w-[min(40rem,calc(100vw-2rem))] rounded-md bg-bg p-4 text-ink backdrop:bg-black/50">
      <h2 className="mb-1 text-xl font-medium">Import / export</h2>
      <p className="mb-2 font-sans text-xs text-muted">Showdown team format. Copy this into Showdown&apos;s teambuilder, or paste a team here and import it. Locked slots are kept on import.</p>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={16} aria-label="Team text" className="w-full rounded border border-muted/40 bg-surface p-2 font-mono text-xs" />
      {warnings.length > 0 && (
        <ul className="mt-2 font-sans text-xs text-field-1">
          {warnings.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <button type="button" className={btn} onClick={() => navigator.clipboard?.writeText(text)}>
          Copy
        </button>
        <button type="button" className={btn} onClick={onClose}>
          Close
        </button>
        <button
          type="button"
          className={primary}
          onClick={() => {
            const r = importTeam(pool, text);
            if (!r.sets.length) return setWarnings(["No Pokémon found in the text.", ...r.warnings]);
            if (r.warnings.length && warned !== text) {
              setWarned(text);
              return setWarnings([...r.warnings, "Press Import again to import anyway."]);
            }
            onImport(r.sets, r.warnings);
          }}
        >
          Import
        </button>
      </div>
    </dialog>
  );
}
