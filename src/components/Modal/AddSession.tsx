import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { Controller, useForm } from 'react-hook-form';
import * as Constants from "../../components/apiFile/Constants";
import { createSession, editSession } from '../apiFile/Service';
import JoditEditor from "jodit-react";
import { Icon } from "@iconify-icon/react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { float } from 'aws-sdk/clients/cloudfront';


interface formModal {
     title: string,
     sub_title: string,
     price: string,
     program_id: any,
}

const AddSession = ({ visible, onCancel, row, edit, programList, setRow, setEdit, getAllData }) => {
     const form = useForm({
          defaultValues: {
               title: "",
               sub_title: "",
               price: "",
               program_id: {},
          }
     })
     const { register, handleSubmit, control, reset, formState, watch } = form;
     const { errors } = formState;
     const customTitle = (
          <div className="custom-ant-modal-header">
               {edit ? 'Edit session' : 'Add session'}
          </div>
     );
     const loggedInUser = localStorage.getItem("auth");
     const animatedComponents = makeAnimated();
     const onSubmit = async (data: formModal) => {
          data.program_id = data?.program_id?.value
          var response
          if (edit == true) {
               response = await editSession(loggedInUser, row._id, data);
          } else {
               response = await createSession(loggedInUser, data);
          }
          if (response.statusCode == 0) {
               toast(<ToastMessage body={edit ? "Session Updated Successfully" : "Session Added Successfully"} type="success" />, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
               onSuccess();
          } else {
               toast(<ToastMessage body={response.message} type="warning" />, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
          }
     }

     const onSuccess = () => {
          setEdit(false);
          onCancel();
          getAllData();
          reset({
               "title": "",
               "sub_title": "",
               "price": "",
               "program_id": undefined,
          });
     }

     useEffect(() => {
          if (edit === true) {
               reset({
                    "title": row.title,
                    "sub_title": row?.sub_title,
                    "price": row.price,
                    "program_id": { label: row?.program?.title, value: row?.program?._id },
               })
          } else {
               console.log('====================================');
               console.log("Add Session", row);
               console.log('====================================');
               setRow({})
               setEdit(false);
               reset({});
               reset({
                    "title": "",
                    "sub_title": "",
                    "price": "",
                    "program_id": "",
               });
          }
     }, [visible])

     return (
          <Modal
               title={customTitle}
               visible={visible}
               // onOk={onConfirm}
               onCancel={() => {
                    onCancel();
                    reset();
               }}
               footer={null}
               className="custom-ant-modal "
          >
               <div className="form-container">
                    <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
                         <div className="border-bottom-light">
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
                                   <label htmlFor="sub_title" className="form-lable">Subtitle<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="text"
                                             id="sub_title"
                                             placeholder="Enter program sub_title"
                                             {...register("sub_title", {
                                                  required: {
                                                       value: true,
                                                       message: 'Subtitle is required',
                                                  },

                                             })}
                                        />
                                   </div>
                                   {errors?.sub_title && (
                                        <span className="error-message">
                                             {errors.sub_title.message}
                                        </span>
                                   )}
                              </div>
                              <div className="input-group">
                                   <label htmlFor="price" className="form-lable">Price<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="number"
                                             id="price"
                                             placeholder="Enter Session price"
                                             {...register("price", {
                                                  required: {
                                                       value: true,
                                                       message: 'price is required',
                                                  },

                                             })}
                                        />
                                   </div>
                                   {errors?.price && (
                                        <span className="error-message">
                                             {errors.price.message}
                                        </span>
                                   )}
                              </div>
                              <div className="input-group">
                                   <label htmlFor="program_id" className="form-lable">Program<span className='required-star '>*</span></label>
                                   <div className="form-group">
                                        <Controller
                                             name="program_id"
                                             control={control}
                                             rules={{
                                                  required: {
                                                       value: true,
                                                       message: "Program is required",
                                                  },
                                             }}
                                             render={({ field: { onChange, value } }) => (
                                                  <Select
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       placeholder="Select Program"
                                                       options={programList}
                                                       value={value}
                                                       onChange={onChange}
                                                  />
                                             )}
                                        />
                                   </div>
                                   {errors?.program_id && (
                                        <span className="error-message">
                                             {errors.program_id.message}
                                        </span>
                                   )}
                              </div>
                         </div>
                         <Footer className='ant-modal-footer'>
                              <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset(); }}>Cancel</button>
                              <button type="submit" className="pi-btn-primary"> {edit ? 'Save Changes' : 'Add Session'}</button>
                         </Footer>
                    </form>
               </div >
          </Modal >
     )
}

export default AddSession