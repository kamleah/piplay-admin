import { Icon } from '@iconify-icon/react';
import { Breadcrumb, Button, Card, Radio, RadioChangeEvent } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import Table from '../../components/Table/DataTable';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import SkillLabel from '../../components/Labels/SkillLabel';
import AddEventFlyers from '../../components/Modal/AddEventFlyers';
import { useSelector } from 'react-redux';
import { deleteEventFlyerAPI, getAllCouponsAPI, getAllTournamentsAPI, getEventFlyerAPI, getEventsByVenuesAPI, getFacilityApi, getFacilityByIdApi } from '../../components/apiFile/Service';
import moment from 'moment';
import { toast } from 'react-toastify';
import ToastMessage from '../facilator/ToastMessage/ToastMessage';
import DeleteConfirmation from '../../components/Modal/DeleteConfirmation';
import EventFlyersDetails from '../../components/Modal/EventFlyersDetails';

export default function EventFlyers({ matches, menuOpen, onToggle, modulePermissionsData }) {
    const { register, watch, setValue, reset, control } = useForm();
    const [deleteRowId, setDeleteRowId] = useState<string | null>(null);
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [edit, setEdit] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [rowdata, setRowdata] = useState({});
    const [showViewModal, setShowViewModal] = useState(false);
    const [data, setData] = useState([])
    const [Couponsdata, setCouponsData] = useState([])
    const [facilities, setFacilities] = useState([])
    const [events, setEvents] = useState([])

    const loggedInUser = localStorage.getItem("auth");
    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)

    const moduleName = "Event Flyers"
    let sport_type = watch("sport_type");
    const options = [
        { label: 'All', value: 'all' },
        { label: 'Padel', value: 'padel' },
        { label: 'Pickleball', value: 'pickleball', },
    ];
    const onSportsChange = ({ target: { value } }: RadioChangeEvent) => {
        setValue('sport_type', value);
        // filterData(true, value)
    };
    const handleShowModal = async (row: any, type: any) => {
        setRowdata(row);
        if (type == 'view') {
            setShowViewModal(true);
        } else if (type == 'edit') {
            setEdit(true);
            setShowFormModal(true);
        } else {
            setShowViewModal(false);
            setShowFormModal(false);
            setEdit(false);
        }
    };
    const handleCancel = () => {
        setShowFormModal(false);
        setShowViewModal(false);
        setEdit(false);
    };
    const handleConfirmDelete = async () => {
        if (deleteRowId) {
            await DeleteFunction(deleteRowId);
            setDeleteConfirmationVisible(false);
            setDeleteRowId("");
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmationVisible(false);
        setDeleteRowId("");
    };

    const handleDeleteModal = (id) => {
        setDeleteRowId(id);
        setDeleteConfirmationVisible(true);
    };

    const getCoupons = async () => {
        let response = await getAllCouponsAPI(loggedInUser);
        if (!loggedUserDetails?.roleId) {
            setCouponsData(response?.result?.result)
            console.log('response?.result--------------', response?.result)
        } else {
            let venues = response?.result?.result?.map(data => {
                console.log('data-----------', data)
                // return { "label": data?.name + ', ' + data.address, "value": data?._id, "slot_size": data?.slot_size, 'sport_type': data?.sport_type }
            })
            console.log('venues------', venues)
        }
    }

    const DeleteFunction = async (id) => {
        // Actual delete logic here
        let response = await deleteEventFlyerAPI(loggedInUser, id);
        if (response.message == "Success") {
            toast(<ToastMessage body={'Event Flyer Deleted Successfully'} type="success" />, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            getAllData();
        } else {
            console.log(response)
            toast(<ToastMessage body={'Error while deleting Event Flyer'} type="warning" />, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const HtmlRenderer = ({ htmlContent }) => {
        return (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        );
    };

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
            name: 'Content',
            selector: row => row?.type == 'image',
            sortable: true,
            wrap: true,
            cell: row => (
                <>{row?.type == 'image' ? <img src={row?.image} className='table-lg-img' /> : <><HtmlRenderer htmlContent={row?.text} /></>}</>
            )
        },
        {
            name: 'Flyer For',
            cell: row => <p className='capi'>{row?.flyer_for}</p>,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Flyer',
            selector: row => row?.flyer_for == 'facility' ? row?.prop?.name + row?.prop?.address : row?.flyer_for == 'event' ? row?.prop?.tournament_name : row?.flyer_for == 'App_Upgrade' ? row?.app_ver : row?.external_link,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Start Date',
            selector: row => moment(row?.start_date).format('DD-MM-YYYY'),
            sortable: true,
            wrap: true,
        },
        {
            name: 'End Date',
            selector: row => moment(row?.end_date).format('DD-MM-YYYY'),
            sortable: true,
            wrap: true,
        },
        {
            name: 'Actions',
            sortable: true,
            wrap: true,
            cell: row =>
            (<div className='action-button-container'>
                <button className='action-button view-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'view') }} ><Icon icon="raphael:view" /></button>
                <button className='action-button edit-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'edit') }}><Icon icon="mdi:pencil-outline" /></button>
                <button className='action-button delete-button' onClick={(e) => { e.preventDefault(); handleDeleteModal(row._id) }} >
                    <RiDeleteBin5Fill title="Delete" />
                </button>
                <button className='action-button delete-button' onClick={(e) => { e.preventDefault(); copyToClipboard(row) }} >
                    <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} />
                </button>
            </div >)
            ,
        },

    ];

    const getAllData = async () => {
        let response
        if (!loggedUserDetails?.roleId) {
            response = await getEventFlyerAPI(loggedInUser);
        }
        // else {
        //     response = await filterPackagesAPI(loggedInUser, loggedUserDetails?.facility_id, '', '', '');
        // }
        setData(response?.data);
    }

    const getTournaments = async () => {
        try {
            let response
            if (!loggedUserDetails?.roleId) {
                response = await getAllTournamentsAPI(loggedInUser);
            } else {
                response = await getEventsByVenuesAPI(loggedInUser, loggedUserDetails._id);
            }
            let venues = response?.result?.map(data => {
                return { "label": data.tournament_name, "value": data?._id }
            })
            setEvents(venues)
        } catch (err) {
            console.log("===========>", err)
        }
    }

    const getAllFacility = async () => {
        let response = await getFacilityApi(loggedInUser);
        if (!loggedUserDetails?.roleId) {
             let venues = response?.result?.map(data => {
                return { "label": data?.name + ', ' + data.address, "sport_type": data?.sport_type, "value": data?._id }
            });
            setFacilities(venues);
        } else {
             const filteredFacilities = response?.result.filter(item => loggedUserDetails?.facilities.includes(item._id));
             let venues = filteredFacilities?.map(data => {
                return { "label": data?.name + ', ' + data.address, "sport_type": data?.sport_type, "value": data?._id }
            });
            setFacilities(venues);
             setValue('facility_id', { label: filteredFacilities[0]?.name, value: filteredFacilities[0]?._id });
        }
   };

    useEffect(() => {
        getAllData();
        getTournaments();
        getAllFacility();
        getCoupons()
    }, [])

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
                                title: "Setting",
                            },
                            {
                                title: "Event Flyers",
                            }
                        ]}
                    />}
                    <div className="main-title-container">
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">{moduleName}</h5>
                            {matches && modulePermissionsData?.add &&
                                <Button
                                    style={{ display: 'flex', alignItems: 'center' }}
                                    className="pi-btn-primary"
                                    key="confirm" type="primary"
                                    onClick={() => { setEdit(false); setShowFormModal(true) }}
                                >
                                    <Icon icon='material-symbols-light:add' height='20' width='20' />
                                    {'Add'}
                                </Button>
                            }
                        </div>
                        <div className='title-buttons'>
                            {/* <div className="type-filter">
                                <Radio.Group
                                    options={options}
                                    {...register('sport_type')}
                                    onChange={onSportsChange}
                                    value={sport_type ? sport_type : 'all'}
                                />
                            </div> */}
                            <div className="add-export-btn">
                                {!matches && modulePermissionsData?.add &&
                                    <Button
                                        style={{ display: 'flex', alignItems: 'center' }}
                                        className="pi-btn-primary"
                                        key="confirm" type="primary"
                                        onClick={() => { setEdit(false); setShowFormModal(true) }}
                                    >
                                        <Icon icon='material-symbols-light:add' height='20' width='20' />
                                        Add
                                    </Button>
                                }
                                {matches &&
                                    <div className='title-buttons'>
                                        {matches &&
                                            <div className="filter-section-container">
                                                {/* <FilterData content={FilterSection} open={open} handleOpenChange={handleOpenChange} /> */}
                                            </div>
                                        }
                                    </div>}
                                {/* {modulePermissionsData?.export && data?.length > 0 &&
                            <Excel page={'packages'} importdata={data} />
                        } */}
                            </div>
                        </div>
                    </div>
                    <div className="main-content-card">
                        <Table
                            columns={columns}
                            data={data}
                        />
                    </div>
                </Card >
                <AddEventFlyers
                    visible={showFormModal}
                    onCancel={handleCancel}
                    row={rowdata}
                    edit={edit}
                    events={events}
                    facilities={facilities}
                    getAllData={getAllData}
                    setEdit={setEdit}
                    Couponsdata={Couponsdata}
                />
                <EventFlyersDetails
                    visible={showViewModal}
                    onCancel={handleCancel}
                    name="Event Flyers Details"
                    row={rowdata}
                />
                <DeleteConfirmation
                    visible={deleteConfirmationVisible}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    name="Event Flyer"
                />
            </div >
        </Fragment>
    )
}
