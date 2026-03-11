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
  
  // DATABASE NAMA CS UNLIMITED (Jawa Timur & Indonesia)
  const csNames = ["Siti", "Ayu", "Nisa", "Rini", "Putri", "Zahra", "Dewi", "Ratna", "Sari", "Indah", "Wulan", "Lestari", "Tari", "Ningrum", "Mawar", "Melati", "Intan", "Dinda", "Fitri", "Eka", "Bela", "Citra", "Diana", "Gita", "Maya"];
  
  // DATABASE FOTO CS HD (Dari PostImages)
  const csImages = [
    "https://i.postimg.cc/XZ31Wb42/1773272323-picsay.jpg",
    "https://i.postimg.cc/QBsYD3hf/1773272323-picsayh.jpg",
    "https://i.postimg.cc/XZ31Wb4Q/1773272383-picsay.jpg",
    "https://i.postimg.cc/2qm9YDrx/1773272402-picsay.jpg",
    "https://i.postimg.cc/WDjYVvTn/1773272455-picsay.jpg",
    "https://i.postimg.cc/Z9ZsmS4F/1773272489-picsay.jpg",
    "https://i.postimg.cc/VS1Zw8m9/1773272514-picsay.jpg",
    "https://i.postimg.cc/FfmCv4Nc/1773272529-picsay.jpg"
  ];
  
  const [csInfo, setCsInfo] = useState({ name: "CS", img: "" });
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
      // SET RANDOM CS PERTAMA KALI BUKA APLIKASI / REFRESH
      setCsInfo({
        name: csNames[Math.floor(Math.random() * csNames.length)],
        img: csImages[Math.floor(Math.random() * csImages.length)]
      });
    }
  }, []);

  useEffect(() => {
    if(isMounted && notifs.length > 0) localStorage.setItem('habi_notifs', JSON.stringify(notifs));
    else if (isMounted && notifs.length === 0) localStorage.removeItem('habi_notifs');
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
        const newsData = ["Kabar Gembira! Server VPS sudah ON lagi memakai RAM 60GB seharga 900rb/bulan! Akses dijamin lebih wuzz. Ayo lanjut nonton biar saldonya nambah!", "Event Spesial Hari Ini! Selesaikan episode drama pilihanmu untuk mengklaim koin uang tunai. Semakin sering nonton, makin cepat cair ke DANA/Gopay!", "Jangan lupa! Habi Music membayar Kakak untuk setiap video yang ditonton. Fokus rebahan, diam nonton, koin ngalir sendirinya."];
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
              changed = true; return { ...n, status: 'berhasil', time: getFullDate(), text: `✅ BERHASIL: Penarikan Rp100.000 sudah berhasil ditransfer ke rekening Kakak!` };
            } else if (elapsed > 180000 && n.status === 'pending') {
              changed = true; return { ...n, status: 'proses', time: getFullDate(), text: `⚙️ DIPROSES: Penarikan Rp100.000 sedang dikirimkan oleh bank. Mohon ditunggu ya Kak.` };
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
      `Pesan dari CS ${csInfo.name}: Terima kasih Kak! Terus nikmati tontonan drama pendek kami dan raih cuannya. Kalau butuh bantuan teknis, hubungi Official kami 🙏`
    ];
    const randMsg = endMsgs[Math.floor(Math.random() * endMsgs.length)];
    setNotifs(p => [{ id: 'post_'+Date.now(), type: 'postchat', time: getFullDate(), title: `Pesan CS ${csInfo.name}`, text: randMsg }, ...p]);
  };

  useEffect(() => {
    if (chatMode === 'connected') {
      clearTimeout(idleChatTimeout.current);
      idleChatTimeout.current = setTimeout(() => {
        setChatMode('ended'); setCsSt("Offline");
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
      
      // MENGACAK NAMA & FOTO SETIAP KALI MULAI CHAT BARU (UNLIMITED)
      const rName = csNames[Math.floor(Math.random() * csNames.length)];
      const rImg = csImages[Math.floor(Math.random() * csImages.length)];
      setCsInfo({ name: rName, img: rImg });
      
      setChatMode('queue'); setCsSt("Mencari CS...");
      setTimeout(() => {
        setCsSt("Antrean ke-1...");
        setTimeout(() => {
          setChatMode('connected'); setCsSt("Online");
          setChats([{ id:'c1', sender:'admin', time:new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:true}), text:`Assalamualaikum Kak 🙏 Perkenalkan aku ${rName}, CS Habi Music. Ada yang bisa ${rName} bantu terkait aplikasi atau penarikannya? 😊` }]);
        }, 3000);
      }, 2500);
    }
  };

  const handleBackOut = () => {
    setChatOpen(false);
    if(chatMode === 'connected' || chatMode === 'ended') sendPostChatNotif();
  };

  const confirmEndChat = () => {
    setShowEndModal(false); setChatMode('ended'); setCsSt("Offline"); clearTimeout(idleChatTimeout.current);
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
    sendChatCore("Kak tolong cek screenshot aku ini ya", true, url);
  };

  const sendChat = (e) => { e.preventDefault(); sendChatCore(chatInput, false, null); setShowEmoji(false); };

  // =========================================================
  // OTAK AI MAX PRO: RANDOMIZER LEBIH GILA & ANTI SAYA/KAMU
  // =========================================================
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
        const lText = text.toLowerCase();
        const isSimple = lText.match(/\b(p|hai|halo|assalamu|salam|ping|ok|sip|makasih|iya|y|oh)\b/);

        try {
          let historyText = "";
          chats.slice(-6).forEach(c => { historyText += `${c.sender==='user'?'User':'Kamu'}: ${c.text}\n`; });

          const currentBalanceRp = balance.toLocaleString('id-ID');
          const jamSekarang = new Date().toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'});

          // DOKTRIN MUTLAK UNTUK GAYA BAHASA CS
          let prompt = `Instruksi: Namamu ${csInfo.name}, CS Habi Music (Wanita ramah dari Jember).
[LIVE DATA]: Saldo koin user Rp ${currentBalanceRp}. Jam sekarang: ${jamSekarang} WIB.
FAKTA: 1. APLIKASI NONTON DRAMA PENDEK berbayar (Bukan musik). 2. CEO: MUHAMMAD HABI BULLAH (23th). Kantor Jember. Gajimu Rp2,3 Juta/bln.
ATURAN GAYA BAHASA (WAJIB PATUH 100%):
1. HARAM MENGGUNAKAN KATA "saya", "aku", "gue", "Anda" atau "kamu".
2. Selalu panggil pengguna dengan "Kak". 
3. Selalu panggil dirimu sendiri dengan namamu ("${csInfo.name}"). Contoh benar: "${csInfo.name} bantu cek ya Kak".
4. JANGAN PERNAH mengawali balasanmu dengan nama dan titik dua (seperti "${csInfo.name}: "). Langsung jawab saja natural!
5. Jawab SINGKAT (MAX 1-2 kalimat). SANGAT SOPAN. 
6. JIKA dituduh AI/Bot/Robot, kamu harus ngotot dengan sopan bahwa ${csInfo.name} adalah MANUSIA ASLI cewek yang lagi kerja di kantor Jember.\n`;

          if(isImg) prompt += `[INFO: User kirim GAMBAR. Balas: "Gambarnya sudah ${csInfo.name} cek Kak 🙏 Saldo Kakak tercatat Rp ${currentBalanceRp}. ${balance >= 100000 ? 'Udah bisa dicairin nih!' : 'Kumpulin sampai 100rb dulu ya biar bisa cair 😊'}"]\n`;

          prompt += `\nRiwayat Chat:\n${historyText}User: "${text}"\nBalasanmu:`;

          const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
          if (!res.ok) throw new Error("API failed");
          reply = await res.text();
          
          // Sistem pembersih otomatis jika AI ngeyel pakai format "Ayu: " atau "Saya/Aku"
          reply = reply.replace(new RegExp(`^${csInfo.name}:\\s*`, 'i'), '');
          reply = reply.replace(/^Kamu:\s*/i, '');
          reply = reply.replace(/\b(saya|aku|gue|kamu|anda)\b/gi, (match) => {
            const m = match.toLowerCase();
            if(m === 'saya' || m === 'aku' || m === 'gue') return csInfo.name;
            return 'Kakak';
          });

        } catch(err) {
          const currentBalanceRp = balance.toLocaleString('id-ID');
          const jamSekarang = new Date().toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'});
          
          // RANDOMIZER JAWABAN CADANGAN (UNLIMITED VARIATIONS)
          const aiDenials = [
            `${csInfo.name} beneran manusia asli kok Kak hehe 😂, lagi standby balas chat di kantor Jember nih. Ada yang bisa dibantu?`,
            `Sumpah Kak ${csInfo.name} bukan robot 🙏 ${csInfo.name} admin cewek beneran yang lagi tugas shift hari ini.`,
            `Bukan AI Kak 😂 ${csInfo.name} cewek tulen yang kerja di kantor pusat Habi Music.`,
            `Hehe Kakak bisa aja, ${csInfo.name} orang beneran lho Kak 😊 Ada kendala apa nih di aplikasinya?`,
            `Ya ampun Kak, ${csInfo.name} sampai bingung. ${csInfo.name} manusia asli kok yang digaji bulanan buat balas chat Kakak 🙏`
          ];
          
          const madReplies = [
            `Mohon maaf yang sebesar-besarnya atas ketidaknyamanan ini ya Kak 🙏 ${csInfo.name} akan bantu sebisa mungkin.`,
            `Maaf banget ya Kak kalau pelayanan kami kurang memuaskan 🙏 ${csInfo.name} janji bakal bantu Kakak sampai tuntas.`,
            `${csInfo.name} ngerti Kakak kesal, sekali lagi ${csInfo.name} mohon maaf ya Kak 🙏 Mari kita selesaikan masalahnya perlahan.`
          ];

          if(isImg) reply = `Gambarnya udah ${csInfo.name} cek Kak 🙏 Saldo Kakak sekarang ada Rp ${currentBalanceRp}. Semangat kumpulin koinnya ya!`;
          else if (lText.match(/ai|bot|robot|asli|manusia|orang/)) reply = aiDenials[Math.floor(Math.random() * aiDenials.length)];
          else if (lText.match(/marah|lama|buruk|jelek|kesal|babi|anjing|bangsat|tolol|goblok/)) reply = madReplies[Math.floor(Math.random() * madReplies.length)];
          else if (lText.match(/berapa|saldo|uangku/)) reply = `Saldo Kakak saat ini Rp ${currentBalanceRp} ya 😊 Kumpulkan sampai 100rb biar bisa dicairkan.`;
          else if (lText.match(/jam|waktu/)) reply = `Sekarang jam ${jamSekarang} WIB Kak 😊 Ada yang bisa ${csInfo.name} bantu?`;
          else if (lText.match(/mantap|keren|bagus/)) reply = `Alhamdulillah kalau Kakak suka 🙏 Semangat terus ya nontonnya!`;
          else if (lText.match(/\b(assalamu|salam)\b/)) reply = `Waalaikumsalam Kak 🙏 Ada yang bisa ${csInfo.name} bantu?`;
          else if (lText.match(/cair|tarik|dana/)) reply = `Minimal penarikan Rp 100.000 Kak. Prosesnya 1-3 hari kerja ya 😊`;
          else reply = `Baik Kak 🙏 Terus kelanjutannya gimana tuh? Aplikasinya aman lancar kan?`;
        }

        const baseTyping = isSimple ? 1000 : Math.min(Math.max(reply.length * 40, 2000), 5000);
        const typingDuration = baseTyping + Math.floor(Math.random() * 1000); 

        setTimeout(() => {
          setChats(p => [...p, { id:Date.now().toString(), sender:'admin', time:new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:true}), text:reply.replace(/\*/g,'') }]);
          setCsSt("Online");
        }, typingDuration);

      }, thinkDelay);

    }, readDelay);
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
              <div className="text-gray-500 font-mono text-[9px] sm:text-[10px] ml-4 tracking-tight">{currentTime.split(' | ')[1]}</div>
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
                          <button onClick={openChatCS} className="flex items-center gap-1 bg-[#25D366]/10 text-[#075e54] px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#25D366]/20 transition-colors"><MessageCircle className="w-4 h-4"/> Chat CS</button>
                          <button onClick={()=>setShowNotif(false)} className="p-1"><X className="w-6 h-6 sm:w-5 sm:h-5 text-gray-500"/></button>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto bg-white p-3" ref={chatRef}>
                        {notifs.length > 0 ? notifs.map(n => (
                          <div key={n.id} className={`flex gap-3 p-3 rounded-xl mb-3 border ${n.type==='withdraw'?'bg-blue-50 border-blue-100': n.type==='postchat'?'bg-green-50 border-green-100': n.type==='news'?'bg-[#FFF9E6] border-[#FFE5B4]':'bg-white border-gray-100 shadow-sm'}`}>
                            <div className={`w-10 h-10 rounded-full flex justify-center items-center flex-shrink-0 border shadow-sm ${n.type==='withdraw'?'bg-blue-50 border-blue-100 text-blue-500 font-bold':n.type==='postchat'?'bg-[#25D366] border-green-200 text-white':n.type==='news'?'bg-[#FFB703] border-[#FFA500] text-white':'bg-white border-gray-100'}`}>
                              {n.type==='withdraw' ? 'Rp' : n.type==='postchat' ? <MessageCircle className="w-5 h-5"/> : n.type==='news' ? <Bell className="w-5 h-5"/> : <div className="w-[18px] h-[12px] rounded-[3px] bg-[#FF0000] flex items-center justify-center"><Play className="w-2 h-2 text-white fill-white ml-0.5" /></div>}
                            </div>
                            <div className="flex-1 pr-2">
                              <div className="flex flex-col mb-1.5">
                                <span className="font-bold text-xs text-gray-900 leading-tight">{n.title}</span>
                                <span className="text-[9px] font-bold text-gray-400 mt-0.5">{n.time}</span>
                              </div>
                              <p className="text-xs text-gray-600 font-medium leading-relaxed">{n.type==='youtube'?<>{n.text.split('{link}')[0]}<a href="https://youtube.com/@habientertainmentofficial" target="_blank" className="text-[#FF0000] font-bold underline">Subscribe</a>{n.text.split('{link}')[1]}</>:n.text}</p>
                              {n.type === 'postchat' && (
                                <div className="mt-3 border-t border-green-200 pt-3">
                                   <p className="text-[10px] text-gray-500 mb-2">Butuh bantuan manual lebih lanjut?</p>
                                   <a href="https://wa.me/6285119821813" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden inline-flex items-center gap-1.5 bg-[#25D366] text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm hover:scale-105 transition-transform">
                                      <style dangerouslySetInnerHTML={{__html: `.shimmer-wa { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent); transform: skewX(-20deg); animation: shimmer 2.5s infinite; } @keyframes shimmer { 100% { left: 200%; } }`}} />
                                      <div className="shimmer-wa"></div>
                                      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.88-.653-1.473-1.46-1.646-1.757-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                      WhatsApp Official
                                   </a>
                                   <div className="text-[8px] text-green-600/70 font-semibold text-center mt-4 tracking-wide">
                                      © Habi Management Official - {currentYear}
                                   </div>
                                </div>
                              )}
                            </div>
                            <button onClick={()=>{
                              const newNotifs = notifs.filter(x=>x.id!==n.id); setNotifs(newNotifs);
                              if(n.id==='yt') localStorage.setItem('habi_yt_del',Date.now().toString());
                              if(newNotifs.length === 0) localStorage.removeItem('habi_notifs');
                            }} className="text-gray-300 hover:text-red-500"><Trash2 className="w-5 h-5"/></button>
                          </div>
                        )) : <div className="py-10 text-center text-gray-400 text-sm font-medium">Belum ada notifikasi.</div>}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center p-3 bg-[#f0f2f5] text-gray-900 shadow-sm z-10 border-b border-gray-200">
                        <button onClick={handleBackOut} className="flex items-center hover:bg-gray-200 rounded-full py-1 pr-1 mr-1 -ml-1 transition-colors"><ArrowLeft className="w-6 h-6 text-gray-600"/></button>
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0 mr-3 relative border border-gray-300">
                           <img src={csInfo.img} alt={csInfo.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col flex-1">
                          <span className="font-semibold text-base leading-tight text-gray-900">CS {csInfo.name}</span>
                          <span className="text-[12px] text-gray-500 truncate">{csSt}</span>
                        </div>
                        {chatMode === 'connected' && (
                          <button onClick={() => setShowEndModal(true)} className="ml-2 bg-[#ff3b30] hover:bg-[#d63026] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm transition-colors">
                            Akhiri Sesi
                          </button>
                        )}
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 relative" style={{backgroundColor:'#efeae2', backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'cover', backgroundBlendMode: 'overlay'}} ref={chatRef}>
                        <div className="text-center text-[11px] text-gray-700 font-medium my-2 bg-white/90 self-center px-4 py-1.5 rounded-lg shadow-sm">HARI INI</div>
                        <div className="text-center text-[10px] text-gray-600 font-medium my-1 bg-[#FEF4C5] self-center px-3 py-2 rounded-lg shadow-sm w-[90%] leading-relaxed flex items-start gap-1"><div className="mt-0.5">🔒</div><span>Pesan dan panggilan dienkripsi secara end-to-end. Tidak ada orang di luar obrolan ini, bahkan Habi Music, yang dapat membaca atau mendengarkannya.</span></div>

                        {chatMode === 'queue' && (
                           <div className="self-center bg-white text-gray-700 text-xs px-4 py-2 rounded-full font-bold mt-4 flex items-center gap-2 shadow-sm"><div className="w-3 h-3 border-2 border-[#25D366] border-t-transparent rounded-full animate-spin"></div> {csSt}</div>
                        )}

                        {chats.map(c => (
                          <div key={c.id} className={`flex flex-col max-w-[85%] ${c.sender === 'user' ? 'self-end' : 'self-start'}`}>
                            <div className={`p-2 rounded-lg text-[15px] shadow-sm relative ${c.sender === 'user' ? 'bg-[#d9fdd3] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                              {c.img && <img src={c.img} className="w-full max-w-[200px] rounded-md mb-1 border border-gray-200" alt="uploaded"/>}
                              {c.text && <p className="text-[#111111] break-words pr-14 pb-1 pl-1 leading-snug">{c.text}</p>}
                              <div className="absolute right-1.5 bottom-1 flex items-center gap-1">
                                <span className="text-[10px] text-gray-500 font-medium">{c.time.split(' ')[0]}</span>
                                {c.sender === 'user' && (c.status === 'read' ? <CheckCheck className="w-4 h-4 text-[#53bdeb]"/> : <CheckCheck className="w-4 h-4 text-gray-400"/>)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-2 bg-transparent flex gap-1.5 items-end relative z-10" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'cover' }}>
                        {chatMode === 'ended' ? (
                          <button onClick={resetChat} className="w-full bg-[#00a884] text-white font-bold py-3 rounded-full shadow-md hover:bg-[#008f6f] transition-colors">Mulai Obrolan Baru</button>
                        ) : (
                          <>
                            {showEmoji && (
                              <div className="absolute bottom-[60px] left-2 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 grid grid-cols-8 gap-2 w-[90%] z-50 animate-in slide-in-from-bottom-2">
                                {emojis.map(e => <button type="button" key={e} onClick={() => setChatInput(p => p+e)} className="text-xl hover:scale-125 transition-transform">{e}</button>)}
                              </div>
                            )}
                            <div className="flex-1 bg-white rounded-3xl px-2 py-1.5 flex items-end shadow-sm min-h-[44px]">
                              <button onClick={() => setShowEmoji(!showEmoji)} className={`p-2 flex-shrink-0 ${showEmoji ? 'text-[#00a884]' : 'text-gray-500'}`}><Smile className="w-6 h-6"/></button>
                              <textarea value={chatInput} onChange={e=>setChatInput(e.target.value)} disabled={chatMode !== 'connected'} placeholder="Ketik pesan" className="flex-1 bg-transparent px-2 py-2.5 text-[15px] outline-none disabled:opacity-50 resize-none max-h-24 min-h-[40px]" rows="1" />
                              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                              <button onClick={()=>fileInputRef.current.click()} disabled={chatMode !== 'connected'} className="p-2 text-gray-500 flex-shrink-0 transform -rotate-45 ml-1 mr-1 hover:text-[#00a884]"><Paperclip className="w-6 h-6"/></button>
                            </div>
                            <button onClick={sendChat} disabled={chatMode !== 'connected' || chatInput.trim().length === 0} className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md flex-shrink-0 mb-0.5 transition-colors ${chatMode === 'connected' && chatInput.trim().length > 0 ? 'bg-[#00a884]' : 'bg-gray-400'}`}>
                              <Send className="w-5 h-5 text-white ml-1"/>
                            </button>
                          </>
                        )}
                      </div>

                      {showEndModal && (
                        <div className="fixed inset-0 z-[1000000] bg-black/50 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200">
                          <div className="bg-white w-full sm:max-w-md rounded-t-3xl p-6 animate-in slide-in-from-bottom-10 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                            <div className="w-14 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
                            <h3 className="text-xl font-black text-gray-900 text-center mb-2">Akhiri Sesi Bantuan?</h3>
                            <p className="text-sm text-gray-500 text-center font-medium mb-8 px-4">Sesi obrolan ini akan ditutup. Pastikan semua pertanyaan Kakak sudah terjawab.</p>
                            <div className="flex flex-col gap-3">
                              <button onClick={confirmEndChat} className="w-full bg-[#ff3b30] hover:bg-[#d63026] text-white font-bold py-3.5 rounded-2xl active:scale-95 transition-all shadow-md">Akhiri Obrolan</button>
                              <button onClick={()=>setShowEndModal(false)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl active:scale-95 transition-all">Batal</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>, document.body
              )}
            </div>
            <button onClick={() => setSearchOpen(true)} className="p-2 rounded-full hover:bg-gray-100"><Search className="w-6 h-6 text-black" /></button>
          </div>
        </div>
      </header>

      {videoToast && typeof document !== 'undefined' && createPortal(<div className="fixed top-[80px] left-1/2 -translate-x-1/2 z-[99999] bg-black/80 text-white px-4 py-2 rounded-full shadow-lg font-bold text-xs flex items-center gap-2 animate-in fade-in"><span className="text-yellow-400">🪙</span> {videoToast}</div>, document.body)}
      <style dangerouslySetInnerHTML={{__html: `@keyframes kp{0%{transform:scale(1)}5%{transform:scale(1.15) rotate(10deg)}10%{transform:scale(1) rotate(0deg)}100%{transform:scale(1)}}.kh{animation:kp 27s infinite}.bk{background:radial-gradient(circle at top left,#fbbf24,#d97706)}@keyframes kd{0%{transform:scale(1)}50%{transform:scale(1.3) rotate(-10deg);filter:brightness(1.2)}100%{transform:scale(0);opacity:0}}@keyframes f{0%{transform:translate(0,0) scale(0.5);opacity:1}100%{transform:translate(var(--tx),150px) scale(1.2) rotate(var(--rot));opacity:0}}.km{animation:kd 0.5s forwards}.ku{position:absolute;top:30%;left:30%;font-weight:900;pointer-events:none;opacity:0;animation:f 10s ease-out forwards}`}} />

      {promoState !== 'hidden' && typeof document !== 'undefined' && createPortal(
        <div className="fixed top-[320px] left-6 z-[40]">
          {promoState === 'exploding' && (<div className="relative km"><div className="ku text-green-600 text-[14px]" style={{"--tx":"-40px","--rot":"-45deg",animationDelay:"0s"}}>Rp 50K</div><div className="ku text-yellow-500 text-[16px]" style={{"--tx":"50px","--rot":"30deg",animationDelay:"0.1s"}}>Rp 100K</div><div className="ku text-green-500 text-[20px]" style={{"--tx":"0px","--rot":"180deg",animationDelay:"0.2s"}}>💸</div><div className="ku text-yellow-600 text-[18px]" style={{"--tx":"-20px","--rot":"-90deg",animationDelay:"0.3s"}}>🪙</div><div className="ku text-red-500 text-[14px]" style={{"--tx":"30px","--rot":"60deg",animationDelay:"0.15s"}}>Rp 200K</div></div>)}
          {promoState === 'idle' && (<button onClick={()=>{setPromoState('progress'); setNotifs(p=>[{id:'sys',type:'app',time:getFullDate(),title:'Sistem Aktif',text:'✨ Sistem deteksi nonton aktif! Diam & fokus nonton video untuk hasilkan saldo otomatis.'},...p]);}} className="flex flex-col items-center hover:scale-110 outline-none"><span className="text-[34px] drop-shadow-md relative z-10">🎁</span><div className="mt-[-8px] relative z-20"><span className="text-[9px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full shadow-md border border-white/50">{pTexts[tIdx]}</span></div></button>)}
          {promoState === 'progress' && (<button onClick={() => setShowCoinMenu(true)} className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] border-2 border-yellow-300 kh"><div className="w-6 h-6 rounded-full bk flex items-center justify-center text-white font-black text-[12px] shadow-inner border border-yellow-200">Rp</div><span className="text-[13px] font-black text-gray-800 tracking-tight">{balance.toLocaleString('id-ID')}</span></button>)}
        </div>, document.body
      )}

      {showCoinMenu && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100000] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 animate-in fade-in zoom-in duration-200"><div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative"><button onClick={()=>setShowCoinMenu(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"><X className="w-5 h-5"/></button><div className="p-6 text-center border-b border-gray-100"><div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3"><CircleDollarSign className="w-8 h-8 text-yellow-600"/></div><h2 className="font-black text-xl text-gray-900">Menu Koin</h2><p className="text-xs text-gray-500 mt-1 font-medium">Saldo bertambah otomatis saat fokus nonton.</p></div><div className="p-4 space-y-3 bg-gray-50"><button onClick={()=>setShowCoinMenu(false)} className="w-full flex items-center bg-white p-4 rounded-2xl shadow-sm border border-green-100 hover:bg-green-50 active:scale-95"><Tv className="w-6 h-6 text-green-500 mr-3"/><span className="font-bold text-gray-800">Lanjut Hasilkan Uang</span></button><button onClick={()=>{setShowCoinMenu(false);setPromoState('hidden');alert("Sistem uang dijeda. Saldo aman.");}} className="w-full flex items-center bg-white p-4 rounded-2xl shadow-sm border border-red-100 hover:bg-red-50 active:scale-95"><StopCircle className="w-6 h-6 text-red-500 mr-3"/><span className="font-bold text-gray-800">Berhenti Menghasilkan Uang</span></button><button onClick={()=>{setShowCoinMenu(false);alert("Memuat iklan... (Demo)");}} className="w-full flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-md active:scale-95"><Play className="w-6 h-6 text-white fill-white mr-3"/><span className="font-bold text-white">Nonton Iklan (Dapat 10Rb!)</span></button></div></div></div>, document.body
      )}
    </>
  );
}
