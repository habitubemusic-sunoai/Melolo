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
  const nQuery = useDebounce(searchQuery, 300).trim();

  const [showLogo, setShowLogo] = useState(true);
  const [userCity, setUserCity] = useState("Indonesia");
  const [currentTime, setCurrentTime] = useState("");
  const [balance, setBalance] = useState(0); 
  const [promoState, setPromoState] = useState('idle'); 
  const promoTexts = ["Klaim Rp 10.000", "Nonton Dibayar", "Tarik Saldo", "Bonus Cuan!"];
  const [textIndex, setTextIndex] = useState(0);
  const [isWatching, setIsWatching] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimeout = useRef(null);
  const [showCoinMenu, setShowCoinMenu] = useState(false);
  const [videoToast, setVideoToast] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    setIsMounted(true);
    const sBal = localStorage.getItem('habi_balance');
    if (sBal) setBalance(Number(sBal));

    let lTimer;
    const runL = (isL) => { setShowLogo(isL); lTimer = setTimeout(() => runL(!isL), isL ? 20000 : 30000); };
    runL(true);

    let expT;
    if (promoState === 'idle') {
      expT = setTimeout(() => { setPromoState('exploding'); setTimeout(() => setPromoState('hidden'), 10000); }, 15000);
    }
    const txtInt = setInterval(() => setTextIndex(p => (p + 1) % 4), 3000);

    fetch('https://get.geojs.io/v1/ip/geo.json').then(r=>r.json()).then(d=>setUserCity(d.city||"Indonesia")).catch(()=>{});
    const cInt = setInterval(() => {
      const d = new Date();
      setCurrentTime(`${d.toLocaleDateString('id-ID', {weekday:'short', day:'numeric', month:'short'})} | ${d.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} WIB`);
    }, 1000);

    const actN = [];
    if (!localStorage.getItem('habi_yt_del')) actN.push({ id:'yt', type:'youtube', time:'Baru saja', text:'Dukung karya kami dengan {link} channel resmi kami.' });
    if (!localStorage.getItem('habi_app_del')) actN.push({ id:'app', type:'app', time:new Date().toLocaleTimeString('id-ID')+' WIB', text:'Sistem poin aktif! Nonton drama & diamkan layar untuk mulai hasilkan cuan.' });
    setNotifs(actN);

    const handleWd = (e) => {
      const d = e.detail;
      const t = new Date(d.timestamp).toLocaleTimeString('id-ID')+' WIB';
      setNotifs(p => [{ id:'wd_'+d.id, type:'withdraw', time:t, text:`💳 PROSES PENDING: Rp100.000 ke ${d.method} (${d.account}) sedang diproses.` }, ...p]);
      setBalance(prev => prev - 100000);
    };
    window.addEventListener('habi_withdraw_event', handleWd);

    return () => { clearTimeout(lTimer); clearTimeout(expT); clearInterval(cInt); clearInterval(txtInt); window.removeEventListener('habi_withdraw_event', handleWd); };
  }, [promoState]);

  useEffect(() => {
    const isV = pathname?.includes("/detail") || pathname?.includes("/watch");
    setIsWatching(isV);
    const resetI = () => { setIsIdle(false); clearTimeout(idleTimeout.current); idleTimeout.current = setTimeout(() => setIsIdle(true), 5000); };
    if (isV) { window.addEventListener('mousemove', resetI); window.addEventListener('scroll', resetI); window.addEventListener('touchstart', resetI); resetI(); } 
    else setIsIdle(false);
    return () => { window.removeEventListener('mousemove', resetI); window.removeEventListener('scroll', resetI); window.removeEventListener('touchstart', resetI); clearTimeout(idleTimeout.current); };
  }, [pathname]);

  useEffect(() => {
    let cT, tT;
    if (promoState === 'progress' && isWatching && isIdle) {
      cT = setInterval(() => {
        setBalance(p => {
          const e = Math.floor(Math.random() * 601) + 700;
          const nB = p + e;
          localStorage.setItem('habi_balance', nB.toString());
          setVideoToast(`+Rp ${e} dari menonton!`);
          clearTimeout(tT); tT = setTimeout(() => setVideoToast(null), 3000);
          return nB;
        });
      }, 25000);
    }
    return () => { clearInterval(cT); clearTimeout(tT); };
  }, [promoState, isWatching, isIdle]);

  const delN = (id) => {
    if (id==='yt') localStorage.setItem('habi_yt_del', Date.now().toString());
    if (id==='app') localStorage.setItem('habi_app_del', new Date().toLocaleDateString());
    setNotifs(notifs.filter(n => n.id !== id));
  };

  const actBerhenti = () => { setShowCoinMenu(false); setPromoState('hidden'); alert("Sistem uang dijeda. Saldo aman."); };
  
  const { isDramaBox, isReelShort, isShortMax, isNetShort, isMelolo, isFlickReels, isFreeReels, platformInfo } = usePlatform();
  const rawR = (isDramaBox ? useSearchDramas(nQuery).data : isReelShort ? useReelShortSearch(nQuery).data?.data : isShortMax ? useShortMaxSearch(nQuery).data?.data : isNetShort ? useNetShortSearch(nQuery).data?.data : isMelolo ? useMeloloSearch(nQuery).data?.data?.search_data?.flatMap(i=>i.books||[]).filter(b=>b.thumb_url) : isFlickReels ? useFlickReelsSearch(nQuery).data?.data : useFreeReelsSearch(nQuery).data) || [];
  
  const getMap = (i) => {
    if(isDramaBox) return {l:`/detail/dramabox/${i.bookId}`, c:i.cover, t:i.bookName};
    if(isReelShort) return {l:`/detail/reelshort/${i.book_id}`, c:i.book_pic, t:i.book_title};
    if(isShortMax) return {l:`/detail/shortmax/${i.shortPlayId}`, c:i.cover, t:i.title};
    if(isNetShort) return {l:`/detail/netshort/${i.shortPlayId}`, c:i.cover, t:i.title};
    if(isMelolo) return {l:`/detail/melolo/${i.book_id}`, c:i.thumb_url, t:i.book_name};
    if(isFlickReels) return {l:`/detail/flickreels/${i.playlet_id}`, c:i.cover, t:i.title};
    return {l:`/detail/freereels/${i.key}`, c:i.coverUrl||i.cover, t:i.title};
  };

  if (pathname?.startsWith("/watch") || !isMounted) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <a href="https://youtube.com/@habientertainmentofficial" target="_blank" className="relative flex-1 h-10 flex items-center overflow-hidden">
            <div className={`absolute left-0 transition-all duration-700 flex items-center gap-1 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'}`}>
              {showLogo && <style dangerouslySetInnerHTML={{__html: `.kilau{position:absolute;top:0;left:-150%;width:150%;height:100%;background:linear-gradient(to right,transparent,rgba(255,255,255,0.9),transparent);transform:skewX(-25deg);animation:k 1.8s forwards;z-index:20;pointer-events:none;}@keyframes k{0%{left:-150%}100%{left:150%}}`}}/>}
              <div className="kilau"></div><div className="w-[30px] h-[20px] rounded-[5px] bg-[#FF0000] flex items-center justify-center relative z-10"><Play className="w-3 h-3 text-white fill-white ml-0.5" /></div><span className="font-sans font-bold text-[20px] tracking-tighter text-black relative z-10 mt-[1px]">Habi Music</span>
              {showLogo && <audio autoPlay><source src="https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg" type="audio/ogg" /></audio>}
            </div>
            <div className={`absolute left-0 transition-all duration-700 flex flex-col justify-center ${!showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}>
              <div className="flex items-center gap-1 text-gray-800 font-bold text-[11px] sm:text-xs"><MapPin className="w-3.5 h-3.5 text-[#FF0000]" /><span>{userCity}</span></div><div className="text-gray-500 font-mono text-[10px] ml-4">{currentTime}</div>
            </div>
          </a>
          <div className="flex items-center gap-1">
            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className="p-2 rounded-full hover:bg-gray-100 relative"><Bell className="w-[22px] h-[22px] text-black" />{notifs.length > 0 && <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#FF0000] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{notifs.length}</span>}</button>
              {showNotif && (
                <div className="absolute top-12 right-0 w-[340px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"><div className="flex justify-between p-4 border-b bg-gray-50"><h3 className="font-bold text-sm">Pusat Notifikasi</h3><button onClick={() => setShowNotif(false)}><X className="w-4 h-4" /></button></div><div className="p-2 max-h-[60vh] overflow-y-auto">
                    {notifs.map(n => (<div key={n.id} className={`flex gap-3 p-3 rounded-xl mb-1 ${n.type==='withdraw'?'bg-green-50 border border-green-100':'hover:bg-gray-50'}`}><div className={`w-8 h-8 rounded-md flex justify-center items-center flex-shrink-0 mt-1 shadow-sm ${n.type==='withdraw'?'bg-green-500':'bg-[#FF0000]'}`}><Play className="w-4 h-4 text-white fill-white ml-0.5" /></div><div className="flex-1 pr-6"><p className={`text-[10px] font-bold mb-1 ${n.type==='withdraw'?'text-green-700':'text-gray-400'}`}>{n.time}</p><p className="text-xs text-gray-800 font-medium">{n.type==='youtube'?<>{n.text.split('{link}')[0]}<a href="https://youtube.com/@habientertainmentofficial" target="_blank" className="text-[#FF0000] font-bold underline">Subscribe</a>{n.text.split('{link}')[1]}</>:n.text}</p></div><button onClick={()=>delN(n.id)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></div>))}
                </div></div>
              )}
            </div>
            <button onClick={() => setSearchOpen(true)} className="p-2 rounded-full hover:bg-gray-100"><Search className="w-[22px] h-[22px] text-black" /></button>
          </div>
        </div>
        {searchOpen && createPortal(<div className="fixed inset-0 bg-white z-[9999] flex flex-col px-4 py-6"><div className="flex items-center gap-4 mb-6"><div className="flex-1 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={`Cari di ${platformInfo.name}...`} className="w-full pl-12 bg-gray-50 border border-gray-200 rounded-2xl py-3 outline-none" autoFocus /></div><button onClick={() => setSearchOpen(false)} className="p-3 bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button></div><div className="flex-1 overflow-y-auto"><div className="grid gap-3">{rawR.map((item, i) => { const r = getMap(item); return (<Link key={i} href={r.l} onClick={() => setSearchOpen(false)} className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm"><div className="w-16 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">{r.c ? <img src={r.c} className="w-full h-full object-cover" /> : <span>No Img</span>}</div><div className="flex-1"><h3 className="font-bold text-gray-900">{r.t}</h3></div></Link>); })}</div></div></div>, document.body)}
      </header>

      {videoToast && createPortal(<div className="fixed top-[80px] left-1/2 -translate-x-1/2 z-[99999] bg-black/80 text-white px-4 py-2 rounded-full shadow-lg font-bold text-xs flex items-center gap-2 animate-in fade-in"><span className="text-yellow-400">🪙</span> {videoToast}</div>, document.body)}
      <style dangerouslySetInnerHTML={{__html: `@keyframes koinPulse{0%{transform:scale(1)}5%{transform:scale(1.15) rotate(10deg)}10%{transform:scale(1) rotate(0deg)}100%{transform:scale(1)}}.kh{animation:koinPulse 27s infinite}.bk{background:radial-gradient(circle at top left,#fbbf24,#d97706)}@keyframes kadoPop{0%{transform:scale(1)}50%{transform:scale(1.3) rotate(-10deg);filter:brightness(1.2)}100%{transform:scale(0);opacity:0}}@keyframes fall{0%{transform:translate(0,0) scale(0.5);opacity:1}100%{transform:translate(var(--tx),150px) scale(1.2) rotate(var(--rot));opacity:0}}.km{animation:kadoPop 0.5s forwards}.khu{position:absolute;top:30%;left:30%;font-weight:900;pointer-events:none;opacity:0;animation:fall 10s ease-out forwards}`}} />

      {promoState !== 'hidden' && createPortal(
        <div className="fixed top-[320px] left-6 z-[40]">
          {promoState === 'exploding' && (<div className="relative km"><div className="khu text-green-600 text-[14px]" style={{"--tx":"-40px","--rot":"-45deg",animationDelay:"0s"}}>Rp 50K</div><div className="khu text-yellow-500 text-[16px]" style={{"--tx":"50px","--rot":"30deg",animationDelay:"0.1s"}}>Rp 100K</div><div className="khu text-green-500 text-[20px]" style={{"--tx":"0px","--rot":"180deg",animationDelay:"0.2s"}}>💸</div><div className="khu text-yellow-600 text-[18px]" style={{"--tx":"-20px","--rot":"-90deg",animationDelay:"0.3s"}}>🪙</div><div className="khu text-red-500 text-[14px]" style={{"--tx":"30px","--rot":"60deg",animationDelay:"0.15s"}}>Rp 200K</div></div>)}
          {promoState === 'idle' && (<button onClick={()=>{setPromoState('progress'); setNotifs(p=>[{id:'sys',type:'app',time:'Baru saja',text:'✨ Sistem deteksi nonton aktif! Diam & fokus nonton video untuk hasilkan saldo otomatis.'},...p]);}} className="flex flex-col items-center hover:scale-110 outline-none"><span className="text-[34px] drop-shadow-md relative z-10">🎁</span><div className="mt-[-8px] relative z-20"><span className="text-[9px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full shadow-md border border-white/50">{promoTexts[textIndex]}</span></div></button>)}
          {promoState === 'progress' && (<button onClick={() => setShowCoinMenu(true)} className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] border-2 border-yellow-300 kh"><div className="w-6 h-6 rounded-full bk flex items-center justify-center text-white font-black text-[10px] shadow-inner border border-yellow-200">Rp</div><span className="text-[13px] font-black text-gray-800 tracking-tight">{balance.toLocaleString('id-ID')}</span></button>)}
        </div>, document.body
      )}

      {showCoinMenu && createPortal(
        <div className="fixed inset-0 z-[100000] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 animate-in fade-in zoom-in duration-200"><div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative"><button onClick={()=>setShowCoinMenu(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"><X className="w-5 h-5"/></button><div className="p-6 text-center border-b border-gray-100"><div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3"><CircleDollarSign className="w-8 h-8 text-yellow-600" /></div><h2 className="font-black text-xl text-gray-900">Pengaturan Koin</h2><p className="text-xs text-gray-500 mt-1 font-medium">Saldo bertambah otomatis saat Anda fokus menonton drama.</p></div><div className="p-4 space-y-3 bg-gray-50"><button onClick={()=>setShowCoinMenu(false)} className="w-full flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-green-100 hover:bg-green-50"><div className="flex items-center gap-3"><Tv className="w-6 h-6 text-green-500" /><span className="font-bold text-gray-800">Lanjut Hasilkan Uang</span></div></button><button onClick={actBerhenti} className="w-full flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-red-100 hover:bg-red-50"><div className="flex items-center gap-3"><StopCircle className="w-6 h-6 text-red-500" /><span className="font-bold text-gray-800">Berhenti Menghasilkan Uang</span></div></button><button onClick={()=>{setShowCoinMenu(false); alert("Memuat iklan... (Demo)");}} className="w-full flex items-center justify-between bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-md"><div className="flex items-center gap-3"><Play className="w-6 h-6 text-white fill-white" /><span className="font-bold text-white">Nonton Iklan (Dapat 10Rb!)</span></div></button></div></div></div>, document.body
      )}
    </>
  );
}
