import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react';
import { SpeedometerGauge } from './SpeedometerGauge';

interface PostQuestion {
  id: number;
  question: string;
  scenario: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  ciscoCommand?: string;
}

const PostTestSectionComponent: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedDrawers, setExpandedDrawers] = useState<Record<number, boolean>>({});
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

  const questions: PostQuestion[] = [
    {
      id: 1,
      question:
        'Which summarized CIDR route must be configured on the Area 20 ABR to encompass all building subnets across 10.10.4.0 through 10.10.7.255?',
      scenario:
        'Area 20 contains Wi-Fi (/23), Classrooms (/24), and Executive Admin (/25) spanning 4 contiguous Class C blocks.',
      options: [
        '10.10.4.0/22 (Mask: 255.255.252.0, aggregating 1,024 addresses into a single Type 3 LSA)',
        '10.10.0.0/21 (Supernet that inadvertently encapsulates Area 10, causing blackholes)',
        '10.10.4.0/24 (Under-summarized prefix that ignores Classrooms and Admin subnets)',
        '10.10.4.0/20 (Over-summarized mask spanning 4,096 addresses, causing route collision)',
      ],
      correctIndex: 0,
      rationale:
        'Area 20 subnets span 10.10.4.0 through 10.10.7.255, which is exactly 4 contiguous /24 blocks (4 × 256 = 1,024 addresses). The block size of 4 in the 3rd octet requires 2 borrowed host bits from /24, resulting in a /22 mask (255.255.252.0). Cisco syntax: area 20 range 10.10.4.0 255.255.252.0.',
      ciscoCommand: 'area 20 range 10.10.4.0 255.255.252.0',
    },
    {
      id: 2,
      question:
        'How many usable host IP addresses are yielded respectively by a /25 subnet versus a /26 subnet?',
      scenario:
        'Designing the departmental subnets for IT Laboratory (110 hosts) and Faculty (50 hosts).',
      options: [
        '/25 provides 126 usable hosts (2⁷ - 2), while /26 provides 62 usable hosts (2⁶ - 2)',
        '/25 provides 128 usable hosts, while /26 provides 64 usable hosts',
        '/25 provides 254 usable hosts, while /26 provides 126 usable hosts',
        '/25 provides 62 usable hosts, while /26 provides 30 usable hosts',
      ],
      correctIndex: 0,
      rationale:
        'A /25 leaves 7 host bits (32 - 25 = 7), giving 2⁷ - 2 = 126 usable hosts, perfect for IT Lab (110 needed). A /26 leaves 6 host bits (32 - 26 = 6), giving 2⁶ - 2 = 62 usable hosts, perfect for Faculty (50 needed).',
      ciscoCommand: 'interface GigabitEthernet0/0/1.30 -> ip address 10.10.3.1 255.255.255.128',
    },
    {
      id: 3,
      question:
        'What is the critical security and efficiency rationale for configuring "passive-interface" on user-facing switch ports?',
      scenario:
        'Deploying GigabitEthernet0/0/1.10 serving 450 campus Wi-Fi mobile clients.',
      options: [
        'Suppresses OSPF Hello multicasts to protect CPU & prevent rogue routers from forming unauthorized adjacencies, while still advertising the subnet into OSPF',
        'Completely disables layer 3 forwarding and drops all client IPv4 unicast packets',
        'Converts the sub-interface into an unmanaged dot1q trunk carrying all campus VLANs',
        'Forces the router to flood Type 5 External LSAs out to client smartphones',
      ],
      correctIndex: 0,
      rationale:
        'End-user access segments contain zero routers. Emitting OSPF Hellos (224.0.0.5) wastes CPU/bandwidth and invites malicious rogue routers to inject bogus LSA routes. "passive-interface" stops hello packet generation on the interface while preserving the route advertisement in the OSPF database.',
      ciscoCommand: 'router ospf 1\n passive-interface GigabitEthernet0/0/1.10',
    },
    {
      id: 4,
      question:
        'What architectural advantage is unlocked by declaring "ip ospf network point-to-point" on inter-router /30 transit links?',
      scenario:
        'Establishing dual uplink links between Core Router and Engineering ABR over GigabitEthernet0/0/0.',
      options: [
        'Eliminates DR/BDR election overhead and wait timers (40s dead interval wait), allowing instantaneous FULL adjacency convergence',
        'Increases Ethernet frame MTU from 1500 bytes to 9216 jumbo bytes',
        'Automatically enables IPSec AES-256 payload encryption across the copper cable',
        'Forces both routers to share identical Loopback Router IDs',
      ],
      correctIndex: 0,
      rationale:
        'Ethernet interfaces default to Broadcast network type, requiring Designated Router (DR) and Backup Designated Router (BDR) elections with a 40-second wait timer. On a point-to-point link with only two routers, DR/BDR elections are redundant. Setting point-to-point achieves instant Full adjacency without unnecessary election packets.',
      ciscoCommand: 'interface GigabitEthernet0/0/0\n ip ospf network point-to-point',
    },
  ];

  const handleSelect = (qId: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const toggleDrawer = (qId: number) => {
    setExpandedDrawers((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    const percentage = (correct / questions.length) * 100;

    let status = 'NEEDS REVIEW';
    if (percentage === 100) status = 'PRO ARCHITECT';
    else if (percentage >= 75) status = 'CERTIFIED';
    else if (percentage >= 50) status = 'PRACTITIONER';

    return {
      correct,
      total: questions.length,
      percentage,
      status,
    };
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const allExpanded: Record<number, boolean> = {};
    questions.forEach((q) => (allExpanded[q.id] = true));
    setExpandedDrawers(allExpanded);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setExpandedDrawers({});
  };

  const scoreData = calculateScore();
  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <section id="mastery" className="relative py-8 sm:py-10 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-24">
      {/* Bento Launcher Card matching Reference UI */}
      <div className="relative rounded-[28px] p-7 sm:p-9 md:p-10 bg-[var(--bg-card)] border border-[var(--hairline)] shadow-[var(--pro-card-shadow)] hover:border-[var(--pro-card-hover-border)] transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-neutral-600 dark:text-neutral-400 font-mono text-xs tracking-[0.25em] uppercase font-semibold mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-200" />
              <span>PHASE 2 • POST-ASSESSMENT</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight text-[var(--text-primary)] mb-2">
              Post-Test
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-body">
              Assess your comprehensive mastery of VLSM subnetting, multi-area OSPFv2 route summarization, and Cisco IOS CLI syntax after completing the lab.
            </p>
            {isSubmitted && (
              <div className="mt-3 flex items-center gap-3 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Score: {scoreData.correct}/{scoreData.total} ({Math.round(scoreData.percentage)}%) • {scoreData.status}
                </span>
                <span className="text-[var(--text-muted)]">Completed</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="w-fit shrink-0 self-start sm:self-center px-6 py-2.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-medium text-xs sm:text-sm tracking-wide shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2 border border-transparent dark:border-white/10"
          >
            <span>{isSubmitted ? 'Review Post-Test' : 'Take Post-Test'}</span>
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
                aria-labelledby="posttest-modal-title"
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
                        <span>Phase 2 • Post-Assessment</span>
                      </div>
                      <h3
                        id="posttest-modal-title"
                        className="text-xl sm:text-2xl font-heading font-semibold tracking-tight text-[var(--text-primary)]"
                      >
                        Post-Test: Campus Engineering Mastery
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
                      {/* Left: Questions */}
                      <div className="lg:col-span-8 space-y-6">
                        {questions.map((q, idx) => {
                          const selected = selectedAnswers[q.id];
                          const isCorrect = selected === q.correctIndex;
                          const isDrawerOpen = !!expandedDrawers[q.id];

                          return (
                            <div
                              key={q.id}
                              className="rounded-[24px] p-6 sm:p-7 bg-[var(--bg-card)] border border-[var(--hairline)] transition-all duration-200"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400 font-medium uppercase tracking-wider">
                                  Mastery Scenario 0{idx + 1}
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
                                        <CheckCircle2 className="w-3 h-3" /> Verified
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="w-3 h-3" /> Failed
                                      </>
                                    )}
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-[var(--text-secondary)] font-mono mb-2">
                                [Scenario: {q.scenario}]
                              </p>
                              <h4 className="text-base sm:text-lg font-heading font-medium tracking-tight text-[var(--text-primary)] mb-4 leading-snug">
                                {q.question}
                              </h4>

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

                              {/* Cisco IOS Rationale & CLI Output Drawer */}
                              {isSubmitted && (
                                <div className="mt-4 border-t border-[var(--hairline-subtle)] pt-3">
                                  <button
                                    onClick={() => toggleDrawer(q.id)}
                                    className="flex items-center justify-between w-full text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-1 cursor-pointer"
                                  >
                                    <span className="font-semibold uppercase tracking-wider">
                                      IOS Configuration & Rationale
                                    </span>
                                    {isDrawerOpen ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )}
                                  </button>

                                  <AnimatePresence>
                                    {isDrawerOpen && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3 pt-2"
                                      >
                                        <p className="text-xs text-[var(--text-secondary)] font-body leading-relaxed bg-[var(--bg-card-subtle)] p-3 rounded-xl border border-[var(--hairline-subtle)]">
                                          {q.rationale}
                                        </p>

                                        {q.ciscoCommand && (
                                          <div className="p-3 rounded-xl bg-[var(--code-bg)] border border-[var(--hairline-subtle)] text-[var(--text-primary)] font-mono text-[11px] overflow-x-auto whitespace-pre">
                                            <span className="text-[var(--text-muted)] block mb-1">
                                              # Verified Cisco IOS CLI Syntax
                                            </span>
                                            {q.ciscoCommand}
                                          </div>
                                        )}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
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
                              <span>Verify Mastery</span>
                              <Sparkles className="w-4 h-4 text-white dark:text-neutral-950" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right: Speedometer Gauge & Mastery Thresholds */}
                      <div className="lg:col-span-4 lg:sticky lg:top-0 space-y-6">
                        <SpeedometerGauge
                          score={isSubmitted ? scoreData.percentage : 0}
                          totalQuestions={questions.length}
                          correctCount={isSubmitted ? scoreData.correct : 0}
                          label="Mastery Index"
                          statusRating={isSubmitted ? scoreData.status : 'UNVERIFIED'}
                        />

                        {/* Attestation ID Plaque */}
                        {isSubmitted && scoreData.percentage >= 75 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-5 rounded-[24px] bg-emerald-500/10 border border-emerald-500/30 text-xs text-center space-y-2"
                          >
                            <div className="text-emerald-700 dark:text-emerald-400 font-mono font-semibold uppercase tracking-wider text-[11px]">
                              OSPFv2 Engineer Certified
                            </div>
                            <div className="font-mono text-[10px] text-[var(--text-muted)] truncate">
                              ID: OSPF-VLAB-{Math.random().toString(36).substring(2, 9).toUpperCase()}
                            </div>
                          </motion.div>
                        )}

                        <div className="p-6 rounded-[24px] bg-[var(--bg-card)] border border-[var(--hairline)] text-xs space-y-3 font-mono text-[var(--text-secondary)] transition-colors duration-250">
                          <div className="text-[var(--text-primary)] font-medium uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white" />
                            Mastery Thresholds
                          </div>
                          <div className="space-y-1.5 text-[11px]">
                            <div className="flex justify-between py-1 border-b border-[var(--hairline-subtle)]">
                              <span className="text-[var(--text-primary)] font-semibold">
                                100% Score
                              </span>
                              <span className="text-[var(--text-primary)] font-semibold">
                                PRO ARCHITECT
                              </span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-[var(--hairline-subtle)]">
                              <span className="text-[var(--text-secondary)] font-medium">
                                75% Score
                              </span>
                              <span className="text-[var(--text-secondary)]">CERTIFIED</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-[var(--hairline-subtle)]">
                              <span className="text-[var(--text-secondary)] font-medium">
                                50% Score
                              </span>
                              <span className="text-[var(--text-muted)]">PRACTITIONER</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span className="text-rose-600 dark:text-rose-400">&lt; 50% Score</span>
                              <span className="text-[var(--text-muted)]">NEEDS REVIEW</span>
                            </div>
                          </div>
                        </div>
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

export const PostTestSection = React.memo(PostTestSectionComponent);
