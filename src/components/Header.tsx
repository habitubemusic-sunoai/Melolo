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

  // State Animasi Waktu
  const [showLogo, setShowLogo] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [userCity, setUserCity] = useState("Mendeteksi...");

  // State Fitur Uang & Ledakan
  const [showPromo, setShowPromo] = useState(true);
  const [isExploding, setIsExploding] = useState(false);
  const promoTexts = ["Bonus", "Dapat Uang", "Nonton Dibayar", "Klaim Cuan"];
  const [textIndex, setTextIndex] = useState(0);
  const [fadeText, setFadeText] = useState(true);

  // State Notifikasi
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState<{id: number, time: string, text: string}[]>([]);

  useEffect(() => {
    // --- 1. Timer Logo Transisi ke Jam (10 Detik) ---
    const logoTimer = setTimeout(() => setShowLogo(false), 10000);

    // --- 2. Timer Fitur Uang Meledak (15 Detik) ---
    const explodeTimer = setTimeout(() => {
      setIsExploding(true); // Mulai animasi ledakan
      setTimeout(() => setShowPromo(false), 800); // Hilang total setelah animasi selesai
    }, 15000);

    // --- 3. Rotasi Teks Fitur Uang ---
    const textInterval = setInterval(() => {
      setFadeText(false); 
      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % promoTexts.length);
        setFadeText(true); 
      }, 500); 
    }, 3000);

    // --- 4. Deteksi Kota ---
    fetch('https://get.geojs.io/v1/ip/geo.json')
      .then(res => res.json())
      .then(data => setUserCity(data.city || "Indonesia"))
      .catch(() => setUserCity("Indonesia"));

    // --- 5. Update Jam Real-time ---
    const clockInterval = setInterval(() => {
      const now = new Date();
      const dateString = now.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });
      const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const offset = -now.getTimezoneOffset() / 60;
      let tzAbbr = offset === 8 ? "WITA" : offset === 9 ? "WIT" : "WIB";
      setCurrentTime(`${dateString} | ${timeString} ${tzAbbr}`);
    }, 1000);

    // --- 6. Sistem Notifikasi Harian Permanen ---
    const now = new Date();
    const todayDate = now.toLocaleDateString('id-ID'); 
    const deletedDate = localStorage.getItem('habi_notif_deleted');

    // Jika pesan belum dihapus HARI INI
    if (deletedDate !== todayDate) {
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const dayName = days[now.getDay()];
      const fullDate = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      // Daftar kata-kata yang berganti setiap hari
      const words = [
        "Selamat datang kembali di Habi Music Official! 🎉 Nikmati koleksi drama terbaru kami hari ini.",
        "Halo dari Habi Music Official! Semoga harimu menyenangkan. Jangan lupa klaim bonus harianmu ya!",
        "Habi Music Official menyapamu! Ada banyak update drama seru yang siap menemani waktu luangmu.",
        "Terima kasih sudah setia bersama Habi Music Official. Tonton terus dan nikmati kejutannya!",
        "Selamat beraktivitas! Sempatkan nonton drama favoritmu hari ini eksklusif di Habi Music Official.",
        "Akhir pekan makin seru bareng Habi Music Official! Yuk maraton drama sampai puas.",
        "Hai! Ada episode baru yang menunggu untuk ditonton hari ini di Habi Music Official."
      ];
      const randomWord = words[now.getDay() % words.length];

      setNotifs([{
        id: 1,
        time: `${dayName}, ${fullDate} | ${timeStr} WIB`,
        text: randomWord
      }]);
    }

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(explodeTimer);
      clearInterval(clockInterval);
      clearInterval(textInterval);
    };
  }, []);

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  // Fungsi Hapus Notifikasi (Hilang Permanen Hari Ini)
  const deleteNotif = (id: number) => {
    const today = new Date().toLocaleDateString('id-ID');
    localStorage.setItem('habi_notif_deleted', today);
    setNotifs([]);
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

  if (pathname?.startsWith("/watch")) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            
            {/* LOGO LINK MENUJU APLIKASI YOUTUBE */}
            <a 
              href="https://www.youtube.com/@habientertainmentofficial" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative flex-1 h-10 flex items-center overflow-hidden group"
            >
              {/* === LOGO YOUTUBE STYLE (10 Detik Pertama) === */}
              <div className={`absolute left-0 transition-all duration-700 ease-in-out flex items-center gap-1 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'}`}>
                {/* Ikon YouTube Merah */}
                <div className="w-[30px] h-[20px] rounded-[5px] bg-[#FF0000] flex items-center justify-center relative z-10">
                  <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                </div>
                {/* Teks Habi Music */}
                <span className="font-sans font-bold text-[20px] tracking-tighter text-black relative z-10 mt-[1px]">
                  Habi Music
                </span>
                {/* Suara Sihir Kilauan */}
                {showLogo && (
                  <audio autoPlay preload="auto">
                    <source src="https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg" type="audio/ogg" />
                  </audio>
                )}
              </div>

              {/* === TEKS JAM & KOTA (Setelah 10 Detik) === */}
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

            {/* KANAN: Ikon Lonceng Notif & Search */}
            <div className="flex items-center gap-1">
              
              {/* Lonceng Notifikasi */}
              <div className="relative">
                <button onClick={() => setShowNotif(!showNotif)} className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                  <Bell className="w-[22px] h-[22px] text-black" />
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
                            {/* Logo YouTube Style di Notif */}
                            <div className="w-8 h-8 rounded-md bg-[#FF0000] flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                            </div>
                            <div className="flex-1 pr-6">
                              <p className="text-[10px] text-gray-400 font-medium mb-1">{notif.time}</p>
                              <p className="text-xs text-gray-800 leading-relaxed font-medium">{notif.text}</p>
                            </div>
                            {/* Tombol Hapus */}
                            <button onClick={() => deleteNotif(notif.id)} className="absolute top-3 right-3 text-gray-300 hover:text-[#FF0000] transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="py-6 flex flex-col items-center justify-center text-gray-400">
                           <Bell className="w-8 h-8 mb-2 opacity-20" />
                           <span className="text-sm">Tidak ada notifikasi hari ini.</span>
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
                  <span className="px-2 py-1 rounded-full bg-red-50 text-[#FF0000] font-bold">{platformInfo.name}</span>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                  {isSearching && normalizedQuery && <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-[#FF0000] border-t-transparent rounded-full animate-spin" /></div>}
                  {/* Results Map (Kompak agar tidak panjang) */}
                  {isDramaBox && searchResults && searchResults.length > 0 && <div className="grid gap-3">{searchResults.map((drama: any, i: number) => <Link key={drama.bookId} href={`/detail/dramabox/${drama.bookId}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}><img src={drama.cover} alt={drama.bookName} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" /><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 truncate">{drama.bookName}</h3><p className="text-sm text-gray-500 line-clamp-2 mt-2">{drama.introduction}</p></div></Link>)}</div>}
                  {isReelShort && searchResults && searchResults.length > 0 && <div className="grid gap-3">{searchResults.map((book: any, i: number) => <Link key={book.book_id} href={`/detail/reelshort/${book.book_id}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}><img src={book.book_pic} alt={book.book_title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" /><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 truncate">{book.book_title}</h3><p className="text-sm text-gray-500 line-clamp-2 mt-2">{book.special_desc}</p></div></Link>)}</div>}
                   {isNetShort && searchResults && searchResults.length > 0 && <div className="grid gap-3">{searchResults.map((drama: any, i: number) => <Link key={drama.shortPlayId} href={`/detail/netshort/${drama.shortPlayId}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}><img src={drama.cover} alt={drama.title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" /><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 truncate">{drama.title}</h3></div></Link>)}</div>}
                   {isShortMax && searchResults && searchResults.length > 0 && <div className="grid gap-3">{searchResults.map((drama: any, i: number) => <Link key={`${drama.shortPlayId}-${i}`} href={`/detail/shortmax/${drama.shortPlayId}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}><img src={drama.cover} alt={drama.title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" /><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 truncate">{drama.title}</h3></div></Link>)}</div>}
                  {isMelolo && searchResults && searchResults.length > 0 && <div className="grid gap-3">{searchResults.map((book: any, i: number) => <Link key={book.book_id} href={`/detail/melolo/${book.book_id}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}><div className="w-16 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">{book.thumb_url ? <img src={book.thumb_url.includes(".heic") ? `https://wsrv.nl/?url=${encodeURIComponent(book.thumb_url)}&output=jpg` : book.thumb_url} alt={book.book_name} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" /> : <div className="w-full h-full flex items-center justify-center bg-gray-100"><span className="text-xs text-gray-400">No Img</span></div>}</div><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 truncate">{book.book_name}</h3></div></Link>)}</div>}
                  {isFlickReels && searchResults && searchResults.length > 0 && <div className="grid gap-3">{searchResults.map((book: any, i: number) => <Link key={book.playlet_id} href={`/detail/flickreels/${book.playlet_id}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}><img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" /><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 truncate">{book.title}</h3></div></Link>)}</div>}
                  {isFreeReels && searchResults && searchResults.length > 0 && <div className="grid gap-3">{searchResults.map((book: any, i: number) => <Link key={book.key || i} href={`/detail/freereels/${book.key}`} onClick={handleSearchClose} className="flex gap-4 p-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all text-left animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}><img src={book.coverUrl || book.cover || ""} alt={book.title} className="w-16 h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" referrerPolicy="no-referrer" /><div className="flex-1 min-w-0"><h3 className="font-bold text-gray-900 truncate">{book.title}</h3></div></Link>)}</div>}
                </div>
              </div>
            </div>,
            document.body
          )}
      </header>

      {/* === ANIMASI CSS UNTUK PECAH & UANG JATUH === */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shatterOut {
          0% { transform: scale(1); opacity: 1; filter: brightness(1); }
          20% { transform: scale(1.3) rotate(-15deg); opacity: 1; filter: brightness(1.5); }
          100% { transform: scale(0) rotate(45deg); opacity: 0; filter: brightness(0); }
        }
        @keyframes rainMoney {
          0% { transform: translate(0px, 0px) scale(1) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--tx), 80px) scale(0.5) rotate(var(--rot)); opacity: 0; }
        }
        .explode-effect { animation: shatterOut 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .money-particle {
          position: absolute; top: 50%; left: 50%;
          font-size: 20px; pointer-events: none;
          animation: rainMoney 0.8s ease-out forwards;
        }
      `}} />

      {/* === WIDGET FITUR UANG (Turun ke area 54 Ep) === */}
      {showPromo && typeof document !== "undefined" && createPortal(
        <div className="fixed top-[320px] left-6 z-[40]">
          <div className="relative group flex flex-col items-center">
            
            {/* Animasi Ledakan & Kado */}
            <div className={`relative ${isExploding ? 'explode-effect' : ''}`}>
              
              {/* Partikel Uang yang akan berhamburan saat meledak */}
              {isExploding && (
                <>
                  <div className="money-particle" style={{'--tx': '-30px', '--rot': '-45deg', animationDelay: '0s'} as any}>💸</div>
                  <div className="money-particle" style={{'--tx': '30px', '--rot': '45deg', animationDelay: '0.1s'} as any}>💰</div>
                  <div className="money-particle" style={{'--tx': '0px', '--rot': '180deg', animationDelay: '0.2s'} as any}>🪙</div>
                  <div className="money-particle" style={{'--tx': '-15px', '--rot': '-90deg', animationDelay: '0.15s'} as any}>💸</div>
                </>
              )}

              {/* Ikon Kado & Teks Tanpa Background */}
              {!isExploding && (
                <a 
                  href="https://wa.me/6285119821813?text=Halo%20Admin,%20saya%20mau%20info%20Aplikasi%20Drama%20Penghasil%20Uang!" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center transition-transform hover:scale-110"
                >
                  {/* Emoji Kado dengan bayangan tebal */}
                  <span className="text-[26px] drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]">🎁</span>
                  
                  {/* Teks Animasi Berganti */}
                  <div className={`transition-opacity duration-500 flex flex-col items-center text-center mt-0.5 ${fadeText ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-[10px] font-extrabold text-[#FF0000] drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] bg-white/80 px-1.5 py-0.5 rounded backdrop-blur-sm">
                      {promoTexts[textIndex]}
                    </span>
                  </div>
                </a>
              )}
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
