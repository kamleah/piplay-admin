import React, { Fragment } from "react";
import { Card, Breadcrumb } from "antd";

const NewsArticle = () => {
  return (
    <Fragment>
      <div className="page-header">
        <Card>
          <Breadcrumb
            items={[
              {
                title: "Home",
              },
              {
                title: "NewsArticle",
              },
            ]}
          />
          <h5 className="main-content-title">News & Article</h5>
        </Card>
      </div>
    </Fragment>
  );
};
export default NewsArticle;
