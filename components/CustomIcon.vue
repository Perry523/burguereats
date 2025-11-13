<template>
    <nuxt-img :src="url">
          
    </nuxt-img>
</template>
<script setup lang="ts">
defineProps({
    url: String
})
</script>