<template>
  <div class="icons">
    <div
      v-for="categoryInfo in currentIconArr"
      class="icon"
      @click="() => emits('update:modelValue', categoryInfo.category)"
    >
      <img :src="categoryInfo.icon" />
      <div>
        {{ categoryTexts[categoryInfo.category] }}
      </div>
    </div>
    <div class="rectBg"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { getCategoryIcons } from "../common/resourceApi";
import useStore from "../common/useStore";
import { storeToRefs } from "pinia";
import rawCategoryTexts from "../../data/categoryTexts.json";

const categoryTexts = rawCategoryTexts as Record<string, string>;
const props = defineProps<{ categories: string[]; modelValue: string }>();
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const currentIconArr = ref<{ icon: string; category: string }[]>([]);
const { categoryDone } = storeToRefs(useStore());
async function initCategories() {
  categoryDone.value = false;
  currentIconArr.value = await getCategoryIcons(props.categories);
  categoryDone.value = true;
}
watch(() => props.categories, initCategories);
initCategories();
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
      margin-bottom: 2%;
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
