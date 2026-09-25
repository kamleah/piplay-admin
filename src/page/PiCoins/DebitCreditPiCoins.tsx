import React, { Fragment, useEffect, useState } from "react";
import { Card, Breadcrumb, Button, Dropdown, Menu, Tooltip } from "antd";
import { bookingApi, getAllPiCoinsTxnHistory, getAllUsers, getAllUsersByUserIDAPI,getAllUserslist} from "../../components/apiFile/Service";
import ToastMessage from "../facilator/ToastMessage/ToastMessage";
import { toast } from "react-toastify";
import _ from "lodash";
import moment from 'moment';
import FilterData from "../../components/Modal/FilterData";
import { Controller, useForm } from 'react-hook-form';
import { Icon } from "@iconify-icon/react";
import Table from "../../components/Table/DataTable";
import DebitCreditPiCoinsModal from "../../components/Modal/DebitCreditPiCoinsModal";
import DebitCreditDetails from "../../components/Modal/DebitCreditDetails";
import ClipLoader from "react-spinners/ClipLoader";

interface User {
    _id: string;
    firstname: string;
    lastname: string;
    mobileno: number;
    // Add any other user properties you might need
}

interface Transaction {
    userId: string;
    id: string;
    txnType: string;
    amount: number;
    newBalance: number;
    reference: string;
    createdOn: string;
    sport_type: string | string[];
}

const DebitCreditPiCoins = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {

    const [data, setData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const loggedInUser = localStorage.getItem("auth");
    const [showViewModal, setShowViewModal] = useState(false);
    const [rowdata, setRowdata] = useState({});
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [usersById, setUsersById] = useState<User[]>([]);
    const [txnType, setTxnType] = useState('');
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { register, watch, setValue, reset, control } = useForm();

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
            name: 'CreatedAt',
            selector: (row: any) => moment(row?.createdOn).format("DD-MM-YYYY"),
            sortable: true,
        },
        {
            name: 'UserId',
            selector: row => row?.userId,
            wrap: true,
            sortable: false,
        },
        {
            name: 'Transaction Id',
            selector: row => row?.id,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Username',
            selector: row => {
                if (!row || !row.userId) {
                    return 'N/A'; // Return 'N/A' if row is undefined or userId is not present
                }
                const user = usersById.find(user => user._id === row.userId);
                return user ? `${user.firstname} ${user.lastname}` : 'N/A'; // Return 'N/A' if user not found
            },
            sortable: true,
            wrap: true,
        },
        {
            name: 'Transaction Type',
            selector: row => row?.txnType,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Phone Number',
            selector: row => {
                if (!row || !row.userId) {
                    return 'N/A'; // Return 'N/A' if row is undefined or userId is not present
                }
                const user = usersById.find(user => {
                  
                    return user._id === row.userId; // Ensure types match
                });
        
                if (!user) {
                    return 'N/A'; // Return 'N/A' if user not found
                }
        
                return user.mobileno || 'N/A'; // Return 'N/A' if mobileno is not present
            },
            sortable: true,
            wrap: true,
        },
        {
            name: 'Current Balance',
            selector: row => row?.newBalance - row?.amount,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Amount Added/Deducted',
            selector: row => row?.amount,
            sortable: true,
            wrap: true,
            cell: row => (<span className={row?.txnType == "CREDIT" ? "success-message" : "error-message"}>{row?.txnType == "CREDIT" ? "+" : "-"}{row?.amount}</span>),
        },
        {
            name: 'New Balance',
            selector: row => row?.newBalance,
            sortable: true,
        },
        {
            name: 'Reward Type',
            selector: row => row?.reference,
            sortable: true,
        },


        {
            name: 'Source',
            selector: row => typeof row?.sport_type == 'string' ? row?.sport_type : row?.sport_type?.map((item: any) => item).join(' & '),
            sortable: true,
        },
        {
            name: 'Actions',
            selector: row => row?.year,
            sortable: true,
            wrap: true,
            cell: row =>
                <div className='action-button-container'>
                    <Dropdown
                        overlay={
                            <Menu>
                                {modulePermissionsData?.view && (
                                    <Menu.Item key="view">
                                        <button
                                            className="action-button view-button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleshowRegistrationModal(row, 'view');
                                            }}
                                        >
                                            <Tooltip title="View" placement="left">
                                                <Icon icon="raphael:view" />
                                            </Tooltip>
                                        </button>
                                    </Menu.Item>
                                )}
                                {modulePermissionsData?.delete && (
                                    <Menu.Item key="copy">
                                        <button
                                            className="action-button delete-button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                copyToClipboard(row);
                                            }}
                                        >
                                            <Tooltip title="Copy" placement="left">
                                                <Icon icon="solar:copy-bold" height={18} width={18} style={{ paddingLeft: '5px' }} />
                                            </Tooltip>
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
                </div >
            ,
        },
    ];

    const handleshowRegistrationModal = async (row: any, type: any) => {
        setRowdata(row);
        if (type == 'view') {
            setShowViewModal(true);
        } else {
            setShowViewModal(false);
            setShowAddEditModal(false);
        }
    };

    const handleCancel = () => {
        setShowViewModal(false);
        setShowAddEditModal(false);
    };

    const getAllData = async () => {
        let allData: any = [];
        let page = 0;
        let response;

        do {
            response = await getAllPiCoinsTxnHistory({
                "page": page
            });

            // Check if there is data in the response
            const history = response?.message?.data?.history;

            if (history && history.length > 0) {
                allData = allData.concat(history); // Add the current page's data to allData
                page++; // Increment the page number
            } else {
                break; // Exit the loop if no more data
            }
        } while (true);
        setLoading(false);
        allData.sort((a, b) => moment(b.createdOn).diff(moment(a.createdOn)));
        setData(allData); // Set the combined data to state
        // for (const transaction of allData) {
        //     await getAllUserByUserID(transaction); // Call the function with each userId
        // }
        await AllUserslist();

    }


    const AllUserslist = async () => {
        const limit = 300; // Set your limit here
        let page = 1;
        let allUsers: User[] = [];
        let response;
        const loggedInUser  = localStorage.getItem("auth")!
    
        do {
            response = await getAllUserslist(loggedInUser , page, limit);
            console.log("getBookingsApi reposne", response);
            
            const users = response?.data?.map((data) => ({
                _id: data._id,
                firstname: data?.firstname,
                lastname: data?.lastname,
                mobileno: data?.mobileno,
            }));
    
            if (users && users.length > 0) {
                allUsers = allUsers.concat(users);
                page++;
            } else {
                break;
            }
        } while (true);
    
        setUsersById(allUsers);
        console.log("bookingApi", allUsers);
        
    };



    const getAllUserByUserID = async (data) => {
        let UserId = data.userId;

        // Check if user data already exists
        const userExists = usersById.some(user => user._id === UserId); // Assuming user has an 'id' property
        if (userExists) {
            return; // Skip the API call
        }

        console.log(UserId);
        let response = await getAllUsersByUserIDAPI(loggedInUser, UserId);
        if (response.error === false) {
            const userData = response?.data;
            setUsersById((prevUsers) => [...prevUsers, userData]);
            console.log("response all users by", [...usersById, userData]); // Log the updated list
        } else {
            console.log(response.error);
        }
    }

    const getAllUsersList = async () => {
        let response = await getAllUsers(loggedInUser);
        let venues = response?.data?.map((data) => {
            return {
                label: `${data.firstname} ${data.lastname}`,
                value: data?._id,
                data: data
            };
        });
        setUserList(venues);
    };

    useEffect(() => {
        getAllData();
        getAllUsersList();
    }, [])


    const applyFilters = () => {
        const fullName = watch('fullname');
        const userId = watch('UserId');
        const phone = watch('phone');
        let filtered = [...data]

        if (fullName) {
            console.log("fullname =======", fullName);
            const searchQuery = fullName.toLowerCase();
            filtered = filtered.filter(item => {
                const user = usersById.find(user => user._id === item.userId);
                if (!user) return false; // or return true, depending on your desired behavior
                const firstName = user?.firstname?.toLowerCase();
                const lastName = user?.lastname?.toLowerCase();
                if (!firstName && !lastName) return false; // or return true, depending on your desired behavior
                return (
                    (firstName && firstName.includes(searchQuery)) ||
                    (lastName && lastName.includes(searchQuery)) ||
                    `${firstName} ${lastName}`.includes(searchQuery)
                );
            });
        }

        if (userId) {
            filtered = filtered.filter(item => item.userId.toString() === userId);
        }

        if (phone) {
            filtered = filtered.filter(item => {
                const user = usersById.find(user => user._id === item.userId);
                return user ? user.mobileno.toString() === phone : false;
            });
        }

        if (filtered.length === 0) {
            toast(<ToastMessage body={"No Data Found"} type="error" />, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setFilteredData([]);
        } else {
            setFilteredData(filtered);
        }

    }




    const clearFilters = () => {

        setFilteredData(data);
        reset({ 
            fullname: "",
            userId: "",
            phone: "",

         });
    };



    const FilterSection = () => (
        <>
            <div className="filter-form">
                <div className={`${matches ? "filter-section border-bottom-light" : "filter-fields"}`}>
                <div className="input-group">
                        <label htmlFor="UserId" className="form-label">User Id</label>
                        <div className="form-group">
                            <input
                                className="form-field"
                                type="text"
                                id="UserId"
                                placeholder="Enter user id"
                                {...register("UserId")}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="fullname" className="form-label">FullName</label>
                        <div className="form-group">
                            <input
                                className="form-field"
                                type="text"
                                id="fullname"
                                placeholder="Enter name"
                                {...register("fullname")}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="fullname" className="form-label">Phone</label>
                        <div className="form-group">
                            <input
                                className="form-field"
                                type="text"
                                id="phone"
                                placeholder="Enter no"
                                {...register("phone")}
                            />
                        </div>
                    </div>

                </div>
                {!matches && <div className="filter-buttons-row">
                    <Button className="pi-btn-primary" key="confirm" type="primary" onClick={applyFilters}>Apply</Button>
                    <Button
                        className="pi-btn-secondary"
                        key="cancel"
                        onClick={clearFilters}
                    >
                        Clear
                    </Button>

                </div>}
            </div>
            {matches && <div className="filter-buttons-row">
                <Button className="pi-btn-primary" key="cancel" type="primary" onClick={applyFilters}>Apply</Button>
                <Button
                    className="pi-btn-secondary"
                    key="cancel"
                    onClick={clearFilters}
                >
                    Clear
                </Button>

            </div>}
        </>
    );

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
                                title: "Pi Coins",
                            },
                            {
                                title: "Debit / Credit Pi Coins",
                            }
                        ]}
                    />}
                    <form className="">
                        <div className="main-title-container">
                            <div className="title-add-mobile">
                                <h5 className="main-content-title">Debit/Credit Pi Coins</h5>
                                {matches && modulePermissionsData?.add &&
                                    <>
                                        <Button
                                            className="pi-btn-primary"
                                            key="confirm" type="primary"
                                            onClick={() => { setTxnType('Credit'); setShowAddEditModal(true) }}
                                        >
                                            Credit Pi Coins
                                        </Button>
                                        <Button
                                            className="pi-btn-secondary"
                                            key="confirm" type="primary"
                                            onClick={() => { setTxnType('Debit'); setShowAddEditModal(true) }}
                                        >
                                            Debit Pi Coins
                                        </Button>
                                    </>
                                }
                            </div>
                            <div className='title-buttons'>

                                {!matches && modulePermissionsData?.add &&
                                    <>
                                        <Button
                                            className="pi-btn-primary"
                                            key="confirm" type="primary"
                                            onClick={() => { setTxnType('Credit'); setShowAddEditModal(true) }}
                                        >
                                            Credit Pi Coins
                                        </Button>
                                        <Button
                                            className="pi-btn-secondary"
                                            key="confirm" type="primary"
                                            onClick={() => { setTxnType('Debit'); setShowAddEditModal(true) }}
                                        >
                                            Debit Pi Coins
                                        </Button>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="main-content-card">
                            <div className="filter-section-container">
                                {matches &&
                                    <div className="filter-section-container">
                                        <FilterData content={FilterSection} open={open} handleOpenChange={handleOpenChange} />
                                    </div>
                                }
                            </div>
                            {!matches &&
                                <FilterSection />
                            }
                            {
                                loading ?
                                    <div className="loader-container">
                                        <ClipLoader
                                            color={"#F17121"}
                                            loading={loading}
                                            size={150}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        />
                                    </div>
                                    :
                                    <Table
                                        columns={columns}
                                        data={filteredData.length > 0 ? filteredData : data}
                                    />
                            }
                        </div>
                    </form>
                </Card>
                <DebitCreditDetails
                    visible={showViewModal}
                    onCancel={handleCancel}
                    name={`Pi Coins ${txnType} Details`}
                    row={rowdata}
                />
                <DebitCreditPiCoinsModal
                    visible={showAddEditModal}
                    onCancel={handleCancel}
                    row={rowdata}
                    txnType={txnType}
                    userList={userList}
                    setTxnType={setTxnType}
                    setRow={setRowdata}
                    getAllData={getAllData}
                />
            </div >

        </Fragment >
    );
};
export default DebitCreditPiCoins;
