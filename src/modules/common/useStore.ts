import { defineStore } from "pinia";

export default defineStore("main", {
  state: () => {
    return {
      currentEventId: "801",
      currentCategory: "Lobby",
    };
  },
});
