export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface CompanyDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  logoUrl?: string;
  website?: string;
  taxId?: string;
}

export interface ClientDetails {
  name: string;
  email: string;
  address: string;
}

export interface InvoiceData {
  number: string;
  date: string;
  dueDate: string;
  items: LineItem[];
  client: ClientDetails;
  notes: string;
  terms: string;
  currency: string;
  taxRate: number;
}

export type TemplateType = 'modern' | 'classic' | 'bold' | 'neo' | 'glitch';
export type ColorTheme = 'purple' | 'blue' | 'emerald' | 'rose' | 'slate' | 'orange';

export interface DesignSettings {
  template: TemplateType;
  colorTheme: ColorTheme;
  font: 'sans' | 'outfit' | 'space';
}

export interface AppState {
  company: CompanyDetails;
  invoice: InvoiceData;
  design: DesignSettings;
}