import React, { useState, useEffect } from 'react';


const motivationalTexts = [
    "Small steps every day lead to big achievements tomorrow.",
    "A task completed is a victory earned.",
    "Progress isn't about speed; it's about moving forward.",
    "One task at a time, one step closer to your goals.",
    "Success starts with a single checkmark."
];

const categories = ['Urgent', 'Necessary', 'Less Important', 'Low Priority'];

const App = () => {
    const [quote, setQuote] = useState('');
    const [task, setTask] = useState('');
    const [editId, setEditId] = useState(null);
    const [category, setCategory] = useState('Urgent');
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : {
            Urgent: [],
            Necessary: [],
            'Less Important': [],
            'Low Priority': []
        };
    });

    useEffect(() => {
        const randomQuote = motivationalTexts[Math.floor(Math.random() * motivationalTexts.length)];
        setQuote(randomQuote);
    }, []);

    // Save tasks to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
        if (task.trim()) {
            if (editId) {
                const updatedTasks = tasks[category].map(t =>
                    t.id === editId ? { ...t, text: task } : t
                );
                setTasks({ ...tasks, [category]: updatedTasks });
                setEditId(null);
            } else {
                setTasks({
                    ...tasks,
                    [category]: [...tasks[category], { id: Date.now(), text: task, completed: false }]
                });
            }
            setTask('');
        }
    };

    const toggleComplete = (category, id) => {
        const updatedTasks = tasks[category].map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks({ ...tasks, [category]: updatedTasks });
    };

    const deleteTask = (category, id) => {
        setTasks({
            ...tasks,
            [category]: tasks[category].filter(task => task.id !== id)
        });
    };

    const editTask = (category, id, text) => {
        setTask(text);
        setEditId(id);
        setCategory(category);
    };

    return (
        <div className="app-container">
            <h1>To-Do List</h1>
            <div className="motivation">{quote}</div>

            <div className="input-section">
                <input 
                    type="text" 
                    placeholder="Enter your task" 
                    value={task} 
                    onChange={(e) => setTask(e.target.value)}
                />
                <button onClick={addTask}>{editId ? 'Update' : 'Add'}</button>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="task-section">
                {categories.map((cat) => (
                    <div key={cat} className="task-box">
                        <h3>{cat}</h3>
                        {tasks[cat].map(task => (
                            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleComplete(cat, task.id)}
                                />
                                {task.text}
                                <div className="action-buttons">
                                    <span onClick={() => editTask(cat, task.id, task.text)}>✏️ Edit</span>
                                    <span onClick={() => deleteTask(cat, task.id)}>❌ Delete</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
