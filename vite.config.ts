import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/** Serves the Vercel function in api/chat.ts during `npm run dev`, so the assistant works locally. */
function devApi(): Plugin {
  return {
    name: "dev-api-chat",
    configureServer(server) {
      server.middlewares.use("/api/chat", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end();
          return;
        }
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const headers = new Headers();
        for (const [k, v] of Object.entries(req.headers)) if (v !== undefined) headers.set(k, Array.isArray(v) ? v.join(", ") : v);
        const mod = await server.ssrLoadModule("/api/chat.ts");
        const response: Response = await mod.POST(new Request("http://localhost/api/chat", { method: "POST", headers, body: Buffer.concat(chunks) }));
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        if (response.body) {
          const reader = response.body.getReader();
          for (let r = await reader.read(); !r.done; r = await reader.read()) res.write(r.value);
        }
        res.end();
      });
    },
  };
}

// https://vitejs.dev/config/
// Note: lovable-tagger's componentTagger was removed — it injects `data-lov-*`
// props into JSX, which React Three Fiber interprets as nested object paths and crashes on.
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), devApi()],
  build: {
    rollupOptions: {
      output: {
        // Stable vendor chunks cache across deploys; app code changes more often.
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-motion": ["framer-motion", "lenis"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
