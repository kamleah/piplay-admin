import React from 'react'

const SkillLabelV2 = ({ skilldata, size="lg"}) => {
  return (
    <div className={`${size === "sm" ? "label-outer-sm" : "label-outer"} ${skilldata.label}-outer`}  style={{ border: `1px solid ${skilldata.color}`}} >
      <div className={`${size === "sm" ? "label-inner-sm" : "label-inner"}  ${skilldata.label}-inner`} style={{ backgroundColor: skilldata.color, color: skilldata.text_color, width: `${skilldata.value}%` }} >
        {skilldata.label}
      </div>
    </div>
  )
}

export default SkillLabelV2