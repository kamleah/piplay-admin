import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { useForm } from 'react-hook-form';
import { Footer } from 'antd/es/layout/layout';
import { editFrontendConfigAPI } from '../apiFile/Service';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { toast } from 'react-toastify';

export default function UpdateJSONModal({ visible, onCancel, name, row, getAllData }) {
    
const { register, handleSubmit, reset, setValue } = useForm();
    const customTitle = (
        <div className="custom-ant-modal-header">
            {'Frontend JSON Record'}
        </div>
    );
    useEffect(() => {
        if (visible && row) {            
            setValue('jsonData', JSON.stringify(row, null, 2));
        }
    }, [visible, row, setValue]);

    const onSubmit = async (data) => {
        try {        
            const parsedData = JSON.parse(data.jsonData);            
            const response = await editFrontendConfigAPI("DEVPIPLAYSOCIALAUTH@4", parsedData);            
    
            if (response?.message === "Success") {
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

                        <label>Frontend JSON Data</label>
                        <textarea
                            {...register('jsonData')}
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
