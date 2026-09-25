import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Button } from 'antd';
import './Modal.css'
import UserLabel from "../../components/Labels/UserLabel";
import SkillLabel from "../../components/Labels/SkillLabel";
import StatusLabel from "../../components/Labels/StatusLabel";
import { Icon } from "@iconify-icon/react";
import moment from 'moment';
import { Footer } from 'antd/es/layout/layout';
import { getAllEventVenuesAPI, getEventVenuesUsersAPI } from '../apiFile/Service';

const AdminUserDetails = ({ visible, name, onConfirm, onCancel, row, venue }) => {
     const loggedInUser = localStorage.getItem("auth");
     const [venues, setVenue] = useState('')

     const getEventVenues = async () => {
          let ven = ''
          venue?.map((data) => {
               row?.venue?.map(item => {
                    if (item == data.value) {
                         ven = ven + data.label + ",\n";
                    }
               })
          })
          setVenue(ven);
     }

     useMemo(() => {
          if (visible == true && row._id) {
               setVenue('')
               getEventVenues()
          }
     }, [visible])

     const customTitle = (
          <div className="custom-ant-modal-header">
               {name}
          </div>
     );

     return (
          <Modal
               title={customTitle}
               visible={visible}
               onOk={onConfirm}
               onCancel={onCancel}
               footer={null}
               className="custom-ant-modal registration-modal lable-content-width"
          >
               <div className='grid-section border-bottom-light'>
                    <div className="grid-item-1">
                         <h4 className='info-label' >Full Name</h4>
                         <p className='info-value' >{row?.firstname + ' ' + row?.lastname}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >role</h4>
                         <p className='info-value' >{row?.adminrole?.name}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Email ID</h4>
                         <p className='info-value text-break' >{row.email}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Phone Number</h4>
                         <p className='info-value' >{row?.mobileno}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Gender</h4>
                         <p className='info-value' >{row.gender}</p>
                    </div>

                    <div className="grid-item">
                         <h4 className='info-label' >Date of Birth</h4>
                         <p className='info-value' >{moment(row?.age_group).format('DD-MM-YYYY')}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Facility</h4>
                         <p className='info-value' >{row?.facility?.name}</p>
                    </div>

                    <div className="grid-item">
                         <h4 className='info-label' >Location</h4>
                         <p className='info-value' >{row?.facility?.address}</p>
                    </div>

                    <div className="grid-item">
                         <h4 className='info-label' >Venues</h4>
                         {venues.split(',')?.map(data => {
                              return (
                                   <><p className='info-value' >{data}</p></>)
                         })}
                    </div >

               </div>
               <Footer className='ant-modal-footer'>
                    <button
                         type="button"
                         className="pi-btn-secondary"
                         onClick={onCancel}
                    >
                         Cancel
                    </button>
               </Footer>
          </Modal >
     );
};

export default AdminUserDetails;
