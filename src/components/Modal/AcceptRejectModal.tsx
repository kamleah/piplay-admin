// DeleteConfirmation.tsx

import React from 'react';
import { Modal, Button } from 'antd';
import { Icon } from '@iconify-icon/react';
import ClipLoader from 'react-spinners/ClipLoader';

interface DeleteConfirmationProps {
    name: String;
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    type: String
    loading?: boolean
}

const AcceptRejectModal: React.FC<DeleteConfirmationProps> = ({ visible, name, onConfirm, onCancel, type, loading }) => {

    const data = [
        { type: 'accept', text: 'You are about to accept all the requests.Are you sure you want to continue?', button: 'Accept All' },
        { type: 'reject', text: 'You are about to reject all the requests.Are you sure you want to continue?', button: 'Reject All' },
        { type: 'removeall', text: 'You are about to remove the selected players.Are you sure you want to continue?', button: 'Remove' },
        { type: 'exit', text: 'You are about to remove yourself from the group.Are you sure you want to continue?', button: 'Exit' },
        { type: 'clear', text: 'You are about to clear the chat.Are you sure you want to continue?', button: 'Clear' },
        { type: 'cancelbooking', text: 'You are about to cancel the booking.', button: 'Yes' },
        { type: 'refundbooking', text: 'You are about to cancel the booking.', button: 'Yes' },
        { type: 'deleteMessage', text: 'Message you are deleting will be deleted for everyone.', button: 'Delete Message' }
    ]

    const customTitle = (
        <div className="custom-ant-modal-delete-header">
            <Icon icon="mdi:warning-circle" className={type != 'accept' ? 'delete-warning-icon' : 'accept-warning-icon'} />
        </div>
    );
    return (
        <Modal
            className="custom-ant-delete-modal"
            title={customTitle}
            visible={visible}
            onOk={onConfirm}
            onCancel={onCancel}
            width={'400px'}
            centered
            footer={[
                <Button className="pi-btn-secondary" key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button className={type == 'accept' ? 'pi-btn-green' : 'pi-btn-delete'} key="confirm" type="primary" onClick={onConfirm} disabled={loading}>
                    {loading ? (<><ClipLoader color="#F17121" size={16}/> Deleting...</>) : type && <>
                        {data.filter(item => item.type == type)[0].button ? data?.filter(item => item.type == type)[0]?.button : "Button"}
                    </>}
                </Button>,
            ]}
        >
            <div className='ant-modal-body-content border-bottom-light'>
                <h4 className='delete-title'>Are You Sure ?</h4>
                {data.map(item => (
                    <>
                        {item.type == type &&
                            <p className='delete-desc'>{item?.text}</p>}
                    </>
                ))}
            </div>
        </Modal>
    );
};

export default AcceptRejectModal;
