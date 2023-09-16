<script lang="ts" setup>
import { DialogType } from "./types";
const props = defineProps<{ text: string; mode: DialogType }>();
</script>

<template>
  <div class="dialog__box">
    {{ props.text }}
    <div class="circles" v-if="mode === 'Think'">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dialog__box {
  border-radius: 1em;
  background-color: white;
  width: 70%;
  padding: 1em 0.5em;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  line-height: 1.4em;
  position: relative;
}

.dialog__box::before {
  content: "";
  border-bottom: 5px transparent solid;
  border-top: 5px transparent solid;
  border-right: 10px white solid;
  display: block;
  position: absolute;
  left: -9px;
  filter: drop-shadow(-2px 1px 1px rgba(0, 0, 0, 0.5));
  z-index: 0;
  top: 20%;
}

.circles {
  position: absolute;
  width: 7%;
  left: -3.5%;
  top: 15%;
  div {
    border-radius: 100%;
    width: 100%;
    aspect-ratio: 1;
    display: block;
    filter: drop-shadow(-2px 1px 1px rgba(0, 0, 0, 0.5));
    background-color: white;
    z-index: 0;
    position: absolute;
  }

  div:nth-child(1) {
    border-radius: 100% 0 0 100%/50% 0 0 50%;
    width: 50%;
    aspect-ratio: 0.5;
  }

  div:nth-child(2) {
    transform: scale(0.8) translateX(-130%);
  }

  div:nth-child(3) {
    transform: scale(0.6) translateX(-330%);
  }
}
</style>
