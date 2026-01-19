import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, CheckCircle, ArrowLeft, BookOpen, Clock, Award, Lock, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

import { getCourseDetails, generateCertificate, updateCourseProgress } from '../api/api';

// Simple markdown renderer
const renderMarkdown = (text) => {
    if (!text) return <p className="text-slate-400">Contenu non disponible.</p>;

    const lines = text.split('\n');
    const elements = [];
    let listItems = [];
    let inList = false;

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`list-${elements.length}`} className="list-disc list-inside mb-4 space-y-2 text-slate-300">
                    {listItems}
                </ul>
            );
            listItems = [];
        }
    };

    lines.forEach((line, idx) => {
        // Headers
        if (line.startsWith('# ')) {
            flushList();
            elements.push(<h1 key={idx} className="text-3xl font-bold text-white mb-4 mt-6">{line.substring(2)}</h1>);
        } else if (line.startsWith('## ')) {
            flushList();
            elements.push(<h2 key={idx} className="text-2xl font-bold text-cyan-300 mb-3 mt-5">{line.substring(3)}</h2>);
        } else if (line.startsWith('### ')) {
            flushList();
            elements.push(<h3 key={idx} className="text-xl font-semibold text-cyan-200 mb-2 mt-4">{line.substring(4)}</h3>);
        }
        // List items
        else if (line.match(/^[\-\*]\s/)) {
            inList = true;
            const content = line.substring(2);
            listItems.push(<li key={idx} className="ml-4">{processInlineMarkdown(content)}</li>);
        }
        // Paragraph
        else if (line.trim()) {
            flushList();
            elements.push(<p key={idx} className="mb-4 text-slate-300 leading-relaxed">{processInlineMarkdown(line)}</p>);
        }
        // Empty line
        else {
            flushList();
        }
    });

    flushList();
    return <div className="prose prose-invert prose-lg max-w-none">{elements}</div>;
};

// Process inline markdown (bold, italic, code)
const processInlineMarkdown = (text) => {
    const parts = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
        // Bold **text**
        const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
        if (boldMatch && boldMatch.index === 0) {
            parts.push(<strong key={key++} className="font-bold text-white">{boldMatch[1]}</strong>);
            remaining = remaining.substring(boldMatch[0].length);
            continue;
        }

        // Italic *text*
        const italicMatch = remaining.match(/\*([^*]+)\*/);
        if (italicMatch && italicMatch.index === 0) {
            parts.push(<em key={key++} className="italic text-cyan-200">{italicMatch[1]}</em>);
            remaining = remaining.substring(italicMatch[0].length);
            continue;
        }

        // Code `text`
        const codeMatch = remaining.match(/`([^`]+)`/);
        if (codeMatch && codeMatch.index === 0) {
            parts.push(<code key={key++} className="bg-cyan-900/30 px-2 py-1 rounded text-cyan-200">{codeMatch[1]}</code>);
            remaining = remaining.substring(codeMatch[0].length);
            continue;
        }

        // Find next special character
        const nextSpecial = remaining.search(/[\*`]/);
        if (nextSpecial === -1) {
            parts.push(remaining);
            break;
        } else if (nextSpecial > 0) {
            parts.push(remaining.substring(0, nextSpecial));
            remaining = remaining.substring(nextSpecial);
        } else {
            // No match found, just add the character
            parts.push(remaining[0]);
            remaining = remaining.substring(1);
        }
    }

    return parts.length > 0 ? parts : text;
};

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeLesson, setActiveLesson] = useState(0);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleGetCertificate = async () => {
        if (!user) {
            alert("Veuillez vous connecter pour obtenir votre certificat.");
            return;
        }

        if (!course) {
            console.error("Course data missing");
            return;
        }

        // Strict client-side check as a precaution, though backend enforces it
        if (!course.completed) {
            alert("Veuillez terminer le cours à 100% pour obtenir votre certificat.");
            return;
        }

        try {
            const res = await generateCertificate(courseId, user.id);

            if (res.data && res.data.certificate_number) {
                navigate(`/certificate/${res.data.certificate_number}`);
            } else {
                alert("Erreur: Le serveur n'a pas renvoyé de numéro de certificat.");
            }
        } catch (error) {
            console.error("Certificate error FULL:", error);
            const msg = error.response?.data?.message || "Erreur inconnue lors de la génération.";
            alert(`Impossible d'obtenir le certificat: ${msg}`);
        }
    };

    const handleLessonComplete = async (nextIndex) => {
        if (!user) return;

        // Calculate progress logic
        const totalLessons = course.lessons.length;
        const currentProgress = ((activeLesson + 1) / totalLessons) * 100;
        const isCompleted = activeLesson === totalLessons - 1 || nextIndex === totalLessons;

        // Optimistic update
        const updatedCourse = { ...course };
        updatedCourse.progress = Math.max(updatedCourse.progress || 0, currentProgress);
        if (isCompleted) updatedCourse.completed = true;
        setCourse(updatedCourse);

        try {
            await updateCourseProgress(courseId, user.id, isCompleted ? 100 : Math.round(currentProgress), isCompleted);
        } catch (err) {
            console.error("Failed to update progress", err);
        }

        if (nextIndex < totalLessons) {
            setActiveLesson(nextIndex);
        }
    };

    const handleNextLesson = () => {
        handleLessonComplete(activeLesson + 1);
    };

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                // Pass user.id to get personalized progress
                const response = await getCourseDetails(courseId, user?.id);
                setCourse(response.data);
            } catch (error) {
                console.error("Failed to fetch course details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourse();
        }
    }, [courseId, user]);

    if (loading) {
        return <div className="flex h-screen bg-[#0f0716] items-center justify-center text-white">Loading...</div>;
    }

    if (!course) {
        return <div className="flex h-screen bg-[#0f0716] items-center justify-center text-white">Course not found</div>;
    }

    const currentLesson = course.lessons[activeLesson];
    const isLastLesson = activeLesson === course.lessons.length - 1;
    const isCompleted = course.completed; // From backend or optimistic update

    return (
        <div className="flex h-screen bg-transparent text-white overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col ml-64">
                <Navbar />

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-cyan-700/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <button
                                onClick={() => navigate('/academy')}
                                className="flex items-center text-slate-400 hover:text-white transition-colors group"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                                Retour à l'Académie
                            </button>

                            {/* Certificate Button - Conditionally Rendered/Styled */}
                            {isCompleted ? (
                                <button
                                    onClick={handleGetCertificate}
                                    className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white rounded-xl font-bold shadow-lg shadow-yellow-500/20 transition-all transform hover:scale-105"
                                >
                                    <Award className="w-5 h-5 mr-2" />
                                    Obtenir mon Certificat
                                </button>
                            ) : (
                                <div className="flex items-center px-4 py-2 bg-white/5 text-slate-400 rounded-xl border border-white/10 cursor-not-allowed group relative" disabled>
                                    <Lock className="w-4 h-4 mr-2" />
                                    Certificat Verrouillé

                                    {/* Tooltip */}
                                    <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-black/90 text-xs text-white rounded-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                        Terminez toutes les leçons pour débloquer le certificat.
                                        <div className="mt-1 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-yellow-500" style={{ width: `${course.progress || 0}%` }}></div>
                                        </div>
                                        <div className="mt-1 text-right">{course.progress || 0}% complété</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-180px)]">
                            {/* Main Content Area */}
                            <div className="lg:col-span-2 flex flex-col">
                                {/* Lesson Content */}
                                <div className="bg-[#0a0f1a]/60 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/20 mb-6 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-cyan-700/30">
                                    {renderMarkdown(currentLesson.content)}
                                </div>

                                {/* Quiz OR Next Button */}
                                {currentLesson.quiz ? (
                                    <QuizComponent
                                        quiz={currentLesson.quiz}
                                        onComplete={() => handleLessonComplete(activeLesson + 1)}
                                    />
                                ) : (
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={handleNextLesson}
                                            className="flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transition-all"
                                        >
                                            {isLastLesson ? 'Terminer le Cours' : 'Leçon Suivante'}
                                            <ChevronRight className="w-5 h-5 ml-2" />
                                        </button>
                                    </div>
                                )}

                                {/* Lesson Info */}
                                <div className="bg-[#0a0f1a]/60 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/20 mt-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h1 className="text-3xl font-bold text-white mb-2">{currentLesson.title}</h1>
                                            <p className="text-slate-400 flex items-center">
                                                <Clock className="w-4 h-4 mr-2" />
                                                Durée: {currentLesson.duration}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Module</div>
                                            <div className="text-xl font-bold text-cyan-400">{activeLesson + 1} / {course.lessons.length}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar - Playlist */}
                            <div className="bg-[#0a0f1a]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/20 flex flex-col overflow-hidden h-full">
                                <div className="p-6 border-b border-white/5 bg-[#0a0f1a]">
                                    <h3 className="text-lg font-bold text-white flex items-center mb-1">
                                        <BookOpen className="w-5 h-5 mr-2 text-cyan-400" />
                                        {course.title}
                                    </h3>
                                    <div className="mt-2 text-xs text-slate-400 flex justify-between items-center">
                                        <span>Progression</span>
                                        <span>{course.progress || 0}%</span>
                                    </div>
                                    <div className="mt-1 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${course.progress || 0}%` }}></div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-700/30">
                                    {course.lessons.map((lesson, index) => (
                                        <div
                                            key={lesson.id}
                                            onClick={() => setActiveLesson(index)}
                                            className={`p-4 border-b border-white/5 flex items-center cursor-pointer transition-colors ${activeLesson === index
                                                ? 'bg-cyan-500/10 border-l-4 border-l-cyan-500'
                                                : 'hover:bg-white/5 border-l-4 border-l-transparent'
                                                }`}
                                        >
                                            <div className={`mr-4 text-sm font-bold w-6 ${activeLesson === index ? 'text-cyan-400' : 'text-slate-500'}`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`text-sm font-medium mb-1 ${activeLesson === index ? 'text-white' : 'text-slate-300'}`}>
                                                    {lesson.title}
                                                </h4>
                                                <div className="flex items-center text-xs text-slate-500">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {lesson.duration}
                                                </div>
                                            </div>
                                            <div>
                                                {activeLesson === index ? (
                                                    <Play className="w-4 h-4 text-cyan-400 fill-current" />
                                                ) : lesson.completed || (index < activeLesson) ? ( // Simple heuristic for completed: if past index
                                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                ) : (
                                                    <Play className="w-3 h-3 text-slate-700" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Quiz Component
const QuizComponent = ({ quiz, onComplete }) => {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const handleSubmit = () => {
        let correct = 0;
        quiz.questions.forEach((q, idx) => {
            if (selectedAnswers[idx] === q.correct_answer) {
                correct++;
            }
        });
        const finalScore = Math.round((correct / quiz.questions.length) * 100);
        setScore(finalScore);
        setShowResults(true);

        if (finalScore >= 70) {
            setTimeout(() => {
                onComplete();
            }, 2000);
        }
    };

    if (showResults) {
        return (
            <div className="bg-[#0a0f1a]/80 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/20">
                <div className="text-center">
                    <div className={`text-6xl font-bold mb-4 ${score >= 70 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {score}%
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                        {score >= 70 ? '🎉 Félicitations!' : '❌ Réessayez'}
                    </h3>
                    <p className="text-slate-300 mb-4">
                        {score >= 70
                            ? 'Vous avez réussi le quiz! Prochaine leçon débloquée.'
                            : 'Score minimum requis: 70%. Relisez la leçon et réessayez.'}
                    </p>
                    {score < 70 && (
                        <button
                            onClick={() => {
                                setSelectedAnswers({});
                                setShowResults(false);
                                setScore(0);
                            }}
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-xl"
                        >
                            Réessayer le Quiz
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const allAnswered = Object.keys(selectedAnswers).length === quiz.questions.length;

    return (
        <div className="bg-[#0a0f1a]/80 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Award className="w-6 h-6 mr-2 text-cyan-400" />
                Quiz de Validation
            </h2>

            <div className="space-y-6">
                {quiz.questions.map((question, qIdx) => (
                    <div key={qIdx} className="border border-white/10 rounded-xl p-6 bg-white/5">
                        <p className="text-white font-semibold mb-4">
                            {qIdx + 1}. {question.question_text}
                        </p>
                        <div className="space-y-2">
                            {question.options.map((option, oIdx) => (
                                <label
                                    key={oIdx}
                                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${selectedAnswers[qIdx] === oIdx
                                        ? 'bg-cyan-600/30 border border-cyan-400'
                                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${qIdx}`}
                                        value={oIdx}
                                        checked={selectedAnswers[qIdx] === oIdx}
                                        onChange={() => {
                                            setSelectedAnswers({
                                                ...selectedAnswers,
                                                [qIdx]: oIdx
                                            });
                                        }}
                                        className="mr-3"
                                    />
                                    <span className="text-slate-200">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className={`w-full mt-6 font-bold py-4 px-6 rounded-xl transition-all ${allAnswered
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-600/20'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed'
                    }`}
            >
                {allAnswered ? 'Terminer le Quiz' : `Répondez aux ${quiz.questions.length} questions`}
            </button>
        </div>
    );
};

export default CourseDetail;
