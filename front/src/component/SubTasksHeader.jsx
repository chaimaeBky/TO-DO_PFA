import React from 'react'

const SubTasksHeader = ({task}) => {
  return (
<>


<div className="  flex justify-center items-center ">
<div className="bg-purple-300 p-6 rounded-lg shadow-md text-white  mb- mt-6 max-w-sm w-full">
    <div className="flex items-center space-x-4" >
      <p className="text-7xl">{task.icon}</p> {/* Icon */}
      <h3 className="text-xl font-semibold">{task.title}</h3> {/* Title */}
      
    </div>
    <p className="text-m text-right text-gray-500" >
      Total Subtasks: {task.subtasks ? task.subtasks.length : 0}
    </p> {/* Total subtasks */}
  </div>
  </div>
  
  
  </>
  )
}

export default SubTasksHeader