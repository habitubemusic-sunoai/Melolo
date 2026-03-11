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

  const [showLogo, setShowLogo] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [userCity, setUserCity] = useState("Mendeteksi...");

  // Fitur Uang & Ledakan (Posisi & Teks Baru)
  const [showPromo, setShowPromo] = useState(true);
  const [isExploding, setIsExploding] = useState(false);
  // Teks tidak ada yang dobel, sangat menarik
  const promoTexts = ["Klaim Rp10.000", "Tarik ke DANA", "Tonton = Cuan", "Tarik GoPay"];
  const [textIndex, setTextIndex] = useState(0);
  const [fadeText, setFadeText] = useState(true);

  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(false), 20000);

    const explodeTimer = setTimeout(() => {
      setIsExploding(true); 
      setTimeout(() => setShowPromo(false), 5000); 
    }, 15000);

    const textInterval = setInterval(() => {
      setFadeText(false); 
      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % promoTexts.length);
        setFadeText(true); 
      }, 500); 
    }, 3000);

    const fetchLocationByIP = () => {
      fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(res => res.json())
        .then(data => setUserCity(data.city || "Indonesia"))
        .catch(() => setUserCity("Indonesia"));
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
            .then(res => res.json())
            .then(data => {
              const city = data.address.city || data.address.town || data.address.county || "Indonesia";
              setUserCity(city);
            }).catch(fetchLocationByIP);
        },
        () => fetchLocationByIP(),
        { timeout: 5000 }
      );
    } else {
      fetchLocationByIP();
    }

    const clockInterval = setInterval(() => {
      const now = new Date();
      const dateString = now.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });
      const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const offset = -now.getTimezoneOffset() / 60;
      let tzAbbr = offset === 8 ? "WITA" : offset === 9 ? "WIT" : "WIB";
      setCurrentTime(`${dateString} | ${timeString} ${tzAbbr}`);
    }, 1000);

    const buildNotifs = () => {
      const now = new Date();
      const activeNotifs = [];

      const ytDeletedTime = localStorage.getItem('habi_yt_deleted_time');
      let showYtNotif = true;
      if (ytDeletedTime) {
        const hoursDiff = (now.getTime() - parseInt(ytDeletedTime)) / (1000 * 60 * 60);
        if (hoursDiff < 3) showYtNotif = false;
      }

      if (showYtNotif) {
        const ytTexts = [
          "Bantu channel ini berkembang ya! Yuk {link} channel Habi Music sekarang.",
          "Dukung karya kami dengan cara {link} channel resmi kami di YouTube.",
          "Suka aplikasinya? Jangan lupa {link} ke channel kami untuk update seru lainnya!",
          "Terima kasih atas dukunganmu. Silakan {link} channel Habi Entertainment Official."
        ];
        const randomYtText = ytTexts[now.getHours() % ytTexts.length];
        activeNotifs.push({ id: 'yt', type: 'youtube', time: 'Baru saja', text: randomYtText });
      }

      const appDeletedDate = localStorage.getItem('habi_app_deleted_date');
      const todayStr = now.toLocaleDateString('id-ID');
      
      if (appDeletedDate !== todayStr) {
        const appTexts = [
          "Info: Event nonton dapat uang sedang berlangsung. Kumpulkan cuannya sekarang!",
          "Update terbaru: Katalog Melolo dan DramaBox sudah dioptimalkan untukmu.",
          "Selamat datang kembali! Ada banyak drama baru dengan resolusi tinggi menunggumu.",
          "Pemberitahuan: Sistem pencarian semakin cepat, ketik judul favoritmu langsung muncul!",
          "Kejutan harian: Nikmati maraton drama pendek tanpa gangguan iklan pop-up."
        ];
        const randomAppText = appTexts[now.getDay() % appTexts.length];
        const fullDate = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        activeNotifs.push({ id: 'app', type: 'app', time: `${fullDate} | ${timeStr} WIB`, text: randomAppText });
      }

      setNotifs(activeNotifs);
    };

    buildNotifs();

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(explodeTimer);
      clearInterval(clockInterval);
      clearInterval(textInterval);
    };
  }, []);

  const deleteNotif = (id: string) => {
    const now = new Date();
    if (id === 'yt') {
      localStorage.setItem('habi_yt_deleted_time', now.getTime().toString());
    } else if (id === 'app') {
      localStorage.setItem('habi_app_deleted_date', now.toLocaleDateString('id-ID'));
    }
    setNotifs(notifs.filter(n => n.id !== id));
  };

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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            
            <a href="https://www.youtube.com/@habientertainmentofficial" target="_blank" rel="noopener noreferrer" className="relative flex-1 h-10 flex items-center overflow-hidden group">
              <div className={`absolute left-0 transition-all duration-700 ease-in-out flex items-center gap-1 overflow-hidden px-1 py-1 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'}`}>
                {showLogo && (
                  <style dangerouslySetInnerHTML={{__html: `.cahaya-kilau { position: absolute; top: 0; left: -150%; width: 150%; height: 100%; background: linear-gradient(to right, transparent, rgba(255,255,255,0.9), transparent); transform: skewX(-25deg); animation: kilauAnimasi 1.8s ease-in-out 0.2s forwards; z-index: 20; pointer-events: none; } @keyframes kilauAnimasi { 0% { left: -150%; } 100% { left: 150%; } }`}} />
                )}
                <div className="cahaya-kilau"></div>
                <div className="w-[30px] h-[20px] rounded-[5px] bg-[#FF0000] flex items-center justify-center relative z-10">
                  <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                </div>
                <span className="font-sans font-bold text-[20px] tracking-tighter text-black relative z-10 mt-[1px]">
                  Habi Music
                </span>
                {showLogo && (
                  <audio autoPlay preload="auto">
                    <source src="https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg" type="audio/ogg" />
                  </audio>
                )}
              </div>

              <div className={`absolute left-0 transition-all duration-700 ease-in-out flex flex-col justify-center ${!showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}>
                <div className="flex items-center gap-1 text-gray-800 font-bold text-[11px] sm:text-xs tracking-tight">
                  <MapPin className="w-3.5 h-3.5 text-[#FF0000]" />
                  <span>{userCity}</span>
                </div>
                <div className="text-gray-500 font-mono text-[10px] sm:text-[11px] ml-4 font-medium">
                  {currentTime || "Memuat waktu..."}
                </div>
              </div>
            </a>

            <div className="flex items-center gap-1">
              <div className="relative">
                <button onClick={() => setShowNotif(!showNotif)} className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                  <Bell className="w-[22px] h-[22px] text-black" />
                  {notifs.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#FF0000] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-[1.5px] border-white">
                      {notifs.length}
                    </span>
                  )}
                </button>

                {showNotif && (
                  <div className="absolute top-12 right-0 w-[300px] sm:w-[340px] bg-white rounded-xl shadow-[0_5px_25px_rgba(0,0,0,0.15)] border border-gray-100 z-50 overflow-hidden">
                    <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
                      <h3 className="font-bold text-gray-800 text-sm">Notifikasi</h3>
                      <button onClick={() => setShowNotif(false)} className="text-gray-500 hover:text-gray-800"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="p-2 max-h-[60vh] overflow-y-auto">
                      {notifs.length > 0 ? (
                        notifs.map((notif) => (
                          <div key={notif.id} className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg group relative border-b border-gray-50 last:border-0">
                            <div className="w-8 h-8 rounded-md bg-[#FF0000] flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                            </div>
                            <div className="flex-1 pr-6">
                              <p className="text-[10px] text-gray-400 font-medium mb-1">{notif.time}</p>
                              <p className="text-xs text-gray-800 leading-relaxed font-medium">
                                {notif.type === 'youtube' ? (
                                  <>
                                    {notif.text.split('{link}')[0]}
                                    <a href="https://www.youtube.com/@habientertainmentofficial" target="_blank" rel="noopener noreferrer" className="text-[#FF0000] font-bold hover:underline">
                                      Subscribe
                                    </a>
                                    {notif.text.split('{link}')[1]}
                                  </>
                                ) : (
                                  notif.text
                                )}
                              </p>
                            </div>
                            <button onClick={() => deleteNotif(notif.id)} className="absolute top-3 right-3 text-gray-300 hover:text-[#FF0000] transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 flex flex-col items-center justify-center text-gray-400">
                           <Bell className="w-8 h-8 mb-2 opacity-20" />
                           <span className="text-sm">Tidak ada notifikasi baru.</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

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
                  <span className="px-2 py-1 rounded-full bg-red-50 text-[#FF0000] font-bold">{platformInfo.name}</span>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                  {isSearching && normalizedQuery && <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-[#FF0000] border-t-transparent rounded-full animate-spin" /></div>}
                  {isDramaBox && searchResults && searchResults.length > 0 && <div className="grid gap-3">{searchResults.map((drama: any, i: number) => <Link key={drama.bookId} href={`/detail/dramabox/${drama.bookId}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}><img src={drama.cover} alt={drama.bookName} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" /><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 truncate">{drama.bookName}</h3><p className="text-sm text-gray-500 line-clamp-2 mt-2">{drama.introduction}</p></div></Link>)}</div>}
                  {isReelShort && searchResults && searchResults.length > 0 && <div className="grid gap-3">{searchResults.map((book: any, i: number) => <Link key={book.book_id} href={`/detail/reelshort/${book.book_id}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}><img src={book.book_pic} alt={book.book_title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" /><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 truncate">{book.book_title}</h3><p className="text-sm text-gray-500 line-clamp-2 mt-2">{book.special_desc}</p></div></Link>)}</div>}
                   {isNetShort && searchResults && searchResults.length > 0 && <div className="grid gap-3">{searchResults.map((drama: any, i: number) => <Link key={drama.shortPlayId} href={`/detail/netshort/${drama.shortPlayId}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}><img src={drama.cover} alt={drama.title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" /><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 truncate">{drama.title}</h3></div></Link>)}</div>}
                   {isShortMax && searchResults && searchResults.length > 0 && <div className="grid gap-3">{searchResults.map((drama: any, i: number) => <Link key={`${drama.shortPlayId}-${i}`} href={`/detail/shortmax/${drama.shortPlayId}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}><img src={drama.cover} alt={drama.title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" /><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 truncate">{drama.title}</h3></div></Link>)}</div>}
                  {isMelolo && searchResults && searchResults.length > 0 && <div className="grid gap-3">{searchResults.map((book: any, i: number) => <Link key={book.book_id} href={`/detail/melolo/${book.book_id}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}><div className="w-16 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">{book.thumb_url ? <img src={book.thumb_url.includes(".heic") ? `https://wsrv.nl/?url=${encodeURIComponent(book.thumb_url)}&output=jpg` : book.thumb_url} alt={book.book_name} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" /> : <div className="w-full h-full flex items-center justify-center bg-gray-100"><span className="text-xs text-gray-400">No Img</span></div>}</div><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 
