import { Modal} from 'antd';
import React from 'react'
import { Footer } from 'antd/es/layout/layout';
import userimage from '../../assets/icon/user.jpeg'
import formatWeekdays from '../Helpers/formatWeekdays';

const DebitCreditDetails = ({ visible, name, onCancel, row }) => {
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
               className="custom-ant-modal "
          >
               <div className='grid-sec border-bottom-light'>
                    <div className="grid-item">
                         <h4 className='info-label' >User Id</h4>
                         <p className='info-value text-break' >{row?.userId}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Transaction Id</h4>
                         <p className='info-value' >{row?.id}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Transaction Type</h4>
                         <p className='info-value' >{row?.txnType}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Previous Balance</h4>
                         <p className='info-value' >{row?.newBalance - row?.amount}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Amount {row?.txnType === "DEBIT" ? "Debited" : "Credited"}</h4>
                         <p className='info-value' >{row?.amount}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >New Balance</h4>
                         <p className='info-value' >{row?.newBalance}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Reference/Reason</h4>
                         <p className='info-value' >{row?.reference}</p>
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

export default DebitCreditDetails