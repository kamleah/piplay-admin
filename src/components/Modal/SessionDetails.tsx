
import { Collapse, Modal } from 'antd';
import React, { useState } from 'react'
import { Footer } from 'antd/es/layout/layout';
import userimage from '../../assets/icon/user.jpeg'
import moment from 'moment';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
const { Panel } = Collapse;

const SessionDetails = ({ visible, name, onCancel, row }) => {
     const [accordionActiveKey, setAccordionActiveKey] = useState(['1']);
     const customTitle = (
          <div className="custom-ant-modal-header">
               {name}
          </div>
     );
     const handleAccordionChange = (keys) => {
          setAccordionActiveKey(keys);
     };
     return (
          <Modal title={customTitle}
               visible={visible}
               onCancel={onCancel}
               footer={null}
               className="custom-ant-modal"
               width={'400px'}

          >
               <div>
                    <div className='grid-section border-bottom-light'>
                         <div className="grid-item col-span-2 col-span-2-sm-keep">
                              <h4 className='info-label'>Title</h4>
                              <p className='info-value' >{row?.title}</p>
                         </div>
                         <div className="grid-item col-span-2 col-span-2-sm-keep">
                              <h4 className='info-label' >Subtitle</h4>
                              <p className='info-value' >{row?.sub_title}</p>
                         </div>
                         <div className="grid-item col-span-2 col-span-2-sm-keep">
                              <h4 className='info-label' >Price</h4>
                              <p className='info-value' >{row?.price}</p>
                         </div>
                         <div className="grid-item col-span-2 col-span-2-sm-keep">
                              <h4 className='info-label' >Program</h4>
                              <p className='info-value' >{row?.program?.title}</p>
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

export default SessionDetails