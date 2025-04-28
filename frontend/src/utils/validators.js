// 이메일 유효성 검사
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 비어있는지 검사
export const isNotEmpty = (value) => {
  return value !== null && value !== undefined && value.trim() !== "";
};

// 최소 길이 검사
export const hasMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

// 최대 길이 검사
export const hasMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

// 파일 유형 검사
export const isValidFileType = (file, allowedTypes) => {
  if (!file) return false;

  // 파일 확장자 추출
  const extension = file.name.split(".").pop().toLowerCase();

  // MIME 타입 또는 확장자로 검사
  return allowedTypes.some((type) => {
    if (type.startsWith(".")) {
      return extension === type.substring(1);
    } else {
      return file.type === type;
    }
  });
};

// 파일 크기 검사
export const isValidFileSize = (file, maxSizeInBytes) => {
  if (!file) return false;

  return file.size <= maxSizeInBytes;
};

// 폼 유효성 검사
export const validateForm = (formData, validationRules) => {
  const errors = {};

  for (const field in validationRules) {
    const value = formData[field];
    const rules = validationRules[field];

    for (const rule of rules) {
      const { type, message, ...params } = rule;

      let isValid = true;

      switch (type) {
        case "required":
          isValid = isNotEmpty(value);
          break;
        case "email":
          isValid = isValidEmail(value);
          break;
        case "minLength":
          isValid = hasMinLength(value, params.length);
          break;
        case "maxLength":
          isValid = hasMaxLength(value, params.length);
          break;
        default:
          isValid = true;
      }

      if (!isValid) {
        errors[field] = message;
        break;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
