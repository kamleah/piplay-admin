import React from 'react'

const StatusLabel = ({ status , labelText='' }) => {
  return (
    <div className={`status-label status-${status}`}>
      {labelText ? labelText : status}
    </div>
  )
}

export default StatusLabel