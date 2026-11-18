export type BasketItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image_url: string;
};

export function money(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function buildOrderMessage(
  items: BasketItem[],
  subtotal: number,
  shippingFee?: number | null,
): string {
  const products = items
    .map(
      (item) =>
        `* ${item.name} | Preço un.: ${money(item.price)}\n     Qtd: ${item.qty} | Subtotal: ${money(item.price * item.qty)}`
    )
    .join("\n\n");

  const hasShipping = shippingFee !== undefined && shippingFee !== null;
  const shippingText = hasShipping
    ? Number(shippingFee) === 0
      ? "Frete grátis"
      : money(Number(shippingFee))
    : "A combinar";

  const grandTotal = hasShipping ? subtotal + Number(shippingFee) : subtotal;

  return `Olá! Gostaria de fazer um pedido:\n\n🧺 *MINHA CESTA:*\n${products}\n\n📦 *FRETE:* ${shippingText}\n💵 *SUBTOTAL:* ${money(subtotal)}\n💰 *VALOR TOTAL: ${money(grandTotal)}*\n\nAguardo confirmação! 😊`;
}

export function buildWhatsAppOrderUrl(
  phone: string,
  items: BasketItem[],
  subtotal: number,
  shippingFee?: number | null,
): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;
  const url = new URL(
    isMobile ? "whatsapp://send" : "https://api.whatsapp.com/send",
  );
  if (cleanPhone) {
    url.searchParams.set("phone", cleanPhone);
  }
  url.searchParams.set("text", buildOrderMessage(items, subtotal, shippingFee));
  return url.toString();
}
