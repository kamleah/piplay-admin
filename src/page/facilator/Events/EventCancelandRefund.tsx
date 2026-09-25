import React, { useState, useEffect, Fragment } from 'react';
import Table from "../../../components/Table/DataTable";
import { Dropdown, Menu, Card, Breadcrumb, Button, Radio, RadioChangeEvent, Tooltip } from "antd";
import { Icon } from '@iconify-icon/react';
import { useSelector } from "react-redux";
import FilterData from "../../../components/Modal/FilterData";
import { Controller, useForm } from "react-hook-form";
import moment from 'moment';

function EventCancelandRefund({ matches, menuOpen, onToggle, modulePermissionsData }) {
    const [data, setData] = useState([]);


    const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
    const loggedInUser = localStorage.getItem("auth");

    const columns = [
        {
            name: 'Booking Date',
            selector: null,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Players',
            selector: null,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Partner',
            selector: null,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Event Details',
            selector: null,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Club',
            selector: null,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Payment',
            selector: null,
            sortable: true,
            wrap: true,
            // cell: row =>
            //     <div className='playerContainer'>
            //         {
            //             row?.payment_status == 'Completed' ?
            //                 <span style={{ color: 'green' }}>Success</span>
            //                 :
            //                 <span style={{ color: 'red' }}>{row?.payment_status}</span>
            //         }
            //         {
            //             row?.partner_payment &&
            //             <p>
            //                 {row?.partner_payment == 'Completed' ?
            //                     <span style={{ color: 'green' }}>Success</span>
            //                     :
            //                     <span style={{ color: 'red' }}>{row?.partner_payment}</span>
            //                 }
            //             </p>
            //         }
            //     </div>,
        },
        {
            name: 'Main Category',
            selector: null,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Free Category',
            selector: null,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Partner Status',
            selector: null,
            sortable: true,
            wrap: true,
            // cell: row => <div className='playerContainer'>
            // {
            //     row?.payment_status == 'Completed' ?
            //         <span style={{ color: 'green' }}>{row?.partner_status}</span>
            //         :
            //         <span style={{ color: 'Blue' }}>Solo</span>
            // }
            // </div>,
        },
        {
            name: 'Source',
            selector: null,            
            sortable: true,
            wrap: true,
        },
        {
            name: 'Version',
            selector: null,
            sortable: true,
            wrap: true,
        },
    ];

  return (
    <Fragment>
    <div
      onClick={onToggle}
      className={menuOpen ? `page-open-header${matches ? "-mobile" : ""}` : `page-header${matches ? "-mobile" : ""}`}
    >
      <Card>
        {!matches && <Breadcrumb
          items={[
            { title: "Home" },
            { title: "Event" },
            { title: "Event Cancellations and Refund" },
          ]}
        />}
        <div className="main-title-container">
          <div className="title-add-mobile">
            <h5 className="main-content-title">Event Cancellations and Refund</h5>
          </div>
        </div>
       
        <div className="main-content-card">
        {/* <div className="filter-section-container">
            {matches &&
              <div className="filter-section-container">
                <FilterData content={FilterSection} open={open} handleOpenChange={handleOpenChange} />
              </div>
            }
          </div>
          {!matches &&
            <FilterSection />
          } */}
          <div className='mt-5'>

            <Table
              columns={columns}
              data={data} 
              pagination
            />
          </div>
        </div>
      </Card>
    </div>
  </Fragment>
  )
}

export default EventCancelandRefund;