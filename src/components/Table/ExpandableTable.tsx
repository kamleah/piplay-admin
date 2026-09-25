import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component';
import { json } from 'react-router-dom';
import Table from './DataTable';
import { Checkbox } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

const ExpandableTable = ({ columns, data, renderSubRow, pagination = true, lastHeadingEnd = 'flex-end', filterValue }) => {
     const [tableData, setTableData] = useState(data)
     const handleRowClicked = (row: any) => { console.log(row) }
   
     const customStyles = {
          rows: {
               style: {
                    minHeight: '72px', // override the row height
                    borderBottom: '1px solid #EBEBEB !important'
               },
          },
          headRow: {
               style: {
                    backgroundColor: '#003F70',
                    fontSize: '11px', // override the cell padding for head cells
                    fontWeight: 600,
                    color: '#FFFFFF',
                    
                    
               },
          },
          table: {
               style: {
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #EBEBEB !important'
               },
          },
          headCells: {
               style: {
                    '&:last-child': {
                         justifyContent: 'center',
                    },
               },
          },
          cells: {
               style: {
                    paddingLeft: '16px', // override the cell padding for data cells
                    paddingRight: '16px', // override the cell padding for head cells
                    fontSize: '10px',
                    fontWeight: 600,
                    color: '#727272',
               },
          },
          contextMenu: {
               style: {
                    fontSize: '18px',
                    fontWeight: 400,
                    paddingLeft: '16px',
                    paddingRight: '8px',
                    transform: 'translate3d(0, -100%, 0)',
                    transitionDuration: '125ms',
                    transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
                    willChange: 'transform',
                    backgroundColor: 'red'
               },
               activeStyle: {
                    transform: 'translate3d(0, 0, 0)',
               },
          },
     };

     useEffect(() => {
          setTableData(data);
     }, [data])

     return (
          <DataTable
               customStyles={customStyles}
               columns={columns}
               data={tableData}
               onRowClicked={handleRowClicked}
               highlightOnHover
               pagination={pagination}
               paginationPerPage={10}
               paginationRowsPerPageOptions={[10, 15, 25, 50, 100]}
               paginationComponentOptions={{
                    rowsPerPageText: 'Records per page',
                    rangeSeparatorText: 'out of',
                    selectAllRowsItem: false,
               }}
               expandableRows
               expandableRowExpanded={(row) => row.children.length > 0} 
               expandableRowsComponent={(row) => renderSubRow(row)}
               expandableRowDisabled={(row) => row.children.length === 0} // Disable expansion for rows without children
               conditionalRowStyles={[ // Apply conditional styles to rows
                    {
                         when: (row) => !row.path?.toLowerCase().includes(filterValue?.toLowerCase()), // Check if the row matches the filter
                         style: {
                              display: 'none', // Hide the row if it doesn't match the filter
                         },
                    },
               ]}
          />
     )
}

export default ExpandableTable