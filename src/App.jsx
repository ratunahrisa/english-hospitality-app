import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Home,
  BookOpen,
  ScanLine,
  Mic,
  ClipboardCheck,
  TrendingUp,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Lock,
  Volume2,
  Play,
  Award,
  Sparkles,
  X,
  Camera,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { DEPARTMENTS, AR_OBJECTS } from './data/hospitalityData';

const STORAGE_KEY = 'hosp_english_dashboard_v1';

export default function App() {
  const [savedState, setSavedState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [departments, setDepartments] = useState(
    () => savedState?.departments || DEPARTMENTS
  );
  const [activeDeptId, setActiveDeptId] = useState(
    () => savedState?.activeDeptId || 'front-office'
  );
  const [activeTopicId, setActiveTopicId] = useState(
    () => savedState?.activeTopicId || 'fo-1'
  );
  const [activeStep, setActiveStep] = useState(1); // 1: Vocabulary, 2: Pronunciation, 3: Roleplay
  const [scores, setScores] = useState(
    () =>
      savedState?.scores || {
        fluency: 90,
        vocabulary: 95,
        politeness: 92,
        overallProgress: 75,
      }
  );

  // Interactive UI states
  const [recordingStatus, setRecordingStatus] = useState('idle'); // idle | recording | unclear | clear
  const [roleplayInput, setRoleplayInput] = useState('');
  const [roleplayFeedback, setRoleplayFeedback] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // null | 'ar' | 'video' | 'certificate' | 'progress'
  const [selectedArId, setSelectedArId] = useState('bell');
  const [toast, setToast] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ departments, activeDeptId, activeTopicId, scores })
      );
    } catch (e) {
      console.error(e);
    }
  }, [departments, activeDeptId, activeTopicId, scores]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  };

  const activeDept = useMemo(
    () => departments.find((d) => d.id === activeDeptId) || departments[0],
    [departments, activeDeptId]
  );

  const activeTopic = useMemo(
    () =>
      activeDept.topics.find((t) => t.id === activeTopicId) ||
      activeDept.topics[0],
    [activeDept, activeTopicId]
  );

  const handleSelectDepartment = (deptId) => {
    const targetDept = departments.find((d) => d.id === deptId);
    if (!targetDept) return;
    setActiveDeptId(deptId);
    const firstUnlocked =
      targetDept.topics.find((t) => t.unlocked && !t.completed) ||
      targetDept.topics[0];
    setActiveTopicId(firstUnlocked.id);
    setActiveStep(1);
    setRecordingStatus('idle');
    setRoleplayFeedback(null);
    setCurrentPage('learning');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Membuka modul ${targetDept.name}`);
  };

  const handleSelectTopic = (topic) => {
    if (!topic.unlocked) {
      showToast('Topik terkunci! Selesaikan topik sebelumnya terlebih dahulu.');
      return;
    }
    setActiveTopicId(topic.id);
    setActiveStep(1);
    setRecordingStatus('idle');
    setRoleplayFeedback(null);
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      showToast(`Audio: "${text}"`);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  };

  const handleListenAll = () => {
    const joined = activeTopic.vocab.map((v) => v.en).join('. ');
    speakText(joined);
  };

  const handleRecordPronunciation = () => {
    setRecordingStatus('recording');
    setTimeout(() => {
      // Simulasi cek kualitas audio: bisa diganti SpeechRecognition nyata di browser pendukung
      const isClear = Math.random() > 0.25;
      if (!isClear) {
        setRecordingStatus('unclear');
      } else {
        setRecordingStatus('clear');
        setScores((prev) => ({
          ...prev,
          fluency: Math.min(99, prev.fluency + 1),
        }));
      }
    }, 1400);
  };

  const handleCompleteTopic = () => {
    setDepartments((prev) =>
      prev.map((dept) => {
        if (dept.id !== activeDept.id) return dept;
        const idx = dept.topics.findIndex((t) => t.id === activeTopic.id);
        const updatedTopics = dept.topics.map((t, i) => {
          if (i === idx) return { ...t, completed: true, unlocked: true };
          if (i === idx + 1) return { ...t, unlocked: true };
          return t;
        });
        return { ...dept, topics: updatedTopics };
      })
    );

    setScores((prev) => ({
      ...prev,
      overallProgress: Math.min(100, prev.overallProgress + 5),
      vocabulary: Math.min(99, prev.vocabulary + 1),
      politeness: Math.min(99, prev.politeness + 1),
    }));

    setRoleplayFeedback({
      fluency: '92% — Smooth pacing and natural pauses',
      vocabulary: '96% — Accurate hospitality expressions',
      pronunciation: '91% — Clear articulation',
      relevance: '95% — Directly answers the guest scenario',
      politeness: '96% — Courteous and service-oriented tone',
    });

    showToast('Progress tersimpan & topik berikutnya terbuka!');
  };

  const handleResetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDepartments(DEPARTMENTS);
    setActiveDeptId('front-office');
    setActiveTopicId('fo-1');
    setActiveStep(1);
    setScores({
      fluency: 90,
      vocabulary: 95,
      politeness: 92,
      overallProgress: 75,
    });
    setRoleplayFeedback(null);
    setRecordingStatus('idle');
    showToast('Data progress direset ke awal');
  };

  const selectedArObject =
    AR_OBJECTS.find((item) => item.id === selectedArId) || AR_OBJECTS[0];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen bg-[#eef3fa] text-slate-800 pb-10">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-[#173a7a] via-[#1e4b99] to-[#2358b0] text-white shadow-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5">
          {/* Brand */}
          <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-slate-900 shadow">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  aria-label="Toggle navigation menu"
                  className="relative rounded-xl bg-white/15 p-2 text-white hover:bg-white/25"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-400" />
                </button>
            </div>
            <div>
              <div className="text-base font-bold leading-tight tracking-tight sm:text-lg">
                English for Hospitality
              </div>
              <div className="text-[11px] text-blue-100">
                Learn • Practice • Work Globally
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden items-center gap-1 lg:flex">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/25"
            >
              <Home className="h-3.5 w-3.5" /> Home
            </button>
            <a
              href="#learning-modules"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-100 hover:bg-white/10 hover:text-white"
            >
              <BookOpen className="h-3.5 w-3.5" /> My Learning
            </a>
            <button
              onClick={() => setActiveModal('ar')}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-100 hover:bg-white/10 hover:text-white"
            >
              <ScanLine className="h-3.5 w-3.5" /> AR Scanner
            </button>
            <button
              onClick={() => {
                setActiveStep(3);
                document
                  .getElementById('learning-path')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-100 hover:bg-white/10 hover:text-white"
            >
              <Mic className="h-3.5 w-3.5" /> AI Roleplay
            </button>
            <button
              onClick={() => setActiveModal('progress')}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-100 hover:bg-white/10 hover:text-white"
            >
              <ClipboardCheck className="h-3.5 w-3.5" /> Assessment
            </button>
            <button
              onClick={() => setActiveModal('progress')}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-100 hover:bg-white/10 hover:text-white"
            >
              <TrendingUp className="h-3.5 w-3.5" /> My Progress
            </button>
          </nav>

          {/* Right User Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDemo}
              title="Reset Demo Progress"
              className="rounded-full p-2 text-blue-100 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <div className="relative rounded-full p-2 text-blue-100 hover:bg-white/10 hover:text-white">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-400" />
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/15 py-1 pl-1.5 pr-3">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                alt="Siti"
                className="h-7 w-7 rounded-full object-cover"
              />
              <span className="text-xs font-semibold">Hi, Siti!</span>
              <ChevronDown className="h-3.5 w-3.5 text-blue-100" />
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
  <div className="border-b border-blue-900/20 bg-[#173a7a] px-4 py-3 text-white shadow-lg lg:hidden">
    <div className="mx-auto flex max-w-7xl flex-col gap-1.5 text-xs font-semibold">
      <button
        type="button"
        onClick={() => {
          setMobileMenuOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2.5 text-left hover:bg-white/20"
      >
        <Home className="h-4 w-4 text-amber-300" /> Home
      </button>

      <a
        href="#learning-modules"
        onClick={() => setMobileMenuOpen(false)}
        className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 hover:bg-white/15"
      >
        <BookOpen className="h-4 w-4 text-amber-300" /> My Learning
      </a>

      <button
        type="button"
        onClick={() => {
          setMobileMenuOpen(false);
          setActiveModal('ar');
        }}
        className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-left hover:bg-white/15"
      >
        <ScanLine className="h-4 w-4 text-amber-300" /> AR Scanner
      </button>

      <button
        type="button"
        onClick={() => {
          setMobileMenuOpen(false);
          setActiveStep(3);
          document
            .getElementById('learning-path')
            ?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-left hover:bg-white/15"
      >
        <Mic className="h-4 w-4 text-amber-300" /> AI Roleplay
      </button>

      <button
        type="button"
        onClick={() => {
          setMobileMenuOpen(false);
          setActiveModal('progress');
        }}
        className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-left hover:bg-white/15"
      >
        <ClipboardCheck className="h-4 w-4 text-amber-300" /> Assessment
      </button>

      <button
        type="button"
        onClick={() => {
          setMobileMenuOpen(false);
          setActiveModal('progress');
        }}
        className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-left hover:bg-white/15"
      >
        <TrendingUp className="h-4 w-4 text-amber-300" /> My Progress
      </button>
    </div>
  </div>
)}
      </header>

      <main className="mx-auto mt-4 max-w-7xl space-y-4 px-4">
        {currentPage === 'home' ? (
          <>
            {/* TOP ROW: HERO BANNER + YOUR LEARNING PROGRESS + PROMO CARD */}
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Hero Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#122a5c] via-[#1c428a] to-[#2c66c7] p-6 text-white shadow-sm lg:col-span-6">
                <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="max-w-sm space-y-2.5">
                    <h1 className="text-2xl font-extrabold leading-snug sm:text-3xl">
                      Speak English <br />
                      with <span className="text-amber-300">Confidence</span> <br />
                      in the Hospitality Industry
                    </h1>
                    <p className="text-xs text-blue-100 sm:text-sm">
                      Prepare for your global career in hotels, cruise ships, and
                      international tourism.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSelectDepartment(activeDeptId)}
                      className="mt-2 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-slate-900 shadow hover:bg-amber-300 sm:text-sm"
                    >
                      Start Learning <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Quick Department Pills on Hero Right */}
                  <div className="flex flex-col gap-1.5 sm:w-44">
                    {departments.map((dept) => (
                      <button
                        type="button"
                        key={dept.id}
                        onClick={() => handleSelectDepartment(dept.id)}
                        className={`rounded-xl px-3 py-2 text-left transition ${
                          activeDeptId === dept.id
                            ? 'bg-white text-[#173a7a] shadow'
                            : 'bg-white/90 text-slate-800 hover:bg-white'
                        }`}
                      >
                        <div className="text-xs font-bold">{dept.name}</div>
                        <div className="text-[10px] text-slate-500">
                          {dept.subtitle}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Your Learning Progress Card */}
              <div className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm lg:col-span-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-800">
                    Your Learning Progress
                  </h2>
                </div>

                <div className="my-3 flex items-center justify-around gap-3">
                  {/* Donut Ring */}
                  <div
                    className="relative flex h-24 w-24 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(#16a34a ${
                        scores.overallProgress * 3.6
                      }deg, #e2e8f0 0deg)`,
                    }}
                  >
                    <div className="flex h-18 w-18 items-center justify-center rounded-full bg-white text-xl font-extrabold text-[#173a7a]">
                      {scores.overallProgress}%
                    </div>
                  </div>

                  {/* Checklist */}
                  <ul className="space-y-1.5 text-xs font-medium text-slate-700">
                    {['Vocabulary', 'Listening', 'Roleplay', 'Assessment'].map(
                      (item) => (
                        <li key={item} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <span>{item}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setActiveModal('progress')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1e4b99] hover:underline"
                  >
                    View Details <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Promo Card */}
              <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#69b7ff] via-[#3c8ce7] to-[#174ea6] p-5 text-white shadow-sm lg:col-span-3">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold">
                    <Sparkles className="h-3 w-3" /> Global Career Track
                  </span>
                  <h3 className="mt-2 text-lg font-extrabold leading-snug">
                    Go Global <br />
                    with Your English Skills!
                  </h3>
                </div>
                <p className="mt-4 text-xs text-blue-50">
                  Master real-world hotel conversations across 4 core
                  departments.
                </p>
              </div>
            </section>

            {/* LEARNING MODULES SECTION (HOMEPAGE) */}
            <section
              id="learning-modules"
              className="rounded-2xl bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center gap-2 rounded-xl bg-[#173a7a] px-3.5 py-2.5 text-white">
                <BookOpen className="h-4 w-4 text-amber-300" />
                <div>
                  <h2 className="text-sm font-bold leading-none">
                    Learning Modules
                  </h2>
                  <p className="mt-0.5 text-[11px] text-blue-100">
                    Select your hospitality department to open its learning page
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {departments.map((dept) => {
                  const isSelected = dept.id === activeDeptId;
                  return (
                    <div
                      key={dept.id}
                      className={`flex flex-col justify-between rounded-2xl border p-2.5 transition ${
                        isSelected
                          ? 'border-amber-400 bg-amber-50/40 ring-2 ring-amber-300/60'
                          : 'border-slate-200 bg-slate-50/50 hover:border-blue-300'
                      }`}
                    >
                      <div>
                        <img
                          src={dept.image}
                          alt={dept.name}
                          className="h-28 w-full rounded-xl object-cover"
                        />
                        <h3 className="mt-2 text-center text-xs font-bold text-slate-800 sm:text-sm">
                          {dept.name}
                        </h3>
                        <p className="text-center text-[11px] text-slate-500">
                          {dept.subtitle}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectDepartment(dept.id)}
                        className={`mt-2.5 flex w-full items-center justify-center gap-1 rounded-xl py-1.5 text-xs font-bold text-white transition ${
                          isSelected
                            ? 'bg-[#173a7a] hover:bg-[#102957]'
                            : 'bg-[#2563eb] hover:bg-[#1d4ed8]'
                        }`}
                      >
                        Select <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* BOTTOM ROW: SUPPORTING FEATURES (LEFT) + HOSPITALITY SCORECARD (RIGHT) */}
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Supporting Features */}
              <div className="rounded-2xl bg-white p-4 shadow-sm lg:col-span-7">
                <div className="mb-3 flex items-center gap-2 rounded-xl bg-[#173a7a] px-3.5 py-2 text-white">
                  <span className="text-amber-300">★</span>
                  <div>
                    <h2 className="text-sm font-bold leading-none">
                      Supporting Features
                    </h2>
                    <p className="mt-0.5 text-[11px] text-blue-100">
                      Explore more tools to enhance your learning
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {/* AR Scanner */}
                  <button
                    type="button"
                    onClick={() => setActiveModal('ar')}
                    className="group flex flex-col justify-between rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-100/70 p-3.5 text-left transition hover:shadow-md"
                  >
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">
                        AR Scanner
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        Scan objects and learn the vocabulary!
                      </p>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1e4b99] text-white transition group-hover:translate-x-0.5">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </button>

                  {/* Instruction Video */}
                  <button
                    type="button"
                    onClick={() => setActiveModal('video')}
                    className="group flex flex-col justify-between rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-pink-100/70 p-3.5 text-left transition hover:shadow-md"
                  >
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">
                        Instruction Video
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        Learn with step-by-step guides
                      </p>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1e4b99] text-white transition group-hover:translate-x-0.5">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </button>

                  {/* Certificate */}
                  <button
                    type="button"
                    onClick={() => setActiveModal('certificate')}
                    className="group flex flex-col justify-between rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-100/70 p-3.5 text-left transition hover:shadow-md"
                  >
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">
                        Certificate
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        Get your certificate upon completion
                      </p>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1e4b99] text-white transition group-hover:translate-x-0.5">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Hospitality Scorecard */}
              <div className="flex flex-col justify-between rounded-2xl bg-white p-4 shadow-sm lg:col-span-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    <h2 className="text-base font-extrabold text-slate-900">
                      Hospitality Scorecard
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    Track your performance and see your progress!
                  </p>

                  <div className="my-4 grid grid-cols-3 gap-2 text-center">
                    {[
                      {
                        label: 'Fluency',
                        val: scores.fluency,
                        color: '#2563eb',
                      },
                      {
                        label: 'Vocabulary',
                        val: scores.vocabulary,
                        color: '#16a34a',
                      },
                      {
                        label: 'Politeness',
                        val: scores.politeness,
                        color: '#a855f7',
                      },
                    ].map((metric) => (
                      <div
                        key={metric.label}
                        className="flex flex-col items-center"
                      >
                        <div
                          className="flex h-20 w-20 items-center justify-center rounded-full"
                          style={{
                            background: `conic-gradient(${metric.color} ${
                              metric.val * 3.6
                            }deg, #e2e8f0 0deg)`,
                          }}
                        >
                          <div className="flex h-15 w-15 flex-col items-center justify-center rounded-full bg-white">
                            <span className="text-[11px] font-semibold text-slate-600">
                              {metric.label}
                            </span>
                            <span className="text-sm font-extrabold text-slate-900">
                              {metric.val}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setActiveModal('progress')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#173a7a] px-5 py-2 text-xs font-bold text-white shadow hover:bg-[#102957]"
                  >
                    View Score Details <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* DEDICATED LEARNING PAGE */
          <section className="space-y-4">
            {/* Learning Page Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage('home')}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  ← Back to Home
                </button>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#1e4b99]">
                    Department Learning Page
                  </div>
                  <h1 className="text-base font-extrabold text-slate-900 sm:text-lg">
                    {activeDept.name} Learning Path
                  </h1>
                </div>
              </div>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                Beginner to Advanced
              </span>
            </div>

            {/* Active Department Learning Path + 3-Step Workspace */}
            <div
              id="learning-path"
              className="rounded-2xl bg-white p-4 shadow-sm"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                {/* Topic List (1..N) */}
                <div className="space-y-1.5 md:col-span-5">
                  {activeDept.topics.map((topic, index) => {
                    const isCurrent = topic.id === activeTopic.id;
                    return (
                      <button
                        type="button"
                        key={topic.id}
                        onClick={() => handleSelectTopic(topic)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                          isCurrent
                            ? 'bg-[#1e4b99] font-bold text-white shadow-sm'
                            : topic.unlocked
                            ? 'bg-slate-50 font-medium text-slate-700 hover:bg-blue-50'
                            : 'cursor-not-allowed bg-slate-100/70 text-slate-400'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                              isCurrent
                                ? 'bg-amber-400 text-slate-900'
                                : topic.completed
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {index + 1}
                          </span>
                          <span className="truncate">{topic.title}</span>
                        </span>

                        {topic.completed ? (
                          <CheckCircle2
                            className={`h-4 w-4 shrink-0 ${
                              isCurrent ? 'text-amber-300' : 'text-emerald-500'
                            }`}
                          />
                        ) : !topic.unlocked ? (
                          <Lock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                {/* Active Topic Step Panel */}
                <div className="rounded-2xl border border-blue-100 bg-[#f6f9fe] p-3.5 md:col-span-7">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1e4b99] text-xs font-bold text-white">
                      {activeDept.topics.findIndex(
                        (t) => t.id === activeTopic.id
                      ) + 1}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      {activeTopic.title}
                    </h3>
                  </div>

                  {/* Step Switcher Pills */}
                  <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-xl bg-slate-200/70 p-1">
                    {[
                      { step: 1, label: 'Step 1: Vocabulary' },
                      { step: 2, label: 'Step 2: Pronunciation' },
                      { step: 3, label: 'Step 3: Roleplay' },
                    ].map((s) => (
                      <button
                        type="button"
                        key={s.step}
                        onClick={() => setActiveStep(s.step)}
                        className={`rounded-lg py-1.5 text-[11px] font-bold transition ${
                          activeStep === s.step
                            ? 'bg-[#173a7a] text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  {/* STEP 1: VOCABULARY + IN CONTEXT */}
                  {activeStep === 1 && (
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-12">
                      <div className="space-y-2 sm:col-span-7">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#173a7a]">
                            Useful Vocabulary
                          </span>
                          <button
                            type="button"
                            onClick={handleListenAll}
                            className="rounded-full bg-[#1e4b99] px-2.5 py-1 text-[10px] font-bold text-white hover:bg-[#173a7a]"
                          >
                            Listen All
                          </button>
                        </div>

                        {activeTopic.vocab.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between gap-2 rounded-xl bg-white p-2 shadow-2xs"
                          >
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                {item.en}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {item.id}
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              <button
                                type="button"
                                onClick={() => speakText(item.en)}
                                className="rounded-lg bg-blue-50 p-1.5 text-[#1e4b99] hover:bg-blue-100"
                                title="Listen"
                              >
                                <Volume2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveStep(2);
                                  handleRecordPronunciation();
                                }}
                                className="rounded-lg bg-blue-100 px-2 py-1 text-[10px] font-bold text-[#173a7a] hover:bg-blue-200"
                              >
                                Speak
                              </button>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            setActiveStep(2);
                            handleRecordPronunciation();
                          }}
                          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#38bdf8] py-2 text-xs font-bold text-white shadow hover:opacity-95"
                        >
                          <Mic className="h-3.5 w-3.5" /> Record Your
                          Pronunciation
                        </button>
                      </div>

                      {/* In Context Card */}
                      <div className="flex flex-col justify-between rounded-xl bg-purple-50/80 p-2.5 sm:col-span-5">
                        <div>
                          <div className="text-xs font-bold text-purple-950">
                            In Context
                          </div>
                          <div className="relative mt-2 overflow-hidden rounded-lg">
                            <img
                              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
                              alt="Hospitality context"
                              className="h-24 w-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-900">
                                <Play className="h-4 w-4 fill-slate-900" />
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-[11px] leading-snug text-slate-600">
                            See how to use these expressions in real hospitality
                            situations.
                          </p>
                        </div>
                        <a
                          href={activeTopic.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg bg-[#1e4b99] py-1.5 text-[11px] font-bold text-white hover:bg-[#173a7a]"
                        >
                          Watch Video <ArrowRight className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: PRONUNCIATION & GUIDED SPEAKING */}
                  {activeStep === 2 && (
                    <div className="mt-3 space-y-3 rounded-xl bg-white p-3">
                      <div className="text-xs font-bold text-[#173a7a]">
                        Guided Speaking Practice
                      </div>
                      <p className="text-xs text-slate-600">
                        Say aloud:{' '}
                        <span className="font-bold text-slate-900">
                          "{activeTopic.vocab[0]?.en}"
                        </span>
                      </p>

                      {recordingStatus === 'recording' && (
                        <div className="rounded-lg bg-blue-50 p-2.5 text-xs font-medium text-blue-800">
                          Listening to your voice...
                        </div>
                      )}

                      {recordingStatus === 'unclear' && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900">
                          Your recording was not clear enough. Please speak
                          closer to the microphone and try again.
                        </div>
                      )}

                      {recordingStatus === 'clear' && (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-xs font-medium text-emerald-800">
                          Great pronunciation! Audio clear and natural.
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleRecordPronunciation}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#1e4b99] px-3 py-2 text-xs font-bold text-white hover:bg-[#173a7a]"
                        >
                          <Mic className="h-3.5 w-3.5" /> Record Again
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveStep(3)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                        >
                          Continue to Roleplay{' '}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: AI GUEST ROLEPLAY & ASSIGNMENT COMPLETION */}
                  {activeStep === 3 && (
                    <div className="mt-3 space-y-3 rounded-xl bg-white p-3">
                      <div className="text-xs font-bold text-[#173a7a]">
                        AI Guest Roleplay Scenario
                      </div>
                      <p className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-700">
                        {activeTopic.roleplayPrompt}
                      </p>
                      <textarea
                        rows={2}
                        value={roleplayInput}
                        onChange={(e) => setRoleplayInput(e.target.value)}
                        placeholder="Type or note your response to the guest..."
                        className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:border-blue-500 focus:outline-none"
                      />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={handleCompleteTopic}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#173a7a] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#102957]"
                        >
                          End Session & Complete Assignment
                        </button>
                      </div>

                      {roleplayFeedback && (
                        <div className="space-y-1 rounded-xl border border-blue-100 bg-blue-50/70 p-2.5 text-[11px] text-slate-700">
                          <div className="font-bold text-[#173a7a]">
                            Post-Roleplay Evaluation
                          </div>
                          <div>• Fluency: {roleplayFeedback.fluency}</div>
                          <div>
                            • Vocabulary: {roleplayFeedback.vocabulary}
                          </div>
                          <div>
                            • Pronunciation: {roleplayFeedback.pronunciation}
                          </div>
                          <div>• Relevance: {roleplayFeedback.relevance}</div>
                          <div>• Politeness: {roleplayFeedback.politeness}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* SUPPORTING MODAL (AR SCANNER / VIDEO / CERTIFICATE / PROGRESS) */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">
                {activeModal === 'ar' && 'AI-Based AR Vocabulary Scanner'}
                {activeModal === 'video' && 'Instruction & YouTube Guides'}
                {activeModal === 'certificate' && 'Completion Certificate'}
                {activeModal === 'progress' && 'Detailed Learning Scorecard'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {activeModal === 'ar' && (
              <div className="mt-3 space-y-3 text-xs">
                <div className="flex items-center gap-2 rounded-xl bg-slate-900 p-3 text-white">
                  <Camera className="h-5 w-5 text-amber-300" />
                  <span>
                    Select a detected hotel object to inspect hospitality
                    vocabulary:
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {AR_OBJECTS.map((obj) => (
                    <button
                      key={obj.id}
                      onClick={() => setSelectedArId(obj.id)}
                      className={`rounded-lg px-2.5 py-1.5 font-bold ${
                        selectedArId === obj.id
                          ? 'bg-[#173a7a] text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {obj.label}
                    </button>
                  ))}
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900">
                      {selectedArObject.label}
                    </span>
                    <button
                      onClick={() => speakText(selectedArObject.label)}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#1e4b99] px-2.5 py-1 text-[11px] font-bold text-white"
                    >
                      <Volume2 className="h-3 w-3" /> Pronounce
                    </button>
                  </div>
                  <div className="mt-1 font-medium text-slate-700">
                    Arti: {selectedArObject.idMeaning}
                  </div>
                  <p className="mt-1 text-slate-500">
                    {selectedArObject.context}
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'video' && (
              <div className="mt-3 space-y-2.5 text-xs">
                {departments.map((d) => (
                  <a
                    key={d.id}
                    href={d.topics[0]?.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200 p-3 hover:bg-blue-50"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{d.name}</div>
                      <div className="text-slate-500">
                        {d.topics[0]?.videoTitle}
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-[#1e4b99]" />
                  </a>
                ))}
              </div>
            )}

            {activeModal === 'certificate' && (
              <div className="mt-3 space-y-3 text-xs">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5">
                  <div className="font-bold text-emerald-900">
                    Hospitality English Proficiency Certificate
                  </div>
                  <p className="mt-1 text-emerald-800">
                    Current progress: <strong>{scores.overallProgress}%</strong>.
                    Complete your department modules and assessment to claim
                    your verified certificate (processing fee applies).
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'progress' && (
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between rounded-lg bg-slate-50 p-2.5">
                  <span>Overall Completion</span>
                  <strong>{scores.overallProgress}%</strong>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-50 p-2.5">
                  <span>Fluency Score</span>
                  <strong>{scores.fluency}%</strong>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-50 p-2.5">
                  <span>Vocabulary Score</span>
                  <strong>{scores.vocabulary}%</strong>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-50 p-2.5">
                  <span>Politeness Score</span>
                  <strong>{scores.politeness}%</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}