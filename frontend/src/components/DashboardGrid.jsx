import React, { useState, useEffect } from 'react';
import RGL from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Save, RotateCcw, LayoutGrid, Lock, Unlock } from 'lucide-react';

const ResponsiveGridLayout = RGL.WidthProvider(RGL.Responsive);

const DashboardGrid = ({ children, layouts: initialLayouts, onLayoutChange }) => {
    const [layouts, setLayouts] = useState(initialLayouts);
    const [isEditMode, setIsEditMode] = useState(false);

    // Load layout from localStorage on mount
    useEffect(() => {
        const savedLayouts = localStorage.getItem('dashboard_layouts_v1');
        if (savedLayouts) {
            try {
                setLayouts(JSON.parse(savedLayouts));
            } catch (e) {
                console.error("Error parsing layout", e);
            }
        }
    }, []);

    const handleLayoutChange = (layout, allLayouts) => {
        setLayouts(allLayouts);
        if (onLayoutChange) onLayoutChange(allLayouts);
    };

    const saveLayout = () => {
        localStorage.setItem('dashboard_layouts_v1', JSON.stringify(layouts));
        setIsEditMode(false);
    };

    const resetLayout = () => {
        localStorage.removeItem('dashboard_layouts_v1');
        setLayouts(initialLayouts);
        window.location.reload(); // Simple reload to reset
    };

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex justify-end items-center gap-2 mb-2 px-4">
                {isEditMode ? (
                    <>
                        <button onClick={saveLayout} className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold hover:bg-green-500/30 transition-colors">
                            <Save className="w-3 h-3" /> Save Layout
                        </button>
                        <button onClick={resetLayout} className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/30 transition-colors">
                            <RotateCcw className="w-3 h-3" /> Reset
                        </button>
                        <button onClick={() => setIsEditMode(false)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-600 transition-colors">
                            Cancel
                        </button>
                    </>
                ) : (
                    <button onClick={() => setIsEditMode(true)} className="flex items-center gap-2 px-3 py-1.5 bg-[#1a0b2e] border border-purple-500/30 text-purple-300 rounded-lg text-xs font-bold hover:bg-purple-500/20 transition-colors">
                        <LayoutGrid className="w-3 h-3" /> Edit Layout
                    </button>
                )}
            </div>

            {/* Grid */}
            <div className="flex-1 relative">
                {/* Visual hint when in edit mode */}
                {isEditMode && (
                    <div className="absolute inset-0 border-2 border-dashed border-purple-500/30 pointer-events-none z-0 rounded-xl"></div>
                )}

                <ResponsiveGridLayout
                    className="layout"
                    layouts={layouts}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    rowHeight={30}
                    isDraggable={isEditMode}
                    isResizable={isEditMode}
                    onLayoutChange={handleLayoutChange}
                    draggableHandle=".drag-handle"
                    margin={[10, 10]}
                >
                    {children}
                </ResponsiveGridLayout>
            </div>
        </div>
    );
};

export default DashboardGrid;
