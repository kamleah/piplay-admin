import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Card, Breadcrumb, Button } from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import ToastMessage from "../../ToastMessage/ToastMessage";
import { toast } from "react-toastify";
import _ from "lodash";
import { deleteOrganizerAPI, deleteSkillLevelAPI, getAllOrganizersAPI, getAllSkillLevelsAPI } from "../../../../components/apiFile/Service";
import AddOrganizer from "../../../../components/Modal/AddOrganizer";
import DeleteConfirmation from "../../../../components/Modal/DeleteConfirmation";

import { Icon } from "@iconify-icon/react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Table from "../../../../components/Table/DataTable";
import Excel from "../../../../components/Helpers/Excel";
import { useSelector } from "react-redux";


const EventOrganizers = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {

    const [data, setData] = useState([])
    const [AddOrganizerState, setAddOrganizerState] = useState(false)
    const [edit, setEdit] = useState(false)
    const [ediData, setEditData] = useState({})
    const [filterData, setfilterData] = useState([])
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [couponToDeleteId, setCouponToDeleteId] = useState<string | null>(null);

    const loggedInUser = localStorage.getItem("auth");
    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)    

    const toggle = () => { setAddOrganizerState(!AddOrganizerState) };


    const columns = [
        {
            name: 'Organizers Logo',
            selector: row => row?.name,
            wrap: true,
            cell: row => (<img src={row?.icon} className='table-md-img' />)
        },
        {
            name: 'Organizers Name',
            selector: row => row?.name,
            wrap: true,
            sortable: true,
        },
        {
            name: 'Actions',
            selector: row => row.year,
            sortable: true,
            wrap: true,
            cell: row =>
            (
                <div className='action-button-container'>
                    {modulePermissionsData?.edit &&
                    <button className="action-button edit-button" onClick={() => { setEdit(true); setEditData(row); toggle(); }}>
                        <Icon icon="mdi:pencil-outline" />
                    </button>}
                    &nbsp;&nbsp;{" "}
                    {modulePermissionsData?.delete &&
                    <button onClick={() => { handleDeleteConfirmation(row._id) }} className="action-button delete-button">
                        <RiDeleteBin5Fill title="Delete" />
                    </button>}
                </div>
            )

            ,
        },
    ];

    const handleDeleteConfirmation = (id) => {
        setCouponToDeleteId(id);
        setDeleteConfirmationVisible(true);
    };

    const handleConfirmDelete = async () => {
        if (couponToDeleteId) {
            await DeleteFunction(couponToDeleteId);
            setDeleteConfirmationVisible(false);
            setCouponToDeleteId("");
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmationVisible(false);
        setCouponToDeleteId("");
    };

    const DeleteFunction = async (id) => {
        let response = await deleteOrganizerAPI(loggedInUser, id)
        if (response.statusCode == 0) {
            toast(<ToastMessage body={"Organizer Deleted Successfully"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            getOrganizers();
        } else {
            toast(<ToastMessage body={"Failed To Delete the Organizer"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    const getOrganizers = async () => {

        if(!loggedUserDetails?.roleId){
            let response = await getAllOrganizersAPI(loggedInUser);
            setData(response?.result)            
        }else{
            let response = await getAllOrganizersAPI(loggedInUser);          
            const filterdata = response?.result?.filter(item=> item?._id == loggedUserDetails?.organizerId)                      
            setData(filterdata)
        }
    }

    useMemo(() => {
    }, [AddOrganizerState, edit])

    useEffect(() => {
        getOrganizers();
    }, [])

    return (
        <Fragment>
            <div
                onClick={onToggle}
                className={menuOpen ? `page-open-header${matches ? "-mobile" : ""}` : `page-header${matches ? "-mobile" : ""}`}
            >
                <Card>
                    {!matches &&<Breadcrumb
                        items={[
                            {
                                title: "Home",
                            },
                            {
                                title: "Organizers",
                            },
                        ]}
                    />}
                    <div className="main-title-container">
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">Organizers</h5>
                            {matches && modulePermissionsData?.add &&
                                <Button
                                    key="confirm" type="primary"
                                    className="pi-btn-primary"
                                    onClick={() => toggle()}
                                >
                                    Add Organizer
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
                                Add Organizer
                            </Button>}
                            {/* <Excel page={'RegisteredEvents'} importdata={filterData?.length != 0 ? filterData : data} /> */}

                        </div>
                    </div>
                    <div className="main-content-card">
                        <div style={{ position: "sticky" }}>
                            {" "}
                            <AddOrganizer
                                open={AddOrganizerState}
                                toggle={toggle}
                                getItems={getOrganizers}
                                editdata={ediData}
                                edit={edit}
                                setEdit={setEdit}
                                setEditData={setEditData}
                            />
                        </div>
                        <Table columns={columns} data={filterData?.length > 0 ? filterData : data} />
                        <DeleteConfirmation
                            visible={deleteConfirmationVisible}
                            onConfirm={handleConfirmDelete}
                            onCancel={handleCancelDelete}
                            name="Organizer"
                        />
                    </div>
                </Card>
            </div>
        </Fragment>
    );
};
export default EventOrganizers;
