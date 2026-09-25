import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import { gamesOptions } from '../../../utils/reuse';
import { Card, Breadcrumb, Button, Radio, Row, Col, Tooltip, Typography } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import Select from "react-select";
import makeAnimated from "react-select/animated";
import './PartnerSettlements.css';
import { useSelector } from "react-redux";
import Emailer from "../../../components/Modal/Emailer";
import { Table } from 'antd';
import moment from 'moment';
import type { TableProps } from 'antd';
import FilterData from "../../../components/Modal/FilterData";
import { getSettlementSlipAPI } from '../../../components/apiFile/Service';
import CustomDateRangePicker from '../../../components/Modal/CustomDateRangePicker';
import Excel from "../../../components/Helpers/Excel";

function PartnerSettlements({ matches, menuOpen, onToggle, modulePermissionsData }) {
    const { register, watch, setValue, reset, control } = useForm()
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [data, setData] = useState<{
        total_booking_amount: number;
        total_discount: number;
        pi_play_discount: number;
        partner_discount: number;
        new_total_booking_amount: number;
        platform_charges: number;
        partner_settlement_amount: number;
        total_amount_paid_by_users: number;
    } | null>(null);
    const [facilityList, setFacilityList] = useState<{ label: string }[]>([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const animatedComponents = makeAnimated();
    const loggedInUser = localStorage.getItem("auth");
    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)

    const startDate = watch("start");
    const endDate = watch("end");

    const { Text } = Typography;


    const onClearFilter = () => {
        onClearDateRange();
        reset({
            facility_id: "", start: "",
            end: "",
        });
        setTriggerFetch(true);
    }

    const [open, setOpen] = useState(false);
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };


    const [openEmailer, setOpenEmailer] = useState(false);
    const handleEmailerChange = (newOpen: boolean) => {
        setOpenEmailer(newOpen);
    };
    const hide = () => {
        setOpenEmailer(false);
    };



    const getSettlementsData = async () => {
        try {
            const response = await getSettlementSlipAPI(loggedInUser, startDate ? startDate : '', endDate ? endDate : '', '');
            setData(response.result);
            console.log("🚀 ~ file: PartnerSettlements.tsx:83 ~ getSettlementsData ~ response.result:", response.result)
        } catch (error) {
            console.error('Error fetching settlement data:', error);
        }
    }

    useEffect(() => {
        getSettlementsData();
    }, [])


    useEffect(() => {
        if (triggerFetch) {
            getSettlementsData(); // Re-fetch data when triggered
            setTriggerFetch(false); // Reset trigger
        }
    }, [triggerFetch]);

    console.log("Data======", data);

    const handleApply = () => {
        getSettlementsData();
    }


    const [selectedDateRange, setSelectedDateRange] =
        useState("Select Date Range");

    const handleDateChange = (newDateRange) => {
        setDate(newDateRange);
        const startDate = newDateRange[0].startDate;
        const endDate = newDateRange[0].endDate;
        setValue("start", moment(startDate).format("YYYY-MM-DD"));
        setValue("end", moment(endDate).format("YYYY-MM-DD"));
        setSelectedDateRange(
            `${moment(startDate).format("DD/MM/YYYY")} - ${moment(endDate).format(
                "DD/MM/YYYY"
            )}`
        );
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

    const FilterSection = () => {
        return (
            <>
                <div className="filter-form">
                    <div className={`${matches ? "filter-section border-bottom-light" : "filter-fields"}`}>

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
                                onClick={handleApply}
                            >
                                Apply
                            </Button>
                            <Button
                                className="pi-btn-secondary"
                                key="cancel"
                                onClick={() => {
                                    onClearFilter();
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
                            onClick={handleApply}
                        >
                            Apply
                        </Button>
                        <Button
                            className="pi-btn-secondary"
                            key="cancel"
                            onClick={() => {
                                onClearFilter();
                            }}
                        >
                            {" "}
                            Clear
                        </Button>
                    </div>
                )}
            </>
        )
    }

    return (
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
                            title: "Settlement Slip",
                        }
                    ]}
                />}

                <form className="">
                    <div className="main-title-container">
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">Settlements Slip</h5>
                            {matches &&
                                <>

                                    <Button
                                        className="pi-btn-primary"
                                        key="confirm" type="primary"
                                        onClick={() => setOpenEmailer(true)}
                                    >
                                        Send Email 
                                        <Emailer emailerOpen={openEmailer} handleOpenChange={handleEmailerChange} onHide={hide} />
                                    </Button>
                                    <Excel page={"SettlementSlip"} importdata={[data]} />

                                </>
                            }
                        </div>
                       
                        <div style={{}}>
                            <div className='title-buttons' >
                                {/* <div>
                                    <Radio.Group
                                        options={gamesOptions}
                                        {...register('sport_type')}
                                        value={sport_type ? sport_type : 'all'}
                                    />
                                </div> */}
                                {!matches &&
                                    <>

                                        <Button
                                            className="pi-btn-primary"
                                            key="confirm" type="primary"
                                            onClick={() => setOpenEmailer(true)}
                                        >
                                            Send Email 
                                            <Emailer emailerOpen={openEmailer} handleOpenChange={handleEmailerChange} onHide={hide} />
                                        </Button>
                                        <div>

                                            <Excel page={"SettlementSlip"} importdata={data} />
                                        </div>

                                    </>
                                }
                            </div>
                        </div>

                    </div>
                    {matches &&
                        <div className="filter-section-container" style={{ marginBottom: '1rem', marginRight: '1.5rem' }}>
                            <FilterData content={FilterSection} open={open} handleOpenChange={handleOpenChange} />
                        </div>
                    }
                    {!matches &&

                        <>
                            <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
                                <div className="filter-form">
                                    <div className={`${matches ? "filter-section border-bottom-light" : "filter-fields"}`}>


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
                                    <div className="filter-buttons-row">
                                        <Button className="pi-btn-primary" type="primary" onClick={handleApply}>
                                            Apply
                                        </Button>
                                        <Button className="pi-btn-secondary" onClick={() => {
                                            onClearFilter();
                                        }}>
                                            Clear
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        </>

                    }

                    <div style={{ padding: 20, maxWidth: 900, margin: "auto", marginTop: '-2rem' }}>
                        <Card bordered={false}>
                            <Row gutter={[8, 8]}>
                                {/* Bookings */}
                                {data ? (
                                    <>
                                        <div style={{ marginBottom: '2rem', display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", marginTop: "20px", color: "#999999", fontSize: "12px", width: "100%" }}>
                                            <p style={{ color: "#fa8c16", fontSize: "20px", fontWeight: "bold" }}><span style={{ color: '#2b2b29' }}>Dear</span> Partner</p>
                                            <p style={{ color: "gray", fontSize: "13px", marginTop: "-5px" }}>you can check your daily settlements slip here</p>

                                        </div>
                                        <Col span={16}>
                                            <Text>
                                                Bookings{" "}
                                                <Tooltip title="Total amount charged for bookings">
                                                    <InfoCircleOutlined style={{ color: "#1890ff" }} />
                                                </Tooltip>
                                            </Text>
                                        </Col>
                                        <Col span={8} style={{ textAlign: "right" }}>
                                            <Text>₹ {(data?.total_booking_amount).toFixed(2)}</Text>
                                        </Col>

                                        {/* Pi Play Discount */}
                                        <Col span={16}>
                                            <Text>
                                                Pi Play Discount{" "}
                                                <Tooltip title="Pi Play discount applied to the bookings">
                                                    <InfoCircleOutlined style={{ color: "#1890ff" }} />
                                                </Tooltip>
                                            </Text>
                                        </Col>
                                        <Col span={8} style={{ textAlign: "right" }}>
                                            <Text>₹ {(data?.pi_play_discount).toFixed(2)}</Text>
                                        </Col>

                                        {/* Pi Play Discount */}
                                        <Col span={16}>
                                            <Text>
                                                Partner Discount{" "}
                                                <Tooltip title="Partner discount applied to the bookings">
                                                    <InfoCircleOutlined style={{ color: "#1890ff" }} />
                                                </Tooltip>
                                            </Text>
                                        </Col>
                                        <Col span={8} style={{ textAlign: "right" }}>
                                            <Text>₹ {(data?.partner_discount).toFixed(2)}</Text>
                                        </Col>

                                        <div style={{ borderTop: "1px dashed #d9d9d9", width: "100%", margin: "8px 0" }} />

                                        {/* Total Discount */}
                                        <Col span={16}>
                                            <Text>
                                                Total Discount{" "}
                                                <Tooltip title="Discounts applied to the bookings">
                                                    <InfoCircleOutlined style={{ color: "#1890ff" }} />
                                                </Tooltip>
                                            </Text>
                                        </Col>
                                        <Col span={8} style={{ textAlign: "right" }}>
                                            <Text>₹ {(data?.total_discount).toFixed(2)}</Text>
                                        </Col>

                                        <div style={{ borderTop: "1px dashed #d9d9d9", width: "100%", margin: "8px 0" }} />

                                        {/* Platform Fees */}
                                        <Col span={16}>
                                            <Text>
                                                Platform fees{" "}
                                                <Tooltip title="Fee charged by the platform for its services">
                                                    <InfoCircleOutlined style={{ color: "#1890ff" }} />
                                                </Tooltip>
                                            </Text>
                                        </Col>
                                        <Col span={8} style={{ textAlign: "right" }}>
                                            <Text>₹ {data?.platform_charges.toFixed(2)}</Text>
                                        </Col>

                                        {/* Total Bookings Amount */}
                                        <Col span={16}>
                                            <Text strong>
                                                Total Bookings Amount{" "}
                                                <Tooltip title="Total amount after adding Discount to bookings">
                                                    <InfoCircleOutlined style={{ color: "#1890ff" }} />
                                                </Tooltip>
                                            </Text>
                                        </Col>
                                        <Col span={8} style={{ textAlign: "right" }}>
                                            <Text strong>₹ {data?.new_total_booking_amount.toFixed(2)}</Text>
                                        </Col>



                                        {/* Partner Earnings */}
                                        {/* <Col span={16}>
                                            <Text>
                                                Partner Earnings{" "}
                                                <Tooltip title="Amount earned by the partner from the bookings">
                                                    <InfoCircleOutlined style={{ color: "#1890ff" }} />
                                                </Tooltip>
                                            </Text>
                                        </Col>
                                        <Col span={8} style={{ textAlign: "right" }}>
                                            <Text>₹ {partnerEarnings.toFixed(2)}</Text>
                                        </Col> */}

                                        {/* TDS */}
                                        {/* <Col span={16}>
                                            <Text>
                                                TDS{" "}
                                                <Tooltip title="Tax Deducted at Source (TDS)">
                                                    <InfoCircleOutlined style={{ color: "#1890ff" }} />
                                                </Tooltip>
                                            </Text>
                                        </Col>
                                        <Col span={8} style={{ textAlign: "right" }}>
                                            <Text>₹ {tds.toFixed(2)}</Text>
                                        </Col> */}

                                        <div style={{ borderTop: "1px dashed #d9d9d9", width: "100%", margin: "8px 0" }} />

                                        {/* Partner Settlement */}
                                        <Col span={16}>
                                            <Text strong style={{ color: "#fa8c16" }}>
                                                Partner Settlement{" "}
                                                <Tooltip title="Final settlement amount received by the partner">
                                                    <InfoCircleOutlined style={{ color: "#fa8c16" }} />
                                                </Tooltip>
                                            </Text>
                                        </Col>
                                        <Col span={8} style={{ textAlign: "right" }}>
                                            <Text strong style={{ color: "#fa8c16" }}>
                                                ₹ {data?.partner_settlement_amount.toFixed(2)}
                                            </Text>
                                        </Col>

                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "3rem", color: "#999999", fontSize: "12px", width: "100%" }}>

                                            {/* Footer Section */}
                                            <div style={{ textAlign: "center" }}>
                                                <p>Powered by</p>
                                                <img src="https://s3.ap-south-1.amazonaws.com/media.pi-play.com/events/1728458401_facilityImage_Picture2.png" width="125" height="65" style={{ padding: "10px" }} />
                                                <p>&copy; Copyright 2024 Pi Play All rights reserved</p>
                                                <p>
                                                    <span style={{ color: "#1a0dab", textDecoration: "none" }}>Terms & Conditions</span> |
                                                    <span style={{ color: "#1a0dab", textDecoration: "none" }}>Privacy Policy</span>
                                                </p>
                                            </div>

                                        </div>
                                    </>
                                ) : <Text>Please Wait, Loading...</Text>}
                            </Row>
                        </Card>
                    </div>

                    {/* <Row gutter={100}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="PS-table-container">
                                <table className="PS-financial-table">
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Revenue (GMV) <Tooltip title="All bookings from past till current period delivered" placement="right"><InfoCircleOutlined className="PS-info-icon" /></Tooltip></td>
                                            <td>3.7</td>
                                            <td>₹ 20,000</td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>All Orders Sum (TBA) <Tooltip title="All the bookings received during the selected period (includes future bookings)" placement="right"><InfoCircleOutlined className="PS-info-icon" /></Tooltip></td>
                                            <td>-</td>
                                            <td>₹ 10,000</td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>Total Refunds <Tooltip title="The Amount refunded against all cancellations including rained out slots" placement="right"><InfoCircleOutlined className="PS-info-icon" /></Tooltip></td>
                                            <td>-</td>
                                            <td>₹ 5,000</td>
                                        </tr>
                                        <tr>
                                            <td>4</td>
                                            <td>Cancellation Fee Collected </td>
                                            <td>-</td>
                                            <td>₹ 1,000</td>
                                        </tr>
                                        <tr>
                                            <td>5</td>
                                            <td>Refunded Fee Collected </td>
                                            <td>-</td>
                                            <td>₹ 500</td>
                                        </tr>
                                        <tr>
                                            <td>6</td>
                                            <td>Total Discounts Given <Tooltip title="Sum of all platform coupons share of partner/club for bookings & event registrations " placement="right"><InfoCircleOutlined className="PS-info-icon" /></Tooltip></td>
                                            <td>-</td>
                                            <td>₹ 36,500</td>
                                        </tr>
                                        <tr>
                                            <td>7</td>
                                            <td>Platform Charges </td>
                                            <td>-</td>
                                            <td>₹ 500</td>
                                        </tr>
                                        <tr>
                                            <td>8</td>
                                            <td>Payment Gateway charges</td>
                                            <td>-</td>
                                            <td>₹ 500</td>
                                        </tr>
                                        <tr>
                                            <td>9</td>
                                            <td>Total Payable to patner/club (ded .pg & platform charges)<Tooltip title="Sum of all platform coupons share of partner/club for bookings, event registrations, packages & memberships " placement="right"><InfoCircleOutlined className="PS-info-icon" /></Tooltip></td>
                                            <td>-</td>
                                            <td>₹ 36,500</td>
                                        </tr>
                                        <tr>
                                            <td>10</td>
                                            <td>Pi Coins Total Sum</td>
                                            <td>-</td>
                                            <td>₹ 3600</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Row> */}
                </form>
            </Card>

        </div>
    );
}

export default PartnerSettlements;
