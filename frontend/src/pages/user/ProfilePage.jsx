import { useEffect } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "../../store/useUserStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import Navbar from "../../components/layout/Navbar.jsx";
import {
  User,
  Mail,
  TrendingUp,
  CheckCircle,
  Edit2,
  Github,
  Upload,
  Star,
} from "lucide-react";
import { useState } from "react";

const ProfilePage = () => {
  const { userProfile, getMyProfile, updateMyProfile, loading } =
    useUserStore();
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    bio: userProfile?.bio || "",
    githubUsername: userProfile?.githubUsername || "",
    profileImageUrl: userProfile?.profileImageUrl || "",
  });
  const [imagePreview, setImagePreview] = useState(
    userProfile?.profileImageUrl || "",
  );

  useEffect(() => {
    getMyProfile();
  }, [getMyProfile]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        bio: userProfile.bio || "",
        githubUsername: userProfile.githubUsername || "",
        profileImageUrl: userProfile.profileImageUrl || "",
      });
      setImagePreview(userProfile.profileImageUrl || "");
    }
  }, [userProfile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, profileImageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    await updateMyProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Card */}
          <div className="bg-white/5 backdrop-blur-md border border-emerald-500/20 rounded-xl p-8 hover:border-emerald-500/40 transition">
            <div className="flex items-start justify-between gap-6 mb-6">
              {isEditing ? (
                <div className="relative">
                  <img
                    src={imagePreview || "https://via.placeholder.com/80"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <label className="absolute bottom-0 right-0 p-1 bg-emerald-500 rounded-full cursor-pointer hover:bg-emerald-600 transition">
                    <Upload className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white">
                  {userProfile?.name}
                </h1>
                <p className="text-emerald-200 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {userProfile?.email}
                </p>
                {userProfile?.githubUsername && (
                  <a
                    href={`https://github.com/${userProfile.githubUsername.replace("https://github.com/", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 mt-1 text-sm"
                  >
                    <Github className="w-4 h-4" />
                    {userProfile.githubUsername.replace("https://github.com/", "")}
                  </a>
                )}
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 hover:bg-emerald-500/10 rounded-lg transition"
              >
                <Edit2 className="w-5 h-5 text-emerald-400" />
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4 mt-6 pt-6 border-t border-emerald-500/20">
                <div>
                  <label className="block text-sm font-semibold text-emerald-100 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/10 backdrop-blur-md border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-emerald-100 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows="4"
                    className="w-full px-4 py-2 bg-white/10 backdrop-blur-md border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-400 transition resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-emerald-100 mb-2">
                    GitHub Username
                  </label>
                  <div className="flex items-center gap-2">
                    <Github className="w-5 h-5 text-emerald-400" />
                    <input
                      type="text"
                      value={formData.githubUsername}
                      onChange={(e) =>
                        setFormData({ ...formData, githubUsername: e.target.value })
                      }
                      placeholder="yourusername"
                      className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-md border border-emerald-500/30 rounded-lg text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 transition"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition disabled:opacity-50"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2 px-4 border border-emerald-500/30 text-emerald-300 rounded-lg hover:bg-emerald-500/10 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              userProfile?.bio && (
                <p className="text-emerald-200 mt-4">{userProfile.bio}</p>
              )
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                icon: Star,
                label: "Reputation",
                value: userProfile?.reputation || 0,
              },
              {
                icon: TrendingUp,
                label: "Total Contributions",
                value: userProfile?.totalContributions || 0,
              },
              {
                icon: CheckCircle,
                label: "Tasks Completed",
                value: userProfile?.tasksCompleted || 0,
              },
              {
                icon: User,
                label: "Problems Created",
                value: userProfile?.problemsCreated || 0,
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-md border border-emerald-500/20 rounded-lg p-4 text-center"
                >
                  <Icon className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs text-emerald-200 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
