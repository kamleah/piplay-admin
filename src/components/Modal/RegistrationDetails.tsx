import React, { useEffect } from 'react';
import { Modal, Button } from 'antd';
import './Modal.css'
import UserLabel from "../../components/Labels/UserLabel";
import SkillLabel from "../../components/Labels/SkillLabel";
import StatusLabel from "../../components/Labels/StatusLabel";
import { Icon } from "@iconify-icon/react";
import moment from 'moment';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';

const RegistrationDetails = ({ visible, name, onConfirm, onCancel, row, matches }) => {     

     const customTitle = (
          <div className="custom-ant-modal-header">
               {name}
          </div>
     );

     const totalAmount = () => {
          if(row?.selected_package){
               return row?.selected_package?.base_price;
          }else{
               return row?.team ? row?.tournament?.price * 2 : row?.tournament?.price;
          }
     }

     const discountAmount = () => {
          return row?.coupon ? totalAmount() * (row.percentage / 100) : 0;
     }

     const netAmount = () => {
          return totalAmount() - discountAmount();
     }

     const taxAmount = () => {
          return (netAmount() * 0.18).toFixed(2);
     }

     const totalAmountWithTax = () => {
          return Number(netAmount()) + Number(taxAmount());
     }
     const copyToClipboard = (text) => {
          navigator.clipboard
               .writeText(text)
               .then(() => {
                    toast(<ToastMessage body={"Copied Successfully"} type="success" />, {
                         position: "top-right",
                         autoClose: 5000,
                         hideProgressBar: true,
                         closeOnClick: true,
                         pauseOnHover: true,
                         draggable: true,
                    });
               })
               .catch((error) => {
                    console.error("Failed to copy ID to clipboard:", error);
               });
     };

     const PlayerDetails = (() => {
          return (
               <div className="grid-section">
                    <div className="col-span-2-sm-keep">
                         <h4 className="info-label">Regn. ID<Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} onClick={() => copyToClipboard(row?._id)} /></h4>
                         <p className="info-value text-break">
                              {row?._id}
                         </p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className="info-label">Host Name:</h4>
                         <UserLabel userType='host' userData={row?.host} />
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Teammate</h4>
                         {row?.partner?.firstname ?
                              <UserLabel userType='invited' userData={row?.partner} /> :
                              <UserLabel userType='partner' userData={row?.partner} />

                         }
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Teammate From </h4>
                         <p className='info-value' >{row?.manual ? 'Manual' : row?.partner_from}</p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Teammate Status</h4>
                         {row.manual ? row.partner_from == 'list' ? <StatusLabel status={row?.partner_status} /> : <StatusLabel status={row?.partner.invite_status} /> : row?.partner_status ? <StatusLabel status={row?.partner_status} /> : 'Finding'}
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Booking Date</h4>
                         <p className='info-value' >{moment(row?.createdAt).format('DD-MM-YYYY')}</p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Player Name</h4>
                         <p className='info-value' ></p>
                    </div>
               </div>
          )
     })

     const EventDetails = (() => {
          return (
               <div className="grid-section">
                    {!matches &&
                         <div className="col-span-2 col-span-2-sm-keep">
                              <h4 className="section-heading">Event Details</h4>
                         </div>
                    }
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Event Name</h4>
                         <p className='info-value' >{row?.tournament?.tournament_name}</p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Event Club</h4>
                         <p className='info-value' >{row?.venue?.name}</p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Event Location</h4>
                         <p className='info-value' >{row?.venue?.address}</p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Event Category</h4>
                         <p className='info-value' >{row?.tournament?.tournament_type}</p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Slot Timing</h4>
                         <p className='info-value' >{moment(row?.tournament?.start_time, "HH:mm").format("hh:mm A")} to {moment(row?.tournament?.end_time, "HH:mm").format("hh:mm A")}</p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <div className="grid-item">
                              <h4 className='info-label' >Sports Type</h4>
                              <p className='info-value' >{row?.venue?.sport_type}</p>
                         </div>
                    </div>
               </div>
          )
     })

     const PaymentDetails = (() => {
          return (
               <div className="grid-section">
                    {!matches &&
                         <div className="col-span-2 col-span-2-sm-keep">
                              <h4 className="section-heading">Payment Details</h4>
                         </div>
                    }
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Transaction ID</h4>
                         <p className='info-value' >{row?.razorpay_order_id}</p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Paid Amount </h4>
                         <p className='info-value' > {totalAmountWithTax()} /-</p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Total Amount</h4>
                         <p className='info-value' >{totalAmount()}/-</p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Discount</h4>
                         <p className='info-value'> {discountAmount()} /-</p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Coupon Code</h4>
                         <p className='info-value' >{row?.coupon ? row?.coupon_name + ` (${row?.percentage}%)` : 'Not Applied'}</p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Payment Status </h4>
                         <StatusLabel
                              status={row?.payment_status == 'Completed' ? 'Success' : row?.payment_status}
                         />
                    </div>
               </div>
          )
     })

     const SingleCategoryDetails = (() => {
          return (
               <div className="grid-section">
                    {!matches &&
                         <div className="col-span-2 col-span-2-sm-keep">
                              <h4 className="section-heading">Single Category Details</h4>
                         </div>
                    }
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Maximum Registers</h4>
                         <p className='info-value'></p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Select Tag</h4>
                         <p className='info-value'></p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Event Level</h4>
                         <p className='info-value'><SkillLabel skill={row?.tournament?.tournament_level?.label} /></p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Start Date</h4>
                         <p className='info-value'>{moment(row?.tournament?.start_date).format('DD-MM-YYYY')}</p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >End Date</h4>
                         <p className='info-value'>{moment(row?.tournament?.end_date).format('DD-MM-YYYY')}</p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Start Time</h4>
                         <p className='info-value'></p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >End Time</h4>
                         <p className='info-value'></p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Last Date Of Registration</h4>
                         <p className='info-value'>{moment(row?.tournament?.last_day_for_registration).format('DD-MM-YYYY')}</p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Event Rewards</h4>
                         <p className='info-value'>{row?.tournament?.rewards}</p>
                    </div>
               </div>
          )
     })

     const PackageDetailsBulkRegistration = (() => {
          return (
               <div className="grid-section">
                    {!matches &&
                         <div className="col-span-2 col-span-2-sm-keep">
                              <h4 className="section-heading">Package Details(Bulk Registration)</h4>
                         </div>
                    }
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Package Name</h4>
                         <p className='info-value'>{row?.selected_package?.name}</p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >No.of Players</h4>
                         <p className='info-value'>{row?.selected_package?.number_of_users}</p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Price</h4>
                         <p className='info-value'>{row?.selected_package?.base_price}</p>
                    </div>
               </div>
          )
     })

     const Pricing = (() => {
          return (
               <div className="grid-section">
                    {!matches &&
                         <div className="col-span-2 col-span-2-sm-keep">
                              <h4 className="section-heading">Pricing</h4>
                         </div>
                    }
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Price Per Player</h4>
                         <p className='info-value'></p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Price Per Team</h4>
                         <p className='info-value'></p>
                    </div>
               </div>
          )
     })

     const AddOns = (() => {
          return (
               <div className="grid-section">
                    {!matches &&
                         <div className="col-span-2 col-span-2-sm-keep">
                              <h4 className="section-heading">Add Ons</h4>
                              <h4 className="equipment-title">Equipment 1</h4>
                         </div>
                    }
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Name</h4>
                         <p className='info-value'></p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Price</h4>
                         <p className='info-value'></p>
                    </div>
                    <div className="col-span-2-sm-keep">
                         <h4 className='info-label' >Extra Info</h4>
                         <p className='info-value'></p>
                    </div>
               </div>
          )
     })

     return (
          <Modal
               title={customTitle}
               mask={false}
               style={{ top: 20 }}
               visible={visible}
               onOk={onConfirm}
               onCancel={onCancel}
               footer={null}
               width={"50%"}
               className="custom-ant-modal registration-modal lable-content-width"
          >
               <div className="booking-details-container-outer">
                    <div className={!matches ? 'booking-details-container' : 'booking-details-container-mobile'}>
                         <div className="main-outer-grid">
                              <div className="grid-container">
                                   <PlayerDetails />
                              </div>
                              <div className="grid-container">
                                   <EventDetails />
                              </div>
                              <div className="grid-container">
                                   <PaymentDetails />
                              </div>
                              <div className="grid-container">
                                   <SingleCategoryDetails />
                              </div>
                              <div className="grid-container">
                                   <PackageDetailsBulkRegistration />
                              </div>
                              <div className="grid-container">
                                   <Pricing />
                              </div>
                              <div className="grid-container">
                                   <AddOns />
                              </div>
                         </div>
                    </div>
               </div>                
          </Modal>
     );
};

export default RegistrationDetails;
