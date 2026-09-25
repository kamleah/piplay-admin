import React, { Fragment, useEffect, useState } from 'react'
import { Breadcrumb, Button, Card, Radio, RadioChangeEvent } from 'antd'
import { Controller, useForm } from 'react-hook-form';
import Select from "react-select"
import makeAnimated from "react-select/animated"
import DeleteConfirmation from '../../components/Modal/DeleteConfirmation';
import Table from '../../components/Table/DataTable';
import moment from 'moment';
import StatusLabel from '../../components/Labels/StatusLabel';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { Icon } from '@iconify-icon/react';
import { useSelector } from 'react-redux';
import { deleteUserMemberShipAPI, filterPackagesAPI, filterUserMembershipAPI, getFacilityApi, getFacilityByIdApi, getMembershipAPI, getUserMemberShipAPI } from '../../components/apiFile/Service';
import CreateUserMembership from '../../components/Modal/CreateUserMemberShip';
import { toast } from 'react-toastify';
import ToastMessage from '../facilator/ToastMessage/ToastMessage';
import UserMembershipDetails from '../../components/Modal/UserMembershipDetails';

export default function UserMembershipList({ matches, menuOpen, onToggle, modulePermissionsData }) {
  const { register, watch, setValue, reset, control } = useForm()
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState([]);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);
  const [rowdata, setRowdata] = useState({});
  const [deleteRowId, setDeleteRowId] = useState<string | null>(null);
  const [facilityList, setFacilityList] = useState([]);
  const [open, setOpen] = useState(false);
  const [membership, setMembership] = useState([]);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
  const loggedInUser = localStorage.getItem("auth");
  let facility_id = watch("facility_id");
  let status = watch("status");
  let name = watch("name");
  const moduleName = "MemberShip List"
  const animatedComponents = makeAnimated();
  let sport_type = watch("sport_type");
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
    let response = await filterUserMembershipAPI(loggedInUser,
      loggedUserDetails?.roleId ? facility_id?.value ||   '' : facility_id?.value,
      name == undefined ? '' : name,
      status?.value == undefined ? '' : status?.value,
      sport == undefined || sport == 'all' ? '' : sport
    );
    if (response?.data.length > 0) {
      setData(response?.data);
    } else {
      setData([]);
    }
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

  const handleConfirmDelete = async () => {
    if (deleteRowId) {
      await DeleteFunction(deleteRowId);
      setDeleteConfirmationVisible(false);
      setDeleteRowId("");
    }
  };
  const DeleteFunction = async (id) => {
    // Actual delete logic here
    let response = await deleteUserMemberShipAPI(loggedInUser, id);
    if (response.code == 'SUCCESS') {
      toast(<ToastMessage body={'User Membership Deleted Successfully'} type="success" />, {
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
      toast(<ToastMessage body={'Error while deleting User Membership'} type="warning" />, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
  const handleCancelDelete = () => {
    setDeleteConfirmationVisible(false);
    setDeleteRowId("");
  };
  const onSportsChange = ({ target: { value } }: RadioChangeEvent) => {
    setValue('sport_type', value);
    filterData(true, value)
  };
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
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

  const handleDeleteModal = (id) => {
    setDeleteRowId(id);
    setDeleteConfirmationVisible(true);
  };

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
      name: 'Player Name',
      // selector: row => console.log('row--------', row),
      selector: row => `${row?.user_id?.firstname} ${row?.user_id?.lastname}`,
      sortable: true,
      wrap: true,
    },
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
      selector: row => row?.membership_id?.name,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Duration',
      sortable: true,
      wrap: true,
      cell: row => (<h4 className='capi'>{row?.membership_id?.duration}</h4>)
    },
    {
      name: 'Sport Type',
      sortable: true,
      wrap: true,
      cell: row => (<h4 className='capi'>{row?.membership_id?.sport_type}</h4>)
    },
    {
      name: 'Days Remaining to Expire',
      selector: row => calculateDaysRemaining(row?.membership_expiry_date),
      sortable: true,
      wrap: true,
    },
    {
      name: 'Expiry Date',
      selector: row => moment(row?.membership_expiry_date).format('DD-MM-YYYY'),
      sortable: true,
      wrap: true,
    },
    {
      name: 'Status',
      sortable: true,
      wrap: true,
      cell: row =>
        <div className='playerContainer max-width-container'>

          <StatusLabel status={capitalizeFirstLetter(row?.membership_id?.status)} />
        </div>
    },
    {
      name: 'Actions',
      sortable: true,
      wrap: true,
      cell: row =>
      (<div className='action-button-container'>
        <button className='action-button view-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'view') }}><Icon icon="raphael:view" /></button>
        <button className='action-button edit-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'edit') }}><Icon icon="mdi:pencil-outline" /></button>
        <button className='action-button delete-button' onClick={(e) => { e.preventDefault(); handleDeleteModal(row._id) }}>
          <RiDeleteBin5Fill title="Delete" />
        </button>
        <button className='action-button delete-button' onClick={() => copyToClipboard(row)}>
          <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} />
        </button>
      </div >)
      ,
    },

  ];

  const getMembership = async () => {
    let response
    if (!loggedUserDetails?.roleId) {
      response = await getMembershipAPI(loggedInUser);
    } else {
      response = await filterPackagesAPI(loggedInUser, loggedUserDetails?.facility_id, '', '', '');
    }
    let venues = response?.result?.map(data => {
      return { "label": data?.name, "value": data?._id, 'data': data }
    })
    setMembership(venues);
  }

  const getmembershipData = async () => {
    let response
    if (!loggedUserDetails?.roleId) {
      response = await getUserMemberShipAPI(loggedInUser);
    }
    else {
      response = await filterPackagesAPI(loggedInUser, loggedUserDetails?.facility_id, '', '', '');
    }
    setData(response?.data);
  }

  useEffect(() => {
    getmembershipData()
    getMembership()
    getAllFacility();
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
                  {'Buy Membership'}
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
                    style={{ display: 'flex', alignItems: 'center' }}
                    className="pi-btn-primary"
                    key="confirm" type="primary"
                    onClick={() => { setEdit(false); setShowFormModal(true) }}
                  >
                    <Icon icon='material-symbols-light:add' height='20' width='20' />
                    Buy Membership
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
        <CreateUserMembership
          visible={showFormModal}
          onCancel={handleCancel}
          row={rowdata}
          edit={edit}
          membership={membership}
          facilityList={facilityList}
          getAllData={getmembershipData}
          setEdit={setEdit}
        />
        <UserMembershipDetails
          visible={showViewModal}
          onCancel={handleCancel}
          name="User Membership details"
          row={rowdata}
        />
        <DeleteConfirmation
          visible={deleteConfirmationVisible}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          name="User Membership List"
        />
      </div >
    </Fragment>
  )
}
