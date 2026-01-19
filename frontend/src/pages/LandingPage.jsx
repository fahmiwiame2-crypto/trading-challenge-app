import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TiltCard from '../components/ui/TiltCard';
import { useLanguage } from '../context/LanguageContext';
import { TrendingUp, Users, Shield, Zap, BookOpen, ChevronRight, Award, Target, DollarSign, BarChart3 } from 'lucide-react';

const LandingPage = () => {
    const { t } = useLanguage();

    const stats = [
        { value: '$2.1M+', labelKey: 'landing_stats_capital', icon: DollarSign },
        { value: '1,200+', labelKey: 'landing_stats_traders', icon: Users },
        { value: '89%', labelKey: 'landing_stats_success', icon: Target },
        { value: '24/7', labelKey: 'landing_stats_support', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-transparent text-foreground font-sans selection:bg-primary-500 selection:text-white overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <div className="relative overflow-hidden pt-32 pb-20">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-8 backdrop-blur-sm">
                            <Zap className="w-4 h-4 text-cyan-400 mr-2" />
                            <span className="text-sm text-cyan-300 font-medium">{t('landing_badge')}</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 animate-gradient">
                                TradeSense AI
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                            {t('landing_subtitle')}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                            <Link
                                to="/pricing"
                                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full font-bold text-lg transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    {t('landing_cta_start')}
                                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </Link>
                            <Link
                                to="/leaderboard"
                                className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-full font-bold text-lg transition-all hover:bg-slate-800/80 hover:border-cyan-500/40"
                            >
                                {t('landing_cta_view')}
                            </Link>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            {stats.map((stat, index) => (
                                <TiltCard key={index} className="glass-glow p-6 group" tiltAmount={12} scale={1.05}>
                                    <stat.icon className="w-8 h-8 text-cyan-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
                                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-slate-400">{t(stat.labelKey)}</div>
                                </TiltCard>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-[#0a0f1a]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                            {t('landing_features_title')}
                        </h2>
                        <p className="text-slate-400 text-lg">{t('landing_features_subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1: AI Assistance */}
                        <div className="group relative glass-glow p-8 rounded-3xl transition-all hover:transform hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-blue-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Zap className="w-8 h-8 text-cyan-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">{t('landing_feature_ai_title')}</h3>
                                <ul className="text-slate-400 space-y-2 text-sm text-left list-disc pl-4">
                                    <li>{t('landing_feature_ai_1')}</li>
                                    <li>{t('landing_feature_ai_2')}</li>
                                    <li>{t('landing_feature_ai_3')}</li>
                                    <li>{t('landing_feature_ai_4')}</li>
                                </ul>
                            </div>
                        </div>

                        {/* Feature 2: Live News Hub */}
                        <div className="group relative glass-glow p-8 rounded-3xl transition-all hover:transform hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-teal-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">{t('landing_feature_news_title')}</h3>
                                <ul className="text-slate-400 space-y-2 text-sm text-left list-disc pl-4">
                                    <li>{t('landing_feature_news_1')}</li>
                                    <li>{t('landing_feature_news_2')}</li>
                                    <li>{t('landing_feature_news_3')}</li>
                                    <li>{t('landing_feature_news_4')}</li>
                                </ul>
                            </div>
                        </div>

                        {/* Feature 3: Community Zone */}
                        <div className="group relative glass-glow p-8 rounded-3xl transition-all hover:transform hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Users className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">{t('landing_feature_community_title')}</h3>
                                <ul className="text-slate-400 space-y-2 text-sm text-left list-disc pl-4">
                                    <li>{t('landing_feature_community_1')}</li>
                                    <li>{t('landing_feature_community_2')}</li>
                                    <li>{t('landing_feature_community_3')}</li>
                                    <li>{t('landing_feature_community_4')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-blue-600/10"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <Award className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                        {t('landing_cta_ready')}
                    </h2>
                    <p className="text-xl text-slate-300 mb-10">
                        {t('landing_cta_join')}
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-5 px-12 rounded-full text-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
                    >
                        {t('landing_cta_create')}
                        <ChevronRight className="ml-2 w-6 h-6" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;

