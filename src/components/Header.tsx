// @ts-nocheck
/* eslint-disable */
"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, X, MapPin, Play, Bell, Trash2, StopCircle, Tv, CircleDollarSign, MessageCircle, Send, Check, CheckCheck, ArrowLeft, User, Video, Phone, MoreVertical, Paperclip, Camera, Smile, Clock } from "lucide-react";
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
  const [userCity, setUserCity] = useState("Mencari Lokasi...");
  const [currentTime, setCurrentTime] = useState("");
  const [balance, setBalance] = useState(0); 
  const [promoState, setPromoState] = useState('idle'); 
  const [tIdx, setTIdx] = useState(0);
  const [isWatching, setIsWatching] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimeout = useRef(null);
  const [showCoinMenu, setShowCoinMenu] = useState(false);
  const [videoToast, setVideoToast] = useState(null);
  
  const [csSt, setCsSt] = useState("Online");
  const [chatMode, setChatMode] = useState('idle'); 
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chats, setChats] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const chatRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojis = ["😀","😂","🤣","😍","🙏","👍","😭","😎","🥰","😊","🥺","🔥","🤔","💡","✅","❌"];
  const pTexts = ["Klaim Rp 10.000", "Nonton Dibayar", "Tarik Saldo", "Bonus Cuan!"];

  const { isDramaBox, isReelShort, isShortMax, isNetShort, isMelolo, isFlickReels, isFreeReels, platformInfo } = usePlatform();
  const dbRes = useSearchDramas(isDramaBox ? nQuery : "");
  const rsRes = useReelShortSearch(isReelShort ? nQuery : "");
  const nsRes = useNetShortSearch(isNetShort ? nQuery : "");
  const smRes = useShortMaxSearch(isShortMax ? nQuery : "");
  const mlRes = useMeloloSearch(isMelolo ? nQuery : "");
  const frRes = useFlickReelsSearch(isFlickReels ? nQuery : "");
  const freRes = useFreeReelsSearch(isFreeReels ? nQuery : "");

  useEffect(() => {
    setIsMounted(true);
    const sBal = localStorage.getItem('habi_balance');
    if(sBal) setBalance(Number(sBal));

    let lTimer;
    const runL = (isL) => { setShowLogo(isL); lTimer = setTimeout(() => runL(!isL), isL ? 20000 : 30000); };
    runL(true);

    let eT;
    if(promoState === 'idle') { eT = setTimeout(() => { setPromoState('exploding'); setTimeout(() => setPromoState('hidden'), 10000); }, 15000); }
    const tInt = setInterval(() => setTIdx(p => (p + 1) % 4), 3000);

    if("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${p.coords.latitude}&lon=${p.coords.longitude}`).then(r=>r.json()).then(d=>setUserCity(d.address?.city||d.address?.town||d.address?.county||"Indonesia")).catch(()=>setUserCity("Indonesia")),
        () => fetch('https://get.geojs.io/v1/ip/geo.json').then(r=>r.json()).then(d=>setUserCity(d.city||"Indonesia")).catch(()=>setUserCity("Indonesia")), { timeout: 10000, enableHighAccuracy: true }
      );
    }
    const cInt = setInterval(() => {
      const d = new Date();
      setCurrentTime(d.toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'}) + ' | ' + d.toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true}));
    }, 1000);

    const aN = [];
    const tS = new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:true});
    if(!localStorage.getItem('habi_yt_del')) {
      aN.push({ id:'yt', type:'youtube', time:tS, title:'Admin Habi', text:'Dukung karya kami dengan {link} channel resmi kami.' });
    }
    setNotifs(aN);

    const handleWd = (e) => {
      const d = e.detail;
      const tm = new Date(d.timestamp).toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:true});
      setNotifs(p => [{ id:'wd_'+d.id, type:'withdraw', time:tm, title:'Finance', text:`💳 PENDING: Rp100.000 ke ${d.method} (${d.account}) sedang diproses.` }, ...p]);
    };
    window.addEventListener('habi_withdraw_event', handleWd);

    return () => { clearTimeout(lTimer); clearTimeout(eT); clearInterval(cInt); clearInterval(tInt); window.removeEventListener('habi_withdraw_event', handleWd); };
  }, [promoState]);

  useEffect(() => {
    const isV = pathname?.includes("/detail") || pathname?.includes("/watch");
    setIsWatching(isV);
    const resetI = () => { setIsIdle(false); clearTimeout(idleTimeout.current); idleTimeout.current = setTimeout(() => setIsIdle(true), 5000); };
    if(isV) { window.addEventListener('mousemove', resetI); window.addEventListener('scroll', resetI); window.addEventListener('touchstart', resetI); resetI(); } 
    else setIsIdle(false);
    return () => { window.removeEventListener('mousemove', resetI); window.removeEventListener('scroll', resetI); window.removeEventListener('touchstart', resetI); clearTimeout(idleTimeout.current); };
  }, [pathname]);

  useEffect(() => {
    let cT, tT;
    if(promoState === 'progress' && isWatching && isIdle) {
      cT = setInterval(() => {
        setBalance(p => {
          const e = Math.floor(Math.random() * (1300 - 700 + 1)) + 700;
          const nB = p + e;
          localStorage.setItem('habi_balance', nB.toString());
          setVideoToast(`+Rp ${e}`);
          clearTimeout(tT); tT = setTimeout(() => setVideoToast(null), 3000);
          return nB;
        });
      }, 25000); 
    }
    return () => { clearInterval(cT); clearTimeout(tT); };
  }, [promoState, isWatching, isIdle]);

  useEffect(() => { if(chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [chats, chatOpen, csSt, chatMode]);

  const openChatCS = () => {
    setChatOpen(true);
    if(chatMode === 'idle') {
      setChatMode('queue'); setCsSt("Mencari CS yang tersedia...");
      setTimeout(() => {
        setCsSt("Antrean ke-1...");
        setTimeout(() => {
          setChatMode('connected'); setCsSt("Online");
          setChats([{ id:'c1', sender:'admin', time:new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:true}), text:`Halo Kak! Aku CS Habi Music. Ada yang mau ditanyain soal aplikasi atau penarikan dana? 😊` }]);
        }, 3000);
      }, 2500);
    }
  };

  const getBase64 = (file) => new Promise((res) => {
    const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => res(reader.result.split(',')[1]);
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const url = URL.createObjectURL(file);
    const b64 = await getBase64(file);
    sendChatCore("Tolong bantu cek screenshot ini ya Kak", true, url, b64, file.type);
  };

  const sendChat = (e) => { e.preventDefault(); sendChatCore(chatInput, false, null, null, null); setShowEmoji(false); };

  const sendChatCore = async (text, isImg=false, imgUrl=null, base64=null, mimeType=null) => {
    if(!isImg && !text.trim()) return;
    if(chatMode !== 'connected') return;
    
    const msgId = Date.now().toString();
    const tStr = new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:true});
    setChats(p => [...p, { id:msgId, sender:'user', time:tStr, text:text, img:imgUrl, status:'sent' }]);
    if(!isImg) setChatInput("");

    const readDelay = Math.floor(Math.random() * 2000) + 1000; 
    
    setTimeout(async () => {
      setChats(p => p.map(m => m.id === msgId ? {...m, status:'read'} : m)); 
      setCsSt("Mengetik..."); 
      
      let reply = "";
      try {
        const chatHistory = chats.map(c => ({ sender: c.sender, text: c.text }));
        const payload = { history: chatHistory, message: text, image: isImg && base64 ? { base64, mimeType } : null };

        const res = await fetch("/api/chat", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
        });
        
        if (!res.ok) throw new Error("Backend failed");
        const data = await res.json();
        if(data.error) throw new Error("API failed");
        
        reply = data.reply;
      } catch(err) {
        // Otak Cadangan Anti-Ngelag
        const l = text.toLowerCase();
        if(isImg) reply = "Baik Kak, gambar screenshotnya udah aku terima ya. Lagi dicek sama tim teknis 🙏";
        else if (l.match(/assalamu|salam|samlekom/)) reply = "Waalaikumsalam Kak 🙏 Ada yang bisa aku bantu untuk aplikasinya?";
        else if (l.match(/cair|tarik|uang|wd|gopay|dana/)) reply = "Pencairan butuh 1-3 hari kerja ya Kak 😊 Ditunggu aja.";
        else if (l.match(/kok|lama|belum|mana/)) reply = "Maaf banget ya Kak bikin nunggu 🙏 Antrean penarikan emang lagi padat, pasti masuk kok uangnya!";
        else if (l.match(/gimana|cara/)) reply = "Kakak tinggal diem dan fokus nonton videonya aja, nanti koinnya nambah otomatis.";
        else if (l.match(/bohong|tipu|scam/)) reply = "Kita amanah 100% kok Kak 😊 Saldo pasti ditransfer.";
        else if (l.match(/halo|hai|pagi|siang|malam|p/)) reply = `Halo Kak! Ada kendala yang bisa aku bantu?`;
        else if (l.match(/lagi apa|sibuk|makan/)) reply = "Lagi standby nungguin chat dari Kakak nih hehe 😊";
        else if (l.match(/bot|robot|ai/)) reply = `Aku orang asli tau Kak 😂 Ada kendala apa nih di aplikasinya?`;
        else if (l.match(/ok|sip|y|baik|makasih|thanks/)) reply = "Sama-sama Kak! Kalau ada apa-apa chat aku lagi ya 😊";
        else reply = "Walah gitu ya Kak hehe 😂 Terus kelanjutannya gimana tuh? Btw koin aplikasinya sejauh ini aman kan?";
      }

      const typingDuration = Math.min(Math.max(reply.length * 60, 4000), 18000); 

      setTimeout(() => {
        setCsSt("Online"); 
        setTimeout(() => {
          setCsSt("Mengetik..."); 
          setTimeout(() => {
            setChats(p => [...p, { id:Date.now().toString(), sender:'admin', time:new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:true}), text:reply }]);
            setCsSt("Online");
          }, Math.floor(Math.random() * 2000) + 2000); 
        }, 1000); 
      }, typingDuration - 3000);

    }, readDelay);
  };

  const rawR = (isDramaBox ? dbRes?.data : isReelShort ? rsRes?.data?.data : isShortMax ? smRes?.data?.data : isNetShort ? nsRes?.data?.data : isMelolo ? mlRes?.data?.data?.search_data?.flatMap(i=>i.books||[]).filter(b=>b.thumb_url) : isFlickReels ? frRes?.data?.data : freRes?.data) || [];
  const getMap = (i) => {
    if(isDramaBox) return {l:`/detail/dramabox/${i.bookId}`, c:i.cover, t:i.bookName};
    if(isReelShort) return {l:`/detail/reelshort/${i.book_id}`, c:i.book_pic, t:i.book_title};
    if(isShortMax) return {l:`/detail/shortmax/${i.shortPlayId}`, c:i.cover, t:i.title};
    if(isNetShort) return {l:`/detail/netshort/${i.shortPlayId}`, c:i.cover, t:i.title};
    if(isMelolo) return {l:`/detail/melolo/${i.book_id}`, c:i.thumb_url?.includes(".heic")?`https://wsrv.nl/?url=${encodeURIComponent(i.thumb_url)}&output=jpg`:i.thumb_url, t:i.book_name};
    if(isFlickReels) return {l:`/detail/flickreels/${i.playlet_id}`, c:i.cover, t:i.title};
    return {l:`/detail/freereels/${i.key}`, c:i.coverUrl||i.cover, t:i.title};
  };

  if(!isMounted || pathname?.startsWith("/watch")) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-[60px]">
          <Link href="/" className="relative flex-1 h-12 flex items-center overflow-hidden">
            <div className={`absolute left-0 transition-all duration-700 flex items-center gap-1 overflow-hidden px-1 py-1 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'}`}>
              {showLogo && <style dangerouslySetInnerHTML={{__html: `.cahaya-kilau { position: absolute; top: 0; left: -150%; width: 150%; height: 100%; background: linear-gradient(to right, transparent, rgba(255,255,255,0.9), transparent); transform: skewX(-25deg); animation: kilauAnimasi 1.8s ease-in-out 0.2s forwards; z-index: 20; pointer-events: none; } @keyframes kilauAnimasi { 0% { left: -150%; } 100% { left: 150%; } }`}} />}
              <div className="cahaya-kilau"></div>
              <div className="w-[30px] h-[20px] rounded-[5px] bg-[#FF0000] flex items-center justify-center relative z-10"><Play className="w-3 h-3 text-white fill-white ml-0.5" /></div>
              <span className="font-sans font-bold text-[22px] tracking-tighter text-black relative z-10 mt-[1px]">Habi Music</span>
            </div>
            <div className={`absolute left-0 w-full transition-all duration-700 flex flex-col justify-center ${!showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}>
              <div className="flex items-center gap-1 text-gray-900 font-bold text-[10px] sm:text-xs"><MapPin className="w-3 h-3 text-[#FF0000] flex-shrink-0" /><span className="truncate max-w-[150px] sm:max-w-[250px]">{userCity}</span></div>
              <div className="text-gray-500 font-mono text-[9px] sm:text-[10px] ml-4 tracking-tight">{currentTime}</div>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <div className="relative">
              <button onClick={() => {setShowNotif(!showNotif); setChatOpen(false);}} className="p-2 rounded-full hover:bg-gray-100 relative"><Bell className="w-6 h-6 text-black" />{notifs.length > 0 && <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#FF0000] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{notifs.length}</span>}</button>
              
              {showNotif && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 sm:absolute sm:inset-auto sm:top-14 sm:right-0 w-full h-full sm:w-[380px] sm:h-auto bg-white sm:rounded-2xl shadow-2xl border-none sm:border border-gray-100 z-[99999] sm:z-50 overflow-hidden flex flex-col sm:max-h-[85vh]">
                  
                  {!chatOpen ? (
                    <>
                      <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-100">
                        <h3 className="font-black text-base sm:text-sm text-gray-800">Pusat Notifikasi</h3>
                        <div className="flex gap-2">
                          <button onClick={openChatCS} className="flex items-center gap-1 bg-[#25D366]/10 text-[#008069] px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#25D366]/20 transition-colors"><MessageCircle className="w-4 h-4"/> Chat CS</button>
                          <button onClick={()=>setShowNotif(false)} className="p-1"><X className="w-6 h-6 sm:w-5 sm:h-5 text-gray-500"/></button>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto bg-white p-3" ref={chatRef}>
                        {notifs.length > 0 ? notifs.map(n => (
                          <div key={n.id} className={`flex gap-3 p-3 rounded-xl mb-3 border ${n.type==='withdraw'?'bg-blue-50 border-blue-100':'bg-white border-gray-100 shadow-sm'}`}>
                            <div className={`w-10 h-10 rounded-full flex justify-center items-center flex-shrink-0 text-white font-bold text-sm ${n.type==='withdraw'?'bg-blue-500':'bg-[#FF0000]'}`}>{n.type==='withdraw'?'Rp':'HM'}</div>
                            <div className="flex-1 pr-2">
                              <div className="flex justify-between items-start mb-1"><span className="font-bold text-xs text-gray-900">{n.title}</span><span className="text-[10px] font-bold text-gray-400">{n.time}</span></div>
                              <p className="text-xs text-gray-600 font-medium leading-relaxed">{n.type==='youtube'?<>{n.text.split('{link}')[0]}<a href="https://youtube.com/@habientertainmentofficial" target="_blank" className="text-[#FF0000] font-bold underline">Subscribe</a>{n.text.split('{link}')[1]}</>:n.text}</p>
                            </div>
                            <button onClick={()=>{if(n.id==='yt')localStorage.setItem('habi_yt_del',Date.now().toString());setNotifs(notifs.filter(x=>x.id!==n.id));}} className="text-gray-300 hover:text-red-500"><Trash2 className="w-5 h-5"/></button>
                          </div>
                        )) : <div className="py-10 text-center text-gray-400 text-sm font-medium">Belum ada notifikasi.</div>}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center p-3 bg-[#008069] text-white shadow-md z-10">
                        <button onClick={()=>setChatOpen(false)} className="flex items-center hover:bg-white/10 rounded-full py-1 pr-1 mr-1 -ml-1 transition-colors"><ArrowLeft className="w-6 h-6"/></button>
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0 mr-3 cursor-pointer shadow-sm">
                          <div className="w-[20px] h-[14px] rounded-[3px] bg-[#FF0000] flex items-center justify-center"><Play className="w-2 h-2 text-white fill-white ml-0.5" /></div>
                        </div>
                        <div className="flex flex-col flex-1 cursor-pointer">
                          <span className="font-semibold text-base leading-tight">CS Habi Music</span>
                          <span className="text-[12px] opacity-90 truncate">{csSt}</span>
                        </div>
                        <div className="flex items-center gap-4 text-white ml-2">
                          <Video className="w-5 h-5 opacity-80"/><Phone className="w-5 h-5 opacity-80"/><MoreVertical className="w-5 h-5 opacity-80"/>
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 relative" style={{backgroundColor:'#efeae2', backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'cover'}} ref={chatRef}>
                        <div className="text-center text-[11px] text-gray-700 font-medium my-2 bg-[#D1EAF1] self-center px-4 py-1.5 rounded-lg shadow-sm">HARI INI</div>
                        <div className="text-center text-[10px] text-gray-600 font-medium my-1 bg-[#FEF4C5] self-center px-3 py-2 rounded-lg shadow-sm w-[90%] leading-relaxed flex items-start gap-1"><div className="mt-0.5">🔒</div><span>Pesan dan panggilan dienkripsi secara end-to-end. Tim Habi Music tidak dapat membaca sandi Anda.</span></div>

                        {chatMode === 'queue' && (
                           <div className="self-center bg-white text-gray-700 text-xs px-4 py-2 rounded-full font-bold mt-4 flex items-center gap-2 shadow-sm"><div className="w-3 h-3 border-2 border-[#008069] border-t-transparent rounded-full animate-spin"></div> {csSt}</div>
                        )}

                        {chatMode === 'connected' && chats.map(c => (
                          <div key={c.id} className={`flex flex-col max-w-[85%] ${c.sender === 'user' ? 'self-end' : 'self-start'}`}>
                            <div className={`p-2 rounded-lg text-[14px] shadow-sm relative ${c.sender === 'user' ? 'bg-[#d9fdd3] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                              {c.img && <img src={c.img} className="w-full max-w-[200px] rounded-md mb-1 border border-gray-200" alt="uploaded"/>}
                              {c.text && <p className="text-[#111111] break-words pr-12 pb-2 pl-1 leading-snug">{c.text}</p>}
                              <div className="absolute right-1.5 bottom-1 flex items-center gap-1">
                                <span className="text-[10px] text-gray-500 font-medium">{c.time.split(' ')[0]}</span>
                                {c.sender === 'user' && (c.status === 'read' ? <CheckCheck className="w-4 h-4 text-[#53bdeb]"/> : <CheckCheck className="w-4 h-4 text-gray-400"/>)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-2 bg-transparent flex gap-1.5 items-end relative z-10" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'cover' }}>
                        {showEmoji && (
                          <div className="absolute bottom-[60px] left-2 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 grid grid-cols-8 gap-2 w-[90%] z-50 animate-in slide-in-from-bottom-2">
                            {emojis.map(e => <button type="button" key={e} onClick={() => setChatInput(p => p+e)} className="text-xl hover:scale-125 transition-transform">{e}</button>)}
                          </div>
                        )}
                        <div className="flex-1 bg-white rounded-3xl px-2 py-1.5 flex items-end shadow-sm border border-gray-200 min-h-[44px]">
                           <button onClick={() => setShowEmoji(!showEmoji)} className={`p-2 flex-shrink-0 ${showEmoji ? 'text-[#008069]' : 'text-gray-500'}`}><Smile className="w-6 h-6"/></button>
                           <textarea value={chatInput} onChange={e=>setChatInput(e.target.value)} disabled={chatMode !== 'connected'} placeholder="Ketik pesan" className="flex-1 bg-transparent px-2 py-2.5 text-[15px] outline-none disabled:opacity-50 resize-none max-h-24 min-h-[40px]" rows="1" />
                           <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                           <button onClick={()=>fileInputRef.current.click()} disabled={chatMode !== 'connected'} className="p-2 text-gray-500 flex-shrink-0 transform -rotate-45"><Paperclip className="w-6 h-6"/></button>
                           {chatInput.length === 0 && <button disabled={chatMode !== 'connected'} className="p-2 text-gray-500 flex-shrink-0"><Camera className="w-6 h-6"/></button>}
                        </div>
                        <button onClick={sendChat} disabled={chatMode !== 'connected' || chatInput.trim().length === 0} className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md flex-shrink-0 mb-0.5 transition-colors ${chatMode === 'connected' && chatInput.trim().length > 0 ? 'bg-[#008069]' : 'bg-gray-400'}`}>
                          <Send className="w-5 h-5 text-white ml-1"/>
                        </button>
                      </div>
                    </>
                  )}
                </div>, document.body
              )}
            </div>
            <button onClick={() => setSearchOpen(true)} className="p-2 rounded-full hover:bg-gray-100"><Search className="w-6 h-6 text-black" /></button>
          </div>
        </div>

        {searchOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 bg-white z-[9999] flex flex-col px-4 py-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={`Cari di ${platformInfo?.name||'Aplikasi'}...`} className="w-full pl-12 bg-gray-50 border border-gray-200 rounded-2xl py-3 outline-none" autoFocus /></div>
              <button onClick={() => setSearchOpen(false)} className="p-3 bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="grid gap-3">{rawR.map((item, i) => { const r = getMap(item); return (<Link key={i} href={r.l} onClick={() => setSearchOpen(false)} className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm"><div className="w-16 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">{r.c ? <img src={r.c} className="w-full h-full object-cover" /> : <span>No Img</span>}</div><div className="flex-1"><h3 className="font-bold text-gray-900">{r.t}</h3></div></Link>); })}</div>
            </div>
          </div>, document.body
        )}
      </header>

      {videoToast && typeof document !== 'undefined' && createPortal(<div className="fixed top-[80px] left-1/2 -translate-x-1/2 z-[99999] bg-black/80 text-white px-4 py-2 rounded-full shadow-lg font-bold text-xs flex items-center gap-2 animate-in fade-in"><span className="text-yellow-400">🪙</span> {videoToast}</div>, document.body)}
      <style dangerouslySetInnerHTML={{__html: `@keyframes kp{0%{transform:scale(1)}5%{transform:scale(1.15) rotate(10deg)}10%{transform:scale(1) rotate(0deg)}100%{transform:scale(1)}}.kh{animation:kp 27s infinite}.bk{background:radial-gradient(circle at top left,#fbbf24,#d97706)}@keyframes kd{0%{transform:scale(1)}50%{transform:scale(1.3) rotate(-10deg);filter:brightness(1.2)}100%{transform:scale(0);opacity:0}}@keyframes f{0%{transform:translate(0,0) scale(0.5);opacity:1}100%{transform:translate(var(--tx),150px) scale(1.2) rotate(var(--rot));opacity:0}}.km{animation:kd 0.5s forwards}.ku{position:absolute;top:30%;left:30%;font-weight:900;pointer-events:none;opacity:0;animation:f 10s ease-out forwards}`}} />

      {promoState !== 'hidden' && typeof document !== 'undefined' && createPortal(
        <div className="fixed top-[320px] left-6 z-[40]">
          {promoState === 'exploding' && (<div className="relative km"><div className="ku text-green-600 text-[14px]" style={{"--tx":"-40px","--rot":"-45deg",animationDelay:"0s"}}>Rp 50K</div><div className="ku text-yellow-500 text-[16px]" style={{"--tx":"50px","--rot":"30deg",animationDelay:"0.1s"}}>Rp 100K</div><div className="ku text-green-500 text-[20px]" style={{"--tx":"0px","--rot":"180deg",animationDelay:"0.2s"}}>💸</div><div className="ku text-yellow-600 text-[18px]" style={{"--tx":"-20px","--rot":"-90deg",animationDelay:"0.3s"}}>🪙</div><div className="ku text-red-500 text-[14px]" style={{"--tx":"30px","--rot":"60deg",animationDelay:"0.15s"}}>Rp 200K</div></div>)}
          {promoState === 'idle' && (<button onClick={()=>{setPromoState('progress'); setNotifs(p=>[{id:'sys',type:'app',time:new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true}),title:'Sistem Aktif',text:'✨ Sistem deteksi nonton aktif! Diam & fokus nonton video untuk hasilkan saldo otomatis.'},...p]);}} className="flex flex-col items-center hover:scale-110 outline-none"><span className="text-[34px] drop-shadow-md relative z-10">🎁</span><div className="mt-[-8px] relative z-20"><span className="text-[9px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full shadow-md border border-white/50">{pTexts[tIdx]}</span></div></button>)}
          {promoState === 'progress' && (<button onClick={() => setShowCoinMenu(true)} className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] border-2 border-yellow-300 kh"><div className="w-6 h-6 rounded-full bk flex items-center justify-center text-white font-black text-[12px] shadow-inner border border-yellow-200">Rp</div><span className="text-[13px] font-black text-gray-800 tracking-tight">{balance.toLocaleString('id-ID')}</span></button>)}
        </div>, document.body
      )}

      {showCoinMenu && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100000] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 animate-in fade-in zoom-in duration-200"><div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative"><button onClick={()=>setShowCoinMenu(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"><X className="w-5 h-5"/></button><div className="p-6 text-center border-b border-gray-100"><div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3"><CircleDollarSign className="w-8 h-8 text-yellow-600"/></div><h2 className="font-black text-xl text-gray-900">Menu Koin</h2><p className="text-xs text-gray-500 mt-1 font-medium">Saldo bertambah otomatis saat fokus nonton.</p></div><div className="p-4 space-y-3 bg-gray-50"><button onClick={()=>setShowCoinMenu(false)} className="w-full flex items-center bg-white p-4 rounded-2xl shadow-sm border border-green-100 hover:bg-green-50 active:scale-95"><Tv className="w-6 h-6 text-green-500 mr-3"/><span className="font-bold text-gray-800">Lanjut Hasilkan Uang</span></button><button onClick={()=>{setShowCoinMenu(false);setPromoState('hidden');alert("Sistem uang dijeda. Saldo aman.");}} className="w-full flex items-center bg-white p-4 rounded-2xl shadow-sm border border-red-100 hover:bg-red-50 active:scale-95"><StopCircle className="w-6 h-6 text-red-500 mr-3"/><span className="font-bold text-gray-800">Berhenti Menghasilkan Uang</span></button><button onClick={()=>{setShowCoinMenu(false);alert("Memuat iklan... (Demo)");}} className="w-full flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-md active:scale-95"><Play className="w-6 h-6 text-white fill-white mr-3"/><span className="font-bold text-white">Nonton Iklan (Dapat 10Rb!)</span></button></div></div></div>, document.body
      )}
    </>
  );
}
