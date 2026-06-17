import React, { useState, useEffect, useCallback } from 'react';
import { SCHOOL_LOGO, DAYS_OF_WEEK, TIME_SLOTS, PERMANENT_BOOKINGS } from './constants';
import { Booking, RoomType } from './types';
import { getMonday, addDays, formatDate, formatDateForISO, stringToColor, stringToBorderColor, isBookingAllowed, getDayDate, normalizeDate, getMalaysiaDate } from './utils';
import { fetchBookings, createBookingWithResponse, fetchTeachersAndSubjects, deleteBookingWithResponse } from './services/api';
import BookingModal from './components/BookingModal';
import DeleteModal from './components/DeleteModal';

function App() {
  // Use getMalaysiaDate() to ensure the calendar is based on KL time, not local browser time
  const [currentWeekMonday, setCurrentWeekMonday] = useState(getMonday(getMalaysiaDate()));
  const [selectedRoom, setSelectedRoom] = useState<RoomType>(RoomType.MAKMAL_KOMPUTER);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [teachers, setTeachers] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string; date: string; room: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBookingToDelete, setSelectedBookingToDelete] = useState<Booking | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    const [data, teachersAndSubjects] = await Promise.all([
      fetchBookings(),
      fetchTeachersAndSubjects()
    ]);
    setBookings(data);
    setTeachers(teachersAndSubjects.teachers);
    setSubjects(teachersAndSubjects.subjects);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handlePrevWeek = () => setCurrentWeekMonday(prev => addDays(prev, -7));
  const handleNextWeek = () => setCurrentWeekMonday(prev => addDays(prev, 7));
  const handleCurrentWeek = () => setCurrentWeekMonday(getMonday(getMalaysiaDate()));

  const handleSlotClick = (dayIndex: number, timeSlot: string) => {
    const dateOfSlot = getDayDate(currentWeekMonday, dayIndex);
    const dateStr = formatDateForISO(dateOfSlot);
    const dayName = DAYS_OF_WEEK[dayIndex];

    // Check if slot is occupied
    const isOccupied = checkIsOccupied(dayName, timeSlot, dateStr);
    if (isOccupied) {
      alert("Slot ini telah ditempah atau dikhaskan.");
      return;
    }

    // Check availability rules
    const validation = isBookingAllowed(dateOfSlot);
    if (!validation.allowed) {
      alert(validation.reason);
      return;
    }

    setSelectedSlot({
      day: dayName,
      time: timeSlot,
      date: formatDate(dateOfSlot), // Display format
      room: selectedRoom
    });
    setIsModalOpen(true);
  };

  const checkIsOccupied = (day: string, time: string, dateISO: string) => {
    // 1. Check Permanent
    const perm = PERMANENT_BOOKINGS.find(p => p.room === selectedRoom && p.day === day && p.slots.includes(time));
    if (perm) return { type: 'permanent', data: perm };

    // 2. Check Adhoc Bookings
    const booking = bookings.find(b => 
      b.room === selectedRoom && 
      b.timeSlot === time && 
      normalizeDate(b.date) === dateISO
    );
    
    if (booking) return { type: 'booking', data: booking };

    return null;
  };

  const handleBookingSubmit = async (formData: { teacherName: string; className: string; subject: string }) => {
    if (!selectedSlot) return;

    setIsSubmitting(true);
    
    const dayIndex = DAYS_OF_WEEK.indexOf(selectedSlot.day);
    const dateObj = getDayDate(currentWeekMonday, dayIndex);
    const dateISO = formatDateForISO(dateObj);

    const newBooking: Booking = {
      id: `${Date.now()}`,
      room: selectedRoom,
      teacherName: formData.teacherName,
      className: formData.className,
      subject: formData.subject,
      password: formData.password,
      timeSlot: selectedSlot.time,
      date: dateISO, // Save as YYYY-MM-DD
      dayOfWeek: selectedSlot.day,
      weekId: `${getMonday(dateObj).getTime()}`,
      createdAt: new Date().toISOString()
    };

    const result = await createBookingWithResponse(newBooking);

    if (result.success) {
      alert("Tempahan berjaya!");
      setBookings(prev => [...prev, newBooking]);
      setIsModalOpen(false);
    } else {
      alert("Tempahan gagal: " + result.message);
    }
    setIsSubmitting(false);
  };

  const handleDeleteClick = (booking: Booking) => {
    setSelectedBookingToDelete(booking);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubmit = async (booking: Booking, password?: string) => {
    setIsDeleting(true);
    
    if (booking.password && booking.password !== password) {
       alert("Kata laluan salah.");
       setIsDeleting(false);
       return;
    }

    const result = await deleteBookingWithResponse(booking.id, password);

    if (result.success) {
      alert("Tempahan berjaya dipadam!");
      setBookings(prev => prev.filter(b => b.id !== booking.id));
      setIsDeleteModalOpen(false);
    } else {
      alert("Padam gagal: " + result.message);
    }
    setIsDeleting(false);
  };

  const renderCell = (dayIndex: number, time: string) => {
    const dayName = DAYS_OF_WEEK[dayIndex];
    const dateOfSlot = getDayDate(currentWeekMonday, dayIndex);
    const dateISO = formatDateForISO(dateOfSlot);
    const occupied = checkIsOccupied(dayName, time, dateISO);

    if (occupied) {
      if (occupied.type === 'permanent') {
        const p = occupied.data as any;
        const bgColor = stringToColor(p.teacherName);
        const borderColor = stringToBorderColor(p.teacherName);
        
        const displayClass = p.className || '';
        const displaySubject = p.subject || '';
        const bottomText = [displayClass, displaySubject].filter(Boolean).join(' - ');

        return (
          <div 
            className="w-full h-full p-1 text-xs border-l-4 overflow-hidden shadow-sm flex flex-col justify-center"
            style={{ backgroundColor: bgColor, borderColor: borderColor }}
          >
            <p className="font-bold text-gray-800 truncate" title={p.teacherName}>{p.teacherName}</p>
            <p className="text-gray-700 truncate">{bottomText}</p>
          </div>
        );
      } else {
        const b = occupied.data as Booking;
        const bgColor = stringToColor(b.teacherName);
        const borderColor = stringToBorderColor(b.teacherName);
        return (
          <div 
            onClick={() => handleDeleteClick(b)}
            className="w-full h-full p-1 text-xs border-l-4 overflow-hidden shadow-sm flex flex-col justify-center cursor-pointer group"
            style={{ backgroundColor: bgColor, borderColor: borderColor }}
            title="Klik untuk padam tempahan"
          >
            <p className="font-bold text-gray-800 truncate" title={b.teacherName}>{b.teacherName}</p>
            <p className="text-gray-700 truncate">{b.className} - {b.subject}</p>
          </div>
        );
      }
    }

    return (
      <button 
        onClick={() => handleSlotClick(dayIndex, time)}
        className="w-full h-full hover:bg-green-50 text-green-700 text-xs font-medium flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
      >
        + Tempah
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-blue-900 pb-10">
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex flex-col items-center text-center">
          <img src={SCHOOL_LOGO} alt="Logo SKTK" className="h-24 w-auto mb-2" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 uppercase tracking-wide">Sekolah Kebangsaan Tanah Kebun</h1>
          <p className="text-gray-600 text-sm md:text-base">34200 Parit Buntar, Perak Darul Ridzuan.</p>
        </div>
      </div>

      <div className="bg-blue-800 py-4 shadow-inner">
        <h2 className="text-center text-white text-xl md:text-3xl font-bold tracking-wider">SISTEM E-TEMPAH BILIK KHAS</h2>
      </div>

      <div className="container mx-auto px-2 md:px-4 mt-6">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {Object.values(RoomType).map((room) => (
                <button
                  key={room}
                  onClick={() => setSelectedRoom(room)}
                  className={`px-4 py-2 rounded-md text-sm md:text-base font-medium transition-all ${
                    selectedRoom === room 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {room}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handlePrevWeek} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
                &lt; Mggu Lepas
              </button>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase font-bold">Minggu</p>
                <p className="font-bold text-blue-900">{formatDate(currentWeekMonday)} - {formatDate(addDays(currentWeekMonday, 4))}</p>
              </div>
              <button onClick={handleNextWeek} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
                Mggu Depan &gt;
              </button>
              <button onClick={handleCurrentWeek} className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm">
                Kini
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {loading ? (
             <div className="p-10 text-center text-gray-500">Memuat turun data tempahan...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 bg-gray-800 text-white border-b w-24 sticky left-0 z-10">Masa / Hari</th>
                    {DAYS_OF_WEEK.map((day, index) => {
                      const date = getDayDate(currentWeekMonday, index);
                      const isToday = formatDateForISO(date) === formatDateForISO(getMalaysiaDate());
                      return (
                        <th key={day} className={`p-3 text-center border-l border-b border-gray-300 w-1/5 ${isToday ? 'bg-blue-50' : 'bg-gray-100'}`}>
                          <div className="font-bold text-gray-800">{day}</div>
                          <div className="text-xs text-gray-500 font-normal">{formatDate(date)}</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map((time, timeIndex) => (
                    <tr key={time} className={timeIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-2 text-center text-xs font-bold text-gray-600 border-r border-gray-200 sticky left-0 bg-inherit z-10">
                        {time}
                      </td>
                      {DAYS_OF_WEEK.map((day, dayIndex) => (
                        <td key={`${day}-${time}`} className="border border-gray-200 h-16 relative align-top transition-colors hover:bg-blue-50">
                          {renderCell(dayIndex, time)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center text-white text-sm opacity-70 pb-4">
          &copy; {new Date().getFullYear()} Sekolah Kebangsaan Tanah Kebun. Hak Cipta Terpelihara.
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleBookingSubmit}
        slotInfo={selectedSlot}
        isSubmitting={isSubmitting}
        teachers={teachers}
        subjects={subjects}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSubmit={handleDeleteSubmit}
        booking={selectedBookingToDelete}
        isSubmitting={isDeleting}
      />
    </div>
  );
}

export default App;