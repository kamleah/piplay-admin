import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Radio, RadioChangeEvent, Tooltip } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { Controller, useForm } from 'react-hook-form';
import * as Constants from "../../components/apiFile/Constants";
import { createCourt, createPackageAPI, editCourt, editPackageAPI, facilityFilterAPI } from '../apiFile/Service';
import { Icon } from "@iconify-icon/react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { RiDeleteBin5Fill } from 'react-icons/ri';
import moment from 'moment';
import { useSelector } from 'react-redux';

const CreatePackage = ({ visible, onCancel, row, edit, copy, facilityList, getAllData, setEdit ,setRow}) => {
    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails);
    const form = useForm({
        defaultValues: {
            facility_id: {},
            name: "",
            start_date: "",
            end_date: "",
            discount_percent: 0,
            duration: { label: '', value: '' },
            expiry: { label: '', value: '' },
            hours_included: { label: '10', value: 10 },
            extra_hours: { label: '1', value: 1 },
            sport_type: {},
            status: {},
            price: 0,
            discount: 0,
            description: [],
            custom_duration: 0,
            package_type: { label: '', value: 0 },
            total_hours: 0,
        }
    })

    const options = [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
    ];
    const [dynamicFields, setDynamicFields] = useState<any[]>([]);

    const [dataIndex, setDataIndex] = useState(1);
    const [emptynameerr, setEmptyNameErr] = useState('')
    const { register, handleSubmit, control, reset, formState, watch, setValue } = form;
    const { errors } = formState;
    const startDate = watch('start_date');
    let expiry = watch('expiry');
    let name = watch('name')
    let facility_id = watch('facility_id')
    let duration = watch('duration')
    let sport_type = watch('sport_type')
    let start_date = watch('start_date')
    let end_date = watch('end_date')
    let hours_included = watch('hours_included')
    let extra_hours = watch('extra_hours')
    let price = watch('price')
    let discount = watch('discount')
    let status = watch('status')
    let package_type = watch('package_type')
    let total_hours = watch('total_hours')

    const customTitle = (
        <div className="custom-ant-modal-header">
            {edit == true ? copy == true ? "Add Hourly Passes" : "Edit Hourly Passes" : "Add Hourly Passes"}
        </div>
    );

    const loggedInUser = localStorage.getItem("auth");
    const animatedComponents = makeAnimated();

    const sportOptions = [
        // { label: 'All', value: 'all' },
        { label: 'Padel', value: 'padel' },
        { label: 'Pickleball', value: 'pickleball', },
    ];
    const DurationOptions = [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly', },
        { label: 'Monthly', value: 'monthly', },
        { label: 'Quarterly', value: 'quarterly', },
        { label: 'Half-Quarterly', value: 'half_quarterly', },
        { label: 'Yearly', value: 'yearly', },
        { label: 'Custom', value: 'custom', },
    ];
    const StatusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Schedule', value: 'scheduled' },
        { label: 'Expired', value: 'expired' }
    ];

    const onSubmit = async (data: any) => {
        console.log('data--------------', data)
        var date = Math.ceil(+new Date() / 1000);
        let errdata = dynamicFields.filter(data => !data.name)
        console.log('errordata', errdata)
        if (errdata.length != 0) {
            console.log('=---- if')
            setEmptyNameErr('Short Description is reuired *')
            return
        } else {
            setEmptyNameErr('')
        }
        var response
        const payload: any = {
            "facility_id": data.facility_id.value,
            "name": data.name,
            "duration": data.duration.value == 'custom' ? `${data.custom_duration} Days` : data.duration.value,
            "expiry": data.expiry.value == 'yes' ? true : false,
            "start_date": data.start_date,
            "hours_included": Number(data.hours_included?.value),
            "sport_type": data.sport_type.value,
            "status": moment(data.start_date) > moment() ? "scheduled" : "active",
            "price": Math.ceil(Number(data.price)),
            "description": dynamicFields.map((item) => {
                return ({ 'name': item.name, 'active': item.active == '' ? false : item.active })
            })
        }
        console.log('payload-----------------', payload)
        if (package_type?.value == 1) {
            //Free Hours
            payload.total_minutes = Number(Number(data.hours_included.value) * 60) + (Number(data.extra_hours.value) * 60)
            payload.discount = 0
            payload.extra_hours = Number(data.extra_hours.value)
        } else if (package_type?.value == 2) {
            //Discount
            payload.total_minutes = Number(Number(data.hours_included.value) * 60)
            payload.discount = Number(data.discount)
            payload.extra_hours = 0
        }
        if (data.expiry.value == 'yes') {
            payload.end_date = data.end_date
        }else{
            payload.end_date = ""
        }
        if (edit == false) {
            response = await createPackageAPI(loggedInUser, payload);
        }
        else if (edit == true && copy == true) {
            response = await createPackageAPI(loggedInUser, payload);
        }
        else {
            response = await editPackageAPI(loggedInUser, row._id, payload);
        }
        if (response.statusCode == 0) {
            toast(<ToastMessage body={
                edit == true && copy == true
                    ? "Hourly Passes Created Successfully"
                    : edit == true ? "Hourly Passes Edited Successfully" : "Hourly Passes Created Successfully"
            } type="success" />, {
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

    const onSuccess = () => {
        reset();
        onCancel();
        setEdit(false);
        getAllData();
        setDynamicFields([]);
        setDataIndex(1);
    }

    useEffect(() => {
        setEmptyNameErr('');
        setDynamicFields([]);
        setDataIndex(1);
        let arr: any = []
        if (edit) {
            row?.description.map((data, i) => {
                arr.push({ "id": i + 1, "name": data.name, "active": data.active })
            })
            setDynamicFields(arr)
            setDataIndex(arr.length)
            reset({
                name: row?.name,
                facility_id: { "label": row?.facility_id?.name + ', ' + row?.facility_id?.address, "value": row?.facility_id?._id, "sport_type": row?.facility_id?.sport_type },
                duration: row?.duration.includes('Days') ? { label: "Custom", value: 'custom' } : DurationOptions.filter(data => data.value == row?.duration)[0],
                custom_duration: row?.duration.includes('Days') ? row?.duration.split(' ')[0] : 0,
                sport_type: sportOptions.filter(data => data.value == row?.sport_type)[0],
                expiry: row?.expiry == true ? { label: "Yes", value: 'yes' } : { label: "No", value: 'no' },
                start_date: moment(row?.start_date).format('YYYY-MM-DD'),
                end_date: moment(row?.end_date).format('YYYY-MM-DD'),
                hours_included: { label: `${row?.hours_included}`, value: row?.hours_included },
                extra_hours: { label: `${row?.extra_hours}`, value: row?.extra_hours },
                price: row?.price,
                discount: row?.discount,
                total_hours: row?.hours_included + row?.extra_hours,
                status: StatusOptions.filter(data => data.value == row?.status)[0],
                discount_percent: Math.ceil(((row?.price - row?.discount) / row?.price) * 100),
                package_type: row?.extra_hours != 0 ? { label: 'Free Hours', value: 1 } : { label: 'Discounted Price', value: 2 }
            })
        } else {
            setDynamicFields([{ id: 1, name: '', active: false }]);
            setDataIndex(1);            
            reset({});
            reset({
                "expiry": { label: "Select...", value: "" },
                "duration": { label: "Select...", value: "" },
                "hours_included": { label: "Select...", value: 5 },
                "sport_type": '',
                "facility_id": '',
                "package_type": { label: 'Select...', value: 1 },
                "extra_hours": { label: 'Select...', value: 1 }

            });
            if (loggedUserDetails?.roleId) {
                reset({
                    "facility_id": { "label": facilityList[0]?.label, "value": facilityList[0]?.value },
                    "sport_type": { "label": facilityList[0]?.sport_type, "value": facilityList[0]?.value },
                })
            }
            setRow({})
            setEdit(false);
        }

    }, [visible])

    const handleAddMore = () => {
        if (dataIndex >= dynamicFields.length) {
            const newField = {
                id: dynamicFields?.length == 0 ? 1 : dynamicFields[dynamicFields?.length - 1].id + 1,
                name: "",
                active: false
            };
            setDataIndex(dataIndex + 1);
            setDynamicFields([...dynamicFields, newField]);
        }
    };

    const handleDelete = (id) => {
        let data = dynamicFields.filter(field => field.id !== id)
        data.map((items, i) => {
            items.id = i + 1
        })
        setDynamicFields(data);
        setDataIndex(dataIndex - 1)
    };

    const handleFieldChange = (id, fieldName, value) => {
        const updatedFields = dynamicFields.map((field) =>
            field.id === id ? { ...field, [fieldName]: value } : field
        );
        setDynamicFields(updatedFields);
    };

    useMemo(() => {
        if (extra_hours) {
            setValue('total_hours', Number(hours_included?.value) + Number(extra_hours?.value))
        } else {
            setValue('total_hours', Number(hours_included?.value))
        }
    }, [hours_included, extra_hours])

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
                            <label className="form-lable" htmlFor="facility_id">Facility<span className='required-star '>*</span></label>
                            <div className="form-group">
                                <Controller
                                    name="facility_id"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Facility is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value }, field }) => (
                                        <Select
                                            // closeMenuOnSelect={false}
                                            className="controller-select"
                                            components={animatedComponents}
                                            defaultValue={row._id}
                                            // defaultValue={[colourOptions[4], colourOptions[5]]}
                                            // isMulti
                                            options={facilityList}
                                            {...field}

                                            onChange={(value) => {
                                                onChange(value);
                                                if (value.sport_type != 'all') {
                                                    setValue("sport_type", sportOptions.filter(data => value.sport_type == data.value)[0])
                                                } else {
                                                    setValue("sport_type", "")
                                                }
                                                // reset({
                                                //     'facility_loc': value.location,
                                                // })
                                            }}
                                            value={value}
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
                            <label htmlFor="name" className="form-lable">Hourly Passes Name<span className='required-star '>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="name"
                                    placeholder="Enter Hourly Passes Name"
                                    {...register("name", {
                                        required: {
                                            value: true,
                                            message: 'Hourly Passes name is required',
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
                        <div className={duration?.value == 'custom' ? 'form-container-grid col-span-2-lg' : ''}>
                            <div className="input-group">
                                <label className="form-lable" htmlFor="type">Duration<span className='required-star '>*</span>
                                    <Tooltip
                                        title={<>
                                            <div>Duration</div>
                                        </>
                                        } placement="right" color='#032037'>
                                        <Icon icon="ion:information-circle" className="input-info-icon" />
                                    </Tooltip>
                                </label>
                                <div className="form-group">
                                    <Controller
                                        name="duration"
                                        control={control}
                                        rules={{
                                            required: {
                                                value: true,
                                                message: "Duration is required",
                                            },
                                        }}
                                        render={({ field: { onChange, value }, field }) => (
                                            <Select
                                                // closeMenuOnSelect={false}
                                                className="controller-select"
                                                components={animatedComponents}
                                                defaultValue={row._id}
                                                // defaultValue={[colourOptions[4], colourOptions[5]]}
                                                // isMulti
                                                options={DurationOptions}
                                                {...field}
                                            />
                                        )}
                                    />

                                </div>
                                {errors?.duration && (
                                    <span className="error-message">
                                        {errors.duration.message}
                                    </span>
                                )}
                            </div>
                            {duration?.value == 'custom' &&
                                <div className="input-group">
                                    <label htmlFor="extra_hours" className="form-lable">Custom Duration</label>
                                    <div className="form-group">
                                        <input
                                            className="form-field"
                                            type="number"
                                            id="custom"
                                            placeholder="Enter Number of Days eg:5,10,20"
                                            {...register("custom_duration",
                                                {
                                                    required: {
                                                        value: duration?.value == 'custom' ? true : false,
                                                        message: 'Custom Duration is required',
                                                    }
                                                })}
                                        />
                                    </div>
                                    {errors?.custom_duration && (
                                        <span className="error-message">
                                            {errors.custom_duration.message}
                                        </span>
                                    )}
                                </div>}
                        </div>
                        <div className="input-group">
                            <label className="form-lable" htmlFor="sport_type">Sport Type<span className='required-star '>*</span></label>
                            <div className="form-group">
                                <Controller
                                    name="sport_type"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Sport Type is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value }, field }) => (
                                        <Select
                                            // closeMenuOnSelect={false}
                                            className="controller-select"
                                            components={animatedComponents}
                                            defaultValue={row._id}
                                            options={sportOptions}
                                            {...field}
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
                        <div className="input-group">
                            <label className="form-lable" htmlFor="sport_type">Expiry<span className='required-star'>*</span>
                                <Tooltip
                                    title={<>
                                        <div className='tooltip-line'> Yes:<div>Hourly Passes will expire on selected end date. </div></div>
                                        <div className='tooltip-line'>  No:<div>Hourly Passes will never expire.</div></div>
                                    </>
                                    } placement="right" color='#032037'>
                                    <Icon icon="ion:information-circle" className="input-info-icon" />
                                </Tooltip>
                            </label>
                            <div className="form-group">
                                <Controller
                                    name="expiry"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Expiry Type is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value }, field }) => (
                                        <Select
                                            // closeMenuOnSelect={false}
                                            className="controller-select"
                                            components={animatedComponents}
                                            defaultValue={row._id}
                                            options={[
                                                { label: "Yes", value: 'yes' },
                                                { label: "No", value: 'no' }
                                            ]}
                                            {...field}
                                            value={value}
                                        />
                                    )}
                                />
                            </div>
                            {errors?.expiry && (
                                <span className="error-message">
                                    {errors.expiry.message}
                                </span>
                            )}
                        </div>
                        <div className="form-container-grid col-span-2-lg">
                            <div className="input-group">
                                <label htmlFor="start_date" className="form-lable">Start Date <span className='required-star'>*</span></label>
                                <div className="form-group">
                                    <input
                                        className="form-field"
                                        type="date"
                                        id="start_date"
                                        placeholder="Start time"
                                        min={!edit ? new Date().toISOString().split('T')[0] : row?.start_date}
                                        {...register('start_date', {
                                            required: {
                                                value: true,
                                                message: 'Start Date is required',
                                            },
                                            onChange: (e) => {
                                                if (moment(e.target.value) > moment()) {
                                                    setValue('status', { label: 'Schedule', value: 'scheduled' })
                                                } else {
                                                    setValue('status', { label: 'Active', value: 'active' })
                                                }
                                            }
                                        })}
                                    />
                                </div>
                                {errors?.start_date && (
                                    <span className="error-message">
                                        {errors.start_date.message}
                                    </span>
                                )}
                            </div>
                            {expiry?.value == 'yes' &&
                                <div className="input-group">
                                    <label htmlFor="end_date" className="form-lable">End Date <span className='required-star'>*</span></label>
                                    <div className="form-group">
                                        <input
                                            className="form-field"
                                            type="date"
                                            id="end_date"
                                            placeholder="End Date"
                                            min={startDate}
                                            {...register('end_date',
                                                {
                                                    required: {
                                                        value: expiry?.value == 'yes' ? true : false,
                                                        message: 'end Date is required',
                                                    },
                                                })}
                                        />
                                    </div>
                                    {errors?.end_date && (
                                        <span className="error-message">
                                            {errors.end_date.message}
                                        </span>
                                    )}
                                </div>}
                        </div>
                        <div className="input-group">
                            <label className="form-lable" htmlFor="type">Standard Hours<span className='required-star '>*</span>
                                <Tooltip
                                    title={<>
                                        <div>Standard Hours</div>
                                    </>
                                    } placement="right" color='#032037'>
                                    <Icon icon="ion:information-circle" className="input-info-icon" />
                                </Tooltip>
                            </label>
                            <div className="form-group">
                                <Controller
                                    name="hours_included"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Standard hours is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value }, field }) => (
                                        <Select
                                            // closeMenuOnSelect={false}
                                            className="controller-select"
                                            components={animatedComponents}
                                            defaultValue={row._id}
                                            options={[
                                                { label: "1", value: 1 },
                                                { label: "2", value: 2 },
                                                { label: "3", value: 3 },
                                                { label: "4", value: 4 },
                                                { label: "5", value: 5 },
                                                { label: "6", value: 6 },
                                                { label: "7", value: 7 },
                                                { label: "8", value: 8 },
                                                { label: "9", value: 9 },
                                                { label: "10", value: 10 }
                                            ]}
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                            {errors?.hours_included && (
                                <span className="error-message">
                                    {errors.hours_included.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="name" className="form-lable">Hourly Passes Price<span className='required-star '>*</span>
                                <Tooltip
                                    title={<>
                                        <div>Hourly Passes Price</div>
                                    </>
                                    } placement="right" color='#032037'>
                                    <Icon icon="ion:information-circle" className="input-info-icon" />
                                </Tooltip>
                            </label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="number"
                                    // step="0.01"
                                    min="0"
                                    step="1"
                                    pattern=" 0+\.[0-9]*[1-9][0-9]*$"
                                    id="price"
                                    placeholder="Enter Hourly Passes price"
                                    {...register("price", {
                                        required: {
                                            value: true,
                                            message: 'Hourly Passes Price is required',
                                        },

                                    })}
                                />
                            </div>
                            {errors?.price && (
                                <span className="error-message">
                                    {errors.price.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label className="form-lable" htmlFor="type">Hourly Passes Type<span className='required-star '>*</span>
                                <Tooltip
                                    title={<>
                                        <div>Hourly Passes Type</div>
                                    </>
                                    } placement="right" color='#032037'>
                                    <Icon icon="ion:information-circle" className="input-info-icon" />
                                </Tooltip>
                            </label>
                            <div className="form-group">
                                <Controller
                                    name="package_type"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: package_type?.value > 0 ? false : true,
                                            message: "Hourly Passes Type is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value }, field }) => (
                                        <Select
                                            className="controller-select"
                                            components={animatedComponents}
                                            defaultValue={row._id}
                                            options={[
                                                { label: 'Free Hours', value: 1 },
                                                { label: 'Discounted Price', value: 2 },

                                            ]}
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                            {errors?.package_type && (
                                <span className="error-message">
                                    {errors.package_type.message}
                                </span>
                            )}
                        </div>
                        {package_type?.value == 1 &&
                            <>
                                <div className="input-group">
                                    <label className="form-lable" htmlFor="type">Free Hours<span className='required-star '>*</span>
                                        <Tooltip
                                            title={<>
                                                <div>Free Hours</div>
                                            </>
                                            } placement="right" color='#032037'>
                                            <Icon icon="ion:information-circle" className="input-info-icon" />
                                        </Tooltip>
                                    </label>

                                    <div className="form-group">
                                        <Controller
                                            name="extra_hours"
                                            control={control}
                                            rules={{
                                                required: {
                                                    value: package_type?.value == 1 ? true : false,
                                                    message: "Free Hours is required",
                                                },
                                            }}
                                            render={({ field: { onChange, value }, field }) => (
                                                <Select
                                                    // closeMenuOnSelect={false}
                                                    className="controller-select"
                                                    components={animatedComponents}
                                                    defaultValue={row._id}
                                                    options={[
                                                        { label: "1", value: 1 },
                                                        { label: "2", value: 2 },
                                                        { label: "3", value: 3 },
                                                        { label: "4", value: 4 },
                                                        { label: "5", value: 5 },
                                                        { label: "6", value: 6 },
                                                        { label: "7", value: 7 },
                                                        { label: "8", value: 8 },
                                                        { label: "9", value: 9 },
                                                        { label: "10", value: 10 }

                                                    ]}
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </div>
                                    {errors?.extra_hours && (
                                        <span className="error-message">
                                            {errors.extra_hours.message}
                                        </span>
                                    )}
                                </div>
                                <div className="input-group">
                                    <label htmlFor="extra_hours" className="form-lable">Total Hours
                                        <Tooltip
                                            title={<>
                                                <div>Total Hours</div>
                                            </>
                                            } placement="right" color='#032037'>
                                            <Icon icon="ion:information-circle" className="input-info-icon" />
                                        </Tooltip>
                                    </label>
                                    <div className="form-group">
                                        <input
                                            className="form-field"
                                            type="number"
                                            disabled
                                            id="total_hours"
                                            placeholder="Total Hours"
                                            {...register("total_hours")}
                                        />
                                    </div>
                                    {extra_hours?.value && <p className='pi-text'>Buy {hours_included?.value} hours get {extra_hours?.value ? extra_hours?.value : 0} hours free</p>}
                                    {!extra_hours?.value ? price && <p className='pi-text'>Users cost per session would be ₹ {price / hours_included?.value}</p> :
                                        <p className='pi-text'>Users cost per session would be ₹ {(price / (hours_included?.value + extra_hours?.value)).toFixed(2)} instead of ₹ {price / hours_included?.value}</p>}
                                </div>
                            </>
                        }
                        {package_type?.value == 2 && <>
                            <div className="input-group">
                                <label htmlFor="name" className="form-lable">Discount %<span className='required-star '>*</span>
                                    <Tooltip
                                        title={<>
                                            <div>Discount</div>
                                        </>
                                        } placement="right" color='#032037'>
                                        <Icon icon="ion:information-circle" className="input-info-icon" />
                                    </Tooltip>
                                </label>
                                <div className="form-group">
                                    <input
                                        className="form-field"
                                        type="number"
                                        id="discount_percent"
                                        placeholder="Enter discounted Percent"
                                        {...register('discount_percent', {
                                            required: {
                                                value: package_type?.value == 2 ? true : false,
                                                message: 'Discount Percent is required',
                                            },
                                            onChange: (e) => {
                                                let a = price * (e.target.value * 0.01)
                                                setValue('discount', price - a)
                                            }
                                        })}
                                    />
                                </div>
                                {errors?.discount_percent && (
                                    <span className="error-message">Discount Percent is required</span>
                                )}
                            </div>
                            <div className="input-group">
                                <label htmlFor="name" className="form-lable">Hourly Passes Price ( Discounted ) <span className='required-star '>*</span>
                                    <Tooltip
                                        title={<>
                                            <div>Hourly Passes Price (Discount)</div>
                                        </>
                                        } placement="right" color='#032037'>
                                        <Icon icon="ion:information-circle" className="input-info-icon" />
                                    </Tooltip>
                                </label>
                                <div className="form-group">
                                    <input
                                        className="form-field"
                                        type="number"
                                        id="discount"
                                        step="0.01"
                                        placeholder="Enter discounted Hourly Passes price"
                                        {...register("discount", {
                                            required: {
                                                value: package_type?.value == 2 ? true : false,
                                                message: 'Hourly Passes Discounted Price is required',
                                            },
                                            onChange: (e) => {
                                                let a = ((price - e.target.value) / price) * 100;
                                                setValue('discount_percent', Math.ceil(a))
                                            }
                                        })}
                                    />
                                </div>
                                {errors?.discount && (
                                    <span className="error-message">
                                        {errors.discount.message}
                                    </span>
                                )}
                                {discount && <p className='pi-text'>Users cost per session would be ₹ {discount / hours_included?.value} instead of ₹ {price / hours_included?.value}</p>}
                                {!discount && <p className='pi-text'>Users cost per session would be ₹ {price / total_hours}</p>}
                            </div>
                        </>
                        }
                    </div>
                    <div className="side-line-heading">
                        <hr className="side-line" />
                        <span className="side-line-text">Add Descriptions</span>
                    </div>
                    {dynamicFields.map((curEle, index) => {
                        return (
                            <>
                                <>
                                    <div className="form-container-grid-col3 border-bottom-light">
                                        <div className="input-group">
                                            <label htmlFor="name" className="form-lable">Short Description {index + 1} <span className='required-star '>*</span>
                                                <Tooltip
                                                    title={<>
                                                        <div>Short Description</div>
                                                    </>
                                                    } placement="right" color='#032037'>
                                                    <Icon icon="ion:information-circle" className="input-info-icon" />
                                                </Tooltip>
                                            </label>
                                            <div className="form-group">
                                                <input
                                                    className="form-field"
                                                    type="text"
                                                    id="discount"
                                                    placeholder="Enter description"
                                                    defaultValue={dynamicFields[curEle.id - 1]?.name}
                                                    onChange={(e) =>
                                                        handleFieldChange(
                                                            curEle.id,
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={(e) => {
                                                        if (!e.target.value) {
                                                            setEmptyNameErr("Short Description is required");
                                                        } else if (e.target.value) {
                                                            setEmptyNameErr("");
                                                        }
                                                    }}
                                                />
                                            </div>

                                        </div>
                                        <div className="flex-center">
                                            <Radio.Group
                                                options={options}
                                                value={options.filter(data => dynamicFields[curEle.id - 1]?.active === data.value)[0]?.value}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        curEle.id,
                                                        "active",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        {dynamicFields.length > 1 ?
                                            <div className="flex-center-end">
                                                <button type='reset' onClick={(e) => { handleDelete(curEle.id) }} className='action-button delete-button'>
                                                    <RiDeleteBin5Fill title="Delete" />
                                                </button>
                                            </div> :
                                            <div className="flex-center-end">
                                            </div>
                                        }
                                    </div>
                                </>
                            </>
                        )
                    })}
                    {emptynameerr && (
                        <span className="error-message form-container-grid-col3">
                            {emptynameerr}
                        </span>
                    )}
                    <div className="det-icon">
                        <div className="add-more">
                            <button
                                type="button"
                                className="ad-btn"
                                onClick={handleAddMore}
                            >
                                <Icon icon="mdi:add" className="add-icon" />
                                Add More
                            </button>
                        </div>
                    </div>
                    <Footer className='ant-modal-footer '>
                        <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset(); }}>Cancel</button>
                        <button type="submit" className="pi-btn-primary"> {edit == true ? copy == true ? "Add Hourly Passes" : "Save Hourly Passes" : "Add Hourly Passes"}</button>
                    </Footer>
                </form>
            </div >
        </Modal >
    )
}

export default CreatePackage




{/* <iframe width="560" height="315" src="https://www.youtube.com/embed/qyiL7-ovBCw?si=Lo3BlFJ8UtGBrm0G" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */ }