import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "antd";
import { Controller, useForm } from 'react-hook-form'
import "../css/style.css";
import { toast } from "react-toastify";
import ToastMessage from "../../page/facilator/ToastMessage/ToastMessage";
import { EditUserAPI, checkUsersFacilityAPI, getAllRolesByUserId } from "../apiFile/Service";
import { Footer } from "antd/es/layout/layout";
import { createAllAdminUsers } from "../apiFile/Service";
import moment from "moment";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useDispatch, useSelector } from "react-redux";
import { setAllRoles } from "../../redux/Slices/DataSlice";
import { json } from "react-router-dom";

const AddAdminUser = ({
     visible, name, onConfirm, onCancel, row, getAdminUsers, roles, venue, facilities, organizers
}) => {
     const form = useForm({
          defaultValues: {
               firstname: "",
               lastname: "",
               email: "",
               mobileno: "",
               password: "",
               gender: "",
               age_group: "",
               facility_id: "",
               organizerId: {},
               roleId: "",
               value: "",
               venue: ''
          }
     })
     const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
     const { register, handleSubmit, reset, setValue, formState, control } = form;
     const { errors } = formState;
     const animatedComponents = makeAnimated();
     const loggedInUser = localStorage.getItem("auth");
     const [data, setData] = useState([]);
     const dispatch = useDispatch();
     const customTitle = (
          <div className="custom-ant-modal-header">
               {row._id ? "Edit Admin User" : "Add Admin User"}
          </div>
     );
     const today = new Date().toISOString().split('T')[0];

     const onSubmit = async (data: any) => {

          console.log('data-------======before', data)

          if (loggedUserDetails.roleId) {
               data.facility_id = [loggedUserDetails.facility_id];
          } else {
               data.facilities = data.facility_id.length > 0 ? data.facility_id : [];
               data.facility_id = data.facility_id.length > 0 ? data.facility_id[0] : [];
          }
          console.log('data-------======', data)
          // return
          data.organizerId = data?.organizerId?.value
          let venues = []
          if (data?.venue?.length > 0) {
               venues = data.venue.map(item => { return item.value })
               data.venue = venues
          }
          var response
          if (row._id) {
               if (data.password == "" || data.password == undefined) {
                    delete data.password
               }
               response = await EditUserAPI(loggedInUser, row._id, data);
          } else {
               let errorrs = await checkUsersFacilityAPI(loggedInUser, loggedUserDetails.roleId ? loggedUserDetails.facility_id : data.facility_id)
               if (errorrs.result != 'Success') {
                    toast(<ToastMessage body={errorrs.result} type="error" />, {
                         position: "top-right",
                         autoClose: 5000,
                         hideProgressBar: true,
                         closeOnClick: true,
                         pauseOnHover: true,
                         draggable: true,
                    });
                    return
               }
               data.mobileno = Number(data?.mobileno)
               data.roles = "Admin"
               data.admin = true
               data.is_otp_verified = true
               data.age_group = moment(data.age_group).format('MM-DD-yyyy')
               response = await createAllAdminUsers(loggedInUser, data)
          }
          if (response.data?.err_code === "USER_ALREADY_EXIST" || response.data?.err_code === "USER_UPDATE_FAILED") {
               toast(<ToastMessage body={response.data?.err_code} type="warning" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
          } else if (response.code === 'SIGNUP_SUCCESS' || response?.code === "SUCCESS") {
               getAdminUsers();
               toast(<ToastMessage body={row._id ? "Admin User Updated Successfully" : "Admin User Added Successfully"} type="success" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
               reset();
               onCancel();
          } else {
               toast(<ToastMessage body={response.data?.err_code} type="warning" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
          }
     }

     useEffect(() => {
          setValue("venue", '')
          if (visible && name == "edit") {
               if (row.venue) {
                    row.venueIds = []
                    let flag = false
                    row.venue.map(data => {
                         venue.map(item => {
                              if (item.value == data) {
                                   row.venueIds.push(item)
                              }
                         })
                    })
               }
               reset({
                    'value': row.value,
                    "firstname": row.firstname,
                    "lastname": row.lastname,
                    "mobileno": row?.mobileno,
                    "age_group": moment(row.age_group).format('MM-DD-yyyy'),
                    "gender": row.gender,
                    "venue": row.venueIds?.map(e => {
                         return e;
                    }),
                    "organizerId": { label: organizers?.find((e: any) => e?.value == row?.organizerId)?.label, value: row?.organizerId },
                    "facility_id": row?.facility_id,
                    "email": row.email,
                    "roleId": row.roleId,
               });
          }
     }, [visible])

     return (
          <div>
               <Modal
                    // className="custom-ant-modal "
                    visible={visible}
                    title={customTitle}
                    onOk={onConfirm}
                    onCancel={() => {
                         onCancel();
                         reset();
                    }}
                    footer={null}
                    className="custom-ant-modal lable-content-width"
               >
                    <div className="form-container">
                         <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
                              <div className="form-container-grid border-bottom-light">
                                   <div className="input-group">

                                        <label htmlFor="firstname">First Name<span style={{ color: "red" }}>*</span></label>
                                        <div className="form-group">
                                             <input
                                                  type="text"
                                                  id="firstname"
                                                  placeholder="First Name"
                                                  {...register('firstname', {
                                                       required: {
                                                            value: true,
                                                            message: 'Firstname is required',
                                                       },
                                                       pattern: {
                                                            value: /^[^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*$/,
                                                            message: 'Please enter a valid first name with at least three alphabet characters',
                                                       },
                                                  })}
                                             />

                                        </div>
                                        {errors?.firstname && (
                                             <span className="error-message">
                                                  {errors.firstname.message}
                                             </span>
                                        )}
                                   </div>
                                   <div className="input-group">
                                        <label htmlFor="lastname">Last Name<span style={{ color: "red" }}>*</span></label>
                                        <div className="form-group">
                                             <input
                                                  type="text"
                                                  id="lastname"
                                                  placeholder="Last Name"
                                                  {...register('lastname', {
                                                       required: {
                                                            value: true,
                                                            message: 'Lastname is required',
                                                       },
                                                       pattern: {
                                                            value: /^[^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*$/,
                                                            message: 'Please enter a valid last name with at least three alphabet characters',
                                                       },
                                                  })}
                                             />

                                        </div>
                                        {errors?.lastname && (
                                             <span className="error-message">
                                                  {errors.lastname.message}
                                             </span>
                                        )}
                                   </div>
                                   {!row._id &&
                                        <>
                                             <div className="input-group">
                                                  <label htmlFor="emailId">Email ID<span style={{ color: "red" }}>*</span></label>
                                                  <div className="form-group">
                                                       <input
                                                            type="email"
                                                            id="email"
                                                            placeholder="email"
                                                            {...register('email', {
                                                                 required: {
                                                                      value: !row._id ? true : false,
                                                                      message: 'Email ID is required',
                                                                 },
                                                                 pattern: {
                                                                      value: /^[a-zA-Z0-9._%+-]*[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                                      message: 'Invalid email format. Please enter a valid email address.',
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
                                        </>
                                   }
                                   <div className="input-group">
                                        {row._id ? <label htmlFor="password">Change Password</label>
                                             : <label htmlFor="password">Password<span style={{ color: "red" }}>*</span></label>
                                        }
                                        <div className="form-group">
                                             <input
                                                  type="text"
                                                  id="password"
                                                  placeholder="Enter Password"
                                                  {...register('password', {
                                                       required: {
                                                            value: !row._id ? true : false,
                                                            message: "Password is required"
                                                       },
                                                       pattern: {
                                                            value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&*])[A-Za-z][A-Za-z\d@#$%^&*]{7,}$/,
                                                            message: "Password must be at least 8 characters long, with an uppercase letter, a lowercase letter, a number, and a special character."
                                                       }
                                                  })}
                                             />
                                        </div>
                                        {errors?.password && (
                                             <span className="error-message">
                                                  {errors.password.message}
                                             </span>
                                        )}
                                   </div>
                                   <div className="input-group">
                                        <label htmlFor="phone">Phone No.<span style={{ color: "red" }}>*</span></label>
                                        <div className="form-group">
                                             <input
                                                  type="number"
                                                  id="phone"
                                                  placeholder="Phone No."
                                                  {...register('mobileno', {
                                                       required: {
                                                            value: !row._id ? true : false,
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
                                   {
                                        !row._id &&
                                        <>
                                             <div className="input-group">
                                                  <label htmlFor="gender">Gender<span style={{ color: "red" }}>*</span></label>
                                                  <div className="form-group">
                                                       <select id="gender" className="form-field" {...register('gender', {
                                                            required: {
                                                                 value: !row._id ? true : false,
                                                                 message: "Gender is required",
                                                            }
                                                       })}>
                                                            <option value="" >Select Gender</option>
                                                            <option value="Male">Male</option>
                                                            <option value="Female">Female</option>
                                                       </select>
                                                  </div>
                                                  {errors?.gender && (
                                                       <span className="error-message">
                                                            {errors.gender.message}
                                                       </span>
                                                  )}
                                             </div>

                                             <div className="input-group">
                                                  <label htmlFor="dob">Date of Birth<span style={{ color: "red" }}>*</span></label>
                                                  <div className="form-group">
                                                       <input
                                                            max={today}
                                                            type="date"
                                                            id="age_group"
                                                            placeholder="date of birth"
                                                            {...register('age_group', {
                                                                 required: {
                                                                      value: !row._id ? true : false,
                                                                      message: "Date of Birth is required",
                                                                 },
                                                            })}
                                                            style={{ borderColor: errors?.age_group ? 'red' : 'initial' }}
                                                       />
                                                  </div>
                                                  {errors?.age_group && (
                                                       <span className="error-message">
                                                            {errors.age_group.message}
                                                       </span>
                                                  )}
                                             </div>
                                        </>}

                                   <div className="input-group">
                                        <label htmlFor="facility">
                                             Facility<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <div className="form-group">
                                             <Controller
                                                  name="facility_id"
                                                  control={control}
                                                  rules={{
                                                       required: {
                                                            value: row?.id ? false : true,
                                                            message: "Facility is required",
                                                       },
                                                  }}
                                                  render={({ field }) => (
                                                       <Select
                                                            {...field}
                                                            id="facility"
                                                            closeMenuOnSelect={false}
                                                            isMulti
                                                            options={facilities?.map((facility: any) => ({
                                                                 value: facility._id ? facility._id : facility.id,
                                                                 label: facility.name,
                                                            }))}
                                                            className="controller-select"
                                                            onChange={(selectedOptions) => field.onChange(selectedOptions ? selectedOptions.map(option => option.value) : [])}
                                                            value={facilities
                                                                 ?.filter(facility => field.value?.includes(facility._id || facility.id))
                                                                 .map(facility => ({
                                                                      value: facility._id ? facility._id : facility.id,
                                                                      label: facility.name,
                                                                 }))}
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

                                        <label htmlFor="venues">Venues</label>
                                        <div className="form-group">
                                             <Controller
                                                  name="venue"
                                                  control={control}
                                                  render={({ field }) => (
                                                       <Select
                                                            closeMenuOnSelect={false}
                                                            className="controller-select"
                                                            components={animatedComponents}
                                                            defaultValue={row.venueIds}
                                                            // defaultValue={[colourOptions[4], colourOptions[5]]}
                                                            isMulti
                                                            options={venue}
                                                            {...field}
                                                       />
                                                  )}
                                             />
                                        </div>
                                   </div>
                                   <div className="input-group">
                                        <label htmlFor="organizer">Organizer (For organizer login only)</label>
                                        <div className="form-group">
                                             <Controller
                                                  name="organizerId"
                                                  control={control}
                                                  render={({ field }) => (
                                                       <Select
                                                            className="controller-select"
                                                            components={animatedComponents}
                                                            options={organizers}
                                                            {...field}
                                                       />
                                                  )}
                                             />

                                        </div>
                                        {errors?.organizerId && (
                                             <span className="error-message">
                                                  {errors.organizerId.message}
                                             </span>
                                        )}
                                   </div>
                                   <div className="input-group">
                                        <label htmlFor="role">Role<span style={{ color: "red" }}>*</span></label>
                                        <div className="form-group">
                                             <select id="facility" className="form-field" {...register('roleId', {
                                                  required: {
                                                       value: row?.id ? false : true,
                                                       message: "Role is required",
                                                  }
                                             })}>
                                                  <option value="" selected disabled>Select Role</option>
                                                  {roles?.map((roles: any) =>
                                                       <option key={roles.role_id} value={`${roles.role_id}`}>{roles.rolename}</option>
                                                  )}
                                             </select>
                                        </div>
                                        {errors?.roleId && (
                                             <span className="error-message">
                                                  {errors.roleId.message}
                                             </span>
                                        )}
                                   </div>
                              </div>
                              <Footer className='ant-modal-footer'>
                                   <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset(); }}>Cancel</button>
                                   <button type="submit" className="pi-btn-primary">{row._id ? "Save" : "Add"}</button>
                              </Footer>
                         </form>
                    </div>
               </Modal>
          </div >
     );
};
export default AddAdminUser;