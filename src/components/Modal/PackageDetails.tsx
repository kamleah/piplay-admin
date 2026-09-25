import { Modal } from 'antd'
import React, { useState } from 'react'
import userimage from '../../assets/icon/user.jpeg'
import { Footer } from 'antd/es/layout/layout';
import moment from 'moment';
import Table from '../Table/DataTable';
import { Icon } from "@iconify-icon/react";


export default function PackageDetails({ visible, name, onCancel, row }) {
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
            className="custom-ant-modal registration-modal lable-content-width"
        >
            <div>
                <div className='grid-section border-bottom-light'>
                    <div className="grid-item-1">
                        <h4 className='info-label' >Facility Name  </h4>
                        <p className='info-value' >{row?.facility_id?.name}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Facility Location</h4>
                        <p className='info-value' >{row?.facility_id?.address}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Hourly Passes Name</h4>
                        <p className='info-value' >{row?.name}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Duration</h4>
                        <p className='info-value capi' >{row?.duration}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Expiry</h4>
                        <p className='info-value' >{row?.expiry ? "Yes" : "No"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Start Date</h4>
                        <p className='info-value' >{moment(row?.start_date).format('DD-MM-YYYY')}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >End Date</h4>
                        <p className='info-value' >{row?.expiry ? moment(row?.end_date).format('DD-MM-YYYY') : 'No Expiry'}</p> 
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label ' >Sports Type</h4>
                        <p className='info-value capi' >{row?.sport_type}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label ' >Status</h4>
                        <p className='info-value capi' >{row?.status}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Hourly Passes Price</h4>
                        <p className='info-value' >{row?.price}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Discounted Hourly Passes Price</h4>
                        <p className='info-value' >{row?.discount}</p>
                    </div>
                    <div className="grid-item col-span-2 col-span-2-sm-keep">
                        <h4 className='info-label' >Short Description</h4>
                       <div className="compact-table-container">
                            <table className="compact-table text-left last-child-center">
                            <thead>
                                <tr>
                                    <th>Descriptions</th>
                                    <th>Availability</th>
                                </tr>
                            </thead>
                            <tbody>
                                {row?.description?.map((item: any, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item?.name}</td>
                                            <td>{item.active == true ? <Icon icon="ion:checkmark-sharp" width="20" height="20" /> : <Icon icon="ion:close-sharp" width="20" height="20" />}</td>
                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                        </table>
                       </div>
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
