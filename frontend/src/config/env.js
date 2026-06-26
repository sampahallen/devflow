const requiredEnv = (key) => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing frontend environment variable: ${key}`);
  }
  return value;
};

export const env = {
  appName: requiredEnv("VITE_APP_NAME"),
  apiUrl: requiredEnv("VITE_API_URL"),
  authEnabled: import.meta.env.VITE_AUTH_ENABLED === "true"
};
