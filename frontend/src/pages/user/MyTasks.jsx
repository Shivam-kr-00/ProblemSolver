import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "../../store/useUserStore.js";
import { useProblemStore } from "../../store/useProblemStore.js";
import Navbar from "../../components/layout/Navbar.jsx";
import TaskCard from "../../components/task/TaskCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { ListSkeleton } from "../../components/common/LoadingSkeletons.jsx";
import {
  Briefcase,
  CheckCircle,
  Clock,
  AlertCircle,
  Github,
} from "lucide-react";
import { Link } from "react-router-dom";

const MyTasks = () => {
  const { getMyTasks, myTasks = [], loading } = useUserStore();
  const { problems = [] } = useProblemStore();
  const [taskDetails, setTaskDetails] = useState({});

  useEffect(() => {
    getMyTasks();
  }, [getMyTasks]);

  // Create a map of task details with problem info
  useEffect(() => {
    const enrichedTasks = {};
    myTasks.forEach((task) => {
      const problem = problems.find((p) => p._id === task.problemId);
      enrichedTasks[task._id] = {
        ...task,
        problemName: problem?.title || "Unknown Problem",
        problemLink: problem ? `/problems/${problem._id}` : null,
        problemRepoUrl: problem?.repositoryUrl || null,
      };
    });
    setTaskDetails(enrichedTasks);
  }, [myTasks, problems]);

  const groupedTasks = {
    OPEN: myTasks?.filter((t) => t.status === "OPEN" || !t.status) || [],
    ASSIGNED: myTasks?.filter((t) => t.status === "ASSIGNED") || [],
    IN_PROGRESS: myTasks?.filter((t) => t.status === "IN_PROGRESS") || [],
    IN_REVIEW: myTasks?.filter((t) => t.status === "IN_REVIEW") || [],
    COMPLETED: myTasks?.filter((t) => t.status === "COMPLETED") || [],
  };

  const stats = [
    {
      label: "Active Tasks",
      value:
        (groupedTasks.IN_PROGRESS?.length || 0) +
        (groupedTasks.ASSIGNED?.length || 0),
      icon: Clock,
      color: "text-yellow-400",
    },
    {
      label: "In Review",
      value: groupedTasks.IN_REVIEW?.length || 0,
      icon: Github,
      color: "text-purple-400",
    },
    {
      label: "Completed",
      value: groupedTasks.COMPLETED?.length || 0,
      icon: CheckCircle,
      color: "text-emerald-400",
    },
    {
      label: "Total Tasks",
      value: myTasks?.length || 0,
      icon: Briefcase,
      color: "text-cyan-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-emerald-400" />
              My Tasks
            </h1>
            <p className="text-slate-400 text-lg">
              Track your active contributions, pull requests, and completed
              tasks.
            </p>
          </div>

          {/* Stats Grid */}
          {!loading && myTasks?.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4 text-center"
                  >
                    <div className="flex justify-center mb-2">
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-slate-100">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Content */}
          {loading && myTasks?.length === 0 ? (
            <div className="space-y-8">
              {[...Array(2)].map((_, i) => (
                <div key={i}>
                  <div className="h-6 bg-slate-800 rounded w-1/3 mb-4 animate-pulse" />
                  <ListSkeleton count={2} />
                </div>
              ))}
            </div>
          ) : myTasks?.length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupedTasks).map(
                ([status, tasks]) =>
                  tasks.length > 0 && (
                    <motion.div
                      key={status}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-800/20 rounded-xl p-6 border border-slate-700/50 shadow-inner"
                    >
                      <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                        {status === "COMPLETED" && (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        )}
                        {status === "IN_PROGRESS" && (
                          <Clock className="w-5 h-5 text-yellow-500" />
                        )}
                        {status === "ASSIGNED" && (
                          <AlertCircle className="w-5 h-5 text-amber-400" />
                        )}
                        {status === "IN_REVIEW" && (
                          <Github className="w-5 h-5 text-purple-400" />
                        )}
                        <span className="bg-slate-800 px-3 py-1 rounded-md border border-slate-700 uppercase text-sm tracking-wider shadow-sm">
                          {status.replace("_", " ")} ({tasks.length})
                        </span>
                      </h2>
                      <div className="space-y-4">
                        {tasks.map((task) => {
                          const taskDetail = taskDetails[task._id];
                          return (
                            <motion.div
                              key={task._id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-all group"
                            >
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                {/* Task Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <h3 className="text-base font-bold text-slate-100">
                                      {task.title}
                                    </h3>
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                        task.difficulty === "HARD"
                                          ? "text-red-400 bg-red-400/10 border-red-500/30"
                                          : task.difficulty === "MEDIUM"
                                            ? "text-amber-400 bg-amber-400/10 border-amber-500/30"
                                            : "text-emerald-400 bg-emerald-400/10 border-emerald-500/30"
                                      }`}
                                    >
                                      {task.difficulty || "MEDIUM"}
                                    </span>
                                  </div>

                                  {/* Problem Link */}
                                  {taskDetail?.problemLink && (
                                    <Link
                                      to={taskDetail.problemLink}
                                      className="text-sm text-cyan-400 hover:text-cyan-300 mb-2 inline-block"
                                    >
                                      Problem: {taskDetail.problemName}
                                    </Link>
                                  )}

                                  {task.description && (
                                    <p className="text-sm text-slate-400 line-clamp-2 mb-2">
                                      {task.description}
                                    </p>
                                  )}

                                  {/* Links */}
                                  <div className="flex flex-wrap gap-2">
                                    {task.githubIssueUrl && (
                                      <a
                                        href={task.githubIssueUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-2 py-1 rounded"
                                      >
                                        Issue Link
                                      </a>
                                    )}
                                    {task.githubPRUrl && (
                                      <a
                                        href={task.githubPRUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 px-2 py-1 rounded"
                                      >
                                        PR Link
                                      </a>
                                    )}
                                    {task.repositoryUrl && (
                                      <a
                                        href={task.repositoryUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-2 py-1 rounded"
                                      >
                                        Repository
                                      </a>
                                    )}
                                    {taskDetail?.problemRepoUrl && (
                                      <a
                                        href={taskDetail.problemRepoUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2 py-1 rounded font-semibold"
                                      >
                                        Problem Repo
                                      </a>
                                    )}
                                  </div>
                                </div>

                                {/* Status & Stats */}
                                <div className="flex flex-col items-end justify-center gap-2 shrink-0">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                      status === "COMPLETED"
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                        : status === "IN_REVIEW"
                                          ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                                          : status === "IN_PROGRESS"
                                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                                            : status === "ASSIGNED"
                                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                              : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                    }`}
                                  >
                                    {status.replace("_", " ")}
                                  </span>
                                  {task.createdAt && (
                                    <span className="text-xs text-slate-500">
                                      {new Date(
                                        task.createdAt,
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ),
              )}
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-lg">
              <EmptyState
                icon={Briefcase}
                title="No Tasks Assigned Yet"
                description="Browse the marketplace to pick issues and start collaborating"
                action={
                  <Link
                    to="/problems"
                    className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition font-semibold shadow-lg shadow-emerald-500/20"
                  >
                    Explore Problems
                  </Link>
                }
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyTasks;
