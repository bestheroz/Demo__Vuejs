# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Vue.js 3 + TypeScript + Vuetify를 사용한 관리자 대시보드 프로젝트입니다. 관리자, 사용자, 공지사항 관리 기능을 제공하며, 통합 테스트 페이지를 포함합니다.

## 주요 개발 명령어

### 개발 서버 실행
```bash
pnpm serve
# 또는
npm run serve
```
- 포트: 3000
- HMR 활성화
- 실시간 ESLint 검사 (serve 모드에서만)

### 빌드
```bash
pnpm build
# 또는
npm run build
```
- Vite 빌드 시스템 사용
- TypeScript target: ESNext
- 소스맵 생성 포함

### 린트 및 타입 체크
```bash
pnpm lint
# 또는
npm run lint
```
- ESLint 자동 수정 포함 (`--fix`)
- Vue TypeScript 컴파일러 검사 (`vue-tsc --noEmit`)
- 두 작업이 순차적으로 실행됨

## 아키텍처 구조

### 라우팅 시스템 (`src/router.ts`)
- **인증 가드**: 모든 보호된 경로는 `requireAuth()` 가드를 사용
- **레이아웃 시스템**: `meta.layout`을 통해 다양한 레이아웃 지원
  - `default`: 기본 관리자 레이아웃 (대시보드, 관리 페이지)
  - `auth`: 로그인 페이지 레이아웃
  - `error`: 에러 페이지 레이아웃
- **자동 요청 취소**: 라우트 변경 시 `pendingRequests` Map으로 추적되는 진행 중인 API 요청 자동 취소
- **경로 구조**:
  - `/admin/management` - 관리자 관리
  - `/user/management` - 사용자 관리
  - `/notice/management` - 공지사항 관리
  - `/test/integration` - 통합 테스트
  - `/login` - 로그인
  - `/error/*` - 에러 페이지들

### 상태 관리 (Pinia)
- **Pinia 설정**: `src/stores/index.ts`에서 초기화, `pinia-plugin-persistedstate`로 상태 영속화
- **주요 스토어**:
  - `admin` (`src/stores/admin.ts`): JWT 토큰 관리, 관리자 정보, 권한 관리
    - localStorage 키: `demo-accessToken`, `demo-refreshToken`
    - 토큰 자동 갱신 로직 포함
  - `confirm` (`src/stores/confirm.ts`): 확인 다이얼로그 상태 관리

### API 통신 (`src/utils/apis.ts`)
- **Axios 인스턴스**: baseURL로 `API_HOST` 환경변수 사용
- **요청 인터셉터**:
  - JWT Bearer 토큰 자동 첨부
  - 요청 ID 생성 및 AbortController 연결
  - `pendingRequests` Map으로 요청 추적
- **응답 인터셉터**:
  - 토큰 갱신 필요 시 (`token: "must-renew"`) 자동 재시도
  - 401 에러 시 로그인 페이지로 리다이렉트
  - 네트워크 에러 처리
- **API 헬퍼 함수**: `getApi`, `postApi`, `putApi`, `patchApi`, `deleteApi`
  - 자동 토스트 알림 (성공/실패)
  - 로딩 상태 관리 (`refLoading` ref 지원)
  - 기본 성공 메시지 제공

### 컴포넌트 구조
- **레이아웃**: `src/layouts/` - 애플리케이션 레이아웃
- **공통 컴포넌트**: `src/views/components/` - 재사용 가능한 UI 컴포넌트
- **페이지별 디렉토리**:
  - `src/views/admin/management/` - 관리자 관리 페이지 및 컴포넌트
  - `src/views/user/management/` - 사용자 관리 페이지 및 컴포넌트
  - `src/views/notice/management/` - 공지사항 관리 페이지 및 컴포넌트
  - `src/views/test/` - 테스트 페이지
  - `src/views/login/` - 로그인 페이지
  - `src/views/error/` - 에러 페이지들

### Vuetify 설정 (`src/plugins/vuetify.ts`)
- **테마**: 다크 테마 기본
- **로케일**: 한국어 (`ko`)
- **전역 기본값**:
  - 모든 입력 컴포넌트: `clearable: true`, `density: "comfortable"`
  - VTextField, VSelect 등: `color: "primary"`
  - VTextarea: `autoGrow: true`, 기본 2줄
  - VSwitch, VCheckbox: `hideDetails: "auto"`
  - VBottomSheet: `inset: true`, `scrollable: true`

## 코딩 규칙

### TypeScript 설정 (`tsconfig.json`)
- **Strict 모드**: 활성화 (단, `noImplicitAny: false`)
- **Module Resolution**: bundler 모드
- **Path Alias**: `@/*` → `src/*`
- **Vue 3 설정**: `useDefineForClassFields: true`
- **Type-only imports**: `verbatimModuleSyntax: true` 설정으로 권장

### ESLint 규칙 (`eslint.config.js`)
- **TypeScript ESLint**: 권장 규칙 적용
- **보안**: `eslint-plugin-security` 적용 (object-injection 제외)
- **Vue 3 규칙**:
  - 컴포넌트명: PascalCase 강제
  - multi-word-component-names 비활성화
- **Import**: 중복 import 방지
- **환경별 규칙**:
  - 개발: console 허용, debugger 허용
  - 프로덕션: console 제한 (info, warn, error만), debugger 금지
- **Prettier 호환**: 충돌 규칙 비활성화

## 환경 설정
- **Node.js**: 22.18.0 (Volta로 버전 고정)
- **패키지 매니저**: PNPM 권장 (package.json scripts에 pnpm 명시)
- **번들러**: Vite 7.1.2
- **TypeScript**: 타겟 ESNext
- **환경 변수**: `src/constants/envs.ts`에서 관리 (`API_HOST` 등)