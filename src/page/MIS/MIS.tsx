import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Card, Breadcrumb, Button, Radio, RadioChangeEvent } from "antd";
import Table from '../../components/Table/DataTable';
import moment from 'moment';
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Emailer from "../../components/Modal/Emailer";
import { Icon } from "@iconify-icon/react";
import ClipLoader from "react-spinners/ClipLoader";
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import FilterData from '../../components/Modal/FilterData';
import { MIS_getAPI, getFacilityApi } from '../../components/apiFile/Service';
import CustomDateRangePicker from '../../components/Modal/CustomDateRangePicker';
import { useSelector } from "react-redux";
import Excel from '../../components/Helpers/Excel';

function MIS({ matches, menuOpen, onToggle, modulePermissionsData }) {
    const { register, watch, setValue, reset, control } = useForm();
    const [data, setData] = useState([])
    const [facilityList, setFacilityList] = useState<{ label: string, value: string }[]>([]);
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);

    const loggedInUser = localStorage.getItem("auth");
    const animatedComponents = makeAnimated();
    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)


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


    const [openEmailer, setOpenEmailer] = useState(false);
    const handleEmailerChange = (newOpen: boolean) => {
        setOpenEmailer(newOpen);
    };
    const hide = () => {
        setOpenEmailer(false);
    };

    const userId = watch("UserId")
    const facility = watch("facility");
    const startDate = watch("start");
    const endDate = watch("end");


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


    const columns = [
        {
            name: 'Booking Date',
            selector: row => moment(row?.booking_date).format('DD-MM-YYYY'),
            wrap: true,
            sortable: false,
        },
        {
            name: 'Facility',
            selector: row => row?.facility_name,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Username',
            selector: row => row?.user_full_name,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Booked Slots',
            selector: row => `${row?.start_time} - ${row?.end_time}`,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Slot Price',
            selector: row => row?.slot_price,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Court',
            selector: row => row?.court_name || 'N/A',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Booking Status',
            selector: row => row?.status,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Payment Status',
            selector: row => row?.payment_status,
            sortable: true,
            wrap: true,
        },
        // {
        //     name: 'Payment ID',
        //     selector: row => moment(row?.createdAt).format('ddd, D MMM YY '),
        //     sortable: true,
        //     wrap: true,
        // },
        {
            name: 'Booking ID',
            selector: row => row?._id,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Discount Coupon',
            selector: row => row?.coupon_name ? row?.coupon_name : 'N/A',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Razorpay ID',
            selector: row => row?.razor_id,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Amount',
            selector: row => row?.total_amount,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Source',
            selector: row => row?.source,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Action',
            selector: row => row,
            sortable: true,
            wrap: true,
            cell: row =>
                <div className='action-button-container'>
                    {/* {modulePermissionsData?.view &&
                        <button className='action-button view-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'view') }}><Icon icon="raphael:view" /></button>
                    }
                    {modulePermissionsData?.edit &&
                        <button className='action-button edit-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'edit') }} ><Icon icon="mdi:pencil-outline" /></button>
                    }
                    {modulePermissionsData?.delete &&
                        <button className='action-button delete-button' onClick={(e) => { e.preventDefault(); handleDeleteModal(row._id) }}>
                            <Icon icon="mdi:trash-can" />
                        </button>
                    } */}
                </div >

            ,
        },

    ];



    const getMISData = async () => {
        let page = 1;
        let limit = 400;
        let allData: any = []; // Array to hold all fetched data
        setLoading(true);
        try {
            while (true) { // Loop until we break out of it
                const response = await MIS_getAPI(loggedInUser, page, limit, startDate ? startDate : '', endDate ? endDate : '', facility ? facility?.value : '', userId ? userId : '');
                const fetchedData = response.result.mis_detailed_report;

                if (fetchedData.length === 0) {
                    break; // Break the loop if no more data is returned
                }

                allData = [...allData, ...fetchedData]; // Append new data to allData
                page++; // Increment the page number for the next fetch
            }
            setLoading(false);
            setData(allData); // Set the state with all fetched data
            console.log("🚀 ~ file: PartnerSettlements.tsx:83 ~ getSettlementsData ~ response.result:", allData);
        } catch (error) {
            console.error('Error fetching settlement data:', error);
        }
    }


    useEffect(() => {
        getMISData();
        getAllFacility();
    }, [])

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

    };

    const clearFilters = () => {
        onClearDateRange();
        reset({
            fullname: "", facility: "", start: "",
            end: "", UserId: ""
        });
        setTriggerFetch(true);
    };


    const handleApply = () => {
        getMISData();
    }


    useEffect(() => {
        if (triggerFetch) {
            getMISData(); // Re-fetch data when triggered
            setTriggerFetch(false); // Reset trigger
        }
    }, [triggerFetch]);


    const FilterSection = () => {
        return (
            <>

                <div className="filter-form">
                    <div className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"}`}>
                        <div className="input-group">
                            <label htmlFor="name" className="form-lable">UserId</label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="name"
                                    placeholder="Enter title"
                                    {...register('User Id')}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="facility_id" className="form-lable">Facility</label>
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
                                            // isMulti
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
                    {!matches && <div className="filter-buttons-row">
                        <Button className="pi-btn-primary" key="confirm" type="primary"
                            onClick={
                                handleApply

                            }
                        >Apply</Button>
                        <Button
                            className="pi-btn-secondary"
                            key="cancel"
                            onClick={() => {
                                clearFilters();

                            }}
                        >
                            Clear
                        </Button>

                    </div>}
                </div>
                {matches && <div className="filter-buttons-row">
                    <Button className="pi-btn-primary" key="confirm" type="primary"
                        onClick={
                            handleApply

                        }
                    >Apply</Button>
                    <Button
                        className="pi-btn-secondary"
                        key="cancel"
                        onClick={() => {
                            clearFilters();

                        }}
                    >
                        Clear
                    </Button>

                </div>}
            </>
        )
    }

    return (
        <Fragment>
            <div
                onClick={onToggle}
                className={menuOpen ? `page-open-header${matches ? "-mobile" : ""}` : `page-header${matches ? "-mobile" : ""}`}
            >
                <Card>
                    {!matches && <Breadcrumb
                        items={[
                            {
                                title: "Home",
                            },
                            {
                                title: "Analytics",
                            },
                            {
                                title: "Account Activity",
                            }
                        ]}
                    />}
                    <form className="">
                        <div className="main-title-container">
                            <div className="title-add-mobile">
                                <h5 className="main-content-title">Account Activity(MIS)</h5>
                                {matches && modulePermissionsData?.add &&
                                    <>
                                        <Button
                                            className="pi-btn-primary"
                                            key="confirm" type="primary"
                                            onClick={() => setOpenEmailer(true)}
                                        >
                                            Send Email
                                            <Emailer emailerOpen={openEmailer} handleOpenChange={handleEmailerChange} onHide={hide} />
                                        </Button>
                                        {modulePermissionsData?.export && data.length > 0 &&
                                            <Excel page={'MIS'} importdata={data} />
                                        }
                                    </>

                                }
                            </div>

                            <div className='title-buttons' >
                                {!matches && modulePermissionsData?.add &&
                                    <>
                                        <Button
                                            className="pi-btn-primary"
                                            key="confirm" type="primary"
                                            onClick={() => setOpenEmailer(true)}
                                        >
                                            Send Email
                                            <Emailer emailerOpen={openEmailer} handleOpenChange={handleEmailerChange} onHide={hide} />
                                        </Button>
                                        {modulePermissionsData?.export && data.length > 0 &&
                                            <Excel page={'MIS'} importdata={data} />
                                        }
                                    </>
                                }
                            </div>
                        </div>

                        <div className="filter-section-container " style={{ marginBottom: '1rem' }}>
                            {matches &&
                                <div className="filter-section-container">
                                    <FilterData content={FilterSection} open={open} handleOpenChange={handleOpenChange} />
                                </div>
                            }
                        </div>
                        <div className="main-content-card">
                            {!matches &&
                                // <FilterSection />
                                <div className="filter-form">
                                    <div className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"}`}>
                                        <div className="input-group">
                                            <label htmlFor="title" className="form-lable">UserId</label>
                                            <div className="form-group">
                                                <input
                                                    className="form-field"
                                                    type="text"
                                                    id="title"
                                                    placeholder="Enter User Id"
                                                    {...register('UserId')}
                                                />
                                            </div>
                                        </div>

                                        <div className="input-group">
                                            <label htmlFor="facility" className="form-lable">Facility</label>
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
                                                            // isMulti
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
                                    {!matches && <div className="filter-buttons-row">
                                        <Button className="pi-btn-primary" key="confirm" type="primary"
                                            onClick={
                                                handleApply

                                            }
                                        >Apply</Button>
                                        <Button
                                            className="pi-btn-secondary"
                                            key="cancel"
                                            onClick={() => {
                                                clearFilters();

                                            }}

                                        >
                                            Clear
                                        </Button>

                                    </div>}
                                </div>
                            }


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
                                    <Table
                                        columns={columns}
                                        data={data}
                                    />

                            }
                        </div>
                    </form>
                </Card>

            </div >

        </Fragment >
    )
}

export default MIS