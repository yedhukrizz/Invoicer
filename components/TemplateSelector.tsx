import React from 'react';
import { ColorTheme, DesignSettings, TemplateType } from '../types';
import { Layout, Palette, Type, Monitor, Zap, FileText } from 'lucide-react';

interface TemplateSelectorProps {
  settings: DesignSettings;
  onChange: (settings: DesignSettings) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ settings, onChange }) => {
  const colors: ColorTheme[] = ['purple', 'blue', 'emerald', 'rose', 'slate', 'orange'];
  
  const templates: {id: TemplateType, label: string, icon: any}[] = [
    { id: 'modern', label: 'Modern', icon: Layout },
    { id: 'classic', label: 'Classic', icon: FileText },
    { id: 'bold', label: 'Bold', icon: Monitor },
    { id: 'neo', label: 'Neo', icon: Zap },
    { id: 'glitch', label: 'Glitch', icon: Zap }
  ];

  const fonts = ['sans', 'outfit', 'space'];

  return (
    <div className="glass-panel rounded-3xl p-6 space-y-6 dark:border-slate-700">
      
      {/* Templates */}
      <div>
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">Layout Style</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange({ ...settings, template: t.id })}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                settings.template === t.id
                  ? 'bg-slate-800 dark:bg-slate-100 border-slate-800 dark:border-slate-100 text-white dark:text-slate-900 shadow-lg'
                  : 'bg-white/40 dark:bg-white/5 border-transparent hover:bg-white/60 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400'
              }`}
            >
              <t.icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">Accent Color</label>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => onChange({ ...settings, colorTheme: c })}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                settings.colorTheme === c ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-500 scale-110' : 'hover:scale-105'
              }`}
            >
               <div className={`w-full h-full rounded-full shadow-sm bg-${c}-500`}></div>
            </button>
          ))}
        </div>
      </div>

      {/* Fonts */}
      <div>
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">Typography</label>
        <div className="flex gap-2">
          {fonts.map((f) => (
            <button
              key={f}
              onClick={() => onChange({ ...settings, font: f as any })}
              className={`flex-1 p-2 rounded-xl border text-sm transition-all ${
                settings.font === f
                  ? 'bg-white dark:bg-slate-700 border-white dark:border-slate-600 shadow-sm text-slate-900 dark:text-white font-bold'
                  : 'bg-white/20 dark:bg-white/5 border-transparent hover:bg-white/40 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className={f === 'outfit' ? 'font-outfit' : f === 'space' ? 'font-space' : 'font-sans'}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};