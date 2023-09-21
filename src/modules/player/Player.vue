<script setup lang="ts">
import { RawEventDialogItem, DialogType } from "../common/types";
import eventVoicePlayer, { appHeight, appWidth } from "./eventVoicePlayer";
import {} from "../common/useStore";
import Dialog from "./Dialog.vue";
import { computed, onMounted, ref, watch, onUnmounted } from "vue";
import { useElementSize } from "@vueuse/core";
import iconMap from "./iconMap.json";
import eventDialogManager from "./eventDialogManager";
export type Props = {
  dialogs: RawEventDialogItem[];
  width: string;
  height: string;
  dataUrls: {
    characterExcelTable: string;
    characterSpineDirectory: string;
    voiceDirectory: string;
    iconDirectory: string;
  };
  eventIcon?: string;
};
const props = defineProps<Props>();

const eventVoicePlayerDiv = ref<HTMLDivElement | undefined>();
const { width: playerWidth, height: playerHeight } =
  useElementSize(eventVoicePlayerDiv);
const canvasScaleNumber = computed(() => (playerHeight.value + 1) / appHeight);
const canvasScale = computed(() => `scale(${canvasScaleNumber.value})`);
const canvasLeft = computed(
  () =>
    `calc(${playerWidth.value / 2}px - ${
      (appWidth * canvasScaleNumber.value) / 2
    }px)`
);

const voiceText = ref("");
const dialogType = ref<DialogType>("Talk");
async function playVoice(
  dialogCondition: string,
  inputConditionDetail?: string,
  characterId?: number
) {
  let conditionDetail = null;
  if (dialogCondition === "Enter") {
    if (inputConditionDetail) {
      conditionDetail = inputConditionDetail;
    } else {
      conditionDetail = "None";
    }
  }

  let finalDialogs = props.dialogs;
  if (characterId) {
    const dialogFilterByCharacter = props.dialogs.filter(
      (dialog) => dialog.CostumeUniqueId === characterId
    );
    finalDialogs = dialogFilterByCharacter;
  }
  const currentEventDialogs = eventDialogManager.getDialog(
    finalDialogs,
    dialogCondition,
    conditionDetail
  );

  if (currentEventDialogs.length !== 0) {
    console.log("playing: ", currentEventDialogs);
    await eventVoicePlayer.play(
      currentEventDialogs,
      voiceText,
      eventVoicePlayer.generateId(),
      dialogType
    );
  }
}

const initState = ref(false);
async function init() {
  await eventVoicePlayer.init("eventVoicePlayer", props.dataUrls);
  initState.value = true;
  playVoice("Enter");
  watch(
    () => props.dialogs,
    () => {
      console.log("dialog in player change!");
      playVoice("Enter");
    }
  );
}

onMounted(() => {
  init();
});
onUnmounted(() => {
  eventVoicePlayer.stopPlay();
});

defineExpose({ playVoice });
</script>

<template>
  <div id="eventVoicePlayer" ref="eventVoicePlayerDiv">
    <div @click="playVoice('Idle')" id="eventVoicePlayer__clickArea"></div>
    <Dialog
      :text="voiceText"
      v-if="voiceText"
      class="dialog"
      :mode="dialogType"
    />
  </div>
</template>

<style lang="scss">
#eventVoicePlayer {
  z-index: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;

  &__refresh {
    position: absolute;
    top: 5%;
    right: 5%;
    background-color: transparent;
    border: none;
    &:hover {
      cursor: pointer;
    }
    svg {
      width: 3em;
    }
    &:active {
      svg {
        path {
          fill: blueviolet;
        }
      }
    }
  }

  &__detail {
    position: absolute;
    top: 10%;
    right: 5%;
  }
  canvas {
    transform: v-bind(canvasScale);
    transform-origin: left top;
    position: absolute;
    top: 0;
    left: v-bind(canvasLeft);
    z-index: -2;
  }
  &__icons {
    width: 100%;
    height: 15%;
    position: absolute;
    display: flex;
    justify-content: space-around;
    bottom: 0;
    &__icon {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 1em;
      img {
        display: block;
        height: 30%;
      }
    }
    &__layer {
      width: 90%;
      height: 40%;
      position: absolute;
      top: 25%;
      z-index: -1;
      background-color: rgba(255, 255, 255, 0.8);

      box-shadow: 0 0 1px rgba(black, 0.7);
      overflow: hidden;
      transform: skewX(-10deg);
    }
  }

  &__clickArea {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  &__conditionSelecter {
    position: absolute;
    top: 5%;
    left: 5%;
    select {
      display: block;
      margin: 3% 0;
    }
    button {
      display: block;
    }
  }

  &__timeSelecter {
    position: absolute;
    right: 5%;
    top: 5%;
    select {
      display: block;
      margin: 5%;
    }
  }

  .dialog {
    position: absolute;
    right: 1%;
    bottom: 50%;
    width: 30%;
  }
}
</style>
