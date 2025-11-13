export function toBrl(value: number | string) {
  if (typeof value === "string") {
    value = parseFloat(value);
  }
  return value?.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
export function handleTime(minutos: number | string) {
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
