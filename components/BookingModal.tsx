import React, { useState, useEffect } from 'react';
import { CLASSES } from '../constants';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  slotInfo: { day: string; time: string; date: string; room: string } | null;
  isSubmitting: boolean;
  teachers: string[];
  subjects: string[];
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onSubmit, slotInfo, isSubmitting, teachers, subjects }) => {
  const [teacher, setTeacher] = useState('');
  const [cls, setCls] = useState('');
  const [subject, setSubject] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if(isOpen) {
        let lastUsed: any = {};
        try {
          lastUsed = JSON.parse(localStorage.getItem('lastBookingDetails') || '{}');
        } catch (e) {
          lastUsed = {};
        }
        
        setTeacher(lastUsed.teacherName || '');
        setCls(lastUsed.className || '');
        setSubject(lastUsed.subject || '');
        setPassword('');
    }
  }, [isOpen]);

  if (!isOpen || !slotInfo) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teacher && cls && subject && password) {
      localStorage.setItem('lastBookingDetails', JSON.stringify({ teacherName: teacher, className: cls, subject }));
      onSubmit({ teacherName: teacher, className: cls, subject, password });
    } else {
        alert("Sila lengkapkan semua maklumat.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-blue-800 text-white p-4">
          <h3 className="text-lg font-bold">Tempah Slot</h3>
          <p className="text-sm opacity-90">{slotInfo.room} | {slotInfo.day} | {slotInfo.time} | {slotInfo.date}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Guru</label>
            <select 
              value={teacher} 
              onChange={(e) => setTeacher(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih Guru</option>
              {teachers.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
            <select 
              value={cls} 
              onChange={(e) => setCls(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih Kelas</option>
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subjek / Tujuan</label>
            <select 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih Subjek</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kata Laluan</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Masukkan kata laluan untuk padam"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sedang Proses...' : 'Sahkan Tempahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;