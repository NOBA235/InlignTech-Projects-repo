import { useEffect, useState } from "react";

function App(){
const [tasks,setTasks]=useState([]);
const [category,setCategory]=useState(All)
  //load tasks on first mouont
  useEffect(()=>{
const savedTasks=loadFromLocalStorage('tasks') || [];
setTasks(savedTasks)
  },[]);
   
//save tasks to local storage whenever new tasks is added
useEffect(()=>{
  saveToLocalStorage('tasks',tasks)
},[tasks]);

//function for adding tasks
const addTask=(task)=>{
const newtasks={
  ...task,
  id:Date.now().toString,
  createdAt:new Date().toISOString(),
  completed:false

}
setTasks([newtasks,...tasks]);

}

//function to deletetasks using filter method
const deleteTasks=(taskId)=>{
  setTasks(tasks.filter(task=>task.id !==taskId))
}

  return (
    <App></App>
  )
}

export default App;