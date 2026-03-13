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
    VTextField: {
      color: "primary",
    },
    VSelect: {
      color: "primary",
    },
    VTextarea: {
      color: "primary",
      rows: 2,
      maxRows: 10,
      autoGrow: true,
    },
    VSwitch: {
      color: "primary",
      hideDetails: "auto",
    },
    VAutocomplete: {
      color: "primary",
    },
    VCombobox: {
      color: "primary",
    },
    VCheckbox: {
      color: "primary",
      baseColor: "primary",
      hideDetails: "auto",
    },
    VRadioGroup: {
      inline: true,
      color: "primary",
      baseColor: "primary",
      hideDetails: "auto",
    },
    VFileInput: {
      color: "primary",
    },
    VBottomSheet: {
      inset: true,
      persistent: true,
      modelValue: true,
      noClickAnimation: true,
    },
  },
});
