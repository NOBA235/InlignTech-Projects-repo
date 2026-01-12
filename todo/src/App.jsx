import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import CategoryFilter from './components/CategoryFilter';
import StatsCard from './components/StatsCard';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  seedSampleData
} from './utils/storage';

import {
  BsCheckCircle,
  BsClock,
  BsListTask,
  BsCalendar,
  BsPlus,
  BsPlusCircle,
  BsGrid3X3Gap
} from 'react-icons/bs';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSampleDataBtn, setShowSampleDataBtn] = useState(false);

  /* -------------------- LOAD TASKS -------------------- */
  useEffect(() => {
    const savedTasks = loadFromLocalStorage('tasks') || [];
    setTasks(savedTasks);
    setShowSampleDataBtn(savedTasks.length === 0);
  }, []);

  /* -------------------- SAVE TASKS -------------------- */
  useEffect(() => {
    saveToLocalStorage('tasks', tasks);
    if (tasks.length > 0) setShowSampleDataBtn(false);
  }, [tasks]);

  /* -------------------- CRUD -------------------- */
  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completed: false
    };
    setTasks(prev => [newTask, ...prev]);
    setShowForm(false);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ));
    setEditingTask(null);
    setShowForm(false);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('task-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const loadSampleData = () => {
    const sampleTasks = seedSampleData();
    if (sampleTasks) setTasks(sampleTasks);
  };

  /* -------------------- FILTERS -------------------- */
  const filteredTasks = tasks.filter(task => {
    if (filter === 'todo' && task.completed) return false;
    if (filter === 'in-progress' && (task.completed || task.status !== 'in-progress')) return false;
    if (filter === 'done' && !task.completed) return false;
    if (category !== 'all' && task.category !== category) return false;
    return true;
  });

  /* -------------------- STATS -------------------- */
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(
    t => t.priority === 'high' && !t.completed
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Floating Button */}
      {!showForm && !editingTask && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-primary-600 text-black px-6 py-4 rounded-full shadow-xl hover:bg-primary-700"
        >
          <BsPlusCircle className="text-2xl" />
          Add Task
        </button>
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl">

        {/* HEADER */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <BsListTask className="text-primary-600" />
            Personal Task Manager
          </h1>
          <p className="text-gray-600 mt-2">
            Stay organized and productive
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-1 space-y-6">

            {(showForm || editingTask) && (
              <div id="task-form" className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    {editingTask ? 'Edit Task' : 'Add Task'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingTask(null);
                    }}
                  >
                    ✕
                  </button>
                </div>

                <TaskForm
                  addTask={addTask}
                  updateTask={updateTask}
                  editingTask={editingTask}
                  setEditingTask={setEditingTask}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingTask(null);
                  }}
                />
              </div>
            )}

            {tasks.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Statistics</h2>
                <StatsCard title="Total" value={totalTasks} icon={<BsListTask />} />
                <StatsCard title="Completed" value={completedTasks} icon={<BsCheckCircle />} />
                <StatsCard title="Pending" value={pendingTasks} icon={<BsClock />} />
                <StatsCard title="High Priority" value={highPriorityTasks} icon={<BsCalendar />} />
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">

            {tasks.length > 0 && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Your Tasks</h2>

                  <div className="relative">
                    <BsGrid3X3Gap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-lg"
                    >
                      <option value="all">All</option>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>

                <CategoryFilter
                  selectedCategory={category}
                  onCategoryChange={setCategory}
                />
              </>
            )}

            {filteredTasks.length > 0 ? (
              <TaskList
                tasks={filteredTasks}
                onDelete={deleteTask}
                onToggleComplete={toggleTaskCompletion}
                onEdit={startEditing}
              />
            ) : (
              <div className="text-center py-16 text-gray-500">
                <BsGrid3X3Gap className="text-6xl mx-auto mb-4" />
                No tasks found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
