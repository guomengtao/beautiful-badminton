import React, { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { Gamepad2, Users, Trophy, Github } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [gameMode, setGameMode] = useState<'robot' | 'multiplayer' | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-bold text-white mb-4"
          >
            Beautiful Badminton
          </motion.h1>
          <p className="text-gray-300 text-lg">Experience the thrill of badminton in your browser!</p>
        </header>

        {!gameMode ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <h2 className="text-2xl text-white mb-4">Select Game Mode</h2>
            <div className="flex gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGameMode('robot')}
                className="flex flex-col items-center gap-3 bg-white/10 p-6 rounded-xl hover:bg-white/20 transition-colors"
              >
                <Gamepad2 size={48} className="text-green-400" />
                <span className="text-white font-semibold">vs Robot</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGameMode('multiplayer')}
                className="flex flex-col items-center gap-3 bg-white/10 p-6 rounded-xl hover:bg-white/20 transition-colors"
              >
                <Users size={48} className="text-blue-400" />
                <span className="text-white font-semibold">vs Player</span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <GameCanvas gameMode={gameMode} />
            <div className="bg-white/10 p-4 rounded-lg text-white">
              <h3 className="font-semibold mb-2">Controls:</h3>
              <p>Player 1: Left/Right Arrow Keys</p>
              {gameMode === 'multiplayer' && <p>Player 2: A/D Keys</p>}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameMode(null)}
              className="bg-white/10 px-6 py-2 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              Change Game Mode
            </motion.button>
          </div>
        )}

        <footer className="mt-12 text-center text-gray-400">
          <div className="flex justify-center gap-4 mb-4">
            <Trophy className="text-yellow-400" />
            <span>High Score: 0</span>
          </div>
          <a 
            href="https://github.com/yourusername/beautiful-badminton"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <Github size={20} />
            View on GitHub
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;