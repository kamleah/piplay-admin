import React, { useState, useEffect, Fragment, useMemo } from 'react';
import { Button, Card, Breadcrumb, Avatar, Row, Col, Typography, Divider, Tooltip, Radio, RadioChangeEvent } from 'antd';
import { TrophyOutlined, UsergroupAddOutlined, AimOutlined, ShareAltOutlined } from '@ant-design/icons';
import Table from '../../components/Table/DataTable';
import { Icon } from "@iconify-icon/react";
import { useSelector } from "react-redux";
import AddMatch from '../../components/Modal/AddMatch';
import { CancelMatch, deleteAddOnAPI, editBookingdetail, filterCourt, filterMatches, filterMatchesOld, getAllMatches, getAllMatchesFiltred, getAllMatchesOld, getAllTournamentsAPI, getAllUsers, getFacilityApi, getFacilityByIdApi } from '../../components/apiFile/Service';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import padelIcon from "../../assets/icon/Padel.png";
import pickleballIcon from "../../assets/icon/Pickleball.png";
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import ToastMessage from '../facilator/ToastMessage/ToastMessage';
import { deleteSession } from '../../components/apiFile/Constants';
import CopyToClipboard from "../../components/CopyToClipboard/CopyToClipboard";
import DeleteConfirmation from '../../components/Modal/DeleteConfirmation';
import { Controller, useForm } from 'react-hook-form';
import Select from "react-select";
import makeAnimated from "react-select/animated";

function CreateMatch({ matches, menuOpen, onToggle, modulePermissionsData }) {
    const { Text } = Typography;
    const [data, setData] = useState<any[]>([]);
    const [dataOld, setOldData] = useState([]);
    const [dataNew, setNewData] = useState<any[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const loggedInUser = localStorage.getItem("auth");
    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
    const [open, setOpen] = useState(false);
    const [userList, setUserList] = useState<any[]>([]);
    const [tournaments, setTournaments] = useState([{}])

    const animatedComponents = makeAnimated();

    const matchModeOptions = [
        { label: 'Private', value: 'private' },
        { label: 'Public', value: 'public', },
    ];

    const bookedOnOptions = [
        { label: 'App', value: 'app' },
        { label: 'Admin', value: 'admin', },
    ];

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    const { register, control, watch, setValue, reset } = useForm()
    let playerName = watch("playerName");
    let selectedFacility = watch("facility");
    let court = watch("court");
    let matchMode = watch("matchMode");
    let bookedOn = watch("bookedOn");
    let sport_type = watch("sport_type");



    const handleModaltoggle = () => {
        setShowAddModal(!showAddModal);
    };

    const handleCreateMatch = () => {
        setShowAddModal(true);
    };

    const [facility, setFacility] = useState<any>();
    const [allCourtsData, setAllCourtsData] = useState<any[]>([]);
    const [facilityList, setFacilityList] = useState<any[]>([]);
    const [courtList, setCourtList] = useState<any[]>([]);
    const [selectededCourtsList, setSelectededCourtsList] = useState<any[]>([]);
    const getallFacilitList = async () => {
        let response = await getFacilityApi(loggedInUser);
        if (!loggedUserDetails?.roleId) {
            let venues = response?.result?.map((data) => ({
                label: data?.name,
                value: data?._id
            }));
            setFacilityList(venues);
            setValue('facility', venues[0]);
        } else {
            const filteredFacilities = response?.result.filter(item => loggedUserDetails?.facilities.includes(item._id));
            setFacilityList(filteredFacilities.map((data) => ({
                label: data?.name,
                value: data?._id
            })));
            setValue('facility', { label: filteredFacilities[0]?.name, value: filteredFacilities[0]?._id });

        }
    };

    const getAllCourtsbyFacility = async (selectedFacility) => {
        console.log("🚀 ~ file: AddMatch.tsx:193 ~ getAllCourtsbyFacility ~ facility_id, sportType:", selectedFacility, '')
        setValue("court", '');
        let response = await filterCourt(loggedInUser, '', selectedFacility == undefined ? '' : selectedFacility?.value, '');
        let courts = response?.result?.map(data => {
            return { "label": data?.name, "value": data?._id }
        });
        setCourtList(courts);
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

    const getallMatches = async () => {
        console.log('loggedUserDetails?.facility_id', selectedFacility);
        // let response = await getAllMatchesFiltred(loggedInUser, '', '', loggedUserDetails?.facility_id || '', '');
        let response = await getAllMatchesFiltred(loggedInUser, loggedUserDetails?.facility_id || selectedFacility?.value, '', 0, 7, '', '', '', '', '', '');
        setData([...response?.data?.public, ...response?.data?.private, ...response?.data?.openplay]);
    }
    // const getallMatches = async () => {
    //     let response = await getAllMatches(loggedInUser, '', '', loggedUserDetails?.facility_id || '', '');
    //     setNewData(response?.data)
    // }
    // const getallMatchesOld = async () => {
    //     let response = await getAllMatchesOld(loggedInUser, '', '', loggedUserDetails?.facility_id || '', '');
    //     setOldData(response?.data)
    // }

    // useMemo(() => {
    //     setData([...dataNew]);
    // }, [dataNew, dataOld])

    useMemo(() => {
        if (selectedFacility) {
            getAllCourtsbyFacility(selectedFacility);
            getallMatches();
        }
    }, [selectedFacility])
  
    const getTournaments = async () => {
        let response = await getAllTournamentsAPI(loggedInUser);
        let tournament = response?.result?.map(data => {
            return { "label": data?.tournament_name, "value": data._id, "categories": data?.tournament_category_ids }
        })
        setTournaments(tournament)
    }


    useEffect(() => {
        getallFacilitList();
        getAllUsersList();
        getTournaments();
        // getallMatches();
        // getallMatchesOld();
    }, []);



    const calculateDurationInMinutes = (start_time, end_time) => {
        if (start_time && end_time) {
            const startTime = moment(start_time, 'HH:mm');
            const endTime = moment(end_time, 'HH:mm');
            const duration = moment.duration(endTime.diff(startTime));
            const minutes = duration.asMinutes();
            return `${minutes} min`;
        }

        return 'Invalid time';
    };

    const [showViewModal, setShowViewModal] = useState(false);
    const [rowdata, setRowdata] = useState({});
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [deleteRowId, setDeleteRowId] = useState({});

    const handleShowModal = async (row: any, type: any) => {
        setRowdata(row);
        if (type == 'view') {
            setShowViewModal(true);
        } else if (type == 'edit') {
            setEditMode(true);
            setShowAddModal(true);
        } else {
            setShowViewModal(false);
            setShowAddModal(false);
            setEditMode(false);
        }
    };

    const handleCancel = () => {
        setShowAddModal(false);
        setShowViewModal(false);
        setEditMode(false);
    };

    // delete popup 
    const handleDeleteModal = (cancelRowData) => {
        cancelRowData.status = "Released";
        console.log(cancelRowData);
        setDeleteRowId(cancelRowData);
        setDeleteConfirmationVisible(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteRowId) {
            await DeleteFunction(deleteRowId);
            setDeleteConfirmationVisible(false);
            setDeleteRowId("");
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmationVisible(false);
        setDeleteRowId("");
    };

    const DeleteFunction = async (deleteRowdata) => {

        // Actual delete logic here
        let response = await CancelMatch(loggedInUser, deleteRowdata._id);
        if (response.code == 'RAZORPAY_REFUND_SUCCESS') {
            toast(<ToastMessage body={`Match Cancelled Successfully`} type="success" />, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            getallMatches();
            // getallMatchesOld();
        } else {
            toast(<ToastMessage body={`Failed To Cancel the Match`} type="warning" />, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
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


    // const filterData = async (sportType) => {
    //     // let response = await getAllMatches(loggedInUser, '', playerName?.value || '', loggedUserDetails.roleId ? loggedUserDetails?.facility_id : selectedFacility?.value || '', matchMode?.value || '');
    //     let responseNew = await filterMatches(loggedInUser, loggedUserDetails.roleId ? loggedUserDetails?.facility_id : selectedFacility?.value || '', playerName?.value || '', '', '', sportType || '', matchMode?.value || '', '');
    //     let responseOld = await filterMatchesOld(loggedInUser, loggedUserDetails.roleId ? loggedUserDetails?.facility_id : selectedFacility?.value || '', playerName?.value || '', '', '', sportType || '', matchMode?.value || '', '');
    //     setNewData(responseNew?.data)
    //     setOldData(responseOld?.data)
    // };
    const filterData = async (sportType) => {
        // let responseNew = await filterMatches(loggedInUser, loggedUserDetails.roleId ? loggedUserDetails?.facility_id : selectedFacility?.value || '', playerName?.value || '', '', '', sportType || '', matchMode?.value || '', '');
        // (user, facilityId, userId, min, max, sport_type, mode, match_type, bookedby, bookingbefore, bookingafter) 
        let response = await getAllMatchesFiltred(loggedInUser, loggedUserDetails?.facility_id || selectedFacility?.value, playerName?.value || '', 0, 7, sportType || '', matchMode?.value || '', bookedOn?.value || '', '', '', '');
        if (matchMode?.value == 'public') {
            setData(response?.data?.public || [])
        } else if (matchMode?.value == 'private') {
            setData(response?.data?.private || [])
        } else {
            setData([...response?.data?.public, ...response?.data?.private, ...response?.data?.openplay]);
        }
    };


    const onClearFilter = () => {
        getallMatches();
        // getallMatchesOld();
        reset({
            playerName: "",
            facility: selectedFacility,
            matchMode: "",
            sportType: "",
            court: "",
        });
    }

    const options = [
        { label: 'All', value: '' },
        { label: 'Padel', value: 'padel' },
        { label: 'Pickleball', value: 'pickleball', },
    ];

    const onSportsChange = ({ target: { value } }: RadioChangeEvent) => {
        setValue('sport_type', value);
        filterData(value)
    };

    const MatchmakingCard = ({ match }) => {

        const newMatchPlayerList = Array.from({ length: 8 }, (_, index) =>
            match?.booking_players.find(player => player.index === index) || {}
        );

        // console.log(newMatchPlayerList);


        return (
            <div className=''>
                <div className="match-card">
                    <Row justify="space-between" align="middle" style={{ marginBottom: '5px' }}>
                        <Row>

                            <Text strong> {moment(match?.booking_date).format('ddd Do MMM')} • {moment(match?.start_time, 'HH:mm').format('hh:mma')} • {calculateDurationInMinutes(match?.start_time, match?.end_time)} • {match?.match_type2} {match?.match_type} </Text>
                            <br />
                            <Text type="secondary"> {match?.facility?.name}</Text>
                            <Row style={{ marginLeft: '10px' }} align="middle" gutter={8}>
                                <Text>{match?.min_rating?.toFixed(1)} - {match?.max_rating?.toFixed(1)}</Text>
                                {/* <Icon icon="mdi:account-lock-open" style={{ marginLeft: '5px' }} /> */}
                            </Row>
                        </Row>
                    </Row>

                    <Row gutter={16} align="middle" justify="space-between" style={{ marginBottom: '5px' }}>
                        {/* First Row - You and Alex */}
                        <Col>
                            {newMatchPlayerList[0]?.user_id ? (
                                <div className='selected-player-container'>
                                    <div className='selected-player-profile'>
                                        {newMatchPlayerList[0]?.user_id?.profile_url ?
                                            <img src={newMatchPlayerList[0]?.user_id?.profile_url} alt="player" className="player-image" />
                                            :
                                            <div className="player-name">
                                                {newMatchPlayerList[0]?.user_id?.firstname[0]}
                                            </div>
                                        }
                                    </div>
                                    <Text style={{ fontSize: "10px", textAlign: 'center' }}>{newMatchPlayerList[0]?.user_id?.firstname} {newMatchPlayerList[0]?.user_id?.lastname}</Text>
                                    {/* <div className='rating-container'>
                                            {newMatchPlayerList[0]?.user_id?.skill_level_new?.map((data) => {
                                                return (
                                                    <>
                                                        {data?.rating}  <Icon icon="mdi:star" className='star-icon-match' />
                                                    </>
                                                )
                                            })}
                                        </div> */}
                                    {/* <Icon icon="mdi:close" className='close-icon-match' onClick={handleRemoveUser} /> */}
                                </div>
                            ) : (
                                <div className='empty-player-container'>
                                    <PlusOutlined style={{ color: "#64748B" }} size={10} />
                                </div>
                            )}
                        </Col>

                        {match?.match_type === "doubles" && <Col>
                            {newMatchPlayerList[1]?.user_id ? (
                                <div className='selected-player-container'>
                                    <div className='selected-player-profile'>
                                        {newMatchPlayerList[1]?.user_id?.profile_url ?
                                            <img src={newMatchPlayerList[1]?.user_id?.profile_url} alt="player" className="player-image" />
                                            :
                                            <div className="player-name">
                                                {newMatchPlayerList[1]?.user_id?.firstname[0]}
                                            </div>
                                        }
                                    </div>
                                    <Text style={{ fontSize: "10px", textAlign: 'center' }}>{newMatchPlayerList[1]?.user_id?.firstname} {newMatchPlayerList[1]?.user_id?.lastname}</Text>
                                    {/* <div className='rating-container'>
                                            {newMatchPlayerList[1]?.user_id?.skill_level_new?.map((data) => {
                                                return (
                                                    <>
                                                        {data?.rating}  <Icon icon="mdi:star" className='star-icon-match' />
                                                    </>
                                                )
                                            })}
                                        </div> */}
                                    {/* <Icon icon="mdi:close" className='close-icon-match' onClick={handleRemoveUser} /> */}
                                </div>
                            ) : (
                                <>
                                    <div className='empty-player-container'>
                                        <PlusOutlined style={{ color: "#64748B" }} size={10} />
                                    </div>
                                </>
                            )}
                        </Col>}
                        {match?.match_score.map((data) => {
                            return (
                                <Col style={{ paddingBottom: '10px' }}>
                                    <Text strong style={{ fontSize: '20px' }}>{data?.score1}</Text>
                                </Col>
                            )
                        })}
                    </Row>

                    {/* Second Row - Adit and Kamlesh */}
                    <Row gutter={16} align="middle" justify="space-between" style={{ marginBottom: '5px' }}>
                        <Col>
                            {newMatchPlayerList[2]?.user_id ? (
                                <div className='selected-player-container'>
                                    <div className='selected-player-profile'>
                                        {newMatchPlayerList[2]?.user_id?.profile_url ?
                                            <img src={newMatchPlayerList[2]?.user_id?.profile_url} alt="player" className="player-image" />
                                            :
                                            <div className="player-name">
                                                {newMatchPlayerList[2]?.user_id?.firstname[0]}
                                            </div>
                                        }
                                    </div>
                                    <Text style={{ fontSize: "10px", textAlign: 'center' }}>{newMatchPlayerList[2]?.user_id?.firstname} {newMatchPlayerList[2]?.user_id?.lastname}</Text>
                                    {/* <div className='rating-container'>
                                            {newMatchPlayerList[2]?.user_id?.skill_level_new?.map((data) => {
                                                return (
                                                    <>
                                                        {data?.rating}  <Icon icon="mdi:star" className='star-icon-match' />
                                                    </>
                                                )
                                            })}
                                        </div> */}
                                    {/* <Icon icon="mdi:close" className='close-icon-match' onClick={handleRemoveUser} /> */}
                                </div>
                            ) : (
                                <div className='empty-player-container'>
                                    <PlusOutlined style={{ color: "#64748B" }} size={10} />
                                </div>
                            )}
                        </Col>
                        {match?.match_type === "doubles" && <Col>
                            {newMatchPlayerList[3]?.user_id ? (
                                <div className='selected-player-container'>
                                    <div className='selected-player-profile'>
                                        {newMatchPlayerList[3]?.user_id?.profile_url ?
                                            <img src={newMatchPlayerList[3]?.user_id?.profile_url} alt="player" className="player-image" />
                                            :
                                            <div className="player-name">
                                                {newMatchPlayerList[3]?.user_id?.firstname[0]}
                                            </div>
                                        }
                                    </div>
                                    <Text style={{ fontSize: "10px", textAlign: 'center' }}>{newMatchPlayerList[3]?.user_id?.firstname} {newMatchPlayerList[3]?.user_id?.lastname}</Text>
                                    {/* <div className='rating-container'>
                                            {newMatchPlayerList[3]?.user_id?.skill_level_new?.map((data) => {
                                                return (
                                                    <>
                                                        {data?.rating}  <Icon icon="mdi:star" className='star-icon-match' />
                                                    </>
                                                )
                                            })}
                                        </div> */}
                                    {/* <Icon icon="mdi:close" className='close-icon-match' onClick={handleRemoveUser} /> */}
                                </div>
                            ) : (
                                <div className='empty-player-container'>
                                    <PlusOutlined style={{ color: "#64748B" }} size={10} />
                                </div>
                            )}
                        </Col>}
                        {match?.match_score.map((data) => {
                            return (
                                <Col style={{ paddingBottom: '10px' }}>
                                    <Text strong style={{ fontSize: '20px', paddingBottom: '10px' }}>{data?.score2}</Text>
                                </Col>
                            )
                        })}
                    </Row>

                    {/* Bottom Divider */}
                    <Divider style={{ margin: '5px' }} />

                    {/* Extra Information Row */}
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Row align="middle">
                                <AimOutlined />
                                {/* <Text style={{ marginLeft: '8px' }}>Mumbai • 7km</Text> */}
                                <Text style={{ fontSize: '10px', marginLeft: '8px' }}>{match?.facility?.city}</Text>
                            </Row>
                        </Col>
                        <Col>
                            <Row align="middle">
                                <Text style={{ fontSize: '10px', marginLeft: '8px' }}>Extra Players</Text>
                            </Row>
                            <Row gutter={10} align="middle" justify="space-between">
                                <Col>
                                    {newMatchPlayerList[4]?.user_id ? (
                                        <div className='selected-player-container-sm'>
                                            <div className='selected-player-profile-sm'>
                                                {newMatchPlayerList[4]?.user_id?.profile_url ?
                                                    <img src={newMatchPlayerList[4]?.user_id?.profile_url} alt="player" className="player-image" />
                                                    :
                                                    <div className="player-name-sm">
                                                        {newMatchPlayerList[4]?.user_id?.firstname[0]}
                                                    </div>
                                                }
                                            </div>
                                            <Text style={{ fontSize: "10px", textAlign: 'center' }}>{newMatchPlayerList[4]?.user_id?.firstname} {newMatchPlayerList[4]?.user_id?.lastname}</Text>
                                            {/* <div className='rating-container'>
                                            {newMatchPlayerList[4]?.user_id?.skill_level_new?.map((data) => {
                                                return (
                                                    <>
                                                        {data?.rating}  <Icon icon="mdi:star" className='star-icon-match' />
                                                    </>
                                                )
                                            })}
                                        </div> */}
                                            {/* <Icon icon="mdi:close" className='close-icon-match' onClick={handleRemoveUser} /> */}
                                        </div>
                                    ) : (
                                        <div className='empty-player-container-sm'>
                                            <PlusOutlined style={{ color: "#64748B" }} size={10} />
                                        </div>
                                    )}
                                </Col>
                                {match?.match_type === "doubles" && <Col>
                                    {newMatchPlayerList[5]?.user_id ? (
                                        <div className='selected-player-container-sm'>
                                            <div className='selected-player-profile-sm'>
                                                {newMatchPlayerList[5]?.user_id?.profile_url ?
                                                    <img src={newMatchPlayerList[5]?.user_id?.profile_url} alt="player" className="player-image" />
                                                    :
                                                    <div className="player-name-sm">
                                                        {newMatchPlayerList[5]?.user_id?.firstname[0]}
                                                    </div>
                                                }
                                            </div>
                                            <Text style={{ fontSize: "10px", textAlign: 'center' }}>{newMatchPlayerList[5]?.user_id?.firstname} {newMatchPlayerList[5]?.user_id?.lastname}</Text>
                                            {/* <div className='rating-container'>
                                            {newMatchPlayerList[5]?.user_id?.skill_level_new?.map((data) => {
                                                return (
                                                    <>
                                                        {data?.rating}  <Icon icon="mdi:star" className='star-icon-match' />
                                                    </>
                                                )
                                            })}
                                        </div> */}
                                            {/* <Icon icon="mdi:close" className='close-icon-match' onClick={handleRemoveUser} /> */}
                                        </div>
                                    ) : (
                                        <div className='empty-player-container-sm'>
                                            <PlusOutlined style={{ color: "#64748B" }} size={10} />
                                        </div>
                                    )}
                                </Col>}
                                <Col>
                                    {newMatchPlayerList[6]?.user_id ? (
                                        <div className='selected-player-container-sm'>
                                            <div className='selected-player-profile-sm'>
                                                {newMatchPlayerList[6]?.user_id?.profile_url ?
                                                    <img src={newMatchPlayerList[6]?.user_id?.profile_url} alt="player" className="player-image" />
                                                    :
                                                    <div className="player-name-sm">
                                                        {newMatchPlayerList[6]?.user_id?.firstname[0]}
                                                    </div>
                                                }
                                            </div>
                                            <Text style={{ fontSize: "7px", textAlign: 'center' }}>{newMatchPlayerList[6]?.user_id?.firstname} {newMatchPlayerList[6]?.user_id?.lastname}</Text>
                                            {/* <div className='rating-container'>
                                            {newMatchPlayerList[6]?.user_id?.skill_level_new?.map((data) => {
                                                return (
                                                    <>
                                                        {data?.rating}  <Icon icon="mdi:star" className='star-icon-match' />
                                                    </>
                                                )
                                            })}
                                        </div> */}
                                            {/* <Icon icon="mdi:close" className='close-icon-match' onClick={handleRemoveUser} /> */}
                                        </div>
                                    ) : (
                                        <div className='empty-player-container-sm'>
                                            <PlusOutlined style={{ color: "#64748B" }} size={10} />
                                        </div>
                                    )}
                                </Col>
                                {match?.match_type === "doubles" && <Col>
                                    {newMatchPlayerList[7]?.user_id ? (
                                        <div className='selected-player-container-sm'>
                                            <div className='selected-player-profile-sm'>
                                                {newMatchPlayerList[7]?.user_id?.profile_url ?
                                                    <img src={newMatchPlayerList[7]?.user_id?.profile_url} alt="player" className="player-image-sm" />
                                                    :
                                                    <div className="player-name-sm">
                                                        {newMatchPlayerList[7]?.user_id?.firstname[0]}
                                                    </div>
                                                }
                                            </div>
                                            <Text style={{ fontSize: "7px", textAlign: 'center' }}>{newMatchPlayerList[7]?.user_id?.firstname} {newMatchPlayerList[7]?.user_id?.lastname}</Text>
                                            {/* <div className='rating-container'>
                                            {newMatchPlayerList[7]?.user_id?.skill_level_new?.map((data) => {
                                                return (
                                                    <>
                                                        {data?.rating}  <Icon icon="mdi:star" className='star-icon-match' />
                                                    </>
                                                )
                                            })}
                                        </div> */}
                                            {/* <Icon icon="mdi:close" className='close-icon-match' onClick={handleRemoveUser} /> */}
                                        </div>
                                    ) : (
                                        <div className='empty-player-container-sm'>
                                            <PlusOutlined style={{ color: "#64748B" }} size={6} />
                                        </div>
                                    )}
                                </Col>}
                            </Row>
                        </Col>
                        <Col>
                            <div className='sport-icon-container'>
                                <img src={match?.court?.game?.toLowerCase() == 'padel' ? padelIcon : pickleballIcon} className="sport-icon" />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>)

    }

    const columns = [
        {
            name: 'ID',
            selector: row => row._id,
            wrap: true,
            sortable: true,
        },

        {
            name: 'Match Card ',
            selector: null,
            wrap: true,
            sortable: true,
            cell: row => <MatchmakingCard match={row} />,
            style: {
                minWidth: '385px',
            }
        },

        {
            name: 'Type',
            selector: row => row.razor_id,
            wrap: true,
            sortable: true,
        },
        {
            name: 'Payment Status',
            selector: row => row.payment_status,
            wrap: true,
            sortable: true,
        },
        {
            name: 'Booking Status',
            selector: row => row.status,
            wrap: true,
            sortable: true,
        },
        {
            name: 'Actions',
            selector: row => row?.year,
            sortable: true,
            wrap: true,
            cell: row =>
                <div className='action-button-container'>
                    {/* {modulePermissionsData?.view &&
                        <button className='action-button view-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'view') }} ><Icon icon="raphael:view" /></button>
                    } */}
                    {modulePermissionsData?.edit &&
                        <button className='action-button edit-button' onClick={(e) => { e.preventDefault(); handleShowModal(row, 'edit') }}><Icon icon="mdi:pencil-outline" /></button>
                    }
                    {modulePermissionsData?.delete &&
                        <Button className="action-button delete-button" danger onClick={(e) => { e.preventDefault(); handleDeleteModal(row) }} disabled={row.status == 'Cancelled'}>
                            <Tooltip title="Cancel Match" placement="top">
                                <Icon icon="mdi:account-cancel" height={18} width={18} style={{ paddingLeft: '5px' }} />
                            </Tooltip>
                        </Button>
                    }
                    {modulePermissionsData?.delete &&
                        <button className='action-button delete-button'>
                            <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} onClick={(e) => { e.preventDefault(); copyToClipboard(row) }} />
                        </button>
                    }
                </div >

            ,
        },

    ];
    return (
        <Fragment>
            <div
                onClick={onToggle}
                className={menuOpen ? `page-open-header${matches ? "-mobile" : ""}` : `page-header${matches ? "-mobile" : ""}`}
            >
                <Card>
                    {!matches && <Breadcrumb
                        items={[
                            { title: "Home" },
                            { title: "Bookings" },
                            { title: "Create Admin Match" },
                        ]}
                    />}
                    <div className="main-title-container">
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">Create Admin Match</h5>
                            {matches && modulePermissionsData?.add &&
                                <Button
                                    key="confirm"
                                    type="primary"
                                    className="pi-btn-primary"
                                    onClick={handleModaltoggle}
                                >
                                    Create Match
                                </Button>
                            }
                        </div>
                        {!matches && modulePermissionsData?.add &&
                            <div className='title-buttons'>
                                <div>

                                    <Radio.Group
                                        options={options}
                                        {...register('sport_type')}
                                        onChange={onSportsChange}
                                        value={sport_type ? sport_type : ''}
                                    />
                                </div>
                                <Button
                                    key="confirm"
                                    type="primary"
                                    className="pi-btn-primary"
                                    onClick={handleModaltoggle}
                                >
                                    Create Match
                                </Button>
                            </div>
                        }
                    </div>


                    <div className="main-content-card">
                        {!matches &&
                            // <FilterSection />
                            <div className="filter-form">
                                <div className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"}`}>

                                    <div className="input-group">
                                        <label htmlFor="facility" className="form-lable">Facility</label>
                                        <div className="form-group">
                                            <Controller
                                                name="facility"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        // closeMenuOnSelect={false}
                                                        className="controller-select"
                                                        components={animatedComponents}
                                                        defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                                                        // isMulti
                                                        options={facilityList}
                                                        placeholder="Select a facility"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="playerName" className="form-lable">Search by player</label>
                                        <div className="form-group" style={{ width: "250px" }}>
                                            <Controller
                                                name="playerName"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
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
                                                        placeholder="Select a player"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* <div className="input-group">
                                        <label htmlFor="court" className="form-lable">Court</label>
                                        <div className="form-group">
                                            <Controller
                                                name="court"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        // closeMenuOnSelect={false}
                                                        className="controller-select"
                                                        components={animatedComponents}
                                                        defaultValue={field.value ? field.value : null} // Conditionally set defaultValue based on field value
                                                        // isMulti
                                                        options={courtList}
                                                        placeholder="Select court"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div> */}
                                    {/* <div className="input-group">
                                        <label htmlFor="court" className="form-lable">Facility Location</label>
                                        <div className="form-group">
                                            <Controller
                                                name="court"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        // closeMenuOnSelect={false}
                                                        className="controller-select"
                                                        components={animatedComponents}
                                                        defaultValue={field.value ? field.value : null} // Conditionally set defaultValue based on field value
                                                        // isMulti
                                                        options={courtList}
                                                        placeholder="Select facility location"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div> */}
                                    <div className="input-group">
                                        <label htmlFor="court" className="form-lable">Match Mode</label>
                                        <div className="form-group">
                                            <Controller
                                                name="matchMode"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        // closeMenuOnSelect={false}
                                                        className="controller-select"
                                                        components={animatedComponents}
                                                        defaultValue={field.value ? field.value : null} // Conditionally set defaultValue based on field value
                                                        // isMulti
                                                        options={matchModeOptions}
                                                        placeholder="Select match mode"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="input-group">
                                        <label htmlFor="court" className="form-lable">Booked on</label>
                                        <div className="form-group">
                                            <Controller
                                                name="bookedOn"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        // closeMenuOnSelect={false}
                                                        className="controller-select"
                                                        components={animatedComponents}
                                                        defaultValue={field.value ? field.value : null} // Conditionally set defaultValue based on field value
                                                        // isMulti
                                                        options={bookedOnOptions}
                                                        placeholder="Select booked on"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div> */}
                                </div>
                                {!matches && <div className="filter-buttons-row">
                                    <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => {
                                        filterData("")
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
                            data={[...data]?.sort((a: any, b: any) => new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime())}
                            customColumnHeaderWidth='390px !important'
                        />
                    </div>
                    <AddMatch
                        open={showAddModal}
                        toggle={handleModaltoggle}
                        rowData={rowdata}
                        edit={editMode}
                        setEdit={() => setEditMode(false)}
                        facilityList={facilityList}
                        userList={userList}
                        // getData={()=>{getallMatches(); getallMatchesOld();}}
                        getData={() => { getallMatches() }}
                        tournaments={tournaments}
                    />
                    <DeleteConfirmation
                        visible={deleteConfirmationVisible}
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                        name={'Match'}
                    />
                </Card>
            </div >
        </Fragment >
    )
}

export default CreateMatch;