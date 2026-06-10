import React, { useMemo, useState } from "react";
import {
  BookOpen,
  ShieldCheck,
  Leaf,
  Activity,
  Moon,
  Flame,
  Droplets,
  Wind,
  ChevronRight,
  AlertTriangle,
  ScrollText,
  HeartPulse,
  Sparkles,
  Search,
} from "lucide-react";

const screens = [
  { id: "hero", label: "Trang đầu", icon: BookOpen },
  { id: "safety", label: "Nguyên tắc", icon: ShieldCheck },
  { id: "form", label: "Tự quan sát", icon: Activity },
  { id: "result", label: "Kết quả", icon: ScrollText },
  { id: "learn", label: "Tự học", icon: Search },
];

const featureCards = [
  {
    icon: Moon,
    title: "Âm dương",
    text: "Nhận diện xu hướng thiên hàn, thiên nhiệt, thiếu nghỉ ngơi hoặc hao tổn năng lượng theo ngôn ngữ cổ học.",
  },
  {
    icon: Leaf,
    title: "Tạng phủ",
    text: "Học hiểu Can, Tâm, Tỳ, Phế, Thận trong hệ quy chiếu Đông y, không đồng nhất máy móc với cơ quan hiện đại.",
  },
  {
    icon: Droplets,
    title: "Khí huyết",
    text: "Gợi ý các xu hướng như khí hư, huyết hư, khí trệ, đàm thấp, âm hư, dương hư ở mức tham khảo.",
  },
  {
    icon: Wind,
    title: "Dưỡng sinh nhẹ",
    text: "Đề xuất ngủ nghỉ, ăn uống, vận động, hơi thở và điều hòa cảm xúc, không thuốc, không liều lượng.",
  },
];

const questions = [
  {
    id: "sleep",
    group: "Giấc ngủ",
    label: "Gần đây giấc ngủ của bạn thế nào?",
    options: ["Dễ ngủ", "Khó ngủ", "Hay tỉnh giữa đêm", "Ngủ dậy vẫn mệt", "Không chắc"],
  },
  {
    id: "temperature",
    group: "Nóng / lạnh",
    label: "Cơ thể bạn thường nghiêng về cảm giác nào?",
    options: ["Dễ lạnh", "Tay chân lạnh", "Dễ nóng trong", "Bốc nóng về chiều", "Không rõ"],
  },
  {
    id: "digestion",
    group: "Tiêu hóa",
    label: "Sau ăn, bạn thường cảm thấy gì?",
    options: ["Bình thường", "Đầy bụng", "Ăn kém", "Miệng đắng", "Nặng người"],
  },
  {
    id: "emotion",
    group: "Cảm xúc",
    label: "Tâm trạng gần đây thiên về điều gì?",
    options: ["Bình ổn", "Dễ cáu", "Lo nghĩ nhiều", "Buồn bực", "Căng tức trong người"],
  },
];

const results = [
  {
    name: "Khí hư",
    score: 78,
    confidence: "vừa",
    icon: HeartPulse,
    desc: "Dữ liệu đang nghiêng về xu hướng cơ thể dễ hao sức, mệt khi vận động, cần ưu tiên nhịp nghỉ và ăn uống đều hơn.",
  },
  {
    name: "Tỳ vị hư",
    score: 62,
    confidence: "thấp-vừa",
    icon: Leaf,
    desc: "Một số câu trả lời gợi ý vùng tiêu hóa và chuyển hóa theo cổ học cần được quan sát thêm, nhất là sau bữa ăn.",
  },
  {
    name: "Can khí uất",
    score: 54,
    confidence: "thấp",
    icon: Wind,
    desc: "Có vài dấu hiệu liên quan căng tức, cảm xúc ứ trệ hoặc khó thư giãn. Dữ liệu còn mỏng nên chỉ nên xem như gợi ý nhẹ.",
  },
];

const glossary = [
  { term: "Âm", text: "Mặt tĩnh, mát, nuôi dưỡng, bên trong. Không hiểu đơn giản là bệnh lạnh." },
  { term: "Dương", text: "Mặt động, ấm, vận hành, bên ngoài. Không đồng nghĩa với sốt hay viêm." },
  { term: "Khí", text: "Khả năng vận hành, nâng đỡ, bảo vệ và chuyển hóa theo cổ học." },
  { term: "Huyết", text: "Phần nuôi dưỡng, làm mềm nhuận và nâng đỡ tinh thần theo cổ học." },
  { term: "Bát cương", text: "Khung phân loại biểu/lý, hàn/nhiệt, hư/thực, âm/dương." },
  { term: "Tứ chẩn", text: "Vọng, văn, vấn, thiết. App chỉ dùng tự quan sát, không thay thầy thuốc." },
];

function Pill({ children, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        active
          ? "border-amber-300 bg-amber-300/15 text-amber-100 shadow-[0_0_24px_rgba(245,158,11,.18)]"
          : "border-stone-700 bg-stone-950/50 text-stone-300 hover:border-amber-500/70 hover:text-amber-100"
      }`}
    >
      {children}
    </button>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-300/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-amber-200">
        <Sparkles size={14} /> {eyebrow}
      </div>
      <h2 className="text-3xl font-semibold tracking-tight text-stone-50 md:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-stone-300">{text}</p>
    </div>
  );
}

function Shell({ screen, setScreen }) {
  const Current = useMemo(() => {
    if (screen === "safety") return SafetyScreen;
    if (screen === "form") return FormScreen;
    if (screen === "result") return ResultScreen;
    if (screen === "learn") return LearnScreen;
    return HeroScreen;
  }, [screen]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#130f0a] text-stone-100">
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-amber-700/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-stone-600/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,.09),transparent_28%),linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100%_100%,44px_44px,44px_44px]" />
      </div>

      <header className="relative z-10 border-b border-amber-200/10 bg-[#130f0a]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <button onClick={() => setScreen("hero")} className="flex items-center gap-3 text-left">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-amber-300/25 bg-amber-300/10">
              <BookOpen className="text-amber-200" size={22} />
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.28em] text-amber-200/80">Ngũ thuật / Y</div>
              <div className="font-semibold text-stone-50">Y học cổ học tham khảo</div>
            </div>
          </button>

          <nav className="hidden items-center gap-2 lg:flex">
            {screens.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setScreen(item.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                    screen === item.id
                      ? "bg-amber-300 text-stone-950"
                      : "text-stone-300 hover:bg-stone-800 hover:text-amber-100"
                  }`}
                >
                  <Icon size={16} /> {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <Current setScreen={setScreen} />
      </main>
    </div>
  );
}

function HeroScreen({ setScreen }) {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr]">
        <section>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-stone-950/50 px-4 py-2 text-sm text-amber-100">
            <ShieldCheck size={16} /> Không chẩn đoán, không kê đơn, chỉ tham khảo cổ học
          </div>
          <h1 className="text-5xl font-semibold leading-tight tracking-tight text-stone-50 md:text-7xl">
            Y <span className="text-amber-200">- Y học cổ học</span> tham khảo
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
            Một không gian học hiểu và tự quan sát thể trạng theo âm dương, ngũ hành, tạng phủ, khí huyết, kinh lạc,
            tứ chẩn, bát cương và dưỡng sinh. App chỉ gợi ý xu hướng, không thay thế tư vấn y tế.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => setScreen("form")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-300 px-6 py-4 font-semibold text-stone-950 shadow-[0_16px_50px_rgba(245,158,11,.22)] transition hover:-translate-y-0.5"
            >
              Bắt đầu tự quan sát <ChevronRight size={18} />
            </button>
            <button
              onClick={() => setScreen("safety")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-300/25 bg-stone-950/40 px-6 py-4 font-semibold text-amber-100 transition hover:border-amber-300/60"
            >
              Đọc nguyên tắc an toàn
            </button>
          </div>
        </section>

        <section className="rounded-[2rem] border border-amber-200/15 bg-[#21170f]/75 p-5 shadow-2xl backdrop-blur">
          <div className="rounded-[1.5rem] border border-amber-200/10 bg-[#17110b] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm uppercase tracking-[0.22em] text-amber-200/70">Mẫu kết quả</div>
                <h3 className="mt-2 text-2xl font-semibold text-stone-50">Xu hướng thể trạng</h3>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-300/15 text-amber-100">
                <Activity />
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {results.slice(0, 2).map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.name} className="rounded-2xl border border-stone-700/70 bg-stone-950/45 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="text-amber-200" size={20} />
                        <span className="font-semibold text-stone-50">{item.name}</span>
                      </div>
                      <span className="text-sm text-amber-100">confidence {item.confidence}</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-stone-800">
                      <div className="h-2 rounded-full bg-amber-300" style={{ width: `${item.score}%` }} />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-stone-300">{item.desc}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 rounded-2xl border border-red-300/20 bg-red-950/20 p-4 text-sm leading-6 text-red-100">
              Nếu có đau ngực, khó thở, liệt, nói khó, ngất, co giật hoặc dấu hiệu nặng, app sẽ ưu tiên khuyến nghị đi khám/cấp cứu.
            </div>
          </div>
        </section>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-4">
        {featureCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="rounded-[1.5rem] border border-amber-100/10 bg-stone-950/35 p-5">
              <Icon className="text-amber-200" />
              <h3 className="mt-4 text-lg font-semibold text-stone-50">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-300">{card.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SafetyScreen({ setScreen }) {
  const rules = [
    "Không chẩn đoán bệnh hoặc kết luận sức khỏe chắc chắn.",
    "Không kê đơn, không đưa liều dược liệu, không hướng dẫn tự dùng thuốc.",
    "Không thay thế bác sĩ, thầy thuốc hoặc điều trị đang theo.",
    "Luôn kiểm tra dấu hiệu nguy hiểm trước khi luận giải cổ học.",
  ];
  const redFlags = ["Đau ngực", "Khó thở", "Liệt mặt/tay/chân", "Nói khó", "Ngất", "Co giật", "Sốt cao kéo dài", "Nôn hoặc đi cầu ra máu", "Ý nghĩ tự hại", "Thai kỳ có bất thường"];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <SectionTitle
        eyebrow="an toàn trước"
        title="Cổng đỏ đặt trước cổng luận giải"
        text="App Y luôn hỏi dấu hiệu nguy hiểm trước. Nếu có red flag, màn kết quả sẽ dừng ở cảnh báo đi khám, không cố diễn giải Đông y."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-amber-100/10 bg-stone-950/45 p-6">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-stone-50">
            <ShieldCheck className="text-amber-200" /> Nguyên tắc hiển thị
          </h3>
          <div className="mt-5 space-y-3">
            {rules.map((rule) => (
              <div key={rule} className="rounded-2xl border border-stone-700/70 bg-[#18110c] p-4 text-stone-300">
                {rule}
              </div>
            ))}
          </div>
          <button onClick={() => setScreen("form")} className="mt-6 w-full rounded-2xl bg-amber-300 px-5 py-4 font-semibold text-stone-950">
            Tôi đã hiểu, bắt đầu tự quan sát
          </button>
        </div>
        <div className="rounded-[2rem] border border-red-300/20 bg-red-950/15 p-6">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-red-100">
            <AlertTriangle /> Red flags bắt buộc đi khám
          </h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {redFlags.map((flag) => (
              <div key={flag} className="rounded-2xl border border-red-200/10 bg-stone-950/35 p-4 text-sm text-red-50">
                {flag}
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-2xl border border-amber-200/15 bg-amber-200/10 p-4 text-sm leading-6 text-amber-50">
            Khi gặp dấu hiệu nguy hiểm, app không dùng để tự xử lý. Người dùng nên liên hệ bác sĩ, cơ sở y tế hoặc cấp cứu tùy mức độ.
          </p>
        </div>
      </div>
    </div>
  );
}

function FormScreen({ setScreen }) {
  const [answers, setAnswers] = useState({});
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <SectionTitle
        eyebrow="tự quan sát"
        title="Một vòng hỏi nhẹ, không ép kết luận"
        text="Người dùng có thể bỏ qua câu không chắc. Engine tính xu hướng dựa trên dữ liệu đủ tin hơn, đồng thời ghi rõ phần còn thiếu."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_.42fr]">
        <div className="space-y-5">
          {questions.map((q, index) => (
            <div key={q.id} className="rounded-[1.6rem] border border-amber-100/10 bg-stone-950/45 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-amber-200/70">{q.group}</div>
                  <h3 className="mt-2 text-xl font-semibold text-stone-50">{index + 1}. {q.label}</h3>
                </div>
                <div className="rounded-full border border-stone-700 px-3 py-1 text-xs text-stone-400">single</div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {q.options.map((option) => (
                  <Pill
                    key={option}
                    active={answers[q.id] === option}
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: option }))}
                  >
                    {option}
                  </Pill>
                ))}
              </div>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-[2rem] border border-amber-200/15 bg-[#1b130d]/80 p-6 lg:sticky lg:top-6">
          <h3 className="text-xl font-semibold text-stone-50">Dữ liệu mẫu</h3>
          <p className="mt-3 text-sm leading-6 text-stone-300">
            Form thật sẽ có thêm tuổi, giới, lưỡi tự quan sát, đại tiểu tiện, mồ hôi, khát nước, đau nhức và red flag screening.
          </p>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between rounded-2xl bg-stone-950/50 p-3"><span>Đã trả lời</span><b>{Object.keys(answers).length}/4</b></div>
            <div className="flex justify-between rounded-2xl bg-stone-950/50 p-3"><span>Cho phép bỏ qua</span><b>Có</b></div>
            <div className="flex justify-between rounded-2xl bg-stone-950/50 p-3"><span>Độ tin cậy</span><b>tính sau</b></div>
          </div>
          <button onClick={() => setScreen("result")} className="mt-6 w-full rounded-2xl bg-amber-300 px-5 py-4 font-semibold text-stone-950">
            Xem kết quả mẫu
          </button>
        </aside>
      </div>
    </div>
  );
}

function ResultScreen({ setScreen }) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <SectionTitle
        eyebrow="kết quả tham khảo"
        title="Chỉ nói xu hướng, không nói bệnh"
        text="Màn kết quả trình bày điểm nghiêng theo pattern, dữ liệu còn thiếu, mâu thuẫn nếu có và dưỡng sinh nhẹ. Không thuốc, không liều, không phán quyết."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_.44fr]">
        <div className="space-y-5">
          {results.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="rounded-[1.6rem] border border-amber-100/10 bg-stone-950/45 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-300/15 text-amber-100"><Icon /></div>
                    <div>
                      <h3 className="text-xl font-semibold text-stone-50">Xu hướng {item.name}</h3>
                      <div className="mt-1 text-sm text-stone-400">Mức tin cậy: {item.confidence}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-semibold text-amber-200">{item.score}</div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-stone-800"><div className="h-2 rounded-full bg-amber-300" style={{ width: `${item.score}%` }} /></div>
                <p className="mt-4 leading-7 text-stone-300">{item.desc}</p>
              </div>
            );
          })}
        </div>
        <aside className="space-y-5">
          <div className="rounded-[1.6rem] border border-amber-100/10 bg-[#1b130d]/80 p-5">
            <h3 className="text-lg font-semibold text-stone-50">Gợi ý dưỡng sinh an toàn</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-300">
              <li>• Ngủ và thức đều giờ hơn trong 7 ngày tới.</li>
              <li>• Ăn chậm, giảm bữa quá cay, quá lạnh hoặc quá dầu.</li>
              <li>• Đi bộ nhẹ, thở chậm, không tập quá sức khi đang mệt.</li>
              <li>• Ghi lại cảm giác nóng/lạnh, tiêu hóa, giấc ngủ để quan sát tiếp.</li>
            </ul>
          </div>
          <div className="rounded-[1.6rem] border border-stone-700 bg-stone-950/45 p-5">
            <h3 className="text-lg font-semibold text-stone-50">Dữ liệu còn thiếu</h3>
            <p className="mt-3 text-sm leading-6 text-stone-300">Chưa có quan sát lưỡi, mồ hôi, khát nước, đại tiện/tiểu tiện. Vì vậy kết quả chỉ ở mức tham khảo vừa.</p>
          </div>
          <div className="rounded-[1.6rem] border border-red-300/20 bg-red-950/20 p-5 text-red-50">
            <h3 className="flex items-center gap-2 text-lg font-semibold"><AlertTriangle size={18} /> Khi nào nên đi khám?</h3>
            <p className="mt-3 text-sm leading-6">Nếu triệu chứng kéo dài, nặng lên, có đau ngực, khó thở, ngất, sốt cao hoặc dấu hiệu bất thường, không dùng app để tự xử lý.</p>
          </div>
          <button onClick={() => setScreen("learn")} className="w-full rounded-2xl border border-amber-300/25 px-5 py-4 font-semibold text-amber-100">
            Sang kho tự học
          </button>
        </aside>
      </div>
    </div>
  );
}

function LearnScreen() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <SectionTitle
        eyebrow="tự học"
        title="Kho thuật ngữ cổ học dễ đọc"
        text="Phần này giúp người dùng hiểu ngôn ngữ Đông y mà app dùng, luôn kèm cảnh báo không quy đổi máy móc sang bệnh danh hiện đại."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {glossary.map((item) => (
          <div key={item.term} className="rounded-[1.5rem] border border-amber-100/10 bg-stone-950/45 p-5">
            <div className="mb-4 inline-flex rounded-full bg-amber-300/15 px-3 py-1 text-sm text-amber-100">{item.term}</div>
            <p className="leading-7 text-stone-300">{item.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-[2rem] border border-amber-100/10 bg-[#1b130d]/80 p-6">
        <h3 className="text-xl font-semibold text-stone-50">Module học mở rộng</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {["Bản đồ tạng phủ", "Bát cương", "Tứ chẩn", "Quan sát lưỡi"].map((item) => (
            <div key={item} className="rounded-2xl border border-stone-700/60 bg-stone-950/45 p-4 text-stone-200">{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function YhocUiMauAppY() {
  const [screen, setScreen] = useState("hero");
  return <Shell screen={screen} setScreen={setScreen} />;
}
