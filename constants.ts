import { PermanentBooking, RoomType } from './types';

export const API_URL = "https://script.google.com/macros/s/AKfycbw4Vnf9wjmoTLI3CsluFooq8g0wioJS6Uyyo38MVIuzAmQxiK3ProSUTOaQFe0xdOpJeg/exec";

export const SCHOOL_LOGO = "https://i.postimg.cc/85t7Jtgb/LOGO-SEKOLAH-SKTK-removebg-preview.png";

export const DAYS_OF_WEEK = ['ISNIN', 'SELASA', 'RABU', 'KHAMIS', 'JUMAAT'];

export const TIME_SLOTS = [
  "7.40-8.10",
  "8.10-8.40",
  "8.40-9.10",
  "9.10-9.40",
  "9.40-10.10",
  "10.10-10.30",
  "10.30-11.00",
  "11.00-11.30",
  "11.30-12.00",
  "12.00-12.30",
  "12.30-1.00",
  "1.00-1.30"
];

export const CLASSES = [
  "PRA AL-IKHLAS", "PRA AL-FALAQ", "PRA AN-NAS",
  "1 AL-IKHLAS", "1 AL-FALAQ", "1 AN-NAS",
  "2 AL-IKHLAS", "2 AL-FALAQ", "2 AN-NAS",
  "3 AL-IKHLAS", "3 AL-FALAQ",
  "4 AL-IKHLAS", "4 AL-FALAQ", "4 AN-NAS",
  "5 AL-IKHLAS", "5 AL-FALAQ",
  "6 AL-IKHLAS", "6 AL-FALAQ", "6 AN-NAS",
  "LAIN-LAIN"
];

// Mapping logic for Permanent Bookings
// Note: We map wide ranges (e.g. 11.30-12.30) to the specific 30min slots used in the app.
export const PERMANENT_BOOKINGS: PermanentBooking[] = [];

export interface TeacherColorConfig {
  name: string;
  color: string;
  label: string;
}

export const TEACHER_COLOR_CONFIG: TeacherColorConfig[] = [
  { name: "SHAMELA BINTI MAT ARIFFIN", color: "#FF0000", label: "Merah (Red)" },
  { name: "SITI SANISAH BINTI HUSAIN", color: "#800000", label: "Merah Hati (Maroon)" },
  { name: "FARIDAH BINTI HAMZAH", color: "#DC143C", label: "Merah Darah (Crimson)" },
  { name: "NOR ATIKAH BINTI HASSAN", color: "#FF69B4", label: "Merah Jambu (Hot Pink)" },
  { name: "AMIRUL FAHMI BIN YUSUP", color: "#FFC0CB", label: "Merah Jambu Cerah (Pink)" },
  { name: "AQEELA BINTI ALIAH", color: "#E0115F", label: "Merah Delima (Ruby)" },
  { name: "ELIANE BINTI AZMI", color: "#0000FF", label: "Biru (Blue)" },
  { name: "EMYLIA FARHAN BINTI MOHAMAD YUSOF", color: "#000080", label: "Biru Gelap (Navy Blue)" },
  { name: "FALIZAH BINTI MOHAMAD ARSHAD", color: "#87CEEB", label: "Biru Langit (Sky Blue)" },
  { name: "HAYATI BINTI RAMLI", color: "#00FFFF", label: "Biru Sian (Cyan)" },
  { name: "IDAHTUL ARRSHYUL NA’AIEM BINTI ABDUL RAHMAN", color: "#4682B4", label: "Biru Besi (Steel Blue)" },
  { name: "KHAIRUL HAFFIZ BIN AZIZAN", color: "#1E90FF", label: "Biru Terang (Dodger Blue)" },
  { name: "MAHANUM BINTI MOKHTAR", color: "#008000", label: "Hijau (Green)" },
  { name: "MOHAMED ZAMRI BIN SALLEH", color: "#00FF00", label: "Hijau Terang (Lime)" },
  { name: "MOHD ZAHARI BIN ISHAK", color: "#556B2F", label: "Hijau Zaitun (Olive)" },
  { name: "MUHAMAD ANAS BIN MOHD AMRAN", color: "#2E8B57", label: "Hijau Laut (Sea Green)" },
  { name: "NADHATUL AKMA BINTI ZAINAL", color: "#00FE81", label: "Hijau Pudina (Mint Green)" },
  { name: "NAIMAH BINTI MOHD NOH", color: "#004725", label: "Hijau Zamrud (Emerald Green)" },
  { name: "NOOR HAFIZAH BINTI OTHMAN", color: "#FFFF00", label: "Kuning (Yellow)" },
  { name: "NOORSUZANA BINTI NORDIN", color: "#FFD700", label: "Kuning Emas (Gold)" },
  { name: "NOR AZIDAH BINTI MOHAMAD", color: "#FFA500", label: "Jingga (Orange)" },
  { name: "NOR MAIZANNI BINTI KHALIDI", color: "#FF4500", label: "Jingga Merah (Orange Red)" },
  { name: "NORAIN BINTI ISMAIL", color: "#FF8C00", label: "Jingga Gelap (Dark Orange)" },
  { name: "NORYANA BINTI ABDUL RAZAK", color: "#F0E68C", label: "Kuning Khaki (Khaki)" },
  { name: "NORZITA BINTI MAKHTAR", color: "#800080", label: "Ungu (Purple)" },
  { name: "NURAFIFAH ALIA BINTI ANUAR", color: "#E6E6FA", label: "Ungu Lavender (Lavender)" },
  { name: "NURUL ASHIKIN BINTI KHALIDI", color: "#4B0082", label: "Ungu Nila (Indigo)" },
  { name: "NURUL HUSNA BINTI ISMAIL", color: "#8A2BE2", label: "Ungu Biru (Blue Violet)" },
  { name: "NUR SYAFIQAH BINTI MOHD HASRI", color: "#DA70D6", label: "Ungu Orkid (Orchid)" },
  { name: "ROHAIDA BINTI MD ALI", color: "#9932CC", label: "Ungu Gelap (Dark Orchid)" },
  { name: "ROHAYA BINTI IBERAHIM", color: "#A52A2A", label: "Coklat (Brown)" },
  { name: "ROSLAN BIN IBRAHIM", color: "#D2691E", label: "Coklat Cokelat (Chocolate)" },
  { name: "ROZAINI BT TAJON AROS", color: "#F5F5DC", label: "Krim (Beige)" },
  { name: "SITI BALQIS BINTI ABDUL RAJI", color: "#8B4513", label: "Coklat Pelana (Saddle Brown)" },
  { name: "SITI MARHAMAH BINTI MUHAMMAD", color: "#CD853F", label: "Coklat Kayu (Peru)" },
  { name: "LAIN-LAIN / GURU GANTI", color: "#DEB887", label: "Coklat Cerah (Burlywood)" },
];

export const normalizeTeacherName = (name: string): string => {
  return (name || '')
    .trim()
    .toUpperCase()
    .replace(/[\u2018\u2019']/g, "'")
    .replace(/\s+/g, ' ');
};

export const TEACHER_COLOR_MAP: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const item of TEACHER_COLOR_CONFIG) {
    const key = normalizeTeacherName(item.name);
    map[key] = item.color;
    // Also store exact raw name
    map[item.name] = item.color;
  }
  return map;
})();

export const DEFAULT_COLOR_PALETTE = [
  "#FF0000", "#800000", "#DC143C", "#FF69B4", "#FFC0CB", "#E0115F",
  "#0000FF", "#000080", "#87CEEB", "#00FFFF", "#4682B4", "#1E90FF",
  "#008000", "#00FF00", "#556B2F", "#2E8B57", "#00FE81", "#004725",
  "#FFFF00", "#FFD700", "#FFA500", "#FF4500", "#FF8C00", "#F0E68C",
  "#800080", "#E6E6FA", "#4B0082", "#8A2BE2", "#DA70D6", "#9932CC",
  "#A52A2A", "#D2691E", "#F5F5DC", "#8B4513", "#CD853F", "#DEB887"
];