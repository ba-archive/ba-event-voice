<script setup lang="ts">
import { computed, ref, watch } from "vue";
import eventDialogsTable from "./data/CharacterDialogEventExcelTable.json";
import Player from "./modules/player/Player.vue";
import eventVoicePlayer from "./modules/player/eventVoicePlayer";
import { RawEventDialogItem, EventSettingItem } from "./modules/common/types";
import { VaModal } from "vuestic-ui";
import useStore from "./modules/common/useStore";
import Tabs from "./modules/tabs/index.vue";
import { getBgUrl, getBgmUrl } from "./modules/common/resourceApi";
import { storeToRefs } from "pinia";
import { uniq } from "lodash-es";
import DetailConditionSelector from "./modules/conditionSelector/DetailConditionSelector.vue";
import CategorySelector from "./modules/conditionSelector/CategorySelector.vue";
import rawEventSettings from "./data/eventSetting.json";
import { Sound } from "@pixi/sound";
const eventDialogs = eventDialogsTable["DataList"];

const eventIDs = new Set<string>();
const { currentEventId, bgmVolume, currentBgm } = storeToRefs(useStore());
const eventSettings = rawEventSettings as Record<string, EventSettingItem>;

const currentCategory = ref("UIEventLobby");
const currentBg = computed(() => {
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

  return getBgUrl(currentEventId.value, bgType);
});
for (const dialog of eventDialogs) {
  eventIDs.add(dialog.EventID.toString());
}
let finalEventIDs = Array.from(eventIDs);
finalEventIDs = finalEventIDs.filter(
  (id) => id.startsWith("6") || id.startsWith("7") || id.startsWith("8")
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
  changeBgm();
});
const dialogsFilteByCategory = computed(() => {
  return currentEventDialogs.value.filter(
    (dialog) => dialog.DialogCategory === currentCategory.value
  );
});
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
function changeBgm() {
  if (currentBgm.value) {
    currentBgm.value.destroy();
  }
  const currentBgmSetting = eventSettings[currentEventId.value].bgm;
  currentBgm.value = Sound.from(getBgmUrl(currentBgmSetting.Path));
  currentBgm.value.play({
    volume: bgmVolume.value,
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
const showTips = ref(true);
</script>

<template>
  <main class="mainPage" :style="{ backgroundImage: `url(${currentBg})` }">
    <div class="mainPage__left">
      <Player
        ref="player"
        :dialogs="dialogsFilteByCategory"
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
      <CategorySelector
        :categories="currentCategories"
        v-model="currentCategory"
      />
    </div>
    <!-- <va-modal v-model="showTips" ok-text="Apply">
      <h3 class="va-h3">Title</h3>
      <p>
        Classic modal overlay which represents a dialog box or other interactive
        component, such as a dismissible alert, sub-window, etc.
      </p>
    </va-modal> -->
    <div class="mainPage__right">
      <Tabs :event-ids="finalEventIDs"></Tabs>
      <DetailConditionSelector
        :dialogs="dialogsFilteByCategory"
        @re-enter="reEnter"
        @condition="triggerCondition"
      />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.mainPage {
  background-size: cover;
  display: flex;

  &__left {
    height: 100vh;
    position: relative;
    flex: 5;
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
  &__right {
    flex: 4;
    box-sizing: border-box;
    height: 100vh;
    padding: 3% 1%;
  }
}
</style>
