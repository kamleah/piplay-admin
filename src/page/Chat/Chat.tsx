import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Card, Breadcrumb, Radio, RadioChangeEvent, ConfigProvider } from "antd";
import "./Chat.css";
import { Icon } from "@iconify-icon/react";
import { Controller, useForm } from "react-hook-form";
import { deleteChatAPI, deleteChatForEveryoneAPI, deleteMessageAPI, getAllChatDetails, getAllUsers, getChatById, sendMessageAPI } from "../../components/apiFile/Service";
import { useSelector } from "react-redux";
import moment from "moment";
import noDataImage from "../../assets/icon/chat_support.jpg";
import { io } from "socket.io-client";
import { SOCKET } from "../../components/apiFile/Constants";
import { v4 as uuidv4 } from 'uuid';
import LongPressDiv from "../../components/Helpers/LongPress";
import DeleteConfirmation from "../../components/Modal/DeleteConfirmation";
import ToastMessage from "../facilator/ToastMessage/ToastMessage";
import { toast } from "react-toastify";
import CreateGroup from "../../components/Modal/CreateGroup";
import JoinGroupRequests from "../../components/Modal/JoinGroupRequests";
import ChatGroupDetails from "../../components/Modal/ChatGroupDetails";
import DeleteConfirmation2 from "../../components/Modal/DeleteConfirmation2";
import Linkify from 'react-linkify';
import AcceptRejectModal from "../../components/Modal/AcceptRejectModal";
import ClipLoader from "react-spinners/ClipLoader";


const Chat = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {
     const loggedInUser = localStorage.getItem("auth");
     const loggedUserDetails = useSelector((state: any) => state.user.loggedUserDetails);
     const {
          register: register1,
          handleSubmit: handleSubmit1,
          control: control,
          formState: { errors: errors1 },
          watch: watch1,
          reset: reset1,
     } = useForm();
     const [chatList, setChatList] = useState<any>([]);
     const [selectedChat, setSelectedChat] = useState<any>();
     const [filteredList, setFilteredList] = useState([]);
     const [messages, setMessages] = useState<any>([]);
     const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
     const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);
     const [userList, setUserList] = useState<any[]>([]);
     const [showDetails, setShowDetails] = useState(false);
     const [confirmation, setConfirmation] = useState(false);
     const [searchIsFocused, setsearchIsFocused] = useState(false);
     const [sendLoading, setSendLoading] = useState(false);
     const [deleteLoading, setDeleteLoading] = useState(false);
     const [chatLoading, setChatLoading] = useState(false);

     // const badWords = require("naughty-words");
     // const badWordsCustom = require("../../assets/json/naughty-words-custom");

     // var Filter = require('bad-words')
     // const filterBadWords = new Filter();
     // filterBadWords.addWords(
     //      ...badWords.ar,
     //      ...badWords.zh,
     //      ...badWords.cs,
     //      ...badWords.da,
     //      ...badWords.nl,
     //      ...badWords.en,
     //      ...badWords.eo,
     //      ...badWords.fil,
     //      ...badWords.fi,
     //      ...badWords.fr,
     //      ...badWords["fr-CA-u-sd-caqc"],
     //      ...badWords.de,
     //      ...badWords.hi,
     //      ...badWords.hu,
     //      ...badWords.it,
     //      ...badWords.ja,
     //      ...badWords.kab,
     //      ...badWords.tlh,
     //      ...badWords.ko,
     //      ...badWords.no,
     //      ...badWords.fa,
     //      ...badWords.pl,
     //      ...badWords.pt,
     //      ...badWords.ru,
     //      ...badWords.es,
     //      ...badWords.sv,
     //      ...badWords.th,
     //      ...badWords.tr,
     //      ...badWordsCustom.hi,
     //      ...badWordsCustom.facebook,
     //      ...badWordsCustom.youtube,
     //      ...badWordsCustom.google,
     //      ...badWordsCustom.addCustom,
     // );

     let searchKeyword = watch1("search");

     const moduleName = "Chat";
     const socket = useRef(io(SOCKET));

     const onSubmit = (data) => { };

     const getAllChatList = async () => {
          let response = await getAllChatDetails(loggedInUser, loggedUserDetails?._id);
          if (response?.code === 'SUCCESS') {
               setChatList(response?.data);
               if (!selectedChat) {
                    setFilteredList(response?.data);
               }
               console.log("getAllChatList", response?.data);
          }
     };

     const updateSelectedChatUserDetails = async () => {
          let response = await getAllChatDetails(loggedInUser, loggedUserDetails?._id);
          if (response?.code === 'SUCCESS') {
               console.log("getAllChatList", response?.data);
               setSelectedChat(response?.data[0]);
          }
     };

     const filterChat = (text) => {
          if (text) {
               let filteredData = chatList?.filter((chat: any) => {
                    if (chat?.is_group) {
                         return String(chat?.chatname)?.toLowerCase()?.includes(text?.toLowerCase());
                    } else {
                         let flag = false;
                         chat?.users?.forEach((user) => {
                              if (String(user?.firstname + user?.lastname)?.toLowerCase()?.includes(text?.toLowerCase()) && loggedUserDetails?._id !== user?._id) {
                                   flag = true;
                              }
                         });
                         if (flag) {
                              return chat;
                         }
                    }
               });
               setFilteredList(filteredData);
          } else {
               setFilteredList(chatList);
          }
     };

     const formatTimestamp = (timestamp) => {
          const momentTimestamp = moment(timestamp);
          if (moment().isSame(momentTimestamp, 'day')) {
               return momentTimestamp.format('h:mm A');
          }
          if (moment().subtract(1, 'days').isSame(momentTimestamp, 'day')) {
               return 'Yesterday';
          }
          if (moment().isSame(momentTimestamp, 'week')) {
               return momentTimestamp.format('dddd');
          }
          if (moment().isSame(momentTimestamp, 'year')) {
               return momentTimestamp.format('DD/MM/YYYY');
          }
          return momentTimestamp.format('DD/MM/YYYY');
     };

     const truncateText = (text, maxLength) => {
          if (text?.length > maxLength) {
               return text.substring(0, maxLength - 3) + '...';
          }
          return text;
     };

     useEffect(() => {
          getAllChatList();
          socket.current.connect();

          socket.current.on("connect", () => {
               console.log("Socket connected");
               if (selectedChat) {
                    socket.current.emit("joinNewRoom", selectedChat?._id, loggedUserDetails?._id);
               }
          });

          socket.current.on("disconnect", () => {
               console.log("Socket disconnected");
               if (selectedChat) {
                    socket.current.emit("leaveNewRoom", selectedChat?._id, loggedUserDetails?._id);
               }
          });

          socket.current.on("chat", (newMessage) => {
               console.log("New message added", newMessage);
               if (newMessage[0]?.room === selectedChat?._id) {
                    setMessages((prevMessages) => [...prevMessages, ...newMessage]);
               }
          });

          return () => {
               socket.current.disconnect();
               socket.current.off("connect");
               socket.current.off("disconnect");
               socket.current.off("chat");
          };
     }, [selectedChat]);

     useEffect(() => {
          if (selectedChat) {
               socket.current.emit("joinNewRoom", selectedChat?._id, loggedUserDetails?._id);
               console.log("Joined room", selectedChat?._id);
               getChatMessages();
          }
     }, [selectedChat]);

     useMemo(() => {
          filterChat(searchKeyword);
     }, [searchKeyword]);

     const getChatMessages = async () => {
          setChatLoading(true)
          let res = await getChatById(loggedInUser, 1, 500, selectedChat?._id, loggedUserDetails._id);
          if (res?.code === 'SUCCESS') {
               setMessages(res?.data?.reverse());
               setChatLoading(false)
          }
     };

     const [user, setUser] = useState<any>({});
     const chatUser = async () => {
          // console.log("skjvbdshjvbdsjhb------>", selectedChat);

          if (!selectedChat?.is_group) {
               selectedChat?.users?.forEach((item) => {
                    if (item?._id !== loggedUserDetails?._id) {
                         setUser(item);
                    }
               });
          }
     };
     useMemo(() => {
          chatUser();
     }, [selectedChat, chatList, filteredList]);
     const HeaderChatProfile = () => {
          return (
               <div className="header-chat-profile" onClick={() => { if (selectedChat?.is_group) { setShowDetails(!showDetails) } }}>
                    <img className="profile-image" src={selectedChat?.is_group && selectedChat?.group_profile != null ? selectedChat?.group_profile : user?.profile ? user?.profile : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="profile" />
                    <div className="profile-info">
                         <div className="heading-text" title={selectedChat?.is_group ? selectedChat?.chatname : `${user?.firstname} ${user?.lastname}` || user?.firstname}>{selectedChat?.is_group ? selectedChat?.chatname : `${user?.firstname} ${user?.lastname}` || user?.firstname}</div>
                    </div>
               </div>
          );
     };

     const ChatProfile = ({ chat, userId }) => {
          const [user, setUser] = useState<any>({});

          const chatUser = async () => {
               if (!chat?.is_group) {
                    chat?.users?.forEach((item) => {
                         if (item?._id !== userId) {
                              setUser(item);
                         }
                    });
               }
          };

          useMemo(() => {
               chatUser();
          }, [chat, chatList]);

          return (
               <div className={`chat-profile ${chat?._id === selectedChat?._id ? "active" : ""}`} onClick={() => { socket.current.emit("leaveRoom", selectedChat?._id); setSelectedChat(chat); }}>
                    <img className="profile-image" src={chat?.is_group && chat?.group_profile != null ? chat?.group_profile : user?.profile ? user?.profile : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="profile" />
                    <div className="profile-info">
                         <div className="heading-text text-nowrap" title={chat?.is_group ? chat?.chatname : `${user?.firstname} ${user?.lastname}` || user?.firstname}>{truncateText(chat?.is_group ? chat?.chatname : `${user?.firstname} ${user?.lastname}` || user?.firstname, 20)}</div>
                         <div className="light-text text-nowrap" title={chat?.latest_message?.content}>{chat?.latest_message?.content ? truncateText(chat.latest_message.content, 25) : 'New Group created'}</div>
                    </div>
                    <div className="profile-other-info">
                         <div className="light-text">{formatTimestamp(chat?.updatedAt)}</div>
                         {chat?.unread_message > 0 && <div className="new-message">{chat?.unread_message}</div>}
                    </div>
               </div>
          );
     };

     const messagesEndRef = useRef<HTMLDivElement | null>(null);
     useEffect(() => {
          if (messagesEndRef.current) {
               messagesEndRef.current.scrollIntoView();
          }
     }, [messages]);
     const ChatBox = () => {



          return (
               <div className="chat-box">
                    {
                         messages?.map((message, index) => {
                              if (message?.user?._id === loggedUserDetails?._id) {
                                   return (<LongPressDiv onLongPress={() => { handleMessageLongPress(message) }}>
                                        <OutgoingMessage key={index} message={message} />
                                   </LongPressDiv>)
                              } else {
                                   return (<LongPressDiv onLongPress={() => { handleMessageLongPress(message) }}>
                                        <IncomingMessage key={index} message={message} />
                                   </LongPressDiv>)
                              }
                         })
                    }
                    <div ref={messagesEndRef} />
               </div>
          );
     };

     const customDecorator = (href, text, key) => (
          <a href={href} key={key} target="_blank" rel="noopener noreferrer">
               {text}
          </a>
     );

     const copyToClipboard = (text) => {
          const rowDetails = JSON.stringify(text, null, 2);
          navigator.clipboard
               .writeText(rowDetails)
               .then(() => {
                    toast(<ToastMessage body={"Copied Successfully"} type="success" />, {
                         position: "top-right",
                         autoClose: 5000,
                         hideProgressBar: true,
                         closeOnClick: true,
                         pauseOnHover: true,
                         draggable: true,
                    });
               })
               .catch((error) => {
                    console.error("Failed to copy row details to clipboard:", error);
               });
     };


     const IncomingMessage = ({ message }) => {
          return (
               message.system ? <div className="light-text-center">{message?.text}</div> :
                    <Linkify componentDecorator={customDecorator}>
                         <div className="incoming-message-profile">
                              <div>
                                   <img className="profile-image" src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="profile" />
                              </div>
                              <div className="profile-info">
                                   <div className="heading-text">{message?.user?.name}, <span className="light-text">{moment(message?.createdAt).format('hh:mm A')}</span> </div>
                                   <div className="incoming-message">
                                        {message?.text} <Icon
                                             icon="solar:copy-bold"
                                             height="18"
                                             width="18"
                                             style={{ paddingLeft: '5px', cursor: 'pointer' }}
                                             onClick={() => copyToClipboard(message?.text)}
                                        />
                                   </div>
                              </div>
                         </div>
                    </Linkify>
          );
     };

     const OutgoingMessage = ({ message }) => {
          return (
               message.system ? <div className="light-text-center">{message?.text}</div> :
                    <Linkify componentDecorator={customDecorator}>

                         <div className="outgoing-message-profile">
                              <div className="profile-info">
                                   <div className="light-text text-end">{moment(message?.createdAt).format('hh:mm A')}</div>
                                   <div className="outgoing-message">
                                        {message?.text}
                                   </div>
                              </div>
                         </div>
                    </Linkify>

          );
     };


     const {
          register: register2,
          handleSubmit: handleSubmit2,
          formState: { errors: errors2 },
          watch: watch2,
          reset: reset2,
          setFocus: setFocus2
     } = useForm();
     let messageInput = watch2("message");

     const sendMessage = async (data) => {
          setSendLoading(true)
          const payload = {
               chat: selectedChat?._id,
               // content: (filterBadWords.clean(data?.message)),
               content: data?.message,
               sender: loggedUserDetails?._id
          };
          let resp = await sendMessageAPI(loggedInUser, payload);
          if (resp?.code === 'SUCCESS') {
               let text = [{ _id: uuidv4(), "createdAt": new Date().toISOString(), "room": selectedChat?._id, "text": data?.message, "user": { "_id": loggedUserDetails?._id, "avatar": loggedUserDetails?.profile_url, "name": `${loggedUserDetails?.firstname} ${loggedUserDetails?.lastname}` } }];
               console.log("sendMessage", payload);
               socket.current.emit('chat', text);
               getAllChatList();
               reset2();
               console.log("sendMessage++++++++++++++", text);
               setSendLoading(false)
          } else {
               setSendLoading(false)
          }
     };

     useEffect(() => {
          if (!searchIsFocused) {
               setFocus2("message");
          }
     }, [chatList]);

     const ChatInput = () => {
          return (
               <div className="chat-Input">
                    <form className='message-form' onSubmit={handleSubmit2(sendMessage)}>
                         <div className="form-column">
                              <div className="chat-form-group">
                                   <input
                                        className="chat-form-field"
                                        type="text"
                                        id="message"
                                        placeholder="Write a Message..."
                                        {...register2('message', { required: true })}
                                   />
                                   {messageInput && <Icon icon="charm:cross" onClick={() => reset2()} />}

                                   <button type="submit" className="chat-form-button" disabled={sendLoading}>
                                        {sendLoading ? <ClipLoader color="#F17121" size={25} /> : <Icon icon="mdi:send-circle" className="send-chat-icon" />}
                                   </button>
                              </div>
                         </div>
                    </form>
               </div>
          );
     };

     const DeleteFunction = async (id, type) => {
          let payload = {
               "chatId": [id],
               "userId": loggedUserDetails?._id
          }
          let payload2 = {
               "chatId": id,
               "userId": loggedUserDetails?._id
          }
          let payload3 = {
               "messageId": [id],
               "userId": loggedUserDetails._id,
               "for": "everyone"
          }
          let response;
          setDeleteLoading(true)
          if (type == 1) {
               response = await deleteChatAPI(loggedInUser, payload)
          } else if (type == 2) {
               response = await deleteChatForEveryoneAPI(loggedInUser, payload2)
          } else if (type == 3) {
               response = await deleteMessageAPI(loggedInUser, payload3)
          }
          if (response.code == 'SUCCESS') {
               toast(<ToastMessage body={type == 1 ? "Chat Deleted Successfully" : type == 2 ? "Chat Deleted Successfully For Everyone" : "Message Deleted Successfully For Everyone"} type="success" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
               getAllChatList();
               setSelectedChat(null);
               setDeleteLoading(false)
          } else {
               toast(<ToastMessage body={"Failed To Delete the Chat"} type="warning" />, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
               });
               setDeleteLoading(false)
          }
     }

     const handleConfirm = async () => {
          console.log("fasdhksabfashvgkdf");
          if (userToDeleteId) {
               await DeleteFunction(userToDeleteId, 3);
               setConfirmation(false)
               setUserToDeleteId("");
          }
     }

     const handleDeleteConfirmation = (id) => {
          setUserToDeleteId(id);
          setDeleteConfirmationVisible(true);
     };

     const handleConfirmDelete = async (type) => {
          if (userToDeleteId) {
               await DeleteFunction(userToDeleteId, type);
               setDeleteConfirmationVisible(false);
               setUserToDeleteId("");
          }
     };

     const handleCancelDelete = () => {
          setDeleteConfirmationVisible(false);
     };

     const handleLongPress = (data) => {
          handleDeleteConfirmation(data);
     };

     const handleMessageLongPress = (data) => {
          setUserToDeleteId(data._id);
          setConfirmation(true);
     }

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

     useEffect(() => {
          getUsers();
          onChangeChatType({ target: { value: selectedChatType } })
     }, [chatList]);

     const chatTypeOptions = [
          { label: 'All', value: 'All' },
          { label: 'Chat', value: 'Chat' },
          { label: 'Group', value: 'Group' },
     ];

     const [selectedChatType, setSelectedChatType] = useState('All');

     const onChangeChatType = (e) => {
          let value = e.target.value
          setSelectedChatType(value);
          if (value == 'Group') {
               let filteredData = chatList?.filter((chat: any) => {
                    return chat?.is_group === true
               });
               setFilteredList(filteredData);
          } else if (value == 'Chat') {
               let filteredData = chatList?.filter((chat: any) => {
                    return chat?.is_group === false
               });
               setFilteredList(filteredData);
          } else {
               setFilteredList(chatList);
          }

     };

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
                                        title: moduleName,
                                   }
                              ]}
                         />}
                         <div className="chat-card">
                              <div className="chat-sidebar">
                                   <div className="chat-header-section">
                                        <h5 className="chat-heading">Chats</h5>
                                        <CreateGroup matches={matches} userList={userList} getAll={getAllChatList} />
                                   </div>
                                   <form className='chat-search-form' onSubmit={handleSubmit1(onSubmit)}>
                                        <div className="form-column">
                                             <div className="form-group form-group-search">
                                                  <Icon icon="gravity-ui:magnifier" />
                                                  <Controller
                                                       name="search"
                                                       control={control}
                                                       rules={{
                                                            required: {
                                                                 value: true,
                                                                 message: "Sport type is required",
                                                            },
                                                       }}
                                                       render={({ field: { onChange, value }, field }) => (
                                                            <input
                                                                 className="form-field"
                                                                 type="text"
                                                                 id="universal-search"
                                                                 placeholder="Search"
                                                                 onChange={onChange}
                                                                 onFocus={() => setsearchIsFocused(true)}
                                                                 onBlur={() => setsearchIsFocused(false)}
                                                                 value={value}
                                                            />
                                                       )}
                                                  />
                                                  {searchKeyword && <Icon icon="charm:cross" onClick={() => reset1()} />}
                                             </div>
                                        </div>
                                   </form>
                                   <div className="chat-filter-tabs">
                                        <ConfigProvider
                                             theme={{
                                                  token: {
                                                       colorPrimary: '#F17121',
                                                       borderRadius: 18,
                                                  },
                                                  components: {
                                                       Radio: {
                                                            colorPrimary: '#F17121',  // Primary color for the Radio component
                                                       },
                                                  },
                                             }}
                                        >
                                             <Radio.Group
                                                  options={chatTypeOptions}
                                                  onChange={onChangeChatType}
                                                  value={selectedChatType}
                                                  optionType="button"
                                                  buttonStyle="solid"
                                                  className="custom-button-tabs"
                                             />
                                        </ConfigProvider>

                                   </div>
                                   <div className="chat-profile-list">
                                        {filteredList.map((chat: any, index) =>
                                             <LongPressDiv onLongPress={() => { handleLongPress(chat._id) }} >
                                                  <ChatProfile key={chat._id} chat={chat} userId={loggedUserDetails?._id} />
                                             </LongPressDiv>
                                        )}
                                   </div>
                              </div>
                              {!selectedChat ?
                                   <div className="chat-body">
                                        <div className="no-data-container">
                                             <img
                                                  src={noDataImage}
                                                  alt="No data found"
                                                  className="no-data-image"
                                             />
                                        </div>
                                   </div> :
                                   <div className="chat-body">
                                        <div className="chat-profile-container">
                                             <div className="header-chat-profile" onClick={() => { if (selectedChat?.is_group) { setShowDetails(!showDetails) } }}>
                                                  <img className="profile-image" src={selectedChat?.is_group && selectedChat?.group_profile != null ? selectedChat?.group_profile : user?.profile ? user?.profile : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="profile" />
                                                  <div className="profile-info">
                                                       <div className="heading-text" title={selectedChat?.is_group ? selectedChat?.chatname : `${user?.firstname} ${user?.lastname}` || user?.firstname}>{selectedChat?.is_group ? selectedChat?.chatname : `${user?.firstname} ${user?.lastname}` || user?.firstname}</div>
                                                  </div>
                                             </div>
                                             {(selectedChat?.ruser?.length > 0 && selectedChat?.join_request) &&
                                                  <JoinGroupRequests
                                                       matches={matches}
                                                       chatId={chatList?.filter((item: any) => item._id == selectedChat?._id)[0]}
                                                       getAll={() => { getAllChatList(); updateSelectedChatUserDetails(); }}
                                                  />}
                                        </div>
                                        <div className="chat-box-container">
                                             {chatLoading ?
                                                  <div className="chat-box">
                                                       <div className="chatbox-loader-container">
                                                            <ClipLoader /> 
                                                            <div className="message-loader-text">Loading Messages...</div>
                                                       </div>
                                                  </div> :
                                                  <div className="chat-box">
                                                       {
                                                            messages?.map((message, index) => {
                                                                 if (message?.user?._id === loggedUserDetails?._id) {
                                                                      return (<LongPressDiv onLongPress={() => { handleMessageLongPress(message) }}>
                                                                           {message.system ? <div className="light-text-center">{message?.text}</div> :
                                                                                <Linkify componentDecorator={customDecorator}>

                                                                                     <div className="outgoing-message-profile">
                                                                                          <div className="profile-info">
                                                                                               <div className="light-text text-end">{moment(message?.createdAt).format('hh:mm A')}</div>
                                                                                               <div className="outgoing-message">
                                                                                                    {message?.text}
                                                                                               </div>
                                                                                          </div>
                                                                                     </div>
                                                                                </Linkify>}
                                                                      </LongPressDiv>)
                                                                 } else {
                                                                      return (<LongPressDiv onLongPress={() => { handleMessageLongPress(message) }}>
                                                                          {message.system ? <div className="light-text-center">{message?.text}</div> :
                                                                           <Linkify componentDecorator={customDecorator}>
                                                                                <div className="incoming-message-profile">
                                                                                     <div>
                                                                                          <img className="profile-image" src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="profile" />
                                                                                     </div>
                                                                                     <div className="profile-info">
                                                                                          <div className="heading-text">{message?.user?.name}, <span className="light-text">{moment(message?.createdAt).format('hh:mm A')}</span> </div>
                                                                                          <div className="incoming-message">
                                                                                               {message?.text} <Icon
                                                                                                    icon="solar:copy-bold"
                                                                                                    height="18"
                                                                                                    width="18"
                                                                                                    style={{ paddingLeft: '5px', cursor: 'pointer' }}
                                                                                                    onClick={() => copyToClipboard(message?.text)}
                                                                                               />
                                                                                          </div>
                                                                                     </div>
                                                                                </div>
                                                                           </Linkify>}
                                                                      </LongPressDiv>)
                                                                 }
                                                            })
                                                       }
                                                       <div ref={messagesEndRef} />
                                                  </div>
                                             }
                                        </div>
                                        <div className="chat-input-container">
                                             <div className="chat-Input">
                                                  <form className='message-form' onSubmit={handleSubmit2(sendMessage)}>
                                                       <label htmlFor="message" className="form-column">
                                                            <div className="chat-form-group">
                                                                 <input
                                                                      className="chat-form-field"
                                                                      type="text"
                                                                      id="message"
                                                                      placeholder="Write a Message..."
                                                                      {...register2('message', { required: true })}
                                                                 />
                                                                 {messageInput && <Icon icon="charm:cross" onClick={() => reset2()} />}

                                                                 <button type="submit" className="chat-form-button" disabled={sendLoading}>
                                                                      {sendLoading ? <ClipLoader color="#F17121" size={25} /> : <Icon icon="mdi:send-circle" className="send-chat-icon" />}
                                                                 </button>
                                                            </div>
                                                       </label>
                                                  </form>
                                             </div>
                                        </div>
                                   </div>}
                         </div>
                         <ChatGroupDetails
                              visible={showDetails}
                              onCancel={() => { setShowDetails(!showDetails) }}
                              name="Chat Details"
                              row={chatList?.filter((item: any) => item?._id == selectedChat?._id)[0]}
                              getAll={getAllChatList}
                              getChat={getChatMessages}
                              setSelectedChat={() => { updateSelectedChatUserDetails() }}
                         />
                         <AcceptRejectModal
                              visible={confirmation}
                              onConfirm={handleConfirm}
                              onCancel={() => { setConfirmation(false) }}
                              name="booking"
                              type={'deleteMessage'}
                              loading={deleteLoading}
                         />
                         <DeleteConfirmation2
                              visible={deleteConfirmationVisible}
                              onConfirm={handleConfirmDelete}
                              onCancel={handleCancelDelete}
                              name="Chat"
                              onConfirm2={handleConfirmDelete}
                              loading={deleteLoading}
                         />
                    </Card>
               </div>
          </Fragment>
     );
};
export default Chat;
