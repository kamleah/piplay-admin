import { Modal } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { createRatingSkillLevelAPI, editRatingSkillLevelAPI, getAllSkillLevelsAPI } from '../apiFile/Service';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';

export default function AddUserSkillLevel({ visible, onCancel, row, edit, setEdit, getAllData }) {
    const { register, handleSubmit, control, reset, formState: { errors }, watch, setValue } = useForm();
    const [skilllevel, setSkilllevel] = useState([])
    const loggedInUser = localStorage.getItem("auth");
    const animatedComponents = makeAnimated();
    const customTitle = (
        <div className="custom-ant-modal-header">
            {edit ? 'Edit Skill Level' : 'Add Skill Level'}
        </div>
    );
    const sportOptions = [
        // { label: 'All', value: 'all' },
        { label: 'Padel', value: 'padel' },
        { label: 'Pickleball', value: 'pickleball', },
    ];

    const getSkillLevels = async () => {
        let response = await getAllSkillLevelsAPI(loggedInUser);
        console.log(response)
        let skill_levels
        if (response?.result.length > 0) {
            skill_levels = response.result.map((data) => {
                return { 'label': data?.label, 'value': data?._id }
            })
        }
        setSkilllevel(skill_levels)
    }

    useEffect(() => {
        getSkillLevels();
    }, [])

    const onSubmit = async (data) => {        
        var response
        const payload: any = {
            "rating": data.rating,
            "skill_level": data.skill_level.value,
            "sport_type": data.sport_type.value,
            "description": data?.description
        }
        // console.log('payload-----------', payload)
        if (edit == true) {
            response = await editRatingSkillLevelAPI(loggedInUser, row._id, payload);
        } else {
            response = await createRatingSkillLevelAPI(loggedInUser, payload);
        }
        if (response.statusCode == 0) {
            toast(<ToastMessage body={edit ? "User Skill Level Updated Successfully" : "User Skill Level Added Successfully"} type="success" />, {
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
        // setDynamicFields([]);
        // setDataIndex(1);
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    useEffect(() => {
        if (edit) {
            console.log("row---------------------",row)
            reset({
                "rating": parseFloat(row?.rating).toFixed(1),
                "skill_level": { 'label': row?.skill_level?.label, 'value': row?.skill_level?._id },
                "sport_type": { 'label': capitalizeFirstLetter(row?.sport_type), 'value': row?.sport_type },
                "description": row?.description
            })
        } else {
            reset({});
            reset({
                "rating": '',
                "skill_level": '',
                "sport_type": '',
                "description": ''

            });
            // setRow({})
            setEdit(false);
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
                            <label htmlFor="name" className="form-lable">Rating<span className='required-star '>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="name"
                                    placeholder="Enter Rating"
                                    {...register("rating", {
                                        required: {
                                            value: true,
                                            message: 'Rating is required',  
                                        },

                                    })}
                                />
                            </div>
                            {errors?.rating && (
                                <span className="error-message">
                                    Rating is required
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label className="form-lable" htmlFor="facility_id">Skill Level<span className='required-star '>*</span></label>
                            <div className="form-group">
                                <Controller
                                    name="skill_level"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Skill Level is required",
                                        },
                                    }}
                                    render={({ field: { onChange, value }, field }) => (
                                        <Select
                                            className="controller-select"
                                            components={animatedComponents}
                                            defaultValue={row._id}
                                            options={skilllevel}
                                            {...field}
                                            value={value}
                                        />
                                    )}
                                />
                            </div>
                            {errors?.skill_level && (
                                <span className="error-message">
                                    Skill Level is required
                                </span>
                            )}
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
                            <label className="form-lable" htmlFor="sport_type">Description<span className='required-star '>*</span></label>
                            <div className="form-group">
                                <textarea id="" rows={5} cols={5} placeholder='Description here...'
                                    {...register("description", {
                                        required: {
                                            value: true,
                                            message: 'Package  is required',
                                        },

                                    })}
                                >

                                </textarea>
                            </div>
                            {errors?.description && (
                                <span className="error-message">
                                    Description  is required
                                </span>
                            )}
                        </div>
                    </div>
                    <Footer className='ant-modal-footer '>
                        <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset(); }}>Cancel</button>
                        <button type="submit" className="pi-btn-primary"> {edit ? 'Save Changes' : 'Add Skill Level'}</button>
                    </Footer>
                </form>
            </div >
        </Modal >
    )
}
