import { debounce } from './debounce';
import { vi, it, expect, beforeEach } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('window', { setTimeout });
});

it('debounce a function', () => {
  const mockFn = vi.fn();
  const debouncedFn = debounce(mockFn, 100);

  debouncedFn();
  debouncedFn();
  debouncedFn();

  expect(mockFn).not.toHaveBeenCalled();

  vi.advanceTimersByTime(100);

  expect(mockFn).toHaveBeenCalledTimes(1);
});

it('passe arguments to the debounced function', () => {
  const mockFn = vi.fn();
  const debouncedFn = debounce(mockFn, 100);

  debouncedFn('arg1', 'arg2');

  vi.advanceTimersByTime(100);

  expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
});

it('reset the timer if called again within the duration', () => {
  const mockFn = vi.fn();
  const debouncedFn = debounce(mockFn, 100);

  debouncedFn();
  vi.advanceTimersByTime(50);

  debouncedFn();
  vi.advanceTimersByTime(50);

  debouncedFn();
  vi.advanceTimersByTime(50);

  expect(mockFn).not.toHaveBeenCalled();
  vi.advanceTimersByTime(50);

  expect(mockFn).toHaveBeenCalledTimes(1);
});
