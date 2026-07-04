/// <reference types="vite/client" />

// Some environments in this repo may be missing React type packages.
// Provide minimal type shims so the app compiles and runs.

declare module 'react' {
  const React: any;
  export default React;
  export const useMemo: any;
  export const useState: any;
  export const useEffect: any;
  export type FormEvent<T = any> = any;
  export const StrictMode: any;
}

declare module 'react/jsx-runtime';

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

