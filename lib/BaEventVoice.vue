<script setup lang="ts">
import { RawEventDialogItem } from "./types";
import eventVoicePlayer, { appHeight, appWidth } from "./eventVoicePlayer";
import Dialog from "./Dialog.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useElementSize } from "@vueuse/core";
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
const eventVoicePlayerStyle = computed(() => {
  return { height: props.height, width: props.width };
});

const eventVoicePlayerDiv = ref<HTMLDivElement | null>(null);
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
const currentDialogCategory = ref("UIEventLobby");
const currentDialogCategorieSet = computed(() => {
  const categorySet = new Set<string>();
  props.dialogs.forEach((value) => {
    categorySet.add(value.DialogCategory);
  });
  return categorySet;
});
const currentDialogCondition = ref("Enter");
const currentDialogConditionArray = computed(() => {
  const conditionSet = new Set<string>();
  props.dialogs
    .filter((value) => value.DialogCategory === currentDialogCategory.value)
    .forEach((value) => {
      conditionSet.add(value.DialogCondition);
    });
  return conditionSet;
});
function getCategoryIcon(category: string) {
  if (category === "UIEventLobby") {
    //默认category使用默认icon
    return `${props.dataUrls.iconDirectory}/Event_Icon_Story.png`;
  }
  return `${props.dataUrls.iconDirectory}/${category.replace(
    "UIEvent",
    "Event_Icon_"
  )}.png`;
}
const currentDialogConditionDetail = ref("None");
const dialogConditionDetails = [
  { word: "正常", value: "None" },
  { word: "关闭", value: "Close" },
  { word: "中期", value: "Day" },
];

let voicePlaying = false;
function sample(arr: Array<any>) {
  return arr[Math.floor(Math.random() * arr.length)];
}
async function playVoice(dialogCondition: string) {
  if (voicePlaying) {
    return;
  }
  voicePlaying = true;
  let currentEventDialogs = props.dialogs.filter(
    (value) =>
      value.DialogCategory === currentDialogCategory.value &&
      value.DialogCondition === dialogCondition
  );
  if (dialogCondition === "Enter") {
    currentEventDialogs = currentEventDialogs.filter(
      (value) =>
        value.DialogConditionDetail === currentDialogConditionDetail.value
    );
  }
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
    await eventVoicePlayer.play(currentEventDialogs, voiceText);
  }

  voicePlaying = false;
}
function enterNewCategory(category: string) {
  currentDialogCategory.value = category;
  playVoice("Enter");
}

const initState = ref(false);
async function init() {
  await eventVoicePlayer.init("eventVoicePlayer", props.dataUrls);
  initState.value = true;
  playVoice("Enter");
}
onMounted(() => {
  init();
});
</script>

<template>
  <div
    id="eventVoicePlayer"
    :style="eventVoicePlayerStyle"
    ref="eventVoicePlayerDiv"
    @click="() => playVoice('Idle')"
  >
    <Dialog :text="voiceText" v-if="voiceText" class="dialog" />
    <button id="eventVoicePlayer__refresh" @click="playVoice('Enter')">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 20q-3.35 0-5.675-2.325Q4 15.35 4 12q0-3.35 2.325-5.675Q8.65 4 12 4q1.725 0 3.3.713q1.575.712 2.7 2.037V4h2v7h-7V9h4.2q-.8-1.4-2.187-2.2Q13.625 6 12 6Q9.5 6 7.75 7.75T6 12q0 2.5 1.75 4.25T12 18q1.925 0 3.475-1.1T17.65 14h2.1q-.7 2.65-2.85 4.325Q14.75 20 12 20Z"
        />
      </svg>
    </button>
    <select
      v-model="currentDialogConditionDetail"
      id="eventVoicePlayer__detail"
    >
      <option v-for="detail in dialogConditionDetails" :value="detail.value">
        {{ detail.word }}
      </option>
    </select>
    <div id="eventVoicePlayer__icons">
      <div
        v-for="category in currentDialogCategorieSet"
        id="eventVoicePlayer__icons__icon"
        @click="enterNewCategory(category)"
      >
        <img :src="getCategoryIcon(category)" />
        {{ category }}
      </div>
      <div id="eventVoicePlayer__icons__layer"></div>
    </div>
  </div>
</template>

<style lang="scss">
#eventVoicePlayer {
  position: relative;
  border: 1px solid black;

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

  .dialog {
    position: absolute;
    left: 65%;
    bottom: 50%;
    width: 40%;
  }
}
</style>
