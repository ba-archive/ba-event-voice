<template>
  <div class="main">
    <VaScrollContainer vertical>
      <EventSelector :event-ids="props.eventIds" />
    </VaScrollContainer>
  </div>
</template>

<script lang="ts" setup>
import EventSelector from "./EventSelector.vue";
import { VaScrollContainer } from "vuestic-ui";
const props = defineProps<{ eventIds: string[] }>();
</script>

<style scoped lang="scss">
.main {
  background-color: rgba(0, 0, 0, 0.23);
  height: 70vh;
  border-radius: 3%;
}
</style>
