/**
 * Converts a human-readable time string (e.g., "2h30m", "1w2d3h4m5s") into total seconds.
 *
 * Supported units:
 * - `s` — seconds
 * - `m` — minutes
 * - `h` — hours
 * - `d` — days
 * - `w` — weeks
 *
 * @param input Time string
 * @returns Total seconds
 * @throws If input is invalid or contains unsupported units
 */
export function parseTimeToSeconds(input: string): number {
  const regex = /(\d+)([smhdw])/gi;

  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
    w: 60 * 60 * 24 * 7,
  };

  let totalSeconds = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    const multiplier = multipliers[unit];

    if (!multiplier) {
      throw new Error(`Unsupported time unit: ${unit}`);
    }

    totalSeconds += value * multiplier;
  }

  if (totalSeconds === 0) {
    throw new Error(`Invalid or empty time expression: "${input}"`);
  }

  return totalSeconds;
}

/**
 * Converts a number of seconds into a human-readable time string.
 *
 * Output format includes:
 * - `w` — weeks
 * - `d` — days
 * - `h` — hours
 * - `m` — minutes
 * - `s` — seconds
 *
 * Units with zero values are skipped.
 *
 * @param totalSeconds Number of seconds to convert
 * @returns Human-readable time string (e.g., "2h30m")
 */
export function formatSeconds(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0s";

  const units = [
    { label: "w", seconds: 60 * 60 * 24 * 7 },
    { label: "d", seconds: 60 * 60 * 24 },
    { label: "h", seconds: 60 * 60 },
    { label: "m", seconds: 60 },
    { label: "s", seconds: 1 },
  ];

  let remaining = totalSeconds;
  let result = "";

  for (const { label, seconds } of units) {
    const value = Math.floor(remaining / seconds);
    if (value > 0) {
      result += `${value}${label}`;
      remaining -= value * seconds;
    }
  }

  return result;
}
