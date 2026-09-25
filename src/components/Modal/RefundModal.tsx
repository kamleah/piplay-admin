import React, { useEffect, useState } from 'react'
import { Modal, Input } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { Icon } from "@iconify-icon/react";
import moment from 'moment';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import userImage from "../../assets/icon/user.jpeg";
import userImage2 from "../../assets/icon/adduser2278.png";
import formatWeekdays from '../Helpers/formatWeekdays';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import AcceptRejectModal from './AcceptRejectModal';
import { RefundBookings } from '../apiFile/Service';

export default function RefundModal({ getBookings, visible, name, onCancel, players, modaldata, closeBookingDetailsModel }) {
    const [confirmation, setConfirmation] = useState(false);
    const [inputValues, setInputValues] = useState({});
    const [errors, setErrors] = useState({});
    const loggedInUser = localStorage.getItem("auth");

    const addedFacilityTime = moment().add(modaldata?.facility?.cancellation_cutoff_time || 120, 'minutes');
    const bookingTime = moment(`${modaldata?.booking_date} ${modaldata?.start_time}`, 'YYYY-MM-DD HH:mm');

    const totalRemainingTimeMillis = bookingTime?.diff(addedFacilityTime);
    const totalRemainingTimeMinutes = moment.duration(totalRemainingTimeMillis).asMinutes();

    useEffect(() => {
        if (players && players.length > 0) {
            const indices = [0, 1, 2, 3, -1];

            const initialValues = indices.reduce((acc, index) => {
                const player = players.find(data => data.index === index);
                let inputValue = '';

                if (player) {
                    const cutoffTime = modaldata?.facility?.cancellation_cutoff_time || 120;
                    const cancellationFeePercentage = (modaldata?.facility?.cancellation_fee_percentage || 0) / 100;
                    if (player?.razor_id === 'NA') {
                        inputValue = '0';
                    } else if (player?.razor_id) {
                        if (totalRemainingTimeMinutes < cutoffTime) {
                            const amountToReduce = (player?.price * cancellationFeePercentage); 
                            const remainingAmount = (player?.price - amountToReduce)/100; 
                            inputValue = remainingAmount.toString()
                        } else {
                            inputValue = player?.price ? (player?.price / 100).toString() : '';
                        }
                    }
                }

                acc[index] = inputValue;
                return acc;
            }, {});
            setInputValues(initialValues);
        }
    }, [players, visible]);

    const customTitle = (
        <div className="custom-ant-modal-header">
            {name}
        </div>
    );


    const handleConfirm = async () => {
        const indicesToInclude = [0, 1, 2, 3, -1];

        const payload = indicesToInclude
            .map((index) => {
                const playerData = players.find(data => data.index === index);
                if (!playerData || !playerData?.user_id) {
                    return null;
                }

                return {
                    user_id: playerData?.user_id?._id || "",
                    razor_id: playerData?.razor_id || "",
                    razorpay_order_id: playerData?.razorpay_order_id || "",
                    price: inputValues[index] ? parseFloat(inputValues[index]) * 100 : 0,
                    booking_id: modaldata?._id ? modaldata?._id : "",
                };
            })
            .filter(item => item !== null);

        const response = await RefundBookings(loggedInUser, payload)
        if (response.code == 'RAZORPAY_REFUND_SUCCESS') {
            toast(<ToastMessage body={"Refund successfull"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
        getBookings()
        setConfirmation(false)
        onCancel()
        closeBookingDetailsModel()
    }

    const handleInputChange = (index, event) => {
        // const { value } = event.target;
        // setInputValues(prevValues => ({
        //     ...prevValues,
        //     [index]: value,
        // }));
        const { value } = event.target;
        const numberOnlyRegex = /^[0-9]*$/;

        if (numberOnlyRegex.test(value)) {
            const playerData = players.find(data => data.index === index);
            const maxPrice = playerData?.price ? playerData.price / 100 : 0;

            if (parseFloat(value) > maxPrice) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [index]: `Amount cannot exceed ₹${maxPrice}`,
                }));
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [index]: null,
                }));
                setInputValues(prevValues => ({
                    ...prevValues,
                    [index]: value,
                }));
            }
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                [index]: "Only Numbers are allowed.",
            }));
        }
    }



    return (
        <>
            <Modal title={customTitle}
                visible={visible}
                onCancel={onCancel}
                footer={null}
                className="custom-ant-modal lable-content-width"
            >
                <div className='border-bottom-light'>
                    <div className="main-container">
                        <div className="sub-container">
                            {[0, 1, 2, 3].map((index) => {
                                const playerData = players?.filter(data => data.index === index)[0];
                                const negativeIndexPlayerData = players?.filter(data => data.index === -1)[0];
                                let finalPrice = playerData?.price;

                                if (index === 0 && negativeIndexPlayerData) {
                                    finalPrice += negativeIndexPlayerData.price;
                                }

                                if (!playerData || !playerData.user_id) {
                                    return (
                                        <div key={index} className={`content ${index === 1 ? "dashed-right-border" : ""}`}>
                                            <div className="user-img-div">
                                                <img
                                                    className="user-img2"
                                                    src={userImage2}
                                                    alt="user-Image"
                                                />
                                            </div>
                                        </div>
                                    );
                                }

                                const profileImage = playerData?.user_id?.profile_url || userImage;
                                return (
                                    <div key={index} className={`content ${index === 1 ? "dashed-right-border" : ""}`}>
                                        <div className="user-img-div">
                                            <img
                                                className="user-img2"
                                                src={profileImage}
                                                alt="user-Image"
                                            />
                                        </div>
                                        <p className="name-sec">
                                            {playerData?.user_id?.firstname ?? "---"}
                                        </p>
                                        <p className="rating-sec">
                                            {modaldata?.court?.game === "padel" ? (
                                                playerData?.user_id?.skill_level_new?.[0]?.minRating
                                            ) : (
                                                playerData?.user_id?.skill_level_new?.[1]?.minRating
                                            )}
                                            <span><Icon icon="emojione:star" width="16" height="16" /></span>
                                        </p>
                                        <div className='price-input'>
                                            <Input
                                                className="refundInput"
                                                type="text"
                                                placeholder="Price"
                                                name="name"
                                                value={inputValues[index] || ''}
                                                onChange={(e) => handleInputChange(index, e)}
                                                disabled={
                                                    playerData?.razor_id === "NA"
                                                }
                                            />
                                            {index === 0 && negativeIndexPlayerData && (
                                                <>
                                                    <span className="plus-sign">+</span>
                                                    <Input
                                                        className="refundInput"
                                                        type="text"
                                                        placeholder="Additional Price"
                                                        name="additionalPrice"
                                                        value={inputValues[-1] || ''}
                                                        onChange={(e) => handleInputChange(-1, e)}
                                                        disabled={
                                                            negativeIndexPlayerData?.razor_id === "NA"
                                                        }
                                                    />
                                                </>
                                            )}
                                        </div>
                                        {errors[index] && <p className="error-message">{errors[index]}</p>}
                                        <p className="rating-sec">
                                            {playerData?.razor_id ? (
                                                playerData?.razor_id === "NA" ? (
                                                    finalPrice === 0 ? "---" : "Not Paid"
                                                ) : (
                                                    `₹ ${finalPrice / 100}`
                                                )
                                            ) : (
                                                `₹ ${finalPrice / 100}`
                                            )}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <Footer className='ant-modal-footer'>
                    <button
                        type="button"
                        className="pi-btn-secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    < button type="button" className="pi-btn-primary" onClick={() => { setConfirmation(true) }}>
                        Continue
                    </button>
                </Footer>
            </Modal>
            <AcceptRejectModal
                visible={confirmation}
                onConfirm={() => handleConfirm()}
                onCancel={() => { setConfirmation(false) }}
                name="booking"
                type={'refundbooking'}
            />
        </>
    )
}
