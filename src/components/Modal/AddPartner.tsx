import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import "../css/style.css";
import { Footer } from "antd/es/layout/layout";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { toast } from "react-toastify";
import ToastMessage from "../../page/facilator/ToastMessage/ToastMessage";
import { useSelector } from 'react-redux';


interface Facility {
    _id: string;
    name: string;
    address: string;
}

interface FormData {
    name: string;
    _id: string
    facility_id: "";
    pi_cut: number;
    razor_cut: number;
    number_of_days: number;
}


interface AddPartnerProps {
    open: boolean;
    fetchData;
    toggle: () => void;
    onSubmit: (paymentConfig: FormData) => Promise<void>;
    edit: boolean;
    setEdit: (value: boolean) => void;
    setEditData: (data: Partial<FormData>) => void;
    initialData: Partial<FormData>;
    facilityOptionsList: string[];
}

function AddPartner({
    open,
    toggle,
    onSubmit,
    fetchData,
    edit,
    setEdit,
    setEditData,
    initialData,
    facilityOptionsList

}: AddPartnerProps) {
    const { register, handleSubmit, reset, setValue } = useForm<FormData>({
        defaultValues: {
            facility_id: "",
            pi_cut: undefined,
            razor_cut: undefined,
            number_of_days: undefined,
        }
    });

    console.log('addpartner: ', facilityOptionsList);


    const { control } = useForm();
    const animatedComponents = makeAnimated();
    const loggedInUser = useSelector((state: any) => state.user.loggedUserDetails);
    const [selectedFacilityName, setSelectedFacilityName] = useState<{ label: string } | null>(null);

    const [selectedFacility, setSelectedFacility] = useState(null);
    const handleFacilityChange = (option) => {
        setSelectedFacility(option);
        setValue('facility_id', option.value); 
    };

    useEffect(() => {
        if (edit && initialData) {
            Object.keys(initialData).forEach(key => {
                setValue(key as keyof FormData, initialData[key] as any);
            });
        } else {
            reset();
        }
    }, [edit, initialData, reset, setValue]);

    const closingFunctions = () => {
        toggle();
        reset();
        setEdit(false);
        setEditData({});
        fetchData()
    };

    const customTitle = (
        <div className="custom-ant-modal-header">
            {edit ? "Edit Partner" : "Add Partner"}
        </div>
    );

    const onSubmitHandler: SubmitHandler<FormData> = async (data) => {
  try {
    const payload = { ...data, gst: 18 };
    await onSubmit(payload);
    toast(
      <ToastMessage
        body={edit ? "Partner Edited Successfully" : "Partner Added Successfully"}
        type="success"
      />,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
    closingFunctions();
  } catch (error) {
    console.error("Error submitting form", error);
    toast(
      <ToastMessage
        body="Error submitting form"
        type="warning"
      />,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  }
};
   

    return (
        <div>
            <Modal
                className="custom-ant-modal"
                open={open}
                title={customTitle}
                onCancel={closingFunctions}
                footer={null}
                width={'425px'}
                centered
            >
                <div className="form-container">
                    <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmitHandler)}>
                        <div className="form-column border-bottom-light">
                            <div className="input-group">
                                <label htmlFor="facility_name" className="form-label">Facility</label>
                                <div className="form-group">
                                    <Controller
                                        name="facility_id"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                className="controller-select"
                                                components={animatedComponents}
                                                options={facilityOptionsList}
                                                placeholder="Select a facility"
                                                value={selectedFacility}
                                                onChange={handleFacilityChange}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label htmlFor="play">Pi Play %<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        id="play"
                                        placeholder="Pi Play %"
                                        {...register('pi_cut', { required: true, valueAsNumber: true })}
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label htmlFor="razorpay">Razorpay %<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        id="razorpay"
                                        placeholder="Razorpay %"
                                        {...register('razor_cut', { required: true, valueAsNumber: true })}
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label htmlFor="numberOfDays">Number Of Days<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        id="numberOfDays"
                                        placeholder="Number Of Days"
                                        {...register('number_of_days', { required: true, valueAsNumber: true })}
                                    />
                                </div>
                            </div>


                            <Footer className='ant-modal-footer'>
                                <button
                                    type="button"
                                    className="pi-btn-secondary"
                                    onClick={closingFunctions}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="pi-btn-primary"
                                >
                                    {edit ? "Update Partner" : "Add Partner"}
                                </button>
                            </Footer>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

export default AddPartner;
