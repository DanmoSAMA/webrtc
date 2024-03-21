import { it, expect, describe, vi, beforeEach } from 'vitest';
import { useGoto } from './hook';
import { useNavigate } from 'react-router-dom';

vi.mock('react-router-dom');

const navigateFn = vi.fn();

vi.mocked(useNavigate).mockImplementation(() => {
  return navigateFn;
});

describe('LeftDropdown', () => {
  beforeEach(() => {
    navigateFn.mockClear();
  });

  it('should go to private page', () => {
    const { gotoPrivate } = useGoto();

    gotoPrivate();

    expect(navigateFn).toBeCalledWith('/private');
  });

  it('should go to group page', () => {
    const { gotoGroup } = useGoto();

    gotoGroup();

    expect(navigateFn).toBeCalledWith('/group');
  });
});
