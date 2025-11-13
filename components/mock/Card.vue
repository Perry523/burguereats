<template>
  <div
    :style="`background: ${background}; 
    color: ${contrastText ? '#fff' : '#000'}`"
    class="card flex-row w-full shadow-sm h-20 rounded-lg pr-1"
  >
    <div class="h-full flex flex-col px-2 py-1">
      <div class="font-bold line-clamp-2 leading-4 text-base">
        {{ service.name }}
      </div>
      <span class="text-xs mt-auto">
        <b>Duração:</b> <br />
        {{ handleTime(service.duration) }}
      </span>
    </div>
    <div class="ml-auto flex flex-col py-2">
      <div class="font-bold mb-2 text-right">
        {{ formatPrice(parseFloat(service.price)) }}
      </div>
      <base-button
        :style="`background: ${buttonsColor}`"
        size="sm"
        class="text-xs mt-auto ml-auto border-none"
      >
        Agendar
      </base-button>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  service: {
    name: string;
    price: string;
    duration: string;
  };
  background: string;
  buttonsColor: string;
  contrastText: number;
}>();

function handleTime(minutos: number | string) {
  if (typeof minutos === "string") {
    minutos = parseFloat(minutos);
  }
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;

  if (horas === 0) {
    return `${minutos} minuto(s)`;
  } else if (minutosRestantes === 0) {
    return `${horas} hora(s)`;
  } else {
    return `${horas} hora(s) e ${minutosRestantes} minuto(s)`;
  }
}
function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "brl",
    maximumFractionDigits: 2,
  }).format(price);
}
</script>
