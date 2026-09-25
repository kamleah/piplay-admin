import React, { useEffect, useState } from 'react';
import { Popover } from 'antd';
import { DateRangePicker } from 'react-date-range';
import moment from 'moment';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { filterCourt, filterRevenue, getAllCourt, getAllRevenue, getFacilityApi, getRevenueAdmin } from '../apiFile/Service';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const CustomDateRangePicker = ({ date, onDateChange, selectedDateRange, onClearDateRange }) => {
     const { register, watch, setValue, reset, control } = useForm();
     const loggedUserDetails = useSelector(
          (state: any) => state.user.loggedUserDetails
     );
     const [open, setOpen] = useState(false);
     const [filterOn, setFilterOn] = useState(false);
     const [revenue_dashboard_data, setRevenue_dashboard_data] = useState([]);
     const [data, setData] = useState([]);
     const loggedInUser = localStorage.getItem("auth");
     var court = watch("court");
     var facility = watch("facility");
     var location = watch("location");
     var start_date = watch("start");
     var end_date = watch("end");
     const handleOpenChange = (newOpen) => {
          setOpen(newOpen);
     };

     const handleDateChange = (e) => {
          console.log("Date selection:", e.selection); 
          if (e.selection.startDate && e.selection.endDate) {
               onDateChange([{ startDate: e.selection.startDate, endDate: e.selection.endDate, key: 'selection' }]);
          }
     };


     const filterData = async () => {
          setFilterOn(true)
          let response = await filterRevenue(
               loggedInUser,
               location == undefined ? "" : location,
               court == undefined ? "" : court?.value,
               !loggedUserDetails?.roleId ? facility == undefined ? "" : facility?.value : loggedUserDetails?.facility_id,
               start_date == undefined ? "" : start_date,
               end_date == undefined ? "" : end_date
          );
          if (response?.statusCode == 0) {
               mapRevenueDashboardDate(response?.result);
               setData(response?.result);
          } else {
               setData([]);
          }
     };     


     const mapRevenueDashboardDate = (data) => {
          const calculateGrowth = (current, previous) => {
               return previous
                    ? Number(((current - previous) / previous) * 100).toFixed(2)
                    : "0.00";
          };
          const formatValue = (value) => {
               return value ? Number(value).toFixed(2) : "0.00";
          };



          let revenue_dashboard_data: any = [
               {
                    icon: "clarity:list-solid-badged",
                    label: "Bookings",
                    value: data?.booking_count ? data?.booking_count : "0",
                    growthPercentage: calculateGrowth(
                         data?.booking_count,
                         data?.last_booking_count
                    ),
               },
               {
                    icon: "game-icons:tennis-court",
                    label: "Court Utilization",
                    value: formatValue((data?.court_hours_used * 100)),
                    growthPercentage: calculateGrowth(
                         data?.court_hours_used,
                         data?.last_court_hours_used
                    ),
                    subtext: '%'
               },
               {
                    icon: "healthicons:money-bag-outline",
                    label: "Total Bookings amount",
                    value: formatValue(data?.revenue_generated),
                    growthPercentage: calculateGrowth(
                         data?.revenue_generated,
                         data?.last_revenue_generated
                    ),
                    subtext: "₹"
               },
               {
                    icon: "solar:hand-money-outline",
                    label: "Commission Shared",
                    value: formatValue(data?.commision_shared),
                    growthPercentage: calculateGrowth(
                         data?.commision_shared,
                         data?.last_commision_shared
                    ),
               },
               {
                    icon: "mingcute:hours-line",
                    label: "Hours Played",
                    value: formatValue(data?.hours_played),
                    growthPercentage: calculateGrowth(
                         data?.hours_played,
                         data?.last_hours_played
                    ),
                    subtext: "Hrs"
               },
               {
                    icon: "tabler:clock-hour-9",
                    label: "Average Play Time",
                    value: formatValue(data?.average_play_time),
                    growthPercentage: calculateGrowth(
                         data?.average_play_time,
                         data?.last_average_play_time
                    ),
                    subtext: "Hrs"
               },
               {
                    icon: "mdi:user-multiple-outline",
                    label: "Total Users",
                    value: data?.users ? data?.users : "0",
                    growthPercentage: calculateGrowth(data?.users, data?.last_users),
               },
               {
                    icon: "mdi:users-add-outline",
                    label: "New Users",
                    value: data?.new_users ? data?.new_users : "0",
                    growthPercentage: calculateGrowth(
                         data?.new_users,
                         data?.last_new_users
                    ),
               },
               {
                    icon: "mdi:users-add-outline",
                    label: "Cancellation Count",
                    value: data?.cancel_count ? data?.cancel_count : "0",
                    growthPercentage: calculateGrowth(
                         data?.new_users,
                         data?.last_new_users
                    ),
               },
               {
                    icon: "mdi:users-add-outline",
                    label: "Refund Counts",
                    value: data?.refunded_count ? data?.refunded_count : "0",
                    growthPercentage: calculateGrowth(
                         data?.new_users,
                         data?.last_new_users
                    ),
               },
               {
                    icon: "mdi:users-add-outline",
                    label: "Total Refunded Amount",
                    value: data?.refunded_amount ? data?.refunded_amount : "0",
                    growthPercentage: calculateGrowth(
                         data?.new_users,
                         data?.last_new_users
                    ),
                    subtext: "₹"
               },
               {
                    icon: "mdi:users-add-outline",
                    label: "Reschedules Count",
                    value: data?.no_of_reschedules ? data?.no_of_reschedules : "0",
                    growthPercentage: calculateGrowth(
                         data?.new_users,
                         data?.last_new_users
                    ),
               },
               {
                    icon: "mdi:users-add-outline",
                    label: "Fees collected from cancellations",
                    value: data?.cancel_amount ? data?.cancel_amount : "0",
                    growthPercentage: calculateGrowth(
                         data?.new_users,
                         data?.last_new_users
                    ),
                    subtext: "₹"
               },
               {
                    icon: "mdi:users-add-outline",
                    label: "Fees collected from reschedules",
                    value: data?.reschedule_amount_penal ? data?.reschedule_amount_penal : "0",
                    growthPercentage: calculateGrowth(
                         data?.new_users,
                         data?.last_new_users
                    ),
                    subtext: "₹"
               },
          ];
          setRevenue_dashboard_data(revenue_dashboard_data);
     };
     const getAllData = async () => {
          let response;
          if (!loggedUserDetails?.roleId) {
               response = await getAllRevenue(loggedInUser);
          } else {
               // response = await filterRevenue(loggedInUser, '', '', loggedUserDetails?.facility_id, '', '');
               response = await getRevenueAdmin(loggedInUser, loggedUserDetails?.facility_id);
               response.result = response.result;
          }
          setData(response?.result);
          mapRevenueDashboardDate(response?.result);
     };

     useEffect(() => {
          getAllData();          
     }, []);

     const content = (
          <>
               <DateRangePicker
                    onChange={handleDateChange}
                    moveRangeOnFirstSelection={false}
                    months={1}
                    ranges={date}
                    rangeColors={['#F17121']}
                    color="#F17121"
                    className="custom-date-range"
                    scroll={{ enabled: false}}
               />
               <div className="filter-buttons-row2">
                    <button className="pi-btn-primary" key="confirm" onClick={() => {
                         handleOpenChange(false);
                         filterData();
                    }}>Apply</button>
                    <button
                         className="pi-btn-secondary"
                         key="cancel"
                         onClick={() => {
                              handleOpenChange(false);
                              onClearDateRange();
                         }}
                    >
                         Clear
                    </button>

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
          >
               <input
                    type="text"
                    value={selectedDateRange}
                    readOnly
                    placeholder="Select Date Range"
                    onClick={() => handleOpenChange(!open)}
               />
          </Popover>
     );
};

export default CustomDateRangePicker;
