import React, { useMemo, useState } from 'react';
import { Popover } from 'antd';
import moment from 'moment';
import { Icon } from '@iconify-icon/react';
import { useForm } from 'react-hook-form';
import { acceptRejectChatAPI } from '../apiFile/Service';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import AcceptRejectModal from './AcceptRejectModal';

const JoinGroupRequests = ({ matches, chatId, getAll }) => {

     const loggedInUser = localStorage.getItem("auth");

     const [open, setOpen] = useState(false);
     const [type, setType] = useState('');
     const [confirmation, setConfirmation] = useState(false);
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

     const onSubmit = async (data, isAccepted) => {
          setConfirmation(false);
          let payload = {
               "userId": data,
               "chatId": chatId._id,
               "isAccepted": isAccepted
          }
          handleOpenChange(false);
          let response = await acceptRejectChatAPI(loggedInUser, payload);
          if (response.code == 'SUCCESS') {
               toast(<ToastMessage body={`${isAccepted == true ? "Accepted" : "Rejected"} Successfully`} type="success" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
               getAll();
               reset();
               setOpen(false);
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

     const handleConfirm = async () => {
          onSubmit(chatId?.ruser?.map(item => (item._id)), type == 'accept' ? true : false)
     }

     useMemo(() => {

     }, [chatId?.ruser])

     const content = (
          <>
               <div className="custom-ant-modal-header">
                    Join Requests
               </div>
               <div className="popover-body">
                    {chatId?.ruser?.map(curEle => <>
                        <div className="request-container">
                              <div className="request-profile">
                                   <div>
                                        <img className="profile-image" src={curEle?.profile == null ? "https://cdn-icons-png.flaticon.com/512/149/149071.png" : curEle?.profile} alt="profile" />
                                   </div>
                                   <div className="profile-info">
                                        <div className="heading-text">{`${curEle?.firstname} ${curEle?.lastname}`} <span className="light-text">{moment(curEle?.createdAt).format('hh:mm A')}</span> </div>
                                        <div className="light-text" title="hi">{`${curEle?.firstname} ${curEle?.lastname}`} has requested to join the group.</div>
                                   </div>
                              </div>
                              <div className="button-container">
                                   <button
                                        className="pi-btn-green"
                                        key="cancel"
                                        onClick={() => {
                                             onSubmit([curEle?._id], true)
                                        }}
                                   >
                                        Accept
                                   </button>
                                   <button
                                        type="button"
                                        className="pi-btn-secondary"
                                        onClick={() => {
                                             onSubmit([curEle?._id], false)
                                        }}
                                   >
                                        Reject
                                   </button>
                              </div>
                        </div>
                    </>)}
               </div>
               <hr className="popover-hr" />
               <footer className='popover-footer'>
                    <div className="button-container-start">
                         {chatId?.ruser?.length > 0 && <>
                              <button
                                   className="pi-btn-green"
                                   onClick={() => {
                                        setType('accept')
                                        setConfirmation(true)
                                   }}
                              >
                                   Accept All
                              </button>
                              <button
                                   type="button"
                                   className="pi-btn-secondary"
                                   onClick={() => {
                                        setType('reject')
                                        setConfirmation(true)
                                   }}
                              >
                                   Reject All
                              </button>
                         </>}
                    </div>
                    <div className="button-container">
                         <button
                              type="button"
                              className="pi-btn-secondary"
                              onClick={() => {
                                   handleOpenChange(false);
                              }}
                         >
                              Cancel
                         </button>
                    </div>
               </footer>
          </>
     );

     return (
          <>
               <Popover
                    content={content}
                    trigger="click"
                    open={open}
                    onOpenChange={handleOpenChange}
                    overlayClassName="custom-ant-popover-with-header"
                    placement={'bottomLeft'}
               >
                    <button className="gray-circle-btn">
                         <Icon icon="fa6-solid:user-clock" width="1.2rem" height="1.2rem" />
                    </button>
                    <AcceptRejectModal
                         visible={confirmation}
                         onConfirm={handleConfirm}
                         onCancel={() => { setConfirmation(false); setOpen(false) }}
                         name="Chat"
                         type={type}
                    />
               </Popover>
          </>
     );
};

export default JoinGroupRequests;
