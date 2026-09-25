import { Modal, Switch } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import Select from "react-select";
import makeAnimated from "react-select/animated";
import * as Constants from "../../components/apiFile/Constants";
import { createEventFlyerAPI, editEventFlyerAPI } from '../apiFile/Service';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import JoditEditor from 'jodit-react';
import moment from 'moment';

export default function AddEventFlyers({ visible, onCancel, row, edit, setEdit, events, facilities, getAllData, Couponsdata }) {
    const currentDate = moment().format('YYYY-MM-DD');
    const newcouponsdata = Couponsdata?.filter(data => data.expiry_date >= currentDate)
        .map(data => {
            return { "label": data.coupon_name, "value": data._id };
        });

    const loggedInUser = localStorage.getItem("auth");
    const { register, handleSubmit, control, reset, formState: { errors }, watch, setValue } = useForm();
    const [checked, setChecked] = useState(false);
    const [checkedForceUpgrade, setCheckedForceUpgrade] = useState(false);
    const [description, setdescription] = useState("")
    const [previewImage, setPreviewImage] = useState("");
    const [checkDescription, setCheckDescription] = useState(false)
    let contentType: any = watch('type')
    let Flyerfor = watch('flyer_for')
    const editor = useRef(null);
    const customTitle = (
        <div className="custom-ant-modal-header">
            {edit ? 'Edit Event Flyers' : 'Add Event Flyers'}
        </div>
    );
    const animatedComponents = makeAnimated();
    const fileURL = async (data, date) => {
        console.log(data)
        const params = {
            ACL: "public-read",
            Body: data[0],
            Bucket: `${Constants.S3_BUCKET}events`,
            Key: `${date}_flyerImage_${data[0].name}`,
        };

        Constants.myBucket.upload(params, function (err, uploadData) {
            if (uploadData) {
                data = uploadData.Location;
                return;
            } else {
                console.log("error", err);
            }
        });
    }

    const onSuccess = () => {
        reset();
        onCancel();
        getAllData();
        setEdit(false);
        setPreviewImage("");
    }
    const stripHtmlTags = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    const getCharCount = (content) => {
        const textOnlyContent = stripHtmlTags(content);
        return textOnlyContent.length;
    }


    const onSubmit = async (data) => {
        var date = Math.round(+new Date() / 1000);
        const payload: any = {
            "type": data.type.value,
            "flyer_for": data.flyer_for.value,
            "new_user": checked,
            "state": data.state.value,
            "start_date": data.start_date,
            "end_date": data.end_date,
            "views": Number(data?.views),
            "button_text": data.btnText,
            "coupon_id": data?.coupon_id?.value,
            "external_link": data?.external_link,
            "app_ver": data?.app_ver,
            "force_update": checkedForceUpgrade
        }
        if (data.type.value == 'text') {
            payload.text = description;
        } else {
            if (data.image.length > 0) {
                await fileURL(data.image, date)
                payload.image = `${Constants.BaseLink}events/${date}_flyerImage_${data.image[0].name}`;
            } else if (edit == true) {
                payload.image = row.image
            } else {
                payload.image = "NO Image Added"
            }
        }
        if (data.flyer_for.value == 'event') {
            payload.operational_id = data.event_id.value;
        } else {
            payload.operational_id = data.facility_id.value;
        }
        console.log(payload)
        let response
        if (edit == true) {
            response = await editEventFlyerAPI(loggedInUser, row._id, payload);
        } else {
            response = await createEventFlyerAPI(loggedInUser, payload);
        }
        if (response.code == 'SUCCESS') {
            toast(<ToastMessage body={edit ? "Event Flyer Updated Successfully" : "Event Flyer Created Successfully"} type="success" />, {
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


    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    useEffect(() => {
        if (edit) {
            console.log('row--------------', row)
            setdescription(row.text);
            reset({
                "type": { label: capitalizeFirstLetter(row?.type), value: row?.type },
                "state": { label: row?.state, value: row?.state },
                "event_id": { label: row?.prop?.tournament_name, value: row?.operational_id },
                "facility_id": { "label": row?.prop?.name + ', ' + row?.prop?.address, "value": row?.prop?._id },
                "flyer_for": { label: capitalizeFirstLetter(row?.flyer_for), value: row?.flyer_for },
                "start_date": moment(row?.start_date).format('YYYY-MM-DD'),
                "end_date": moment(row?.end_date).format('YYYY-MM-DD'),
                // "image": row?.image,
                "description": row?.text,
                "views": row?.views,
                "btnText": row?.button_text,
                "coupon_id": row?.coupon ? { label: row?.coupon?.coupon_name, value: row?.coupon?._id } : { label: "Select...", value: row?.coupon?._id },
                "external_link": row?.external_link,
                "app_ver": row?.app_ver,
            })
            setPreviewImage(row?.image)
            setChecked(row?.new_user)
            setCheckedForceUpgrade(row?.force_update)
        } else {
            setdescription("");
            setPreviewImage("");
            reset({});
            reset({
                "type": '',
                "state": '',
                "event_id": '',
                "facility_id": '',
                "flyer_for": '',
                "start_date": '',
                "end_date": '',
                "image": '',
                "description": '',
                "views": '',
                "coupon_id": '',
                "external_link": '',
                "app_ver": ''
            });
            setEdit(false);
            setCheckDescription(false)
            setChecked(false)
            setCheckedForceUpgrade(false)
        }
    }, [visible])

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


    const handleChange = (nextChecked) => {
        setChecked(nextChecked);
    }
    const handleChangeForceUpgrade = (nextChecked) => {
        setCheckedForceUpgrade(nextChecked);
        console.log(nextChecked);
        
    }



    return (
        <Modal
            title={customTitle}
            visible={visible}
            // onOk={onConfirm}
            width={"50%"}
            onCancel={() => {
                onCancel();
                reset();
            }}
            footer={null}
            className="custom-ant-modal lable-content-width"
        >
            <div className="form-container">
                <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-container-grid">
                        <div className="input-group">
                            <label className="form-lable" htmlFor="type">Select Type<span className='required-star '>*</span></label>
                            <div className="form-group">
                                <Controller
                                    name="type"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Type is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value }, field }) => (
                                        <Select
                                            className="controller-select"
                                            components={animatedComponents}
                                            defaultValue={row._id}
                                            options={[
                                                { label: 'Text', value: 'text' },
                                                { label: 'Image', value: 'image' },

                                            ]}
                                            {...field}

                                        />
                                    )}
                                />
                            </div>
                            {errors?.type && (
                                <span className="error-message">
                                    Type is Required
                                </span>
                            )}
                        </div>
                        {contentType && contentType?.value == 'text' ?
                            <div className="input-group col-span-2-lg">
                                <label htmlFor="term" className="form-lable">Text<span className='required-star '>*</span></label>
                                <div className="">
                                    <JoditEditor
                                        ref={editor}
                                        value={description}
                                        onChange={(value) => {
                                            setdescription(value);
                                            if (getCharCount(value) <= 0 || value === "") {
                                                setCheckDescription(true)
                                            } else {
                                                setCheckDescription(false)
                                            }
                                        }}
                                    />

                                </div>
                                {checkDescription && (
                                    <span className="error-message">
                                        Description is rquired
                                    </span>
                                )}
                            </div>
                            :
                            <div className="input-group">
                                <label>Image<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group ">
                                    <input
                                        type="file"
                                        accept="image/x-png,image/gif,image/jpeg"
                                        // onChange={(e) => { fileURL(e.target.files) }}
                                        {...register("image", {
                                            required: {
                                                value: edit == true ? false : true,
                                                message: "Image is required",
                                            },
                                        })}
                                    // onChange={onChange}
                                    />
                                </div>
                                {errors?.image && (
                                    <span className="error-message">
                                        Image is Required
                                    </span>
                                )}
                            </div>
                        }
                        {edit && row?.type !== "text" ?
                            <div className="input-group col-span-2">
                                <div className='label-pre'>
                                    <label htmlFor="myCheckbox"><strong>Image Preview</strong> </label>
                                    {(row.image && previewImage !== "")}
                                </div>
                                <img src={previewImage} style={{ height: '190px', width: '190px' }} className="table-lg-img-square" />
                            </div> : null
                        }
                        <div className="input-group">
                            <label className="form-lable" htmlFor="type">Flyerfor Dropdown<span className='required-star '>*</span></label>
                            <div className="form-group">
                                <Controller
                                    name="flyer_for"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: Flyerfor?.value > 0 ? false : true,
                                            message: "Flyerfor Type is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value }, field }) => (
                                        <Select
                                            className="controller-select"
                                            components={animatedComponents}
                                            defaultValue={row._id}
                                            options={[
                                                { label: 'Event', value: 'event' },
                                                { label: 'Facility', value: 'facility' },
                                                { label: 'App Upgrade', value: 'App_Upgrade' },
                                                { label: 'External Link', value: 'external_link' },
                                            ]}
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                            {errors?.flyer_for && (
                                <span className="error-message">
                                    Flyerfor Dropdown is Required
                                    {/* {errors.Flyerfor.message} */}
                                </span>
                            )}
                        </div>
                        {Flyerfor?.value == 'event' &&
                            <>
                                <div className="input-group">
                                    <label className="form-lable" htmlFor="sport_type">Event<span className='required-star '>*</span></label>
                                    <div className="form-group">
                                        <Controller
                                            name="event_id"
                                            control={control}
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message: "Event is required",
                                                },
                                            }}
                                            render={({ field: { onChange, value }, field }) => (
                                                <Select
                                                    // closeMenuOnSelect={false}
                                                    className="controller-select"
                                                    components={animatedComponents}
                                                    defaultValue={row._id}
                                                    options={events}
                                                    {...field}
                                                    value={value}
                                                />
                                            )}
                                        />
                                    </div>
                                    {errors?.event_id && (
                                        <span className="error-message">
                                            Event is Required
                                            {/* {errors.event.message} */}
                                        </span>
                                    )}
                                </div>
                                <div className="input-group">
                                    <label className="form-lable" htmlFor="type">Coupon Associated</label>
                                    <div className="form-group">
                                        <Controller
                                            name="coupon_id"
                                            control={control}
                                            render={({ field: { onChange, value }, field }) => (
                                                <Select
                                                    className="controller-select"
                                                    components={animatedComponents}
                                                    defaultValue={row._id}
                                                    options={newcouponsdata}
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </>
                        }
                        {Flyerfor?.value == 'facility' &&
                            <>
                                <div className="input-group">
                                    <label className="form-lable" htmlFor="sport_type">Facilities<span className='required-star '>*</span></label>
                                    <div className="form-group">
                                        <Controller
                                            name="facility_id"
                                            control={control}
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message: "Facilities is required",
                                                },
                                            }}
                                            render={({ field: { onChange, value }, field }) => (
                                                <Select
                                                    // closeMenuOnSelect={false}
                                                    className="controller-select"
                                                    components={animatedComponents}
                                                    defaultValue={row._id}
                                                    options={facilities}
                                                    {...field}
                                                    value={value}
                                                />
                                            )}
                                        />
                                    </div>
                                    {errors?.facility_id && (
                                        <span className="error-message">
                                            Facility is Required
                                            {/* {errors.sport_type.message} */}
                                        </span>
                                    )}
                                </div>
                                <div className="input-group">
                                    <label className="form-lable" htmlFor="type">Coupon Associated</label>
                                    <div className="form-group">
                                        <Controller
                                            name="coupon_id"
                                            control={control}
                                            render={({ field: { onChange, value }, field }) => (
                                                <Select
                                                    className="controller-select"
                                                    components={animatedComponents}
                                                    defaultValue={row._id}
                                                    options={newcouponsdata}
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </>
                        }
                        {Flyerfor?.value == 'external_link' &&
                            <>
                                <div className="input-group">
                                    <label>External link</label>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            placeholder="External link"
                                            {...register("external_link")}
                                        />
                                    </div>
                                </div>
                            </>
                        }

                        {Flyerfor?.value == 'App_Upgrade' &&
                            <>
                                <div className="input-group">
                                    <label>External link</label>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            placeholder="External link"
                                            {...register("external_link")}
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>New app version</label>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            placeholder="New app version"
                                            {...register("app_ver")}
                                        />
                                    </div>
                                </div>
                            </>
                        }

                        <div className="input-group">
                            <label className="form-lable" htmlFor="sport_type">Select Region<span className='required-star '>*</span></label>
                            <div className="form-group">
                                <Controller
                                    name="state"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "States is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value }, field }) => (
                                        <Select
                                            // closeMenuOnSelect={false}
                                            className="controller-select"
                                            components={animatedComponents}
                                            defaultValue={row._id}
                                            options={statesOptions}
                                            {...field}
                                            value={value}
                                        />
                                    )}
                                />
                            </div>
                            {errors?.state && (
                                <span className="error-message">
                                    States is Required
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label>Start Date <span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    type="date"
                                    placeholder="Start Dates"
                                    {...register("start_date", {
                                        required: {
                                            value: true,
                                            message: "Start Date is required",
                                        },
                                    })}
                                />
                            </div>
                            {errors?.start_date && (
                                <span className="error-message">
                                    Start Date is required
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label>End Date <span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    type="date"
                                    placeholder="End Date"
                                    {...register("end_date", {
                                        required: {
                                            value: true,
                                            message: "End Date is required",
                                        },
                                    })}
                                />
                            </div>
                            {errors?.end_date && (
                                <span className="error-message">
                                    End Date is required
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label>New User</label>
                            <div className="form-group">
                                <Switch
                                    onChange={handleChange}
                                    checked={checked}
                                />
                            </div>
                            {errors?.end && (
                                <span className="error-message">
                                    {/* {errors.end.message} */}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label>Number of Views<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    type="Number"
                                    placeholder="Number of Views"
                                    {...register("views", {
                                        required: {
                                            value: true,
                                            message: "Number of Views is required",
                                        },
                                    })}
                                />
                            </div>
                            {errors?.views && (
                                <span className="error-message">
                                    Number of Views is required
                                </span>
                            )}
                        </div>

                        <div className="input-group">
                            <label>Button Text<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Enter button text"
                                    {...register("btnText", {
                                        required: {
                                            value: true,
                                            message: "Button text is required",
                                        },
                                    })}
                                />
                            </div>
                            {errors?.btnText && (
                                <span className="error-message">
                                    Button text is required
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label>Force Upgrade</label>
                            <div className="form-group">
                                <Switch
                                    onChange={handleChangeForceUpgrade}
                                    checked={checkedForceUpgrade}
                                />
                            </div>
                            {errors?.end && (
                                <span className="error-message">
                                    {/* {errors.end.message} */}
                                </span>
                            )}
                        </div>
                    </div>
                    <Footer className='ant-modal-footer '>
                        <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset(); }}>Cancel</button>
                        <button type="submit" className="pi-btn-primary"> {edit ? 'Save Changes' : 'Add Event Flyers'}</button>
                    </Footer>
                </form>
            </div >
        </Modal >
    )
}
