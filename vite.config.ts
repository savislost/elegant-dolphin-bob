import { defineConfig, loadEnv } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load env from .env files (empty prefix = load all keys, including non-VITE_ ones)
  const env = loadEnv(mode, process.cwd(), "");

  // Resolve the Groq key from a VITE_-prefixed var, a plain GROQ_API_KEY in the
  // env files, or the dev server's process.env (used in the v0 preview).
  const groqApiKey =
    env.VITE_GROQ_API_KEY ||
    env.GROQ_API_KEY ||
    process.env.VITE_GROQ_API_KEY ||
    process.env.GROQ_API_KEY ||
    "";

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [dyadComponentTagger(), react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Inject the real Groq key so import.meta.env.VITE_GROQ_API_KEY resolves
      // to the actual value at dev/build time.
      "import.meta.env.VITE_GROQ_API_KEY": JSON.stringify(groqApiKey),
    },
  };
});
