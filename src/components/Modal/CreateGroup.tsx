import React, { useState } from 'react';
import { Popover, Radio, RadioChangeEvent } from 'antd';
import Calendar from "react-calendar";
import moment from 'moment';
import {
     CalendarOutlined,
} from "@ant-design/icons";
import { Icon } from '@iconify-icon/react';
import { Footer } from 'antd/es/layout/layout';
import { Controller, useForm } from 'react-hook-form';
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { createGroupAPI } from '../apiFile/Service';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { useSelector } from 'react-redux';
const animatedComponents = makeAnimated();

interface formModal {
     group_name: string,
     group_type: any,
     players: any,
}

const CreateGroup = ({ matches, userList, getAll }) => {

     const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails);
     const loggedInUser = localStorage.getItem("auth");

     const [open, setOpen] = useState(false);
     const form = useForm({
          defaultValues: {
               group_name: '',
               group_type: '',
               players: '',
          }
     })
     const { register, handleSubmit, reset, formState, setValue, control, watch } = form;
     const { errors } = formState;
     const handleOpenChange = (newOpen) => {
          setOpen(newOpen);
     };

     const groupType = watch('group_type');
     const groupTypeOptions = [
          { label: 'Public', value: 'public' },
          { label: 'Private', value: 'private', },
     ];

     const onGroupTypeChange = ({ target: { value } }: RadioChangeEvent) => {
          console.log("🚀 ~ onGroupTypeChange ~ value:", value)
          setValue('group_type', value);
     };

     const customStyles = {
          menu: (provided) => ({
               ...provided,
               zIndex: 49,
          }),
          multiValue: (provided) => ({
               ...provided,
               backgroundColor: '#003F70 !important',
               borderRadius: 16,
               overflow: 'hidden',
               gap: 6,
          }),
          multiValueLabel: (provided) => ({
               ...provided,
               color: 'white !important',
          }),
          multiValueRemove: (provided) => ({
               ...provided,
               color: 'white !important',
               borderRadius: 0,
               ':hover': {
                    backgroundColor: '#FFBDAD',
                    color: '#DE350B !important',
               },
          }),
     };

     const onSubmit = async (data: any) => {
          data.players = data?.players ? data?.players : []
          let payload = {
               "chatname": data.group_name,
               "is_group": true,
               "is_match": false,
               "users": data?.players?.map(item => (item.user_id)),
               "group_admin": loggedUserDetails._id,
               "bookingId": null,
               "is_coach": false,
               "is_facility": false,
               "type": "group",
               "is_admin": true,
               "group_profile": null,
               "is_public": data.group_type == 'public' ? true : false,
               "userChatDeleted": [],
          }
          payload.users.push(loggedUserDetails?._id)
          let response = await createGroupAPI(loggedInUser, payload);
          if (response.code == 'SUCCESS') {
               toast(<ToastMessage body={"Group Created Successfully"} type="success" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
               getAll();
               reset();
               setOpen(!open);
          } else {
               console.log("error")
               toast(<ToastMessage body={response.statusCode} type="warning" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
          }
     }

     const content = (
          <>
               <div className="custom-ant-modal-header">
                    Create Group
               </div>
               <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="popover-body">
                         <div className="popover-form-grid">
                              <div className="input-group col-span-2">
                                   <label htmlFor="groupName" className="form-lable">Group Name<span style={{ color: "red" }}>*</span></label>
                                   <div className="form-group">
                                        <input
                                             type="text"
                                             id="groupName"
                                             placeholder="Group Name"
                                             {...register('group_name', {
                                                  required: {
                                                       value: true,
                                                       message: 'group name is required',
                                                  },
                                             })}
                                        />

                                   </div>
                                   {errors?.group_name && (
                                        <span className="error-message">
                                             {errors.group_name.message}
                                        </span>
                                   )}
                              </div>
                              <div className="input-group col-span-2">
                                   <label className="form-lable">Group Type<span style={{ color: "red" }}>*</span></label>
                                   <div className="form-radio-group">
                                        <Radio.Group
                                             options={groupTypeOptions}
                                             {...register('group_type')}
                                             onChange={onGroupTypeChange}
                                             value={groupType ? groupType : 'Public'}
                                        />
                                   </div>
                                   {errors?.group_name && (
                                        <span className="error-message">
                                             {errors.group_name.message}
                                        </span>
                                   )}
                              </div>
                              <div className="input-group col-span-2">
                                   <label htmlFor="court" className="form-lable">Players List</label>
                                   <div className="form-group">
                                        <Controller
                                             name="players"
                                             control={control}
                                             render={({ field: { onChange, value }, field }) => (
                                                  <Select
                                                       closeMenuOnSelect={false}
                                                       styles={customStyles}
                                                       // closeMenuOnSelect={false}
                                                       className="controller-select"
                                                       components={animatedComponents}
                                                       defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                                                       isMulti
                                                       options={userList}
                                                       placeholder="Select players"
                                                       onChange={(value) => {
                                                            onChange(value);
                                                       }}
                                                       value={value}
                                                  />
                                             )}
                                        />
                                   </div>
                              </div>
                         </div>
                    </div>
                    <hr className="popover-hr" />
                    <footer className='popover-footer'>
                         <div className="button-container-100">
                              <button
                                   type="button"
                                   className="pi-btn-secondary"
                                   onClick={() => {
                                        handleOpenChange(false);
                                   }}
                              >
                                   Cancel
                              </button>
                              <button
                                   className="pi-btn-primary"
                                   key="cancel"
                                   type='submit'
                              >
                                   Create
                              </button>
                         </div>
                    </footer>
               </form>
          </>

     );

     return (
          <Popover
               content={content}
               trigger="click"
               open={open}
               onOpenChange={handleOpenChange}
               overlayClassName="custom-ant-popover-with-header"
               placement={'bottomLeft'}
          >
               <button className="gray-circle-btn">
                    <Icon icon="mdi:message-plus" width="1rem" height="1rem" />
               </button>

          </Popover>
     );
};

export default CreateGroup;
