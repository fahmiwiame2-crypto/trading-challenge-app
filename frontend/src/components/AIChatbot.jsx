import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const AIChatbot = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: 'Bonjour ! Je suis TradeSense Copilot. Je peux analyser le marché BVC et Crypto pour vous. Que souhaitez-vous savoir ?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [historyLoaded, setHistoryLoaded] = useState(false);


    // Voice Assistant State
    const [isListening, setIsListening] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const recognitionRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'fr-FR';

            recognitionRef.current.onstart = () => {
                setIsListening(true);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(transcript);
                // Auto-send after a short delay could be added here, but manual send is safer for now
            };
        }
    }, []);

    // Text to Speech Function
    const speak = (text) => {
        if (isMuted || !('speechSynthesis' in window)) return;

        // Cancel any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try to select a French voice
        const voices = window.speechSynthesis.getVoices();
        const frVoice = voices.find(voice => voice.lang.includes('fr'));
        if (frVoice) utterance.voice = frVoice;

        window.speechSynthesis.speak(utterance);
    };

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("La reconnaissance vocale n'est pas supportée par votre navigateur.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    const toggleMute = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        if (newMutedState) {
            window.speechSynthesis.cancel();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Load chat history on mount
    useEffect(() => {
        const loadHistory = async () => {
            if (user?.id && !historyLoaded) {
                try {
                    const response = await api.get(`/api/ai/chat/history?user_id=${user.id}`);
                    if (response.data.history && response.data.history.length > 0) {
                        // Convert history to message format
                        const historyMessages = response.data.history.map((item, index) => ([
                            { id: `hist-${item.id}-user`, sender: 'user', text: item.message },
                            { id: `hist-${item.id}-bot`, sender: 'bot', text: item.response }
                        ])).flat();

                        // Prepend welcome message, then history
                        setMessages([
                            { id: 1, sender: 'bot', text: 'Bonjour ! Je suis TradeSense Copilot. Voici notre historique de conversation :' },
                            ...historyMessages
                        ]);
                    }
                    setHistoryLoaded(true);
                } catch (error) {
                    console.error('Error loading chat history:', error);
                    setHistoryLoaded(true);
                }
            }
        };
        loadHistory();
    }, [user, historyLoaded]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        // Add user message
        const userMsg = { id: Date.now(), sender: 'user', text: inputValue };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = inputValue; // Cache input
        setInputValue('');
        setIsTyping(true);

        try {
            // Call AI API with user_id
            const response = await api.post('/api/ai/chat', {
                message: currentInput,
                user_id: user?.id
            });

            const botMsg = {
                id: Date.now() + 1,
                sender: 'bot',
                text: response.data.response
            };
            setMessages(prev => [...prev, botMsg]);

            // Speak the response
            speak(response.data.response);
        } catch (error) {
            console.error("AI Chat Error:", error);
            const errorMsg = {
                id: Date.now() + 1,
                sender: 'bot',
                text: "Désolé, je rencontre des difficultés pour me connecter au serveur de neurones."
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 bg-[#0a0f1a] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300 origin-bottom-right">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">TradeSense Copilot</h3>
                                <div className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse mr-1.5"></span>
                                    <span className="text-[10px] text-white/80">En ligne • v2.0 AI</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={toggleMute}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                                title={isMuted ? "Activer la voix" : "Désactiver la voix"}
                            >
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="h-80 overflow-y-auto p-4 space-y-4 bg-black/20 custom-scrollbar">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.sender === 'user'
                                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none'
                                    : 'bg-[#0a0f1a] text-slate-200 rounded-bl-none border border-white/10'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-[#0a0f1a] rounded-2xl rounded-bl-none p-3 border border-white/10 flex space-x-1 items-center">
                                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-0"></span>
                                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-150"></span>
                                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-300"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-[#0a0f1a] border-t border-white/10 flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Posez une question sur le marché BVC..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                        <button
                            onClick={toggleListening}
                            className={`p-2 rounded-xl transition-all ${isListening
                                ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse'
                                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
                            title="Parler au Copilot"
                        >
                            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={handleSend}
                            className={`p-2 rounded-xl transition-all ${inputValue.trim() ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-900/50' : 'bg-white/5 text-slate-500 cursor-not-allowed'}`}
                            disabled={!inputValue.trim()}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-slate-700 rotate-90' : 'bg-gradient-to-r from-cyan-600 to-blue-600 animate-pulse-slow shadow-cyan-500/50'}`}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <>
                        <Bot className="w-7 h-7 text-white relative z-10" />
                        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 animate-ping"></div>

                        {/* Notification Badge */}
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white items-center justify-center font-bold">1</span>
                        </span>
                    </>
                )}
            </button>
        </div>
    );
};

export default AIChatbot;
