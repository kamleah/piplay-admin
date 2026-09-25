import { Modal, Tooltip, Button, Switch } from 'antd'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { addFacilityApi, CreateFacilityUser, getCheckRulesAPI, getFacilityApi, editFacilityAPI, } from '../apiFile/Service';
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Controller } from 'react-hook-form'
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';
import * as Constants from "../../components/apiFile/Constants";
import { Footer } from 'antd/es/layout/layout';
import JoditEditor from "jodit-react";
import { createAddOnsAPI, getAddOnAPi, patchAddOnAPI, deleteAddOnAPI } from '../apiFile/Service';
import { Icon } from "@iconify-icon/react";
import { useSelector } from 'react-redux';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Swal from 'sweetalert2'


interface Equipment {
    addOnName: string;
    addOnPrice: number;
    user_id: string;
    extraInfo: string;
    facility_id: string;
}

const AddFacilityManagement = ({ getAllFacility, row, visible, setvisible, name, onConfirm, edit, editdata, setEditData, setEdit, setpaymentModal }) => {
    const form = useForm({
        defaultValues: {
            file: "",
            name: "",
            address: "",
            lat: "",
            lon: "",
            mobileno: "",
            email: "",
            sport_type: "",
            manager_name: "",
            ratings: "",
            amenities: "",
            description: "",
            number_of_courts: "",
            number_of_users: "",
            court_type: "",
            slot_size: '',
            end: "",
            start: "",
            days: "",
            city: "",
            state: "",
            pincode: "",
            alternatemobileno: "",
            gst_no: "",
            image: "",
            logo: "",
            booking_days: "",
            cancellation_cutoff_time: "",
            cancellation_fee_percentage: "",
            pan_no: "",
            cancel_cutoff_button_disable_time: "",
            reschedule_cutoff_button_disable_time: "",
            pi_cut: "",
            gst: "",
            facility_id: "",
            no_of_reschedules: "",
            activation_date: "",
            acceptance_date: "",
            pay_cash: "",
            order_by: "",
            min_slot_selection_for_booking: "",
            max_hrs_slots_selection_for_booking: "",
            addOnName: "",
            addOnPrice: "",
            user_id: "",
            extraInfo: "",
        }
    })
    const { register, handleSubmit, reset, watch, setError, clearErrors, setValue, formState, control } = form;
    const { errors } = formState;
    const navigate = useNavigate();
    const [UserFacilityID, setUserFacilityID] = useState('');
    const animatedComponents = makeAnimated();
    const [previewImage, setPreviewImage] = useState<string[]>([])
    const [previewImage1, setPreviewImage1] = useState('');
    const [singleCategoryPackages, setSingleCategoryPackages] = useState([
        { addOnName: "", addOnPrice: "", user_id: '', extraInfo: '', facility_id: '', _id: undefined },
    ]);
    const [deserror, setDescriptionErr] = useState('');
    const [Phone, setPhone] = useState('in')
    const [AlternatePhone, setAlternatePhone] = useState('in')
    const [userLocation, setUserLocation] = useState<null | {
        latitude: number;
        longitude: number;
    }>(null);
    const [equipments, setEquipments] = useState([
        { id: 1, name: "", price: "", info: "" },
    ]);

    const loggedInUser = localStorage.getItem("auth");
    const customTitle = (
        <div className="custom-ant-modal-header">
            {row._id ? 'Edit Facility' : "Add Facility"}
        </div>
    );


    const getAddOns = async (auth, id) => {
        try {
            const response = await getAddOnAPi(auth, id);
            console.log("getAddOnAPi", response);
            if (response.data.length > 0) {
                setEnableBulkCategory(true);
                if (response.code == "SUCCESS") {

                    setSingleCategoryPackages(response.data);
                }
            }
            return response.data;
        } catch (error) {
            console.log("Error", error);
        }
    };

    //   useEffect(() => {
    //     if (edit && editdata._id) {
    //       getAddOns(loggedInUser, editdata._id).then((response) => {
    //         setSingleCategoryPackages(response);
    //         console.log(" setSingleCategoryPackages", response)
    //       });
    //     }
    //      else {
    //         setSingleCategoryPackages([{ addOnName: "", addOnPrice: "", user_id: '', extraInfo: '', facility_id: '', }]);
    //         console.log("singleCategoryPackages", singleCategoryPackages);

    //     }
    //   }, [edit, editdata, loggedInUser]);


    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                    setValue("lat", `${latitude.toFixed(6)}`)
                    setValue("lon", `${longitude.toFixed(6)}`)
                },
                (error) => {
                    console.error("Error getting user location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };
    useEffect(() => {
        if (!edit && visible) {
            getUserLocation();
        }
    }, [edit, visible]);

    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)

    // const handleCancel = () => {
    //     setOpen(false);
    // };
    // const handleOk = () => {
    //     setLoading(true);
    //     setTimeout(() => {
    //         setLoading(false);
    //         setOpen(false);
    //     }, 3000);
    // };


    const onCancel = () => {
        setEditData({})
        setPreviewImage([])
        setPreviewImage1('')
        setvisible(false);
        setEdit(false)
    }
    const [description, setDescription] = useState("")
    const editor = useRef(null);
    const fileURL = (data, date) => {
        return new Promise((resolve, reject) => {
            const params = {
                ACL: "public-read",
                Body: data,
                Bucket: `${Constants.S3_BUCKET}events`,
                Key: `${date}_facilityImage_${data.name}`,
            };

            Constants.myBucket.upload(params, function (err, uploadData) {
                if (err) {
                    console.error("error", err);
                    reject(err);
                } else {
                    resolve(uploadData.Location);
                }
            });
        });
    };

    const apiCall = async ({ mobileno, e }) => {

        var res
        res = await addFacilityApi(loggedInUser, e);

        if (res?.result) {

            // if (edit == false) {
            //     setpaymentModal(true)
            // }
            var mobilenoAsInt = Number(mobileno);
            let updatedData = {
                mobileno: mobilenoAsInt,
                facilityId: res?.result?.id
            }
            await CreateFacilityUser(loggedInUser, updatedData);
            getAllFacility();
            toast(<ToastMessage body={row._id ? "Facility Updated Successfully" : "Facility Added Successfully"} type="success" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            if (enableBulkCategory) {
                for (let i = 0; i <= singleCategoryPackages.length - 1; i++) {
                    const payload = {
                        "addOnName": singleCategoryPackages[i].addOnName,
                        "addOnPrice": Number(singleCategoryPackages[i].addOnPrice),
                        "user_id": res.result.id,
                        "extraInfo": singleCategoryPackages[i].extraInfo,
                        "facility_id": res.result.id
                    }

                    const response = await createAddOnsAPI(loggedInUser, payload);

                }
            }
            setPreviewImage([]);
            setPreviewImage1('');
            reset();
            onCancel();
            // setOpen(!open);
            // setTimeout(() => {
            //     navigate("/FacilityManagement");
            // }, 3000);            
        } else {
            toast(<ToastMessage body={`${res.statusCode ? res.statusCode : "Error,Failed to add"}`} type="error" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    const CheckRules = async ({ mobileno, facilityId, e }) => {

        let response
        if (!loggedUserDetails?.roleId) {
            response = await getCheckRulesAPI(loggedInUser, mobileno);

            if (response?.result?.msg == "USER_ACCOUNT_ALREADY_EXIST") {
                Swal.fire({
                    title: 'Warning!',
                    text: 'User Already Exist Do you Want to Continue',
                    icon: 'warning',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    showCancelButton: true,
                }).then((result) => {

                    if (result.isConfirmed) {
                        apiCall({ mobileno, e })
                        // console.log('USer Clicked yes');
                    } else if (result.isDismissed) {

                        // console.log('USer Clicked No');
                    }
                })
            } else if (response?.result?.msg == "THIS_USER_ALREADY_A_FACILITY_ACCOUNT") {
                toast(<ToastMessage body={"This Mobile Number Already have a Facility Account"} type="warning" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else if (response?.result?.msg == "USER_CAN_BE_CREATED") {
                apiCall({ mobileno, e })
            }
        }
    };

    const multiple_fileURL = async (files: any, date: number): Promise<string[]> => {

        return Promise.all(files.map((file) => {


            return new Promise<string>((resolve, reject) => {
                const params = {
                    ACL: "public-read",
                    Body: file,
                    Bucket: `${Constants.S3_BUCKET}/events`,
                    Key: `${date}_facilityImage_${file.name}`,
                };

                Constants.myBucket.upload(params, (err, data) => {
                    if (err) {
                        console.error("Error uploading file:", err);
                        reject(err);
                    } else {
                        console.log("Successfully uploaded file:", data);
                        resolve(data.Location);
                    }
                });
            });
        }));
    };


    const handleAddFacilator = async (e: any) => {

        const start_time = e?.start; // Assuming start time is in data
        const end_time = e?.end; // Assuming end time is in data

        if (end_time <= start_time) {
            toast(<ToastMessage body={"Facility can't end before start time"} type="warning" />, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        e["description"] = description
        if (description == "") {
            setDescriptionErr('Description is required')
            return
        }
        var date = Math.round(+new Date() / 1000);
        e.pincode = Number(e.pincode)
        e.booking_days = Number(e.booking_days)
        e.number_of_courts = Number(e.number_of_courts)
        e.number_of_users = Number(e.number_of_users)
        e.cancellation_fee_percentage = Number(e.cancellation_fee_percentage)
        e.cancellation_cutoff_time = Number(e.cancellation_cutoff_time)
        e.cancel_cutoff_button_disable_time = Number(e.cancel_cutoff_button_disable_time)
        e.pay_cash = Number(e.pay_cash)
        e.reschedule_cutoff_button_disable_time = Number(e.reschedule_cutoff_button_disable_time)
        e.no_of_reschedules = Number(e.no_of_reschedules)
        e.email = e.email
        e.ratings = Number(e.ratings)
        e.slot_size = Number(e.slot_size)
        e.order_by = Number(e.order_by)
        e.min_slot_selection_for_booking = Number(e.min_slot_selection_for_booking)
        e.max_hrs_slots_selection_for_booking = Number(e.max_hrs_slots_selection_for_booking)
        e.alternatemobileno = e.alternatemobileno ? e.alternatemobileno : ""
        e.mobileno = [e?.mobileno, e.alternatemobileno ? e.alternatemobileno : "0"].map(num => `+${num}`);
        e.location = {
            "lat": `${e.lat}`,
            "lon": `${e.lon}`
        }
        e.slot_size = Number(e.slot_size)
        var date = Math.round(+new Date() / 1000);

        if (typeof e.image !== 'string') {
            const fileArray = Array.from(e.image);
            e.image = await Promise.all(
                fileArray.map(async (file: any) => {
                    const url = await fileURL(file, date);
                    return `${Constants.BaseLink}events/${date}_facilityImage_${file.name}`;
                })
            );
            e.facility_images = e.image
        } else {
            if (edit) {
                e.facility_images = row.facility_images 
                e.image = Array.isArray(row.image) ? row.image : [row.image];
            } else {
                e.image = "No Image Added";
            }
        }

        if (e.logo.length > 0) {
            if (typeof e.logo != 'string') {
                await fileURL(e.logo[0], date)
                e.logo = `${Constants.BaseLink}events/${date}_facilityImage_${e.logo[0].name}`;
            } else {
                if (edit == true) {
                    e.logo = editdata.logo
                } else {
                    e.logo = "No Logo Added"
                }
            }
        } else {
            e.logo = "No Logo Added"
        }
        // e.file = `${Constants.BaseLink}facility/${date}_${e.file[0].name}`        

        var res
        if (edit == true) {
            res = await editFacilityAPI(loggedInUser, editdata._id, e);
            setUserFacilityID(res?.result?._id ?? '');

            if (res?.statusCode == 0) {
                toast(<ToastMessage body={row._id ? "Facility Updated Successfully" : "Facility Added Successfully"} type="success" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                if (singleCategoryPackages?.length > 0) {
                    for (let i = 0; i <= singleCategoryPackages?.length - 1; i++) {
                        if (singleCategoryPackages[i]?._id) {
                            const response = await patchAddOnAPI(loggedInUser, singleCategoryPackages[i]?._id, singleCategoryPackages[i])
                            console.log("patchAddOnAPI", response);

                        } else {

                            const payload = {
                                "addOnName": singleCategoryPackages[i].addOnName,
                                "addOnPrice": Number(singleCategoryPackages[i].addOnPrice),
                                "user_id": row._id,
                                "extraInfo": singleCategoryPackages[i].extraInfo,
                                "facility_id": row._id
                            }
                            const response = await createAddOnsAPI(loggedInUser, payload);
                            console.log("EditcreateAddOnsAPI", response);

                        }

                    }
                }
                getAllFacility();
                setPreviewImage([]);
                setPreviewImage1('');
                reset();
                onCancel();
            }
        } else {
            let mobileno = e?.mobileno[0];
            if (mobileno) {

                let parts = mobileno.split('91');

                if (parts.length > 1) {
                    mobileno = parts[1];
                }
            }
            const facilityId = res?.result?.id;
            CheckRules({ mobileno, facilityId, e });
            // res = await addFacilityApi(loggedInUser, e);
        }
    };
    const ammenitiesoptions: any = [
        { value: 1, label: "Indoor Court" },
        { value: 2, label: "Air Conditioned" },
        { value: 3, label: "Balls Provided" },
        { value: 4, label: "Rackets Rental" },
        { value: 5, label: "Wheelchair Accessibility" },
        { value: 6, label: "Music" },
        { value: 7, label: "Lounge Area" },
        { value: 8, label: "Parking" },
        { value: 9, label: "Washrooms" },
        { value: 10, label: "Beverages" },
        { value: 11, label: "Pro Shop" },
        { value: 12, label: "Balls Available for Sale" },
        { value: 13, label: "Ball rentals" },
        { value: 14, label: "Shower Rooms" },
        { value: 15, label: "Free Wifi" },
        { value: 16, label: "Changing Rooms" },
        { value: 17, label: "Cafe" },
    ]
    const weekdaysOptions: any = [
        { value: 1, label: "Monday" },
        { value: 2, label: "Tuesday" },
        { value: 3, label: "Wednesday" },
        { value: 4, label: "Thursday" },
        { value: 5, label: "Friday" },
        { value: 6, label: "Saturday" },
        { value: 7, label: "Sunday" }
    ]

    // const getAllFacility = async () => {
    //     let response = await getFacilityApi(loggedInUser);
    //     console.log(response, "KAMRUDDIN");
    //     setGetFacility(
    //         response?.result.map((row, index) => ({
    //             name: row.name,
    //             // description: row.description,
    //             location: row.address,
    //             contact: row.mobileno,
    //             email: row.email,

    //         }))
    //     );
    // };
    // const onChange = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const fileType = file.type;
    //         if (!fileType.startsWith('image/')) {

    //             event.target.value = '';
    //         }
    //     }
    // };
    // useEffect(() => {
    //     getAllFacility();
    // }, []);

    useEffect(() => {
        setPreviewImage([]);
        setPreviewImage1('');
        reset({});
        setValue("days", "");
        setValue("amenities", "");

        if (!edit) {
            setDescription(
                "<html>" +
                "<div><b style='color:gray;'>Reschedule policy:</b></div><span style='color:black;'></span> <br>" +
                "<b style='color:gray;'>Cancellation Policy:</b> <br>" +
                "<b style='color:gray;'>Timings:</b> <br>" +
                "<b style='color:gray;'>Guidelines:</b> <br>" +
                "<b style='color:gray;'>Amenities:</b> " +
                "</html>"
            );
            setSingleCategoryPackages([{ addOnName: "", addOnPrice: "", user_id: '', extraInfo: '', facility_id: '', _id: undefined }]);
            setEnableBulkCategory(false);
        } else {

            setDescription(row.description);
            getAddOns(loggedInUser, row._id)
            reset({
                "name": row.name,
                "address": row.address,
                "mobileno": row?.mobileno[0].replaceAll('+', ''),
                "lat": row.location.lat,
                "lon": row.location.lon,
                "email": row.email,
                "sport_type": row.sport_type,
                "manager_name": row.manager_name,
                "booking_days": row?.booking_days,
                "ratings": row.ratings,
                "slot_size": row.slot_size,
                "amenities": row.amenities?.map(e => {
                    return e;
                }),
                "number_of_courts": row.number_of_courts,
                "number_of_users": row.number_of_users,
                "court_type": row.court_type,
                "end": row.end,
                "start": row.start,
                "days": row.days?.map(e => {
                    return e;
                }),
                "city": row.city,
                "state": row.state,
                "pincode": row.pincode,
                "alternatemobileno": row?.mobileno[1] == 0 ? "" : row?.mobileno[1].replaceAll('+', ''),
                "gst_no": row.gst_no,
                "image": row.image,
                "logo": row?.logo,
                "cancellation_cutoff_time": row?.cancellation_cutoff_time,
                "cancellation_fee_percentage": row?.cancellation_fee_percentage,
                "pan_no": row?.pan_no,
                "cancel_cutoff_button_disable_time": row?.cancel_cutoff_button_disable_time,
                "reschedule_cutoff_button_disable_time": row?.reschedule_cutoff_button_disable_time,
                "no_of_reschedules": row?.no_of_reschedules,
                "acceptance_date": row?.acceptance_date,
                "activation_date": row?.activation_date,
                "pay_cash": row?.pay_cash > 9 ? row?.pay_cash : '',
                "order_by": row?.order_by,
                "min_slot_selection_for_booking": row?.min_slot_selection_for_booking,
                "max_hrs_slots_selection_for_booking": row?.max_hrs_slots_selection_for_booking,
            });
        }
    }, [visible]);


    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const fileArray = Array.from(files);
            console.log("🚀 ~ file: AddFacilityManagement.tsx:601 ~ onChange ~ fileArray:", fileArray)

            const updatedPreviewImages: string[] = [];

            fileArray.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    updatedPreviewImages.push(result);

                    // If all files are read, update the state
                    if (updatedPreviewImages.length === fileArray.length) {
                        setPreviewImage(updatedPreviewImages);
                    }
                };
                reader.readAsDataURL(file);

                const fileType = file.type;
                if (!fileType.startsWith('image/')) {
                    event.target.value = ''; // Clear input if the selected file is not an image
                }
            });
        }
    };

    const onChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // Check if file size exceeds 2 MB
                setError("image", {
                    type: "custom",
                    message: "File size exceeds 2 MB"
                });
                setPreviewImage([]);
                setTimeout(() => {
                    reset({
                        "image": '',
                    });
                }, 3000);
                return;
            } else {
                clearErrors("image"); // Clear any existing errors                
                // You might want to do something with the file here, like uploading it
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string; // Ensure TypeScript recognizes it as a string                
                setPreviewImage1(result);
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

    const handleDownloadImage1 = () => {
        if (editdata?.logo) {
            // Create a temporary anchor element
            const anchor = document.createElement('a');
            anchor.href = editdata?.logo;
            anchor.download = 'logo.jpg'; // Change the filename as needed
            anchor.click();
        }
    };


    const customStyles = {
        valueContainer: (provided) => ({
            ...provided,
            maxHeight: '30px',
            overflowY: 'auto',
            padding: '0',
        })
    };


    const config = {
        buttons: 'bold', // Only keep the bold button
        toolbarAdaptive: false, // Optionally disable adaptive toolbar
    };


    const handleEquipmentAddMore = () => {
        const newId = Math.max(...equipments.map((equipment) => equipment.id)) + 1;
        setEquipments([
            ...equipments,
            { id: newId, name: "", price: "", info: "" },
        ]);
    };

    const handleEquipmentDelete = (id) => {
        const newEquipments = equipments.filter((equipment) => equipment.id !== id);
        setEquipments(
            newEquipments.map((equipment, index) => ({ ...equipment, id: index + 1 }))
        );
    };

    const handleEquipmentChange = (id, field, value) => {
        setEquipments(
            equipments.map((equipment) =>
                equipment.id === id
                    ? { ...equipment, [field]: value }
                    : equipment
            )
        );
    };

    const addOnEquipmentSubmit = async (data: Equipment) => {
        try {

            data.facility_id = UserFacilityID;
            data.user_id = UserFacilityID;
            const response = await createAddOnsAPI(loggedInUser, data);

        } catch (error) {
            console.error("Error handling payment configuration:", error);
        }
    };

    //  ------------------------- Single Category Dynamic Fields form -----------------------


    const handleSingleCategoryPackageFieldChange = useCallback((packageIndex, fieldName, value) => {
        const updatedPackages = [...singleCategoryPackages];
        updatedPackages[packageIndex][fieldName] = value;
        setSingleCategoryPackages(updatedPackages);
    }, [singleCategoryPackages]);

    const handleSingleCategoryPackageAdd = () => {
        const newPackage = { addOnName: "", addOnPrice: "", user_id: '', extraInfo: '', facility_id: '', _id: undefined };
        setSingleCategoryPackages([...singleCategoryPackages, newPackage]);
    };

    const handleSingleCategoryPackageRemove = async (packageIndex) => {
        const packageToRemove = singleCategoryPackages[packageIndex];
        if (packageToRemove?._id) {
            await deleteAddOnAPI(loggedInUser, packageToRemove._id);
        }
        const updatedPackages = singleCategoryPackages.filter((_, pkgIndex) => pkgIndex !== packageIndex);
        setSingleCategoryPackages(updatedPackages);
    };

    const [enableBulkCategory, setEnableBulkCategory] = useState(false);

    const onChangeEnableBulkCategory = (checked: boolean) => {
        setEnableBulkCategory(checked)
    };


    return (
        <div>
            <Modal
                title={customTitle}
                visible={visible}
                className="custom-ant-modal "
                //onOk={onConfirm}
                onCancel={() => {
                    onCancel();
                    reset();
                }}
                width={'800px'}
                footer={null}
            >
                <form id="myForm" encType="multipart/form-data" onSubmit={handleSubmit(handleAddFacilator)}>
                    <div className="form-container-grid">
                        <div className="input-group">
                            <label>Facility Name<span style={{ color: "red" }}>*</span></label>
                            <div className=" form-group">
                                <input
                                    className=""
                                    type="text"
                                    placeholder="Facility Name"
                                    {...register("name", {
                                        required: {
                                            value: true,
                                            message: "Facilator Name is required",
                                        },
                                        pattern: {
                                            value: /^[A-Z][a-zA-Z0-9` !@#$%^&*()_+{}\[\]:;"'<>,.?/\|`~-]*$/, // Regex pattern for first alphabet as capital letter, followed by at least two alphabets/spaces
                                            message: 'Please enter a valid name with the first letter as a capital alphabet and at least three alphabet characters',
                                        },
                                    })}
                                    style={{ borderColor: errors?.name ? 'red' : 'initial' }}
                                />
                            </div>
                            {errors?.name && (
                                <span className="error-message">
                                    {errors?.name.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label>Address<span style={{ color: "red" }}>*</span></label>
                            <div className=" form-group">
                                <input
                                    className=""
                                    type="text"
                                    placeholder="street,area"
                                    {...register("address", {
                                        required: {
                                            value: true,
                                            message: "Address is required",
                                        },

                                    })}

                                />
                            </div>
                            {errors?.address && (
                                <span className="error-message">
                                    {errors?.address.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label>Pincode<span style={{ color: "red" }}>*</span></label>
                            <div className=" form-group">
                                <input
                                    className=""
                                    type="text"
                                    placeholder="Pincode"
                                    {...register("pincode", {
                                        required: {
                                            value: true,
                                            message: "Pincode is required",
                                        },
                                        pattern: {
                                            value: /^\d{6}$/,
                                            message: 'Please enter a valid 6-digit pin code',
                                        },
                                    })}
                                />
                            </div>
                            {errors?.pincode && (
                                <span className="error-message">
                                    {errors?.pincode.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label>State<span style={{ color: "red" }}>*</span></label>
                            <div className=" form-group">
                                <input
                                    className=""
                                    type="text"
                                    placeholder="State"
                                    {...register("state", {
                                        required: {
                                            value: true,
                                            message: "State is required",
                                        },
                                        pattern: {
                                            value: /^[A-Z][a-zA-Z\s]*$/, // Regex pattern for first alphabet as capital letter, alphabets, and spaces only
                                            message: 'Please enter a valid state name with the first letter as a capital alphabet',
                                        },
                                    })}

                                />
                            </div>
                            {errors?.state && (
                                <span className="error-message">
                                    {errors?.state.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label>City<span style={{ color: "red" }}>*</span></label>
                            <div className=" form-group">
                                <input
                                    className=""
                                    type="text"
                                    placeholder="City"
                                    {...register("city", {
                                        required: {
                                            value: true,
                                            message: "City is required",
                                        },
                                        pattern: {
                                            value: /^[A-Z][a-zA-Z\s]*$/, // Regex pattern for first alphabet as capital letter, alphabets, and spaces only
                                            message: 'Please enter a valid city name with the first letter as a capital alphabet',
                                        },
                                    })}

                                />
                            </div>
                            {errors?.city && (
                                <span className="error-message">
                                    {errors?.city.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">

                            <label>Email<span style={{ color: "red" }}>*</span></label>
                            <div className=" form-group">
                                <input
                                    className=""
                                    type="email"
                                    placeholder="Email"
                                    {...register("email", {
                                        required: {
                                            value: true,
                                            message: "Facilator Email is required",
                                        },
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                            message: 'Enter a valid email address',
                                        },
                                    })}
                                />
                            </div>
                            {errors?.email && (
                                <span className="error-message">
                                    {errors?.email.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">

                            <label>Phone Number (With country code)<span style={{ color: "red" }}>*</span></label>
                            <div className=" form-group">
                                <div>
                                    <Controller
                                        name="mobileno"
                                        control={control}
                                        rules={{
                                            required: {
                                                value: true,
                                                message: "Phone Number required",
                                            },
                                            pattern: {
                                                value: /^\+?\d{12,16}$/,
                                                message: "Invalid phone number format",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <PhoneInput
                                                inputStyle={{ padding: "0px 47px" }}
                                                country={'in'} // Example country code, replace with your logic
                                                placeholder='Enter Phone Number'
                                                onChange={(value) => field.onChange(value)}
                                                value={field.value}
                                            />
                                        )}
                                    />
                                </div>
                                {/* <input
                                    className=""
                                    type="text"
                                    placeholder="Enter Contact Number eg. +91 1234567890"
                                    {...register("mobileno", {
                                        required: {
                                            value: true,
                                            message: "Facilator Contact Number is required",
                                        },
                                        pattern: {
                                            value: /^\+\d{1,4}\s?\d{10}$/,
                                            message: 'Please enter a valid phone number',
                                        },
                                    })}

                                /> */}
                            </div>
                            {errors?.mobileno && (
                                <span className="error-message">
                                    {errors?.mobileno.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">

                            <label>Alternate Number (With country code)</label>
                            <div className=" form-group">
                                <div>
                                    <Controller
                                        name="alternatemobileno"
                                        control={control}
                                        render={({ field }) => (
                                            <PhoneInput
                                                inputStyle={{ padding: "0px 47px" }}
                                                country={'in'} // Example country code, replace with your logic
                                                placeholder='Enter Alternate Phone No.'
                                                onChange={(value) => field.onChange(value)}
                                                value={field.value}
                                            />
                                        )}
                                    />
                                </div>
                                {/* <input
                                    className=""
                                    type="text"
                                    placeholder="Enter Contact Number eg. +91 1234567890"
                                    {...register("alternatemobileno", {
                                        pattern: {
                                            value: /^\+\d{1,4}\s?\d{10}$/,
                                            message: 'Please enter a valid phone number',
                                        },
                                    })}

                                /> */}
                            </div>
                            {errors?.alternatemobileno && (
                                <span className="error-message">
                                    {errors?.alternatemobileno.message}
                                </span>
                            )}
                        </div>
                        {/* 
                        <div className="input-group">

                            <label>Phone Number<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <Controller
                                    name="phone_no"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: false,
                                            message: "Phone Number is required",
                                        },
                                    }}
                                    // defaultValue={
                                    //      edit == true &&
                                    //      JSON.parse(editdata.tournament_level).map((item) => {
                                    //           return {
                                    //                value: item.value,
                                    //                label: item.label,
                                    //           };
                                    //      })
                                    // }
                                    render={({ field }) => (
                                        <Select
                                            closeMenuOnSelect={false}
                                            className="controller-select"
                                            components={animatedComponents}
                                            // defaultValue={[colourOptions[4], colourOptions[5]]}
                                            isMulti
                                            options={phone_no}
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                            {errors?.phone_no && (
                                <span className="error-message">
                                    {errors.phone_no.message}
                                </span>
                            )}
                        </div> */}
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
                            <label htmlFor="location">Court Type<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <select
                                    id="location"
                                    {...register('court_type', {
                                        required: {
                                            value: true,
                                            message: 'Court type is required',
                                        },
                                    })}
                                >
                                    <option value="indoor">Indoor</option>
                                    <option value="outdoor">Outdoor</option>
                                    <option value="both">Both</option>
                                </select>
                            </div>
                            {errors?.court_type && (
                                <span className="error-message">
                                    {errors.court_type.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="slot_size" className="form-lable">Slot Size ( In Minutes )<span className='required-star '>*</span></label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="number"
                                    id="slot_size"
                                    placeholder="Enter slot size (in minutes ) eg. 30"
                                    {...register("slot_size", {
                                        required: {
                                            value: true,
                                            message: 'Slot size is required',
                                        },

                                    })}
                                />
                            </div>
                            {errors?.slot_size && (
                                <span className="error-message">
                                    {errors.slot_size.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="location">Days<span style={{ color: "red" }}>*</span></label>
                            <div className="form-group">
                                <Controller
                                    name="days"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Days is required",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Select
                                            styles={customStyles}
                                            closeMenuOnSelect={false}
                                            className="controller-select"
                                            components={animatedComponents}
                                            // defaultValue={[colourOptions[4], colourOptions[5]]}
                                            isMulti
                                            options={weekdaysOptions}
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                            {errors?.days && (
                                <span className="error-message">
                                    {errors.days.message}
                                </span>
                            )}
                            {/* <Select
                                name='days'
                                options={weekdaysOptions}
                                value={selectedoption}
                                onChange={handlechag}
                                isMulti={true}
                            /> */}
                            {/* </div> <div className="form-group">
                                <select
                                    id="location"
                                    {...register('days', {
                                        required: {
                                            value: true,
                                            message: 'Days is required',
                                        },
                                    })}
                                >
                                    <option value="">Type</option>
                                    <option value="monday">Monday</option>
                                    <option value="tuesday">Tuesday</option>
                                    <option value="wednesday">Wednesday</option>
                                    <option value="thursday">Thursday</option>
                                    <option value="friday">Friday</option>
                                    <option value="saturday">Saturday</option>
                                    <option value="sunday">Sunday</option>
                                </select>
                            </div>
                            {errors?.days && (
                                <span className="error-message">
                                    {errors.days.message}
                                </span>
                            )} */}
                        </div>
                        <div className="form-container-grid col-span-2-sm">
                            <div className="input-group">
                                <label>Club Opening Time<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        type="time"
                                        placeholder="Price"
                                        {...register("start", {
                                            required: {
                                                value: true,
                                                message: "Start Time is required",
                                            },
                                        })}
                                    // value={timeRange.startTime}
                                    // onChange={(e) =>
                                    //   handleTimeChange("startTime", e.target.value)
                                    // }
                                    />
                                </div>
                                {errors?.start && (
                                    <span className="error-message">
                                        {errors.start.message}
                                    </span>
                                )}
                            </div>
                            <div className="input-group">
                                <label>Club Closing Time<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        type="time"
                                        placeholder="End Time"
                                        {...register("end", {
                                            required: {
                                                value: true,
                                                message: "End Time is required",
                                            },
                                        })}
                                    // value={timeRange.startTime}
                                    // onChange={(e) =>
                                    //   handleTimeChange("startTime", e.target.value)
                                    // }
                                    />
                                </div>
                                {errors?.end && (
                                    <span className="error-message">
                                        {errors.end.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* 
                        <div className="input-group">

                            <label>Address<span style={{ color: "red" }}>*</span></label>
                            <div className=" form-group">
                                <textarea
                                    className=""
                                    placeholder="Facility Address"
                                    {...register("address", {
                                        required: {
                                            value: true,
                                            message: "Facilator Address is required",
                                        },
                                    })}
                                />
                            </div>
                            {errors?.address && (
                                <span className="error-message">
                                    {errors?.address.message}
                                </span>
                            )}
                        </div> */}
                        <div className="input-group">

                            <label>Location Latitude<span style={{ color: "red" }}>*</span></label>
                            <div className=" form-group">
                                <input
                                    className=""
                                    type="text"
                                    placeholder="Location Latitude"
                                    {...register("lat", {
                                        required: {
                                            value: true,
                                            message: "Facilator Location Latitude is required",
                                        },
                                        pattern: {
                                            value: /^-?([0-8]?[0-9]|90)\.\d{1,6}$/,
                                            message: 'Please enter a valid numeric value for latitude with up to six decimal places',
                                        },
                                    })}
                                    style={{ borderColor: errors?.lat ? 'red' : 'initial' }}
                                />
                            </div>
                            {errors?.lat && (
                                <span className="error-message">
                                    {errors?.lat.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">

                            <label>Location Longitude<span style={{ color: "red" }}>*</span></label>
                            <div className=" form-group">
                                <input
                                    className=""
                                    type="text"
                                    placeholder="Location Longitude"
                                    {...register("lon", {
                                        required: {
                                            value: true,
                                            message: "Facilator Location Longitude is required",
                                        },
                                        pattern: {
                                            value: /^-?([0-8]?[0-9]|90)\.\d{1,6}$/,
                                            message: 'Please enter a valid numeric value for Longitude',
                                        },
                                    })}
                                    style={{ borderColor: errors?.lon ? 'red' : 'initial' }}
                                />
                            </div>
                            {errors?.lon && (
                                <span className="error-message">
                                    {errors?.lon.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label>Facility Manager Name<span style={{ color: "red" }}>*</span></label>
                            <div className=" form-group">
                                <input
                                    className=""
                                    type="text"
                                    placeholder="Manager Name"
                                    {...register("manager_name", {
                                        required: {
                                            value: true,
                                            message: "Manager Name is required",
                                        },
                                        pattern: {
                                            value: /^[A-Z][a-zA-Z\s]{2,}$/, // Regex pattern for first alphabet as capital letter, followed by at least two alphabets/spaces
                                            message: 'Please enter a valid name with the first letter as a capital alphabet and at least three alphabet characters',
                                        },
                                    })}
                                />
                            </div>
                            {errors?.manager_name && (
                                <span className="error-message">
                                    {errors?.manager_name.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label>No of Users<span style={{ color: "red" }}>*</span>
                                <Tooltip
                                    title={<>
                                        <div>Please add how many number of admin users you want to add. Eg:10</div>
                                    </>
                                    } placement="right" color='#032037'>
                                    <Icon icon="ion:information-circle" className="input-info-icon" />
                                </Tooltip>
                            </label>
                            <div className=" form-group">
                                <input
                                    className=""
                                    type="number"
                                    placeholder="No of Users"
                                    {...register("number_of_users", {
                                        required: {
                                            value: true,
                                            message: "No of Users is required",
                                        },

                                    })}

                                />
                            </div>
                            {errors?.number_of_users && (
                                <span className="error-message">
                                    {errors?.number_of_users.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label>No  of Courts<span style={{ color: "red" }}>*</span></label>
                            <div className=" form-group">
                                <input
                                    className=""
                                    type="number"
                                    placeholder="No  of Courts"
                                    {...register("number_of_courts", {
                                        required: {
                                            value: true,
                                            message: "No  of Courts is required",
                                        },
                                    })}
                                    style={{ borderColor: errors?.name ? 'red' : 'initial' }}
                                />
                            </div>
                            {errors?.number_of_courts && (
                                <span className="error-message">
                                    {errors?.number_of_courts.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label>Amenities<span style={{ color: "red" }}>*</span></label>
                            < div className="form-group">
                                <Controller
                                    name="amenities"
                                    control={control}
                                    rules={{
                                        required: {
                                            value: true,
                                            message: "Amenities is required",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Select
                                            styles={customStyles}
                                            closeMenuOnSelect={false}
                                            className="controller-select"
                                            components={animatedComponents}
                                            // defaultValue={[colourOptions[4], colourOptions[5]]}
                                            isMulti
                                            options={ammenitiesoptions}
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                            {/* <div className="form-group">
                                <select
                                    id="location"
                                    {...register('amenities', {
                                        required: {
                                            value: true,
                                            message: 'Amenitie is required',
                                        },
                                    })}
                                >
                                    <option value="">Type</option>
                                    <option value="indoor court">Indoor Court</option>
                                    <option value="air conditioned">Air Conditioned</option>
                                    <option value="balls provided">Balls Provided</option>
                                    <option value="rackets rental">Rackets Rental</option>
                                    <option value="wheelchair accessibility">Wheelchair Accessibility</option>
                                    <option value="music">Music</option>
                                    <option value="Lounge Areas">Lounge Areas</option>
                                    <option value="parking parking">Parking Parking</option>
                                    <option value="washrooms">Washrooms</option>
                                </select>
                            </div> */}
                            {errors?.amenities && (
                                <span className="error-message">
                                    {errors?.amenities.message}
                                </span>
                            )}
                        </div>

                        <div className="input-group">
                            <label>Rating<span style={{ color: "red" }}>*</span>
                                <Tooltip
                                    title={<>
                                        <div>Please select a rating from 1 to 5 stars to reflect your experience.</div>
                                    </>
                                    } placement="right" color='#032037'>
                                    <Icon icon="ion:information-circle" className="input-info-icon" />
                                </Tooltip>
                            </label>
                            <div className=" form-group">
                                <input
                                    className=""
                                    step={"0.1"}
                                    type="number"
                                    placeholder="Rating"
                                    {...register("ratings", {
                                        required: {
                                            value: true,
                                            message: "Rating is required",
                                        },
                                    })}
                                    style={{ borderColor: errors?.name ? 'red' : 'initial' }}
                                />
                            </div>
                            {errors?.ratings && (
                                <span className="error-message">
                                    {errors?.ratings.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label>GST No.</label>
                            <div className=" form-group">
                                <Controller
                                    name="gst_no"
                                    control={control}
                                    rules={{
                                        pattern: {
                                            value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                                            message: 'Please enter a valid GST no.',
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <input
                                            className=""
                                            type="text"
                                            placeholder="Enter GST No"
                                            onChange={onChange}
                                            style={{ borderColor: errors?.name ? 'red' : 'initial' }}
                                            value={value?.toUpperCase()}
                                        />
                                    )}
                                />
                            </div>
                            {errors?.gst_no && (
                                <span className="error-message">
                                    {errors?.gst_no.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label>PAN Card Number</label>
                            <div className=" form-group">
                                <input
                                    className=""
                                    type="text"
                                    placeholder="Enter PAN Card Number"
                                    {...register("pan_no", {
                                        pattern: {
                                            value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                                            message: "Invalid PAN Card Number",
                                        }
                                    })}
                                />
                            </div>
                            {errors?.pan_no && (
                                <span className="error-message">
                                    {errors?.pan_no.message}
                                </span>
                            )}
                        </div>

                        <div className="input-group">
                            <label>Cancellation Cut-off Time( In Minutes )<span style={{ color: "red" }}>*</span>
                                <Tooltip
                                    title={<>
                                        <div>Time by which user can cancel without being charged. Cancellations after this time will incur fees of x percentage, define x below.</div>
                                    </>
                                    } placement="right" color='#032037'>
                                    <Icon icon="ion:information-circle" className="input-info-icon" />
                                </Tooltip>
                            </label>
                            <div className=" form-group">
                                <input
                                    className=""
                                    type="number"
                                    placeholder="Cancellation Cut-off Time ( In Minutes )"
                                    {...register("cancellation_cutoff_time", {
                                        required: {
                                            value: true,
                                            message: "Cancellation Cutoff Time is required",
                                        },
                                        pattern: {
                                            value: /^[0-9]+(?:\.[0-9]+)?$/,
                                            message: 'Please enter a non-integer number',
                                        },
                                    })}

                                />
                            </div>
                            {errors?.cancellation_cutoff_time && (
                                <span className="error-message">
                                    {errors?.cancellation_cutoff_time.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label>Cancellation Fee Percentage<span style={{ color: "red" }}>*</span>
                                <Tooltip
                                    title={<>
                                        <div>If you are cancelling the bookings in between Cancellation Cut-off Time and Cancel Button Disable Cut-Off Time than you have to pay the panelty.</div>
                                    </>
                                    } placement="right" color='#032037'>
                                    <Icon icon="ion:information-circle" className="input-info-icon" />
                                </Tooltip>
                            </label>
                            <div className=" form-group">
                                <input
                                    className=""
                                    type="number"
                                    placeholder="Cancellation Fee Percentage"
                                    {...register("cancellation_fee_percentage", {
                                        required: {
                                            value: true,
                                            message: "Cancellation Fee Percentage is required",
                                        },

                                    })}

                                />
                            </div>
                            {errors?.cancellation_fee_percentage && (
                                <span className="error-message">
                                    {errors?.cancellation_fee_percentage.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label className="form-lable">Pre-Booking Days<span className='required-star '>*</span>
                                <Tooltip
                                    title={<>
                                        <div>Specify how many days in advance users can book the court. The calendar in the app will adjust accordingly.</div>
                                    </>
                                    } placement="right" color='#032037'>
                                    <Icon icon="ion:information-circle" className="input-info-icon" />
                                </Tooltip>
                            </label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="number"
                                    id="booking_days"
                                    placeholder="Enter Pre-Booking Days"
                                    {...register("booking_days", {
                                        required: {
                                            value: true,
                                            message: 'Slot size is required',
                                        },

                                    })}
                                />
                            </div>
                            {errors?.booking_days && (
                                <span className="error-message">
                                    {errors.booking_days.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="booking_days" className="form-lable">Cancel Button Disable Cut-Off Time( In Minutes )
                                <Tooltip
                                    title={<>
                                        <div>Set a time between the cancellation cutoff and match start when cancellations will no longer be allowed.</div>
                                    </>
                                    } placement="right" color='#032037'>
                                    <Icon icon="ion:information-circle" className="input-info-icon" />
                                </Tooltip>
                            </label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="number"
                                    placeholder="Eg: ( In Minutes )"
                                    {...register("cancel_cutoff_button_disable_time")}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="booking_days" className="form-lable">Reschedule Button Disable Cut-Off Time( In Minutes )
                                <Tooltip
                                    title={<>
                                        <div>Specify the time beyond which user will not be able to reschedule the booking. Specify a time before the cancellation cutoff time.</div>
                                    </>
                                    } placement="right" color='#032037'>
                                    <Icon icon="ion:information-circle" className="input-info-icon" />
                                </Tooltip>
                            </label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="number"
                                    placeholder="Eg: ( In Minutes )"
                                    {...register("reschedule_cutoff_button_disable_time")}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="form-lable">No.of Reschedule Allowed<span className='required-star '>*</span>
                                <Tooltip
                                    title={<>
                                        <div>Specify the number of times users can reschedule the bookings</div>
                                    </>
                                    } placement="right" color='#032037'>
                                    <Icon icon="ion:information-circle" className="input-info-icon" />
                                </Tooltip>
                            </label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="number"
                                    placeholder="Enter No.of Reschedule Allowed eg:2"
                                    {...register("no_of_reschedules", {
                                        required: {
                                            value: true,
                                            message: 'No.of Reschedule Allowed is required',
                                        },

                                    })}
                                />
                            </div>
                            {errors?.no_of_reschedules && (
                                <span className="error-message">
                                    {errors.no_of_reschedules.message}
                                </span>
                            )}
                        </div>
                        <div className="input-group">
                            <label className="form-lable">Facility listing Date</label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="date"
                                    placeholder="Enter facility listing date eg:2"
                                    {...register("activation_date")}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="form-lable">Facility Launch Date</label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="date"
                                    placeholder="Enter Booking Acceptance Date eg:2"
                                    {...register("acceptance_date")}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="form-lable">Advance percentage for pay cash@facility
                                <Tooltip
                                    title={<>
                                        <div>Amount payable percentage for availing pay cash at facility minimum 10%</div>
                                    </>
                                    } placement="right" color='#032037'>
                                    <Icon icon="ion:information-circle" className="input-info-icon" />
                                </Tooltip>
                            </label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="number"
                                    placeholder="Enter Amount of Cash Percentage"
                                    {...register("pay_cash", {
                                        min: {
                                            value: 10,
                                            message: "The minimum percentage allowed is 10%"
                                        }
                                    })}
                                />
                            </div>
                            {errors.pay_cash && <p className="error-message">{errors.pay_cash.message}</p>}
                        </div>
                        <div className="input-group">
                            <label className="form-lable">Order By
                                <Tooltip
                                    title={<>
                                        <div>The Orders facility Shown in the App</div>
                                    </>
                                    } placement="right" color='#032037'>
                                    <Icon icon="ion:information-circle" className="input-info-icon" />
                                </Tooltip>
                            </label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="number"
                                    placeholder="Orders"
                                    {...register("order_by")}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="form-lable">Min slot selelection
                                <Tooltip
                                    title={<>
                                        <div>Min slots for booking</div>
                                    </>
                                    } placement="right" color='#032037'>
                                    <Icon icon="ion:information-circle" className="input-info-icon" />
                                </Tooltip>
                            </label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="number"
                                    placeholder="Min slot selelection"
                                    {...register("min_slot_selection_for_booking")}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="form-lable">Max slot selelection (in minutes)
                                <Tooltip
                                    title={<>
                                        <div>Max slots for booking</div>
                                    </>
                                    } placement="right" color='#032037'>
                                    <Icon icon="ion:information-circle" className="input-info-icon" />
                                </Tooltip>
                            </label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="number"
                                    placeholder="Max slot selelection (in minutes)"
                                    {...register("max_hrs_slots_selection_for_booking")}
                                />
                            </div>
                        </div>
                        <div className="form-container-grid col-span-2">
                            <div className="input-group">
                                <label>Facility Image<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <div className="">
                                        <input
                                            type="file"
                                            accept="image/x-png,image/gif,image/jpeg"
                                            multiple
                                            {...register("image", {
                                                required: {
                                                    value: edit == true ? false : true,
                                                    message: "Image is required",
                                                },
                                            })}
                                            onChange={onChange}
                                        />
                                    </div>{" "}
                                </div>
                                {errors?.image && (
                                    <span className="error-message">
                                        {errors?.image.message}
                                    </span>
                                )}
                                <div className="form-container-grid col-span-2">
                                    <div className="col-span-2-sm">
                                        <div className='label-pre' style={{ marginTop: 5 }}>
                                            <label htmlFor="myCheckbox"><strong>Image Preview</strong> </label>
                                            {(editdata.image?.length && previewImage?.length === 0) && <button type="button" onClick={handleDownloadImage} className="pi-btn-primary"><div className="pi-btn-content"><Icon icon="material-symbols:download" width="16" height="16" style={{ color: "white" }} /></div></button>}

                                        </div>
                                        <div className="form-container-grid col-span-2">
                                            {previewImage.length > 0 ?
                                                previewImage?.map((image, index) => (
                                                    <img key={index} src={image} className="image-preview-app-card" alt={`Preview ${index + 1}`} />
                                                )) :
                                                editdata?.facility_images?.length>0 ? (editdata?.facility_images.map((image, index) => (
                                                    <img key={index} src={image} className="image-pre" alt={`Preview ${index + 1}`} style={{ marginBottom: 10 }} />
                                                ))) : <img src={editdata?.image} className="image-pre" />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Facility Logo<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group ">
                                    <div className="">
                                        <input
                                            type="file"
                                            accept="image/x-png,image/gif,image/jpeg"
                                            {...register("logo", {
                                                required: {
                                                    value: edit == true ? false : true,
                                                    message: "Logo is required",
                                                },
                                            })}
                                            onChange={onChange1}
                                        />

                                    </div>{" "}
                                </div>
                                {errors?.logo && (
                                    <span className="error-message">
                                        {errors?.logo.message}
                                    </span>
                                )}
                                <div className="form-container-grid col-span-2">
                                    {(previewImage1 != "" || editdata?.logo) &&
                                        <div className="col-span-2-sm">
                                            <div className='label-pre' style={{ marginTop: 5 }}>
                                                <label htmlFor="myCheckbox"><strong>Logo Preview</strong> </label>
                                                {(editdata?.logo && previewImage1 === "") && <button type="button" onClick={handleDownloadImage1} className="pi-btn-primary"><div className="pi-btn-content"><Icon icon="material-symbols:download" width="16" height="16" style={{ color: "white" }} /></div></button>}

                                            </div>
                                            {previewImage1 !== "" ? <img src={previewImage1} className="image-preview-app-card" /> : < img src={editdata?.logo} className="image-pre" />}
                                        </div>}
                                </div>
                            </div>
                        </div>

                        <div className="input-group col-span-2">
                            <label htmlFor="description" className="form-lable">Description<span style={{ color: "red" }}>*</span>
                                <Tooltip
                                    title={<>
                                        <div>This is your about information and will appear in your profile and the landing pages</div>
                                    </>
                                    } placement="right" color='#032037'>
                                    <Icon icon="ion:information-circle" className="input-info-icon" />
                                </Tooltip>
                            </label>
                            <div className="">
                                <JoditEditor
                                    ref={editor}
                                    value={description}
                                    config={config}
                                    onBlur={(value) => {
                                        setDescriptionErr('');
                                        setDescription(value);
                                    }}
                                />
                            </div>
                            {deserror && (
                                <span className="error-message">
                                    {deserror}
                                </span>
                            )}
                        </div>
                    </div>
                    <div>

                        <div>
                            <div className="add-ons-container">

                                <h2>Add Add-Ons <Switch defaultChecked onChange={onChangeEnableBulkCategory} checked={enableBulkCategory} />
                                </h2>
                                <div className="add-button">
                                    <span>Add rental equipments</span>
                                </div>
                            </div>

                            {/* <div id="equipment-list">
                                {equipments.map((equipment, index) => (
                                    <div key={equipment.id}>
                                        <div className="col-span-3 equipment-title">
                                            {`Equipment ${index + 1}`}
                                        </div>
                                        <div className="form-column form-container-grid-3 equipment-container">
                                            <div className="input-group">
                                                <label>
                                                    Equipment Name<span style={{ color: "red" }}>*</span>
                                                </label>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Equipment Name"
                                                        value={equipment.name}
                                                        {...register('addOnName', {
                                                            onChange: (e) => {
                                                                handleEquipmentChange(equipment.id, "name", e.target.value);
                                                            },
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="input-group">
                                                <label>
                                                    Price<span style={{ color: "red" }}>*</span>
                                                </label>
                                                <div className="form-group">
                                                    <input
                                                        type="number"
                                                        placeholder="Enter Price"
                                                        value={equipment.price}
                                                        {...register('addOnPrice', {
                                                            required: true,
                                                            valueAsNumber: true,
                                                            onChange: (e) => handleEquipmentChange(equipment.id, "price", e.target.value)
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="input-group">
                                                <label>
                                                    Extra Info<span style={{ color: "red" }}>*</span>
                                                </label>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter extra Info"
                                                        value={equipment.info}
                                                        {...register('extraInfo', {
                                                            onChange: (e) => handleEquipmentChange(equipment.id, "info", e.target.value)
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="det-icon border-bottom-light">
                                            <div className="add-more-btn">
                                                <button
                                                    type="button"
                                                    className="ad-btn"
                                                    onClick={handleEquipmentAddMore}
                                                >
                                                    <span className="add-icon">+</span>
                                                    Add More
                                                </button>
                                            </div>
                                            <div className="delete-btn">
                                                {equipments.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="icon-d"
                                                        onClick={() => handleEquipmentDelete(equipment.id)}
                                                    >
                                                        <Icon icon="clarity:trash-solid" style={{ marginRight: '5px', marginTop: '5px' }} />
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div> */}
                        </div>
                        <div className="border-bottom-light">
                            {enableBulkCategory && singleCategoryPackages?.map((packageField, packageIndex) => {
                                return (
                                    <div key={packageIndex}>
                                        <div className="col-span-3 form-subheadings-sm">Equipment- {packageIndex + 1}</div>
                                        <div className="form-column form-container-grid-3">
                                            <div className="input-group">
                                                <label htmlFor={`addOnName${packageIndex}`}>
                                                    Equipment Name
                                                    {/* <Tooltip title={<>
                                                        <div>Packages are for the players family or support group to come and stay with our players.</div>
                                                    </> 
                                                    } placement="rightTop" color='#032037'>
                                                        <Icon icon="ion:information-circle" className="input-info-icon" />
                                                    </Tooltip> */}
                                                </label>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Equipment Name"
                                                        value={packageField.addOnName}
                                                        onChange={(e) =>
                                                            handleSingleCategoryPackageFieldChange(packageIndex, "addOnName", e.target.value)
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="input-group">
                                                <label htmlFor={`addOnPrice${packageIndex}`}>
                                                    Price
                                                </label>
                                                <div className="form-group">
                                                    <input
                                                        type="number"
                                                        placeholder="Enter Price"
                                                        value={packageField.addOnPrice}
                                                        onChange={(e) => {
                                                            handleSingleCategoryPackageFieldChange(

                                                                packageIndex,
                                                                "addOnPrice",
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="input-group">
                                                <label htmlFor={`extraInfo${packageIndex}`}>
                                                    Extra Info
                                                </label>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Extra Info"
                                                        value={packageField.extraInfo}
                                                        onChange={(e) => {
                                                            handleSingleCategoryPackageFieldChange(

                                                                packageIndex,
                                                                "extraInfo",
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>



                                        </div>
                                        <div className="det-icon">
                                            <div className="add-more-end">
                                                {packageIndex === singleCategoryPackages.length - 1 && (
                                                    <button
                                                        type="button"
                                                        className="ad-btn"
                                                        onClick={() => handleSingleCategoryPackageAdd()}
                                                    >
                                                        <Icon icon="icon-park-solid:add-one" className="add-icon" />
                                                        Add More
                                                    </button>
                                                )}
                                            </div>
                                            <div className="delete-new">
                                                {packageIndex !== 0 && (
                                                    <button
                                                        type="button"
                                                        className="icon-d"
                                                        onClick={() => handleSingleCategoryPackageRemove(packageIndex)}
                                                    >
                                                        <Icon icon="clarity:trash-solid" />
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                        </div>




                        {/* <div className="add-ons-container">
                            <h2>Add Add-Ons</h2>
                            <div className="add-button">
                                <span>Add rental equipments</span>
                            </div>
                        </div>
                        <div className="col-span-3 equipment-title">Equipment 1</div>
                        <div className="form-column form-container-grid-3 equipment-container">
                            <div className="input-group">
                                <label>Equipment Name<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Enter Equipment Name"

                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Price<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        placeholder="Enter Price"

                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Extra Info<span style={{ color: "red" }}>*</span></label>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Enter extra Info"

                                    />
                                </div>
                            </div>
                        </div>
                        <div className="det-icon border-bottom-light">
                            <div className="add-more-btn">
                                <button
                                    type="button"
                                    className="ad-btn"
                                >
                                    <Icon icon="mdi:add" className="add-icon" />
                                    Add More
                                </button>
                            </div>
                            <div className="delete-btn">
                                <button
                                    type="button"
                                    className="icon-d"
                                >
                                    <Icon icon="clarity:trash-solid" style={{ marginRight: '5px', marginTop: '5px' }} />
                                    Delete
                                </button>
                            </div>
                        </div> */}
                    </div>
                    <Footer className='ant-modal-footer'>

                        <button
                            type="button"
                            className="pi-btn-secondary"
                            onClick={() => { onCancel(); reset(); }}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="pi-btn-primary">
                            {row._id ? 'Save' : 'Add Facility'}
                        </button>
                    </Footer>
                </form>
            </Modal>
        </div >

    )
}

export default AddFacilityManagement;