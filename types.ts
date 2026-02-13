
export type Language = 'en' | 'bn';

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  uniqueKey: string;
}

export interface SavedInvoice {
  id: string;
  cart: CartItem[];
  deliveryCharge: number | '';
  advancePayment: number | '';
  discount: number | '';
  subtotal: number;
  payableAmount: number;
  balanceDue: number;
  date: string;
  time: string;
}

export interface InvoiceData {
  items: CartItem[];
  deliveryCharge: number;
  discount: number;
  advancePayment: number;
  subtotal: number;
  payableAmount: number;
  balanceDue: number;
  date: string;
  time: string;
  invoiceNumber: string;
}
