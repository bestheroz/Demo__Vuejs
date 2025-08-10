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
- 실시간 ESLint 검사

### 빌드
```bash
pnpm build
# 또는
npm run build
```

### 린트 및 타입 체크
```bash
pnpm lint
# 또는
npm run lint
```
- ESLint 자동 수정 포함
- Vue TypeScript 컴파일러 검사

## 아키텍처 구조

### 라우팅 시스템
- **인증 가드**: 모든 보호된 경로는 `requireAuth()` 가드를 사용
- **레이아웃 시스템**: `meta.layout`을 통해 다양한 레이아웃 지원
  - `default`: 기본 관리자 레이아웃
  - `auth`: 로그인 페이지 레이아웃
  - `error`: 에러 페이지 레이아웃
- **자동 요청 취소**: 라우트 변경 시 진행 중인 API 요청 자동 취소

### 상태 관리 (Pinia)
- **Pinia**: Vue 3 공식 상태 관리 라이브러리 사용
- **Persistent State**: `pinia-plugin-persistedstate`로 상태 영속화
- **주요 스토어**:
  - `admin`: 관리자 인증 및 권한 관리
  - `confirm`: 확인 다이얼로그 관리

### API 통신
- **Axios 인스턴스**: 중앙화된 HTTP 클라이언트 (`src/utils/apis.ts`)
- **자동 토큰 관리**: 요청 인터셉터에서 JWT 토큰 자동 첨부
- **에러 핸들링**: 401 에러 시 자동 로그인 페이지 리다이렉트
- **요청 추적**: 진행 중인 요청을 추적하여 라우트 변경 시 취소

### 컴포넌트 구조
- **레이아웃**: `layouts/` - 페이지 전체 레이아웃
- **공통 컴포넌트**: `views/components/` - 재사용 가능한 UI 컴포넌트
- **페이지별 컴포넌트**: 각 기능별로 디렉토리 구성
  - `admin/management/` - 관리자 관리
  - `user/management/` - 사용자 관리  
  - `notice/management/` - 공지사항 관리

### 스타일링
- **Vuetify 3**: Material Design 컴포넌트 라이브러리
- **다크 테마**: 기본 테마로 설정
- **한국어 로케일**: 기본 언어 설정
- **SCSS**: `src/scss/` - 커스텀 스타일시트
- **전역 컴포넌트 기본값**: Vuetify 컴포넌트의 공통 속성 설정

## 코딩 규칙

### TypeScript 설정
- **Strict 모드**: 엄격한 타입 체크 활성화
- **Type-only imports**: `import type` 사용 권장
- **Path mapping**: `@/`를 `src/` 디렉토리 별칭으로 사용

### ESLint 규칙
- **보안 규칙**: `eslint-plugin-security` 적용
- **Vue 3 규칙**: 컴포넌트명은 PascalCase 사용
- **Import 정렬**: 중복 import 방지
- **프로덕션 빌드**: console.log 제한, debugger 금지

## 환경 설정
- **Node.js**: 22.18.0 (Volta 관리)
- **패키지 매니저**: PNPM 권장
- **번들러**: Vite
- **타입스크립트**: ESNext 타겟