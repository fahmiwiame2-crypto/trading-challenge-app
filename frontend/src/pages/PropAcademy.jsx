import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TiltCard from '../components/ui/TiltCard';
import { GraduationCap, Play, Clock, Star, BookOpen, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { getAcademyCourses } from '../api/api';
import { useLanguage } from '../context/LanguageContext';

const PropAcademy = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Tous');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getAcademyCourses();
                // Map API data to UI components
                const mappedCourses = response.data.map(course => ({
                    ...course,
                    lessons: course.lesson_count || course.lessons?.length || course.total_modules || 0, // Use lesson_count from API
                    // Use emoji from API, fallback to default
                    thumbnail: course.thumbnail_emoji || '📚',
                    // Use category from API
                    level: course.category || 'Débutant',
                    progress: 0 // Default for now until UserProgress is implemented
                }));
                setCourses(mappedCourses);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const stats = [
        { label: 'Cours Terminés', value: '1', icon: Award, color: 'text-cyan-400' },
        { label: 'Heures Apprises', value: '12.5', icon: Clock, color: 'text-blue-400' },
        { label: 'Certificats Obtenus', value: '1', icon: Star, color: 'text-cyan-400' },
        { label: 'Série Actuelle', value: '7 jours', icon: TrendingUp, color: 'text-emerald-400' },
    ];

    const categories = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé'];

    // Filter courses based on category and search
    const filteredCourses = courses.filter(course => {
        const matchesCategory = selectedCategory === 'Tous' || course.category === selectedCategory;
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (course.tags && course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex h-screen bg-transparent text-foreground overflow-hidden selection:bg-cyan-500/30">
            <Sidebar />

            <div className="flex-1 flex flex-col ml-64 bg-transparent">
                <Navbar />

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-cyan-700/50">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Header */}
                        <div>
                            <div className="flex items-center mb-4">
                                <GraduationCap className="w-10 h-10 text-cyan-400 mr-3" />
                                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                    {t('academy_title')}
                                </h1>
                            </div>
                            <p className="text-muted-foreground text-lg">{t('academy_subtitle')}</p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: t('academy_stats_finished'), value: '1', icon: Award, color: 'text-cyan-400' },
                                { label: t('academy_stats_hours'), value: '12.5', icon: Clock, color: 'text-blue-400' },
                                { label: t('academy_stats_certificates'), value: '1', icon: Star, color: 'text-cyan-400' },
                                { label: t('academy_stats_streak'), value: '7 jours', icon: TrendingUp, color: 'text-emerald-400' },
                            ].map((stat, index) => (
                                <TiltCard key={index} className="glass-glow p-6 group transition-all rounded-xl" tiltAmount={10} scale={1.03}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors`}>
                                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                        <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{stat.label}</span>
                                    </div>
                                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                                </TiltCard>
                            ))}
                        </div>

                        {/* Courses Grid */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center">
                                    <BookOpen className="w-6 h-6 mr-3 text-cyan-400" />
                                    {t('academy_available_courses')} ({filteredCourses.length})
                                </h2>
                            </div>

                            {/* Search and Filters */}
                            <div className="mb-8 space-y-4">
                                {/* Search Bar */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t('academy_search_placeholder')}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-[#0a0f1a]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl px-5 py-3 pl-12 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                                    />
                                    <BookOpen className="w-5 h-5 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                </div>

                                {/* Category Filters */}
                                <div className="flex gap-3 flex-wrap">
                                    {['Tous', 'Débutant', 'Intermédiaire', 'Avancé'].map(category => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${selectedCategory === category
                                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30'
                                                : 'bg-[#0a0f1a]/40 border border-cyan-500/20 text-slate-300 hover:border-cyan-500/40 hover:bg-[#0a0f1a]/60'
                                                }`}
                                        >
                                            {category === 'Tous' ? t('academy_categories_all') :
                                                category === 'Débutant' ? t('academy_categories_beginner') :
                                                    category === 'Intermédiaire' ? t('academy_categories_intermediate') :
                                                        t('academy_categories_advanced')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCourses.map((course) => (
                                    <TiltCard key={course.id} className="glass-glow rounded-2xl hover:border-cyan-500/50 cursor-pointer group shadow-xl" tiltAmount={6} scale={1.02}>
                                        {/* Thumbnail */}
                                        <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-10 flex items-center justify-center border-b border-cyan-500/10 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
                                            <span className="text-7xl relative z-10 drop-shadow-2xl filter transform group-hover:scale-110 transition-transform duration-500">{course.thumbnail}</span>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${course.level === 'Débutant' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    course.level === 'Intermédiaire' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                    }`}>
                                                    {course.level === 'Débutant' ? t('academy_categories_beginner') :
                                                        course.level === 'Intermédiaire' ? t('academy_categories_intermediate') :
                                                            t('academy_categories_advanced')}
                                                </span>
                                                {course.progress === 100 && (
                                                    <div className="flex items-center text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        {t('academy_finished_badge')}
                                                    </div>
                                                )}
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors line-clamp-1">
                                                {course.title}
                                            </h3>
                                            <p className="text-slate-400 text-sm mb-4 line-clamp-2 h-10 leading-relaxed">
                                                {course.description}
                                            </p>

                                            {/* Tags */}
                                            {course.tags && course.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {course.tags.slice(0, 3).map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="text-xs px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-6 bg-white/5 p-3 rounded-xl">
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-2 text-cyan-400" />
                                                    {course.duration}
                                                </div>
                                                {course.lessons > 0 && (
                                                    <>
                                                        <div className="w-px h-4 bg-white/10"></div>
                                                        <div className="flex items-center">
                                                            <BookOpen className="w-4 h-4 mr-2 text-blue-400" />
                                                            {course.lessons} {t('academy_lesson_count')}
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Progress Bar */}
                                            {course.progress > 0 && (
                                                <div className="mb-6">
                                                    <div className="flex items-center justify-between text-xs mb-2">
                                                        <span className="text-slate-400 font-bold uppercase tracking-wider">{t('academy_progression')}</span>
                                                        <span className="text-white font-bold">{course.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                                                        <div
                                                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-1000"
                                                            style={{ width: `${course.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* CTA Button */}
                                            <button
                                                onClick={() => navigate(`/academy/${course.id}`)}
                                                className={`w-full font-bold py-3.5 px-4 rounded-xl flex items-center justify-center transition-all ${course.progress === 100
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                                                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-600/20'
                                                    }`}>
                                                {course.progress === 100 ? (
                                                    <>{t('academy_btn_review')}</>
                                                ) : (
                                                    <>
                                                        <Play className="w-4 h-4 mr-2 fill-current" />
                                                        {course.progress === 0 ? t('academy_btn_start') : t('academy_btn_resume')}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </TiltCard>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropAcademy;
