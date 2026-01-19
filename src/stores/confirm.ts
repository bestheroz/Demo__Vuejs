import type { Confirm, ConfirmResolveResponse } from "@/definitions/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useConfirmStore = defineStore("confirm", () => {
  const items = ref<Confirm[]>([]);
  const formSaved = ref(true);

  async function confirmCreate(): Promise<boolean> {
    return pushConfirm("작성한 내용을 저장하시겠습니까?", "저장");
  }

  async function confirmUpdate(): Promise<boolean> {
    return pushConfirm("수정하시겠습니까?", "편집");
  }

  async function confirmDelete(): Promise<boolean> {
    return pushConfirm("삭제하시겠습니까?", "삭제");
  }

  async function pushConfirm(
    content: string,
    title = "Confirm",
    width = "400px",
    confirmButtonTitle = "확인",
    cancelButtonTitle = "취소",
  ): Promise<boolean> {
    return new Promise<ConfirmResolveResponse>((resolve) => {
      items.value = [
        ...items.value,
        {
          uuid: crypto.randomUUID(),
          title: title,
          content: content,
          width: width,
          cancelButtonTitle: cancelButtonTitle,
          confirmButtonTitle: confirmButtonTitle,
          resolver: resolve,
        },
      ];
    }).then((response) => {
      items.value = items.value.filter((item) => response.uuid !== item.uuid);
      return response.value;
    });
  }

  return {
    items,
    formSaved,
    confirmCreate,
    confirmUpdate,
    confirmDelete,
    pushConfirm,
  };
});
