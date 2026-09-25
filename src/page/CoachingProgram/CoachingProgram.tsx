import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Card, Breadcrumb, Button, Radio, RadioChangeEvent } from "antd";
import { deleteCoach, deleteCoachingProgram, filterCoach, filterCoachingProgram, getAllCoaches, getAllCoachingProgram, getAllEventVenuesAPI, getAllRegisteredUsersAPI, getAllRegisteredUsersFilterAPI, getAllTournamentsAPI, getAllUsers, getFacilityApi, getFacilityByIdApi } from "../../components/apiFile/Service";
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
import AddCoachingProgram from "../../components/Modal/AddCoachingProgram";
import CoachingProgramDetails from "../../components/Modal/CoachingProgramDetails";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import CoachLabel from "../../components/Labels/CoachLabel";
import FilterData from "../../components/Modal/FilterData";
import { useSelector } from "react-redux";



const CoachingProgram = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {

     const moduleName = "Coaching program"
     const [data, setData] = useState([]);
     const [coachesList, setCoachesList] = useState([]);
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

     const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)


     let title = watch("title");
     let facility = watch("facility");
     let coach = watch("coach");
     let city = watch("");
     let language = watch("");               
     let sport_type = watch("sport_type");


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
               name: 'Image',
               selector: row => row?._id,
               wrap: true,
               sortable: false,
               cell: row => (<img src={row?.image} className='table-lg-img' />)
          },
          {
               name: 'Title',
               selector: row => row?.title,
               sortable: true,
               wrap: true,
          },
          {
               name: 'Start Date',
               selector: row => moment(row?.start).format("DD-MM-YYYY"),
               sortable: true,
               wrap: true,
          },
          {
               name: 'End Date',
               selector: row => moment(row?.end).format("DD-MM-YYYY"),
               sortable: true,
               wrap: true,
          },
          // {
          //      name: 'Description',
          //      selector: row => row?.description,
          //      sortable: true,
          //      wrap: true,
          //      cell: row => (row?.description?<>< div dangerouslySetInnerHTML={{ __html: row?.description }} /></ > : "___")
          // },
          {
               name: 'Sports Type',
               selector: row => row?.sport_type,
               sortable: true,
               wrap: true,


          },
          {
               name: 'Venue',
               selector: row => row?.facility?.name,
               sortable: true,
               wrap: true,


          },
          {
               name: 'Coach',
               selector: row => row?.coach?.name,
               sortable: true,
               wrap: true,
               cell: row => (row?.coach ? <div className="max-width-container" ><CoachLabel coachData={row?.coach} /> </div> : "___")
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
          let response = await deleteCoachingProgram(loggedInUser, id);
          if (response.statusCode == 0) {
               toast(<ToastMessage body={`${moduleName} Deleted with session Successfully`} type="success" />, {
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
     const getAllFacility = async () => {
          let response = await getFacilityApi(loggedInUser);
          if (!loggedUserDetails?.roleId) {
               let venues = response?.result?.map(data => {
                    return { "label": data?.name, "value": data?._id }
               });
               setFacilityList(venues);
          } else {
               const filteredFacilities = response?.result.filter(item => loggedUserDetails?.facilities.includes(item._id));
               let venues = filteredFacilities?.map(data => {
                    return { "label": data?.name, "value": data?._id }
               });
               setFacilityList(venues);
               setValue('facility', { label: filteredFacilities[0]?.name, value: filteredFacilities[0]?._id });
          }
     };

     const filterData = async (search, value) => {
          let sport = ''
          if (value == '') {
               sport = sport_type
          } else {
               sport = value
          }
          let response = await filterCoachingProgram(loggedInUser,
               coach == undefined ? '' : coach?.value,
               city == undefined ? '' : city,
               language == undefined ? '' : language,
               title == undefined ? "" : title,
               facility == undefined ? '' : facility?.value,
               sport == undefined || sport == 'all' ? '' : sport
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
               facility: loggedUserDetails?.roleId ? facilityList[0] : null,
               coach: null,
               city: '',
               language: '',
               sport_type: '',
          });
     }

     const options = [
          { label: 'All', value: 'all' },
          { label: 'Padel', value: 'Padel' },
          { label: 'Pickleball', value: 'Pickleball', },
     ];

     const onSportsChange = ({ target: { value } }: RadioChangeEvent) => {
          setValue('sport_type', value);
          filterData(true, value)
     };

     const getAllData = async () => {
          let response
          if (!loggedUserDetails?.roleId) {
               response = await getAllCoachingProgram(loggedInUser);               
          } else {
               response = await filterCoachingProgram(loggedInUser, '', '', '', '', loggedUserDetails?.roleId ? facilityList[0] : '', '');               
          }
          setData(response?.result);
     }

     useEffect(() => {
          getAllData();
          getCoaches();
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
                                   <label htmlFor="facility" className="form-lable">Facility</label>
                                   <div className="form-group">
                                        <Controller
                                             name="facility"
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
                                   <label htmlFor="coach" className="form-lable">Coach</label>
                                   <div className="form-group">
                                        <Controller
                                             name="coach"
                                             control={control}
                                             render={({ field }) => (
                                                  <Select
                                                       // closeMenuOnSelect={false}
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       defaultValue={field.value ? field.value : null} // Conditionally set defaultValue based on field value
                                                       // isMulti
                                                       options={coachesList}
                                                       placeholder="Select a coach"
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
                                        title: "Coaching Programs",
                                   }
                              ]}
                         />}
                         <form className="">
                              <div className="main-title-container">
                                   <div className="title-add-mobile">
                                        <h5 className="main-content-title">Coaching Programs</h5>
                                        {matches && modulePermissionsData?.add &&
                                             <Button
                                                  className="pi-btn-primary"
                                                  key="confirm" type="primary"
                                                  onClick={() => { setEdit(false); setShowFormModal(true) }}
                                             >
                                                  Add Program
                                             </Button>
                                        }
                                   </div>
                                   <div className='title-buttons'>
                                        <div>

                                             <Radio.Group
                                                  options={options}
                                                  {...register('sport_type')}
                                                  onChange={onSportsChange}
                                                  value={sport_type ? sport_type : 'all'}
                                             />
                                        </div>
                                        {!matches && modulePermissionsData?.add &&
                                             <Button
                                                  className="pi-btn-primary"
                                                  key="confirm" type="primary"
                                                  onClick={() => { setEdit(false); setShowFormModal(true) }}
                                             >
                                                  Add Program
                                             </Button>
                                        }
                                        {matches &&
                                             <div className="filter-section-container">
                                                  <FilterData content={FilterSection} open={open} handleOpenChange={handleOpenChange} />
                                             </div>
                                        }
                                   </div>
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
                                                       <label htmlFor="facility" className="form-lable">Facility</label>
                                                       <div className="form-group">
                                                            <Controller
                                                                 name="facility"
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
                                                       <label htmlFor="coach" className="form-lable">Coach</label>
                                                       <div className="form-group">
                                                            <Controller
                                                                 name="coach"
                                                                 control={control}
                                                                 render={({ field }) => (
                                                                      <Select
                                                                           // closeMenuOnSelect={false}
                                                                           className="controller-select"
                                                                           components={animatedComponents}
                                                                           defaultValue={field.value ? field.value : null} // Conditionally set defaultValue based on field value
                                                                           // isMulti
                                                                           options={coachesList}
                                                                           placeholder="Select a coach"
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
                    <CoachingProgramDetails
                         visible={showViewModal}
                         onCancel={handleCancel}
                         name="Program Details"
                         row={rowdata}
                    />
                    <AddCoachingProgram
                         visible={showFormModal}
                         onCancel={handleCancel}
                         row={rowdata}
                         edit={edit}
                         facilityList={facilityList}
                         coachesList={coachesList}
                         setEdit={setEdit}
                         setRow={setRowdata}
                         getAllData={getAllData}
                    />
                    <DeleteConfirmation
                         visible={deleteConfirmationVisible}
                         onConfirm={handleConfirmDelete}
                         onCancel={handleCancelDelete}
                         name="Coach"
                    />
               </div >

          </Fragment >
     );
};
export default CoachingProgram;
