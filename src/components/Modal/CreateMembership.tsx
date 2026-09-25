import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Radio, RadioChangeEvent, Tooltip } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { Controller, useForm } from 'react-hook-form';
import { Icon } from "@iconify-icon/react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { RiDeleteBin5Fill } from 'react-icons/ri';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { createMembershipAPI, editMembershipAPI } from '../apiFile/Service';

export default function CreateMembership({ visible,copy, onCancel, row, edit, facilityList, getAllData, setEdit }) {
    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails);
    const { register, handleSubmit, control, reset, formState: { errors }, watch, setValue } = useForm();
    const [dynamicFields, setDynamicFields] = useState<any[]>([]);
    const [emptynameerr, setEmptyNameErr] = useState('')
    const [dataIndex, setDataIndex] = useState(1);
    const animatedComponents = makeAnimated();
    let duration = watch('duration')
    let discount = watch('discount')
    let total_hours = watch('total_hours')
    let expiry = watch('expiry');
    let package_type = watch('package_type')
    const startDate = watch('start_date');
    let hours_included = watch('hours_included')
    let extra_hours = watch('extra_hours')
    let price = watch('price')
    const customTitle = (
        <div className="custom-ant-modal-header">
            {edit == true ? copy == true ? "Add New MemberShip" : "Edit MemberShip" : "Add New MemberShip"}
        </div>
    );
    const loggedInUser = localStorage.getItem("auth");
    const sportOptions = [
        // { label: 'All', value: 'all' },
        { label: 'Padel', value: 'padel' },
        { label: 'Pickleball', value: 'pickleball', },
    ];
    const StatusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Schedule', value: 'scheduled' },
        { label: 'Expired', value: 'expired' }
    ];
    const options = [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
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
    const handleDelete = (id) => {
        let data = dynamicFields.filter(field => field.id !== id)
        data.map((items, i) => {
            items.id = i + 1
        })
        setDynamicFields(data);
        setDataIndex(dataIndex - 1)
    };
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
    const handleFieldChange = (id, fieldName, value) => {
        const updatedFields = dynamicFields.map((field) =>
            field.id === id ? { ...field, [fieldName]: value } : field
        );
        setDynamicFields(updatedFields);
    };

    const calculateExpiryDate = (duration) => {
        const currentDate = moment(); // Get the current date
        if (duration.includes('Days') == true) {
            return currentDate.add(duration.toLowerCase().split(' ')[0], "days").format('YYYY-MM-DD')
        } else {
            switch (duration.toLowerCase()) {
                case 'daily':
                    return currentDate.add(1, 'days').format('YYYY-MM-DD');
                case 'weekly':
                    return currentDate.add(1, 'weeks').format('YYYY-MM-DD');
                case 'monthly':
                    return currentDate.add(1, 'months').format('YYYY-MM-DD');
                case "quarterly":
                    return currentDate.add(3, 'months').format('YYYY-MM-DD');
                case 'half_quarterly':
                    return currentDate.add(6, 'months').format('YYYY-MM-DD');
                case 'yearly':
                    return currentDate.add(1, 'years').format('YYYY-MM-DD');
                default:
                    return currentDate
            }
        }
    };

    const onSubmit = async (data: any) => {
        let errdata = dynamicFields.filter(data => !data.name)
        if (errdata.length != 0) {
            setEmptyNameErr('Short Description is reuired *')
            return
        } else {
            setEmptyNameErr('')
        }
        var response
        const payload: any = {
            "facility_id": data?.facility_id?.value,
            "name": data?.name,
            "duration": data?.duration?.value == 'custom' ? `${data?.custom_duration} Days` : data?.duration?.value,
            "expiry": data?.expiry?.value == 'yes' ? true : false,
            "start_date": data?.start_date,
            "sport_type": data?.sport_type?.value,
            "status": moment(data.start_date) > moment() ? "scheduled" : "active",
            "price": Math.ceil(Number(data.price)),
            "description": dynamicFields.map((item) => {
                return ({ 'name': item.name, 'active': item.active == '' ? false : item.active })
            })
        }
        let expiry = calculateExpiryDate(payload.duration);
        let number_of_days = moment(expiry).diff(moment(), 'days');
        payload.number_of_days = Number(number_of_days + 1);
        payload.discount = Number(data.discount);
        if (data.expiry.value == 'yes') {
            payload.end_date = data.end_date
        }
        if (edit == false) {
            response = await createMembershipAPI(loggedInUser, payload);
        } 
        else if (edit == true && copy == true) {
            response = await createMembershipAPI(loggedInUser, payload);
        }
        else {
            response = await editMembershipAPI(loggedInUser, row._id, payload);
        }
        if (response.statusCode == 0) {
            toast(<ToastMessage body={
                edit == true && copy == true
                    ? "MemberShip Created Successfully"
                    : edit == true ? "MemberShip Edited Successfully" : "MemberShip Created Successfully"
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
        getAllData()
        setEdit(false);
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
                price: row?.price,
                discount: row?.discount,
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
            // setRow({})
            // setEdit(false);
        }

    }, [visible])

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
                            <label className="form-lable" htmlFor="facility_id">Facility Name<span className='required-star '>*</span></label>
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
                                    Facility is required
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="name" className="form-lable">Membership Name<span className='required-star '>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="name"
                                    placeholder="Enter Membership Name"
                                    {...register("name", {
                                        required: {
                                            value: true,
                                            message: 'Membership name is required',
                                        },

                                    })}
                                />
                            </div>
                            {errors?.name && (
                                <span className="error-message">
                                   Membership name is required
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
                                        Duration is required
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
                                            Custom Duration is required
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
                                   Sport Type is required
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label className="form-lable" htmlFor="sport_type">Expiry<span className='required-star'>*</span>
                                <Tooltip
                                    title={<>
                                        <div className='tooltip-line'> Yes:<div>Package will expire on selected end date. </div></div>
                                        <div className='tooltip-line'>  No:<div>Package will never expire.</div></div>
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
                                    Expiry Type is required
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
                                        Start Date is required
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
                                                        message: 'End Date is required',
                                                    },
                                                })}
                                        />
                                    </div>
                                    {errors?.end_date && (
                                        <span className="error-message">
                                           End Date is required
                                        </span>
                                    )}
                                </div>}
                        </div>
                        <div className="input-group">
                            <label htmlFor="name" className="form-lable">Membership Price<span className='required-star '>*</span>
                                <Tooltip
                                    title={<>
                                        <div>Membership Price</div>
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
                                    placeholder="Enter Membership price"
                                    {...register("price", {
                                        required: {
                                            value: true,
                                            message: 'Membership Price is required',
                                        },

                                    })}
                                />
                            </div>
                            {errors?.price && (
                                <span className="error-message">
                                   Membership Price is required
                                </span>
                            )}
                        </div>
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
                            <label htmlFor="name" className="form-lable">Membership Price ( Discounted ) <span className='required-star '>*</span>
                                <Tooltip
                                    title={<>
                                        <div>Membership Price (Discount)</div>
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
                                    placeholder="Enter discounted Membership price"
                                    {...register("discount", {
                                        required: {
                                            value: true,
                                            message: 'Membership Discounted Price is required',
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
                                    {/* {errors.discount.message} */}
                                </span>
                            )}

                        </div>
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
                        <button type="submit" className="pi-btn-primary"> {edit == true ? copy == true ? "Add MemberShip" : "Save MemberShip" : "Add MemberShip"}</button>
                    </Footer>
                </form>
            </div >
        </Modal >
    )
}
