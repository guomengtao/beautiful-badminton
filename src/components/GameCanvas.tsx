import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Player {
  x: number;
  y: number;
  score: number;
}

interface Shuttle {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const PLAYER_SIZE = 50;
const SHUTTLE_SIZE = 20;
const GRAVITY = 0.4;
const NET_HEIGHT = 150;

export const GameCanvas: React.FC<{ gameMode: 'robot' | 'multiplayer' }> = ({ gameMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player1, setPlayer1] = useState<Player>({ x: 100, y: CANVAS_HEIGHT - PLAYER_SIZE, score: 0 });
  const [player2, setPlayer2] = useState<Player>({ x: CANVAS_WIDTH - 100, y: CANVAS_HEIGHT - PLAYER_SIZE, score: 0 });
  const [shuttle, setShuttle] = useState<Shuttle>({
    x: CANVAS_WIDTH / 4,
    y: CANVAS_HEIGHT / 2,
    dx: 5,
    dy: -5,
  });
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      if (!gameStarted) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw court
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 20);

      // Draw net
      ctx.fillStyle = '#white';
      ctx.fillRect(CANVAS_WIDTH / 2 - 2, CANVAS_HEIGHT - NET_HEIGHT, 4, NET_HEIGHT);

      // Draw players
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(player1.x, player1.y, PLAYER_SIZE, PLAYER_SIZE);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(player2.x, player2.y, PLAYER_SIZE, PLAYER_SIZE);

      // Draw shuttle
      ctx.beginPath();
      ctx.arc(shuttle.x, shuttle.y, SHUTTLE_SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.closePath();

      // Update shuttle position
      setShuttle(prev => {
        const newShuttle = {
          x: prev.x + prev.dx,
          y: prev.y + prev.dy,
          dx: prev.dx,
          dy: prev.dy + GRAVITY,
        };

        // Bounce off walls
        if (newShuttle.x < 0 || newShuttle.x > CANVAS_WIDTH) {
          newShuttle.dx *= -1;
        }

        // Bounce off floor
        if (newShuttle.y > CANVAS_HEIGHT - 20) {
          newShuttle.dy = -15;
        }

        // Bounce off net
        if (Math.abs(newShuttle.x - CANVAS_WIDTH / 2) < 5 && 
            newShuttle.y > CANVAS_HEIGHT - NET_HEIGHT) {
          newShuttle.dx *= -1;
        }

        // Player collisions
        const checkPlayerCollision = (player: Player) => {
          if (newShuttle.x > player.x && 
              newShuttle.x < player.x + PLAYER_SIZE &&
              newShuttle.y > player.y && 
              newShuttle.y < player.y + PLAYER_SIZE) {
            newShuttle.dx *= -1.1;
            newShuttle.dy = -15;
          }
        };

        checkPlayerCollision(player1);
        checkPlayerCollision(player2);

        return newShuttle;
      });

      // AI movement for robot mode
      if (gameMode === 'robot') {
        setPlayer2(prev => ({
          ...prev,
          x: Math.min(
            Math.max(
              shuttle.x - PLAYER_SIZE / 2,
              CANVAS_WIDTH / 2
            ),
            CANVAS_WIDTH - PLAYER_SIZE
          )
        }));
      }
    };

    const animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [gameStarted, player1, player2, shuttle, gameMode]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!gameStarted) return;

    switch (e.key) {
      case 'ArrowLeft':
        setPlayer1(prev => ({
          ...prev,
          x: Math.max(prev.x - 20, 0)
        }));
        break;
      case 'ArrowRight':
        setPlayer1(prev => ({
          ...prev,
          x: Math.min(prev.x + 20, CANVAS_WIDTH / 2 - PLAYER_SIZE)
        }));
        break;
      case 'a':
        if (gameMode === 'multiplayer') {
          setPlayer2(prev => ({
            ...prev,
            x: Math.max(prev.x - 20, CANVAS_WIDTH / 2)
          }));
        }
        break;
      case 'd':
        if (gameMode === 'multiplayer') {
          setPlayer2(prev => ({
            ...prev,
            x: Math.min(prev.x + 20, CANVAS_WIDTH - PLAYER_SIZE)
          }));
        }
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameMode, gameStarted]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="bg-gray-900 rounded-lg shadow-xl"
      />
      {!gameStarted && (
        <motion.button
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setGameStarted(true)}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-green-500 text-white px-8 py-4 rounded-full text-xl font-bold
                     shadow-lg hover:bg-green-600 transition-colors"
        >
          Start Game
        </motion.button>
      )}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 
                      bg-black/50 text-white px-6 py-2 rounded-full">
        {player1.score} - {player2.score}
      </div>
    </div>
  );
};