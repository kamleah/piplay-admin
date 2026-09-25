import { Breadcrumb, Button, Card } from 'antd';
import React, { Fragment, useEffect, useState } from 'react'
import Excel from '../../components/Helpers/Excel';
import Table from '../../components/Table/DataTable';
import { Icon } from '@iconify-icon/react';
import ToastMessage from '../facilator/ToastMessage/ToastMessage';
import { toast } from "react-toastify";
import { deleteOffers, getOffers } from '../../components/apiFile/Service';
import DeleteConfirmation from '../../components/Modal/DeleteConfirmation';
import AddOffers from '../../components/Modal/AddOffers';
import OffersDetails from '../../components/Modal/OffersDetails';
import { OffersFilterAPI } from '../../components/apiFile/Service';
import { useForm } from 'react-hook-form';
import StatusLabel from '../../components/Labels/StatusLabel';
import moment from 'moment';
import FilterData from '../../components/Modal/FilterData';

const Offers = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {
  const [data, setData] = useState([])
  const [edit, setEdit] = useState(false)
  const [editData, setEditData] = useState({})
  const [showOffersViewModal, setShowOffersViewModal] = useState(false);
  const [showOffersEditModal, setShowOffersEditModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [rowdata, setRowdata] = useState({});
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);
  const loggedInUser = localStorage.getItem("auth");
  const { register, handleSubmit, reset, watch, setValue } = useForm()

  var brand = watch('brand')
  var type = watch('type')
  var status = watch('status')
  var title = watch('title')

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
      name: 'Image',
      selector: row => row?.image,
      wrap: true,
      sortable: true,
      cell: row => (<img src={row?.image} className='table-md-img' />)
    },
    {
      name: "Brand",
      selector: row => row?.brand,
      wrap: true,
      sortable: true,
    },
    {
      name: "Promotion Title",
      selector: row => row?.title,
      wrap: true,
      sortable: true,
    },
    {
      name: "Promotion Type",
      selector: row => row?.type,
      wrap: true,
      sortable: true,
    },
    {
      name: "Percentage",
      selector: row => row?.offer,
      wrap: true,
      sortable: true,
    },
    {
      name: "Start Date Time",
      selector: row => moment(row?.start).format('ddd, D MMM h:mm A'),
      wrap: true,
      sortable: true,
    },
    {
      name: "End Date Time",
      selector: row => moment(row?.end).format('ddd, D MMM h:mm A'),
      wrap: true,
      sortable: true,
    },
    {
      name: "Status",
      selector: row => row?.end,
      wrap: true,
      sortable: true,
      cell: row =>
        <div className='playerContainer max-width-container'>
          <StatusLabel
            status={row.status == 'inactive'
              ? moment(row.end).isAfter(moment()) ? "Paused" : "Inactive" :
              moment(row.start).isAfter(moment()) ? "Scheduled" : "Active"
            }
          />
        </div>
      ,
    },
    {
      name: "Action",
      selector: row => row?.action,
      wrap: true,
      cell: row => (
        <div className='action-button-container'>
          {modulePermissionsData?.view &&
            <button className='action-button view-button' onClick={() =>
              handleshowRegisteredModal
                (row, 'view')}>
              {/* onClick={() => handleshowRegistrationModal(row, 'view')} */}
              <Icon icon="raphael:view" />
            </button>}
          {modulePermissionsData?.edit &&
            <button className='action-button edit-button' onClick={() => {
              setEdit(true); setVisible(true); setEditData(row); handleshowRegisteredModal
                (row, 'edit')
            }}
            // disabled={loggedUserDetails?._id == row?._id}
            >
              <Icon icon="mdi:pencil-outline" title="Edit" />
            </button>}
          {modulePermissionsData?.delete &&
            <button onClick={() => {
              handleDeleteConfirmation(row._id)
            }} className='action-button delete-button'
            // disabled={loggedUserDetails?._id == row?._id}
            >
              <Icon icon="clarity:trash-solid" />
            </button>}
            {modulePermissionsData?.delete &&
            <button className='action-button delete-button'            
            >
              <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} onClick={() => copyToClipboard(row)} />
            </button>}
        </div>
      ),
    },
  ];
  const getOffer = async () => {
    let response = await getOffers(loggedInUser)
    setData(response?.data)
  }
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
    let response = await OffersFilterAPI(loggedInUser,
      brand == undefined ? "" : brand,
      type == undefined ? "" : type,
      title == undefined ? "" : title,
      status == undefined || status == "" ? "" : status == 'paused' || status == 'inactive' ? "inactive" : 'active',
    );
    if (response?.message.split(' ')[0] != 0) {
      if (status == 'scheduled') {
        setData(response?.data.map(ele => {
          if (moment(ele.start).isAfter(moment())) return ele
          else {
            return undefined //return nothing delete data if comes in else
          }
        }).filter(ele => ele !== null && ele !== undefined))
        return
      } else if (status == 'active') {
        setData(response?.data.map(ele => {
          if (moment(ele.start).isBefore(moment())) return ele
          else {
            return undefined //return nothing delete data if comes in else
          }
        }).filter(ele => ele !== null && ele !== undefined))
        return
      } else if (status == 'inactive') {
        setData(response?.data.map(ele => {
          if (moment(ele.end).isBefore(moment())) return ele
          else {
            return undefined //return nothing delete data if comes in else
          }
        }).filter(ele => ele !== null && ele !== undefined))
        return
      } else if (status == 'paused') {
        setData(response?.data.map(ele => {
          if (moment(ele.end).isAfter(moment())) return ele
          else {
            return undefined //return nothing delete data if comes in else
          }
        }).filter(ele => ele !== null && ele !== undefined))
        return
      }
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
  const handleshowRegisteredModal = async (row: any, type: any) => {
    setRowdata(row);
    if (type == 'view') {
      setShowOffersViewModal(true);
    } else if (type == 'edit') {
      setShowOffersEditModal(true);
    } else if (type == 'add') {
      setRowdata({});
      setShowOffersViewModal(false);
      setShowOffersEditModal(true);

    }
  };
  const handleDeleteConfirmation = (id) => {
    setUserToDeleteId(id);
    setDeleteConfirmationVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDeleteId) {
      await DeleteFunction(userToDeleteId);
      setDeleteConfirmationVisible(false);
      setShowOffersEditModal(false);
      setUserToDeleteId("");
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationVisible(false);
    setShowOffersViewModal(false);
    setShowOffersEditModal(false);

    setUserToDeleteId("");
  };

  const DeleteFunction = async (id) => {
    let response = await deleteOffers(loggedInUser, id)
    if (response.code == 'SUCCESS') {
      toast(<ToastMessage body={"Promotion Deleted Successfully"} type="success" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      getOffer();
    } else {
      toast(<ToastMessage body={"Failed To Delete the Promotion"} type="warning" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }
  useEffect(() => {
    getOffer();
  }, [])

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
                <label htmlFor="user" className="form-lable"> Brand</label>
                <div className="form-group">
                  <input
                    className="form-field"
                    type="text"
                    id="eventName"
                    placeholder="Enter Brand  "
                    {...register('brand')}
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="user" className="form-lable"> Title</label>
                <div className="form-group">
                  <input
                    className="form-field"
                    type="text"
                    id="eventName"
                    placeholder="Enter Brand  "
                    {...register('title')}
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="user" className="form-lable">Promotion Type</label>
                <div className="form-group">
                  <select
                  className="form-field"
                    id="location"
                    {...register("type")}
                  >
                    <option value="">Type</option>
                    <option value="entertainments">Entertainments</option>
                    <option value="dinings">Dinings</option>
                    <option value="sports">Sports</option>
                  </select>

                </div>
              </div>
              <div className="input-group">
                <label htmlFor="event" className="form-lable">Status</label>
                <div className="form-group">
                  <select
                    id="location"
                    className="form-field"

                    // onChange={(e) => { TypeFilter(e.target.value) }}
                    {...register('status')}
                  >
                    <option value="" selected disabled>Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="paused">Paused</option>
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
                    brand: '',
                    type: '',
                    title: '',
                    status: '',

                  });
                  getOffer();
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
                  brand: '',
                  type: '',
                  title: '',
                  status: '',

                });
                getOffer();
                handleOpenChange(false);

              }}
            > Clear</Button>
          </div>}
        </form>
      </>
    )}

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
                title: "Promotion",
              },
            ]}
          />}
          <div className="main-title-container">
            <div className="title-add-mobile">
              <h5 className="main-content-title">Promotions</h5>
              {matches && modulePermissionsData?.add &&
                <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => {
                  setVisible(true)
                  handleshowRegisteredModal({}, 'add')
                }}
                >Add Promotion</Button>
              }
            </div>
            <div className='title-buttons'>
              {!matches && modulePermissionsData?.add &&
                <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => {
                  setVisible(true)
                  handleshowRegisteredModal({}, 'add')
                }}
                >Add Promotion</Button>
              }{/* <Excel page={'RegisteredEvents'} importdata={data} /> */}
              {/* {modulePermissionsData?.export &&
                  <Excel page={'AdminUsers'} importdata={data} />
                } */}
              {matches &&
             <>
                <div></div>
                <div className="filter-section-container">
                  <FilterData content={FilterSection} open={open} handleOpenChange={handleOpenChange} />
                </div></>
              }
            </div>
          </div>
          <div className="main-content-card">
            {!matches &&
              // <FilterSection />
              <div className="filter-form">
                <div className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"}`}>
                  <div className="input-group">
                    <label htmlFor="user" className="form-lable"> Brand</label>
                    <div className="form-group">
                      <input
                        className="form-field"
                        type="text"
                        id="eventName"
                        placeholder="Enter Brand  "
                        {...register('brand')}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="user" className="form-lable"> Title</label>
                    <div className="form-group">
                      <input
                        className="form-field"
                        type="text"
                        id="eventName"
                        placeholder="Enter Brand  "
                        {...register('title')}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="user" className="form-lable">Promotion Type</label>
                    <div className="form-group">
                      <select
                        id="location"
                        {...register("type")}
                      >
                        <option value="">Type</option>
                        <option value="entertainments">Entertainments</option>
                        <option value="dinings">Dinings</option>
                        <option value="sports">Sports</option>
                      </select>

                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="event" className="form-lable">Status</label>
                    <div className="form-group">
                      <select
                        id="location"
                        className="form-field"

                        // onChange={(e) => { TypeFilter(e.target.value) }}
                        {...register('status')}
                      >
                        <option value="" selected disabled>Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="paused">Paused</option>
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
                        brand: '',
                        type: '',
                        title: '',
                        status: '',

                      });
                      getOffer();
                      handleOpenChange(false);

                    }}
                  > Clear</Button>
                </div>}
              </div>
            }
           
            <Table columns={columns} data={data} />
          </div>
        </Card>
      </div >
      <AddOffers
        edit={edit}
        editdata={editData}
        visible={visible}
        setEdit={setEdit}
        setvisible={setVisible}
        onConfirm={handleConfirmDelete}
        // onCancel={handleCancelDelete}
        getOffer={getOffer}
        setEditData={setEditData}
        name="Edit"
        row={rowdata}
      />
      <OffersDetails
        visible={showOffersViewModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        name="Promotion Details"
        row={rowdata}
      />
      <DeleteConfirmation
        visible={deleteConfirmationVisible}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        name="Banner"
      />
    </Fragment >
  )
}

export default Offers