<template>
  <div
    v-if="text"
    :style="{
      'text-overflow': 'ellipsis',
      overflow: 'hidden',
      'white-space': 'nowrap',
      'word-break': 'break-all',
      cursor: 'help',
    }"
  >
    <v-tooltip
      location="bottom"
      color="secondary"
      :max-width="maxTooltipWidth"
      open-on-click
      close-on-content-click
      :open-on-hover="false"
    >
      <template #activator="{ props: activatorProps }">
        <div
          v-bind="activatorProps"
          :style="{
            'max-width': maxWidth + '!important',
            'text-overflow': 'ellipsis',
            overflow: 'hidden',
          }"
        >
          {{ text }}
        </div>
      </template>
      <span v-html="newLineHtml" />
    </v-tooltip>
  </div>
  <span v-else v-html="newLineHtml" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { logger } from "@/utils/logger";

const props = withDefaults(
  defineProps<{
    text?: string | null;
    width?: string | number;
    tooltipWidth?: string | number;
  }>(),
  { text: "", width: "25rem", tooltipWidth: "40rem" },
);

const newLineHtml = computed(() =>
  (props.text ?? "").replaceAll("\n", "<br />"),
);

const maxWidth = computed((): string =>
  typeof props.width === "string" ? props.width : `${props.width}px`,
);

const maxTooltipWidth = computed((): number => {
  if (typeof props.tooltipWidth === "string") {
    const match = props.tooltipWidth.match(/^(\d*\.?\d+)(px|rem)?$/);

    if (!match) {
      logger.warn(`Invalid tooltipWidth format: ${props.tooltipWidth}`);
      return 0;
    }

    const value = parseFloat(match[1] ?? "0");
    const unit = match[2];

    switch (unit) {
      case "rem":
        return value * 16;
      case "px":
      default:
        return value;
    }
  }
  return props.tooltipWidth;
});
</script>
