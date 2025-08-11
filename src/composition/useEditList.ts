import { cloneDeep } from "lodash-es";
import type { UnwrapRef } from "vue";
import { ref } from "vue";

export default function useEditList<T>(initItemFunc: () => T) {
  const items = ref<T[]>([]);
  const editItem = ref<T>(initItemFunc());
  const selected = ref<T[]>([]);
  const dialog = ref(false);
  const loading = ref(false);

  const onClickAdd = (): void => {
    editItem.value = initItemFunc();
    dialog.value = true;
  };

  const onClickEdit = (val: T): void => {
    editItem.value = cloneDeep<T>(val) as UnwrapRef<T>;
    dialog.value = true;
  };

  return {
    items,
    editItem,
    selected,
    dialog,
    loading,
    onClickAdd,
    onClickEdit,
  } as const;
}
