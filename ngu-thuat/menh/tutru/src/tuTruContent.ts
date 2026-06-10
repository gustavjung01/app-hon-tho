export type NavItem = {
  id: string;
  label: string;
  icon: string;
};

export type FormRow = {
  icon: string;
  label: string;
  note: string;
  control: "date" | "time" | "calendar" | "gender" | "timezone" | "place";
};

export type PillarKey = "year" | "month" | "day" | "hour";

export type Pillar = {
  key: PillarKey;
  label: string;
  stem: string;
  stemHan: string;
  branch: string;
  branchHan: string;
  elements: string[];
  relation: string;
};

export type ElementNode = {
  name: string;
  value: number;
  className: string;
};

export type TenGod = {
  name: string;
  value: number;
};

export type DetailCopy = {
  title: string;
  stem: string;
  branch: string;
  hidden: string;
  relation: string;
  note: string;
};

export type LuckCycle = {
  age: string;
  years: string;
  stem: string;
  branch: string;
};

export type YearlyCycle = {
  year: string;
  stem: string;
  branch: string;
};

export type RuleGroup = {
  id: string;
  label: string;
  version: string;
  title: string;
  body: string[];
};

export const navItems: NavItem[] = [
  { id: "home", label: "Trang chủ", icon: "門" },
  { id: "input", label: "Nhập thông tin", icon: "日" },
  { id: "overview", label: "Kết quả tổng quan", icon: "柱" },
  { id: "detail", label: "Bốn trụ chi tiết", icon: "書" },
  { id: "cycles", label: "Dòng vận", icon: "運" },
  { id: "rules", label: "Sách & Quy tắc", icon: "典" }
];

export const formRows: FormRow[] = [
  {
    icon: "日",
    label: "Ngày sinh",
    note: "Ngày tháng theo thông tin khai sinh",
    control: "date"
  },
  {
    icon: "時",
    label: "Giờ sinh",
    note: "Khoảng giờ dùng để dựng trụ giờ",
    control: "time"
  },
  {
    icon: "曆",
    label: "Loại lịch",
    note: "Chọn hệ lịch gốc của thông tin sinh",
    control: "calendar"
  },
  {
    icon: "身",
    label: "Giới tính",
    note: "Dùng cho một số quy tắc an vận truyền thống. Bốn trụ gốc không đổi theo giới tính.",
    control: "gender"
  },
  {
    icon: "地",
    label: "Múi giờ",
    note: "Giữ thời gian đúng theo nơi sinh",
    control: "timezone"
  },
  {
    icon: "居",
    label: "Nơi sinh",
    note: "Tùy chọn, phục vụ đối chiếu nghiên cứu sau",
    control: "place"
  }
];

export const pillars: Pillar[] = [
  {
    key: "year",
    label: "Năm",
    stem: "CANH",
    stemHan: "庚",
    branch: "NGỌ",
    branchHan: "午",
    elements: ["Kim", "Hỏa"],
    relation: "Canh Kim sinh trong khí Ngọ Hỏa, cần xét cùng tháng và ngày chủ."
  },
  {
    key: "month",
    label: "Tháng",
    stem: "BÍNH",
    stemHan: "丙",
    branch: "TUẤT",
    branchHan: "戌",
    elements: ["Hỏa", "Thổ"],
    relation: "Bính Hỏa trên Tuất Thổ, là điểm quan trọng khi đọc khí tiết."
  },
  {
    key: "day",
    label: "Ngày",
    stem: "TÂN",
    stemHan: "辛",
    branch: "MÃO",
    branchHan: "卯",
    elements: ["Kim", "Mộc"],
    relation: "Ngày chủ Tân Kim là trục tham chiếu để đối chiếu Thập thần."
  },
  {
    key: "hour",
    label: "Giờ",
    stem: "ẤT",
    stemHan: "乙",
    branch: "MÙI",
    branchHan: "未",
    elements: ["Mộc", "Thổ"],
    relation: "Ất Mộc tại Mùi Thổ gợi mở lớp quan sát về hậu vận và tàng can."
  }
];

export const elementDistribution: ElementNode[] = [
  { name: "Mộc", value: 2, className: "wood" },
  { name: "Hỏa", value: 2, className: "fire" },
  { name: "Thổ", value: 3, className: "earth" },
  { name: "Kim", value: 2, className: "metal" },
  { name: "Thủy", value: 1, className: "water" }
];

export const tenGods: TenGod[] = [
  { name: "Tỷ kiên", value: 1 },
  { name: "Kiếp tài", value: 1 },
  { name: "Thực thần", value: 1 },
  { name: "Thương quan", value: 1 },
  { name: "Chính tài", value: 1 },
  { name: "Thiên tài", value: 0 },
  { name: "Chính quan", value: 0 },
  { name: "Thất sát", value: 1 },
  { name: "Chính ấn", value: 1 },
  { name: "Thiên ấn", value: 1 }
];

export const detailCopy: Record<PillarKey, DetailCopy> = {
  year: {
    title: "CANH NGỌ",
    stem: "CANH thuộc Dương Kim, tượng kim loại rắn, cần xét trong toàn cục để tránh đọc riêng lẻ.",
    branch: "NGỌ thuộc Dương Hỏa, có khí Hỏa rõ, bên trong còn có lớp tàng can cần đối chiếu.",
    hidden: "Tàng can thường xét Đinh và Kỷ, dùng như lớp nền khi phân tích quan hệ.",
    relation: "Canh Kim gặp Ngọ Hỏa tạo điểm căng giữa Kim và Hỏa, chỉ nên xem như một gợi mở theo cổ học.",
    note: "Trụ năm thường dùng để nhìn bối cảnh rộng, không dùng để kết luận một chiều."
  },
  month: {
    title: "BÍNH TUẤT",
    stem: "BÍNH thuộc Dương Hỏa, tượng ánh sáng rõ, có vai trò nổi bật khi đặt cạnh ngày chủ.",
    branch: "TUẤT thuộc Thổ, là chi có nhiều lớp khí, thường cần đọc cùng tiết khí.",
    hidden: "Tàng can có Mậu, Tân, Đinh; mỗi lớp được xét theo vị trí và mùa sinh.",
    relation: "Hỏa sinh Thổ, nhưng ý nghĩa chỉ rõ khi đối chiếu đầy đủ Can Chi bốn trụ.",
    note: "Trụ tháng là trọng tâm về khí lệnh trong nhiều hệ quy tắc."
  },
  day: {
    title: "TÂN MÃO",
    stem: "TÂN thuộc Âm Kim, là ngày chủ trong bản mẫu này, dùng làm trục cho Thập thần.",
    branch: "MÃO thuộc Âm Mộc, khí Mộc rõ, giúp hình thành quan hệ giữa ngày chủ và địa chi.",
    hidden: "Mão chủ yếu xét Ất Mộc, đọc theo tương quan với Tân Kim.",
    relation: "Kim khắc Mộc là một quan hệ quy tắc, không phải một phán đoán về đời sống.",
    note: "Trụ ngày là điểm quy chiếu, cần đọc cùng ba trụ còn lại."
  },
  hour: {
    title: "ẤT MÙI",
    stem: "ẤT thuộc Âm Mộc, tượng cỏ cây mềm, khi đọc cần đặt cạnh khí tháng và ngày chủ.",
    branch: "MÙI thuộc Thổ, chứa nhiều lớp tàng can nên không nên giản lược thành một nghĩa duy nhất.",
    hidden: "Tàng can thường xét Kỷ, Đinh, Ất theo thứ tự và lực khí.",
    relation: "Mộc và Thổ tạo một điểm đối chiếu để đọc nhịp sinh khắc trong toàn cục.",
    note: "Trụ giờ thường được dùng cho lớp quan sát muộn hơn, vẫn là công cụ tham khảo."
  }
};

export const luckCycles: LuckCycle[] = [
  { age: "2-11", years: "1992-2001", stem: "ẤT", branch: "Tỵ" },
  { age: "12-21", years: "2002-2011", stem: "GIÁP", branch: "Thìn" },
  { age: "22-31", years: "2012-2021", stem: "QUÝ", branch: "Mão" },
  { age: "32-41", years: "2022-2031", stem: "NHÂM", branch: "Dần" },
  { age: "42-51", years: "2032-2041", stem: "TÂN", branch: "Sửu" },
  { age: "52-61", years: "2042-2051", stem: "CANH", branch: "Tý" },
  { age: "62-71", years: "2052-2061", stem: "KỶ", branch: "Hợi" }
];

export const yearlyCycles: YearlyCycle[] = [
  { year: "2024", stem: "GIÁP", branch: "THÌN" },
  { year: "2025", stem: "ẤT", branch: "TỴ" },
  { year: "2026", stem: "BÍNH", branch: "NGỌ" },
  { year: "2027", stem: "ĐINH", branch: "MÙI" },
  { year: "2028", stem: "MẬU", branch: "THÂN" }
];

export const ruleGroups: RuleGroup[] = [
  {
    id: "calendar",
    label: "Lịch pháp",
    version: "v1.0.0",
    title: "LỊCH PHÁP",
    body: [
      "Quy tắc đổi lịch dương/âm, tính tiết khí khi theo hệ thống lịch pháp cổ truyền.",
      "Nguồn tham khảo: Uyên Hải Tử Bình, Tam Mệnh Thông Hội, các tài liệu lịch pháp cổ."
    ]
  },
  {
    id: "can-chi",
    label: "Can Chi",
    version: "v1.0.0",
    title: "CAN CHI",
    body: [
      "Hệ Thiên Can và Địa Chi dùng để lập bốn trụ theo năm, tháng, ngày, giờ.",
      "Quy tắc đọc dựa trên quan hệ âm dương, sinh khắc và vị trí trong toàn cục."
    ]
  },
  {
    id: "five-elements",
    label: "Ngũ hành",
    version: "v1.0.0",
    title: "NGŨ HÀNH",
    body: [
      "Mộc, Hỏa, Thổ, Kim, Thủy được dùng như hệ quy chiếu để quan sát cân bằng khí.",
      "Kết quả là một cách nhìn để tự quan sát, không phải kết luận chắc chắn."
    ]
  },
  {
    id: "ten-gods",
    label: "Thập thần",
    version: "v1.0.0",
    title: "THẬP THẦN",
    body: [
      "Thập thần được tính từ ngày chủ, giúp đối chiếu các quan hệ Can Chi trong bốn trụ.",
      "Mỗi nhãn là một thuật ngữ nghiên cứu, cần đọc trong ngữ cảnh toàn cục."
    ]
  },
  {
    id: "luck",
    label: "Đại vận",
    version: "v1.0.0",
    title: "ĐẠI VẬN",
    body: [
      "Đại vận biểu diễn chu kỳ dài để đối chiếu theo quy tắc cổ học.",
      "Chiều đi và điểm khởi vận phụ thuộc vào giới tính, âm dương năm sinh và mốc tiết khí."
    ]
  },
  {
    id: "yearly",
    label: "Lưu niên",
    version: "v1.0.0",
    title: "LƯU NIÊN",
    body: [
      "Lưu niên là Can Chi từng năm, dùng để đặt cạnh mệnh cục và đại vận.",
      "Phần này chỉ phục vụ tham khảo và dẫn nguồn, không tự phán thay người nghiên cứu."
    ]
  }
];
