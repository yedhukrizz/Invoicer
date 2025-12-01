import React, { useEffect, useState, useRef } from 'react';
import { getInitialState, saveState } from './services/storageService';
import { AppState } from './types';
import { Settings } from './components/Settings';
import { InvoiceEditor } from './components/InvoiceEditor';
import { InvoicePreview } from './components/InvoicePreview';
import { TemplateSelector } from './components/TemplateSelector';
import { Printer, LayoutDashboard, Settings as SettingsIcon, Hexagon, Sparkles, Minus, Square, X, Moon, Sun, Monitor } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>(getInitialState);
  const [activeTab, setActiveTab] = useState<'editor' | 'settings'>('editor');
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Scaling State
  const [scale, setScale] = useState(1);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Handle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auto-scale Logic
  useEffect(() => {
    const handleResize = () => {
      if (previewContainerRef.current) {
        // A4 Dimensions in PX (approx)
        const A4_WIDTH = 794; 
        const A4_HEIGHT = 1123;
        const PADDING = 60; // Extra padding around the preview

        const containerWidth = previewContainerRef.current.clientWidth - PADDING;
        const containerHeight = previewContainerRef.current.clientHeight - PADDING;

        const scaleX = containerWidth / A4_WIDTH;
        const scaleY = containerHeight / A4_HEIGHT;

        // Use the smaller scale to ensure it fits entirely
        let newScale = Math.min(scaleX, scaleY);
        // Cap max scale at 1 to prevent pixelation on huge screens, or let it grow if you prefer zoom
        // newScale = Math.min(newScale, 1.2); 
        
        setScale(newScale);
      }
    };

    // Initial calc
    handleResize();

    // Listener
    window.addEventListener('resize', handleResize);
    
    // ResizeObserver for container changes (e.g. sidebar toggle)
    const observer = new ResizeObserver(handleResize);
    if (previewContainerRef.current) {
      observer.observe(previewContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [showMobilePreview, activeTab]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 selection:bg-purple-200 selection:text-purple-900 transition-colors duration-300">
      
      {/* Windows 11 Style Title Bar */}
      <div className="no-print h-8 flex items-center justify-between px-4 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md border-b border-white/20 dark:border-white/5 select-none z-50">
         <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-300">
             <Hexagon className="w-3 h-3 text-primary fill-current" />
             <span>InvoiceGenius</span>
         </div>
         
         <div className="flex-1" /> {/* Spacer */}

         <div className="flex items-center gap-4">
             {/* Dark Mode Toggle */}
             <button 
               onClick={() => setDarkMode(!darkMode)}
               className="p-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
               title="Toggle Dark Mode"
             >
                {darkMode ? <Sun className="w-3 h-3 text-amber-300" /> : <Moon className="w-3 h-3 text-slate-500" />}
             </button>

            <div className="w-px h-3 bg-slate-300 dark:bg-slate-700 mx-1"></div>

            <button className="hover:bg-slate-200/50 dark:hover:bg-slate-700/50 p-1 rounded"><Minus className="w-3 h-3 text-slate-500 dark:text-slate-400" /></button>
            <button className="hover:bg-slate-200/50 dark:hover:bg-slate-700/50 p-1 rounded"><Square className="w-3 h-3 text-slate-500 dark:text-slate-400" /></button>
            <button className="hover:bg-rose-500 hover:text-white p-1 rounded transition-colors group"><X className="w-3 h-3 text-slate-500 dark:text-slate-400 group-hover:text-white" /></button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Glass Sidebar */}
        <aside className="no-print w-20 lg:w-[280px] flex-shrink-0 flex flex-col glass-sidebar z-20 transition-all duration-300">
          <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8 gap-4">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-purple-400 rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/20 ring-4 ring-white/50 dark:ring-white/10">
              <Hexagon className="w-6 h-6" />
            </div>
            <div className="hidden lg:block">
               <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">Invoice<br/><span className="text-primary dark:text-primaryContainer">Genius</span></h1>
            </div>
          </div>

          <nav className="flex-1 py-6 px-4 space-y-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activeTab === 'editor' 
                  ? 'bg-white/80 dark:bg-white/10 shadow-sm ring-1 ring-slate-200/50 dark:ring-white/10 text-primary dark:text-primaryContainer font-semibold' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className={`w-5 h-5 ${activeTab === 'editor' ? 'text-primary dark:text-primaryContainer' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
              <span className="hidden lg:block">Workspace</span>
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activeTab === 'settings' 
                   ? 'bg-white/80 dark:bg-white/10 shadow-sm ring-1 ring-slate-200/50 dark:ring-white/10 text-primary dark:text-primaryContainer font-semibold' 
                   : 'text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <SettingsIcon className={`w-5 h-5 ${activeTab === 'settings' ? 'text-primary dark:text-primaryContainer' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
              <span className="hidden lg:block">Settings</span>
            </button>
          </nav>

          <div className="p-6 border-t border-slate-200/50 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
             <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-primary text-white p-3.5 rounded-xl hover:bg-slate-800 dark:hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/20 dark:shadow-primary/20 group"
            >
              <Printer className="w-5 h-5 text-slate-200 group-hover:text-white" /> 
              <span className="hidden lg:inline font-medium">Export PDF</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex overflow-hidden relative">
          
          {/* Editor Panel - Scrollable */}
          <div className={`no-print flex-1 h-full overflow-y-auto overflow-x-hidden p-4 lg:p-8 transition-all duration-500 ${showMobilePreview ? 'hidden lg:block' : 'block'}`}>
            <div className="max-w-3xl mx-auto space-y-8 pb-32">
              
              {activeTab === 'editor' ? (
                <div className="space-y-8 animate-fadeIn">
                   {/* Section Header */}
                   <div className="flex items-center justify-between">
                       <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Design & Content</h2>
                       <div className="text-xs font-medium text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-white/50 dark:border-white/10">
                          Auto-saving...
                       </div>
                   </div>

                   <TemplateSelector 
                     settings={state.design}
                     onChange={(design) => setState(prev => ({ ...prev, design }))}
                   />
                   
                   <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent w-full" />

                   <InvoiceEditor
                     data={state.invoice}
                     onChange={(invoice) => setState(prev => ({ ...prev, invoice }))}
                   />
                </div>
              ) : (
                <div className="animate-fadeIn">
                   <div className="mb-8">
                       <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h2>
                       <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your company profile and defaults.</p>
                   </div>
                  <Settings
                    company={state.company}
                    onChange={(company) => setState(prev => ({ ...prev, company }))}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel - Fixed Right Side on Desktop */}
          <div 
             ref={previewContainerRef}
             className={`absolute inset-0 z-30 lg:relative lg:flex lg:w-[45%] xl:w-[50%] bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-md lg:backdrop-blur-none flex-col items-center justify-center p-0 transition-all duration-300 ${!showMobilePreview ? 'hidden lg:flex' : 'flex'}`}
          >
              
               {/* Mobile Close Button */}
               {showMobilePreview && (
                  <button 
                      onClick={() => setShowMobilePreview(false)}
                      className="no-print lg:hidden absolute top-6 right-6 bg-white dark:bg-slate-800 p-3 rounded-full shadow-lg z-50 text-slate-800 dark:text-white"
                  >
                      <X className="w-6 h-6"/>
                  </button>
              )}
              
              <div className="no-print absolute top-0 left-0 w-full h-full opacity-30 dark:opacity-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

              {/* Scalable Container */}
              <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden">
                <div 
                  style={{ 
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    width: '794px', // A4 Width px
                    height: '1123px', // A4 Height px
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  }}
                  className="bg-white transition-transform duration-300 ease-out backface-hidden"
                >
                    <div id="printable-content" className="w-full h-full">
                      <InvoicePreview 
                        data={state.invoice}
                        company={state.company}
                        design={state.design}
                      />
                    </div>
                </div>
              </div>

              <div className="no-print absolute bottom-8 bg-black/75 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 pointer-events-none">
                  <Monitor className="w-3 h-3" />
                  <span>Preview Scale: {Math.round(scale * 100)}%</span>
              </div>
          </div>
        </main>

        {/* Mobile Floating Action Button */}
        <div className="no-print lg:hidden fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className="bg-slate-900 dark:bg-primary text-white p-4 rounded-2xl shadow-xl shadow-slate-900/30 dark:shadow-primary/30 flex items-center gap-2 font-bold hover:scale-105 transition-transform"
          >
            {showMobilePreview ? <LayoutDashboard className="w-5 h-5"/> : <Sparkles className="w-5 h-5"/>}
            {showMobilePreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>
    </div>
  );
}