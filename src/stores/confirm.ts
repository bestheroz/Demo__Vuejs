import { defineStore } from "pinia";
import { v4 as uuidV4 } from "uuid";
import type { Confirm, ConfirmResolveResponse } from "@/definitions/types";

export const useConfirmStore = defineStore("confirm", {
  state: () => {
    return {
      items: [] as Confirm[],
      formSaved: true,
    };
  },
  actions: {
    async confirmCreate(): Promise<boolean> {
      return this.pushConfirm("작성한 내용을 저장하시겠습니까?", "저장");
    },
    async confirmUpdate(): Promise<boolean> {
      return this.pushConfirm("수정하시겠습니까?", "편집");
    },
    async confirmDelete(): Promise<boolean> {
      return this.pushConfirm("삭제하시겠습니까?", "삭제");
    },
    async pushConfirm(
      content: string,
      title = "Confirm",
      width = "400px",
      confirmButtonTitle = "확인",
      cancelButtonTitle = "취소",
    ): Promise<boolean> {
      return new Promise<ConfirmResolveResponse>((resolve) => {
        this.$state.items = [
          ...this.$state.items,
          {
            uuid: uuidV4(),
            title: title,
            content: content,
            width: width,
            cancelButtonTitle: cancelButtonTitle,
            confirmButtonTitle: confirmButtonTitle,
            resolver: resolve,
          },
        ];
      }).then((response) => {
        this.$state.items = this.$state.items.filter(
          (item) => response.uuid !== item.uuid,
        );
        return response.value;
      });
    },
  },
});
