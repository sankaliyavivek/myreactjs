import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GanttChart } from 'smart-webcomponents-react/ganttchart';
import 'smart-webcomponents-react/source/styles/smart.default.css';
import io from 'socket.io-client';
import TaskStatistics from '../StatisticsCharts/TaskStatsChart';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://myreactjsproject-backend.onrender.com";
const socket = io(`${SOCKET_URL}`, {
  path: "/socket.io/",
  withCredentials: true,
  transports: ["websocket", "polling"],
});

function ShowList() {
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const user = localStorage.getItem('username');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/task/showtask`)
      .then(response => setTasks(response.data.data))
      .catch(error => console.error(error));

    axios.get(`${API_BASE_URL}/user/alluser`)
      .then(response => setUsers(response.data.allUser));

    axios.get(`${API_BASE_URL}/notification/get`)
      .then(response => setNotifications(response.data.data))
      .catch(error => console.error("Error fetching notifications:", error));

    socket.on('taskUpdated', (notification) => {
      setNotifications(prev => [...prev, notification]);
    });

    socket.on('taskAssigned', (notification) => {
      setNotifications(prev => [...prev, notification]);
    });

    socket.on('taskUnassigned', (notification) => {
      setNotifications(prev => [...prev, notification]);
    });

    return () => {
      socket.off('taskUpdated');
      socket.off('taskAssigned');
      socket.off('taskUnassigned');
    };
  }, []);

  const handleAssign = async () => {
    if (!selectedTaskId || selectedUsers.length === 0) return;
    try {
      const response = await axios.put(
        `${API_BASE_URL}/task/assignTask/${selectedTaskId}`,
        { userIds: selectedUsers },
        { withCredentials: true }
      );

      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === selectedTaskId
            ? { ...task, assigneeId: [...new Set([...task.assigneeId, ...selectedUsers])] }
            : task
        )
      );
      setIsAssigning(false);
      alert("Task assigned successfully!");
    } catch (error) {
      console.error("Error assigning task:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleRemoveAssignedUser = async (taskId, userId) => {
    try {
      await axios.delete(`${API_BASE_URL}/task/unassignTask/${taskId}/${userId}`, { withCredentials: true });
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId
            ? { ...task, assigneeId: task.assigneeId.filter(id => id !== userId) }
            : task
        )
      );
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/task/taskdelete/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const removeNotification = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/notification/delete/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  };

  const ganttData = tasks.map(task => ({
    label: task.title,
    dateStart: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '2024-01-01',
    dateEnd: task.dueDate ? new Date(new Date(task.dueDate).getTime() + 86400000).toISOString().split('T')[0] : '2025-01-02',
    type: 'task'
  }));

  return (
    <div>
      <h1 className="task-heading  mt-4 mb-5">Show Task Management Data</h1>

      <div className='table-responsive'>
        {/* <div className='d-flex'> */}
        <Link to={'/newtask'} className='btn bg-success ms-1'>New Task <i className="fa-solid fa-plus"></i></Link>
        <Link to={'/kanban'} className='btn bg-info mx-2'>Kanban View Task</Link>
        <Link to={'/table'} className='btn bg-primary'>Tabular View</Link>
        <Link to={'/googlebutton'} className='none btn bg-info mx-2'>GoogleAuthButton</Link>



        {/* Notification Icon */}
        <div className="no m-3">
          <button className="btn btn-light position-relative" onClick={() => setShowNotificationModal(!showNotificationModal)}>
            <i className="fa-solid fa-bell fa-lg"></i>
            {notifications.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {notifications.length}
              </span>
            )}
          </button>
        </div>

        {/* Notification Modal */}
        {showNotificationModal && (
          <div className=" position-absolute  me-3 bg-white p-3 shadow rounded" style={{ width: "300px", zIndex: 1050 }}>
            <h5 className="text-center">Notifications</h5>
            {notifications.length > 0 ? (
              <ul className="list-group">
                {notifications.map((notification) => (
                  <li key={notification._id} className="list-group-item d-flex justify-content-between align-items-center">
                    {notification.message}
                    <button className="btn btn-danger btn-sm" onClick={() => removeNotification(notification._id)}>X</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center">No notifications</p>
            )}
          </div>
        )}

        <div className="mt-4">
          <div className="table-responsive">
            <table className="table table-hover text-center">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assignee</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className="align-middle">
                    <td>{task._id}</td>
                    <td className="fw-bold">{task.title}</td>
                    <td>{task.description}</td>
                    <td>
                      <span
                        className={`badge bg-${task.status === "Completed"
                            ? "success"
                            : task.status === "In Progress"
                              ? "warning"
                              : "secondary"
                          }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge bg-${task.priority === "High"
                            ? "danger"
                            : task.priority === "Medium"
                              ? "warning"
                              : "success"
                          }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      {task.assigneeId?.length > 0 ? (
                        task.assigneeId.map((userId, index) => {
                          const userObj = users.find((user) => user._id === userId);
                          return userObj ? (
                            <span key={index} className="d-flex align-items-center justify-content-center">
                              {userObj.name}
                              <button
                                onClick={() => handleRemoveAssignedUser(task._id, userObj._id)}
                                className="btn btn-danger btn-sm ms-2"
                              >
                                X
                              </button>
                            </span>
                          ) : null;
                        })
                      ) : (
                        <span className="text-muted">No users assigned</span>
                      )}
                    </td>
                    <td>
                      {user ? (
                        <div className="d-flex gap-2 justify-content-center">
                          <Link to={`/taskedit/${task._id}`} className="btn btn-info btn-sm">
                            Edit
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(task._id)}
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              setIsAssigning(true);
                              setSelectedTaskId(task._id);
                              setSelectedUsers([]);
                            }}
                            className="btn btn-primary btn-sm"
                          >
                            Assign
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted">Login to modify tasks</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        {/* Modal for Assigning Users */}
        {isAssigning && (
          <div className="modal d-flex justify-content-center align-items-center mt-5 w-100">
            <div className="modal-content p-3 w-50">
              <span className="close btn bg-danger" onClick={() => setIsAssigning(false)}>X</span>
              <h2 className="text-center">Assign Users to Task</h2>
              <select
                multiple
                value={selectedUsers}
                className="form-select w-100"
                onChange={e => setSelectedUsers([...e.target.selectedOptions].map(option => option.value))}
              >
                {users.map(user => <option key={user._id} value={user._id}>{user.name}</option>)}
              </select>
              <button onClick={handleAssign} className="btn btn-primary mt-2 w-50">Assign</button>
            </div>
          </div>
        )}


        <GanttChart dataSource={ganttData} treeSize="30%" durationUnit="day" />
        <TaskStatistics />
      </div>

    </div>
  )
}

export default ShowList;
