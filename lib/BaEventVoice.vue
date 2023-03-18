<script setup lang="ts">
import { RawEventDialogItem } from "./types";
import eventVoicePlayer, { appHeight, appWidth } from "./eventVoicePlayer";
import Dialog from "./Dialog.vue";
import { computed, ref, watch } from "vue";
import { useElementSize } from "@vueuse/core";
export type Props = {
  dialogs: RawEventDialogItem[];
  width: string;
  height: string;
  dataUrls: {
    characterExcelTable: string;
    characterSpineDirectory: string;
    voiceDirectory: string;
  };
  eventIcon?: string;
};
const props = defineProps<Props>();
const eventVoicePlayerStyle = computed(() => {
  return { height: props.height, width: props.width };
});

const eventVoicePlayerDiv = ref<HTMLDivElement | null>(null);
const { width: playerWidth, height: playerHeight } =
  useElementSize(eventVoicePlayerDiv);
const canvasScaleNumber = computed(() => (playerHeight.value + 1) / appHeight);
const canvasScale = computed(() => `scale(${canvasScaleNumber.value})`);
const canvasLeft = computed(
  () => `calc(${playerWidth.value/2}px - ${appWidth * canvasScaleNumber.value/2}px)`
);

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
  await eventVoicePlayer.init("eventVoicePlayer", props.dataUrls);
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
  <div
    id="eventVoicePlayer"
    :style="eventVoicePlayerStyle"
    ref="eventVoicePlayerDiv"
  >
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
    <Dialog :text="voiceText" v-if="voiceText" class="dialog" />
  </div>
</template>

<style lang="scss">
#eventVoicePlayer {
  position: relative;
  border: 1px solid black;

  canvas {
    transform: v-bind(canvasScale);
    transform-origin: left top;
    position: absolute;
    top: 0;
    left: v-bind(canvasLeft);
    z-index: -1;
  }

  .dialog {
    position: absolute;
    left: 65%;
    top: 25%;
    width: 40%;
  }
}
</style>
