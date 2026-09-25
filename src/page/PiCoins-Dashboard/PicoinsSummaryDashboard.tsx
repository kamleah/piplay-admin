import React, { Fragment, useEffect, useState } from 'react';
import Table from '../../components/Table/DataTable';
import moment from 'moment';
import {
    getAllPiCoinsSummary, getAllTotalPiCoins,
    getPicoinSummaryByuserId, getAllUsers,
} from "../../components/apiFile/Service";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Icon } from "@iconify-icon/react";
import FilterData from '../../components/Modal/FilterData';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { Row, Col, Typography, Space, Card, Breadcrumb, Button, Radio, RadioChangeEvent } from "antd";
import CustomDateRangePicker from "../../components/Modal/CustomDateRangePicker";
import ToastMessage from "../facilator/ToastMessage/ToastMessage";
import { toast } from "react-toastify";
import { Grid, Paper, Box, MenuItem, LinearProgress } from "@mui/material";
import { EyeOutlined, LineChartOutlined } from '@ant-design/icons';
import picoin from "../../assets/icon/picoin.png";
import noDataImage from "../../assets/icon/no_result.png";

interface TotalPicoins {
    total_picoins: number;
    total_credited: number;
    total_debited: number;
    total_balance: number;
    total_txns: number,
    reference: string,

}

function PicoinsSummaryDashboard({ matches, menuOpen, onToggle, modulePermissionsData }) {
    const { register, watch, setValue, reset, control } = useForm();
    const [picoinsUserData, setPicoinsUserData] = useState<any | null>(null);
    const [totalPicoins, setTotalPicoins] = useState<TotalPicoins | null>(null);
    const [totalPicoinsSummary, setTotalPicoinsSummary] = useState<any | null>(null);
    const [filteredSummaryData, setFilteredSummaryData] = useState<any | null>([]);
    const [data, setData] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<any>([]);
    const [getUserId, setGetUserId] = useState<any>('');
    const [userList, setUserList] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const animatedComponents = makeAnimated();
    const awardCategory = watch('awardCategory');
    const userId = watch('UserId')
    const userNo = watch('UserNumber')
    const loggedInUser = localStorage.getItem("auth");

    const { Text, Title } = Typography;


    const [selectedDateRange, setSelectedDateRange] =
        useState("Select Date Range");
    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    const [open, setOpen] = useState(false);
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    const [openCategory, setOpenCategory] = useState(false);
    const handleOpenCategoryChange = (newOpen: boolean) => {
        setOpenCategory(newOpen);
    };


    const [openUser, setOpenUser] = useState(false);
    const handleOpenUserChange = (newOpen: boolean) => {
        setOpenUser(newOpen);
    };


    const handleCancel = () => {
        setShowViewModal(false);
    };

    const handleUserChange = (selectedUser) => {
        setSelectedUsers(selectedUser);
    }



    const stats: any = [
        {
            title: 'Total Pi Coins Generated Till Date',
            value: totalPicoins ? totalPicoins.total_picoins : 0,
            icon: <img src={picoin} style={{ width: '28px', height: '28px' }} alt="PiCoin" />,
            change: '+8.02%',
        },
        {
            title: 'Total Pi Coins Spent In The System',
            value: totalPicoins ? totalPicoins.total_debited : 0,
            icon: <img src={picoin} style={{ width: '28px', height: '28px' }} alt="PiCoin" />,
            change: '+8.02%',
        },
        {
            title: 'Total Pi Coins left in the System',
            value: totalPicoins ? totalPicoins.total_credited : 0,
            icon: <img src={picoin} style={{ width: '28px', height: '28px' }} alt="PiCoin" />,
            change: '+8.02%',
        },
        {
            title: 'Total transactions',
            value: totalPicoins ? totalPicoins.total_txns : 0,
            icon: <img src={picoin} style={{ width: '28px', height: '28px' }} alt="PiCoin" />,
            change: '+8.02%',
        },
        // {
        //     title: 'Cash Back',
        //     value: 1200,
        //     icon: '🪙',
        //     change: '+8.02%',
        // },
        // {
        //     title: 'Referral Rewards',
        //     value: 1582,
        //     icon: '🪙',
        //     change: '+8.02%',
        // },
    ];

    const stats2: any = [
        {
            title: 'Total Pi Coins',
            value: (awardCategory && filteredSummaryData && filteredSummaryData.total_balance !== undefined) ? filteredSummaryData.total_balance : 0,
            icon: <img src={picoin} style={{ width: '28px', height: '28px' }} alt="PiCoin" />,
            change: '+8.02%',
        },
        {
            title: 'Total Pi coins Debited',
            value: (awardCategory && filteredSummaryData && filteredSummaryData.total_debited !== undefined) ? filteredSummaryData.total_debited : 0,
            icon: <img src={picoin} style={{ width: '28px', height: '28px' }} alt="PiCoin" />,
            change: '+8.02%',
        },
        {
            title: 'Total Pi Coins Credited',
            value: (awardCategory && filteredSummaryData && filteredSummaryData.total_credited !== undefined) ? filteredSummaryData.total_credited : 0,
            icon: <img src={picoin} style={{ width: '28px', height: '28px' }} alt="PiCoin" />,
            change: '+8.02%',
        },
        {
            title: 'Total transactions',
            value: (awardCategory && filteredSummaryData && filteredSummaryData.total_txns !== undefined) ? filteredSummaryData.total_txns : 0,
            icon: <img src={picoin} style={{ width: '28px', height: '28px' }} alt="PiCoin" />,
            change: '+8.02%',
        },
        // {
        //     title: 'Cash Back',
        //     value: 1200,
        //     icon: '🪙',
        //     change: '+8.02%',
        // },
        // {
        //     title: 'Referral Rewards',
        //     value: 1582,
        //     icon: '🪙',
        //     change: '+8.02%',
        // },
    ];

    const stats3: any = [
        {
            title: 'Total Pi Coins',
            value: (awardCategory && filteredSummaryData && filteredSummaryData.total_balance !== undefined) ? filteredSummaryData.total_balance : 0,
            icon: <img src={picoin} style={{ width: '28px', height: '28px' }} alt="PiCoin" />,
            change: '+8.02%',
        },
        {
            title: 'Total Pi coins Debited',
            value: (awardCategory && filteredSummaryData && filteredSummaryData.total_debited !== undefined) ? filteredSummaryData.total_debited : 0,
            icon: <img src={picoin} style={{ width: '28px', height: '28px' }} alt="PiCoin" />,
            change: '+8.02%',
        },
        {
            title: 'Total Pi Coins Credited',
            value: (awardCategory && filteredSummaryData && filteredSummaryData.total_credited !== undefined) ? filteredSummaryData.total_credited : 0,
            icon: <img src={picoin} style={{ width: '28px', height: '28px' }} alt="PiCoin" />,
            change: '+8.02%',
        },
        {
            title: 'Total transactions',
            value: (awardCategory && filteredSummaryData && filteredSummaryData.total_txns !== undefined) ? filteredSummaryData.total_txns : 0,
            icon: <img src={picoin} style={{ width: '28px', height: '28px' }} alt="PiCoin" />,
            change: '+8.02%',
        },
        // {
        //     title: 'Cash Back',
        //     value: 1200,
        //     icon: '🪙',
        //     change: '+8.02%',
        // },
        // {
        //     title: 'Referral Rewards',
        //     value: 1582,
        //     icon: '🪙',
        //     change: '+8.02%',
        // },
    ];

    const awardOptions = totalPicoinsSummary?.map(item => ({
        label: item.reference,
        value: item.reference,
    }));

    useEffect(() => {
        if (totalPicoinsSummary && awardCategory) {
            const SummaryData = totalPicoinsSummary.find((item) => item.reference === awardCategory.value);
            setFilteredSummaryData(SummaryData);
        }
    }, [totalPicoinsSummary, awardCategory]);


    const payload = {
        "UserId": "",
        "startDate": "",
        "endDate": ""
    }

    const payload2 = {
        "userId": selectedUsers.value || getUserId,
        "startDate": "",
        "endDate": ""
    }

    const getUsers = async () => {
        let response = await getAllUsers(loggedInUser);
        if (response) {

        }
        let users = response?.data?.map((data) => {
            return {
                label: `${data.firstname} ${data.lastname}`,
                value: data?._id,
                mobileno: data?.mobileno ? data?.mobileno.toString() : ""

            };
        });
        // console.log(" file: ~ users ~ users:", users)
        setUserList(users);

    };



    const getTotalPicoinsData = async (data) => {
        let response = await getAllTotalPiCoins(data)
        if (response) {
            setTotalPicoins(response.message.data.total)
        }
    }

    const getPicoinsSummaryData = async (data) => {
        let response = await getAllPiCoinsSummary(data)
        if (response) {
            setTotalPicoinsSummary(response.message.data.summary)
        }
    }

    const getPicoinsSummaryUserData = async (data) => {

        let response = await getPicoinSummaryByuserId(data)
        if (response.message.data.summary.length === 0) {
            toast(<ToastMessage body={"No Data Found"} type="error" />, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }

        else {
            setPicoinsUserData(response.message.data.summary)
        }
    }


    useEffect(() => {
        getTotalPicoinsData(payload)
        getPicoinsSummaryData(payload)
        // getPicoinsSummaryUserData(payload2)
    }, []);


    const handleDateChange = (newDateRange) => {
        setDate(newDateRange);
        const startDate = newDateRange[0].startDate;
        const endDate = newDateRange[0].endDate;
        setValue("start", moment(startDate).format("YYYY/MM/DD"));
        setValue("end", moment(endDate).format("YYYY/MM/DD"));
        setSelectedDateRange(
            `${moment(startDate).format("DD/MM/YYYY")} - ${moment(endDate).format(
                "DD/MM/YYYY"
            )}`
        );
    };



    const applyFilters = async () => {
        const startDate = watch("start");
        const endDate = watch("end");
        const formattedStartDate = moment(startDate).format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
        const formattedEndDate = moment(endDate).format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
        const payload = {
            UserId: "",
            startDate: formattedStartDate,
            endDate: formattedEndDate,
        }

        let response = await getAllTotalPiCoins(payload)

        if (response.length === 0) {
            toast(<ToastMessage body={"No Data Found"} type="error" />, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            getTotalPicoinsData(payload)
        } else {
            setTotalPicoins(response.message.data.total);
        }

    };


    const onClearDateRange = () => {
        setDate([
            {
                startDate: new Date(),
                endDate: new Date(),
                key: "selection",
            },
        ]);
        setSelectedDateRange("Select Date Range");
        setValue("start", "");
        setValue("end", "");
    };


    const clearFilters = () => {
        onClearDateRange();
        getTotalPicoinsData(payload);

    };

    useEffect(() => {
        getUsers();
    }, [])


    const FilterSection = () => {
        return (
            <>
                <div className="filter-form">
                    <div
                        className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"
                            }`}
                    >
                        <div className="input-group">
                            <label htmlFor="event" className="form-label">
                                {" "}
                                Date Range{" "}
                            </label>
                            <div className="form-group">
                                <CustomDateRangePicker
                                    date={date}
                                    onDateChange={handleDateChange}
                                    selectedDateRange={selectedDateRange}
                                    onClearDateRange={onClearDateRange}
                                />
                            </div>
                        </div>
                    </div>
                    {!matches && (
                        <div className="filter-buttons-row">
                            <Button
                                className="pi-btn-primary"
                                key="confirm"
                                type="primary"
                                onClick={() => {
                                    applyFilters()
                                }}
                            >
                                Apply
                            </Button>
                            <Button
                                className="pi-btn-secondary"
                                key="cancel"
                                onClick={() => {
                                    clearFilters()
                                }}
                            >
                                {" "}
                                Clear
                            </Button>
                        </div>
                    )}
                </div>
                {matches && (
                    <div className="filter-buttons-row">
                        <Button
                            className="pi-btn-primary"
                            key="confirm"
                            type="primary"
                            onClick={() => {
                                applyFilters()
                            }}
                        >
                            Apply
                        </Button>
                        <Button
                            className="pi-btn-secondary"
                            key="cancel"
                            onClick={() => {
                                clearFilters()
                            }}
                        >
                            {" "}
                            Clear
                        </Button>
                    </div>
                )}
            </>
        );
    };


    const FilterSection2 = () => {
        return (
            <>
                <div className="filter-form">
                    <div
                        className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"
                            }`}
                    >
                        <div className="input-group">
                            <label htmlFor="awardCategory" className="form-label">Category</label>
                            <div className="form-group">
                                <Controller
                                    name="awardCategory"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            className="controller-select"
                                            components={animatedComponents}
                                            options={awardOptions}
                                            placeholder="Select a category"
                                            {...field} // This automatically includes 'value' and 'onChange'
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    {!matches && (
                        <div className="filter-buttons-row">
                            {/* <Button
                                className="pi-btn-primary"
                                key="confirm"
                                type="primary"

                            >
                                Apply
                            </Button> */}
                            <Button
                                className="pi-btn-secondary"
                                key="cancel"
                                onClick={() => {
                                    reset({
                                        awardCategory: '',
                                    });
                                }}
                            >
                                {" "}
                                Clear
                            </Button>
                        </div>
                    )}
                </div>
                {matches && (
                    <div className="filter-buttons-row">
                        {/* <Button
                            className="pi-btn-primary"
                            key="confirm"
                            type="primary"

                        >
                            Apply
                        </Button> */}
                        <Button
                            className="pi-btn-secondary"
                            key="cancel"
                            onClick={() => {
                                reset({
                                    awardCategory: '',
                                });
                            }}
                        >
                            {" "}
                            Clear
                        </Button>
                    </div>
                )}
            </>
        );
    };

    const FilterSection3 = () => {
        return (
            <>
                <div className="filter-form">
                    <div
                        className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"
                            }`}
                    >
                        {/* <div className="input-group">
                                            <label htmlFor="UserNumber" className="form-label">User Mobile No</label>
                                            <div className="form-group">
                                                <input
                                                    className="form-field"
                                                    type="text"
                                                    id="UserNumber"
                                                    placeholder="Enter Mobile no"
                                                    {...register('UserNumber')}
                                                />
                                            </div>
                                        </div> */}
                        <div className="input-group" >
                            <label htmlFor="users">Select Users</label>
                            <div className="form-group">
                                <Controller
                                    name="user_ids"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            closeMenuOnSelect={false}
                                            className="controller-select"
                                            components={animatedComponents}
                                            //  isMulti
                                            options={userList}
                                            {...field}
                                            value={selectedUsers}
                                            onChange={handleUserChange}

                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 'bolder' }}>
                            Total Balance: {picoinsUserData && picoinsUserData.length > 0 ? picoinsUserData.map(item => item.total_balance).reduce((acc, curr) => acc + curr, 0) : 0}
                        </div>
                    </div>
                    {!matches && (
                        <div className="filter-buttons-row">
                            <Button
                                className="pi-btn-primary"
                                key="confirm"
                                type="primary"
                                onClick={() => {
                                    getPicoinsSummaryUserData(payload2)
                                }}
                            >
                                Apply
                            </Button>
                            <Button
                                className="pi-btn-secondary"
                                key="cancel"
                                onClick={() => {
                                    reset({
                                        userNo: '',
                                        UserNumber: ''
                                    });
                                    setPicoinsUserData(null);
                                    setSelectedUsers([])
                                }}
                            >
                                {" "}
                                Clear
                            </Button>
                        </div>
                    )}
                </div>
                {matches && (
                    <div className="filter-buttons-row">
                        <Button
                            className="pi-btn-primary"
                            key="confirm"
                            type="primary"
                            onClick={() => {
                                getPicoinsSummaryUserData(payload2)
                            }}
                        >
                            Apply
                        </Button>
                        <Button
                            className="pi-btn-secondary"
                            key="cancel"
                            onClick={() => {
                                reset({
                                    userNo: '',
                                    UserNumber: ''
                                });
                                setPicoinsUserData(null);
                                setSelectedUsers([])
                            }}
                        >
                            {" "}
                            Clear
                        </Button>
                    </div>
                )}
            </>
        );
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
                                title: "Analytics",
                            },
                            {
                                title: "PiCoins Summary",
                            },

                        ]}
                    />}
                    <div className="main-title-container">
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">Total Pi Coins Summary</h5>
                        </div>


                    </div>

                    {/*/----------------------------------part1----------------------------------------------------------
                    ------------------------------------------------------------------------------------------------- */}
                    <div className="filter-section-container">
                        {matches &&
                            <div className="filter-section-container">
                                <FilterData content={FilterSection2} open={openCategory} handleOpenChange={handleOpenCategoryChange} />
                            </div>
                        }
                    </div>
                    {!matches &&
                        <div className="main-content-card">
                            <>
                                <div className="filter-form">
                                    <div
                                        className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"
                                            }`}
                                    >
                                        <div className="input-group">
                                            <label htmlFor="awardCategory" className="form-label">Category</label>
                                            <div className="form-group">
                                                <Controller
                                                    name="awardCategory"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            className="controller-select"
                                                            components={animatedComponents}
                                                            options={awardOptions}
                                                            placeholder="Select a category"
                                                            {...field} // This automatically includes 'value' and 'onChange'
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {!matches && (
                                        <div className="filter-buttons-row">
                                            {/* <Button
                                                className="pi-btn-primary"
                                                key="confirm"
                                                type="primary"

                                            >
                                                Apply
                                            </Button> */}
                                            <Button
                                                className="pi-btn-secondary"
                                                key="cancel"
                                                onClick={() => {
                                                    reset({
                                                        awardCategory: '',
                                                    });
                                                }}
                                            >
                                                {" "}
                                                Clear
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                {matches && (
                                    <div className="filter-buttons-row">
                                        {/* <Button
                                            className="pi-btn-primary"
                                            key="confirm"
                                            type="primary"

                                        >
                                            Apply
                                        </Button> */}
                                        <Button
                                            className="pi-btn-secondary"
                                            key="cancel"
                                            onClick={() => {
                                                reset({
                                                    awardCategory: '',
                                                });
                                            }}
                                        >
                                            {" "}
                                            Clear
                                        </Button>
                                    </div>
                                )}
                            </>
                        </div>
                    }

                    <div className="main-content-card " style={{ marginTop: '2rem' }}>
                        <Row gutter={[16, 16]}>
                            {stats2.map((stat, index) => (
                                <Col xs={24} sm={12} md={6} key={index}>
                                    <Card style={{ height: '10rem', }}>
                                        <Space direction="vertical" size="small">
                                            <Text strong>{stat.title}</Text>
                                            <Title level={2} style={{ margin: 0 }}>
                                                <div className='d-flex' style={{ gap: '8px' }}>
                                                    <div style={{ marginTop: '6px' }}>
                                                        {stat.icon}
                                                    </div>
                                                    {stat.value}
                                                </div>
                                            </Title>
                                            <Row style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                <Text type="success">
                                                    {stat.change} <span style={{ fontSize: '14px', color: '#888' }}>vs last week</span>
                                                </Text>
                                                <Space style={{ marginLeft: '16px' }}>
                                                    {/* <EyeOutlined style={{ color: 'orange' }} />
    <LineChartOutlined style={{ color: 'orange' }} /> */}
                                                    <p
                                                        className=''
                                                        style={{ fontSize: '12px',textDecorationLine:'underline', color:'#f17121', cursor:'pointer' }} // Adjust padding and font size
                                                    >
                                                        View more
                                                    </p>
                                                </Space>
                                            </Row>
                                        </Space>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>


                    {/*/----------------------------------part2----------------------------------------------------------
                    ------------------------------------------------------------------------------------------------- */}

                    <div className="main-title-container" style={{ marginTop: '2rem' }}>
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">Total PiCoins By Date Range</h5>
                        </div>

                    </div>

                    <div className="filter-section-container">
                        {matches &&
                            <div className="filter-section-container">
                                <FilterData content={FilterSection} open={open} handleOpenChange={handleOpenChange} />
                            </div>
                        }
                    </div>
                    {!matches &&
                        <div className="main-content-card">
                            <>
                                <div className="filter-form">
                                    <div
                                        className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"
                                            }`}
                                    >
                                        <div className="input-group">
                                            <label htmlFor="event" className="form-label">
                                                {" "}
                                                Date Range{" "}
                                            </label>
                                            <div className="form-group">
                                                <CustomDateRangePicker
                                                    date={date}
                                                    onDateChange={handleDateChange}
                                                    selectedDateRange={selectedDateRange}
                                                    onClearDateRange={onClearDateRange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {!matches && (
                                        <div className="filter-buttons-row">
                                            <Button
                                                className="pi-btn-primary"
                                                key="confirm"
                                                type="primary"
                                                onClick={() => {
                                                    applyFilters()
                                                }}
                                            >
                                                Apply
                                            </Button>
                                            <Button
                                                className="pi-btn-secondary"
                                                key="cancel"
                                                onClick={() => {
                                                    clearFilters()
                                                }}

                                            >
                                                {" "}
                                                Clear
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                {matches && (
                                    <div className="filter-buttons-row">
                                        <Button
                                            className="pi-btn-primary"
                                            key="confirm"
                                            type="primary"
                                            onClick={() => {
                                                applyFilters()
                                            }}
                                        >
                                            Apply
                                        </Button>
                                        <Button
                                            className="pi-btn-secondary"
                                            key="cancel"
                                            onClick={() => {
                                                clearFilters()
                                            }}
                                        >
                                            {" "}
                                            Clear
                                        </Button>
                                    </div>
                                )}
                            </>
                        </div>
                    }

                    <div className="main-content-card " style={{ marginTop: '2rem' }}>
                        <Row gutter={[16, 16]}>
                            {stats.map((stat, index) => (
                                <Col xs={24} sm={12} md={6} key={index}>
                                    <Card style={{ height: '10rem', }}>
                                        <Space direction="vertical" size="small">
                                            <Text strong>{stat.title}</Text>
                                            <Title level={2} style={{ margin: 0 }}>
                                                <div className='d-flex' style={{ gap: '8px' }}>
                                                    <div style={{ marginTop: '6px' }}>
                                                        {stat.icon}
                                                    </div>
                                                    {stat.value}
                                                </div>
                                            </Title>
                                            <Row style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                <Text type="success">
                                                    {stat.change} <span style={{ fontSize: '14px', color: '#888' }}>vs last week</span>
                                                </Text>
                                                <Space style={{ marginLeft: '16px' }}>
                                                    {/* <EyeOutlined style={{ color: 'orange' }} />
                                                    <LineChartOutlined style={{ color: 'orange' }} /> */}
                                                     <p
                                                        className=''
                                                        style={{ fontSize: '12px',textDecorationLine:'underline', color:'#f17121', cursor:'pointer' }} // Adjust padding and font size
                                                    >
                                                        View more
                                                    </p>
                                                </Space>
                                            </Row>
                                        </Space>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>


                    {/* -------------------------Part 3------------------------------------------------------------
                    ------------------------------------------------------------------------------------- */}

                    {/* <div className="main-title-container" style={{ marginTop: '2rem' }}>
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">Total PiCoins By User</h5>
                        </div>
                        {matches &&
                            <div style={{ fontSize: '1rem', fontWeight: 'bolder' }}>
                                Total Balance: {picoinsUserData && picoinsUserData.length > 0 ? picoinsUserData.map(item => item.total_balance).reduce((acc, curr) => acc + curr, 0) : 0}
                            </div>
                        }

                    </div> */}
                    {/* 
                    <div className="filter-section-container">
                        {matches &&
                            <div className="filter-section-container">
                                <FilterData content={FilterSection3} open={openUser} handleOpenChange={handleOpenUserChange} />
                            </div>
                        }
                    </div>
                    {!matches &&
                        <div className="main-content-card">
                            <>
                                <div className="filter-form">
                                    <div
                                        className={`${matches ? "filter-section  border-bottom-light" : "filter-fields"
                                            }`}
                                    >
                                        {/* <div className="input-group">
                                            <label htmlFor="UserNumber" className="form-label">User Mobile No</label>
                                            <div className="form-group">
                                                <input
                                                    className="form-field"
                                                    type="text"
                                                    id="UserNumber"
                                                    placeholder="Enter Mobile no"
                                                    {...register('UserNumber')}
                                                />
                                            </div>
                                        </div> */}
                    {/* <div className="input-group" >
                                            <label htmlFor="users">Select Users</label>
                                            <div className="form-group">
                                                <Controller
                                                    name="user_ids"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            closeMenuOnSelect={false}
                                                            className="controller-select"
                                                            components={animatedComponents}
                                                            //  isMulti
                                                            options={userList}
                                                            {...field}
                                                            value={selectedUsers}
                                                            onChange={handleUserChange}

                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '1rem', fontWeight: 'bolder' }}>
                                            Total Balance: {picoinsUserData && picoinsUserData.length > 0 ? picoinsUserData.map(item => item.total_balance).reduce((acc, curr) => acc + curr, 0) : 0}
                                        </div>
                                    </div>
                                    {!matches && (
                                        <div className="filter-buttons-row">
                                            <Button
                                                className="pi-btn-primary"
                                                key="confirm"
                                                type="primary"
                                                onClick={() => {
                                                    getPicoinsSummaryUserData(payload2)
                                                }}
                                            >
                                                Apply
                                            </Button>
                                            <Button
                                                className="pi-btn-secondary"
                                                key="cancel"
                                                onClick={() => {
                                                    reset({
                                                        userNo: '',
                                                        UserNumber: ''
                                                    });
                                                    setPicoinsUserData(null);
                                                    setSelectedUsers([])
                                                }}
                                            >
                                                {" "}
                                                Clear
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                {matches && (
                                    <div className="filter-buttons-row">
                                        <Button
                                            className="pi-btn-primary"
                                            key="confirm"
                                            type="primary"
                                            onClick={() => {
                                                getPicoinsSummaryUserData(payload2)
                                            }}
                                        >
                                            Apply
                                        </Button>
                                        <Button
                                            className="pi-btn-secondary"
                                            key="cancel"
                                            onClick={() => {
                                                reset({
                                                    userNo: '',
                                                    UserNumber: ''
                                                });
                                                setPicoinsUserData(null);
                                                setSelectedUsers([])
                                            }}
                                        >
                                            {" "}
                                            Clear
                                        </Button>
                                    </div>
                                )}
                            </>
                        </div>
                    } */}

                    {/* <div className="main-content-card " style={{ marginTop: '2rem' }}>
                        <Row gutter={[16, 16]}>
                            {picoinsUserData && picoinsUserData.length > 0 ? (
                                picoinsUserData.map((stat, index) => (
                                    <Col xs={24} sm={12} md={6} key={index}>
                                        <Card style={{ height: '10rem' }}>
                                            <Space direction="vertical" size="small">
                                                <Text strong>{stat?.reference}</Text>
                                                <Title level={2} style={{ margin: 0 }}>
                                                    <div className='d-flex' style={{ gap: '8px' }}>
                                                        <div style={{ marginTop: '6px' }}>
                                                            <img src={picoin} style={{ width: '28px', height: '28px' }} alt="PiCoin" />
                                                        </div>
                                                        {stat.total_balance}
                                                    </div>
                                                </Title>
                                                <Row style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                    <Text type="success">
                                                        {stat.change} <span style={{ fontSize: '14px', color: '#888' }}>vs last week</span>
                                                    </Text>
                                                    <Space style={{ marginLeft: '16px' }}>
                                                        <EyeOutlined style={{ color: 'orange' }} />
                                                        <LineChartOutlined style={{ color: 'orange' }} />
                                                    </Space>
                                                </Row>
                                            </Space>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <Col xs={24}>
                                    <Card style={{ height: '20rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                            <img src={noDataImage} alt="No Data" style={{ width: '20rem', height: '16rem' }} />
                                        </div>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    </div> */}



                </Card>


            </div >

        </Fragment >
    )
}

export default PicoinsSummaryDashboard;