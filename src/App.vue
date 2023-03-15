<script setup lang="ts">
import { computed, ref } from "vue";
import eventDialogsTable from "./CharacterDialogEventExcelTable.json";
import BaEventVoice from "../lib/BaEventVoice.vue";
import { RawEventDialogItem } from "../lib/types";
const eventDialogs = eventDialogsTable["DataList"];

const eventIDs = new Set<number>();
const currentEventID = ref(0);
for (const dialog of eventDialogs) {
  eventIDs.add(dialog.EventID);
}

const currentEventDialog = computed(() => {
  return eventDialogs.filter(
    (dialog) => dialog.EventID === currentEventID.value
  ) as RawEventDialogItem[];
});
</script>

<template>
  <form>
    <label for="eventIDSelecter">选择event</label>
    <select v-model="currentEventID" id="eventIDSelecter">
      <option v-for="eventID in eventIDs" :value="eventID">
        {{ eventID }}
      </option>
    </select>
  </form>
  <BaEventVoice
    :dialogs="currentEventDialog"
    :data-urls="{
      characterExcelTable:
        'https://yuuka.cdn.diyigemt.com/image/ba-all-data/data/CharacterExcelTable.json',
      characterSpineDirectory:
        'https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine',
      voiceDirectory:
        'https://yuuka.cdn.diyigemt.com/image/ba-all-data/Audio/VoiceJp/Character_voice',
    }"
  />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
