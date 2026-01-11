import React from 'react';
import { 
  BsCheckCircle, 
  BsCircle, 
  BsTrash, 
  BsPencil,
  BsClock,
  BsFlag,
  BsCalendar
} from 'react-icons/bs';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';

const TaskItem = ({ task, onDelete, onToggleComplete, onEdit }) => {
  const categoryColors = {
    work: 'bg-blue-100 text-blue-800',
    personal: 'bg-green-100 text-green-800',
    shopping: 'bg-purple-100 text-purple-800',
    health: 'bg-red-100 text-red-800',
    education: 'bg-yellow-100 text-yellow-800',
  };

  const priorityColors = {
    high: 'text-red-600',
    medium: 'text-yellow-600',
    low: 'text-gray-600',
  };

  const getDueDateText = () => {
    if (!task.dueDate) return null;
    
    const dueDate = parseISO(task.dueDate);
    
    if (isPast(dueDate) && !isToday(dueDate)) {
      return <span className="text-red-600 font-medium">Overdue: {format(dueDate, 'MMM d')}</span>;
    }
    if (isToday(dueDate)) {
      return <span className="text-green-600 font-medium">Today</span>;
    }
    if (isTomorrow(dueDate)) {
      return <span className="text-yellow-600 font-medium">Tomorrow</span>;
    }
    return format(dueDate, 'MMM d');
  };

  const statusColors = {
    'todo': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'done': 'bg-green-100 text-green-800',
  };

  return (
    <div className={`border rounded-xl p-5 transition-all duration-300 hover:shadow-md ${
      task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
    }`}>
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className="mt-1 flex-shrink-0"
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed ? (
            <BsCheckCircle className="text-2xl text-green-500" />
          ) : (
            <BsCircle className="text-2xl text-gray-300 hover:text-gray-400" />
          )}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Category Badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[task.category]}`}>
              {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
            </span>
            
            {/* Priority */}
            <div className={`flex items-center gap-1 ${priorityColors[task.priority]}`}>
              <BsFlag />
              <span className="text-sm font-medium capitalize">{task.priority}</span>
            </div>
            
            {/* Status */}
            {!task.completed && task.status && task.status !== 'todo' && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                {task.status === 'in-progress' ? 'In Progress' : task.status}
              </span>
            )}
          </div>

          {/* Task Title */}
          <h3 className={`text-lg font-semibold mb-2 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="text-gray-600 mb-3 whitespace-pre-wrap">
              {task.description}
            </p>
          )}

          {/* Due Date & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <BsCalendar />
                <span>Due: {getDueDateText()}</span>
              </div>
            )}

            {/* Created Date */}
            {task.createdAt && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <BsClock />
                <span>Added: {format(parseISO(task.createdAt), 'MMM d')}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => onEdit(task)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                aria-label="Edit task"
              >
                <BsPencil />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    onDelete(task.id);
                  }
                }}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Delete task"
              >
                <BsTrash />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;