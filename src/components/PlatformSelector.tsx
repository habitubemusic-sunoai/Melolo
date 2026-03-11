"use client";

import Image from "next/image";
import { usePlatform, type PlatformInfo } from "@/hooks/usePlatform";
import { useState, useEffect } from "react";

export function PlatformSelector() {
  const { currentPlatform, setPlatform, platforms } = usePlatform();

  // Animasi Rotasi Logo E-Wallet
  const wallets = [
    { name: "Uang", icon: "💸", color: "bg-green-500" },
    { name: "DANA", icon: "Rp", color: "bg-blue-500" },
    { name: "GoPay", icon: "G", color: "bg-green-600" },
    { name: "Shopee", icon: "S", color: "bg-orange-500" }
  ];
  const [walletIndex, setWalletIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWalletIndex((prev) => (prev + 1) % wallets.length);
    }, 2000); // Berganti setiap 2 detik
    return () => clearInterval(interval);
  }, []);

  const activeWallet = wallets[walletIndex];

  return (
    <div className="w-full pt-4 pb-2 px-4 bg-white border-b border-gray-100">
      <div 
        className="flex items-center gap-2.5 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{__html: `.overflow-x-auto::-webkit-scrollbar { display: none; }`}} />
        
        {/* === TOMBOL CAIRKAN DANA (Di Paling Kiri) === */}
        <button
          onClick={() => window.open('https://wa.me/6285119821813?text=Halo%20Admin,%20saya%20mau%20cairkan%20saldo%20nonton%20drama%20ke%20DANA/GoPay!', '_blank')}
          className="relative flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0 transition-all duration-300 ease-out border bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 shadow-sm hover:scale-105"
        >
          {/* Logo E-Wallet Animasi */}
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-colors duration-500 shadow-sm ${activeWallet.color}`}>
            {activeWallet.icon}
          </div>
          <span className="font-bold text-[13px] text-yellow-700 whitespace-nowrap tracking-tight">
            Cairkan Dana
          </span>
        </button>

        {/* Garis Pembatas */}
        <div className="w-[1px] h-6 bg-gray-300 mx-1 flex-shrink-0"></div>

        {/* === DAFTAR KATALOG DRAMA === */}
        {platforms.map((platform) => (
          <PlatformButton
            key={platform.id}
            platform={platform}
            isActive={currentPlatform === platform.id}
            onClick={() => setPlatform(platform.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface PlatformButtonProps {
  platform: PlatformInfo;
  isActive: boolean;
  onClick: () => void;
}

function PlatformButton({ platform, isActive, onClick }: PlatformButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0
        transition-all duration-300 ease-out border
        ${
          isActive
            ? "bg-gray-900 border-gray-900 text-white shadow-md transform scale-[1.02]"
            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
        }
      `}
    >
      <div className="relative w-5 h-5 rounded-full overflow-hidden bg-white flex-shrink-0 shadow-sm">
        <Image src={platform.logo} alt={platform.name} fill className="object-cover" sizes="20px" />
      </div>
      <span className="font-semibold text-[13px] whitespace-nowrap tracking-tight">
        {platform.name}
      </span>
    </button>
  );
}
