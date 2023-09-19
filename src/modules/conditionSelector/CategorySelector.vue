<template>
  <div class="icons">
    <div
      v-for="categoryInfo in currentIconArr"
      class="icon"
      @click="() => emit('update:modelValue', categoryInfo.category)"
    >
      <img :src="categoryInfo.icon" />
      <div>
        {{ categoryInfo.category.replace("UI", "").replace("Event", "") }}
      </div>
    </div>
    <div class="rectBg"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getCategoryIcons } from "../common/resourceApi";

const props = defineProps<{ categories: string[]; modelValue: string }>();
const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();

const currentIconArr = computed(() => {
  return getCategoryIcons(props.categories);
});
</script>

<style lang="scss" scoped>
.icons {
  display: flex;
  width: 80%;
  position: absolute;
  justify-content: center;
  bottom: 0;
  left: 10%;
  .icon {
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1;
    img {
      object-fit: contain;
      height: 30%;
    }
  }
  .rectBg {
    width: 100%;
    height: 28%;
    background-color: rgba(255, 255, 255, 0.85);
    position: absolute;
    bottom: 15%;
    transform: matrix(1, 0, -0.15, 0.99, 0, 0);
  }
}
</style>
