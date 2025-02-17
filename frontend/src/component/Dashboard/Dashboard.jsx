// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// const Dashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [userData, setUserData] = useState(null);
//   const userRole = localStorage.getItem('role');

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/user/users`, { withCredentials: true });
//         if (userRole === 'admin') {
//           setUsers(response.data); // Admin gets all users
//         } else {
//           setUserData(response.data); // Regular user gets only their data
//         }
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };
//     fetchUsers();
//   }, [userRole]);


//   const deleteHandler = async (id) => {
//     // console.log(id)
//     try {
//       await axios.delete(`${API_BASE_URL}/user/deleteuser/${id}`, { withCredentials: true })
//       setUsers(users.filter(user => user._id !== id))
//       console.log(users)
//     } catch (error) {
//       console.error('Error deleting user:', error);
//     }
//   }
//   return (
//     <div>

//       {userRole === 'admin' ? (
//         <div>
//           <div className='text-center'><h2>UserInfo</h2></div>
//           <table className='table table-hover table-responsive'>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Phone</th>
//                 <th>Role</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr key={user._id}>
//                   <td>{user.name}</td>
//                   <td>{user.email}</td>
//                   <td>{user.phone}</td>
//                   <td>{user.role}</td>
//                   <td>
//                     <Link to={`/useredit/${user._id}`} className='bg-info btn mx-2'>Edit</Link>
//                     <button className='btn btn-danger' onClick={() => deleteHandler(user._id)}>Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div>
//           <h3>User Information</h3>
//           {userData && (
//             <div>
//               <table>
//                 <thead>
//                   <tr>
//                     <td>Name</td>
//                     <td>Email</td>
//                     <td>Phone</td>
//                     <td>Role</td>
//                   </tr>
//                 </thead>

//                 <tbody></tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/users`, { withCredentials: true });

        if (userRole === 'admin') {
          setUsers(response.data); // Admin gets all users
        } else {
          setUserData(response.data); // Regular user gets only their data
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [userRole]);

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/user/deleteuser/${id}`, { withCredentials: true });
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="container mt-4">
      {userRole === 'admin' ? (
        <div className="card shadow-lg p-3">
          <h2 className="text-center mb-4">User Management</h2>

          <table className="table table-hover  table-responsive text-center">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="align-middle">
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <span className={`badge bg-${user.role === 'admin' ? 'danger' : 'primary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="d-flex gap-2 justify-content-center">
                      <Link to={`/useredit/${user._id}`} className="btn btn-info btn-sm">Edit</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteHandler(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-muted">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card shadow-lg p-3">
          <h3 className="text-center mb-3">User Information</h3>

          {userData ? (
            <table className="table table-bordered text-center">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{userData.name}</td>
                  <td>{userData.email}</td>
                  <td>{userData.phone}</td>
                  <td>
                    <span className={`badge bg-${userData.role === 'admin' ? 'danger' : 'primary'}`}>
                      {userData.role}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="text-muted text-center">No user data available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
