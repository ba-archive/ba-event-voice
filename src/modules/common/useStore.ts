import { Sound } from "@pixi/sound";
import { defineStore } from "pinia";

export default defineStore("main", {
  state: () => {
    return {
      currentEventId: "801",
      currentCategory: "Lobby",
      currentBgm: null as null | Sound,
      bgmVolume: 0.25,
    };
  },
  persist: true,
});
