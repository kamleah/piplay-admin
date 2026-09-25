import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { useForm } from 'react-hook-form';
import { Footer } from 'antd/es/layout/layout';
import { editFrontendConfigAPI } from '../apiFile/Service';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { toast } from 'react-toastify';

export default function EditFrontendConfig({ visible, name, onCancel, row ,getAllData}) {
    console.log('namefront-------------', name)
  const { register, handleSubmit, reset } = useForm();  
  useEffect(() => {
    if (row) {      
      reset(row);
    }
  }, [row, reset]);

  const onSubmit = async(data) => {
    console.log('Submitted Data:', data);  
    
    var response = await editFrontendConfigAPI("DEVPIPLAYSOCIALAUTH@4",data)
    console.log('response------', response)

    if(response?.message == "Success"){
        getAllData();
        toast(<ToastMessage body={"Frontend Config Updated Successfully"} type="success" />, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        reset();
        onCancel();
    }else {
        toast(<ToastMessage body={"Error While Updating"} type="warning" />, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }
  };

  const customTitle = (
    <div className="custom-ant-modal-header">
      {'Edit Frontend Config'}
    </div>
  );

  

  return (
    <Modal
      title={customTitle}
      visible={visible}
      width="40%"
      onCancel={() => {
        onCancel();
        reset();
      }}
      footer={null}
      className="custom-ant-modal lable-content-width"
    >
      <div className="form-container">
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
          <div>
            
            <label>Picoins Reward Referral</label>
            <textarea
              {...register('picoinsRewardReferral')}
              rows={1}
              style={{ width: '100%', marginBottom: '10px' }}
            ></textarea>

            <label>Max Video Upload Size (MB)</label>
            <textarea
              {...register('maxVideoUploadSizeMb')}
              rows={1}
              style={{ width: '100%' }}
            ></textarea>
          </div>

          <Footer className="ant-modal-footer">
            <button
              type="button"
              className="pi-btn-secondary"
              onClick={() => {
                onCancel();
                reset();
              }}
            >
              Cancel
            </button>
            <button type="submit" className="pi-btn-primary">
              Save
            </button>
          </Footer>
        </form>
      </div>
    </Modal>
  );
}
