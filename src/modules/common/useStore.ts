import { Sound } from "@pixi/sound";
import { defineStore } from "pinia";

export default defineStore("main", {
  state: () => {
    return {
      currentEventId: "801",
      currentCategory: "Lobby",
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
