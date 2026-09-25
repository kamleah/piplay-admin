import React, { useState } from 'react';
import { Popover } from 'antd';
import Calendar from "react-calendar";
import moment from 'moment';
import {
     CalendarOutlined,
} from "@ant-design/icons";
const CustomDatePicker = ({ date, onDateChange, matches, onResetDate }) => {
     const [open, setOpen] = useState(false);

     const handleOpenChange = (newOpen) => {
          setOpen(newOpen);
     };

     const content = (
          <>
               <Calendar
                    className="booking-calendar"
                    value={date}
                    onChange={onDateChange}
               //    minDate={new Date()}
               />
               <div className="filter-buttons-row2">
                    <button
                         className="pi-btn-primary"
                         key="cancel"
                         onClick={() => {
                              handleOpenChange(false);
                              onResetDate();
                              }}
                              >
                         Today
                    </button>
                         <button className="pi-btn-secondary" key="confirm" onClick={() => {
                              handleOpenChange(false);
                         }}>Close</button>
               </div>
          </>

     );

     return (
          <Popover
               content={content}
               trigger="click"
               open={open}
               onOpenChange={handleOpenChange}
               overlayClassName="date-picker-popover"
               placement={ matches ? "bottom": "bottomRight"}
          >
               <p className="selected-date-text">
               <CalendarOutlined className="calendar-icon" /> 
                    {moment(date).format("MMMM DD, YYYY")}
               </p>
             
          </Popover>
     );
};

export default CustomDatePicker;
