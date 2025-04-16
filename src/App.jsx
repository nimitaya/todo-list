import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { toast } from "react-toastify";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [error, setError] = useState(null);

  // connect to Backend via .env
  const apiURL = import.meta.env.VITE_BACKEND_URL;

  // Daten fetchen aus unserer eigenen API
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${apiURL}`);

      const tasksArray = response.data;
      console.log(tasksArray);

      setTasks(tasksArray);
      // Use of toast
      toast.success("Todos fetched successfully");
    } catch (error) {
      console.log(error.message);
    }
  };

  // Fetch zu Beginn ausführen
  useEffect(() => {
    fetchTasks();
  }, []);

  // Funktion zum Todo-Erstellen
  const createTask = async (event) => {
    event.preventDefault();
    if (!newTaskText.trim()) {
      setError("Task text cannot be empty.");
      return;
    }
    console.log("newTaskText", newTaskText);
    try {
      await axios.post(`${apiURL}`, {
        todo: newTaskText,
      });
      // Use of toast
      toast.info("Todo created");
      fetchTasks();
      setNewTaskText("");
      setError(null);
    } catch (error) {
      console.log(error.message);
      setError("Failed to create task. Please try again.");
    }
  };

  // Funktion zum Task löschen
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${apiURL}/${id}`);
      // Use of toast
      toast.error("Todo deleted");
      fetchTasks();
    } catch (error) {
      console.log(error.message);
      setError("Failed to delete task. Please try again.");
    }
  };

  return (
    <>
      <h1>Tasks To Add</h1>

      <div>
        {error && <div className="error">{error}</div>}
        <form onSubmit={createTask}>
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => {
              setError(null);
              setNewTaskText(e.target.value);
            }}
          />
          <button type="submit">Add Task</button>
        </form>
      </div>

      <ul>
        {/* Render tasks here only if they exist */}
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task._id}>
              <span>{task.todo}</span>
              <button
                className="delete-button"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <li>No tasks found</li>
        )}
      </ul>
    </>
  );
}

export default App;
