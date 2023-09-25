<template>
  <div class="settings">
    <va-switch v-model="bgmState" label="Bgm" left-label> </va-switch>
    <va-slider
      v-model="localBgmVolume"
      track-label-visible
      :min="0"
      :max="100"
      label="bgm volume"
      label-color="#000000"
      v-if="bgmState"
    />
    <va-slider
      v-model="localCharacterSiezInMobile"
      track-label-visible
      :min="0"
      :max="100"
      label-color="#000000"
      label="mobile character size"
    />
    <va-slider
      v-model="localCharacterVolume"
      track-label-visible
      :min="0"
      :max="100"
      label-color="#000000"
      label="character volume"
    />
    <va-select
      :options="['CN', 'JP']"
      v-model="language"
      label="Language"
      color="#000000"
      preset="solid"
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
  language,
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
