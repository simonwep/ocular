import { subtract, add, remove, sum, average, aggregate, arrayify, rollingAverage, moveInArrays } from './array';
import { it, expect } from 'vitest';

it('subtract arrays', () => {
  expect(subtract([5, 10, 15], [1, 2, 3])).toEqual([4, 8, 12]);
});

it('add arrays', () => {
  expect(add([1, 2, 3], [4, 5, 6])).toEqual([5, 7, 9]);
});

it('remove an item from an array', () => {
  const arr = [1, 2, 3, 4];
  remove(arr, 3);
  expect(arr).toEqual([1, 2, 4]);
});

it('remove an item from an array using a predicate', () => {
  const arr = [1, 2, 3, 4];
  remove(arr, (v) => v === 3);
  expect(arr).toEqual([1, 2, 4]);
});

it('sum an array of numbers', () => {
  expect(sum([1, 2, 3, 4])).toBe(10);
});

it('calculate the average of an array of numbers', () => {
  expect(average([1, 2, 3, 4])).toBe(2.5);
});

it('aggregate an array of numbers', () => {
  expect(aggregate([1, 2, 3, 4])).toEqual([1, 3, 6, 10]);
});

it('arrayify a value', () => {
  expect(arrayify(1)).toEqual([1]);
  expect(arrayify([1, 2, 3])).toEqual([1, 2, 3]);
});

it('calculate the rolling average of an array of numbers', () => {
  expect(rollingAverage([1, 2, 3, 4, 5], 3)).toEqual([1, 1.5, 2, 3, 4]);
});

it('move an item between arrays', () => {
  const list1 = [{ id: 'a' }, { id: 'b' }];
  const list2 = [{ id: 'c' }, { id: 'd' }];
  const sources = [list1, list2];

  moveInArrays(sources, 'a', 'd');
  expect(list1).toEqual([{ id: 'b' }]);
  expect(list2).toEqual([{ id: 'c' }, { id: 'a' }, { id: 'd' }]);
});

it('append an item between arrays', () => {
  const list1 = [{ id: 'a' }, { id: 'b' }];
  const list2 = [{ id: 'c' }, { id: 'd' }];
  const sources = [list1, list2];

  moveInArrays(sources, 'a', 'd', true);
  expect(list1).toEqual([{ id: 'b' }]);
  expect(list2).toEqual([{ id: 'c' }, { id: 'd' }, { id: 'a' }]);
});
