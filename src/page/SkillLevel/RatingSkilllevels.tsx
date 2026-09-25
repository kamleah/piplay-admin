import { Breadcrumb, Button, Card, Radio, RadioChangeEvent } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import Table from '../../components/Table/DataTable';
import moment from 'moment';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { Icon } from '@iconify-icon/react';
import SkillLabel from '../../components/Labels/SkillLabel';
import AddUserSkillLevel from '../../components/Modal/AddUserSkillLevel';
import { deleteRatingSkillLevelAPI, filterRatingSkillLevelAPI, getAllRatingSkillLevelsAPI } from '../../components/apiFile/Service';
import { useSelector } from 'react-redux';
import DeleteConfirmation from '../../components/Modal/DeleteConfirmation';
import { toast } from 'react-toastify';
import ToastMessage from '../facilator/ToastMessage/ToastMessage';
import UserSkillLevelDetails from '../../components/Modal/UserSkillLevelDetails';
import SkillLabelV2 from '../../components/Labels/SkillLabelV2';

export default function RatingSkilllevels({ matches, menuOpen, onToggle, modulePermissionsData }) {
  const { register, watch, setValue, reset, control } = useForm();
  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState<string | null>(null);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [rowdata, setRowdata] = useState({});
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState([])
  const loggedInUser = localStorage.getItem("auth");
  const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)

  let sport_type = watch("sport_type");
  let facility_id = watch("facility_id");
  const options = [
    { label: 'All', value: 'all' },
    { label: 'Padel', value: 'padel' },
    { label: 'Pickleball', value: 'pickleball', },
  ];
  const handleCancel = () => {
    setShowFormModal(false);
    setShowViewModal(false);
    setEdit(false);
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
    let response = await deleteRatingSkillLevelAPI(loggedInUser, id);
    if (response.statusCode == 0) {
      toast(<ToastMessage body={'User Skill Level Deleted Successfully'} type="success" />, {
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
      toast(<ToastMessage body={'Error while deleting User Skill Level'} type="warning" />, {
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
  const moduleName = "User Skills Levels"

  const getAllData = async () => {
    let response
    if (!loggedUserDetails?.roleId) {
      response = await getAllRatingSkillLevelsAPI(loggedInUser);
    }
    // else {
    //     response = await filterPackagesAPI(loggedInUser, loggedUserDetails?.facility_id, '', '', '');
    // }
    setData(response?.result);
  }

  const filterData = async (search, value) => {
    let sport = ''
    if (value == '') {
      sport = sport_type
    } else {
      sport = value
    }
    let response = await filterRatingSkillLevelAPI(loggedInUser,
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
      name: 'Ratings',
      selector: row => parseFloat(row?.rating).toFixed(1),
      sortable: true,
      wrap: true,
    },
    {
      name: 'Description',
      selector: row => row?.description,
      sortable: true,
      wrap: true,
    },

    {
      name: 'Skill Level',
      selector: row => row?.skill_level?.label,
      wrap: true,
      sortable: true,
      cell: row =>
        <div className='playerContainer'>
          <SkillLabelV2 skilldata={row.skill_level} />
        </div>,
    },
    {
      name: 'Sport Type',
      selector: row => row?.sport_type,
      sortable: true,
      wrap: true,
      cell: row => (<h4 className='capi'>{row?.sport_type}</h4>)
    },
    {
      name: 'Actions',
      sortable: true,
      wrap: true,
      cell: row =>
      (<div className='action-button-container'>
        <button className='action-button view-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'view') }} ><Icon icon="raphael:view" /></button>
        <button className='action-button edit-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'edit') }}><Icon icon="mdi:pencil-outline" /></button>
        <button className='action-button delete-button' onClick={(e) => { e.preventDefault(); handleDeleteModal(row._id) }} >
          <RiDeleteBin5Fill title="Delete" />
        </button>
        <button className='action-button delete-button' onClick={(e) => { e.preventDefault(); copyToClipboard(row) }} >
          <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} />
        </button>
      </div >)
      ,
    },

  ];

  const getSkillLevels = async () => {
    let response = await getAllRatingSkillLevelsAPI(loggedInUser);
    setData(response?.result);
  }

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
                title: "Setting",
              },
              {
                title: "Youtube",
              }
            ]}
          />}
          <div className="main-title-container">
            <div className="title-add-mobile">
              <h5 className="main-content-title">{moduleName}</h5>
              {matches && modulePermissionsData?.add &&
                <Button
                  style={{ display: 'flex', alignItems: 'center' }}
                  className="pi-btn-primary"
                  key="confirm" type="primary"
                  onClick={() => { setEdit(false); setShowFormModal(true) }}
                >
                  <Icon icon='material-symbols-light:add' height='20' width='20' />
                  {'Add'}
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
                    Add
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
            <Table
              columns={columns}
              data={data}
            />
          </div>
        </Card >
        <AddUserSkillLevel
          visible={showFormModal}
          onCancel={handleCancel}
          row={rowdata}
          edit={edit}
          getAllData={getAllData}
          setEdit={setEdit}
        />
        <UserSkillLevelDetails
          visible={showViewModal}
          onCancel={handleCancel}
          name="USer Skill Levels details"
          row={rowdata}
        />
        <DeleteConfirmation
          visible={deleteConfirmationVisible}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          name="Package"
        />
      </div >
    </Fragment>
  )
}
