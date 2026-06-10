import type { ReactNode } from "react";
import type { SonTone } from "../types";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function toneClass(tone: SonTone, active?: boolean) {
  const map: Record<SonTone, string> = {
    earth: "from-[#f0dfc1] via-[#c99b5c] to-[#6b3e22] text-[#241710] border-[#d5ac70]",
    jade: "from-[#2e4638] via-[#547259] to-[#19241e] text-[#f6e9d0] border-[#718b67]",
    gold: "from-[#b68136] via-[#e0bc6f] to-[#74431c] text-[#26170d] border-[#ecc77a]",
    ink: "from-[#1c2524] via-[#384a48] to-[#101514] text-[#f4e4c9] border-[#687978]",
    clay: "from-[#7b3924] via-[#a55834] to-[#3a1d14] text-[#f7e6cf] border-[#b56a43]",
    mist: "from-[#dfd2bc] via-[#bca988] to-[#726049] text-[#251a12] border-[#d4bf94]",
  };

  return cx(map[tone], active && "ring-2 ring-[#f0cf80]/70 shadow-[0_0_32px_rgba(218,168,72,0.25)]");
}

export function SonActionButton({
  title,
  subtitle,
  icon,
  tone,
  active,
  onClick,
}: {
  title: string;
  subtitle?: string;
  icon: string;
  tone: SonTone;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "group relative min-h-[96px] overflow-hidden rounded-[1.45rem] border bg-gradient-to-br p-4 text-left shadow-[0_18px_36px_rgba(20,12,8,0.24)] transition duration-200",
        "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_18%_8%,rgba(255,243,202,0.25),transparent_31%),radial-gradient(circle_at_86%_116%,rgba(0,0,0,0.24),transparent_38%)] before:opacity-90",
        "after:absolute after:inset-[6px] after:rounded-[1.1rem] after:border after:border-white/10 after:content-['']",
        "hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(20,12,8,0.32)] active:translate-y-[2px] active:shadow-inner",
        toneClass(tone, active)
      )}
    >
      <span className="relative z-10 flex items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 bg-black/18 text-2xl shadow-inner transition group-hover:scale-105">
          {icon}
        </span>
        <span>
          <span className="block text-lg font-semibold tracking-wide">{title}</span>
          {subtitle ? <span className="mt-1 block text-sm opacity-85">{subtitle}</span> : null}
        </span>
      </span>
      <span className="absolute bottom-2 left-5 right-5 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </button>
  );
}

export function SonChip({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={cx(
        "rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
        active
          ? "border-[#f0cf80]/60 bg-[#f0cf80]/18 text-[#ffe8b4]"
          : "border-[#d7b987]/35 bg-[#fff4db]/8 text-[#ead6aa]"
      )}
    >
      {children}
    </span>
  );
}
