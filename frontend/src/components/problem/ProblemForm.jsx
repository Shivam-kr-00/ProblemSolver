import { useState } from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

const ProblemForm = ({ onSubmit, loading = false, initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
    },
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-emerald-100 mb-2">
          Problem Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter problem title"
          className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-emerald-500/30 rounded-xl text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-emerald-100 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the problem in detail"
          rows="5"
          className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-emerald-500/30 rounded-xl text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition resize-none"
          required
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Problem"
        )}
      </motion.button>
    </form>
  );
};

export default ProblemForm;
