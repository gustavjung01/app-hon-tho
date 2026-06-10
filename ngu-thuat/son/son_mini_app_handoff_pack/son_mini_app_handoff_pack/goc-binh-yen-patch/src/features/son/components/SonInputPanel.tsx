import type { Dispatch, ReactNode, SetStateAction } from "react";
import { sonDirectionOptions, sonSpaceTypeOptions } from "../data/sonContent";
import type { SonDirection, SonFormState, SonModuleId, SonSpaceType } from "../types";

const fieldClass = "w-full rounded-xl border border-[#d7b987]/35 bg-[#f5ead5]/90 px-3 py-2 text-sm text-[#2f2017] outline-none transition focus:border-[#f0cf80] focus:ring-2 focus:ring-[#f0cf80]/35";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block rounded-2xl border border-[#d4b87f]/28 bg-[#1b211b]/36 p-4">
      <span className="mb-2 block text-sm font-semibold text-[#f1d9a6]">{label}</span>
      {children}
      {hint ? <span className="mt-2 block text-xs leading-relaxed text-[#cdbb91]">{hint}</span> : null}
    </label>
  );
}

function DirectionSelect({ value, onChange }: { value: SonDirection; onChange: (value: SonDirection) => void }) {
  return (
    <select className={fieldClass} value={value} onChange={(event) => onChange(event.target.value as SonDirection)}>
      {sonDirectionOptions.map((direction) => (
        <option key={direction} value={direction}>
          {direction}
        </option>
      ))}
    </select>
  );
}

export function SonInputPanel({
  moduleId,
  form,
  setForm,
}: {
  moduleId: SonModuleId;
  form: SonFormState;
  setForm: Dispatch<SetStateAction<SonFormState>>;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
      <div className="rounded-[1.5rem] border border-[#d7b987]/25 bg-black/14 p-5">
        <p className="text-xs uppercase tracking-[0.26em] text-[#b9c3a6]">Cổng dữ liệu</p>
        <h2 className="mt-3 text-2xl font-semibold text-[#f8e6c4]">Nhập thông tin</h2>
        <p className="mt-3 text-sm leading-7 text-[#d2c19a]">
          Dữ liệu dùng để đối chiếu rule. Nếu hướng, năm xây hoặc sơ đồ chưa chắc, app phải ghi nhận là “cần kiểm tra” thay vì kết luận.
        </p>
        <div className="mt-4 rounded-2xl border border-[#f0cf80]/25 bg-[#f0cf80]/10 p-4 text-xs leading-6 text-[#f4dfb7]">
          Phase 1 dùng nhập thủ công. Phase 2 mới tải ảnh mặt bằng, chấm sơ đồ và lưu hồ sơ từng nơi chốn.
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {moduleId === "bat-trach" ? (
          <>
            <Field label="Năm sinh" hint="Bản chính thức cần chốt cách xử lý năm âm/dương và tiết khí.">
              <input
                className={fieldClass}
                inputMode="numeric"
                value={form.birthYear}
                onChange={(event) => setForm((old) => ({ ...old, birthYear: event.target.value }))}
              />
            </Field>
            <Field label="Giới tính">
              <select
                className={fieldClass}
                value={form.gender}
                onChange={(event) => setForm((old) => ({ ...old, gender: event.target.value as SonFormState["gender"] }))}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </Field>
            <Field label="Loại không gian">
              <select
                className={fieldClass}
                value={form.spaceType}
                onChange={(event) => setForm((old) => ({ ...old, spaceType: event.target.value as SonSpaceType }))}
              >
                {sonSpaceTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Hướng đang xét" hint="Nếu chưa chắc, dùng la bàn kiểm tra lại trước khi ra quyết định quan trọng.">
              <DirectionSelect value={form.mainDirection} onChange={(value) => setForm((old) => ({ ...old, mainDirection: value }))} />
            </Field>
          </>
        ) : (
          <>
            <Field label="Năm xây / nhập trạch" hint="Nếu chưa chắc, dùng mốc gần nhất và ghi chú cần kiểm tra.">
              <input
                className={fieldClass}
                inputMode="numeric"
                value={form.builtYear}
                onChange={(event) => setForm((old) => ({ ...old, builtYear: event.target.value }))}
              />
            </Field>
            <Field label="Năm sửa lớn, nếu có" hint="Sửa lớn có thể làm thay đổi mốc tham khảo, cần rule chốt sau.">
              <input
                className={fieldClass}
                inputMode="numeric"
                value={form.renovatedYear}
                placeholder="Để trống nếu không có"
                onChange={(event) => setForm((old) => ({ ...old, renovatedYear: event.target.value }))}
              />
            </Field>
            <Field label="Hướng nhà / hướng cửa">
              <DirectionSelect value={form.facingDirection} onChange={(value) => setForm((old) => ({ ...old, facingDirection: value }))} />
            </Field>
            <Field label="Năm cần xem">
              <input
                className={fieldClass}
                inputMode="numeric"
                value={form.targetYear}
                onChange={(event) => setForm((old) => ({ ...old, targetYear: event.target.value }))}
              />
            </Field>
          </>
        )}
        <div className="sm:col-span-2">
          <Field label="Ghi chú sơ đồ / hiện trạng" hint="Ví dụ: cửa chính phía Nam, phòng ngủ phía Bắc, bếp Tây Nam.">
            <textarea
              className={`${fieldClass} min-h-[96px] resize-y`}
              value={form.floorPlanNote}
              onChange={(event) => setForm((old) => ({ ...old, floorPlanNote: event.target.value }))}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
