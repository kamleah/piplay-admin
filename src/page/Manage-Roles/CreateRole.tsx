import { Breadcrumb, Card, Checkbox, Col, Row } from 'antd';
import React, { Children, Fragment, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import ToastMessage from '../facilator/ToastMessage/ToastMessage';
import { createRole, editRole, getAllRegisteredUsersAPI, getAllRolesByUserId } from '../../components/apiFile/Service';
import { toast } from 'react-toastify';
import ExpandableTable from '../../components/Table/ExpandableTable';
import { useDispatch, useSelector } from 'react-redux';
import { json, useLocation, useNavigate } from 'react-router-dom';
import Table from '../../components/Table/DataTable';
import sidebarMenuData from '../../layout/SideBar/SideberMenuData';
import { setAllRoles } from '../../redux/Slices/DataSlice';


const CreateRole = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {
     const location = useLocation();
     const editRoleData = location.state;
     const navigate = useNavigate();
     const loggedInUser = localStorage.getItem("auth");
     const { register, handleSubmit, reset, control, setValue, watch } = useForm();
     const [edit, setEdit] = useState(false)
     const userData = useSelector((state: any) => state?.user?.loggedUserDetails);
     const dispatch = useDispatch()
     const roleSideBar = useSelector((state: any) => state?.alldata?.sideBardata);
     const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails);
     let sidebarData = loggedUserDetails?.roleId ? roleSideBar : sidebarMenuData;
     const [selectedPath, setSelectedPath] = useState('');


     function filterObjectsWithView(obj) {
          if (!obj?.children || obj?.children?.length === 0) {
               return obj?.view !== false ? { ...obj } : null;
          }

          const filteredChildren = obj?.children?.map(child => filterObjectsWithView(child)).filter(Boolean);

          return obj.view !== false || (filteredChildren && filteredChildren.length > 0)
               ? { ...obj, children: filteredChildren }
               : null;
     }

     let filterSidebarData = sidebarData.map(item => filterObjectsWithView(item)).filter(Boolean);

     const handleChange = (event) => {
          const selectedPath = event.target.value;
          if (selectedPath == 'all') {
               setSelectedPath('');
          } else {
               setSelectedPath(selectedPath);
          }
     };

     sidebarData = sidebarData.map(item => filterObjectsWithView(item)).filter(Boolean);

     const getAllRolesByUser = async () => {
          let response = await getAllRolesByUserId(loggedInUser, userData?._id);
          if (response.statusCode == 0) {
               dispatch(setAllRoles(response?.result))
          }
     }

     const handleCheckboxChange = (index, event, row, parentIndex) => {
          if (row.parent) {
               if (event.target.checked) {
                    setValue(`${row.parent}View${index}`, true);
                    setValue(`View${parentIndex}`, true);
               }
          } else {
               if (event.target.checked) {
                    setValue(`View${index}`, true);
               }
          }
     };
     const handleCheckboxChangeView = (index, event, row, parentIndex) => {
          if (row.parent) {
               if (event.target.checked) {
                    setValue(`${row.parent}View${index}`, true);
                    setValue(`View${parentIndex}`, true);
               } else {
                    setValue(`${row.parent}Add${index}`, false);
                    setValue(`${row.parent}Edit${index}`, false);
                    setValue(`${row.parent}Delete${index}`, false);
                    setValue(`${row.parent}Export${index}`, false);
               }


          } else {
               if (event.target.checked) {
                    setValue(`View${index}`, true);
               } else {
                    setValue(`Add${index}`, false);
                    setValue(`Edit${index}`, false);
                    setValue(`Delete${index}`, false);
                    setValue(`Export${index}`, false);
                    if (row.children) {
                         row.children.forEach((element: any, index) => {
                              setValue(`${element.parent}View${index}`, false);
                              setValue(`${element.parent}Add${index}`, false);
                              setValue(`${element.parent}Edit${index}`, false);
                              setValue(`${element.parent}Delete${index}`, false);
                              setValue(`${element.parent}Export${index}`, false);
                         });
                    }
               }
          }
     };
     const columns = [
          {
               name: 'Modules',
               selector: row => row.label,
               sortable: true,
               wrap: true,
               cell: (row, index) =>
                    <div
                         className='d-flex align-items-center'
                         style={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden ',
                              textOverflow: 'ellipsis',
                              wordBreak: 'normal',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#000',
                         }} >
                         {row.label}
                    </div>,
          },

          {
               name: "View",
               selector: row => row,
               wrap: true,
               width: '100px',
               cell: (row, index) => (
                    <Controller
                         control={control}
                         name={`View${index}`}
                         render={({ field: { onChange, value } }) => (
                              <Checkbox className='checkbox-primary' id={`View${index}`} disabled={!row.view} checked={value} onChange={(e) => { onChange(e.target.checked); handleCheckboxChangeView(index, e, row, index) }} />
                         )}
                    />
               ),
          },
          {
               name: "Add",
               selector: row => '1',
               wrap: true,
               width: '100px',
               cell: (row, index) => (
                    <>
                         {row?.children?.length == 0 &&
                              <Controller
                                   control={control}
                                   name={`Add${index}`}
                                   render={({ field: { onChange, value } }) => (
                                        <Checkbox className='checkbox-primary' id={`Add${index}`} disabled={!row.add} checked={value} onChange={(e) => { onChange(e.target.checked); handleCheckboxChange(index, e, row, index) }} />
                                   )}
                              />}
                    </>
               )

          },
          {
               name: "Edit",
               selector: row => '1',
               wrap: true,
               width: '100px',
               cell: (row, index) => (
                    <>
                         {row?.children?.length == 0 &&
                              <Controller
                                   control={control}
                                   name={`Edit${index}`}
                                   render={({ field: { onChange, value } }) => (
                                        <Checkbox className='checkbox-primary' id={`Edit${index}`} disabled={!row.edit} checked={value} onChange={(e) => { onChange(e.target.checked); handleCheckboxChange(index, e, row, index) }} />
                                   )}
                              />}
                    </>
               )

          },
          {
               name: "Delete",
               selector: row => '1',
               wrap: true,
               width: '100px',
               cell: (row, index) => (
                    <>
                         {row?.children?.length == 0 &&
                              <Controller
                                   control={control}
                                   name={`Delete${index}`}
                                   render={({ field: { onChange, value } }) => (
                                        <Checkbox className='checkbox-primary' id={`Delete${index}`} disabled={!row.delete} checked={value} onChange={(e) => { onChange(e.target.checked); handleCheckboxChange(index, e, row, index) }} />
                                   )}
                              />}
                    </>
               )

          },
          {
               name: "Export",
               selector: row => '1',
               wrap: true,
               width: '100px',
               cell: (row, index) => (
                    <>
                         {row?.children?.length == 0 &&
                              <Controller
                                   control={control}
                                   name={`Export${index}`}
                                   render={({ field: { onChange, value } }) => (
                                        <Checkbox className='checkbox-primary' id={`Export${index}`} disabled={!row.export} checked={value} onChange={(e) => { onChange(e.target.checked); handleCheckboxChange(index, e, row, index) }} />
                                   )}
                              />}
                    </>
               ),
          },

     ];

     const renderSubRow = (row) => {
          const parentIndex = sidebarData.findIndex(item => item?.path === row?.data?.path);

          const subcolumns = [
               {
                    name: 'Modules',
                    selector: row => row.label,
                    sortable: true,
                    wrap: true,
                    cell: (row, index) =>
                         <div
                              className='d-flex align-items-center'
                              style={{
                                   whiteSpace: 'nowrap',
                                   overflow: 'hidden ',
                                   textOverflow: 'ellipsis',
                                   wordBreak: 'normal',
                                   fontSize: '14px',
                                   fontWeight: 600,
                                   color: '#727272',
                                   paddingLeft: '80px',
                              }} >
                              {row.label}
                         </div>,
               },

               {
                    name: "View",
                    selector: row => row,
                    wrap: true,
                    width: '100px',
                    cell: (row, index) => (
                         <Controller
                              control={control}
                              name={`${row.parent}View${index}`}
                              render={({ field: { onChange, value } }) => (
                                   <Checkbox className='checkbox-primary' id={`${row.parent}View${index}`} disabled={!row.view} checked={value} onChange={(e) => { onChange(e.target.checked); handleCheckboxChangeView(index, e, row, parentIndex) }
                                   } />
                              )}
                         />
                    ),
               },
               {
                    name: "Add",
                    selector: row => '1',
                    wrap: true,
                    width: '100px',
                    cell: (row, index) => (
                         <Controller
                              control={control}
                              name={`${row.parent}Add${index}`}
                              render={({ field: { onChange, value } }) => (
                                   <Checkbox className='checkbox-primary' id={`${row.parent}Add${index}`} disabled={!row.add} checked={value} onChange={(e) => { onChange(e.target.checked); handleCheckboxChange(index, e, row, parentIndex) }} />
                              )}
                         />
                    )

               },
               {
                    name: "Edit",
                    selector: row => '1',
                    wrap: true,
                    width: '100px',
                    cell: (row, index) => (
                         <Controller
                              control={control}
                              name={`${row.parent}Edit${index}`}
                              render={({ field: { onChange, value } }) => (
                                   <Checkbox className='checkbox-primary' id={`${row.parent}Edit${index}`} disabled={!row.edit} checked={value} onChange={(e) => { onChange(e.target.checked); handleCheckboxChange(index, e, row, parentIndex) }} />
                              )}
                         />)

               },
               {
                    name: "Delete",
                    selector: row => '1',
                    wrap: true,
                    width: '100px',
                    cell: (row, index) => (
                         <Controller
                              control={control}
                              name={`${row.parent}Delete${index}`}
                              render={({ field: { onChange, value } }) => (
                                   <Checkbox className='checkbox-primary' id={`${row.parent}Delete${index}`} disabled={!row.delete} checked={value} onChange={(e) => { onChange(e.target.checked); handleCheckboxChange(index, e, row, parentIndex) }} />
                              )}
                         />
                    )

               },
               {
                    name: "Export",
                    selector: row => '1',
                    wrap: true,
                    width: '100px',
                    cell: (row, index) => (
                         <Controller
                              control={control}
                              name={`${row.parent}Export${index}`}
                              render={({ field: { onChange, value } }) => (
                                   <Checkbox className='checkbox-primary' id={`${row.parent}Export${index}`} disabled={!row.export} checked={value} onChange={(e) => { onChange(e.target.checked); handleCheckboxChange(index, e, row, parentIndex) }} />
                              )}
                         />
                    ),
               },
          ];

          return (
               <div>
                    <Table data={row.data.children} columns={subcolumns} pagination={false} header={true} filterValue={(selectedPath == '' || row?.data?.path === selectedPath)} lastcolumnWidth='100px' />
               </div>
          );
     };

     useEffect(() => {
          if (editRoleData) {
               setEditRole(editRoleData)
          }
     }, [editRoleData])

     const setEditRole = (editRoleData) => {
          setEdit(true)
          const resetObject = {};
          resetObject['rolename'] = editRoleData?.rolename;
          editRoleData?.data?.map((mainMenu, mainIndex) => {
               // Reset main menu items
               resetObject[`View${mainIndex}`] = mainMenu?.view;
               resetObject[`Add${mainIndex}`] = mainMenu?.add;
               resetObject[`Edit${mainIndex}`] = mainMenu?.edit;
               resetObject[`Delete${mainIndex}`] = mainMenu?.delete;
               resetObject[`Export${mainIndex}`] = mainMenu?.export;
               if (mainMenu?.children.length > 0) {
                    mainMenu?.children.map((submenu, subIndex) => {
                         resetObject[`${submenu.parent}View${subIndex}`] = submenu?.view;
                         resetObject[`${submenu.parent}Add${subIndex}`] = submenu?.add;
                         resetObject[`${submenu.parent}Edit${subIndex}`] = submenu?.edit;
                         resetObject[`${submenu.parent}Delete${subIndex}`] = submenu?.delete;
                         resetObject[`${submenu.parent}Export${subIndex}`] = submenu?.export;
                    });
               }
          });
          reset(resetObject);
     }

     const onSubmit = async (formData: any) => {
          console.log('====================================');
          console.log(formData);
          console.log('====================================');
          let roleSidebarData;
          if (formData) {
               roleSidebarData = sidebarData.map((mainMenu, index) => {
                    const updatedMainMenu = {
                         ...mainMenu,
                         view: formData[`View${index}`] || false,
                         add: formData[`Add${index}`] || false,
                         edit: formData[`Edit${index}`] || false,
                         delete: formData[`Delete${index}`] || false,
                         export: formData[`Export${index}`] || false,
                         role_name: formData?.rolename,
                         user_id: userData?._id,
                    };

                    if (updatedMainMenu.children.length > 0) {
                         updatedMainMenu.children = updatedMainMenu.children.map((submenu, subIndex) => ({
                              ...submenu,
                              view: formData[`${submenu.parent}View${subIndex}`] || false,
                              add: formData[`${submenu.parent}Add${subIndex}`] || false,
                              edit: formData[`${submenu.parent}Edit${subIndex}`] || false,
                              delete: formData[`${submenu.parent}Delete${subIndex}`] || false,
                              export: formData[`${submenu.parent}Export${subIndex}`] || false,
                         }));
                    }
                    return updatedMainMenu;
               });
          } else {
               toast(<ToastMessage body={"Something went wrong"} type="error" />, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
          }
          if (edit) {
               let response = await editRole(loggedInUser, editRoleData?.role_id, roleSidebarData);
               if (response.statusCode == 0) {
                    getAllRolesByUser();
                    toast(<ToastMessage body={"Role Upadated Successfully"} type="success" />, {
                         position: "top-right",
                         autoClose: 5000,
                         hideProgressBar: true,
                         closeOnClick: true,
                         pauseOnHover: true,
                         draggable: true,
                    });
                    reset();
                    navigate("/ManageRoles");

               } else {
                    toast(<ToastMessage body={"Failed To Create Role"} type="error" />, {
                         position: "top-right",
                         autoClose: 5000,
                         hideProgressBar: true,
                         closeOnClick: true,
                         pauseOnHover: true,
                         draggable: true,
                    });
               }
          } else {

               let response = await createRole(loggedInUser, roleSidebarData);
               if (response.statusCode == 0) {
                    getAllRolesByUser()
                    toast(<ToastMessage body={"Role Created Successfully"} type="success" />, {
                         position: "top-right",
                         autoClose: 5000,
                         hideProgressBar: true,
                         closeOnClick: true,
                         pauseOnHover: true,
                         draggable: true,
                    });
                    reset();
                    navigate("/ManageRoles");
               } else {
                    toast(<ToastMessage body={"Failed To Create Role"} type="error" />, {
                         position: "top-right",
                         autoClose: 5000,
                         hideProgressBar: true,
                         closeOnClick: true,
                         pauseOnHover: true,
                         draggable: true,
                    });
               }
          }

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
                                        title: "Create Roles",
                                   },
                              ]}
                         />}
                         <form onSubmit={handleSubmit(onSubmit)}>
                              <div className="main-title-container">
                                   <div className="title-add-mobile">
                                        <h5 className="main-content-title">{edit == true ? "Edit Role" : "Create Roles"}</h5>
                                        {matches &&
                                             <div className='add-export-btn'>
                                                  <button type="button" className="pi-btn-secondary" onClick={() => navigate("/ManageRoles")}>Cancel</button>
                                                  <button type="submit" className="pi-btn-primary">{edit == true ? "Save Changes" : "Add Role"}</button>
                                             </div>
                                        }
                                   </div>
                                   {!matches &&
                                        <div className='add-export-btn'>
                                             <button type="button" className="pi-btn-secondary" onClick={() => navigate("/ManageRoles")}>Cancel</button>
                                             <button type="submit" className="pi-btn-primary">{edit == true ? "Save Changes" : "Add Role"}</button>
                                        </div>}
                              </div>
                              <Row gutter={[16, 20]}>
                                   <Col span={24}>
                                        <div className="main-content-card">

                                             <Row gutter={[16, 20]}>
                                                  <Col span={12}>
                                                       <div className="input-group">
                                                            <label htmlFor="rolename" className="form-lable">Role name <span className="required-star">*</span> </label>
                                                            <Controller
                                                                 control={control}
                                                                 name="rolename"
                                                                 rules={{ required: 'Role name is required' }}
                                                                 render={({ field: { onChange, value }, fieldState }) => (
                                                                      <>
                                                                           <div className="form-group">

                                                                                <input
                                                                                     className="form-field"
                                                                                     type="text"
                                                                                     id="rolename"
                                                                                     value={value}
                                                                                     placeholder="Enter Role Name"
                                                                                     onChange={onChange}
                                                                                />
                                                                           </div>
                                                                           {fieldState.error && <span className="error-message">{fieldState.error.message}</span>}
                                                                      </>
                                                                 )}
                                                            />

                                                       </div>
                                                  </Col>
                                                  <Col span={12}>
                                                       <div className="input-group">
                                                            <label htmlFor="module" className="form-lable">Filter Module</label>
                                                            <div className="form-group">
                                                                 <select id="module" className="form-field"  {...register('module')} onChange={handleChange}>
                                                                      <option value={'all'} selected disabled={selectedPath == ''}>Show all modules</option>
                                                                      {filterSidebarData.map((sidebarMenu) =>
                                                                           <option key={sidebarMenu.label} value={sidebarMenu.path}>{sidebarMenu.label}</option>
                                                                      )}
                                                                 </select>
                                                            </div>
                                                       </div>

                                                  </Col>
                                             </Row>


                                        </div>
                                   </Col>

                                   <Col span={24}>
                                        <div className="main-content-card">
                                             <ExpandableTable columns={columns} data={sidebarData} renderSubRow={renderSubRow} lastHeadingEnd={'flex-start'} filterValue={selectedPath} />
                                        </div>
                                   </Col>
                              </Row>
                         </form>
                    </Card>
               </div>
          </Fragment>
     )
}

export default CreateRole