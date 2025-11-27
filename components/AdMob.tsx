import React, { useEffect, useState } from 'react';
import { X, PlayCircle, Loader2 } from 'lucide-react';

interface BannerAdProps {
  unitId: string;
}

interface InterstitialAdProps {
  isOpen: boolean;
  onClose: () => void;
  unitId: string;
}

interface RewardedAdProps {
  isOpen: boolean;
  onClose: (rewarded: boolean) => void;
  unitId: string;
}

// Banner Ad Component
export const BannerAd: React.FC<BannerAdProps> = ({ unitId }) => {
  return (
    <div className="w-full bg-slate-200 dark:bg-slate-800 border-t border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center h-[60px] select-none overflow-hidden">
      <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">AdMob Banner</div>
      <div className="text-xs font-mono text-slate-400 truncate max-w-[90%]">{unitId}</div>
    </div>
  );
};

// Interstitial Ad Component (Modal)
export const InterstitialAd: React.FC<InterstitialAdProps> = ({ isOpen, onClose, unitId }) => {
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (isOpen) {
      setCanClose(false);
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanClose(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
      {/* Ad Content Simulation */}
      <div className="w-full max-w-sm aspect-[9/16] bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-2xl flex flex-col items-center justify-center text-white relative p-8 text-center">
        <div className="absolute top-2 left-2 bg-black/40 px-2 py-1 rounded text-[10px] font-bold uppercase">Ad</div>
        <h2 className="text-3xl font-bold mb-4">Amazing Offer!</h2>
        <p className="mb-8">This is a simulated AdMob Interstitial. In a real app, a full screen ad would appear here.</p>
        <div className="bg-white text-indigo-600 px-6 py-3 rounded-full font-bold shadow-lg animate-bounce">
            Install Now
        </div>
        
        {/* Unit ID for verification */}
        <div className="absolute bottom-2 text-[8px] text-white/50 font-mono">{unitId}</div>

        {/* Close Button */}
        <button 
            onClick={onClose}
            disabled={!canClose}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all ${canClose ? 'opacity-100 hover:bg-black/70' : 'opacity-30 cursor-not-allowed'}`}
        >
            {canClose ? <X size={16} /> : <span className="text-xs font-bold">{countdown}</span>}
        </button>
      </div>
    </div>
  );
};

// Rewarded Ad Component (Modal)
export const RewardedAd: React.FC<RewardedAdProps> = ({ isOpen, onClose, unitId }) => {
    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(false);
  
    useEffect(() => {
      if (isOpen) {
        setProgress(0);
        setCompleted(false);
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setCompleted(true);
              return 100;
            }
            return prev + 1; // 100 ticks approx 3-4 seconds
          });
        }, 30);
        return () => clearInterval(interval);
      }
    }, [isOpen]);
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
            {/* Video Player Simulation */}
            <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
                {!completed ? (
                    <div className="text-center">
                        <Loader2 size={48} className="text-blue-500 animate-spin mx-auto mb-4" />
                        <p className="text-white font-medium">Watching Ad...</p>
                    </div>
                ) : (
                    <div className="text-center animate-in zoom-in">
                        <PlayCircle size={48} className="text-emerald-500 mx-auto mb-4" />
                        <p className="text-white font-bold text-xl">Reward Granted!</p>
                    </div>
                )}
                
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-slate-700 w-full">
                    <div className="h-full bg-blue-500 transition-all duration-75 ease-linear" style={{ width: `${progress}%` }}></div>
                </div>
                
                <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] font-bold text-white uppercase">Rewarded Ad</div>
            </div>

            <div className="p-6 text-center">
                <p className="text-slate-400 text-xs font-mono mb-4">{unitId}</p>
                {completed ? (
                    <button 
                        onClick={() => onClose(true)}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-colors"
                    >
                        Collect Reward
                    </button>
                ) : (
                    <button 
                        onClick={() => onClose(false)}
                        className="text-slate-500 text-sm hover:text-white transition-colors"
                    >
                        Cancel (No Reward)
                    </button>
                )}
            </div>
        </div>
      </div>
    );
  };