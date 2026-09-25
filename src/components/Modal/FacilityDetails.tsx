import { Modal } from 'antd';
import React, { useEffect } from 'react'
import { Footer } from 'antd/es/layout/layout';
import userimage from '../../assets/icon/user.jpeg'
import piPlayLogo from '../../assets/icon/logo512.png'
import moment from 'moment';
import { getAddOnAPi } from '../apiFile/Service';
const FacilityDetails = ({ visible, name, onConfirm, onCancel, row }) => {
    const loggedInUser = localStorage.getItem("auth");
    const [addOnDetails, setAddOnDetails] = React.useState([]);
    const customTitle = (
        <div className="custom-ant-modal-header">
            {name}
        </div>
    );
    

    const getAddOns = async (auth, id) => {
        try {

            const response = await getAddOnAPi(auth, id);
            setAddOnDetails(response.data);
        } catch (error) {
            console.log("Error", error);
        }

    }

    useEffect(() => {
        getAddOns(loggedInUser, row?._id);
    }, [loggedInUser, row?._id]);


    let daysString = "____"; // Default placeholder value
    let amenitiesString = "____"; // Default placeholder value
    //console.log('Row:', row);

    const flattenedDays = row?.days?.flat();
    if (flattenedDays && Array.isArray(flattenedDays)) {
        const dayLabels = flattenedDays.map(day => day.label);
        daysString = dayLabels.join(' ,');
    }
    const flattenedAmenities = row?.amenities?.flat();

    if (flattenedAmenities && Array.isArray(flattenedAmenities)) {
        const AmenityLabels = flattenedAmenities.map(Amenity => Amenity.label);
        amenitiesString = AmenityLabels.join(' ,');
    }
    // console.log(row?.days, "dayskdd");
    return (
        <Modal title={customTitle}
            visible={visible}
            onOk={onConfirm}
            onCancel={onCancel}
            footer={null}
            width={"50%"}
            className="custom-ant-modal "
        >

            <div className='border-bottom-light'>
                <div className='grid-sec'>
                    <div className='grid-item col-span-2'>
                        <div className='facility-image'>
                            <img className='user-image' src={row?.image ? row?.image : userimage} />
                        </div>
                    </div>
                    {row?.logo && <div className='grid-item span-row-1 col-span-1'>
                        <div className='facility-image'>
                            <img className='user-image' src={row?.logo === "No Logo Added" ? piPlayLogo : row?.logo} />
                        </div>
                    </div>}
                    <div className="grid-item">
                        <h4 className='info-label' >Facility Name</h4>
                        <p className='info-value' >{row?.name}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Email</h4>
                        <p className='info-value text-break' >{row?.email ? row?.email : `${row?.contactInfo?.email}`}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Phone Number</h4>
                        <p className='info-value' >{row?.mobileno != undefined && `${row?.mobileno[0]} `}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Alternate Number</h4>
                        <p className='info-value' >{row?.mobileno != undefined && `${row?.mobileno[1]}`}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Sport Type</h4>
                        <p className='info-value capi' >{row?.sport_type ? row?.sport_type : ''}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Court Type</h4>
                        <p className='info-value capi' >{row?.court_type ? row?.court_type : ''}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >No of Courts</h4>
                        <p className='info-value' >{row?.number_of_courts ? row?.number_of_courts : ''}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >No of Users</h4>
                        <p className='info-value' >{row?.number_of_users ? row?.number_of_users : ''}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' > Latitude</h4>
                        <p className='info-value' >{row?.location?.lat}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Longitude</h4>
                        <p className='info-value' >{row?.location?.lon}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' > Days</h4>
                        <p className='info-value' >{daysString}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Start Time</h4>
                        <p className='info-value' >{row?.start ? row.start : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >End Time</h4>
                        <p className='info-value' >{row?.end ? row.end : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Manager Name</h4>
                        <p className='info-value capi' >{row?.manager_name ? row?.manager_name : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Ratings </h4>
                        <p className='info-value' >{row?.ratings ? row?.ratings : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Location </h4>
                        <p className='info-value text-break' >{row?.city ? `${row?.name},${row?.city}` : `${row?.name}`}</p>
                    </div><div className="grid-item">
                        <h4 className='info-label' >Address </h4>
                        <p className='info-value text-break' >{row?.city ? `${row?.address},${row?.city},${row?.state},${row?.pincode}` : `${row?.address}`}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Amenities </h4>
                        <p className='info-value text-break' >{amenitiesString}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >GST No.</h4>
                        <p className='info-value' >{row?.gst_no ? row?.gst_no : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Cancellation Cut-off Time</h4>
                        <p className='info-value' >{row?.cancellation_cutoff_time}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Cancellation Fee Percentage</h4>
                        <p className='info-value' >{row?.cancellation_fee_percentage}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Slot Size</h4>
                        <p className='info-value' >{row?.slot_size}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Pan No.</h4>
                        <p className='info-value' >{row?.pan_no ? row?.pan_no : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Pre Booking Days</h4>
                        <p className='info-value' >{row?.booking_days ? row?.booking_days : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Cancel Button Disable Cut-off Time</h4>
                        <p className='info-value' >{row?.cancel_cutoff_button_disable_time ? row?.cancel_cutoff_button_disable_time : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Reschedule Button Disable Cut-off Time</h4>
                        <p className='info-value' >{row?.reschedule_cutoff_button_disable_time ? row?.reschedule_cutoff_button_disable_time : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >No Of Reschedules Allowed</h4>
                        <p className='info-value' >{row?.no_of_reschedules ? row?.no_of_reschedules : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Facility Launch Date</h4>
                        <p className='info-value' >{row?.acceptance_date ? moment(row?.acceptance_date).format("DD-MM-YYYY") : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Facility Listing Date</h4>
                        <p className='info-value' >{row?.activation_date ? moment(row?.activation_date).format("DD-MM-YYYY") : "____"}</p>
                    </div>
                    <div className="grid-item">
                        <h4 className='info-label' >Percentage of Cash Advance</h4>
                        <p className='info-value' >{row?.pay_cash ? row?.pay_cash : "____"}</p>
                    </div>
                </div>
                <div className="">
                    <h4 className='info-label' >Description </h4>
                    <p className='info-value text-break' >{row?.description ? <><div dangerouslySetInnerHTML={{ __html: row?.description }} /></> : "____"}</p>
                </div>
            </div>
            <div className="add-ons-container">
                <div className="add-button">
                    <span>Add-Ons Details</span>
                </div>
            </div>
            <div className="col-span-3 equipment-title">Equipments</div>
            {
                addOnDetails?.map((item: { addOnName: string; addOnPrice: number; extraInfo: string }) => (
                    <div className="form-row form-container-grid-3 equipment-container">

                        <div className="input-group">
                            <h4>Equipment Name<span style={{ color: "red" }}>*</span></h4>
                            <p className='info-value text-break '  >{item?.addOnName}</p>
                        </div>
                        <div className="input-group">
                            <h4>Price<span style={{ color: "red" }}>*</span></h4>
                            <p className='info-value text-break' >{item?.addOnPrice}</p>
                        </div>
                        <div className="input-group">
                            <h4>Extra Info<span style={{ color: "red" }}>*</span></h4>
                            <p className='info-value text-break' >{item?.extraInfo}</p>
                        </div>
                    </div>
                ))
            }
                            
            <Footer className='ant-modal-footer'>
                <button
                    type="button"
                    className="pi-btn-secondary"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </Footer>
        </Modal>
    )
}

export default FacilityDetails