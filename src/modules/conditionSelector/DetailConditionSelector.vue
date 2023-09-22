<template>
  <div class="main" :class="{ mobile: props.mobile }">
    <va-button-group
      v-if="props.mobile"
      gradient
      color="info"
      class="buttonGrope"
    >
      <va-button icon="create" @click="currentSelector = 'time'" />
      <va-button icon="create" @click="currentSelector = 'condition'" />
    </va-button-group>
    <va-tabs v-model="currentSelector" vertical class="tabs" v-else>
      <template #tabs>
        <va-tab
          v-for="tab in [
            { key: '时期人物', value: 'time' },
            { key: '具体条件', value: 'condition' },
          ]"
          :key="tab.key"
          :name="tab.value"
        >
          {{ tab.key }}
        </va-tab>
      </template>
    </va-tabs>

    <div v-if="currentSelector === 'time'" class="selector">
      <va-select
        label="时期"
        :options="commonDetails"
        v-model="currentTime"
        value-by="value"
        class="selector__select"
        :inner-label="props.mobile"
        :preset="props.mobile ? 'solid' : ''"
      />
      <va-select
        label="人物"
        :options="characters"
        v-model="currentCharacter"
        class="selector__select"
        :inner-label="props.mobile"
        :preset="props.mobile ? 'solid' : ''"
      />
      <div class="emitButton">
        <va-button round icon="thumb_up" @click="reEnter" />
      </div>
    </div>
    <div v-else-if="currentSelector === 'condition'" class="selector">
      <va-select
        label="条件"
        :options="conditions"
        v-model="currentCondition"
        value-by="value"
        class="condition_select"
        :inner-label="props.mobile"
        :preset="props.mobile ? 'solid' : ''"
      />
      <div class="emitButton">
        <va-button round icon="thumb_up" @click="onCondition" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VaSelect } from "vuestic-ui";
import { computed, ref, watch } from "vue";
import { RawEventDialogItem } from "../common/types";
import { uniq } from "lodash-es";
const currentSelector = ref("time");

const props = defineProps<{ dialogs: RawEventDialogItem[]; mobile: boolean }>();
const currentTime = ref("None");
const commonDetails = [
  { text: "正常", value: "None" },
  { text: "中期", value: "Day" },
  { text: "关闭", value: "Close" },
];

const characters = computed(() => {
  const dialogFilterByTime = props.dialogs.filter(
    (dialog) => dialog.DialogConditionDetail === currentTime.value
  );
  return uniq(dialogFilterByTime.map((dialog) => dialog.CostumeUniqueId));
});
const currentCharacter = ref(characters.value[0]) || 0;
watch(characters, () => {
  currentCharacter.value = characters.value[0];
});
const emits = defineEmits<{
  (e: "reEnter", detailTime: string, characterId: number): void;
  (e: "condition", condition: string): void;
}>();
function reEnter() {
  emits("reEnter", currentTime.value, currentCharacter.value);
}

const currentCondition = ref("");
const conditions = computed(() => {
  return uniq(props.dialogs.map((dialog) => dialog.DialogCondition)).filter(
    (condition) => !["Enter", "Idle"].includes(condition)
  );
});
function onCondition() {
  emits("condition", currentCondition.value);
}
</script>

<style lang="scss" scoped>
.main {
  .tabs {
    display: inline-block;
  }
  height: 15vh;
  margin-top: 3%;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  .selector {
    display: inline-block;
    position: relative;
  }
  .emitButton {
    position: absolute;
    bottom: 0;
    right: 10%;
  }
}

.mobile {
  height: 100%;
  margin-top: 0;
  width: 80%;
  background: rgba(255, 255, 255, 0);
  box-shadow: none;
}
</style>

<style>
.selector__select {
  width: 30%;
  margin: 0 5%;
}

.condition_select {
  margin: 0 5%;
  width: 60%;
}

.buttonGrope {
  margin-left: 3%;
}
</style>
