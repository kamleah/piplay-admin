import { Breadcrumb, Button, Card, Radio, RadioChangeEvent } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Select from "react-select"
import makeAnimated from "react-select/animated"
import CreatePackage from '../../../components/Modal/CreatePackage'
import Table from '../../../components/Table/DataTable'
import { useSelector } from 'react-redux'
import { deletePackagesAPI, filterPackagesAPI, getFacilityApi, getFacilityByIdApi, getPackagesAPI } from '../../../components/apiFile/Service'
import moment from 'moment'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import { Icon } from "@iconify-icon/react";
import PackageDetails from '../../../components/Modal/PackageDetails'
import FilterData from '../../../components/Modal/FilterData'
import Excel from '../../../components/Helpers/Excel'
import DeleteConfirmation from '../../../components/Modal/DeleteConfirmation'
import ToastMessage from '../ToastMessage/ToastMessage'
import { toast } from 'react-toastify'
import StatusLabel from '../../../components/Labels/StatusLabel'

const Packages = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {
    const [deleteRowId, setDeleteRowId] = useState<string | null>(null);
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [edit, setEdit] = useState(false);
    const [data, setData] = useState([]);
    const [rowdata, setRowdata] = useState({});
    const [facilityList, setFacilityList] = useState([]);
    const [copy, setCopy] = useState(false)
    const { register, watch, setValue, reset, control } = useForm()

    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
    const loggedInUser = localStorage.getItem("auth");

    const animatedComponents = makeAnimated();
    const moduleName = "Hourly Passes"
    const options = [
        { label: 'All', value: 'all' },
        { label: 'Padel', value: 'padel' },
        { label: 'Pickleball', value: 'pickleball', },
    ];

    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0)?.toUpperCase() + string.slice(1)?.toLowerCase();
    };

    const calculateDaysRemaining = (expiry_date) => {
        const currentDate = new Date()
        const newDate = new Date(expiry_date).valueOf() - new Date(currentDate).valueOf()
        const daysRemaining = Math.ceil(newDate / (1000 * 60 * 60 * 24));
        return daysRemaining >= 0 ? daysRemaining : 0;
    }
    const getStatus = (row) => {
        const now = moment();
    
        if (row?.expiry) {
            // Adjusted date range for "Active"
            if (moment(now).isBetween(moment(row.start_date).subtract(1, 'days'), moment(row.end_date).add(1, 'days'), null, '[]')) {
                return "Active";
            }
            // Check if start_date is in the future for "Scheduled"
            if (moment(row.start_date).isAfter(now)) {
                return "Scheduled";
            }
            // Otherwise, if the end date has passed, mark as "Expired"
            if (moment(row.end_date).isBefore(now)) {
                return "Expired";
            }
        } else {
            if (moment(now).isBetween(moment(row.start_date).subtract(1, 'days'), moment(row.end_date).add(1, 'days'), null, '[]')) {
                return "Active";
            }
            if (moment(row.start_date).isAfter(now)) {
                return "Scheduled";
            }
        }
    
        // Fallback return if none of the conditions are met
        return "Invalid";
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
            name: 'Hourly Passes',
            selector: row => row?.name,
            sortable: false,
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
                <StatusLabel status={getStatus(row)} />

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

    const DeleteFunction = async (id) => {
        // Actual delete logic here
        let response = await deletePackagesAPI(loggedInUser, id);
        if (response.statusCode == 0) {
            toast(<ToastMessage body={'Hourly Passes Deleted Successfully'} type="success" />, {
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
            toast(<ToastMessage body={'Error while deleting Hourly Passes'} type="warning" />, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    let name = watch("name");
    let facility_id = watch("facility_id");
    let sport_type = watch("sport_type");
    let status = watch("status");

    const handleCancel = () => {
        setShowFormModal(false);
        setShowViewModal(false);
        setEdit(false);
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
    const getAllData = async () => {
        let response
        if (!loggedUserDetails?.roleId) {
            response = await getPackagesAPI(loggedInUser);
        } else {
            response = await filterPackagesAPI(loggedInUser, loggedUserDetails?.facility_id, '', '', '');
        }
        setData(response?.result);
    }
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


    const filterData = async (search, value) => {
        let sport = ''
        if (value == '') {
            sport = sport_type
        } else {
            sport = value
        }
        let response = await filterPackagesAPI(loggedInUser,
            loggedUserDetails?.roleId ? facility_id?.value || '' : facility_id?.value,
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

    const [open, setOpen] = useState(false);
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    const onClearFilter = () => {
        getAllData();
        reset({
            name: '',
            facility_id: loggedUserDetails?.roleId ? facilityList[0] : null,
            sport_type: '',
            status: ''
        });
    }

    const FilterSection = () => {
        return (
            <>
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
                            <label htmlFor="name" className="form-lable">Hourly Passes Name</label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="name"
                                    placeholder="Enter Hourly Passes Name"
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
                {matches && <div className="filter-buttons-row">
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
            </>
        )
    }

    useEffect(() => {
        getAllData()
        getAllFacility()
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
                                    {'Create Hourly Passes'}
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
                                        Create Hourly Passes
                                    </Button>
                                }
                                {matches &&
                                    <div className='title-buttons'>
                                        {matches &&
                                            <div className="filter-section-container">
                                                <FilterData content={FilterSection} open={open} handleOpenChange={handleOpenChange} />
                                            </div>
                                        }
                                    </div>}
                                {modulePermissionsData?.export && data?.length > 0 &&
                                    <Excel page={'packages'} importdata={data} />
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
                                        <label htmlFor="name" className="form-lable">Hourly Passes Name</label>
                                        <div className="form-group">
                                            <input
                                                className="form-field"
                                                type="text"
                                                id="name"
                                                placeholder="Enter Hourly Passes Name"
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
                <CreatePackage
                    visible={showFormModal}
                    onCancel={handleCancel}
                    row={rowdata}
                    edit={edit}
                    facilityList={facilityList}
                    getAllData={getAllData}
                    setEdit={setEdit}
                    setRow={setRowdata}
                    copy={copy}
                />
                <PackageDetails
                    visible={showViewModal}
                    onCancel={handleCancel}
                    name="Hourly Passes details"
                    row={rowdata}
                />
                <DeleteConfirmation
                    visible={deleteConfirmationVisible}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    name="Hourly Passes"
                />

            </div >
        </Fragment>
    )
}

export default Packages;
