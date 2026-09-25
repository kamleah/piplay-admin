import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import { Controller, useForm } from 'react-hook-form';
import * as Constants from "../../components/apiFile/Constants";
import { Icon } from "@iconify-icon/react";
import { createTile, editTile } from '../apiFile/Service';
import Select from "react-select";
import makeAnimated from "react-select/animated";

const AddHomePageTile = ({ visible, name, onConfirm, row, getAllData, edit, editdata, setEditData, setvisible, setEdit }) => {
    const form = useForm({
        defaultValues: {
            title: '',
            subtitle: '',
            redirect: '',
            icon: '',
            position: 0,
            status: {},
        }
    })
    const { register, handleSubmit, reset, formState, watch, control } = form;
    const { errors } = formState;
    const [previewImage, setPreviewImage] = useState('');
    const animatedComponents = makeAnimated();

    const statusOptions = [
        { label: 'Active', value: true},
        { label: 'In-Active', value: false},
     ];

    const customTitle = (
        <div className="custom-ant-modal-header">
            {row._id ? 'Edit Tile' : 'Add Tile'}
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
        data.position = Number(data.position)
        data.status = data.status.value
        var date = Math.round(+new Date() / 1000);
        if (data.icon.length > 0) {
            await fileURL(data.icon, date)
            data.icon = `${Constants.BaseLink}events/${date}_bannerImage_${data.icon[0].name}`;
        } else {
            if (edit == true) {
                data.icon = editdata.icon
            } else {
                data.icon = "No Image Added"
            }
        }
        var response
        if (edit == true) {
            response = await editTile(loggedInUser, editdata._id, data);
        } else {
            response = await createTile(loggedInUser, data);
        }
        console.log(response)
        if (response.statusCode == 0) {
            getAllData();
            setPreviewImage('')
            toast(<ToastMessage body={row._id ? "Tile Updated Successfully" : "Tile Added Successfully"} type="success" />, {
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



    useEffect(() => {
        if(edit){
            reset({
                "title": row.title,
                "subtitle": row.subtitle,
                "redirect": row.redirect,
                "status": row.status == true ? statusOptions[0] : statusOptions[1],
                "position": row.position,
            })
        }else{
            reset({
                "title": '',
                "subtitle": '',
                "icon": '',
                "redirect": '',
                "status": [],
                "position": undefined,
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
        if (editdata.icon) {
            // Create a temporary anchor element
            const anchor = document.createElement('a');
            anchor.href = editdata.icon;
            anchor.download = 'image.jpg'; // Change the filename as needed
            anchor.click();
        }
    };

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
                            <label htmlFor="firstName" className="form-lable">Title<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="title"
                                    placeholder="Enter Title"
                                    {...register('title', {
                                        required: {
                                            value: true,
                                            message: 'Title is required',
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z\d_!@#$%^&*()\-+=\[\]:;<>,.?\\|{}~`"'\/ ]*$/,
                                            message: 'Please enter a valid Title with at least three alphabet characters',
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
                            <label htmlFor="subtitle" className="form-lable">Subtitle<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="subtitle"
                                    placeholder="Enter Subtitle"
                                    {...register('subtitle', {
                                        required: {
                                            value: true,
                                            message: 'Subtitle is required',
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z\d_!@#$%^&*()\-+=\[\]:;<>,.?\\|{}~`"'\/ ]*$/,
                                            message: 'Please enter a valid Subtitle with at least three alphabet characters',
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
                            <label htmlFor="pincode" className="form-lable">Redirect screen URL<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="redirect_url"
                                    placeholder="Enter Redirect url"
                                    {...register('redirect', {
                                        required: {
                                            value: true,
                                            message: 'Redirect url is required',
                                        },

                                    })}
                                    style={{ borderColor: errors?.redirect ? 'red' : 'initial' }}
                                />
                            </div>
                            {errors?.redirect && (
                                <span className="error-message">
                                    {errors.redirect.message}
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
                        
                        <div className="input-group">
                            <label htmlFor="status">Status<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <Controller
                                    name="status"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Status is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value }, field }) => (
                                        <Select
                                            className="controller-select"
                                            components={animatedComponents}
                                            options={statusOptions}
                                            {...field}
                                            onChange={(value) => {
                                                onChange(value);
                                            }}
                                            value={value}
                                        />
                                    )}
                                />
                            </div>
                            {errors?.status && (
                                <span className="error-message">
                                    {errors.status.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="pincode" className="form-lable">Icon image{edit != true && <span style={{ color: "red" }}>*</span>}</label>
                            <div className="form-group">
                                <input
                                    type="file"
                                    accept="image/x-png,image/gif,image/jpeg"
                                    // onChange={(e) => { fileURL(e.target.files) }}
                                    {...register("icon", {
                                        required: {
                                            value: edit ? false : true,
                                            message: "icon is required",
                                        },
                                    })}
                                    onChange={onChange}
                                />
                            </div>
                            {errors?.icon && (
                                <span className="error-message">
                                    {errors.icon.message}
                                </span>
                            )}
                        </div>
                        {(previewImage != "" || editdata.icon) &&
                            <div className="input-group">
                                <div className='label-pre'>
                                    <label htmlFor="myCheckbox"><strong>Icon Preview</strong> </label>
                                    {(editdata.icon && previewImage === "") && <button type="button" onClick={handleDownloadImage} className="pi-btn-primary"><div className="pi-btn-content"><Icon icon="material-symbols:download" width="16" height="16" style={{ color: "white" }} /></div></button>}

                                </div>
                                {previewImage !== "" ? <img src={previewImage} className="table-md-img img-contains" /> : < img src={editdata.icon} className="table-md-img img-contains" />}
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

export default AddHomePageTile