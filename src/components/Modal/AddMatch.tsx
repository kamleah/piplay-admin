import React, { useEffect, useMemo, useState } from 'react';
import { ConfigProvider, Modal, Popover, Radio, RadioChangeEvent } from 'antd';
import { Footer } from "antd/es/layout/layout";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { Icon } from "@iconify-icon/react";
import { Button, Slider, Avatar, Row, Col, Typography, Card, Rate } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { addMatchPlayer, createMatch, editBookingdetail, filterCourt, CheckBookingCouponAPI, getAllUsers, getFacilityApi, getFacilityByIdApi, getNewBookings, removeMatchPlayer } from '../apiFile/Service';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import moment from 'moment';
import padelIcon from "../../assets/icon/Padel.png";
import pickleballIcon from "../../assets/icon/Pickleball.png";
interface formModal {
    court_id: any,
    facility_id: any,
    slot_ids: any,
    user_id: any,
    booking_date: any,
    start_time: any,
    end_time: any,
    status: any,
    payment_status: any,
    pay_at_facility: any,
    startTimestamp: any,
    endTimestamp: any,
    coupon: any,
    coupon_name: any,
    percentage: any,
    coupon_id: any,
    total_amount: any,
    manual: any,
    payment_type: any,
    minutesDifference: any,
    userMembershipsId: any,
    package_id: any,
    match_mode: any,
    show_home: any,
    match_type: any,
    match_type2: any,
    match_type3: any,
    min_rating: any,
    max_rating: any,
    split_amount: any,
    split: any,
    allow_outsiders: any,
    bookedPlayers: any,
    razor_id: any,
    razorpay_order_id: any,
    razorpay_signature: any,
    facility_pay_percentage: any,
    final_amount: any,
    splited_amount: any,
    bookedby: any,
    source: any,
    event_id: any,
    category_id: any,
    selected_event_id: any,
    selected_category_id: any,
}


function AddMatch({ open, toggle, rowData, edit, setEdit, facilityList, userList, getData, tournaments }) {
    const form = useForm({
        defaultValues: {
            court_id: {},
            facility_id: {},
            slot_ids: '',
            user_id: '',
            booking_date: '',
            start_time: {},
            end_time: {},
            status: 'Paid',
            payment_status: 'Paid',
            pay_at_facility: false,
            startTimestamp: '',
            endTimestamp: '',
            coupon: false,
            coupon_name: '',
            percentage: 0,
            coupon_id: null,
            total_amount: '',
            manual: true,
            payment_type: '',
            minutesDifference: 0,
            userMembershipsId: null,
            package_id: null,
            match_mode: '',
            show_home: '',
            match_type: '',
            match_type2: '',
            match_type3: '',
            min_rating: '',
            max_rating: '',
            split_amount: 0,
            split: true,
            allow_outsiders: false,
            bookedPlayers: '',
            razor_id: {},
            razorpay_order_id: 'NA',
            razorpay_signature: 'NA',
            facility_pay_percentage: null,
            final_amount: '',
            splited_amount: 0,
            bookedby: '',
            source: 'admin',
            event_id: '',
            category_id: '',
            selected_event_id: '',
            selected_category_id: '',
        }
    });
    const { register, handleSubmit, reset, setValue, control, watch } = form;
    const { errors } = form.formState;
    const loggedInUser = localStorage.getItem("auth");
    const [courtList, setCourtList] = useState<any[]>([]);
    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
    const [finalAmount, setFinalAmount] = useState(0);
    const [totalSlotPrice, setTotalSlotPrice] = useState(0);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [basePrice, setBasePrice] = useState(0);
    const [couponDetails, setCouponDetails] = useState({ _id: null });
    const [discountCoupon, setDiscountCoupon] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [gst, setGST] = useState(0);
    const [discountedAmount, setDiscountedAmount] = useState(0);
    const [slotAvailable, setSlotAvailable] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState('');
    const selDate = watch("booking_date");
    const selCourt = watch("court_id");
    const facilityId = watch("facility_id");
    const selStartTime: any = watch("start_time");
    const selEndTime: any = watch("end_time");
    const selectedEvent: any = watch("event_id");
    const selectedCategory: any = watch("category_id");

    const [disabled, setDisabled] = useState(false)
    const [splitAmount, setSplitAmount] = useState(0);


    const { Text } = Typography;

    const animatedComponents = makeAnimated();

    const closingFunctions = () => {
        toggle();
        reset();
        setEdit(false);

    };

    const customTitle = (
        <div className="custom-ant-modal-header">
            {edit ? "Edit Match" : "Create Match"}
        </div>
    );

    const [sportType, setSportType] = useState("padel");
    const [matchMode, setMatchMode] = useState("public");
    const [showHome, setShowHome] = useState("yes");
    const [matchType, setMatchType] = useState("doubles");
    const [matchType2, setMatchType2] = useState("open");
    const [matchType3, setMatchType3] = useState("social");
    const [minMaxRating, setMinMaxRating] = useState([1.0, 7.0]);

    const matchMakingType = [
        { label: 'Admin Match', value: 'Admin Match' },
        { label: 'Open Play Match', value: 'Open Play Match', },
    ];
    const sportTypeOptions = [
        { label: 'Padel', value: 'padel', img: padelIcon },
        { label: 'Pickleball', value: 'pickleball', img: pickleballIcon },
    ];
    const matchModeOptions = [
        { label: 'Public', value: 'public', icon:'mdi:account-lock-open' },
        { label: 'Private', value: 'private', icon:'mdi:account-lock' },
    ];
    const matchTypeOptions = [
        { label: 'Doubles', value: 'doubles', disabled: edit },
        { label: 'Singles', value: 'singles', disabled: edit },
    ];
    const matchType2Options = [
        { label: 'Open', value: 'open' },
        { label: "Men's", value: 'mens', },
        { label: "Women's", value: 'Womens', },
        { label: "Mixed", value: 'mixed', },
    ];
    const matchType3Options = [
        { label: 'Social', value: 'social' },
        { label: 'Competitive', value: 'competitive', },
    ];
    const ShowHomeOptions = [
        { label: 'Yes', value: 'yes',icon:'mdi:eye' },
        { label: 'No', value: 'no',icon:'mdi:eye-off' },
    ];

    const onChangeSportType = (e) => {
        let value = e.target.value
        setSportType(value);
    };
    const onChangeMatchMode = (e) => {
        let value = e.target.value
        setMatchMode(value);
        setValue('match_mode', value?.value);
    };
    const onChangeShowHome = (e) => {
        let value = e.target.value;
        setShowHome(value);
        setValue('show_home', value?.value);
    };
    const onChangeMatchType = (e) => {
        let value = e.target.value
        setMatchType(value);
        setValue('match_type', value?.value);
        // setOpenUserList((prev) => ({ ...prev, [value?.value]: true }));
        setSelectedUsers({
            1: null,
            2: null,
            3: null,
            4: null,
            5: null,
            6: null,
            7: null,
            8: null,
        });
    };
    const onChangeMatchType2 = (e) => {
        let value = e.target.value
        setMatchType2(value);
        setValue('match_type2', value?.value);
    };
    const onChangeMatchType3 = (e) => {
        let value = e.target.value
        setMatchType3(value);
        setValue('match_type3', value?.value);
    };

    const getAllCourtsbyFacility = async (facility_id, sportType) => {
        console.log("🚀 ~ file: AddMatch.tsx:193 ~ getAllCourtsbyFacility ~ facility_id, sportType:", facility_id, sportType)
        if (!edit) {
            setValue("court_id", '');
        }
        setSelectedFacility(facility_id?.value);
        let response = await filterCourt(loggedInUser, '', facility_id == undefined ? '' : facility_id?.value, sportType == undefined ? '' : sportType);
        let courts = response?.result?.map(data => {
            return { "label": data?.name, "value": data?._id }
        });
        setCourtList(courts);
    };

    useMemo(() => {
        if (facilityId && sportType) {
            getAllCourtsbyFacility(facilityId, sportType);
        }
    }, [facilityId, sportType])

    useEffect(() => {
        console.log(finalAmount);

        setSplitAmount(Number(finalAmount) / (matchType == 'singles' ? 2 : 4))
    }, [finalAmount, matchType])

    const [startSlots, setStartSlots] = useState<any>([]);
    const [endSlots, setEndSlots] = useState([]);

    const filterStartTime = async (slotData, selectedcourt) => {
        if (!edit) {
            setValue("start_time", '');
        }
        // console.log("🚀 ~ file: AddMatch.tsx:216 ~ filterStartTime ~ slotData, selectedcourt:", slotData, selectedcourt.value)
        var startSlotsArray: any = [];
        slotData?.map((data: any) => {
            let flag = false;
            let obj;
            data?.slots?.map((court) => {
                if (
                    court?.court_id == selectedcourt?.value &&
                    court?.active == true &&
                    court?.break == false &&
                    (
                        court?.booked === false ||
                        (court?.booked === true && court?.booking_data[0]?.payment_status === 'Confirmed')
                    )) {
                    flag = true;
                    obj = court;
                }
            });
            if (flag) {
                startSlotsArray.push({
                    start: data?.display_time,
                    end: data?.display_end_time,
                    slot: obj,
                    label: data?.display_time,
                    value: data?.display_time,
                });
            }
        });
        setStartSlots(startSlotsArray);
        console.log('start slots', startSlotsArray);
    };

    const filterEndTime = async (slotData, startTime, selectedcourt) => {
        if (!edit) {
            setValue("end_time", '');
        }
        console.log("🚀 ~ file: AddMatch.tsx:216 ~ filterStartTime ~ slotData, selectedcourt:", slotData, startTime, selectedcourt)
        var startSlotsArray: any = [];
        slotData?.map((data: any) => {
            let flag = false;
            let obj;
            data?.slots?.map((court) => {
                if (
                    court?.court_id == selectedcourt?.value &&
                    court?.active == true &&
                    court?.break == false &&
                    (
                        court?.booked === false ||
                        (court?.booked === true && court?.booking_data[0]?.payment_status === 'Confirmed')
                    )) {
                    flag = true;
                    obj = court;
                }
            });
            if (flag) {
                startSlotsArray.push({
                    start: data?.display_time,
                    end: data?.display_end_time,
                    slot: obj,
                    label: data?.display_end_time,
                    value: data?.display_end_time,
                });
            }
        });

        var endSlots: any = [];

        for (var i = 0; i < startSlotsArray.length; i++) {
            if (startTime.value < startSlotsArray[i]?.end) {
                if (startSlotsArray[i]?.end == startSlotsArray[i + 1]?.start) {
                    endSlots.push({
                        start: startSlotsArray[i]?.start,
                        end: startSlotsArray[i]?.end,
                        slot: startSlotsArray[i]?.slot,
                        label: startSlotsArray[i]?.end,
                        value: startSlotsArray[i]?.end,
                    });
                } else {
                    endSlots.push({
                        start: startSlotsArray[i]?.start,
                        end: startSlotsArray[i]?.end,
                        slot: startSlotsArray[i]?.slot,
                        label: startSlotsArray[i]?.end,
                        value: startSlotsArray[i]?.end,
                    });
                    break;
                }
            }
        }
        setEndSlots(endSlots);
        console.log('====================================');
        console.log('endSlots', endSlots);
        console.log('====================================');
    };

    const bookingAvailable = async (date) => {
        if (!edit) {
            setValue("start_time", '');
        }
        let response;
        if (!loggedUserDetails?.roleId) {
            //   if (facility == undefined) {
            //     return
            //   }
            response = await getNewBookings(loggedInUser, date, selectedFacility);
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

        console.log('setSlotAvailable', response?.result);

    };


    useMemo(() => {
        if (selDate || selCourt) {
            bookingAvailable(selDate);
        }
    }, [selDate, selCourt]);

    useMemo(() => {
        filterStartTime(slotAvailable, selCourt);
    }, [selCourt]);

    useMemo(() => {
        filterEndTime(slotAvailable, selStartTime, selCourt);
    }, [selStartTime]);

    const onChangeComplete = (value: number[]) => {
        console.log('onChangeComplete: ', value);
        setMinMaxRating(value)
    };

    const [openUserList, setOpenUserList] = useState({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
    });

    const [selectedUsers, setSelectedUsers] = useState({
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
        8: null,
    });

    const handleOpenChange = (newOpen, position) => {
        setOpenUserList((prev) => ({ ...prev, [position]: newOpen }));

    };


    const removeMatchPlayers = async (user_id, setUser) => {
        const payload = {
            "userId": user_id,
            "bookingId": rowData?._id
        }
        const response = await removeMatchPlayer(loggedInUser, payload);
        console.log("response", response);
        if (response?.data?.err_code) {
            toast(<ToastMessage body={response?.data?.message} type="success" />, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            getData();
        } else if (response?.code == "SUCCESS") {
            toast(<ToastMessage body={"Player Removed Successfully"} type="success" />, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            getData();
            setUser(null);
        } else {
            toast(<ToastMessage body={"Something Went wrong"} type="warning" />, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    const addMatchPlayers = async (user_id, position) => {
        console.log("🚀 ~ file: AddMatch.tsx:415 ~ addMatchPlayers ~ user_id, position:", user_id, position)
        // return;        
        const payload = {
            index: position - 1,
            user_id: user_id?.value,
        }
        const response = await addMatchPlayer(loggedInUser, payload, rowData?._id);
        console.log("response", response);
        if (response.code == "PLAYER_ADDED_SUCCESSFULLY") {
            toast(<ToastMessage body={'Player Added Successfully'} type="success" />, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            getData();
        }
    }


    const CustomUserSelection = ({ position, user, setUser, showsplitAmount }) => {
        const handleRemoveUser = (userId) => {
            if (edit) {
                removeMatchPlayers(userId, setUser);
            } else {
                setUser(null);
            }
        };

        return (
            <Popover
                content={Userlist({ position, setUser })}
                title={`Player ${position}`}
                trigger="click"
                open={openUserList[position]}
                onOpenChange={(newOpen) => handleOpenChange(newOpen, position)}
            >
                <Col>
                    {user ? (
                        <div className='selected-player-container'>
                            <div className='selected-player-profile'>
                                {user?.userData?.profile_url ?
                                    <img src={user.userData.profile_url} alt="player" className="player-image" />
                                    :
                                    <div className="player-name">
                                        {user.label[0]}
                                    </div>
                                }
                            </div>
                            <Text style={{ fontSize: "10px", textAlign: 'center' }}>{user.label}</Text>
                            <div className='rating-container'>
                                {user?.userData?.skill_level_new
                                    ?.filter((data) => data?.sport_type === sportType) // Filter to include only matching sport types
                                    .map((filteredData) => (
                                        <span key={filteredData?.sport_type}>
                                            {filteredData?.rating.toFixed(1)} <Icon icon="mdi:star" className='star-icon-match' />
                                        </span>
                                    ))}
                            </div>
                            <Icon icon="mdi:close" className='close-icon-match' onClick={() => { handleRemoveUser(user?.userData?._id) }} />
                        </div>
                    ) : (
                        <div className='empty-player-container'>
                            <PlusOutlined style={{ color: "#64748B" }} size={10} />
                        </div>
                    )}
                    <div style={{ fontSize: "10px", textAlign: 'center' }}>
                        {showsplitAmount ? '₹ ' + splitAmount : " "}
                    </div>
                </Col>
            </Popover>
        );
    };


    const [userType, setUsertype] = useState('select');


    const userTypeOptions = [
        { label: 'Select Player', value: 'select' },
        { label: 'Reserve Place', value: 'reserve' },
    ];

    const onUserTypeChange = ({ target: { value } }: RadioChangeEvent) => {
        setUsertype(value);
    };

    const Userlist = ({ position, setUser }) => {
        return (<>
            <div className="input-group col-span-2">
                <div className="form-radio-group" style={{ marginBottom: "10px" }}>
                    <Radio.Group
                        options={userTypeOptions}
                        onChange={onUserTypeChange}
                        value={userType || 'select'}
                    />
                </div>
            </div>
            {userType === 'select' ?
                <div className="form-group" style={{ width: "350px", marginBottom: "10px" }}>
                    <Select
                        className="controller-select"
                        components={animatedComponents}
                        options={userList}
                        formatOptionLabel={(user: any) => (
                            <div className="select-option-container">
                                {user?.userData?.profile_url ?
                                    <img src={user.userData.profile_url} className="option-image" /> :
                                    <div className="option-image-placeholder">
                                        {user.label[0]}
                                    </div>}
                                <span>{user.label}</span>
                            </div>
                        )}
                        placeholder="Select a player"
                        onChange={(value) => {
                            console.log(value);

                            if (edit) {
                                addMatchPlayers(value, position);
                                setUser(value)
                                handleOpenChange(false, position)
                            }
                            setUser(value)
                            handleOpenChange(false, position)
                        }
                        }
                    />
                </div>
                : <>
                    <div className="form-group" style={{ width: "350px", marginBottom: "10px" }}>
                        <Icon icon="mdi:user" style={{ color: "#F17121", fontSize: "20px", padding: "0 8px" }} /> Reserve Place
                    </div>
                    <button type="submit" className="pi-btn-primary" style={{ width: "100%" }}
                        onClick={() => {
                            setUser(userList.find((user) => user?.mobileno === 1))
                            handleOpenChange(false, position)
                        }}

                    >Confirm Reserve</button>

                    <div className="add-ons-container">
                        <div className="add-button">
                            <span style={{ paddingLeft: '5px', fontSize: '14px' }}><span style={{ fontSize: '14px', fontWeight: 'bold' }}>Note:</span> You can later edit this to add the real players</span>
                        </div>
                    </div>
                </>
            }

        </>
        );
    };

    const [isChecked, setIsChecked] = useState(true);
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    const resetCoupon = () => {
        setCouponDetails({ _id: null });
        setBasePrice(0);
        setTotalAmount(0);
        setGST(0);
        setDiscountedAmount(0);

    }


    const applyCoupon = async (selectedslots = []) => {
        try {
            const payload = {
                "coupon_name": discountCoupon.toUpperCase(),
                "coupon_type": "Match",
                "facility_id": loggedUserDetails?._id,
                "gender": '',
                "split_amount": 0,
                "today": moment().format("YYYY-MM-DD"),
                "total_amount": selectedslots.length > 0
                    ? selectedslots.reduce((sum, slot: any) => sum + Number(slot?.price), 0)
                    : selectedSlots.reduce((sum, slot: any) => sum + Number(slot?.price), 0),
            };
            console.log("==============", payload)
            let resp = await CheckBookingCouponAPI(loggedInUser, payload)
            console.log(resp)
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
                setValue('percentage', resp.result.percentage)
                setValue('coupon_name', resp.result.coupon_name)
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

    const applyCouponOnEdit = async (selectedslots = []) => {
        try {
            const payload = {
                "coupon_name": rowData?.coupon_name,
                "coupon_type": "Match",
                "facility_id": loggedUserDetails?._id,
                "gender": '',
                "split_amount": 0,
                "today": moment(rowData?.booking_date).format("YYYY-MM-DD"),
                "total_amount": rowData.final_amount / 100,
            };
            console.log("==============", payload)
            let resp = await CheckBookingCouponAPI(loggedInUser, payload)
            console.log(resp)
            if (!resp.error) {
                // toast(<ToastMessage body={"Coupon Applied Successfully"} type="success" />, {
                //     position: "top-right",
                //     autoClose: 5000,
                //     hideProgressBar: true,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                // });
                setCouponDetails(resp.result)
                setValue('percentage', resp.result.percentage)
                setValue('coupon_name', resp.result.coupon_name)
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
        setTotalSlotPrice(Number(selectedSlots.reduce((sum, slot: any) => sum + Number(slot?.price), 0).toFixed(2)));
        setCouponDetails({ _id: null });
        setBasePrice(Number(selectedSlots.reduce((sum, slot: any) => sum + Number(slot?.basePrice), 0).toFixed(2)));
        setTotalAmount(Number(selectedSlots.reduce((sum, slot: any) => sum + Number(slot?.price), 0).toFixed(2)));
        setGST(Number(selectedSlots.reduce((sum, slot: any) => sum + Number(slot?.gst), 0).toFixed(2)));
        setFinalAmount(Number(selectedSlots.reduce((sum, slot: any) => sum + Number(slot?.price), 0).toFixed(2)));
        setDiscountedAmount(0);
        setDiscountCoupon('');
    }


    const onSubmit = async (data: formModal) => {

        // let selSlots = startSlots?.filter(
        //     (slot: any) =>
        //         data?.start_time.value <= slot?.start && data?.end_time.value >= slot?.end
        // );
        // let total_amount = 0;
        // let sel = selSlots?.map((s: any) => {
        //     total_amount = total_amount + s?.slot?.price;
        //     s.slot.startTime = s?.start;
        //     s.slot.endTime = s?.end;

        //     return s?.slot;
        // });

        data.facility_id = data.facility_id.value
        data.court_id = data.court_id.value
        data.end_time = data.end_time.value
        data.start_time = data.start_time.value
        data.match_mode = matchMode
        data.show_home = showHome == 'yes' ? true : false
        data.match_type = matchType
        data.match_type2 = matchType2
        data.match_type3 = matchType3
        data.min_rating = minMaxRating[0]
        data.coupon_id = couponDetails._id
        data.coupon = couponDetails._id ? true : false
        data.max_rating = minMaxRating[1]
        data.slot_ids = edit ? rowData?.slot_ids : selectedSlots
        data.total_amount = Number(finalAmount) * 100
        data.startTimestamp = moment(`${data?.booking_date} ${data?.start_time}`).valueOf()
        data.endTimestamp = moment(`${data?.booking_date} ${data?.end_time}`).valueOf()
        data.final_amount = Number(totalSlotPrice) * 100
        data.split_amount = splitAmount * 100
        data.user_id = loggedUserDetails._id
        data.razor_id = data.razor_id.value
        data.allow_outsiders = isChecked;
        data.selected_event_id = data?.event_id?.value ? data.event_id.value : null;
        data.selected_category_id = data?.category_id?.value ?  data.category_id.value : null;
        const bookedPlayers = Object.keys(selectedUsers).map((key, index) => {
            console.log('key', selectedUsers[key])
            if (selectedUsers[key]) {
                return {
                    index: index,
                    userId: selectedUsers[key].value
                }
            }
            return null;
        }).filter(Boolean);

        data.bookedPlayers = bookedPlayers
        data.bookedby = loggedUserDetails._id

        console.log('data-------------', data.booking_date, data.start_time, data.end_time)

        let response
        if (edit == true) {
            response = await editBookingdetail(loggedInUser, rowData._id, data);
        } else {
            response = await createMatch(loggedInUser, data);
        }
        if (response.code == 'BOOKING_SUCCESS' || response.code == 'SUCCESS') {
            toast(<ToastMessage body={edit == true ? "Match Edited Successfully" : "Match Created Successfully"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            reset();
            toggle()
            getData();
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

    useMemo(() => {
        let selSlots = startSlots?.filter(
            (slot: any) =>
                selStartTime?.value <= slot?.start && selEndTime?.value >= slot?.end
        );
        let total_amount = 0;
        let total_gst = 0
        let sel = selSlots?.map((s: any) => {
            total_amount = total_amount + s?.slot?.price;
            total_gst = total_gst + Number(s?.slot?.gst)
            s.slot.startTime = s?.start;
            s.slot.endTime = s?.end;
            return s?.slot;
        });
        setSelectedSlots(sel)
        setBasePrice(total_amount)
        if (!edit) {
            setTotalSlotPrice(total_amount);
            setTotalAmount(total_amount);
            setFinalAmount(total_amount);
            setSplitAmount(total_amount / (matchType == 'singles' ? 2 : 4));
            setGST(total_gst);
            console.log("total amount:", total_amount);
        }
        console.log("🚀 ~ file: AddMatch.tsx:623 ~ sel ~ sel:", total_amount, selStartTime?.value, selEndTime?.value, selSlots, sel)
    }, [selStartTime, selEndTime])

    const AmountCard = () => {
        return (<>
            <div className="form-container-grid">
                <div className="input-group">
                    <label htmlFor="start_time" className="form-lable">Base Price</label>
                    <label htmlFor="start_time" className="form-lable">Discounted Amount</label>
                </div>
                <div className="input-group ">
                    <label htmlFor="start_time" className=" amntcard-flex-end">{basePrice}</label>
                    <label htmlFor="start_time" className=" amntcard-flex-end">{discountedAmount}</label>
                </div>
            </div>
            <hr></hr>
            <div className="form-container-grid">
                <div className="input-group">
                    <label htmlFor="start_time" className="form-lable">SubTotal</label>
                    <label htmlFor="start_time" className="form-lable">GST Price</label>
                </div>
                <div className="input-group ">
                    <label htmlFor="start_time" className=" amntcard-flex-end">{totalAmount}</label>
                    <label htmlFor="start_time" className=" amntcard-flex-end">{gst}</label>
                </div>
            </div>
            <hr></hr>
            <div className="form-container-grid">
                <div className="input-group">
                    <label htmlFor="start_time" className="form-lable">Final Amount</label>
                </div>
                <div className="input-group ">
                    <label htmlFor="start_time" className=" amntcard-flex-end">{finalAmount}</label>
                </div>
            </div>
            <hr></hr>
            <div className="form-container-grid">
                <div className="input-group">
                    <label htmlFor="start_time" className="form-lable">Amount for 1 player</label>
                </div>
                <div className="input-group ">
                    <label htmlFor="start_time" className=" amntcard-flex-end">{splitAmount}</label>
                </div>
            </div>
        </>)
    }


    useEffect(() => {
        console.log(edit, "=======", rowData);

        if (edit == true) {
            reset({
                facility_id: { value: rowData?.facility?._id, label: rowData?.facility?.name },
                court_id: { value: rowData?.court?._id, label: rowData?.court?.name },
                slot_ids: rowData?.slot_ids,
                user_id: loggedUserDetails?._id,
                booking_date: rowData?.booking_date,
                start_time: { value: rowData?.start_time, label: rowData?.start_time },
                end_time: { value: rowData?.end_time, label: rowData?.end_time },
                status: rowData?.status,
                payment_status: rowData?.payment_status,
                pay_at_facility: rowData?.pay_at_facility,
                startTimestamp: rowData?.startTimestamp,
                endTimestamp: rowData?.endTimestamp,
                coupon: rowData?.coupon,
                percentage: rowData?.percentage,
                coupon_id: rowData?.coupon_id,
                total_amount: rowData?.total_amount,
                manual: rowData?.manual,
                payment_type: rowData?.payment_type,
                minutesDifference: rowData?.minutesDifference,
                userMembershipsId: rowData?.userMembershipsId,
                package_id: rowData?.package_id,
                split_amount: rowData?.split_amount,
                split: rowData?.split,
                allow_outsiders: rowData?.allow_outsiders,
                // bookedPlayers: rowData?.bookedPlayers,
                razor_id: { value: rowData?.razor_id, label: rowData?.razor_id },
                razorpay_order_id: rowData?.razorpay_order_id,
                razorpay_signature: rowData?.razorpay_signature,
                facility_pay_percentage: rowData?.facility_pay_percentage,
                final_amount: rowData?.final_amount,
                splited_amount: rowData?.splited_amount,
                bookedby: rowData?.package_id,
                source: 'admin'
            });
            setSportType(rowData?.court?.game);
            setDiscountCoupon(rowData?.coupon_name)
            setFinalAmount(rowData?.total_amount / 100)
            setTotalSlotPrice(rowData && rowData?.final_amount / 100)
            // setDiscountedAmount(rowData?.final_amount / 100 - rowData?.total_amount / 100);
            setMatchMode(rowData.match_mode);
            setMatchType(rowData.match_type);
            setMatchType2(rowData.match_type2);
            setMatchType3(rowData.match_type3);
            setMinMaxRating([rowData.min_rating, rowData.max_rating]);
            setIsChecked(rowData?.allow_outsiders)
            setDisabled(true)
            console.log("-------------", rowData?.slot_ids);
            setSplitAmount(rowData?.split_amount / 100)
            let total_amount = 0;
            let total_gst = 0
            let base_price = 0
            let sel = rowData?.slot_ids?.map((s: any) => {
                base_price = base_price + Number(s?.basePrice);
                total_amount = total_amount + Number(s?.price);
                total_gst = total_gst + Number(s?.gst)
                return s?.slot;
            });
            // setSelectedSlots(sel)
            console.log("-------------", base_price);
            setTotalAmount(total_amount)
            setBasePrice(base_price)
            setGST(total_gst)
            
            if (rowData?.coupon) {
                applyCouponOnEdit()
            }

            rowData?.booking_players?.length > 0 && rowData?.booking_players?.map((item) => {
                console.log("-------------", item);
                setSelectedUsers((prev) => ({ ...prev, [item.index + 1]: { value: item.user_id._id, label: item.user_id.firstname + " " + item.user_id.lastname, mobileno: item.user_id.mobileno, userData: item.user_id } }));
            })

        } else {
            reset({
                court_id: '',
                facility_id: '',
                slot_ids: '',
                user_id: '',
                booking_date: '',
                start_time: '',
                end_time: '',
                status: 'Paid',
                payment_status: 'Paid',
                pay_at_facility: false,
                startTimestamp: '',
                endTimestamp: '',
                coupon: false,
                percentage: 0,
                coupon_id: null,
                total_amount: '',
                manual: true,
                payment_type: '',
                minutesDifference: 0,
                userMembershipsId: null,
                package_id: null,
                match_mode: '',
                match_type: '',
                match_type2: '',
                match_type3: '',
                min_rating: '',
                max_rating: '',
                split_amount: 0,
                split: true,
                allow_outsiders: false,
                bookedPlayers: '',
                razor_id: '',
                razorpay_order_id: 'NA',
                razorpay_signature: 'NA',
                facility_pay_percentage: null,
                final_amount: '',
                splited_amount: 0,
                bookedby: '',
                source: 'admin',
            });
            setSportType('padel');
            setFinalAmount(0)
            setMatchMode('public');
            setMatchType('doubles');
            setMatchType2('open');
            setMatchType3('social');
            setMinMaxRating([1.0, 7.0]);
            setIsChecked(true);
            setEdit(false);
            resetCoupon();
            setSelectedUsers({
                1: null,
                2: null,
                3: null,
                4: null,
                5: null,
                6: null,
                7: null,
                8: null,
            });
            setDiscountCoupon('');
        }
    }, [open]);

    return (
        <div>
            <Modal
                className="custom-ant-modal"
                open={open}
                title={customTitle}
                onCancel={closingFunctions}
                footer={null}
                width={'1100px'}
                centered
            >
                <div className="form-container">
                    <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)} >
                        <div className="form-column border-bottom-light ">
                            <div className="form-container-grid-3">
                                <div className="input-group">
                                    <label htmlFor="Type" className="form-label">Type<span className="error-message">*</span></label>
                                    <div className="form-group">
                                        <Controller
                                            name="razor_id"
                                            control={control}
                                            rules={{ required: 'Type is required' }}
                                            render={({ field }) => (
                                                <Select
                                                    className="controller-select"
                                                    components={animatedComponents}
                                                    placeholder="select type"
                                                    options={matchMakingType}
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </div>
                                    {errors?.razor_id && <span className="error-message">{errors?.razor_id?.message}</span>}
                                </div>

                                <div className="input-group">
                                    <label htmlFor="facility" className="form-label">Facility<span className="error-message">*</span> </label>
                                    <div className="form-group">
                                        <Controller
                                            name="facility_id"
                                            control={control}
                                            rules={{ required: 'Facility is required' }}

                                            render={({ field }) => (
                                                <Select
                                                    className="controller-select"
                                                    components={animatedComponents}
                                                    defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                                                    // isMulti
                                                    options={facilityList}
                                                    placeholder="Select a facility"
                                                    {...field}
                                                    isDisabled={edit}
                                                />
                                            )}
                                        />
                                    </div>
                                    {errors?.facility_id && (
                                        <span className="error-message">
                                            {errors.facility_id.message}
                                        </span>
                                    )}
                                </div>



                                <div className="input-group">
                                    <label htmlFor="sport_type" className="form-label">Sport Type</label>
                                    <ConfigProvider
                                        theme={{
                                            token: {
                                                colorPrimary: '#F17121',
                                                borderRadius: 18,
                                            },
                                            components: {
                                                Radio: {
                                                    colorPrimary: '#F17121',
                                                },
                                            },
                                        }}
                                    >
                                        <Radio.Group
                                            onChange={onChangeSportType}
                                            value={sportType}
                                            optionType="button"
                                            buttonStyle="solid"
                                            className="custom-button-tabs-v2"
                                        >
                                            {sportTypeOptions.map((option) => (
                                                <Radio value={option.value} disabled={edit}>
                                                    <img src={option.img} style={{ filter : option.value === sportType ? 'brightness(0) invert(1)' : '', width: '12px', height: '12px', marginRight: '5px' }} />
                                                    {option.label}
                                                </Radio>
                                            ))}
                                        </Radio.Group>
                                    </ConfigProvider>
                                    {errors?.match_type && (
                                        <span className="error-message">
                                            {errors.match_type.message}
                                        </span>
                                    )}
                                </div>


                                <div className="input-group">
                                    <label htmlFor="booking_date" className="form-lable">Date<span className="error-message">*</span> </label>
                                    <div className="form-group">
                                        <input
                                            className="form-field"
                                            type="date"
                                            id="booking_date"
                                            {...register(
                                                "booking_date",
                                                {
                                                    required: "Date is required",
                                                }
                                            )}
                                            // onChange={(e) => { bookingAvailable(e.target.value) }}
                                            disabled={edit}
                                        />
                                    </div>
                                    {errors?.booking_date && (
                                        <span className="error-message">
                                            {errors.booking_date.message}
                                        </span>
                                    )}
                                </div>

                                <div className="input-group">
                                    <label htmlFor="court" className="form-label">Select Court<span className="error-message">*</span> </label>
                                    <div className="form-group">
                                        <Controller
                                            name="court_id"
                                            control={control}
                                            rules={{ required: 'Court is required' }}
                                            render={({ field: { onChange, value }, field }) => (
                                                <Select
                                                    className="controller-select"
                                                    components={animatedComponents}
                                                    defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                                                    // isMulti
                                                    options={courtList}
                                                    placeholder="Select a court"
                                                    onChange={(value) => {
                                                        onChange(value);
                                                    }}
                                                    value={value}
                                                    isDisabled={edit}
                                                />
                                            )}
                                        />
                                    </div>
                                    {errors?.court_id && (
                                        <span className="error-message">
                                            {errors.court_id.message}
                                        </span>
                                    )}
                                </div>



                                <div className="input-group">
                                    <label htmlFor="start_time" className="form-label">Start Time<span className="error-message">*</span> </label>
                                    <div className="form-group">
                                        <Controller
                                            name="start_time"
                                            control={control}
                                            rules={{ required: 'Start time is required' }}
                                            render={({ field: { onChange, value }, field }) => (
                                                <Select
                                                    className="controller-select"
                                                    components={animatedComponents}
                                                    defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                                                    options={startSlots}
                                                    onChange={(value) => {
                                                        onChange(value);
                                                    }}
                                                    value={value}
                                                    isDisabled={edit}
                                                />
                                            )}
                                        />
                                    </div>
                                    {errors?.start_time && (
                                        <span className="error-message">
                                            {errors.start_time.message}
                                        </span>
                                    )}
                                </div>

                                <div className="input-group">
                                    <label htmlFor="end_time" className="form-label">End Time<span className="error-message">*</span> </label>
                                    <div className="form-group">
                                        <Controller
                                            name="end_time"
                                            control={control}
                                            rules={{ required: 'End time is required' }}
                                            render={({ field: { onChange, value }, field }) => (
                                                <Select
                                                    className="controller-select"
                                                    components={animatedComponents}
                                                    defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                                                    options={endSlots}
                                                    onChange={(value) => {
                                                        onChange(value);
                                                    }}
                                                    value={value}
                                                    isDisabled={edit}
                                                />
                                            )}
                                        />
                                    </div>
                                    {errors?.end_time && (
                                        <span className="error-message">
                                            {errors.end_time.message}
                                        </span>
                                    )}
                                </div>

                                <div className="input-group">
                                    <label htmlFor="match_type" className="form-label">Select Rating Range</label>
                                    <div style={{ marginTop: '1rem' }}>
                                        <ConfigProvider
                                            theme={{
                                                token: {
                                                    colorPrimary: '#F17121',
                                                },
                                            }}
                                        >
                                            <Slider
                                                range
                                                step={0.5}
                                                min={1.0}
                                                max={7.0}
                                                defaultValue={edit ? [rowData?.min_rating, rowData?.max_rating] : [1.0, 7.0]}
                                                onChangeComplete={onChangeComplete}
                                            />
                                        </ConfigProvider>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="match_mode" className="form-label">Match Mode</label>
                                    <ConfigProvider
                                        theme={{
                                            token: {
                                                colorPrimary: '#F17121',
                                                borderRadius: 18,
                                            },
                                            components: {
                                                Radio: {
                                                    colorPrimary: '#F17121',
                                                },
                                            },
                                        }}
                                    >
                                        <Radio.Group
                                            onChange={onChangeMatchMode}
                                            value={matchMode}
                                            optionType="button"
                                            buttonStyle="solid"
                                            className="custom-button-tabs-v2"
                                        >
                                            {matchModeOptions.map((option) => (
                                                <Radio value={option.value}>
                                                    <Icon icon={option.icon} style={{ marginRight: '5px' }} />
                                                    {option.label}
                                                </Radio>
                                            ))}
                                        </Radio.Group>
                                    </ConfigProvider>
                                </div>


                                <div className="input-group">
                                    <label htmlFor="location">Select Event </label>
                                    <div className="form-group">
                                        <Controller
                                            name="event_id"
                                            control={control}

                                            render={({ field: { onChange, value }, field }) => (
                                                <Select
                                                    className="controller-select"
                                                    components={animatedComponents}
                                                    options={tournaments}
                                                    {...field}
                                                    onChange={(value) => {
                                                        onChange(value);
                                                        console.log("🚀 ~ file: AddMatch.tsx:1350 ~ AddMatch ~ value:", value)
                                                    }}
                                                    value={value}
                                                />
                                            )}
                                        />
                                    </div>
                                    {/* {errors?.event_id && (
                                            <span className="error-message">
                                                {errors.event_id.message}
                                            </span>
                                        )} */}
                                </div>
                                {/* {selectedEvent?.categories?.length > 0 && */}
                                <div className="input-group">
                                    <label htmlFor="location">Select Event Category </label>
                                    <div className="form-group">
                                        <Controller
                                            name="category_id"
                                            control={control}

                                            render={({ field: { onChange, value }, field }) => (
                                                <Select
                                                    className="controller-select"
                                                    components={animatedComponents}
                                                    options={selectedEvent?.categories.map((category) => ({ label: category?.ui_name_for_tournament, value: category?._id }))}
                                                    {...field}
                                                    onChange={(value) => {
                                                        onChange(value);
                                                    }}
                                                    value={value}
                                                />
                                            )}
                                        />
                                    </div>
                                    {/* {errors?.event_id && (
                                            <span className="error-message">
                                                {errors.event_id.message}
                                            </span>
                                        )} */}
                                </div>
                                {/* } */}
                                <div className="input-group">
                                    <label htmlFor="show_home" className="form-label">Show on app Homescreen</label>
                                    <ConfigProvider
                                        theme={{
                                            token: {
                                                colorPrimary: '#F17121',
                                                borderRadius: 18,
                                            },
                                            components: {
                                                Radio: {
                                                    colorPrimary: '#F17121',
                                                },
                                            },
                                        }}
                                    >
                                        <Radio.Group
                                            onChange={onChangeShowHome}
                                            value={showHome}
                                            optionType="button"
                                            buttonStyle="solid"
                                            className="custom-button-tabs-v2"
                                        >
                                            {ShowHomeOptions.map((option) => (
                                                <Radio value={option.value}>
                                                    <Icon icon={option.icon} style={{ marginRight: '5px' }} />
                                                    {option.label}
                                                </Radio>
                                            ))}
                                        </Radio.Group>
                                    </ConfigProvider>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="match_mode" className="form-label">Match Type</label>
                                    <ConfigProvider
                                        theme={{
                                            token: {
                                                colorPrimary: '#F17121',
                                                borderRadius: 18,
                                            },
                                            components: {
                                                Radio: {
                                                    colorPrimary: '#F17121',
                                                },
                                            },
                                        }}
                                    >
                                        <Radio.Group
                                            options={matchTypeOptions}
                                            onChange={onChangeMatchType}
                                            value={matchType}
                                            optionType="button"
                                            buttonStyle="solid"
                                            className="custom-button-tabs-v2"
                                        />
                                        <Radio.Group
                                            options={matchType2Options}
                                            onChange={onChangeMatchType2}
                                            value={matchType2}
                                            optionType="button"
                                            buttonStyle="solid"
                                            className="custom-button-tabs-v2"
                                        />
                                        <Radio.Group
                                            options={matchType3Options}
                                            onChange={onChangeMatchType3}
                                            value={matchType3}
                                            optionType="button"
                                            buttonStyle="solid"
                                            className="custom-button-tabs-v2"
                                        />
                                    </ConfigProvider>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="match_type" className="form-label">Match Players</label>
                                    <div className="matchmaking-card">
                                        <CustomUserSelection position={1} user={selectedUsers[1]} setUser={(user) => setSelectedUsers((prev) => ({ ...prev, 1: user }))} showsplitAmount={true} />
                                        {matchType === 'doubles' && <CustomUserSelection position={2} user={selectedUsers[2]} setUser={(user) => setSelectedUsers((prev) => ({ ...prev, 2: user }))} showsplitAmount={true} />}
                                        <hr />
                                        <CustomUserSelection position={3} user={selectedUsers[3]} setUser={(user) => setSelectedUsers((prev) => ({ ...prev, 3: user }))} showsplitAmount={true} />
                                        {matchType === 'doubles' && <CustomUserSelection position={4} user={selectedUsers[4]} setUser={(user) => setSelectedUsers((prev) => ({ ...prev, 4: user }))} showsplitAmount={true} />}
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="match_type" className="form-label">Add   Extra Players</label>
                                    <div className="matchmaking-card">
                                        <CustomUserSelection position={5} user={selectedUsers[5]} setUser={(user) => setSelectedUsers((prev) => ({ ...prev, 5: user }))} showsplitAmount={false} />
                                        {matchType === 'doubles' && <CustomUserSelection position={6} user={selectedUsers[6]} setUser={(user) => setSelectedUsers((prev) => ({ ...prev, 6: user }))} showsplitAmount={false} />}
                                        <hr />
                                        <CustomUserSelection position={7} user={selectedUsers[7]} setUser={(user) => setSelectedUsers((prev) => ({ ...prev, 7: user }))} showsplitAmount={false} />
                                        {matchType === 'doubles' && <CustomUserSelection position={8} user={selectedUsers[8]} setUser={(user) => setSelectedUsers((prev) => ({ ...prev, 8: user }))} showsplitAmount={false} />}
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="price" className="form-lable">Price<span className="error-message">*</span> </label>
                                    <div className="form-group">
                                        {/* <input
                                            className="form-field"
                                            type="price"
                                            id="price"
                                            value={totalSlotPrice}
                                            disabled={true}
                                        /> */}
                                        {totalSlotPrice}
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="discount_coupon" className="form-lable">Discount Coupon </label>
                                    <div className="form-group">
                                        <input
                                            className="form-field"
                                            type="text"
                                            id="discount_coupon"
                                            value={discountCoupon}
                                            onChange={(e) => setDiscountCoupon(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <div
                                        style={{ display: 'flex', justifyContent: 'end', flexDirection: 'column', height: "100%" }}
                                    >
                                        {discountedAmount > 0 ? <button
                                            type="button"
                                            className="pi-btn-delete"
                                            onClick={() => { removeCoupon() }}
                                            disabled={edit}
                                        >
                                            Remove
                                        </button> :
                                            <button
                                                type="button"
                                                className="pi-btn-secondary"
                                                onClick={() => { applyCoupon() }}
                                                disabled={edit || totalSlotPrice == 0 || discountCoupon == ''}
                                            >
                                                Apply

                                            </button>}
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="newprice" className="form-lable">New Price<span className="error-message">*</span> </label>
                                    <div className="form-group">
                                        {/* <input
                                                    className="form-field"
                                                    type="newprice"
                                                    id="newprice"
                                                    defaultValue={finalAmount}
                                                    disabled={true}
                                                /> */}
                                        {finalAmount}
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="applicable_discount" className="form-lable">Applicable Discount<span className="error-message">*</span> </label>
                                    <div className="form-group">
                                        {/* <input
                                                    className="form-field"
                                                    type="applicable_discount"
                                                    id="applicable_discount"
                                           
                                                    defaultValue={discountedAmount}
                                                    disabled={true}
                                                /> */}
                                        {discountedAmount}
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="applicable_discount" className="form-lable">GST<span className="error-message">*</span> </label>
                                    <div className="form-group">
                                        {/* <input
                                                    className="form-field"
                                                    type="applicable_discount"
                                                    id="applicable_discount"
                                           
                                                    defaultValue={discountedAmount}
                                                    disabled={true}
                                                /> */}
                                        {gst}
                                    </div>
                                </div>
                                <div className="input-group"></div>
                                <div className="input-group">
                                    {
                                        discountedAmount > 0 ?
                                            <><AmountCard /></>
                                            :
                                            <>
                                                {/* {selectedSlots.length > 0 && */}
                                                <>
                                                    <div className="form-container-grid">
                                                        <div className="input-group">
                                                            {/* {JSON.stringify(rowData?.slot_ids)} */}
                                                            <label htmlFor="start_time" className="form-lable">Base Price</label>
                                                            <label htmlFor="start_time" className="form-lable">GST Price</label>
                                                        </div>
                                                        <div className="input-group ">
                                                            <label htmlFor="start_time" className=" amntcard-flex-end">{selectedSlots.length > 0 ? selectedSlots.reduce((sum, slot: any) => sum + Number(slot?.basePrice), 0).toFixed(2) : basePrice}</label>
                                                            <label htmlFor="start_time" className=" amntcard-flex-end">{selectedSlots.length > 0 ? selectedSlots.reduce((sum, slot: any) => sum + Number(slot?.gst), 0).toFixed(2) : gst}</label>
                                                        </div>
                                                    </div>
                                                    <hr></hr>
                                                    <div className="form-container-grid">
                                                        <div className="input-group">
                                                            <label htmlFor="start_time" className="form-lable">Total</label>
                                                        </div>
                                                        <div className="input-group ">
                                                            <label htmlFor="start_time" className=" amntcard-flex-end">{selectedSlots.length > 0 ? selectedSlots.reduce((sum, slot: any) => sum + Number(slot?.price), 0).toFixed(2) : totalAmount}</label>
                                                        </div>
                                                    </div>
                                                    <hr></hr>
                                                    <div className="form-container-grid">
                                                        <div className="input-group">
                                                            <label htmlFor="start_time" className="form-lable">Amount for 1 player</label>
                                                        </div>
                                                        <div className="input-group ">
                                                            <label htmlFor="start_time" className=" amntcard-flex-end">{splitAmount}</label>
                                                        </div>
                                                    </div>
                                                </>
                                                {/* } */}
                                            </>}
                                </div>
                            </div>



                            <div>
                                <div className="add-ons-container">
                                    <div className="add-button">
                                        <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
                                        <span style={{ paddingLeft: '5px', fontSize: '15px' }}>If matches are not found, we will share outside the ratings range </span>
                                    </div>
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
                                    {edit ? "Save" : "Create"}
                                </button>
                            </Footer>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    )
}

export default AddMatch