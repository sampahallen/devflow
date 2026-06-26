export function compactPayload(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== "" && value !== undefined && value !== null && !Number.isNaN(value))
  );
}
