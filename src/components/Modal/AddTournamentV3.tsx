import React, { useEffect, useMemo, useRef, useState } from "react";
import { Checkbox, ConfigProvider, Modal, Radio, RadioChangeEvent, Switch, Tooltip } from "antd";
import { useForm, Controller, FieldErrors } from "react-hook-form";
import "../css/style.css";
import { toast } from "react-toastify";
import { createEventAPI, deleteEventCategory, editEventAPI, editEventCategory, getUgtDetails } from "../apiFile/Service";
import ToastMessage from "../../page/facilator/ToastMessage/ToastMessage";
import moment from "moment";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "../../page/facilator/Events/Events.css";
import * as Constants from "../apiFile/Constants";
import { Footer } from "antd/es/layout/layout";
import { Icon } from "@iconify-icon/react";
import JoditEditor from "jodit-react";
import { useSelector } from "react-redux";
import padelIcon from "../../assets/icon/Padel.png";
import pickleballIcon from "../../assets/icon/Pickleball.png";
import { set } from "lodash";

// {
//   "sport_name": "padel",
//   "tournament_name": "string",
//   "venue_type": "popup",
//   "popup_venue_details": {
//     "name": "string",
//     "address": "string",
//     "location": {
//       "lat": "string",
//       "lon": "string"
//     }
//   },
//   "start_date": "string",
//   "end_date": "string",
//   "start_time": "string",
//   "end_time": "string",
//   "slot_time_in_min": 0,
//   "venue_book_status": true,
//   "last_day_for_registration": "string",
//   "tournament_mode": "string",
//   "tournament_formate": "string",
//   "tournament_organization_by_app": true,
//   "tournament_slots_selection_auto": true,
//   "tournament_category_ids": [
//     "string"
//   ],
//   "tournament_banner_img": "string",
//   "tournament_description": "string",
//   "user_id": {},
//   "tournament_referee_ids": {},
//   "contact_details": {
//     "name": "string",
//     "email": "user@example.com",
//     "phone": "string"
//   },
//   "tournament_reward": [
//     "string"
//   ],
//   "tag": "string",
//   "position": 0
// }

interface formModal {
  sport_name: any;
  tournament_name: string;
  venue_type: any;
  popup_venue_details: any;
  venue_name: string;
  venue_address: string;
  venue_location: any;
  geo_location: any;
  lat: string;
  lon: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  slot_time_in_min: any;
  venue_book_status: any;
  last_day_for_registration: string;
  tournament_mode: any;
  tournament_formate: any;
  tournament_organization_by_app: any;
  tournament_slots_selection_auto: any;
  tournament_category_ids: any[];
  tournament_banner_img: any;
  tournament_description: string;
  user_id: any;
  tournament_referee_ids: any;
  contact_details: any;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  tournament_reward: any;
  tag: any;
  position: any;

  // sport_name: any;
  // total_number_of_registration: any;
  // tournament_court: any;
  // price: any;
  // price_per_player: String;
  // price_per_team: String;
  // tournament_level: any;
  // organizer_id: any;
  // facility_id: any;
  // venue_id: any;
  // rewards: string;
  // image: any;
  // team: boolean;
  // sponsor_by: string;
  // packages: any[];
  // tournament_tag: any;
  // image_url: string;
  // registration_fee: any;
  // registration_fee_gst: any;
  // registration_fee_price: any;
}

const AddTournament = ({
  copy,
  setCopy,
  open,
  toggle,
  getItems,
  venue,
  editdata,
  organizers,
  edit,
  setEdit,
  setEditData,
  skills,
  data,
  userList
}) => {
  const form = useForm({
    defaultValues: {
      sport_name: {},
      tournament_name: "",
      venue_type: {},
      popup_venue_details: {},
      venue_name: "",
      venue_address: "",
      venue_location: "",
      geo_location: "",
      lat: "",
      lon: "",
      start_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
      slot_time_in_min: {},
      venue_book_status: true,
      last_day_for_registration: "",
      tournament_mode: "",
      tournament_formate: "",
      tournament_organization_by_app: true,
      tournament_slots_selection_auto: true,
      tournament_category_ids: [],
      tournament_banner_img: "",
      tournament_description: "",
      user_id: "",
      tournament_referee_ids: {},
      contact_details: {},
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      tournament_reward: [],
      tag: {},
      position: 0,

      // total_number_of_registration: "",
      // tournament_court: {},
      // price: 0,
      // price_per_player: "",
      // price_per_team: "",
      // tournament_level: [],
      // organizer_id: {},
      // facility_id: {},
      // venue_id: {},
      // rewards: "",
      // image: "",
      // team: false,
      // sponsor_by: "",
      // packages: [],
      // tournament_tag: {},
      // image_url: "",
      // registration_fee: {},
      // registration_fee_gst: {},
      // registration_fee_price: {},
    },
    // mode: "onSubmit"
  });
  const data1 = data || [];
  const { register, handleSubmit, reset, watch, control, formState, setError, clearErrors, setValue } = form;
  const { errors } = formState;
  const currentDate = new Date().toISOString().split("T")[0];
  const startDate = watch("start_date");
  const endDate = watch("end_date");
  const startTime = watch("start_time");
  const endTime = watch("end_time");
  const Type: any = watch("sport_name");
  // const venueType: any = watch("venue_type");
  // const price = watch("price");
  const tag: any = watch("tag");
  const lastDateForRegistration = watch("last_day_for_registration");
  const [previewImage, setPreviewImage] = useState('');
  const [description, setDescription] = useState("")
  const [deserror, setDescriptionErr] = useState('');
  const editor = useRef(null);
  const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails);
  const [eventType, setEventType] = useState('Multiple');
  const [UGTDetails, setUGTDetails] = useState<any>({});
  const [isVenueBooked, setIsVenueBooked] = useState(true);
  const [matchMode, setMode] = useState("public");
  const [formate, setFormate] = useState("round robin");

  const sportOptions = [
    { label: 'Padel', value: 'padel', img: padelIcon },
    { label: 'Pickleball', value: 'pickleball', img: pickleballIcon },
  ];
  const venueTypeOptions = [
    { label: 'Popup', value: 'popup' },
    { label: 'Facility', value: 'facility', },
  ];
  const slotDurationOptions = [
    { label: 30, value: 30 },
    { label: 45, value: 45, },
    { label: 60, value: 60, },
    { label: 90, value: 90, },
    { label: 120, value: 120, },
  ];
  const ShowHomeOptions = [
    { label: 'Yes', value: true, icon: 'mdi:eye' },
    { label: 'No', value: false, icon: 'mdi:eye-off' },
  ];
  const modeOptions = [
    { label: 'Public', value: 'public', icon: 'mdi:account-lock-open' },
    { label: 'Private', value: 'private', icon: 'mdi:account-lock' },
  ];
  const formateOptions = [
    { label: 'Round Robin', value: 'round robin', icon: '' },
    { label: 'Knockout', value: 'knockout', icon: '' },
    { label: 'Group + KO', value: 'ko', icon: '' },
  ];
  const courtOptions = [
    { label: 'Indoor', value: 'Indoor' },
    { label: 'Outdoor', value: 'Outdoor', },
  ];
  const eventOptions = [
    { label: 'Single Category', value: 'Single', tooltip: 'Suitable for defining social event, corporate socials, open play socials, single occurrence event & single category tournament.', disabled: false },
    { label: 'Multiple Category', value: 'Multiple', tooltip: 'Suitable for defining multiple category tournament, destination events with multiple category tournaments.', disabled: false },
    { label: 'UGT (User Generated Tournaments)', value: 'UGT', tooltip: 'Suitable for defining highly competitive tournaments with scheduling, leagues eg. (Tuesday night leagues, knockout, round robin, groups + knockouts) .', disabled: true },
  ];
  const TournamentTags = [
    { value: "N/A", label: "N/A" },
    { value: "Social", label: "Social" },
    { value: "Corporate", label: "Corporate" },
    { value: "Destination", label: "Destination" },
    { value: "Competitions", label: "Competitions" },
    { value: "Coaching", label: "Coaching" },
  ];

  const customTitle = (
    <div className="custom-ant-modal-header">
      {edit == true ? copy == true ? "Add Event" : "Edit Event" : "Add Event"}
    </div>
  );

  // const isEndDateValid = () => {
  //   if (!startDate || (startDate == endDate)) {
  //     return true;
  //   }
  //   if (startDate > endDate) {
  //     return false;
  //   }
  // };
  // const isLastDateValid = () => {
  //   if (!startDate || !startTime || !lastDateForRegistration) {
  //     return true;
  //   }

  //   const combinedStartDateTime = new Date(`${startDate}T${startTime}`);
  //   const lastDate = new Date(lastDateForRegistration);

  //   return lastDate <= combinedStartDateTime;
  // };
  const [timeErr, setTimeErr] = useState("");
  const [timeRange, setTimeRange] = useState({ startTime: "", endTime: "" });

  useMemo(() => {
  }, [Type])

  const handleTimeChange = (field, value) => {
    if (field === "startTime" && timeRange.endTime <= value) {
      setTimeRange({
        startTime: value,
        endTime: "",
      });
    } else if (field === "endTime" && timeRange.startTime >= value) {
      setTimeErr("Invalid Tournament End Time");
    } else {
      setTimeRange({
        ...timeRange,
        [field]: value,
      });
      setTimeErr("");
    }
  };
  const loggedInUser = localStorage.getItem("auth");
  const closingFunctions = () => {
    toggle(!open);
    setCopy(false);
    reset();
    setEdit(false);
    setPreviewImage('');
    setEditData({});
  };
  let dated = watch("end_date");
  const animatedComponents = makeAnimated();

  const fileURL = async (data, date) => {
    console.log(data)
    const params = {
      ACL: "public-read",
      Body: data[0],
      Bucket: `${Constants.S3_BUCKET}events`,
      Key: `${date}_eventImage_${data[0].name}`,
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
    // if (eventType !== "Multiple") {
    const resp = await data1.find((e) => {
      if (startDate == endDate) {
        return e.start_time > data?.end_time
      }
    })

    if (resp) {
      toast(<ToastMessage body={"Event can't end before start time"} type="warning" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return
    }
    // }

    // data.tournament_level = data?.tournament_level?.map(item => {
    //   return (
    //     {
    //       "label": item.label,
    //       "value": item.data
    //     }
    //   )
    // })
    // data.tournament_level = JSON.stringify(data.tournament_level);
    // data.total_number_of_registration = Number(
    //   data.total_number_of_registration
    // );


    var date = Math.round(+new Date() / 1000);
    if (data.tournament_banner_img.length > 0) {
      await fileURL(data.tournament_banner_img, date)
      data.tournament_banner_img = `${Constants.BaseLink}events/${date}_eventImage_${data.tournament_banner_img[0].name}`;
    } else if (edit == true) {
      data.tournament_banner_img = editdata.tournament_banner_img
    } else {
      data.tournament_banner_img = "NO Image Added"
    }
    // if (eventType === "Multiple") {
    // data.total_number_of_registration = 0
    // data.start_date = categoryDynamicFields[0]?.start_date
    // data.end_date = categoryDynamicFields[0]?.end_date
    // data.start_time = categoryDynamicFields[0]?.start_time
    // data.end_time = categoryDynamicFields[0]?.end_time
    if (edit == true && copy == true) {
      const data = editdata.tournament_category_ids.map((data) => {
        delete data._id;
        return data;
      })
      setCategoryDynamicFields(data);
    }
    data.tournament_category_ids = categoryDynamicFields;
    // data.price = 0
    // }

    // if (eventType === "Single") {
    //   data.registration_fee = {
    //     per_person: data?.price_per_player,
    //     per_team: data?.price_per_team,
    //   };
    //   data.registration_fee_gst = {
    //     per_person_gst: calculateSettlement(Number(data?.price_per_player)).gstAmount,
    //     per_team_gst: calculateSettlement(Number(data?.price_per_team)).gstAmount
    //   }
    //   data.registration_fee_price = {
    //     per_person_price: calculateSettlement(Number(data?.price_per_player)).baseAmount,
    //     per_team_price: calculateSettlement(Number(data?.price_per_team)).baseAmount,
    //   }
    //   data.packages = singleCategoryPackages;
    //   data.price = Number(data?.price_per_player)
    // }

    data.tournament_reward = singleCategoryPackages;

    // data.organizer_id = data.organizer_id?.value
    // data.venue_id = data?.venue_id?.value
    // data.tournament_court = data.tournament_court?.value
    data.position = Number(data?.position);
    data.tag = data?.tag?.value
    data.sport_name = JSON.stringify(data?.sport_name)
    data.venue_type = data?.venue_type?.value
    // data.facility_id = data?.facility_id?.value

    console.log("🚀 ~ file: AddTournament.tsx:194 ~ onSubmit ~ data:", data)
    let response;
    if (edit == false) {
      response = await createEventAPI(loggedInUser, data);
    } else if (edit == true && copy == true) {
      response = await createEventAPI(loggedInUser, data);
    }
    else {
      if (eventType === "Multiple" && editdata.tournament_category_ids.length > 0) {
        for (let i = 0; i < editdata.tournament_category_ids.length; i++) {
          if (editdata.tournament_category_ids[i]._id) {
            data.tournament_category_ids[i].max_registration = String(data.tournament_category_ids[i].max_registration)
            data.tournament_category_ids[i].registration_fee.per_person = String(data.tournament_category_ids[i].registration_fee.per_person)
            data.tournament_category_ids[i].registration_fee.per_team = String(data.tournament_category_ids[i].registration_fee.per_team)
            data.tournament_category_ids[i].registration_fee_gst.per_person_gst = String(data.tournament_category_ids[i].registration_fee_gst.per_team_gst)
            data.tournament_category_ids[i].registration_fee_gst.per_team_gst = String(data.tournament_category_ids[i].registration_fee_gst.per_team_gst)
            data.tournament_category_ids[i].registration_fee_price.per_person_price = String(data.tournament_category_ids[i].registration_fee_price.per_person_price)
            data.tournament_category_ids[i].registration_fee_price.per_team_price = String(data.tournament_category_ids[i].registration_fee_price.per_team_price)
            const resp = await editEventCategory(loggedInUser, categoryDynamicFields[i], data.tournament_category_ids[i]._id)
          }
        }
      }
      response = await editEventAPI(loggedInUser, data, editdata._id);
    }
    if (response.statusCode == 0) {
      toast(
        <ToastMessage
          body={
            edit == true && copy == true
              ? "Event Created Successfully"
              : edit == true ? "Event Edited Successfully" : "Event Created Successfully"
          }
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
      console.log("error");
      toast(<ToastMessage body={response.statusCode} type="warning" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const getUgtDetailsById = async () => {
    const response = await getUgtDetails(loggedInUser, editdata?._id);
    setUGTDetails(response?.data?.tournament_details[0]);
    console.log("🚀 ~ file: TournamentDetails.tsx:19 ~ getUgtDetailsById ~ response:", response?.data?.tournament_details[0])
  }
  useEffect(() => {
    if (edit == true) {
      setVenueType(UGTDetails?.venue_type);
      setIsVenueBooked(UGTDetails?.venue_book_status)
      setCategoryDynamicFields(UGTDetails?.category_details);
      setSingleCategoryPackages(editdata.tournament_reward);
      setSportType(editdata.sport_name);
      setEventType(editdata.tournament_type);
      setMode(editdata?.tournament_mode)
      setFormate(editdata?.tournament_formate)

      reset({
        sport_name: { label: editdata?.sport_name, value: editdata?.sport_name },
        tournament_name: editdata.tournament_name,
        popup_venue_details: {},
        venue_name: editdata?.popup_venue_details?.name,
        venue_address: editdata?.popup_venue_details?.address,
        geo_location: "",
        lat: editdata?.popup_venue_details?.location?.lat,
        lon: editdata?.popup_venue_details?.location?.lon,
        start_date: moment(editdata.start_date).format("YYYY-MM-DD"),
        end_date: moment(editdata.end_date).format("YYYY-MM-DD"),
        start_time: moment(editdata.start_date).format("HH:mm"),
        end_time: moment(editdata.end_date).format("HH:mm"),
        tournament_organization_by_app: true,
        tournament_slots_selection_auto: true,
        tournament_category_ids: [],
        tournament_banner_img: "",
        tournament_description: editdata.tournament_description,
        // user_id: "",
        contact_details: {},
        contact_name: editdata?.user_details?.fullName,
        contact_email: editdata?.user_details?.email,
        contact_phone: editdata?.user_details?.mobileno,
        tournament_reward: editdata.tournament_reward,
        tag: editdata.tag ? { value: editdata.tag, label: editdata.tag } : { value: "N/A", label: "N/A" },
        position: editdata?.position,
        slot_time_in_min: { label: UGTDetails?.slot_time_in_min, value: UGTDetails?.slot_time_in_min },
        last_day_for_registration: moment(UGTDetails?.last_day_for_registration).format("YYYY-MM-DD HH:mm"),
        tournament_referee_ids: {label: UGTDetails?.referee_details?.fullName, value: UGTDetails?.referee_details?._id,},

        // "tournament_level": JSON.parse(editdata.tournament_level).map((item: any) => ({ label: item.label, value: item.value?._id, data: item.value })),
        // "tournament_court": { value: editdata.tournament_court, label: editdata.tournament_court },
        // "facility_id": { label: editdata.venue.name, value: editdata.venue._id },
        // "total_number_of_registration": editdata.total_number_of_registration,
        // "price": editdata.total,
        // "price_per_player": editdata?.registration_fee?.per_person,
        // "price_per_team": editdata.registration_fee?.per_team,
        // "organizer_id": { label: editdata.organizer.name, value: editdata.organizer._id },
        // "team": editdata?.team,
        // "venue_id": { label: `${editdata.venue.name} ${editdata.venue.location_city}`, value: editdata.venue._id },
        // "sponsor_by": editdata?.sponsor_by,
      });
    }
  }, [UGTDetails])


  useEffect(() => {
    if (edit == true) {
      getUgtDetailsById();

      // if (editdata?.tournament_category_ids?.length > 0) {
      //   setEventType('Multiple')
      //   editdata.tournament_category_ids.map((data) => {
      //     data.start_date = moment(data.start_date).format("YYYY-MM-DD")
      //     data.end_date = moment(data.end_date).format("YYYY-MM-DD")
      //     return data
      //   })
      // setCategoryDynamicFields(editdata.tournament_category_ids);
      // }
      // else if (editdata?.packages?.length > 0) {
      //   setEventType('Single')
      //   editdata.packages.map((data) => {
      //     data.start_date = moment(data.start_date).format("YYYY-MM-DD")
      //     data.end_date = moment(data.end_date).format("YYYY-MM-DD")
      //     return data
      //   })
      // setSingleCategoryPackages(editdata.packages);
      // setSportType(editdata.sport_name);
      // setEventType(editdata.tournament_type);
      // setMode(editdata?.tournament_mode)
      // setFormate(editdata?.tournament_formate)

      // }
    } else {
      reset({});
      setEditData({})
      setEdit(false);
      setCategoryDynamicFields([
        {
          id: 1,
          ui_name_for_tournament: '',
          category_name: [],
          match_type: [],
          rating: [],
          registration_fee: { per_person: '', per_team: '' },
          registration_fee_gst: { per_person_gst: '', per_team_gst: '' },
          registration_fee_price: { per_person_price: '', per_team_price: '' },
          per_person: '',
          per_team: '',
          max_registration: '',
          start_date: '',
          end_date: '',
          start_time: '',
          end_time: '',
          user_id: loggedUserDetails?._id,
          status: true,
          above: '',
          under: '',
          packages: [
            { id: 1, name: "", number_of_users: "", discount: '', base_price: '', gst: '', no_of_free_registration: '' },
          ]
        }
      ]);
      setSingleCategoryPackages([{ id: 1, rank: "", cash: "", others: '', pi_coins: ''}]);
      // setEventType('Multiple')
    }
    console.log("edit,copy", edit, copy)
  }, [open]);

  // const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const result = reader.result as string; // Ensure TypeScript recognizes it as a string
  //       setPreviewImage(result);

  //       const image = new Image();
  //       image.src = result;
  //       image.onload = () => {
  //         if (image.width !== image.height) {
  //           reset({
  //             image: "",
  //           })
  //           // Set error message if image is not square
  //           setError("image", {
  //             type: "custom",
  //             message: "Selected Image is not Square. Image must be square.",
  //           });
  //           setPreviewImage("");

  //         } else {
  //           // Clear any previous errors if image is square
  //           clearErrors("image");
  //         }
  //       };
  //     };

  //     reader.readAsDataURL(file);
  //     const fileType = file.type;
  //     if (!fileType.startsWith('image/')) {
  //       event.target.value = '';
  //     }
  //   }
  // };

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
    if (editdata.image_url) {
      // Create a temporary anchor element
      const anchor = document.createElement('a');
      anchor.href = editdata.image_url;
      anchor.download = 'image.jpg'; // Change the filename as needed
      anchor.click();
    }
  };

  const config = {
    buttons: 'bold', // Only keep the bold button
    toolbarAdaptive: false, // Optionally disable adaptive toolbar
  };

  const calculateSettlement = (amount) => {
    const gstRate = 0.18;
    const baseAmount = amount / (1 + gstRate);
    const gstAmount = amount - baseAmount;
    return {
      baseAmount: baseAmount.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
    };
  };


  //  ------------------------- Single Category Dynamic Fields form -----------------------
  const [singleCategoryPackages, setSingleCategoryPackages] = useState([{ id: 1, rank: "", cash: "", others: '', pi_coins: ''}]);

  const handleSingleCategoryPackageFieldChange = (packageIndex, fieldName, value) => {
    const updatedPackages = singleCategoryPackages.map((pkg, pkgIndex) => {
      if (pkgIndex === packageIndex) {
        if (fieldName === "discount") {
          return {
            ...pkg,
            [fieldName]: value,
            gst: calculateSettlement(value).gstAmount,
            base_price: calculateSettlement(value).baseAmount,
          };
        } else {
          return {
            ...pkg,
            [fieldName]: value,
          };
        }
      }
      return pkg;
    });
    setSingleCategoryPackages(updatedPackages);
    console.log(updatedPackages);
  };

  const handleSingleCategoryPackageAdd = () => {
    const newPackage = { id: singleCategoryPackages.length + 1,  rank: "", cash: "", others: '', pi_coins: ''}
    setSingleCategoryPackages([...singleCategoryPackages, newPackage]);
  };

  const handleSingleCategoryPackageRemove = (packageIndex) => {
    const updatedPackages = singleCategoryPackages.filter((_, pkgIndex) => pkgIndex !== packageIndex);

    setSingleCategoryPackages(updatedPackages);
  };
  //  ------------------------- Category Dynamic Fields form -----------------------
  const [categoryDynamicFields, setCategoryDynamicFields] = useState([
    {
      id: 1,
      ui_name_for_tournament: '',
      category_name: [],
      match_type: [],
      rating: [],
      registration_fee: { per_person: '', per_team: '' },
      registration_fee_gst: { per_person_gst: '', per_team_gst: '' },
      registration_fee_price: { per_person_price: '', per_team_price: '' },
      per_person: '',
      per_team: '',
      max_registration: '',
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      user_id: loggedUserDetails._id,
      status: true,
      above: '',
      under: '',
      packages: [
        { id: 1, name: "", number_of_users: "", discount: '', base_price: '', gst: '', no_of_free_registration: '' },
      ]
    }
  ]);
  const [categoryDataIndex, setCategoryDataIndex] = useState(1);
  const [showCategoryAddMore, setShowCategoryAddMore] = useState(true);

  const categoryTypeList = [
    {
      label: "Men's",
      value: "Men's"
    },
    {
      label: "Women's",
      value: "Women's"
    },
    {
      label: "Open",
      value: "Open"
    },
    {
      label: "Mixed",
      value: "Mixed"
    },
    {
      label: "Boys",
      value: "Boys"
    },
    {
      label: "Girls",
      value: "Girls"
    },
    {
      label: "Seniors",
      value: "Seniors"
    },
    {
      label: "Juniors",
      value: "Juniors"
    },
  ]
  const matchTypeList = [
    {
      label: "Doubles",
      value: "Doubles"
    },
    {
      label: "Singles",
      value: "Singles"
    },
  ]

  const handlePackageFieldChange = (categoryIndex, packageIndex, fieldName, value) => {
    console.log(categoryIndex, packageIndex, fieldName, value);
    const updatedCategories = categoryDynamicFields?.map((category, index) => {
      if (index === categoryIndex) {
        const updatedPackages = category?.packages?.map((pkg, pkgIndex) => {
          if (pkgIndex === packageIndex) {
            if (fieldName === "discount") {
              return {
                ...pkg,
                [fieldName]: value,
                gst: calculateSettlement(value).gstAmount,
                base_price: calculateSettlement(value).baseAmount,
              };
            } else {
              return {
                ...pkg,
                [fieldName]: value,
              };
            }
          }
          return pkg;
        });
        return {
          ...category,
          packages: updatedPackages,
        };
      }
      return category;
    });
    setCategoryDynamicFields(updatedCategories);
    console.log(updatedCategories);
  };

  const handleAddMorePackage = (categoryIndex) => {
    const updatedCategories = categoryDynamicFields?.map((category, index) => {
      if (index === categoryIndex) {
        const newField = {
          id: category.packages.length === 0 ? 1 : category.packages[category.packages.length - 1].id + 1,
          name: "",
          number_of_users: "",
          discount: "",
          base_price: "",
          gst: "",
          no_of_free_registration: "",
        };
        return {
          ...category,
          packages: [...category.packages, newField],
        };
      }
      return category;
    });
    setCategoryDynamicFields(updatedCategories);
  };

  const handleDeletePackage = (categoryIndex, packageIndex) => {
    const updatedCategories = categoryDynamicFields?.map((category, index) => {
      if (index === categoryIndex) {
        const updatedPackages = category.packages.filter(
          (_, pkgIndex) => pkgIndex !== packageIndex
        );
        return {
          ...category,
          packages: updatedPackages,
        };
      }
      return category;
    });
    setCategoryDynamicFields(updatedCategories);
  };

  const handleCategoryFieldChange = (categoryIndex, fieldName, value) => {
    const updatedFields = categoryDynamicFields?.map((field, index) => {
      if (index === categoryIndex) {
        if (fieldName === "per_person" || fieldName === "per_team") {

          return {
            ...field,
            [fieldName]: value,
            registration_fee: {
              ...field.registration_fee,
              per_person: fieldName === "per_person" ? value : field?.registration_fee?.per_person,
              per_team: fieldName === "per_team" ? value : field?.registration_fee?.per_team,
            },
            registration_fee_gst: {
              ...field.registration_fee_gst,
              per_person_gst: fieldName === "per_person" ? calculateSettlement(value).gstAmount : field?.registration_fee_gst?.per_person_gst,
              per_team_gst: fieldName === "per_team" ? calculateSettlement(value).gstAmount : field?.registration_fee_gst?.per_team_gst,
            },
            registration_fee_price: {
              ...field.registration_fee_price,
              per_person_price: fieldName === "per_person" ? calculateSettlement(value).baseAmount : field?.registration_fee_price?.per_person_price,
              per_team_price: fieldName === "per_team" ? calculateSettlement(value).baseAmount : field?.registration_fee_price?.per_team_price,
            },
          };
        } else {
          return {
            ...field,
            [fieldName]: value,
          };
        }
      }
      return field;
    });
    setCategoryDynamicFields(updatedFields);
    console.log(updatedFields);
  };

  const handleCategoryAddMore = () => {
    const newField = {
      id: categoryDynamicFields.length === 0 ? 1 : categoryDynamicFields[categoryDynamicFields?.length - 1].id + 1,
      ui_name_for_tournament: '',
      category_name: [],
      match_type: [],
      rating: [],
      registration_fee: { per_person: "", per_team: "" },
      registration_fee_gst: { per_person_gst: "", per_team_gst: "" },
      registration_fee_price: { per_person_price: '', per_team_price: '' },
      per_person: "",
      per_team: "",
      max_registration: "",
      start_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
      user_id: loggedUserDetails._id,
      status: true,
      above: "",
      under: "",
      packages: [
        { id: 1, name: "", number_of_users: "", discount: "", base_price: '', gst: "", no_of_free_registration: "" },
      ],
    };
    setCategoryDataIndex(categoryDataIndex + 1);
    setCategoryDynamicFields([...categoryDynamicFields, newField]);
  };

  const duplicateCategory = (index: number) => {
    // Create a new object and manually assign values from categoryDynamicFields[index]
    const newField = {
      id: categoryDynamicFields.length === 0 ? 1 : categoryDynamicFields[categoryDynamicFields.length - 1].id + 1,
      category_name: categoryDynamicFields[index].category_name,
      ui_name_for_tournament: categoryDynamicFields[index].ui_name_for_tournament,
      match_type: categoryDynamicFields[index].match_type,
      rating: categoryDynamicFields[index].rating,
      registration_fee: categoryDynamicFields[index].registration_fee,
      registration_fee_gst: categoryDynamicFields[index].registration_fee_gst,
      registration_fee_price: categoryDynamicFields[index].registration_fee_price,
      per_person: categoryDynamicFields[index].registration_fee.per_person,
      per_team: categoryDynamicFields[index].registration_fee.per_person,
      max_registration: categoryDynamicFields[index].max_registration,
      start_date: categoryDynamicFields[index].start_date,
      end_date: categoryDynamicFields[index].end_date,
      start_time: categoryDynamicFields[index].start_time,
      end_time: categoryDynamicFields[index].end_time,
      user_id: loggedUserDetails._id, // Set the user_id explicitly
      status: categoryDynamicFields[index].status,
      above: categoryDynamicFields[index].above,
      under: categoryDynamicFields[index].under,
      packages: categoryDynamicFields[index].packages, // Assuming it's an array of objects
      // Omit _id from being copied
    };

    console.log("🚀 ~ file: AddTournament.tsx:600 ~ duplicateCategory ~ newField:", newField);

    // Update the state with the new field
    setCategoryDataIndex(categoryDataIndex + 1);
    setCategoryDynamicFields([...categoryDynamicFields, newField]);
  };


  const handleCategoryDelete = async (field, categoryIndex) => {
    if (field?._id) {
      const resp = await deleteEventCategory(loggedInUser, field._id)
      console.log("🚀 ~ file: AddTournament.tsx:600 ~ handleCategoryDelete ~ resp:", resp)
      if (resp?.code == "SUCCESS") {
        const updatedFieldSets = categoryDynamicFields.filter(
          (_, index) => index !== categoryIndex
        );
        setCategoryDynamicFields(updatedFieldSets);
        toast(<ToastMessage body={resp?.message} type={'success'} />, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else {
      const updatedFieldSets = categoryDynamicFields.filter(
        (_, index) => index !== categoryIndex
      );
      setCategoryDynamicFields(updatedFieldSets);
    }
  };

  const customStyles = {
    valueContainer: (provided) => ({
      ...provided,
      maxHeight: '30px',
      overflowY: 'auto',
      padding: '0',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 49,
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#003F70 !important',
      borderRadius: 16,
      overflow: 'hidden',
      gap: 6,
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white !important',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'white !important',
      borderRadius: 0,
      ':hover': {
        backgroundColor: '#FFBDAD',
        color: '#DE350B !important',
      },
    }),
  };

  const [enableBulkCategory, setEnableBulkCategory] = useState(false);
  const [sportType, setSportType] = useState("padel");
  const [venueType, setVenueType] = useState("popup");


  const onChangeEnableBulkCategory = (checked: boolean) => {
    setEnableBulkCategory(checked)
  };

  const onEventTypeChange = ({ target: { value } }: RadioChangeEvent) => {
    setEventType(value);
  };

  const onChangeSportType = (e) => {
    let value = e.target.value
    setSportType(value);
  };

  const onChangeVenueType = (e) => {
    let value = e.target.value
    setVenueType(value);
    setValue('venue_type', value)
  };

  const onChangeVenueBooked = (e) => {
    let value = e.target.value
    setIsVenueBooked(value);
    setValue('venue_type', value?.value)
  };
  const onChangeMode = (e) => {
    let value = e.target.value
    setMode(value);
    setValue('tournament_mode', value?.value);
  };
  const onChangeformate = (e) => {
    let value = e.target.value
    setFormate(value);
    setValue('tournament_mode', value?.value);
  };

  return (
    <div>
      <Modal
        className="custom-ant-modal "
        open={open}
        title={customTitle}
        onCancel={closingFunctions}
        footer={null}
        width={"70%"}
        centered>
        <div className="form-container">
          <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
            <div className="form-subheadings">Base Details</div>
            <div className="form-container-grid-3">
              <div className="input-group">
                <label htmlFor="sport_type" className="form-label">Sport Type</label>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#F17121',
                      borderRadius: 18,
                    },
                    components: {
                      Radio: {
                        colorPrimary: '#F17121',
                      },
                    },
                  }}
                >
                  <Radio.Group
                    onChange={onChangeSportType}
                    value={sportType}
                    optionType="button"
                    buttonStyle="solid"
                    className="custom-button-tabs-v2"
                  >
                    {sportOptions.map((option) => (
                      <Radio value={option.value}>
                        <img src={option.img} style={{ filter: option.value === sportType ? 'brightness(0) invert(1)' : '', width: '12px', height: '12px', marginRight: '5px' }} />
                        {option.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </ConfigProvider>
              </div>
              <div className="input-group">
                <label htmlFor="eventName">
                  Event Name<span style={{ color: "red" }}>*</span>
                  <Tooltip title={<>
                    <div>You can define social open play tournaments, corporate open play tournaments, and different category competition tournaments and destination events with padel & pickleball tournaments.</div>
                  </>
                  } placement="rightTop" color='#032037'>
                    <Icon icon="ion:information-circle" className="input-info-icon" />
                  </Tooltip>
                </label>
                <div className="form-group">
                  <input
                    type="text"
                    id="eventName"
                    placeholder="Event Name"
                    {...register("tournament_name", {
                      required: {
                        value: true,
                        message: "Event Name is required",
                      },
                    })}
                  />
                </div>
                {errors?.tournament_name && (
                  <span className="error-message">
                    {errors.tournament_name.message}
                  </span>
                )}
              </div>

              {/* <div className="input-group">
                <label className="form-lable" htmlFor="sport_name">Sport type<span className='required-star '>*</span></label>
                <div className="form-group">
                  <Controller
                    name="sport_name"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Sport type is required",
                      },
                    }}
                    render={({ field }) => (
                      <Select
                        styles={customStyles}
                        // closeMenuOnSelect={false}
                        className="controller-select"
                        components={animatedComponents}
                        // defaultValue={row._id}
                        // isMulti
                        options={sportOptions}
                        onChange={(selectedOptions) => {
                          field.onChange(selectedOptions);
                        }}
                        value={field.value}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  />
                </div>
                {errors?.sport_name && (
                  <span className="error-message">
                    {errors.sport_name.message}
                  </span>
                )}
              </div> */}
              <div className="input-group">
                <label htmlFor="venue_type" className="form-label">Venue type</label>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#F17121',
                      borderRadius: 18,
                    },
                    components: {
                      Radio: {
                        colorPrimary: '#F17121',
                      },
                    },
                  }}
                >
                  <Radio.Group
                    onChange={onChangeVenueType}
                    value={venueType}
                    optionType="button"
                    buttonStyle="solid"
                    className="custom-button-tabs-v2"
                  >
                    {venueTypeOptions.map((option) => (
                      <Radio value={option.value} >
                        {/* <img src={option.img} style={{ filter: option.value === sportType ? 'brightness(0) invert(1)' : '', width: '12px', height: '12px', marginRight: '5px' }} /> */}
                        {option.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </ConfigProvider>
                {/* {errors?.match_type && (
                  <span className="error-message">
                    {errors.match_type.message}
                  </span>
                )} */}
              </div>
              {/* <div className="input-group">
                <label className="form-lable" htmlFor="venue_type">Venue type<span className='required-star '>*</span></label>
                <div className="form-group">
                  <Controller
                    name="venue_type"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Venue type is required",
                      },
                    }}
                    render={({ field }) => (
                      <Select
                        styles={customStyles}
                        // closeMenuOnSelect={false}
                        className="controller-select"
                        components={animatedComponents}
                        // defaultValue={row._id}
                        // isMulti
                        options={venueTypeOptions}
                        onChange={(selectedOptions) => {
                          field.onChange(selectedOptions);
                        }}
                        value={field.value}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  />
                </div>
                {errors?.venue_type && (
                  <span className="error-message">
                    {errors.venue_type.message}
                  </span>
                )}
              </div> */}
              {venueType == 'popup' &&
                <>
                  <div className="input-group">
                    <label htmlFor="venueName">
                      Popup Venue Name<span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="form-group">
                      <input
                        type="text"
                        id="venueName"
                        placeholder="Enter Venue Name"
                        {...register("venue_name", {
                          required: {
                            value: true,
                            message: "Venue Name is required",
                          },
                        })}
                      />
                    </div>
                    {errors?.venue_name && (
                      <span className="error-message">
                        {errors.venue_name.message}
                      </span>
                    )}
                  </div>
                  <div className="input-group">
                    <label htmlFor="venueAddress">
                      Full Address <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="form-group">
                      <input
                        type="text"
                        id="venueAddress"
                        placeholder="Enter Full Address"
                        {...register("venue_address", {
                          required: {
                            value: true,
                            message: "Full address is required",
                          },
                        })}
                      />
                    </div>
                    {errors?.venue_address && (
                      <span className="error-message">
                        {errors.venue_address.message}
                      </span>
                    )}
                  </div>
                  <div className="input-group">
                    <label htmlFor="facilityName">
                      Geo Location<span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="form-group">
                      <input
                        type="text"
                        id="geo_location"
                        placeholder="Enter Sponsor Name"
                        {...register("geo_location", {
                          required: {
                            value: true,
                            message: "Sponser Name is required",
                          },
                        })}
                      />
                    </div>
                    {errors?.geo_location && (
                      <span className="error-message">
                        {errors.geo_location.message}
                      </span>
                    )}
                  </div>
                </>
              }
              <div className="form-container-grid">

                <div className="input-group">
                  <label>Start Date <span style={{ color: "red" }}>*</span></label>
                  <div className="form-group">
                    <input
                      // min={currentDate}
                      type="date"
                      placeholder="Price"
                      {...register("start_date", {
                        required: {
                          value: true,
                          message: "Start Date is required",
                        },
                      })}
                    />
                  </div>
                  {errors?.start_date && (
                    <span className="error-message">
                      {errors.start_date.message}
                    </span>
                  )}
                </div>
                <div className="input-group">
                  <label>Start Time {moment(editdata.start_date).format("hh:mm A")} <span style={{ color: "red" }}>*</span></label>
                  <div className="form-group">
                    <input
                      type="time"
                      placeholder="Price"
                      {...register("start_time", {
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
                  {errors?.start_time && (
                    <span className="error-message">
                      {errors.start_time.message}
                    </span>
                  )}
                </div>

              </div>
              <div className="form-container-grid">
                <div className="input-group">
                  <label>End Date <span style={{ color: "red" }}>*</span></label>
                  <div className="form-group">
                    <input
                      type="date"
                      min={startDate}
                      placeholder="Price"
                      {...register("end_date", {
                        required: {
                          value: true,
                          message: "End Date is required",
                        },
                      })}
                    />
                  </div>
                  {errors?.end_date && (
                    <span className="error-message">
                      {errors.end_date.message}
                    </span>
                  )}
                  {/* {!isEndDateValid() && (
                    <span className="error-message">Invalid End Date</span>
                  )} */}
                </div>
                <div className="input-group">
                  <label>End Time <span style={{ color: "red" }}>*</span></label>
                  <div className="form-group">
                    <input
                      type="time"
                      placeholder="Price"
                      {...register("end_time", {
                        required: {
                          value: true,
                          message: "End Time is required",
                        },
                      })}
                    // value={timeRange.endTime}
                    // onChange={(e) =>
                    //   handleTimeChange("endTime", e.target.value)
                    // }
                    // disabled={!timeRange.startTime}
                    />
                  </div>
                  {errors?.end_time && (
                    <span className="error-message">
                      {errors.end_time.message}
                    </span>
                  )}
                  {timeErr ? (
                    <span className="error-message"> {timeErr} </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="input-group">
                <label className="form-lable" htmlFor="slotDuration">Slot Duration<span className='required-star '>*</span></label>
                <div className="form-group">
                  <Controller
                    name="slot_time_in_min"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Slot is required",
                      },
                    }}
                    render={({ field }) => (
                      <Select
                        styles={customStyles}
                        // closeMenuOnSelect={false}
                        className="controller-select"
                        components={animatedComponents}
                        // defaultValue={row._id}
                        // isMulti
                        options={slotDurationOptions}
                        onChange={(selectedOptions) => {
                          field.onChange(selectedOptions);
                        }}
                        value={field.value}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  />
                </div>
                {errors?.venue_type && (
                  <span className="error-message">
                    {errors.venue_type.message}
                  </span>
                )}
              </div>
              {/* <div>
                <div>
                  <label>Venue Booked<span className='required-star '>*</span></label>
                </div>
                <Radio.Group
                  options={ShowHomeOptions}
                  {...register('venue_book_status')}
                  onChange={onChangeVenueBooked}
                  value={isVenueBooked}
                />
              </div> */}
              <div className="input-group">
                <label htmlFor="match_mode" className="form-label">Venue Booked</label>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#F17121',
                      borderRadius: 18,
                    },
                    components: {
                      Radio: {
                        colorPrimary: '#F17121',
                      },
                    },
                  }}
                >
                  <Radio.Group
                    onChange={onChangeVenueBooked}
                    value={isVenueBooked}
                    optionType="button"
                    buttonStyle="solid"
                    className="custom-button-tabs-v2"
                  >
                    {ShowHomeOptions.map((option) => (
                      <Radio value={option.value}>
                        <Icon icon={option.icon} style={{ marginRight: '5px' }} />
                        {option.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </ConfigProvider>
              </div>
              <div className="input-group col-span-2-sm">
                <label>Last Date for registration <span style={{ color: "red" }}>*</span></label>
                <div className="form-group">
                  <input
                    type="datetime-local"
                    // max={tag?.value == "Coaching" ? `${endDate}T${endTime}` : `${startDate}T${startTime}`}
                    placeholder="Last Date for registration"
                    {...register("last_day_for_registration", {
                      required: {
                        value: true,
                        message: "Last Date is required",
                      },
                    })}
                  />
                </div>
                {errors?.last_day_for_registration && (
                  <span className="error-message">
                    {errors.last_day_for_registration.message}
                  </span>
                )}
                {/* {!isLastDateValid() && (
                    <span className="error-message">
                      Last Date must be less than or equal to Start Date and
                      Time
                    </span>
                  )} */}
              </div>
              <div className="input-group">
                <label htmlFor="match_mode" className="form-label">Tournament Mode</label>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#F17121',
                      borderRadius: 18,
                    },
                    components: {
                      Radio: {
                        colorPrimary: '#F17121',
                      },
                    },
                  }}
                >
                  <Radio.Group
                    onChange={onChangeMode}
                    value={matchMode}
                    optionType="button"
                    buttonStyle="solid"
                    className="custom-button-tabs-v2"
                  >
                    {modeOptions.map((option) => (
                      <Radio value={option.value}>
                        <Icon icon={option.icon} style={{ marginRight: '5px' }} />
                        {option.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </ConfigProvider>
              </div>
              <div className="input-group">
                <label htmlFor="match_mode" className="form-label">Tournament Formate</label>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#F17121',
                      borderRadius: 18,
                    },
                    components: {
                      Radio: {
                        colorPrimary: '#F17121',
                      },
                    },
                  }}
                >
                  <Radio.Group
                    onChange={onChangeformate}
                    value={formate}
                    optionType="button"
                    buttonStyle="solid"
                    className="custom-button-tabs-v2"
                  >
                    {formateOptions.map((option) => (
                      <Radio value={option.value}>
                        {option.icon && <Icon icon={option.icon} style={{ marginRight: '5px' }} />}
                        {option.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </ConfigProvider>
              </div>

              <div className="input-group">
                <label htmlFor="tag">Tournament Tag {editdata?.tag} <span style={{ color: "red" }}>*</span></label>
                <div className="form-group">
                  <Controller
                    name="tag"
                    control={control}
                    rules={{ required: 'Tournament Tag ' }}
                    render={({ field }) => (
                      <Select
                        className="controller-select"
                        components={animatedComponents}
                        placeholder="select type"
                        options={TournamentTags}
                        {...field}
                      />
                    )}
                  />
                </div>
                {errors?.tag && (
                  <span className="error-message">
                    {errors.tag.message}
                  </span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="position">Tournament Position
                  <Tooltip title={<>
                    <div>This will be used for sorting the events position in app.</div>
                  </>
                  } placement="right" color='#032037'>
                    <Icon icon="ion:information-circle" className="input-info-icon" />
                  </Tooltip>
                </label>
                <div className="form-group">
                  <input
                    style={{ width: "106%" }}
                    type="number"
                    id="position"
                    placeholder="Enter Event Position"
                    {...register("position", {
                      // required: {
                      //   value: true,
                      //   message: "Maximum registers number is required",
                      // },
                    })}
                  />
                </div>
                {errors?.position && (
                  <span className="error-message">
                    {errors.position.message}
                  </span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="facilityImage">Tournament Image <span style={{ color: "red" }}>*</span></label>
                <div className="form-group">
                  <input
                    type="file"
                    accept="image/x-png,image/gif,image/jpeg"
                    {...register("tournament_banner_img", {
                      required: {
                        value: edit == true ? false : true,
                        message: "Tournament Image is required ",
                      },
                    })}
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                </div>
                {errors?.tournament_banner_img && (
                  <span className="error-message">
                    {errors.tournament_banner_img.message}
                  </span>
                )}
              </div>
              {/* <div className="input-group">
                <label htmlFor="facilityImage">Thumbnail Image <span style={{ color: "red" }}>*</span></label>
                <div className="form-group">
                  <input
                    type="file"
                    accept="image/x-png,image/gif,image/jpeg"
                    {...register("image", {
                      required: {
                        value: edit == true ? false : true,
                        message: "Tournament Image is required ",
                      },
                    })}
                    onChange={onChange}
                    style={{ width: "100%" }}
                  />
                </div>
                {errors?.image && (
                  <span className="error-message">
                    {errors.image.message}
                  </span>
                )}
              </div> */}
              <div className="input-group">
              <label htmlFor="tournament_referee_ids">Referee<span style={{ color: "red" }}>*</span></label>
              <div className="form-group">
                  <Controller
                    name="tournament_referee_ids"
                    control={control}
                    render={({ field }) => (
                      <Select
                        // closeMenuOnSelect={false}
                        className="controller-select"
                        components={animatedComponents}
                        options={userList}
                        formatOptionLabel={(user: any) => (
                          <div className="select-option-container">
                            {user?.userData?.profile_url ?
                              <img src={user.userData.profile_url} className="option-image" /> :
                              <div className="option-image-placeholder">
                                {user.label[0]}
                              </div>}
                            <span>{user.label}</span>
                          </div>
                        )}
                        placeholder="Select Referee"
                        {...field}
                      />
                    )}
                  />
                </div>
                {errors?.tournament_referee_ids && (
                  <span className="error-message">
                    {errors.tournament_referee_ids.message}
                  </span>
                )}
              </div>

              {(previewImage != "" || editdata.tournament_banner_img) &&
                <div className="input-group col-span-2">
                  <div className='label-pre'>
                    <label htmlFor="myCheckbox"><strong>Image Preview</strong> </label>
                    {(editdata.tournament_banner_img && previewImage === "") && <button type="button" onClick={handleDownloadImage} className="pi-btn-primary"><div className="pi-btn-content"><Icon icon="material-symbols:download" width="16" height="16" style={{ color: "white" }} /></div></button>}
                  </div>
                  <label htmlFor="myCheckbox">Image Preview (Square)</label>
                  {previewImage !== "" ? <img src={previewImage} className="image-preview-app-detail" /> : < img src={editdata.tournament_banner_img} className="image-preview-app-detail" />}
                </div>}
              {/* {(previewImage != "" || editdata.tournament_banner_img) &&
                <div className="input-group col-span-2">
                  <div className='label-pre'>
                    <label htmlFor="myCheckbox"><strong> Thumbnail Image Preview</strong> </label>
                    {(editdata.tournament_banner_img && previewImage === "") && <button type="button" onClick={handleDownloadImage} className="pi-btn-primary"><div className="pi-btn-content"><Icon icon="material-symbols:download" width="16" height="16" style={{ color: "white" }} /></div></button>}
                  </div>
                  <label htmlFor="myCheckbox">Image Preview (Square)</label>
                  {previewImage !== "" ? <img src={previewImage} className="image-preview-app-detail" /> : < img src={editdata.tournament_banner_img} className="image-preview-app-detail" />}
                </div>} */}
              {/* <div className="input-group">
                <label htmlFor="facilityName">
                  Sponsored By<span style={{ color: "red" }}>*</span>
                </label>
                <div className="form-group">
                  <input
                    type="text"
                    id="facilityName"
                    placeholder="Enter Sponsor Name"
                    {...register("sponsor_by", {
                      required: {
                        value: true,
                        message: "Sponser Name is required",
                      },
                    })}
                  />
                </div>
                {errors?.sponsor_by && (
                  <span className="error-message">
                    {errors.sponsor_by.message}
                  </span>
                )}
              </div>
              <div className="input-group">
                <label className="form-lable" htmlFor="sport_name">Court Type<span className='required-star '>*</span></label>
                <div className="form-group">
                  <Controller
                    name="tournament_court"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Event Court is required",
                      },
                    }}
                    render={({ field }) => (
                      <Select
                        styles={customStyles}
                        // closeMenuOnSelect={false}
                        className="controller-select"
                        components={animatedComponents}
                        // defaultValue={row._id}
                        // isMulti
                        options={courtOptions}
                        onChange={(selectedOptions) => {
                          field.onChange(selectedOptions);
                        }}
                        value={field.value}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  />
                </div>
                {errors?.tournament_court && (
                  <span className="error-message">
                    {errors.tournament_court.message}
                  </span>
                )}
              </div>
              <div className="input-group">
                <label htmlFor="location">Event Location <span style={{ color: "red" }}>*</span></label>
                <div className="form-group">
                  <Controller
                    name="venue_id"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Event Location is required",
                      },
                    }}
                    render={({ field }) => (
                      <Select
                        styles={customStyles}
                        className="controller-select"
                        components={animatedComponents}
                        options={venue}
                        onChange={(selectedOptions) => {
                          field.onChange(selectedOptions);
                        }}
                        value={field.value}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  />
                </div>
                {errors?.venue_id && (
                  <span className="error-message">
                    {errors.venue_id.message}
                  </span>
                )}
              </div> */}
              {/* <div className="input-group">
                <label htmlFor="location">Event Organizer <span style={{ color: "red" }}>*</span></label>
                <div className="form-group">
                  <Controller
                    name="organizer_id"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Event Location is required",
                      },
                    }}
                    render={({ field }) => (
                      <Select
                        styles={customStyles}
                        className="controller-select"
                        components={animatedComponents}
                        options={organizers?.map((organizer) => ({
                          value: organizer._id,
                          label: organizer.name,
                        }))}
                        onChange={(selectedOptions) => {
                          field.onChange(selectedOptions);
                        }}
                        value={field.value}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  />
                </div>
                {errors?.organizer_id && (
                  <span className="error-message">
                    {errors.organizer_id.message}
                  </span>
                )}
              </div> */}

              {/* <div className="input-group">
                <label htmlFor="facilityName">Event Rewards<span style={{ color: "red" }}>*</span></label>
                <div className="form-group">
                  <input
                    type="text"
                    id="facilityName"
                    placeholder="Event Rewards"
                    {...register("rewards", {
                      required: {
                        value: true,
                        message: "Rewards are required",
                      },
                    })}
                  />
                </div>
                {errors?.rewards && (
                  <span className="error-message">
                    {errors.rewards.message}
                  </span>
                )}
              </div> */}
              {/* <div className="input-group">
                <label className="form-lable" htmlFor="tournament_level">Event Level<span className='required-star '>*</span></label>
                <div className="form-group">
                  <Controller
                    name="tournament_level"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Sport type is required",
                      },
                    }}
                    render={({ field }) => (
                      <Select
                        styles={customStyles}
                        closeMenuOnSelect={false}
                        className="controller-select"
                        components={animatedComponents}
                        // defaultValue={row._id}
                        isMulti
                        options={skills}
                        onChange={(selectedOptions) => {
                          field.onChange(selectedOptions);
                        }}
                        value={field.value}
                        name={field.name}
                        ref={field.ref}
                      />
                    )}
                  />
                </div>
                {errors?.tournament_level && (
                  <span className="error-message">
                    {errors.tournament_level.message}
                  </span>
                )}
              </div> */}
              {/* <div className="input-group">
                <label htmlFor="myCheckbox">Team <span style={{ color: "red" }}>*</span></label>
                <div className="form-group">
                  <input
                    type="checkbox"
                    id="myCheckbox"
                    {...register("team")}
                  />
                </div>
                {errors?.team && (
                  <span className="error-message">
                    {errors.team.message}
                  </span>
                )}
              </div> */}


              <div className="input-group col-span-3">
                <label htmlFor="address">Event Description <span style={{ color: "red" }}>*</span></label>
                <div className="form-group">
                  <textarea
                    rows={5}
                    id="address"
                    placeholder="Description"
                    {...register("tournament_description", {
                      required: {
                        value: true,
                        message: "Event Description is required",
                      },
                    })}
                  />
                  {/* <JoditEditor
                    ref={editor}
                    value={description}
                    config={config}
                    onBlur={(value) => {
                      setDescriptionErr('');
                      setDescription(value);
                    }}
                  /> */}
                </div>
                {deserror && (
                  <span className="error-message">
                    {deserror}
                  </span>
                )}
              </div>
            </div>
            <div className="side-line-heading">
              <hr className="side-line" />
              <span className="side-line-text">Contact details</span>
            </div>
            <div className="form-container-grid-3">
              <div className="input-group">
                <label htmlFor="facilityName">
                  Contact Name<span style={{ color: "red" }}>*</span>
                  {/* <Tooltip title={<>
                    <div>You can define social open play tournaments, corporate open play tournaments, and different category competition tournaments and destination events with padel & pickleball tournaments.</div>
                  </>
                  } placement="rightTop" color='#032037'>
                    <Icon icon="ion:information-circle" className="input-info-icon" />
                  </Tooltip> */}
                </label>
                <div className="form-group">
                  <input
                    type="text"
                    id="facilityName"
                    placeholder="Event Name"
                    {...register("contact_name", {
                      required: {
                        value: true,
                        message: "Event Name is required",
                      },
                    })}
                  />
                </div>
                {errors?.tournament_name && (
                  <span className="error-message">
                    {errors.tournament_name.message}
                  </span>
                )}
              </div>
              <div className="input-group">
                <label htmlFor="facilityName">
                  Contact Number
                  <span style={{ color: "red" }}>*</span>
                </label>
                <div className="form-group">
                  <input
                    type="text"
                    id="facilityName"
                    placeholder="Event Name"
                    {...register("contact_phone", {
                      required: {
                        value: true,
                        message: "Event Name is required",
                      },
                    })}
                  />
                </div>
                {errors?.tournament_name && (
                  <span className="error-message">
                    {errors.tournament_name.message}
                  </span>
                )}
              </div>
              <div className="input-group">
                <label htmlFor="facilityName">
                  Contact Email
                </label>
                <div className="form-group">
                  <input
                    type="text"
                    id="facilityName"
                    placeholder="Event Name"
                    {...register("contact_email", {
                      required: {
                        value: true,
                        message: "Event Name is required",
                      },
                    })}
                  />
                </div>
                {errors?.tournament_name && (
                  <span className="error-message">
                    {errors.tournament_name.message}
                  </span>
                )}
              </div>
            </div>
            <div className="side-line-heading">
              <hr className="side-line" />
              <span className="side-line-text">Reward details</span>
            </div>

            {singleCategoryPackages?.map((packageField, packageIndex) => {
              return (
                <div key={packageField.id}>
                  <div className="form-column form-container-grid-3">
                    <div className="input-group">
                      <label htmlFor={`rank-${packageIndex}`}>
                        Rank
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
                          placeholder="Enter Rank"
                          value={packageField.rank}
                          onChange={(e) =>
                            handleSingleCategoryPackageFieldChange(packageIndex, "rank", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="form-column form-container-grid-3 col-span-2">
                      <div className="input-group">
                        <label htmlFor={`cash-${packageIndex}`}>
                          Cash
                        </label>
                        <div className="form-group">
                          <input
                            type="number"
                            placeholder="Enter cash amount"
                            value={packageField.cash}
                            onChange={(e) => {
                              handleSingleCategoryPackageFieldChange(

                                packageIndex,
                                "cash",
                                e.target.value
                              );
                            }}
                          />
                        </div>
                      </div>
                      <div className="input-group">
                        <label htmlFor={`pi_coins-${packageIndex}`}>
                          Picoins
                        </label>
                        <div className="form-group">
                          <input
                            type="number"
                            placeholder="Enter amount of PiCoins"
                            value={packageField.pi_coins}
                            onChange={(e) => {
                              handleSingleCategoryPackageFieldChange(
                                packageIndex,
                                "pi_coins",
                                e.target.value
                              );
                            }}
                          />
                        </div>
                      </div>
                      <div className="input-group">
                        <label htmlFor={`others-${packageIndex}`}>
                          others
                        </label>
                        <div className="form-group">
                          <input
                            type="number"
                            placeholder="Enter Package Price"
                            value={packageField.others}
                            onChange={(e) => {
                              handleSingleCategoryPackageFieldChange(

                                packageIndex,
                                "others",
                                e.target.value
                              );
                            }}
                          />
                        </div>
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

            <div className="side-line-heading">
              <hr className="side-line" />
              <span className="side-line-text">Category Details</span>
            </div>
            {categoryDynamicFields?.map((field: any, index) => {
              return (
                <div className="border-bottom-bold col-span-3 " key={index}>
                  <div className="form-column form-container-grid-3">
                    <div className="col-span-3 form-subheadings">Category {index + 1}</div>
                    <div className="input-group">
                      <label htmlFor={`name-${index}`}>
                        Category Name
                        <Tooltip title={<>
                          <div>This will appear as category name in the app.</div>
                        </>
                        } placement="right" color='#032037'>
                          <Icon icon="ion:information-circle" className="input-info-icon" />
                        </Tooltip>
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Enter Category Name"
                          value={field?.category_details?.category_name[0]+ ' ' + field?.category_details?.category_name[1]}
                          onChange={(e) =>
                            handleCategoryFieldChange(index, "ui_name_for_tournament", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="form-container-grid">
                      <div className="input-group">
                        <label htmlFor={`category_name-${index}`}>Category Type (Gender)</label>
                        <div className="form-group">
                          <Select
                            closeMenuOnSelect={true}
                            className="controller-select"
                            components={animatedComponents}
                            options={categoryTypeList}
                            defaultValue={{ label: field?.category_name, value: field?.category_name }}
                            name={`category_name-${index}`}
                            onChange={(selectedOptions: any) => {
                              handleCategoryFieldChange(index, "category_name", [selectedOptions?.value])
                              if (selectedOptions?.value == "Open") {
                                field.above = ''
                                field.under = ''
                              }
                            }
                            }
                          />
                        </div>
                      </div>
                      <div className="input-group">
                        <label htmlFor={`match_type-${index}`}>Match Type</label>
                        <div className="form-group">
                          <Select
                            closeMenuOnSelect={true}
                            className="controller-select"
                            components={animatedComponents}
                            options={matchTypeList}
                            defaultValue={{ label: field?.match_type, value: field?.match_type }}
                            onChange={(selectedOptions: any) =>
                              handleCategoryFieldChange(index, "match_type", [selectedOptions?.value])
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-container-grid">
                      <div className="input-group">
                        <label htmlFor={`above-${index}`}>Above (Age)</label>
                        <div className="form-group">
                          <input
                            type="number"
                            placeholder={`${categoryDynamicFields[index]?.category_name[0] == "Open" ? 'Disabled' : 'Enter age'}`}
                            value={field.above}
                            onChange={(e) =>
                              handleCategoryFieldChange(index, "above", e.target.value)
                            }
                            disabled={categoryDynamicFields[index]?.category_name[0] == "Open" ? true : false}
                          />
                        </div>
                      </div>
                      <div className="input-group">
                        <label htmlFor={`under-${index}`}>Under (Age)</label>
                        <div className="form-group">
                          <input
                            type="number"
                            placeholder={`${categoryDynamicFields[index]?.category_name[0] == "Open" ? 'Disabled' : 'Enter age'}`}
                            value={field.under}
                            onChange={(e) =>
                              handleCategoryFieldChange(index, "under", e.target.value)
                            }
                            disabled={categoryDynamicFields[index]?.category_name[0] == "Open" ? true : false}
                          />
                        </div>
                      </div>
                    </div>
                    {/* <div className="input-group">
                      <label htmlFor={`rating-${index}`}>Ratings</label>
                      <div className="form-group">
                        <Select
                          styles={customStyles}
                          closeMenuOnSelect={false}
                          className="controller-select"
                          components={animatedComponents}
                          isMulti
                          defaultValue={field?.rating?.map((item: any) => {
                            const filteredratingswithid = skills?.find((skills: any) => skills?.data?._id === item)
                            return filteredratingswithid
                          })}
                          options={skills}
                          onChange={(selectedOptions: any) =>
                            handleCategoryFieldChange(index, "rating", selectedOptions.map((item: any) => edit === true && item?.value?._id ? item?.value?._id : item?.data))
                          }
                        />
                      </div>
                    </div> */}

                    <div className="form-container-grid">
                      <div className="input-group">
                        <label htmlFor={`start_date-${index}`}>Start Date</label>
                        <div className="form-group">
                          <input
                            type="date"
                            value={field.start_date}
                            onChange={(e) => {
                              if (e.target.value.length <= 10) {
                                handleCategoryFieldChange(index, "start_date", e.target.value);
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="input-group">
                        <label htmlFor={`start_time-${index}`}>Start Time</label>
                        <div className="form-group">
                          <input
                            type="time"
                            value={field.start_time}
                            onChange={(e) => {
                              if (e.target.value.length <= 10) {
                                handleCategoryFieldChange(index, "start_time", e.target.value);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-container-grid">
                      <div className="input-group">
                        <label htmlFor={`end_date-${index}`}>End Date</label>
                        <div className="form-group">
                          <input
                            type="date"
                            value={field.end_date}
                            onChange={(e) => {
                              if (e.target.value.length <= 10) {
                                handleCategoryFieldChange(index, "end_date", e.target.value);
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="input-group">
                        <label htmlFor={`end_time-${index}`}>End Time</label>
                        <div className="form-group">
                          <input
                            type="time"
                            value={field.end_time}
                            onChange={(e) => {
                              if (e.target.value.length <= 10) {
                                handleCategoryFieldChange(index, "end_time", e.target.value);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="input-group">
                      <label htmlFor={`max_registration-${index}`}>Max Registration</label>
                      <div className="form-group">
                        <input
                          type="number"
                          placeholder="Enter max no. of registration"
                          value={field.max_registration}
                          onChange={(e) => {
                            if (e.target.value.length <= 10) {
                              handleCategoryFieldChange(index, "max_registration", e.target.value);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="input-group">
                      <label htmlFor={`registration_fee-${index}`}>Registration Fees</label>
                      <div className="form-container-grid">
                        <div className="form-group">
                          <input
                            type="number"
                            placeholder="price per player"
                            value={field?.registration_fee?.per_person}
                            onChange={(e) => {
                              if (e.target.value.length <= 10) {
                                handleCategoryFieldChange(index, "per_person", e.target.value);
                              }
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="number"
                            placeholder="price per team"
                            value={field?.registration_fee?.per_team}
                            onChange={(e) => {
                              if (e.target.value.length <= 10) {
                                handleCategoryFieldChange(index, "per_team", e.target.value);
                              }
                            }}
                          />
                        </div>

                      </div>
                    </div>
                    {/* {field.packages?.map((packageField, packageIndex) => {
                      return (
                        <div className="col-span-3 " key={packageField.id}>
                          <div className="col-span-3 form-subheadings-sm">Add Pakages (Bulk Registration) {packageIndex + 1}</div>
                          <div className="form-column form-container-grid-3">
                            <div className="input-group">
                              <label htmlFor={`name-${packageIndex}`}>
                                Package Name
                              </label>
                              <div className="form-group">
                                <input
                                  type="text"
                                  placeholder="Enter Package Name"
                                  value={packageField.name}
                                  onChange={(e) =>
                                    handlePackageFieldChange(index, packageIndex, "name", e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div className="form-container-grid-3 col-span-2">
                              <div className="input-group">
                                <label htmlFor={`number_of_users-${packageIndex}`}>
                                  No. of People
                                </label>
                                <div className="form-group">
                                  <input
                                    type="number"
                                    placeholder="Enter No. of People"
                                    value={packageField.number_of_users}
                                    onChange={(e) => {
                                      handlePackageFieldChange(
                                        index,
                                        packageIndex,
                                        "number_of_users",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="input-group">
                                <label htmlFor={`no_of_free_registration-${packageIndex}`}>
                                  No. of Free Categories
                                </label>
                                <div className="form-group">
                                  <input
                                    type="number"
                                    placeholder="Enter No. of Free Categories"
                                    value={packageField.no_of_free_registration}
                                    onChange={(e) => {
                                      handlePackageFieldChange(
                                        index,
                                        packageIndex,
                                        "no_of_free_registration",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="input-group">
                                <label htmlFor={`discount-${packageIndex}`}>
                                  Price
                                </label>
                                <div className="form-group">
                                  <input
                                    type="number"
                                    placeholder="Enter Package Price"
                                    value={packageField.discount}
                                    onChange={(e) => {
                                      handlePackageFieldChange(
                                        index,
                                        packageIndex,
                                        "discount",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="det-icon">
                            <div className="add-more-end">
                              {packageIndex === field.packages.length - 1 && (
                                <button
                                  type="button"
                                  className="ad-btn"
                                  onClick={() => handleAddMorePackage(index)}
                                >
                                  <Icon icon="icon-park-solid:add-one" className="add-icon" />
                                  Add More Package
                                </button>
                              )}
                            </div>
                            <div className="delete-new">
                              {packageIndex !== 0 && (
                                <button
                                  type="button"
                                  className="icon-d"
                                  onClick={() => handleDeletePackage(index, packageIndex)}
                                >
                                  <Icon icon="clarity:trash-solid" /> Delete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })} */}
                  </div>

                  <div className="det-icon">
                    <div className="add-more">
                      {/* Check if the current category is the last one and if the add more button should be shown */}
                      {index === categoryDynamicFields.length - 1 && showCategoryAddMore && (
                        <button
                          type="button"
                          className="ad-btn-lg"
                          onClick={handleCategoryAddMore}  // Function to handle adding more categories
                        >
                          <Icon icon="mdi-note-plus-outline" className="add-icon-lg" />
                          Add More Category
                        </button>
                      )}
                      {index === categoryDynamicFields.length - 1 && showCategoryAddMore && (
                        <button
                          type="button"
                          className="ad-btn-lg"
                          onClick={() => duplicateCategory(index)}  // Function to handle adding more categories
                        >
                          <Icon icon="mdi-content-copy" className="add-icon-lg" />
                          Duplicate Category
                        </button>
                      )}
                    </div>

                    <div className="delete-lg">
                      {/* Show delete button for all categories except the first one */}
                      {index !== 0 && (
                        <button
                          type="button"
                          className="icon-d-lg"
                          onClick={() => { handleCategoryDelete(field, index) }} // Function to handle deleting the category by ID
                        >
                          <Icon icon="clarity:trash-solid" /> Delete Category
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* {eventType === "Single" &&
              <>
                <div className="form-container-grid-3">
                  <div className="input-group">
                    <label htmlFor="contactNumber">Max Registrations<span style={{ color: "red" }}>*</span></label>
                    <div className="form-group">
                      <input
                        style={{ width: "106%" }}
                        type="number"
                        id="contactNumber"
                        placeholder="Maximum Registrations Number"
                        {...register("total_number_of_registration", {
                          required: {
                            value: true,
                            message: "Maximum Registrations is required",
                          },
                        })}
                      />
                    </div>
                    {errors?.total_number_of_registration && (
                      <span className="error-message">
                        {errors.total_number_of_registration.message}
                      </span>
                    )}
                  </div>
                  <div className="input-group">
                    <label>Start Date <span style={{ color: "red" }}>*</span></label>
                    <div className="form-group">
                      <input
                        type="date"
                        placeholder="Price"
                        {...register("start_date", {
                          required: {
                            value: true,
                            message: "Start Date is required",
                          },
                        })}
                      />
                    </div>
                    {errors?.start_date && (
                      <span className="error-message">
                        {errors.start_date.message}
                      </span>
                    )}
                  </div>
                  <div className="input-group">
                    <label>End Date <span style={{ color: "red" }}>*</span></label>
                    <div className="form-group">
                      <input
                        type="date"
                        min={startDate}
                        placeholder="Price"
                        {...register("end_date", {
                          required: {
                            value: true,
                            message: "End Date is required",
                          },
                        })}
                      />
                    </div>
                    {errors?.end_date && (
                      <span className="error-message">
                        {errors.end_date.message}
                      </span>
                    )}

                  </div>
                  <div className="input-group">
                    <label>Start Time <span style={{ color: "red" }}>*</span></label>
                    <div className="form-group">
                      <input
                        type="time"
                        placeholder="Price"
                        {...register("start_time", {
                          required: {
                            value: true,
                            message: "Start Time is required",
                          },
                        })}

                      />
                    </div>
                    {errors?.start_time && (
                      <span className="error-message">
                        {errors.start_time.message}
                      </span>
                    )}
                  </div>
                  <div className="input-group">
                    <label>End Time <span style={{ color: "red" }}>*</span></label>
                    <div className="form-group">
                      <input
                        type="time"
                        placeholder="Price"
                        {...register("end_time", {
                          required: {
                            value: true,
                            message: "End Time is required",
                          },
                        })}

                      />
                    </div>
                    {errors?.end_time && (
                      <span className="error-message">
                        {errors.end_time.message}
                      </span>
                    )}
                    {timeErr ? (
                      <span className="error-message"> {timeErr} </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="form-subheadings">Pricing</div>
                <div className="form-container-grid-3">
                  <div className="input-group">
                    <label htmlFor="pricePerPlyer">Price per player

                      <span style={{ color: "red" }}>*</span>
                      <Tooltip title={<>
                        <div>This can be 0 in case of categories. Use this field to define social open play matches without categories.</div>
                      </>
                      } placement="rightTop" color='#032037'>
                        <Icon icon="ion:information-circle" className="input-info-icon" />
                      </Tooltip>
                    </label>
                    <div className="form-group">
                      <input
                        type="number"
                        id="pricePerPlyer"
                        placeholder="Price per player"
                        {...register("price_per_player", {
                          required: {
                            value: true,
                            message: "Price per Player is required",
                          },
                        })}
                      />

                    </div>
                    {errors?.price_per_player && (
                      <span className="error-message">
                        {errors.price_per_player.message}
                      </span>
                    )}
                  </div>
                  <div className="input-group">
                    <label htmlFor="pricePerTeam">Price per team <span style={{ color: "red" }}>*</span></label>
                    <div className="form-group">
                      <input
                        type="number"
                        id="pricePerTeam"
                        placeholder="Price per team"
                        {...register("price_per_team", {
                          required: {
                            value: true,
                            message: "Price per Team is required",
                          },
                        })}
                      />

                    </div>
                    {errors?.price_per_team && (
                      <span className="error-message">
                        {errors.price_per_team.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="form-subheadings">Add Packages (Bulk Registration)
                  <Tooltip title={<>
                    <div>Packages are for the players family or support group to come and stay with our players.</div>
                  </>
                  } placement="rightTop" color='#032037'>
                    <Icon icon="ion:information-circle" className="input-info-icon" />
                  </Tooltip>
                </div>
                <div className="border-bottom-light">
                  {singleCategoryPackages?.map((packageField, packageIndex) => {
                    return (
                      <div key={packageField.id}>
                        <div className="form-column form-container-grid-3">
                          <div className="input-group">
                            <label htmlFor={`name-${packageIndex}`}>
                              Package Name
                              <Tooltip title={<>
                                <div>Packages are for the players family or support group to come and stay with our players.</div>
                              </>
                              } placement="rightTop" color='#032037'>
                                <Icon icon="ion:information-circle" className="input-info-icon" />
                              </Tooltip>
                            </label>
                            <div className="form-group">
                              <input
                                type="text"
                                placeholder="Enter Package Name"
                                value={packageField.name}
                                onChange={(e) =>
                                  handleSingleCategoryPackageFieldChange(packageIndex, "name", e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <div className="form-column form-container-grid-3 col-span-2">
                            <div className="input-group">
                              <label htmlFor={`number_of_users-${packageIndex}`}>
                                No. of People
                              </label>
                              <div className="form-group">
                                <input
                                  type="number"
                                  placeholder="Enter No. of People"
                                  value={packageField.number_of_users}
                                  onChange={(e) => {
                                    handleSingleCategoryPackageFieldChange(

                                      packageIndex,
                                      "number_of_users",
                                      e.target.value
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            <div className="input-group">
                              <label htmlFor={`no_of_free_registration-${packageIndex}`}>
                                No. of Free Categories
                              </label>
                              <div className="form-group">
                                <input
                                  type="number"
                                  placeholder="Enter No. of Free Categories"
                                  value={packageField.no_of_free_registration}
                                  onChange={(e) => {
                                    handleSingleCategoryPackageFieldChange(

                                      packageIndex,
                                      "no_of_free_registration",
                                      e.target.value
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            <div className="input-group">
                              <label htmlFor={`discount-${packageIndex}`}>
                                Price
                              </label>
                              <div className="form-group">
                                <input
                                  type="number"
                                  placeholder="Enter Package Price"
                                  value={packageField.discount}
                                  onChange={(e) => {
                                    handleSingleCategoryPackageFieldChange(

                                      packageIndex,
                                      "discount",
                                      e.target.value
                                    );
                                  }}
                                />
                              </div>
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
              </>} */}
            <Footer className='ant-modal-footer'>
              <button
                type="button"
                className="pi-btn-secondary"
                onClick={closingFunctions}
              >
                Cancel
              </button>
              <button type="submit" className="pi-btn-primary">
                {edit == true ? copy == true ? "Add Event" : "Save Event" : "Add Event"}
              </button>
            </Footer>
          </form >
        </div >
      </Modal >
    </div >
  );
};
export default AddTournament;
