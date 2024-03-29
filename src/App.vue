<script setup lang="ts">
import { computed, ref, watch } from "vue";
import eventDialogsTable from "./data/CharacterDialogEventExcelTable.json";
import Player from "./modules/player/Player.vue";
import eventVoicePlayer from "./modules/player/eventVoicePlayer";
import { RawEventDialogItem, EventSettingItem } from "./modules/common/types";
import { VaModal } from "vuestic-ui";
import { useWindowSize, useLocalStorage } from "@vueuse/core";
import useStore from "./modules/common/useStore";
import Tabs from "./modules/tabs/index.vue";
import { getBgUrl, getBgmSound } from "./modules/common/resourceApi";
import { storeToRefs } from "pinia";
import { uniq } from "lodash-es";
import DetailConditionSelector from "./modules/conditionSelector/DetailConditionSelector.vue";
import CategorySelector from "./modules/conditionSelector/CategorySelector.vue";
import rawEventSettings from "./data/eventSetting.json";
import ResourceLoading from "./modules/resourceLoader/index.vue";
const eventDialogs = eventDialogsTable["DataList"];

const eventIDs = new Set<string>();
const {
  currentEventId,
  bgmState,
  bgmVolume,
  currentBgm,
  playerDone,
  categoryDone,
  eventIconsDone,
  currentTime,
  fontsize,
} = storeToRefs(useStore());
const eventSettings = rawEventSettings as Record<string, EventSettingItem>;

const currentCategory = ref("UIEventLobby");
const currentBg = ref("");
const bgDone = ref(false);
async function changeBg() {
  bgDone.value = false;
  let bgType = "Lobby";
  if (player.value) {
    const category: string = currentCategory.value;
    if (category.startsWith("UIEvent") && category !== "UIEventLobby") {
      bgType = category.replace("UIEvent", "");
      if (bgType === "BoxGachaShop") {
        bgType = bgType.replace("Shop", "");
      }
    }
  }

  console.log("bg load");
  currentBg.value = await getBgUrl(currentEventId.value, bgType);
  bgDone.value = true;
}
for (const dialog of eventDialogs) {
  eventIDs.add(dialog.EventID.toString());
}
let finalEventIDs = Array.from(eventIDs);
finalEventIDs = finalEventIDs.filter(
  (id) => id.startsWith("7") || id.startsWith("8")
);
Reflect.set(window, "player", eventVoicePlayer);

const currentEventDialogs = computed(() => {
  return eventDialogs.filter(
    (dialog) => dialog.EventID.toString() === currentEventId.value
  ) as RawEventDialogItem[];
});
watch(currentEventId, () => {
  console.log("eventId:", currentEventId.value);
  currentCategory.value = "UIEventLobby";
  if (currentEventId.value === "701") {
    currentCategory.value = "UISpecialOperationLobby";
  }
  headerExpand.value = false;
  changeBgm();
  currentTime.value = "None";
});
const dialogsFilteByCategory = computed(() => {
  return currentEventDialogs.value.filter(
    (dialog) => dialog.DialogCategory === currentCategory.value
  );
});
const dialogFilterByCategoryAndTime = computed(() => {
  const currentEventSetting = eventSettings[currentEventId.value];
  const eventReleaseDate = new Date(currentEventSetting.releaseDate);
  const endDate = new Date(eventReleaseDate);
  endDate.setDate(endDate.getDate() + currentEventSetting.days);
  if (endDate.getTime() < Date.now()) {
    return dialogsFilteByCategory.value;
  } else {
    return dialogsFilteByCategory.value.filter((dialog) => {
      if (dialog.DialogConditionDetail === "None") {
        return true;
      } else if (dialog.DialogConditionDetail === "Day") {
        const tempDate = new Date(eventReleaseDate);
        tempDate.setDate(
          tempDate.getDate() + dialog.DialogConditionDetailValue + 1
        );
        return tempDate.getTime() < Date.now();
      } else {
        return false;
      }
    });
  }
});
watch(dialogsFilteByCategory, changeBg);
const currentCategories = computed(() => {
  let result = uniq(
    currentEventDialogs.value.map((dialog) => dialog.DialogCategory)
  );
  if (currentEventId.value in eventSettings) {
    const currentRemoveCategories =
      eventSettings[currentEventId.value].removeCategories;
    if (currentRemoveCategories.length > 0) {
      result = result.filter(
        (category) => !currentRemoveCategories.includes(category)
      );
    }
  }
  return result;
});
const player = ref<null | typeof Player>();
function reEnter(time: string, characterId: number) {
  player.value?.playVoice("Enter", time, characterId);
}
function triggerCondition(condition: string) {
  player.value?.playVoice(condition);
}
async function changeBgm() {
  if (currentBgm.value) {
    currentBgm.value.pause();
  }
  if (!bgmState.value) {
    return;
  }
  const currentBgmSetting = eventSettings[currentEventId.value].bgm;
  currentBgm.value = await getBgmSound(currentBgmSetting.Path);
  currentBgm.value.volume = bgmVolume.value;
  currentBgm.value.play({
    end: currentBgmSetting.LoopEndTime,
    complete() {
      currentBgm.value?.play({
        start: currentBgmSetting.LoopStartTime,
        end: currentBgmSetting.LoopEndTime,
        loop: true,
      });
    },
  });
}
changeBgm();
changeBg();
watch(bgmState, changeBgm);
const showTips = useLocalStorage("tips", true);
const loaded = computed(() => {
  return (
    playerDone.value &&
    eventIconsDone.value &&
    categoryDone.value &&
    bgDone.value
  );
});

const { height: windowHeight, width: windowWidth } = useWindowSize();
const isportrait = computed(() => {
  return windowHeight.value > windowWidth.value;
});
const headerExpand = ref(false);
</script>

<template>
  <main class="mainPage" :style="{ backgroundImage: `url(${currentBg})` }">
    <div class="mainPage__left">
      <header v-if="isportrait" :class="{ headerExpand }">
        <DetailConditionSelector
          :dialogs="dialogsFilteByCategory"
          @re-enter="reEnter"
          @condition="triggerCondition"
          portrait
          v-if="!headerExpand"
        />
        <button
          class="menu"
          :class="{
            opened: headerExpand,
          }"
          @click="headerExpand = !headerExpand"
          aria-label="Main Menu"
        >
          <svg width="6vh" height="6vh" viewBox="0 0 100 100">
            <path
              class="line line1"
              d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
            />
            <path class="line line2" d="M 20,50 H 80" />
            <path
              class="line line3"
              d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
            />
          </svg>
        </button>
        <Tabs :event-ids="finalEventIDs" v-show="headerExpand" portrait></Tabs>
      </header>
      <Player
        ref="player"
        :dialogs="dialogFilterByCategoryAndTime"
        :portrait="isportrait"
        v-show="loaded"
        :class="{
          voicePlayer: true,
          playerAnimation: loaded,
        }"
      />
      <CategorySelector
        :categories="currentCategories"
        v-model="currentCategory"
      />
    </div>
    <va-modal v-model="showTips" blur close-button>
      <div class="tipTexts">
        <p>
          本项目属于碧蓝档案剧情站，目的是为了提供一个回顾活动语音的便利场所。
        </p>
        <p>
          本项目仅包含日服<span class="va-text-bold">公开的</span
          >活动语音内容，故当期活动的活动语音会晚于官方一天，复刻活动新增活动语音会在活动结束时添加。
        </p>
        <p>
          感谢<a href="https://ba.gamekee.com/" class="va-link" target="_blank"
            >碧蓝档案gamekee wiki</a
          >和b站up<a
            href="https://space.bilibili.com/16814870"
            class="va-link"
            target="_blank"
            >@黎焰Aurora</a
          >提供的翻译支持
        </p>
        <p>
          如果有任何问题或建议，请私信碧蓝档案剧情站<a
            href="https://space.bilibili.com/1413213021"
            class="va-link"
            target="_blank"
            >b站账号</a
          >或在<a
            href="https://github.com/ba-archive/ba-event-voice/issues"
            class="va-link"
            target="_blank"
            >项目issues</a
          >中提出
        </p>
      </div>
    </va-modal>
    <div
      v-if="!isportrait"
      :class="{
        mainPage__right: true,
        rightPageAnimation: loaded,
      }"
    >
      <Tabs :event-ids="finalEventIDs" :portrait="false"></Tabs>
      <DetailConditionSelector
        :dialogs="dialogFilterByCategoryAndTime"
        @re-enter="reEnter"
        @condition="triggerCondition"
        :portrait="false"
      />
    </div>
  </main>
  <ResourceLoading v-if="!loaded" :portrait="isportrait" />
</template>

<style lang="scss" scoped>
.mainPage {
  background-size: cover;
  display: flex;

  &__left {
    height: 100vh;
    position: relative;
    flex: 5;
    header {
      height: 8vh;
      position: absolute;
      top: 0;
      width: 100vw;
      padding: 1% 0;
      background: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(10px);
      z-index: 2;
      transition: height;
    }

    .headerExpand {
      height: 100vh;
    }

    .voicePlayer {
      position: absolute;
      bottom: 0;
    }
  }
  &__right {
    flex: 4;
    box-sizing: border-box;
    height: 100vh;
    padding: 3% 1%;
  }
}

.playerAnimation {
  animation: moveRight 1s;
  @keyframes moveRight {
    0% {
      transform: translateX(-100%);
    }
  }
}

.rightPageAnimation {
  animation: fadeIn 1s;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
  }
}

.tipTexts {
  p {
    line-height: 150%;
  }
}
</style>

<style>
.menu {
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  padding: 0;
  position: absolute;
  right: 1%;
  top: 1vh;
  z-index: 3;
}
.line {
  fill: none;
  stroke: black;
  stroke-width: 6;
  transition: stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1),
    stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1);
}
.line1 {
  stroke-dasharray: 60 207;
  stroke-width: 6;
}
.line2 {
  stroke-dasharray: 60 60;
  stroke-width: 6;
}
.line3 {
  stroke-dasharray: 60 207;
  stroke-width: 6;
}
.opened .line1 {
  stroke-dasharray: 90 207;
  stroke-dashoffset: -134;
  stroke-width: 6;
}
.opened .line2 {
  stroke-dasharray: 1 60;
  stroke-dashoffset: -30;
  stroke-width: 6;
}
.opened .line3 {
  stroke-dasharray: 90 207;
  stroke-dashoffset: -134;
  stroke-width: 6;
}
div {
  font-size: v-bind(fontsize);
}
</style>
