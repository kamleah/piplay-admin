import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux"
import { Card, Breadcrumb, Button, Radio, RadioChangeEvent } from "antd";
import { deleteCourt, deleteCourtTimePrice, filterClosingDays, filterCourt, filterCourtTimePrice, getAllClosingDays, getAllCoaches, getAllCourt, getAllCourtTimePrice, getFacilityApi, getFacilityByIdApi } from "../../../components/apiFile/Service";
import ToastMessage from "../ToastMessage/ToastMessage";
import { toast } from "react-toastify";
import _ from "lodash";
import { Icon } from "@iconify-icon/react";
import { Controller, useForm } from 'react-hook-form';
import Table from "../../../components/Table/DataTable";
import moment from "moment";
import { RiDeleteBin5Fill } from "react-icons/ri";
import DeleteConfirmation from "../../../components/Modal/DeleteConfirmation";
import CourtDetails from "../../../components/Modal/CourtDetails";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import AddCourt from "../../../components/Modal/AddCourt";
import Excel from "../../../components/Helpers/Excel";
import FilterData from "../../../components/Modal/FilterData";
import AddTimePrice from "../../../components/Modal/AddTimePrice";
import TimePriceDetails from "../../../components/Modal/TimePriceDetails";
import formatWeekdays from "../../../components/Helpers/formatWeekdays";
import StatusLabel from "../../../components/Labels/StatusLabel";
import AddClosingDay from "../../../components/Modal/AddClosingDay";
import ClosingDayDetails from "../../../components/Modal/ClosingDayDetails";



const ManageClosingDay = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {

     const moduleName = "Manage Closing Day"
     const [data, setData] = useState([]);
     const loggedInUser = localStorage.getItem("auth");
     const [showViewModal, setShowViewModal] = useState(false);
     const [rowdata, setRowdata] = useState({});
     const [facilityList, setFacilityList] = useState([]);
     const [courtList, setCourtList] = useState([]);
     const [showFormModal, setShowFormModal] = useState(false);
     const [edit, setEdit] = useState(false);
     const [copy, setCopy] = useState(false)
     const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
     const [deleteRowId, setDeleteRowId] = useState<string | null>(null);     
     const animatedComponents = makeAnimated();
     const { register, watch, setValue, reset, control } = useForm()

     const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)

     let facility_id = watch("facility_id");
     let court_id = watch("court_id");
     let facility_loc = watch("facility_loc");
     let sport_type = watch("sport_type");

     const columns = [
          {
               name: 'Facility Name',
               selector: row => row?.facility?.name,
               wrap: true,
               sortable: false,
          },
          {
               name: 'Facility Location',
               selector: row => row?.facility?.city ? `${row?.facility?.address},${row?.facility?.city}` : `${row?.facility?.address}`,
               sortable: true,
               wrap: true,
          },
          {
               name: 'Court Name',
               selector: row => row?.court?.name,
               sortable: true,
               wrap: true,
          },
          {
               name: 'Date',
               selector: row => row?.active_start_date,
               sortable: true,
               wrap: true,
          },
          {
               name: 'Sport Type',
               selector: row => row?.court?.game,
               sortable: true,
               wrap: true,
               cell: row => (<h4 className='capi'>{row?.court?.game}</h4>)
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
                         {/* {modulePermissionsData?.edit &&
                              <button className='action-button edit-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'edit') }}><Icon icon="mdi:pencil-outline" /></button>
                         } */}
                         {modulePermissionsData?.delete &&
                              <button onClick={(e) => { e.preventDefault(); handleDeleteModal(row._id) }} className='action-button delete-button'>
                                   <RiDeleteBin5Fill title="Delete" />
                              </button>
                         }
                         {modulePermissionsData?.add &&
                              <button type="button" className='action-button view-button' onClick={() => { setEdit(true); setCopy(true); setRowdata(row); setShowFormModal(true) }}>
                                   <Icon icon="ant-design:copy-filled" />
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
          let response = await deleteCourtTimePrice(loggedInUser, id);
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
          if (!loggedUserDetails?.roleId) {
               let venues = response?.result?.map(data => {
                    return { "label": data?.name + ', ' + data?.address, "value": data?._id, 'sport_type': data?.sport_type }
               });
               setFacilityList(venues);
          } else {
               const filteredFacilities = response?.result.filter(item => loggedUserDetails?.facilities.includes(item._id));
               let venues = filteredFacilities?.map(data => {
                    return { "label": data?.name + ', ' + data?.address, "value": data?._id, 'sport_type': data?.sport_type }
               });
               setFacilityList(venues);
               setValue('facility_id', { label: filteredFacilities[0]?.name, value: filteredFacilities[0]?._id });
          }
     };

     const getAllCourtsbyFacility = async (facility_id) => {
          setValue("court_id", null);

          let response = await filterCourt(loggedInUser, '', facility_id?.value ||   '' , '');

          let courts = response?.result?.map(data => {
               return { "label": data?.name, "value": data?._id }
          })
          setCourtList(courts);
     }


     const filterData = async (search, value) => {
          let sport = ''
          if (value == '') {
               sport = sport_type
          } else {
               sport = value
          }
          let response = await filterClosingDays(loggedInUser,
               loggedUserDetails?.roleId ? facility_id?.value ||   '' : facility_id?.value,
               court_id == undefined ? '' : court_id.value,
               sport == undefined || sport == 'all' ? '' : sport,
               facility_loc == undefined ? '' : facility_loc,
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
               name: '',
               facility_id: loggedUserDetails?.roleId ? facilityList[0] : null,
               sport_type: '',
               facility_loc: '',
               court_id: null,
          });
     }

     const options = [
          { label: 'All', value: 'all' },
          { label: 'Padel', value: 'padel' },
          { label: 'Pickleball', value: 'pickleball', },
     ];

     const onSportsChange = ({ target: { value } }: RadioChangeEvent) => {
          setValue('sport_type', value);
          filterData(true, value)
     };

     const getAllData = async () => {
          let response
          if (!loggedUserDetails?.roleId) {
               response = await getAllClosingDays(loggedInUser);
          } else {
               response = await filterClosingDays(loggedInUser, loggedUserDetails?.facility_id, "", "", "",);
          }
          setData(response?.result);          
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
                                   <label htmlFor="facility_id" className="form-lable">Facility</label>
                                   <div className="form-group">
                                        <Controller
                                             name="facility_id"
                                             control={control}
                                             render={({ field: { onChange, value }, field }) => (
                                                  <Select
                                                       // closeMenuOnSelect={false}
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                                                       // isMulti
                                                       options={facilityList}
                                                       placeholder="Select a facility"
                                                       onChange={(value) => {
                                                            onChange(value);
                                                            getAllCourtsbyFacility(value);
                                                       }}
                                                       value={value}
                                                  />
                                             )}
                                        />
                                   </div>
                              </div>
                              <div className="input-group">
                                   <label htmlFor="court_id" className="form-lable">Court</label>
                                   <div className="form-group">
                                        <Controller
                                             name="court_id"
                                             control={control}
                                             render={({ field }) => (
                                                  <Select
                                                       // closeMenuOnSelect={false}
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                                                       // isMulti
                                                       options={courtList}
                                                       placeholder="Select a Court"
                                                       {...field}
                                                  />
                                             )}
                                        />
                                   </div>
                              </div>
                              <div className="input-group">
                                   <label htmlFor="facility_loc" className="form-lable">Facility Location</label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="text"
                                             id="facility_loc"
                                             placeholder="address "
                                             {...register('facility_loc')}
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
                                        title: `${moduleName}`,
                                   }
                              ]}
                         />}
                         <form className="">
                              <div className="main-title-container">
                                   <div className="title-add-mobile">
                                        <h5 className="main-content-title">{`${moduleName}`}</h5>
                                        {matches && modulePermissionsData?.add &&
                                             <Button
                                                  className="pi-btn-primary"
                                                  key="confirm" type="primary"
                                                  onClick={() => { setEdit(false); setShowFormModal(true) }}
                                             >
                                                  Add
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
                                                       className="pi-btn-primary"
                                                       key="confirm" type="primary"
                                                       onClick={() => { setEdit(false); setShowFormModal(true) }}
                                                  >
                                                       Add Closing Day
                                                  </Button>
                                             }

                                             {modulePermissionsData?.export && data?.length > 0 &&
                                                  <Excel page={'manage_closing_day'} importdata={data} />
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
                                                       <label htmlFor="facility_id" className="form-lable">Facility</label>
                                                       <div className="form-group">
                                                            <Controller
                                                                 name="facility_id"
                                                                 control={control}
                                                                 render={({ field: { onChange, value }, field }) => (
                                                                      <Select
                                                                           // closeMenuOnSelect={false}
                                                                           className="controller-select"
                                                                           components={animatedComponents}
                                                                           defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                                                                           // isMulti
                                                                           options={facilityList}
                                                                           placeholder="Select a facility"
                                                                           onChange={(value) => {
                                                                                onChange(value);
                                                                                getAllCourtsbyFacility(value);

                                                                           }}
                                                                           value={value}
                                                                      />
                                                                 )}
                                                            />
                                                       </div>
                                                  </div>
                                                  <div className="input-group">
                                                       <label htmlFor="court_id" className="form-lable">Court</label>
                                                       <div className="form-group">
                                                            <Controller
                                                                 name="court_id"
                                                                 control={control}
                                                                 render={({ field }) => (
                                                                      <Select
                                                                           // closeMenuOnSelect={false}
                                                                           className="controller-select"
                                                                           components={animatedComponents}
                                                                           defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                                                                           // isMulti
                                                                           options={courtList}
                                                                           placeholder="Select a Court"
                                                                           {...field}
                                                                      />
                                                                 )}
                                                            />
                                                       </div>
                                                  </div>
                                                  <div className="input-group">
                                                       <label htmlFor="facility_loc" className="form-lable">Facility Location</label>
                                                       <div className="form-group">
                                                            <input
                                                                 className="form-field"
                                                                 type="text"
                                                                 id="facility_loc"
                                                                 placeholder="address "
                                                                 {...register('facility_loc')}
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
                    <ClosingDayDetails
                         visible={showViewModal}
                         onCancel={handleCancel}
                         name="Closing Days Details"
                         row={rowdata}
                    />
                    <AddClosingDay
                         visible={showFormModal}
                         onCancel={handleCancel}
                         row={rowdata}
                         edit={edit}
                         facilityList={facilityList}
                         setEdit={setEdit}
                         setRow={setRowdata}
                         getAllData={getAllData}
                         copy={copy}
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
export default ManageClosingDay;
