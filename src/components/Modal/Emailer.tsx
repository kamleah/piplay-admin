import React, { useState } from 'react';
import { Button, Popover } from 'antd';
import { emailSenderAPI } from '../apiFile/Service';


function Emailer({ emailerOpen, handleOpenChange, onHide }) {

    const mainstyle = {
        width: '300vw',
        height: '300vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'between',
    };
    const inputStyle = {

        width: 'calc(100% - 22px)',
        padding: ' 10px',
        marginTop: ' -5px',
        borderRadius: ' 4px',
        borderBottom: '1px solid black',

    }
    const loggedInUser = localStorage.getItem("auth");
    const handleSendEmail = () => {
        const fromInput = document.getElementById('from') as HTMLInputElement;
        const toInput = document.getElementById('to') as HTMLInputElement;
        const ccInput = document.getElementById('cc') as HTMLInputElement;
        const subjectInput = document.querySelector('input[placeholder="Enter Subject here"]') as HTMLInputElement;
        const messageTextarea = document.getElementById('message') as HTMLTextAreaElement;
        const fileInput = document.getElementById('myfile') as HTMLInputElement;

        let from: string;
        let to: string[] = toInput.value.split(',');
        let cc: string;
        let subject: string;
        let message: string;
        let attachedFile: File | null = null;

        if (fromInput) {
            from = fromInput.value;
        } else {
            from = '';
        }

        if (toInput) {
            to = [toInput.value];
        } else {
            to = [];
        }

        if (ccInput) {
            cc = ccInput.value;
        } else {
            cc = '';
        }

        if (subjectInput) {
            subject = subjectInput.value;
        } else {
            subject = '';
        }

        if (messageTextarea) {
            message = messageTextarea.value;
        } else {
            message = '';
        }

        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            attachedFile = fileInput.files[0]; // Get the file
        }

        emailSenderAPI(loggedInUser, to, subject, message, attachedFile)
            .then((response) => {
                console.log('Email sent successfully!');
                toInput.value = '';
                fileInput.value = '';
            })
            .catch((error) => {
                console.error('Error sending email:', error);
            });
    }
    return (
        <Popover
            style={mainstyle}
            placement="bottomRight"
            content={<div style={{ minWidth: '20rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }} className="filter-form">
                    <div style={{ marginTop: '1rem' }} className="form-group">
                        <label >From</label>
                        <input style={inputStyle} type="text" id="from" name="from"
                            disabled={true}
                            defaultValue='no-reply@pi-play.com'
                        />
                    </div>
                    <div style={{ marginTop: '1rem' }} className="form-group">
                        <label >To</label>
                        <input style={inputStyle} type="text" id="to" name="to" />
                    </div>
                    <div>
                        <div style={{ marginTop: '1rem' }} className="form-group">
                            <label >CC</label>
                            <input style={inputStyle} type="text" id="cc" name="cc" />
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }} className="form-group">
                        <button disabled={true} type="button" className="pi-btn-primary"

                        >Subject</button>
                        <input style={inputStyle} type="text" placeholder="Enter Subject here" defaultValue={" Pi Play Partner"} />
                    </div>

                    <div style={{ marginTop: '1rem' }} className="form-group">

                        <textarea id="message"
                            name="message"
                            rows={10}
                            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
                            defaultValue={`Please find the attached file, which contains detailed information regarding your requested report, for your review and reference.\n\nBest regards,\nPi Play Team`}

                        >

                        </textarea>
                    </div>
                    <div style={{ marginTop: '1rem' }} className="form-group">
                        <input type="file" id="myfile" />
                    </div>
                </div>
                <div className="filter-buttons-row">
                    <Button className="pi-btn-secondary" onClick={() => {
                        const fromInput = document.getElementById('from') as HTMLInputElement;
                        const toInput = document.getElementById('to') as HTMLInputElement;
                        const ccInput = document.getElementById('cc') as HTMLInputElement;
                        const subjectInput = document.querySelector('input[placeholder="Enter Subject here"]') as HTMLInputElement;
                        const messageTextarea = document.getElementById('message') as HTMLTextAreaElement;

                        if (toInput) toInput.value = '';
                        if (ccInput) ccInput.value = '';
                        if (subjectInput) subjectInput.value = '';
                        if (messageTextarea) messageTextarea.value = '';
                    }}>
                        Clear
                    </Button>
                    <Button className="pi-btn-primary" type="primary" onClick={handleSendEmail} >
                        send
                    </Button>
                </div>
            </div>}

            trigger="click"
            open={emailerOpen}
            onOpenChange={handleOpenChange}
            overlayClassName="custom-ant-popover"
        >
        </Popover>
    );
}

export default Emailer;