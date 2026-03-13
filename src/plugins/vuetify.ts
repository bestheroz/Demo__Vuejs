import { createVuetify } from "vuetify";
import { ko } from "vuetify/locale";
import "vuetify/styles";

export default createVuetify({
  locale: {
    locale: "ko",
    messages: { ko },
  },
  theme: {
    defaultTheme: "dark",
  },
  defaults: {
    global: {
      persistentPlaceholder: true,
      persistentHint: true,
      clearable: true,
      density: "comfortable",
    },
    VInput: {
      color: "primary",
    },
    VTextarea: {
      rows: 2,
      maxRows: 10,
      autoGrow: true,
    },
    VSwitch: {
      hideDetails: "auto",
    },
    VCheckbox: {
      baseColor: "primary",
      hideDetails: "auto",
    },
    VRadioGroup: {
      inline: true,
      baseColor: "primary",
      hideDetails: "auto",
    },
    VBottomSheet: {
      inset: true,
      persistent: true,
      modelValue: true,
      noClickAnimation: true,
    },
  },
});
