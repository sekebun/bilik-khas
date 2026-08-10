import { API_URL, TIME_SLOTS } from '../constants';
import { Booking, PermanentBooking } from '../types';

export const fetchBookings = async (): Promise<Booking[]> => {
  try {
    const response = await fetch(`${API_URL}?action=get_bookings`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return [];
  }
};

export const fetchTeachersAndSubjects = async (): Promise<{ teachers: string[], subjects: string[] }> => {
  try {
    const csvUrl = "https://docs.google.com/spreadsheets/d/1HyFdXlr7Kawoxu5RKBUCXO1asDbw1lStYaRaMFSYysk/export?format=csv";
    const response = await fetch(csvUrl);
    if (!response.ok) throw new Error("Failed to fetch CSV");
    const csvText = await response.text();
    
    const lines = csvText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    // Skip header
    const dataLines = lines.slice(1);
    
    const teachers: string[] = [];
    const subjects: string[] = [];
    
    dataLines.forEach(line => {
      // Simple CSV parsing
      const parts: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          parts.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      parts.push(current);

      if (parts.length >= 1) {
        const teacher = parts[0].trim();
        if (teacher) teachers.push(teacher);
      }
      if (parts.length >= 2) {
        const subject = parts[1].trim();
        if (subject) subjects.push(subject);
      }
    });
    
    return {
      teachers: Array.from(new Set(teachers)).filter(Boolean),
      subjects: Array.from(new Set(subjects)).filter(Boolean)
    };
  } catch (error) {
    console.error("Failed to fetch teachers and subjects:", error);
    return { teachers: [], subjects: [] };
  }
};

function expandTimeRanges(input: string): string[] {
  const expanded: string[] = [];
  const parts = input.split(',').map(s => s.trim());
  
  for (const part of parts) {
    if (TIME_SLOTS.includes(part)) {
      expanded.push(part);
      continue;
    }
    
    const [start, end] = part.split('-').map(s => s.trim());
    let capturing = false;
    
    for (const slot of TIME_SLOTS) {
      const [slotStart, slotEnd] = slot.split('-');
      if (slotStart === start) {
        capturing = true;
      }
      if (capturing) {
        expanded.push(slot);
      }
      if (slotEnd === end) {
        capturing = false;
      }
    }
  }
  return expanded;
}

export const fetchPermanentBookings = async (): Promise<PermanentBooking[]> => {
  try {
    const csvUrl = "https://docs.google.com/spreadsheets/d/1HyFdXlr7Kawoxu5RKBUCXO1asDbw1lStYaRaMFSYysk/gviz/tq?tqx=out:csv&sheet=Sheet2";
    const response = await fetch(csvUrl);
    if (!response.ok) throw new Error("Failed to fetch Permanent Bookings CSV");
    const csvText = await response.text();
    
    const lines = csvText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const dataLines = lines.slice(1);
    
    const bookings: PermanentBooking[] = [];
    
    dataLines.forEach(line => {
      const parts: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          parts.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      parts.push(current);

      if (parts.length >= 4) {
        const teacherName = parts[0]?.trim() || '';
        const subject = parts[1]?.trim() || '';
        const timeInput = parts[2]?.trim() || '';
        const day = parts[3]?.trim().toUpperCase() || '';
        const room = parts[4]?.trim() || '';
        const className = parts[5]?.trim() || '';
        
        const slots = expandTimeRanges(timeInput);
        
        if (teacherName && day && slots.length > 0 && room) {
          bookings.push({
            teacherName,
            subject,
            className,
            slots,
            day,
            room
          });
        }
      }
    });
    
    return bookings;
  } catch (error) {
    console.error("Failed to fetch permanent bookings:", error);
    return [];
  }
};

export const createBooking = async (booking: Booking): Promise<boolean> => {
  // Deprecated in favor of createBookingWithResponse, but kept for compatibility
  const result = await createBookingWithResponse(booking);
  return result.success;
};

// Modified create for better error handling if CORS works
export const createBookingWithResponse = async (booking: Booking): Promise<{success: boolean, message?: string}> => {
    try {
        // We append action=create_booking to the URL. 
        // This is critical if the GAS script switches on e.parameter.action.
        const response = await fetch(`${API_URL}?action=create_booking`, {
          method: 'POST',
          redirect: 'follow',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8', 
          },
          body: JSON.stringify(booking),
        });
        
        const result = await response.json();
        if (result.status === 'success') {
            return { success: true };
        } else {
            return { success: false, message: result.message || result.error || 'Unknown error' };
        }
      } catch (error) {
        console.error("Failed to create booking:", error);
        return { success: false, message: "Ralat sambungan server. Sila cuba lagi." };
      }
}

export const deleteBookingWithResponse = async (id: string, password?: string): Promise<{success: boolean, message?: string}> => {
    try {
        const response = await fetch(`${API_URL}?action=delete_booking`, {
          method: 'POST',
          redirect: 'follow',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ id, password }),
        });
        
        const result = await response.json();
        if (result.status === 'success') {
            return { success: true };
        } else {
            return { success: false, message: result.message || result.error || 'Kata laluan salah atau ralat pelayan.' };
        }
      } catch (error) {
        console.error("Failed to delete booking:", error);
        return { success: false, message: "Ralat sambungan server atau fungsi padam belum dikonfigurasi di Google Script." };
      }
};