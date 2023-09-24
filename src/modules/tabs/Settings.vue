<template>
  <div class="settings">
    <va-switch v-model="bgmState" label="bgm" left-label> </va-switch>
    <va-slider
      v-model="localBgmVolume"
      track-label-visible
      :min="0"
      :max="100"
      label="bgm volume"
      v-if="bgmState"
    />
    <va-slider
      v-model="localCharacterSiezInMobile"
      track-label-visible
      :min="0"
      :max="100"
      label="mobile character size"
    />
    <va-slider
      v-model="localCharacterVolume"
      track-label-visible
      :min="0"
      :max="100"
      label="character volume"
    />
  </div>
</template>

<script lang="ts" setup>
import useStore from "../common/useStore";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import eventVoicePlayer from "../player/eventVoicePlayer";

const {
  bgmState,
  bgmVolume,
  characterSizeInMobile,
  characterVolume,
  currentBgm,
} = storeToRefs(useStore());
const localBgmVolume = ref(25);
const localCharacterSiezInMobile = ref(25);
const localCharacterVolume = ref(100);

watch(localBgmVolume, (newBgmVolume) => {
  bgmVolume.value = newBgmVolume / 100;
  if (currentBgm.value) {
    currentBgm.value.volume = bgmVolume.value;
  }
});
watch(localCharacterSiezInMobile, (newSize) => {
  characterSizeInMobile.value = newSize / 100;
});
watch(localCharacterVolume, (newCharacterVolume) => {
  characterVolume.value = newCharacterVolume / 100;
  if (eventVoicePlayer.playingVoice) {
    eventVoicePlayer.playingVoice.volume = characterVolume.value;
  }
});
</script>

<style lang="scss" scoped>
.settings {
  display: flex;
  flex-direction: column;
  padding: 1% 2%;
  align-items: flex-start;
  color: rgb(21, 78, 193);
  & > :deep(div) {
    width: 100%;
    margin: 5% 0;
    text-align: left;
  }
  & :deep(.va-switch__container) {
    width: auto;
  }
}
</style>
