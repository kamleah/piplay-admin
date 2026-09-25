import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "antd";
import { useForm } from 'react-hook-form'
import "../css/style.css";
import { toast } from "react-toastify";
import ToastMessage from "../../page/facilator/ToastMessage/ToastMessage";
import { createEventVenueAPI, createSkillLevelAPI, editEventVenueAPI, editSkillLevelAPI } from "../apiFile/Service";
import * as Constants from "../../components/apiFile/Constants";
import {
    AimOutlined
} from "@ant-design/icons";
import { Footer } from "antd/es/layout/layout";
import { Icon } from "@iconify-icon/react";
interface IFacility {
    address: string,
    city: string,
    email: string,
    state: string,
    pincode: string,
    name: string,
    location: {
        lat: '',
        lon: ''
    },
    ratings: string,
    sport_type: string,
    mobileno: string,
    image: string,
    alternatemobileno: string,
    manager_name: string
}
const AddEventVenue = ({
    visible, setvisible, name, onConfirm,
    getEventVenues,
    editdata,
    edit,
    setEdit,
    setEditData,
    facilities,
    row,
}) => {

    const [userLocation, setUserLocation] = useState<null | {
        latitude: number;
        longitude: number;
    }>(null);
    const [defaultfacilitydata, setDefaultfacilitydata] = useState({ image: "" })
    const form = useForm({
        defaultValues: {
            name: "",
            address: "",
            phone_no: "",
            location_city: "",
            image: "",
            location_state: "",
            pincode: "",
            ratings: "",
            lat: "",
            lon: "",
            location: "",
            sport_type: "",
            facility_id: "",
            alt_phone_no: "",
            poc: ""
        }
    })

    const { register, handleSubmit, reset, setValue, formState } = form;
    const { errors } = formState;
    const loggedInUser = localStorage.getItem("auth");
    const [previewImage, setPreviewImage] = useState('');

    const customTitle = (
        <div className="custom-ant-modal-header">
            {edit == true ? "Edit Venue" : "Add Venue"}
        </div>
    );

    const onCancel = () => {
        console.log("cancel")
        setEditData({})
        setPreviewImage('')
        setDefaultfacilitydata({ image: "" })
        setValue('facility_id', '');
        setvisible(false);
        setEdit(false)
    }

    const fileURL = async (data, date) => {
        const params = {
            ACL: "public-read",
            Body: data[0],
            Bucket: `${Constants.S3_BUCKET}events`,
            Key: `${date}_VE_${data[0].name}`,
        };

        Constants.myBucket.upload(params, function (err, uploadData) {
            if (uploadData) {
                data = uploadData.Location;
                return (data);
            } else {
                console.log("error", err);
            }
        });
    }

    const onSubmit = async (data: any) => {
        let response
        var date = Math.round(+new Date() / 1000);
        if (typeof data.image != 'string') {
            await fileURL(data.image, date)
            data.image = `${Constants.BaseLink}events/${date}_VE_${data.image[0].name}`;
        } else if (edit == true) {
            data.image = editdata.image
        } else {
            if (defaultfacilitydata?.image != "NO Image Added") {
                data.image = defaultfacilitydata;
            } else {
                data.image = "NO Image Added"
            }
        }
        data.location = {
            "lat": `${data.lat}`,
            "lon": `${data.lon}`
        }
        data.alt_phone_no = String(data.alt_phone_no)
        data.phone_no = String(data.phone_no)
        data.pincode = Number(data.pincode)
        data.ratings = Number(data.ratings)
        if (edit == true) {
            response = await editEventVenueAPI(loggedInUser, data, editdata._id);
        } else {
            response = await createEventVenueAPI(loggedInUser, data);
        }
        if (response.statusCode == 0) {
            getEventVenues();
            toast(<ToastMessage body={edit == true ? "Venue Edited Successfully" : "Venue Added Successfully"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            reset();
            onCancel();
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
    // const onChange = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const fileType = file.type;
    //         if (!fileType.startsWith('image/')) {

    //             event.target.value = '';
    //         }
    //     }
    // };
    useMemo(() => {
        reset({});
        if (edit == true) {
            reset({
                'name': row?.name,
                'phone_no': row?.phone_no,
                'address': row?.address,
                'location_city': row?.location_city,
                'location_state': row?.location_state,
                'ratings': row?.ratings,
                'lat': row?.location?.lat,
                'lon': row?.location?.lon,
                'pincode': row?.pincode,
                "facility_id": row?.facility_id,
                'poc': row?.poc,
                'alt_phone_no': row?.alt_phone_no,
                'sport_type': row?.sport_type,
                'image': row?.image
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
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setValue("location", `${latitude},${longitude}`)
                    setUserLocation({ latitude, longitude });
                },
                (error) => {
                    console.error("Error getting user location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div>
            <Modal

                title={customTitle}
                visible={visible}

                onCancel={() => {
                    onCancel();
                    reset();
                }}
                footer={null}
                className="custom-ant-modal lable-content-width"
                width={'50%'}
                centered
            >
                <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-container-grid border-bottom-light">

                        <div className="input-group">
                            <label htmlFor="skillLevel">Name<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="skillLevel"
                                    placeholder="Venue Name"
                                    {...register('name', {
                                        required: {
                                            value: true,
                                            message: 'Venue name is required',
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
                        {
                            !row._id &&
                            <>
                                <div className="input-group">
                                    <label htmlFor="skillLevel">Facility<span style={{ color: "red" }}></span></label>
                                    <div className="form-group">
                                        <select id="facility" className="form-field"  {...register('facility_id')}
                                            onChange={async (e) => {
                                                const result = await facilities?.find((facility: any) => { return facility._id == e.target.value });
                                                setDefaultfacilitydata(result?.image)
                                                setPreviewImage(result?.image);
                                                reset({
                                                    'name': result?.name,
                                                    'phone_no': result?.mobileno[0],
                                                    'address': result?.address,
                                                    'location_city': result?.city,
                                                    'location_state': result?.state,
                                                    'ratings': result?.ratings,
                                                    'lat': result?.location?.lat,
                                                    'lon': result?.location?.lon,
                                                    'pincode': result?.pincode,
                                                    'image': result?.image,
                                                    "facility_id": result?.facility_id,
                                                    'poc': result?.manager_name,
                                                    'alt_phone_no': result?.mobileno[1],
                                                    'sport_type': result?.sport_type,
                                                })
                                            }}
                                        >
                                            <option value="" >Select Facility</option>
                                            {facilities?.map((facility: any) => { return <option key={facility.id} value={facility._id ? facility._id : facility.id}>{facility.name}</option> }
                                            )}
                                        </select>
                                    </div>
                                    {errors?.facility_id && (
                                        <span className="error-message">
                                            {errors.facility_id.message}
                                        </span>
                                    )}
                                </div>
                            </>
                        }
                        <div className="input-group">

                            <label htmlFor="skillLevel">Address<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="skillLevel"
                                    placeholder="Venue Address"
                                    {...register('address', {
                                        required: {
                                            value: true,
                                            message: 'Address is required',
                                        },
                                    })}

                                />

                            </div>
                            {errors?.address && (
                                <span className="error-message">
                                    {errors.address.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="skillLevel"> City<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="skillLevel"
                                    placeholder=" City"
                                    {...register('location_city', {
                                        required: {
                                            value: true,
                                            message: ' City is required',
                                        },
                                        pattern: {
                                            value: /^[A-Za-z\s]+$/,
                                            message: 'Please enter a valid alphabetic value for location city',
                                        },
                                    })}
                                    style={{ borderColor: errors?.location_city ? 'red' : 'initial' }}

                                />
                            </div>
                            {errors?.location_city && (
                                <span className="error-message">
                                    {errors.location_city.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="skillLevel"> State<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="skillLevel"
                                    placeholder=" State"
                                    {...register('location_state', {
                                        required: {
                                            value: true,
                                            message: 'State is required',
                                        },
                                        pattern: {
                                            value: /^[A-Za-z\s]+$/,
                                            message: 'Please enter a valid alphabetic value for location state',
                                        },
                                    })}
                                    style={{ borderColor: errors?.location_state ? 'red' : 'initial' }}

                                />
                            </div>
                            {errors?.location_state && (
                                <span className="error-message">
                                    {errors.location_state.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="skillLevel">Pin-code<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    type="number"
                                    id="skillLevel"
                                    placeholder="Pin Code"
                                    {...register('pincode', {
                                        required: {
                                            value: true,
                                            message: 'Pincode is required',
                                        },
                                        pattern: {
                                            value: /^\d{6}$/,
                                            message: 'Please enter a valid 6-digit pin code',
                                        },
                                    })}
                                    style={{ borderColor: errors?.pincode ? 'red' : 'initial' }}

                                />
                            </div>
                            {errors?.pincode && (
                                <span className="error-message">
                                    {errors.pincode.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="skillLevel">Location Latitude<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="skillLevel"
                                    placeholder="Location Latitude"
                                    {...register('lat', {
                                        required: {
                                            value: true,
                                            message: 'Latitude is required',
                                        },
                                        pattern: {
                                            value: /^-?([0-8]?[0-9]|90)\.\d{1,6}$/,
                                            message: 'Please enter a valid latitude value for example: 19.0760',
                                        },
                                    })}
                                    style={{ borderColor: errors?.lat ? 'red' : 'initial' }}

                                />
                            </div>
                            {errors?.lat && (
                                <span className="error-message">
                                    {errors.lat.message}
                                </span>
                            )}
                        </div>



                        <div className="input-group">
                            <label htmlFor="skillLevel">Location Longitude<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="skillLevel"
                                    placeholder="Location Longitude"
                                    {...register('lon', {
                                        required: {
                                            value: true,
                                            message: 'Longitude is required',
                                        },
                                        pattern: {
                                            value: /^-?([0-8]?[0-9]|90)\.\d{1,6}$/,
                                            message: 'Please enter a valid longitude value for example: 33.0760',
                                        },
                                    })}
                                    style={{ borderColor: errors?.lon ? 'red' : 'initial' }}

                                />
                            </div>
                            {errors?.lon && (
                                <span className="error-message">
                                    {errors.lon.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="skillLevel">Phone No<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="skillLevel"
                                    placeholder="Venue Number"
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
                                    style={{ borderColor: errors?.phone_no ? 'red' : 'initial' }}

                                />
                            </div>
                            {errors?.phone_no && (
                                <span className="error-message">
                                    {errors.phone_no.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="skillLevel">Alternate Number</label>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="skillLevel"
                                    placeholder="Venue Number"
                                    {...register('alt_phone_no', {                                        
                                        pattern: {
                                            value: /^\d{10}$/,
                                            message: 'Please enter a valid 10-digit phone number',
                                        },
                                    })}
                                    style={{ borderColor: errors?.alt_phone_no ? 'red' : 'initial' }}
                                />
                            </div>
                            {errors?.alt_phone_no && (
                                <span className="error-message">
                                    {errors.alt_phone_no.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="location">Sport Type<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <select
                                    id="location"
                                    {...register('sport_type', {
                                        required: {
                                            value: true,
                                            message: 'Sport type is required',
                                        },
                                    })}
                                >
                                    <option value="">Type</option>
                                    <option value="all">All</option>
                                    <option value="padel">Padel</option>
                                    <option value="pickleball">Pickleball</option>

                                </select>
                            </div>
                            {errors?.sport_type && (
                                <span className="error-message">
                                    {errors.sport_type.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="skillLevel">POC<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="skillLevel"
                                    placeholder="POC Name"
                                    {...register('poc', {
                                        required: {
                                            value: true,
                                            message: 'POC is required',
                                        },
                                        pattern: {
                                            value: /^[A-Z][a-zA-Z0-9` !@#$%^&*()_+{}\[\]:;"'<>,.?/\|`~-]*$/,
                                            message: 'Please enter a valid name with at least three alphabet characters',
                                        },
                                    })}
                                    style={{ borderColor: errors?.poc ? 'red' : 'initial' }}
                                />
                            </div>
                            {errors?.poc && (
                                <span className="error-message">
                                    {errors.poc.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="skillLevel">Image<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    type="file"
                                    id="skillLevel"
                                    placeholder="Image"
                                    accept="image/x-png,image/gif,image/jpeg"
                                    {...register('image', {
                                        required: {
                                            value: edit == true ? false : defaultfacilitydata?.image != "" ? false : true,
                                            message: 'Image is required',
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


                        <div className="input-group">

                            <label htmlFor="skillLevel">Rating<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="skillLevel"
                                    placeholder="Rating"
                                    {...register('ratings', {
                                        required: {
                                            value: true,
                                            message: 'Rating is required',
                                        },
                                    })}
                                />

                            </div>
                            {errors?.ratings && (
                                <span className="error-message">
                                    {errors.ratings.message}
                                </span>
                            )}
                        </div>
                        {(previewImage != "" || editdata?.image || defaultfacilitydata?.image) &&
                            <div className="input-group col-span-2">
                                <div className='label-pre'>
                                    <label htmlFor="myCheckbox"><strong>Image Preview</strong> </label>
                                    {(editdata?.image && previewImage === "") && <button type="button" onClick={handleDownloadImage} className="pi-btn-primary"><div className="pi-btn-content"><Icon icon="material-symbols:download" width="16" height="16" style={{ color: "white" }} /></div></button>}

                                </div>
                                {previewImage !== "" ? <img src={previewImage} className="image-preview-app-card" /> : < img src={editdata?.image} className="image-pre" />}
                            </div>}


                    </div>
                    <Footer className='ant-modal-footer'>
                        <button type="button" style={{ marginRight: 0 }} className="pi-btn-secondary" onClick={() => { onCancel(); reset(); }}>Cancel</button>
                        <button type="submit" className="pi-btn-primary">{edit == true ? "Save" : "Add"}</button>
                    </Footer>
                </form>
            </Modal >
        </div >
    );
};
export default AddEventVenue;
