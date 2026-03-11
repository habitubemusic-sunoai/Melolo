// @ts-nocheck
"use client";

import Image from "next/image";
import { usePlatform } from "@/hooks/usePlatform";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ArrowRight, Clock, Play, ChevronLeft } from "lucide-react";

export function PlatformSelector() {
  const { currentPlatform, setPlatform, platforms } = usePlatform();
  const [walletIndex, setWalletIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);

  // State Keuangan
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('tarik');
  const [selectedMethod, setSelectedMethod] = useState('DANA');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    setIsMounted(true);
    const savedBal = localStorage.getItem('habi_balance');
    if (savedBal) setBalance(Number(savedBal));
    const savedHist = localStorage.getItem('habi_history');
    if (savedHist) setHistory(JSON.parse(savedHist));

    const interval = setInterval(() => {
      const cur = localStorage.getItem('habi_balance');
      if (cur) setBalance(Number(cur));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const wallets = [
    { name: "DANA", icon: "Rp", color: "bg-blue-500", text: "DANA" },
    { name: "GoPay", icon: "G", color: "bg-green-600", text: "GoPay" },
    { name: "ShopeePay", icon: "S", color: "bg-orange-500", text: "ShopeePay" }
  ];

  useEffect(() => {
    const int = setInterval(() => setWalletIndex(p => (p + 1) % wallets.length), 2000);
    return () => clearInterval(int);
  }, []);

  // Buka Layar Penuh & Picu Ledakan Uang
  const openWithdraw = () => {
    setShowModal(true);
    setShowExplosion(true);
    setTimeout(() => setShowExplosion(false), 4000); // Hilang dlm 4 dtk
  };

  const handleWithdraw = () => {
    if (balance < 100000) return alert("⚠️ Saldo belum mencukupi!\nMinimal pencairan Rp 100.000.");
    if (!accountNumber || accountNumber.length < 8) return alert("⚠️ Masukkan Nomor Rekening/E-Wallet valid!");

    const newBal = balance - 100000;
    setBalance(newBal);
    localStorage.setItem('habi_balance', newBal.toString());

    const newRecord = { id: Date.now(), amount: 100000, method: selectedMethod, account: accountNumber, timestamp: Date.now() };
    const newHist = [newRecord, ...history];
    setHistory(newHist);
    localStorage.setItem('habi_history', JSON.stringify(newHist));

    window.dispatchEvent(new CustomEvent('habi_withdraw_event', { detail: newRecord }));
    setAccountNumber('');
    setActiveTab('riwayat');
  };

  // Status Pencairan Waktu Nyata
  const getStatus = (ts) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return { text: "Pending", color: "text-yellow-600 bg-yellow-100 border-yellow-200" };
    if (diff < 86400000) return { text: "Diproses", color: "text-blue-600 bg-blue-100 border-blue-200" };
    return { text: "Berhasil Cair", color: "text-green-600 bg-green-100 border-green-200" };
  };

  const activeWallet = wallets[walletIndex];

  return (
    <div className="w-full pt-4 pb-2 px-4 bg-white border-b border-gray-100">
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style dangerouslySetInnerHTML={{__html: `.overflow-x-auto::-webkit-scrollbar { display: none; }`}} />
        
        {/* Tombol Cairkan Dana (Menu Utama) */}
        <button onClick={openWithdraw} className="relative flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0 border bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400 shadow-sm hover:scale-105">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-colors duration-500 ${activeWallet.color}`}>{activeWallet.icon}</div>
          <span className="font-bold text-[13px] text-yellow-700 whitespace-nowrap">Cairkan Dana</span>
        </button>

        <div className="w-[1px] h-6 bg-gray-300 mx-1 flex-shrink-0"></div>

        {platforms.map((p) => (
          <button key={p.id} onClick={() => setPlatform(p.id)} className={`relative flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0 transition-all border ${currentPlatform === p.id ? "bg-gray-900 border-gray-900 text-white shadow-md transform scale-[1.02]" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"}`}>
            <div className="relative w-5 h-5 rounded-full overflow-hidden bg-white flex-shrink-0 shadow-sm"><Image src={p.logo} alt={p.name} fill className="object-cover" sizes="20px" /></div>
            <span className="font-semibold text-[13px] whitespace-nowrap">{p.name}</span>
          </button>
        ))}
      </div>

      {/* ANIMASI UANG KHUSUS DASHBOARD */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dashFall { 0% { transform: translateY(-50px) scale(1) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) scale(1.5) rotate(720deg); opacity: 0; } }
        .dash-money { position: absolute; font-size: 24px; font-weight: 900; z-index: 999999; animation: dashFall 3s linear forwards; text-shadow: 0 4px 6px rgba(0,0,0,0.3); }
      `}} />

      {/* DASHBOARD FULL SCREEN TIKTOK STYLE */}
      {isMounted && showModal && createPortal(
        <div className="fixed inset-0 z-[99999] bg-gray-50 flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-300 overflow-hidden">
          
          {/* Efek Ledakan Uang (Hanya saat buka/refresh layar ini) */}
          {showExplosion && Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="dash-money" style={{ left: `${Math.random() * 100}vw`, animationDelay: `${Math.random() * 0.5}s`, color: i%2===0?'#16a34a':'#eab308' }}>
              {i % 3 === 0 ? '💸' : i % 3 === 1 ? '🪙' : 'Rp'}
            </div>
          ))}

          {/* Header Fullscreen */}
          <div className="bg-white border-b border-gray-200 px-4 pt-4 pb-0 shadow-sm z-10 relative">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setShowModal(false)} className="p-2 -ml-2 rounded-full hover:bg-gray-100"><ChevronLeft className="w-6 h-6 text-gray-800" /></button>
              
              {/* Logo Habi Music Kecil */}
              <div className="flex items-center gap-1">
                <div className="w-[20px] h-[14px] rounded-[3px] bg-[#FF0000] flex items-center justify-center"><Play className="w-2 h-2 text-white fill-white ml-0.5" /></div>
                <span className="font-sans font-bold text-[14px] tracking-tight text-black">Habi Music</span>
              </div>
              
              <div className="w-8"></div>
            </div>
            
            <div className="flex w-full">
              <button onClick={() => setActiveTab('tarik')} className={`flex-1 py-3 text-sm font-bold border-b-[3px] transition-colors ${activeTab === 'tarik' ? 'border-[#FF0000] text-[#FF0000]' : 'border-transparent text-gray-500'}`}>Tarik Saldo</button>
              <button onClick={() => setActiveTab('riwayat')} className={`flex-1 py-3 text-sm font-bold border-b-[3px] transition-colors ${activeTab === 'riwayat' ? 'border-[#FF0000] text-[#FF0000]' : 'border-transparent text-gray-500'}`}>Riwayat</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:px-8 max-w-2xl mx-auto w-full">
            
            {activeTab === 'tarik' && (
              <div className="animate-in fade-in slide-in-from-left-4">
                {/* Kartu Saldo Utama */}
                <div className="bg-gradient-to-br from-red-600 to-red-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden mb-6">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <p className="text-sm font-medium opacity-90 mb-1">Saldo Hasil Nonton</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[42px] font-black tracking-tighter">Rp {balance.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="mt-4 bg-white/20 px-3 py-1.5 rounded-full inline-block text-xs font-bold backdrop-blur-sm border border-white/20">
                    Minimal Penarikan Rp 100.000
                  </div>
                </div>

                <h3 className="font-bold text-gray-800 mb-3 px-1 text-sm">Metode Penarikan</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                  {wallets.map((w) => (
                    <div key={w.name} onClick={() => setSelectedMethod(w.text)} className={`p-4 flex items-center justify-between cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${selectedMethod === w.text ? 'bg-red-50/40' : 'hover:bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${w.color} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>{w.icon}</div>
                        <span className="font-bold text-gray-800 text-sm">{w.text}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedMethod === w.text ? 'border-[#FF0000]' : 'border-gray-300'}`}>
                        {selectedMethod === w.text && <div className="w-2.5 h-2.5 bg-[#FF0000] rounded-full"></div>}
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="font-bold text-gray-800 mb-3 px-1 text-sm">Nomor Tujuan ({selectedMethod})</h3>
                <div className="mb-8">
                  <input type="number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Contoh: 08123456789" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-base font-bold text-gray-800 outline-none focus:border-[#FF0000] focus:ring-2 focus:ring-red-100 transition-all shadow-sm placeholder:font-medium placeholder:text-gray-400" />
                </div>

                <button onClick={handleWithdraw} className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md text-base ${balance >= 100000 ? 'bg-[#FF0000] text-white hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                  Tarik Uang Sekarang <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {activeTab === 'riwayat' && (
              <div className="animate-in fade-in slide-in-from-right-4">
                {history.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                    <Clock className="w-16 h-16 mb-4 opacity-20" />
                    <p className="font-bold text-gray-500">Belum ada riwayat</p>
                    <p className="text-xs mt-1 text-center">Tonton video dan kumpulkan saldo untuk ditarik.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((item) => {
                      const status = getStatus(item.timestamp);
                      const d = new Date(item.timestamp);
                      return (
                        <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className="font-black text-gray-900 text-xl">Rp 100.000</span>
                              <p className="text-xs text-gray-500 font-bold mt-1 bg-gray-100 inline-block px-2 py-1 rounded-md">{item.method} • {item.account}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${status.color}`}>
                              {status.text}
                            </span>
                          </div>
                          <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium">
                            <span className="text-gray-400">Waktu Pengajuan:</span>
                            <span className="text-gray-800">{d.toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})} {d.toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>, document.body
      )}
    </div>
  );
}
