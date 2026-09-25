import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component';
import noDataImage from "../../assets/icon/no_result.png";
import { alignProperty } from '@mui/material/styles/cssUtils';

const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
    noRowsPerPage: false,
    paginationPerPage: 5,
};
const conditionalRowStyles = [
    {
        when: row => row.toggleSelected,
        style: {
            backgroundColor: "#EEEEEE",
            userSelect: "none",
            color: "#000300",
            border: "none",
        }
    }
];


const Table = ({ columns, data, pagination = true, header = false, lastHeadingEnd = 'flex-end', filterValue = true, lastcolumnWidth = '150px', customColumnHeaderWidth = '100px' }) => {
    const isDevelopment = process.env.REACT_APP_ENV === "dev";
    const customStyles = {
        rows: {
            style: {
                minHeight: '50px', // override the row height
                borderBottom: '1px solid #EBEBEB !important'
            },
        },
        headRow: {
            style: {
                backgroundColor: isDevelopment ? 'rgb(56, 0, 56)' : '#003F70',
                fontSize: '11px', // override the cell padding for head cells
                fontWeight: 600,
                color: '#FFFFFF',
                justifyContent: 'center',
              
            },
        },
        table: {
            style: {
                borderRadius: '12px',
                // overflow: 'hidden',
                border: '1px solid #EBEBEB !important'
            },
        },
        headCells: {
            style: {
                maxWidth: '100px',
                paddingLeft: '10px !important',
                paddingRight: '10px !important',
                '& > div *': {
                    overflow: 'unset !important',
                    whiteSpace: 'unset !important',
                    textOverflow: 'unset !important',
                },
                '& > div': { 
                    overflow: 'unset !important',
                },
                '&:last-child': {
                    justifyContent: 'center',
                    alignItem: 'center'
                },
                '&:nth-of-type(2)': {
                    minWidth: customColumnHeaderWidth
                },
                // '&:nth-of-type(3)': {
                //     justifyContent: 'center',
                //     alignItem: 'center'
                // },
                // '&:nth-of-type(4)': {
                //     justifyContent: 'center',
                //     alignItem: 'center'
                // },
                // '&:nth-of-type(5)': {
                //     justifyContent: 'center',
                //     alignItem: 'center'
                // },
                // '&:nth-of-type(6)': {   
                //     justifyContent: 'center',
                //     alignItem: 'center'
                // },

            },
        },
        cells: {
            style: {
                paddingLeft: '10px', // override the cell padding for data cells
                paddingRight: '10px', // override the cell padding for head cells
                fontSize: '10px',
                fontWeight: 600,
                color: '#727272',
                // '&:last-child': {
                //     justifyContent: lastHeadingEnd,
                //     minWidth: lastcolumnWidth,
                // },
            },
        },
        contextMenu: {
            style: {
                fontSize: '18px',
                fontWeight: 400,
                paddingLeft: '10px',
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

    const [tableData, setTableData] = useState(data)

    const handleRowClicked = (row: any) => { console.log(row) }
    const noData = () => {
        return (
            <>
                <div className="no-data-container">
                    <img
                        src={noDataImage}
                        alt="No data found"
                        className="no-data-image"
                    />
                </div>
            </>
        )
    }

    useEffect(() => {
        setTableData(data);
    }, [data])
    return (
        <DataTable
            noTableHead={header}
            customStyles={customStyles}
            columns={columns}
            data={tableData}
            onRowClicked={handleRowClicked}
            highlightOnHover
            // progressPending={loader}
            // progressComponent={<CustomLoading />}
            pagination={pagination}

            paginationPerPage={20}
            paginationRowsPerPageOptions={[20, 30, 50, 80, 100]}
            paginationComponentOptions={{
                rowsPerPageText: 'Records per page',
                rangeSeparatorText: 'out of',
                selectAllRowsItem: false,
            }}
            persistTableHead={true}
            conditionalRowStyles={[ // App ly conditional styles to rows
                {
                    when: (row) => (!filterValue), // Check if the row matches the filter
                    style: {
                        display: 'none', // Hide the row if it doesn't match the filter
                    },
                },
            ]}
            // activeStyle={{ backgroundColor: 'red' }}
            // conditionalRowStyles={conditionalRowStyles}
            noDataComponent={noData()}
        />
    )
}

export default Table