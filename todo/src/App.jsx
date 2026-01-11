import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import CategoryFilter from './components/CategoryFilter';
import StatsCard from './components/StatsCard';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/storage';
import { 
  BsCheckCircle, 
  BsClock, 
  BsListTask, 
  BsCalendar 
} from 'react-icons/bs';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // all, todo, in-progress, done
  const [category, setCategory] = useState('all'); // all, work, personal, shopping, etc.
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = loadFromLocalStorage('tasks') || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    saveToLocalStorage('tasks', tasks);
  }, [tasks]);

  // CRUD Operations
  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completed: false
    };
    setTasks([newTask, ...tasks]);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setEditingTask(null);
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
    // Scroll to form
    document.getElementById('task-form').scrollIntoView({ behavior: 'smooth' });
  };

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter(task => {
    if (filter === 'todo' && task.completed) return false;
    if (filter === 'in-progress' && (task.completed || task.status !== 'in-progress')) return false;
    if (filter === 'done' && !task.completed) return false;
    if (category !== 'all' && task.category !== category) return false;
    return true;
  });

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(task => 
    task.priority === 'high' && !task.completed
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <BsListTask className="text-primary-600" />
            Personal Task Manager
          </h1>
          <p className="text-gray-600">Stay organized and productive with your daily tasks</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Task Form */}
            <div id="task-form" className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h2>
              <TaskForm 
                addTask={addTask}
                updateTask={updateTask}
                editingTask={editingTask}
                setEditingTask={setEditingTask}
              />
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <BsCheckCircle className="text-primary-600" />
                Task Statistics
              </h2>
              <div className="space-y-4">
                <StatsCard
                  title="Total Tasks"
                  value={totalTasks}
                  icon={<BsListTask className="text-blue-500" />}
                  color="bg-blue-50"
                />
                <StatsCard
                  title="Completed"
                  value={completedTasks}
                  icon={<BsCheckCircle className="text-green-500" />}
                  color="bg-green-50"
                />
                <StatsCard
                  title="Pending"
                  value={pendingTasks}
                  icon={<BsClock className="text-yellow-500" />}
                  color="bg-yellow-50"
                />
                <StatsCard
                  title="High Priority"
                  value={highPriorityTasks}
                  icon={<BsCalendar className="text-red-500" />}
                  color="bg-red-50"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Task List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Filters */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Tasks</h2>
                <div className="flex flex-wrap gap-4">
                  <CategoryFilter 
                    selectedCategory={category}
                    onCategoryChange={setCategory}
                  />
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 font-medium">Status:</span>
                    {['all', 'todo', 'in-progress', 'done'].map(status => (
                      <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                          filter === status
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {status === 'in-progress' ? 'In Progress' : status}
                      </button>
                    ))}
                  </div>

                  {tasks.length > 0 && (
                    <button
                      onClick={() => {
                        if (window.confirm('Clear all tasks?')) {
                          setTasks([]);
                        }
                      }}
                      className="ml-auto px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Task List */}
              {filteredTasks.length > 0 ? (
                <TaskList
                  tasks={filteredTasks}
                  onDelete={deleteTask}
                  onToggleComplete={toggleTaskCompletion}
                  onEdit={startEditing}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <BsListTask className="text-6xl mx-auto" />
                  </div>
                  <h3 className="text-xl text-gray-600 mb-2">No tasks found</h3>
                  <p className="text-gray-500">
                    {tasks.length === 0 
                      ? "Add your first task to get started!" 
                      : "Try changing your filters"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;