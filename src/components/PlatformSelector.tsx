// @ts-nocheck
"use client";

import Image from "next/image";
import { usePlatform } from "@/hooks/usePlatform";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Wallet, ArrowRight } from "lucide-react";

export function PlatformSelector() {
  const { currentPlatform, setPlatform, platforms } = usePlatform();
  const [walletIndex, setWalletIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Mencegah layar Blank Putih di Vercel (Hydration Fix)
  useEffect(() => {
    setIsMounted(true);
  }, []);

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

      {/* POPUP MODAL ALA TIKTOK BONUS (Hanya render jika halaman sudah siap) */}
      {isMounted && showModal && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white w-full sm:w-[400px] h-[85vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="w-8"></div>
              <h2 className="font-bold text-lg text-gray-900">Tarik Saldo</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"><X className="w-5 h-5 text-gray-600" /></button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 bg-gray-50">
              {/* Kartu Saldo */}
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 mb-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Poin Anda (Rp)</p>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">10.000</h1>
              </div>

              {/* Form Ilusi (Demo) */}
              <h3 className="font-bold text-gray-800 mb-3 px-1 text-sm">Metode Penarikan</h3>
              <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-6">
                <div className="p-3 border-b border-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">Rp</div>
                    <span className="font-medium text-gray-800 text-sm">DANA</span>
                  </div>
                  <div className="w-4 h-4 rounded-full border-4 border-red-500 bg-white"></div>
                </div>
                <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-b-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-xs">S</div>
                    <span className="font-medium text-gray-800 text-sm">ShopeePay</span>
                  </div>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white"></div>
                </div>
              </div>

              <h3 className="font-bold text-gray-800 mb-3 px-1 text-sm">Detail Akun (Demo)</h3>
              <div className="mb-6">
                <input type="number" placeholder="Masukkan Nomor HP terdaftar..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all" />
              </div>

              {/* Tombol Asli Menuju WA */}
              <a href="https://wa.me/6285119821813?text=Halo%20Admin,%20saya%20mau%20Cairkan%20Dana%20dari%20nonton%20drama!" target="_blank" rel="noopener noreferrer" className="w-full bg-[#FF0000] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition-colors shadow-md">
                Tarik Uang Sekarang <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>, document.body
      )}
    </div>
  );
}
