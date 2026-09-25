import React from 'react';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import noDataImage from "../../assets/icon/no_result.png";
import './tableStyle.css'

const isDevelopment = process.env.REACT_APP_ENV === "dev";

const customStyle = {
    headRow: {
        style: {
            backgroundColor: isDevelopment ? 'rgb(70, 2, 70)' : '#003F70',
            fontWeight: 600,
            color: '#FFFFFF',
            textAlign: 'center',
        },
    },
    bodyCell: {
        style: {
            textAlign: 'center', // Center align text in body cells
        },
    },
};

const noData = () => {
    return (
        <div className="no-data-container">
            <img
                src={noDataImage}
                alt="No data found"
                className="no-data-image"
            />
        </div>
    );
};

interface SubHeadTableProps {
    data: any[];
    columns: any[];
}

const SubHeadTable: React.FC<SubHeadTableProps> = ({ columns, data }) => {

    const components = {
        header: {
            cell: (props: any) => (
                <th {...props} style={customStyle.headRow.style}>
                    {props.children}
                </th>
            ),
        },
        body: {
            cell: (props: any) => (
                <td {...props} style={customStyle.bodyCell.style}>
                    {props.children}
                </td>
            ),
        },
    };

    return (
        <Table
            columns={columns}
            dataSource={data}
            bordered
            size="middle"
            components={components}
            scroll={{ x: 'calc(700px + 50%)', y: 67 * 20 }}
            locale={{
                emptyText: noData(),
            }}
            pagination={{ pageSizeOptions:[10, 30, 80, 100] }}
        />
    );
};

export default SubHeadTable;
