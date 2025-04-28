import React from "react";

const EvaluationSummary = ({ evaluation }) => {
  // 평가 결과에서 주요 섹션 추출
  const extractSections = () => {
    // 간단한 구현: 문단별로 나누고 각 문단을 섹션으로 간주
    const paragraphs = evaluation.split("\n\n").filter((p) => p.trim());

    // 첫 번째 문단은 일반적으로 전체 요약
    const summary = paragraphs[0] || "";

    // 강점과 약점 섹션 찾기
    const strengthsIndex = paragraphs.findIndex(
      (p) =>
        p.toLowerCase().includes("강점") || p.toLowerCase().includes("장점")
    );

    const weaknessesIndex = paragraphs.findIndex(
      (p) =>
        p.toLowerCase().includes("약점") || p.toLowerCase().includes("개선점")
    );

    const strengths = strengthsIndex !== -1 ? paragraphs[strengthsIndex] : "";
    const weaknesses =
      weaknessesIndex !== -1 ? paragraphs[weaknessesIndex] : "";

    return { summary, strengths, weaknesses };
  };

  const { summary, strengths, weaknesses } = extractSections();

  return (
    <div className="evaluation-summary">
      <h2>평가 요약</h2>

      <div className="summary-section">
        <h3>종합 평가</h3>
        <p>{summary}</p>
      </div>

      {strengths && (
        <div className="strengths-section">
          <h3>강점</h3>
          <p>{strengths}</p>
        </div>
      )}

      {weaknesses && (
        <div className="weaknesses-section">
          <h3>개선점</h3>
          <p>{weaknesses}</p>
        </div>
      )}

      <div className="full-evaluation">
        <h3>전체 평가</h3>
        <div className="evaluation-text">
          {evaluation.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvaluationSummary;
