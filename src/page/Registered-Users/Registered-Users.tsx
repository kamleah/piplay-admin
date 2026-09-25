import { Breadcrumb, Button, Card } from 'antd';
import React, { Fragment, useEffect, useState } from 'react'
import Excel from '../../components/Helpers/Excel';
import Table from '../../components/Table/DataTable';
import { Icon } from '@iconify-icon/react';
import { deleteAdminUsers, getAllUsers, getAllUserslist } from '../../components/apiFile/Service';
import { useForm } from 'react-hook-form';
import UserLabel from '../../components/Labels/UserLabel';
import SkillLabel from '../../components/Labels/SkillLabel';
import ToastMessage from '../facilator/ToastMessage/ToastMessage';
import { toast } from "react-toastify";
import { RegisteredUserFilterAPI } from '../../components/apiFile/Service';
import RegisteredUserDetails from '../../components/Modal/RegisteredUserDetails';
import EditRegistration from '../../components/Modal/EditRegistration';
import AddUsers from '../../components/Modal/AddUsers';
import DeleteConfirmation from '../../components/Modal/DeleteConfirmation';
import FilterData from '../../components/Modal/FilterData';
import moment from 'moment';
import CustomDateRangePicker from "../../components/Modal/CustomDateRangePicker";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import ClipLoader from "react-spinners/ClipLoader";
import CopyToClipboard2 from "../../components/CopyToClipboard/CopyToClipboart2";

const RegisteredUser = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {
    const [data, setData] = useState([])
    // const [filterData, setfilterData] = useState([])
    const [showRegisteredViewModal, setShowRegisteredViewModal] = useState(false);
    const [showRegisteredEditModal, setShowRegisteredEditModal] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCity, setSelectedCity] = useState<any[]>([]);
    const [selectedCurrentCity, setSelectedCurrentCity] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState([]);
    const [rowdata, setRowdata] = useState({});
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);
    const { register, handleSubmit, reset, watch, setValue } = useForm()
    const [selectedDateRange, setSelectedDateRange] =
        useState("Select Date Range");
    const animatedComponents = makeAnimated();
    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    var fullname = watch('fullname')
    var email = watch('email')
    var mobileno = watch('mobileno')
    var skill_level = watch('skill_level')
    var city = watch('city')
    var current_city = watch('current_city')
    var pincode = watch('pincode')
    var state = watch('state')

    const loggedInUser = localStorage.getItem("auth");
    //date cal
    const calculateAge = (dob) => {
        if (!dob) {
            return null;
        }
        const today = new Date();
        const birthDate = new Date(dob);
        let age_group = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age_group--;
        }

        return age_group;
    };

    const copyToClipboard = (row) => {
        const rowDetails = JSON.stringify(row, null, 2);
        navigator.clipboard
            .writeText(rowDetails)
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
            name: 'Created Date',
            selector: row => row?.createdAt,
            sortable: true,
            wrap: true,
            cell: row => (
                <div className='playerContainer'>
                    {moment(row?.createdAt).format("DD-MM-YYYY")}
                </div>
            ),
        },
        {
            name: "User ID",
            selector: row => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {row?._id}
                    <Icon
                        icon="solar:copy-bold"
                        height="18"
                        width="18"
                        style={{ paddingLeft: '5px', cursor: 'pointer' }}
                        onClick={() => copyToClipboard(row._id)}
                    />
                </div>
            ),
            wrap: true,
            sortable: true,
        },
        {
            name: 'Full Name',
            selector: row => `${row?.firstname} ${row?.lastname}`,
            sortable: true,
            wrap: true,
        },
        {
            name: "Email ID",
            selector: row => row?.email ? row?.email : 'N/A',
            wrap: true,
            sortable: true,
        },
        {
            name: "Phone Number",
            selector: row => row?.mobileno ? row?.mobileno : 'N/A',
            wrap: true,
            sortable: true,
        },

        {
            name: 'Updated Date',
            selector: row => row?.updatedAt,
            sortable: true,
            wrap: true,
            cell: row => (
                <div className='playerContainer'>
                    {moment(row?.updatedAt).format("DD-MM-YYYY")}
                </div>
            ),
        },
        {
            name: "Age",
            selector: row => calculateAge(row.age_group) !== null ? calculateAge(row.age_group) + ' years' : 'N/A',
            wrap: true,
            sortable: true,
        },
        {
            name: "Gender",
            selector: row => row?.gender ? row?.gender : 'N/A',
            wrap: true,
            sortable: true,
        },
        // {
        //     name: 'Skill Levels',
        //     selector: row => (row?.skill_level)?.label,
        //     sortable: true,
        //     wrap: true,
        //     cell: row =>
        //         <div className='playerContainer'>
        //             <SkillLabel userData={row?.user} />
        //         </div>,
        // },
        {
            name: "Skill",
            selector: row => (row?.skill_level_new[0]?.skill_level.label),
            wrap: true,
            sortable: true,
            cell: row => <SkillLabel skill={row?.skill_level_new[0]?.skill_level?.label || "N/A"} />,
        },
        {
            name: "Pincode",
            selector: row => row?.location ? row?.location : 'N/A',
            wrap: true,
            sortable: true,
        },
        {
            name: "City",
            selector: row => row?.city ? row?.city : 'N/A',
            wrap: true,
            sortable: true,
        },
        {
            name: "Current City",
            selector: row => row?.current_city ? row?.current_city : 'N/A',
            wrap: true,
            sortable: true,
        },
        {
            name: "State",
            selector: row => row?.state || 'N/A',
            wrap: true,
            sortable: true,
        },
        {
            name: "Total Booking",
            selector: row => (row?.bookingcount !== undefined ? row?.bookingcount : 'N/A'),
            wrap: true,
            sortable: true,
        },
        {
            name: "Total Match",
            selector: row => (row?.matchcount !== undefined ? row.matchcount : 'N/A'),
            wrap: true,
            sortable: true,
        },
        {
            name: "Is Delete",
            selector: row => console.log('row---------', row),
            wrap: true,
            sortable: true,
            cell: row => row?.email == null && row?.mobileno == null ? "Yes" : "No"
        },
        {
            name: "App Version",
            selector: row => row?.app_version || 'N/A',
            wrap: true,
            sortable: true,
        },
        {
            name: "Action",
            selector: row => row?.action,
            wrap: true,
            cell: row => (
                <div className='action-button-container'>
                    {modulePermissionsData?.view &&
                        <button className='action-button view-button'
                            onClick={() => handleshowRegisteredModal(row, 'view')}>
                            <Icon icon="raphael:view" />
                        </button>
                    }
                    {modulePermissionsData?.edit &&
                        <button className='action-button edit-button' onClick={() => handleshowRegisteredModal(row, 'edit')}><Icon icon="mdi:pencil-outline" /></button>
                    }
                    {modulePermissionsData?.delete &&
                        <button onClick={() => { handleDeleteConfirmation(row._id) }} className='action-button delete-button'>
                            <Icon icon="clarity:trash-solid" />
                        </button>
                    }
                    {modulePermissionsData?.delete &&
                        <button className='action-button delete-button'>
                            <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} onClick={() => copyToClipboard(row)} />
                        </button>
                    }
                </div>
            ),
        },
    ];

    const getRegisteredUsers = async () => {

        let page = 1;
        let limit = 300;
        let allUsers: any = []; // Array to hold all users

        while (true) {
            let response = await getAllUserslist(loggedInUser, page, limit);

            // Check if the response has users
            if (response.data.length === 0) {
                break; // Exit the loop if no more users are returned
            }

            console.log(response)
            allUsers = [...allUsers, ...response.data]; // Append new users to the allUsers array

            page++; // Increment the page number for the next request
        }
        setLoading(false);
        setData(allUsers)
        // setUsersCurrentCityList(uniqueCurrentCityList)
        // setUsersCityList(uniqueCityList)
    }

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

    const Search = async (search) => {
        const startDate = watch("start");
        const endDate = watch("end");
        if (search === false) {

            setData([]);
            setFilteredData([]);
            toast(<ToastMessage body={"Filters Cleared"} type="success" />, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }

        let page = 1;
        let limit = 300;
        let hasMoreData = true;
        let allData: any = []; // Array to hold all the fetched data

        while (hasMoreData) {
            let response = await RegisteredUserFilterAPI(page, limit, loggedInUser,
                fullname === undefined ? '' : fullname,
                email === undefined ? "" : email,
                mobileno === undefined ? '' : mobileno,
                skill_level === undefined ? '' : skill_level,
                city === undefined ? '' : city,
                current_city === undefined ? '' : current_city,
                pincode === undefined ? '' : pincode,
                startDate === undefined ? '' : startDate,
                endDate === undefined ? '' : endDate,
                state === undefined ? '' : state,
            );

            console.log(response, "filterapiforuser");

            // Check if the response contains data
            if (response?.data && response.data.length > 0) {
                allData = [...allData, ...response.data]; // Concatenate the new data
                page++; // Increment the page for the next request
            } else {
                hasMoreData = false; // No more data found, exit the loop
            }
        }


        // const selectedCityValues = selectedCity?.map(option => option.value);
        // const selectedCurrentCityValues = selectedCurrentCity?.map(option => option.value);

        // const filteredByCity = allData.filter(user =>
        //     selectedCityValues.includes(user.city) || selectedCityValues.length === 0
        // );

        // const filteredByCurrentCity = filteredByCity.filter(user =>
        //     selectedCurrentCityValues.includes(user.current_city) || selectedCurrentCityValues.length === 0
        // );

        // let allFilterData: any = [...filteredByCity,...filteredByCurrentCity]


        // Set the fetched data to the state
        if (allData.length > 0) {
            setData(allData);
            // setFilteredData(allFilterData);
        } else {
            setData([]);
            // setFilteredData(allData);
            if (search === true) {
                toast(<ToastMessage body={"No Data Found"} type="error" />, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        }
    };
    const handleshowRegisteredModal = async (row: any, type: any) => {
        setRowdata(row);
        if (type == 'view') {
            setShowRegisteredViewModal(true);
        } else if (type == 'edit') {
            setShowRegisteredEditModal(true);
        } else if (type == 'add') {
            setRowdata({});
            setShowRegisteredViewModal(false);
            setShowRegisteredEditModal(true);

        }
    };
    const handleDeleteConfirmation = (id) => {
        setUserToDeleteId(id);
        setDeleteConfirmationVisible(true);
    };

    const handleConfirmDelete = async () => {
        if (userToDeleteId) {
            await DeleteFunction(userToDeleteId);
            setDeleteConfirmationVisible(false);
            setShowRegisteredEditModal(false);
            setUserToDeleteId("");
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmationVisible(false);
        setShowRegisteredViewModal(false);
        setShowRegisteredEditModal(false);

        setUserToDeleteId("");
    };

    const DeleteFunction = async (id) => {
        let response = await deleteAdminUsers(loggedInUser, id)
        if (response.code == 'SUCCESS') {
            toast(<ToastMessage body={"User Deleted Successfully"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            getRegisteredUsers();
        } else {
            toast(<ToastMessage body={"Failed To Delete the User"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    useEffect(() => {
        getRegisteredUsers();
    }, [])


    const [open, setOpen] = useState(false);
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    const FilterSection = () => {
        return (<>
            <form>
                <div className="filter-form">
                    <div className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"}`}>
                        <div className="input-group">
                            <label htmlFor="user" className="form-lable">Full Name</label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="eventName"
                                    placeholder="Enter User First Name"
                                    {...register('fullname')}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="user" className="form-lable">Email ID</label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="eventName"
                                    placeholder="Enter email"
                                    {...register('email')}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="user" className="form-lable">Phone Number</label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="eventName"
                                    placeholder="Enter Phone Number"
                                    {...register('mobileno')}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="DateRange" className="form-label">
                                <b>
                                    {" "}
                                    Date Range{" "}
                                </b>
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
                            <label htmlFor="city" className="form-lable">City</label>
                            <div className="form-group">
                                <select id="city" className="form-field" {...register('city')}>
                                    <option value="" selected>
                                        Select City
                                    </option>
                                    {Array.from(new Set(data?.map((user: any) => user?.city))) // Create a Set to remove duplicates
                                        .filter(city => city) // Filter out blank values
                                        .map((city, index) => (
                                            <option key={index} value={city}>{city}</option>
                                        ))}
                                </select>
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="current_city" className="form-lable">Current City</label>
                            <div className="form-group">
                                <select id="current_city" className="form-field" {...register('current_city')}>
                                    <option value="" selected>
                                        Select City
                                    </option>
                                    {Array.from(new Set(data?.map((user: any) => user?.current_city))) // Create a Set to remove duplicates
                                        .filter(city => current_city) // Filter out blank values
                                        .map((city, index) => (
                                            <option key={index} value={current_city}>{current_city}</option>
                                        ))}
                                </select>
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="state" className="form-lable">State</label>
                            <div className="form-group">
                                <select id="state" className="form-field" {...register('state')}>
                                    <option value="" selected>
                                        State
                                    </option>
                                    {Array.from(new Set(data?.map((user: any) => user?.state))) // Create a Set to remove duplicates
                                        .filter(state => state) // Filter out blank values
                                        .map((state, index) => (
                                            <option key={index} value={state}>{state}</option>
                                        ))}
                                </select>
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="user" className="form-lable">Pincode</label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="Number"
                                    id="eventName"
                                    placeholder="Enter Phone Number"
                                    {...register('pincode')}
                                />
                            </div>
                        </div>

                    </div>
                    {!matches && <div className="filter-buttons-row">
                        <Button className="pi-btn-primary" key="confirm" type="primary"
                            onClick={() => {
                                Search(true)
                                handleOpenChange(false);

                            }}
                        >Apply</Button>
                        <Button className="pi-btn-secondary" key="cancel"
                            onClick={() => {
                                reset({
                                    fullname: '',
                                    email: '',
                                    mobileno: '',
                                    skill_level: '',
                                    city: '',
                                    current_city: '',
                                    pincode: '',
                                    state: '',
                                });
                                getRegisteredUsers();
                                handleOpenChange(false);

                            }}
                        > Clear</Button>
                    </div>}
                </div>
                {matches && <div className="filter-buttons-row">
                    <Button className="pi-btn-primary" key="confirm" type="primary"
                        onClick={() => {
                            Search(true)
                            handleOpenChange(false);

                        }}
                    >Apply</Button>
                    <Button className="pi-btn-secondary" key="cancel"
                        onClick={() => {
                            reset({
                                fullname: '',
                                email: '',
                                mobileno: '',
                                skill_level: '',
                                city: '',
                                current_city: '',
                                pincode: '',
                                state: '',
                            });
                            getRegisteredUsers();
                            setSelectedCity([]);
                            setSelectedCurrentCity([]);
                            handleOpenChange(false);

                        }}
                    > Clear</Button>
                </div>}
            </form>
        </>)
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
                                title: "Registered Users",
                            },
                        ]}
                    />}
                    <div className="main-title-container">
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">Registered Users</h5>
                            {matches && modulePermissionsData?.add &&
                                <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => handleshowRegisteredModal({}, 'add')}>Add User</Button>
                            }
                        </div>
                        <div className="title-buttons">
                            <div></div>
                            <div className="add-export-btn">
                                {!matches && modulePermissionsData?.add &&
                                    <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => handleshowRegisteredModal({}, 'add')}>Add User</Button>
                                }
                                {modulePermissionsData?.export && data.length > 0 &&
                                    <Excel page={'Users'} importdata={data} />
                                }
                                {matches &&
                                    <div className="filter-section-container">
                                        <FilterData content={FilterSection} open={open} handleOpenChange={handleOpenChange} />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="main-content-card">
                        {!matches &&
                            // <FilterSection />
                            <div className="filter-form">
                                <div className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"}`}>
                                    <div className="input-group">
                                        <label htmlFor="user" className="form-lable">Full Name</label>
                                        <div className="form-group">
                                            <input
                                                className="form-field"
                                                type="text"
                                                id="eventName"
                                                placeholder="Enter User First Name"
                                                {...register('fullname')}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="user" className="form-lable">Email ID</label>
                                        <div className="form-group">
                                            <input
                                                className="form-field"
                                                type="text"
                                                id="eventName"
                                                placeholder="Enter email"
                                                {...register('email')}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="user" className="form-lable">Phone Number</label>
                                        <div className="form-group">
                                            <input
                                                className="form-field"
                                                type="text"
                                                id="eventName"
                                                placeholder="Enter Phone Number"
                                                {...register('mobileno')}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="DateRange" className="form-label">
                                            <b>
                                                {" "}
                                                Date Range{" "}
                                            </b>
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
                                        <label htmlFor="facility" className="form-lable">City</label>
                                        <div className="form-group">
                                            <select id="facility" className="form-field" {...register('city')}>
                                                <option value="" selected>
                                                    Select City
                                                </option>
                                                {Array.from(new Set(data?.map((user: any) => user?.city))) // Create a Set to remove duplicates
                                                    .filter(city => city) // Filter out blank values
                                                    .map((city, index) => (
                                                        <option key={index} value={city}>{city}</option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="current_city" className="form-lable">Current City</label>
                                        <div className="form-group">
                                            <select id="current_city" className="form-field" {...register('current_city')}>
                                                <option value="" selected>
                                                    Select City
                                                </option>
                                                {Array.from(new Set(data?.map((user: any) => user?.current_city))) // Create a Set to remove duplicates
                                                    .filter(current_city => current_city) // Filter out blank values
                                                    .map((current_city, index) => (
                                                        <option key={index} value={current_city}>{current_city}</option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="state" className="form-lable">State</label>
                                        <div className="form-group">
                                            <select id="state" className="form-field" {...register('state')}>
                                                <option value="" selected>
                                                    State
                                                </option>
                                                {Array.from(new Set(data?.map((user: any) => user?.state))) // Create a Set to remove duplicates
                                                    .filter(state => state) // Filter out blank values
                                                    .map((state, index) => (
                                                        <option key={index} value={state}>{state}</option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="user" className="form-lable">Pincode</label>
                                        <div className="form-group">
                                            <input
                                                className="form-field"
                                                type="Number"
                                                id="eventName"
                                                placeholder="Enter Phone Number"
                                                {...register('pincode')}
                                            />
                                        </div>
                                    </div>

                                </div>
                                {!matches && <div className="filter-buttons-row">
                                    <Button className="pi-btn-primary" key="confirm" type="primary"
                                        onClick={() => {
                                            Search(true)
                                            handleOpenChange(false);

                                        }}
                                    >Apply</Button>
                                    <Button className="pi-btn-secondary" key="cancel"
                                        onClick={() => {
                                            reset({
                                                fullname: '',
                                                email: '',
                                                mobileno: '',
                                                skill_level: '',
                                                city: '',
                                                current_city: '',
                                                pincode: '',
                                                state: '',
                                            });
                                            onClearDateRange();
                                            getRegisteredUsers();
                                            setSelectedCity([]);
                                            setSelectedCurrentCity([]);
                                            handleOpenChange(false);

                                        }}
                                    > Clear</Button>
                                </div>}
                            </div>
                        }


                        <div style={{ position: "sticky" }}>
                            {" "}


                        </div>
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
                                <Table columns={columns} data={data} />}
                    </div>
                </Card>
                <RegisteredUserDetails
                    visible={showRegisteredViewModal}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    name="Users Details"
                    row={rowdata}
                />
                <AddUsers
                    visible={showRegisteredEditModal}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    getRegisteredUsers={getRegisteredUsers}
                    name="Edit"
                    row={rowdata}
                />
                <DeleteConfirmation
                    visible={deleteConfirmationVisible}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    name="User"
                />

            </div>
        </Fragment>
    )
}
export default RegisteredUser;