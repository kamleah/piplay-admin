import { Modal } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import Select from "react-select";
import makeAnimated from "react-select/animated";

import { useSelector } from 'react-redux';
import { createMembershipDataAPI, editMembershipDataAPI } from '../apiFile/Service';
import moment from 'moment';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';

export default function AddMembership({ visible, onCancel, row, edit, membership, facilityList, setEdit, getAll }) {
    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
    const loggedInUser = localStorage.getItem("auth");
    const form = useForm({
        defaultValues: {
            package_id: {},
            facility_id: {},
            player_name: '',
            mobileno: '',
            discount_amount: 0,
            payment_status: {},
        },
    });
    const { register, handleSubmit, control, reset, formState, watch, setValue } = form;
    let Facility: any = watch('facility_id')
    const { errors } = formState;

    const customTitle = (
        <div className="custom-ant-modal-header">
            {edit ? 'Edit User Hourly Passes' : 'Add User Hourly Passes'}
        </div>
    );
    const animatedComponents = makeAnimated();

    const calculateExpiryDate = (duration) => {
        console.log('duration', duration, duration.includes('Days'))
        const currentDate = moment(); // Get the current date
        if (duration.includes('Days') == true) {
            return currentDate.add(duration.toLowerCase().split(' ')[0], "days").format('YYYY-MM-DD')
        } else {
            switch (duration.toLowerCase()) {
                case 'daily':
                    return currentDate.add(1, 'days').format('YYYY-MM-DD');
                case 'weekly':
                    return currentDate.add(1, 'weeks').format('YYYY-MM-DD');
                case 'monthly':
                    return currentDate.add(1, 'months').format('YYYY-MM-DD');
                case "quarterly":
                    return currentDate.add(3, 'months').format('YYYY-MM-DD');
                case 'half_quarterly':
                    return currentDate.add(6, 'months').format('YYYY-MM-DD');
                case 'yearly':
                    return currentDate.add(1, 'years').format('YYYY-MM-DD');
                default:
                    throw new Error('Invalid duration');
            }
        }
    };

    const calculateSettlement = async (amount) => { // amount should be in paise
        const gstRate = 0.18; // 18%
        // const playCutRate = 0.05; // 5%
        const playCutRate = 0.00; // 0%
        const additionalPlayCutRate = 0.0218; // 2.18%

        // Calculations
        const gstAmount = amount * gstRate;
        const totalPlayCutRate = playCutRate + additionalPlayCutRate;
        const playCutAmount = amount * totalPlayCutRate;

        // Total deduction (GST + Play cut)
        const totalDeduction = gstAmount + playCutAmount;

        // Partner settlement
        const partnerSettlement = amount - totalDeduction;

        return {
            partnerAmount: Math.ceil(amount * 100),
            gstAmount: Math.ceil(gstAmount * 100),
            playCutAmount: Math.ceil(playCutAmount * 100),
            partnerSettlement: Math.ceil(partnerSettlement * 100),
        };
    };


    const calculateMemeberShipShowSettlement = (amount) => {
        const gstRate = 0.18;
        const gstAmount = amount * gstRate;
        return {
            gstAmount: gstAmount,
            balanceAmount: amount - gstAmount,
            totalAmount: amount
        };
    };

    const onsubmit = async (data: any) => {
        var response
        let payment_Data = await calculateSettlement((Number(data?.package_id?.data?.discount == 0 ? data?.package_id?.data?.price : data?.package_id?.data?.discount) - Number(data.discount_amount)))
        let payload
        if (edit != true) {
            payload = {
                "package_id": data?.package_id?.value,
                "facility_id": data?.facility_id?.value,
                "is_facility": true,
                "is_piplay": false,
                "package_expiry_date": calculateExpiryDate(data?.package_id?.data?.duration),
                "hours_included": data?.package_id?.data?.hours_included,
                "extra_hours": data?.package_id?.data?.extra_hours,
                "total_hours": Number(data?.package_id?.data?.total_minutes) / 60,
                "total_min": data?.package_id?.data?.total_minutes,
                "payment_status": data?.payment_status?.value,
                "price": Math.ceil(Number(data?.package_id?.data?.discount == 0 ? data?.package_id?.data?.price * 100 : data?.package_id?.data?.discount * 100) - Number(data.discount_amount * 100)),
                "gst_amount": Number(payment_Data.gstAmount),
                "discount_amount": Math.ceil(Number(data.discount_amount * 100)),
                "partner_amount": Number(payment_Data.partnerAmount),
                "partner_settlement": Number(payment_Data.partnerSettlement),
                "piplay_cut_amount": Number(payment_Data.playCutAmount),
                "name": data?.player_name,
                "mobileno": Number(data?.mobileno)
            }
        } else {
            payload = {
                "payment_status": data?.payment_status?.value,
            }
        }
        if (edit == true) {
            response = await editMembershipDataAPI(loggedInUser, row._id, payload);
        } else {
            response = await createMembershipDataAPI(loggedInUser, payload);
        }
        if (typeof response.data != "string" && response.error != true) {
            toast(<ToastMessage body={edit ? "User Package Updated Successfully" : "User Package Added Successfully"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            onSuccess();
        } else {
            toast(<ToastMessage body={response.error == true ? response.message : response.data} type="warning" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    const onSuccess = () => {
        reset();
        onCancel();
        setEdit(false);
        getAll();
    }

    useMemo(() => {
        console.log('edit', edit)
        if (edit) {
            reset({
                package_id: { "label": row?.package_id?.name, "value": row?.package_id?._id, 'data': row?.package_id },
                facility_id: { "label": row?.facility_id?.name + ', ' + row?.facility_id?.address, "value": row?.facility_id?._id, "sport_type": row?.facility_id?.sport_type },
                player_name: `${row?.user_id?.firstname} ${row?.user_id?.lastname}`,
                mobileno: row?.user_id.mobileno,
                discount_amount: Math.ceil(row?.discount_amount / 100),
                payment_status: { "label": row?.payment_status, "value": row?.payment_status }
            })
        }
        else {
            reset({
                package_id: '',
                facility_id: '',
                player_name: '',
                mobileno: '',
                discount_amount: 0,
                payment_status: '',
            });
            setEdit(false);
            if(loggedUserDetails?.roleId){
                reset({
                     "facility_id":{"label":facilityList[0]?.label , "value":facilityList[0]?.value}
                })
           }
        }

    }, [visible])

    useMemo(() => {
        if (edit == false) {
            setValue('package_id', '')
        }
    }, [Facility.value])

    return (
        <Modal
            title={customTitle}
            visible={visible}
            // onOk={onConfirm}
            width={"30%"}
            onCancel={() => {
                onCancel();
                reset();
            }}
            footer={null}
            className="custom-ant-modal lable-content-width"
        >
            <div className="form-container">
                <form style={{ width: "100%" }} onSubmit={handleSubmit(onsubmit)}>
                    <div className="border-bottom-light">
                        <div className="input-group">
                            <label htmlFor="firstName" className="form-lable">
                                Facilty Name<span style={{ color: "red" }}>*</span>
                            </label>
                            <div className="form-group">
                                <Controller
                                    name="facility_id"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Facilty Name is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value }, field }) => (
                                        <Select
                                            className="controller-select"
                                            components={animatedComponents}
                                            isDisabled={edit ? true : false}
                                            options={facilityList}
                                            placeholder="Select a facility"
                                            {...field}
                                        />
                                    )}

                                />
                            </div>
                            {errors?.facility_id && (
                                <span className="error-message">
                                    {errors.facility_id?.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="firstName" className="form-lable">
                                Select Hourly Passes<span style={{ color: "red" }}>*</span>
                            </label>
                            <div className="form-group">
                                <Controller
                                    name="package_id"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Hourly Passes Name is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value }, field }) => (
                                        <Select
                                            className="controller-select"
                                            components={animatedComponents}
                                            isDisabled={edit ? true : false}
                                            options={membership?.filter(dataa => dataa.data.facility_id._id == Facility.value)}
                                            placeholder="Select a Hourly Passes"
                                            {...field}
                                        />
                                    )}

                                />
                            </div>
                            {errors?.package_id && (
                                <span className="error-message">
                                    {errors.package_id?.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="firstName" className="form-lable">
                                Player Name<span style={{ color: "red" }}>*</span>
                            </label>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="age_group"
                                    placeholder="Player Name"
                                    {...register("player_name", { required: true })}
                                    disabled={edit ? true : false}
                                />
                            </div>
                            {errors?.player_name && (
                                <span className="error-message">
                                    {errors.player_name.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="mobileno" className="form-lable">
                                Mobile Number<span style={{ color: "red" }}>*</span>
                            </label>
                            <div className="form-group">
                                <input
                                    type="number"
                                    id="phone"
                                    placeholder="Phone No."
                                    disabled={edit ? true : false}
                                    {...register("mobileno", {
                                        required: {
                                            value: true,
                                            message: "Phone number is required",
                                        },
                                        pattern: {
                                            value: /^\d{10}$/,
                                            message: "Please enter a valid 10-digit phone number",
                                        },
                                    })}
                                />
                            </div>
                            {errors?.mobileno && (
                                <span className="error-message">
                                    {errors.mobileno.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="firstName" className="form-lable">
                                Discount
                            </label>
                            <div className="form-group">
                                <input
                                    //  max={today}
                                    type="number"
                                    id="age_group"
                                    step="0.01"
                                    placeholder="Discount"
                                    {...register("discount_amount")}
                                    disabled={edit ? true : false}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="firstName" className="form-lable">
                                Payment Status<span style={{ color: "red" }}>*</span>
                            </label>
                            <div className="form-group">
                                <Controller
                                    name="payment_status"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Payment Status is required *",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Select
                                            className="controller-select"
                                            components={animatedComponents}
                                            options={[
                                                { label: "Paid", value: "Paid" },
                                                { label: "Unpaid", value: "UnPaid" }
                                            ]}
                                            placeholder="Select a Payment Status"
                                            {...field}
                                        />
                                    )}
                                />

                            </div>
                            {errors?.payment_status && (
                                <span className="error-message">
                                    {errors.payment_status.message}
                                </span>
                            )}
                        </div>
                    </div>
                    <Footer className='ant-modal-footer'>
                        <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset(); }}>Cancel</button>
                        <button type="submit" className="pi-btn-primary"> {edit ? 'Save Changes' : 'Add Hourly Passes'}</button>
                    </Footer>
                </form>
            </div >
        </Modal >
    )
}
