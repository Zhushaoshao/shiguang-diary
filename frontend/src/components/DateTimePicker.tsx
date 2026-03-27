import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';


interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  required?: boolean;
}

const DateTimePicker = ({ value, onChange, label, required }: DateTimePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs(value));

  useEffect(() => {
    setSelectedDate(dayjs(value));
  }, [value]);

  const handleChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    if (date) {
      onChange(date.toDate());
    }
  };

  return (
    <div>
      {label && (
        <label className="label-paper">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
        <div className="relative">
          <MuiDateTimePicker
            value={selectedDate}
            onChange={handleChange}
            minutesStep={1}
            ampm={false}
            enableAccessibleFieldDOMStructure={false}
            slots={{ textField: TextField }}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small' as const,
                required,
                placeholder: 'YYYY/MM/DD HH:mm',
                sx: {
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'DM Sans, -apple-system, BlinkMacSystemFont, sans-serif',
                    backgroundColor: '#FFFBF7',
                    borderRadius: '0.75rem',
                    border: '2px solid #E8DDD0',
                    boxShadow: '0 2px 8px rgba(230, 126, 34, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover': {
                      borderColor: '#E67E22',
                      boxShadow: '0 4px 16px rgba(230, 126, 34, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
                    },
                    '&.Mui-focused': {
                      borderColor: '#E67E22',
                      boxShadow: '0 4px 16px rgba(230, 126, 34, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08), 0 0 0 3px rgba(230, 126, 34, 0.1)',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontFamily: 'DM Sans, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: '1rem',
                    color: '#2D2D2D',
                    padding: '0.75rem 1rem',
                    '&::placeholder': {
                      color: '#5D5D5D',
                      opacity: 0.6,
                    },
                  },
                  '& .MuiIconButton-root': {
                    color: '#E67E22',
                    transition: 'all 0.3s',
                    '&:hover': {
                      backgroundColor: 'rgba(230, 126, 34, 0.1)',
                      transform: 'scale(1.1)',
                    },
                  },
                },
              },
              popper: {
                sx: {
                  '& .MuiPaper-root': {
                    backgroundColor: '#FFFBF7',
                    borderRadius: '1rem',
                    border: '2px solid #E8DDD0',
                    boxShadow: '0 12px 32px rgba(230, 126, 34, 0.2), 0 6px 16px rgba(0, 0, 0, 0.12)',
                    marginTop: '0.5rem',
                  },
                  '& .MuiPickersDay-root': {
                    fontFamily: 'DM Sans, -apple-system, BlinkMacSystemFont, sans-serif',
                    color: '#2D2D2D',
                    '&:hover': {
                      backgroundColor: 'rgba(230, 126, 34, 0.1)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#E67E22 !important',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#D35400 !important',
                      },
                    },
                  },
                  '& .MuiPickersCalendarHeader-root': {
                    fontFamily: 'Crimson Pro, Georgia, serif',
                    color: '#1A1A1A',
                  },
                  '& .MuiPickersCalendarHeader-label': {
                    fontFamily: 'Crimson Pro, Georgia, serif',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                  },
                  '& .MuiPickersArrowSwitcher-button': {
                    color: '#E67E22',
                    '&:hover': {
                      backgroundColor: 'rgba(230, 126, 34, 0.1)',
                    },
                  },
                  '& .MuiClock-root': {
                    backgroundColor: '#FFFBF7',
                  },
                  '& .MuiClockPointer-root': {
                    backgroundColor: '#E67E22',
                  },
                  '& .MuiClockPointer-thumb': {
                    backgroundColor: '#E67E22',
                    borderColor: '#E67E22',
                  },
                  '& .MuiClockNumber-root': {
                    fontFamily: 'DM Sans, -apple-system, BlinkMacSystemFont, sans-serif',
                    '&.Mui-selected': {
                      backgroundColor: '#E67E22',
                      color: '#FFFFFF',
                    },
                  },
                  '& .MuiPickersToolbar-root': {
                    backgroundColor: '#E67E22',
                    color: '#FFFFFF',
                    fontFamily: 'Crimson Pro, Georgia, serif',
                  },
                  '& .MuiDialogActions-root': {
                    padding: '1rem',
                    '& .MuiButton-root': {
                      fontFamily: 'DM Sans, -apple-system, BlinkMacSystemFont, sans-serif',
                      color: '#E67E22',
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(230, 126, 34, 0.1)',
                      },
                    },
                  },
                },
              },
            }}
          />
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default DateTimePicker;

