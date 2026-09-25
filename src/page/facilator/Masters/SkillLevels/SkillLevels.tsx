import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Card, Breadcrumb, Button } from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import ToastMessage from "../../ToastMessage/ToastMessage";
import { toast } from "react-toastify";
import moment from "moment";
import _ from "lodash";
import { deleteSkillLevelAPI, getAllSkillLevelsAPI } from "../../../../components/apiFile/Service";
import AddSkillLevel from "../../../../components/Modal/AddSkillLevel";
import DeleteConfirmation from "../../../../components/Modal/DeleteConfirmation";

import { Icon } from "@iconify-icon/react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Table from "../../../../components/Table/DataTable";
import SkillLabel from "../../../../components/Labels/SkillLabel";
import Excel from "../../../../components/Helpers/Excel";
import SkillLabelV2 from "../../../../components/Labels/SkillLabelV2";


const SkillLevels = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {

    const [data, setData] = useState([])
    const [AddSkillLevelState, setAddSkillLevelState] = useState(false)
    const [edit, setEdit] = useState(false)
    const [ediData, setEditData] = useState({})
    const [filterData, setfilterData] = useState([])
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [couponToDeleteId, setCouponToDeleteId] = useState<string | null>(null);

    const loggedInUser = localStorage.getItem("auth");

    const toggle = () => { setAddSkillLevelState(!AddSkillLevelState) };

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
            name: 'Skill Level Name',
            selector: row => row?.value ? row?.label : "",
            wrap: true,
            sortable: true,
        },
        {
            name: 'Skill Level Value',
            selector: row => row?.value,
            wrap: true,
            sortable: true,
        },
        {
            name: 'Skill Label',
            selector: row => row?.value,
            wrap: true,
            sortable: true,
            cell: row =>
                <div className='playerContainer'>
                    {row?.color ?
                        <SkillLabelV2 skilldata={row} /> :
                        <SkillLabel skill={row?.label} />
                    }
                </div>,
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
                        <button className='action-button edit-button' onClick={() => { setEdit(true); setEditData(row); toggle(); }}>
                            <Icon icon="mdi:pencil-outline" />
                        </button>
                    }
                    &nbsp;&nbsp;{" "}
                    {modulePermissionsData?.delete &&
                        <button onClick={() => { handleDeleteConfirmation(row._id) }} className='action-button delete-button'>
                            <RiDeleteBin5Fill title="Delete" />
                        </button>
                    }
                     &nbsp;&nbsp;{" "}
                    {modulePermissionsData?.delete &&
                        <button className='action-button delete-button'>
                            <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} onClick={()=> copyToClipboard(row)}/>
                        </button>
                    }
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
        let response = await deleteSkillLevelAPI(loggedInUser, id)
        if (response.statusCode == 0) {
            toast(<ToastMessage body={"Skill Level Deleted Successfully"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            getSkillLevels();
        } else {
            toast(<ToastMessage body={"Failed To Delete the Skill Level"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    const getSkillLevels = async () => {
        let response = await getAllSkillLevelsAPI(loggedInUser);
        console.log(response)
        setData(response?.result)
    }

    useMemo(() => {
    }, [AddSkillLevelState, edit])

    useEffect(() => {
        getSkillLevels();
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
                                title: "Skill Levels",
                            },
                        ]}
                    />}
                    <div className="main-title-container">
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">Skill Levels</h5>
                            {matches && modulePermissionsData?.add &&
                                <Button
                                    key="confirm" type="primary"
                                    className="pi-btn-primary"
                                    onClick={() => toggle()}
                                >
                                    Add Skill Level
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
                                    Add Skill Level
                                </Button>
                            }
                            {/* <Excel page={'RegisteredEvents'} importdata={filterData?.length != 0 ? filterData : data} /> */}
                        </div>

                    </div>
                    <div className="main-content-card">
                        <div style={{ position: "sticky" }}>
                            {" "}
                            <AddSkillLevel
                                open={AddSkillLevelState}
                                toggle={toggle}
                                getItems={getSkillLevels}
                                editdata={ediData}
                                edit={edit}
                                setEdit={setEdit}
                                setEditData={setEditData}
                            />
                        </div>
                        <Table
                            columns={columns}
                            data={filterData?.length > 0 ? filterData : data} />
                        <DeleteConfirmation
                            visible={deleteConfirmationVisible}
                            onConfirm={handleConfirmDelete}
                            onCancel={handleCancelDelete}
                            name="Delete Skill Level"
                        />
                    </div>
                </Card>
            </div>
        </Fragment>
    );
};
export default SkillLevels;
