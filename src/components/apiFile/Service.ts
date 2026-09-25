import { filter } from 'lodash';
import { deactivateTournament, getAllPiCoinsTxn } from './Constants';
import * as Constants from "../apiFile/Constants";
import { assign } from 'lodash';

export const AddNewUserAPI = async (user, loginData) => {
    try {
        const response = await fetch(`${Constants.SignupUrl}`, {
            method: "POST",
            headers: {
                // 'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(loginData),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const EditUserAPI = async (user, id, loginData) => {
    try {
        const response = await fetch(`${Constants.EditUserProfileUrl}${id}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(loginData),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const loginApi = async (email, password, type) => {
    try {
        const response = await fetch(`${Constants.LoginUrl}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                login_id: email,
                password: password,
                login_type: type,
            }),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const logoutApi = async (user) => {
    try {
        const response = await fetch(`${Constants.LogoutUrl}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}



export const getFacilityApi = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllFacilityUrl}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getFacilityByIdApi = async (user, id) => {
    try {
        const response = await fetch(`${Constants.getAllFacilityByIdUrl}${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const addFacilityApi = async (user, loginData) => {
    try {
        const response = await fetch(`${Constants.createUrl}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(loginData),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const CreateFacilityUser = async (user, loginData) => {
    try {
        const response = await fetch(`${Constants.CreateFacilityUserUrl}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(loginData),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteFacilityAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteFacility}/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const facilityFilterAPI = async (user, name, city, address, sport_type, pincode, court_type) => {
    try {
        const response = await fetch(`${Constants.filterFacilityURL}?name=${name}&city=${city}&address=${address}&sport_type=${sport_type}&pincode=${pincode}&court_type=${court_type}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const bookingConfirmApi = async (id, user, dataConfirmed) => {
    try {
        const response = await fetch(`${Constants.confirmBookingUrl}/${id}`, {
            method: "PATCH",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(dataConfirmed),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const bookingStatusApi = async (mainLangQ, dateBooking, user) => {
    try {
        const response = await fetch(`${Constants?.getBookingStatusUrl}/${mainLangQ}/booking/status/${dateBooking}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getAddPlayersBookingsAPI = async (user, bookingId) => {
    try {
        const response = await fetch(`${Constants?.getAddPlayersBookings}${bookingId}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const userInfoApi = async (userInfo, user) => {
    try {
        const response = await fetch(`${Constants.userDetailsUrl}/${userInfo}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const userIdApi = async (bookingUser, user) => {
    try {
        const response = await fetch(`${Constants.userDetailsUrl}/${bookingUser}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return await response.json();
    }
    catch (e) {
        return { e }
    }
}

export const profileApi = async (user) => {
    try {
        const response = await fetch(`${Constants.profileUrl}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return await response.json();
    }
    catch (e) {
        return { e }
    }
}

export const forgotPasswordApi = async (data) => {
    try {
        const response = await fetch(`${Constants.ForgotPwdUrl}`, {
            method: "POST",
            headers: {

                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return await response.json();
    }
    catch (e) {
        return { e }
    }
}
export const bookingApi = async (user, loginData) => {
    try {
        const response = await fetch(`${Constants.confirmBookingUrl}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(loginData),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const resendOtpApi = async (data) => {
    try {
        const response = await fetch(`${Constants.ResendOtpUrl}`, {
            method: "POST",
            headers: {

                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return await response.json();
    }
    catch (e) {
        return { e }
    }
}

export const verifyOtpApi = async (data) => {
    try {
        const response = await fetch(`${Constants.VerifyOtpUrl}`, {
            method: "POST",
            headers: {

                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return await response.json();
    }
    catch (e) {
        return { e }
    }
}

export const resetPasswordApi = async (data) => {
    try {
        const response = await fetch(`${Constants.ResetPasswordUrl}`, {
            method: "POST",
            headers: {

                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return await response.json();
    }
    catch (e) {
        return { e }
    }
}
//_____________RegisteredUsers______________________//

export const getAllUsers = async (user) => {
    try {
        const response = await fetch(`${Constants.GetAllUsers}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getAllUserslist = async (user, page, limit) => {
    try {
        const response = await fetch(`${Constants.GetAllUserslists}${page}/${limit}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


export const getAllUsersByUserIDAPI = async (user, UserId) => {
    try {
        const response = await fetch(`${Constants.getAllUsersByUserID}${UserId}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const RegisteredUserFilterAPI = async (page, limit, user, fullname, email, mobileno, skill_level, city, current_city, pincode, startDate, endDate, state) => {
    try {
        const response = await fetch(`${Constants.filterAllUsers}${page}/${limit}?fullname=${fullname}&email=${email}&mobileno=${mobileno}&skill_level=${skill_level}&city=${city}&current_city=${current_city}&pincode=${pincode}&startDate=${startDate}&endDate=${endDate}&state=${state}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const editFacilityAPI = async (user, id, data) => {

    try {
        const response = await fetch(`${Constants.editFacilityUrl}${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

// ------------------ Tournaments ----------------------- //

export const getAllTournamentsAPI = async (user) => {
    try {
        const response = await fetch(`${Constants.getAdminAllTournaments}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const createEventAPI = async (user, data) => {

    try {
        const response = await fetch(`${Constants.createTournamentURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const editEventAPI = async (user, data, id) => {
    data.max_registration = String(data.max_registration)
    try {
        const response = await fetch(`${Constants.editTournamentURL}/${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteEventAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteTournamentURL}/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
};

export const deactivateTournaments = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deactivateTournament}/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
};

export const getUpcomingEventList = async (user) => {
    try {
        const response = await fetch(`${Constants.upComingEventsList}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
};

export const editEventCategory = async (user, data, id) => {
    // data.max_registration = String(data.max_registration)
    // console.log("🚀 ~ file: Service.tsx:editEventCategory ~ data:", data);
    try {
        const response = await fetch(`${Constants.updateCategory}/${id}`, {
            method: "PATCH",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteEventCategory = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteCategory}/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

// tournament-v2?page=1&limit=10&tag=1&game=2&price=3&name=4&city=5&keyword=6

export const getAllUGTs = async (user, page, limit, tag, game, price, name, city, keyword, lat, lon, tournament_version ) => {
    try {
        const response = await fetch(`${Constants.filterUGT}page=${page}&limit=${limit}&tag=${tag}&game=${game}&price=${price}&name=${name}&city=${city}&keyword=${keyword}&lat=${lat}&lon=${lon}&admin=true&tournament_version=${tournament_version}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getUgtDetails = async (user, event_id) => {
    try {
        const response = await fetch(`${Constants.getUGTbyId}${event_id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

// ------------------ RegisteredUser ----------------------- //

export const getAllRegisteredUsersAPI = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllRegisteredUsersURL}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getEventUsersAPI = async (user, event_id) => {
    try {
        const response = await fetch(`${Constants.getEventUsersURL}${event_id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteEventRegistrationAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteEventRegistrationURL}`, {
            method: "POST",  // Change method to POST
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                id: id,
                partner: false,  // Add partner: false to the request body
            }),
        });

        // Check if the response status is OK (200-299)
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to delete registration");
        }

        // If the response is successful, return the parsed JSON
        const data: any[] = await response.json();
        return { error: null, data };
    } catch (error) {
        console.error("Error deleting registration:", error);
        return { error: error };
    }
};




export const getAllRegisteredUsersFilterAPI = async (user, payment_status, tournament_id, user_name, venue, event_date, booked_date, event_name, sport_type, user_id, organizerId) => {
    try {
        const response = await fetch(`${Constants.getAllRegisteredUsersFilterURL}?tournament_id=${tournament_id}&payment_status=${payment_status}&booked_date=${booked_date}&event_date=${event_date}&event_name=${event_name}&user_name=${user_name}&venue=${venue}&sport_type=${sport_type}&user=${user_id}&organizer_id=${organizerId}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const TournamentFilterAPI = async (user, sport_type, id) => {
    try {
        const response = await fetch(`${Constants.TournamentFilterURL}?tournament_type=${sport_type}&facility_id=${id}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const TournamentAdminFilterAPI = async (user, sport_type, id, organizerId) => {
    try {
        const response = await fetch(`${Constants.TournamentAdminFilterURL}?tournament_type=${sport_type}&user_id=${id}&organizer_id=${organizerId}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const addRegisteredUserAPI = async (user, data) => {

    try {
        const response = await fetch(`${Constants.AddRegisteredUserURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const editRegisteredAPI = async (user, data, id) => {

    try {
        const response = await fetch(`${Constants.editAllRegisteredUserURL}${id}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getAllUnregisteredUsersAPI = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllUnregisteredUsersURL}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        return response.json();
    } catch (e) {
        return { e };
    }
}


// ------------------ Coupons ----------------------- //

export const getAllCouponsAPI = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllCouponsURL}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const createCouponAPI = async (user, data) => {

    try {
        const response = await fetch(`${Constants.createNewCouponURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const editCouponAPI = async (user, data, id) => {

    try {
        const response = await fetch(`${Constants.editCouponURL}/${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteCouponAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteCouponURL}/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const CheckCouponAPI = async (user, name) => {
    try {
        const response = await fetch(`${Constants.checkCouponURL}?coupon_name=${name}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const CheckBookingCouponAPI = async (user, data) => {
    try {
        const response = await fetch(`${Constants.checkCouponURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const CouponFilterAPI = async (user, name, type, sport_type) => {
    try {
        const response = await fetch(`${Constants.filterCouponURL}?coupon_name=${name}&coupon_for=${type}&sport_type=${sport_type}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const ActiveCouponsAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.activeCoupons}/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in ActiveCouponsAPI:", error);
        return { error };
    }
};


// ------------------ Skill Levels ----------------------- //

export const getAllSkillLevelsAPI = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllSkillLevelsURL}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const createSkillLevelAPI = async (user, data) => {

    try {
        const response = await fetch(`${Constants.createNewSkillLevelURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const editSkillLevelAPI = async (user, data, id) => {

    try {
        const response = await fetch(`${Constants.editSkillLevelURL}/${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteSkillLevelAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteSkillLevelURL}/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

// ------------------ Organizers ----------------------- //

export const getAllOrganizersAPI = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllOrganizersURL}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const createOrganizerAPI = async (user, data) => {

    try {
        const response = await fetch(`${Constants.createNewOrganizerlURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const editOrganizerAPI = async (user, data, id) => {

    try {
        const response = await fetch(`${Constants.editOrganizerURL}/${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteOrganizerAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteOrganizerURL}/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

// ------------------ Event Venue ----------------------- //

export const getAllEventVenuesAPI = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllEventVenueURL}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const createEventVenueAPI = async (user, data) => {

    try {
        const response = await fetch(`${Constants.createNewEventVenuelURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


export const getEventVenuesUsersAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.userEventVenueURL}/${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


export const editEventVenueAPI = async (user, data, id) => {

    try {
        const response = await fetch(`${Constants.editEventVenueURL}/${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteEventVenueAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteEventVenueURL}/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const venueFilterAPI = async (user, name, city, sport_type, pincode, user_id) => {
    try {
        const response = await fetch(`${Constants.filterVenueURL}?name=${name}&city=${city}&sport_type=${sport_type}&pincode=${pincode}&user=${user_id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

//Booking
export const getBookingsApi = async (user: string, page: number, pageSize: number) => {
    try {
        const response = await fetch(`${Constants.getAllBookingURL}${page}/${pageSize}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            console.error(`Failed to fetch bookings for page ${page}. Status: ${response.status}`);
            return { data: [], error: `Error fetching bookings: ${response.statusText}` };
        }

        // Parse the JSON response
        const result = await response.json();

        // Check if the API response is as expected
        if (result.code !== 'SUCCESS' || !Array.isArray(result.data)) {
            console.error(`Unexpected response format for bookings on page ${page}`, result);
            return { data: [], error: "Unexpected response format" };
        }

        return { data: result.data };
    } catch (error) {
        console.error(`Error fetching bookings for page ${page}:`, error);
        return { data: [], error };
    }
};


export const cancelBookingAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.cancelBooking}${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json"
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const cancelAndRefundBookingAPI = async (user, data) => {
    try {
        const response = await fetch(`${Constants.CancelAndRefunfBookingURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const scoresUpdateAPI = async (user, data) => {
    try {
        const response = await fetch(`${Constants.scoresUpdateURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


//payments list
export const ListOfPayments = async (user: string, page: number, pageSize: number) => {
    try {
        const response = await fetch(`${Constants.listOfPayments}${page}/${pageSize}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            console.error(`Failed to fetch page ${page}. Status: ${response.status}`);
            return { data: [], error: `Error fetching data: ${response.statusText}` };
        }

        // Parse the JSON response
        const result = await response.json();

        // Check if the API response is as expected
        if (result.code !== 'SUCCESS' || !Array.isArray(result.data)) {
            console.error(`Unexpected response format for page ${page}`, result);
            return { data: [], error: "Unexpected response format" };
        }

        return { data: result.data };
    } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        return { data: [], error };
    }
};


export const filterBookingTrasactionsAPI = async (user, page, pageSize, facility_id) => {
    try {
        const response = await fetch(`${Constants.filterTrasactionsRazorpayURL}${page}/${pageSize}?facility_id=${facility_id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    } catch (e) {
        return { e }
    }
}


export const getAllMatchesApi = async (user) => {
    try {
        const response = await fetch(`${Constants.getallmatchesURL}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    } catch (e) {
        return { e }
    }
};






//Admin Users
export const getAllAdminUsers = async (user) => {
    try {
        const response = await fetch(`${Constants.getAdminUsers}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const createAllAdminUsers = async (user, data) => {

    try {
        const response = await fetch(`${Constants.createAdminUsers}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deletenewAdminUsersAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.NewdeleteAdminUsersURL}/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

//Roles
export const getAdminRolesAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.getAdminRolesURL}${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


// Role Management


export const createRole = async (user, data) => {

    try {
        const response = await fetch(`${Constants.createRole}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const editRole = async (user, id, data) => {
    try {
        const response = await fetch(`${Constants.editRole}${id}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getAllRolesByUserId = async (user, id) => {

    try {
        const response = await fetch(`${Constants.getAllRolesByUserId}${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteRoleById = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteRoleById}${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

//SideBarData

export const GetSideBarAPI = async (user, id) => {

    try {
        const response = await fetch(`${Constants.getSideBarDataURL}${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteAdminUsers = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteAdminUsersURL}/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const AdminUserFilterAPI = async (user, fullname, email, mobileno, roleId, id) => {
    try {
        const response = await fetch(`${Constants.filterAllAdmin}fullname=${fullname}&email=${email}&mobileno=${mobileno}&roleId=${roleId}&facility_id=${id}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const AdminUsersByFacilityAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.AdminByFacility}${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const checkUsersFacilityAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.checkUsersURL}${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const CheckrulesAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.checkRulesURL}${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getEventsByVenuesAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.venueAdminURL}${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


//Banners
export const getBanners = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllBanners}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const bannerfilterAPI = async (user, active, title) => {
    try {
        const response = await fetch(`${Constants.bannerFilterAPI}active=${active}&title=${title}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const createBannerAPI = async (user, data) => {

    try {
        const response = await fetch(`${Constants.createBanners}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteBanners = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteAllBanners}${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const EditBanners = async (user, id, data) => {
    try {
        const response = await fetch(`${Constants.editAllBanners}${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

//Promotions

export const getOffers = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllOffers}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const createOfferAPI = async (user, data) => {

    try {
        const response = await fetch(`${Constants.createOffers}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteOffers = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteAllOffers}${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const EditOffers = async (user, id, data) => {
    try {
        const response = await fetch(`${Constants.editAllOffers}${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const OffersFilterAPI = async (user, brand, type, title, status) => {
    try {
        const response = await fetch(`${Constants.filterAllOffers}brand=${brand}&type=${type}&title=${title}&status=${status}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
};

export const getActiveOffer = async (user) => {
    try {
        const response = await fetch(`${Constants.activeOffer}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

// ------------- Coaches  ---------------
export const getAllCoaches = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllCoaches}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const getAllCoachesApproval = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllCoachesapproval}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const createCoach = async (user, data) => {

    try {
        const response = await fetch(`${Constants.createCoach}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const editCoach = async (user, id, data) => {
    try {
        const response = await fetch(`${Constants.editCoach}${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteCoach = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteCoaches}${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const filterCoach = async (user, name, facility, language, city, from, to, sport_type, exfrom, exto) => {
    try {
        const response = await fetch(`${Constants.filterCoaches}name=${name}&facility=${facility}&language=${language}&city=${city}&from=${from}&to=${to}&sport_type=${sport_type}&exfrom=${exfrom}&exto=${exto}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


export const filterApprovalCoach = async (user, name, facility, language, city, sport_type) => {
    try {
        const response = await fetch(`${Constants.filterCoachesApproval}name=${name}&facility=${facility}&language=${language}&city=${city}&sport_type=${sport_type}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

// ------------- Coaching-Program  ---------------
export const getAllCoachingProgram = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllCoachingProgram}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const createCoachingProgram = async (user, data) => {

    try {
        const response = await fetch(`${Constants.createCoachingProgram}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const editCoachingProgram = async (user, id, data) => {
    try {
        const response = await fetch(`${Constants.editCoachingProgram}${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteCoachingProgram = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteCoachingProgram}${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const filterCoachingProgram = async (user, coach, city, language, title, facility, sport_type) => {
    try {
        const response = await fetch(`${Constants.filterCoachingProgram}coach=${coach}&city=${city}&language=${language}&title=${title}&facility=${facility}&sport_type=${sport_type}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
// ------------- Coaching-Session  ---------------
export const getAllSession = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllSession}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const createSession = async (user, data) => {

    try {
        const response = await fetch(`${Constants.createSession}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const editSession = async (user, id, data) => {
    try {
        const response = await fetch(`${Constants.editSession}${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteSession = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteSession}${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const filterSession = async (user, title, program) => {
    try {
        const response = await fetch(`${Constants.filterSession}title=${title}&program=${program}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

// ------------- Manage Court  ---------------
export const getAllCourt = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllCourt}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const createCourt = async (user, data) => {

    try {
        const response = await fetch(`${Constants.createCourt}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const editCourt = async (user, id, data) => {
    try {
        const response = await fetch(`${Constants.editCourt}${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteCourt = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteCourt}${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const filterCourt = async (user, name, facility_id, sport_type) => {
    try {
        const response = await fetch(`${Constants.filterCourt}name=${name}&facility_id=${facility_id}&sport_type=${sport_type}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },

        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
};
// ------------- Manage Court time price ---------------
export const getAllCourtTimePrice = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllCourtTimePrice}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


export const getAllNewCourtTimePrice = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllNewTimePrice}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}



export const dynamicSlotPricing = async (user, data) => {
    try {
        const response = await fetch(`${Constants.dynamicSlotPricing}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const createCourtTimePrice = async (user, data) => {

    try {
        const response = await fetch(`${Constants.createCourtTimePrice}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const editCourtTimePrice = async (user, id, data) => {
    try {
        const response = await fetch(`${Constants.editCourtTimePrice}${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteCourtTimePrice = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteCourtTimePrice}${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const filterCourtTimePrice = async (user, facility_id, court_id, sport_type, facility_loc) => {
    try {
        const response = await fetch(`${Constants.filterCourtTimePrice}facility_id=${facility_id}&court_id=${court_id}&sport_type=${sport_type}&location=${facility_loc}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },

        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
};
// ------------- Manage Closing Days ---------------
export const getAllClosingDays = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllClosingDays}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const createClosingDays = async (user, data) => {

    try {
        const response = await fetch(`${Constants.createClosingDays}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const editClosingDays = async (user, id, data) => {
    try {
        const response = await fetch(`${Constants.editClosingDays}${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteClosingDays = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteClosingDays}${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const filterClosingDays = async (user, facility_id, court_id, sport_type, facility_loc) => {
    try {
        const response = await fetch(`${Constants.filterClosingDays}facility_id=${facility_id}&court_id=${court_id}&sport_type=${sport_type}&location=${facility_loc}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },

        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
};

// ------------- Notification  ---------------
export const createPushnotification = async (user: any, data: any) => {
    try {
        const response = await fetch(`${Constants.sendPushnotificationURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const SendPushnotificationtoallUsers = async (user: any, data: any) => {
    try {
        const response = await fetch(`${Constants.sendPushnotificationToAllUsersURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getAllNotifications = async (user, pageNo, limit, type, status) => {
    try {
        const response = await fetch(`${Constants.getAllNotifications}${pageNo}/${limit}?type=${type}&status=${status}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteNotification = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteNotification}${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const editNotification = async (user, id, data) => {
    try {
        const response = await fetch(`${Constants.editNotification}${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

//add booking player
export const addBookingPlayer = async (user, data) => {

    try {
        const response = await fetch(`${Constants.AddPlayer}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const createMatch = async (user, data) => {

    try {
        const response = await fetch(`${Constants.createMatch}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getAllMatchesFiltred = async (user, facilityId, userId, min, max, sport_type, mode, match_type, bookedby, bookingbefore, bookingafter) => {
    try {   
        const response = await fetch(`${Constants.getAllMatchesFiltred}/${facilityId}?user=${userId}&min=${min}&max=${max}&sport_type=${sport_type}&mode=${mode}&match_type=${match_type}&bookedby=${bookedby}&bookingbefore=${bookingbefore}&bookingafter=${bookingafter}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const getAllMatches = async (user, razor, userId, facility, matchMode) => {
    try {
        // let query = '';
        // user ? query += 'user=' + user : 'user=';
        // facility ? query += '&facility=' + facility : '';
        // min ? query += '&min=' + min : '';
        // max ? query += '&max=' + max : '';
        // sport ? query += '&sport_type=' + sport : '';

        const response = await fetch(`${Constants.getAllMatches}/1/500?createdAfter=&createdBefore=&bookingbefore=&bookingafter=&user=${userId}&razor=${razor}&facility=${facility}&match_mode=${matchMode}&bookedby=&status=&booking_type=match&source=admin`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getAllMatchesOld = async (user, razor, userId, facility, matchMode) => {
    try {
        // let query = '';
        // user ? query += 'user=' + user : 'user=';
        // facility ? query += '&facility=' + facility : '';
        // min ? query += '&min=' + min : '';
        // max ? query += '&max=' + max : '';
        // sport ? query += '&sport_type=' + sport : '';

        const response = await fetch(`${Constants.getAllMatches}/1/500?createdAfter=&createdBefore=&bookingbefore=&bookingafter=&user=${userId}&razor=${razor}&facility=${facility}&match_mode=${matchMode}&bookedby=Admin&status=&booking_type=match`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getMatchDetailsByIdService = async (user, id) => {
    try {
        const response = await fetch(`${Constants.getMatchDetailsById}${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const filterMatches = async (user, facility, userId, min, max, sport, matchMode, matchType, bookedby = 'Admin') => {
    try {
        const response = await fetch(`${Constants.filterMatches}?facility=${facility}&user=${userId}&min=${min}&max=${max}&sport_type=${sport}&mode=${matchMode}&match_type=${matchType}&bookedby=${bookedby}&past=&admin=true`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const filterMatchesOld = async (user, facility, userId, min, max, sport, matchMode, matchType, bookedby = '') => {
    try {
        const response = await fetch(`${Constants.filterMatches}?facility=${facility}&user=${userId}&min=${min}&max=${max}&sport_type=${sport}&mode=${matchMode}&match_type=${matchType}&bookedby=${bookedby}&past=&admin=true`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const removeMatchPlayer = async (user, data) => {

    try {
        const response = await fetch(`${Constants.removeMatchPlayer}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const addMatchPlayer = async (user, data, id) => {

    try {
        const response = await fetch(`${Constants.addMatchPLayer}${id}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const editBookingdetail = async (user, id, data) => {
    try {
        const response = await fetch(`${Constants.editBooking}${id}`, {
            method: "PATCH",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const filterRevenue = async (user, location, court, facility, start, end) => {
    try {
        const response = await fetch(`${Constants.Revenue}location=${location}&court=${court}&facility=${facility}&start=${start}&end=${end}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(court)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getAllRevenue = async (user) => {
    try {
        const response = await fetch(`${Constants.getRevenue}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const RefundBookings = async (user, data) => {

    try {
        const response = await fetch(`${Constants.RefundBookingsURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const CancelMatch = async (user, id) => {

    try {
        const response = await fetch(`${Constants.cancelMatchmaking}${id}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

// ------------- Notification  ---------------

export const getCheckRulesAPI = async (user, number) => {
    try {
        const response = await fetch(`${Constants.getCheckRulesURL}${number}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const getExtendAvailableAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.getExtendAvailableURL}${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const postExtendAPI = async (user, id, data) => {

    try {
        const response = await fetch(`${Constants.postExtendURL}${id}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const deleteBookPlayer = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deletePlayersBookings}${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const getBookPlayer = async (user, id) => {
    try {
        const response = await fetch(`${Constants.PlayersBookinglist}${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

/* JS */
export const getNewBookings = async (user, date, facilityId) => {
    try {
        const response = await fetch(`${Constants.URL1}facilities/${facilityId}/booking-new/status/${date}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const addNewBookingAPI = async (user, data) => {
    try {
        const response = await fetch(`${Constants.addNewBookingURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const rescheduleAPI = async (user, id, data) => {
    try {
        const response = await fetch(`${Constants.rescheduleUrl}${id}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const getRevenueAdmin = async (user, id) => {
    try {
        const response = await fetch(`${Constants.getRevenuedata}${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

// Tutorial videos
export const createTutorial = async (user, data) => {

    try {
        const response = await fetch(`${Constants.addTutorial}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const getTutorial = async (user) => {

    try {
        const response = await fetch(`${Constants.getAllTutorials}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const editTutorial = async (user, id, data) => {

    try {
        const response = await fetch(`${Constants.editTutorial}${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const deleteTutorial = async (user, id) => {

    try {
        const response = await fetch(`${Constants.deleteTutorial}${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const filterTutorial = async (user, title, category, sport_type) => {

    try {
        const response = await fetch(`${Constants.filterTutorial}&title=${title}&category=${category}&sport_type=${sport_type}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
};

// push notification

export const addWebPushNotification = async (user, data) => {

    try {
        const response = await fetch(`${Constants.WebPushNotification}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

// Packages
export const createPackageAPI = async (user, data) => {

    try {
        const response = await fetch(`${Constants.createPackageURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const getPackagesAPI = async (user) => {

    try {
        const response = await fetch(`${Constants.getallPackagesURL}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const editPackageAPI = async (user, id, data) => {

    try {
        const response = await fetch(`${Constants.editPackageURL}${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deletePackagesAPI = async (user, id) => {

    try {
        const response = await fetch(`${Constants.deletePackagesURL}${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const filterPackagesAPI = async (user, facility_id, name, status, sport_type) => {

    try {
        const response = await fetch(`${Constants.filterPackagesURL}&facility=${facility_id}&name=${name}&status=${status}&sport_type=${sport_type}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

//Chat

export const getAllChatDetails = async (user, id) => {
    try {
        const response = await fetch(`${Constants.getAllChat}${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getChatById = async (user, page, limit, id, userId) => {
    try {
        const response = await fetch(`${Constants.getChatByIdURL}${page}/${limit}?chatId=${id}&userId=${userId}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const sendMessageAPI = async (user, data) => {
    try {
        const response = await fetch(`${Constants.sendMessageURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteChatAPI = async (user, data) => {
    try {
        const response = await fetch(`${Constants.deleteChatURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteMessageAPI = async (user, data) => {
    try {
        const response = await fetch(`${Constants.deleteMessageURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteChatForEveryoneAPI = async (user, data) => {
    try {
        const response = await fetch(`${Constants.deleteChatForEveryoneURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const createGroupAPI = async (user, data) => {
    try {
        const response = await fetch(`${Constants.createGroupChatURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const renameChatAPI = async (user, data) => {
    try {
        const response = await fetch(`${Constants.renameChatURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
            },
            body: data,
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const addPlayersToChatAPI = async (user, data) => {
    try {
        const response = await fetch(`${Constants.addUsersToChatURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const removePlayersFromChatAPI = async (user, data) => {
    try {
        const response = await fetch(`${Constants.removeUsersFromChatURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const acceptRejectChatAPI = async (user, data) => {
    try {
        const response = await fetch(`${Constants.acceptRejectChatURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const clearChatAPI = async (user, data) => {
    try {
        const response = await fetch(`${Constants.clearChatURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getChatUsersAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.chatUsersURL}/${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


//MembershipData 

export const getMembershipDataAPI = async (user) => {

    try {
        const response = await fetch(`${Constants.getMembershipDataURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


export const createMembershipDataAPI = async (user, data) => {

    try {
        const response = await fetch(`${Constants.addMembershipDataURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const editMembershipDataAPI = async (user, id, data) => {

    try {
        const response = await fetch(`${Constants.editMembershipDataURL}${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }

}

export const deleteMembershipDataAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteMembershipDataURL}${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const filterMembershipDataAPI = async (user, facility_id, status, sport_type) => {

    try {
        const response = await fetch(`${Constants.filterMembershipDataURL}&facility_id=${facility_id}&status=${status}&sport_type=${sport_type}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


export const createPaymentConfigAPI = async (user, data) => {

    try {
        const response = await fetch(`${Constants.addPayemntConfigURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


export const getPaymentConfigAPI = async (user) => {

    try {
        const response = await fetch(`${Constants.getPayemntConfigURL}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


export const editPaymentCongigAPI = async (user, id, data) => {

    try {
        const response = await fetch(`${Constants.editPayemntConfigURL}${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }

}


export const deletePaymentConfigAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deletePayemntConfigURL}${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const detailPaymentConfigAPI = async (user, razorId) => {

    try {
        const response = await fetch(`${Constants.detailPayemntConfigURL}${razorId}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


//MemberShip


export const createMembershipAPI = async (user, data) => {

    try {
        const response = await fetch(`${Constants.addMembershipURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


export const getMembershipAPI = async (user) => {

    try {
        const response = await fetch(`${Constants.getMembershipURL}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const editMembershipAPI = async (user, id, data) => {

    try {
        const response = await fetch(`${Constants.editMembershipURL}${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteMembershipAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteMembershipURL}${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const filterMembershipAPI = async (user, facility_id, name, status, sport_type) => {

    try {
        const response = await fetch(`${Constants.filterMembershipURL}&facility=${facility_id}&name=${name}&status=${status}&sport_type=${sport_type}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

// ------------------ Rating Skill Levels ----------------------- //

export const getAllRatingSkillLevelsAPI = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllRatingSkillLevelsURL}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const createRatingSkillLevelAPI = async (user, data) => {

    try {
        const response = await fetch(`${Constants.createNewRatingSkillLevelURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const editRatingSkillLevelAPI = async (user, id, data) => {

    try {
        const response = await fetch(`${Constants.editRatingSkillLevelURL}/${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteRatingSkillLevelAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteRatingSkillLevelURL}/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


export const filterRatingSkillLevelAPI = async (user, sport_type) => {

    try {
        const response = await fetch(`${Constants.filterRatingSkillLevelURL}sport_type=${sport_type}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}



//User MemberShip 

export const createUserMemberShipAPI = async (user, data) => {

    try {
        const response = await fetch(`${Constants.addUserMembershipURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getUserMemberShipAPI = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllUserMembershipURL}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


export const editUserMemberShipAPI = async (user, id, data) => {

    try {
        const response = await fetch(`${Constants.editUserMembershipURL}/${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


export const deleteUserMemberShipAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteUserMembershipURL}/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


export const filterUserMembershipAPI = async (user, facility_id, name, status, sport_type) => {

    try {
        const response = await fetch(`${Constants.filterUSerMembershipURL}&facility=${facility_id}&name=${name}&status=${status}&sport_type=${sport_type}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


//Event Flyer

export const createEventFlyerAPI = async (user, data) => {

    try {
        const response = await fetch(`${Constants.addEventFlyerURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getEventFlyerAPI = async (user) => {
    try {
        const response = await fetch(`${Constants.getEventFlyersURL}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


export const editEventFlyerAPI = async (user, id, data) => {

    try {
        const response = await fetch(`${Constants.editEventFlyerURL}/${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


export const deleteEventFlyerAPI = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteEventFlyerURL}/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

//Homepage Tiles
export const getAllTiles = async (user) => {
    try {
        const response = await fetch(`${Constants.getAllTiles}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const createTile = async (user, data) => {

    try {
        const response = await fetch(`${Constants.createTile}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data)
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const deleteTile = async (user, id) => {
    try {
        const response = await fetch(`${Constants.deleteTile}${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const editTile = async (user, id, data) => {
    try {
        const response = await fetch(`${Constants.editTile}${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


//Configs 

export const getbackendConfigAPI = async (auth) => {
    try {
        const response = await fetch(`${Constants.GetbackendConfigUrl}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${auth}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


export const getfrontendConfigAPI = async (auth) => {
    try {
        const response = await fetch(`${Constants.GetfrontendConfigUrl}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${auth}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


export const editFrontendConfigAPI = async (auth, data) => {
    try {
        const response = await fetch(`${Constants.UpdatefrontendConfigUrl}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${auth}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const editBackendConfigAPI = async (auth, data) => {
    try {
        const response = await fetch(`${Constants.UpdateBackendConfigUrl}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${auth}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


// Pi Coins

export const debitPicoins = async (data) => {
    try {
        const response = await fetch(`${Constants.debitPiCoins}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${Constants.SOCIALCONFIG}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const creditPicoins = async (data) => {
    try {
        const response = await fetch(`${Constants.creditPiCoins}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${Constants.SOCIALCONFIG}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getAllPiCoinsTxnHistory = async (data) => {
    try {
        const response = await fetch(`${Constants.getAllPiCoinsTxn}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${Constants.SOCIALCONFIG}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
export const getUserDetailsbyId = async (data, user) => {
    try {
        const response = await fetch(`${Constants.getUserDetails}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}


export const getAllTotalPiCoins = async (data) => {
    try {
        const response = await fetch(`${Constants.getTotalPicoins}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${Constants.SOCIALCONFIG}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getAllPiCoinsSummary = async (data) => {
    try {
        const response = await fetch(`${Constants.getPicoinSummary}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${Constants.SOCIALCONFIG}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getPicoinSummaryByuserId = async (data) => {
    try {
        const response = await fetch(`${Constants.getPicoinSummaryByuser}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${Constants.SOCIALCONFIG}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

// Email Service

export const emailSenderAPI = async (auth, targets: string[], sub, content, file) => {
    const formData = new FormData();
    formData.append('targets', JSON.stringify(targets));
    formData.append('subject', sub);
    formData.append('content', content);
    formData.append('file', file);

    const response = await fetch(`${Constants.sendEmailerURL}`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${auth}`,
        },
        body: formData,
    });

    return response.json();
}



//Facility Equipment Add-onds APIs

export const createAddOnsAPI = async (auth, data) => {
    try {
        const response = await fetch(`${Constants.createAddOnsURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${auth}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getAddOnAPi = async (auth, Id) => {
    try {
        const response = await fetch(`${Constants.getAddOnURL}/facility_id/${Id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${auth}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const patchAddOnAPI = async (auth, Id, data) => {
    try {
        const response = await fetch(`${Constants.createAddOnsURL}/${Id}`, {
            method: "PATCH",
            headers: {
                'Authorization': `Bearer ${auth}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }

}

export const deleteAddOnAPI = async (auth, Id) => {
    try {
        const response = await fetch(`${Constants.createAddOnsURL}/${Id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${auth}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },

        })
        return response.json();
    }
    catch (e) {
        return { e }
    }

}


//  How TO APIs


export const getHowToAPI = async (auth) => {
    try {
        const response = await fetch(`${Constants.getHowToURL}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${auth}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const createHowToAPI = async (auth, data) => {
    try {
        const response = await fetch(`${Constants.createHowToURL}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${auth}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }

}

export const editHowToAPI = async (auth, id, data) => {
    try {
        const response = await fetch(`${Constants.updateHowToURL}/${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${auth}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }

}

export const deleteHowToAPI = async (auth, id) => {
    try {
        const response = await fetch(`${Constants.deleteHowToURL}/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${auth}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },

        })
        return response.json();
    }
    catch (e) {
        return { e }
    }

}

export const filterHowToAPI = async (user, title, category, sport_type) => {

    try {
        const response = await fetch(`${Constants.filterHowToURL}?title=${title}&category=${category}&sport_type=${sport_type}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${user}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
};



// Partner Settlements  Calculations 

export const getSettlementsCalculations = async (auth, page, limit, startDate, endDate, facility) => {
    try {
        const response = await fetch(`${Constants.settlementsCalculationsURL}?page=${page}&limit=${limit}&start_date=${startDate}&end_date=${endDate}&facility_id=${facility}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${auth}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const getSettlementSlipAPI = async (auth, startDate, endDate, facility) => {
    try {
        const response = await fetch(`${Constants.settlementsSlipURL}?start_date=${startDate}&end_date=${endDate}&facility_id=${facility}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${auth}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}

export const MIS_getAPI = async (auth, page, limit, startDate, endDate, facility, userId) => {
    try {
        const response = await fetch(`${Constants.MIS_URL}${page}/${limit}?start_date=${startDate}&end_date=${endDate}&facility_id=${facility}&user_id=${userId}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${auth}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        return response.json();
    }
    catch (e) {
        return { e }
    }
}
