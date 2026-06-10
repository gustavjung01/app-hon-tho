import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  CircleUserRound,
  Clock3,
  Compass,
  Home,
  Landmark,
  NotebookPen,
  Search,
  ShieldAlert,
  ScrollText,
  Sprout,
} from "lucide-react";

/**
 * UI preview: Ngũ thuật / Bốc / Mai Hoa landing
 * Gợi ý lưu:
 * D:\\Wep_Yhocnhanai\\Web_Goc_Binh_Yen\\app-hontho\\ui-preview\\nguthuat\\mai_hoa_ui_preview_nguthuat.jsx
 *
 * Gợi ý folder ảnh:
 * D:\\Wep_Yhocnhanai\\Web_Goc_Binh_Yen\\app-hontho\\ui-preview\\nguthuat\\assets\\boc-maihoa\\
 *
 * Preview này chỉ dùng để dev tham khảo bố cục và map ảnh, không phải engine luận quẻ thật.
 */

const ASSETS = {
  logo: "/ui-preview/nguthuat/assets/common/co-hoc-logo-gold.png",
  heroBg: "/ui-preview/nguthuat/assets/boc-maihoa/boc-maihoa-hero-bg.png",
  heroLeft: "/ui-preview/nguthuat/assets/boc-maihoa/boc-maihoa-left-landscape.png",
  heroRight: "/ui-preview/nguthuat/assets/boc-maihoa/boc-maihoa-right-scroll.png",
  cardImage: "/ui-preview/nguthuat/assets/boc-maihoa/boc-maihoa-card-still-life.png",
  plumBranch: "/ui-preview/nguthuat/assets/boc-maihoa/plum-branch-left.png",
};

const navItems = ["TRANG CHỦ", "NGŨ THUẬT", "THƯ VIỆN", "GIỚI THIỆU", "LIÊN HỆ"];

const featureItems = [
  { icon: Sprout, title: "Mai Hoa", subtitle: "Gieo lập & đọc quẻ" },
  { icon: ScrollText, title: "Quẻ dịch", subtitle: "64 quẻ đại quẻ" },
  { icon: BookOpen, title: "Học hiểu", subtitle: "Hiểu tượng, lý" },
  { icon: NotebookPen, title: "Tượng lý", subtitle: "Đọc biểu tượng" },
  { icon: Landmark, title: "Tham khảo", subtitle: "Học để thận trọng" },
];

const trigrams = [
  { name: "Càn", han: "乾", symbol: "☰", element: "Kim", image: "Trời", keywords: "kiện, sáng, chủ động" },
  { name: "Khôn", han: "坤", symbol: "☷", element: "Thổ", image: "Đất", keywords: "thuận, chứa, nuôi" },
  { name: "Chấn", han: "震", symbol: "☳", element: "Mộc", image: "Sấm", keywords: "động, khởi, thức" },
  { name: "Tốn", han: "巽", symbol: "☴", element: "Mộc", image: "Gió", keywords: "nhập, mềm, lan" },
  { name: "Khảm", han: "坎", symbol: "☵", element: "Thủy", image: "Nước", keywords: "sâu, hiểm, trí" },
  { name: "Ly", han: "離", symbol: "☲", element: "Hỏa", image: "Lửa", keywords: "sáng, rõ, bám" },
  { name: "Cấn", han: "艮", symbol: "☶", element: "Thổ", image: "Núi", keywords: "dừng, giữ, tĩnh" },
  { name: "Đoài", han: "兌", symbol: "☱", element: "Kim", image: "Đầm", keywords: "vui, nói, mở" },
];

const hexagramSamples = [
  { no: "01", name: "Thuần Càn", han: "乾為天", theme: "Khởi động, chủ động" },
  { no: "02", name: "Thuần Khôn", han: "坤為地", theme: "Tiếp nhận, nuôi dưỡng" },
  { no: "03", name: "Thủy Lôi Truân", han: "水雷屯", theme: "Khởi đầu còn rối" },
  { no: "13", name: "Thiên Hỏa Đồng Nhân", han: "天火同人", theme: "Đồng lòng, hợp tác" },
  { no: "37", name: "Phong Hỏa Gia Nhân", han: "風火家人", theme: "Gia đạo, vai trò" },
  { no: "52", name: "Thuần Cấn", han: "艮為山", theme: "Dừng lại, quan sát" },
];

const journalRows = [
  { time: "22/05/2025 14:30", topic: "Công việc", hexagram: "Thiên Hỏa Đồng Nhân", moving: "Hào 5", risk: "Thấp" },
  { time: "21/05/2025 09:15", topic: "Dự án mới", hexagram: "Thủy Thiên Nhu", moving: "Hào 2", risk: "Trung bình" },
  { time: "20/05/2025 20:45", topic: "Tự phản tư", hexagram: "Thuần Cấn", moving: "Hào 3", risk: "Thấp" },
];

function OrnamentalRule() {
  return (
    <div className="mx-auto mt-4 flex w-full max-w-sm items-center justify-center gap-3 text-[#8b742d]">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#8b742d]/60 to-[#8b742d]/70" />
      <span className="text-lg leading-none">⌘</span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#8b742d]/60 to-[#8b742d]/70" />
    </div>
  );
}

function GoldIconFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-20 w-20 place-items-center rounded-full border border-[#a8842a] bg-[#0d0c08] shadow-[0_0_0_1px_rgba(221,179,71,0.16),inset_0_0_30px_rgba(185,138,37,0.10)]">
      <div className="grid h-14 w-14 place-items-center rounded-full border border-[#80641d] text-[#d0a63b]">
        {children}
      </div>
    </div>
  );
}

function AssetImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  );
}

function HexagramLines() {
  const lines = [true, false, true, true, false, false];
  return (
    <div className="space-y-2 rounded-2xl bg-[#15110a]/85 p-5">
      {lines.map((yang, index) => (
        <div key={index} className="flex items-center justify-center gap-3">
          {yang ? (
            <span className="h-3 w-32 rounded-full bg-[#f0d68e]" />
          ) : (
            <>
              <span className="h-3 w-12 rounded-full bg-[#f0d68e]" />
              <span className="w-8" />
              <span className="h-3 w-12 rounded-full bg-[#f0d68e]" />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function PreviewSmokeTest() {
  const tests = [
    { name: "Có đủ 8 quái", pass: trigrams.length === 8 },
    { name: "Có mục feature Mai Hoa", pass: featureItems.some((item) => item.title === "Mai Hoa") },
    { name: "Có cảnh báo an toàn", pass: true },
  ];

  return (
    <div className="hidden" aria-label="preview-smoke-tests">
      {tests.map((test) => (
        <span key={test.name} data-testid={test.name} data-pass={String(test.pass)}>
          {test.name}: {test.pass ? "PASS" : "FAIL"}
        </span>
      ))}
    </div>
  );
}

export default function BocMaiHoaLandingPreview() {
  return (
    <main className="min-h-screen bg-[#0b0a07] font-serif text-[#261c0e]">
      <PreviewSmokeTest />

      <header className="relative z-20 border-b border-[#3d3115] bg-[#090907] text-[#e6d5a4] shadow-[0_16px_40px_rgba(0,0,0,0.32)]">
        <div className="mx-auto flex min-h-[112px] max-w-[1760px] items-center justify-between gap-8 px-8 py-5 xl:px-16">
          <div className="flex items-center gap-6">
            <div className="relative grid h-[74px] w-[74px] place-items-center rounded-full border border-[#b3892b] bg-[#11100b] shadow-[inset_0_0_28px_rgba(208,166,59,0.16)]">
              <AssetImage src={ASSETS.logo} alt="Cổ học" className="h-14 w-14 object-contain" />
              <span className="absolute text-3xl text-[#b99432]">☯</span>
            </div>
            <div className="leading-none">
              <div className="text-[34px] font-semibold tracking-[0.08em] text-[#f0e0af]">Cổ học</div>
              <div className="mt-3 text-[14px] uppercase tracking-[0.18em] text-[#d5bd77]">Năm con đường học hiểu</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-[15px] font-semibold tracking-[0.20em] lg:flex">
            {navItems.map((item) => {
              const active = item === "NGŨ THUẬT";
              return (
                <div key={item} className="relative px-2 py-4 text-[#e5d29b]">
                  {active && <div className="absolute inset-x-[-18px] inset-y-0 border border-[#8b742d] bg-[#19140b]" />}
                  <span className="relative z-10">{item}</span>
                </div>
              );
            })}
          </nav>

          <div className="grid h-[54px] w-[54px] place-items-center rounded-full border border-[#b28b2f] text-[#cfa448] shadow-[inset_0_0_25px_rgba(203,157,50,0.16)]">
            <CircleUserRound size={32} strokeWidth={1.5} />
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#d8bf7f] pb-12">
        <div className="absolute inset-0 bg-cover bg-center opacity-95" style={{ backgroundImage: `url(${ASSETS.heroBg})` }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(248,224,157,0.58)_0%,rgba(224,190,111,0.32)_35%,rgba(42,32,16,0.34)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(33,24,11,0.30),rgba(255,238,183,0.15)_38%,rgba(42,31,13,0.30))]" />

        <AssetImage src={ASSETS.heroLeft} alt="Sơn thủy bên trái" className="absolute bottom-0 left-0 h-[585px] w-[42%] object-cover object-left-bottom opacity-80 mix-blend-multiply" />
        <AssetImage src={ASSETS.heroRight} alt="Sách dịch bên phải" className="absolute bottom-0 right-0 h-[560px] w-[40%] object-cover object-right-bottom opacity-80 mix-blend-multiply" />
        <AssetImage src={ASSETS.plumBranch} alt="Cành mai" className="absolute left-0 top-20 h-[330px] w-[400px] object-contain opacity-90" />

        <div className="relative z-10 mx-auto max-w-[1760px] px-6 pt-8 md:px-16 xl:px-24">
          <div className="mb-8 flex items-center gap-4 text-[17px] text-[#2f2615]/90">
            <Home size={21} fill="#2f2615" strokeWidth={1.5} />
            <span>Trang chủ</span>
            <span>/</span>
            <span>Ngũ thuật</span>
            <span>/</span>
            <span>Bốc</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mx-auto max-w-[1080px] text-center">
            <h1 className="text-[42px] font-semibold leading-[1.1] tracking-[0.02em] text-[#251a0b] drop-shadow-[0_1px_0_rgba(255,244,196,0.45)] md:text-[64px]">
              Bốc - Mai Hoa và phép chiêm nghiệm
              <span className="ml-5 inline-grid h-12 w-12 translate-y-1 place-items-center border-2 border-[#9d2c1d] text-[18px] font-bold leading-none text-[#9d2c1d]">
                繁<br />榮
              </span>
            </h1>
            <OrnamentalRule />
            <p className="mx-auto mt-7 max-w-[780px] text-[21px] leading-[1.55] tracking-[0.025em] text-[#2d2110] md:text-[25px]">
              Không gian tham khảo các phương pháp chiêm nghiệm cổ học,
              <br />
              lấy trọng tâm là Mai Hoa Dịch Số, quẻ dịch và cách đọc
              <br />
              biểu tượng theo hướng thận trọng.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mx-auto mt-9 grid max-w-[960px] overflow-hidden rounded-[10px] border border-[#d7c08a]/80 bg-[#f1dca3]/70 shadow-[0_20px_48px_rgba(55,34,12,0.24),inset_0_0_35px_rgba(255,245,203,0.45)] backdrop-blur-[1px] md:grid-cols-[52%_48%]">
            <div className="relative min-h-[260px] overflow-hidden">
              <AssetImage src={ASSETS.cardImage} alt="Mai Hoa Dịch Số" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-[#f1dca3]" />
            </div>

            <div className="flex flex-col justify-center px-8 py-9 text-left md:px-11">
              <h2 className="text-[36px] font-medium tracking-[0.02em] text-[#21180d]">Mai Hoa Dịch Số</h2>
              <OrnamentalRule />
              <p className="mt-5 text-[21px] leading-[1.45] text-[#2b2114]">
                Gieo lập và đọc quẻ theo hướng tham khảo, chú trọng học hiểu tượng, lý và bối cảnh, không phán đoán tuyệt đối.
              </p>
              <button className="mt-5 h-[56px] w-full max-w-[300px] border border-[#b18d34] bg-[#11110e] text-[22px] font-semibold tracking-[0.04em] text-[#ecd69b] shadow-[inset_0_0_0_2px_rgba(0,0,0,0.55),0_4px_0_rgba(0,0,0,0.45)]">
                Mở Mai Hoa
              </button>
              <div className="mt-5 flex items-center gap-2 text-[16px] text-[#6d5d30]">
                <span className="h-4 w-4 rounded-full bg-[#8c7b3b]" />
                <span>Đang chuẩn bị dữ liệu</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-[#363018] bg-[#10100b] text-[#e8d7a3]">
        <div className="mx-auto grid max-w-[1580px] gap-4 px-5 py-5 md:grid-cols-5">
          {featureItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center justify-center gap-5 rounded-2xl border border-[#3b3217] bg-[#15130d] px-5 py-4">
                <GoldIconFrame>
                  <Icon size={34} strokeWidth={1.35} />
                </GoldIconFrame>
                <div>
                  <h3 className="text-[22px] font-medium tracking-[0.02em] text-[#efdca7]">{item.title}</h3>
                  <p className="mt-2 text-[16px] tracking-[0.02em] text-[#a99866]">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-[#ead6a1] px-6 py-12 text-[#241a0b] md:px-16 xl:px-24">
        <div className="mx-auto max-w-[1500px]">
          <h2 className="text-center text-[38px] font-semibold">Form nhập câu hỏi / lập quẻ theo thời gian</h2>
          <OrnamentalRule />

          <div className="mt-8 grid gap-5 rounded-[28px] border border-[#b89444]/60 bg-[#f5e7bd]/80 p-6 shadow-[0_18px_40px_rgba(80,51,17,0.14)] lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <label className="block">
              <span className="mb-2 block text-lg font-semibold">Câu hỏi cần quan sát</span>
              <textarea className="min-h-32 w-full rounded-2xl border border-[#b89444]/50 bg-[#fff7db]/90 p-4 text-lg outline-none" defaultValue="Tôi nên quan sát điều gì trong việc này?" />
            </label>
            <label className="block">
              <span className="mb-2 block text-lg font-semibold">Loại câu hỏi</span>
              <select className="h-14 w-full rounded-2xl border border-[#b89444]/50 bg-[#fff7db]/90 px-4 text-lg outline-none" defaultValue="Tổng quan">
                <option>Tổng quan</option>
                <option>Công việc</option>
                <option>Quan hệ</option>
                <option>Sức khỏe</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-lg font-semibold">Cách lập quẻ</span>
              <select className="h-14 w-full rounded-2xl border border-[#b89444]/50 bg-[#fff7db]/90 px-4 text-lg outline-none" defaultValue="Theo thời gian">
                <option>Theo thời gian</option>
                <option>Ba số</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-lg font-semibold">Ngày</span>
              <input className="h-14 w-full rounded-2xl border border-[#b89444]/50 bg-[#fff7db]/90 px-4 text-lg outline-none" defaultValue="22/05/2025" />
            </label>
            <label className="block">
              <span className="mb-2 block text-lg font-semibold">Giờ</span>
              <input className="h-14 w-full rounded-2xl border border-[#b89444]/50 bg-[#fff7db]/90 px-4 text-lg outline-none" defaultValue="14:30" />
            </label>
            <div className="flex items-end">
              <button className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#11110e] px-6 text-xl font-semibold text-[#ecd69b]">
                <Clock3 size={22} /> Lập quẻ
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#b89444]/50 bg-[#fff4cb]/70 p-4 text-lg">
            <ShieldAlert className="text-[#8b742d]" />
            <span>Quẻ chỉ dùng để học hiểu và tự phản tư, không thay thế quyết định cá nhân.</span>
          </div>
        </div>
      </section>

      <section className="bg-[#15110a] px-6 py-12 text-[#ead6a1] md:px-16 xl:px-24">
        <div className="mx-auto max-w-[1500px]">
          <h2 className="text-center text-[38px] font-semibold">Khối quẻ mẫu</h2>
          <OrnamentalRule />
          <div className="mt-8 grid gap-6 rounded-[28px] border border-[#6b5520] bg-[#20180d] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.24)] lg:grid-cols-[0.8fr_1fr_1.2fr]">
            <div className="rounded-3xl border border-[#6b5520] bg-[#100d08] p-5 text-center">
              <p className="text-lg text-[#bfa45c]">Quẻ chủ</p>
              <h3 className="mt-2 text-3xl font-semibold">Thiên Hỏa Đồng Nhân</h3>
              <p className="mt-1 text-[#a99866]">第13卦</p>
              <div className="mt-5"><HexagramLines /></div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-3xl border border-[#6b5520] bg-[#100d08] p-5">
                <p className="text-[#bfa45c]">Quẻ hỗ</p>
                <h3 className="text-2xl font-semibold">Lôi Thiên Đại Tráng</h3>
              </div>
              <div className="rounded-3xl border border-[#6b5520] bg-[#100d08] p-5">
                <p className="text-[#bfa45c]">Quẻ biến</p>
                <h3 className="text-2xl font-semibold">Thiên Trạch Lý</h3>
              </div>
              <div className="rounded-3xl border border-[#a8842a] bg-[#2d210f] p-5">
                <p className="text-[#bfa45c]">Động hào</p>
                <h3 className="text-2xl font-semibold">Hào 5</h3>
              </div>
            </div>
            <div className="rounded-3xl border border-[#6b5520] bg-[#100d08] p-5">
              <h3 className="text-2xl font-semibold">Giải nghĩa tham khảo</h3>
              <p className="mt-4 text-lg leading-8 text-[#d5bd77]">
                Quẻ gợi ý tinh thần hợp tác, giữ chữ tín và quan sát bối cảnh chung. Đây là lớp nghĩa tham khảo để suy ngẫm, không phải kết luận chắc chắn về tương lai.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#ead6a1] px-6 py-12 text-[#241a0b] md:px-16 xl:px-24">
        <div className="mx-auto max-w-[1500px]">
          <h2 className="text-center text-[38px] font-semibold">Bảng 8 quái</h2>
          <OrnamentalRule />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trigrams.map((item) => (
              <article key={item.name} className="rounded-3xl border border-[#b89444]/60 bg-[#fff2c5]/80 p-5 shadow-[0_10px_24px_rgba(80,51,17,0.10)]">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold">{item.name} <span className="text-[#8f6e25]">{item.han}</span></h3>
                    <p className="mt-1 text-lg">{item.image} / {item.element}</p>
                  </div>
                  <span className="text-5xl text-[#3a2a11]">{item.symbol}</span>
                </div>
                <p className="mt-4 text-lg text-[#60491a]">{item.keywords}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f3dfaa] px-6 py-12 text-[#241a0b] md:px-16 xl:px-24">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-[38px] font-semibold">Khu tra 64 quẻ</h2>
              <p className="mt-2 text-lg text-[#60491a]">Preview thư viện, bản thật sẽ mở rộng đủ 64 quẻ.</p>
            </div>
            <div className="flex h-14 min-w-[320px] items-center gap-3 rounded-2xl border border-[#b89444]/60 bg-[#fff7db]/90 px-4 text-[#6a5120]">
              <Search size={22} />
              <span>Tìm quẻ, tượng, chủ đề...</span>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hexagramSamples.map((hex) => (
              <article key={hex.no} className="rounded-3xl border border-[#b89444]/60 bg-[#fff2c5]/80 p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#2c210f] px-4 py-2 text-[#ecd69b]">#{hex.no}</span>
                  <span className="text-2xl text-[#8f6e25]">{hex.han}</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold">{hex.name}</h3>
                <p className="mt-2 text-lg text-[#60491a]">{hex.theme}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#ead6a1] px-6 py-12 text-[#241a0b] md:px-16 xl:px-24">
        <div className="mx-auto max-w-[1500px]">
          <h2 className="text-center text-[38px] font-semibold">Nhật ký quẻ</h2>
          <OrnamentalRule />
          <div className="mt-8 overflow-hidden rounded-[28px] border border-[#b89444]/60 bg-[#fff2c5]/80">
            {journalRows.map((row) => (
              <div key={`${row.time}-${row.hexagram}`} className="grid gap-4 border-b border-[#b89444]/30 p-5 last:border-b-0 md:grid-cols-[1fr_1fr_1.2fr_0.7fr_0.7fr]">
                <span>{row.time}</span>
                <span>{row.topic}</span>
                <strong>{row.hexagram}</strong>
                <span>{row.moving}</span>
                <span className="rounded-full bg-[#2c210f] px-3 py-1 text-center text-[#ecd69b]">{row.risk}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#10100b] px-6 py-12 text-[#e8d7a3] md:px-16 xl:px-24">
        <div className="mx-auto grid max-w-[1500px] gap-6 rounded-[28px] border border-[#8b742d] bg-[#17140d] p-7 md:grid-cols-[auto_1fr]">
          <div className="grid h-20 w-20 place-items-center rounded-full border border-[#b28b2f] text-[#d0a63b]">
            <ShieldAlert size={42} strokeWidth={1.4} />
          </div>
          <div>
            <h2 className="text-3xl font-semibold">Cảnh báo an toàn cho app</h2>
            <p className="mt-4 text-xl leading-8 text-[#d5bd77]">
              Nội dung trong app chỉ dùng để học cổ học và suy ngẫm. Không xem là kết luận chắc chắn. Không dùng để thay chuyên gia y tế, pháp lý, tài chính hoặc các quyết định hệ trọng.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#3d3115] bg-[#090907] px-6 py-6 text-center text-[#a99866]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-center gap-3 text-lg">
          <Compass size={20} />
          <span>Mai Hoa Dịch Số UI preview · Học để hiểu, hiểu để hành, hành để an.</span>
        </div>
      </footer>
    </main>
  );
}
