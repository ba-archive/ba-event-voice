<script setup lang="ts">
import { RawEventDialogItem } from "./types";
import eventVoicePlayer from "./eventVoicePlayer";
import { ref, watch } from "vue";
export type Props = {
  dialogs: RawEventDialogItem[];
  dataUrls: {
    characterExcelTable: string;
    characterSpineDirectory: string;
    voiceDirectory: string;
  };
  eventIcon?: string;
};
const props = defineProps<Props>();

const voiceText = ref("");

async function init() {
  await eventVoicePlayer.init("spinePosition", props.dataUrls);
  let currentEventDialogs = props.dialogs.filter(
    (value) =>
      value.GroupId === 1 &&
      value.DialogCategory === "UIEventLobby" &&
      value.DialogCondition === "Enter"
  );
  if (currentEventDialogs.length !== 0) {
    const currentCharacterId = currentEventDialogs[0].CharacterId;
    currentEventDialogs = currentEventDialogs.filter(
      (value) => value.CharacterId === currentCharacterId
    );
    console.log(currentEventDialogs);
    eventVoicePlayer.play(currentEventDialogs, voiceText);
  }
}
init();
watch(() => props.dialogs, init);
</script>

<template>
  <div id="eventVoicePlayer">
    <div id="spinePosition"></div>
  </div>
</template>

<style>
#eventVoicePlayer {
  position: relative;
  width: 30px;
  height: 30px;
}

#spinePosition {
  position: relative;
}

#spinePosition canvas {
  transform: scale(0.5);
  transform-origin: left top;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
