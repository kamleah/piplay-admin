import { Modal } from 'antd'
import React from 'react'
import moment from 'moment';
import StatusLabel from '../Labels/StatusLabel';
import { Icon } from '@iconify-icon/react';

export default function NewMembershipDetails({ visible, name, onCancel, row }) {
    console.log('row--------', row)
    const customTitle = (
        <div className="custom-ant-modal-header">
            {name}
        </div>
    );
    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };
  return (
    <Modal 
    title={customTitle}
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
        </div>

        <div className="grid-section border-bottom-light">
            <h4 className='info-label' >Membership Details</h4>
            <div>

            </div>
            <div className="grid-item">
                <h4 className='info-label' >Membership Name</h4>
                <p className='info-value' >{row?.name}</p>
            </div>
            <div className="grid-item">
                <h4 className='info-label' >Duration</h4>
                <p className='info-value capi' >{row?.duration}</p>
            </div>
            <div className="grid-item">
                <h4 className='info-label' >Start Date</h4>
                <p className='info-value' >{moment(row?.start_date).format('DD-MM-YYYY')}</p>
            </div>
            <div className="grid-item">
                <h4 className='info-label' >End Date</h4>
                <p className='info-value' >{moment(row?.end_date).format('DD-MM-YYYY')}</p>
            </div>
            <div className="grid-item">
                <h4 className='info-label' >Sports Type</h4>
                <p className='info-value capi' >{row?.sport_type}</p>
            </div>
            <div className="grid-item">
                <h4 className='info-label' >Status</h4>
                <p className='info-value capi' ><StatusLabel status={capitalizeFirstLetter(row?.status)} /></p>
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
                <p className='info-value' >{(Math.ceil((row?.discount) / 100) + Math.ceil((row?.price) / 100))}</p>
            </div>
            <div className="grid-item">
                <h4 className='info-label' >Discounted</h4>
                <p className='info-value' >{row?.discount}</p>
            </div>
            <div className="grid-item">
                <h4 className='info-label' >Paid Amount</h4>
                <p className='info-value' >{Math.ceil((row?.price) / 100)}</p>
            </div>
            <div className="grid-item">
                <h4 className='info-label' >Payment Status</h4>
                <p className='info-value' >{row?.payment_status}</p>
            </div>
            <div className="grid-item col-span-2 col-span-2-sm-keep">
                        <h4 className='info-label' >Short Description</h4>
                       <div className="compact-table-container">
                            <table className="compact-table text-left last-child-center">
                            <thead>
                                <tr>
                                    <th>Descriptions</th>
                                    <th>Availability</th>
                                </tr>
                            </thead>
                            <tbody>
                                {row?.description?.map((item: any, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item?.name}</td>
                                            <td>{item.active == true ? <Icon icon="ion:checkmark-sharp" width="20" height="20" /> : <Icon icon="ion:close-sharp" width="20" height="20" />}</td>
                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                        </table>
                       </div>
                    </div>
        </div>
    </div>
</Modal>
  )
}
