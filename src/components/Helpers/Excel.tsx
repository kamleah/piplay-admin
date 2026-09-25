import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { Icon } from "@iconify-icon/react";
import moment from "moment";
import { Button } from 'antd';
interface WeekdayData {
  value: number;
  label: string;
}

const Excel = ({ page, importdata }) => {
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );
  useEffect(() => {
    window.matchMedia("(max-width: 768px)").addEventListener("change", (e) => {
      setMatches(e.matches);
    });
  }, []);

  const abbreviations = {
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
    7: "Sun",
  };

  const formatWeekdays = (data: WeekdayData[]): string => {
    const labels: number[] = data?.map((item) => item.value);

    // Sort labels in ascending order
    const sortedLabels: number[] = [...labels].sort((a, b) => a - b);

    // Group consecutive days together
    const output: number[][] = [];
    let tempArr: number[] = [];
    for (let i = 0; i < sortedLabels.length; i++) {
      const current: number = sortedLabels[i];
      const prev: number | undefined = tempArr[tempArr.length - 1];
      if (prev === undefined || current - prev === 1) {
        tempArr.push(current);
      } else {
        output.push(tempArr);
        tempArr = [current];
      }
    }
    output.push(tempArr); // Push the remaining days

    // Merge consecutive single days into groups
    const mergedOutput: number[][] | number[] = output
      .map((group) =>
        group.length > 2 ? [group] : group.map((item) => [item])
      )
      .flat();

    // Format the output
    const formattedOutput: string = mergedOutput
      .map((group) => {
        if (group.length === 1) {
          return abbreviations[group[0]];
        } else {
          return `${abbreviations[group[0]]} - ${abbreviations[group[group.length - 1]]
            }`;
        }
      })
      .join(", ");
    return formattedOutput;
  };

  const handleArray = (data) => {
    const flattenedDays = data?.flat();
    if (flattenedDays && Array.isArray(flattenedDays)) {
      const dayLabels = flattenedDays.map((day) => day.label);
      return dayLabels.join(" ,");
    }
  };
  const handleDays = (data) => {
    const flattenedDays = data?.flat();
    if (flattenedDays && Array.isArray(flattenedDays)) {
      let dayLabels = flattenedDays.map((day) => day.label);
      let out = dayLabels.join(" ,");
      out = formatWeekdays(dayLabels);
      return out;
    }
  };

  const handleDownloadExcel = () => {
    let importeddata;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(page);
    if (page == "RegisteredEvents") {
      importeddata = importdata?.map((data, i) => {
        return {
          BookedOn: data?.createdAt,
          Id: data?._id,
          "Tournament Name": data?.tournament?.tournament_name,
          "Tournament Date": !data?.tournament?.start_date
            ? ""
            : `${data?.tournament?.start_date}- ${data?.tournament?.end_date}`,
          "Tournament Time": !data?.tournament?.start_date
            ? ""
            : `${data?.tournament?.start_time}- ${data?.tournament?.end_time}`,
          Name: !data?.host?.firstname
            ? ""
            : `${data?.host?.firstname} ${data?.host?.lastname}`,
          Phone_no: !data?.host?.mobileno
            ? ""
            : data?.host?.mobileno
              ? data?.host?.mobileno
              : "NA",
          Email: !data?.host?.firstname
            ? ""
            : data?.host?.email
              ? data?.host?.email
              : "NA",
          PartnerName: data?.tournaments_players?.length > 0 ? `${data?.tournaments_players[0]?.name} ${data?.tournaments_players[0]?.lastName}` : 'N/A',
          PartnerMobile: data?.tournaments_players?.length > 0 ? data?.tournaments_players[0]?.phone_number : 'N/A',
          PartnerEmail: data?.partner ? data?.partner?.email : "NA",
          "Coupon Name": data?.coupon == true ? data?.coupon_name : "NA",
          "Coupon Percentage": data?.coupon == true ? data?.percentage : "NA",
          Amount:
            data?.total_amount == null || data?.total_amount == undefined
              ? ""
              : data?.total_amount,
          "Payment Status": data?.payment_status,
          "Main Category": data?.main_category?.ui_name_for_tournament,
          "Free Category": data?.tournament?.tournament_type,
          "Payment ID": data?.payment_id,
          "Venue": data?.venue?.name,
          "Venue Address": data?.venue?.address,
          "Venue Phone": data?.venue?.phone_no,
          "Venue City": data?.venue?.location_city,
        };
      });
    } else if (page == "Users" || page == "AdminUsers") {
      importeddata = importdata?.map((data, i) => {
        return {
          ID: data?._id,
          FirstName: data?.firstname,
          LastName: data?.lastname,
          Number: data?.mobileno,
          Email: data?.email,
          Gender: data?.gender,
          SkillLevel: data?.skill_level ? JSON.parse(data.skill_level).label : null,
          CreatedAt: moment(data?.createdAt).format("DD-MM-YYYY"),
          City: data?.city,
          CurretCity: data?.current_city ? data?.current_city : "NA",
          Pincode: data?.pincode ? data?.pincode : "NA"
        };
      });
    } else if (page == "Bookings") {
      importeddata = importdata?.map((data, i) => {
        console.log('data----------', data)
        return {
          CreatedAt: moment(data?.createdAt).format("DD-MM-YYYY hh:mm A"),
          ID: data?._id,
          User: `${data?.userData?.firstname} ${data?.userData?.lastname}`,
          "User Mobile": data?.userData?.mobileno,
          Facility: data?.facility?.name,
          Facility_Address: data?.facility?.address,
          Facility_Phone: data?.facility?.mobileno[0],
          Facility_Mail: data?.facility?.email,
          "Booked Date": moment(data?.booking_date).format("DD-MM-YYYY"),
          "Booked Status": data?.status,
          "Booked Slots":
            data?.booked_slot?.length === 0 ? `${moment(data?.booked_slot[0].startTime, "HH:mm").format("hh:mm A")} - ${moment(data?.booked_slot[data?.booked_slot.length - 1].endTime, "HH:mm").format("hh:mm A")}`
              : `${moment(data?.start_time, "HH:mm").format("hh:mm A")} - ${moment(data?.end_time, "HH:mm").format("hh:mm A")}`,
          Court: `${data?.court?.name},${data?.court?.game},${data?.court?.type}`,
          Payment_Status: data?.payment_status,
          Payment_ID: data?.razor_id,
          Amount: data?.total_amount / 100,
          Players_Invited: data?.booking_players?.map(data => { return ({ 'name': data?.name, 'mobileno': data?.mobileno, 'inApp': data?.user_id ? 'Yes' : 'No' }) })
        };
      });
    } else if (page == "Facilities") {
      importeddata = importdata?.map((data, i) => {
        return {
          "Facility Name": data?.name,
          "Address ": data?.address,
          "City ": data?.city,
          State: data?.state,
          Pincode: data?.pincode,
          Email: data?.email,
          "Phone Number": data?.mobileno[0],
          "Alternate Number": data?.mobileno[1],
          "Court Type": data?.court_type,
          Days: formatWeekdays(data?.days),
          "Start Time": data?.start,
          "End Time": data?.end,
          "Manager Name": data?.manager_name,
          "No of Users": data?.number_of_users,
          "No  of Courts": data?.number_of_courts,
          Amenities: handleArray(data?.amenities),
        };
      });
    } else if (page == "Venue") {
      importeddata = importdata?.map((data, i) => {
        return {
          Name: data?.name,
          "Address ": data?.address,
          Pincode: data?.pincode,
          State: data?.location_state,
          "City ": data?.location_city,
          "Phone Number": data?.phone_no,
          "Alternate Number": data?.alt_phone_no,
          "Sport Type": data?.sport_type,
          POC: data?.poc,
          Ratings: data?.ratings,
        };
      });
    } else if (page == "manage_court") {
      importeddata = importdata?.map((data, i) => {
        return {
          Name: data?.name,
          "Sport Type": data?.game,
          "Court Type": data?.type,
          Facility: data?.facility?.name,
          "Price Type": data?.price_type,
          "Start Time": data?.start_time,
          "End Time": data?.end_time,
          "Slot Size": data?.slot_size,
          "Slot Price": data?.slot_price,
        };
      });
    } else if (page == "manage_court_time_price") {
      importeddata = importdata?.map((data, i) => {
        return {
          "Court Name": data?.court?.name,
          "Facility Name": data?.facility?.name,
          "Start Time": data?.start_time,
          "End Time": data?.end_time,
          "Break Start Time": data?.break_start_time,
          "Break End Time": data?.break_end_time,
          "Slot Size": data?.slot_size,
          "Slot Price": data?.slot_price,
          "Active Days": formatWeekdays(data?.active_days),
          "Active Start Date": data?.active_start_date,
          "Active End Date": data?.active_end_date,
        };
      });
    } else if (page == "dashboard") {
      importeddata = importdata.map((data, i) => {
        return {
          "Booking Count ": data?.booking_count,
          "Average Play Time": data?.average_play_time,
          "Commision Shared ": data?.commision_shared
            ? data?.commision_shared
            : "0",
          "Court Hours Used": data?.court_hours_used,
          "Hours Played": data?.hours_played,
          "New Users ": data?.new_users,
          "Revenue Generated ": data?.revenue_generated
            ? data?.revenue_generated
            : "0",
          "Users ": data?.users,
        };
      });
    } else if (page == "manage_closing_day") {
      importeddata = importdata.map((data, i) => {
        return {
          "Court Name": data?.court?.name,
          "Facility Name": data?.facility?.name,
          "closing date": data?.active_start_date,
        };
      });
    }
    else if (page == "SettlementSlip") {
      importeddata = importdata.map((data, i) => {
        return {
          "Booking Amount": data?.total_booking_amount,
          "total Discount": data?.total_discount,
          "Pi Play Discount": data?.pi_play_discount,
          "Partner Discount": data?.partner_discount,
          "New Booking Amount": data?.new_total_booking_amount,
          "Platform Charges": data?.platform_charges,
          "Partner Settlement Amount": data?.partner_settlement_amount,
          // "total_amount_paid_by_users": 8092
        };
      });
    }
    else if (page == "MIS") {
      importeddata = importdata.map((data, i) => {
        return {
          "Booking Date": moment(data?.booking_date).format('DD-MM-YYYY'),
          "Facility": data?.facility_name,
          "Username": data?.user_full_name,
          "Booked Slots": `${data?.start_time} - ${data?.end_time}`,
          "Slot Price": data?.slot_price,
          "Court": data?.court_name || 'N/A',
          "Booking Status": data?.status,
          "Payment Status": data?.payment_status,
          "Booking ID": data?._id,
          "Discount Coupon": data?.coupon_name ? data?.coupon_name : 'N/A',
          "Razorpay ID": data?.razor_id,
          "Amount": data?.total_amount,
          "Source": data?.source,
        };
      });
    }
    else if (page == "packages") {
      importeddata = importdata.map((data, i) => {
        let convertedData = {
          "Package Name": data?.name,
          "Duration": data.duration,
          "Facility Name": data?.facility_id?.name,
          "Facility Address": data?.facility_id?.address,
          "Sport Type": data?.sport_type,
          "Expiry": data?.expiry == true ? 'Yes' : 'No',
          "Start Date": moment(data.start_date).format('DD-MM-YYYY'),
          "End Date": data.end_date ? moment(data.end_date).format('DD-MM-YYYY') : 'No Expiry',
          "Status": data?.status,
          "Price": data?.price,
          "Discounted Price": data?.discount,
        };
        data.description.forEach((item, i) => {
          convertedData[`Short Description${i + 1}`] = item.name;
          convertedData[`Active${i + 1}`] = item.active == true ? 'Yes' : 'No';
        });
        return convertedData;
      });
    }

    else if (page == "packagelist") {
      importeddata = importdata
        .filter(data => {
          return data && Object.keys(data).length > 0;
        })
        .map((data, i) => {
          console.log('data--------', data);
          let convertedData = {
            "Player Name": `${data?.user_id?.firstname || ''} ${data?.user_id?.lastname || ''}`,
            "Package Name": data?.package_id?.name || '',
            "Sports Type": data?.package_id?.sport_type || '',
            "Expiry Date": moment(data?.package_expiry_date).format('DD-MM-YYYY') || '',
            "Facility Name": data?.facility_id?.name || '',
            "Facility Location": data?.facility_id?.address || '',
            "Status": data?.package_id?.status || '',
            "Price": data?.price || '',
            "Paid Amount": `${(data?.price || 0) / 100}`,
            "Discounted Price": `${(data?.discount_amount || 0) / 100}`,
            "Transaction ID": data?.razorpay_order_id || '',
            "Original Amount": `${(Number(data?.price || 0) + Number(data?.discount_amount || 0)) / 100}`,
            "Discount Amount": data?.price || '',
            "Payment Status": data?.payment_status || '',
          };
          return convertedData;
        })
        .filter(convertedData => {
          return !Object.values(convertedData).some(value => value === '');
        });
    }





    // Add headers
    const headers = Object.keys(importeddata[0]);

    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" }, // Yellow color
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = { horizontal: "center" };
    });
    worksheet.columns.forEach((column) => {
      column.width = 25;
      column.alignment = { horizontal: "left" };
    });

    // Add data rows
    importeddata?.forEach((data) => {
      const rowValues: string[] = [];
      headers.forEach((header) => {
        rowValues.push(data[header]);
      });
      let Row = worksheet.addRow(rowValues);
      Row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      // Create blob from buffer
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${page}.xlsx`;
      // Trigger download
      document.body.appendChild(a);
      a.click();
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  };

  return (
    <div>
      {importdata?.length > 0 && (
        <Button
          className="pi-btn-primary"
          onClick={handleDownloadExcel}
          style={{ fontSize: '0.7rem' }} // Set the background color to green
        >
          Export to csv
          <Icon icon="mdi:file-download" style={{
            fontSize: 20,
            verticalAlign: 'middle',
            marginLeft: 8,
          }} />
        </Button>
      )}
    </div>
  );
};

export default Excel;
