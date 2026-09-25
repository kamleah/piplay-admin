import React from "react";
import { Modal, Button } from "antd";
import "../css/style.css";

const CancelBookingDetails = ({
  title,
  body,
  open,
  onCancel,
  handleCancel,
}) => {
  return (
    <div>
      <Modal
        title={<p className="text-black/[.88] text-[30px] font-700">{title}</p>}
        mask={false}
        width="500px"
        style={{ top: 20 }}
        open={open}
        onCancel={onCancel}
        footer={[
          <Button
            key="back"
            className="cancelBookingButton"
            onClick={handleCancel}
          >
            {title}
          </Button>,
        ]}
      >
        <div className="divMargin">
          <p className="modalBookingParagraph">{body}</p>
        </div>
      </Modal>
    </div>
  );
};
export default CancelBookingDetails;
