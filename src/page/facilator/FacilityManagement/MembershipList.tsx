import React, { Fragment, useEffect, useState } from 'react'
import { Breadcrumb, Button, Card, Radio, RadioChangeEvent } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import Select from "react-select"
import makeAnimated from "react-select/animated"
import Table from '../../../components/Table/DataTable'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import moment from 'moment'
import { Icon } from '@iconify-icon/react'
import { deleteFacilityAPI, deleteMembershipDataAPI, filterMembershipDataAPI, filterPackagesAPI, getFacilityApi, getFacilityByIdApi, getMembershipDataAPI, getPackagesAPI } from '../../../components/apiFile/Service'
import { useSelector } from 'react-redux'
import AddMembership from '../../../components/Modal/AddMembership'
import MembershipDetails from '../../../components/Modal/MembershipDetails'
import { toast } from 'react-toastify'
import ToastMessage from '../ToastMessage/ToastMessage'
import DeleteConfirmation from '../../../components/Modal/DeleteConfirmation'
import StatusLabel from '../../../components/Labels/StatusLabel'
import Excel from '../../../components/Helpers/Excel'
import FilterData from '../../../components/Modal/FilterData'


export default function MembershipList({ matches, menuOpen, onToggle, modulePermissionsData }) {
    const { register, watch, setValue, reset, control } = useForm()
    const [edit, setEdit] = useState(false);
    const [deleteRowId, setDeleteRowId] = useState<string | null>(null);
    const [data, setData] = useState([]);
    const [facilityList, setFacilityList] = useState([]);
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [rowdata, setRowdata] = useState({});
    const [membership, setMembership] = useState([]);
    const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);
    const [showFacilityEditModal, setShowFacilityEditModal] = useState(false);
    const [showFacilityViewModal, setShowFacilityViewModal] = useState(false);
    const [open, setOpen] = useState(false);

    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
    const loggedInUser = localStorage.getItem("auth");

    const handleCancel = () => {
        setShowFormModal(false);
        setShowViewModal(false);
        setEdit(false);
    };
    const handleShowModal = async (row: any, type: any) => {
        console.log(row);

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
    const moduleName = "Hourly Passes List"
    let status = watch("status");
    let name = watch("name");
    let facility_id = watch("facility_id");

    const animatedComponents = makeAnimated();
    let sport_type = watch("sport_type");
    const options = [
        { label: 'All', value: 'all' },
        { label: 'Padel', value: 'Padel' },
        { label: 'Pickleball', value: 'Pickleball', },
    ];


    const handleDeleteConfirmation = (id) => {
        setUserToDeleteId(id);
        setDeleteConfirmationVisible(true);
    };

    const handleConfirmDelete = async () => {
        if (userToDeleteId) {
            await DeleteFunction(userToDeleteId);
            setDeleteConfirmationVisible(false);
            setShowFacilityEditModal(false);
            setUserToDeleteId("");
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmationVisible(false);
        setShowFacilityViewModal(false);
        setShowFacilityEditModal(false);
        setUserToDeleteId("");
    };

    const DeleteFunction = async (id) => {
        let response = await deleteMembershipDataAPI(loggedInUser, id);
        if (response.code == 'SUCCESS') {
            toast(<ToastMessage body={'User Hourly Passes Data Deleted Successfully'} type="success" />, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            getmembershipData();
        } else {
            console.log(response)
            toast(<ToastMessage body={'Error while deleting User Hourly Passes'} type="warning" />, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0)?.toUpperCase() + string.slice(1)?.toLowerCase();
    };
    const getmembershipData = async () => {
        let response
        if (!loggedUserDetails?.roleId) {
            response = await getMembershipDataAPI(loggedInUser);
        }
        else {
            response = await filterMembershipDataAPI(loggedInUser, loggedUserDetails?.facility_id, '', '');
        }
        setData(response?.data);
    }

    const calculateDaysRemaining = (expiry_date) => {
        const currentDate = new Date()
        const newDate = new Date(expiry_date).valueOf() - new Date(currentDate).valueOf()
        const daysRemaining = Math.ceil(newDate / (1000 * 60 * 60 * 24));
        return daysRemaining >= 0 ? daysRemaining : 0;
    }

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
            name: 'Players Name',
            selector: row => `${row?.user_id?.firstname} ${row?.user_id?.lastname}`,
            // selector: row => console.log('row-------', row),
            sortable: true,
            wrap: true,
        },
        {
            name: 'Hourly Passes',
            selector: row => row?.package_id?.name,
            sortable: false,
            wrap: true,
        },
        {
            name: 'Mobile No',
            selector: row => row?.user_id?.mobileno,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Remaining Hours',
            selector: row => row?.remaining_hours +' hrs',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Days Remaining to Expire',
            selector: row => calculateDaysRemaining(row?.package_expiry_date),
            sortable: true,
            wrap: true,
        },
        {
            name: 'Expiry Date',
            selector: row => moment(row?.package_expiry_date).format('DD-MM-YYYY'),
            sortable: true,
            wrap: true,
        },
        {
            name: 'Sport Type',
            sortable: true,
            wrap: true,
            cell: row => (<h4 className='capi'>{row?.facility_id?.sport_type}</h4>)
        },
        {
            name: 'Facilty Name',
            selector: row => row?.facility_id?.name,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Facilty Location',
            selector: row => row?.facility_id?.address,
            sortable: true,
            wrap: true,
            cell: row => (<h4 className='capi'>{row?.facility_id?.address}</h4>)
        },
        {
            name: 'Status',
            selector: row => {
                const currentDate = moment();
                const startDate = moment();
                const endDate = moment(row?.package_expiry_date);

                if (currentDate.isBefore(startDate)) {
                    return <StatusLabel status={capitalizeFirstLetter('scheduled')} />;
                } else if (currentDate.isAfter(endDate)) {
                    return <StatusLabel status={capitalizeFirstLetter('expired')} />;
                } else {
                    return <StatusLabel status={capitalizeFirstLetter('active')} />;
                }
            },
            sortable: true,
            wrap: true,
            style: {
                minWidth: 'max-content',
                maxWidth: 'max-content',
            }
        },
        {
            name: 'Actions',
            sortable: true,
            wrap: true,
            cell: row =>
            (<div className='action-button-container'>
                <button className='action-button view-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'view') }} ><Icon icon="raphael:view" /></button>


                <button className='action-button edit-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'edit') }}><Icon icon="mdi:pencil-outline" /></button>


                {modulePermissionsData?.delete &&
                    <button onClick={() => { handleDeleteConfirmation(row._id) }} className='action-button delete-button'>
                        <Icon icon="clarity:trash-solid" />
                    </button>
                }
                {modulePermissionsData?.delete &&
                    <button onClick={() => copyToClipboard(row)} className='action-button delete-button'>
                        <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} />
                    </button>
                }

            </div >)
            ,
        },

    ];

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

    const getMemberships = async () => {
        let response
        if (!loggedUserDetails?.roleId) {
            response = await getPackagesAPI(loggedInUser);
        } else {
            response = await filterPackagesAPI(loggedInUser, loggedUserDetails?.facility_id, '', '', '');
        }
        let venues = response?.result?.map(data => {
            return { "label": data?.name, "value": data?._id, 'data': data }
        })
        setMembership(venues);
    }

    useEffect(() => {
        getmembershipData();
        getAllFacility();
        getMemberships();
    }, [])

    const filterData = async (search, value) => {
        let sport = ''
        if (value == '') {
            sport = sport_type
        } else {
            sport = value
        }
        let response = await filterMembershipDataAPI(loggedInUser,
            loggedUserDetails?.roleId ? facility_id?.value ||   '' : facility_id?.value,
            status?.value == undefined ? '' : status?.value,
            sport == undefined || sport == 'all' ? '' : sport
        );
        if (response?.data?.length > 0) {
            setData(response?.data);
        } else {
            setData([]);
        }
    };


    const onSportsChange = ({ target: { value } }: RadioChangeEvent) => {
        setValue('sport_type', value);
        filterData(true, value)
    };
    const onClearFilter = () => {
        getmembershipData();
        reset({
            name: '',
            facility_id: loggedUserDetails?.roleId ? facilityList[0] : null,
            sport_type: '',
            status: ''
        });
    }

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
                                                { label: "Active", value: "active" },
                                                { label: "Inactive", value: "inactive" },
                                                { label: "Expired", value: "expired" }
                                            ]}
                                            placeholder="Select Status"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {matches &&
                    <div className="filter-buttons-row">
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
        <Fragment>
            <div
                onClick={onToggle}
                className={menuOpen ? `page-open-header${matches ? "-mobile" : ""}` : `page-header${matches ? "-mobile" : ""}`}>
                <Card>
                    {!matches && <Breadcrumb
                        items={[
                            {
                                title: "Home",
                            },
                            {
                                title: "Facilty",
                            },
                            {
                                title: `${moduleName}s`,
                            }
                        ]}
                    />}
                    <div className="main-title-container">
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">{moduleName}s</h5>
                            {matches && modulePermissionsData?.add &&
                                <Button
                                    className="pi-btn-primary"
                                    key="confirm" type="primary"
                                    onClick={() => { setEdit(false); setShowFormModal(true) }}
                                >
                                    {'Buy Hourly Passes'}
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
                                        Buy Hourly Passes
                                    </Button>
                                }
                                {matches &&
                                    <div className="filter-section-container">
                                        <FilterData content={FilterSection} open={open} handleOpenChange={handleOpenChange} />
                                    </div>
                                }
                                {modulePermissionsData?.export && data?.length > 0 &&
                                    <Excel page={'packagelist'} importdata={data} />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="main-content-card">
                        {!matches &&
                            <div className='filter-form'>
                                <div className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"}`}>
                                    <div className="input-group">
                                        <label htmlFor="facility_id" className="form-lable">Facility Name</label>
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
                                                            { label: "Active", value: "active" },
                                                            { label: "Expired", value: "expired" }
                                                        ]}
                                                        placeholder="Select Status"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="filter-buttons-row">
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

                                </div>
                            </div>
                        }
                        <Table
                            columns={columns}
                            data={data}
                        />
                    </div>

                </Card>
                <AddMembership
                    visible={showFormModal}
                    onCancel={handleCancel}
                    row={rowdata}
                    edit={edit}
                    getAll={getmembershipData}
                    membership={membership}
                    facilityList={facilityList}
                    setEdit={setEdit}
                />
                <MembershipDetails
                    visible={showViewModal}
                    onCancel={handleCancel}
                    name="User Hourly Passes details"
                    row={rowdata}
                />
                <DeleteConfirmation
                    visible={deleteConfirmationVisible}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    name="User Hourly Passes"
                />
            </div>
        </Fragment>
    )
}
