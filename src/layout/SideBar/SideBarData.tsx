import React, { useRef } from "react";
import { FaIndent, FaOutdent } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "../SideBar/SideBar.css";
import logoImage1 from "../../assets/image/Picture2.png";
import { Icon } from '@iconify-icon/react';
import AccordionItem from "../../components/Accordion/AccordionItem";
import { useSelector } from "react-redux";
import sidebarMenuData from "./SideberMenuData";

const SidebarData = ({ matches, menuOpen, onToggle }) => {
  const roleSideBar = useSelector((state: any) => state.alldata.sideBardata)
  const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails)
  const sidebarData = loggedUserDetails?.roleId ? roleSideBar : sidebarMenuData;
  const toggle = () => {
    onToggle();
  };

  const isDevelopment = process.env.REACT_APP_ENV === "dev";

  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.targetTouches[0].clientX;
    touchStartY = e.targetTouches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX = e.targetTouches[0].clientX;
    touchEndY = e.targetTouches[0].clientY;
  };

  const onTouchEnd = () => {
    if (touchStartX === null || touchStartY === null) return;
    const distanceX = touchStartX - touchEndX
    const distanceY = touchStartY - touchEndY
    const isLeftSwipe = distanceX > minSwipeDistance
    const isRightSwipe = distanceX < -minSwipeDistance
    if (isLeftSwipe && distanceX > distanceY) {
      onToggle();
    };
  }

  return (
    <div className="container">
      <div
        className={`${!menuOpen ? "sidebar" : "sidebarOpen"
          } ${matches ? "mobile" : ""} ${isDevelopment ? "development" : ""}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className={`${isDevelopment ? "development top_section" : "top_section"}`}>
          <div className="inner_top_section">
            <img
              src={logoImage1}
              alt="Image"
              style={{
                display: menuOpen ? "block" : "none",
              }}
              className="sidebar-logo"
            />
            <div
              style={{ marginLeft: menuOpen ? "50px" : "3px" }}
              className="bars"
            >
              {!menuOpen && <FaIndent onClick={toggle} />}
              {menuOpen && <FaOutdent onClick={toggle} />}
            </div>
          </div>
        </div>
        <ul className="menu">
          {sidebarData.map((sidebar, index) => (
            <React.Fragment key={index}>
              {
                sidebar.view == true &&
                <li key={sidebar.path} className="Navlist">
                  {sidebar?.children?.length == 0 &&
                    <NavLink to={sidebar?.path || "/default-path"} className="link">
                      <div className="inner-link">
                        <div className="icon">
                          <Icon icon={sidebar.icon} />
                        </div>
                        <div
                          style={{ display: menuOpen ? "block" : "none" }}
                          className="link_text"
                        >
                          {sidebar.label}
                        </div>
                      </div>
                    </NavLink>
                  }

                  {sidebar.children.length != 0 && (
                    < div className="sidebar-accordion" id="sidebar-accordion">
                      {/* Accordion children */}
                      < AccordionItem
                        key={index}
                        title={
                          <div className="link">
                            <div className="inner-link">
                              <div className="icon">
                                <Icon icon={sidebar.icon} />
                              </div>
                              <div style={{ display: menuOpen ? "block" : "none" }} className="link_text" >
                                {sidebar?.label}
                              </div>
                              <div className="chev-icon">
                                <Icon icon="fa6-solid:chevron-down" className="chevron-icon" />
                              </div>
                            </div>
                          </div>
                        }
                        content={sidebar?.children.length != 0 && (
                          <ul className="submenu" >
                            {sidebar?.children?.map((item, i) => (
                              <React.Fragment key={i}>
                                {
                                  item?.view &&
                                  <li key={item.path} className="submenu-item">
                                    {!item.children &&
                                      <NavLink
                                        to={item.path}
                                        className="link"
                                      >
                                        <div className="inner-link">
                                          <div className="icon"> <Icon icon={item.icon} /></div>
                                          <div style={{ display: menuOpen ? "block" : "none" }} className="link_text" >
                                            {item.label}
                                          </div>
                                        </div>
                                      </NavLink>
                                    }
                                    {item?.children && (
                                      < div className="sidebar-accordion" id="sidebar-accordion">
                                        {/* Accordion children */}
                                        < AccordionItem
                                          activeClass="active active-2"
                                          key={index}
                                          title={
                                            <div className="link">
                                              <div className="inner-link">
                                                <div className="icon">
                                                  <Icon icon={item.icon} />
                                                </div>
                                                <div style={{ display: menuOpen ? "block" : "none" }} className="link_text" >
                                                  {item?.label}
                                                </div>
                                                <div className="chev-icon">
                                                  <Icon icon="lucide:chevron-down" className="chevron-icon-2" />
                                                </div>
                                              </div>
                                            </div>
                                          }
                                          content={item?.children?.length != 0 && (
                                            <ul className="submenu" >
                                              {item?.children?.map((subitem, i) => (
                                                <React.Fragment key={i}>
                                                  {
                                                    subitem?.view &&
                                                    <li key={subitem.path} className="submenu-item">
                                                      <NavLink
                                                        to={subitem.path}
                                                        className="link"
                                                      >
                                                          <div className="inner-link inner-link-2">
                                                            <div className="icon"> <Icon icon={subitem.icon} /></div>
                                                            <div style={{ display: menuOpen ? "block" : "none" }} className="link_text" >
                                                              {subitem.label}
                                                            </div>
                                                          </div>
                                                      </NavLink>
                                                    </li>
                                                  }
                                                </React.Fragment>
                                              ))}
                                            </ul>
                                          )
                                          }
                                        />

                                      </div>
                                    )}
                                  </li>
                                }
                              </React.Fragment>
                            ))}
                          </ul>
                        )
                        }
                      />

                    </div>
                  )}
                </li>
              }
            </React.Fragment>


          ))}
        </ul>
      </div>
    </div>
  );
};
export default SidebarData;