import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { ko } from "vuetify/locale";

export default createVuetify({
  locale: {
    locale: "ko",
    messages: { ko },
  },
  components,
  directives,
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
    VBtn: {
      style: {
        textTransform: "none",
      },
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
      scrollable: true,
      persistent: true,
      modelValue: true,
      noClickAnimation: true,
    },
  },
});
