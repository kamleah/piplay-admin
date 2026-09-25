import { Breadcrumb, Button, Card } from 'antd';
import React, { Fragment, useEffect, useState } from 'react'
import Excel from '../../components/Helpers/Excel';
import Table from '../../components/Table/DataTable';
import { Icon } from '@iconify-icon/react';
import { deleteRoleById, deleteSkillLevelAPI, getAllRolesByUserId } from '../../components/apiFile/Service';
import ToastMessage from '../facilator/ToastMessage/ToastMessage';
import { toast } from "react-toastify";
import RoleDetails from '../../components/Modal/RoleDetails';
import DeleteConfirmation from '../../components/Modal/DeleteConfirmation';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllRoles } from '../../redux/Slices/DataSlice';

const ManageRoles = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {
  const [data, setData] = useState([])
  const [filterData, setfilterData] = useState([])
  const [showAddEditUser, setShowAddEditUser] = useState(false)
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [roleToDeleteId, setRoleToDeleteId] = useState<string | null>(null);
  const [showRegistrationViewModal, setShowRegistrationViewModal] = useState(false);
  const [rowdata, setRowdata] = useState({});
  const navigate = useNavigate();
  const userData = useSelector((state: any) => state?.user?.loggedUserDetails);
  const loggedInUser = localStorage.getItem("auth");
  const allRoles = useSelector((state: any) => state.alldata.allRoles)
  const dispatch = useDispatch();

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
      name: 'Role',
      selector: row => row?.rolename,
      sortable: true,
      wrap: true,

    },

    {
      name: "Permission",
      selector: row => 'Dashboard, Bookings, Facility Management, Events, Coupons, Settings ',
      wrap: true,
      sortable: true,
      cell: row => (
        <div>
          {
            row?.data?.map((module: any) => {
              if (module.view || module.add || module.edit || module.delete || module.export) {
                return <p>{module?.label},</p>
              }
            })
          }
        </div>
      ),
    },
    {
      name: "User Assigned",
      selector: row => row?.userCount,
      wrap: true,
      sortable: true,
    },


    {
      name: "Action",
      selector: row => row?.action,
      wrap: true,
      cell: row => (
        <div className='action-button-container'>
          {modulePermissionsData?.view &&
            <button className='action-button view-button' onClick={() => handleshowViewModal(row)}>
              <Icon icon="raphael:view" />
            </button>}
          {modulePermissionsData?.edit &&
            <button className='action-button edit-button' onClick={() => handleRoleEdit(row)}>
              <Icon icon="mdi:pencil-outline" title="Edit" />
            </button>}
          {modulePermissionsData?.delete &&
            <button onClick={() => { handleDeleteConfirmation(row.role_id) }} className='action-button delete-button'>
              <Icon icon="clarity:trash-solid" />
            </button>}
          {modulePermissionsData?.delete &&
            <button className='action-button delete-button'>
              <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} onClick={() => copyToClipboard(row)} />
            </button>}
        </div>
      ),
    },
  ];

  const handleRoleEdit = (row) => {
    navigate('/CreateRole', { state: row });
  }

  const handleshowViewModal = async (row: any) => {
    setRowdata(row);
    setShowRegistrationViewModal(true);
  };

  const handleDeleteConfirmation = (id: any) => {
    setRoleToDeleteId(id);
    setDeleteConfirmationVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (roleToDeleteId) {
      await DeleteFunction(roleToDeleteId);
      setDeleteConfirmationVisible(false);
      setShowRegistrationViewModal(false);
      setRoleToDeleteId("");
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationVisible(false);
    setShowRegistrationViewModal(false);
    setRoleToDeleteId("");
  };

  const DeleteFunction = async (id) => {
    let response = await deleteRoleById(loggedInUser, id)
    if (response.statusCode == 0 && response?.result == "success") {
      getAllRolesByUser();
      toast(<ToastMessage body={"Role Deleted Successfully"} type="success" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast(<ToastMessage body={`Role is assigned to user(s). Can't be deleted`} type="warning" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  const toggle = () => { setShowAddEditUser(!showAddEditUser) };

  const getAllRolesByUser = async () => {
    let response = await getAllRolesByUserId(loggedInUser, userData?._id);
    if (response.statusCode == 0) {
      dispatch(setAllRoles(response?.result))
    }
  }

  useEffect(() => {
    getAllRolesByUser();
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
                title: "Manage Roles",
              },
            ]}
          />}
          <div className="main-title-container">
            <div className="title-add-mobile">
              <h5 className="main-content-title">Manage Roles</h5>
              {matches && modulePermissionsData?.add &&
                <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => navigate("/CreateRole")}>Create Role</Button>
              }
            </div>
            <div className='title-buttons'>
              {!matches && modulePermissionsData?.add &&
                <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => navigate("/CreateRole")}>Create Role</Button>
              }
              {/* <Excel page={'RegisteredEvents'} importdata={data} /> */}
              {/* <Excel page={'RegisteredEvents'} importdata={filterData?.length != 0 ? filterData : data} /> */}
            </div>
          </div>
          <div className="main-content-card">
            <Table columns={columns} data={allRoles} />
          </div>
        </Card>
      </div>
      <RoleDetails
        visible={showRegistrationViewModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        name="Admin User Details"
        row={rowdata}
      />
      <DeleteConfirmation
        visible={deleteConfirmationVisible}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        name="Admin User"
      />
    </Fragment>
  )
}
export default ManageRoles;