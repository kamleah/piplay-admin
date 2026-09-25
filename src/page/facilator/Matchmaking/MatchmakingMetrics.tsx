import React, { Fragment, useEffect, useState } from "react";
import { Card, Breadcrumb } from "antd";
import { Grid, Paper, Typography, Box, MenuItem, Select,LinearProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { Icon } from "@iconify-icon/react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { FaRegEye } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import "./MatchMakingmetrics.css"
const MatchmakingMetrics = ({
  matches,
  menuOpen,
  onToggle,
  modulePermissionsData,
}) => {
  const loggedInUser = localStorage.getItem("auth");
  const [Loading, isLoading] = useState(false);

  const loggedUserDetails = useSelector(
    (state: any) => state.user.loggedUserDetails
  );

  const isAdmin = () => {
    return true ? loggedUserDetails.roles[0] === "Admin" : false;
  };

  const [matchmakingMetricsData, setMatchmakingMetricsData] = useState([
    {
      icon: "clarity:list-solid-badged",
      label: "Private Matches Created",
      value: 120,
      growthPercentage: 5.0,
    },
    {
      icon: "clarity:list-solid-badged",
      label: "Public Matches Created",
      value: 150,
      growthPercentage: 10.0,
    },
    {
      icon: "clarity:list-solid-badged",
      label: "Women's Only ",
      value: 80,
      growthPercentage: 8.5,
    },
    {
      icon: "clarity:list-solid-badged",
      label: "Men's Only ",
      value: 90,
      growthPercentage: 6.75,
    },
   
    {
      icon: "clarity:list-solid-badged",
      label: "Split Payment",
      value: 50,
      growthPercentage: 4.25,
    },
    {
      icon: "clarity:list-solid-badged",
      label: "Partial Payment",
      value: "NIL",
      growthPercentage: 7.5,
    },
    {
      icon: "clarity:list-solid-badged",
      label: "Number of facilities",
      value: 30,
      growthPercentage: 3.0,
    },
    {
      icon: "clarity:list-solid-badged",
      label: "Scores Updated",
      value: 220,
      growthPercentage: 15.0,
    },
    
    
  ]);

  const [linear_progress_data,setLinear_progress_data] = useState([]);

  const [court_utilization_data, setCourt_utilization_data] = useState([]);
  const [userData, setUser_data] = useState([]);
  const [profile_types,setProfile_types] = useState([]);

  const linear_progress: any = [
    {
      icon: "clarity:list-solid-badged",
      label: "City Wise ",
      value: 200,
      growthPercentage: 12.0,
    },
    {
      icon: "clarity:list-solid-badged",
      label: "Facility Wise ",
      value: 170,
      growthPercentage: 9.0,
    },
    {
      icon: "clarity:list-solid-badged",
      label: "Scores Shared",
      value: 180,
      growthPercentage: 10.5,
    },
  ];

  

  const profile_types_data: any = [
    {
      icon: "clarity:list-solid-badged",
      label: "Number of Facility Accounts",
      value: 25,
      growthPercentage: 2.5,
    },
    {
      icon: "clarity:list-solid-badged",
      label: "Number of Coaches",
      value: 40,
      growthPercentage: 5.75,
    },
    {
      icon: "clarity:list-solid-badged",
      label: "Number of Players",
      value: 300,
      growthPercentage: 20.0,
    },
    {
      icon: "clarity:list-solid-badged",
      label: "Number of Event Managers",
      value: 15,
      growthPercentage: 2.0,
    },
    {
      icon: "clarity:list-solid-badged",
      label: "Number of Brands",
      value: 10,
      growthPercentage: 1.5,
    },
  ];
  

  // Dummy static values for court utilization data
  const courtUtilizationData: any = [
    {
      icon: "mingcute:hours-line",
      label: "Hours Played",
      value: "120", // Static value for hours played
      growthPercentage: "5.50", // Static growth percentage
      subtext: "hrs",
    },
    {
      icon: "tabler:clock-hour-9",
      label: "Average Play Time",
      value: "2.5", // Static value for average play time
      growthPercentage: "3.25", // Static growth percentage
      subtext: "hrs",
    },
  ];

 
  let userdata: any = [
    {
      icon: "mdi:user-multiple-outline",
      label: "Total Users",
      value: "500", // Static value for total users
      growthPercentage: "4.50", // Static growth percentage
    },
    {
      icon: "mdi:user-multiple-outline",
      label: "New Users",
      value: "150", // Static value for new users
      growthPercentage: "10.00", // Static growth percentage
    },
  ];

  // Set the state with the static values
  useEffect(() => {
    setCourt_utilization_data(courtUtilizationData);
    setUser_data(userdata);
    setProfile_types(profile_types_data);
    setLinear_progress_data(linear_progress);
  }, []);

  const [days, setDays] = useState(8);
  const [customDays, setCustomDays] = useState("");

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
const dummyData = [
  {
    title: "Facility Wise",
    data: [
      { country: "Facility 1", value: 36 },
      { country: "Facility 2", value: 24 },
      { country: "Facility 3", value: 17.5 },
      { country: "Facility 4", value: 15 },
      { country: "Facility 4", value: 15 },
      { country: "Facility 4", value: 15 },
    ],
  },
  {
    title: "City Wise",
    data: [
      { country: "City 1", value: 42 },
      { country: "City 2", value: 20 },
      { country: "City 3", value: 18 },
      { country: "City 4", value: 10 },
    ],
  },
  {
    title: "Scores Shared",
    data: [
      { country: "Instagram", value: 50 },
      { country: "Twitter", value: 30 },
      { country: "Piplay", value: 15 },
      { country: "Facebook", value: 5 },
    ],
  },
];



const calculateTotalValue = (data) => data.reduce((acc, item) => acc + item.value, 0);


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
                  title: "Match Making",
                },
                {
                  title: "Metrics",
                },
              ]}
            />
          )}

          <Typography variant={"h5"}>Matchmaking Metrics</Typography>

          <div>
            <Grid
              container
              spacing={1}
              style={{ marginTop: 16 }}
              alignItems="stretch"
            >
              {matchmakingMetricsData.map((metric: any, index) => (
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

            {/* <Grid
              container
              spacing={1}
              style={{ marginTop: 16 }}
              alignItems="stretch"
            >
              <Grid item xs={12} sm={12} md={8}>
                <Paper elevation={3} sx={{ p: 2 }} className="dashpaper2">
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
                      text={({ value }) => `${value} %\n+8.02% from last month`}
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
                    right={0}
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
            </Grid> */}
            {/* linear progress bars */}
            <Grid container spacing={2} style={{ marginTop: 16 }}>
              {dummyData.map((box, boxIndex) => (
                <Grid item xs={12} sm={4} lg={4} key={boxIndex}>
                  <Paper elevation={3} sx={{ p: 2 }} className="dashpaper2">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h6" mb={2}>
                        {box.title}
                      </Typography>
                      <FaRegEye />
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h6">
                        {calculateTotalValue(box.data)}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#388e3c",
                          backgroundColor: "#9ad6c3",
                          padding: "4px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        +8.02%
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={3}
                    >
                      <p>Users</p>
                      <p>from last month</p>
                    </Box>

                    {/* Scrollable box to view more items */}
                    <Box
                      mt={2}
                      maxHeight={200}
                      overflow="auto"
                      className="custom-scrollbar"
                    >
                      {box.data.map((item, index) => (
                        <Box key={index} mb={2}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box display="flex" alignItems="center">
                              <Typography>{item.country}</Typography>
                              <FaRegEye style={{ marginLeft: 8 }} />
                            </Box>
                            <Typography>{item.value}</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={item.value}
                            sx={{
                              height: 8,
                              borderRadius: 5,
                              backgroundColor: "#f0f0f0",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: "#FF7F50",
                              },
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Typography
              variant={"h5"}
              sx={{
                marginTop: "1.5rem",
              }}
            >
              Profile Types
            </Typography>
            <Grid
              container
              spacing={1}
              style={{ marginTop: 0 }}
              alignItems="stretch"
            >
              {profile_types.map((metric: any, index) => (
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

            <Grid container spacing={1} style={{ marginTop: 16 }}>
              {userData.map((metric: any, index) => (
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
        </Card>
      </div>
    </Fragment>
  );
};

export default MatchmakingMetrics;
