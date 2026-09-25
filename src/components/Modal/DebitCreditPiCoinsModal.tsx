import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { Controller, useForm } from 'react-hook-form';
import * as Constants from "../../components/apiFile/Constants";
import { creditPicoins, debitPicoins, getUserDetailsbyId } from '../apiFile/Service';
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';


interface formModal {
     userId: any;
     amount: any;
     reference: String
     referenceId: String
     source: String
}

const DebitCreditPiCoinsModal = ({ visible, onCancel, txnType, row, userList, setRow, setTxnType, getAllData }) => {
     const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails);
     const [selectedUserSocialDetails, setSelectedUserSocialDetails] = useState<any>({});
     const loggedInUser = localStorage.getItem("auth");
     const animatedComponents = makeAnimated();
     const customTitle = (
          <div className="custom-ant-modal-header">
               {`${txnType} Pi Coins`}
          </div>
     );
     const form = useForm({
          defaultValues: {
               userId: [],
               reference: "",
               referenceId: "",
               amount: null,
               source: "",
          }
     })
     const { register, handleSubmit, control, reset, formState, watch } = form;
     const { errors } = formState;
     const selectedUser: any = watch("userId");
     const amount = watch('amount')

     const onSuccess = () => {
          reset({
               userId: [],
               reference: "",
               referenceId: "",
               amount: null
          });
          onCancel();
          getAllData();
     }

     const onSubmit = async (data: formModal) => {
          data.userId = data.userId.value
          data.amount = Number(data.amount)
          data.reference = "Pi Coins Admin Transaction by " + loggedUserDetails?._id
          data.referenceId = uuidv4()
          console.log("🚀 ~ onSubmit ~ data:", data)
          let response
          if (txnType == "Debit") {
               response = await debitPicoins(data);
          } else {
               response = await creditPicoins(data);
          }
          console.log("🚀 ~ onSubmit ~ response:", response);

          if (response.message == "Success") {
               toast(<ToastMessage body={`Pi Coins ${txnType}ed Successfully`} type="success" />, {
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

     const getSocialDetailsOfUser = async (data, loggedInUser) => {
          data = {
               userIds : [data]
          }
          const resp = await getUserDetailsbyId(data, loggedInUser);
          if (resp.message.message == "Success") {
              setSelectedUserSocialDetails(resp?.message?.data?.profiles[0]);
          }
     }

     useEffect(() => {
          if (txnType) {
               reset({
                    userId: [],
                    reference: "",
                    referenceId: "",
                    amount: null,
                    source: ""
               })
          } else {
               reset({});
               setRow({})
               reset({
                    userId: [],
                    reference: "",
                    referenceId: "",
                    amount: null,
                    source: ""
               });
          }
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
                         <div className="form-container-grid-3 border-bottom-light">
                              <div className="input-group">
                                   <label htmlFor="location" className="form-lable">User<span style={{ color: "red" }}>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="userId"
                                             control={control}
                                             rules={{
                                                  required: {
                                                       value: true,
                                                       message: "User is required",
                                                  },
                                             }}
                                             render={({ field }) => (
                                                  <Select
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       options={userList}
                                                       onChange={(selectedOptions:any) => {
                                                            field.onChange(selectedOptions);
                                                            console.log("selectedOptions", selectedOptions);
                                                            getSocialDetailsOfUser(selectedOptions?.value, loggedInUser)
                                                       }}
                                                       value={field.value}
                                                       name={field.name}
                                                       ref={field.ref}

                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.userId && (
                                        <span className="error-message">
                                             {errors.userId.message}
                                        </span>
                                   )}
                              </div>

                              <div className="input-group">
                                   <label htmlFor="name" className="form-lable">Phone Number</label>
                                   <p className='info-value' >{selectedUser?.data?.mobileno}</p>
                              </div>
                              <div className="input-group">
                                   <label htmlFor="name" className="form-lable">Current Pi Coins Balance</label>
                                   <p className='info-value' >{selectedUserSocialDetails?.picoins || 0}</p>
                              </div>


                              {/* <div className="form-container-grid col-span-3"> */}

                              <div className="input-group">
                                   <label htmlFor="name" className="form-lable">Source<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="text"
                                             id="name"
                                             placeholder="Enter source"
                                             {...register('source', {
                                                  required: {
                                                       value: true,
                                                       message: 'Source is required',
                                                  }

                                             })}
                                        />
                                   </div>
                                   {errors?.source && (
                                        <span className="error-message">
                                             {errors.source.message}
                                        </span>
                                   )}
                              </div>

                              <div className="input-group">
                                   <label htmlFor="amount">Amount to be {txnType}ed<span className='required-star'>*</span></label>
                                   <div className="form-group">

                                        <input
                                             className="form-field"
                                             type="number"
                                             id="amount"
                                             placeholder={`Enter amount to ${txnType}`}
                                             {...register('amount', {
                                                  required: {
                                                       value: true,
                                                       message: 'Amount is required',
                                                  },
                                             })}
                                        />
                                   </div>
                                   {errors?.amount && (
                                        <span className="error-message">
                                             {errors.amount.message}
                                        </span>
                                   )}
                              </div>
                              {/* </div> */}
                              <div className="input-group">
                                   <label htmlFor="name" className="form-lable">New Pi Coin Balance</label>
                                   <p className='info-value' >{selectedUserSocialDetails?.picoins ? (txnType == "Debit" ? selectedUserSocialDetails?.picoins - Number(amount) : selectedUserSocialDetails?.picoins + Number(amount)) : 0}</p>
                              </div>
                         </div>

                         <Footer className='ant-modal-footer'>
                              <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset(); }}>Cancel</button>
                              <button type="submit" className="pi-btn-primary">Submit</button>
                         </Footer>
                    </form>
               </div >
          </Modal >
     )
}

export default DebitCreditPiCoinsModal