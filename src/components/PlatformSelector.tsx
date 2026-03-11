// @ts-nocheck
"use client";

import Image from "next/image";
import { usePlatform, type PlatformInfo } from "@/hooks/usePlatform";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2 } from "lucide-react";

export function PlatformSelector() {
  const { currentPlatform, setPlatform, platforms } = usePlatform();
  const [walletIndex, setWalletIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const wallets = [
    { name: "Uang", icon: "💸", color: "bg-green-500" },
    { name: "DANA", icon: "Rp", color: "bg-blue-500" },
    { name: "GoPay", icon: "G", color: "bg-green-600" },
    { name: "Shopee", icon: "S", color: "bg-orange-500" }
  ];

  useEffect(() => {
    const int = setInterval(() => setWalletIndex(p => (p + 1) % wallets.length), 2000);
    return () => clearInterval(int);
  }, []);

  const activeWallet = wallets[walletIndex];

  return (
    <div className="w-full pt-4 pb-2 px-4 bg-white border-b border-gray-100">
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style dangerouslySetInnerHTML={{__html: `.overflow-x-auto::-webkit-scrollbar { display: none; }`}} />
        
        {/* Tombol Cairkan Dana */}
        <button
          onClick={() => setShowModal(true)}
          className="relative flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0 transition-all border bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400 shadow-sm hover:scale-105"
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-colors duration-500 ${activeWallet.color}`}>
            {activeWallet.icon}
          </div>
          <span className="font-bold text-[13px] text-yellow-700 whitespace-nowrap">Cairkan Dana</span>
        </button>

        <div className="w-[1px] h-6 bg-gray-300 mx-1 flex-shrink-0"></div>

        {platforms.map((p) => (
          <button key={p.id} onClick={() => setPlatform(p.id)} className={`relative flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0 transition-all border ${currentPlatform === p.id ? "bg-gray-900 border-gray-900 text-white shadow-md transform scale-[1.02]" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"}`}>
            <div className="relative w-5 h-5 rounded-full overflow-hidden bg-white flex-shrink-0 shadow-sm">
              <Image src={p.logo} alt={p.name} fill className="object-cover" sizes="20px" />
            </div>
            <span className="font-semibold text-[13px] whitespace-nowrap">{p.name}</span>
          </button>
        ))}
      </div>

      {/* POPUP MODAL ALA TIKTOK BONUS */}
      {showModal && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white w-full sm:w-[400px] h-[85vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="w-8"></div>
              <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <span className="text-2xl">🎁</span> Habi Bonus
              </h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"><X className="w-5 h-5 text-gray-600" /></button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 bg-gray-50">
              {/* Kartu Saldo */}
              <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <p className="text-sm font-medium opacity-90 mb-1">Saldo Anda (Poin Berjalan)</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black tracking-tight">Rp 10.000</span>
                  <span className="text-sm font-medium opacity-80">,00</span>
                </div>
                <a href="https://wa.me/6285119821813?text=Halo%20Admin,%20saya%20sudah%20nonton%20dan%20ingin%20Tarik%20Uang%20ke%20DANA/GoPay!" target="_blank" rel="noopener noreferrer" className="mt-4 w-full bg-white text-red-600 font-bold py-3 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
                  Tarik Uang Sekarang
                </a>
              </div>

              <h3 className="font-bold text-gray-800 mb-3 px-1">Tugas Harian</h3>
              
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"><Play className="w-6 h-6 text-green-600 fill-green-600 ml-1" /></div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-gray-900">Nonton Drama 1 Episode</h4>
                  <p className="text-[11px] text-gray-500 leading-tight mt-1">Sistem koin berjalan otomatis saat video diputar sampai selesai.</p>
                </div>
                <div className="text-right">
                  <span className="block text-red-500 font-bold text-sm">+Rp 10K</span>
                  <button className="mt-1 bg-red-50 text-red-600 text-[10px] font-bold px-3 py-1 rounded-full">Mulai</button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 opacity-70">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"><CheckCircle2 className="w-6 h-6 text-blue-600" /></div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-gray-900">Check-in Harian</h4>
                  <p className="text-[11px] text-gray-500 leading-tight mt-1">Buka aplikasi berturut-turut.</p>
                </div>
                <div className="text-right">
                  <span className="block text-gray-400 font-bold text-sm">Selesai</span>
                </div>
              </div>
            </div>
          </div>
        </div>, document.body
      )}
    </div>
  );
}
