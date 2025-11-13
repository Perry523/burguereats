let timer = 0;

export function useDelay(callbackfn: () => void, time: number) {
  clearTimeout(timer);
  timer = window.setTimeout(callbackfn, time);
}
