import React from 'react';
import { CompanyDetails } from '../types';
import { Building2, Mail, Phone, MapPin, Globe, FileText } from 'lucide-react';

interface SettingsProps {
  company: CompanyDetails;
  onChange: (company: CompanyDetails) => void;
}

export const Settings: React.FC<SettingsProps> = ({ company, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...company, [name]: value });
  };

  return (
    <div className="glass-panel rounded-3xl p-6 dark:border-slate-700">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
        <Building2 className="w-6 h-6 text-slate-500 dark:text-slate-400" />
        Company Identity
      </h2>
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Company Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                name="name"
                value={company.name}
                onChange={handleChange}
                className="glass-input w-full pl-10 pr-4 py-3 rounded-xl outline-none text-slate-800 font-medium"
                placeholder="Acme Corp"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                name="website"
                value={company.website || ''}
                onChange={handleChange}
                className="glass-input w-full pl-10 pr-4 py-3 rounded-xl outline-none text-slate-800 font-medium"
                placeholder="www.example.com"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input
              type="email"
              name="email"
              value={company.email}
              onChange={handleChange}
              className="glass-input w-full pl-10 pr-4 py-3 rounded-xl outline-none text-slate-800 font-medium"
              placeholder="contact@company.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              name="phone"
              value={company.phone}
              onChange={handleChange}
              className="glass-input w-full pl-10 pr-4 py-3 rounded-xl outline-none text-slate-800 font-medium"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              name="address"
              value={company.address}
              onChange={handleChange}
              className="glass-input w-full pl-10 pr-4 py-3 rounded-xl outline-none text-slate-800 font-medium"
              placeholder="123 Street, City, Country"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Tax ID / VAT</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              name="taxId"
              value={company.taxId || ''}
              onChange={handleChange}
              className="glass-input w-full pl-10 pr-4 py-3 rounded-xl outline-none text-slate-800 font-medium"
              placeholder="US-123456789"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-white/40 dark:bg-slate-800/40 border border-white/40 dark:border-white/10 rounded-xl text-sm text-slate-600 dark:text-slate-400 backdrop-blur-sm">
        <p>💡 Changes are auto-saved and applied immediately.</p>
      </div>
    </div>
  );
};