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