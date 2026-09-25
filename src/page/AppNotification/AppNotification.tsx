import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Card, Breadcrumb, Button, Radio, RadioChangeEvent } from "antd";
import { deleteCourt, deleteNotification, filterCourt, getAllCoaches, getAllCourt, getAllNotifications, getFacilityApi } from "../../components/apiFile/Service";
import ToastMessage from "../facilator/ToastMessage/ToastMessage";
import { toast } from "react-toastify";
import _ from "lodash";
import { Icon } from "@iconify-icon/react";
import { Controller, useForm } from 'react-hook-form';
import Table from "../../components/Table/DataTable";
import moment from "moment";
import { RiDeleteBin5Fill } from "react-icons/ri";
import DeleteConfirmation from "../../components/Modal/DeleteConfirmation";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Excel from "../../components/Helpers/Excel";
import FilterData from "../../components/Modal/FilterData";
import AddTimePrice from "../../components/Modal/AddTimePrice";
import TimePriceDetails from "../../components/Modal/TimePriceDetails";
import SendNotification from "../../components/Modal/SendNotification";
import StatusLabel from "../../components/Labels/StatusLabel";
import NotificationDetails from "../../components/Modal/NotificationDetails";


const AppNotifications = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {

     const moduleName = "App Notification"
     const [data, setData] = useState([]);
     const loggedInUser = localStorage.getItem("auth");
     const [showViewModal, setShowViewModal] = useState(false);
     const [rowdata, setRowdata] = useState({});
     const [facilityList, setFacilityList] = useState([]);
     const [showFormModal, setShowFormModal] = useState(false);
     const [edit, setEdit] = useState(false);
     const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
     const [deleteRowId, setDeleteRowId] = useState<string | null>(null);
     const animatedComponents = makeAnimated();
     const { register, watch, setValue, reset, control } = useForm()


     const notificationTypeOptions: any = [
          { value: "In App", label: "In App" },
          { value: "Push Notification", label: "Push Notification" },
          { value: "Both", label: "Both" }
     ]

     const StatusOptions: any = [
          { value: "Active", label: "Active" },
          { value: "Scheduled", label: "Scheduled" },
          { value: "Expired", label: "Expired" },
     ];


     let type = watch("type");
     let status = watch("status");

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
               name: 'ID',
               selector: row => row?._id,
               wrap: true,
               sortable: false,
          },
          {
               name: 'Date and Time',
               selector: row => moment(row?.dateTime).format("DD-MM-YYYY  hh:mm A"),
               sortable: true,
               wrap: true,
          },
          {
               name: 'Title',
               selector: row => row?.title,
               sortable: true,
               wrap: true,
          },
          // {
          //      name: 'Description',
          //      selector: row => row?.description,
          //      sortable: true,
          //      wrap: true,
          // },
          {
               name: 'URL',
               selector: row => row?.redirectURL ? row?.redirectURL : "N/A",
               sortable: true,
               wrap: true,
          },
          {
               name: 'Type',
               selector: row => row?.notificationType,
               sortable: true,
               wrap: true,
          },
          {
               name: 'Expiry',
               selector: row => moment(row?.expiry).format("DD-MM-YYYY  hh:mm A"),
               sortable: true,
               wrap: true,
          },
          {
               name: 'Statistics',
               selector: row => `recieved - ${row?.received} clicked - ${row?.clicked}  failed - ${row?.failed}`,
               sortable: true,
               wrap: true,
               cell: row =>
                    <div>
                         Recieved - {row?.recieved || 0} <br />
                         Clicked - {row?.clicked || 0} <br />
                         Failed - {row?.failed || 0} <br />
                    </div>
          },
          {
               name: 'Status',
               selector: row => row?.status,
               sortable: true,
               wrap: true,
               cell: row =>
                    <div className='playerContainer max-width-container'>
                         <StatusLabel status={row.status} />
                    </div>
          },
          {
               name: 'Actions',
               sortable: true,
               wrap: true,
               cell: row =>
                    <div className='action-button-container'>
                         {modulePermissionsData?.view &&
                              <button className='action-button view-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'view') }} ><Icon icon="raphael:view" /></button>
                         }
                         {modulePermissionsData?.edit &&
                              <button className='action-button edit-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'edit') }} disabled={row.status != "Scheduled"}><Icon icon="mdi:pencil-outline" /></button>
                         }
                         {modulePermissionsData?.delete &&
                              <button onClick={(e) => { e.preventDefault(); handleDeleteModal(row._id) }} className='action-button delete-button' disabled={row.status != "Scheduled"} >
                                   <RiDeleteBin5Fill title="Delete" />
                              </button>
                         }
                         {modulePermissionsData?.delete &&
                              <button onClick={(e) => { e.preventDefault(); copyToClipboard(row) }} className='action-button delete-button'>
                                   <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} />
                              </button>
                         }
                    </div >

               ,
          },
     ];

     // delete popup 
     const handleDeleteModal = (id) => {
          setDeleteRowId(id);
          setDeleteConfirmationVisible(true);
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
          let response = await deleteNotification(loggedInUser, id);
          if (response.code == 'SUCCESS') {
               toast(<ToastMessage body={`${moduleName} Deleted Successfully`} type="success" />, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
               getAllData();
          } else {
               toast(<ToastMessage body={`Failed To Delete the ${moduleName}`} type="warning" />, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
          }
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

     const handleCancel = () => {
          setShowFormModal(false);
          setShowViewModal(false);
          setShowFormModal(false);
          setEdit(false);
     };

     const getAllFacility = async () => {
          let response = await getFacilityApi(loggedInUser);
          let venues = response?.result?.map(data => {
               return { "label": data?.name, "Lab": `${data.address} ${data.city}`, "value": data?._id }
          })
          setFacilityList(venues);
     }

     const filterData = async () => {
          console.log('====================================');
          console.log(type, status);
          console.log('====================================');
          let response = await getAllNotifications(loggedInUser, 1, 200,
               type?.value == undefined ? '' : type?.value,
               status?.value == undefined ? '' : status?.value,
          );
          if (response?.code == 'SUCCESS') {
               setData(response?.data);
          } else {
               setData([]);
          }
     };

     const onClearFilter = () => {
          getAllData();
          reset({
               type: '',
               status: '',
          });
     }

     const getAllData = async () => {
          let response = await getAllNotifications(loggedInUser, 1, 200, '', '');
          setData(response?.data);
     }

     useEffect(() => {
          getAllData();
          getAllFacility();
     }, [])

     const [open, setOpen] = useState(false);
     const handleOpenChange = (newOpen: boolean) => {
          setOpen(newOpen);
     };
     const FilterSection = () => {
          return (
               <>

                    <div className="filter-form">
                         <div className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"}`}>
                              <div className="input-group">
                                   <label htmlFor="type" className="form-lable">Type</label>
                                   <div className="form-group">
                                        <Controller
                                             name="type"
                                             control={control}
                                             render={({ field }) => (
                                                  <Select
                                                       // closeMenuOnSelect={false}
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                                                       // isMulti
                                                       options={notificationTypeOptions}
                                                       placeholder="Select a type..."
                                                       {...field}
                                                  />
                                             )}
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
                                                       options={StatusOptions}
                                                       placeholder="Select a status..."
                                                       {...field}
                                                  />
                                             )}
                                        />
                                   </div>
                              </div>
                         </div>
                         {!matches && <div className="filter-buttons-row">
                              <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => {
                                   filterData()
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
                    {matches && <div className="filter-buttons-row">
                         <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => {
                              filterData()
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
                                        title: `${moduleName}s`,
                                   }
                              ]}
                         />}
                         <form className="">
                              <div className="main-title-container">
                                   <div className="title-add-mobile">
                                        <h5 className="main-content-title">{`${moduleName}s`}</h5>
                                        {matches && modulePermissionsData?.add &&
                                             <Button
                                                  className="pi-btn-primary"
                                                  key="confirm" type="primary"
                                                  onClick={() => { setEdit(false); setShowFormModal(true) }}
                                             >
                                                  Send Notifications
                                             </Button>
                                        }
                                   </div>
                                   <div className='title-buttons'>

                                        <div className="add-export-btn">

                                             {!matches && modulePermissionsData?.add &&
                                                  <Button
                                                       className="pi-btn-primary"
                                                       key="confirm" type="primary"
                                                       onClick={() => { setEdit(false); setShowFormModal(true) }}
                                                  >
                                                       Send Notifications
                                                  </Button>
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
                                        <FilterSection />
                                   }

                                   <Table
                                        columns={columns}
                                        data={data}
                                   />
                              </div>
                         </form>
                    </Card>
                    <NotificationDetails
                         visible={showViewModal}
                         onCancel={handleCancel}
                         name="Notification Details"
                         row={rowdata}
                    />
                    <SendNotification
                         visible={showFormModal}
                         onCancel={handleCancel}
                         row={rowdata}
                         edit={edit}
                         facilityList={facilityList}
                         setEdit={setEdit}
                         setRow={setRowdata}
                         getAllData={getAllData}
                    />
                    <DeleteConfirmation
                         visible={deleteConfirmationVisible}
                         onConfirm={handleConfirmDelete}
                         onCancel={handleCancelDelete}
                         name={moduleName}
                    />
               </div >

          </Fragment >
     );
};
export default AppNotifications;
