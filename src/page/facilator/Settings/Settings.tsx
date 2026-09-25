import React, { Fragment } from "react";
import { Card, Breadcrumb } from "antd";
import "../../../components/css/style.css";

const Settings = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {
  return (
    <Fragment>
      <div 
        className={menuOpen ? `page-open-header${matches ? "-mobile" : ""}` : `page-header${matches ? "-mobile" : ""}`}

      >
        <Card>
          <Breadcrumb
            items={[
              {
                title: "Home",
              },
              {
                title: "Setting",
              },
            ]}
          />
          <h5 className="main-content-title">Setting</h5>
        </Card>
      </div>
    </Fragment>
  );
};
export default Settings;
