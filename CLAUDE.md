# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Vue.js 3 + TypeScript + Vuetify를 사용한 관리자 대시보드 프로젝트입니다. 관리자, 사용자, 공지사항 관리 기능을 제공하며, 통합 테스트 페이지를 포함합니다.

## 주요 개발 명령어

### 개발 서버 실행
```bash
pnpm dev
# 또는
npm run dev
```
- 포트: 3000
- HMR 활성화
- 실시간 ESLint 검사 (개발 모드에서만)
- Vite checker 플러그인으로 TypeScript 실시간 검사

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
- **중요**: 작업 완료 후 항상 실행

## 환경 변수 설정

### 필수 환경 변수 (.env 파일)
```bash
VITE_BASE_API_URL=http://localhost:8000/
VITE_PRODUCT_TITLE="Demo Vue.js"
VITE_PRODUCT_VERSION=0.0.1
VITE_ENVIRONMENT=local
VITE_DATE_FORMAT_STRING=YYYY-MM-DD
VITE_DATETIME_SECONDS_FORMAT_STRING="YYYY-MM-DD HH:mm:ss"
VITE_TIME_SECONDS_FORMAT_STRING=HH:mm:ss
VITE_DATETIME_FORMAT_STRING="YYYY-MM-DD HH:mm"
VITE_TIME_FORMAT_STRING="HH:mm"
```
- 모든 환경 변수는 `src/constants/envs.ts`에서 `getRequiredEnv()`로 검증
- 누락된 환경 변수는 런타임 에러 발생

## 아키텍처 구조

### 인증 및 토큰 관리 시스템

**JWT 토큰 플로우**:
1. **토큰 저장**: localStorage에 `demo-accessToken`, `demo-refreshToken` 키로 저장
2. **자동 갱신**: `getValidatedAccessToken()`이 만료 확인 후 자동 갱신
3. **갱신 로직**: 
   - Access Token 만료 시 Refresh Token으로 재발급
   - Refresh Token 만료 시 로그인 페이지로 리다이렉트
4. **응답 헤더 감지**: `token: "must-renew"` 헤더 시 즉시 토큰 갱신

**인증 가드 (`src/router.ts:requireAuth`)**:
- 모든 보호된 라우트에 적용
- `useAdminStore().loggedIn` 체크
- 미인증 시 `/login`으로 리다이렉트

### 라우팅 시스템 (`src/router.ts`)

**레이아웃 시스템**:
- `DefaultLayout`: 관리자 대시보드 (사이드바, 헤더 포함)
- `AuthLayout`: 로그인 페이지 전용
- `ErrorLayout`: 에러 페이지 전용
- `SimpleLayout`: 최소 레이아웃

**자동 요청 취소 메커니즘**:
- `pendingRequests` Map으로 진행 중인 요청 추적
- 라우트 변경 시 `router.beforeEach`에서 모든 요청 취소
- AbortController 사용하여 깔끔한 취소 처리

### 상태 관리 (Pinia)

**Admin Store (`src/stores/admin.ts`)**:
```typescript
- state: tokens (JWT), info (사용자 정보, 권한)
- getters: loggedIn, authorities
- actions: clearAdmin(), reIssueAccessToken(), saveTokens()
```

**Confirm Store (`src/stores/confirm.ts`)**:
- Promise 기반 확인 다이얼로그 시스템
- UUID로 각 다이얼로그 인스턴스 추적
- 사전 정의된 메서드: `confirmCreate()`, `confirmUpdate()`, `confirmDelete()`

### API 통신 계층 (`src/utils/apis.ts`)

**요청 인터셉터 체인**:
1. JWT Bearer 토큰 자동 첨부
2. 요청별 UUID 생성 (`requestId`)
3. AbortController 연결
4. `pendingRequests` Map에 등록

**응답 인터셉터 체인**:
1. 요청 완료 시 `pendingRequests`에서 제거
2. HTTP 상태 기반 `success` 플래그 추가
3. 토큰 갱신 필요 시 자동 재시도
4. 401 에러 시 로그인 페이지로
5. 네트워크 에러 시 토스트 알림

**API 헬퍼 함수 특징**:
- Toast 통합: 성공/실패 자동 알림
- 로딩 상태: `refLoading` Ref 지원
- 기본 메시지: CRUD 작업별 한국어 메시지
- 에러 처리: `catchError()` 함수로 표준화

### 유틸리티 시스템

**Validation Rules (`src/utils/rules.ts`)**:
- `required`: 필수 입력 검증
- `minLength/maxLength`: 길이 제한
- `isEmail`: 이메일 형식
- `isAlphanumeric`: 영문+숫자
- `isDigits`: 숫자만
- `isNumeric`: 숫자+음수+소수점
- `minDateValue`: 날짜 최소값
- 모든 규칙은 Vuetify 컴포넌트와 호환

**Formatter (`src/utils/formatter.ts`)**:
- 날짜 포맷: `formatDate()`, `formatDatetime()`, `formatDatetimeSeconds()`
- 숫자 포맷: `formatNumber()` - 천 단위 구분, 소수점 제어
- SelectItem 변환: `formatTextOfSelectItem()`, `getValueOfSelectItem()`
- 파일 크기: `formatFileSizeToKb()`
- 케이스 변환: `snakeToCamel()`

**Commands (`src/utils/commands.ts`)**:
- 라우터 래퍼: `routerPush()`, `routerReplace()` - 중복 네비게이션 방지
- 토큰 검증: `isExpiredToken()`, `getValidatedAccessToken()`, `getValidatedRefreshToken()`
- 인증 플로우: `signOut()`, `goLoginPage()`, `getNewToken()`

**Logger (`src/utils/logger.ts`)**:
- 환경별 로그 레벨 자동 설정 (개발: 5, 프로덕션: 2)
- consola 기반 통합 로깅 시스템

### Composables

**`useEditList` (`src/composition/useEditList.ts`)**:
- 목록 관리 패턴을 위한 재사용 가능한 컴포지션
- 제공 상태: `items`, `editItem`, `selected`, `dialog`, `loading`
- 제공 메서드: `onClickAdd()`, `onClickEdit()`
- lodash `cloneDeep`으로 깊은 복사 처리

### 타입 시스템 (`src/definitions/types.ts`)

**핵심 타입**:
- `DateTime`: 날짜/시간 유연 타입 (`string | number | Date | null | undefined`)
- `SelectItem<T>`: 드롭다운/선택 컴포넌트용 (`{ value: T, title: string }`)
- `JwtTokens`: 토큰 쌍 (`{ accessToken, refreshToken }`)
- `TokenClaims`: JWT 페이로드 (id, loginId, name, type, authorities 등)
- `ListApiResult<T>`: 페이지네이션 응답 (`{ page, pageSize, total, items }`)
- `DataTableHeader`: 데이터 테이블 컬럼 정의
- `IdCreatedUpdated`: 생성/수정 추적 엔티티

### Vuetify 설정 (`src/plugins/vuetify.ts`)

**전역 기본값**:
- 모든 입력: `clearable: true`, `density: "comfortable"`
- 색상: 모든 폼 컴포넌트 `color: "primary"`
- VTextarea: `autoGrow: true`, 기본 2줄, 최대 10줄
- VSwitch/VCheckbox: `hideDetails: "auto"`로 공간 절약
- VBottomSheet: `inset: true`, `scrollable: true`
- VBtn: `textTransform: "none"`으로 대문자 변환 비활성화

## 코딩 규칙

### TypeScript 설정 (`tsconfig.json`)
- **Strict 모드**: 활성화 (단, `noImplicitAny: false`)
- **Module Resolution**: bundler 모드
- **Path Alias**: `@/*` → `src/*`
- **Vue 3**: `useDefineForClassFields: true`
- **Type-only imports**: `verbatimModuleSyntax: true`로 강제

### ESLint 규칙 (`eslint.config.js`)
- **보안**: `eslint-plugin-security` (object-injection 제외)
- **Vue 3**:
  - 컴포넌트명: PascalCase 강제
  - multi-word-component-names 비활성화
- **TypeScript**:
  - consistent-type-imports 강제
  - 미사용 변수: `_` 프리픽스 허용
- **환경별**:
  - 개발: console/debugger 허용
  - 프로덕션: console 제한 (info, warn, error만), debugger 금지

## 프로젝트 구조 패턴

### 페이지별 모듈 구조
```
src/views/[domain]/management/
├── [Domain]ManagementPage.vue  # 메인 페이지 컴포넌트
├── types.ts                     # 도메인별 타입 정의
└── components/                  # 도메인 전용 컴포넌트
```

### API 호출 패턴
```typescript
// 로딩 상태 관리 포함
const loading = ref(false);
const response = await getApi<ResponseType>('/api/endpoint', {
  refLoading: loading,
  successAlert: false,  // GET은 기본적으로 알림 없음
});

// CRUD 작업은 자동 알림
await postApi('/api/endpoint', data);  // "등록되었습니다" 자동 표시
```

### 확인 다이얼로그 패턴
```typescript
const { confirmDelete } = useConfirmStore();
if (await confirmDelete()) {
  // 사용자가 확인한 경우만 실행
}
```

## 환경 설정
- **Node.js**: 22.19.0 (Volta로 버전 고정)
- **패키지 매니저**: PNPM 권장
- **번들러**: Vite 7.1.9
- **TypeScript**: ESNext 타겟
- **API 서버**: 기본 `http://localhost:8000/`

## 작업 완료 체크리스트
- 코드 변경 후 항상 `pnpm lint` 실행하여 코드 품질 검증
- TypeScript 타입 에러 확인 (vue-tsc 포함)
- ESLint 규칙 준수 확인