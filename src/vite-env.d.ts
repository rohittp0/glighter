/// <reference types="vite/client" />

declare module '*.geojson' {
  const value: unknown;
  export default value;
}

interface ImportMetaEnv {
  readonly VITE_MAPTILER_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
