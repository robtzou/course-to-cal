"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Upload, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
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
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to sync to calendar");
            }

            setStep(3);
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to sync to calendar. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-start px-4 pt-24 pb-12 md:pt-32 md:pb-24 overflow-hidden relative">


            {/* Hero Section */}
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex flex-col gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-4"
                >
                    <div className="inline-block rounded-full bg-white/20 border border-white/20 px-3 py-1 text-xs font-medium text-primary backdrop-blur-xl mb-4">
                        ✨ 100% Free AI-Powered Schedule Sync
                    </div>


                </motion.div>

                {/* Main Action Area */}
                <motion.div
                    layout
                    className="w-full max-w-5xl"
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
                                    <button
                                        onClick={() => {
                                            setStep(1);
                                            setFile(null);
                                            setCourses([]);
                                        }}
                                        className="px-8 py-3 rounded-xl bg-blue-500/10 text-blue-400 font-medium hover:bg-blue-500/20 transition-colors"
                                    >
                                        Sync Another Schedule
                                    </button>
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
            </div>

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
        </main>
    );
}
