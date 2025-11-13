export function getPhoto(url: string | undefined) {
  const runtimeConfig = useRuntimeConfig();
  if (!url) return undefined;
  return runtimeConfig.public.API_URL + url;
}
