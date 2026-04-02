// "use client";

// import { useState } from "react";


// // Define the Task type
// type Task = {
//   id: number;
//   name: string;
//   priority: "High" | "Medium" | "Low";
//   dueDate: string; // YYYY-MM-DD
//   completed: boolean;
//   estimatedHours?: number;
//   estimatedMinutes?: number;
//   tags: string[];
// };

// // Helper to get today's date in YYYY-MM-DD
// const getTodayDate = () => new Date().toISOString().slice(0, 10);
// const getTomorrowDate = () => {
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);
//   return tomorrow.toISOString().slice(0, 10);
// };
// const getNextWeekDate = () => {
//   const nextWeek = new Date();
//   nextWeek.setDate(nextWeek.getDate() + 7);
//   return nextWeek.toISOString().slice(0, 10);
// };

// export default function Home() {
//   // State for the new task form
//   const [taskName, setTaskName] = useState("");
//   const [deadlinePriority, setDeadlinePriority] = useState<"High" | "Medium" | "Low">("Medium");
//   const [deadlineDate, setDeadlineDate] = useState(getTomorrowDate());
//   const [estimatedHours, setEstimatedHours] = useState(1);
//   const [estimatedMinutes, setEstimatedMinutes] = useState(0);
//   const [newTaskTags, setNewTaskTags] = useState<string[]>([]);
//   const [tagInput, setTagInput] = useState("");

//   // List of all tasks (initial data matching the design)
//   const [tasks, setTasks] = useState<Task[]>([
//     {
//       id: 1,
//       name: "Review Frontend Architecture",
//       priority: "High",
//       dueDate: getTodayDate(),
//       completed: false,
//       estimatedHours: 2,
//       estimatedMinutes: 0,
//       tags: ["Frontend", "Architecture"],
//     },
//     {
//       id: 2,
//       name: "Team Sync: Design",
//       priority: "Medium",
//       dueDate: getTomorrowDate(),
//       completed: false,
//       estimatedHours: 1,
//       estimatedMinutes: 30,
//       tags: ["Meeting", "Design"],
//     },
//     {
//       id: 3,
//       name: "Client Feedback Implement",
//       priority: "High",
//       dueDate: getNextWeekDate(),
//       completed: false,
//       estimatedHours: 4,
//       estimatedMinutes: 0,
//       tags: ["Client", "Feedback"],
//     },
//     {
//       id: 4,
//       name: "Update Documentation",
//       priority: "Low",
//       dueDate: getNextWeekDate(),
//       completed: false,
//       estimatedHours: 1,
//       estimatedMinutes: 0,
//       tags: ["Docs"],
//     },
//     {
//       id: 5,
//       name: "Fix Navigation Bug",
//       priority: "Medium",
//       dueDate: getTodayDate(),
//       completed: true,
//       estimatedHours: 0,
//       estimatedMinutes: 45,
//       tags: ["Bug", "UI"],
//     },
//   ]);

//   // Filter states
//   const [filterKeyword, setFilterKeyword] = useState("");
//   const [filterType, setFilterType] = useState<
//     "All" | "Today" | "Upcoming" | "High Priority" | "Completed"
//   >("All");
//   const [priorityQuickFilter, setPriorityQuickFilter] = useState<"All" | "High" | "Low">("All");

//   // Helper: check if a task is due today
//   const isDueToday = (dueDate: string) => dueDate === getTodayDate();

//   // Helper: check if a task is upcoming (after today, not completed)
//   const isUpcoming = (dueDate: string, completed: boolean) => {
//     if (completed) return false;
//     const today = getTodayDate();
//     return dueDate > today;
//   };

//   // Apply all filters to tasks
//   const filteredTasks = tasks.filter((task) => {
//     // Keyword filter (case-insensitive)
//     if (filterKeyword && !task.name.toLowerCase().includes(filterKeyword.toLowerCase())) {
//       return false;
//     }

//     // Priority quick filter (High/Low buttons)
//     if (priorityQuickFilter === "High" && task.priority !== "High") return false;
//     if (priorityQuickFilter === "Low" && task.priority !== "Low") return false;

//     // Main filter type
//     switch (filterType) {
//       case "Today":
//         return isDueToday(task.dueDate);
//       case "Upcoming":
//         return isUpcoming(task.dueDate, task.completed);
//       case "High Priority":
//         return task.priority === "High";
//       case "Completed":
//         return task.completed;
//       default:
//         return true;
//     }
//   });

//   // Add a new tag to the new task
//   const addTag = () => {
//     if (tagInput.trim() && !newTaskTags.includes(tagInput.trim())) {
//       setNewTaskTags([...newTaskTags, tagInput.trim()]);
//       setTagInput("");
//     }
//   };

//   // Remove a tag from the new task
//   const removeTag = (tagToRemove: string) => {
//     setNewTaskTags(newTaskTags.filter((tag) => tag !== tagToRemove));
//   };

//   // Create a new task
//   const createTask = () => {
//     if (!taskName.trim()) {
//       alert("Please enter a task name.");
//       return;
//     }

//     const newTask: Task = {
//       id: Date.now(),
//       name: taskName.trim(),
//       priority: deadlinePriority,
//       dueDate: deadlineDate,
//       completed: false,
//       estimatedHours: estimatedHours || 0,
//       estimatedMinutes: estimatedMinutes || 0,
//       tags: [...newTaskTags],
//     };

//     setTasks([newTask, ...tasks]);

//     // Reset form
//     setTaskName("");
//     setDeadlinePriority("Medium");
//     setDeadlineDate(getTomorrowDate());
//     setEstimatedHours(1);
//     setEstimatedMinutes(0);
//     setNewTaskTags([]);
//     setTagInput("");
//   };

//   // Save as draft: just log current form data (could be extended to localStorage)
//   const saveAsDraft = () => {
//     const draft = {
//       taskName,
//       deadlinePriority,
//       deadlineDate,
//       estimatedHours,
//       estimatedMinutes,
//       tags: newTaskTags,
//     };
//     console.log("Draft saved:", draft);
//     alert("Draft saved (check console)");
//   };

//   // Toggle task completion
//   const toggleComplete = (taskId: number) => {
//     setTasks(
//       tasks.map((task) =>
//         task.id === taskId ? { ...task, completed: !task.completed } : task
//       )
//     );
//   };

//   // Delete a task
//   const deleteTask = (taskId: number) => {
//     setTasks(tasks.filter((task) => task.id !== taskId));
//   };

//   // Helper for priority badge styling (soft pastel)
//   const priorityBadge = (priority: string) => {
//     switch (priority) {
//       case "High":
//         return "bg-red-50 text-red-600 border border-red-200";
//       case "Medium":
//         return "bg-yellow-50 text-yellow-600 border border-yellow-200";
//       default:
//         return "bg-green-50 text-green-600 border border-green-200";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white p-6 font-sans">
//       <div className="max-w-7xl mx-auto">
//         {/* Header with title and settings button */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-4xl font-bold text-blue-600">
//               FocusFlow
//             </h1>
//             <p className="text-gray-500 mt-1">
//               Organize your workflow and let AI handle the scheduling.
//             </p>
//           </div>
//           <button
//             onClick={() => alert("Settings panel would open here")}
//             className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
//           >
//             ⚙️
//           </button>
//         </div>

//         {/* Main grid: Left column (Create Task) + Right column (Task List & Filters) */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* LEFT COLUMN: Create Task Form */}
//           <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
//             <h2 className="text-2xl font-semibold text-gray-800">Create New Task</h2>

//             {/* Task Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">
//                 TASK NAME
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. Design landing page hero"
//                 value={taskName}
//                 onChange={(e) => setTaskName(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
//               />
//             </div>

//             {/* Deadline & Priority */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   DEADLINE
//                 </label>
//                 <input
//                   type="date"
//                   value={deadlineDate}
//                   onChange={(e) => setDeadlineDate(e.target.value)}
//                   className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   DEADLINE PRIORITY
//                 </label>
//                 <div className="flex gap-2">
//                   {(["Low", "Medium", "High"] as const).map((level) => (
//                     <button
//                       key={level}
//                       onClick={() => setDeadlinePriority(level)}
//                       className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
//                         deadlinePriority === level
//                           ? "bg-blue-500 text-white shadow-sm"
//                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                       }`}
//                     >
//                       {level}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Estimated Duration */}
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">
//                 ESTIMATED DURATION
//               </label>
//               <div className="flex gap-4">
//                 <div className="flex-1">
//                   <input
//                     type="number"
//                     min="0"
//                     value={estimatedHours}
//                     onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 0)}
//                     className="w-full px-4 py-2 border border-gray-200 rounded-lg"
//                     placeholder="Hours"
//                   />
//                   <span className="text-xs text-gray-400">Hours</span>
//                 </div>
//                 <div className="flex-1">
//                   <input
//                     type="number"
//                     min="0"
//                     max="59"
//                     value={estimatedMinutes}
//                     onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 0)}
//                     className="w-full px-4 py-2 border border-gray-200 rounded-lg"
//                     placeholder="Mins"
//                   />
//                   <span className="text-xs text-gray-400">Minutes</span>
//                 </div>
//               </div>
//             </div>

//             {/* Task Details & Tags */}
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">
//                 TASK DETAILS & TAGS
//               </label>
//               {/* Example from design */}
//               <div className="bg-gray-50 rounded-lg p-3 mb-3 text-sm text-gray-600">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <span className="font-medium">- Finalize Q3 Proof (2)</span>
//                   <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
//                     #Planning
//                   </span>
//                   <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
//                     #Product
//                   </span>
//                 </div>
//               </div>
//               {/* Tag input for new task */}
//               <div className="flex gap-2 mb-2">
//                 <input
//                   type="text"
//                   value={tagInput}
//                   onChange={(e) => setTagInput(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && addTag()}
//                   placeholder="Add a tag (e.g. #Frontend)"
//                   className="flex-1 px-3 py-1 border border-gray-200 rounded-lg text-sm"
//                 />
//                 <button
//                   onClick={addTag}
//                   className="px-3 py-1 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
//                 >
//                   Add
//                 </button>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {newTaskTags.map((tag) => (
//                   <span
//                     key={tag}
//                     className="bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center gap-1"
//                   >
//                     #{tag}
//                     <button
//                       onClick={() => removeTag(tag)}
//                       className="text-gray-500 hover:text-red-500"
//                     >
//                       ×
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* Form action buttons */}
//             <div className="flex flex-wrap gap-3 pt-4">
//               <button
//                 onClick={saveAsDraft}
//                 className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
//               >
//                 Save as Draft
//               </button>
//               <button
//                 onClick={createTask}
//                 className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-sm"
//               >
//                 Create Task
//               </button>
//             </div>
//           </div>

//           {/* RIGHT COLUMN: Task List & Filters */}
//           <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
//             <h2 className="text-2xl font-semibold text-gray-800">Task Options</h2>

//             {/* Filter by keyword */}
//             <div>
//               <input
//                 type="text"
//                 placeholder="Filter by keyword..."
//                 value={filterKeyword}
//                 onChange={(e) => setFilterKeyword(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
//               />
//             </div>

//             {/* Filter pills (All, Today, Upcoming, High Priority, Completed) */}
//             <div className="flex flex-wrap gap-2">
//               {(["All", "Today", "Upcoming", "High Priority", "Completed"] as const).map((type) => (
//                 <button
//                   key={type}
//                   onClick={() => setFilterType(type)}
//                   className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
//                     filterType === type
//                       ? "bg-blue-500 text-white shadow-sm"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   {type}
//                 </button>
//               ))}
//             </div>

//             {/* Quick priority filter buttons: High / Low */}
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setPriorityQuickFilter(priorityQuickFilter === "High" ? "All" : "High")}
//                 className={`px-4 py-1.5 rounded-full text-sm font-medium ${
//                   priorityQuickFilter === "High"
//                     ? "bg-red-500 text-white"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 High
//               </button>
//               <button
//                 onClick={() => setPriorityQuickFilter(priorityQuickFilter === "Low" ? "All" : "Low")}
//                 className={`px-4 py-1.5 rounded-full text-sm font-medium ${
//                   priorityQuickFilter === "Low"
//                     ? "bg-green-500 text-white"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 Low
//               </button>
//               {priorityQuickFilter !== "All" && (
//                 <button
//                   onClick={() => setPriorityQuickFilter("All")}
//                   className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
//                 >
//                   Clear
//                 </button>
//               )}
//             </div>

//             {/* Task List */}
//             <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
//               {filteredTasks.length === 0 ? (
//                 <p className="text-center text-gray-500 py-8">
//                   No tasks match your filters. Try creating a new task!
//                 </p>
//               ) : (
//                 filteredTasks.map((task) => (
//                   <div
//                     key={task.id}
//                     className={`p-4 rounded-xl border transition-all ${
//                       task.completed
//                         ? "bg-gray-50 border-gray-200 opacity-75"
//                         : "bg-white border-gray-200 hover:shadow-md"
//                     }`}
//                   >
//                     <div className="flex items-start justify-between gap-2">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 flex-wrap">
//                           <h3
//                             className={`font-medium text-gray-800 ${
//                               task.completed ? "line-through text-gray-500" : ""
//                             }`}
//                           >
//                             {task.name}
//                           </h3>
//                           <span
//                             className={`text-xs px-2 py-0.5 rounded-full ${priorityBadge(task.priority)}`}
//                           >
//                             {task.priority}
//                           </span>
//                           {task.completed && (
//                             <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full">
//                               ✓ Done
//                             </span>
//                           )}
//                         </div>
//                         <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
//                           <span>📅 Due: {task.dueDate}</span>
//                           {(task.estimatedHours !== undefined || task.estimatedMinutes !== undefined) && (
//                             <span>
//                               ⏱️ {task.estimatedHours}h {task.estimatedMinutes}m
//                             </span>
//                           )}
//                           {task.tags.length > 0 && (
//                             <div className="flex gap-1">
//                               {task.tags.map((tag) => (
//                                 <span key={tag} className="bg-gray-100 px-1.5 rounded">
//                                   #{tag}
//                                 </span>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex gap-1">
//                         <button
//                           onClick={() => toggleComplete(task.id)}
//                           className="p-1.5 text-gray-500 hover:text-green-600"
//                           title={task.completed ? "Mark incomplete" : "Mark complete"}
//                         >
//                           {task.completed ? "🔄" : "✓"}
//                         </button>
//                         <button
//                           onClick={() => deleteTask(task.id)}
//                           className="p-1.5 text-gray-500 hover:text-red-600"
//                           title="Delete task"
//                         >
//                           🗑️
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}