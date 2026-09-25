import React, { useMemo, useState } from "react";
import { Modal } from "antd";
import { useForm } from 'react-hook-form';
import "../css/style.css";
import { toast } from "react-toastify";
import ToastMessage from "../../page/facilator/ToastMessage/ToastMessage";
import { createOrganizerAPI, createSkillLevelAPI, editOrganizerAPI, editSkillLevelAPI } from "../apiFile/Service";
import * as Constants from "../../components/apiFile/Constants";
import { Footer } from "antd/es/layout/layout";
import { Icon } from "@iconify-icon/react";

const AddOrganizer = ({
    open,
    toggle,
    getItems,
    editdata,
    edit,
    setEdit,
    setEditData,
}) => {
    const form = useForm({
        defaultValues: {
            name: "",
            icon: "",

        }
    })
    const { register, handleSubmit, reset, formState, setError, clearErrors } = form;
    const { errors } = formState;
    const loggedInUser = localStorage.getItem("auth");
    const closingFunctions = () => { toggle(); reset(); setEdit(false); setEditData({}) }
    const [previewImage, setPreviewImage] = useState('');

    const customTitle = (
        <div className="custom-ant-modal-header">
            {edit == true ? "Edit Organizer" : "Add Organizer"}
        </div>
    );
    const fileURL = async (data, date, name) => {
        const params = {
            ACL: "public-read",
            Body: data[0],
            Bucket: `${Constants.S3_BUCKET}events`,
            Key: `${date}_${name}_organizers_icon_${data[0].name}`,
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
        let response
        var date = Math.round(+new Date() / 1000);
        await fileURL(data.icon, date, data.name)
        data.icon = `${Constants.BaseLink}events/${date}_${data.name}_organizers_icon_${data.icon[0].name}`
        if (edit == true) {
            data.icon = editdata.icon
            response = await editOrganizerAPI(loggedInUser, data, editdata._id);
        } else {
            response = await createOrganizerAPI(loggedInUser, data);
        }
        if (response.statusCode == 0) {
            toast(<ToastMessage body={edit == true ? "Organizers Edited Successfully" : "Organizers Added Successfully"} type="success" />, {
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
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string; // Ensure TypeScript recognizes it as a string
                setPreviewImage(result);

                const image = new Image();
                image.src = result;
                image.onload = () => {
                    if (image.width !== image.height) {
                        reset({
                            icon: "",
                        })
                        // Set error message if image is not square
                        setError("icon", {
                            type: "custom",
                            message: "Selected Image is not Square. Image must be square.",
                        });
                        setPreviewImage("");

                    } else {
                        // Clear any previous errors if image is square
                        clearErrors("icon");
                    }
                };
            };

            reader.readAsDataURL(file);
            const fileType = file.type;
            if (!fileType.startsWith('image/')) {
                event.target.value = '';
            }
        }
    };
    useMemo(() => {
        reset({
            'name': editdata.name,
            'icon': editdata.icon
        })
    }, [open])

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
        <div>
            <Modal
                className="custom-ant-modal "
                open={open}
                title={customTitle}
                onCancel={closingFunctions}
                footer={null}
                width={'425px'}
                centered
            >
                <div className="form-container">
                    {/* <div className="form-header">
                        <h2>Add New Facility</h2>
                        <span className="close-icon" onClick={toggle}>X</span>
                    </div> */}
                    <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-column border-bottom-light">
                            <div className="input-group">
                                <label htmlFor="skillLevel">Organizer Name<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        id="skillLevel"
                                        placeholder="Organizer Name"
                                        {...register('name', {
                                            required: {
                                                value: true,
                                                message: 'Name is required',
                                            },
                                            pattern: {
                                                value: /^[^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*$/,
                                                message: 'Please enter a valid name with at least three alphabet characters',
                                            },
                                        })}
                                        style={{ borderColor: errors?.name ? 'red' : 'initial' }}
                                    />

                                </div>
                                {errors?.name && (
                                    <span className="error-message">
                                        {errors.name.message}
                                    </span>
                                )}
                            </div>
                            <div className="input-group">

                                <label htmlFor="skillLevel">Organizer's Logo<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        type="file"
                                        id="skillLevel"
                                        placeholder="Organizer's Icon"
                                        accept="image/x-png,image/gif,image/jpeg"
                                        {...register('icon', {
                                            required: {
                                                value: edit == true ? false : true,
                                                message: 'Icon is required',
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
                                        <label htmlFor="myCheckbox"><strong>Image Preview</strong> </label>
                                        {(editdata.icon && previewImage === "") && <button type="button" onClick={handleDownloadImage} className="pi-btn-primary"><div className="pi-btn-content"><Icon icon="material-symbols:download" width="16" height="16" style={{ color: "white" }} /></div></button>}
                                    </div>
                                    <label htmlFor="myCheckbox">Image Preview (Square)</label>
                                    {previewImage !== "" ? <img src={previewImage} className="table-lg-img-square" /> : < img src={editdata.icon} className="table-lg-img-square" />}
                                </div>}
                        </div>
                        <Footer className='ant-modal-footer'>
                            <button type="button" className="pi-btn-secondary" onClick={closingFunctions}>Cancel</button>
                            <button type="submit" className="pi-btn-primary">{edit == true ? "Save" : "Add"}</button>
                        </Footer>
                    </form>
                </div>
            </Modal>
        </div >
    );
};
export default AddOrganizer;
