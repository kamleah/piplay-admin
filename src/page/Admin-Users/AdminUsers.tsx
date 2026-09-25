import { Breadcrumb, Button, Card } from 'antd';
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import Excel from '../../components/Helpers/Excel';
import Table from '../../components/Table/DataTable';
import { Icon } from '@iconify-icon/react';
import moment from 'moment';
import { AdminUsersByFacilityAPI, deletenewAdminUsersAPI, deleteSkillLevelAPI, getAdminRolesAPI, getAllEventVenuesAPI, getAllOrganizersAPI, getAllRolesByUserId, getAllSkillLevelsAPI, getAllUsers, getEventVenuesUsersAPI, getFacilityApi, getFacilityByIdApi } from '../../components/apiFile/Service';
import { useForm } from 'react-hook-form';
import UserLabel from '../../components/Labels/UserLabel';
import SkillLabel from '../../components/Labels/SkillLabel';
import ToastMessage from '../facilator/ToastMessage/ToastMessage';
import { toast } from "react-toastify";
import { RegisteredUserFilterAPI } from '../../components/apiFile/Service';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import AddAdminUser from '../../components/Modal/AddAdminUser';
import DeleteConfirmation from '../../components/Modal/DeleteConfirmation';
import AdminUserDetails from '../../components/Modal/AdminUserDetails';
import { getAllAdminUsers } from '../../components/apiFile/Service';
import { AdminUserFilterAPI } from '../../components/apiFile/Service';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAdminUsers } from '../../components/apiFile/Service';
import FilterData from '../../components/Modal/FilterData';
import { setAllRoles } from '../../redux/Slices/DataSlice';

const AdminUsers = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {
  const roles = useSelector((state: any) => state.alldata.allRoles)

  const [data, setData] = useState([])
  const { register, handleSubmit, reset, watch, setValue } = useForm()

  const [showAddEditUser, setShowAddEditUser] = useState(false)
  const [edit, setEdit] = useState(false)
  const [ediData, setEditData] = useState({})
  const [venue, setVenue] = useState([])
  const [organizers, setOrganizers] = useState([])
  const [facilities, setFacilities] = useState([])
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [adminToDeleteId, setAdminToDeleteId] = useState<string | null>(null);
  const [showRegistrationViewModal, setShowRegistrationViewModal] = useState(false);
  const [showRegisteredEditModal, setShowRegisteredEditModal] = useState(false);

  const [rowdata, setRowdata] = useState({});

  const dispatch = useDispatch()

  const getSkillLevels = async () => {
    let response = await getAllSkillLevelsAPI(loggedInUser);
    console.log(response)
    setData(response?.result)
  }

  var fullname = watch('fullname')
  var email = watch('email')
  var mobileno = watch('mobileno')
  var roleId = watch('roleId')

  const loggedInUser = localStorage.getItem("auth");
  const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)

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

  console.log("data=====", data);


  const columns = [
    {
      name: 'Name',
      sortable: true,
      wrap: true,
      cell: row =>
        <div className='playerContainer'>
          {`${row?.firstname} ${row?.lastname}`}
        </div>
    },

    {
      name: "Role",
      selector: row => !row?.roleId ? 'Super Admin' : row?.adminrole?.name,
      wrap: true,
      sortable: true,
    },
    {
      name: "Facility",
      selector: row => row?.facility?.name || 'N/A',
      wrap: true,
      sortable: true,
    },
    {
      name: "Email ID",
      selector: row => row?.email || 'N/A',
      wrap: true,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: row => row?.mobileno || 'N/A',
      wrap: true,
      sortable: true,
    },
    {
      name: "Location",
      selector: row => row?.facility?.address || row?.location|| 'N/A',
      wrap: true,
      sortable: true,
    },
    {
      name: "Gender",
      selector: row => row?.gender,
      wrap: true,
      sortable: true,
    },
    {
      name: "DOB",
      selector: row => row?.age_group || 'N/A',
      wrap: true,
      sortable: true,

    },
    {
      name: "Created At",
      selector: row => moment(row?.createdAt).format("DD-MM-YYYY"),
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
            <button className='action-button view-button' onClick={() => handleshowRegistrationModal(row, 'view')}>
              {/* onClick={() => handleshowRegistrationModal(row, 'view')} */}
              <Icon icon="raphael:view" />
            </button>}
          {modulePermissionsData?.edit &&
            <button className='action-button edit-button' onClick={() => handleshowRegistrationModal(row, 'edit')} disabled={loggedUserDetails?._id == row?._id}>
              <Icon icon="mdi:pencil-outline" title="Edit" />
            </button>}
          {modulePermissionsData?.delete &&
            <button onClick={() => { handleDeleteConfirmation(row._id) }} className='action-button delete-button' disabled={loggedUserDetails?._id == row?._id}>
              <Icon icon="clarity:trash-solid" />
            </button>}
          {modulePermissionsData?.delete &&
            <button className='action-button delete-button' disabled={loggedUserDetails?._id == row?._id}>
              <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} onClick={() => copyToClipboard(row)} />
            </button>}
        </div>
      ),
    },
  ];


  const handleshowRegistrationModal = async (row: any, type: any) => {
    setRowdata(row);
    if (type == 'view') {
      setShowRegistrationViewModal(true);
    } else if (type == 'edit') {
      setShowAddEditUser(true)
    } else if (type == 'add') {
      setRowdata({});
      setShowRegistrationViewModal(false);
      setShowAddEditUser(true)
    }
  };

  const handleDeleteConfirmation = (id) => {
    setAdminToDeleteId(id);
    setDeleteConfirmationVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (adminToDeleteId) {
      await DeleteFunction(adminToDeleteId);
      setDeleteConfirmationVisible(false);
      setShowAddEditUser(false);
      setAdminToDeleteId("");
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationVisible(false);
    setShowRegistrationViewModal(false);
    setShowAddEditUser(false);

    setAdminToDeleteId("");
  };

  const DeleteFunction = async (id) => {
    let response = await deletenewAdminUsersAPI(loggedInUser, id)
    if (response.code == 'SUCCESS') {
      toast(<ToastMessage body={"User Deleted Successfully"} type="success" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      getAdminUsers();
    } else {
      toast(<ToastMessage body={"Failed To Delete the User"} type="error" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }
  const getAdminUsers = async () => {
    let response
    if (!loggedUserDetails?.roleId) {
      response = await getAllAdminUsers(loggedInUser);
      console.log("get admin user : ", response);

    } else {
      response = await AdminUsersByFacilityAPI(loggedInUser, loggedUserDetails?.facility_id);
      response.data = response.data.filter(item => item.facility_id != null)
    }
    setData(response?.data)
  };


  const getVenues = async () => {
    let response
    if (!loggedUserDetails?.roleId) {
      response = await getAllEventVenuesAPI(loggedInUser);
    } else {
      response = await getEventVenuesUsersAPI(loggedInUser, loggedUserDetails._id);
    }
    setVenue(response?.result?.map((item) => ({
      "label": `${item.name} ${item.location_city}`, "value": item._id
    })));
  }

  const getOrganizers = async () => {
    let response = await getAllOrganizersAPI(loggedInUser);
    if(!loggedUserDetails?.roleId){
      setOrganizers(response?.result?.map((item) => ({
        "label": item.name, "value": item._id
      })));     
    }else{
        const filterdata = response?.result?.filter(item=> item?._id == loggedUserDetails?.organizerId)                      
        setOrganizers(filterdata?.map((item) => ({
          "label": item.name, "value": item._id
        })));
    }
}

  const getAllfacility = async () => {
    let response = await getFacilityApi(loggedInUser);
    if (!loggedUserDetails?.roleId) {
         let venues = response?.result?.map(data => {
              return { "label": data?.name + ', ' + data.address, "value": data?._id, "slot_size": data?.slot_size, 'sport_type': data?.sport_type }
         });
         setFacilities(response?.result);
    } else {
         const filteredFacilities = response?.result.filter(item => loggedUserDetails?.facilities.includes(item._id));
         let venues = filteredFacilities?.map(data => {
              return { "label": data?.name + ', ' + data.address, "value": data?._id, "slot_size": data?.slot_size, 'sport_type': data?.sport_type }
         });
         setFacilities(filteredFacilities);
    }
};

  const Search = async (search) => {
    if (search == false) {
      setData([]);
      toast(<ToastMessage body={"Filters Cleared"} type="success" />, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

    }
    let response
    if (!loggedUserDetails?.roleId) {
      response = await AdminUserFilterAPI(loggedInUser,
        fullname == undefined ? '' : fullname,
        email == undefined ? "" : email,
        mobileno == undefined ? '' : mobileno,
        roleId == undefined ? '' : roleId,
        ""
      );
    } else {
      response = await AdminUserFilterAPI(loggedInUser,
        fullname == undefined ? '' : fullname,
        email == undefined ? "" : email,
        mobileno == undefined ? '' : mobileno,
        roleId == undefined ? '' : roleId,
        loggedUserDetails.facility_id
      );
    }
    console.log(response, "filterapiforuser")
    if (response?.message.split(' ')[0] != 0) {
      setData(response?.data)
    } else {
      setData([]);
      if (search == true) {
        toast(<ToastMessage body={"No Data Found"} type="error" />, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  const getAllRolesByUser = async () => {
    let response = await getAllRolesByUserId(loggedInUser, loggedUserDetails._id);
    if (response.statusCode == 0) {
      dispatch(setAllRoles(response?.result))
    }
  }

  useEffect(() => {
    getAdminUsers();
    getAllRolesByUser();
    getVenues();
    getAllfacility();
    getOrganizers();
  }, [])
  useMemo(() => {
    console.log('sdfsdf')
  }, [roles])

  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const FilterSection = () => {
    return (
      <>
        <form>
          <div className="filter-form">
            <div className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"}`}>
              <div className="input-group">
                <label htmlFor="user" className="form-lable">Full Name</label>
                <div className="form-group">
                  <input
                    className="form-field"
                    type="text"
                    id="eventName"
                    placeholder="Enter User First Name"
                    {...register('fullname')}
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="user" className="form-lable">Email ID</label>
                <div className="form-group">
                  <input
                    className="form-field"
                    type="text"
                    id="eventName"
                    placeholder="Enter email"
                    {...register('email')}
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="user" className="form-lable">Phone Number</label>
                <div className="form-group">
                  <input
                    className="form-field"
                    type="text"
                    id="eventName"
                    placeholder="Enter Phone Number"
                    {...register('mobileno')}
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="event" className="form-lable">Role</label>
                <div className="form-group">
                  <select id="facility" className="form-field" {...register('roleId', {
                    required: {
                      value: true,
                      message: "Role is required",
                    }
                  })}>
                    <option value="" selected disabled>Select Role</option>
                    {roles?.map((roles: any) =>
                      <option key={roles.role_id} value={`${roles.role_id}`}>{roles.rolename}</option>
                    )}
                  </select>
                </div>
              </div>

            </div>
            {!matches && <div className="filter-buttons-row">
              <Button className="pi-btn-primary" key="confirm" type="primary"
                onClick={() => {
                  Search(true)
                  handleOpenChange(false);

                }}
              >Apply</Button>
              <Button className="pi-btn-secondary" key="cancel"
                onClick={() => {
                  reset({
                    fullname: '',
                    email: '',
                    mobileno: '',
                    roleId: '',
                  });
                  getAdminUsers();
                  handleOpenChange(false);

                }}
              > Clear</Button>
            </div>}
          </div>
          {matches && <div className="filter-buttons-row">
            <Button className="pi-btn-primary" key="confirm" type="primary"
              onClick={() => {
                Search(true)
                handleOpenChange(false);

              }}
            >Apply</Button>
            <Button className="pi-btn-secondary" key="cancel"
              onClick={() => {
                reset({
                  fullname: '',
                  email: '',
                  mobileno: '',
                  roleId: '',
                });
                getAdminUsers();
                handleOpenChange(false);

              }}
            > Clear</Button>
          </div>}
        </form>
      </>
    )
  }

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
                title: "Admin Users",
              },
            ]}
          />}
          <div className="main-title-container">
            <div className="title-add-mobile">
              <h5 className="main-content-title">Admin Users</h5>
              {matches && modulePermissionsData?.add &&
                <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => handleshowRegistrationModal({}, 'add')}>Add Admin User</Button>
              }
            </div>
            <div className='title-buttons'>
              <div></div>
              <div className="add-export-btn">
                {!matches && modulePermissionsData?.add &&
                  <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => handleshowRegistrationModal({}, 'add')}>Add Admin User</Button>
                }{/* <Excel page={'RegisteredEvents'} importdata={data} /> */}
                {modulePermissionsData?.export &&
                  <Excel page={'AdminUsers'} importdata={data} />
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
                    <label htmlFor="user" className="form-lable">Full Name</label>
                    <div className="form-group">
                      <input
                        className="form-field"
                        type="text"
                        id="eventName"
                        placeholder="Enter User First Name"
                        {...register('fullname')}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="user" className="form-lable">Email ID</label>
                    <div className="form-group">
                      <input
                        className="form-field"
                        type="text"
                        id="eventName"
                        placeholder="Enter email"
                        {...register('email')}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="user" className="form-lable">Phone Number</label>
                    <div className="form-group">
                      <input
                        className="form-field"
                        type="text"
                        id="eventName"
                        placeholder="Enter Phone Number"
                        {...register('mobileno')}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="event" className="form-lable">Role</label>
                    <div className="form-group">
                      <select id="facility" className="form-field" {...register('roleId', {
                        required: {
                          value: true,
                          message: "Role is required",
                        }
                      })}>
                        <option>Select Role</option>
                        <option key="super-admin" value="super-admin" >Super Admin</option>
                        {roles.map((role) => (
                          role.role_id && role.rolename ? (
                            <option key={role.role_id} value={`${role.role_id}`}>
                              {role.rolename}
                            </option>
                          ) : null
                        ))}
                      </select>
                    </div>
                  </div>

                </div>
                {!matches && <div className="filter-buttons-row">
                  <Button className="pi-btn-primary" key="confirm" type="primary"
                    onClick={() => {
                      Search(true)
                      handleOpenChange(false);

                    }}
                  >Apply</Button>
                  <Button className="pi-btn-secondary" key="cancel"
                    onClick={() => {
                      reset({
                        fullname: '',
                        email: '',
                        mobileno: '',
                        roleId: '',
                      });
                      getAdminUsers();
                      handleOpenChange(false);

                    }}
                  > Clear</Button>
                </div>}
              </div>
            }

            <Table columns={columns} data={data} />
          </div>
        </Card>
      </div>
      <AddAdminUser
        visible={showAddEditUser}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        getAdminUsers={getAdminUsers}
        roles={roles}
        name="edit"
        row={rowdata}
        venue={venue}
        facilities={facilities}
        organizers={organizers}
      />
      <AdminUserDetails
        visible={showRegistrationViewModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        name="Admin User Details"
        row={rowdata}
        venue={venue}
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
export default AdminUsers;