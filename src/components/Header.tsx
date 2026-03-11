"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Search, X, MapPin } from "lucide-react";
import { useSearchDramas } from "@/hooks/useDramas";
import { useReelShortSearch } from "@/hooks/useReelShort";
import { useNetShortSearch } from "@/hooks/useNetShort";
import { useShortMaxSearch } from "@/hooks/useShortMax";
import { useMeloloSearch } from "@/hooks/useMelolo";
import { useFlickReelsSearch } from "@/hooks/useFlickReels";
import { useFreeReelsSearch } from "@/hooks/useFreeReels";
import { usePlatform } from "@/hooks/usePlatform";
import { useDebounce } from "@/hooks/useDebounce";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const normalizedQuery = debouncedQuery.trim();

  // State untuk Animasi 15 Detik (Logo & Promo)
  const [showInitial, setShowInitial] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Timer 15 detik untuk menghilangkan Logo & Promo
    const timer15s = setTimeout(() => {
      setShowInitial(false);
    }, 15000);

    // Update Jam Real-time (Hari, Tanggal, Jam, Lokasi)
    const clockInterval = setInterval(() => {
      const now = new Date();
      const dateString = now.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
      const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      // Deteksi zona waktu lokasi saat ini
      const offset = -now.getTimezoneOffset() / 60;
      let tz = "WIB";
      if (offset === 8) tz = "WITA";
      if (offset === 9) tz = "WIT";

      setCurrentTime(`${dateString} | ${timeString} ${tz}`);
    }, 1000);

    return () => {
      clearTimeout(timer15s);
      clearInterval(clockInterval);
    };
  }, []);

  // Platform context & Search logic
  const { isDramaBox, isReelShort, isShortMax, isNetShort, isMelolo, isFlickReels, isFreeReels, platformInfo } = usePlatform();
  const { data: dramaBoxResults, isLoading: isSearchingDramaBox } = useSearchDramas(isDramaBox ? normalizedQuery : "");
  const { data: reelShortResults, isLoading: isSearchingReelShort } = useReelShortSearch(isReelShort ? normalizedQuery : "");
  const { data: netShortResults, isLoading: isSearchingNetShort } = useNetShortSearch(isNetShort ? normalizedQuery : "");
  const { data: shortMaxResults, isLoading: isSearchingShortMax } = useShortMaxSearch(isShortMax ? normalizedQuery : "");
  const { data: meloloResults, isLoading: isSearchingMelolo } = useMeloloSearch(isMelolo ? normalizedQuery : "");
  const { data: flickReelsResults, isLoading: isSearchingFlickReels } = useFlickReelsSearch(isFlickReels ? normalizedQuery : "");
  const { data: freeReelsResults, isLoading: isSearchingFreeReels } = useFreeReelsSearch(isFreeReels ? normalizedQuery : "");

  const isSearching = isDramaBox ? isSearchingDramaBox : isReelShort ? isSearchingReelShort : isShortMax ? isSearchingShortMax : isNetShort ? isSearchingNetShort : isMelolo ? isSearchingMelolo : isFlickReels ? isSearchingFlickReels : isSearchingFreeReels;
  const searchResults = isDramaBox ? dramaBoxResults : isReelShort ? reelShortResults?.data : isShortMax ? shortMaxResults?.data : isNetShort ? netShortResults?.data : isMelolo ? meloloResults?.data?.search_data?.flatMap((item: any) => item.books || []).filter((book: any) => book.thumb_url && book.thumb_url !== "") || [] : isFlickReels ? flickReelsResults?.data : freeReelsResults;

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  if (pathname?.startsWith("/watch")) return null;

  return (
    <>
      {/* HEADER UTAMA */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* KIRI: Area Animasi Logo -> Waktu */}
            <Link href="/" className="relative flex items-center h-full w-[240px]">
              
              {/* GAMBAR LOGO (Tampil 15 Detik Pertama) */}
              <div 
                className={`absolute left-0 transition-all duration-700 ease-in-out flex items-center w-[130px] h-[50px]
                  ${showInitial ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}
              >
                <Image 
                    src="/logo.png" 
                    alt="Logo Habi Music Official" 
                    fill={true} 
                    className="object-contain object-left" 
                    priority={true} 
                />
              </div>

              {/* TEKS WAKTU & LOKASI (Tampil Setelah 15 Detik) */}
              <div 
                className={`absolute left-0 transition-all duration-700 ease-in-out flex flex-col justify-center
                  ${!showInitial ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
              >
                <div className="flex items-center gap-1.5 text-gray-800 font-bold text-[11px] sm:text-xs tracking-tight">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{currentTime.split(' | ')[0]}</span>
                </div>
                <div className="text-gray-500 font-mono text-[10px] sm:text-[11px] ml-5">
                  {currentTime.split(' | ')[1]}
                </div>
              </div>

            </Link>

            {/* KANAN: Tombol Search */}
            <div className="flex items-center">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>
            </div>

          </div>
        </div>

        {/* Search Overlay (Portal) */}
        {searchOpen && typeof document !== "undefined" && createPortal(
            <div className="fixed inset-0 bg-background z-[9999] overflow-hidden">
              <div className="container mx-auto px-4 py-6 h-[100dvh] flex flex-col">
                <div className="flex items-center gap-4 mb-6 flex-shrink-0">
                  <div className="flex-1 relative min-w-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={`Cari drama di ${platformInfo.name}...`} className="search-input pl-12" autoFocus />
                  </div>
                  <button onClick={handleSearchClose} className="p-3 rounded-xl hover:bg-muted/50 transition-colors flex-shrink-0">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Platform indicator */}
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Mencari di:</span>
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary font-bold">{platformInfo.name}</span>
                </div>

                {/* Search Results */}
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                  {isSearching && normalizedQuery && (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {/* DramaBox Results */}
                  {isDramaBox && searchResults && searchResults.length > 0 && (
                    <div className="grid gap-3">
                      {searchResults.map((drama: any, index: number) => (
                        <Link key={drama.bookId} href={`/detail/dramabox/${drama.bookId}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-card hover:bg-gray-50 border border-gray-100 transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
                          <img src={drama.cover} alt={drama.bookName} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">{drama.bookName}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-2">{drama.introduction}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* ReelShort Results */}
                  {isReelShort && searchResults && searchResults.length > 0 && (
                    <div className="grid gap-3">
                      {searchResults.map((book: any, index: number) => (
                        <Link key={book.book_id} href={`/detail/reelshort/${book.book_id}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-card hover:bg-gray-50 border border-gray-100 transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
                          <img src={book.book_pic} alt={book.book_title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">{book.book_title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-2">{book.special_desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                   {/* NetShort Results */}
                   {isNetShort && searchResults && searchResults.length > 0 && (
                    <div className="grid gap-3">
                      {searchResults.map((drama: any, index: number) => (
                        <Link key={drama.shortPlayId} href={`/detail/netshort/${drama.shortPlayId}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-card hover:bg-gray-50 border border-gray-100 transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
                          <img src={drama.cover} alt={drama.title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">{drama.title}</h3>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                   {/* ShortMax Results */}
                   {isShortMax && searchResults && searchResults.length > 0 && (
                    <div className="grid gap-3">
                      {searchResults.map((drama: any, index: number) => (
                        <Link key={`${drama.shortPlayId}-${index}`} href={`/detail/shortmax/${drama.shortPlayId}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-card hover:bg-gray-50 border border-gray-100 transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
                          <img src={drama.cover} alt={drama.title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">{drama.title}</h3>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Melolo Results */}
                  {isMelolo && searchResults && searchResults.length > 0 && (
                    <div className="grid gap-3">
                      {searchResults.map((book: any, index: number) => (
                        <Link key={book.book_id} href={`/detail/melolo/${book.book_id}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-card hover:bg-gray-50 border border-gray-100 transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
                          <div className="w-16 h-24 bg-muted rounded-xl flex-shrink-0 overflow-hidden">
                            {book.thumb_url ? (
                              <img src={book.thumb_url.includes(".heic") ? `https://wsrv.nl/?url=${encodeURIComponent(book.thumb_url)}&output=jpg` : book.thumb_url} alt={book.book_name} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
                            ) : (<div className="w-full h-full flex items-center justify-center bg-gray-100"><span className="text-xs text-gray-400">No Img</span></div>)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">{book.book_name}</h3>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* FlickReels Results */}
                  {isFlickReels && searchResults && searchResults.length > 0 && (
                    <div className="grid gap-3">
                      {searchResults.map((book: any, index: number) => (
                        <Link key={book.playlet_id} href={`/detail/flickreels/${book.playlet_id}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-card hover:bg-gray-50 border border-gray-100 transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
                          <img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">{book.title}</h3>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* FreeReels Results */}
                  {isFreeReels && searchResults && searchResults.length > 0 && (
                    <div className="grid gap-3">
                      {searchResults.map((book: any, index: number) => (
                        <Link key={book.key || index} href={`/detail/freereels/${book.key}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-card hover:bg-gray-50 border border-gray-100 transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
                          <img src={book.coverUrl || book.cover || ""} alt={book.title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">{book.title}</h3>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </div>,
            document.body
          )}
      </header>

      {/* WIDGET PROMO TIKTOK STYLE (Melayang di Kiri Atas Bawah Header) */}
      {showInitial && typeof document !== "undefined" && createPortal(
        <div className="fixed top-[80px] left-3 z-[60] animate-in fade-in zoom-in duration-500">
          <div className="relative group">
            
            {/* Tombol Close Manual */}
            <button 
              onClick={() => setShowInitial(false)}
              className="absolute -top-2 -right-2 bg-gray-800 text-white w-5 h-5 rounded-full flex items-center justify-center z-10 shadow-md hover:scale-110 transition-transform"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Kotak Kado Animasi Ngeden (Pulse) */}
            <a 
              href="https://wa.me/6285119821813?text=Halo%20Admin,%20saya%20mau%20info%20event%20nonton%20drama%20dapat%20uang!" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-2.5 shadow-[0_4px_15px_rgba(234,179,8,0.5)] border-2 border-yellow-200 animate-pulse hover:animate-none hover:scale-105 transition-all"
            >
              <span className="text-2xl drop-shadow-md">🎁</span>
              <span className="text-[9px] font-extrabold text-white mt-1 uppercase tracking-tight drop-shadow">
                Dapat Uang
              </span>
            </a>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
