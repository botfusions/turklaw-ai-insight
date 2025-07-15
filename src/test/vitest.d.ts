/// <reference types="vitest" />
/// <reference types="vite/client" />

import { vi } from 'vitest';

declare global {
  const vi: typeof import('vitest').vi;
}