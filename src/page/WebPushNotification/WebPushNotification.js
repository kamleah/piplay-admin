// import React, { useEffect, useState } from 'react';
// import { messaging, getToken } from '../../firebase';
// import { onMessage } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging.js';
// import { toast } from "react-toastify";
// import { webPushnotificationTokenAPI } from '../../components/apiFile/Service';
// import { useSelector } from 'react-redux';
// // import "../../components/css/style.css";

// const WebPushNotification = ({ matches, menuOpen, onToggle, modulePermissionsData }) => {
//     const loggedInUser = localStorage.getItem("auth");
//     const loggedUserDetails = useSelector((state) => state.user.loggedUserDetails);
//     const [permission, setPermission] = useState('default');

//     const saveWebToken = async (token) => {
//         try {
//             const payload = {
//                 token: token,
//                 userId: loggedUserDetails?._id
//             }
//             const res = await webPushnotificationTokenAPI(loggedInUser, payload);
//             console.log(res.data);
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     if ('serviceWorker' in navigator) {
//         navigator.serviceWorker.register('/firebase-messaging-sw.js')
//             .then(function (registration) {
//                 console.log('Registration successful, scope is:', registration.scope);
//             }).catch(function (err) {
//                 console.log('Service worker registration failed, error:', err);
//             });
//     };

//     const Msg = ({ closeToast, toastProps, title, body }) => (
//         // <div
//         //     className={`animate-enter max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
//         //     <div className="flex-1 w-0 p-4">
//         //         <div className="flex items-start">
//         //             <div className="flex-shrink-0 pt-0.5 rounded-sm">
//         //                 <img
//         //                     className="h-10 w-10 rounded-full"
//         //                     src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
//         //                     alt=""
//         //                 />
//         //             </div>
//         //             <div className="ml-3 flex-1">
//         //                 <p className="text-sm font-medium text-gray-900">
//         //                     {title}
//         //                 </p>
//         //                 <p className="mt-1 text-sm text-gray-500">
//         //                     {body}
//         //                 </p>
//         //             </div>
//         //         </div>
//         //     </div>
//         //     <div className="flex border-l border-gray-200">
//         //         <button
//         //             onClick={() => closeToast()}
//         //             className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         //         >
//         //             Close
//         //         </button>
//         //     </div>
//         // </div>
//         <div className="toast-container">
//             <div className="toast-content">
//                 <div className="toast-avatar">
//                     <img
//                         src={loggedUserDetails?.profile_url ? loggedUserDetails?.profile_url : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
//                         alt="Avatar"
//                     />
//                 </div>
//                 <div className="toast-text">
//                     <p className="toast-title">
//                         {title}
//                     </p>
//                     <p className="toast-body">
//                         {body}
//                     </p>
//                 </div>
//             </div>
//             {/* <div>
//                 <button
//                     onClick={() => closeToast()}
//                     className="toast-close-custom"
//                 >
//                     Close
//                 </button>
//             </div> */}
//         </div>


//     );

//     onMessage(messaging, (payload) => {
//         console.log('Message received. ', payload);
//         // Customize notification here
//         const notificationTitle = payload.notification.title;
//         const notificationBody = payload.notification.body;
//         const notificationOptions = {
//             body: payload.notification.body,
//             icon: payload.notification.icon,
//         };
//         toast(<Msg title={notificationTitle} body={notificationBody} />);

//         // new Notification(notificationTitle, notificationOptions);
//     });

//     const requestPermission = async () => {
//         try {
//             const status = await Notification.requestPermission();
//             console.log("status", status);
//             if (status === 'granted') {
//                 const token = await getToken(messaging, { vapidKey: 'BE519ZmS87jg0i54zsKFVVmcTsOjPcLwQteVZIUM5iK-vqe-R1H5UatJp9WF9jjftZs7JICvqKNJtCvsLoCwx20' });
//                 console.log('FCM Token:', token);
//                 await saveWebToken(token);
//                 setPermission(status);
//             } else {
//                 console.log('Notification permission denied');
//                 setPermission(status);
//             }
//         } catch (error) {
//             console.error('Error getting permission:', error);
//         }
//     };

//     useEffect(() => {
//         requestPermission();
//     }, []);


//     return (
//         <></>
//     );
// };

// export default WebPushNotification;
