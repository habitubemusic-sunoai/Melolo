// @ts-nocheck
"use client";
import{useState as uS,useEffect as uE,useRef as uR}from"react";
import{createPortal as cP}from"react-dom";
import Link from"next/link";
import{Search as Sr,X,MapPin,Play,Bell,Trash2,StopCircle,Tv,CircleDollarSign,MessageCircle,Send,Check,CheckCheck,ArrowLeft,User}from"lucide-react";
import{useSearchDramas}from"@/hooks/useDramas";import{useReelShortSearch}from"@/hooks/useReelShort";import{useNetShortSearch}from"@/hooks/useNetShort";import{useShortMaxSearch}from"@/hooks/useShortMax";import{useMeloloSearch}from"@/hooks/useMelolo";import{useFlickReelsSearch}from"@/hooks/useFlickReels";import{useFreeReelsSearch}from"@/hooks/useFreeReels";import{usePlatform}from"@/hooks/usePlatform";import{useDebounce}from"@/hooks/useDebounce";import{usePathname}from"next/navigation";

export function Header(){
  const pn=usePathname(),[iM,sIM]=uS(!1),[sO,sSO]=uS(!1),[sQ,sSQ]=uS("");
  const nQ=useDebounce(sQ,300).trim(),[sL,sSL]=uS(!0),[uC,sUC]=uS("Mencari Lokasi...");
  const [cT,sCT]=uS(""),[b,sB]=uS(0),[pS,sPS]=uS('idle'),[tI,sTI]=uS(0);
  const iW=pn?.includes("/detail")||pn?.includes("/watch"),[iI,sII]=uS(!1);
  const iTo=uR(null),[sCM,sSCM]=uS(!1),[vT,sVT]=uS(null);
  
  const cN=["Tasya","Felicia","Ayu","Nadia","Siska","Putri"],[cs,sCs]=uS("");
  const [sN,sSN]=uS(!1),[ns,sNs]=uS([]),[cO,sCO]=uS(!1),[cI,sCI]=uS(""),[chs,sChs]=uS([]),cR=uR(null);
  const [csSt,sCsSt]=uS("Online");

  uE(()=>{
    sIM(!0);sCs("CS - "+cN[Math.floor(Math.random()*6)]);
    const sBal=localStorage.getItem('habi_balance');if(sBal)sB(Number(sBal));
    let lT;const rL=(x)=>{sSL(x);lT=setTimeout(()=>rL(!x),x?20000:30000);};rL(!0);
    let eT;if(pS==='idle'){eT=setTimeout(()=>{sPS('exploding');setTimeout(()=>sPS('hidden'),10000);},15000);}
    const tInt=setInterval(()=>sTI(p=>(p+1)%4),3000);

    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition(
        (p)=>fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${p.coords.latitude}&lon=${p.coords.longitude}`).then(r=>r.json()).then(d=>sUC(d.address?.city||d.address?.town||d.address?.county||"Indonesia")).catch(()=>sUC("Indonesia")),
        ()=>fetch('https://get.geojs.io/v1/ip/geo.json').then(r=>r.json()).then(d=>sUC(d.city||"Indonesia")).catch(()=>sUC("Indonesia")),{timeout:10000,enableHighAccuracy:!0}
      );
    }
    const cInt=setInterval(()=>{
      const d=new Date();
      sCT(d.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+' | '+d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:!0}));
    },1000);

    const aN=[];const dS=new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'short',year:'numeric'}),tS=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:!0});
    if(!localStorage.getItem('habi_yt_del'))aN.push({id:'yt',type:'yt',time:`${dS} ${tS}`,title:'Admin Habi',text:'Dukung karya kami dgn {link} channel resmi kami.'});
    sNs(aN);
    sChs([{id:'c1',sender:'a',time:tS,text:`Halo Kak! Saya CS dari tim Habi Music. Ada yg bisa dibantu hari ini? 😊`}]);

    const hW=(e)=>{
      const d=e.detail,t=new Date(d.timestamp).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:!0});
      sNs(p=>[{id:'wd_'+d.id,type:'wd',time:`${dS} ${t}`,title:'Finance',text:`💳 PENDING: Rp100K ke ${d.method} (${d.account}) diproses 1-3 hari.`},...p]);
      sB(p=>p-100000);
    };
    window.addEventListener('habi_withdraw_event',hW);
    return()=>{clearTimeout(lT);clearTimeout(eT);clearInterval(cInt);clearInterval(tInt);window.removeEventListener('habi_withdraw_event',hW);};
  },[pS]);

  uE(()=>{
    const rI=()=>{sII(!1);clearTimeout(iTo.current);iTo.current=setTimeout(()=>sII(!0),5000);};
    if(iW){window.addEventListener('mousemove',rI);window.addEventListener('scroll',rI);window.addEventListener('touchstart',rI);rI();}else sII(!1);
    return()=>{window.removeEventListener('mousemove',rI);window.removeEventListener('scroll',rI);window.removeEventListener('touchstart',rI);clearTimeout(iTo.current);};
  },[pathname,iW]);

  uE(()=>{
    let cT,tT;
    if(pS==='progress'&&iW&&iI){
      cT=setInterval(()=>{
        sB(p=>{const e=Math.floor(Math.random()*601)+700;const n=p+e;localStorage.setItem('habi_balance',n.toString());
        sVT(`+Rp ${e}`);clearTimeout(tT);tT=setTimeout(()=>sVT(null),3000);return n;});
      },25000);
    }
    return()=>{clearInterval(cT);clearTimeout(tT);};
  },[pS,iW,iI]);

  uE(()=>{if(cR.current)cR.current.scrollTop=cR.current.scrollHeight;},[chs,cO]);

  const delN=(id)=>{if(id==='yt')localStorage.setItem('habi_yt_del',Date.now().toString());sNs(notifs.filter(n=>n.id!==id));};
  const actB=()=>{sSCM(!1);sPS('hidden');alert("Sistem uang dijeda. Saldo aman.");};
  
  const sCh=(e)=>{
    e.preventDefault();if(!cI.trim())return;
    const mI=Date.now().toString(),t=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:!0}),uM=cI;
    sChs(p=>[...p,{id:mI,sender:'u',time:t,text:uM,st:1}]);sCI("");
    setTimeout(()=>{
      sChs(p=>p.map(m=>m.id===mI?{...m,st:2}:m));sCsSt("Mengetik...");
      setTimeout(()=>{
        const l=uM.toLowerCase();let r="Baik Kak, pesan sudah kami terima. Tim teknis kami akan segera menindaklanjuti hal ini ya 🙏";
        if(l.match(/cair|tarik|uang|wd|gopay|dana/))r="Untuk proses pencairan dana biasanya memakan waktu 1-3 hari kerja ya Kak. Jika lewat dari itu, silakan info kami lagi 😊";
        else if(l.match(/koin|saldo|poin|nambah/))r="Koin otomatis bertambah saat Kakak memutar video tanpa di-scroll/diam. Pastikan fokus nonton agar poin terus jalan ya!";
        else if(l.match(/lama|belum|kapan|kok/))r="Mohon maaf sekali atas ketidaknyamanannya Kak 🙏 Saat ini antrean sedang padat. Kami usahakan proses secepatnya ya!";
        else if(l.match(/gimana|kenapa|maksudnya|apa/))r="Boleh dijelaskan lebih detail kendalanya Kak? Agar kami bisa bantu berikan solusi yang tepat.";
        else if(l.match(/halo|hai|pagi|siang|min/))r="Halo juga Kak! Ada yang bisa kami bantu terkait aplikasi Habi Music hari ini?";
        else if(l.match(/bohong|tipu|scam/))r="Habi Music 100% amanah Kak. Selama syarat menonton terpenuhi tanpa curang, dana pasti dicairkan.";
        sChs(p=>[...p,{id:Date.now().toString(),sender:'a',time:new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:!0}),text:r}]);
        sCsSt("Online");
      },Math.random()*15000+5000);
    },Math.random()*2000+1000);
  };

  const {isDramaBox:db,isReelShort:rs,isShortMax:sm,isNetShort:ns,isMelolo:ml,isFlickReels:fr,isFreeReels:fre,platformInfo:pi}=usePlatform();
  const rR=(db?useSearchDramas(nQ).data:rs?useReelShortSearch(nQ).data?.data:sm?useShortMaxSearch(nQ).data?.data:ns?useNetShortSearch(nQ).data?.data:ml?useMeloloSearch(nQ).data?.data?.search_data?.flatMap(i=>i.books||[]).filter(b=>b.thumb_url):fr?useFlickReelsSearch(nQ).data?.data:useFreeReelsSearch(nQ).data)||[];
  const getMap=(i)=>{
    if(db)return{l:`/detail/dramabox/${i.bookId}`,c:i.cover,t:i.bookName};if(rs)return{l:`/detail/reelshort/${i.book_id}`,c:i.book_pic,t:i.book_title};
    if(sm)return{l:`/detail/shortmax/${i.shortPlayId}`,c:i.cover,t:i.title};if(ns)return{l:`/detail/netshort/${i.shortPlayId}`,c:i.cover,t:i.title};
    if(ml)return{l:`/detail/melolo/${i.book_id}`,c:i.thumb_url?.includes(".heic")?`https://wsrv.nl/?url=${encodeURIComponent(i.thumb_url)}&output=jpg`:i.thumb_url,t:i.book_name};
    if(fr)return{l:`/detail/flickreels/${i.playlet_id}`,c:i.cover,t:i.title};return{l:`/detail/freereels/${i.key}`,c:i.coverUrl||i.cover,t:i.title};
  };

  if(pathname?.startsWith("/watch")||!iM)return null;

  return(
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-[60px]">
          <a href="https://youtube.com/@habientertainmentofficial" target="_blank" className="relative flex-1 h-12 flex items-center overflow-hidden">
            <div className={`absolute left-0 transition-all duration-700 flex items-center gap-1 ${sL?'opacity-100 translate-y-0':'opacity-0 -translate-y-6 pointer-events-none'}`}>
              <div className="w-[30px] h-[20px] rounded-[5px] bg-[#FF0000] flex items-center justify-center"><Play className="w-3 h-3 text-white fill-white ml-0.5" /></div><span className="font-sans font-bold text-[22px] tracking-tighter text-black mt-[1px]">Habi Music</span>
            </div>
            <div className={`absolute left-0 w-full transition-all duration-700 flex flex-col justify-center ${!sL?'opacity-100 translate-y-0':'opacity-0 translate-y-6 pointer-events-none'}`}>
              <div className="flex items-center gap-1 text-gray-900 font-bold text-[10px] sm:text-xs"><MapPin className="w-3 h-3 text-[#FF0000] flex-shrink-0" /><span className="truncate max-w-[150px] sm:max-w-[250px]">{uC}</span></div>
              <div className="text-gray-500 font-mono text-[9px] sm:text-[10px] ml-4 tracking-tight">{cT}</div>
            </div>
          </a>
          <div className="flex items-center gap-1">
            <div className="relative">
              <button onClick={()=>{sSN(!sN);sCO(!1);}} className="p-2 rounded-full hover:bg-gray-100 relative"><Bell className="w-6 h-6 text-black" />{ns.length>0&&<span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#FF0000] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{ns.length}</span>}</button>
              {sN&&cP(
                <div className="fixed inset-0 sm:absolute sm:inset-auto sm:top-14 sm:right-0 w-full h-full sm:w-[380px] sm:h-auto bg-white sm:rounded-2xl shadow-2xl border-none sm:border border-gray-100 z-[99999] sm:z-50 overflow-hidden flex flex-col sm:max-h-[80vh]">
                  {!cO ? (
                    <><div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-100"><h3 className="font-black text-base sm:text-sm text-gray-800">Pusat Notifikasi</h3><div className="flex gap-2"><button onClick={()=>sCO(!0)} className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-green-200"><MessageCircle className="w-3 h-3"/> Chat CS</button><button onClick={()=>sSN(!1)} className="p-1"><X className="w-6 h-6 sm:w-5 sm:h-5 text-gray-500"/></button></div></div>
                    <div className="flex-1 overflow-y-auto bg-white p-3" ref={cR}>
                      {ns.length>0?ns.map(n=>(<div key={n.id} className={`flex gap-3 p-3 rounded-xl mb-3 border ${n.type==='wd'?'bg-blue-50 border-blue-100':'bg-white border-gray-100 shadow-sm'}`}><div className={`w-10 h-10 rounded-full flex justify-center items-center flex-shrink-0 text-white font-bold text-sm ${n.type==='wd'?'bg-blue-500':'bg-[#FF0000]'}`}>{n.type==='wd'?'Rp':'HM'}</div><div className="flex-1 pr-2"><div className="flex justify-between items-start mb-1"><span className="font-bold text-xs text-gray-900">{n.title}</span><span className="text-[10px] font-bold text-gray-400">{n.time}</span></div><p className="text-xs text-gray-600 font-medium leading-relaxed">{n.type==='yt'?<>{n.text.split('{link}')[0]}<a href="https://youtube.com/@habientertainmentofficial" target="_blank" className="text-[#FF0000] font-bold underline">Subscribe</a>{n.text.split('{link}')[1]}</>:n.text}</p></div><button onClick={()=>delN(n.id)} className="text-gray-300 hover:text-red-500"><Trash2 className="w-5 h-5"/></button></div>)):<div className="py-10 text-center text-gray-400 text-sm font-medium">Belum ada notifikasi.</div>}
                    </div></>
                  ):(
                    <><div className="flex items-center gap-3 p-3 bg-[#075e54] text-white">
                      <button onClick={()=>sCO(!1)} className="p-1 rounded-full hover:bg-white/20"><ArrowLeft className="w-6 h-6"/></button>
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><User className="w-6 h-6 text-white"/></div>
                      <div className="flex flex-col"><span className="font-bold text-base leading-tight">{cs}</span><span className="text-[11px] opacity-90">{csSt}</span></div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2" style={{backgroundColor:'#e5ddd5'}} ref={cR}>
                      <div className="text-center text-[10px] text-gray-500 font-medium my-2 bg-black/5 self-center px-3 py-1 rounded-md">Hari ini</div>
                      {chs.map(c=>(
                        <div key={c.id} className={`flex flex-col max-w-[85%] ${c.sender==='u'?'self-end':'self-start'}`}>
                          <div className={`p-2.5 rounded-lg text-sm shadow-sm relative ${c.sender==='u'?'bg-[#dcf8c6] rounded-tr-none':'bg-white rounded-tl-none'}`}>
                            <p className="text-gray-800 break-words pr-2">{c.text}</p>
                            <div className="flex items-center justify-end gap-1 mt-1 -mb-1 -mr-1">
                              <span className="text-[9px] text-gray-500">{c.time}</span>
                              {c.sender==='u'&&(c.st===2?<CheckCheck className="w-4 h-4 text-blue-500"/>:<Check className="w-4 h-4 text-gray-400"/>)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={sCh} className="p-2 bg-[#f0f0f0] flex gap-2 items-center">
                      <input type="text" value={cI} onChange={e=>sCI(e.target.value)} placeholder="Ketik pesan..." className="flex-1 bg-white rounded-full px-4 py-3 text-sm outline-none shadow-sm"/>
                      <button type="submit" className="bg-[#00a884] text-white p-3 rounded-full shadow-sm hover:bg-[#008f6f]"><Send className="w-5 h-5"/></button>
                    </form></>
                  )}
                </div>,document.body
              )}
            </div>
            <button onClick={()=>sSO(!0)} className="p-2 rounded-full hover:bg-gray-100"><Sr className="w-6 h-6 text-black" /></button>
          </div>
        </div>
        {sO&&cP(<div className="fixed inset-0 bg-white z-[9999] flex flex-col px-4 py-6"><div className="flex items-center gap-4 mb-6"><div className="flex-1 relative"><Sr className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={sQ} onChange={(e)=>sSQ(e.target.value)} placeholder={`Cari di ${pi?.name||'Aplikasi'}...`} className="w-full pl-12 bg-gray-50 border border-gray-200 rounded-2xl py-3 outline-none" autoFocus /></div><button onClick={()=>sSO(!1)} className="p-3 bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button></div><div className="flex-1 overflow-y-auto"><div className="grid gap-3">{rR.map((item,i)=>{const r=getMap(item);return(<Link key={i} href={r.l} onClick={()=>sSO(!1)} className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm"><div className="w-16 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">{r.c?<img src={r.c} className="w-full h-full object-cover" />:<span>No Img</span>}</div><div className="flex-1"><h3 className="font-bold text-gray-900">{r.t}</h3></div></Link>);})}</div></div></div>,document.body)}
      </header>

      {vT&&cP(<div className="fixed top-[80px] left-1/2 -translate-x-1/2 z-[99999] bg-black/80 text-white px-4 py-2 rounded-full shadow-lg font-bold text-xs flex items-center gap-2 animate-in fade-in"><span className="text-yellow-400">🪙</span> {vT}</div>,document.body)}
      <style dangerouslySetInnerHTML={{__html:`@keyframes kp{0%{transform:scale(1)}5%{transform:scale(1.15) rotate(10deg)}10%{transform:scale(1) rotate(0deg)}100%{transform:scale(1)}}.kh{animation:kp 27s infinite}.bk{background:radial-gradient(circle at top left,#fbbf24,#d97706)}@keyframes kd{0%{transform:scale(1)}50%{transform:scale(1.3) rotate(-10deg);filter:brightness(1.2)}100%{transform:scale(0);opacity:0}}@keyframes f{0%{transform:translate(0,0) scale(0.5);opacity:1}100%{transform:translate(var(--tx),150px) scale(1.2) rotate(var(--rot));opacity:0}}.km{animation:kd 0.5s forwards}.ku{position:absolute;top:30%;left:30%;font-weight:900;pointer-events:none;opacity:0;animation:f 10s ease-out forwards}`}}/>

      {pS!=='hidden'&&cP(
        <div className="fixed top-[320px] left-6 z-[40]">
          {pS==='exploding'&&(<div className="relative km"><div className="ku text-green-600 text-[14px]" style={{"--tx":"-40px","--rot":"-45deg",animationDelay:"0s"}}>Rp 50K</div><div className="ku text-yellow-500 text-[16px]" style={{"--tx":"50px","--rot":"30deg",animationDelay:"0.1s"}}>Rp 100K</div><div className="ku text-green-500 text-[20px]" style={{"--tx":"0px","--rot":"180deg",animationDelay:"0.2s"}}>💸</div><div className="ku text-yellow-600 text-[18px]" style={{"--tx":"-20px","--rot":"-90deg",animationDelay:"0.3s"}}>🪙</div><div className="ku text-red-500 text-[14px]" style={{"--tx":"30px","--rot":"60deg",animationDelay:"0.15s"}}>Rp 200K</div></div>)}
          {pS==='idle'&&(<button onClick={()=>{sPS('progress');sNs(p=>[{id:'sys',type:'yt',time:new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:!0}),title:'Sistem Aktif',text:'✨ Sistem deteksi nonton aktif! Diam & fokus nonton untuk hasilkan saldo.'},...p]);}} className="flex flex-col items-center hover:scale-110 outline-none"><span className="text-[34px] drop-shadow-md relative z-10">🎁</span><div className="mt-[-8px] relative z-20"><span className="text-[9px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full shadow-md border border-white/50">{pTexts[tIdx]}</span></div></button>)}
          {pS==='progress'&&(<button onClick={()=>sSCM(!0)} className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] border-2 border-yellow-300 kh"><div className="w-6 h-6 rounded-full bk flex items-center justify-center text-white font-black text-[12px] shadow-inner border border-yellow-200">Rp</div><span className="text-[13px] font-black text-gray-800 tracking-tight">{b.toLocaleString('id-ID')}</span></button>)}
        </div>,document.body
      )}

      {sCM&&cP(
        <div className="fixed inset-0 z-[100000] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 animate-in fade-in zoom-in duration-200"><div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative"><button onClick={()=>sSCM(!1)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"><X className="w-5 h-5"/></button><div className="p-6 text-center border-b border-gray-100"><div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3"><CircleDollarSign className="w-8 h-8 text-yellow-600"/></div><h2 className="font-black text-xl text-gray-900">Menu Koin</h2><p className="text-xs text-gray-500 mt-1 font-medium">Saldo bertambah otomatis saat fokus nonton.</p></div><div className="p-4 space-y-3 bg-gray-50"><button onClick={()=>sSCM(!1)} className="w-full flex items-center bg-white p-4 rounded-2xl shadow-sm border border-green-100 hover:bg-green-50"><Tv className="w-6 h-6 text-green-500 mr-3"/><span className="font-bold text-gray-800">Lanjut Hasilkan Uang</span></button><button onClick={actB} className="w-full flex items-center bg-white p-4 rounded-2xl shadow-sm border border-red-100 hover:bg-red-50"><StopCircle className="w-6 h-6 text-red-500 mr-3"/><span className="font-bold text-gray-800">Berhenti Menghasilkan Uang</span></button><button onClick={()=>{sSCM(!1);alert("Memuat iklan... (Demo)");}} className="w-full flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-md"><Play className="w-6 h-6 text-white fill-white mr-3"/><span className="font-bold text-white">Nonton Iklan (Dapat 10Rb!)</span></button></div></div></div>,document.body
      )}
    </>
  );
}
