import type {
  SonActionItem,
  SonDirection,
  SonDirectionSector,
  SonFormState,
  SonModuleCard,
  SonPalaceCell,
  SonRuleObject,
  SonSpaceType,
} from "../types";

export const sonDefaultForm: SonFormState = {
  birthYear: "1990",
  gender: "male",
  spaceType: "home",
  mainDirection: "Nam",
  builtYear: "2024",
  renovatedYear: "",
  facingDirection: "Nam",
  targetYear: "2026",
  floorPlanNote: "Chưa có sơ đồ. Dùng dữ liệu mẫu để xem UI.",
};

export const sonDirectionOptions: SonDirection[] = [
  "Bắc",
  "Đông Bắc",
  "Đông",
  "Đông Nam",
  "Nam",
  "Tây Nam",
  "Tây",
  "Tây Bắc",
];

export const sonSpaceTypeOptions: Array<{ value: SonSpaceType; label: string; hint: string }> = [
  { value: "home", label: "Nhà ở", hint: "Quan sát tổng thể nhà/căn hộ." },
  { value: "bedroom", label: "Phòng ngủ", hint: "Ưu tiên yên tĩnh, hồi phục, ít nhiễu." },
  { value: "workdesk", label: "Bàn làm việc", hint: "Ưu tiên tập trung, lưng tựa, ánh sáng vừa." },
  { value: "small-shop", label: "Cửa hàng nhỏ", hint: "Ưu tiên lối vào, ánh sáng, luồng di chuyển." },
  { value: "main-door", label: "Cửa chính", hint: "Quan sát hướng nhận khí và lối vào." },
  { value: "kitchen", label: "Bếp", hint: "Ưu tiên sạch, khô, công năng rõ." },
  { value: "quiet-zone", label: "Khu tĩnh", hint: "Không gian thờ, đọc, nghỉ hoặc thiền nhẹ." },
];

export const sonModules: SonModuleCard[] = [
  {
    id: "bat-trach",
    title: "Bát trạch",
    subtitle: "Đối chiếu người, hướng và công năng không gian.",
    icon: "八",
    tone: "jade",
    bullets: ["Cung mệnh", "Đông/Tây tứ mệnh", "8 hướng", "Gợi ý bố trí"],
  },
  {
    id: "phi-tinh",
    title: "Phi tinh",
    subtitle: "Quan sát khí vận theo thời gian và 9 cung phương vị.",
    icon: "九",
    tone: "clay",
    bullets: ["Vận nhà", "Niên tinh", "9 cung", "Tĩnh/động từng khu"],
  },
];

export const sonActions: SonActionItem[] = [
  { id: "input", title: "Nhập thông tin", subtitle: "Năm, hướng, công năng", icon: "門", tone: "earth" },
  { id: "map", title: "Xem sơ đồ", subtitle: "8 hướng hoặc 9 cung", icon: "圖", tone: "jade" },
  { id: "analysis", title: "Phân tích", subtitle: "Giải nghĩa từng lớp", icon: "理", tone: "gold" },
  { id: "suggestions", title: "Gợi ý điều chỉnh", subtitle: "Nhẹ, rõ, không cực đoan", icon: "調", tone: "ink" },
  { id: "sources", title: "Quy tắc & nguồn", subtitle: "Rule set và ranh giới", icon: "典", tone: "clay" },
];

export const sonTabs: Array<{ id: SonActionItem["id"] | "overview"; label: string; shortLabel: string }> = [
  { id: "overview", label: "Tổng quan", shortLabel: "Tổng" },
  { id: "map", label: "Sơ đồ", shortLabel: "Đồ" },
  { id: "analysis", label: "Phân tích", shortLabel: "Luận" },
  { id: "suggestions", label: "Gợi ý điều chỉnh", shortLabel: "Chỉnh" },
  { id: "sources", label: "Quy tắc & nguồn", shortLabel: "Nguồn" },
];

export const batTrachPreviewSectors: SonDirectionSector[] = [
  {
    direction: "Đông Nam",
    starName: "Sinh khí",
    quality: "priority",
    plainMeaning: "Hướng mở rộng, chủ động, dễ tạo cảm giác phát triển.",
    suggestion: "Phù hợp khu vực dùng thường xuyên, bàn làm việc hoặc điểm mở sáng.",
  },
  {
    direction: "Đông",
    starName: "Thiên y",
    quality: "priority",
    plainMeaning: "Thiên về hồi phục, dưỡng sức và chăm thân tâm.",
    suggestion: "Phòng ngủ hoặc góc nghỉ nên giữ sạch, mềm và ít nhiễu.",
  },
  {
    direction: "Nam",
    starName: "Diên niên",
    quality: "priority",
    plainMeaning: "Thiên về ổn định quan hệ, hòa khí và sự bền lâu.",
    suggestion: "Có thể dùng cho phòng khách, bàn ăn hoặc khu sinh hoạt nhẹ.",
  },
  {
    direction: "Bắc",
    starName: "Phục vị",
    quality: "priority",
    plainMeaning: "Thiên về yên tĩnh, học tập, tập trung và giữ tâm vững.",
    suggestion: "Hợp góc đọc, bàn học, khu thờ hoặc khu tĩnh.",
  },
  {
    direction: "Tây Nam",
    starName: "Tuyệt mệnh",
    quality: "observe",
    plainMeaning: "Không hiểu là chắc chắn xấu; đây là vùng cần thận trọng khi đặt công năng quan trọng.",
    suggestion: "Nên giảm đồ thừa, giữ gọn, tránh dùng làm điểm kích hoạt lớn nếu chưa khảo sát.",
  },
  {
    direction: "Đông Bắc",
    starName: "Ngũ quỷ",
    quality: "observe",
    plainMeaning: "Dễ tạo cảm giác nhiễu, bất an hoặc xung động nếu dùng sai công năng.",
    suggestion: "Nên giảm ồn, giảm vật sắc, giữ lối đi rõ và ánh sáng vừa.",
  },
  {
    direction: "Tây Bắc",
    starName: "Lục sát",
    quality: "observe",
    plainMeaning: "Nên chú ý yếu tố va chạm, rối quan hệ hoặc thiếu ổn định.",
    suggestion: "Không nên để khu này quá bừa bộn hoặc bị dùng quá nhiều việc cùng lúc.",
  },
  {
    direction: "Tây",
    starName: "Họa hại",
    quality: "observe",
    plainMeaning: "Nên giảm sự bừa bộn, sắc nhọn, ồn động hoặc bố trí gây khó chịu.",
    suggestion: "Bắt đầu bằng dọn sạch, mềm hóa góc nhọn và giảm vật gây rối mắt.",
  },
];

export const phiTinhPreviewGrid: SonPalaceCell[] = [
  {
    palace: "Tây Bắc",
    annualStar: "6",
    baseStar: "1",
    spaceUse: "Lối đi",
    plainMeaning: "Khu chuyển tiếp, nên rõ đường đi và ít vật cản.",
    suggestion: "Giữ sáng vừa, không chất đồ nặng ở lối mở.",
    severity: "notice",
  },
  {
    palace: "Bắc",
    annualStar: "1",
    baseStar: "6",
    spaceUse: "Phòng ngủ",
    plainMeaning: "Khu cần ổn định, thích hợp nhịp sử dụng nhẹ.",
    suggestion: "Ưu tiên yên, sạch, ánh sáng dịu và thông gió vừa.",
    severity: "info",
  },
  {
    palace: "Đông Bắc",
    annualStar: "8",
    baseStar: "3",
    spaceUse: "Kho",
    plainMeaning: "Khu phụ dễ trì trệ nếu nén quá nhiều đồ.",
    suggestion: "Dọn đồ không dùng, tránh khóa kín lâu ngày.",
    severity: "notice",
  },
  {
    palace: "Tây",
    annualStar: "7",
    baseStar: "2",
    spaceUse: "Phòng khách",
    plainMeaning: "Khu dùng chung nên giảm nhiễu và vật gây căng mắt.",
    suggestion: "Hạn chế cạnh sắc, tăng khoảng thở giữa đồ nội thất.",
    severity: "notice",
  },
  {
    palace: "Trung cung",
    annualStar: "9",
    baseStar: "9",
    spaceUse: "Khoảng mở",
    plainMeaning: "Trung tâm nhà nên thoáng, sạch và không bị nén.",
    suggestion: "Giữ sáng, không chất đồ cao hoặc nặng ở giữa nhà.",
    severity: "info",
  },
  {
    palace: "Đông",
    annualStar: "3",
    baseStar: "4",
    spaceUse: "Bàn làm việc",
    plainMeaning: "Khu cần trật tự để giảm nhiễu và giữ nhịp tập trung.",
    suggestion: "Sắp xếp mặt bàn, giảm tiếng ồn, giữ điểm tựa sau lưng.",
    severity: "notice",
  },
  {
    palace: "Tây Nam",
    annualStar: "2",
    baseStar: "7",
    spaceUse: "Bếp",
    plainMeaning: "Khu cần sạch, khô, ít hư hỏng và vận hành ổn định.",
    suggestion: "Kiểm tra ẩm, rò rỉ, nhiệt và giữ công năng rõ.",
    severity: "caution",
  },
  {
    palace: "Nam",
    annualStar: "4",
    baseStar: "8",
    spaceUse: "Cửa chính",
    plainMeaning: "Khu nhận khí nên sáng, thoáng và dễ nhận diện.",
    suggestion: "Dọn lối vào, tăng ánh sáng tự nhiên, tránh chắn cửa.",
    severity: "info",
  },
  {
    palace: "Đông Nam",
    annualStar: "5",
    baseStar: "5",
    spaceUse: "Khu phụ",
    plainMeaning: "Khu này nên giữ yên và tránh động lớn khi chưa cần thiết.",
    suggestion: "Không khoan đục, sửa lớn hoặc gây ồn kéo dài nếu không bắt buộc.",
    severity: "strong_caution",
  },
];

export const sonGlossary = [
  {
    term: "Sơn",
    desc: "Trong app này, Sơn được hiểu là Phong thủy ứng dụng: quan sát nơi chốn, hướng, công năng và nhịp động/tĩnh.",
  },
  {
    term: "Bát trạch",
    desc: "Hệ đối chiếu cung mệnh của người với 8 hướng và công năng sử dụng không gian.",
  },
  {
    term: "Phi tinh",
    desc: "Hệ quan sát khí vận theo thời gian và phương vị, thường trình bày bằng 9 cung.",
  },
  {
    term: "Động / tĩnh",
    desc: "Động là khu vực có di chuyển, âm thanh, sửa chữa, kích hoạt; tĩnh là khu vực cần ổn định, yên và ít xáo trộn.",
  },
  {
    term: "Cần đối chiếu thêm",
    desc: "Nhãn dùng khi thiếu dữ liệu, có mâu thuẫn trường phái hoặc cần khảo sát thực địa.",
  },
];

export const sonSafeLanguage = {
  allowed: [
    "cần lưu ý",
    "nên ưu tiên",
    "có thể cân nhắc",
    "nên giữ yên",
    "nên giảm động",
    "nên tăng sáng",
    "nên thông thoáng",
    "nên giữ sạch",
    "kết quả tham khảo theo một hệ quy chiếu cổ học",
  ],
  forbidden: [
    "đại hung",
    "ở là gặp họa",
    "phá tài chắc chắn",
    "phải đổi nhà",
    "năm này chắc chắn xấu",
    "nhà này có hạn",
    "bệnh tật / sống chết / tan nhà / mất tiền chắc chắn",
  ],
};

export const sonRuleSamples: SonRuleObject[] = [
  {
    id: "SON-BT-UI-001",
    module: "bat-trach",
    condition: "direction_quality = observe AND space_type in [bedroom, workdesk]",
    result: "show_caution_adjustment",
    explanationPlain: "Nếu khu quan trọng rơi vào hướng cần lưu ý, app chỉ gợi ý giảm nhiễu và kiểm tra thêm, không kết luận xấu.",
    severity: "caution",
    confidence: "placeholder",
    sourceRefs: ["needs_review"],
    allowedWording: ["cần lưu ý", "nên giữ gọn", "nên quan sát thêm"],
    forbiddenWording: sonSafeLanguage.forbidden,
    requiresHumanReview: false,
  },
  {
    id: "SON-PT-UI-001",
    module: "phi-tinh",
    condition: "annual_star in [2, 5] AND renovation_planned = true",
    result: "suggest_reduce_major_motion",
    explanationPlain: "Khu vực cần tĩnh nên hạn chế sửa chữa lớn nếu không cần thiết; việc quan trọng nên hỏi người khảo sát thực địa.",
    severity: "strong_caution",
    confidence: "placeholder",
    sourceRefs: ["needs_review"],
    allowedWording: ["nên hạn chế sửa lớn", "nên tham khảo chuyên gia", "nếu không cần thiết"],
    forbiddenWording: sonSafeLanguage.forbidden,
    requiresHumanReview: true,
  },
];

export const sonSourceRows = [
  {
    name: "Bộ quy tắc Sơn v0.1",
    type: "internal_rule_placeholder",
    license: "internal draft",
    use: "UI demo only",
    trust: "1/5 until reviewed",
    risk: "Cần thay bằng nguồn và bảng rule đã kiểm duyệt trước khi public engine.",
  },
  {
    name: "Bát trạch source set",
    type: "needs_research",
    license: "needs_review",
    use: "future core/reference",
    trust: "pending",
    risk: "Không copy nguyên văn sách còn bản quyền.",
  },
  {
    name: "Huyền không Phi tinh source set",
    type: "needs_research",
    license: "needs_review",
    use: "future core/reference",
    trust: "pending",
    risk: "Cần phân biệt core rule, trường phái và phần cần chuyên gia.",
  },
];
