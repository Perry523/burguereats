import { onMounted, onUnmounted, ref } from "vue";

export function useScreenSize() {
  const screenSize = ref({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const updateSize = () => {
    screenSize.value = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  };

  onMounted(() => {
    window.addEventListener("resize", updateSize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateSize);
  });

  return screenSize;
}
