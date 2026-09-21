# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개발 명령어

패키지 매니저는 pnpm 만 쓴다. npm/yarn 으로 설치하면 `pnpm-lock.yaml` 과 어긋난다.

| 명령            | 내용                                                                |
| --------------- | ------------------------------------------------------------------- |
| `pnpm dev`      | 개발 서버(포트 3000). ESLint 자동 수정 + vue-tsc 실시간 검사 동작   |
| `pnpm build`    | 프로덕션 빌드                                                       |
| `pnpm prettier` | 전체 파일 포맷 (`--write`)                                          |
| `pnpm lint`     | `eslint --fix src` → `prettier --check .` → `vue-tsc --noEmit` 순차 |

- `pnpm lint` 의 prettier 단계는 `--check` 라 고쳐주지 않는다. 포맷 오류가 나면 `pnpm prettier` 를 먼저 돌리고 다시 실행한다
- 작업 종료 전 `pnpm prettier` → `pnpm lint` 를 통과시킨다. Stop hook 으로 자동화하면 이 항목은 삭제한다

## 환경 변수

- 모든 `VITE_*` 는 `src/constants/envs.ts` 의 `getRequiredEnv()` 로 검증한다. 누락 시 빌드가 아니라 **런타임**에 죽는다
- 공통값은 `.env` 에만 두고, `.env.qa` / `.env.sandbox` / `.env.prod` 에는 환경마다 달라지는 값만 override 한다. 공통값을 각 파일에 복사하면 한쪽만 고쳐져 어긋난다
- 변수를 추가하면 `envs.ts` 에도 함께 등록한다. 등록하지 않으면 검증을 타지 않아 `undefined` 가 그대로 흘러간다

## 함정

- **토큰 자동 재발급**: 응답 헤더에 `token: "must-renew"` 가 오면 `src/utils/apis.ts` 인터셉터가 토큰을 갱신하고 같은 요청을 재시도한다. 네트워크 탭에 요청이 두 번 찍히는 것은 정상이며, 401 을 디버깅할 때 이 재시도를 먼저 배제한다
- **라우트 변경 시 요청 일괄 취소**: `router.beforeEach` 가 `pendingRequests` 의 AbortController 를 전부 abort 한다. 네비게이션 직후 띄운 요청이 취소되면 대개 이것이 원인이므로, 이동 전에 await 하거나 이동 후에 호출한다
- **Vapor 모드 부분 적용**: 일부 컴포넌트만 Vapor 로 동작한다. 해당 컴포넌트에서는 Vuetify 등 비-Vapor 컴포넌트 혼용 시 interop 경계를 확인한다

## 도메인 간 의존 규칙

- `src/views/<domain>/` 끼리 직접 import 하지 않는다. 공용 UI 는 `src/views/components/`, 공용 로직은 `src/utils/` · `src/composition/` 으로 올린다
  - 예외: `src/views/test/` 는 각 도메인의 `types.ts` 를 import 한다. 테스트 페이지가 도메인 페이로드를 그대로 재현해야 하기 때문이다
- `src/utils/` 와 `src/stores/` 는 `src/views/` 를 참조하지 않는다. 역방향 의존이 생기면 순환이 난다
- import 경로는 `@/` alias 를 쓴다. 상대경로는 파일 이동 시 전부 깨진다

## CLAUDE.md 관리 규칙

- 이 파일은 200줄 이하 유지. 매 세션 필요한 내용만 둔다: 빌드/테스트 명령, 전역 컨벤션, 도메인 간 의존 규칙, 함정과 그 이유
- 코드에서 유추 가능한 내용(디렉터리 구조, 의존성 목록, 아키텍처 개요)은 쓰지 않는다
- 지시는 검증 가능한 수준으로 구체적으로 쓴다 (X "포맷 잘 맞춰라" / O "2-space 들여쓰기")
- 특정 도메인/경로에만 해당하는 규칙은 이 파일에 넣지 않는다
  - 도메인이 단일 폴더로 분리돼 있으면 → 해당 폴더의 CLAUDE.md
  - 여러 폴더에 흩어져 있으면 → `.claude/rules/<topic>.md` + `paths` frontmatter
  - 다단계 절차는 → 스킬
- 하위 CLAUDE.md 와 rules 에는 루트 규칙을 재진술하지 않는다. 충돌/중복 발견 시 사용자에게 알린다
- 도메인 규칙을 분리하면 아래 "도메인 인덱스"에 한 줄 추가한다
- 지시 파일을 추가/수정할 때는 변경 전 사용자에게 위치와 내용을 먼저 제안한다

## 도메인 인덱스

<!-- 형식: `경로/` — 한 줄 설명, 규칙 파일 위치 -->

- `src/views/admin/management/` — 관리자 계정 목록·편집 화면. 규칙 파일 없음
- `src/views/user/management/` — 사용자 계정 목록·편집 화면. 규칙 파일 없음
- `src/views/notice/management/` — 공지사항 목록·편집 화면. 규칙 파일 없음
- `src/views/test/` — 도메인별 API 호출을 수동 검증하는 통합 테스트 페이지. 규칙 파일 없음
- `src/views/components/` — 도메인 공용 UI 컴포넌트(데이터테이블, 다이얼로그, 네비게이션 등). 규칙 파일 없음
- `src/views/login/`, `src/views/error/`, `src/views/utility/` — 로그인·에러·상태 안내 단일 페이지. 규칙 파일 없음
- `src/layouts/` — 라우트별 레이아웃 셸. 규칙 파일 없음
- `src/stores/` — Pinia 전역 상태(인증, 확인 다이얼로그). 규칙 파일 없음
- `src/utils/` — API 클라이언트·토큰·검증·포매터 공용 유틸. 규칙 파일 없음
- `src/scss/` — Vuetify 전역 스타일 오버라이드. 규칙 파일 없음
- `src/views/**`, `src/utils/apis.ts` — API 호출·확인 다이얼로그·목록 화면 작성 규약, `.claude/rules/api-conventions.md`
- `**/CLAUDE.md`, `.claude/rules/**` — 지시 파일 작성/수정 기준, `.claude/rules/claude-md-maintenance.md`
