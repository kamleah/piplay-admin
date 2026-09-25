import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { useForm } from 'react-hook-form';
import { Icon } from '@iconify-icon/react';
import { getNewBookings, rescheduleAPI } from '../apiFile/Service';
import moment from 'moment';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { toast } from 'react-toastify';


const RescheduleBookingModal = ({ modaldata, visible, onCancel, courts, getBookings, closeBookingDetailsModel, checkRules }) => {
    const form = useForm({
        mode: 'onChange',
        defaultValues: {
            date: "",
            start_time: "",
            end_time: "",
            court: "",
            name: `${modaldata?.user?.firstname} ${modaldata?.user?.lastname}`,
            mobileno: `${modaldata?.user?.mobileno}`,
            payment_type: "",
            payment_status: "",
        }
    })
    const { register, handleSubmit, reset, setValue, setError, clearErrors, formState, watch } = form;
    const selDate = watch('date')
    const selCourt = watch('court')
    const selStartTime = watch('start_time')
    let paymentType = watch('payment_type')
    const { errors } = formState;
    const loggedInUser = localStorage.getItem("auth");
    const [slotAvailable, setSlotAvailable] = useState([])
    const [startSlots, setStartSlots] = useState<any>([]);
    const [endSlots, setEndSlots] = useState<any>([]);
    const [penalty, setPenalty] = useState({
        penalty: 0,
        type: ''
    })
    const customTitle = (
        <div className="custom-ant-modal-header">
            {'Reschedule Booking Details'}
        </div>
    );

    const getTimeDifference = (dateTime) => {
        const givenDateTime = moment(dateTime, 'YYYY-MM-DD HH:mm');

        // Current date and time
        const currentDateTime = moment();

        // Calculate the difference
        const diff = moment.duration(givenDateTime.diff(currentDateTime));

        // Get the difference in days, hours, minutes, and seconds
        const daysDiff = diff.days();
        const hoursDiff = diff.hours();
        const minutesDiff = diff.minutes();
        const secondsDiff = diff.seconds();

        return {
            days: daysDiff,
            hours: hoursDiff,
            minutes: minutesDiff,
            seconds: secondsDiff
        };
    }

    const onsubmit = async (data) => {
        let selSlots = startSlots?.filter((slot: any) => data?.start_time <= slot?.start && data?.end_time >= slot?.end
        )
        let total_amount = 0
        let sel = selSlots?.map((s: any) => {
            total_amount = total_amount + s?.slot?.price
            s.slot.startTime = s?.start
            s.slot.endTime = s?.end
            return s?.slot
        })
        const payload = {
            court_id: data.court,
            payment_type: data.payment_type,
            facility_id: modaldata?.facility_id,
            slot_ids: sel,
            name: data?.name,
            mobile_number: Number(data?.mobileno),
            old_payments: [],
            booking_date: moment(data?.date).format('YYYY-MM-DD'),
            start_time: data?.start_time,
            end_time: data?.end_time,
            total_amount: modaldata?.total_amount,
            penalty: penalty?.penalty * 100,
            startTimestamp: moment(`${data?.date} ${data?.start_time}`).valueOf(),
            endTimestamp: moment(`${data?.date} ${data?.end_time}`).valueOf(),
            coupon: false,
            requireRazorPayId: penalty?.penalty == 0 ? false : true,
            razor_id: penalty?.penalty == 0 ? modaldata?.razor_id : "Admin Booking",
            status: data?.payment_type == 'plink' ? "Confirmed" : data?.payment_status,
            payment_status: data?.payment_type == 'plink' ? "Confirmed" : data?.payment_status,
            manual: true
        }
        let response = await rescheduleAPI(loggedInUser, modaldata?._id, payload)
        if (response?.code === 'RESCHEDULED SUCCESSFULLY') {
            toast(
                <ToastMessage body={"Booking Successfully"} type="success" />,
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
            getBookings()
            reset();
            setSlotAvailable([])
            setStartSlots([])
            setEndSlots([])
            onCancel(); // Close the modal after submitting
            closeBookingDetailsModel()
        } else {
            toast(<ToastMessage body={response.err_code} type="error" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const bookingAvailable = async () => {
        if (modaldata?.facility_id == undefined) {
            return
        }
        let response = await getNewBookings(loggedInUser, selDate, modaldata?.facility_id)
        if (response?.result) {
            setSlotAvailable(response?.result)
        } else {
            setSlotAvailable([])
        }
    }

    const filterStartTime = async () => {
        console.log(slotAvailable, selCourt)
        var startSlots: any = [];
        slotAvailable.map((data: any) => {
            let flag = false;
            let obj
            data?.slots?.map(court => {
                if (court?.court_id == selCourt && court?.active == true && court?.break == false && court?.booked == false) {

                    flag = true
                    obj = court
                }
            })
            if (flag) {
                startSlots.push({ start: data?.display_time, end: data?.display_end_time, slot: obj })
            }
        })
        setStartSlots(startSlots)
    }


    const filterEndTime = async () => {
        var endSlots: any = [];

        for (var i = 0; i < startSlots.length; i++) {
            if (selStartTime < startSlots[i]?.end) {
                if (startSlots[i]?.end == startSlots[i + 1]?.start) {
                    endSlots.push({ start: startSlots[i]?.start, end: startSlots[i]?.end, slot: startSlots[i]?.slot })
                } else {
                    endSlots.push({ start: startSlots[i]?.start, end: startSlots[i]?.end, slot: startSlots[i]?.slot })
                    break;
                }
            }
        }

        setEndSlots(endSlots)
        prefillEndTime(endSlots)
    }

    const sortTimeBased = (ruleArray) => {
        ruleArray.sort((a, b) => {
            const timeA = parseInt(a.time);
            const timeB = parseInt(b.time);
            return timeA - timeB;
        });
        return ruleArray
    };

    const getPercentageToApply = (rulesArray, timeRemaining) => {
        const data = rulesArray;
        const remainingHours = timeRemaining;
        let objectInRange: any = null;

        let low = 0;
        let high = data.length - 1;

        if (remainingHours < parseInt(data[0].time)) {
            objectInRange = data[0];
        } else if (remainingHours > parseInt(data[data.length - 1].time)) {
            // If remaining hours are greater than or equal to the highest "hours" value
            objectInRange = { "percentage": "0", "time": remainingHours };
        } else {
            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                const midHours = parseInt(data[mid].time);

                if (remainingHours >= midHours) {
                    // Check if remaining hours are less than or equal to the next hours
                    if (mid === data.length - 1 || remainingHours < parseInt(data[mid + 1].time)) {
                        objectInRange = data[mid];
                        if (objectInRange.time == remainingHours) {
                            objectInRange = data[mid]
                        } else {
                            objectInRange = data[mid + 1]
                        }
                        break;
                    } else {
                        low = mid + 1;
                    }
                } else {
                    high = mid - 1;
                }
            }
        }
        return objectInRange
    };

    const reulesOfReschedule = (rule, aboutBooking) => {
        const ruleType = rule?.reschedule;
        let reschedulePayStatus = {};
        switch (ruleType) {
            case "Reshedule With Rule":
                if (rule?.r_rules == "Flat Charge") {
                    reschedulePayStatus = {
                        penalty: rule.flat_charge,
                        status: 'Confirmed',
                        requireRazorPayId: true
                    };
                    setPenalty({ penalty: rule?.flat_charge, type: rule?.r_rules });
                    return
                } else if (rule?.r_rules == "1st Reschedule is free") {
                    console.log("rule------>", rule);
                    console.log("aboutBooking---reschedule-->", aboutBooking?.reschedule);
                    if (aboutBooking?.reschedule == 0) {
                        reschedulePayStatus = {
                            penalty: 0,
                            status: 'Paid',
                            requireRazorPayId: false
                        };
                        setPenalty({ penalty: 0, type: rule?.r_rules });
                        // rescheduleBookings2(slots, reschedulePayStatus);
                    } else {
                        console.log("r_conditions------r_conditions----->", rule?.r_conditions);
                        const rulesArray = sortTimeBased(rule?.r_conditions);
                        console.log("rulesArray------------>", rulesArray);
                        const bookinDateTime = `${aboutBooking?.booking_date} ${aboutBooking?.start_time}`
                        const timeDiff = getTimeDifference(bookinDateTime);
                        console.log("timeDiff----->", timeDiff);
                        const hoursdiff = (timeDiff.days * 24) + timeDiff.hours;
                        console.log("hoursdiff------------->", hoursdiff);
                        const applyObject = getPercentageToApply(rulesArray, hoursdiff);
                        console.log("applyObject--ok-->", applyObject);
                        if (applyObject.percentage == 0) {
                            reschedulePayStatus = {
                                penalty: 0,
                                status: 'Paid',
                                requireRazorPayId: false
                            };
                            setPenalty({ penalty: 0, type: rule?.r_rules });
                            // rescheduleBookings2(slots, reschedulePayStatus);
                        } else {
                            const totalPrice = aboutBooking?.slot_ids?.reduce((total, slot) => total + slot?.price, 0);
                            const percentageAmount = (applyObject?.percentage / 100) * totalPrice;
                            reschedulePayStatus = {
                                penalty: percentageAmount,
                                status: 'Confirmed',
                                requireRazorPayId: true
                            };
                            setPenalty({ penalty: percentageAmount, type: rule?.r_rules });
                            // rescheduleBookings2(slots, reschedulePayStatus);
                            console.log("reschedulePayStatus", reschedulePayStatus);
                        }
                    }
                    return
                } else if (rule?.r_rules == "Before Time % Charged") {
                    const rulesArray = sortTimeBased(rule?.r_conditions);
                    const applyObject = getPercentageToApply(rulesArray, 1);
                    const totalPrice = aboutBooking?.slot_ids?.reduce((total, slot) => total + slot?.price, 0);
                    const percentageAmount = (Number(applyObject?.percentage) / 100) * totalPrice;
                    console.log("applyObject---->", applyObject, totalPrice);
                    reschedulePayStatus = {
                        penalty: percentageAmount,
                        status: 'Confirmed',
                        requireRazorPayId: true
                    };
                    console.log("reschedulePayStatus---->", reschedulePayStatus);
                    // rescheduleBookings2(slots, reschedulePayStatus);
                    setPenalty({ penalty: percentageAmount, type: rule?.r_rules });
                    return applyObject
                }
                break;
            case "Free Reschedule":
                reschedulePayStatus = {
                    penalty: 0,
                    status: 'Paid',
                    requireRazorPayId: false
                };
                setPenalty({ penalty: 0, type: 'Free Reschedule' });
                console.log("freeReschedule---->", 'Free Reschedule')
                // rescheduleBookings2(slots, reschedulePayStatus);
                break;
            case "No Reschedule":
                reschedulePayStatus = {
                    penalty: 0,
                    status: 'Paid',
                    requireRazorPayId: false
                };
                console.log("noReschedule---->", 'No Reschedule')
                setPenalty({ penalty: 0, type: 'No Reschedule' });
                // rescheduleBookings2(slots, reschedulePayStatus);
                break;
            default:
                break;
        }
    };

    const prefillEndTime = (endSlots) => {
        if (selStartTime && selStartTime != '') {
            const startMoment = moment(modaldata?.start_time, "HH:mm");
            const endMoment = moment(modaldata?.end_time, "HH:mm");

            // Calculate the difference in minutes
            const differenceInMinutes = endMoment.diff(startMoment, 'minutes');

            // Convert the difference into hours and minutes
            const duration = moment.duration(differenceInMinutes, 'minutes');
            const hours = Math.floor(duration.asHours());
            const minutes = duration.minutes();
            const endTime: any = moment(selStartTime, 'HH:mm').add(hours, 'hours').add(minutes, 'minutes').format('HH:mm')

            let flag = false

            for (let i = 0; i < endSlots.length; i++) {
                if (endSlots[i]?.end == endTime) {
                    flag = true
                    break;
                }
            }

            // endSlots state taking time to update 
            setTimeout(() => {
                if (flag) {
                    setValue('end_time', endTime)
                    clearErrors('end_time')
                } else {
                    setError('end_time', { type: 'custom', message: 'End time is not available for reschedule' });
                }
            }, 500);
        }
    }

    useMemo(() => {
        bookingAvailable()
        setValue('court', '')
        setValue('start_time', '')
        setValue('end_time', '')
    }, [selDate,])

    useMemo(() => {
        filterStartTime()
        setValue('start_time', '')
        setValue('end_time', '')
    }, [selCourt])
    useMemo(() => {
        filterEndTime()
        setValue('end_time', '')
    }, [selStartTime])


    useEffect(() => {
        reset({
            date: "",
            start_time: "",
            end_time: "",
            court: "",
            name: `${modaldata?.user?.firstname} ${modaldata?.user?.lastname}`,
            mobileno: `${modaldata?.user?.mobileno}`,
            payment_type: "",
            payment_status: "",
        })
        reulesOfReschedule(checkRules, modaldata)
    }, [visible])

    return (
        <div>

            <Modal
                visible={visible}
                title={customTitle}
                width={"500px"}
                footer={null}
                className="custom-ant-modal lable-content-width"
                onCancel={onCancel}
            >

                <div className="form-container">
                    <form style={{ width: "100%" }} onSubmit={handleSubmit(onsubmit)}>
                        <div className=" border-bottom-light">
                            <div className="input-group">
                                <label htmlFor="date" className="form-lable">Slot Date<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        //  max={today}
                                        type="date"
                                        id="date"
                                        placeholder="date of birth"
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

                            <div className="input-group">

                                <label htmlFor="court" className="form-lable">Court<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <select
                                        id="court"
                                        {...register("court", {
                                            required: {
                                                value: true,
                                                message: "Court is required",
                                            }
                                        })}
                                    >
                                        <option value="" >Select </option>
                                        {
                                            courts.map(court => {
                                                return (
                                                    <option value={court.value} >{court.label}</option>
                                                )
                                            })
                                        }

                                    </select>
                                </div>
                                {errors?.court && (
                                    <span className="error-message">
                                        {errors.court.message}
                                    </span>
                                )}
                            </div>

                            <div className="form-container-grid">
                                <div className="input-group">
                                    <label htmlFor="start_time" className="form-lable">
                                        Start time <span className="required-star">*</span>
                                    </label>
                                    <div className="form-group">
                                        <select
                                            id="start_time"
                                            className="form-field"
                                            {...register("start_time", {
                                                required: {
                                                    value: true,
                                                    message: "Start time is required",
                                                },
                                            })}
                                        >
                                            <option value="">Select Start Time</option>
                                            {
                                                startSlots?.map((data: any) => (
                                                    <option value={data.start}>{data.start}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    {errors?.start_time && (
                                        <span className="error-message">
                                            {errors.start_time.message}
                                        </span>
                                    )}
                                </div>
                                <div className="input-group">
                                    <label htmlFor="end_time" className="form-lable">
                                        End time <span className="required-star">*</span>
                                    </label>

                                    <div className="form-group">
                                        <select
                                            id="end_time"
                                            className="form-field"
                                            {...register("end_time", {
                                                required: {
                                                    value: true,
                                                    message: "End time is required",
                                                },
                                            })}
                                        >
                                            <option value="">Select End Time</option>
                                            {
                                                endSlots?.map((data: any) => (
                                                    <option value={data.end}>{data.end}</option>
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

                                <label htmlFor="firstname">Player Name<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        id="firstname"
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
                                <label htmlFor="phone">Phone No.<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        id="phone"
                                        placeholder="Phone No."
                                        disabled
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
                                            },
                                        })}
                                    >
                                        <option value="" selected disabled>Select Payment Type</option>
                                        <option value="">Select Payment Type</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Card">Card</option>
                                        <option value="UPI">UPI</option>
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
                                <>
                                    <div className="input-group">
                                        <label htmlFor="payment_status" className="form-lable">Payment Status?<span style={{ color: "red" }}>*</span></label>
                                        <div className="form-group">
                                            <select
                                                id="payment_status"
                                                className="form-field"
                                                // onChange={(e) => { TypeFilter(e.target.value) }}
                                                {...register('payment_status',{
                                                    required: {
                                                        value: true,
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
                                        {errors?.payment_status && (
                                            <span className="error-message">
                                                {errors.payment_status.message}
                                            </span>
                                        )}
                                    </div>
                                </>
                            }
                            <div className='pay_h'>
                                <h3 className='info-label'> <Icon icon="mdi:warning-circle" className="pay-icon" />{penalty?.type != 'Free Reschedule' ? `INR ${penalty?.penalty} will be charged for this reschedule!` : 'Free Reschedule'} </h3>
                            </div>
                        </div>
                        <Footer className='ant-modal-footer'>
                            <button type="button" className="pi-btn-secondary" onClick={onCancel}>
                                Cancel</button>
                            <button type="submit" className="pi-btn-primary" >
                                Make Payment</button>
                        </Footer>
                    </form>
                </div >
            </Modal >
        </div >

    );
};

export default RescheduleBookingModal;
