import { Modal, Collapse, } from 'antd';
import React, { useState } from 'react'
import { Footer } from 'antd/es/layout/layout';
import userimage from '../../assets/icon/user.jpeg'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import moment from 'moment';
import StatusLabel from '../Labels/StatusLabel';

const { Panel } = Collapse;

const OffersDetails = ({ visible, name, onConfirm, onCancel, row }) => {
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
            onOk={onConfirm}
            onCancel={onCancel}
            footer={null}
            className="custom-ant-modal "
        >


            <div className='grid-sec border-bottom-light'>
                <div className="grid-item span-row-3 col-span-3-sm justify-center-sm">

                    <div className='offer-image'>
                        <img className='user-image' src={row?.image ? row?.image : userimage} />
                    </div>
                </div>
                <div className="grid-item">
                    <h4 className='info-label' >Brand</h4>
                    <p className='info-value' >{row?.brand}</p>
                </div>
                <div className="grid-item">
                    <h4 className='info-label' >Promotion Title</h4>
                    <p className='info-value' >{row?.title}</p>
                </div>
                <div className="grid-item">
                    <h4 className='info-label' >Promotion Subtitle</h4>
                    <p className='info-value' >{row?.subtitle ? row?.subtitle : "____"}</p>
                </div>
                <div className="grid-item">
                    <h4 className='info-label' >Promotion Type</h4>
                    <p className='info-value capi' >{row?.type ? row?.type : "____"}</p>
                </div>
                <div className="grid-item">
                    <h4 className='info-label' >Percentage</h4>
                    <p className='info-value' >{row?.offer ? row?.offer : "___"}</p>
                </div>
                <div className="grid-item">
                    <h4 className='info-label' >Status</h4>
                    <p className='info-value' > <StatusLabel
                        status={
                            row.end < moment().format('YYYY-MM-DD') ? 'Inactive' : moment(row?.start).format('DD-MM-YYYY') > moment().format('DD-MM-YYYY') ? 'Scheduled' : row?.status == 'inactive' ? 'Paused' : 'Active'
                        }
                    /></p>
                </div>
                <div className="grid-item">
                    <h4 className='info-label' >Website URL</h4>
                    <p className='info-value' >{row?.website ? row?.website : "___"}</p>
                </div>
                <div className="grid-item">
                    <h4 className='info-label' >Email ID</h4>
                    <p className='info-value' >{row?.mail_id}</p>
                </div>
                <div className="grid-item">
                    <h4 className='info-label' >Phone Number</h4>
                    <p className='info-value' >{row?.phone_no}</p>
                </div>
                <div className="grid-item">
                    <h4 className='info-label' >Start date</h4>
                    <p className='info-value' >{row?.start ? moment(row.start).format('DD-MM-YYYY') : "____"}</p>
                </div>
                <div className="grid-item">
                    <h4 className='info-label' >End date</h4>
                    <p className='info-value' >{row?.end ? moment(row.end).format('DD-MM-YYYY') : "____"}</p>
                </div>
                <div className="grid-item">
                    <h4 className='info-label' >Start Time</h4>
                    <p className='info-value' >{row?.start ? moment(row.start).format('h:mm A') : "____"}</p>
                </div>
                <div className="grid-item">
                    <h4 className='info-label' >End Time</h4>
                    <p className='info-value' >{row?.end ? moment(row.end).format('h:mm A') : "____"}</p>
                </div>

                <div className="grid-item col-span-3-lg col-span-3-sm">
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
                        <Panel header={<strong>Redeem</strong>} key="2">
                            <p className='info-value'>{row?.redeem ? <><div dangerouslySetInnerHTML={{ __html: row?.redeem }} /></> : "___"}</p>
                        </Panel>
                        <Panel header={<strong>Terms & Conditions</strong>} key="3">
                            <p className='info-value'>{row?.tandctext ? <><div dangerouslySetInnerHTML={{ __html: row?.tandctext }} /></> : "___"}</p>
                        </Panel>
                    </Collapse>

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

export default OffersDetails