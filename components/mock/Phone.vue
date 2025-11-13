<template>
  <div class="mockup-phone w-full max-w-80">
    <div class="camera"></div>
    <div class="display">
      <div
        :style="`background: ${backgroundColor}`"
        class="artboard !w-full artboard-demo phone-1 items-start"
      >
        <div class="flex flex-col justify-start h-full w-full md:w-full">
          <div :style="`background: #aaa`" class="pb-[25px] w-full"></div>
          <mock-navbar :image :contrastText :cardsColor />
          <slot name="default"></slot>
          <mock-bottom :contrastText :cardsColor :buttonsColor />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  image: String,
  cardsColor: String,
  contrastText: Number,
  buttonsColor: String,
  backgroundColor: String,
});
</script>
