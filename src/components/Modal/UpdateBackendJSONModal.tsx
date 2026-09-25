import { Modal } from 'antd'
import { Footer } from 'antd/es/layout/layout';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { editBackendConfigAPI } from '../apiFile/Service';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';

export default function UpdateBackendJSONModal({visible, onCancel,name,row,getalldata}) {
  
  const { register, handleSubmit, reset, setValue } = useForm();

  const customTitle = (
    <div className="custom-ant-modal-header">
        {'Backend JSON Record'}
    </div>
);  

useEffect(() => {
  if (visible && row) {            
      setValue('whitelistedNumbers', JSON.stringify(row, null, 2));
  }
}, [visible, row, setValue]);

const onSubmit = async (data) => {  
  try {        
      const parsedData = JSON.parse(data.whitelistedNumbers);    
      console.log('parsedData--------', parsedData)    
      const response = await editBackendConfigAPI("DEVPIPLAYSOCIALAUTH@4", parsedData);            

      if (response?.message === "Success") {
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
      } else {
          toast(<ToastMessage body={"Error While Updating"} type="warning" />, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
          });
      }
  } catch (error) {
      toast(<ToastMessage body={"Invalid JSON format"} type="warning" />, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
      });
      console.error("Error parsing JSON:", error);
  }
};

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

                        <label>Backend JSON Data</label>
                        <textarea
                            {...register('whitelistedNumbers')}
                            rows={10}
                            style={{ width: '100%', resize: 'vertical' }}
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
  )
}
