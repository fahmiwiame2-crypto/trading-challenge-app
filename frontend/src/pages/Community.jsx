import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';
import {
    Users, MessageSquare, Share2, GraduationCap, Send, Search, Star, Hash,
    Heart, UserPlus, MessageCircle, BookOpen, Trophy, TrendingUp, Zap,
    Video, Calendar, ChevronRight, Globe, Sparkles, Target, X, Check, LogIn, AlertTriangle
} from 'lucide-react';

const Community = () => {
    const { t, language } = useLanguage();
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('feed');
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [myGroups, setMyGroups] = useState([]);
    const [showStrategyModal, setShowStrategyModal] = useState(false);
    const [showLiveModal, setShowLiveModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [showCoursePlayer, setShowCoursePlayer] = useState(false);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

    // Messaging states
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showBrowseGroupsModal, setShowBrowseGroupsModal] = useState(false);

    // Trader Chat states
    const [selectedTrader, setSelectedTrader] = useState(null);
    const [traderChatMessages, setTraderChatMessages] = useState([]);
    const [traderChatInput, setTraderChatInput] = useState('');

    // Groups states
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [selectedGroupChat, setSelectedGroupChat] = useState(null);
    const [groupChatMessages, setGroupChatMessages] = useState([]);
    const [groupChatInput, setGroupChatInput] = useState('');
    const [newGroup, setNewGroup] = useState({
        name: '',
        desc: '',
        icon: '👥',
        color: 'from-cyan-500 to-blue-600'
    });

    // Available groups data
    const availableGroups = [
        { id: 1, name: 'Forex Elite', members: 1248, desc: 'Analyses et signaux forex', icon: '💹', color: 'from-cyan-500 to-blue-600' },
        { id: 2, name: 'Crypto Hunters', members: 892, desc: 'Opportunités crypto en temps réel', icon: '🪙', color: 'from-orange-500 to-amber-600' },
        { id: 3, name: 'Gold & Commodities', members: 567, desc: 'Analyse des matières premières', icon: '🥇', color: 'from-yellow-500 to-amber-500' },
        { id: 4, name: 'Day Trading Pro', members: 1523, desc: 'Stratégies de day trading', icon: '📊', color: 'from-emerald-500 to-teal-600' },
        { id: 5, name: 'Prop Firm Success', members: 734, desc: 'Réussir les challenges prop firm', icon: '🏆', color: 'from-purple-500 to-indigo-600' },
        { id: 6, name: 'Débutants Bienvenus', members: 2156, desc: 'Apprenez les bases du trading', icon: '🎓', color: 'from-pink-500 to-rose-600' },
    ];

    const handleJoinNewGroup = (group) => {
        if (!joinedGroups.find(g => g.id === group.id)) {
            setJoinedGroups([...joinedGroups, { ...group, unread: 0 }]);
            toast.success(`Vous avez rejoint ${group.name} !`);
        }
    };

    const handleLeaveGroup = (groupId) => {
        setJoinedGroups(joinedGroups.filter(g => g.id !== groupId));
        toast.info('Vous avez quitté le groupe');
    };

    const openGroupChat = (group) => {
        setSelectedGroupChat(group);
        setGroupChatMessages([
            { id: 1, sender: 'system', user: 'Système', text: `Bienvenue dans ${group.name} !`, time: '10:00' },
            { id: 2, sender: 'other', user: 'Admin', text: 'Salut tout le monde ! N\'hésitez pas à partager vos analyses 📊', time: '10:05' },
            { id: 3, sender: 'other', user: 'TraderPro', text: 'Hey ! Quelqu\'un regarde EUR/USD aujourd\'hui ?', time: '10:15' },
        ]);
    };

    const [newStrategy, setNewStrategy] = useState({
        title: '',
        description: '',
        market: 'Forex',
        timeframe: 'H1',
        riskLevel: 'Moyen'
    });
    const [posts, setPosts] = useState([
        {
            id: 1,
            user: 'Alex_Trade',
            avatar: 'AT',
            content: 'Le BTC semble former une belle tasse avec anse sur le daily. Qu\'en pensez-vous ? #BTC #Bullish',
            time: 'Il y a 10 min',
            likes: 24,
            comments: 5,
            liked: false
        },
        {
            id: 2,
            user: 'Expert_Karim',
            avatar: 'EK',
            content: 'Nouveau tutoriel disponible sur la gestion du risque en Prop Firm ! Allez voir la section Academy. #Education',
            time: 'Il y a 1h',
            likes: 45,
            comments: 12,
            isExpert: true,
            liked: false
        },
        {
            id: 3,
            user: 'Sarah_FX',
            avatar: 'SF',
            content: 'Ma stratégie sur l\'EUR/USD a encore payé aujourd\'hui. +2% sur le compte challenge. La discipline paye !',
            time: 'Il y a 3h',
            likes: 89,
            comments: 18,
            liked: false
        }
    ]);

    const [friends, setFriends] = useState([
        { id: 1, name: 'Mohammed_Pro', avatar: 'MP', status: 'online', level: 'Elite Trader' },
        { id: 2, name: 'Fatima_FX', avatar: 'FF', status: 'online', level: 'Pro Trader' },
        { id: 3, name: 'Youssef_Crypto', avatar: 'YC', status: 'away', level: 'Funded' },
        { id: 4, name: 'Amina_Trade', avatar: 'AT', status: 'offline', level: 'Candidate' },
    ]);

    const [suggestedTraders, setSuggestedTraders] = useState([
        { id: 1, name: 'Hassan_Elite', avatar: 'HE', followers: 2340, winRate: '78%', isFollowing: false },
        { id: 2, name: 'Leila_Pro', avatar: 'LP', followers: 1890, winRate: '82%', isFollowing: false },
        { id: 3, name: 'Omar_FX', avatar: 'OF', followers: 3200, winRate: '75%', isFollowing: false },
    ]);

    const handlePublish = () => {
        if (!message.trim()) return;

        const newPost = {
            id: Date.now(),
            user: 'wiame',
            avatar: 'WI',
            content: message,
            time: 'À l\'instant',
            likes: 0,
            comments: 0,
            liked: false
        };

        setPosts([newPost, ...posts]);
        setMessage('');
    };

    const handleLike = (postId) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    liked: !post.liked,
                    likes: post.liked ? post.likes - 1 : post.likes + 1
                };
            }
            return post;
        }));
    };

    const handleFollowTrader = (traderId) => {
        setSuggestedTraders(suggestedTraders.map(trader => {
            if (trader.id === traderId) {
                const newFollowingState = !trader.isFollowing;
                const followerChange = newFollowingState ? 1 : -1;

                if (newFollowingState) {
                    toast.success(`Vous suivez maintenant ${trader.name} !`);
                } else {
                    toast.success(`Vous ne suivez plus ${trader.name}`);
                }

                return {
                    ...trader,
                    isFollowing: newFollowingState,
                    followers: trader.followers + followerChange
                };
            }
            return trader;
        }));
    };

    const [groups, setGroups] = useState([
        { id: 1, name: 'Crypto Alpha', members: 1240, active: true, color: 'from-cyan-500 to-blue-500', description: 'Discussions sur les cryptomonnaies et analyses techniques.' },
        { id: 2, name: 'Forex Mastery', members: 850, active: false, color: 'from-blue-600 to-indigo-600', description: 'Stratégies Forex et partage de signaux.' },
        { id: 3, name: 'BVC Traders', members: 420, active: true, color: 'from-teal-500 to-cyan-500', description: 'Trading sur la Bourse de Casablanca.' },
        { id: 4, name: 'Strategy Lab', members: 630, active: true, color: 'from-cyan-600 to-teal-600', description: 'Laboratoire de stratégies et backtesting.' },
        { id: 5, name: 'Scalping Masters', members: 980, active: true, color: 'from-emerald-500 to-cyan-500', description: 'Techniques de scalping et day trading.' },
    ]);

    const handleOpenGroupModal = (group) => {
        setSelectedGroup(group);
        setShowGroupModal(true);
    };

    const handleJoinGroup = (groupId) => {
        if (myGroups.includes(groupId)) {
            // Quitter le groupe
            setMyGroups(myGroups.filter(id => id !== groupId));
            setGroups(groups.map(g => g.id === groupId ? { ...g, members: g.members - 1 } : g));
            toast.success('Vous avez quitté le groupe');
        } else {
            // Rejoindre le groupe
            setMyGroups([...myGroups, groupId]);
            setGroups(groups.map(g => g.id === groupId ? { ...g, members: g.members + 1 } : g));
            toast.success('Vous avez rejoint le groupe !');
        }
        setShowGroupModal(false);
    };

    const [strategies, setStrategies] = useState([
        { id: 1, title: 'Breakout Trading', author: 'Expert_Karim', views: 1245, rating: 4.8, description: 'Stratégie basée sur les cassures de niveaux clés.', market: 'Forex', timeframe: 'H4' },
        { id: 2, title: 'Support/Resistance', author: 'Sarah_FX', views: 890, rating: 4.6, description: 'Trading sur les zones de support et résistance.', market: 'Forex', timeframe: 'H1' },
        { id: 3, title: 'Price Action', author: 'Mohammed_Pro', views: 2100, rating: 4.9, description: 'Lecture du marché sans indicateurs.', market: 'Crypto', timeframe: 'D1' },
    ]);

    const handleShareStrategy = () => {
        if (!newStrategy.title.trim() || !newStrategy.description.trim()) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }

        const strategy = {
            id: Date.now(),
            title: newStrategy.title,
            author: 'wiame',
            views: 0,
            rating: 0,
            description: newStrategy.description,
            market: newStrategy.market,
            timeframe: newStrategy.timeframe,
            riskLevel: newStrategy.riskLevel,
            isNew: true
        };

        setStrategies([strategy, ...strategies]);
        setNewStrategy({ title: '', description: '', market: 'Forex', timeframe: 'H1', riskLevel: 'Moyen' });
        setShowStrategyModal(false);
        toast.success('Stratégie partagée avec succès !');
    };

    const upcomingEvents = [
        { id: 1, title: 'Live Trading Session', expert: 'Expert_Karim', avatar: 'EK', time: 'Aujourd\'hui 14h', type: 'live', description: 'Session de trading en direct sur EUR/USD avec analyse technique.', viewers: 245, videoId: 'p7HKvqRI_Bo' },
        { id: 2, title: 'Analyse Weekly BTC', expert: 'Alex_Trade', avatar: 'AT', time: 'Demain 10h', type: 'analysis', description: 'Analyse complète du Bitcoin pour la semaine à venir.', viewers: 0, videoId: 'YMXGfQjMv8s' },
        { id: 3, title: 'Q&A Prop Trading', expert: 'Sarah_FX', avatar: 'SF', time: 'Vendredi 16h', type: 'qa', description: 'Posez vos questions sur le Prop Trading et les challenges.', viewers: 0, videoId: 'D3qX9c0HlE0' },
    ];

    const handleJoinSession = (event) => {
        setSelectedSession(event);
        setShowLiveModal(true);
    };

    const handleRemindSession = (event) => {
        toast.success(`Rappel défini pour "${event.title}"`);
    };

    const expertCourses = [
        {
            id: 1,
            title: 'Masterclass Price Action',
            expert: 'Expert_Karim',
            avatar: 'EK',
            duration: '4h 30min',
            lessons: 12,
            students: 1240,
            rating: 4.9,
            level: 'Avancé',
            price: 'Gratuit',
            description: 'La méthode ultime pour lire le marché sans indicateurs. Basé sur la méthodologie institutionnelle.',
            lessonsList: [
                {
                    title: 'La vérité sur les chandeliers',
                    videoId: 'nLnjnJpNoxM',
                    duration: '18:20',
                    summary: "Au-delà de la forme, comprenez la psychologie des acheteurs et vendeurs derrière chaque bougie japonaise.",
                    keyPoints: ["Lecture du momentum", "Rejet de prix (Mèches)", "La taille du corps vs range"],
                    writtenContent: {
                        introduction: "Les chandeliers japonais sont bien plus que de simples formes sur un graphique. Chaque bougie raconte une histoire de bataille entre acheteurs et vendeurs. Dans cette leçon, vous allez apprendre à décoder cette psychologie cachée pour anticiper les mouvements du marché avant qu'ils ne se produisent.",
                        sections: [
                            {
                                title: "Anatomie d'un chandelier : Au-delà des bases",
                                content: "Un chandelier se compose de trois éléments clés : le corps, la mèche haute et la mèche basse. Le CORPS représente la zone entre l'ouverture et la clôture - c'est le champ de bataille principal. Une bougie verte (haussière) signifie que les acheteurs ont gagné : le prix a clôturé au-dessus de l'ouverture. Une bougie rouge (baissière) indique la victoire des vendeurs.\n\nMais la vraie information se trouve dans les MÈCHES. Une longue mèche haute montre que les acheteurs ont tenté de pousser le prix vers le haut, mais ont été rejetés par les vendeurs. C'est un signe de REJET et de faiblesse haussière. Inversement, une longue mèche basse indique que les vendeurs ont échoué à maintenir le prix bas - un signe de force acheteuse potentielle.\n\nLe RATIO corps/mèche est crucial. Un corps large avec de petites mèches montre une domination claire d'un camp. Un petit corps avec de longues mèches indique l'indécision et un équilibre des forces."
                            },
                            {
                                title: "Lire le momentum : La taille compte",
                                content: "La TAILLE du corps d'une bougie révèle l'intensité du mouvement. Un corps très large indique une forte conviction - beaucoup de volume et d'énergie derrière le mouvement. Ces bougies apparaissent souvent lors de breakouts importants ou d'annonces économiques.\n\nÀ l'inverse, un corps minuscule (doji ou spinning top) montre l'hésitation du marché. Les acheteurs et vendeurs sont en équilibre, personne ne contrôle. Ces formations apparaissent souvent avant des retournements majeurs ou dans des zones de consolidation.\n\nLe RANGE total (du haut de la mèche haute au bas de la mèche basse) indique la volatilité. Un range étroit suggère un marché calme, tandis qu'un range explosif montre une forte activité et des émotions intenses."
                            },
                            {
                                title: "Contexte et confluence : Le secret des pros",
                                content: "Une bougie isolée ne signifie RIEN. C'est le contexte qui donne du sens. Une pinbar (longue mèche) à un niveau de support majeur est un signal puissant de retournement. La même pinbar au milieu de nulle part n'a aucune valeur.\n\nCherchez toujours des CONFLUENCES : une bougie de rejet + un niveau S/R + une zone de Fibonacci + un indicateur de surachat = signal haute probabilité. Les traders professionnels ne tradent jamais une bougie seule, ils attendent que plusieurs facteurs s'alignent."
                            }
                        ],
                        examples: "**Exemple concret :** Imaginez EUR/USD à 1.1000, un support clé testé 3 fois. Le prix descend à 1.0995, crée une longue mèche basse (rejet), puis clôture à 1.1015 avec un corps vert. Cette bougie vous dit : 'Les vendeurs ont essayé de casser le support, ont échoué, et les acheteurs ont repris le contrôle.' C'est un signal d'achat haute probabilité avec stop sous 1.0990.",
                        mistakes: [
                            "Trader chaque pattern de chandelier sans regarder le contexte (niveau S/R, tendance, etc.)",
                            "Ignorer la taille du corps - un petit doji n'a pas la même force qu'un engulfing massif",
                            "Ne pas attendre la clôture de la bougie - le prix peut changer radicalement dans les dernières minutes",
                            "Oublier le timeframe - une pinbar en M5 est moins significative qu'une pinbar en H4"
                        ],
                        actionSteps: [
                            "Ouvrez votre plateforme de trading et observez 20 bougies récentes sur EUR/USD en H1",
                            "Pour chaque bougie, identifiez : corps (taille et couleur), mèches (longueur), et range total",
                            "Notez les bougies avec de longues mèches et vérifiez si elles sont apparues à des niveaux S/R importants",
                            "Créez un journal de 5 bougies significatives avec screenshots et annotations",
                            "Avant de trader, posez-vous : 'Cette bougie est-elle à un niveau clé ? Y a-t-il confluence ?'"
                        ]
                    }
                },
                {
                    title: 'Support & Résistance Avancés',
                    videoId: 'osAObnlRMFI',
                    duration: '22:15',
                    summary: "Arrêtez de tracer des lignes au hasard. Apprenez à identifier les zones de liquidité clés où les banques agissent.",
                    keyPoints: ["Zones vs Lignes", "Flip S/R", "Faux breakouts"],
                    writtenContent: {
                        introduction: "Les supports et résistances sont les fondations du trading. Mais 90% des traders les utilisent mal. Ils tracent des lignes fines et précises, alors que les institutions pensent en ZONES. Dans cette leçon, vous allez apprendre à voir le marché comme les professionnels.",
                        sections: [
                            {
                                title: "Zones vs Lignes : Changez votre perspective",
                                content: "Oubliez les lignes précises à 1.1000 exactement. Le marché ne rebondit jamais exactement au pip près. Les institutions créent des ZONES de liquidité entre 1.0995 et 1.1005 par exemple. C'est dans cette zone que se trouvent les ordres massifs.\n\nPourquoi des zones ? Parce que les gros acteurs (banques, hedge funds) ne peuvent pas entrer avec des millions en un seul ordre. Ils étalent leurs positions sur plusieurs niveaux de prix. Votre travail est d'identifier ces zones où la liquidité est concentrée.\n\nComment tracer une zone ? Regardez les anciens hauts/bas, pas juste le pic exact, mais toute la zone où le prix a hésité, consolidé, ou inversé plusieurs fois. Une zone de 20-30 pips est normale sur les paires majeures en H4."
                            },
                            {
                                title: "Le Flip S/R : Quand le support devient résistance",
                                content: "C'est l'un des concepts les plus puissants du trading. Quand un support est cassé, il devient résistance. Quand une résistance est cassée, elle devient support. Pourquoi ?\n\nPsychologie : Les traders qui ont acheté au support et qui se sont fait piéger vont vouloir sortir 'break-even' quand le prix revient. Cela crée une pression vendeuse (résistance). Les vendeurs qui ont shorté la cassure vont placer leurs stops juste au-dessus de l'ancien support, créant encore plus de résistance.\n\nLe retest du flip est un signal d'entrée haute probabilité. Attendez que le prix casse un support, revienne le tester comme résistance, montre un rejet (pinbar, engulfing), puis entrez short."
                            },
                            {
                                title: "Faux breakouts : Le piège mortel",
                                content: "Les faux breakouts (fake-outs) tuent plus de comptes que n'importe quoi d'autre. Le prix casse un niveau clé, vous entrez, puis il revient brutalement et déclenche votre stop.\n\nPourquoi ça arrive ? Les institutions CHASSENT la liquidité. Elles savent où sont les stops des traders retail (juste au-dessus des résistances, juste en-dessous des supports). Elles poussent le prix pour déclencher ces stops, récupèrent la liquidité, puis inversent dans la vraie direction.\n\nComment éviter ? N'entrez JAMAIS sur la cassure elle-même. Attendez le RETEST et la CONFIRMATION (bougie de rejet, volume, confluence avec un autre niveau). La patience sauve des comptes."
                            }
                        ],
                        examples: "**Exemple réel :** EUR/USD a une résistance à 1.1050 testée 4 fois. Le prix casse à 1.1065 (faux breakout), déclenche les stops des vendeurs, puis retombe à 1.1040. Les traders impatients ont perdu. Le trader patient attend le retour à 1.1050 (ancien résistance = nouveau support), voit une pinbar haussière, et entre long avec stop à 1.1035. Le prix monte à 1.1150. C'est la différence entre un trader gagnant et perdant.",
                        mistakes: [
                            "Tracer des lignes au pip près au lieu de zones de 20-30 pips",
                            "Entrer immédiatement sur un breakout sans attendre le retest",
                            "Ignorer le flip S/R - ne pas utiliser les anciens supports comme résistances",
                            "Placer les stops exactement sur les niveaux évidents (c'est là que les institutions chassent)"
                        ],
                        actionSteps: [
                            "Ouvrez un graphique H4 de votre paire préférée et identifiez 3 zones S/R majeures (pas des lignes !)",
                            "Pour chaque zone, tracez un rectangle de 20-30 pips et notez combien de fois elle a été testée",
                            "Trouvez un exemple de flip S/R dans l'historique : un support cassé qui est devenu résistance",
                            "Identifiez 2 faux breakouts récents et analysez ce qui s'est passé après",
                            "Créez une règle personnelle : 'Je n'entre jamais sur un breakout, j'attends toujours le retest + confirmation'"
                        ]
                    }
                },
                {
                    title: 'Les Structures de Marché',
                    videoId: 'XagLzmfh3a0',
                    duration: '15:40',
                    summary: "Comment identifier la tendance réelle et ne plus jamais trader à contre-courant.",
                    keyPoints: ["Higher Highs / Lower Lows", "Break of Structure (BOS)", "Change of Character (CHoCH)"],
                    writtenContent: {
                        introduction: "La structure de marché est le GPS du trader. Sans elle, vous naviguez à l'aveugle. Avec elle, vous savez exactement où vous êtes et où le marché va probablement aller. Cette leçon va transformer votre façon de voir les graphiques.",
                        sections: [
                            {
                                title: "Higher Highs & Higher Lows : La tendance haussière",
                                content: "Une tendance haussière se définit par une série de Higher Highs (HH) et Higher Lows (HL). Chaque sommet est plus haut que le précédent, chaque creux est plus haut que le précédent. C'est mathématique, objectif, sans émotion.\n\nPourquoi c'est important ? Tant que cette structure est intacte, le biais est HAUSSIER. Vous cherchez uniquement des opportunités d'achat aux Higher Lows. Vendre dans une tendance haussière claire est du suicide financier.\n\nComment trader ? Attendez que le prix revienne à un HL (pullback), cherchez une confluence (zone S/R, Fibonacci 50-61.8%), attendez une confirmation (pinbar, engulfing), puis achetez avec stop sous le HL précédent."
                            },
                            {
                                title: "Break of Structure (BOS) : La continuation",
                                content: "Un BOS se produit quand le prix casse le dernier HH (en tendance haussière) ou le dernier LL (en tendance baissière). C'est la CONFIRMATION que la tendance continue avec force.\n\nExemple haussier : Le prix fait un HH à 1.1100, pullback à 1.1050 (HL), puis casse 1.1100 pour aller à 1.1150. Ce BOS confirme la force haussière. C'est un signal pour chercher le prochain HL pour entrer long.\n\nLes BOS sont des moments de haute probabilité. Après un BOS, le marché a souvent un mouvement explosif car tous les traders techniques voient la même chose et entrent dans la même direction."
                            },
                            {
                                title: "Change of Character (CHoCH) : Le retournement",
                                content: "Le CHoCH est le signal d'alerte que la tendance pourrait s'inverser. En tendance haussière, un CHoCH se produit quand le prix casse le dernier HL au lieu de faire un nouveau HH.\n\nExemple : Prix à 1.1100 (HH), pullback à 1.1050 (HL), mais au lieu de monter, le prix casse 1.1050 et va à 1.1020. ALERTE ! La structure haussière est brisée. Ne cherchez plus d'achats, passez en mode neutre ou baissier.\n\nAttention : Un CHoCH n'est pas toujours un retournement complet. Parfois c'est juste une consolidation. Attendez la confirmation : le prix doit ensuite faire un Lower Low pour confirmer la nouvelle tendance baissière."
                            }
                        ],
                        examples: "**Scénario complet :** GBP/USD en tendance haussière. HH à 1.2500, HL à 1.2450, nouveau HH à 1.2550 (BOS confirmé). Vous attendez le pullback au prochain HL vers 1.2500-1.2510. Une pinbar haussière apparaît à 1.2505. Vous achetez avec stop à 1.2480 (sous le HL) et target à 1.2600 (prochain HH potentiel). Risk/Reward : 25 pips de risque pour 95 pips de gain = 1:3.8. C'est du trading professionnel.",
                        mistakes: [
                            "Trader contre la structure - acheter dans une tendance baissière claire (LL + LH)",
                            "Ignorer les CHoCH - continuer à acheter alors que la structure haussière est cassée",
                            "Confondre un BOS avec un faux breakout - toujours attendre le pullback pour entrer",
                            "Ne pas marquer les HH, HL, LH, LL sur vos graphiques - c'est la base absolue"
                        ],
                        actionSteps: [
                            "Prenez un graphique H4 et marquez TOUS les HH et HL (ou LH et LL si baissier) des 3 derniers mois",
                            "Identifiez au moins 2 BOS (cassure de HH ou LL) et observez ce qui s'est passé après",
                            "Trouvez un exemple de CHoCH où la structure s'est cassée et la tendance a changé",
                            "Créez une checklist : 'Avant chaque trade, je vérifie : Quelle est la structure ? HH/HL ou LH/LL ?'",
                            "Règle d'or : N'achetez QUE dans une structure HH/HL, ne vendez QUE dans une structure LH/LL"
                        ]
                    }
                },
                {
                    title: 'Stratégie de la Pinbar',
                    videoId: 'D7plmzhFlSw',
                    duration: '14:30',
                    summary: "Le setup de retournement le plus puissant s'il est utilisé au bon endroit.",
                    keyPoints: ["Anatomie d'une Pinbar", "Confluences nécessaires", "Placement du Stop Loss"],
                    writtenContent: {
                        introduction: "La Pinbar (Pin Bar) est l'un des patterns de chandeliers les plus puissants pour trader les retournements. Mais attention : 90% des traders l'utilisent mal et perdent de l'argent. La différence entre une Pinbar gagnante et perdante ? Le CONTEXTE et les CONFLUENCES. Cette leçon va vous montrer comment trader les Pinbars comme un professionnel.",
                        sections: [
                            {
                                title: "Anatomie d'une Pinbar parfaite",
                                content: "Une Pinbar se compose de trois éléments : une LONGUE MÈCHE (au moins 2/3 de la bougie totale), un PETIT CORPS (idéalement moins de 1/3), et une MÈCHE OPPOSÉE MINIMALE (ou inexistante).\n\nPinbar haussière : Longue mèche basse + petit corps en haut + mèche haute minimale. Elle montre que les vendeurs ont poussé le prix vers le bas, mais ont été REJETÉS violemment par les acheteurs. C'est un signal de retournement haussier.\n\nPinbar baissière : Longue mèche haute + petit corps en bas + mèche basse minimale. Les acheteurs ont tenté de pousser le prix vers le haut, mais ont été écrasés par les vendeurs. Signal de retournement baissier.\n\nLa TAILLE de la mèche compte énormément. Plus elle est longue par rapport au corps, plus le rejet est fort, plus le signal est puissant. Une mèche de 80% de la bougie totale est bien meilleure qu'une mèche de 60%."
                            },
                            {
                                title: "Les confluences OBLIGATOIRES",
                                content: "Ne JAMAIS trader une Pinbar seule. Vous devez avoir au minimum 2-3 confluences pour un setup haute probabilité :\n\n1. **Niveau S/R majeur** : La Pinbar doit se former à un support ou résistance clé, testé plusieurs fois. Une Pinbar au milieu de nulle part ne vaut RIEN.\n\n2. **Zone de Fibonacci** : Idéalement à 50%, 61.8% ou 78.6% d'un retracement Fibonacci. Les institutions utilisent Fibo, donc ces zones ont de la liquidité.\n\n3. **Structure de marché** : En tendance haussière, tradez uniquement les Pinbars haussières aux Higher Lows. En tendance baissière, uniquement les Pinbars baissières aux Lower Highs.\n\n4. **Timeframe supérieur** : Vérifiez que le timeframe H4 ou Daily confirme votre direction. Une Pinbar haussière en M15 dans une tendance baissière H4 est un piège.\n\nPlus vous avez de confluences, plus votre probabilité de succès augmente. 3+ confluences = setup professionnel."
                            },
                            {
                                title: "Entrée, Stop Loss et Take Profit",
                                content: "**ENTRÉE** : Deux options. (1) Entrée agressive : dès la clôture de la Pinbar. (2) Entrée conservatrice : attendez que le prix casse le high de la Pinbar haussière (ou le low de la Pinbar baissière) pour confirmer le mouvement. L'entrée conservatrice réduit le taux de réussite mais améliore le risk/reward.\n\n**STOP LOSS** : Placez-le 5-10 pips SOUS la mèche basse de la Pinbar haussière (ou AU-DESSUS de la mèche haute pour une Pinbar baissière). Ne le placez JAMAIS exactement sur la mèche - laissez un peu de marge pour le 'noise' du marché.\n\n**TAKE PROFIT** : Visez le prochain niveau S/R majeur. Si vous êtes à un support et tradez une Pinbar haussière, votre TP est la prochaine résistance. Risk/Reward minimum : 1:2. Idéalement 1:3 ou plus. Si votre RR est inférieur à 1:2, ne prenez PAS le trade, même avec 5 confluences."
                            }
                        ],
                        examples: "**Trade réel :** GBP/USD en tendance haussière H4. Le prix pullback à 1.2650, un support majeur + 61.8% Fibo + Higher Low de la structure. Une Pinbar haussière se forme : mèche basse de 45 pips, corps de 8 pips, mèche haute de 3 pips. CONFLUENCES : Support clé ✓, Fibo 61.8% ✓, HL ✓, Tendance H4 haussière ✓. ENTRÉE : 1.2658 (clôture de la Pinbar). STOP : 1.2640 (sous la mèche -10 pips). TARGET : 1.2720 (prochaine résistance). RISQUE : 18 pips. GAIN : 62 pips. RR = 1:3.4. Le prix monte à 1.2735. Trade gagnant.",
                        mistakes: [
                            "Trader chaque Pinbar sans confluences - c'est du gambling, pas du trading",
                            "Placer le stop exactement sur la mèche sans marge - vous serez stoppé par le bruit du marché",
                            "Ignorer la tendance du timeframe supérieur - trader contre H4/Daily est suicidaire",
                            "Accepter un Risk/Reward inférieur à 1:2 - même avec 10 confluences, ce n'est pas rentable long terme",
                            "Trader des Pinbars en M1/M5 - trop de bruit, trop de faux signaux, utilisez minimum H1"
                        ],
                        actionSteps: [
                            "Ouvrez un graphique H4 de EUR/USD et identifiez 3 niveaux S/R majeurs des 6 derniers mois",
                            "Cherchez dans l'historique 5 Pinbars qui se sont formées à ces niveaux S/R",
                            "Pour chaque Pinbar, analysez : Taille de la mèche (%), confluences présentes, et ce qui s'est passé après",
                            "Tracez un retracement Fibonacci sur le dernier swing et notez si les Pinbars apparaissent aux niveaux 50/61.8/78.6%",
                            "Créez une checklist : 'Avant de trader une Pinbar, je vérifie : Niveau S/R ? Fibo ? Structure ? TF supérieur ? RR > 1:2 ?'"
                        ]
                    }
                }
            ]
        },
        {
            id: 2,
            title: 'Scalping & Day Trading',
            expert: 'Sarah_FX',
            avatar: 'SF',
            duration: '3h 15min',
            lessons: 8,
            students: 890,
            rating: 4.7,
            level: 'Intermédiaire',
            price: 'Premium',
            description: 'Techniques agressives pour capter les mouvements rapides du marché Crypto et Forex.',
            lessonsList: [
                {
                    title: 'Configuration du Scalpeur',
                    videoId: 'nz4D8myPijw',
                    duration: '12:00',
                    summary: "Les outils, indicateurs (VWAP, EMA) et unités de temps essentiels pour le scalping.",
                    keyPoints: ["Timeframes: M1/M5", "Configuration VWAP", "Gestion des spreads"],
                    writtenContent: {
                        introduction: "Le scalping est l'art de capturer de petits mouvements rapides, 5-15 pips, plusieurs fois par jour. C'est intense, stressant, mais extrêmement rentable si vous avez la bonne configuration. Cette leçon va vous montrer comment configurer votre plateforme comme un scalpeur professionnel.",
                        sections: [
                            {
                                title: "Timeframes : M1 et M5 uniquement",
                                content: "En scalping, vous vivez sur les timeframes M1 (1 minute) et M5 (5 minutes). Le M1 pour l'EXÉCUTION précise, le M5 pour le CONTEXTE et la direction.\n\nVotre routine : Ouvrez toujours le M5 en premier. Identifiez la tendance (haussière, baissière, range). Cherchez les niveaux S/R clés sur M5. Ensuite, descendez en M1 pour trouver vos entrées précises.\n\nNe tradez JAMAIS en M1 sans avoir vérifié le M5. Le M1 seul est du bruit pur. Le M5 vous donne la direction, le M1 vous donne le timing. Les deux ensemble = setup gagnant.\n\nTimeframes supérieurs : Jetez un œil rapide au H1 pour la tendance générale. Si H1 est fortement haussier, cherchez uniquement des scalps longs en M5/M1. Ne combattez jamais la tendance H1."
                            },
                            {
                                title: "VWAP : Votre ligne de vie",
                                content: "Le VWAP (Volume Weighted Average Price) est l'indicateur #1 des scalpeurs institutionnels. C'est le prix moyen pondéré par le volume depuis l'ouverture de la session.\n\nRègle simple : Prix AU-DESSUS du VWAP = biais haussier, cherchez des longs. Prix EN-DESSOUS du VWAP = biais baissier, cherchez des shorts. Le VWAP agit comme un aimant - le prix revient souvent vers lui.\n\nConfiguration : Ajoutez le VWAP à vos graphiques M1 et M5. Couleur suggérée : jaune ou blanc pour le voir clairement. Certains scalpeurs ajoutent aussi les bandes VWAP (écart-type +1/-1) pour identifier les zones de surachat/survente.\n\nStratégie VWAP : Attendez que le prix s'éloigne du VWAP (20-30 pips), puis tradez le retour vers le VWAP. Ou tradez les rebonds sur le VWAP dans une tendance forte."
                            },
                            {
                                title: "Spreads : Le tueur silencieux",
                                content: "Le spread est la différence entre le prix d'achat (ask) et de vente (bid). En scalping, le spread peut TUER votre rentabilité si vous ne faites pas attention.\n\nExemple : EUR/USD, spread de 1 pip. Vous scalpez 10 pips. Le spread vous coûte 10% de votre gain ! Si le spread monte à 3 pips pendant les news, vous perdez 30% de votre profit.\n\nRègles d'or : (1) Tradez uniquement les paires majeures à faible spread : EUR/USD (0.5-1 pip), GBP/USD (1-2 pips), USD/JPY (0.5-1 pip). (2) Évitez les paires exotiques (spread de 10-50 pips = impossible à scalper). (3) Ne scalpez JAMAIS pendant les annonces économiques majeures - les spreads explosent à 10-20 pips.\n\nVérifiez votre broker : Un bon broker ECN a des spreads de 0.2-0.5 pips sur EUR/USD. Si votre spread dépasse 2 pips en temps normal, changez de broker immédiatement."
                            }
                        ],
                        examples: "**Configuration complète :** Graphique M5 avec VWAP + EMA 9/21 pour la tendance. Graphique M1 avec VWAP + niveaux S/R du M5 tracés. Session de Londres (8h-12h GMT) sur EUR/USD. Spread à 0.6 pips. Prix au-dessus du VWAP en M5 = biais long. En M1, attendez un pullback vers le VWAP ou un niveau S/R, confirmation (bougie haussière), entrée. Target : 8-12 pips. Stop : 5-7 pips. RR : 1:1.5 minimum. Répétez 10-20 fois par session.",
                        mistakes: [
                            "Scalper en M1 sans vérifier le contexte M5 - vous tradez du bruit aléatoire",
                            "Ignorer le VWAP - c'est comme conduire sans GPS",
                            "Scalper des paires exotiques ou à gros spread - vous perdez avant même d'entrer",
                            "Scalper pendant les news (NFP, FOMC, etc.) - les spreads explosent et vous êtes piégé",
                            "Utiliser un broker avec spreads élevés - vous ne serez JAMAIS rentable en scalping"
                        ],
                        actionSteps: [
                            "Vérifiez le spread actuel de votre broker sur EUR/USD, GBP/USD, USD/JPY (doit être < 2 pips)",
                            "Ajoutez le VWAP à vos graphiques M1 et M5 (indicateur disponible sur MT4/MT5/TradingView)",
                            "Ouvrez EUR/USD en M5, identifiez la tendance actuelle et tracez 2-3 niveaux S/R clés",
                            "Passez en M1 et observez comment le prix réagit au VWAP pendant 30 minutes (sans trader)",
                            "Créez une checklist : 'Avant de scalper : Spread < 2 pips ? M5 tendance claire ? VWAP configuré ? Session active ?'"
                        ]
                    }
                },
                {
                    title: 'La stratégie des Moyennes Mobiles',
                    videoId: 's7IwRqKI2BU',
                    duration: '16:45',
                    summary: "Comment utiliser les croisements de moyennes mobiles pour des entrées explosives.",
                    keyPoints: ["EMA 9 et EMA 21", "Golden Cross", "Filtre de tendance"],
                    writtenContent: {
                        introduction: "Les moyennes mobiles sont l'un des outils les plus simples et les plus puissants du trading. Les EMA 9 et 21 forment une combinaison magique pour le scalping et le day trading. Cette stratégie est utilisée par des milliers de traders professionnels pour capturer les tendances avec précision.",
                        sections: [
                            {
                                title: "EMA 9 et EMA 21 : La combinaison parfaite",
                                content: "L'EMA (Exponential Moving Average) donne plus de poids aux prix récents, ce qui la rend plus réactive que la SMA. L'EMA 9 (rapide) réagit vite aux changements de prix. L'EMA 21 (lente) filtre le bruit et montre la tendance.\n\nConfiguration : Ajoutez EMA 9 (couleur verte ou bleue) et EMA 21 (couleur rouge ou orange) sur vos graphiques M5, M15 et H1. Les deux EMAs créent un 'tunnel' dynamique.\n\nInterprétation : Quand l'EMA 9 est AU-DESSUS de l'EMA 21 = tendance HAUSSIÈRE. Cherchez des opportunités d'achat. Quand l'EMA 9 est EN-DESSOUS de l'EMA 21 = tendance BAISSIÈRE. Cherchez des opportunités de vente.\n\nLe 'tunnel' entre les deux EMAs montre la force de la tendance. Tunnel large = tendance forte. Tunnel étroit ou EMAs entrelacées = consolidation, évitez de trader."
                            },
                            {
                                title: "Golden Cross et Death Cross",
                                content: "Le GOLDEN CROSS se produit quand l'EMA 9 croise l'EMA 21 vers le HAUT. C'est un signal d'achat puissant qui indique le début d'une nouvelle tendance haussière. Les traders institutionnels surveillent ce signal.\n\nLe DEATH CROSS se produit quand l'EMA 9 croise l'EMA 21 vers le BAS. Signal de vente indiquant le début d'une tendance baissière.\n\nComment trader : NE PAS entrer immédiatement au croisement. Attendez le PULLBACK. Après un Golden Cross, attendez que le prix revienne toucher l'EMA 9 ou 21, montre un rejet (bougie haussière), puis achetez. Cela améliore votre point d'entrée et votre RR.\n\nConfirmation : Sur M5, vérifiez que le M15 ou H1 montre aussi un alignement haussier des EMAs. Un Golden Cross en M5 dans une tendance baissière H1 est un piège."
                            },
                            {
                                title: "Filtre de tendance et entrées précises",
                                content: "Utilisez les EMAs comme FILTRE de tendance, pas comme signal d'entrée direct. Votre processus : (1) Vérifiez l'alignement des EMAs sur H1 pour la tendance générale. (2) Descendez en M15 pour identifier les pullbacks. (3) Entrez en M5 quand le prix touche l'EMA et rebondit.\n\nEntrée haussière : Prix au-dessus de EMA 9 et EMA 21 en H1. En M15, le prix pullback vers l'EMA 9 ou 21. En M5, une bougie haussière se forme au contact de l'EMA. ACHAT avec stop sous l'EMA 21.\n\nEntrée baissière : Prix en-dessous de EMA 9 et EMA 21 en H1. En M15, le prix rebondit vers l'EMA 9 ou 21. En M5, une bougie baissière se forme au contact de l'EMA. VENTE avec stop au-dessus de l'EMA 21.\n\nRègle d'or : Ne tradez JAMAIS quand les EMAs sont plates et entrelacées. Attendez une séparation claire et un tunnel qui s'élargit."
                            }
                        ],
                        examples: "**Trade complet :** EUR/USD en H1, Golden Cross confirmé (EMA 9 croise EMA 21 vers le haut à 1.0850). Tunnel s'élargit = tendance forte. Vous passez en M15, le prix monte à 1.0880 puis pullback vers l'EMA 9 à 1.0865. En M5, une pinbar haussière se forme exactement sur l'EMA 9. ENTRÉE : 1.0867. STOP : 1.0858 (sous EMA 21). TARGET : 1.0895 (prochain niveau de résistance). RISQUE : 9 pips. GAIN : 28 pips. RR = 1:3.1. Le prix monte à 1.0902. Trade gagnant.",
                        mistakes: [
                            "Entrer immédiatement au croisement sans attendre le pullback - mauvais point d'entrée",
                            "Trader les croisements quand les EMAs sont plates - c'est du bruit, pas une tendance",
                            "Ignorer le timeframe supérieur - un Golden Cross en M5 ne vaut rien si H1 est baissier",
                            "Utiliser uniquement les EMAs sans confluence (S/R, VWAP, structure) - taux de réussite faible",
                            "Placer le stop trop serré - laissez au moins 5-10 pips sous l'EMA 21 pour respirer"
                        ],
                        actionSteps: [
                            "Ajoutez EMA 9 (vert) et EMA 21 (rouge) sur un graphique H1 de GBP/USD",
                            "Identifiez dans l'historique 3 Golden Cross et 3 Death Cross des 2 derniers mois",
                            "Pour chaque croisement, notez : Le prix a-t-il pullback vers l'EMA ? Qu'est-ce qui s'est passé après ?",
                            "Ouvrez un graphique M15 et trouvez 5 moments où le prix a rebondi sur l'EMA 9 ou 21 dans une tendance claire",
                            "Créez une règle : 'Je trade uniquement les pullbacks sur EMA quand le tunnel est large et la tendance H1 est claire'"
                        ]
                    }
                },
                {
                    title: 'Gestion agressive du risque',
                    videoId: 'nLnjnJpNoxM',
                    duration: '10:30',
                    summary: "En scalping, une perte peut ruiner 10 gains. Apprenez à couper vite.",
                    keyPoints: ["Risk Reward 1:1.5", "Trailing Stop", "Psychologie de l'exécution rapide"],
                    writtenContent: {
                        introduction: "En scalping, vous prenez 10-20 trades par jour. Une seule grosse perte peut effacer tous vos gains. La gestion du risque n'est pas optionnelle, c'est la différence entre un compte qui grandit et un compte qui explose. Cette leçon va vous apprendre à protéger votre capital comme un professionnel.",
                        sections: [
                            {
                                title: "Risk/Reward 1:1.5 minimum",
                                content: "En scalping, contrairement au swing trading, vous ne pouvez pas toujours viser 1:3 ou 1:5. Les mouvements sont trop courts. Mais vous DEVEZ maintenir minimum 1:1.5, idéalement 1:2.\n\nCalcul : Si votre stop est à 6 pips, votre target doit être à minimum 9 pips (1:1.5) ou 12 pips (1:2). Pourquoi ? Parce que même avec un taux de réussite de 50%, un RR de 1:1.5 vous rend rentable.\n\nMaths : 10 trades, 5 gagnants à +9 pips = +45 pips. 5 perdants à -6 pips = -30 pips. NET = +15 pips. Avec 1:1, vous seriez à 0. Avec 1:0.5, vous seriez en perte.\n\nRègle absolue : Si votre setup ne permet pas un RR de 1:1.5, NE PRENEZ PAS LE TRADE. Peu importe combien de confluences vous avez. Un mauvais RR tue votre compte lentement mais sûrement.\n\nAjustement : Si le marché est très volatil, visez 1:2. Si le marché est calme, 1:1.5 suffit. Mais ne descendez JAMAIS en-dessous de 1:1.5."
                            },
                            {
                                title: "Trailing Stop : Sécurisez vos gains",
                                content: "Le Trailing Stop est votre meilleur ami en scalping. C'est un stop loss qui SUIT le prix quand il va dans votre direction, mais ne recule jamais.\n\nComment ça marche : Vous achetez EUR/USD à 1.0850, stop à 1.0844 (-6 pips), target à 1.0862 (+12 pips). Le prix monte à 1.0856 (+6 pips). Vous déplacez votre stop à 1.0850 (votre entrée) = BREAKEVEN. Maintenant vous ne pouvez plus perdre.\n\nLe prix continue à 1.0860 (+10 pips). Vous déplacez le stop à 1.0854 (+4 pips sécurisés). Le prix atteint 1.0862, vous sortez à +12 pips. Mais si le prix était redescendu, vous auriez quand même gagné +4 pips au lieu de 0.\n\nRègle de trailing : Dès que le prix atteint 50% de votre target, déplacez le stop au breakeven. Dès que le prix atteint 75% de votre target, déplacez le stop à 50% de gain. Cela garantit que vous ne transformez jamais un trade gagnant en trade perdant.\n\nAttention : Ne 'trail' pas trop serré. Laissez au moins 3-4 pips de marge, sinon le bruit du marché va vous sortir prématurément."
                            },
                            {
                                title: "Psychologie : Coupez vite, laissez courir",
                                content: "La règle #1 du scalping : COUPEZ VOS PERTES IMMÉDIATEMENT. Pas de 'peut-être que ça va revenir'. Pas de 'juste 2 pips de plus'. Si le prix touche votre stop, SORTEZ. Sans émotion, sans hésitation.\n\nPourquoi c'est dur : Notre cerveau déteste réaliser une perte. On préfère 'espérer' que ça remonte. Mais en scalping, cette mentalité DÉTRUIT les comptes. Une perte de -6 pips qui devient -20 pips efface 3 trades gagnants.\n\nLa discipline : Avant d'entrer, décidez de votre stop. Une fois en position, NE LE DÉPLACEZ JAMAIS vers le bas (pour 'donner plus de marge'). Si vous êtes stoppé, acceptez-le. C'est le coût du business. Sur 20 trades, 8-10 seront des pertes. C'est NORMAL.\n\nExécution rapide : En scalping, vous n'avez pas le temps de réfléchir. Setup validé ? ENTREZ. Stop touché ? SORTEZ. Target atteinte ? SORTEZ. Pas de 'et si', pas de 'peut-être'. L'hésitation tue les comptes.\n\nMentalité gagnante : 'Je suis un sniper, pas un mitrailleur. Je prends uniquement les setups parfaits. Je coupe mes pertes à -6 pips sans émotion. Je laisse mes gains courir jusqu'à +12 pips minimum. Je suis discipliné, patient, et rentable.'"
                            }
                        ],
                        examples: "**Série de 5 trades :** Trade 1 : +10 pips (RR 1:2). Trade 2 : -5 pips (stop respecté). Trade 3 : +8 pips (RR 1:1.5). Trade 4 : -5 pips (stop respecté). Trade 5 : +12 pips (RR 1:2, trailing stop utilisé). TOTAL : +20 pips. Taux de réussite : 60% (3/5). Mais grâce au RR et au trailing, vous êtes en profit. Si vous aviez laissé les pertes courir à -15 pips chacune, vous seriez à -10 pips au lieu de +20. La gestion du risque fait TOUTE la différence.",
                        mistakes: [
                            "Accepter un RR inférieur à 1:1.5 'juste cette fois' - c'est le début de la fin",
                            "Déplacer le stop loss vers le bas pour 'donner plus de marge' - vous transformez -6 pips en -20 pips",
                            "Ne pas utiliser de trailing stop - vous laissez des trades gagnants redevenir perdants",
                            "Hésiter à couper une perte - 'peut-être que ça va remonter' détruit plus de comptes que tout le reste",
                            "Prendre trop de trades pour 'rattraper' une perte - c'est du revenge trading, vous allez perdre encore plus"
                        ],
                        actionSteps: [
                            "Calculez votre taille de position pour risquer maximum 1% de votre capital par trade (ex: compte de $1000 = risque max $10)",
                            "Créez une règle écrite : 'RR minimum 1:1.5. Si le setup ne permet pas 1:1.5, je ne trade pas. AUCUNE exception.'",
                            "Pratiquez le trailing stop sur un compte démo : Dès +50% de target, stop au breakeven. Dès +75%, stop à +50% de gain.",
                            "Tenez un journal de vos 20 prochains trades : Notez le RR de chaque trade et votre profit/perte total",
                            "Avant chaque session, répétez : 'Je coupe mes pertes à -X pips sans hésitation. Je ne déplace JAMAIS mon stop vers le bas.'"
                        ]
                    }
                }
            ]
        },

    ];

    const handleOpenCourse = (course) => {
        setSelectedCourse(course);
        setShowCourseModal(true);
    };

    const handleEnrollCourse = (courseId) => {
        if (!enrolledCourses.includes(courseId)) {
            setEnrolledCourses([...enrolledCourses, courseId]);
            toast.success('Inscription réussie ! Bon apprentissage 🎓');
        }
        // Ouvrir le lecteur de cours
        setCurrentLessonIndex(0);
        setShowCourseModal(false);
        setShowCoursePlayer(true);
    };

    const handleNextLesson = () => {
        if (selectedCourse && currentLessonIndex < selectedCourse.lessonsList.length - 1) {
            setCurrentLessonIndex(currentLessonIndex + 1);
            toast.success('Leçon suivante !');
        } else {
            toast.success('🎉 Félicitations ! Vous avez terminé le cours !');
        }
    };

    const handlePrevLesson = () => {
        if (currentLessonIndex > 0) {
            setCurrentLessonIndex(currentLessonIndex - 1);
        }
    };

    const handleOpenChat = async (friend) => {
        setSelectedFriend(friend);
        setShowMessageModal(true);

        // Fetch message history with this friend
        try {
            const userEmail = localStorage.getItem('userEmail') || 'demo@tradesense.com';
            const response = await fetch(`http://localhost:5000/api/messages/${friend.id === 1 ? 'pro@test.com' : friend.id === 2 ? 'rookie@test.com' : 'hodl@test.com'}?email=${userEmail}`);
            if (response.ok) {
                const messages = await response.json();
                setChatMessages(messages);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            setChatMessages([]);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedFriend) return;

        try {
            const userEmail = localStorage.getItem('userEmail') || 'demo@tradesense.com';
            const recipientEmail = selectedFriend.id === 1 ? 'pro@test.com' : selectedFriend.id === 2 ? 'rookie@test.com' : 'hodl@test.com';

            const response = await fetch('http://localhost:5000/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userEmail,
                    recipient_id: recipientEmail,
                    content: newMessage
                })
            });

            if (response.ok) {
                const result = await response.json();
                setChatMessages([...chatMessages, result.data]);
                setNewMessage('');
                toast.success('Message envoyé !');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Erreur lors de l\'envoi du message');
        }
    };


    const [expertProfiles, setExpertProfiles] = useState([
        { id: 1, name: 'Expert_Karim', avatar: 'EK', specialty: 'Price Action & Forex', followers: 5240, courses: 8, rating: 4.9, verified: true, isFollowing: false },
        { id: 2, name: 'Sarah_FX', avatar: 'SF', specialty: 'Scalping & Crypto', followers: 3890, courses: 5, rating: 4.7, verified: true, isFollowing: false },
        { id: 3, name: 'Mohammed_Pro', avatar: 'MP', specialty: 'Risk Management', followers: 4200, courses: 6, rating: 4.8, verified: true, isFollowing: false },
    ]);

    const handleFollowExpert = (expertId) => {
        setExpertProfiles(expertProfiles.map(expert => {
            if (expert.id === expertId) {
                const newFollowingState = !expert.isFollowing;
                const followerChange = newFollowingState ? 1 : -1;

                if (newFollowingState) {
                    toast.success(`Vous suivez maintenant l'expert ${expert.name} !`);
                } else {
                    toast.success(`Vous ne suivez plus ${expert.name}`);
                }

                return {
                    ...expert,
                    isFollowing: newFollowingState,
                    followers: expert.followers + followerChange
                };
            }
            return expert;
        }));
    };

    const features = [
        { icon: MessageCircle, title: t('community_feature_discuss'), desc: t('community_feature_discuss_desc'), color: 'from-cyan-500 to-blue-500', tab: 'feed' },
        { icon: BookOpen, title: t('community_feature_strategies'), desc: t('community_feature_strategies_desc'), color: 'from-cyan-600 to-teal-600', tab: 'strategies' },
        { icon: GraduationCap, title: t('community_feature_experts'), desc: t('community_feature_experts_desc'), color: 'from-blue-600 to-indigo-600', tab: 'experts' },
        { icon: Target, title: t('community_feature_growth'), desc: t('community_feature_growth_desc'), color: 'from-emerald-500 to-cyan-500', tab: 'friends' },
    ];

    return (
        <div className="flex h-screen bg-transparent text-white font-sans selection:bg-cyan-500/30 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col md:ml-64 overflow-hidden pt-16 md:pt-0">
                <div className="flex-1 flex overflow-hidden">
                    {/* Main Content */}
                    <div className="flex-1 flex flex-col border-r border-white/5 overflow-hidden">
                        {/* Header with Features */}
                        <div className="p-6 border-b border-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                                        {t('community_title')}
                                    </h1>
                                    <p className="text-slate-400 text-sm mt-1">
                                        {t('community_subtitle')}
                                    </p>
                                </div>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold shadow-lg">
                                            U{i}
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-xs font-bold shadow-lg">
                                        +2K
                                    </div>
                                </div>
                            </div>

                            {/* Feature Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {features.map((feature, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveTab(feature.tab)}
                                        className={`glass-glow bg-white/[0.02] rounded-xl p-3 border transition-all cursor-pointer group text-left ${activeTab === feature.tab ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-white/5 hover:border-cyan-500/30'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                                            <feature.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="font-bold text-sm text-white">{feature.title}</h3>
                                        <p className="text-[10px] text-slate-400">{feature.desc}</p>
                                    </button>
                                ))}
                            </div>

                            {/* Tabs */}
                            <div className="flex space-x-2 mt-4 flex-wrap gap-2">
                                {['feed', 'strategies', 'experts', 'friends', 'chat', 'groupchat', 'groups'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab
                                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                                            : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        {tab === 'feed' ? `📢 ${t('community_tab_feed')}` :
                                            tab === 'strategies' ? `📊 ${t('community_tab_strategies')}` :
                                                tab === 'experts' ? `🎓 ${t('community_tab_experts')}` :
                                                    tab === 'friends' ? `👥 ${t('community_tab_friends')}` :
                                                        tab === 'chat' ? `💬 ${t('community_tab_chat')}` :
                                                            tab === 'groupchat' ? `💬 ${t('community_tab_groupchat')}` :
                                                                `👥 ${t('community_tab_groups')}`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-cyan-900">
                            {activeTab === 'feed' && (
                                <>
                                    {/* Create Post */}
                                    <div className="glass-glow rounded-2xl p-5 shadow-xl">
                                        <div className="flex space-x-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-cyan-500/30">WI</div>
                                            <textarea
                                                placeholder={t('community_placeholder_post')}
                                                className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl p-3 text-white placeholder-slate-500 resize-none h-24 focus:outline-none focus:border-cyan-500/50"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                                            <div className="flex space-x-3">
                                                <button className="flex items-center space-x-1 text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                                                    <Share2 className="w-4 h-4" />
                                                    <span>Chart</span>
                                                </button>
                                                <button className="flex items-center space-x-1 text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                                                    <Hash className="w-4 h-4" />
                                                    <span>Tags</span>
                                                </button>
                                                <button className="flex items-center space-x-1 text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                                                    <TrendingUp className="w-4 h-4" />
                                                    <span>Signal</span>
                                                </button>
                                            </div>
                                            <button
                                                onClick={handlePublish}
                                                disabled={!message.trim()}
                                                className={`bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 hover:shadow-lg hover:shadow-cyan-500/30 transition-all transform active:scale-95 ${!message.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <span>{t('community_publish')}</span>
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Posts */}
                                    {posts.map(post => (
                                        <div key={post.id} className="glass-glow rounded-2xl p-6 group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${post.isExpert ? 'bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-cyan-500/30' : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/30'}`}>
                                                        {post.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-bold text-white hover:text-cyan-400 cursor-pointer">{post.user}</span>
                                                            {post.isExpert && <Star className="w-4 h-4 text-cyan-400 fill-yellow-400" />}
                                                            {post.isExpert && <span className="text-[10px] bg-gradient-to-r from-cyan-400/20 to-blue-400/20 text-cyan-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-cyan-400/30">Expert</span>}
                                                        </div>
                                                        <span className="text-slate-500 text-xs">{post.time}</span>
                                                    </div>
                                                </div>
                                                <button className="text-slate-500 hover:text-cyan-400 transition-colors">
                                                    <UserPlus className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <p className="text-slate-200 mb-6 leading-relaxed text-[15px]">{post.content}</p>
                                            <div className="flex items-center space-x-6 pt-4 border-t border-white/5">
                                                <button
                                                    onClick={() => handleLike(post.id)}
                                                    className={`flex items-center space-x-2 transition-colors ${post.liked ? 'text-pink-500' : 'text-slate-400 hover:text-pink-400'}`}
                                                >
                                                    <Heart className={`w-5 h-5 ${post.liked ? 'fill-pink-500' : ''}`} />
                                                    <span className="text-sm font-bold">{post.likes}</span>
                                                </button>
                                                <button className="flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-colors">
                                                    <MessageSquare className="w-5 h-5" />
                                                    <span className="text-sm font-bold">{post.comments}</span>
                                                </button>
                                                <button className="flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-colors">
                                                    <Share2 className="w-5 h-5" />
                                                    <span className="text-sm font-bold">{t('common_share')}</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                            {activeTab === 'strategies' && (
                                <div className="space-y-6">
                                    {/* Add Strategy Button */}
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold flex items-center space-x-2">
                                            <Sparkles className="w-5 h-5 text-cyan-400" />
                                            <span>Stratégies Partagées</span>
                                        </h2>
                                        <button
                                            onClick={() => setShowStrategyModal(true)}
                                            className="bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 rounded-xl font-bold text-sm flex items-center space-x-2 hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                                        >
                                            <BookOpen className="w-4 h-4" />
                                            <span>Partager une stratégie</span>
                                        </button>
                                    </div>

                                    {/* Strategies List */}
                                    {strategies.map((strategy) => (
                                        <div key={strategy.id} className="glass-glow rounded-2xl p-5 cursor-pointer group">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">{strategy.title}</h3>
                                                        {strategy.isNew && (
                                                            <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-bold animate-pulse">NOUVEAU</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-400">Par {strategy.author}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center space-x-1 text-cyan-400">
                                                        <Star className="w-4 h-4 fill-yellow-400" />
                                                        <span className="font-bold">{strategy.rating || 'N/A'}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500">{strategy.views} vues</p>
                                                </div>
                                            </div>
                                            <p className="text-slate-300 text-sm mb-4">{strategy.description}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex space-x-2">
                                                    <span className="text-xs bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full">{strategy.market}</span>
                                                    <span className="text-xs bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full">{strategy.timeframe}</span>
                                                    {strategy.riskLevel && (
                                                        <span className={`text-xs px-3 py-1 rounded-full ${strategy.riskLevel === 'Faible' ? 'bg-emerald-500/20 text-emerald-300' :
                                                            strategy.riskLevel === 'Moyen' ? 'bg-cyan-500/20 text-cyan-300' :
                                                                'bg-amber-500/20 text-amber-300'
                                                            }`}>{strategy.riskLevel}</span>
                                                    )}
                                                </div>
                                                <button className="text-cyan-400 hover:text-cyan-300 text-sm font-bold flex items-center space-x-1">
                                                    <span>Voir détails</span>
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'experts' && (
                                <div className="space-y-6">
                                    {/* Live Sessions */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-bold flex items-center space-x-2">
                                                <Video className="w-5 h-5 text-cyan-400" />
                                                <span>Sessions Live</span>
                                            </h2>
                                            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full font-bold animate-pulse">EN DIRECT</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {upcomingEvents.map((event, index) => (
                                                <div key={index} className="glass-glow rounded-xl p-4 cursor-pointer group">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${event.type === 'live' ? 'bg-cyan-500/20' :
                                                            event.type === 'analysis' ? 'bg-blue-500/20' : 'bg-emerald-500/20'
                                                            }`}>
                                                            <Video className={`w-6 h-6 ${event.type === 'live' ? 'text-cyan-400' :
                                                                event.type === 'analysis' ? 'text-blue-400' : 'text-emerald-400'
                                                                }`} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{event.title}</h3>
                                                            <p className="text-xs text-slate-400">{event.expert} • {event.time}</p>
                                                        </div>
                                                        {event.type === 'live' && (
                                                            <span className="text-[10px] bg-cyan-500 text-white px-2 py-1 rounded-full font-bold animate-pulse">LIVE</span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => event.type === 'live' ? handleJoinSession(event) : handleRemindSession(event)}
                                                        className="w-full py-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/20 rounded-lg text-sm font-bold text-cyan-300 hover:text-white hover:border-cyan-500/40 transition-all"
                                                    >
                                                        {event.type === 'live' ? 'Rejoindre maintenant' : 'Rappeler'}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Expert Courses */}
                                    <div>
                                        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                                            <GraduationCap className="w-5 h-5 text-cyan-400" />
                                            <span>Cours des Experts</span>
                                        </h2>
                                        <div className="space-y-4">
                                            {expertCourses.map(course => (
                                                <div key={course.id} className="glass-glow rounded-2xl p-5 cursor-pointer group">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-cyan-500/30">
                                                                {course.avatar}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">{course.title}</h3>
                                                                <p className="text-sm text-slate-400">Par {course.expert}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="flex items-center space-x-1 text-cyan-400">
                                                                <Star className="w-4 h-4 fill-yellow-400" />
                                                                <span className="font-bold">{course.rating}</span>
                                                            </div>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${course.price === 'Gratuit' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                                                }`}>{course.price}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                                                        <span className="flex items-center space-x-1">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{course.duration}</span>
                                                        </span>
                                                        {course.lessons > 0 && (
                                                            <span className="flex items-center space-x-1">
                                                                <BookOpen className="w-4 h-4" />
                                                                <span>{course.lessons} leçons</span>
                                                            </span>
                                                        )}
                                                        <span className="flex items-center space-x-1">
                                                            <Users className="w-4 h-4" />
                                                            <span>{course.students} étudiants</span>
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-xs px-3 py-1 rounded-full ${course.level === 'Débutant' ? 'bg-emerald-500/20 text-emerald-300' :
                                                            course.level === 'Intermédiaire' ? 'bg-cyan-500/20 text-cyan-300' :
                                                                course.level === 'Avancé' ? 'bg-blue-500/20 text-blue-300' :
                                                                    'bg-cyan-500/20 text-cyan-300'
                                                            }`}>{course.level}</span>
                                                        <button
                                                            onClick={() => handleOpenCourse(course)}
                                                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all ${enrolledCourses.includes(course.id)
                                                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                                                : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30'
                                                                }`}
                                                        >
                                                            <span>{enrolledCourses.includes(course.id) ? 'Continuer' : 'Commencer'}</span>
                                                            <ChevronRight className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Expert Profiles */}
                                    <div>
                                        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                                            <Trophy className="w-5 h-5 text-cyan-400" />
                                            <span>{t('community_tab_experts')}</span>
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {expertProfiles.map(expert => (
                                                <div key={expert.id} className="glass-glow rounded-2xl p-5 cursor-pointer text-center group">
                                                    <div className="relative w-20 h-20 mx-auto mb-3">
                                                        <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-2xl shadow-lg shadow-cyan-500/30">
                                                            {expert.avatar}
                                                        </div>
                                                        {expert.verified && (
                                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center border-2 border-background">
                                                                <Check className="w-3 h-3 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{expert.name}</h3>
                                                    <p className="text-xs text-cyan-400 mb-3">{expert.specialty}</p>
                                                    <div className="flex justify-center space-x-4 text-xs text-slate-400 mb-4">
                                                        <span>{expert.followers} followers</span>
                                                        <span>{expert.courses} cours</span>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleFollowExpert(expert.id);
                                                        }}
                                                        className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${expert.isFollowing
                                                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                            : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30'
                                                            }`}
                                                    >
                                                        {expert.isFollowing ? t('community_followed') : t('community_follow')}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'friends' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                                            <Users className="w-5 h-5 text-cyan-400" />
                                            <span>{t('community_friends_title')}</span>
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {friends.map(friend => (
                                                <div key={friend.id} className="glass-glow rounded-xl p-4 flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="relative">
                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold">
                                                                {friend.avatar}
                                                            </div>
                                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${friend.status === 'online' ? 'bg-emerald-500' :
                                                                friend.status === 'away' ? 'bg-amber-500' : 'bg-slate-500'
                                                                }`}></div>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-white">{friend.name}</p>
                                                            <p className="text-xs text-cyan-400">{friend.level}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleOpenChat(friend)}
                                                        className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 p-2 rounded-lg transition-colors"
                                                    >
                                                        <MessageCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                                            <Zap className="w-5 h-5 text-cyan-400" />
                                            <span>{t('community_suggested_traders')}</span>
                                        </h2>
                                        <div className="space-y-3">
                                            {suggestedTraders.map(trader => (
                                                <div key={trader.id} className="glass-glow rounded-xl p-4 flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                                                            {trader.avatar}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-white">{trader.name}</p>
                                                            <div className="flex items-center space-x-3 text-xs text-slate-400">
                                                                <span>{trader.followers} followers</span>
                                                                <span className="text-cyan-400">Win: {trader.winRate}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleFollowTrader(trader.id)}
                                                        className={`px-4 py-2 rounded-lg text-sm font-bold hover:shadow-lg transition-all flex items-center space-x-1 ${trader.isFollowing
                                                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                            : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-cyan-500/30'
                                                            }`}
                                                    >
                                                        <UserPlus className="w-4 h-4" />
                                                        <span>{trader.isFollowing ? t('community_followed') : t('community_follow')}</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Chat Traders Tab */}
                            {activeTab === 'chat' && (
                                <div className="space-y-6">
                                    <div className="glass-glow rounded-2xl p-6">
                                        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                                            <MessageCircle className="w-5 h-5 text-cyan-400" />
                                            <span>💬 {t('community_chat_title')}</span>
                                        </h2>
                                        <p className="text-slate-400 text-sm mb-6">{t('community_chat_subtitle')}</p>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Left: Trader List */}
                                            <div>
                                                {/* Online Traders */}
                                                <div className="mb-6">
                                                    <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">{t('community_online_traders')}</h3>
                                                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                                        {[
                                                            { id: 1, name: 'Alex_Trader', status: 'En ligne', winRate: '78%' },
                                                            { id: 2, name: 'Sarah_FX', status: 'En ligne', winRate: '82%' },
                                                            { id: 3, name: 'CryptoKing', status: 'En ligne', winRate: '75%' },
                                                            { id: 4, name: 'Forex_Master', status: 'Absent', winRate: '71%' },
                                                            { id: 5, name: 'TradePro99', status: 'En ligne', winRate: '69%' },
                                                        ].map((trader) => (
                                                            <div
                                                                key={trader.id}
                                                                onClick={() => {
                                                                    setSelectedTrader(trader);
                                                                    setTraderChatMessages([
                                                                        { id: 1, sender: 'them', text: `Salut ! Je suis ${trader.name}, comment puis-je t'aider ?`, time: '10:30' },
                                                                        { id: 2, sender: 'me', text: 'Salut ! J\'aimerais discuter de ta stratégie EUR/USD', time: '10:31' },
                                                                        { id: 3, sender: 'them', text: 'Bien sûr ! J\'utilise principalement les supports/résistances avec confirmation RSI', time: '10:32' },
                                                                    ]);
                                                                }}
                                                                className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${selectedTrader?.id === trader.id ? 'bg-cyan-500/20 border border-cyan-500/50' : 'bg-white/5 hover:bg-cyan-500/10'}`}
                                                            >
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="relative">
                                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm">
                                                                            {trader.name.charAt(0)}
                                                                        </div>
                                                                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${trader.status === 'En ligne' ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-white text-sm">{trader.name}</p>
                                                                        <p className="text-xs text-slate-400">Win: {trader.winRate}</p>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedTrader(trader);
                                                                        setTraderChatMessages([
                                                                            { id: 1, sender: 'them', text: `Salut ! Bienvenue, je suis ${trader.name}`, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
                                                                        ]);
                                                                    }}
                                                                    className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-xs font-bold hover:shadow-lg transition-all"
                                                                >
                                                                    {t('community_discuss')}
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Chat Window */}
                                            <div className="bg-white/5 rounded-xl border border-white/10 flex flex-col h-[400px]">
                                                {selectedTrader ? (
                                                    <>
                                                        {/* Chat Header */}
                                                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                                                                    {selectedTrader.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-white">{selectedTrader.name}</p>
                                                                    <p className="text-xs text-green-400">{selectedTrader.status}</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => setSelectedTrader(null)}
                                                                className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                                            >
                                                                <X className="w-4 h-4 text-slate-400" />
                                                            </button>
                                                        </div>

                                                        {/* Messages */}
                                                        <div className="flex-1 p-4 overflow-y-auto space-y-3">
                                                            {traderChatMessages.map((msg) => (
                                                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                                                    <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${msg.sender === 'me' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white' : 'bg-white/10 text-white'}`}>
                                                                        <p className="text-sm">{msg.text}</p>
                                                                        <p className="text-[10px] opacity-60 mt-1">{msg.time}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Input */}
                                                        <div className="p-4 border-t border-white/10">
                                                            <div className="flex space-x-2">
                                                                <input
                                                                    type="text"
                                                                    value={traderChatInput}
                                                                    onChange={(e) => setTraderChatInput(e.target.value)}
                                                                    onKeyPress={(e) => {
                                                                        if (e.key === 'Enter' && traderChatInput.trim()) {
                                                                            setTraderChatMessages([...traderChatMessages, {
                                                                                id: Date.now(),
                                                                                sender: 'me',
                                                                                text: traderChatInput,
                                                                                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                                                                            }]);
                                                                            setTraderChatInput('');
                                                                            // Simulate response after 1 second
                                                                            setTimeout(() => {
                                                                                setTraderChatMessages(prev => [...prev, {
                                                                                    id: Date.now(),
                                                                                    sender: 'them',
                                                                                    text: "Super question ! Je vais réfléchir à ça et te répondre 👍",
                                                                                    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                                                                                }]);
                                                                            }, 1000);
                                                                        }
                                                                    }}
                                                                    placeholder={t('community_type_message')}
                                                                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-500"
                                                                />
                                                                <button
                                                                    onClick={() => {
                                                                        if (traderChatInput.trim()) {
                                                                            setTraderChatMessages([...traderChatMessages, {
                                                                                id: Date.now(),
                                                                                sender: 'me',
                                                                                text: traderChatInput,
                                                                                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                                                                            }]);
                                                                            setTraderChatInput('');
                                                                            setTimeout(() => {
                                                                                setTraderChatMessages(prev => [...prev, {
                                                                                    id: Date.now(),
                                                                                    sender: 'them',
                                                                                    text: "Merci pour ton message ! On en reparle bientôt 🚀",
                                                                                    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                                                                                }]);
                                                                            }, 1000);
                                                                        }
                                                                    }}
                                                                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl hover:shadow-lg transition-all"
                                                                >
                                                                    <Send className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex-1 flex items-center justify-center flex-col text-center p-6">
                                                        <MessageCircle className="w-16 h-16 text-slate-600 mb-4" />
                                                        <p className="text-slate-400 font-bold">{t('community_select_trader')}</p>
                                                        <p className="text-slate-500 text-sm">{t('community_start_conversation')}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Group Chat Tab */}
                            {activeTab === 'groupchat' && (
                                <div className="space-y-6">
                                    <div className="glass-glow rounded-2xl p-6">
                                        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                                            <MessageCircle className="w-5 h-5 text-cyan-400" />
                                            <span>💬 {t('community_groupchat_title')}</span>
                                        </h2>
                                        <p className="text-slate-400 text-sm mb-6">{t('community_groupchat_subtitle')}</p>

                                        {joinedGroups.length === 0 ? (
                                            <div className="text-center py-12">
                                                <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                                <p className="text-slate-400 font-bold mb-2">{t('community_no_group')}</p>
                                                <p className="text-slate-500 text-sm mb-4">{t('community_join_group_prompt')}</p>
                                                <button
                                                    onClick={() => setActiveTab('groups')}
                                                    className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                                                >
                                                    {t('community_view_groups')}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Left: My Groups */}
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">{t('community_my_groups')} ({joinedGroups.length})</h3>
                                                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                                        {joinedGroups.map((group) => (
                                                            <div
                                                                key={group.id}
                                                                onClick={() => openGroupChat(group)}
                                                                className={`bg-white/5 rounded-xl p-4 border transition-all cursor-pointer ${selectedGroupChat?.id === group.id
                                                                    ? 'border-cyan-500/50 bg-cyan-500/20'
                                                                    : 'border-white/10 hover:border-cyan-500/30'
                                                                    }`}
                                                            >
                                                                <div className="flex items-start space-x-3">
                                                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center text-2xl`}>
                                                                        {group.icon}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h3 className="font-bold text-white">{group.name}</h3>
                                                                        <p className="text-xs text-slate-400 mb-2">{group.desc}</p>
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-xs text-cyan-400">{group.members} {t('community_members_suffix')}</span>
                                                                            {group.unread > 0 && (
                                                                                <span className="px-2 py-0.5 bg-cyan-500 text-white rounded-full text-xs font-bold">
                                                                                    {group.unread}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Right: Group Chat */}
                                                <div className="bg-white/5 rounded-xl border border-white/10 flex flex-col h-[500px]">
                                                    {selectedGroupChat ? (
                                                        <>
                                                            {/* Chat Header */}
                                                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedGroupChat.color} flex items-center justify-center text-lg`}>
                                                                        {selectedGroupChat.icon}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-white">{selectedGroupChat.name}</p>
                                                                        <p className="text-xs text-slate-400">{selectedGroupChat.members} {t('community_members_active_suffix')}</p>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => setSelectedGroupChat(null)}
                                                                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                                                >
                                                                    <X className="w-4 h-4 text-slate-400" />
                                                                </button>
                                                            </div>

                                                            {/* Messages */}
                                                            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                                                                {groupChatMessages.map((msg) => (
                                                                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                                                        <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${msg.sender === 'me' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white' : msg.sender === 'system' ? 'bg-yellow-500/20 text-yellow-300 text-center w-full' : 'bg-white/10 text-white'}`}>
                                                                            {msg.sender !== 'me' && msg.sender !== 'system' && (
                                                                                <p className="text-[10px] text-cyan-400 font-bold mb-1">{msg.user}</p>
                                                                            )}
                                                                            <p className="text-sm">{msg.text}</p>
                                                                            <p className="text-[10px] opacity-60 mt-1">{msg.time}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            {/* Input */}
                                                            <div className="p-4 border-t border-white/10">
                                                                <div className="flex space-x-2">
                                                                    <input
                                                                        type="text"
                                                                        value={groupChatInput}
                                                                        onChange={(e) => setGroupChatInput(e.target.value)}
                                                                        onKeyPress={(e) => {
                                                                            if (e.key === 'Enter' && groupChatInput.trim()) {
                                                                                setGroupChatMessages([...groupChatMessages, {
                                                                                    id: Date.now(),
                                                                                    sender: 'me',
                                                                                    user: 'Vous',
                                                                                    text: groupChatInput,
                                                                                    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                                                                                }]);
                                                                                setGroupChatInput('');
                                                                                setTimeout(() => {
                                                                                    setGroupChatMessages(prev => [...prev, {
                                                                                        id: Date.now(),
                                                                                        sender: 'other',
                                                                                        user: 'TraderPro',
                                                                                        text: "Bonne remarque ! Je suis d'accord avec toi 👍",
                                                                                        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                                                                                    }]);
                                                                                }, 1500);
                                                                            }
                                                                        }}

                                                                        placeholder={t('community_msg_group_placeholder')}
                                                                        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-500"
                                                                    />
                                                                    <button
                                                                        onClick={() => {
                                                                            if (groupChatInput.trim()) {
                                                                                setGroupChatMessages([...groupChatMessages, {
                                                                                    id: Date.now(),
                                                                                    sender: 'me',
                                                                                    user: 'Vous',
                                                                                    text: groupChatInput,
                                                                                    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                                                                                }]);
                                                                                setGroupChatInput('');
                                                                            }
                                                                        }}
                                                                        className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl hover:shadow-lg transition-all"
                                                                    >
                                                                        <Send className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex-1 flex items-center justify-center flex-col text-center p-6">
                                                            <Users className="w-16 h-16 text-slate-600 mb-4" />
                                                            <p className="text-slate-400 font-bold">{t('community_select_group')}</p>
                                                            <p className="text-slate-500 text-sm">{t('community_select_group_desc')}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Groups Tab */}
                            {activeTab === 'groups' && (
                                <div className="space-y-6">
                                    <div className="glass-glow rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-bold flex items-center space-x-2">
                                                <Users className="w-5 h-5 text-cyan-400" />
                                                <span>👥 {t('community_trading_groups')}</span>
                                            </h2>
                                            <button
                                                onClick={() => setShowCreateGroupModal(true)}
                                                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                                            >
                                                {t('community_create_group')}
                                            </button>
                                        </div>
                                        <p className="text-slate-400 text-sm mb-6">{t('community_groups_subtitle')}</p>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Left: Available Groups */}
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">{t('community_available_groups')}</h3>
                                                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                                    {availableGroups.map((group) => {
                                                        const isJoined = joinedGroups.find(g => g.id === group.id);
                                                        return (
                                                            <div key={group.id} className={`bg-white/5 rounded-xl p-4 border transition-all ${isJoined ? 'border-green-500/50 bg-green-500/10' : 'border-white/10 hover:border-cyan-500/30'}`}>
                                                                <div className="flex items-start space-x-3">
                                                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center text-2xl`}>
                                                                        {group.icon}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h3 className="font-bold text-white">{group.name}</h3>
                                                                        <p className="text-xs text-slate-400 mb-2">{group.desc}</p>
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-xs text-cyan-400">{group.members.toLocaleString()} {t('community_members_suffix')}</span>
                                                                            {isJoined ? (
                                                                                <div className="flex space-x-2">
                                                                                    <button
                                                                                        onClick={() => openGroupChat(group)}
                                                                                        className="px-3 py-1 bg-cyan-500/30 text-cyan-400 rounded-lg text-xs font-bold hover:bg-cyan-500/50 transition-all"
                                                                                    >
                                                                                        💬 {t('community_chat_short')}
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => handleLeaveGroup(group.id)}
                                                                                        className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/30 transition-all"
                                                                                    >
                                                                                        {t('community_leave')}
                                                                                    </button>
                                                                                </div>
                                                                            ) : (
                                                                                <button
                                                                                    onClick={() => handleJoinNewGroup(group)}
                                                                                    className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-bold hover:bg-cyan-500/30 transition-all"
                                                                                >
                                                                                    {t('community_join')}
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Right: Group Chat */}
                                            <div className="bg-white/5 rounded-xl border border-white/10 flex flex-col h-[400px]">
                                                {selectedGroupChat ? (
                                                    <>
                                                        {/* Chat Header */}
                                                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                                            <div className="flex items-center space-x-3">
                                                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedGroupChat.color} flex items-center justify-center text-lg`}>
                                                                    {selectedGroupChat.icon}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-white">{selectedGroupChat.name}</p>
                                                                    <p className="text-xs text-slate-400">{selectedGroupChat.members} {t('community_members_active_suffix')}</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => setSelectedGroupChat(null)}
                                                                className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                                            >
                                                                <X className="w-4 h-4 text-slate-400" />
                                                            </button>
                                                        </div>

                                                        {/* Messages */}
                                                        <div className="flex-1 p-4 overflow-y-auto space-y-3">
                                                            {groupChatMessages.map((msg) => (
                                                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                                                    <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${msg.sender === 'me' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white' : msg.sender === 'system' ? 'bg-yellow-500/20 text-yellow-300 text-center w-full' : 'bg-white/10 text-white'}`}>
                                                                        {msg.sender !== 'me' && msg.sender !== 'system' && (
                                                                            <p className="text-[10px] text-cyan-400 font-bold mb-1">{msg.user}</p>
                                                                        )}
                                                                        <p className="text-sm">{msg.text}</p>
                                                                        <p className="text-[10px] opacity-60 mt-1">{msg.time}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Input */}
                                                        <div className="p-4 border-t border-white/10">
                                                            <div className="flex space-x-2">
                                                                <input
                                                                    type="text"
                                                                    value={groupChatInput}
                                                                    onChange={(e) => setGroupChatInput(e.target.value)}
                                                                    onKeyPress={(e) => {
                                                                        if (e.key === 'Enter' && groupChatInput.trim()) {
                                                                            setGroupChatMessages([...groupChatMessages, {
                                                                                id: Date.now(),
                                                                                sender: 'me',
                                                                                user: 'Vous',
                                                                                text: groupChatInput,
                                                                                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                                                                            }]);
                                                                            setGroupChatInput('');
                                                                            setTimeout(() => {
                                                                                setGroupChatMessages(prev => [...prev, {
                                                                                    id: Date.now(),
                                                                                    sender: 'other',
                                                                                    user: 'TraderPro',
                                                                                    text: "Bonne remarque ! Je suis d'accord avec toi 👍",
                                                                                    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                                                                                }]);
                                                                            }, 1500);
                                                                        }
                                                                    }}

                                                                    placeholder={t('community_msg_group_placeholder')}
                                                                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-500"
                                                                />
                                                                <button
                                                                    onClick={() => {
                                                                        if (groupChatInput.trim()) {
                                                                            setGroupChatMessages([...groupChatMessages, {
                                                                                id: Date.now(),
                                                                                sender: 'me',
                                                                                user: 'Vous',
                                                                                text: groupChatInput,
                                                                                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                                                                            }]);
                                                                            setGroupChatInput('');
                                                                        }
                                                                    }}
                                                                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl hover:shadow-lg transition-all"
                                                                >
                                                                    <Send className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex-1 flex items-center justify-center flex-col text-center p-6">
                                                        <Users className="w-16 h-16 text-slate-600 mb-4" />
                                                        <p className="text-slate-400 font-bold">Sélectionnez un groupe</p>
                                                        <p className="text-slate-500 text-sm">Rejoignez un groupe puis cliquez sur "Chat" pour discuter</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* My Groups summary */}
                                        {joinedGroups.length > 0 && (
                                            <div className="mt-6 p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                                                <p className="text-sm text-cyan-400 font-bold">✅ Vous êtes membre de {joinedGroups.length} groupe(s): {joinedGroups.map(g => g.name).join(', ')}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden lg:flex flex-col w-80 p-6 space-y-6 overflow-y-auto scrollbar-none">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Rechercher des traders..."
                                className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50"
                            />
                        </div>

                        {/* Upcoming Events */}
                        <div className="glass-glow rounded-2xl p-4">
                            <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-widest mb-4 flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                Sessions à Venir
                            </h3>
                            <div className="space-y-3">
                                {upcomingEvents.map((event, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleJoinSession(event)}
                                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all"
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${event.type === 'live' ? 'bg-cyan-500/20' :
                                            event.type === 'analysis' ? 'bg-blue-500/20' : 'bg-emerald-500/20'
                                            }`}>
                                            <Video className={`w-5 h-5 ${event.type === 'live' ? 'text-cyan-400' :
                                                event.type === 'analysis' ? 'text-blue-400' : 'text-emerald-400'
                                                }`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-white">{event.title}</p>
                                            <p className="text-[10px] text-slate-500">{event.expert} • {event.time}</p>
                                        </div>
                                        {event.type === 'live' && (
                                            <span className="text-[9px] bg-cyan-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">LIVE</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Groups */}
                        <div className="glass-glow rounded-2xl p-4">
                            <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-widest mb-4 flex items-center">
                                <Globe className="w-4 h-4 mr-2" />
                                Groupes Thématiques
                            </h3>
                            <div className="space-y-3">
                                {groups.map(group => (
                                    <div
                                        key={group.id}
                                        onClick={() => handleOpenGroupModal(group)}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${group.color} flex items-center justify-center text-white font-bold text-xs shadow-lg`}>
                                                {group.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">{group.name}</p>
                                                    {myGroups.includes(group.id) && (
                                                        <span className="text-[8px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded-full font-bold">MEMBRE</span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-slate-500">{group.members} membres</p>
                                            </div>
                                        </div>
                                        {group.active && <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowBrowseGroupsModal(true)}
                                className="w-full mt-4 py-2.5 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/20 rounded-xl text-xs font-bold text-cyan-300 hover:text-white hover:border-cyan-500/40 transition-all flex items-center justify-center space-x-2"
                            >
                                <span>Rejoindre un groupe</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Expert Learning */}
                        <div className="bg-gradient-to-br from-cyan-600/30 to-blue-600/30 rounded-2xl p-5 border border-cyan-500/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-30 transition-opacity">
                                <GraduationCap className="w-20 h-20" />
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                                <Trophy className="w-5 h-5 text-cyan-400" />
                                <h3 className="text-sm font-bold text-white">MasterClass Expert</h3>
                            </div>
                            <p className="text-xs text-cyan-200/80 mb-4 relative z-10">
                                Apprenez des meilleurs traders avec nos sessions live hebdomadaires et atteignez vos objectifs.
                            </p>
                            <button
                                onClick={() => setActiveTab('experts')}
                                className="bg-white text-[#0a0f1a] w-full py-2.5 rounded-xl font-bold text-sm hover:bg-cyan-100 transition-colors relative z-10 flex items-center justify-center space-x-2"
                            >
                                <GraduationCap className="w-4 h-4" />
                                <span>Accéder maintenant</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div >

            {/* Group Modal */}
            {
                showGroupModal && selectedGroup && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="glass-glow bg-[#0a0f1a] border border-white/10 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl shadow-cyan-500/20">
                            {/* Header */}
                            <div className={`bg-gradient-to-r ${selectedGroup.color} p-6 relative`}>
                                <button
                                    onClick={() => setShowGroupModal(false)}
                                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4">
                                    {selectedGroup.name.charAt(0)}
                                </div>
                                <h2 className="text-2xl font-bold text-white">{selectedGroup.name}</h2>
                                <p className="text-white/80 text-sm mt-1">{selectedGroup.members} membres</p>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-slate-300 mb-6">{selectedGroup.description}</p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center space-x-3 text-sm">
                                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                            <MessageCircle className="w-4 h-4 text-cyan-400" />
                                        </div>
                                        <span className="text-slate-400">Discussions en temps réel</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-sm">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <span className="text-slate-400">Signaux partagés</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-sm">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                            <Star className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span className="text-slate-400">Analyses d'experts</span>
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowGroupModal(false)}
                                        className="flex-1 py-3 border border-slate-700 rounded-xl font-bold text-slate-400 hover:text-white hover:border-slate-600 transition-all"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={() => handleJoinGroup(selectedGroup.id)}
                                        className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${myGroups.includes(selectedGroup.id)
                                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                                            : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30'
                                            }`}
                                    >
                                        {myGroups.includes(selectedGroup.id) ? (
                                            <>
                                                <X className="w-4 h-4" />
                                                <span>Quitter</span>
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="w-4 h-4" />
                                                <span>Rejoindre</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }


            {/* Strategy Modal */}
            {
                showStrategyModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="glass-glow bg-[#0a0f1a] border border-white/10 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl shadow-cyan-500/20">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 relative">
                                <button
                                    onClick={() => setShowStrategyModal(false)}
                                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Partager une Stratégie</h2>
                                        <p className="text-white/70 text-sm">Aidez la communauté à progresser</p>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-2">Nom de la stratégie *</label>
                                    <input
                                        type="text"
                                        value={newStrategy.title}
                                        onChange={(e) => setNewStrategy({ ...newStrategy, title: e.target.value })}
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50"
                                        placeholder="Ex: Breakout sur support"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-400 text-sm mb-2">Description *</label>
                                    <textarea
                                        value={newStrategy.description}
                                        onChange={(e) => setNewStrategy({ ...newStrategy, description: e.target.value })}
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 resize-none h-24"
                                        placeholder="Décrivez votre stratégie..."
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-2">Marché</label>
                                        <select
                                            value={newStrategy.market}
                                            onChange={(e) => setNewStrategy({ ...newStrategy, market: e.target.value })}
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50"
                                        >
                                            <option value="Forex">Forex</option>
                                            <option value="Crypto">Crypto</option>
                                            <option value="Indices">Indices</option>
                                            <option value="Actions">Actions</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 text-sm mb-2">Timeframe</label>
                                        <select
                                            value={newStrategy.timeframe}
                                            onChange={(e) => setNewStrategy({ ...newStrategy, timeframe: e.target.value })}
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50"
                                        >
                                            <option value="M5">M5</option>
                                            <option value="M15">M15</option>
                                            <option value="H1">H1</option>
                                            <option value="H4">H4</option>
                                            <option value="D1">D1</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 text-sm mb-2">Risque</label>
                                        <select
                                            value={newStrategy.riskLevel}
                                            onChange={(e) => setNewStrategy({ ...newStrategy, riskLevel: e.target.value })}
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50"
                                        >
                                            <option value="Faible">Faible</option>
                                            <option value="Moyen">Moyen</option>
                                            <option value="Élevé">Élevé</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        onClick={() => setShowStrategyModal(false)}
                                        className="flex-1 py-3 border border-slate-700 rounded-xl font-bold text-slate-400 hover:text-white hover:border-slate-600 transition-all"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleShareStrategy}
                                        className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-white flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                                    >
                                        <Send className="w-4 h-4" />
                                        <span>Partager</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Live Session Modal */}
            {
                showLiveModal && selectedSession && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowLiveModal(false)}>
                        <div className="glass-glow bg-[#0a0f1a] border border-white/10 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl shadow-cyan-500/20" onClick={(e) => e.stopPropagation()}>
                            {/* Video Area */}
                            <div className="relative bg-black aspect-video flex items-center justify-center">
                                {selectedSession.videoId ? (
                                    <iframe
                                        className="w-full h-full"
                                        src={`https://www.youtube.com/embed/${selectedSession.videoId}?autoplay=1&rel=0&modestbranding=1`}
                                        title={selectedSession.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <>
                                        <div className="absolute top-4 left-4 flex items-center space-x-2">
                                            <span className="bg-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse flex items-center space-x-1">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                <span>LIVE</span>
                                            </span>
                                            <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                                                {selectedSession.viewers} spectateurs
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold">
                                                {selectedSession.avatar}
                                            </div>
                                            <Video className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                                            <p className="text-white text-lg font-bold">Session en cours...</p>
                                            <p className="text-slate-400 text-sm">Présenté par {selectedSession.expert}</p>
                                        </div>
                                    </>
                                )}
                                <button
                                    onClick={() => setShowLiveModal(false)}
                                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-black/50 p-2 rounded-full z-10"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Session Info */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{selectedSession.title}</h2>
                                        <p className="text-slate-400 text-sm mt-1">{selectedSession.description}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-xs px-3 py-1 rounded-full font-bold ${selectedSession.type === 'live' ? 'bg-cyan-500/20 text-cyan-400' :
                                            selectedSession.type === 'analysis' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-emerald-500/20 text-emerald-400'
                                            }`}>
                                            {selectedSession.type === 'live' ? 'Trading Live' :
                                                selectedSession.type === 'analysis' ? 'Analyse' : 'Q&A'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold">
                                            {selectedSession.avatar}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{selectedSession.expert}</p>
                                            <p className="text-xs text-cyan-400">{t('community_verified_expert')}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1"></div>
                                    <span className="text-slate-400 text-sm flex items-center space-x-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{selectedSession.time}</span>
                                    </span>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => {
                                            toast.success(t('community_session_joined'));
                                        }}
                                        className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-bold text-white flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                                    >
                                        <Video className="w-5 h-5" />
                                        <span>{t('community_join_live')}</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            toast.success(t('community_question_sent'));
                                        }}
                                        className="px-6 py-3 bg-cyan-500/20 border border-cyan-500/30 rounded-xl font-bold text-cyan-300 hover:text-white hover:border-cyan-500/50 transition-all flex items-center space-x-2"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        <span>{t('community_ask_question')}</span>
                                    </button>
                                    <button
                                        onClick={() => setShowLiveModal(false)}
                                        className="px-6 py-3 border border-slate-700 rounded-xl font-bold text-slate-400 hover:text-white hover:border-slate-600 transition-all"
                                    >
                                        {t('common_close')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Course Modal */}
            {
                showCourseModal && selectedCourse && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div className="glass-glow bg-[#0a0f1a] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl shadow-cyan-500/20 m-4">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 relative">
                                <button
                                    onClick={() => setShowCourseModal(false)}
                                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-black/20 p-2 rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl font-bold">
                                        {selectedCourse.avatar}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{selectedCourse.title}</h2>
                                        <p className="text-white/80">{t('community_by')} {selectedCourse.expert}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto flex-1">
                                <p className="text-slate-300 mb-6">{selectedCourse.description}</p>

                                {/* Stats */}
                                <div className="grid grid-cols-4 gap-3 mb-6">
                                    <div className="bg-cyan-500/10 rounded-xl p-3 text-center">
                                        <p className="text-cyan-400 text-lg font-bold">{selectedCourse.duration}</p>
                                        <p className="text-slate-500 text-xs">{t('community_duration')}</p>
                                    </div>
                                    <div className="bg-cyan-500/10 rounded-xl p-3 text-center">
                                        <p className="text-cyan-400 text-lg font-bold">{selectedCourse.lessons}</p>
                                        <p className="text-slate-500 text-xs">{t('community_lessons')}</p>
                                    </div>
                                    <div className="bg-cyan-500/10 rounded-xl p-3 text-center">
                                        <p className="text-cyan-400 text-lg font-bold">{selectedCourse.students}</p>
                                        <p className="text-slate-500 text-xs">{t('community_students')}</p>
                                    </div>
                                    <div className="bg-cyan-500/10 rounded-xl p-3 text-center">
                                        <div className="flex items-center justify-center space-x-1">
                                            <Star className="w-4 h-4 text-cyan-400 fill-yellow-400" />
                                            <p className="text-cyan-400 text-lg font-bold">{selectedCourse.rating}</p>
                                        </div>
                                        <p className="text-slate-500 text-xs">{t('community_rating')}</p>
                                    </div>
                                </div>

                                {/* Lessons List */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                                        <BookOpen className="w-5 h-5 text-cyan-400" />
                                        <span>{t('community_course_program')}</span>
                                    </h3>
                                    <div className="space-y-2 overflow-y-auto pr-2 flex-1 min-h-0">
                                        {selectedCourse.lessonsList.map((lesson, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-bold">
                                                    {index + 1}
                                                </div>
                                                <span className="text-slate-300">{lesson.title}</span>
                                                {enrolledCourses.includes(selectedCourse.id) && index === 0 && (
                                                    <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full ml-auto">{t('community_in_progress')}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className="flex items-center space-x-3 mb-6">
                                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${selectedCourse.level === 'Débutant' ? 'bg-emerald-500/20 text-emerald-300' :
                                        selectedCourse.level === 'Intermédiaire' ? 'bg-cyan-500/20 text-cyan-300' :
                                            selectedCourse.level === 'Avancé' ? 'bg-blue-500/20 text-blue-300' :
                                                'bg-cyan-500/20 text-cyan-300'
                                        }`}>{selectedCourse.level}</span>
                                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${selectedCourse.price === 'Gratuit' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                        }`}>{selectedCourse.price}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => setShowCourseModal(false)}
                                        className="flex-1 py-3 border border-slate-700 rounded-xl font-bold text-slate-400 hover:text-white hover:border-slate-600 transition-all"
                                    >
                                        {t('common_close')}
                                    </button>
                                    <button
                                        onClick={() => handleEnrollCourse(selectedCourse.id)}
                                        className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${enrolledCourses.includes(selectedCourse.id)
                                            ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                                            : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30'
                                            }`}
                                    >
                                        <GraduationCap className="w-5 h-5" />
                                        <span>{enrolledCourses.includes(selectedCourse.id) ? t('community_continue_course') : t('community_enroll_free')}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Course Player */}
            {
                showCoursePlayer && selectedCourse && (
                    <div className="fixed inset-0 bg-background z-50 flex flex-col">
                        {/* Header */}
                        <div className="bg-[#0a0f1a] border-b border-white/10 p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setShowCoursePlayer(false)}
                                    className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-cyan-500/20 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div>
                                    <h2 className="font-bold text-white">{selectedCourse.title}</h2>
                                    <p className="text-sm text-slate-400">{t('community_lessons')} {currentLessonIndex + 1} / {selectedCourse.lessonsList.length}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-cyan-500/20 rounded-full h-2 w-48">
                                    <div
                                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
                                        style={{ width: `${((currentLessonIndex + 1) / selectedCourse.lessonsList.length) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-cyan-400 font-bold">
                                    {Math.round(((currentLessonIndex + 1) / selectedCourse.lessonsList.length) * 100)}%
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Sidebar - Lessons List */}
                            <div className="w-80 bg-[#0a0f1a]/80 border-r border-white/5 overflow-y-auto hidden md:block">
                                <div className="p-4">
                                    <h3 className="font-bold text-white mb-4 flex items-center space-x-2">
                                        <BookOpen className="w-5 h-5 text-cyan-400" />
                                        <span>{t('community_course_content')}</span>
                                    </h3>
                                    <div className="space-y-2">
                                        {selectedCourse.lessonsList.map((lesson, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentLessonIndex(index)}
                                                className={`w-full text-left p-3 rounded-lg transition-all flex items-center space-x-3 ${index === currentLessonIndex
                                                    ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/30'
                                                    : index < currentLessonIndex
                                                        ? 'bg-emerald-500/10 hover:bg-emerald-500/20'
                                                        : 'bg-slate-800/30 hover:bg-slate-800/50'
                                                    }`}
                                            >
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === currentLessonIndex
                                                    ? 'bg-cyan-500 text-white'
                                                    : index < currentLessonIndex
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-slate-700 text-slate-400'
                                                    }`}>
                                                    {index < currentLessonIndex ? <Check className="w-4 h-4" /> : index + 1}
                                                </div>
                                                <span className={`text-sm ${index === currentLessonIndex ? 'text-white font-bold' : 'text-slate-400'
                                                    }`}>{lesson.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Main Content - Lesson View */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="max-w-4xl mx-auto p-8">
                                    {/* Lesson Title */}
                                    <h1 className="text-3xl font-bold text-white mb-6">
                                        {selectedCourse.lessonsList[currentLessonIndex].title}
                                    </h1>

                                    {/* YouTube Video Player - MOVED TO TOP */}
                                    <div className="rounded-2xl aspect-video mb-6 overflow-hidden shadow-2xl shadow-cyan-500/20 bg-black relative">
                                        <iframe
                                            className="w-full h-full"
                                            src={`https://www.youtube-nocookie.com/embed/${selectedCourse.lessonsList[currentLessonIndex].videoId}?rel=0&modestbranding=1&autoplay=1`}
                                            title={selectedCourse.lessonsList[currentLessonIndex].title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                    <div className="flex justify-end mb-8">
                                        <a
                                            href={`https://www.youtube.com/watch?v=${selectedCourse.lessonsList[currentLessonIndex].videoId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-cyan-400 hover:text-white flex items-center space-x-1"
                                        >
                                            <span>{t('community_playback_issue')}</span>
                                            <Share2 className="w-3 h-3" />
                                        </a>
                                    </div>

                                    {/* Written Content Section */}
                                    {selectedCourse.lessonsList[currentLessonIndex].writtenContent && (
                                        <div className="mb-8 space-y-6">
                                            {/* Introduction */}
                                            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6">
                                                <div className="flex items-start space-x-3">
                                                    <BookOpen className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
                                                    <div>
                                                        <h3 className="text-lg font-bold text-cyan-300 mb-3">{t('community_intro')}</h3>
                                                        <p className="text-slate-300 leading-relaxed">
                                                            {selectedCourse.lessonsList[currentLessonIndex].writtenContent.introduction}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Theory Sections */}
                                            {selectedCourse.lessonsList[currentLessonIndex].writtenContent.sections?.map((section, idx) => (
                                                <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                                                        <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold">
                                                            {idx + 1}
                                                        </div>
                                                        <span>{section.title}</span>
                                                    </h3>
                                                    <div className="text-slate-300 leading-relaxed space-y-4">
                                                        {section.content.split('\\n\\n').map((paragraph, pIdx) => (
                                                            <p key={pIdx}>{paragraph}</p>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Practical Example */}
                                            {selectedCourse.lessonsList[currentLessonIndex].writtenContent.examples && (
                                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
                                                    <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center space-x-2">
                                                        <TrendingUp className="w-5 h-5" />
                                                        <span>{t('community_practical_example')}</span>
                                                    </h3>
                                                    <p className="text-slate-300 leading-relaxed">
                                                        {selectedCourse.lessonsList[currentLessonIndex].writtenContent.examples}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Common Mistakes */}
                                            {selectedCourse.lessonsList[currentLessonIndex].writtenContent.mistakes && (
                                                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
                                                    <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center space-x-2">
                                                        <AlertTriangle className="w-5 h-5" />
                                                        <span>{t('community_common_mistakes')}</span>
                                                    </h3>
                                                    <ul className="space-y-3">
                                                        {selectedCourse.lessonsList[currentLessonIndex].writtenContent.mistakes.map((mistake, idx) => (
                                                            <li key={idx} className="flex items-start space-x-3">
                                                                <X className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                                                                <span className="text-slate-300">{mistake}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Action Steps */}
                                            {selectedCourse.lessonsList[currentLessonIndex].writtenContent.actionSteps && (
                                                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
                                                    <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center space-x-2">
                                                        <Zap className="w-5 h-5" />
                                                        <span>{t('community_action_plan')}</span>
                                                    </h3>
                                                    <ul className="space-y-3">
                                                        {selectedCourse.lessonsList[currentLessonIndex].writtenContent.actionSteps.map((step, idx) => (
                                                            <li key={idx} className="flex items-start space-x-3">
                                                                <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                                                    {idx + 1}
                                                                </div>
                                                                <span className="text-slate-300">{step}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}


                                    {/* Lesson Content */}
                                    <div className="prose prose-invert max-w-none mb-8">
                                        <p className="text-slate-300 text-lg leading-relaxed mb-6">
                                            {selectedCourse.lessonsList[currentLessonIndex].summary ||
                                                `Bienvenue dans cette leçon sur "${selectedCourse.lessonsList[currentLessonIndex].title}". 
                                         Dans ce module, vous allez découvrir les concepts fondamentaux et les techniques 
                                         avancées utilisées par les traders professionnels.`}
                                        </p>

                                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-6 mb-6">
                                            <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center space-x-2">
                                                <Target className="w-5 h-5" />
                                                <span>{t('community_key_points')}</span>
                                            </h3>
                                            <ul className="space-y-2 text-slate-300">
                                                {selectedCourse.lessonsList[currentLessonIndex].keyPoints ? (
                                                    selectedCourse.lessonsList[currentLessonIndex].keyPoints.map((point, i) => (
                                                        <li key={i} className="flex items-start space-x-2">
                                                            <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                                            <span>{point}</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <>
                                                        <li className="flex items-start space-x-2">
                                                            <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                                            <span>Comprendre les bases du concept</span>
                                                        </li>
                                                        <li className="flex items-start space-x-2">
                                                            <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                                            <span>Appliquer les techniques sur des exemples réels</span>
                                                        </li>
                                                    </>
                                                )}
                                            </ul>
                                        </div>

                                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-6">
                                            <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center space-x-2">
                                                <Zap className="w-5 h-5" />
                                                <span>{t('community_key_takeaways')}</span>
                                            </h3>
                                            <p className="text-slate-300">
                                                Cette leçon fait partie du cours "{selectedCourse.title}" par {selectedCourse.expert}.
                                                Prenez des notes et n'hésitez pas à revoir les sections importantes.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Navigation */}
                                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                                        <button
                                            onClick={handlePrevLesson}
                                            disabled={currentLessonIndex === 0}
                                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${currentLessonIndex === 0
                                                ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                                                : 'bg-slate-800 text-white hover:bg-slate-700'
                                                }`}
                                        >
                                            <ChevronRight className="w-5 h-5 rotate-180" />
                                            <span>{t('community_prev_lesson')}</span>
                                        </button>

                                        <button
                                            onClick={handleNextLesson}
                                            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                                        >
                                            <span>{currentLessonIndex === selectedCourse.lessonsList.length - 1 ? t('community_finish_course') : t('community_next_lesson')}</span>
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Browse Groups Modal */}
            {
                showBrowseGroupsModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="glass-glow bg-[#0a0f1a] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl shadow-cyan-500/20">
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-cyan-600/20 to-blue-600/20">
                                <div>
                                    <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                                        <Globe className="w-6 h-6 text-cyan-400" />
                                        <span>{t('community_browse_groups_title')}</span>
                                    </h2>
                                    <p className="text-sm text-slate-400 mt-1">{t('community_browse_groups_subtitle')}</p>
                                </div>
                                <button
                                    onClick={() => setShowBrowseGroupsModal(false)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Groups Grid */}
                            <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)] scrollbar-thin scrollbar-thumb-cyan-900">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {groups.map(group => (
                                        <div
                                            key={group.id}
                                            className="bg-white/[0.02] rounded-xl p-5 border border-white/5 hover:border-cyan-500/30 transition-all group cursor-pointer"
                                            onClick={() => {
                                                handleOpenGroupModal(group);
                                                setShowBrowseGroupsModal(false);
                                            }}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center font-bold text-xl shadow-lg`}>
                                                        {group.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white text-lg group-hover:text-cyan-400 transition-colors">
                                                            {group.name}
                                                        </h3>
                                                        <p className="text-xs text-slate-400">{group.members} membres</p>
                                                    </div>
                                                </div>
                                                {group.active && (
                                                    <div className="flex items-center space-x-1 text-cyan-400 text-xs">
                                                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                                                        <span>{t('community_active')}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-300 mb-4 line-clamp-2">
                                                {group.description}
                                            </p>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenGroupModal(group);
                                                    setShowBrowseGroupsModal(false);
                                                }}
                                                className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-sm font-bold text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                                            >
                                                {t('community_view_group')}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Messaging Modal */}
            {
                showMessageModal && selectedFriend && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="glass-glow bg-[#0a0f1a] border border-white/10 rounded-2xl max-w-2xl w-full h-[600px] overflow-hidden shadow-2xl shadow-cyan-500/20 flex flex-col">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg">
                                            {selectedFriend.avatar}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-cyan-600 ${selectedFriend.status === 'online' ? 'bg-emerald-500' :
                                            selectedFriend.status === 'away' ? 'bg-amber-500' : 'bg-slate-500'
                                            }`}></div>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{selectedFriend.name}</h2>
                                        <p className="text-white/70 text-sm">{selectedFriend.level}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowMessageModal(false)}
                                    className="text-white/80 hover:text-white transition-colors bg-white/10 p-2 rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
                                {chatMessages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <MessageCircle className="w-16 h-16 text-cyan-400/30 mb-4" />
                                        <p className="text-slate-400 text-lg">{t('community_no_messages')}</p>
                                        <p className="text-slate-500 text-sm">{t('community_start_conversation_short')}</p>
                                    </div>
                                ) : (
                                    chatMessages.map((msg, index) => {
                                        const userEmail = localStorage.getItem('userEmail') || 'demo@tradesense.com';
                                        const isMe = msg.sender === userEmail;
                                        const msgDate = new Date(msg.timestamp * 1000);
                                        const timeStr = msgDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

                                        return (
                                            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
                                                    <div className={`rounded-2xl px-4 py-3 ${isMe
                                                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none'
                                                        : 'bg-slate-800/80 text-slate-200 rounded-bl-none'
                                                        }`}>
                                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                                    </div>
                                                    <p className={`text-xs text-slate-500 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                                        {timeStr}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-[#0a0f1a] border-t border-white/10">
                                <div className="flex space-x-3">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder={t('community_msg_group_placeholder')}
                                        className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim()}
                                        className={`bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 rounded-xl font-bold flex items-center space-x-2 hover:shadow-lg hover:shadow-cyan-500/30 transition-all ${!newMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Create Group Modal */}
            {showCreateGroupModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-glow bg-[#0a0f1a] border border-white/10 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl shadow-cyan-500/20">
                        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 relative">
                            <button
                                onClick={() => {
                                    setShowCreateGroupModal(false);
                                    setNewGroup({ name: '', desc: '', icon: '👥', color: 'from-cyan-500 to-blue-600' });
                                }}
                                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                                    {newGroup.icon}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{t('community_create_group_title')}</h2>
                                    <p className="text-white/70 text-sm">{t('community_create_group_subtitle')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            <div>
                                <label className="block text-slate-400 text-sm mb-2">{t('community_group_name_label')}</label>
                                <input
                                    type="text"
                                    value={newGroup.name}
                                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50"
                                    placeholder={t('community_group_name_placeholder')}
                                    maxLength={30}
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-2">{t('community_group_desc_label')}</label>
                                <textarea
                                    value={newGroup.desc}
                                    onChange={(e) => setNewGroup({ ...newGroup, desc: e.target.value })}
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 resize-none h-20"
                                    placeholder={t('community_group_desc_placeholder')}
                                    maxLength={100}
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-2">{t('community_choose_icon')}</label>
                                <div className="grid grid-cols-6 gap-2">
                                    {['👥', '💹', '🪙', '🥇', '📊', '🏆', '🎯', '💰', '📈', '🚀', '💎', '⚡'].map((icon) => (
                                        <button
                                            key={icon}
                                            onClick={() => setNewGroup({ ...newGroup, icon })}
                                            className={`p-3 rounded-xl border-2 text-2xl transition-all ${newGroup.icon === icon
                                                ? 'border-cyan-500 bg-cyan-500/20 scale-110'
                                                : 'border-white/10 hover:border-cyan-500/30'
                                                }`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-2">{t('community_theme_color')}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { name: 'Cyan-Blue', value: 'from-cyan-500 to-blue-600' },
                                        { name: 'Orange-Amber', value: 'from-orange-500 to-amber-600' },
                                        { name: 'Emerald-Teal', value: 'from-emerald-500 to-teal-600' },
                                        { name: 'Purple-Indigo', value: 'from-purple-500 to-indigo-600' },
                                        { name: 'Pink-Rose', value: 'from-pink-500 to-rose-600' },
                                        { name: 'Yellow-Amber', value: 'from-yellow-500 to-amber-500' },
                                    ].map((color) => (
                                        <button
                                            key={color.value}
                                            onClick={() => setNewGroup({ ...newGroup, color: color.value })}
                                            className={`h-12 rounded-xl bg-gradient-to-r ${color.value} border-2 transition-all ${newGroup.color === color.value
                                                ? 'border-white scale-105'
                                                : 'border-white/10 hover:scale-105'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <p className="text-xs text-slate-400 mb-2">{t('community_preview')}</p>
                                <div className="flex items-center space-x-3">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${newGroup.color} flex items-center justify-center text-2xl`}>
                                        {newGroup.icon}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{newGroup.name || t('community_group_name_preview')}</p>
                                        <p className="text-xs text-slate-400">{newGroup.desc || t('community_group_desc_preview')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => {
                                        setShowCreateGroupModal(false);
                                        setNewGroup({ name: '', desc: '', icon: '👥', color: 'from-cyan-500 to-blue-600' });
                                    }}
                                    className="flex-1 py-3 border border-slate-700 rounded-xl font-bold text-slate-400 hover:text-white hover:border-slate-600 transition-all"
                                >
                                    {t('common_cancel')}
                                </button>
                                <button
                                    onClick={() => {
                                        if (!newGroup.name.trim() || !newGroup.desc.trim()) {
                                            toast.error(t('community_fill_all_fields'));
                                            return;
                                        }

                                        const createdGroup = {
                                            id: Date.now(),
                                            name: newGroup.name,
                                            desc: newGroup.desc,
                                            icon: newGroup.icon,
                                            color: newGroup.color,
                                            members: 1
                                        };

                                        handleJoinNewGroup(createdGroup);

                                        toast.success(t('community_group_created_success'));
                                        setShowCreateGroupModal(false);
                                        setNewGroup({ name: '', desc: '', icon: '👥', color: 'from-cyan-500 to-blue-600' });
                                    }}
                                    disabled={!newGroup.name.trim() || !newGroup.desc.trim()}
                                    className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${!newGroup.name.trim() || !newGroup.desc.trim()
                                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30'
                                        }`}
                                >
                                    <span>{t('community_create_group_btn')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Community;
