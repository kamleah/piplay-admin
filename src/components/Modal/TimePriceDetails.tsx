import { Modal } from 'antd';
import React from 'react'
import { Footer } from 'antd/es/layout/layout';
import userimage from '../../assets/icon/user.jpeg'
import formatWeekdays from '../Helpers/formatWeekdays';
import { RiDeleteBin5Fill } from 'react-icons/ri';
const TimePriceDetails = ({ visible, name, onCancel, row }) => {
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
                         <h4 className='info-label' >Start Time</h4>
                         <p className='info-value' >{row?.start_time}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >End Time</h4>
                         <p className='info-value' >{row?.end_time}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Break Start Time</h4>
                         <p className='info-value' >{row?.break_start_time}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Break End Time</h4>
                         <p className='info-value' >{row?.break_end_time}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Slot Size</h4>
                         <p className='info-value' >{row?.slot_size} min.</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Slot Price</h4>
                         <p className='info-value' >₹ {row?.slot_price}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Active Days</h4>
                         <p className='info-value' >{formatWeekdays(row?.active_days)}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Active Start Date</h4>
                         <p className='info-value' >{row?.active_start_date}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Active End Date</h4>
                         <p className='info-value' >{row?.active_end_date}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Extend Slots</h4>
                         <p className='info-value' >{row?.extend ? 'Yes' : 'No'}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Reschedule</h4>
                         <p className='info-value' >{row?.reschedule}</p>
                    </div>
                    {row?.reschedule === 'Reshedule With Rule' &&
                         <div className="grid-item">
                              <h4 className='info-label' >Rule</h4>
                              <p className='info-value' >{row?.r_rules}</p>
                         </div>}
                    {(row?.reschedule === 'Reshedule With Rule' && row?.r_rules === 'Flat Charge') &&
                         <div className="grid-item">
                              <h4 className='info-label' >Charge</h4>
                              <p className='info-value' >{row?.flat_charge}</p>
                         </div>}
                    {(row?.reschedule === 'Reshedule With Rule' && (row?.r_rules == '1st Reschedule is free' || row?.r_rules === 'Before Time % Charged')) &&
                         <div className="input-group col-span-2 justify-center">
                              <div className="compact-table-container">

                                   <table className="compact-table">
                                        <thead>
                                             <tr>
                                                  <th>Reschedule Rule (in hrs)</th>
                                                  <th>Reschedule Condition</th>
                                             </tr>
                                        </thead>
                                        <tbody>

                                             {row.r_conditions?.map((item: any, index) => {
                                                  return (
                                                       <tr key={index}>
                                                            <td>{item?.time} hrs</td>
                                                            <td>{item?.percentage}%</td>
                                                       </tr>
                                                  )
                                             })
                                             }
                                        </tbody>
                                   </table>
                              </div>
                         </div>
                    }

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

export default TimePriceDetails