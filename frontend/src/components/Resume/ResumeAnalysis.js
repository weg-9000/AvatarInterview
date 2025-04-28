import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { createResume } from "../../services/api";
import Button from "../common/Button";
import "../../styles/components/resume-form.css";

const ResumeForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    education: "",
    skills: "",
    experience: "",
    projects: "",
    certifications: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 오류 지우기
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "이름을 입력해주세요";
    if (!formData.email.trim()) newErrors.email = "이메일을 입력해주세요";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "유효한 이메일 주소를 입력해주세요";
    if (!formData.phone.trim()) newErrors.phone = "전화번호를 입력해주세요";
    else if (
      !/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/.test(formData.phone)
    ) {
      newErrors.phone = "유효한 전화번호를 입력해주세요";
    }
    if (!formData.company.trim())
      newErrors.company = "지원 회사를 입력해주세요";
    if (!formData.position.trim())
      newErrors.position = "지원 직무를 입력해주세요";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // 이력서 데이터 구성
      const resumeData = {
        personalInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        applicationInfo: {
          company: formData.company,
          position: formData.position,
        },
        resumeContent: {
          education: formData.education,
          skills: formData.skills,
          experience: formData.experience,
          projects: formData.projects,
          certifications: formData.certifications,
        },
      };

      // API 호출하여 이력서 저장
      const userId = "user_" + new Date().getTime(); // 임시 사용자 ID 생성
      const response = await createResume(userId, resumeData);

      // 로그인 처리
      login(userId, formData.name, {
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        position: formData.position,
      });

      // 면접 준비 페이지로 이동
      navigate(`/interview-prep/${userId}`);
    } catch (error) {
      console.error("이력서 저장 오류:", error);
      setErrors({
        submit: "이력서 저장 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="resume-form-container">
      <h2 className="form-title">이력서 작성</h2>
      <p className="form-description">
        면접 준비를 시작하기 위해 아래 정보를 입력해주세요.
      </p>

      <form onSubmit={handleSubmit} className="resume-form">
        <div className="form-section">
          <h3>기본 정보</h3>

          <div className="form-group">
            <label htmlFor="name">이름 *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="홍길동"
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">이메일 *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">전화번호 *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-1234-5678"
            />
            {errors.phone && <p className="error-message">{errors.phone}</p>}
          </div>
        </div>

        <div className="form-section">
          <h3>지원 정보</h3>

          <div className="form-group">
            <label htmlFor="company">지원 회사 *</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="지원 회사명"
            />
            {errors.company && (
              <p className="error-message">{errors.company}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="position">지원 직무 *</label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="지원 직무"
            />
            {errors.position && (
              <p className="error-message">{errors.position}</p>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>이력서 내용</h3>

          <div className="form-group">
            <label htmlFor="education">학력</label>
            <textarea
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="학교명, 전공, 졸업년도 등"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="skills">기술 스택</label>
            <textarea
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="보유한 기술 스택을 입력해주세요"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience">경력 사항</label>
            <textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="회사명, 직무, 근무 기간, 주요 업무 등"
              rows="5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="projects">프로젝트 경험</label>
            <textarea
              id="projects"
              name="projects"
              value={formData.projects}
              onChange={handleChange}
              placeholder="프로젝트명, 역할, 사용 기술, 성과 등"
              rows="5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="certifications">자격증/수상 내역</label>
            <textarea
              id="certifications"
              name="certifications"
              value={formData.certifications}
              onChange={handleChange}
              placeholder="자격증명, 취득일, 수상 내역 등"
              rows="3"
            />
          </div>
        </div>

        {errors.submit && (
          <p className="error-message submit-error">{errors.submit}</p>
        )}

        <div className="form-actions">
          <Button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? "저장 중..." : "이력서 저장하기"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResumeForm;
