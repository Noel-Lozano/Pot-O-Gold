import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Zap, Target, TrendingUp, Book, Wallet, 
  Star, Award, Flame, ChevronRight, Lock, Check,
  DollarSign, PiggyBank, LineChart, Users, Gift
} from 'lucide-react';
import leprechaun from '../assets/leprechaun.jpg';

/** ----- Seed missions (used to init state) ----- */
const INITIAL_MISSIONS = [
  {
    id: 1,
    title: "Save $50 This Week",
    description: "Track your spending and save at least $50",
    xp: 150,
    difficulty: "Easy",
    progress: 100,
    icon: PiggyBank,
    category: "Saving"
  },
  {
    id: 2,
    title: "Complete Investing 101",
    description: "Learn the basics of stock market investing",
    xp: 200,
    difficulty: "Medium",
    progress: 100,
    icon: LineChart,
    category: "Education"
  },
  {
    id: 3,
    title: "Build Emergency Fund",
    description: "Save 3 months of expenses",
    xp: 500,
    difficulty: "Hard",
    progress: 100,
    icon: Target,
    category: "Goal"
  }
];

/** ----- Helper: create a new “next week” mission with a real title ----- */
const TITLE_BANK = {
  Saving: [
    "Save $50 This Week",
    "No-Spend Weekend Challenge",
    "Round-Up Savings Sprint"
  ],
  Education: [
    "Complete Investing 201",
    "Budgeting Basics Quiz",
    "Credit Score Deep Dive"
  ],
  Goal: [
    "Emergency Fund Milestone",
    "Debt Snowball Step",
    "Big Purchase Planning"
  ]
};

function nextWeekMission(old) {
  const weekLabel = new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const pool = TITLE_BANK[old.category] || [old.title || "Weekly Mission"];

  // Stable-ish pick for the week so it doesn’t feel random every render
  const weekIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7)) % pool.length;
  const title = pool[weekIndex];

  const descByCategory = {
    Saving: "Track your spending and hit this week’s saving target.",
    Education: "Learn a new money skill with quick, interactive content.",
    Goal: "Make tangible progress toward your long-term goal."
  };
  const description = descByCategory[old.category] || "A fresh weekly challenge.";

  return {
    id: Date.now(), // simple unique id for demo
    title,          // ✅ guaranteed, themed name
    description: `${description} (Week of ${weekLabel})`,
    xp: old.xp,
    difficulty: old.difficulty,
    progress: 0,
    icon: old.icon,
    category: old.category
  };
}

/** ----- XP engine: add XP, handle level-ups, carryover, +500 cap per level ----- */
function applyXP(prevUser, gainedXP) {
  let xp = prevUser.xp + gainedXP;     // add incoming XP
  let level = prevUser.level;
  let cap = prevUser.xpToNext;          // current cap

  // loop in case we jump multiple levels at once
  while (xp >= cap) {
    xp -= cap;      // carryover remainder
    level += 1;     // level up!
    cap += 500;     // next level gets +500 cap
  }

  return { ...prevUser, xp, level, xpToNext: cap };
}

export default function FinQuestDashboard() {
  const [user, setUser] = useState({
    name: "Alex Rivera",
    level: 12,
    xp: 2450,
    xpToNext: 3000,
    streak: 7,
    balance: 1240.50,
    savingsGoal: 5000,
    currentSavings: 1850
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [completedMission, setCompletedMission] = useState(null);
  const [showReward, setShowReward] = useState(false);

  // missions in state + a separate completed list
  const [missions, setMissions] = useState(INITIAL_MISSIONS);
  const [completedMissions, setCompletedMissions] = useState([]);

  const achievements = [
    { id: 1, title: "First Steps", unlocked: true, icon: Star },
    { id: 2, title: "Savings Master", unlocked: true, icon: PiggyBank },
    { id: 3, title: "7-Day Streak", unlocked: true, icon: Flame },
    { id: 4, title: "Investment Guru", unlocked: false, icon: TrendingUp },
    { id: 5, title: "Budget Boss", unlocked: false, icon: Wallet },
    { id: 6, title: "Debt Slayer", unlocked: false, icon: Award }
  ];

  const recentActivity = [
    { action: "Completed mission", detail: "Daily Budget Check", xp: 50, time: "2h ago" },
    { action: "Achievement unlocked", detail: "7-Day Streak", xp: 100, time: "5h ago" },
    { action: "Level up", detail: "Reached Level 12", xp: 0, time: "1d ago" }
  ];

  // Reward UX + XP apply via engine
  const completeMission = (mission) => {
    setCompletedMission(mission);
    setShowReward(true);

    // apply XP with level-up/overflow logic
    setUser(prev => applyXP(prev, mission.xp));
    
    setTimeout(() => {
      setShowReward(false);
      setCompletedMission(null);
    }, 3000);
  };

  // guarded claim handler – only works at 100%
  function claimMission(mission) {
    if (mission.progress < 100) return;

    // show reward + add XP (which may level up)
    completeMission(mission);

    // move to completed list and replace with next week mission
    setMissions(prev => {
      const remaining = prev.filter(m => m.id !== mission.id);
      return [...remaining, nextWeekMission(mission)];
    });
    setCompletedMissions(prev => [
      { ...mission, completedAt: new Date().toISOString() },
      ...prev
    ]);
  }

  const xpPercentage = (user.xp / user.xpToNext) * 100;
  const savingsPercentage = (user.currentSavings / user.savingsGoal) * 100;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-900 to-emerald-950 text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <motion.header 
        className="relative border-b border-white/10 backdrop-blur-lg bg-white/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 rounded-xl overflow-hidden"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <img src={leprechaun} alt="Leprechaun" className="w-full h-full object-cover" />
              </motion.div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Pot O' Gold
              </h1>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="font-bold">{user.streak} Day Streak</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-300">{user.name}</p>
                  <p className="text-xs text-gray-400">Level {user.level}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* XP Progress Bar */}
        <motion.div 
          className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-400" />
              <span className="text-lg font-semibold">Level {user.level}</span>
            </div>
            <span className="text-sm text-gray-300">{user.xp} / {user.xpToNext} XP</span>
          </div>
          <div className="relative h-4 bg-black/30 rounded-full overflow-hidden">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Stats & Goals */}
          <div className="lg:col-span-1 space-y-6">
            {/* Balance Card */}
            <motion.div 
              className="bg-gradient-to-br from-yellow-600 to-green-600 rounded-2xl p-6 border border-white/20 shadow-2xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-4 text-yellow-200">
                <Wallet className="w-5 h-5" />
                <span className="text-sm font-medium">Total Balance</span>
              </div>
              <p className="text-4xl font-bold mb-2">${user.balance.toFixed(2)}</p>
              <div className="flex items-center gap-2 text-green-300">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+12.5% this month</span>
              </div>
            </motion.div>

            {/* Savings Goal */}
            <motion.div 
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  <span className="font-semibold">Savings Goal</span>
                </div>
                <span className="text-sm text-gray-300">{((user.currentSavings / user.savingsGoal) * 100).toFixed(0)}%</span>
              </div>
              <p className="text-2xl font-bold mb-2">${user.currentSavings}</p>
              <p className="text-sm text-gray-400 mb-4">of ${user.savingsGoal} goal</p>
              <div className="relative h-3 bg-black/30 rounded-full overflow-hidden">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(user.currentSavings / user.savingsGoal) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </motion.div>

            {/* Achievements Preview */}
            <motion.div 
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">Achievements</span>
                </div>
                <span className="text-sm text-gray-300">3/6</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 1, title: "First Steps", unlocked: true, icon: Star },
                  { id: 2, title: "Savings Master", unlocked: true, icon: PiggyBank },
                  { id: 3, title: "7-Day Streak", unlocked: true, icon: Flame },
                  { id: 4, title: "Investment Guru", unlocked: false, icon: TrendingUp },
                  { id: 5, title: "Budget Boss", unlocked: false, icon: Wallet },
                  { id: 6, title: "Debt Slayer", unlocked: false, icon: Award }
                ].map((achievement, idx) => (
                  <motion.div
                    key={achievement.id}
                    className={`aspect-square rounded-xl flex items-center justify-center ${
                      achievement.unlocked ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-black/30'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {achievement.unlocked ? (
                      <achievement.icon className="w-6 h-6 text-white" />
                    ) : (
                      <Lock className="w-6 h-6 text-gray-500" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Middle Column - Active Missions */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-400" />
                Active Missions
              </h2>
              
              <div className="space-y-4">
                {missions.map((mission, idx) => {
                  const isComplete = mission.progress >= 100;

                  return (
                    <motion.div
                      key={mission.id}
                      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-400 transition-colors cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <mission.icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{mission.title}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                mission.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                                mission.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-red-500/20 text-red-300'
                              }`}>
                                {mission.difficulty}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mb-3">{mission.description}</p>
                            
                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-gray-400">Progress</span>
                                  <span className="text-gray-300">{mission.progress}%</span>
                                </div>
                                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(mission.progress, 100)}%` }}
                                    transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-yellow-400 font-semibold">
                                <Zap className="w-4 h-4" />
                                <span>{mission.xp} XP</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <motion.button
                          className={`ml-4 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg
                            ${isComplete ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gray-500 cursor-not-allowed"}`}
                          whileHover={isComplete ? { scale: 1.05 } : undefined}
                          whileTap={isComplete ? { scale: 0.95 } : undefined}
                          disabled={!isComplete}
                          onClick={() => isComplete && claimMission(mission)}
                        >
                          {isComplete ? "Claim" : "Continue"}
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Completed Missions preview (simple) */}
            {completedMissions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Check className="w-6 h-6 text-green-400" />
                  Completed Missions
                </h2>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <ul className="space-y-3">
                    {completedMissions.map((m) => (
                      <li key={m.id} className="flex items-center justify-between">
                        <span className="text-sm">{m.title}</span>
                        <span className="text-yellow-300 font-semibold flex items-center gap-1">
                          <Zap className="w-4 h-4" /> +{m.xp} XP
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                Recent Activity
              </h2>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="space-y-4">
                  {recentActivity.map((activity, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + idx * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-400">{activity.detail}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.xp > 0 && (
                          <p className="text-yellow-400 font-semibold">+{activity.xp} XP</p>
                        )}
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Reward Animation */}
      <AnimatePresence>
        {showReward && completedMission && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 max-w-md text-center border-4 border-yellow-400 shadow-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
              >
                <Trophy className="w-12 h-12 text-white" />
              </motion.div>
              
              <h2 className="text-3xl font-bold mb-2">Mission Complete!</h2>
              <p className="text-xl mb-4">{completedMission.title}</p>
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-yellow-400">
                <Zap className="w-6 h-6" />
                <span>+{completedMission.xp} XP</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
