
import { Collapse, Modal } from 'antd';
import React, { useState } from 'react'
import { Footer } from 'antd/es/layout/layout';
import userimage from '../../assets/icon/user.jpeg'
import moment from 'moment';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import CoachLabel from '../Labels/CoachLabel';
const { Panel } = Collapse;

const CoachingProgarmDetails = ({ visible, name, onCancel, row }) => {
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
               className="custom-ant-modal registration-modal lable-content-width"
          >
               <div>
                    <div className='Banner-image'>
                         <img className='user-image' src={row?.image ? row?.image : userimage} />
                    </div>
                    <div className='grid-section border-bottom-light'>
                         <div className="grid-item-1">
                              <h4 className='info-label'>Title</h4>
                              <p className='info-value' >{row?.title}</p>
                         </div>
                         <div className="grid-item">
                              <h4 className='info-label' >Coach</h4>
                              <p className='info-value' ><CoachLabel coachData={row?.coach} /></p>
                         </div>
                         <div className="grid-item">
                              <h4 className='info-label' >Start date</h4>
                              <p className='info-value' >{row?.start ? moment(row.start).format('DD/MM/YYYY') : "____"}</p>
                         </div>
                         <div className="grid-item">
                              <h4 className='info-label' >End date</h4>
                              <p className='info-value' >{row?.end ? moment(row.end).format('DD/MM/YYYY') : "____"}</p>
                         </div>
                         <div className="grid-item">
                              <h4 className='info-label' >Sport Type</h4>
                              <p className='info-value' >{row?.sport_type}</p>
                         </div>
                         <div className="grid-item">
                              <h4 className='info-label' >Facility</h4>
                              <p className='info-value' >{row?.facility?.name}</p>
                         </div>
                         <div className="grid-item col-span-2 col-span-2-sm-keep ">
                              <Collapse
                                   accordion
                                   activeKey={accordionActiveKey}
                                   onChange={handleAccordionChange}
                                   expandIconPosition="right"
                                   expandIcon={({ isActive }) => (
                                        <strong style={{ fontWeight: 'bold' }}>
                                             {isActive ? <MinusOutlined /> : <PlusOutlined />}
                                        </strong>
                                   )}            >
                                   <Panel header={<strong>Description</strong>} key="1">
                                        <p className='info-value'>{row?.description ? <><div dangerouslySetInnerHTML={{ __html: row?.description }} /></> : "___"}</p>
                                   </Panel>
                                   <Panel header={<strong>Terms & Conditions</strong>} key="3">
                                        <p className='info-value'>{row?.tandc ? <><div dangerouslySetInnerHTML={{ __html: row?.tandc }} /></> : "___"}</p>
                                   </Panel>
                              </Collapse>
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

export default CoachingProgarmDetails