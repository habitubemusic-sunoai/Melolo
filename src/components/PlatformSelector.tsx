"use client";

import Image from "next/image";
import { usePlatform, type PlatformInfo } from "@/hooks/usePlatform";

export function PlatformSelector() {
  const { currentPlatform, setPlatform, platforms } = usePlatform();

  return (
    <div className="w-full pt-4 pb-2 px-4 bg-white">
      {/* Container Scroll Horizontal (Gaya YouTube / TikTok) */}
      <div 
        className="flex items-center gap-2.5 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* CSS Khusus untuk menyembunyikan garis scrollbar tapi tetap bisa digeser */}
        <style dangerouslySetInnerHTML={{__html: `
          .overflow-x-auto::-webkit-scrollbar { 
            display: none; 
          }
        `}} />
        
        {/* Memunculkan semua tombol secara berjejer */}
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
            ? "bg-gray-900 border-gray-900 text-white shadow-md transform scale-[1.02]" // Gaya Aktif (Hitam Elegan ala YouTube)
            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100" // Gaya Tidak Aktif (Abu-abu terang)
        }
      `}
    >
      {/* Ikon Logo Platform */}
      <div className="relative w-5 h-5 rounded-full overflow-hidden bg-white flex-shrink-0 shadow-sm">
        <Image
          src={platform.logo}
          alt={platform.name}
          fill
          className="object-cover"
          sizes="20px"
        />
      </div>
      
      {/* Nama Platform */}
      <span className="font-semibold text-[13px] whitespace-nowrap tracking-tight">
        {platform.name}
      </span>
    </button>
  );
}
