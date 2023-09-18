<template></template>

<script lang="ts" setup>
import { RawEventDialogItem } from "../common/types";
import { watch, onMounted } from "vue";
const props = defineProps<{ dialogs: RawEventDialogItem }>();
watch(
  () => props.dialogs,
  () => {}
);

onMounted(() => {});
</script>
