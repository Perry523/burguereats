<template>
  <div
    v-bind="getRootProps()"
    class="w-full border-dashed flex h-48 border bg-base-200 cursor-pointer mt-8"
  >
    <input v-bind="getInputProps()" />
    <span v-if="isDragActive" class="m-auto text-xs">
      Solte o arquivo aqui
    </span>
    <span v-else class="m-auto text-xs"
      >Arraste e solte sua foto aqui ou clique para selecionar o arquivo</span
    >
  </div>
</template>
<script setup lang="ts">
import { type FileRejectReason, useDropzone } from "vue3-dropzone";
function onDrop(acceptFiles: File[], rejectReasons: FileRejectReason[]) {
  if (!!rejectReasons.length) {
    return;
  }
  emit("update:file", acceptFiles[0]);
}
const { getRootProps, getInputProps, ...rest } = useDropzone({
  onDrop,
  accept: "image/*",
  multiple: false,
});
const isDragActive = rest.isDragActive;
const emit = defineEmits(["update:file"]);
</script>