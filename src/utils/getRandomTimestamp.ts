export function getRandomTimestamp(minHours = -240, maxHours = 0) {
  // Get current timestamp
  const now = new Date();

  // Calculate range in milliseconds
  const minMs = minHours * 60 * 60 * 1000;
  const maxMs = maxHours * 60 * 60 * 1000;

  // Generate random number of milliseconds within range
  const randomMs = Math.floor(Math.random() * (maxMs - minMs + 1) + minMs);

  // Add random milliseconds to current time
  return new Date(now.getTime() + randomMs);
}
