import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Zap, Target, TrendingUp, Book, Wallet,
  Star, Award, Flame, ChevronRight, Lock, Check,
  DollarSign, PiggyBank, LineChart, Users, Gift, Edit2, X
} from 'lucide-react';
import leprechun from '../assets/leprechaun.jpg';

// API Constants
const API_KEY = "787076b59b64a9f0732ca97ca6267bdf";
const PAT_ID = "68fd1a569683f20dd51a46c8";
const PAT_CHECKING = "68fd1cce9683f20dd51a46da";

export default function FinQuestDashboard() {
  const [user, setUser] = useState({
    name: "Alex Rivera",
    level: 12,
    xp: 2450,
    xpToNext: 3000,
    streak: 7,
    balance: 1240.50,
    savingsGoal: 5000,
    currentSavings: 1850,
    previousBalances: [
      { month: "Sep 2025", balance: 1150.00, change: 8.5 },
      { month: "Aug 2025", balance: 1060.00, change: 5.2 },
      { month: "Jul 2025", balance: 1007.50, change: -2.1 },
      { month: "Jun 2025", balance: 1029.20, change: 12.3 }
    ]
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [completedMission, setCompletedMission] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);
  const [tip, setTip] = useState("");
  const [loadingTip, setLoadingTip] = useState(false);
  
  // Edit state
  const [editingBalance, setEditingBalance] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [tempBalance, setTempBalance] = useState('');
  const [tempSavingsGoal, setTempSavingsGoal] = useState('');
  const [tempCurrentSavings, setTempCurrentSavings] = useState('');
  
  useEffect(() => {
    // Fetch account balance
    fetch(`http://api.nessieisreal.com/accounts/${PAT_CHECKING}?key=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
        setUser(currentUser => ({
          ...currentUser,
          balance: data.balance
        }));
      })
      .catch(error => console.error("Error fetching balance:", error));

    // Fetch all transaction types in parallel
    Promise.all([
      fetch(`http://api.nessieisreal.com/accounts/${PAT_CHECKING}/purchases?key=${API_KEY}`)
        .then(response => response.json())
        .catch(error => {
          console.error("Error fetching purchases:", error);
          return [];
        }),
      
      fetch(`http://api.nessieisreal.com/accounts/${PAT_CHECKING}/deposits?key=${API_KEY}`)
        .then(response => response.json())
        .catch(error => {
          console.error("Error fetching deposits:", error);
          return [];
        }),
      
      fetch(`http://api.nessieisreal.com/accounts/${PAT_CHECKING}/withdrawals?key=${API_KEY}`)
        .then(response => response.json())
        .catch(error => {
          console.error("Error fetching withdrawals:", error);
          return [];
        })
    ])
    .then(([purchases, deposits, withdrawals]) => {
      const typedPurchases = purchases.map(item => ({
        ...item,
        type: 'purchase'
      }));
      
      const typedDeposits = deposits.map(item => ({
        ...item,
        type: 'deposit'
      }));
      
      const typedWithdrawals = withdrawals.map(item => ({
        ...item,
        type: 'withdrawal'
      }));
      
      const allTransactions = [
        ...typedPurchases,
        ...typedDeposits,
        ...typedWithdrawals
      ];
      
      allTransactions.sort((a, b) => {
        const dateA = a.purchase_date || a.transaction_date;
        const dateB = b.purchase_date || b.transaction_date;
        return new Date(dateB) - new Date(dateA);
      });
      
      const formattedActivity = allTransactions.map(item => {
        let action, detail, xp;
        
        switch(item.type) {
          case 'purchase':
            action = "Purchase";
            detail = item.description || "Purchase";
            xp = Math.floor(item.amount / 20);
            break;
          case 'deposit':
            action = "Deposit";
            detail = item.description || "Bank Deposit";
            xp = Math.floor(item.amount / 10);
            break;
          case 'withdrawal':
            action = "Withdrawal";
            detail = item.description || "Bank Withdrawal";
            xp = Math.floor(item.amount / 15);
            break;
          default:
            action = "Transaction";
            detail = item.description || "Bank Transaction";
            xp = 5;
        }
        
        const itemDate = item.purchase_date || item.transaction_date;
        return {
          action,
          detail,
          xp,
          amount: item.amount,
          type: item.type,
          time: new Date(itemDate).toLocaleDateString()
        };
      });
      
      setRecentActivity(formattedActivity);
    })
    .catch(error => console.error("Error processing transactions:", error));
  }, []);

  const missions = [
    {
      id: 1,
      title: "Save $50 This Week",
      description: "Track your spending and save at least $50",
      xp: 150,
      difficulty: "Easy",
      progress: 35,
      icon: PiggyBank,
      category: "Saving"
    },
    {
      id: 2,
      title: "Complete Investing 101",
      description: "Learn the basics of stock market investing",
      xp: 200,
      difficulty: "Medium",
      progress: 60,
      icon: LineChart,
      category: "Education"
    },
    {
      id: 3,
      title: "Build Emergency Fund",
      description: "Save 3 months of expenses",
      xp: 500,
      difficulty: "Hard",
      progress: 15,
      icon: Target,
      category: "Goal"
    }
  ];

  const achievements = [
    { id: 1, title: "First Steps", unlocked: true, icon: Star },
    { id: 2, title: "Savings Master", unlocked: true, icon: PiggyBank },
    { id: 3, title: "7-Day Streak", unlocked: true, icon: Flame },
    { id: 4, title: "Investment Guru", unlocked: false, icon: TrendingUp },
    { id: 5, title: "Budget Boss", unlocked: false, icon: Wallet },
    { id: 6, title: "Debt Slayer", unlocked: false, icon: Award }
  ];

  const completeMission = (mission) => {
    setCompletedMission(mission);
    setShowReward(true);
    setUser(prev => ({
      ...prev,
      xp: prev.xp + mission.xp
    }));
    
    setTimeout(() => {
      setShowReward(false);
      setCompletedMission(null);
    }, 3000);
  };
  
  const saveBalance = () => {
    const newBalance = parseFloat(tempBalance) || 0;
    const previousBalance = user.previousBalances[0]?.balance || user.balance;
    const changePercent = ((newBalance - previousBalance) / previousBalance * 100).toFixed(1);
    
    setUser(prev => ({ 
      ...prev, 
      balance: newBalance,
      previousBalances: [
        { month: "Oct 2025", balance: newBalance, change: parseFloat(changePercent) },
        ...prev.previousBalances.slice(0, 3)
      ]
    }));
    setEditingBalance(false);
  };

  const cancelBalanceEdit = () => {
    setTempBalance('');
    setEditingBalance(false);
  };

  const saveSavingsGoal = () => {
    setUser(prev => ({ 
      ...prev, 
      savingsGoal: parseFloat(tempSavingsGoal) || 0,
      currentSavings: parseFloat(tempCurrentSavings) || 0
    }));
    setEditingGoal(false);
  };

  const cancelGoalEdit = () => {
    setTempSavingsGoal('');
    setTempCurrentSavings('');
    setEditingGoal(false);
  };
  
  const getFinancialTip = async () => {
    setLoadingTip(true);
    setTip("");
    
    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      const modelName = "gemini-2.5-flash";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      
      const userQuery = "Give me one, short, actionable financial tip for a young adult. Make it sound encouraging for my 'Pot o' Gold' app.";
      const systemPrompt = "You are a friendly financial coach. Provide concise, actionable tips. No more than two sentences.";
      
      const payload = {
        "contents": [{ "parts": [{ "text": userQuery }] }],
        "tools": [{ "google_search": {} }],
        "systemInstruction": {
          "parts": [{ "text": systemPrompt }]
        }
      };
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        const text = data.candidates[0].content.parts[0].text;
        setTip(text);
      } else {
        setTip("Sorry, couldn't get a tip right now. Try again later!");
      }
    } catch (error) {
      console.error("Error fetching financial tip:", error);
      setTip("Sorry, couldn't get a tip right now. Try again later!");
    } finally {
      setLoadingTip(false);
    }
  };

  const currentMonthChange = user.previousBalances[0]?.change || 12.5;
  const xpPercentage = (user.xp / user.xpToNext) * 100;
  const savingsPercentage = (user.currentSavings / user.savingsGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-900 to-emerald-950 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

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
                className="w-12 h-12 rounded-xl overflow-hidden bg-green-600 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={leprechun}
                alt="Leprechaun"
                className="w-full h-full object-cover"
              />
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

      <div className="relative max-w-7xl mx-auto px-6 py-8">
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
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              className="bg-gradient-to-br from-yellow-600 to-green-600 rounded-2xl p-6 border border-white/20 shadow-2xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-yellow-200">
                  <Wallet className="w-5 h-5" />
                  <span className="text-sm font-medium">Total Balance</span>
                </div>
                {!editingBalance ? (
                  <motion.button
                    onClick={() => {
                      setTempBalance(user.balance.toString());
                      setEditingBalance(true);
                    }}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <div className="flex gap-2">
                    <motion.button
                      onClick={saveBalance}
                      className="p-1 hover:bg-green-500/30 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Check className="w-4 h-4 text-green-300" />
                    </motion.button>
                    <motion.button
                      onClick={cancelBalanceEdit}
                      className="p-1 hover:bg-red-500/30 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-4 h-4 text-red-300" />
                    </motion.button>
                  </div>
                )}
              </div>
              
              {editingBalance ? (
                <div className="mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">$</span>
                    <input
                      type="number"
                      value={tempBalance}
                      onChange={(e) => setTempBalance(e.target.value)}
                      className="text-4xl font-bold bg-white/20 rounded-lg px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      step="0.01"
                      placeholder="0.00"
                      autoFocus
                    />
                  </div>
                </div>
              ) : (
                <p className="text-4xl font-bold mb-2">${user.balance.toFixed(2)}</p>
              )}
              
              <div className={`flex items-center gap-2 ${currentMonthChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">{currentMonthChange >= 0 ? '+' : ''}{currentMonthChange}% this month</span>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <LineChart className="w-5 h-5 text-blue-400" />
                <span className="font-semibold">Balance History</span>
              </div>
              <div className="space-y-3">
                {user.previousBalances.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.05 }}
                  >
                    <div>
                      <p className="text-sm text-gray-400">{entry.month}</p>
                      <p className="font-semibold">${entry.balance.toFixed(2)}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                      entry.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <TrendingUp className={`w-4 h-4 ${entry.change < 0 ? 'rotate-180' : ''}`} />
                      <span>{entry.change >= 0 ? '+' : ''}{entry.change}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

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
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">{savingsPercentage.toFixed(0)}%</span>
                  {!editingGoal ? (
                    <motion.button
                      onClick={() => {
                        setTempCurrentSavings(user.currentSavings.toString());
                        setTempSavingsGoal(user.savingsGoal.toString());
                        setEditingGoal(true);
                      }}
                      className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                  ) : (
                    <div className="flex gap-2">
                      <motion.button
                        onClick={saveSavingsGoal}
                        className="p-1 hover:bg-green-500/30 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Check className="w-4 h-4 text-green-300" />
                      </motion.button>
                      <motion.button
                        onClick={cancelGoalEdit}
                        className="p-1 hover:bg-red-500/30 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-4 h-4 text-red-300" />
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
              
              {editingGoal ? (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Current Savings</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">$</span>
                      <input
                        type="number"
                        value={tempCurrentSavings}
                        onChange={(e) => setTempCurrentSavings(e.target.value)}
                        className="text-2xl font-bold bg-white/20 rounded-lg px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Goal Amount</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">$</span>
                      <input
                        type="number"
                        value={tempSavingsGoal}
                        onChange={(e) => setTempSavingsGoal(e.target.value)}
                        className="text-xl font-bold bg-white/20 rounded-lg px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-2xl font-bold mb-2">${user.currentSavings}</p>
                  <p className="text-sm text-gray-400 mb-4">of ${user.savingsGoal} goal</p>
                </>
              )}
              
              <div className="relative h-3 bg-black/30 rounded-full overflow-hidden">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${savingsPercentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </motion.div>

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
                {achievements.map((achievement, idx) => (
                  <motion.div
                    key={achievement.id}
                    className={`aspect-square rounded-xl flex items-center justify-center ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                        : 'bg-black/30'
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

          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-400" />
                Active Missions
              </h2>
              
              <div className="space-y-4">
                {missions.map((mission, idx) => (
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
                                  animate={{ width: `${mission.progress}%` }}
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
                        className="ml-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => completeMission(mission)}
                      >
                        Continue
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
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
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'deposit'
                            ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                            : activity.type === 'withdrawal'
                              ? 'bg-gradient-to-br from-orange-500 to-amber-500'
                              : 'bg-gradient-to-br from-red-500 to-pink-500'
                        }`}>
                          {activity.type === 'deposit' ? (
                            <DollarSign className="w-5 h-5" />
                          ) : activity.type === 'withdrawal' ? (
                            <Wallet className="w-5 h-5" />
                          ) : (
                            <PiggyBank className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-400">{activity.detail}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          activity.type === 'deposit'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}>
                          {activity.type === 'deposit' ? '+' : '-'}${activity.amount?.toFixed(2) || '0.00'}
                        </p>
                        {activity.xp > 0 && (
                          <p className="text-yellow-400 font-semibold">+{activity.xp} XP</p>
                        )}
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-yellow-400" />
                  Financial Tip of the Day
                </h3>
                
                <div className="flex flex-col items-center">
                  <motion.button
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg mb-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={getFinancialTip}
                    disabled={loadingTip}
                  >
                    {loadingTip ? "Getting Tip..." : "Get Tip of the Day"}
                  </motion.button>
                  
                  {tip && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/20 p-4 rounded-xl text-center text-white"
                    >
                      {tip}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

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
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
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