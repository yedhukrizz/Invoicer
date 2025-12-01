import { AppState, CompanyDetails, DesignSettings, InvoiceData } from '../types';

const STORAGE_KEY = 'invoice_genius_v1';

const defaultCompany: CompanyDetails = {
  name: 'Acme Corp',
  email: 'hello@acmecorp.com',
  phone: '+1 (555) 123-4567',
  address: '123 Innovation Dr, Tech City, TC 90210',
  website: 'www.acmecorp.com'
};

const defaultInvoice: InvoiceData = {
  number: 'INV-001',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  items: [
    { id: '1', description: 'Web Development Services', quantity: 10, price: 150 },
    { id: '2', description: 'UI/UX Design Phase', quantity: 5, price: 125 },
  ],
  client: {
    name: 'Globex Corporation',
    email: 'accounts@globex.com',
    address: '456 Business Rd, Enterprise City, EC 54321'
  },
  notes: 'Thank you for your business!',
  terms: 'Payment is due within 14 days.',
  currency: 'USD',
  taxRate: 10
};

const defaultDesign: DesignSettings = {
  template: 'modern',
  colorTheme: 'purple',
  font: 'sans'
};

export const getInitialState = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure new fields are present
      return {
        company: { ...defaultCompany, ...parsed.company },
        invoice: { ...defaultInvoice, ...parsed.invoice },
        design: { ...defaultDesign, ...parsed.design }
      };
    }
  } catch (e) {
    console.warn('Failed to load state', e);
  }
  return {
    company: defaultCompany,
    invoice: defaultInvoice,
    design: defaultDesign
  };
};

export const saveState = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state', e);
  }
};