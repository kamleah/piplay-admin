import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from 'antd';
import { useForm } from 'react-hook-form';
import { AddNewUserAPI, EditUserAPI, getAllSkillLevelsAPI } from '../apiFile/Service'; // Assuming you have an EditUserAPI file
import { Footer } from 'antd/es/layout/layout';
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import SkillLabel from '../Labels/SkillLabel';
import { DatePicker } from 'antd';
import moment from 'moment';

const AddUsers = ({ visible, name, onConfirm, onCancel, row, getRegisteredUsers }) => {    
    const form = useForm({
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            mobileno: "",
            age_group: "",
            gender: "",
            skill_level: "",
            location: "",
        }
    })
    const { register, handleSubmit, reset, formState } = form;
    const { errors } = formState;
    const [data, setData] = useState([])
    const customTitle = (
        <div className="custom-ant-modal-header">
            {row._id ? 'Edit User' : 'Add User'}
        </div>
    );
    const today = new Date().toISOString().split('T')[0];
    const loggedInUser = localStorage.getItem("auth");
    const currentDate = new Date().toISOString().split("T")[0];

    const onSubmit = async (data: any) => {
        var response
        if (row._id) {
            response = await EditUserAPI(loggedInUser, row._id, data);
            console.log("edit")
            data.mobileno = row?.mobileno;
        } else {
            data.mobileno = Number(data?.mobileno)
            data.roles = ["Padelist"]
            data.is_otp_verified = false
            data.password = "PadelIndia@2024"
            data.age_group = moment(data.age_group).format('MM-DD-yyyy')
            response = await AddNewUserAPI(loggedInUser, data);
        }
        console.log(response)
        if (response.code == 'SUCCESS' || response.code == 'SIGNUP_SUCCESS') {
            getRegisteredUsers();
            toast(<ToastMessage body={"Player Updated Successfully"} type="success" />, {
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
    const getSkillLevels = async () => {
        let response = await getAllSkillLevelsAPI(loggedInUser);
        setData(response?.result)
    }
    useEffect(() => {
        getSkillLevels();
    }, [])


    useMemo(() => {
        if (visible && name == 'Edit' && row?.skill_level) {            
            const arr = JSON.parse(row?.skill_level)
            reset({
                "firstname": row.firstname,
                "lastname": row.lastname,
                "mobileno": row?.mobileno,
                "age_group": moment(row.age_group).format('MM-DD-yyyy'),
                "gender": row.gender,
                "skill_level": JSON.stringify({ label: arr?.label, value: arr?.value }),
                "location": row.location,
            })
        }

    }, [visible])

    return (
        <Modal
            title={customTitle}
            visible={visible}
            onOk={onConfirm}
            width={"40%"}
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
                            <label htmlFor="firstName" className="form-lable">First name<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="firstName"
                                    placeholder="Enter first name"
                                    {...register('firstname', {
                                        required: {
                                            value: true,
                                            message: 'First name is required',
                                        },
                                        pattern: {
                                            value: /^[^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*$/,
                                            message: 'Please enter a valid name with at least three alphabet characters',
                                        },
                                    })}
                                    style={{ borderColor: errors?.firstname ? 'red' : 'initial' }}
                                />

                            </div>
                            {errors?.firstname && (
                                <span className="error-message">
                                    {errors.firstname.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="lastName" className="form-lable">Last name<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="lastName"
                                    placeholder="Enter last name"
                                    {...register('lastname', {
                                        required: {
                                            value: true,
                                            message: 'Last name is required',
                                        },
                                        pattern: {
                                            value: /^[^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*[a-zA-Z][^\d_!@#$%^&*()_+={}\[\]:;<>,./?\\|`~'"-]*$/,
                                            message: 'Please enter a valid name with at least three alphabet characters',
                                        },
                                    })}
                                    style={{ borderColor: errors?.lastname ? 'red' : 'initial' }}
                                />

                            </div>
                            {errors?.lastname && (
                                <span className="error-message">
                                    {errors.lastname.message}
                                </span>
                            )}
                        </div>
                        {
                            !row._id &&
                            <>
                                <div className="input-group">
                                    <label htmlFor="pincode" className="form-lable">Email ID<span style={{ color: "red" }}>*</span></label>
                                    <div className="form-group">
                                        <input
                                            className="form-field"
                                            type="email"
                                            id="pincode"
                                            placeholder="Enter email id"
                                            {...register('email', {
                                                required: {
                                                    value: !row._id ? true : false,
                                                    message: 'Email is required',
                                                },
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                                    message: 'Enter a valid email address',
                                                },
                                            })}
                                            style={{ borderColor: errors?.email ? 'red' : 'initial' }}
                                        />
                                    </div>
                                    {errors?.email && (
                                        <span className="error-message">
                                            {errors.email.message}
                                        </span>
                                    )}
                                </div>
                                <div className="input-group">
                                    <label htmlFor="pincode" className="form-lable">Phone Number<span style={{ color: "red" }}>*</span></label>
                                    <div className="form-group">
                                        <input
                                            className="form-field"
                                            type="number"
                                            id="pincode"
                                            placeholder="Enter phone number"
                                            {...register('mobileno', {
                                                required: {
                                                    value: !row._id ? true : false,
                                                    message: 'Phone number is required',
                                                },
                                                pattern: {
                                                    value: /^\d{10}$/,
                                                    message: 'Please enter a valid 10-digit phone number',
                                                },
                                            })}
                                            style={{ borderColor: errors?.mobileno ? 'red' : 'initial' }}
                                        />

                                    </div>
                                    {errors?.mobileno && (
                                        <span className="error-message">
                                            {errors.mobileno.message}
                                        </span>
                                    )}
                                </div>
                            </>
                        }
                        <div className="input-group">

                            <label htmlFor="gender" className="form-lable">Gender<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <select
                                    id="skill"
                                    {...register("gender", {
                                        required: {
                                            value: !row._id ? true : false,
                                            message: "Gender is required",
                                        }
                                    })}
                                >
                                    <option value="" >Select Gender</option>
                                    <option value="Male" >Male</option>
                                    <option value="Female" >Female</option>
                                </select>

                            </div>
                            {errors?.gender && (
                                <span className="error-message">
                                    {errors.gender.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">

                            <label htmlFor="date of birth" className="form-lable">Date of Birth<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    max={currentDate}
                                    className="form-field"
                                    // max={today}
                                    type='date'
                                    id="date of births"
                                    placeholder=""
                                    {...register('age_group', {
                                        required: {
                                            value: !row._id ? true : false,
                                            message: "Date of Birth is required",
                                        },
                                        max: {
                                            value: today,
                                            message: 'Date of Birth cannot be in the future',
                                        },
                                    })}
                                    style={{ borderColor: errors?.age_group ? 'red' : 'initial' }}
                                />

                            </div>
                            {errors?.age_group && (
                                <span className="error-message">
                                    {errors.age_group.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="skill">Skill<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <select
                                    id="skill"
                                    {...register("skill_level", {
                                        required: {
                                            value: true,
                                            message: "Skill is required",
                                        },
                                    })}
                                >
                                    <option value="" >Select Skill</option>
                                    {data?.map((skill: any) => <option value={JSON.stringify({ "label": skill?.label, "value": skill?.value })}> {skill.label}</option>)
                                    }
                                </select>

                            </div>
                            {errors?.skill_level && (
                                <span className="error-message">
                                    {errors.skill_level.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="pincode" className="form-lable">Pincode<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="number"
                                    id="pincode"
                                    placeholder="Enter pincode"
                                    {...register('location', {
                                        required: {
                                            value: !row._id ? true : false,
                                            message: "Pincode is required",
                                        },
                                        pattern: {
                                            value: /^\d{6}$/,
                                            message: 'Please enter a valid 6-digit pin code',
                                        },
                                    })}
                                    style={{ borderColor: errors?.location ? 'red' : 'initial' }}
                                />

                            </div>
                            {errors?.location && (
                                <span className="error-message">
                                    {errors.location.message}
                                </span>
                            )}
                        </div>

                    </div>
                    <Footer className='ant-modal-footer'>
                        <button type="button" className="pi-btn-secondary" onClick={() => { onCancel(); reset(); }}>Cancel</button>
                        <button type="submit" className="pi-btn-primary"> {row._id ? 'Save' : 'Add'}</button>
                    </Footer>
                </form>
            </div >
        </Modal >
    );
};

export default AddUsers;
