import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, ChevronRight, X } from 'lucide-react';
import { SpeedometerGauge } from './SpeedometerGauge';

interface Question {
  id: number;
  question: string;
  context?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const PreTestSectionComponent: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll and listen for Escape key when pop-out is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  const questions: Question[] = [
    {
      id: 1,
      question: 'What is the default subnet mask and total IP address count in a standard /24 network?',
      context: 'Fundamental IPv4 CIDR boundary definition.',
      options: [
        '255.255.255.0 with 256 total IP addresses (254 usable hosts)',
        '255.255.0.0 with 65,536 total IP addresses (65,534 usable hosts)',
        '255.255.255.128 with 128 total IP addresses (126 usable hosts)',
        '255.255.255.240 with 16 total IP addresses (14 usable hosts)',
      ],
      correctIndex: 0,
      explanation: 'A /24 network has 24 network bits and 8 host bits. Total addresses = 2⁸ = 256. Subnet mask is 255.255.255.0.',
    },
    {
      id: 2,
      question: 'What is the fundamental architectural topology requirement for all non-backbone OSPF areas?',
      context: 'OSPF multi-area design specification (RFC 2328).',
      options: [
        'All non-backbone areas must directly connect physically or virtually to Area 0 (Backbone)',
        'Non-backbone areas must connect in a daisy-chain ring with each adjacent area',
        'Non-backbone areas can only route packets via static default routes',
        'Non-backbone areas must deploy twice as many routers as the backbone area',
      ],
      correctIndex: 0,
      explanation: 'In multi-area OSPF, Area 0 serves as the hub. All non-backbone areas (e.g., Area 10, Area 20) must attach directly to Area 0 via an Area Border Router (ABR) to prevent inter-area routing loops.',
    },
    {
      id: 3,
      question: 'Which formula calculates the number of usable host addresses given h host bits?',
      context: 'Subnet sizing and host calculation.',
      options: [
        '2ʰ - 2 (subtracting the network ID and the broadcast address)',
        '2ʰ (all bit combinations are usable for endpoints)',
        '2ʰ⁻¹ - 1 (deducting the gateway and multicast channels)',
        '2ʰ + 2 (including loopback and VIP offsets)',
      ],
      correctIndex: 0,
      explanation: 'Given h host bits, 2ʰ total addresses exist. We must subtract 2: all 0s in the host field represents the Network ID, and all 1s represents the Directed Broadcast.',
    },
    {
      id: 4,
      question: 'What is the equivalent wildcard mask for the subnet mask 255.255.255.192 (/26)?',
      context: 'Cisco IOS OSPF network statement matching.',
      options: [
        '0.0.0.63 (calculated by subtracting 255.255.255.192 from 255.255.255.255)',
        '0.0.0.127 (matching a /25 boundary)',
        '0.0.0.31 (matching a /27 boundary)',
        '0.0.0.255 (matching a /24 boundary)',
      ],
      correctIndex: 0,
      explanation: 'Wildcard masks invert subnet masks. 255 - 255 = 0, 255 - 255 = 0, 255 - 255 = 0, and 255 - 192 = 63, yielding 0.0.0.63.',
    },
  ];

  const handleSelect = (qId: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: (correct / questions.length) * 100,
    };
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const scoreData = calculateScore();
  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <section id="diagnostics" className="relative py-8 sm:py-10 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-24">
      {/* Bento Launcher Card matching Reference UI */}
      <div className="relative rounded-[28px] p-7 sm:p-9 md:p-10 bg-[var(--bg-card)] border border-[var(--hairline)] shadow-[var(--pro-card-shadow)] hover:border-[var(--pro-card-hover-border)] transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-neutral-600 dark:text-neutral-400 font-mono text-xs tracking-[0.25em] uppercase font-semibold mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-200" />
              <span>PHASE 1 • BASELINE ASSESSMENT</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight text-[var(--text-primary)] mb-2">
              Pre-Test
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-body">
              Assess your foundational understanding of IPv4 address exhaustion and IPv6 transition principles before starting the lab.
            </p>
            {isSubmitted && (
              <div className="mt-3 flex items-center gap-3 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Score: {scoreData.correct}/{scoreData.total} ({Math.round(scoreData.percentage)}%)
                </span>
                <span className="text-[var(--text-muted)]">Completed</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="w-fit shrink-0 self-start sm:self-center px-6 py-2.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-medium text-xs sm:text-sm tracking-wide shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2 border border-transparent dark:border-white/10"
          >
            <span>{isSubmitted ? 'Review Pre-Test' : 'Take Pre-Test'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pop-Out Modal Dialog */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="pretest-modal-title"
                className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-hidden"
              >
                {/* Backdrop with Blur */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
                />

                {/* Modal Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 15 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  className="relative w-full max-w-5xl max-h-[90vh] bg-[var(--bg)] border border-[var(--hairline)] rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden z-10"
                >
                  {/* Modal Header */}
                  <div className="p-5 sm:p-6 border-b border-[var(--hairline)] bg-[var(--bg-card)] flex items-center justify-between shrink-0">
                    <div>
                      <div className="text-neutral-600 dark:text-neutral-400 font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase font-semibold mb-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-200" />
                        <span>Phase 1 • Baseline Assessment</span>
                      </div>
                      <h3
                        id="pretest-modal-title"
                        className="text-xl sm:text-2xl font-heading font-semibold tracking-tight text-[var(--text-primary)]"
                      >
                        Pre-Test Assessment
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      {isSubmitted && (
                        <button
                          onClick={handleReset}
                          className="rounded-full px-3.5 py-1.5 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-[var(--hairline)] transition-all cursor-pointer flex items-center gap-1.5"
                          title="Reset & Retake"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Retake</span>
                        </button>
                      )}

                      <button
                        onClick={() => setIsOpen(false)}
                        aria-label="Close dialog"
                        className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[var(--text-primary)] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Scrollable Body */}
                  <div className="overflow-y-auto p-5 sm:p-8 flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Left: 4 Diagnostic Questions */}
                      <div className="lg:col-span-8 space-y-6">
                        {questions.map((q, idx) => {
                          const selected = selectedAnswers[q.id];
                          const isCorrect = selected === q.correctIndex;

                          return (
                            <div
                              key={q.id}
                              className="rounded-[24px] p-6 sm:p-7 bg-[var(--bg-card)] border border-[var(--hairline)] transition-all duration-200"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400 font-medium uppercase tracking-wider">
                                  Question 0{idx + 1}
                                </span>
                                {isSubmitted && (
                                  <span
                                    className={`text-xs font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                      isCorrect
                                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                                        : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                                    }`}
                                  >
                                    {isCorrect ? (
                                      <>
                                        <CheckCircle2 className="w-3 h-3" /> Correct
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="w-3 h-3" /> Incorrect
                                      </>
                                    )}
                                  </span>
                                )}
                              </div>

                              <h4 className="text-base sm:text-lg font-heading font-medium tracking-tight text-[var(--text-primary)] mb-2 leading-snug">
                                {q.question}
                              </h4>
                              {q.context && (
                                <p className="text-xs text-[var(--text-secondary)] font-mono mb-4">
                                  {q.context}
                                </p>
                              )}

                              {/* Options */}
                              <div className="space-y-2.5">
                                {q.options.map((opt, optIdx) => {
                                  const isOptionSelected = selected === optIdx;
                                  let optionStyle =
                                    'bg-[var(--input-bg)] border-[var(--hairline)] text-[var(--text-secondary)] hover:border-[var(--pro-card-hover-border)] hover:text-[var(--text-primary)]';

                                  if (isSubmitted) {
                                    if (optIdx === q.correctIndex) {
                                      optionStyle =
                                        'bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-medium';
                                    } else if (isOptionSelected && !isCorrect) {
                                      optionStyle =
                                        'bg-rose-500/10 border-rose-500/40 text-rose-800 dark:text-rose-300';
                                    } else {
                                      optionStyle =
                                        'bg-black/5 dark:bg-white/[0.02] border-[var(--hairline-subtle)] text-[var(--text-muted)] opacity-60';
                                    }
                                  } else if (isOptionSelected) {
                                    optionStyle =
                                      'bg-neutral-100 border-neutral-400 text-neutral-900 font-medium shadow-sm dark:bg-white/10 dark:border-white/30 dark:text-white dark:shadow-[0_0_15px_rgba(255,255,255,0.08)]';
                                  }

                                  return (
                                    <button
                                      key={optIdx}
                                      onClick={() => handleSelect(q.id, optIdx)}
                                      disabled={isSubmitted}
                                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition-all duration-200 flex items-start gap-3 cursor-pointer ${optionStyle}`}
                                    >
                                      <span className="w-5 h-5 rounded-full border border-current/30 shrink-0 flex items-center justify-center font-mono text-xs mt-0.5">
                                        {String.fromCharCode(65 + optIdx)}
                                      </span>
                                      <span className="leading-relaxed font-body">{opt}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Explanation Drawer if Submitted */}
                              {isSubmitted && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="mt-4 p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--hairline-subtle)] text-xs text-[var(--text-secondary)] font-body leading-relaxed"
                                >
                                  <span className="text-[var(--text-primary)] font-semibold uppercase tracking-wider block mb-1 font-mono text-[11px]">
                                    Rationale:
                                  </span>
                                  {q.explanation}
                                </motion.div>
                              )}
                            </div>
                          );
                        })}

                        {!isSubmitted && (
                          <div className="flex justify-end pt-2">
                            <button
                              onClick={handleSubmit}
                              disabled={!allAnswered}
                              className={`rounded-full px-8 py-3.5 text-xs font-mono font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                                allAnswered
                                  ? 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_0_25px_rgba(255,255,255,0.2)] cursor-pointer'
                                  : 'bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500 opacity-50 cursor-not-allowed'
                              }`}
                            >
                              <span>Submit Assessment</span>
                              <ArrowRight className="w-4 h-4 text-white dark:text-neutral-950" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right: Speedometer Gauge */}
                      <div className="lg:col-span-4 lg:sticky lg:top-0 space-y-6">
                        <SpeedometerGauge
                          score={isSubmitted ? scoreData.percentage : 0}
                          totalQuestions={questions.length}
                          correctCount={isSubmitted ? scoreData.correct : 0}
                          label="Diagnostic Accuracy"
                          statusRating={
                            isSubmitted
                              ? scoreData.percentage === 100
                                ? 'PERFECT'
                                : scoreData.percentage >= 75
                                ? 'QUALIFIED'
                                : 'REVIEW REQUIRED'
                              : 'PENDING'
                          }
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
};

export const PreTestSection = React.memo(PreTestSectionComponent);
