<script setup lang="ts">
import { computed, ref } from "vue";
import eventDialogsTable from "./CharacterDialogEventExcelTable.json";
import BaEventVoice from "../lib/BaEventVoice.vue";
import eventVoicePlayer from "../lib/eventVoicePlayer";
import { RawEventDialogItem } from "../lib/types";
const eventDialogs = eventDialogsTable["DataList"];

const eventIDs = new Set<number>();
const currentEventID = ref(801);
const currentBg = computed(
  () =>
    `https://yuuka.cdn.diyigemt.com/image/ba-all-data/UIs/01_Common/27_EventContent/Main_BgImage/Event_Main_Stage_Bg_${currentEventID.value}.png`
);
for (const dialog of eventDialogs) {
  eventIDs.add(dialog.EventID);
}
Reflect.set(window, "player", eventVoicePlayer);

const currentEventDialog = computed(() => {
  return eventDialogs.filter(
    (dialog) => dialog.EventID === currentEventID.value
  ) as RawEventDialogItem[];
});
</script>

<template>
  <div :style="{ backgroundImage: `url(${currentBg})` }" class="mainPage">
    <form class="eventSelector">
      <label for="eventIDSelecter">选择event</label>
      <select v-model="currentEventID" id="eventIDSelecter">
        <option v-for="eventID in eventIDs" :value="eventID">
          {{ eventID }}
        </option>
      </select>
    </form>
    <div>
      <BaEventVoice
        :dialogs="currentEventDialog"
        height="99vh"
        width="45vw"
        class="voicePlayer"
        :data-urls="{
          characterExcelTable:
            'https://yuuka.cdn.diyigemt.com/image/ba-all-data/data/CharacterExcelTable.json',
          characterSpineDirectory:
            'https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine',
          voiceDirectory:
            'https://yuuka.cdn.diyigemt.com/image/ba-all-data/Audio/VoiceJp/Character_voice',
          iconDirectory:
            'https://yuuka.cdn.diyigemt.com/image/ba-all-data/eventIcon',
        }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mainPage {
  background-size: cover;
  display: flex;
  height: 100vh;
  .eventSelector {
    position: absolute;
    right: 5vw;
    top: 1vh;
  }
  .voicePlayer {
    position: absolute;
    bottom: 0;
  }
}
</style>
