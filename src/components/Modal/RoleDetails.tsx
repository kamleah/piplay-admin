import React, { useEffect } from 'react';
import { Modal, Button } from 'antd';
import './Modal.css'
import UserLabel from "../../components/Labels/UserLabel";
import SkillLabel from "../../components/Labels/SkillLabel";
import StatusLabel from "../../components/Labels/StatusLabel";
import { Icon } from "@iconify-icon/react";
import moment from 'moment';
import { Footer } from 'antd/es/layout/layout';
import Table from '../Table/DataTable';
import ExpandableTable from '../Table/ExpandableTable';

const RoleDetails = ({ visible, name, onConfirm, onCancel, row }) => {

     const customTitle = (
          <div className="custom-ant-modal-header">
               {name}
          </div>
     );

     const columns = [
          {
               name: 'Modules',
               selector: row => row?.label,
               sortable: true,
               wrap: true,
          },

          {
               name: "Permission",
               selector: row => 'Dashboard, Bookings, Facility Management, Events, Coupons, Settings ',
               wrap: true,
               sortable: false,
               cell: row => (
                    <div className='permissions-container'>
                         {(
                              (row.view && row.add && row.edit && row.delete && row.export)
                                   ? <StatusLabel status={'All'} />
                                   : (row.view || row.add || row.edit || row.delete || row.export) ? (
                                        <>
                                             {row.view && <StatusLabel status={'View'} />}
                                             {row.add && <StatusLabel status={'Add'} />}
                                             {row.edit && <StatusLabel status={'Edit'} />}
                                             {row.delete && <StatusLabel status={'Delete'} />}
                                             {row.export && <StatusLabel status={'Export'} />}
                                        </>
                                   ) :  <StatusLabel status={'None'} /> 
 
                         )}
                    </div>
               ),
          }
     ];

     const renderSubRow = (row) => {
          const subcolumns = [
               {
                    name: 'Modules',
                    selector: row => row?.label,
                    sortable: true,
                    wrap: true,
                    style: {
                         paddingLeft: '65px'
                    },
               },

               {
                    name: "Permission",
                    selector: row => 'Dashboard, Bookings, Facility Management, Events, Coupons, Settings ',
                    wrap: true,
                    sortable: false,
                    cell: row => (
                         <div className='permissions-container'>
                              {(
                                   (row.view && row.add && row.edit && row.delete && row.export)
                                        ? <StatusLabel status={'All'} />
                                        : (row.view || row.add || row.edit || row.delete || row.export) ? (
                                             <>
                                                  {row.view && <StatusLabel status={'View'} />}
                                                  {row.add && <StatusLabel status={'Add'} />}
                                                  {row.edit && <StatusLabel status={'Edit'} />}
                                                  {row.delete && <StatusLabel status={'Delete'} />}
                                                  {row.export && <StatusLabel status={'Export'} />}
                                             </>
                                        ) : <StatusLabel status={'None'} />

                              )}
                         </div>
                    ),
               }
          ];

          return (
               <div>
                    <Table data={row.data.children} columns={subcolumns} pagination={false} header={true} />
               </div>
          );
     };

     return (
          <Modal
               title={customTitle}
               visible={visible}
               onOk={onConfirm}
               onCancel={onCancel}
               footer={null}
               className="custom-ant-modal registration-modal lable-content-width"
          >
               <div className='grid-section border-bottom-light'>
                    <div className="grid-item-1">
                         <h4 className='info-label' >Role</h4>
                         <p className='info-value' >{row?.rolename}</p>
                    </div>
                    <div className="grid-item">
                         <h4 className='info-label' >Users Assigned</h4>
                         <p className='info-value' >{row?.userCount}</p>
                    </div>
                    <div className="grid-item col-span-2 col-span-2-sm-keep">
                         <h4 className='info-label' >Permissions</h4>
                         <ExpandableTable columns={columns} data={row?.data} renderSubRow={renderSubRow} pagination={false} lastHeadingEnd={'flex-start'} filterValue={''} />
                    </div>
               </div>
               <Footer className='ant-modal-footer'>
                    <button type="button" className="pi-btn-secondary" onClick={onCancel}>
                         Cancel
                    </button>
               </Footer>
          </Modal>
     );
};

export default RoleDetails;
