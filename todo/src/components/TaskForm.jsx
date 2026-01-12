import React, { useState, useEffect } from 'react';
import { BsSave, BsX, BsCalendar, BsFlag } from 'react-icons/bs';

const TaskForm = ({ addTask, updateTask, editingTask, setEditingTask, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    dueDate: '',
    status: 'todo'
  });

  useEffect(() => {
    if (editingTask) {
      setFormData(editingTask);
    } else {
      // Reset form when not editing
      setFormData({
        title: '',
        description: '',
        category: 'personal',
        priority: 'medium',
        dueDate: '',
        status: 'todo'
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    if (editingTask) {
      updateTask(formData);
    } else {
      addTask(formData);
    }

    // Reset form
    setFormData({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      dueDate: '',
      status: 'todo'
    });
    
    if (onCancel) {
      onCancel();
    }
  };

  const handleCancel = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      dueDate: '',
      status: 'todo'
    });
    if (onCancel) {
      onCancel();
    }
  };

  const categories = [
    { value: 'work', label: 'Work', color: 'bg-blue-100 text-blue-800', icon: '💼' },
    { value: 'personal', label: 'Personal', color: 'bg-green-100 text-green-800', icon: '👤' },
    { value: 'shopping', label: 'Shopping', color: 'bg-purple-100 text-purple-800', icon: '🛒' },
    { value: 'health', label: 'Health', color: 'bg-red-100 text-red-800', icon: '🏥' },
    { value: 'education', label: 'Education', color: 'bg-yellow-100 text-yellow-800', icon: '📚' },
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800', icon: '⬇️' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', icon: '⚡' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800', icon: '🚨' },
  ];

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Task Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          required
          autoFocus
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add details about the task..."
          rows="3"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none"
        />
      </div>

      {/* Category & Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Category
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${
                  formData.category === cat.value
                    ? `${cat.color} ring-2 ring-offset-1 ring-opacity-50 scale-105`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={cat.label}
              >
                <span className="text-xl mb-1">{cat.icon}</span>
                <span className="text-xs font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Priority
          </label>
          <div className="grid grid-cols-3 gap-2">
            {priorities.map((priority) => (
              <button
                key={priority.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${
                  formData.priority === priority.value
                    ? `${priority.color} ring-2 ring-offset-1 ring-opacity-50 scale-105`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="text-xl mb-1">{priority.icon}</span>
                <span className="text-xs font-medium">{priority.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Due Date & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <BsCalendar className="text-gray-500" />
              Due Date
            </div>
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            min={today}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          />
          {formData.dueDate && (
            <p className="text-sm text-gray-500 mt-1">
              Set for {new Date(formData.dueDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          )}
        </div>

        {/* Status (only for editing) */}
        {editingTask && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            >
              <option value="todo">📝 To Do</option>
              <option value="in-progress">⚡ In Progress</option>
              <option value="done">✅ Done</option>
            </select>
          </div>
        )}
      </div>

      {/* Priority Indicator */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <BsFlag className={`text-lg ${
            formData.priority === 'high' ? 'text-red-600' :
            formData.priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'
          }`} />
          <div>
            <span className="font-medium text-gray-700">Priority: </span>
            <span className={`font-bold ${
              formData.priority === 'high' ? 'text-red-600' :
              formData.priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'
            }`}>
              {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
            </span>
            <p className="text-sm text-gray-500 mt-1">
              {formData.priority === 'high' ? 'This task is urgent and important' :
               formData.priority === 'medium' ? 'This task is important but not urgent' :
               'This task has low priority'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          className="flex items-center justify-center gap-2 flex-1 bg-primary-600 text-black py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
        >
          <BsSave />
          {editingTask ? 'Update Task' : 'Create Task'}
        </button>
        
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <BsX className="text-lg" />
          Cancel
        </button>
      </div>

      {/* Quick Tips */}
      <div className="text-xs text-gray-500 pt-4 border-t">
        <p>💡 <strong>Quick tips:</strong></p>
        <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
          <li>Make your title descriptive and clear</li>
          <li>Use the description for detailed instructions or notes</li>
          <li>Set realistic due dates to stay on track</li>
          <li>Use categories to organize related tasks</li>
        </ul>
      </div>
    </form>
  );
};

export default TaskForm;