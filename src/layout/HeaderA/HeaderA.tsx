import React, { Fragment, useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Input, Layout } from "antd";
import SideBarData from "../SideBar/SideBarData";
import { LogoutOutlined } from "@ant-design/icons";
import "../../components/css/style.css";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
//@ts-ignore
import userIcon from "../../assets/icon/user.jpeg";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { ToastContainer, toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import ToastMessage from "../../page/facilator/ToastMessage/ToastMessage";
import { logoutApi, profileApi } from "../../components/apiFile/Service";
import FacilityManagement from "../../page/facilator/FacilityManagement/FacilityManagement";
import Booking from "../../page/facilator/Booking/Booking";
import Dashboard from "../../page/facilator/Dashboard/Dashboard";
import PartnerSettlements from "../../page/facilator/PartnerSettlements/PartnerSettlements";
import PartnerCalculation from "../../page/PartnerCalculation/PartnerCalculation";
import NewDashboard from "../../page/facilator/Dashboard/NewDashboard"
import MatchmakingMetrics from "../../page/facilator/Matchmaking/MatchmakingMetrics";
import "../HeaderA/HeaderA.css";
import Coupons from "../../page/facilator/Coupons/Coupons";
import SkillLevels from "../../page/facilator/Masters/SkillLevels/SkillLevels";
import RegisteredUsers from "../../page/facilator/Events/RegisteredUsers";
import Events from "../../page/facilator/Events/Events";
import EventOrganizers from "../../page/facilator/Masters/SkillLevels/Organizer";
import EventVenue from "../../page/facilator/Masters/EventVenue/eventVenue";
import EventCancelandRefund from "../../page/facilator/Events/EventCancelandRefund";
import Bookings from "../../page/Bookings/Bookings";
import Settings from "../../page/facilator/Settings/Settings";
import RegisteredUser from "../../page/Registered-Users/Registered-Users";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify-icon/react";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedUser, setLoggedUserDetails, setRoleIs } from "../../redux/Slices/LoginSlice";
import ManageRoles from "../../page/Manage-Roles/ManageRoles";
import AdminUsers from "../../page/Admin-Users/AdminUsers";
import CreateRole from "../../page/Manage-Roles/CreateRole";
import sidebarMenuData from "../SideBar/SideberMenuData";
import ManageCourt from "../../page/facilator/FacilityManagement/ManageCourt";
import Banners from "../../page/Banners/Banners";
import Offers from "../../page/Offers/Offers";
import Coaches from "../../page/Coaches/Coaches";
import CoachingProgram from "../../page/CoachingProgram/CoachingProgram";
import CoachingSessions from "../../page/CoachingSessions/CoachingSessions";
import { FaIndent, FaOutdent } from "react-icons/fa";
import ManageTimePrice from "../../page/facilator/FacilityManagement/ManageTimePrice";
import AppNotification from "../../page/AppNotification/AppNotification";
import ManageClosingDay from "../../page/facilator/FacilityManagement/ManageClosingDay";
import NewBooking from "../../page/facilator/Booking/NewBooking";
import Chat from "../../page/Chat/Chat";
import TutorialVideos from "../../page/Tutorial-Videos/TutorialVideos";
import HowTo from "../../page/How To/HowTo";
import Packages from "../../page/facilator/FacilityManagement/Packages";
import PlatformCharges from "../../page/facilator/FacilityManagement/PlatformCharges";
import MIS from "../../page/MIS/MIS";
import MembershipList from "../../page/facilator/FacilityManagement/MembershipList";
import FacilityPaymentConfig from "../../page/FacilityPaymentConfig/FacilityPaymentConfig";
import Membership from "../../page/MemberShip/Membership";
import Skilllevels from "../../page/SkillLevel/RatingSkilllevels";
import UserMembershipList from "../../page/UserMembershipList/UserMembershipList";
import EventFlyers from "../../page/Event Flyers/EventFlyers";
import HomePageTiles from "../../page/HomePageTiles/HomePageTiles";
import NewTimePrice from "../../page/facilator/FacilityManagement/NewTimePrice";
import CoachesApproval from "../../page/CoachesApproval/CoachesApproval";
import PaymentView from "../../page/PaymentView//PaymentView";
import CancelAndRefund from "../../page/CancelAndRefund/CancelAndRefund";
import Configs from "../../page/Configs/Configs";
import UnregisteredUsers from "../../page/UnregisteredUsers/UnregisteredUsers";
import DebitCreditPiCoins from "../../page/PiCoins/DebitCreditPiCoins";
import { setCreatedRoles, setSelectedFacility } from "../../redux/Slices/DataSlice";
import ClipLoader from "react-spinners/ClipLoader";
import DashboardV2 from "../../page/facilator/Dashboard/DashboardV2";
import CreateMatch from "./../../page/CreateMatch/CreateMatch";
import PicoinsSummaryDashboard from "../../page/PiCoins-Dashboard/PicoinsSummaryDashboard";
import MatchMetrics from "../../page/facilator/Matchmaking/MatchMetrics";
import ManageUGTs from "../../page/facilator/Events/ManageUGTs";
import DynamicPricing from "../../page/facilator/FacilityManagement/DynamicPricing";

// import WebPushNotification from "../../page/WebPushNotification/WebPushNotification";



const { Header } = Layout;
const { Search } = Input;

const HeaderA = ({ route }) => {
  let location = useLocation();
  const navigate = useNavigate();
  const loggedInUser: any = localStorage.getItem("auth");
  const dispatch = useDispatch();
  const decoded: any = jwt_decode(loggedInUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Screen Responsive media screen
  const [matches, setMatches] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );
  const [menuOpen, setMenuOpen] = useState(matches ? false : true);
  const { register, watch, setValue, reset, handleSubmit } = useForm()
  const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)

  let searchKeyword = watch("search");

  const logoutHandler = async () => {
    setLoading(true);
    let response = await logoutApi(loggedInUser);
    if (response.error == false) {
      toast(<ToastMessage body={response.message} type="success" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        localStorage.removeItem("auth");
        localStorage.clear();
        sessionStorage.clear();
        setLoading(false);
        dispatch(setLoggedUser(false));
        dispatch(setRoleIs(''));
        dispatch(setCreatedRoles([]));
        dispatch(setLoggedUserDetails([]));
        dispatch(setSelectedFacility({}));
        navigate("/Login");
      }, 3000);
    } else {
      // toast(<ToastMessage body={response.message} type="error" />, {
      //   position: "top-right",
      //   autoClose: 5000,
      //   hideProgressBar: true,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      // });
      localStorage.removeItem("auth");
      localStorage.clear();
      sessionStorage.clear();
      setLoading(false);
      dispatch(setLoggedUser(false));
      dispatch(setRoleIs(''));
      navigate("/Login");
    }
  };
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const onSearch = (value: string) => {
    console.log(value);
  };
  const [userDetail, setUserDetail] = useState([]);
  const [userImage, setUserImage] = useState([]);
  const profilesUrl = async () => {
    let response = await profileApi(loggedInUser);
    if (response?.message == "Please register to Sign-In.") {
      localStorage.removeItem("auth");
      localStorage.clear();
      sessionStorage.clear();
      dispatch(setLoggedUser(false));
      dispatch(setRoleIs(''));
      navigate("/Login");
    }
    setUserImage(response?.data?.profile_url);
    setUserDetail(response?.data?.firstname);
  };
  useEffect(() => {
    profilesUrl();
  }, []);

  useEffect(() => {
    window
      .matchMedia("(max-width: 768px)")
      .addEventListener("change", (e) => {
        setMatches(e.matches);
        setMenuOpen(false);
      });
  }, [route]);

  const onToggle = () => {
    setMenuOpen(!menuOpen);
  };
  const onPageToggle = () => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  };
  const onSubmit = (data) => {
    navigate(`/${data.search}`)
  }

  const roleSideBar = useSelector((state: any) => state.alldata.sideBardata)
  const sidebar = roleSideBar.length != 0 ? roleSideBar : sidebarMenuData
  const currentPath = location.pathname;

  function findMenuItemByPath(sidebar, currentPath) {
    for (const menuItem of sidebar) {
      if (menuItem.path === currentPath) {
        return menuItem;
      } else if (menuItem.children && menuItem.children.length > 0) {
        const childResult = findMenuItemByPath(menuItem.children, currentPath);
        if (childResult) {
          return childResult;
        }
      }
    }
    return null;
  }

  return (
    <Fragment>
      <Header className="nav-header">
        <div
          className={`nav-inner ${
            !menuOpen
              ? `nav-close${matches ? "-mobile" : ""}`
              : `nav-open${matches ? "-mobile" : ""}`
          }`}
        >
          <div className="mobile-menu">
            {matches && <FaIndent onClick={() => setMenuOpen(!menuOpen)} />}
          </div>
          {/* {menuOpen && <FaOutdent onClick={() => setMenuOpen(!menuOpen)} />} */}

          {/* <form className='universal-search-form' onSubmit={handleSubmit(onSubmit)} id='universal-search-form'>
            <div className="form-column">
              <div className="form-group">
                <Icon icon="gravity-ui:magnifier" />
                <input
                  className="form-field"
                  type="text"
                  id="universal-search"
                  placeholder="Search"
                  {...register('search', { required: true })}
                />
                {
                  searchKeyword && <Icon icon="charm:cross" onClick={() => reset()} />
                }
              </div>
            </div>
          </form> */}
          <div className="nav-profile">
            {/* <WebPushNotification matches={matches} menuOpen={menuOpen} onToggle={onPageToggle} modulePermissionsData={findMenuItemByPath(sidebar, currentPath)} /> */}
            <Box>
              <div className="header-profile">
                <div className="header-profile-info">
                  <span>Welcome , {userDetail}</span>
                  <span className="roleName">
                    {loggedUserDetails?.rolename}
                  </span>
                </div>
                <Tooltip title="Profile">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src={`${userImage}`} />
                  </IconButton>
                </Tooltip>
              </div>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography className="text-align">
                    <span onClick={logoutHandler}>
                      <LogoutOutlined />
                      &nbsp;Logout
                    </span>
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          </div>
        </div>
        <SideBarData matches={matches} menuOpen={menuOpen} onToggle={onToggle} />
        {loading &&
          <div className="loader-container-logout">
            <ClipLoader
              color={"#F17121"}
              loading={loading}
              size={100}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            <div className="loader-text">Logging out please wait...</div>
          </div>}
      </Header>

      {location.pathname === "/Dashboard-hidden" && (
        <Dashboard matches={matches} menuOpen={menuOpen} onToggle={onPageToggle} modulePermissionsData={findMenuItemByPath(sidebar, currentPath)} />
      )}
      {location.pathname === "/Dashboard" && (
        <Dashboard
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/PicoinsSummaryDashboard" && (
        <PicoinsSummaryDashboard matches={matches} menuOpen={menuOpen} onToggle={onPageToggle} modulePermissionsData={findMenuItemByPath(sidebar, currentPath)} />
      )}
      {location.pathname === "/PartnerSettlements" && (
        <PartnerSettlements matches={matches} menuOpen={menuOpen} onToggle={onPageToggle} modulePermissionsData={findMenuItemByPath(sidebar, currentPath)} />
      )}
        {location.pathname === "/PartnerCalculation" && (
        <PartnerCalculation matches={matches} menuOpen={menuOpen} onToggle={onPageToggle} modulePermissionsData={findMenuItemByPath(sidebar, currentPath)} />
      )}

      {location.pathname === "/NewDashboard" && (
        <NewDashboard
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}

      {location.pathname === "/Dashboard-V2" && (
        <DashboardV2
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}

      {location.pathname === "/MatchmakingMetrics" && (
        <MatchmakingMetrics
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}

      {location.pathname === "/MatchMetrics" && (
        <MatchMetrics
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      
      {location.pathname === "/FacilityManagement" && (
        <FacilityManagement
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/ManageCourt" && (
        <ManageCourt
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/Booking" && (
        <Booking
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/ManageEvents" && (
        <Events
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/ManageUGTs" && (
        <ManageUGTs
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/Settings" && (
        <Settings
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/Coupons" && (
        <Coupons
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/RegisteredUser" && (
        <RegisteredUser
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/Configs" && (
        <Configs matches={matches} menuOpen={menuOpen} onToggle={onPageToggle} modulePermissionsData={findMenuItemByPath(sidebar, currentPath)} />
      )}

      {location.pathname === "/SkillLevels" && (
        <SkillLevels
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/RegisteredUsers" && (
        <RegisteredUsers
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/Organizer" && (
        <EventOrganizers
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/BookingsData" && (
        <Bookings
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/CancelandRefund" && (
        <CancelAndRefund matches={matches} menuOpen={menuOpen} onToggle={onPageToggle} modulePermissionsData={findMenuItemByPath(sidebar, currentPath)} />
      )}
      {location.pathname === "/EventVenue" && (
        <EventVenue
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
       {location.pathname === "/EventCancelandRefund" && (
        <EventCancelandRefund matches={matches} menuOpen={menuOpen} onToggle={onPageToggle} modulePermissionsData={findMenuItemByPath(sidebar, currentPath)} />
      )}
      {location.pathname === "/ManageRoles" && (
        <ManageRoles
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/AdminUsers" && (
        <AdminUsers
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/Banners" && (
        <Banners
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/TutorialVideos" && (
        <TutorialVideos
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/HowTo" && (
        <HowTo matches={matches} menuOpen={menuOpen} onToggle={onPageToggle} modulePermissionsData={findMenuItemByPath(sidebar, currentPath)} />
      )}
      {location.pathname === "/Promotions" && (
        <Offers
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/HourlyPasses" && (
        <Packages
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/PaymentView" && (
        <PaymentView matches={matches} menuOpen={menuOpen} onToggle={onPageToggle} modulePermissionsData={findMenuItemByPath(sidebar, currentPath)} />
      )}
      {location.pathname === "/UnregisteredUsers" && (
        <UnregisteredUsers matches={matches} menuOpen={menuOpen} onToggle={onPageToggle} modulePermissionsData={findMenuItemByPath(sidebar, currentPath)} />
      )}

      {location.pathname === "/PlatformCharges" && (
        <PlatformCharges
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/CreateRole" && (
        <CreateRole
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/Coaches" && (
        <Coaches
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/CoachingProgram" && (
        <CoachingProgram
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/CoachingSessions" && (
        <CoachingSessions
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/CoachesApproval" && (
        <CoachesApproval
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/CreateMatch" && (
        <CreateMatch matches={matches} menuOpen={menuOpen} onToggle={onPageToggle} modulePermissionsData={findMenuItemByPath(sidebar, currentPath)} />
      )}
      {location.pathname === "/AppNotification" && (
        <AppNotification
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/ManageTimePrice" && (
        <ManageTimePrice
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/NewTimePrice" && (
        <NewTimePrice matches={matches} menuOpen={menuOpen} onToggle={onPageToggle} modulePermissionsData={findMenuItemByPath(sidebar, currentPath)} />
      )}
      {location.pathname === "/ManageClosingDay" && (
        <ManageClosingDay
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/DynamicPricing" && (
        <DynamicPricing
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/Chat" && (
        <Chat
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/" && (
        <NewBooking
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/Bookings" && (
        <NewBooking
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/HourlyPassesList" && (
        <MembershipList
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {/* {location.pathname === "/WebPushNotification" && (
        <WebPushNotification matches={matches} menuOpen={menuOpen} onToggle={onPageToggle} modulePermissionsData={findMenuItemByPath(sidebar, currentPath)} />
      )} */}
      {location.pathname === "/PaymentConfig" && (
        <FacilityPaymentConfig
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
        {location.pathname === "/MIS" && (
        <MIS
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/Membership" && (
        <Membership
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/SkillLevel" && (
        <Skilllevels
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/Membershiplist" && (
        <UserMembershipList
          matches={matches}
          menuOpen={menuOpen}
          onToggle={onPageToggle}
          modulePermissionsData={findMenuItemByPath(sidebar, currentPath)}
        />
      )}
      {location.pathname === "/EventFlyers" && (
        <EventFlyers matches={matches} menuOpen={menuOpen} onToggle={onPageToggle} modulePermissionsData={findMenuItemByPath(sidebar, currentPath)} />
      )}
      {location.pathname === "/HomePageTiles" && (
        <HomePageTiles matches={matches} menuOpen={menuOpen} onToggle={onPageToggle} modulePermissionsData={findMenuItemByPath(sidebar, currentPath)} />
      )}
      {location.pathname === "/DebitCreditPiCoins" && (
        <DebitCreditPiCoins matches={matches} menuOpen={menuOpen} onToggle={onPageToggle} modulePermissionsData={findMenuItemByPath(sidebar, currentPath)} />
      )}

      <ToastContainer
        toastStyle={{ backgroundColor: "#032037", color: "#ffffff" }}
      />
    </Fragment>
  );
};
export default HeaderA;
