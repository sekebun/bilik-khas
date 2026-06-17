import React, { useState, useEffect } from 'react';
import { Booking } from '../types';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (booking: Booking, password: string) => void;
  booking: Booking | null;
  isSubmitting: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onSubmit, booking, isSubmitting }) => {
  const [password, setPassword] = useState('');

  useEffect(() => {
      if(isOpen) setPassword('');
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(booking, password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
        <div className="bg-red-600 text-white p-4">
          <h3 className="text-lg font-bold">Padam Tempahan</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-700">Sila masukkan kata laluan untuk memadam tempahan <strong>{booking.teacherName}</strong> pada <strong>{booking.dayOfWeek} ({booking.timeSlot})</strong>.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kata Laluan</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
              required
              placeholder="Masukkan kata laluan semasa tempahan"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200" disabled={isSubmitting}>Batal</button>
            <button type="submit" className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50" disabled={isSubmitting}>
              {isSubmitting ? 'Memadam...' : 'Padam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteModal;
