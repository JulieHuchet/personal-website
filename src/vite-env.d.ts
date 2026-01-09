/// <reference types="vite/client" />

interface ImportMetaEnv {
  // No environment variables needed - authentication handled by Cloudflare Access
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
