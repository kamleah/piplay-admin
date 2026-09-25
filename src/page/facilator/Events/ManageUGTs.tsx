import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Card, Breadcrumb, Button, Radio, RadioChangeEvent, Switch, Tooltip, Menu } from "antd";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { CouponFilterAPI, TournamentAdminFilterAPI, TournamentFilterAPI, deactivateTournaments, deleteEventAPI, getAllEventVenuesAPI, getAllOrganizersAPI, getAllRatingSkillLevelsAPI, getAllSkillLevelsAPI, getAllTournamentsAPI, getAllUGTs, getAllUsers, getEventVenuesUsersAPI, getEventsByVenuesAPI, getFacilityApi, getFacilityByIdApi } from "../../../components/apiFile/Service";
import {
  CopyOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined
} from "@ant-design/icons";
import AddTournament from "../../../components/Modal/AddTournament";
import ToastMessage from "../ToastMessage/ToastMessage";
import { toast } from "react-toastify";
import moment from "moment";
import DeleteConfirmation from "../../../components/Modal/DeleteConfirmation";
import Table from "../../../components/Table/DataTable";
import { Icon } from "@iconify-icon/react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Excel from "../../../components/Helpers/Excel";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import AddTournamentV2 from "../../../components/Modal/AddTournamentV2";
import FilterData from "../../../components/Modal/FilterData";
import { filter } from "lodash";
import TournamentDetails from "../../../components/Modal/TournamentDetails";
import { customStyles } from "../../../components/css/customStyles";
import AddTournamentV3 from "../../../components/Modal/AddTournamentV3";
import Dropdown from "antd/es/dropdown/dropdown";

type Tournament = {
  _id: string;
  tournament_name: string;
  image_url?: string;
  tournament_type: string;
  venue?: {
    location_city: string;
    location_state: string;
  };
  total: number;
  registered_players: number;
  total_number_of_registration: number;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
};



const ManageUGTs = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {
  const [data, setData] = useState<Tournament[]>([]);
  const [AddTournamentModal, setAddTournamentModal] = useState(false)
  const [AddTournamentModalV2, setAddTournamentModalV2] = useState(false)
  const [AddTournamentModalV3, setAddTournamentModalV3] = useState(false)
  const [edit, setEdit] = useState(false)
  const [Facilities, setGetFacility] = useState()
  const [Organizers, setGetOrganizers] = useState()
  const [venue, setVenue] = useState()
  const [SkillLevels, setSkillLevels] = useState([])
  const [ediData, setEditData] = useState({})
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [couponToDeleteId, setCouponToDeleteId] = useState<string | null>(null);
  const [copy, setCopy] = useState(false)
  // const [filteredData, setFilteredData] = useState<Tournament[]>([]);
  const animatedComponents = makeAnimated();
  const [rowdata, setRowdata] = useState<any | {}>({});
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userList, setUserList] = useState<any[]>([]);
  const loggedInUser = localStorage.getItem("auth");
  const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
  const { register, control, watch, setValue, reset } = useForm()
  let sport_type = watch("sport_type");
  let tournamentType = watch("tournament_type");

  const eventOptions = [
    { label: 'V1-Single Category', value: 'V1', tooltip: 'Suitable for defining social event, corporate socials, open play socials, single occurrence event & single category tournament.', disabled: false },
    { label: 'V2-Multiple Category', value: 'V2', tooltip: 'Suitable for defining multiple category tournament, destination events with multiple category tournaments.', disabled: false },
    { label: 'V3-UGT', value: 'V3', tooltip: 'Suitable for defining highly competitive tournaments with scheduling, leagues eg. (Tuesday night leagues, knockout, round robin, groups + knockouts) .', disabled: true },
  ];

  const onChangeStatus = async (id, status) => {
    const resp = await deactivateTournaments(loggedInUser, id);
    if (resp.statusCode === 0) {
      toast(<ToastMessage body={status ? 'Event deactivated successfully' : 'Event activated successfully'} type={'success'} />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      getAllData();
    }
  };

  const handleshowModal = async (row: any, type: any) => {
    setRowdata(row);
    if (type == 'view') {
      setShowViewModal(true);
    } else if (type == 'edit') {
      setShowAddModal(true);
    } else {
      setShowViewModal(false);
      setShowAddModal(false);
    }
  };

  const getAllUsersList = async () => {
    let response = await getAllUsers(loggedInUser);
    let venues = response?.data?.map((data) => {
      return {
        label: `${data.firstname} ${data.lastname}`,
        mobileno: data?.mobileno,
        value: data?._id,
        userData: data
      };
    });
    setUserList(venues);
  };

  const columns = [
    {
      name: "Image",
      selector: row => row?.image,
      wrap: true,
      sortable: true,
      cell: row => (<img src={row?.V1 ? row?.image_url : row?.tournament_banner_img} className='table-lg-img-square' />),
    },

    {
      name: "Name",
      selector: row => row?.tournament_name,
      wrap: true,
      sortable: true,

    },
    {
      name: "Event Type",
      selector: row => row?.V3 ? 'V3' : row?.tournament_category_ids?.length > 0 ? 'V2' : 'V1',
      wrap: true,
      sortable: true,

    },

    {
      name: 'Popup Venue',
      selector: row => row?.V1 ? `${row?.venue?.location_city} ${row?.venue?.location_state}` : row?.popup_venue_details?.name || 'N/A',
      wrap: true,
      sortable: true,
    },
    {
      name: 'Venue Address',
      selector: row => row?.V1 ? `${row?.venue?.location_city} ${row?.venue?.location_state}` : row?.popup_venue_details?.address || 'N/A',
      wrap: true,
      sortable: true,
    },
    {
      name: 'Date',
      selector: row => `${moment(row?.start_date).format('DD/MMM/YY')} - ${moment(row?.end_date).format('DD/MMM/YY')}`,
      wrap: true,
      sortable: true,
    },
    // {
    //   name: 'Price',
    //   selector: row => row?.V1 ? row?.total : 'N/A',
    //   wrap: true,
    //   sortable: true,
    // },
    // {
    //   name: 'Registered',
    //   selector: row => row?.V1 ? `${row?.registered_players}/${row?.total_number_of_registration}` : 'N/A',
    //   wrap: true,
    //   sortable: true,
    // },
    {
      name: 'Time',
      selector: row => row?.V1 ? `${row?.start_time} - ${row?.end_time}` : `${moment(row?.start_date).format('HH:mm')} - ${moment(row?.end_date).format('HH:mm')}`,
      wrap: true,
      sortable: true,
    },
    {
      name: 'Tags',
      selector: row => row?.V1 ? (row?.tournament_tag || 'N/A') : row?.tag || 'N/A',
      wrap: true,
      sortable: true,
    },
    {
      name: 'Tournament Mode',
      selector: row => row?.V1 ? (row?.tournament_mode || 'N/A') : row?.tournament_mode || 'N/A',
      wrap: true,
      sortable: true,
    },
    {
      name: 'Tournament Formate',
      selector: row => row?.V1 ? (row?.tournament_formate || 'N/A') : row?.tournament_formate || 'N/A',
      wrap: true,
      sortable: true,
    },
    {
      name: 'Position',
      selector: row => row?.position || 'N/A',
      wrap: true,
      sortable: true,
    },
    {
      name: 'Sport Type',
      selector: row => row?.V1 ? (row?.tournament_type.includes('[') ? JSON.parse(row?.tournament_type).map((item: any) => item.label).join(", ") : row?.tournament_type) : row?.sport_name,
      wrap: true,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      wrap: true,
      sortable: true,
      cell: row =>
        <div >
          <Switch onChange={(e) => { onChangeStatus(row._id, row.status) }} checked={row.status} />
        </div>
    },
    {
      name: 'Actions',
      selector: row => row.year,
      sortable: true,
      wrap: true,
      cell: row =>
        <>
          <Dropdown
            overlay={
              <Menu>
                {modulePermissionsData?.view && (
                  <Menu.Item key="view">
                    <Tooltip title="View" placement="left">
                      <button
                        className="action-button view-button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleshowModal(row, 'view');
                        }}
                      >
                        <Icon icon="raphael:view" />
                      </button>
                    </Tooltip>
                  </Menu.Item>
                )}
                {modulePermissionsData?.edit && (
                  <Menu.Item key="edit">
                    <Tooltip title="Edit" placement="left">
                      {row?.V1 ?
                        <button className='action-button edit-button' onClick={() => { setEdit(true); setEditData(row); setAddTournamentModalV2(true) }}>
                          <Icon icon="ic:sharp-mode-edit-outline" />
                        </button> :
                        <button className='action-button edit-button' onClick={() => { setEdit(true); setEditData(row); setAddTournamentModalV3(true) }} disabled >
                          <Icon icon="ic:sharp-mode-edit-outline" />
                        </button>}
                    </Tooltip>
                  </Menu.Item>
                )}
                {modulePermissionsData?.delete && (
                  <Menu.Item key="copy">
                    <button onClick={() => { handleDeleteConfirmation(row._id) }} className='action-button delete-button'>
                      <RiDeleteBin5Fill title="Delete" />
                    </button>
                  </Menu.Item>
                )}
                {modulePermissionsData?.add && (
                  <Menu.Item key="unregister">
                    <button className='action-button view-button' onClick={() => { setEdit(true); setCopy(true); setEditData(row); setAddTournamentModalV2(true) }}>
                      <Icon icon="ant-design:copy-filled" />
                    </button>
                  </Menu.Item>
                )}
              </Menu>
            }
            trigger={['click']}
          >
            <Button className="action-button delete-button">
              <Tooltip title="More actions" placement="left">
                <Icon icon="mdi:dots-vertical" />
              </Tooltip>
            </Button>
          </Dropdown>

          {/* <div className='action-button-container'>
            {modulePermissionsData?.edit &&
              <>
                <Tooltip title="View" placement="left">
                  <button
                    className="action-button view-button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleshowModal(row, 'view');
                    }}
                  >
                    <Icon icon="raphael:view" />
                  </button>
                </Tooltip>
                <Tooltip title="Edit" placement="left">
                  {row?.V1 ?
                    <button className='action-button edit-button' onClick={() => { setEdit(true); setEditData(row); setAddTournamentModalV2(true) }}>
                      <Icon icon="ic:sharp-mode-edit-outline" />
                    </button> :
                    <button className='action-button edit-button' onClick={() => { setEdit(true); setEditData(row); setAddTournamentModalV3(true) }} disabled >
                      <Icon icon="ic:sharp-mode-edit-outline" />
                    </button>}
                </Tooltip>
              </>
            }
            &nbsp;&nbsp;{" "}
            {modulePermissionsData?.delete &&
              <button onClick={() => { handleDeleteConfirmation(row._id) }} className='action-button delete-button'>
                <RiDeleteBin5Fill title="Delete" />
              </button>}
            &nbsp;&nbsp;{" "}
            {modulePermissionsData?.add &&
              <button className='action-button view-button' onClick={() => { setEdit(true); setCopy(true); setEditData(row); setAddTournamentModalV2(true) }}>
                <Icon icon="ant-design:copy-filled" />
              </button>
            }
          </div> */}
        </>

      ,
    },
  ];

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
    setShowViewModal(false);
    setShowAddModal(false);
  };

  const DeleteFunction = async (id) => {
    let response = await deleteEventAPI(loggedInUser, id)
    if (response.statusCode == 0) {
      toast(<ToastMessage body={"Event Deleted Successfully"} type="success" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      getAllData();
    } else {
      toast(<ToastMessage body={"Failed To Delete the Event"} type="success" />, {
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
      let venues = response?.result?.map(data => {
        return { "label": data?.name + ', ' + data.address, "value": data?._id, "slot_size": data?.slot_size, 'sport_type': data?.sport_type }
      });
      setGetFacility(venues);
    } else {
      const filteredFacilities = response?.result.filter(item => loggedUserDetails?.facilities?.includes(item._id));
      let venues = filteredFacilities?.map(data => {
        return { "label": data?.name + ', ' + data.address, "value": data?._id, "slot_size": data?.slot_size, 'sport_type': data?.sport_type }
      });
      setGetFacility(venues);
    }
  };

  const getSkillLevels = async () => {
    let response = await getAllRatingSkillLevelsAPI(loggedInUser);
    if (response?.statusCode == 0) {
      const skills = response?.result
        .filter(item => item?.sport_type.toLowerCase() === "padel") // Filter padel items
        .map(item => ({
          label: item?.skill_level?.label,
          value: item._id,
          data: item
        }));

      setSkillLevels(skills);
    }
  };

  const getVenues = async () => {
    let response
    if (!loggedUserDetails?.roleId) {
      response = await getAllEventVenuesAPI(loggedInUser);
    } else {
      response = await getEventVenuesUsersAPI(loggedInUser, loggedUserDetails._id);
    }
    setVenue(response?.result?.map((item) => ({
      "label": `${item.name} ${item.location_city}`, "value": item._id
    })));
  }

  const getOrganizers = async () => {
    if (!loggedUserDetails?.roleId) {
      let response = await getAllOrganizersAPI(loggedInUser);
      setGetOrganizers(response.result);
    } else {
      let response = await getAllOrganizersAPI(loggedInUser);
      let filterResponse = response?.result?.filter(item => item._id == loggedUserDetails.organizerId);
      console.log(filterResponse);
      setGetOrganizers(filterResponse);
    }
  };

  // const getTournaments = async () => {
  //   try {
  //     const response = await getAllTournamentsAPI(loggedInUser);
  //     const tournaments = response?.result || [];
  //     setData(tournaments);
  //     setFilteredData(tournaments); // Initialize with all data
  //   } catch (err) {
  //     console.log("Error fetching tournaments:", err);
  //   }
  // };



  useMemo(() => {
  }, [AddTournamentModal, edit])


  const getAllData = async () => {
    let response
    // if (!loggedUserDetails?.roleId) {
    // tournament-v2?page=1&limit=10&tag=1&game=2&price=3&name=4&city=5&keyword=6
    response = await getAllUGTs(loggedInUser, 1, 1000, '', '', '', '', '', '', '', '', '');
    // } else {
    //   response = await TournamentAdminFilterAPI(loggedInUser, sport_type == undefined || sport_type == 'all' ? '' : sport_type, loggedUserDetails?._id, loggedUserDetails?.organizerId || '');
    // }
    console.log("🚀 ~ Search ~ typeof response.result:", typeof response.data)
    setData(response?.data)
  };

  const options = [
    { label: 'All', value: 'all' },
    { label: 'Padel', value: 'padel' },
    { label: 'Pickleball', value: 'pickleball', },
  ];

  const onSportsChange = ({ target: { value } }: RadioChangeEvent) => {
    setValue('sport_type', value);
  };

  const selectedTournament = watch("tournament_id");

  const filterData = async () => {
    // if (selectedTournament) {
    //   console.log("selectedTournament", selectedTournament);

    //   const filtered = data.filter((item) =>
    //     item?.tournament_name?.toLocaleLowerCase().includes(selectedTournament?.toLocaleLowerCase())
    //   );
    //   setFilteredData(filtered);
    // } else {
    //   setFilteredData(data); // If the input field is empty, show all data
    // }

    let response
    // if (!loggedUserDetails?.roleId) {
    // tournament-v2?page=1&limit=10&tag=1&game=2&price=3&name=4&city=5&keyword=6
    response = await getAllUGTs(loggedInUser, 1, 1000, '', sport_type == undefined || sport_type == 'all' ? '' : sport_type, '', selectedTournament || '', '', '', '', '', tournamentType?.value || '');
    // } else {
    //   response = await TournamentAdminFilterAPI(loggedInUser, sport_type == undefined || sport_type == 'all' ? '' : sport_type, loggedUserDetails?._id, loggedUserDetails?.organizerId || '');
    // }
    console.log("🚀 ~ Search ~ typeof response.result:", typeof response.data)
    setData(response?.data)

  };
  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const onClearFilter = async () => {
    await reset({ tournament_id: '', sport_type: 'all', tournament_type: '' });
    getAllData();
  };

  useMemo(() => {
    filterData();
  }, [sport_type])

  useEffect(() => {
    getAllData();
    getAllFacility();
    getSkillLevels();
    getVenues();
    getOrganizers();
    getAllUsersList();
  }, [])

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
                title: "UGTs",
              },
            ]}
          />}
          <div className="main-title-container">
            <div className="title-add-mobile">
              <h5 className="main-content-title">User Generated Tournaments (UGTs)</h5>
              {matches && modulePermissionsData?.add &&
                <>
                  {/* <Button
                    className="pi-btn-primary"
                    key="confirm" type="primary"
                    onClick={() => setAddTournamentModal(true)}
                  >
                    Add Event
                  </Button> */}
                  {/* <Button
                    className="pi-btn-primary"
                    key="confirm" type="primary"
                    onClick={() => setAddTournamentModalV2(true)}
                  >
                    Add UGT
                  </Button> */}
                </>
              }
            </div>
            <div className='title-buttons'>
              <Radio.Group
                options={options}
                {...register('sport_type')}
                onChange={onSportsChange}
                value={sport_type ? sport_type : 'all'}
              />
              {!matches && modulePermissionsData?.add &&
                <>
                  {/* <Button
                    className="pi-btn-primary"
                    key="confirm" type="primary"
                    onClick={() => setAddTournamentModal(true)}
                  >
                    Add Event
                  </Button> */}
                  {/* <Button
                    className="pi-btn-primary"
                    key="confirm" type="primary"
                    onClick={() => setAddTournamentModalV2(true)}
                  >
                    Add UGT
                  </Button> */}
                </>
              }
              {/* <Excel page={'RegisteredEvents'} importdata={filterData?.length != 0 ? filterData : data} /> */}
            </div>

          </div>
          <div className="main-content-card">

            <div className="filter-form">
              <div className={`${matches ? "filter-section border-bottom-light" : "filter-fields"}`}>
                <div className="input-group">
                  <label htmlFor="tournament_id" className="form-label">Tournament</label>
                  <div className="form-group">
                    <Controller
                      name="tournament_id"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="text"
                          id="facilityName"
                          placeholder="Event Name"
                          {...register("tournament_id")}
                        />
                      )}
                    />

                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor="tournament_type">Event Type</label>
                  <div className="form-group">
                    <Controller
                      name="tournament_type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          placeholder="Select Event Type"
                          styles={customStyles}
                          className="controller-select"
                          components={animatedComponents}
                          options={eventOptions}
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

                </div>
              </div>
              {!matches && (
                <div className="filter-buttons-row">
                  <label className="">Total Listed:<span style={{ color: '#F17121' }}>{data?.length}</span></label>
                  <label className="">Total Active:<span style={{ color: '#F17121' }}>NA</span></label>
                  <Button className="pi-btn-primary" type="primary" onClick={filterData}>
                    Apply
                  </Button>
                  <Button className="pi-btn-secondary" onClick={onClearFilter}>
                    Clear
                  </Button>
                </div>
              )}
            </div>
            {matches && (
              <div className="filter-buttons-row">
                <Button className="pi-btn-primary" type="primary" onClick={filterData}>
                  Apply
                </Button>
                <Button className="pi-btn-secondary" onClick={onClearFilter}>
                  Clear
                </Button>
              </div>
            )}

            <Table columns={columns} data={data} />
            {/* <AddTournament
                open={AddTournamentModal}
                toggle={setAddTournamentModal}
                getItems={getTournaments}
                venue={venue}
                organizers={Organizers}
                editdata={ediData}
                copy={copy}
                setCopy={setCopy}
                edit={edit}
                setEdit={setEdit}
                skills={SkillLevels}
                setEditData={setEditData}
                data={data}
              /> */}
            <AddTournamentV2
              open={AddTournamentModalV2}
              toggle={setAddTournamentModalV2}
              getItems={getAllData}
              venue={venue}
              organizers={Organizers}
              editdata={ediData}
              copy={copy}
              setCopy={setCopy}
              edit={edit}
              setEdit={setEdit}
              skills={SkillLevels}
              setEditData={setEditData}
              data={data}
            />
            <AddTournamentV3
              open={AddTournamentModalV3}
              toggle={setAddTournamentModalV3}
              getItems={getAllData}
              venue={venue}
              organizers={Organizers}
              editdata={ediData}
              copy={copy}
              setCopy={setCopy}
              edit={edit}
              setEdit={setEdit}
              skills={SkillLevels}
              setEditData={setEditData}
              data={data}
              userList={userList}
            />
            <TournamentDetails
              visible={showViewModal}
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
              name={`Event Details (${rowdata?.V3 ? 'V3' : rowdata?.tournament_category_ids?.length > 0 ? 'V2' : 'V1'})`}
              row={rowdata}
            />
            <DeleteConfirmation
              visible={deleteConfirmationVisible}
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
              name="Events"
            />
          </div>
        </Card>
      </div>
    </Fragment>
  );
};
export default ManageUGTs;
