// @ts-nocheck
/* eslint-disable */
"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, X, MapPin, Play, Bell, Trash2, StopCircle, Tv, CircleDollarSign, MessageCircle, Send, CheckCheck, ArrowLeft, Paperclip, Smile, Video, Phone, MoreVertical } from "lucide-react";
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
  
  const csList = [
    { name: "Siti", img: "https://i.pinimg.com/736x/2c/80/7e/2c807e15de5b22b645b23d9b0075d167.jpg" },
    { name: "Ayu", img: "https://i.pinimg.com/736x/a2/63/ec/a263ecbd1fb14571e0f023f038848db7.jpg" },
    { name: "Nisa", img: "https://i.pinimg.com/736x/16/df/97/16df97241272b1239cf2e3a10ee9cfbc.jpg" },
    { name: "Rini", img: "https://i.pinimg.com/736x/60/79/a8/6079a8385b244d32e923ce65eeb64b07.jpg" },
    { name: "Putri", img: "https://i.pinimg.com/736x/55/96/cc/5596cc6e36b0d91240c54179e8c3df1d.jpg" },
    { name: "Zahra", img: "https://i.pinimg.com/736x/07/ea/87/07ea87588b39a48f4cf7942ee4eeff1f.jpg" }
  ];
  
  const [csInfo, setCsInfo] = useState(csList[0]);
  const [csSt, setCsSt] = useState("Online");
  const [chatMode, setChatMode] = useState('idle'); 
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chats, setChats] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const chatRef = useRef(null);
  const fileInputRef = useRef(null);
  const idleChatTimeout = useRef(null);
  const hasNotified = useRef(false);
  const currentYear = new Date().getFullYear();
  
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

  const getFullDate = () => {
    const dt = new Date().toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
    const tm = new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:true});
    return `${dt} | ${tm}`;
  };

  useEffect(() => {
    if(typeof window !== 'undefined') {
      const savedNotifs = localStorage.getItem('habi_notifs');
      if(savedNotifs) setNotifs(JSON.parse(savedNotifs));
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if(isMounted && notifs.length > 0) {
      localStorage.setItem('habi_notifs', JSON.stringify(notifs));
    } else if (isMounted && notifs.length === 0) {
      localStorage.removeItem('habi_notifs');
    }
  }, [notifs, isMounted]);

  useEffect(() => {
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
    const cInt = setInterval(() => { setCurrentTime(getFullDate()); }, 1000);

    if(isMounted) {
      const today = new Date().toDateString();
      if(localStorage.getItem('habi_news_date') !== today) {
        const newsData = [
          "Kabar Gembira! Server VPS sudah ON lagi memakai RAM 60GB seharga 900rb/bulan! Akses dijamin lebih wuzz. Ayo lanjut nonton biar saldonya nambah!",
          "Event Spesial Hari Ini! Selesaikan episode drama pilihanmu untuk mengklaim koin uang tunai. Semakin sering nonton, makin cepat cair ke DANA/Gopay!",
          "Jangan lupa! Habi Music membayar Kakak untuk setiap video yang ditonton. Fokus rebahan, diam nonton, koin ngalir sendirinya."
        ];
        const rNews = newsData[Math.floor(Math.random() * newsData.length)];
        
        setNotifs(prev => {
          const filtered = prev.filter(n => n.type !== 'news'); 
          return [{ id: 'news_'+Date.now(), type: 'news', time: getFullDate(), title: 'Info Sistem Habi Music', text: rNews }, ...filtered];
        });
        localStorage.setItem('habi_news_date', today);
      }
    }

    const handleWd = (e) => {
      const d = e.detail;
      setNotifs(p => [{ id:'wd_'+d.id, type:'withdraw', status: 'pending', timestamp: Date.now(), time: getFullDate(), title:'Finance (Penarikan)', text:`⏳ PENDING: Penarikan Rp100.000 ke ${d.method} (${d.account}) menunggu antrean sistem.` }, ...p]);
    };
    window.addEventListener('habi_withdraw_event', handleWd);

    return () => { clearTimeout(lTimer); clearTimeout(eT); clearInterval(cInt); clearInterval(tInt); window.removeEventListener('habi_withdraw_event', handleWd); };
  }, [promoState, isMounted]);

  useEffect(() => {
    if(!isMounted) return;
    const wdInterval = setInterval(() => {
      setNotifs(prev => {
        let changed = false;
        const updated = prev.map(n => {
          if(n.type === 'withdraw') {
            const elapsed = Date.now() - n.timestamp;
            if(elapsed > 43200000 && n.status !== 'berhasil') {
              changed = true;
              return { ...n, status: 'berhasil', time: getFullDate(), text: `✅ BERHASIL: Penarikan Rp100.000 sudah berhasil ditransfer ke rekening Kakak!` };
            } 
            else if (elapsed > 180000 && n.status === 'pending') {
              changed = true;
              return { ...n, status: 'proses', time: getFullDate(), text: `⚙️ DIPROSES: Penarikan Rp100.000 sedang dikirimkan oleh bank. Mohon ditunggu ya Kak.` };
            }
          }
          return n;
        });
        return changed ? updated : prev;
      });
    }, 10000); 
    return () => clearInterval(wdInterval);
  }, [isMounted]);

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

  const sendPostChatNotif = () => {
    if(hasNotified.current) return;
    const userMsgCount = chats.filter(c => c.sender === 'user').length;
    if(userMsgCount === 0) return; 

    hasNotified.current = true;
    const endMsgs = [
      `Terima kasih sudah menghubungi CS Habi Music Kak! 🙏 Jangan lupa lanjut nonton episode dramanya biar saldo cepat 100rb dan bisa dicairkan ya 😊`,
      `Sesi chat telah berakhir. Semangat terus kumpulin koinnya dari nonton drama ya Kak! Kalau ada kendala penarikan DANA, CS ${csInfo.name} selalu siap bantu 🙏`,
      `Halo Kak, obrolan bantuan tadi sudah ditutup ya. Ingat, Habi Music selalu siap bantu Kakak mencairkan uang tunai dari nonton drama. Sehat selalu! ✨`,
      `Pesan dari CS ${csInfo.name}: Terima kasih Kak! Terus nikmati tontonan drama pendek kami dan raih cuannya. Kalau butuh bantuan teknis, hubungi Official kami 🙏`
    ];
    const randMsg = endMsgs[Math.floor(Math.random() * endMsgs.length)];
    setNotifs(p => [{ id: 'post_'+Date.now(), type: 'postchat', time: getFullDate(), title: `Pesan CS ${csInfo.name}`, text: randMsg }, ...p]);
  };

  useEffect(() => {
    if (chatMode === 'connected') {
      clearTimeout(idleChatTimeout.current);
      idleChatTimeout.current = setTimeout(() => {
        setChatMode('ended');
        setCsSt("Offline");
        setChats(p => [...p, { id: Date.now().toString(), sender: 'admin', time: new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:true}), text: `Assalamualaikum Kak 🙏 Karena sudah 3 menit tidak ada respons, obrolan ini ${csInfo.name} akhiri dulu ya. Jangan lupa lanjut nonton dramanya biar koinnya cepat ditarik! 😊` }]);
        sendPostChatNotif(); 
      }, 180000); 
    }
    return () => clearTimeout(idleChatTimeout.current);
  }, [chats, chatMode]);

  const openChatCS = () => {
    setChatOpen(true);
    if(chatMode === 'idle') {
      hasNotified.current = false;
      const rCS = csList[Math.floor(Math.random() * csList.length)];
      setCsInfo(rCS);
      setChatMode('queue'); setCsSt("Mencari CS...");
      setTimeout(() => {
        setCsSt("Antrean ke-1...");
        setTimeout(() => {
          setChatMode('connected'); setCsSt("Online");
          setChats([{ id:'c1', sender:'admin', time:new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:true}), text:`Assalamualaikum Kak 🙏 Perkenalkan aku ${rCS.name}, CS Habi Music. Ada yang bisa aku bantu terkait aplikasi atau penarikannya? 😊` }]);
        }, 3000);
      }, 2500);
    }
  };

  const handleBackOut = () => {
    setChatOpen(false);
    if(chatMode === 'connected' || chatMode === 'ended') sendPostChatNotif();
  };

  const confirmEndChat = () => {
    setShowEndModal(false);
    setChatMode('ended');
    setCsSt("Offline");
    clearTimeout(idleChatTimeout.current);
    setChats(p => [...p, { id: Date.now().toString(), sender: 'admin', time: new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:true}), text: `Baik Kak, obrolan ini ${csInfo.name} tutup ya 🙏 Terima kasih banyak. Terus semangat kumpulin koin dari nonton dramanya! Wassalamualaikum 😊` }]);
    sendPostChatNotif();
  };

  const resetChat = () => { setChats([]); setChatMode('idle'); setCsSt("Online"); openChatCS(); };

  const getBase64 = (file) => new Promise((res) => {
    const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => res(reader.result.split(',')[1]);
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const url = URL.createObjectURL(file);
    sendChatCore("Ini bukti screenshot dari aku ya kak", true, url);
  };

  const sendChat = (e) => { e.preventDefault(); sendChatCore(chatInput, false, null); setShowEmoji(false); };

  // ===============================================
  // OTAK AI ULTRA ROLEPLAY (DENY BEING AI)
  // ===============================================
  const sendChatCore = async (text, isImg=false, imgUrl=null) => {
    if(!isImg && !text.trim()) return;
    if(chatMode !== 'connected') return;
    
    const msgId = Date.now().toString();
    const tStr = new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:true});
    setChats(p => [...p, { id:msgId, sender:'user', time:tStr, text:text, img:imgUrl, status:'sent' }]);
    if(!isImg) setChatInput("");

    const readDelay = Math.floor(Math.random() * 3000) + 3000; 
    
    setTimeout(async () => {
      setChats(p => p.map(m => m.id === msgId ? {...m, status:'read'} : m)); 
      const thinkDelay = Math.floor(Math.random() * 2000) + 1000;
      
      setTimeout(async () => {
        setCsSt("Mengetik..."); 
        
        let reply = "";
        const isSimple = text.toLowerCase().match(/\b(p|hai|halo|assalamu|salam|ping|ok|sip|makasih|iya|y)\b/);

        try {
          let historyText = "";
          chats.slice(-6).forEach(c => { historyText += `${c.sender==='user'?'User':'Kamu'}: ${c.text}\n`; });

          const currentBalanceRp = balance.toLocaleString('id-ID');

          let prompt = `Instruksi Mutlak: Namamu ${csInfo.name}, CS Habi Music.
          [INFO DATABASE LIVE]: Saldo koin pengguna/user saat ini adalah Rp ${currentBalanceRp}. Minimal ditarik Rp 100.000. JIKA PENGGUNA BERTANYA BERAPA SALDONYA, SEBUTKAN ANGKA Rp ${currentBalanceRp} INI!
          FAKTA PERUSAHAAN: 
          1. Ini APLIKASI NONTON DRAMA, BUKAN MUSIK. 
          2. CEO: MUHAMMAD HABI BULLAH (23 thn). Server: Surabaya. Perusahaan: Jember, Mumbulsari. Gajimu: Rp 2,3 Juta per bulan.
          ATURAN PALING KETAT: JIKA PENGGUNA TANYA APAKAH KAMU AI/ROBOT ATAU MANUSIA, KAMU HARUS MARAH HALUS/MENYANGKAL DAN TEGASKAN BAHWA KAMU MANUSIA ASLI YANG BEKERJA DI KANTOR PUSAT JEMBER! (Contoh: "Aku beneran orang asli kok Kak hehe, aku kerja standby di kantor pusat Habi Music di Jember 😊"). JANGAN PERNAH MENGAKU AI!
          SIFATMU: Sangat sabar, super ramah, panggil pengguna "Kak". Jawab MAX 2 kalimat pendek.\n`;

          if(isImg) prompt += `[INFO: User baru kirim FOTO SCREENSHOT. Abaikan chat sebelumnya, balas: "Gambarnya sudah ${csInfo.name} terima dan analisis ya kak 🙏 Berdasarkan sistem, saldo Kakak di situ tercatat Rp ${currentBalanceRp}. ${balance >= 100000 ? 'Wah sudah bisa ditarik nih Kak!' : 'Masih kurang dari 100rb nih Kak, yuk nonton drama lagi biar cepat cair 😊'}"]\n`;

          prompt += `\nRiwayat Chat:\n${historyText}User: "${text}"\nBalasanmu:`;

          const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
          if (!res.ok) throw new Error("API failed");
          reply = await res.text();

        } catch(err) {
          // CADANGAN JIKA OFFLINE (ROLEPLAY MANUSIA)
          const lText = text.toLowerCase();
          const currentBalanceRp = balance.toLocaleString('id-ID');
          
          if(isImg) reply = `Gambarnya udah ${csInfo.name} terima ya Kak 🙏 ${csInfo.name} cek saldo Kakak sekarang ada Rp ${currentBalanceRp}. Semangat kumpulin koinnya ya Kak!`;
          else if (lText.match(/ai|bot|robot|asli|manusia|orang/)) reply = `Aku
