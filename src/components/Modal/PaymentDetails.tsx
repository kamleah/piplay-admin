import { Modal } from 'antd';
import React, { useEffect, useState } from 'react'
import { Footer } from 'antd/es/layout/layout';
import userimage from '../../assets/icon/user.jpeg'
import piPlayLogo from '../../assets/icon/logo512.png'
import moment from 'moment';
import { detailPaymentConfigAPI } from '../apiFile/Service';
const PaymentDetails = ({ visible, name, onCancel, razorId }) => {
    const loggedInUser = localStorage.getItem("auth");
    const [paydetails, setPayDetails] = useState<any>();

    const paymentDetails = async () => {
        const response = await detailPaymentConfigAPI(loggedInUser, razorId);
        if (response.code == "SUCCESS") {
            setPayDetails(response?.data)
        }
    };

    useEffect(() => {
        if (visible == true) {
            paymentDetails()
        } else{
            setPayDetails(null)
        }
    }, [visible])

    const customTitle = (
        <div className="custom-ant-modal-header">
            {name}
        </div>
    );
    
    return (
        <Modal title={customTitle}
            visible={visible}
            // onOk={onConfirm}
            onCancel={onCancel}
            footer={null}
            width={"50%"}
            className="custom-ant-modal "
        >

            <div className='border-bottom-light'>
                <div className='grid-sec'>
                    <div className="grid-item">
                        <h4 className='info-label' >ID</h4>
                        <p className='info-value' >{paydetails?.id ? paydetails?.id : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Order Id</h4>
                        <p className='info-value' >{paydetails?.order_id ? paydetails?.order_id : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Contact</h4>
                        <p className='info-value' >{paydetails?.contact ? paydetails?.contact : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Email</h4>
                        <p className='info-value' >{paydetails?.email ? paydetails?.email : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Amount</h4>
                        <p className='info-value' >{paydetails?.amount ? paydetails?.amount/100 : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Amount Status</h4>
                        <p className='info-value' >{paydetails?.refund_status ? paydetails?.refund_status : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Amount Refunded</h4>
                        <p className='info-value' >{paydetails?.amount_refunded ? paydetails?.amount_refunded : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Currency</h4>
                        <p className='info-value' >{paydetails?.currency ? paydetails?.currency : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >VPA</h4>
                        <p className='info-value' >{paydetails?.vpa ? paydetails?.vpa : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Method</h4>
                        <p className='info-value capi' >{paydetails?.method ? paydetails?.method : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Status</h4>
                        <p className='info-value capi' >{paydetails?.status ? paydetails?.status : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Bank</h4>
                        <p className='info-value' >{paydetails?.bank ? paydetails?.bank : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Card Id</h4>
                        <p className='info-value' >{paydetails?.card_id ? paydetails?.card_id : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Error Code</h4>
                        <p className='info-value' >{paydetails?.error_code ? paydetails?.error_code : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Error Description</h4>
                        <p className='info-value' >{paydetails?.error_description ? paydetails?.error_description : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Error Reason</h4>
                        <p className='info-value' >{paydetails?.error_reason ? paydetails?.error_reason : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Created At</h4>
                        <p className='info-value' >{paydetails?.created_at ?  moment.unix(paydetails?.created_at).format('DD-MM-YYYY hh:mm A') : "____"}</p>
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

export default PaymentDetails