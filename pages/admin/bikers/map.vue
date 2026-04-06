<template>
  <div class="h-[calc(100vh-128px)] flex flex-col gap-4 pt-0 md:pt-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <NuxtLink to="/admin/bikers">
          <button
            class="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white transition-colors border border-transparent hover:border-gray-200"
          >
            <UIcon name="i-heroicons-arrow-left" class="h-5 w-5" />
          </button>
        </NuxtLink>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Mapa ao Vivo 🛵</h2>
          <p class="text-sm text-gray-500">
            Acompanhamento em tempo real dos entregadores online
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <div
          v-if="stats.visible !== null"
          class="text-xs text-gray-500 mr-2 flex items-center gap-2"
        >
          <span
            >Total de motos: <b>{{ stats.total }}</b></span
          >
          <span v-if="stats.hidden > 0" class="text-amber-600"
            >({{ stats.hidden }} motos de outras empresas ocultas)</span
          >
          <span class="mx-2 text-gray-300">|</span>
        </div>

        <span class="flex h-3 w-3">
          <span
            :class="[
              'animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75',
              channelStatus === 'SUBSCRIBED' ? 'bg-emerald-400' : 'bg-red-400',
            ]"
          ></span>
          <span
            :class="[
              'relative inline-flex rounded-full h-3 w-3',
              channelStatus === 'SUBSCRIBED' ? 'bg-emerald-500' : 'bg-red-500',
            ]"
          ></span>
        </span>
        <span
          class="text-sm font-medium"
          :class="
            channelStatus === 'SUBSCRIBED' ? 'text-emerald-700' : 'text-red-700'
          "
          >{{ channelStatus }}</span
        >
      </div>
    </div>

    <!-- DEBUG WINDOW -->
    <div
      class="bg-gray-100 p-2 text-[10px] uppercase font-mono overflow-auto max-h-32 rounded-lg border border-gray-300"
    >
      <p><b>RAW SYNC DATA:</b> {{ rawPresence }}</p>
    </div>

    <div
      class="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative relative-z-1"
    >
      <div id="map" class="w-full h-full z-10"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

definePageMeta({
  layout: "admin",
});

const config = useRuntimeConfig();
const supabaseUrl = config.public?.supabaseUrl || "";
const supabaseKey = config.public?.supabaseAnonKey || "";

let pureSupabase: any = null;
let mapInstance: any = null;
let markers: Record<string, any> = {};
let trackingChannel: any = null;

const allowedMode = ref<"all" | "restricted">("restricted");
const allowedIds = ref<string[]>([]);
const stats = ref({ total: 0, visible: 0, hidden: 0 });
const channelStatus = ref<string>("CONECTANDO...");
const rawPresence = ref<any>({});

onMounted(async () => {
  const L = (await import("leaflet")).default;

  try {
    const res = await $fetch<any>("/api/admin/active-biker-ids");
    if (res && res.success) {
      allowedMode.value = res.mode;
      if (res.mode === "restricted") {
        allowedIds.value = res.allowedIds || [];
      }
      console.log("Rastreio API Status:", res);
    }
  } catch (error) {
    console.error("Erro ao validar permissões de rastreio", error);
  }

  mapInstance = L.map("map").setView([-7.2291, -35.8808], 13);

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    },
  ).addTo(mapInstance);

  const defaultIcon = L.divIcon({
    html: `<div style="font-size: 24px; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3));">🛵</div>`,
    className: "custom-biker-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });

  // USA O CLIENT DO MÓDULO, NÃO CRIA UM NOVO
  pureSupabase = useSupabaseClient();

  // Fetch initial locations on mount so the map populates instantly
  try {
    const { data: initialLocations, error } = await pureSupabase
      .from("biker_locations")
      .select("*");
      
    if (!error && initialLocations) {
      const initialMap: Record<string, any> = {};
      initialLocations.forEach((loc: any) => {
        initialMap[loc.biker_id] = [loc];
      });
      rawPresence.value = initialMap;
      updateStats();
    }
  } catch (err) {
    console.error("Failed to fetch initial locations", err);
  }

  function updateStats() {
    const presenceState = rawPresence.value;
    let totalCount = 0;
    let visibleCount = 0;
    const onlineBikerIds = new Set<string>();

    for (const userId in presenceState) {
      const userConnections = presenceState[userId];
      if (!userConnections || !userConnections[0]) continue;

      const payload: any = userConnections[0];
      if (!payload?.latitude || !payload?.longitude || !payload?.biker_id)
        continue;

      totalCount++;

      if (
        allowedMode.value === "restricted" &&
        !allowedIds.value.includes(payload.biker_id)
      ) {
        continue;
      }

      visibleCount++;
      onlineBikerIds.add(payload.biker_id);

      const latLng: [number, number] = [payload.latitude, payload.longitude];

      if (markers[payload.biker_id]) {
        markers[payload.biker_id].setLatLng(latLng);
      } else {
        const marker = L.marker(latLng, { icon: defaultIcon }).addTo(
          mapInstance!,
        );

        marker.bindTooltip(`<b>${payload.biker_name || "Entregador"}</b>`, {
          permanent: true,
          direction: "bottom",
          offset: [0, 10],
          className: "biker-map-tooltip",
        });

        const speedKmh =
          payload.speed && payload.speed > 0
            ? (payload.speed * 3.6).toFixed(1)
            : 0;
        marker.bindPopup(`
          <div class="text-sm p-1">
            <h3 class="font-bold text-gray-900 border-b pb-1 mb-1">${payload.biker_name || "Entregador"}</h3>
            <p class="text-gray-600 m-0 leading-tight">Velocidade: ${speedKmh} km/h</p>
          </div>
        `);

        markers[payload.biker_id] = marker;

        if (mapInstance) {
          mapInstance.setView(latLng, 14);
        }
      }
    }

    stats.value = {
      total: totalCount,
      visible: visibleCount,
      hidden: totalCount - visibleCount,
    };

    for (const existingId in markers) {
      if (!onlineBikerIds.has(existingId)) {
        mapInstance?.removeLayer(markers[existingId]);
        delete markers[existingId];
      }
    }
  };

  // CRIA O CANAL UMA VEZ PARA OUVIR MUDANÇAS NO BANCO
  trackingChannel = pureSupabase.channel("biker_locations_changes");

  trackingChannel.on(
    "postgres_changes",
    { event: "*", schema: "public", table: "biker_locations" },
    (payload: any) => {
      console.log("[POSTGRES_CHANGES]", payload);
      
      const updated = { ...rawPresence.value };
      
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        updated[payload.new.biker_id] = [payload.new];
      } else if (payload.eventType === 'DELETE') {
        delete updated[payload.old.biker_id];
      }

      rawPresence.value = JSON.parse(JSON.stringify(updated));
      updateStats();
    },
  );

  trackingChannel.subscribe(async (status: string) => {
    console.log("[STATUS]", status);
    channelStatus.value = status;
    if (status === "SUBSCRIBED") {
      console.log("Conectado. Ouvindo a tabela biker_locations...");
    }
  });
});

onBeforeUnmount(() => {
  if (trackingChannel) {
    pureSupabase.removeChannel(trackingChannel);
  }
  if (mapInstance) {
    mapInstance.remove();
  }
});
</script>
<style>
@import "leaflet/dist/leaflet.css";

/* Custom styling for the permanent labels */
.biker-map-tooltip {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  color: #111827;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  margin-top: 5px;
}
.biker-map-tooltip::before {
  border-bottom-color: #e5e7eb !important;
}
.custom-biker-icon {
  background: transparent;
  border: none;
}
.leaflet-container {
  font-family: inherit;
}
</style>
