import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, X } from 'lucide-react';

interface GlobalLogicHUDProps {
  t: (key: string) => string;
}

export function GlobalLogicHUD({ t }: GlobalLogicHUDProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  const message = "Foundry Logic is calibrated. Awaiting your narrative sequence.";

  return (
    <div className="fixed bottom-32 left-10 z-[600] w-80 pointer-events-none max-md:left-4 max-md:right-4 max-md:bottom-4 max-md:w-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            className="pointer-events-auto bg-white/90 backdrop-blur-3xl border border-black/10 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] max-md:rounded-2xl"
          >
            <div className="p-5 flex items-center gap-4 border-b border-black/5 bg-gradient-to-r from-[var(--accent)]/10 to-transparent max-md:p-4">
               <div className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-[0_0_15px_rgba(255,77,0,0.22)]">
                  <BrainCircuit size={16} className="text-white" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black">Logic_Assistant</span>
                  <span className="text-[6px] font-black uppercase text-[var(--accent)] tracking-widest animate-pulse">Neural_Sync_Active</span>
               </div>
               <button onClick={() => setIsOpen(false)} className="ml-auto text-black/25 hover:text-black transition-colors">
                  <X size={14} />
               </button>
            </div>
            <div className="p-6 max-md:p-4">
               <p className="text-[10px] font-medium leading-relaxed text-black/70">
                  {message}
               </p>
               <div className="mt-5 pt-4 border-t border-black/5 flex items-center justify-between">
                  <div className="flex gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                     <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
                     <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
                  </div>
                  <span className="text-[7px] font-black text-black/25 uppercase tracking-[0.3em]">{t('neural')}</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isOpen && (
         <motion.button 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsOpen(true)}
            className="pointer-events-auto w-12 h-12 bg-white/90 backdrop-blur-xl border border-black/10 rounded-2xl flex items-center justify-center text-[var(--accent)] shadow-2xl hover:bg-[var(--accent)] hover:text-white transition-all max-md:w-11 max-md:h-11"
         >
            <BrainCircuit size={20} />
         </motion.button>
      )}
    </div>
  );
}
