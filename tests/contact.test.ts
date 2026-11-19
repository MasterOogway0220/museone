import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validate } from '../api/contact.ts'

const good = { name: 'Ada', email: 'ada@example.com', message: 'We need a new website.', services: ['SEO', 'Websites'] }

test('accepts a valid message', () => {
  const r = validate(good)
  assert.equal(r.ok, true)
})

test('rejects bad email, short message, missing name', () => {
  const r = validate({ ...good, name: ' ', email: 'nope', message: 'hi' })
  assert.deepEqual(r.ok ? [] : r.errors, ['name', 'email', 'message'])
})

test('flags the honeypot', () => {
  const r = validate({ ...good, website: 'http://spam' })
  assert.ok(!r.ok && r.errors.includes('spam'))
})

test('drops unknown services and non-objects, strips newlines from name', () => {
  const r = validate({ ...good, name: 'Ada\r\nBcc: x', services: ['SEO', 'Hacking', 7, 'SEO'] })
  assert.ok(r.ok)
  if (r.ok) {
    assert.deepEqual(r.value.services, ['SEO'])
    assert.equal(r.value.name, 'Ada Bcc: x')
  }
  assert.equal(validate(null).ok, false)
  assert.equal(validate('x').ok, false)
})
