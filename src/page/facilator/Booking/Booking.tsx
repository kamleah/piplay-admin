import React, { Fragment, useState, useEffect, useRef } from "react";
import { Card, Breadcrumb, Button, Row, Col, Divider, Checkbox, Radio, RadioChangeEvent } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import Paper from "@mui/material/Paper";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import ToastMessage from "../ToastMessage/ToastMessage";
import "../../../components/css/style.css";
import {
  bookingConfirmApi,
  bookingStatusApi,
  userInfoApi,
  userIdApi,
  getFacilityApi,
  bookingApi,
  getFacilityByIdApi,
} from "../../../components/apiFile/Service";
import setBodyColor from "../../../components/css/setBodyColor";
import userImage from "../../../assets/icon/user.jpeg";
import ConfirmBooking from "../../../components/Modal/ConfirmBooking";
import CancelBookingDetails from "../../../components/Modal/CancelBookingDetails";
import AddBooking from "../../../components/Modal/AddBooking";
import "../Booking/Booking.css";
import { useSelector, useDispatch } from "react-redux";
import BookingDetails from "../../../components/Modal/BookingDetails";
import { json } from "react-router-dom";
import { useForm } from "react-hook-form";
import { setSelectedFacility } from "../../../redux/Slices/DataSlice";
interface Option {
  id: string;
  name: string;
  price: number;
  booked: boolean;
  startTime: string;
  endTime: string;
  _id: string;
  slots: any;
  user_id: string;
  firstname: string;
  court: any;
  slot: any;
  status: any;
}
const dummyBooking = [
  {
    "id": "1",
    "name": "Court 1",
    "slots": [
      {
        "booked": true,
        "endTime": "18:00",
        "id": "145",
        "price": "700",
        "startTime": "17:30",
        "user_id": "664207fca74580c9f2cd0cf7",
        "booking_id": "66435e52086de13153990774",
        "status": "Paid",
        "basePrice": "593.22",
        "gst": "106.78",
        "booking_data": {
          "_id": "66435e52086de13153990774",
          "court_id": "64a3e4c373a4d2e233a971c3",
          "slot_ids": [
            "144",
            "145"
          ],
          "user_id": "664207fca74580c9f2cd0cf7",
          "booking_date": "2024-05-15",
          "status": "Paid",
          "payment_status": "Paid",
          "startTimestamp": 1715772600000,
          "endTimestamp": 1715774400000,
          "razor_id": "pay_OANdF83zl0xCnP",
          "coupon": false,
          "coupon_name": "",
          "percentage": 0,
          "total_amount": 140000,
          "createdAt": "2024-05-14T12:51:30.586Z",
          "facility": {
            "name": "IPF Padel Court",
            "address": "Sadashiva Nagar, Armane Nagar, Bengaluru, Karnataka 560080"
          },
          "court": {
            "name": "Court 1",
            "game": "Padel",
            "type": "Outdoor"
          },
          "user": {
            "firstname": "Kamlesh",
            "lastname": "Gupta",
            "email": "kamleshgupta594@gmail.com",
            "mobileno": 9637199927,
            "gender": "Male",
            "pincode": null,
            "age_group": null,
            "profile_url": "https://s3.ap-south-1.amazonaws.com/dev-avatars.pi-play.com/avatars/664207fca74580c9f2cd0cf7.jpg",
            "games": 0
          }
        },
        "coupon": false,
        "coupon_name": "",
        "percentage": 0
      },
      {
        "booked": true,
        "endTime": "15:00",
        "id": "145",
        "price": "700",
        "startTime": "15:30",
        "user_id": "664207fca74580c9f2cd0cf7",
        "booking_id": "66435e52086de13153990774",
        "status": "Confirmed",
        "basePrice": "593.22",
        "gst": "106.78",
        "booking_data": {
          "_id": "66435e52086de13153990774",
          "court_id": "64a3e4c373a4d2e233a971c3",
          "slot_ids": [
            "144",
            "145"
          ],
          "user_id": "664207fca74580c9f2cd0cf7",
          "booking_date": "2024-05-15",
          "status": "Paid",
          "payment_status": "Paid",
          "startTimestamp": 1715772600000,
          "endTimestamp": 1715774400000,
          "razor_id": "pay_OANdF83zl0xCnP",
          "coupon": false,
          "coupon_name": "",
          "percentage": 0,
          "total_amount": 140000,
          "createdAt": "2024-05-14T12:51:30.586Z",
          "facility": {
            "name": "IPF Padel Court",
            "address": "Sadashiva Nagar, Armane Nagar, Bengaluru, Karnataka 560080"
          },
          "court": {
            "name": "Court 1",
            "game": "Padel",
            "type": "Outdoor"
          },
          "user": {
            "firstname": "Kamlesh",
            "lastname": "Gupta",
            "email": "kamleshgupta594@gmail.com",
            "mobileno": 9637199927,
            "gender": "Male",
            "pincode": null,
            "age_group": null,
            "profile_url": "https://s3.ap-south-1.amazonaws.com/dev-avatars.pi-play.com/avatars/664207fca74580c9f2cd0cf7.jpg",
            "games": 0
          }
        },
        "coupon": false,
        "coupon_name": "",
        "percentage": 0
      },
      {
        "booked": true,
        "endTime": "17:00",
        "id": "145",
        "price": "700",
        "startTime": "16:30",
        "user_id": "664207fca74580c9f2cd0cf7",
        "booking_id": "66435e52086de13153990774",
        "status": "Paid",
        "basePrice": "593.22",
        "gst": "106.78",
        "booking_data": {
          "_id": "66435e52086de13153990774",
          "court_id": "64a3e4c373a4d2e233a971c3",
          "slot_ids": [
            "144",
            "145"
          ],
          "user_id": "664207fca74580c9f2cd0cf7",
          "booking_date": "2024-05-15",
          "status": "Paid",
          "payment_status": "Paid",
          "startTimestamp": 1715772600000,
          "endTimestamp": 1715774400000,
          "razor_id": "pay_OANdF83zl0xCnP",
          "coupon": false,
          "coupon_name": "",
          "percentage": 0,
          "total_amount": 140000,
          "createdAt": "2024-05-14T12:51:30.586Z",
          "facility": {
            "name": "IPF Padel Court",
            "address": "Sadashiva Nagar, Armane Nagar, Bengaluru, Karnataka 560080"
          },
          "court": {
            "name": "Court 1",
            "game": "Padel",
            "type": "Outdoor"
          },
          "user": {
            "firstname": "Kamlesh",
            "lastname": "Gupta",
            "email": "kamleshgupta594@gmail.com",
            "mobileno": 9637199927,
            "gender": "Male",
            "pincode": null,
            "age_group": null,
            "profile_url": "https://s3.ap-south-1.amazonaws.com/dev-avatars.pi-play.com/avatars/664207fca74580c9f2cd0cf7.jpg",
            "games": 0
          }
        },
        "coupon": false,
        "coupon_name": "",
        "percentage": 0
      },
      {
        "booked": true,
        "endTime": "16:30",
        "id": "145",
        "price": "700",
        "startTime": "16:00",
        "user_id": "664207fca74580c9f2cd0cf7",
        "booking_id": "66435e52086de13153990774",
        "status": "Paid",
        "basePrice": "593.22",
        "gst": "106.78",
        "booking_data": {
          "_id": "66435e52086de13153990774",
          "court_id": "64a3e4c373a4d2e233a971c3",
          "slot_ids": [
            "144",
            "145"
          ],
          "user_id": "664207fca74580c9f2cd0cf7",
          "booking_date": "2024-05-15",
          "status": "Paid",
          "payment_status": "Paid",
          "startTimestamp": 1715772600000,
          "endTimestamp": 1715774400000,
          "razor_id": "pay_OANdF83zl0xCnP",
          "coupon": false,
          "coupon_name": "",
          "percentage": 0,
          "total_amount": 140000,
          "createdAt": "2024-05-14T12:51:30.586Z",
          "facility": {
            "name": "IPF Padel Court",
            "address": "Sadashiva Nagar, Armane Nagar, Bengaluru, Karnataka 560080"
          },
          "court": {
            "name": "Court 1",
            "game": "Padel",
            "type": "Outdoor"
          },
          "user": {
            "firstname": "Kamlesh",
            "lastname": "Gupta",
            "email": "kamleshgupta594@gmail.com",
            "mobileno": 9637199927,
            "gender": "Male",
            "pincode": null,
            "age_group": null,
            "profile_url": "https://s3.ap-south-1.amazonaws.com/dev-avatars.pi-play.com/avatars/664207fca74580c9f2cd0cf7.jpg",
            "games": 0
          }
        },
        "coupon": false,
        "coupon_name": "",
        "percentage": 0
      },
      {
        "id": '149',
        "basePrice": '150',
        "booked": false,
        "endTime": '13:00',
        "startTime": '13:30',
        "gst": '100',
        "price": '200'
      },

    ]
  },
  {
    "id": "2",
    "name": "Court 2",
    "slots": [
      {
        "booked": true,
        "endTime": "18:00",
        "id": "145",
        "price": "700",
        "startTime": "17:30",
        "user_id": "664207fca74580c9f2cd0cf7",
        "booking_id": "66435e52086de13153990774",
        "status": "Paid",
        "basePrice": "593.22",
        "gst": "106.78",
        "booking_data": {
          "_id": "66435e52086de13153990774",
          "court_id": "64a3e4c373a4d2e233a971c3",
          "slot_ids": [
            "144",
            "145"
          ],
          "user_id": "664207fca74580c9f2cd0cf7",
          "booking_date": "2024-05-15",
          "status": "Paid",
          "payment_status": "Paid",
          "startTimestamp": 1715772600000,
          "endTimestamp": 1715774400000,
          "razor_id": "pay_OANdF83zl0xCnP",
          "coupon": false,
          "coupon_name": "",
          "percentage": 0,
          "total_amount": 140000,
          "createdAt": "2024-05-14T12:51:30.586Z",
          "facility": {
            "name": "IPF Padel Court",
            "address": "Sadashiva Nagar, Armane Nagar, Bengaluru, Karnataka 560080"
          },
          "court": {
            "name": "Court 1",
            "game": "Padel",
            "type": "Outdoor"
          },
          "user": {
            "firstname": "Kamlesh",
            "lastname": "Gupta",
            "email": "kamleshgupta594@gmail.com",
            "mobileno": 9637199927,
            "gender": "Male",
            "pincode": null,
            "age_group": null,
            "profile_url": "https://s3.ap-south-1.amazonaws.com/dev-avatars.pi-play.com/avatars/664207fca74580c9f2cd0cf7.jpg",
            "games": 0
          }
        },
        "coupon": false,
        "coupon_name": "",
        "percentage": 0
      },
      {
        "booked": true,
        "endTime": "15:00",
        "id": "145",
        "price": "700",
        "startTime": "15:30",
        "user_id": "664207fca74580c9f2cd0cf7",
        "booking_id": "66435e52086de13153990774",
        "status": "Confirmed",
        "basePrice": "593.22",
        "gst": "106.78",
        "booking_data": {
          "_id": "66435e52086de13153990774",
          "court_id": "64a3e4c373a4d2e233a971c3",
          "slot_ids": [
            "144",
            "145"
          ],
          "user_id": "664207fca74580c9f2cd0cf7",
          "booking_date": "2024-05-15",
          "status": "Paid",
          "payment_status": "Paid",
          "startTimestamp": 1715772600000,
          "endTimestamp": 1715774400000,
          "razor_id": "pay_OANdF83zl0xCnP",
          "coupon": false,
          "coupon_name": "",
          "percentage": 0,
          "total_amount": 140000,
          "createdAt": "2024-05-14T12:51:30.586Z",
          "facility": {
            "name": "IPF Padel Court",
            "address": "Sadashiva Nagar, Armane Nagar, Bengaluru, Karnataka 560080"
          },
          "court": {
            "name": "Court 1",
            "game": "Padel",
            "type": "Outdoor"
          },
          "user": {
            "firstname": "Kamlesh",
            "lastname": "Gupta",
            "email": "kamleshgupta594@gmail.com",
            "mobileno": 9637199927,
            "gender": "Male",
            "pincode": null,
            "age_group": null,
            "profile_url": "https://s3.ap-south-1.amazonaws.com/dev-avatars.pi-play.com/avatars/664207fca74580c9f2cd0cf7.jpg",
            "games": 0
          }
        },
        "coupon": false,
        "coupon_name": "",
        "percentage": 0
      },
      {
        "booked": true,
        "endTime": "17:00",
        "id": "145",
        "price": "700",
        "startTime": "16:30",
        "user_id": "664207fca74580c9f2cd0cf7",
        "booking_id": "66435e52086de13153990774",
        "status": "Paid",
        "basePrice": "593.22",
        "gst": "106.78",
        "booking_data": {
          "_id": "66435e52086de13153990774",
          "court_id": "64a3e4c373a4d2e233a971c3",
          "slot_ids": [
            "144",
            "145"
          ],
          "user_id": "664207fca74580c9f2cd0cf7",
          "booking_date": "2024-05-15",
          "status": "Paid",
          "payment_status": "Paid",
          "startTimestamp": 1715772600000,
          "endTimestamp": 1715774400000,
          "razor_id": "pay_OANdF83zl0xCnP",
          "coupon": false,
          "coupon_name": "",
          "percentage": 0,
          "total_amount": 140000,
          "createdAt": "2024-05-14T12:51:30.586Z",
          "facility": {
            "name": "IPF Padel Court",
            "address": "Sadashiva Nagar, Armane Nagar, Bengaluru, Karnataka 560080"
          },
          "court": {
            "name": "Court 1",
            "game": "Padel",
            "type": "Outdoor"
          },
          "user": {
            "firstname": "Kamlesh",
            "lastname": "Gupta",
            "email": "kamleshgupta594@gmail.com",
            "mobileno": 9637199927,
            "gender": "Male",
            "pincode": null,
            "age_group": null,
            "profile_url": "https://s3.ap-south-1.amazonaws.com/dev-avatars.pi-play.com/avatars/664207fca74580c9f2cd0cf7.jpg",
            "games": 0
          }
        },
        "coupon": false,
        "coupon_name": "",
        "percentage": 0
      },
      {
        "booked": true,
        "endTime": "16:30",
        "id": "145",
        "price": "700",
        "startTime": "16:00",
        "user_id": "664207fca74580c9f2cd0cf7",
        "booking_id": "66435e52086de13153990774",
        "status": "Paid",
        "basePrice": "593.22",
        "gst": "106.78",
        "booking_data": {
          "_id": "66435e52086de13153990774",
          "court_id": "64a3e4c373a4d2e233a971c3",
          "slot_ids": [
            "144",
            "145"
          ],
          "user_id": "664207fca74580c9f2cd0cf7",
          "booking_date": "2024-05-15",
          "status": "Paid",
          "payment_status": "Paid",
          "startTimestamp": 1715772600000,
          "endTimestamp": 1715774400000,
          "razor_id": "pay_OANdF83zl0xCnP",
          "coupon": false,
          "coupon_name": "",
          "percentage": 0,
          "total_amount": 140000,
          "createdAt": "2024-05-14T12:51:30.586Z",
          "facility": {
            "name": "IPF Padel Court",
            "address": "Sadashiva Nagar, Armane Nagar, Bengaluru, Karnataka 560080"
          },
          "court": {
            "name": "Court 1",
            "game": "Padel",
            "type": "Outdoor"
          },
          "user": {
            "firstname": "Kamlesh",
            "lastname": "Gupta",
            "email": "kamleshgupta594@gmail.com",
            "mobileno": 9637199927,
            "gender": "Male",
            "pincode": null,
            "age_group": null,
            "profile_url": "https://s3.ap-south-1.amazonaws.com/dev-avatars.pi-play.com/avatars/664207fca74580c9f2cd0cf7.jpg",
            "games": 0
          }
        },
        "coupon": false,
        "coupon_name": "",
        "percentage": 0
      },
      {
        "id": '149',
        "basePrice": '150',
        "booked": false,
        "endTime": '13:00',
        "startTime": '13:30',
        "gst": '100',
        "price": '200'
      },

    ]
  },
  {
    "id": "2",
    "name": "Court 2",
    "slots": [
      {
        "booked": true,
        "endTime": "18:00",
        "id": "145",
        "price": "700",
        "startTime": "17:30",
        "user_id": "664207fca74580c9f2cd0cf7",
        "booking_id": "66435e52086de13153990774",
        "status": "Paid",
        "basePrice": "593.22",
        "gst": "106.78",
        "booking_data": {
          "_id": "66435e52086de13153990774",
          "court_id": "64a3e4c373a4d2e233a971c3",
          "slot_ids": [
            "144",
            "145"
          ],
          "user_id": "664207fca74580c9f2cd0cf7",
          "booking_date": "2024-05-15",
          "status": "Paid",
          "payment_status": "Paid",
          "startTimestamp": 1715772600000,
          "endTimestamp": 1715774400000,
          "razor_id": "pay_OANdF83zl0xCnP",
          "coupon": false,
          "coupon_name": "",
          "percentage": 0,
          "total_amount": 140000,
          "createdAt": "2024-05-14T12:51:30.586Z",
          "facility": {
            "name": "IPF Padel Court",
            "address": "Sadashiva Nagar, Armane Nagar, Bengaluru, Karnataka 560080"
          },
          "court": {
            "name": "Court 1",
            "game": "Padel",
            "type": "Outdoor"
          },
          "user": {
            "firstname": "Kamlesh",
            "lastname": "Gupta",
            "email": "kamleshgupta594@gmail.com",
            "mobileno": 9637199927,
            "gender": "Male",
            "pincode": null,
            "age_group": null,
            "profile_url": "https://s3.ap-south-1.amazonaws.com/dev-avatars.pi-play.com/avatars/664207fca74580c9f2cd0cf7.jpg",
            "games": 0
          }
        },
        "coupon": false,
        "coupon_name": "",
        "percentage": 0
      },
      {
        "booked": true,
        "endTime": "15:00",
        "id": "145",
        "price": "700",
        "startTime": "15:30",
        "user_id": "664207fca74580c9f2cd0cf7",
        "booking_id": "66435e52086de13153990774",
        "status": "Paid",
        "basePrice": "593.22",
        "gst": "106.78",
        "booking_data": {
          "_id": "66435e52086de13153990774",
          "court_id": "64a3e4c373a4d2e233a971c3",
          "slot_ids": [
            "144",
            "145"
          ],
          "user_id": "664207fca74580c9f2cd0cf7",
          "booking_date": "2024-05-15",
          "status": "Paid",
          "payment_status": "Paid",
          "startTimestamp": 1715772600000,
          "endTimestamp": 1715774400000,
          "razor_id": "pay_OANdF83zl0xCnP",
          "coupon": false,
          "coupon_name": "",
          "percentage": 0,
          "total_amount": 140000,
          "createdAt": "2024-05-14T12:51:30.586Z",
          "facility": {
            "name": "IPF Padel Court",
            "address": "Sadashiva Nagar, Armane Nagar, Bengaluru, Karnataka 560080"
          },
          "court": {
            "name": "Court 1",
            "game": "Padel",
            "type": "Outdoor"
          },
          "user": {
            "firstname": "Kamlesh",
            "lastname": "Gupta",
            "email": "kamleshgupta594@gmail.com",
            "mobileno": 9637199927,
            "gender": "Male",
            "pincode": null,
            "age_group": null,
            "profile_url": "https://s3.ap-south-1.amazonaws.com/dev-avatars.pi-play.com/avatars/664207fca74580c9f2cd0cf7.jpg",
            "games": 0
          }
        },
        "coupon": false,
        "coupon_name": "",
        "percentage": 0
      },
      {
        "booked": true,
        "endTime": "17:00",
        "id": "145",
        "price": "700",
        "startTime": "16:30",
        "user_id": "664207fca74580c9f2cd0cf7",
        "booking_id": "66435e52086de13153990774",
        "status": "Paid",
        "basePrice": "593.22",
        "gst": "106.78",
        "booking_data": {
          "_id": "66435e52086de13153990774",
          "court_id": "64a3e4c373a4d2e233a971c3",
          "slot_ids": [
            "144",
            "145"
          ],
          "user_id": "664207fca74580c9f2cd0cf7",
          "booking_date": "2024-05-15",
          "status": "Paid",
          "payment_status": "Paid",
          "startTimestamp": 1715772600000,
          "endTimestamp": 1715774400000,
          "razor_id": "pay_OANdF83zl0xCnP",
          "coupon": false,
          "coupon_name": "",
          "percentage": 0,
          "total_amount": 140000,
          "createdAt": "2024-05-14T12:51:30.586Z",
          "facility": {
            "name": "IPF Padel Court",
            "address": "Sadashiva Nagar, Armane Nagar, Bengaluru, Karnataka 560080"
          },
          "court": {
            "name": "Court 1",
            "game": "Padel",
            "type": "Outdoor"
          },
          "user": {
            "firstname": "Kamlesh",
            "lastname": "Gupta",
            "email": "kamleshgupta594@gmail.com",
            "mobileno": 9637199927,
            "gender": "Male",
            "pincode": null,
            "age_group": null,
            "profile_url": "https://s3.ap-south-1.amazonaws.com/dev-avatars.pi-play.com/avatars/664207fca74580c9f2cd0cf7.jpg",
            "games": 0
          }
        },
        "coupon": false,
        "coupon_name": "",
        "percentage": 0
      },
      {
        "booked": true,
        "endTime": "16:30",
        "id": "145",
        "price": "700",
        "startTime": "16:00",
        "user_id": "664207fca74580c9f2cd0cf7",
        "booking_id": "66435e52086de13153990774",
        "status": "Paid",
        "basePrice": "593.22",
        "gst": "106.78",
        "booking_data": {
          "_id": "66435e52086de13153990774",
          "court_id": "64a3e4c373a4d2e233a971c3",
          "slot_ids": [
            "144",
            "145"
          ],
          "user_id": "664207fca74580c9f2cd0cf7",
          "booking_date": "2024-05-15",
          "status": "Paid",
          "payment_status": "Paid",
          "startTimestamp": 1715772600000,
          "endTimestamp": 1715774400000,
          "razor_id": "pay_OANdF83zl0xCnP",
          "coupon": false,
          "coupon_name": "",
          "percentage": 0,
          "total_amount": 140000,
          "createdAt": "2024-05-14T12:51:30.586Z",
          "facility": {
            "name": "IPF Padel Court",
            "address": "Sadashiva Nagar, Armane Nagar, Bengaluru, Karnataka 560080"
          },
          "court": {
            "name": "Court 1",
            "game": "Padel",
            "type": "Outdoor"
          },
          "user": {
            "firstname": "Kamlesh",
            "lastname": "Gupta",
            "email": "kamleshgupta594@gmail.com",
            "mobileno": 9637199927,
            "gender": "Male",
            "pincode": null,
            "age_group": null,
            "profile_url": "https://s3.ap-south-1.amazonaws.com/dev-avatars.pi-play.com/avatars/664207fca74580c9f2cd0cf7.jpg",
            "games": 0
          }
        },
        "coupon": false,
        "coupon_name": "",
        "percentage": 0
      },
    ]
  },
  {
    "id": "3",
    "name": "Court 3",
    "slots": [
      {
        "booked": true,
        "endTime": "18:00",
        "id": "145",
        "price": "700",
        "startTime": "17:30",
        "user_id": "664207fca74580c9f2cd0cf7",
        "booking_id": "66435e52086de13153990774",
        "status": "Paid",
        "basePrice": "593.22",
        "gst": "106.78",
        "booking_data": {
          "_id": "66435e52086de13153990774",
          "court_id": "64a3e4c373a4d2e233a971c3",
          "slot_ids": [
            "144",
            "145"
          ],
          "user_id": "664207fca74580c9f2cd0cf7",
          "booking_date": "2024-05-15",
          "status": "Paid",
          "payment_status": "Paid",
          "startTimestamp": 1715772600000,
          "endTimestamp": 1715774400000,
          "razor_id": "pay_OANdF83zl0xCnP",
          "coupon": false,
          "coupon_name": "",
          "percentage": 0,
          "total_amount": 140000,
          "createdAt": "2024-05-14T12:51:30.586Z",
          "facility": {
            "name": "IPF Padel Court",
            "address": "Sadashiva Nagar, Armane Nagar, Bengaluru, Karnataka 560080"
          },
          "court": {
            "name": "Court 1",
            "game": "Padel",
            "type": "Outdoor"
          },
          "user": {
            "firstname": "Kamlesh",
            "lastname": "Gupta",
            "email": "kamleshgupta594@gmail.com",
            "mobileno": 9637199927,
            "gender": "Male",
            "pincode": null,
            "age_group": null,
            "profile_url": "https://s3.ap-south-1.amazonaws.com/dev-avatars.pi-play.com/avatars/664207fca74580c9f2cd0cf7.jpg",
            "games": 0
          }
        },
        "coupon": false,
        "coupon_name": "",
        "percentage": 0
      },
      {
        "booked": true,
        "endTime": "15:00",
        "id": "145",
        "price": "700",
        "startTime": "15:30",
        "user_id": "664207fca74580c9f2cd0cf7",
        "booking_id": "66435e52086de13153990774",
        "status": "Paid",
        "basePrice": "593.22",
        "gst": "106.78",
        "booking_data": {
          "_id": "66435e52086de13153990774",
          "court_id": "64a3e4c373a4d2e233a971c3",
          "slot_ids": [
            "144",
            "145"
          ],
          "user_id": "664207fca74580c9f2cd0cf7",
          "booking_date": "2024-05-15",
          "status": "Paid",
          "payment_status": "Paid",
          "startTimestamp": 1715772600000,
          "endTimestamp": 1715774400000,
          "razor_id": "pay_OANdF83zl0xCnP",
          "coupon": false,
          "coupon_name": "",
          "percentage": 0,
          "total_amount": 140000,
          "createdAt": "2024-05-14T12:51:30.586Z",
          "facility": {
            "name": "IPF Padel Court",
            "address": "Sadashiva Nagar, Armane Nagar, Bengaluru, Karnataka 560080"
          },
          "court": {
            "name": "Court 1",
            "game": "Padel",
            "type": "Outdoor"
          },
          "user": {
            "firstname": "Kamlesh",
            "lastname": "Gupta",
            "email": "kamleshgupta594@gmail.com",
            "mobileno": 9637199927,
            "gender": "Male",
            "pincode": null,
            "age_group": null,
            "profile_url": "https://s3.ap-south-1.amazonaws.com/dev-avatars.pi-play.com/avatars/664207fca74580c9f2cd0cf7.jpg",
            "games": 0
          }
        },
        "coupon": false,
        "coupon_name": "",
        "percentage": 0
      },
      {
        "booked": true,
        "endTime": "17:00",
        "id": "145",
        "price": "700",
        "startTime": "16:30",
        "user_id": "664207fca74580c9f2cd0cf7",
        "booking_id": "66435e52086de13153990774",
        "status": "Paid",
        "basePrice": "593.22",
        "gst": "106.78",
        "booking_data": {
          "_id": "66435e52086de13153990774",
          "court_id": "64a3e4c373a4d2e233a971c3",
          "slot_ids": [
            "144",
            "145"
          ],
          "user_id": "664207fca74580c9f2cd0cf7",
          "booking_date": "2024-05-15",
          "status": "Paid",
          "payment_status": "Paid",
          "startTimestamp": 1715772600000,
          "endTimestamp": 1715774400000,
          "razor_id": "pay_OANdF83zl0xCnP",
          "coupon": false,
          "coupon_name": "",
          "percentage": 0,
          "total_amount": 140000,
          "createdAt": "2024-05-14T12:51:30.586Z",
          "facility": {
            "name": "IPF Padel Court",
            "address": "Sadashiva Nagar, Armane Nagar, Bengaluru, Karnataka 560080"
          },
          "court": {
            "name": "Court 1",
            "game": "Padel",
            "type": "Outdoor"
          },
          "user": {
            "firstname": "Kamlesh",
            "lastname": "Gupta",
            "email": "kamleshgupta594@gmail.com",
            "mobileno": 9637199927,
            "gender": "Male",
            "pincode": null,
            "age_group": null,
            "profile_url": "https://s3.ap-south-1.amazonaws.com/dev-avatars.pi-play.com/avatars/664207fca74580c9f2cd0cf7.jpg",
            "games": 0
          }
        },
        "coupon": false,
        "coupon_name": "",
        "percentage": 0
      },
      {
        "booked": true,
        "endTime": "16:30",
        "id": "145",
        "price": "700",
        "startTime": "16:00",
        "user_id": "664207fca74580c9f2cd0cf7",
        "booking_id": "66435e52086de13153990774",
        "status": "Paid",
        "basePrice": "593.22",
        "gst": "106.78",
        "booking_data": {
          "_id": "66435e52086de13153990774",
          "court_id": "64a3e4c373a4d2e233a971c3",
          "slot_ids": [
            "144",
            "145"
          ],
          "user_id": "664207fca74580c9f2cd0cf7",
          "booking_date": "2024-05-15",
          "status": "Paid",
          "payment_status": "Paid",
          "startTimestamp": 1715772600000,
          "endTimestamp": 1715774400000,
          "razor_id": "pay_OANdF83zl0xCnP",
          "coupon": false,
          "coupon_name": "",
          "percentage": 0,
          "total_amount": 140000,
          "createdAt": "2024-05-14T12:51:30.586Z",
          "facility": {
            "name": "IPF Padel Court",
            "address": "Sadashiva Nagar, Armane Nagar, Bengaluru, Karnataka 560080"
          },
          "court": {
            "name": "Court 1",
            "game": "Padel",
            "type": "Outdoor"
          },
          "user": {
            "firstname": "Kamlesh",
            "lastname": "Gupta",
            "email": "kamleshgupta594@gmail.com",
            "mobileno": 9637199927,
            "gender": "Male",
            "pincode": null,
            "age_group": null,
            "profile_url": "https://s3.ap-south-1.amazonaws.com/dev-avatars.pi-play.com/avatars/664207fca74580c9f2cd0cf7.jpg",
            "games": 0
          }
        },
        "coupon": false,
        "coupon_name": "",
        "percentage": 0
      },
    ]
  }
]
let dateStateForQuery = moment(new Date()).format("YYYY-MM-DD");
const phoneReg = /^\d{10}$/;

let mainLangQ = "";
const CheckboxGroup = Checkbox.Group;
const courtOptions = ["Court 1"];
const timingOptions = ["Morning", "Afternoon", "Evening"];

const Booking = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {
  setBodyColor({ color: "#f1f1f3" });

  const [showSelectedFacility, setShowSelectedFacility] = useState(true);
  const loggedInUser = localStorage.getItem("auth");
  const loggedUserDetails = useSelector(
    (state: any) => state.user.loggedUserDetails
  );



 


  const [addBookingModalData, setAddBookingModalData] = useState({
    id: "0",
    startTime: "00:00",
    endTime: "00:00",
    price: "500",
    booked: false,
  });
  const options = [
    { label: "All", value: "all" },
    { label: "Padel", value: "padel" },
    { label: "Pickleball", value: "pickleball" },
  ];
  const { register, watch, setValue, reset } = useForm();
  let sport_type = watch("sport_type");
  const [editBookingModalVisible, setEditBookingModalVisible] = useState(false);
  const [cancelModal, setCancelModal] = useState("unpaid");
  const [addBookingModal, setAddBookingModal] = useState(false);
  const [confirmBookingModal, setConfirmBookingModal] = useState(false);
  const [bookingDetailsModal, setBookingDetailsModal] = useState(false);
  const [cancelBookingUnpaidModal, setCancelBookingUnpaidModal] =
    useState(false);
  const [cancelBookingPaidModal, setCancelBookingPaidModal] = useState(false);
  const handleEditBooking = () => {
    setEditBookingModalVisible(true);
  };
  const onSportsChange = ({ target: { value } }: RadioChangeEvent) => {
    setValue("sport_type", value);
  };
  const showAddBookingModal = (item: any) => {
    setAddBookingModalData((addBookingModalData) => ({
      ...addBookingModalData,
      ...item,
    }));
    setLoginData({
      name: "",
      mobileno: "",
    });
    setAddBookingModal(true);
  };
  const closeAddBookingModal = () => {
    let form = document.getElementById("myForm1");
    if (form) (form as HTMLFormElement).reset();
    setLoginData({
      name: "",
      mobileno: "",
    });
    setAddBookingModal(false);
  };

  const [confirmBookingUnpaidModalData, setConfirmBookingUnpaidModalData] =
    useState({
      booked: true,
      endTime: "00:00",
      id: "1",
      price: "1",
      startTime: "00:00",
      user_id: "5f9",
      booking_id: "1cs",
    });
  const [confirmBookingPaidModalData, setConfirmBookingPaidModalData] =
    useState({
      booked: true,
      endTime: "00:00",
      id: "1",
      price: "1",
      startTime: "00:00",
      user_id: "5f9",
      booking_id: "1cs",
      status: "Paid",
    });
  const showConfirmUnpaidModal = (item) => {
    setConfirmBookingUnpaidModalData((confirmBookingUnpaidModalData) => ({
      ...confirmBookingUnpaidModalData,
      ...item,
    }));
    setConfirmBookingModal(true);
  };
  const showConfirmedPaidModal = (item) => {
    setConfirmBookingPaidModalData((confirmBookingPaidModalData) => ({
      ...confirmBookingPaidModalData,
      ...item,
    }));
    setBookingDetailsModal(true);
  };
  const handleCancelConfirmBooking = () => {
    setConfirmBookingModal(false);
    setCancelBookingUnpaidModal(true);
  };
  const handleCancelBookingDetails = () => {
    setBookingDetailsModal(false);
    setCancelModal("paid");
    setCancelBookingPaidModal(true);
  };
  const handleCancelBookingUnpaid = (item) => {
    cancelBooking(item);
  };
  const handleCancelBookingPaid = (item) => {
    cancelBooking(item);
  };
  const cancelBooking = async (item) => {
    let dataCancel = {
      status: "Released",
    };
    let response = await bookingConfirmApi(
      item.booking_id,
      loggedInUser,
      dataCancel
    );
    if (response?.error === false) {
      setLoading1(false);
      toast(<ToastMessage body="Booking is cancelled." type="success" />, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        bookingDetailsData(response.data);
      }, 500);
    } else {
      toast(<ToastMessage body={response.message} type="error" />, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    setCancelBookingUnpaidModal(false);
    setCancelBookingPaidModal(false);
  };
  const handleConfirmBooking = async (switchStatus, id) => {
    let dataConfirmed = { status: switchStatus ? "Paid" : "" };
    setConfirmBookingModal(false);
    let response = await bookingConfirmApi(id, loggedInUser, dataConfirmed);
    if (response?.error === false) {
      setLoading1(false);
      toast(
        <ToastMessage
          body="The slots were confirmed successfully!"
          type="success"
        />,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      bookingDetailsData(response.data);

      setTimeout(() => {
        bookingDetailsData(response.data);
      }, 500);
    } else {
      toast(<ToastMessage body={response.message} type="error" />, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  const [dateState, setDateState] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const changeDate = (e) => {
    dateStateForQuery = e;
    setDateState(e);
    setUserDetailsA([]);
    if (mainLang !== "") {
      bookingDetailsData(e);
    }
  };
  //booking Status
  const [bookingStats, setBookingStats] = useState(dummyBooking);
  const [data, setdata] = useState([]);
  const [error, setError] = useState("");
  const [getFacility, setGetFacility] = useState([]);
  const [mainLang, setMainLang] = useState("");
  const [userDetail, setUserDetail] = useState({});
  const [userId, setUserId] = useState("");
  console.log("[mainLang", mainLang)

  const timeOut = (stTime: string) => {
    let currentDate = moment(new Date()).format("YYYY-MM-DD");
    let newDate = moment(dateState).format("YYYY-MM-DD");
    var bookedStatus = false;
    let hours = new Date().getHours();
    let min = new Date().getMinutes();

    let hrs = stTime.split(":")[0];
    let mn = stTime.split(":")[1];

    if (newDate < currentDate) {
      bookedStatus = true;
    } else if (newDate === currentDate) {
      if (parseInt(hrs) < hours) {
        bookedStatus = true;
      }
      if (parseInt(hrs) === hours && parseInt(mn) < min) {
        bookedStatus = true;
      }
    }
    if (moment(newDate).format("dddd") == "Monday") {
      bookedStatus = true;
    } else if (
      moment(newDate).format("dddd") == "Saturday" ||
      moment(newDate).format("dddd") == "Sunday"
    ) {
      if (stTime >= "5:00" && stTime <= "9:30") bookedStatus = true;
    } else {
      if (
        (stTime >= "5:00" && stTime <= "9:30") ||
        (stTime >= "12:00" && stTime <= "15:30") ||
        (stTime >= "10:00" && stTime <= "11:30")
      ) {
        bookedStatus = true;
      }
    }
    return bookedStatus;
  };

  const [loading1, setLoading1] = useState(true);
  let userDA: any = [];
  const [userDetailsA, setUserDetailsA] = useState(userDA);
  const bookingDetailsData = async (e) => {
    if (mainLangQ !== "") {
      const dateBooking = moment(dateStateForQuery)?.format("YYYY-MM-DD");
      let response = await bookingStatusApi(
        mainLangQ,
        dateBooking,
        loggedInUser
      );
      setLoading1(false);

      if (response.statusCode == 0) {
        // setBookingStats(response.result);  
        // setBookingStats(dummyBooking);

        if (response.result) {
          let temp = response.result[0].slots;
          temp.map((item: any) => {
            if (item.booked) {
              userIdHandler(item.user_id);
            }
          });
        }
        setdata(response?.result[0]?.slots);

      } else {
        setdata([]);
      }

    }
  };
  const [facilityId, setFacilityId] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [confirmpaymentStatus, setConfirmPaymentStatus] = useState(false);
  const [paidPaymentStatus, setPaidPaymentStatus] = useState(false);
  const userIdHandler = async (bookingUser) => {
    let response = await userIdApi(bookingUser, loggedInUser);
    let userObject = {
      userId: bookingUser,
      fullname: response?.data?.firstname + " " + response?.data?.lastname,
      profileurl: response?.data?.profile_url ?? null,
      mobileno: response?.data?.mobileno ?? null,
    };
    setUserDetailsA((oldArray: any) => [...oldArray, userObject]);
    // console.log('user details === ', userDetailsA)
  };
  const bookingNameHandler = (id: any) => {
    const user = userDetailsA.filter((itw: any) => {
      return itw.userId === id;
    });
    // console.log('user details ===> ', user[0])
    return user[0];
  };

  const userInfoDetails = async () => {
    let response = await userInfoApi(userInfo, loggedInUser);
    setUserDetail(response?.data?.firstname);
    setUserId(response?.data?._id);
  };
  const getallFacilityUr = async () => {
    let response;
    if (!loggedUserDetails?.roleId) {
      response = await getFacilityApi(loggedInUser);
    } else {
      response = await getFacilityByIdApi(
        loggedInUser,
        loggedUserDetails?.facility_id
      );
      response.result = [response.result];
      response.result[0]._id = response.result[0].id;
    }
    setGetFacility(response?.result);
    setFacilityId(response?.result[0]?._id);
  };
  useEffect(() => {
    userInfoDetails();
    getallFacilityUr();
  }, []);

  // filter by courts
  const inputRef = useRef(null);
  const clearFilter = () => {
    // @ts-ignore
    inputRef.current.value = "";
    window.location.reload();
  };
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>();
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const formatTimeWithTimeStamp = (timeString, withAMPM) => {
    let hourString = timeString.split(":")[0];
    let minute = timeString.split(":")[1];
    const hour = +hourString % 24;
    if (withAMPM) {
      return (hour % 12 || 12) + ":" + minute + " " + (hour < 12 ? "AM" : "PM");
    } else {
      return (hour % 12 || 12) + ":" + minute;
    }
  };
  const getDateString = (date, startTime, endTime) => {
    const tempDate = new Date(date);
    return (
      tempDate.toLocaleDateString("en-us", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }) +
      " , " +
      formatTimeWithTimeStamp(startTime, false) +
      " - " +
      formatTimeWithTimeStamp(endTime, true)
    );
  };
  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < courtOptions.length);
    setCheckAll(list.length === courtOptions.length);
  };
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? courtOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  // filter by Timings
  const [checkedList1, setCheckedList1] = useState<CheckboxValueType[]>();
  const [indeterminate1, setIndeterminate1] = useState(true);
  const [checkAll1, setCheckAll1] = useState(false);
  const [pageOpen, setPageOpen] = useState(false);

  const onChange1 = (list: CheckboxValueType[]) => {
    setCheckedList1(list);
    setIndeterminate1(!!list.length && list.length < timingOptions.length);
    setCheckAll1(list.length === timingOptions.length);
  };
  const onCheckAllChange1 = (e: CheckboxChangeEvent) => {
    setCheckedList1(e.target.checked ? timingOptions : []);
    setIndeterminate1(false);
    setCheckAll1(e.target.checked);
  };
  // const [matches, setMatches] = useState(
  //   window.matchMedia("(min-width: 768px)").matches
  // );
  // useEffect(() => {
  //   window
  //     .matchMedia("(min-width: 768px)")
  //     .addEventListener("change", (e) => setMatches(e.matches));
  // }, []);
  const [loginData, setLoginData] = useState({
    name: "",
    mobileno: "",
  });

  const handleBlur = (e) => {
    const newLoginData = { ...loginData };
    newLoginData[e.target.name] = e.target.value;
    setLoginData(newLoginData);
  };
  const handleAddBooking = async () => {
    let phonetest = phoneReg.test(loginData?.mobileno);
    if (phonetest == true) {
      toast(
        <ToastMessage
          body="The Phone Number needs to be 10 Digits!"
          type="error"
        />,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        }
      );

      return;
    }
    let dateSelected = moment(dateState).format("YYYY-MM-DD");
    let courtID = bookingStats?.map((option) => option.id);

    let stTime = addBookingModalData.startTime.split(":");
    if (stTime[0].length === 1) {
      stTime[0] = "0" + stTime[0];
    }
    let etTime = addBookingModalData.endTime.split(":");
    if (etTime[0].length === 1) {
      etTime[0] = "0" + etTime[0];
    }
    let finalStTime = stTime[0] + ":" + stTime[1];
    let finalEtTime = etTime[0] + ":" + etTime[1];
    const formData = {
      court_id: courtID[0],
      slot_ids: [addBookingModalData.id],
      facility_id: facilityId,
      booking_date: dateSelected,
      name: loginData.name,
      coupon: false,
      manual: true,
      mobile_number: parseInt(loginData?.mobileno),
      start_time: addBookingModalData.startTime,
      end_time: addBookingModalData.endTime,
      startTimestamp: new Date(`${dateSelected}T${finalStTime}`).valueOf(),
      endTimestamp: new Date(`${dateSelected}T${finalEtTime}`).valueOf(),
    };
    setAddBookingModal(false);
    let response = await bookingApi(loggedInUser, formData);

    if (response?.error === false) {
      let dataConfirmed = {
        status: "Confirmed",
      };
      let resp = await bookingConfirmApi(
        response.data[0]._id,
        loggedInUser,
        dataConfirmed
      );
      if (resp.error === false) {
        setLoading1(false);
        toast(
          <ToastMessage
            body="The slots were booked successfully!"
            type="success"
          />,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
          }
        );
        setTimeout(() => {
          bookingDetailsData(resp.data);
        }, 500);
      } else {
        toast(<ToastMessage body={resp.message} type="error" />, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else {
      toast(<ToastMessage body={response.message} type="error" />, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

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
        <Card className="bookings-card">
          <Breadcrumb
            items={[
              {
                title: "Home",
              },
              {
                title: "Bookings",
              },
            ]}
          />
          <h5 className="main-content-title">Bookings</h5>
          <div className="filters-title-buttons">
            <div className="type-filter">
              <Radio.Group
                options={options}
                onChange={onSportsChange}
                value={sport_type ? sport_type : "all"}
              />
            </div>
            <Button className="select-slot">select slot</Button>
            <Button
              className="pi-btn-primary"
              key="confirm"
              type="primary"
              onClick={handleEditBooking}
            >
              Book Now
            </Button>
          </div>
          <Row>
            <Col className="container-calendar" md={"auto"}>
              <div className="m-10 mt-6">
                <Calendar
                  className=""
                  // minDate={new Date()}
                  value={dateState}
                  onChange={changeDate}
                />
                <Divider className="divider-style" />
                <div className="flex-contents">
                  <p className="court-txt">Courts</p>
                  {/* <p
                    className="filter"
                    onClick={clearFilter}
                    style={{
                      fontSize: "12px",
                      cursor: "pointer",
                      color: "gray",
                      marginTop: "13px",
                      marginLeft: "100px",
                      marginBottom: "1px",
                    }}
                  >
                    <u>Clear All</u>
                  </p> */}
                </div>
                <div className="ml-10 mt-10">
                  <Checkbox
                    ref={inputRef}
                    indeterminate={indeterminate}
                    onChange={onCheckAllChange}
                    checked={checkAll}
                  >
                    All Courts
                  </Checkbox>
                  <CheckboxGroup
                    ref={inputRef}
                    className="grid-contents"
                    options={courtOptions}
                    value={checkedList}
                    onChange={onChange}
                  />
                </div>
                <Divider className="divider" />
              </div>
            </Col>
            <Col id="slott" xs={"auto"} md={14} flex={"auto"}>
              <div className="m-10">
                <Paper>
                  <div className="p-10">
                    <div className="filter-btn-container">
                      <div className="mt-5 justify-start">
                        {/* <Button
                      style={{
                        background: "grey",
                        borderRadius: "15px",
                        color: "#ffffff",
                        float: "right",
                        margin: 10,
                      }}
                    >
                      Book Now
                    </Button> */}
                        <span className="select-facility-text">
                         Select Facility{" "}
                        </span>
                        <br />
                        <div className="form-group-booking">
                          <select

                            name="facility"
                            onChange={(e) => {
                              if (e?.target?.value === "") {
                                // setMainLang("");

                              
                                setShowSelectedFacility(true);
                              } else {
                                setShowSelectedFacility(false);
                              }
                           
                              mainLangQ = e?.target?.value;
                              setMainLang(e?.target?.value);
                              bookingDetailsData(e);
                            }}
                            value={mainLang}
                          >
                            {" "}
                            <option value="">Select Facility Name</option>
                            {getFacility?.map((option: Option) => (
                              <option value={option?._id}>{option?.name}</option>
                            ))}
                          </select>
                        </div>
                        {/* <BookingDetails /> */}
                      </div>
                      <div className="filter-buttons-grp">
                        <Button
                          className="pi-btn-primary cb"
                          key="confirm"
                          type="primary"
                        >
                          Apply
                        </Button>
                        <Button className="pi-btn-secondary" key="cancel">
                          {" "}
                          Clear
                        </Button>
                      </div>
                      {/* <br /> */}
                    </div>
                    <div className="selected-date-container">
                      <p className="selected-date-text">
                        <CalendarOutlined />{" "}
                        {moment(dateState).format("MMMM DD, YYYY")}
                      </p>
                    </div>
                    <div>
                      {showSelectedFacility ? (
                        <div className="nofacility-text">
                          Please select a facility.
                        </div>
                      ) : (
                        <div>
                          <Row gutter={12}>
                            {data.length > 0 ? <>
                              <Col span={2}>
                                <div className="booking-slots-container">
                                  {data.map((item: Option) => (
                                    <div className="booking-slots-button">
                                      <p className="booking-slots-button-text">
                                        {item.startTime}{" "}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </Col>

                              <Col className="table-col" span={22}>
                                {bookingStats?.map((item, index) => (
                                  <table
                                    cellPadding={1}
                                    cellSpacing={1}
                                    className="booking-table-container"
                                  >
                                    <thead>
                                      <tr>
                                        <th key={item?.id} className="table-head">
                                          {item?.name}
                                        </th>
                                      </tr>
                                    </thead>
                                    <tr>
                                      {item.slots?.map((item, index) => {
                                        return (
                                          <tr role="row">
                                            {item?.booked === true && (
                                              <td
                                                className="slots-time"
                                                key={item.id}
                                              >
                                                <div>
                                                  <Button
                                                    onClick={() => {
                                                      if (
                                                        timeOut(item.startTime) ===
                                                        false &&
                                                        item?.status === "Confirmed"
                                                      ) {
                                                        showConfirmUnpaidModal(
                                                          item
                                                        );
                                                      } else if (
                                                        item.status === "Paid"
                                                      ) {
                                                        showConfirmedPaidModal(
                                                          item
                                                        );
                                                      }
                                                    }}
                                                    className={
                                                      item.booked === true &&
                                                        item.status === "Confirmed"
                                                        ? "bookedConfirmed mt-9"
                                                        : "bookedPaid mt-9"
                                                    }
                                                  >
                                                    <span className="mt-5">
                                                      <img
                                                        className="imgUserBook"
                                                        // placeholder={userImage}
                                                        alt=""
                                                        src={
                                                          bookingNameHandler(
                                                            item.user_id
                                                          )?.profileurl !== null
                                                            ? bookingNameHandler(
                                                              item.user_id
                                                            )?.profileurl +
                                                            "?" +
                                                            Math.random().toString()
                                                            : userImage
                                                        }
                                                        height="24px"
                                                        width="24px"
                                                      />
                                                      &nbsp;
                                                    </span>
                                                    <span className="spell">
                                                      {bookingNameHandler(
                                                        item.user_id
                                                      )?.fullname ?? null}
                                                    </span>

                                                    {item.status === "Paid" && (
                                                      <CheckCircleOutlined />
                                                    )}
                                                    {item.status ===
                                                      "Confirmed" && (
                                                        <StopOutlined />
                                                      )}
                                                  </Button>
                                                </div>
                                              </td>
                                            )}
                                            {item?.booked === false && (
                                              <td
                                                className="slots-time"
                                                key={item.id}
                                              >
                                                <div>
                                                  <Button
                                                    className={
                                                      timeOut(item.startTime) ===
                                                        false
                                                        ? "bookingAvailable mt-9"
                                                        : "bookingBlocked mt-9"
                                                    }
                                                    onClick={() => {
                                                      if (
                                                        timeOut(item.startTime) ===
                                                        false
                                                      ) {
                                                        showAddBookingModal(item);
                                                      }
                                                    }}
                                                  >
                                                    {timeOut(item.startTime) ===
                                                      true && <FieldTimeOutlined />}
                                                    {timeOut(item.startTime) ===
                                                      false && <span>Select</span>}
                                                  </Button>
                                                </div>
                                              </td>
                                            )}
                                            <br />
                                          </tr>
                                        );
                                      })}
                                    </tr>
                                  </table>
                                ))}
                                <AddBooking
                                  loginData={loginData}
                                  onChange={handleBlur}
                                  dateState={dateState}
                                  title="Add New Booking"
                                  open={addBookingModal}
                                  onCancel={closeAddBookingModal}
                                  onOk={() => setAddBookingModal(false)}
                                  onClick={handleAddBooking}
                                  modaldata={addBookingModalData}
                                  bookingStats={bookingStats}
                                ></AddBooking>

                                {userDetailsA.length > 0 && confirmBookingModal && (
                                  <ConfirmBooking
                                    confirmStatus={false}
                                    dateState={dateState}
                                    userDetailsA={userDetailsA}
                                    title="Confirm Booking"
                                    open={confirmBookingModal}
                                    onCancel={() => setConfirmBookingModal(false)}
                                    onOk={() =>
                                      handleConfirmBooking(
                                        paidPaymentStatus,
                                        confirmBookingUnpaidModalData.booking_id
                                      )
                                    }
                                    onClick={handleCancelConfirmBooking}
                                    modaldata={confirmBookingUnpaidModalData}
                                    paymentStatus={paidPaymentStatus}
                                    bookingStats={bookingStats}
                                    onChange={(checked) =>
                                      setPaidPaymentStatus(checked)
                                    }
                                  ></ConfirmBooking>
                                )}

                                {userDetailsA.length > 0 && bookingDetailsModal && (
                                  <BookingDetails
                                    modaldata={confirmBookingPaidModalData}
                                    open={bookingDetailsModal}
                                    onCancel={() => setBookingDetailsModal(false)}
                                    setBookingDetailsModal={setBookingDetailsModal}
                                    getBookings={() => { }}
                                    courts={[]}
                                    onOk={() =>
                                      handleConfirmBooking(
                                        paidPaymentStatus,
                                        confirmBookingPaidModalData.booking_id
                                      )
                                    }
                                    matches={matches}
                                    isbookedwithlastslot={false}
                                  />

                                  // <ConfirmBooking
                                  //   confirmStatus={true}
                                  //   dateState={dateState}
                                  //   userDetailsA={userDetailsA}
                                  //   title="Booking Details"
                                  //   open={bookingDetailsModal}
                                  //   onCancel={() => setBookingDetailsModal(false)}
                                  //   onOk={() =>
                                  //     handleConfirmBooking(
                                  //       paidPaymentStatus,
                                  //       confirmBookingPaidModalData.booking_id
                                  //     )
                                  //   }
                                  //   onClick={handleCancelBookingDetails}
                                  //   modaldata={confirmBookingPaidModalData}
                                  //   paymentStatus={paidPaymentStatus}
                                  //   bookingStats={bookingStats}
                                  //   onChange={(checked) =>
                                  //     setConfirmPaymentStatus(checked)
                                  //   }
                                  // ></ConfirmBooking>
                                )}

                                {userDetailsA.length > 0 &&
                                  (cancelBookingUnpaidModal ||
                                    cancelBookingPaidModal) && (
                                    <CancelBookingDetails
                                      title="Cancel booking"
                                      open={
                                        cancelModal === "unpaid"
                                          ? cancelBookingUnpaidModal
                                          : cancelBookingPaidModal
                                      }
                                      body="You are about to cancel the booking. Are you
                                  sure you want to continue?"
                                      onCancel={
                                        cancelModal === "unpaid"
                                          ? () => setCancelBookingUnpaidModal(false)
                                          : () => setCancelBookingPaidModal(false)
                                      }
                                      handleCancel={
                                        cancelModal === "unpaid"
                                          ? () =>
                                            handleCancelBookingUnpaid(
                                              confirmBookingUnpaidModalData
                                            )
                                          : () =>
                                            handleCancelBookingPaid(
                                              confirmBookingPaidModalData
                                            )
                                      }
                                    ></CancelBookingDetails>
                                  )}
                              </Col>
                            </> : <>
                              <span className="select-facility-text" style={{ marginLeft: "5px", marginBottom: "10px" }}>
                                No Slots Available{" "}
                              </span>
                            </>}
                          </Row>
                        </div>
                      )}
                    </div>
                    {error && (
                      <p className="error-page-txt">
                        <CheckCircleOutlined />{error}
                      </p>
                    )}
                  </div>
                </Paper>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
      <ToastContainer
        toastStyle={{ backgroundColor: "#032037", color: "#ffffff" }}
      />
    </Fragment>
  );
};
export default Booking;
