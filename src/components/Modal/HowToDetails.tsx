import { Collapse, Modal } from 'antd';
import React, { useState } from 'react'
import { Footer } from 'antd/es/layout/layout';
import userimage from '../../assets/icon/user.jpeg'
import moment from 'moment';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import CoachLabel from '../Labels/CoachLabel';
const { Panel } = Collapse;

const HowToDetails = ({ visible, name, onCancel, row }) => {
     const customTitle = (
          <div className="custom-ant-modal-header">
               {name}
          </div>
     );
     return (
          <>
               {visible &&
                    <Modal title={customTitle}
                         visible={visible}
                         onCancel={onCancel}
                         footer={null}
                         className="custom-ant-modal registration-modal lable-content-width"
                    >
                         <div>
                              <div className='Banner-image banner-yt'>
                                   <iframe width={'100%'} height={'100%'} className='yt-iframe' src={`https://www.youtube.com/embed/${row?.youtube_url}`}></iframe>
                              </div>
                              <div className='grid-section border-bottom-light'>
                                   <div className="grid-item-1">
                                        <h4 className='info-label'>Title</h4>
                                        <p className='info-value' >{row?.title}</p>
                                   </div>
                                   <div className="grid-item">
                                        <h4 className='info-label' >Category</h4>
                                        <p className='info-value' >{row?.category}</p>
                                   </div>
                                   <div className="grid-item">
                                        <h4 className='info-label' >Sport Type</h4>
                                        <p className='info-value' >{row?.sport_type}</p>
                                   </div>
                                   <div className="grid-item">
                                        <h4 className='info-label' >Date</h4>
                                        <p className='info-value' >{moment(row?.createdAt).format('ddd, D MMM YY ')}</p>
                                   </div>
                                   <div className="grid-item">
                                        <h4 className='info-label' >YouTube URL</h4>
                                        <p className='info-value' >{row?.youtube_url}</p>
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
               }
          </>
     )
}

export default HowToDetails;