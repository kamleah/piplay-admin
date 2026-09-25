import React, { Fragment, useEffect, useMemo, useCallback, useState, } from "react";
import { Card, Breadcrumb, Button, Space, Skeleton, Grid } from "antd";
import { Controller, useForm } from "react-hook-form";
import { Icon } from "@iconify-icon/react";
import { filterCourt, filterRevenue, getAllCourt, getAllRevenue, getFacilityApi, getRevenueAdmin, } from "../../../components/apiFile/Service";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Excel from "../../../components/Helpers/Excel";
import { useSelector } from "react-redux";
import moment from "moment";
import FilterData from "../../../components/Modal/FilterData";
import "../Dashboard/Dashboard.css";
import "./MatchMetrics.css";
import CustomDateRangePicker from "../../../components/Modal/CustomDateRangePicker";
import SkeletonInput from "antd/es/skeleton/Input";
import { Box, LinearProgress, MenuItem, Select as MuiSelect, Paper, Typography } from "@mui/material";
import { FaRegEye } from "react-icons/fa";

const MatchMetrics = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {
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

    const dummyData = [
        {
            title: "Facility Wise",
            data: [
                { country: "Facility 1", value: 36 },
                { country: "Facility 2", value: 24 },
                { country: "Facility 3", value: 17.5 },
                { country: "Facility 4", value: 15 },
                { country: "Facility 4", value: 15 },
                { country: "Facility 4", value: 15 },
            ],
        },
        {
            title: "City Wise",
            data: [
                { country: "City 1", value: 42 },
                { country: "City 2", value: 20 },
                { country: "City 3", value: 18 },
                { country: "City 4", value: 10 },
            ],
        },
        {
            title: "Scores Shared",
            data: [
                { country: "Instagram", value: 50 },
                { country: "Twitter", value: 30 },
                { country: "Piplay", value: 15 },
                { country: "Facebook", value: 5 },
            ],
        },
    ];
    const calculateTotalValue = (data) => data.reduce((acc, item) => acc + item.value, 0);


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
        setLoading(false);

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
        setLoading(false);

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
                icon: "clarity:list-solid-badged",
                label: "Private Matches Created",
                value: 120,
                growthPercentage: 5.0,
            },
            {
                icon: "clarity:list-solid-badged",
                label: "Public Matches Created",
                value: 150,
                growthPercentage: 10.0,
            },
            {
                icon: "clarity:list-solid-badged",
                label: "Women's Only ",
                value: 80,
                growthPercentage: 8.5,
            },
            {
                icon: "clarity:list-solid-badged",
                label: "Men's Only ",
                value: 90,
                growthPercentage: 6.75,
            },

            {
                icon: "clarity:list-solid-badged",
                label: "Split Payment",
                value: 50,
                growthPercentage: 4.25,
            },
            {
                icon: "clarity:list-solid-badged",
                label: "Partial Payment",
                value: "NIL",
                growthPercentage: 7.5,
            },
            {
                icon: "clarity:list-solid-badged",
                label: "Number of facilities",
                value: 30,
                growthPercentage: 3.0,
            },
            {
                icon: "clarity:list-solid-badged",
                label: "Scores Updated",
                value: 220,
                growthPercentage: 15.0,
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
                icon: "clarity:list-solid-badged",
                label: "No. of Facility Accounts",
                value: 25,
                growthPercentage: 2.5,
            },
            {
                icon: "clarity:list-solid-badged",
                label: "No. of Coaches",
                value: 40,
                growthPercentage: 5.75,
            },
            {
                icon: "clarity:list-solid-badged",
                label: "No. of Players",
                value: 300,
                growthPercentage: 20.0,
            },
            {
                icon: "clarity:list-solid-badged",
                label: "No. of Event Managers",
                value: 15,
                growthPercentage: 2.0,
            },
            {
                icon: "clarity:list-solid-badged",
                label: "No. of Brands",
                value: 10,
                growthPercentage: 1.5,
            },
            {
                icon: "clarity:list-solid-badged",
                label: "Total Users",
                value: 10,
                growthPercentage: 1.5,
            },
            {
                icon: "clarity:list-solid-badged",
                label: "New Users",
                value: 10,
                growthPercentage: 1.5,
            },
        ];
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
                                    title: "Matchmaking",
                                },
                                {
                                    title: "Metrics",
                                },
                            ]}
                        />
                    )}
                    {/* <h5 className="main-content-title">{modulePermissionsData?.label}</h5> */}
                    <div className="main-title-container">
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">Match Metrics</h5>
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
                    <div className="match-chart-container">
                        {dummyData.map((box, boxIndex) => (
                            <div className="match-dashboard-card padding-10">
                                <div className="wise-card-title-container">
                                    <h1 className="main-data-v2">{box.title}</h1>
                                    <Button
                                        className="pi-btn-prima"
                                        key="cancel"
                                        onClick={() => { }}
                                    >
                                        View
                                        <Icon icon="mdi:eye" className="button-icon-v2" />
                                    </Button>
                                </div>
                                <div className="wise-card-title-container">
                                    <div>
                                    <h1 className="main-data-v2">{calculateTotalValue(box.data)}</h1>
                                    <p>Users</p>
                                    </div>
                                   <div>
                                   <div className="capsule-container">
                                    <div></div>
                                    <div className="green-capsule">
                                        +8.02%
                                    </div>
                                    </div>
                                    <p>From Last Month</p>
                                   </div>
                                </div>
                                <Box
                                    mt={2}
                                    maxHeight={200}
                                    overflow="auto"
                                    className="custom-scrollbar"
                                >
                                    {box.data.map((item, index) => (
                                        <Box key={index} mb={2}>
                                            <Box
                                                display="flex"
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <Box display="flex" alignItems="center">
                                                    <Typography>{item.country}</Typography>
                                                    <FaRegEye style={{ marginLeft: 8 }} />
                                                </Box>
                                                <Typography>{item.value}</Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={item.value}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 5,
                                                    backgroundColor: "#f0f0f0",
                                                    "& .MuiLinearProgress-bar": {
                                                        backgroundColor: "#FF7F50",
                                                    },
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </div>
                        ))}

                    </div>
                    <h5 className="main-content-title-3">Profile Types</h5>
                    <div className="dashboard-card-grid-v2">

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
                </Card>
            </div>
        </Fragment>
    );
};
export default MatchMetrics;
