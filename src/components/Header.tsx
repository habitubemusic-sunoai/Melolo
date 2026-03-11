// @ts-nocheck
"use client";
import{useState as uS,useEffect as uE,useRef as uR}from"react";
import{createPortal as cP}from"react-dom";
import Link from"next/link";
import{Search as Sr,X,MapPin,Play,Bell,Trash2,StopCircle,Tv,CircleDollarSign,MessageCircle,Send,Check,CheckCheck,ArrowLeft,Video,Phone,MoreVertical,Paperclip,Camera,Smile,Clock}from"lucide-react";
import{useSearchDramas}from"@/hooks/useDramas";import{useReelShortSearch}from"@/hooks/useReelShort";import{useNetShortSearch}from"@/hooks/useNetShort";import{useShortMaxSearch}from"@/hooks/useShortMax";import{useMeloloSearch}from"@/hooks/useMelolo";import{useFlickReelsSearch}from"@/hooks/useFlickReels";import{useFreeReelsSearch}from"@/hooks/useFreeReels";import{usePlatform}from"@/hooks/usePlatform";import{useDebounce}from"@/hooks/useDebounce";import{usePathname}from"next/navigation";

export function Header(){
  const pn=usePathname(),[iM,sIM]=uS(!1),[sO,sSO]=uS(!1),[sQ,sSQ]=uS("");
  const nQ=useDebounce(sQ,300).trim(),[sL,sSL]=uS(!0),[uC,sUC]=uS("Mencari Lokasi...");
  const [cT,sCT]=uS(""),[b,sB]=uS(0),[pS,sPS]=uS('idle'),[tI,sTI]=uS(0);
  const iW=pn?.includes("/detail")||pn?.includes("/watch"),[iI,sII]=uS(!1);
  const iTo=uR(null),[sCM,sSCM]=uS(!1),[vT,sVT]=uS(null);
  
  const [csSt,sCsSt]=uS("Online"),[cM,sCMo]=uS('idle'),[sN,sSN]=uS(!1);
  const [ns,sNs]=uS([]),[cO,sCO]=uS(!1),[cI,sCI]=uS(""),[chs,sChs]=uS([]);
  const [sE,sSE]=uS(!1),cR=uR(null),fIR=uR(null);
  const em=["😀","😂","🤣","😍","🙏","👍","😭","😎","🥰","😊","🥺","🔥","🤔","💡","✅","❌"];

  const{isDramaBox:db,isReelShort:rs,isShortMax:sm,isNetShort:nt,isMelolo:ml,isFlickReels:fr,isFreeReels:fre,platformInfo:pi}=usePlatform();
  const dR=useSearchDramas(db?nQ:""),rR=useReelShortSearch(rs?nQ:""),nR=useNetShortSearch(nt?nQ:""),sR=useShortMaxSearch(sm?nQ:""),mR=useMeloloSearch(ml?nQ:""),fR=useFlickReelsSearch(fr?nQ:""),feR=useFreeReelsSearch(fre?nQ:"");

  uE(()=>{
    sIM(!0);const sBal=localStorage.getItem('habi_balance');if(sBal)sB(Number(sBal));
    let lT;const rL=(isL)=>{sSL(isL);lT=setTimeout(()=>rL(!isL),isL?20000:30000);};rL(!0);
    let eT;if(pS==='idle')eT=setTimeout(()=>{sPS('exploding');setTimeout(()=>sPS('hidden'),10000);},15000);
    const tInt=setInterval(()=>sTI(p=>(p+1)%4),3000);
    if("geolocation" in navigator){navigator.geolocation.getCurrentPosition((p)=>fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${p.coords.latitude}&lon=${p.coords.longitude}`).then(r=>r.json()).then(d=>sUC(d.address?.city||d.address?.town||d.address?.county||"Indonesia")).catch(()=>sUC("Indonesia")),()=>fetch('https://get.geojs.io/v1/ip/geo.json').then(r=>r.json()).then(d=>sUC(d.city||"Indonesia")).catch(()=>sUC("Indonesia")),{timeout:10000,enableHighAccuracy:!0});}
    const cInt=setInterval(()=>{const d=new Date();sCT(d.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+' | '+d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:!0}));},1000);
    const aN=[];const tS=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:!0});
    if(!localStorage.getItem('habi_yt_del'))aN.push({id:'yt',type:'youtube',time:tS,title:'Admin Habi',text:'Dukung karya kami dengan {link} channel resmi kami.'});sNs(aN);
    const hW=(e)=>{const d=e.detail,tm=new Date(d.timestamp).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:!0});sNs(p=>[{id:'wd_'+d.id,type:'withdraw',time:tm,title:'Finance',text:`💳 PENDING: Rp100.000 ke ${d.method} (${d.account}) sedang diproses.`},...p]);};window.addEventListener('habi_withdraw_event',hW);
    return ()=>{clearTimeout(lT);clearTimeout(eT);clearInterval(cInt);clearInterval(tInt);window.removeEventListener('habi_withdraw_event',hW);};
  },[pS]);

  uE(()=>{const isV=pn?.includes("/detail")||pn?.includes("/watch");sII(isV);const rI=()=>{sII(!1);clearTimeout(iTo.current);iTo.current=setTimeout(()=>sII(!0),5000);};if(isV){window.addEventListener('mousemove',rI);window.addEventListener('scroll',rI);window.addEventListener('touchstart',rI);rI();}else sII(!1);return ()=>{window.removeEventListener('mousemove',rI);window.removeEventListener('scroll',rI);window.removeEventListener('touchstart',rI);clearTimeout(iTo.current);};},[pathname]);
  uE(()=>{let cT,tT;if(pS==='progress'&&iW&&iI){cT=setInterval(()=>{sB(p=>{const e=Math.floor(Math.random()*601)+700;const nB=p+e;localStorage.setItem('habi_balance',nB.toString());sVT(`+Rp ${e}`);clearTimeout(tT);tT=setTimeout(()=>sVT(null),3000);return nB;});},25000);}return ()=>{clearInterval(cT);clearTimeout(tT);};},[pS,iW,iI]);
  uE(()=>{if(cR.current)cR.current.scrollTop=cR.current.scrollHeight;},[chs,cO,csSt,cM]);

  const oCS=()=>{sCO(!0);if(cM==='idle'){sCMo('queue');sCsSt("Mencari CS yang tersedia...");setTimeout(()=>{sCsSt("Antrean ke-1...");setTimeout(()=>{sCMo('connected');sCsSt("Online");sChs([{id:'c1',sender:'admin',time:new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:!0}),text:`Halo Kak! Aku CS Habi Music. Ada yang mau ditanyain soal aplikasi atau penarikan dana? 😊`}]);},3000);},2500);}};
  const gB64=(f)=>new Promise((r)=>{const rd=new FileReader();rd.readAsDataURL(f);rd.onload=()=>r(rd.result.split(',')[1]);});
  const hIU=async(e)=>{const f=e.target.files[0];if(!f)return;const u=URL.createObjectURL(f),b=await gB64(f);sCC("Tolong bantu analisis screenshot ini ya Kak",!0,u,b,f.type);};
  const sC=(e)=>{e.preventDefault();sCC(cI,!1,null,null,null);sSE(!1);};

  const sCC=async(t,iI=!1,iU=null,b64=null,mT=null)=>{
    if(!iI&&!t.trim())return;if(cM!=='connected')return;
    const mI=Date.now().toString(),tS=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:!0});
    sChs(p=>[...p,{id:mI,sender:'user',time:tS,text:t,img:iU,status:'sent'}]);if(!iI)sCI("");
    const rD=Math.floor(Math.random()*2000)+1000;
    setTimeout(async()=>{
      sChs(p=>p.map(m=>m.id===mI?{...m,status:'read'}:m));sCsSt("Mengetik...");let r="";
      try{
        const cH=chs.map(c=>({sender:c.sender,text:c.text}));
        const p={history:cH,message:`Instruksi: Kamu CS Habi Music (cewek Jatim, ramah, logis). Jawab maks 2 kalimat. \nUser: ${t}`,image:iI&&b64?{base64:b64,mimeType:mT}:null};
        const rs=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(p)});
        if(!rs.ok)throw new Error("B");const d=await rs.json();if(d.error)throw new Error("A");r=d.reply;
      }catch(e){
        const l=t.toLowerCase();
        if(iI)r="Baik Kak, gambarnya udah aku terima. Nanti aku terusin ke tim teknis ya 🙏";
        else if(l.match(/assalamu|salam/))r="Waalaikumsalam Kak 🙏 Ada yang bisa dibantu soal penarikannya?";
        else if(l.match(/cair|tarik|uang|wd/))r="Proses pencairan butuh 1-3 hari kerja Kak 😊 Ditunggu ya pasti masuk kok.";
        else if(l.match(/kok|lama|belum/))r="Maaf banget Kak bikin nunggu 🙏 antrean penarikan emang lagi padat hari ini. Pasti diproses!";
        else if(l.match(/gimana|cara/))r="Gampang Kak, diem dan fokus nonton videonya aja tanpa di-scroll, koin otomatis nambah.";
        else if(l.match(/bohong|tipu/))r="Amanah 100% Kak 😊 Selama nggak pakai bot curang, saldo pasti kami transfer.";
        else if(l.match(/halo|hai/))r="Halo Kak! Aku CS Habi Music, ada kendala apa nih?";
        else r="Walah gitu ya Kak hehe 😂 Btw Kakak udah coba kumpulin koinnya sampai bisa ditarik belum?";
      }
      const tD=Math.min(Math.max(r.length*60,4000),18000);
      setTimeout(()=>{sCsSt("Online");setTimeout(()=>{sCsSt("Mengetik...");setTimeout(()=>{sChs(p=>[...p,{id:Date.now().toString(),sender:'admin',time:new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:!0}),text:r.replace(/\*/g,'')}]);sCsSt("Online");},Math.floor(Math.random()*2000)+2000);},1000);},tD-3000);
    },rD);
  };

  const rwR=(db?dR.data:rs?rR?.data?.data:sm?sR?.data?.data:nt?nR?.data?.data:ml?mR?.data?.data?.search_data?.flatMap(i=>i.books||[]).filter(b=>b.thumb_url):fr?fR?.data?.data:feR.data)||[];
  const gM=(i)=>{if(db)return{l:`/detail/dramabox/${i.bookId}`,c:i.cover,t:i.bookName};if(rs)return{l:`/detail/reelshort/${i.book_id}`,c:i.book_pic,t:i.book_title};if(sm)return{l:`/detail/shortmax/${i.shortPlayId}`,c:i.cover,t:i.title};if(nt)return{l:`/detail/netshort/${i.shortPlayId}`,c:i.cover,t:i.title};if(ml)return{l:`/detail/melolo/${i.book_id}`,c:i.thumb_url?.includes(".heic")?`https://wsrv.nl/?url=${encodeURIComponent(i.thumb_url)}&output=jpg`:i.thumb_url,t:i.book_name};if(fr)return{l:`/detail/flickreels/${i.playlet_id}`,c:i.cover,t:i.title};return{l:`/detail/freereels/${i.key}`,c:i.coverUrl||i.cover,t:i.title};};

  if(!iM||pn?.startsWith("/watch"))return null;

  return(
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-[60px]">
          <Link href="/" className="relative flex-1 h-12 flex items-center overflow-hidden">
            <div className={`absolute left-0 transition-all duration-700 flex items-center gap-1 overflow-hidden px-1 py-1 ${sL?'opacity-100 translate-y-0':'opacity-0 -translate-y-6 pointer-events-none'}`}>
              {sL&&<style dangerouslySetInnerHTML={{__html:`.cahaya-kilau{position:absolute;top:0;left:-150%;width:150%;height:100%;background:linear-gradient(to right,transparent,rgba(255,255,255,0.9),transparent);transform:skewX(-25deg);animation:kilauAnimasi 1.8s ease-in-out 0.2s forwards;z-index:20;pointer-events:none;}@keyframes kilauAnimasi{0%{left:-150%}100%{left:150%}}`}}/>}
              <div className="cahaya-kilau"></div>
              <div className="w-[30px] h-[20px] rounded-[5px] bg-[#FF0000] flex items-center justify-center relative z-10"><Play className="w-3 h-3 text-white fill-white ml-0.5" /></div>
              <span className="font-sans font-bold text-[22px] tracking-tighter text-black relative z-10 mt-[1px]">Habi Music</span>
            </div>
            <div className={`absolute left-0 w-full transition-all duration-700 flex flex-col justify-center ${!sL?'opacity-100 translate-y-0':'opacity-0 translate-y-6 pointer-events-none'}`}>
              <div className="flex items-center gap-1 text-gray-900 font-bold text-[10px] sm:text-xs"><MapPin className="w-3 h-3 text-[#FF0000] flex-shrink-0" /><span className="truncate max-w-[150px] sm:max-w-[250px]">{uC}</span></div>
              <div className="text-gray-500 font-mono text-[9px] sm:text-[10px] ml-4 tracking-tight">{cT}</div>
            </div>
          </Link>
          <div className="flex items-center gap-1">
            <div className="relative">
              <button onClick={()=>{sSN(!sN);sCO(!1);}} className="p-2 rounded-full hover:bg-gray-100 relative"><Bell className="w-6 h-6 text-black" />{ns.length>0&&<span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#FF0000] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{ns.length}</span>}</button>
              {sN&&cP(
                <div className="fixed inset-0 sm:absolute sm:inset-auto sm:top-14 sm:right-0 w-full h-full sm:w-[380px] sm:h-auto bg-white sm:rounded-2xl shadow-2xl border-none sm:border border-gray-100 z-[99999] sm:z-50 overflow-hidden flex flex-col sm:max-h-[85vh]">
                  {!cO?(
                    <><div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-100"><h3 className="font-black text-base sm:text-sm text-gray-800">Pusat Notifikasi</h3><div className="flex gap-2"><button onClick={oCS} className="flex items-center gap-1 bg-[#25D366]/10 text-[#008069] px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#25D366]/20 transition-colors"><MessageCircle className="w-4 h-4"/> Chat CS</button><button onClick={()=>sSN(!1)} className="p-1"><X className="w-6 h-6 sm:w-5 sm:h-5 text-gray-500"/></button></div></div>
                    <div className="flex-1 overflow-y-auto bg-white p-3" ref={cR}>{ns.length>0?ns.map(n=>(<div key={n.id} className={`flex gap-3 p-3 rounded-xl mb-3 border ${n.type==='withdraw'?'bg-blue-50 border-blue-100':'bg-white border-gray-100 shadow-sm'}`}><div className={`w-10 h-10 rounded-full flex justify-center items-center flex-shrink-0 text-white font-bold text-sm ${n.type==='withdraw'?'bg-blue-500':'bg-[#FF0000]'}`}>{n.type==='withdraw'?'Rp':'HM'}</div><div className="flex-1 pr-2"><div className="flex justify-between items-start mb-1"><span className="font-bold text-xs text-gray-900">{n.title}</span><span className="text-[10px] font-bold text-gray-400">{n.time}</span></div><p className="text-xs text-gray-600 font-medium leading-relaxed">{n.type==='youtube'?<>{n.text.split('{link}')[0]}<a href="https://youtube.com/@habientertainmentofficial" target="_blank" className="text-[#FF0000] font-bold underline">Subscribe</a>{n.text.split('{link}')[1]}</>:n.text}</p></div><button onClick={()=>{if(n.id==='yt')localStorage.setItem('habi_yt_del',Date.now().toString());sNs(ns.filter(x=>x.id!==n.id));}} className="text-gray-300 hover:text-red-500"><Trash2 className="w-5 h-5"/></button></div>)):<div className="py-10 text-center text-gray-400 text-sm font-medium">Belum ada notifikasi.</div>}</div></>
                  ):(
                    <><div className="flex items-center p-3 bg-[#008069] text-white shadow-md z-10"><button onClick={()=>sCO(!1)} className="flex items-center hover:bg-white/10 rounded-full py-1 pr-1 mr-1 -ml-1 transition-colors"><ArrowLeft className="w-6 h-6"/></button><div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0 mr-3 cursor-pointer shadow-sm"><div className="w-[20px] h-[14px] rounded-[3px] bg-[#FF0000] flex items-center justify-center"><Play className="w-2 h-2 text-white fill-white ml-0.5" /></div></div><div className="flex flex-col flex-1 cursor-pointer"><span className="font-semibold text-base leading-tight">CS Habi Music</span><span className="text-[12px] opacity-90 truncate">{csSt}</span></div><div className="flex items-center gap-4 text-white ml-2"><Video className="w-5 h-5 opacity-80"/><Phone className="w-5 h-5 opacity-80"/><MoreVertical className="w-5 h-5 opacity-80"/></div></div>
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 relative" style={{backgroundColor:'#efeae2',backgroundImage:'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',backgroundSize:'cover'}} ref={cR}><div className="text-center text-[11px] text-gray-700 font-medium my-2 bg-[#D1EAF1] self-center px-4 py-1.5 rounded-lg shadow-sm">HARI INI</div><div className="text-center text-[10px] text-gray-600 font-medium my-1 bg-[#FEF4C5] self-center px-3 py-2 rounded-lg shadow-sm w-[90%] leading-relaxed flex items-start gap-1"><div className="mt-0.5">🔒</div><span>Pesan dan panggilan dienkripsi secara end-to-end. Tim Habi Music tidak dapat membaca sandi Anda.</span></div>{cM==='queue'&&(<div className="self-center bg-white text-gray-700 text-xs px-4 py-2 rounded-full font-bold mt-4 flex items-center gap-2 shadow-sm"><div className="w-3 h-3 border-2 border-[#008069] border-t-transparent rounded-full animate-spin"></div> {csSt}</div>)}{cM==='connected'&&chs.map(c=>(<div key={c.id} className={`flex flex-col max-w-[85%] ${c.sender==='user'?'self-end':'self-start'}`}><div className={`p-2 rounded-lg text-[14px] shadow-sm relative ${c.sender==='user'?'bg-[#d9fdd3] rounded-tr-none':'bg-white rounded-tl-none'}`}>{c.img&&<img src={c.img} className="w-full max-w-[200px] rounded-md mb-1 border border-gray-200" alt="uploaded"/>}{c.text&&<p className="text-[#111111] break-words pr-12 pb-2 pl-1 leading-snug">{c.text}</p>}<div className="absolute right-1.5 bottom-1 flex items-center gap-1"><span className="text-[10px] text-gray-500 font-medium">{c.time.split(' ')[0]}</span>{c.sender==='user'&&(c.status==='read'?<CheckCheck className="w-4 h-4 text-[#53bdeb]"/>:<CheckCheck className="w-4 h-4 text-gray-400"/>)}</div></div></div>))}</div>
                    <div className="p-2 bg-transparent flex gap-1.5 items-end relative z-10" style={{backgroundImage:'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',backgroundSize:'cover'}}>{sE&&(<div className="absolute bottom-[60px] left-2 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 grid grid-cols-8 gap-2 w-[90%] z-50 animate-in slide-in-from-bottom-2">{em.map(e=><button type="button" key={e} onClick={()=>sCI(p=>p+e)} className="text-xl hover:scale-125 transition-transform">{e}</button>)}</div>)}<div className="flex-1 bg-white rounded-3xl px-2 py-1.5 flex items-end shadow-sm border border-gray-200 min-h-[44px]"><button onClick={()=>sSE(!sE)} className={`p-2 flex-shrink-0 ${sE?'text-[#008069]':'text-gray-500'}`}><Smile className="w-6 h-6"/></button><textarea value={cI} onChange={e=>sCI(e.target.value)} disabled={cM!=='connected'} placeholder="Ketik pesan" className="flex-1 bg-transparent px-2 py-2.5 text-[15px] outline-none disabled:opacity-50 resize-none max-h-24 min-h-[40px]" rows="1" /><input type="file" accept="image/*" className="hidden" ref={fIR} onChange={hIU} /><button onClick={()=>fIR.current.click()} disabled={cM!=='connected'} className="p-2 text-gray-500 flex-shrink-0 transform -rotate-45"><Paperclip className="w-6 h-6"/></button>{cI.length===0&&<button disabled={cM!=='connected'} className="p-2 text-gray-500 flex-shrink-0"><Camera className="w-6 h-6"/></button>}</div><button onClick={sC} disabled={cM!=='connected'||cI.trim().length===0} className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md flex-shrink-0 mb-0.5 transition-colors ${cM==='connected'&&cI.trim().length>0?'bg-[#008069]':'bg-gray-400'}`}><Send className="w-5 h-5 text-white ml-1"/></button></div></>
                  )}
                </div>,document.body
              )}
            </div>
            <button onClick={()=>sSO(!0)} className="p-2 rounded-full hover:bg-gray-100"><Sr className="w-6 h-6 text-black" /></button>
          </div>
        </div>
        {sO&&cP(<div className="fixed inset-0 bg-white z-[9999] flex flex-col px-4 py-6"><div className="flex items-center gap-4 mb-6"><div className="flex-1 relative"><Sr className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" value={sQ} onChange={(e)=>sSQ(e.target.value)} placeholder={`Cari di ${pi?.name||'Aplikasi'}...`} className="w-full pl-12 bg-gray-50 border border-gray-200 rounded-2xl py-3 outline-none" autoFocus /></div><button onClick={()=>sSO(!1)} className="p-3 bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button></div><div className="flex-1 overflow-y-auto"><div className="grid gap-3">{rwR.map((item,i)=>{const r=gM(item);return(<Link key={i} href={r.l} onClick={()=>sSO(!1)} className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm"><div className="w-16 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">{r.c?<img src={r.c} className="w-full h-full object-cover" />:<span>No Img</span>}</div><div className="flex-1"><h3 className="font-bold text-gray-900">{r.t}</h3></div></Link>);})}</div></div></div>,document.body)}
      </header>
      {vT&&cP(<div className="fixed top-[80px] left-1/2 -translate-x-1/2 z-[99999] bg-black/80 text-white px-4 py-2 rounded-full shadow-lg font-bold text-xs flex items-center gap-2 animate-in fade-in"><span className="text-yellow-400">🪙</span> {vT}</div>,document.body)}
      <style dangerouslySetInnerHTML={{__html:`@keyframes kp{0%{transform:scale(1)}5%{transform:scale(1.15) rotate(10deg)}10%{transform:scale(1) rotate(0deg)}100%{transform:scale(1)}}.kh{animation:kp 27s infinite}.bk{background:radial-gradient(circle at top left,#fbbf24,#d97706)}@keyframes kd{0%{transform:scale(1)}50%{transform:scale(1.3) rotate(-10deg);filter:brightness(1.2)}100%{transform:scale(0);opacity:0}}@keyframes f{0%{transform:translate(0,0) scale(0.5);opacity:1}100%{transform:translate(var(--tx),150px) scale(1.2) rotate(var(--rot));opacity:0}}.km{animation:kd 0.5s forwards}.ku{position:absolute;top:30%;left:30%;font-weight:900;pointer-events:none;opacity:0;animation:f 10s ease-out forwards}`}} />
      {pS!=='hidden'&&cP(<div className="fixed top-[320px] left-6 z-[40]">{pS==='exploding'&&(<div className="relative km"><div className="ku text-green-600 text-[14px]" style={{"--tx":"-40px","--rot":"-45deg",animationDelay:"0s"}}>Rp 50K</div><div className="ku text-yellow-500 text-[16px]" style={{"--tx":"50px","--rot":"30deg",animationDelay:"0.1s"}}>Rp 100K</div><div className="ku text-green-500 text-[20px]" style={{"--tx":"0px","--rot":"180deg",animationDelay:"0.2s"}}>💸</div><div className="ku text-yellow-600 text-[18px]" style={{"--tx":"-20px","--rot":"-90deg",animationDelay:"0.3s"}}>🪙</div><div className="ku text-red-500 text-[14px]" style={{"--tx":"30px","--rot":"60deg",animationDelay:"0.15s"}}>Rp 200K</div></div>)}{pS==='idle'&&(<button onClick={()=>{sPS('progress');sNs(p=>[{id:'sys',type:'app',time:new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:!0}),title:'Sistem Aktif',text:'✨ Sistem deteksi nonton aktif! Diam & fokus nonton video untuk hasilkan saldo otomatis.'},...p]);}} className="flex flex-col items-center hover:scale-110 outline-none"><span className="text-[34px] drop-shadow-md relative z-10">🎁</span><div className="mt-[-8px] relative z-20"><span className="text-[9px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full shadow-md border border-white/50">{pTexts[tIdx]}</span></div></button>)}{pS==='progress'&&(<button onClick={()=>sSCM(!0)} className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] border-2 border-yellow-300 kh"><div className="w-6 h-6 rounded-full bk flex items-center justify-center text-white font-black text-[12px] shadow-inner border border-yellow-200">Rp</div><span className="text-[13px] font-black text-gray-800 tracking-tight">{b.toLocaleString('id-ID')}</span></button>)}</div>,document.body)}
      {sCM&&cP(<div className="fixed inset-0 z-[100000] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 animate-in fade-in zoom-in duration-200"><div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative"><button onClick={()=>sSCM(!1)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"><X className="w-5 h-5"/></button><div className="p-6 text-center border-b border-gray-100"><div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3"><CircleDollarSign className="w-8 h-8 text-yellow-600"/></div><h2 className="font-black text-xl text-gray-900">Menu Koin</h2><p className="text-xs text-gray-500 mt-1 font-medium">Saldo bertambah otomatis saat fokus nonton.</p></div><div className="p-4 space-y-3 bg-gray-50"><button onClick={()=>sSCM(!1)} className="w-full flex items-center bg-white p-4 rounded-2xl shadow-sm border border-green-100 hover:bg-green-50 active:scale-95"><Tv className="w-6 h-6 text-green-500 mr-3"/><span className="font-bold text-gray-800">Lanjut Hasilkan Uang</span></button><button onClick={()=>{sSCM(!1);sPS('hidden');alert("Sistem uang dijeda. Saldo aman.");}} className="w-full flex items-center bg-white p-4 rounded-2xl shadow-sm border border-red-100 hover:bg-red-50 active:scale-95"><StopCircle className="w-6 h-6 text-red-500 mr-3"/><span className="font-bold text-gray-800">Berhenti Menghasilkan Uang</span></button><button onClick={()=>{sSCM(!1);alert("Memuat iklan... (Demo)");}} className="w-full flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-md active:scale-95"><Play className="w-6 h-6 text-white fill-white mr-3"/><span className="font-bold text-white">Nonton Iklan (Dapat 10Rb!)</span></button></div></div></div>,document.body)}
    </>
  );
}
