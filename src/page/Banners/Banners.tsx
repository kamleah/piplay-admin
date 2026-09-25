import { Breadcrumb, Button, Card } from 'antd';
import React, { Fragment, useEffect, useState } from 'react'
import Excel from '../../components/Helpers/Excel';
import Table from '../../components/Table/DataTable';
import { Icon } from '@iconify-icon/react';
import ToastMessage from '../facilator/ToastMessage/ToastMessage';
import { toast } from "react-toastify";
import { bannerfilterAPI, getBanners } from '../../components/apiFile/Service';
import AddBanners from '../../components/Modal/AddBanners';
import DeleteConfirmation from '../../components/Modal/DeleteConfirmation';
import { deleteBanners } from '../../components/apiFile/Service';
import moment from 'moment';
import BannersDetails from '../../components/Modal/BannersDetails';
import StatusLabel from '../../components/Labels/StatusLabel';
import { useForm } from 'react-hook-form';
import FilterData from '../../components/Modal/FilterData';


const Banners = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {
  const [data, setData] = useState([])
  const [edit, setEdit] = useState(false)
  const [editData, setEditData] = useState({})

  const [showBannerViewModal, setShowBannerViewModal] = useState(false);
  const [showBannerEditModal, setShowBannerEditModal] = useState(false);
  const [rowdata, setRowdata] = useState({});
  const [visible, setVisible] = useState(false);

  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);
  const loggedInUser = localStorage.getItem("auth");
  const { register, handleSubmit, reset, watch, setValue } = useForm()

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
      name: ' Image',
      selector: row => row?.image,
      wrap: true,
      sortable: true,
      cell: row => (<img src={row?.image} className='table-lg-img' />)
    },
    {
      name: "Name",
      selector: row => row?.title,
      wrap: true,
      sortable: true,
    },
    // {
    //   name: "Sub Title",
    //   selector: row => row?.sub_title,
    //   wrap: true,
    //   sortable: true,
    // },
    {
      name: "Position",
      selector: row => row?.position,
      wrap: true,
      sortable: true,
    },
    {
      name: "Start Date",
      selector: row => moment(row?.start).format('ddd, D MMM YY h:mm A'),
      wrap: true,
      sortable: true,
    },
    {
      name: "End Date",
      selector: row => moment(row?.end).format('ddd, D MMM YY h:mm A'),
      wrap: true,
      sortable: true,
    },
    // {
    //   name: "Status",
    //   selector: row => row?.active ? "Active" : "Inactive",
    //   wrap: true,
    //   sortable: true,
    //   cell: row => [
    //     <span key="status-text" style={{ color: row.active ? "green" : "red" }}>
    //       {row.active ? "Active" : "Inactive"}
    //     </span>
    //   ]
    // },


    {
      name: "Status",
      selector: row => row?.active,
      wrap: true,
      sortable: true,
      cell: row =>
        <div className='playerContainer max-width-container'>
          <StatusLabel
            status={row?.active == true ?
              moment(row?.start).format('DD-MM-YYYY') > moment().format('DD-MM-YYYY') ? "Scheduled" :
                'Active' :
              "Inactive"}
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
            <button className='action-button view-button' onClick={() => handleshowRegisteredModal(row, 'view')}>
              {/* onClick={() => handleshowRegistrationModal(row, 'view')} */}
              <Icon icon="raphael:view" />
            </button>}
          {modulePermissionsData?.edit &&
            <button className='action-button edit-button' onClick={() => { setEdit(true); setVisible(true); setEditData(row); handleshowRegisteredModal(row, 'edit') }}
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
    let response = await bannerfilterAPI(loggedInUser, status == undefined || status == "" ? "" : status == 'active' || status == 'scheduled' ? true : false, title == undefined || title == "" ? "" : title);
    if (response?.message.split(' ')[0] != 0) {
      if (status == 'scheduled') {
        setData(response?.data.map(ele => {
          if (moment(ele?.start).format('DD-MM-YYYY') > moment().format('DD-MM-YYYY')) return ele
          else {
            return undefined //return nothing delete data if comes in else
          }
        }).filter(ele => ele !== null && ele !== undefined))
      }
      else if (status == 'active') {
        setData(response?.data.map(ele => {
          if (moment(ele?.start).format('DD-MM-YYYY') < moment().format('DD-MM-YYYY')) return ele
          else {
            return undefined //return nothing delete data if comes in else
          }
        }).filter(ele => ele !== null && ele !== undefined))
      } else {
        setData(response?.data)
      }
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
  const getAllBanner = async () => {
    let response = await getBanners(loggedInUser)
    setData(response?.data)
  }
  const handleshowRegisteredModal = async (row: any, type: any) => {
    setRowdata(row);
    if (type == 'view') {
      setShowBannerViewModal(true);
    } else if (type == 'edit') {
      setShowBannerEditModal(true);
    } else if (type == 'add') {
      setRowdata({});
      setShowBannerViewModal(false);
      setShowBannerEditModal(true);
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
      setShowBannerEditModal(false);
      setUserToDeleteId("");
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationVisible(false);
    setShowBannerViewModal(false);
    setShowBannerEditModal(false);

    setUserToDeleteId("");
  };

  const DeleteFunction = async (id) => {
    let response = await deleteBanners(loggedInUser, id)
    if (response.code == 'SUCCESS') {
      toast(<ToastMessage body={"Banner Deleted Successfully"} type="success" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      getAllBanner();
    } else {
      toast(<ToastMessage body={"Failed To Delete the Banner"} type="warning" />, {
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
    getAllBanner();
  }, []);

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
                <label htmlFor="title" className="form-lable">Title</label>
                <div className="form-group">
                  <input
                    className="form-field"
                    type="text"
                    id="title"
                    placeholder="Enter  title"
                    {...register('title')}
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="status" className="form-lable">Status</label>
                <div className="form-group">
                  <select
                    id="status"
                    className="form-field"

                    // onChange={(e) => { TypeFilter(e.target.value) }}
                    {...register('status')}
                  >
                    <option value="" selected disabled>Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {matches && <div className="filter-buttons-row">
            <Button className="pi-btn-primary" key="confirm" type="primary"
              onClick={() => {
                Search(true);
                handleOpenChange(false);

              }}
            >Apply</Button>
            <Button className="pi-btn-secondary" key="cancel"
              onClick={() => {
                reset({
                  status: '',
                  title: '',
                });
                getAllBanner();
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
                title: "Banner",
              },
            ]}
          />}
          <div className="main-title-container">
            <div className="title-add-mobile">
              <h5 className="main-content-title">Banners</h5>
              {matches && modulePermissionsData?.add &&
                <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => {
                  setVisible(true)

                  handleshowRegisteredModal({}, 'add')
                }}>Add Banners</Button>
              }
            </div>
            <div className='title-buttons'>
              {!matches && modulePermissionsData?.add &&
                <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => {
                  setVisible(true)
                  handleshowRegisteredModal({}, 'add')
                }}>Add Banners</Button>
              }{/* <Excel page={'RegisteredEvents'} importdata={data} /> */}
              {/* {modulePermissionsData?.export &&
                  <Excel page={'AdminUsers'} importdata={data} />
                } */}
              {matches &&
                <>
                  <div></div>
                  <div className="filter-section-container">
                    <FilterData content={FilterSection} open={open} handleOpenChange={handleOpenChange} />
                  </div>
                </>
              }
            </div>
          </div>
          <div className="main-content-card">
            {!matches && <form>
              <div className="filter-form">
                <div className="filter-fields">
                  <div className="input-group">
                    <label htmlFor="title" className="form-lable">Title</label>
                    <div className="form-group">
                      <input
                        className="form-field"
                        type="text"
                        id="title"
                        placeholder="Enter  title"
                        {...register('title')}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="status" className="form-lable">Status</label>
                    <div className="form-group">
                      <select
                        id="status"
                        className="form-field"

                        // onChange={(e) => { TypeFilter(e.target.value) }}
                        {...register('status')}
                      >
                        <option value="" selected disabled>Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="scheduled">Scheduled</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="filter-buttons-row">
                  <Button className="pi-btn-primary" key="confirm" type="primary"
                    onClick={() => {
                      Search(true)
                      handleOpenChange(false);

                    }}
                  >Apply</Button>
                  <Button className="pi-btn-secondary" key="cancel"
                    onClick={() => {
                      reset({
                        status: '',
                        title: '',
                      });
                      getAllBanner();
                      handleOpenChange(false);

                    }}
                  > Clear</Button>
                </div>
              </div>
            </form>}
            <Table columns={columns} data={data} />
          </div>
        </Card>
      </div>
      <AddBanners
        edit={edit}
        editdata={editData}
        visible={visible}
        setEdit={setEdit}
        setvisible={setVisible}
        onConfirm={handleConfirmDelete}
        // onCancel={handleCancelDelete}
        getAllBanner={getAllBanner}
        setEditData={setEditData}
        name="Edit"
        row={rowdata}
      />
      <BannersDetails
        visible={showBannerViewModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        name="Banners Details"
        row={rowdata}
      />
      <DeleteConfirmation
        visible={deleteConfirmationVisible}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        name="Banner"
      />
    </Fragment>
  )
}

export default Banners