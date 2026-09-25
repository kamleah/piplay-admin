import React, { Fragment, useEffect, useState } from "react";
import { Card, Breadcrumb } from "antd";
import { Grid, Paper, Typography, Box, MenuItem, Select } from "@mui/material";
import { useSelector } from "react-redux";
import { Icon } from "@iconify-icon/react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { getAllRevenue } from "../../../components/apiFile/Service";
import "./NewDashboard.css";
import ClipLoader from "react-spinners/ClipLoader";

// Define the type for the metric data


const NewDashboard = ({
  matches,
  menuOpen,
  onToggle,
  modulePermissionsData,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [Loading, setLoading] = useState(false);
  const loggedInUser = localStorage.getItem("auth");


 const [data, setData] = useState([]);

  const loggedUserDetails = useSelector(
    (state: any) => state.user.loggedUserDetails
  );

  const isAdmin = () => {
    return true ? loggedUserDetails.roles[0] === "Admin" : false;
  };

  // Dummy data for testing
  const [revenue_dashboard_data, setRevenue_dashboard_data] = useState([]);
  const [court_utilization_data,setCourt_utilization_data] = useState([]);
  const [user_data,setUser_data] = useState([]);
   


  const mapCourtUtilizationData = (data) => {
    const calculateGrowth = (current, previous) => {
      return previous
        ? Number(((current - previous) / previous) * 100).toFixed(2)
        : "0.00";
    };

    const formatValue = (value) => {
      return value ? Number(value).toFixed(2) : "0.00";
    };

    let courtUtilizationData:any = [
      {
        icon: "mingcute:hours-line",
        label: "Hours Played",
        value: formatValue(data?.hours_played),
        growthPercentage: calculateGrowth(
          data?.hours_played,
          data?.last_hours_played
        ),
        subtext: "hrs",
      },
      {
        icon: "tabler:clock-hour-9",
        label: "Average Play Time",
        value: formatValue(data?.average_play_time),
        growthPercentage: calculateGrowth(
          data?.average_play_time,
          data?.last_average_play_time
        ),
        subtext: "hrs",
      },
    ];

    setCourt_utilization_data(courtUtilizationData);
  };

   
  const mapUserData = (data) => {
    const calculateGrowth = (current, previous) => {
      return previous
        ? Number(((current - previous) / previous) * 100).toFixed(2)
        : "0.00";
    };

    let userData:any = [
      {
        icon: "mdi:user-multiple-outline",
        label: "Total Users",
        value: data?.users ? data?.users : "0",
        growthPercentage: calculateGrowth(
          data?.users,
          data?.last_users
        ),
      },
      {
        icon: "mdi:user-multiple-outline",
        label: "New Users",
        value: data?.new_users ? data?.new_users : "0",
        growthPercentage: calculateGrowth(
          data?.new_users,
          data?.last_new_users
        ),
      },
    ];

    setUser_data(userData);
  };
  


  


  const mapRevenueDashboardData = (data)=>{
    const calculateGrowth = (current,previous)=>{
      return previous ?Number(((current-previous)/previous) * 100).toFixed(2):"0.00"
    }
    const formatValue = (value)=>{
      return value ? Number(value).toFixed(2):"0.00";
    }

    let revenue_dashboard_data: any = [
      {
        //need to check
        icon: "clarity:list-solid-badged",
        label: "Total Sales/Revenue",
        value: formatValue(data?.revenue_generated),
        growthPercentage: calculateGrowth(
          data?.revenue_generated,
          data?.last_revenue_generated
        ),

        subtext: "₹",
      },
      {
        icon: "healthicons:money-bag-outline",
        label: "Total Bookings amount",
        value: formatValue(data?.revenue_generated),
        growthPercentage: calculateGrowth(
          data?.revenue_generated,
          data?.last_revenue_generated
        ),
        subtext: "₹",
      },
      {
        icon: "clarity:list-solid-badged",
        label: "Total GST",
        value: 18000.0,
        growthPercentage: -2.5,
        subtext: "₹",
      },
      {
        icon: "healthicons:money-bag-outline",
        label: "Total Discounts Given in Pi coins",
        value: 5000.0,
        growthPercentage: 3.0,
        subtext: "₹",
      },
      {
        icon: "gridicons:refund",
        label: "Refund Counts",
        value: data?.refunded_count ? data?.refunded_count : "0",
        growthPercentage: calculateGrowth(
          data?.refunded_count,
          data?.last_refunded_count
        ),
      },
      {
        icon: "gridicons:refund",
        label: "Total Refunded Amount",
        value: data?.refunded_amount ? data?.refunded_amount : "0",
        growthPercentage: calculateGrowth(
          data?.refunded_amount,
          data?.last_refunded_amount
        ),
        subtext: "₹",
      },
      {
        icon: "clarity:list-solid-badged",
        label: "Bookings",
        value: data?.booking_count ? data?.booking_count : "0",
        growthPercentage: calculateGrowth(
          data?.booking_count,
          data?.last_booking_count
        ),
      },
      {
        icon: "solar:hand-money-outline",
        label: "Booked Slots",
        value: data?.booked_slots ? data?.booked_slots : "0",
        growthPercentage: calculateGrowth(
          data?.booked_slots,
          data?.last_booked_slots
        ),
      },
      {
        icon: "mdi:reschedule",
        label: "Reschedules Count",
        value: data?.no_of_reschedules ? data?.no_of_reschedules : "0",
        growthPercentage: calculateGrowth(
          data?.no_of_reschedules,
          data?.last_rno_of_reschedules
        ),
      },
      {
        icon: "mdi:reschedule",
        label: "Fees collected from reschedules",
        value: data?.reschedule_amount_penal
          ? data?.reschedule_amount_penal
          : "0",
        growthPercentage: calculateGrowth(
          data?.reschedule_amount_penaly,
          data?.last_reschedule_amount_penaly
        ),
        subtext: "₹",
      },
      {
        icon: "fluent:calendar-cancel-20-regular",
        label: "Cancellation Count",
        value: data?.cancel_count ? data?.cancel_count : "0",
        growthPercentage: calculateGrowth(
          data?.cancel_count,
          data?.last_cancel_count
        ),
      },
      {
        icon: "fluent:calendar-cancel-20-regular",
        label: "Fees collected from cancellations",
        value: data?.cancel_amount ? data?.cancel_amount : "0",
        growthPercentage: calculateGrowth(
          data?.cancel_amount,
          data?.last_cancel_amount
        ),
        subtext: "₹",
      },
    ];
  setRevenue_dashboard_data(revenue_dashboard_data);

  
  }

  const [days, setDays] = useState(8);
  const [customDays, setCustomDays] = useState("");

  const getAllData = async ()=>{
    setLoading(false);
    let response;
    
      response = await getAllRevenue(loggedInUser)
      console.log("response is",response)
      mapRevenueDashboardData(response?.result)
      mapUserData(response?.result);
      mapCourtUtilizationData(response?.result)
      setData(response?.result);
      setLoading(false);
      
  }

  useEffect(()=>{
    getAllData();

  },[]);

  const handleDaysChange = (event) => {
    const value = event.target.value;

    setDays(value);
  };

  interface DataPoint {
    x: string;
    y: number;
  }

  const generateData = (days: number) => {
    const revenueData: number[] = [];
    const orderData: number[] = [];
    const labels: string[] = [];

    const today = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today.getTime() - i * oneDayMs);
      const formattedDate = date.toISOString(); // Use ISO string for better parsing

      labels.push(formattedDate);
      revenueData.push(Math.floor(Math.random() * 8000) + 8000); // Random between 8000 and 16000
      orderData.push(Math.floor(Math.random() * 5000) + 3000); // Random between 3000 and 8000
    }

    return {
      series: [
        {
          id: "revenue",
          data: revenueData,
          curve: "catmullRom",
          color: "#FF8C00",
        },
        {
          id: "order",
          data: orderData,
          curve: "catmullRom",
          color: "#1E90FF",
        },
      ],
      xAxis: {
        id: "Dates",
        dataKey: "x",
        scaleType: "time",
        valueFormatter: (date) =>
          new Date(date).toLocaleDateString("default", {
            day: "numeric",
            month: "short",
          }),
      },
    };
  };

  const { series, xAxis } = generateData(7);

  return (
    <Fragment>
      <div
        onClick={onToggle}
        className={
          menuOpen
            ? `page-open-header${matches ? "-mobile" : ""}`
            : `page-header${matches ? "-mobile" : ""}`
        }
      >
        <Card>
          {!matches && (
            <Breadcrumb
              items={[
                {
                  title: "Home",
                },
                {
                  title: "Dashboard",
                },
              ]}
            />
          )}

          <Typography variant={"h5"}>Dashboard</Typography>

          {Loading ? (
            <div className="loader-container">
              <ClipLoader
                color={"#F17121"}
                loading={Loading}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          ) : (
            <div>
              <Grid
                container
                spacing={1}
                style={{ marginTop: 16 }}
                alignItems="stretch"
              >
                {revenue_dashboard_data.map((metric: any, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2}
                    key={index}
                    style={{ display: "flex" }}
                  >
                    <Paper
                      elevation={3}
                      style={{
                        padding: "7px",
                        margin: "1px",
                        textAlign: "center",
                        borderRadius: "0.5rem",
                        flexGrow: 1,
                        position: "relative",
                        height: "100%",
                        // display: "flex",
                        // flexDirection: "column",
                        // justifyContent: "space-between",
                        // height: "100%",
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        marginBottom="1.5rem"
                      >
                        <div style={{ flexBasis: "75%" }}>
                          <Typography
                            variant="h6"
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              textAlign: "start",
                            }}
                          >
                            {metric?.label}
                          </Typography>
                          <Typography
                            style={{
                              marginTop: 2,
                              fontWeight: "bold",
                              fontSize: "1.1rem",
                              textAlign: "start",
                            }}
                          >
                            {metric?.subtext}
                            {metric?.value}
                          </Typography>
                        </div>

                        <div className="icon-container1">
                          <Icon icon={metric?.icon} className="card-icon1" />
                        </div>
                      </Box>

                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        position="absolute"
                        bottom={0}
                        padding="0 2px"
                        left={0}
                        right={0}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="flex-start"
                        >
                          <Typography
                            variant="body2"
                            style={{
                              fontSize: "12px",
                              fontWeight: 700,
                              color:
                                parseFloat(metric?.growthPercentage) >= 0
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {metric?.growthPercentage}%
                          </Typography>
                          <p
                            style={{
                              fontSize: "10px",
                              fontWeight: 600,
                            }}
                          >
                            {" "}
                            VsLast month
                          </p>
                        </Box>
                        <Box justifyContent="flex-end">
                          <Icon
                            icon="mdi:eye"
                            style={{ color: "orange", marginRight: "9px" }}
                          />
                          <Icon
                            icon="mdi:graph-line"
                            style={{ color: "orange" }}
                          />
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Grid
                container
                spacing={1}
                style={{ marginTop: 16 }}
                alignItems="stretch"
              >
                <Grid item xs={12} sm={12} md={8}>
                  <Paper
                    elevation={3}
                    sx={{ p: 2 }}
                    className="dashpaper2"
                    
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        Revenue Analytics
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <Select
                          value={days}
                          onChange={handleDaysChange}
                          sx={{ mr: 2, minWidth: 150 }}
                        >
                          <MenuItem value={8}>Last 8 Days</MenuItem>
                          <MenuItem value={16}>Last 16 Days</MenuItem>
                          <MenuItem value={24}>Last 24 Days</MenuItem>
                        </Select>
                      </Box>
                    </Box>

                    <Box width="100%">
                      <LineChart
                        series={[
                          { curve: "catmullRom", data: [0, 5, 2, 6, 3, 9.3] },
                          { curve: "catmullRom", data: [6, 3, 7, 9.5, 4, 2] },
                        ]}
                        height={410}
                        margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
                        grid={{ vertical: true, horizontal: true }}
                      />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <Paper elevation={3} sx={{ p: 2 }} className="dashpaper2">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h6" fontWeight="bold">
                        Court Utilization
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      mt={0.5}
                    >
                      <Gauge
                        width={300}
                        height={200}
                        value={85}
                        startAngle={-90}
                        endAngle={90}
                        innerRadius="65%"
                        outerRadius="100%"
                        sx={(theme) => ({
                          [`& .${gaugeClasses.valueArc}`]: {
                            fill: "#fd8100",
                          },
                          [`& .${gaugeClasses.referenceArc}`]: {
                            fill: "#FFCC80",
                          },
                          [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 15,
                            fontweight: 300,
                            textAnchor: "middle",
                            transform: "translate(0px, -20px)",
                            fill: "#orange",
                          },
                        })}
                        text={({ value }) =>
                          `${value} %\n+8.02% from last month`
                        }
                      />
                    </Box>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: "#fd8100", // Orange color for Utilized
                          marginRight: "8px",
                        }}
                      ></div>
                      <div style={{ fontWeight: "bold", marginRight: "8px" }}>
                        Utilized
                      </div>
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: "#FFCC80", // Grey color for Not Utilized
                          marginRight: "8px",
                        }}
                      ></div>
                      <div style={{ fontWeight: "bold" }}>Not Utilized</div>
                    </div>

                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Typography variant="body2" fontWeight="bold">
                        Great Progress! 🎉
                      </Typography>
                      <Typography variant="body2" align="center">
                        Our achievement increased by <strong>$200,000</strong>;
                        let’s reach 100% next month.
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mt={1}
                      left={0}
                      bottom={0}
                      right ={0}

                    >
                      <Grid
                        container
                        spacing={1}
                        style={{ marginTop: 16 }}
                        alignItems="stretch"
                      >
                        {court_utilization_data.map((metric: any, index) => (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={6}
                            key={index}
                            style={{ display: "flex" }}
                          >
                            <Paper
                              elevation={3}
                              style={{
                                padding: "7px",
                                margin: "1px",
                                textAlign: "center",
                                borderRadius: "0.5rem",
                                backgroundColor: "#ececec",
                                flexGrow: 1,
                              }}
                            >
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                marginBottom="1.5rem"
                              >
                                <div>
                                  <Typography
                                    variant="h6"
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      textAlign: "start",
                                    }}
                                  >
                                    {metric?.label}
                                  </Typography>
                                  <Typography
                                    style={{
                                      marginTop: 2,
                                      fontWeight: "bold",
                                      fontSize: "1.1rem",
                                      textAlign: "start",
                                    }}
                                  >
                                    {metric?.value} {metric?.subtext}
                                  </Typography>
                                </div>

                                <div className="icon-container1">
                                  <Icon
                                    icon={metric?.icon}
                                    className="card-icon1"
                                  />
                                </div>
                              </Box>

                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                              >
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="left"
                                >
                                  <Typography
                                    variant="body2"
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: 700,
                                      color:
                                        parseFloat(metric.growthPercentage) >= 0
                                          ? "green"
                                          : "red",
                                    }}
                                  >
                                    {metric.growthPercentage}%
                                  </Typography>
                                  <p
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {" "}
                                    VsLast month
                                  </p>
                                </Box>
                                <Box>
                                  <Icon
                                    icon="mdi:eye"
                                    style={{
                                      color: "orange",
                                      marginRight: "6px",
                                    }}
                                  />
                                  <Icon
                                    icon="mdi:graph-line"
                                    style={{ color: "orange" }}
                                  />
                                </Box>
                              </Box>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
              <Grid container spacing={1} style={{ marginTop: 16 }}>
                {user_data.map((metric: any, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Paper
                      elevation={3}
                      style={{
                        padding: "7px",
                        margin: "1px",
                        textAlign: "center",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        marginBottom="1.5rem"
                      >
                        <div>
                          <Typography
                            variant="h6"
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              textAlign: "start",
                            }}
                          >
                            {metric.label}
                          </Typography>
                          <Typography
                            style={{
                              marginTop: 2,
                              fontWeight: "bold",
                              fontSize: "1.1rem",
                              textAlign: "start",
                            }}
                          >
                            {metric.value}
                          </Typography>
                        </div>

                        <div className="icon-container1">
                          <Icon icon={metric.icon} className="card-icon1" />
                        </div>
                      </Box>

                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="left"
                        >
                          <Typography
                            variant="body2"
                            style={{
                              fontSize: "12px",
                              fontWeight: 700,
                              color:
                                parseFloat(metric.growthPercentage) >= 0
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {metric.growthPercentage}%
                          </Typography>
                          <p
                            style={{
                              fontSize: "10px",
                              fontWeight: 600,
                            }}
                          >
                            {" "}
                            VsLast month
                          </p>
                        </Box>
                        <Box>
                          <Icon
                            icon="mdi:eye"
                            style={{ color: "orange", marginRight: "6px" }}
                          />
                          <Icon
                            icon="mdi:graph-line"
                            style={{ color: "orange" }}
                          />
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </div>
          )}
        </Card>
      </div>
    </Fragment>
  );
};

export default NewDashboard;
