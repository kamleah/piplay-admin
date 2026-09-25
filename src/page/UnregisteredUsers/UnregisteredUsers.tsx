import { Button, Card, Breadcrumb } from 'antd';
import React, { useState, useEffect, Fragment } from 'react';
import Table from '../../components/Table/DataTable';
import { Icon } from '@iconify-icon/react';
import { getAllUnregisteredUsersAPI } from '../../components/apiFile/Service';
import UserLabel from "../../components/Labels/UserLabel";
import StatusLabel from "../../components/Labels/StatusLabel";
import moment from "moment";
import CopyToClipboard2 from '../../components/CopyToClipboard/CopyToClipboart2';

interface UnregisteredUsersProps {
    matches: boolean;
    menuOpen: boolean;
    onToggle: () => void;
    modulePermissionsData: {
        view: boolean;
        edit: boolean;
        add: boolean;
    };
}
function UnregisteredUsers({ matches, menuOpen, onToggle, modulePermissionsData }: UnregisteredUsersProps) {
    const [data, setData] = useState([]);
    const loggedInUser = localStorage.getItem("auth");

    const getAllUnregisteredUsers = async (user) => {
        const response = await getAllUnregisteredUsersAPI(user);
        console.log(response);

        setData(response.data);
    }


    useEffect(() => {
        getAllUnregisteredUsers(loggedInUser);
    }, []);


    const columns = [
        {
            name: "Regn.ID",
            selector: row => row?._id,
            sortable: true,
            wrap: true,
        },
        {
            name: "Players",
            selector: row => row?.user?.firstname + ' ' + row?.user?.lastname + ' ' + row?.partner?.firstname + ' ' + row?.partner?.lastname,
            sortable: true,
            wrap: true,
            cell: row =>
                <div style={{ width: '100%' }}>
                    <CopyToClipboard2 textToCopy={row?.user?.firstname + ' ' + row?.user?.lastname} textColor="#353535" />
                    <CopyToClipboard2 textToCopy={row?.user?.mobileno} />
                    <CopyToClipboard2 textToCopy={row?.user?.email} />
                </div>
        },
        {
            name: 'Partner',
            selector: row => {
                let partnerName = row?.source == 'website' ?
                    row?.tournaments_players.length == 0 ? 'NA' : `${row?.tournaments_players[0].name} ${row?.tournaments_players[0].lastName}`
                    : row?.partner_from == 'invite' ? row?.partner?.name
                        : (row?.partner?.firstname || "") + " " + (row?.partner?.lastname || "");
                return partnerName?.trim() === "" ? "N/A" : partnerName;
            },
            sortable: true,
            wrap: true,
            cell: row => (
                <div style={{ width: '100%' }}>
                    <CopyToClipboard2 textToCopy={(() => {
                        let partnerName;
                        if (row?.source === 'website') {
                            partnerName = row?.tournaments_players?.length > 0 ? `${row?.tournaments_players[0]?.name} ${row?.tournaments_players[0]?.lastName}` : 'N/A';
                        } else if (row?.partner_from === 'invite') {
                            partnerName = row?.partner?.name || 'N/A';
                        } else {
                            partnerName = `${row?.partner?.firstname || ''} ${row?.partner?.lastname || ''}`.trim();
                        }

                        return partnerName === '' ? 'N/A' : partnerName;
                    })()}
                        textColor="#353535"
                    />
                    <CopyToClipboard2 textToCopy={(() => {
                        let mobileno;
                        if (row?.source === 'website') {
                            mobileno = row?.tournaments_players?.length > 0 ? `${row?.tournaments_players[0]?.phone_number}` : 'N/A';
                        } else if (row?.partner_from === 'invite') {
                            mobileno = row?.partner?.mobileno || 'N/A';
                        } else {
                            mobileno = row?.partner?.mobileno
                        }

                        return mobileno === '' ? 'N/A' : mobileno;
                    })()} />
                    <CopyToClipboard2 textToCopy={row?.partner?.email} />
                </div>
            )

        },
        {
            name: 'Partner Status',
            selector: row => row?.partner_status ?? 'N/A',
            sortable: true,
            wrap: true,
            cell: row => <div className='playerContainer'>
                {row?.partner_status ?
                    <span style={{ color: 'green' }}>{row?.partner_status}</span>
                    :
                    <span style={{ color: 'Blue' }}>Solo</span>
                }
            </div>,
        },
        {
            name: "Booking Date",
            selector: row => {
                const originalDate = row?.createdAt;
                const parsedDate = moment(originalDate);
                const formattedDate = parsedDate.utcOffset(0).format('DD-MM-YYYY');
                return formattedDate;
            },
            sortable: true,
            wrap: true,
        },
        {
            name: "Event Details",
            selector: row => row?.tournament?.tournament_name + ' ' + row?.tournament?.start_date,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Venue',
            selector: row => row?.venue?.name ?? 'N/A',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Organizer',
            selector: row => row?.organizer?.name ?? 'N/A',
            sortable: true,
            wrap: true,
        },
        {
            name: "Category",
            selector: row => row?.tournament?.tournament_type.charAt(0)?.toUpperCase() + row?.tournament?.tournament_type.slice(1),
            sortable: true,
            wrap: true,
            cell : row =>
                <div>
                   {/* {row?.main_category?.ui_name_for_tournament ? row?.main_category?.ui_name_for_tournament : "N/A"} */}
                   {/* <br /> */}
                   {row?.tournament?.tournament_type.includes('[') ? JSON.parse(row?.tournament?.tournament_type).map((item: any, index: number) => (index > 0 ? ', ' + item.label : item.label)): row?.tournament?.tournament_type }
                </div>
        },
        {
            name: "Razor Order ID",
            selector: row => (row?.razorpay_order_id || 'N/A'),
            sortable: true,
            wrap: true
        },
        {
            name: "Refund ID",
            selector: row => row?.refund_id || 'N/A',
            sortable: true,
            wrap: true,
        },
        {
            name: "Payment ID",
            selector: row => row?.payment_id,
            sortable: true,
            wrap: true,
        },
        {
            name: "Refund Amount",
            selector: row => row?.total_amount,
            sortable: true,
            wrap: true,
        },
        {
            name: '',
            selector: row => row.year,
            sortable: true,
            wrap: true,
            // cell: row =>
            // (
            //     <div className='action-button-container'>
            //         <Icon icon="raphael:view" />

            //     </div >
            // )


            // ,
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
                            { title: "Events" },
                            { title: "Unregistered Users" },

                        ]}
                    />}
                    <div className="main-title-container">
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">Refunded and Unregistered users</h5>
                            {/* <div className="main-content-title" style={{ backgroundColor: 'yellow', fontSize: '12px', color: 'black', padding: '0 10px 0 10px', borderRadius: '16px' }}>
                                In Progress</div> */}


                        </div>

                    </div>
                    <div className="main-content-card">
                        <div className='mt-5'>
                            <Table
                                columns={columns}
                                data={data}
                            />
                        </div>
                    </div>


                </Card>
            </div>
        </Fragment>
    )
}

export default UnregisteredUsers;