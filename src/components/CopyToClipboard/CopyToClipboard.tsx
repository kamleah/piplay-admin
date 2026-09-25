import { Icon } from '@iconify-icon/react';
import React from 'react'
import { toast } from 'react-toastify';
import ToastMessage from '../../page/facilator/ToastMessage/ToastMessage';

const CopyToClipboard = ({ textToCopy }) => {
     const handleCopyToClipboard = () => {
          if (textToCopy) {
               // Create a temporary textarea element
               const textarea = document.createElement('textarea');
               textarea.value = textToCopy;

               // Append the textarea to the DOM
               document.body.appendChild(textarea);

               // Select and copy the text
               textarea.select();
               document.execCommand('copy');

               // Remove the textarea from the DOM
               document.body.removeChild(textarea);

               // alert('Text copied to clipboard!');
               toast(<ToastMessage body={"Copied to clipboard!"} type="success" />, {
                    position: "top-center",
                    autoClose: 500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });

          }
     };

     return (

          <button className='action-button copy-button' onClick={handleCopyToClipboard}>
                        <Icon icon="ant-design:copy-filled" />
                    </button>
     );
}

export default CopyToClipboard