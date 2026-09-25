import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Card, Breadcrumb, Button, Radio, RadioChangeEvent } from "antd";
import { deleteCoach, deleteSession, filterSession, getAllCoaches, getAllSession, getAllEventVenuesAPI, getAllRegisteredUsersAPI, getAllRegisteredUsersFilterAPI, getAllTournamentsAPI, getAllUsers, getFacilityApi, getAllCoachingProgram, filterCoach, filterCoachingProgram } from "../../components/apiFile/Service";
import ToastMessage from "../facilator/ToastMessage/ToastMessage";
import { toast } from "react-toastify";
import _ from "lodash";
import UserLabel from "../../components/Labels/UserLabel";  
import SkillLabel from "../../components/Labels/SkillLabel";
import StatusLabel from "../../components/Labels/StatusLabel";
import { Icon } from "@iconify-icon/react";
import RegistrationDetails from "../../components/Modal/RegistrationDetails";
import EditRegistration from "../../components/Modal/EditRegistration";
import { Controller, useForm } from 'react-hook-form';
import Table from "../../components/Table/DataTable";
import Excel from "../../components/Helpers/Excel";
import moment from "moment";
import AddCoach from "../../components/Modal/AddCoach";
import CoachDetails from "../../components/Modal/CoachDetails";
import { RiDeleteBin5Fill } from "react-icons/ri";
import DeleteConfirmation from "../../components/Modal/DeleteConfirmation";
import AddSession from "../../components/Modal/AddSession";
import SessionDetails from "../../components/Modal/SessionDetails";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import FilterData from "../../components/Modal/FilterData";
import { useSelector } from "react-redux";
import CopyToClipboard from "../../components/CopyToClipboard/CopyToClipboard";



const CoachingSession = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {

     const moduleName = "Session"
     const [data, setData] = useState([]);
     const [coachesList, setCoachesList] = useState([]);
     const loggedInUser = localStorage.getItem("auth");
     const [showViewModal, setShowViewModal] = useState(false);
     const [rowdata, setRowdata] = useState({});
     const [programList, setProgramList] = useState([]);
     const [showFormModal, setShowFormModal] = useState(false);
     const [edit, setEdit] = useState(false);
     const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
     const [deleteRowId, setDeleteRowId] = useState<string | null>(null);
     const animatedComponents = makeAnimated();
     const { register, watch, setValue, reset, control } = useForm()

     const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)

     let title = watch("title");
     let program = watch("program");

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
               name: 'Title',
               selector: row => row?.title,
               sortable: true,
               wrap: true,
          },
          {
               name: 'Subtitle',
               selector: row => row?.sub_title,
               sortable: true,
               wrap: true,
          },
          {
               name: 'Price',
               selector: row => row?.price,
               sortable: true,
               wrap: true,
          },
          {
               name: 'Program',
               selector: row => row?.program?.title,
               sortable: true,
               wrap: true,

          },
          {
               name: 'Actions',
               selector: row => row.year,
               sortable: true,
               wrap: true,
               cell: row =>
                    <div className='action-button-container'>
                         {modulePermissionsData?.view &&
                              <button className='action-button view-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'view') }} ><Icon icon="raphael:view" /></button>
                         }
                         {modulePermissionsData?.edit &&
                              <button className='action-button edit-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'edit') }}><Icon icon="mdi:pencil-outline" /></button>
                         }
                         {modulePermissionsData?.delete &&
                              <button onClick={(e) => { e.preventDefault(); handleDeleteModal(row._id) }} className='action-button delete-button'>
                                   <RiDeleteBin5Fill title="Delete" />
                              </button>
                         }
                         {modulePermissionsData?.delete &&
                              <button className='action-button delete-button'>
                                    <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} onClick={(e)=>{e.preventDefault(); copyToClipboard(row)}}/>
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
          let response = await deleteSession(loggedInUser, id);
          if (response.statusCode == 0) {
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
               toast(<ToastMessage body={`Failed To Delete the ${moduleName}`} type="success" />, {
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

     const getCoaches = async () => {
          let response
          if (!loggedUserDetails?.roleId) {
               response = await getAllCoaches(loggedInUser);
               let coaches = response?.result?.map(data => {
                    return { "label": data?.name, "value": data?._id }
               })
               setCoachesList(coaches);
          } else {
               response = await filterCoach(loggedInUser, "", loggedUserDetails?.facility_id, '', '', '', '', '', '', '');
               let coaches = response?.result?.data?.map(data => {
                    return { "label": data?.name, "value": data?._id }
               })
               setCoachesList(coaches);
          }
         
     }

     const getAllProgram = async () => {
          let response
          if (!loggedUserDetails?.roleId) {
               response = await getAllCoachingProgram(loggedInUser);
          } else {
               response = await filterCoachingProgram(loggedInUser, '', '', '', '', loggedUserDetails?.facility_id, '');
          }
          let programs = response?.result?.map(data => {
               return { "label": data?.title, "value": data?._id }
          })
          setProgramList(programs);
     }

     const filterData = async (search, value) => {
          let response = await filterSession(loggedInUser,
               title == undefined ? "" : title,
               program == undefined ? '' : program?.value,
          );
          if (response?.statusCode == 0) {
               setData(response?.result);
          } else {
               setData([]);
          }
     };

     const onClearFilter = () => {
          getAllData();
          reset({
               title: '',
               program: null,
          });
     }

     const getAllData = async () => {
          let response
          if (!loggedUserDetails?.roleId) {
               response = await getAllSession(loggedInUser);
          } else {
               response = await filterSession(loggedInUser,
                    title == undefined ? "" : title,
                    program == undefined ? '' : program?.value,
               );;
          }
          setData(response?.result);
     }

     useEffect(() => {
          getAllData();
          getCoaches();
          getAllProgram();
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
                                   <label htmlFor="title" className="form-lable">Title</label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="text"
                                             id="title"
                                             placeholder="Enter program title"
                                             {...register('title')}
                                        />
                                   </div>
                              </div>

                              <div className="input-group">
                                   <label htmlFor="program" className="form-lable">Program</label>
                                   <div className="form-group">
                                        <Controller
                                             name="program"
                                             control={control}
                                             render={({ field }) => (
                                                  <Select
                                                       // closeMenuOnSelect={false}
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                                                       // isMulti
                                                       options={programList}
                                                       placeholder="Select a program"
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
                    {matches && <div className="filter-buttons-row">
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
                                        <h5 className="main-content-title">{moduleName}s</h5>
                                        {matches && modulePermissionsData?.add &&
                                             <Button
                                                  className="pi-btn-primary"
                                                  key="confirm" type="primary"
                                                  onClick={() => { setEdit(false); setShowFormModal(true) }}
                                             >
                                                  Add {moduleName}
                                             </Button>
                                        }
                                   </div>
                                   <div className='title-buttons'>
                                        {!matches && modulePermissionsData?.add &&
                                             <Button
                                                  className="pi-btn-primary"
                                                  key="confirm" type="primary"
                                                  onClick={() => { setEdit(false); setShowFormModal(true) }}
                                             >
                                                  Add {moduleName}
                                             </Button>
                                        }
                                   </div>
                                   {matches &&
                                        <div className="filter-section-container">
                                             <FilterData content={FilterSection} open={open} handleOpenChange={handleOpenChange} />
                                        </div>
                                   }
                              </div>
                              <div className="main-content-card">
                                   {!matches &&
                                        // <FilterSection />
                                        <div className="filter-form">
                                             <div className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"}`}>
                                                  <div className="input-group">
                                                       <label htmlFor="title" className="form-lable">Title</label>
                                                       <div className="form-group">
                                                            <input
                                                                 className="form-field"
                                                                 type="text"
                                                                 id="title"
                                                                 placeholder="Enter program title"
                                                                 {...register('title')}
                                                            />
                                                       </div>
                                                  </div>

                                                  <div className="input-group">
                                                       <label htmlFor="program" className="form-lable">Program</label>
                                                       <div className="form-group">
                                                            <Controller
                                                                 name="program"
                                                                 control={control}
                                                                 render={({ field }) => (
                                                                      <Select
                                                                           // closeMenuOnSelect={false}
                                                                           className="controller-select"
                                                                           components={animatedComponents}
                                                                           defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                                                                           // isMulti
                                                                           options={programList}
                                                                           placeholder="Select a program"
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
                         </form>
                    </Card>
                    <SessionDetails
                         visible={showViewModal}
                         onCancel={handleCancel}
                         name={`${moduleName} Details`}
                         row={rowdata}
                    />
                    <AddSession
                         visible={showFormModal}
                         onCancel={handleCancel}
                         row={rowdata}
                         edit={edit}
                         programList={programList}
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
export default CoachingSession;
