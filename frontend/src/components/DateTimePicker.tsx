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

  const textFieldProps = {
    fullWidth: true,
    size: 'small' as const,
    required,
    InputProps: {
      className: 'input-neu',
    },
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-neutral-text mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
        <MuiDateTimePicker
          value={selectedDate}
          onChange={handleChange}
          minutesStep={1}
          ampm={false}
          enableAccessibleFieldDOMStructure={false}
          slots={{ textField: TextField }}
          slotProps={{
            textField: {
              ...textFieldProps,
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default DateTimePicker;

