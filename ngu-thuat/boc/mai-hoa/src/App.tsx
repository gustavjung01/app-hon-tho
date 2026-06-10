import { useState } from "react";
import type { CalculationResult, TimeInput, ThreeNumbersInput, QuestionType, StructuredInterpretation } from "./engine";
import { calculateByTime, calculateByThreeNumbers, generateContextualInterpretation, getReflectionQuestions } from "./engine";
import earthlyBranches from "./data/earthly_branches.json";
import safetyCopy from "./data/safety_copy.json";
import { questionTypes } from "./data/question_types";

type Method = "time" | "three_numbers";

function App() {
  const [method, setMethod] = useState<Method>("time");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [interpretation, setInterpretation] = useState<StructuredInterpretation | null>(null);
  const [question, setQuestion] = useState("");
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType | null>(null);

  // Time input state
  const [yearBranch, setYearBranch] = useState<number>(1);
  const [month, setMonth] = useState<number>(1);
  const [day, setDay] = useState<number>(1);
  const [hourBranch, setHourBranch] = useState<number>(1);

  // Three numbers input state
  const [num1, setNum1] = useState<number>(1);
  const [num2, setNum2] = useState<number>(2);
  const [num3, setNum3] = useState<number>(3);

  const handleCalculate = () => {
    let calcResult: CalculationResult;
    if (method === "time") {
      const input: TimeInput = {
        yearBranch,
        month,
        day,
        hourBranch
      };
      calcResult = calculateByTime(input);
    } else {
      const input: ThreeNumbersInput = {
        num1,
        num2,
        num3
      };
      calcResult = calculateByThreeNumbers(input);
    }
    setResult(calcResult);
    setInterpretation(generateContextualInterpretation(calcResult, selectedQuestionType || undefined));
  };

  const getCurrentTime = () => {
    const now = new Date();
    // Approximate lunar date (simplified for demo)
    const branchIndex = (now.getFullYear() - 4) % 12;
    const hour = now.getHours();
    const hourBranchIndex = Math.floor((hour + 1) / 2) % 12 || 12;

    setYearBranch(branchIndex === 0 ? 12 : branchIndex);
    setMonth(now.getMonth() + 1);
    setDay(now.getDate());
    setHourBranch(hourBranchIndex === 0 ? 12 : hourBranchIndex);
  };

  const getRandomNumbers = () => {
    setNum1(Math.floor(Math.random() * 100) + 1);
    setNum2(Math.floor(Math.random() * 100) + 1);
    setNum3(Math.floor(Math.random() * 100) + 1);
  };

  const reflectionQuestions = getReflectionQuestions(selectedQuestionType || undefined);
  
  return (
    <div className="mai-hoa-app">
      {/* Header */}
      <nav className="top-nav">
        <a href="/nguthuat/boc" className="brand">
          <span className="brand-icon">☵</span>
          <span className="brand-full">Bốc - Mai Hoa</span>
        </a>
        <div className="nav-links">
          <a href="/nguthuat">Ngũ thuật</a>
          <a href="/">Trang chủ</a>
        </div>
      </nav>
      
      {/* Hero */}
      <div className="mai-hoa-hero">
        <div className="breadcrumb">
          <a href="/">🏠</a> / <a href="/nguthuat">Ngũ thuật</a> / <a href="/nguthuat/boc">Bốc</a> / <span>Mai Hoa Dịch Số</span>
        </div>
        <h1>Mai Hoa Dịch Số</h1>
        <p className="hero-subtitle">梅花易數 · Ứng dụng tra cứu tượng số có kiểm soát</p>
        <p className="hero-desc">
          Khởi quẻ tham khảo theo thời gian hoặc số liệu đầu vào.
          Kết quả phục vụ phản tư, không thay thế quyết định thực tế.
        </p>
      </div>
      
      {/* Safety Banner */}
      <div className="safety-banner">
        <span className="safety-icon">⚠️</span>
        <span>{safetyCopy.disclaimers[0].content}</span>
      </div>
      
      {/* Main Content */}
      <main className="mai-hoa-main">
        {/* Method Selection */}
        <div className="method-selector">
          <h2>Chọn phương thức khởi quẻ</h2>
          <div className="method-buttons">
            <button 
              className={`method-btn ${method === "time" ? "active" : ""}`}
              onClick={() => setMethod("time")}
            >
              <span className="method-icon">🕐</span>
              <span>Theo thời gian</span>
            </button>
            <button 
              className={`method-btn ${method === "three_numbers" ? "active" : ""}`}
              onClick={() => setMethod("three_numbers")}
            >
              <span className="method-icon">🔢</span>
              <span>Theo 3 số</span>
            </button>
          </div>
        </div>
        
        {/* Input Form */}
        <div className="input-section">
          <h3>Nhập thông tin</h3>
          
          <div className="question-type-selector">
            <label htmlFor="question-type">Loại câu hỏi / Chủ đề</label>
            <select
              id="question-type"
              value={selectedQuestionType?.id || ""}
              onChange={(e) => {
                const selected = questionTypes.find(q => q.id === e.target.value);
                setSelectedQuestionType(selected || null);
              }}
            >
              <option value="">-- Chọn loại câu hỏi --</option>
              {questionTypes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.label}
                  {q.riskLevel === "high" ? " ⚠️" : q.riskLevel === "medium" ? " ●" : " ○"}
                </option>
              ))}
            </select>
            {selectedQuestionType && (
              <div className={`risk-badge risk-${selectedQuestionType.riskLevel}`}>
                {selectedQuestionType.riskLevel === "high" && "⚠️ Mức độ nhạy cảm cao"}
                {selectedQuestionType.riskLevel === "medium" && "● Mức độ nhạy cảm trung bình"}
                {selectedQuestionType.riskLevel === "low" && "○ Mức độ nhạy cảm thấp"}
              </div>
            )}
          </div>

          <div className="question-input">
            <label htmlFor="question">Câu hỏi cụ thể (không bắt buộc)</label>
            <input
              id="question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={selectedQuestionType ? `Ví dụ: ${selectedQuestionType.guidanceTone}...` : "Ví dụ: Điều cần lưu ý trong công việc hiện tại..."}
            />
          </div>
          
          {method === "time" ? (
            <div className="time-inputs">
              <div className="input-row">
                <div className="input-group">
                  <label>Chi năm (1-12)</label>
                  <select value={yearBranch} onChange={(e) => setYearBranch(Number(e.target.value))}>
                    {earthlyBranches.map((b) => (
                      <option key={b.id} value={b.id}>{b.id} - {b.name} ({b.element})</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Tháng (1-12)</label>
                  <input 
                    type="number" 
                    min={1} max={12} 
                    value={month} 
                    onChange={(e) => setMonth(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Ngày (1-30)</label>
                  <input 
                    type="number" 
                    min={1} max={30} 
                    value={day} 
                    onChange={(e) => setDay(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label>Chi giờ (1-12)</label>
                  <select value={hourBranch} onChange={(e) => setHourBranch(Number(e.target.value))}>
                    {earthlyBranches.map((b) => (
                      <option key={b.id} value={b.id}>{b.id} - {b.name} ({b.element})</option>
                    ))}
                  </select>
                </div>
              </div>
              <button className="auto-fill-btn" onClick={getCurrentTime}>
                Lấy thời gian hiện tại (ước tính)
              </button>
            </div>
          ) : (
            <div className="numbers-inputs">
              <div className="input-row">
                <div className="input-group">
                  <label>Số 1 (Thượng quái)</label>
                  <input 
                    type="number" 
                    min={1} 
                    value={num1} 
                    onChange={(e) => setNum1(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label>Số 2 (Hạ quái)</label>
                  <input 
                    type="number" 
                    min={1} 
                    value={num2} 
                    onChange={(e) => setNum2(Number(e.target.value))}
                  />
                </div>
                <div className="input-group">
                  <label>Số 3 (Hào động)</label>
                  <input 
                    type="number" 
                    min={1} 
                    value={num3} 
                    onChange={(e) => setNum3(Number(e.target.value))}
                  />
                </div>
              </div>
              <button className="auto-fill-btn" onClick={getRandomNumbers}>
                Tạo số ngẫu nhiên
              </button>
            </div>
          )}
          
          <button className="calculate-btn" onClick={handleCalculate}>
            Khởi quẻ
          </button>
        </div>
        
        {/* Results */}
        {result && (
          <div className="results-section">
            <h2>Kết quả</h2>
            
            {/* Hexagram Display */}
            <div className="hexagram-display">
              <div className="hexagram-card primary">
                <div className="hexagram-label">Quẻ chủ</div>
                <div className="hexagram-unicode">{result.primaryHexagram.unicode}</div>
                <div className="hexagram-name">{result.primaryHexagram.name_vi}</div>
                <div className="hexagram-han">{result.primaryHexagram.name_han}</div>
                <div className="hexagram-meaning">{result.primaryHexagram.short_meaning}</div>
              </div>
              
              <div className="hexagram-arrow">→</div>
              
              <div className="hexagram-card mutual">
                <div className="hexagram-label">Quẻ hỗ</div>
                <div className="hexagram-unicode">{result.mutualHexagram.unicode}</div>
                <div className="hexagram-name">{result.mutualHexagram.name_vi}</div>
                <div className="hexagram-han">{result.mutualHexagram.name_han}</div>
              </div>
              
              <div className="hexagram-arrow">→</div>
              
              <div className="hexagram-card changed">
                <div className="hexagram-label">Quẻ biến</div>
                <div className="hexagram-unicode">{result.changedHexagram.unicode}</div>
                <div className="hexagram-name">{result.changedHexagram.name_vi}</div>
                <div className="hexagram-han">{result.changedHexagram.name_han}</div>
              </div>
            </div>
            
            {/* Trigram Details */}
            <div className="trigram-details">
              <h3>Thông tin quái</h3>
              <div className="trigram-cards">
                <div className="trigram-card">
                  <div className="trigram-label">Thượng quái</div>
                  <div className="trigram-unicode">{result.upperTrigram.unicode}</div>
                  <div className="trigram-name">{result.upperTrigram.name_vi} {result.upperTrigram.name_han}</div>
                  <div className="trigram-info">
                    <span>Ngũ hành: {result.upperTrigram.element}</span>
                    <span>Tượng: {result.upperTrigram.basic_symbol}</span>
                  </div>
                </div>
                <div className="trigram-card">
                  <div className="trigram-label">Hạ quái</div>
                  <div className="trigram-unicode">{result.lowerTrigram.unicode}</div>
                  <div className="trigram-name">{result.lowerTrigram.name_vi} {result.lowerTrigram.name_han}</div>
                  <div className="trigram-info">
                    <span>Ngũ hành: {result.lowerTrigram.element}</span>
                    <span>Tượng: {result.lowerTrigram.basic_symbol}</span>
                  </div>
                </div>
              </div>
              <div className="moving-line-display">
                Hào động: <strong>{result.movingLine}</strong>
              </div>
            </div>
            
            {/* Derivation Steps */}
            <details className="derivation-section">
              <summary><h3>Vết tính toán</h3></summary>
              <div className="derivation-steps">
                {result.derivationSteps.map((step, index) => (
                  <div key={index} className="derivation-step">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">
                      <div className="step-title">{step.step}</div>
                      <div className="step-formula">{step.formula}</div>
                      {step.calculation && (
                        <div className="step-calc">{step.calculation}</div>
                      )}
                      <div className="step-result">= {step.result}</div>
                    </div>
                  </div>
                ))}
              </div>
            </details>
            
            {/* Structured Interpretation */}
            {interpretation && (
              <>
                {/* Summary */}
                {interpretation.summary.length > 0 && (
                  <div className="interpretation-section summary-section">
                    <h3>Tóm tắt dễ hiểu</h3>
                    <div className="section-content">
                      {interpretation.summary.map((item, index) => (
                        <p key={index} className="interpretation-item">{item}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contextual Analysis */}
                {interpretation.contextualAnalysis.length > 0 && (
                  <div className="interpretation-section analysis-section">
                    <h3>Luận theo bối cảnh</h3>
                    <div className="section-content">
                      {interpretation.contextualAnalysis.map((item, index) => (
                        <p key={index} className="interpretation-item">{item}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Things to Observe */}
                {interpretation.thingsToObserve.length > 0 && (
                  <div className="interpretation-section observe-section">
                    <h3>Điều nên quan sát</h3>
                    <ul className="section-list">
                      {interpretation.thingsToObserve.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Light Guidance */}
                {interpretation.lightGuidance.length > 0 && (
                  <div className="interpretation-section guidance-section">
                    <h3>Gợi ý hành động nhẹ</h3>
                    <ul className="section-list">
                      {interpretation.lightGuidance.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Safety Warnings */}
                {interpretation.safetyWarnings.length > 0 && (
                  <div className="interpretation-section warnings-section">
                    <h3>Cảnh báo an toàn</h3>
                    <ul className="section-list warning-list">
                      {interpretation.safetyWarnings.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* I Ching Details */}
                {interpretation.iChingDetails.length > 0 && (
                  <div className="interpretation-section iching-section">
                    <h3>Chi tiết Dịch học</h3>
                    <ul className="section-list">
                      {interpretation.iChingDetails.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Calculation Details */}
                {interpretation.calculationDetails.length > 0 && (
                  <div className="interpretation-section calc-section">
                    <h3>Chi tiết cách tính</h3>
                    <ul className="section-list">
                      {interpretation.calculationDetails.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {/* Reflection Questions */}
            <div className="reflection-section">
              <h3>Câu hỏi phản tư</h3>
              <ul className="reflection-list">
                {reflectionQuestions.map((q, index) => (
                  <li key={index}>{q}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Info Section */}
        <div className="info-section">
          <h3>Về Mai Hoa Dịch Số</h3>
          <p>
            Mai Hoa Dịch Số (梅花易數) là một phương pháp khởi quẻ trong Dịch học, 
            thường được truyền thống gắn với Thiệu Ung và mạch Thiệu học. 
            Phương pháp này dùng các con số từ thời gian hoặc sự việc để sinh ra quẻ Dịch,
            từ đó tham khảo tượng số và diễn giải tình thế.
          </p>
          <p>
            <strong>Lưu ý:</strong> Mai Hoa Dịch Số là công cụ học thuật và tham khảo, 
            không phải khoa học chính thống. Kết quả không nên được dùng để thay thế 
            tư vấn chuyên môn, quyết định y tế, pháp lý, tài chính hay an toàn cá nhân.
          </p>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mai-hoa-footer">
        <a href="/nguthuat/boc" className="back-link">← Quay về Bốc</a>
        <a href="/nguthuat" className="back-link">← Quay về Ngũ thuật</a>
        <a href="/" className="back-link">← Về trang chủ</a>
        <p className="footer-note">Cổ học – Tra cứu và thực hành có kiểm soát.</p>
      </footer>
    </div>
  );
}

export default App;
