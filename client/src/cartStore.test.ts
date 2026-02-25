import assert from 'node:assert/strict';
import test from 'node:test';
import { __cartTestUtils } from './cartStore';

function totalItems() {
  return __cartTestUtils.getState().items.reduce((sum, item) => sum + item.quantity, 0);
}

function totalPrice() {
  return __cartTestUtils.getState().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

test('addItem merges matching item and refreshes metadata', () => {
  __cartTestUtils.reset();

  __cartTestUtils.addItem(
    {
      slug: 'cellunad',
      name: 'CELLUNAD+',
      image: '/images/v1.png',
      price: 79.99,
      isSubscribe: true,
      frequency: 'Delivered monthly',
    },
    1,
    true,
  );

  __cartTestUtils.addItem(
    {
      slug: 'cellunad',
      name: 'CELLUNAD+',
      image: '/images/v2.png',
      price: 215.97,
      isSubscribe: true,
      frequency: 'Every 3 months',
    },
    2,
    true,
  );

  const state = __cartTestUtils.getState();
  assert.equal(state.items.length, 1);
  assert.equal(state.items[0].quantity, 3);
  assert.equal(state.items[0].price, 215.97);
  assert.equal(state.items[0].frequency, 'Every 3 months');
  assert.equal(state.items[0].image, '/images/v2.png');
});

test('addItem keeps non-subscribe and subscribe lines separate', () => {
  __cartTestUtils.reset();

  __cartTestUtils.addItem(
    {
      slug: 'cellubiome',
      name: 'CELLUBIOME',
      image: '/images/cb.png',
      price: 110,
      isSubscribe: true,
      frequency: 'Delivered monthly',
    },
    1,
    true,
  );

  __cartTestUtils.addItem(
    {
      slug: 'cellubiome',
      name: 'CELLUBIOME',
      image: '/images/cb.png',
      price: 110,
      isSubscribe: false,
      frequency: 'One-time',
    },
    1,
    true,
  );

  const state = __cartTestUtils.getState();
  assert.equal(state.items.length, 2);
});

test('silent add keeps drawer state, non-silent add opens drawer', () => {
  __cartTestUtils.reset();

  __cartTestUtils.addItem(
    {
      slug: 'cellunova',
      name: 'CELLUNOVA',
      image: '/images/cn.png',
      price: 145,
      isSubscribe: true,
      frequency: '7-day cycle',
    },
    1,
    true,
  );
  assert.equal(__cartTestUtils.getState().isOpen, false);

  __cartTestUtils.addItem(
    {
      slug: 'cellunova',
      name: 'CELLUNOVA',
      image: '/images/cn.png',
      price: 145,
      isSubscribe: true,
      frequency: '7-day cycle',
    },
    1,
    false,
  );
  assert.equal(__cartTestUtils.getState().isOpen, true);
});

test('updateQuantity and removeItem keep totals consistent', () => {
  __cartTestUtils.reset();

  __cartTestUtils.addItem(
    {
      slug: 'cellunad',
      name: 'CELLUNAD+',
      image: '/images/cn1.png',
      price: 80,
      isSubscribe: true,
      frequency: 'Delivered monthly',
    },
    2,
    true,
  );

  __cartTestUtils.addItem(
    {
      slug: 'cellubiome',
      name: 'CELLUBIOME',
      image: '/images/cn2.png',
      price: 110,
      isSubscribe: true,
      frequency: 'Delivered monthly',
    },
    1,
    true,
  );

  assert.equal(totalItems(), 3);
  assert.equal(totalPrice(), 270);

  __cartTestUtils.updateQuantity('cellunad', true, 1);
  assert.equal(totalItems(), 2);
  assert.equal(totalPrice(), 190);

  __cartTestUtils.removeItem('cellubiome', true);
  assert.equal(totalItems(), 1);
  assert.equal(totalPrice(), 80);
});

test('clearCart empties cart and closes drawer', () => {
  __cartTestUtils.reset();

  __cartTestUtils.addItem(
    {
      slug: 'cellunad',
      name: 'CELLUNAD+',
      image: '/images/cn1.png',
      price: 80,
      isSubscribe: true,
      frequency: 'Delivered monthly',
    },
    1,
    false,
  );

  assert.equal(__cartTestUtils.getState().items.length, 1);
  assert.equal(__cartTestUtils.getState().isOpen, true);

  __cartTestUtils.clearCart();

  assert.equal(__cartTestUtils.getState().items.length, 0);
  assert.equal(__cartTestUtils.getState().isOpen, false);
});

test('invalid quantities are ignored safely', () => {
  __cartTestUtils.reset();

  __cartTestUtils.addItem(
    {
      slug: 'cellubiome',
      name: 'CELLUBIOME',
      image: '/images/cb.png',
      price: 110,
      isSubscribe: true,
      frequency: 'Delivered monthly',
    },
    0,
    true,
  );

  assert.equal(__cartTestUtils.getState().items.length, 0);

  __cartTestUtils.addItem(
    {
      slug: 'cellubiome',
      name: 'CELLUBIOME',
      image: '/images/cb.png',
      price: 110,
      isSubscribe: true,
      frequency: 'Delivered monthly',
    },
    2,
    true,
  );

  __cartTestUtils.updateQuantity('cellubiome', true, Number.NaN);
  assert.equal(__cartTestUtils.getState().items[0].quantity, 2);
});
