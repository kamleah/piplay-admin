import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { useForm } from 'react-hook-form';
import { TournamentFilterAPI, createBannerAPI, getActiveOffer, getAllCoaches, getAllCoachingProgram, getAllTournamentsAPI, getFacilityApi, getUpcomingEventList } from '../apiFile/Service';
import { EditBanners } from '../apiFile/Service';
import * as Constants from "../../components/apiFile/Constants";
import { Icon } from "@iconify-icon/react";


const AddBanners = ({ visible, name, onConfirm, row, getAllBanner, edit, editdata, setEditData, setvisible, setEdit }) => {
    const form = useForm({
        defaultValues: {
            title: "",
            sub_title: "",
            image: "",
            redirect_url: "",
            button_text: "",
            url_type: "",
            active: "",
            position: "",
            start: "",
            end: "",
            benefits: "",
            screen: "",
        }
    })
    const editor = useRef(null);
    const { register, handleSubmit, reset, formState, watch } = form;
    let startdate = watch('start')
    let enddate = watch('end')
    let URLtype = watch('url_type')
    let screen = watch('screen')
    const { errors } = formState;
    const [data, setData] = useState([])
    const [benefits, setBenefits] = useState("")
    const [previewImage, setPreviewImage] = useState('');
    const [subScreensList, setSubScreensList] = useState([]);


    const customTitle = (
        <div className="custom-ant-modal-header">
            {row._id ? 'Edit Banner' : 'Add Banner'}
        </div>
    );

    const loggedInUser = localStorage.getItem("auth");
    const onCancel = () => {
        setEditData({})
        setPreviewImage('')
        setvisible(false);
        setEdit(false)
    }

    const fileURL = async (data, date) => {
        const params = {
            ACL: "public-read",
            Body: data[0],
            Bucket: `${Constants.S3_BUCKET}events`,
            Key: `${date}_bannerImage_${data[0].name}`,
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

    const onSubmit = async (data: any) => {
        data.screen = data.url_type == "external" ? undefined : data.screen;
        const start_date: any = new Date(data?.start);
        const end_date: any = new Date(data?.end);
        const main_date = end_date - start_date;
        if (main_date <= 0) {
            toast(<ToastMessage body={"Banner can't end before start time"} type="warning" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        data.position = Number(data.position)
        data.benefits = "benefit"
        data.button_text = "benefit"
        data.sub_title = "benefit"
        data.active = data.active == 'active' ? true : false
        var date = Math.round(+new Date() / 1000);
        if (typeof data.image != 'string') {
            await fileURL(data.image, date)
            data.image = `${Constants.BaseLink}events/${date}_bannerImage_${data.image[0].name}`;
        } else {
            if (edit == true) {
                data.image = editdata.image
            } else {
                data.image = "No Image Added"
            }
        }
        var response
        if (edit == true) {
            response = await EditBanners(loggedInUser, editdata._id, data);
            console.log("edit")
            // data.mobileno = row.mobileno;
        } else {
            response = await createBannerAPI(loggedInUser, data);
        }
        console.log(response)
        if (response.code == 'SUCCESS' || response.code == 'SIGNUP_SUCCESS') {
            getAllBanner();
            setPreviewImage('')
            toast(<ToastMessage body={row._id ? "Banner Updated Successfully" : "Banner Added Successfully"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            reset();
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
    }



    useMemo(() => {
        // console.log(row)

        reset({
            "title": row.title,
            "sub_title": row.sub_title,
            "image": row.image,
            "redirect_url": row.redirect_url,
            "button_text": row.button_text,
            "url_type": row.url_type,
            "active": row.active == true ? 'active' : 'inactive',
            "position": row.position,
            "start": row?.start,
            "end": row?.end,
            screen: row?.screen
        })

    }, [visible])
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
        if (editdata.image) {
            // Create a temporary anchor element
            const anchor = document.createElement('a');
            anchor.href = editdata.image;
            anchor.download = 'image.jpg'; // Change the filename as needed
            anchor.click();
        }
    };

    const getScreensList = async (selectedScreen: any) => {
        switch (selectedScreen) {
            case "Facility":
                let facility_response = await getFacilityApi(loggedInUser);
                setSubScreensList(facility_response?.result);
                break;
            case "Event":
                let response = await getUpcomingEventList(loggedInUser);
                let newResponse = response?.result?.map((data: any) => ({
                    ...data,
                    name: data.tournament_name
                })) || [];
                setSubScreensList(newResponse);
                break
            case "Coach":
                let coach_response = await getAllCoaches(loggedInUser);
                setSubScreensList(coach_response.result);
                break
            case "OurCoachingPrograms":
                let our_coach_program_response = await getAllCoachingProgram(loggedInUser);
                let new_our_coach_program_response = our_coach_program_response?.result?.map((data: any) => ({
                    ...data,
                    name: data.title
                })) || [];
                setSubScreensList(new_our_coach_program_response);
                break
            case "Promotions":
                let active_offer_response = await getActiveOffer(loggedInUser);
                let new_active_offer_response = active_offer_response?.data?.map((data: any) => ({
                    ...data,
                    name: data.title
                })) || [];
                setSubScreensList(new_active_offer_response);
                break
            default:
                setSubScreensList([]);
                break;
        }
    };

    useEffect(() => {
        if (screen) {
            getScreensList(screen);
        }
    }, [screen]);

    return (
        <Modal
            title={customTitle}
            visible={visible}
            onOk={onConfirm}
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
                            <label htmlFor="firstName" className="form-lable">Name<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="title"
                                    placeholder="Enter name"
                                    {...register('title', {
                                        required: {
                                            value: true,
                                            message: 'Name is required',
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z\d_!@#$%^&*()\-+=\[\]:;<>,.?\\|{}~`"'\/ ]*$/,
                                            message: 'Please enter a valid name with at least three alphabet characters',
                                        },
                                    })}
                                />

                            </div>
                            {errors?.title && (
                                <span className="error-message">
                                    {errors.title.message}
                                </span>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="pincode" className="form-lable">Position<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="number"
                                    id="pincode"
                                    placeholder="Enter position"
                                    {...register('position', {
                                        required: {
                                            value: true,
                                            message: "Position is required",
                                        },

                                    })}
                                    style={{ borderColor: errors?.position ? 'red' : 'initial' }}
                                />

                            </div>
                            {errors?.position && (
                                <span className="error-message">
                                    {errors.position.message}
                                </span>
                            )}
                        </div>

                        <div className="input-group col-span-2-sm">
                            <label htmlFor="pincode" className="form-lable">Start date Time<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="datetime-local"
                                    id="button_text"
                                    placeholder="Enter start date"
                                    {...register('start', {
                                        required: {
                                            value: true,
                                            message: ' Start date is required',
                                        },

                                    })}
                                    style={{ borderColor: errors?.start ? 'red' : 'initial' }}
                                />

                            </div>
                            {errors?.start && (
                                <span className="error-message">
                                    {errors.start.message}
                                </span>
                            )}
                        </div>
                        {startdate &&
                            <div className="input-group col-span-2-sm">
                                <label htmlFor="pincode" className="form-lable">End date Time<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        className="form-field"
                                        type="datetime-local"
                                        min={startdate}
                                        id="end"
                                        placeholder="Enter end date"
                                        {...register('end', {
                                            required: {
                                                value: true,
                                                message: ' End date is required',
                                            },

                                        })}
                                        style={{ borderColor: errors?.end ? 'red' : 'initial' }}
                                    />

                                </div>
                                {errors?.end && (
                                    <span className="error-message">
                                        {errors.end.message}
                                    </span>
                                )}
                            </div>}



                        <div className="input-group">
                            <label htmlFor="pincode" className="form-lable">Status<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <select
                                    id="location"
                                    {...register("active", {
                                        required: {
                                            value: true,
                                            message: "Status is required",
                                        },
                                    })}
                                >
                                    <option value="">Status</option>
                                    <option value='active'>Active</option>
                                    <option value='inactive'>Inactive</option>
                                </select>

                            </div>
                            {errors?.active && (
                                <span className="error-message">
                                    {errors.active.message}
                                </span>
                            )}
                        </div>

                        <div className="input-group">

                            <label htmlFor="date of birth" className="form-lable">Type<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <select
                                    id="skill"
                                    {...register("url_type", {
                                        required: {
                                            value: true,
                                            message: "Type is required",
                                        }
                                    })}
                                >
                                    <option value="" >Select </option>
                                    <option value="external" >External</option>
                                    <option value="internal" >Internal</option>
                                </select>
                            </div>
                            {errors?.url_type && (
                                <span className="error-message">
                                    {errors.url_type.message}
                                </span>
                            )}
                        </div>
                        {URLtype == "internal" &&
                            <div className="input-group">
                                <label htmlFor="screen" className="form-lable">Screen<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <select
                                        id="screen"
                                        {...register("screen", {
                                            required: {
                                                value: URLtype == "internal",
                                                message: "screen is required",
                                            },
                                        })}
                                    >
                                        <option value="" selected disabled>Select Screen</option>
                                        <option value="Facility">Facility</option>
                                        <option value="Event">Event</option>
                                        <option value="Coach">Coach</option>
                                        <option value="OurCoachingPrograms">Our Coaching Programs</option>
                                        <option value="Promotions">Promotions</option>
                                    </select>

                                </div>
                                {errors?.active && (
                                    <span className="error-message">
                                        {errors.active.message}
                                    </span>
                                )}
                            </div>}

                        {(URLtype == "internal" && screen) &&
                            <div className="input-group">

                                <label htmlFor="subScreen" className="form-lable">Sub-Screen<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <select
                                        id="skill"
                                        {...register("redirect_url", {
                                            required: {
                                                value: URLtype == "internal",
                                                message: "Screen is required",
                                            }
                                        })}
                                    >
                                        <option value="" selected disabled>Select Sub-Screen</option>
                                        {
                                            subScreensList.map((subscreen: any, index) => {
                                                return (
                                                    <option key={index} value={subscreen?._id}>{subscreen.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                {errors?.url_type && (
                                    <span className="error-message">
                                        {errors.url_type.message}
                                    </span>
                                )}
                            </div>}

                        {URLtype == "external" &&
                            <div className="input-group">
                                <label htmlFor="pincode" className="form-lable">Re-direct<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        className="form-field"
                                        type="text"
                                        id="redirect_url"
                                        placeholder="Enter Redirect url"
                                        {...register('redirect_url', {
                                            required: {
                                                value: true,
                                                message: 'Redirect url is required',
                                            },

                                        })}
                                        style={{ borderColor: errors?.redirect_url ? 'red' : 'initial' }}
                                    />

                                </div>
                                {errors?.redirect_url && (
                                    <span className="error-message">
                                        {errors.redirect_url.message}
                                    </span>
                                )}
                            </div>
                        }

                        <div className="input-group">
                            <label htmlFor="pincode" className="form-lable">Banner Image{edit != true && <span style={{ color: "red" }}>*</span>}</label>
                            <div className="form-group">
                                <input
                                    type="file"
                                    accept="image/x-png,image/gif,image/jpeg"
                                    // onChange={(e) => { fileURL(e.target.files) }}
                                    {...register("image", {
                                        required: {
                                            value: edit ? false : true,
                                            message: "Image is required",
                                        },
                                    })}
                                    onChange={onChange}
                                />
                            </div>
                            {errors?.image && (
                                <span className="error-message">
                                    {errors.image.message}
                                </span>
                            )}
                        </div>
                        {(previewImage != "" || editdata.image) &&
                            <div className="input-group">
                                <div className='label-pre'>
                                    <label htmlFor="myCheckbox"><strong>Image Preview</strong> </label>
                                    {(editdata.image && previewImage === "") && <button type="button" onClick={handleDownloadImage} className="pi-btn-primary"><div className="pi-btn-content"><Icon icon="material-symbols:download" width="16" height="16" style={{ color: "white" }} /></div></button>}

                                </div>
                                {previewImage !== "" ? <img src={previewImage} className="image-preview-app-card" /> : < img src={editdata.image} className="image-pr" />}
                            </div>}
                    </div>
                    <Footer className='ant-modal-footer'>
                        <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset(); }}>Cancel</button>
                        <button type="submit" className="pi-btn-primary"> {row._id ? 'Save' : 'Add'}</button>
                    </Footer>
                </form>
            </div >
        </Modal >
    )
}

export default AddBanners