import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { Controller, useForm } from 'react-hook-form';
import * as Constants from "../../components/apiFile/Constants";
import { createCourt, editCourt, facilityFilterAPI } from '../apiFile/Service';
import { Icon } from "@iconify-icon/react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useSelector } from 'react-redux';

interface formModal {
    name: string,
    game: any,
    type: any,
    facilityId: any,
    price_type: any,
    start_time: string,
    end_time: string,
    image: any,
    slot_size: any,
    slot_price: any,
    slots: any,
    facility_loc: any,
}

const AddCourt = ({
    onCancel,
    row,
    copy,
    open,
    edit,
    setEdit,
    getAllData,
    facilityList,
    setCopy,
    editdata,
    setEditData,
    toggle
}) => {
    const form = useForm({
        defaultValues: {
            name: "",
            game: {},
            type: {},
            facilityId: {},
            facility_loc: {},
            price_type: {},
            start_time: "",
            end_time: "",
            image: "",
            slot_size: "",
            slot_price: "",
            slots: [],
        }
    })
    const { register, handleSubmit, control, reset, formState, watch, setValue,setError } = form;
    const { errors } = formState;
    const startTime = watch('start_time');
    const endTime = watch('end_time');
    const game = watch('game');
    const courttype = watch('type');

    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)

    const customTitle = (
        <div className="custom-ant-modal-header">
            {edit == true ? copy == true ? "Add Court" : "Edit Court" : "Add Court"}
        </div>
    );
    const [filteredFacilityList, setFilteredFacilityList] = useState([])
    const [previewImage, setPreviewImage] = useState('');
    const loggedInUser = localStorage.getItem("auth");
    const closingFunctions = () => {
        toggle(!open);
        setCopy(false);
        reset();
        onCancel();
        setEdit(false);
        setPreviewImage('');
        setEditData({});
    };
    const animatedComponents = makeAnimated();

    const sportOptions = [
        { label: 'Padel', value: 'padel' },
        { label: 'Pickleball', value: 'pickleball', },
    ];
    const courtTypeOptions = [
        { label: 'Indoor', value: 'Indoor' },
        { label: 'Outdoor', value: 'Outdoor', },
    ];
    const pricingTypeOptions = [
        { label: 'Fixed', value: 'Fixed' },
        { label: 'Dynamic', value: 'Dynamic', },
    ];

    const fileURL = async (data, date) => {
        console.log(data)
        const params = {
            ACL: "public-read",
            Body: data[0],
            Bucket: `${Constants.S3_BUCKET}events`,
            Key: `${date}_offerImage_${data[0].name}`,
        };
        Constants.myBucket.upload(params, function (err, uploadData) {
            if (uploadData) {
                data = uploadData?.sport_type;
                return;
            } else {
                console.log("error", err);
            }
        });
    }

    const onSubmit = async (data: formModal) => {
        var date = Math.round(+new Date() / 1000);
        // if (data.image.length > 0) {
        //     await fileURL(data.image, date)
        //     data.image = `${Constants.BaseLink}events/${date}_offerImage_${data.image[0].name}`;
        // } else if (edit == true) {
        //     data.image = row?.image
        // } else {
        //     data.image = "NO Image Added"
        // }
        data.game = data?.game?.value
        data.type = data?.type?.value
        data.price_type = data?.price_type?.value
        data.slot_price = parseFloat(data?.slot_price)
        data.facilityId = data?.facilityId?.value
        data.slot_size = parseInt(facilityList.filter(item => item.value == data.facilityId)[0]?.slot_size)
        var response
        if (edit == false) {
            response = await createCourt(loggedInUser, data);
        } else if (edit == true && copy == true) {
            response = await createCourt(loggedInUser, data);
        }
        else {
            response = await editCourt(loggedInUser, row._id, data);
        }
        if (response.statusCode == 0) {
            toast(<ToastMessage
                body={
                    edit == true && copy == true
                        ? "Court Created Successfully"
                        : edit == true ? "Court Edited Successfully" : "Court Created Successfully"
                } type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            onSuccess();
            getAllData();
            closingFunctions();
        } else if (response.statusCode == "Court creation limit reached.") {
            toast(<ToastMessage body={response.statusCode} type="warning" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else if(response?.message == "Court already Exist."){
            setError("name", {
                type: "manual",
                message: "Court name already exists.",
            });
        }
         else {
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
        setEdit(false);
        setPreviewImage('');
        onCancel();
        getAllData();
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    useEffect(() => {
        if (edit) {
            reset({
                name: editdata?.name,
                game: { "label": capitalizeFirstLetter(editdata?.game), "value": editdata?.game },
                type: { "label": editdata?.type, "value": editdata?.type },
                facilityId: { "label": editdata?.facility?.name, "value": editdata?.facility?._id },
                facility_loc: `${editdata?.facility?.address} ${editdata?.facility?.city}`,
                price_type: { "label": editdata?.price_type, "value": editdata?.price_type },
                start_time: editdata?.start_time,
                end_time: editdata?.end_time,
                slot_price: editdata?.slot_price,
                slots: [],
            })
        } else {
            setPreviewImage('');
            setEditData({})
            reset({});
            reset({
                game: '',
                type: '',
                facilityId: '',
                price_type: '',
            });
            setEdit(false);

            if (loggedUserDetails?.roleId) {
                reset({
                    "facilityId": { "label": facilityList[0]?.label, "value": facilityList[0]?.value }
                })
            }

        }
    }, [open])

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string; // Ensure TypeScript recognizes it as a string
                setPreviewImage(result);
            };
            reader.readAsDataURL(file);

            const fileType = file.type;
            if (!fileType.startsWith('image/')) {
                event.target.value = ''; // Clear input if the selected file is not an image
            }
        }
    };
    const handleDownloadImage = () => {
        if (row.image) {
            // Create a temporary anchor element
            const anchor = document.createElement('a');
            anchor.href = row.image;
            anchor.download = 'image.jpg'; // Change the filename as needed
            anchor.click();
        }
    };

    const onSportChange = async () => {
        setValue("facilityId", "");
        let sport_type: any = watch('game')
        let court_type: any = watch('type')
        let facilityData = await facilityFilterAPI(
            loggedInUser,
            '',
            '',
            '',
            sport_type.value == undefined || sport_type.value == 'all' ? '' : sport_type.value, '',
            court_type.value == undefined || court_type.value == 'all' ? '' : court_type?.value?.toLowerCase()
        );
        if (facilityData?.statusCode == 0) {
            let faci: any = []
            if (loggedUserDetails?.roleId) {
                faci = facilityData?.result?.filter(data => data && data.value == loggedUserDetails?.facility_id)
            } else {
                faci = facilityData?.result?.filter(data => data)
            }
            setFilteredFacilityList(faci.map(data => { return ({ "label": data?.name, "location": `${data.address} ${data.city}`, "value": data?._id, "slot_size": data.slot_size }) }))
        } else {
            setFilteredFacilityList([]);
        }
    }

    useMemo(() => {
        setFilteredFacilityList(filteredFacilityList)
    }, [filteredFacilityList])

    return (
        <Modal
            title={customTitle}
            open={open}
            // onOk={onConfirm}
            width={"50%"}
            onCancel={closingFunctions}
            footer={null}
            className="custom-ant-modal lable-content-width"
        >
            <div className="form-container">
                <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-container-grid border-bottom-light">
                        <div className="input-group">
                            <label htmlFor="name" className="form-lable">Court Name<span className='required-star '>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="name"
                                    placeholder="Enter Court Name"
                                    {...register("name", {
                                        required: {
                                            value: true,
                                            message: 'Court name is required',
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
                            <label className="form-lable" htmlFor="type">Court type<span className='required-star '>*</span></label>
                            <div className="form-group">
                                <Controller
                                    name="type"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Court type is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value }, field }) => (
                                        <Select
                                            // closeMenuOnSelect={false}
                                            className="controller-select"
                                            components={animatedComponents}
                                            defaultValue={row._id}
                                            options={courtTypeOptions}
                                            {...field}
                                            onChange={(value) => {
                                                onChange(value);
                                                onSportChange();
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            {errors?.type && (
                                <span className="error-message">
                                    {errors.type.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label className="form-lable" htmlFor="game">Sport type<span className='required-star '>*</span></label>
                            <div className="form-group">
                                <Controller
                                    name="game"
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
                                            defaultValue={row._id}
                                            // defaultValue={[colourOptions[4], colourOptions[5]]}
                                            // isMulti
                                            options={sportOptions}
                                            {...field}
                                            onChange={(value) => {
                                                onChange(value);
                                                onSportChange();
                                            }}
                                            value={value}
                                        />
                                    )}
                                />
                            </div>
                            {errors?.game && (
                                <span className="error-message">
                                    {errors.game.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label className="form-lable" htmlFor="facilityId">Facility<span className='required-star '>*</span></label>
                            <div className="form-group">
                                <Controller
                                    name="facilityId"
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
                                            defaultValue={edit == true && { "label": row?.facility?.name, "location": `${row?.facility?.address} ${row?.facility?.city}`, "value": row?.facility?._id, "slot_size": row?.facility?.slot_size }}
                                            // isMulti
                                            options={loggedUserDetails?.roleId ? facilityList : filteredFacilityList}
                                            {...field}
                                            onChange={(value) => {
                                                onChange(value);
                                                let val: any = value
                                                setValue("facility_loc", val.location)
                                            }}
                                            value={value}
                                        />
                                    )}
                                />
                            </div>
                            {errors?.facilityId && (
                                <span className="error-message">
                                    {errors.facilityId.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="location">Facility Location <span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    placeholder="Enter Facility Location "
                                    {...register("facility_loc", {
                                        required: {
                                            value: true,
                                            message: "Facility Location is required",
                                        },

                                    })}
                                />
                            </div>
                            {errors?.facility_loc && (
                                <span className="error-message">
                                    {errors.facility_loc.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label className="form-lable" htmlFor="price_type">Pricing type<span className='required-star '>*</span></label>
                            <div className="form-group">
                                <Controller
                                    name="price_type"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Pricing type is required",
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
                                            options={pricingTypeOptions}
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                            {errors?.price_type && (
                                <span className="error-message">
                                    {errors.price_type.message}
                                </span>
                            )}
                        </div>



                        <div className="form-container-grid col-span-2-lg">
                            <div className="input-group">
                                <label htmlFor="start_time" className="form-lable">Court Opening Time<span className='required-star'>*</span></label>
                                <div className="form-group">
                                    <input
                                        className="form-field"
                                        type="time"
                                        id="start_time"
                                        placeholder="Start time"
                                        min={new Date().toISOString().split('T')[0]}
                                        max={endTime}
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
                                <label htmlFor="start" className="form-lable">Court Closing Time<span className='required-star'>*</span></label>
                                <div className="form-group">
                                    <input
                                        className="form-field"
                                        type="time"
                                        id="end_time"
                                        placeholder="End time"
                                        min={startTime}
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
                            <label htmlFor="slot_price" className="form-lable">Slot Price<span className='required-star '>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="number"
                                    id="slot_price"
                                    placeholder="Enter slot size"
                                    {...register("slot_price", {
                                        required: {
                                            value: true,
                                            message: 'Slot price is required',
                                        },

                                    })}
                                />
                            </div>
                            {errors?.slot_price && (
                                <span className="error-message">
                                    {errors.slot_price.message}
                                </span>
                            )}
                        </div>

                          {/* <div className="input-group">
                            <label htmlFor="image" className="form-lable">Court Image</label>
                            <div className="form-group">
                                <input
                                    type="file"
                                    accept="image/x-png,image/gif,image/jpeg"
                                    // onChange={(e) => { fileURL(e.target.files) }}
                                    {...register("image",
                                        // {
                                        //     required: {
                                        //         value: edit == true ? false : true,
                                        //         message: "Court image is required",
                                        //     },
                                        // }
                                    )}
                                    // onChange={onChange}
                                    onChange={onChange}
                                    style={{ width: "100%" }}
                                />
                            </div>
                            {errors?.image && (
                                <span className="error-message">
                                    {errors.image.message}
                                </span>
                            )}
                        </div> 
                        {(previewImage != "" || row.image) &&
                            <div className="input-group col-span-2">
                                <div className='label-pre'>
                                    <label htmlFor="myCheckbox"><strong>Image Preview</strong> </label>
                                    {(row.image && previewImage === "") && <button type="button" onClick={handleDownloadImage} className="pi-btn-primary"><div className="pi-btn-content"><Icon icon="material-symbols:download" width="16" height="16" style={{ color: "white" }} /></div></button>}

                                </div>
                                {previewImage !== "" ? <img src={previewImage} className="image-pre-court" /> : < img src={row.image} className="image-pre-court" />}
                            </div>}  */}
                    </div>
                    <Footer className='ant-modal-footer'>
                        <button type="button" className="pi-btn-secondary" onClick={closingFunctions}>Cancel</button>
                        <button type="submit" className="pi-btn-primary"> {edit == true ? copy == true ? "Add Court" : "Save Court" : "Add Court"}</button>
                    </Footer>
                </form>
            </div >
        </Modal >
    )
}

export default AddCourt




{/* <iframe width="560" height="315" src="https://www.youtube.com/embed/qyiL7-ovBCw?si=Lo3BlFJ8UtGBrm0G" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */ }