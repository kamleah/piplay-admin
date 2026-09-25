import React, {
  Fragment,
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Card, Breadcrumb, Button, Radio, RadioChangeEvent } from "antd";
import {
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Webcam from "react-webcam";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import * as Constants from "../../../components/apiFile/Constants";
import ToastMessage from "../ToastMessage/ToastMessage";
import {
  getFacilityApi,
  addFacilityApi,
  deleteFacilityAPI,
  getFacilityByIdApi,
  facilityFilterAPI,
  deleteAddOnAPI
} from "../../../components/apiFile/Service";
import "../FacilityManagement/FacilityManagement.css";
import { useForm } from "react-hook-form";
import Table from "../../../components/Table/DataTable";
import { RiDeleteBin5Fill } from "react-icons/ri";
import AddFacilityManagement from "../../../components/Modal/AddFacilityManagement";
import { useSelector } from "react-redux";
import DeleteConfirmation from "../../../components/Modal/DeleteConfirmation";
import FacilityDetails from "../../../components/Modal/FacilityDetails";
import { Icon } from '@iconify-icon/react';
import Excel from "../../../components/Helpers/Excel";
import FilterData from "../../../components/Modal/FilterData";
import AddFacilityPaymentConfig from "../../../components/Modal/AddFacilityPaymentConfig";



const FacilityManagement = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {  
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("auth");
  const [showFacilityViewModal, setShowFacilityViewModal] = useState(false);
  const [paymentModal, setpaymentModal] = useState(false);
  const [showFacilityEditModal, setShowFacilityEditModal] = useState(false);
  const [rowdata, setRowdata] = useState({});
  const [phone_no, setPhone_no] = useState([])
  const [editData, setEditData] = useState({})
  const [edit, setEdit] = useState(false)
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [selectedGameType, setSelectedGameType] = useState('all');
  const [visible, setVisible] = useState(false);
  const toggle = () => { setpaymentModal(!paymentModal) };

  const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
  const { register, watch, setValue, reset } = useForm()

  let name = watch("name");
  let city = watch("city");
  let address = watch("address");
  let sport_type = watch("sport_type");
  let pincode = watch("pincode");


  // popup modal
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const form = useForm({
    defaultValues: {
      name: "",
      address: "",
      location: "",
      phone_no: "",
      email: "",
      longitude: "",
      Latitude: "",
      court_type: "",
      file: []
    }
  })

  const copyToClipboard = (row) => {
    const rowDetails = JSON.stringify(row, null, 2);
    navigator.clipboard
      .writeText(rowDetails)
      .then(() => {
        toast(<ToastMessage body={"Copied Successfully"} type="success" />, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        console.error("Failed to copy row details to clipboard:", error);
      });
  };


  const columns = [
    {
      name: 'Image',
      selector: row => row?.image && row?.image,
      wrap: true,
      sortable: true,
      cell: row => (<div><img src={Array.isArray(row?.image) ? `${row?.image[0]}?v=1.0` : `${row?.image}?v=1.0`} alt="Image not loaded" className='table-lg-img' /></div>)
    },
    {
      name: 'Facility Name',
      selector: row => row?.name && row?.name,
      wrap: true,
      sortable: true
    },
    {
      name: 'Email ID',
      selector: row => row?.email ? row?.email : `${row?.contactInfo?.email}`,
      wrap: true,
      sortable: true,
    },
    {
      name: 'Phone Number',
      selector: row =>
        row?.mobileno != undefined ? row?.mobileno.toString() : row?.contactInfo?.phone.toString(),
      wrap: true,
      sortable: true
    },
    {
      name: 'Facility Location',
      selector: row => row?.city ? `${row?.address},${row?.city}` : `${row?.address}`,
      wrap: true,
      sortable: true
    },
    {
      name: 'Court Type',
      selector: row => row?.court_type ? row?.court_type : '',
      wrap: true,
      sortable: true
    },
    {
      name: 'No of Courts',
      selector: row => row?.number_of_courts ? row?.number_of_courts : '',
      wrap: true,
      sortable: true
    },
    {
      name: 'No of Users',
      selector: row => row?.number_of_users ? row?.number_of_users : '',
      wrap: true,
      sortable: true
    },
    {
      name: 'Sport Type',
      selector: row => row?.sport_type ? row?.sport_type : '',
      wrap: true,
      sortable: true
    },
    // {
    //   name: 'GPS CoOrdinates',
    //   selector: row => `${row?.location.lat} ,${row?.location.lon}`,
    //   wrap: true,
    //   sortable: true
    // },
    {
      name: "Action",
      selector: row => row?.action,
      wrap: true,
      cell: row => (
        <div className='action-button-container'>
          {modulePermissionsData?.view &&
            <button className='action-button view-button'
              onClick={() => handleshowRegisteredModal(row, 'view')}>
              <Icon icon="raphael:view" />
            </button>
          }
          {modulePermissionsData?.edit &&
            <button className='action-button edit-button' onClick={() => { setEdit(true); setVisible(true); setEditData(row); handleshowRegisteredModal(row, 'edit') }}><Icon icon="mdi:pencil-outline" /></button>
          }
          {modulePermissionsData?.delete &&
            <button onClick={() => { handleDeleteConfirmation(row._id) }} className='action-button delete-button'>
              <Icon icon="clarity:trash-solid" />
            </button>
          }
          {modulePermissionsData?.delete &&
            <button onClick={() => copyToClipboard(row)} className='action-button delete-button'>
              <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} />
            </button>
          }
        </div>
      ),
    },
  ]

  //  image profile
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string | null>(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
    }
  }, [webcamRef]);

  const videoConstraints = {
    width: 720,
    height: 360,
    facingMode: "user",
  };
  
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    console.log(fileList)
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    console.log(file)
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
  };


  const [gData, setGData] = useState([]);
  const [getFacility, setGetFacility] = useState([]);
  const [mainLang, setMainLang] = useState("");
  const handleshowRegisteredModal = async (row: any, type: any) => {
    setRowdata(row);
    if (type == 'view') {
      setShowFacilityViewModal(true);
    } else if (type == 'edit') {
      setShowFacilityEditModal(true);
    } else if (type == 'add') {
      setRowdata({});
      setShowFacilityViewModal(false);
      setShowFacilityEditModal(true);

    }
  };
  const handleDeleteConfirmation = async (id) => {    
    await deleteAddOnAPI(loggedInUser, id);
    setUserToDeleteId(id);
    setDeleteConfirmationVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDeleteId) {
      await DeleteFunction(userToDeleteId);
      setDeleteConfirmationVisible(false);
      setShowFacilityEditModal(false);
      setUserToDeleteId("");
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationVisible(false);
    setShowFacilityViewModal(false);
    setShowFacilityEditModal(false);

    setUserToDeleteId("");
  };
  const DeleteFunction = async (id) => {
    let response = await deleteFacilityAPI(loggedInUser, id)
    if (response.statusCode == 0) {
      toast(<ToastMessage body={"Facility Deleted Successfully with Associated Courts"} type="success" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      getAllFacility();
    } else {
      toast(<ToastMessage body={"Failed To Delete the Facility"} type="warning" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  const getAllFacility = async () => {
    let response = await getFacilityApi(loggedInUser);
    if (!loggedUserDetails?.roleId) {
      setGetFacility(response?.result);
    } else {
      const filteredFacilities = response?.result.filter(item => loggedUserDetails?.facilities.includes(item._id));
      setGetFacility(filteredFacilities);
    }
  };

  useEffect(() => {
    getAllFacility();
  }, []);


  const [loginData, setLoginData] = useState({});
  const handleBlur = (e) => {
    const newLoginData = { ...loginData };
    newLoginData[e.target.name] = e.target.value;
    setLoginData(newLoginData);
  };

  const [userLocation, setUserLocation] = useState<null | {
    latitude: number;
    longitude: number;
  }>(null);
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
  const Search = async (search, value) => {
    let sport = ''
    if (value == '') {
      sport = sport_type
    } else {
      sport = value
    }
    let response = await facilityFilterAPI(loggedInUser,
      name == undefined ? '' : name,
      city == undefined ? "" : city,
      address == undefined ? "" : address,
      sport == undefined || sport == 'all' ? '' : sport,
      pincode == undefined ? '' : pincode, ''
    );
    if (typeof response?.result !== 'string') {
      setGetFacility(response?.result)
    } else {
      setGetFacility([]);
    }
  };




  const options = [
    { label: 'All', value: 'all' },
    { label: 'Padel', value: 'padel' },
    { label: 'Pickleball', value: 'pickleball', },
  ];

  const onSportsChange = ({ target: { value } }: RadioChangeEvent) => {
    setValue('sport_type', value);
    Search(true, value)
  };
  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const FilterSection = () => {
    return (
      <>
        <div className="filter-form">
          <div className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"}`}>
            <div className="input-group">
              <label htmlFor="event" className="form-lable"> Name</label>
              <div className="form-group">
                <input
                  className="form-field"
                  type="text"
                  id="expirydate"
                  placeholder=" Name"
                  {...register('name')}
                />
              </div>

            </div>

            <div className="input-group">
              <label htmlFor="event" className="form-lable">Location</label>
              <div className="form-group">
                <input
                  className="form-field"
                  type="text"
                  id="expirydate"
                  placeholder="Location "
                  {...register('address')}
                />
              </div>
            </div>
          </div>

          {!matches && <div className="filter-buttons-row">
            <Button className="pi-btn-primary" key="confirm" type="primary"
              onClick={() => {
                Search(true, "")
                handleOpenChange(false);

              }}
            >Apply</Button>
            <Button className="pi-btn-secondary" key="cancel"
              onClick={() => {
                reset({
                  name: '',
                  city: '',
                  address: '',
                  sport_type: 'all',
                  pincode: '',
                });
                getAllFacility();
                handleOpenChange(false);

              }}
            > Clear</Button>
          </div>}
        </div>
        {matches && <div className="filter-buttons-row">
          <Button className="pi-btn-primary" key="confirm" type="primary"
            onClick={() => {
              Search(true, "")
              handleOpenChange(false);
            }}
          >Apply</Button>
          <Button className="pi-btn-secondary" key="cancel"
            onClick={() => {
              reset({
                name: '',
                city: '',
                address: '',
                sport_type: 'all',
                pincode: '',
              });
              getAllFacility();
              handleOpenChange(false);
            }}
          > Clear</Button>
        </div>}
      </>
    )
  }
  return (
    <Fragment>
      <div
        onClick={onToggle}
        className={menuOpen ? `page-open-header${matches ? "-mobile" : ""}` : `page-header${matches ? "-mobile" : ""}`}
      >
        <Card>
          {!matches && <Breadcrumb
            items={[
              {
                title: "Home",
              },

              {
                title: "Facilities",
              },
            ]}
          />}
          <div className="main-title-container">
            <div className="title-add-mobile">
              <h5 className="main-content-title">Facilities</h5>
              {matches && modulePermissionsData?.add &&
                <Button
                  className="pi-btn-primary"
                  key="confirm" type="primary"
                  onClick={() => { setEdit(false); setVisible(true); handleshowRegisteredModal({}, 'add') }}
                >
                  {'Add Facility'}
                </Button>
              }
            </div>
            <div className='title-buttons'>
              {!loggedUserDetails?.roleId &&
                <div className="type-filter">

                  <Radio.Group
                    options={options}
                    {...register('sport_type')}
                    onChange={onSportsChange}
                    value={sport_type ? sport_type : 'all'}
                  />
                </div>}
              <div className="add-export-btn">
                {!matches && modulePermissionsData?.add &&
                  <Button
                    className="pi-btn-primary"
                    key="confirm" type="primary"
                    onClick={() => { setEdit(false); setVisible(true); handleshowRegisteredModal({}, 'add') }}
                  >
                    {'Add Facility'}
                  </Button>
                }
                {modulePermissionsData?.export && getFacility?.length > 0 &&
                  <Excel page={'Facilities'} importdata={getFacility} />
                }
                {matches &&
                  <div className="filter-section-container">
                    <FilterData content={FilterSection} open={open} handleOpenChange={handleOpenChange} />
                  </div>
                }
              </div>

            </div>
          </div>
          <div className="main-content-card">
            {!loggedUserDetails?.roleId && <>
              {!matches &&
                // <FilterSection />
                <div className="filter-form">
                  <div className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"}`}>
                    <div className="input-group">
                      <label htmlFor="event" className="form-lable"> Name</label>
                      <div className="form-group">
                        <input
                          className="form-field"
                          type="text"
                          id="expirydate"
                          placeholder=" Name"
                          {...register('name')}
                        />
                      </div>

                    </div>

                    <div className="input-group">
                      <label htmlFor="event" className="form-lable">Location</label>
                      <div className="form-group">
                        <input
                          className="form-field"
                          type="text"
                          id="expirydate"
                          placeholder="Location "
                          {...register('address')}
                        />
                      </div>
                    </div>
                  </div>

                  {!matches && <div className="filter-buttons-row">
                    <Button className="pi-btn-primary" key="confirm" type="primary"
                      onClick={() => {
                        Search(true, "")
                        handleOpenChange(false);

                      }}
                    >Apply</Button>
                    <Button className="pi-btn-secondary" key="cancel"
                      onClick={() => {
                        reset({
                          name: '',
                          city: '',
                          address: '',
                          sport_type: 'all',
                          pincode: '',
                        });
                        getAllFacility();
                        handleOpenChange(false);

                      }}
                    > Clear</Button>
                  </div>}
                </div>
              }
            </>
            }
            <div>
              {error && (
                <p className="error-page-txt">
                  <ExclamationCircleOutlined /> {error}
                </p>
              )}
              <div style={{ position: "sticky" }}>
                {" "}
                <FacilityDetails
                  visible={showFacilityViewModal}
                  onConfirm={handleConfirmDelete}

                  onCancel={handleCancelDelete}
                  name="Facility Details"
                  row={rowdata}
                />
                <AddFacilityManagement
                  onConfirm={handleConfirmDelete}
                  setvisible={setVisible}
                  visible={visible}
                  editdata={editData}
                  edit={edit}
                  row={rowdata}
                  name="Edit"
                  setEdit={setEdit}
                  setEditData={setEditData}
                  getAllFacility={getAllFacility}
                  setpaymentModal={setpaymentModal}
                />
                {/* <AddFacilityPaymentConfig
                  open={paymentModal}
                  toggle={toggle}
                  getAllData={() => { }}
                  editdata={{}}
                  edit={false}
                  setEdit={() => { }}
                  setEditData={() => { }}
                  facilityList={getFacility}
                  row={rowdata}
                /> */}
                <DeleteConfirmation
                  visible={deleteConfirmationVisible}
                  onConfirm={handleConfirmDelete}
                  onCancel={handleCancelDelete}
                  name="facility"
                />
              </div>
              <Table columns={columns} data={getFacility} />
            </div>
          </div>
        </Card>
      </div >
    </Fragment >
  );
};
export default FacilityManagement;
