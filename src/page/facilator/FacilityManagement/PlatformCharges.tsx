import React, { useState, useEffect, Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { useSelector } from "react-redux";
import makeAnimated from 'react-select/animated';
import { Button, Card, Breadcrumb } from 'antd';
import { Icon } from "@iconify-icon/react";
import Table from '../../../components/Table/DataTable';
import AddPartner from '../../../components/Modal/AddPartner';
import PartnerDetails from '../../../components/Modal/PartnerDetails';
import { createPaymentConfigAPI, getPaymentConfigAPI, editPaymentCongigAPI, getFacilityApi, getFacilityByIdApi, deletePaymentConfigAPI } from '../../../components/apiFile/Service';
import ToastMessage from '../ToastMessage/ToastMessage';
import { toast } from 'react-toastify';
import moment from 'moment';
import DeleteConfirmation from '../../../components/Modal/DeleteConfirmation';
import FilterData from "../../../components/Modal/FilterData";
interface Facility {
    _id: string;
    name: string;
    address: string;
}

interface PaymentConfig {
    _id: string;
    facility_id: Facility;
    pi_cut: number;
    razor_cut: number;
    number_of_days: number;
    freePeriodStart: string;
    freePeriodEnd: string;
}


interface FormData {
    name: string;
    _id: string;
    facility_id: "";
    pi_cut: number;
    razor_cut: number;
    number_of_days: number;
}

interface PlatformChargesProps {
    matches: boolean;
    menuOpen: boolean;
    onToggle: () => void;
    modulePermissionsData: {
        view: boolean;
        edit: boolean;
        add: boolean;
    };
}

interface FacilityOption {
    label: string;
    value: string;
}

function PlatformCharges({ matches, menuOpen, onToggle, modulePermissionsData }: PlatformChargesProps) {
    const [data, setData] = useState<PaymentConfig[]>([]);
    const [filteredData, setFilteredData] = useState<PaymentConfig[]>([]);
    const [deleteRowId, setDeleteRowId] = useState<string | null>(null);
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [rowdata, setRowdata] = useState<PaymentConfig | {}>({});
    const [facilityList, setFacilityList] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState<FacilityOption | null>(null);
    const { control } = useForm();
    const animatedComponents = makeAnimated();
    const moduleName = "Paltform Charges";
    console.log('facility list from platform: ', facilityList);



    const loggedInUser = localStorage.getItem("auth");
    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
    const [open, setOpen] = useState(false);
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    const fetchData = async () => {
        try {
            const response = await getPaymentConfigAPI(loggedInUser);
            console.log("get all data from paymentconfig:", response);


            if (response && response.result) {

                setData(response.result);
                console.log("setData", data);

                setFilteredData(response.result);
            } else {
                console.error('No data returned from API');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const getAllFacility = async () => {
        let response = await getFacilityApi(loggedInUser);
        if (!loggedUserDetails?.roleId) {
             let venues = response?.result?.map(data => {
                return { "label": data?.name, "value": data?._id }
            });
             setFacilityList(venues);
        } else {
             const filteredFacilities = response?.result.filter(item => loggedUserDetails?.facilities.includes(item._id));
             let venues = filteredFacilities?.map(data => {
                return { "label": data?.name, "value": data?._id }
            });
             setFacilityList(venues);
        }
   };
    useEffect(() => {
        if (loggedInUser) {
            fetchData();
        }
    }, [loggedInUser]);

    useEffect(() => {
        getAllFacility();
        if (editMode && rowdata as PaymentConfig) {
            setSelectedFacility({ label: (rowdata as PaymentConfig).facility_id.name, value: (rowdata as PaymentConfig).facility_id._id });
        }
    }, [editMode, rowdata]);

    useEffect(() => {
        if (data.length > 0 && filteredData.length > 0) {

        }
    }, [data, filteredData]);

    const handleAddPaymentConfig = async (paymentConfig: FormData) => {
        try {

            const response = editMode
                ? await editPaymentCongigAPI(loggedInUser, paymentConfig._id, paymentConfig,)
                : await createPaymentConfigAPI(loggedInUser, paymentConfig);

            console.log('API Response:', response);
            console.log(paymentConfig);


            if (response.status === 0) {
                fetchData();
                setShowAddModal(false);
            } else {
                console.error('API Error:', response.message || 'Unknown error');
            }
        } catch (error) {
            console.error("Error handling payment configuration:", error);
        }
    };


    const handleShowModal = (row: PaymentConfig, type: string) => {
        setRowdata(row);
        if (type === 'view') {
            setShowViewModal(true);
        } else if (type === 'edit') {
            setEditMode(true);
            setShowAddModal(true);
        }
    };

    const handleCancel = () => {
        setShowViewModal(false);
    };

    const handleAddPartner = () => {
        setEditMode(false);
        setShowAddModal(true);
    };

    const handleCloseAddPartner = () => {
        setShowAddModal(false);
    };

    const handleConfirmDelete = async () => {
        if (deleteRowId) {
            await DeleteFunction(deleteRowId);
            setDeleteConfirmationVisible(false);
            setDeleteRowId("");
        }
    };

    const DeleteFunction = async (id) => {
        // Actual delete logic here
        let response = await deletePaymentConfigAPI(loggedInUser, id);
        if (response.statusCode == 0) {
            toast(<ToastMessage body={'Payment Config Deleted Successfully'} type="success" />, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            fetchData();
        } else {
            console.log(response)
            toast(<ToastMessage body={'Error while deleting Payment Config'} type="warning" />, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleDeleteModal = (id) => {
        setDeleteRowId(id);
        setDeleteConfirmationVisible(true);
    };
    const handleCancelDelete = () => {
        setDeleteConfirmationVisible(false);
        setDeleteRowId("");
    };

    const filterData = (selectedFacility: { label: string } | null) => {
        if (selectedFacility) {
            const filtered = data.filter(item => item.facility_id.name === selectedFacility.label);
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    };

    const onClearFilter = () => {
        setFilteredData(data);
        setSelectedFacility(null);
    };

    const FilterSection = () => {
        const facilityOptions = Array.isArray(data) ? data.map(item => ({
            value: item.facility_id._id,
            label: item.facility_id.name
        })) : [];

        console.log("selectedFacility =====", selectedFacility);


        return (
            <div className="filter-form">
                <div className={`${matches ? "filter-section border-bottom-light" : "filter-fields"}`}>
                    <div className="input-group">
                        <label htmlFor="facility_id" className="form-label">Facility</label>
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
                    <div className="filter-buttons-row">
                        <Button
                            className="pi-btn-primary"
                            key="confirm"
                            type="primary"
                            onClick={() => filterData(selectedFacility)}
                        >
                            Apply
                        </Button>
                        <Button
                            className="pi-btn-secondary"
                            key="cancel"
                            onClick={onClearFilter}
                        >
                            Clear
                        </Button>
                    </div>
                </div>
            </div>
        );
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
            name: 'Facility Name',
            selector: (row: PaymentConfig) => row.facility_id?.name || '',
            wrap: true,
            sortable: true,
        },
        {
            name: 'Facility ID',
            selector: (row: PaymentConfig) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {row.facility_id._id}
                    <Icon
                        icon="solar:copy-bold"
                        height="18"
                        width="18"
                        style={{ paddingLeft: '5px', cursor: 'pointer' }}
                        onClick={() => copyToClipboard(row.facility_id._id)}
                    />
                </div>
            ),
            wrap: true,
            sortable: true,
        },
        {
            name: 'Pi Play %',
            selector: (row: PaymentConfig) => row.pi_cut,
            wrap: true,
            sortable: true,
        },
        {
            name: 'Razorpay %',
            selector: (row: PaymentConfig) => row.razor_cut,
            wrap: true,
            sortable: true,
        },
        {
            name: 'Free Period Days',
            selector: (row: PaymentConfig) => row.number_of_days,
            wrap: true,
            sortable: true,
        },
        {
            name: 'Free Period Start Time',
            selector: (row: PaymentConfig) => moment(row.freePeriodStart).format('YYYY-MM-DD'),
            wrap: true,
            sortable: true,
        },
        {
            name: 'Free Period End Time',
            selector: (row: PaymentConfig) => moment(row.freePeriodEnd).format('YYYY-MM-DD'),
            wrap: true,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row: PaymentConfig) => (
                <div className='action-button-container'>
                    {modulePermissionsData?.view &&
                        <button className='action-button view-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'view') }} ><Icon icon="raphael:view" /></button>
                    }
                    {modulePermissionsData?.edit &&
                        <button className='action-button edit-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'edit') }}><Icon icon="mdi:pencil-outline" /></button>
                    }
                    {modulePermissionsData?.edit &&
                        <button className='action-button edit-button' onClick={() => copyToClipboard(row)}>
                            <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} />
                        </button>
                    }
                    {modulePermissionsData?.edit &&
                        <button onClick={(e) => { e.preventDefault(); handleDeleteModal(row._id) }} className='action-button delete-button' disabled={loggedUserDetails?._id == row?._id}>
                            <Icon icon="clarity:trash-solid" />
                        </button>}
                </div>
            ),
        },
    ];

    return (
        <Fragment>
            <div
                onClick={onToggle}
                className={menuOpen ? `page-open-header${matches ? "-mobile" : ""}` : `page-header${matches ? "-mobile" : ""}`}
            >
                <Card>
                    {!matches && <Breadcrumb
                        items={[
                            { title: "Home" },
                            { title: "Platform Charges" },
                        ]}
                    />}
                    <div className="main-title-container">
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">Platform Charges</h5>
                            <div className="main-content-title" style={{ backgroundColor: 'yellow', fontSize: '12px', color: 'black', padding: '0 10px 0 10px', borderRadius: '16px' }}>
                                In Progress</div>



                            {matches && modulePermissionsData?.add &&
                                <Button
                                    key="confirm"
                                    type="primary"
                                    className="pi-btn-primary"
                                    onClick={handleAddPartner}
                                >
                                    Add Partner
                                </Button>
                            }
                        </div>
                        {!matches && modulePermissionsData?.add &&
                            <Button
                                key="confirm"
                                type="primary"
                                className="pi-btn-primary"
                                onClick={handleAddPartner}
                            >
                                Add Partner
                            </Button>
                        }
                    </div>
                    <div className="main-content-card">
                        <div className="filter-section-container">
                            {matches &&
                                <div className="filter-section-container">
                                    <FilterData content={FilterSection} open={open} handleOpenChange={handleOpenChange} />
                                </div>
                            }
                        </div>
                        {!matches &&
                                <FilterSection />
                           }
                        <Table
                            columns={columns}
                            data={filteredData}
                        />
                    </div>
                    <DeleteConfirmation
                        visible={deleteConfirmationVisible}
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                        name="PlatformCharges for partner"
                    />
                    <PartnerDetails
                        visible={showViewModal}
                        onCancel={handleCancel}
                        name={`${moduleName} Details`}
                        row={rowdata as PaymentConfig}
                    />
                    <AddPartner
                        open={showAddModal}
                        fetchData={fetchData}
                        toggle={handleCloseAddPartner}
                        onSubmit={handleAddPaymentConfig}
                        edit={editMode}
                        setEdit={() => setEditMode(false)}
                        setEditData={(data: Partial<FormData>) => setRowdata(data)}
                        initialData={rowdata as Partial<FormData>}
                        facilityOptionsList={facilityList}
                    />
                </Card>
            </div>
        </Fragment>
    );
}

export default PlatformCharges;
