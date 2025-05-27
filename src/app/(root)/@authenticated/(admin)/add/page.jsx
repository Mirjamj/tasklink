import React from 'react'
import { AddTaskForm } from './_components/add-task-form'

//Page component for creating a new task. Renders the AddTaskForm inside a basic wrapper.
function AddTaskPage() {
  return (
    <div>
      <AddTaskForm />
    </div>
  )
}

export default AddTaskPage