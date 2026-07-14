# 졸업 시험 플랫폼 (graduation-exam-platform)

한국성서대학교 졸업 시험 연습 웹 애플리케이션입니다.

## 기능

- 홈: 캐러셀, D-DAY, 공지사항, 과목별 합격률
- 관리: 시험일·공지·합격률 입력 (localStorage 연동)
- 문제 풀이: 영어·성경·컴퓨터 연습 / Set Test
- 신청자 조회: 학번·이름·학과 검색

## 로컬 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
npm run preview
```

## 배포 (GitHub Pages)

1. GitHub에 저장소 생성 (예: `graduation-exam-platform`)
2. 아래 명령으로 push
3. GitHub → Settings → Pages → Source: **GitHub Actions** 선택
4. 배포 URL: `https://HAKYEOM03.github.io/graduation-exam-platform/`
