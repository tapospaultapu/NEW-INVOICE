
import React, { useState, useMemo, useEffect } from 'react';
import { Product, CartItem, Language, SavedInvoice } from './types.ts';
import { 
  PlusIcon, 
  MinusIcon,
  TrashIcon, 
  Cog6ToothIcon, 
  XMarkIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  LanguageIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  EllipsisVerticalIcon,
  ClockIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'মাটির ফুলদানী (Vase A)', price: 100 },
  { id: '2', name: 'পোড়ামাটির ল্যাম্প (Lamp B)', price: 250 },
  { id: '3', name: 'মাটির থালা (Plate C)', price: 150 },
  { id: '4', name: 'কারুশিল্পের বাটি (Bowl D)', price: 500 },
];

const translations = {
  en: {
    appName: "Mati & Mritshilpo",
    tagline: "A Trusted Organization",
    addProducts: "Add Products",
    addNewProduct: "Add New Product",
    manageList: "Manage List",
    productName: "Product Name",
    price: "Price",
    saveProduct: "Save Product",
    selectProduct: "Select a product to add...",
    currentCart: "Current Cart",
    cartEmpty: "Your cart is empty",
    deliveryCharge: "Delivery Charge",
    discount: "Discount",
    advancePayment: "Advance Payment",
    subtotal: "Subtotal",
    payable: "Payable",
    advance: "Advance",
    balanceDue: "Balance Due",
    createInvoice: "Create Invoice",
    clearAll: "Clear All",
    invoice: "INVOICE",
    description: "Description",
    qty: "Qty",
    unitPrice: "Price",
    total: "Total",
    thankYou: "Thank you for your trust in our craftsmanship.",
    printPdf: "Print or Save as PDF",
    copyDetails: "Copy for Messenger",
    copied: "Copied!",
    manageTitle: "Manage Product List",
    done: "Done",
    currency: "৳",
    alertEmpty: "Please add at least one product to create an invoice.",
    each: "each",
    dateLabel: "Date",
    timeLabel: "Time",
    history: "Invoice History",
    noHistory: "No history found",
    load: "Edit",
    paymentNote: (adv: number, bal: number) => `${adv} Taka bKash to confirm order. Remaining ${bal} Taka to be paid to delivery man. Note: We do not have full Cash-on-Delivery.`
  },
  bn: {
    appName: "মাটি ও মৃতশিল্প",
    tagline: "একটি বিশ্বস্ত প্রতিষ্ঠান",
    addProducts: "পণ্য যোগ করুন",
    addNewProduct: "নতুন পণ্য যোগ",
    manageList: "তালিকা ব্যবস্থাপনা",
    productName: "পণ্যের নাম",
    price: "মূল্য",
    saveProduct: "পণ্য সংরক্ষণ করুন",
    selectProduct: "পণ্য নির্বাচন করুন...",
    currentCart: "বর্তমান কার্ট",
    cartEmpty: "আপনার কার্ট খালি",
    deliveryCharge: "ডেলিভারি চার্জ",
    discount: "ডিসকাউন্ট",
    advancePayment: "অগ্রিম পেমেন্ট",
    subtotal: "সাবটোটাল",
    payable: "মোট প্রদেয়",
    advance: "অগ্রিম",
    balanceDue: "বকেয়া",
    createInvoice: "ইনভয়েস তৈরি করুন",
    clearAll: "সব মুছে ফেলুন",
    invoice: "ইনভয়েস",
    description: "বিবরণ",
    qty: "পরিমাণ",
    unitPrice: "মূল্য",
    total: "মোট",
    thankYou: "আমাদের কারুশিল্পের উপর আস্থা রাখার জন্য আপনাকে ধন্যবাদ।",
    printPdf: "প্রিন্ট বা পিডিএফ সেভ করুন",
    copyDetails: "মেসেঞ্জারের জন্য কপি করুন",
    copied: "কপি হয়েছে!",
    manageTitle: "পণ্যের তালিকা পরিবর্তন করুন",
    done: "সম্পন্ন",
    currency: "৳",
    alertEmpty: "ইনভয়েস তৈরি করতে দয়া করে অন্তত একটি পণ্য যোগ করুন।",
    each: "প্রতিটি",
    dateLabel: "তারিখ",
    timeLabel: "সময়",
    history: "পুরানো ইনভয়েস",
    noHistory: "কোন ইতিহাস পাওয়া যায়নি",
    load: "এডিট করুন",
    paymentNote: (adv: number, bal: number) => `${adv} টাকা বিকাশ করে অর্ডার কনফার্ম করবেন। বাকি ${bal} টাকা, পন্য হাতে পেয়ে ডেলিভারি ম্যান/কুরিয়ারকে দেবেন।\nবিঃদ্রঃ আমাদের সম্পুর্ণ ক্যাশ-অন ডেলিভারি সিষ্টেম নেই।`
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('bn');
  const t = translations[lang];
  
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mm_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch { return INITIAL_PRODUCTS; }
  });
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryCharge, setDeliveryCharge] = useState<number | ''>('');
  const [advancePayment, setAdvancePayment] = useState<number | ''>('');
  const [discount, setDiscount] = useState<number | ''>('');
  const [showInvoice, setShowInvoice] = useState<boolean>(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState<boolean>(false);
  const [isAddingNewProduct, setIsAddingNewProduct] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  
  const [history, setHistory] = useState<SavedInvoice[]>(() => {
    try {
      const saved = localStorage.getItem('mm_history');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState<number | ''>('');
  const [invoiceTimestamp, setInvoiceTimestamp] = useState<{date: string, time: string} | null>(null);

  useEffect(() => {
    localStorage.setItem('mm_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mm_history', JSON.stringify(history));
  }, [history]);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);
  const numDelivery = Number(deliveryCharge) || 0;
  const numDiscount = Number(discount) || 0;
  const numAdvance = Number(advancePayment) || 0;
  const payableAmount = subtotal + numDelivery - numDiscount;
  const balanceDue = payableAmount - numAdvance;

  const handleAddProductToCart = (productId: string) => {
    if (!productId) return;
    setCart(prev => {
      const existingItemIndex = prev.findIndex(item => item.productId === productId);
      if (existingItemIndex > -1) {
        const updatedCart = [...prev];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
        return updatedCart;
      } else {
        const product = products.find(p => p.id === productId);
        if (product) {
          const newItem: CartItem = {
            ...product,
            productId: product.id,
            quantity: 1,
            uniqueKey: Math.random().toString(36).substr(2, 9)
          };
          return [...prev, newItem];
        }
        return prev;
      }
    });
  };

  const handleUpdateQuantity = (uniqueKey: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.uniqueKey === uniqueKey) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (uniqueKey: string) => {
    setCart(prev => prev.filter(item => item.uniqueKey !== uniqueKey));
  };

  const handleAddNewProduct = () => {
    if (newName && newPrice !== '') {
      const newProduct: Product = { id: Math.random().toString(36).substr(2, 9), name: newName, price: Number(newPrice) };
      setProducts(prev => [...prev, newProduct]);
      setNewName(''); setNewPrice(''); setIsAddingNewProduct(false);
    }
  };

  const handleRemoveProductFromList = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  const handleClearAll = () => {
    setCart([]); setDeliveryCharge(''); setAdvancePayment(''); setDiscount('');
    setShowInvoice(false); setInvoiceTimestamp(null);
  };

  const handleCreateInvoice = () => {
    if (cart.length === 0) { alert(t.alertEmpty); return; }
    const now = new Date();
    const dateStr = now.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { dateStyle: 'long' });
    const timeStr = now.toLocaleTimeString(lang === 'bn' ? 'bn-BD' : 'en-US', { timeStyle: 'short' });
    setInvoiceTimestamp({ date: dateStr, time: timeStr });
    
    const newSavedInvoice: SavedInvoice = {
      id: Math.random().toString(36).substr(2, 9),
      cart, deliveryCharge, advancePayment, discount, subtotal, payableAmount, balanceDue, date: dateStr, time: timeStr
    };
    setHistory(prev => [newSavedInvoice, ...prev].slice(0, 10));
    setShowInvoice(true);
    setTimeout(() => document.getElementById('invoice-preview')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleLoadFromHistory = (inv: SavedInvoice) => {
    setCart(inv.cart); setDeliveryCharge(inv.deliveryCharge); setAdvancePayment(inv.advancePayment); setDiscount(inv.discount);
    setInvoiceTimestamp({ date: inv.date, time: inv.time });
    setShowInvoice(true); setIsHistoryOpen(false);
    setTimeout(() => document.getElementById('invoice-preview')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleCopyToClipboard = async () => {
    if (!invoiceTimestamp) return;
    let text = `${t.invoice} - ${t.dateLabel}: ${invoiceTimestamp.date}\n${t.timeLabel}: ${invoiceTimestamp.time}\n\n${t.description}:\n`;
    cart.forEach(item => text += `- ${item.name} (${item.quantity} x ${item.price.toFixed(2)}) = ${t.currency}${(item.price * item.quantity).toFixed(2)}\n`);
    text += `\n${t.subtotal}: ${t.currency}${subtotal.toFixed(2)}\n`;
    if (numDelivery > 0) text += `${t.deliveryCharge}: +${t.currency}${numDelivery.toFixed(2)}\n`;
    if (numDiscount > 0) text += `${t.discount}: -${t.currency}${numDiscount.toFixed(2)}\n`;
    text += `---------------------------\n${t.payable}: ${t.currency}${payableAmount.toFixed(2)}\n${t.advance}: -${t.currency}${numAdvance.toFixed(2)}\n${t.balanceDue}: ${t.currency}${balanceDue.toFixed(2)}\n\n${t.paymentNote(numAdvance, balanceDue)}`;
    try { await navigator.clipboard.writeText(text); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); } catch {}
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="relative text-center space-y-1">
          <div className="absolute left-0 top-0 no-print">
            <button onClick={() => setIsHistoryOpen(!isHistoryOpen)} className="p-2 text-gray-500 hover:text-teal-600 hover:bg-white rounded-full transition-all border border-transparent hover:border-gray-100 shadow-sm">
              <EllipsisVerticalIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute right-0 top-0 no-print">
            <button onClick={() => setLang(prev => prev === 'en' ? 'bn' : 'en')} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all text-sm font-bold text-teal-800">
              <LanguageIcon className="w-5 h-5 text-teal-600" />
              {lang === 'en' ? 'বাংলা' : 'English'}
            </button>
          </div>
          <h1 className="text-4xl font-bold text-teal-800 tracking-tight">{t.appName}</h1>
          <p className="text-teal-600/70 text-sm font-medium">{t.tagline}</p>

          {/* History Dropdown */}
          {isHistoryOpen && (
            <div className="absolute left-0 top-12 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 animate-in slide-in-from-left-4 text-left no-print">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50">
                <h3 className="font-bold text-teal-800 flex items-center gap-2"><ClockIcon className="w-5 h-5" /> {t.history}</h3>
                <button onClick={() => setIsHistoryOpen(false)} className="text-gray-400 p-1"><XMarkIcon className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {history.length === 0 ? <p className="text-xs text-gray-400 text-center py-4">{t.noHistory}</p> : 
                  history.map(inv => (
                    <div key={inv.id} className="group relative bg-gray-50 hover:bg-teal-50 rounded-xl p-3 transition-colors border border-gray-100">
                      <div className="text-[10px] text-gray-400 flex items-center justify-between mb-1 italic"><span>{inv.date}</span><span>{inv.time}</span></div>
                      <div className="flex justify-between items-center"><span className="text-sm font-bold text-gray-700">{t.currency}{inv.balanceDue.toFixed(0)} {t.balanceDue}</span>
                        <button onClick={() => handleLoadFromHistory(inv)} className="text-xs bg-white text-teal-600 px-2 py-1 rounded-lg border border-teal-100 font-bold hover:bg-teal-600 hover:text-white transition-all shadow-sm flex items-center gap-1"><PencilSquareIcon className="w-3 h-3" /> {t.load}</button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </header>

        {/* Product Selection */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 no-print">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2"><PlusIcon className="w-5 h-5 text-teal-600" />{t.addProducts}</h2>
            <div className="flex gap-2">
              <button onClick={() => setIsAddingNewProduct(!isAddingNewProduct)} className="p-2 text-teal-600 hover:bg-teal-50 rounded-full transition-colors"><PlusIcon className="w-6 h-6" /></button>
              <button onClick={() => setIsManageModalOpen(true)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"><Cog6ToothIcon className="w-6 h-6" /></button>
            </div>
          </div>

          {isAddingNewProduct && (
            <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-100 animate-in slide-in-from-top-2 grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="text" placeholder={t.productName} className="px-3 py-2 rounded border border-teal-200 text-sm" value={newName} onChange={e => setNewName(e.target.value)} />
              <input type="number" placeholder={t.price} className="px-3 py-2 rounded border border-teal-200 text-sm" value={newPrice} onChange={e => setNewPrice(e.target.value === '' ? '' : Number(e.target.value))} />
              <button onClick={handleAddNewProduct} className="bg-teal-600 text-white px-4 py-2 rounded text-sm font-medium">{t.saveProduct}</button>
            </div>
          )}

          <select className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 font-medium" onChange={e => { handleAddProductToCart(e.target.value); e.target.value = ""; }} value="">
            <option value="" disabled>{t.selectProduct}</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name} — {t.currency}{p.price.toFixed(2)}</option>)}
          </select>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{t.currentCart}</h3>
            <div className="max-h-[500px] overflow-y-auto border-2 border-dashed border-gray-100 rounded-lg p-2 bg-gray-50/50 custom-scrollbar">
              {cart.length === 0 ? <p className="text-center text-gray-400 py-8 italic text-sm">{t.cartEmpty}</p> : (
                <ul className="space-y-2">
                  {cart.map(item => (
                    <li key={item.uniqueKey} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white px-3 py-2.5 rounded-lg border border-gray-200 shadow-sm animate-in fade-in gap-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <span className="font-semibold text-gray-800 block text-sm leading-tight break-words">{item.name}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{t.currency}{item.price.toFixed(2)} {t.each}</span>
                      </div>
                      <div className="flex items-center justify-between w-full sm:w-auto gap-4 flex-shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                        <div className="flex items-center gap-1.5 bg-gray-50 rounded-md border border-gray-200 p-0.5">
                          <button onClick={() => handleUpdateQuantity(item.uniqueKey, -1)} className="p-1 hover:bg-white rounded" disabled={item.quantity <= 1}><MinusIcon className="w-4 h-4" /></button>
                          <span className="w-6 text-center font-bold text-teal-800 text-sm">{item.quantity}</span>
                          <button onClick={() => handleUpdateQuantity(item.uniqueKey, 1)} className="p-1 hover:bg-white rounded"><PlusIcon className="w-4 h-4" /></button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-teal-700 font-bold text-base min-w-[70px] text-right">{t.currency}{(item.price * item.quantity).toFixed(2)}</span>
                          <button onClick={() => handleRemoveFromCart(item.uniqueKey)} className="text-red-300 hover:text-red-500 p-1.5"><XMarkIcon className="w-5 h-5" /></button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* Inputs & Summary */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 no-print">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-1.5"><label className="text-sm font-semibold text-gray-600">{t.deliveryCharge}</label>
              <input type="number" placeholder="0.00" className="w-full px-4 py-3 rounded-lg border border-gray-200" value={deliveryCharge} onChange={e => setDeliveryCharge(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
            <div className="space-y-1.5"><label className="text-sm font-semibold text-gray-600">{t.advancePayment}</label>
              <input type="number" placeholder="0.00" className="w-full px-4 py-3 rounded-lg border border-gray-200" value={advancePayment} onChange={e => setAdvancePayment(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
            <div className="space-y-1.5"><label className="text-sm font-semibold text-gray-600">{t.discount}</label>
              <input type="number" placeholder="0.00" className="w-full px-4 py-3 rounded-lg border border-gray-200" value={discount} onChange={e => setDiscount(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
          </div>
          <div className="bg-teal-800 text-white rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div><span className="text-teal-200 text-xs font-bold uppercase">{t.subtotal}</span><p className="text-2xl font-bold">{t.currency}{subtotal.toFixed(2)}</p></div>
            <div><span className="text-teal-200 text-xs font-bold uppercase">{t.payable}</span><p className="text-2xl font-bold">{t.currency}{payableAmount.toFixed(2)}</p></div>
            <div><span className="text-teal-200 text-xs font-bold uppercase">{t.advance}</span><p className="text-2xl font-bold">{t.currency}{numAdvance.toFixed(2)}</p></div>
            <div className="border-t md:border-t-0 md:border-l border-teal-700/50 pt-4 md:pt-0 md:pl-6"><span className="text-teal-200 text-xs font-bold uppercase">{t.balanceDue}</span><p className="text-2xl font-bold text-teal-300 underline">{t.currency}{balanceDue.toFixed(2)}</p></div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 no-print action-buttons">
          <button onClick={handleCreateInvoice} className="flex-1 bg-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-700 shadow-md flex items-center justify-center gap-2"><DocumentTextIcon className="w-6 h-6" />{t.createInvoice}</button>
          <button onClick={handleClearAll} className="md:w-48 bg-gray-100 text-gray-500 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 flex items-center justify-center gap-2"><ArrowPathIcon className="w-6 h-6" />{t.clearAll}</button>
        </div>

        {/* Invoice Preview */}
        {showInvoice && invoiceTimestamp && (
          <div id="invoice-preview" className="animate-in fade-in zoom-in-95 duration-500 pb-20 print:p-0">
            <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-xl p-8 max-w-2xl mx-auto relative overflow-hidden print:shadow-none print:border-none print:max-w-none">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-teal-600 print:hidden"></div>
              <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
                <div><h2 className="text-3xl font-black text-teal-900 uppercase tracking-widest">{t.invoice}</h2><p className="text-gray-400 font-mono text-sm mt-1">#INV-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p></div>
                <div className="text-right"><h3 className="text-xl font-bold text-teal-800">{t.appName}</h3><p className="text-sm text-gray-500">{t.tagline}</p>
                  <div className="text-xs text-gray-400 mt-2 italic"><span>{invoiceTimestamp.date}</span><br/><span>{invoiceTimestamp.time}</span></div>
                </div>
              </div>
              <table className="w-full text-left border-collapse mb-8">
                <thead><tr className="border-b-2 border-gray-100"><th className="py-4 text-xs font-bold text-gray-400 uppercase">{t.description}</th><th className="py-4 text-center text-xs font-bold text-gray-400 uppercase">{t.qty}</th><th className="py-4 text-right text-xs font-bold text-gray-400 uppercase">{t.total}</th></tr></thead>
                <tbody>{cart.map((item, idx) => (<tr key={idx} className="border-b border-gray-50"><td className="py-4 font-medium text-gray-800">{item.name}</td><td className="py-4 text-center text-gray-600 font-medium">{item.quantity}</td><td className="py-4 text-right font-bold text-teal-800">{t.currency}{(item.price * item.quantity).toFixed(2)}</td></tr>))}</tbody>
              </table>
              <div className="flex justify-end"><div className="w-full md:w-64 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-gray-500">{t.subtotal}</span><span className="font-semibold text-gray-800">{t.currency}{subtotal.toFixed(2)}</span></div>
                {numDelivery > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">{t.deliveryCharge}</span><span className="font-semibold text-gray-800">+{t.currency}{numDelivery.toFixed(2)}</span></div>}
                {numDiscount > 0 && <div className="flex justify-between text-sm text-red-500"><span>{t.discount}</span><span className="font-semibold">-{t.currency}{numDiscount.toFixed(2)}</span></div>}
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center"><span className="font-bold text-gray-800">{t.payable}</span><span className="font-black text-xl text-teal-700">{t.currency}{payableAmount.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm italic text-gray-500"><span>{t.advancePayment}</span><span>-{t.currency}{numAdvance.toFixed(2)}</span></div>
                <div className="bg-teal-50 p-4 rounded-xl flex justify-between items-center mt-6 print:bg-gray-100"><span className="font-bold text-teal-800">{t.balanceDue}</span><span className="font-black text-2xl text-teal-900">{t.currency}{balanceDue.toFixed(2)}</span></div>
              </div></div>
              <div className="mt-12 text-center border-t border-gray-50 pt-6">
                <p className="text-sm text-gray-400 font-medium mb-6 italic">{t.thankYou}</p>
                <div className="flex flex-col gap-3 no-print">
                   <button onClick={() => window.print()} className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-teal-700 shadow-sm flex items-center justify-center gap-2"><DocumentTextIcon className="w-5 h-5" />{t.printPdf}</button>
                   <button onClick={handleCopyToClipboard} className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isCopied ? 'bg-green-100 text-green-700' : 'bg-teal-50 text-teal-700'}`}>{isCopied ? <CheckIcon className="w-5 h-5" /> : <ClipboardDocumentIcon className="w-5 h-5" />}{isCopied ? t.copied : t.copyDetails}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manage Modal */}
        {isManageModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between"><h3 className="font-bold text-lg text-gray-800">{t.manageTitle}</h3><button onClick={() => setIsManageModalOpen(false)} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button></div>
              <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <ul className="divide-y divide-gray-100">{products.map(p => (<li key={p.id} className="py-3 flex items-center justify-between"><div><p className="font-medium text-gray-800">{p.name}</p><p className="text-xs text-gray-500">{t.currency}{p.price.toFixed(2)}</p></div><button onClick={() => handleRemoveProductFromList(p.id)} className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50"><TrashIcon className="w-5 h-5" /></button></li>))}</ul>
              </div>
              <div className="p-6 bg-gray-50"><button onClick={() => setIsManageModalOpen(false)} className="w-full bg-teal-800 text-white py-3 rounded-xl font-bold">{t.done}</button></div>
            </div>
          </div>
        )}
      </div>
      <footer className="text-center mt-12 py-8 text-gray-400 text-xs no-print">&copy; {new Date().getFullYear()} {t.appName}. All rights reserved.</footer>
    </div>
  );
};

export default App;
