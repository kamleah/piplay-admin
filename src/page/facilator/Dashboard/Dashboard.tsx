import React, { Fragment, useEffect, useMemo, useCallback, useState, } from "react";
import { Card, Breadcrumb, Button } from "antd";
import { Controller, useForm } from "react-hook-form";
import { Icon } from "@iconify-icon/react";

// import { useDeepCompareEffect } from 'react-use';

import {
  filterCourt,
  filterRevenue,
  getAllCourt,
  getAllRevenue,
  getFacilityApi,
  getRevenueAdmin,
} from "../../../components/apiFile/Service";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Excel from "../../../components/Helpers/Excel";
import { useSelector } from "react-redux";

import moment from "moment";
import FilterData from "../../../components/Modal/FilterData";
import "./Dashboard.css";
import CustomDateRangePicker from "../../../components/Modal/CustomDateRangePicker";
import ClipLoader from "react-spinners/ClipLoader";

const Dashboard = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {
  const { register, watch, setValue, reset, control } = useForm();
  const [data, setData] = useState([]);
  const [revenue_dashboard_data, setRevenue_dashboard_data] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [facilityList, setFacilityList] = useState([]);
  const [courtList, setCourtList] = useState([]);
  const [allCourtsData, setAllCourtsData] = useState<any[]>([]);
  const [bookingData, setBookingData] = useState<any[]>([]);
  const [selectededCourtsList, setSelectededCourtsList] = useState<any[]>([]);
  const [filterOn, setFilterOn] = useState(false);
  const animatedComponents = makeAnimated();
  const [Loading, setLoading] = useState(false);
  const loggedInUser = localStorage.getItem("auth");
  var location = watch("location");
  var court = watch("court");
  var facility = watch("facility");
  console.log("🚀 ~ Dashboard ~ facility:", facility)
  var start_date = watch("start");
  var end_date = watch("end");
  const loggedUserDetails = useSelector(
    (state: any) => state.user.loggedUserDetails
  );


  const isAdmin = () => {
    return false ? loggedUserDetails.roles[0] === "Admin" : false;
  };
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  console.log('loginuser', loggedUserDetails)

  const [selectedDateRange, setSelectedDateRange] =
    useState("Select Date Range");

  const handleDateChange = (newDateRange) => {
    setDate(newDateRange);
    const startDate = newDateRange[0].startDate;
    const endDate = newDateRange[0].endDate;
    setValue("start", moment(startDate).format("YYYY-MM-DD"));
    setValue("end", moment(endDate).format("YYYY-MM-DD"));
    setSelectedDateRange(
      `${moment(startDate).format("DD/MM/YYYY")} - ${moment(endDate).format(
        "DD/MM/YYYY"
      )}`
    );
  };

  const getAllData = useCallback(async () => {
    setLoading(true);

    let response;
    if (!loggedUserDetails?.roleId) {
      response = await getAllRevenue(loggedInUser);
    } else {
      response = await getRevenueAdmin(loggedInUser, loggedUserDetails?.facility_id);
    }

    if (response?.result) {
      setData(response.result);
    }

    setLoading(false);
  }, [loggedUserDetails?.roleId, loggedUserDetails?.facility_id, loggedInUser]);



  useEffect(() => {
    // Parallelizing independent API calls
    const fetchData = async () => {
      setLoading(true);

      try {
        await Promise.all([getAllData(), getCourt(), getAllFacility()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const formattedCourt = useMemo(() => (
    Array.isArray(court)
      ? court.some(c => c.value === 'all')
        ? []
        : court.map(c => c.value)
      : [court?.value].filter(Boolean)
  ), [court]);

  const filterData = useCallback(async () => {
    setFilterOn(true);


    let response = await filterRevenue(
      loggedInUser,
      location || "",
      formattedCourt,
      !loggedUserDetails?.roleId ? (facility || "").value : loggedUserDetails?.facility_id,
      start_date || "",
      end_date || ""
    );

    if (response?.statusCode === 0) {
      mapRevenueDashboardDate(response?.result);
      setData(response?.result);
    } else {
      setData([]);
    }
  }, [court, location, loggedInUser, loggedUserDetails, facility, start_date, end_date]);

  const onClearDateRange = useCallback(() => {
    setDate([{
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    }]);
    setSelectedDateRange("Select Date Range");
    setValue("start", "");
    setValue("end", "");
  }, []);
  const onClearFilter = useCallback(() => {
    setFilterOn(false);
    getAllData();
    onClearDateRange();
    reset({
      location: "",
      court: null,
      facility: null,
      start: "",
      end: "",
    });
  }, [getAllData, onClearDateRange, reset]);

  const getAllFacility = useCallback(async () => {
    let response = await getFacilityApi(loggedInUser);
    if (!loggedUserDetails?.roleId) {
      let venues = response?.result?.map((data) => ({
        label: data?.name,
        value: data?._id
      }));
      setFacilityList(venues);
    } else {
      const filteredFacilities = response?.result.filter(item => loggedUserDetails?.facilities.includes(item._id));
      setFacilityList(filteredFacilities.map((data) => ({
        label: data?.name,
        value: data?._id
      })));
      setValue('facility', {label : filteredFacilities[0]?.name, value: filteredFacilities[0]?._id});
    }
  }, [loggedInUser]);

  const getCourt = async () => {
    let response
    if (!loggedUserDetails?.roleId) {
      response = await getAllCourt(loggedInUser);
    } else {
      response = await filterCourt(loggedInUser, '', loggedUserDetails?.facility_id, "");
    }
    let venue = response?.result?.map((data) => {
      return { label: data?.name, value: data?._id, facility_id: data?.facility_id };
    });    
    setCourtList(venue);
    // if (loggedUserDetails?.roleId) {
    // setValue('court',venue);
    // }
  };

  const onChangeCourts = (selectedCourtIds, options) => {
    const allSelected = selectedCourtIds.some(court => court.value === 'all');
    if (allSelected) {
      const availableCourts = courtList.filter((court: any) =>
        options.some(option => option.value === court.value)
      );
      setSelectededCourtsList(availableCourts);
      const courtsArray = availableCourts.map((court: any) => court.value);
      const filteredData = allCourtsData?.map((timeSlot) => {
        const filteredSlots = timeSlot.slots.filter((slot) =>
          courtsArray.includes(slot.court_id)
        );
        return filteredSlots?.length > 0 ? { ...timeSlot, slots: filteredSlots } : null;
      }).filter((timeSlot) => timeSlot !== null);
      setBookingData(filteredData);
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
        icon: "solar:hand-money-outline",
        label: "Booked Slots",
        value: data?.booked_slots ? data?.booked_slots : "0",
        growthPercentage: calculateGrowth(
          data?.booked_slots,
          data?.last_booked_slots
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
      // {
      //   icon: "solar:hand-money-outline",
      //   label: "Commission Shared",
      //   value: formatValue(data?.commision_shared),
      //   growthPercentage: calculateGrowth(
      //     data?.commision_shared,
      //     data?.last_commision_shared
      //   ),
      // },
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
        value: data?.cancel_amount ? data?.cancel_amount.toFixed(2) : "0",
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

  const mappedData = useMemo(() => {
    if (data) {
      return mapRevenueDashboardDate(data);
    }
    return null;
  }, [data]);

  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const FilterSection = () => {
    return (
      <>
        <div className="filter-form">
          <div
            className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"
              }`}
          >
            {!isAdmin() && (
              <div className="input-group">
                <label htmlFor="event" className="form-lable">
                  {" "}
                  Location
                </label>
                <div className="form-group">
                  <Controller
                    name="facility"
                    control={control}
                    render={({ field }) => (
                      <Select
                        // closeMenuOnSelect={false}
                        className="controller-select"
                        components={animatedComponents}
                        defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                        options={facilityList}
                        placeholder="Select a facility"
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            )}
            <div className="input-group">
              <label htmlFor="event" className="form-lable">
                Court
              </label>
              <div className="form-group">
                <Controller
                  name="court"
                  control={control}
                  render={({ field }) => (
                    <Select
                      // closeMenuOnSelect={false}
                      className="controller-select"
                      components={animatedComponents}
                      defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                      // isMulti
                      options={facility && facility != '' || facility != undefined ? [] : []}
                      placeholder="Select a court"
                      {...field}
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
          {!matches && (
            <div className="filter-buttons-row">
              <Button
                className="pi-btn-primary"
                key="confirm"
                type="primary"
                onClick={() => {
                  filterData();
                  handleOpenChange(false);
                }}
              >
                Apply
              </Button>
              <Button
                className="pi-btn-secondary"
                key="cancel"
                onClick={() => {
                  onClearFilter();
                  handleOpenChange(false);
                }}
              >
                {" "}
                Clear
              </Button>
            </div>
          )}
        </div>
        {matches && (
          <div className="filter-buttons-row">
            <Button
              className="pi-btn-primary"
              key="confirm"
              type="primary"
              onClick={() => {
                filterData();
                handleOpenChange(false);
              }}
            >
              Apply
            </Button>
            <Button
              className="pi-btn-secondary"
              key="cancel"
              onClick={() => {
                onClearFilter();
                handleOpenChange(false);
              }}
            >
              {" "}
              Clear
            </Button>
          </div>
        )}
      </>
    );
  };
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
          {!matches && (
            <Breadcrumb
              items={[
                {
                  title: "Home",
                },
                {
                  title: "Dashboard",
                },
              ]}
            />
          )}
          {/* <h5 className="main-content-title">{modulePermissionsData?.label}</h5> */}
          <div className="main-title-container">
            <div className="title-add-mobile">
              <h5 className="main-content-title">Revenue</h5>
              {matches && modulePermissionsData?.add && (
                <div className="title-buttons">
                  {modulePermissionsData?.export && (
                    <Excel page={"dashboard"} importdata={[data]} />
                  )}
                  {matches && (
                    <div className="filter-section-container">
                      <FilterData
                        content={FilterSection}
                        open={open}
                        handleOpenChange={handleOpenChange}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="title-buttons">
              {!matches && modulePermissionsData?.export && (
                <Excel page={"dashboard"} importdata={[data]} />
              )}
            </div>
          </div>
          {!matches && (
            <div className="main-content-card">
              <div className="filter-form">
                <div className="filter-fields">
                  {!isAdmin() && (
                    <div className="input-group">
                      <label htmlFor="event" className="form-lable">
                        {" "}
                        Facility
                      </label>
                      <div className="form-group">
                        <Controller
                          name="facility"
                          control={control}
                          render={({ field }) => (
                            <Select
                              // closeMenuOnSelect={false}
                              className="controller-select"
                              components={animatedComponents}
                              defaultValue={
                                field.value ? field.value : undefined
                              } // Conditionally set defaultValue based on field value
                              // isMulti
                              options={facilityList}
                              placeholder="Select a facility"
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                  )}
                  <div className="input-group">
                    <label htmlFor="event" className="form-label">Court</label>
                    <div className="form-group">
                      <Controller
                        name="court"
                        control={control}
                        render={({ field: { onChange, value }, field }) => {
                          const allSelected = value && value.some(court => court.value === 'all');


                          const allOption = { label: "All", value: "all" };


                          const filteredCourtList = allSelected ? [{ label: 'All', value: 'all' }] : facility && facility.value
                            ? [allOption, ...courtList.filter((data: any) => data.facility_id === facility.value)]
                            : [];

                          const options = filteredCourtList.map((option: any) => ({
                            ...option,
                            isDisabled: selectededCourtsList.some(selectedCourt => selectedCourt.value === 'all' && court.value !== 'all'),
                          }));

                          return (
                            <Select
                              closeMenuOnSelect={false}
                              className="controller-select"
                              components={animatedComponents}
                              defaultValue={field.value ? field.value : undefined}
                              isMulti
                              options={options}
                              placeholder="Select a court"
                              onChange={(value) => {
                                onChange(value);
                                onChangeCourts(value, options);
                              }}
                              value={value}
                            />
                          );
                        }}
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

                <div className="filter-buttons-row">
                  <Button
                    className="pi-btn-primary"
                    key="confirm"
                    type="primary"
                    onClick={() => {
                      filterData();
                      handleOpenChange(false);
                    }}
                  >
                    Apply
                  </Button>
                  <Button
                    className="pi-btn-secondary"
                    key="cancel"
                    onClick={() => {
                      onClearFilter();
                      handleOpenChange(false);
                    }}
                  >
                    {" "}
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          )}

          {
            Loading ?
              <div className="loader-container">
                <ClipLoader
                  color={"#F17121"}
                  loading={Loading}
                  size={150}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
              :
              <div className="dashboard-card-grid">
                {revenue_dashboard_data?.map((data: any, index) => {
                  return (
                    <div className="dashboard-card">
                      <div className="top-section">
                        <div className="icon-data-container">
                          <div>
                            <div className="icon-container">
                              <Icon icon={data?.icon} className="card-icon" />
                            </div>
                          </div>
                          <div className="data-container">
                            <h4 className="card-title">{data?.label}</h4>
                            <div style={{ display: "flex", alignItems: "Center" }}>
                              <h1 className="main-data">{data?.value}</h1>
                              <h1 style={{ marginLeft: "10px", fontSize: "15px" }}>{data?.subtext}</h1>
                            </div>
                          </div>
                        </div>
                        {!filterOn &&
                          <div className="growth-since">
                            {data?.growthPercentage > 0 ? (
                              <span className="positive">
                                {" "}
                                + {data?.growthPercentage} %{" "}
                              </span>
                            ) : (
                              <span className="negative">
                                {data?.growthPercentage} %{" "}
                              </span>
                            )}
                            since last month
                          </div>}
                      </div>
                      <div className="bottom-section">
                        <button className="card-button">
                          <Icon icon="mdi:eye" className="button-icon" />
                          View Details
                        </button>
                        <button className="card-button">
                          <Icon icon="octicon:graph-24" className="button-icon" />
                          Show Graph
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
          }
        </Card>
      </div>
    </Fragment>
  );
};
export default Dashboard;
