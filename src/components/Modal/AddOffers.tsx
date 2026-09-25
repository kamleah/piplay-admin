import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { useForm } from 'react-hook-form';
import * as Constants from "../../components/apiFile/Constants";
import { createOfferAPI, EditOffers } from '../apiFile/Service';
import JoditEditor from "jodit-react";
import { Icon } from "@iconify-icon/react";



interface formModal {
    title: string,
    brand: string,
    subtitle: string,
    status: string,
    type: string,
    description: string,
    start: string,
    end: string,
    website: string,
    mail_id: string,
    phone_no: string,
    redeem: string,
    tandc: string,
    tandctext: string,
    offer: any,
    image: any,
    percentage: boolean,
}

const AddOffers = ({ visible, setvisible, name, onConfirm, row, getOffer, edit, editdata, setEdit, setEditData }) => {
    const form = useForm({
        defaultValues: {
            title: "",
            type: "",
            description: "",
            start: "",
            end: "",
            website: "",
            mail_id: "",
            phone_no: "",
            redeem: "",
            tandc: "",
            tandctext: "",
            image: "",
            brand: "",
            subtitle: "",
            status: "",
            offer: "",
            percentage: false,
        }
    })
    const { register, handleSubmit, reset, formState } = form;

    const { errors } = formState;
    const [data, setData] = useState([])
    const customTitle = (
        <div className="custom-ant-modal-header">
            {row._id ? 'Edit Promotion' : 'Add Promotion'}
        </div>
    );
    const editor = useRef(null);
    const [description, setDescription] = useState("")
    const [tandctext, setTandctext] = useState("")
    const [redeem, setRedeem] = useState("")
    const [previewImage, setPreviewImage] = useState('');
    const config = { placeholder: "Enter description" }
    const loggedInUser = localStorage.getItem("auth");

    const onCancel = () => {
        setEditData({})
        setDescription('')
        setTandctext('')
        setRedeem('')
        setPreviewImage('')
        setvisible(false);
        setEdit(false)
    }

    const fileURL = async (data, date) => {
        const params = {
            ACL: "public-read",
            Body: data[0],
            Bucket: `${Constants.S3_BUCKET}events`,
            Key: `${date}_offerImage_${data[0].name}`,
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
    const onSubmit = async (data: formModal) => {
        const start_date: any = new Date(data?.start);
        const end_date: any = new Date(data?.end);
        const main_date = end_date - start_date;
        if (main_date <= 0) {

            toast(<ToastMessage body={"Promotion can't end before start time"} type="warning" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        data["redeem"] = redeem
        data["description"] = description
        data["tandctext"] = tandctext
        data.percentage = false
        data.tandc = "terms & conditions"
        var date = Math.round(+new Date() / 1000);
        if (typeof data.image != 'string') {
            await fileURL(data.image, date)
            data.image = `${Constants.BaseLink}events/${date}_offerImage_${data.image[0].name}`;
        } else {
            if (edit == true) {
                data.image = editdata.image
            } else {
                data.image = "No Image Added"
            }
        }
        var response
        if (edit == true) {
            response = await EditOffers(loggedInUser, editdata._id, data);
        } else {
            response = await createOfferAPI(loggedInUser, data);
        }
        if (response.code == 'SUCCESS' || response.code == 'SIGNUP_SUCCESS') {
            getOffer();
            toast(<ToastMessage body={row._id ? "Promotion Updated Successfully" : "Promotion Added Successfully"} type="success" />, {
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
        reset({});
        if (edit == true) {
            setDescription(row.description);
            setTandctext(row.tandctext);
            setRedeem(row.redeem);
            reset({
                "title": row.title,
                "brand": row.brand,
                "subtitle": row.subtitle,
                "offer": row.offer,
                "status": row.status,
                "type": row.type,
                "start": row.start,
                "end": row.end,
                "website": row.website,
                "mail_id": row.mail_id,
                "phone_no": row.phone_no,
                "tandc": row.tandc,
                "image": row.image,
            })
        }
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
    return (
        <Modal
            title={customTitle}
            visible={visible}
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
                            <label htmlFor="firstName" className="form-lable">Brand<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="title"
                                    placeholder="Enter brand"
                                    {...register('brand', {
                                        required: {
                                            value: true,
                                            message: 'Brand is required',
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z\d_!@#$%^&*()\-+=\[\]:;<>,.?\\|{}~`"'\/ ]*$/,
                                            message: 'Please enter a valid name with at least three alphabet characters',
                                        }


                                    })}

                                />

                            </div>
                            {errors?.brand && (
                                <span className="error-message">
                                    {errors.brand.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="firstName" className="form-lable">Title<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="title"
                                    placeholder="Enter Offer title"
                                    {...register('title', {
                                        required: {
                                            value: true,
                                            message: 'Offer Title is required',
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z\d_!@#$%^&*()\-+=\[\]:;<>,.?\\|{}~`"'\/ ]*$/,
                                            message: 'Please enter a valid Promotion title with alphanumeric, special characters, and spaces',
                                        },
                                    })}
                                    style={{ borderColor: errors?.title ? 'red' : 'initial' }}
                                />
                            </div>


                            {errors?.title && (
                                <span className="error-message">
                                    {errors.title.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="firstName" className="form-lable"> Subtitle<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="title"
                                    placeholder="Enter Subtitle"
                                    {...register('subtitle', {
                                        required: {
                                            value: true,
                                            message: 'Subtitle is required',
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z\d_!@#$%^&*()\-+=\[\]:;<>,.?\\|{}~`"'\/ ]*$/,
                                            message: 'Please enter a valid Promotion subtitle with alphanumeric, special characters, and spaces',
                                        },
                                    })}

                                />

                            </div>
                            {errors?.subtitle && (
                                <span className="error-message">
                                    {errors.subtitle.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="lastName" className="form-lable"> Type<span style={{ color: "red" }}>*</span></label>

                            <div className="form-group">
                                <select
                                    id="location"
                                    {...register("type", {
                                        required: {
                                            value: true,
                                            message: 'Promotion Type is required',
                                        },
                                    })}
                                >
                                    <option value="">Type</option>
                                    <option value="entertainments">Entertainments</option>
                                    <option value="dinings">Dinings</option>
                                    <option value="sports">Sports</option>
                                </select>

                            </div>
                            {errors?.type && (
                                <span className="error-message">
                                    {errors.type.message}
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
                        <div className="input-group col-span-2-sm">
                            <label htmlFor="pincode" className="form-lable">End date Time<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="datetime-local"
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
                        </div>
                        <div className="input-group">
                            <label htmlFor="pincode" className="form-lable">Discount / Promotion Name</label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="mail_id"
                                    placeholder="Enter Discount/Promotion Text"
                                    defaultValue={0}
                                    {...register('offer', {
                                        required: {
                                            value: false,
                                            message: "Discount/Promotion text is required",
                                        },
                                    })}
                                />
                            </div>
                            {errors?.offer && (
                                <span className="error-message">
                                    {errors.offer.message}
                                </span>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="pincode" className="form-lable">Status<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <select
                                    id="location"
                                    {...register("status", {
                                        required: {
                                            value: true,
                                            message: "Status is required",
                                        },
                                    })}
                                >
                                    <option value="">Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>

                            </div>
                            {errors?.status && (
                                <span className="error-message">
                                    {errors.status.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="myCheckbox">Phone Number<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">

                                <input
                                    className="form-field"
                                    type="number"
                                    id="pincode"
                                    placeholder="Enter phone number"
                                    {...register('phone_no', {
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
                            {errors?.phone_no && (
                                <span className="error-message">
                                    {errors.phone_no.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="pincode" className="form-lable">Email ID<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="mail_id"
                                    placeholder="Enter email"
                                    {...register('mail_id', {
                                        required: {
                                            value: true,
                                            message: "Email Id is required",
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]*[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: 'Invalid email format. Please enter a valid email address.',
                                        },
                                    })}
                                />

                            </div>
                            {errors?.mail_id && (
                                <span className="error-message">
                                    {errors.mail_id.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="pincode" className="form-lable">Image<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
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
                        <div className="input-group">
                            <label htmlFor="pincode" className="form-lable">Website URL</label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="website"
                                    placeholder="Enter website URL"
                                    {...register('website', {
                                        // pattern: {
                                        //     value: /^(https?:\/\/)?(www\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9#]+\/?)*$/,
                                        //     message: 'Please enter a valid website URL (e.g., www.example.com)',
                                        // },
                                        // pattern: {
                                        //     value: /^(https?:\/\/)?(www\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9#]+\/?)*$/,
                                        //     message: 'Please enter a valid website URL (e.g., www.example.com)',
                                        // },
                                    })}
                                />
                            </div>
                            {errors?.website && (
                                <span className="error-message">
                                    {errors.website.message}
                                </span>
                            )}
                        </div>
                        {(previewImage != "" || editdata.image) &&
                            <div className="input-group col-span-2">
                                <div className='label-pre'>
                                    <label htmlFor="myCheckbox"><strong>Image Preview</strong> </label>
                                    {(editdata.image && previewImage === "") && <button type="button" onClick={handleDownloadImage} className="pi-btn-primary"><div className="pi-btn-content"><Icon icon="material-symbols:download" width="16" height="16" style={{ color: "white" }} /></div></button>}

                                </div>
                                {previewImage !== "" ? <img src={previewImage} className="image-pre" /> : < img src={editdata.image} className="image-pre" />}
                            </div>}
                        <div className="input-group col-span-2">
                            <label htmlFor="pincode" className="form-lable">Description<span style={{ color: "red" }}>*</span></label>
                            <div className="">
                                <JoditEditor
                                    ref={editor}
                                    value={description}
                                    onChange={(value) => {
                                        setDescription(value);
                                    }}
                                />
                            </div>
                            {errors?.description && (
                                <span className="error-message">
                                    {errors.description.message}
                                </span>
                            )}
                        </div>

                        <div className="input-group col-span-2">
                            <label htmlFor="redeem" className="form-lable">Redeem<span style={{ color: "red" }}>*</span></label>
                            <div className="">
                                <JoditEditor
                                    ref={editor}
                                    value={redeem}
                                    onChange={(value) => {
                                        setRedeem(value);
                                    }}
                                />
                            </div>
                            {errors?.redeem && (
                                <span className="error-message">
                                    {errors.redeem.message}
                                </span>
                            )}
                        </div>


                        <div className="input-group col-span-2">
                            <label htmlFor="term" className="form-lable">Terms & Conditions<span style={{ color: "red" }}>*</span></label>
                            <div className="">
                                <JoditEditor
                                    ref={editor}
                                    value={tandctext}
                                    onChange={(value) => {
                                        setTandctext(value);
                                    }}
                                />

                            </div>
                            {errors?.tandctext && (
                                <span className="error-message">
                                    {errors.tandctext.message}
                                </span>
                            )}
                        </div>


                    </div>
                    <Footer className='ant-modal-footer'>
                        <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset(); }}>Cancel</button>
                        <button type="submit" className="pi-btn-primary"> {row._id ? 'Save' : 'Add Promotion'}</button>
                    </Footer>
                </form>
            </div >
        </Modal >
    )
}

export default AddOffers