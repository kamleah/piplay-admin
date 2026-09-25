import { Modal } from 'antd';
import React from 'react'
import { Footer } from 'antd/es/layout/layout';
import userimage from '../../assets/icon/user.jpeg'
import formatWeekdays from '../Helpers/formatWeekdays';
import { RiDeleteBin5Fill } from 'react-icons/ri';
const ClosingDayDetails = ({ visible, name, onCancel, row }) => {
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
               className="custom-ant-modal lable-content-width"
          >

               <div className='grid-section border-bottom-light'>
                    <div className="grid-item">
                         <h4 className='info-label' >Facility Name</h4>
                         <p className='info-value' >{row?.facility?.name}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Facility Location</h4>
                         <p className='info-value' >{row?.facility?.city ? `${row?.facility?.address},${row?.facility?.city}` : `${row?.facility?.address}`}</p>
                    </div>
                    <div className="grid-item-1">
                         <h4 className='info-label' >Court Name</h4>
                         <p className='info-value' >{row?.court?.name}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Date</h4>
                         <p className='info-value' >{row?.active_start_date}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Sport Type</h4>
                         <p className='info-value capi' >{row?.court?.game}</p>
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

export default ClosingDayDetails