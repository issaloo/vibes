const APP_SALT = 'violet-cipher-2026';
export const APP_PREFIX = 'glyphogram-v1';

export const getDateStringLA = (date = new Date()): string => {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(date);
};

export const buildDailySeed = (dateString: string) => `${APP_PREFIX}:${dateString}:${APP_SALT}`;

export const dateFromOffset = (offsetDays: number, from = new Date()) => {
  const d = new Date(from);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return getDateStringLA(d);
};
