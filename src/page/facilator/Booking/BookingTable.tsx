import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import noDataImage from "../../../assets/icon/no_result.png";
import {
    Button,
    Dropdown,
    Menu,
} from "antd";
import {
    CalendarOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    StopOutlined,
    FieldTimeOutlined,
} from "@ant-design/icons";
import userimage from '../../../assets/icon/user.jpeg';

import BookingDetails from '../../../components/Modal/BookingDetails';
import NAddBookingModal from "../../../components/Modal/BookingNewM";
import UserDetails from '../../../components/Modal/UserDetails';
import moment from 'moment';
import zIndex from '@mui/material/styles/zIndex';
import { Icon } from '@iconify-icon/react';

type TextTransform = 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'initial' | 'inherit';

interface BookingTableProps {
    column: any[];
    data: any[];
    facility: any;
    courts: any[];
    getBookings: () => void;
    dateState: string;
}

const BookingTable = ({
    matches,
    column,
    data,
    facility,
    courts,
    getBookings,
    dateState
}) => {
    const [bookingData, setBookingData] = useState<any>();
    const [bookingDetailsData, setBookingDetailsData] = useState<any>();
    const [bookingDetailsModal, setBookingDetailsModal] = useState(false);
    const [addBookingModal, setAddBookingModal] = useState(false);
    const [userData, setUserData] = useState<any>({});
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [slot, setSlot] = useState({});

    const handleshowUserProfile = async (userData: any) => {
        setUserData(userData);
        setShowRegistrationModal(true);
    };

    const handleConfirmDelete = async () => {
        setShowRegistrationModal(false);
    };

    const handleCancelDelete = () => {
        setShowRegistrationModal(false);
    };

    useEffect(() => {
        if (data) {
            setBookingData(data);
        }
    }, [data]);

    const bookingDetailsModalClose = () => {
        setBookingDetailsModal(false);
    };

    const customBookingStyles = {
        rows: {
            style: {
                minHeight: 'auto',
                borderBottom: '1px solid #EBEBEB !important',
            },
        },
        headRow: {
            style: {
                minHeight: '40px',
                backgroundColor: '#FFF',
                fontSize: '14px',
                fontWeight: 600,
                zIndex: 10,
                '@media only screen and (max-width: 768px)': {
                    fontSize: '12px',
                    minHeight: '30px !important',
                },
                '@media only screen and (max-width: 425px)': {
                    fontSize: '9px',
                    minHeight: '30px !important',
                },
            },
        },
        table: {
            style: {
                // overflow: 'hidden',
                border: '1px solid #EBEBEB !important',
                borderLeft: '0px !important',
            },
        },
        headCells: {
            style: {
                justifyContent: 'center',
                alignItems: 'center',
                textTransform: 'uppercase' as TextTransform,
                '&:first-child': {
                    maxWidth: '20px !important',
                    minWidth: '70px',
                    backgroundColor: "red",

                },
                '&:nth-child(odd)': {
                    backgroundColor: "#f8f8f8",
                    height: '100%',
                    maxWidth: '160px',
                },
                '&:nth-child(even)': {
                    height: '100%',
                    maxWidth: '160px',
                },
                '@media only screen and (max-width: 425px)': {
                    '&:first-child': {
                        maxWidth: '20px !important',
                        minWidth: '30px !important',
                        padding: '0 !important',
                        //  zIndex: 2
                    },
                    '&:nth-child(odd)': {
                        maxWidth: '20px',
                        minWidth: '50px',
                        padding: '0 !important',

                    },
                    '&:nth-child(even)': {
                        maxWidth: '20px',
                        minWidth: '50px',
                        padding: '0 !important',
                    },
                },
            },
        },
        cells: {
            style: {
                maxWidth: '160px',
                minWidth: '160px',
                padding: '5px',
                // paddingRight: '16px',
                fontSize: '10px',
                fontWeight: 600,
                '&:first-child': {
                    maxWidth: '20px !important',
                    minWidth: '70px',
                },
                '&:nth-child(odd)': {
                    backgroundColor: "#f8f8f8",
                    maxWidth: '160px',

                },
                '&:nth-child(even)': {
                    maxWidth: '160px',
                },
                'div[data-tag="allowRowEvents"]:nth-child(odd)': {
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                },
                '@media only screen and (max-width: 425px)': {
                    '&:first-child': {
                        maxWidth: '20px !important',
                        minWidth: '30px!important',
                        padding: '2px !important',
                        fontSize: '9px',
                    },
                    '&:nth-child(odd)': {
                        maxWidth: '20px',
                        minWidth: '50px',
                        padding: '2px !important',
                        alignItems: 'start',
                    },
                    '&:nth-child(even)': {
                        maxWidth: '20px',
                        minWidth: '50px',
                        padding: '2px !important',
                        alignItems: 'start',
                    },
                },
            },
        },
        contextMenu: {
            style: {
                fontSize: '18px',
                fontWeight: 400,
                paddingLeft: '16px',
                paddingRight: '8px',
                transform: 'translate3d(0, -100%, 0)',
                transitionDuration: '125ms',
                transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
                willChange: 'transform',
            },
            activeStyle: {
                transform: 'translate3d(0, 0, 0)',
            },
        },
    };

    const noData = () => (
        <div className="no-data-container">
            <img src={noDataImage} alt="No data found" className="no-data-image" />
        </div>
    );

    const bookingsDropdown = (slot: any) => {
        if (slot.booking_data[0].payment_status === 'Paid') {
            setBookingDetailsData(slot.booking_data[0]);
            setBookingDetailsModal(true);
        } else {

        }
    }

    const columns: any = [
        {
            name: '',
            selector: (row: any) => row.display_time,
            sortable: true,
            cell: (row: any, index: number) => <div style={{ position: 'absolute', top: index === 0 ? 0 : -8, right: 0, textAlign: 'center', background: '#f8f8f8', width: '100%' }}>{row.display_time}</div>,
            style: {
                maxWidth: '20px',
                fontSize: '12px',
                minWidth: '70px',
                position: 'sticky',
                left: 0,
                zIndex: 1,
                borderRight: '1px solid #EBEBEB',
            }
        },
        ...column.map((court, index) => ({
            name: court.label,
            selector: (row: any) => {
                const slot = row.slots.find((slot: any) => slot.name === court.label);
                const slotbookingzeroindex = slot?.booking_data[0]?.start_time === row.display_time;
                if (!slot) {
                    return null;
                }

                return slot.booked ? (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item key="view"
                                    onClick={() => { setBookingDetailsData(slot.booking_data[0]); setBookingDetailsModal(true); }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Icon icon="basil:eye-outline" height={18} width={18} style={{ paddingLeft: '5px' }} />
                                        <div> View Details</div>
                                    </div>
                                </Menu.Item >
                                <Menu.Item key="copy"
                                    onClick={() => { setSlot(slot); setAddBookingModal(true); }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Icon icon="basil:checked-box-outline" height={18} width={18} style={{ paddingLeft: '5px' }} />
                                        <div> Book Now </div>
                                    </div>
                                </Menu.Item>
                            </Menu>
                        }
                        trigger={['click']}
                    >
                        <div className="booking-container">
                            <div className={`booking-btn-container ${slotbookingzeroindex ? `${slot.booking_data[0].payment_status === 'Paid' ? 'booking-btn-container-success' : 'booking-btn-container-failed'}` : ''}`}>
                                <button onClick={(e) => {
                                    if (slot.booking_data[0].payment_status === 'Paid') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setBookingDetailsData(slot.booking_data[0]);
                                        setBookingDetailsModal(true);
                                    }
                                }} className={`${slot.booking_data[0].payment_status === 'Paid' ? 'booked-success' : 'booked'}`}>
                                    <div className='booking-btn'>
                                        <span className="booking-user-img-container">
                                            <img className="user-img" src={slot?.booking_data[0]?.user?.profile_url ? slot.booking_data[0]?.user?.profile_url : userimage} alt=""
                                                onClick={(e) => {
                                                    if (!matches) {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleshowUserProfile(slot?.booking_data[0]?.user)
                                                    }
                                                }}
                                            />
                                        </span>
                                        <span className="user">{slot?.booking_data[0]?.razor_id === 'Open Play Match' ? 'Open Play Match' : `${slot.booking_data[0].user?.firstname || ''} ${slot.booking_data[0].user?.lastname || ''}`.trim()}</span>
                                        {slot.booking_data[0].payment_status === 'Paid' ? <CheckCircleOutlined className="user-fonts" /> : <StopOutlined className="user-fonts" />}
                                    </div>
                                </button>
                            </div>
                            <div className={`booking-user-Name  ${slot.booking_data[0].payment_status === ' Paid' ? 'paid-user-Name' : 'unpaid-user-Name'}`}>{`${slot.booking_data[0].user?.firstname || ''} ${slot.booking_data[0].user?.lastname || ''}`.trim()}</div>
                        </div>
                    </Dropdown>
                // ) : slot?.break || slot?.closed || !slot?.active || moment(`${dateState} ${row?.display_time}`, 'YYYY-MM-DD HH:mm').isBefore(moment()) ? (
                ) : slot?.break || slot?.closed || !slot?.active ? (
                    <button onClick={() => { console.log("blocked slot") }} className={"blocked"}>
                        <div className='blocked-icon'><FieldTimeOutlined /></div>
                    </button>
                ) : (
                    <div className='select-check-btn'>
                        <button onClick={async () => { setSlot(slot); setAddBookingModal(true); }} className={"available"}>
                            <div className='booking-btn-select'>Select</div>
                            <Icon icon="gravity-ui:circle-check-fill" className="check-unselected" />
                        </button>
                        <div className='booking-btn-select-outside'>Select</div>
                    </div>
                );
            },
            style: {
                width: "160px",
            }
        }))
    ];

    return (
        <>
            <BookingDetails
                modaldata={bookingDetailsData}
                open={bookingDetailsModal}
                onCancel={bookingDetailsModalClose}
                courts={courts}
                setBookingDetailsModal={setBookingDetailsModal}
                getBookings={getBookings}
                onOk={() => { }}
                matches={matches}
                isbookedwithlastslot={bookingData?.[bookingData.length - 1]?.display_end_time == bookingDetailsData?.end_time ? true : false}
            />
            <NAddBookingModal
                visible={addBookingModal}
                modaldata
                onCancel={() => setAddBookingModal(false)}
                facility={facility}
                courts={courts}
                getBookings={getBookings}
                slot={slot}
                data={bookingData}
            />
            <DataTable
                columns={columns}
                data={data}
                customStyles={customBookingStyles}
                noDataComponent={noData()}
                fixedHeader
                fixedHeaderScrollHeight="68vh"
            />
            <UserDetails
                visible={showRegistrationModal}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                name="User Details"
                userData={userData}
            />
        </>
    );
};

export default BookingTable;
