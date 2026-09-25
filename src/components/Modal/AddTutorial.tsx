import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { Controller, useForm } from 'react-hook-form';
import Select from "react-select";
import makeAnimated from "react-select/animated";
import * as Constants from "../../components/apiFile/Constants";
import { createTutorial, editTutorial } from '../apiFile/Service';
import { Icon } from "@iconify-icon/react";


interface formModal {
    title: string,
    category: any,
    sport_type: any,
    thumbnail_image: any,
    youtube_url: string,
}

const AddTutorial = ({ visible, onCancel, row, edit, setRow, setEdit, getAllData, }) => {
    const form = useForm({
        defaultValues: {
            title: "",
            category: {},
            sport_type: {},
            thumbnail_image: "",
            youtube_url: "",

        }
    })
    const { register, handleSubmit, control, reset, formState, watch, setValue } = form;
    const { errors } = formState;
    const animatedComponents = makeAnimated();
    const loggedInUser = localStorage.getItem("auth");
    const [previewImage, setPreviewImage] = useState(row?.thumbnail_image);
    console.log('ROW DATA === ', row, previewImage)
    useEffect(() => {
        if (edit) {
            reset({
                title: row?.title,
                sport_type: { "label": row?.sport_type, "value": row?.sport_type },
                category: { "label": row?.category, "value": row?.category },
                youtube_url: row.youtube_url,
                // thumbnail_image: rows.thumbnail_image
            })
            setPreviewImage(row?.thumbnail_image);
        } else {
            setPreviewImage('');
            reset({});
            reset({
                title: "",
                category: { label: "Select...", value: "" },
                sport_type: { label: "Select...", value: "" },
                thumbnail_image: "",
                youtube_url: "",
            });
            setRow({})
            setEdit(false);
        }
    }, [visible])
    const customTitle = (
        <div className="custom-ant-modal-header">
            {edit ? 'Edit Tutorial' : 'Add Tutorial'}
        </div>
    );

    const sportOptions = [
        { label: 'Padel', value: 'Padel' },
        { label: 'Pickleball', value: 'Pickleball', },
    ];
    const categoryOptions = [
        { label: 'Technique', value: 'Technique' },
        { label: 'Training', value: 'Training' },
        { label: 'Tactics', value: 'Tactics' },
        { label: 'Rules', value: 'Rules' },
    ]
    const fileURL = async (data, date) => {
        console.log(data)
        const params = {
            ACL: "public-read",
            Body: data[0],
            Bucket: `${Constants.S3_BUCKET}events`,
            Key: `${date}_imageUpload_${data[0].name}`,
        };
        Constants.myBucket.upload(params, function (err, uploadData) {
            if (uploadData) {
                data = uploadData.sport_type;
                return;
            } else {
                console.log("error", err);
            }
        });
    }


    const onChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string; // Ensure TypeScript recognizes it as a string
                // setPreviewImage(result);
            };
            reader.readAsDataURL(file);

            const fileType = file.type;
            if (!fileType.startsWith('image/')) {
                event.target.value = ''; // Clear input if the selected file is not an image
            }
        }
    };
    const handleDownloadImage = () => {
        if (row.thumbnail_image) {
            // Create a temporary anchor element
            const anchor = document.createElement('a');
            anchor.href = row.thumbnail_image;
            anchor.download = 'image2.jpg'; // Change the filename as needed
            anchor.click();
        }
    };
    const getVideoId = (url: string) => {
        const rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
        const videoId = url.match(rx);
        if (videoId === null) {
            return url;
        }
        else {
            return videoId[1];
        }
    }
    const onSubmit = async (data: formModal) => {
        console.log('form data === ', data);
        var date = Math.round(+new Date() / 1000);
        if (data.thumbnail_image.length > 0) {
            await fileURL(data.thumbnail_image, date)
            data.thumbnail_image = `${Constants.BaseLink}events/${date}_imageUpload_${data.thumbnail_image[0].name}`;
        }
        else if (edit == true) {
            data.thumbnail_image = row?.thumbnail_image
        } else {
            data.thumbnail_image = "NO Image Added"
        }
        var videoId;
        videoId = getVideoId(data.youtube_url);
        console.log('video === ', videoId)
        data.youtube_url = videoId;
        data.sport_type = data.sport_type.value;
        data.category = data.category.value;
        // data.date = date;
        var response;
        if (edit == true) {
            response = await editTutorial(loggedInUser, row?._id, data);
        } else {
            response = await createTutorial(loggedInUser, data);
        }
        if (response?.statusCode == 0) {
            toast(<ToastMessage body={edit ? "Tutorial Updated Successfully" : "Tutorial Added Successfully"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            onSuccess();
        }
        //  else if (response.statusCode == "Court creation limit reached.") {
        //     toast(<ToastMessage body={response.statusCode} type="warning" />, {
        //         position: "top-right",
        //         autoClose: 5000,
        //         hideProgressBar: true,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true,
        //     });
        // } 
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
                    <div className="form-container-grid border-bottom-light">
                        <div className='input-group'>
                            <label className='form-label'>Title<span className='required-star '>*</span></label>
                            <div className='form-group'>
                                <input type='text' placeholder='Enter title of your video' {...register("title", { required: true })} />
                            </div>
                            {errors.title && <span className="error-message">Title is required</span>}
                        </div>
                        <div className='input-group'>
                            <label className='form-label'>Category<span className='required-star '>*</span></label>
                            <div className="form-group">
                                <Controller
                                    name="category"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Category is required",
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
                                            options={categoryOptions}
                                            {...field}
                                            onChange={(value) => {
                                                onChange(value);
                                                // onSportChange();
                                            }}
                                            value={value}
                                        />
                                    )}
                                />
                            </div>
                            {errors.category && <span className="error-message">Category is required</span>}
                        </div>
                        <div className='input-group'>
                            <label className='form-label'>Sport Type<span className='required-star '>*</span></label>
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
                                            defaultValue={row._id}
                                            // defaultValue={[colourOptions[4], colourOptions[5]]}
                                            // isMulti
                                            options={sportOptions}
                                            {...field}
                                            onChange={(value) => {
                                                onChange(value);
                                                // onSportChange();
                                            }}
                                            value={value}
                                        />
                                    )}
                                />
                            </div>
                            {errors.sport_type && <span className="error-message">Sport Type is required</span>}
                        </div>

                        <div className='input-group'>
                            <label className='form-label'>Youtube Url<span className='required-star '>*</span></label>
                            <div className='form-group'>
                                <input type='text' placeholder='Enter youtube url' {...register("youtube_url", { required: true })} />
                            </div>
                            {errors.youtube_url && <span className='error-message'>Youtube URL is required</span>}
                        </div>
                        <div className='input-group'>
                            <label className='form-label'>Thumbnail<span className='required-star '>*</span></label>
                            <div className='form-group'>
                                <input type='file' accept="image/x-png,image/gif,image/jpeg" {...register("thumbnail_image", { required: edit == true ? false : true })}
                                    onChange={onChangeImage}
                                    style={{ width: "100%" }} />
                            </div>
                            {errors.thumbnail_image && <span className="error-message">Thumbnail is required</span>}
                        </div>
                        {(previewImage != "" || row.thumbnail_image) &&
                            <div className="input-group col-span-2">
                                <div className='label-pre'>
                                    <label htmlFor="myCheckbox"><strong>Image Preview</strong> </label>
                                    {(row.thumbnail_image && previewImage !== "") && <button type="button" onClick={handleDownloadImage} className="pi-btn-primary"><div className="pi-btn-content"><Icon icon="material-symbols:download" width="16" height="16" style={{ color: "white" }} /></div></button>}

                                </div>
                                {previewImage !== "" ? <img src={previewImage} className="image-pre-court" /> : < img src={row.image} className="image-pre-court" />}
                            </div>}
                    </div>
                    <Footer className='ant-modal-footer'>
                        <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset(); }}>Cancel</button>
                        <button type="submit" className="pi-btn-primary"> {edit ? 'Save Changes' : 'Add Tutorial'}</button>
                    </Footer>
                </form>
            </div >
        </Modal >
    )

};

export default AddTutorial;