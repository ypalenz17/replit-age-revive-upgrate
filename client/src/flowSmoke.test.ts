import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function readSource(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

test('critical checkout routes are registered', () => {
  const appSource = readSource('./App.tsx');
  assert.match(appSource, /path="\/checkout"/);
  assert.match(appSource, /path="\/order-confirmed"/);
});

test('cart drawer checkout CTA navigates to checkout', () => {
  const cartDrawerSource = readSource('./components/CartDrawer.tsx');
  assert.ok(cartDrawerSource.includes("navigate('/checkout')"));
});

test('add-to-cart CTAs are wired', () => {
  const homeSource = readSource('./Home.tsx');
  assert.ok(homeSource.includes('onClick={addActiveProductToCart}'));
  assert.ok(homeSource.includes('data-testid="button-add-to-cart"'));

  const selectorSource = readSource('./components/ProtocolSelectorCard.tsx');
  assert.ok(selectorSource.includes('onClick={addCurrentProtocolToCart}'));
  assert.ok(selectorSource.includes('data-testid={`button-add-stack-${p.slug}`}'));
});

test('checkout completion clears cart and navigates to confirmation', () => {
  const checkoutSource = readSource('./pages/Checkout.tsx');
  assert.ok(checkoutSource.includes('cart.clearCart();'));
  assert.ok(checkoutSource.includes("navigate('/order-confirmed')"));
});
