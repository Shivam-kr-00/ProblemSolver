import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAdminStore } from "../../store/useAdminStore.js";
import Navbar from "../../components/layout/Navbar.jsx";
import {
  Users,
  Briefcase,
  AlertCircle,
  TrendingUp,
  Shield,
  Calendar,
  Activity,
  PieChart,
  BarChart3,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const {
    getAllProblems,
    getAllUsers,
    allProblems = [],
    allUsers = [],
    loading,
  } = useAdminStore();

  useEffect(() => {
    getAllProblems();
    getAllUsers();
  }, []);

  const stats = [
    {
      icon: Users,
      label: "Total Users",
      value: allUsers?.length || 0,
      color: "from-blue-500 to-cyan-600",
      textColor: "text-cyan-400"
    },
    {
      icon: Briefcase,
      label: "Total Problems",
      value: allProblems?.length || 0,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-400"
    },
    {
      icon: AlertCircle,
      label: "Open Issues",
      value: allProblems?.filter((p) => p.status !== "closed")?.length || 0,
      color: "from-orange-500 to-red-600",
      textColor: "text-orange-400"
    },
    {
      icon: TrendingUp,
      label: "Active Users",
      value: allUsers?.filter((u) => !u.isDeactivated)?.length || 0,
      color: "from-purple-500 to-pink-600",
      textColor: "text-purple-400"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl shadow-inner">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Admin Control Panel
                </h1>
                <p className="text-slate-400 text-lg">
                  System overview and platform management
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 shadow-md transition-all hover:shadow-lg hover:border-slate-600"
                >
                   <div className="flex items-start justify-between">
                     <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-semibold">{stat.label}</p>
                        <p className="text-3xl font-black text-slate-100">{stat.value}</p>
                     </div>
                     <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-inner`}>
                         <Icon className="w-6 h-6 text-white" />
                     </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Analytics Charts */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Problem Status Distribution */}
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-6">
                <PieChart className="w-5 h-5 text-cyan-400" />
                Problem Status Distribution
              </h2>
              <div className="space-y-4">
                {(() => {
                  const open = allProblems?.filter((p) => p.status === "open" || p.status === "OPEN")?.length || 0;
                  const inProgress = allProblems?.filter((p) => p.status === "in_progress" || p.status === "IN_PROGRESS")?.length || 0;
                  const closed = allProblems?.filter((p) => p.status === "closed" || p.status === "COMPLETED")?.length || 0;
                  const total = allProblems?.length || 1;

                  const stats = [
                    { label: "Open", value: open, color: "bg-blue-500", percentage: ((open / total) * 100).toFixed(1) },
                    { label: "In Progress", value: inProgress, color: "bg-yellow-500", percentage: ((inProgress / total) * 100).toFixed(1) },
                    { label: "Completed", value: closed, color: "bg-emerald-500", percentage: ((closed / total) * 100).toFixed(1) },
                  ];

                  return stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-300 font-semibold">{stat.label}</span>
                        <span className="text-slate-400 text-sm">{stat.value} ({stat.percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-900 border border-slate-700 rounded-full h-2 overflow-hidden">
                        <div className={`${stat.color} h-2 rounded-full transition-all`} style={{ width: `${stat.percentage}%` }} />
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* User Roles Distribution */}
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 shadow-md">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                User Roles Distribution
              </h2>
              <div className="space-y-4">
                {(() => {
                  const admins = allUsers?.filter((u) => u.role === "ADMIN")?.length || 0;
                  const users = allUsers?.filter((u) => u.role !== "ADMIN")?.length || 0;
                  const total = allUsers?.length || 1;

                  const stats = [
                    { label: "Admin Users", value: admins, color: "bg-purple-500", percentage: ((admins / total) * 100).toFixed(1) },
                    { label: "Regular Users", value: users, color: "bg-emerald-500", percentage: ((users / total) * 100).toFixed(1) },
                  ];

                  return stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-300 font-semibold">{stat.label}</span>
                        <span className="text-slate-400 text-sm">{stat.value} ({stat.percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-900 border border-slate-700 rounded-full h-2 overflow-hidden">
                        <div className={`${stat.color} h-2 rounded-full transition-all`} style={{ width: `${stat.percentage}%` }} />
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </motion.div>

          {/* Quick Links & Lists Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Management Quick Links - span 1 */}
            <motion.div variants={itemVariants} className="space-y-4 lg:col-span-1">
              <Link to="/admin/users" className="group flex items-center p-4 bg-slate-800/60 border border-slate-700/50 hover:border-cyan-500/50 rounded-xl transition-all shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mr-4 group-hover:bg-cyan-500/20 transition-colors">
                  <Users className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">Manage Users</h3>
                  <p className="text-xs text-slate-400">View and modify user access</p>
                </div>
              </Link>

              <Link to="/admin/problems" className="group flex items-center p-4 bg-slate-800/60 border border-slate-700/50 hover:border-emerald-500/50 rounded-xl transition-all shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-4 group-hover:bg-emerald-500/20 transition-colors">
                  <Briefcase className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">Manage Problems</h3>
                  <p className="text-xs text-slate-400">Review marketplace issues</p>
                </div>
              </Link>
              
               <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">System Status</p>
                  <p className="text-emerald-400 font-bold flex items-center gap-2 mt-1 text-sm">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    All operational
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-slate-600" />
              </div>
            </motion.div>

            {/* Recent Problems & Users - span 2 */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-2">
              {/* Recent Problems */}
              <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-5 shadow-md flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-100 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" /> Recent Problems
                  </h2>
                  <Link to="/admin/problems" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold">
                    All →
                  </Link>
                </div>
                <div className="space-y-3 flex-1">
                  {loading ? (
                    <div className="animate-pulse space-y-3">
                       <div className="h-10 border border-slate-700/50 rounded bg-slate-800/50" />
                       <div className="h-10 border border-slate-700/50 rounded bg-slate-800/50" />
                    </div>
                  ) : allProblems?.length > 0 ? (
                    allProblems?.slice(0, 4).map((problem) => (
                      <div key={problem._id} className="flex flex-col justify-center p-3 bg-slate-800/60 border border-slate-700/50 rounded-lg hover:border-slate-600 transition">
                        <div className="flex justify-between items-start mb-1">
                           <p className="text-slate-100 font-semibold text-sm truncate max-w-[180px]">{problem.title}</p>
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                              problem.status === "closed" || problem.status === "COMPLETED" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" :
                              problem.status === "in_progress" || problem.status === "IN_PROGRESS" ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/10" :
                              "border-slate-600 text-slate-300 bg-slate-800"
                           }`}>
                             {problem.status || "OPEN"}
                           </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-sm text-slate-400">No problems yet</div>
                  )}
                </div>
              </div>

              {/* Recent Users */}
               <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl p-5 shadow-md flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-100 flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" /> Recent Users
                  </h2>
                  <Link to="/admin/users" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold">
                    All →
                  </Link>
                </div>
                <div className="space-y-3 flex-1">
                  {loading ? (
                     <div className="animate-pulse space-y-3">
                       <div className="h-10 border border-slate-700/50 rounded bg-slate-800/50" />
                       <div className="h-10 border border-slate-700/50 rounded bg-slate-800/50" />
                    </div>
                  ) : allUsers?.length > 0 ? (
                    allUsers?.slice(0, 4).map((u) => (
                      <div key={u._id} className="flex items-center justify-between p-3 bg-slate-800/60 border border-slate-700/50 rounded-lg hover:border-slate-600 transition">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-600">
                             {u.name.charAt(0)}
                           </div>
                           <div>
                             <p className="text-slate-100 font-semibold text-sm truncate max-w-[120px]">{u.name}</p>
                             <div className="flex items-center gap-1 text-[10px] text-slate-400">
                               <Star className="w-3 h-3 text-yellow-500" /> {u.reputation?.toLocaleString() || 0}
                             </div>
                           </div>
                         </div>
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 uppercase border ${
                            u.role === "ADMIN" ? "bg-purple-500/10 text-purple-400 border-purple-500/30" : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                         }`}>
                           <Shield className="w-3 h-3" />
                           {u.role}
                         </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-sm text-slate-400">No users yet</div>
                  )}
                </div>
              </div>

            </motion.div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
