import React, { Fragment, useEffect, useState } from 'react'
import { Breadcrumb, Button, Card, Radio, RadioChangeEvent } from 'antd'
import { Controller, useForm } from 'react-hook-form';
import Select from "react-select"
import makeAnimated from "react-select/animated"
import { deleteMembershipAPI, filterMembershipAPI, filterPackagesAPI, getFacilityApi, getMembershipAPI, getPackagesAPI } from '../../components/apiFile/Service';
import { useSelector } from 'react-redux';
import moment from 'moment';
import StatusLabel from '../../components/Labels/StatusLabel';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { Icon } from '@iconify-icon/react';
import Table from '../../components/Table/DataTable';
import CreateMembership from '../../components/Modal/CreateMembership';
import NewMembershipDetails from '../../components/Modal/NewMembershipDetails';
import DeleteConfirmation from '../../components/Modal/DeleteConfirmation';
import ToastMessage from '../facilator/ToastMessage/ToastMessage';
import { toast } from 'react-toastify';

export default function Membership({ matches, menuOpen, onToggle, modulePermissionsData }) {
    const { register, watch, setValue, reset, control } = useForm()
    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
    const loggedInUser = localStorage.getItem("auth");
    const [edit, setEdit] = useState(false);
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [copy, setCopy] = useState(false)
    const [deleteRowId, setDeleteRowId] = useState<string | null>(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [facilityList, setFacilityList] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const [rowdata, setRowdata] = useState({});
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    const animatedComponents = makeAnimated();
    const moduleName = "MemberShip"
    let name = watch("name");
    let facility_id = watch("facility_id");
    let sport_type = watch("sport_type");
    let status = watch("status");
    const options = [
        { label: 'All', value: 'all' },
        { label: 'Padel', value: 'padel' },
        { label: 'Pickleball', value: 'pickleball', },
    ];
    const filterData = async (search, value) => {
        let sport = ''
        if (value == '') {
            sport = sport_type
        } else {
            sport = value
        }
        let response = await filterMembershipAPI(loggedInUser,
            loggedUserDetails?.roleId ? facility_id?.value ||   '' : facility_id?.value ||'',
            name == undefined ? '' : name,
            status?.value == undefined ? '' : status?.value,
            sport == undefined || sport == 'all' ? '' : sport
        );
        if (response?.statusCode == 0) {
            setData(response?.result);
        } else {
            setData([]);
        }
    };
    const onSportsChange = ({ target: { value } }: RadioChangeEvent) => {
        setValue('sport_type', value);
        filterData(true, value)
    };
    const getAllData = async () => {
        let response
        if (!loggedUserDetails?.roleId) {
            response = await getMembershipAPI(loggedInUser);
        } else {
            response = await filterPackagesAPI(loggedInUser, loggedUserDetails?.facility_id, '', '', '');
        }
        setData(response?.result);
    }
    const onClearFilter = () => {
        getAllData();
        reset({
            name: '',
            facility_id: loggedUserDetails?.roleId ? facilityList[0] : null,
            sport_type: '',
            status: ''
        });
    }
    const DeleteFunction = async (id) => {
        // Actual delete logic here
        let response = await deleteMembershipAPI(loggedInUser, id);
        if (response.statusCode == 0) {
            toast(<ToastMessage body={'Membership Deleted Successfully'} type="success" />, {
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
            toast(<ToastMessage body={'Error while deleting Membership'} type="warning" />, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
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
    const getAllFacility = async () => {
        let response = await getFacilityApi(loggedInUser);
        if (!loggedUserDetails?.roleId) {
             let venues = response?.result?.map(data => {
                return { "label": data?.name + ', ' + data.address, "value": data?._id, "sport_type": data?.sport_type }
            });
             setFacilityList(venues);
        } else {
             const filteredFacilities = response?.result.filter(item => loggedUserDetails?.facilities.includes(item._id));
             let venues = filteredFacilities?.map(data => {
                return { "label": data?.name + ', ' + data.address, "value": data?._id, "sport_type": data?.sport_type }
            });
             setFacilityList(venues);
             setValue('facility_id', { label: filteredFacilities[0]?.name, value: filteredFacilities[0]?._id });
        }
   };
    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };
    const columns = [

        {
            name: 'Facility Name',
            selector: row => row?.facility_id?.name,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Facility Location',
            selector: row => row?.facility_id?.address,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Membership Name',
            selector: row => row?.name,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Duration',
            selector: row => row?.duration,
            sortable: true,
            wrap: true,
            cell: row => (<h4 className='capi'>{row?.duration}</h4>)
        },
        {
            name: 'Sport Type',
            selector: row => row?.sport_type,
            sortable: true,
            wrap: true,
            cell: row => (<h4 className='capi'>{row?.sport_type}</h4>)
        },
        {
            name: 'Start Date',
            selector: row => moment(row?.start_date).format('DD-MM-YYYY'),
            sortable: true,
            wrap: true,
        },
        {
            name: 'End Date',
            selector: row => row?.end_date ? moment(row?.end_date).format('DD-MM-YYYY') : 'No Expiry',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Status',
            selector: row => row?.status,
            sortable: true,
            wrap: true,
            cell: row =>
                <div className='playerContainer max-width-container'>

                    <StatusLabel status={capitalizeFirstLetter(row.status)} />
                </div>
        },
        {
            name: 'Actions',
            sortable: true,
            wrap: true,
            cell: row =>
            (<div className='action-button-container'>
                <button className='action-button view-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'view') }} ><Icon icon="raphael:view" /></button>
                <button className='action-button edit-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'edit') }}><Icon icon="mdi:pencil-outline" /></button>
                <button onClick={(e) => { e.preventDefault(); handleDeleteModal(row._id) }} className='action-button delete-button'>
                    <RiDeleteBin5Fill title="Delete" />
                </button>
                {modulePermissionsData?.add &&
                    <button type="button" className='action-button view-button' onClick={() => { setEdit(true); setCopy(true); setRowdata(row); setShowFormModal(true) }}>
                        <Icon icon="ant-design:copy-filled" />
                    </button>
                }

            </div >)
            ,
        },

    ];
    useEffect(() => {
        getAllFacility()  
        getAllData()      
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
                                title: "Facility",
                            },
                            {
                                title: `${moduleName}`,
                            }
                        ]}
                    />}
                    <div className="main-title-container">
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">{moduleName}</h5>
                            {matches && modulePermissionsData?.add &&
                                <Button
                                    className="pi-btn-primary"
                                    key="confirm" type="primary"
                                    onClick={() => { setEdit(false); setShowFormModal(true) }}
                                >
                                    {'Create Membership'}
                                </Button>
                            }
                        </div>
                        <div className='title-buttons'>
                            <div className="type-filter">
                                <Radio.Group
                                    options={options}
                                    {...register('sport_type')}
                                    onChange={onSportsChange}
                                    value={sport_type ? sport_type : 'all'}
                                />
                            </div>
                            <div className="add-export-btn">
                                {!matches && modulePermissionsData?.add &&
                                    <Button
                                        className="pi-btn-primary"
                                        key="confirm" type="primary"
                                        onClick={() => { setEdit(false); setShowFormModal(true) }}
                                    >
                                        Create Membership
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
                        {!matches &&
                            // <FilterSection />
                            <div className="filter-form">
                                <div className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"}`}>
                                    <div className="input-group">
                                        <label htmlFor="facility_id" className="form-lable">Facility</label>
                                        <div className="form-group">
                                            <Controller
                                                name="facility_id"
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
                                        <label htmlFor="name" className="form-lable">Membership Name</label>
                                        <div className="form-group">
                                            <input
                                                className="form-field"
                                                type="text"
                                                id="name"
                                                placeholder="Enter Membership Name"
                                                {...register('name')}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="status" className="form-lable">Status</label>
                                        <div className="form-group">
                                            <Controller
                                                name="status"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        // closeMenuOnSelect={false}
                                                        className="controller-select"
                                                        components={animatedComponents}
                                                        defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                                                        // isMulti
                                                        options={[
                                                            { label: 'Active', value: 'active' },
                                                            { label: 'Schedule', value: 'scheduled' },
                                                            { label: 'Expired', value: 'expired' }
                                                        ]}
                                                        placeholder="Select Status"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {!matches && <div className="filter-buttons-row">
                                    <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => {
                                        filterData(true, "")
                                        handleOpenChange(false);
                                    }}>Apply</Button>
                                    <Button
                                        className="pi-btn-secondary"
                                        key="cancel"
                                        onClick={() => {
                                            onClearFilter();
                                            handleOpenChange(false);
                                        }}
                                    >
                                        Clear
                                    </Button>

                                </div>}
                            </div>
                        }
                        <Table
                            columns={columns}
                            data={data}
                        />
                    </div>

                </Card >
                <CreateMembership
                    visible={showFormModal}
                    onCancel={handleCancel}
                    row={rowdata}
                    edit={edit}
                    facilityList={facilityList}
                    getAllData={getAllData}
                    setEdit={setEdit}
                    copy={copy}
                />
                <NewMembershipDetails
                    visible={showViewModal}
                    onCancel={handleCancel}
                    name="Membership details"
                    row={rowdata}
                />
                <DeleteConfirmation
                    visible={deleteConfirmationVisible}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    name="Membership"
                />
            </div >
        </Fragment>
    )
}
