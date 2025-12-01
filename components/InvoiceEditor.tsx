import React, { useState } from 'react';
import { InvoiceData, LineItem } from '../types';
import { Plus, Trash2, Sparkles, DollarSign, User, Percent, Box } from 'lucide-react';
import { generateInvoiceTerms, generateItemDescription } from '../services/geminiService';

interface InvoiceEditorProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export const InvoiceEditor: React.FC<InvoiceEditorProps> = ({ data, onChange }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      client: { ...data.client, [e.target.name]: e.target.value }
    });
  };

  const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    onChange({ ...data, [e.target.name]: value });
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    const newItems = data.items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, items: newItems });
  };

  const deleteItem = (id: string) => {
    onChange({ ...data, items: data.items.filter(item => item.id !== id) });
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      price: 0
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const handleAiTerms = async () => {
    setIsGenerating(true);
    const terms = await generateInvoiceTerms('polite');
    onChange({ ...data, terms });
    setIsGenerating(false);
  };

  const handleAiDescription = async (id: string, currentText: string) => {
    if (!currentText) return;
    setIsGenerating(true);
    const newDesc = await generateItemDescription(currentText);
    updateItem(id, 'description', newDesc);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* Invoice Meta */}
      <div className="glass-panel rounded-3xl p-6 dark:border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-slate-700 dark:text-slate-200 flex items-center gap-2">
           <Box className="w-5 h-5 opacity-50"/> Invoice Details
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Number</label>
            <input
              type="text"
              name="number"
              value={data.number}
              onChange={handleMetaChange}
              className="glass-input w-full p-3 rounded-xl outline-none text-slate-800 font-medium"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Date</label>
            <input
              type="date"
              name="date"
              value={data.date}
              onChange={handleMetaChange}
              className="glass-input w-full p-3 rounded-xl outline-none text-slate-800 font-medium"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={data.dueDate}
              onChange={handleMetaChange}
              className="glass-input w-full p-3 rounded-xl outline-none text-slate-800 font-medium"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Currency</label>
            <select
              name="currency"
              value={data.currency}
              onChange={handleMetaChange}
              className="glass-input w-full p-3 rounded-xl outline-none text-slate-800 font-medium h-[50px] cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div className="glass-panel rounded-3xl p-6 dark:border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <User className="w-5 h-5 opacity-50" /> Client Information
        </h3>
        <div className="grid gap-4">
          <input
            type="text"
            name="name"
            placeholder="Client Name"
            value={data.client.name}
            onChange={handleClientChange}
            className="glass-input w-full p-3 rounded-xl outline-none text-slate-800 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Client Email"
            value={data.client.email}
            onChange={handleClientChange}
            className="glass-input w-full p-3 rounded-xl outline-none text-slate-800 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <input
            type="text"
            name="address"
            placeholder="Client Address"
            value={data.client.address}
            onChange={handleClientChange}
            className="glass-input w-full p-3 rounded-xl outline-none text-slate-800 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Line Items */}
      <div className="glass-panel rounded-3xl p-6 dark:border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <DollarSign className="w-5 h-5 opacity-50" /> Items
        </h3>
        <div className="space-y-3">
          {data.items.map((item) => (
            <div key={item.id} className="group relative grid grid-cols-12 gap-2 items-start p-3 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 transition-all shadow-sm">
              <div className="col-span-12 md:col-span-6">
                <div className="relative">
                    <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="w-full bg-transparent p-2 border-b border-transparent focus:border-primary outline-none font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                    />
                    {process.env.API_KEY && (
                    <button 
                        onClick={() => handleAiDescription(item.id, item.description)}
                        disabled={isGenerating}
                        className="absolute right-2 top-2 text-primary dark:text-primaryContainer opacity-0 group-hover:opacity-100 transition-opacity"
                        title="AI Enhance"
                    >
                        <Sparkles className="w-4 h-4" />
                    </button>
                    )}
                </div>
              </div>
              <div className="col-span-4 md:col-span-2">
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                  className="w-full bg-transparent p-2 border-b border-transparent focus:border-primary outline-none text-center font-medium text-slate-800 dark:text-slate-200"
                />
              </div>
              <div className="col-span-5 md:col-span-3">
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value))}
                  className="w-full bg-transparent p-2 border-b border-transparent focus:border-primary outline-none text-right font-medium text-slate-800 dark:text-slate-200"
                />
              </div>
              <div className="col-span-3 md:col-span-1 flex justify-center pt-2">
                <button
                  onClick={() => deleteItem(item.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-100/50 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-6">
             <div className="flex items-center gap-2">
                 <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Tax (%)</label>
                 <div className="relative w-20">
                     <input
                        type="number"
                        name="taxRate"
                        value={data.taxRate}
                        onChange={handleMetaChange}
                        className="glass-input w-full p-2 rounded-lg text-center font-bold"
                     />
                 </div>
             </div>
             
             <button
                onClick={addItem}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-primary text-white rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-primary/90 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                >
                <Plus className="w-4 h-4" /> Add Item
            </button>
        </div>
      </div>

      {/* Notes & Terms */}
      <div className="glass-panel rounded-3xl p-6 dark:border-slate-700">
         <div className="space-y-4">
            <div className="relative">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block flex items-center justify-between">
                    Payment Terms
                     {process.env.API_KEY && (
                         <button 
                            onClick={handleAiTerms}
                            disabled={isGenerating}
                            className="inline-flex items-center gap-1 text-xs text-primary dark:text-primaryContainer bg-white/50 dark:bg-white/10 px-2 py-1 rounded-md hover:bg-white dark:hover:bg-white/20 transition-colors"
                         >
                             <Sparkles className="w-3 h-3"/> Generate
                         </button>
                     )}
                </label>
                <textarea
                    name="terms"
                    value={data.terms}
                    onChange={handleMetaChange}
                    className="glass-input w-full p-3 rounded-xl outline-none h-24 resize-none font-medium text-slate-700 dark:text-slate-200"
                />
            </div>
            <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Notes</label>
                <textarea
                    name="notes"
                    value={data.notes}
                    onChange={handleMetaChange}
                    className="glass-input w-full p-3 rounded-xl outline-none h-24 resize-none font-medium text-slate-700 dark:text-slate-200"
                />
            </div>
         </div>
      </div>
    </div>
  );
};