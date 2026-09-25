import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { Controller, useForm } from 'react-hook-form';
import * as Constants from "../../components/apiFile/Constants";
import { createClosingDays, createCourtTimePrice, editCourt, editCourtTimePrice, facilityFilterAPI, filterCourt } from '../apiFile/Service';
import { Icon } from "@iconify-icon/react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { toDate } from 'date-fns';
import { useSelector } from 'react-redux';

interface formModal {
     facility_id: any,
     court_id: any,
     date: any,
     game: any,
}

const AddClosingDay = ({ visible, onCancel, row, copy, edit, setRow, setEdit, getAllData, facilityList, }) => {     
     const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
     const form = useForm({
          defaultValues: {
               facility_id: {},
               court_id: {},
               date: '',
               game: {},
          }
     })
     const { register, handleSubmit, control, reset, formState, watch, setValue } = form;
     const { errors } = formState;
     const facilityId = watch('facility_id');
     const game = watch('game');

     const customTitle = (
          <div className="custom-ant-modal-header">
               {edit == true ? copy == true ? "Add Court Timing and Pricing" : "Edit Court Timing and Pricing" : "Add Court Timing and Pricing"}
          </div>
     );
     const [filteredCourtList, setFilteredCourtList] = useState([]);
     const loggedInUser = localStorage.getItem("auth");
     const animatedComponents = makeAnimated();

     const sportOptions = [
          { label: 'Padel', value: 'Padel' },
          { label: 'Pickleball', value: 'Pickleball', },
     ];

     const onSubmit = async (data: formModal) => {                            
          data.facility_id = data.facility_id.value
          data.court_id = data.court_id.value          
          var response;
          if (edit == false) {
               response = await createClosingDays(loggedInUser, data);
          }
          else if (edit == true && copy == true) {
             
               response = await createClosingDays(loggedInUser, data);
          }
          else {
               response = await editCourtTimePrice(loggedInUser, row._id, data);
          }
          if (response.statusCode == 0) {
               toast(<ToastMessage body={
                    edit == true && copy == true
                         ? "Court Closing Day Created Successfully"
                         : edit == true ? "Court Closing Day Edited Successfully" : "Court Closing Day Created Successfully"
               } type="success" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
               onSuccess();
          } else {
               toast(<ToastMessage body={"Something went wrong"} type="warning" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
          }
     }


     const onSuccess = () => {
          reset();
          setEdit(false);
          onCancel();
          getAllData();
     }
     function capitalizeFirstLetter(string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
      }
     useEffect(() => {
          if (edit) {
               reset({
                    facility_id: { "label": row?.facility?.name, "value": row?.facility?._id },
                    court_id: { "label": row?.court?.name, "value": row?.court?._id },
                    date: row?.date,
                    game: { label: capitalizeFirstLetter(row?.court?.game), value: row?.court?.game }
               })
          } else {
               reset({
                    facility_id: '',
                    court_id: '',
                    date: '',
                    game: '',
               });
               setRow({})
               setEdit(false);

               if (loggedUserDetails?.roleId) {
                    reset({
                         "facility_id": { "label": facilityList[0]?.label, "value": facilityList[0]?.value }
                    })
               }

          }
     }, [visible])

     const stripHtmlTags = (html) => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          return doc.body.textContent || "";
     }

     const getCharCount = (content) => {
          const textOnlyContent = stripHtmlTags(content);
          return textOnlyContent.length;
     }

     const filterCourts = async (facilityId, game) => {
          setValue("court_id", '');
          let response = await filterCourt(loggedInUser, '', facilityId?.value || '', game?.value || '');

          if (response?.statusCode == 0) {
               response = response?.result?.map(data => {
                    return { "label": data?.name, "value": data?._id }
               })
               setFilteredCourtList(response);
          } else {
               setFilteredCourtList([]);
          }
     }

     return (
          <Modal
               title={customTitle}
               visible={visible}
               // onOk={onConfirm}
               width={"50%"}
               onCancel={() => {
                    onCancel();
                    reset();
               }}
               footer={null}
               className="custom-ant-modal lable-content-width"
          >
               <div className="form-container">
                    <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
                         <div className="form-container-grid border-bottom-light">
                              <div className="input-group">
                                   <label className="form-lable" htmlFor="facilityId">Facility Name<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="facility_id"
                                             control={control}
                                             rules={{
                                                  required: {
                                                       value: true,
                                                       message: "Facility name is required",
                                                  },
                                             }}
                                             render={({ field: { onChange, value }, field }) => (
                                                  <Select
                                                       // closeMenuOnSelect={false}
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       defaultValue={row._id}
                                                       // defaultValue={[colourOptions[4], colourOptions[5]]}
                                                       // isMulti
                                                       options={facilityList}
                                                       {...field}
                                                       onChange={(value) => {
                                                            onChange(value);
                                                            filterCourts(value, game);
                                                            if (value.sport_type.toLowerCase() != 'all') {
                                                                 setValue('game', sportOptions.filter(data => data.value.toUpperCase() == value.sport_type.toUpperCase())[0])
                                                            }
                                                       }}
                                                       value={value}
                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.facility_id && (
                                        <span className="error-message">
                                             {errors.facility_id.message}
                                        </span>
                                   )}
                              </div>
                              {/* <div className="input-group">
                                   <label htmlFor="location">Facility Location <span style={{ color: "red" }}>*</span></label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="text"
                                             placeholder="Enter Facility Location "
                                             {...register("facility_loc", {
                                                  required: {
                                                       value: true,
                                                       message: "Facility Location is required",
                                                  },

                                             })}
                                        />
                                   </div>
                                   {errors?.facility_loc && (
                                        <span className="error-message">
                                             {errors.facility_loc.message}
                                        </span>
                                   )}
                              </div> */}
                              <div className="input-group">
                                   <label className="form-lable" htmlFor="game">Sport type<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="game"
                                             control={control}
                                             rules={{
                                                  required: {
                                                       value: true,
                                                       message: "Sport type is required",
                                                  },
                                             }}
                                             render={({ field: { onChange, value }, field }) => (
                                                  <Select
                                                       // closeMenuOnSelect={false}
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       defaultValue={row._id}
                                                       // defaultValue={[colourOptions[4], colourOptions[5]]}
                                                       // isMulti
                                                       options={sportOptions}
                                                       {...field}
                                                       onChange={(value) => {
                                                            onChange(value);
                                                            filterCourts(facilityId, value);
                                                       }}
                                                       value={value}
                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.game && (
                                        <span className="error-message">
                                             {errors.game.message}
                                        </span>
                                   )}
                              </div>
                              <div className="input-group">
                                   <label className="form-lable" htmlFor="type">Court Name<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="court_id"
                                             control={control}
                                             rules={{
                                                  required: {
                                                       value: true,
                                                       message: "Court name is required",
                                                  },
                                             }}
                                             render={({ field: { onChange, value }, field }) => (
                                                  <Select
                                                       // closeMenuOnSelect={false}
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       defaultValue={row._id}
                                                       // defaultValue={[colourOptions[4], colourOptions[5]]}
                                                       // isMulti
                                                       options={filteredCourtList}
                                                       {...field}
                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.court_id && (
                                        <span className="error-message">
                                             {errors.court_id.message}
                                        </span>
                                   )}
                              </div>

                              <div className="input-group">
                                   <label htmlFor="date" className="form-lable">Date <span className='required-star'>*</span></label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="date"
                                             id="date"
                                             placeholder="Start time"
                                             min={new Date().toISOString().split('T')[0]}
                                             {...register('date', {
                                                  required: {
                                                       value: true,
                                                       message: 'Date is required',
                                                  },

                                             })}
                                        />
                                   </div>
                                   {errors?.date && (
                                        <span className="error-message">
                                             {errors.date.message}
                                        </span>
                                   )}
                              </div>
                         </div>
                         <Footer className='ant-modal-footer'>
                              <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset(); }}>Cancel</button>
                              <button type="submit" className="pi-btn-primary"> {edit == true ? copy == true ? "Add Court Closing Day" : "Save Court Closing Day" : "Add Court Closing Day"}</button>
                         </Footer>
                    </form>
               </div >
          </Modal >
     )
}

export default AddClosingDay