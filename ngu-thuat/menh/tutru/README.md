# Tứ Trụ Cổ Học (Hồn Thơ)

Ứng dụng Tứ Trụ theo hướng **công cụ tham khảo cổ học**: dựng bốn trụ từ ngày giờ sinh, hiển thị lớp đối chiếu Can Chi, Ngũ hành, Thập thần, Tàng can và nguồn tham khảo.

## Chạy local

```bash
npm install
npm run dev
```

Mặc định chạy tại: `http://localhost:4173`

## Cấu trúc chính hiện tại

- `src/App.tsx`
- `src/styles.css`
- `src/chartMock.ts`
- `src/tuTruContent.ts`
- `src/engine/deriveFourPillars.ts`
- `src/engine/resultContentLayer.ts`
- `src/engine/explainChartResult.ts`
- `src/engine/luckCycles.ts`
- `src/engine/stemsBranches.ts`
- `src/engine/dayPillar.ts`
- `src/engine/monthPillar.ts`
- `src/engine/yearPillar.ts`
- `src/engine/hourPillar.ts`
- `src/engine/types.ts`
- `src/data/tuTruKnowledgeSeed.ts`
- `public/assets/backgrounds/tu-tru/`
- `research/tu-tru_data_research_processed_pack/`

## Trạng thái module

- **Engine bốn trụ**: bản tối thiểu `v0.1.0`.
- **Explanation engine**: rule/template-based, **không dùng AI**, không tự luận mệnh.
- **Đại vận/Lưu niên**: đang ở mức minh họa, chưa tính thật thuận/nghịch theo giới tính.
- **Tàng thư đối chiếu**: dữ liệu nguồn ở trạng thái candidate/needs_review/restricted/rejected; chưa dùng làm kết luận tự động.

## Lưu ý sử dụng

- Đây là công cụ tham khảo, gợi mở theo cổ học.
- Kết quả dùng để đối chiếu theo quy tắc và tự quan sát.
- Không dùng để phán định đời người hoặc thay thế quyết định thực tế.
