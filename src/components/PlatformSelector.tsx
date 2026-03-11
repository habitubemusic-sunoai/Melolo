// @ts-nocheck
"use client";

import Image from "next/image";
import { usePlatform } from "@/hooks/usePlatform";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ArrowRight, Clock, CheckCircle2 } from "lucide-react";

export function PlatformSelector() {
  const { currentPlatform, setPlatform, platforms } = usePlatform();
  const [walletIndex, setWalletIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // State Keuangan
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('tarik'); // 'tarik' atau 'riwayat'
  const [selectedMethod, setSelectedMethod] = useState('DANA');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    setIsMounted(true);
    // Muat Saldo & Riwayat Permanen
    const savedBalance = localStorage.getItem('habi_balance');
    if (savedBalance) setBalance(Number(savedBalance));
    
    const savedHistory = localStorage.getItem('habi_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    // Sinkronisasi saldo secara real-time jika berubah di tempat lain
    const interval = setInterval(() => {
      const current = localStorage.getItem('habi_balance');
      if (current) setBalance(Number(current));
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

  const handleWithdraw = () => {
    if (balance < 100000) {
      alert("⚠️ Saldo belum mencukupi!\nMinimal pencairan adalah Rp 100.000.");
      return;
    }
    if (!accountNumber || accountNumber.length < 8) {
      alert("⚠️ Masukkan Nomor Rekening / E-Wallet yang valid!");
      return;
    }

    // Kurangi Saldo
    const newBalance = balance - 100000;
    setBalance(newBalance);
    localStorage.setItem('habi_balance', newBalance.toString());

    // Buat Riwayat Baru
    const newRecord = {
      id: Date.now(),
      amount: 100000,
      method: selectedMethod,
      account: accountNumber,
      timestamp: Date.now()
    };
    const newHistory = [newRecord, ...history];
    setHistory(newHistory);
    localStorage.setItem('habi_history', JSON.stringify(newHistory));

    // Kirim Notifikasi ke Lonceng di Header
    window.dispatchEvent(new CustomEvent('habi_withdraw_event', { detail: newRecord }));

    setAccountNumber('');
    alert("✅ Penarikan Rp 100.000 Berhasil Diajukan!\nSilakan cek tab Riwayat untuk melihat status pencairan.");
    setActiveTab('riwayat');
  };

  // Fungsi Cek Status Cerdas (Berdasarkan Waktu)
  const getStatus = (timestamp) => {
    const diff = Date.now() - timestamp;
    const oneMinute = 60 * 1000;
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (diff < oneMinute) return { text: "Pending", color: "text-yellow-600 bg-yellow-100" };
    if (diff < oneDay) return { text: "Sedang Diproses", color: "text-blue-600 bg-blue-100" };
    return { text: "Berhasil Cair", color: "text-green-600 bg-green-100" };
  };

  const activeWallet = wallets[walletIndex];

  return (
    <div className="w-full pt-4 pb-2 px-4 bg-white border-b border-gray-100">
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style dangerouslySetInnerHTML={{__html: `.overflow-x-auto::-webkit-scrollbar { display: none; }`}} />
        
        {/* Tombol Cairkan Dana Animasi */}
        <button onClick={() => setShowModal(true)} className="relative flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0 transition-all border bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400 shadow-sm hover:scale-105">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-colors duration-500 ${activeWallet.color}`}>
            {activeWallet.icon}
          </div>
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

      {/* MODAL DASHBOARD TIKTOK STYLE */}
      {isMounted && showModal && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white w-full sm:w-[450px] h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0">
            
            {/* Header & Tabs */}
            <div className="bg-white border-b border-gray-100 pt-4 px-4">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8"></div>
                <h2 className="font-black text-lg text-gray-900">Dompet Habi Music</h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"><X className="w-5 h-5 text-gray-600" /></button>
              </div>
              <div className="flex w-full">
                <button onClick={() => setActiveTab('tarik')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'tarik' ? 'border-[#FF0000] text-[#FF0000]' : 'border-transparent text-gray-400'}`}>Tarik Saldo</button>
                <button onClick={() => setActiveTab('riwayat')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'riwayat' ? 'border-[#FF0000] text-[#FF0000]' : 'border-transparent text-gray-400'}`}>Riwayat</button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto flex-1 bg-gray-50">
              
              {activeTab === 'tarik' && (
                <div className="animate-in fade-in">
                  {/* Kartu Saldo */}
                  <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 mb-6">
                    <p className="text-sm font-bold text-gray-500 mb-1">Saldo Hasil Nonton (Rp)</p>
                    <h1 className="text-[40px] font-black text-gray-900 tracking-tighter">
                      {balance.toLocaleString('id-ID')}
                    </h1>
                    <p className="text-xs text-gray-400 mt-2">Minimal pencairan Rp 100.000</p>
                  </div>

                  <h3 className="font-bold text-gray-800 mb-3 px-1 text-sm">Metode Penarikan</h3>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                    {wallets.map((w, idx) => (
                      <div key={w.name} onClick={() => setSelectedMethod(w.text)} className={`p-4 flex items-center justify-between cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${selectedMethod === w.text ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}>
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

                  <h3 className="font-bold text-gray-800 mb-3 px-1 text-sm">Masukkan Nomor Akun {selectedMethod}</h3>
                  <div className="mb-6">
                    <input 
                      type="number" 
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder={`Contoh: 08123456789 (${selectedMethod})`} 
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm font-medium outline-none focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] transition-all shadow-sm" 
                    />
                  </div>

                  <button onClick={handleWithdraw} className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md ${balance >= 100000 ? 'bg-[#FF0000] text-white hover:bg-red-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                    Tarik Uang Sekarang <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {activeTab === 'riwayat' && (
                <div className="animate-in fade-in">
                  {history.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                      <Clock className="w-12 h-12 mb-3 opacity-20" />
                      <p className="font-medium text-sm">Belum ada riwayat penarikan.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {history.map((item) => {
                        const status = getStatus(item.timestamp);
                        const d = new Date(item.timestamp);
                        return (
                          <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-black text-gray-900 text-lg">Rp 100.000</span>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">Ke {item.method} ({item.account})</p>
                              </div>
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${status.color}`}>
                                {status.text}
                              </span>
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-50 text-[10px] text-gray-400 font-medium">
                              {d.toLocaleDateString('id-ID', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})} • {d.toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})} WIB
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>, document.body
      )}
    </div>
  );
}
