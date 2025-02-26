import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function UserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        axios.get(`${API_BASE_URL}/user/getuser/${id}`, {
            withCredentials: true,
        })
            .then(response => {
                console.log(response.data);
                setName(response.data.showUserData.name);
                setEmail(response.data.showUserData.email);
                setPhone(response.data.showUserData.phone);
            })
            .catch(error => {
                console.log(error);
            });
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE_URL}/user/edituser/${id}`, {
                name: name,
                email: email,
                phone: phone
            }, { withCredentials: true });

            // alert('User data updated successfully');
            toast.success('User data updated successfully', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            // alert('Error updating user data');
            toast.error('Error updating user data', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        }
    };

    return (
        <div className='mt-5'>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <h2 className='task-heading'>User Edit</h2>
                <form className='w-25' onSubmit={handleUpdate}>
                    {/* Name Input */}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Phone Input */}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Edit
                    </button>
                </form>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
        </div>
    );
}

export default UserEdit;
