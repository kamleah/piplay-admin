import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { useForm } from 'react-hook-form';
import { filterCourt, getExtendAvailableAPI, postExtendAPI } from '../apiFile/Service';
import moment from 'moment';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';


const ExtendBookingModal = ({ modaldata, visible, onCancel, getBookings, closeBookingDetailsModel }) => {
    const loggedInUser = localStorage.getItem("auth");
    const [courts, setCourts] = useState([])
    const form = useForm({
        defaultValues: {
            date: `${modaldata?.booking_date}`,
            start_time: `${modaldata?.end_time}`,
            end_time: "",
            court: `${modaldata?.court_id}`,
            name: `${modaldata?.user?.firstname} ${modaldata?.user?.lastname}`,
            mobileno: `${modaldata?.user?.mobileno}`,
            payment_type: "",
            payment: "",

        }
    })
    const { register, handleSubmit, reset, formState, watch } = form;
    let paymentType = watch('payment_type')
    const { errors } = formState;
    const [slots, setSlots] = useState([])
    const [extendSlots, setExtendSlots] = useState([])

    const customTitle = (
        <div className="custom-ant-modal-header">
            {'Extend Booking Details'}
        </div>
    );
    const onClose = () => {
        reset({
            end_time: "",
            payment_type: "",
            payment: "",
        })
        onCancel(); // Close the modal after submitting
    };

    const filterData = async () => {
        if (modaldata?.facility_id == undefined) {
            return
        }
        let response = await filterCourt(loggedInUser,
            '',
            modaldata?.facility_id,
            ''
        );
        if (response?.statusCode == 0) {
            response = response?.result?.map(data => {
                if (data._id == modaldata.court_id) {
                    return { "label": data?.name, "value": data?._id }
                }
            })
            setCourts(response);
        } else {
            setCourts([]);
        }
    };

    const getExtendAvailableTime = async () => {
        if (modaldata?._id == undefined) {
            return
        }
        let response = await getExtendAvailableAPI(loggedInUser, modaldata?._id);
        if (response?.statusCode == 0) {
            let data: any = []
            for (let i = 1; i < response?.result?.length; i++) {
                if (response?.result[i].display_time > modaldata?.end_time) {
                    data.push({ "label": response?.result[i]?.display_time, "value": response?.result[i]?.display_time })
                    if (response?.result[i].slots[0]?.booking_data.length > 0) {
                        break;
                    }
                }
            }
            setSlots(data);
            setExtendSlots(response?.result);
        }
    }

    const onSubmit = async (data) => {
        let selSlots = extendSlots?.filter((slot: any) => data?.start_time <= slot?.display_time && data?.end_time > slot?.display_time
        )
        let total_amount = 0
        let sel = selSlots?.map((s: any) => {
            total_amount = total_amount + s.slots[0].price
            s.slots[0].startTime = s?.time?.split(" - ")[0]
            s.slots[0].endTime = s?.time?.split(" - ")[1]
            return s.slots[0]
        })
        const payload = {
            "booking_date": modaldata?.booking_date,
            "coupon": false,
            // "coupon_name": "",
            "court_id": modaldata?.court_id,
            "endTimestamp": moment(`${modaldata?.booking_date} ${data?.end_time}`).valueOf(),
            "end_time": data?.end_time,
            "facility_id": modaldata?.facility_id,
            // "percentage": 0,
            "razor_id": "Admin Booking",
            // "razorpay_order_id": "NA",
            // "razorpay_signature": "NA",
            "slot_ids": sel,
            "payment_type": data.payment_type,
            "startTimestamp": modaldata?.startTimestamp,
            "start_time": modaldata?.start_time,
            "requireRazorPayId": false,
            "total_amount": total_amount * 100,
            "user_id": modaldata?.user_id,
            status: data.payment_status == "Released" ? "Released" : data?.payment_type == 'plink' ? "Confirmed" : data?.payment_status,
            payment_status: data?.payment_type == 'plink' ? "Confirmed" : data?.payment_type == 'free' ? "Paid" : data?.payment_status,
            "manual": true
        }

        let response = await postExtendAPI(loggedInUser, modaldata?._id, payload);
        if (response) {
            if (response?.code == 'BOOKING_SUCCESS') {
                toast(<ToastMessage body={"Extended Slot Successfully"} type="success" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                getBookings();
                closeBookingDetailsModel();
                onClose();
            } else {
                toast(<ToastMessage body={response?.data?.err_code} type="error" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        }
    }

    useEffect(() => {
        filterData();
        getExtendAvailableTime();
        reset({
            date: `${modaldata?.booking_date}`,
            start_time: `${modaldata?.end_time}`,
            end_time: "",
            court: `${modaldata?.court_id}`,
            name: `${modaldata?.user?.firstname} ${modaldata?.user?.lastname}`,
            mobileno: `${modaldata?.user?.mobileno}`,
            payment_type: "",
            payment: "",

        })
    }, [visible, modaldata])

    return (
        <div>

            <Modal
                visible={visible}
                title={customTitle}
                width={"500px"}
                footer={null}
                className="custom-ant-modal lable-content-width"
                onCancel={onCancel}
            // footer={[
            //     <Button key="cancel" onClick={onCancel}>
            //         Cancel
            //     </Button>,
            //     <Button key="submit" type="primary" onClick={handleOk}>
            //         Save
            //     </Button>,
            // ]}
            >
                {/* <Form form={form} onFinish={onFinish}>
                    <Form.Item
                        label="Booking ID"
                        name="bookingId"
                        rules={[{ required: true, message: 'Please input the booking ID!' }]}
                    >
                        <Input placeholder="Booking ID" />
                    </Form.Item>
                    <Form.Item
                        label="Player Name"
                        name="playerName"
                        rules={[{ required: true, message: 'Please input the player name!' }]}
                    >
                        <Input placeholder="Player Name" />
                    </Form.Item>
                    <Form.Item
                        label="Booking Date"
                        name="bookingDate"
                        rules={[{ required: true, message: 'Please input the booking date!' }]}
                    >
                        <Input placeholder="Booking Date" />
                    </Form.Item>
                </Form> */}
                <div className="form-container">
                    <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)} >
                        <div className=" border-bottom-light">
                            <div className="input-group">
                                <label htmlFor="date" className="form-lable">Slot Date<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        //  max={today}
                                        type="date"
                                        id="date"
                                        placeholder="date of birth"
                                        disabled
                                        {...register('date', {
                                            required: {
                                                value: true,
                                                message: "Date is required",
                                            },
                                        })}

                                    />
                                </div>
                                {errors?.date && (
                                    <span className="error-message">
                                        {errors.date.message}
                                    </span>
                                )}
                            </div>

                            <div className="form-container-grid">
                                <div className="input-group">
                                    <label htmlFor="start_time" className="form-lable">Start time <span className='required-star'>*</span></label>
                                    <div className="form-group">
                                        <input
                                            className="form-field"
                                            type="text"
                                            id="start_time"
                                            placeholder="Start Time"
                                            disabled
                                            //  max={endTime}
                                            {...register('start_time', {
                                                required: {
                                                    value: true,
                                                    message: 'Start time is required',
                                                },

                                            })}
                                        />
                                    </div>
                                    {errors?.start_time && (
                                        <span className="error-message">
                                            {errors.start_time.message}
                                        </span>
                                    )}
                                </div>
                                <div className="input-group">
                                    <label htmlFor="end_time" className="form-lable">End time <span className='required-star'>*</span></label>

                                    <div className="form-group">
                                        <select
                                            id="end_time"
                                            {...register("end_time", {
                                                required: {
                                                    value: true,
                                                    message: "End time is required",
                                                }
                                            })}
                                        >
                                            <option value="" >Select Time </option>
                                            {
                                                slots?.map((data: any, index) => (
                                                    <option key={index} value={data?.value}>{data?.label}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    {errors?.end_time && (
                                        <span className="error-message">
                                            {errors.end_time.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="input-group">

                                <label htmlFor="court" className="form-lable">Court<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <select
                                        id="court"
                                        disabled
                                        {...register("court", {
                                            required: {
                                                value: true,
                                                message: "Court is required",
                                            }
                                        })}
                                    >
                                        <option value="" >Select Court</option>
                                        {
                                            courts?.map((data: any, index) => (
                                                <option key={index} value={data?.value}>{data?.label}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                {errors?.court && (
                                    <span className="error-message">
                                        {errors.court.message}
                                    </span>
                                )}
                            </div>

                            <div className="input-group">

                                <label htmlFor="name">Player Name<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="Player Name"
                                        disabled
                                        {...register('name', {
                                            required: {
                                                value: true,
                                                message: 'Player Name is required',
                                            },
                                            pattern: {
                                                value: /^[^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*$/,
                                                message: 'Please enter a valid first name with at least three alphabet characters',
                                            },
                                        })}
                                    />

                                </div>
                                {errors?.name && (
                                    <span className="error-message">
                                        {errors.name.message}
                                    </span>
                                )}
                            </div>

                            <div className="input-group">
                                <label htmlFor="mobileno">Phone No.<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        id="mobileno"
                                        disabled
                                        placeholder="Phone No."
                                        {...register('mobileno', {
                                            required: {
                                                value: true,
                                                message: 'Phone number is required',
                                            },
                                            pattern: {
                                                value: /^\d{10}$/,
                                                message: 'Please enter a valid 10-digit phone number',
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
                                <label htmlFor="payment_type" className="form-lable">Payment Type?<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <select
                                        id="payment_type"
                                        className="form-field"

                                        // onChange={(e) => { TypeFilter(e.target.value) }}
                                        {...register('payment_type', {
                                            required: {
                                                value: true,
                                                message: 'Payment Type is required',
                                            }
                                        })}
                                    >
                                        <option value="" selected disabled>Select Payment Type</option>
                                        <option value="">Select Payment Type</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Card">Card</option>
                                        <option value="UPI">UPI</option>
                                        <option value="free">Complementary</option>
                                        <option value="plink">via Payment Link</option>
                                    </select>
                                </div>
                                {errors?.payment_type && (
                                    <span className="error-message">
                                        {errors.payment_type.message}
                                    </span>
                                )}
                            </div>
                            {paymentType != 'plink' &&
                                <div className="input-group">
                                    <label htmlFor="event" className="form-lable">Payment Status?<span style={{ color: "red" }}>*</span></label>
                                    <div className="form-group">
                                        <select
                                            id="location"
                                            className="form-field"

                                            // onChange={(e) => { TypeFilter(e.target.value) }}
                                            {...register('payment', {
                                                required: {
                                                    value: paymentType != 'plink' ? true : false,
                                                    message: 'Payment Status is required',
                                                }
                                            })}
                                        >
                                            <option value="">Select Payment Status</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Rescheduled">Rescheduled</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Released">Released</option>
                                            <option value="Paid">Paid</option>
                                        </select>
                                    </div>
                                    {errors?.payment && (
                                        <span className="error-message">
                                            {errors.payment.message}
                                        </span>
                                    )}
                                </div>}
                        </div>
                        <Footer className='ant-modal-footer'>
                            <button type="button" className="pi-btn-secondary" onClick={onClose}>
                                Cancel</button>
                            <button type="submit" className="pi-btn-primary">
                                Save</button>
                        </Footer>
                    </form>
                </div >
            </Modal>
        </div >

    );
};

export default ExtendBookingModal;
