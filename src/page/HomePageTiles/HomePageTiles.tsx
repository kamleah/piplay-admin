import { Breadcrumb, Button, Card } from 'antd';
import React, { Fragment, useEffect, useState } from 'react'
import Table from '../../components/Table/DataTable';
import { Icon } from '@iconify-icon/react';
import ToastMessage from '../facilator/ToastMessage/ToastMessage';
import { toast } from "react-toastify";
import { deleteTile, getAllTiles } from '../../components/apiFile/Service';
import StatusLabel from '../../components/Labels/StatusLabel';
import AddHomePageTile from '../../components/Modal/AddHomePageTile';
import HomePageTileDetails from '../../components/Modal/HomePageTileDetails';
import DeleteConfirmation from '../../components/Modal/DeleteConfirmation';

const HomePageTiles = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {
  const [data, setData] = useState([])
  const [edit, setEdit] = useState(false)
  const [editData, setEditData] = useState({})

  const [showViewModal, setShowViewModal] = useState(false);
  const [rowdata, setRowdata] = useState({});
  const [visible, setVisible] = useState(false);

  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);
  const loggedInUser = localStorage.getItem("auth");

  const copyToClipboard = (row) => {
    const rowDetails = JSON.stringify(row, null, 2);
    navigator.clipboard
      .writeText(rowDetails)
      .then(() => {
        toast(<ToastMessage body={"Copied Successfully"} type="success" />, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        console.error("Failed to copy row details to clipboard:", error);
      });
  };

  const columns = [
    {
      name: 'Icon/Image',
      selector: row => row?.icon,
      wrap: true,
      sortable: true,
      cell: row => (<img src={row?.icon} className='table-md-img img-contains' />)
    },
    {
      name: "Title",
      selector: row => row?.title,
      wrap: true,
      sortable: true,
    },
    {
      name: "Subtitle",
      selector: row => row?.subtitle,
      wrap: true,
      sortable: true,
    },
    {
      name: "Redirect Screen",
      selector: row => row?.redirect,
      wrap: true,
      sortable: true,
    },
    {
      name: "Position",
      selector: row => row?.position,
      wrap: true,
      sortable: true,
    },
    {
      name: "Status",
      selector: row => row?.active,
      wrap: true,
      sortable: true,
      cell: row =>
        <div className='playerContainer max-width-container'>
          <StatusLabel status={row?.status == true ? 'Active' : "Inactive"} />
        </div>
      ,
    },

    {
      name: "Action",
      selector: row => row?.action,
      wrap: true,
      cell: row => (
        <div className='action-button-container'>
          {/* {modulePermissionsData?.view &&
            <button className='action-button view-button' onClick={() => handleshowRegisteredModal(row, 'view')}>
              <Icon icon="raphael:view" />
            </button>} */}
          {modulePermissionsData?.edit &&
            <button className='action-button edit-button' onClick={() => { setEdit(true); setVisible(true); setEditData(row); handleshowRegisteredModal(row, 'edit') }}
            >
              <Icon icon="mdi:pencil-outline" title="Edit" />
            </button>}
          {modulePermissionsData?.delete &&
            <button onClick={() => {
              handleDeleteConfirmation(row._id)
            }} className='action-button delete-button'
            >
              <Icon icon="clarity:trash-solid" />
            </button>}
            {modulePermissionsData?.delete &&
            <button onClick={() => {
              copyToClipboard(row)
            }} className='action-button delete-button'
            >
              <Icon icon="solar:copy-bold" height={'18'} width={'18'} style={{ paddingLeft: '5px' }} />
            </button>}
        </div>
      ),
    },
  ];

  const getAllData = async () => {
    let response = await getAllTiles(loggedInUser);
    console.log(response)
    setData(response?.result)
  }
  const handleshowRegisteredModal = async (row: any, type: any) => {
    setRowdata(row);
    if (type == 'view') {
      setShowViewModal(true);
    } else if (type == 'edit') {
    } else if (type == 'add') {
      setRowdata({});
      setShowViewModal(false);
    }
  };
  const handleDeleteConfirmation = (id) => {
    setItemToDeleteId(id);
    setDeleteConfirmationVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDeleteId) {
      await DeleteFunction(itemToDeleteId);
      setDeleteConfirmationVisible(false);
      setItemToDeleteId("");
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationVisible(false);
    setShowViewModal(false);
    setItemToDeleteId("");
  };

  const DeleteFunction = async (id) => {
    let response = await deleteTile(loggedInUser, id)
    if (response?.statusCode == 0) {
      toast(<ToastMessage body={"Tile Deleted Successfully"} type="success" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      getAllData();
    } else {
      toast(<ToastMessage body={"Failed To Delete the Tile"} type="warning" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <Fragment>
      <div
        onClick={onToggle}
        className={menuOpen ? `page-open-header${matches ? "-mobile" : ""}` : `page-header${matches ? "-mobile" : ""}`}

      >
        <Card>
          {!matches && <Breadcrumb
            items={[
              {
                title: "Home",
              },
              {
                title: "Homepage Tiles",
              },
            ]}
          />}
          <div className="main-title-container">
            <div className="title-add-mobile">
              <h5 className="main-content-title">Homepage Tiles</h5>
              {matches && modulePermissionsData?.add &&
                <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => {
                  setVisible(true)

                  handleshowRegisteredModal({}, 'add')
                }}>Add Tile</Button>
              }
            </div>
            <div className='title-buttons'>
              {!matches && modulePermissionsData?.add &&
                <Button className="pi-btn-primary" key="confirm" type="primary" onClick={() => {
                  setVisible(true)
                  handleshowRegisteredModal({}, 'add')
                }}>Add Tile</Button>
              }
            </div>
          </div>
          <div className="main-content-card">
            <Table columns={columns} data={data} />
          </div>
        </Card>
      </div>
      <AddHomePageTile
        edit={edit}
        editdata={editData}
        visible={visible}
        setEdit={setEdit}
        setvisible={setVisible}
        onConfirm={handleConfirmDelete}
        getAllData={getAllData}
        setEditData={setEditData}
        name="Edit"
        row={rowdata}
      />
      <HomePageTileDetails
        visible={showViewModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        name="Banners Details"
        row={rowdata}
      />
      <DeleteConfirmation
        visible={deleteConfirmationVisible}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        name="Banner"
      />
    </Fragment>
  )
}

export default HomePageTiles