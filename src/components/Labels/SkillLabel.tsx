import React from 'react'

const SkillLabel = ({ skill, size="lg"}) => {
  return (
    <div className={`${size === "sm" ? "label-outer-sm" : "label-outer"} ${skill}-outer`}>
      <div className={`${size === "sm" ? "label-inner-sm" : "label-inner"}  ${skill}-inner`} >
        {skill}
      </div>
    </div>
  )
}

export default SkillLabel