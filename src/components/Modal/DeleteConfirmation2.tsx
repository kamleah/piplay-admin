// DeleteConfirmation2.tsx

import React from 'react';
import { Modal, Button } from 'antd';
import { Icon } from '@iconify-icon/react';
import ClipLoader from 'react-spinners/ClipLoader';

interface DeleteConfirmation2Props {
  name: String;
  visible: boolean;
  onConfirm : ( value: number) => void;
  onCancel : () => void;
  onConfirm2 : ( value: number) => void;
  loading : boolean
}

const DeleteConfirmation2: React.FC<DeleteConfirmation2Props> = ({
  visible, name, onConfirm, onCancel, onConfirm2, loading}) => {

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
      onOk={() => { onConfirm2(1) }}
      onCancel={onCancel}
      width={'500px'}
      centered
      footer={[
        <Button className="pi-btn-secondary" key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button className="pi-btn-delete" key="confirm" type="primary" onClick={() => { onConfirm2(1) }} disabled={loading}>
         {loading ? (<><ClipLoader  color="#F17121" /> Deleting...</>) : 'Delete For Me'}
        </Button>,
        <Button className="pi-btn-delete" key="confirm" type="primary" onClick={()=>{onConfirm2(2)}} disabled={loading}>
          {loading ? (<><ClipLoader  color="#F17121" /> Deleting...</>) : 'Delete For Everyone'}
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

export default DeleteConfirmation2;
