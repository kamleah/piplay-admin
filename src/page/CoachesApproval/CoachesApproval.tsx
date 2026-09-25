import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Card, Breadcrumb, Button, Radio, RadioChangeEvent } from "antd";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import languageList from "../../components/Languages/Languages";
import makeAnimated from "react-select/animated";
import Table from "../../components/Table/DataTable";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Icon } from "@iconify-icon/react";
import formatWeekdays from "../../components/Helpers/formatWeekdays";
import { filterApprovalCoach, filterCoach, getAllCoaches, getAllCoachesApproval, getFacilityApi, getFacilityByIdApi } from "../../components/apiFile/Service";
import { useSelector } from "react-redux";
import AddCoachApproval from "../../components/Modal/AddCoachApproval";
import FilterData from "../../components/Modal/FilterData";
import ToastMessage from "../facilator/ToastMessage/ToastMessage";
import { toast } from "react-toastify";



const CoachesApproval = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {
    const { register, watch, setValue, reset, control } = useForm()
    let sport_type = watch("sport_type");
    const [edit, setEdit] = useState(false);
    const [showCoachesModal, setShowCoachesModal] = useState(false);
    const [data, setData] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const [deleteRowId, setDeleteRowId] = useState<string | null>(null);
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [facilityList, setFacilityList] = useState([]);
    const [rowdata, setRowdata] = useState({});
    const animatedComponents = makeAnimated();
    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
    const loggedInUser = localStorage.getItem("auth");
    let facility = watch("facility");
    let language = watch("language");
    let city = watch("city");
    let name = watch("name");
    const options = [
        { label: 'All', value: 'all' },
        { label: 'Padel', value: 'Padel' },
        { label: 'Pickleball', value: 'Pickleball', },
    ];
    const handleshowRegistrationModal = async (row: any, type: any) => {
        setRowdata(row);
        if (type == 'view') {
            setShowViewModal(true);
        } else if (type == 'edit') {
            setEdit(true);
            setShowCoachesModal(true);
        } else {
            setShowViewModal(false);
            setShowCoachesModal(false);
            setEdit(false);
        }
    };
    const onSportsChange = ({ target: { value } }: RadioChangeEvent) => {
        setValue('sport_type', value);
        // filterData(true, value)
    };
    const handleDeleteConfirmation = (id) => {
        setDeleteRowId(id);
        setDeleteConfirmationVisible(true);
    };

    const filterData = async (search, value) => {
        let sport = ''
        if (value == '') {
             sport = sport_type
        } else {
             sport = value
        }
        let response = await filterApprovalCoach(loggedInUser,
             name == undefined ? '' : name,
             !loggedUserDetails?.roleId ? facility == undefined ? '' : facility : loggedUserDetails?.facility_id,
             language == undefined ? '' : language.value,
             city == undefined ? '' : city,          
             sport == undefined || sport == 'all' ? '' : sport,
             
        );
        if (response?.statusCode == 0) {
             setData(response?.result);
        } else {
             setData([]);
        }
   };


    const getAllData = async () => {
        let response
        if (!loggedUserDetails?.roleId) {
            response = await getAllCoachesApproval(loggedInUser);            
            setData(response?.result);
        } else {            
            response = await filterApprovalCoach(loggedInUser, "", loggedUserDetails?.facility_id, '', '', '');
            setData(response?.result?.data);
        }
        
    }

    const onClearFilter = () => {
        getAllData()
        reset({
             name: '',
             language: null,
             exfrom: '',
             exto: '',
             sport_type: '',
        });
   }
    const getAllFacility = async () => {
        let response
        if (!loggedUserDetails?.roleId) {
            response = await getFacilityApi(loggedInUser);
        } else {
            response = await getFacilityByIdApi(loggedInUser, loggedUserDetails?.facility_id);
            response.result = [response.result]
        }
        let venues = response?.result?.map(data => {
            return { "label": data?.name, "sport_type": data?.sport_type, "value": data?._id }
        })
        setFacilityList(venues);
    }
    useEffect(() => {
        getAllData();
        getAllFacility();
    }, [])

    const [open, setOpen] = useState(false);
     const handleOpenChange = (newOpen: boolean) => {
          setOpen(newOpen);
     };

     const copyToClipboard = (e) => {
        const rowDetails = JSON.stringify(e, null, 2);
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
            selector: row => row?._id,
            wrap: true,
            sortable: false,
            cell: row => (<img src={row?.image} className='table-md-img' />)
        },
        {
            name: 'Coach Name',
            selector: row => row?.name,
            // selector: row => console.log('row-----------', row),
            sortable: true,
            wrap: true,
        },
        {
            name: 'Language',
            selector: row => row?.languages?.map((item: any) => item).join(', '),
            sortable: true,
            wrap: true,
        },
        {
            name: 'Timing',
            selector: row => formatWeekdays(row?.days) + ' ' + row?.start_time + ' - ' + row?.end_time,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Phone Number',
            selector: row => row?.mobileno,
            sortable: true,
            wrap: true,
        },

        {
            name: 'Email ID',
            selector: row => row?.email ? row?.email : '----',
            sortable: true,
            wrap: true,


        },
        {
            name: 'Experience',
            selector: row => row?.experience,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Sports Type',
            selector: row => typeof row?.sport_type == 'string' ? row?.sport_type : row?.sport_type?.map((item: any) => item).join(' & '),
            sortable: true,
        },
        {
            name: 'Status',
            selector: row =>  "Disapproved",
            sortable: true,
        },
        {
            name: 'Actions',
            selector: row => row?.year,
            sortable: true,
            wrap: true,
            cell: row =>
                <div className='action-button-container'>
                    {modulePermissionsData?.view &&
                        <button className='action-button view-button' onClick={(e) => { e.preventDefault(); handleshowRegistrationModal(row, 'view') }} ><Icon icon="raphael:view" /></button>
                    }
                    {modulePermissionsData?.edit &&
                        <button className='action-button edit-button' onClick={(e) => { e.preventDefault(); handleshowRegistrationModal(row, 'edit') }}><Icon icon="mdi:pencil-outline" /></button>
                    }
                    {modulePermissionsData?.delete &&
                        <button onClick={(e) => { e.preventDefault(); handleDeleteConfirmation(row._id) }} className='action-button delete-button'>
                            <RiDeleteBin5Fill title="Delete" />
                        </button>
                    }
                     {modulePermissionsData?.delete &&
                        <button className='action-button delete-button'>
                             <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} onClick={(e)=>{e.preventDefault(); copyToClipboard(row)}}/>
                        </button>
                    }
                </div >

            ,
        },
    ];
    const handleCancel = () => {
        setShowCoachesModal(false);
        setShowViewModal(false);
        setShowCoachesModal(false);
        setEdit(false);
    };
    const FilterSection = () => {
        return (
             <>
                  <div className="filter-form">
                       <div className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"}`}>
                            <div className="input-group">
                                 <label htmlFor="name" className="form-lable">Coach name</label>
                                 <div className="form-group">
                                      <input
                                           className="form-field"
                                           type="text"
                                           id="name"
                                           placeholder="Enter Coach Name"
                                           {...register('name')}
                                      />
                                 </div>
                            </div>
                            <div className="input-group">
                                 <label htmlFor="language" className="form-lable">Languages</label>
                                 <div className="form-group">
                                      <Controller
                                           name="language"
                                           control={control}
                                           render={({ field }) => (
                                                <Select
                                                     className="controller-select"
                                                     components={animatedComponents}
                                                     options={languageList}
                                                     {...field}
                                                />
                                           )}
                                      />
                                 </div>
                            </div>

                       </div>
                       {!matches && <div className="filter-buttons-row">
                            <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => {
                                 filterData(true, "")
                                 handleOpenChange(false);

                            }}>Apply</Button>
                            <Button
                                 className="pi-btn-secondary"
                                 key="cancel"
                                 onClick={() => {
                                      onClearFilter()
                                      handleOpenChange(false);

                                 }}
                            >
                                 Clear
                            </Button>

                       </div>}
                  </div>
                  {matches && <div className="filter-buttons-row">
                       <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => {
                            filterData(true, "")
                            handleOpenChange(false);

                       }}>Apply</Button>
                       <Button
                            className="pi-btn-secondary"
                            key="cancel"
                            onClick={() => {
                                 onClearFilter()
                                 handleOpenChange(false);

                            }}
                       >
                            Clear
                       </Button>

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
                                title: "Coaches Approval",
                            }
                        ]}
                    />}
                    <form className="">
                        <div className="main-title-container">
                            <div className="title-add-mobile">
                                <h5 className="main-content-title">Coaches Approval</h5>
                            </div>
                            <div className='title-buttons'>
                                <div>

                                    <Radio.Group
                                        options={options}
                                        {...register('sport_type')}
                                        onChange={onSportsChange}
                                        value={sport_type ? sport_type : 'all'}
                                    />
                                </div>
                                {matches &&
                                    <div className="filter-section-container">
                                        <FilterData content={FilterSection} open={open} handleOpenChange={handleOpenChange} />
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="main-content-card">
                            {!matches &&
                                // <FilterSection />
                                <div className="filter-form">
                                    <div className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"}`}>
                                        <div className="input-group">
                                            <label htmlFor="name" className="form-lable">Coach name</label>
                                            <div className="form-group">
                                                <input
                                                    className="form-field"
                                                    type="text"
                                                    id="name"
                                                    placeholder="Enter Coach Name"
                                                    {...register('name')}
                                                />
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="language" className="form-lable">Languages</label>
                                            <div className="form-group">
                                                <Controller
                                                    name="language"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            className="controller-select"
                                                            components={animatedComponents}
                                                            options={languageList}
                                                            {...field}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                    {!matches && <div className="filter-buttons-row">
                                        <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => {
                                               filterData(true, "")
                                               handleOpenChange(false);

                                        }}>Apply</Button>
                                        <Button
                                            className="pi-btn-secondary"
                                            key="cancel"
                                            onClick={() => {
                                                onClearFilter()
                                                handleOpenChange(false);

                                            }}
                                        >
                                            Clear
                                        </Button>

                                    </div>}
                                </div>
                            }


                            <div style={{ position: "sticky" }}>
                                {" "}
                            </div>
                            <Table
                                columns={columns}
                                data={data}
                            />
                        </div>
                    </form>
                </Card>
                <AddCoachApproval
                    visible={showCoachesModal}
                    // onConfirm={onConfirm}
                    onCancel={handleCancel}
                    row={rowdata}
                    edit={edit}
                    facilityList={facilityList}
                    setEdit={setEdit}
                    setRow={setRowdata}
                    getAllData={getAllData}
                />
            </div >

        </Fragment >
    )
}
export default CoachesApproval;