import { DAYS_OF_WEEK } from './constants';

const COLOR_PALETTE = [
  { bg: "#fee2e2", border: "#dc2626" }, // Red
  { bg: "#ffedd5", border: "#ea580c" }, // Orange
  { bg: "#fef3c7", border: "#d97706" }, // Amber
  { bg: "#fef9c3", border: "#ca8a04" }, // Yellow
  { bg: "#ecfccb", border: "#65a30d" }, // Lime
  { bg: "#dcfce7", border: "#16a34a" }, // Green
  { bg: "#d1fae5", border: "#059669" }, // Emerald
  { bg: "#ccfbf1", border: "#0d9488" }, // Teal
  { bg: "#cffafe", border: "#0891b2" }, // Cyan
  { bg: "#e0f2fe", border: "#0284c7" }, // Sky
  { bg: "#dbeafe", border: "#2563eb" }, // Blue
  { bg: "#e0e7ff", border: "#4f46e5" }, // Indigo
  { bg: "#ede9fe", border: "#7c3aed" }, // Violet
  { bg: "#fae8ff", border: "#c026d3" }, // Fuchsia
  { bg: "#fce7f3", border: "#db2777" }, // Pink
  { bg: "#ffe4e6", border: "#e11d48" }, // Rose
];

const getColorObj = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
};

export const stringToColor = (str: string) => {
  return getColorObj(str).bg;
};

export const stringToBorderColor = (str: string) => {
    return getColorObj(str).border;
  };

// --- TIMEZONE UTILS (Malaysia GMT+8) ---

// Returns a Date object where the UTC components correspond to Malaysia Time
export const getMalaysiaDate = (): Date => {
  const now = new Date();
  // UTC+8 = 8 hours * 60 mins * 60 secs * 1000 ms
  return new Date(now.getTime() + (8 * 60 * 60 * 1000));
};

export const getMonday = (d: Date): Date => {
  const date = new Date(d);
  const day = date.getUTCDay(); // Use UTC methods as our Date object is shifted
  const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1);
  const newDate = new Date(date);
  newDate.setUTCDate(diff);
  newDate.setUTCHours(0,0,0,0);
  return newDate;
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

export const formatDate = (date: Date): string => {
  const d = date.getUTCDate();
  const m = date.getUTCMonth() + 1;
  const y = date.getUTCFullYear();
  return `${d < 10 ? '0' + d : d}/${m < 10 ? '0' + m : m}/${y}`;
};

export const formatDateForISO = (date: Date): string => {
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth() + 1;
    const d = date.getUTCDate();
    return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
}

// Convert any date string (ISO/UTC from API) to Malaysia Date string (YYYY-MM-DD)
export const normalizeDate = (dateStr: string): string => {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  // Add 8 hours to the timestamp to shift UTC to MYT
  const mytOffset = 8 * 60 * 60 * 1000;
  const shiftedDate = new Date(date.getTime() + mytOffset);
  
  return formatDateForISO(shiftedDate);
}

export const isBookingAllowed = (targetDate: Date): { allowed: boolean; reason?: string } => {
  const today = getMalaysiaDate();
  const todayMonday = getMonday(today);
  const targetMonday = getMonday(targetDate);

  if (targetMonday.getTime() < todayMonday.getTime()) {
    return { allowed: false, reason: "Tidak boleh menempah untuk tarikh yang telah lepas." };
  }

  if (targetMonday.getTime() === todayMonday.getTime()) {
      return { allowed: true };
  }

  const nextWeekMonday = addDays(todayMonday, 7);
  if (targetMonday.getTime() === nextWeekMonday.getTime()) {
      const dayOfWeek = today.getUTCDay(); // 0=Sun, 5=Fri, 6=Sat
      if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
          return { allowed: true };
      } else {
          return { allowed: false, reason: "Tempahan untuk minggu hadapan hanya dibuka bermula hari Jumaat minggu ini (12.00am)." };
      }
  }

  if (targetMonday.getTime() > nextWeekMonday.getTime()) {
      return { allowed: false, reason: "Tempahan hanya dibuka untuk minggu semasa dan minggu hadapan (bermula Jumaat)." };
  }

  return { allowed: true };
};

export const getDayDate = (monday: Date, dayIndex: number): Date => {
    return addDays(monday, dayIndex);
}