import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const GoogleTaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/calendar-task/googletaskget", {
                    withCredentials: true,
                });
                setTasks(response.data.tasks);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                setError("Failed to load tasks.");
            }
        };
        fetchTasks();
    }, []);

    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:8000/api/calendar-task/delete/${taskId}`, {
                withCredentials: true,
            });
            setTasks(tasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
            setError("Failed to delete task.");
        }
    };

    return (
        <div>
            <h2 className="text-center">Google Task List</h2>
            {error && <p className="error-message">{error}</p>}
            <Link to={'/taskform'} className="btn bg-info">Create New</Link>
            <table className="table table-hover table-responsive mt-4">
                <thead>
                    <tr>
                        <th>Task Name</th>
                        <th>Decscription</th>
                        <th>Due Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>

                    {tasks.map((task) => (
                        <tr key={task._id}>
                            <td>
                                {task.title}
                            </td>
                            <td>{task.description}</td>
                            <td>
                                {task.dueDate}
                            </td>
                         <td>
                            <button onClick={() => deleteTask(task._id)} className="btn bg-danger">Delete</button>
                         </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GoogleTaskList;
