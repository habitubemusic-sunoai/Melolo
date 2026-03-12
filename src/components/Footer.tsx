"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on watch pages for immersive video experience
  if (pathname?.startsWith("/watch")) {
    return null;
  }

  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-4">
          
          {/* Tombol YouTube Habi Entertainment (Animasi Kilau 2x) */}
          <a 
            href="https://www.youtube.com/@habientertainmentofficial" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="relative overflow-hidden flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all border border-gray-200"
          >
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes kilauYT {
                0% { left: -100%; }
                100% { left: 200%; }
              }
              .kilau-animasi {
                position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
                background: linear-gradient(to right, transparent, rgba(255,255,255,0.9), transparent);
                transform: skewX(-25deg);
                animation: kilauYT 1.5s ease-in-out 2;
              }
            `}} />
            
            <div className="w-8 h-6 bg-[#FF0000] rounded-lg flex items-center justify-center relative overflow-hidden flex-shrink-0">
              <div className="kilau-animasi"></div>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </div>
            
            <span className="font-black text-gray-800 text-sm tracking-tight">HABI ENTERTAINMENT</span>
          </a>

          {/* Copyright Habi Entertainment */}
          <p className="text-xs text-muted-foreground/80 text-center font-medium">
            © {new Date().getFullYear()} Made with ❤️ by <span className="font-black text-[#FF0000]">HABI ENTERTAINMENT</span>
          </p>

        </div>
      </div>
    </footer>
  );
}
