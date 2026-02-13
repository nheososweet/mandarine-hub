"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Power, Settings, Send, Volume2, Wifi, Mic, Sparkles, X } from "lucide-react";

// Types
interface Speaker {
    id: string;
    name: string;
    reference_audio?: string;
    reference_text?: string;
}

interface Message {
    role: "user" | "ai" | "system";
    content: string;
}

export default function VoiceAgent() {
    const [isConnected, setIsConnected] = useState(false);
    const [status, setStatus] = useState("Standby");
    const [speakers, setSpeakers] = useState<Speaker[]>([]);
    const [selectedSpeaker, setSelectedSpeaker] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([
        { role: "system", content: "AI Core initialized. Systems online." },
    ]);
    const [inputText, setInputText] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [systemPrompt, setSystemPrompt] = useState("");

    const pcRef = useRef<RTCPeerConnection | null>(null);
    const dcRef = useRef<RTCDataChannel | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const [pcId, setPcId] = useState<string>("");

    console.log("defaultSpeaker", selectedSpeaker)

    // Fetch Speakers on Mount
    useEffect(() => {
        async function fetchSpeakers() {
            try {
                const res = await fetch("https://spk.svisor.vn/api/speakers");
                const data = await res.json();
                const loadedSpeakers = data.speakers || [];
                setSpeakers(loadedSpeakers);
                if (loadedSpeakers.length > 0) {
                    const defaultSpeaker = loadedSpeakers.find((s: Speaker) => s.name === "Giọng Google Nữ") || loadedSpeakers[0];
                    setSelectedSpeaker(defaultSpeaker.id);
                } else {
                    console.warn("⚠️ No speakers returned from API");
                }
            } catch (e: any) {
                console.error("Failed to fetch speakers:", e);
                alert(`Speaker Fetch Error: ${e.message || e}`);
                setSpeakers([]);
            }
        }
        fetchSpeakers();
    }, []);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Audio Visualization Setup
    useEffect(() => {
        if (!isConnected || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const analyser = analyserRef.current;
        if (!analyser) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        let animationId: number;

        const draw = () => {
            animationId = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = 130; // Radius of the visualizer circle

            ctx.beginPath();
            ctx.strokeStyle = "rgba(238, 64, 54, 0.4)";
            ctx.lineWidth = 2;

            for (let i = 0; i < bufferLength; i++) {
                const freq = dataArray[i] / 255.0;
                const barHeight = freq * 60;

                const angle = (i / bufferLength) * Math.PI * 2;
                const x1 = centerX + Math.cos(angle) * radius;
                const y1 = centerY + Math.sin(angle) * radius;
                const x2 = centerX + Math.cos(angle) * (radius + barHeight);
                const y2 = centerY + Math.sin(angle) * (radius + barHeight);

                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
            }
            ctx.stroke();

            // Glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(238, 64, 54, 0.8)";
        };

        draw();

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [isConnected]);

    const addMessage = (role: Message["role"], content: string) => {
        setMessages((prev) => [...prev, { role, content }]);
    };

    const appendToLastAiMessage = (chunk: string) => {
        setMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.role === "ai") {
                return [
                    ...prev.slice(0, -1),
                    { ...lastMsg, content: lastMsg.content + chunk },
                ];
            } else {
                return [...prev, { role: "ai", content: chunk }];
            }
        });
        setIsSpeaking(true);
        if ((window as any).speakTimeout) clearTimeout((window as any).speakTimeout);
        (window as any).speakTimeout = setTimeout(() => setIsSpeaking(false), 300);
    };

    const setupAudioContext = (stream: MediaStream) => {
        if (!audioCtxRef.current) {
            const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
            audioCtxRef.current = new AudioContextClass();
        }

        const audioCtx = audioCtxRef.current!;

        // 🔥 Safari compatibility: Resume context on user interaction
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().then(() => {
                console.log('🔊 AudioContext resumed successfully');
            });
        }

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
    };

    const toggleConnect = async () => {
        if (isConnected) {
            stop();
        } else {
            await start();
        }
    };

    const start = async () => {
        try {
            setStatus("Starting...");

            // 🔥 Safari necessity: Initialize AudioContext on first user click
            if (!audioCtxRef.current) {
                const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
                audioCtxRef.current = new AudioContextClass();
            }

            const audioCtx = audioCtxRef.current!; // Use non-null assertion as we just initialized it
            if (audioCtx.state === 'suspended') {
                await audioCtx.resume();
            }

            // 🔥 Unlock Audio early
            if (remoteAudioRef.current) {
                remoteAudioRef.current.play().catch(() => console.log("Audio unlock attempt"));
            }

            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    throw new Error("Camera/Mic API not available. Ensure you are on HTTPS.");
                }
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                localStreamRef.current = stream;
                setupAudioContext(stream);
            } catch (err: any) {
                alert(`Mic Error: ${err.message || err}`);
                setStatus("Mic Access Denied");
                return;
            }

            setStatus("Initializing...");

            const config: RTCConfiguration = {
                iceServers: [
                    {
                        urls: "stun:webrtc.svisor.vn:3478"
                    },
                    {
                        urls: "turns:webrtc.svisor.vn:3478",
                        username: "coturnuser",
                        credential: "coturnpass@spX2025"
                    },
                    {
                        urls: "turn:webrtc.svisor.vn:3478",
                        username: "coturnuser",
                        credential: "coturnpass@spX2025"
                    },
                ],
                bundlePolicy: 'max-bundle',
                rtcpMuxPolicy: 'require',
            };

            const pc = new RTCPeerConnection(config);
            pcRef.current = pc;

            // 🔥 Safari Stability: use transceivers
            pc.addTransceiver('audio', { direction: 'sendrecv' });

            const dc = pc.createDataChannel("chat");
            dcRef.current = dc;

            dc.onopen = () => {
                console.log("🔥 DataChannel opened");
                setIsConnected(true);
                setStatus("Online");
            };

            dc.onerror = (err) => console.error("DC Error:", err);
            dc.onclose = () => console.log("DC Closed");

            // 🔥 CRITICAL: ICE Candidate Handler
            let pendingCandidates: RTCIceCandidate[] = [];
            let currentPcId = "";

            pc.onicecandidate = async (event) => {
                if (event.candidate) {
                    console.log('📤 ICE candidate generated:', event.candidate.candidate);

                    // If we don't have pc_id yet, queue the candidate
                    if (!currentPcId) {
                        console.log('⏳ Queuing candidate (waiting for pc_id)');
                        pendingCandidates.push(event.candidate);
                        return;
                    }

                    // Send candidate to server
                    try {
                        await fetch("https://gateway.svisor.vn/gateway/transcribe-service/ice", {
                            // await fetch("http://118.70.33.126:8118/ice", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "apiKey": "spzac_vaBoaC7oGq8xjclR7spDx7sBLmYy5wZPcc872351073d113b"
                            },
                            body: JSON.stringify({
                                pc_id: currentPcId,
                                candidate: {
                                    candidate: event.candidate.candidate,
                                    sdpMid: event.candidate.sdpMid,
                                    sdpMLineIndex: event.candidate.sdpMLineIndex
                                }
                            })
                        });
                        console.log('✅ ICE candidate sent successfully');
                    } catch (err) {
                        console.error('❌ Failed to send ICE candidate:', err);
                    }
                } else {
                    console.log('🏁 ICE gathering completed');
                    // Send end-of-candidates signal
                    if (currentPcId) {
                        fetch("https://gateway.svisor.vn/gateway/transcribe-service/ice", {
                            // fetch("http://118.70.33.126:8118/ice", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "apiKey": "spzac_vaBoaC7oGq8xjclR7spDx7sBLmYy5wZPcc872351073d113b"
                            },
                            body: JSON.stringify({
                                pc_id: currentPcId,
                                candidate: null
                            })
                        }).catch(err => console.error('Failed to send end signal:', err));
                    }
                }
            };


            dc.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.type === "transcription") {
                    addMessage("user", msg.text);
                } else if (msg.type === "agent_text") {
                    appendToLastAiMessage(msg.text);
                }
            };

            localStreamRef.current.getTracks().forEach((track) => {
                if (localStreamRef.current) {
                    pc.addTrack(track, localStreamRef.current);
                }
            });

            pc.onconnectionstatechange = () => {
                console.log('📊 Connection State:', pc.connectionState);
                if (pc.connectionState === 'failed') {
                    alert('Connection Failed. Please check network/VPN.');
                }
            };

            pc.ontrack = (evt) => {
                if (remoteAudioRef.current && remoteAudioRef.current.srcObject !== evt.streams[0]) {
                    remoteAudioRef.current.srcObject = evt.streams[0];
                    remoteAudioRef.current.play().catch(e => console.error("Audio play failed", e));

                    // Also connect remote audio to analyser if context exists
                    if (audioCtxRef.current && analyserRef.current) {
                        const remoteSource = audioCtxRef.current.createMediaStreamSource(evt.streams[0]);
                        remoteSource.connect(analyserRef.current);
                    }
                }
            };

            pc.oniceconnectionstatechange = () => {
                if (
                    pc.iceConnectionState === "disconnected" ||
                    pc.iceConnectionState === "failed"
                ) {
                    console.error('❌ ICE connection failed');
                    stop();
                } else if (pc.iceConnectionState === "connected") {
                    console.log('✅ ICE connection established!');
                    setStatus("Online");
                } else {
                    console.log('📊 ICE State:', pc.iceConnectionState);
                }
            };

            pc.onicegatheringstatechange = () => {
                console.log('📊 ICE gathering state:', pc.iceGatheringState);
            };

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            const response = await fetch("https://gateway.svisor.vn/gateway/transcribe-service/offer", {
                // const response = await fetch("http://118.70.33.126:8118/offer", {
                method: "POST",
                mode: 'cors', // 🔥 Explicitly set CORS mode
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "apiKey": "spzac_vaBoaC7oGq8xjclR7spDx7sBLmYy5wZPcc872351073d113b"
                },
                body: JSON.stringify({
                    sdp: offer.sdp,
                    type: offer.type,
                    speaker_id: selectedSpeaker,
                    user_system_prompt: systemPrompt,
                    reference_audio: speakers.find(s => s.id === selectedSpeaker)?.reference_audio,
                    reference_text: speakers.find(s => s.id === selectedSpeaker)?.reference_text
                }),
            }).catch(async (err) => {
                // 🔥 Diagnostic: Try a simple GET to see if it's a domain-wide block
                console.error("Fetch failed:", err);
                try {
                    setStatus("Checking connection...");
                    // const diagRes = await fetch("http://118.70.33.126:8118/", { mode: 'no-cors' });
                    // alert("🔍 Diagnostic: Domain is reachable via no-cors GET. This points strongly to a server-side CORS (OPTIONS preflight) configuration issue.");
                } catch (diagErr: any) {
                    alert(`🔍 Diagnostic: Root domain also blocked: ${diagErr.message}. This might be a DNS or general network restriction on your iPhone/Local network.`);
                }
                throw err; // Throw the original error
            });

            if (!response.ok) {
                throw new Error(`Failed to send offer: ${response.statusText}`);
            }

            const answer = await response.json();
            currentPcId = answer.pc_id;
            setPcId(currentPcId);
            await pc.setRemoteDescription(answer);
            if (pendingCandidates.length > 0) {
                console.log(`🔄 Sending ${pendingCandidates.length} queued candidates`);
                for (const candidate of pendingCandidates) {
                    try {
                        await fetch("https://gateway.svisor.vn/gateway/transcribe-service/ice", {
                            // await fetch("http://118.70.33.126:8118/ice", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "apiKey": "spzac_vaBoaC7oGq8xjclR7spDx7sBLmYy5wZPcc872351073d113b"
                            },
                            body: JSON.stringify({
                                pc_id: currentPcId,
                                candidate: {
                                    candidate: candidate.candidate,
                                    sdpMid: candidate.sdpMid,
                                    sdpMLineIndex: candidate.sdpMLineIndex
                                }
                            })
                        });
                    } catch (err) {
                        console.error('Failed to send queued candidate:', err);
                    }
                }
                pendingCandidates = [];
            }
        } catch (e: any) {
            console.error(e);
            alert(`Connect Error: ${e.message || e}`);
            stop();
        }
    };

    const stop = () => {
        setIsConnected(false);
        setStatus("Standby");
        if (dcRef.current) {
            dcRef.current.close();
            dcRef.current = null;
        }
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            localStreamRef.current = null;
        }
        if (audioCtxRef.current) {
            audioCtxRef.current.close();
            audioCtxRef.current = null;
        }
    };

    const sendMessage = () => {
        const text = inputText.trim();
        if (!text || !dcRef.current || dcRef.current.readyState !== "open") return;
        addMessage("user", text);
        dcRef.current.send(text);
        setInputText("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-full w-full bg-[#030305] overflow-hidden relative">
            <audio
                ref={remoteAudioRef}
                autoPlay
                playsInline
                className="hidden"
            />

            {/* LEFT PANEL: VISUALIZATION (70%) */}
            <div className="w-full lg:flex-1 h-[50vh] lg:h-full relative flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5 cyber-grid shadow-[inset_-20px_0_50px_rgba(0,0,0,0.5)]">
                {/* Top Status Bar */}
                <div className="absolute top-0 left-0 right-0 p-4 lg:p-8 flex justify-between items-center z-20">
                    <div className="flex items-center gap-4">
                        <div className="relative flex items-center justify-center">
                            <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? "" : "bg-red-500 shadow-[0_0_10px_#ef4444]"}`} style={isConnected ? { backgroundColor: "var(--primary)", boxShadow: "0 0 15px var(--primary)" } : {}} />
                            {isConnected && <div className="absolute w-full h-full rounded-full animate-ping opacity-40" style={{ backgroundColor: "var(--primary)" }} />}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] lg:text-sm uppercase tracking-[0.2em] leading-none mb-1 lg:mb-1.5 font-black" style={{ color: "var(--primary-light)" }}>Status</span>
                            <span className="text-sm lg:text-base font-black tracking-[0.1em] uppercase text-white leading-none shadow-[0_0_10px_rgba(255,255,255,0.1)]">{status}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-white/20">
                        <Wifi size={16} className={isConnected ? "opacity-100" : "opacity-40"} style={isConnected ? { color: "var(--primary)" } : {}} />
                        <div className="h-4 w-px bg-white/10" />
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowSettings(true)}
                        >
                            <Settings size={16} className="text-white/40 cursor-pointer transition-colors" style={{ color: "rgba(255,255,255,0.4)" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--primary)"} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"} />
                        </motion.button>
                    </div>
                </div>

                {/* Settings Overlay */}
                <AnimatePresence>
                    {showSettings && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="w-full max-w-lg bg-[#0f1115] border border-white/10 rounded-3xl p-6 shadow-2xl relative"
                            >
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-2"
                                >
                                    <X size={20} />
                                </button>

                                <h3 className="text-lg lg:text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                                    <Settings size={20} style={{ color: "var(--primary)" }} />
                                    System Configuration
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] lg:text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--primary-light)" }}>
                                            System Prompt / Persona
                                        </label>
                                        <textarea
                                            value={systemPrompt}
                                            onChange={(e) => setSystemPrompt(e.target.value)}
                                            placeholder="Define the AI's behavior..."
                                            className="w-full h-32 lg:h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-white/80 focus:outline-none focus:bg-white/[0.02] resize-none transition-all placeholder:text-white/20 text-sm leading-relaxed"
                                            style={{ borderColor: "rgba(255,255,255,0.1)" }}
                                            onFocus={(e) => e.currentTarget.style.borderColor = "var(--primary-medium)"}
                                            onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                                        />
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <button
                                            onClick={() => setShowSettings(false)}
                                            className="px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all border"
                                            style={{
                                                backgroundColor: "var(--primary-light)",
                                                borderColor: "var(--primary-medium)",
                                                color: "var(--primary)"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = "var(--primary-medium)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = "var(--primary-light)";
                                            }}
                                        >
                                            Save Configuration
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* AI ORB + VISUALIZER */}
                <div className="relative flex items-center justify-center w-48 h-48 lg:w-64 lg:h-64">
                    {/* Audio Canvas visualizer */}
                    <canvas
                        ref={canvasRef}
                        width={600}
                        height={600}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-60 w-[300px] h-[300px] lg:w-[600px] lg:h-[600px]"
                    />

                    <div className="relative z-10 w-48 h-48 lg:w-64 lg:h-64 flex items-center justify-center">
                        <motion.div
                            animate={{
                                scale: isConnected ? (isSpeaking ? [1, 1.15, 1] : [1, 1.02, 1]) : 1,
                            }}
                            transition={{
                                duration: isSpeaking ? 0.4 : 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className={`w-32 h-32 lg:w-48 lg:h-48 rounded-full transition-all duration-1000 ${isConnected ? "" : "grayscale opacity-20"}`}
                            style={{
                                background: `linear-gradient(to bottom right, var(--primary), var(--primary-hover), rgba(238, 64, 54, 0.6))`,
                                boxShadow: "0 0 80px var(--primary-light)"
                            }}
                        >
                            <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2)_0%,transparent_70%)]" />
                        </motion.div>

                        {/* Orbital Effects */}
                        <AnimatePresence>
                            {isConnected && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0, rotate: 0 }}
                                        animate={{ opacity: 1, rotate: 360 }}
                                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-[-40px] rounded-full border border-dashed"
                                        style={{ borderColor: "var(--primary-light)" }}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, rotate: 0 }}
                                        animate={{ opacity: 0.5, rotate: -360 }}
                                        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-[-20px] rounded-full border border-white/5"
                                    />
                                    <motion.div
                                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-[-70px] rounded-full blur-3xl -z-10"
                                        style={{ backgroundColor: "var(--primary-light)" }}
                                    />
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Center Icon */}
                    <motion.div
                        animate={{ opacity: isConnected ? 1 : 0.3 }}
                        className="absolute z-20"
                    >
                        <Sparkles size={32} className="text-white/20" />
                    </motion.div>
                </div>

                {/* Bottom Tools Dock */}
                <div className="absolute bottom-6 lg:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 lg:gap-6 bg-white/5 backdrop-blur-2xl px-4 lg:px-10 py-3 lg:py-5 rounded-[2rem] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-20 w-max max-w-[90vw]">
                    <div className="flex items-center gap-1.5 lg:gap-4">
                        <div className="p-1.5 lg:p-2 bg-white/5 rounded-full shrink-0" style={{ color: "var(--primary)" }}>
                            <Volume2 size={16} className="lg:w-[18px] lg:h-[18px]" />
                        </div>
                        <select
                            value={selectedSpeaker}
                            onChange={(e) => setSelectedSpeaker(e.target.value)}
                            disabled={isConnected}
                            className="bg-transparent text-white focus:outline-none cursor-pointer text-xs lg:text-lg font-black pr-1 lg:pr-4 uppercase tracking-wider truncate max-w-[100px] lg:max-w-none"
                        >
                            {speakers.map((spk) => (
                                <option key={spk.id} value={spk.id} className="bg-[#0f1115]">
                                    {spk.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="h-6 w-px bg-white/10" />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleConnect}
                        className={`flex items-center gap-3 lg:gap-5 px-6 lg:px-10 py-3 lg:py-4 rounded-full font-black text-xs lg:text-sm uppercase tracking-[0.2em] transition-all shadow-[0_15px_40px_rgba(0,0,0,0.4)] ${isConnected
                            ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white hover:shadow-red-500/40"
                            : ""
                            }`}
                        style={!isConnected ? {
                            backgroundColor: "var(--primary)",
                            color: "var(--primary-foreground)",
                            borderColor: "var(--primary)",
                            boxShadow: "0 15px 40px var(--primary-light)"
                        } : {}}
                        onMouseEnter={(e) => {
                            if (!isConnected) {
                                e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                                e.currentTarget.style.boxShadow = "0 15px 40px var(--primary-medium)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isConnected) {
                                e.currentTarget.style.backgroundColor = "var(--primary)";
                                e.currentTarget.style.boxShadow = "0 15px 40px var(--primary-light)";
                            }
                        }}
                    >
                        <Power size={12} className="lg:w-[14px] lg:h-[14px]" />
                        {isConnected ? "Terminate" : "Initialize"}
                    </motion.button>
                </div>
            </div>

            {/* RIGHT PANEL: LIVE TRANSCRIPT (30%) */}
            <div className="w-full lg:w-[450px] flex flex-col bg-[#070709] border-t lg:border-t-0 lg:border-l border-white/5 relative shadow-[-10px_0_30px_rgba(0,0,0,0.3)] min-h-0 flex-1">
                <div className="p-6 lg:p-8 pb-4 flex items-center justify-between">
                    <div className="flex flex-col gap-2 lg:gap-3">
                        <span className="text-[10px] lg:text-sm font-black uppercase tracking-[0.3em] lg:tracking-[0.5em] leading-none" style={{ color: "var(--primary-light)" }}>Session Data</span>
                        <h2 className="text-xl lg:text-3xl font-black text-white tracking-[0.1em] lg:tracking-[0.15em] uppercase leading-none">Live Transcript</h2>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--primary-light)" }} />
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--primary-light)" }} />
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--primary-medium)" }} />
                    </div>
                </div>

                <div className="px-6 lg:px-8 flex-1 overflow-y-auto pt-4 lg:pt-6 pb-28 lg:pb-32 space-y-6 lg:space-y-8 scrollbar-hide" ref={chatContainerRef}>
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={`${idx}-${msg.role}`}
                                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <div className="flex items-center gap-2 mb-2 px-1">
                                    <span className={`text-sm font-black uppercase tracking-[0.2em] ${msg.role === 'user' ? '' : 'text-white/40'}`} style={msg.role === 'user' ? { color: "var(--primary)" } : {}}>
                                        {msg.role === 'system' ? 'Kernel Core' : msg.role}
                                    </span>
                                </div>
                                <div className={`relative px-6 lg:px-8 py-4 lg:py-6 rounded-2xl lg:rounded-3xl text-base lg:text-xl font-medium leading-relaxed transition-all shadow-2xl group ${msg.role === 'user'
                                    ? ''
                                    : msg.role === 'ai'
                                        ? 'bg-white/[0.04] border border-white/10 text-white shadow-[20px_20px_40px_rgba(0,0,0,0.3)]'
                                        : 'bg-transparent text-white/30 border border-white/5 text-sm lg:text-base italic py-4'
                                    }`}
                                    style={msg.role === 'user' ? {
                                        backgroundColor: "var(--primary-light)",
                                        borderColor: "var(--primary-medium)",
                                        color: "var(--primary-foreground)"
                                    } : {}}
                                >
                                    {msg.content}
                                    {msg.role === 'ai' && idx === messages.length - 1 && isSpeaking && (
                                        <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: "var(--primary)" }} />
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Input Area (Pinned Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-8 pt-10 bg-gradient-to-t from-[#070709] via-[#070709] to-transparent">
                    <div className="relative group">
                        <div className="absolute inset-0 blur-xl transition-all rounded-full" style={{ backgroundColor: "var(--primary-light)" }} />
                        <input
                            type="text"
                            placeholder="Type transmission payload..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={!isConnected}
                            className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] pl-6 lg:pl-10 pr-16 lg:pr-20 py-4 lg:py-6 text-base lg:text-xl text-white placeholder:text-white/10 focus:outline-none focus:bg-white/[0.08] transition-all disabled:opacity-30 disabled:grayscale relative z-10 shadow-inner font-bold tracking-wide"
                            style={{ borderColor: "rgba(255,255,255,0.1)" }}
                            onFocus={(e) => e.currentTarget.style.borderColor = "var(--primary-medium)"}
                            onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!isConnected}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all disabled:opacity-0 z-20"
                            style={{
                                backgroundColor: "var(--primary-light)",
                                color: "var(--primary)"
                            }}
                            onMouseEnter={(e) => {
                                if (!e.currentTarget.disabled) {
                                    e.currentTarget.style.backgroundColor = "var(--primary)";
                                    e.currentTarget.style.color = "var(--primary-foreground)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!e.currentTarget.disabled) {
                                    e.currentTarget.style.backgroundColor = "var(--primary-light)";
                                    e.currentTarget.style.color = "var(--primary)";
                                }
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
