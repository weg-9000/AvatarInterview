import React, { useState } from "react";
// 현재 사용하지 않는 컴포넌트입니다.
// 추후 파일 업로드 기능이 필요할 경우 다시 활성화할 수 있습니다.

const ResumeUploader = ({ onUpload, isUploading }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // 파일 유형 검증
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setError("지원되는 파일 형식은 PDF, DOC, DOCX입니다.");
      setFile(null);
      return;
    }

    // 파일 크기 검증 (10MB 제한)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("파일 크기는 10MB 이하여야 합니다.");
      setFile(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      setError("이력서 파일을 선택해주세요.");
      return;
    }

    onUpload(file);
  };

  return (
    <div className="resume-uploader">
      <h3>이력서 업로드</h3>

      <form onSubmit={handleSubmit}>
        <div className="file-input-container">
          <input
            type="file"
            id="resume-file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            disabled={isUploading}
          />
          <label htmlFor="resume-file" className="file-input-label">
            {file ? file.name : "이력서 파일 선택 (PDF, DOC, DOCX)"}
          </label>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="file-info">
          {file && (
            <p>
              <strong>파일명:</strong> {file.name}
              <br />
              <strong>크기:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          )}
        </div>

        <button
          type="submit"
          className="upload-button"
          disabled={!file || isUploading}
        >
          {isUploading ? "업로드 중..." : "이력서 업로드"}
        </button>
      </form>
    </div>
  );
};

export default ResumeUploader;
