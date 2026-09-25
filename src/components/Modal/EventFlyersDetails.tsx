import { Modal } from 'antd'
import React, { useState } from 'react'
import userimage from '../../assets/icon/user.jpeg'
import { Footer } from 'antd/es/layout/layout';
import moment from 'moment';
import Table from '../Table/DataTable';
import { Icon } from "@iconify-icon/react";

export default function EventFlyersDetails({ visible, name, onCancel, row }) {
    const customTitle = (
        <div className="custom-ant-modal-header">
            {name}
        </div>
    );

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      const HtmlRenderer = ({ htmlContent }) => {
        return (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        );
    };

  return (
    <Modal title={customTitle}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            className="custom-ant-modal registration-modal lable-content-width"
        >
            <div>
                <div className='grid-section border-bottom-light'>
                    <div className="grid-item-1">
                        <h4 className='info-label' >Content Type</h4>
                        <p className='info-value capi' >{row?.type}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Text/Image</h4>
                        <p className='info-value capi' ><>{row?.type == 'image' ? <img style={{height:'190px',width:'190px'}} src={row?.image} className='table-lg-img-square' /> : <><HtmlRenderer htmlContent={row?.text} /></>}</></p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Flyerfor Dropdown</h4>
                        <p className='info-value capi' >{row?.flyer_for}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Event/Facility</h4>
                        <p className='info-value capi' >{(row?.flyer_for == "facility") ? (row?.prop?.name + row?.prop?.address):(<><p>{row?.prop?.tournament_name}</p> <span>Date:{moment(row?.prop?.start_date).format('DD-MM-YYYY')  + "  "  +  moment(row?.prop?.end_date).format('DD-MM-YYYY')}</span></>)}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Select Region</h4>
                        <p className='info-value' >{row?.state}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Start Date</h4>
                        <p className='info-value' >{moment(row?.start_date).format('YYYY-MM-DD')}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >End Date</h4>
                        <p className='info-value' >{moment(row?.end_date).format('YYYY-MM-DD')}</p> 
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label ' >Number of Views</h4>
                        <p className='info-value capi' >{row?.views}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label ' >Button Text</h4>
                        <p className='info-value capi' >{row?.button_text}</p>
                    </div> 
                    <div className="grid-item">
                        <h4 className='info-label ' >New User</h4>
                        <p className='info-value capi' >{(row?.new_user == true ? "Yes" : "No")}</p>
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
