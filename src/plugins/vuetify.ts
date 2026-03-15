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
    VAutocomplete: {
      color: "primary",
    },
    VCombobox: {
      color: "primary",
    },
    VFileInput: {
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
    VCheckbox: {
      color: "primary",
      hideDetails: "auto",
    },
    VRadioGroup: {
      color: "primary",
      inline: true,
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
