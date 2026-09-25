import React from 'react'
import { Modal, Button } from 'antd';
import './Modal.css'
import UserLabel from "../../components/Labels/UserLabel";
import SkillLabel from "../../components/Labels/SkillLabel";
import StatusLabel from "../../components/Labels/StatusLabel";
import { Icon } from "@iconify-icon/react";
import moment from 'moment';
import userimage from '../../assets/icon/user.jpeg'

const RegisteredUserDetails = ({ visible, name, onConfirm, onCancel, row }) => {
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
            className="custom-ant-modal registration-modal lable-content-width"
        > {row?.firstname ? <>
            <div className='user-details'>
                <div className='user-image-section'>
                    <div className='user-image-container'>
                        <img className='user-image' src={row?.profile_url ? row?.profile_url : userimage} />
                        <div className='user-skill-label'>
                            <SkillLabel skill={row?.skill_level_new[0]?.skill_level?.label} />
                        </div>
                    </div>
                </div>
                <div className='grid-section'>
                    <div className="grid-item">
                        <h4 className='info-label' >Full Name</h4>
                        <p className='info-value' >{row?.firstname + ' ' + row?.lastname}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Email ID</h4>
                        <p className='info-value text-break' >{row?.email}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Phone Number</h4>
                        <p className='info-value' >{row?.mobileno}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Gender</h4>
                        <p className='info-value' >{row?.gender}</p>

                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Age</h4>
                        <p className='info-value' >{today.diff(row?.age_group, 'years')}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Pincode</h4>
                        <p className='info-value' >{row?.location ? row?.location : '------'}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Games Played</h4>
                        <p className='info-value' >{row?.games ? row?.games : 0}</p>
                    </div>
                </div>
            </div>
        </> : <>
            <div className='grid-section'>
                <div className="grid-item">
                    <h4 className='info-label' >Full Name</h4>
                    <p className='info-value' >{row?.name}</p>
                </div>
                <div className="grid-item">
                    <h4 className='info-label' >Email ID</h4>
                    <p className='info-value text-break' >{row?.email}</p>
                </div>
                <div className="grid-item">
                    <h4 className='info-label' >Phone Number</h4>
                    <p className='info-value' >{row?.phone}</p>
                </div>
                <div className="grid-item">
                    <h4 className='info-label' >Invite Status</h4>
                    <p className='info-value' >{row?.invite_status}</p>
                </div>
            </div>
        </>}

        </Modal>
    )
}

export default RegisteredUserDetails