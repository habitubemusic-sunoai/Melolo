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

type NotifItem = { id: string; type: string; time: string; text: string; };

export function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const normalizedQuery = debouncedQuery.trim();

  const [showLogo, setShowLogo] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [userCity, setUserCity] = useState("Jember");
  const [showPromo, setShowPromo] = useState(true);
  const [isExploding, setIsExploding] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState<NotifItem[]>([]);

  const promoTexts = ["Klaim Rp10.000", "Tarik ke DANA", "Tonton = Cuan", "Tarik GoPay"];
  const [textIndex, setTextIndex] = useState(0);
  const [fadeText, setFadeText] = useState(true);

  useEffect(() => {
    setTimeout(() => setShowLogo(false), 20000);
    setTimeout(() => { setIsExploding(true); setTimeout(() => setShowPromo(false), 10000); }, 15000);
    setInterval(() => { setFadeText(false); setTimeout(() => { setTextIndex(p => (p+1)%promoTexts.length); setFadeText(true); }, 500); }, 3000);

    const clock = setInterval(() => {
      const now = new Date();
      setCurrentTime(`${now.toLocaleDateString('id-ID',{weekday:'long',day:'2-digit',month:'short'})} | ${now.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})} WIB`);
    }, 1000);

    const now = new Date();
    const today = now.toLocaleDateString('id-ID');
    const ytDeleted = localStorage.getItem('habi_yt_del');
    const appDeleted = localStorage.getItem('habi_app_del');
    const active: NotifItem[] = [];

    if (!ytDeleted || (now.getTime() - parseInt(ytDeleted)) > 10800000) {
      active.push({ id:'yt', type:'yt', time:'Baru saja', text:'Bantu channel ini berkembang ya! Yuk {link} channel Habi Music sekarang.' });
    }
    if (appDeleted !== today) {
      active.push({ id:'app', type:'app', time:today, text:'Info: Event nonton dapat uang sedang berlangsung. Cek kado sekarang!' });
    }
    setNotifs(active);
    return () => clearInterval(clock);
  }, []);

  const delNotif = (id:string) => {
    if (id==='yt') localStorage.setItem('habi_yt_del', Date.now().toString());
    else localStorage.setItem('habi_app_del', new Date().toLocaleDateString('id-ID'));
    setNotifs(notifs.filter(n => n.id !== id));
  };

  const { isDramaBox, isReelShort, isShortMax, isNetShort, isMelolo, isFlickReels, isFreeReels, platformInfo } = usePlatform();
  const { data: dbR } = useSearchDramas(isDramaBox ? normalizedQuery : "");
  const { data: rsR } = useReelShortSearch(isReelShort ? normalizedQuery : "");
  const { data: nsR } = useNetShortSearch(isNetShort ? normalizedQuery : "");
  const { data: smR } = useShortMaxSearch(isShortMax ? normalizedQuery : "");
  const { data: mlR } = useMeloloSearch(isMelolo ? normalizedQuery : "");
  const { data: frR } = useFlickReelsSearch(isFlickReels ? normalizedQuery : "");
  const { data: ffR } = useFreeReelsSearch(isFreeReels ? normalizedQuery : "");
  const results = isDramaBox ? dbR : isReelShort ? rsR?.data : isShortMax ? smR?.data : isNetShort ? nsR?.data : isMelolo ? mlR?.data?.search_data?.flatMap((i:any)=>i.books||[]) : isFlickReels ? frR?.data : ffR;

  if (pathname?.startsWith("/watch")) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-14 flex items-center px-4 justify-between shadow-sm">
        <a href="https://www.youtube.com/@habientertainmentofficial" target="_blank" className="relative flex items-center overflow-hidden h-10 w-40">
          <div className={`absolute flex items-center gap-1 transition-all duration-700 ${showLogo?'opacity-100':'opacity-0 -translate-y-10'}`}>
            <div className="w-7 h-5 rounded bg-[#FF0000] flex items-center justify-center"><Play className="w-3 h-3 text-white fill-white ml-0.5"/></div>
            <span className="font-bold text-lg text-black tracking-tighter">Habi Music</span>
            {showLogo && <audio autoPlay><source src="https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg" type="audio/ogg"/></audio>}
          </div>
          <div className={`absolute transition-all duration-700 ${!showLogo?'opacity-100':'opacity-0 translate-y-10'}`}>
            <div className="flex items-center gap-1 text-[11px] font-bold"><MapPin className="w-3 h-3 text-red-600"/>{userCity}</div>
            <div className="text-[10px] text-gray-500 font-mono">{currentTime}</div>
          </div>
        </a>
        <div className="flex items-center gap-1">
          <div className="relative">
            <button onClick={()=>setShowNotif(!showNotif)} className="p-2 relative"><Bell className="w-6 h-6"/><span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] rounded-full px-1 border border-white">{notifs.length}</span></button>
            {showNotif && <div className="absolute top-10 right-0 w-72 bg-white shadow-xl border rounded-xl z-[60] p-2">
              {notifs.map(n => (
                <div key={n.id} className="p-2 border-b last:border-0 flex gap-2 relative">
                  <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center flex-shrink-0"><Play className="w-4 h-4 text-white fill-white"/></div>
                  <div className="text-[11px] text-gray-800 pr-5">
                    {n.type==='yt' ? <>{n.text.split('{link}')[0]}<a href="https://www.youtube.com/@habientertainmentofficial" target="_blank" className="text-red-600 font-bold">Subscribe</a>{n.text.split('{link}')[1]}</> : n.text}
                  </div>
                  <button onClick={()=>delNotif(n.id)} className="absolute right-0 top-2 p-1 text-gray-400"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
            </div>}
          </div>
          <button onClick={()=>setSearchOpen(true)} className="p-2"><Search className="w-6 h-6"/></button>
        </div>
      </header>

      {searchOpen && createPortal(<div className="fixed inset-0 bg-white z-[9999] p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <input autoFocus value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="flex-1 bg-gray-100 p-2 rounded-xl text-sm" placeholder="Cari drama..."/>
          <button onClick={()=>setSearchOpen(false)}><X/></button>
        </div>
        <div className="overflow-y-auto">{results?.map((d:any, i:number)=>(
          <Link key={i} href={`/detail/${currentPlatform}/${d.bookId||d.book_id||d.shortPlayId||d.playlet_id||d.key}`} onClick={()=>setSearchOpen(false)} className="flex gap-3 mb-3 p-2 bg-gray-50 rounded-xl">
            <img src={d.cover||d.book_pic||d.thumb_url} className="w-12 h-16 object-cover rounded-lg"/>
            <div className="text-sm font-bold truncate">{d.bookName||d.book_title||d.title||d.book_name}</div>
          </Link>
        ))}</div>
      </div>, document.body)}

      <style dangerouslySetInnerHTML={{__html:`@keyframes rain{0%{transform:translateY(0) scale(0.5);opacity:1}100%{transform:translateY(150px) scale(1.2);opacity:0}}.rain-rp{position:absolute;font-weight:900;animation:rain 10s forwards}`}}/>
      {showPromo && createPortal(<div className="fixed top-[260px] left-6 z-40">
        {isExploding ? <>
          <div className="rain-rp text-green-600" style={{left:'-20px'}}>Rp 50K</div>
          <div className="rain-rp text-yellow-600" style={{left:'20px'}}>Rp 100K</div>
          <div className="rain-rp text-red-600" style={{left:'0px'}}>💸</div>
        </> : <a href="https://wa.me/6285119821813" target="_blank" className="flex flex-col items-center">
          <span className="text-3xl drop-shadow-md">🎁</span>
          <span className={`text-[9px] font-black text-red-600 bg-white/80 px-1 rounded transition-opacity duration-500 ${fadeText?'opacity-100':'opacity-0'}`}>{promoTexts[textIndex]}</span>
        </a>}
      </div>, document.body)}
    </>
  );
				}
