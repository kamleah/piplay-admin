// DeleteConfirmation.tsx

import React from 'react';
import { Modal, Button } from 'antd';
import { Icon } from '@iconify-icon/react';

interface DeleteConfirmationProps {
  name: String;
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ visible, name, onConfirm, onCancel }) => {

  const customTitle = (
    <div className="custom-ant-modal-delete-header">
      <Icon icon="mdi:warning-circle" className="delete-warning-icon" />
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
        <Button className="pi-btn-delete" key="confirm" type="primary" onClick={onConfirm}>
          Delete
        </Button>,
      ]}
    >
      <div className='ant-modal-body-content border-bottom-light'>
        <h4 className='delete-title'>Are You Sure ?</h4>
        <p className='delete-desc'> Do you really want to delete this {name}? you won’t be able restore again!</p>
      </div>
    </Modal>
  );
};

export default DeleteConfirmation;
