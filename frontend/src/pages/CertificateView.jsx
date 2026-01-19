import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCertificate } from '../api/api';
import Navbar from '../components/Navbar';
import { Printer, Download, ArrowLeft, Award, CheckCircle } from 'lucide-react';

const CertificateView = () => {
    const { id } = useParams(); // Certificate Number
    const navigate = useNavigate();
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCert = async () => {
            try {
                const res = await getCertificate(id);
                setCertificate(res.data);
            } catch (err) {
                console.error("Failed to fetch certificate", err);
                setError("Certificat introuvable ou invalide.");
            } finally {
                setLoading(false);
            }
        };
        fetchCert();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0f0716] text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-[#0f0716] text-white p-4">
                <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 text-center max-w-md">
                    <Award className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Erreur</h1>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/academy')}
                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors font-bold"
                    >
                        Retour à l'Académie
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0716] text-black print:bg-white print:text-black flex flex-col">
            {/* Header - Hidden on Print */}
            <div className="print:hidden">
                <Navbar />
                <div className="bg-[#1a0b2e] border-b border-purple-500/20 p-4">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <button
                            onClick={() => navigate('/academy')}
                            className="flex items-center text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Retour
                        </button>
                        <div className="flex space-x-4">
                            <button
                                onClick={handlePrint}
                                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-bold shadow-lg transition-transform hover:scale-105"
                            >
                                <Printer className="w-5 h-5 mr-2" />
                                Imprimer / PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Certificate Container */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-12 print:p-0 bg-pattern">
                <div className="relative w-full max-w-[1100px] aspect-[1.414/1] bg-white text-black p-2 shadow-2xl print:shadow-none print:w-full print:max-w-none print:h-screen">
                    {/* Gold Border Outer */}
                    <div className="peer h-full w-full border-4 border-[#C5A059] p-1">
                        {/* Gold Border Inner */}
                        <div className="h-full w-full border-2 border-[#C5A059] p-8 md:p-12 flex flex-col items-center justify-between bg-cert-pattern relative">

                            {/* Watermark / Background elements */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                <Award className="w-96 h-96 text-black" />
                            </div>

                            {/* Header */}
                            <div className="text-center z-10 w-full">
                                <div className="flex items-center justify-center mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white mr-4 print:text-black print:grayscale">
                                        <Award className="w-10 h-10" />
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-wider uppercase text-slate-800">TradeSense AI</h1>
                                </div>
                                <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#C5A059] mb-4 uppercase tracking-widest certificate-title">
                                    Certificat de Réussite
                                </h2>
                                <p className="text-xl text-slate-500 italic">Ce document certifie que</p>
                            </div>

                            {/* Student Name */}
                            <div className="text-center z-10 my-8 w-full border-b-2 border-slate-200 pb-8">
                                <h3 className="text-4xl md:text-5xl font-bold text-slate-900 capitalize font-serif">
                                    {certificate.student_name || "Étudiant"}
                                </h3>
                            </div>

                            {/* Details */}
                            <div className="text-center z-10 mb-8 max-w-2xl">
                                <p className="text-xl text-slate-600 mb-2">A complété avec succès le cours de formation professionnelle</p>
                                <h4 className="text-3xl font-bold text-[#1a0b2e] mb-6">{certificate.course_title}</h4>

                                <div className="flex justify-center flex-wrap gap-8 text-slate-600">
                                    <div>
                                        <span className="block text-sm uppercase tracking-wider text-slate-400">Durée</span>
                                        <span className="font-bold text-lg">{certificate.duration}</span>
                                    </div>
                                    <div>
                                        <span className="block text-sm uppercase tracking-wider text-slate-400">Date</span>
                                        <span className="font-bold text-lg">{new Date(certificate.issued_at).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                        <span className="block text-sm uppercase tracking-wider text-slate-400">Niveau</span>
                                        <span className="font-bold text-lg">{certificate.difficulty}/5</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer / Signature */}
                            <div className="w-full flex justify-between items-end z-10 mt-8 px-12">
                                <div className="text-center">
                                    <div className="w-48 border-b border-black mb-2 opacity-50"></div>
                                    <p className="text-sm font-bold uppercase tracking-wider text-slate-500">ID du Certificat</p>
                                    <p className="font-mono text-xs text-slate-400 mt-1">{certificate.certificate_number}</p>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 mb-2">
                                        {/* Seal */}
                                        <div className="w-full h-full rounded-full border-4 border-[#C5A059] flex items-center justify-center relative">
                                            <div className="absolute inset-1 border border-[#C5A059] rounded-full"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-[#C5A059] text-white rounded-full flex items-center justify-center opacity-90 print:text-white">
                                                    <CheckCircle className="w-8 h-8" />
                                                </div>
                                            </div>
                                            <svg className="absolute w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                                                <path id="curve" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                                                <text className="text-[10px] fill-[#C5A059] font-bold uppercase tracking-[0.1em]">
                                                    <textPath href="#curve">
                                                        TradeSense Academy • Certified •
                                                    </textPath>
                                                </text>
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-xs text-[#C5A059] font-bold uppercase tracking-widest mt-2">Sceau Officiel</p>
                                </div>

                                <div className="text-center">
                                    <div className="font-script text-3xl mb-1 text-slate-800" style={{ fontFamily: 'cursive' }}>TradeSense AI</div>
                                    <div className="w-48 border-b border-black mb-2"></div>
                                    <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Directeur de l'Académie</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media print {
                    @page {
                        size: landscape;
                        margin: 0;
                    }
                    body {
                        background: white;
                    }
                }
                .bg-cert-pattern {
                    background-image: radial-gradient(#C5A059 0.5px, transparent 0.5px);
                    background-size: 20px 20px;
                    background-color: #ffffff;
                }
            `}</style>
        </div>
    );
};

export default CertificateView;
