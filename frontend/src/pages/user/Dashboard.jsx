import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/useAuthStore.js";
import { useUserStore } from "../../store/useUserStore.js";
import { useProblemStore } from "../../store/useProblemStore.js";
import Navbar from "../../components/layout/Navbar.jsx";
import {
  ArrowRight,
  Briefcase,
  Users,
  CheckCircle,
  TrendingUp,
  Star,
  Activity,
  Award
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const {
    getMyTasks,
    getMyContributions,
    myTasks = [],
  } = useUserStore();
  const { getAllProblems } = useProblemStore();
  const [taskFilter, setTaskFilter] = useState("all"); 

  useEffect(() => {
    getMyTasks();
    getMyContributions();
    getAllProblems();
  }, []); 

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const taskStats = {
    total: myTasks?.length || 0,
    completed: myTasks?.filter((t) => t.status === "COMPLETED")?.length || 0,
    inProgress: myTasks?.filter((t) => t.status === "IN_PROGRESS")?.length || 0,
  };

  const getFilteredTasks = () => {
    switch (taskFilter) {
      case "completed":
        return myTasks?.filter((t) => t.status === "COMPLETED") || [];
      case "in-progress":
        return myTasks?.filter((t) => t.status === "IN_PROGRESS") || [];
      default:
        return myTasks || [];
    }
  };

  const completionRate =
    taskStats.total > 0
      ? Math.round((taskStats.completed / taskStats.total) * 100)
      : 0;

  const filteredTasks = getFilteredTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Welcome Section */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div className="space-y-2">
               <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                 Welcome back, {user?.name?.split(" ")[0]}! 👋
               </h1>
               <p className="text-slate-400 text-lg">
                 Here's your personalized overview of problems and tasks
               </p>
             </div>
             <div className="flex gap-4">
                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex items-center gap-3 shadow-lg">
                   <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
                      <Star className="w-5 h-5 text-yellow-500" />
                   </div>
                   <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Reputation</p>
                      <p className="text-xl font-bold text-slate-100">{user?.reputation?.toLocaleString() || 0}</p>
                   </div>
                </div>
             </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              {
                icon: Activity,
                label: "Total Contributions",
                value: user?.totalContributions || 0,
                color: "blue",
              },
              {
                icon: Briefcase,
                label: "Total Tasks",
                value: taskStats.total,
                color: "emerald",
                onClick: () => navigate("/tasks"),
              },
              {
                icon: TrendingUp,
                label: "In Progress",
                value: taskStats.inProgress,
                color: "yellow",
                onClick: () => setTaskFilter("in-progress"),
              },
              {
                icon: CheckCircle,
                label: "Completed",
                value: taskStats.completed,
                color: "green",
                onClick: () => setTaskFilter("completed"),
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              const colorClasses = {
                emerald: "from-emerald-500 to-emerald-600 text-emerald-400",
                green: "from-green-500 to-green-600 text-green-400",
                yellow: "from-yellow-500 to-yellow-600 text-yellow-500",
                blue: "from-blue-500 to-cyan-600 text-cyan-400",
              };
              return (
                <motion.button
                  key={idx}
                  onClick={stat.onClick}
                  whileHover={{ y: -4 }}
                  className={`bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-5 transition-all text-left shadow-md hover:shadow-lg ${stat.onClick ? "cursor-pointer hover:border-emerald-500/40" : "cursor-default"}`}
                >
                  <div className="flex items-start justify-between">
                     <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">{stat.label}</p>
                        <p className="text-3xl font-black text-slate-100">{stat.value}</p>
                     </div>
                     <div className={`w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shadow-inner`}>
                         <Icon className={`w-5 h-5 ${colorClasses[stat.color].split(' ').pop()}`} />
                     </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 transition shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                 <Award className="w-5 h-5 text-emerald-400" />
                 Task Completion Rate
              </h3>
              <span className="text-2xl font-black text-emerald-400">
                {completionRate}%
              </span>
            </div>
            <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
              />
            </div>
          </motion.div>

          {/* Tasks Section with Filter Tabs */}
          <motion.div variants={itemVariants} className="space-y-6 pt-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-slate-100">Your Active Work</h2>
              <Link
                to="/tasks"
                className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold flex items-center gap-1 transition"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "all", label: "Total" },
                { value: "in-progress", label: "In Progress" },
                { value: "completed", label: "Completed" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setTaskFilter(tab.value)}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                    taskFilter === tab.value
                      ? "bg-slate-700 text-emerald-400 shadow-md border border-slate-600"
                      : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800 hover:text-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tasks List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.length > 0 ? (
                filteredTasks.slice(0, 6).map((task) => (
                  <motion.div
                    key={task._id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/40 transition-all shadow-md flex flex-col justify-between"
                  >
                    <div>
                        <div className="flex justify-between items-start mb-3">
                           <span
                             className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border uppercase ${
                               task.difficulty === "HARD" ? "text-red-400 bg-red-400/10 border-red-400/20" : 
                               task.difficulty === "EASY" ? "text-green-400 bg-green-400/10 border-green-400/20" : 
                               "text-orange-400 bg-orange-400/10 border-orange-400/20"
                             }`}
                           >
                             {task.difficulty || "MEDIUM"}
                           </span>
                           <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm border ${
                              task.status === "COMPLETED"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : task.status === "IN_PROGRESS"
                                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                                  : "bg-slate-800 text-slate-300 border-slate-600"
                            }`}
                          >
                            {task.status || "OPEN"}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-100 leading-tight mb-2 line-clamp-2">{task.title}</h4>
                        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-slate-800/40 border border-slate-700/50 rounded-xl shadow-inner">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                     <Briefcase className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-slate-300 font-semibold text-lg">No tasks found</p>
                  <p className="text-sm text-slate-500 mt-2">
                    {taskFilter === "all"
                      ? "Pick problems and create tasks to get started"
                      : `You have no ${taskFilter.replace("-", " ")} tasks at the moment`}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
          >
            <Link
              to="/create-problem"
              className="group relative overflow-hidden bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-xl p-6 transition-all shadow-md hover:shadow-emerald-500/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Briefcase className="w-8 h-8 mb-4 text-emerald-400 relative z-10" />
              <p className="text-xl font-bold text-slate-100 relative z-10 mb-1">Create New Problem</p>
              <p className="text-sm text-slate-400 relative z-10">
                Share a new architectural challenge with the community
              </p>
            </Link>
            <Link
              to="/problems"
              className="group relative overflow-hidden bg-slate-800 border border-slate-700 hover:border-cyan-500/50 rounded-xl p-6 transition-all shadow-md hover:shadow-cyan-500/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Users className="w-8 h-8 mb-4 text-cyan-400 relative z-10" />
              <p className="text-xl font-bold text-slate-100 relative z-10 mb-1">Browse Marketplace</p>
              <p className="text-sm text-slate-400 relative z-10">
                Find interesting technical issues to solve and earn reputation
              </p>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
