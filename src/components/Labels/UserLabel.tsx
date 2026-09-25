import React, { useState } from 'react'
import './labels.css'
import userimage from '../../assets/icon/user.jpeg'
import UserDetails from '../Modal/UserDetails'

const UserLabel = ({ userData, userType }) => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const handleshowRegistrationModal = async () => {
    setShowRegistrationModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowRegistrationModal(false);
  };

  const handleCancelDelete = () => {
    setShowRegistrationModal(false);
  };

  return (
    <>
      {userData &&
        <div className={`label ${userType}label`} onClick={() => handleshowRegistrationModal()}>
          <div className='userImageContainer'>
            <img className='userImage' src={userData?.profile_url ? userData?.profile_url : userimage} />
          </div>
          <div className='labelTxt' >
            {userType == 'partner' ? `${userData.name}` : `${userData?.firstname} ${userData?.lastname}`}
          </div>
        </div>
      } 

      <UserDetails
        visible={showRegistrationModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        name="User Details"
        userData={userData}
      />
    </>
  )
}

export default UserLabel
