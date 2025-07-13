'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    LucideIcon,
    Brain,
    Clock,
    Headphones,
    GraduationCap,
    CheckIcon,
    XIcon,
    FileTextIcon,
    SparklesIcon,
    BookOpenIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    MessageCircleIcon,
} from 'lucide-react';

// Custom scrollbar styles for galaxy theme
const galaxyScrollbarStyles = `
  /* Galaxy-themed scrollbar styles */
  .galaxy-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .galaxy-scrollbar::-webkit-scrollbar-track {
    background: rgba(30, 30, 60, 0.4);
    border-radius: 10px;
  }
  
  .galaxy-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #4f46e5, #8b5cf6, #3b82f6);
    border-radius: 10px;
    box-shadow: 0 0 5px rgba(139, 92, 246, 0.5);
  }
  
  .galaxy-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, #6366f1, #a855f7, #60a5fa);
    box-shadow: 0 0 8px rgba(139, 92, 246, 0.8);
  }
`;

// Device frame component for feature previews
const DeviceFrame = ({ children, type = 'phone', featureTitle = '' }: { children: React.ReactNode; type?: 'phone' | 'browser'; featureTitle?: string }) => {
    // Check if this is the AudioLearningPreview by feature title
    const isAudioLearning = featureTitle === 'AI Podcast Generator';

    // Apply scrollbar class only to browser frames that aren't AudioLearningPreview
    const scrollbarClass = type === 'browser' && !isAudioLearning ? 'galaxy-scrollbar' : '';

    return (
        <>
            <style jsx global>{galaxyScrollbarStyles}</style>
            <div className={`relative ${type === 'phone'
                ? 'w-[140px] xs:w-[150px] sm:w-[180px] md:w-[220px] lg:w-[260px] scale-[0.7] xs:scale-[0.75] sm:scale-[0.8] md:scale-[0.9] lg:scale-100'
                : 'w-full max-w-[95%] xs:max-w-[90%] sm:max-w-[600px] scale-[0.7] xs:scale-[0.8] sm:scale-[0.85] md:scale-[0.9] lg:scale-100'} 
                origin-center mx-auto`}>
                {type === 'phone' ? (
                    <div className="relative rounded-[30px] xs:rounded-[35px] sm:rounded-[40px] border-[6px] xs:border-[7px] sm:border-[8px] border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-5 xs:h-6 bg-slate-800 rounded-t-[20px] xs:rounded-t-[24px]">
                            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 xs:w-16 h-0.5 xs:h-1 bg-slate-700 rounded-full" />
                        </div>
                        <div className="pt-5 xs:pt-6 pb-1.5 xs:pb-2 overflow-hidden rounded-b-[25px] xs:rounded-b-[32px]">
                            {children}
                        </div>
                    </div>
                ) : (
                    <div className="rounded-lg border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden w-full">
                        <div className="h-7 xs:h-8 bg-slate-800 flex items-center px-2 xs:px-3 sm:px-4 gap-1.5 xs:gap-2">
                            <div className="flex gap-1 xs:gap-1.5">
                                <div className="w-2 h-2 xs:w-2.5 xs:h-2.5 rounded-full bg-red-500" />
                                <div className="w-2 h-2 xs:w-2.5 xs:h-2.5 rounded-full bg-yellow-500" />
                                <div className="w-2 h-2 xs:w-2.5 xs:h-2.5 rounded-full bg-green-500" />
                            </div>
                            <div className="flex-1 h-4 xs:h-5 bg-slate-700 rounded text-[10px] xs:text-xs text-slate-400 flex items-center px-1.5 xs:px-2 truncate">
                                https://studybud.com/features/{featureTitle.toLowerCase().replace(/\s+/g, '-')}
                            </div>
                        </div>
                        <div className={`p-2 xs:p-3 sm:p-4 bg-slate-950/50 min-h-[180px] xs:min-h-[200px] max-h-[300px] xs:max-h-[350px] sm:max-h-[400px] overflow-y-auto ${scrollbarClass}`}>
                            {children}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

// AI Summary Preview Component
const AISummaryPreview = () => (
    <DeviceFrame type="browser" featureTitle="AI Summary">
        <div className="bg-slate-950 p-2 xs:p-3 sm:p-4 h-full">
            <div className="bg-slate-900/50 rounded-lg border border-slate-800/50 overflow-hidden h-full flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-slate-800/50 p-2 xs:p-3 flex items-center">
                    <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/20 flex items-center justify-center mr-2 flex-shrink-0">
                        <FileTextIcon className="w-3 h-3 xs:w-4 xs:h-4 text-blue-300" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-xs xs:text-sm font-medium text-white truncate">AI Summary</h3>
                        <p className="text-[10px] xs:text-xs text-slate-400 truncate">Generated from &quot;Cellular Biology 101&quot;</p>
                    </div>
                </div>

                {/* Summary Content */}
                <div className="p-2 xs:p-3 space-y-3 xs:space-y-4 flex-1 overflow-y-auto">
                    {/* Key Points */}
                    <div>
                        <h4 className="text-[10px] xs:text-xs font-medium text-blue-300 mb-1.5 xs:mb-2 flex items-center">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1.5 xs:mr-2"></span>
                            KEY POINTS
                        </h4>
                        <ul className="space-y-1.5 xs:space-y-2 pl-3 xs:pl-4">
                            {[
                                "Cells are the basic structural and functional units of life",
                                "Prokaryotic vs. eukaryotic cell structures",
                                "Cell membrane structure and function"
                            ].map((point, i) => (
                                <li key={i} className="flex items-start">
                                    <span className="text-blue-400 mr-1.5 xs:mr-2 text-[10px] xs:text-xs">•</span>
                                    <span className="text-[10px] xs:text-xs text-slate-300 leading-relaxed">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Detailed Summary */}
                    <div>
                        <h4 className="text-[10px] xs:text-xs font-medium text-blue-300 mb-1.5 xs:mb-2 flex items-center">
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-1.5 xs:mr-2"></span>
                            DETAILED SUMMARY
                        </h4>
                        <div className="bg-slate-900/30 rounded p-2 xs:p-3 border border-slate-800/50">
                            <p className="text-[10px] xs:text-xs text-slate-300 leading-relaxed">
                                Cellular biology explores the structure, function, and behavior of cells. All living organisms are composed of cells, which contain specialized structures called organelles that perform specific functions. The cell membrane regulates what enters and exits the cell, maintaining homeostasis...
                            </p>
                        </div>
                    </div>

                    {/* Key Terms */}
                    <div>
                        <h4 className="text-[10px] xs:text-xs font-medium text-blue-300 mb-1.5 xs:mb-2 flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 xs:mr-2"></span>
                            KEY TERMS
                        </h4>
                        <div className="flex flex-wrap gap-1.5 xs:gap-2">
                            {['Organelles', 'Cytoplasm', 'Nucleus', 'Mitochondria', 'ER'].map((term, i) => (
                                <span
                                    key={i}
                                    className="text-[9px] xs:text-xs bg-slate-800/50 text-slate-300 px-2 xs:px-2.5 py-0.5 xs:py-1 rounded-full border border-slate-700/50 whitespace-nowrap"
                                    style={{ fontSize: '0.65rem' }}
                                >
                                    {term}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-slate-900/50 border-t border-slate-800/50 p-2 xs:p-3 flex justify-end space-x-1.5 xs:space-x-2">
                    <button className="text-[10px] xs:text-xs text-slate-300 hover:text-white px-2 xs:px-3 py-1 xs:py-1.5 rounded-md border border-slate-700 hover:bg-slate-800/50 transition-colors whitespace-nowrap">
                        Save to Notes
                    </button>
                    <button className="text-[10px] xs:text-xs bg-gradient-to-r from-blue-600 to-blue-500 text-white px-2 xs:px-3 py-1 xs:py-1.5 rounded-md hover:opacity-90 transition-opacity flex items-center whitespace-nowrap">
                        <SparklesIcon className="w-2.5 h-2.5 xs:w-3 xs:h-3 mr-0.5 xs:mr-1" />
                        Generate Quiz
                    </button>
                </div>
            </div>
        </div>
    </DeviceFrame>
);

const FlashcardsPreview = () => (
    <DeviceFrame type="phone">
        <div className="relative h-full w-full bg-slate-900 p-3 space-y-4">
            {/* Flashcard stack with perspective effect */}
            <div className="relative h-[220px] w-full">
                {/* Card 3 (back) */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[85%] h-[180px] bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl transform rotate-6 border border-blue-500/20 shadow-lg" />

                {/* Card 2 (middle) */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[90%] h-[180px] bg-gradient-to-br from-blue-900/60 to-purple-900/60 rounded-xl transform -rotate-3 border border-blue-500/30 shadow-lg" />

                {/* Card 1 (front - static) */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[95%] h-[180px] rounded-xl overflow-hidden border border-blue-500/50 shadow-xl"
                >
                    {/* Card content - showing the front side only */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-800 to-blue-800 p-4 flex flex-col justify-between">
                        <div className="text-sm text-white">
                            Mitochondria are the powerhouse of the cell. They generate most of the cell&apos;s supply of ATP, used as a source of chemical energy.
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-400" />
                                <div className="w-2 h-2 rounded-full bg-green-400" />
                                <div className="w-2 h-2 rounded-full bg-green-400" />
                                <div className="w-2 h-2 rounded-full bg-green-400" />
                                <div className="w-2 h-2 rounded-full bg-slate-600" />
                            </div>
                            <div className="text-xs text-blue-200">4/5 Mastered</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <XIcon className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="text-xs text-slate-400">Needs review</div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-xs text-slate-400">Mastered</div>
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckIcon className="w-4 h-4 text-green-400" />
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full" style={{ width: '65%' }} />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
                <span>42 cards</span>
                <span>65% complete</span>
            </div>
        </div>
    </DeviceFrame>
);

const TutorPreview = () => (
    <DeviceFrame type="browser" featureTitle="AI Study Buddy">
        <div className="bg-slate-950 p-4 h-full">
            <div className="flex h-full">
                {/* Left sidebar - Document viewer */}
                <div className="w-1/3 border-r border-slate-800 pr-3 h-full overflow-hidden">
                    <div className="flex items-center gap-2 mb-3">
                        <BookOpenIcon className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-white">Biology Textbook</span>
                    </div>

                    {/* Document preview with highlight */}
                    <div className="space-y-2 overflow-hidden">
                        <div className="text-xs text-slate-400">Chapter 4: Cell Structure</div>
                        <div className="space-y-2 text-xs">
                            <p className="text-slate-300">The cell is the basic structural and functional unit of all organisms. There are two main types of cells:</p>
                            <div className="bg-blue-500/10 border-l-2 border-blue-500 pl-2 py-1">
                                <p className="text-blue-300">Prokaryotic cells are simpler and lack membrane-bound organelles, including a nucleus. Bacteria are prokaryotes.</p>
                            </div>
                            <p className="text-slate-300">Eukaryotic cells are found in plants, animals, fungi, and protists. They contain membrane-bound organelles and a nucleus that houses DNA.</p>
                        </div>
                    </div>
                </div>

                {/* Right side - AI chat */}
                <div className="flex-1 pl-3 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-medium text-white">AI Study Buddy</span>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs text-green-500">Online</span>
                        </div>
                    </div>

                    {/* Chat messages */}
                    <div className="flex-1 space-y-3 overflow-hidden">
                        {/* User question */}
                        <div className="flex justify-end">
                            <div className="bg-blue-600/30 text-white rounded-lg rounded-tr-none px-3 py-2 max-w-[80%] text-xs">
                                Can you explain the difference between prokaryotic and eukaryotic cells in simple terms?
                            </div>
                        </div>

                        {/* AI response */}
                        <div className="flex">
                            <div className="bg-slate-800 text-slate-200 rounded-lg rounded-tl-none px-3 py-2 max-w-[80%] text-xs space-y-2">
                                <p>Think of it this way:</p>
                                <p><span className="font-bold text-blue-300">Prokaryotic cells</span> are like studio apartments:</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Small and simple</li>
                                    <li>No separate rooms (no nucleus)</li>
                                    <li>Everything happens in one open space</li>
                                </ul>
                                <p><span className="font-bold text-purple-300">Eukaryotic cells</span> are like houses with many rooms:</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Larger and more complex</li>
                                    <li>Has a dedicated office (nucleus) where DNA is stored</li>
                                    <li>Different rooms (organelles) for different functions</li>
                                </ul>
                                <p>Would you like me to explain any specific organelles in more detail?</p>
                            </div>
                        </div>
                    </div>

                    {/* Input area */}
                    <div className="mt-3 flex gap-2">
                        <div className="flex-1 bg-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400">
                            Yes, tell me about mitochondria...
                        </div>
                        <button className="bg-blue-600 text-white rounded-lg p-2" aria-label="Send message">
                            <ArrowRightIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </DeviceFrame>
);

const StudyPlannerPreview = () => (
    <DeviceFrame type="browser" featureTitle="Smart Study Planner">
        <div className="space-y-4 p-4 bg-slate-950/70">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <h3 className="text-white font-medium">Smart Study Planner</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-300">May 2025</span>
                    <div className="flex gap-1">
                        <button className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 text-slate-400">
                            &lt;
                        </button>
                        <button className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 text-slate-400">
                            &gt;
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {/* Day labels */}
                {['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'].map((day, index) => (
                    <div key={`day-${index}`} className="text-center text-xs text-slate-500 py-1">{day.charAt(0)}</div>
                ))}

                {/* Calendar days */}
                {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    // Different styles for different day types
                    let bgColor = '';
                    let textColor = 'text-slate-400';
                    let borderColor = '';
                    let badge = null;

                    // Highlight different days
                    if (day === 15) {
                        bgColor = 'bg-blue-600/20';
                        textColor = 'text-blue-300';
                        borderColor = 'border border-blue-500/50';
                        badge = <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />;
                    } else if (day === 10 || day === 18) {
                        bgColor = 'bg-purple-600/20';
                        textColor = 'text-purple-300';
                        borderColor = 'border border-purple-500/50';
                        badge = <div className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full" />;
                    } else if (day === 5 || day === 22) {
                        bgColor = 'bg-green-600/20';
                        textColor = 'text-green-300';
                        borderColor = 'border border-green-500/50';
                        badge = <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full" />;
                    } else if (day === 8 || day === 25) {
                        bgColor = 'bg-yellow-600/20';
                        textColor = 'text-yellow-300';
                        borderColor = 'border border-yellow-500/50';
                        badge = <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full" />;
                    }

                    return (
                        <div
                            key={`calendar-${i}`}
                            className={`relative aspect-square rounded text-xs flex items-center justify-center cursor-pointer hover:bg-slate-800/50 transition-colors ${bgColor} ${textColor} ${borderColor}`}
                        >
                            {day}
                            {badge}
                        </div>
                    );
                })}
            </div>

            {/* Study sessions for today */}
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-white">Today&apos;s Study Plan</h4>
                <div className="space-y-2">
                    {[
                        { time: '9:00 AM', subject: 'Biology Review', color: 'bg-blue-500/20 text-blue-300', duration: '45 min' },
                        { time: '2:00 PM', subject: 'Chemistry Quiz', color: 'bg-purple-500/20 text-purple-300', duration: '30 min' },
                        { time: '7:00 PM', subject: 'Math Practice', color: 'bg-green-500/20 text-green-300', duration: '60 min' }
                    ].map((session, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30">
                            <div className="text-xs text-slate-400 w-16">{session.time}</div>
                            <div className={`flex-1 text-xs px-2 py-1 rounded ${session.color}`}>
                                {session.subject}
                            </div>
                            <div className="text-xs text-slate-500">{session.duration}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </DeviceFrame>
);

const AudioLearningPreview = () => (
    <DeviceFrame type="phone" featureTitle="AI Podcast Generator">
        <div className="bg-slate-900 p-4 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-white font-medium text-sm">Biology Podcast</h3>
                    <p className="text-slate-400 text-xs">Cell Structure & Function</p>
                </div>
            </div>

            {/* Waveform visualization */}
            <div className="flex items-center justify-center h-16 mb-4">
                <div className="flex items-end gap-1 h-12">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                            style={{
                                width: '3px',
                                height: `${Math.random() * 40 + 10}px`,
                                opacity: i < 8 ? 1 : 0.3,
                                animation: i < 8 ? `pulse 1s ease-in-out infinite ${i * 0.1}s` : 'none'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>2:34</span>
                    <span>12:45</span>
                </div>
                <div className="w-full bg-slate-700 h-1 rounded-full">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full" style={{ width: '20%' }} />
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-4">
                <button className="w-8 h-8 flex items-center justify-center text-slate-400" aria-label="Previous">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M3 2v12l8-6-8-6z" />
                        <path d="M11 2v12" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </button>
                <button className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white" aria-label="Play">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M3 2v12l10-6L3 2z" />
                    </svg>
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-slate-400" aria-label="Next">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M13 2v12L5 8l8-6z" />
                        <path d="M5 2v12" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </button>
            </div>

            {/* Speed and options */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Speed:</span>
                    <button className="text-xs bg-slate-800 text-blue-300 px-2 py-1 rounded">1.5x</button>
                </div>
                <button className="text-xs text-slate-400 flex items-center gap-1" aria-label="Download">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M6 8L2 4h3V0h2v4h3L6 8z" />
                        <path d="M0 10h12v2H0v-2z" />
                    </svg>
                    Download
                </button>
            </div>
        </div>
    </DeviceFrame>
);

const PracticeTestPreview = () => (
    <DeviceFrame type="browser" featureTitle="Adaptive Practice Tests">
        <div className="bg-slate-950 p-4 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-400" />
                    <h3 className="text-white font-medium">Biology Practice Test</h3>
                </div>
                <div className="text-xs text-slate-400">Question 3 of 15</div>
            </div>

            {/* Progress */}
            <div className="w-full bg-slate-800 h-2 rounded-full">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full" style={{ width: '20%' }} />
            </div>

            {/* Question */}
            <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                    <h4 className="text-white font-medium mb-2">Which organelle is responsible for cellular respiration?</h4>
                    <p className="text-slate-300 text-sm">This process converts glucose and oxygen into ATP, the cell&apos;s primary energy currency.</p>
                </div>

                {/* Answer options */}
                <div className="space-y-2">
                    {[
                        { letter: 'A', text: 'Nucleus', correct: false },
                        { letter: 'B', text: 'Mitochondria', correct: true },
                        { letter: 'C', text: 'Ribosome', correct: false },
                        { letter: 'D', text: 'Endoplasmic Reticulum', correct: false }
                    ].map((option, i) => (
                        <button
                            key={i}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                option.correct 
                                    ? 'bg-green-500/10 border-green-500/30 text-green-300' 
                                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                            }`}
                        >
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs mr-3 ${
                                option.correct 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-slate-700 text-slate-400'
                            }`}>
                                {option.letter}
                            </span>
                            {option.text}
                        </button>
                    ))}
                </div>

                {/* Explanation */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-blue-300 text-sm font-medium mb-1">Correct!</p>
                            <p className="text-slate-300 text-sm">Mitochondria are often called the &quot;powerhouse of the cell&quot; because they produce ATP through cellular respiration.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <button className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Previous</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Next Question</button>
            </div>
        </div>
    </DeviceFrame>
);

const DocumentChatPreview = () => (
    <DeviceFrame type="browser" featureTitle="Document-Specific Chat">
        <div className="bg-slate-950 p-4 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <MessageCircleIcon className="w-5 h-5 text-blue-400" />
                    <h3 className="text-white font-medium">Document Chat</h3>
                </div>
                <div className="text-xs text-slate-400">Biology_Chapter4.pdf</div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 space-y-4 overflow-hidden">
                {/* User message */}
                <div className="flex justify-end">
                    <div className="bg-blue-600/30 text-white rounded-lg rounded-tr-none px-3 py-2 max-w-[80%] text-sm">
                        What&apos;s the main difference between plant and animal cells?
                    </div>
                </div>

                {/* AI response */}
                <div className="flex">
                    <div className="bg-slate-800 text-slate-200 rounded-lg rounded-tl-none px-3 py-2 max-w-[80%] text-sm space-y-2">
                        <p>Based on your document, the main differences are:</p>
                        <div className="space-y-1">
                            <p><strong className="text-green-300">Plant cells have:</strong></p>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Cell wall (rigid structure)</li>
                                <li>Chloroplasts (for photosynthesis)</li>
                                <li>Large central vacuole</li>
                            </ul>
                            <p><strong className="text-blue-300">Animal cells have:</strong></p>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>Centrioles (for cell division)</li>
                                <li>Smaller vacuoles</li>
                                <li>More flexible cell membrane</li>
                            </ul>
                        </div>
                        <div className="text-xs text-slate-400 bg-slate-900/50 rounded p-2 border-l-2 border-blue-500">
                            📖 Reference: Page 47, Section 4.2 &quot;Cell Types&quot;
                        </div>
                    </div>
                </div>

                {/* User follow-up */}
                <div className="flex justify-end">
                    <div className="bg-blue-600/30 text-white rounded-lg rounded-tr-none px-3 py-2 max-w-[80%] text-sm">
                        Can you explain chloroplasts in more detail?
                    </div>
                </div>

                {/* AI typing indicator */}
                <div className="flex">
                    <div className="bg-slate-800 text-slate-200 rounded-lg rounded-tl-none px-3 py-2 flex items-center gap-2">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs text-slate-400">AI is typing...</span>
                    </div>
                </div>
            </div>

            {/* Input area */}
            <div className="mt-4 flex gap-2">
                <div className="flex-1 bg-slate-800 rounded-lg px-3 py-2 text-sm text-slate-400">
                    Ask anything about this document...
                </div>
                <button className="bg-blue-600 text-white rounded-lg p-2" aria-label="Send message">
                    <ArrowRightIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    </DeviceFrame>
);

const FeatureHighlight = ({
    isActive,
    icon: Icon,
    title,
    description
}: {
    isActive: boolean;
    icon: React.ComponentType<React.ComponentProps<LucideIcon>>;
    title: string;
    description: string;
}) => {
    // Get the appropriate preview component based on the feature title
    const getPreviewComponent = () => {
        switch (title) {
            case 'AI Summary':
                return <AISummaryPreview />;
            case 'Instant Flashcards & Quizzes':
                return <FlashcardsPreview />;
            case 'AI Study Buddy':
                return <TutorPreview />;
            case 'Smart Study Planner':
                return <StudyPlannerPreview />;
            case 'AI Podcast Generator':
                return <AudioLearningPreview />;
            case 'Adaptive Practice Tests':
                return <PracticeTestPreview />;
            case 'Document-Specific Chat':
                return <DocumentChatPreview />;
            default:
                return <AISummaryPreview />;
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex flex-col items-start justify-start pt-16 xs:pt-16 sm:pt-4 sm:justify-center p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 overflow-y-auto"
                >
                    <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-5 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8 items-center">
                        <div className="lg:col-span-2 flex flex-col justify-center space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                                className="inline-flex items-center justify-center p-1.5 xs:p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 w-fit shadow-lg"
                            >
                                <Icon className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-300" />
                            </motion.div>

                            <div className="space-y-3 xs:space-y-4">
                                <motion.h3
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                    className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight"
                                >
                                    {title}
                                </motion.h3>

                                <motion.p
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.4 }}
                                    className="text-slate-400 text-xs xs:text-sm md:text-base leading-relaxed"
                                >
                                    {description}
                                </motion.p>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="lg:col-span-3 w-full h-full flex items-center justify-center relative mt-4 xs:mt-6 sm:mt-0"
                        >
                            <div className="w-full max-w-full">
                                {getPreviewComponent()}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const FeatureTab = ({
    isActive,
    onSelect,
    icon: Icon,
    title,
    index
}: {
    isActive: boolean;
    onSelect: () => void;
    icon: React.ComponentType<React.ComponentProps<LucideIcon>>;
    title: string;
    index: number;
}) => {
    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            onClick={onSelect}
            className={`relative flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${isActive
                ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30'
                : 'hover:bg-white/5 border border-transparent'
                }`}
        >
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${isActive
                ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                : 'bg-slate-800 text-slate-400'
                } transition-all duration-300`}>
                <Icon className="w-5 h-5" />
            </div>
            <span className={`text-base font-medium ${isActive ? 'text-white' : 'text-slate-400'
                } transition-colors duration-300`}>
                {title}
            </span>
            {isActive && (
                <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-4 text-blue-400"
                    transition={{ type: "spring", duration: 0.5 }}
                >
                    <div className="w-5 h-5 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </motion.div>
            )}
        </motion.button>
    );
};

export function Features() {
    const [activeFeature, setActiveFeature] = React.useState(0);
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    const features = [
        {
            icon: FileTextIcon,
            title: "AI Summary",
            description: "Instantly generate comprehensive summaries of your study materials with key points, detailed explanations, and important terms highlighted for quick review and better retention."
        },
        {
            icon: BookOpenIcon,
            title: "Instant Flashcards & Quizzes",
            description: "Upload any study material and our AI instantly generates personalized flashcards and quizzes that target exactly what you need to learn."
        },
        {
            icon: Brain,
            title: "AI Study Buddy",
            description: "Get instant, detailed explanations for any concept you're struggling with. Like having a 24/7 private tutor that knows exactly how to help you understand."
        },
        {
            icon: Clock,
            title: "Smart Study Planner",
            description: "Our AI analyzes your learning style and schedule to create a personalized study plan that maximizes retention while minimizing time spent."
        },
        {
            icon: Headphones,
            title: "AI Podcast Generator",
            description: "Transform any text into podcast-style audio lessons you can listen to while commuting, exercising, or relaxing—turning downtime into productive learning."
        },
        {
            icon: GraduationCap,
            title: "Adaptive Practice Tests",
            description: "Take realistic practice exams that adapt to your knowledge level, focusing more on areas where you need improvement and less on what you've mastered."
        },
        {
            icon: MessageCircleIcon,
            title: "Document-Specific Chat",
            description: "Chat directly with your study materials. Ask questions about specific paragraphs, request summaries, or get clarification on complex topics instantly."
        },
    ];

    const handleSelectFeature = (index: number) => {
        setActiveFeature(index);
    };

    // Floating elements animation
    const floatingElements = [
        { delay: 0, duration: 15, x: [-20, 20], y: [-15, 15] },
        { delay: 5, duration: 18, x: [10, -10], y: [10, -10] },
        { delay: 2, duration: 13, x: [-5, 15], y: [15, -5] },
        { delay: 8, duration: 16, x: [15, -5], y: [-10, 20] }
    ];

    return (
        <section ref={ref} className="w-full py-24 overflow-hidden relative">
            {/* Animated gradient background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {floatingElements.map((element, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-72 h-72 rounded-full bg-gradient-to-br from-blue-600/5 to-purple-600/5 blur-3xl"
                        style={{
                            top: `${30 + i * 15}%`,
                            left: `${10 + i * 20}%`,
                        }}
                        animate={{
                            x: element.x,
                            y: element.y,
                        }}
                        transition={{
                            repeat: Infinity,
                            repeatType: "reverse",
                            duration: element.duration,
                            delay: element.delay,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center text-center mb-16"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-blue-300 rounded-full bg-blue-900/20 border border-blue-500/20"
                    >
                        AI powered Features
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4"
                    >
                        Features That <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Enhance Your Learning</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto text-center mb-12"
                    >
                        Upload any study material and our AI instantly transforms it into powerful learning tools.
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-2
                            [&::-webkit-scrollbar]:w-2
                            [&::-webkit-scrollbar-track]:bg-slate-950/50
                            [&::-webkit-scrollbar-track]:rounded-full
                            [&::-webkit-scrollbar-thumb]:bg-gradient-to-b
                            [&::-webkit-scrollbar-thumb]:from-blue-600/50
                            [&::-webkit-scrollbar-thumb]:to-purple-600/50
                            [&::-webkit-scrollbar-thumb]:rounded-full
                            [&::-webkit-scrollbar-thumb]:border-4
                            [&::-webkit-scrollbar-thumb]:border-solid
                            [&::-webkit-scrollbar-thumb]:border-transparent
                            [&::-webkit-scrollbar-thumb]:bg-clip-padding
                            [&::-webkit-scrollbar-thumb]:backdrop-blur-xl
                            hover:[&::-webkit-scrollbar-thumb]:from-blue-500/50
                            hover:[&::-webkit-scrollbar-thumb]:to-purple-500/50
                            [&::-webkit-scrollbar-thumb]:shadow-2xl
                            [&::-webkit-scrollbar]:hover:w-3
                            transition-all
                            duration-300"
                    >
                        {features.map((feature, index) => (
                            <FeatureTab
                                key={index}
                                isActive={activeFeature === index}
                                onSelect={() => handleSelectFeature(index)}
                                icon={feature.icon}
                                title={feature.title}
                                index={index}
                            />
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        className="relative h-[450px] sm:h-[450px] md:h-[500px] lg:h-auto lg:col-span-2 rounded-2xl border border-blue-500/20 bg-black/30 backdrop-blur-sm overflow-hidden"
                    >
                        {features.map((feature, index) => (
                            <FeatureHighlight
                                key={index}
                                isActive={activeFeature === index}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}