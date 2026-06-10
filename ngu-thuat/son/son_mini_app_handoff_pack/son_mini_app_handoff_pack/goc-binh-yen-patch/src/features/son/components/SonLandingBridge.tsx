import Link from "next/link";
import { SonChip } from "./SonActionButton";

export function SonLandingBridge() {
  return (
    <main className="min-h-screen bg-[#f3eadf] text-[#3d2a1f]">
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(139,94,60,0.16),transparent_32%),radial-gradient(circle_at_86%_20%,rgba(73,103,78,0.14),transparent_28%)]" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#8b5e3c]">Ngũ thuật / Sơn</p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Sơn <span className="text-[#8b5e3c]">Phong thủy an cư</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#654b37]">
                Sơn là mini app phong thủy ứng dụng: quan sát hướng nhà, bố cục, công năng và khí vận không gian theo Bát trạch và Huyền không Phi tinh.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-[#f5ead5]">
                <SonChip>Quan sát</SonChip>
                <SonChip>Đối chiếu</SonChip>
                <SonChip>Gợi ý nhẹ</SonChip>
                <SonChip>Không phán tuyệt đối</SonChip>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/mini-apps/son"
                  className="rounded-full bg-[#4a2f20] px-6 py-3 text-sm font-semibold text-[#f7e7ca] shadow-soft transition hover:-translate-y-0.5 hover:bg-[#3d271b]"
                >
                  Mở mini app Sơn
                </Link>
                <Link
                  href="/huyen-mon-tham-khao/ngu-thuat"
                  className="rounded-full border border-[#8b5e3c]/35 bg-white/35 px-6 py-3 text-sm font-semibold text-[#4a2f20] transition hover:-translate-y-0.5"
                >
                  Quay lại Ngũ thuật
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#8b5e3c]/20 bg-white/45 p-5 shadow-soft backdrop-blur">
              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-[1.5rem] border border-[#8b5e3c]/18 bg-[#fff8ec]/72 p-5">
                  <p className="text-3xl">八</p>
                  <h2 className="mt-3 text-xl font-semibold">Bát trạch</h2>
                  <p className="mt-2 text-sm leading-6 text-[#654b37]">Xem sự tương quan giữa người, hướng và công năng không gian.</p>
                </article>
                <article className="rounded-[1.5rem] border border-[#8b5e3c]/18 bg-[#fff8ec]/72 p-5">
                  <p className="text-3xl">九</p>
                  <h2 className="mt-3 text-xl font-semibold">Phi tinh</h2>
                  <p className="mt-2 text-sm leading-6 text-[#654b37]">Quan sát khí vận theo thời gian và 9 cung phương vị.</p>
                </article>
              </div>
              <p className="mt-5 rounded-2xl border border-[#8b5e3c]/18 bg-[#f3eadf]/60 p-4 text-sm leading-7 text-[#654b37]">
                Kết quả chỉ là tham khảo theo hệ quy chiếu cổ học. Việc quan trọng như sửa nhà lớn, đổi cửa, động thổ hoặc cải tạo kết cấu cần khảo sát thực tế.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
