import { Modal} from 'antd';
import React from 'react'
import { Footer } from 'antd/es/layout/layout';
import userimage from '../../assets/icon/user.jpeg'
import formatWeekdays from '../Helpers/formatWeekdays';

const CoachDetails = ({ visible, name, onCancel, row }) => {
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
                    <div className='grid-item span-row-3 col-span-3-sm'>

                         <div className='offer-image'>
                              <img className='user-image' src={row?.image ? row?.image : userimage} />
                         </div>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Coach Name</h4>
                         <p className='info-value' >{row?.name}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Languages</h4>
                         <p className='info-value' >{row?.languages?.map((item: any) => item).join(', ')}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Days</h4>
                         <p className='info-value' >{formatWeekdays(row?.days)}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Sport Type</h4>
                         <p className='info-value' >{typeof row?.sport_type == 'string' ? row?.sport_type : row?.sport_type?.map((item: any) => item).join(' & ')}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Start Time</h4>
                         <p className='info-value' >{row?.start_time}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >End Time</h4>
                         <p className='info-value' >{row?.end_time}</p>
                    </div>
                    {/* <div className="grid-item">
                         <h4 className='info-label' >Experience</h4>
                         <p className='info-value' >{row?.experience}</p>
                    </div> */}
                   
                    <div className="grid-item col-span-2">
                         <h4 className='info-label' >Email ID</h4>
                         <p className='info-value text-break ' >{row?.email ? row?.email : "___"}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Phone Number</h4>
                         <p className='info-value' >{row?.mobileno}</p>
                    </div>
                    <div className="grid-item  col-span-3-sm col-span-3">
                         <h4 className='info-label' >Bio</h4>
                         <p className='info-value'>{row?.bio ? <><div dangerouslySetInnerHTML={{ __html: row?.bio }} /></> : "___"}</p>
                    </div>
                    <div className="grid-item  col-span-3-sm col-span-3">
                         <h4 className='info-label' >Extra Info</h4>
                         <p className='info-value'>{row?.extra_info ? <><div dangerouslySetInnerHTML={{ __html: row?.extra_info }} /></> : "___"}</p>
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

export default CoachDetails