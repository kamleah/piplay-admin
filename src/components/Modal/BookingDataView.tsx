import { Modal } from 'antd';
import React from 'react';
import { Footer } from 'antd/es/layout/layout';
import moment from 'moment';

function BookingDataView({ visible, name, onCancel, row }) {
    const customTitle = (
        <div className="custom-ant-modal-header">
            {name}
        </div>
    );

    return (
        <Modal
            title={customTitle}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            className="custom-ant-modal"
            width={'600px'}
        >
            <div className="grid-section border-bottom-light">
                <div className="grid-item ">
                    <h4 className='info-label'>Booking Date</h4>
                    <p className='info-value'>{row?.booking_date ?? 'N/A'}</p>
                </div>
                <div className="grid-item ">
                    <h4 className='info-label'>Facility Name</h4>
                    <p className='info-value'>{row?.facility?.name ?? 'N/A'}</p>
                </div>
                <div className="grid-item ">
                    <h4 className='info-label'>User </h4>
                    <p className='info-value'>{`${row?.userData?.firstname} ${row?.userData?.lastname}` || 'N/A'}</p>
                </div>
               
                <div className="grid-item">
                    <h4 className='info-label'>BookedOn</h4>
                    <p className='info-value'>{moment(row?.createdAt).format("DD-MM-YYYY  hh:mm A") ?? 'N/A'}</p>
                </div>
                <div className="grid-item ">
                    <h4 className='info-label'>Booking Status</h4>
                    <p className='info-value'>{row?.status ?? 'N/A'}</p>
                </div>
                <div className="grid-item ">
                    <h4 className='info-label'>Start Time</h4>
                    <p className='info-value'>{moment(row?.start_time, "HH:mm").format('hh:mm A') ?? 'N/A'}</p>
                </div>

                <div className="grid-item ">
                    <h4 className='info-label'>End Time</h4>
                    <p className='info-value'>{ moment(row?.end_time, "HH:mm").format('hh:mm A') ?? 'N/A'}</p>
                </div>
                <div className="grid-item ">
                    <h4 className='info-label'>RazorID</h4>
                    <p className='info-value'>{row?.razor_id ?? 'N/A'}</p>
                </div>
                <div className="grid-item ">
                    <h4 className='info-label'>Payment Status</h4>
                    <p className='info-value'>{row?.payment_status ?? 'N/A'}</p>
                </div>

                <div className="grid-item ">
                    <h4 className='info-label'>OrderId</h4>
                    <p className='info-value'>{row?.total_amount / 100 ? row?.total_amount / 100 :'N/A'}</p>
                </div>
                <div className="grid-item ">
                    <h4 className='info-label'>Booking Status</h4>
                    <p className='info-value'>{row?.status ?? 'N/A'}</p>
                </div>

                {/* <div className="grid-item ">
                    <h4 className='info-label'>Booking Status</h4>
                    <p className='info-value'>{row?.status ?? 'N/A'}</p>
                </div>
                <div className="grid-item ">
                    <h4 className='info-label'>Booking Status</h4>
                    <p className='info-value'>{row?.status ?? 'N/A'}</p>
                </div>
                <div className="grid-item ">
                    <h4 className='info-label'>Booking Status</h4>
                    <p className='info-value'>{row?.status ?? 'N/A'}</p>
                </div> */}
                
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

export default BookingDataView;