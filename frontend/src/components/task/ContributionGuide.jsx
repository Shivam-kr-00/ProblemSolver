import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Github,
  GitFork,
  Terminal,
  GitBranch,
  Code2,
  UploadCloud,
  GitPullRequest,
  Link2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const steps = [
  {
    icon: Target,
    title: "1. Claim a Task",
    description:
      "Browse available tasks within the problem. Click 'Claim Task' to assign it to yourself and move the status to 'In Progress'.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: Github,
    title: "2. Access the GitHub Repository",
    description:
      "Click the 'Repository Link' provided on the task or the main problem page to open the original codebase on GitHub.",
    color: "text-slate-300",
    bg: "bg-slate-700/30",
    border: "border-slate-600/50",
  },
  {
    icon: GitFork,
    title: "3. Fork the Repository",
    description:
      "Fork the original repository to your own GitHub account to create your personal copy of the project.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Terminal,
    title: "4. Clone the Repository",
    description:
      "Download the forked repository to your local system using Git. Example: git clone https://github.com/username/repo.git",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: GitBranch,
    title: "5. Create a Branch",
    description:
      "Create a new branch for the task before making any changes. Example: git checkout -b task-descriptive-name",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: Code2,
    title: "6. Implement the Solution",
    description:
      "Write your code to solve the assigned task locally. Ensure your changes align with the task requirements.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: UploadCloud,
    title: "7. Push Changes to GitHub",
    description:
      "Add, commit, and push your code to your forked repository. Example: git push origin task-descriptive-name",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  {
    icon: GitPullRequest,
    title: "8. Create a Pull Request",
    description:
      "On GitHub, create a Pull Request from your branch to the original repository with a description of your work.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  {
    icon: Link2,
    title: "9. Submit Pull Request Link",
    description:
      "Copy your PR link from GitHub and submit it to your active task on this platform for review.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
];

const ContributionGuide = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl relative overflow-hidden mt-8 mb-4">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500" />

      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-5 hover:bg-slate-800/20 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <Target className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              How to Contribute
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Follow these steps to claim your first task, make changes, and
              submit your solution.
            </p>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0 ml-4"
        >
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-emerald-400" />
          ) : (
            <ChevronDown className="w-6 h-6 text-slate-400" />
          )}
        </motion.div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-slate-700/50 px-6 py-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ y: -2 }}
                    className={`p-5 rounded-xl border ${step.bg} ${step.border} backdrop-blur-sm relative overflow-hidden group`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-[0.02] rounded-full -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-500" />

                    <div className="flex items-start gap-4 relative z-10">
                      <div
                        className={`mt-1 p-2 rounded-lg bg-slate-900/50 backdrop-blur flex justify-center items-center`}
                      >
                        <Icon className={`w-5 h-5 ${step.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-100 text-sm tracking-wide mb-1.5">
                          {step.title}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed State Hint */}
      {!isExpanded && (
        <div className="px-6 pb-3 text-xs text-slate-500">
          Click to expand contribution guide
        </div>
      )}
    </motion.div>
  );
};

export default ContributionGuide;
