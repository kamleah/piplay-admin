import { Modal } from 'antd';
import React from 'react'
import { Footer } from 'antd/es/layout/layout';
import userimage from '../../assets/icon/user.jpeg'
import moment from 'moment';
import StatusLabel from '../Labels/StatusLabel';
const NotificationDetails = ({ visible, name, onCancel, row }) => {
     const customTitle = (
          <div className="custom-ant-modal-header">
               {name}
          </div>
     );

     const datetimeDifference = (startDate, endDate) => {
          const start = moment(startDate);
          const end = moment(endDate);

          if (!start.isValid() || !end.isValid()) {
               return "Invalid date";
          };

          return end.diff(start, 'days');
     };


     return (
          <Modal title={customTitle}
               visible={visible}
               onCancel={onCancel}
               footer={null}
               className="custom-ant-modal registration-modal lable-content-width"
          >

               <div className='grid-section border-bottom-light'>
                    {row?.imageURL && <div className="grid-item">
                         <div className='facility-image'>
                              <img className='user-image' src={row?.imageURL ? row?.imageURL : userimage} />
                         </div>
                    </div>}
                    <div className="grid-item">
                         <h4 className='info-label' >ID</h4>
                         <p className='info-value' >{row?._id}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Title</h4>
                         <p className='info-value' >{row?.title}</p>
                    </div>
                    <div className="grid-item-1">
                         <h4 className='info-label' >Date & Time</h4>
                         <p className='info-value' >{moment(row?.dateTime).format("DD-MM-YYYY  hh:mm A")}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >URL</h4>
                         <p className='info-value' >{row?.redirectURL ? row?.redirectURL : "N/A"}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Type</h4>
                         <p className='info-value' >{row?.notificationType}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Active Days</h4>
                         <p className='info-value' >{datetimeDifference(row?.dateTime, row?.expiry)}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Status</h4>
                         <StatusLabel status={row.status} />
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Customer Recieved</h4>
                         <p className='info-value' >{row?.recieved || 0}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Failed</h4>
                         <p className='info-value' >{row?.failed || 0}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Clicked</h4>
                         <p className='info-value' >{row?.clicked || 0}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Description</h4>
                         <p className='info-value' >{row?.description}</p>
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

export default NotificationDetails