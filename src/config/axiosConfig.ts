const config: Record<string, string> = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  aiBaseUrl: import.meta.env.VITE_AI_BASE_URL,
};

if (!config.apiBaseUrl) {
  console.warn("⚠️ VITE_API_BASE_URL is not defined!");
}

export default config;
