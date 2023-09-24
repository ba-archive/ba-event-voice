import { Sound } from "@pixi/sound";
import { defineStore } from "pinia";

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
      characterVolume: 0.25,
      characterSizeInMobile: 0.8,
      reEnterAnimation: true,
      playerDone: false,
      categoryDone: false,
      eventIconsDone: false,
    };
  },
});
