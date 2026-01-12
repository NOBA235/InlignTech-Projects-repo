// Local Storage Utility Functions

/**
 * Save data to localStorage
 * @param {string} key - The key to store data under
 * @param {any} data - The data to store (will be JSON stringified)
 */
export const saveToLocalStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    console.log(`Saved ${data.length || 0} items to localStorage under key: ${key}`);
  } catch (error) {
    console.error(' Error saving to localStorage:', error);
    // localStorage might be full or not available
    alert('Could not save tasks. Local storage might be full or disabled.');
  }
};

/**
 * Load data from localStorage
 * @param {string} key - The key to retrieve data from
 * @returns {any} The parsed data or null if not found/error
 */
export const loadFromLocalStorage = (key) => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      console.log(`📭 No data found in localStorage for key: ${key}`);
      return null;
    }
    const data = JSON.parse(serializedData);
    console.log(`Loaded ${data.length || 0} items from localStorage`);
    return data;
  } catch (error) {
    console.error(' Error loading from localStorage:', error);
    // If there's an error (corrupted data), clear that key
    localStorage.removeItem(key);
    alert('Your task data was corrupted and has been reset. Please start fresh.');
    return null;
  }
};

/**
 * Clear all tasks from localStorage
 * @param {string} key - The key to clear
 */
export const clearLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    console.log(`🗑️ Cleared localStorage key: ${key}`);
    return true;
  } catch (error) {
    console.error('❌ Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Get storage usage statistics
 * @returns {Object} Storage usage info
 */
export const getStorageStats = () => {
  try {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length * 2; // Approximate bytes (2 bytes per char for UTF-16)
      }
    }
    return {
      usedKB: (total / 1024).toFixed(2),
      usedMB: (total / (1024 * 1024)).toFixed(4),
      limitMB: 5, // Typical localStorage limit is 5MB
      percentUsed: ((total / (5 * 1024 * 1024)) * 100).toFixed(1)
    };
  } catch (error) {
    console.error('Error calculating storage stats:', error);
    return null;
  }
};

/**
 * Seed localStorage with sample task data for first-time users
 * @returns {Array|null} The sample tasks if seeded, null if already has data
 */
export const seedSampleData = () => {
  try {
    // Check if tasks already exist
    const existingTasks = localStorage.getItem('tasks');
    if (existingTasks) {
      console.log('📊 Tasks already exist in localStorage, not seeding');
      return null;
    }

    // Create sample tasks with realistic data
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    const sampleTasks = [
      {
        id: 'sample-1',
        title: 'Complete React Task Manager',
        description: 'Finish building the personal task manager application with all CRUD operations. Add drag-and-drop functionality and improve the UI.',
        category: 'work',
        priority: 'high',
        dueDate: twoDaysFromNow.toISOString().split('T')[0],
        status: 'in-progress',
        completed: false,
        createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sample-2',
        title: 'Weekly Grocery Shopping',
        description: 'Buy milk, eggs, bread, fruits, vegetables, coffee, and snacks. Check pantry for items running low.',
        category: 'shopping',
        priority: 'medium',
        dueDate: tomorrow.toISOString().split('T')[0],
        status: 'todo',
        completed: false,
        createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sample-3',
        title: 'Morning Workout Routine',
        description: '30 minutes of cardio (running or cycling) followed by 20 minutes of strength training. Focus on core today.',
        category: 'health',
        priority: 'medium',
        dueDate: today.toISOString().split('T')[0],
        status: 'todo',
        completed: false,
        createdAt: new Date(today.getTime() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sample-4',
        title: 'Learn React Hooks Deep Dive',
        description: 'Study useState, useEffect, useContext, and custom hooks. Complete the official React tutorial.',
        category: 'education',
        priority: 'high',
        dueDate: nextWeek.toISOString().split('T')[0],
        status: 'in-progress',
        completed: false,
        createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sample-5',
        title: 'Dentist Appointment',
        description: 'Regular dental checkup at 2:00 PM. Bring insurance card and arrive 15 minutes early.',
        category: 'health',
        priority: 'medium',
        dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'todo',
        completed: false,
        createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sample-6',
        title: 'Plan Weekend Trip',
        description: 'Research destinations, book accommodations, and create itinerary. Check weather forecast.',
        category: 'personal',
        priority: 'low',
        dueDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'todo',
        completed: false,
        createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sample-7',
        title: 'Read React Documentation Updates',
        description: 'Catch up on new features in React 18 and React Server Components documentation.',
        category: 'education',
        priority: 'low',
        dueDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'done',
        completed: true,
        createdAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sample-8',
        title: 'Team Meeting Preparation',
        description: 'Prepare quarterly report, update project timelines, and create presentation slides.',
        category: 'work',
        priority: 'high',
        dueDate: tomorrow.toISOString().split('T')[0],
        status: 'in-progress',
        completed: false,
        createdAt: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Save sample tasks to localStorage
    saveToLocalStorage('tasks', sampleTasks);
    console.log('🌱 Seeded localStorage with sample tasks');
    
    // Also save a flag that sample data was seeded
    localStorage.setItem('sampleDataSeeded', 'true');
    localStorage.setItem('firstVisitDate', new Date().toISOString());
    
    return sampleTasks;
  } catch (error) {
    console.error('Error seeding sample data:', error);
    return null;
  }
};

/**
 * Export tasks as JSON file
 * @param {Array} tasks - The tasks to export
 * @param {string} filename - The filename to use (default: tasks-backup.json)
 */
export const exportTasksToFile = (tasks, filename = 'tasks-backup.json') => {
  try {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(dataBlob);
    downloadLink.download = filename;
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    console.log(` Exported ${tasks.length} tasks to ${filename}`);
    return true;
  } catch (error) {
    console.error('Error exporting tasks:', error);
    return false;
  }
};

/**
 * Import tasks from JSON file
 * @param {File} file - The JSON file to import
 * @returns {Promise<Array>} The imported tasks
 */
export const importTasksFromFile = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const tasks = JSON.parse(event.target.result);
          
          // Validate the imported data
          if (!Array.isArray(tasks)) {
            throw new Error('Imported data is not an array');
          }
          
          // Basic validation of task structure
          const isValid = tasks.every(task => 
            task.id && task.title && typeof task.completed === 'boolean'
          );
          
          if (!isValid) {
            throw new Error('Invalid task data structure');
          }
          
          console.log(`Imported ${tasks.length} tasks from file`);
          resolve(tasks);
        } catch (parseError) {
          reject(new Error('Invalid JSON file format'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Backup current tasks before clearing
 * @returns {boolean} Success status
 */
export const backupCurrentTasks = () => {
  try {
    const currentTasks = loadFromLocalStorage('tasks') || [];
    if (currentTasks.length > 0) {
      const backupKey = `tasks-backup-${Date.now()}`;
      saveToLocalStorage(backupKey, currentTasks);
      console.log(`Created backup: ${backupKey} with ${currentTasks.length} tasks`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error creating backup:', error);
    return false;
  }
};

/**
 * Get all backups from localStorage
 * @returns {Array} List of backup keys
 */
export const getAllBackups = () => {
  const backups = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('tasks-backup-')) {
      backups.push(key);
    }
  }
  return backups.sort(); // Sort by key (which includes timestamp)
};