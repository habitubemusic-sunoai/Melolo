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

type NotifData = { id: string; type: string; time: string; text: string; };

export function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const normalizedQuery = debouncedQuery.trim();

  // State Tampilan Waktu & Logo
  const [showLogo, setShowLogo] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [userCity, setUserCity] = useState("Mendeteksi...");

  // State Promo Uang (15 detik diam + 10 detik hujan)
  const [showPromo, setShowPromo] = useState(true);
  const [isExploding, setIsExploding] = useState(false);
  const promoTexts = ["Klaim Rp10.000", "Tarik ke DANA", "Tonton = Cuan", "Tarik GoPay"];
  const [textIndex, setTextIndex] = useState(0);
  const [fadeText, setFadeText] = useState(true);

  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState<NotifData[]>([]);

  useEffect(() => {
    // Timer Animasi
    const logoTimer = setTimeout(() => setShowLogo(false), 20000);
    const explodeTimer = setTimeout(() => {
      setIsExploding(true);
      setTimeout(() => setShowPromo(false), 10000);
    }, 15000);

    const textInterval = setInterval(() => {
      setFadeText(false); 
      setTimeout(() => { setTextIndex((prev) => (prev + 1) % promoTexts.length); setFadeText(true); }, 500); 
    }, 3000);

    // Lokasi
    const fetchIP = () => fetch('https://get.geojs.io/v1/ip/geo.json').then(r => r.json()).then(d => setUserCity(d.city || "Indonesia")).catch(() => setUserCity("Indonesia"));
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`).then(r => r.json()).then(d => setUserCity(d.address.city || d.address.town || d.address.county || "Indonesia")).catch(fetchIP),
        () => fetchIP(), { timeout: 5000 }
      );
    } else fetchIP();

    // Jam Real-time
    const clockInterval = setInterval(() => {
      const d = new Date();
      const offset = -d.getTimezoneOffset() / 60;
      setCurrentTime(`${d.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })} | ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} ${offset === 8 ? "WITA" : offset === 9 ? "WIT" : "WIB"}`);
    }, 1000);

    // Sistem Notifikasi Harian
    const buildNotifs = () => {
      const now = new Date();
      const active: NotifData[] = [];
      const ytDel = localStorage.getItem('habi_yt_del');
      if (!ytDel || (now.getTime() - parseInt(ytDel)) / 3600000 >= 3) {
        const ytTexts = ["Bantu channel ini berkembang! Yuk {link} channel Habi Music.", "Dukung karya kami dengan {link} channel resmi kami.", "Suka aplikasinya? Jangan lupa {link} ke channel kami!"];
        active.push({ id: 'yt', type: 'youtube', time: 'Baru saja', text: ytTexts[now.getHours() % ytTexts.length] });
      }
      if (localStorage.getItem('habi_app_del') !== now.toLocaleDateString('id-ID')) {
        const appTexts = ["Event nonton dapat uang sedang berlangsung!", "Update terbaru: Katalog semakin cepat & HD.", "Kejutan harian: Nikmati maraton drama tanpa iklan pop-up."];
        active.push({ id: 'app', type: 'app', time: `${now.toLocaleDateString('id-ID', { day: '2-digit', month: 'long' })} | ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`, text: appTexts[now.getDay() % appTexts.length] });
      }
      setNotifs(active);
    };
    buildNotifs();

    return () => { clearTimeout(logoTimer); clearTimeout(explodeTimer); clearInterval(clockInterval); clearInterval(textInterval); };
  }, []);

  const deleteNotif = (id: string) => {
    if (id === 'yt') localStorage.setItem('habi_yt_del', new Date().getTime().toString());
    else localStorage.setItem('habi_app_del', new Date().toLocaleDateString('id-ID'));
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
  const rawResults = isDramaBox ? dramaBoxResults : isReelShort ? reelShortResults?.data : isShortMax ? shortMaxResults?.data : isNetShort ? netShortResults?.data : isMelolo ? meloloResults?.data?.search_data?.flatMap((i: any) => i.books || []).filter((b: any) => b.thumb_url) || [] : isFlickReels ? flickReelsResults?.data : freeReelsResults;

  // Fungsi peringkas kode agar tidak terpotong Vercel
  const getMappedResult = (item: any) => {
    if (isDramaBox) return { id: item.bookId, link: `/detail/dramabox/${item.bookId}`, cover: item.cover, title: item.bookName, desc: item.introduction };
    if (isReelShort) return { id: item.book_id, link: `/detail/reelshort/${item.book_id}`, cover: item.book_pic, title: item.book_title, desc: item.special_desc };
    if (isShortMax) return { id: item.shortPlayId, link: `/detail/shortmax/${item.shortPlayId}`, cover: item.cover, title: item.title, desc: "" };
    if (isNetShort) return { id: item.shortPlayId, link: `/detail/netshort/${item.shortPlayId}`, cover: item.cover, title: item.title, desc: "" };
    if (isMelolo) return { id: item.book_id, link: `/detail/melolo/${item.book_id}`, cover: item.thumb_url?.includes(".heic") ? `https://wsrv.nl/?url=${encodeURIComponent(item.thumb_url)}&output=jpg` : item.thumb_url, title: item.book_name, desc: "" };
    if (isFlickReels) return { id: item.playlet_id, link: `/detail/flickreels/${item.playlet_id}`, cover: item.cover, title: item.title, desc: "" };
    if (isFreeReels) return { id: item.key, link: `/detail/freereels/${item.key}`, cover: item.coverUrl || item.cover, title: item.title, desc: "" };
    return { id: "", link: "", cover: "", title: "", desc: "" };
  };

  if (pathname?.startsWith("/watch")) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            
            <a href="https://www.youtube.com/@habientertainmentofficial" target="_blank" rel="noopener noreferrer" className="relative flex-1 h-10 flex items-center overflow-hidden group">
              <div className={`absolute left-0 transition-all duration-700 flex items-center gap-1 px-1 py-1 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'}`}>
                {showLogo && <style dangerouslySetInnerHTML={{__html: `.kilau { position: absolute; top: 0; left: -150%; width: 150%; height: 100%; background: linear-gradient(to right, transparent, rgba(255,255,255,0.9), transparent); transform: skewX(-25deg); animation: k 1.8s ease-in-out 0.2s forwards; z-index: 20; pointer-events: none; } @keyframes k { 0% { left: -150%; } 100% { left: 150%; } }`}} />}
                <div className="kilau"></div>
                <div className="w-[30px] h-[20px] rounded-[5px] bg-[#FF0000] flex items-center justify-center relative z-10">
                  <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                </div>
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

        {/* Portal Search */}
        {searchOpen && typeof document !== "undefined" && createPortal(
          <div className="fixed inset-0 bg-white z-[9999] overflow-hidden flex flex-col px-4 py-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari drama..." className="w-full pl-12 bg-gray-50 border border-gray-200 rounded-2xl py-3 outline-none" autoFocus /></div>
              <button onClick={() => setSearchOpen(false)} className="p-3 bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {isSearching && normalizedQuery && <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /></div>}
              {rawResults?.length > 0 && <div className="grid gap-3">{rawResults.map((item: any, i: number) => {
                const res = getMappedResult(item);
                return (
                  <Link key={i} href={res.link} onClick={() => setSearchOpen(false)} className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm animate-fade-up">
                    <div className="w-16 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">{res.cover ? <img src={res.cover} alt={res.title} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" /> : <span className="text-xs text-gray-400 flex h-full items-center justify-center">No Img</span>}</div>
                    <div className="flex-1 min-w-0"><h3 className="font-bold truncate">{res.title}</h3><p className="text-sm text-gray-500 line-clamp-2 mt-2">{res.desc}</p></div>
                  </Link>
                );
              })}</div>}
            </div>
          </div>, document.body
        )}
      </header>

      {/* ANIMASI UANG AMAN */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ex { 0% { transform: scale(1); opacity: 1; } 10% { transform: scale(1.4) rotate(10deg); opacity: 1; filter: brightness(1.2); } 100% { transform: scale(0); opacity: 0; } }
        @keyframes f1 { 0% { transform: translate(0,0) scale(0.5); opacity: 1; } 100% { transform: translate(-40px, 150px) scale(1) rotate(-45deg); opacity: 0; } }
        @keyframes f2 { 0% { transform: translate(0,0) scale(0.5); opacity: 1; } 100% { transform: translate(50px, 150px) scale(1.2) rotate(30deg); opacity: 0; } }
        @keyframes f3 { 0% { transform: translate(0,0) scale(0.5); opacity: 1; } 100% { transform: translate(0px, 150px) scale(1.5) rotate(180deg); opacity: 0; } }
        @keyframes f4 { 0% { transform: translate(0,0) scale(0.5); opacity: 1; } 100% { transform: translate(-20px, 150px) scale(1) rotate(-90deg); opacity: 0; } }
        @keyframes f5 { 0% { transform: translate(0,0) scale(0.5); opacity: 1; } 100% { transform: translate(30px, 150px) scale(1) rotate(60deg); opacity: 0; } }
        .ea { animation: ex 0.5s ease-in forwards; }
        .rp { position: absolute; top: 30%; left: 30%; font-weight: bold; pointer-events: none; text-shadow: 0px 2px 4px rgba(0,0,0,0.3); opacity: 0; }
        .p1 { animation: f1 10s ease-out forwards; animation-delay: 0s; } .p2 { animation: f2 10s ease-out forwards; animation-delay: 0.1s; } .p3 { animation: f3 10s ease-out forwards; animation-delay: 0.2s; } .p4 { animation: f4 10s ease-out forwards; animation-delay: 0.3s; } .p5 { animation: f5 10s ease-out forwards; animation-delay: 0.15s; }
      `}} />

      {/* WIDGET KADO */}
      {showPromo && typeof document !== "undefined" && createPortal(
        <div className="fixed top-[260px] left-4 z-[40]">
          <div className="relative group flex flex-col items-center">
            <div className={`relative ${isExploding ? 'ea' : ''}`}>
              {isExploding && (
                <>
                  <div className="rp p1 text-green-600 text-[14px]">Rp 50K</div>
                  <div className="rp p2 text-yellow-500 text-[16px]">Rp 100K</div>
                  <div className="rp p3 text-green-500 text-[20px]">💸</div>
                  <div className="rp p4 text-yellow-600 text-[18px]">🪙</div>
                  <div className="rp p5 text-red-500 text-[14px]">Rp 200K</div>
                </>
              )}
              {!isExploding && (
                <a href="https://wa.me/6285119821813?text=Halo%20Admin,%20saya%20mau%20cairkan%20dana%20nonton!" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center transition-transform hover:scale-110">
                  <span className="text-[26px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">🎁</span>
                  <div className={`transition-opacity duration-500 mt-0.5 ${fadeText ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-[9px] font-extrabold text-[#FF0000] drop-shadow-sm bg-white/70 px-1 rounded">{promoTexts[textIndex]}</span>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>, document.body
      )}
    </>
  );
}
