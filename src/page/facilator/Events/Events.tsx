import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Card, Breadcrumb, Button, Radio, RadioChangeEvent, Switch, Tooltip } from "antd";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { CouponFilterAPI, TournamentAdminFilterAPI, TournamentFilterAPI, deactivateTournaments, deleteEventAPI, getAllEventVenuesAPI, getAllOrganizersAPI, getAllRatingSkillLevelsAPI, getAllSkillLevelsAPI, getAllTournamentsAPI, getAllUsers, getEventVenuesUsersAPI, getEventsByVenuesAPI, getFacilityApi, getFacilityByIdApi } from "../../../components/apiFile/Service";
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



const Events = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {

  const [data, setData] = useState<Tournament[]>([]);

  const [AddTournamentModal, setAddTournamentModal] = useState(false)
  const [AddTournamentModalV2, setAddTournamentModalV2] = useState(false)
  const [edit, setEdit] = useState(false)
  const [Facilities, setGetFacility] = useState()
  const [Organizers, setGetOrganizers] = useState()
  const [venue, setVenue] = useState()
  const [SkillLevels, setSkillLevels] = useState([])
  const [ediData, setEditData] = useState({})
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [couponToDeleteId, setCouponToDeleteId] = useState<string | null>(null);
  const [copy, setCopy] = useState(false)
  const [filteredData, setFilteredData] = useState<Tournament[]>([]);

  const animatedComponents = makeAnimated();

  const loggedInUser = localStorage.getItem("auth");
  const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
  console.log("🚀 ~ file: Events.tsx:66 ~ Events ~ loggedUserDetails:", loggedUserDetails)
  const { register, control, watch, setValue, reset } = useForm()
  let sport_type = watch("sport_type");

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
      getTournaments();
    }
  };

  const columns = [
    {
      name: "Image",
      selector: row => row?.image,
      wrap: true,
      sortable: true,
      cell: row => (<img src={row?.image_url} className='table-lg-img-square' />),
    },

    {
      name: "Name",
      selector: row => row?.tournament_name,
      wrap: true,
      sortable: true,

    },
    // {
    //   name: 'Description',
    //   selector: row => row?.tournament_description,
    //   wrap: true,
    //   sortable: true,
    // },
    {
      name: 'Type',
      selector: row => row?.tournament_type.includes('[') ? JSON.parse(row?.tournament_type).map((item: any) => item.label).join(", ") : row?.tournament_type,
      wrap: true,
      sortable: true,
    },
    {
      name: 'Address',
      selector: row => `${row?.venue?.location_city} ${row?.venue?.location_state}`,
      wrap: true,
      sortable: true,
    },

    {
      name: 'Price',
      selector: row => row?.total,
      wrap: true,
      sortable: true,
    },
    {
      name: 'Registered',
      selector: row => `${row?.registered_players}/${row?.total_number_of_registration}`,
      wrap: true,
      sortable: true,
    },
    {
      name: 'Date',
      selector: row => `${moment(row?.start_date).format('DD/MMM/YY')} - ${moment(row?.end_date).format('DD/MMM/YY')}`,
      wrap: true,
      sortable: true,
    },
    {
      name: 'Time',
      selector: row => `${row?.start_time} - ${row?.end_time}`,
      wrap: true,
      sortable: true,
    },
    {
      name: 'Tags',
      selector: row => row?.tournament_tag || 'N/A',
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
      name: 'Status',
      selector: row => row.status,
      wrap: true,
      sortable: true,
      cell: row =>
        <div >
          <Switch defaultChecked onChange={(e) => { onChangeStatus(row._id, row.status) }} checked={row.status} />
        </div>
    },
    {
      name: 'Actions',
      selector: row => row.year,
      sortable: true,
      wrap: true,
      cell: row =>
        <div className='action-button-container'>
          {modulePermissionsData?.edit &&
            <>
              {/* <Tooltip title="Edit V1" placement="left">
              <button className='action-button edit-button' onClick={() => { setEdit(true); setEditData(row); setAddTournamentModal(true) }}>
                <Icon icon="mdi:pencil-outline" title="Edit" />
              </button>
              </Tooltip> */}
              <Tooltip title="Edit" placement="left">
                <button className='action-button edit-button' onClick={() => { setEdit(true); setEditData(row); setAddTournamentModalV2(true) }}>
                  <Icon icon="ic:sharp-mode-edit-outline" />
                </button>
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
        </div>


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
      getTournaments();
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

  const getTournaments = async () => {
    try {
      const response = await getAllTournamentsAPI(loggedInUser);
      const tournaments = response?.result || [];
      setData(tournaments);
      setFilteredData(tournaments); // Initialize with all data
    } catch (err) {
      console.log("Error fetching tournaments:", err);
    }
  };



  useMemo(() => {
  }, [AddTournamentModal, edit])

  useEffect(() => {
    Search(true)
    getAllFacility();
    getSkillLevels();
    getVenues();
    getOrganizers();
  }, [])

  const Search = async (search) => {
    let response
    if (!loggedUserDetails?.roleId) {
      response = await getAllTournamentsAPI(loggedInUser);
    } else {
      response = await TournamentAdminFilterAPI(loggedInUser, sport_type == undefined || sport_type == 'all' ? '' : sport_type, loggedUserDetails?._id, loggedUserDetails?.organizerId || '');
    }
    console.log("🚀 ~ Search ~ typeof response.result:", typeof response.result)
    if (typeof response.result == 'string') {
      setData([]);
      setFilteredData([]);
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
      return
    }
    if (response.result?.length != 0) {
      setData(response?.result)
      setFilteredData(response?.result)
    } else {
      setData([]);
      setFilteredData([])
    }
  };

  useMemo(() => {
    if (sport_type != undefined) {
      Search(true)
    }
  }, [sport_type])

  const options = [
    { label: 'All', value: 'all' },
    { label: 'Padel', value: 'padel' },
    { label: 'Pickleball', value: 'pickleball', },
  ];

  const onSportsChange = ({ target: { value } }: RadioChangeEvent) => {
    setValue('sport_type', value);
  };

  const selectedTournament = watch("tournament_id");

  useEffect(() => {
    filterData();
  }, [selectedTournament])

  const filterData = () => {
    if (selectedTournament) {
      console.log("selectedTournament", selectedTournament);

      const filtered = data.filter((item) =>
        item?.tournament_name?.toLocaleLowerCase().includes(selectedTournament?.toLocaleLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // If the input field is empty, show all data
    }
  };
  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const onClearFilter = async () => {
    await reset({ tournament_search: '', sport_type: 'all' });
    setFilteredData(data);
  };

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
                title: "Events",
              },
            ]}
          />}
          <div className="main-title-container">
            <div className="title-add-mobile">
              <h5 className="main-content-title">Events</h5>
              {matches && modulePermissionsData?.add &&
                <>
                  {/* <Button
                    className="pi-btn-primary"
                    key="confirm" type="primary"
                    onClick={() => setAddTournamentModal(true)}

                  >
                    Add Event
                  </Button> */}
                  <Button
                    className="pi-btn-primary"
                    key="confirm" type="primary"
                    onClick={() => setAddTournamentModalV2(true)}

                  >
                    Add Event
                  </Button>
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
                  <Button
                    className="pi-btn-primary"
                    key="confirm" type="primary"
                    onClick={() => setAddTournamentModalV2(true)}

                  >
                    Add Event
                  </Button>
                </>
              }
              {/* <Excel page={'RegisteredEvents'} importdata={filterData?.length != 0 ? filterData : data} /> */}
            </div>

          </div>
          <div className="main-content-card">
            <div style={{ position: "sticky" }}>
              {" "}

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
              />
            </div>
            <>
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
                </div>
                {!matches && (
                  <div className="filter-buttons-row">
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
            </>
            <Table columns={columns} data={filteredData} />
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
export default Events;
