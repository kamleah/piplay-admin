import React, { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { filterRevenue, getBookingsApi, getFacilityApi } from '../../components/apiFile/Service';
import CustomDateRangePicker from '../../components/Modal/CustomDateRangePicker';
import moment from 'moment';
import { Breadcrumb, Button, Card } from 'antd';
import FilterData from '../../components/Modal/FilterData';
import Table from '../../components/Table/DataTable';
import CancelAndRefundDetails from '../../components/Modal/CancelAndRefundDetails';
import { Icon } from '@iconify-icon/react';
import ClipLoader from "react-spinners/ClipLoader";
import ToastMessage from '../facilator/ToastMessage/ToastMessage';
import { toast } from 'react-toastify';



interface FacilityOption {
    label: string;
    location: string;
    value: string;
    slot_size: number;
}


type BookingSlot = {
    date: string;
    startTime: string;
    endTime: string;
    name: string;
};

type Facility = {
    _id: string;
    name: string;
    address: string;
};

type RecordItem = {
    _id: string;
    booking_slots?: BookingSlot[];
    facility?: Facility;
    booking_date?: string;
    userData?: {
        firstname: string;
        lastname: string;
    };
    createdAt: string;
};

export default function CancelAndRefund({ matches, menuOpen, onToggle, modulePermissionsData }) {
    const { register, watch, setValue, reset, control } = useForm();
    const loggedInUser = localStorage.getItem("auth");
    const animatedComponents = makeAnimated();
    const loggedUserDetails = useSelector(
        (state: any) => state.user.loggedUserDetails
    );

    const [facilityList, setFacilityList] = useState<FacilityOption[]>([]);
    const [filteredData, setFilteredData] = useState<RecordItem[]>([]);
    const [showOffersViewModal, setShowOffersViewModal] = useState(false);
    const [filterOn, setFilterOn] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    const [tabledata, setTableData] = useState<RecordItem[]>([]);
    const [partialData, setPartialData] = useState<any[]>([]);
    const [rowdata, setRowdata] = useState({});




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
            setValue('facility', { label: filteredFacilities[0]?.name, value: filteredFacilities[0]?._id });
        }
    };

    const handleshowModal = async (row: any, type: any) => {
        setRowdata(row);
        if (type == 'view') {
            setShowOffersViewModal(true);
        }
    };
    const handleCancelDelete = () => {
        setShowOffersViewModal(false);
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
        setFilteredData(tabledata)
    };
    const onClearFilter = () => {
        setFilterOn(false)
        onClearDateRange();
        reset({
            facility: "",
            start: "",
            end: "",
            bookingId: "",
            fullname: ""
        });
    };


    const filterData = async () => {

        const facility = watch("facility") as FacilityOption | undefined;
        const BookingId = watch("bookingId")
        let filtered: RecordItem[] = tabledata || [];

        const startDate = watch("start");
        const endDate = watch("end");
        const fullname = watch("fullname");

        if (startDate && endDate) {
            filtered = filtered.filter((item) => {
                const itemDate = moment(item.booking_date, "DD-MM-YYYY");
                return itemDate.isBetween(startDate, endDate, null, "[]");
            });
        }
        if (facility) {
            filtered = filtered.filter(
                (item) => item.facility && item.facility._id === facility.value
            );

        }
        if (BookingId) {
            filtered = filtered.filter((item) =>
                item._id === BookingId
            )
        }
        if (fullname) {
            filtered = filtered.filter((item) => {
                const firstName = item.userData?.firstname?.toLowerCase();
                const lastName = item.userData?.lastname?.toLowerCase();
                const searchQuery = fullname.toLowerCase();
                return (
                    (firstName && firstName.includes(searchQuery)) ||
                    (lastName && lastName.includes(searchQuery)) ||
                    ((firstName && lastName) && `${firstName} ${lastName}`.toLowerCase().includes(searchQuery))
                );
            });
        }
        const orderFilterData = filtered.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));

        setFilteredData(orderFilterData)
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
            name: "Created At", 
            selector: (row) => moment(row?.createdAt).format("DD-MM-YYYY  hh:mm A"),
            sortable: true,
            wrap: true,
        },
        {
            name: "Booking Id",
            selector: row => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {row._id ? row._id : "N/A"}
                    <Icon
                        icon="solar:copy-bold"
                        height="18"
                        width="18"
                        style={{ paddingLeft: '5px', cursor: 'pointer' }}
                        onClick={() => row._id && copyToClipboard(row._id)}
                    />
                </div>
            ),
            sortable: true,
            wrap: true,
        },
        {
            name: "Facility Name",
            selector: (row) => row?.facility?.name,
            sortable: true,
            wrap: true,
        },

        {
            name: "User",
            selector: (row) => `${row?.userData?.firstname} ${row?.userData?.lastname}`,
            sortable: true,
            wrap: true,
        },
        {
            name: "BookedOn",
            selector: (row) => moment(row?.booking_date).format("DD-MM-YYYY  hh:mm A"),
            sortable: true,
            wrap: true,
        },
        {
            name: "Booking Status",
            selector: (row) => row?.status,
            sortable: true,
            wrap: true,
        },
        {
            name: "Start Time",
            selector: row => moment(row?.start_time, "HH:mm").format('hh:mm A'),
            sortable: true,
            wrap: true,
        },
        {
            name: "End Time",
            selector: row => moment(row?.end_time, "HH:mm").format('hh:mm A'),
            sortable: true,
            wrap: true,
        },
        {
            name: "RazorID",
            selector: (row) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {row?.razor_id ? row?.razor_id : "------"}
                    {(row?.razor_id !== "NA" && row?.razor_id !== "") && (
                        <Icon
                            icon="solar:copy-bold"
                            height="18"
                            width="18"
                            style={{ paddingLeft: '5px', cursor: 'pointer' }}
                            onClick={() => copyToClipboard(row?.razor_id)}
                        />
                    )}
                </div>
            ),
            sortable: true,
            wrap: true,
        },
        {
            name: "Payment Status",
            selector: (row) => row?.payment_status,
            sortable: true,
            wrap: true,
        },
        {
            name: "OrderId",
            selector: (row) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {row?.razorpay_order_id ? row?.razorpay_order_id : "N/A"}
                    {(row?.razorpay_order_id && row?.razorpay_order_id !== "N/A") && (
                        <Icon
                            icon="solar:copy-bold"
                            height="18"
                            width="18"
                            style={{ paddingLeft: '5px', cursor: 'pointer' }}
                            onClick={() => copyToClipboard(row?.razorpay_order_id)}
                        />
                    )}
                </div>
            ),
            sortable: true,
            wrap: true,
        },
        {
            name: "Total Amount",
            selector: (row) => row?.total_amount / 100,
            sortable: true,
            wrap: true,
        },
        {
            name: "Refund Amount",
            selector: (row) => row?.total_amount / 100,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Actions',
            selector: row => row.year,
            sortable: true,
            wrap: true,
            cell: row =>
            (
                <div className='action-button-container'>
                    {modulePermissionsData?.view &&
                        <button className='action-button view-button' onClick={() =>
                            handleshowModal
                                (row, 'view')}>
                            <Icon icon="raphael:view" />
                        </button>}
                    {modulePermissionsData?.view &&
                        <button className='action-button view-button'>
                            <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} onClick={() => copyToClipboard(row)} />
                        </button>}
                </div>
            )
        },
    ];



    const getBookedUsers = async (user: string) => {
        setLoading(true);
        const pageSize = 500;
        let page = 1;
        let allData: any[] = [];
        let iterationCount = 0;
        let hasMoreData = true;
        while (hasMoreData) {
            const response = await getBookingsApi(user, page, pageSize);
            if (response && response.data) {
                const filteredData = response.data.filter(item => {
                    if (!loggedUserDetails?.roleId) {
                        return item.status === "Cancelled";
                    } else {
                        return item.facility?._id === loggedUserDetails?.facility_id && item.status === "Cancelled";
                    }
                });
                allData = [...allData, ...filteredData];
                iterationCount++;
                if (iterationCount === 2) {
                    const orderFilterData = allData.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
                    setPartialData(orderFilterData);
                }
                hasMoreData = response.data.length === pageSize;
            } else {
                hasMoreData = false;
            }
            page++;
        }

        setLoading(false);
        setTableData(allData);
        setFilteredData(allData);
    };


    useEffect(() => {
        if (loggedInUser) {
            getBookedUsers(loggedInUser);
        }
        getAllFacility(); // Fetch the list of facilities when component mounts
    }, []);

    const FilterSection = () => {
        return (
            <>
                <div className="filter-form">
                    <div
                        className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"
                            }`}
                    >
                        <div className="input-group">
                            <label htmlFor="bookingId" className="form-label">Booking ID</label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="bookingId"
                                    placeholder="Enter Id"
                                    {...register("bookingId")}
                                />
                            </div>
                        </div>
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
                                            defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                                            options={facilityList}
                                            placeholder="Select a facility"
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
                                    title: "Cancel And Refund",
                                },
                            ]}
                        />
                    )}
                    <div className="main-title-container">
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">Cancel And Refund</h5>
                            {matches && modulePermissionsData?.add && (
                                <div className="title-buttons">
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
                    </div>
                    {!matches && (
                        <div className="main-content-card">
                            <div className="filter-form">
                                <div className="filter-fields">
                                    {/* {loggedUserDetails?.roleId == null &&  */}
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
                                                        }
                                                        options={facilityList}
                                                        placeholder="Select a facility"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    {/* } */}
                                    <div className="input-group">
                                        <label htmlFor="bookingId" className="form-label">Booking ID</label>
                                        <div className="form-group">
                                            <input
                                                className="form-field"
                                                type="text"
                                                id="bookingId"
                                                placeholder="Enter Id"
                                                {...register("bookingId")}
                                            />
                                        </div>
                                    </div>
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
                    <CancelAndRefundDetails
                        visible={showOffersViewModal}
                        onCancel={handleCancelDelete}
                        name="Cancel And Refund Details"
                        row={rowdata}
                    />
                </Card>
            </div>
        </Fragment >
    )
}