import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const port = Number(env.VITE_DEV_SERVER_PORT);

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: env.VITE_DEV_SERVER_HOST,
      port: Number.isFinite(port) ? port : undefined,
      proxy: {
        "/api": env.VITE_DEV_PROXY_TARGET
      }
    }
  };
});
