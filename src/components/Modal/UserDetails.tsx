import React from 'react';
import { Modal, Button } from 'antd';
import './Modal.css'
import UserLabel from "../../components/Labels/UserLabel";
import SkillLabel from "../../components/Labels/SkillLabel";
import StatusLabel from "../../components/Labels/StatusLabel";
import { Icon } from "@iconify-icon/react";
import moment from 'moment';
import userimage from '../../assets/icon/user.jpeg'
const UserDetails = ({ visible, name, onConfirm, onCancel, userData }) => {

     const customTitle = (
          <div className="custom-ant-modal-header">
               {name}
          </div>
     );
     const today = moment();
     return (
          <Modal
               title={customTitle}
               visible={visible}
               onOk={onConfirm}
               onCancel={onCancel}
               footer={null}
               className="custom-ant-modal lable-content-width"
          >
               {userData?.firstname ? <>
                    <div className='user-details'>
                         <div className='user-image-section'>
                              <div className='user-image-container'>
                                   <img className='user-image' src={userData?.profile_url ? userData?.profile_url : userimage} />
                                   <div className='user-skill-label'>
                                        {(userData?.skill_level)?.label && <SkillLabel skill={JSON.parse(userData?.skill_level)?.label} />}
                                   </div>
                              </div>
                         </div>
                         <div className='grid-section'>
                              <div className="grid-item">
                                   <h4 className='info-label' >Full Name</h4>
                                   <p className='info-value' >{userData?.firstname + ' ' + userData?.lastname}</p>
                              </div>
                              <div className="grid-item">
                                   <h4 className='info-label' >Email ID</h4>
                                   <p className=' text-break' >{userData?.email}</p>
                              </div>
                              <div className="grid-item">
                                   <h4 className='info-label' >Phone Number</h4>
                                   <p className='info-value' >{userData?.mobileno}</p>
                              </div>
                              <div className="grid-item">
                                   <h4 className='info-label' >Gender</h4>
                                   <p className='info-value' >{userData?.gender}</p>

                              </div>
                              <div className="grid-item">
                                   <h4 className='info-label' >Age</h4>
                                   <p className='info-value' >{today.diff(userData?.age_group, 'years')}</p>
                              </div>
                              <div className="grid-item">
                                   <h4 className='info-label' >Pincode</h4>
                                   <p className='info-value' >{userData?.pincode}</p>
                              </div>
                              <div className="grid-item">
                                   <h4 className='info-label' >Games Played</h4>
                                   <p className='info-value' >{userData?.games}</p>
                              </div>
                         </div>
                    </div>
               </> : <>
                    <div className='grid-section'>
                         <div className="grid-item">
                              <h4 className='info-label' >Full Name</h4>
                              <p className='info-value' >{userData?.name}</p>
                         </div>
                         <div className="grid-item">
                              <h4 className='info-label' >Email ID</h4>
                              <p className='info-value text-break' >{userData?.email}</p>
                         </div>
                         <div className="grid-item">
                              <h4 className='info-label' >Phone Number</h4>
                              <p className='info-value' >{userData?.phone}</p>
                         </div>
                         <div className="grid-item">
                              <h4 className='info-label' >Invite Status</h4>
                              <p className='info-value' >{userData?.invite_status}</p>
                         </div>
                    </div>
               </>}

          </Modal>
     );
};

export default UserDetails;
