import React, { useState } from 'react';
import { Button, Popover } from 'antd';
import { Icon } from '@iconify-icon/react';

const FilterData = ({ content, open, handleOpenChange }) => {

     const customTitle = (
          <div className="custom-ant-modal-header-filter">
               Filter
          </div>
     );

     return (
          <Popover
               content={content}
               title={customTitle}
               trigger="click"
               open={open}
               onOpenChange={handleOpenChange}
               placement="bottomRight"
               overlayClassName="custom-ant-popover"
          >
               {/* <Button className='action-button edit-button'><Icon icon="streamline:filter-2-solid" /></Button> */}
               <button type='button' className="pi-btn-icon">
                    Filter
                    {/* <Icon icon="mage:filter-square-fill" className="btn-icon" /> */}
                    <span className='action-button filter-button'>
                         <Icon icon="clarity:filter-solid" />
                    </span>
               </button>
          </Popover>
     );
};

export default FilterData;