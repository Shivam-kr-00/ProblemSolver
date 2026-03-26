import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProblemStore } from "../../store/useProblemStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import Navbar from "../../components/layout/Navbar.jsx";
import ProblemForm from "../../components/problem/ProblemForm.jsx";
import { ArrowLeft } from "lucide-react";

const CreateProblem = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createProblem, loading } = useProblemStore();

  const handleSubmit = async (formData) => {
    const result = await createProblem(formData);
    if (result) {
      navigate("/problems");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Create New Problem
            </h1>
            <p className="text-emerald-200">
              Share a problem with the community
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-emerald-500/20 rounded-xl p-8">
            <ProblemForm onSubmit={handleSubmit} loading={loading} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateProblem;
