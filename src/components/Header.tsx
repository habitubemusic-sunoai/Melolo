"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, X, MapPin, Play } from "lucide-react";
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

  // State untuk Animasi
  const [showLogo, setShowLogo] = useState(true);
  const [showPromo, setShowPromo] = useState(true);
  
  const [currentTime, setCurrentTime] = useState("");
  const [userCity, setUserCity] = useState("Mendeteksi...");

  useEffect(() => {
    // 1. Timer Logo -> Jam (10 Detik)
    const logoTimer = setTimeout(() => {
      setShowLogo(false);
    }, 10000);

    // 2. Timer Promo Hilang (15 Detik)
    const promoTimer = setTimeout(() => {
      setShowPromo(false);
    }, 15000);

    // 3. Deteksi Kota dari Sistem HP (Anti-Gagal)
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const city = tz.split('/')[1]?.replace(/_/g, ' ') || "Indonesia";
      setUserCity(city);
    } catch (e) {
      setUserCity("Indonesia");
    }

    // 4. Update Jam Real-time
    const clockInterval = setInterval(() => {
      const now = new Date();
      const dateString = now.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });
      const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const offset = -now.getTimezoneOffset() / 60;
      let tzAbbr = offset === 8 ? "WITA" : offset === 9 ? "WIT" : "WIB";

      setCurrentTime(`${dateString} | ${timeString} ${tzAbbr}`);
    }, 1000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(promoTimer);
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* KIRI: Transisi Logo -> Jam */}
            <Link href="/" className="relative flex-1 h-10 flex items-center overflow-hidden">
              
              {/* LOGO GAYA MELOLO (Tampil 10 Detik Pertama) */}
              <div 
                className={`absolute left-0 transition-all duration-700 ease-in-out flex items-center gap-1.5
                  ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'}`}
              >
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-pink-500 to-yellow-500 flex items-center justify-center shadow-sm">
                  <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                </div>
                <span className="font-display font-extrabold text-lg sm:text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 tracking-tight">
                  Habi Music
                </span>
              </div>

              {/* TEKS JAM & KOTA HP (Tampil Setelah 10 Detik) */}
              <div 
                className={`absolute left-0 transition-all duration-700 ease-in-out flex flex-col justify-center
                  ${!showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}
              >
                <div className="flex items-center gap-1.5 text-gray-800 font-bold text-[11px] sm:text-xs tracking-tight">
                  <MapPin className="w-3.5 h-3.5 text-pink-500" />
                  <span>{userCity}</span>
                </div>
                <div className="text-gray-500 font-mono text-[10px] sm:text-[11px] ml-5 font-medium mt-0.5">
                  {currentTime || "Memuat waktu..."}
                </div>
              </div>

            </Link>

            {/* KANAN: Tombol Search */}
            <div className="flex items-center flex-shrink-0">
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
            <div className="fixed inset-0 bg-white z-[9999] overflow-hidden">
              <div className="container mx-auto px-4 py-6 h-[100dvh] flex flex-col">
                <div className="flex items-center gap-4 mb-6 flex-shrink-0">
                  <div className="flex-1 relative min-w-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={`Cari drama di ${platformInfo.name}...`} className="search-input pl-12 bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl w-full py-3" autoFocus />
                  </div>
                  <button onClick={handleSearchClose} className="p-3 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0">
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Platform indicator */}
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                  <span>Mencari di:</span>
                  <span className="px-2 py-1 rounded-full bg-pink-50 text-pink-600 font-bold">{platformInfo.name}</span>
                </div>

                {/* Search Results */}
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                  {isSearching && normalizedQuery && (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {/* DramaBox Results */}
                  {isDramaBox && searchResults && searchResults.length > 0 && (
                    <div className="grid gap-3">
                      {searchResults.map((drama: any, index: number) => (
                        <Link key={drama.bookId} href={`/detail/dramabox/${drama.bookId}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
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
                        <Link key={book.book_id} href={`/detail/reelshort/${book.book_id}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
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
                        <Link key={drama.shortPlayId} href={`/detail/netshort/${drama.shortPlayId}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
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
                        <Link key={`${drama.shortPlayId}-${index}`} href={`/detail/shortmax/${drama.shortPlayId}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
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
                        <Link key={book.book_id} href={`/detail/melolo/${book.book_id}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
                          <div className="w-16 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
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
                        <Link key={book.playlet_id} href={`/detail/flickreels/${book.playlet_id}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
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
                        <Link key={book.key || index} href={`/detail/freereels/${book.key}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
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

      {/* WIDGET TIKTOK STYLE (Kado Elegan, Kecil, Tidak Menutupi Layar) */}
      {showPromo && typeof document !== "undefined" && createPortal(
        <div className="fixed top-[75px] left-3 z-[40] transition-opacity duration-500">
          <div className="relative group">
            
            {/* Tombol Close Manual Kecil */}
            <button 
              onClick={() => setShowPromo(false)}
              className="absolute -top-1.5 -right-1.5 bg-gray-800/80 text-white w-4 h-4 rounded-full flex items-center justify-center z-10 hover:bg-gray-900 transition-colors"
            >
              <X className="w-2.5 h-2.5" />
            </button>

            {/* Kotak Kado Kalem */}
            <a 
              href="https://wa.me/6285119821813?text=Halo%20Admin,%20saya%20mau%20info%20event%20nonton%20drama%20dapat%20uang!" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg p-1.5 shadow-md border border-gray-100 transition-transform hover:scale-105 w-[50px]"
            >
              <span className="text-xl">🎁</span>
              <span className="text-[8px] font-bold text-pink-600 mt-0.5 whitespace-nowrap">
                Bonus
              </span>
            </a>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
