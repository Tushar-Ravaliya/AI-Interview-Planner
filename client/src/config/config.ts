if (!import.meta.env.VITE_API_BASE_URL) {
  console.error("API Base URL is not defined");
}

export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
};
