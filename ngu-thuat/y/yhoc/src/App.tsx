import React, { useState, useCallback } from 'react';
import imgHeroBg from './assets/images/yhoc-hero-bg.png';
import imgCardAmduong from './assets/images/yhoc-card-amduong.png';
import imgCardTangphu from './assets/images/yhoc-card-tangphu.png';
import imgCardKhihuyet from './assets/images/yhoc-card-khihuyet.png';
import imgCardDuongsinh from './assets/images/yhoc-card-duongsinh.png';
import { interpretYhocAnswers, getQuestionLabel, type YhocAnswers } from './engine/yhocEngine';
import { QUESTIONS } from './data/yhoc/questions';
import { GLOSSARY } from './data/yhoc/glossary';
import { YHOC_FOUNDATIONS } from './data/yhoc/foundations';
import { SAFETY_WARNINGS } from './data/yhoc/safety';
import type { Question, GlossaryTerm, FoundationItem } from './data/yhoc/types';
import { filterFolkCare, getRedFlags, suggestFolkCareByPattern, type FolkCareItem } from './engine/folkCareEngine';
import { FOLK_CARE_CATEGORIES, ALL_CATEGORIES_ID, ALL_CATEGORIES_LABEL } from './data/yhoc/folkCareCategories';
import { SENSITIVE_GROUPS, SENSITIVE_GROUP_WARNING, EMERGENCY_MESSAGE } from './data/yhoc/folkCareSafety';

type Screen = 'hero' | 'safety' | 'form' | 'result' | 'folk' | 'learn';

const FORM_QUESTIONS = QUESTIONS.filter((q) => q.id !== 'q_red_flags');

const GROUP_ORDER = ['general', 'sleep', 'energy', 'hot_cold', 'thirst', 'digestion', 'urination', 'body_feeling', 'emotion', 'pain', 'lifestyle', 'tongue'];
const GROUP_LABELS: Record<string, string> = {
  general: 'Thông tin chung',
  sleep: 'Giấc ngủ',
  energy: 'Năng lượng',
  hot_cold: 'Cảm giác hàn/nhiệt',
  thirst: 'Miệng & nước uống',
  digestion: 'Tiêu hóa',
  urination: 'Tiểu tiện',
  body_feeling: 'Cảm giác cơ thể',
  emotion: 'Tâm trạng',
  pain: 'Đau / căng tức',
  lifestyle: 'Sinh hoạt',
  tongue: 'Quan sát lưỡi',
};

const CONFIDENCE_LABEL: Record<string, string> = {
  low: 'Gợi ý sơ bộ – dữ liệu còn ít',
  medium: 'Gợi ý vừa – dữ liệu chưa đầy đủ',
  fair: 'Gợi ý khá – có cơ sở vừa phải',
};

const FEATURE_CARDS = [
  { img: imgCardAmduong, title: 'Âm dương', text: 'Nhận diện xu hướng thiên hàn, thiên nhiệt, thiếu nghỉ ngơi hoặc hao tổn năng lượng theo ngôn ngữ cổ học.' },
  { img: imgCardTangphu, title: 'Tạng phủ', text: 'Học hiểu Can, Tâm, Tỳ, Phế, Thận trong hệ quy chiếu Đông y, không đồng nhất máy móc với cơ quan hiện đại.' },
  { img: imgCardKhihuyet, title: 'Khí huyết', text: 'Gợi ý xu hướng như khí hư, huyết hư, khí trệ, đàm thấp, âm hư, dương hư ở mức tham khảo.' },
  { img: imgCardDuongsinh, title: 'Dưỡng sinh nhẹ', text: 'Đề xuất ngủ nghỉ, ăn uống, vận động, hơi thở và điều hòa cảm xúc, không thuốc, không liều lượng.' },
];

const SAFETY_RULES = [
  'Không chẩn đoán bệnh hoặc kết luận sức khỏe chắc chắn.',
  'Không kê đơn, không đưa liều dược liệu, không hướng dẫn tự dùng thuốc.',
  'Không thay thế bác sĩ, thầy thuốc hoặc điều trị đang theo.',
  'Luôn kiểm tra dấu hiệu nguy hiểm trước khi luận giải cổ học.',
];

function QuestionItem({
  question, value, onChange, index,
}: {
  question: Question;
  value: YhocAnswers[string];
  onChange: (id: string, val: YhocAnswers[string]) => void;
  index: number;
}) {
  if (question.type === 'single') {
    return (
      <div className="q-card">
        <div className="q-eyebrow">{GROUP_LABELS[question.group] ?? question.group}</div>
        <div className="q-label">{index + 1}. {question.label}</div>
        {question.helperText && <div className="q-helper">{question.helperText}</div>}
        <div className="q-options">
          {question.options?.map((opt) => (
            <button
              key={opt.id}
              className={`q-opt${value === opt.value ? ' selected' : ''}`}
              onClick={() => onChange(question.id, opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === 'multiple') {
    const arr = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className="q-card">
        <div className="q-eyebrow">{GROUP_LABELS[question.group] ?? question.group}</div>
        <div className="q-label">{index + 1}. {question.label}</div>
        {question.helperText && <div className="q-helper">{question.helperText}</div>}
        <div className="q-options">
          {question.options?.map((opt) => {
            const checked = arr.includes(String(opt.value));
            return (
              <button
                key={opt.id}
                className={`q-opt${checked ? ' selected' : ''}`}
                onClick={() => {
                  const v = String(opt.value);
                  const next = checked ? arr.filter((x) => x !== v) : [...arr, v];
                  onChange(question.id, next);
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (question.type === 'scale') {
    const num = typeof value === 'number' ? value : question.min ?? 0;
    return (
      <div className="q-card">
        <div className="q-eyebrow">{GROUP_LABELS[question.group] ?? question.group}</div>
        <div className="q-label">{index + 1}. {question.label}</div>
        <div className="q-scale-row">
          <span className="q-scale-min">{question.min}</span>
          <input
            type="range"
            min={question.min}
            max={question.max}
            step={question.step ?? 1}
            value={num}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(question.id, parseFloat(e.target.value))}
            className="q-range"
          />
          <span className="q-scale-max">{question.max}</span>
          <span className="q-scale-val">{num}</span>
        </div>
        {question.allowSkip && (
          <button className="q-skip" onClick={() => onChange(question.id, null)}>Bỏ qua câu này</button>
        )}
      </div>
    );
  }

  return null;
}

function HeroScreen({ onNext, onSafety }: { onNext: () => void; onSafety: () => void }) {
  return (
    <div className="hero-wrap">
      <div className="hero-glow" />
      <div className="hero-grid">
        <section className="hero-left">
          <div className="hero-pill">🛡 Không chẩn đoán · Không kê đơn · Chỉ tham khảo cổ học</div>
          <h1 className="hero-title">
            Y <span className="hero-title-accent">– Y học cổ học</span> tham khảo
          </h1>
          <p className="hero-lead">
            Một không gian học hiểu và tự quan sát thể trạng theo âm dương, ngũ hành, tạng phủ, khí huyết, kinh lạc, tứ chẩn, bát cương và dưỡng sinh. App chỉ gợi ý xu hướng, không thay thế tư vấn y tế.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={onNext}>Bắt đầu tự quan sát →</button>
            <button className="btn-secondary" onClick={onSafety}>Đọc nguyên tắc an toàn</button>
          </div>
        </section>

        <section className="hero-right">
          <div className="hero-visual-card">
            <img src={imgHeroBg} alt="Y học cổ học tham khảo" className="hero-visual-img" />
          </div>
          <div className="mock-card">
            <div className="mock-card-header">
              <div>
                <div className="mock-eyebrow">Mẫu kết quả</div>
                <div className="mock-title">Xu hướng thể trạng</div>
              </div>
              <span className="mock-icon">☯</span>
            </div>
            <div className="mock-patterns">
              {[{ name: 'Khí hư', score: 78, conf: 'vừa' }, { name: 'Tỳ vị hư', score: 62, conf: 'thấp-vừa' }].map((p) => (
                <div key={p.name} className="mock-pattern">
                  <div className="mock-pattern-row">
                    <span className="mock-pattern-name">{p.name}</span>
                    <span className="mock-pattern-conf">confidence {p.conf}</span>
                  </div>
                  <div className="mock-bar-bg"><div className="mock-bar-fill" style={{ width: `${p.score}%` }} /></div>
                  <div className="mock-pattern-score">{p.score}</div>
                </div>
              ))}
            </div>
            <div className="mock-redflag">
              Nếu có đau ngực, khó thở, liệt, ngất hoặc dấu hiệu nặng, app ưu tiên khuyến nghị đi khám.
            </div>
          </div>
        </section>
      </div>

      <div className="feature-grid">
        {FEATURE_CARDS.map((c) => (
          <div key={c.title} className="feature-card">
            <div className="feature-img-wrap">
              <img src={c.img} alt={c.title} className="feature-img" />
            </div>
            <h3 className="feature-title">{c.title}</h3>
            <p className="feature-text">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SafetyScreen({ onNext, onBack }: { onNext: (hasFlag: boolean, selected: string[]) => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    if (id === 'none') { setSelected(['none']); return; }
    setSelected((prev: string[]) => {
      const without = prev.filter((x: string) => x !== 'none');
      return without.includes(id) ? without.filter((x: string) => x !== id) : [...without, id];
    });
  };

  const proceed = () => {
    const hasFlag = selected.length > 0 && !selected.includes('none');
    onNext(hasFlag, selected);
  };

  return (
    <div className="wide-screen">
      <button className="back-btn" onClick={onBack}>← Quay lại</button>
      <div className="section-eyebrow">an toàn trước</div>
      <h2 className="section-title">Cổng đỏ đặt trước cổng luận giải</h2>
      <p className="section-sub">
        App Y luôn hỏi dấu hiệu nguy hiểm trước. Nếu có red flag, màn kết quả dừng ở cảnh báo đi khám, không cố diễn giải Đông y.
      </p>

      <div className="safety-cols">
        <div className="safety-rules-col">
          <h3 className="col-title">🛡 Nguyên tắc hiển thị</h3>
          <div className="rules-list">
            {SAFETY_RULES.map((r) => (
              <div key={r} className="rule-item">{r}</div>
            ))}
          </div>
          <button className="btn-primary mt-btn" onClick={proceed} disabled={selected.length === 0}>
            Tôi đã hiểu, bắt đầu tự quan sát →
          </button>
          {selected.length === 0 && (
            <p className="safety-hint">Vui lòng xác nhận tình trạng bên dưới trước</p>
          )}
        </div>

        <div className="safety-flags-col">
          <h3 className="col-title danger-title">⚠ Red flags – bắt buộc đi khám</h3>
          <div className="redflag-grid">
            {SAFETY_WARNINGS.map((w) => (
              <button
                key={w.id}
                className={`redflag-item${selected.includes(w.id) ? ' selected' : ''} sev-${w.severity}`}
                onClick={() => toggle(w.id)}
              >
                <span className="redflag-label">{w.label}</span>
                {selected.includes(w.id) && <span className="redflag-msg">{w.message}</span>}
              </button>
            ))}
            <button
              className={`redflag-item none-item${selected.includes('none') ? ' selected' : ''}`}
              onClick={() => toggle('none')}
            >
              <span className="redflag-label">Không có dấu hiệu nào ở trên</span>
            </button>
          </div>
          <p className="redflag-note">
            Khi gặp dấu hiệu nguy hiểm, không dùng app để tự xử lý. Liên hệ bác sĩ hoặc cấp cứu tùy mức độ.
          </p>
        </div>
      </div>
    </div>
  );
}

function FormScreen({ onSubmit, onBack }: { onSubmit: (answers: YhocAnswers) => void; onBack: () => void }) {
  const [answers, setAnswers] = useState<YhocAnswers>({});
  const [activeGroup, setActiveGroup] = useState(GROUP_ORDER[0]);

  const handleChange = useCallback((id: string, val: YhocAnswers[string]) => {
    setAnswers((prev: YhocAnswers) => ({ ...prev, [id]: val }));
  }, []);

  const groups = GROUP_ORDER.filter((g) => FORM_QUESTIONS.some((q) => q.group === g));
  const currentGroupQs = FORM_QUESTIONS.filter((q) => q.group === activeGroup);
  const currentIndex = groups.indexOf(activeGroup);
  const isLast = currentIndex === groups.length - 1;
  const totalAnswered = Object.keys(answers).length;
  const totalQs = FORM_QUESTIONS.length;

  const next = () => {
    if (isLast) { onSubmit(answers); return; }
    setActiveGroup(groups[currentIndex + 1]);
    window.scrollTo(0, 0);
  };

  const prev = () => {
    if (currentIndex === 0) { onBack(); return; }
    setActiveGroup(groups[currentIndex - 1]);
    window.scrollTo(0, 0);
  };

  return (
    <div className="wide-screen">
      <div className="section-eyebrow">tự quan sát</div>
      <h2 className="section-title">Một vòng hỏi nhẹ, không ép kết luận</h2>
      <p className="section-sub">Bạn có thể bỏ qua câu không chắc. Engine tính xu hướng dựa trên dữ liệu đủ tin, đồng thời ghi rõ phần còn thiếu.</p>

      <div className="form-cols">
        <div className="form-main">
          <div className="form-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((currentIndex + 1) / groups.length) * 100}%` }} />
            </div>
            <span className="progress-label">Nhóm {currentIndex + 1} / {groups.length}</span>
          </div>

          <div className="group-tabs">
            {groups.map((g, i) => (
              <button
                key={g}
                className={`group-tab${activeGroup === g ? ' active' : ''}${i < currentIndex ? ' done' : ''}`}
                onClick={() => setActiveGroup(g)}
              >
                {i < currentIndex ? '✓' : GROUP_LABELS[g] ?? g}
              </button>
            ))}
          </div>

          <div className="questions-list">
            {currentGroupQs.map((q, i) => (
              <QuestionItem key={q.id} question={q} value={answers[q.id]} onChange={handleChange} index={i} />
            ))}
          </div>

          <div className="form-nav">
            <button className="btn-secondary" onClick={prev}>← Trước</button>
            <button className="btn-primary" onClick={next}>
              {isLast ? 'Xem kết quả →' : 'Tiếp →'}
            </button>
          </div>
          <p className="form-note">Tất cả câu hỏi đều có thể bỏ qua. App chỉ tham khảo dữ liệu bạn cung cấp.</p>
        </div>

        <aside className="form-sidebar">
          <h3 className="sidebar-title">Tiến độ</h3>
          <div className="sidebar-stat"><span>Đã trả lời</span><b>{totalAnswered} / {totalQs}</b></div>
          <div className="sidebar-stat"><span>Nhóm hiện tại</span><b>{GROUP_LABELS[activeGroup]}</b></div>
          <div className="sidebar-stat"><span>Cho phép bỏ qua</span><b>Có</b></div>
          <div className="sidebar-stat"><span>Độ tin cậy</span><b>tính sau</b></div>
          <p className="sidebar-note">Form có thêm quan sát lưỡi, mồ hôi, khát nước và đại tiểu tiện để tăng độ chính xác.</p>
        </aside>
      </div>
    </div>
  );
}

const normalizePatternScore = (score?: number) => {
  const raw = score ?? 0;
  return Math.max(0, Math.min(100, Math.round((raw / 7) * 100)));
};

function ResultScreen({ answers, onReset, onLearn, onFolk }: {
  answers: YhocAnswers;
  onReset: () => void;
  onLearn: () => void;
  onFolk: () => void;
}) {
  const result = interpretYhocAnswers(answers);
  
  // Get folk care suggestions based on patterns
  const patternIds = result.topPatterns.map(p => p.pattern.id);
  const folkSuggestions = suggestFolkCareByPattern(patternIds);

  if (result.emergencyFirst) {
    return (
      <div className="screen result-screen">
        <div className="emergency-box">
          <div className="emergency-icon">⚠️</div>
          <h2>Ưu tiên an toàn y tế</h2>
          <p>Bạn có dấu hiệu cần được thăm khám hoặc xử lý y tế. App không luận giải cổ học trong trường hợp này.</p>
          <ul className="emergency-list">
            {result.safetyWarnings.map((w) => (
              <li key={w.id}>
                <strong>{w.label}</strong><br />
                <span>{w.action}</span>
              </li>
            ))}
          </ul>
          {result.generalCautions.map((c, i) => <p key={i} className="caution-line">⚠ {c}</p>)}
        </div>
        <button className="btn-secondary" onClick={onReset}>Làm lại từ đầu</button>
      </div>
    );
  }

  return (
    <div className="wide-screen">
      <div className="section-eyebrow">kết quả tham khảo</div>
      <h2 className="section-title">Chỉ nói xu hướng, không nói bệnh</h2>
      <p className="section-sub">Điểm nghiêng theo pattern, dữ liệu còn thiếu, mâu thuẫn nếu có và dưỡng sinh nhẹ. Không thuốc, không liều, không phán quyết.</p>

      <div className="result-cols">
        <div className="result-main">
          <div className="disclaimer-bar">
            Kết quả chỉ mang tính tham khảo — không thay thế bác sĩ. App không đưa thuốc, phương tễ hoặc liều lượng.
          </div>

          {result.topPatterns.length === 0 && (
            <div className="no-pattern-box">
              <p>Dữ liệu hiện chưa đủ để gợi ý xu hướng thể trạng rõ ràng. Bạn có thể bổ sung thêm dữ liệu tự quan sát.</p>
            </div>
          )}

          {result.topPatterns.map((item, i) => {
            const scorePercent = normalizePatternScore(item.score);
            return (
            <div key={item.pattern.id} className={`pattern-card rank-${i}`}>
              <div className="pattern-header">
                <div className="pattern-icon-wrap">☯</div>
                <div>
                  <div className="pattern-name">Xu hướng {item.pattern.name}</div>
                  <div className="pattern-cat">{item.pattern.classicalCategory} · Mức tin cậy: {CONFIDENCE_LABEL[item.confidence] ?? item.confidence}</div>
                </div>
                <div className="pattern-score-num">{scorePercent}%</div>
              </div>
              <div className="pattern-score-bar-bg">
                <div className="pattern-score-bar-fill" style={{ width: `${scorePercent}%` }} />
              </div>
              <p className="pattern-wording">{item.wording}</p>
              <div className="pattern-signs">
                <strong>Dấu hiệu điển hình trong cổ học:</strong>
                <ul>{item.pattern.signs.slice(0, 5).map((s, j) => <li key={j}>{s}</li>)}</ul>
              </div>
              {item.pattern.supportiveCare.length > 0 && (
                <div className="pattern-care">
                  <strong>Dưỡng sinh tham khảo (không phải điều trị):</strong>
                  <ul>{item.pattern.supportiveCare.map((c, j) => <li key={j}>{c}</li>)}</ul>
                </div>
              )}
              {item.pattern.cautions.length > 0 && (
                <div className="pattern-caution">
                  <strong>Lưu ý:</strong>
                  <ul>{item.pattern.cautions.map((c, j) => <li key={j}>{c}</li>)}</ul>
                </div>
              )}
            </div>
            );
          })}

          {result.contradictions.length > 0 && (
            <div className="contradiction-box">
              <strong>Dữ liệu có mâu thuẫn:</strong>
              <ul>{result.contradictions.map((c, i) => <li key={i}>{c}</li>)}</ul>
            </div>
          )}

          {result.missingQuestionIds.length > 0 && (
            <div className="missing-box">
              <strong>Dữ liệu còn thiếu để gợi ý chính xác hơn:</strong>
              <ul>{result.missingQuestionIds.map((id) => <li key={id}>{getQuestionLabel(id)}</li>)}</ul>
            </div>
          )}

          <div className="general-cautions">
            {result.generalCautions.map((c, i) => <p key={i} className="caution-line">⚠ {c}</p>)}
          </div>

          {/* Folk Care Suggestions */}
          {!result.emergencyFirst && folkSuggestions.length > 0 && (
            <div className="folk-suggestions-box">
              <h3 className="folk-suggestions-title">Có thể tham khảo thêm trong Cẩm nang</h3>
              <p className="folk-suggestions-note">Những mục này chỉ là gợi ý đọc thêm, không phải hướng điều trị.</p>
              <div className="folk-suggestions-list">
                {folkSuggestions.slice(0, 5).map((item) => (
                  <div key={item.id} className="folk-suggestion-chip" onClick={onFolk}>
                    <span className="folk-suggestion-icon">📖</span>
                    <span className="folk-suggestion-text">{item.title}</span>
                  </div>
                ))}
              </div>
              <button className="btn-folk-link" onClick={onFolk}>Xem Cẩm nang chăm sóc đời sống →</button>
            </div>
          )}

          <div className="result-actions">
            <button className="btn-secondary" onClick={onReset}>Làm lại</button>
            <button className="btn-folk" onClick={onFolk}>Cẩm nang</button>
            <button className="btn-primary" onClick={onLearn}>Sang kho tự học →</button>
          </div>
        </div>

        <aside className="result-sidebar">
          <div className="sidebar-panel">
            <h3 className="sidebar-title">Gợi ý dưỡng sinh an toàn</h3>
            <ul className="sidebar-care-list">
              <li>Ngủ và thức đều giờ hơn trong 7 ngày tới.</li>
              <li>Ăn chậm, giảm bữa quá cay, quá lạnh hoặc quá dầu.</li>
              <li>Đi bộ nhẹ, thở chậm, không tập quá sức khi đang mệt.</li>
              <li>Ghi lại cảm giác nóng/lạnh, tiêu hóa, giấc ngủ để quan sát tiếp.</li>
            </ul>
          </div>
          {result.missingQuestionIds.length > 0 && (
            <div className="sidebar-panel">
              <h3 className="sidebar-title">Dữ liệu còn thiếu</h3>
              <p className="sidebar-note">Bổ sung thêm để tăng độ tin cậy của gợi ý.</p>
            </div>
          )}
          <div className="sidebar-panel danger-panel">
            <h3 className="sidebar-title danger-title">⚠ Khi nào nên đi khám?</h3>
            <p className="sidebar-note">Nếu triệu chứng kéo dài, nặng lên, có đau ngực, khó thở, ngất, sốt cao hoặc dấu hiệu bất thường, không dùng app để tự xử lý.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function LearnScreen({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<'glossary' | 'foundations'>('glossary');
  const [search, setSearch] = useState('');

  const filteredGlossary = (GLOSSARY as GlossaryTerm[]).filter((t: GlossaryTerm) =>
    !search || t.term.toLowerCase().includes(search.toLowerCase()) || t.plain.toLowerCase().includes(search.toLowerCase())
  );

  const foundations = Object.values(YHOC_FOUNDATIONS) as unknown as FoundationItem[];
  const filteredFound = foundations.filter((f: FoundationItem) =>
    !search || (f.title ?? '').toLowerCase().includes(search.toLowerCase()) || (f.summary ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const MODULES = ['Bản đồ tạng phủ', 'Bát cương', 'Tứ chẩn', 'Quan sát lưỡi'];

  return (
    <div className="wide-screen">
      <button className="back-btn" onClick={onBack}>← Quay lại</button>
      <div className="section-eyebrow">tự học</div>
      <h2 className="section-title">Kho thuật ngữ cổ học dễ đọc</h2>
      <p className="section-sub learn-note">
        Phần này giúp bạn hiểu ngôn ngữ Đông y mà app dùng. Luôn kèm cảnh báo không quy đổi máy móc sang bệnh danh hiện đại.
      </p>

      <div className="tab-row">
        <button className={`tab-btn${tab === 'glossary' ? ' active' : ''}`} onClick={() => setTab('glossary')}>Thuật ngữ</button>
        <button className={`tab-btn${tab === 'foundations' ? ' active' : ''}`} onClick={() => setTab('foundations')}>Nền tảng</button>
      </div>

      <input
        className="search-input"
        type="search"
        placeholder="Tìm kiếm..."
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
      />

      {tab === 'glossary' && (
        <>
          <div className="glossary-grid">
            {filteredGlossary.map((t: GlossaryTerm) => (
              <div key={t.id} className="glossary-item">
                <div className="glos-term-pill">{t.term}</div>
                <div className="glos-short">{t.short}</div>
                <div className="glos-plain">{t.plain}</div>
                {t.appExample && <div className="glos-example">Ví dụ: {t.appExample}</div>}
                <div className="glos-caution">⚠ {t.caution}</div>
              </div>
            ))}
          </div>
          <div className="module-panel">
            <h3 className="sidebar-title">Module học mở rộng</h3>
            <div className="module-grid">
              {MODULES.map((m) => (
                <div key={m} className="module-item">{m}</div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 'foundations' && (
        <div className="found-list">
          {filteredFound.map((f: FoundationItem) => (
            <div key={f.id} className="found-item">
              <div className="found-title">{f.title}</div>
              <div className="found-summary">{f.summary}</div>
              {f.appUse.length > 0 && (
                <div className="found-use">
                  <strong>Ứng dụng trong app:</strong>
                  <ul>{f.appUse.map((u, i) => <li key={i}>{u}</li>)}</ul>
                </div>
              )}
              <div className="found-caution">
                <strong>Wording an toàn:</strong>
                <ul>{f.safeWording.map((w, i) => <li key={i}>{w}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Folk Care Screen Component
function FolkCareScreen({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>(ALL_CATEGORIES_ID);
  const [selectedItem, setSelectedItem] = useState<FolkCareItem | null>(null);
  const [sensitiveGroups, setSensitiveGroups] = useState<string[]>([]);
  const [redFlags, setRedFlags] = useState<string[]>([]);

  const filterResult = filterFolkCare({
    searchTerm: search,
    category: category === ALL_CATEGORIES_ID ? undefined : category,
    sensitiveGroups: sensitiveGroups as any,
    hasRedFlag: redFlags.length > 0,
  });

  const filteredItems = filterResult.items;

  return (
    <div className="screen folk-screen">
      <div className="folk-header">
        <h1 className="folk-title">Cẩm nang chăm sóc đời sống</h1>
        <p className="folk-subtitle">
          Một số gợi ý chăm sóc nhẹ khi gặp khó chịu thường ngày. 
          Nội dung chỉ mang tính tham khảo, không thay thế bác sĩ hoặc thầy thuốc.
        </p>
        <button className="folk-back-btn" onClick={onBack}>← Quay lại</button>
      </div>

      {/* Search */}
      <div className="folk-toolbar">
        <div className="folk-search">
          <input
            type="text"
            placeholder="Tìm tình huống: đầy bụng, khó ngủ, lạnh tay chân..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="folk-search-input"
          />
        </div>

        {/* Category Filter */}
        <div className="folk-category-row">
          <button
            className={`folk-chip ${category === ALL_CATEGORIES_ID ? 'active' : ''}`}
            onClick={() => setCategory(ALL_CATEGORIES_ID)}
          >
            {ALL_CATEGORIES_LABEL}
          </button>
          {FOLK_CARE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`folk-chip ${category === cat.id ? 'active' : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Sensitive Groups */}
        <div className="folk-sensitive-box">
          <p className="folk-sensitive-label">Bạn có thuộc nhóm cần thận trọng không?</p>
          <div className="folk-sensitive-options">
            {SENSITIVE_GROUPS.map((group) => (
              <label key={group.id} className="folk-sensitive-checkbox">
                <input
                  type="checkbox"
                  checked={sensitiveGroups.includes(group.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSensitiveGroups([...sensitiveGroups, group.id]);
                    } else {
                      setSensitiveGroups(sensitiveGroups.filter((id) => id !== group.id));
                    }
                  }}
                />
                {group.label}
              </label>
            ))}
          </div>
        </div>

        {/* Red Flag Screening */}
        <div className="folk-warning">
          <p className="folk-warning-label">Dấu hiệu cần lưu ý (chọn nếu có):</p>
          <div className="folk-redflag-options">
            {getRedFlags().map((flag) => (
              <label key={flag.id} className="folk-redflag-checkbox">
                <input
                  type="checkbox"
                  checked={redFlags.includes(flag.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setRedFlags([...redFlags, flag.id]);
                    } else {
                      setRedFlags(redFlags.filter((id) => id !== flag.id));
                    }
                  }}
                />
                {flag.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="folk-content">
        {/* Emergency Warning */}
        {redFlags.length > 0 && (
          <div className="folk-emergency">
            <div className="folk-emergency-icon">🚨</div>
            <p className="folk-emergency-text">{EMERGENCY_MESSAGE}</p>
          </div>
        )}

        {/* Sensitive Warning */}
        {filterResult.filteredDueToSensitive && (
          <div className="folk-sensitive-warning">
            <p>{SENSITIVE_GROUP_WARNING}</p>
          </div>
        )}

        {/* Results */}
        {!redFlags.length && (
          <div className="folk-card-grid">
            {filteredItems.length === 0 ? (
              <p className="folk-no-results">Không tìm thấy kết quả phù hợp. Thử từ khóa khác hoặc chọn danh mục khác.</p>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="folk-card" onClick={() => setSelectedItem(item)}>
                  <div className="folk-card-header">
                    <span className="folk-card-category">
                      {FOLK_CARE_CATEGORIES.find((c) => c.id === item.category)?.icon}
                    </span>
                    <h3 className="folk-card-title">{item.title}</h3>
                    <span className={`folk-card-safety folk-card-safety-${item.safetyLevel}`}>
                      {item.safetyLevel === 'safe' ? 'An toàn' : item.safetyLevel === 'moderate' ? 'Thận trọng' : 'Hỏi bác sĩ'}
                    </span>
                  </div>
                  <p className="folk-card-situation">{item.situation}</p>
                  <div className="folk-card-signs">
                    {item.commonSigns.slice(0, 3).map((sign, i) => (
                      <span key={i} className="folk-card-sign">• {sign}</span>
                    ))}
                  </div>
                  <button className="folk-card-btn">Xem gợi ý an toàn →</button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="folk-detail-overlay" onClick={() => setSelectedItem(null)}>
          <div className="folk-detail" onClick={(e) => e.stopPropagation()}>
            <button className="folk-detail-close" onClick={() => setSelectedItem(null)}>✕</button>
            
            <h2 className="folk-detail-title">{selectedItem.title}</h2>
            <p className="folk-detail-situation">{selectedItem.situation}</p>

            <div className="folk-detail-section">
              <h4>Dấu hiệu thường gặp</h4>
              <ul>
                {selectedItem.commonSigns.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            <div className="folk-detail-section">
              <h4>Có thể thử</h4>
              <ul>
                {selectedItem.safeCare.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>

            {(!sensitiveGroups.length || !selectedItem.hasFolkIngredients) && selectedItem.folkNotes && (
              <div className="folk-detail-section folk-detail-folk">
                <h4>Ghi chú dân gian tham khảo</h4>
                <ul>
                  {selectedItem.folkNotes.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </div>
            )}

            {sensitiveGroups.length > 0 && selectedItem.hasFolkIngredients && (
              <div className="folk-detail-section folk-detail-sensitive">
                <p><strong>⚠️ Với nhóm cần thận trọng, app không hiển thị mẹo dân gian có nguyên liệu. Bạn nên hỏi bác sĩ hoặc chuyên gia phù hợp.</strong></p>
              </div>
            )}

            <div className="folk-detail-section">
              <h4>Ăn uống / sinh hoạt</h4>
              <ul>
                {selectedItem.foodLifestyleNotes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            </div>

            <div className="folk-detail-section">
              <h4>Nên tránh</h4>
              <ul>
                {selectedItem.avoid.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>

            <div className="folk-detail-section">
              <h4>Không phù hợp cho</h4>
              <ul>
                {selectedItem.notFor.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            </div>

            <div className="folk-detail-section folk-detail-doctor">
              <h4>Khi nào nên đi khám</h4>
              <ul>
                {selectedItem.whenToSeeDoctor.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>

            {selectedItem.redFlags.length > 0 && (
              <div className="folk-detail-section folk-detail-redflags">
                <h4>Cảnh báo</h4>
                <ul>
                  {selectedItem.redFlags.map((r, i) => <li key={i}>⚠️ {r}</li>)}
                </ul>
              </div>
            )}

            <div className="folk-detail-disclaimer">
              <p>Thông tin chỉ mang tính tham khảo, không phải chẩn đoán hay hướng dẫn điều trị.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('hero');
  const [answers, setAnswers] = useState<YhocAnswers>({});

  const goHero = () => { setScreen('hero'); setAnswers({}); };
  const goSafety = () => setScreen('safety');
  const goForm = () => setScreen('form');
  const goLearn = () => setScreen('learn');

  const handleSafety = (hasFlag: boolean, selected: string[]) => {
    const merged: YhocAnswers = { ...answers, q_red_flags: selected };
    if (hasFlag) {
      setAnswers(merged);
      setScreen('result');
    } else {
      setAnswers(merged);
      goForm();
    }
  };

  const handleSubmit = (formAnswers: YhocAnswers) => {
    setAnswers((prev: YhocAnswers) => ({ ...prev, ...formAnswers }));
    setScreen('result');
  };

  return (
    <div className="yhoc-app">
      <header className="app-header">
        <a href="/nguthuat" className="header-brand">
          <span className="header-logo">☯</span>
          <div>
            <div className="header-eyebrow">Ngũ thuật / Y</div>
            <div className="header-name">Y học cổ học tham khảo</div>
          </div>
        </a>
        <nav className="header-nav">
          {(['hero', 'safety', 'form', 'result', 'folk', 'learn'] as Screen[]).map((s) => (
            <button
              key={s}
              className={`header-nav-btn${screen === s ? ' active' : ''}`}
              onClick={() => setScreen(s)}
            >
              {{ hero: 'Trang đầu', safety: 'Nguyên tắc', form: 'Tự quan sát', result: 'Kết quả', folk: 'Cẩm nang', learn: 'Tự học' }[s]}
            </button>
          ))}
        </nav>
      </header>

      <main className="app-main">
        {screen === 'hero' && <HeroScreen onNext={goSafety} onSafety={goSafety} />}
        {screen === 'safety' && <SafetyScreen onNext={handleSafety} onBack={goHero} />}
        {screen === 'form' && <FormScreen onSubmit={handleSubmit} onBack={goSafety} />}
        {screen === 'result' && <ResultScreen answers={answers} onReset={goHero} onLearn={goLearn} onFolk={() => setScreen('folk')} />}
        {screen === 'folk' && <FolkCareScreen onBack={() => setScreen(Object.keys(answers).length > 0 ? 'result' : 'hero')} />}
        {screen === 'learn' && <LearnScreen onBack={() => setScreen(Object.keys(answers).length > 0 ? 'result' : 'hero')} />}
      </main>

      <footer className="app-footer">
        <span>Chỉ mang tính tham khảo – không thay thế bác sĩ – nên đi khám nếu có dấu hiệu bất thường.</span>
      </footer>
    </div>
  );
}
