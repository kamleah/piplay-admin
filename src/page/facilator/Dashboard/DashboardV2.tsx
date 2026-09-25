import React, { Fragment, useEffect, useMemo, useCallback, useState, } from "react";
import { Card, Breadcrumb, Button, Space, Skeleton } from "antd";
import { Controller, useForm } from "react-hook-form";
import { Icon } from "@iconify-icon/react";
import { filterCourt, filterRevenue, getAllCourt, getAllRevenue, getFacilityApi, getRevenueAdmin, } from "../../../components/apiFile/Service";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Excel from "../../../components/Helpers/Excel";
import { useSelector } from "react-redux";
import moment from "moment";
import FilterData from "../../../components/Modal/FilterData";
import "./DashboardV2.css";
import CustomDateRangePicker from "../../../components/Modal/CustomDateRangePicker";
import { Gauge, gaugeClasses, LineChart, lineElementClasses, markElementClasses } from "@mui/x-charts";
import SkeletonInput from "antd/es/skeleton/Input";
import { Box, MenuItem, Select as MuiSelect } from "@mui/material";

const Dashboard = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {
    const { register, watch, setValue, reset, control } = useForm();
    const [data, setData] = useState<any>({});
    const [revenue_dashboard_data, setRevenue_dashboard_data] = useState([]);
    const [court_utilization_data, setCourt_utilization_data] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [facilityList, setFacilityList] = useState([]);
    const [courtList, setCourtList] = useState([]);
    const [allCourtsData, setAllCourtsData] = useState<any[]>([]);
    const [bookingData, setBookingData] = useState<any[]>([]);
    const [selectededCourtsList, setSelectededCourtsList] = useState<any[]>([]);
    const [filterOn, setFilterOn] = useState(false);
    const animatedComponents = makeAnimated();
    const [Loading, setLoading] = useState(false);
    const loggedInUser = localStorage.getItem("auth");

    const [revenueData, setRevenueData] = useState([
        { date: "2024-11-11", revenue: 6, orders: 1 },
        { date: "2024-11-12", revenue: 3, orders: 1 },
        { date: "2024-11-13", revenue: 9.3, orders: 5 },
        { date: "2024-11-14", revenue: 6, orders: 1 },
        { date: "2024-11-15", revenue: 200, orders: 100 },
        { date: "2024-11-16", revenue: 300, orders: 3 },
        { date: "2024-11-17", revenue: 300, orders: 2 },
        { date: "2024-11-18", revenue: 9.3, orders: 1 },
        { date: "2024-11-19", revenue: 600, orders: 6 },
        { date: "2024-11-20", revenue: 3, orders: 1 },
        { date: "2024-11-21", revenue: 1000, orders: 30 },
    ]);

    const [days, setDays] = useState(8);
    const [customDays, setCustomDays] = useState("");

    const handleDaysChange = (event) => {
        const value = event.target.value;

        setDays(value);
    };

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
        return true ? loggedUserDetails.roles[0] === "Admin" : false;
    };
    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

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





    useEffect(() => {

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
            mapRevenueDashboardData(response?.result);
            mapCourtUtilizationData(response?.result)
            setData(response?.result);
        } else {
            setData({});
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
            setValue('facility', { label: filteredFacilities[0]?.name, value: filteredFacilities[0]?._id });
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

    const mapRevenueDashboardData = (data) => {

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
                //need to check
                icon: "clarity:list-solid-badged",
                label: "Total Sales/Revenue",
                value: formatValue(data?.revenue_generated),
                growthPercentage: calculateGrowth(
                    data?.revenue_generated,
                    data?.last_revenue_generated
                ),

                subtext: "₹",
            },
            {
                icon: "healthicons:money-bag-outline",
                label: "Total Bookings amount",
                value: formatValue(data?.revenue_generated),
                growthPercentage: calculateGrowth(
                    data?.revenue_generated,
                    data?.last_revenue_generated
                ),
                subtext: "₹",
            },
            {
                icon: "clarity:list-solid-badged",
                label: "Total GST",
                value: 18000.0,
                growthPercentage: -2.5,
                subtext: "₹",
            },
            {
                icon: "healthicons:money-bag-outline",
                label: "Total Discounts Given in Pi coins",
                value: 5000.0,
                growthPercentage: 3.0,
                subtext: "₹",
            },
            {
                icon: "gridicons:refund",
                label: "Refund Counts",
                value: data?.refunded_count ? data?.refunded_count : "0",
                growthPercentage: calculateGrowth(
                    data?.refunded_count,
                    data?.last_refunded_count
                ),
            },
            {
                icon: "gridicons:refund",
                label: "Total Refunded Amount",
                value: data?.refunded_amount ? data?.refunded_amount : "0",
                growthPercentage: calculateGrowth(
                    data?.refunded_amount,
                    data?.last_refunded_amount
                ),
                subtext: "₹",
            },
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
                icon: "mdi:reschedule",
                label: "Reschedules Count",
                value: data?.no_of_reschedules ? data?.no_of_reschedules : "0",
                growthPercentage: calculateGrowth(
                    data?.no_of_reschedules,
                    data?.last_rno_of_reschedules
                ),
            },
            {
                icon: "mdi:reschedule",
                label: "Fees collected from reschedules",
                value: data?.reschedule_amount_penal
                    ? data?.reschedule_amount_penal
                    : "0",
                growthPercentage: calculateGrowth(
                    data?.reschedule_amount_penaly,
                    data?.last_reschedule_amount_penaly
                ),
                subtext: "₹",
            },
            {
                icon: "fluent:calendar-cancel-20-regular",
                label: "Cancellation Count",
                value: data?.cancel_count ? data?.cancel_count : "0",
                growthPercentage: calculateGrowth(
                    data?.cancel_count,
                    data?.last_cancel_count
                ),
            },
            {
                icon: "fluent:calendar-cancel-20-regular",
                label: "Fees collected from cancellations",
                value: data?.cancel_amount ? data?.cancel_amount.toFixed(2) : "0",
                growthPercentage: calculateGrowth(
                    data?.cancel_amount,
                    data?.last_cancel_amount
                ),
                subtext: "₹",
            },
            {
                icon: "mdi:user-multiple-outline",
                label: "Total Users",
                value: data?.users ? data?.users : "0",
                growthPercentage: calculateGrowth(
                    data?.users,
                    data?.last_users
                ),
            },
            {
                icon: "mdi:user-multiple-outline",
                label: "New Users",
                value: data?.new_users ? data?.new_users : "0",
                growthPercentage: calculateGrowth(
                    data?.new_users,
                    data?.last_new_users
                ),
            },
        ];
        setRevenue_dashboard_data(revenue_dashboard_data);
    };

    const mapCourtUtilizationData = (data) => {
        const calculateGrowth = (current, previous) => {
            return previous
                ? Number(((current - previous) / previous) * 100).toFixed(2)
                : "0.00";
        };

        const formatValue = (value) => {
            return value ? Number(value).toFixed(2) : "0.00";
        };

        let courtUtilizationData: any = [
            {
                icon: "mingcute:hours-line",
                label: "Hours Played",
                value: formatValue(data?.hours_played),
                growthPercentage: calculateGrowth(
                    data?.hours_played,
                    data?.last_hours_played
                ),
                subtext: "hrs",
            },
            {
                icon: "tabler:clock-hour-9",
                label: "Average Play Time",
                value: formatValue(data?.average_play_time),
                growthPercentage: calculateGrowth(
                    data?.average_play_time,
                    data?.last_average_play_time
                ),
                subtext: "hrs",
            },
        ];

        console.log("mapCourtUtilizationData(response?.result)", courtUtilizationData);


        setCourt_utilization_data(courtUtilizationData);
    };

    const mappedData = useMemo(() => {
        if (data) {
            mapCourtUtilizationData(data);
            mapRevenueDashboardData(data);
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
                        {/* {!isAdmin() && ( */}
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
                        {/* )} */}
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
                                    title: "Analytics",
                                },
                                {
                                    title: "Dashboard V2",
                                },
                            ]}
                        />
                    )}
                    {/* <h5 className="main-content-title">{modulePermissionsData?.label}</h5> */}
                    <div className="main-title-container">
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">Dashboard V2</h5>
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
                        <div className="main-content-card-v2">
                            <div className="filter-form">
                                <div className="filter-fields">
                                    {/* {!isAdmin() && ( */}
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
                                    {/* )} */}
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

                    <div className="dashboard-card-grid-v2">
                        {revenue_dashboard_data?.map((data: any, index) => {
                            return (
                                <div className="dashboard-card-v2">
                                    <div className="top-section-v2">
                                        <div className="icon-data-container-v2">

                                            <div className="data-container-v2">
                                                <h4 className="card-title-v2">{data?.label}</h4>
                                                <div style={{ display: "flex", alignItems: "Center" }}>
                                                    {Loading ?

                                                        <SkeletonInput active size={'small'} />

                                                        :
                                                        <>
                                                            <h1 className="main-data-v2">{data?.value}</h1>
                                                            <h1 style={{ marginLeft: "10px", fontSize: "15px" }}>{data?.subtext}</h1>
                                                        </>}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="icon-container-v2">
                                                    <Icon icon={data?.icon} className="card-icon-v2" />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="bottom-section-v2">

                                        <>
                                            {!filterOn &&
                                                <div className="growth-since-v2">
                                                    {Loading ?
                                                        <Skeleton
                                                            paragraph={{ rows: 1, width: [100] }}
                                                            active
                                                            title={false}
                                                        /> :
                                                        <>
                                                            {data?.growthPercentage > 0 ? (
                                                                <span className="positive-v2">
                                                                    {" "}
                                                                    + {data?.growthPercentage} %{" "}
                                                                </span>
                                                            ) : (
                                                                <span className="negative-v2">
                                                                    {data?.growthPercentage} %{" "}
                                                                </span>
                                                            )}
                                                            vs last week
                                                        </>
                                                    }
                                                </div>}
                                        </>


                                        <div className="card-button-container-v2">
                                            <button className="card-button-v2">
                                                <Icon icon="mdi:eye" className="button-icon-v2" />

                                            </button>
                                            {/* <button className="card-button-v2">
                                                <Icon icon="octicon:graph-24" className="button-icon-v2" />
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* } */}
                    <div className="chart-container-v2">
                        <div className="dashboard-card-v2 gap-0">
                            <div className="card-header-v2">
                                <h5 className="main-content-title-2">Revenue Analytics</h5>
                                <Box display="flex" alignItems="center">
                                    <MuiSelect
                                        value={days}
                                        onChange={handleDaysChange}
                                        sx={{ mr: 2, minWidth: 150 }}
                                    >
                                        <MenuItem value={8}>Last 8 Days</MenuItem>
                                        <MenuItem value={16}>Last 16 Days</MenuItem>
                                        <MenuItem value={24}>Last 24 Days</MenuItem>
                                    </MuiSelect>
                                </Box>
                            </div>
                            <LineChart
                                series={[
                                    {
                                        curve: "catmullRom",
                                        data: revenueData.map((data: any) => data?.revenue),
                                        label: 'Revenue',
                                        color: "#F89500",
                                        id: 'RevenueId'
                                    },
                                    {
                                        curve: "catmullRom",
                                        data: revenueData.map((data: any) => data?.orders),
                                        label: 'Orders',
                                        id: 'OrdersId'
                                    },
                                ]}
                                xAxis={[
                                    {
                                        scaleType: "point",
                                        data: revenueData.map((data: any) => moment(data?.date).format("D MMM")),
                                    },
                                ]}
                                sx={{
                                    [`.${lineElementClasses.root}, .${markElementClasses.root}`]: {
                                        strokeWidth: 2,
                                    },
                                    '.MuiLineElement-series-OrdersId': {
                                        strokeDasharray: '5 3',
                                    },
                                }}
                                height={410}
                                grid={{ vertical: true, horizontal: true }}
                            />
                        </div>
                        <div className="dashboard-card-v2">

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Gauge
                                    width={300}
                                    height={200}
                                    value={Number(((data?.hours_played / data?.total_hours) * 100).toFixed(2))}
                                    startAngle={-90}
                                    endAngle={90}
                                    innerRadius="65%"
                                    outerRadius="100%"
                                    sx={(theme) => ({
                                        [`& .${gaugeClasses.valueArc}`]: {
                                            fill: "#fd8100",
                                        },
                                        [`& .${gaugeClasses.referenceArc}`]: {
                                            fill: "#FFCC80",
                                        },
                                        [`& .${gaugeClasses.valueText}`]: {
                                            fontSize: 15,
                                            fontweight: 300,
                                            textAnchor: "middle",
                                            transform: "translate(0px, -20px)",
                                            fill: "#orange",
                                        },
                                    })}
                                    text={({ value }) =>
                                        `${value} %\n${((data?.last_hours_played / data?.last_total_hours) * 100).toFixed(2)}% from last month`
                                    }
                                />
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "1rem",
                                }}
                            >
                                <div
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        backgroundColor: "#fd8100", // Orange color for Utilized
                                        marginRight: "8px",
                                    }}
                                ></div>
                                <div style={{ fontWeight: "bold", marginRight: "8px" }}>
                                    Utilized
                                </div>
                                <div
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        backgroundColor: "#FFCC80", // Grey color for Not Utilized
                                        marginRight: "8px",
                                    }}
                                ></div>
                                <div style={{ fontWeight: "bold" }}>Not Utilized</div>
                            </div>
                            <div
                                style={{
                                    textAlign: "center"
                                }}
                            >
                                <div className="card-title-v2">
                                    Great Progress! 🎉
                                </div>
                                <div className="card-subtitle-v2">
                                    Our achievement increased by <strong>$200,000</strong>;
                                    let’s reach 100% next month.
                                </div>
                            </div>
                            <div className="dashboard-card-court-grid-v2">

                                {court_utilization_data?.map((data: any, index) => {
                                    return (
                                        <div className="dashboard-card-v2">
                                            <div className="top-section-v2">
                                                <div className="icon-data-container-v2">

                                                    <div className="data-container-v2">
                                                        <h4 className="card-title-v2">{data?.label}</h4>
                                                        <div style={{ display: "flex", alignItems: "Center" }}>
                                                            {Loading ?
                                                                <SkeletonInput active size={'small'} />
                                                                :
                                                                <>
                                                                    <h1 className="main-data-v2">{data?.value}</h1>
                                                                    <h1 style={{ marginLeft: "10px", fontSize: "15px" }}>{data?.subtext}</h1>
                                                                </>}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="icon-container-v2">
                                                            <Icon icon={data?.icon} className="card-icon-v2" />
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="bottom-section-v2">
                                                {!filterOn &&
                                                    <div className="growth-since-v2">
                                                        {Loading ?
                                                            <Skeleton
                                                                style={{ padding: '5px' }}
                                                                paragraph={{ rows: 1, width: [100] }}
                                                                active
                                                                title={false}
                                                            /> :
                                                            <>
                                                                {data?.growthPercentage > 0 ? (
                                                                    <span className="positive-v2">
                                                                        {" "}
                                                                        + {data?.growthPercentage} %{" "}
                                                                    </span>
                                                                ) : (
                                                                    <span className="negative-v2">
                                                                        {data?.growthPercentage} %{" "}
                                                                    </span>
                                                                )}
                                                                vs last week
                                                            </>
                                                        }
                                                    </div>}
                                                <div className="card-button-container-v2">
                                                    <button className="card-button-v2">
                                                        <Icon icon="mdi:eye" className="button-icon-v2" />

                                                    </button>
                                                    {/* <button className="card-button-v2">
                                                        <Icon icon="octicon:graph-24" className="button-icon-v2" />
                                                    </button> */}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </Fragment>
    );
};
export default Dashboard;
