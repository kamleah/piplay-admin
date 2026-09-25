import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { Controller, useForm } from 'react-hook-form';
import * as Constants from "../../components/apiFile/Constants";
import { createCoachingProgram, editCoachingProgram, facilityFilterAPI, filterCoach } from '../apiFile/Service';
import JoditEditor from "jodit-react";
import { Icon } from "@iconify-icon/react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { float } from 'aws-sdk/clients/cloudfront';


interface formModal {
     title: string,
     coach_id: any,
     start: string,
     end: string,
     sport_type: any,
     image: any,
     venue_id: any,
     description: string,
     tandc: string,
}

const AddCoachingProgram = ({ visible, onCancel, row, edit, facilityList, coachesList, setRow, setEdit, getAllData }) => {
     const form = useForm({
          defaultValues: {
               title: "",
               coach_id: {},
               start: "",
               end: "",
               sport_type: {},
               image: "",
               venue_id: {},
               description: "",
               tandc: "",
          }
     })
     const { register, handleSubmit, control, reset, formState, watch, setValue } = form;
     const { errors } = formState;
     const startDate = watch('start');
     const endDate = watch('end');

     const customTitle = (
          <div className="custom-ant-modal-header">
               {edit ? 'Edit Program' : 'Add Program'}
          </div>
     );
     const editor = useRef(null);
     const [description, setdescription] = useState("")
     const [checkDescription, setCheckDescription] = useState(false)
     const [checkTandc, setCheckTandc] = useState(false)
     const [filteredCoachesList, setFilteredCoachesList] = useState([])
     const [filteredFacilityList, setFilteredFacilityList] = useState([])
     const [tandc, setTandc] = useState("")
     const [previewImage, setPreviewImage] = useState('');
     const loggedInUser = localStorage.getItem("auth");
     const animatedComponents = makeAnimated();
     const sportOptions = [
          { label: 'Padel', value: 'padel' },
          { label: 'Pickleball', value: 'pickleball', },
     ];

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
                    data = uploadData.sport_type;
                    return;
               } else {
                    console.log("error", err);
               }
          });
     }

     const onSubmit = async (data: formModal) => {
          data["description"] = description
          data["tandc"] = tandc
          var date = Math.round(+new Date() / 1000);
          if (data.image.length > 0) {
               console.log('====================================');
               console.log("inside image length", data.image.length);
               console.log('====================================');
               await fileURL(data.image, date)
               data.image = `${Constants.BaseLink}events/${date}_offerImage_${data.image[0].name}`;
          } else if (edit == true) {
               data.image = row?.image
          } else {
               data.image = "NO Image Added"
          }
          data.coach_id = data?.coach_id?.value
          data.sport_type = data?.sport_type?.value
          data.venue_id = data?.venue_id?.value

          console.log('====================================');
          console.log(data);
          console.log('====================================');
          if (getCharCount(description) <= 0 || description == "") {
               setCheckDescription(true)
               return;
          } else {
               setCheckDescription(false)
          }
          if (getCharCount(tandc) <= 0 || tandc == "") {
               setCheckTandc(true)
               return;
          } else {
               setCheckTandc(false)
          }

          var response
          if (edit == true) {
               response = await editCoachingProgram(loggedInUser, row._id, data);
          } else {
               response = await createCoachingProgram(loggedInUser, data);
          }
          if (response.statusCode == 0) {
               toast(<ToastMessage body={edit ? "Coaching program Updated Successfully" : "Coaching program Added Successfully"} type="success" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
               onSuccess();
          } else {
               toast(<ToastMessage body={response.message} type="warning" />, {
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
               setdescription(row.description);
               setTandc(row.tandc);
               reset({
                    "title": row.title,
                    "coach_id": { label: row?.coach?.name, value: row?.coach?._id },
                    "start": row?.start,
                    "end": row?.end,
                    "sport_type": { label: row?.sport_type, value: row?.sport_type },
                    "venue_id": { label: row?.facility?.name, value: row?.facility?._id },
                    // "image": row.image,
                    "description": row.description,
                    "tandc": row.tandc,
               })
          } else {
               setdescription("");
               setTandc("");
               setPreviewImage('');
               reset({});
               reset({
                    "coach_id": "",
                    "venue_id": "",
                    "sport_type": "",
               });
               setRow({})
               setEdit(false);
               setCheckDescription(false)
               setCheckTandc(false)
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

     const onSportChange = async (value) => {
          setValue("coach_id", "");
          setValue("venue_id", "");
          let sport_type = value?.value;
          // let coaches = []
          let coaches = await filterCoach(loggedInUser, '', '', '', '', '', '',
               sport_type == undefined || sport_type == 'all' ? '' : sport_type[0]?.toUpperCase() + sport_type.slice(1), '', ''
          );
          let facilities = await facilityFilterAPI(loggedInUser, '', '', '',
               sport_type == undefined || sport_type == 'all' ? '' : sport_type, '', '');
          if (coaches?.statusCode == 0 && facilities?.statusCode == 0) {
               coaches = coaches?.result?.map(data => {
                    return { "label": data?.name, "value": data?._id }
               })
               facilities = facilities?.result?.map(data => {
                    return { "label": data?.name, "value": data?._id }
               });
               console.log("facilities--->", facilities);
               setFilteredCoachesList(coaches);
               setFilteredFacilityList(facilities)
          } else {
               setFilteredCoachesList([]);
               setFilteredFacilityList([]);

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
                                   <label htmlFor="title" className="form-lable">Title<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="text"
                                             id="title"
                                             placeholder="Enter program title"
                                             {...register("title", {
                                                  required: {
                                                       value: true,
                                                       message: 'Title is required',
                                                  },

                                             })}
                                        />
                                   </div>
                                   {errors?.title && (
                                        <span className="error-message">
                                             {errors.title.message}
                                        </span>
                                   )}
                              </div>
                              <div className="input-group">
                                   <label className="form-lable" htmlFor="sport_type">Sport type<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="sport_type"
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
                                                            onSportChange(value);
                                                       }}
                                                       value={value}
                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.sport_type && (
                                        <span className="error-message">
                                             {errors.sport_type.message}
                                        </span>
                                   )}
                              </div>

                              <div className="input-group">
                                   <label htmlFor="coach_id" className="form-lable">Coach<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="coach_id"
                                             control={control}
                                             defaultValue={row.coach_id}
                                             rules={{
                                                  required: {
                                                       value: true,
                                                       message: "Coach is required",
                                                  },
                                             }}
                                             render={({ field }) => (
                                                  <Select
                                                       // closeMenuOnSelect={false}
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       // isMulti
                                                       options={filteredCoachesList}
                                                       {...field}
                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.coach_id && (
                                        <span className="error-message">
                                             {errors.coach_id.message}
                                        </span>
                                   )}
                              </div>
                              <div className="input-group">
                                   <label className="form-lable" htmlFor="venue_id">Facility<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="venue_id"
                                             control={control}
                                             rules={{
                                                  required: {
                                                       value: true,
                                                       message: "Facility is required",
                                                  },
                                             }}
                                             render={({ field }) => (
                                                  <Select
                                                       // closeMenuOnSelect={false}
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       defaultValue={row._id}
                                                       // defaultValue={[colourOptions[4], colourOptions[5]]}
                                                       // isMulti
                                                       options={filteredFacilityList}
                                                       {...field}
                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.venue_id && (
                                        <span className="error-message">
                                             {errors.venue_id.message}
                                        </span>
                                   )}
                              </div>

                              <div className="form-container-grid col-span-2-lg">
                                   <div className="input-group">
                                        <label htmlFor="start_time" className="form-lable">Start date <span className='required-star'>*</span></label>
                                        <div className="form-group">
                                             <input
                                                  className="form-field"
                                                  type="date"
                                                  id="start"
                                                  placeholder="Start date"
                                                  min={edit ? '' : new Date().toISOString().split('T')[0]}
                                                  max={endDate}
                                                  {...register('start', {
                                                       required: {
                                                            value: true,
                                                            message: 'Start date is required',
                                                       },

                                                  })}
                                             />
                                        </div>
                                        {errors?.start && (
                                             <span className="error-message">
                                                  {errors.start.message}
                                             </span>
                                        )}
                                   </div>
                                   <div className="input-group">
                                        <label htmlFor="start" className="form-lable">End date <span className='required-star'>*</span></label>

                                        <div className="form-group">
                                             <input
                                                  className="form-field"
                                                  type="date"
                                                  id="end"
                                                  placeholder="End date"
                                                  min={startDate}
                                                  {...register('end', {
                                                       required: {
                                                            value: true,
                                                            message: 'End date is required',
                                                       },

                                                  })}
                                             />
                                        </div>
                                        {errors?.end && (
                                             <span className="error-message">
                                                  {errors.end.message}
                                             </span>
                                        )}
                                   </div>
                              </div>

                              <div className="input-group">
                                   <label htmlFor="pincode" className="form-lable">Program Image<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <input
                                             type="file"
                                             accept="image/x-png,image/gif,image/jpeg"
                                             // onChange={(e) => { fileURL(e.target.files) }}
                                             {...register("image", {
                                                  required: {
                                                       value: edit == true ? false : true,
                                                       message: "Coach image is required",
                                                  },
                                             })}
                                             // onChange={onChange}
                                             onChange={onChange}
                                             style={{ width: "100%" }}
                                        />
                                   </div>
                                   {errors?.image && (
                                        <span className="error-message">
                                             {errors.image.message}
                                        </span>
                                   )}
                              </div>
                              {(previewImage != "" || row.image) &&
                                   <div className="input-group col-span-2">
                                        <div className='label-pre'>
                                             <label htmlFor="myCheckbox"><strong>Image Preview</strong> </label>
                                             {(row.image && previewImage === "") && <button type="button" onClick={handleDownloadImage} className="pi-btn-primary"><div className="pi-btn-content"><Icon icon="material-symbols:download" width="16" height="16" style={{ color: "white" }} /></div></button>}

                                        </div>
                                        {previewImage !== "" ? <img src={previewImage} className="image-preview-app-card" /> : < img src={row.image} className="image-pre" />}
                                   </div>}


                              <div className="input-group col-span-2-lg">
                                   <label htmlFor="term" className="form-lable">description<span className='required-star '>*</span></label>
                                   <div className="">
                                        <JoditEditor
                                             ref={editor}
                                             value={description}
                                             onChange={(value) => {
                                                  setdescription(value);
                                                  if (getCharCount(value) <= 0 || value === "") {
                                                       setCheckDescription(true)
                                                  } else {
                                                       setCheckDescription(false)
                                                  }
                                             }}
                                        />

                                   </div>
                                   {checkDescription && (
                                        <span className="error-message">
                                             Description is rquired
                                        </span>
                                   )}
                              </div>
                              <div className="input-group col-span-2-lg">
                                   <label htmlFor="tandc" className="form-lable">Terms and Conditions<span className='required-star '>*</span></label>
                                   <div className="">
                                        <JoditEditor
                                             ref={editor}
                                             value={tandc}
                                             onChange={(value) => {
                                                  setTandc(value);
                                                  if (getCharCount(value) <= 0 || value == "") {
                                                       setCheckTandc(true)
                                                  } else {
                                                       setCheckTandc(false)
                                                  }
                                             }}
                                        />

                                   </div>
                                   {checkTandc && (
                                        <span className="error-message">
                                             Terms and Conditions is rquired
                                        </span>
                                   )}
                              </div>

                         </div>
                         <Footer className='ant-modal-footer'>
                              <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset(); }}>Cancel</button>
                              <button type="submit" className="pi-btn-primary"> {edit ? 'Save Changes' : 'Add Program'}</button>
                         </Footer>
                    </form>
               </div >
          </Modal >
     )
}

export default AddCoachingProgram