import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Card, Breadcrumb, Button, Radio, RadioChangeEvent } from "antd";
import { deleteCoach, filterCoach, getAllCoaches, getAllEventVenuesAPI, getAllRegisteredUsersAPI, getAllRegisteredUsersFilterAPI, getAllTournamentsAPI, getAllUsers, getFacilityApi, getFacilityByIdApi } from "../../components/apiFile/Service";
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
import makeAnimated from "react-select/animated";
import Select from "react-select";
import formatWeekdays from "../../components/Helpers/formatWeekdays";
import languageList from "../../components/Languages/Languages";
import FilterData from "../../components/Modal/FilterData";
import { useSelector } from "react-redux";

const Coaches = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {

     const [data, setData] = useState([]);
     const loggedInUser = localStorage.getItem("auth");
     const [showViewModal, setShowViewModal] = useState(false);
     const [rowdata, setRowdata] = useState({});
     const [facilityList, setFacilityList] = useState([]);
     const [showCoachesModal, setShowCoachesModal] = useState(false);
     const [edit, setEdit] = useState(false);
     const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
     const [deleteRowId, setDeleteRowId] = useState<string | null>(null);
     const animatedComponents = makeAnimated();

     const { register, watch, setValue, reset, control } = useForm()
     const loggedUserDetails = useSelector((state: any) => state?.user?.loggedUserDetails)     


     const languagesOptions: any = [
          { value: "English", label: "English" },
          { value: "Hindi", label: "Hindi" },
          { value: "Tamil", label: "Tamil" },
          { value: "Telugu", label: "Telugu" },
          { value: "Marathi", label: "Marathi" },
          { value: "Gujarati", label: "Gujarati" },
          { value: "Kannada", label: "Kannada" }
     ]

     let name = watch("name");
     let facility = watch("facility");
     let language = watch("language");
     let city = watch("city");
     let from = watch("from");
     let to = watch("to");
     let sport_type = watch("sport_type");
     let exfrom = watch("exfrom");
     let exto = watch("exto");

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
               cell: row => (<img src={row?.image} className='table-md-img' />)
          },
          {
               name: 'Coach Name',
               selector: row => row?.name,
               sortable: true,
               wrap: true,
          },
          {
               name: 'Language',
               selector: row => row?.languages?.map((item: any) => item).join(', '),
               sortable: true,
               wrap: true,
          },
          {
               name: 'Timing',
               selector: row => formatWeekdays(row?.days) + ' ' + row?.start_time + ' - ' + row?.end_time,
               sortable: true,
               wrap: true,
          },
          {
               name: 'Phone Number',
               selector: row => row?.mobileno,
               sortable: true,
               wrap: true,
          },

          {
               name: 'Email ID',
               selector: row => row?.email ? row?.email : '----',
               sortable: true,
               wrap: true,


          },
          // {
          //      name: 'Experience',
          //      selector: row => row?.experience,
          //      sortable: true,
          //      wrap: true,


          // },
          {
               name: 'Sports Type',
               selector: row => typeof row?.sport_type == 'string' ? row?.sport_type : row?.sport_type?.map((item: any) => item).join(' & '),
               sortable: true,
          },
          {
               name: 'Actions',
               selector: row => row?.year,
               sortable: true,
               wrap: true,
               cell: row =>
                    <div className='action-button-container'>
                         {modulePermissionsData?.view &&
                              <button className='action-button view-button' onClick={(e) => { e.preventDefault(); handleshowRegistrationModal(row, 'view') }} ><Icon icon="raphael:view" /></button>
                         }
                         {modulePermissionsData?.edit &&
                              <button className='action-button edit-button' onClick={(e) => { e.preventDefault(); handleshowRegistrationModal(row, 'edit') }}><Icon icon="mdi:pencil-outline" /></button>
                         }
                         {modulePermissionsData?.delete &&
                              <button onClick={(e) => { e.preventDefault(); handleDeleteConfirmation(row._id) }} className='action-button delete-button'>
                                   <RiDeleteBin5Fill title="Delete" />
                              </button>
                         }
                         {modulePermissionsData?.delete &&
                              <button onClick={(e) => { e.preventDefault(); copyToClipboard(row) }} className='action-button delete-button'>
                                   <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} />
                              </button>}
                    </div >

               ,
          },
     ];

     // delete popup 
     const handleDeleteConfirmation = (id) => {
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
          let response = await deleteCoach(loggedInUser, id);
          if (response.statusCode == 0) {
               toast(<ToastMessage body={'Coach Deleted Successfully'} type="success" />, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
               getAllData();
          } else {
               toast(<ToastMessage body={'Coach is assigned to program(s). Can\'t be deleted'} type="warning" />, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
          }
     };

     const handleshowRegistrationModal = async (row: any, type: any) => {
          setRowdata(row);
          if (type == 'view') {
               setShowViewModal(true);
          } else if (type == 'edit') {
               setEdit(true);
               setShowCoachesModal(true);
          } else {
               setShowViewModal(false);
               setShowCoachesModal(false);
               setEdit(false);
          }
     };

     const handleCancel = () => {
          setShowCoachesModal(false);
          setShowViewModal(false);
          setShowCoachesModal(false);
          setEdit(false);
     };

     const filterData = async (search, value) => {
          let sport = ''
          if (value == '') {
               sport = sport_type
          } else {
               sport = value
          }
          let response = await filterCoach(loggedInUser,
               name == undefined ? '' : name,
               !loggedUserDetails?.roleId ? facility == undefined ? '' : facility : loggedUserDetails?.facility_id,
               language == undefined ? '' : language.value,
               city == undefined ? '' : city,
               from == undefined ? '' : from,
               to == undefined ? '' : to,
               sport == undefined || sport == 'all' ? '' : sport,
               exfrom == undefined ? '' : exfrom,
               exto == undefined ? '' : exto
          );          
          if (response?.statusCode == 0) {
               setData(response?.result?.data);
          } else {
               setData([]);
          }
     };

     const options = [
          { label: 'All', value: 'all' },
          { label: 'Padel', value: 'Padel' },
          { label: 'Pickleball', value: 'Pickleball', },
     ];

     const onSportsChange = ({ target: { value } }: RadioChangeEvent) => {
          setValue('sport_type', value);
          filterData(true, value)
     };

     const getAllFacility = async () => {
          let response
          if (!loggedUserDetails?.roleId) {
               response = await getFacilityApi(loggedInUser);
          } else {
               response = await getFacilityByIdApi(loggedInUser, loggedUserDetails?.facility_id);
               response.result = [response.result]
          }
          let venues = response?.result?.map(data => {
               return { "label": data?.name, "sport_type": data?.sport_type, "value": data?._id }
          })
          setFacilityList(venues);
     }

     const getAllData = async () => {
          let response
          if (!loggedUserDetails?.roleId) {
               response = await getAllCoaches(loggedInUser);
               setData(response?.result);               
          } else {
               response = await filterCoach(loggedInUser, "", loggedUserDetails?.facility_id, '', '', '', '', '', '', '');
               setData(response?.result?.data);
          }          
     }

     const onClearFilter = () => {
          getAllData()
          reset({
               name: '',
               language: null,
               exfrom: '',
               exto: '',
               sport_type: '',
          });
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
                                   <label htmlFor="name" className="form-lable">Coach name</label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="text"
                                             id="name"
                                             placeholder="Enter Coach Name"
                                             {...register('name')}
                                        />
                                   </div>
                              </div>
                              <div className="input-group">
                                   <label htmlFor="language" className="form-lable">Languages</label>
                                   <div className="form-group">
                                        <Controller
                                             name="language"
                                             control={control}
                                             render={({ field }) => (
                                                  <Select
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       options={languageList}
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
                                        onClearFilter()
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
                                   onClearFilter()
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
                                        title: "Coaches",
                                   }
                              ]}
                         />}
                         <form className="">
                              <div className="main-title-container">
                                   <div className="title-add-mobile">
                                        <h5 className="main-content-title">Coaches</h5>
                                        {matches && modulePermissionsData?.add &&
                                             <Button
                                                  className="pi-btn-primary"
                                                  key="confirm" type="primary"
                                                  onClick={() => { setEdit(false); setShowCoachesModal(true) }}
                                             >

                                                  Add Coach
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
                                                  onClick={() => { setEdit(false); setShowCoachesModal(true) }}
                                             >

                                                  Add Coach
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
                                                       <label htmlFor="name" className="form-lable">Coach name</label>
                                                       <div className="form-group">
                                                            <input
                                                                 className="form-field"
                                                                 type="text"
                                                                 id="name"
                                                                 placeholder="Enter Coach Name"
                                                                 {...register('name')}
                                                            />
                                                       </div>
                                                  </div>
                                                  <div className="input-group">
                                                       <label htmlFor="language" className="form-lable">Languages</label>
                                                       <div className="form-group">
                                                            <Controller
                                                                 name="language"
                                                                 control={control}
                                                                 render={({ field }) => (
                                                                      <Select
                                                                           className="controller-select"
                                                                           components={animatedComponents}
                                                                           options={languageList}
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
                                                            onClearFilter()
                                                            handleOpenChange(false);

                                                       }}
                                                  >
                                                       Clear
                                                  </Button>

                                             </div>}
                                        </div>
                                   }


                                   <div style={{ position: "sticky" }}>
                                        {" "}
                                   </div>
                                   <Table
                                        columns={columns}
                                        data={data}
                                   />
                              </div>
                         </form>
                    </Card>
                    <CoachDetails
                         visible={showViewModal}
                         onCancel={handleCancel}
                         name="Coach Details"
                         row={rowdata}
                    />
                    <AddCoach
                         visible={showCoachesModal}
                         // onConfirm={onConfirm}
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
                         name="Coach"
                    />
               </div >

          </Fragment >
     );
};
export default Coaches;
