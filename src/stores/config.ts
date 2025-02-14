import { defineStore } from "pinia";

interface ConfigInfo {
  apiHeader: {
    appVersion: string;
    carrierName: string;
    crypto: string;
    deviceId: string;
    loginType: string;
    networkType: string;
    platformName: string;
    platformVersion: string;
    screenId: string;
    loginChannel: "DIRECT" | "HLAPP";
  };
}

export const useConfigStore = defineStore("config", {
  state: (): ConfigInfo => {
    return {
      apiHeader: {
        appVersion: "2.39",
        carrierName: "SKT",
        crypto: "cipher=S,name=registrationNumber,type=I",
        deviceId:
          "f9b128aa5e1139f139d2b2a3351101------------1234bfd0bcc739bec1",
        loginType: "4",
        networkType: "Wifi",
        platformName: "iOS",
        platformVersion: "15.4.1",
        screenId: "MCLON03030007",
        loginChannel: "HLAPP",
      },
    };
  },
  persist: true,
});
