import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Card, Breadcrumb, Button, Radio, RadioChangeEvent } from "antd";
import { CouponFilterAPI, deleteCouponAPI, getAllCouponsAPI, getFacilityApi, getFacilityByIdApi } from "../../../components/apiFile/Service";
import ToastMessage from "../ToastMessage/ToastMessage";
import { toast } from "react-toastify";
import moment from "moment";
import "../Coupons/Coupons.css"
import _ from "lodash";
import { useForm } from "react-hook-form";
import DeleteConfirmation from "../../../components/Modal/DeleteConfirmation";
import { Icon } from "@iconify-icon/react";
import { RiDeleteBin5Fill } from "react-icons/ri";

import StatusLabel from "../../../components/Labels/StatusLabel";
import Table from "../../../components/Table/DataTable";
import CopyToClipboard from "../../../components/CopyToClipboard/CopyToClipboard";
import Excel from "../../../components/Helpers/Excel";
import { useSelector } from "react-redux";
import AddCoupon from "../../../components/Modal/AddCoupon";
import FilterData from "../../../components/Modal/FilterData";

const Coupons = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {

    const [data, setData] = useState([])
    const [AddCouponState, setAddCouponState] = useState(false)
    const [edit, setEdit] = useState(false)
    const [ediData, setEditData] = useState({})
    const [facilitydata, setFacilities] = useState([])
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [couponToDeleteId, setCouponToDeleteId] = useState<string | null>(null);
    const [selectedGameType, setSelectedGameType] = useState('all');
    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)

    const { register, handleSubmit, reset, watch, setValue } = useForm()

    var coupon_name = watch('coupon_name')
    var coupon_type = watch('coupon_type')
    var Sport = watch('sport_type')

    const loggedInUser = localStorage.getItem("auth");

    const columns = [
        {
            name: "Coupon Name",
            selector: row => row?.coupon_name,
            wrap: true,
            sortable: true,
            cell: row => (

                <div className="couponNameContainer">
                    <p>{row?.coupon_name}</p>
                    <CopyToClipboard textToCopy={row?.coupon_name} />
                </div>
            ),
        },
        {
            name: "Percentage of Discount",
            selector: row => `${row.percentage} ${!row?.is_fixed ? "%":''}`,
            wrap: true,
            sortable: true,
        },
        {
            name: "Sport Type",
            selector: row => row?.sport_type ? row?.sport_type : "All",
            wrap: true,
            sortable: true,
        },
        // {
        //     name: "Facility",
        //     selector: row => row?.sport_type,
        //     wrap: true,
        //     sortable: true,
        // },
        // {
        //     name: "No of Usage",
        //     selector: row => row?.sport_type,
        //     wrap: true,
        //     sortable: true,
        // },
        // {
        //     name: "Active Date",
        //     selector: row => moment(row.active_date).format('DD-MM-YYYY'),
        //     wrap: true,
        //     sortable: true,
        // },
        {
            name: "Expiry Date",
            selector: row => row.expiry_date,
            wrap: true,
            sortable: true,
        },
        {
            name: "Applicable For",
            selector: row => row?.coupon_type ? row.coupon_type : "",
            wrap: true,
            sortable: true,
        },
        {
            name: "Coupon Status",
            selector: row => row?.expiry_date,
            wrap: true,
            sortable: true,
            cell: row =>
                <div className='playerContainer'>
                    <StatusLabel
                        status={
                            row.expiry_date < moment().format('YYYY-MM-DD') ? 'Expired' : 'Active'
                        }
                    />
                </div>
            ,
        },



        {
            name: "Action",
            selector: row => row.action,
            wrap: true,
            cell: row => (
                <div className='action-button-container'>
                    {modulePermissionsData?.edit &&
                        <button className='action-button edit-button' onClick={(e) => { e.preventDefault(); setAddCouponState(true); setEdit(!edit); setEditData(row) }}>
                            <Icon icon="mdi:pencil-outline" />
                        </button>
                    }
                    &nbsp;&nbsp;{" "}
                    {modulePermissionsData?.delete &&
                        <button onClick={(e) => { e.preventDefault(); handleDeleteConfirmation(row._id) }} className='action-button delete-button'>
                            <RiDeleteBin5Fill title="Delete" />
                        </button>
                    }
                </div>)
            ,

        },
    ];
    // delete popup 
    const handleDeleteConfirmation = (id) => {
        setCouponToDeleteId(id);
        setDeleteConfirmationVisible(true);
    };

    const handleConfirmDelete = async () => {
        if (couponToDeleteId) {
            await DeleteFunction(couponToDeleteId);
            setDeleteConfirmationVisible(false);
            setCouponToDeleteId("");

        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmationVisible(false);
        setCouponToDeleteId("");
    };

    const options = [
        { label: 'All', value: 'all' },
        { label: 'Padel', value: 'Padel' },
        { label: 'Pickleball', value: 'Pickleball', },
    ];

    const DeleteFunction = async (id) => {
        // Actual delete logic here
        let response = await deleteCouponAPI(loggedInUser, id);
        if (response.statusCode == 0) {
            toast(<ToastMessage body={'Coupon Deleted Successfully'} type="success" />, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            getCoupons();
        } else {
            toast(<ToastMessage body={'Failed To Delete the Coupon'} type="success" />, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    // reset code 
    const getCoupons = async () => {
        let response = await getAllCouponsAPI(loggedInUser);
        if (!loggedUserDetails?.roleId) {
            setData(response?.result)
        } else {
            setData(response?.result.filter(item => { return (item?.facility_id == loggedUserDetails?.facility_id || item?.facility_id == undefined) }))
        }
    }

    const getFacilities = async () => {
        let response
        if (!loggedUserDetails?.roleId) {
            response = await getFacilityApi(loggedInUser);
        } else {
            response = await getFacilityByIdApi(loggedInUser, loggedUserDetails?.facility_id);
            response.result = [response.result]
            response.result[0]._id = response.result[0].id
        }
        let facilities = response?.result?.map(data => {
            return { "label": data?.name, "value": data._id }
        })
        setFacilities(facilities);
    }

    const Search = async (search) => {
        if (search == false) {
            setData([]);
            toast(<ToastMessage body={"Filters Cleared"} type="success" />, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return
        }
        let response = await CouponFilterAPI(loggedInUser,
            coupon_name == undefined ? '' : coupon_name,
            coupon_type == undefined ? "" : coupon_type,
            Sport == undefined ? "" : Sport == "all" ? "" : Sport,
        );
        if (typeof response.result == 'string') {
            setData([]);
            return
        }
        if (response?.result?.length != 0) {
            if (!loggedUserDetails?.roleId) {
                setData(response?.result)
            } else {
                setData(response?.result.filter(item => { return (item?.facility_id == loggedUserDetails?.facility_id || item?.facility_id == undefined) }))
            }
        } else {
            setData([]);
            if (search == true) {
                toast(<ToastMessage body={"No Data Found"} type="error" />, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        }
    };

    const onSportsChange = ({ target: { value } }: RadioChangeEvent) => {
        setValue('sport_type', value);
    };

    useMemo(() => {
        if (Sport != undefined || Sport == selectedGameType) {
            setSelectedGameType(Sport);
            Search(true);
        }
    }, [Sport])


    useEffect(() => {
        getCoupons();
        getFacilities();
    }, [])

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
                            <label htmlFor="event" className="form-lable">Coupon Name</label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="expirydate"
                                    placeholder="Coupon Name"
                                    {...register('coupon_name')}
                                />
                            </div>

                        </div>
                        <div className="input-group">
                            <label htmlFor="event" className="form-lable">Coupon Type</label>
                            <div className="form-group">
                                <select
                                    id="location"
                                    className="form-field"
                                    {...register('coupon_type')}
                                >
                                    <option value="" selected disabled>Select Coupon Type</option>
                                    <option value="Booking">Booking</option>
                                    <option value="Events">Events</option>
                                    <option value="Both">Both</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {!matches && <div className="filter-buttons-row">
                        <Button className="pi-btn-primary" key="confirm" type="primary"
                            onClick={() => {
                                Search(true)
                                handleOpenChange(false);

                            }}
                        >Apply</Button>
                        <Button className="pi-btn-secondary" key="cancel"
                            onClick={() => {
                                reset({
                                    coupon_name: '',
                                    coupon_type: '',
                                    sport_type: 'all',
                                });
                                getCoupons();
                                handleOpenChange(false);

                            }}
                        > Clear</Button>
                    </div>}
                </div>
                {matches && <div className="filter-buttons-row">
                    <Button className="pi-btn-primary" key="confirm" type="primary"
                        onClick={() => {
                            Search(true)
                            handleOpenChange(false);

                        }}
                    >Apply</Button>
                    <Button className="pi-btn-secondary" key="cancel"
                        onClick={() => {
                            reset({
                                coupon_name: '',
                                coupon_type: '',
                                sport_type: 'all',
                            });
                            getCoupons();
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
                                title: "Coupons",
                            },
                        ]}
                    />}
                    <form>
                        <div className="main-title-container">
                            <div className="title-add-mobile">
                                <h5 className="main-content-title">Coupons</h5>
                                {matches && modulePermissionsData?.add &&
                                    <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => setAddCouponState(!AddCouponState)}>Create Coupon</Button>
                                }
                            </div>
                            <div className='title-buttons'>
                                <div>

                                    <Radio.Group
                                        options={options}
                                        {...register('sport_type')}
                                        onChange={onSportsChange}
                                        value={Sport ? Sport : 'all'}
                                    />
                                </div>
                                {!matches && modulePermissionsData?.add &&
                                    <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => setAddCouponState(!AddCouponState)}>Create Coupon</Button>
                                }
                                {/* <Excel page={'RegisteredEvents'} importdata={filterData?.length != 0 ? filterData : data} /> */}
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
                                            <label htmlFor="event" className="form-lable">Coupon Name</label>
                                            <div className="form-group">
                                                <input
                                                    className="form-field"
                                                    type="text"
                                                    id="expirydate"
                                                    placeholder="Coupon Name"
                                                    {...register('coupon_name')}
                                                />
                                            </div>

                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="event" className="form-lable">Coupon Type</label>
                                            <div className="form-group">
                                                <select
                                                    id="location"
                                                    className="form-field"
                                                    {...register('coupon_type')}
                                                >
                                                    <option value="" selected disabled>Select Coupon Type</option>
                                                    <option value="Booking">Booking</option>
                                                    <option value="Events">Events</option>
                                                    <option value="Both">Both</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {!matches && <div className="filter-buttons-row">
                                        <Button className="pi-btn-primary" key="confirm" type="primary"
                                            onClick={() => {
                                                Search(true)
                                                handleOpenChange(false);

                                            }}
                                        >Apply</Button>
                                        <Button className="pi-btn-secondary" key="cancel"
                                            onClick={() => {
                                                reset({
                                                    coupon_name: '',
                                                    coupon_type: '',
                                                    sport_type: 'all',
                                                });
                                                getCoupons();
                                                handleOpenChange(false);

                                            }}
                                        > Clear</Button>
                                    </div>}
                                </div>
                            }


                            <Table columns={columns} data={data} />
                            <AddCoupon
                                open={AddCouponState}
                                toggle={setAddCouponState}
                                facilitydata={facilitydata}
                                getItems={getCoupons}
                                editdata={ediData}
                                edit={edit}
                                setEdit={setEdit}
                                setEditData={setEditData}
                                data={data}
                            />
                            <DeleteConfirmation
                                visible={deleteConfirmationVisible}
                                onConfirm={handleConfirmDelete}
                                onCancel={handleCancelDelete}
                                name="Coupon"
                            />
                        </div>
                    </form>
                </Card>
            </div >
        </Fragment >
    );
};
export default Coupons;
