import React, { useEffect, useMemo, useState } from "react";
import { Modal, Switch } from "antd";
import { Controller, useForm } from 'react-hook-form'
import "../css/style.css";
import { toast } from "react-toastify";
import { createCouponAPI, editCouponAPI, getAllTournamentsAPI } from "../apiFile/Service";
import ToastMessage from "../../page/facilator/ToastMessage/ToastMessage";
import { Footer } from "antd/es/layout/layout";
import Select from "react-select";
import makeAnimated from "react-select/animated";

interface formModal {
    coupon_name:any,
    percentage:any,
    expiry_date:any,
    coupon_type:any,
    event_id:any,
    sport_type:any,
    facility_id:any,
    is_fixed:any,
    user_limit:any,
    limit:any,
    count:any,
    new_user:any,
    region:any,
    activation_date:any
}

const AddCoupon = ({
    open,
    toggle,
    getItems,
    editdata,
    edit,
    setEdit,
    setEditData,
    facilitydata,
    data
}) => {
    const form = useForm({
        defaultValues: {
            coupon_name: "",
            percentage: "",
            expiry_date: "",
            coupon_type: {},
            event_id: {},
            sport_type: {},
            facility_id: {},
            is_fixed: false,
            user_limit: "",
            limit: "",
            count: true,
            new_user: false,
            region: {},
            activation_date: ""
        }
    })
    const data1 = data || [];
    const { register, handleSubmit, reset, formState, watch, control } = form;
    // let ctype = watch('coupon_type')
    // const [eventId, setEventId] = useState(false)
    const [tournaments, setTournaments] = useState([{}])
    const [couponType, setCouponType] = useState();
    const [fixedPrice, setFixedPrice] = useState(false);
    const [forNewUser, setForNewUser] = useState(false);
    const { errors } = formState;
    const loggedInUser = localStorage.getItem("auth");
    const closingFunctions = () => { toggle(!open); reset(); setEdit(false); setEditData({}) }
    const animatedComponents = makeAnimated();
   
    const couponOptions = [
        { label: 'Booking', value: 'Booking' },
        { label: 'Events', value: 'Events', },
        { label: 'Both', value: 'Both', },
    ];

    const sportOptions = [
        { label: 'All', value: 'all' },
        { label: 'Padel', value: 'padel' },
        { label: 'Pickleball', value: 'pickleball', },
    ];

    const customTitle = (
        <div className="custom-ant-modal-header">
            {edit == true ? "Edit Platform Coupon" : "Add Platform Coupon"}
        </div>
    );

    const statesOptions = [
        { label: "All", value: "All" }, 
        { "label": "Andhra Pradesh", "value": "Andhra Pradesh" },
        { "label": "Arunachal Pradesh", "value": "Arunachal Pradesh" },
        { "label": "Assam", "value": "Assam" },
        { "label": "Bihar", "value": "Bihar" },
        { "label": "Chhattisgarh", "value": "Chhattisgarh" },
        { "label": "Goa", "value": "Goa" },
        { "label": "Gujarat", "value": "Gujarat" },
        { "label": "Haryana", "value": "Haryana" },
        { "label": "Himachal Pradesh", "value": "Himachal Pradesh" },
        { "label": "Jharkhand", "value": "Jharkhand" },
        { "label": "Karnataka", "value": "Karnataka" },
        { "label": "Kerala", "value": "Kerala" },
        { "label": "Madhya Pradesh", "value": "Madhya Pradesh" },
        { "label": "Maharashtra", "value": "Maharashtra" },
        { "label": "Manipur", "value": "Manipur" },
        { "label": "Meghalaya", "value": "Meghalaya" },
        { "label": "Mizoram", "value": "Mizoram" },
        { "label": "Nagaland", "value": "Nagaland" },
        { "label": "Odisha", "value": "Odisha" },
        { "label": "Punjab", "value": "Punjab" },
        { "label": "Rajasthan", "value": "Rajasthan" },
        { "label": "Sikkim", "value": "Sikkim" },
        { "label": "Tamil Nadu", "value": "Tamil Nadu" },
        { "label": "Telangana", "value": "Telangana" },
        { "label": "Tripura", "value": "Tripura" },
        { "label": "Uttar Pradesh", "value": "Uttar Pradesh" },
        { "label": "Uttarakhand", "value": "Uttarakhand" },
        { "label": "West Bengal", "value": "West Bengal" },
        { "label": "Andaman and Nicobar Islands", "value": "Andaman and Nicobar Islands" },
        { "label": "Chandigarh", "value": "Chandigarh" },
        { "label": "Dadra and Nagar Haveli and Daman and Diu", "value": "Dadra and Nagar Haveli and Daman and Diu" },
        { "label": "Lakshadweep", "value": "Lakshadweep" },
        { "label": "Delhi", "value": "Delhi" },
        { "label": "Puducherry", "value": "Puducherry" },
        { "label": "Ladakh", "value": "Ladakh" },
        { "label": "Jammu and Kashmir", "value": "Jammu and Kashmir" }
    ]


    const onSubmit = async (data: formModal) => {
        data.percentage = Number(data.percentage)
        if (data.event_id != "") {
            data.event_id = [data.event_id.value]
        }
        data.is_fixed = fixedPrice
        data.new_user = forNewUser
        data.sport_type = data.sport_type.value
        data.coupon_type = data.coupon_type.value
        data.user_limit = Number(data.user_limit)
        data.limit = Number(data.limit)
        data.count = true
        data.facility_id = data.facility_id.map((data)=>{
            return data.value
        });
        data.region = data.region.map((data)=>{
            return data.value
        });

        let response
        if (edit == true) {
            response = await editCouponAPI(loggedInUser, data, editdata._id);
        } else {
            // Creating a new coupon
            response = await createCouponAPI(loggedInUser, data);

            // Check for coupon name duplication
            const resp = data1.find((e) => e.coupon_name === data?.coupon_name);
            if (resp) {
                toast(<ToastMessage body={"Coupon already exists"} type="warning" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return;
            }
        }
        if (response.statusCode == 0) {
            reset();
            toast(<ToastMessage body={edit == true ? "Coupon Edited Successfully" : "Coupon Created Successfully"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            getItems();
            closingFunctions();
            reset();
        } else {
            getItems();
            console.log("error")
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

    const getTournaments = async () => {
        let response = await getAllTournamentsAPI(loggedInUser);
        let tournament = response?.result?.map(data => {
            return { "label": data?.tournament_name, "value": data._id }
        })
        setTournaments(tournament)
    }

    useEffect(() => {
        if (edit == true) {
            setFixedPrice(editdata?.is_fixed)
            setForNewUser(editdata?.new_user)
            setCouponType(editdata?.coupon_type )
            reset({
                coupon_name: editdata?.coupon_name,
                percentage: editdata?.percentage,
                expiry_date: editdata?.expiry_date,
                coupon_type:  { label: editdata?.coupon_type, value: editdata?.coupon_type },
                event_id: editdata?.event_id?.map(data => {
                    return { "label": data, "value": data }
                }),
                sport_type: { label:  editdata?.sport_type, value:  editdata?.sport_type },
                facility_id: editdata?.facility_id?.map(data => {
                    return { "label": data.name, "value": data._id }
                }),
                user_limit: editdata?.user_limit,
                limit: editdata?.limit,
                region: editdata?.region?.map(data => {
                    return { "label": data, "value": data}
                }),
                activation_date: editdata?.activation_date
            })
        } else {
            setFixedPrice(false)
            setForNewUser(false)
            reset({})
            reset({
                coupon_type: [],
                facility_id: [],
                sport_type: [],
                event_id: [],
                region: [],
            })
        }
      
    }, [open])

    useEffect(() => {
        getTournaments()
    }, [])

    const onChangeIsFixed = (checked: boolean) => {
       setFixedPrice(checked)
    };

    const onChangeForNewUser = (checked: boolean) => {
        setForNewUser(checked)
    };
    const customStyles = {
        valueContainer: (provided) => ({
            ...provided,
            maxHeight: '30px',
            overflowY: 'auto',
            padding: '0',
        }),
    };
    return (
        <div>
            <Modal

                className="custom-ant-modal "
                open={open}
                title={customTitle}
                onCancel={closingFunctions}
                footer={null}
                width={'500px'}
                centered
            >
                <div className="form-container">
                    {/* <div className="form-header">
                        <h2>Add New Facility</h2>
                        <span className="close-icon" onClick={toggle}>X</span>
                    </div> */}
                    <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
                        <div className="border-bottom-light">
                            <div className="form-container-grid">
                                <div className="input-group">
                                    <label htmlFor="couponName">Coupon Name<span style={{ color: "red" }}>*</span></label>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            id="couponName"
                                            placeholder="Coupon Name"
                                            {...register('coupon_name', {
                                                required: {
                                                    value: true,
                                                    message: 'Coupon name is required',
                                                },
                                            })}
                                        />

                                    </div>
                                    {errors?.coupon_name && (
                                        <span className="error-message">
                                            {errors.coupon_name.message}
                                        </span>
                                    )}
                                </div>

                                <div className="input-group">
                                    <label htmlFor="location">Coupon Type<span style={{ color: "red" }}>*</span></label>
                                    <div className="form-group">
                                        <Controller
                                            name="coupon_type"
                                            control={control}
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message: "Coupon type is required",
                                                },
                                            }}
                                            render={({ field: { onChange, value }, field }) => (
                                                <Select
                                                    className="controller-select"
                                                    components={animatedComponents}
                                                    options={couponOptions}
                                                    {...field}
                                                    onChange={(value: any) => {
                                                        onChange(value);
                                                        setCouponType(value.value);
                                                    }}
                                                    value={value}
                                                />
                                            )}
                                        /> 
                                    </div>
                                    {errors?.coupon_type && (
                                        <span className="error-message">
                                            {errors.coupon_type.message}
                                        </span>
                                    )}
                                </div>

                                <div className="switch-container">
                                    <label htmlFor="fixedprice">Fixed Price</label>
                                    <Switch defaultChecked onChange={onChangeIsFixed} checked={fixedPrice} />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="couponpercentage">{fixedPrice ? 'Price Per Coupon' : 'Percentage ( % )'}<span style={{ color: "red" }}>*</span></label>
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            id="couponpercentage"
                                            max={fixedPrice ? 1000000 : 100}
                                            placeholder={fixedPrice ? 'Price' : 'Percentage % '}
                                            {...register('percentage', {
                                                required: {
                                                    value: true,
                                                    message: `${fixedPrice ? 'Price Per Coupon is required' : 'Percentage is required'}`,
                                                },
                                            })}
                                        />

                                    </div>
                                    {errors?.percentage && (
                                        <span className="error-message">
                                            {errors.percentage.message}
                                        </span>
                                    )}
                                </div>
                                <div className="input-group">
                                    <label htmlFor="activation_date">Activation Date<span style={{ color: "red" }}>*</span></label>
                                    <div className="form-group">
                                        <input
                                            type="date"
                                            id="activation_date"
                                            placeholder="activation_date"
                                            {...register('activation_date', {
                                                required: {
                                                    value: true,
                                                    message: 'Activation date is required',
                                                },
                                            })}
                                        />

                                    </div>
                                    {errors?.activation_date && (
                                        <span className="error-message">
                                            {errors.activation_date.message}
                                        </span>
                                    )}
                                </div>
                                <div className="input-group">
                                    <label htmlFor="expirydate">Expiry Date<span style={{ color: "red" }}>*</span></label>
                                    <div className="form-group">
                                        <input
                                            type="date"
                                            id="expirydate"
                                            placeholder="Event Name"
                                            {...register('expiry_date', {
                                                required: {
                                                    value: true,
                                                    message: 'Expiry date is required',
                                                },
                                            })}
                                        />

                                    </div>
                                    {errors?.expiry_date && (
                                        <span className="error-message">
                                            {errors.expiry_date.message}
                                        </span>
                                    )}
                                </div>
                                <div className="input-group">
                                    <label htmlFor="location">Sport Type<span style={{ color: "red" }}>*</span></label>
                                    <div className="form-group">
                                        <Controller
                                            name="sport_type"
                                            control={control}
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message: "Sport type is required",
                                                },
                                            }}
                                            render={({ field: { onChange, value }, field }) => (
                                                <Select
                                                    // closeMenuOnSelect={false}
                                                    className="controller-select"
                                                    components={animatedComponents}
                                                    // defaultValue={row._id}
                                                    // defaultValue={[colourOptions[4], colourOptions[5]]}
                                                    // isMulti
                                                    options={sportOptions}
                                                    {...field}
                                                    onChange={(value) => {
                                                        onChange(value);
                                                    }}
                                                    value={value}
                                                />
                                            )}
                                        />
                                    </div>
                                    {errors?.sport_type && (
                                        <span className="error-message">
                                            {errors.sport_type.message}
                                        </span>
                                    )}
                                </div>
                                {couponType == 'Events' &&
                                    <div className="input-group">
                                        <label htmlFor="location">Select Event<span style={{ color: "red" }}>*</span></label>
                                        <div className="form-group">
                                            <Controller
                                                name="event_id"
                                                control={control}
                                                rules={{
                                                    required: {
                                                        value: couponType == 'Events' ? true : false,
                                                        message: "Event is required",
                                                    },
                                                }}
                                                render={({ field: { onChange, value }, field }) => (
                                                    <Select
                                                        className="controller-select"
                                                        components={animatedComponents}
                                                        options={[{ label: 'All', value: 'All' },...tournaments]}
                                                        {...field}
                                                        onChange={(value) => {
                                                            onChange(value);
                                                        }}
                                                        value={value}
                                                    />
                                                )}
                                            />
                                        </div>
                                        {errors?.event_id && (
                                            <span className="error-message">
                                                {errors.event_id.message}
                                            </span>
                                        )}
                                    </div>
                                   }
                                {couponType == 'Booking' &&
                                    <div className="input-group">
                                        <label htmlFor="location">Select Facility <span style={{ color: "red" }}>*</span></label>
                                        <div className="form-group">
                                            <Controller
                                                name="facility_id"
                                                control={control}
                                                rules={{
                                                    required: {
                                                        value: couponType == 'Booking' ? true : false,
                                                        message: "Facility is required",
                                                    },
                                                }}
                                                render={({ field: { onChange, value }, field }) => (
                                                    <Select
                                                        styles={customStyles}
                                                        className="controller-select"
                                                        closeMenuOnSelect={false}
                                                        isMulti
                                                        components={animatedComponents}
                                                        options={[{ label: 'All', value: 'All' },...facilitydata]}
                                                        {...field}
                                                      
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
                                   }
                                <div className="input-group">
                                    <label htmlFor="redemptionPer">Redemption Per User<span style={{ color: "red" }}>*</span></label>
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            id="redemptionPer"
                                            placeholder="Coupon Name"
                                            {...register('user_limit', {
                                                required: {
                                                    value: true,
                                                    message: 'Redemption per user is required',
                                                },
                                            })}
                                        />

                                    </div>
                                    {errors?.user_limit && (
                                        <span className="error-message">
                                            {errors.user_limit.message}
                                        </span>
                                    )}
                                </div>
                                <div className="input-group">
                                    <label htmlFor="totalRedemption">Total Redemption<span style={{ color: "red" }}>*</span></label>
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            id="totalRedemption"
                                            placeholder="limit"
                                            {...register('limit', {
                                                required: {
                                                    value: true,
                                                    message: 'Total Redemption is required',
                                                },
                                            })}
                                        />

                                    </div>
                                    {errors?.limit && (
                                        <span className="error-message">
                                            {errors.limit.message}
                                        </span>
                                    )}
                                </div>
                                <div className="switch-container">
                                    <label htmlFor="couponName">For New Users only</label>
                                    <Switch defaultChecked onChange={onChangeForNewUser} checked={forNewUser} />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="region">Select Region <span style={{ color: "red" }}>*</span></label>
                                    <div className="form-group">
                                        <Controller
                                            name="region"
                                            control={control}
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message: "Region is required",
                                                },
                                            }}
                                            render={({ field: { onChange, value }, field }) => (
                                                <Select
                                                    styles={customStyles}
                                                    className="controller-select"
                                                    closeMenuOnSelect={false}
                                                    isMulti
                                                    components={animatedComponents}
                                                    options={statesOptions}
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </div>
                                    {errors?.region && (
                                        <span className="error-message">
                                            {errors.region.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Footer className='ant-modal-footer'>
                            <button type="button" className="pi-btn-secondary" onClick={closingFunctions}>Cancel</button>
                            <button type="submit" className="pi-btn-primary">{edit == true ? "Save" : "Create"}</button>
                        </Footer>
                    </form>
                </div>
            </Modal>
        </div >
    );
};
export default AddCoupon;