import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import CategoryFilter from './components/CategoryFilter';
import StatsCard from './components/StatsCard';
import { saveToLocalStorage, loadFromLocalStorage, seedSampleData } from './utils/storage';
import { 
  BsCheckCircle, 
  BsClock, 
  BsListTask, 
  BsCalendar,
  BsPlus,
  BsPlusCircle,

BsGrid3X3GapFill

} from 'react-icons/bs';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSampleDataBtn, setShowSampleDataBtn] = useState(false);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = loadFromLocalStorage('tasks') || [];
    
    // Show sample data button if no tasks exist
    if (savedTasks.length === 0) {
      setShowSampleDataBtn(true);
    }
    
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    saveToLocalStorage('tasks', tasks);
    
    // Hide sample data button once tasks exist
    if (tasks.length > 0) {
      setShowSampleDataBtn(false);
    }
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
    setShowForm(false); // Hide form after adding
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
    setShowForm(true);
    // Scroll to form
    setTimeout(() => {
      document.getElementById('task-form').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const loadSampleData = () => {
    const sampleTasks = seedSampleData();
    if (sampleTasks) {
      setTasks(sampleTasks);
    }
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
      {/* Floating Action Button */}
      {!showForm && !editingTask && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-primary-600 text-white px-6 py-4 rounded-full shadow-xl hover:bg-primary-700 transition-all duration-300 hover:scale-105"
        >
          <BsPlusCircle className="text-2xl" />
          <span className="font-semibold">Add Task</span>
        </button>
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <BsListTask className="text-primary-600" />
                Personal Task Manager
              </h1>
              <p className="text-gray-600">Stay organized and productive with your daily tasks</p>
            </div>
            
            {/* Quick Stats Badge */}
            {tasks.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="bg-white px-4 py-2 rounded-lg shadow">
                  <span className="text-sm text-gray-600">Tasks: </span>
                  <span className="font-bold text-primary-600">{totalTasks}</span>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <BsPlus />
                  New Task
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Task Form - Only show when adding/editing or always show? Let's make it collapsible */}
            {(showForm || editingTask) ? (
              <div id="task-form" className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {editingTask ? 'Edit Task' : 'Add New Task'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingTask(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
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
            ) : (
              // Quick Add Card when form is hidden
              <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl shadow-lg p-6 border-2 border-dashed border-primary-200">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BsPlusCircle className="text-3xl text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Ready to get organized?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start by adding your first task
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    <BsPlus />
                    Create Your First Task
                  </button>
                  
                  {/* Sample Data Button */}
                  {showSampleDataBtn && (
                    <>
                      <div className="my-4 flex items-center">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="px-4 text-sm text-gray-500">or</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                      </div>
                      <button
                        onClick={loadSampleData}
                        className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Try with Sample Tasks
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Statistics - Only show if there are tasks */}
            {tasks.length > 0 && (
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
            )}
          </div>

          {/* Right Column - Task List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Filters */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">Your Tasks</h2>
                  
                  {tasks.length > 0 && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <BsPlus />
                        Add Task
                      </button>
                      <div className="relative">
                        <BsGrid3x3Gap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none bg-white"
                        >
                          <option value="all">All Tasks</option>
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Completed</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Category Filter */}
                {tasks.length > 0 && (
                  <div className="mb-6">
                    <CategoryFilter 
                      selectedCategory={category}
                      onCategoryChange={setCategory}
                    />
                  </div>
                )}

                {/* Clear All Button */}
                {tasks.length > 0 && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to clear all tasks?')) {
                          setTasks([]);
                          setShowSampleDataBtn(true);
                        }
                      }}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    >
                      Clear All Tasks
                    </button>
                  </div>
                )}
              </div>

              {/* Task List */}
              {filteredTasks.length > 0 ? (
                <TaskList
                  tasks={filteredTasks}
                  onDelete={deleteTask}
                  onToggleComplete={toggleTaskCompletion}
                  onEdit={startEditing}
                />
              ) : tasks.length > 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <BsGrid3x3Gap className="text-6xl mx-auto" />
                  </div>
                  <h3 className="text-xl text-gray-600 mb-2">No tasks match your filters</h3>
                  <p className="text-gray-500 mb-6">
                    Try changing your category or status filters
                  </p>
                  <button
                    onClick={() => {
                      setFilter('all');
                      setCategory('all');
                    }}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <BsListTask className="text-8xl mx-auto opacity-20" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-600 mb-3">
                    Your task list is empty
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Start by adding tasks to organize your day. You can categorize them, set priorities, and track your progress.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg flex items-center justify-center gap-3"
                    >
                      <BsPlusCircle className="text-xl" />
                      Create Your First Task
                    </button>
                    {showSampleDataBtn && (
                      <button
                        onClick={loadSampleData}
                        className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Try Sample Tasks
                      </button>
                    )}
                  </div>
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