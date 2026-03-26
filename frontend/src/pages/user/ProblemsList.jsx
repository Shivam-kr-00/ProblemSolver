import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useProblemStore } from "../../store/useProblemStore.js";
import Navbar from "../../components/layout/Navbar.jsx";
import ProblemCard from "../../components/problem/ProblemCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { CardSkeleton } from "../../components/common/LoadingSkeletons.jsx";
import { Search, AlertCircle } from "lucide-react";

const ProblemsList = () => {
  const { getAllProblems, problems = [], loading } = useProblemStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProblems, setFilteredProblems] = useState([]);

  useEffect(() => {
    getAllProblems();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProblems(problems);
    } else {
      setFilteredProblems(
        problems.filter(
          (p) =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    }
  }, [searchTerm, problems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
              Problem Marketplace
            </h1>
            <p className="text-slate-400 text-lg">
              Discover real-world software challenges, collaborate with teams, and build your portfolio.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>

          {/* Problems Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CardSkeleton count={6} />
            </div>
          ) : filteredProblems.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
              initial="hidden"
              animate="visible"
            >
              {filteredProblems.map((problem) => (
                <motion.div
                  key={problem._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <ProblemCard problem={problem} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="bg-white/5 backdrop-blur-md border border-emerald-500/20 rounded-xl">
              {searchTerm ? (
                <EmptyState
                  icon={AlertCircle}
                  title="No Problems Found"
                  description={`No problems match "${searchTerm}"`}
                  action={
                    <button
                      onClick={() => setSearchTerm("")}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition font-semibold"
                    >
                      Clear Search
                    </button>
                  }
                />
              ) : (
                <EmptyState
                  icon={AlertCircle}
                  title="No Problems Available"
                  description="Be the first to create a problem for the community"
                />
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProblemsList;
