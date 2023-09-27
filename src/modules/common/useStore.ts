import { Sound } from "@pixi/sound";
import { defineStore } from "pinia";
import { useWindowSize } from "@vueuse/core";

export default defineStore("main", {
  state: () => {
    return {
      currentEventId: "801",
      currentCategory: "Lobby",
      currentCharacterId: 0,
      currentTime: "None",
      language: "CN" as "CN" | "JP",
      currentBgm: null as null | Sound,
      bgmState: true,
      bgmVolume: 0.25,
      characterVolume: 1,
      characterSizeInPortrait: 0.8,
      characterPositionInPortrait: 50,
      characterSizeInLandscape: 1,
      characterPositionInLandscape: 50,
      reEnterAnimation: true,
      fontSizeNumber: 16,
      playerDone: false,
      categoryDone: false,
      eventIconsDone: false,
      categoryChange: false,
      eventChange: false,
    };
  },
  getters: {
    fontsize: (state) => {
      return `${state.fontSizeNumber}px`;
    },
  },
  persist: {
    paths: [
      "currentEventId",
      "language",
      "bgmState",
      "bgmVolume",
      "characterVolume",
      "characterSizeInPortrait",
      "characterPositionInPortrait",
      "characterSizeInLandscape",
      "characterPositionInLandscape",
      "fontSizeNumber",
    ],
    storage: localStorage,
  },
});
