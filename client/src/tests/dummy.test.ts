import { expect, test } from 'vitest'

const sum = function (a: number, b: number): Number {
    return a + b
}

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})