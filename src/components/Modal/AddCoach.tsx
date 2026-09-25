import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { Controller, useForm } from 'react-hook-form';
import * as Constants from "../../components/apiFile/Constants";
import { createCoach, createOfferAPI, editCoach } from '../apiFile/Service';
import JoditEditor from "jodit-react";
import { Icon } from "@iconify-icon/react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { float } from 'aws-sdk/clients/cloudfront';
import languageList from '../Languages/Languages';
import { useSelector } from 'react-redux';


interface formModal {
     name: string,
     languages: any,
     days: any,
     start_time: string,
     end_time: string,
     mobileno: any,
     email: string,
     experience: any,
     sport_type: any,
     signature_shot: string,
     video: any,
     city: any,
     venues: any,
     image: any,
     bio: string,
     extra_info: string,
     approved: boolean
}

const AddCoach = ({ visible, onCancel, row, edit, facilityList, setRow, setEdit, getAllData }) => {
     const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails);
     const form = useForm({
          defaultValues: {
               name: "",
               languages: [],
               days: [],
               start_time: "",
               end_time: "",
               mobileno: "",
               email: "",
               experience: 0,
               sport_type: [],
               signature_shot: "",
               video: "",
               city: [],
               venues: {},
               image: "",
               bio: "",
               extra_info: "",
               approved: false
          }
     })
     const { register, handleSubmit, control, reset, formState, watch } = form;
     const { errors } = formState;

     const startTime = watch('start_time');
     const endTime = watch('end_time');

     const customTitle = (
          <div className="custom-ant-modal-header">
               {edit ? 'Edit Coach' : 'Add Coach'}
          </div>
     );
     const editor = useRef(null);
     const [bio, setBio] = useState("")
     const [checkBio, setCheckBio] = useState(false)
     const [checkExtraInfo, setCheckExtraInfo] = useState(false)
     const [extraInfo, setExtraInfo] = useState("")
     const [previewImage, setPreviewImage] = useState('');
     const [previewVideo, setPreviewVideo] = useState('');
     const config = { placeholder: "Enter bio" }
     const loggedInUser = localStorage.getItem("auth");
     const animatedComponents = makeAnimated();
     const [citiesList, setCitiesList] = useState([]);
     const [facility, setfacility] = useState([]);
     // const [languageList, setLanguageList] = useState([]);          
     const weekdaysOptions: any = [
          { value: 1, label: "Monday" },
          { value: 2, label: "Tuesday" },
          { value: 3, label: "Wednesday" },
          { value: 4, label: "Thursday" },
          { value: 5, label: "Friday" },
          { value: 6, label: "Saturday" },
          { value: 7, label: "Sunday" }
     ]
     const languagesOptions: any = [
          { value: "English", label: "English" },
          { value: "Hindi", label: "Hindi" },
          { value: "Tamil", label: "Tamil" },
          { value: "Telugu", label: "Telugu" },
          { value: "Marathi", label: "Marathi" },
          { value: "Gujarati", label: "Gujarati" },
          { value: "Kannada", label: "Kannada" }
     ]
     const cityOptions: any = [
          { value: "Bengaluru", label: "Bengaluru" },
          { value: "Mumbai", label: "Mumbai" },
          { value: "Pune", label: "Pune" },
     ]
     const sportOptions = [
          { label: 'Padel', value: 'Padel' },
          { label: 'Pickleball', value: 'Pickleball', },
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

     const fileURLVideo = async (data, date) => {
          console.log(data);
          const params = {
               ACL: "public-read",
               Body: data[0],
               Bucket: `${Constants.S3_BUCKET}events`, // Adjust the bucket name as needed
               Key: `${date}_offerVideo_${data[0].name}`, // Adjust the key as needed
          };

          try {
               const uploadData = await Constants.myBucket.upload(params).promise();
               if (uploadData) {
                    console.log("Video uploaded successfully:", uploadData.Location);
                    // Do something with the uploaded video URL, if needed
                    return uploadData.Location;
               }
          } catch (error) {
               console.log("Error uploading video:", error);
               // Handle error appropriately
          }
     }

     const onSuccess = () => {
          reset({
               name: "",
               languages: [],
               days: [],
               start_time: "",
               end_time: "",
               mobileno: "",
               email: "",
               experience: 0,
               sport_type: [],
               signature_shot: "",
               video: "",
               city: [],
               venues: [],
               image: "",
               bio: "",
               extra_info: "",
          });
          setEdit(false);
          setPreviewImage('');
          onCancel();
          getAllData();
     }

     const onSubmit = async (data: formModal) => {
          console.log("🚀 ~ onSubmit ~ data:", data)
          data["bio"] = bio
          data["extra_info"] = extraInfo
          var date = Math.round(+new Date() / 1000);
          if (data.image.length > 0) {
               await fileURL(data.image, date)
               data.image = `${Constants.BaseLink}events/${date}_offerImage_${data.image[0].name}`;
          } else if (edit == true) {
               data.image = row.image
          } else {
               data.image = "NO Image Added"
          }

          if (data.video.length > 0) {
               await fileURLVideo(data.video, date)
               data.video = `${Constants.BaseLink}events/${date}_offerVideo_${data.video[0].name}`;
          } else if (edit == true) {
               data.video = row.video
          } else {
               data.video = "NO Video Added"
          }
          data.languages = data.languages?.map((item: any) => item.value)
          data.city = data.city?.map((item: any) => item.value)
          data.sport_type = data.sport_type?.map((item: any) => item.value)
          data.mobileno = parseInt(data?.mobileno)
          data.venues = data.venues?.map((newdata: any)=> newdata?.value)
          // if (typeof data.venues == 'object') {
          //      console.log('data.venues.value---------', data.venues.value)
          //      data.venues = [data.venues.value]
          // } else {
          //      data.venues = data.venues?.map((item: any) => item.value)
          // }
          console.log('====================================');
          console.log(data);
          console.log('====================================');

          if (getCharCount(bio) <= 0 || bio === "") {
               setCheckBio(true)
               return;
          } else {
               setCheckBio(false)
          }
          if (getCharCount(extraInfo) <= 0 || extraInfo == "") {
               setCheckExtraInfo(true)
               return;
          } else {
               setCheckExtraInfo(false)
          }
          var response
          if (edit == true) {
               data.approved = true;
               response = await editCoach(loggedInUser, row._id, data);
               console.log("edit")
               // data.mobileno = row.mobileno;
          } else {
               data.approved = true;
               response = await createCoach(loggedInUser, data);
          }
          if (response.statusCode == 0) {
               toast(<ToastMessage body={edit ? "Coach Updated Successfully" : "Coach Added Successfully"} type="success" />, {
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

     const getCities = () => {
          const raw = JSON.stringify({
               country: 'India',
          });
          const requestOptions: RequestInit = {
               method: 'POST',
               body: raw,
               redirect: 'follow',
               headers: {
                    'Content-Type': 'application/json'
               }
          };
          fetch("https://countriesnow.space/api/v0.1/countries/cities", requestOptions)
               .then(response => response.json())
               .then(result => {
                    console.log('====================================');
                    console.log(result);
                    console.log('====================================');

                    const cities = result.data.map(data => {
                         return { "label": data, "value": data }
                    });
                    setCitiesList(cities);
               }
               )
               .catch(error => console.log('error', error));
     };

     const getLanguages = () => {
          const raw = JSON.stringify({
               country: 'India',
          });
          const requestOptions: RequestInit = {
               method: 'get',
               redirect: 'follow',
               headers: {
                    'Content-Type': 'application/json'
               }
          };
          fetch("https://restcountries.com/v3/all", requestOptions)
               .then(response => response.json())
               .then(result => {
                    console.log('====================================');
                    console.log(result);
                    console.log('====================================');

                    const cities = result.data.map(data => {
                         return { "label": data, "value": data }
                    });
                    setCitiesList(cities);
               }
               )
               .catch(error => console.log('error', error));
     }

     useEffect(() => {
          getCities();
          getLanguages();
          if (edit == true) {
               setBio(row.bio);
               setExtraInfo(row.extra_info);
               reset({
                    "name": row.name,
                    "languages": row?.languages?.map(data => {
                         return { "label": data, "value": data }
                    }),
                    "days": row.days?.map(data => {
                         return data;
                    }),
                    "start_time": row?.start_time,
                    "end_time": row?.end_time,
                    "mobileno": row?.mobileno,
                    "email": row.email,
                    "experience": 0,
                    "sport_type": row.sport_type?.map(data => {
                         return { "label": data, "value": data }
                    }),
                    "signature_shot": row.signature_shot,
                    "video": row.video,
                    "city": row?.city?.map(data => {
                         return { "label": data, "value": data }
                    }),
                    "venues": row?.venues?.map(data => {
                         return { "label": data?.name, "value": data._id }
                    }),
                    "bio": row.bio,
                    "extra_info": row.extra_info
               })
          } else {
               setBio("");
               setExtraInfo("");
               reset({});
               setRow({})
               setPreviewImage('')
               reset({
                    name: "",
                    languages: [],
                    days: [],
                    start_time: "",
                    end_time: "",
                    mobileno: "",
                    email: "",
                    experience: 0,
                    sport_type: [],
                    signature_shot: "",
                    video: "",
                    city: [],
                    venues: [],
                    image: "",
                    bio: "",
                    extra_info: ""
               });
               if (loggedUserDetails?.roleId) {
                    reset({
                         "venues": { "label": facilityList[0]?.label, "value": facilityList[0]?.value }
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

     const onChangeVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (file) {
               const reader = new FileReader();
               reader.onloadend = () => {
                    const result = reader.result as string; // Ensure TypeScript recognizes it as a string
                    setPreviewVideo(result);
               };
               reader.readAsDataURL(file);

               const fileType = file.type;
               if (!fileType.startsWith('video/')) {
                    event.target.value = ''; // Clear input if the selected file is not a video
               }
          }
     };

     const handleDownloadVideo = () => {
          if (row.video) {
               // Create a temporary anchor element
               const anchor = document.createElement('a');
               anchor.href = row.video;
               anchor.download = 'video.mp4'; // Change the filename as needed
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

     const onSportTypeChange = (selectedOptions) => {
          let facilities = [];
          const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];

          let a: any = []
          facilityList.forEach((items: any) => {
               if (items.sport_type == 'all') {
                    a.push(items);
                    return false
               }
               var flag = false
               selectedValues.forEach(ele => {
                    if (items?.sport_type?.toUpperCase() == ele?.toUpperCase()) {
                         flag = true
                    }
               })
               if (flag != false) {
                    a.push(items)
               }
          });


          setfacility(a);
     };


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
                                   <label htmlFor="name" className="form-lable">Coach name<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="text"
                                             id="name"
                                             placeholder="Enter coach name"
                                             {...register('name', {
                                                  required: {
                                                       value: true,
                                                       message: 'Coach name is required',
                                                  },
                                                  pattern: {
                                                       value: /^[^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*$/,
                                                       message: 'Please enter a valid name with at least three alphabet characters',
                                                  },
                                             })}
                                        />
                                   </div>
                                   {errors?.name && (
                                        <span className="error-message">
                                             {errors.name.message}
                                        </span>
                                   )}
                              </div>
                              <div className="input-group">
                                   <label htmlFor="languages" className="form-lable">Languages<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="languages"
                                             control={control}
                                             rules={{
                                                  required: {
                                                       value: true,
                                                       message: "Languages is required",
                                                  },
                                             }}
                                             render={({ field }) => (
                                                  <Select
                                                       closeMenuOnSelect={false}
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       // defaultValue={[colourOptions[4], colourOptions[5]]}
                                                       isMulti
                                                       options={languageList}
                                                       {...field}
                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.languages && (
                                        <span className="error-message">
                                             {errors.languages.message}
                                        </span>
                                   )}
                              </div>
                              <div className="input-group">

                                   <label htmlFor="days">Days<span style={{ color: "red" }}>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="days"
                                             control={control}
                                             rules={{
                                                  required: {
                                                       value: true,
                                                       message: "Days are required",
                                                  },
                                             }}
                                             render={({ field }) => (
                                                  <Select
                                                       closeMenuOnSelect={false}
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       // defaultValue={[colourOptions[4], colourOptions[5]]}
                                                       isMulti
                                                       options={weekdaysOptions}
                                                       {...field}
                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.days && (
                                        <span className="error-message">
                                             {errors.days.message}
                                        </span>
                                   )}
                              </div>

                              <div className="form-container-grid col-span-2-lg">
                                   <div className="input-group">
                                        <label htmlFor="start_time" className="form-lable">Start time <span className='required-star'>*</span></label>
                                        <div className="form-group">
                                             <input
                                                  className="form-field"
                                                  type="time"
                                                  id="start_time"
                                                  placeholder="Start Time"
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
                                        <label htmlFor="start_time" className="form-lable">End time <span className='required-star'>*</span></label>

                                        <div className="form-group">
                                             <input
                                                  className="form-field"
                                                  type="time"
                                                  id="end_time"
                                                  placeholder="End Time"
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

                              <div className="input-group">
                                   <label htmlFor="mobileno">Phone Number<span className='required-star'>*</span></label>
                                   <div className="form-group">

                                        <input
                                             className="form-field"
                                             type="number"
                                             id="mobileno"
                                             placeholder="Enter phone number"
                                             {...register('mobileno', {
                                                  required: {
                                                       value: true,
                                                       message: 'Phone number is required',
                                                  },
                                                  pattern: {
                                                       value: /^\d{10}$/,
                                                       message: 'Please enter a valid 10-digit phone number',
                                                  },
                                             })}
                                        />

                                   </div>
                                   {errors?.mobileno && (
                                        <span className="error-message">
                                             {errors.mobileno.message}
                                        </span>
                                   )}
                              </div>

                              <div className="input-group">
                                   <label htmlFor="pincode" className="form-lable">Email ID</label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="text"
                                             id="email"
                                             placeholder="Enter email"
                                             {...register('email', {
                                                  pattern: {
                                                       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                                       message: 'Enter a valid email address',
                                                  },

                                             })}
                                        />

                                   </div>
                                   {errors?.email && (
                                        <span className="error-message">
                                             {errors.email.message}
                                        </span>
                                   )}
                              </div>

                              {/* <div className="input-group">
                                   <label htmlFor="pincode" className="form-lable">Experience<span className='required-star '>*</span>
                                   </label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="text"
                                             id="button_text"
                                             placeholder="Enter experience e.g. 12, 12.5"
                                             {...register('experience', {
                                                  required: {
                                                       value: true,
                                                       message: 'Experience year is required',
                                                  },
                                                  pattern: {
                                                       value: /^\d{1,2}(\.\d)?$/,
                                                       message: 'Please enter a valid experience of year e.g. 12, 12.5',
                                                  }
                                             })}
                                             style={{ borderColor: errors?.experience ? 'red' : 'initial' }}
                                        />
                                   </div>
                                   {errors?.experience && (
                                        <span className="error-message">
                                             {errors.experience.message}
                                        </span>
                                   )}
                              </div> */}

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
                                             render={({ field }) => (
                                                  <Select
                                                       closeMenuOnSelect={false}
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       defaultValue={row._id}
                                                       isMulti
                                                       options={sportOptions}
                                                       onChange={(selectedOptions) => {
                                                            field.onChange(selectedOptions); // Update react-hook-form state
                                                            onSportTypeChange(selectedOptions);
                                                       }}
                                                       value={field.value} // Ensure the value is passed from react-hook-form
                                                       name={field.name} // Ensure the name is passed from react-hook-form
                                                       ref={field.ref}
                                                  // {...field}
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

                                   <label className="form-lable" htmlFor="venues">Facility<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="venues"
                                             control={control}
                                             rules={{
                                                  required: {
                                                       value: true,
                                                       message: "Facility is required",
                                                  },
                                             }}
                                             render={({ field }) => (
                                                  <Select
                                                       closeMenuOnSelect={false}
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       defaultValue={row._id}
                                                       // defaultValue={[colourOptions[4], colourOptions[5]]}
                                                       isMulti
                                                       options={facility}                                                                                                            
                                                       {...field}

                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.venues && (
                                        <span className="error-message">
                                             {errors.venues.message}
                                        </span>
                                   )}
                              </div>



                              {/* <div className="input-group">
                                   <label htmlFor="signature_shot" className="form-lable">Signature shot<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="text"
                                             id="signature_shot"
                                             placeholder="Enter coach signature shot"
                                             {...register('signature_shot', {
                                                  required: {
                                                       value: true,
                                                       message: 'Coach signature shot is required',
                                                  },

                                             })}
                                        />
                                   </div>
                                   {errors?.signature_shot && (
                                        <span className="error-message">
                                             {errors.signature_shot.message}
                                        </span>
                                   )}
                              </div> */}

                              <div className="input-group">
                                   <label htmlFor="pincode" className="form-lable">Coach Image<span className='required-star '>*</span></label>
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
                              <div className="input-group">

                                   <label htmlFor="city" className="form-lable">Cities<span style={{ color: "red" }}>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="city"
                                             control={control}
                                             rules={{
                                                  required: {
                                                       value: true,
                                                       message: "City is required",
                                                  },
                                             }}
                                             render={({ field }) => (
                                                  <Select
                                                       closeMenuOnSelect={false}
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       // defaultValue={[colourOptions[4], colourOptions[5]]}
                                                       isMulti
                                                       options={citiesList}
                                                       {...field}
                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.city && (
                                        <span className="error-message">
                                             {errors.city.message}
                                        </span>
                                   )}
                              </div>

                              {(previewImage != "" || row.image) &&
                                   <div className="input-group col-span-2">
                                        <div className='label-pre'>
                                             <label htmlFor="myCheckbox"><strong>Image Preview</strong> </label>
                                             {(row.image && previewImage === "") && <button type="button" onClick={handleDownloadImage} className="pi-btn-primary"><div className="pi-btn-content"><Icon icon="material-symbols:download" width="16" height="16" style={{ color: "white" }} /></div></button>}

                                        </div>
                                        {previewImage !== "" ? <img src={previewImage} className="image-pre" /> : < img src={row.image} className="image-pre" />}
                                   </div>}
                              {/* {(previewImage != "" || row.image) &&
                            <div className="input-group">
                                <label htmlFor="myCheckbox">Image Preview (App event detail)</label>
                                {previewImage !== "" ? <img src={previewImage} className="image-preview-app-detail" /> : < img src={row.image} className="image-preview-app-detail" />}
                            </div>} */}
                              <div className="input-group col-span-2-lg">
                                   <label htmlFor="bio" className="form-lable">Bio<span className='required-star '>*</span></label>
                                   <div className="">
                                        <JoditEditor
                                             ref={editor}
                                             value={bio}
                                             onChange={(value) => {
                                                  setBio(value);
                                                  if (getCharCount(value) <= 0 || value === "") {
                                                       setCheckBio(true)
                                                  } else {
                                                       setCheckBio(false)
                                                  }
                                             }}
                                        />
                                   </div>
                                   {checkBio && (
                                        <span className="error-message">
                                             Bio is rquired
                                        </span>
                                   )}
                              </div>
                              <div className="input-group col-span-2-lg">
                                   <label htmlFor="extra_info" className="form-lable">Extra Info<span className='required-star '>*</span></label>
                                   <div className="">
                                        <JoditEditor
                                             ref={editor}
                                             value={extraInfo}
                                             onChange={(value) => {
                                                  setExtraInfo(value);
                                                  if (getCharCount(value) <= 0 || value === "") {
                                                       setCheckExtraInfo(true)
                                                  } else {
                                                       setCheckExtraInfo(false)
                                                  }
                                             }}
                                        />
                                   </div>
                                   {checkExtraInfo && (
                                        <span className="error-message">
                                             Extra Info is rquired
                                        </span>
                                   )}
                              </div>
                              <div className="input-group col-span-2-sm">
                                   <label htmlFor="pincode" className="form-lable">Coach Video</label>
                                   <div className="form-group">
                                        <input
                                             type="file"
                                             accept="video/mp4,video/x-m4v,video/*"
                                             // onChange={(e) => { fileURL(e.target.files) }}
                                             {...register("video")}
                                             // onChange={onChange}
                                             onChange={onChangeVideo}
                                             style={{ width: "100%" }}
                                        />
                                   </div>
                                   {errors?.video && (
                                        <span className="error-message">
                                             {errors.video.message}
                                        </span>
                                   )}
                              </div>
                         </div>
                         <Footer className='ant-modal-footer'>
                              <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset(); }}>Cancel</button>
                              <button type="submit" className="pi-btn-primary"> {edit ? 'Save Changes' : 'Add Coach'}</button>
                         </Footer>
                    </form>
               </div >
          </Modal >
     )
}

export default AddCoach