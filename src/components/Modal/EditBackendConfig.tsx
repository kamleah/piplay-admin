import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { useForm } from 'react-hook-form';
import { Footer } from 'antd/es/layout/layout';
import { editBackendConfigAPI } from '../apiFile/Service';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { toast } from 'react-toastify';

export default function EditBackendConfig({ visible, name, onCancel, row,getalldata }) {   
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (row) {
  
      reset(row);
    }
  }, [row, reset]);

  
  const onSubmit = async(data) => {
    console.log('Submitted Data:', data);
    
    if (data.whitelistedNumbers) {
      data.whitelistedNumbers = data.whitelistedNumbers.split(',').map((number) => number.trim());
    }
    
    var response = await editBackendConfigAPI("DEVPIPLAYSOCIALAUTH@4",data)
    console.log('response------', response)

    if(response?.message == "Success"){
        getalldata();
        toast(<ToastMessage body={"Backend Config Updated Successfully"} type="success" />, {
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
    <div className="custom-ant-modal-header">{'Edit Backend Config'}</div>
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
            <label>Whitelisted Numbers</label>
            <textarea
              {...register('whitelistedNumbers')}
              rows={4}
              style={{ width: '100%' }}
            ></textarea>

            <label>Picoins Reward Referral</label>
            <input
              type="number"
              {...register('picoinsRewardReferral')}
              style={{ width: '100%' }}
            />
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
