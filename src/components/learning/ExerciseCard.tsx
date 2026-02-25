"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExerciseCardProps {
  exercise: any;
  onAnswer: (isCorrect: boolean) => void;
}

const ExerciseCard = ({ exercise, onAnswer }: ExerciseCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const content = exercise.content;

  const handleCheck = () => {
    let correct = false;
    if (exercise.type === 'MULTIPLE_CHOICE' || exercise.type === 'TRUE_FALSE') {
      correct = selectedOption === exercise.correct_answer;
    } else if (exercise.type === 'TEXT_INPUT') {
      correct = textInput.toLowerCase().trim() === exercise.correct_answer.toLowerCase().trim();
    }

    setIsCorrect(correct);
    setIsChecked(true);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8">
      <div className="space-y-4">
        <h3 className="text-2xl md:text-3xl font-black tracking-tight lowercase text-white">
          {content.question}
        </h3>
        {content.hint && (
          <p className="text-zinc-500 font-medium italic">hint: {content.hint}</p>
        )}
      </div>

      <div className="space-y-3">
        {(exercise.type === 'MULTIPLE_CHOICE' || exercise.type === 'TRUE_FALSE') && (
          <div className="grid gap-3">
            {content.options.map((option: string) => (
              <button
                key={option}
                disabled={isChecked}
                onClick={() => setSelectedOption(option)}
                className={cn(
                  "w-full p-6 rounded-2xl border-2 text-left transition-all font-bold lowercase",
                  selectedOption === option 
                    ? "border-white bg-white/10 text-white" 
                    : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700",
                  isChecked && option === exercise.correct_answer && "border-green-500 bg-green-500/10 text-green-500",
                  isChecked && selectedOption === option && option !== exercise.correct_answer && "border-red-500 bg-red-500/10 text-red-500"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {exercise.type === 'TEXT_INPUT' && (
          <Input 
            disabled={isChecked}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="type your answer..."
            className="h-16 rounded-2xl bg-zinc-900 border-zinc-800 text-xl font-bold lowercase"
          />
        )}
      </div>

      <div className="pt-8">
        <AnimatePresence mode="wait">
          {!isChecked ? (
            <Button
              key="check"
              onClick={handleCheck}
              disabled={(!selectedOption && exercise.type !== 'TEXT_INPUT') || (exercise.type === 'TEXT_INPUT' && !textInput)}
              className="w-full h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black text-xl lowercase"
            >
              check answer.
            </Button>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-6 rounded-2xl flex items-center justify-between",
                isCorrect ? "bg-green-500/10 border border-green-500/50" : "bg-red-500/10 border border-red-500/50"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"
                )}>
                  {isCorrect ? <Check size={24} /> : <X size={24} />}
                </div>
                <div>
                  <h4 className={cn("font-black lowercase", isCorrect ? "text-green-500" : "text-red-500")}>
                    {isCorrect ? "brilliant." : "not quite."}
                  </h4>
                  {!isCorrect && <p className="text-zinc-500 text-xs">correct: {exercise.correct_answer}</p>}
                </div>
              </div>
              <Button 
                onClick={() => onAnswer(isCorrect || false)}
                className="bg-white text-black hover:bg-zinc-200 font-bold rounded-xl"
              >
                next <ArrowRight size={16} className="ml-2" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExerciseCard;