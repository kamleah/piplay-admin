import React, { Fragment, useEffect, useState } from 'react';
import SubHeadTable from './../../components/Table/SubheadTable';
import { Card, Breadcrumb, Button, Radio, RadioChangeEvent } from "antd";
import Emailer from "../../components/Modal/Emailer";
import { getSettlementsCalculations, getFacilityApi } from '../../components/apiFile/Service';
import { Controller, useForm } from "react-hook-form";
import CustomDateRangePicker from "../../components/Modal/CustomDateRangePicker";
import moment from "moment";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import FilterData from "../../components/Modal/FilterData";
import { useSelector } from "react-redux";

interface DataType {
    key: React.Key;
    // _id: string,
    name: string;
    age: number;
    street: string;
    building: string;
    number: number;
    companyAddress: string;
    companyName: string;
    gender: string;
    BookingDate: string;
    BookingName: string;
    BookingID: number;
    finalTBA: number;
    TBA: number;
    NewTBA: number;
    CollectedAmount: number;
    Partner: string;
    PiPlay: number;
    Split: number;
    PiCoins: number;
    PartnerSettlement: number;
}

function PartnerCalculation({ matches, menuOpen, onToggle, modulePermissionsData }) {
    const [data, setData] = useState<any[]>([]);
    const [facilityList, setFacilityList] = useState<{ label: string, value: string }[]>([]);
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [selectedDateRange, setSelectedDateRange] =
        useState("Select Date Range");
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
    const loggedInUser = localStorage.getItem("auth");
    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)

    const { register, watch, setValue, reset, control } = useForm()
    
    const animatedComponents = makeAnimated();

    let facility = watch('facility')
    const startDate = watch("start");
    const endDate = watch("end");

    console.log("startdate-enddate:", startDate, endDate);

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


    const getAllTrasactions = async () => {
        let page = 1
        let limit = 400
        const response = await getSettlementsCalculations(loggedInUser, page, limit, startDate ? startDate : '', endDate ? endDate : '', facility ? facility?.value : '')
        let responseData = response?.result?.all_Transaction
        // if (facility) {
        //     let filteredData = responseData?.filter(item => item.facility_id === facility)
        //     setData(filteredData);}
        const formattedData = responseData?.map((transaction: any) => ({
            key: transaction._id,
            name: `${transaction.usersDetails?.firstname || ''} ${transaction.usersDetails?.lastname || ''}`,
            BookingDate: transaction.bookingDateFormatted || '',
            BookingName: `${transaction.usersDetails?.firstname || ''} ${transaction.usersDetails?.lastname || ''}`,
            BookingID: transaction._id || '',
            finalTBA: transaction.platform_charges != null ? parseFloat(transaction.platform_charges.toFixed(2)) : 0,
            TBA: transaction.final_amount || 0,
            NewTBA: transaction.total_amount_after_adding_discount || 0,
            CollectedAmount: transaction.total_paid_amount_by_user || 0,
            Partner: "N/A", // Not available in the response, use default or replace with actual data
            PiPlay: transaction.discount_by_piplay || 0,
            Split: transaction.discount_by_facility || 0,
            PiCoins: 0, // Not available in the response, default to 0
            PartnerSettlement: transaction.final_amount - (transaction.platform_charges || 0),
        }));

        setData(formattedData);



    }
    useEffect(() => {
        getAllFacility();
        getAllTrasactions();
    }, [])

    useEffect(() => {
        if (triggerFetch) {
            getAllTrasactions(); // Re-fetch data when triggered
            setTriggerFetch(false); // Reset trigger
        }
    }, [triggerFetch]);

    // console.log("Data======", data);

    const handleApply = () => {
        getAllTrasactions();
    }


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
            end: "",
        });
        setTriggerFetch(true);
    };



    const FilterSection = () => (
        <div className="filter-form">
            <div className={`${matches ? "filter-section border-bottom-light" : "filter-fields"}`}>
                {/* <div className="input-group">
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
                </div> */}
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

                {!matches && <div className="filter-buttons-row">
                    <Button className="pi-btn-primary" key="confirm" type="primary" onClick={handleApply}>Apply</Button>
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
                <Button className="pi-btn-primary" key="cancel" type="primary" onClick={handleApply}>Apply</Button>
                <Button
                    className="pi-btn-secondary"
                    key="cancel"
                    onClick={clearFilters}
                >
                    Clear
                </Button>

            </div>}
        </div>
    );


    // const Data: DataType[] = [
    //     {
    //         key: data._id,
    //         name: data.usersDetails.`${firstname} ${lastname}`,
    //         age: 32,
    //         street: 'Lake Park',
    //         building: 'C',
    //         number: 2035,
    //         companyAddress: 'Lake Street 42',
    //         companyName: 'SoftLake Co',
    //         gender: 'M',
    //         BookingDate: '10-11-2024',
    //         BookingName: 'Ankur singh',
    //         BookingID: 599644,
    //         finalTBA: 100,
    //         TBA: 50,
    //         NewTBA: 75,
    //         CollectedAmount: 120,
    //         Partner: "Bob Smith",
    //         PiPlay: 10,
    //         Split: 5,
    //         PiCoins: 1000,
    //         PartnerSettlement: 50,
    //     },

    // ];


    const columns = [
        {
            title: 'Booking ID',
            dataIndex: 'BookingID',
            key: 'BookingID',
            width: 220,
        },
        {
            title: 'Booking Name',
            dataIndex: 'BookingName',
            key: 'BookingName',
            width: 180,
        },
        {
            title: 'Booking Date',
            dataIndex: 'BookingDate',
            key: 'BookingDate',
            width: 100,
        },
        {
            title: 'Pattform charges on the final TBA',
            dataIndex: 'finalTBA',
            key: 'finalTBA',
            width: 100,
        },
        {
            title: 'TBA',
            dataIndex: 'TBA',
            key: 'TBA',
            width: 100,
        },
        {
            title: 'New TBA(slot price - partner discount)',
            dataIndex: 'NewTBA',
            key: 'NewTBA',
            width: 150,
        },
        {
            title: 'Amount collected from user',
            dataIndex: 'CollectedAmount',
            key: 'CollectedAmount',
            width: 150,
        },
        {
            title: 'Discount',
            children: [
                {
                    title: 'Partner',
                    dataIndex: 'Partner',
                    key: 'Partner',
                    width: 100,
                },
                {
                    title: 'Pi Play',
                    dataIndex: 'PiPlay',
                    key: 'PiPlay',
                    width: 100,
                },
                {
                    title: 'Split',
                    dataIndex: 'Split',
                    key: 'Split',
                    width: 100,
                },
            ],
        },
        {
            title: 'Pi Coins',
            dataIndex: 'PiCoins',
            key: 'PiCoins',
            width: 150,
        },
        {
            title: 'Partner settlement(new TBA - platform charges)',
            dataIndex: 'PartnerSettlement',
            key: 'PartnerSettlement',
            width: 150,
        },
        {
            title: 'Partner',
            dataIndex: 'Partner',
            key: 'Partner',
            width: 100,
        },
    ];



    const [openEmailer, setOpenEmailer] = useState(false);
    const handleEmailerChange = (newOpen: boolean) => {
        setOpenEmailer(newOpen);
    };
    const hide = () => {
        setOpenEmailer(false);
    };

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
                                title: "Analytics",
                            },
                            {
                                title: "Partner Calculaion",
                            }
                        ]}
                    />}
                    <div className="main-title-container">
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">Partner Calculation</h5>
                            {matches && modulePermissionsData?.add &&
                                <Button
                                    className="pi-btn-primary"
                                    key="confirm" type="primary"
                                    onClick={() => setOpenEmailer(true)}
                                >
                                    Send Email
                                    <Emailer emailerOpen={openEmailer} handleOpenChange={handleEmailerChange} onHide={hide} />
                                </Button>
                            }
                        </div>
                        <div className='title-buttons' >
                            {!matches && modulePermissionsData?.add &&
                                <Button
                                    className="pi-btn-primary"
                                    key="confirm" type="primary"
                                    onClick={() => setOpenEmailer(true)}
                                >
                                    Send Email
                                    <Emailer emailerOpen={openEmailer} handleOpenChange={handleEmailerChange} onHide={hide} />
                                </Button>
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
                    {!matches &&
                        <div className="main-content-card">
                            <>
                                <div className="filter-form">
                                    <div
                                        className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"
                                            }`}
                                    >
                                      
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
                                                onClick={handleApply}
                                            >
                                                Apply
                                            </Button>
                                            <Button
                                                className="pi-btn-secondary"
                                                key="cancel"
                                                onClick={clearFilters}
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
                                            onClick={handleApply}
                                        >
                                            Apply
                                        </Button>
                                        <Button
                                            className="pi-btn-secondary"
                                            key="cancel"
                                            onClick={clearFilters}
                                        >
                                            {" "}
                                            Clear
                                        </Button>
                                    </div>
                                )}
                            </>
                        </div>}
                    <div className="main-content-card">
                        <SubHeadTable columns={columns} data={data} />
                    </div>
                </Card>
            </div>
        </Fragment>
    )
}

export default PartnerCalculation;