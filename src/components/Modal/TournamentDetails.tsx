import { Modal } from 'antd';
import React, { useEffect, useState } from 'react'
import { Footer } from 'antd/es/layout/layout';
import userimage from '../../assets/icon/user.jpeg'
import moment from 'moment';
import { getUgtDetails } from '../apiFile/Service';
const TournamentDetails = ({ visible, name, onConfirm, onCancel, row }) => {
    const [UGTDetails, setUGTDetails] = useState<any>({});
    const loggedInUser = localStorage.getItem("auth");

    const customTitle = (
        <div className="custom-ant-modal-header">
            {name}
        </div>
    );

    const getUgtDetailsById = async () => {
        console.log("🚀 ~ file: TournamentDetails.tsx:19 ~ getUgtDetailsById ~ response:")
        const response = await getUgtDetails(loggedInUser, row?._id);
        setUGTDetails(response?.data?.tournament_details[0]);
    }

    useEffect(() => {
        if (row?.V3) {
            getUgtDetailsById();
        }
    }, [row])


    return (
        <Modal title={customTitle}
            visible={visible}
            onOk={onConfirm}
            onCancel={onCancel}
            footer={null}
            width={'700px'}
            className="custom-ant-modal registration-modal lable-content-width"
        >
            <div>

                <div className='grid-sec  border-bottom-light'>
                    <div className="grid-item-2 span-row-3 row-span-2">
                        <div className='facility-image'>
                            <img className='user-image' src={row?.V1 ? row?.image_url : row?.tournament_banner_img} />
                        </div>
                    </div>
                    <div className="grid-item-2">
                        <h4 className='info-label' >Event Name</h4>
                        <p className='info-value' >{row?.tournament_name}</p>
                    </div>
                    <div className="grid-item-1">
                        <h4 className='info-label' > Event Type </h4>
                        <p className='info-value' >{row?.V3 ? 'V3' : row?.tournament_category_ids?.length > 0 ? 'V2' : 'V1'}</p>
                    </div>
                    <div className="grid-item-1">
                        <h4 className='info-label' > Sport Type </h4>
                        <p className='info-value' >{row?.V1 ? (row?.tournament_type.includes('[') ? JSON.parse(row?.tournament_type).map((item: any) => item.label).join(", ") : row?.tournament_type) : row?.sport_name}</p>
                    </div>
                    {/* <div className="grid-item">
                        <h4 className='info-label' >Facility</h4>
                        <p className='info-value'>{row?.facility?.name}</p>
                        <p className='info-value'>{row?.facility?.contactInfo?.phone}</p>
                        <p className='info-value'>{row?.facility?.contactInfo?.email}</p>
                    </div> */}
                    <div className="grid-item">
                        <h4 className='info-label' >Venue</h4>
                        <p className='info-value' >{row?.V1 ? `${row?.venue?.name}` : row?.popup_venue_details?.address || 'N/A'}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Address</h4>
                        <p className='info-value' >{row?.V1 ? `${row?.venue?.location_city} ${row?.venue?.location_state}` : row?.popup_venue_details?.address || 'N/A'}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Registration Fee</h4>
                        <p className='info-value' >Per Person: {row?.V1 ? row?.registration_fee?.per_person : 'N/A'} <br /> Per Team: {row?.V1 ? row?.registration_fee?.per_team : 'N/A'}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Registered</h4>
                        <p className='info-value capi' >{row?.V1 ? `${row?.registered_players}/${row?.total_number_of_registration}` : 'N/A'}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Date</h4>
                        <p className='info-value text-break' >{moment(row?.start_date).format('DD/MM/YY')} - {moment(row?.end_date).format('DD/MM/YY')}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Time</h4>
                        <p className='info-value' >{row?.V1 ? `${row?.start_time} - ${row?.end_time}` : `${moment(row?.start_date).format('HH:mm')} - ${moment(row?.end_date).format('HH:mm')}`}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Last Date of Registration</h4>
                        <p className='info-value' >{moment(row?.last_day_for_registration).format('DD/MM/YY hh:mm A')}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Tags</h4>
                        <p className='info-value' >{row?.V1 ? (row?.tournament_tag || 'N/A') : row?.tag || 'N/A'}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Position </h4>
                        <p className='info-value' >{row?.position || 'N/A'}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Rewards </h4>
                        {row?.V1 ?
                            <p className='info-value' >{row?.rewards || 'N/A'}</p> :
                            <div className="compact-table-container">
                                <table className="compact-table">
                                    <thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Cash</th>
                                            <th>Ohers</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {row.tournament_reward?.map((item: any, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item?.rank}</td>
                                                    <td>{item?.cash}</td>
                                                    <td>{item?.others || 'N/A'}</td>
                                                </tr>
                                            )
                                        })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        }
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Sponsored By </h4>
                        <p className='info-value' >{row?.sponsor_by || 'N/A'}</p>
                    </div>
                    {row?.V3 &&
                        <div className="grid-item">
                            <h4 className='info-label' >Referee Details</h4>
                            <p className='info-value' >{UGTDetails?.referee_details?.fullName || 'N/A'}</p>
                        </div>}
                    <div className="grid-item">
                        <h4 className='info-label' >Tournament Formate </h4>
                        {/* <p className='info-value'>{row?.tournament_formate || 'N/A'}</p> */}
                        <p className='info-value' >{row?.V3 ? row?.tournament_formate : row?.tournament_category_ids?.length > 0 ? 'Multiple Category' : 'Single Category'}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Description </h4>
                        <p className='info-value' >{row?.tournament_description || 'N/A'}</p>
                    </div>


                    {row.tournament_category_ids?.length === 0 ?
                        <div className="grid-item col-span-3 col-span-3-sm-keep">
                            <h4 className='info-label' >Packages</h4>
                            <div className="compact-table-container">
                                <table className="compact-table">
                                    <thead>
                                        <tr>
                                            <th>Package Name</th>
                                            <th>Date</th>
                                            <th>No. of users</th>
                                            <th>No. of free registration</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {row.packages?.map((item: any, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item?.name}</td>
                                                    <td>{moment(item?.start_date).format('DD MMM')} - {moment(item?.end_date).format('DD MMM')}</td>
                                                    <td>{item?.number_of_users}</td>
                                                    <td>{item?.no_of_free_registration}</td>
                                                    <td>{item?.discount}</td>
                                                </tr>
                                            )
                                        })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        :
                        row?.V1 ? row.tournament_category_ids?.map((item: any, index) => {
                            return (
                                <div className="grid-item col-span-3 col-span-3-sm-keep">
                                    <h4 className='info-label' >Category - {index + 1}</h4>
                                    <div className="compact-table-container">
                                        <table className="compact-table" >
                                            <thead>
                                                <tr>
                                                    <th>Category Name</th>
                                                    <th>Date</th>
                                                    <th>Registered</th>
                                                    <th>Age Limit</th>
                                                    <th>Fee </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key={index}>
                                                    <td>{item?.ui_name_for_tournament}</td>
                                                    <td>{moment(item?.start_date).format('DD MMM')} - {moment(item?.end_date).format('DD MMM')}</td>
                                                    <td>{item?.category_user_registration}/{item?.max_registration}</td>
                                                    <td>{item?.above > 0 ? `Above:${item?.above}` : item?.under > 0 ? `Under:${item?.under}` : <>Above:{item?.above} <br /> Under:{item?.under}</>}</td>
                                                    <td>Per Person: {item?.registration_fee.per_person} <br /> Per Team: {item?.registration_fee.per_team}</td>

                                                </tr>
                                                <tr>
                                                    <td colSpan={5}>
                                                        <div className="grid-item col-span-3 col-span-3-sm-keep">
                                                            <h4 className='info-label text-left' >Packages</h4>
                                                            <div className="compact-table-container">
                                                                <table className="compact-table" >
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Package Name</th>
                                                                            <th>Date</th>
                                                                            <th>No. of users</th>
                                                                            <th>No. of free registration</th>
                                                                            <th>Price</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>

                                                                        {item.packages?.map((item: any, index) => {
                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td>{item?.name}</td>
                                                                                    <td>{moment(item?.start_date).format('DD MMM')} - {moment(item?.end_date).format('DD MMM')}</td>
                                                                                    <td>{item?.number_of_users}</td>
                                                                                    <td>{item?.no_of_free_registration}</td>
                                                                                    <td>{item?.discount}</td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        })
                            :
                            <div className="grid-item col-span-3 col-span-3-sm-keep">
                                {/* <h4 className='info-label' >Category - {index + 1}</h4> */}
                                <div className="compact-table-container">
                                    <table className="compact-table" >
                                        <thead>
                                            <tr>
                                                <th>Category Name</th>
                                                <th>Date</th>
                                                <th>Registered</th>
                                                <th>Age Limit</th>
                                                <th>Fee </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {UGTDetails?.category_details?.map((item: any, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item?.category_name[0] + ' ' + item?.category_name[1]}</td>
                                                        <td>{moment(item?.start_date).format('DD MMM')} - {moment(item?.end_date).format('DD MMM')}</td>
                                                        <td>{item?.registration_count}/{item?.max_registration}</td>
                                                        <td>{item?.above > 0 ? `${item?.above}` : item?.under > 0 ? `${item?.under}` : <>{item?.above} <br /> {item?.under}</>}</td>
                                                        <td>Per Person: {item?.registration_fee.per_person} <br /> Per Team: {item?.registration_fee.per_team}</td>

                                                    </tr>
                                                )
                                            }
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                    }
                </div>
            </div>
            <Footer className='ant-modal-footer'>
                <button
                    type="button"
                    className="pi-btn-secondary"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </Footer>
        </Modal>
    )
}

export default TournamentDetails