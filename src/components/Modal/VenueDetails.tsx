import { Modal } from 'antd';
import React from 'react'
import { Footer } from 'antd/es/layout/layout';
import userimage from '../../assets/icon/user.jpeg'
const VenueDetails = ({ visible, name, onConfirm, onCancel, row }) => {
    const customTitle = (
        <div className="custom-ant-modal-header">
            {name}
        </div>
    );

    return (
        <Modal title={customTitle}
            visible={visible}
            onOk={onConfirm}
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
                        <h4 className='info-label' > Name</h4>
                        <p className='info-value' >{row?.name}</p>
                    </div>
                    <div className="grid-item-1">
                        <h4 className='info-label' > POC </h4>
                        <p className='info-value' >{row?.poc ? row?.poc : "___"}</p>
                    </div>
                    {/* <div className="grid-item">
                        <h4 className='info-label' >Facility</h4>
                        <p className='info-value'>{row?.facility?.name}</p>
                        <p className='info-value'>{row?.facility?.contactInfo?.phone}</p>
                        <p className='info-value'>{row?.facility?.contactInfo?.email}</p>
                    </div> */}
                    <div className="grid-item">
                        <h4 className='info-label' >Phone Number</h4>
                        <p className='info-value' >{row?.phone_no ? row?.phone_no : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Alternate Number</h4>
                        <p className='info-value' >{row?.alt_phone_no ? row?.alt_phone_no : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Sport Type</h4>
                        <p className='info-value capi' >{row?.sport_type ? row?.sport_type : "___"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Address</h4>
                        <p className='info-value text-break' >{`${row?.location_city},${row?.location_state},${row?.pincode ? row?.pincode : ""}`}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Latitude </h4>
                        <p className='info-value' >{row?.location?.lat && row?.location?.lat}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Longtitude </h4>
                        <p className='info-value' >{row?.location?.lon ? row?.location?.lon : row?.location?.longitude}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Ratings </h4>
                        <p className='info-value' >{row?.ratings ? row?.ratings : "___"}</p>
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

export default VenueDetails