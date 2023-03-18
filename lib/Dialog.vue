<script lang="ts" setup>
const props = defineProps<{ text: string }>();
</script>

<template>
  <div class="dialog__box">{{ props.text }}</div>
</template>

<style scoped>
.dialog__box {
  border-radius: 1em;
  background-color: white;
  width: 70%;
  padding: 1em 0.5em;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  line-height: 1.4em;
}

.dialog__box::before {
	content: '';
	border-bottom: 5px transparent solid;
	border-top: 5px transparent solid;
	border-right: 10px white solid;
	/* height: 0px; */
	display: block;
	position: absolute;
	left: -9px;
	filter: drop-shadow(-2px 1px 1px rgba(0,0,0,.5));
	z-index: 0;
	top: 15%;
}


</style>
