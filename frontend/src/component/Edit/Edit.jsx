import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
function Edit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState(null);




    useEffect(() => {
        axios.get(`${API_BASE_URL}/project/edit/${id}`)
            .then(response => {
                setTitle(response.data.project.title);
                setDescription(response.data.project.description);
                setStartDate(response.data.project.startDate);
                setEndDate(response.data.project.endDate);
                setDueDate(response.data.project.dueDate);
            })
            .catch(error => {
                setError(error.response?.data?.message || "Failed to fetch project");
            });
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (new Date(dueDate) < new Date(endDate)) {
            setError("Due date must be after the end date.");
            return;
        }
        try {
            await axios.put(`${API_BASE_URL}/project/update`, {
                id,
                title,
                description,
                startDate,
                endDate,
                dueDate
            });
            // alert("Project updated successfully");
            toast.success('Project updated successfully', {
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
            navigate('/');
        } catch (error) {
            console.error("Error updating project:", error);
            setError(error.response?.data?.message || "Failed to update project");
            // alert('Failed to update project')
            toast.error('Failed to update project', {
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
        <div className="container">
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
            <div className="text-center mb-4">
                <h1>Edit Project</h1>
            </div>

            <div className="d-flex justify-content-center">
                <form className="w-50" onSubmit={handleUpdate}>

                    {error && <p className="text-danger text-center">{error}</p>}
                    <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter project title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            placeholder="Enter project description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Start Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">End Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Due Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Update Project
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Edit;
