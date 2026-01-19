import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    Search,
    MoreVertical,
    CheckCircle,
    XCircle,
    LayoutDashboard,
    Settings,
    CreditCard,
    Activity,
    LogOut,
    TrendingUp as TrendingIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const mockUsers = [
    { id: 1, name: 'Ahmed Bennani', email: 'ahmed@example.com', plan: 'Elite', status: 'Active', profit: 24.5, balance: 25000 },
    { id: 2, name: 'Sarah El Amrani', email: 'sarah@example.com', plan: 'Pro', status: 'Active', profit: 15.2, balance: 10000 },
    { id: 3, name: 'Youssef Tazi', email: 'youssef@example.com', plan: 'Starter', status: 'Failed', profit: -8.5, balance: 5000 },
    { id: 4, name: 'Fatima Zahra', email: 'fatima@example.com', plan: 'Pro', status: 'Passed', profit: 12.1, balance: 10000 },
    { id: 5, name: 'Omar Idrissi', email: 'omar@example.com', plan: 'Elite', status: 'Active', profit: 8.7, balance: 25000 },
];

const stats = [
    { label: 'Total Users', value: '2,547', icon: Users, change: '+12%', color: 'from-primary to-purple-400' },
    { label: 'Revenue', value: '1.2M DH', icon: DollarSign, change: '+8%', color: 'from-success to-emerald-400' },
    { label: 'Active Challenges', value: '847', icon: TrendingUp, change: '+15%', color: 'from-purple-500 to-pink-500' },
    { label: 'Failed This Month', value: '23', icon: AlertTriangle, change: '-5%', color: 'from-warning to-orange-400' },
];

const AdminPanel = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const { toast } = useToast();
    const navigate = useNavigate();

    const filteredUsers = mockUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStatusChange = (userId: number, newStatus: string) => {
        toast({
            title: 'Status Updated',
            description: `User #${userId} status changed to ${newStatus}`,
        });
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
        { icon: Users, label: 'Users', id: 'users' },
        { icon: Activity, label: 'Trades', id: 'trades' },
        { icon: CreditCard, label: 'Payments', id: 'payments' },
        { icon: Settings, label: 'Settings', id: 'settings' },
    ];

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden lg:flex flex-col">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                            <TrendingIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="text-lg font-bold">TradeSense</span>
                            <span className="text-xs text-destructive ml-2 font-medium">ADMIN</span>
                        </div>
                    </Link>
                </div>

                {/* Menu */}
                <nav className="flex-1 py-4 px-3 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${activeTab === item.id
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-sidebar-border">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => navigate('/login')}
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-8 overflow-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                    <p className="text-muted-foreground">Manage users, trades, and platform settings</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="glass-glow p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-sm text-muted-foreground">{stat.label}</span>
                            </div>
                            <div className="flex items-end justify-between">
                                <div className="text-2xl font-bold trading-number">{stat.value}</div>
                                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Users Table */}
                <div className="glass-glow">
                    <div className="p-6 border-b border-border">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h2 className="text-lg font-semibold">User Management</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full sm:w-64 bg-secondary border-border"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-secondary/50">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">User</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Plan</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Balance</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Profit</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                                    <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                                        <td className="py-4 px-6">
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${user.plan === 'Elite' ? 'bg-purple-500/20 text-purple-400' :
                                                user.plan === 'Pro' ? 'bg-primary/20 text-primary' :
                                                    'bg-secondary text-muted-foreground'
                                                }`}>
                                                {user.plan}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 trading-number">${user.balance.toLocaleString()}</td>
                                        <td className="py-4 px-6">
                                            <span className={`trading-number font-medium ${user.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                                                {user.profit >= 0 ? '+' : ''}{user.profit}%
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-primary/20 text-primary' :
                                                user.status === 'Passed' ? 'bg-success/20 text-success' :
                                                    'bg-destructive/20 text-destructive'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'Passed')}>
                                                        <CheckCircle className="w-4 h-4 mr-2 text-success" />
                                                        Mark as Passed
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'Failed')}>
                                                        <XCircle className="w-4 h-4 mr-2 text-destructive" />
                                                        Mark as Failed
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
