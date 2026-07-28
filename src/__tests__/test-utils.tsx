import React, { ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { FundProvider, useFund } from '../context/FundContext';

export function createWrapper() {
  localStorage.clear();
  return function Wrapper({ children }: { children: ReactNode }) {
    return <FundProvider>{children}</FundProvider>;
  };
}

export function renderFundHook() {
  return renderHook(() => useFund(), { wrapper: createWrapper() });
}
