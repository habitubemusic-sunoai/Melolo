"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, X, Play, Clock } from "lucide-react";
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

  // State untuk Promo & Jam
  const [showPromo, setShowPromo] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Menghilangkan promo setelah 10 detik
    const promoTimer = setTimeout(() => {
      setShowPromo(false);
    }, 10000);

    // Update Jam setiap detik
    const clockInterval = setInterval(() => {
      const now = new Date();
      // Format: Kamis, 11 Maret 2026 | 09:30:15 WIB
      const dateString = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      // Mendapatkan singkatan zona waktu (WIB/WITA/WIT) dari offset
      const offset = -now.getTimezoneOffset() / 60;
      let tz = "WIB";
      if (offset === 8) tz = "WITA";
      if (offset === 9) tz = "WIT";

      setCurrentTime(`${dateString} - ${timeString} ${tz}`);
    }, 1000);

    return () => {
      clearTimeout(promoTimer);
      clearInterval(clockInterval);
    };
  }, []);

  // Platform context
  const { isDramaBox, isReelShort, isShortMax, isNetShort, isMelolo, isFlickReels, isFreeReels, platformInfo } = usePlatform();

  // Search logic (Tetap sama, tidak diubah)
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Habi Music (Lebih Elegan & Rapi) */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform duration-300">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
            <span className="font-display font-bold text-lg text-white tracking-wide">
              Habi Music
            </span>
          </Link>

          {/* Bagian Kanan */}
          <div className="flex items-center gap-3">
            
            {/* Promo vs Jam (Berubah setelah 10 detik) */}
            <div className="hidden sm:flex items-center">
              {showPromo ? (
                <a 
                  href="https://wa.me/6285119821813?text=Halo%20Admin,%20saya%20mau%20info%20event%20nonton%20drama%20dapat%20uang!" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border border-primary/30"
                >
                  🎁 Nonton Dapat Uang
                </a>
              ) : (
                <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md text-[10px] md:text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">{currentTime || "Memuat waktu..."}</span>
                </div>
              )}
            </div>

            {/* Tombol Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-200" />
            </button>
          </div>

        </div>
      </div>

      {/* Tampilan Mobile Waktu/Promo (Khusus HP di bawah header) */}
      <div className="sm:hidden w-full border-t border-white/5 bg-background/80 py-1.5 px-4 flex justify-center">
         {showPromo ? (
            <a 
              href="https://wa.me/6285119821813" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-primary font-medium tracking-wide"
            >
              🎁 Klik Disini: Event Nonton Dapat Uang!
            </a>
          ) : (
            <span className="text-[10px] text-muted-foreground font-mono">
              {currentTime}
            </span>
          )}
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
                <span className="px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">{platformInfo.name}</span>
              </div>

              {/* Search Results Container */}
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
                      <Link key={drama.bookId} href={`/detail/dramabox/${drama.bookId}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-card hover:bg-muted transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
                        <img src={drama.cover} alt={drama.bookName} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-foreground truncate">{drama.bookName}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{drama.introduction}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* ReelShort Results */}
                {isReelShort && searchResults && searchResults.length > 0 && (
                  <div className="grid gap-3">
                    {searchResults.map((book: any, index: number) => (
                      <Link key={book.book_id} href={`/detail/reelshort/${book.book_id}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-card hover:bg-muted transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
                        <img src={book.book_pic} alt={book.book_title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-foreground truncate">{book.book_title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{book.special_desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                 {/* NetShort Results */}
                 {isNetShort && searchResults && searchResults.length > 0 && (
                  <div className="grid gap-3">
                    {searchResults.map((drama: any, index: number) => (
                      <Link key={drama.shortPlayId} href={`/detail/netshort/${drama.shortPlayId}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-card hover:bg-muted transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
                        <img src={drama.cover} alt={drama.title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-foreground truncate">{drama.title}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                 {/* ShortMax Results */}
                 {isShortMax && searchResults && searchResults.length > 0 && (
                  <div className="grid gap-3">
                    {searchResults.map((drama: any, index: number) => (
                      <Link key={`${drama.shortPlayId}-${index}`} href={`/detail/shortmax/${drama.shortPlayId}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-card hover:bg-muted transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
                        <img src={drama.cover} alt={drama.title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-foreground truncate">{drama.title}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Melolo Results */}
                {isMelolo && searchResults && searchResults.length > 0 && (
                  <div className="grid gap-3">
                    {searchResults.map((book: any, index: number) => (
                      <Link key={book.book_id} href={`/detail/melolo/${book.book_id}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-card hover:bg-muted transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
                        <div className="w-16 h-24 bg-muted rounded-xl flex-shrink-0 overflow-hidden">
                          {book.thumb_url ? (
                            <img src={book.thumb_url.includes(".heic") ? `https://wsrv.nl/?url=${encodeURIComponent(book.thumb_url)}&output=jpg` : book.thumb_url} alt={book.book_name} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
                          ) : (<div className="w-full h-full flex items-center justify-center bg-muted"><span className="text-xs text-muted-foreground">No Img</span></div>)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-foreground truncate">{book.book_name}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* FlickReels Results */}
                {isFlickReels && searchResults && searchResults.length > 0 && (
                  <div className="grid gap-3">
                    {searchResults.map((book: any, index: number) => (
                      <Link key={book.playlet_id} href={`/detail/flickreels/${book.playlet_id}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-card hover:bg-muted transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
                        <img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-foreground truncate">{book.title}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* FreeReels Results */}
                {isFreeReels && searchResults && searchResults.length > 0 && (
                  <div className="grid gap-3">
                    {searchResults.map((book: any, index: number) => (
                      <Link key={book.key || index} href={`/detail/freereels/${book.key}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-card hover:bg-muted transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
                        <img src={book.coverUrl || book.cover || ""} alt={book.title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-foreground truncate">{book.title}</h3>
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
  );
                          }
