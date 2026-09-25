import React, { useEffect, useMemo, useRef, useState } from "react";
import { Checkbox, Modal, Radio, RadioChangeEvent, Switch, Tooltip } from "antd";
import { useForm, Controller, FieldErrors } from "react-hook-form";
import "../css/style.css";
import { toast } from "react-toastify";
import { createEventAPI, deleteEventCategory, editEventAPI, editEventCategory } from "../apiFile/Service";
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

interface formModal {
  tournament_name: string;
  tournament_type: any;
  total_number_of_registration: any;
  tournament_court: any;
  price: any;
  price_per_player: String;
  price_per_team: String;
  tournament_level: any;
  start_date: string;
  organizer_id: any;
  start_time: string;
  facility_id: any;
  end_date: string;
  end_time: string;
  venue_id: any;
  last_day_for_registration: string;
  tournament_description: string;
  rewards: string;
  image: any;
  team: boolean;
  sponsor_by: string;
  packages: any[];
  tournament_category_ids: any[];
  tournament_tag: any;
  position: any;
  image_url: string;
  registration_fee: any;
  registration_fee_gst: any;
  registration_fee_price: any;
}

const AddTournamentV2 = ({
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
}) => {
  const form = useForm({
    defaultValues: {
      tournament_name: "",
      tournament_type: [],
      total_number_of_registration: "",
      tournament_court: {},
      price: 0,
      price_per_player: "",
      price_per_team: "",
      tournament_level: [],
      start_date: "",
      organizer_id: {},
      start_time: "",
      facility_id: {},
      end_date: "",
      end_time: "",
      venue_id: {},
      last_day_for_registration: "",
      tournament_description: "",
      rewards: "",
      image: "",
      team: false,
      sponsor_by: "",
      packages: [],
      tournament_category_ids: [],
      tournament_tag: {},
      position: "",
      image_url: "",
      registration_fee: {},
      registration_fee_gst: {},
      registration_fee_price: {},
    },
    // mode: "onSubmit"
  });
  const data1 = data || [];
  const { register, handleSubmit, reset, watch, control, formState, setError, clearErrors } = form;
  const { errors } = formState;
  const currentDate = new Date().toISOString().split("T")[0];
  const startDate = watch("start_date");
  const endDate = watch("end_date");
  const startTime = watch("start_time");
  const endTime = watch("end_time");
  const Type = watch("tournament_type");
  const price = watch("price");
  const tag : any = watch("tournament_tag");
  const lastDateForRegistration = watch("last_day_for_registration");
  const [previewImage, setPreviewImage] = useState('');
  const [description, setDescription] = useState("")
  const [deserror, setDescriptionErr] = useState('');
  const editor = useRef(null);
  const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails);
  const [eventType, setEventType] = useState('Single');

  const sportOptions = [
    { label: 'Padel', value: 'padel' },
    { label: 'Pickleball', value: 'pickleball', },
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
    if (eventType !== "Multiple") {
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
    }

    data.tournament_level = data?.tournament_level?.map(item => {
      return (
        {
          "label": item.label,
          "value": item.data
        }
      )
    })
    data.tournament_level = JSON.stringify(data.tournament_level);
    data.total_number_of_registration = Number(
      data.total_number_of_registration
    );


    var date = Math.round(+new Date() / 1000);
    if (data.image.length > 0) {
      await fileURL(data.image, date)
      data.image_url = `${Constants.BaseLink}events/${date}_eventImage_${data.image[0].name}`;
    } else if (edit == true) {
      data.image_url = editdata.image_url
    } else {
      data.image_url = "NO Image Added"
    }
    if (eventType === "Multiple") {
      data.total_number_of_registration = 0
      data.start_date = categoryDynamicFields[0]?.start_date
      data.end_date = categoryDynamicFields[0]?.end_date
      data.start_time = categoryDynamicFields[0]?.start_time
      data.end_time = categoryDynamicFields[0]?.end_time
      if (edit == true && copy == true) {
        const data = editdata.tournament_category_ids.map((data) => {
          delete data._id;
          return data;
        })
        setCategoryDynamicFields(data);
      }
      data.tournament_category_ids = categoryDynamicFields;
      data.price = 0
    }

    if (eventType === "Single") {
      data.registration_fee = {
        per_person: data?.price_per_player,
        per_team: data?.price_per_team,
      };
      data.registration_fee_gst = {
        per_person_gst: calculateSettlement(Number(data?.price_per_player)).gstAmount,
        per_team_gst: calculateSettlement(Number(data?.price_per_team)).gstAmount
      }
      data.registration_fee_price = {
        per_person_price: calculateSettlement(Number(data?.price_per_player)).baseAmount,
        per_team_price: calculateSettlement(Number(data?.price_per_team)).baseAmount,
      }
      data.packages = singleCategoryPackages;
      data.price = Number(data?.price_per_player)
    }

    data.organizer_id = data.organizer_id?.value
    data.venue_id = data?.venue_id?.value
    data.tournament_court = data.tournament_court?.value
    data.position = Number(data?.position);
    data.tournament_tag = data?.tournament_tag?.value
    data.tournament_type = JSON.stringify(data?.tournament_type)
    data.facility_id = data?.facility_id?.value

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

  useEffect(() => {
    if (edit == true) {
      reset({
        "tournament_name": editdata.tournament_name,
        "tournament_description": editdata.tournament_description,
        "tournament_type": editdata?.packages?.length > 0 && editdata.tournament_type.includes('[') ? JSON.parse(editdata.tournament_type) : editdata.tournament_type.includes('[') ? JSON.parse(editdata.tournament_type).map((item: any) => ({ label: item.label, value: item.value } )) : [{ label: editdata.tournament_type, value: editdata.tournament_type }],
        "tournament_level": JSON.parse(editdata.tournament_level).map((item: any) => ({ label: item.label, value: item.value?._id, data: item.value })),
        "tournament_court": { value: editdata.tournament_court, label: editdata.tournament_court },
        "facility_id": { label: editdata.venue.name, value: editdata.venue._id },
        "total_number_of_registration": editdata.total_number_of_registration,
        "price": editdata.total,
        "price_per_player": editdata?.registration_fee?.per_person,
        "price_per_team": editdata.registration_fee?.per_team,
        "end_date": editdata.end_date,
        "start_time": editdata.start_time,
        "start_date": editdata.start_date,
        "end_time": editdata.end_time,
        "rewards": editdata.rewards,
        "last_day_for_registration": editdata.last_day_for_registration,
        "organizer_id": { label: editdata.organizer.name, value: editdata.organizer._id },
        "team": editdata?.team,
        "venue_id": { label: `${editdata.venue.name} ${editdata.venue.location_city}`, value: editdata.venue._id },
        "sponsor_by": editdata?.sponsor_by,
        "tournament_tag": { value: editdata.tournament_tag, label: editdata.tournament_tag },
        "position": editdata?.position,
      });
      if (editdata?.tournament_category_ids?.length > 0) {
        setEventType('Multiple')
        editdata.tournament_category_ids.map((data) => {
          data.start_date = moment(data.start_date).format("YYYY-MM-DD")
          data.end_date = moment(data.end_date).format("YYYY-MM-DD")
          return data
        })
        setCategoryDynamicFields(editdata.tournament_category_ids);
      }
      else if (editdata?.packages?.length > 0) {
        setEventType('Single')
        editdata.packages.map((data) => {
          data.start_date = moment(data.start_date).format("YYYY-MM-DD")
          data.end_date = moment(data.end_date).format("YYYY-MM-DD")
          return data
        })
        setSingleCategoryPackages(editdata.packages);
      }
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
      setSingleCategoryPackages([{ id: 1, name: "", number_of_users: "", discount: '', base_price: '', gst: '', no_of_free_registration: '' }]);
      setEventType('Single')
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
  const [singleCategoryPackages, setSingleCategoryPackages] = useState([
    { id: 1, name: "", number_of_users: "", discount: '', base_price: '', gst: '', no_of_free_registration: '' },
  ]);

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
    const newPackage = { id: singleCategoryPackages.length + 1, name: "", number_of_users: "", discount: '', base_price: '', gst: '', no_of_free_registration: '' };
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

  const onChangeEnableBulkCategory = (checked: boolean) => {
    setEnableBulkCategory(checked)
  };

  const onEventTypeChange = ({ target: { value } }: RadioChangeEvent) => {
    setEventType(value);
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
            <div className="form-container-grid-3 border-bottom-light">
              <div className="input-group">
                <label htmlFor="facilityName">
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
                    id="facilityName"
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
              <div className="input-group">
                <label className="form-lable" htmlFor="tournament_type">Sport type<span className='required-star '>*</span></label>
                <div className="form-group">
                  <Controller
                    name="tournament_type"
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
                {errors?.tournament_type && (
                  <span className="error-message">
                    {errors.tournament_type.message}
                  </span>
                )}
              </div>
              <div className="input-group">
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
                <label className="form-lable" htmlFor="tournament_type">Court Type<span className='required-star '>*</span></label>
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
              </div>
              <div className="input-group">
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
                        options={organizers.map((organizer) => ({
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
              </div>

              <div className="input-group">
                <label htmlFor="tournament_tag">Event Tag <span style={{ color: "red" }}>*</span></label>
                <div className="form-group">
                  <Controller
                    name="tournament_tag"
                    defaultValue={editdata?.tournament_tag}
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: "Event Tag is required",
                      },
                    }}
                    render={({ field }) => (
                      <Select
                        styles={customStyles}
                        className="controller-select"
                        components={animatedComponents}
                        options={TournamentTags}
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
                {errors?.tournament_tag && (
                  <span className="error-message">
                    {errors.tournament_tag.message}
                  </span>
                )}
              </div>
              <div className="input-group">
                <label htmlFor="position">Event Position
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
              <div className="input-group col-span-2-sm">
                <label>Last Date for registration <span style={{ color: "red" }}>*</span></label>
                <div className="form-group">
                  <input
                    type="datetime-local"
                    max={tag?.value == "Coaching" ? `${endDate}T${endTime}` : `${startDate}T${startTime}`}
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
              </div>
              <div className="input-group">
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
              </div>
              <div className="input-group">
                <label htmlFor="myCheckbox">Team <span style={{ color: "red" }}>*</span></label>
                <div className="form-group">
                  <input
                    type="checkbox"
                    id="myCheckbox"
                    {...register("team")}
                  />
                  {/* <Checkbox className='checkbox-primary'  /> */}
                </div>
                {errors?.team && (
                  <span className="error-message">
                    {errors.team.message}
                  </span>
                )}
              </div>
              <div className="input-group">
                <label htmlFor="facilityImage">Tournament Image <span style={{ color: "red" }}>*</span></label>
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
              </div>
              {(previewImage != "" || editdata.image_url) &&
                <div className="input-group col-span-2">
                  <div className='label-pre'>
                    <label htmlFor="myCheckbox"><strong>Image Preview</strong> </label>
                    {(editdata.image_url && previewImage === "") && <button type="button" onClick={handleDownloadImage} className="pi-btn-primary"><div className="pi-btn-content"><Icon icon="material-symbols:download" width="16" height="16" style={{ color: "white" }} /></div></button>}
                  </div>
                  <label htmlFor="myCheckbox">Image Preview (Square)</label>
                  {previewImage !== "" ? <img src={previewImage} className="image-preview-app-detail" /> : < img src={editdata.image_url} className="image-preview-app-detail" />}
                </div>}

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
            <div className="form-subheadings">Type of Event</div>
            <div className="event-type-container">
              <Radio.Group onChange={onEventTypeChange} value={eventType}>
                {eventOptions.map((option) => (
                  <Radio value={option.value} disabled={option?.disabled}>{option.label}<Tooltip
                    title={<>
                      <div>
                        {option.tooltip}
                      </div>
                    </>} placement="rightTop" color='#032037'>
                    <Icon icon="ion:information-circle" className="input-info-icon" />
                  </Tooltip></Radio>
                ))}
              </Radio.Group>
            </div>

            {eventType === "Single" &&
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
                        {/* <div className="col-span-3 form-subheadings-sm">Package - {packageIndex + 1}</div> */}
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
              </>}

            {eventType === "Multiple" && categoryDynamicFields?.map((field: any, index) => {
              return (
                <div className="border-bottom-bold col-span-3 " key={index}>
                  <div className="form-column form-container-grid-3">
                    <div className="col-span-3 form-subheadings">Add Category {index + 1}</div>
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
                          value={field.ui_name_for_tournament}
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
                    {field.packages?.map((packageField, packageIndex) => {
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
                    })}
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
export default AddTournamentV2;
