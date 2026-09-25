import React, { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Modal } from "antd";
import { Footer } from "antd/es/layout/layout";
import Select from "react-select"
import makeAnimated from "react-select/animated"
import { createPaymentConfigAPI, editPaymentCongigAPI } from '../apiFile/Service';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';

export default function AddFacilityPaymentConfig({
    open,
    row,
    toggle,
    edit,
    setEdit,
    setEditData,
    editdata,
    facilityList,
    getAllData,
}) {
    const animatedComponents = makeAnimated();
    const { register, handleSubmit, reset, watch, formState, control } = useForm();
    const { errors } = formState;
    const closingFunctions = () => { toggle(); reset(); setEdit(false); setEditData({}) }
    const customTitle = (
        <div className="custom-ant-modal-header">
            {edit == true ? "Edit Payment Config" : "Add Payment Config"}
        </div>
    );
    const loggedInUser = localStorage.getItem("auth");





    const onSuccess = () => {
        reset();
        setEdit(false);
        closingFunctions();
        getAllData();
    }

    const onSubmit = async (data: any) => {
        var response;
        const payload: any = {
            "facility_id": data?.facility_id?.value,
            "pi_cut": Number(data?.pi_cut),
            "razor_cut": Number(data?.razor_cut),
            "number_of_days": Number(data?.number_of_days),
            "gst": Number(data?.gst)
        }

        if (edit == true) {
            response = await editPaymentCongigAPI(loggedInUser, editdata._id, payload);
        } else {
            response = await createPaymentConfigAPI(loggedInUser, payload);
        }
        if (response.statusCode == 0) {
            toast(<ToastMessage body={edit ? "Payment Config Updated Successfully" : "Payment Config Added Successfully"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            onSuccess();
        } else {
            console.log(response.data)
            toast(<ToastMessage body={"Something went wrong"} type="warning" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    useMemo(() => {
        if (edit) {
            reset({
                'facility_id': { "label": editdata?.facility_id?.name + ', ' + editdata?.facility_id?.address, "value": editdata?.facility_id?._id, "sport_type": editdata?.facility_id?.sport_type },
                "pi_cut": editdata?.pi_cut,
                "razor_cut": editdata?.razor_cut,
                "gst": editdata?.gst
            })
        } else {
            reset({
                "facility_id": '',
            })
        }
    }, [open])

    // useEffect(() => {
    //     reset({
    //         "facility_id": '',
    //     })
    // }, [!open])


    return (
        <div>
            <Modal
                className="custom-ant-modal "
                open={open}
                title={customTitle}
                onCancel={closingFunctions}
                footer={null}
                width={'450px'}
                centered
            >
                <div className="form-container">
                    {/* <div className="form-header">
                <h2>Add New Facility</h2>
                <span className="close-icon" onClick={toggle}>X</span>
            </div> */}
                    <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
                        <div className="border-bottom-light">
                            <div className="form-column">
                                <div className="input-group">
                                    <label htmlFor="facility_id" className="form-lable">Facility</label>
                                    <div className="form-group">
                                        <Controller
                                            name="facility_id"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    // closeMenuOnSelect={false}
                                                    className="controller-select"
                                                    components={animatedComponents}
                                                    defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                                                    // isMulti
                                                    options={facilityList}
                                                    placeholder="Select a facility"
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="skillLevel">Pi Play Cut %<span style={{ color: "red" }}>*</span></label>
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            step="0.01"
                                            id="skillLevel"
                                            placeholder="Pi Play Cut % Value"
                                            {...register('pi_cut', {
                                                required: {
                                                    value: true,
                                                    message: 'Value is required',
                                                },
                                            })}
                                        />

                                    </div>
                                    {errors?.value && (
                                        <span className="error-message">
                                            {/* {errors.value.message} */}
                                        </span>
                                    )}
                                </div>
                                <div className="input-group">
                                    <label htmlFor="skillLevel">Razorpay Cut %<span style={{ color: "red" }}>*</span></label>
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            step="0.01"
                                            id="skillLevel"
                                            placeholder="Razorpay Cut % Value"
                                            {...register('razor_cut', {
                                                required: {
                                                    value: true,
                                                    message: 'Value is required',
                                                },
                                            })}
                                        />

                                    </div>
                                    {errors?.value && (
                                        <span className="error-message">
                                            {/* {errors.value.message} */}
                                        </span>
                                    )}
                                </div>
                                <div className="input-group">
                                    <label htmlFor="numberOfDays">Number Of Free Days<span style={{ color: "red" }}>*</span></label>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            id="numberOfDays"
                                            placeholder="Number Of Free Days"
                                            {...register('number_of_days', { required: true })}
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="skillLevel">GST<span style={{ color: "red" }}>*</span></label>
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            id="skillLevel"
                                            placeholder="GST Value"
                                            {...register('gst', {
                                                required: {
                                                    value: true,
                                                    message: 'Value is required',
                                                },
                                            })}
                                        />

                                    </div>
                                    {errors?.value && (
                                        <span className="error-message">
                                            {/* {errors.value.message} */}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Footer className='ant-modal-footer'>
                            <button type="button" className="pi-btn-secondary" onClick={closingFunctions}>Cancel</button>
                            <button type="submit" className="pi-btn-primary">{edit == true ? "Save" : "Add"}</button>
                        </Footer>
                    </form>
                </div>
            </Modal>
        </div >
    )
}
