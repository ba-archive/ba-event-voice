<script setup lang="ts">
import { RawEventDialogItem } from "./types";
import eventVoicePlayer from "./eventVoicePlayer";
import Dialog from "./Dialog.vue";
import { computed, ref, watch } from "vue";
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
const currentDialogCategory = ref("");
const currentDialogCategorieArray = computed(() => {
  const categorySet = new Set<string>();
  props.dialogs.forEach((value) => {
    categorySet.add(value.DialogCategory);
  });
  return categorySet;
});
const currentDialogCondition = ref("");
const currentDialogConditionArray = computed(() => {
  const conditionSet = new Set<string>();
  props.dialogs
    .filter((value) => value.DialogCategory === currentDialogCategory.value)
    .forEach((value) => {
      conditionSet.add(value.DialogCondition);
    });
  return conditionSet;
});

async function init() {
  await eventVoicePlayer.init("spinePosition", props.dataUrls);
  function sample(arr: Array<any>) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  let currentEventDialogs = props.dialogs.filter(
    (value) =>
      value.DialogCategory === currentDialogCategory.value &&
      value.DialogCondition === currentDialogCondition.value
  );
  const groupIds = new Set<number>();
  currentEventDialogs.forEach((value) => groupIds.add(value.GroupId));
  const groupID = sample(Array.from(groupIds));
  currentEventDialogs = currentEventDialogs.filter(
    (value) => value.GroupId === groupID
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
</script>

<template>
  <div id="eventVoicePlayer">
    <select v-model="currentDialogCategory">
      <option v-for="category in currentDialogCategorieArray">
        {{ category }}
      </option>
    </select>
    <select v-model="currentDialogCondition">
      <option v-for="condition in currentDialogConditionArray">
        {{ condition }}
      </option>
    </select>
    <button @click="init">播放</button>
    <div id="spinePosition"></div>
    <Dialog :text="voiceText" v-if="voiceText" class="dialog" />
  </div>
</template>

<style>
#eventVoicePlayer {
  position: relative;
  width: 300px;
  height: 300px;
}

#spinePosition {
  position: relative;
}

#spinePosition canvas {
  transform: scale(0.5);
  transform-origin: left top;
  position: absolute;
  top: -10vw;
  left: 10vw;
  z-index: -1;
}

.dialog {
  position: absolute;
  right: -25vw;
  top: 20vh;
}
</style>
