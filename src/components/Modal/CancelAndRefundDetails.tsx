import { Modal } from 'antd';
import React from 'react'
import { Footer } from 'antd/es/layout/layout';
import moment from 'moment';

export default function CancelAndRefundDetails({ visible, name, onCancel, row }) {    
    const customTitle = (
        <div className="custom-ant-modal-header">
            {name}
        </div>
    );

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
                        <h4 className='info-label' >Booked On</h4>
                        <p className='info-value' >{moment(row?.createdAt).format("DD-MM-YYYY  hh:mm A")}</p>
                    </div>
                    <div className="grid-item-1">
                        <h4 className='info-label' >Facility Name</h4>
                        <p className='info-value' >{row?.facility?.name}</p>
                    </div>
                    <div className="grid-item-1">
                        <h4 className='info-label' > User Name </h4>
                        <p className='info-value' >{`${row?.userData?.firstname} ${row?.userData?.lastname}`}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Booking Date</h4>
                        <p className='info-value' >{row?.booking_date}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Booking Status</h4>
                        <p className='info-value' >{row?.status}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Start Time</h4>
                        <p className='info-value capi' >{moment(row?.start_time, "HH:mm").format('hh:mm A')}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >End Time</h4>
                        <p className='info-value text-break' >{moment(row?.end_time, "HH:mm").format('hh:mm A')}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >RazorID</h4>
                        <p className='info-value' >{row?.razor_id}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Payment Status </h4>
                        <p className='info-value' >{row?.payment_status}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >OrderId </h4>
                        <p className='info-value' >{row?.razorpay_order_id}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Amount </h4>
                        <p className='info-value' >{row?.total_amount / 100}</p>
                    </div>
                </div>
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
        </Modal>
    )
}