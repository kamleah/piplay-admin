import React from 'react';
import { Modal } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import moment from 'moment';

interface Facility {
    _id: string;
    name: string; 
    address: string;
}

interface PartnerDetailsProps {
    visible: boolean;
    name: string;
    onCancel: () => void;
    
    row: {
        facility_id?: Facility;
        pi_cut?: number;
        razor_cut?: number;
        freePeriodStart?: string;
        freePeriodEnd?: string;
    };
}

function PartnerDetails({ visible, name, onCancel, row }: PartnerDetailsProps) {
    const customTitle = (
        <div className="custom-ant-modal-header">
            {name}
        </div>
    );

    return (
        <Modal
            title={customTitle}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            className="custom-ant-modal"
            width={'400px'}
        >
            <div className="grid-section border-bottom-light">
                <div className="grid-item col-span-2 col-span-2-sm-keep">
                    <h4 className='info-label'>Facility Name</h4>
                    <p className='info-value'>{row?.facility_id?.name ?? 'N/A'}</p>
                </div>
                <div className="grid-item col-span-2 col-span-2-sm-keep">
                    <h4 className='info-label'>Pi Play %</h4>
                    <p className='info-value'>{row?.pi_cut !== undefined ? row.pi_cut + '%' : 'N/A'}</p>
                </div>
                <div className="grid-item col-span-2 col-span-2-sm-keep">
                    <h4 className='info-label'>Razorpay %</h4>
                    <p className='info-value'>{row?.razor_cut !== undefined ? row.razor_cut + '%' : 'N/A'}</p>
                </div>
                <div className="grid-item col-span-2 col-span-2-sm-keep">
                    <h4 className='info-label'>Free Period Start Time</h4>
                    <p className='info-value'>{ moment(row.freePeriodStart).format('YYYY-MM-DD') ?? 'N/A'}</p>
                </div>
                <div className="grid-item col-span-2 col-span-2-sm-keep">
                    <h4 className='info-label'>Free Period End Time</h4>
                    <p className='info-value'>{moment(row.freePeriodEnd).format('YYYY-MM-DD') ?? 'N/A'}</p>
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
    );
}

export default PartnerDetails;
