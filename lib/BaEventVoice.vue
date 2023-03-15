<script setup lang="ts">
import { RawEventDialogItem } from "./types";
const props = defineProps<{
  dialogs: RawEventDialogItem[];
  dataUrls: {
    characterExcelTable: string;
    characterSpineDirectory: string;
    voiceDirectory: string;
  };
  eventIcon?: string;
}>();
</script>

<template></template>
