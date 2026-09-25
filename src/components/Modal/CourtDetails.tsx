import { Modal } from 'antd';
import React from 'react'
import { Footer } from 'antd/es/layout/layout';
import userimage from '../../assets/icon/user.jpeg'
const CourtDetails = ({ visible, name, onCancel, row }) => {
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
                <div className='facility-image'>
                    <img className='user-image' src={row?.image ? row?.image : userimage} />
                </div>
                <div className='grid-section border-bottom-light'>
                    <div className="grid-item-1">
                        <h4 className='info-label' >Court Name</h4>
                        <p className='info-value' >{row?.name}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Court Type</h4>
                        <p className='info-value' >{row?.type}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Sport Type</h4>
                        <p className='info-value capi' >{row?.game}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Pricing Type</h4>
                        <p className='info-value' >{row?.price_type}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Slot Size</h4>
                        <p className='info-value' >{row?.slot_size}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Slot Price</h4>
                        <p className='info-value' >{row?.slot_price}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Start Time</h4>
                        <p className='info-value' >{row?.start_time}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >End Time</h4>
                        <p className='info-value' >{row?.end_time}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Facility Name</h4>
                        <p className='info-value' >{row?.facility?.name}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Facility Location</h4>
                        <p className='info-value' >{row?.facility?.city ? `${row?.facility?.address},${row?.facility?.city}` : `${row?.facility?.address}`}</p>
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

export default CourtDetails