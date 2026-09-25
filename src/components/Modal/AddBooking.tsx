import React from "react";
import { Input, Form, Modal, Button, Divider } from "antd";
import bookingInterface from "../InterFace/BookingInterface";
import { getTestDateString } from "../Helpers/HelperFunc";
import "../css/style.css";
import { CalendarOutlined } from "@ant-design/icons";

const AddBooking = ({
  title,
  open,
  onCancel,
  onOk,
  onClick,
  loginData,
  modaldata,
  bookingStats,
  onChange,
  dateState,
}) => {
  return (
    <div>
      <Modal
        title={<p className="text-black/[.88] text-[30px] font-700">{title}</p>}
        style={{ top: 20 }}
        width="400px"
        mask={false}
        open={open}
        onCancel={onCancel}
        onOk={onOk}
        footer={[
          <Button key="back" className="cancelButton" onClick={onCancel}>
            Cancel
          </Button>,
          <Button
            disabled={loginData.name === "" || loginData?.mobileno === ""}
            className={
              loginData.name === "" || loginData?.mobileno === ""
                ? "disableButton"
                : "submitButton"
            }
            key="submit"
            htmlType="submit"
            form="myForm"
            onClick={onClick}
          >
            {title}
          </Button>,
        ]}
      >
        <Form id="myForm1" encType="multipart/form-data">
          <div className="divMargin">
            <label  htmlFor= "booking_date" className="modalLabel">Slot<span style={{ color: "red" }}>*</span></label>
            <Input
              id="booking_date"
              className="inputBox"
              onChange={onChange}
              type="text"
              placeholder="Slot"
              name="booking_date"
              value={getTestDateString(
                dateState,
                modaldata.startTime,
                modaldata.endTime
              )}
              suffix={<CalendarOutlined />}
            />
          </div>

          <div className="divMargin">
            <label className="modalLabel">Court<span style={{ color: "red" }}>*</span></label>
            <Input
              className="inputBox"
              value={bookingStats?.map(
                (option: bookingInterface) => option.name
              )}
            />
          </div>
          <div className="divMargin">
            <label className="modalLabel">Player Name<span style={{ color: "red" }}>*</span></label>
            <Input
              className="inputBox"
              onChange={onChange}
              type="text"
              placeholder="Add Player"
              name="name"
              value={loginData.name}
            />
          </div>

          <div className="divMargin">
            <label className="modalLabel">Phone<span style={{ color: "red" }}>*</span></label>
            <Input
              className="inputBox"
              onChange={onChange}
              type="number"
              placeholder="Add Phone number"
              name="mobileno"
              value={loginData?.mobileno}
            />
          </div>
          <Divider />
        </Form>
      </Modal>
    </div>
  );
};

export default AddBooking;