export type KnowledgeCardStatus = "core" | "reference" | "candidate" | "needs_review";
export type KnowledgeCardSourceLevel = "core_rule" | "reference" | "candidate";

export type KnowledgeCard = {
  id: string;
  title: string;
  group: string;
  topic: string;
  status: KnowledgeCardStatus;
  whenUse: {
    stems?: string[];
    branches?: string[];
    pillars?: string[];
    dayMasters?: string[];
    elements?: string[];
    hiddenStems?: string[];
    tenGods?: string[];
    relations?: string[];
    chartFlags?: string[];
  };
  tags: string[];
  body: string;
  analysisHint: string;
  usageNote: string;
  sourceLevel: KnowledgeCardSourceLevel;
  priority: number;
};

const TERM_CARDS: KnowledgeCard[] = [
  {
    id: "term_tu_tru",
    title: "Tứ Trụ",
    group: "Thuật ngữ",
    topic: "Nền tảng",
    status: "core",
    whenUse: { chartFlags: ["has-core-four-pillars"] },
    tags: ["tu-tru", "khung-doc"],
    body: "Tứ Trụ là khung gồm trụ năm, tháng, ngày, giờ được dựng từ ngày giờ sinh theo Can Chi.",
    analysisHint: "Bản đồ hiện tại đã có đủ bốn trụ để đối chiếu.",
    usageNote: "Dùng để định vị cấu trúc, không dùng riêng để kết luận vận mệnh.",
    sourceLevel: "core_rule",
    priority: 14
  },
  {
    id: "term_can_chi",
    title: "Can Chi",
    group: "Thuật ngữ",
    topic: "Nền tảng",
    status: "core",
    whenUse: { chartFlags: ["has-core-four-pillars"] },
    tags: ["can-chi", "luc-thap-hoa-giap"],
    body: "Can Chi là hệ phối giữa Thiên Can và Địa Chi. Mỗi trụ trong Tứ Trụ là một cặp Can Chi.",
    analysisHint: "Các trụ được đọc theo cặp Can Chi, không tách rời Can và Chi.",
    usageNote: "Cần đặt trong toàn cục trước khi đi sâu quan hệ.",
    sourceLevel: "core_rule",
    priority: 13
  },
  {
    id: "term_thien_can",
    title: "Thiên Can",
    group: "Thuật ngữ",
    topic: "Can Chi",
    status: "core",
    whenUse: { chartFlags: ["has-core-four-pillars"] },
    tags: ["thien-can", "stem"],
    body: "Thiên Can là lớp khí biểu hiện ở phần Can của mỗi trụ, dùng để đối chiếu Nhật chủ và Thập thần.",
    analysisHint: "Nên đọc lớp Thiên Can trước khi tổng hợp với Địa Chi và Tàng can.",
    usageNote: "Không dùng một Can đơn lẻ để kết luận.",
    sourceLevel: "core_rule",
    priority: 12
  },
  {
    id: "term_dia_chi",
    title: "Địa Chi",
    group: "Thuật ngữ",
    topic: "Can Chi",
    status: "core",
    whenUse: { chartFlags: ["has-core-four-pillars"] },
    tags: ["dia-chi", "branch"],
    body: "Địa Chi là lớp nền theo thời gian và khí mùa, đồng thời chứa Tàng can cần đối chiếu sâu hơn.",
    analysisHint: "Khi đọc Địa Chi cần mở thêm lớp Tàng can đi kèm.",
    usageNote: "Không chỉ nhìn hành bề mặt của Chi.",
    sourceLevel: "core_rule",
    priority: 12
  },
  {
    id: "term_nhat_chu",
    title: "Nhật chủ",
    group: "Thuật ngữ",
    topic: "Trục đọc",
    status: "core",
    whenUse: { chartFlags: ["has-core-four-pillars"] },
    tags: ["nhat-chu", "tru-ngay"],
    body: "Nhật chủ là Thiên Can của trụ ngày, dùng làm trục quy chiếu để đọc quan hệ Ngũ hành và Thập thần.",
    analysisHint: "Nhật chủ là điểm trung tâm để tổ chức phần nhận xét cấu trúc.",
    usageNote: "Không dùng riêng Nhật chủ để kết luận đời người.",
    sourceLevel: "core_rule",
    priority: 16
  },
  {
    id: "term_nham_thuy",
    title: "Nhâm Thủy",
    group: "Thuật ngữ",
    topic: "Nhật chủ cụ thể",
    status: "core",
    whenUse: { dayMasters: ["Nhâm Thủy"], stems: ["Nhâm"], elements: ["Thủy"] },
    tags: ["nham-thuy", "nhat-chu", "thuy"],
    body: "Nhâm Thủy là một dạng Nhật chủ thuộc Dương Thủy, dùng làm trục đối chiếu quan hệ sinh trợ, đồng hành, sinh xuất và khắc chế.",
    analysisHint: "Khi Nhật chủ là Nhâm Thủy, ưu tiên đọc các quan hệ Kim sinh Thủy, Thổ khắc Thủy, Thủy sinh Mộc và Thủy khắc Hỏa.",
    usageNote: "Đây là trục quy chiếu cấu trúc, không phải kết luận định mệnh.",
    sourceLevel: "core_rule",
    priority: 18
  },
  {
    id: "term_ngu_hanh",
    title: "Ngũ hành",
    group: "Thuật ngữ",
    topic: "Ngũ hành",
    status: "core",
    whenUse: { chartFlags: ["has-element-balance"] },
    tags: ["ngu-hanh", "kim-moc-thuy-hoa-tho"],
    body: "Ngũ hành gồm Kim, Mộc, Thủy, Hỏa, Thổ. Trong bản đồ Tứ Trụ, hành xuất hiện qua Can, Chi và Tàng can.",
    analysisHint: "Phân bố hành nên đọc theo tỷ lệ và quan hệ với Nhật chủ.",
    usageNote: "Không kết luận tốt/xấu tuyệt đối chỉ từ số lượng.",
    sourceLevel: "core_rule",
    priority: 14
  },
  {
    id: "term_tang_can",
    title: "Tàng can",
    group: "Thuật ngữ",
    topic: "Tàng can",
    status: "core",
    whenUse: { chartFlags: ["has-hidden-stems"] },
    tags: ["tang-can", "hidden-stems"],
    body: "Tàng can là các Can ẩn trong Địa Chi, bổ sung lớp khí bên dưới bề mặt của trụ.",
    analysisHint: "Lá số có nhiều Địa Chi chứa tàng can, cần đưa lớp ẩn vào phân tích.",
    usageNote: "Không bỏ qua tàng can khi đọc quan hệ.",
    sourceLevel: "core_rule",
    priority: 15
  },
  {
    id: "term_thap_than",
    title: "Thập thần",
    group: "Thuật ngữ",
    topic: "Thập thần",
    status: "core",
    whenUse: { chartFlags: ["has-ten-gods"] },
    tags: ["thap-than", "quan-he-voi-nhat-chu"],
    body: "Thập thần là hệ gọi tên các quan hệ giữa Can với Nhật chủ. Đây là lớp quan hệ cấu trúc, không phải nhãn cố định.",
    analysisHint: "Thập thần được đọc theo vị trí xuất hiện và tần suất.",
    usageNote: "Không dùng riêng để phán nghề nghiệp, hôn nhân, tài vận.",
    sourceLevel: "core_rule",
    priority: 14
  },
  {
    id: "term_vuong_suy",
    title: "Vượng suy",
    group: "Thuật ngữ",
    topic: "Vượng suy",
    status: "reference",
    whenUse: { chartFlags: ["has-element-balance"] },
    tags: ["vuong-suy", "mua-sinh"],
    body: "Vượng suy là lớp đánh giá lực khí theo mùa và toàn cục, không chỉ dựa trên số lượng hành.",
    analysisHint: "Kết luận mạnh/yếu cần thêm lớp mùa sinh và khí tiết.",
    usageNote: "Ở bản hiện tại chỉ đối chiếu mức cơ bản.",
    sourceLevel: "reference",
    priority: 10
  },
  {
    id: "term_dai_van",
    title: "Đại vận",
    group: "Thuật ngữ",
    topic: "Dòng vận",
    status: "reference",
    whenUse: { chartFlags: ["has-cycles-section"] },
    tags: ["dai-van", "chu-ky"],
    body: "Đại vận là chu kỳ nhiều năm dùng để đối chiếu sau khi đã có bản đồ gốc.",
    analysisHint: "Đại vận chỉ nên đọc sau khi thống nhất khung bốn trụ.",
    usageNote: "Không dùng làm kết luận sự kiện chắc chắn.",
    sourceLevel: "reference",
    priority: 7
  },
  {
    id: "term_luu_nien",
    title: "Lưu niên",
    group: "Thuật ngữ",
    topic: "Dòng vận",
    status: "reference",
    whenUse: { chartFlags: ["has-cycles-section"] },
    tags: ["luu-nien", "chu-ky"],
    body: "Lưu niên là lớp năm cụ thể để đối chiếu cùng bản đồ gốc và đại vận.",
    analysisHint: "Lưu niên cần đặt trong bối cảnh đại vận và toàn cục.",
    usageNote: "Không đọc tách rời để kết luận chắc chắn.",
    sourceLevel: "reference",
    priority: 7
  },
  {
    id: "term_tiet_khi",
    title: "Tiết khí",
    group: "Thuật ngữ",
    topic: "Lịch pháp",
    status: "core",
    whenUse: { chartFlags: ["uses-solar-calendar"] },
    tags: ["tiet-khi", "lich-phap"],
    body: "Tiết khí là các mốc khí trong năm, ảnh hưởng cách lập trụ tháng và đọc khí mùa.",
    analysisHint: "Khi lập trụ tháng cần đi qua lớp tiết khí thay vì chỉ dùng tháng dương lịch.",
    usageNote: "Nên đối chiếu với dữ liệu lịch pháp chuẩn khi mở rộng.",
    sourceLevel: "core_rule",
    priority: 12
  },
  {
    id: "term_lap_xuan",
    title: "Lập Xuân",
    group: "Thuật ngữ",
    topic: "Lịch pháp",
    status: "core",
    whenUse: { chartFlags: ["lap-xuan-year-boundary"] },
    tags: ["lap-xuan", "tru-nam"],
    body: "Lập Xuân là mốc quan trọng khi đổi năm theo tiết khí. Người sinh trước Lập Xuân có thể vẫn thuộc trụ năm trước.",
    analysisHint: "Lá số nằm trước Lập Xuân nên trụ năm cần đọc theo mốc khí, không theo mốc Tết dương.",
    usageNote: "Dùng làm quy tắc lịch pháp, không phải lớp luận đoán.",
    sourceLevel: "core_rule",
    priority: 17
  },
  {
    id: "term_tru_nam",
    title: "Trụ năm",
    group: "Thuật ngữ",
    topic: "Bốn trụ",
    status: "core",
    whenUse: { pillars: ["Năm"] },
    tags: ["tru-nam", "pillar-year"],
    body: "Trụ năm thường dùng để quan sát bối cảnh gốc và lớp thông tin xa.",
    analysisHint: "Trụ năm nên đọc cùng ba trụ còn lại.",
    usageNote: "Không dùng riêng để kết luận.",
    sourceLevel: "core_rule",
    priority: 11
  },
  {
    id: "term_tru_thang",
    title: "Trụ tháng",
    group: "Thuật ngữ",
    topic: "Bốn trụ",
    status: "core",
    whenUse: { pillars: ["Tháng"] },
    tags: ["tru-thang", "pillar-month"],
    body: "Trụ tháng liên quan khí mùa và nhịp tiết khí, là lớp quan trọng khi đọc vượng suy.",
    analysisHint: "Trụ tháng là điểm cần đặt trọng số khi đối chiếu khí mùa.",
    usageNote: "Không tách rời khỏi Nhật chủ và toàn cục.",
    sourceLevel: "core_rule",
    priority: 12
  },
  {
    id: "term_tru_ngay",
    title: "Trụ ngày",
    group: "Thuật ngữ",
    topic: "Bốn trụ",
    status: "core",
    whenUse: { pillars: ["Ngày"] },
    tags: ["tru-ngay", "pillar-day"],
    body: "Trụ ngày chứa Nhật chủ, là trục chính để đối chiếu các lớp quan hệ.",
    analysisHint: "Phần nhận xét nên lấy trụ ngày làm điểm bắt đầu.",
    usageNote: "Không rút gọn thành phán đoán tính cách.",
    sourceLevel: "core_rule",
    priority: 15
  },
  {
    id: "term_tru_gio",
    title: "Trụ giờ",
    group: "Thuật ngữ",
    topic: "Bốn trụ",
    status: "core",
    whenUse: { pillars: ["Giờ"] },
    tags: ["tru-gio", "pillar-hour"],
    body: "Trụ giờ bổ sung lớp thời điểm trong ngày và một số quan hệ phát triển muộn hơn.",
    analysisHint: "Trụ giờ dùng để bổ sung, không thay thế trục đọc chính.",
    usageNote: "Luôn đọc cùng năm-tháng-ngày.",
    sourceLevel: "core_rule",
    priority: 10
  }
];

const STEMS = [
  { name: "Giáp", element: "Mộc", polarity: "Dương", note: "khởi phát, mở đường" },
  { name: "Ất", element: "Mộc", polarity: "Âm", note: "mềm dẻo, bám mạch" },
  { name: "Bính", element: "Hỏa", polarity: "Dương", note: "chiếu sáng, bộc lộ" },
  { name: "Đinh", element: "Hỏa", polarity: "Âm", note: "tinh luyện, kết tụ" },
  { name: "Mậu", element: "Thổ", polarity: "Dương", note: "trụ nền, định hình" },
  { name: "Kỷ", element: "Thổ", polarity: "Âm", note: "điều hòa, giữ nếp" },
  { name: "Canh", element: "Kim", polarity: "Dương", note: "rõ nét, chỉnh lý" },
  { name: "Tân", element: "Kim", polarity: "Âm", note: "tinh tế, chắt lọc" },
  { name: "Nhâm", element: "Thủy", polarity: "Dương", note: "dòng lớn, lan tỏa" },
  { name: "Quý", element: "Thủy", polarity: "Âm", note: "thấm sâu, tích tụ" }
] as const;

const STEM_CARDS: KnowledgeCard[] = STEMS.map((stem) => ({
  id: `stem_${stem.name.toLowerCase()}`,
  title: stem.name,
  group: "Thiên Can",
  topic: "Thiên Can đơn",
  status: "core",
  whenUse: { stems: [stem.name], elements: [stem.element] },
  tags: ["thien-can", stem.name.toLowerCase(), stem.element.toLowerCase()],
  body: `${stem.name} thuộc ${stem.polarity} ${stem.element}. Ở lớp cấu trúc cơ bản, Can này gợi ý nhịp khí ${stem.note} trong vị trí xuất hiện.`,
  analysisHint: `Vì lá số có Can ${stem.name}, nên đọc thêm lớp ${stem.element} theo ngữ cảnh trụ và Nhật chủ.`,
  usageNote: "Không dùng một Can đơn lẻ để kết luận tính cách hay vận trình.",
  sourceLevel: "core_rule",
  priority: stem.name === "Nhâm" ? 16 : 12
}));

const BRANCH_DEFS = [
  { name: "Tý", element: "Thủy", hidden: ["Quý"] },
  { name: "Sửu", element: "Thổ", hidden: ["Kỷ", "Quý", "Tân"] },
  { name: "Dần", element: "Mộc", hidden: ["Giáp", "Bính", "Mậu"] },
  { name: "Mão", element: "Mộc", hidden: ["Ất"] },
  { name: "Thìn", element: "Thổ", hidden: ["Mậu", "Ất", "Quý"] },
  { name: "Tỵ", element: "Hỏa", hidden: ["Bính", "Mậu", "Canh"] },
  { name: "Ngọ", element: "Hỏa", hidden: ["Đinh", "Kỷ"] },
  { name: "Mùi", element: "Thổ", hidden: ["Kỷ", "Đinh", "Ất"] },
  { name: "Thân", element: "Kim", hidden: ["Canh", "Nhâm", "Mậu"] },
  { name: "Dậu", element: "Kim", hidden: ["Tân"] },
  { name: "Tuất", element: "Thổ", hidden: ["Mậu", "Tân", "Đinh"] },
  { name: "Hợi", element: "Thủy", hidden: ["Nhâm", "Giáp"] }
] as const;

const BRANCH_CARDS: KnowledgeCard[] = BRANCH_DEFS.map((branch) => ({
  id: `branch_${branch.name.toLowerCase()}`,
  title: branch.name,
  group: "Địa Chi",
  topic: "Địa Chi đơn",
  status: "core",
  whenUse: { branches: [branch.name], elements: [branch.element], hiddenStems: [...branch.hidden] },
  tags: ["dia-chi", branch.name.toLowerCase(), branch.element.toLowerCase()],
  body: `${branch.name} có hành chính ${branch.element}, và mang lớp tàng can ${branch.hidden.join(", ")}.`,
  analysisHint: `Vì có Chi ${branch.name}, cần xét lớp ẩn ${branch.hidden.join(", ")} thay vì chỉ nhìn hành bề mặt.`,
  usageNote: "Không dùng một Chi riêng lẻ để kết luận tốt xấu.",
  sourceLevel: "core_rule",
  priority: 12
}));

const HIDDEN_STEM_CARDS: KnowledgeCard[] = BRANCH_DEFS.map((branch) => ({
  id: `hidden_${branch.name.toLowerCase()}`,
  title: `Tàng can của ${branch.name}`,
  group: "Tàng can",
  topic: "Tàng can theo Địa Chi",
  status: "core",
  whenUse: { branches: [branch.name], hiddenStems: [...branch.hidden], chartFlags: ["has-hidden-stems"] },
  tags: ["tang-can", branch.name.toLowerCase(), ...branch.hidden.map((item) => item.toLowerCase())],
  body: `${branch.name} chứa ${branch.hidden.join(", ")}. Khi đọc cần xét vị trí, mùa sinh và toàn cục, không chỉ nhìn hành của Địa Chi.`,
  analysisHint: `Vì lá số có ${branch.name}, cần đưa lớp tàng can ${branch.hidden.join(", ")} vào đối chiếu.`,
  usageNote: "Tàng can là lớp bổ sung, không dùng để phán định một chiều.",
  sourceLevel: "core_rule",
  priority: ["Tý", "Sửu", "Tuất", "Mùi"].includes(branch.name) ? 18 : 13
}));

const ELEMENT_CARDS: KnowledgeCard[] = [
  {
    id: "element_kim",
    title: "Kim",
    group: "Ngũ hành",
    topic: "Hành đơn",
    status: "core",
    whenUse: { elements: ["Kim"] },
    tags: ["kim", "ngu-hanh"],
    body: "Kim là một hành trong ngũ hành, thường được đọc theo vai trò hỗ trợ, bị khắc, hoặc sinh xuất tùy trục Nhật chủ.",
    analysisHint: "Sự hiện diện của Kim cần đọc cùng quan hệ với Nhật chủ.",
    usageNote: "Không kết luận tốt/xấu tuyệt đối chỉ vì Kim nhiều hay ít.",
    sourceLevel: "core_rule",
    priority: 10
  },
  {
    id: "element_moc",
    title: "Mộc",
    group: "Ngũ hành",
    topic: "Hành đơn",
    status: "core",
    whenUse: { elements: ["Mộc"] },
    tags: ["moc", "ngu-hanh"],
    body: "Mộc là hành biểu thị hướng sinh trưởng trong lớp cấu trúc ngũ hành.",
    analysisHint: "Mộc nên đọc cùng dòng sinh/khắc quanh Nhật chủ.",
    usageNote: "Không dùng riêng để kết luận về kết quả cuộc sống.",
    sourceLevel: "core_rule",
    priority: 10
  },
  {
    id: "element_thuy",
    title: "Thủy",
    group: "Ngũ hành",
    topic: "Hành đơn",
    status: "core",
    whenUse: { elements: ["Thủy"] },
    tags: ["thuy", "ngu-hanh"],
    body: "Thủy là hành biểu thị hướng lưu chuyển và liên kết khí trong nhiều cấu trúc.",
    analysisHint: "Thủy cần đọc cùng lớp sinh trợ và áp lực tương ứng.",
    usageNote: "Không kết luận mạnh yếu tuyệt đối khi thiếu bối cảnh mùa sinh.",
    sourceLevel: "core_rule",
    priority: 12
  },
  {
    id: "element_hoa",
    title: "Hỏa",
    group: "Ngũ hành",
    topic: "Hành đơn",
    status: "core",
    whenUse: { elements: ["Hỏa"] },
    tags: ["hoa", "ngu-hanh"],
    body: "Hỏa là hành biểu thị hướng biểu lộ và bốc phát trong lớp quan hệ cơ bản.",
    analysisHint: "Hỏa được đọc qua vị trí và quan hệ với Nhật chủ.",
    usageNote: "Không gắn kết luận tốt/xấu chỉ từ một hành.",
    sourceLevel: "core_rule",
    priority: 10
  },
  {
    id: "element_tho",
    title: "Thổ",
    group: "Ngũ hành",
    topic: "Hành đơn",
    status: "core",
    whenUse: { elements: ["Thổ"] },
    tags: ["tho", "ngu-hanh"],
    body: "Thổ là hành biểu thị lớp trụ nền và điều tiết trung gian trong nhiều quan hệ.",
    analysisHint: "Thổ nổi bật thường tạo trọng điểm cần đối chiếu thêm quanh Nhật chủ.",
    usageNote: "Không dùng riêng để kết luận định mệnh.",
    sourceLevel: "core_rule",
    priority: 11
  }
];

const ELEMENT_RELATION_CARDS: KnowledgeCard[] = [
  { id: "rel_moc_sinh_hoa", title: "Mộc sinh Hỏa", relation: "Mộc sinh Hỏa" },
  { id: "rel_hoa_sinh_tho", title: "Hỏa sinh Thổ", relation: "Hỏa sinh Thổ" },
  { id: "rel_tho_sinh_kim", title: "Thổ sinh Kim", relation: "Thổ sinh Kim" },
  { id: "rel_kim_sinh_thuy", title: "Kim sinh Thủy", relation: "Kim sinh Thủy" },
  { id: "rel_thuy_sinh_moc", title: "Thủy sinh Mộc", relation: "Thủy sinh Mộc" },
  { id: "rel_moc_khac_tho", title: "Mộc khắc Thổ", relation: "Mộc khắc Thổ" },
  { id: "rel_tho_khac_thuy", title: "Thổ khắc Thủy", relation: "Thổ khắc Thủy" },
  { id: "rel_thuy_khac_hoa", title: "Thủy khắc Hỏa", relation: "Thủy khắc Hỏa" },
  { id: "rel_hoa_khac_kim", title: "Hỏa khắc Kim", relation: "Hỏa khắc Kim" },
  { id: "rel_kim_khac_moc", title: "Kim khắc Mộc", relation: "Kim khắc Mộc" }
].map((item) => ({
  id: item.id,
  title: item.title,
  group: "Ngũ hành",
  topic: "Sinh khắc cơ bản",
  status: "core" as const,
  whenUse: { relations: [item.relation] },
  tags: ["ngu-hanh", "sinh-khac", item.id],
  body: `${item.relation} là quan hệ cơ bản trong vòng sinh khắc. Khi xuất hiện cần đọc theo vị trí trong bốn trụ và trục Nhật chủ.`,
  analysisHint: `Có thể dùng quan hệ “${item.relation}” để mô tả lực tác động trong lớp đọc cấu trúc.`,
  usageNote: "Đây là quan hệ kỹ thuật, không phải kết luận tốt/xấu tuyệt đối.",
  sourceLevel: "core_rule" as const,
  priority: ["rel_kim_sinh_thuy", "rel_tho_khac_thuy", "rel_thuy_sinh_moc", "rel_thuy_khac_hoa"].includes(item.id) ? 20 : 12
}));

const TEN_GOD_CARDS: KnowledgeCard[] = [
  {
    name: "Tỷ kiên",
    note: "lớp đồng hành cùng hành với Nhật chủ",
    usage: "Đọc về mức đồng hành và tính đồng cực.",
    priority: 12
  },
  {
    name: "Kiếp tài",
    note: "lớp đồng hành khác cực với Nhật chủ",
    usage: "Đọc về tương tác cùng hành nhưng khác cực.",
    priority: 12
  },
  {
    name: "Thực thần",
    note: "lớp Nhật chủ sinh xuất đồng cực",
    usage: "Đọc hướng sinh xuất ở lớp cơ bản.",
    priority: 11
  },
  {
    name: "Thương quan",
    note: "lớp Nhật chủ sinh xuất khác cực",
    usage: "Đọc lớp biểu hiện cần đối chiếu vị trí.",
    priority: 11
  },
  {
    name: "Chính tài",
    note: "lớp Nhật chủ khắc khác cực",
    usage: "Đọc quan hệ tài ở lớp kỹ thuật, không tự suy diễn.",
    priority: 10
  },
  {
    name: "Thiên tài",
    note: "lớp Nhật chủ khắc đồng cực",
    usage: "Đọc quan hệ tài theo vị trí và tần suất.",
    priority: 10
  },
  {
    name: "Chính quan",
    note: "lớp khắc Nhật chủ khác cực",
    usage: "Đọc lớp áp lực quy tắc cần đối chiếu toàn cục.",
    priority: 12
  },
  {
    name: "Thất sát",
    note: "lớp khắc Nhật chủ đồng cực",
    usage: "Đọc lớp áp lực mạnh theo ngữ cảnh.",
    priority: 12
  },
  {
    name: "Chính ấn",
    note: "lớp sinh Nhật chủ khác cực",
    usage: "Đọc lớp sinh trợ theo vị trí xuất hiện.",
    priority: 12
  },
  {
    name: "Thiên ấn",
    note: "lớp sinh Nhật chủ đồng cực",
    usage: "Đọc lớp trợ lực theo toàn cục.",
    priority: 12
  }
].map((item) => ({
  id: `ten_god_${item.name.toLowerCase().replace(/\s+/g, "_")}`,
  title: item.name,
  group: "Thập thần",
  topic: "Tổng quan",
  status: "core" as const,
  whenUse: { tenGods: [item.name], chartFlags: ["has-ten-gods"] },
  tags: ["thap-than", item.name.toLowerCase().replace(/\s+/g, "-")],
  body: `${item.name} là ${item.note}.`,
  analysisHint: `${item.name} xuất hiện thì nên ghi vị trí và tần suất thay vì luận đoán tuyệt đối.`,
  usageNote: "Không dùng riêng để kết luận nghề nghiệp, hôn nhân hay tài vận chắc chắn.",
  sourceLevel: "core_rule" as const,
  priority: item.priority
}));

const NHAM_RELATION_MAP = [
  { stem: "Giáp", tenGod: "Thực thần", relation: "Thủy sinh Mộc" },
  { stem: "Ất", tenGod: "Thương quan", relation: "Thủy sinh Mộc" },
  { stem: "Bính", tenGod: "Thiên tài", relation: "Thủy khắc Hỏa" },
  { stem: "Đinh", tenGod: "Chính tài", relation: "Thủy khắc Hỏa" },
  { stem: "Mậu", tenGod: "Thất sát", relation: "Thổ khắc Thủy" },
  { stem: "Kỷ", tenGod: "Chính quan", relation: "Thổ khắc Thủy" },
  { stem: "Canh", tenGod: "Thiên ấn", relation: "Kim sinh Thủy" },
  { stem: "Tân", tenGod: "Chính ấn", relation: "Kim sinh Thủy" },
  { stem: "Nhâm", tenGod: "Tỷ kiên", relation: "Đồng hành Thủy" },
  { stem: "Quý", tenGod: "Kiếp tài", relation: "Đồng hành Thủy" }
] as const;

const NHAM_SPECIFIC_CARDS: KnowledgeCard[] = NHAM_RELATION_MAP.map((item) => ({
  id: `nham_gap_${item.stem.toLowerCase()}`,
  title: `Nhâm gặp ${item.stem}`,
  group: "Thập thần",
  topic: "Nhâm Thủy đối chiếu Can",
  status: "core",
  whenUse: {
    dayMasters: ["Nhâm Thủy"],
    stems: [item.stem],
    hiddenStems: [item.stem],
    tenGods: [item.tenGod],
    relations: [item.relation]
  },
  tags: ["nham-thuy", "thap-than", item.stem.toLowerCase(), item.tenGod.toLowerCase().replace(/\s+/g, "-")],
  body: `Khi Nhật chủ là Nhâm Thủy và gặp ${item.stem}, quan hệ cơ bản quy về ${item.tenGod}.`,
  analysisHint: `Nhâm gặp ${item.stem} có thể đọc ở lớp ${item.tenGod}, cần xét thêm vị trí xuất hiện.`,
  usageNote: "Chỉ là lớp quy chiếu quan hệ, không phải kết luận định mệnh.",
  sourceLevel: "core_rule",
  priority: ["Giáp", "Đinh", "Mậu", "Kỷ", "Tân", "Quý"].includes(item.stem) ? 22 : 16
}));

type BranchRelationDef = {
  id: string;
  title: string;
  relationType: "lục hợp" | "lục xung" | "hình" | "hại" | "phá" | "tam hợp" | "tam hội";
  branches: string[];
  status?: KnowledgeCardStatus;
  sourceLevel?: KnowledgeCardSourceLevel;
  priority?: number;
};

const BRANCH_RELATIONS: BranchRelationDef[] = [
  { id: "ty-suu-hop", title: "Tý - Sửu hợp", relationType: "lục hợp", branches: ["Tý", "Sửu"], priority: 23 },
  { id: "dan-hoi-hop", title: "Dần - Hợi hợp", relationType: "lục hợp", branches: ["Dần", "Hợi"] },
  { id: "mao-tuat-hop", title: "Mão - Tuất hợp", relationType: "lục hợp", branches: ["Mão", "Tuất"] },
  { id: "thin-dau-hop", title: "Thìn - Dậu hợp", relationType: "lục hợp", branches: ["Thìn", "Dậu"] },
  { id: "ty-than-hop", title: "Tỵ - Thân hợp", relationType: "lục hợp", branches: ["Tỵ", "Thân"] },
  { id: "ngo-mui-hop", title: "Ngọ - Mùi hợp", relationType: "lục hợp", branches: ["Ngọ", "Mùi"] },

  { id: "ty-ngo-xung", title: "Tý - Ngọ xung", relationType: "lục xung", branches: ["Tý", "Ngọ"] },
  { id: "suu-mui-xung", title: "Sửu - Mùi xung", relationType: "lục xung", branches: ["Sửu", "Mùi"], priority: 24 },
  { id: "dan-than-xung", title: "Dần - Thân xung", relationType: "lục xung", branches: ["Dần", "Thân"] },
  { id: "mao-dau-xung", title: "Mão - Dậu xung", relationType: "lục xung", branches: ["Mão", "Dậu"] },
  { id: "thin-tuat-xung", title: "Thìn - Tuất xung", relationType: "lục xung", branches: ["Thìn", "Tuất"] },
  { id: "ty-hoi-xung", title: "Tỵ - Hợi xung", relationType: "lục xung", branches: ["Tỵ", "Hợi"] },

  { id: "tuat-mui-hinh", title: "Tuất - Mùi hình", relationType: "hình", branches: ["Tuất", "Mùi"], priority: 23 },
  { id: "suu-tuat-hinh", title: "Sửu - Tuất hình", relationType: "hình", branches: ["Sửu", "Tuất"], status: "candidate", sourceLevel: "candidate", priority: 17 },
  { id: "suu-mui-hinh", title: "Sửu - Mùi hình", relationType: "hình", branches: ["Sửu", "Mùi"], status: "candidate", sourceLevel: "candidate", priority: 15 },
  { id: "dan-ty-hinh", title: "Dần - Tỵ hình", relationType: "hình", branches: ["Dần", "Tỵ"], status: "needs_review", sourceLevel: "candidate", priority: 11 },

  { id: "ty-mui-hai", title: "Tý - Mùi hại", relationType: "hại", branches: ["Tý", "Mùi"], status: "candidate", sourceLevel: "candidate", priority: 18 },
  { id: "suu-ngo-hai", title: "Sửu - Ngọ hại", relationType: "hại", branches: ["Sửu", "Ngọ"] },
  { id: "dan-ty-hai", title: "Dần - Tỵ hại", relationType: "hại", branches: ["Dần", "Tỵ"] },
  { id: "mao-thin-hai", title: "Mão - Thìn hại", relationType: "hại", branches: ["Mão", "Thìn"] },
  { id: "than-hoi-hai", title: "Thân - Hợi hại", relationType: "hại", branches: ["Thân", "Hợi"] },
  { id: "dau-tuat-hai", title: "Dậu - Tuất hại", relationType: "hại", branches: ["Dậu", "Tuất"] },

  { id: "ty-dau-pha", title: "Tý - Dậu phá", relationType: "phá", branches: ["Tý", "Dậu"], status: "needs_review", sourceLevel: "candidate", priority: 9 },
  { id: "mao-ngo-pha", title: "Mão - Ngọ phá", relationType: "phá", branches: ["Mão", "Ngọ"], status: "needs_review", sourceLevel: "candidate", priority: 9 },

  { id: "than-ty-thin-tam-hop", title: "Thân - Tý - Thìn tam hợp", relationType: "tam hợp", branches: ["Thân", "Tý", "Thìn"], priority: 14 },
  { id: "dan-ngo-tuat-tam-hop", title: "Dần - Ngọ - Tuất tam hợp", relationType: "tam hợp", branches: ["Dần", "Ngọ", "Tuất"], priority: 14 },
  { id: "hoi-mao-mui-tam-hop", title: "Hợi - Mão - Mùi tam hợp", relationType: "tam hợp", branches: ["Hợi", "Mão", "Mùi"], priority: 14 },

  { id: "hoi-ty-suu-tam-hoi", title: "Hợi - Tý - Sửu tam hội", relationType: "tam hội", branches: ["Hợi", "Tý", "Sửu"], priority: 14 },
  { id: "dan-mao-thin-tam-hoi", title: "Dần - Mão - Thìn tam hội", relationType: "tam hội", branches: ["Dần", "Mão", "Thìn"], priority: 14 },
  { id: "than-dau-tuat-tam-hoi", title: "Thân - Dậu - Tuất tam hội", relationType: "tam hội", branches: ["Thân", "Dậu", "Tuất"], priority: 14 }
];

const BRANCH_RELATION_CARDS: KnowledgeCard[] = BRANCH_RELATIONS.map((relation) => {
  const relationLabel = `${relation.branches.join(" - ")} (${relation.relationType})`;
  const status = relation.status ?? "reference";
  const sourceLevel = relation.sourceLevel ?? (status === "core" ? "core_rule" : "reference");
  return {
    id: `branch_relation_${relation.id}`,
    title: relation.title,
    group: "Quan hệ Địa Chi",
    topic: relation.relationType,
    status,
    whenUse: { branches: relation.branches, relations: [relation.id], chartFlags: ["has-branch-relations"] },
    tags: ["dia-chi", "quan-he-chi", relation.relationType, relation.id],
    body: `${relationLabel} là quan hệ Địa Chi cần đối chiếu theo vị trí trụ và toàn cục.`,
    analysisHint: `Quan hệ ${relation.title} xuất hiện thì nên ghi nhận như một điểm đối chiếu, chưa dùng để kết luận tốt/xấu.`,
    usageNote: "Quan hệ Chi chỉ là một lớp trong nhiều lớp đọc, không dùng riêng để phán đoán.",
    sourceLevel,
    priority: relation.priority ?? 12
  };
});

const VUONG_SUY_CARDS: KnowledgeCard[] = [
  {
    id: "vuong_suy_mua_sinh",
    title: "Đọc vượng suy theo mùa",
    group: "Vượng suy",
    topic: "Mùa sinh",
    status: "reference",
    whenUse: { chartFlags: ["uses-solar-calendar"] },
    tags: ["vuong-suy", "mua-sinh"],
    body: "Lực hành cần đọc theo mùa sinh, không chỉ theo số lượng xuất hiện trong Can Chi.",
    analysisHint: "Kết luận vượng suy cần thêm lớp mùa sinh.",
    usageNote: "Bản hiện tại chưa mở rộng trọng số mùa đầy đủ.",
    sourceLevel: "reference",
    priority: 11
  },
  {
    id: "vuong_suy_lenh_thang",
    title: "Nhật chủ và lệnh tháng",
    group: "Vượng suy",
    topic: "Lệnh tháng",
    status: "reference",
    whenUse: { chartFlags: ["has-core-four-pillars"] },
    tags: ["nhat-chu", "lenh-thang"],
    body: "Lệnh tháng là lớp quan trọng để đọc lực của Nhật chủ trong toàn cục.",
    analysisHint: "Nên đối chiếu Nhật chủ cùng khí tháng trước khi kết luận.",
    usageNote: "Không kết luận mạnh/yếu nếu thiếu lớp khí tháng.",
    sourceLevel: "reference",
    priority: 11
  },
  {
    id: "vuong_suy_sinh_tro",
    title: "Sinh trợ Nhật chủ",
    group: "Vượng suy",
    topic: "Lực hỗ trợ",
    status: "core",
    whenUse: { chartFlags: ["has-supporting-elements"] },
    tags: ["sinh-tro", "nhat-chu"],
    body: "Sinh trợ gồm hành cùng hành hoặc sinh ra Nhật chủ, là lực hỗ trợ cần quan sát trong cấu trúc.",
    analysisHint: "Có thể nêu lớp hỗ trợ từ các hành đang sinh trợ Nhật chủ.",
    usageNote: "Không đồng nghĩa thuận lợi tuyệt đối.",
    sourceLevel: "core_rule",
    priority: 13
  },
  {
    id: "vuong_suy_khac_che",
    title: "Khắc chế Nhật chủ",
    group: "Vượng suy",
    topic: "Lực áp lực",
    status: "core",
    whenUse: { chartFlags: ["has-pressure-elements"] },
    tags: ["khac-che", "nhat-chu"],
    body: "Khắc chế là lớp hành tạo áp lực hoặc tiêu hao quanh Nhật chủ theo quan hệ ngũ hành.",
    analysisHint: "Nên nêu rõ đây là lực áp lực cần đối chiếu thêm.",
    usageNote: "Không đồng nghĩa bất lợi tuyệt đối.",
    sourceLevel: "core_rule",
    priority: 13
  },
  {
    id: "vuong_suy_tiet_khi",
    title: "Tiết khí và lực mùa",
    group: "Vượng suy",
    topic: "Tiết khí",
    status: "reference",
    whenUse: { chartFlags: ["uses-solar-calendar"] },
    tags: ["tiet-khi", "vuong-suy"],
    body: "Tiết khí ảnh hưởng nền lực mùa, cần dùng khi mở rộng đánh giá vượng suy.",
    analysisHint: "Khi cần đọc sâu, đối chiếu thêm mốc tiết khí.",
    usageNote: "Bản hiện tại dừng ở mức gợi ý đối chiếu.",
    sourceLevel: "reference",
    priority: 10
  },
  {
    id: "vuong_suy_hanh_noi_bat",
    title: "Hành nổi bật",
    group: "Vượng suy",
    topic: "Phân bố hành",
    status: "core",
    whenUse: { chartFlags: ["has-prominent-elements"] },
    tags: ["hanh-noi-bat", "phan-bo"],
    body: "Hành nổi bật là hành có tần suất xuất hiện cao hơn trong lớp tính cơ bản.",
    analysisHint: "Có thể nêu hành nổi bật như một tín hiệu cấu trúc.",
    usageNote: "Không đồng nghĩa cát/hung tuyệt đối.",
    sourceLevel: "core_rule",
    priority: 14
  },
  {
    id: "vuong_suy_hanh_it",
    title: "Hành ít xuất hiện",
    group: "Vượng suy",
    topic: "Phân bố hành",
    status: "core",
    whenUse: { chartFlags: ["has-low-elements"] },
    tags: ["hanh-it", "phan-bo"],
    body: "Hành ít xuất hiện là hành có tần suất thấp hơn trong lớp tính cơ bản.",
    analysisHint: "Có thể nêu hành ít xuất hiện như điểm cần theo dõi thêm.",
    usageNote: "Không gắn nhãn thiếu/xấu một chiều.",
    sourceLevel: "core_rule",
    priority: 12
  },
  {
    id: "vuong_suy_can_bang",
    title: "Cân bằng và thiên lệch",
    group: "Vượng suy",
    topic: "Phân bố hành",
    status: "reference",
    whenUse: { chartFlags: ["has-element-balance"] },
    tags: ["can-bang", "thien-lech"],
    body: "Cân bằng hay thiên lệch là quan sát mô tả phân bố, cần đặt trong bối cảnh mùa sinh và toàn cục.",
    analysisHint: "Nên mô tả mức thiên lệch thay vì kết luận giá trị.",
    usageNote: "Chỉ dùng như lớp nhận diện cấu trúc.",
    sourceLevel: "reference",
    priority: 10
  },
  {
    id: "vuong_suy_khong_chi_so_luong",
    title: "Không kết luận chỉ bằng số lượng",
    group: "Vượng suy",
    topic: "Nguyên tắc đọc",
    status: "core",
    whenUse: { chartFlags: ["has-element-balance"] },
    tags: ["nguyen-tac-doc", "gioi-han"],
    body: "Số lượng hành chỉ là tín hiệu ban đầu, chưa đủ để kết luận mạnh/yếu cuối cùng.",
    analysisHint: "Phần kết nên nhắc giới hạn đọc này.",
    usageNote: "Tránh kết luận cứng từ thống kê đơn thuần.",
    sourceLevel: "core_rule",
    priority: 12
  },
  {
    id: "vuong_suy_can_tang_can",
    title: "Cần xét tàng can",
    group: "Vượng suy",
    topic: "Nguyên tắc đọc",
    status: "core",
    whenUse: { chartFlags: ["has-hidden-stems"] },
    tags: ["tang-can", "nguyen-tac-doc"],
    body: "Đánh giá khí cần đưa lớp tàng can vào, vì Địa Chi không chỉ có hành bề mặt.",
    analysisHint: "Nêu rõ tàng can là lý do cần đọc sâu hơn.",
    usageNote: "Không bỏ qua lớp ẩn khi tổng hợp.",
    sourceLevel: "core_rule",
    priority: 13
  },
  {
    id: "vuong_suy_doc_toan_cuc",
    title: "Đọc trong toàn cục",
    group: "Vượng suy",
    topic: "Nguyên tắc đọc",
    status: "reference",
    whenUse: { chartFlags: ["has-core-four-pillars"] },
    tags: ["toan-cuc", "nguyen-tac"],
    body: "Mọi nhận xét cần đặt trong toàn cục bốn trụ, tránh kết luận từ một mảnh dữ liệu.",
    analysisHint: "Khuyến nghị đọc đồng thời Can, Chi, Tàng can và quan hệ.",
    usageNote: "Phù hợp vai trò cảnh báo phương pháp.",
    sourceLevel: "reference",
    priority: 9
  },
  {
    id: "vuong_suy_doi_chieu_nguon",
    title: "Đối chiếu nguồn",
    group: "Vượng suy",
    topic: "Nguyên tắc đọc",
    status: "needs_review",
    whenUse: { chartFlags: ["has-core-four-pillars"] },
    tags: ["doi-chieu-nguon", "needs-review"],
    body: "Một số lớp diễn giải nâng cao cần đối chiếu thêm nguồn để tránh suy diễn quá mức.",
    analysisHint: "Nên đánh dấu rõ phần nào là đối chiếu cơ bản, phần nào cần kiểm thêm.",
    usageNote: "Thẻ này dùng như cảnh báo phương pháp.",
    sourceLevel: "candidate",
    priority: 6
  }
];

const READING_TEMPLATE_CARDS: KnowledgeCard[] = [
  {
    id: "tpl_ban_do_tu_tru",
    title: "Bản đồ Tứ Trụ của bạn",
    group: "Mẫu giải nghĩa",
    topic: "Mở đầu",
    status: "core",
    whenUse: { chartFlags: ["has-core-four-pillars"] },
    tags: ["template", "mo-dau"],
    body: "Bản đọc này tổng hợp từ bốn trụ đã lập theo ngày giờ sinh nhập vào.",
    analysisHint: "Mở đầu bằng câu xác nhận khung bốn trụ đã dựng.",
    usageNote: "Không chuyển thành giọng phán đoán.",
    sourceLevel: "core_rule",
    priority: 12
  },
  {
    id: "tpl_nhan_xet_nhat_chu",
    title: "Nhận xét Nhật chủ",
    group: "Mẫu giải nghĩa",
    topic: "Nhật chủ",
    status: "core",
    whenUse: { chartFlags: ["has-core-four-pillars"] },
    tags: ["template", "nhat-chu"],
    body: "Nhật chủ là trục đọc để đối chiếu Ngũ hành và Thập thần.",
    analysisHint: "Nêu Nhật chủ ngay đầu phần nhận xét cấu trúc.",
    usageNote: "Không dùng để gán nhãn tính cách cố định.",
    sourceLevel: "core_rule",
    priority: 13
  },
  {
    id: "tpl_nhan_xet_hanh_noi_bat",
    title: "Nhận xét hành nổi bật",
    group: "Mẫu giải nghĩa",
    topic: "Ngũ hành",
    status: "core",
    whenUse: { chartFlags: ["has-prominent-elements"] },
    tags: ["template", "hanh-noi-bat"],
    body: "Hành nổi bật giúp nhận diện trọng điểm cấu trúc cần quan sát.",
    analysisHint: "Nêu hành nổi bật theo dữ liệu đếm hiện tại.",
    usageNote: "Không dùng để kết luận cát/hung.",
    sourceLevel: "core_rule",
    priority: 12
  },
  {
    id: "tpl_nhan_xet_hanh_it",
    title: "Nhận xét hành ít xuất hiện",
    group: "Mẫu giải nghĩa",
    topic: "Ngũ hành",
    status: "core",
    whenUse: { chartFlags: ["has-low-elements"] },
    tags: ["template", "hanh-it"],
    body: "Hành ít xuất hiện là dữ liệu mô tả để theo dõi thêm, không phải kết luận.",
    analysisHint: "Nêu hành ít xuất hiện theo lớp tính cơ bản.",
    usageNote: "Tránh dùng từ tuyệt đối.",
    sourceLevel: "core_rule",
    priority: 10
  },
  {
    id: "tpl_nhan_xet_ho_tro",
    title: "Nhận xét lực hỗ trợ",
    group: "Mẫu giải nghĩa",
    topic: "Ngũ hành",
    status: "core",
    whenUse: { chartFlags: ["has-supporting-elements"] },
    tags: ["template", "ho-tro"],
    body: "Lực hỗ trợ gồm hành cùng hành hoặc sinh ra Nhật chủ.",
    analysisHint: "Nên nêu rõ hành nào đang hỗ trợ Nhật chủ.",
    usageNote: "Không suy diễn thành kết quả sống cụ thể.",
    sourceLevel: "core_rule",
    priority: 12
  },
  {
    id: "tpl_nhan_xet_ap_luc",
    title: "Nhận xét lực áp lực",
    group: "Mẫu giải nghĩa",
    topic: "Ngũ hành",
    status: "core",
    whenUse: { chartFlags: ["has-pressure-elements"] },
    tags: ["template", "ap-luc"],
    body: "Lực áp lực gồm hành khắc hoặc làm tiêu hao Nhật chủ theo quan hệ cơ bản.",
    analysisHint: "Nêu hành áp lực và nhấn mạnh cần đối chiếu thêm.",
    usageNote: "Không quy thành xấu tuyệt đối.",
    sourceLevel: "core_rule",
    priority: 12
  },
  {
    id: "tpl_nhan_xet_tang_can",
    title: "Nhận xét tàng can",
    group: "Mẫu giải nghĩa",
    topic: "Tàng can",
    status: "core",
    whenUse: { chartFlags: ["has-hidden-stems"] },
    tags: ["template", "tang-can"],
    body: "Lớp tàng can cho biết khí ẩn bên trong Địa Chi, cần được đưa vào nhận xét cấu trúc.",
    analysisHint: "Nên liệt kê các Chi có tàng can đáng chú ý.",
    usageNote: "Không tách rời khỏi toàn cục.",
    sourceLevel: "core_rule",
    priority: 12
  },
  {
    id: "tpl_nhan_xet_thap_than",
    title: "Nhận xét thập thần nổi bật",
    group: "Mẫu giải nghĩa",
    topic: "Thập thần",
    status: "core",
    whenUse: { chartFlags: ["has-ten-gods"] },
    tags: ["template", "thap-than"],
    body: "Thập thần nổi bật nên được trình bày theo tần suất và vị trí xuất hiện.",
    analysisHint: "Nhấn mạnh đây là lớp quan hệ, chưa phải kết luận đời người.",
    usageNote: "Không diễn giải vượt quá dữ liệu có sẵn.",
    sourceLevel: "core_rule",
    priority: 11
  },
  {
    id: "tpl_nhan_xet_quan_he_chi",
    title: "Nhận xét quan hệ Chi",
    group: "Mẫu giải nghĩa",
    topic: "Quan hệ Địa Chi",
    status: "core",
    whenUse: { chartFlags: ["has-branch-relations"] },
    tags: ["template", "quan-he-chi"],
    body: "Quan hệ Địa Chi nên nêu theo dạng điểm đối chiếu cần quan sát trong toàn cục.",
    analysisHint: "Chọn 1-2 quan hệ Chi đáng chú ý để nêu trong phần tổng hợp.",
    usageNote: "Không dùng quan hệ Chi đơn lẻ để phán tốt/xấu.",
    sourceLevel: "core_rule",
    priority: 12
  },
  {
    id: "tpl_gioi_han_doc",
    title: "Câu giới hạn đọc",
    group: "Mẫu giải nghĩa",
    topic: "Giới hạn",
    status: "core",
    whenUse: { chartFlags: ["has-core-four-pillars"] },
    tags: ["template", "gioi-han"],
    body: "Bản đọc cấu trúc là công cụ tham khảo cổ học, không phải kết luận chắc chắn về đời người.",
    analysisHint: "Đặt câu giới hạn ở cuối phần nhận xét cấu trúc.",
    usageNote: "Bắt buộc có để tránh hiểu nhầm.",
    sourceLevel: "core_rule",
    priority: 18
  },
  {
    id: "tpl_doc_theo_toan_cuc",
    title: "Đọc theo toàn cục",
    group: "Mẫu giải nghĩa",
    topic: "Nguyên tắc",
    status: "reference",
    whenUse: { chartFlags: ["has-core-four-pillars"] },
    tags: ["template", "toan-cuc"],
    body: "Can Chi, Ngũ hành, Tàng can và Thập thần cần được đặt cùng nhau khi đọc.",
    analysisHint: "Nhắc người dùng tránh tách một yếu tố ra kết luận.",
    usageNote: "Dùng như nhắc phương pháp đọc.",
    sourceLevel: "reference",
    priority: 9
  },
  {
    id: "tpl_doc_theo_vi_tri_tru",
    title: "Đọc theo vị trí trụ",
    group: "Mẫu giải nghĩa",
    topic: "Nguyên tắc",
    status: "reference",
    whenUse: { chartFlags: ["has-core-four-pillars"] },
    tags: ["template", "vi-tri-tru"],
    body: "Cùng một Can/Chi nhưng xuất hiện ở trụ khác nhau có thể mang nghĩa quan sát khác nhau.",
    analysisHint: "Trong nhận xét nên nhắc vị trí trụ liên quan.",
    usageNote: "Không đánh đồng mọi vị trí.",
    sourceLevel: "reference",
    priority: 8
  },
  {
    id: "tpl_doc_tiet_khi",
    title: "Nhắc lớp tiết khí",
    group: "Mẫu giải nghĩa",
    topic: "Lịch pháp",
    status: "reference",
    whenUse: { chartFlags: ["uses-solar-calendar"] },
    tags: ["template", "tiet-khi"],
    body: "Các kết luận sâu về lực khí cần đi qua lớp tiết khí và mùa sinh.",
    analysisHint: "Nhắc tiết khí khi gặp lá số gần mốc đổi khí.",
    usageNote: "Không thay thế dữ liệu lịch pháp chi tiết.",
    sourceLevel: "reference",
    priority: 8
  },
  {
    id: "tpl_doc_lap_xuan",
    title: "Nhắc mốc Lập Xuân",
    group: "Mẫu giải nghĩa",
    topic: "Lịch pháp",
    status: "core",
    whenUse: { chartFlags: ["lap-xuan-year-boundary"] },
    tags: ["template", "lap-xuan"],
    body: "Lá số nằm gần hoặc trước mốc Lập Xuân cần ưu tiên đọc trụ năm theo tiết khí.",
    analysisHint: "Nhắc rõ vì sao trụ năm có thể khác năm dương lịch.",
    usageNote: "Dùng cho giải thích lịch pháp, không phải luận đoán.",
    sourceLevel: "core_rule",
    priority: 16
  },
  {
    id: "tpl_doc_sinh_khac",
    title: "Nhắc quan hệ sinh khắc",
    group: "Mẫu giải nghĩa",
    topic: "Ngũ hành",
    status: "core",
    whenUse: { chartFlags: ["has-day-master-relations"] },
    tags: ["template", "sinh-khac"],
    body: "Quan hệ sinh khắc quanh Nhật chủ là trục chính để mô tả lực hỗ trợ và áp lực.",
    analysisHint: "Trình bày hỗ trợ/áp lực bằng ngôn ngữ khách quan.",
    usageNote: "Không chuyển thành phán định sự kiện.",
    sourceLevel: "core_rule",
    priority: 14
  },
  {
    id: "tpl_doc_tan_suat_thap_than",
    title: "Nhắc tần suất Thập thần",
    group: "Mẫu giải nghĩa",
    topic: "Thập thần",
    status: "reference",
    whenUse: { chartFlags: ["has-ten-gods"] },
    tags: ["template", "tan-suat-thap-than"],
    body: "Thập thần nên đọc theo tần suất xuất hiện và vị trí thay vì diễn giải tự do.",
    analysisHint: "Nêu số lần xuất hiện của nhóm thập thần đáng chú ý.",
    usageNote: "Chỉ dùng ở mức đối chiếu cơ bản.",
    sourceLevel: "reference",
    priority: 9
  },
  {
    id: "tpl_doc_tang_can_bat_buoc",
    title: "Nhắc lớp ẩn bắt buộc",
    group: "Mẫu giải nghĩa",
    topic: "Tàng can",
    status: "core",
    whenUse: { chartFlags: ["has-rich-hidden-stems"] },
    tags: ["template", "lop-an"],
    body: "Lá số có nhiều tàng can, nên cần đọc lớp ẩn song song với Can/Chi bề mặt.",
    analysisHint: "Đưa câu nhắc bắt buộc về tàng can vào phần giữa bản đọc.",
    usageNote: "Không bỏ qua lớp ẩn trong tổng hợp.",
    sourceLevel: "core_rule",
    priority: 13
  },
  {
    id: "tpl_doc_quan_he_chi_candidate",
    title: "Quan hệ Chi cần đối chiếu",
    group: "Mẫu giải nghĩa",
    topic: "Quan hệ Địa Chi",
    status: "candidate",
    whenUse: { chartFlags: ["has-branch-relations"] },
    tags: ["template", "candidate-relations"],
    body: "Một số quan hệ Chi thuộc lớp ứng viên/cần đối chiếu, chỉ nên dùng làm điểm gợi mở.",
    analysisHint: "Nếu dùng quan hệ candidate, cần gắn nhãn đối chiếu thêm.",
    usageNote: "Không dùng làm kết luận tự động.",
    sourceLevel: "candidate",
    priority: 6
  },
  {
    id: "tpl_doc_khong_luan_menh",
    title: "Không luận đoán đời người",
    group: "Mẫu giải nghĩa",
    topic: "Giới hạn",
    status: "core",
    whenUse: { chartFlags: ["has-core-four-pillars"] },
    tags: ["template", "guardrail"],
    body: "Phần đọc này phục vụ tự quan sát theo cổ học, không thay thế quyết định thực tế.",
    analysisHint: "Đặt cảnh báo mềm sau phần nhận xét chính.",
    usageNote: "Bắt buộc hiển thị cho người dùng.",
    sourceLevel: "core_rule",
    priority: 17
  }
];

export const runtimeKnowledgeCards: KnowledgeCard[] = [
  ...TERM_CARDS,
  ...STEM_CARDS,
  ...BRANCH_CARDS,
  ...HIDDEN_STEM_CARDS,
  ...ELEMENT_CARDS,
  ...ELEMENT_RELATION_CARDS,
  ...TEN_GOD_CARDS,
  ...NHAM_SPECIFIC_CARDS,
  ...BRANCH_RELATION_CARDS,
  ...VUONG_SUY_CARDS,
  ...READING_TEMPLATE_CARDS
];
