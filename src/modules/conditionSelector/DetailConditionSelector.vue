<template>
  <div class="main" :class="{ mobile: props.mobile }">
    <va-button
      round
      :icon="mobileButtonIcon"
      preset="secondary"
      v-if="mobile"
      @click="changeTab"
    >
    </va-button>
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
        :options="characterOptions"
        value-by="value"
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
import { CharacterExcelTable } from "../common/resourceApi";
import useStore from "../common/useStore";
import { storeToRefs } from "pinia";
const currentSelector = ref("time");

const props = defineProps<{ dialogs: RawEventDialogItem[]; mobile: boolean }>();
const { language, currentCharacterId: currentCharacter } = storeToRefs(
  useStore()
);
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
const characterOptions = computed(() => {
  return characters.value.map((characterId) => {
    return {
      value: characterId,
      text: Reflect.get(
        CharacterExcelTable.get(characterId)!,
        `Name${language.value}`
      ),
    };
  });
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

const mobileButtonIcon = computed(() => {
  if (currentSelector.value === "time") {
    return "arrow_downward";
  } else {
    return "arrow_upward";
  }
});
function changeTab() {
  if (currentSelector.value === "time") {
    currentSelector.value = "condition";
  } else {
    currentSelector.value = "time";
  }
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

.arrow {
  width: 1.25rem;
  height: 1.25rem;
  display: inline-block;
  position: relative;
  margin: 0 1rem;
  cursor: pointer;
  user-select: none;

  span {
    top: 0.5rem;
    position: absolute;
    width: 0.75rem;
    height: 0.1rem;
    background-color: #efefef;
    display: inline-block;
    transition: all 0.2s ease;

    &:first-of-type {
      left: 0;
      transform: rotate(45deg);
    }

    &:last-of-type {
      right: 0;
      transform: rotate(-45deg);
    }
  }
  &.active {
    span {
      &:first-of-type {
        transform: rotate(-45deg);
      }

      &:last-of-type {
        transform: rotate(45deg);
      }
    }
  }
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

.va-select-dropdown__content {
  z-index: 4;
}
</style>
