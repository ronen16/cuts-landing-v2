import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveSource, resolveClientContext } from '../api/lead.js';

test('meta clicks stay מטא even from the website', () => {
  assert.equal(resolveSource({ site: 'website', attribution: { fbclid: 'x' } }), 'מטא');
});
test('website leads are אתר', () => {
  assert.equal(resolveSource({ site: 'website', attribution: {} }), 'אתר');
});
test('everything else stays דף נחיתה', () => {
  assert.equal(resolveSource({}), 'דף נחיתה');
  assert.equal(resolveSource({ site: 'other' }), 'דף נחיתה');
});

const req = (headers) => ({ headers });

test('forwarded visitor context is used when the key matches', () => {
  const ctx = resolveClientContext(
    req({ 'x-cuts-forward-key': 'secret', 'x-cuts-client-ip': '5.5.5.5', 'x-cuts-client-ua': 'Phone', 'x-forwarded-for': '9.9.9.9', 'user-agent': 'Vercel' }),
    'secret',
  );
  assert.deepEqual(ctx, { ip: '5.5.5.5', ua: 'Phone' });
});
test('spoofed headers without the right key are ignored', () => {
  const ctx = resolveClientContext(
    req({ 'x-cuts-forward-key': 'wrong', 'x-cuts-client-ip': '5.5.5.5', 'x-forwarded-for': '9.9.9.9, 1.1.1.1', 'user-agent': 'Browser' }),
    'secret',
  );
  assert.deepEqual(ctx, { ip: '9.9.9.9', ua: 'Browser' });
});
test('no configured key means direct headers', () => {
  const ctx = resolveClientContext(req({ 'x-cuts-forward-key': '', 'x-forwarded-for': '9.9.9.9', 'user-agent': 'B' }), '');
  assert.deepEqual(ctx, { ip: '9.9.9.9', ua: 'B' });
});
