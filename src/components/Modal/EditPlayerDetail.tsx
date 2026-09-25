import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, Input } from "antd";
import { Footer } from "antd/es/layout/layout";
import { useForm } from "react-hook-form";
import {
  addBookingPlayer,
  deleteBookPlayer,
  editRegisteredAPI,
  getAllUsers,
  getEventUsersAPI,
} from "../apiFile/Service";
import { toast } from "react-toastify";
import ToastMessage from "../../page/facilator/ToastMessage/ToastMessage";
import Select from "react-select";
import {
  CopyOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import makeAnimated from "react-select/animated";
import { Controller } from "react-hook-form";
import { Icon } from "@iconify-icon/react";
import { getAddPlayersBookingsAPI } from "../apiFile/Service";

const EditPlayerDetail = ({ modaldata, visible, row, onCancel, closeBookingDetailsModel }) => {
  interface User {
    firstname: string;
    lastname: string;
    _id: string;
  }
  interface Booking {
    _id: string;
    booking_id: string;
    user_id: string | null;
    name: string;
    mobileno: string;
    // Add other properties as needed
  }
  const form = useForm({
    defaultValues: {
      partner_id: "",
      mobileno: "",
      name: "",
      user_id: row?.user_id || "",
      booking_id: row?.booking_id || "",
    },
  });
  const { register, handleSubmit, reset, formState, watch, setValue, control } =
    form;

  let selUsers = watch('partner_id');
  const [usersdata, setUsersData] = useState<User[]>([]);
  const [bookingId, setBookingId] = useState<User[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const loggedInUser = localStorage.getItem("auth");
  const [users, setData] = useState<Booking[]>([]);
  const animatedComponents = makeAnimated();
  const [dynamicFields, setDynamicFields] = useState([
    { id: 0, name: "", mobileno: "" },
  ]);
  const [showAddMore, setShowAddMore] = useState(true);
  const [userList, setUserList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("piPlayers"); // State to track active tab
  const [dataIndex, setDataIndex] = useState(1);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFieldChange = (id, fieldName, value) => {
    const updatedFields = dynamicFields.map((field) =>
      field.id === id ? { ...field, [fieldName]: value } : field
    );
    setDynamicFields(updatedFields);
  };

  const handleDelete = async (idToDelete) => {
    if (idToDelete.data_id) {
      let res = await deleteBookPlayer(loggedInUser, idToDelete.data_id)
      if (res.code == "SUCCESS") {
        toast(
          <ToastMessage body={"Player Removed Successfully"} type="warning" />,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
      const updatedFieldSets = dynamicFields.filter(
        (field) => field.id !== idToDelete
      );
      setDynamicFields(updatedFieldSets);
      await getBookigsPlayerAPI()
    }
  };
  const { errors } = formState;

  const handleOk = () => {
    //form.submit();
  };
  const customTitle = (
    <div className="custom-ant-modal-header">{"Edit Player "}</div>
  );

  const onSubmit = async (data: any) => {
    let payload = {
      booking_id: modaldata?._id,
      players: [] as any[]
    };
    let response;
    if (dynamicFields.length > 0) {
      dynamicFields.forEach((item: any) => {
        payload.players.push(
          {
            name: item.name,
            mobileno: Number(item?.mobileno),
            country: "in",
          }
        );
      });
    }

    if (data.partner_id.length > 0) {
      data.partner_id.forEach((item: any) => {
        payload.players.push({
          user_id: item?.value,
          name: item?.label,
          mobileno: Number(item?.mobileno),
          country: "in",
        });
      });
    }
    payload.players = payload.players.filter(a2Item =>
      !users.some(a1Item =>
        a1Item?.mobileno === a2Item?.mobileno
      )
    );
    response = await addBookingPlayer(loggedInUser, payload);
    if (response.code == "SUCCESS") {
      closeBookingDetailsModel();
      getUsers();
      toast(
        <ToastMessage body={"Player Added Successfully"} type="success" />,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      reset();
      onCancel();
    } else {
      toast(<ToastMessage body={response.message} type="warning" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const getUsers = async () => {
    let response = await getAllUsers(loggedInUser);
    let venues = response?.data?.map((data) => {
      return {
        label: `${data.firstname} ${data.lastname}`,
        mobileno: data?.mobileno,
        value: data?._id,
      };
    });
    setUserList(venues);
  };

  const getBookigsPlayerAPI = async () => {
    let { data } = await getAddPlayersBookingsAPI(
      loggedInUser,
      modaldata?._id
    );
    setData(data);
    let userWithId: any = await data.filter((item: any) => {
      return item?.user_id != null;
    });
    userWithId = userWithId.map((data) => {
      return { label: data?.name, value: data?.user_id?._id, mobileno: data?.mobileno, data_id: data?._id };
    });
    let userWithOutId: any = await data.filter((item: any) => {
      return item?.user_id == null;
    });
    let arr: any = []
    userWithOutId?.map((item: any, i: any) => {
      arr.push({ "id": i, "name": item.name, "mobileno": item?.mobileno, "data_id": item._id })
    })
    setDynamicFields(arr)
    reset({ partner_id: userWithId });
  };

  const handleAddMore = () => {
    if (dataIndex >= dynamicFields.length) {
      const newField = {
        id: dynamicFields?.length == 0 ? 0 : dynamicFields[dynamicFields?.length - 1].id + 1,
        name: "",
        mobileno: "",
      };
      setDataIndex(dataIndex + 1);
      setDynamicFields([...dynamicFields, newField]);
    }
  };

  const handleOptionCanceled = async (removedValue) => {
    let selUser: any = selUsers
    if (removedValue.data_id) {
      let res = await deleteBookPlayer(loggedInUser, removedValue.data_id)
      if (res.code == "SUCCESS") {
        toast(
          <ToastMessage body={"Player Removed Successfully"} type="warning" />,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
      await getBookigsPlayerAPI()
    }
    const updatedOptions = selUser?.filter(
      (option) => option.value !== removedValue.value
    );
    setValue('partner_id', updatedOptions)
    // Perform actions based on the canceled option's value,
    // such as updating state, sending data to the server, etc.
  };

  useEffect(() => {
    if (visible) {
      getUsers();
      getBookigsPlayerAPI();
    }
  }, [visible]);
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
    <Modal
      visible={visible}
      title={customTitle}
      width={"500px"}
      footer={null}
      className="custom-ant-modal lable-content-width"
      onCancel={onCancel}
    >
      <div className="">
        <div className="tab">
          <div className="tab-btn">
            {/* Tab buttons */}
            <button
              type="button"
              className={`tab-bttn ${activeTab === "piPlayers" ? "active" : ""
                }`}
              onClick={() => {
                handleTabChange("piPlayers");
              }}
            >
              Pi-Players
            </button>
            <button
              type="button"
              className={`tab-bttn ${activeTab === "addManually" ? "active" : ""
                }`}
              onClick={() => {
                handleTabChange("addManually");
              }}
            >
              Add Manually
            </button>
          </div>
        </div>

        {activeTab === "addManually" ? (
          <>
            <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
              {dynamicFields.map((field, index) => {
                return (
                  <div className="border-bottom-light" key={field.id}>
                    <div className="form-column">
                      <div className="input-group">
                        <label htmlFor={`firstname-${field.id}`}>
                          Player Name<span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="form-group">
                          <input
                            type="text"
                            placeholder="Enter Player Name"
                            value={field.name}
                            // {...register("name")}
                            onChange={(e) =>
                              handleFieldChange(
                                field.id,
                                "name",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        {errors?.name && (
                          <span className="error-message">
                            {errors.name.message}
                          </span>
                        )}
                      </div>
                      <div className="input-group">
                        <label htmlFor={`phone-${field.id}`}>
                          Phone No.<span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="form-group">
                          <input
                            type="text"
                            placeholder="Enter Phone Number"
                            value={field?.mobileno}
                            // {...register("mobileno")}
                            onChange={(e) =>
                              handleFieldChange(
                                field.id,
                                "mobileno",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        {errors?.mobileno && (
                          <span className="error-message">
                            {errors.mobileno.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="det-icon">
                      <div className="add-more">
                        {index === dynamicFields.length - 1 && showAddMore && (
                          <>
                            <button
                              type="button"
                              className="ad-btn"
                              onClick={handleAddMore}
                            >
                              <Icon icon="mdi:add" className="add-icon" />
                              Add More
                            </button>
                          </>
                        )}
                      </div>
                      <div className="delete">
                        <button
                          type="button"
                          className="icon-d"
                          onClick={() => handleDelete(field)}
                        >
                          <Icon icon="clarity:trash-solid" />
                        </button>

                      </div>
                    </div>
                  </div>
                );
              })}
              {
                dynamicFields?.length == 0 &&
                <>
                  <button
                    type="button"
                    className="ad-btn"
                    onClick={handleAddMore}
                  >
                    <Icon icon="mdi:add" className="add-icon" />
                    Add More
                  </button>
                </>
              }

              <Footer className="ant-modal-footer">
                <button
                  type="button"
                  className="pi-btn-secondary"
                  onClick={() => {
                    onCancel();
                    reset();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="pi-btn-primary">
                  {"Save"}
                </button>
              </Footer>
            </form>
          </>
        ) : (
          <>
            <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
              <div className="border-bottom-light">
                <div className="form-column">
                  <div className="input-group">
                    <label htmlFor="location">
                      Players List <span className="required-star ">*</span>
                    </label>
                    <div className="form-group">
                      <Controller
                        name="partner_id"
                        control={control}
                        rules={{
                          required: {
                            value: true,
                            message: "Pi-player is required",
                          },
                        }}
                        render={({ field }) => (
                          <Select
                            styles={customStyles}
                            closeMenuOnSelect={false}
                            className="controller-select custom-select-remove"
                            components={{
                              MultiValueRemove: ({ data }) => {
                                return (
                                  <div role="button" className="css-1ia4dqs-MultiValueRemove" onClick={(e) => {handleOptionCanceled(data); e.stopPropagation(); e.preventDefault();}}>
                                    <svg height="14" width="14" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="css-tj5bde-Svg"><path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path></svg>
                                  </div>
                                );
                              },
                            }}
                            isMulti
                            options={userList}
                            {...field}
                          />
                        )}
                      />
                    </div>
                    {errors?.partner_id && (
                      <span className="error-message">
                        {errors.partner_id.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Footer className="ant-modal-footer">
                <button
                  type="button"
                  className="pi-btn-secondary"
                  onClick={() => {
                    onCancel();
                    reset();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="pi-btn-primary">
                  {"Save"}
                </button>
              </Footer>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
};
export default EditPlayerDetail;
