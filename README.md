# BU Manager Web

Next.js 14 + React 18 기반의 App Router 프로젝트로, Tailwind CSS v4와 Ant Design v5를 동시에 사용합니다. 모든 컬러/타이포 토큰은 Tailwind `@theme`와 Ant Design `ConfigProvider`가 공유합니다.

## 개발 환경

- Next.js 14 / React 18
- Tailwind CSS v4 (`@theme` 기반 토큰)
- Ant Design v5 (+ css-in-js SSR 대응)
- ESLint + Prettier + Husky + lint-staged + Commitlint

## 스크립트

| 명령어                              | 설명                                 |
| ----------------------------------- | ------------------------------------ |
| `yarn dev`                          | 개발 서버 실행                       |
| `yarn build` / `yarn start`         | 프로덕션 빌드 & 실행                 |
| `yarn lint` / `yarn lint:fix`       | ESLint 검사 / 자동 수정              |
| `yarn format` / `yarn format:check` | Prettier 포맷팅 / 검증               |
| `yarn prepare`                      | Husky 훅 설치 (`git clone` 직후 1회) |

> 커밋 시 Husky가 pre-commit(lint-staged)과 commit-msg(Commitlint)를 자동 실행합니다.

## src 디렉토리 구조

```
src/
├─ app/               # Next.js App Router 엔트리 (layout/page 등)
├─ components/
│  ├─ ui/             # 버튼·인풋 등 기본 UI
│  ├─ common/         # Header, Footer, Layout 등 공용 컴포넌트
│  └─ features/       # 도메인/기능 단위 컴포넌트 (예: AntdPreview)
├─ constants/         # 색상, 키, Config 상수
├─ hooks/             # 재사용 가능한 커스텀 훅
├─ lib/
│  └─ api/            # API 클라이언트, fetch 헬퍼
├─ types/             # 전역/도메인 타입 정의
└─ app/...            # 페이지 전용 로직 (Tailwind/AntD 테마 샘플 포함)
```

필요한 모듈은 `@/` alias 로 import 합니다(`tsconfig.json` 참고).

## 사용 가이드

1. `yarn install && yarn prepare`
2. `yarn dev` 후 `http://localhost:3000` 접속
3. 브라우저/OS 다크 모드 전환으로 Tailwind·AntD 토큰 변경 확인

### 커밋 규칙

- Conventional Commits (`feat: ...`, `chore: ...` 등)
- 허용 타입: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`
- 제목 길이 100자 이하, 문장형 금지

## 참고

- Tailwind v4 Docs: https://tailwindcss.com/docs/v4
- Ant Design Customization: https://ant.design/docs/react/customize-theme
