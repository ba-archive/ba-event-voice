<template>
  <VaSkeletonGroup class="skeletonGrope" v-if="!mobile">
    <VaSkeleton variant="squared" height="90%" width="49%" />
    <div class="subGrope">
      <VaSkeleton variant="squared" height="50%" width="100%" />
      <VaSkeleton variant="squared" height="30%" width="100%" />
    </div>
  </VaSkeletonGroup>
  <VaSkeletonGroup class="skeletonGrope mobileSkeleton" v-else>
    <VaSkeleton variant="squared" height="15%" width="95%" />
    <VaSkeleton variant="squared" height="80%" width="95%" />
  </VaSkeletonGroup>
</template>

<script lang="ts" setup>
const props = defineProps<{ mobile: boolean }>();
</script>

<style lang="scss">
.skeletonGrope {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: white;
  width: 100vw;
  height: 100vh;
  position: absolute !important;
  left: 0;
  top: 0;
  z-index: 10;

  .subGrope {
    height: 100vh;
    width: 49%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}

.mobileSkeleton {
  flex-direction: column;
}
</style>
