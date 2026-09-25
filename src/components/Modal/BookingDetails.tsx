import { Button, Collapse, ConfigProvider, Modal, Input } from "antd";
import { Footer } from "antd/es/layout/layout";
import React, { useEffect, useMemo, useState } from "react";
import UserLabel from "../Labels/UserLabel";
import StatusLabel from "../Labels/StatusLabel";
import {
    bookingTestNameHandler,
    formatTimeWithTestTimeStamp,
} from "../Helpers/HelperFunc";
import moment from "moment";
import { cancelAndRefundBookingAPI, cancelBookingAPI, CheckBookingCouponAPI, CheckrulesAPI, getAddPlayersBookingsAPI, getCheckRulesAPI, getMatchDetailsByIdService, scoresUpdateAPI } from "../apiFile/Service";
import EditBookingModal from "./EditBookingDetails";
import EditPlayerDetail from "./EditPlayerDetail";
import RescheduleBookingModal from "./RescheduleBooking";
import ExtendBookingModal from "./ExtendBooking";
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Icon } from "@iconify-icon/react";
import AcceptRejectModal from "./AcceptRejectModal";
import { toast } from "react-toastify";
import ToastMessage from "../../page/facilator/ToastMessage/ToastMessage";
import img from "../../assets/image/Ellipse 2.png"
import '../../page/facilator/Booking/Booking.css'
import userImage from "../../assets/icon/user.jpeg";
import userImage2 from "../../assets/icon/adduser2278.png";
import picoin from "../../assets/icon/picoin.png";
import { Link } from "react-router-dom";
import RefundModal from "./RefundModal";
import FacilityDetails from "../../components/Modal/FacilityDetails";
import racket from "../../assets/icon/racket.png";
import PaymentDetails from "./PaymentDetails";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { text } from "express";

const { Panel } = Collapse;

const BookingDetails = ({ modaldata, open, onCancel, courts, getBookings, onOk, matches, isbookedwithlastslot, setBookingDetailsModal }) => {
    // console.log("🚀 ~ BookingDetails ~ modaldata:", modaldata)
    const [modal, setModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showFacilityViewModal, setShowFacilityViewModal] = useState(false);
    const [showPaymentDetailModal, setShowPaymentDetailModal] = useState(false);
    const [paymentRazorpayId, setPaymentRazorpayId] = useState(null);
    const loggedInUser = localStorage.getItem("auth");
    const [data, setData] = useState([]);
    const [editBookingModalVisible, setEditBookingModalVisible] = useState(false);
    const [editPlayersModalVisible, setEditPlayersModalVisible] = useState(false);
    const [confirmation, setConfirmation] = useState(false);
    const [extendBookingVisible, setExtendBookingVisible] = useState(false);
    const [rescheduleBookingVisible, setRescheduleBookingVisible] = useState(false);
    const [checkRules, setCheckRules] = useState<any>();
    const [players, setPlayers] = useState<any>();
    const [accordionActiveKey, setAccordionActiveKey] = useState(['1']);
    const [couponDetails, setCouponDetails] = useState<any>();
    const { control, handleSubmit, setValue, watch } = useForm({});
    const [isEditing, setIsEditing] = useState(false);
    const [matchDetails, setMatchDetails] = useState<any>();
    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)

    useEffect(() => {
        if (modaldata?.match_score) {
            modaldata?.match_score?.forEach((item, index) => {
                setValue(`score1-${index}`, item?.score1 === '-' ? '0' : item?.score1);
                setValue(`score2-${index}`, item?.score2 === '-' ? '0' : item?.score2);
            });
        }
    }, [open]);



    const onSubmit = async (data: any) => {
        const payload = {
            bookingId: `${modaldata?._id}`,
            scores: modaldata?.match_score.map((item, index) => ({
                _id: item._id,
                score1: data[`score1-${index}`],
                score2: data[`score2-${index}`],
            })),
        };
        const response = await scoresUpdateAPI(loggedInUser, payload)
        if (response?.data?.length >= 0) {
            toast(<ToastMessage body={"Score Updated Sucessfully"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            getBookings()
            setBookingDetailsModal(false)
            setIsEditing(false);
        } else if (response?.data?.length == undefined) {
            toast(<ToastMessage body={"Failed to Update Score"} type="warning" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setIsEditing(false);
        }
    };

    const handleAccordionChange = (keys) => {
        setAccordionActiveKey(keys);
    };
    const today = moment();
    const getAddPlayersBookings = async () => {
        if (modaldata?._id == undefined) {
            return;
        }
        let response;
        response = await getAddPlayersBookingsAPI(
            loggedInUser,
            modaldata?._id
        );
        setPlayers(response.data);
    };

    const getCheckRules = async () => {
        if (modaldata?.court_id == undefined) {
            return;
        }
        let response;
        response = await CheckrulesAPI(loggedInUser, modaldata?.court_id);
        setCheckRules(response?.result);
    };

    const applyCoupon = async (data) => {
        try {
            const payload = {
                "coupon_name": data?.couponData?.coupon_name.toUpperCase(),
                "coupon_type": "Booking",
                "facility_id": loggedUserDetails?.facility_id,
                "gender": '',
                "split_amount": 0,
                "today": moment().format("YYYY-MM-DD"),
                "total_amount": modaldata?.final_amount / 100,
            };
            // console.log("==============", payload)
            let resp = await CheckBookingCouponAPI(loggedInUser, payload)
            // console.log("--------------Applied coupon------------>>>>>>>>", resp)
            if (!resp.error) {
                // toast(<ToastMessage body={"Coupon Applied Successfully"} type="success" />, {
                //   position: "top-right",
                //   autoClose: 5000,
                //   hideProgressBar: true,
                //   closeOnClick: true,
                //   pauseOnHover: true,
                //   draggable: true,
                // });
                setCouponDetails(resp.result)
            } else {
                // toast(<ToastMessage body={resp.message} type="warning" />, {
                //   position: "top-right",
                //   autoClose: 5000,
                //   hideProgressBar: true,
                //   closeOnClick: true,
                //   pauseOnHover: true,
                //   draggable: true,
                // });
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getMatchDetailsById = async () => {
        const response = await getMatchDetailsByIdService(loggedInUser, modaldata?._id);
        // console.log("response", response?.data)
        setMatchDetails(response?.data);
        if (response?.data?.coupon) {
            applyCoupon(response?.data);
        }
    };

    useEffect(() => {
        getMatchDetailsById();
        getAddPlayersBookings();
        getCheckRules();
    }, [open]);

    const handleCancel = () => {
        setModal(false);
        setShowViewModal(false);
        setShowFacilityViewModal(false);
    };
    const handleCancelPaymentDetail = () => {
        setShowPaymentDetailModal(false);
        setPaymentRazorpayId(null);
    }
    const handleEditBooking = () => {
        setEditBookingModalVisible(true);
    };

    const handleEditPlayers = () => {
        setEditPlayersModalVisible(true);
    };
    const handleExtendBooking = () => {
        setExtendBookingVisible(true);
    };
    const handleRescheduleBooking = () => {
        setRescheduleBookingVisible(true);
    };
    const handleRefundBooking = () => {
        setShowViewModal(true);
    };


    const handelFacilityDetails = () => {
        setShowFacilityViewModal(true)
    };

    const handelPaymentDetails = (paymentId) => {
        setPaymentRazorpayId(paymentId)
        setShowPaymentDetailModal(true)
    };

    const handleConfirm = async () => {
        setConfirmation(false)
        if (modaldata?.razor_id.includes("pay_")) {
            let response = await cancelAndRefundBookingAPI(loggedInUser, { 'booking_id': modaldata?._id });
            if (response.code == 'RAZORPAY_REFUND_SUCCESS') {
                toast(<ToastMessage body={'Booking cancelled successfully'} type="success" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setBookingDetailsModal(false)
                onCancel();
                getBookings();
            }
            else {
                console.log("error")
                toast(<ToastMessage body={response?.message} type="warning" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        }
        else {
            let response = await cancelBookingAPI(loggedInUser, modaldata?._id);
            if (response.code == 'RAZORPAY_REFUND_SUCCESS') {
                toast(<ToastMessage body={'Booking cancelled successfully'} type="success" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                onCancel();
                getBookings();
            }
            else {
                console.log("error")
                toast(<ToastMessage body={response?.message} type="success" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setBookingDetailsModal(false)
            }
        }

    }

    const copyToClipboard = (id) => {
        navigator.clipboard
            .writeText(id)
            .then(() => {
                toast(<ToastMessage body={"Copied Successfully"} type="success" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            })
            .catch((error) => {
                console.error("Failed to copy ID to clipboard:", error);
            });
    };

    const BookingDetails = (() => {
        const createdat = modaldata?.createdAt
        const dateobject = new Date(createdat)
        const day = String(dateobject.getDate()).padStart(2, '0');
        const month = String(dateobject.getMonth() + 1).padStart(2, '0');
        const year = dateobject.getFullYear();

        const bookingDate = `${day}-${month}-${year}`;
        const bookingTime = dateobject.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        return (
            <div className="grid-section">
                {!matches &&
                    <div className="col-span-2 col-span-2-sm-keep">
                        <h4 className="section-heading">Booking Details</h4>
                    </div>
                }
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Booking ID:<Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} onClick={() => copyToClipboard(modaldata?._id)} /></h4>
                    <p className="info-value text-break">
                        {modaldata?._id}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Player Name:</h4>
                    <p className="info-value">{modaldata?.razor_id === 'Open Play Match' ? 'Open Play Match' : modaldata?.user?.firstname + " " + modaldata?.user?.lastname}</p>                    {/* <UserLabel
                        userType="invited"
                        userData={modaldata?.user}
                    /> */}
                </div>
                <div className="col-span-2-sm-keep">
                <h4 className="info-label">Player Contact:<Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} onClick={() => copyToClipboard(modaldata?.user?.mobileno)} /></h4>
                    <p className="info-value">
                        {modaldata?.user?.mobileno
                            ? (modaldata?.user?.mobileno).toString()?.replace(/.(?=.{2})/g, (char, idx) => (idx === 0 ? char : "*"))
                            : "N/A"}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Booking Date:</h4>
                    <p className="info-value">{moment(modaldata?.booking_date).format("DD-MM-YYYY")} from {moment(modaldata?.start_time, "HH:mm").format("hh:mmA")}-{moment(modaldata?.end_time, "HH:mm").format("hh:mmA")}                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Booked On</h4>
                    <p className="info-value">
                        {bookingDate} at {bookingTime}
                    </p>
                </div>
                {/* <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Booked Time</h4>
                    <p className="info-value">
                      
                    </p>
                </div> */}
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Booking Status:</h4>
                    <StatusLabel
                        status={modaldata?.payment_status == 'Paid' ? "Success" : "Pending"}
                    />
                </div>
            </div>
        )
    })
    const FacilityDetail = (() => {
        return (
            <div className="grid-section">
                {!matches &&
                    <div className="col-span-2 col-span-2-sm-keep">
                        <label className="section-heading">
                            Facility & Court Details
                        </label>
                    </div>
                }

                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Facility Name:</h4>
                    <p className="info-value">
                        {modaldata?.facility?.name}
                    </p>
                </div>

                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Court:</h4>
                    <p className="info-value">
                        {modaldata?.court?.name}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Court Type:</h4>
                    <p className="info-value">
                        {modaldata?.court?.type}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Slot Date:</h4>
                    <p className="info-value">
                        {moment(modaldata?.booking_date).format(
                            "DD-MM-YYYY"
                        )}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Slot Timings:</h4>
                    <p className="info-value">
                        {moment(modaldata?.start_time, "HH:mm").format("hh:mm A")}{" "}-{" "}{moment(modaldata?.end_time, "HH:mm").format("hh:mm A")}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Sport type:</h4>
                    <p className="info-value capi">
                        {modaldata?.court?.game}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Facility Address:</h4>
                    <p className="info-value">
                        {modaldata?.facility?.address}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <div className="facility-details-btn">
                        <button
                            type="button"
                            className="pi-btn-primary"
                            onClick={() => { handelFacilityDetails() }}
                        >
                            Facility Details
                        </button>
                    </div>
                </div>
            </div>
        )
    })

    const PaymentDetail = (() => {
        return (
            <div className="grid-section">
                {!matches &&
                    <div className="col-span-2 col-span-2-sm-keep">
                        <label className="section-heading">Payment Details 1</label>
                    </div>}
                {modaldata?.old_payments[0]?.payment_id != "Admin Booking" &&
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Transaction ID:</h4>
                        <p className="info-value cursor-pointer" onClick={() => { handelPaymentDetails(modaldata?.old_payments[0]?.payment_id) }}>
                            {modaldata?.old_payments[0]?.payment_id || "NA"}
                        </p>
                    </div>}
                <>
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Original Amount:</h4>
                        <p className="info-value">
                            ₹ {modaldata?.old_payments.length > 0 ? modaldata?.old_payments[0]?.final_amount / 100 : modaldata.final_amount}
                        </p>
                    </div>
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Discount:</h4>
                        <p className="info-value">
                            {modaldata?.old_payments[0]?.coupon == true
                                ? modaldata?.old_payments[0]?.percentage
                                : "No Coupon Applied"}
                        </p>
                    </div>
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Coupon Code:</h4>
                        <p className="info-value">
                            {modaldata?.old_payments[0]?.coupon == true
                                ? modaldata?.old_payments[0]?.coupon_name
                                : "No Coupon Applied"}
                        </p>
                    </div>

                </>

                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Paid Amount:</h4>
                    <p className="info-value">
                        ₹ {modaldata?.old_payments[0]?.payment_status == "Paid" ? modaldata?.old_payments[0]?.amount / 100 : '0'}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Payment Status:</h4>
                      <StatusLabel
                            status={
                                modaldata?.old_payments[0]?.payment_status == "Paid"
                                    ? "Success"
                                    : 'Rejected'
                            }
                            labelText={modaldata?.old_payments[0]?.payment_status == "Paid"
                                ? "Paid"
                                : 'Not Paid Yet'
                            }
                        />
                </div>
            </div>
        )
    })
    const NewUserDetails = (() => {
        return (
            <div className="grid-section">
                {!matches &&
                    <div className="col-span-2 col-span-2-sm-keep">
                        <label className="section-heading">User Details</label>
                    </div>}
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Full Name</h4>
                    <p className="info-value">
                        {modaldata?.user?.firstname + " " + modaldata?.user?.lastname}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Email ID</h4>
                    <p className="info-value">
                        {modaldata?.user?.email}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Phone Number</h4>
                    <p className="info-value">
                        {modaldata?.user?.mobileno}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Gender</h4>
                    <p className="info-value">
                        {modaldata?.user?.gender}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Age</h4>
                    <p className="info-value">
                        {today.diff(modaldata?.user?.age_group, 'years')}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Pincode</h4>
                    <p className="info-value">
                        {modaldata?.user?.pincode}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Games Played</h4>
                    <p className="info-value">
                        {modaldata?.user?.games}
                    </p>
                </div>
            </div>
        )
    })

    const copyTransactionID = (id) => {
        navigator.clipboard
            .writeText(id)
            .then(() => {
                toast(<ToastMessage body={"Copied Successfully"} type="success" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            })
            .catch((error) => {
                console.error("Failed to copy ID to clipboard:", error);
            });
    };

    const PaymentDetails2 = (() => {
        return (

            (players && players[0]?.booking_type !== "match" ?
                <div className="grid-section">
                    {!matches &&
                        <div className="col-span-2 col-span-2-sm-keep">
                            <label className="section-heading">Payment Details 2</label>
                        </div>}
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Transaction ID:<Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} onClick={() => copyTransactionID(modaldata?.razor_id)} /></h4>
                        <p className="info-value cursor-pointer" onClick={() => { handelPaymentDetails(modaldata?.razor_id) }}>
                            {modaldata?.razor_id || "NA"}
                        </p>
                    </div>
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Original Amount:</h4>
                        <p className="info-value">
                            ₹ {Number(modaldata?.final_amount) / 100}
                        </p>
                    </div>
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Discount Applied:</h4>
                        <p className="info-value">
                            {modaldata?.coupon == true
                                ? couponDetails?.discounted_amount
                                : "No Coupon Applied"}

                        </p>
                    </div>
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Discount Coupon:</h4>
                        <p className="info-value">
                            {modaldata?.coupon == true
                                ? modaldata?.coupon_name
                                : "No Coupon Applied"}
                        </p>
                    </div>

                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Add Ons:</h4>
                        <p className="info-value">
                            {modaldata?.addOns == true
                                ? modaldata?.coupon_name
                                : "No add ons Applied"}
                        </p>
                    </div>

                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Total Booking Amount:</h4>
                        <p className="info-value">
                            ₹ {modaldata?.final_amount / 100}
                        </p>
                    </div>

                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Amount paid:</h4>
                        <p className="info-value">
                            ₹ {matchDetails?.total_amount / 100}
                        </p>
                    </div>

                    <div className="col-span-2-sm-keep">
                        <h4 className={matchDetails?.pending_amount > 0 ? 'info-label error-message' : 'info-label'}>Balance Due:</h4>
                        <p className="info-value ">
                            ₹ {matchDetails?.pending_amount / 100}
                        </p>
                    </div>
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Type of Booking:</h4>
                        <p className="info-value">
                            {matchDetails?.booking_from}
                        </p>
                    </div>
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Booked by:</h4>
                        <p className="info-value">
                            {matchDetails?.source == "app" ? matchDetails?.userData?.firstname + " " + matchDetails?.userData?.lastname :
                                matchDetails?.bookedAdmin?.firstname + " " + matchDetails?.bookedAdmin?.lastname}
                        </p>
                    </div>
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Payment Currency:</h4>
                        <p className="info-value">
                            {matchDetails?.payment_currency}
                        </p>
                    </div>
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Payment by:</h4>
                        <p className="info-value text-capitalize">
                            {matchDetails?.payment_type}
                        </p>
                    </div>

                    <>
                    </>

                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Payment Status:</h4>
                        <StatusLabel
                            status={
                                modaldata?.payment_status == "Paid"
                                    ? "Success"
                                    : 'Rejected'
                            }
                            labelText={modaldata?.payment_status == "Paid"
                                ? "Paid"
                                : 'Not Paid Yet'
                            }
                        />
                    </div>
                </div>
                :
                <div className="grid-section">
                    {!matches &&
                        <div className="col-span-2 col-span-2-sm-keep">
                            <label className="section-heading">Payment Details 3</label>
                        </div>}
                    {/* <div className="col-span-2 col-span-2-sm-keep">
                        <h4 className="info-label">Transaction ID: 1</h4>
                        {players
                            ?.filter(player => player?.razor_id !== "NA" && player?.razor_id !== undefined)
                            ?.sort((a, b) => a.index - b.index)
                            ?.map((player) => (
                                <div className="d-flex paymentId">
                                    <p className="info-value" key={player.index} >
                                        {player?.user_id?.firstname} :- {player?.razor_id?.substring(0, 12)}...
                                    </p>
                                    <p>
                                        <button
                                            type="button"
                                            className="pi-btn-primary btn-sm"
                                            onClick={() => { handelPaymentDetails(player?.razor_id) }}
                                        >
                                            More Details
                                        </button>
                                    </p>
                                </div>
                            ))}
                    </div> */}
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Transaction ID:<Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} onClick={() => copyTransactionID(modaldata?.razor_id)} /></h4>
                        <p className="info-value cursor-pointer" onClick={() => { handelPaymentDetails(modaldata?.razor_id) }}>
                            {modaldata?.razor_id}
                        </p>
                    </div>
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Original Amount:</h4>
                        <p className="info-value">
                            ₹ {Number(modaldata?.final_amount) / 100}
                        </p>
                    </div>
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Discount Applied:</h4>
                        <p className="info-value">
                            {modaldata?.coupon == true
                                ? couponDetails?.discounted_amount
                                : "No Coupon Applied"}

                        </p>
                    </div>
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Discount Coupon:</h4>
                        <p className="info-value">
                            {modaldata?.coupon == true
                                ? matchDetails?.couponData?.coupon_name
                                : "No Coupon Applied"}
                        </p>
                    </div>

                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Add Ons:</h4>
                        <p className="info-value">
                            {modaldata?.addOns == true
                                ? modaldata?.coupon_name
                                : "No add ons Applied"}
                        </p>
                    </div>

                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Total Booking Amount:</h4>
                        <p className="info-value">
                            ₹ {modaldata?.final_amount / 100}
                        </p>
                    </div>
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Amount paid:</h4>
                        <p className="info-value">
                            ₹ {matchDetails?.total_amount / 100}
                        </p>
                    </div>

                    <div className="col-span-2">
                        <h4 className="info-label">Other Transactions :</h4>

                        <div className="input-group col-span-2 justify-center">
                            <div className="compact-table-container">

                                <table className="compact-table">
                                    <thead>
                                        <tr>
                                            <th>Amount</th>
                                            <th>User</th>
                                            <th>Txn Id</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {players
                                            ?.filter(player => player?.razor_id !== "NA" && player?.razor_id !== undefined)
                                            ?.sort((a, b) => a.index - b.index)
                                            ?.map((player, index) => (
                                                <tr key={index}>
                                                    <td>{player?.razorpay_order_id ? "₹" : <img src={picoin} width={12} height={12} />} {player?.price / 100}</td>
                                                    <td>{player?.user_id?.firstname}</td>
                                                    <td>{player?.razor_id}</td>
                                                    <td>
                                                        <div className="action-button-container-centered">
                                                            <button className='action-button view-button'
                                                                onClick={() => { handelPaymentDetails(player?.razor_id) }}
                                                            >
                                                                <Icon icon="raphael:view" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2-sm-keep">
                        <h4 className={matchDetails?.pending_amount > 0 ? 'info-label error-message' : 'info-label'}>Balance Due:</h4>
                        <p className="info-value ">
                            ₹ {matchDetails?.pending_amount / 100}
                        </p>
                    </div>
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Type of Booking:</h4>
                        <p className="info-value">
                            {matchDetails?.booking_from}
                        </p>
                    </div>
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Booked by:</h4>
                        <p className="info-value">
                            {matchDetails?.source == "app" ? matchDetails?.userData?.firstname + " " + matchDetails?.userData?.lastname :
                                matchDetails?.bookedAdmin?.firstname + " " + matchDetails?.bookedAdmin?.lastname}
                        </p>
                    </div>
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Payment Currency:</h4>
                        <p className="info-value">
                            {matchDetails?.payment_currency}
                        </p>
                    </div>
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Payment by:</h4>
                        <p className="info-value">
                            {matchDetails?.payment_type}
                        </p>
                    </div>
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Amount paid by players:</h4>
                        <p className="info-value">
                            ₹ {
                                players
                                    ?.filter(player => player?.razor_id && player?.razor_id !== "NA")
                                    ?.reduce((total, player) => total + player?.price, 0) / 100
                            }
                        </p>
                    </div>
                    {/* <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Remaining Amount:</h4>
                        <p className="info-value">
                            ₹ {
                                modaldata.final_amount / 100
                            }
                        </p>
                    </div> */}
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Payment Status:</h4>
                        <StatusLabel
                            status={
                                modaldata?.payment_status == "Paid"
                                    ? "Success"
                                    : 'Rejected'
                            }
                            labelText={modaldata?.payment_status == "Paid"
                                ? "Paid"
                                : 'Not Paid Yet'
                            }
                        />
                    </div>
                </div>
            )
        )
    })

    const PlayerDetails = (() => {
        if (!players || players[0]?.booking_type !== "match") return null;
        return (
            <div className="parent-container">
                <h3 className="">Player Details</h3>
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
        )
    })








    const PaymentDetailsExtendReschedule = (() => {
        const formatTime = (timeRange) => {
            if (!timeRange) return '';

            const convertTo12HourFormat = (time) => {
                let [hour, minute] = time.split(':');
                hour = parseInt(hour, 10);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                hour = hour % 12 || 12; // Convert hour to 12-hour format
                return `${hour}:${minute} ${ampm}`;
            };

            const [startTime, endTime] = timeRange.split('-');
            return `${convertTo12HourFormat(startTime)} - ${convertTo12HourFormat(endTime)}`;
        };
        return (

            <div className="grid-section">
                {!matches &&
                    <div className="col-span-2 col-span-2-sm-keep">
                        <label className="section-heading">Payment Details 4 {modaldata?.booking_type == 'extend' ? '(Extended Slots)' : '(Rescheduled Slots)'}</label>
                    </div>}
                {
                    modaldata?.razor_id != 'Admin Booking' &&
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Transaction ID:</h4>
                        <p className="info-value cursor-pointer" onClick={() => { handelPaymentDetails(modaldata?.razor_id) }}>
                            {modaldata?.razor_id}
                        </p>
                    </div>
                }
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">{modaldata?.booking_type == 'extend' ? "Extend Slot Amount:" : "Penalty Amount"}</h4>
                    <p className="info-value">
                        {modaldata?.booking_type == 'extend' ? `₹ ${modaldata?.total_amount / 100}` : `₹ ${modaldata?.penalty / 100}`}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Payment Status:</h4>
                    <StatusLabel
                            status={
                                modaldata?.old_payments[0]?.payment_status == "Paid"
                                    ? "Success"
                                    : 'Rejected'
                            }
                            labelText={modaldata?.old_payments[0]?.payment_status == "Paid"
                                ? "Paid"
                                : 'Not Paid Yet'
                            }
                        />
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Old Date:</h4>
                    <p className="info-value">
                        {moment(modaldata?.old_payments[0]?.old_date).format("DD-MM-YYYY")}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Old Time:</h4>
                    <p className="info-value">
                        {formatTime(modaldata?.old_payments[0]?.old_time) || 'N/A'}
                    </p>
                </div>
            </div>
        )
    })
    const ExtraPlayers = (() => {
        if (!players || players[0]?.booking_type !== "match") return null;
        return (
            <div className="parent-container">
                <h3 className="">Extra Players</h3>
                <div className="main-container">
                    <div className="sub-container">
                        {[4, 5, 6, 7].map((index) => {
                            const playerData = players?.filter(data => data.index === index)[0];
                            if (!playerData || !playerData.user_id) {
                                return (
                                    <div key={index} className={`content ${index === 5 ? "dashed-right-border" : ""}`}>
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
                                <div key={index} className={`content ${index === 5 ? "dashed-right-border" : ""}`}>
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
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        )
    })

    const MatchScore = (() => {
        if (!players || players[0]?.booking_type !== "match") return null;
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="new-parent-container">
                    <h3 className="">Match Score</h3>
                    <div className="new-main-container">
                        <div className="content-container">
                            {[0, 1].map((index) => {
                                const playerData = players?.filter(data => data.index === index)[0];
                                if (!playerData || !playerData?.user_id) {
                                    return (
                                        <div className="extra-img-div">
                                            <img className="user-img2" src={userImage2} alt="user-Image" />
                                        </div>
                                    );
                                }

                                const profileImage = playerData?.user_id.profile_url || userImage;

                                return (
                                    <div className="sec-1">
                                        <div className="extra-img-div">
                                            <img className="user-img2" src={profileImage} alt="user-Image" />
                                        </div>
                                        <p className="name-sec">{playerData?.user_id.firstname ?? "---"}</p>
                                    </div>
                                );
                            })}
                            <div className="sec-3">
                                {(modaldata?.winnerTeam == "Team 1" && modaldata?.winnerTeam != "Draw") && <Icon icon='icon-park-solid:trophy' height='30' width='30' color={'#F17121'} />}
                            </div>
                            <div className="scoreDetail">
                                {modaldata?.match_score?.map((item, index) => (
                                    <div className="sec-4" key={index}>
                                        {!isEditing ? (
                                            <p>{item?.score1 === '-' ? 0 : item.score1}</p>
                                        ) : (
                                            <Controller
                                                name={`score1-${index}`}
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        className="scoreInput"
                                                        type="text"
                                                        placeholder="Score 1"
                                                    />
                                                )}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="content-container-2">
                            {[2, 3].map((index) => {
                                const playerData = players?.filter(data => data.index === index)[0];
                                if (!playerData || !playerData?.user_id) {
                                    return (
                                        <div className="extra-img-div">
                                            <img className="user-img2" src={userImage2} alt="user-Image" />
                                        </div>
                                    );
                                }

                                const profileImage = playerData?.user_id.profile_url || userImage;

                                return (
                                    <div className="sec-1">
                                        <div className="extra-img-div">
                                            <img className="user-img2" src={profileImage} alt="user-Image" />
                                        </div>
                                        <p className="name-sec">{playerData?.user_id.firstname ?? "---"}</p>
                                    </div>
                                );
                            })}
                            <div className="sec-3">
                                {(modaldata?.winnerTeam != "Team 1" && modaldata?.winnerTeam != "Draw") && <Icon icon='icon-park-solid:trophy' height='30' width='30' color={'#F17121'} />}
                            </div>
                            <div className="scoreDetail">
                                {modaldata?.match_score?.map((item, index) => (
                                    <div className="sec-4" key={index}>
                                        {!isEditing ? (
                                            <p>{item?.score2 === '-' ? 0 : item.score2}</p>
                                        ) : (
                                            <Controller
                                                name={`score2-${index}`}
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        className="scoreInput"
                                                        type="text"
                                                        placeholder="Score 2"
                                                    />
                                                )}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="d-flex justify-end mr-10">
                            {!isEditing ? (
                                <button
                                    type="button"
                                    className="pi-btn-primary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Score
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="pi-btn-delete mr-10"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="pi-btn-primary"
                                    >
                                        Submit Score
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="content-container-3">
                            <div className="extra-player-container">
                                <h3>Extra Players</h3>
                                <div className="img-sec">
                                    {[4, 5, 6, 7].map((index) => {
                                        const playerData = players?.filter(data => data.index === index)[0];

                                        if (!playerData || !playerData?.user_id) {
                                            return (
                                                <div key={index} className="extra-child-container">
                                                    <img className="extra-img-sec" src={userImage2} alt="user-Image" />
                                                </div>
                                            );
                                        }

                                        const profileImage = playerData?.user_id?.profile_url || userImage;

                                        return (
                                            <div key={index} className="extra-child-container">
                                                <img className="extra-img-sec" src={profileImage} alt="user-Image" />
                                                <p>{playerData.user_id.firstname ?? "---"}</p>
                                            </div>
                                        );
                                    })}

                                </div>
                            </div>
                            <div className="icon-sec">
                                {/* <div className="icon-1"><Icon icon='maki:tennis' height='30' width='30' /></div> */}
                                <img src={racket} alt="" className="icon-1" />
                                <div className="icon-2"><Icon icon='entypo:forward' height='30' width='30' /></div>
                            </div>

                        </div>
                    </div>

                </div >
            </form>
        )
    })


    const PaymentDetailsExtendReschedule2 = (({ data }) => {
        return (
            <div className="grid-section">
                {!matches &&
                    <div className="col-span-2 col-span-2-sm-keep">
                        <label className="section-heading">Payment Details (Extended Slots)</label>
                    </div>}
                {
                    data?.payment_id != 'Admin Booking' &&
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Transaction ID:</h4>
                        <p className="info-value cursor-pointer" onClick={() => { handelPaymentDetails(data?.payment_id) }}>
                            {data?.payment_id}
                        </p>
                    </div>
                }

                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Paid Amount:</h4>
                    <p className="info-value">
                        ₹ {data?.amount / 100}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Payment Status:</h4>
                    <StatusLabel
                        status={
                            data?.payment_status == "Paid"
                                ? "Success"
                                : data?.payment_status
                        }
                    />
                </div>
            </div>
        )
    })
    const PaymentDetailsReschedule = (({ data }) => {
        const formatTime = (timeRange) => {
            if (!timeRange) return '';

            const convertTo12HourFormat = (time) => {
                let [hour, minute] = time.split(':');
                hour = parseInt(hour, 10);
                const ampm = hour >= 12 ? 'PM' : 'AM';
                hour = hour % 12 || 12; // Convert hour to 12-hour format
                return `${hour}:${minute} ${ampm}`;
            };

            const [startTime, endTime] = timeRange.split('-');
            return `${convertTo12HourFormat(startTime)} - ${convertTo12HourFormat(endTime)}`;
        };

        return (
            <div className="grid-section">
                {!matches &&
                    <div className="col-span-2 col-span-2-sm-keep">
                        <label className="section-heading">Payment Details (Rescheduled Slots)</label>
                    </div>}
                {
                    data?.payment_id != 'Admin Booking' &&
                    <div className="col-span-2-sm-keep">
                        <h4 className="info-label">Transaction ID:</h4>
                        <p className="info-value cursor-pointer" onClick={() => { handelPaymentDetails(data?.payment_id) }}>
                            {data?.payment_id}
                        </p>
                    </div>
                }
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Paid Amount:</h4>
                    <p className="info-value">
                        ₹ {data?.penalty / 100}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Payment Status:</h4>
                    <StatusLabel
                        status={
                            data?.payment_status == "Paid"
                                ? "Success"
                                : data?.payment_status
                        }
                    />
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Old Date:</h4>
                    <p className="info-value">
                        {moment(data?.old_date).format("DD-MM-YYYY")}
                    </p>
                </div>
                <div className="col-span-2-sm-keep">
                    <h4 className="info-label">Old Time:</h4>
                    <p className="info-value">
                        {formatTime(data?.old_time)}
                    </p>
                </div>
            </div>
        )
    })


    // const shouldDisableButton = moment(`${modaldata?.booking_date} ${modaldata?.start_time}`, 'YYYY-MM-DD HH:mm')
    //     .format('DDMMYYYYHHmm') > moment().add(modaldata?.facility?.reschedule_cutoff_button_disable_time, 'hours').format('DDMMYYYYHHmm');

    // const shouldHideRescheduleButton = modaldata?.facility?.no_of_reschedules === modaldata?.reschedule


    return (
        <>
            {/* <Button
                key="back"
                className="cancelBookingButton"
                onClick={() => { setModal(true) }}
            >
                Booking Details
            </Button> */}
            <Modal
                title={
                    <div className="custom-ant-modal-header">Court Booking Details </div>
                }
                mask={false}
                style={{ top: 20 }}
                open={open}
                onCancel={onCancel}
                onOk={onOk}
                footer={null}
                className="custom-ant-modal custom-ant-modal-md modal-body lable-content-width"
                width={"75%"}
                centered
            >

                <div className="booking-details-container-outer">
                    <div className={!matches ? 'booking-details-container' : 'booking-details-container-mobile'}>
                        {!matches &&
                            <div className="main-outer-grid">
                                <div className="grid-container">
                                    <BookingDetails />
                                </div>

                                <div className="grid-container">
                                    <FacilityDetail />
                                </div>

                                {modaldata?.old_payments?.length > 0 ?
                                    <div className="grid-container">
                                        <PaymentDetail />
                                    </div> :
                                    <div className="grid-container">
                                        <PaymentDetails2 />
                                    </div>
                                }
                                {/* <div className="grid-container">
                                    <NewUserDetails />
                                </div> */}
                                <div className="grid-container">
                                    <PlayerDetails />
                                    <ExtraPlayers />
                                </div>
                                {/* <div className="grid-container">
                                    <ExtraPlayers />
                                </div> */}
                                <div className="grid-container">
                                    <MatchScore />
                                </div>
                                <div className="grid-container">

                                </div>
                                {/* <div className="grid-container">
                                    <ExtraPlayers />
                                </div>
                                <div className="grid-container">
                                    <MatchScore />
                                </div> */}

                                {
                                    (modaldata?.booking_type != 'booking' && modaldata?.booking_type != "match") &&
                                    <div className="grid-container">
                                        <PaymentDetailsExtendReschedule />
                                    </div>
                                }
                                {
                                    modaldata?.old_payments?.length > 0 && modaldata?.extend > 0 &&
                                    (modaldata?.old_payments?.map((data, i) => {
                                        if (data?.booking_type == 'extend') {
                                            return (
                                                <div className="grid-container">
                                                    <PaymentDetailsExtendReschedule2 data={data} />
                                                </div>
                                            )
                                        }
                                    }))
                                }
                                {
                                    modaldata?.old_payments?.length > 0 && modaldata?.reschedule > 0 &&
                                    <>
                                        {modaldata?.old_payments?.map((data, i) => {
                                            if (data?.booking_type == 'reschedule' && i != 0) {
                                                return (
                                                    <div className="grid-container">
                                                        <PaymentDetailsReschedule data={data} />
                                                    </div>
                                                )
                                            }
                                        })
                                        }
                                    </>
                                }
                                {
                                    (modaldata?.old_payments?.length / 2) != 0 &&
                                    <div className="grid-container"></div>
                                }
                            </div>}
                        {matches &&
                            <div className="main-outer-grid">
                                <div className="grid-container">
                                    <ConfigProvider
                                        theme={{
                                            components: {
                                                Collapse: {
                                                    contentBg: '#EBEBEB !important',
                                                    headerPadding: '15px 20px',
                                                    borderRadiusLG: 8
                                                },
                                            },
                                        }}
                                    >
                                        <Collapse
                                            className="collapse-container"
                                            accordion
                                            activeKey={accordionActiveKey}
                                            onChange={handleAccordionChange}
                                            expandIconPosition="right"
                                            bordered={false}
                                            expandIcon={({ isActive }) => (
                                                <strong style={{ fontWeight: 'bold' }}>
                                                    {isActive ? <Icon className="icon-white" icon="ph:caret-up-bold" /> : <Icon className="icon-white" icon="ph:caret-down-bold" />}
                                                </strong>
                                            )}            >
                                            <Panel className="panel-header" header={<strong>Booking Details</strong>} key="1">
                                                <BookingDetails />
                                            </Panel>
                                            <Panel className="panel-header" header={<strong>Facility & Court Details</strong>} key="2">
                                                <FacilityDetail />
                                            </Panel>
                                            {modaldata?.old_payments?.length > 0 ?
                                                <Panel className="panel-header" header={<strong>Payment Details</strong>} key="3">
                                                    <PaymentDetail />
                                                </Panel> :
                                                <Panel className="panel-header" header={<strong>Payment Details</strong>} key="4">
                                                    <PaymentDetails2 />
                                                </Panel>
                                            }
                                            {/* <Panel className="panel-header" header={<strong>User Details</strong>} key="5">
                                                <NewUserDetails />
                                            </Panel> */}
                                            <Panel className="panel-header" header={<strong>Players Details</strong>} key="6">
                                                <PlayerDetails />
                                            </Panel>
                                            <Panel className="panel-header" header={<strong>Extra Players</strong>} key="7">
                                                <ExtraPlayers />
                                            </Panel>
                                            <Panel className="panel-header" header={<strong>Match Score</strong>} key="8">
                                                <MatchScore />
                                            </Panel>
                                            {/* <Panel className="panel-header" header={<strong>Extra Players</strong>} key="7">
                                                <ExtraPlayers />
                                            </Panel>
                                            <Panel className="panel-header" header={<strong>Match Score</strong>} key="8">
                                                <MatchScore />
                                            </Panel> */}

                                            {modaldata?.booking_type != 'booking' &&
                                                <Panel className="panel-header"
                                                    header={<strong>Payment Details {modaldata?.booking_type == 'extend' ? '(Extended Slots)' : '(Rescheduled Slots)'}</strong>}
                                                    key="8">
                                                    <PaymentDetailsExtendReschedule />
                                                </Panel>
                                            }
                                            {
                                                modaldata?.old_payments?.length > 0 && modaldata?.extend > 0 &&
                                                (modaldata?.old_payments?.map((data, i) => {
                                                    if (data?.booking_type == 'extend') {
                                                        return (
                                                            <Panel className="panel-header" header={<strong>Payment Details (Extended Slots)</strong>} key="7">
                                                                <PaymentDetailsExtendReschedule2 data={data} />
                                                            </Panel>
                                                        )
                                                    }
                                                }))
                                            }
                                            {
                                                modaldata?.old_payments?.length > 0 && modaldata?.reschedule > 0 &&
                                                <>
                                                    {modaldata?.old_payments?.map((data, i) => {
                                                        if (data?.booking_type == 'reschedule' && i != 0) {
                                                            return (
                                                                <Panel className="panel-header" header={<strong>Payment Details (Rescheduled Slots)</strong>} key="8">
                                                                    <PaymentDetailsReschedule data={data} />
                                                                </Panel>
                                                            )
                                                        }
                                                    })
                                                    }
                                                </>
                                            }

                                        </Collapse>
                                    </ConfigProvider>
                                </div>
                            </div>}
                    </div>
                </div>
                <Footer className={`ant-modal-footer ${moment(`${modaldata?.booking_date} ${modaldata?.start_time}`, 'YYYY-MM-DD HH:mm').isAfter(moment()) && matches ? "scrollable-footer" : ""}`}>
                    <div className="footer-buttons-grid">
                        {/* <button type="button" className="pi-btn-secondary" onClick={onCancel}>
                            Close
                        </button> */}

                        {moment(`${modaldata?.booking_date} ${modaldata?.start_time}`, 'YYYY-MM-DD HH:mm').isBefore(moment())
                            &&
                            <>
                                < button
                                    type="button"
                                    className="pi-btn-primary"
                                    onClick={handleEditBooking}
                                >
                                    Edit Booking Details
                                </button>
                            </>
                        }

                        {/* {moment(`${modaldata?.booking_date} ${modaldata?.start_time}`, 'YYYY-MM-DD HH:mm').isAfter(moment())
                            && */}
                        <>
                            {<>
                                {players && players[0]?.booking_type == 'match' ?
                                    < button type="button" className="pi-btn-delete"
                                        onClick={() => { handleRefundBooking() }}
                                    >
                                        Cancel Matchmaking
                                    </button>
                                    :
                                    <>
                                        {
                                            moment(`${modaldata?.booking_date} ${modaldata?.start_time}`, 'YYYY-MM-DD HH:mm').format('DDMMYYYYHHmm')
                                            //  > moment().add(modaldata?.facility?.cancel_cutoff_button_disable_time, 'hours').format('DDMMYYYYHHmm') 
                                            &&
                                            < button type="button" className="pi-btn-delete" onClick={() => { setConfirmation(true) }}>
                                                Cancel Booking & Refund
                                            </button>}
                                    </>
                                }
                            </>}
                            {!(players && players[0]?.booking_type === "match") && (
                                <>
                                    {checkRules && checkRules?.is_reschedule || checkRules == 0 ?
                                        // shouldDisableButton && !shouldHideRescheduleButton && 
                                        (
                                            <button
                                                type="button"
                                                className="pi-btn-prima"
                                                onClick={handleRescheduleBooking}
                                            >
                                                Reschedule
                                            </button>
                                        ) : null
                                    }
                                    {!isbookedwithlastslot && (checkRules && checkRules?.extend || checkRules == 0) ? (
                                        <button
                                            type="button"
                                            className="pi-btn-primar"
                                            onClick={handleExtendBooking}
                                        >
                                            Extend Slots
                                        </button>
                                    ) : null}
                                </>
                            )}
                            <button
                                type="button"
                                className="pi-btn-primary"
                                onClick={handleEditBooking}
                            >
                                Edit Booking Details
                            </button>
                            <button
                                type="button"
                                className="pi-btn-primary"
                                onClick={handleEditPlayers}
                            >
                                Edit Players Details
                            </button> </>
                    </div>
                </Footer>
            </Modal >
            <EditBookingModal
                visible={editBookingModalVisible}
                modaldata={modaldata}
                onCancel={() => setEditBookingModalVisible(false)}
                getBookings={getBookings}
                closeBookingDetailsModel={onCancel}
            />
            <EditPlayerDetail
                modaldata={modaldata}
                visible={editPlayersModalVisible}
                row
                onCancel={() => setEditPlayersModalVisible(false)}
                closeBookingDetailsModel={onCancel}
            />
            <ExtendBookingModal
                modaldata={modaldata}
                visible={extendBookingVisible}
                getBookings={getBookings}
                onCancel={() => setExtendBookingVisible(false)}
                closeBookingDetailsModel={onCancel}
            />
            <RescheduleBookingModal
                modaldata={modaldata}
                visible={rescheduleBookingVisible}
                courts={courts}
                getBookings={getBookings}
                onCancel={() => setRescheduleBookingVisible(false)}
                closeBookingDetailsModel={onCancel}
                checkRules={checkRules}
            />
            <AcceptRejectModal
                visible={confirmation}
                onConfirm={handleConfirm}
                onCancel={() => { setConfirmation(false) }}
                name="booking"
                type={'cancelbooking'}
            />
            <RefundModal
                visible={showViewModal}
                onCancel={handleCancel}
                getBookings={getBookings}
                name="Refund modal"
                players={players}
                modaldata={modaldata}
                closeBookingDetailsModel={onCancel}
            />
            <FacilityDetails
                visible={showFacilityViewModal}
                onConfirm={{}}
                onCancel={handleCancel}
                name="Facility Details"
                row={modaldata?.facility}
            />
            <PaymentDetails
                visible={showPaymentDetailModal}
                // onConfirm={{}}
                onCancel={handleCancelPaymentDetail}
                name="Payment Details"
                razorId={paymentRazorpayId}
            />
        </>
    );
};

export default BookingDetails;
