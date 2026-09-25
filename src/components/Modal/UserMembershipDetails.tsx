import { Modal } from 'antd'
import React from 'react'
import moment from 'moment';
import StatusLabel from '../Labels/StatusLabel';

export default function UserMembershipDetails({ visible, name, onCancel, row }) {
    console.log('row-----', row)
    const customTitle = (
        <div className="custom-ant-modal-header">
            {name}
        </div>
    );
    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0)?.toUpperCase() + string.slice(1)?.toLowerCase();
    };
  return (
    <Modal title={customTitle}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            className="custom-ant-modal registration-modal lable-content-width"
        >
            <div>
                <div className='grid-section border-bottom-light'>
                    <div className="grid-item-1">
                        <h4 className='info-label' >Facility Name  </h4>
                        <p className='info-value' >{row?.facility_id?.name}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Facility Location</h4>
                        <p className='info-value' >{row?.facility_id?.address}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Player Name</h4>
                        <p className='info-value' >{row?.user_id?.firstname} {row?.user_id?.lastname}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Mobile Number</h4>
                        <p className='info-value' >{row?.facility_id?.mobileno[0]}</p>
                    </div>
                </div>

                <div className="grid-section border-bottom-light">
                    <h4 className='info-label' >Membership Details</h4>
                    <div>

                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Membership Name</h4>
                        <p className='info-value' >{row?.membership_id?.name}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Duration</h4>
                        <p className='info-value capi' >{row?.membership_id?.duration}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Start Date</h4>
                        <p className='info-value' >{moment(row?.membership_id?.start_date).format('DD-MM-YYYY')}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >End Date</h4>
                        <p className='info-value' >{moment(row?.membership_id?.end_date).format('DD-MM-YYYY')}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Sports Type</h4>
                        <p className='info-value capi' >{row?.membership_id?.sport_type}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Status</h4>
                        <p className='info-value capi' ><StatusLabel status={capitalizeFirstLetter(row?.membership_id?.status)} /></p>
                    </div>
                </div>
                <div className="grid-section">
                    <h4 className='info-label' >Payment Details</h4>
                    <div>

                    </div>
                    <div className="grid-item-1">
                        <h4 className='info-label' >Transaction ID</h4>
                        <p className='info-value' >{row?.razorpay_order_id}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Original Amount</h4>
                        <p className='info-value' >{(Math.ceil((row?.discount_amount) / 100) + Math.ceil((row?.price) / 100))}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Discounted</h4>
                        <p className='info-value' >{Math.ceil((row?.discount_amount) / 100)}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Paid Amount</h4>
                        <p className='info-value' >{Math.ceil((row?.price) / 100)}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Payment Status</h4>
                        <p className='info-value' >{row?.payment_status}</p>
                    </div>
                </div>
            </div>
        </Modal>
  )
}
