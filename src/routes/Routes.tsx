import React, { useContext } from "react";
import { Routes as Router, Route, Navigate } from "react-router-dom";
// import { AuthContext } from "./AuthContext";
import Login from "../page/Auth/Login/Login";
import NewsArticle from "../page/facilator/NewsArticle/NewsArticle";
import Notifications from "../page/facilator/Notifications/Notifications";
import ErrorPage from "../page/Auth/Error/ErrorPage";
import ForgotPassword from "../page/Auth/ForgotPassword/ForgotPassword";
import EnterOtp from "../page/Auth/Otp/EnterOtp";
import ResetPassword from "../page/Auth/ResetPassword/ResetPassword";
// import SideBarData from "../layout/SideBarData";
// import Protected from "./Protected";
import HeaderA from "../layout/HeaderA/HeaderA";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedUser } from "../redux/Slices/LoginSlice";
import { AuthContext } from "./AuthContext";
import TestShare from "../components/AppShare/TestShare";
import MatchShare from "../components/AppShare/MatchShare";
import ClubShare from "../components/AppShare/ClubShare";
import CoachShare from "../components/AppShare/CoachShare";
import CoachProgramShare from "../components/AppShare/CoachProgramShare";
import OffersShare from "../components/AppShare/OffersShare";
import TournamentsShare from "../components/AppShare/TournamentsShare";
import ReferalProgram from "../components/AppShare/ReferalProgram";
import SharePosts from "../components/AppShare/SharePosts";
import ShareProfile from "../components/AppShare/ShareProfile";




type Props = {};
const PrivateRoutes = ({ children }: any) => {
  const token = localStorage.getItem("auth");
  const Logged = useSelector((state: any) => state.user.isLogged)
  const { authenticated } = useContext(AuthContext);
  if (!token) {
    if (Logged) {
      return <Navigate to='/' />
    } else {
      return <Navigate to="/login" replace />
    }
  } else {
    return children;
  }
  // return <Outlet />;
};
const Routes = (props: Props) => {
  // const { authenticated } = useContext(AuthContext);
  // const dispatch = useDispatch();
  // dispatch(setLoggedUser(false))
  const Logged = useSelector((state: any) => state.user.isLogged)

  return (
    <Router>
      <Route index path="/test-share" element={<TestShare />} />
      <Route index path="/mm/:matchId" element={<MatchShare />} />
      <Route index path="/cb/:clubId" element={<ClubShare />} />
      <Route index path="/ch/:coachId" element={<CoachShare />} />
      <Route index path="/chp/:programId" element={<CoachProgramShare />} />
      <Route index path="/of/:offerId" element={<OffersShare />} />
      <Route index path="/st/:tournamentId" element={<TournamentsShare />} />
      <Route index path="/rf/:referalProgramId" element={<ReferalProgram />} />
      <Route index path="/ps/:sharePostsId" element={<SharePosts />} />
      <Route index path="/sp/:shareProfileId" element={<ShareProfile />} />
      {Logged == false ? <>
        <Route index path="/" element={<Login />} />
        <Route index path="/Login" element={<Login />} />
        <Route index path="/ForgotPassword" element={<ForgotPassword />} />
        <Route index path="/EnterOtp" element={<EnterOtp />} />
        <Route index path="/ResetPassword" element={<ResetPassword />} />
        <Route path="*" element={<ErrorPage />} />
      </> :
        <>
          <Route path="*" element={<ErrorPage />} />
          <Route
            path="/"
            element={
              <PrivateRoutes>
                <HeaderA route="Dashboard" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/Dashboard"
            element={
              <PrivateRoutes>
                <HeaderA route="Dashboard" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/PicoinsSummaryDashboard"
            element={
              <PrivateRoutes>
                <HeaderA route="PicoinsSummaryDashboard" />
              </PrivateRoutes>
            }
          />
           <Route
            path="/PartnerSettlements"
            element={
              <PrivateRoutes>
                <HeaderA route="PartnerSettlements" />
              </PrivateRoutes>
            }
          />
          <Route path="/NewDashboard" element={
            <PrivateRoutes>
              <HeaderA route="NewDashboard" />
            </PrivateRoutes>
          }
          />
          <Route path="/Dashboard-V2" element={
            <PrivateRoutes>
              <HeaderA route="Dashboard-V2" />
            </PrivateRoutes>
          }
          />

          <Route path="/MatchmakingMetrics"
            element={
              <PrivateRoutes>
                <HeaderA route="MatchmakingMetrics" />
              </PrivateRoutes>
            }
          />
          <Route path="/MatchMetrics"
            element={
              <PrivateRoutes>
                <HeaderA route="MatchMetrics" />
              </PrivateRoutes>
            }
          />
          <Route
          path="/PartnerCalculation"
          element={
            <PrivateRoutes>
              <HeaderA route="PartnerCalculation" />
            </PrivateRoutes>
          }
          />
           <Route
          path="/MIS"
          element={
            <PrivateRoutes>
              <HeaderA route="MIS" />
            </PrivateRoutes>
          }
          />
          <Route
            path="/Booking"
            element={
              <PrivateRoutes>
                <HeaderA route="Booking" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/UnregisteredUsers"
            element={
              <PrivateRoutes>
                <HeaderA route="UnregisteredUsers" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/FacilityManagement"
            element={
              <PrivateRoutes>
                <HeaderA route="FacilityManagement" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/ManageCourt"
            element={
              <PrivateRoutes>
                <HeaderA route="ManageCourt" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/ManageEvents"
            element={
              <PrivateRoutes>
                <HeaderA route="ManageEvents" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/ManageUGTs"
            element={
              <PrivateRoutes>
                <HeaderA route="ManageUGTs" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/Coupons"
            element={
              <PrivateRoutes>
                <HeaderA route="Coupons" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/SkillLevels"
            element={
              <PrivateRoutes>
                <HeaderA route="SkillLevels" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/Organizer"
            element={
              <PrivateRoutes>
                <HeaderA route="Organizer" />
              </PrivateRoutes>
            }
          />
           <Route
            path="/CreateMatch"
            element={
              <PrivateRoutes>
                <HeaderA route="CreateMatch" />
              </PrivateRoutes>  
            }
          />
          <Route
            path="/BookingsData"
            element={
              <PrivateRoutes>
                <HeaderA route="BookingsData" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/CancelandRefund"
            element={
              <PrivateRoutes>
                <HeaderA route="CancelandRefund" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/NewTimePrice"
            element={
              <PrivateRoutes>
                <HeaderA route="NewTimePrice" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/Configs"
            element={
              <PrivateRoutes>
                <HeaderA route="Configs" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/RegisteredUser"
            element={
              <PrivateRoutes>
                <HeaderA route="RegisteredUser" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/EventVenue"
            element={
              <PrivateRoutes>
                <HeaderA route="EventVenue" />
              </PrivateRoutes>
            }
          />
           <Route
            path="/EventCancelandRefund"
            element={
              <PrivateRoutes>
                <HeaderA route="EventCancelandRefund" />
              </PrivateRoutes>
            }
          />

          <Route
            path="/RegisteredUsers"
            element={
              <PrivateRoutes>
                <HeaderA route="/RegisteredUsers" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/NewsArticle"
            element={
              <PrivateRoutes>
                <NewsArticle />
              </PrivateRoutes>
            }
          />
          <Route
            path="/Notifications"
            element={
              <PrivateRoutes>
                <Notifications />
              </PrivateRoutes>
            }
          />
          <Route
            path="/Settings"
            element={
              <PrivateRoutes>
                <HeaderA route="Settings" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/ManageRoles"
            element={
              <PrivateRoutes>
                <HeaderA route="ManageRoles" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/AdminUsers"
            element={
              <PrivateRoutes>
                <HeaderA route="AdminUsers" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/Banners"
            element={
              <PrivateRoutes>
                <HeaderA route="Banners" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/Promotions"
            element={
              <PrivateRoutes>
                <HeaderA route="Promotions" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/Bookings"
            element={
              <PrivateRoutes>
                <HeaderA route="Bookings" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/CreateRole"
            element={
              <PrivateRoutes>
                <HeaderA route="CreateRole" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/Coaches"
            element={
              <PrivateRoutes>
                <HeaderA route="Coaches" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/CoachingProgram"
            element={
              <PrivateRoutes>
                <HeaderA route="CoachingProgram" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/CoachingSessions"
            element={
              <PrivateRoutes>
                <HeaderA route="CoachingSessions" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/CoachesApproval"
            element={
              <PrivateRoutes>
                <HeaderA route="CoachesApproval" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/ManageTimePrice"
            element={
              <PrivateRoutes>
                <HeaderA route="ManageTimePrice" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/ManageClosingDay"
            element={
              <PrivateRoutes>
                <HeaderA route="ManageClosingDay" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/DynamicPricing"
            element={
              <PrivateRoutes>
                <HeaderA route="DynamicPricing" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/AppNotification"
            element={
              <PrivateRoutes>
                <HeaderA route="AppNotification" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/Chat"
            element={
              <PrivateRoutes>
                <HeaderA route="Chat" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/TutorialVideos"
            element={
              <PrivateRoutes>
                <HeaderA route="TutorialVideos" />
              </PrivateRoutes>
            }
          />
           <Route
            path="/HowTo"
            element={
              <PrivateRoutes>
                <HeaderA route="HowTo" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/WebPushNotification"
            element={
              <PrivateRoutes>
                <HeaderA route="WebPushNotification" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/HourlyPasses"
            element={
              <PrivateRoutes>
                <HeaderA route="HourlyPasses" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/PaymentView"
            element={
              <PrivateRoutes>
                <HeaderA route="PaymentView" />
              </PrivateRoutes>
            }
          />

          <Route
            path="/PlatformCharges"
            element={
              <PrivateRoutes>
                <HeaderA route="PlatformCharges" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/HourlyPassesList"
            element={
              <PrivateRoutes>
                <HeaderA route="HourlyPassesList" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/PaymentConfig"
            element={
              <PrivateRoutes>
                <HeaderA route="PaymentConfig" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/Membership"
            element={
              <PrivateRoutes>
                <HeaderA route="Membership" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/SkillLevel"
            element={
              <PrivateRoutes>
                <HeaderA route="SkillLevel" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/Membershiplist"
            element={
              <PrivateRoutes>
                <HeaderA route="Membershiplist" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/EventFlyers"
            element={
              <PrivateRoutes>
                <HeaderA route="EventFlyers" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/HomePageTiles"
            element={
              <PrivateRoutes>
                <HeaderA route="HomePageTiles" />
              </PrivateRoutes>
            }
          />
          <Route
            path="/DebitCreditPiCoins"
            element={
              <PrivateRoutes>
                <HeaderA route="DebitCreditPiCoins" />
              </PrivateRoutes>
            }
          />        
        </>}
    </Router >

  );
};
export default Routes;
