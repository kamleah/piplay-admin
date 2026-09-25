
import { Modal } from 'antd';
import React from 'react'
import { Footer } from 'antd/es/layout/layout';
import userimage from '../../assets/icon/user.jpeg'
import moment from 'moment';
import StatusLabel from '../Labels/StatusLabel';
const BannersDetails = ({ visible, name, onConfirm, onCancel, row }) => {
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
                <div className='Banner-image'>
                    <img className='user-image' src={row?.image ? row?.image : userimage} />
                </div>
                <div className='grid-section border-bottom-light'>
                    <div className="grid-item-1">
                        <h4 className='info-label' > Name</h4>
                        <p className='info-value' >{row?.title}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Position</h4>
                        <p className='info-value' >{row?.position}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Start date</h4>
                        <p className='info-value' >{row?.start ? moment(row?.start).format('ddd, D MMM YYYY') : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Status</h4>
                        <p className='info-value' > <StatusLabel
                            status={row?.active == true ?
                                moment(row?.start).format('DD-MM-YYYY') > moment().format('DD-MM-YYYY') ? "Scheduled" :
                                    'Active' :
                                "Inactive"}
                        /></p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' > Type</h4>
                        <p className='info-value capi' >{row?.url_type ? row?.url_type : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Redirect URL</h4>
                        <p className='info-value' >{row?.redirect_url ? row?.redirect_url : "____"}</p>
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

export default BannersDetails