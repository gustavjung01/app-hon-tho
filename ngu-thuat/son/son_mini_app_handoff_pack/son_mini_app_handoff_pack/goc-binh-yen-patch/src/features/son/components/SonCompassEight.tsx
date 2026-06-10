import type { SonDirection, SonDirectionSector } from "../types";

function sectorClass(quality: SonDirectionSector["quality"], isSelected: boolean) {
  const base = quality === "priority"
    ? "border-[#8fae76]/45 bg-[#283f32]/78"
    : "border-[#c28a58]/45 bg-[#4a2b1e]/78";
  return [base, isSelected ? "ring-2 ring-[#f0cf80] shadow-[0_0_28px_rgba(218,168,72,0.22)]" : ""].join(" ");
}

export function SonCompassEight({ sectors, selectedDirection }: { sectors: SonDirectionSector[]; selectedDirection: SonDirection }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <div className="relative mx-auto grid h-[320px] w-[320px] place-items-center rounded-full border border-[#d7b987]/35 bg-[#111711]/68 shadow-[inset_0_0_40px_rgba(0,0,0,0.28)]">
        <div className="absolute inset-7 rounded-full border border-[#d7b987]/25" />
        <div className="absolute inset-16 rounded-full border border-[#d7b987]/18" />
        <div className="absolute h-px w-[86%] bg-[#d7b987]/25" />
        <div className="absolute h-[86%] w-px bg-[#d7b987]/25" />
        <div className="absolute h-px w-[76%] rotate-45 bg-[#d7b987]/18" />
        <div className="absolute h-px w-[76%] -rotate-45 bg-[#d7b987]/18" />
        <div className="grid h-28 w-28 place-items-center rounded-full border border-[#f0cf80]/40 bg-[#2c2115] text-center shadow-[0_0_30px_rgba(218,168,72,0.16)]">
          <span className="block text-xs uppercase tracking-[0.22em] text-[#cdbb91]">Sơn</span>
          <span className="block text-4xl text-[#f0cf80]">山</span>
          <span className="block text-xs text-[#d7c7a0]">8 hướng</span>
        </div>
        {sectors.map((sector, index) => {
          const angle = index * 45 - 90;
          const transform = `rotate(${angle}deg) translate(130px) rotate(${-angle}deg)`;
          return (
            <div
              key={sector.direction}
              className="absolute grid h-16 w-16 place-items-center rounded-full border border-[#d7b987]/30 bg-[#f5ead5]/10 text-center text-[10px] font-semibold leading-tight text-[#f5ead5]"
              style={{ transform }}
            >
              <span>{sector.direction}</span>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {sectors.map((sector) => (
          <article key={sector.direction} className={`rounded-[1.25rem] border p-4 ${sectorClass(sector.quality, sector.direction === selectedDirection)}`}>
            <p className="text-xs uppercase tracking-[0.22em] text-[#cdbb91]">{sector.direction}</p>
            <h3 className="mt-2 text-xl font-semibold text-[#f8e6c4]">{sector.starName}</h3>
            <p className="mt-2 text-sm leading-6 text-[#d2c19a]">{sector.plainMeaning}</p>
            <p className="mt-3 rounded-xl border border-[#f4dfb7]/15 bg-black/14 p-3 text-xs leading-5 text-[#ead6aa]">{sector.suggestion}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
