// Sample delivery rules. Change these to your real rates.
export const DELIVERY_FEE = 300;
export const FREE_DELIVERY_OVER = 20000;

export function deliveryFeeFor(subtotal) {
  return subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
}