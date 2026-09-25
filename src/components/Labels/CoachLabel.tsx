import React, { useState } from 'react'
import './labels.css'
import userimage from '../../assets/icon/user.jpeg'
import UserDetails from '../Modal/UserDetails'
import CoachDetails from '../Modal/CoachDetails'

const CoachLabel = ({ coachData, userType ='coach' }) => {
     const [showDetails, setShowDetails] = useState(false);

     const handleshowDetails = async () => {
          setShowDetails(true);
     };

     const handleCancelDelete = () => {
          setShowDetails(false);
     };

     return (
          <>
               {coachData &&
                    <div className={`label ${userType}label`} onClick={() => handleshowDetails()}>
                         <div className='userImageContainer'>
                              <img className='userImage' src={coachData?.image ? coachData?.image : userimage} />
                         </div>
                         <div className='labelTxt' >
                              {userType == 'coach' ? `${coachData.name}` : `${coachData?.firstname} ${coachData?.lastname}`}
                         </div>
                    </div>
               }

               <CoachDetails
                    visible={showDetails}
                    onCancel={handleCancelDelete}
                    name="Coach Details"
                    row={coachData}
               />
          </>
     )
}

export default CoachLabel
