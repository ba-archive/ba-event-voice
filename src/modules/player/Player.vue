<script setup lang="ts">
import { RawEventDialogItem, DialogType } from "../common/types";
import eventVoicePlayer, { appHeight, appWidth } from "./eventVoicePlayer";
import Dialog from "./Dialog.vue";
import { computed, onMounted, ref, watch, onUnmounted } from "vue";
import { useElementSize } from "@vueuse/core";
import eventDialogManager from "./eventDialogManager";
import { initPlayer } from "../common/resourceApi";
import useStore from "../common/useStore";
import { storeToRefs } from "pinia";
export type Props = {
  dialogs: RawEventDialogItem[];
  mobile: boolean;
};
const props = defineProps<Props>();
const { playerDone, reEnterAnimation, characterSizeInMobile } = storeToRefs(
  useStore()
);

const eventVoicePlayerDiv = ref<HTMLDivElement | undefined>();
const { width: playerWidth, height: playerHeight } =
  useElementSize(eventVoicePlayerDiv);
const canvasScaleNumber = computed(() => {
  const showPlayerHeight = (playerHeight.value + 1) * 1.5;
  if (props.mobile) {
    return (showPlayerHeight * characterSizeInMobile.value) / appHeight;
  } else {
    return showPlayerHeight / appHeight;
  }
});
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
  if (dialogCondition === "Enter") {
    //触发再次进入动画
    if (playerDone.value && reEnterAnimation.value) {
      playerDone.value = false;
      setTimeout(() => (playerDone.value = true), 50);
    }
  }
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
  eventVoicePlayer.init("eventVoicePlayer");
  playerDone.value = false;
  await initPlayer(props.dialogs);
  playerDone.value = true;
  initState.value = true;
  playVoice("Enter");
}

onMounted(() => {
  init();
  watch(() => props.dialogs, init);
});
onUnmounted(() => {
  eventVoicePlayer.stopPlay();
});

defineExpose({ playVoice });
</script>

<template>
  <div id="eventVoicePlayer" ref="eventVoicePlayerDiv" :class="{ mobile }">
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
