import { Breadcrumb, Card, Button } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import { getBookingsApi, getFacilityApi, getFacilityByIdApi } from "../../components/apiFile/Service";
import CustomDateRangePicker from "../../components/Modal/CustomDateRangePicker";
import moment from "moment";
import Excel from "../../components/Helpers/Excel";
import Table from "../../components/Table/DataTable";
import Select from "react-select";
import { toast } from "react-toastify";
import makeAnimated from "react-select/animated";
import { useSelector } from "react-redux";
import FilterData from "../../components/Modal/FilterData";
import { Icon } from "@iconify-icon/react";
import ClipLoader from "react-spinners/ClipLoader";
import ToastMessage from "../facilator/ToastMessage/ToastMessage";
import BookingDataView from "../../components/Modal/BookingDataView";
import Emailer from "../../components/Modal/Emailer";

interface FacilityOption {
  label: string;
  location: string;
  value: string;
  slot_size: number;
}

interface Booking {
  createdAt: string;
  facility: {
    _id: string;
    name: string;
  };
  userData: {
    firstname: string;
    lastname: string;
  };
  booking_date: string;
  status: string;
  start_time: string;
  end_time: string;
  razor_id: string;
  payment_status: string;
  razorpay_order_id: string;
  total_amount: number;
}

const Bookings = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {
  const { register, watch, setValue, reset, control } = useForm();
  const [showViewModal, setShowViewModal] = useState(false);
  const [rowdata, setRowdata] = useState({});
  const [data, setData] = useState<Booking[]>([]);
  const [filteredData, setFilteredData] = useState<Booking[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [partialData, setPartialData] = useState<any[]>([]);
  const [facilityList, setFacilityList] = useState<FacilityOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    bookingDate: "",
    facility: null,
    fullName: ""

  });
  const [selectedDateRange, setSelectedDateRange] =
    useState("Select Date Range");
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [openEmailer, setOpenEmailer] = useState(false);
  const handleEmailerChange = (newOpen: boolean) => {
    if (newOpen) {
      const currentDate = new Date();
      setDate([{
        startDate: currentDate,
        endDate: currentDate,
        key: "selection",
      }]);
    }
    setOpenEmailer(newOpen);
  };
  const hide = () => {
    setStartDate(null);
    setEndDate(null);
    setOpenEmailer(false);
  };

  const animatedComponents = makeAnimated();
  const loggedInUser = localStorage.getItem("auth");
  const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)

  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleCancel = () => {
    setShowViewModal(false);
  };


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
      name: "Booking Date",
      selector: (row: Booking) => row?.booking_date,
      sortable: true,
      wrap: true,
    },

    {
      name: "Facility Name",
      selector: (row: Booking) => row?.facility?.name,
      sortable: true,
      wrap: true,
    },

    {
      name: "User  Id",
      selector: row => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {row.user_id ? row.user_id : "N/A"}
          <Icon
            icon="solar:copy-bold"
            height="18"
            width="18"
            style={{ paddingLeft: '5px', cursor: 'pointer' }}
            onClick={() => row.user_id && copyToClipboard(row.user_id)}
          />
        </div>
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: "Booking Id",
      selector: row => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {row?._id ? row?._id : "N/A"}
          <Icon
            icon="solar:copy-bold"
            height="18"
            width="18"
            style={{ paddingLeft: '5px', cursor: 'pointer' }}
            onClick={() => row?._id && copyToClipboard(row?._id)}
          />
        </div>
      ),
      sortable: true,  
      wrap: true,
    },
    {
      name: "User",
      selector: (row: Booking) => `${row?.userData?.firstname} ${row?.userData?.lastname}`,
      sortable: true,
      wrap: true,
    },
    {
      name: "Phone No",
      selector: row => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {row.userData.mobileno ? row.userData.mobileno : 'N/A'}
          {row.userData.mobileno && (
            <Icon
              icon="solar:copy-bold"
              height="18"
              width="18"
              style={{ paddingLeft: '5px', cursor: 'pointer' }}
              onClick={() => copyToClipboard(row.userData.mobileno)}
            />
          )}
        </div>
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: "BookedOn",
      selector: (row: Booking) => moment(row?.createdAt).format("DD-MM-YYYY  hh:mm A"),
      sortable: true,
      wrap: true,
    },
    {
      name: "Booking Status",
      selector: (row: Booking) => row?.status,
      sortable: true,
      wrap: true,
    },
    {
      name: "Start Time",
      selector: (row: Booking) => moment(row?.start_time, "HH:mm").format('hh:mm A'),
      sortable: true,
      wrap: true,
    },
    {
      name: "End Time",
      selector: (row: Booking) => moment(row?.end_time, "HH:mm").format('hh:mm A'),
      sortable: true,
      wrap: true,
    },
    {
      name: "Slot Price",
      selector: row => row?.slot_ids[0]?.price,
      sortable: true,
      wrap: true,
    },
    {
      name: "Coupon Name",
      selector: row => row?.coupon_name ? row?.coupon_name : "N/A",
      sortable: true,
      wrap: true,
    },
    {
      name: "Discount",
      selector: row => row?.coupon_name ? 'applied' : 'not applied',
      sortable: true,
      wrap: true,
    },
    {
      name: "RazorID",
      selector: (row: Booking) => row?.razor_id ? row?.razor_id : "N/A",
      sortable: true,
      wrap: true,
    },
    {
      name: "Payment Status",
      selector: (row: Booking) => row?.payment_status,
      sortable: true,
      wrap: true,
    },
    {
      name: "OrderId",
      selector: (row: Booking) => row?.razorpay_order_id ? row?.razorpay_order_id : "N/A",
      sortable: true,
      wrap: true,
    },
    {
      name: "Amount",
      selector: (row: Booking) => row?.total_amount / 100,
      sortable: true,
      wrap: true,
    },
    {
      name: "Source",
      selector: (row) => row?.source ?? 'N/A ',
      sortable: true,
      wrap: true,
    },
    {
      name: "Version",
      selector: (row) => row?.apk_version ?? 'N/A',
      sortable: true,
      wrap: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className='action-button-container'>
          {modulePermissionsData?.view &&
            <button className='action-button view-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'view') }} ><Icon icon="raphael:view" /></button>
          }
        </div>
      ),
    },

  ];

  console.log("bookingDatalog====", data);


  const handleShowModal = (row, type: string) => {
    setRowdata(row);
    if (type === 'view') {
      setShowViewModal(true);
    }
  };

  const getBookedUsers = async (user: string) => {
    let page = 1;
    const pageSize = 300;
    let allData: any[] = [];
    let moreDataAvailable = true;

    while (moreDataAvailable) {
      const response = await getBookingsApi(user, page, pageSize);

      if (response.data && response.data.length > 0) {
        allData = [...allData, ...response.data];
        page++;

        const relevantData = loggedUserDetails?.roleId
          ? allData.filter(item => item.facility_id === loggedUserDetails.facility_id)
          : allData;

        const sortedData = relevantData.sort((a, b) =>
          moment(b.booking_date).diff(moment(a.booking_date))
        );

        if (page === 2) {
          setPartialData(sortedData);
        }

        if (response.data.length < pageSize) {
          moreDataAvailable = false;
        }
      } else {
        moreDataAvailable = false;
      }

      setLoading(false);
    }

    const finalData = loggedUserDetails?.roleId
      ? allData.filter(item => item.facility_id === loggedUserDetails.facility_id)
      : allData;

    const orderedFinalData = finalData.sort((a, b) =>
      moment(b.booking_date).diff(moment(a.booking_date))
    );

    setData(orderedFinalData);
    setFilteredData(orderedFinalData);
  };


  useEffect(() => {
    if (loggedInUser)
      getBookedUsers(loggedInUser);
    getAllFacility(); // Fetch the list of facilities when component mounts
  }, []);

  const getAllFacility = async () => {
    let response = await getFacilityApi(loggedInUser);
    if (!loggedUserDetails?.roleId) {
      let venues = response?.result?.map(data => {
        return { "label": data?.name, "location": `${data.address} ${data.city}`, "value": data?._id, "slot_size": data.slot_size }
      });
      setFacilityList(venues);
    } else {
      const filteredFacilities = response?.result.filter(item => loggedUserDetails?.facilities.includes(item._id));
      let venues = filteredFacilities?.map(data => {
        return { "label": data?.name, "location": `${data.address} ${data.city}`, "value": data?._id, "slot_size": data.slot_size }
      });
      setFacilityList(venues);
      setValue('facility_id', { label: filteredFacilities[0]?.name, value: filteredFacilities[0]?._id });
    }
  };

  const handleFilterChange = (id: string, value: any) => {
    setFilters({
      ...filters,
      [id]: value,
    });
  };



  const handleDateChange = (newDateRange) => {
    setDate(newDateRange);
    const startDate = newDateRange[0].startDate;
    const endDate = newDateRange[0].endDate;
    setValue("start", moment(startDate).format("YYYY/MM/DD"));
    setValue("end", moment(endDate).format("YYYY/MM/DD"));
    setSelectedDateRange(
      `${moment(startDate).format("DD/MM/YYYY")} - ${moment(endDate).format(
        "DD/MM/YYYY"
      )}`
    );
  };

  const applyFilters = () => {
    const startDate = watch("start");
    const endDate = watch("end");
    const fullName = watch('fullname');
    const { bookingDate } = filters;
    const facility = watch("facility_id") as FacilityOption | undefined;

    let filtered;
    if (filteredData.length > 0) {
      filtered = [...filteredData];
    } else {
      filtered = [...partialData];
    }

    if (fullName) {
      console.log("fullname =======", fullName);
      const searchQuery = fullName.toLowerCase();
      filtered = filtered.filter(item => {
        const user = item?.userData;
        if (!user) return false; // or return true, depending on your desired behavior
        const firstName = user?.firstname?.toLowerCase();
        const lastName = user?.lastname?.toLowerCase();
        if (!firstName && !lastName) return false; // or return true, depending on your desired behavior
        return (
          (firstName && firstName.includes(searchQuery)) ||
          (lastName && lastName.includes(searchQuery)) ||
          `${firstName} ${lastName}`.includes(searchQuery)
        );
      });
    }

    if (facility) {
      filtered = filtered.filter(
        (item) => item.facility && item.facility._id === facility.value
      );
    }


    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = moment(item.booking_date, "YYYY-MM-DD");
        return itemDate.isBetween(startDate, endDate, null, "[]");
      });
    }


    if (facility) {
      filtered = filtered.filter((item: any) => {
        return item.facility && item.facility._id === facility.value
      });
    }

    filtered.sort((a, b) => moment(b.booking_date).diff(moment(a.booking_date)));


    if (filtered.length === 0) {
      toast(<ToastMessage body={"No Data Found"} type="error" />, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setFilteredData([]);
      setPartialData([]);
    } else {
      setFilteredData(filtered);
    }

  };





  const onClearDateRange = () => {
    setDate([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setSelectedDateRange("Select Date Range");
    setValue("start", "");
    setValue("end", "");
    setStartDate(null);
  };


  const clearFilters = () => {
    onClearDateRange();
    setFilters({
      bookingDate: "",
      facility: null,
      fullName: ""
    });
    setFilteredData(data);
    reset({ fullname: "" , facility_id: ""});
    setValue('facility_id', { label: facilityList[0]?.label, value: facilityList[0]?.value });
  };

  const FilterSection = () => (
    <>
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
            <label htmlFor="facility_id" className="form-label">Facility</label>
            <div className="form-group">
              <Controller
                name="facility_id"
                control={control}
                render={({ field }) => (
                  <Select
                    className="controller-select"
                    components={animatedComponents}
                    options={facilityList}
                    placeholder="Select a facility"
                    {...field} // This automatically includes 'value' and 'onChange'
                  />
                )}
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


        </div>
        {!matches && <div className="filter-buttons-row">
          <Button className="pi-btn-primary" key="confirm" type="primary" onClick={applyFilters}>Apply</Button>
          <Button
            className="pi-btn-secondary"
            key="cancel"
            onClick={clearFilters}
          >
            Clear
          </Button>

        </div>}
      </div>
      {matches && <div className="filter-buttons-row">
        <Button className="pi-btn-primary" key="cancel" type="primary" onClick={applyFilters}>Apply</Button>
        <Button
          className="pi-btn-secondary"
          key="cancel"
          onClick={clearFilters}
        >
          Clear
        </Button>

      </div>}
    </>
  );

  return (
    <Fragment>
      <div
        onClick={onToggle}
        className={
          menuOpen
            ? `page-open-header${matches ? "-mobile" : ""}`
            : `page-header${matches ? "-mobile" : ""}`
        }
      >
        <Card>
          <Breadcrumb
            items={[
              {
                title: "Home",
              },
              {
                title: "Bookings",
              },
            ]}
          />
          <div className="main-title-container">
            <h5 className="main-content-title">Bookings Data</h5>
            <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '5px', paddingBottom: '0.9rem' }}>
              <Button
                className="pi-btn-primary"
                key="confirm" type="primary"
                onClick={() => setOpenEmailer(true)}
              >
                Send Email
                <Emailer emailerOpen={openEmailer} handleOpenChange={handleEmailerChange} onHide={hide} />
              </Button>
              <Excel page={"Bookings"} importdata={filteredData} />
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
              <div className="main-content-card">
                <>
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
                        <label htmlFor="facility_id" className="form-label">Facility</label>
                        <div className="form-group">
                          <Controller
                            name="facility_id"
                            control={control}
                            render={({ field }) => (
                              <Select
                                className="controller-select"
                                components={animatedComponents}
                                options={facilityList}
                                placeholder="Select a facility"
                                {...field} // This automatically includes 'value' and 'onChange'
                              />
                            )}
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


                    </div>
                    {!matches && <div className="filter-buttons-row">
                      <Button className="pi-btn-primary" key="confirm" type="primary" onClick={applyFilters}>Apply</Button>
                      <Button
                        className="pi-btn-secondary"
                        key="cancel"
                        onClick={clearFilters}
                      >
                        Clear
                      </Button>

                    </div>}
                  </div>
                  {matches && <div className="filter-buttons-row">
                    <Button className="pi-btn-primary" key="cancel" type="primary" onClick={applyFilters}>Apply</Button>
                    <Button
                      className="pi-btn-secondary"
                      key="cancel"
                      onClick={clearFilters}
                    >
                      Clear
                    </Button>

                  </div>}
                </>
              </div>}
            {
              loading ?
                <div className="loader-container">
                  <ClipLoader
                    color={"#F17121"}
                    loading={loading}
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
                :
                <div className="mt-5">
                  <Table columns={columns} data={filteredData.length > 0 ? filteredData : partialData} />
                </div>
            }
          </div>
          <BookingDataView
            visible={showViewModal}
            onCancel={handleCancel}
            name={`Booking Data`}
            row={rowdata}
          />
        </Card>
      </div >
    </Fragment >
  );
};

export default Bookings;
