// @ts-nocheck
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
  const [isMounted, setIsMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const normalizedQuery = debouncedQuery.trim();

  // LOOPING LOGO & WAKTU (20s Logo, 30s Waktu, Berulang)
  const [showLogo, setShowLogo] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [userCity, setUserCity] = useState("Indonesia");

  // FITUR KADO & ILUSI UANG BERJALAN
  // state: 'idle' (15s kado) -> 'exploding' (10s ledakan) -> 'hidden' -> 'progress' (koin berjalan)
  const [promoState, setPromoState] = useState('idle'); 
  const promoTexts = ["Klaim Rp 10.000", "Nonton Dibayar", "Tarik Saldo", "Bonus Cuan!"];
  const [textIndex, setTextIndex] = useState(0);
  const [earnedMoney, setEarnedMoney] = useState(1500); // Saldo awal saat ilusi jalan
  
  // MODAL NOTIFIKASI PROFESIONAL
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    setIsMounted(true); 

    // LOGIKA LOOPING LOGO/WAKTU
    let loopTimer;
    const runLoop = (isLogoView) => {
      setShowLogo(isLogoView);
      loopTimer = setTimeout(() => runLoop(!isLogoView), isLogoView ? 20000 : 30000);
    };
    runLoop(true);

    // Timer Kado (15 Detik Diam -> 10 Detik Meledak)
    let explodeTimer;
    if (promoState === 'idle') {
      explodeTimer = setTimeout(() => {
        setPromoState('exploding');
        setTimeout(() => setPromoState('hidden'), 10000); 
      }, 15000);
    }

    // Rotasi Teks Kado
    const textInterval = setInterval(() => {
      setTextIndex(p => (p + 1) % promoTexts.length);
    }, 3000);

    // Logika Uang Berjalan (Ilusi bertambah terus saat 'progress')
    let progressTimer;
    if (promoState === 'progress') {
      progressTimer = setInterval(() => {
        setEarnedMoney(prev => {
          if (prev >= 10000) return 10000;
          return prev + Math.floor(Math.random() * 55) + 15; // Bertambah random sedikit-sedikit
        });
      }, 3500);
    }

    // Lacak IP
    fetch('https://get.geojs.io/v1/ip/geo.json')
      .then(res => res.json())
      .then(data => setUserCity(data.city || "Indonesia"))
      .catch(() => setUserCity("Indonesia"));

    // Jam
    const clockInterval = setInterval(() => {
      const d = new Date();
      const offset = -d.getTimezoneOffset() / 60;
      setCurrentTime(`${d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })} | ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} ${offset === 8 ? "WITA" : offset === 9 ? "WIT" : "WIB"}`);
    }, 1000);

    // Notif Awal
    const active = [];
    const ytDel = localStorage.getItem('habi_yt_del');
    if (!ytDel || (new Date().getTime() - parseInt(ytDel)) / 3600000 >= 3) {
      active.push({ id: 'yt', type: 'youtube', time: 'Baru saja', text: "Dukung karya kami dengan {link} channel resmi kami." });
    }
    if (localStorage.getItem('habi_app_del') !== new Date().toLocaleDateString('id-ID')) {
      active.push({ id: 'app', type: 'app', time: `${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`, text: "Jangan lupa klik kado di layar untuk mengaktifkan sistem cuan!" });
    }
    setNotifs(active);

    return () => { 
      clearTimeout(loopTimer); clearTimeout(explodeTimer); 
      clearInterval(clockInterval); clearInterval(textInterval); clearInterval(progressTimer);
    };
  }, [promoState]);

  const deleteNotif = (id) => {
    if (id === 'yt') localStorage.setItem('habi_yt_del', new Date().getTime().toString());
    else localStorage.setItem('habi_app_del', new Date().toLocaleDateString('id-ID'));
    setNotifs(notifs.filter(n => n.id !== id));
  };

  // KETIKA KADO DIKLIK
  const handleKadoClick = (e) => {
    e.preventDefault();
    setShowCustomAlert(true); // Munculkan Modal Keren
  };

  // KETIKA PENGGUNA KLIK OKE PADA MODAL ALERT
  const acceptBonus = () => {
    setShowCustomAlert(false);
    setPromoState('progress'); // Ubah kado jadi angka berjalan
    
    // Tambahkan notifikasi baru ke lonceng secara otomatis
    setNotifs(prev => [{
      id: 'sys_' + Date.now(),
      type: 'app',
      time: 'Baru saja',
      text: '✨ Sistem koin berjalan aktif. Tonton drama untuk mengumpulkan Rp10.000!'
    }, ...prev]);
  };

  const { isDramaBox, isReelShort, isShortMax, isNetShort, isMelolo, isFlickReels, isFreeReels, platformInfo } = usePlatform();
  const { data: dbRes } = useSearchDramas(isDramaBox ? normalizedQuery : "");
  const { data: rsRes } = useReelShortSearch(isReelShort ? normalizedQuery : "");
  const { data: nsRes } = useNetShortSearch(isNetShort ? normalizedQuery : "");
  const { data: smRes } = useShortMaxSearch(isShortMax ? normalizedQuery : "");
  const { data: mlRes } = useMeloloSearch(isMelolo ? normalizedQuery : "");
  const { data: frRes } = useFlickReelsSearch(isFlickReels ? normalizedQuery : "");
  const { data: freRes } = useFreeReelsSearch(isFreeReels ? normalizedQuery : "");

  const isSearching = isDramaBox ? false : false; 
  const rawResults = (isDramaBox ? dbRes : isReelShort ? rsRes?.data : isShortMax ? smRes?.data : isNetShort ? nsRes?.data : isMelolo ? mlRes?.data?.search_data?.flatMap(i => i.books || []).filter(b => b.thumb_url) : isFlickReels ? frRes?.data : freRes) || [];

  const getMap = (item) => {
    if (isDramaBox) return { link: `/detail/dramabox/${item.bookId}`, cover: item.cover, title: item.bookName };
    if (isReelShort) return { link: `/detail/reelshort/${item.book_id}`, cover: item.book_pic, title: item.book_title };
    if (isShortMax) return { link: `/detail/shortmax/${item.shortPlayId}`, cover: item.cover, title: item.title };
    if (isNetShort) return { link: `/detail/netshort/${item.shortPlayId}`, cover: item.cover, title: item.title };
    if (isMelolo) return { link: `/detail/melolo/${item.book_id}`, cover: item.thumb_url?.includes(".heic") ? `https://wsrv.nl/?url=${encodeURIComponent(item.thumb_url)}&output=jpg` : item.thumb_url, title: item.book_name };
    if (isFlickReels) return { link: `/detail/flickreels/${item.playlet_id}`, cover: item.cover, title: item.title };
    if (isFreeReels) return { link: `/detail/freereels/${item.key}`, cover: item.coverUrl || item.cover, title: item.title };
    return { link: "", cover: "", title: "" };
  };

  if (pathname?.startsWith("/watch")) return null;
  if (!isMounted) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            
            <a href="https://www.youtube.com/@habientertainmentofficial" target="_blank" rel="noopener noreferrer" className="relative flex-1 h-10 flex items-center overflow-hidden group">
              <div className={`absolute left-0 transition-all duration-700 flex items-center gap-1 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'}`}>
                {showLogo && <style dangerouslySetInnerHTML={{__html: `.kilau { position: absolute; top: 0; left: -150%; width: 150%; height: 100%; background: linear-gradient(to right, transparent, rgba(255,255,255,0.9), transparent); transform: skewX(-25deg); animation: k 1.8s ease-in-out 0.2s forwards; z-index: 20; pointer-events: none; } @keyframes k { 0% { left: -150%; } 100% { left: 150%; } }`}} />}
                <div className="kilau"></div>
                <div className="w-[30px] h-[20px] rounded-[5px] bg-[#FF0000] flex items-center justify-center relative z-10"><Play className="w-3 h-3 text-white fill-white ml-0.5" /></div>
                <span className="font-sans font-bold text-[20px] tracking-tighter text-black relative z-10 mt-[1px]">Habi Music</span>
                {showLogo && <audio autoPlay preload="auto"><source src="https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg" type="audio/ogg" /></audio>}
              </div>

              <div className={`absolute left-0 transition-all duration-700 flex flex-col justify-center ${!showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}>
                <div className="flex items-center gap-1 text-gray-800 font-bold text-[11px] sm:text-xs"><MapPin className="w-3.5 h-3.5 text-[#FF0000]" /><span>{userCity}</span></div>
                <div className="text-gray-500 font-mono text-[10px] ml-4">{currentTime}</div>
              </div>
            </a>

            <div className="flex items-center gap-1">
              <div className="relative">
                <button onClick={() => setShowNotif(!showNotif)} className="p-2 rounded-full hover:bg-gray-100 relative">
                  <Bell className="w-[22px] h-[22px] text-black" />
                  {notifs.length > 0 && <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#FF0000] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-[1.5px] border-white">{notifs.length}</span>}
                </button>
                {showNotif && (
                  <div className="absolute top-12 right-0 w-[300px] bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                    <div className="flex justify-between p-3 border-b bg-gray-50"><h3 className="font-bold text-sm">Notifikasi</h3><button onClick={() => setShowNotif(false)}><X className="w-4 h-4" /></button></div>
                    <div className="p-2 max-h-[60vh] overflow-y-auto">
                      {notifs.length > 0 ? notifs.map(n => (
                        <div key={n.id} className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg relative border-b last:border-0">
                          <div className="w-8 h-8 rounded-md bg-[#FF0000] flex items-center justify-center flex-shrink-0 mt-1"><Play className="w-4 h-4 text-white fill-white ml-0.5" /></div>
                          <div className="flex-1 pr-6">
                            <p className="text-[10px] text-gray-400 mb-1">{n.time}</p>
                            <p className="text-xs text-gray-800 font-medium">
                              {n.type === 'youtube' ? <>{n.text.split('{link}')[0]}<a href="https://www.youtube.com/@habientertainmentofficial" target="_blank" className="text-[#FF0000] font-bold">Subscribe</a>{n.text.split('{link}')[1]}</> : n.text}
                            </p>
                          </div>
                          <button onClick={() => deleteNotif(n.id)} className="absolute top-3 right-3 text-gray-300 hover:text-[#FF0000]"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      )) : <div className="py-8 text-center text-gray-400 text-sm">Tidak ada notifikasi.</div>}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => setSearchOpen(true)} className="p-2 rounded-full hover:bg-gray-100"><Search className="w-[22px] h-[22px] text-black" /></button>
            </div>
          </div>
        </div>

        {/* Search Modal */}
        {searchOpen && createPortal(
          <div className="fixed inset-0 bg-white z-[9999] overflow-hidden flex flex-col px-4 py-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={`Cari di ${platformInfo.name}...`} className="w-full pl-12 bg-gray-50 border border-gray-200 rounded-2xl py-3 outline-none" autoFocus /></div>
              <button onClick={() => setSearchOpen(false)} className="p-3 bg-gray-100 rounded-xl"><X className="w-5 h-5 text-gray-700" /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {rawResults.length > 0 && <div className="grid gap-3">{rawResults.map((item, i) => {
                const res = getMap(item);
                return (
                  <Link key={i} href={res.link} onClick={() => setSearchOpen(false)} className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm animate-fade-up">
                    <div className="w-16 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">{res.cover ? <img src={res.cover} alt={res.title} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" /> : <span className="text-xs text-gray-400 flex h-full items-center justify-center">No Img</span>}</div>
                    <div className="flex-1 min-w-0"><h3 className="font-bold truncate text-gray-900">{res.title}</h3></div>
                  </Link>
                );
              })}</div>}
            </div>
          </div>, document.body
        )}
      </header>

      {/* CUSTOM ALERT MODAL PROFESIONAL (Menggantikan Alert Bawaan) */}
      {showCustomAlert && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100000] px-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-xs p-6 shadow-2xl text-center relative overflow-hidden animate-in zoom-in-95">
            {/* Latar Belakang Dekoratif */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-red-50 to-white"></div>
            
            {/* Logo Tengah */}
            <div className="relative w-16 h-16 mx-auto bg-[#FF0000] rounded-2xl flex items-center justify-center shadow-lg mb-5 transform rotate-3">
               <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
            
            <h3 className="text-xl font-black text-gray-900 mb-2">✨ SISTEM KOIN AKTIF!</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Persentase uang akan berjalan otomatis saat video diputar. Tonton sampai habis untuk mendapatkan <span className="font-bold text-red-500">Rp 10.000</span>.
            </p>
            
            <button onClick={acceptBonus} className="w-full bg-[#FF0000] text-white font-bold py-3.5 rounded-xl hover:bg-red-600 transition-colors shadow-md">
              Mulai Kumpulkan Uang
            </button>
          </div>
        </div>, document.body
      )}

      {/* ANIMASI CSS UANG JATUH (Diperbaiki agar meledaknya kelihatan) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes kadoPop { 0% { transform: scale(1); } 50% { transform: scale(1.3) rotate(-10deg); filter: brightness(1.2); } 100% { transform: scale(0); opacity: 0; } }
        @keyframes fall { 0% { transform: translate(0,0) scale(0.5); opacity: 1; } 100% { transform: translate(var(--tx), 150px) scale(1.2) rotate(var(--rot)); opacity: 0; } }
        
        .kado-meledak { animation: kadoPop 0.5s ease-in forwards; }
        .koin-hujan { position: absolute; top: 30%; left: 30%; font-weight: 900; pointer-events: none; opacity: 0; text-shadow: 0px 2px 4px rgba(0,0,0,0.4); animation: fall 10s ease-out forwards; }
      `}} />

      {/* WIDGET KADO ATAU ANGKA BERJALAN (Area "62 Ep") */}
      {promoState !== 'hidden' && createPortal(
        <div className="fixed top-[320px] left-6 z-[40]">
          <div className="relative flex flex-col items-center">
            
            {/* STATE: LEDAKAN HUJAN UANG */}
            {promoState === 'exploding' && (
              <div className="relative kado-meledak">
                <div className="koin-hujan text-green-600 text-[14px]" style={{"--tx":"-40px", "--rot":"-45deg", animationDelay:"0s"}}>Rp 50K</div>
                <div className="koin-hujan text-yellow-500 text-[16px]" style={{"--tx":"50px", "--rot":"30deg", animationDelay:"0.1s"}}>Rp 100K</div>
                <div className="koin-hujan text-green-500 text-[20px]" style={{"--tx":"0px", "--rot":"180deg", animationDelay:"0.2s"}}>💸</div>
                <div className="koin-hujan text-yellow-600 text-[18px]" style={{"--tx":"-20px", "--rot":"-90deg", animationDelay:"0.3s"}}>🪙</div>
                <div className="koin-hujan text-red-500 text-[14px]" style={{"--tx":"30px", "--rot":"60deg", animationDelay:"0.15s"}}>Rp 200K</div>
              </div>
            )}
            
            {/* STATE: DIAM (KADO BISA DIKLIK) */}
            {promoState === 'idle' && (
              <button onClick={handleKadoClick} className="flex flex-col items-center justify-center transition-transform hover:scale-110 active:scale-95 outline-none">
                <span className="text-[34px] drop-shadow-md relative z-10">🎁</span>
                <div className="mt-[-8px] relative z-20">
                  {/* Desain Teks Super Jelas (Pil Merah Solid) */}
                  <span className="text-[9px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full shadow-md border border-white/50 whitespace-nowrap">
                    {promoTexts[textIndex]}
                  </span>
                </div>
              </button>
            )}

            {/* STATE: PROGRESS UANG BERJALAN ILUSI (Setelah diklik Ok) */}
            {promoState === 'progress' && (
              <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-yellow-200 flex items-center gap-1.5 animate-in fade-in zoom-in slide-in-from-bottom-5">
                <span className="text-[14px] animate-spin-slow">🪙</span>
                <span className="text-[11px] font-bold text-gray-800">
                  Rp {earnedMoney.toLocaleString('id-ID')}
                </span>
              </div>
            )}

          </div>
        </div>, document.body
      )}
    </>
  );
}
