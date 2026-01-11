export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

// Optional: Seed with sample data for first-time users
export const seedSampleData = () => {
  const sampleTasks = [
    {
      id: '1',
      title: 'Complete React Project',
      description: 'Finish the task manager application with all CRUD operations',
      category: 'work',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'in-progress',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Buy Groceries',
      description: 'Milk, eggs, bread, fruits, and vegetables',
      category: 'shopping',
      priority: 'medium',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'todo',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Morning Workout',
      description: '30 minutes of cardio and strength training',
      category: 'health',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'todo',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Read React Documentation',
      description: 'Study new features in React 18',
      category: 'education',
      priority: 'low',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'done',
      completed: true,
      createdAt: new Date().toISOString()
    }
  ];

  if (!localStorage.getItem('tasks')) {
    saveToLocalStorage('tasks', sampleTasks);
    return sampleTasks;
  }
  return null;
};