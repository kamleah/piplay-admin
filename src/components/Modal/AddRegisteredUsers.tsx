import { Modal } from 'antd';
import React, { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';

import makeAnimated from "react-select/animated";
import Select from "react-select";
const AddRegisteredUsers = ({
    open,
    toggle,
    editdata,
    edit,
    coupon,
    setEdit,
    skills,
    Events,
}) => {
    const form = useForm({
        defaultValues: {
            tournament_id: "",
            user_id: "",
            firstname: "",
            lastname: "",
            email: "",
            mobileno: "",
            payment_method: "",
            payment_status: "",
            skills_Level: "",
            dob: "",

        },
    });
    const { register, handleSubmit, reset, watch, control, formState } = form;
    const { errors } = formState;
    const [selectedTournament, setSelectedTournament] = useState('');
    const currentDate = new Date().toISOString().split("T")[0];
    const [selectedSkillLevels, setSelectedSkills] = useState('')
    const loggedInUser = localStorage.getItem("auth");
    const closingFunctions = () => {
        toggle(!open);
        reset();
        setEdit(false);

    };
    const animatedComponents = makeAnimated();

    const onSubmit = async (data: any) => {
        let level: { label: string, value: string }[] = [];
        data.skills_Level = data.skills_Level.map(item => {
            return (
                {
                    "label": item.label,
                    "value": item.value
                }
            )
        })
        data.skills_Level = JSON.stringify(data.skills_Level);

        data.user_id = `${data.firstname} ${data.lastname}`
        data.email = data.email
        data.payment_method = data.payment_method
        data.payment_status = data.payment_status
        data.mobileno = Number(data?.mobileno);
        var date = Math.round(+new Date() / 1000);

        console.log(data)
        let response;
        // response = await createAllRegisteredUserAPI(loggedInUser, data);
        console.log(response)
        // if (edit == false) {

        //     response = await createAllRegisteredUserAPI(loggedInUser, data);

        // } else if (edit == true && copy == true) {
        //     response = await createAllRegisteredUserAPI(loggedInUser, data);
        // }


    }
    useMemo(() => {
        if (edit == true) {
            reset({
                tournament_id: editdata.tournament_id,
                user_id: editdata.user_id,
                email: editdata.email,
                mobileno: editdata?.mobileno,
                payment_status: editdata.payment_status,
                payment_method: editdata.payment_method,
                // skills_Level: editdata.skills_Level,
                dob: editdata.dob,


            });
        } else {
            reset({});
            setEdit({});
        }
        console.log(edit)
    }, [open]);
    return (
        <div>
            <Modal
                className="top-margin"
                open={open}
                title={edit == true ? "Edit Registered" : "Add Registerd Users"}
                onCancel={closingFunctions}
                footer={null}
                width={"30%"}
                centered
            >
                <div className="form-container">
                    <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-container">
                            <div className="form-column">
                                <div className="form-group">
                                    <label>Tournament:</label>
                                    <select
                                        value={selectedTournament}
                                        {...register("tournament_id", {
                                            required: {
                                                value: true,
                                                message: "tournament name is required",
                                            },
                                        })}
                                        onChange={(e) => setSelectedTournament(e.target.value)}>
                                        <option value="">Select Tournament</option>
                                        {Events?.map((tournament) => (
                                            <option key={tournament} value={tournament?.value}>
                                                {tournament?.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors?.tournament_id && (
                                        <span className="error-message">
                                            {errors.tournament_id.message}
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="location">Skill Level</label>
                                    <Controller
                                        name="skills_Level"
                                        control={control}
                                        rules={{
                                            required: {
                                                value: true,
                                                message: "Skill Level is required",
                                            },
                                        }}
                                        defaultValue={
                                            edit == true &&
                                            JSON.parse(editdata.skills_Level).map((item) => {
                                                return {
                                                    value: item.value,
                                                    label: item.label,
                                                };
                                            })
                                        }
                                        render={({ field }) => (
                                            <Select
                                                closeMenuOnSelect={false}
                                                className="controller-selects"
                                                components={animatedComponents}
                                                // defaultValue={[colourOptions[4], colourOptions[5]]}
                                                isMulti
                                                options={skills}
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors?.skills_Level && (
                                        <span className="error-message">
                                            {errors.skills_Level.message}
                                        </span>
                                    )}
                                </div>


                                <div className="form-group">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        {...register("firstname", {
                                            required: {
                                                value: true,
                                                message: "First Name is required",
                                            },
                                        })}
                                    />
                                    {errors?.firstname && (
                                        <span className="error-message">
                                            {errors.firstname.message}
                                        </span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        {...register("lastname", {
                                            required: {
                                                value: true,
                                                message: "Last Name is required",
                                            },
                                        })}
                                    />
                                    {errors?.lastname && (
                                        <span className="error-message">
                                            {errors.lastname.message}
                                        </span>
                                    )}
                                </div>


                                <div className="form-group">
                                    <label >Email</label>
                                    <input
                                        type="text"

                                        placeholder="Email"
                                        {...register("email", {
                                            required: {
                                                value: true,
                                                message: "Email is required",
                                            },
                                        })}

                                    />
                                    {errors?.email && (
                                        <span className="error-message">
                                            {errors.email.message}
                                        </span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label >Phone Number</label>
                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        {...register("mobileno", {
                                            required: {
                                                value: true,
                                                message: "Phone Number is required",
                                            },
                                        })}

                                    />
                                    {errors?.mobileno && (
                                        <span className="error-message">
                                            {errors.mobileno.message}
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label >Payment Method</label>
                                    <input
                                        type="text"
                                        placeholder="Payment Method"
                                        {...register("payment_method", {
                                            required: {
                                                value: true,
                                                message: "Payment method is required",
                                            },
                                        })}

                                    />
                                    {errors?.payment_method && (
                                        <span className="error-message">
                                            {errors.payment_method.message}
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label >Payment Status</label>
                                    <input
                                        type="text"
                                        placeholder="Payment Status"
                                        {...register("payment_status", {
                                            required: {
                                                value: true,
                                                message: "Payment status is required",
                                            },
                                        })}

                                    />
                                    {errors?.payment_status && (
                                        <span className="error-message">
                                            {errors.payment_status.message}
                                        </span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label>DOB:</label>
                                    <input
                                        max={currentDate}
                                        type="date"
                                        placeholder="Price"
                                        {...register("dob", {
                                            required: {
                                                value: true,
                                                message: "Start Date is required",
                                            },
                                        })}
                                    />
                                    {errors?.dob && (
                                        <span className="error-message">
                                            {errors.dob.message}
                                        </span>
                                    )}
                                </div>



                            </div>

                        </div>
                        <div className="form-actions">
                            <button type="submit" className="form-submitButton">
                                {edit == true ? "Save Registered" : "Add Registerd"}
                            </button>
                            <button
                                type="button"
                                className="form-cancelButton"
                                onClick={closingFunctions}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

            </Modal>
        </div>
    )
}

export default AddRegisteredUsers