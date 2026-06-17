export interface Booking {
  id: string;
  room: string;
  teacherName: string;
  className: string;
  subject: string;
  timeSlot: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  weekId: string;
  createdAt: string;
  password?: string;
}

export interface PermanentBooking {
  day: string; // 'ISNIN', 'SELASA', etc.
  slots: string[]; // List of affected slots
  teacherName: string;
  className?: string;
  subject?: string;
  room: string;
}

export enum RoomType {
  MAKMAL_KOMPUTER = 'MAKMAL KOMPUTER',
  BILIK_TAYANGAN = 'BILIK TAYANGAN',
  BILIK_MESYUARAT = 'BILIK MESYUARAT'
}

export interface SlotData {
  time: string;
  isPermanent: boolean;
  permanentDetails?: PermanentBooking;
  booking?: Booking;
}