# 빌드 단계
FROM node:20 AS build

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm ci

# 모든 소스 코드 복사
COPY . .

# jsconfig.json 또는 tsconfig.json이 있는지 확인
RUN ls -la

# 빌드 실행
RUN npm run build

# 실행 단계
FROM nginx:alpine

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일 복사
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

