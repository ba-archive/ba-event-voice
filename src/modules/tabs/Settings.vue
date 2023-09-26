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
      v-model="characterSizeInPortrait"
      track-label-visible
      :min="0.1"
      :max="1"
      :step="0.1"
      label-color="#000000"
      label="portrait character size"
      v-if="portrait"
    />
    <va-slider
      v-model="characterPositionInPortrait"
      track-label-visible
      :min="0"
      :max="100"
      :step="1"
      label-color="#000000"
      label="portrait character position"
      v-if="portrait"
    />
    <va-slider
      v-model="characterSizeInLandscape"
      track-label-visible
      :min="0.1"
      :max="1"
      :step="0.1"
      label-color="#000000"
      label="landscape character size"
      v-if="!portrait"
    />
    <va-slider
      v-model="characterPositionInLandscape"
      track-label-visible
      :min="0"
      :max="100"
      :step="1"
      label-color="#000000"
      label="landscape character position"
      v-if="!portrait"
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
  characterSizeInPortrait,
  characterPositionInPortrait,
  characterPositionInLandscape,
  characterSizeInLandscape,
  characterVolume,
  currentBgm,
  language,
} = storeToRefs(useStore());
const localBgmVolume = ref(bgmVolume.value * 100);
const localCharacterVolume = ref(characterVolume.value * 100);
const props = defineProps<{ portrait: boolean }>();

watch(localBgmVolume, (newBgmVolume) => {
  bgmVolume.value = newBgmVolume / 100;
  if (currentBgm.value) {
    currentBgm.value.volume = bgmVolume.value;
  }
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
