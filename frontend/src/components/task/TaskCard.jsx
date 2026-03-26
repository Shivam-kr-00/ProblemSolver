import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Circle,
  Loader as LoaderIcon,
  Target,
  Github,
  Send,
  Lock,
  Badge,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useTaskStore } from "../../store/useTaskStore.js";

const TaskCard = ({ task, onStatusChange, onAssign, problem }) => {
  const [prUrl, setPrUrl] = useState("");
  const [showPrInput, setShowPrInput] = useState(false);
  const { user } = useAuthStore();
  const { submitPR, claimTask, startTask, loading } = useTaskStore();

  const statusIcons = {
    OPEN: <Circle className="w-5 h-5 text-slate-400" />,
    ASSIGNED: <Target className="w-5 h-5 text-amber-500" />,
    IN_PROGRESS: (
      <LoaderIcon className="w-5 h-5 text-yellow-500 animate-spin" />
    ),
    IN_REVIEW: <Github className="w-5 h-5 text-purple-400" />,
    COMPLETED: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    REOPENED: <Circle className="w-5 h-5 text-red-500" />,
  };

  const statusColors = {
    OPEN: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    ASSIGNED: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    IN_PROGRESS: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    IN_REVIEW: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    REOPENED: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  const difficultyColors = {
    EASY: "text-green-400 bg-green-400/10 border-green-400/20",
    MEDIUM: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    HARD: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  const status = task.status || "OPEN";
  const difficulty = task.difficulty || "MEDIUM";
  const isAssignee =
    task.assignedTo &&
    (task.assignedTo._id === user?._id || task.assignedTo === user?._id);
  const isAlreadyClaimed = !!task.assignedTo;

  const handlePrSubmit = async () => {
    if (!prUrl) return;
    await submitPR(task._id, prUrl);
    setShowPrInput(false);
    setPrUrl("");
  };

  const getClaimButtonState = () => {
    if (isAlreadyClaimed && !isAssignee) {
      return {
        disabled: true,
        label: "Already Claimed",
        icon: Lock,
        color: "bg-slate-600 text-slate-400 cursor-not-allowed",
      };
    }
    return {
      disabled: false,
      label: "Claim Task",
      icon: Target,
      color: "bg-emerald-500 hover:bg-emerald-600 text-white",
    };
  };

  const claimState = getClaimButtonState();
  const ClaimIcon = claimState.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="group bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/40 transition-all duration-300 shadow-sm"
    >
      <div className="flex items-start justify-between mb-3 gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="mt-0.5">
            {statusIcons[status] || statusIcons.OPEN}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h4 className="text-lg font-bold text-slate-100 leading-tight">
                {task.title}
              </h4>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border uppercase ${
                  difficultyColors[difficulty]
                }`}
              >
                {difficulty}
              </span>
              {problem?.repositoryUrl && (
                <a
                  href={problem.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border uppercase bg-slate-700/50 text-slate-200 border-slate-600 hover:bg-slate-600 hover:border-slate-500 transition"
                  title="Access problem repository"
                >
                  <Github className="w-3 h-3" />
                  Repo
                </a>
              )}
              {isAssignee && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border uppercase bg-emerald-500/10 text-emerald-400 border-emerald-500/30 flex items-center gap-1">
                  <Badge className="w-3 h-3" />
                  Your Task
                </span>
              )}
            </div>
            <p className="text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {task.githubIssueUrl && (
                <a
                  href={task.githubIssueUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1 rounded transition"
                >
                  <Github className="w-4 h-4" /> Issue Link
                </a>
              )}
              {task.repositoryUrl && (
                <a
                  href={task.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1 rounded transition"
                >
                  <Github className="w-4 h-4" /> Repository Link
                </a>
              )}
              {task.githubPRUrl && (
                <a
                  href={task.githubPRUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-purple-400 border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1 rounded transition"
                >
                  <Github className="w-4 h-4" /> View PR
                </a>
              )}
              {isAssignee && problem?.repositoryUrl && (
                <a
                  href={problem.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-amber-400 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1 rounded transition font-semibold"
                >
                  <Github className="w-4 h-4" /> Open Repo
                </a>
              )}
            </div>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${
            statusColors[status] || statusColors.OPEN
          }`}
        >
          {status.replace("_", " ")}
        </span>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          {task.assignedTo ? (
            <div className="flex items-center gap-2 bg-slate-900/50 px-2.5 py-1.5 rounded border border-slate-700">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs border border-emerald-500/30">
                {task.assignedTo.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <span className="text-slate-300">
                {task.assignedTo.name || "Assigned"}
              </span>
            </div>
          ) : (
            <span className="text-slate-500 italic bg-slate-900/50 px-2.5 py-1.5 rounded border border-dashed border-slate-700">
              Unassigned
            </span>
          )}

          {task.deadline && (
            <div className="flex items-center gap-1 bg-slate-900/50 px-2.5 py-1.5 rounded border border-slate-700">
              <Target className="w-3.5 h-3.5 text-slate-400" />
              <span>{new Date(task.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {status === "OPEN" && user && (
            <button
              onClick={() => claimTask(task._id)}
              disabled={claimState.disabled || loading}
              title={
                claimState.disabled
                  ? "This task is already claimed by another user"
                  : "Claim this task"
              }
              className={`px-4 py-1.5 rounded text-sm transition shadow-lg flex items-center gap-2 disabled:opacity-50 ${claimState.color}`}
            >
              <ClaimIcon className="w-4 h-4" />
              {claimState.label}
            </button>
          )}

          {status === "ASSIGNED" && isAssignee && !showPrInput && (
            <>
              {problem?.repositoryUrl && (
                <a
                  href={problem.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-sm transition shadow-lg flex items-center gap-2"
                  title="Access repository to solve the issue"
                >
                  <Github className="w-4 h-4" />
                  Open Repo
                </a>
              )}
              <button
                onClick={() => startTask(task._id)}
                disabled={loading}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-sm transition shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                <LoaderIcon className="w-4 h-4" /> Start Task
              </button>
            </>
          )}

          {status === "IN_PROGRESS" && isAssignee && !showPrInput && (
            <>
              {problem?.repositoryUrl && (
                <a
                  href={problem.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-sm transition shadow-lg flex items-center gap-2"
                  title="Access repository to solve the issue"
                >
                  <Github className="w-4 h-4" />
                  Open Repo
                </a>
              )}
              <button
                onClick={() => setShowPrInput(true)}
                className="px-4 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm transition shadow-lg flex items-center gap-2"
              >
                <Github className="w-4 h-4" /> Submit PR
              </button>
            </>
          )}

          {showPrInput && (
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={prUrl}
                onChange={(e) => setPrUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handlePrSubmit}
                disabled={loading || !prUrl}
                className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowPrInput(false)}
                className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
