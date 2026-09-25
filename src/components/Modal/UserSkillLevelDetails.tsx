import { Modal } from 'antd'
import React, { useState } from 'react'
import { Footer } from 'antd/es/layout/layout';
import { Icon } from "@iconify-icon/react";
import SkillLabel from '../Labels/SkillLabel';

export default function UserSkillLevelDetails({ visible, name, onCancel, row }) {    
    const customTitle = (
        <div className="custom-ant-modal-header">
            {name}
        </div>
    );
    function capitalizeFirstLetter(string) {
        return string?.charAt(0)?.toUpperCase() + string?.slice(1);
    }
    return (
        <Modal title={customTitle}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            className="custom-ant-modal"
            width={'400px'}
        >
            <div>
                <div className='grid-section border-bottom-light'>
                    <div className="grid-item col-span-2 col-span-2-sm-keep">
                        <h4 className='info-label' >Rating</h4>
                        <p className='info-value' >{parseFloat(row?.rating).toFixed(1)}<Icon icon='emojione:star' /></p>
                    </div>
                    <div className="grid-item col-span-2 col-span-2-sm-keep">
                        <h4 className='info-label' >Skill Levels</h4>
                        <SkillLabel skill={row?.skill_level?.label} />
                    </div>
                    <div className="grid-item col-span-2 col-span-2-sm-keep">
                        <h4 className='info-label' >Sports Type</h4>
                        <p className='info-value capi' >{row?.sport_type}</p>
                    </div>
                    <div className="grid-item col-span-2 col-span-2-sm-keep">
                        <h4 className='info-label' >Description</h4>
                        <p className='info-value' >{row?.description}</p>
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
