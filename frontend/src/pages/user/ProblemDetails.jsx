import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useProblemStore } from "../../store/useProblemStore.js";
import { useTaskStore } from "../../store/useTaskStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import Navbar from "../../components/layout/Navbar.jsx";
import TaskCard from "../../components/task/TaskCard.jsx";
import TaskForm from "../../components/task/TaskForm.jsx";
import ContributionGuide from "../../components/task/ContributionGuide.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ChatBox from "../../components/chat/ChatBox.jsx";
import {
  ArrowLeft,
  Users,
  Briefcase,
  Github,
  Plus,
  CheckCircle,
  Edit,
  Badge,
  MessageSquare,
} from "lucide-react";

const ProblemDetails = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    getProblemById,
    currentProblem,
    loading: problemLoading,
  } = useProblemStore();
  const {
    getTasksByProblem,
    tasks = [],
    createTask,
    loading: taskLoading,
  } = useTaskStore();
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    getProblemById(problemId);
    getTasksByProblem(problemId);
  }, [problemId]);

  const handleCreateTask = async (taskData) => {
    await createTask({ ...taskData, problemId });
    setShowTaskForm(false);
    getTasksByProblem(problemId);
  };

  if (problemLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin mb-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
            </div>
            <p className="text-emerald-200">Loading problem details...</p>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = currentProblem?.createdBy?._id === user?._id;
  const canCreateTask = isOwner || user?.role === "ADMIN";

  // Check if user has an assigned task in this problem
  const userAssignedTask = tasks?.find(
    (task) =>
      task.assignedTo &&
      (task.assignedTo._id === user?._id || task.assignedTo === user?._id),
  );

  // Chat is accessible to: assigned contributors, problem owner, and admins
  const canAccessChat = !!userAssignedTask || isOwner || user?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition py-2 px-1 -ml-1"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Marketplace
          </button>

          {/* Problem Info */}
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-8 space-y-6 shadow-lg">
            <div>
              <div className="flex items-start justify-between mb-4 gap-4">
                <div>
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
                    {currentProblem?.title}
                  </h1>
                  <p className="text-slate-300 text-lg">
                    {currentProblem?.description}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className="px-4 py-2 bg-slate-900 text-emerald-400 border border-slate-700 rounded-lg text-sm font-semibold whitespace-nowrap uppercase tracking-wider">
                    {currentProblem?.status || "open"}
                  </span>
                  {user?.role === "ADMIN" && (
                    <button
                      onClick={() =>
                        navigate(`/admin/problems/${problemId}/edit`)
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 border border-blue-500/30 rounded-lg transition-colors text-sm font-semibold"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Problem
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                {currentProblem?.difficulty && (
                  <p className="text-sm text-slate-400">
                    <span className="font-semibold text-slate-300">
                      Difficulty:
                    </span>{" "}
                    {currentProblem.difficulty}
                  </p>
                )}
                {currentProblem?.category && (
                  <p className="text-sm text-slate-400">
                    <span className="font-semibold text-slate-300">
                      Category:
                    </span>{" "}
                    {currentProblem.category}
                  </p>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-700/50">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  Created By
                </p>
                <p className="text-emerald-400 font-semibold truncate">
                  {currentProblem?.createdBy?.name}
                </p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  Collaborators
                </p>
                <p className="text-emerald-400 font-semibold">
                  {currentProblem?.collaborators?.length || 0}
                </p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  Tasks
                </p>
                <p className="text-emerald-400 font-semibold">
                  {tasks?.length || 0}
                </p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 text-center">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  Upvotes
                </p>
                <p className="text-emerald-400 font-semibold">
                  {currentProblem?.upvotes || 0}
                </p>
              </div>
            </div>

            {currentProblem?.repositoryUrl && (
              <div className="pt-4 flex gap-3 items-start flex-wrap">
                <a
                  href={currentProblem.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition border border-slate-700 hover:border-emerald-500/50 font-semibold w-full sm:w-auto justify-center"
                >
                  <Github className="w-5 h-5" />
                  View Repository
                </a>
                {userAssignedTask && (
                  <div className="inline-flex items-center gap-2 px-4 py-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/30 font-semibold">
                    <Badge className="w-4 h-4" />
                    Your Task
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Collaborators */}
          {currentProblem?.collaborators?.length > 0 && (
            <div className="bg-white/5 backdrop-blur-md border border-emerald-500/20 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Collaborators
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentProblem.collaborators.map((collab) => (
                  <div
                    key={collab._id}
                    className="bg-white/5 border border-emerald-500/20 rounded-lg p-3 text-center"
                  >
                    <p className="text-white font-semibold text-sm">
                      {collab.name}
                    </p>
                    <p className="text-xs text-emerald-300">{collab.email}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contribution Guide */}
          <ContributionGuide />

          {/* Tasks Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-6 h-6" />
                Tasks ({tasks?.length || 0})
              </h2>
              {canCreateTask && (
                <button
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              )}
            </div>

            {showTaskForm && canCreateTask && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-md border border-emerald-500/20 rounded-lg p-6"
              >
                <TaskForm
                  onSubmit={handleCreateTask}
                  loading={taskLoading}
                  problemId={problemId}
                />
              </motion.div>
            )}

            <div className="space-y-3">
              {tasks?.length > 0 ? (
                tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    problem={currentProblem}
                  />
                ))
              ) : (
                <div className="bg-white/5 backdrop-blur-md border border-emerald-500/20 rounded-xl">
                  {canCreateTask ? (
                    <EmptyState
                      icon={Briefcase}
                      title="No Tasks Created Yet"
                      description="Divide this problem into tasks to collaborate effectively"
                      action={
                        <button
                          onClick={() => setShowTaskForm(true)}
                          className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition font-semibold"
                        >
                          <Plus className="w-4 h-4" />
                          Create First Task
                        </button>
                      }
                    />
                  ) : (
                    <EmptyState
                      icon={CheckCircle}
                      title="No Tasks Yet"
                      description="Wait for the problem owner to create tasks"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Chat Section */}
          {canAccessChat ? (
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-emerald-400" />
                Collaborator Chat
              </h2>
              <ChatBox problemId={problemId} />
            </div>
          ) : (
            <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-6 text-center">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">
                Chat is available to collaborators with an assigned task.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProblemDetails;
