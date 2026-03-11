"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, X, MapPin, Play, Bell, Trash2 } from "lucide-react";
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

  // State Animasi & Tampilan Waktu
  const [showLogo, setShowLogo] = useState(true);
  const [showPromo, setShowPromo] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [userCity, setUserCity] = useState("Mendeteksi...");

  // State Fitur Notifikasi YouTube Style
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState([
    { 
      id: 1, 
      text: "Selamat Datang di Habi Music Official! 🎉 Nikmati ribuan drama pendek subtitle Indonesia secara gratis. Jangan lupa klik kado bonus untuk ikuti event cuan ya!" 
    }
  ]);

  // State untuk Rotasi Teks Promo
  const promoTexts = ["Bonus", "Dapat Uang", "Nonton Dibayar", "Klaim Cuan"];
  const [textIndex, setTextIndex] = useState(0);
  const [fadeText, setFadeText] = useState(true);

  useEffect(() => {
    // 1. Timer Logo -> Jam (Hilang setelah 10 Detik)
    const logoTimer = setTimeout(() => setShowLogo(false), 10000);

    // 2. Timer Promo Hilang (15 Detik)
    const promoTimer = setTimeout(() => setShowPromo(false), 15000);

    // 3. Deteksi Kota
    fetch('https://get.geojs.io/v1/ip/geo.json')
      .then(res => res.json())
      .then(data => {
        if(data.city) setUserCity(data.city);
        else setUserCity("Indonesia");
      })
      .catch(() => setUserCity("Indonesia"));

    // 4. Update Jam Real-time
    const clockInterval = setInterval(() => {
      const now = new Date();
      const dateString = now.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });
      const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const offset = -now.getTimezoneOffset() / 60;
      let tzAbbr = offset === 8 ? "WITA" : offset === 9 ? "WIT" : "WIB";
      setCurrentTime(`${dateString} | ${timeString} ${tzAbbr}`);
    }, 1000);

    // 5. Rotasi Teks Promo
    const textInterval = setInterval(() => {
      setFadeText(false); 
      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % promoTexts.length);
        setFadeText(true); 
      }, 500); 
    }, 3000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(promoTimer);
      clearInterval(clockInterval);
      clearInterval(textInterval);
    };
  }, []);

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

  // Fungsi Hapus Notifikasi
  const deleteNotif = (id: number) => {
    setNotifs(notifs.filter(notif => notif.id !== id));
  };

  if (pathname?.startsWith("/watch")) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            
            <Link href="/" className="relative flex-1 h-10 flex items-center overflow-hidden group">
              
              {/* === LOGO YOUTUBE STYLE (10 Detik Pertama) === */}
              <div 
                className={`absolute left-0 transition-all duration-700 ease-in-out flex items-center gap-1
                  ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'}`}
              >
                {/* Ikon YouTube Merah */}
                <div className="w-[30px] h-[20px] rounded-[5px] bg-[#FF0000] flex items-center justify-center relative z-10">
                  <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                </div>
                {/* Font Habi Music YouTube Style (Tebal, Rapat, Hitam) */}
                <span className="font-sans font-bold text-[20px] tracking-tighter text-black relative z-10 mt-[1px]">
                  Habi Music
                </span>

                {/* Suara Sihir */}
                {showLogo && (
                  <audio autoPlay preload="auto">
                    <source src="https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg" type="audio/ogg" />
                  </audio>
                )}
              </div>

              {/* === TEKS JAM & KOTA (Setelah 10 Detik) === */}
              <div 
                className={`absolute left-0 transition-all duration-700 ease-in-out flex flex-col justify-center
                  ${!showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}
              >
                <div className="flex items-center gap-1 text-gray-800 font-bold text-[11px] sm:text-xs tracking-tight">
                  <MapPin className="w-3.5 h-3.5 text-[#FF0000]" />
                  <span>{userCity}</span>
                </div>
                <div className="text-gray-500 font-mono text-[10px] sm:text-[11px] ml-4 font-medium">
                  {currentTime || "Memuat waktu..."}
                </div>
              </div>

            </Link>

            {/* KANAN: Ikon Lonceng Notif & Search */}
            <div className="flex items-center gap-1">
              
              {/* Ikon Notifikasi (Lonceng) */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotif(!showNotif)} 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                >
                  <Bell className="w-[22px] h-[22px] text-black" />
                  {/* Badge Angka Merah */}
                  {notifs.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#FF0000] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-[1.5px] border-white">
                      {notifs.length}
                    </span>
                  )}
                </button>

                {/* Panel Dropdown Notifikasi */}
                {showNotif && (
                  <div className="absolute top-12 right-0 w-[280px] sm:w-[320px] bg-white rounded-xl shadow-[0_5px_25px_rgba(0,0,0,0.15)] border border-gray-100 z-50 overflow-hidden">
                    <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
                      <h3 className="font-bold text-gray-800 text-sm">Notifikasi</h3>
                      <button onClick={() => setShowNotif(false)} className="text-gray-500 hover:text-gray-800">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-2 max-h-[60vh] overflow-y-auto">
                      {notifs.length > 0 ? (
                        notifs.map((notif) => (
                          <div key={notif.id} className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg group relative">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-red-500 font-bold text-xs">HM</span>
                            </div>
                            <div className="flex-1 pr-6">
                              <p className="text-xs text-gray-700 leading-snug">{notif.text}</p>
                              <span className="text-[9px] text-gray-400 mt-1 block">Baru saja</span>
                            </div>
                            {/* Tombol Hapus Pesan */}
                            <button 
                              onClick={() => deleteNotif(notif.id)}
                              className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="py-6 text-center text-sm text-gray-500">
                          Tidak ada notifikasi baru.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Tombol Search */}
              <button onClick={() => setSearchOpen(true)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Search className="w-[22px] h-[22px] text-black" />
              </button>
            </div>

          </div>
        </div>

        {/* Portal Search */}
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
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                  <span>Mencari di:</span>
                  <span className="px-2 py-1 rounded-full bg-red-50 text-red-600 font-bold">{platformInfo.name}</span>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                  {isSearching && normalizedQuery && <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /></div>}
                  {/* DramaBox Results */}
                  {isDramaBox && searchResults && searchResults.length > 0 && <div className="grid gap-3">{searchResults.map((drama: any, i: number) => <Link key={drama.bookId} href={`/detail/dramabox/${drama.bookId}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}><img src={drama.cover} alt={drama.bookName} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" /><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 truncate">{drama.bookName}</h3><p className="text-sm text-gray-500 line-clamp-2 mt-2">{drama.introduction}</p></div></Link>)}</div>}
                  {/* ReelShort Results */}
                  {isReelShort && searchResults && searchResults.length > 0 && <div className="grid gap-3">{searchResults.map((book: any, i: number) => <Link key={book.book_id} href={`/detail/reelshort/${book.book_id}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}><img src={book.book_pic} alt={book.book_title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" /><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 truncate">{book.book_title}</h3><p className="text-sm text-gray-500 line-clamp-2 mt-2">{book.special_desc}</p></div></Link>)}</div>}
                   {/* NetShort Results */}
                   {isNetShort && searchResults && searchResults.length > 0 && <div className="grid gap-3">{searchResults.map((drama: any, i: number) => <Link key={drama.shortPlayId} href={`/detail/netshort/${drama.shortPlayId}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}><img src={drama.cover} alt={drama.title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" /><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 truncate">{drama.title}</h3></div></Link>)}</div>}
                   {/* ShortMax Results */}
                   {isShortMax && searchResults && searchResults.length > 0 && <div className="grid gap-3">{searchResults.map((drama: any, i: number) => <Link key={`${drama.shortPlayId}-${i}`} href={`/detail/shortmax/${drama.shortPlayId}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}><img src={drama.cover} alt={drama.title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" /><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 truncate">{drama.title}</h3></div></Link>)}</div>}
                  {/* Melolo Results */}
                  {isMelolo && searchResults && searchResults.length > 0 && <div className="grid gap-3">{searchResults.map((book: any, i: number) => <Link key={book.book_id} href={`/detail/melolo/${book.book_id}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}><div className="w-16 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">{book.thumb_url ? <img src={book.thumb_url.includes(".heic") ? `https://wsrv.nl/?url=${encodeURIComponent(book.thumb_url)}&output=jpg` : book.thumb_url} alt={book.book_name} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" /> : <div className="w-full h-full flex items-center justify-center bg-gray-100"><span className="text-xs text-gray-400">No Img</span></div>}</div><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 truncate">{book.book_name}</h3></div></Link>)}</div>}
                  {/* FlickReels Results */}
                  {isFlickReels && searchResults && searchResults.length > 0 && <div className="grid gap-3">{searchResults.map((book: any, i: number) => <Link key={book.playlet_id} href={`/detail/flickreels/${book.playlet_id}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}><img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" /><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 truncate">{book.title}</h3></div></Link>)}</div>}
                  {/* FreeReels Results */}
                  {isFreeReels && searchResults && searchResults.length > 0 && <div className="grid gap-3">{searchResults.map((book: any, i: number) => <Link key={book.key || i} href={`/detail/freereels/${book.key}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}><img src={book.coverUrl || book.cover || ""} alt={book.title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" /><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 truncate">{book.title}</h3></div></Link>)}</div>}
                </div>
              </div>
            </div>,
            document.body
          )}
      </header>

      {/* === WIDGET PROMO TIKTOK (Transparan, Teks Shadow, Geser ke Tengah Sedikit) === */}
      {showPromo && typeof document !== "undefined" && createPortal(
        <div className="fixed top-[155px] left-6 z-[40] transition-opacity duration-500">
          <div className="relative group flex flex-col items-center">
            
            {/* Tombol Close Kecil */}
            <button 
              onClick={() => setShowPromo(false)}
              className="absolute -top-1 -right-4 bg-gray-200/80 text-gray-600 w-4 h-4 rounded-full flex items-center justify-center z-10 hover:bg-gray-300 transition-colors"
            >
              <X className="w-2.5 h-2.5" />
            </button>

            {/* Ikon Kado & Teks (Tanpa Background Kotak) */}
            <a 
              href="https://wa.me/6285119821813?text=Halo%20Admin,%20saya%20mau%20info%20Aplikasi%20Drama%20Penghasil%20Uang!" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center transition-transform hover:scale-105"
            >
              {/* Emoji Kado dengan bayangan agar menonjol dari film */}
              <span className="text-[28px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">🎁</span>
              
              {/* Teks Animasi dengan Background Putih Tipis agar sangat terbaca */}
              <div className={`transition-opacity duration-500 flex flex-col items-center text-center mt-0.5 ${fadeText ? 'opacity-100' : 'opacity-0'}`}>
                <span className="text-[9px] font-extrabold text-[#FF0000] drop-shadow-md bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                  {promoTexts[textIndex]}
                </span>
              </div>
            </a>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
