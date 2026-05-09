<template>
  <div class="relative flex items-center justify-center">
    <button
      @click="toggleWebTracking"
      class="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-colors"
      :class="
        isTrackingWeb
          ? 'bg-green-100 text-green-600'
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
      "
      :title="isTrackingWeb ? 'Pausar rastreamento' : 'Iniciar rastreamento'"
    >
      <UIcon
        :name="
          isTrackingWeb ? 'i-heroicons-map-pin-solid' : 'i-heroicons-map-pin'
        "
        class="h-5 w-5 sm:h-6 sm:w-6"
      />
      <span
        v-if="isTrackingWeb"
        class="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white animate-pulse"
      ></span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { useAuthStore } from "~/stores/auth";

const supabase = useSupabaseClient();
const auth = useAuthStore();
const toast = useToast();

const isTrackingWeb = ref(false);
const trackingId = ref<number | null>(null);

const sendLocationToSupabase = async (pos: GeolocationPosition) => {
  const userId = auth.user?.id;
  if (!userId) return;

  try {
    await supabase.from("biker_locations").upsert(
      {
        biker_id: userId,
        biker_name: auth.user?.name || "Entregador",
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        speed: pos.coords.speed || 0,
        heading: pos.coords.heading || 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "biker_id" },
    );
  } catch (err: any) {
    console.error("Tracking upsert failed", err);
  }
};

const toggleWebTracking = () => {
  if (isTrackingWeb.value) {
    // Stop Tracking
    if (trackingId.value !== null) {
      navigator.geolocation.clearWatch(trackingId.value);
      trackingId.value = null;
    }
    isTrackingWeb.value = false;
    toast.add({ title: "Rastreamento pausado", color: "orange" });
  } else {
    // Start Tracking
    if (!navigator.geolocation) {
      toast.add({ title: "Navegador não suporta GPS", color: "red" });
      return;
    }
    isTrackingWeb.value = true;
    toast.add({ title: "Rastreamento ativado", color: "green" });

    // Immediate ping
    navigator.geolocation.getCurrentPosition(
      (pos) => sendLocationToSupabase(pos),
      (err) => console.error(err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );

    // Watch position
    trackingId.value = navigator.geolocation.watchPosition(
      (pos) => sendLocationToSupabase(pos),
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 },
    );
  }
};

onUnmounted(() => {
  if (trackingId.value !== null) {
    navigator.geolocation.clearWatch(trackingId.value);
  }
});
</script>
