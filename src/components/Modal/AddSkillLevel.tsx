import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useForm } from 'react-hook-form';
import "../css/style.css";
import { toast } from "react-toastify";
import ToastMessage from "../../page/facilator/ToastMessage/ToastMessage";
import { createSkillLevelAPI, editSkillLevelAPI } from "../apiFile/Service";
import { Footer } from "antd/es/layout/layout";
import { ChromePicker } from 'react-color';
import SkillLabelV2 from "../Labels/SkillLabelV2";

interface formModal {
    label: string;
    value: number;
    color: string;
    text_color: string;
}

const AddSkillLevel = ({
    open,
    toggle,
    getItems,
    editdata,
    edit,
    setEdit,
    setEditData,
}) => {
    const { register, handleSubmit, reset, formState, setValue, getValues, control, watch } = useForm({
        defaultValues: {
            label: "",
            value: 0,
            color: "",
            text_color: ""
        }
    });
    const { errors } = formState;
    const loggedInUser = localStorage.getItem("auth");
    const closingFunctions = () => { toggle(); reset(); setEdit(false); setEditData({}) }

    const [bgColor, setBgColor] = useState('#000000');
    const [textColor, setTextColor] = useState('#ffffff');

    const customTitle = (
        <div className="custom-ant-modal-header">
            {edit ? "Edit Skill Level" : "Add Skill Level"}
        </div>
    );

    const skillLabelData = {
        label: watch('label') || editdata?.label,
        value: watch('value') || editdata?.value,
        color: bgColor || editdata?.color,
        text_color: textColor || editdata?.text_color
    }

    const handleColorChange = (newcolor) => {
        setBgColor(newcolor.hex);
    };

    const handleTextColorChange = (newcolor) => {
        setTextColor(newcolor.hex);
    };

    const onSubmit = async (data: formModal) => {
        let response;
        data.value = Number(data.value);
        data.color = bgColor;
        data.text_color = textColor;

        if (edit) {
            response = await editSkillLevelAPI(loggedInUser, data, editdata._id);
        } else {
            response = await createSkillLevelAPI(loggedInUser, data);
        }

        if (response.statusCode === 0) {
            toast(
                <ToastMessage
                    body={edit ? "SkillLevel Edited Successfully" : "SkillLevel Added Successfully"}
                    type="success"
                />,
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
            getItems();
            closingFunctions();
            reset();
        } else {
            toast(
                <ToastMessage body={response.statusCode} type="warning" />,
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
        }
    };

    useEffect(() => {
        if (editdata) {
            reset({
                label: editdata.label,
                value: editdata.value,
            });
            setBgColor(editdata.color || '#000000');
            setTextColor(editdata.text_color || '#ffffff');
        }
    }, [editdata, reset]);

    return (
        <Modal
            className="custom-ant-modal"
            open={open}
            title={customTitle}
            onCancel={closingFunctions}
            footer={null}
            width={'500px'}
            centered
        >
            <div className="form-container">
                <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
                    <div className="border-bottom-light">
                        <div className="form-container-grid form-column">
                            <div className="input-group col-span-2-sm">
                                <label htmlFor="skillLevel">Skill Level<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        id="skillLevel"
                                        placeholder="Skill Level"
                                        {...register('label', {
                                            required: {
                                                value: true,
                                                message: 'Label is required',
                                            },
                                        })}
                                    />
                                </div>
                                {errors?.label && (
                                    <span className="error-message">
                                        {errors.label.message}
                                    </span>
                                )}
                            </div>
                            <div className="input-group col-span-2-sm">
                                <label htmlFor="skillLevel">Skill Progress (0-100) %<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        id="skillLevel"
                                        step={0.5}
                                        placeholder="Skill Value"
                                        {...register('value', {
                                            required: {
                                                value: true,
                                                message: 'Value is required',
                                            },
                                        })}
                                    />
                                </div>
                                {errors?.value && (
                                    <span className="error-message">
                                        {errors.value.message}
                                    </span>
                                )}
                            </div>
                            <div className="input-group col-span-2-sm">
                                <label htmlFor="skillLevel">Label Background Color</label>
                                <ChromePicker color={bgColor} onChange={handleColorChange} />
                            </div>
                            <div className="input-group col-span-2-sm">
                                <label htmlFor="skillLevel">Label Text Color</label>
                                <ChromePicker color={textColor} onChange={handleTextColorChange} />
                            </div>
                            <div className="input-group col-span-2-sm">
                                <label htmlFor="skillLevel">Skill Label</label>
                                <SkillLabelV2 skilldata={skillLabelData} />
                            </div>
                        </div>
                    </div>
                    <Footer className='ant-modal-footer'>
                        <button type="button" className="pi-btn-secondary" onClick={closingFunctions}>Cancel</button>
                        <button type="submit" className="pi-btn-primary">{edit ? "Save" : "Add"}</button>
                    </Footer>
                </form>
            </div>
        </Modal>
    );
};

export default AddSkillLevel;
