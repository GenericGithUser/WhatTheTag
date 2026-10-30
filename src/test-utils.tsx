import React from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Mock Router wrapper for tests
const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div data-testid="router-wrapper">{children}</div>;
};

// Custom render function with Router context
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: RouterWrapper, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };
