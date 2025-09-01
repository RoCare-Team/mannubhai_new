"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TimeSlotModal = ({ onTimeSlotSelected, onClose, open }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTimeId, setSelectedTimeId] = useState(null);
  const [timeslot, setTimeslot] = useState([]);

  const getNextSevenDays = () =>
    Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        label: date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }),
        value: date
      };
    });

  const availableDates = getNextSevenDays();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("time_slot");
      if (stored) {
        try {
          setTimeslot(JSON.parse(stored));
        } catch {
          setTimeslot([]);
        }
      }
    }
  }, []);

  const handleDateSelect = async (date) => {
    try {
      const payload = { date: date.toISOString().split('T')[0] };
      const res = await fetch("https://waterpurifierservicecenter.in/customer/ro_customer/time_slot.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      localStorage.setItem("time_slot", JSON.stringify(data.all_time_slots));
      setTimeslot(data.all_time_slots || []);
      setSelectedDate(date);
      setSelectedTime(null);
      setSelectedTimeId(null);
    } catch (err) {
      console.error(err);
      setTimeslot([]);
    }
  };

  const handleProceed = () => {
    if (selectedDate && selectedTime && selectedTimeId) {
      onTimeSlotSelected?.({
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        id: selectedTimeId
      });
      onClose?.();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 2, bgcolor: 'background.paper' } }}>
      
      <DialogTitle sx={{ p: 2 }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: 'grey.500' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <Box mb={3}>
          <Typography variant="h6" fontWeight={600}>
            When should the professional arrive?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Service will take approx. <strong>3 hrs & 5 mins</strong>
          </Typography>
        </Box>

        {/* Date selection buttons */}
        <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
          {availableDates.map((date, idx) => (
            <button
              key={idx}
              onClick={() => handleDateSelect(date.value)}
              className={`px-3 py-2 rounded-xl text-sm border font-medium transition-all duration-150 ${
                selectedDate?.toDateString() === date.value.toDateString()
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {date.label}
            </button>
          ))}
        </Box>

        {/* Time slots */}
        {selectedDate && (
          <Box>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Time slots for {selectedDate.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
            </Typography>
            <Box sx={{ maxHeight: 220, overflowY: 'auto' }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeslot.length > 0 ? (
                  timeslot.map((time) => (
                    <button
                      key={time.id}
                      onClick={() => {
                        setSelectedTime(time.time_slots);
                        setSelectedTimeId(time.id);
                      }}
                      className={`py-2 px-3 text-sm rounded-xl border transition duration-150 ${
                        selectedTime === time.time_slots
                          ? "bg-indigo-500 text-white shadow"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {time.time_slots}
                    </button>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ gridColumn: 'span 3' }}>
                    No available slots. Try another date.
                  </Typography>
                )}
              </div>
            </Box>
          </Box>
        )}

        {/* Proceed button */}
        {selectedDate && (
          <Box mt={4}>
            <button
              onClick={handleProceed}
              disabled={!selectedTime}
              className={`w-full py-2 px-4 rounded-xl text-white text-sm font-medium transition ${
                !selectedTime ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Proceed to checkout
            </button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TimeSlotModal;
