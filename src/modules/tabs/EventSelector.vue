<template>
  <div class="icons">
    <img
      v-for="{ url, id } in iconInfos"
      :src="url"
      @click="onEventChange(id)"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { getEventIcons } from "../common/resourceApi";
import useStore from "../common/useStore";
import { storeToRefs } from "pinia";
const props = defineProps<{ eventIds: string[] }>();
const iconInfos = ref<{ id: string; url: string }[]>([]);

const { currentEventId, eventIconsDone, eventChange } = storeToRefs(useStore());
async function initEventIcons() {
  eventIconsDone.value = false;
  iconInfos.value = await getEventIcons(props.eventIds);
  eventIconsDone.value = true;
}
watch(() => props.eventIds, initEventIcons);
initEventIcons();
function onEventChange(id: string) {
  currentEventId.value = id;
  eventChange.value = true;
  setTimeout(() => (eventChange.value = false), 100);
}
</script>

<style lang="scss" scoped>
.icons {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  img {
    width: 30%;
    object-fit: contain;
    cursor: pointer;
  }
}
</style>
