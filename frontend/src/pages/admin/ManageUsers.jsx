import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAdminStore } from "../../store/useAdminStore.js";
import Navbar from "../../components/layout/Navbar.jsx";
import { Trash2, Shield, Ban, Users } from "lucide-react";

const ManageUsers = () => {
  const {
    getAllUsers,
    allUsers = [],
    deactivateUser,
    changeUserRole,
    loading,
  } = useAdminStore();

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    await changeUserRole(userId, newRole);
  };

  const handleDeactivate = async (userId) => {
    if (window.confirm("Are you sure you want to modify this user's active status?")) {
      await deactivateUser(userId);
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
            <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center">
               <Users className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                Manage Users
              </h1>
              <p className="text-slate-400">
                Total: {allUsers?.length} registered accounts
              </p>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-900/50 border-b border-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Developer
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Sys Role
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {allUsers?.map((user) => (
                    <motion.tr
                      key={user._id}
                      whileHover={{ backgroundColor: "rgba(30, 41, 59, 0.4)" }}
                      className="transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center font-bold text-slate-300">
                             {user.name.charAt(0)}
                           </div>
                           <div>
                             <p className="text-slate-100 font-bold">{user.name}</p>
                             <p className="text-slate-400 text-xs">{user.email}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className="px-3 py-1.5 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-300 text-sm font-semibold focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition cursor-pointer appearance-none shadow-inner"
                        >
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider inline-flex items-center gap-1 border ${
                            user.isDeactivated
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}
                        >
                          {user.isDeactivated ? "DEACTIVATED" : "ACTIVE"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDeactivate(user._id)}
                          disabled={loading}
                          className={`p-2.5 rounded-lg border transition-all ${
                             user.isDeactivated 
                               ? "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 hover:border-emerald-500/50 text-emerald-400" 
                               : "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20 hover:border-orange-500/50 text-orange-400"
                          }`}
                          title={user.isDeactivated ? "Reactivate User" : "Deactivate User"}
                        >
                          <Ban className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ManageUsers;
