import React from "react";

const ImprovementSuggestions = ({ evaluation }) => {
  // 평가에서 개선 제안 추출
  const extractSuggestions = () => {
    // 개선점이나 조언이 포함된 문단 찾기
    const paragraphs = evaluation.split("\n\n").filter((p) => p.trim());

    const suggestionParagraphs = paragraphs.filter(
      (p) =>
        p.toLowerCase().includes("제안") ||
        p.toLowerCase().includes("조언") ||
        p.toLowerCase().includes("개선") ||
        p.toLowerCase().includes("향상") ||
        p.toLowerCase().includes("추천")
    );

    // 개선 제안이 없으면 마지막 문단을 사용 (일반적으로 결론이나 조언)
    if (suggestionParagraphs.length === 0 && paragraphs.length > 0) {
      return [paragraphs[paragraphs.length - 1]];
    }

    return suggestionParagraphs;
  };

  const suggestions = extractSuggestions();

  // 개선 제안에서 개별 항목 추출 (번호 매기기 또는 글머리 기호로 구분)
  const extractItems = (text) => {
    const lines = text.split("\n");
    const items = [];
    let currentItem = "";

    for (const line of lines) {
      // 새 항목의 시작 (번호 또는 글머리 기호로 시작)
      if (/^\d+\.|\-|\•/.test(line.trim())) {
        if (currentItem) {
          items.push(currentItem.trim());
        }
        currentItem = line;
      } else {
        currentItem += " " + line;
      }
    }

    if (currentItem) {
      items.push(currentItem.trim());
    }

    return items.length > 0 ? items : [text];
  };

  return (
    <div className="improvement-suggestions">
      <h2>개선 제안</h2>

      {suggestions.length > 0 ? (
        <div className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-section">
              <h3>제안 {index + 1}</h3>
              <ul>
                {extractItems(suggestion).map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>구체적인 개선 제안을 찾을 수 없습니다.</p>
      )}

      <div className="practice-resources">
        <h3>추가 연습 자료</h3>
        <ul>
          <li>
            <a
              href="https://www.linkedin.com/learning/topics/interview-preparation"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn Learning - 면접 준비 강좌
            </a>
          </li>
          <li>
            <a
              href="https://www.coursera.org/courses?query=interview%20preparation"
              target="_blank"
              rel="noopener noreferrer"
            >
              Coursera - 면접 준비 과정
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/results?search_query=job+interview+tips"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube - 면접 팁 동영상
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ImprovementSuggestions;
