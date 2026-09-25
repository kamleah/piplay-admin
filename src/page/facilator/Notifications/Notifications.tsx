import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Card, Breadcrumb } from "antd";
import "../../../components/css/style.css";

const Notifications = () => {
  return (
    <Fragment>
      <div className="c page-header">
        <Card>
          <Breadcrumb
            items={[
              {
                title: "Home",
              },
              {
                title: "Notifications",
              },
            ]}
          />
          <h5 className="main-content-title">Notifications</h5>
          <div className="text-center mb-4">
            <Link to="#" className="btn ripple btn-primary w-md" role="button">
              Load more
            </Link>
          </div>{" "}
        </Card>
      </div>
    </Fragment>
  );
};
export default Notifications;
