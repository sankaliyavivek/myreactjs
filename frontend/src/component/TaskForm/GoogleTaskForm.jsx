import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
const GoogleTaskForm = ({ task, onTaskSaved, isGoogleConnected }) => {
    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");
    const [dueDate, setDueDate] = useState(task?.dueDate || "");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            
                await axios.post(`${API_BASE_URL}/api/calendar-task/create`, {
                    title,
                    description,
                    dueDate,
                }, { withCredentials: true });
            

            navigate('/googlebutton');
            if (onTaskSaved) onTaskSaved();
        } catch (error) {
            console.error("Error saving task:", error);
            setError("Failed to save task. Please try again.");
        }
    };

    return (
        <div className=" w-100 d-flex flex-column justify-content-center align-items-center  mt-3">
            <h2 >{task ? "Update Task" : "Create Task"}</h2>
        <form onSubmit={handleSubmit} className="w-25">
            {error && <p className="error-message">{error}</p>}
            
                <div className="mb-3">
                    <label>Task Name</label>
                    <input
                    className="w-100"
                        type="text"
                        placeholder="Task Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
            
                <div className="mb-3">
                <label>Task Description</label>
                      <textarea
                      className="w-100"
                        placeholder="Task Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
               
                <div className="mb-3">
                <label>DueDate</label>
                    <input
                    className="w-100"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>
                
                <button type="submit" className="btn btn-success w-100">{task ? "Update Task" : "Add Task"}</button>

         
        </form>
        </div>
    );
};

export default GoogleTaskForm;
