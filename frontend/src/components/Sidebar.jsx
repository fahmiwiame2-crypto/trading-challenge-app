import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
    Home,
    LayoutDashboard,
    Trophy,
    TrendingUp,
    Target,
    DollarSign,
    BarChart3,
    GraduationCap,
    Settings,
    User,
    Users,
    Newspaper
} from 'lucide-react';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const { t } = useLanguage();

    const menuItems = [
        { icon: Home, label: t('sidebar_home'), path: '/', color: 'text-cyan-400' },
        { icon: LayoutDashboard, label: t('sidebar_overview'), path: '/overview', color: 'text-cyan-400' },
        { icon: Newspaper, label: t('sidebar_news_hub'), path: '/news-hub', color: 'text-cyan-400' },
        { icon: Users, label: t('sidebar_community'), path: '/community', color: 'text-blue-400' },
        { icon: Trophy, label: t('sidebar_leaderboard'), path: '/leaderboard', color: 'text-cyan-400' },
        { icon: TrendingUp, label: t('sidebar_market'), path: '/market', color: 'text-blue-400' },
        { icon: Target, label: t('sidebar_challenges'), path: '/challenges', color: 'text-blue-400' },
        { icon: DollarSign, label: t('sidebar_get_funded'), path: '/pricing', color: 'text-emerald-400' },
        { icon: GraduationCap, label: t('sidebar_academy'), path: '/academy', color: 'text-blue-400' },
        { icon: Settings, label: t('sidebar_settings'), path: '/settings', color: 'text-slate-400' },
    ];

    return (
        <div className="hidden md:flex flex-col w-64 h-screen bg-[#0a0f1a] border-r border-cyan-900/30 fixed left-0 top-0 z-10">
            {/* Logo */}
            <div className="p-6 border-b border-cyan-900/30">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-cyan-500/20">
                        TS
                    </div>
                    <span className="text-foreground font-bold text-lg tracking-tight">TradeSense</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} />
                                <span className="font-medium">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-cyan-900/30">
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shadow-cyan-500/20">
                        {user?.username?.substring(0, 2).toUpperCase() || 'WI'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-foreground font-medium text-sm truncate">
                            {user?.username || 'wiame'}
                        </p>
                        <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wide">
                            {t('sidebar_candidate_level')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
