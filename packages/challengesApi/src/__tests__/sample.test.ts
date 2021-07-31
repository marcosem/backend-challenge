function sum(a: number, b: number) {
  return a + b;
}

it('Sum 4 + 5 should return 9', () => {
  const result = sum(4, 5);

  expect(result).toBe(9);
});
