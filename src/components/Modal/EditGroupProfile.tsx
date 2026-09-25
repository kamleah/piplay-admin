import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Radio, RadioChangeEvent } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { Controller, useForm } from 'react-hook-form';
import * as Constants from "../../components/apiFile/Constants";
import { addPlayersToChatAPI, createSession, editSession, renameChatAPI } from '../apiFile/Service';
import JoditEditor from "jodit-react";
import { Icon } from "@iconify-icon/react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { float } from 'aws-sdk/clients/cloudfront';
import userimage from '../../assets/icon/user.jpeg'
const animatedComponents = makeAnimated();


interface formModal {
     group_name: string,
     group_type: string,
}

const EditGroupProfile = ({ visible, onCancel, row, iseEditProfile, userList, getAllData, setSelectedChat }) => {
     const form = useForm({
          defaultValues: {
               group_name: "",
               group_type: "",
               image: ''
          }
     })
     const form1 = useForm({
          defaultValues: { players: [] }
     })

     const { register: register1, handleSubmit: handleSubmit1, control: control1, reset: reset1, formState: formState1, watch: watch1, setValue: setValue1 } = form;
     const { register: register2, handleSubmit: handleSubmit2, control: control2, reset: reset2, formState: formState2, watch: watch2, setValue: setValue2 } = form1;

     const [previewImage, setPreviewImage] = useState('')
     const { errors: errors1 } = formState1;

     const groupType1 = watch1('group_type');
     const players = watch2('players');
     const groupTypeOptions = [
          { label: 'Private', value: 'private' },
          { label: 'Public', value: 'public' }
     ];

     const customTitle = (
          <div className="custom-ant-modal-header">
               {iseEditProfile ? "Edit Group Profile" : "Add Members"}
          </div>
     );
     const loggedInUser = localStorage.getItem("auth");

     const onSubmit = async (data: any) => {
          const formData = new FormData();
          formData.append('chatname', data.group_name);
          formData.append('chatName', data.group_name);
          formData.append('chatId', row._id);
          formData.append('is_public', groupType1 === 'public' ? 'true' : 'false');
          if (data.image && data.image.length > 0) {
               formData.append('file', data.image[0]);
          }
          var response = await renameChatAPI(loggedInUser, formData);
          if (response.code == 'SUCCESS') {
               setSelectedChat();
               toast(<ToastMessage body={"Group Details Updated Successfully"} type="success" />, {
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
          onCancel();
          getAllData();
          reset1({
               "group_name": "",
               "group_type": "",
               'image': ''
          });
          reset2();
     }

     useEffect(() => {
          setPreviewImage('')
          reset1({
               "group_name": row?.chatname,
               "group_type": row?.is_public == true ? 'public' : 'private',
          })
     }, [visible])

     const onGroupTypeChange = ({ target: { value } }: RadioChangeEvent) => {
          setValue1('group_type', value);
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

     const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          console.log("🚀 ~ onChange ~ event:", event)
          const file = event.target.files?.[0];
          setValue1('group_type', row?.is_public == true ? 'public' : 'private')
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

     const AddPlayers = async () => {
          console.log(players);
          let payload = {
               "chatId": row._id,
               "userId": players.map((items: any) => (items.user_id))
          }
          if (payload.userId.length > 0) {
               var response = await addPlayersToChatAPI(loggedInUser, payload);
               if (response.code == 'SUCCESS') {
                    toast(<ToastMessage body={"Group Details Updated Successfully"} type="success" />, {
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
          } else {
               onCancel();
               return
          }
     }

     return (
          <Modal
               title={customTitle}
               visible={visible}
               // onOk={onConfirm}
               onCancel={() => {
                    onCancel();
                    reset1();
                    reset2();
               }}
               footer={null}
               className="custom-ant-modal "
          >
               <div className="form-container">
                    <form style={{ width: "100%" }} onSubmit={handleSubmit1(onSubmit)}>
                         <div className="border-bottom-light">
                              {iseEditProfile ?
                                   <>
                                        <div className='edit-profile-container'>
                                             <div className="profile-image-container">
                                                  <img src={
                                                       previewImage != '' ? previewImage :
                                                            row?.group_profile ? row?.group_profile :
                                                                 userimage
                                                  } alt="" className="edit-profile-image" />

                                                  <label htmlFor="file" className="edit-profile-label">
                                                       <input
                                                            id="file"
                                                            type="file"
                                                            className="edit-profile-input"
                                                            {...register1('image', { onChange: (e) => { onChange(e) } })} />
                                                       <Icon icon="mdi:camera-plus" className="edit-profile-icon" flip="horizontal" />
                                                  </label>
                                             </div>
                                        </div>
                                        <div className="input-group col-span-2">
                                             <label htmlFor="groupName" className="form-lable">Group Name<span style={{ color: "red" }}>*</span></label>
                                             <div className="form-group">
                                                  <input
                                                       type="text"
                                                       id="groupName"
                                                       placeholder="Group Name"
                                                       {...register1('group_name', {
                                                            required: {
                                                                 value: true,
                                                                 message: 'group name is required',
                                                            },
                                                       })}
                                                  />

                                             </div>
                                             {errors1?.group_name && (
                                                  <span className="error-message">
                                                       {errors1.group_name.message}
                                                  </span>
                                             )}
                                        </div>
                                        <div className="input-group col-span-2">
                                             <label className="form-lable">Group Type<span style={{ color: "red" }}>*</span></label>
                                             <div className="form-radio-group">
                                                  <Radio.Group
                                                       options={groupTypeOptions}
                                                       {...register1('group_type')}
                                                       onChange={onGroupTypeChange}
                                                       value={groupType1}
                                                  />
                                             </div>
                                             {errors1?.group_name && (
                                                  <span className="error-message">
                                                       {errors1.group_name.message}
                                                  </span>
                                             )}
                                        </div>
                                   </> :

                                   <div className="input-group col-span-2">
                                        <label htmlFor="court" className="form-lable">Players List</label>
                                        <div className="form-group">
                                             <Controller
                                                  name="players"
                                                  control={control2}
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
                              }
                         </div>
                         {iseEditProfile ? <Footer className='ant-modal-footer'>
                              <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset1(); reset2(); }}>Cancel</button>
                              <button type="submit" className="pi-btn-primary">Save</button>
                         </Footer> :
                              <Footer className='ant-modal-footer'>
                                   <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset1(); reset2(); }}>Cancel</button>
                                   <button type="button" className="pi-btn-primary" onClick={() => { AddPlayers(); }}>Add Players</button>
                              </Footer>}
                    </form>
               </div >
          </Modal >
     )
}

export default EditGroupProfile