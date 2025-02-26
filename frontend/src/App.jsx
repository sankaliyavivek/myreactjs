import { useState } from 'react'
import './App.css'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import { Route, Routes } from 'react-router-dom'
import Home from './component/Home/Home'
import Register from './component/Registration/Register'
import Login from './component/Login/Login'
import Navbar from './component/Navbar/Navbar'
import NewProjectForm from './component/newproject/NewProjectForm'
import Edit from './component/Edit/Edit'
import NewTask from './component/newtask/NewTask'
import TaskEdit from './component/TaskEdit/TaskEdit'
import TaskTable from './component/Table-Data/Tabular'
import KanbanList from './component/KanbanList/KanbanList'
import AllTask from './component/Task/AllTask'
import Dashboard from './component/Dashboard/Dashboard'
import UserEdit from './component/UserEdit/UserEdit'
import GoogleButton from './component/googleauthbutton/GoogleButton'
import GoogleTaskForm from './component/TaskForm/GoogleTaskForm'
import 'react-toastify/dist/ReactToastify.css';


// frontend installation
// npm install react-router-dom
// npm install react-bootstrap bootstrap
// npm install react-icons
// npm install react-toastify
// npm i axios 
// npm i react-chart 
// npm i react-gannt-task-react 
// npm i react-beautiful-dnd
// npm i react-calender
// npm i react-chartjs2
// npm i react-gantt
// npm react-table
// npm i smart-webcomponents smart-webcomponents-react 
// npm i socket.io-client





function App() {

  return (
    <div className='hide'>
      
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/register' element={<Register></Register>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/newproject' element={<NewProjectForm></NewProjectForm>}></Route>
        <Route path='/alltask' element={<AllTask></AllTask>}></Route>
        <Route path='/newtask' element={<NewTask></NewTask>}>NewTask</Route>
        <Route path='/edit/:id' element={<Edit></Edit>}></Route>
        <Route path='/googlebutton' element={<GoogleButton></GoogleButton>}></Route>
        <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
        <Route path='/useredit/:id' element={<UserEdit></UserEdit>}></Route>
        <Route path='/kanban' element={<KanbanList></KanbanList>}></Route>
        <Route path='/taskedit/:id' element={<TaskEdit></TaskEdit>}></Route>
        <Route path='/table' element={<TaskTable ></TaskTable>}></Route>
        <Route path='/taskform' element={<GoogleTaskForm></GoogleTaskForm>}></Route>
      </Routes>

    </div>
  )
}

export default App
