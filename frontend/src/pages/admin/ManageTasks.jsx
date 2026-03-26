import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "../../store/useTaskStore.js";
import { useProblemStore } from "../../store/useProblemStore.js";
import { useUserStore } from "../../store/useUserStore.js";
import Navbar from "../../components/layout/Navbar.jsx";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  UserMinus,
  PlusCircle,
  CheckSquare,
  Edit,
  RefreshCw,
} from "lucide-react";

const ManageTasks = () => {
  const {
    tasks,
    getTasksByProblem,
    approvePR,
    rejectPR,
    unassignTask,
    createTask,
    updateTask,
    loading,
  } = useTaskStore();

  const { allProblems, getAllProblems } = useProblemStore();
  const { getLeaderboard, getMyProfile } = useUserStore();
  const [expandedProblems, setExpandedProblems] = useState({});
  const [selectedProblem, setSelectedProblem] = useState("");
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    difficulty: "EASY",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    difficulty: "EASY",
  });

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  const handleExpandProblem = (problemId) => {
    const isCurrentlyExpanded = expandedProblems[problemId];

    setExpandedProblems((prev) => ({
      ...prev,
      [problemId]: !prev[problemId],
    }));

    // Always fetch tasks when expanding or re-expanding to get latest updates
    if (!isCurrentlyExpanded) {
      getTasksByProblem(problemId);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!selectedProblem) {
      alert("Please select a problem");
      return;
    }
    if (!taskForm.title.trim()) {
      alert("Task title is required");
      return;
    }

    await createTask({
      problemId: selectedProblem,
      title: taskForm.title,
      description: taskForm.description,
      difficulty: taskForm.difficulty,
    });

    setTaskForm({ title: "", description: "", difficulty: "EASY" });
    getTasksByProblem(selectedProblem);
  };

  const handleEditTask = async (e, taskId) => {
    e.preventDefault();
    if (!editForm.title.trim()) {
      alert("Title is required");
      return;
    }
    await updateTask(taskId, editForm);
    setEditingTask(null);
  };

  const handleApprovePR = async (taskId) => {
    if (window.confirm("Approve this PR? Task will be marked as completed.")) {
      await approvePR(taskId);
      // Refresh leaderboard and user profile to reflect reputation changes
      setTimeout(async () => {
        await getLeaderboard();
        await getMyProfile();
      }, 500);
    }
  };

  const handleRejectPR = async (taskId) => {
    if (window.confirm("Reject this PR? Task will be reopened.")) {
      await rejectPR(taskId);
      // Refresh profile data after rejection
      setTimeout(async () => {
        await getMyProfile();
      }, 500);
    }
  };

  const handleUnassignTask = async (taskId) => {
    if (window.confirm("Unassign this user from the task?")) {
      await unassignTask(taskId);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      OPEN: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      ASSIGNED: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      IN_PROGRESS: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      IN_REVIEW: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      REOPENED: "bg-red-500/10 text-red-400 border-red-500/30",
      CANCELLED: "bg-gray-500/10 text-gray-400 border-gray-500/30",
    };
    return colors[status] || colors.OPEN;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Background glow effects */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-slate-700/50 pb-6">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Manage Tasks
              </h1>
              <p className="text-slate-400">
                Create new tasks and manage task submissions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Create Task Form (Sticky on Desktop) */}
            <div className="lg:col-span-1 lg:sticky lg:top-24">
              <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                {/* Form Accent Header */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />

                <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-400" />
                  Create Task
                </h2>

                <p className="text-xs text-slate-400 mb-4 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  ℹ️ Select a problem below, then fill in task details to create
                  a new task.
                </p>

                <form onSubmit={handleCreateTask} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Problem
                    </label>
                    <div className="relative">
                      <select
                        value={selectedProblem}
                        onChange={(e) => setSelectedProblem(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition appearance-none"
                      >
                        <option value="">
                          {allProblems?.length === 0
                            ? "No problems available"
                            : "Select a problem..."}
                        </option>
                        {allProblems?.map((problem) => (
                          <option key={problem._id} value={problem._id}>
                            {problem.title}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                    {allProblems?.length === 0 && (
                      <p className="text-xs text-amber-400 mt-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded">
                        No problems created yet. Create a problem first.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={taskForm.title}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, title: e.target.value })
                      }
                      placeholder="What needs to be done?"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Difficulty
                    </label>
                    <div className="flex gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-700">
                      {["EASY", "MEDIUM", "HARD"].map((diff) => (
                        <button
                          key={diff}
                          type="button"
                          onClick={() =>
                            setTaskForm({ ...taskForm, difficulty: diff })
                          }
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                            taskForm.difficulty === diff
                              ? diff === "EASY"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : diff === "MEDIUM"
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "text-slate-500 hover:text-slate-300 transparent border border-transparent"
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Description
                    </label>
                    <textarea
                      value={taskForm.description}
                      onChange={(e) =>
                        setTaskForm({
                          ...taskForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Provide more context..."
                      rows="3"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl transition shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 mt-4 flex justify-center"
                  >
                    {loading ? (
                      <span className="animate-pulse">Creating...</span>
                    ) : (
                      "Create Task"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Tasks Explorer */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-6 border-b border-slate-700/50 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">
                    Task Explorer
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {tasks?.filter((t) => t.status === "IN_REVIEW").length}{" "}
                    tasks awaiting review
                  </p>
                </div>
                <button
                  onClick={() => {
                    // Refresh all problems' tasks
                    Object.keys(expandedProblems).forEach((problemId) => {
                      if (expandedProblems[problemId]) {
                        getTasksByProblem(problemId);
                      }
                    });
                    getAllProblems();
                  }}
                  disabled={loading}
                  className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all flex items-center gap-1.5 text-[10px] font-bold disabled:opacity-50"
                  title="Refresh all tasks to see latest updates"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh
                </button>
              </div>

              {/* Highlight Section: Tasks Awaiting Review */}
              {tasks?.filter((t) => t.status === "IN_REVIEW").length > 0 && (
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-4">
                  <h3 className="text-sm font-bold text-cyan-400 mb-3">
                    🔍 Tasks Awaiting Review (
                    {tasks?.filter((t) => t.status === "IN_REVIEW").length})
                  </h3>
                  <div className="space-y-2">
                    {tasks
                      ?.filter((t) => t.status === "IN_REVIEW")
                      .map((task) => (
                        <div
                          key={task._id}
                          className="bg-slate-800/40 p-3 rounded-lg flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <p className="text-xs font-bold text-slate-200">
                              {task.title}
                            </p>
                            {task.githubPRUrl && (
                              <a
                                href={task.githubPRUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-cyan-400 hover:underline"
                              >
                                View PR →
                              </a>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRejectPR(task._id)}
                              disabled={loading}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded border border-red-500/30 transition-all"
                              title="Reject PR"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleApprovePR(task._id)}
                              disabled={loading}
                              className="px-3 py-1 text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded font-bold flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {allProblems?.map((problem) => (
                <div
                  key={problem._id}
                  className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden transition-all shadow-md"
                >
                  <button
                    onClick={() => handleExpandProblem(problem._id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg transition-colors ${expandedProblems[problem._id] ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700 text-slate-400"}`}
                      >
                        {expandedProblems[problem._id] ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                      <div className="text-left">
                        <h3 className="text-slate-100 font-bold text-lg">
                          {problem.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-medium">
                          <span>{problem.tasks?.length || 0} Total Tasks</span>
                          {problem.status && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                              <span className="uppercase tracking-wider">
                                {problem.status}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedProblems[problem._id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5 pt-2 border-t border-slate-700/50 bg-slate-900/30"
                      >
                        <div className="space-y-3 mt-3">
                          {loading && !tasks?.length && (
                            <div className="text-emerald-400 text-sm p-4 animate-pulse">
                              Loading tasks...
                            </div>
                          )}

                          {tasks?.length > 0 ? (
                            tasks.map((task) =>
                              editingTask === task._id ? (
                                <form
                                  key={task._id}
                                  onSubmit={(e) => handleEditTask(e, task._id)}
                                  className="bg-slate-800 border border-emerald-500/50 rounded-xl p-4 transition-all shadow-sm space-y-3 mb-3"
                                >
                                  <div className="flex gap-4">
                                    <input
                                      type="text"
                                      value={editForm.title}
                                      onChange={(e) =>
                                        setEditForm({
                                          ...editForm,
                                          title: e.target.value,
                                        })
                                      }
                                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-emerald-500/50"
                                      placeholder="Task Title"
                                    />
                                    <select
                                      value={editForm.difficulty}
                                      onChange={(e) =>
                                        setEditForm({
                                          ...editForm,
                                          difficulty: e.target.value,
                                        })
                                      }
                                      className="w-32 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-emerald-500/50"
                                    >
                                      <option value="EASY">EASY</option>
                                      <option value="MEDIUM">MEDIUM</option>
                                      <option value="HARD">HARD</option>
                                    </select>
                                  </div>
                                  <textarea
                                    value={editForm.description}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        description: e.target.value,
                                      })
                                    }
                                    rows="2"
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-emerald-500/50 resize-none"
                                    placeholder="Task Description"
                                  ></textarea>
                                  <div className="flex justify-end gap-2 mt-2">
                                    <button
                                      type="button"
                                      onClick={() => setEditingTask(null)}
                                      disabled={loading}
                                      className="px-3 py-1.5 text-xs font-bold text-slate-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="submit"
                                      disabled={loading}
                                      className="px-3 py-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-all"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </form>
                              ) : (
                                <motion.div
                                  key={task._id}
                                  whileHover={{ scale: 1.01 }}
                                  className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl p-4 transition-all shadow-sm mb-3"
                                >
                                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-slate-100 font-bold text-base">
                                          {task.title}
                                        </h4>
                                        <span
                                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                            task.difficulty === "HARD"
                                              ? "text-red-400 border-red-500/30"
                                              : task.difficulty === "MEDIUM"
                                                ? "text-amber-400 border-amber-500/30"
                                                : "text-emerald-400 border-emerald-500/30"
                                          }`}
                                        >
                                          {task.difficulty || "EASY"}
                                        </span>
                                      </div>

                                      {task.description && (
                                        <p className="text-slate-400 text-sm line-clamp-2">
                                          {task.description}
                                        </p>
                                      )}

                                      {task.githubPRUrl && (
                                        <div className="mt-3 bg-slate-900/50 p-2 rounded-lg border border-slate-700 inline-block w-full text-xs">
                                          <span className="text-slate-500 font-semibold mr-2">
                                            PR Link:
                                          </span>
                                          <a
                                            href={task.githubPRUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-cyan-400 hover:text-cyan-300 hover:underline break-all"
                                          >
                                            {task.githubPRUrl}
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                      <span
                                        className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold border ${getStatusColor(
                                          task.status,
                                        )}`}
                                      >
                                        {task.status || "OPEN"}
                                      </span>
                                      <span className="text-[10px] text-slate-500 font-mono">
                                        {new Date(
                                          task.createdAt,
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between border-t border-slate-700/50 pt-3 mt-2">
                                    <div className="text-xs font-medium">
                                      {task.assignedTo ? (
                                        <div className="flex items-center gap-2 text-slate-300">
                                          <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px]">
                                            {task.assignedTo.name?.charAt(0) ||
                                              "U"}
                                          </div>
                                          {task.assignedTo.name}
                                        </div>
                                      ) : (
                                        <span className="text-slate-500 px-2 py-1 rounded bg-slate-900/50 border border-slate-700/50">
                                          Unassigned
                                        </span>
                                      )}
                                    </div>

                                    {/* Admin Actions */}
                                    {task.status !== "COMPLETED" &&
                                      task.status !== "CANCELLED" && (
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => {
                                              setEditingTask(task._id);
                                              setEditForm({
                                                title: task.title,
                                                description: task.description,
                                                difficulty: task.difficulty,
                                              });
                                            }}
                                            className="py-1.5 px-2 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                                            title="Edit Task"
                                          >
                                            <Edit className="w-3.5 h-3.5" />{" "}
                                            Edit
                                          </button>
                                          {task.status === "IN_REVIEW" && (
                                            <>
                                              <button
                                                onClick={() =>
                                                  handleRejectPR(task._id)
                                                }
                                                disabled={loading}
                                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all font-bold"
                                                title="Reject Pull Request - Task will be reopened"
                                              >
                                                <XCircle className="w-5 h-5" />
                                              </button>
                                              <button
                                                onClick={() =>
                                                  handleApprovePR(task._id)
                                                }
                                                disabled={loading}
                                                className="py-2 px-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 hover:border-emerald-500/70 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:shadow-emerald-500/30"
                                              >
                                                <CheckCircle className="w-4 h-4" />
                                                Approve
                                              </button>
                                            </>
                                          )}

                                          {task.assignedTo &&
                                            task.status !== "IN_REVIEW" && (
                                              <button
                                                onClick={() =>
                                                  handleUnassignTask(task._id)
                                                }
                                                disabled={loading}
                                                className="py-1.5 px-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 hover:border-amber-500/40 rounded-lg text-[10px] uppercase font-bold transition-all flex items-center gap-1"
                                                title="Unassign Developer"
                                              >
                                                <UserMinus className="w-3 h-3" />{" "}
                                                Remove
                                              </button>
                                            )}
                                        </div>
                                      )}
                                  </div>
                                </motion.div>
                              ),
                            )
                          ) : !loading ? (
                            <div className="text-center py-8 text-sm text-slate-500 border border-dashed border-slate-700 rounded-xl bg-slate-800/30">
                              No tasks created for this problem yet
                            </div>
                          ) : null}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {allProblems?.length === 0 && (
                <div className="text-center py-12 text-sm text-slate-400 border border-dashed border-slate-700 rounded-xl bg-slate-800/30">
                  <p className="mb-2">No problems found</p>
                  <p className="text-xs">
                    Create a problem first in the Problems section
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ManageTasks;
