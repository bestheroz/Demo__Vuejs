---
paths:
  - "src/views/**"
  - "src/utils/apis.ts"
  - "src/composition/**"
---

# API 호출 · 다이얼로그 · 목록 화면 규약

## API 호출

- HTTP 호출은 `src/utils/apis.ts` 의 `getApi` / `postApi` / `putApi` / `patchApi` / `deleteApi` 만 쓴다. `axiosInstance` 를 직접 호출하면 토큰 첨부·요청 취소·토스트가 모두 빠진다
  - 예외: `axios.isAxiosError()` 같은 타입 가드 용도로 `axios` 를 import 하는 것은 허용한다
- 로딩 스피너가 필요하면 `refLoading` 에 `Ref<boolean>` 을 넘긴다. 성공·실패·예외 모두 `finally` 에서 false 로 되돌려 주므로 직접 토글하지 않는다
- 성공 토스트는 GET 만 기본 off, 나머지 메서드는 기본 on 이다. GET 에 `successAlert: false` 를 다시 적지 않는다
- 기본 메시지("등록되었습니다." 등)로 충분하면 `successMessage` 를 넘기지 않는다
- `alert` 는 `successAlert` 와 `failureAlert` 를 한 번에 덮어쓰는 옵션이다. 둘 중 하나만 끄려면 개별 옵션을 쓴다
- 쿼리스트링은 `stringifyParams()` 로 만든다. 빈 문자열·null·NaN 을 걸러 주므로 직접 조립하면 빈 필터가 서버로 넘어간다

## 확인 다이얼로그

- 생성·수정·삭제 실행 전 `useConfirmStore()` 의 `confirmCreate()` / `confirmUpdate()` / `confirmDelete()` 를 await 하고, `true` 일 때만 진행한다
- 문구가 다른 확인이 필요하면 `pushConfirm()` 을 쓴다. `window.confirm` 은 쓰지 않는다

## 목록 화면

- 목록 + 편집 다이얼로그 화면은 `useEditList(initItemFunc)` 로 상태를 만든다. `items` / `editItem` / `selected` / `dialog` / `loading` 과 `onClickAdd` / `onClickEdit` 를 그대로 쓰고 같은 ref 를 다시 선언하지 않는다
- `onClickEdit` 는 `structuredClone` 으로 복사본을 넘긴다. 원본을 직접 바인딩하면 취소해도 목록이 바뀐다
- `initItemFunc` 는 매 호출마다 새 객체를 반환해야 한다. 상수 객체를 반환하면 행끼리 상태를 공유한다

## 도메인 타입

- 도메인 타입은 각 도메인 폴더의 `types.ts` 에 둔다. 여러 도메인이 함께 쓰는 타입만 `src/definitions/types.ts` 로 올린다
