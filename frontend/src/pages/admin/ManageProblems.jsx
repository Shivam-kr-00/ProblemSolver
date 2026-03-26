import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAdminStore } from "../../store/useAdminStore.js";
import Navbar from "../../components/layout/Navbar.jsx";
import { Trash2, Link as LinkIcon, Briefcase, Loader } from "lucide-react";

const ManageProblems = () => {
  const {
    getAllProblems,
    allProblems = [],
    problemTasks = {},
    deleteProblem,
    loading,
  } = useAdminStore();

  useEffect(() => {
    getAllProblems();
  }, []);

  const handleDelete = async (problemId) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      await deleteProblem(problemId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4 border-b border-slate-700/50 pb-6">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Manage Problems
              </h1>
              <p className="text-slate-400">
                Total: {allProblems?.length} problems in the marketplace
              </p>
            </div>
          </div>

          {loading && allProblems?.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <Loader className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-2" />
                <p className="text-slate-400">Loading problems...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {allProblems?.map((problem) => {
                const tasks = problemTasks[problem._id] || [];
                const openTasks =
                  tasks.filter(
                    (t) => t.status === "OPEN" || t.status === "REOPENED",
                  )?.length || 0;
                const inProgressTasks =
                  tasks.filter(
                    (t) =>
                      t.status === "IN_PROGRESS" || t.status === "ASSIGNED",
                  )?.length || 0;
                const completedTasks =
                  tasks.filter((t) => t.status === "COMPLETED")?.length || 0;

                return (
                  <motion.div
                    key={problem._id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-emerald-500/40 rounded-xl p-6 transition-all shadow-md group"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <h3 className="text-xl font-bold text-slate-100">
                            {problem.title}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border uppercase shadow-sm ${
                              problem.status === "closed" ||
                              problem.status === "COMPLETED"
                                ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                                : problem.status === "in_progress" ||
                                    problem.status === "IN_PROGRESS"
                                  ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
                                  : "text-slate-300 bg-slate-800 border-slate-600"
                            }`}
                          >
                            {problem.status || "OPEN"}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-4 leading-relaxed line-clamp-2">
                          {problem.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 gap-y-2 text-xs font-medium text-slate-500 mb-4">
                          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded border border-slate-700">
                            <span className="text-slate-400">Created by:</span>
                            <span className="text-cyan-400 font-semibold">
                              {problem.createdBy?.name || "Unknown"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded border border-slate-700">
                            <span className="text-slate-400">Total Tasks:</span>
                            <span className="text-emerald-400 font-semibold">
                              {tasks.length}
                            </span>
                          </div>
                        </div>

                        {/* Task Status Summary */}
                        {tasks.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded px-3 py-2 text-center">
                              <p className="text-blue-400 text-xs font-semibold">
                                Open
                              </p>
                              <p className="text-blue-300 text-sm font-bold">
                                {openTasks}
                              </p>
                            </div>
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded px-3 py-2 text-center">
                              <p className="text-yellow-400 text-xs font-semibold">
                                In Progress
                              </p>
                              <p className="text-yellow-300 text-sm font-bold">
                                {inProgressTasks}
                              </p>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded px-3 py-2 text-center">
                              <p className="text-emerald-400 text-xs font-semibold">
                                Completed
                              </p>
                              <p className="text-emerald-300 text-sm font-bold">
                                {completedTasks}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Task List Preview */}
                        {tasks.length > 0 && (
                          <div className="mb-4 space-y-2">
                            <p className="text-xs text-slate-400 font-semibold uppercase">
                              Recent Tasks:
                            </p>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {tasks.slice(0, 3).map((task) => (
                                <div
                                  key={task._id}
                                  className="flex items-center justify-between bg-slate-900/50 px-3 py-2 rounded text-xs border border-slate-700/50"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-slate-300 font-medium truncate">
                                      {task.title}
                                    </p>
                                    <p className="text-slate-500 text-[10px]">
                                      {task.assignedTo
                                        ? `Assigned to ${task.assignedTo.name || "Unknown"}`
                                        : "Unassigned"}
                                    </p>
                                  </div>
                                  <span
                                    className={`px-2 py-0.5 rounded whitespace-nowrap font-semibold ${
                                      task.status === "COMPLETED"
                                        ? "bg-emerald-500/20 text-emerald-400"
                                        : task.status === "IN_PROGRESS" ||
                                            task.status === "ASSIGNED"
                                          ? "bg-yellow-500/20 text-yellow-400"
                                          : "bg-blue-500/20 text-blue-400"
                                    }`}
                                  >
                                    {task.status}
                                  </span>
                                </div>
                              ))}
                              {tasks.length > 3 && (
                                <p className="text-xs text-slate-500 italic text-center py-1">
                                  +{tasks.length - 3} more tasks
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {problem.repositoryUrl && (
                          <a
                            href={problem.repositoryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm mt-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-colors w-fit"
                          >
                            <LinkIcon className="w-4 h-4" />
                            Repository
                          </a>
                        )}
                      </div>
                      <div className="flex items-center md:items-start">
                        <button
                          onClick={() => handleDelete(problem._id)}
                          disabled={loading}
                          className="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/50 rounded-lg transition-all text-red-400 group-hover:shadow-[0_0_10px_rgba(239,68,68,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Problem"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ManageProblems;
