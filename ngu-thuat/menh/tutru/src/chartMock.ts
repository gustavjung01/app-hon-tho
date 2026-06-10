import {
  detailCopy,
  elementDistribution,
  luckCycles,
  pillars,
  tenGods,
  yearlyCycles,
  type PillarKey
} from "./tuTruContent";

export type PillarDisplay = {
  key: PillarKey;
  label: string;
  stem: string;
  stemHan: string;
  branch: string;
  branchHan: string;
  stemElement: string;
  branchElement: string;
  hiddenStem: string;
  tenGod: string;
};

export type TenGodCard = {
  key: string;
  name: string;
  count: number;
  positions: string;
  summary: string;
  note: string;
};

export type ElementLayerKey = "global" | "stem" | "branch" | "hidden";

export type ElementBalanceItem = {
  name: string;
  value: number;
  className: string;
};

export type ArchiveItem = {
  id: string;
  title: string;
  topic: string;
  layer: string;
  status: string;
  contentType: string;
  description: string;
  sources: string;
  usageNote: string;
};

export const dayMasterLabel = "Tân Kim (辛)";

export const pillarDisplays: PillarDisplay[] = [
  {
    ...pillars[0],
    stemElement: "Kim",
    branchElement: "Hỏa",
    hiddenStem: "Đinh · Kỷ",
    tenGod: "Chính quan"
  },
  {
    ...pillars[1],
    stemElement: "Hỏa",
    branchElement: "Thổ",
    hiddenStem: "Mậu · Tân · Đinh",
    tenGod: "Chính ấn"
  },
  {
    ...pillars[2],
    stemElement: "Kim",
    branchElement: "Mộc",
    hiddenStem: "Ất",
    tenGod: "Nhật chủ"
  },
  {
    ...pillars[3],
    stemElement: "Mộc",
    branchElement: "Thổ",
    hiddenStem: "Kỷ · Đinh · Ất",
    tenGod: "Thương quan"
  }
];

export const elementByLayer: Record<ElementLayerKey, ElementBalanceItem[]> = {
  global: elementDistribution,
  stem: [
    { name: "Kim", value: 2, className: "metal" },
    { name: "Hỏa", value: 1, className: "fire" },
    { name: "Mộc", value: 1, className: "wood" }
  ],
  branch: [
    { name: "Hỏa", value: 1, className: "fire" },
    { name: "Thổ", value: 2, className: "earth" },
    { name: "Mộc", value: 1, className: "wood" }
  ],
  hidden: [
    { name: "Thổ", value: 2, className: "earth" },
    { name: "Hỏa", value: 1, className: "fire" },
    { name: "Kim", value: 1, className: "metal" },
    { name: "Mộc", value: 2, className: "wood" }
  ]
};

export const tenGodHighlights = [
  { name: "Thất sát", count: 1, positions: "Trụ năm" },
  { name: "Chính ấn", count: 1, positions: "Trụ tháng" },
  { name: "Thương quan", count: 1, positions: "Trụ giờ" }
];

export const tenGodCards: TenGodCard[] = [
  {
    key: "bijian",
    name: "Tỷ kiên",
    count: 1,
    positions: "Can giờ",
    summary: "Cùng hệ với ngày chủ, thường dùng để đối chiếu khí đồng loại.",
    note: "Cần đọc cùng toàn cục, không tách riêng một trụ."
  },
  {
    key: "jiecai",
    name: "Kiếp tài",
    count: 1,
    positions: "Tàng can tháng",
    summary: "Biểu thị lớp Can gần ngày chủ nhưng khác âm dương.",
    note: "Chỉ là nhãn quy tắc, không phải kết luận tài lộc."
  },
  {
    key: "shishen",
    name: "Thực thần",
    count: 1,
    positions: "Can ngày (ẩn)",
    summary: "Liên quan lớp sinh xuất từ ngày chủ trong hệ Thập thần.",
    note: "Đối chiếu theo sách Thập thần nền."
  },
  {
    key: "shangguan",
    name: "Thương quan",
    count: 1,
    positions: "Can giờ",
    summary: "Can giờ Ất Mộc đối với Tân Kim ngày chủ.",
    note: "Ghi nhận vị trí, không phán định tốt/xấu."
  },
  {
    key: "zhengcai",
    name: "Chính tài",
    count: 1,
    positions: "Tàng can năm",
    summary: "Lớp tài theo quy ước, xuất hiện trong tàng can.",
    note: "Cần kiểm chứng theo phái đang đối chiếu."
  },
  {
    key: "piancai",
    name: "Thiên tài",
    count: 0,
    positions: "—",
    summary: "Không thấy trong bốn trụ minh hiện của bản mẫu.",
    note: "Mức đọc hiện tại: chưa thấy trong lớp tính cơ bản, không dùng làm kết luận tự động."
  },
  {
    key: "zhengguan",
    name: "Chính quan",
    count: 1,
    positions: "Can năm",
    summary: "Canh Kim năm đối chiếu với Tân Kim ngày chủ.",
    note: "Đọc như quan hệ quy tắc Can–Can."
  },
  {
    key: "qisha",
    name: "Thất sát",
    count: 1,
    positions: "Khí Ngọ (Hỏa)",
    summary: "Lớp khắc ngày chủ trong một số hệ quy tắc.",
    note: "Chỉ dùng để quan sát cấu trúc."
  },
  {
    key: "zhengyin",
    name: "Chính ấn",
    count: 1,
    positions: "Can tháng",
    summary: "Bính Hỏa tháng sinh xuất theo hướng ấn tinh.",
    note: "Cần đối chiếu tiết khí và mùa."
  },
  {
    key: "pianyin",
    name: "Thiên ấn",
    count: 1,
    positions: "Tàng can giờ",
    summary: "Ất Mộc trong Mùi đối chiếu ngày chủ.",
    note: "Ghi chú nguồn khi trích dẫn."
  }
];

export const sourceRefs = [
  "Quy tắc Can Chi nền v1.0.0",
  "Quy tắc Ngũ hành v1.0.0",
  "Quy tắc Thập thần v1.0.0",
  "Sách mệnh lý cổ — cần kiểm chứng"
];

export const archiveItems: ArchiveItem[] = [
  {
    id: "hidden-stem",
    title: "Tàng can",
    topic: "Thuật ngữ",
    layer: "Can Chi",
    status: "Cần đối chiếu",
    contentType: "Giải thích",
    description:
      "Tàng can chỉ các Thiên Can ẩn trong Địa Chi. Khi đọc Tứ Trụ cần xét cùng toàn cục, không nên tách riêng để kết luận.",
    sources: "Quy tắc Can Chi nền · Sách mệnh lý cổ cần kiểm chứng",
    usageNote: "Dùng để giải thích thuật ngữ, chưa dùng làm kết luận tự động."
  },
  {
    id: "day-master",
    title: "Nhật chủ",
    topic: "Thuật ngữ",
    layer: "Can Chi",
    status: "Đã duyệt",
    contentType: "Giải thích",
    description: "Thiên can ngày là trục quy chiếu để gán Thập thần cho các Can còn lại trong bốn trụ.",
    sources: "Quy tắc Thập thần v1.0.0",
    usageNote: "Hiển thị trong kết quả, không tự luận giải."
  },
  {
    id: "five-elements-balance",
    title: "Ngũ hành phân bố",
    topic: "Ngũ hành",
    layer: "Ngũ hành",
    status: "Đã duyệt",
    contentType: "Quy tắc đọc",
    description: "Đếm số lần xuất hiện Kim, Mộc, Thủy, Hỏa, Thổ trên các lớp Can, Chi, Tàng can để quan sát cân bằng khí.",
    sources: "Quy tắc Ngũ hành v1.0.0",
    usageNote: "Không kết luận vượng/suyệt tuyệt đối."
  },
  {
    id: "calendar-solar-lunar",
    title: "Đổi lịch dương–âm",
    topic: "Lịch pháp",
    layer: "Lịch pháp",
    status: "Đã duyệt",
    contentType: "Quy tắc tính",
    description: "Xác định tiết khí và can chi tháng theo hệ lịch pháp được chọn khi nhập ngày giờ sinh.",
    sources: "Quy tắc Lịch pháp v1.0.0 · Uyên Hải Tử Bình (tham khảo)",
    usageNote: "Bắt buộc trước khi dựng trụ."
  },
  {
    id: "ten-gods-map",
    title: "Ánh xạ Thập thần",
    topic: "Thập thần",
    layer: "Thập thần",
    status: "Cần đối chiếu",
    contentType: "Quy tắc đọc",
    description: "Mỗi Can trong bốn trụ được gán một Thập thần so với Nhật chủ, chỉ mang ý nghĩa quan hệ quy tắc.",
    sources: "Quy tắc Thập thần v1.0.0",
    usageNote: "Hiển thị dạng card, không phán mệnh."
  },
  {
    id: "dai-van-direction",
    title: "Chiều Đại vận",
    topic: "Vận hạn",
    layer: "Đại vận",
    status: "Cần đối chiếu",
    contentType: "Quy tắc tính",
    description: "Thuận hay nghịch Đại vận phụ thuộc giới tính, âm dương năm sinh và mốc tiết khí — chỉ là tham số cổ học.",
    sources: "Quy tắc Đại vận v1.0.0",
    usageNote: "Dùng cho timeline tham khảo."
  },
  {
    id: "liu-nian",
    title: "Lưu niên",
    topic: "Vận hạn",
    layer: "Lưu niên",
    status: "Đã duyệt",
    contentType: "Giải thích",
    description: "Can Chi từng năm đặt cạnh mệnh cục và Đại vận để đối chiếu chu kỳ ngắn.",
    sources: "Quy tắc Lưu niên v1.0.0",
    usageNote: "Không dùng làm dự báo chắc chắn."
  },
  {
    id: "branch-relation",
    title: "Quan hệ Địa chi",
    topic: "Can Chi",
    layer: "Can Chi",
    status: "Bản nháp",
    contentType: "Giải thích",
    description: "Hợi, xung, hình, hại giữa các Chi được liệt kê để đọc cấu trúc, không phải luận đoán đời người.",
    sources: "Quy tắc Can Chi nền",
    usageNote: "Lớp này dùng quy tắc nền, cần đọc cùng toàn cục và nguồn tham khảo."
  }
];

export const archiveTopics = ["Tất cả", "Thuật ngữ", "Can Chi", "Ngũ hành", "Thập thần", "Lịch pháp", "Vận hạn"];
export const archiveLayers = ["Tất cả", "Can Chi", "Ngũ hành", "Thập thần", "Lịch pháp", "Đại vận", "Lưu niên"];
export const archiveStatuses = ["Tất cả", "Đã duyệt", "Cần đối chiếu", "Bản nháp"];
export const archiveContentTypes = ["Tất cả", "Giải thích", "Quy tắc đọc", "Quy tắc tính"];

export const mockChartResult = {
  resultId: "TUTRU-20260517-001",
  dayMaster: dayMasterLabel,
  pillars: pillarDisplays,
  elementBalance: elementDistribution,
  elementByLayer,
  tenGodHighlights,
  tenGodCards,
  tenGodsSummary: tenGods,
  daiVan: luckCycles,
  luuNien: yearlyCycles,
  sourceRefs,
  detailCopy
};

export type AnalysisTab = "overview" | "pillars" | "elements" | "ten-gods";
