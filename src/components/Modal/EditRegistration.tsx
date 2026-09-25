import React, { useMemo, useState } from 'react';
import { Modal, Button } from 'antd';
import './Modal.css'
import UserLabel from "../../components/Labels/UserLabel";
import SkillLabel from "../../components/Labels/SkillLabel";
import StatusLabel from "../../components/Labels/StatusLabel";
import { Icon } from "@iconify-icon/react";
import moment from 'moment';
import userimage from '../../assets/icon/user.jpeg'
import { useForm } from 'react-hook-form';
import { editCouponAPI, editRegisteredAPI, getEventUsersAPI } from '../apiFile/Service';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { Footer } from 'antd/es/layout/layout';

const EditRegistration = ({ visible, name, onConfirm, onCancel, row, getRegisteredUsers, userList }) => {
     interface User {
          firstname: string;
          lastname: string;
          _id: string;
     }
     const form = useForm({
          defaultValues: {
               name: "",
               phone: "",
               email: "",
               status: "",
               partner_id: "",

          }
     })
     const customTitle = (
          <div className="custom-ant-modal-header">
               {name}
          </div>
     );

     const today = moment();
     const [isChecked, setIsChecked] = useState(false);
     const [usersdata, setUsersData] = useState<User[]>([]);
     const loggedInUser = localStorage.getItem("auth");
     const { register, handleSubmit, reset, formState, setValue } = form;
     const { errors } = formState;

     const onSubmit = async (data: any) => {
          let payload = {}
          let response
          console.log(isChecked)
          if (isChecked == true) {
               console.log()
               payload = {
                    email: data.email,
                    name: data.name,
                    phone: data.phone,
                    status: data.status,
                    partner_from: "invite"
               }
               data.phone = Number(data.phone)
               response = await editRegisteredAPI(loggedInUser, payload, row._id);
          } else {
               payload = {
                    partner_id: data.partner_id,
                    status: data.status,
                    partner_from: "list"
               }
               response = await editRegisteredAPI(loggedInUser, payload, row._id);
          }
          if (response.code == 'SUCCESS') {
               getRegisteredUsers(true);
               toast(<ToastMessage body={"Data Updated Successfully"} type="success" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
               reset();
               setIsChecked(false)
               onCancel();
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
     // const { errors } = formState;

     const handleCheckboxChange = () => {
          setIsChecked(!isChecked);
     };
     // getEventUsersAPI

     const getUsers = async () => {
          if (row.tournament_id == undefined) {
               return
          } else {
               let response = await getEventUsersAPI(loggedInUser, row.tournament_id);
               if (response.code == 'SUCCESS') {
                    if (row?.partner_from == 'list') {
                         setValue('partner_id', row?.partner_user_id)
                         setUsersData([...response.data, row?.partner])
                    } else {
                         setUsersData(response.data)
                    }
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
     }

     useMemo(() => {
          getUsers();
          if (row?.partner_from == 'invite') {
               setIsChecked(true)
               reset({
                    'name': row?.partner.name,
                    'phone': row?.partner.phone,
                    'status': row?.partner_payment,
                    'email': row?.partner.email,
               })
          } else {
               setIsChecked(false)
               reset({
                    'partner_id': row?.partner_user_id,
                    'status': row?.partner_payment,
               })
          }
     }, [visible])

     return (
          <Modal
               title={customTitle}
               visible={visible}
               onOk={onConfirm}
               onCancel={onCancel}
               footer={null}
               className="custom-ant-modal lable-content-width"

          >
               <div className=''>
                    <div className="input-group pt-5">
                         <div className="input-group">
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                   <label htmlFor="teammate" className="form-lable"><b>Invite Player</b></label>
                                   <label className="switch">
                                        <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
                                        <span className="slider round"></span>
                                   </label>
                              </div>
                         </div>
                    </div>
                    {
                         isChecked ?
                              <>
                                   <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
                                        <div className="border-bottom-light">
                                             <div className="form-column">
                                                  <div className="input-group">
                                                       <label htmlFor="teammate" className="form-lable">Teammate <span className='required-star '>*</span></label>
                                                       <div className="form-group">
                                                            <input
                                                                 className="form-field"
                                                                 type="text"
                                                                 id="teammate"
                                                                 placeholder="Enter Teammate Name"
                                                                 {...register('name', {
                                                                      required: {
                                                                           value: true,
                                                                           message: 'Teammate name is required',
                                                                      },
                                                                      pattern: {
                                                                           value: /^[^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*$/,
                                                                           message: 'Please enter a valid name with at least three alphabet characters',
                                                                      },
                                                                 })}
                                                                 style={{ borderColor: errors?.name ? 'red' : 'initial' }}
                                                            />
                                                       </div>
                                                       {errors?.name && (
                                                            <span className="error-message">
                                                                 {errors.name.message}
                                                            </span>
                                                       )}
                                                  </div>
                                                  <div className="input-group">

                                                       <label htmlFor="teammate" className="form-lable">Teammate Number <span className='required-star '>*</span></label>
                                                       <div className="form-group">
                                                            <input
                                                                 className="form-field"
                                                                 type="number"
                                                                 id="teammate"
                                                                 placeholder="Enter Teammate Number"
                                                                 {...register('phone', {
                                                                      required: {
                                                                           value: true,
                                                                           message: " Teammate Number is required",
                                                                      },
                                                                      pattern: {
                                                                           value: /^\d{10}$/,
                                                                           message: 'Please enter a valid 10-digit phone number',
                                                                      },
                                                                 })}

                                                            />
                                                       </div>
                                                       {errors?.phone && (
                                                            <span className="error-message">
                                                                 {errors?.phone.message}
                                                            </span>
                                                       )}
                                                  </div>
                                                  <div className="input-group">

                                                       <label htmlFor="teammate" className="form-lable">Teammate Email </label>
                                                       <div className="form-group">
                                                            <input
                                                                 className="form-field"
                                                                 type="email"
                                                                 id="teammate"
                                                                 placeholder="Enter Teammate Email"
                                                                 {...register('email')}
                                                            />
                                                       </div>
                                                  </div>
                                                  <div className="input-group">

                                                       <label htmlFor="bookingStatus" className="form-lable">Payment Status <span className='required-star '>*</span></label>
                                                       <div className="form-group">
                                                            <select
                                                                 id="bookingStatus"
                                                                 className="form-field"
                                                                 {...register('status', {
                                                                      required: {
                                                                           value: true,
                                                                           message: 'Payment Status is required',
                                                                      },
                                                                 })}
                                                            >
                                                                 <option value="" disabled selected>
                                                                      Select Booking Status
                                                                 </option>
                                                                 <option value="Completed">Success</option>
                                                                 <option value="Pending">Pending</option>
                                                                 <option value="Cancelled">Cancelled</option>
                                                            </select>
                                                       </div>
                                                       {errors?.status && (
                                                            <span className="error-message">
                                                                 {errors.status.message}
                                                            </span>
                                                       )}
                                                  </div>
                                             </div>
                                        </div>
                                        <Footer className='ant-modal-footer'>
                                             <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset() }}>Cancel</button>
                                             <button type="submit" className="pi-btn-primary">{"Update"}</button>
                                        </Footer>
                                   </form>
                              </> :
                              <>
                                   <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
                                        <div className="border-bottom-light">
                                             <div className="form-column">
                                                  <div className="input-group">
                                                       <label htmlFor="location">Teammate <span className='required-star '>*</span></label>
                                                       <div className="form-group">
                                                            <select
                                                                 id="location"
                                                                 {...register("partner_id", {
                                                                      required: {
                                                                           value: true,
                                                                           message: 'Teammate name is required',
                                                                      },

                                                                 })}
                                                            >
                                                                 <option value="">Select User</option>
                                                                 {usersdata?.map((item) => {
                                                                      return (
                                                                           <option key={item?._id} value={`${item?._id}`}>
                                                                                {item?.firstname} {item?.lastname}
                                                                           </option>
                                                                      );
                                                                 })}
                                                            </select>

                                                       </div>
                                                       {errors?.partner_id && (
                                                            <span className="error-message">
                                                                 {errors.partner_id.message}
                                                            </span>
                                                       )}
                                                  </div>

                                                  <div className="input-group">

                                                       <label htmlFor="bookingStatus" className="form-lable">Payment Status *</label>
                                                       <div className="form-group">
                                                            <select
                                                                 id="bookingStatus"
                                                                 className="form-field"
                                                                 {...register('status', {
                                                                      required: {
                                                                           value: true,
                                                                           message: 'Payment Status is required',
                                                                      },
                                                                 })}
                                                            >
                                                                 <option value="" disabled selected>
                                                                      Select Booking Status
                                                                 </option>
                                                                 <option value="Completed">Success</option>
                                                                 <option value="Pending">Pending</option>
                                                                 <option value="Cancelled">Cancelled</option>
                                                            </select>
                                                       </div>
                                                       {errors?.status && (
                                                            <span className="error-message">
                                                                 {errors.status.message}
                                                            </span>
                                                       )}
                                                  </div>
                                             </div>
                                        </div>
                                        <Footer className='ant-modal-footer'>
                                             <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset() }}>Cancel</button>
                                             <button type="submit" className="pi-btn-primary">{"Update"}</button>
                                        </Footer>
                                   </form>
                              </>
                    }

               </div>

          </Modal>
     );
};

export default EditRegistration;
