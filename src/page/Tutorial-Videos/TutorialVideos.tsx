import React, { Fragment, useEffect, useState } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { Card, Breadcrumb, Button, Radio, RadioChangeEvent } from "antd";
import AddTutorial from '../../components/Modal/AddTutorial';
import Table from '../../components/Table/DataTable';
import moment from 'moment';
import { Icon } from "@iconify-icon/react";
import { RiDeleteBin5Fill } from 'react-icons/ri';
import _ from "lodash";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import DeleteConfirmation from '../../components/Modal/DeleteConfirmation';
import VideoTutorialDetails from '../../components/Modal/VideoTutorialDetails';
import { getAllTutorials } from '../../components/apiFile/Constants';
import { deleteTutorial, filterTutorial, getTutorial } from '../../components/apiFile/Service';
import { toast } from "react-toastify";
import ToastMessage from '../facilator/ToastMessage/ToastMessage';
import FilterData from '../../components/Modal/FilterData';


const TutorialVideos = ({   matches, menuOpen, onToggle, modulePermissionsData }) => {
    const moduleName = "Tutorial videos"

    const { register, watch, setValue, reset, control } = useForm()
    const [showFormModal, setShowFormModal] = useState(false);
    const [edit, setEdit] = useState(false);
    const [data, setData] = useState([]);
    const [categories, setCategory] = useState([]);
    const animatedComponents = makeAnimated();
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [rowdata, setRowdata] = useState({});
    const loggedInUser = localStorage.getItem("auth");
    const [deleteRowId, setDeleteRowId] = useState<string | null>(null);
    const categoryOptions = [
        { label: 'Technique', value: 'Technique' },
        { label: 'Training', value: 'Training' }
    ]
    let title = watch("title");
    let sport_type = watch("sport_type");
    let category = watch("category");

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
            name: 'Thumbnail',
            selector: row => row?._id,
            wrap: true,
            sortable: false,
            cell: row => (<img src={row?.thumbnail_image} className='table-lg-img' />)
        },
        {
            name: 'Youtube URL Id',
            selector: row => row?.youtube_url,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Title',
            selector: row => row?.title,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Category',
            selector: row => row?.category,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Sport Type',
            selector: row => row?.sport_type,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Date',
            selector: row => moment(row?.createdAt).format('ddd, D MMM YY '),
            sortable: true,
            wrap: true,
        },
        {
            name: 'Action',
            selector: row => row,
            sortable: true,
            wrap: true,
            cell: row =>
                <div className='action-button-container'>
                    {modulePermissionsData?.view &&
                        <button className='action-button view-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'view') }} ><Icon icon="raphael:view" /></button>
                    }
                    {modulePermissionsData?.edit &&
                        <button className='action-button edit-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'edit') }}><Icon icon="mdi:pencil-outline" /></button>
                    }
                    {modulePermissionsData?.delete &&
                        <button onClick={(e) => { e.preventDefault(); handleDeleteModal(row._id) }} className='action-button delete-button'>
                            <RiDeleteBin5Fill title="Delete" />
                        </button>
                    }
                     {modulePermissionsData?.delete &&
                        <button onClick={(e) => { e.preventDefault(); copyToClipboard(row) }} className='action-button delete-button'>
                           <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} />
                        </button>
                    }
                </div >

            ,
        },

    ];
    const getAllData = async () => {
        let response = await getTutorial(loggedInUser);
        let uniqueCategories = response.result.reduce((unique, item) => {
            if (!unique.some(data => data.category === item.category)) {
                unique.push(item.category);
            }
            return unique;
        }, []);
        uniqueCategories = new Set(uniqueCategories)
        uniqueCategories = [...uniqueCategories]
        setCategory(uniqueCategories.map(data => { return ({ 'label': data, value: data }) }))
        setData(response?.result);
    }

    const onSportsChange = ({ target: { value } }: RadioChangeEvent) => {
        setValue('sport_type', value);
        filterData(true, value)
    };


    useEffect(() => {
        getAllData();
    }, [])
    // delete popup 
    const handleCancelDelete = () => {
        setDeleteConfirmationVisible(false);
        setDeleteRowId("");
    };

    const handleDeleteModal = (Id) => {
        setDeleteRowId(Id);
        setDeleteConfirmationVisible(true);
    }
    const handleConfirmDelete = async () => {
        if (deleteRowId) {
            await DeleteFunction(deleteRowId);
            setDeleteConfirmationVisible(false);
            setDeleteRowId("");
        }
    };
    const DeleteFunction = async (id) => {
        // Actual delete logic here
        let response = await deleteTutorial(loggedInUser, id);
        if (response.statusCode == 0) {
            toast(<ToastMessage body={`Tutorial Deleted Successfully`} type="success" />, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            getAllData();
        } else {
            toast(<ToastMessage body={`Failed To Delete the Tutorial`} type="warning" />, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };
    const handleShowModal = async (row: any, type: any) => {
        setRowdata(row);
        if (type == 'view') {
            setShowViewModal(true);
        } else if (type == 'edit') {
            setEdit(true);
            setShowFormModal(true);
        } else {
            setShowViewModal(false);
            setShowFormModal(false);
            setEdit(false);
        }
    }

    const handleCancel = () => {
        setShowFormModal(false);
        setShowViewModal(false);
        setShowFormModal(false);
        setEdit(false);
    };


    const filterData = async (search, value) => {

        console.log('filter funtion ==========')
        let sport = ''
        if (value == '') {
            sport = sport_type
        } else {
            sport = value
        }
        let response = await filterTutorial(loggedInUser,
            title == undefined ? '' : title,
            category == undefined ? '' : category?.value,
            sport_type == undefined || sport == 'all' ? '' : sport
        );
        if (response?.statusCode == 0) {
            setData(response?.result);
        } else {
            setData([]);
        }
    };

    const onClearFilter = () => {
        getAllData();
        reset({
            title: '',
            category: null,
            sport_type: '',
        });
    }

    const options = [
        { label: 'All', value: 'all' },
        { label: 'Padel', value: 'Padel' },
        { label: 'Pickleball', value: 'pickleball', },
    ];


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
                            <label htmlFor="name" className="form-lable">Court Name</label>
                            <div className="form-group">
                                <input
                                    className="form-field"
                                    type="text"
                                    id="name"
                                    placeholder="Enter title"
                                    {...register('title')}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <label htmlFor="facility_id" className="form-lable">Facility</label>
                            <div className="form-group">
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            // closeMenuOnSelect={false}
                                            className="controller-select"
                                            components={animatedComponents}
                                            defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                                            // isMulti
                                            options={categories}
                                            placeholder="Select a category"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                        </div>


                    </div>
                    {!matches && <div className="filter-buttons-row">
                        <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => {
                            filterData(true, "");
                            handleOpenChange(false);
                        }}>Apply</Button>
                        <Button
                            className="pi-btn-secondary"
                            key="cancel"
                            onClick={() => {
                                onClearFilter();
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
                            onClearFilter();
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
                                title: "Tutorials Videos",
                            }
                        ]}
                    />}
                    <form className="">
                        <div className="main-title-container">
                            <div className="title-add-mobile">
                                <h5 className="main-content-title">Tutorials Videos</h5>
                                {matches && modulePermissionsData?.add &&
                                    <Button
                                        className="pi-btn-primary"
                                        key="confirm" type="primary"
                                        onClick={() => { setShowFormModal(true) }}
                                    >
                                        Add Tutorial
                                    </Button>
                                }
                            </div>
                            <div className='title-buttons'>
                                <div>

                                    <Radio.Group
                                        options={options}
                                        {...register('sport_ttype')}
                                        onChange={onSportsChange}
                                        value={sport_type ? sport_type : 'all'}
                                    />
                                </div>
                                {!matches && modulePermissionsData?.add &&
                                    <Button
                                        className="pi-btn-primary"
                                        key="confirm" type="primary"
                                        onClick={() => { setShowFormModal(true) }}
                                    >
                                        Add Tutorial
                                    </Button>
                                }

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
                                            <label htmlFor="title" className="form-lable">Title</label>
                                            <div className="form-group">
                                                <input
                                                    className="form-field"
                                                    type="text"
                                                    id="title"
                                                    placeholder="Enter video title"
                                                    {...register('title')}
                                                />
                                            </div>
                                        </div>

                                        <div className="input-group">
                                            <label htmlFor="facility" className="form-lable">Category</label>
                                            <div className="form-group">
                                                <Controller
                                                    name="category"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            // closeMenuOnSelect={false}
                                                            className="controller-select"
                                                            components={animatedComponents}
                                                            defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                                                            // isMulti
                                                            options={categories}
                                                            placeholder="Select a category"
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
                                                onClearFilter();
                                                handleOpenChange(false);

                                            }}
                                        >
                                            Clear
                                        </Button>

                                    </div>}
                                </div>
                            }

                            <Table
                                columns={columns}
                                data={data}
                            />
                        </div>
                    </form>
                </Card>
                <VideoTutorialDetails
                    visible={showViewModal}
                    onCancel={handleCancel}
                    name="Program Details"
                    row={rowdata} />
                <AddTutorial
                    visible={showFormModal}
                    onCancel={handleCancel}
                    edit={edit}
                    row={rowdata}
                    setEdit={setEdit}
                    setRow={setRowdata}
                    getAllData={getAllData}
                />
                <DeleteConfirmation
                    visible={deleteConfirmationVisible}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    name="video"
                />

            </div >

        </Fragment >
    )

};

export default TutorialVideos;
