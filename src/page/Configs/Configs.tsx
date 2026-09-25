import { Breadcrumb, Card } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'
import "../Configs/Config.css"
import { Icon } from '@iconify-icon/react'
import { Footer } from 'antd/es/layout/layout'
import { getbackendConfigAPI, getfrontendConfigAPI } from '../../components/apiFile/Service'
import EditConfig from '../../components/Modal/EditBackendConfig'
import EditBackendConfig from '../../components/Modal/EditBackendConfig'
import EditFrontendConfig from '../../components/Modal/EditFrontendConfig'
import { toast } from 'react-toastify'
import ToastMessage from '../facilator/ToastMessage/ToastMessage'
import UpdateJSONModal from '../../components/Modal/UpdateJSONModal'
import UpdateBackendJSONModal from '../../components/Modal/UpdateBackendJSONModal'

export default function Configs({ matches, menuOpen, onToggle, modulePermissionsData }) {

    const [Backdata, setBackdata] = useState({})
    const [Frontdata, setFrontdata] = useState({})
    const [showRegisteredViewModal, setShowRegisteredViewModal] = useState(false);
    const [showRegisteredEditModal, setShowRegisteredEditModal] = useState(false);
    const [updateFrontModal, setupdateFrontModal] = useState({})
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [ShowJSONModal, setShowJSONModal] = useState(false);

    const getAllBackendData = async () => {
        let response = await getbackendConfigAPI('DEVPIPLAYSOCIALAUTH@4');
        setBackdata(response?.data)
    }

    const getAllFrontendData = async () => {
        let response = await getfrontendConfigAPI('DEVPIPLAYSOCIALAUTH@4');
        setFrontdata(response?.data)
    }

    useEffect(() => {
        getAllBackendData();
        getAllFrontendData();
    }, [])

    const handleshowModal = async(type: any) => {
        if (type == 'back') {
            setShowRegisteredEditModal(true);
        } else if(type == "front"){
            setShowRegisteredViewModal(true);
        }else{
            setShowJSONModal(true)
        }
    };

    const handleOpenModal = () => {
        setIsModalVisible(true);
      };


    const handleCancelDelete = () => {
        setShowRegisteredViewModal(false);
        setShowRegisteredEditModal(false);        
        setupdateFrontModal(false)
        setShowJSONModal(false)
        setIsModalVisible(false)
    };

    const copyToClipboard = (copydata) => {
        const rowDetails = JSON.stringify(copydata, null, 2);
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
    }

    const copyToClipboardfront = (copydata) => {
        const rowDetails = JSON.stringify(copydata, null, 2);
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
    }

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
                                title: "Setting",
                            },
                            {
                                title: "Configs",
                            },
                        ]}
                    />}
                    <div className="main-title-container">
                        <div className="title-add-mobile">
                            <h5 className="main-content-title">Configs</h5>
                        </div>
                    </div>
                    <div className="main-config-container">
                        <div>
                            <div className='headind-icon-sec'>
                                <div><h2>Backend Config</h2></div>
                                <div>
                                    <span><Icon height={'32'} width={'32'} icon='solar:copy-bold' style={{ marginRight: '10px' }} onClick={() => copyToClipboard(Backdata)} /></span>
                                    {/* <span><Icon height={'32'} width={'32'} icon='ic:outline-refresh' /></span> */}
                                </div>
                            </div>
                            <textarea
                                className="backend-config-textarea"
                                value={JSON.stringify(Backdata, null, 2)}
                            ></textarea>
                            <div className='config-footer'>
                                {/* <button type="button" className="pi-btn-secondary" onClick={() => handleshowModal('back')}>Edit Field</button> */}
                                <button type="submit" className="pi-btn-primary"  onClick={handleOpenModal}>Update JSON</button>
                            </div>
                        </div>
                        <div>
                            <div className='headind-icon-sec'>
                                <div><h2>Frontend Config</h2></div>
                                <div>
                                    <span><Icon height={'32'} width={'32'} icon='solar:copy-bold' style={{ marginRight: '10px' }} onClick={() => copyToClipboardfront(Frontdata)} /></span>
                                    {/* <span><Icon height={'32'} width={'32'} icon='ic:outline-refresh' /></span> */}
                                </div>
                            </div>
                            <textarea
                                className='frontend-config-textarea'
                                value={JSON.stringify(Frontdata, null, 2)}>
                            </textarea>
                            <div className='config-footer'>
                                {/* <button type="button" className="pi-btn-secondary" onClick={() => handleshowModal('front')}>Edit Field</button> */}
                                <button type="submit" className="pi-btn-primary"  onClick={() => { setShowJSONModal(true) }}>Update JSON</button>
                            </div>
                        </div>
                    </div>
                </Card>
                <EditBackendConfig
                    visible={showRegisteredEditModal}
                    onCancel={handleCancelDelete}
                    name="Edit Backend Config"
                    row={Backdata}
                    getalldata={getAllBackendData}
                />
                <EditFrontendConfig
                    visible={showRegisteredViewModal}
                    onCancel={handleCancelDelete}
                    name="Edit Frontend Config"
                    row={Frontdata}
                    getAllData={getAllFrontendData}
                />
                <UpdateJSONModal
                    visible={ShowJSONModal}
                    onCancel={handleCancelDelete}
                    name="Full JSON Record"
                    row={Frontdata}
                    getAllData={getAllFrontendData}
                />
                <UpdateBackendJSONModal  
                visible={isModalVisible}                  
                    onCancel={handleCancelDelete}
                    name="Full JSON Backend Record"
                    row={Backdata}
                    getalldata={getAllBackendData}
                />
            </div>
        </Fragment>
    )
}
