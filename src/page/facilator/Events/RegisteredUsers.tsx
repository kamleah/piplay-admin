import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Dropdown, Menu, Card, Breadcrumb, Button, Radio, RadioChangeEvent, Tooltip } from "antd";
import { getAllEventVenuesAPI, deleteEventRegistrationAPI, getAllRegisteredUsersAPI, getAllRegisteredUsersFilterAPI, getAllTournamentsAPI, getAllUsers, getEventVenuesUsersAPI } from "../../../components/apiFile/Service";
import ToastMessage from "../ToastMessage/ToastMessage";
import { toast } from "react-toastify";
import _ from "lodash";
import DeleteConfirmation from "../../../components/Modal/DeleteConfirmation";
import ClipLoader from "react-spinners/ClipLoader";

import UserLabel from "../../../components/Labels/UserLabel";
import SkillLabel from "../../../components/Labels/SkillLabel";
import StatusLabel from "../../../components/Labels/StatusLabel";
import { Icon } from "@iconify-icon/react";
import RegistrationDetails from "../../../components/Modal/RegistrationDetails";
import EditRegistration from "../../../components/Modal/EditRegistration";
import { useForm } from 'react-hook-form';
import Table from "../../../components/Table/DataTable";
import Excel from "../../../components/Helpers/Excel";
import moment from "moment";
import FilterData from "../../../components/Modal/FilterData";
import { useSelector } from "react-redux";
import CopyToClipboard from "../../../components/CopyToClipboard/CopyToClipboard";
import CopyToClipboard2 from "../../../components/CopyToClipboard/CopyToClipboart2";

interface Item {
    _id: string;

}

const RegisteredUsers = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {

    const [data, setData] = useState<Item[]>([])
    const [filterData, setfilterData] = useState([])
    const loggedInUser = localStorage.getItem("auth");
    const [showRegistrationViewModal, setShowRegistrationViewModal] = useState(false);
    const [showRegistrationEditModal, setShowRegistrationEditModal] = useState(false);
    const [rowdata, setRowdata] = useState({});
    const [tournaments, setTournaments] = useState([]);
    const [userList, setUserList] = useState([]);
    const [venueList, setVenueList] = useState([]);
    const [selectedGameType, setSelectedGameType] = useState('all');
    const [registrationDeleteId, setRegistrationDeleteId] = useState<string>("");
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [Loading, setLoading] = useState(false);

    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)

    const { register, watch, setValue, reset } = useForm()

    let tournament_id = watch("tournament_id");
    let user_name = watch("user_name");
    let paymentStatus = watch("paymentStatus");
    let venue = watch("venue");
    let event_date = watch("event_date");
    let booked_date = watch("booked_date");
    let event_name = watch("event_name");
    let sport_type = watch("sport_type");

    const copyToClipboard = (e) => {
        const rowDetails = JSON.stringify(e, null, 2);
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
            name: 'Booking Date',
            selector: row => {
                const originalDate = row?.createdAt;
                const parsedDate = moment(originalDate);
                const formattedDate = parsedDate.utcOffset(0).format('DD-MM-YYYY');
                return formattedDate;
            },
            sortable: true,
            wrap: true,
        },
        {
            name: 'Players',
            selector: row => row?.user?.firstname + ' ' + row?.user?.lastname,
            sortable: true,
            wrap: true,
            cell: row =>
                <div style={{ width: '100%' }}>
                    <CopyToClipboard2 textToCopy={row?.user?.firstname + ' ' + row?.user?.lastname} textColor="#353535" />
                    <CopyToClipboard2 textToCopy={row?.user?.mobileno} />
                    <CopyToClipboard2 textToCopy={row?.user?.email} />
                </div>
        },
        {
            name: 'Partner',
            selector: row => {
                let partnerName = row?.source == 'website' ?
                    row?.tournaments_players?.length == 0 ? 'NA' : `${row?.tournaments_players[0]?.name} ${row?.tournaments_players[0]?.lastName}`
                    : row?.partner_from == 'invite' ? row?.partner?.name
                        : (row?.partner?.firstname || "") + " " + (row?.partner?.lastname || "");
                return partnerName?.trim() === "" ? "N/A" : partnerName;
            },
            sortable: true,
            wrap: true,
            cell: row => (
                <div style={{ width: '100%' }}>
                    <CopyToClipboard2 textToCopy={(() => {
                        let partnerName;
                        if (row?.source === 'website') {
                            partnerName = row?.tournaments_players?.length > 0 ? `${row?.tournaments_players[0]?.name} ${row?.tournaments_players[0]?.lastName}` : 'N/A';
                        } else if (row?.partner_from === 'invite') {
                            partnerName = row?.partner?.name || 'N/A';
                        } else {
                            partnerName = `${row?.partner?.firstname || ''} ${row?.partner?.lastname || ''}`.trim();
                        }

                        return partnerName === '' ? 'N/A' : partnerName;
                    })()}
                        textColor="#353535"
                    />
                    <CopyToClipboard2 textToCopy={(() => {
                        let mobileno;
                        if (row?.source === 'website') {
                            mobileno = row?.tournaments_players?.length > 0 ? `${row?.tournaments_players[0]?.phone_number}` : 'N/A';
                        } else if (row?.partner_from === 'invite') {
                            mobileno = row?.partner?.mobileno || 'N/A';
                        } else {
                            mobileno = row?.partner?.mobileno
                        }

                        return mobileno === '' ? 'N/A' : mobileno;
                    })()} />
                    <CopyToClipboard2 textToCopy={row?.partner?.email} />
                </div>
            )

        },

        {
            name: 'Event Details',
            selector: row => row?.tournament?.tournament_name + ' - ' + row?.tournament?.start_date,
            sortable: true,
            wrap: true,
            cell: row => <div>{row?.tournament?.tournament_name} <br /> On {moment(row?.tournament?.start_date).format('DD-MM-YYYY')}</div>
        },
        {
            name: 'Venue',
            selector: row => row?.venue?.name ?? 'N/A',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Organizer',
            selector: row => row?.organizer?.name ?? 'N/A',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Package Price',
            selector: row => row?.selected_package?.discount ? row.selected_package.discount : "N/A",
            sortable: true,
            wrap: true,
        },
        {
            name: 'Payment',
            selector: row => row?.payment_status,
            sortable: true,
            wrap: true,
            cell: row =>
                <div className='playerContainer'>
                    <Tooltip
                        title={<>
                            <div>Payment is {row?.payment_status == 'Completed' ? 'Success' : 'Failed'} from Users end. <br /> Booking is {row?.payment_status == 'Completed' ? 'Confirmed.' : 'not confirmed.'}</div>
                        </>
                        } placement="right" color='#032037'>
                        {
                            row?.payment_status == 'Completed' ?
                                <span style={{ color: 'green' }}>Success</span>
                                :
                                <span style={{ color: 'red' }}>{row?.payment_status}</span>
                        }
                        <Icon icon="ion:information-circle" className="input-info-icon" />
                    </Tooltip>

                    {
                        row?.partner_payment &&
                        <p>
                            {row?.partner_payment == 'Completed' ?
                                <span style={{ color: 'green' }}>Success</span>
                                :
                                <span style={{ color: 'red' }}>{row?.partner_payment}</span>
                            }
                        </p>
                    }
                </div>,
        },


        {
            name: 'Payment Id',
            selector: row => row?.payment_id ? row?.payment_id : "N/A",
            sortable: true,
            wrap: true,
            // cell: row =>
            //     <CopyToClipboard2 textToCopy={row?.payment_id} />
        },
        {
            name: 'Main Category',
            selector: row => row?.selected_category && row?.selected_category[0]?.ui_name_for_tournament ? row?.selected_category[0]?.ui_name_for_tournament : "N/A",
            sortable: true,
            wrap: true,
        },
        {
            name: 'Selected Package',
            selector: row => row?.selected_package && row?.selected_package?.name ? row?.selected_package?.name : "N/A",
            sortable: true,
            wrap: true,
        },
        {
            name: 'Category',
            selector: row => [
                ...(row?.selected_category ? row?.selected_category?.map(category => category.ui_name_for_tournament) : []),
                row?.tournament?.tournament_type.charAt(0)?.toUpperCase() + row?.tournament?.tournament_type.slice(1)
            ].filter(Boolean).join(', '),
            sortable: true,
            wrap: true,
            cell: row =>
                <div>
                    {/* {row?.main_category?.ui_name_for_tournament ? row?.main_category?.ui_name_for_tournament : "N/A"} */}
                    {/* <br /> */}
                    {row?.tournament?.tournament_type.includes('[') ? JSON.parse(row?.tournament?.tournament_type).map((item: any, index: number) => (index > 0 ? ', ' + item.label : item.label)) : row?.tournament?.tournament_type}
                </div>
        },
        {
            name: 'Partner Status',
            selector: row => row?.partner_status ?? 'N/A',
            sortable: true,
            wrap: true,
            cell: row => <div className='playerContainer'>
                {
                    row?.payment_status == 'Completed' ?
                        <span style={{ color: 'green' }}>{row?.partner_status}</span>
                        :
                        <span style={{ color: 'Blue' }}>Solo</span>
                }
            </div>,
        },
        {
            name: 'Source',
            // selector: row => `${row?.source} ${row?.source?.toLowerCase() == 'app' && '/ ' + row?.operating_system}` ?? 'N/A',
            selector: row => row?.source == 'app' ? `${row?.source} / ${row?.operating_system}` : row?.source ? `${row.source}` : 'NA',
            sortable: true,
            wrap: true,
        },

        {
            name: 'Version',
            selector: row => row?.apk_version ? row?.apk_version : "N/A",
            sortable: true,
            wrap: true,


        },

        {
            name: 'Actions',
            selector: row => row.year,
            sortable: true,
            wrap: true,
            cell: row => (
                <div className="action-button-container">
                    {loggedUserDetails?.rolename === "Facility Staff" ? (
                        modulePermissionsData?.view && (
                            <button
                                className="action-button view-button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleshowRegistrationModal(row, 'view');
                                }}
                            >
                                <Icon icon="raphael:view" />
                            </button>
                        )
                    ) : (
                        <Dropdown
                            overlay={
                                <Menu>
                                    {modulePermissionsData?.view && (
                                        <Menu.Item key="view">
                                            <button
                                                className="action-button view-button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleshowRegistrationModal(row, 'view');
                                                }}
                                            >
                                                <Tooltip title="View" placement="left">
                                                    <Icon icon="raphael:view" />
                                                </Tooltip>
                                            </button>
                                        </Menu.Item>
                                    )}
                                    {modulePermissionsData?.edit && (
                                        <Menu.Item key="edit">
                                            <button
                                                className="action-button edit-button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleshowRegistrationModal(row, 'edit');
                                                }}
                                            >
                                                <Tooltip title="Edit" placement="left">
                                                    <Icon icon="mdi:pencil-outline" />
                                                </Tooltip>
                                            </button>
                                        </Menu.Item>
                                    )}
                                    {modulePermissionsData?.delete && (
                                        <Menu.Item key="copy">
                                            <button
                                                className="action-button delete-button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    copyToClipboard(row);
                                                }}
                                            >
                                                <Tooltip title="Copy" placement="left">
                                                    <Icon icon="solar:copy-bold" height={18} width={18} style={{ paddingLeft: '5px' }} />
                                                </Tooltip>
                                            </button>
                                        </Menu.Item>
                                    )}
                                    {modulePermissionsData?.delete && row.payment_status === 'Completed' && (
                                        <Menu.Item key="unregister">
                                            <Button className="action-button delete-button" danger onClick={() => handleDeleteConfirmation(row._id)}>
                                                <Tooltip title="Unregister" placement="left">
                                                    <Icon icon="mdi:account-cancel" height={18} width={18} style={{ paddingLeft: '5px' }} />
                                                </Tooltip>
                                            </Button>
                                        </Menu.Item>
                                    )}
                                </Menu>
                            }
                            trigger={['click']}
                        >
                            <Button className="action-button delete-button">
                                <Tooltip title="More actions" placement="left">
                                    <Icon icon="mdi:dots-vertical" />
                                </Tooltip>
                            </Button>
                        </Dropdown>
                    )}
                </div>
            ),
        }
    ];

    const handleDeleteConfirmation = (id) => {

        setRegistrationDeleteId(id);
        setDeleteConfirmationVisible(true);
    };

    const ConfirmDelete = async () => {
        if (registrationDeleteId) {
            await Deregistration(registrationDeleteId);
            setDeleteConfirmationVisible(false);
            setRegistrationDeleteId("");
        }
    };

    const CancelDelete = () => {
        setDeleteConfirmationVisible(false);
        setRegistrationDeleteId("");
    };

    const Deregistration = async (id: string) => {
        try {
            const response = await deleteEventRegistrationAPI(loggedInUser, id);
            console.log(response);

            if (response && response.data) {
                // Successful deletion
                toast(
                    <ToastMessage body={"Event Deleted Successfully"} type="success" />,
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    }
                );
                // Optionally remove the deleted registration from the table
                setData(data.filter(item => item._id !== id));
                getTournaments(); // Refresh list of tournaments or registrations
            } else if (response && response.error) {
                // API error with error message
                toast(
                    <ToastMessage body={response.error} type="error" />,
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    }
                );
            } else {
                // Unknown error or no response
                toast(
                    <ToastMessage body={"Failed To Delete the Event"} type="error" />,
                    {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    }
                );
            }
        } catch (error) {
            console.error("Error during deletion:", error);
            toast(
                <ToastMessage body={(error instanceof Error ? error.message : "Error occurred during deletion").toString()} type="error" />,
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
        }
    };


    const handleshowRegistrationModal = async (row: any, type: any) => {
        setRowdata(row);
        if (type == 'view') {
            setShowRegistrationViewModal(true);
        } else if (type == 'edit') {
            setShowRegistrationEditModal(true);
        } else {
            setShowRegistrationViewModal(false);
            setShowRegistrationEditModal(false);

        }
    };

    const handleConfirmDelete = async () => {
        setShowRegistrationViewModal(false);
        setShowRegistrationEditModal(false);
    };

    const handleCancelDelete = () => {
        setShowRegistrationViewModal(false);
        setShowRegistrationEditModal(false);
    };

    const getRegisteredUsers = async () => {
        console.log('loggedUserDetails', loggedUserDetails);

        setLoading(true);
        let response = await getAllRegisteredUsersFilterAPI(loggedInUser, "", "", "", loggedUserDetails?.roleId ? (loggedUserDetails?.venue?.length > 0 ? loggedUserDetails?.venue[0] : '') : '', "", "", "", "", !loggedUserDetails?.roleId ? '' : loggedUserDetails?._id, loggedUserDetails?.organizerId || '');
        setLoading(false);
        setData(response?.data);
    }

    const getVenues = async () => {
        let response
        if (!loggedUserDetails?.roleId) {
            response = await getAllEventVenuesAPI(loggedInUser);
        } else {
            response = await getEventVenuesUsersAPI(loggedInUser, loggedUserDetails._id);
        }
        setVenueList(response?.result);
    }

    const Search = async (search, value) => {
        let sport = ''
        if (value == '') {
            sport = sport_type
        } else {
            sport = value
        }

        let username = String(user_name);
        let event_id = String(tournament_id);
        let response = await getAllRegisteredUsersFilterAPI(loggedInUser,
            paymentStatus == undefined ? "" : paymentStatus,
            event_id == undefined ? '' : event_id,
            username == undefined ? '' : username,
            venue == undefined ? '' : venue,
            event_date == undefined ? '' : String(event_date),
            booked_date == undefined ? '' : String(booked_date),
            event_name == undefined ? '' : event_name,
            sport == undefined || sport == 'all' ? '' : sport,
            !loggedUserDetails?.roleId ? '' : loggedUserDetails?._id,
            loggedUserDetails?.organizerId || ''
        );
        if (response?.message.split(' ')[0] != 0) {
            setData(response?.data)
        } else {
            setData([]);
        }
    };

    const getTournaments = async () => {
        let response = await getAllTournamentsAPI(loggedInUser);
        setTournaments(response.result)
    }

    const getUsers = async () => {
        let response = await getAllUsers(loggedInUser);
        setUserList(response.data)
    }

    const options = [
        { label: 'All', value: 'all' },
        { label: 'Padel', value: 'padel' },
        { label: 'Pickleball', value: 'pickleball', },
    ];

    const onSportsChange = ({ target: { value } }: RadioChangeEvent) => {
        setValue('sport_type', value);
        Search(true, value)
    };

    useEffect(() => {
        getVenues();
        getRegisteredUsers();
        getTournaments();
        getUsers();
        setValue('venue', loggedUserDetails?.roleId ? (loggedUserDetails?.venue?.length > 0 ? loggedUserDetails?.venue[0] : '') : '');
    }, [])

    const [open, setOpen] = useState(false);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    const FilterSection = () => {
        return (
            <>
                <div className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"}`}>
                    <div className="input-group">
                        <label htmlFor="facility" className="form-lable">Venue</label>
                        <div className="form-group">
                            <select id="facility" className="form-field"
                                {...register('venue')}
                            >
                                <option value="" disabled selected>
                                    Select Venue
                                </option>
                                {venueList?.map((user: any, index) => (
                                    <option value={user?._id}>{user?.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="paymentStatus" className="form-lable">Payment</label>
                        <div className="form-group">
                            <select
                                id="paymentStatus"
                                className="form-field"
                                {...register('paymentStatus')}
                            >
                                <option value="" disabled selected>
                                    Select Payment Status
                                </option>
                                <option value="Completed">Success</option>
                                <option value="Pending">Pending</option>
                                <option value="Failed">Cancelled</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>
                    </div>
                    <div className="input-group">

                        <label htmlFor="eventDate" className="form-lable">Event Date</label>
                        <div className="form-group">
                            <input
                                className="form-field"
                                type="date"
                                id="eventDate"
                                {...register('event_date')}
                            />
                        </div>
                    </div>
                    <div className="input-group">

                        <label htmlFor="bookingDate" className="form-lable">Booking Date</label>
                        <div className="form-group">
                            <input
                                className="form-field"
                                type="date"
                                id="bookingDate"
                                {...register('booked_date')}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="eventId" className="form-lable">Regn. ID</label>
                        <div className="form-group">
                            <input
                                className="form-field"
                                type="text"
                                id="eventId"
                                placeholder="Enter Event Id"
                                {...register('tournament_id')}
                            />
                        </div>
                    </div>
                    <div className="input-group">

                        <label htmlFor="eventName" className="form-lable">Event Name</label>
                        <div className="form-group">
                            <input
                                className="form-field"
                                type="text"
                                id="eventName"
                                placeholder="Enter Event Name"
                                {...register('event_name')}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="user" className="form-lable">Full Name</label>
                        <div className="form-group">
                            <input
                                className="form-field"
                                type="text"
                                id="eventName"
                                placeholder="Enter User First Name"
                                {...register('user_name')}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="MobileNo" className="form-lable">Mobile No</label>
                        <div className="form-group">
                            <input
                                className="form-field"
                                type="text"
                                id="MobileNo"
                                placeholder="Enter User Mobile No"
                                {...register('Mobile_No')}
                            />
                        </div>
                    </div>
                    {!matches && <div className={`${matches ? "filter-buttons-row" : "filter-buttons"}`}>
                        <Button
                            className="pi-btn-secondary"
                            key="cancel"
                            onClick={() => {
                                getRegisteredUsers()
                                reset({
                                    tournament_id: '',
                                    user_name: '',
                                    venue: '',
                                    paymentStatus: '',
                                    event_date: '',
                                    booked_date: '',
                                    event_name: '',
                                });
                                setData([]); // Clear filterData
                                handleOpenChange(false);
                            }}
                        >
                            Clear
                        </Button>
                        <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => {
                            Search(true, "");
                            handleOpenChange(false);
                        }}>Apply</Button>
                    </div>}
                </div>
                {matches && <div className={`${matches ? "filter-buttons-row" : "filter-buttons"}`}>

                    <Button
                        className="pi-btn-secondary"
                        key="cancel"
                        onClick={() => {
                            getRegisteredUsers()
                            reset({
                                tournament_id: '',
                                user_name: '',
                                venue: '',
                                paymentStatus: '',
                                event_date: '',
                                booked_date: '',
                                event_name: '',
                            });
                            setData([]); // Clear filterData
                            handleOpenChange(false);
                        }}
                    >
                        Clear
                    </Button>
                    <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => {
                        Search(true, "");
                        handleOpenChange(false);
                    }}>Apply</Button>
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
                    {
                        !matches &&
                        <Breadcrumb
                            items={[
                                {
                                    title: "Home",
                                },
                                {
                                    title: "Events",
                                },
                                {
                                    title: "Event Registrations",
                                },
                            ]}
                        />
                    }

                    <form className="">
                        <div className="main-title-container">
                            <h5 className="main-content-title">Event Registrations</h5>
                            <div className='title-buttons'>
                                <div>

                                    <Radio.Group
                                        options={options}
                                        {...register('sport_type')}
                                        onChange={onSportsChange}
                                        value={sport_type ? sport_type : 'all'}
                                    />
                                </div>
                                <div className="add-export-btn">

                                    {modulePermissionsData?.export &&
                                        <Excel page={'RegisteredEvents'} importdata={data} />
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
                                // <FilterSection/>
                                <div className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"}`}>
                                    <div className="input-group">
                                        <label htmlFor="facility" className="form-lable">Venue</label>
                                        <div className="form-group">
                                            <select id="facility" className="form-field"
                                                {...register('venue')}
                                            >
                                                <option value="" disabled selected>
                                                    Select Venue
                                                </option>
                                                {venueList?.map((user: any, index) => (
                                                    <option value={user?._id}>{user?.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="paymentStatus" className="form-lable">Payment</label>
                                        <div className="form-group">
                                            <select
                                                id="paymentStatus"
                                                className="form-field"
                                                {...register('paymentStatus')}
                                            >
                                                <option value="" disabled selected>
                                                    Select Payment Status
                                                </option>
                                                <option value="Completed">Success</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Failed">Cancelled</option>
                                                <option value="Manual">Manual</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="input-group">

                                        <label htmlFor="eventDate" className="form-lable">Event Date</label>
                                        <div className="form-group">
                                            <input
                                                className="form-field"
                                                type="date"
                                                id="eventDate"
                                                {...register('event_date')}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group">

                                        <label htmlFor="bookingDate" className="form-lable">Booking Date</label>
                                        <div className="form-group">
                                            <input
                                                className="form-field"
                                                type="date"
                                                id="bookingDate"
                                                {...register('booked_date')}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="eventId" className="form-lable">Regn. ID</label>
                                        <div className="form-group">
                                            <input
                                                className="form-field"
                                                type="text"
                                                id="eventId"
                                                placeholder="Enter Event Id"
                                                {...register('tournament_id')}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group">

                                        <label htmlFor="eventName" className="form-lable">Event Name</label>
                                        <div className="form-group">
                                            <input
                                                className="form-field"
                                                type="text"
                                                id="eventName"
                                                placeholder="Enter Event Name"
                                                {...register('event_name')}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="user" className="form-lable">Full Name</label>
                                        <div className="form-group">
                                            <input
                                                className="form-field"
                                                type="text"
                                                id="eventName"
                                                placeholder="Enter User First Name"
                                                {...register('user_name')}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="MobileNo" className="form-lable">Mobile No</label>
                                        <div className="form-group">
                                            <input
                                                className="form-field"
                                                type="text"
                                                id="MobileNo"
                                                placeholder="Enter User Mobile No"
                                                {...register('Mobile_No')}
                                            />
                                        </div>
                                    </div>
                                    {!matches && <div className={`${matches ? "filter-buttons-row" : "filter-buttons"}`}>
                                        <Button
                                            className="pi-btn-secondary"
                                            key="cancel"
                                            onClick={() => {
                                                getRegisteredUsers()
                                                reset({
                                                    tournament_id: '',
                                                    user_name: '',
                                                    venue: loggedUserDetails?.roleId ? (loggedUserDetails?.venue?.length > 0 ? loggedUserDetails?.venue[0] : '') : '',
                                                    paymentStatus: '',
                                                    event_date: '',
                                                    booked_date: '',
                                                    event_name: '',
                                                });
                                                setData([]); // Clear filterData
                                                handleOpenChange(false);
                                            }}
                                        >
                                            Clear
                                        </Button>
                                        <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => {
                                            Search(true, "");
                                            handleOpenChange(false);
                                        }}>Apply</Button>
                                    </div>}
                                </div>
                            }

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
                                    <Table
                                        columns={columns}
                                        data={data}
                                    />
                            }
                        </div>
                    </form>
                </Card>
                <RegistrationDetails
                    visible={showRegistrationViewModal}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    name="Registration Details"
                    row={rowdata}
                    matches={matches}
                />
                <EditRegistration
                    visible={showRegistrationEditModal}
                    onConfirm={handleConfirmDelete}
                    userList={userList}
                    onCancel={handleCancelDelete}
                    getRegisteredUsers={getRegisteredUsers}
                    name="Edit"
                    row={rowdata}
                />
                <DeleteConfirmation
                    visible={deleteConfirmationVisible}
                    onConfirm={ConfirmDelete}
                    onCancel={CancelDelete}
                    name="Registration"
                />
            </div >

        </Fragment >
    );
};
export default RegisteredUsers;
