// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, X, MapPin, Play, Bell, Trash2, StopCircle, Tv, CircleDollarSign } from "lucide-react";
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

  // LOGO & JAM
  const [showLogo, setShowLogo] = useState(true);
  const [userCity, setUserCity] = useState("Indonesia");
  const [currentTime, setCurrentTime] = useState("");

  // SALDO & AKTIVITAS MENONTON
  const [balance, setBalance] = useState(0); 
  const [promoState, setPromoState] = useState('idle'); // idle, progress, hidden
  const [isWatching, setIsWatching] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimeout = useRef(null);

  // MENU 3 PILIHAN
  const [showCoinMenu, setShowCoinMenu] = useState(false);
  
  // NOTIFIKASI DALAM VIDEO & LONCENG
  const [videoToast, setVideoToast] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    setIsMounted(true);

    // Muat Saldo Permanen
    const savedBal = localStorage.getItem('habi_balance');
    if (savedBal) setBalance(Number(savedBal));

    // Loop Logo 20s, Jam 30s
    let loopTimer;
    const runLoop = (isLogo) => {
      setShowLogo(isLogo);
      loopTimer = setTimeout(() => runLoop(!isLogo), isLogo ? 20000 : 30000);
    };
    runLoop(true);

    // Lacak IP
    fetch('https://get.geojs.io/v1/ip/geo.json').then(r=>r.json()).then(d=>setUserCity(d.city||"Indonesia")).catch(()=>setUserCity("Indonesia"));

    // Jam
    const clockInt = setInterval(() => {
      const d = new Date();
      setCurrentTime(`${d.toLocaleDateString('id-ID', {weekday:'short', day:'numeric', month:'short'})} | ${d.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} WIB`);
    }, 1000);

    // Load Default Notifs
    const activeN = [];
    if (!localStorage.getItem('habi_yt_del')) activeN.push({ id:'yt', type:'youtube', time:'Baru saja', text:'Dukung karya kami dengan {link} channel resmi kami.' });
    if (!localStorage.getItem('habi_app_del')) activeN.push({ id:'app', type:'app', time:new Date().toLocaleTimeString('id-ID')+' WIB', text:'Sistem poin aktif! Nonton drama & diamkan layar untuk mulai hasilkan cuan.' });
    setNotifs(activeN);

    // Terima Event Tarik Dana
    const handleWd = (e) => {
      const d = e.detail;
      const t = new Date(d.timestamp).toLocaleTimeString('id-ID')+' WIB';
      setNotifs(p => [{ id:'wd_'+d.id, type:'withdraw', time:t, text:`💳 PROSES PENCAIRAN: Rp100.000 ke ${d.method} (${d.account}) sedang diproses (Pending).` }, ...p]);
      setBalance(prev => prev - 100000);
    };
    window.addEventListener('habi_withdraw_event', handleWd);

    return () => { clearTimeout(loopTimer); clearInterval(clockInt); window.removeEventListener('habi_withdraw_event', handleWd); };
  }, []);

  // DETEKSI SEDANG MENONTON ATAU TIDAK
  useEffect(() => {
    // Jika path ada /detail/ atau /watch/, berarti masuk halaman video
    const isVideoPage = pathname?.includes("/detail") || pathname?.includes("/watch");
    setIsWatching(isVideoPage);

    // Reset idle status jika mouse gerak atau scroll
    const resetIdle = () => {
      setIsIdle(false);
      clearTimeout(idleTimeout.current);
      // Jika diam 5 detik tanpa aktivitas (tapi msh di halaman video), anggap sedang fokus nonton (idle = true)
      idleTimeout.current = setTimeout(() => setIsIdle(true), 5000);
    };

    if (isVideoPage) {
      window.addEventListener('mousemove', resetIdle);
      window.addEventListener('scroll', resetIdle);
      window.addEventListener('touchstart', resetIdle);
      resetIdle(); // trigger awal
    } else {
      setIsIdle(false);
    }

    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('scroll', resetIdle);
      window.removeEventListener('touchstart', resetIdle);
      clearTimeout(idleTimeout.current);
    };
  }, [pathname]);

  // LOGIKA TAMBAH UANG (Hanya saat nonton & diam/fokus)
  useEffect(() => {
    let coinTimer;
    let toastTimer;

    // Jika Koin Aktif (progress) AND di halaman video AND sedang diam fokus nonton
    if (promoState === 'progress' && isWatching && isIdle) {
      coinTimer = setInterval(() => {
        setBalance(prev => {
          // Random dapat Rp 700 - Rp 1300 per sesi selesai (disimulasikan bertahap)
          const earned = Math.floor(Math.random() * (1300 - 700 + 1)) + 700;
          const newBal = prev + earned;
          localStorage.setItem('habi_balance', newBal.toString());
          
          // Munculkan notif kecil dalam video
          setVideoToast(`+Rp ${earned} dari menonton!`);
          clearTimeout(toastTimer);
          toastTimer = setTimeout(() => setVideoToast(null), 3000); // Hilang 3 dtk

          return newBal;
        });
      }, 25000); // Tambah uang tiap 25 detik nonton diam
    }

    return () => { clearInterval(coinTimer); clearTimeout(toastTimer); };
  }, [promoState, isWatching, isIdle]);

  const deleteNotif = (id) => {
    if (id==='yt') localStorage.setItem('habi_yt_del', Date.now().toString());
    if (id==='app') localStorage.setItem('habi_app_del', new Date().toLocaleDateString());
    setNotifs(notifs.filter(n => n.id !== id));
  };

  // AKSI 3 TOMBOL MODAL KOIN
  const actionLanjut = () => setShowCoinMenu(false);
  const actionBerhenti = () => {
    setShowCoinMenu(false);
    setPromoState('hidden');
    alert("Sistem uang dijeda. Saldo aman.");
  };
  const actionIklan = () => {
    setShowCoinMenu(false);
    alert("Sedang memuat iklan bernilai tinggi... (Demo)");
  };

  const { isDramaBox, isReelShort, isShortMax, isNetShort, isMelolo, isFlickReels, isFreeReels, platformInfo } = usePlatform();
  const rawResults = (isDramaBox ? useSearchDramas(normalizedQuery).data : isReelShort ? useReelShortSearch(normalizedQuery).data?.data : []) || [];
  if (pathname?.startsWith("/watch")) return null;
  if (!isMounted) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            
            <a href="https://www.youtube.com/@habientertainmentofficial" target="_blank" className="relative flex-1 h-10 flex items-center overflow-hidden">
              <div className={`absolute left-0 transition-all duration-700 flex items-center gap-1 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'}`}>
                {/* Kilauan & Suara HANYA saat Logo Tampil (Audio HTML default play 1x) */}
                {showLogo && <style dangerouslySetInnerHTML={{__html: `.kilau{position:absolute;top:0;left:-150%;width:150%;height:100%;background:linear-gradient(to right,transparent,rgba(255,255,255,0.9),transparent);transform:skewX(-25deg);animation:k 1.8s forwards;z-index:20;pointer-events:none;}@keyframes k{0%{left:-150%}100%{left:150%}}`}}/>}
                <div className="kilau"></div>
                <div className="w-[30px] h-[20px] rounded-[5px] bg-[#FF0000] flex items-center justify-center relative z-10"><Play className="w-3 h-3 text-white fill-white ml-0.5" /></div>
                <span className="font-sans font-bold text-[20px] tracking-tighter text-black relative z-10 mt-[1px]">Habi Music</span>
                {showLogo && <audio autoPlay><source src="https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg" type="audio/ogg" /></audio>}
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
                  <div className="absolute top-12 right-0 w-[340px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="flex justify-between p-4 border-b bg-gray-50"><h3 className="font-bold text-sm">Pusat Notifikasi</h3><button onClick={() => setShowNotif(false)}><X className="w-4 h-4" /></button></div>
                    <div className="p-2 max-h-[60vh] overflow-y-auto">
                      {notifs.map(n => (
                        <div key={n.id} className={`flex gap-3 p-3 rounded-xl mb-1 ${n.type==='withdraw'?'bg-green-50 border border-green-100':'hover:bg-gray-50'}`}>
                          <div className={`w-8 h-8 rounded-md flex justify-center items-center flex-shrink-0 mt-1 shadow-sm ${n.type==='withdraw'?'bg-green-500':'bg-[#FF0000]'}`}><Play className="w-4 h-4 text-white fill-white ml-0.5" /></div>
                          <div className="flex-1 pr-6">
                            <p className={`text-[10px] font-bold mb-1 ${n.type==='withdraw'?'text-green-700':'text-gray-400'}`}>{n.time}</p>
                            <p className="text-xs text-gray-800 font-medium">
                              {n.type==='youtube'?<>{n.text.split('{link}')[0]}<a href="https://youtube.com" className="text-[#FF0000] font-bold underline">Subscribe</a>{n.text.split('{link}')[1]}</>:n.text}
                            </p>
                          </div>
                          <button onClick={()=>deleteNotif(n.id)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => setSearchOpen(true)} className="p-2 rounded-full hover:bg-gray-100"><Search className="w-[22px] h-[22px] text-black" /></button>
            </div>
          </div>
        </div>
      </header>

      {/* TOAST NOTIF DALAM VIDEO */}
      {videoToast && createPortal(
        <div className="fixed top-[80px] left-1/2 -translate-x-1/2 z-[99999] bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg font-bold text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <span className="text-yellow-400">🪙</span> {videoToast}
        </div>, document.body
      )}

      {/* ANIMASI KOIN RUPIAH KILAU */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes koinPulse { 0%{transform:scale(1);} 5%{transform:scale(1.15) rotate(10deg);} 10%{transform:scale(1) rotate(0deg);} 100%{transform:scale(1);} }
        .koin-hidup { animation: koinPulse 27s infinite; }
        .bg-koin { background: radial-gradient(circle at top left, #fbbf24, #d97706); }
      `}} />

      {/* WIDGET KADO / KOIN (Area 62 Ep) */}
      {promoState !== 'hidden' && createPortal(
        <div className="fixed top-[320px] left-6 z-[40]">
          
          {/* Awal Kado Belum Diklik */}
          {promoState === 'idle' && (
            <button onClick={()=>{setPromoState('progress'); setNotifs(p=>[{id:'sys',type:'app',time:'Baru saja',text:'✨ Sistem deteksi nonton aktif! Diam & fokus nonton video untuk hasilkan saldo otomatis.'},...p]);}} className="flex flex-col items-center hover:scale-110 active:scale-95 outline-none">
              <span className="text-[34px] drop-shadow-md relative z-10">🎁</span>
              <div className="mt-[-8px] relative z-20">
                <span className="text-[9px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full shadow-md border border-white/50">Mulai Hasilkan Uang</span>
              </div>
            </button>
          )}

          {/* Animasi Koin Rupiah Berjalan */}
          {promoState === 'progress' && (
            <button onClick={() => setShowCoinMenu(true)} className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] border-2 border-yellow-300 koin-hidup hover:scale-105 active:scale-95 transition-transform">
              <div className="w-6 h-6 rounded-full bg-koin flex items-center justify-center text-white font-black text-[10px] shadow-inner border border-yellow-200">
                Rp
              </div>
              <span className="text-[13px] font-black text-gray-800 tracking-tight">
                {balance.toLocaleString('id-ID')}
              </span>
            </button>
          )}
        </div>, document.body
      )}

      {/* MODAL 3 PILIHAN SAAT KOIN DIKLIK */}
      {showCoinMenu && createPortal(
        <div className="fixed inset-0 z-[100000] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative">
            <button onClick={() => setShowCoinMenu(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"><X className="w-5 h-5"/></button>
            
            <div className="p-6 text-center border-b border-gray-100">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3">
                <CircleDollarSign className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="font-black text-xl text-gray-900">Pengaturan Koin</h2>
              <p className="text-xs text-gray-500 mt-1 font-medium">Saldo akan bertambah otomatis saat Anda fokus menonton drama.</p>
            </div>
            
            <div className="p-4 space-y-3 bg-gray-50">
              <button onClick={actionLanjut} className="w-full flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-green-100 hover:bg-green-50 active:scale-95 transition-all">
                <div className="flex items-center gap-3"><Tv className="w-6 h-6 text-green-500" /><span className="font-bold text-gray-800">Lanjut Hasilkan Uang</span></div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
              
              <button onClick={actionBerhenti} className="w-full flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-red-100 hover:bg-red-50 active:scale-95 transition-all">
                <div className="flex items-center gap-3"><StopCircle className="w-6 h-6 text-red-500" /><span className="font-bold text-gray-800">Berhenti Menghasilkan Uang</span></div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>

              <button onClick={actionIklan} className="w-full flex items-center justify-between bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-md active:scale-95 transition-all">
                <div className="flex items-center gap-3"><Play className="w-6 h-6 text-white fill-white" /><span className="font-bold text-white">Nonton Iklan (Dapat 10Rb!)</span></div>
              </button>
            </div>
          </div>
        </div>, document.body
      )}
    </>
  );
}
