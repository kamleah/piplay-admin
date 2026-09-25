import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Radio,
  RadioChangeEvent,
} from "antd";
import noDataImage from "../../../assets/icon/no_result.png";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import moment from "moment";
import {
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import NAddBookingModal from "../../../components/Modal/BookingNewM";
import "../Booking/Booking.css";
import { filterCourt, getFacilityApi, getFacilityByIdApi, getNewBookings } from "../../../components/apiFile/Service";
import BookingTable from "./BookingTable";
import { useDispatch, useSelector } from "react-redux";
import CustomDatePicker from "../../../components/Modal/CustomDatePicker";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import { setSelectedFacility } from "../../../redux/Slices/DataSlice";

const NewBooking = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {
  const { register, watch, setValue, reset, control } = useForm();
  let sport_type = watch("sport_type");
  const [editBookingModalVisible, setEditBookingModalVisible] = useState(false);
  const handleEditBooking = () => {
    setEditBookingModalVisible(true);
  };
  const animatedComponents = makeAnimated();

  const [bookingData, setBookingData] = useState<any[]>([]);
  const [dateState, setDateState] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const loggedInUser = localStorage.getItem("auth");
  const [facility, setFacility] = useState<any>();
  const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails);
  const selectedFacility = useSelector((state: any) => state.alldata.selectedFacility);
  console.log("🚀 ~ file: NewBooking.tsx:44 ~ NewBooking ~ selectedFacility:", loggedUserDetails)
  const [allCourtsData, setAllCourtsData] = useState<any[]>([]);
  const [facilityList, setFacilityList] = useState<any[]>([]);
  const [courtList, setCourtList] = useState<any[]>([]);
  const [selectededCourtsList, setSelectededCourtsList] = useState<any[]>([]);
  const [noData, setNoData] = useState(false);
  const dispatch = useDispatch();

  const setDate = (value) => {
    setDateState(moment(value).format("YYYY-MM-DD"));
  }
  const changeFacility = (data) => {
    setFacility(data);
    dispatch(setSelectedFacility(data));
  }

  const getallFacilityUr = async () => {
    let filteredFacilities;
    let response = await getFacilityApi(loggedInUser);
    if (!loggedUserDetails?.roleId) {
      let venues = response?.result?.map(data => {
        return { "label": data?.name, "value": data?._id }
      })
      setFacilityList(venues);
    } else {
      filteredFacilities = response?.result.filter(item => loggedUserDetails?.facilities.includes(item._id));
      setFacilityList(filteredFacilities.map((data) => ({
        label: data?.name,
        value: data?._id
      })));
    }

    if (selectedFacility?.value) {
      setFacility(selectedFacility?.value);
      setValue('facility', selectedFacility);
      // getBookingsByFacilityId(selectedFacility?.value);
      if (facility) {
        getBookings();
      }
      getAllCourtsbyFacility(selectedFacility);

    } else {
      if (!loggedUserDetails?.roleId) {
      setFacility(response?.result[0]?._id);
      setValue('facility', { "label": response?.result[0]?.name, "value": response?.result[0]?._id });
      // getBookingsByFacilityId(response?.result[0]?._id);
      if (facility) {
        getBookings();
      }
      getAllCourtsbyFacility({ "label": response?.result[0]?.name, "value": response?.result[0]?._id });
      }else{
        setFacility(filteredFacilities[0]?._id);
        setValue('facility', { "label": filteredFacilities[0]?.name, "value": filteredFacilities[0]?._id });
        // getBookingsByFacilityId(filteredFacilities[0]?._id);
        if (facility) {
          getBookings();
        }
        getAllCourtsbyFacility({ "label": filteredFacilities[0]?.name, "value": filteredFacilities[0]?._id });
      }
    
    }
  };

  const getAllCourtsbyFacility = async (facility_id) => {
    setValue("court_id", null);
    let response = await filterCourt(loggedInUser, '', facility_id == undefined ? '' : facility_id?.value, '');
    let courts = response?.result?.map(data => {
      return { "label": data?.name, "value": data?._id }
    });

    courts?.unshift({ label: 'All', value: 'all' });
    setValue('court', courts.sort((a, b) => a.label.localeCompare(b.label)));
    setCourtList(courts.sort((a, b) => a.label.localeCompare(b.label)));
    const courtsWithoutAll = courts.filter(court => court.value !== 'all');
    setSelectededCourtsList(courtsWithoutAll.sort((a, b) => a.label.localeCompare(b.label)));
    getBookingsByFacilityId(facility_id?.value);
  };

  const getBookings = async () => {
    let response;
    if (!loggedUserDetails?.roleId) {
      if (facility == undefined) {
        return
      }
      response = await getNewBookings(loggedInUser, dateState, typeof (facility) == 'object' ? facility.value : facility);
    } else {
      if (loggedUserDetails?.facility_id == undefined) {
        return
      }
      response = await getNewBookings(loggedInUser, dateState, loggedUserDetails?.facility_id);
    }
    if (response?.result) {
      setBookingData(response.result);
      setAllCourtsData(response.result);
    }
  }

  useMemo(() => {
    if (dateState != '') {
      getBookings();
    }
  }, [dateState])

  const getBookingsByFacilityId = async (Id) => {
    let response = await getNewBookings(loggedInUser, dateState, Id);
    if (response?.result) {
      setBookingData(response.result);
      setAllCourtsData(response.result);
    }
  }
  const getBookingsParams = async (date) => {
    if (facility == undefined) {
      return
    }
    let response = await getNewBookings(loggedInUser, date, typeof (facility) == 'object' ? facility.value : facility);
    if (response?.result) {
      setBookingData(response.result);
      setAllCourtsData(response.result);
    }
  }

  useEffect(() => {
    getallFacilityUr();
  }, [])

  function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  // const onChangeCourts = (selectedCourtIds) => {
  //   console.log('selectedCourtIds', selectedCourtIds);
  //   setSelectededCourtsList(selectedCourtIds);
  //   const courtsArray = selectedCourtIds?.map(court => court.value);
  //   const filteredData = allCourtsData?.map(timeSlot => {
  //     const filteredSlots = timeSlot.slots.filter(slot => courtsArray.includes(slot.court_id));
  //     return filteredSlots?.length > 0 ? { ...timeSlot, slots: filteredSlots } : null;
  //   }).filter(timeSlot => timeSlot !== null);
  //   setBookingData(filteredData);
  //   }
  // };

  const onChangeCourts = (selectedCourtIds) => {
    const allSelected = selectedCourtIds.some(court => court.value === 'all');

    if (allSelected) {
      const allCourts = courtList.filter(court => court.value !== 'all');

      setSelectededCourtsList(allCourts.sort((a, b) => a.label.localeCompare(b.label)) );
      const courtsArray = allCourts.map(court => court.value);
      const filteredData = allCourtsData?.map(timeSlot => {
        const filteredSlots = timeSlot.slots.filter(slot => courtsArray.includes(slot.court_id));
        return filteredSlots?.length > 0 ? { ...timeSlot, slots: filteredSlots } : null;
      }).filter(timeSlot => timeSlot !== null);
      setBookingData(filteredData);
    } else {
      setSelectededCourtsList(selectedCourtIds.sort((a, b) => a.label.localeCompare(b.label)));
      const courtsArray = selectedCourtIds?.map(court => court.value);
      const filteredData = allCourtsData?.map(timeSlot => {
        const filteredSlots = timeSlot.slots.filter(slot => courtsArray.includes(slot.court_id));
        return filteredSlots?.length > 0 ? { ...timeSlot, slots: filteredSlots } : null;
      }).filter(timeSlot => timeSlot !== null);
      setBookingData(filteredData);
    }
  };

  const getPreviousDate = () => {
    const dt = new Date(dateState);
    dt.setDate(dt.getDate() - 1);
    setDateState(moment(dt).format('YYYY-MM-DD'));
    getBookingsParams(moment(dt).format('YYYY-MM-DD'));

  }
  const getNextDate = () => {
    const dt = new Date(dateState);
    dt.setDate(dt.getDate() + 1);
    setDateState(moment(dt).format('YYYY-MM-DD'));
    getBookingsParams(moment(dt).format('YYYY-MM-DD'));

  }

  const getTodayBooking = () => {
    setDateState(moment(new Date()).format("YYYY-MM-DD"));
    getBookingsParams(moment(new Date()).format('YYYY-MM-DD'));
  }

  const resetFilters = () => {
    setDateState(moment(new Date()).format("YYYY-MM-DD"));
    const defaultFacility = facilityList[0];
    setFacility('');
    setValue('facility', { "label": '', "value": '' });
    // setFacility(defaultFacility?._id);
    // setValue('facility', { "label": defaultFacility?.name, "value": defaultFacility?._id });
    // Exclude the "All" option from the selected courts
    const courtsWithoutAll = courtList.filter(court => court.value !== 'all');
    setSelectededCourtsList([]);
    setValue('court', []);
    setValue("sport_type", '');
    // setNoData(true);
    // setBookingData([]);
  };

  const options = [
    { label: "All", value: "all" },
    { label: "Padel", value: "padel" },
    { label: "Pickleball", value: "pickleball" },
  ];

  const onSportsChange = ({ target: { value } }: RadioChangeEvent) => {
    setValue("sport_type", value);
    const filteredData = allCourtsData?.map(timeSlot => {
      const filteredSlots = timeSlot?.slots?.filter(slot => slot?.court_type?.toLowerCase() === value?.toLowerCase());
      return filteredSlots?.length > 0 ? { ...timeSlot, slots: filteredSlots } : null;
    }).filter(timeSlot => timeSlot !== null);

    if (value == "all") {
      setBookingData(allCourtsData);
    } else {
      setBookingData(filteredData)
    }
  };
  const customStyles2 = {
    menu: (provided) => ({
      ...provided,
      zIndex: 49,
    }),
  }
  const customStyles = {
    valueContainer: (provided) => ({
      ...provided,
      maxHeight: '30px',
      overflowY: 'auto',
      padding: '0',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 49,
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#003F70 !important',
      borderRadius: 16,
      overflow: 'hidden',
      gap: 6,
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white !important',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'white !important',
      borderRadius: 0,
      ':hover': {
        backgroundColor: '#FFBDAD',
        color: '#DE350B !important',
      },
    }),
  };

  return (
    <Fragment>
      <div
        onClick={onToggle}
        className={
          menuOpen
            ? `page-open-header${matches ? "-mobile" : ""}`
            : `page-header${matches ? "-mobile" : ""}`
        }
      >
        <Card>
          {!matches && (
            <Breadcrumb
              items={[
                {
                  title: "Home",
                },
                {
                  title: "Bookings",
                },
              ]}
            />
          )}
          <div className="main-title-container">
            <div className="title-add-mobile">
              <h5 className="main-content-title">Bookings</h5>
              {matches && modulePermissionsData?.add &&
                <Button
                  className="pi-btn-primary"
                  key="confirm"
                  type="primary"
                  onClick={handleEditBooking}
                >
                  Book Now
                </Button>
              }
            </div>
            <div className='title-buttons'>
              {/* {matches &&
                <div></div>} */}
              <div className="type-filter">
                <Radio.Group
                  options={options}
                  onChange={onSportsChange}
                  value={sport_type ? sport_type : "all"}
                />
              </div>
              {!matches && modulePermissionsData?.add &&
                <Button
                  className="pi-btn-primary"
                  key="confirm"
                  type="primary"
                  onClick={handleEditBooking}
                >
                  Book Now
                </Button>
              }
            </div>
          </div>
          {matches &&
            <div className="filter-section">
              <div className="input-group col-span-2-md col-span-2-sm">
                <label htmlFor="facility" className="form-lable">Select Facility</label>
                <div className="form-group">
                  <Controller
                    name="facility"
                    control={control}
                    render={({ field: { onChange, value }, field }) => (
                      <Select
                        styles={customStyles2}
                        className="controller-select"
                        components={animatedComponents}
                        defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                        // isMulti
                        options={facilityList}
                        placeholder="Select a facility"
                        onChange={(value) => {
                          onChange(value);
                          changeFacility(value);
                          getAllCourtsbyFacility(value);
                        }}
                        value={value}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="input-group col-span-2-md col-span-2-sm">
                <label htmlFor="court" className="form-lable">Court</label>
                <div className="form-group">
                  <Controller
                    name="court"
                    control={control}
                    render={({ field: { onChange, value }, field }) => {
                      const allSelected = value && value.some(court => court.value === 'all');
                      const filteredOptions = allSelected
                        ? [{ label: 'All', value: 'all' }]
                        : courtList.map(court => ({
                          ...court,
                          isDisabled: selectededCourtsList.some(selectedCourt => selectedCourt.value === 'all' && court.value !== 'all'),
                        }));

                      return (
                        <Select
                          styles={customStyles}
                          closeMenuOnSelect={false}
                          className="controller-select"
                          components={animatedComponents}
                          defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                          isMulti
                          options={filteredOptions}
                          placeholder="Select a Court"
                          onChange={(value) => {
                            onChange(value);
                            onChangeCourts(value);
                          }}
                          value={value}
                        />
                      );
                    }}
                  />
                </div>
              </div>
              <div className="filter-buttons-row col-span-2">
                <Button className="pi-btn-secondary" key="cancel" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </div>
          }
          <div className="main-content-card">
            {!matches && <div className="filter-form">
              <div className="filter-fields">
                <div className="input-group">
                  <label htmlFor="facility" className="form-lable">Select Facility</label>
                  <div className="form-group">
                    <Controller
                      name="facility"
                      control={control}
                      render={({ field: { onChange, value }, field }) => (
                        <Select
                          styles={customStyles2}
                          className="controller-select"
                          components={animatedComponents}
                          defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                          // isMulti
                          options={facilityList}
                          placeholder="Select a facility"
                          onChange={(value) => {
                            onChange(value);
                            changeFacility(value);
                            getAllCourtsbyFacility(value);
                          }}
                          value={value}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor="court" className="form-lable">Court</label>
                  <div className="form-group">
                    <Controller
                      name="court"
                      control={control}
                      render={({ field: { onChange, value }, field }) => {
                        const allSelected = value && value.some(court => court.value === 'all');
                        const filteredOptions = allSelected
                          ? [{ label: 'All', value: 'all' }]
                          : courtList.map(court => ({
                            ...court,
                            isDisabled: selectededCourtsList.some(selectedCourt => selectedCourt.value === 'all' && court.value !== 'all'),
                          }));

                        return (
                          <Select
                            styles={customStyles}
                            closeMenuOnSelect={false}
                            className="controller-select"
                            components={animatedComponents}
                            defaultValue={field.value ? field.value : undefined} // Conditionally set defaultValue based on field value
                            isMulti
                            options={filteredOptions}
                            placeholder="Select a Court"
                            onChange={(value) => {
                              onChange(value);
                              onChangeCourts(value);
                            }}
                            value={value}
                          />
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="filter-buttons-row">
                <Button className="pi-btn-secondary" key="cancel" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </div>}
            <div className="selected-date-container">
              <div className="button-container">
                <button className="action-button next-prev-button" onClick={getPreviousDate} >
                  <LeftOutlined className="white-icon" />
                </button>
                <CustomDatePicker date={dateState} onDateChange={setDate} matches={matches} onResetDate={getTodayBooking} />
                <button className="action-button next-prev-button" onClick={getNextDate} >
                  <RightOutlined className="white-icon" />
                </button>
              </div>
            </div>
            <div className="booking-table-container">
              {selectededCourtsList?.length > 0 && <div className="hide-first-cell"></div>}
              {noData || bookingData.length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={noDataImage} alt="No Data" style={{ height: '30rem', width: '30rem' }} className="no-data-image" />
                </div>
              ) : (
                <BookingTable
                  matches={matches}
                  column={selectededCourtsList}
                  data={bookingData}
                  facility={facility}
                  courts={courtList}
                  getBookings={getBookings}
                  dateState={dateState}
                />
              )}
            </div>
          </div>
        </Card>
        <NAddBookingModal
          visible={editBookingModalVisible}
          modaldata
          facility={facility}
          courts={courtList}
          getBookings={getBookings}
          onCancel={() => setEditBookingModalVisible(false)}
          slot={null}
          data={bookingData}
        />
      </div>
    </Fragment >
  );
};

export default NewBooking;
