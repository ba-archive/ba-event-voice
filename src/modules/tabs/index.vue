<template>
  <div class="main" :class="{ portrait }">
    <div class="tabs" v-if="!portrait">
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
        <Settings v-show="currentTab === 'settings'" :portrait="portrait" />
      </VaScrollContainer>
    </div>
    <va-tabs v-model="currentTab" class="tabs" grow v-if="portrait">
      <template #tabs>
        <va-tab
          v-for="tab in [
            { key: '活动选择', value: 'events' },
            { key: '设置', value: 'settings' },
          ]"
          :key="tab.key"
          :name="tab.value"
        >
          {{ tab.key }}
        </va-tab>
      </template>
    </va-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import EventSelector from "./EventSelector.vue";
import Settings from "./Settings.vue";
import { VaScrollContainer } from "vuestic-ui";
const props = defineProps<{ eventIds: string[]; portrait: boolean }>();

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

.portrait {
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  .content {
    position: absolute;
    bottom: 7%;
  }
  .tabs {
    position: absolute;
    bottom: 0;
  }
  :deep(.va-tabs__container) {
    height: 100%;
  }
}
</style>
