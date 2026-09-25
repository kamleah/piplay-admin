import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Breadcrumb, Button, Radio, RadioChangeEvent } from "antd";
import { deleteCourt, filterCourt, getAllCoaches, getAllCourt, getFacilityApi, getFacilityByIdApi } from "../../../components/apiFile/Service";
import ToastMessage from "../ToastMessage/ToastMessage";
import { toast } from "react-toastify";
import _ from "lodash";
import { Icon } from "@iconify-icon/react";
import { Controller, useForm } from 'react-hook-form';
import Table from "../../../components/Table/DataTable";
import moment from "moment";
import { RiDeleteBin5Fill } from "react-icons/ri";
import DeleteConfirmation from "../../../components/Modal/DeleteConfirmation";
import CourtDetails from "../../../components/Modal/CourtDetails";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import AddCourt from "../../../components/Modal/AddCourt";
import Excel from "../../../components/Helpers/Excel";
import FilterData from "../../../components/Modal/FilterData";



const ManageCourt = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {

    const moduleName = "Manage Court"
    const [data, setData] = useState([]);
    const loggedInUser = localStorage.getItem("auth");
    const [showViewModal, setShowViewModal] = useState(false);
    const [facilityList, setFacilityList] = useState([]);
    const [showFormModal, setShowFormModal] = useState(false);
    const [edit, setEdit] = useState(false);
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [deleteRowId, setDeleteRowId] = useState<string | null>(null);
    const [copy, setCopy] = useState(false)
    const [editData, setEditData] = useState({})
    const animatedComponents = makeAnimated();

    const { register, watch, setValue, reset, control } = useForm()

    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)

    let name = watch("name");
    let facility_id = watch("facility_id");
    let sport_type = watch("sport_type");

    const columns = [
        // {
        //     name: 'Image',
        //     selector: row => row?._id,
        //     wrap: true,
        //     sortable: false,
        //     cell: row => (<div><img src={row?.image} className='table-lg-img' /></div>)
        // },
        {
            name: 'Facility Location',
            selector: row => row?.facility?.city ? `${row?.facility?.address},${row?.facility?.city}` : `${row?.facility?.address}`,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Court Name',
            selector: row => row?.name,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Court Type',
            selector: row => row?.type,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Facility',
            selector: row => row?.facility?.name,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Sports Type',
            selector: row => row?.game,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Start Time',
            selector: row => row?.start_time,
            sortable: true,
            wrap: true,
        },
        {
            name: 'End Time',
            selector: row => row?.end_time,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Slot size',
            selector: row => row?.slot_size,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Price Type',
            selector: row => row?.price_type,
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
            name: 'Actions',
            sortable: true,
            wrap: true,
            cell: row =>
                <div className='action-button-container'>
                    {modulePermissionsData?.view &&
                        <button className='action-button view-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'view') }} ><Icon icon="raphael:view" /></button>
                    }
                    {modulePermissionsData?.edit &&
                        <button className='action-button edit-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'edit') }}><Icon icon="mdi:pencil-outline" /></button>
                    }
                    {modulePermissionsData?.delete &&
                        <button onClick={(e) => { e.preventDefault(); handleDeleteModal(row._id) }} className='action-button delete-button'>
                            <RiDeleteBin5Fill title="Delete" />
                        </button>
                    }
                    {modulePermissionsData?.add &&
                        <button type="button" className='action-button view-button' onClick={() => { setEdit(true); setCopy(true); setEditData(row); setShowFormModal(true) }}>
                            <Icon icon="ant-design:copy-filled" />
                        </button>
                    }
                </div >
            ,
        },
    ];

    // delete popup 
    const handleDeleteModal = (id) => {
        setDeleteRowId(id);
        setDeleteConfirmationVisible(true);
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

    const DeleteFunction = async (id) => {
        // Actual delete logic here
        let response = await deleteCourt(loggedInUser, id);
        if (response.statusCode == 0) {
            toast(<ToastMessage body={`Court Deleted Successfully`} type="success" />, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            getAllData();
        } else {
            toast(<ToastMessage body={`Failed To Delete the Court`} type="warning" />, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleShowModal = async (row: any, type: any) => {
        setEditData(row);
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
        setShowFormModal(false);
        setEdit(false);
    };

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
        let response = await filterCourt(loggedInUser,
            name == undefined ? '' : name,
            loggedUserDetails?.roleId ? facility_id?.value ||   '' : facility_id?.value,
            sport == undefined || sport == 'all' ? '' : sport
        );
        if (response?.statusCode == 0) {
            setData(response?.result);
        } else {
            setData([]);
        }
    };

    const onClearFilter = () => {
        getAllData();
        reset({
            name: '',
            facility_id: loggedUserDetails?.roleId ? facilityList[0] : null,
            sport_type: '',
        });
    }

    const options = [
        { label: 'All', value: 'all' },
        { label: 'Padel', value: 'Padel' },
        { label: 'Pickleball', value: 'Pickleball', },
    ];

    const onSportsChange = ({ target: { value } }: RadioChangeEvent) => {
        setValue('sport_type', value);
        filterData(true, value)
    };

    const getAllData = async () => {
        let response
        if (!loggedUserDetails?.roleId) {
            response = await getAllCourt(loggedInUser);
        } else {
            response = await filterCourt(loggedInUser, '', loggedUserDetails?.facility_id, "");
        }
        setData(response?.result);
    }

    useMemo(() => {
    }, [showFormModal, edit])


    useEffect(() => {
        getAllData();
        getAllFacility();
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
                            <label htmlFor="name" className="form-lable">Court Name</label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="name"
                                    placeholder="Enter Court Name"
                                    {...register('name')}
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

    return (
        <>
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
                                title: `${moduleName}s`,
                            }
                        ]}
                    />}
                    <form className="">
                        <div className="main-title-container">
                            <div className="title-add-mobile">
                                <h5 className="main-content-title">{`${moduleName}s`}</h5>
                                {matches && modulePermissionsData?.add &&
                                    <Button
                                        className="pi-btn-primary"
                                        key="confirm" type="primary"
                                        onClick={() => { setEdit(false); setShowFormModal(true) }}
                                    >
                                        Add Court
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
                                            Add Court
                                        </Button>
                                    }
                                    {modulePermissionsData?.export && data?.length > 0 &&
                                        <Excel page={'manage_court'} importdata={data} />
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
                                            <label htmlFor="name" className="form-lable">Court Name</label>
                                            <div className="form-group">
                                                <input
                                                    className="form-field"
                                                    type="text"
                                                    id="name"
                                                    placeholder="Enter Court Name"
                                                    {...register('name')}
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
                    </form>
                </Card>
                <CourtDetails
                    visible={showViewModal}
                    onCancel={handleCancel}
                    name="Court Details"
                    row={editData}
                />
                <AddCourt
                    open={showFormModal}
                    onCancel={handleCancel}
                    toggle={setShowFormModal}
                    row={editData}
                    editdata={editData}
                    setEditData={setEditData}
                    edit={edit}
                    copy={copy}
                    setCopy={setCopy}
                    facilityList={facilityList}
                    setEdit={setEdit}
                    getAllData={getAllData}
                />
                <DeleteConfirmation
                    visible={deleteConfirmationVisible}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    name="Court"
                />
            </div >

        </>
    );
};
export default ManageCourt;
