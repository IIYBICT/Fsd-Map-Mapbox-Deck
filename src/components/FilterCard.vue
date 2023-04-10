<template>
  <div class="p-2 text rounded-lg text-white">
    <slot></slot>
  </div>
</template>
<style scoped>
.text {
  backdrop-filter: blur(3px);
  background-color: rgba(7, 17, 27, 0.5);
}
</style>
