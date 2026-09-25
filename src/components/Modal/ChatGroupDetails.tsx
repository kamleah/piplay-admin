import { Checkbox, Modal, Popover } from 'antd';
import React, { useCallback, useMemo, useState } from 'react'
import { Footer } from 'antd/es/layout/layout';
import userimage from '../../assets/icon/user.jpeg'
import formatWeekdays from '../Helpers/formatWeekdays';
import moment from 'moment';
import { Icon } from '@iconify-icon/react';
import { Controller, useForm } from 'react-hook-form';
import SkillLabel from '../Labels/SkillLabel';
import { useSelector } from 'react-redux';
import AcceptRejectModal from './AcceptRejectModal';
import { clearChatAPI, getChatUsersAPI, removePlayersFromChatAPI } from '../apiFile/Service';
import { toast } from 'react-toastify';
import _ from 'lodash';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import EditGroupProfile from './EditGroupProfile';


const ChatGroupDetails = ({ visible, name, onCancel, row, getAll, getChat, setSelectedChat }) => {     

     const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails);
     const loggedInUser = localStorage.getItem("auth");
     const { watch, control, register, reset, setValue } = useForm();
     const [remove, setRemove] = useState(false)
     const [showEdit, setShowEdit] = useState(false)
     const [isEditProfile, setIsEditProfile] = useState(false)
     const [confirmation, setConfirmation] = useState(false);
     const [type, setType] = useState('');
     const [removeMembers, setRemoveMembers] = useState([])
     const [members, setMembers] = useState(row?.users)
     const [userList, setUserList] = useState<any[]>([]);
     const [open, setOpen] = useState(false);

     const handleOpenChange = (newOpen) => {
          setOpen(newOpen);
     };
     const getUsers = async () => {
          let response = await getChatUsersAPI(loggedInUser, row?._id);
          let venues = response?.data?.map((data) => {
               return {
                    label: `${data.firstname} ${data.lastname}`,
                    mobileno: data?.mobileno,
                    value: data?._id,
                    user_id: data?._id
               };
          });
          setUserList(venues);
     };

     useMemo(() => {
          getUsers()
     }, [row])

     let searchKeyword = watch("search");

     const debounce = useCallback(
          _.debounce((_searchVal) => {
               if (_searchVal?.length > 0) {
                    let newUsers = row?.users.filter(item =>
                         (`${item?.firstname} ${item?.lastname}`)?.toUpperCase()?.includes(_searchVal?.toUpperCase())
                    );
                    setMembers(newUsers?.length > 0 ? newUsers : []);
               }
          }, 900),
          [searchKeyword]
     );

     const handleCheckboxChange = (event: boolean, data: any) => {
          let arr: any = [...removeMembers]
          if (event) {
               arr.push(data);
          } else {
               arr = arr.filter((item: any) => item != data);
          }
          setRemoveMembers(arr)
     }

     const handleConfirm = async () => {
          setConfirmation(false)
          if (type == 'removeall' || type == 'exit') {
               RemoveUsers(type == 'exit' ? [loggedUserDetails._id] : removeMembers)
          } else {
               ClearExitGroup(type)
          }
     }

     const RemoveUsers = async (data) => {
          let paylaod = {
               "chatId": row?._id,
               "userId": data
          }
          let response = await removePlayersFromChatAPI(loggedInUser, paylaod);
          setOpen(false)
          if (response.code == 'SUCCESS') {
               toast(<ToastMessage body={`${data.length > 1 ? 'Players' : 'Player'} removed Successfully`} type="success" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
               getAll();
               reset();
               setRemoveMembers([]);
               setRemove(false);
               if (type == 'exit') {
                    setSelectedChat()
                    onCancel();
               }
          } else {
               console.log("error")
               toast(<ToastMessage body={response?.message} type="warning" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
          }
     }

     const ClearExitGroup = async (from) => {
          let paylaod = {
               "chatId": [row?._id],
               "userId": loggedUserDetails?._id
          }

          let response = await clearChatAPI(loggedInUser, paylaod);
          if (response.code == 'SUCCESS') {
               toast(<ToastMessage body={`Chat Cleared Successfully`} type="success" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
               getChat();
               onCancel();
               reset();
               setRemoveMembers([]);
               setRemove(false);
          } else {
               console.log("error")
               toast(<ToastMessage body={response?.message} type="warning" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
          }
     }


     useMemo(() => {
          setMembers(members)
     }, [members])

     useMemo(() => {
          debounce(searchKeyword)
     }, [searchKeyword])


     useMemo(() => {
          setValue('search', '')
          setRemoveMembers([])
          if (visible == false) {
               setRemove(false)
          }
     }, [remove, visible, row])

     const ThreeDot = ({ item }) => {
          return (

               <Popover
                    content={
                         <div onClick={() => { RemoveUsers([item?._id]); }}>
                              <button type="button" className="pi-btn-remove">
                                   <span className="button-content">
                                        <Icon icon="mdi:delete" width="1rem" height="1rem" />
                                        Remove
                                   </span>
                              </button>
                         </div>
                    }
                    trigger="click"
                    placement="bottomRight"
               >
                    <Icon icon="mage:dots" width="1rem" height="1rem" />
               </Popover>
          )
     }

     return (
          <>
               <Modal title={null}
                    visible={visible}
                    onCancel={onCancel}
                    footer={null}
                    className="custom-ant-modal no-header "
               >
                    <div className='details-container'>
                         <div className='details-profile-container'>
                              <img src={row?.group_profile ? row?.group_profile : userimage} alt="" className="details-profile-image" />
                              <h2 className='details-profile-name'>{row?.chatname}</h2>
                              <p className='light-text'>Group - {row?.users?.length} members</p>
                         </div>
                         <div className='button-container-center margin-verticle-15'>
                              <button
                                   type="button"
                                   className="pi-btn-secondary"
                                   onClick={() => { setShowEdit(true); setIsEditProfile(true) }}
                              >
                                   <span className="button-content">
                                        <Icon icon="mdi:pencil-outline" className="btn-icon" />
                                        Edit Profile
                                   </span>
                              </button>
                              <button
                                   type="button"
                                   className="pi-btn-primary"
                                   onClick={() => { setShowEdit(true); setIsEditProfile(false) }}
                              >
                                   <span className="button-content">
                                        <Icon icon="material-symbols:person-add" width="1rem" height="1rem" />
                                        Add Members
                                   </span>

                              </button>
                         </div>
                         {!remove &&
                              <form className='chat-search-form'
                              // onSubmit={handleSubmit(onSubmit)}
                              >
                                   <div className="form-column">
                                        <div className="form-group form-group-search">
                                             <Icon icon="gravity-ui:magnifier" />
                                             <input
                                                  className="form-field"
                                                  type="text"
                                                  id="universal-search"
                                                  placeholder="Search"
                                                  {...register("search")}
                                             />
                                             {searchKeyword && <Icon icon="charm:cross" onClick={() => reset()} />}
                                        </div>
                                   </div>
                              </form>}

                         <div className="chat-header-section">
                              <div className="heading-text-18 text-nowrap" >Members List</div>
                              <button className="pi-btn-icon" onClick={() => { setRemove(!remove) }}>
                                   <Icon icon="mdi:person-edit" width="1.5rem" height="1.5rem" className="btn-icon" />
                              </button>
                         </div>
                         {searchKeyword?.length > 0 ? <>
                              {members?.length > 0 ? <>
                                   {members?.map(item =>
                                        <div className="member-details border-bottom-light">
                                             <div className="request-profile">
                                                  <div>
                                                       <img className="profile-image" src={item?.profile ? item?.profile : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="profile" />
                                                  </div>
                                                  <div className="profile-info">
                                                       <div className="heading-text">{`${item?.firstname} ${item?.lastname}`} <span className="light-text"></span> </div>
                                                       <SkillLabel skill={JSON.parse(item?.skill_level).label} size={'sm'} />
                                                  </div>
                                             </div>
                                             {item?._id == row?.group_admin && <div className="admin">
                                                  <Icon icon="flowbite:user-settings-solid" width="1.5rem" height="1.5rem" className='admin-icon' />
                                                  Admin
                                             </div>}
                                             <div className="admin">
                                                  {!remove ?
                                                       <Popover
                                                            content={<>
                                                                 <div onClick={() => { RemoveUsers([item?._id]); }}>
                                                                      <button type="button" className="pi-btn-remove"> <span className="button-content"><Icon icon="mdi:delete" width="1rem" height="1rem" />Remove</span></button>
                                                                 </div>
                                                            </>}
                                                            trigger="click"
                                                            placement="bottomRight"
                                                            open={open}
                                                            onOpenChange={handleOpenChange}
                                                       >
                                                            <Icon icon="mage:dots" width="1rem" height="1rem" />
                                                       </Popover> :
                                                       <>
                                                            {item?._id != loggedUserDetails._id &&
                                                                 < Controller
                                                                      control={control}
                                                                      name={`delete${item?._id}`}
                                                                      render={({ field: { onChange, value } }) => (
                                                                           <Checkbox
                                                                                className='checkbox-primary'
                                                                                id={`delete${item?._id}`}
                                                                                disabled={false}
                                                                                onChange={(e) => { onChange(e.target.checked); handleCheckboxChange(e.target.checked, item?._id) }} />
                                                                      )}
                                                                 />
                                                            }
                                                       </>
                                                  }
                                             </div>
                                        </div>
                                   )}
                              </> : <div className="no-members">No members found</div>}
                         </> :
                              <>
                                   {row?.users?.map(item =>
                                        row?.group_exit_users?.includes(item._id) ? null : (
                                             <>
                                                  < div className="member-details border-bottom-light" >
                                                       <div className="request-profile">
                                                            <div>
                                                                 <img className="profile-image" src={item?.profile ? item?.profile : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="profile" />
                                                            </div>
                                                            <div className="profile-info">
                                                                 <div className="heading-text">{`${item?.firstname} ${item?.lastname}`} <span className="light-text"></span> </div>
                                                                      {(() => {
                                                                           try {
                                                                                const skill = JSON.parse(item?.skill_level);
                                                                                return <SkillLabel skill={skill?.label} size={'sm'} />;
                                                                           } catch (error) {
                                                                                return null; // Or handle error display here if needed
                                                                           }
                                                                      })()}
                                                                 {/* <SkillLabel skill={JSON.parse(item?.skill_level).label} size={'sm'} /> */}
                                                            </div>
                                                       </div>
                                                       {item?._id == row?.group_admin && <div className="admin">
                                                            <Icon icon="flowbite:user-settings-solid" width="1.5rem" height="1.5rem" className='admin-icon' />
                                                            Admin
                                                       </div>}
                                                       <div className="admin">
                                                            {(item?._id != row?.group_admin && !remove) ?
                                                                 <ThreeDot item={item} />
                                                                 : (
                                                                      <>
                                                                           {item?._id !== loggedUserDetails._id && (
                                                                                <Controller
                                                                                     control={control}
                                                                                     name={`delete${item?._id}`}
                                                                                     render={({ field: { onChange, value } }) => (
                                                                                          <Checkbox
                                                                                               className='checkbox-primary'
                                                                                               id={`delete${item?._id}`}
                                                                                               disabled={false}
                                                                                               onChange={(e) => {
                                                                                                    onChange(e.target.checked);
                                                                                                    handleCheckboxChange(e.target.checked, item?._id);
                                                                                               }}
                                                                                          />
                                                                                     )}
                                                                                />
                                                                           )}
                                                                      </>
                                                                 )}
                                                       </div>
                                                  </div>
                                             </>
                                        )

                                   )}
                              </>
                         }
                    </div>

                    <Footer className='ant-modal-footer'>
                         {!remove ? <div className="button-container-between">
                              <button
                                   type="button"
                                   className="pi-btn-secondary"
                                   onClick={() => { setType('clear'); setConfirmation(true) }}
                              >
                                   <span className="button-content">
                                        <Icon icon="fluent:chat-dismiss-20-regular" width="1rem" height="1rem" />
                                        Clear Chat
                                   </span>

                              </button>
                              <button
                                   type="button"
                                   className="pi-btn-delete"
                                   onClick={() => { setType('exit'); setConfirmation(true) }}
                              >
                                   <span className="button-content">
                                        <Icon icon="streamline:interface-logout-arrow-exit-frame-leave-logout-rectangle-right" />
                                        Exit Group
                                   </span>
                              </button>
                         </div> :
                              <div className="button-container-between">
                                   <button
                                        type="button"
                                        className="pi-btn-secondary"
                                        onClick={() => { setRemove(!remove); setRemoveMembers([]); }}
                                   >
                                        Cancel

                                   </button>
                                   <button
                                        type="button"
                                        className="pi-btn-delete"
                                        onClick={() => { setType('removeall'); setConfirmation(true) }}
                                   >
                                        Remove
                                   </button>
                              </div>}
                    </Footer>
                    <AcceptRejectModal
                         visible={confirmation}
                         onConfirm={handleConfirm}
                         onCancel={() => { setConfirmation(false) }}
                         name="Chat"
                         type={type}
                    />
               </Modal>
               <EditGroupProfile
                    visible={showEdit}
                    onCancel={() => { setShowEdit(false) }}
                    row={row}
                    iseEditProfile={isEditProfile}
                    userList={userList}
                    getAllData={getAll}
                    setSelectedChat={setSelectedChat}
               />
          </>
     )
}

export default ChatGroupDetails