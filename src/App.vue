<script setup lang="ts">
import { computed, ref } from "vue";
import eventDialogsTable from "./data/CharacterDialogEventExcelTable.json";
import BaEventVoice from "./modules/player/BaEventVoice.vue";
import eventVoicePlayer from "./modules/player/eventVoicePlayer";
import { RawEventDialogItem } from "./modules/player/types";
import { VaModal } from "vuestic-ui";
const eventDialogs = eventDialogsTable["DataList"];

const eventIDs = new Set<number>();
const currentEventID = ref(801);
const currentBg = computed(() => {
  let bgType = "Stage";
  if (baEventVoiceRef.value) {
    const directory: string = baEventVoiceRef.value.currentDialogCategory;
    if (directory.startsWith("UIEvent") && directory !== "UIEventLobby") {
      bgType = directory.replace("UIEvent", "");
    }
  }

  return `https://yuuka.cdn.diyigemt.com/image/ba-all-data/UIs/01_Common/27_EventContent/Main_BgImage/Event_Main_${bgType}_Bg_${currentEventID.value}.png`;
});
for (const dialog of eventDialogs) {
  eventIDs.add(dialog.EventID);
}
Reflect.set(window, "player", eventVoicePlayer);

const currentEventDialog = computed(() => {
  return eventDialogs.filter(
    (dialog) => dialog.EventID === currentEventID.value
  ) as RawEventDialogItem[];
});
const baEventVoiceRef = ref<null | typeof BaEventVoice>();
const showTips = ref(true);
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
        ref="baEventVoiceRef"
        :dialogs="currentEventDialog"
        height="99vh"
        width="45vw"
        class="voicePlayer"
        :data-urls="{
          characterExcelTable:
            'https://yuuka.cdn.diyigemt.com/image/ba-all-data/data/CostumeExcelTable.json',
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
  <va-modal v-model="showTips" ok-text="Apply">
    <h3 class="va-h3">Title</h3>
    <p>
      Classic modal overlay which represents a dialog box or other interactive
      component, such as a dismissible alert, sub-window, etc.
    </p>
  </va-modal>
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
