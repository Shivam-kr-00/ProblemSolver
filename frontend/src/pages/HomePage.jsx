import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore.js";
import Navbar from "../components/layout/Navbar.jsx";
import {
  Zap,
  Code,
  Users,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  BookOpen,
  Terminal,
  Cpu,
} from "lucide-react";

const HomePage = () => {
  const { user, checkingAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkingAuth && !user) {
      navigate("/login");
    }
  }, [user, checkingAuth, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const features = [
    {
      icon: Terminal,
      title: "Create Problems",
      description: "Submit real-world software challenges to be solved by the community",
      link: "/create-problem",
      color: "from-emerald-500 to-teal-600",
      accent: "text-emerald-400"
    },
    {
      icon: Code,
      title: "Solve Problems",
      description: "Browse the marketplace and submit high-quality solutions",
      link: "/problems",
      color: "from-blue-500 to-cyan-600",
      accent: "text-cyan-400"
    },
    {
      icon: CheckCircle,
      title: "Track Submissions",
      description: "Manage your active tasks and review pull request statuses",
      link: "/tasks",
      color: "from-purple-500 to-pink-600",
      accent: "text-purple-400"
    },
    {
      icon: Users,
      title: "Developer Ranking",
      description: "Earn reputation and climb the global contributor leaderboard",
      link: "/leaderboard",
      color: "from-amber-500 to-orange-600",
      accent: "text-amber-400"
    },
  ];

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-800 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          <Cpu className="w-6 h-6 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 sm:py-24 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-24"
        >
          {/* Hero Section */}
          <motion.section
            variants={itemVariants}
            className="text-center space-y-8 relative"
          >
            <div className="inline-block relative">
               <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative inline-flex items-center gap-2 bg-slate-800/80 backdrop-blur-md border border-slate-700 hover:border-emerald-500/50 rounded-full px-5 py-2.5 transition-colors cursor-default shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 text-sm font-bold tracking-wide">
                  The Developer Collaboration Engine
                </span>
              </motion.div>
            </div>

            <div className="max-w-4xl mx-auto">
               <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6">
                 Build Together.{" "}
                 <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                   Solve Faster.
                 </span>
               </h1>
   
               <p className="text-lg sm:text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                 A decentralized ecosystem for open-source development. Turn complex problems into actionable tasks, collaborate globally, and build your engineering reputation.
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8 items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/problems"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-lg py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25"
                >
                  Explore Marketplace
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/create-problem"
                  className="inline-flex items-center gap-3 bg-slate-800/60 hover:bg-slate-700 text-white font-bold text-lg py-4 px-8 rounded-xl transition-all border border-slate-600 hover:border-slate-500 backdrop-blur-md"
                >
                   <Terminal className="w-5 h-5 text-slate-400" />
                  Post an Issue
                </Link>
              </motion.div>
            </div>
            
            {/* Terminal Mockup snippet */}
            <motion.div variants={itemVariants} className="mt-20 max-w-3xl mx-auto hidden md:block">
               <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700/50">
                  <div className="flex items-center px-4 py-3 bg-slate-800 border-b border-slate-700/50 gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                     <div className="ml-2 text-xs text-slate-400 font-mono">pf-cli run</div>
                  </div>
                  <div className="p-6 text-left font-mono text-sm leading-relaxed overflow-x-auto text-slate-300">
                     <span className="text-emerald-400">➜</span> <span className="text-blue-400">~/projects</span> pf get-issue --id=1983<br/>
                     <span className="text-slate-500">Fetching issue context...</span><br/><br/>
                     <span className="font-bold text-white">[HIGH PRIORITY] Implement Real-time Sync Engine</span><br/>
                     <span className="text-amber-400">Difficulty: HARD</span> | Bounty: 500 Rep<br/><br/>
                     <span className="text-cyan-400">✓</span> Repository cloned successfully<br/>
                     <span className="text-cyan-400">✓</span> Dev environment matched<br/>
                     <span className="text-emerald-400">➜</span> Ready to code. May the force be with you.
                  </div>
               </div>
            </motion.div>
          </motion.section>

          {/* Features Grid */}
          <motion.section variants={itemVariants} className="space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Designed for Engineering Teams
              </h2>
              <p className="text-slate-400 text-lg">
                Everything you need to ship features faster through structured collaboration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    className="relative group h-full"
                  >
                    <Link to={feature.link} className="block h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 group-hover:border-slate-600 rounded-2xl p-8 h-full transition-all duration-300 flex flex-col shadow-lg shadow-black/20">
                        <div
                          className={`w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-md ${feature.color}`}
                        >
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                          {feature.title}
                        </h3>
                        <p className="text-slate-400 leading-relaxed font-medium">
                          {feature.description}
                        </p>
                        
                        <div className="mt-auto pt-6 flex items-center font-bold text-sm tracking-wide">
                           <span className={feature.accent}>Explore</span>
                           <ArrowRight className={`w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 ${feature.accent}`} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Stats Section */}
          <motion.section
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 hover:border-cyan-500/30 transition-colors rounded-2xl p-10 text-center shadow-lg relative overflow-hidden group">
               <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full group-hover:bg-cyan-500/20 transition-colors"></div>
              <div className="text-5xl font-black text-cyan-400 mb-3 tracking-tighter">
                ~0ms
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Friction to Start</p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 hover:border-emerald-500/30 transition-colors rounded-2xl p-10 text-center shadow-lg relative overflow-hidden group">
               <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full group-hover:bg-emerald-500/20 transition-colors"></div>
              <div className="text-5xl font-black text-emerald-400 mb-3 tracking-tighter">
                10x
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Developer Velocity</p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 hover:border-purple-500/30 transition-colors rounded-2xl p-10 text-center shadow-lg relative overflow-hidden group">
               <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/10 blur-2xl rounded-full group-hover:bg-purple-500/20 transition-colors"></div>
              <div className="text-5xl font-black text-purple-400 mb-3 tracking-tighter">
                100%
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Open Source</p>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            variants={itemVariants}
            className="relative overflow-hidden border border-slate-700 rounded-3xl p-12 lg:p-20 text-center shadow-2xl"
          >
             <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 z-0"></div>
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-0"></div>
             
             {/* Glowing Orbs */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 z-0"></div>
             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 z-0"></div>
             
             <div className="relative z-10 max-w-3xl mx-auto">
               <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
                 Elevate Your Engineering Profile
               </h2>
               <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                 Join the growing network of developers solving real-world problems. Build your portfolio, earn reputation, and push the boundaries of software.
               </p>
               <div className="flex flex-col sm:flex-row gap-5 justify-center">
                 <Link
                   to="/problems"
                   className="inline-flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-200 font-bold text-lg py-4 px-10 rounded-xl transition-all shadow-xl"
                 >
                   <Code className="w-5 h-5" />
                   Start Contributing
                 </Link>
                 <Link
                   to="/dashboard"
                   className="inline-flex items-center justify-center gap-3 bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-600 backdrop-blur-md font-bold text-lg py-4 px-10 rounded-xl transition-all shadow-xl"
                 >
                   <Target className="w-5 h-5 text-emerald-400" />
                   Go to Dashboard
                 </Link>
               </div>
             </div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
};

export default HomePage;
