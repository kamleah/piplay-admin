import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { Controller, useForm } from 'react-hook-form';
import JoditEditor from "jodit-react";
import { Icon } from "@iconify-icon/react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useSelector } from 'react-redux';
import languageList from '../Languages/Languages';
import { editCoach } from '../apiFile/Service';
import * as Constants from "../../components/apiFile/Constants";

interface formModal {
    name: string,
    languages: any,
    days: any,
    start_time: string,
    end_time: string,
    mobileno: any,
    email: string,
    experience: any,
    sport_type: any,
    signature_shot: string,
    video: any,
    city: any,
    venues: any,
    image: any,
    bio: string,
    extra_info: string,
    approved: boolean
}

export default function AddCoachApproval({ visible, onCancel, row, edit, facilityList, setRow, setEdit, getAllData }) {
    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails);
    const loggedInUser = localStorage.getItem("auth");    
    const animatedComponents = makeAnimated();
    const editor = useRef(null);
    const [bio, setBio] = useState("")
    const [checkBio, setCheckBio] = useState(false)
    const [facility, setfacility] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [citiesList, setCitiesList] = useState([]);
    const [extraInfo, setExtraInfo] = useState("")
    const [checkExtraInfo, setCheckExtraInfo] = useState(false)
    const form = useForm({
        defaultValues: {
            name: "",
            languages: [],
            days: [],
            start_time: "",
            end_time: "",
            mobileno: "",
            email: "",
            experience: 0,
            sport_type: [],
            signature_shot: "",
            video: "",
            city: [],
            venues: {},
            image: "",
            bio: "",
            extra_info: "",
            approved: false,
            coach_level: "",
            certification: "",
            session_in_last_two_months: "",
            qualification: "",
            mobile: "",
            attachments: "",
            years_of_exp: 0,
            references: "",
            name_: "",
            approvedBy: ""
        }
    })
    const { register, handleSubmit, control, reset, setValue, formState, watch } = form;

    const { errors } = formState;
    const endTime = watch('end_time');
    const startTime = watch('start_time');
    const customTitle = (
        <div className="custom-ant-modal-header">
            {edit ? 'Coaches Approval' : 'Add Coach'}
        </div>
    );
    const weekdaysOptions: any = [
        { value: 1, label: "Monday" },
        { value: 2, label: "Tuesday" },
        { value: 3, label: "Wednesday" },
        { value: 4, label: "Thursday" },
        { value: 5, label: "Friday" },
        { value: 6, label: "Saturday" },
        { value: 7, label: "Sunday" }
    ];
    const sportOptions = [
        { label: 'Padel', value: 'Padel' },
        { label: 'Pickleball', value: 'Pickleball', },
    ];


    useEffect(() => {
        // getCities();
        // getLanguages();
        if (edit == true) {
            console.log('row------------', row)
            setBio(row.bio);
            setExtraInfo(row.extra_info);
            reset({
                "name": row.name,
                "languages": row?.languages?.map(data => {
                    return { "label": data, "value": data }
                }),
                "days": row.days?.map(data => {
                    return data || "Select...";
                }),
                "start_time": row?.start_time,
                "end_time": row?.end_time,
                "mobileno": row?.mobileno,
                "email": row.email,
                "experience": 0,
                "sport_type": row.sport_type?.map(data => {
                    return { "label": data, "value": data }
                }),
                "signature_shot": row.signature_shot,
                "video": row.video,
                "city": row?.city?.map(data => {
                    return { "label": data, "value": data }
                }),
                "venues": row?.venues?.map(data => {
                    return { "label": data?.name, "value": data._id }
                }),
                "bio": row.bio,
                "extra_info": row.extra_info,
                "image": row?.image,
                "attachments": row?.attachments,
                "coach_level": row?.coach_level,
                "certification": row?.certification,
                "session_in_last_two_months": row?.session_in_last_two_months,
                "qualification": row?.qualification,
                "years_of_exp": Number(row?.years_of_exp),
            })
        } else {
            setBio("");
            setExtraInfo("");
            reset({});
            setRow({})
            setPreviewImage('')
            reset({
                name: "",
                languages: [],
                days: [],
                start_time: "",
                end_time: "",
                mobileno: "",
                email: "",
                experience: 0,
                sport_type: [],
                signature_shot: "",
                video: "",
                city: [],
                venues: [],
                image: "",
                bio: "",
                extra_info: ""
            });
            if (loggedUserDetails?.roleId) {
                reset({
                    "venues": { "label": facilityList[0]?.label, "value": facilityList[0]?.value }
                })
            }
        }
    }, [visible])
    const handleDownloadImage = () => {
        if (row.image) {
            // Create a temporary anchor element
            const anchor = document.createElement('a');
            anchor.href = row.image;
            anchor.download = 'image.jpg'; // Change the filename as needed
            anchor.click();
        }
    };

    const handleDownloadattachmentImage = () => {
        if (row?.attachments) {
            row?.attachments.map((data) => {
                console.log('data--------', data)
                // Create a temporary anchor element
                const anchor = document.createElement('a');
                anchor.href = data;
                anchor.download = 'image.jpg'; // Change the filename as needed
                anchor.click();
            })

        }
    };

    const attachments = Array.isArray(row?.attachments) ? row.attachments : [];
    const references = Array.isArray(row?.references) ? row.references : [];


    const onApprove = () => {
        setValue('approved', true);
        handleSubmit((data) => {
            console.log('Approved:', data);
        })();
    };

    const onDisapprove = () => {
        setValue('approved', false);
        handleSubmit((data) => {
            console.log('Disapproved:', data);
        })();
    };

    const fileURLVideo = async (data, date) => {
        console.log(data);
        const params = {
            ACL: "public-read",
            Body: data[0],
            Bucket: `${Constants.S3_BUCKET}events`, // Adjust the bucket name as needed
            Key: `${date}_offerVideo_${data[0].name}`, // Adjust the key as needed
        };

        try {
            const uploadData = await Constants.myBucket.upload(params).promise();
            if (uploadData) {
                console.log("Video uploaded successfully:", uploadData.Location);
                // Do something with the uploaded video URL, if needed
                return uploadData.Location;
            }
        } catch (error) {
            console.log("Error uploading video:", error);
            // Handle error appropriately
        }
    }

    const onSubmit = async (data) => {
        var date = Math.round(+new Date() / 1000);
        data.languages = data.languages?.map((item: any) => item.value)
        data.venues = data.venues?.map((item: any) => item.value)
        data.city = data.city?.map((item: any) => item.value)
        data.sport_type = data.sport_type?.map((item: any) => item.value)
        data.mobileno = parseInt(data?.mobileno)
        data.session_in_last_two_months = Number(data?.session_in_last_two_months)
        data.years_of_exp = Number(row?.years_of_exp)
        data.approvedBy = loggedUserDetails?._id
        if (data.video.length > 0) {
            await fileURLVideo(data.video, date)
            data.video = `${Constants.BaseLink}events/${date}_offerVideo_${data.video[0].name}`;
        } else if (edit == true) {
            data.video = row.video
        } else {
            data.video = "NO Video Added"
        }
        var response;
        if (edit == true) {
            data.user_id = row?.user_id
            response = await editCoach(loggedInUser, row._id, data);
        }
        if (response.statusCode == 0) {
            toast(<ToastMessage body={row._id ?
                data.approved == true ? "Coach Approved Successfully" : "Coach Disapproved Successfully"
                : "Coaches Approval Added Successfully"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            reset();
            onCancel();
            getAllData();
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
    }



    return (
        <div>
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
                        <div className="form-container-grid border-bottom-light">
                            <div className="input-group">
                                <label htmlFor="name" className="form-lable">Coach name<span className='required-star '>*</span></label>
                                <div className="form-group">
                                    <input
                                        className="form-field"
                                        type="text"
                                        id="name"
                                        placeholder="Enter coach name"
                                        {...register('name', {
                                            required: {
                                                value: true,
                                                message: 'Coach name is required',
                                            },
                                            pattern: {
                                                value: /^[^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*$/,
                                                message: 'Please enter a valid name with at least three alphabet characters',
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
                                <label htmlFor="languages" className="form-lable">Languages<span className='required-star '>*</span></label>
                                <div className="form-group">
                                    <Controller
                                        name="languages"
                                        control={control}
                                        rules={{
                                            required: {
                                                value: true,
                                                message: "Languages is required",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <Select
                                                closeMenuOnSelect={false}
                                                className="controller-select"
                                                components={animatedComponents}
                                                // defaultValue={[colourOptions[4], colourOptions[5]]}
                                                isMulti
                                                options={languageList}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                                {errors?.languages && (
                                    <span className="error-message">
                                        {errors.languages.message}
                                    </span>
                                )}
                            </div>
                            <div className="input-group">

                                <label htmlFor="days">Days<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <Controller
                                        name="days"
                                        control={control}
                                        rules={{
                                            required: {
                                                value: true,
                                                message: "Days are required",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <Select
                                                closeMenuOnSelect={false}
                                                className="controller-select"
                                                components={animatedComponents}
                                                // defaultValue={[colourOptions[4], colourOptions[5]]}
                                                isMulti
                                                options={weekdaysOptions}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                                {errors?.days && (
                                    <span className="error-message">
                                        {errors.days.message}
                                    </span>
                                )}
                            </div>

                            <div className="form-container-grid col-span-2-lg">
                                <div className="input-group">
                                    <label htmlFor="start_time" className="form-lable">Start time <span className='required-star'>*</span></label>
                                    <div className="form-group">
                                        <input
                                            className="form-field"
                                            type="time"
                                            id="start_time"
                                            placeholder="Start Time"
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
                                    <label htmlFor="start_time" className="form-lable">End time <span className='required-star'>*</span></label>

                                    <div className="form-group">
                                        <input
                                            className="form-field"
                                            type="time"
                                            id="end_time"
                                            placeholder="End Time"
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
                                <label htmlFor="mobileno">Phone Number<span className='required-star'>*</span></label>
                                <div className="form-group">

                                    <input
                                        className="form-field"
                                        type="number"
                                        id="mobileno"
                                        placeholder="Enter phone number"
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
                                <label htmlFor="pincode" className="form-lable">Email ID</label>
                                <div className="form-group">
                                    <input
                                        className="form-field"
                                        type="text"
                                        id="email"
                                        placeholder="Enter email"
                                        {...register('email', {
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                                message: 'Enter a valid email address',
                                            },

                                        })}
                                    />

                                </div>
                                {errors?.email && (
                                    <span className="error-message">
                                        {errors.email.message}
                                    </span>
                                )}
                            </div>

                            {/* <div className="input-group">
                                   <label htmlFor="pincode" className="form-lable">Experience<span className='required-star '>*</span>
                                   </label>
                                   <div className="form-group">
                                        <input
                                             className="form-field"
                                             type="text"
                                             id="button_text"
                                             placeholder="Enter experience e.g. 12, 12.5"
                                             {...register('experience', {
                                                  required: {
                                                       value: true,
                                                       message: 'Experience year is required',
                                                  },
                                                  pattern: {
                                                       value: /^\d{1,2}(\.\d)?$/,
                                                       message: 'Please enter a valid experience of year e.g. 12, 12.5',
                                                  }
                                             })}
                                             style={{ borderColor: errors?.experience ? 'red' : 'initial' }}
                                        />
                                   </div>
                                   {errors?.experience && (
                                        <span className="error-message">
                                             {errors.experience.message}
                                        </span>
                                   )}
                              </div> */}

                            <div className="input-group">
                                <label className="form-lable" htmlFor="sport_type">Sport type<span className='required-star '>*</span></label>
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
                                        render={({ field }) => (
                                            <Select
                                                closeMenuOnSelect={false}
                                                className="controller-select"
                                                components={animatedComponents}
                                                defaultValue={row._id}
                                                isMulti
                                                options={sportOptions}
                                                onChange={(selectedOptions) => {
                                                    field.onChange(selectedOptions); // Update react-hook-form state
                                                    // onSportTypeChange(selectedOptions);
                                                }}
                                                value={field.value} // Ensure the value is passed from react-hook-form
                                                name={field.name} // Ensure the name is passed from react-hook-form
                                                ref={field.ref}
                                            // {...field}
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

                                <label className="form-lable" htmlFor="venues">Facility<span className='required-star '>*</span></label>
                                <div className="form-group">
                                    <Controller
                                        name="venues"
                                        control={control}
                                        rules={{
                                            required: {
                                                value: true,
                                                message: "Facility is required",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <Select
                                                closeMenuOnSelect={false}
                                                className="controller-select"
                                                components={animatedComponents}
                                                // defaultValue={row._id}
                                                // defaultValue={[colourOptions[4], colourOptions[5]]}
                                                isMulti
                                                options={facility}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                                {errors?.venues && (
                                    <span className="error-message">
                                        {errors.venues.message}
                                    </span>
                                )}
                            </div>
                            <div className="input-group">
                                <label htmlFor="name" className="form-lable">Coach level<span className='required-star '>*</span></label>
                                <div className="form-group">
                                    <input
                                        className="form-field"
                                        type="text"
                                        id="coach_level"
                                        placeholder="Enter Coach Level"
                                        {...register('coach_level')}
                                    />
                                </div>                               
                            </div>
                            <div className="input-group">
                                <label htmlFor="name" className="form-lable">Certification<span className='required-star '>*</span></label>
                                <div className="form-group">
                                    <input
                                        className="form-field"
                                        type="text"
                                        id="coach_level"
                                        placeholder="Enter Certification"
                                        {...register('certification')}
                                    />
                                </div>                                
                            </div>
                            <div className="input-group">
                                <label htmlFor="name" className="form-lable">Year of Experience<span className='required-star '>*</span></label>
                                <div className="form-group">
                                    <input
                                        className="form-field"
                                        type="number"
                                        id="years_of_exp"
                                        placeholder="Enter Year of Experience"
                                        {...register('years_of_exp')}
                                    />
                                </div>                                
                            </div>
                            <div className="input-group">
                                <label htmlFor="name" className="form-lable">Session In last Two Months<span className='required-star '>*</span></label>
                                <div className="form-group">
                                    <input
                                        className="form-field"
                                        type="number"
                                        id="session_in_last_two_months"
                                        placeholder="Enter Session In last Two Months"
                                        {...register('session_in_last_two_months')}
                                    />
                                </div>                                
                            </div>
                            <div className="input-group">
                                <label htmlFor="myCheckbox">Attachments</label>
                                {attachments.map((attachment, index) => (
                                    <div className="form-group" style={{ marginBottom: '10px' }}>
                                        <a
                                            key={index} // Ensure each element has a unique key
                                            onClick={handleDownloadattachmentImage}
                                            {...register("attachments")}
                                            href={attachment}
                                            rel="noopener noreferrer"
                                        >
                                            Attachment {index + 1}
                                        </a>
                                    </div>
                                ))}
                            </div>
                            <div className="input-group col-span-2-sm">
                                <label htmlFor="pincode" className="form-lable">Coach Video</label>
                                <div className="form-group">
                                    <input
                                        type="file"
                                        accept="video/mp4,video/x-m4v,video/*"
                                        // onChange={(e) => { fileURL(e.target.files) }}
                                        {...register("video")}
                                        // onChange={onChange}
                                        // onChange={onChangeVideo}
                                        style={{ width: "100%" }}
                                    />
                                </div>                                
                            </div>
                            <div className="input-group">
                                <label htmlFor="name" className="form-lable">Qualification<span className='required-star '>*</span></label>
                                <div className="form-group">
                                    <input
                                        className="form-field"
                                        type="text"
                                        id="qualification"
                                        placeholder="Enter Qualification"
                                        {...register('qualification')}
                                    />
                                </div>                                
                            </div>                            
                            <div className="input-group">
                                <label htmlFor="city" className="form-lable">Cities<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <Controller
                                        name="city"
                                        control={control}
                                        rules={{
                                            required: {
                                                value: true,
                                                message: "City is required",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <Select
                                                closeMenuOnSelect={false}
                                                className="controller-select"
                                                components={animatedComponents}
                                                // defaultValue={[colourOptions[4], colourOptions[5]]}
                                                isMulti
                                                options={citiesList}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                                {errors?.city && (
                                    <span className="error-message">
                                        {errors.city.message}
                                    </span>
                                )}
                            </div>

                            <div className="input-group">
                                <label htmlFor="pincode" className="form-lable">Coach Image<span className='required-star '>*</span></label>
                                <div className="form-group">
                                    <input
                                        type="file"
                                        accept="image/x-png,image/gif,image/jpeg"
                                        // onChange={(e) => { fileURL(e.target.files) }}
                                        {...register("image", {
                                            required: {
                                                value: edit == true ? false : true,
                                                message: "Coach image is required",
                                            },
                                        })}
                                        // onChange={onChange}
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
                                    {previewImage !== "" ? <img src={previewImage} className="image-pre" /> : < img src={row.image} className="image-pre" />}
                                </div>}
                            {/* {(previewImage != "" || row.image) &&
                            <div className="input-group">
                                <label htmlFor="myCheckbox">Image Preview (App event detail)</label>
                                {previewImage !== "" ? <img src={previewImage} className="image-preview-app-detail" /> : < img src={row.image} className="image-preview-app-detail" />}
                            </div>} */}
                            <div className="input-group col-span-2-lg">
                                <label htmlFor="bio" className="form-lable">Bio<span className='required-star '>*</span></label>
                                <div className="">
                                    <JoditEditor
                                        ref={editor}
                                        value={bio}
                                        onChange={(value) => {
                                            setBio(value);
                                            // if (getCharCount(value) <= 0 || value === "") {
                                            //     setCheckBio(true)
                                            // } else {
                                            //     setCheckBio(false)
                                            // }
                                        }}
                                    />
                                </div>
                                {checkBio && (
                                    <span className="error-message">
                                        Bio is rquired
                                    </span>
                                )}
                            </div>
                            <div className="input-group col-span-2-lg">
                                <label htmlFor="extra_info" className="form-lable">Extra Info<span className='required-star '>*</span></label>
                                <div className="">
                                    <JoditEditor
                                        ref={editor}
                                        value={extraInfo}
                                        onChange={(value) => {
                                            setExtraInfo(value);
                                            // if (getCharCount(value) <= 0 || value === "") {
                                            //     setCheckExtraInfo(true)
                                            // } else {
                                            //     setCheckExtraInfo(false)
                                            // }
                                        }}
                                    />
                                </div>
                                {checkExtraInfo && (
                                    <span className="error-message">
                                        Extra Info is rquired
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="side-line-heading">
                            <hr className="side-line" />
                            <span className="side-line-text">Add Refrence Details Below</span>
                        </div>

                        {references?.map((data, index) => (
                            <div className="form-container-grid border-bottom-light">
                                <div className="input-group">
                                    <label htmlFor="name" className="form-lable">Name {index + 1}<span className='required-star '>*</span></label>
                                    <div className="form-group">
                                        <label htmlFor="">{data?.name}</label>
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="name" className="form-lable">Phone Number {index + 1}<span className='required-star '>*</span></label>
                                    <div className="form-group">
                                        <label htmlFor="">{data?.mobile}</label>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Footer className='ant-modal-footer'>
                            <button type="submit" className="pi-btn-primary" onClick={onApprove}>Approve</button>
                            <button type="submit" className="pi-btn-primary" onClick={onDisapprove}>Disapprove</button>
                            <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset(); }}>Cancel</button>
                        </Footer>
                    </form>
                </div >
            </Modal >
        </div>
    )
}
