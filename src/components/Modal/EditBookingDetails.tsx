import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { useForm } from 'react-hook-form';
import { editBookingdetail, getAllUsers } from '../apiFile/Service';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';

interface User {
    label: string;
    user_id: string;
}

const EditBookingModal = ({ visible, onCancel, modaldata, getBookings, closeBookingDetailsModel }) => {
    const form = useForm({
        defaultValues: {
            date: "",
            start_time: "",
            end_time: "",
            court: "Court 1",
            name: "",
            mobileno: "",
            payment_status: "",
            user_id: ""
        }
    })
    const { register, handleSubmit, reset, formState, watch } = form;
    const [userList, setUserList] = useState<User[]>([]);
    const { errors } = formState;
    const loggedInUser = localStorage.getItem("auth");
    const customTitle = (
        <div className="custom-ant-modal-header">
            {'Edit Booking Detail'}
        </div>
    );
    // console.log('userList-------------', userList)

    const getUsers = async () => {
        let response = await getAllUsers(loggedInUser);
        let venues = response?.data?.map((data) => {
            return {
                label: `${data.firstname} ${data.lastname}`,
                // mobileno: data?.mobileno,
                // value: data?._id,
                user_id: data?._id
            };
        });
        setUserList(venues);
    };

    useEffect(() => {
        getUsers();
    }, [visible])

    const onSubmit = async (data: any) => {
        let response
        // data.date = data.date
        // data.start_time = data.start_time
        // data.end_time = data.end_time
        // data.court = data.court
        // data.mobileno = Number(data.mobileno)
        data.user_id = data.user_id
        data.court = data.court
        data.name = data.name
        data.payment_status = data.payment_status
        data.status = data.payment_status == 'Released' ? 'Released' : data.payment_status == 'Paid' ? 'Paid' : modaldata.status
        // console.log(data, "dataddd")
        response = await editBookingdetail(loggedInUser, modaldata._id, data);
        
        if (response.code == 'SUCCESS') {
            // getEventVenues();
            toast(<ToastMessage body={"Booking Edited Successfully"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            reset();
            onCancel();
            reset();
            getBookings();
            closeBookingDetailsModel();
        } else {
            toast(<ToastMessage body={response.statusCode} type="warning" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }
    useEffect(() => {
        reset({
            'start_time': modaldata?.start_time,
            'end_time': modaldata?.end_time,
            'date': modaldata?.booking_date,
            'name': `${modaldata?.user?.firstname} ${modaldata?.user?.lastname}`,
            'mobileno': modaldata?.user?.mobileno,
            'payment_status': modaldata?.payment_status,
            'user_id': modaldata?.user_id
        })
    }, [visible])
    // const onFinish = (values) => {
    //     console.log('Received values:', values);
    //     // Add logic here to handle updating booking details
    //     // You can send the updated values to your API or update the state accordingly
    //     onCancel(); // Close the modal after submitting
    // };

    return (
        <div>

            <Modal
                visible={visible}
                title={customTitle}
                width={"30%"}
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
                <div className="form-container">
                    <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
                        <div className=" border-bottom-light">
                            <div className="input-group">
                                <label htmlFor="firstName" className="form-lable">Slot Date<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        //  max={today}
                                        type="date"
                                        id="age_group"
                                        disabled
                                        placeholder="date of birth"
                                        {...register('date', {
                                            required: {
                                                value: true,
                                                message: "Date of Birth is required",
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
                                            type="time"
                                            id="start_time"
                                            disabled
                                            placeholder="Start Time"
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
                                    <label htmlFor="start_time" className="form-lable">End time <span className='required-star'>*</span></label>

                                    <div className="form-group">
                                        <input
                                            className="form-field"
                                            type="time"
                                            id="end_time"
                                            disabled
                                            placeholder="End Time"
                                            // min={startTime}
                                            {...register('end_time', {
                                                required: {
                                                    value: true,
                                                    message: 'End time is required',
                                                },

                                            })}
                                        />
                                    </div>
                                    {errors?.end_time && (
                                        <span className="error-message">
                                            {errors.end_time.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="input-group">

                                <label htmlFor="date of birth" className="form-lable">Court<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        className="form-field"
                                        type="text"
                                        id="mail_id"
                                        disabled
                                        placeholder="Enter Discount/Offer Text"
                                        defaultValue="court 1" // Removed curly braces around "court 1"
                                        {...register('court', {
                                            required: false, // Simplified the required value to false
                                        })}
                                    />
                                </div>

                                {errors?.court && (
                                    <span className="error-message">
                                        {errors.court.message}
                                    </span>
                                )}
                            </div>

                            <div className="input-group">

                                <label htmlFor="firstname">Player Name<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        id="firstname"
                                        disabled
                                        placeholder="Player Name"
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
                                <label htmlFor="phone">Phone No.<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        id="phone"
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
                                <label htmlFor="event" className="form-lable">Payment Status</label>
                                <div className="form-group">
                                    <select
                                        id="location"
                                        className="form-field"

                                        {...register('payment_status', {
                                            required: {
                                                value: true,
                                                message: 'Payment Status is required',
                                            },
                                        })}
                                    >
                                        <option value="" >Select payment status</option>
                                        <option value="Confirmed">Not Paid</option>
                                        <option value="Released">Discard Booking</option>
                                        <option value="Paid">Paid</option>
                                    </select>
                                </div>
                            </div>
                            <div className="input-group">
                                <label htmlFor="event" className="form-lable">Users</label>
                                <div className="form-group">
                                    <select
                                        id="location"
                                        className="form-field"

                                        {...register('user_id', {
                                            required: {
                                                value: true,
                                                message: 'User is required',
                                            },
                                        })}
                                    >
                                        <option>{modaldata?.user?.firstname} {modaldata?.user?.lastname}</option>
                                        {userList?.map((user) => (
                                            <option value={user?.user_id}>{user?.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <Footer className='ant-modal-footer'>
                            <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset(); }}>
                                Cancel</button>
                            <button type="submit" className="pi-btn-primary">
                                {"Save"}</button>
                        </Footer>
                    </form>
                </div >
            </Modal>
        </div >

    );
};

export default EditBookingModal;
