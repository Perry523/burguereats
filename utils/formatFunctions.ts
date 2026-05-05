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

export function formatPhone(phone: string) {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return phone;
}
