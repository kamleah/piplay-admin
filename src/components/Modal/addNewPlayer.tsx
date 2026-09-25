import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, Input } from "antd";
import { Footer } from "antd/es/layout/layout";
import { useForm } from "react-hook-form";
import {
  addBookingPlayer,
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
  partner_id: [];
  // Add other properties as needed
}

const AddPlayerModal = ({ modaldata, visible, row, onCancel, setPlayers, closeModal, players }) => {

  const form = useForm({
    defaultValues: {
      partner_id: [],
      mobileno: "",
      name: "",
      user_id: row?.user_id || "",
      booking_id: row?.booking_id || "",
    },
  });
  const { register, handleSubmit, reset, formState, watch, setValue, control } =
    form;
  const loggedInUser = localStorage.getItem("auth");
  const [data, setData] = useState<Booking[]>([]);
  const animatedComponents = makeAnimated();
  const [dynamicFields, setDynamicFields] = useState([
    { id: 1, name: "", mobileno: "" },
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

  const handleDelete = (idToDelete) => {
    const updatedFieldSets = dynamicFields.filter(
      (field) => field.id !== idToDelete
    );
    setDynamicFields(updatedFieldSets);
  };
  const { errors } = formState;

  const handleOk = () => {
    //form.submit();
  };
  const customTitle = (
    <div className="custom-ant-modal-header">{"Add Players"}</div>
  );

  const onSubmit = async (data: any) => {
    let payload = {
      booking_id: modaldata?._id,
      players: [] as any[]
    };

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
        // console.log("🚀 ~ data.partner_id.forEach ~ item:", item)
        payload.players.push({
          user_id: item?.user_id,
          name: item?.label,
          mobileno: Number(item?.mobileno),
          country: "in",
        });
      });
    }
    setPlayers(payload);
    reset();
    setDynamicFields([]);
    closeModal();
  };

  const getUsers = async () => {
    let response = await getAllUsers(loggedInUser);
    let venues = response?.data?.map((data) => {
      return {
        label: `${data.firstname} ${data.lastname}`,
        mobileno: data?.mobileno,
        value: data?._id,
        user_id: data?._id
      };
    });
    setUserList(venues);
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

  useMemo(() => {
    let userWithId: any = players.players.filter((item: any) => {
      return item?.user_id != null;
    });
    // console.log("🚀 ~ letuserWithId:any=players.players.filter ~ players.players:", players.players)
    userWithId = userWithId.map((data) => {
      return { label: data?.name, value: data?.user_id?._id, mobileno: data?.mobileno, user_id: data.user_id };
    });
    let userWithOutId: any = players.players.filter((item: any) => {
      return item?.user_id == null;
    });
    let arr: any = []
    userWithOutId?.map((item: any, i: any) => {
      arr.push({ "id": i, "name": item.name, "mobileno": item?.mobileno })
    })
    setDynamicFields(arr)
    reset({ partner_id: userWithId });
  }, [visible])

  useEffect(() => {
    if (visible) {
      getUsers();
    }
  }, [visible]);
  return (
    <Modal
      visible={visible}
      title={customTitle}
      width={"30%"}
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
                            type="number"
                            placeholder="Enter Phone Number"
                            value={field.mobileno}
                            onChange={(e) => {
                              if (e.target.value.length <= 10) {
                                handleFieldChange(
                                  field.id,
                                  "mobileno",
                                  e.target.value
                                )
                              }
                            }
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
                        {index !== 0 && (
                          <button
                            type="button"
                            className="icon-d"
                            onClick={() => handleDelete(field.id)}
                          >
                            <Icon icon="clarity:trash-solid" />
                          </button>
                        )}
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
                            closeMenuOnSelect={false}
                            className="controller-select"
                            components={animatedComponents}
                            // defaultValue={[colourOptions[4], colourOptions[5]]}
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
export default AddPlayerModal;
