import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default createVuetify({
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
    },
    VTextField: {
      color: "primary",
      persistentPlaceholder: true,
    },
    VSelect: {
      color: "primary",
      persistentPlaceholder: true,
    },
    VTextarea: {
      color: "primary",
      persistentPlaceholder: true,
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
      persistentPlaceholder: true,
    },
    VCombobox: {
      color: "primary",
      persistentPlaceholder: true,
    },
    VCheckbox: {
      falseValue: "N",
      trueValue: "Y",
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
