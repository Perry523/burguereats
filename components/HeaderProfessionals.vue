<template>
  <div
    class="navbar bg-base-100 drop-shadow-2xl py-2 justify-between items-center h-[72px] w-full relative"
  >
    <div class="gap-2">
      <!-- <button
        class="btn-square items-center flex justify-center btn-ghost"
        @click="router.back()"
      >
        <ArrowLeftIcon class="w-6 h-6 fill-gray-300"></ArrowLeftIcon>
      </button> -->
      <duv class="capitalize font-bold text-xl pl-3">
        {{ route.name }}
      </duv>
    </div>
    <button
      @click="logout"
      class="btn-square items-center flex justify-center btn-ghost"
    >
      <ArrowRightOnRectangleIcon class="w-6 h-6 fill-gray-300">
      </ArrowRightOnRectangleIcon>
    </button>
  </div>
</template>
<script lang="ts" setup>
import { ArrowRightOnRectangleIcon } from "@heroicons/vue/24/solid";
import { useAuthStore } from "~/stores/auth";
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

async function logout() {
  try {
    await authStore.logout();
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
    authStore.clearUser();
    router.push("/login");
  }
}
</script>
