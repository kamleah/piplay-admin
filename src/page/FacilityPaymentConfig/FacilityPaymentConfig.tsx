import React, { Fragment, useEffect, useState } from 'react'
import { Card, Breadcrumb, Button } from "antd";
import Table from '../../components/Table/DataTable';
import { Icon } from '@iconify-icon/react';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import SkillLabel from '../../components/Labels/SkillLabel';
import AddFacilityPaymentConfig from '../../components/Modal/AddFacilityPaymentConfig';
import { deletePaymentConfigAPI, getFacilityApi, getFacilityByIdApi, getPaymentConfigAPI } from '../../components/apiFile/Service';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import ToastMessage from '../facilator/ToastMessage/ToastMessage';
import DeleteConfirmation from '../../components/Modal/DeleteConfirmation';
import moment from "moment";

export default function FacilityPaymentConfig({ matches, menuOpen, onToggle, modulePermissionsData }) {
    const [AddSkillLevelState, setAddSkillLevelState] = useState(false)
    const [deleteRowId, setDeleteRowId] = useState<string | null>(null);
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [edit, setEdit] = useState(false)
    const [ediData, setEditData] = useState({})
    const [filterData, setfilterData] = useState([])
    const [data, setData] = useState([])
    const [rowdata, setRowdata] = useState([])
    const [facilityList, setFacilityList] = useState([]);
    const toggle = () => { setAddSkillLevelState(!AddSkillLevelState) };
    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
    const loggedInUser = localStorage.getItem("auth");

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
            name: 'Facility Name',
            // selector:row=>console.log('row-------', row),
            selector: row => row?.facility_id?.name,
            wrap: true,
            sortable: true,
        },
        {
            name: 'Facility Location',
            selector: row => row?.facility_id?.address,
            wrap: true,
            sortable: true,
        },
        {
            name: 'Pi Play Cut %',
            selector: row => row?.pi_cut,
            wrap: true,
            sortable: true,
        },
        {
            name: 'Razorpay Cut %',
            selector: row => row?.razor_cut,
            wrap: true,
            sortable: true,
        },
        {
            name: 'Number Of Free Days',
            selector: row => row?.number_of_days,
            wrap: true,
            sortable: true,
        },
        {
            name: "Start Time",
            selector: row => moment(row?.freePeriodStart).format("DD-MM-YYYY"),
            sortable: true,
            wrap: true,
          },
          {
            name: "End Time",
            selector: row => moment(row?.freePeriodEnd).format("DD-MM-YYYY"),
            sortable: true,
            wrap: true,
          },
        {
            name: 'GST %',
            selector: row => row?.gst,
            wrap: true,
            sortable: true,
        },
        {
            name: 'Actions',
            selector: row => console.log('row-------', row),
            sortable: true,
            wrap: true,
            cell: row =>
            (
                <div className='action-button-container'>
                    {modulePermissionsData?.edit &&
                        <button className='action-button edit-button' onClick={() => { setEdit(true); setEditData(row); toggle(); }}>
                            <Icon icon="mdi:pencil-outline" />
                        </button>
                    }
                    &nbsp;&nbsp;{" "}
                    {modulePermissionsData?.delete &&
                        <button onClick={(e) => { e.preventDefault(); handleDeleteModal(row._id) }} className='action-button delete-button'>
                            <RiDeleteBin5Fill title="Delete" />
                        </button>
                    }
                    &nbsp;&nbsp;{" "}
                    {modulePermissionsData?.delete &&
                        <button onClick={(e) => { e.preventDefault(); copyToClipboard(row) }} className='action-button delete-button'>
                            <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} />
                        </button>
                    }
                </div>
            )

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
            getAllData();
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
    const getAllFacility = async () => {
        let response
        if (!loggedUserDetails?.roleId) {
            response = await getFacilityApi(loggedInUser);
        }
        let venues = response?.result?.map(data => {
            return { "label": data?.name + ', ' + data.address, "value": data?._id, "sport_type": data?.sport_type }
        })
        setFacilityList(venues);
    }

    const getAllData = async () => {
        let response
        if (!loggedUserDetails?.roleId) {
            response = await getPaymentConfigAPI(loggedInUser);
        }
        setData(response?.result);
    }

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
                                title: "Payment Config",
                            },
                        ]}
                    />}
                    <div className="main-title-container">
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">Payment Config</h5>
                            {matches && modulePermissionsData?.add &&
                                <Button
                                    key="confirm" type="primary"
                                    className="pi-btn-primary"
                                    onClick={() => toggle()}
                                >
                                    Add Payment Config
                                </Button>
                            }
                        </div>
                        <div className='title-buttons'>
                            {!matches && modulePermissionsData?.add &&
                                <Button
                                    key="confirm" type="primary"
                                    className="pi-btn-primary"
                                    onClick={() => toggle()}
                                >
                                    Add Payment Config
                                </Button>
                            }
                            {/* <Excel page={'RegisteredEvents'} importdata={filterData?.length != 0 ? filterData : data} /> */}
                        </div>

                    </div>
                    <div className="main-content-card">
                        <div style={{ position: "sticky" }}>
                            {" "}
                            <AddFacilityPaymentConfig
                                open={AddSkillLevelState}
                                toggle={toggle}
                                getAllData={getAllData}
                                editdata={ediData}
                                edit={edit}
                                setEdit={setEdit}
                                setEditData={setEditData}
                                facilityList={facilityList}
                                row={rowdata}
                            />
                            <DeleteConfirmation
                                visible={deleteConfirmationVisible}
                                onConfirm={handleConfirmDelete}
                                onCancel={handleCancelDelete}
                                name="PaymentConfig"
                            />
                        </div>
                        <Table
                            columns={columns}
                            data={filterData?.length > 0 ? filterData : data}
                        />
                    </div>
                </Card>
            </div>
        </Fragment>
    )
}
