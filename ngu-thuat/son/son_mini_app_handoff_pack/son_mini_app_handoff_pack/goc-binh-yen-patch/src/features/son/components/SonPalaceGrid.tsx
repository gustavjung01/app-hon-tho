import type { SonPalaceCell } from "../types";

function severityClass(severity: SonPalaceCell["severity"]) {
  return {
    info: "border-[#8fae76]/38 bg-[#263a31]/58",
    notice: "border-[#d7b987]/30 bg-[#f5ead5]/8",
    caution: "border-[#c28a58]/45 bg-[#4a2b1e]/55",
    strong_caution: "border-[#d6ad68]/55 bg-[#5b2c1e]/72 ring-1 ring-[#d6ad68]/35",
  }[severity];
}

export function SonPalaceGrid({ grid }: { grid: SonPalaceCell[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {grid.map((cell) => (
        <article key={cell.palace} className={`min-h-[176px] rounded-[1.25rem] border p-4 ${severityClass(cell.severity)}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#cdbb91]">{cell.palace}</p>
              <h3 className="mt-2 text-2xl font-semibold text-[#f8e6c4]">{cell.annualStar}</h3>
              <p className="mt-1 text-xs text-[#cdbb91]">Vận tinh demo: {cell.baseStar}</p>
            </div>
            <span className="rounded-full border border-[#f0cf80]/35 px-3 py-1 text-xs text-[#f0cf80]">{cell.spaceUse}</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-[#d2c19a]">{cell.plainMeaning}</p>
          <p className="mt-3 rounded-xl border border-white/10 bg-black/14 p-3 text-xs leading-5 text-[#ead6aa]">{cell.suggestion}</p>
        </article>
      ))}
    </div>
  );
}
