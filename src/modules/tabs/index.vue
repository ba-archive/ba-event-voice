<template>
  <div class="main">
    <div class="tabs">
      <div
        :class="{
          tab: true,
          tab2: true,
          active: currentTab === 'settings',
        }"
        @click="() => (currentTab = 'settings')"
      >
        <div class="text">设置</div>
      </div>
      <div
        :class="{
          tab: true,
          tab1: true,
          active: currentTab === 'events',
        }"
        @click="() => (currentTab = 'events')"
      >
        <div class="text">活动选择</div>
      </div>
    </div>
    <div class="content">
      <VaScrollContainer vertical>
        <EventSelector
          :event-ids="props.eventIds"
          v-show="currentTab === 'events'"
        />
        <Settings v-show="currentTab === 'settings'" />
      </VaScrollContainer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import EventSelector from "./EventSelector.vue";
import Settings from "./Settings.vue";
import { VaScrollContainer } from "vuestic-ui";
const props = defineProps<{ eventIds: string[] }>();

const currentTab = ref("events");
</script>

<style scoped lang="scss">
.main {
  background-color: rgba(0, 0, 0, 0.23);
  height: 70vh;
  border-radius: 10px;
  position: relative;
  .content {
    height: 88%;
    width: 100%;
  }
  .tabs {
    width: 100%;
    height: 10%;
    display: flex;
    position: relative;
    .tab {
      width: 52%;
      height: 100%;
      background-color: white;
      color: black;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .tab1 {
      border-top-left-radius: 10px;
      position: absolute;
      left: 0;
      clip-path: polygon(0 1%, 100% 0%, 92% 100%, 0% 100%);
    }
    .tab2 {
      border-top-right-radius: 10px;
      position: absolute;
      right: 0;
    }
    .active {
      background-color: #263b4e;
      color: #ffe500;
    }
  }
}
</style>
