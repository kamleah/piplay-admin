import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Tooltip } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { Controller, useForm } from 'react-hook-form';
import * as Constants from "../../components/apiFile/Constants";
import { createCourtTimePrice, editCourt, editCourtTimePrice, facilityFilterAPI, filterCourt } from '../apiFile/Service';
import { Icon } from "@iconify-icon/react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { useSelector } from 'react-redux';

interface formModal {
     facility_id: any,
     court_id: any,
     start_time: any,
     end_time: any,
     break_start_time: any,
     break_end_time: any,
     active_days: any,
     active_start_date: any,
     active_end_date: any,
     slot_size: any,
     slot_price: any,
     extend: any,
     reschedule: any,
     r_rules: any,
     r_conditions: any[],
     r_condition_time: any,
     r_condition_percentage: any,
     flat_charge: any,
     game: any,
}

interface Condition {
     time: string;
     percentage: string;
}

const AddTimePrice = ({ visible, onCancel, row, edit, setRow, setEdit, getAllData, copy, facilityList }) => {       
     const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
     const form = useForm({
          defaultValues: {
               facility_id: {},
               court_id: {},
               start_time: '',
               end_time: '',
               break_start_time: '',
               break_end_time: '',
               active_days: '',
               active_start_date: '',
               active_end_date: '',
               slot_size: '',
               slot_price: '',
               extend: {},
               reschedule: { label: '', value: '' },
               r_rules: { label: '', value: '' },
               r_conditions: [],
               r_condition_time: '',
               r_condition_percentage: '',
               flat_charge: '',
               game: {},
          }
     })
     const { register, handleSubmit, control, reset, formState, watch, setValue } = form;
     const { errors } = formState;
     const startTime = watch('start_time');
     const endTime = watch('end_time');
     const breakStartTime = watch('break_start_time');
     const breakEndTime = watch('break_end_time');
     const activeStartDate = watch('active_start_date');
     const activeEndDate = watch('active_end_date');
     const rescheduleType = watch('reschedule');
     const rescheduleRule = watch('r_rules');
     const rcTime = watch('r_condition_time');
     const rcPercentage = watch('r_condition_percentage');
     const facilityId = watch('facility_id');
     const game = watch('game');

     const customTitle = (
          <div className="custom-ant-modal-header">
               {edit == true ? copy == true ? "Add Court Timing and Pricing" : "Edit Court Timing and Pricing" : "Add Court Timing and Pricing"}
          </div>
     );
     const [filteredCourtList, setFilteredCourtList] = useState([]);
     const [previewImage, setPreviewImage] = useState('');
     const [editRule, setEditRule] = useState(false);
     const [rConditionsArray, setRConditionsArray] = useState<Condition[]>([]);
     const loggedInUser = localStorage.getItem("auth");
     const animatedComponents = makeAnimated();
     const sportOptions = [
          { label: 'Padel', value: 'Padel' },
          { label: 'Pickleball', value: 'Pickleball', },
     ];
     const rescheduleOptions = [
          { label: 'No Reschedule', value: 'No Reschedule' },
          { label: 'Free Reschedule', value: 'Free Reschedule', },
          { label: 'Reshedule With Rule', value: 'Reshedule With Rule', },
     ];
     const rescheduleRuleOptions = [
          { label: 'Flat Charge', value: 'Flat Charge' },
          { label: '1st Reschedule is free', value: '1st Reschedule is free', },
          { label: 'Before Time % Charged', value: 'Before Time % Charged', },
     ];
     const extendOptions = [
          { label: 'Yes', value: true },
          { label: 'No', value: false, },
     ];

     const weekdaysOptions: any = [
          { value: 1, label: "Monday" },
          { value: 2, label: "Tuesday" },
          { value: 3, label: "Wednesday" },
          { value: 4, label: "Thursday" },
          { value: 5, label: "Friday" },
          { value: 6, label: "Saturday" },
          { value: 7, label: "Sunday" }
     ]

     const fileURL = async (data, date) => {
          console.log(data)
          const params = {
               ACL: "public-read",
               Body: data[0],
               Bucket: `${Constants.S3_BUCKET}events`,
               Key: `${date}_offerImage_${data[0].name}`,
          };
          Constants.myBucket.upload(params, function (err, uploadData) {
               if (uploadData) {
                    data = uploadData?.sport_type;
                    return;
               } else {
                    console.log("error", err);
               }
          });
     }

     const onSubmit = async (data: formModal) => {                    
          data.facility_id = data.facility_id.value
          data.slot_size = parseInt(facilityList.filter(item => item.value == data.facility_id)[0]?.slot_size)
          data.court_id = data.court_id.value
          data.extend = data.extend.value
          data.reschedule = data.reschedule.value
          data.slot_price = parseFloat(data?.slot_price)
          data.flat_charge = parseInt(data?.flat_charge)
          data.r_rules = data?.r_rules?.value || ''
          data.r_conditions = rConditionsArray
          let response
          if (edit == false) {
               response = await createCourtTimePrice(loggedInUser, data);
          }
          else if (edit == true && copy == true) {
               response = await createCourtTimePrice(loggedInUser, data);
           }
           else {
               response = await editCourtTimePrice(loggedInUser, row._id, data);
          }
          if (response.statusCode == 0) {
               toast(<ToastMessage  body={
                    edit == true && copy == true
                        ? "Court Timing and Pricing Created Successfully"
                        : edit == true ? "Court Timing and Pricing Edited Successfully" : "Court Timing and Pricing Created Successfully"
                } type="success" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
               onSuccess();
          } else if (response.statusCode == "Court creation limit reached.") {
               toast(<ToastMessage body={response.statusCode} type="warning" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
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
          setPreviewImage('');
          onCancel();
          getAllData();
     }

     useEffect(() => {
          if (edit) {               
               reset({
                    facility_id: { "label": row?.facility?.name, "value": row?.facility?._id },
                    court_id: { "label": row?.court?.name, "value": row?.court?._id },
                    start_time: row?.start_time,
                    end_time: row?.end_time,
                    break_start_time: row?.break_start_time,
                    break_end_time: row?.break_end_time,
                    active_days: row.active_days?.map(data => {
                         return data;
                    }),
                    active_start_date: row?.active_start_date,
                    active_end_date: row?.active_end_date,
                    // slot_size: row?.slot_size,
                    slot_price: row?.slot_price,
                    extend: { label: row?.extend ? 'Yes' : 'No', value: row?.extend },
                    reschedule: { label: row?.reschedule, value: row?.reschedule },
                    r_rules: { label: row?.r_rules, value: row?.r_rules },
                    r_conditions: row?.r_conditions,
                    r_condition_time: '',
                    r_condition_percentage: '',
                    flat_charge: row?.flat_charge,
                    game: { label: row?.court?.game, value: row?.court?.game }

               })
               setRConditionsArray(row?.r_conditions)
          } else {                        
               setPreviewImage('');
               reset({});
               reset({                    
                    facility_id: '',
                    court_id: '',
                    active_days: '',
                    flat_charge: '',
                    extend: '',
                    reschedule: { label: 'Select..', value: '' },
                    game:'',                                                
               });
               setRConditionsArray([]);
               setRow({})
               setEdit(false);

               if (loggedUserDetails?.roleId) {
                    reset({
                         "facility_id": { "label": facilityList[0]?.label, "value": facilityList[0]?.value }
                    })
               }

          }
     }, [visible])

     const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (file) {
               const reader = new FileReader();
               reader.onloadend = () => {
                    const result = reader.result as string; // Ensure TypeScript recognizes it as a string
                    setPreviewImage(result);
               };
               reader.readAsDataURL(file);

               const fileType = file.type;
               if (!fileType.startsWith('image/')) {
                    event.target.value = ''; // Clear input if the selected file is not an image
               }
          }
     };
     const handleDownloadImage = () => {
          if (row.image) {
               // Create a temporary anchor element
               const anchor = document.createElement('a');
               anchor.href = row.image;
               anchor.download = 'image.jpg'; // Change the filename as needed
               anchor.click();
          }
     };

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
                    return { "label": data?.name, "value": data?._id, "slot_size": data?.slot_size }
               })
               setFilteredCourtList(response);
          } else {
               setFilteredCourtList([]);
          }
     }

     const submitRule = () => {
          console.log('Submitting rule...');
          console.log('rcTime:', rcTime);          
          console.log('rcPercentage:', rcPercentage);

          if (rcTime && rcPercentage) {
               const newCondition: Condition = {
                    time: rcTime,
                    percentage: rcPercentage
               };
               const updatedConditions = [...rConditionsArray, newCondition];
               setRConditionsArray(updatedConditions);
               setValue("r_condition_time", '');
               setValue("r_condition_percentage", '');
          } else {
               console.log('rcTime or rcPercentage is empty.');
          }
     };

     const handleRule = (item, index, mode) => {
          if (mode === 'delete') {
               const updatedConditions = [...rConditionsArray];
               updatedConditions.splice(index, 1);
               setRConditionsArray(updatedConditions);
          } else if (mode === 'edit') {
               const updatedConditions = [...rConditionsArray];
               updatedConditions[index] = item;
               setRConditionsArray(updatedConditions);
          }
     }


     const customStyles = {
          valueContainer: (provided) => ({
               ...provided,
               maxHeight: '30px',
               overflowY: 'auto',
               padding: '0',
          })
     };

     return (
          <Modal
               title={customTitle}
               visible={visible}
               width={"800px"}
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
                              <div className="input-group col-span-2-sm">
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
                                                       options={facilityList}
                                                       {...field}
                                                       onChange={(value) => {
                                                            onChange(value);
                                                            filterCourts(value, game);
                                                            if (value.sport_type != 'all') {
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
                              <div className="input-group col-span-2-sm">
                                   <label className="form-lable" htmlFor="active_days">Active Days<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="active_days"
                                             control={control}
                                             rules={{
                                                  required: {
                                                       value: true,
                                                       message: "Active Days is required",
                                                  },
                                             }}
                                             render={({ field: { onChange, value }, field }) => (
                                                  <Select
                                                       styles={customStyles}
                                                       closeMenuOnSelect={false}
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       defaultValue={row._id}
                                                       // defaultValue={[colourOptions[4], colourOptions[5]]}
                                                       isMulti
                                                       options={weekdaysOptions}
                                                       {...field}
                                                       // value={value}
                                                       onChange={(value) => {
                                                            onChange(value);
                                                       }}
                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.active_days && (
                                        <span className="error-message">
                                             {errors.active_days.message}
                                        </span>
                                   )}
                              </div>
                              <div className="form-container-grid col-span-2-lg">
                                   <div className="input-group">
                                        <label htmlFor="active_start_date" className="form-lable">Court Start Date <span className='required-star'>*</span>
                                             <Tooltip
                                                  title={<>
                                                       <div>Court Timing and Pricing will be Applied in app from activation start date as you select in activation date</div>
                                                  </>
                                                  } placement="right" color='#032037'>
                                                  <Icon icon="ion:information-circle" className="input-info-icon" />
                                             </Tooltip>
                                        </label>
                                        <div className="form-group">
                                             <input
                                                  className="form-field"
                                                  type="date"
                                                  id="active_start_date"
                                                  placeholder="Start time"
                                                  min={edit ? '' : new Date().toISOString().split('T')[0]}
                                                  max={activeEndDate}
                                                  {...register('active_start_date', {
                                                       required: {
                                                            value: true,
                                                            message: 'Active Start Date is required',
                                                       },

                                                  })}
                                             />
                                        </div>
                                        {errors?.active_start_date && (
                                             <span className="error-message">
                                                  {errors.active_start_date.message}
                                             </span>
                                        )}
                                   </div>
                                   <div className="input-group">
                                        <label htmlFor="active_end_date" className="form-lable">Court End Date <span className='required-star'>*</span>
                                             <Tooltip
                                                  title={<>
                                                       <div>Court Timing and Pricing will be Applied in app from activation start date as you select in activation date</div>
                                                  </>
                                                  } placement="right" color='#032037'>
                                                  <Icon icon="ion:information-circle" className="input-info-icon" />
                                             </Tooltip>
                                        </label>
                                        <div className="form-group">
                                             <input
                                                  className="form-field"
                                                  type="date"
                                                  id="active_end_date"
                                                  placeholder="End time"
                                                  min={activeStartDate}
                                                  {...register('active_end_date', {
                                                       required: {
                                                            value: true,
                                                            message: 'Active End Date is required',
                                                       },

                                                  })}
                                             />
                                        </div>
                                        {errors?.active_end_date && (
                                             <span className="error-message">
                                                  {errors.active_end_date.message}
                                             </span>
                                        )}
                                   </div>
                              </div>

                              <div className="form-container-grid col-span-2-lg">
                                   <div className="input-group">
                                        <label htmlFor="start_time" className="form-lable">Start time <span className='required-star'>*</span></label>
                                        <div className="form-group">
                                             <input
                                                  className="form-field"
                                                  type="time"
                                                  id="start_time"
                                                  placeholder="Start time"
                                                  max={endTime}
                                                  {...register('start_time', {
                                                       required: {
                                                            value: true,
                                                            message: 'Start time is required',
                                                       },

                                                  })}
                                             />
                                        </div>
                                        {errors?.start_time && (
                                             <span className="error-message">
                                                  {errors.start_time.message}
                                             </span>
                                        )}
                                   </div>
                                   <div className="input-group">
                                        <label htmlFor="start" className="form-lable">End time <span className='required-star'>*</span></label>
                                        <div className="form-group">
                                             <input
                                                  className="form-field"
                                                  type="time"
                                                  id="end_time"
                                                  placeholder="End time"
                                                  min={startTime}
                                                  {...register('end_time', {
                                                       required: {
                                                            value: true,
                                                            message: 'End time is required',
                                                       },

                                                  })}
                                             />
                                        </div>
                                        {errors?.end_time && (
                                             <span className="error-message">
                                                  {errors.end_time.message}
                                             </span>
                                        )}
                                   </div>
                              </div>
                              <div className="form-container-grid col-span-2-lg">
                                   <div className="input-group">
                                        <label htmlFor="break_start_time" className="form-lable">Break Start Time<span className='required-star'>*</span></label>
                                        <div className="form-group">
                                             <input
                                                  className="form-field"
                                                  type="time"
                                                  id="break_start_time"
                                                  placeholder="Start time"
                                                  min={startTime}
                                                  max={breakEndTime}
                                                  {...register('break_start_time', {
                                                       required: {
                                                            value: true,
                                                            message: 'Break Start time is required',
                                                       },

                                                  })}
                                             />
                                        </div>
                                        {errors?.break_start_time && (
                                             <span className="error-message">
                                                  {errors.break_start_time.message}
                                             </span>
                                        )}
                                   </div>
                                   <div className="input-group">
                                        <label htmlFor="break_end_time" className="form-lable">Break End Time<span className='required-star'>*</span></label>
                                        <div className="form-group">
                                             <input
                                                  className="form-field"
                                                  type="time"
                                                  id="break_end_time"
                                                  placeholder="Break End time"
                                                  max={endTime}
                                                  min={breakStartTime}
                                                  {...register('break_end_time', {
                                                       required: {
                                                            value: true,
                                                            message: 'Break end time is required',
                                                       },

                                                  })}
                                             />
                                        </div>
                                        {errors?.break_end_time && (
                                             <span className="error-message">
                                                  {errors.break_end_time.message}
                                             </span>
                                        )}
                                   </div>
                              </div>

                              <div className="input-group">
                                   <label htmlFor="slot_price" className="form-lable">Slot Price<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="number"
                                             id="slot_price"
                                             step="0.01"
                                             placeholder="Enter slot price"
                                             {...register("slot_price", {
                                                  required: {
                                                       value: true,
                                                       message: 'Slot price is required',
                                                  },

                                             })}
                                        />
                                   </div>
                                   {errors?.slot_price && (
                                        <span className="error-message">
                                             {errors.slot_price.message}
                                        </span>
                                   )}
                              </div>

                              <div className="input-group">
                                   <label className="form-lable" htmlFor="extend">Extend Slots<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="extend"
                                             control={control}
                                             rules={{
                                                  required: {
                                                       value: true,
                                                       message: "Extend slots is required",
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
                                                       options={extendOptions}
                                                       {...field}
                                                       value={value}
                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.extend && (
                                        <span className="error-message">
                                             {errors.extend.message}
                                        </span>
                                   )}
                              </div>
                              <div className="input-group">
                                   <label className="form-lable" htmlFor="reschedule">Reschedule Type<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="reschedule"
                                             control={control}
                                             rules={{
                                                  required: {
                                                       value: true,
                                                       message: "Reschedule type is required",
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
                                                       options={rescheduleOptions}
                                                       {...field}
                                                       value={value}
                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.reschedule && (
                                        <span className="error-message">
                                             {errors.reschedule.message}
                                        </span>
                                   )}
                              </div>
                              {rescheduleType?.value === rescheduleOptions[2]?.value && <div className="input-group">
                                   <label className="form-lable" htmlFor="r_rules">Reschedule Rule<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="r_rules"
                                             control={control}
                                             rules={{
                                                  required: {
                                                       value: rescheduleType?.value === rescheduleOptions[2]?.value,
                                                       message: "Reschedule rule is required",
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
                                                       options={rescheduleRuleOptions}
                                                       {...field}
                                                       value={value}
                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.r_rules && (
                                        <span className="error-message">
                                             {errors.r_rules.message}
                                        </span>
                                   )}
                              </div>}
                              {(rescheduleType?.value === rescheduleOptions[2]?.value && (rescheduleRule?.value === rescheduleRuleOptions[1].value || rescheduleRule?.value === rescheduleRuleOptions[2].value)) &&
                                   <>
                                        <div className="form-container-grid col-span-2 border-top-bottom-dashed ">
                                             <div className="input-group">
                                                  <label htmlFor="r_condition_time" className="form-lable">Rescheduling Cut-Off Time</label>
                                                  <div className="form-group">
                                                       <input
                                                            className="form-field"
                                                            type="number"
                                                            id="r_condition_time"
                                                            placeholder="Enter time in hrs"
                                                            {...register("r_condition_time")}
                                                       />
                                                  </div>
                                                  {errors?.r_condition_time && (
                                                       <span className="error-message">
                                                            {errors.r_condition_time.message}
                                                       </span>
                                                  )}
                                             </div>
                                             <div className="input-group">
                                                  <label htmlFor="r_condition_percentage" className="form-lable">Penalty in % After Cut-Off Time</label>
                                                  <div className="form-group">
                                                       <input
                                                            className="form-field"
                                                            type="number"
                                                            id="r_condition_percentage"
                                                            placeholder="Enter percentage for time"
                                                            {...register("r_condition_percentage")}
                                                       />
                                                  </div>
                                                  {errors?.r_condition_percentage && (
                                                       <span className="error-message">
                                                            {errors.r_condition_percentage.message}
                                                       </span>
                                                  )}
                                             </div>
                                             <div className="input-group col-span-2 justify-center">
                                                  <button type="button" className="pi-btn-primary" onClick={() => submitRule()} > {editRule ? 'Save Changes' : 'Add Rule'}</button>
                                             </div>
                                             <div className="input-group col-span-2 justify-center">
                                                  <div className="compact-table-container">

                                                       <table className="compact-table last-child-end">
                                                            <thead>
                                                                 <tr>
                                                                      <th>Reschedule Rule (in hrs)</th>
                                                                      <th>Reschedule Condition</th>
                                                                      <th>Actions</th>
                                                                 </tr>
                                                            </thead>
                                                            <tbody>
                                                                 {rConditionsArray?.map((item: any, index) => {                                                                                                                                          
                                                                      return (
                                                                           <tr key={index}>
                                                                                <td>{item?.time} hrs</td>
                                                                                <td>{item?.percentage} %</td>
                                                                                <td>
                                                                                     <div className='action-button-container'>
                                                                                          {/* <button className='action-button edit-button' onClick={(e) => { e.preventDefault(); handleRule(item, index, 'edit') }}><Icon icon="mdi:pencil-outline" /></button> */}
                                                                                          <button onClick={(e) => { e.preventDefault(); handleRule(item, index, 'delete') }} className='action-button delete-button'>
                                                                                               <RiDeleteBin5Fill title="Delete" />
                                                                                          </button>
                                                                                     </div >
                                                                                </td>
                                                                           </tr>
                                                                      )
                                                                 })

                                                                 }
                                                                 {rConditionsArray?.length === 0 &&
                                                                      <tr >
                                                                           <td colSpan={3} className='text-center'>No Rules Added</td>
                                                                      </tr>}
                                                            </tbody>
                                                       </table>
                                                  </div>
                                             </div>
                                        </div>

                                   </>
                              }
                              {(rescheduleType?.value === rescheduleOptions[2]?.value && rescheduleRule?.value === rescheduleRuleOptions[0].value) && <div className="input-group">
                                   <label htmlFor="flat_charge" className="form-lable">Flat charge<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="number"
                                             id="flat_charge"
                                             placeholder="Enter slot size"
                                             {...register("flat_charge", {
                                                  required: {
                                                       value: rescheduleRule?.value === rescheduleRuleOptions[0].value,
                                                       message: 'Flat charge is required',
                                                  },

                                             })}
                                        />
                                   </div>
                                   {errors?.flat_charge && (
                                        <span className="error-message">
                                             {errors.flat_charge.message}
                                        </span>
                                   )}
                              </div>}
                         </div>
                         <Footer className='ant-modal-footer'>
                              <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset(); }}>Cancel</button>
                              <button type="submit" className="pi-btn-primary"> {edit == true ? copy == true ? "Add Court Timing and Pricing" : "Save Court Timing and Pricing" : "Add Court Timing and Pricing"}</button>
                         </Footer>
                    </form>
               </div >
          </Modal >
     )
}

export default AddTimePrice