export function convertToKebabCase<T>(
  obj: Record<string, T>
): Record<string, T> {
  const convertedObj = {} as Record<string, T>;
  for (const key in obj) {
    if (obj?.hasOwnProperty(key)) {
      const kebabKey = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      convertedObj[kebabKey] = obj[key];
    }
  }
  return convertedObj;
}
