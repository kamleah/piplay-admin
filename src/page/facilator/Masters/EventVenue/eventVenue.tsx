import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Card, Breadcrumb, Button, Radio, RadioChangeEvent } from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import ToastMessage from "../../ToastMessage/ToastMessage";
import { toast } from "react-toastify"
import moment from "moment";
import _ from "lodash";
import { deleteEventAPI, deleteEventVenueAPI, deleteSkillLevelAPI, getAllEventVenuesAPI, getAllSkillLevelsAPI, getEventVenuesUsersAPI, getFacilityApi, getFacilityByIdApi, venueFilterAPI } from "../../../../components/apiFile/Service";
import AddSkillLevel from "../../../../components/Modal/AddSkillLevel";
import AddEventVenue from "../../../../components/Modal/AddEventVenue";
import DeleteConfirmation from "../../../../components/Modal/DeleteConfirmation";
import { Icon } from "@iconify-icon/react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Table from "../../../../components/Table/DataTable";
import Excel from "../../../../components/Helpers/Excel";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import VenueDetails from "../../../../components/Modal/VenueDetails";
import FilterData from "../../../../components/Modal/FilterData";


const EventVenue = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {

    const [data, setData] = useState([])
    const [AddEventVenueState, setAddEventVenueState] = useState(false)
    const [edit, setEdit] = useState(false)
    const [facilities, setFacilities] = useState([])
    const [rowdata, setRowdata] = useState({});
    const [showOffersViewModal, setShowOffersViewModal] = useState(false);
    const [showOffersEditModal, setShowOffersEditModal] = useState(false);
    const [editData, setEditData] = useState({})
    const [filterData, setfilterData] = useState([])
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);

    const loggedInUser = localStorage.getItem("auth");
    const { register, watch, setValue, reset } = useForm()

    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
    const toggle = () => { setAddEventVenueState(!AddEventVenueState) };

    let name = watch("name");
    let city = watch("city");
    let sport_type = watch("sport_type");
    let pincode = watch("pincode");


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
            name: 'Venue Image',
            selector: row => row?.name,
            wrap: true,
            sortable: true,
            cell: row => (<div><img src={row?.image} className='table-lg-img' /></div>)
        },
        {
            name: 'Name',
            selector: row => row?.name,
            wrap: true,
            sortable: true,

        },
        {
            name: 'POC',
            selector: row => row?.poc,
            wrap: true,
            sortable: true,

        },
        {
            name: 'Pincode',
            selector: row => row?.pincode,
            wrap: true,
            sortable: true,

        },
        {
            name: 'City',
            selector: row => row?.location_city,
            wrap: true,
            sortable: true,

        },
        // {
        //     name: 'Location',
        //     selector: row => `${row?.location_city},${row?.location_state},${row?.pincode ? row?.pincode : ""}`,
        //     wrap: true,
        //     sortable: true,

        // },
        {
            name: 'Phone Number',
            selector: row => row?.phone_no,
            wrap: true,
            sortable: true,

        },
        {
            name: 'Sport Type',
            selector: row => row?.sport_type,
            wrap: true,
            sortable: true,
            cell: row => (<h4 className='capi'>{row?.sport_type}</h4>)
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
                            handleshowRegisteredModal
                                (row, 'view')}>
                            {/* onClick={() => handleshowRegistrationModal(row, 'view')} */}
                            <Icon icon="raphael:view" />
                        </button>}
                    {modulePermissionsData?.edit &&
                        <button className='action-button edit-button' onClick={() => {
                            setEdit(true); setVisible(true); setEditData(row); handleshowRegisteredModal
                                (row, 'edit')
                        }}
                        // disabled={loggedUserDetails?._id == row?._id}
                        >
                            <Icon icon="mdi:pencil-outline" title="Edit" />
                        </button>}
                    {modulePermissionsData?.delete &&
                        <button onClick={() => { handleDeleteConfirmation(row._id) }} className='action-button delete-button'>
                            <RiDeleteBin5Fill title="Delete" />
                        </button>}
                        {modulePermissionsData?.delete &&
                        <button onClick={() => copyToClipboard(row)} className='action-button delete-button'>
                            <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} />
                        </button>}
                </div>
            )


            ,
        },
    ];
    const handleshowRegisteredModal = async (row: any, type: any) => {
        setRowdata(row);
        if (type == 'view') {
            setShowOffersViewModal(true);
        } else if (type == 'edit') {
            setShowOffersEditModal(true);
        } else if (type == 'add') {
            setRowdata({});
            setShowOffersViewModal(false);
            setShowOffersEditModal(true);

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
            setShowOffersEditModal(false);
            setUserToDeleteId("");
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmationVisible(false);
        setShowOffersViewModal(false);
        setShowOffersEditModal(false);

        setUserToDeleteId("");
    };
    const getAllfacility = async () => {
        let response = await getFacilityApi(loggedInUser);
        if (!loggedUserDetails?.roleId) {
             let venues = response?.result?.map(data => {
                  return { "label": data?.name + ', ' + data.address, "value": data?._id, "slot_size": data?.slot_size, 'sport_type': data?.sport_type }
             });
             setFacilities(response?.result)
        } else {
             const filteredFacilities = response?.result.filter(item => loggedUserDetails?.facilities.includes(item._id));
             let venues = filteredFacilities?.map(data => {
                  return { "label": data?.name + ', ' + data.address, "value": data?._id, "slot_size": data?.slot_size, 'sport_type': data?.sport_type }
             });
             setFacilities(filteredFacilities)
            //  setValue('facility_id', { label: filteredFacilities[0]?.name, value: filteredFacilities[0]?._id });
        }
   };

    const DeleteFunction = async (id) => {
        let response = await deleteEventVenueAPI(loggedInUser, id)
        if (response.statusCode == 0) {
            toast(<ToastMessage body={"Venue Deleted Successfully"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            getEventVenues();
        } else {
            toast(<ToastMessage body={"Failed To Delete the Venue"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    const getEventVenues = async () => {
        let response
        if (!loggedUserDetails?.roleId) {
            response = await getAllEventVenuesAPI(loggedInUser);
        } else {
            response = await getEventVenuesUsersAPI(loggedInUser, loggedUserDetails._id);
        }
        setData(response?.result)
    }

    const Search = async (search, value) => {
        let sport = ''
        if (value == '') {
            sport = sport_type
        } else {
            sport = value
        }

        let response = await venueFilterAPI(loggedInUser,
            name == undefined ? '' : name,
            city == undefined ? "" : city,
            sport == undefined || sport == 'all' ? '' : sport,
            pincode == undefined ? '' : pincode,
            !loggedUserDetails?.roleId ? '' : loggedUserDetails?._id
        );

        if (typeof response?.result !== 'string') {
            setData(response?.result)
        } else {
            setData([]);
        }
    };
    const options = [
        { label: 'All', value: 'all' },
        { label: 'Padel', value: 'padel' },
        { label: 'Pickleball', value: 'pickleball', },
    ];

    const onSportsChange = ({ target: { value } }: RadioChangeEvent) => {
        setValue('sport_type', value);
        Search(true, value)
    };
    useMemo(() => {
    }, [AddEventVenueState, edit])

    useEffect(() => {
        getEventVenues();
        getAllfacility();
    }, [])

    const [open, setOpen] = useState(false);
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    const FilterSection = () => {
        return (
            <>
                <div className="filter-form">
                    <div className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"}`}>
                        <div className="input-group">
                            <label htmlFor="event" className="form-lable"> Name</label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="expirydate"
                                    placeholder=" Name"
                                    {...register('name')}
                                />
                            </div>

                        </div>
                        <div className="input-group">
                            <label htmlFor="event" className="form-lable">City</label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="expirydate"
                                    placeholder="City"
                                    {...register('city')}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="event" className="form-lable">Pincode</label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="number"
                                    id="expirydate"
                                    placeholder="pincode "
                                    {...register('pincode')}
                                />
                            </div>
                        </div>
                    </div>

                    {!matches && <div className="filter-buttons-row">
                        <Button className="pi-btn-primary" key="confirm" type="primary"
                            onClick={() => {
                                Search(true, "")
                                handleOpenChange(false);

                            }}
                        >Apply</Button>
                        <Button className="pi-btn-secondary" key="cancel"
                            onClick={() => {
                                reset({
                                    name: '',
                                    city: '',
                                    sport_type: 'all',
                                    pincode: '',
                                });
                                getEventVenues();
                                handleOpenChange(false);

                            }}
                        > Clear</Button>
                    </div>}
                </div>
                {matches && <div className="filter-buttons-row">
                    <Button className="pi-btn-primary" key="confirm" type="primary"
                        onClick={() => {
                            Search(true, "")
                            handleOpenChange(false);

                        }}
                    >Apply</Button>
                    <Button className="pi-btn-secondary" key="cancel"
                        onClick={() => {
                            reset({
                                name: '',
                                city: '',
                                sport_type: 'all',
                                pincode: '',
                            });
                            getEventVenues();
                            handleOpenChange(false);

                        }}
                    > Clear</Button>
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
                                title: "Manage Venue",
                            },
                        ]}
                    />}
                    <div className="main-title-container">
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">Manage Venues </h5>
                            {matches && modulePermissionsData?.add &&
                                <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => {
                                    setVisible(true)
                                    handleshowRegisteredModal({}, 'add')
                                }}
                                > Add Venue
                                </Button>
                            }
                        </div>
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

                                {!matches && modulePermissionsData?.add &&
                                    <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => {
                                        setVisible(true)
                                        handleshowRegisteredModal({}, 'add')
                                    }}
                                    > Add Venue
                                    </Button>}
                                {modulePermissionsData?.export && data?.length > 0 &&
                                    <Excel page={'Venue'} importdata={data} />
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
                                        <label htmlFor="event" className="form-lable"> Name</label>
                                        <div className="form-group">
                                            <input
                                                className="form-field"
                                                type="text"
                                                id="expirydate"
                                                placeholder=" Name"
                                                {...register('name')}
                                            />
                                        </div>

                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="event" className="form-lable">City</label>
                                        <div className="form-group">
                                            <input
                                                className="form-field"
                                                type="text"
                                                id="expirydate"
                                                placeholder="City"
                                                {...register('city')}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="event" className="form-lable">Pincode</label>
                                        <div className="form-group">
                                            <input
                                                className="form-field"
                                                type="number"
                                                id="expirydate"
                                                placeholder="pincode "
                                                {...register('pincode')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {!matches && <div className="filter-buttons-row">
                                    <Button className="pi-btn-primary" key="confirm" type="primary"
                                        onClick={() => {
                                            Search(true, "")
                                            handleOpenChange(false);

                                        }}
                                    >Apply</Button>
                                    <Button className="pi-btn-secondary" key="cancel"
                                        onClick={() => {
                                            reset({
                                                name: '',
                                                city: '',
                                                sport_type: 'all',
                                                pincode: '',
                                            });
                                            getEventVenues();
                                            handleOpenChange(false);

                                        }}
                                    > Clear</Button>
                                </div>}
                            </div>
                        }

                        <div style={{ position: "sticky" }}>
                            {" "}
                            <VenueDetails
                                visible={showOffersViewModal}
                                onConfirm={handleConfirmDelete}
                                onCancel={handleCancelDelete}
                                name="Venue Details"
                                row={rowdata}
                            />
                            <AddEventVenue

                                onConfirm={handleConfirmDelete}
                                setvisible={setVisible}
                                visible={visible}

                                getEventVenues={getEventVenues}
                                editdata={editData}
                                edit={edit}
                                row={rowdata}
                                name="Edit"
                                setEdit={setEdit}
                                setEditData={setEditData}
                                facilities={facilities}
                            />
                        </div>

                        <Table columns={columns} data={filterData?.length > 0 ? filterData : data} />
                        <DeleteConfirmation
                            visible={deleteConfirmationVisible}
                            onConfirm={handleConfirmDelete}
                            onCancel={handleCancelDelete}
                            name="Venue"
                        />
                    </div>
                </Card>
            </div>
        </Fragment>
    );
};
export default EventVenue;
