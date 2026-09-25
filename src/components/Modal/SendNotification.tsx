import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Modal, Radio, RadioChangeEvent } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { Controller, useForm } from 'react-hook-form';
import * as Constants from "../../components/apiFile/Constants";
import { createCourt, createPushnotification, editCourt, editNotification, RegisteredUserFilterAPI, facilityFilterAPI, getAllMatchesApi, getAllTournamentsAPI, getAllUsers, getEventsByVenuesAPI, getFacilityApi, getFacilityByIdApi, SendPushnotificationtoallUsers } from '../apiFile/Service';
import { Icon } from "@iconify-icon/react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import JoditEditor from 'jodit-react';
import moment from 'moment';
import { useSelector } from 'react-redux';

interface formModal {
     dateTime: string,
     scheduleDate: string,
     scheduleTime: string,
     title: string,
     description: string,
     redirectURL: string,
     imageURL: any,
     notificationType: string,
     expiry: string,
     status: any,
     activeDays: any,
     redirectType: any,
     admin : any,
}

interface Match {
     _id: string;
     booking_date: string;
     start_time: string;
     end_time: string;
}

const SendNotification = ({ visible, onCancel, row, edit, setRow, setEdit, getAllData, facilityList, }) => {
     const form = useForm({
          defaultValues: {
               dateTime: "",
               scheduleDate: "",
               scheduleTime: "",
               title: "",
               description: "",
               redirectURL: "",
               imageURL: "",
               notificationType: {},
               expiry: "",
               // status: {},
               // activeDays: '',
               // redirectType: {},
               user_ids: [],
               user_type: "",
               manually_users: "",
               manually_usersNumbers: "",
               notificationFor: { value: "", label: "" },
               redirectId: "",
               admin:true
          }
     })
     const { register, handleSubmit, control, reset, formState, watch, setValue } = form;
     const { errors } = formState;
     const editor = useRef(null);
     const [description, setdescription] = useState("")
     const [checkDescription, setCheckDescription] = useState(false)
     const [userList, setUserList] = useState([]);
     const [usersCurrentCityList, setUsersCurrentCityList] = useState([]);
     const [usersCityList, setUsersCityList] = useState([]);
     const [usersStateList, setUsersStateList] = useState([]);
     const [selectedUsers, setSelectedUsers] = useState([]);
     const [selectedCurrentCity, setSelectedCurrentCity] = useState([]);
     const [currentCityUsers, setCurrentCityUsers] = useState([]);
     const [cityUsers, setCityUsers] = useState([]);
     const [stateUsers, setStateUsers] = useState([]);
     const [selectedCity, setSelectedCity] = useState([]);
     const [selectedState, setSelectedState] = useState([]);
     const [Matches, setMatches] = useState([])
     // const selectedRedirectType = (watch('redirectType') as { value: any }).value;
     // console.log("selectedRedirectType---->", selectedRedirectType);
     const redirectURLValue = watch('redirectURL');
     const Notificationfor = watch('notificationFor')
     const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)

     // console.log("redirectURLValue---->", redirectURLValue);
     // if (selectedRedirectType == 'External') {
     //      if (typeof (redirectURLValue) == 'object') {
     //           console.log("redirectURLValue---->1");

     //           setValue('redirectURL', '')
     //      }
     // }
     // const selectedNotificationStatus = (watch('status') as { value: any }).value;
     // console.log("selectedNotificationStatus---->", selectedNotificationStatus);

     const customTitle = (
          <div className="custom-ant-modal-header">
               {edit ? 'Edit Notification' : 'Send Notification'}
          </div>
     );
     const [events, setEvents] = useState([])
     const [facilities, setFacilities] = useState([])
     const [notificationFor, setNotificationFor] = useState("");
     const [previewImage, setPreviewImage] = useState('');
     const loggedInUser = localStorage.getItem("auth");
     const animatedComponents = makeAnimated();

     const weekdaysOptions: any = [
          { value: 1, label: "Monday" },
          { value: 2, label: "Tuesday" },
          { value: 3, label: "Wednesday" },
          { value: 4, label: "Thursday" },
          { value: 5, label: "Friday" },
          { value: 6, label: "Saturday" },
          { value: 7, label: "Sunday" }
     ]

     const redirectOptions: any = [
          { value: "Internal", label: "Internal" },
          { value: "External", label: "External" },
     ];

     const screensOptions: any = [
          { value: "myEvents", label: "My Event" },
          { value: "AllEvent", label: "All Event" },
          { value: "home", label: "Home" },
          { value: "MyBookings", label: "My Bookings" },
          { value: "Accounts", label: "My Profile" },
          { value: null, label: "None" },
     ];

     const notificationTypeOptions: any = [
          { value: "In App", label: "In App" },
          { value: "Push Notification", label: "Push Notification" },
          { value: "Both", label: "Both" }
     ];

     const notificationforOption: any = [
          { value: "MATCH_CREATE_SUCCESSFUL", label: "Match Details" },
          { value: "FACILITY_DETAILS", label: "Facility Details" },
          { value: "EVENT_DETAILS", label: "Event Details" },
          { value: "OTHERS", label: "Others" }
     ]

     const StatusOptions: any = [
          { value: "Active", label: "Active" },
          { value: "Scheduled", label: "Scheduled" },
          // { value: "Expired", label: "Expired" },
     ];

     const fileURL = async (data: any, date: any) => {
          console.log("----data--->", data[0])
          const fileName = data[0].name;
          const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
          const params = {
               ACL: "public-read",
               Body: data[0],
               Bucket: `${Constants.S3_BUCKET}events`,
               Key: `pushnotificationImage_${date}${fileExtension}`,
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


     const onSubmit = async (data: any) => {
          console.log('data---------------', data)
          let scheduledDateTime;
          // if (data.scheduleDate) {
          //      scheduledDateTime = moment(`${data.scheduleDate}T${data.scheduleTime}`).format("YYYY-MM-DDTHH:mm:ss.00Z");
          // }
          // data.dateTime = (scheduledDateTime !== '' && scheduledDateTime !== undefined) ? new Date(scheduledDateTime) : new Date().toISOString();
          data.notificationType = data.notificationType.value;
          data.user_ids = Array.isArray(selectedUsers) ? selectedUsers.map((user: any) => user?.value) : [];
          const ManualUsers = data.manually_users
               ? data.manually_users.split(',').map((user: string) => user.trim())
               : [];
          const ManualUsersNo = data.manually_usersNumbers
               ? data.manually_usersNumbers.split(',').map((user: string) => user.trim())
               : [];
          console.log("manuals no", ManualUsersNo, data.manually_usersNumbers );

          const userIds = userList.filter((user: any) =>
               ManualUsersNo.includes(user?.mobileno)
           );

           // Extracting only the user.value
           const allUserValue = userIds.map((user: any) => user?.value);
           console.log(allUserValue);
           

          data.redirectURL = "home";
          data.notificationFor = data?.notificationFor?.value;
          data.user_ids = [...data.user_ids, ...ManualUsers, ...allUserValue];
          // data.redirectType = data.redirectType.value;
          // data.redirectURL = data.redirectType == "External" ? data.redirectURL : data.redirectURL.value;
          // data.status = data.status.value;


          const currentDateTime = (scheduledDateTime !== '' && scheduledDateTime !== undefined) ? new Date(scheduledDateTime) : new Date();

          // const hoursToAdd = 24 * Number(data.activeDays);
          // currentDateTime.setHours(currentDateTime.getHours() + hoursToAdd);

          // data.expiry = currentDateTime.toISOString();

          const payload: any = {
               description: data?.description,
               notificationFor: data?.notificationFor,
               notificationType: data?.notificationType,
               redirectURL: "Home",
               title: data?.title,
               user_ids: userType == "users" ? selectedUsers.map((user: any) => user?.value) : [...ManualUsers, ...allUserValue],
               admin: true
          }

          if (data.imageURL.length > 0) {
               var date = Math.round(+new Date() / 1000);
               await fileURL(data.imageURL, date)
               const fileExtension = data.imageURL[0].name.substring(data.imageURL[0].name.lastIndexOf('.'));
               payload.imageURL = `${Constants.BaseLink}events/pushnotificationImage_${date}${fileExtension}`;
          } else if (row.imageURL) {
               payload.imageURL = row.imageURL;
          } else {
               payload.imageURL = "";
          }

          if (data.notificationFor == 'EVENT_DETAILS') {
               payload.redirectId = data?.redirectId?.value;
          } else if (data.notificationFor == 'OTHERS') {
               payload.redirectId = "";
          } else {
               payload.redirectId = data?.redirectId?.value;
          }

          
          console.log('payload------', payload)
          var response;
          if (edit == true) {
               response = await editNotification(loggedInUser, row._id, data)
          } else {
               response = await SendPushnotificationtoallUsers(loggedInUser, payload)
          }

          if (response.code == "SUCCESS") {
               toast(<ToastMessage body={edit ? "Push Notification Updated Successfully" : "Push Notification Send Successfully"} type="success" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
               onSuccess();
          } else {
               toast(<ToastMessage body={edit ? "Error while updating push notification" : "Error while sending push notification"} type="warning" />, {
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

     const datetimeDifference = (startDate, endDate) => {
          const start = moment(startDate);
          const end = moment(endDate);

          if (!start.isValid() || !end.isValid()) {
               return "Invalid date";
          };

          return end.diff(start, 'days');
     };

     useEffect(() => {
          if (edit) {
               reset({
                    scheduleDate: row?.dateTime?.split('T')[0],
                    scheduleTime: moment(row?.dateTime).format("hh:mm"),
                    title: row.title,
                    description: row?.description,
                    redirectURL: row?.redirectURL?.includes("https") ? row.redirectURL : { label: row?.redirectURL, value: row?.redirectURL },
                    notificationType: { label: row.notificationType, value: row.notificationType },
                    expiry: row.expiry,
                    // status: { label: row.status, value: row.status },
                    // activeDays: datetimeDifference(row?.dateTime, row?.expiry).toString(),
                    // redirectType: { label: row?.redirectURL?.includes("https") ? "External" : "Internal", value: row?.redirectURL?.includes("https") ? "External" : "Internal" },
               })
          } else {
               setUsertype('all');
               setPreviewImage('');
               reset({});
               reset({
                    notificationType: '',
                    notificationFor: undefined,
                    user_type: "",
                    manually_users: "",
                    user_ids: []
                    // status: '',
                    // activeDays: '',
                    // redirectType: '',
               });
               setRow({})
               setSelectedUsers([])
               setSelectedCurrentCity([])
               setSelectedCity([])
               setStateUsers([])
               setEdit(false);
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

     const handleRemoveImage = () => {
          setPreviewImage("");
          setValue("imageURL", "");
     };


     const handleDownloadImage = () => {
          if (row.image) {
               const anchor = document.createElement('a');
               anchor.href = row.image;
               anchor.download = 'image.jpg';
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

     // const onSportChange = async (value) => {
     //      setValue("facilityId", "");
     //      let sport_type = value?.value
     //      let facilities = await facilityFilterAPI(loggedInUser, '', '', '',
     //           sport_type == undefined || sport_type == 'all' ? '' : sport_type, '',
     //      );
     //      console.log(facilities, "kkkkkddmm")

     //      if (facilities?.statusCode == 0) {
     //           facilities = facilities?.result?.map(data => {
     //                return { "label": data?.name, "location": `${data.address} ${data.city}`, "value": data?._id }
     //           })
     //           setFilteredFacilityList(facilities)
     //      } else {
     //           setFilteredFacilityList([]);
     //      }
     // }

     const [userType, setUsertype] = useState('all');


     const userTypeOptions = [
          { label: 'All Users', value: 'all' },
          { label: 'Select Users', value: 'users' },
          { label: 'Add Manually', value: 'manually' },
     ];

     const onUserTypeChange = ({ target: { value } }: RadioChangeEvent) => {
          setUsertype(value);
          setSelectedCurrentCity([]);
          setSelectedCity([]);
          setSelectedState([])
          setSelectedUsers([])
          setValue('manually_users', "");
     };

     const getUsers = async () => {
          let response = await getAllUsers(loggedInUser);
          let users = response?.data?.map((data) => {
               return {
                    label: `${data.firstname} ${data.lastname}`,
                    value: data?._id,
                    city: data?.city ? data?.city : "",
                    current_city: data?.current_city ? data?.current_city : "",
                    state: data?.state ? data?.state : "",
                    mobileno: data?.mobileno ? data?.mobileno.toString(): ""

               };
          });
          let userCurrentCityList = response?.data?.map((data) => {
               return {
                    label: data?.current_city ? data?.current_city : "NA (Current city not available)",
                    value: data?.current_city ? data?.current_city : "",
               };
          });
          let userCityList = response?.data?.map((data) => {
               return {
                    label: data?.city ? data?.city : "NA (City not available)",
                    value: data?.city ? data?.city : "",
               };
          });
          let usersStateList = response?.data?.map((data) => {
               return {
                    label: data?.state ? data?.state : "NA (State not available)",
                    value: data?.state ? data?.state : "",
               };
          });
          const uniqueCurrentCityList = userCurrentCityList.reduce((acc, current) => {
               if (!acc.find((city) => city.value === current.value)) {
                    acc.push(current);
               }
               return acc;
          }, []);
          const uniqueCityList = userCityList.reduce((acc, current) => {
               if (!acc.find((city) => city.value === current.value)) {
                    acc.push(current);
               }
               return acc;
          }, []);
          const uniqueStateList = usersStateList.reduce((acc, current) => {
               if (!acc.find((state) => state.value === current.value)) {
                    acc.push(current);
               }
               return acc;
          }, []);
          console.log("🚀 ~ file: SendNotification.tsx:378 ~ users ~ users:", users)
          setUserList(users);
          setUsersCurrentCityList(uniqueCurrentCityList)
          setUsersCityList(uniqueCityList)
          setUsersStateList(uniqueStateList)
     };
     const handleUserChange = (selectedOptions) => {
          setSelectedUsers(selectedOptions);
     };
     const handleCurrentCityChange = (selectedOptions) => {
          setSelectedCurrentCity(selectedOptions);
          const selectedCities = selectedOptions.map((option) => option.value);
          const usersByCity = userList.filter((user: any) =>
               selectedCities.includes(user?.current_city)
          );
          console.log(usersByCity);
          setCurrentCityUsers(usersByCity);
     };

     const handleCityChange = (selectedOptions) => {
          setSelectedCity(selectedOptions);
          const selectedCities = selectedOptions.map((option) => option.value);
          const usersByCity = userList.filter((user: any) =>
               selectedCities.includes(user?.city)
          );
          console.log(usersByCity);
          setCityUsers(usersByCity);
     };
     const handleStateChange = (selectedOptions) => {
          setSelectedState(selectedOptions);
          const selectedStates = selectedOptions.map((option) => option.value);
          const usersByState = userList.filter((user: any) =>
               selectedStates.includes(user?.state)
          );
          console.log(usersByState);
          setStateUsers(usersByState);
     };

     // Combine the users from both `currentCityUsers` and `cityUsers`
     useEffect(() => {
          const combinedUsers = [...currentCityUsers, ...cityUsers, ...stateUsers];
          setSelectedUsers(combinedUsers);
     }, [currentCityUsers, cityUsers, stateUsers]);


     const getTournaments = async () => {
          try {
               let response
               if (!loggedUserDetails?.roleId) {
                    response = await getAllTournamentsAPI(loggedInUser);
               } else {
                    response = await getEventsByVenuesAPI(loggedInUser, loggedUserDetails._id);
               }
               let venues = response?.result?.map(data => {
                    return { "label": data.tournament_name, "value": data?._id }
               })
               setEvents(venues)
          } catch (err) {
               console.log("===========>", err)
          }
     }

     const options = Matches?.map((item: Match) => ({
          label: `${item.booking_date} - ${item.start_time} to ${item.end_time}`,
          value: item._id
     }));

     const getAllMatches = async () => {
          const response = await getAllMatchesApi(loggedInUser)
          const filtermatch = response?.data?.filter(item => item?.match_mode == "public")
          setMatches(filtermatch)
     }
     const getAllFacility = async () => {
          let response = await getFacilityApi(loggedInUser);
          if (!loggedUserDetails?.roleId) {
               let venues = response?.result?.map(data => {
                    return { "label": data?.name + ', ' + data.address, "sport_type": data?.sport_type, "value": data?._id }
               });
               setFacilities(venues);
          } else {
               const filteredFacilities = response?.result.filter(item => loggedUserDetails?.facilities.includes(item._id));
               let venues = filteredFacilities?.map(data => {
                    return { "label": data?.name + ', ' + data.address, "sport_type": data?.sport_type, "value": data?._id }
               });
               setFacilities(venues);
          }
     };

     useEffect(() => {
          getUsers();
          getTournaments();
          getAllFacility();
          getAllMatches();
     }, [visible])

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
                                   <label htmlFor="title" className="form-lable" >Title<span className='required-star'>*</span></label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="text"
                                             placeholder="Enter title"
                                             {...register("title", {
                                                  required: {
                                                       value: true,
                                                       message: "Title is required",
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
                                   <label htmlFor="description" className="form-lable" >Description<span className='required-star'>*</span></label>
                                   <div className="form-group">
                                        <textarea
                                             className="form-field"
                                             placeholder="Enter Description "
                                             {...register("description", {
                                                  required: {
                                                       value: true,
                                                       message: "Description is required",
                                                  },
                                             })}
                                        />
                                   </div>
                                   {errors?.description && (
                                        <span className="error-message">
                                             {errors.description.message}
                                        </span>
                                   )}
                              </div>

                              <div className="input-group">
                                   <label className="form-lable" htmlFor="notificationType">Notification Type <span className='required-star'>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="notificationType"
                                             control={control}
                                             rules={{ required: 'Notification Type is required' }}
                                             render={({ field: { onChange, value }, field }) => (
                                                  <Select
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       defaultValue={row._id}
                                                       options={notificationTypeOptions}
                                                       {...field}
                                                       value={value}
                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.notificationType && (
                                        <span className="error-message">
                                             {errors.notificationType.message}
                                        </span>
                                   )}
                              </div>
                              <div className="input-group">
                                   <label className="form-lable" htmlFor="notificationType">Notification for <span className='required-star'>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="notificationFor"
                                             control={control}
                                             rules={{ required: 'Notification Type is required' }}
                                             render={({ field: { onChange, value }, field }) => (
                                                  <Select
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       // defaultValue={row._id}
                                                       options={notificationforOption}
                                                       {...field}
                                                  // value={value}
                                                  // onChange={(selectedOption) => {
                                                  //           onChange(selectedOption.value);
                                                  //      setNotificationFor(selectedOption.value); // Set notification type
                                                  // }}
                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.notificationFor && (
                                        <span className="error-message">
                                             {errors.notificationFor.message}
                                        </span>
                                   )}
                              </div>
                              {Notificationfor?.value == 'EVENT_DETAILS' &&
                                   (
                                        <div className="input-group">
                                             <label className="form-lable" htmlFor="sport_type">Event<span className='required-star '>*</span></label>
                                             <div className="form-group">
                                                  <Controller
                                                       name="redirectId"
                                                       control={control}
                                                       render={({ field: { onChange, value }, field }) => (
                                                            <Select
                                                                 // closeMenuOnSelect={false}
                                                                 className="controller-select"
                                                                 components={animatedComponents}
                                                                 defaultValue={row._id}
                                                                 options={events}
                                                                 {...field}
                                                                 value={value}
                                                            />
                                                       )}
                                                  />
                                             </div>
                                        </div>
                                   )
                              }

                              {Notificationfor?.value == "FACILITY_DETAILS" &&
                                   (
                                        <div className="input-group">
                                             <label className="form-lable" htmlFor="sport_type">Facilities<span className='required-star '>*</span></label>
                                             <div className="form-group">
                                                  <Controller
                                                       name="redirectId"
                                                       control={control}
                                                       render={({ field: { onChange, value }, field }) => (
                                                            <Select
                                                                 // closeMenuOnSelect={false}
                                                                 className="controller-select"
                                                                 components={animatedComponents}
                                                                 defaultValue={row._id}
                                                                 options={facilities}
                                                                 {...field}
                                                                 value={value}
                                                            />
                                                       )}
                                                  />
                                             </div>
                                        </div>
                                   )
                              }

                              {Notificationfor?.value == "MATCH_CREATE_SUCCESSFUL" &&
                                   (
                                        <div className="input-group">
                                             <label className="form-lable" htmlFor="sport_type">Match Details<span className='required-star '>*</span></label>
                                             <div className="form-group">
                                                  <Controller
                                                       name="redirectId"
                                                       control={control}
                                                       render={({ field: { onChange, value }, field }) => (
                                                            <Select
                                                                 // closeMenuOnSelect={false}
                                                                 className="controller-select"
                                                                 components={animatedComponents}
                                                                 defaultValue={row._id}
                                                                 options={
                                                                      Matches?.map((item: Match) => ({
                                                                           label: `${item.booking_date}  ${item.start_time} to ${item.end_time}`,
                                                                           value: item._id
                                                                      }))
                                                                 }
                                                                 {...field}
                                                                 value={value}
                                                            />
                                                       )}
                                                  />
                                             </div>
                                        </div>
                                   )
                              }
                              {/* <div className="input-group">
                                   <label htmlFor="redirectURL" className="form-lable" >Redirect URL<span className='required-star'>*</span></label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="text"
                                             placeholder="Enter Redirect URL"
                                             {...register("redirectURL", {
                                                  required: {
                                                       value: selectedRedirectType == 'External',
                                                       message: "Redirect URL is required",
                                                  },
                                                  pattern: {
                                                       value: /^(https?:\/\/)?(www\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9#]+\/?)*$/,
                                                       message: 'Please enter a valid website URL (e.g., https://www.example.com)',
                                                  },
                                             })}
                                        />
                                   </div>
                                   {errors?.redirectURL && (
                                        <span className="error-message">
                                             {errors.redirectURL.message}
                                        </span>
                                   )}
                              </div> */}
                              {/* <div className="input-group">
                                   <label className="form-lable" htmlFor="redirectType">Redirect Type<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="redirectType"
                                             control={control}
                                             rules={{
                                                  required: {
                                                       value: true,
                                                       message: "Redirection type is required",
                                                  },
                                             }}
                                             render={({ field: { onChange, value }, field }) => (
                                                  <Select
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       defaultValue={row._id}
                                                       options={redirectOptions}
                                                       {...field}
                                                       value={value}
                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.redirectType && (
                                        <span className="error-message">
                                             {errors.redirectType.message}
                                        </span>
                                   )}
                              </div>                             


                              {selectedRedirectType == 'Internal' && <div className="input-group">
                                   <label className="form-lable" htmlFor="redirectURL">Redirect URL<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="redirectURL"
                                             control={control}
                                             rules={{
                                                  required: {
                                                       value: true,
                                                       message: "Redirect URL type is required",
                                                  },
                                             }}
                                             render={({ field: { onChange, value }, field }) => (
                                                  <Select
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       defaultValue={row._id}
                                                       options={screensOptions}
                                                       {...field}
                                                       value={value}
                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.redirectURL && (
                                        <span className="error-message">
                                             {errors.redirectURL.message}
                                        </span>
                                   )}
                              </div>}

                              {selectedRedirectType == 'External' && <div className="input-group">
                                   <label htmlFor="redirectURL" className="form-lable" >Redirect URL<span className='required-star'>*</span></label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="text"
                                             placeholder="Enter Redirect URL"
                                             {...register("redirectURL", {
                                                  required: {
                                                       value: selectedRedirectType == 'External',
                                                       message: "Redirect URL is required",
                                                  },
                                                  pattern: {
                                                       value: /^(https?:\/\/)?(www\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9#]+\/?)*$/,
                                                       message: 'Please enter a valid website URL (e.g., https://www.example.com)',
                                                  },
                                             })}
                                        />
                                   </div>
                                   {errors?.redirectURL && (
                                        <span className="error-message">
                                             {errors.redirectURL.message}
                                        </span>
                                   )}
                              </div>} */}

                              {/* <div className="input-group">
                                   <label className="form-lable" htmlFor="redirectURL">Status<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="status"
                                             control={control}
                                             rules={{
                                                  required: {
                                                       value: true,
                                                       message: "Status URL type is required",
                                                  },
                                             }}
                                             render={({ field: { onChange, value }, field }) => (
                                                  <Select
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       defaultValue={row._id}
                                                       options={StatusOptions}
                                                       {...field}
                                                       value={value}
                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.status && (
                                        <span className="error-message">
                                             {errors.status.message}
                                        </span>
                                   )}
                              </div> */}




                              {/* {selectedNotificationStatus == 'Scheduled' && <div className="form-container-grid col-span-2-lg">
                                   <div className="input-group">
                                        <label htmlFor="dateTime" className="form-lable">Date<span className='required-star'>*</span></label>
                                        <div className="form-group">
                                             <input
                                                  className="form-field"
                                                  type="date"
                                                  id="scheduleDate"
                                                  placeholder="Start time"
                                                  min={new Date().toISOString().split('T')[0]}
                                                  {...register('scheduleDate', {
                                                       // required: {
                                                       //      value: true,
                                                       //      message: 'Date is required',
                                                       // },

                                                  })}
                                             />
                                        </div>
                                        {errors?.dateTime && (
                                             <span className="error-message">
                                                  {errors.dateTime.message}
                                             </span>
                                        )}
                                   </div>
                                   <div className="input-group">
                                        <label htmlFor="dateTime" className="form-lable">time <span className='required-star'>*</span></label>
                                        <div className="form-group">
                                             <input
                                                  className="form-field"
                                                  type="time"
                                                  id="scheduleTime"
                                                  placeholder="End time"
                                                  {...register('scheduleTime', {
                                                       // required: {
                                                       //      value: true,
                                                       //      message: 'End time is required',
                                                       // },

                                                  })}
                                             />
                                        </div>
                                        {errors?.dateTime && (
                                             <span className="error-message">
                                                  {errors.dateTime.message}
                                             </span>
                                        )}
                                   </div>
                              </div>}

                              <div className="input-group">
                                   <label htmlFor="activeDays" className="form-lable" >No. of Active Days<span className='required-star'>*</span></label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="number"
                                             placeholder="Enter activeDays"
                                             {...register("activeDays", {
                                                  required: {
                                                       value: true,
                                                       message: "No of Active days is required",
                                                  },
                                             })}
                                        />
                                   </div>
                                   {errors?.activeDays && (
                                        <span className="error-message">
                                             {errors.activeDays.message}
                                        </span>
                                   )}
                              </div> */}

                              <div className="input-group">
                                   <label htmlFor="imageURL" className="form-lable">Image</label>
                                   <div className="form-group">
                                        <input
                                             type="file"
                                             accept="image/x-png,image/gif,image/jpeg"
                                             {...register("imageURL", {})}
                                             onChange={onChange}
                                             style={{ width: "100%" }}
                                        />
                                   </div>
                                   {errors?.imageURL && (
                                        <span className="error-message">
                                             {errors.imageURL.message}
                                        </span>
                                   )}
                              </div>

                              {(previewImage !== "" || row.imageURL) &&
                                   <div className="input-group col-span-2" style={{ position: "relative" }}>
                                        <div className="label-pre">
                                             <label htmlFor="myCheckbox"><strong>Image Preview</strong></label>
                                             {(row.imageURL && previewImage === "") &&
                                                  <button type="button" onClick={handleDownloadImage} className="pi-btn-primary">
                                                       <div className="pi-btn-content">
                                                            <Icon icon="material-symbols:download" width="16" height="16" style={{ color: "white" }} />
                                                       </div>
                                                  </button>
                                             }
                                        </div>

                                        <Icon icon='bitcoin-icons:cross-filled' />
                                        <span
                                             onClick={handleRemoveImage}
                                             style={{
                                                  position: "absolute",
                                                  right: "206px",
                                                  backgroundColor: "red",
                                                  color: "white",
                                                  cursor: "pointer",
                                                  padding: "5px 10px 5px 10px",
                                                  borderRadius: "50%",
                                                  fontWeight: "bold"
                                             }}
                                        >
                                             &times;
                                        </span>

                                        {previewImage !== "" ? (
                                             <img src={previewImage} className="image-pre-court" />
                                        ) : (
                                             <img src={row.imageURL} className="image-pre-court" />
                                        )}
                                   </div>
                              }



                              {/* <div className="input-group col-span-2-lg">
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
                              </div> */}

                              <div className="input-group col-span-2">
                                   <label className="form-lable">User Type<span style={{ color: "red" }}>*</span></label>
                                   <div className="form-radio-group" style={{ backgroundColor: '#fff' }}>
                                        <Radio.Group
                                             options={userTypeOptions}
                                             {...register('user_type')}
                                             onChange={onUserTypeChange}
                                             value={userType || 'all'}
                                        />
                                   </div>
                                   {errors?.user_type && (
                                        <span className="error-message">
                                             {errors.user_type.message}
                                        </span>
                                   )}
                              </div>

                              {userType == "users" &&
                                   <>
                                        <div className="input-group">
                                             <label htmlFor="users">Select users by current city</label>
                                             <div className="form-group">
                                                  <Select
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       isMulti
                                                       options={usersCurrentCityList}
                                                       value={selectedCurrentCity}
                                                       onChange={handleCurrentCityChange}
                                                  />
                                             </div>
                                        </div>
                                        <div className="input-group">
                                             <label htmlFor="users">Select users by city</label>
                                             <div className="form-group">
                                                  <Select
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       isMulti
                                                       options={usersCityList}
                                                       value={selectedCity}
                                                       onChange={handleCityChange}
                                                  />
                                             </div>
                                        </div>
                                        <div className="input-group">
                                             <label htmlFor="users">Select users by State</label>
                                             <div className="form-group">
                                                  <Select
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       isMulti
                                                       options={usersStateList}
                                                       value={selectedState}
                                                       onChange={handleStateChange}
                                                  />
                                             </div>
                                        </div>

                                        <div className="input-group  col-span-2">
                                             <label htmlFor="users">Select Users <b> ({selectedUsers.length} Users)</b></label>
                                             <div className="form-group">
                                                  <Controller
                                                       name="user_ids"
                                                       control={control}
                                                       render={({ field }) => (
                                                            <Select
                                                                 closeMenuOnSelect={false}
                                                                 className="controller-select"
                                                                 components={animatedComponents}
                                                                 isMulti
                                                                 options={userList}
                                                                 {...field}
                                                                 value={selectedUsers}
                                                                 onChange={handleUserChange}
                                                            />
                                                       )}
                                                  />
                                             </div>
                                        </div>
                                   </>
                              }

                              {userType == "manually" &&
                                   <>
                                        <div className="input-group">
                                             <label htmlFor="manually_users" className="form-lable">
                                                  Add Manually
                                             </label>
                                             <div className="form-group">
                                                  <input
                                                       className="form-field"
                                                       type="search"
                                                       placeholder="Add User's ID, separated by commas"
                                                       {...register("manually_users")}
                                                  />
                                             </div>
                                             {errors?.manually_users && (
                                                  <span className="error-message">
                                                       {errors.manually_users.message}
                                                  </span>
                                             )}
                                        </div>
                                        <div className="input-group">
                                             <label htmlFor="manually_usersNumbers" className="form-lable">
                                                  <br />
                                             </label>
                                             <div className="form-group">
                                                  <input
                                                       className="form-field"
                                                       type="search"
                                                       placeholder="Add Numbers, separated by commas"
                                                       {...register("manually_usersNumbers")}
                                                  />
                                             </div>
                                             {errors?.manually_users && (
                                                  <span className="error-message">
                                                       {errors.manually_users.message}
                                                  </span>
                                             )}
                                        </div>

                                   </>
                              }

                         </div>
                         <Footer className='ant-modal-footer'>
                              <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset(); }}>Cancel</button>
                              <button type="submit" className="pi-btn-primary"> {edit ? 'Save Changes' : 'Send Notification'}</button>
                         </Footer>
                    </form>
               </div >
          </Modal >
     )
}

export default SendNotification