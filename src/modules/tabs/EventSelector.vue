<template>
  <div class="icons">
    <img
      v-for="{ url, id } in iconInfos"
      :src="url"
      @click="() => (currentEventId = id)"
    />
  </div>
</template>

<script lang="ts" setup>
import { getEventIcons } from "../common/resourceApi";
import useStore from "../common/useStore";
import { storeToRefs } from "pinia";
const props = defineProps<{ eventIds: string[] }>();
const iconInfos = getEventIcons(props.eventIds);
const { currentEventId } = storeToRefs(useStore());
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
