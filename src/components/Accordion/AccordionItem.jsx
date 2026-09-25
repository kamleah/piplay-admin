import React, { useState } from "react";
import { Icon } from '@iconify-icon/react';
import './AccordionItem.css'

const AccordionItem = ({ title, content, activeClass='active' }) => {
     const [isOpen, setIsOpen] = useState(false);

     const toggleAccordion = () => {
          setIsOpen(!isOpen);
     };

     return (
          <>
               <div className={`accordion-item ${isOpen ? activeClass : ""}`}>
                    <div className="accordion-title" onClick={toggleAccordion}>
                        {title}
                    </div>
                    <div className={`accordion-content ${isOpen ? activeClass : ""}`}>
                         {content}
                    </div>
               </div>

          </>
     );
};

export default AccordionItem;