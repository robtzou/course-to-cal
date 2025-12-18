"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Upload, CheckCircle, ArrowRight, Loader2, Shield, Zap, Globe, Play, X } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import { ImageUpload } from "@/components/ImageUpload";
import { DateRangePicker } from "@/components/DateRangePicker";
import { CourseReview } from "@/components/CourseReview";
import { Course } from "@/types";
import { cn } from "@/lib/utils";

export default function Home() {
    const { data: session } = useSession();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [file, setFile] = useState<File | null>(null);
    const [dates, setDates] = useState({ start: "", end: "" });
    const [isProcessing, setIsProcessing] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [showTutorial, setShowTutorial] = useState(false);
    const [lastSyncedEventIds, setLastSyncedEventIds] = useState<string[]>([]);
    const [undoSuccess, setUndoSuccess] = useState(false);

    const handleImageSelect = (selectedFile: File) => {
        setFile(selectedFile);
    };

    const handleProcess = async () => {
        if (!file || !dates.start || !dates.end) return;

        setIsProcessing(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("startDate", dates.start);
            formData.append("endDate", dates.end);

            const response = await fetch("/api/parse-schedule", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to process schedule");
            }

            const data = await response.json();
            setCourses(data.courses);
            setStep(2);
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to process schedule. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSync = async () => {
        if (!session) {
            signIn("google");
            return;
        }

        setIsProcessing(true);

        try {
            const response = await fetch("/api/calendar/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    courses,
                    startDate: dates.start,
                    endDate: dates.end,
                    userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to sync to calendar");
            }

            const data = await response.json();
            if (data.results) {
                // Extract event IDs safely
                const ids = data.results.map((event: any) => event.id).filter(Boolean);
                setLastSyncedEventIds(ids);
            }

            setStep(3);
        } catch (error) {
            console.error("Error:", error);
            if (error instanceof Error && error.message.includes("Failed to fetch")) {
                alert("Network error: Please check your internet connection or try again. If this persists, the server might be timing out.");
            } else {
                alert("Failed to sync to calendar. Please try again.");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUndo = async () => {
        if (lastSyncedEventIds.length === 0) return;

        setIsProcessing(true);
        try {
            const response = await fetch("/api/calendar/undo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventIds: lastSyncedEventIds }),
            });

            if (!response.ok) throw new Error("Failed to undo changes");

            setLastSyncedEventIds([]);
            setStep(2); // Go back to review
            setUndoSuccess(true);
            setTimeout(() => setUndoSuccess(false), 5000); // clear after 5s
        } catch (error) {
            console.error("Error undoing:", error);
            alert("Failed to undo changes.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-start px-4 pt-24 pb-12 md:pt-32 md:pb-24 overflow-hidden relative">


            {/* Hero Section */}
            <div className="z-10 w-full max-w-4xl text-center mb-12 space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        New: Clipboard Paste Supported
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        Turn your Class Schedule <br className="hidden md:block" /> into a Calendar <span className="animate-text-shine">Instantly</span>.
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Stop manually entering events. Upload a screenshot of your course portal and let us handle the rest—perfectly formatted and synced to Google Calendar.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-muted-foreground font-medium">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            <span>Seconds to Sync</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                            <Shield className="h-4 w-4 text-green-500" />
                            <span>Privacy First</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                            <Globe className="h-4 w-4 text-blue-500" />
                            <span>100% Free & Open Source</span>
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95"
                        >
                            Get Started Now
                        </button>
                        <button
                            onClick={() => setShowTutorial(true)}
                            className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-lg transition-all backdrop-blur-sm border border-white/10 flex items-center gap-2 hover:scale-105 active:scale-95"
                        >
                            <Play className="h-5 w-5 fill-current" />
                            Watch Demo
                        </button>
                    </div>

                    <div className="mt-16 relative w-full max-w-5xl mx-auto hidden md:flex items-center justify-center gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -50, rotate: -5 }}
                            animate={{ opacity: 1, x: 0, rotate: -2 }}
                            transition={{ delay: 0.2 }}
                            className="relative w-[300px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-white/5"
                        >
                            <Image
                                src="/start.JPG"
                                alt="Course Schedule"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-sm border border-white/10">
                                Before: Screenshot
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="z-10 h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
                        >
                            <ArrowRight className="h-8 w-8 text-white" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50, rotate: 5 }}
                            animate={{ opacity: 1, x: 0, rotate: 2 }}
                            transition={{ delay: 0.3 }}
                            className="relative w-[300px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-white/5"
                        >
                            <Image
                                src="/end.PNG"
                                alt="Google Calendar"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-blue-500/80 text-white text-xs font-medium backdrop-blur-sm border border-white/10">
                                After: Calendar
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Main Action Area */}
            <motion.div
                layout
                id="upload-section"
                className="w-full max-w-5xl mt-12 md:mt-24"
            >

                <div className="glass-card rounded-3xl p-6 md:p-12 min-h-[250px] border-white/10 relative overflow-hidden">
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/banner-helv.png"
                            alt="Course to Calendar Banner"
                            width={600}
                            height={150}
                            priority
                            className="w-full max-w-[600px] h-auto rounded-2xl"
                        />

                    </div>
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col gap-8 items-center"
                            >
                                <ImageUpload onImageSelect={handleImageSelect} />

                                <div className="w-full max-w-xl border-t border-white/10 pt-8">
                                    <DateRangePicker
                                        startDate={dates.start}
                                        endDate={dates.end}
                                        onStartDateChange={(d) => setDates(prev => ({ ...prev, start: d }))}
                                        onEndDateChange={(d) => setDates(prev => ({ ...prev, end: d }))}
                                    />
                                </div>

                                <button
                                    onClick={handleProcess}
                                    disabled={!file || !dates.start || !dates.end || isProcessing}
                                    className="w-full max-w-xl mt-4 py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Processing Schedule...
                                        </>
                                    ) : (
                                        <>
                                            Continue to Review
                                            <ArrowRight className="h-5 w-5" />
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col gap-8 items-center w-full"
                            >
                                <CourseReview courses={courses} onCoursesChange={setCourses} />

                                <AnimatePresence>
                                    {undoSuccess && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, height: 0 }}
                                            animate={{ opacity: 1, y: 0, height: "auto" }}
                                            exit={{ opacity: 0, y: -10, height: 0 }}
                                            className="w-full max-w-2xl px-6 py-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm md:text-base font-medium text-center shadow-lg shadow-green-500/10 mb-4"
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <CheckCircle className="h-5 w-5 text-green-400" />
                                                Previous events have been removed from your calendar.
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-black text-sm text-center max-w-2xl">
                                    ⚠️ Please review the details below carefully before syncing. Ensure times and days are correct.
                                </div>

                                <div className="flex gap-4 w-full max-w-3xl">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-4 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleSync}
                                        disabled={isProcessing}
                                        className="flex-[2] py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Syncing to Calendar...
                                            </>
                                        ) : (
                                            <>
                                                Confirm & Sync
                                                <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21.81-.63z" fill="#FBBC05" />
                                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center h-full min-h-[300px] text-center space-y-6"
                            >
                                <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-4">
                                    <CheckCircle className="h-12 w-12" />
                                </div>
                                <h2 className="text-3xl font-bold">Schedule Synced!</h2>
                                <p className="text-muted-foreground max-w-md">
                                    Your courses have been successfully added to your Google Calendar.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleUndo}
                                        disabled={isProcessing}
                                        className="px-6 py-3 rounded-xl bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                    >
                                        Undo Changes
                                    </button>
                                    <button
                                        onClick={() => {
                                            setStep(1);
                                            setFile(null);
                                            setCourses([]);
                                            setLastSyncedEventIds([]);
                                        }}
                                        className="px-8 py-3 rounded-xl bg-blue-500/10 text-blue-400 font-medium hover:bg-blue-500/20 transition-colors"
                                    >
                                        Sync Another Schedule
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* How it Works Section */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="w-full max-w-5xl mt-24 space-y-16"
            >
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold">How it works:</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Syncing your schedule is simple and secure. We use advanced AI to parse your schedule and add it directly to your Google Calendar.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Upload,
                            title: "1. Upload Schedule",
                            desc: "Take a screenshot of your course schedule from your university portal and upload it here."
                        },
                        {
                            icon: CheckCircle,
                            title: "2. Verify Details",
                            desc: "Our AI automatically extracts course names, times, and locations. You can review and edit any details."
                        },
                        {
                            icon: Calendar,
                            title: "3. Sync to Calendar",
                            desc: "Once verified, we securely add these events to your Google Calendar with a single click."
                        },
                    ].map((feature, i) => (
                        <div key={i} className="glass p-8 rounded-3xl border-white/5 bg-white/5 hover:bg-white/10 transition-colors relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <feature.icon className="h-10 w-10 mb-6 text-blue-400 relative z-10" />
                            <h4 className="font-bold text-xl mb-3 relative z-10">{feature.title}</h4>
                            <p className="text-muted-foreground relative z-10">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Data Privacy Section */}
                <div className="glass p-8 md:p-12 rounded-3xl border-white/5 bg-white/5 mt-16">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-3xl font-bold">Data Privacy & Transparency</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                We believe in complete transparency about how your data is handled.
                                Course to Calendar is designed with your privacy as a top priority.
                            </p>
                            <div className="flex gap-4">
                                <a href="/privacy" className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-colors inline-flex items-center gap-2">
                                    Read Privacy Policy
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="space-y-4">
                                <div className="flex gap-4 items-start">
                                    <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0 mt-1">
                                        <CheckCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Limited Access</h4>
                                        <p className="text-muted-foreground">We request access to your Google Calendar <span className="text-white font-medium">solely to add your course events</span>. We do not read, modify, or delete your existing events.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 mt-1">
                                        <CheckCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">No Permanent Storage</h4>
                                        <p className="text-muted-foreground">Your uploaded schedule images are processed temporarily to extract course data and are <span className="text-white font-medium">not permanently stored</span> on our servers.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Video Modal */}
            <AnimatePresence>
                {showTutorial && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowTutorial(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowTutorial(false)}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/ZMi-5l6yS6c?autoplay=1"
                                title="Tutorial Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Footer */}
            <footer className="w-full max-w-5xl mt-20 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <p>© {new Date().getFullYear()} Course2Cal. All rights reserved.</p>
                    <div className="flex gap-4 text-xs">
                        <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <p>Built by Robert Tzou</p>
                    <a href="https://robtzou.github.io/" className="hover:text-white transition-colors">
                        Contact
                    </a>
                </div>
            </footer>
        </main >
    );
}
