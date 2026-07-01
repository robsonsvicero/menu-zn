export function formatViewCount(value: number | null | undefined) {
  const views = Math.max(0, value ?? 0);
  return `${new Intl.NumberFormat("pt-BR").format(views)} visualiza${
    views === 1 ? "ção" : "ções"
  }`;
}
