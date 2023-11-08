import React, { useState } from "react";
import Flatpickr from "react-flatpickr";
// import "flatpickr/dist/themes/material_green.css";
// import "flatpickr/dist/flatpickr.css";
import "flatpickr/dist/themes/material_blue.css";
import "flatpickr/dist/themes/airbnb.css";

const DateRangePicker = ({ placeholder, onChange }) => {
  const [dateRange, setDateRange] = useState([]);

  const handleDateChange = (selectedDates) => {
    setDateRange(selectedDates);
    onChange(selectedDates);
  };

  return (
    <div className="date-range-picker">
      <Flatpickr
        value={dateRange}
        options={{
          mode: "range",
        }}
        onChange={handleDateChange}
        placeholder={placeholder || "Select Date Range"}
      />
    </div>
  );
};

export default DateRangePicker;
