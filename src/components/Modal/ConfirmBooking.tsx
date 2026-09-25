import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, Switch, Divider } from "antd";
import bookingInterface from "../InterFace/BookingInterface";
import {
  bookingTestNameHandler,
  getTestDateString,
} from "../Helpers/HelperFunc";
import "../css/style.css";
import userImage from "../../assets/icon/user.jpeg";
import BookingDetails from "./BookingDetails";
import { getAddPlayersBookingsAPI } from "../apiFile/Service";

const ConfirmBooking = ({
  title,
  open,
  onCancel,
  onOk,
  onClick,
  modaldata,
  paymentStatus,
  bookingStats,
  onChange,
  userDetailsA,
  dateState,
  confirmStatus,
}) => {
  const [players, setPlayers] = useState([])

  const loggedInUser = localStorage.getItem("auth");

  const getAddPlayersBookings = async () => {
    let response
    response = await getAddPlayersBookingsAPI(loggedInUser, modaldata?.booking_id);
    setPlayers(response.data);
  }

  useEffect(() => {
    getAddPlayersBookings()
  }, [])
  return (
    <div>
      <Modal
        title={<p className="text-black/[.88] text-[30px] font-700">{title}</p>}
        mask={false}
        width="400px"
        style={{ top: 20 }}
        open={open}
        onCancel={onCancel}
        onOk={onOk}
        footer={
          !confirmStatus
            ? [
              <Button
                key="back"
                className="cancelBookingButton"
                onClick={onClick}
              >
                Cancel Booking
              </Button>,
              <Button
                className={!paymentStatus ? "disableButton" : "submitButton"}
                key="submit"
                htmlType="submit"
                form="myForm"
                disabled={!paymentStatus}
                onClick={onOk}
              >
                Confirm Booking
              </Button>,
            ]
            : [
              <Button
                key="back"
                className="cancelBookingButton"
                onClick={onClick}
              >
                Cancel Booking
              </Button>,
              // <BookingDetails modaldata={modaldata} players={players} />
            ]
        }
      >
        <div>
          <div className="divMargin">
            <label className="modalLabel">Slot</label>
            <p className="modalParagraph">
              {getTestDateString(
                dateState,
                modaldata.startTime,
                modaldata.endTime
              )}
            </p>
          </div>

          <div className="divMargin">
            <label className="modalLabel">Court</label>
            <p className="modalParagraph">
              {bookingStats.map((option: bookingInterface) => option.name)}
            </p>
          </div>
          <div className="divMargin">
            <label className="modalLabel">Player Name</label>
            <p className="modalParagraph">
              <img
                className="imgUserBook"
                alt=""
                // placeholder={userI}
                src={
                  bookingTestNameHandler(userDetailsA, modaldata.user_id)
                    ?.profileurl !== null
                    ? bookingTestNameHandler(userDetailsA, modaldata.user_id)
                      ?.profileurl +
                    "?" +
                    Math.random().toString()
                    : userImage
                }
                height="24px"
                width="24px"
              />
              &nbsp;
              {bookingTestNameHandler(userDetailsA, modaldata.user_id)
                ?.fullname ?? null}
            </p>
          </div>

          <div className="divMargin">
            <label className="modalLabel">Phone</label>
            <p className="modalParagraph">
              {bookingTestNameHandler(userDetailsA, modaldata.user_id)
                ?.mobileno ?? null}
            </p>
          </div>
          <div className="divMargin">
            <label className="modalLabel">Payment Confirmed ?</label>
            {!confirmStatus ? (
              <Switch
                style={{ float: "right" }}
                checked={paymentStatus}
                onChange={onChange}
              />
            ) : (
              <p className="modalParagraph">Yes</p>
            )}
          </div>
          {modaldata.coupon &&
            <div className="divMargin">
              <label className="modalLabel">Coupon Applied ( % )</label>
              <p className="modalParagraph">
                {modaldata.coupon_name} - {modaldata.percentage} %
              </p>
            </div>}
          <Divider />
        </div>
      </Modal>
    </div>
  );
};
export default ConfirmBooking;
