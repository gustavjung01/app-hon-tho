"use client";

import { useMemo, useState } from "react";
import { sonActions, sonDefaultForm, sonModules } from "../data/sonContent";
import { getBatTrachPreview } from "../engine/batTrachEngine";
import { getPhiTinhPreview } from "../engine/phiTinhEngine";
import type { SonFormState, SonModuleId, SonViewId } from "../types";
import { SonActionButton, SonChip } from "./SonActionButton";
import { SonCompassEight } from "./SonCompassEight";
import { SonInputPanel } from "./SonInputPanel";
import { SonPalaceGrid } from "./SonPalaceGrid";
import {
  SonAnalysisPanel,
  SonOverviewPanel,
  SonSourcesPanel,
  SonSuggestionsPanel,
  SonTabNav,
} from "./SonResultTabs";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function SonMiniApp() {
  const [activeModule, setActiveModule] = useState<SonModuleId>("bat-trach");
  const [activeView, setActiveView] = useState<SonViewId>("overview");
  const [form, setForm] = useState<SonFormState>(sonDefaultForm);

  const activeModuleData = sonModules.find((module) => module.id === activeModule) ?? sonModules[0];

  const batPreview = useMemo(() => getBatTrachPreview(form), [form]);
  const phiPreview = useMemo(() => getPhiTinhPreview(form), [form]);
  const activeSummary = activeModule === "bat-trach" ? batPreview.summary : phiPreview.summary;

  return (
    <main className="min-h-screen overflow-hidden bg-[#101510] text-[#f5ead5]">
      <section className="relative isolate min-h-screen">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_10%,rgba(192,134,64,0.24),transparent_31%),radial-gradient(circle_at_86%_18%,rgba(77,103,78,0.22),transparent_30%),linear-gradient(135deg,#101510_0%,#1e2116_46%,#3a2318_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="absolute left-1/2 top-12 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full border border-[#d7b987]/10 bg-[conic-gradient(from_0deg,rgba(214,173,104,0.12),rgba(72,103,78,0.06),rgba(121,73,43,0.12),rgba(214,173,104,0.12))] blur-[1px]" />

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d6ad68]">Mini app / Sơn</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-wide text-[#f6e3bd] sm:text-5xl lg:text-6xl">
                Sơn <span className="text-[#cfa45b]">Phong thủy an cư</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#d7c7a0] sm:text-base">
                Quan sát nơi chốn theo Bát trạch và Phi tinh để hiểu hướng, thế, công năng và nhịp vận động của không gian sống.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <SonChip>Quan sát</SonChip>
              <SonChip>Đối chiếu</SonChip>
              <SonChip>Không phán tuyệt đối</SonChip>
            </div>
          </header>

          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative overflow-hidden rounded-[2rem] border border-[#d7b987]/35 bg-[#1a1d16]/70 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.3)] sm:p-8">
              <div className="absolute right-5 top-5 hidden h-36 w-36 rounded-full border border-[#d7b987]/30 bg-[conic-gradient(from_0deg,#d6ad68,#263a31,#8a4d2d,#d6ad68)] p-2 opacity-75 sm:block">
                <div className="grid h-full w-full place-items-center rounded-full border border-[#f5ead5]/30 bg-[#141710] text-5xl text-[#f3d89b] shadow-inner">山</div>
              </div>
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.28em] text-[#b9c3a6]">Bát trạch · Phi tinh</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#f8ead0] sm:text-4xl">
                  Một bản đồ nhỏ để nhìn lại căn nhà bằng ánh sáng điềm tĩnh.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-[#d7c7a0]">
                  Khung UI đã có luồng thao tác, nút, form và kết quả mẫu. Dev chỉ cần thay placeholder bằng rule engine và nguồn đã kiểm duyệt.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {sonModules.map((module) => (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => {
                      setActiveModule(module.id);
                      setActiveView("overview");
                    }}
                    className={cx(
                      "rounded-[1.5rem] border p-5 text-left transition hover:-translate-y-0.5",
                      module.id === activeModule
                        ? "border-[#f0cf80] bg-[#f3d89b]/14 shadow-[0_0_34px_rgba(218,168,72,0.14)]"
                        : "border-[#d7b987]/25 bg-black/16 hover:border-[#d7b987]/50"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-full border border-[#d7b987]/35 bg-black/25 text-2xl text-[#f3d89b]">
                        {module.icon}
                      </span>
                      <span>
                        <span className="block text-xl font-semibold text-[#f7e4bf]">{module.title}</span>
                        <span className="mt-1 block text-sm text-[#cdbb91]">{module.subtitle}</span>
                      </span>
                    </span>
                    <span className="mt-4 flex flex-wrap gap-2">
                      {module.bullets.map((bullet) => (
                        <span key={bullet} className="rounded-full bg-[#f5ead5]/10 px-2.5 py-1 text-xs text-[#ead6aa]">
                          {bullet}
                        </span>
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <aside className="grid gap-4 sm:grid-cols-2">
              {sonActions.map((action) => (
                <SonActionButton
                  key={action.id}
                  title={action.title}
                  subtitle={action.subtitle}
                  icon={action.icon}
                  tone={action.tone}
                  active={activeView === action.id}
                  onClick={() => setActiveView(action.id)}
                />
              ))}
              <div className="rounded-[1.35rem] border border-[#d7b987]/25 bg-[#f6e2b8]/10 p-5 sm:col-span-2">
                <p className="text-sm font-semibold text-[#f1d9a6]">Ranh giới an toàn</p>
                <p className="mt-2 text-sm leading-7 text-[#d2c19a]">
                  App chỉ đưa gợi ý tham khảo: sạch hơn, sáng hơn, thoáng hơn, yên hơn, ít nhiễu hơn. Khi sửa nhà lớn, đổi cửa hoặc dữ liệu chưa chắc, app phải báo cần khảo sát thực tế.
                </p>
              </div>
            </aside>
          </section>

          <section className="rounded-[2rem] border border-[#d7b987]/30 bg-[#171b14]/82 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.32)] sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#b9c3a6]">Đang mở</p>
                <h2 className="mt-1 text-2xl font-semibold text-[#f8e6c4]">{activeModuleData.title}</h2>
              </div>
              <SonChip active>{activeModule === "bat-trach" ? "8 hướng" : "9 cung"}</SonChip>
            </div>

            <SonTabNav activeView={activeView} setActiveView={setActiveView} />

            {activeView === "overview" ? <SonOverviewPanel moduleId={activeModule} summary={activeSummary} /> : null}
            {activeView === "input" ? <SonInputPanel moduleId={activeModule} form={form} setForm={setForm} /> : null}
            {activeView === "map" && activeModule === "bat-trach" ? (
              <SonCompassEight sectors={batPreview.sectors} selectedDirection={form.mainDirection} />
            ) : null}
            {activeView === "map" && activeModule === "phi-tinh" ? <SonPalaceGrid grid={phiPreview.grid} /> : null}
            {activeView === "analysis" ? <SonAnalysisPanel summary={activeSummary} /> : null}
            {activeView === "suggestions" ? <SonSuggestionsPanel summary={activeSummary} /> : null}
            {activeView === "sources" ? <SonSourcesPanel /> : null}
          </section>
        </div>
      </section>
    </main>
  );
}
