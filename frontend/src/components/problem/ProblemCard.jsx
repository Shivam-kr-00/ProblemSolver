import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Users, Briefcase, ChevronUp, ArrowRight, Tag } from "lucide-react";

const ProblemCard = ({ problem }) => {
  const navigate = useNavigate();

  const statusColors = {
    OPEN: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    IN_PROGRESS: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    SOLVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    ARCHIVED: "bg-slate-500/10 text-slate-400 border-slate-500/30",
  };

  const getStatusColor = (status) => {
    if (!status) return statusColors.OPEN;
    return statusColors[status.toUpperCase()] || statusColors.OPEN;
  };

  const handleCardClick = () => {
    navigate(`/problems/${problem._id}`);
  };

  return (
    <motion.button
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className="w-full text-left group bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden relative shadow-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10 transition" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header: Title & Status */}
        <div className="flex items-start justify-between mb-2 gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-slate-100 line-clamp-2 group-hover:text-emerald-400 transition-colors">
              {problem.title}
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusColor(problem.status)}`}
          >
            {problem.status || "OPEN"}
          </span>
        </div>

        {/* Category & Region */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">
          <span className="text-emerald-400">
            {problem.category || "General"}
          </span>
          <span>•</span>
          <span>{problem.region || "Global"}</span>
        </div>

        {/* Description */}
        <p className="text-slate-300 text-sm mb-4 line-clamp-2 flex-grow">
          {problem.description}
        </p>

        {/* Tags */}
        {problem.tags && problem.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Tag className="w-3 h-3 text-slate-500" />
            {problem.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-md border border-slate-700"
              >
                {tag}
              </span>
            ))}
            {problem.tags.length > 3 && (
              <span className="text-xs text-slate-500">
                +{problem.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer: Stats & Action */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 mt-auto">
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
              title="Upvotes"
            >
              <ChevronUp className="w-4 h-4" />
              <span className="font-medium">{problem.upvotes || 0}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Contributors">
              <Users className="w-4 h-4" />
              <span>{problem.contributors?.length || 0}</span>
            </div>
          </div>

          <div
            className="inline-flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 px-4 py-2 rounded-lg text-sm font-semibold transition group/link border border-emerald-500/20 hover:border-emerald-500/40"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            Solve
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default ProblemCard;
