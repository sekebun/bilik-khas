import { DAYS_OF_WEEK, TEACHER_COLOR_MAP, DEFAULT_COLOR_PALETTE, normalizeTeacherName } from './constants';

export const getContrastTextColor = (hex: string): { text: string; subText: string } => {
  if (!hex) return { text: '#111827', subText: '#374151' };
  let c = hex.replace('#', '').trim();
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  
  // YIQ formula for perceived brightness
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  if (yiq >= 140) {
    return { text: '#111827', subText: '#374151' };
  } else {
    return { text: '#ffffff', subText: '#f3f4f6' };
  }
};

export const getBorderColor = (hex: string): string => {
  if (!hex) return '#3b82f6';
  let c = hex.replace('#', '').trim();
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return '#1d4ed8';
  const r = Math.max(0, Math.min(255, (num >> 16) - 35));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) - 35));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) - 35));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export const stringToColor = (str: string, dynamicColors?: Record<string, string>): string => {
  if (!str) return '#3b82f6';
  const key = normalizeTeacherName(str);
  
  if (dynamicColors) {
    if (dynamicColors[key]) return dynamicColors[key];
    if (dynamicColors[str]) return dynamicColors[str];
  }

  if (TEACHER_COLOR_MAP[key]) {
    return TEACHER_COLOR_MAP[key];
  }
  if (TEACHER_COLOR_MAP[str]) {
    return TEACHER_COLOR_MAP[str];
  }

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % DEFAULT_COLOR_PALETTE.length;
  return DEFAULT_COLOR_PALETTE[index];
};

export const stringToBorderColor = (str: string, dynamicColors?: Record<string, string>): string => {
  const bg = stringToColor(str, dynamicColors);
  return getBorderColor(bg);
};

export const getTeacherStyles = (teacherName: string, dynamicColors?: Record<string, string>) => {
  const bgColor = stringToColor(teacherName, dynamicColors);
  const textColors = getContrastTextColor(bgColor);
  const borderColor = getBorderColor(bgColor);

  return {
    backgroundColor: bgColor,
    borderColor: borderColor,
    color: textColors.text,
    subTextColor: textColors.subText,
  };
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