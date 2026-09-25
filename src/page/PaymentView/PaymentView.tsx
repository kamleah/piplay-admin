import React, { useState, useEffect, Fragment } from 'react';
import Table from "../../components/Table/DataTable";
import { Button, Card, Breadcrumb } from 'antd';
import { filterBookingTrasactionsAPI, ListOfPayments } from '../../components/apiFile/Service';
import FilterData from "../../components/Modal/FilterData";
import { Controller, useForm } from "react-hook-form";
import CustomDateRangePicker from "../../components/Modal/CustomDateRangePicker";
import moment from 'moment';
import { Icon } from '@iconify-icon/react';
import { toast } from 'react-toastify';
import ToastMessage from '../facilator/ToastMessage/ToastMessage';
import StatusLabel from '../../components/Labels/StatusLabel';
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useSelector } from "react-redux";

interface PaymentDetailsProps {
  matches: boolean;
  menuOpen: boolean;
  onToggle: () => void;
  modulePermissionsData: {
    view: boolean;
    edit: boolean;
    add: boolean;
  };
}



function PaymentView({ matches, menuOpen, onToggle, modulePermissionsData }: PaymentDetailsProps) {
  const { register, watch, setValue, reset, control } = useForm()
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [partialData, setPartialData] = useState<any[]>([]);
  const animatedComponents = makeAnimated();
  const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
  const loggedInUser = localStorage.getItem("auth");

  const userPayStatusOptions = [
    { value: "Failed", label: "Failed" },
    { value: "Success", label: "Success" },
  ];

  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const [loading, setLoading] = useState<boolean>(false);


  const fetchAllPayments = async (user: string) => {
    setLoading(true);
    let allData: any[] = [];
    let page = 1;
    let moreDataAvailable = true;
    const pageSize = 400;

    while (moreDataAvailable) {
      let response;
      if (!loggedUserDetails?.roleId) {
        response = await ListOfPayments(user, page, pageSize);
      } else {
        response = await filterBookingTrasactionsAPI(user, page, pageSize, loggedUserDetails.facility_id);
      }

      if (response.data && response.data.length > 0) {
        if (!loggedUserDetails?.roleId) {
          allData = [...allData, ...response.data];
        } else {
          const filteredData = response.data.filter((item) => item.facility_id === loggedUserDetails?.facility_id);
          allData = [...allData, ...filteredData];
        }
        page++;
        if (page === 2) {
          const orderFilterData = allData.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
          setPartialData(orderFilterData);
        }
        if (response.data.length < pageSize) {
          moreDataAvailable = false;
        }
      } else {
        moreDataAvailable = false;
      }
    }

    const orderFilterData = allData.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
    setData(orderFilterData);
    setFilteredData(orderFilterData);
    setLoading(false);
  };


  useEffect(() => {
    const fetchFilteredLogs = async () => {
      const loggedInUser = localStorage.getItem("auth");

      if (!loggedInUser) {
        console.error('User is not authenticated.');
        return;
      }
      await fetchAllPayments(loggedInUser);
    };

    fetchFilteredLogs();
  }, []);

  const [selectedDateRange, setSelectedDateRange] =
    useState("Select Date Range");

  const handleDateChange = (newDateRange) => {
    if (Array.isArray(newDateRange) && newDateRange.length > 0) {
      import('moment').then(({ default: moment }) => {
        const start = newDateRange[0].startDate;
        const end = newDateRange[0].endDate;

        setStartDate(moment(start).format("YYYY-MM-DD"));
        setEndDate(moment(end).format("YYYY-MM-DD"));

        setSelectedDateRange(
          `${moment(start).format("DD/MM/YYYY")} - ${moment(end).format("DD/MM/YYYY")}`
        );
      });
    } else {
      console.error('Invalid date range selected');
    }
  };


  const applyFilters = () => {
    const selectedfullname = watch("fullname");
    const selectedOrderId = watch("order_id");
    const selectedRazorId = watch("razor_id");
    const selectedEmail = watch("email");
    const selectedContact = watch("contact");
    const selectedStatus = watch("user_pay_status");

    const filtered = data.filter((item) => {
      // Parse the createdAt field as a Date object
      const createdAtDate = new Date(item.createdAt);

      // Compare only the date part, ignoring the time
      const isWithinDateRange = startDate && endDate
        ? moment(createdAtDate).isBetween(
          moment(startDate, "YYYY-MM-DD"),
          moment(endDate, "YYYY-MM-DD"),
          "days",
          "[]"
        )
        : true;

      // Determine the payment status based on the given logic
      const paymentStatus = item.data.payment.entity.captured && item.effected_collection !== "No Collection Found"
        ? "Success"
        : "Failed";

      console.log("🚀 ~ file: PaymentView.tsx:147 ~ filtered ~ paymentStatus:", paymentStatus, selectedStatus?.value)


      return (
        (!selectedfullname || (item.fullname && item.fullname.toLowerCase().includes(selectedfullname.toLowerCase()))) &&
        (!selectedOrderId || (item.data && item.data.payment && item.data.payment.entity && item.data.payment.entity.order_id && item.data.payment.entity.order_id.toLowerCase().includes(selectedOrderId.toLowerCase()))) &&
        (!selectedRazorId || (item.data && item.data.payment && item.data.payment.entity && item.data.payment.entity.id && item.data.payment.entity.id.toLowerCase().includes(selectedRazorId.toLowerCase()))) &&
        (!selectedEmail || (item.data && item.data.payment && item.data.payment.entity && item.data.payment.entity.email && item.data.payment.entity.email.toLowerCase().includes(selectedEmail.toLowerCase()))) &&
        isWithinDateRange && // Date range filter using moment.js
        (!selectedContact || (item.data && item.data.payment && item.data.payment.entity && item.data.payment.entity.contact && item.data.payment.entity.contact.includes(selectedContact))) &&
        (!selectedStatus || paymentStatus === selectedStatus?.value) // Updated status filter logic
      );
    });

    if (filtered.length === 0) {
      setFilteredData([]);
      setPartialData([]);
    } else {
      setFilteredData(filtered);
    }
  };



  const handleApply = (newDateRange) => {
    handleDateChange(newDateRange);
    applyFilters();
  };

  const clearFilters = async () => {
    reset({
      fullname: '',
      order_id: '',
      email: '',
      contact: '',
      bookingData: '',
      razor_id:''
    });
    setStartDate(null);
    setEndDate(null);
    setDate([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setSelectedDateRange("Select Date Range");
    setFilteredData(data);
  };
  const onClearDateRange = () => {
    setDate([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
  }



  const copyToClipboard = (row) => {
    // const rowDetails = JSON.stringify(row, null, 2);
    navigator.clipboard
      .writeText(row)
      .then(() => {
        toast(<ToastMessage body={"Copied Successfully"} type="success" />, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        console.error("Failed to copy row details to clipboard:", error);
      });
  };
  const columns = [
    {
      name: 'Created At',
      selector: (row: any) => <>
        {moment(row?.createdAt).format("DD-MM-YYYY")}
        <br />
        {moment(row?.createdAt).format("hh:mm A")}
      </>,
      wrap: true,
      sortable: true,
    },
    {
      name: 'Razor Pay ID',
      selector: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {loggedUserDetails.roleId ? row.razor_id : row.data.payment.entity.id}
          <Icon
            icon="solar:copy-bold"
            height="18"
            width="18"
            style={{ paddingLeft: '5px', cursor: 'pointer' }}
            onClick={() => copyToClipboard(loggedUserDetails.roleId ? row.razor_id : row.data.payment.entity.id)}
          />
        </div>
      ),
      wrap: true,
      sortable: true,
    },
    {
      name: 'Name',
      selector: (row: any) => row.fullname,
      wrap: true,
      sortable: true,
    },
    {
      name: 'Amount',
      selector: (row: any) => loggedUserDetails.roleId ? row.final_amount / 100 : row.data.payment.entity.amount / 100,
      wrap: true,
      sortable: true,
    },
    {
      name: 'Trasaction Type',
      selector: (row: any) => row.effected_collection == 'bookings' ? 'Court Booking' : row.effected_collection == 'bookingsPlayermatch' ? 'Match Booking' : row.effected_collection == 'registeredTournamentUser' ? 'Tournament Registration' : 'No Collection Found',
      wrap: true,
      sortable: true,
    },
    {
      name: 'Payment Status',
      selector: (row: any) => loggedUserDetails.roleId
        ? row.payment_status
        : row.data.payment.entity.status === 'captured'
          ? 'success'
          : row.data.payment.entity.status,
      wrap: true,
      sortable: true,
      cell: row => (
        <div className='playerContainer'>
          {loggedUserDetails.roleId ? (
            row.payment_status === 'paid' ? (
              <span style={{ color: 'green' }}>Success</span>
            ) : (
              <span style={{ color: 'blue' }}>{row.payment_status}</span>
            )
          ) : (
            row.data.payment.entity.status === 'captured' ? (
              <span style={{ color: 'green' }}>Success</span>
            ) : (
              <span style={{ color: 'blue' }}>{row.data.payment.entity.status}</span>
            )
          )}
        </div>
      ),
    },
    //  loggedUserDetails.roleId ? '' : {
    //     name: 'User Pay Status',
    //     selector: (row: any) => row.effected_collection,
    //     wrap: true,
    //     sortable: true,
    //     cell: row =>
    //       <div className='playerContainer max-width-container'>
    //         <StatusLabel status={(row.data.payment.entity.captured && row.effected_collection != "No Collection Found") ? "Success" : "Cancelled"} labelText={(row.data.payment.entity.captured && row.effected_collection != "No Collection Found") ? "Success" : "Failed"} />
    //       </div>
    //   },
    {
      name: 'Order ID',
      selector: (row: any) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {loggedUserDetails.roleId ? row.razorpay_order_id : row.data.payment.entity.order_id ?? "N/A"}
          <Icon
            icon="solar:copy-bold"
            height="18"
            width="18"
            style={{ paddingLeft: '5px', cursor: 'pointer' }}
            onClick={() => copyToClipboard(loggedUserDetails.roleId ? row.razorpay_order_id : row.data.payment.entity.order_id)}
          />
        </div>
      ),
      wrap: true,
      sortable: true,
    },
    {
      name: 'Method',
      selector: (row: any) => loggedUserDetails.roleId ? row.payment_type : row.data.payment.entity.method,
      wrap: true,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row: any) => loggedUserDetails.roleId ? row.user.cmail ?? "N/A" : row.data.payment.entity.email ?? "N/A",
      wrap: true,
      sortable: true,
    },
    {
      name: 'Contact',
      selector: (row: any) => loggedUserDetails.roleId ? row.user.mobileno : row.data.payment.entity.contact,
      wrap: true,
      sortable: true,
    },
    {
      name: 'Base Amount',
      selector: (row: any) => loggedUserDetails.roleId ? row.total_amount / 100 : row.data.payment.entity.base_amount,
      wrap: true,
      sortable: true,
      style: { textAlign: 'right' },
    },

  ];

  const FilterSection = () => (
    <div className="filter-form">
      <div className={`${matches ? "filter-section border-bottom-light" : "filter-fields"}`}>
        <div className="input-group">
          <label htmlFor="fullname" className="form-label">FullName</label>
          <div className="form-group">
            <input
              className="form-field"
              type="text"
              id="fullname"
              placeholder="Enter name"
              {...register("fullname")}
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="order_id" className="form-label">Order ID</label>
          <div className="form-group">
            <input
              className="form-field"
              type="text"
              id="order_id"
              placeholder="Enter order id"
              {...register("order_id")}
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="razor_id" className="form-label">Razor ID</label>
          <div className="form-group">
            <input
              className="form-field"
              type="text"
              id="razor_id"
              placeholder="Enter razor id"
              {...register("razor_id")}
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="email" className="form-label">Email</label>
          <div className="form-group">
            <input
              className="form-field"
              type="text"
              id="email"
              placeholder="Enter email id"
              {...register("email")}
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="event" className="form-label">
            {" "}
            Date Range{" "}
          </label>
          <div className="form-group">
            <CustomDateRangePicker
              date={date}
              onDateChange={handleDateChange}
              selectedDateRange={selectedDateRange}
              onClearDateRange={onClearDateRange}
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="contact" className="form-label">Contact</label>
          <div className="form-group">
            <input
              className="form-field"
              type="text"
              id="contact"
              placeholder="Enter contact no"
              {...register("contact")}
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="user_pay_status">User Pay Status<span style={{ color: "red" }}>*</span></label>
          <div className="form-group">
            <Controller
              name="user_pay_status"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Event Tag is required",
                },
              }}
              render={({ field }) => (
                <Select
                  className="controller-select"
                  components={animatedComponents}
                  options={userPayStatusOptions}
                  onChange={(selectedOptions) => {
                    field.onChange(selectedOptions);
                  }}
                  value={field.value}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="filter-buttons-row">
        <Button className="pi-btn-primary" type="primary" onClick={handleApply}>
          Apply
        </Button>
        <Button className="pi-btn-secondary" onClick={clearFilters}>
          Clear
        </Button>
      </div>
    </div>
  );

  return (
    <Fragment>
      <div
        onClick={onToggle}
        className={menuOpen ? `page-open-header${matches ? "-mobile" : ""}` : `page-header${matches ? "-mobile" : ""}`}
      >
        <Card>
          {!matches && <Breadcrumb
            items={[
              { title: "Home" },
              { title: "Settings" },
              { title: "List of Transactions (RazorPay)" },
            ]}
          />}
          <div className="main-title-container">
            <div className="title-add-mobile">
              <h5 className="main-content-title">List Of Transactions (RazorPay)</h5>
            </div>
          </div>

          <div className="main-content-card">
            <div className="filter-section-container">
              {matches &&
                <div className="filter-section-container">
                  <FilterData content={FilterSection} open={open} handleOpenChange={handleOpenChange} />
                </div>
              }
            </div>
            {!matches &&
              <FilterSection />
            }
            <div className='mt-5'>

              <Table
                columns={columns}
                data={filteredData.length > 0 ? filteredData : partialData}
                pagination
              />
            </div>
          </div>
        </Card>
      </div>
    </Fragment>
  );
};

export default PaymentView;
