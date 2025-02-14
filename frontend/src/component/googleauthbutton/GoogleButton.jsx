import React from 'react'
import IntegrationSettings from '../AuthButton/IntegrationSettings'
import TaskForm from '../TaskForm/GoogleTaskForm';
import { Link } from 'react-router-dom';
// import TaskList from '../TaskForm/GoogleTaskList';
import GoogleTaskList from '../TaskForm/GoogleTaskList';

function GoogleButton() {
  return (
    <div className='d-block justify-content-center'>
      <IntegrationSettings></IntegrationSettings>
      <br></br>
      {/* <Link className='btn btn-primary' to={'/taskform'}>Add Taks</Link> */}
      <GoogleTaskList></GoogleTaskList>
    </div>
  )
}

export default GoogleButton;