import React, { useMemo } from 'react';
import { CompanyDetails, DesignSettings, InvoiceData } from '../types';

interface InvoicePreviewProps {
  data: InvoiceData;
  company: CompanyDetails;
  design: DesignSettings;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data, company, design }) => {
  const subtotal = useMemo(() => data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0), [data.items]);
  const taxAmount = (subtotal * data.taxRate) / 100;
  const total = subtotal + taxAmount;

  const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: data.currency,
  });

  const getThemeColors = () => {
    switch (design.colorTheme) {
      case 'purple': return { primary: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-600', light: 'bg-purple-50', gradient: 'from-purple-600 to-indigo-600' };
      case 'blue': return { primary: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600', light: 'bg-blue-50', gradient: 'from-blue-600 to-cyan-600' };
      case 'emerald': return { primary: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', light: 'bg-emerald-50', gradient: 'from-emerald-600 to-teal-600' };
      case 'rose': return { primary: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-600', light: 'bg-rose-50', gradient: 'from-rose-600 to-pink-600' };
      case 'slate': return { primary: 'bg-slate-800', text: 'text-slate-800', border: 'border-slate-800', light: 'bg-slate-50', gradient: 'from-slate-800 to-gray-800' };
      case 'orange': return { primary: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', light: 'bg-orange-50', gradient: 'from-orange-500 to-red-500' };
      default: return { primary: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-600', light: 'bg-purple-50', gradient: 'from-purple-600 to-indigo-600' };
    }
  };

  const theme = getThemeColors();
  const fontClass = design.font === 'outfit' ? 'font-outfit' : design.font === 'space' ? 'font-space' : 'font-sans';
  
  // NOTE: Width and Height are fixed for A4 (210mm x 297mm approx 794px x 1123px at 96 DPI)
  // This allows the parent container to simply scale() this div to fit any screen.
  const A4_CLASS = "w-[794px] h-[1123px] relative overflow-hidden bg-white text-slate-800 flex-shrink-0 origin-top-left";

  // Template: Neo (Glass, Gradient, Digital)
  if (design.template === 'neo') {
    return (
      <div className={`${A4_CLASS} bg-slate-50 text-slate-900 ${fontClass}`}>
         {/* Decorative Header */}
         <div className={`absolute top-0 left-0 right-0 h-64 bg-gradient-to-br ${theme.gradient} opacity-10 rounded-b-[50px] print:opacity-20`} />
         <div className={`absolute top-[-100px] right-[-100px] w-96 h-96 bg-gradient-to-br ${theme.gradient} rounded-full blur-3xl opacity-20 print:hidden`} />

         <div className="relative p-12 z-10 h-full flex flex-col">
            <div className="flex justify-between items-start mb-16">
               <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/40 shadow-xl max-w-sm print:shadow-none print:border-slate-200">
                  <h1 className="text-3xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 print:text-slate-900">{company.name}</h1>
                  <p className="text-sm text-slate-500">{company.email}</p>
               </div>
               <div className="text-right">
                  <h2 className="text-6xl font-black text-slate-200/80 tracking-tighter">INVOICE</h2>
                  <p className={`text-2xl font-bold ${theme.text}`}>#{data.number}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12">
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Billed To</p>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print:shadow-none print:border-none print:p-0">
                     <p className="text-xl font-bold text-slate-800 mb-2">{data.client.name}</p>
                     <p className="text-slate-500 text-sm">{data.client.address}</p>
                     <p className="text-slate-500 text-sm">{data.client.email}</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center print:shadow-none print:border-slate-200">
                     <p className="text-xs font-bold text-slate-400 uppercase">Issued</p>
                     <p className="text-lg font-bold text-slate-800">{data.date}</p>
                  </div>
                  <div className={`bg-gradient-to-br ${theme.gradient} p-4 rounded-2xl shadow-lg text-white flex flex-col justify-center print:bg-none print:text-slate-900 print:border print:border-slate-200 print:shadow-none`}>
                     <p className="text-xs font-bold text-white/70 uppercase print:text-slate-500">Due Date</p>
                     <p className="text-lg font-bold">{data.dueDate}</p>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-12 print:shadow-none print:rounded-none print:border-x-0 print:border-b-2 print:border-t-2">
               <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider print:bg-slate-100">
                  <div className="col-span-6">Item</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Total</div>
               </div>
               {data.items.map((item, i) => (
                  <div key={item.id} className={`grid grid-cols-12 gap-4 p-5 items-center ${i !== data.items.length - 1 ? 'border-b border-slate-50' : ''}`}>
                     <div className="col-span-6 font-semibold text-slate-700">{item.description}</div>
                     <div className="col-span-2 text-center text-slate-500">{item.quantity}</div>
                     <div className="col-span-2 text-right text-slate-500">{currencyFormatter.format(item.price)}</div>
                     <div className="col-span-2 text-right font-bold text-slate-900">{currencyFormatter.format(item.price * item.quantity)}</div>
                  </div>
               ))}
            </div>

            <div className="flex justify-end mb-12">
               <div className="w-1/2 bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-xl print:shadow-none print:border-slate-200 print:bg-transparent">
                  <div className="flex justify-between mb-3 text-slate-500">
                     <span>Subtotal</span>
                     <span>{currencyFormatter.format(subtotal)}</span>
                  </div>
                  <div className="flex justify-between mb-6 text-slate-500">
                     <span>Tax ({data.taxRate}%)</span>
                     <span>{currencyFormatter.format(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-dashed border-slate-200">
                     <span className="text-slate-400 font-bold uppercase text-sm">Total Due</span>
                     <span className={`text-4xl font-bold ${theme.text}`}>{currencyFormatter.format(total)}</span>
                  </div>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-auto print:mt-8">
               <div>
                  <h4 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wider">Terms</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{data.terms}</p>
               </div>
               <div className="text-right">
                   <p className="text-slate-400 text-xs mb-1">{company.website}</p>
                   <p className="text-slate-400 text-xs">{company.address}</p>
               </div>
            </div>
         </div>
      </div>
    );
  }

  // Template: Glitch (Dark, Cyberpunk)
  if (design.template === 'glitch') {
     return (
        <div className={`${A4_CLASS} bg-[#0a0a0a] text-white ${fontClass} p-12`}>
           <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${theme.gradient}`}></div>
           
           <div className="h-full flex flex-col">
              <div className="flex justify-between items-end border-b border-white/10 pb-8 mb-12">
                  <div>
                    <h1 className="text-5xl font-bold tracking-tighter mb-2">{company.name}</h1>
                    <p className="text-gray-400 font-mono text-sm">{company.taxId}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-4 py-1 rounded-full border border-white/20 text-xs font-mono mb-2 ${theme.text}`}>INVOICE_{data.number}</div>
                    <p className="text-gray-400 text-sm">{data.date}</p>
                  </div>
              </div>

              <div className="grid grid-cols-12 gap-8 mb-16">
                  <div className="col-span-8">
                    <p className="text-gray-500 text-xs font-mono mb-4">/// BILL_TO_CLIENT</p>
                    <h2 className="text-3xl font-bold mb-2">{data.client.name}</h2>
                    <p className="text-gray-400">{data.client.address}</p>
                    <p className="text-gray-400">{data.client.email}</p>
                  </div>
                  <div className="col-span-4 border-l border-white/10 pl-8">
                    <p className="text-gray-500 text-xs font-mono mb-4">/// PAYMENT_DUE</p>
                    <p className={`text-3xl font-bold ${theme.text}`}>{data.dueDate}</p>
                  </div>
              </div>

              <table className="w-full mb-12">
                  <thead>
                    <tr className="border-b border-white/20 text-left text-xs font-mono text-gray-500">
                        <th className="py-4 pl-4">ITEM_DESC</th>
                        <th className="py-4 text-center">QTY</th>
                        <th className="py-4 text-right">UNIT_PRICE</th>
                        <th className="py-4 text-right pr-4">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {data.items.map((item, i) => (
                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 pl-4 font-medium">{item.description}</td>
                          <td className="py-4 text-center text-gray-400 font-mono">{item.quantity}</td>
                          <td className="py-4 text-right text-gray-400 font-mono">{currencyFormatter.format(item.price)}</td>
                          <td className="py-4 text-right pr-4 font-bold">{currencyFormatter.format(item.price * item.quantity)}</td>
                        </tr>
                    ))}
                  </tbody>
              </table>

              <div className="flex justify-end mb-16">
                  <div className="w-80 space-y-2">
                    <div className="flex justify-between text-sm text-gray-400 font-mono">
                        <span>SUBTOTAL</span>
                        <span>{currencyFormatter.format(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 font-mono">
                        <span>TAX_{data.taxRate}%</span>
                        <span>{currencyFormatter.format(taxAmount)}</span>
                    </div>
                    <div className={`flex justify-between text-2xl font-bold border-t border-white/20 pt-4 mt-4 ${theme.text}`}>
                        <span>TOTAL</span>
                        <span>{currencyFormatter.format(total)}</span>
                    </div>
                  </div>
              </div>

              <div className="mt-auto border border-white/10 p-6 rounded-lg bg-white/5">
                  <h4 className="text-xs font-mono text-gray-500 mb-2">/// TERMS_AND_NOTES</h4>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">{data.terms}</p>
                  <p className="text-sm text-gray-400 italic">{data.notes}</p>
              </div>
           </div>
        </div>
     );
  }

  // Template: Classic (Clean, structured, borders)
  if (design.template === 'classic') {
    return (
      <div className={`${A4_CLASS} p-12 shadow-2xl ${fontClass} print:shadow-none flex flex-col`}>
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">{company.name}</h1>
            <div className="text-sm text-slate-500 space-y-1">
              <p>{company.address}</p>
              <p>{company.email} • {company.phone}</p>
              <p>{company.website}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-5xl font-light text-slate-200 uppercase tracking-widest">Invoice</h2>
            <p className={`text-xl font-bold mt-2 ${theme.text}`}>#{data.number}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Bill To</h3>
            <div className="text-slate-800 font-medium">
              <p className="text-lg">{data.client.name}</p>
              <p className="font-normal text-slate-500">{data.client.address}</p>
              <p className="font-normal text-slate-500">{data.client.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Invoice Date</h3>
              <p className="font-medium">{data.date}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Due Date</h3>
              <p className="font-medium">{data.dueDate}</p>
            </div>
             {company.taxId && (
              <div className="col-span-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Tax ID</h3>
                <p className="font-medium">{company.taxId}</p>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className={`text-left text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200`}>
              <th className="pb-3 pl-2">Description</th>
              <th className="pb-3 text-center">Qty</th>
              <th className="pb-3 text-right">Price</th>
              <th className="pb-3 text-right pr-2">Total</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.items.map((item) => (
              <tr key={item.id} className="border-b border-slate-50">
                <td className="py-4 pl-2 font-medium">{item.description}</td>
                <td className="py-4 text-center text-slate-500">{item.quantity}</td>
                <td className="py-4 text-right text-slate-500">{currencyFormatter.format(item.price)}</td>
                <td className="py-4 text-right pr-2 font-medium">{currencyFormatter.format(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-1/2 space-y-3">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span>{currencyFormatter.format(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Tax ({data.taxRate}%)</span>
              <span>{currencyFormatter.format(taxAmount)}</span>
            </div>
            <div className={`flex justify-between text-xl font-bold ${theme.text} pt-4 border-t border-slate-200`}>
              <span>Total</span>
              <span>{currencyFormatter.format(total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-slate-100 pt-8 grid grid-cols-2 gap-8 text-sm mt-auto">
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Terms & Conditions</h4>
            <p className="text-slate-500">{data.terms}</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Notes</h4>
            <p className="text-slate-500">{data.notes}</p>
          </div>
        </div>
      </div>
    );
  }

  // Template: Bold (Heavy color usage)
  if (design.template === 'bold') {
    return (
       <div className={`${A4_CLASS} shadow-2xl ${fontClass} print:shadow-none flex flex-col`}>
         <div className={`${theme.primary} p-12 text-white print:bg-slate-900`}>
            <div className="flex justify-between items-start">
               <div>
                  <h1 className="text-5xl font-bold mb-4">INVOICE</h1>
                  <p className="opacity-80">#{data.number}</p>
               </div>
               <div className="text-right">
                  <h2 className="text-2xl font-bold">{company.name}</h2>
                  <p className="opacity-80 text-sm">{company.email}</p>
               </div>
            </div>
         </div>
         
         <div className="p-12 flex-grow flex flex-col">
            <div className="grid grid-cols-3 gap-8 mb-12">
                <div className="col-span-2">
                    <p className="text-xs uppercase font-bold text-slate-400 mb-2">Billed To</p>
                    <h3 className="text-2xl font-bold text-slate-800">{data.client.name}</h3>
                    <p className="text-slate-500">{data.client.address}</p>
                </div>
                <div className="space-y-4">
                    <div>
                        <p className="text-xs uppercase font-bold text-slate-400">Date Issued</p>
                        <p className="font-medium text-slate-800">{data.date}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase font-bold text-slate-400">Date Due</p>
                        <p className="font-medium text-slate-800">{data.dueDate}</p>
                    </div>
                </div>
            </div>

            <div className="mb-12">
                <div className={`${theme.primary} text-white px-4 py-2 rounded-t-lg flex text-sm font-bold uppercase print:bg-slate-900 print:text-white`}>
                    <div className="flex-grow">Description</div>
                    <div className="w-20 text-center">Qty</div>
                    <div className="w-32 text-right">Price</div>
                    <div className="w-32 text-right">Total</div>
                </div>
                {data.items.map((item, i) => (
                    <div key={item.id} className={`flex px-4 py-4 border-b border-slate-100 ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                        <div className="flex-grow font-medium text-slate-700">{item.description}</div>
                        <div className="w-20 text-center text-slate-500">{item.quantity}</div>
                        <div className="w-32 text-right text-slate-500">{currencyFormatter.format(item.price)}</div>
                        <div className="w-32 text-right font-bold text-slate-700">{currencyFormatter.format(item.price * item.quantity)}</div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <div className={`w-64 ${theme.light} p-6 rounded-xl print:bg-slate-100`}>
                    <div className="flex justify-between mb-2 text-slate-600">
                        <span>Subtotal</span>
                        <span>{currencyFormatter.format(subtotal)}</span>
                    </div>
                     <div className="flex justify-between mb-4 text-slate-600">
                        <span>Tax</span>
                        <span>{currencyFormatter.format(taxAmount)}</span>
                    </div>
                    <div className={`flex justify-between text-xl font-bold ${theme.text} print:text-slate-900`}>
                        <span>Total</span>
                        <span>{currencyFormatter.format(total)}</span>
                    </div>
                </div>
            </div>
            
            <div className="mt-auto pt-12">
                 <div className="grid grid-cols-2 gap-8 bg-slate-50 p-6 rounded-lg print:bg-slate-100">
                     <div>
                        <h4 className="font-bold text-slate-800 mb-2">Payment Terms</h4>
                        <p className="text-sm text-slate-500">{data.terms}</p>
                     </div>
                      <div className="text-right">
                        <h4 className="font-bold text-slate-800 mb-2">Thank you</h4>
                        <p className="text-sm text-slate-500">{data.notes}</p>
                     </div>
                 </div>
             </div>
         </div>
       </div>
    );
  }

  // Template: Modern (Material 3 inspired, cards, rounded)
  return (
    <div className={`${A4_CLASS} p-12 shadow-2xl ${fontClass} print:shadow-none flex flex-col`}>
      {/* Top Card */}
      <div className={`${theme.light} p-8 rounded-3xl mb-8 flex justify-between items-center print:border print:border-slate-200 print:bg-slate-50`}>
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 ${theme.primary} rounded-full flex items-center justify-center text-white font-bold text-xl print:text-white print:bg-slate-900`}>
                 {company.name.charAt(0)}
              </div>
              <h1 className="text-2xl font-bold text-slate-800">{company.name}</h1>
           </div>
           <p className="text-slate-500 text-sm max-w-xs">{company.address}</p>
        </div>
        <div className="text-right">
            <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Total Due</p>
            <h2 className={`text-4xl font-bold ${theme.text}`}>{currencyFormatter.format(total)}</h2>
            <p className="text-slate-400 text-sm mt-2">Inv #{data.number}</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 mb-12">
        <div className="col-span-7">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Bill To</h3>
            <div className="border-l-4 border-slate-100 pl-4">
                <p className="text-xl font-medium text-slate-900 mb-1">{data.client.name}</p>
                <p className="text-slate-500">{data.client.email}</p>
                <p className="text-slate-500">{data.client.address}</p>
            </div>
        </div>
        <div className="col-span-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Issued</span>
                <span className="font-bold text-slate-700">{data.date}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-medium">Due</span>
                <span className="font-bold text-slate-700">{data.dueDate}</span>
            </div>
        </div>
      </div>

      {/* Items */}
      <div className="mb-8">
        <div className="flex text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-4">
            <div className="flex-grow">Item Description</div>
            <div className="w-24 text-center">Qty</div>
            <div className="w-32 text-right">Price</div>
            <div className="w-32 text-right">Total</div>
        </div>
        <div className="space-y-2">
            {data.items.map((item) => (
                <div key={item.id} className="flex items-center bg-slate-50 rounded-2xl px-6 py-4 print:border print:border-slate-100">
                    <div className="flex-grow font-semibold text-slate-700">{item.description}</div>
                    <div className="w-24 text-center text-slate-500">{item.quantity}</div>
                    <div className="w-32 text-right text-slate-500">{currencyFormatter.format(item.price)}</div>
                    <div className="w-32 text-right font-bold text-slate-800">{currencyFormatter.format(item.price * item.quantity)}</div>
                </div>
            ))}
        </div>
      </div>

      {/* Summary */}
      <div className="flex justify-end mb-16">
          <div className="w-80">
            <div className="flex justify-between py-2 text-slate-500">
                <span>Subtotal</span>
                <span>{currencyFormatter.format(subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 text-slate-500 border-b border-slate-100 mb-2">
                <span>Tax ({data.taxRate}%)</span>
                <span>{currencyFormatter.format(taxAmount)}</span>
            </div>
            <div className={`flex justify-between py-2 text-xl font-bold ${theme.text}`}>
                <span>Total</span>
                <span>{currencyFormatter.format(total)}</span>
            </div>
          </div>
      </div>

      <div className="grid grid-cols-2 gap-8 text-sm bg-slate-50 p-6 rounded-2xl print:bg-slate-50 mt-auto">
         <div>
            <h4 className={`font-bold ${theme.text} mb-2`}>Terms & Conditions</h4>
            <p className="text-slate-600 leading-relaxed">{data.terms}</p>
         </div>
         <div>
            <h4 className={`font-bold ${theme.text} mb-2`}>Note</h4>
            <p className="text-slate-600 leading-relaxed">{data.notes}</p>
         </div>
      </div>
    </div>
  );
};