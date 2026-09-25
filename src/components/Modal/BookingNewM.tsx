import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, Input } from "antd";
import { Footer } from "antd/es/layout/layout";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import {
  addBookingPlayer,
  addNewBookingAPI,
  CheckBookingCouponAPI,
  editBookingdetail,
  getNewBookings,
} from "../apiFile/Service";
import { toast } from "react-toastify";
import ToastMessage from "../../page/facilator/ToastMessage/ToastMessage";
import moment from "moment";
import AddPlayerModal from "./addNewPlayer";
import makeAnimated from "react-select/animated";
import { useSelector } from "react-redux";
const animatedComponents = makeAnimated();

const NAddBookingModal = ({
  visible,
  onCancel,
  modaldata,
  facility,
  courts,
  getBookings,
  slot,
  data,
}) => {
  // console.log("🚀 ~ slot:", slot)
  const form = useForm({
    defaultValues: {
      date: "",
      start_time: "",
      end_time: "",
      court: "",
      name: "",
      mobileno: "",
      payment_type: "",
      coupon: "",
      gender: "",
      payment_status: "",
      razor_id: "",
      booking_reason: ""
    },
  });
  const { register, handleSubmit, control, reset, setValue, formState, watch } = form;
  let paymentType = watch('payment_type')
  const { errors } = formState;
  const loggedInUser = localStorage.getItem("auth");
  const selDate = watch("date");
  const selCourt = watch("court");
  const selStartTime = watch("start_time");
  const selEndTime = watch("end_time");
  const gender = watch("gender");
  const couponData = watch("coupon");
  const customTitle = (
    <div className="custom-ant-modal-header">{"Add New Booking"}</div>
  );
  const [editPlayersModalVisible, setEditPlayersModalVisible] = useState(false);
  const [slotAvailable, setSlotAvailable] = useState([]);
  const [players, setPlayers] = useState({ booking_id: "", players: [] });
  const [startSlots, setStartSlots] = useState<any>([]);
  const [endSlots, setEndSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [basePrice, setBasePrice] = useState(0);
  const [gst, setGST] = useState(0);
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [couponDetails, setCouponDetails] = useState({ _id: '' });
  const [PaymentType, setPaymentType] = useState("");

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
    if (e.target.value == 'free') {
      resetCoupon();
    }
  };

  const resetCoupon = () => {
    setCouponDetails({ _id: '' });
    setBasePrice(0);
    setTotalAmount(0);
    setGST(0);
    setFinalAmount(0);
    setDiscountedAmount(0);
    reset({
      coupon: '',
      gender: ''
    })
  }

  const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)

  const handleEditPlayers = () => {
    setEditPlayersModalVisible(true);
  };

  const onSubmit = async (data: any) => {
    let response;

    let selSlots = startSlots?.filter(
      (slot: any) =>
        data?.start_time <= slot?.start && data?.end_time >= slot?.end
    );
    let total_amount = 0;
    let sel = selSlots?.map((s: any) => {
      total_amount = total_amount + s?.slot?.price;
      s.slot.startTime = s?.start;
      s.slot.endTime = s?.end;
      return s?.slot;
    });

    const payload = {
      booking_date: data?.date,
      court_id: data?.court,
      endTimestamp: moment(`${data?.date} ${data?.end_time}`).valueOf(),
      start_time: data?.start_time,
      end_time: data?.end_time,
      facility_id: !loggedUserDetails?.roleId ? typeof facility == 'object' ? facility.value : facility : loggedUserDetails?.facility_id,
      percentage: 0,
      razor_id: data?.razor_id,
      name: data?.name,
      mobile_number: Number(data?.mobileno),
      slot_ids: sel,
      startTimestamp: moment(`${data?.date} ${data?.start_time}`).valueOf(),
      status: data.payment_status == "Released" ? "Released" : data?.payment_type == 'plink' ? "Confirmed" : data?.payment_status,
      payment_status: data?.payment_type == 'plink' ? "Confirmed" : data?.payment_type == 'free' ? "Paid" : data?.payment_status,
      payment_type: data?.payment_type,
      total_amount: finalAmount * 100,
      final_amount: selectedSlots.length > 0 ? selectedSlots.reduce((sum, slot: any) => sum + Number(slot?.price), 0) * 100 : total_amount * 100,
      manual: true,
      coupon: couponData && couponData != '' ? true : false,
      coupon_name: couponData.toUpperCase(),
      coupon_id: couponDetails._id ? couponDetails._id : null,
      bookedby: loggedUserDetails?._id,
      booking_reason: data?.booking_reason
    };
    response = await addNewBookingAPI(loggedInUser, payload);
    if (response.code == "BOOKING_SUCCESS") {
      if (players?.players?.length > 0) {
        players.booking_id = response.data[0]._id;
        let playersAPI = await addBookingPlayer(loggedInUser, players);
        setPlayers({ booking_id: "", players: [] });
        if (playersAPI.code != "SUCCESS") {
          toast(<ToastMessage body={response.message} type="warning" />, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }

      }
      toast(<ToastMessage body={"Booking Successfully"} type="success" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      reset();
      // setSlotAvailable([]);
      setStartSlots([]);
      setEndSlots([]);
      getBookings();
      onCancel();
    } else {
      toast(<ToastMessage body={response.message} type="warning" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const applyCoupon = async (selectedslots = []) => {
    try {
      const payload = {
        "coupon_name": couponData.toUpperCase(),
        "coupon_type": "Booking",
        "facility_id": !loggedUserDetails?.roleId ? typeof facility == 'object' ? facility.value : facility : loggedUserDetails?.facility_id,
        "gender": gender,
        "split_amount": 0,
        "today": moment().format("YYYY-MM-DD"),
        "total_amount": selectedslots.length > 0
          ? selectedslots.reduce((sum, slot: any) => sum + Number(slot?.price), 0)
          : selectedSlots.reduce((sum, slot: any) => sum + Number(slot?.price), 0),
      };
      // console.log("==============", payload)
      let resp = await CheckBookingCouponAPI(loggedInUser, payload)
      // console.log(resp)
      if (!resp.error) {
        toast(<ToastMessage body={"Coupon Applied Successfully"} type="success" />, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setCouponDetails(resp.result)
        setBasePrice(resp.result.base_price);
        setTotalAmount(resp.result.total_amount);
        setGST(resp.result.gst_amount);
        setFinalAmount(resp.result.final_amount);
        setDiscountedAmount(resp.result.discounted_amount);
      } else {
        toast(<ToastMessage body={resp.message} type="warning" />, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  const removeCoupon = async () => {
    setCouponDetails({ _id: '' });
    setBasePrice(Number(selectedSlots.reduce((sum, slot: any) => sum + Number(slot?.basePrice), 0).toFixed(2)));
    setTotalAmount(Number(selectedSlots.reduce((sum, slot: any) => sum + Number(slot?.price), 0).toFixed(2)));
    setGST(Number(selectedSlots.reduce((sum, slot: any) => sum + Number(slot?.gst), 0).toFixed(2)));
    setFinalAmount(Number(selectedSlots.reduce((sum, slot: any) => sum + Number(slot?.price), 0).toFixed(2)));
    setDiscountedAmount(0);
    reset({
      coupon: '',
      gender: ''
    })
  }

  const bookingAvailable = async (date) => {
    let response;
    if (!loggedUserDetails?.roleId) {
      if (facility == undefined) {
        return
      }
      response = await getNewBookings(loggedInUser, date, facility);
    } else {
      if (loggedUserDetails?.facility_id == undefined) {
        return
      }
      response = await getNewBookings(loggedInUser, date, loggedUserDetails?.facility_id);
    }
    if (response?.result) {
      setSlotAvailable(response?.result);
    } else {
      setSlotAvailable([]);
    }
  };

  const filterStartTime = async (slotData, selectedcourt) => {
    // console.log(slotData, selectedcourt);
    var startSlotsArray: any = [];
    slotData?.map((data: any) => {
      let flag = false;
      let obj;
      data?.slots?.map((court) => {
        if (
          court?.court_id == selectedcourt &&
          court?.active == true &&
          court?.break == false &&
          (
            court?.booked === false ||
            (court?.booked === true && court?.booking_data[0]?.payment_status === 'Confirmed')
          )
        ) {
          flag = true;
          obj = court;
        }
      });
      if (flag) {
        startSlotsArray.push({
          start: data?.display_time,
          end: data?.display_end_time,
          slot: obj,
        });
      }
    });
    setStartSlots(startSlotsArray);

    // console.log("selSlots----------->>>>>>>",startSlotsArray, slot?.startTime , slot?.endTime);
    let selSlots = startSlotsArray?.filter(
      (stslotData: any) =>
        stslotData?.start <= slot?.startTime && stslotData?.end >= slot?.endTime
    );
    // console.log("selSlots----------->>>>>>>",selSlots, slot?.startTime , slot?.endTime);

    let total_amount = 0;
    let sel = selSlots?.map((s: any) => {
      total_amount = total_amount + s?.slot?.price;
      s.slot.startTime = s?.start;
      s.slot.endTime = s?.end;
      return s?.slot;
    });
    // console.log("🚀 ~ file: BookingNewM.tsx:264 ~ sel ~ sel:", sel)
    setSelectedSlots(sel)
  };

  const filterEndTime = async (slotData, startTime, selectedcourt) => {
    var startSlotsArray: any = [];
    slotData?.map((data: any) => {
      let flag = false;
      let obj;
      data?.slots?.map((court) => {
        if (
          court?.court_id == selectedcourt &&
          court?.active == true &&
          court?.break == false &&
          (
            court?.booked === false ||
            (court?.booked === true && court?.booking_data[0]?.payment_status === 'Confirmed')
          )
        ) {
          flag = true;
          obj = court;
        }
      });
      if (flag) {
        startSlotsArray.push({
          start: data?.display_time,
          end: data?.display_end_time,
          slot: obj,
        });
      }
    });

    var endSlots: any = [];

    for (var i = 0; i < startSlotsArray.length; i++) {
      if (startTime < startSlotsArray[i]?.end) {
        if (startSlotsArray[i]?.end == startSlotsArray[i + 1]?.start) {
          endSlots.push({
            start: startSlotsArray[i]?.start,
            end: startSlotsArray[i]?.end,
            slot: startSlotsArray[i]?.slot,
          });
        } else {
          endSlots.push({
            start: startSlotsArray[i]?.start,
            end: startSlotsArray[i]?.end,
            slot: startSlotsArray[i]?.slot,
          });
          break;
        }
      }
    }
    setEndSlots(endSlots);
    // console.log('====================================');
    // console.log('endSlots', endSlots);
    // console.log('====================================');
  };

  useMemo(() => {
    if (slot == null) {
      bookingAvailable(selDate);
    }
  }, [selDate]);

  useMemo(() => {
    if (slot == null) {
      filterStartTime(slotAvailable, selCourt);
    }
  }, [selCourt]);

  useMemo(() => {
    if (slot == null) {
      filterEndTime(slotAvailable, selStartTime, selCourt);
    }
  }, [selStartTime]);

  useMemo(() => {
    let selSlots = startSlots?.filter(
      (slot: any) =>
        selStartTime <= slot?.start && selEndTime >= slot?.end
    );
    let total_amount = 0;
    let sel = selSlots?.map((s: any) => {
      total_amount = total_amount + s?.slot?.price;
      s.slot.startTime = s?.start;
      s.slot.endTime = s?.end;
      return s?.slot;
    });
    setSelectedSlots(sel)
    setFinalAmount(total_amount);
    // console.log("🚀 ~ file: BookingNewM.tsx:386 ~ sel ~ sel:", sel)
  }, [selStartTime, selEndTime])

  const prefill = async () => {
    filterStartTime(data, slot?.court_id);
    filterEndTime(data, slot?.startTime, slot?.court_id);
    reset({
      date: slot?.date,
      start_time: slot?.startTime,
      end_time: slot?.endTime,
      court: slot?.court_id,
      coupon: '',
      gender: '',
      payment_type: '',
    });
    setBasePrice(slot.basePrice);
    setGST(slot.gst);
    setTotalAmount(slot.price);
    setFinalAmount(slot.price);
    setPaymentType('');
  }

  useMemo(() => {
    resetCoupon();
    if (visible && slot != null) {
      prefill();
    }
  }, [visible]);

  const AmountCard = () => {
    return (<>
      <div className="form-container-grid">
        <div className="input-group">
          <label className="form-lable">Base Price</label>
          <label className="form-lable">Discounted Amount</label>
        </div>
        <div className="input-group ">
          <label className=" amntcard-flex-end">{basePrice}</label>
          <label className=" amntcard-flex-end">{discountedAmount}</label>
        </div>
      </div>
      <hr></hr>
      <div className="form-container-grid">
        <div className="input-group">
          <label className="form-lable">SubTotal</label>
          <label className="form-lable">GST Price</label>
        </div>
        <div className="input-group ">
          <label className=" amntcard-flex-end">{totalAmount}</label>
          <label className=" amntcard-flex-end">{gst}</label>
        </div>
      </div>
      <hr></hr>
      <div className="form-container-grid">
        <div className="input-group">
          <label className="form-lable">Final Amount</label>
        </div>
        <div className="input-group ">
          <label className=" amntcard-flex-end">{finalAmount}</label>
        </div>
      </div>
    </>)
  }

  return (
    <div>
      <Modal
        visible={visible}
        title={customTitle}
        width={"40%"}
        footer={null}
        className="custom-ant-modal lable-content-width"
        onCancel={onCancel}
      >
        <div className="form-container">
          <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
            <div className=" border-bottom-light">
              <div className="input-group">
                <label htmlFor="firstName" className="form-lable">
                  Slot Date<span style={{ color: "red" }}>*</span>
                </label>
                <div className="form-group">
                  <input
                    //  max={today}
                    type="date"
                    id="age_group"
                    placeholder="date of birth"
                    {...register("date", {
                      required: {
                        value: true,
                        message: "Slot Date is required",
                      },
                    })}
                  />
                </div>
                {errors?.date && (
                  <span className="error-message">{errors.date.message}</span>
                )}
              </div>
              <div className="input-group">
                <label htmlFor="court" className="form-lable">
                  Court<span style={{ color: "red" }}>*</span>
                </label>
                <div className="form-group">
                  {/* <Controller
                    name="court_id"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Court name is required",
                      },
                    }}
                    render={({ field: { onChange, value }, field }) => (
                      <Select
                        // closeMenuOnSelect={false}
                        className="controller-select"
                        components={animatedComponents}
                        // defaultValue={[colourOptions[4], colourOptions[5]]}
                        // isMulti
                        options={courts}
                        {...field}
                      />
                    )}
                  /> */}
                  <select
                    id="court"
                    className="form-field"
                    {...register("court", {
                      required: {
                        value: true,
                        message: "Court is required",
                      },
                    })}
                  >
                    <option value="">Select Court</option>
                    {courts?.map((court: any) => (
                      <option value={court.value}>{court.label}</option>
                    ))}
                  </select>
                </div>

                {errors?.court && (
                  <span className="error-message">{errors.court.message}</span>
                )}
              </div>
              <div className="form-container-grid">
                <div className="input-group">
                  <label htmlFor="start_time" className="form-lable">
                    Start time {slot?.startTime}<span className="required-star">*</span>
                  </label>
                  <div className="form-group">
                    <select
                      id="start_time"
                      className="form-field"
                      {...register("start_time", {
                        required: {
                          value: true,
                          message: "Start Time is required",
                        },
                      })}
                    >
                      <option value="">Select Start Time</option>
                      {startSlots?.map((data: any) => (
                        <option value={data.start}>{data.start}</option>
                      ))}
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
                          message: "End Time is required",
                        },
                      })}
                    >
                      <option value="">Select End Time</option>
                      {endSlots?.map((data: any) => (
                        <option value={data.end}>{data.end}</option>
                      ))}
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
                <label htmlFor="firstname">
                  Player Name<span style={{ color: "red" }}>*</span>
                </label>
                <div className="form-group">
                  <input
                    type="text"
                    id="firstname"
                    placeholder="Player Name"
                    {...register("name", {
                      required: {
                        value: true,
                        message: "Player Name is required",
                      },
                      pattern: {
                        value:
                          /^[^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*$/,
                        message:
                          "Please enter a valid first name with at least three alphabet characters",
                      },
                    })}
                  />
                </div>
                {errors?.name && (
                  <span className="error-message">{errors.name.message}</span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="phone">
                  Phone No.<span style={{ color: "red" }}>*</span>
                </label>
                <div className="form-group">
                  <input
                    type="number"
                    id="phone"
                    placeholder="Phone No."
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
                <label htmlFor="event" className="form-lable">
                  Payment Type<span style={{ color: "red" }}>*</span>
                </label>
                <div className="form-group">
                  <select
                    id="location"
                    className="form-field"
                    {...register("payment_type", {
                      required: {
                        value: true,
                        message: "Payment Type is required",
                      },
                    })}
                    onChange={handlePaymentTypeChange}
                  >
                    <option value="">Select Payment Type</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="free">Complementary</option>
                    <option value="plink">via Payment Link</option>
                    <option value="Block">block by club for an event</option>
                  </select>
                </div>
                {errors?.payment_type && (
                  <span className="error-message">
                    {errors.payment_type.message}
                  </span>
                )}
              </div>
              {PaymentType != 'free' ?
                <>
                  <div className="form-container-grid-3">

                    <div className="input-group col-span-2">
                      <label htmlFor="phone">
                        Coupon
                      </label>
                      <div className="form-group">
                        <input
                          type="text"
                          id="phone"
                          placeholder="Coupon Name"
                          {...register("coupon")}
                          value={couponData.toUpperCase()}
                        />
                        {discountedAmount > 0 && <span style={{ fontSize: "12px", color: "green" }}>Applied</span>}
                      </div>
                    </div>
                    {/* {couponData && couponData != "" && */}
                    <>
                      {/* <div className="input-group">

                        <label htmlFor="gender" className="form-lable">Gender</label>
                        <div className="form-group">
                          <select
                            id="skill"
                            {...register("gender")}
                          >
                            <option value="" >Select Gender</option>
                            <option value="Male" >Male</option>
                            <option value="Female" >Female</option>
                          </select>

                        </div>
                        {errors?.gender && (
                          <span className="error-message">
                            {errors.gender.message}
                          </span>
                        )}
                      </div> */}
                      <div className="input-group">
                        <div
                          style={{ display: 'flex', justifyContent: 'end', flexDirection: 'column', height: "100%" }}
                        >
                          {discountedAmount > 0 ? <button
                            type="button"
                            className="pi-btn-delete"
                            onClick={() => { removeCoupon() }}
                          >
                            Remove
                          </button> :
                            <button
                              type="button"
                              className="pi-btn-secondary"
                              onClick={() => { applyCoupon() }}
                            >
                              Apply
                            </button>}
                        </div>
                      </div>

                    </>
                    {/* } */}
                  </div>
                  <div className="input-group">
                    <label htmlFor="transaction_id">Transaction ID</label>
                    <div className="form-group">
                      <input
                        type="text"
                        id="transaction_id"
                        placeholder="Enter Tansaction ID"
                        {...register("razor_id")}
                      />
                    </div>
                  </div>
                  {
                    paymentType != 'plink' &&
                    <div className="input-group">
                      <label htmlFor="event" className="form-lable">
                        Payment Status<span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="form-group">
                        <select
                          id="location"
                          className="form-field"
                          {...register("payment_status", {
                            required: {
                              value: paymentType != 'plink' ? true : false,
                              message: "Payment Status is required",
                            },
                          })}
                        >
                          <option value="">Select Payment Status</option>
                          <option value="Paid">Paid</option>
                          <option value="Confirmed">Not Paid Yet</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Confirmed">Blocked By Admin</option>
                        </select>
                      </div>
                      {errors?.payment_status && (
                        <span className="error-message">
                          {errors.payment_status.message}
                        </span>
                      )}
                    </div>
                  }
                </> :
                <>
                  <div className="input-group">
                    <label htmlFor="booking_reason">
                      Booking Reason
                    </label>
                    <div className="form-group">
                      <input
                        type="textarea"
                        id="booking_reason"
                        placeholder="Reason For complementry Booking"
                        {...register("booking_reason")}
                      />
                    </div>
                  </div>

                </>
              }
              {
                discountedAmount > 0 ?
                  <><AmountCard /></>
                  :
                  <>
                    {/* {selectedSlots.length > 0 && */}
                    <>
                      <div className="form-container-grid">
                        <div className="input-group">
                          <label className="form-lable">Base Price</label>
                          <label className="form-lable">GST Price</label>
                        </div>
                        <div className="input-group ">
                          <label className=" amntcard-flex-end">{(selectedSlots.length > 0 && PaymentType != 'free') ? selectedSlots.reduce((sum, slot: any) => sum + Number(slot?.basePrice), 0).toFixed(2) : basePrice}</label>
                          <label className=" amntcard-flex-end">{(selectedSlots.length > 0 && PaymentType != 'free') ? selectedSlots.reduce((sum, slot: any) => sum + Number(slot?.gst), 0).toFixed(2) : gst}</label>
                        </div>
                      </div>
                      <hr></hr>
                      <div className="form-container-grid">
                        <div className="input-group">
                          <label className="form-lable">Total</label>
                        </div>
                        <div className="input-group ">
                          <label className=" amntcard-flex-end">{(selectedSlots.length > 0 && PaymentType != 'free') ? selectedSlots.reduce((sum, slot: any) => sum + Number(slot?.price), 0).toFixed(2) : totalAmount}</label>
                        </div>
                      </div>
                    </>
                    {/* } */}
                  </>
              }
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
                Submit
              </button>
              <Button
                type="primary"
                className="pi-btn-primary"
                onClick={handleEditPlayers}
              >
                Add Player
              </Button>
            </Footer>
          </form>
        </div>
      </Modal >
      <AddPlayerModal
        modaldata={modaldata}
        visible={editPlayersModalVisible}
        row
        onCancel={() => {
          setEditPlayersModalVisible(false);
          setPlayers({ booking_id: "", players: [] });
        }}
        closeModal={() => { setEditPlayersModalVisible(false); }}
        setPlayers={setPlayers}
        players={players}
      />
    </div >
  );
};

export default NAddBookingModal;
