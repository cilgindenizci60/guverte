
// ===== CANLI ARKA PLAN =====
(function(){
  const cv=document.getElementById('bg-canvas');
  if(!cv)return;
  const cx=cv.getContext('2d');
  let W,H,t=0;
  function resize(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight;}
  function draw(){
    cx.clearRect(0,0,W,H);
    // Sky
    const sky=cx.createLinearGradient(0,0,0,H*.65);
    sky.addColorStop(0,'#020810');sky.addColorStop(.6,'#04111f');sky.addColorStop(1,'#071828');
    cx.fillStyle=sky;cx.fillRect(0,0,W,H*.65);
    // Stars
    const stars=[[.16,.14,1],[.3,.07,1.2],[.44,.17,1],[.62,.05,1],[.76,.12,1],[.86,.21,.8],[.1,.25,1],[.92,.07,1.1],[.24,.1,.9],[.56,.16,1.3],[.68,.08,1],[.38,.22,.8]];
    stars.forEach(([rx,ry,r])=>{
      const a=Math.sin(t*.012+rx*10)*.4+.6;
      cx.fillStyle=`rgba(200,220,255,${a})`;
      cx.beginPath();cx.arc(rx*W,ry*H*.65,r,0,Math.PI*2);cx.fill();
    });
    // Moon
    const mx=W*.82,my=H*.1,mr=Math.min(W,H)*.028;
    const mg=cx.createRadialGradient(mx,my,0,mx,my,mr);
    mg.addColorStop(0,'rgba(200,215,230,.9)');mg.addColorStop(1,'transparent');
    cx.fillStyle=mg;cx.beginPath();cx.arc(mx,my,mr,0,Math.PI*2);cx.fill();
    cx.fillStyle='#030b18';cx.beginPath();cx.arc(mx+mr*.4,my-mr*.2,mr*.85,0,Math.PI*2);cx.fill();
    // Sea
    const sea=cx.createLinearGradient(0,H*.62,0,H);
    sea.addColorStop(0,'#071828');sea.addColorStop(1,'#030c18');
    cx.fillStyle=sea;cx.fillRect(0,H*.62,W,H);
    // Waves
    [[0,'rgba(13,48,96,.75)'],[1,'rgba(10,36,72,.6)'],[2,'rgba(8,28,56,.5)']].forEach(([i,col])=>{
      const phase=t*.009-i*.6,amp=(7+i*4)*(H/600),yb=H*(.64+i*.07);
      cx.beginPath();cx.moveTo(0,yb);
      for(let x=0;x<=W;x+=5)cx.lineTo(x,yb+Math.sin(x*.014+phase)*amp);
      cx.lineTo(W,H);cx.lineTo(0,H);cx.closePath();
      cx.fillStyle=col;cx.fill();
    });
    // Tiny islands / rocky silhouettes
    const drawIsland = (x,y,scale=1,withLight=false) => {
      cx.save();
      cx.translate(x,y);
      cx.scale(scale,scale);
      cx.fillStyle = '#08121d';
      cx.beginPath();
      cx.moveTo(-36,10);
      cx.quadraticCurveTo(-24,-4,-10,-2);
      cx.quadraticCurveTo(-2,-14,12,-10);
      cx.quadraticCurveTo(24,-6,34,8);
      cx.lineTo(-36,10);
      cx.closePath();
      cx.fill();
      cx.fillStyle = 'rgba(120,150,175,0.12)';
      cx.beginPath();
      cx.moveTo(-16,2);
      cx.quadraticCurveTo(-6,-6,4,-4);
      cx.quadraticCurveTo(12,-1,18,4);
      cx.lineTo(-16,2);
      cx.closePath();
      cx.fill();
      if(withLight){
        const pulse = 0.35 + Math.sin(t*0.028 + x*0.001)*0.18;
        cx.fillStyle = `rgba(255,226,164,${pulse})`;
        cx.beginPath();
        cx.arc(8,-11,2.2,0,Math.PI*2);
        cx.fill();
        cx.fillStyle = '#09111c';
        cx.fillRect(7,-11,2,11);
      }
      cx.restore();
    };
    // Distant ships
    const shipBob = Math.sin(t*0.02)*2;
    const drawShip = (cfg) => {
      const bob = Math.sin(t*0.024 + cfg.x*0.003)*2.2;
      cx.save();
      cx.translate(cfg.x, cfg.y + bob);
      cx.scale(cfg.scale, cfg.scale);
      cx.fillStyle = cfg.hull;
      cx.beginPath();
      cx.moveTo(-10,8);
      cx.lineTo(6,2);
      cx.lineTo(108,2);
      cx.lineTo(122,6);
      cx.lineTo(138,6);
      cx.lineTo(146,12);
      cx.lineTo(-12,12);
      cx.closePath();
      cx.fill();
      cx.fillStyle = cfg.shadow;
      cx.beginPath();
      cx.moveTo(18,10);
      cx.lineTo(136,10);
      cx.lineTo(143,12);
      cx.lineTo(6,12);
      cx.closePath();
      cx.fill();
      if(cfg.type==='kont'){
        const contColors=['#9c3f36','#2d5f96','#c27b2f','#305743'];
        [18,38,58,78].forEach((sx,i)=>{
          cx.fillStyle=contColors[i%contColors.length];
          cx.fillRect(sx,-10,16,12);
          cx.fillRect(sx,-24,16,12);
        });
        cx.fillStyle = cfg.deck;
        cx.fillRect(102,-18,18,20);
        cx.fillRect(112,-28,8,10);
      }else if(cfg.type==='tanker'){
        cx.fillStyle = '#6f8299';
        cx.fillRect(18,-4,70,2);
        cx.fillRect(26,-8,56,2);
        cx.fillStyle = cfg.deck;
        cx.fillRect(102,-16,20,18);
        cx.fillRect(112,-26,7,10);
        cx.strokeStyle = '#6d7f96';
        cx.lineWidth = 1;
        cx.beginPath();
        cx.moveTo(56,-8); cx.lineTo(56,-18); cx.lineTo(74,-18); cx.lineTo(74,-8);
        cx.stroke();
      }else if(cfg.type==='lng'){
        cx.fillStyle = '#95c7e8';
        [34,56,78].forEach((sx)=>{ cx.beginPath(); cx.ellipse(sx,-8,10,8,0,0,Math.PI*2); cx.fill(); });
        cx.fillStyle = cfg.deck;
        cx.fillRect(104,-18,18,20);
        cx.fillRect(112,-28,8,10);
      }else if(cfg.type==='roro'){
        cx.fillStyle = cfg.deck;
        cx.beginPath();
        cx.moveTo(18,-20); cx.lineTo(84,-20); cx.lineTo(94,-14); cx.lineTo(108,-14); cx.lineTo(108,2); cx.lineTo(18,2); cx.closePath();
        cx.fill();
        cx.fillStyle = '#d6dde7';
        cx.fillRect(28,-16,46,6);
      }else if(cfg.type==='feeder'){
        const contColors=['#7e3430','#29537f','#8d622c','#315743'];
        [24,44,64].forEach((sx,i)=>{
          cx.fillStyle=contColors[i%contColors.length];
          cx.fillRect(sx,-9,15,11);
        });
        cx.fillStyle = cfg.deck;
        cx.fillRect(96,-18,24,20);
        cx.fillRect(108,-28,8,10);
        cx.fillStyle = '#d5dde6';
        cx.fillRect(99,-12,10,4);
      }else if(cfg.type==='chemical'){
        cx.fillStyle = '#70839a';
        cx.fillRect(18,-4,74,2);
        cx.fillRect(26,-8,60,2);
        cx.strokeStyle = '#8ca1b8';
        cx.lineWidth = 1;
        cx.beginPath();
        cx.moveTo(48,-8); cx.lineTo(48,-18); cx.lineTo(76,-18); cx.lineTo(76,-8);
        cx.stroke();
        cx.fillStyle = cfg.deck;
        cx.fillRect(104,-18,18,20);
        cx.fillRect(112,-28,8,10);
      }else{
        cx.fillStyle = '#4d6178';
        [22,46,70].forEach((sx)=>cx.fillRect(sx,-7,16,6));
        cx.fillStyle = cfg.deck;
        cx.fillRect(102,-18,18,20);
        cx.fillRect(112,-28,8,10);
        cx.strokeStyle = '#70839a';
        cx.lineWidth = 1;
        [38,66,94].forEach((sx)=>{
          cx.beginPath();
          cx.moveTo(sx,-7); cx.lineTo(sx,-22);
          cx.lineTo(sx+7,-12);
          cx.stroke();
        });
      }
      cx.fillStyle = cfg.light;
      cx.beginPath();
      cx.arc(118,-9,1.8,0,Math.PI*2);
      cx.fill();
      cx.fillStyle = 'rgba(220,228,236,0.7)';
      cx.fillRect(107,-12,10,3);
      cx.fillStyle = 'rgba(28,49,71,0.55)';
      cx.fillRect(20,8,82,1.2);
      cx.fillStyle = 'rgba(148,92,72,0.18)';
      cx.fillRect(10,9,16,2.2);
      cx.strokeStyle = 'rgba(170,210,240,0.18)';
      cx.lineWidth = 1;
      cx.beginPath();
      cx.moveTo(-18,11);
      cx.quadraticCurveTo(-30,8,-36,13);
      cx.moveTo(-14,13);
      cx.quadraticCurveTo(-24,11,-30,15);
      cx.stroke();
      cx.restore();
    };
    drawShip({x:W*0.1, y:H*0.735 + shipBob*0.1, scale:0.42, type:'chemical', hull:'#0a1523', shadow:'#07111d', deck:'#1d3958', light:`rgba(111,168,220,${0.42+Math.sin(t*0.028)*0.12})`});
    drawShip({x:W*0.16, y:H*0.71 + shipBob*0.16, scale:0.64, type:'tanker', hull:'#0a1523', shadow:'#07111d', deck:'#193957', light:`rgba(111,168,220,${0.55+Math.sin(t*0.03)*0.15})`});
    drawShip({x:W*0.37, y:H*0.748 + shipBob*0.14, scale:0.5, type:'roro', hull:'#091523', shadow:'#06101b', deck:'#214968', light:`rgba(167,210,236,${0.4+Math.cos(t*0.02)*0.1})`});
    drawShip({x:W*0.47, y:H*0.718 + shipBob*0.11, scale:0.54, type:'bulk', hull:'#091422', shadow:'#06111b', deck:'#36506a', light:`rgba(185,205,224,${0.34+Math.sin(t*0.02)*0.1})`});
    drawShip({x:W*0.58, y:H*0.775 + shipBob*0.2, scale:0.96, type:'kont', hull:'#091321', shadow:'#06101b', deck:'#173553', light:`rgba(212,160,23,${0.5+Math.cos(t*0.025)*0.18})`});
    drawShip({x:W*0.72, y:H*0.725 + shipBob*0.12, scale:0.46, type:'feeder', hull:'#0a1624', shadow:'#07121e', deck:'#1a4163', light:`rgba(154,194,228,${0.38+Math.sin(t*0.022)*0.12})`});
    drawShip({x:W*0.8, y:H*0.695 + shipBob*0.14, scale:0.56, type:'lng', hull:'#0a1624', shadow:'#07121e', deck:'#183d62', light:`rgba(201,112,112,${0.45+Math.sin(t*0.04)*0.18})`});
    drawShip({x:W*0.88, y:H*0.742 + shipBob*0.1, scale:0.43, type:'roro', hull:'#091523', shadow:'#06101b', deck:'#214968', light:`rgba(167,210,236,${0.32+Math.cos(t*0.018)*0.08})`});
    drawShip({x:W*0.24, y:H*0.782 + shipBob*0.08, scale:0.34, type:'kont', hull:'#091321', shadow:'#06101b', deck:'#173553', light:`rgba(212,160,23,${0.26+Math.cos(t*0.022)*0.08})`});
    drawIsland(W*0.22, H*0.628, 1.05, true);
    drawIsland(W*0.52, H*0.61, 0.8, false);
    drawIsland(W*0.84, H*0.64, 0.92, true);
    // Buoys
    const drawBuoy = (x,y,body,topLight) => {
      const bob = Math.sin(t*0.03 + x*0.01)*3;
      cx.fillStyle = body;
      cx.beginPath();
      cx.ellipse(x, y+bob, 6, 8, 0, 0, Math.PI*2);
      cx.fill();
      cx.fillStyle = '#0e2238';
      cx.fillRect(x-1, y-10+bob, 2, 7);
      cx.fillStyle = topLight;
      cx.beginPath(); cx.arc(x, y-12+bob, 2.3, 0, Math.PI*2); cx.fill();
      cx.fillStyle = 'rgba(180,210,230,0.1)';
      cx.fillRect(x-1, y+bob+7, 2, 10);
    };
    drawBuoy(W*0.3, H*0.8, '#c93030', `rgba(255,160,160,${0.5+Math.sin(t*0.05)*0.25})`);
    drawBuoy(W*0.74, H*0.84, '#d4a017', `rgba(255,230,140,${0.5+Math.cos(t*0.045)*0.22})`);
    // Lighthouse silhouettes and beams
    const beamA = 0.12 + (Math.sin(t*0.018)+1)*0.08;
    cx.fillStyle = '#09111c';
    cx.fillRect(W*0.06, H*0.55, 10, H*0.11);
    cx.fillRect(W*0.055, H*0.52, 20, 6);
    cx.fillStyle = `rgba(255,240,190,${beamA})`;
    cx.beginPath();
    cx.moveTo(W*0.07, H*0.525);
    cx.lineTo(W*0.25, H*0.49);
    cx.lineTo(W*0.26, H*0.54);
    cx.closePath();
    cx.fill();
    cx.fillStyle = '#09111c';
    cx.fillRect(W*0.9, H*0.575, 8, H*0.09);
    cx.fillRect(W*0.892, H*0.548, 18, 6);
    cx.fillStyle = `rgba(255,220,170,${0.08 + (Math.cos(t*0.02)+1)*0.05})`;
    cx.beginPath();
    cx.moveTo(W*0.905, H*0.552);
    cx.lineTo(W*0.77, H*0.525);
    cx.lineTo(W*0.765, H*0.565);
    cx.closePath();
    cx.fill();
    // Moon reflection
    cx.fillStyle='rgba(180,200,220,.05)';
    cx.fillRect(W*.78,H*.62,W*.08,H*.38);
    t++;requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);
  resize();draw();
})();


// ===== DUVAR SAATİ =====
(function(){
  const days=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
  const months=['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  function drawClock(){
    const cv=document.getElementById('clock-canvas');
    if(!cv)return;
    // Force canvas size if it was collapsed (inside display:none)
    if(cv.width<10){cv.width=72;cv.height=72;}
    const cx=cv.getContext('2d');
    const W=cv.width,H=cv.height,R=W/2-4,cx0=W/2,cy0=H/2;
    const now=new Date();
    const h=now.getHours(),m=now.getMinutes(),s=now.getSeconds(),ms=now.getMilliseconds();
    cx.clearRect(0,0,W,H);
    // Face
    const bg=cx.createRadialGradient(cx0,cy0,0,cx0,cy0,R);
    bg.addColorStop(0,'#0d1f3c');bg.addColorStop(1,'#071324');
    cx.fillStyle=bg;cx.beginPath();cx.arc(cx0,cy0,R,0,Math.PI*2);cx.fill();
    // Outer ring
    cx.strokeStyle='#1a6bbf';cx.lineWidth=2;
    cx.beginPath();cx.arc(cx0,cy0,R,0,Math.PI*2);cx.stroke();
    cx.strokeStyle='#0f2748';cx.lineWidth=1;
    cx.beginPath();cx.arc(cx0,cy0,R-3,0,Math.PI*2);cx.stroke();
    // Hour ticks
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6;
      const big=i%3===0;
      const r1=R-(big?8:5),r2=R-2;
      cx.strokeStyle=big?'#2e86e0':'#1a3a5f';
      cx.lineWidth=big?2:1;
      cx.beginPath();
      cx.moveTo(cx0+Math.sin(a)*r1,cy0-Math.cos(a)*r1);
      cx.lineTo(cx0+Math.sin(a)*r2,cy0-Math.cos(a)*r2);
      cx.stroke();
    }
    // Hour numbers (12,3,6,9)
    cx.fillStyle='#4a7098';cx.font='bold 7px Share Tech Mono,monospace';cx.textAlign='center';cx.textBaseline='middle';
    [[12,0],[3,Math.PI/2],[6,Math.PI],[9,-Math.PI/2]].forEach(([n,a])=>{
      const nr=R-16;
      cx.fillText(n,cx0+Math.sin(a)*nr,cy0-Math.cos(a)*nr);
    });
    // Hour hand
    const ha=((h%12)+m/60+s/3600)*Math.PI/6;
    cx.strokeStyle='#dce8fc';cx.lineWidth=3;cx.lineCap='round';
    cx.beginPath();cx.moveTo(cx0,cy0);
    cx.lineTo(cx0+Math.sin(ha)*(R*.5),cy0-Math.cos(ha)*(R*.5));cx.stroke();
    // Minute hand
    const ma=(m+s/60)*Math.PI/30;
    cx.strokeStyle='#8aabcc';cx.lineWidth=2;cx.lineCap='round';
    cx.beginPath();cx.moveTo(cx0,cy0);
    cx.lineTo(cx0+Math.sin(ma)*(R*.72),cy0-Math.cos(ma)*(R*.72));cx.stroke();
    // Second hand
    const sa=(s+ms/1000)*Math.PI/30;
    cx.strokeStyle='#c9952a';cx.lineWidth=1;cx.lineCap='round';
    cx.beginPath();cx.moveTo(cx0-Math.sin(sa)*8,cy0+Math.cos(sa)*8);
    cx.lineTo(cx0+Math.sin(sa)*(R*.85),cy0-Math.cos(sa)*(R*.85));cx.stroke();
    // Center dot
    cx.fillStyle='#c9952a';cx.beginPath();cx.arc(cx0,cy0,3,0,Math.PI*2);cx.fill();
    cx.fillStyle='#dce8fc';cx.beginPath();cx.arc(cx0,cy0,1.5,0,Math.PI*2);cx.fill();
    // Digital
    const dig=document.getElementById('clock-digital');
    if(dig) dig.textContent=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    // Date
    const dt=document.getElementById('clock-date');
    if(dt) dt.textContent=`${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }
  setInterval(drawClock,100);
  drawClock();
  window._drawClock=drawClock;
})();

// ===== VERİ =====
const YEARS=[
  {year:1985,era:"Analog Çağ",note:"GPS yok. Sextant ile navigasyon."},
  {year:1998,era:"Dijital Geçiş",note:"GPS yaygınlaşıyor."},
  {year:2008,era:"Modern",note:"ECDIS, AIS, VDR tam kurulu."},
  {year:2018,era:"Günümüz",note:"Otomasyon ve siber güvenlik."},
];

const STYPES=[
  {key:"kuru",  ico:"🏗️",nm:"Kuru Yük",   ds:"Dökme/paket",ton:"22.000 DWT",spd:"14 kn",kontracts:[{ay:6,izin:1,ucret:"Orta"},{ay:9,izin:2,ucret:"Orta+"}]},
  {key:"tanker",ico:"🛢️",nm:"Tanker",     ds:"Petrol/kimya",ton:"45.000 DWT",spd:"13 kn",kontracts:[{ay:4,izin:1,ucret:"Yüksek"},{ay:6,izin:1,ucret:"Yüksek+"}]},
  {key:"kont",  ico:"📦",nm:"Konteyner",  ds:"TEU lojistik",ton:"18.000 GT", spd:"20 kn",kontracts:[{ay:4,izin:1,ucret:"Yüksek"},{ay:6,izin:2,ucret:"Çok Yüksek"}]},
  {key:"roro",  ico:"🚗",nm:"Ro-Ro",      ds:"Araç rampalı",ton:"12.000 GT", spd:"18 kn",kontracts:[{ay:3,izin:1,ucret:"Orta"},{ay:5,izin:1,ucret:"Orta+"}]},
  {key:"bulk",  ico:"⛏️",nm:"Bulk",        ds:"Maden/tahıl", ton:"55.000 DWT",spd:"13 kn",kontracts:[{ay:6,izin:2,ucret:"Orta"},{ay:9,izin:2,ucret:"Orta+"}]},
  {key:"lng",   ico:"🔵",nm:"LNG",         ds:"Sıvı gaz",    ton:"75.000 m³", spd:"19 kn",kontracts:[{ay:4,izin:1,ucret:"Çok Yüksek"},{ay:6,izin:2,ucret:"Maksimum"}]},
];

const SHIP_TON_PROFILES={
  kuru:{min:18000,max:32000,step:1000,unit:"DWT"},
  tanker:{min:38000,max:64000,step:2000,unit:"DWT"},
  kont:{min:12000,max:26000,step:1000,unit:"GT"},
  roro:{min:9000,max:18000,step:1000,unit:"GT"},
  bulk:{min:42000,max:82000,step:2000,unit:"DWT"},
  lng:{min:68000,max:174000,step:2000,unit:"m³"},
};
let CURRENT_SHIP_SPECS={};

function formatShipTonnage(value, unit){
  return `${Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')} ${unit}`;
}
function rollShipSpec(typeKey){
  const profile=SHIP_TON_PROFILES[typeKey];
  const fallback=STYPES.find(x=>x.key===typeKey);
  if(!profile){
    return {value:null, unit:'', tonLabel:fallback?.ton||''};
  }
  const steps=Math.floor((profile.max-profile.min)/profile.step);
  const value=profile.min + Math.floor(Math.random()*(steps+1))*profile.step;
  return {value, unit:profile.unit, tonLabel:formatShipTonnage(value, profile.unit)};
}
function refreshShipSpecs(){
  CURRENT_SHIP_SPECS={};
  STYPES.forEach(t=>{ CURRENT_SHIP_SPECS[t.key]=rollShipSpec(t.key); });
}
function getShipSpec(typeKey){
  return CURRENT_SHIP_SPECS[typeKey] || rollShipSpec(typeKey);
}

const SNAMES={
  kuru:["M/V Ege Meltem","M/V Karadeniz","M/V Bozkurt","M/V Marmara","M/V Toros"],
  tanker:["MT Boğaziçi","MT Fırat","MT Dicle","MT Akdeniz"],
  kont:["MV Istanbul Express","MV Turkon Bora","MV Bosphorus Star"],
  roro:["MV Ataşehir","MV Kadıköy","MV Üsküdar"],
  bulk:["M/V Trakya","M/V Anadolu","M/V Kayseri"],
  lng:["LNG Barbaros","LNG Fatih","LNG Yavuz"],
};

const ERA_TECH={
  1985:"GPS yok — sextant ve kâğıt harita ile seyir yapılıyor.",
  1998:"GPS yaygınlaşıyor ama güvenilirliği tartışmalı. Kâğıt harita zorunlu.",
  2008:"ECDIS var, AIS var, VDR var. Her şey kayıt altında.",
  2018:"Tam otomasyon, siber güvenlik, IMO 2020 kükürt sınırı geçerli.",
};

const CREW={
  anlatici:{name:"Anlatıcı",icon:"📖",title:""},
  suvari:{name:"Kaptan Serra",icon:"🎖️",title:"Süvari"},
  z1:{name:"1. Zabit Ece",icon:"🧭",title:"Güverte Ops. Sorumlusu"},
  z2:{name:"2. Zabit Derya",icon:"🗺️",title:"Seyir Subayı"},
  z3:{name:"3. Zabit Selin",icon:"🚒",title:"Emniyet Subayı — SOLAS"},
  carkci:{name:"Baş Mühendis Nermin",icon:"⚙️",title:"Çarkçıbaşı"},
  bas2:{name:"2. Mühendis Aylin",icon:"🔧",title:"Makine 2. Amiri"},
  lostromo:{name:"Lostromo",icon:"🪢",title:"Güverte Ustası"},
  silici:{name:"Silici Ramazan",icon:"🧹",title:"Güverte Temizlik Ustası"},
  yagci:{name:"Yağcı Mehmet Ali",icon:"🛢️",title:"Makine Yağlama Ustası"},
  asci:{name:"Aşçı Mehmet Usta",icon:"🍳",title:"Yemekhane Sorumlusu"},
  hasan:{name:"Tayfa Hasan",icon:"👷",title:"Deneyimli Güverte Tayfası"},
  musa:{name:"Tayfa Musa",icon:"👷",title:"Genç Güverte Tayfası"},
  gazsubay:{name:"Gaz Kontrol Subayı Elif",icon:"🔵",title:"IGF Sertifikalı LNG Sorumlusu"},
};

// ===== GRAFİKLER =====
const GFX={
harbor:`<rect width="480" height="145" fill="#040d1a"/>
<rect y="92" width="480" height="53" fill="#06182e"/>
<rect x="24" y="80" width="138" height="8" fill="#0a1627"/>
<rect x="42" y="62" width="32" height="18" fill="#0d2238"/>
<rect x="78" y="54" width="44" height="26" fill="#102844"/>
<rect x="126" y="66" width="28" height="14" fill="#14314f"/>
<line x1="66" y1="30" x2="66" y2="80" stroke="#1b3c5f" stroke-width="2"/>
<line x1="112" y1="24" x2="112" y2="80" stroke="#1b3c5f" stroke-width="2"/>
<line x1="66" y1="34" x2="94" y2="48" stroke="#1b3c5f" stroke-width="1.4"/>
<line x1="112" y1="28" x2="142" y2="42" stroke="#1b3c5f" stroke-width="1.4"/>
<rect x="34" y="88" width="122" height="2" fill="#35506d" opacity=".35"/>
<line x1="235" y1="18" x2="235" y2="90" stroke="#1e3a5f" stroke-width="2"/>
<line x1="210" y1="20" x2="265" y2="20" stroke="#1e3a5f" stroke-width="2"/>
<line x1="250" y1="20" x2="250" y2="70" stroke="#1e3a5f" stroke-width="1" stroke-dasharray="3,2"/>
<rect x="308" y="76" width="28" height="14" rx="1" fill="#1a4a7f"/>
<rect x="338" y="76" width="28" height="14" rx="1" fill="#2a5a30"/>
<rect x="368" y="76" width="28" height="14" rx="1" fill="#5a1a1a"/>
<rect x="308" y="62" width="28" height="14" rx="1" fill="#2a5a30"/>
<rect x="338" y="62" width="28" height="14" rx="1" fill="#1a4a7f"/>
<circle cx="418" cy="36" r="3" fill="#d4a017" opacity=".8"/>
<line x1="55" y1="96" x2="185" y2="96" stroke="#1a4a7f" stroke-width="1" opacity=".4"/>`,

deck:`<rect width="480" height="145" fill="#06111b"/>
<rect y="86" width="480" height="59" fill="#7b5a35"/>
<path d="M0 95 H480 M0 106 H480 M0 117 H480 M0 128 H480" stroke="#9b7447" stroke-width="1" opacity=".45"/>
<path d="M48 86 V145 M112 86 V145 M176 86 V145 M240 86 V145 M304 86 V145 M368 86 V145 M432 86 V145" stroke="#634626" stroke-width="1" opacity=".35"/>
<rect x="26" y="72" width="118" height="10" rx="2" fill="#24384c"/>
<rect x="44" y="54" width="42" height="18" fill="#314b63"/>
<rect x="92" y="48" width="28" height="24" fill="#3b5872"/>
<line x1="130" y1="40" x2="130" y2="86" stroke="#70879c" stroke-width="2"/>
<line x1="130" y1="44" x2="156" y2="60" stroke="#70879c" stroke-width="1.2"/>
<rect x="298" y="68" width="132" height="12" rx="2" fill="#182534"/>
<rect x="322" y="56" width="26" height="12" rx="1" fill="#d7e1e8"/>
<rect x="350" y="50" width="14" height="18" rx="1" fill="#d7e1e8"/>
<line x1="358" y1="40" x2="358" y2="50" stroke="#607d99" stroke-width="1.1"/>
<circle cx="380" cy="73" r="2" fill="#d4a017" opacity=".8"/>
<circle cx="392" cy="73" r="2" fill="#5dbf8a" opacity=".75"/>
<path d="M154 82 Q190 76 226 82" fill="none" stroke="#b7d0e2" stroke-width="1.6" opacity=".36"/>`,

sea:`<rect width="480" height="145" fill="#030d1a"/>
<rect width="480" height="60" fill="#04111f"/>
<ellipse cx="240" cy="62" rx="200" ry="12" fill="#1a4a7f" opacity=".15"/>
<rect y="62" width="480" height="83" fill="#06182e"/>
<g class="wave-anim">
<path d="M0 76 Q30 70 60 76 Q90 82 120 76 Q150 70 180 76 Q210 82 240 76 Q270 70 300 76 Q330 82 360 76 Q390 70 420 76 Q450 82 480 76 Q510 70 540 76" fill="none" stroke="#0d3060" stroke-width="1.5" opacity=".7"/>
<path d="M0 92 Q40 86 80 92 Q120 98 160 92 Q200 86 240 92 Q280 98 320 92 Q360 86 400 92 Q440 98 480 92" fill="none" stroke="#0f3868" stroke-width="1.2" opacity=".5"/>
<path d="M0 110 Q60 104 120 110 Q180 116 240 110 Q300 104 360 110 Q420 116 480 110" fill="none" stroke="#0d3060" stroke-width="1" opacity=".4"/>
</g>
<circle cx="80" cy="20" r="1" fill="#fff" opacity=".6"/>
<circle cx="150" cy="10" r="1" fill="#fff" opacity=".8"/>
<circle cx="220" cy="24" r="1.2" fill="#fff" opacity=".5"/>
<circle cx="310" cy="7" r="1" fill="#fff" opacity=".7"/>
<circle cx="380" cy="17" r="1" fill="#fff" opacity=".6"/>
<path d="M286 67 Q330 61 372 68" fill="none" stroke="#17436f" stroke-width="1" opacity=".22"/>
<path d="M280 74 Q334 69 392 75" fill="none" stroke="#133a63" stroke-width=".9" opacity=".18"/>`,

night:`<rect width="480" height="145" fill="#020810"/>
<rect width="480" height="66" fill="#030b18"/>
<circle cx="380" cy="25" r="14" fill="#b8c8d8" opacity=".9"/>
<circle cx="385" cy="22" r="11" fill="#030b18"/>
<circle cx="380" cy="25" r="22" fill="none" stroke="#6090a0" stroke-width="1" opacity=".3"/>
<circle cx="30" cy="14" r="1" fill="#fff" opacity=".8"/>
<circle cx="70" cy="8" r="1.2" fill="#fff" opacity=".9"/>
<circle cx="120" cy="21" r="1" fill="#fff" opacity=".6"/>
<circle cx="160" cy="9" r="1" fill="#fff" opacity=".7"/>
<circle cx="200" cy="27" r="1.5" fill="#fff" opacity=".5"/>
<circle cx="250" cy="4" r="1" fill="#fff" opacity=".8"/>
<circle cx="310" cy="11" r="1.2" fill="#fff" opacity=".7"/>
<circle cx="430" cy="15" r="1" fill="#fff" opacity=".6"/>
<rect y="66" width="480" height="79" fill="#030c1e"/>
<ellipse cx="390" cy="100" rx="30" ry="4" fill="#405060" opacity=".3"/>
<g class="wave-anim">
<path d="M0 78 Q40 72 80 78 Q120 84 160 78 Q200 72 240 78 Q280 84 320 78 Q360 72 400 78 Q440 84 480 78" fill="none" stroke="#0a2038" stroke-width="1.5" opacity=".6"/>
<path d="M0 96 Q50 90 100 96 Q150 102 200 96 Q250 90 300 96 Q350 102 400 96 Q450 90 500 96" fill="none" stroke="#081828" stroke-width="1.2" opacity=".5"/>
</g>
<path d="M184 73 Q238 67 294 74" fill="none" stroke="#12304f" stroke-width="1" opacity=".22"/>
<path d="M204 82 Q246 78 306 84" fill="none" stroke="#0c2238" stroke-width="1" opacity=".16"/>`,

storm:`<rect width="480" height="145" fill="#020a14"/>
<rect width="480" height="145" fill="rgba(235,245,255,.06)" class="storm-flash"/>
<ellipse cx="92" cy="20" rx="92" ry="26" fill="#0a1828" opacity=".96"/>
<ellipse cx="212" cy="10" rx="116" ry="24" fill="#081420" opacity=".94"/>
<ellipse cx="330" cy="18" rx="102" ry="25" fill="#0a1828" opacity=".96"/>
<ellipse cx="438" cy="10" rx="76" ry="21" fill="#060f18"/>
<polyline points="198,11 188,38 197,38 181,71 194,56 189,56" fill="none" stroke="#e6ebf5" stroke-width="2" opacity=".92" class="lightning-flash"/>
<polyline points="342,6 333,30 341,30 324,60 336,48 332,48" fill="none" stroke="#d7deec" stroke-width="1.5" opacity=".72" class="lightning-flash2"/>
<line x1="40" y1="48" x2="34" y2="68" stroke="#0d3060" stroke-width="1" opacity=".6"/>
<line x1="80" y1="43" x2="74" y2="63" stroke="#0d3060" stroke-width="1" opacity=".5"/>
<line x1="130" y1="48" x2="124" y2="68" stroke="#0d3060" stroke-width="1" opacity=".6"/>
<line x1="200" y1="46" x2="194" y2="66" stroke="#0d3060" stroke-width="1" opacity=".5"/>
<line x1="280" y1="50" x2="274" y2="70" stroke="#0d3060" stroke-width="1" opacity=".6"/>
<line x1="360" y1="44" x2="354" y2="64" stroke="#0d3060" stroke-width="1" opacity=".5"/>
<line x1="430" y1="48" x2="424" y2="68" stroke="#0d3060" stroke-width="1" opacity=".6"/>
<rect y="70" width="480" height="75" fill="#041020"/>
<g class="storm-wave">
<path d="M0 78 Q18 58 36 78 Q54 98 72 78 Q90 58 108 78 Q126 98 144 78 Q162 58 180 78 Q198 98 216 78 Q234 58 252 78 Q270 98 288 78 Q306 58 324 78 Q342 98 360 78 Q378 58 396 78 Q414 98 432 78 Q450 58 468 78 Q474 86 480 78" fill="none" stroke="#1a477a" stroke-width="3.2" opacity=".92"/>
<path d="M0 98 Q20 74 40 98 Q60 122 80 98 Q100 74 120 98 Q140 122 160 98 Q180 74 200 98 Q220 122 240 98 Q260 74 280 98 Q300 122 320 98 Q340 74 360 98 Q380 122 400 98 Q420 74 440 98 Q460 122 480 98" fill="none" stroke="#10365d" stroke-width="2.6" opacity=".82"/>
<path d="M0 116 Q24 98 48 116 Q72 134 96 116 Q120 98 144 116 Q168 134 192 116 Q216 98 240 116 Q264 134 288 116 Q312 98 336 116 Q360 134 384 116 Q408 98 432 116 Q456 134 480 116" fill="none" stroke="#0b2743" stroke-width="2.2" opacity=".72"/>
</g>
<path d="M18 82 Q30 76 42 82" fill="none" stroke="#b7d0e2" stroke-width="1.8" opacity=".62"/>
<path d="M96 76 Q108 70 120 76" fill="none" stroke="#b7d0e2" stroke-width="1.8" opacity=".54"/>
<path d="M214 84 Q226 78 238 84" fill="none" stroke="#b7d0e2" stroke-width="1.8" opacity=".62"/>
<path d="M336 78 Q348 72 360 78" fill="none" stroke="#b7d0e2" stroke-width="1.8" opacity=".54"/>`,

radar:`<rect width="480" height="145" fill="#030d0d"/>
<rect x="18" y="12" width="284" height="120" rx="8" fill="#061111" stroke="#11433d" stroke-width="1.6"/>
<circle cx="160" cy="72" r="56" fill="#03110b"/>
<circle cx="160" cy="72" r="56" fill="none" stroke="#12604f" stroke-width="1.6"/>
<circle cx="160" cy="72" r="14" fill="none" stroke="#114d3a" stroke-width=".9" opacity=".7"/>
<circle cx="160" cy="72" r="28" fill="none" stroke="#114d3a" stroke-width=".9" opacity=".6"/>
<circle cx="160" cy="72" r="42" fill="none" stroke="#114d3a" stroke-width=".9" opacity=".48"/>
<circle cx="160" cy="72" r="54" fill="none" stroke="#114d3a" stroke-width=".8" opacity=".32"/>
<line x1="104" y1="72" x2="216" y2="72" stroke="#114d3a" stroke-width=".9" opacity=".46"/>
<line x1="160" y1="16" x2="160" y2="128" stroke="#114d3a" stroke-width=".9" opacity=".46"/>
<path d="M160 72 L160 16 A56 56 0 0 1 208 99 Z" fill="#35ff7a" opacity=".05"/>
<g class="radar-sweep" style="transform-origin:160px 72px">
<line x1="160" y1="72" x2="160" y2="16" stroke="#35ff7a" stroke-width="1.7" opacity=".88"/>
</g>
<circle cx="182" cy="50" r="2.6" fill="#35ff7a" opacity=".95" class="blink"/>
<circle cx="194" cy="86" r="2.2" fill="#35ff7a" opacity=".68"/>
<circle cx="132" cy="61" r="1.8" fill="#35ff7a" opacity=".52"/>
<circle cx="168" cy="102" r="1.9" fill="#35ff7a" opacity=".58"/>
<circle cx="160" cy="72" r="2.6" fill="#7fc3ff"/>
<line x1="160" y1="72" x2="182" y2="50" stroke="#ffd45a" stroke-width="1" stroke-dasharray="3,2" opacity=".72"/>
<text x="157" y="22" fill="#1f7c63" font-size="6.5" font-family="monospace">000</text>
<text x="213" y="75" fill="#1f7c63" font-size="6.5" font-family="monospace">090</text>
<text x="156" y="126" fill="#1f7c63" font-size="6.5" font-family="monospace">180</text>
<text x="96" y="75" fill="#1f7c63" font-size="6.5" font-family="monospace">270</text>
<text x="166" y="58" fill="#1f7c63" font-size="5.5" font-family="monospace">1.5</text>
<text x="166" y="44" fill="#1f7c63" font-size="5.5" font-family="monospace">3.0</text>
<text x="166" y="30" fill="#1f7c63" font-size="5.5" font-family="monospace">6.0 NM</text>
<rect x="314" y="14" width="148" height="118" rx="8" fill="#071420" stroke="#10304e" stroke-width="1.6"/>
<rect x="326" y="24" width="124" height="18" rx="4" fill="#04111c" stroke="#174464" stroke-width=".8"/>
<text x="336" y="36" fill="#cfeaff" font-size="7" font-family="monospace">RADAR / ARPA STATUS</text>
<text x="330" y="56" fill="#81f7b8" font-size="7" font-family="monospace">RANGE   6.0 NM</text>
<text x="330" y="69" fill="#7fc3ff" font-size="7" font-family="monospace">MODE    HEAD-UP RM</text>
<text x="330" y="82" fill="#fff4bf" font-size="7" font-family="monospace">GAIN    68</text>
<text x="330" y="95" fill="#fff4bf" font-size="7" font-family="monospace">SEA     24   RAIN 10</text>
<text x="330" y="108" fill="#5dbf8a" font-size="7" font-family="monospace">TRAIL   3 MIN</text>
<rect x="326" y="114" width="124" height="8" rx="3" fill="#0d2840"/>
<rect x="326" y="114" width="74" height="8" rx="3" fill="#35ff7a" opacity=".7"/>
<text x="24" y="140" fill="#7fc3ff" font-size="6.5" font-family="monospace">X-BAND   12 kW   STBY OFF   TX ON</text>`,

compass:`<rect width="480" height="145" fill="#040d1a"/>
<line x1="0" y1="30" x2="480" y2="30" stroke="#0a1e30" stroke-width="1" opacity=".4"/>
<line x1="0" y1="72" x2="480" y2="72" stroke="#0a1e30" stroke-width="1" opacity=".3"/>
<line x1="0" y1="116" x2="480" y2="116" stroke="#0a1e30" stroke-width="1" opacity=".4"/>
<line x1="120" y1="0" x2="120" y2="145" stroke="#0a1e30" stroke-width="1" opacity=".3"/>
<line x1="360" y1="0" x2="360" y2="145" stroke="#0a1e30" stroke-width="1" opacity=".3"/>
<circle cx="150" cy="72" r="54" fill="#050f1c"/>
<circle cx="150" cy="72" r="54" fill="none" stroke="#1a3a5f" stroke-width="2"/>
<circle cx="150" cy="72" r="42" fill="none" stroke="#0d2a48" stroke-width="1"/>
<circle cx="150" cy="72" r="28" fill="none" stroke="#0a1e38" stroke-width="1" opacity=".5"/>
<line x1="150" y1="18" x2="150" y2="26" stroke="#2e6bbf" stroke-width="2"/>
<line x1="150" y1="118" x2="150" y2="126" stroke="#2e6bbf" stroke-width="2"/>
<line x1="96" y1="72" x2="104" y2="72" stroke="#2e6bbf" stroke-width="2"/>
<line x1="196" y1="72" x2="204" y2="72" stroke="#2e6bbf" stroke-width="2"/>
<text x="145" y="14" fill="#6fa8dc" font-size="10" font-weight="bold" font-family="monospace">N</text>
<text x="145" y="136" fill="#2e6bbf" font-size="9" font-family="monospace">S</text>
<text x="82" y="76" fill="#2e6bbf" font-size="9" font-family="monospace">W</text>
<text x="210" y="76" fill="#2e6bbf" font-size="9" font-family="monospace">E</text>
<g class="compass-needle" style="transform-origin:150px 72px">
<polygon points="150,20 145,72 150,77 155,72" fill="#c93030"/>
<polygon points="150,124 145,72 150,67 155,72" fill="#e8e8e8"/>
</g>
<circle cx="150" cy="72" r="5" fill="#0d1f3c"/>
<circle cx="150" cy="72" r="3" fill="#2e6bbf"/>
<rect x="278" y="22" width="178" height="102" rx="4" fill="#050f1c"/>
<rect x="278" y="22" width="178" height="102" rx="4" fill="none" stroke="#0d2a48" stroke-width="1"/>
<rect x="286" y="30" width="162" height="56" rx="2" fill="#030c18"/>
<path d="M293 76 Q320 52 358 56 Q388 60 432 44" fill="none" stroke="#0d3060" stroke-width="1.5" opacity=".8"/>
<polygon points="360,56 357,64 363,64" fill="#6fa8dc" opacity=".8"/>
<line x1="360" y1="56" x2="418" y2="30" stroke="#d4a017" stroke-width="1" stroke-dasharray="3,2" opacity=".7"/>
<text x="286" y="96" fill="#2e6bbf" font-size="7" font-family="monospace">SPD: 14.2 kn</text>
<text x="286" y="107" fill="#2e6bbf" font-size="7" font-family="monospace">COG: 247°</text>
<text x="368" y="96" fill="#d4a017" font-size="7" font-family="monospace">ETA: 06:42</text>
<text x="368" y="107" fill="#5dbf8a" font-size="7" font-family="monospace">RNG: 38nm</text>`,

ecdis_panel:`<rect width="480" height="145" fill="#04101b"/>
<rect x="24" y="18" width="432" height="108" rx="6" fill="#03111c" stroke="#10304e" stroke-width="2"/>
<path d="M42 38 h392 M42 58 h392 M42 78 h392 M42 98 h392" stroke="#0d2a48" stroke-width=".8" opacity=".5"/>
<path d="M72 26 v92 M120 26 v92 M168 26 v92 M216 26 v92 M264 26 v92 M312 26 v92 M360 26 v92 M408 26 v92" stroke="#0d2a48" stroke-width=".8" opacity=".45"/>
<polyline points="76,94 118,88 164,90 208,76 250,72 286,68 322,60 364,52 406,42" fill="none" stroke="#d4a017" stroke-width="2.4" stroke-dasharray="6,3"/>
<circle cx="76" cy="94" r="3" fill="#1aff50"/><circle cx="164" cy="90" r="3" fill="#1aff50"/><circle cx="250" cy="72" r="3" fill="#1aff50"/><circle cx="364" cy="52" r="3" fill="#1aff50"/>
<path d="M78 102 l10 -5 l-3 9 z" fill="#6fa8dc"/>
<circle cx="78" cy="102" r="4" fill="#6fa8dc"/>
<text x="36" y="14" fill="#81f7b8" font-size="8" font-family="monospace">ECDIS ROUTE MONITOR</text>
<text x="40" y="134" fill="#d4a017" font-size="7" font-family="monospace">SAFETY CONTOUR 30m</text>
<text x="216" y="134" fill="#6fa8dc" font-size="7" font-family="monospace">XTD 0.24 nm</text>
<text x="334" y="134" fill="#5dbf8a" font-size="7" font-family="monospace">WP NEXT 042</text>`,

ais_panel:`<rect width="480" height="145" fill="#07121d"/>
<rect x="30" y="18" width="420" height="108" rx="6" fill="#03111c" stroke="#0d2a48" stroke-width="2"/>
<rect x="42" y="30" width="176" height="84" rx="4" fill="#051522"/>
<circle cx="130" cy="72" r="32" fill="none" stroke="#0d3a18" stroke-width="1.2"/>
<circle cx="130" cy="72" r="20" fill="none" stroke="#0d3a18" stroke-width=".9"/>
<circle cx="154" cy="56" r="3" fill="#1aff50"/><circle cx="112" cy="86" r="2.6" fill="#d4a017"/><circle cx="142" cy="88" r="2.4" fill="#6fa8dc"/>
<path d="M130 72 L154 56" stroke="#6fa8dc" stroke-width="1" stroke-dasharray="3,2"/>
<rect x="236" y="30" width="200" height="84" rx="4" fill="#051522"/>
<text x="248" y="44" fill="#81f7b8" font-size="7" font-family="monospace">AIS TARGET LIST</text>
<text x="248" y="60" fill="#d4a017" font-size="7" font-family="monospace">MV AEGEAN STAR   CPA 1.2</text>
<text x="248" y="74" fill="#6fa8dc" font-size="7" font-family="monospace">TANKER LARA      TCPA 14</text>
<text x="248" y="88" fill="#5dbf8a" font-size="7" font-family="monospace">PILOT BOAT       2.4 NM</text>
<text x="248" y="102" fill="#c97070" font-size="7" font-family="monospace">DATA OFFSET ?</text>
<text x="34" y="14" fill="#81f7b8" font-size="8" font-family="monospace">AIS TERMINAL</text>`,

gyro_panel:`<rect width="480" height="145" fill="#06101a"/>
<circle cx="138" cy="74" r="48" fill="#071828" stroke="#1a3a5f" stroke-width="2"/>
<circle cx="138" cy="74" r="36" fill="none" stroke="#0d2a48" stroke-width="1"/>
<circle cx="138" cy="74" r="8" fill="#0d1f3c"/>
<g class="compass-needle" style="transform-origin:138px 74px">
<polygon points="138,30 132,74 138,80 144,74" fill="#c93030"/>
<polygon points="138,118 132,74 138,68 144,74" fill="#d9e3ea"/>
</g>
<text x="132" y="22" fill="#6fa8dc" font-size="9" font-family="monospace">N</text>
<rect x="236" y="24" width="190" height="94" rx="6" fill="#071828" stroke="#10304e" stroke-width="1.5"/>
<text x="250" y="44" fill="#81f7b8" font-size="8" font-family="monospace">GYRO COMPASS</text>
<text x="250" y="64" fill="#d4a017" font-size="18" font-family="monospace">247°</text>
<text x="250" y="84" fill="#6fa8dc" font-size="7" font-family="monospace">SETTLING: OK</text>
<text x="250" y="98" fill="#5dbf8a" font-size="7" font-family="monospace">ERROR < 0.5°</text>
<text x="36" y="18" fill="#81f7b8" font-size="8" font-family="monospace">MASTER GYRO</text>`,

magnetic_panel:`<rect width="480" height="145" fill="#08131e"/>
<circle cx="150" cy="74" r="50" fill="#101820" stroke="#8a6a2f" stroke-width="3"/>
<circle cx="150" cy="74" r="38" fill="#f0e0b8" stroke="#8a6a2f" stroke-width="1.5"/>
<text x="146" y="38" fill="#714d18" font-size="8" font-family="monospace">N</text>
<text x="146" y="112" fill="#714d18" font-size="8" font-family="monospace">S</text>
<text x="112" y="78" fill="#714d18" font-size="8" font-family="monospace">W</text>
<text x="188" y="78" fill="#714d18" font-size="8" font-family="monospace">E</text>
<g class="compass-needle" style="transform-origin:150px 74px">
<polygon points="150,40 146,74 150,78 154,74" fill="#c93030"/>
<polygon points="150,108 146,74 150,70 154,74" fill="#222"/>
</g>
<rect x="250" y="28" width="166" height="88" rx="8" fill="#15110d" stroke="#8a6a2f" stroke-width="1.5"/>
<text x="264" y="46" fill="#d4a017" font-size="8" font-family="monospace">MAGNETIC COMPASS</text>
<text x="264" y="68" fill="#f2e1b0" font-size="16" font-family="monospace">246° M</text>
<text x="264" y="90" fill="#c8b070" font-size="7" font-family="monospace">DEVIATION CARD</text>
<text x="264" y="102" fill="#c8b070" font-size="7" font-family="monospace">STANDBY STEERING</text>`,

echo_panel:`<rect width="480" height="145" fill="#05111b"/>
<rect x="42" y="24" width="396" height="96" rx="6" fill="#03111c" stroke="#0d2a48" stroke-width="2"/>
<path d="M58 38 h360 M58 56 h360 M58 74 h360 M58 92 h360" stroke="#0d2a48" stroke-width=".8" opacity=".5"/>
<path d="M96 30 v84 M144 30 v84 M192 30 v84 M240 30 v84 M288 30 v84 M336 30 v84 M384 30 v84" stroke="#0d2a48" stroke-width=".8" opacity=".45"/>
<polyline points="60,100 92,98 124,96 156,94 188,92 220,88 252,82 284,78 316,76 348,74 380,72 412,70" fill="none" stroke="#d4a017" stroke-width="2"/>
<rect x="300" y="40" width="116" height="48" rx="4" fill="#071828"/>
<text x="312" y="56" fill="#81f7b8" font-size="8" font-family="monospace">ECHO SOUNDER</text>
<text x="312" y="76" fill="#d4a017" font-size="18" font-family="monospace">18.4 m</text>
<text x="312" y="90" fill="#6fa8dc" font-size="7" font-family="monospace">UKC TREND STABLE</text>`,

speedlog_panel:`<rect width="480" height="145" fill="#07111d"/>
<rect x="58" y="28" width="148" height="88" rx="8" fill="#041321" stroke="#0d2a48" stroke-width="1.8"/>
<text x="76" y="46" fill="#81f7b8" font-size="8" font-family="monospace">SPEED LOG</text>
<text x="78" y="78" fill="#d4a017" font-size="24" font-family="monospace">14.2</text>
<text x="152" y="78" fill="#6fa8dc" font-size="10" font-family="monospace">kn</text>
<text x="76" y="98" fill="#5dbf8a" font-size="7" font-family="monospace">STW 13.8</text>
<rect x="246" y="28" width="174" height="88" rx="8" fill="#041321" stroke="#0d2a48" stroke-width="1.8"/>
<text x="262" y="48" fill="#81f7b8" font-size="8" font-family="monospace">LOG HISTORY</text>
<path d="M262 92 Q292 86 322 88 Q352 90 402 72" fill="none" stroke="#6fa8dc" stroke-width="2"/>
<text x="262" y="106" fill="#d4a017" font-size="7" font-family="monospace">SOG / STW CROSS-CHECK</text>`,

autopilot_panel:`<rect width="480" height="145" fill="#05111b"/>
<rect x="82" y="22" width="316" height="100" rx="10" fill="#071828" stroke="#10304e" stroke-width="2"/>
<text x="104" y="42" fill="#81f7b8" font-size="8" font-family="monospace">AUTOPILOT CONTROL</text>
<text x="104" y="72" fill="#d4a017" font-size="22" font-family="monospace">HDG 247°</text>
<text x="104" y="94" fill="#6fa8dc" font-size="10" font-family="monospace">MODE: AUTO</text>
<rect x="286" y="48" width="84" height="22" rx="4" fill="#0d2840"/><text x="300" y="63" fill="#d9e3ea" font-size="9" font-family="monospace">RUDDER 5°</text>
<rect x="286" y="80" width="84" height="22" rx="4" fill="#113050"/><text x="302" y="95" fill="#81f7b8" font-size="9" font-family="monospace">TRACK OFF</text>`,

bnwas_panel:`<rect width="480" height="145" fill="#061019"/>
<rect x="94" y="28" width="292" height="88" rx="8" fill="#071828" stroke="#0d2a48" stroke-width="2"/>
<text x="112" y="48" fill="#81f7b8" font-size="8" font-family="monospace">BNWAS PANEL</text>
<rect x="112" y="62" width="110" height="26" rx="4" fill="#113050"/><text x="132" y="79" fill="#d9e3ea" font-size="10" font-family="monospace">WATCH ACTIVE</text>
<circle cx="278" cy="76" r="10" fill="#d4a017" opacity=".9"/><text x="271" y="80" fill="#05111b" font-size="9" font-family="monospace">ACK</text>
<text x="112" y="102" fill="#c97070" font-size="8" font-family="monospace">TIMER 02:30</text>
<text x="248" y="102" fill="#6fa8dc" font-size="8" font-family="monospace">STAGE 1 READY</text>`,

gmdss_panel:`<rect width="480" height="145" fill="#06111c"/>
<rect x="34" y="22" width="412" height="102" rx="8" fill="#071828" stroke="#10304e" stroke-width="2"/>
<text x="52" y="42" fill="#81f7b8" font-size="8" font-family="monospace">GMDSS CONSOLE</text>
<rect x="52" y="54" width="92" height="50" rx="4" fill="#03111c" stroke="#0d2a48" stroke-width="1"/><text x="64" y="74" fill="#d4a017" font-size="8" font-family="monospace">VHF DSC</text><text x="64" y="90" fill="#6fa8dc" font-size="7" font-family="monospace">CH16 READY</text>
<rect x="160" y="54" width="92" height="50" rx="4" fill="#03111c" stroke="#0d2a48" stroke-width="1"/><text x="176" y="74" fill="#d4a017" font-size="8" font-family="monospace">MF/HF</text><text x="176" y="90" fill="#6fa8dc" font-size="7" font-family="monospace">2187.5 kHz</text>
<rect x="268" y="54" width="72" height="50" rx="4" fill="#03111c" stroke="#0d2a48" stroke-width="1"/><text x="282" y="74" fill="#d4a017" font-size="8" font-family="monospace">EPIRB</text><text x="282" y="90" fill="#6fa8dc" font-size="7" font-family="monospace">ARMED</text>
<rect x="354" y="54" width="72" height="50" rx="4" fill="#03111c" stroke="#0d2a48" stroke-width="1"/><text x="370" y="74" fill="#d4a017" font-size="8" font-family="monospace">SART</text><text x="368" y="90" fill="#6fa8dc" font-size="7" font-family="monospace">TEST OK</text>
<rect x="52" y="108" width="78" height="10" rx="3" fill="#03111c" stroke="#0d2a48" stroke-width=".8"/><text x="60" y="115" fill="#81f7b8" font-size="6" font-family="monospace">NAVTEX</text>
<rect x="138" y="108" width="92" height="10" rx="3" fill="#03111c" stroke="#0d2a48" stroke-width=".8"/><text x="146" y="115" fill="#81f7b8" font-size="6" font-family="monospace">INM-C / EGC</text>
<rect x="238" y="108" width="86" height="10" rx="3" fill="#03111c" stroke="#0d2a48" stroke-width=".8"/><text x="246" y="115" fill="#81f7b8" font-size="6" font-family="monospace">COSPAS LINK</text>
<rect x="332" y="108" width="94" height="10" rx="3" fill="#03111c" stroke="#0d2a48" stroke-width=".8"/><text x="340" y="115" fill="#81f7b8" font-size="6" font-family="monospace">PORTABLE VHF</text>`,

engine:`<rect width="480" height="145" fill="#040c10"/>
<rect x="60" y="33" width="100" height="82" rx="3" fill="#071828"/>
<rect x="60" y="33" width="100" height="8" rx="2" fill="#0d2840"/>
<rect x="68" y="18" width="12" height="16" rx="1" fill="#0a2030" class="epulse"/>
<rect x="84" y="18" width="12" height="16" rx="1" fill="#0a2030" class="epulse"/>
<rect x="100" y="18" width="12" height="16" rx="1" fill="#0a2030" class="epulse"/>
<rect x="116" y="18" width="12" height="16" rx="1" fill="#0a2030" class="epulse"/>
<rect x="132" y="18" width="12" height="16" rx="1" fill="#0a2030" class="epulse"/>
<rect x="220" y="26" width="200" height="92" rx="4" fill="#040e18"/>
<rect x="220" y="26" width="200" height="92" rx="4" fill="none" stroke="#0d2a40" stroke-width="1.5"/>
<rect x="228" y="34" width="184" height="50" rx="2" fill="#030a12"/>
<circle cx="250" cy="59" r="14" fill="#050f18"/><circle cx="250" cy="59" r="14" fill="none" stroke="#0d2840" stroke-width="1.5"/>
<line x1="250" y1="59" x2="250" y2="47" stroke="#5dbf8a" stroke-width="2" transform="rotate(20,250,59)"/>
<text x="242" y="78" fill="#5dbf8a" font-size="7" font-family="monospace">RPM</text>
<circle cx="292" cy="59" r="14" fill="#050f18"/><circle cx="292" cy="59" r="14" fill="none" stroke="#0d2840" stroke-width="1.5"/>
<line x1="292" y1="59" x2="292" y2="47" stroke="#d4a017" stroke-width="2" transform="rotate(-15,292,59)"/>
<text x="284" y="78" fill="#d4a017" font-size="7" font-family="monospace">TEMP</text>
<circle cx="334" cy="59" r="14" fill="#050f18"/><circle cx="334" cy="59" r="14" fill="none" stroke="#0d2840" stroke-width="1.5"/>
<line x1="334" y1="59" x2="334" y2="47" stroke="#6fa8dc" stroke-width="2" transform="rotate(5,334,59)"/>
<text x="327" y="78" fill="#6fa8dc" font-size="7" font-family="monospace">PRESS</text>
<circle cx="376" cy="59" r="14" fill="#050f18"/><circle cx="376" cy="59" r="14" fill="none" stroke="#0d2840" stroke-width="1.5"/>
<line x1="376" y1="59" x2="376" y2="47" stroke="#c97070" stroke-width="2" transform="rotate(30,376,59)"/>
<text x="369" y="78" fill="#c97070" font-size="7" font-family="monospace">EXH.T</text>
<circle cx="235" cy="100" r="4" fill="#5dbf8a"/>
<circle cx="248" cy="100" r="4" fill="#5dbf8a"/>
<circle cx="261" cy="100" r="4" fill="#d4a017" class="blink"/>
<circle cx="274" cy="100" r="4" fill="#5dbf8a"/>
<circle cx="287" cy="100" r="4" fill="#5dbf8a"/>
<text x="228" y="114" fill="#0d2840" font-size="7" font-family="monospace">ENG ROOM CONTROL</text>`,

engine_fault:`<rect width="480" height="145" fill="#0a0505"/>
<rect x="60" y="33" width="100" height="82" rx="3" fill="#150505"/>
<rect x="68" y="18" width="12" height="16" rx="1" fill="#1a0808"/>
<rect x="84" y="18" width="12" height="16" rx="1" fill="#1a0808"/>
<rect x="100" y="18" width="12" height="16" rx="1" fill="#1a0808"/>
<circle cx="90" cy="26" r="3" fill="#c93010" class="alarm"/>
<rect x="220" y="26" width="200" height="92" rx="4" fill="#0a0505"/>
<rect x="220" y="26" width="200" height="92" rx="4" fill="none" stroke="#3a1010" stroke-width="1.5"/>
<rect x="228" y="34" width="184" height="50" rx="2" fill="#080202"/>
<circle cx="250" cy="59" r="14" fill="#0a0505"/><circle cx="250" cy="59" r="14" fill="none" stroke="#3a1010" stroke-width="1.5"/>
<line x1="250" y1="59" x2="250" y2="47" stroke="#c97070" stroke-width="2" transform="rotate(-45,250,59)"/>
<text x="242" y="78" fill="#c97070" font-size="7" font-family="monospace">ALARM</text>
<circle cx="292" cy="59" r="14" fill="#0a0505"/><circle cx="292" cy="59" r="14" fill="none" stroke="#c93010" stroke-width="2" class="alarm"/>
<line x1="292" y1="59" x2="292" y2="47" stroke="#c93010" stroke-width="2" transform="rotate(55,292,59)"/>
<text x="280" y="78" fill="#c93010" font-size="7" font-family="monospace">OVERHEAT</text>
<circle cx="334" cy="59" r="14" fill="#0a0505"/><circle cx="334" cy="59" r="14" fill="none" stroke="#3a1010" stroke-width="1.5"/>
<line x1="334" y1="59" x2="334" y2="47" stroke="#c97070" stroke-width="2" transform="rotate(-30,334,59)"/>
<text x="327" y="78" fill="#c97070" font-size="7" font-family="monospace">LOW</text>
<circle cx="235" cy="100" r="4" fill="#c93010" class="alarm"/>
<circle cx="248" cy="100" r="4" fill="#c93010" class="alarm"/>
<circle cx="261" cy="100" r="4" fill="#c93010" class="alarm"/>
<circle cx="274" cy="100" r="4" fill="#3a1010"/>
<circle cx="287" cy="100" r="4" fill="#3a1010"/>
<text x="228" y="115" fill="#c93010" font-size="7" font-family="monospace" class="blink">!!! ENGINE FAULT !!!</text>
<ellipse cx="90" cy="14" rx="8" ry="5" fill="#c93010" opacity=".2" class="smoke"/>
<ellipse cx="90" cy="10" rx="6" ry="4" fill="#a02010" opacity=".15" class="smoke2"/>`,

pirate:`<rect width="480" height="145" fill="#030810"/>
<rect width="480" height="63" fill="#040b18"/>
<rect y="63" width="480" height="82" fill="#04111e"/>
<g class="wave-anim">
<path d="M0 73 Q30 67 60 73 Q90 79 120 73 Q150 67 180 73 Q210 79 240 73 Q270 67 300 73 Q330 79 360 73 Q390 67 420 73 Q450 79 480 73" fill="none" stroke="#0a2438" stroke-width="1.2" opacity=".6"/>
<path d="M0 90 Q40 84 80 90 Q120 96 160 90 Q200 84 240 90 Q280 96 320 90 Q360 84 400 90 Q440 96 480 90" fill="none" stroke="#081e30" stroke-width="1" opacity=".5"/>
</g>
<rect x="140" y="48" width="130" height="18" rx="3" fill="#0d2040"/>
<rect x="200" y="36" width="32" height="14" rx="2" fill="#0a1830"/>
<line x1="216" y1="26" x2="216" y2="36" stroke="#0a1828" stroke-width="1.5"/>
<circle cx="80" cy="19" r="1" fill="#fff" opacity=".6"/>
<circle cx="300" cy="7" r="1" fill="#fff" opacity=".5"/>
<circle cx="420" cy="17" r="1" fill="#fff" opacity=".6"/>
<g class="speedboat"><rect x="30" y="60" width="55" height="8" rx="3" fill="#1a0808"/><rect x="50" y="54" width="20" height="8" rx="1" fill="#110505"/><text x="50" y="53" fill="#c93010" font-size="9" opacity=".8">☠</text></g>
<g class="speedboat" style="animation-delay:.8s"><rect x="30" y="74" width="48" height="7" rx="3" fill="#1a0808"/><rect x="46" y="68" width="18" height="7" rx="1" fill="#110505"/><text x="46" y="66" fill="#c93010" font-size="8" opacity=".7">☠</text></g>
<line x1="420" y1="60" x2="420" y2="10" stroke="#d4a017" stroke-width="2" opacity=".2" class="searchlight" style="transform-origin:420px 60px"/>
<text x="145" y="116" fill="#c93010" font-size="8" font-family="monospace" class="blink">TÜYSÜZ TEHDİT — SAHİL GÜVENLIK ARANIYOR</text>
<rect x="10" y="90" width="88" height="46" rx="2" fill="#040e18"/>
<rect x="10" y="90" width="88" height="46" rx="2" fill="none" stroke="#0d2030" stroke-width="1"/>
<text x="15" y="102" fill="#c93010" font-size="7" font-family="monospace">VHF CH16</text>
<text x="15" y="112" fill="#5dbf8a" font-size="7" font-family="monospace">MAYDAY x3</text>
<text x="15" y="122" fill="#d4a017" font-size="7" font-family="monospace">SAR: ETD 2H</text>
<text x="15" y="132" fill="#6fa8dc" font-size="7" font-family="monospace">SPEED: FULL</text>`,

bogaz:`<rect width="480" height="145" fill="#04111f"/>
<rect width="480" height="68" fill="#060f1e"/>
<rect y="68" width="480" height="77" fill="#061828"/>
<path d="M0 68 Q60 53 120 68 Q180 83 240 68 Q300 53 360 68 Q420 83 480 68" fill="none" stroke="#0d3060" stroke-width="1.2" opacity=".6"/>
<path d="M0 82 Q50 76 100 82 Q150 88 200 82 Q250 76 300 82 Q350 88 400 82 Q440 88 480 82" fill="none" stroke="#0a2440" stroke-width="1" opacity=".5"/>
<path d="M0 68 Q20 38 0 0" fill="#030d1a" stroke="#1a3a5f" stroke-width="2"/>
<path d="M480 68 Q460 38 480 0" fill="#030d1a" stroke="#1a3a5f" stroke-width="2"/>
<rect x="10" y="18" width="40" height="50" fill="#040d1a"/>
<rect x="60" y="28" width="30" height="40" fill="#040d1a"/>
<rect x="100" y="13" width="20" height="55" fill="#040d1a"/>
<rect x="390" y="23" width="35" height="45" fill="#040d1a"/>
<rect x="428" y="8" width="25" height="60" fill="#040d1a"/>
<circle cx="50" cy="16" r="3" fill="#d4a017" opacity=".7" class="blink"/>
<circle cx="110" cy="10" r="3" fill="#c93030" opacity=".7"/>
<circle cx="395" cy="20" r="3" fill="#d4a017" opacity=".7" class="blink"/>
<g class="drift" style="transform-origin:240px 66px">
<path d="M174 60 L286 60 L304 67 L316 67 L316 72 L164 72 L164 66 Z" fill="#0b1522"/>
<path d="M182 54 L286 54 L299 60 L182 60 Z" fill="#183451"/>
<rect x="236" y="39" width="24" height="15" rx="2" fill="#d9e3ea"/>
<rect x="252" y="30" width="10" height="10" rx="1" fill="#173454"/>
<line x1="257" y1="22" x2="257" y2="30" stroke="#607d99" stroke-width="1.2"/>
</g>
<g class="current"><text x="20" y="106" fill="#1a4a7f" font-size="14" opacity=".3">→→→→→→→→→→→→→→→→→→→→→→→→→→→→</text></g>
<text x="150" y="128" fill="#d4a017" font-size="8" font-family="monospace" class="blink">⚓ DEMİR ATILDI — BOĞAZ AKINTISI</text>
<rect x="355" y="82" width="116" height="54" rx="3" fill="#040d18"/>
<rect x="355" y="82" width="116" height="54" rx="3" fill="none" stroke="#0d2030" stroke-width="1"/>
<text x="363" y="95" fill="#c93010" font-size="7" font-family="monospace">⚠ SÜRÜKLENME</text>
<text x="363" y="106" fill="#d4a017" font-size="7" font-family="monospace">COG: 087° ⚡</text>
<text x="363" y="117" fill="#c97070" font-size="7" font-family="monospace">SOG: 0.8 kn</text>
<text x="363" y="128" fill="#5dbf8a" font-size="7" font-family="monospace">DEMİR: DÜŞÜK</text>`,

fire:`<rect width="480" height="145" fill="#040c10"/>
<line x1="0" y1="38" x2="480" y2="38" stroke="#0a1820" stroke-width="3"/>
<line x1="0" y1="98" x2="480" y2="98" stroke="#0a1820" stroke-width="3"/>
<rect x="40" y="0" width="8" height="145" fill="#081420"/>
<rect x="200" y="0" width="8" height="145" fill="#081420"/>
<rect x="380" y="0" width="8" height="145" fill="#081420"/>
<ellipse cx="240" cy="88" rx="35" ry="14" fill="#c93010" opacity=".3"/>
<ellipse cx="240" cy="80" rx="25" ry="11" fill="#d84010" opacity=".4"/>
<ellipse cx="240" cy="70" rx="18" ry="9" fill="#e06020" opacity=".5"/>
<path d="M225 93 Q230 70 240 53 Q245 70 255 56 Q255 76 265 93 Z" fill="#d84010" opacity=".6"/>
<path d="M230 93 Q235 72 242 58 Q248 72 258 93 Z" fill="#e86820" opacity=".5"/>
<path d="M232 93 Q238 74 243 63 Q247 74 252 93 Z" fill="#f09030" opacity=".4"/>
<ellipse cx="240" cy="43" rx="20" ry="11" fill="#0a1010" opacity=".7" class="smoke"/>
<ellipse cx="232" cy="28" rx="16" ry="9" fill="#080e0e" opacity=".6" class="smoke2"/>
<ellipse cx="238" cy="14" rx="14" ry="7" fill="#060c0c" opacity=".5" class="smoke3"/>
<rect x="80" y="66" width="20" height="42" rx="4" fill="#c93010" opacity=".8"/>
<rect x="83" y="60" width="14" height="8" rx="2" fill="#a02010"/>
<polygon points="360,48 340,86 380,86" fill="#d4a017" opacity=".8"/>
<text x="352" y="78" fill="#030810" font-size="14" font-weight="bold">!</text>
<circle cx="420" cy="27" r="10" fill="#c93010" opacity=".6" class="alarm"/>
<text x="20" y="128" fill="#c93010" font-size="8" font-family="monospace" class="blink">YANGIN ALARM — A GÜVERTESİ</text>`,

galley:`<rect width="480" height="145" fill="#050d0a"/>
<rect x="0" y="92" width="480" height="53" fill="#061410"/>
<rect x="0" y="90" width="480" height="4" fill="#0a1e18"/>
<rect x="30" y="70" width="120" height="26" rx="3" fill="#040d08"/>
<rect x="30" y="70" width="120" height="26" rx="3" fill="none" stroke="#0d2018" stroke-width="1.5"/>
<circle cx="60" cy="81" r="10" fill="#050f0a"/><circle cx="60" cy="81" r="10" fill="none" stroke="#0d2018" stroke-width="1"/>
<circle cx="100" cy="81" r="10" fill="#050f0a"/><circle cx="100" cy="81" r="10" fill="none" stroke="#0d2018" stroke-width="1"/>
<circle cx="100" cy="81" r="6" fill="#c9952a" opacity=".4"/>
<circle cx="140" cy="81" r="10" fill="#050f0a"/><circle cx="140" cy="81" r="10" fill="none" stroke="#0d2018" stroke-width="1"/>
<ellipse cx="100" cy="67" rx="18" ry="5" fill="#070f0c"/>
<rect x="82" y="61" width="36" height="7" rx="2" fill="#061210"/>
<path d="M96 61 Q100 55 104 61" fill="none" stroke="#0d2018" stroke-width="1.5"/>
<path d="M94 57 Q92 47 96 39" fill="none" stroke="#2a4a38" stroke-width="1" opacity=".4" class="smoke"/>
<path d="M100 55 Q98 45 102 37" fill="none" stroke="#2a4a38" stroke-width="1" opacity=".3" class="smoke2"/>
<rect x="190" y="18" width="250" height="5" rx="1" fill="#0a1e18"/>
<rect x="190" y="54" width="250" height="4" rx="1" fill="#0a1e18"/>
<rect x="320" y="8" width="130" height="68" rx="3" fill="#040e0a"/>
<rect x="320" y="8" width="130" height="68" rx="3" fill="none" stroke="#0d2018" stroke-width="1.5"/>
<text x="330" y="22" fill="#5dbf8a" font-size="8" font-family="monospace">BUGÜNKÜ MENÜ</text>
<text x="330" y="36" fill="#2e6bbf" font-size="7" font-family="monospace">Öğle: Levrek buğulama</text>
<text x="330" y="47" fill="#2e6bbf" font-size="7" font-family="monospace">Çorba: Mercimek</text>
<text x="330" y="57" fill="#2e6bbf" font-size="7" font-family="monospace">Tatlı: Sütlaç</text>
<text x="330" y="68" fill="#d4a017" font-size="6" font-family="monospace">Mür. sayısı: 22</text>`,

cabin:`<rect width="480" height="145" fill="#03090f"/>
<circle cx="390" cy="58" r="40" fill="#03090f"/>
<circle cx="390" cy="58" r="40" fill="none" stroke="#0d2a3a" stroke-width="6"/>
<circle cx="390" cy="58" r="34" fill="#030d1a"/>
<path d="M357 70 Q374 62 391 70 Q408 78 425 70" fill="none" stroke="#0d3060" stroke-width="1.5" opacity=".7"/>
<path d="M357 78 Q374 70 391 78 Q408 86 425 78" fill="none" stroke="#0a2440" stroke-width="1" opacity=".5"/>
<circle cx="400" cy="38" r="1" fill="#fff" opacity=".6"/>
<circle cx="376" cy="32" r="1" fill="#fff" opacity=".5"/>
<circle cx="390" cy="18" r="3" fill="#0d2a3a"/>
<circle cx="390" cy="98" r="3" fill="#0d2a3a"/>
<circle cx="350" cy="58" r="3" fill="#0d2a3a"/>
<circle cx="430" cy="58" r="3" fill="#0d2a3a"/>
<rect x="20" y="80" width="300" height="48" rx="2" fill="#050e18"/>
<rect x="20" y="78" width="300" height="5" rx="1" fill="#0a1e30"/>
<rect x="30" y="58" width="65" height="44" rx="2" fill="#06152a"/>
<rect x="30" y="58" width="65" height="44" rx="2" fill="none" stroke="#0d2840" stroke-width="1"/>
<text x="36" y="72" fill="#2e6bbf" font-size="7" font-family="monospace">NÖBET GÜNLÜĞÜ</text>
<line x1="35" y1="77" x2="88" y2="77" stroke="#0d2040" stroke-width=".8"/>
<text x="36" y="86" fill="#1a3a5f" font-size="6" font-family="monospace">02:14 — HEDEF</text>
<text x="36" y="95" fill="#1a3a5f" font-size="6" font-family="monospace">CPA: 1.2 nm ✓</text>
<circle cx="308" cy="53" r="18" fill="#040e18"/>
<circle cx="308" cy="53" r="18" fill="none" stroke="#0d2840" stroke-width="1.5"/>
<line x1="308" y1="36" x2="308" y2="45" stroke="#2e6bbf" stroke-width="2"/>
<line x1="308" y1="53" x2="318" y2="53" stroke="#6fa8dc" stroke-width="1.5"/>
<circle cx="308" cy="53" r="2" fill="#2e6bbf"/>
<text x="300" y="73" fill="#0d2840" font-size="6" font-family="monospace">02:14</text>`,

bridge:`<rect width="480" height="145" fill="#030a14"/>
<rect x="15" y="8" width="450" height="64" rx="3" fill="#040e1a"/>
<rect x="15" y="8" width="450" height="64" rx="3" fill="none" stroke="#0d2030" stroke-width="1.5"/>
<line x1="105" y1="8" x2="105" y2="72" stroke="#0d2030" stroke-width="2"/>
<line x1="195" y1="8" x2="195" y2="72" stroke="#0d2030" stroke-width="2"/>
<line x1="285" y1="8" x2="285" y2="72" stroke="#0d2030" stroke-width="2"/>
<line x1="375" y1="8" x2="375" y2="72" stroke="#0d2030" stroke-width="2"/>
<rect x="16" y="9" width="88" height="62" fill="#040d18"/>
<path d="M16 48 Q30 42 44 48 Q58 54 72 48 Q86 42 104 48" fill="none" stroke="#0a2840" stroke-width="1" opacity=".5"/>
<rect x="106" y="9" width="88" height="62" fill="#040d18"/>
<rect x="196" y="9" width="88" height="62" fill="#040d18"/>
<ellipse cx="240" cy="50" rx="35" ry="8" fill="#1a4a7f" opacity=".15"/>
<rect x="286" y="9" width="88" height="62" fill="#040d18"/>
<rect x="376" y="9" width="88" height="62" fill="#040d18"/>
<path d="M194 51 L270 51 L284 56 L294 56 L294 59 L186 59 L186 55 Z" fill="#07111d"/>
<path d="M200 46 L270 46 L279 51 L200 51 Z" fill="#16314d"/>
<rect x="232" y="33" width="20" height="13" rx="2" fill="#d9e3ea"/>
<rect x="246" y="24" width="9" height="10" rx="1" fill="#173454"/>
<line x1="250" y1="17" x2="250" y2="24" stroke="#607d99" stroke-width="1"/>
<rect x="80" y="87" width="320" height="48" rx="4" fill="#040e18"/>
<rect x="80" y="87" width="320" height="48" rx="4" fill="none" stroke="#0d2030" stroke-width="1.5"/>
<circle cx="240" cy="108" r="18" fill="#030a12"/>
<circle cx="240" cy="108" r="18" fill="none" stroke="#0d2030" stroke-width="2"/>
<line x1="240" y1="90" x2="240" y2="126" stroke="#0d2030" stroke-width="1.5"/>
<line x1="220" y1="100" x2="260" y2="116" stroke="#0d2030" stroke-width="1.5"/>
<line x1="220" y1="116" x2="260" y2="100" stroke="#0d2030" stroke-width="1.5"/>
<circle cx="240" cy="108" r="4" fill="#0d2030"/>
<rect x="308" y="94" width="80" height="32" rx="2" fill="#030a12"/>
<text x="316" y="106" fill="#5dbf8a" font-size="6" font-family="monospace">AUTO PILOT</text>
<text x="316" y="116" fill="#5dbf8a" font-size="7" font-family="monospace" font-weight="bold">HDG 247°</text>
<circle cx="372" cy="118" r="5" fill="#5dbf8a" opacity=".8"/>`,

cargo:`<rect width="480" height="145" fill="#040c14"/>
<rect x="20" y="8" width="440" height="128" rx="4" fill="#050e18"/>
<rect x="20" y="8" width="440" height="128" rx="4" fill="none" stroke="#0d2030" stroke-width="1.5"/>
<rect x="28" y="76" width="46" height="21" rx="2" fill="#1a3a6b" opacity=".85"/>
<rect x="76" y="76" width="46" height="21" rx="2" fill="#2a5a30" opacity=".85"/>
<rect x="124" y="76" width="46" height="21" rx="2" fill="#5a1a1a" opacity=".85"/>
<rect x="172" y="76" width="46" height="21" rx="2" fill="#1a4a4a" opacity=".85"/>
<rect x="220" y="76" width="46" height="21" rx="2" fill="#3a2a4a" opacity=".85"/>
<rect x="268" y="76" width="46" height="21" rx="2" fill="#2a5a30" opacity=".85"/>
<rect x="316" y="76" width="46" height="21" rx="2" fill="#1a3a6b" opacity=".85"/>
<rect x="28" y="54" width="46" height="21" rx="2" fill="#2a5a30" opacity=".85"/>
<rect x="76" y="54" width="46" height="21" rx="2" fill="#5a1a1a" opacity=".85"/>
<rect x="124" y="54" width="46" height="21" rx="2" fill="#1a3a6b" opacity=".85"/>
<rect x="172" y="54" width="46" height="21" rx="2" fill="#2a5a30" opacity=".85"/>
<rect x="220" y="54" width="46" height="21" rx="2" fill="#5a1a1a" opacity=".85"/>
<rect x="268" y="54" width="46" height="21" rx="2" fill="#3a2a4a" opacity=".85"/>
<rect x="28" y="32" width="46" height="21" rx="2" fill="#5a1a1a" opacity=".85"/>
<rect x="76" y="32" width="46" height="21" rx="2" fill="#1a3a6b" opacity=".85"/>
<rect x="124" y="32" width="46" height="21" rx="2" fill="#2a5a30" opacity=".85"/>
<rect x="15" y="4" width="450" height="6" rx="2" fill="#0a1828"/>
<rect x="193" y="2" width="20" height="12" rx="2" fill="#0d2040" class="cargo-swing"/>
<line x1="203" y1="14" x2="203" y2="44" stroke="#1a3060" stroke-width="1.5" stroke-dasharray="3,2" class="cargo-swing"/>
<rect x="388" y="12" width="58" height="74" rx="3" fill="#08182a"/>
<text x="394" y="24" fill="#2e6bbf" font-size="7" font-family="monospace">MANIFEST</text>
<text x="394" y="36" fill="#5dbf8a" font-size="6" font-family="monospace">✓ TCKU 1234</text>
<text x="394" y="47" fill="#5dbf8a" font-size="6" font-family="monospace">✓ MSCU 5678</text>
<text x="394" y="58" fill="#c97070" font-size="6" font-family="monospace">✗ HLXU 9012</text>
<text x="394" y="69" fill="#5dbf8a" font-size="6" font-family="monospace">✓ GESU 3456</text>
<text x="394" y="80" fill="#d4a017" font-size="6" font-family="monospace">? CMAU 7890</text>`,

port_arrival:`<rect width="480" height="145" fill="#04111f"/>
<rect width="480" height="70" fill="#040f1e"/>
<ellipse cx="240" cy="72" rx="200" ry="28" fill="#c9952a" opacity=".12"/>
<circle cx="240" cy="68" r="12" fill="#c9952a" opacity=".7"/>
<circle cx="240" cy="68" r="20" fill="none" stroke="#c9952a" stroke-width="1" opacity=".3"/>
<rect x="20" y="36" width="15" height="34" fill="#040c18"/>
<rect x="38" y="46" width="20" height="24" fill="#040c18"/>
<rect x="62" y="28" width="12" height="42" fill="#040c18"/>
<rect x="77" y="40" width="18" height="30" fill="#040c18"/>
<rect x="98" y="33" width="22" height="37" fill="#040c18"/>
<rect x="378" y="18" width="12" height="52" rx="2" fill="#0a1e30"/>
<polygon points="372,18 390,18 384,6" fill="#0a1e30"/>
<circle cx="384" cy="12" r="5" fill="#d4a017" opacity=".8" class="blink"/>
<rect y="70" width="480" height="75" fill="#061828"/>
<g class="wave-anim">
<path d="M0 80 Q60 76 120 80 Q180 84 240 80 Q300 76 360 80 Q420 84 480 80" fill="none" stroke="#0d3060" stroke-width="1.2" opacity=".5"/>
<path d="M0 96 Q70 92 140 96 Q210 100 280 96 Q350 92 420 96 Q450 100 480 96" fill="none" stroke="#0a2448" stroke-width="1" opacity=".4"/>
</g>
<rect x="170" y="62" width="126" height="6" rx="3" fill="#0b2239" opacity=".55"/>
<rect x="210" y="54" width="42" height="8" rx="2" fill="#0a1c2f" opacity=".5"/>
<line x1="418" y1="70" x2="418" y2="18" stroke="#0a1828" stroke-width="3"/>
<line x1="393" y1="23" x2="448" y2="23" stroke="#0a1828" stroke-width="2"/>
<line x1="433" y1="23" x2="433" y2="53" stroke="#0a1828" stroke-width="1" stroke-dasharray="3,2"/>`,

sunrise:`<rect width="480" height="145" fill="#040e1c"/>
<rect y="53" width="480" height="92" fill="#061828"/>
<ellipse cx="240" cy="73" rx="220" ry="38" fill="#c9401a" opacity=".15"/>
<ellipse cx="240" cy="73" rx="160" ry="23" fill="#c9601a" opacity=".12"/>
<ellipse cx="240" cy="73" rx="100" ry="13" fill="#c9802a" opacity=".12"/>
<path d="M200 73 A40 40 0 0 1 280 73" fill="#c9952a" opacity=".8"/>
<circle cx="240" cy="73" r="40" fill="none" stroke="#c9952a" stroke-width="1" opacity=".2"/>
<line x1="0" y1="73" x2="480" y2="73" stroke="#c9501a" stroke-width="1" opacity=".3"/>
<rect y="73" width="480" height="72" fill="#04111e"/>
<ellipse cx="240" cy="102" rx="25" ry="4" fill="#c9952a" opacity=".2"/>
<g class="wave-anim">
<path d="M0 83 Q60 79 120 83 Q180 87 240 83 Q300 79 360 83 Q420 87 480 83" fill="none" stroke="#0d3060" stroke-width="1" opacity=".5"/>
<path d="M0 98 Q70 94 140 98 Q210 102 280 98 Q350 94 420 98 Q455 102 480 98" fill="none" stroke="#0a2440" stroke-width="1" opacity=".4"/>
</g>
<path d="M14 73 Q70 69 134 75" fill="none" stroke="#1b456d" stroke-width="1" opacity=".2"/>
<path d="M22 80 Q78 77 142 82" fill="none" stroke="#143555" stroke-width=".9" opacity=".16"/>`,

meteo_panel:`<rect width="480" height="145" fill="#07111c"/>
<rect width="480" height="92" fill="#7ca9d4"/>
<rect y="92" width="480" height="53" fill="#5d7c56"/>
<rect y="108" width="480" height="37" fill="#44624a"/>
<path d="M0 101 Q54 96 108 101 Q162 106 216 101 Q270 96 324 101 Q378 106 432 101 Q456 98 480 101" fill="none" stroke="#c9d9e6" stroke-width="1" opacity=".18"/>
<ellipse cx="88" cy="46" rx="28" ry="13" fill="#f4f7fb"/>
<ellipse cx="70" cy="48" rx="15" ry="10" fill="#edf3f8"/>
<ellipse cx="103" cy="49" rx="18" ry="11" fill="#edf3f8"/>
<path d="M182 34 Q194 26 206 34 Q218 42 230 34 Q242 26 254 34" fill="none" stroke="#f7fbff" stroke-width="3.2" stroke-linecap="round"/>
<path d="M174 42 Q188 32 202 40 Q214 47 228 38 Q240 31 256 40" fill="none" stroke="#f7fbff" stroke-width="2.4" stroke-linecap="round" opacity=".88"/>
<ellipse cx="332" cy="57" rx="52" ry="17" fill="#d9e1e8"/>
<ellipse cx="298" cy="60" rx="30" ry="12" fill="#d3dce4"/>
<ellipse cx="362" cy="60" rx="34" ry="12" fill="#d3dce4"/>
<path d="M308 72 v10 M330 72 v10 M352 72 v10" stroke="#7aa0c0" stroke-width="2" stroke-linecap="round"/>
<path d="M418 68 Q414 45 425 30 Q436 12 452 22 Q460 28 458 42 Q455 55 462 68 Z" fill="#e8edf4"/>
<ellipse cx="434" cy="66" rx="34" ry="11" fill="#dce4eb"/>
<ellipse cx="449" cy="60" rx="20" ry="10" fill="#dce4eb"/>
<path d="M416 84 l8 -14 l-5 0 l10 -17 l-2 11 l6 0 l-10 20 z" fill="#ffd44f" opacity=".86"/>
<text x="20" y="18" fill="#eef6ff" font-size="8" font-family="monospace">METEOROLOGY WATCH</text>
<text x="54" y="84" fill="#0d2741" font-size="7" font-family="monospace">CUMULUS</text>
<text x="176" y="84" fill="#0d2741" font-size="7" font-family="monospace">CIRRUS</text>
<text x="292" y="84" fill="#0d2741" font-size="7" font-family="monospace">NIMBOSTRATUS</text>
<text x="404" y="96" fill="#0d2741" font-size="7" font-family="monospace">CB</text>`,

dolphins:`<rect width="480" height="145" fill="#05111d"/>
<rect width="480" height="56" fill="#081c30"/>
<ellipse cx="240" cy="58" rx="180" ry="16" fill="#6fa8dc" opacity=".12"/>
<rect y="56" width="480" height="89" fill="#072038"/>
<g class="wave-anim">
<path d="M0 76 Q40 70 80 76 Q120 82 160 76 Q200 70 240 76 Q280 82 320 76 Q360 70 400 76 Q440 82 480 76" fill="none" stroke="#0d3a68" stroke-width="1.4" opacity=".65"/>
<path d="M0 96 Q55 90 110 96 Q165 102 220 96 Q275 90 330 96 Q385 102 440 96 Q460 94 480 96" fill="none" stroke="#0b2f58" stroke-width="1.1" opacity=".5"/>
</g>
<path d="M92 86 q10 -14 22 0 q-8 -2 -12 5 q-4 -3 -10 -5 Z" fill="#9bc9ef"/>
<path d="M120 92 q12 -16 26 0 q-10 -2 -14 6 q-5 -4 -12 -6 Z" fill="#8fbce4"/>
<path d="M160 82 q14 -18 30 0 q-11 -3 -16 6 q-6 -4 -14 -6 Z" fill="#a7d6ff"/>
<path d="M190 88 q12 -15 26 0 q-9 -2 -13 5 q-5 -3 -13 -5 Z" fill="#8fbce4"/>
<circle cx="106" cy="84" r="1.2" fill="#dff4ff"/>
<circle cx="172" cy="80" r="1.2" fill="#dff4ff"/>
<path d="M280 70 L390 70 L408 76 L424 76 L424 81 L272 81 L272 75 Z" fill="#08111d"/>
<path d="M288 64 L392 64 L404 70 L288 70 Z" fill="#16314c"/>
<rect x="336" y="48" width="28" height="16" rx="2" fill="#d9e3ea"/>
<rect x="356" y="36" width="14" height="12" rx="2" fill="#d9e3ea"/>
<line x1="363" y1="26" x2="363" y2="36" stroke="#607d99" stroke-width="1.1"/>
<circle cx="405" cy="73" r="1.8" fill="#d4a017"/>`,

whale:`<rect width="480" height="145" fill="#040f1a"/>
<rect width="480" height="58" fill="#08192c"/>
<circle cx="392" cy="18" r="12" fill="#c9952a" opacity=".7"/>
<rect y="58" width="480" height="87" fill="#061d34"/>
<g class="wave-anim">
<path d="M0 78 Q50 72 100 78 Q150 84 200 78 Q250 72 300 78 Q350 84 400 78 Q450 72 500 78" fill="none" stroke="#0d3660" stroke-width="1.4" opacity=".6"/>
<path d="M0 98 Q60 92 120 98 Q180 104 240 98 Q300 92 360 98 Q420 104 480 98" fill="none" stroke="#0b2b4d" stroke-width="1.1" opacity=".5"/>
</g>
<path d="M118 94 q42 -28 88 -6 q20 10 38 8 q-10 10 -31 12 q-22 3 -47 -1 q-25 -4 -48 -13 Z" fill="#314c63"/>
<path d="M244 96 l20 -12 l-6 18 Z" fill="#314c63"/>
<path d="M164 82 q10 -18 18 -1" fill="none" stroke="#9fd8ff" stroke-width="2" opacity=".7"/>
<circle cx="168" cy="91" r="1.4" fill="#dff4ff"/>
<path d="M294 74 L384 74 L396 80 L410 80 L410 84 L286 84 L286 79 Z" fill="#08111d"/>
<path d="M302 68 L386 68 L394 74 L302 74 Z" fill="#173451"/>
<rect x="340" y="55" width="22" height="13" rx="2" fill="#d9e3ea"/>
<rect x="354" y="44" width="12" height="11" rx="1" fill="#d9e3ea"/>
<circle cx="392" cy="77" r="1.7" fill="#d4a017"/>`,

shark:`<rect width="480" height="145" fill="#04101b"/>
<rect width="480" height="52" fill="#07192a"/>
<rect y="52" width="480" height="93" fill="#062038"/>
<ellipse cx="240" cy="66" rx="180" ry="12" fill="#7cc0f4" opacity=".08"/>
<g class="wave-anim">
<path d="M0 76 Q45 70 90 76 Q135 82 180 76 Q225 70 270 76 Q315 82 360 76 Q405 70 450 76 Q465 78 480 76" fill="none" stroke="#0d3866" stroke-width="1.4" opacity=".62"/>
<path d="M0 98 Q60 92 120 98 Q180 104 240 98 Q300 92 360 98 Q420 104 480 98" fill="none" stroke="#0a2c50" stroke-width="1.1" opacity=".48"/>
</g>
<path d="M154 100 q28 -36 58 0 q-18 -2 -26 8 q-10 -8 -32 -8 Z" fill="#29455d"/>
<path d="M142 108 q25 -14 64 -8 q-21 11 -31 12 q-13 1 -33 -4 Z" fill="#1f384d" opacity=".95"/>
<circle cx="180" cy="98" r="1.1" fill="#d7eefc" opacity=".75"/>
<path d="M288 70 L386 70 L404 76 L418 76 L418 80 L280 80 L280 75 Z" fill="#08111d"/>
<path d="M296 64 L388 64 L400 70 L296 70 Z" fill="#16314c"/>
<rect x="340" y="49" width="24" height="15" rx="2" fill="#d9e3ea"/>
<rect x="356" y="38" width="12" height="11" rx="1" fill="#d9e3ea"/>
<line x1="362" y1="29" x2="362" y2="38" stroke="#607d99" stroke-width="1.1"/>`,

ocean_postcard:`<rect width="480" height="145" fill="#05111c"/>
<linearGradient id="oceanGlow" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="#0d2742"/>
  <stop offset="58%" stop-color="#c87030"/>
  <stop offset="100%" stop-color="#04111d"/>
</linearGradient>
<rect width="480" height="145" fill="url(#oceanGlow)"/>
<rect y="74" width="480" height="71" fill="#061b31"/>
<ellipse cx="244" cy="74" rx="120" ry="20" fill="#d99b4b" opacity=".18"/>
<circle cx="240" cy="58" r="30" fill="#dca24f" opacity=".88"/>
<circle cx="240" cy="58" r="42" fill="none" stroke="#f2bb72" stroke-width="1" opacity=".28"/>
<g class="wave-anim">
<path d="M0 86 Q55 81 110 86 Q165 91 220 86 Q275 81 330 86 Q385 91 440 86 Q460 84 480 86" fill="none" stroke="#0e3967" stroke-width="1.2" opacity=".58"/>
<path d="M0 103 Q60 98 120 103 Q180 108 240 103 Q300 98 360 103 Q420 108 480 103" fill="none" stroke="#0a294c" stroke-width="1" opacity=".46"/>
</g>
<path d="M40 72 L140 72 L154 78 L168 78 L168 82 L34 82 L34 76 Z" fill="#08111d"/>
<path d="M50 66 L142 66 L150 72 L50 72 Z" fill="#173451"/>
<rect x="88" y="52" width="22" height="14" rx="2" fill="#d9e3ea"/>
<rect x="102" y="41" width="12" height="11" rx="1" fill="#d9e3ea"/>
<line x1="108" y1="31" x2="108" y2="41" stroke="#607d99" stroke-width="1.1"/>
<circle cx="145" cy="75" r="1.7" fill="#d4a017"/>`,
};

// ===== KRİZ SONLARI =====
const CRISIS_ENDS={
  cesaret_0:{emoji:"🫀",title:"Korku Seni Yendi",text:n=>`Cesaret puanı sıfıra düştü.\n\n${n} her kritik anda geri adım atmıştı. Fırtınada, krizlerde, zor anlarda hep çekilmişti.\n\nSon straw: Lostromo acil göreve çağırdı. ${n} yeniden çekildi.\n\n1. Zabiti: "Bu iş herkes için değil. Utanma — ama bu gemi için de değilsin."\n\nStaj belgesi "yetersiz" damgasıyla kapandı.`,stat:"CESARET 0 → Korku birikmesi — ihraç"},
  cesaret_100:{emoji:"💀",title:"Cesaret Seni Öldürdü",text:(n,sn)=>`${n} her tehlikeli işte ilk kalktı.\n\nFırtınada güverte kapatılmıştı. "Hemen hallederim" dedi.\n\nEmniyet halatı yetmedi. Dalga güverteyi süpürdü.\n\n${sn} anma plaketine bir isim daha kazındı.`,stat:"CESARET 100 → Kontrolsüz risk — ölüm"},
  bilgi_0:{emoji:"⚠️",title:"Bilgisizlik Gemiyi Tehlikeye Attı",text:n=>`Bilgi puanı sıfıra düştü.\n\n${n} not tutmamıştı. Prosedürleri bilmiyordu.\n\nGece nöbetinde radar alarmı çaldı. CPA: 0.4 mil.\n\nNe yapacağını bilmiyordu. Bekledi.\n\n800 tonluk kargo gemisi 60 metre önünden geçti.\n\nSüvari tutanağa yazdı:\n"Stajyer tehlikeli derecede yetersiz."\n\nStaj belgesi "yetersiz" ile kapandı.`,stat:"BİLGİ 0 → Bilgi bitti — ihraç"},
  bilgi_100:{emoji:"📚",title:"Kitap Adamı, Gemi Değil",text:n=>`${n} her soruya cevap verdi — teoride.\n\nAma halatı hiç tutmadı. Liman yaklaşmasında paralize oldu.\n\nRapor: "Akademik zeka yüksek. Operasyonel yetkinlik sıfır."`,stat:"BİLGİ 100 → Teori-pratik uçurumu"},
  sayginlik_0:{emoji:"👁️",title:"Mürettebat Seni Terk Etti",text:n=>`Saygınlık puanı sıfıra düştü.\n\nKimse ${n}'ye bakmıyordu artık. Yemekhanede tek oturdu. Lostromo görev listesinden adını sildi. Tayfalar konuşmayı kesti.\n\nSüvari 20. günde çağırdı:\n"Gemide takım ruhu şart. Bu ekiple çalışamazsınız."\n\nLimana yanaşırken kimseler el sallamadı. Kimse üzülmedi.`,stat:"SAYGINLIK 0 → Güven bitti — ihraç"},
  sayginlik_100:{emoji:"👑",title:"Herkesin Favorisi — Ama Mahvoldu",text:n=>`Herkes ${n}'yi sevdi. Kimseye hayır diyemedi.\n\nGün 25'e DİNÇLİK 5'e düşmüştü. Son nöbette köprüde uyuyakaldı.\n\nSüvari: "Bu çocuğu çok sevdik — mahvettik de."`,stat:"SAYGINLIK 100 → Aşırı talep — tükenme"},
  dinclik_dusuk:{emoji:"⚰️",title:"Yorgunluk Seni Mahvetti",text:n=>`Dinçlik puanı sıfıra düştü.\n\n${n} dinlenmemişti. Her nöbeti almış, hiç hayır dememişti.\n\nUyku 3 saate düştü. Yemekler atlandı. Gözler yanıyordu.\n\nSon nöbet: Köprüde tek başına. Saat 02:14.\n\nGözler kapandı.\n\nGemi 11 mil saparak Yunan karasularına girdi.\n\nSahil güvenlik müdahale etti. Tutanak:\n"Yorgunluk kaynaklı nöbet ihmali — stajyer görevden uzaklaştırıldı."`,stat:"DİNÇLİK 0 → Tükenmişlik — kaza"},
};

function shuffleChoices(arr){
  return [...arr].sort(()=>Math.random()-0.5);
}

function buildCalcPrompt(answer, unit, formula, attempts=2, toleranceText=''){
  return {answer, unit, formula, attempts, toleranceText};
}

function createStabilityScenes(n,sn){
  const disp1=11000+Math.floor(Math.random()*5000);
  const gm1=1.4+Math.random()*0.8;
  const weight1=20+Math.floor(Math.random()*25);
  const dist1=6+Math.floor(Math.random()*5);
  const tanTheta=(weight1*dist1)/(disp1*gm1);
  const heelDeg=(Math.atan(tanTheta)*180/Math.PI);

  const weight2=80+Math.floor(Math.random()*80);
  const shift2=18+Math.floor(Math.random()*18);
  const mctc=70+Math.floor(Math.random()*40);
  const trimCm=(weight2*shift2)/mctc;

  const gm3=1.1+Math.random()*1.0;
  const fsc=450+Math.floor(Math.random()*450);
  const disp3=7000+Math.floor(Math.random()*5000);
  const correctedGM=gm3-(fsc/disp3);

  return [
    {id:"s100",gfx:"bridge",alert:false,day:"Gun 9",time:"13:20",loc:"Kaptan Kosku - Stability Booklet",sub:"Sancak tarafa yuk kaymasi hesabi",who:"suvari",
    text:`Suvari stability booklet'i acip cetveli sana cevirdi.

"${n}, bunu goz karariyla gecemeyiz. ${sn}'de sancak tarafa ${weight1} tonluk bir yuk parcasi ${dist1} metre kaydi. Deplasman ${disp1} ton, mevcut GM ${gm1.toFixed(2)} metre.

Formul basit: tan(theta) = heeling moment / (displacement x GM). Bana yaklasik yatma acisini soyle."`,
    calc:buildCalcPrompt(Number(heelDeg.toFixed(1)),'derece','tan(theta) = heeling moment / (displacement x GM)',2,'0.3 derece icinde'),
    choices:shuffleChoices([
      {text:`Yaklasik ${heelDeg.toFixed(1)} derece sancaga yatma beklerim`,tag:"kritik",effect:{bilgi:16,sayginlik:12,cesaret:4}},
      {text:`Yaklasik ${(heelDeg*2.2).toFixed(1)} derece`,tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
      {text:"Yuk kaydi var ama hesap gereksiz, gozle karar verelim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}
    ])},
    {id:"s101",gfx:"cargo",alert:false,day:"Gun 9",time:"15:10",loc:"Yuk Plani Masasi",sub:"Trim degisimi ve MCTC hesabi",who:"z1",
    text:`1. Zabiti cetveli itip seni sandalyeye cekti.

"Pruvaya dogru agirlik kaydiriyoruz. ${weight2} tonluk agirlik ${shift2} metre for'a alinacak. Geminin MCTC degeri ${mctc} ton-metre/santim.

Trim degisimi = trimming moment / MCTC. Bana kac santim trim degisimi bekledigini soyle; sonra kaptana birlikte cikalim."`,
    calc:buildCalcPrompt(Number(trimCm.toFixed(1)),'cm','trim degisimi = trimming moment / MCTC',2,'0.5 cm icinde'),
    choices:shuffleChoices([
      {text:`Yaklasik ${trimCm.toFixed(1)} cm trim degisimi olur`,tag:"kritik",effect:{bilgi:15,sayginlik:11}},
      {text:`Yaklasik ${(trimCm/2).toFixed(1)} cm olur`,tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
      {text:"Trim cetveline bakmadan operasyonu baslatalim",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}
    ])},
    {id:"s102",gfx:"bridge",alert:false,day:"Gun 9",time:"19:40",loc:"Kopruustu - Aksam Brifingi",sub:"Serbest yuzey etkisiyle GM duzeltmesi",who:"suvari",
    text:`Aksamustu suvari kahvesini bir kenara koydu.

"Son hesap bu. Baslangic GM ${gm3.toFixed(2)} metre. Slack tanklarin free surface correction toplami ${fsc} ton-metre. Deplasman ${disp3} ton.

Duzeltilmis GM = GM - FSC / displacement. Gercek GM'yi bul; sonra bu gemi gece vardiyasina rahat cikar mi konusalim."`,
    calc:buildCalcPrompt(Number(correctedGM.toFixed(2)),'m','duzeltilmis GM = GM - FSC / displacement',2,'0.05 m icinde'),
    choices:shuffleChoices([
      {text:`Duzeltilmis GM yaklasik ${correctedGM.toFixed(2)} metre`,tag:"kritik",effect:{bilgi:17,sayginlik:12,cesaret:3}},
      {text:`Duzeltilmis GM yaklasik ${(gm3+(fsc/disp3)).toFixed(2)} metre`,tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
      {text:"Free surface correction bu kadar fark yaratmaz, hesaplamayalim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}
    ])},
  ];
}

// ===== 60 SENARYO HAVUZU =====
function buildScenePool(n,sn,yr,stype,startPort=selectedStartPort,startScenario=selectedStartScenario){
  const era=ERA_TECH[yr]||ERA_TECH[2018];
  const st=STYPES.find(x=>x.key===stype)||STYPES[0];
  const shipSpec=getShipSpec(stype);
  const startSub=`${startScenario.subPrefix} - ${yr}`;

  // Sahneler: her biri bağımsız, next kullanılmayacak (rastgele sıra sistemi)
  // next:null → sistem sonrakini kendisi seçecek
  // next:'end' → oyun biter
  // alert:true → ACİL banner + ses efekti

  return [
// ---- GÜN 1 SAHNELERİ ----
{id:"s01",gfx:"harbor",alert:false,day:"Gun 1",time:startScenario.time,loc:startPort.dock,sub:startSub,who:"anlatici",
text:`${startPort.name}, ${yr} yili.\n\n${startScenario.intro}\n\nCantan sirtinda, staj belgelerin avucunda iskeleye geldin. Onunde ${sn} - ${shipSpec.tonLabel||st.ton} ${st.nm} gemisi.\n\n${startScenario.bridgeCall.replace('${n}',n)}`,
choices:[
{text:"Düzgünce selamlayıp kendini tanıt",tag:"akilli",effect:{sayginlik:5,bilgi:3}},
{text:"Heyecanla 'Evet!' deyip içeri gir",tag:"cesur",effect:{cesaret:5,sayginlik:-2}},
{text:"Sessizce başını salla, takip et",tag:"itaatkar",effect:{sayginlik:3}}]},

{id:"s02",gfx:"bridge",alert:false,day:"Gün 1",time:"06:10",loc:"Köprüüstü",sub:"1. Zabiti belgelerini inceliyor",who:"z1",
text:`"${n}. Tamam."\n\n1. Zabiti Ahmet Bey:\n\n"Burada üç kural var. Bir: Zamanında hazır ol. İki: Bilmediğini söyle — adam ölür. Üç: Lostromo ne derse yap.\n\n${era}"`,
choices:[
{text:"'Anlaşıldı efendim' — net ve sakin",tag:"itaatkar",effect:{sayginlik:6,bilgi:3}},
{text:"ISM ve STCW bilgini ortaya koy",tag:"cesur",effect:{bilgi:5,sayginlik:-5}},
{text:"Not defteri çıkarıp kuralları yaz",tag:"akilli",effect:{bilgi:8,sayginlik:5}}]},

{id:"s03",gfx:"harbor",alert:false,day:"Gün 1",time:"07:00",loc:"Ana Güverte — Pruva",sub:"Lostromo güverteyi tanıtıyor",who:"lostromo",
text:`Lostromo İbrahim Usta. Elleri nasırlı, gözleri keskin.\n\n"Gel ${n}." Pruvanın ucuna götürdü.\n\n"Şu halat — 52 mm çelik. Koptuğunda kırbaç gibi döner, kolu koparır. Yanlış bağlarsan ${sn} kayar.\n\nBu gemi konuşmaz. Önce dinleyeceksin."`,
choices:[
{text:"Dikkatle izle, sonra kendin dene",tag:"akilli",effect:{bilgi:12,sayginlik:8}},
{text:"'Okulda gördüm zaten' de",tag:"cesur",effect:{sayginlik:-8,cesaret:3}},
{text:"Her detayı not defterine yaz",tag:"akilli",effect:{bilgi:15,dinclik:-5}}]},

{id:"s04",gfx:"harbor",alert:false,day:"Gün 1",time:"08:00",loc:"Ana Güverte",sub:"Silici güverteyi temizliyor",who:"silici",
text:`Silici Ramazan Usta elinde fırça.\n\n"14 yıldır bu gemide siliciyim. Herkes beni görmez — ama güverte pis olunca herkes arar. Kaygan güverte, düşen tayfa demek."`,
choices:[
{text:"'Haklısınız usta, öğrenirim' de",tag:"itaatkar",effect:{sayginlik:5,bilgi:3}},
{text:"Sevinçle konuş, deneyimlerini sor",tag:"sosyal",effect:{sayginlik:7,bilgi:5}},
{text:"'Bu benim işim değil' diye düşün",tag:"korkak",effect:{sayginlik:-3}}]},

{id:"s05",gfx:"harbor",alert:false,day:"Gün 1",time:"09:30",loc:"Kıç Güverte",sub:"Palamar ekipmanı eğitimi",who:"lostromo",
text:`"Radyo kesilirse el işaretleri var. Dur, çek, bırak, yavaş — bunları bilmeden işin yok.\n\nŞimdi Hasan'a bak. Sen de ver aynı işareti."`,
choices:[
{text:"Dikkatle izle, işareti doğru tekrarla",tag:"akilli",effect:{bilgi:10,sayginlik:8}},
{text:"Hasan'a yürü, doğrudan sor",tag:"cesur",effect:{bilgi:8,sayginlik:7,cesaret:5}},
{text:"İzle ama katılma",tag:"korkak",effect:{cesaret:-5,sayginlik:-3}}]},

{id:"s06",gfx:"compass",alert:false,day:"Gün 1",time:"14:00",loc:"Köprüüstü",sub:"Navigasyon eğitimi",who:"z2",
text:yr<=1990
  ?`2. Zabiti:\n\n"${n}, ${yr}'de GPS yok. Sextant ile seyir yapıyoruz. Güneşi gözle, sextantı konumla."`
  :`2. Zabiti ECDIS'te:\n\n"${n}, elektronik harita, AIS, VDR — hepsi çalışıyor. Ama siber saldırı riski artıyor. ${era}"`,
choices:[
{text:yr<=1990?"Dikkatle öğren, gözlemi dene":"'GPS bozulunca kâğıt harita açarım' de",tag:"akilli",effect:{bilgi:14,sayginlik:10}},
{text:"'Bilmiyorum, öğretir misiniz?' de",tag:"itaatkar",effect:{bilgi:8,sayginlik:3}},
{text:yr<=1990?"'Radar kullanamaz mıyız?' de":"'Bu olmaz' de",tag:"korkak",effect:{sayginlik:-5,bilgi:-3}}]},

{id:"s07",gfx:"galley",alert:false,day:"Gün 1",time:"19:30",loc:"Yemekhane",sub:"İlk akşam yemeği",who:"asci",
text:`"Oturun!" Mehmet Usta tombul, bıyıklı ve neşeli.\n\n"Bu gece levrek buğulama. Denizde karnın tok olmazsa beyin çalışmaz."\n\nMusa sana baktı: "${n}, ilk gün nasıldı?"`,
choices:[
{text:"Gülerek anlat, Musa ile kaynaş",tag:"sosyal",effect:{sayginlik:10,dinclik:5}},
{text:"Kısa cevap ver, erken uyu",tag:"itaatkar",effect:{dinclik:12}},
{text:"Lostromo'ya dön, denizcilik hikayeleri sor",tag:"akilli",effect:{bilgi:8,sayginlik:7}}]},

{id:"s08",gfx:"cabin",alert:false,day:"Gün 1",time:"22:00",loc:"Stajyer Kabini",sub:`${yr} — ilk gece, gemi homurtusu`,who:"anlatici",
text:`Kabin küçük. Gemi homurdanıyor. Motor titreşimi ayaklarından geliyor.\n\nYarın 05:45'te güvertede hazır olman gerekiyor.\n\n${era}`,
choices:[
{text:"Hemen uyu — dinç olmak şart",tag:"itaatkar",effect:{dinclik:15}},
{text:"Not defterini aç, öğrendiklerini yaz",tag:"akilli",effect:{bilgi:8,dinclik:-5}},
{text:"Pencereden denize bak, düşün — geç uyu",tag:"sosyal",effect:{dinclik:-3}}]},

// ---- RUTIN GÜN SAHNELERİ ----
{id:"s09",gfx:"harbor",alert:false,day:"Gün 2",time:"05:45",loc:"Ana Güverte — Sabah Turu",sub:"Güverte sabah kontrol turu",who:"lostromo",
text:`"Her sabah aynı. Güverte kontrol edilir. Bağlantılar, halatlar, ekipman kapakları, ışıklar.\n\nBu gemide liste dışı iş yapılmaz."\n\nSana kontrol listesi uzattı: "Sancak tarafını sen kontrol edeceksin."`,
choices:[
{text:"Listeyi alıp dikkatle her maddeyi kontrol et",tag:"akilli",effect:{bilgi:10,sayginlik:8}},
{text:"Hızlıca bak, 'tamam' deyip geri gel",tag:"korkak",effect:{sayginlik:-5,bilgi:-3}},
{text:"Sorular sorarak kontrol et",tag:"akilli",effect:{bilgi:12,sayginlik:7,dinclik:-3}}]},

{id:"s10",gfx:"engine",alert:false,day:"Gün 2",time:"09:00",loc:"Makine Dairesi",sub:"Yağcı yağ kontrolleri yapıyor",who:"yagci",
text:`Yağcı Mehmet Ali elinde numune şişesi.\n\n"Bu ana makine yağı. Her 250 saatte bir alırız. Rengi, viskozitesi, metal parçacıkları — makine sağlığını söyler.\n\nYağlama olmadan motor 20 dakikada tutuşur."`,
choices:[
{text:"İlgiyle sor, numune analizi öğren",tag:"akilli",effect:{bilgi:10,sayginlik:5}},
{text:"'İlginç ama güverte bölümüm' de",tag:"itaatkar",effect:{sayginlik:2}},
{text:"Makine dairesini gezdirin de",tag:"sosyal",effect:{bilgi:8,sayginlik:8,dinclik:-3}}]},

{id:"s11",gfx:"engine",alert:false,day:"Gün 2",time:"10:30",loc:"Makine Kontrol Odası",sub:"2. Başmakinist sistem kontrolü",who:"bas2",
text:`2. Başmakinist Serdar Bey:\n\n"Jeneratör 1 yükte, jeneratör 2 beklemede. Bir jeneratör devre dışı kalırsa ne olur?"`,
choices:[
{text:"'Diğer devreye girer, yük dağılımı değişir' de",tag:"akilli",effect:{bilgi:12,sayginlik:8}},
{text:"'Bilmiyorum efendim' — dürüst ol",tag:"itaatkar",effect:{bilgi:5,sayginlik:3}},
{text:"'Güverte stajyeriyim' deyip çekilmeye çalış",tag:"korkak",effect:{sayginlik:-5}}]},

{id:"s12",gfx:"harbor",alert:false,day:"Gün 2",time:"14:00",loc:"Kıç Güverte",sub:"Liman çıkış prosedürü",who:"lostromo",
text:`"${n}, bugün palamar operasyonunu izleyeceksin. Sadece izle, dokunma."\n\nSüvari radyoyla: "Tüm istasyonlar, liman çıkış prosedürü başlıyor."\n\nRadyo: "Kıç! Hazır mısınız?"`,
choices:[
{text:"Lostromo'nun işaret vermesini bekle",tag:"itaatkar",effect:{sayginlik:5,bilgi:5}},
{text:"Lostromo onay verince 'Kıç hazır!' de",tag:"cesur",effect:{cesaret:8,sayginlik:5,bilgi:5}},
{text:"Her detayı kaydet",tag:"akilli",effect:{bilgi:10,sayginlik:3}}]},

{id:"s13",gfx:"sea",alert:false,day:"Gün 2",time:"16:00",loc:"Açık Deniz",sub:startPort.departureLine,who:"hasan",
text:`Gemi açık denize çıktı. Tayfa Hasan yanına geldi:\n\n"${n}, deniz tutması var mı? ${sn} gibi ${st.nm} gemisi limanda ağır görünür ama dalgaya farklı davranır."`,
choices:[
{text:"'Yok, deneme seferinde geçtim' de",tag:"akilli",effect:{sayginlik:5,bilgi:3}},
{text:"'Biraz var, ilaç aldım' — dürüst",tag:"itaatkar",effect:{sayginlik:5,dinclik:-3}},
{text:"'Yok' de ama içinde fırtına",tag:"korkak",effect:{dinclik:-8,sayginlik:-3}}]},

{id:"s14",gfx:"engine",alert:false,day:"Gün 3",time:"09:00",loc:"Makine Dairesi",sub:"Çarkçıbaşı ile teknik ders",who:"carkci",
text:`Çarkçıbaşı Fikret Bey:\n\n"${n}. Gel, bir saat ver."\n\n45 derece sıcak. Dev motorlar.\n\n"Şu ana makineler dursa ${sn}'de hiçbir şey çalışmaz. Hangisi aktif, hangisi yedek?"`,
choices:[
{text:"Paneli incele, doğru makineyi işaret et",tag:"akilli",effect:{bilgi:12,sayginlik:8}},
{text:"'Bilmiyorum ama öğrenmek istiyorum' de",tag:"itaatkar",effect:{bilgi:8,sayginlik:5}},
{text:"Konuyu değiştir",tag:"korkak",effect:{sayginlik:-5,bilgi:-3}}]},

{id:"s15",gfx:"cargo",alert:false,day:"Gün 3",time:"14:00",loc:"Ambar — Yük Sahası",sub:"Manifesto denetimi",who:"z1",
text:`"${n}, şu listede yükler var. Manifesto ile fiili yükü karşılaştır. Hata varsa bildir."\n\nSoğuk, karanlık ambar. İki ayrı kalemde eksik buldun.`,
choices:[
{text:"İkisini de hemen bildir",tag:"akilli",effect:{bilgi:15,sayginlik:12,cesaret:5}},
{text:"Üçer kez daha say, eminleş, bildir",tag:"itaatkar",effect:{bilgi:10,sayginlik:8,dinclik:-5}},
{text:"Geçiştir, liman halleder",tag:"korkak",effect:{sayginlik:-15,bilgi:-5}}]},

{id:"s16",gfx:"bridge",alert:false,day:"Gün 3",time:"19:00",loc:"Toplanma İstasyonu",sub:"SOLAS güvenlik eğitimi",who:"z3",
text:`3. Zabiti Kemal Bey:\n\n"${n}, SOLAS tatbikatı. Yangın alarmı çalınca ilk üç dakika kritik. Toplanma istasyonunuz nerede?"`,
choices:[
{text:"Muster listeni okuduysan doğru yeri söyle",tag:"akilli",effect:{bilgi:12,sayginlik:10}},
{text:"'Hatırlamıyorum, gösterir misiniz?' de",tag:"itaatkar",effect:{bilgi:5,sayginlik:-3}},
{text:"Yanlış yer söyle",tag:"korkak",effect:{sayginlik:-15,bilgi:-5}}]},

{id:"s17",gfx:"galley",alert:false,day:"Gün 3",time:"20:00",loc:"Yemekhane",sub:"Üçüncü akşam",who:"lostromo",
text:`Lostromo başköşeye kuruldu:\n\n"${n}, üç gündür izliyorum. Güvertede en çok neyi anlamadın?"`,
choices:[
{text:"Dürüstçe anlat",tag:"akilli",effect:{bilgi:8,sayginlik:10}},
{text:"'Her şeyi anladım' de",tag:"cesur",effect:{cesaret:3,sayginlik:-5}},
{text:"'Bilmiyorum' de",tag:"korkak",effect:{sayginlik:-5}}]},

{id:"s18",gfx:"compass",alert:false,day:"Gün 4",time:"06:00",loc:"Köprüüstü — Sabah Nöbeti",sub:"İlk yarı-bağımsız nöbet",who:"z2",
text:`"${n}, bugün Radarı izle. CPA 1.5 milin altına düşerse beni çağır.\n\nHer küçük şeyde çağırırsan güvensizlik mesajı verirsin. Her şeyi kendi başına çözmeye çalışırsan hata yaparsın.\n\nDenge bul."`,
choices:[
{text:"Sakin izle, kritik durumda çağır",tag:"akilli",effect:{bilgi:10,sayginlik:10}},
{text:"Her küçük şeyi raporla",tag:"itaatkar",effect:{sayginlik:3,bilgi:5}},
{text:"Her şeyi kendi başına çöz",tag:"cesur",effect:{cesaret:8,sayginlik:-3,bilgi:5}}]},

{id:"s19",gfx:"bridge",alert:false,day:"Gün 4",time:"11:00",loc:"Köprüüstü",sub:"Süvari ile ilk sohbet",who:"suvari",
text:`Süvari Mustafa Kaptan köprüye geldi. Radarı inceledi:\n\n"${n}, dört gündür gemidesin. Lostromo'dan iyi şeyler duydum. Sana bir şey sormak istiyorum: ${sn}'de olmak nasıl?"`,
choices:[
{text:"Dürüstçe anlat — iyi ve zor yanlarıyla",tag:"sosyal",effect:{sayginlik:10,cesaret:5}},
{text:"'Her şey harika' de",tag:"itaatkar",effect:{sayginlik:3}},
{text:"'Beklediğimden farklı ama öğreniyorum' de",tag:"akilli",effect:{sayginlik:8,bilgi:3}}]},

{id:"s20",gfx:"compass",alert:false,day:"Gün 4",time:"18:00",loc:"Köprüüstü — Brifing",sub:"Fırtına uyarısı alındı",who:"z2",
text:`"Girit açıklarında alçak basınç. Beaufort 7-8 bekleniyor.\n\nSüvari burada. Karar: Güneye sapıp fırtınadan kaçırız ama geç varırız. Ya da doğrudan devam ederiz."\n\nSüvari ${n}'ye döndü: "Sen olsan?"`,
choices:[
{text:"Haritayı incele, alternatif rotayı gerekçeyle sun",tag:"akilli",effect:{bilgi:12,sayginlik:10,cesaret:8}},
{text:"'Süvarinin kararı doğru olur' de",tag:"korkak",effect:{sayginlik:-5,cesaret:-5}},
{text:"'Devam edelim' de",tag:"cesur",effect:{cesaret:10,sayginlik:3}}]},

// ---- KRİTİK SENARYOLAR ----
{id:"kriz01",gfx:"engine_fault",alert:true,day:"Gün 4",time:"14:00",loc:"Köprüüstü — ACİL ALARM",sub:"Ana makine arızası — gemi ileri sürme gücünü kaybetti",who:"carkci",
text:`Alarm çaldı — sert, kesintisiz.\n\nÇarkçıbaşı radyodan:\n"Köprü dikkat! Ana makine yüksek egzoz sıcaklığı alarmı verdi. Makineleri durduruyorum. Tekrar: MAKİNE DURDU."\n\nGemi bir anda yavaşlamaya başladı.\n\nSüvari: "${n}! Git Çarkçıbaşı'na yardım et. Gözlemle ve raporla!"`,
choices:[
{text:"Hemen makineye in, Çarkçıbaşı'nın yanında dur",tag:"kritik",effect:{cesaret:10,sayginlik:12,bilgi:8}},
{text:"'Ne yapabilirim?' diye sor, sonra git",tag:"akilli",effect:{bilgi:8,sayginlik:8}},
{text:"Köprüde kal, olayı izle",tag:"korkak",effect:{sayginlik:-8,cesaret:-5}}]},

{id:"kriz02",gfx:"engine_fault",alert:true,day:"Gün 4",time:"14:20",loc:"Makine Dairesi — Acil Müdahale",sub:"Egzoz sıcaklığı 480°C — limit 420°C",who:"bas2",
text:`Makine dairesinde herkes ciddi. Paniksiz ama gergin.\n\n2. Başmakinist:\n"${n}, not al. Soğutma suyu akışı düşmüş. Termostat arızası ya da soğutma suyu pompası kavitasyon.\n\nŞu vanayı manuel açacağım. Basınç değişimini izle ve söyle."`,
choices:[
{text:"Basınç göstergesini gözünden ayırma, değişimi bildir",tag:"akilli",effect:{bilgi:15,sayginlik:12}},
{text:"Çarkçıbaşı gelince ona bırak",tag:"korkak",effect:{sayginlik:-8}},
{text:"Vanayı kendisi de aç diye öner",tag:"cesur",effect:{cesaret:5,sayginlik:-3}}]},

{id:"kriz03",gfx:"engine",alert:false,day:"Gün 4",time:"15:45",loc:"Makine Dairesi — Arıza Giderildi",sub:"Soğutma suyu pompası değiştirildi",who:"carkci",
text:`Bir saat sonra motor yeniden çalışıyordu.\n\nÇarkçıbaşı ${n}'ye döndü:\n\n"Soğutma suyu pompasının kavitasyon yaptığını gördün mü? Bu arıza denizde olabilir. Sen sağ ol."`,
choices:[
{text:"Her şeyi not al — bu değerliydi",tag:"akilli",effect:{bilgi:15,sayginlik:8}},
{text:"'Bir dahaki sefere hazır olacağım' de",tag:"cesur",effect:{cesaret:5,sayginlik:8}},
{text:"Teşekkür et ve güverteye dön",tag:"itaatkar",effect:{sayginlik:5}}]},

{id:"kriz04",gfx:"storm",alert:false,day:"Gün 5",time:"07:00",loc:"Ana Güverte — Fırtına",sub:"Beaufort 8 — 18 derece yatış",who:"lostromo",
text:`Fırtına erken ve sert geldi. ${sn} 18 derece yatıyor.\n\nLostromo:\n"Güverteye çıkmak yasak! Ama kargo bağlantıları gevşedi — kayarsa hasar büyük."\n\nSessizlik. Kimse kımıldamıyordu.`,
choices:[
{text:"'Ben giderim' — emniyet halatı tak ve çık",tag:"cesur",effect:{cesaret:15,sayginlik:15,dinclik:-12}},
{text:"'Deneyimli biri daha doğru olur' deyip öner",tag:"akilli",effect:{sayginlik:3,cesaret:-5}},
{text:"Gözleri kaçır",tag:"korkak",effect:{sayginlik:-15,cesaret:-10}}]},

{id:"kriz05",gfx:"storm",alert:false,day:"Gün 5",time:"14:00",loc:"Köprüüstü — Fırtına Zirvesi",sub:"Beaufort 9 — dalga 7 metre",who:"suvari",
text:`Fırtına zirvesinde. Dalga 7 metreye çıktı.\n\nSüvari ${n}'ye:\n"Stajyer. İlk fırtınandaydın. Korkuyor musun?"`,
choices:[
{text:"'Evet, korkuyorum — ama görevimi yapıyorum' de",tag:"cesur",effect:{cesaret:10,sayginlik:10}},
{text:"'Hayır efendim' de",tag:"korkak",effect:{sayginlik:-3}},
{text:"'Endişeliyim ama ekibe güveniyorum' de",tag:"akilli",effect:{sayginlik:8,bilgi:5}}]},

{id:"kriz05b",gfx:"cabin",alert:false,day:"Gün 5",time:"16:20",loc:"Stajyer Kabini — Fırtına Devam Ederken",sub:"Ilk buyuk firtina — siddetli yalpa — sessiz aglayis",who:"anlatici",
text:`Kopruden ayrilip kamarana gectiginde gemi bir kez daha sertce yatti. Dolap kapagi vurdu, askidaki tulum savruldu, metal bir bardak zeminde kayip durdu.

Bu kadar buyuk bir firtinayi ilk kez yasiyordun. Gemi sanki her dalgada ikiye ayrilacakmis gibi inleyince bogazin dugumlendi.

Ranzaya oturdun. Kimse gormesin diye yuzunu ellerinin arasina aldin ve istemeden aglamaya basladin.

O anda kendini nasil toparlarsin?`,
choices:[
{text:"Derin nefes alip 'Korkmam normal, ama geceyi atlatacagim' diye kendimi sakinlestiririm",tag:"akilli",effect:{dinclik:6,cesaret:5}},
{text:"Bir sure aglayip sonra kisa bir not alarak yasadigimi anlamlandirmaya calisirim",tag:"duygusal",effect:{bilgi:5,dinclik:4}},
{text:"Battaniyenin altina girip tamamen icime kapanirim",tag:"korkak",effect:{dinclik:-8,cesaret:-7,sayginlik:-2}}]},

{id:"kriz06",gfx:"galley",alert:false,day:"Gün 5",time:"20:00",loc:"Yemekhane — Fırtına Sonrası",sub:"Fırtına geçti — herkes yorgun",who:"asci",
text:`Fırtına geçti. Mehmet Usta sahanda yumurta pişirdi: "Basit, pratik, besleyici."\n\nSilici Ramazan:\n"Bugün üç ambar kapısı sızdırıyordu. ${n} hepsini buldu. İyi iş."`,
choices:[
{text:"Alçakgönüllüce teşekkür et",tag:"itaatkar",effect:{sayginlik:8}},
{text:"'Lostromo öğretti' de — krediyi paylaş",tag:"sosyal",effect:{sayginlik:12}},
{text:"Sessiz kal",tag:"korkak",effect:{sayginlik:2}}]},

{id:"kriz07",gfx:"bogaz",alert:true,day:"Gün 6",time:"03:00",loc:"Çanakkale Boğazı — ACİL",sub:"Demir tutmuyor — akıntı 4 knot — gemi sürükleniyor",who:"suvari",
text:`Gece 03:00. Çanakkale Boğazı girişi. Rüzgar hızlandı.\n\nSüvari:\n"Demir tutmuyor! SOG 0.8 knot kıyıya doğru. 2 mil mesafe kaldı.\n\n${n}! Sahil güvenliği VHF 16'dan ara, durumu bildir. Hızlı!"`,
choices:[
{text:"Hemen VHF'ye atla: 'SECURITE SECURITE — Türk sularında sürüklenme' de",tag:"kritik",effect:{cesaret:15,sayginlik:15,bilgi:8}},
{text:"Süvariye 'nasıl yapayım?' diye sor",tag:"korkak",effect:{sayginlik:-10,cesaret:-8}},
{text:"Yazılı prosedürü bul, sonra ara",tag:"akilli",effect:{bilgi:5,sayginlik:-5}}]},

{id:"kriz08",gfx:"bogaz",alert:true,day:"Gün 6",time:"03:15",loc:"Çanakkale Boğazı — VHF İletişimi",sub:"Sahil güvenlik bağlandı — kurtarma gemisi yolda",who:"z2",
text:`2. Zabiti:\n\n"${n}, sahil güvenlik bağlandı. Koordinatları ver: 40°12'N 026°24'E.\n\nSonra demir bağlarımızın durumunu sor."`,
choices:[
{text:"Koordinatı doğru oku, demir bağlarını sor",tag:"akilli",effect:{bilgi:15,sayginlik:12,cesaret:5}},
{text:"2. Zabiti yanında konuş, o düzeltsin",tag:"itaatkar",effect:{sayginlik:5,bilgi:5}},
{text:"Sesi titredi, hata yaptın",tag:"korkak",effect:{sayginlik:-8,cesaret:-5}}]},

{id:"kriz09",gfx:"sea",alert:false,day:"Gün 6",time:"05:30",loc:"Çanakkale Boğazı — Güven Sağlandı",sub:"Sürüklenme durduruldu",who:"suvari",
text:`Şafak sökerken makine devreye girdi. Kurtarma gemisi yanı başında.\n\nSüvari:\n"Bu gece VHF'ye atlayan sendin. İyi yaptın. Boğazda sürüklenme — en kötü senaryo. Ama sen paniklemeden aradın."`,
choices:[
{text:"'Eğitim sayesinde' de — teşekkür et",tag:"akilli",effect:{bilgi:8,sayginlik:12}},
{text:"'Korktum ama yapmak gerekiyordu' de",tag:"cesur",effect:{cesaret:10,sayginlik:10}},
{text:"Sessiz gül, başını eğ",tag:"itaatkar",effect:{sayginlik:8}}]},

{id:"kriz10",gfx:"pirate",alert:true,day:"Gün 8",time:"04:00",loc:"Aden Körfezi — ACİL — KORSAN UYARISI",sub:"Yüksek hız tekneleri gemiye yaklaşıyor",who:"suvari",
text:`Gece 04:00. Tüm ışıklar söndürüldü.\n\nSüvari:\n"IMB NAVAREA uyarısı: Aden Körfezi'nde aktif korsan bölgesi. Radarda iki yüksek hız teknesi var — 28 knot, bize doğru geliyor.\n\nBMS prosedürleri başlıyor. ${n}, BMS odasına git — kapıyı içeriden kilitle!"`,
choices:[
{text:"Koş, BMS odasına gir, kapıyı kilitle",tag:"kritik",effect:{cesaret:12,sayginlik:12}},
{text:"'BMS odası nerede?' diye sor",tag:"korkak",effect:{sayginlik:-8,cesaret:-5}},
{text:"Köprüde kal, yardım et",tag:"cesur",effect:{cesaret:8,sayginlik:-5}}]},

{id:"kriz11",gfx:"pirate",alert:true,day:"Gün 8",time:"04:20",loc:"BMS Odası — Kilitli",sub:"Süvari makine hızını full'e çekti — kaçış manevrası",who:"anlatici",
text:`BMS odasının içi karanlık. Demir kapı kilitli.\n\nDışarıdan radyo: "${sn} kaçış manevrası başlıyor!"\n\n20 dakika böyle geçti. Sonra süvarinin sesi:\n\n"BMS — dışarı çıkabilirsiniz. Tekneler geride kaldı."`,
choices:[
{text:"Dışarı çık, Süvari'ye durumu sor",tag:"akilli",effect:{bilgi:8,sayginlik:8}},
{text:"Derin nefes al, sakin ol, çık",tag:"itaatkar",effect:{dinclik:5,cesaret:5}},
{text:"İlk dışarı çıkan sen ol",tag:"cesur",effect:{cesaret:8,sayginlik:5}}]},

{id:"kriz12",gfx:"bridge",alert:false,day:"Gün 8",time:"05:00",loc:"Köprüüstü — Korsan Sonrası",sub:"Değerlendirme toplantısı",who:"suvari",
text:`Süvari:\n\n"${n}, Aden'de her sefer bu risk var. BMS prosedürünü doğru uyguladın. Panikledin mi?"`,
choices:[
{text:"'Evet, içimde — ama yaptım' de — dürüst",tag:"cesur",effect:{cesaret:10,sayginlik:12}},
{text:"'Hayır efendim' de",tag:"korkak",effect:{sayginlik:3}},
{text:"'BMS odası beni rahatlattı' de",tag:"akilli",effect:{bilgi:5,sayginlik:8}}]},

// ---- EK RUTİN SAHNELER ----
{id:"s21",gfx:"sea",alert:false,day:"Gün 6",time:"06:30",loc:"Pruva — Sabah",sub:"Hasan ile sabah sohbeti",who:"hasan",
text:`Tayfa Hasan pruva korkuluğuna yaslandı.\n\n"${n}, senin yaşındayken ben de staj yaptım.\n\nBir süvari bana dedi: 'Deniz seni öldürmek istemez. Ama aptallığını affetmez.'"`,
choices:[
{text:"Dinle ve 'anlıyorum' de",tag:"sosyal",effect:{sayginlik:8,bilgi:5,dinclik:5}},
{text:"Benzer bir an olup olmadığını sor",tag:"akilli",effect:{bilgi:8,sayginlik:7}},
{text:"Teşekkür et ve görevine dön",tag:"itaatkar",effect:{dinclik:5}}]},

{id:"s22",gfx:"night",alert:false,day:"Gün 7",time:"22:00",loc:"Köprüüstü — Gece Nöbeti",sub:"İlk gerçek yalnız nöbet",who:"z2",
text:`"${n}, bu gece nöbette yalnızsın. İlk kez. Alarm çalarsa beni ara.\n\nGece nöbetinin en büyük düşmanı yorgunluktur. Oturma — ayakta kal."`,
choices:[
{text:"Ayakta kal, radara odaklan, kayıt tut",tag:"akilli",effect:{bilgi:12,sayginlik:10}},
{text:"Otur ama gözleri açık tut",tag:"korkak",effect:{dinclik:-5,sayginlik:-5}},
{text:"Küçük turlar at, aktif kal",tag:"cesur",effect:{bilgi:8,sayginlik:8,cesaret:5}}]},

{id:"s23",gfx:"radar",alert:false,day:"Gün 7",time:"23:30",loc:"Köprüüstü — Gece",sub:"Radar hedefi yaklaşıyor",who:"anlatici",
text:`Saat 23:30. Ekranda kırmızı nokta.\n\nHedef sancak baş omuzluğundan geçiş yapıyor. CPA: 0.8 mil. 12 dakika.\n\nCOLREG'e göre bu crossing durumunda ${sn} give-way gemi. Sen bağımsız manevra veremezsin; ama riski doğru okuyup nöbet zabitini hemen kaldırman gerekir.\n\n2. Zabiti uyuyor. 12 dakika.`,
choices:[
{text:"Hemen 2. Zabiti'yi ara, 'sancakta crossing hedef, CPA 0.8' diye rapor ver",tag:"akilli",effect:{bilgi:14,sayginlik:12}},
{text:"Hedefi izlemeye devam et, CPA biraz daha düşerse haber ver",tag:"cesur",effect:{cesaret:6,bilgi:2,dinclik:-5,sayginlik:-4}},
{text:"Bekle — AIS'te büyük gemi bizi zaten görüyordur",tag:"korkak",effect:{dinclik:-8,sayginlik:-10,bilgi:-8}}]},

{id:"s23b",gfx:"compass",alert:false,day:"Gün 7",time:"23:40",loc:"Köprüüstü — COLREG Dersi",sub:"2. Zabiti ile trafik değerlendirmesi",who:"z2",
text:`2. Zabiti köprüye geldi, radarı aldı.\n\n"İyi ki kaldırdın. Şimdi söyle: sancakta gemi varsa crossing'de kim give-way olur? Head-on'da ne yaparız? Dar kanalda nerede dururuz?"\n\nKısa kısa cevap vermeni bekliyor.`,
choices:[
{text:"'Sancaktaki hedef bende ise ben yol veririm; head-on'da sancağa döneriz; dar kanalda sancak sınırına yakın kalırız' de",tag:"kritik",effect:{bilgi:16,sayginlik:12,cesaret:6}},
{text:"'Önce VHF çağrısı yaparız, sonra bakarız' de",tag:"itaatkar",effect:{bilgi:3,sayginlik:-4}},
{text:"'Büyük olan geçer, küçük olan kaçar' de",tag:"korkak",effect:{bilgi:-10,sayginlik:-8}}]},

{id:"s24",gfx:"fire",alert:true,day:"Gün 9",time:"14:00",loc:"Yangın İstasyonu — TATBIKAT",sub:"Gerçekçi yangın tatbikatı — 4 dakika",who:"z3",
text:`Alarm çaldı.\n\n3. Zabiti:\n"Bu sefer gerçekçi yapıyoruz. ${n}, sen B güvertesi tahliye sorumlusun. Oradaki üç personeli toplanma istasyonuna götür. Süre: 4 dakika."`,
choices:[
{text:"Hızlıca koş, üç kişiyi bul ve yönlendir",tag:"cesur",effect:{cesaret:12,sayginlik:10,dinclik:-8}},
{text:"Sakin kal, sırayla kontrol et",tag:"akilli",effect:{bilgi:10,sayginlik:10}},
{text:"Kafan karışık — biri seni yönlendirsin",tag:"korkak",effect:{sayginlik:-10,cesaret:-8}}]},

{id:"s25",gfx:"sea",alert:false,day:"Gün 9",time:"10:00",loc:"Ana Güverte",sub:"Lostromo ile ileri halat teknikleri",who:"lostromo",
text:`"${n}, dün iyi iş çıkardın. Bugün daha ileri seviye göstereceğim.\n\nDeniz kelebeği, iki yarım, Fransız bağı — her birinin kullanım yeri farklı.\n\nBana göster: Baba babasına halat bağla."`,
choices:[
{text:"Dikkatlice dene, doğru yöntemi kullan",tag:"akilli",effect:{bilgi:12,sayginlik:10}},
{text:"Hızlıca bağla",tag:"cesur",effect:{cesaret:5,bilgi:5,sayginlik:3}},
{text:"'Bir daha gösterir misiniz?' de",tag:"itaatkar",effect:{bilgi:8,sayginlik:5}}]},

{id:"s26",gfx:"bridge",alert:false,day:"Gün 10",time:"09:00",loc:"Süvari Kamarası",sub:"Özel değerlendirme sohbeti",who:"suvari",
text:`Süvari seni kahvaltıya çağırdı.\n\n"${n}, otur. Kahve?\n\n${sn}'de en çok kimi sayıyorsun? Kimi model alıyorsun?"`,
choices:[
{text:"Lostromo'yu söyle — pratik bilgi",tag:"akilli",effect:{sayginlik:10,bilgi:8}},
{text:"Süvariyi söyle — saygı",tag:"cesur",effect:{sayginlik:8,cesaret:3}},
{text:"'Herkesten bir şey alıyorum' de",tag:"sosyal",effect:{sayginlik:12,bilgi:5}}]},

{id:"s27",gfx:"sea",alert:false,day:"Gün 11",time:"15:00",loc:"Pruva — Akşam Üzeri",sub:"Lostromo ile son büyük ders",who:"lostromo",
text:`Lostromo ${n}'yi pruvanın ucuna götürdü. İlk gün gibi.\n\n"İlk gün seni buraya getirmiştim. Aşağı baktın, korkuyu gizlemeye çalıştın.\n\nŞimdi aynı yere bak."\n\nDenize baktın. Dalga var ama korkuyu hissetmedin.`,
choices:[
{text:"'Farkı hissediyorum' de — içten",tag:"sosyal",effect:{sayginlik:12,cesaret:8}},
{text:"Sessizce gül — sözün gereği yok",tag:"itaatkar",effect:{sayginlik:10,cesaret:5}},
{text:"'Hâlâ öğreniyorum' de",tag:"akilli",effect:{sayginlik:10,bilgi:5}}]},

{id:"s28",gfx:"galley",alert:false,day:"Gün 12",time:"20:00",loc:"Yemekhane — Veda Yemeği",sub:"Son akşam — herkes masada",who:"asci",
text:`Mehmet Usta özel menü hazırladı. Kuzu dolma ve baklava.\n\nHerkes masadaydı. Süvari ayağa kalktı:\n\n"${n}. Bu yolculukta bir söz var mı?"`,
choices:[
{text:"Herkese tek tek teşekkür et",tag:"sosyal",effect:{sayginlik:15,dinclik:10}},
{text:"Kısa ve özlü konuş",tag:"itaatkar",effect:{sayginlik:8}},
{text:"Öğrendiklerini listele",tag:"akilli",effect:{sayginlik:10,bilgi:8}}]},

{id:"s29",gfx:"engine",alert:false,day:"Gün 6",time:"09:00",loc:"Makine Kontrol Odası",sub:"2. Başmakinist paralel jeneratör dersi",who:"bas2",
text:`"${n}, dün fırtınada iki jeneratör aynı anda çalıştı.\n\nSana soruyorum: İki jeneratör paralel çalışırken en büyük risk ne?"`,
choices:[
{text:"'Faz senkronizasyonu kaybolursa kısa devre' de",tag:"akilli",effect:{bilgi:15,sayginlik:10}},
{text:"'Emin değilim, açıklar mısınız?' de",tag:"itaatkar",effect:{bilgi:8,sayginlik:3}},
{text:"Tahmin et, yanlış olsa da söyle",tag:"cesur",effect:{bilgi:3,sayginlik:-3,cesaret:3}}]},

{id:"s30",gfx:"cargo",alert:false,day:"Gün 7",time:"14:00",loc:"Yük Sahası",sub:"Yükleme planı hazırlığı",who:"z1",
text:`"${n}, yükleme planını hazırlamak istiyorum. Denge hesabı, yük yerleşimi, manifesto taslağı.\n\nBu sefer sen yapacaksın. Referans dokümanlar masada."`,
choices:[
{text:"'Yapabilirim' de — inisiyatif al",tag:"cesur",effect:{cesaret:12,sayginlik:10}},
{text:"Referans dokümanlara bak, dikkatli hazırla",tag:"akilli",effect:{bilgi:15,sayginlik:12,dinclik:-8}},
{text:"'Biraz yardım alabilir miyim?' de",tag:"itaatkar",effect:{sayginlik:7,bilgi:8}}]},

{id:"s31",gfx:"port_arrival",alert:false,day:"Gün 7",time:"09:00",loc:"Pire Limanı",sub:"İlk yabancı liman — Yunanistan",who:"anlatici",
text:`${sn} Pire'ye demirlendi. Yunan güneşi yakıcı. Liman gürültülü.\n\nMehmet Usta: "Bu akşam balık var — kutlama!"`,
choices:[
{text:"Yükleme operasyonuna odaklan",tag:"akilli",effect:{bilgi:8,sayginlik:10}},
{text:"Kısa bir tur at Pire'de",tag:"sosyal",effect:{sayginlik:8,dinclik:5}},
{text:"Mehmet Usta'nın yanına git",tag:"itaatkar",effect:{dinclik:8,sayginlik:5}}]},

{id:"s32",gfx:"compass",alert:false,day:"Gün 8",time:"10:00",loc:"Açık Deniz — Seyir",sub:"Uzun seyir — 6 saatlik solo nöbet",who:"z2",
text:`"${n}, bugün sana bağımsız bir görev veriyorum. Öğleden sonra nöbetini tek tutacaksın — 6 saat.\n\nHer saat bir kez kontrole geleceğim. Ama müdahale etmeyeceğim.\n\nHazır mısın?"`,
choices:[
{text:"'Hazırım efendim' — güvenle",tag:"cesur",effect:{cesaret:10,sayginlik:8}},
{text:"'Hazırım ama yakında ol' de",tag:"akilli",effect:{sayginlik:5,bilgi:5}},
{text:"'Emin değilim' de",tag:"korkak",effect:{cesaret:-5,sayginlik:-5}}]},

{id:"s33",gfx:"sea",alert:false,day:"Gün 8",time:"18:30",loc:"Köprüüstü",sub:"Solo nöbet değerlendirmesi",who:"z2",
text:`2. Zabiti raporu okudu. Sustu. Sonra:\n\n"Üç olayın ikisini doğru hallettın. Sahil muhafaza iletişimi mükemmeldi.\n\nBir eksik: Dümen kararında bilgilendirme zinciri kopmaz. Bağımsız nöbet, bağımsız karar değil.\n\nGenel: Çok iyi." Eli uzattı.`,
choices:[
{text:"El sıkış, teşekkür et",tag:"itaatkar",effect:{sayginlik:10,bilgi:5}},
{text:"'Bilgilendirme konusunu not aldım' de",tag:"akilli",effect:{bilgi:8,sayginlik:8}},
{text:"İçten gurur duy",tag:"sosyal",effect:{sayginlik:7,cesaret:5}}]},

{id:"s34",gfx:"galley",alert:false,day:"Gün 6",time:"08:00",loc:"Yemekhane — Kahvaltı",sub:"Silici ile sabah sohbeti",who:"silici",
text:`Silici Ramazan kahvaltıda:\n\n"${n}, sana bir şey soracaktım. Neden denizcilik seçtin?\n\nBen seçmedim. Babam denizciydi, ağabeyim de. Ben de öyle oldum."`,
choices:[
{text:"Gerçek cevabını ver — içten anlat",tag:"sosyal",effect:{sayginlik:10,bilgi:3}},
{text:"'Denizi seviyorum' de — sade ama dürüst",tag:"itaatkar",effect:{sayginlik:5}},
{text:"'Henüz tam bilmiyorum' de",tag:"akilli",effect:{sayginlik:7,bilgi:3}}]},

{id:"s35",gfx:"engine",alert:false,day:"Gün 10",time:"11:00",loc:"Makine Dairesi",sub:"Son makine ziyareti",who:"bas2",
text:`2. Başmakinist seni tekrar makine dairesine çağırdı.\n\n"Hatırla mısın — pompa arızasını? Tamir ettik. Titreşim 1.8 mm/s — normalin altında.\n\nSeninle birlikte çözüldü. Ben tesadüfe inanmam."`,
choices:[
{text:"İn, son bir kez pompaya bak",tag:"sosyal",effect:{sayginlik:10,bilgi:8,dinclik:-3}},
{text:"Teşekkür et — bir şeyler öğrettiği için",tag:"itaatkar",effect:{sayginlik:12}},
{text:"'Bu deneyim değerliydi' de",tag:"akilli",effect:{sayginlik:10,bilgi:5}}]},

// ---- FİNAL SAHNE (her zaman son) ----

// ---- YENİ SENARYOLAR ----
{id:"s36",gfx:"sea",alert:false,day:"Gün 5",time:"08:00",loc:"Açık Deniz — Şafak",sub:"Gemi dümen başı vardiyası",who:"z2",
text:`Şafak söküyor. 2. Zabiti köprüde, seyir günlüğünü kapatıyor.\n\n"${n}, bir şey soracağım. Şimdiye kadar en çok hangi sahneyi aklına kazıdın? Limanda ilk adım, lostromo'nun halatı, gece nöbeti?\n\nGemide her şeyi öğretmek zorundayız — siz stajyerler yarının zabitlerisisiniz."`,
choices:[
{text:"'Gece nöbetindeki radar hedefi' de — dürüst",tag:"akilli",effect:{bilgi:8,sayginlik:10}},
{text:"'Lostromo'nun pruva dersi' de",tag:"sosyal",effect:{sayginlik:8,bilgi:5}},
{text:"'Hepsinden bir şey aldım' de",tag:"itaatkar",effect:{sayginlik:7}}]},

{id:"s37",gfx:"engine",alert:false,day:"Gün 7",time:"16:00",loc:"Makine Dairesi — Kazan Odası",sub:"Yağcı ile buhar sistemi kontrolü",who:"yagci",
text:`Yağcı Mehmet Ali seni kazanlar odasına götürdü.\n\n"${n}, şu ısı eşanjörlerine bak. Çelik plakalar arasından sıcak su geçiyor, deniz suyuyla soğutuluyor.\n\nTıkanma olursa ne olur?"`,
choices:[
{text:"'Soğutma düşer, aşırı ısınma riski artar' de",tag:"akilli",effect:{bilgi:12,sayginlik:8}},
{text:"'Bilmiyorum ama öğrenmek istiyorum' de",tag:"itaatkar",effect:{bilgi:8,sayginlik:5}},
{text:"Konuyu değiştir",tag:"korkak",effect:{sayginlik:-3}}]},

{id:"s38",gfx:"sea",alert:false,day:"Gün 8",time:"14:00",loc:"Açık Deniz — Öğleden Sonra",sub:"Lostromo ile vinç bakımı",who:"lostromo",
text:`Lostromo kargo vincini bakıma aldı. ${n}'yi yanına çekti.\n\n"Vinç bakımı kimsenin görmek istemediği ama herkesin ihtiyaç duyduğu iş. Gres, yağ, halat kontrolü.\n\nSana öğreteceğim."`,
choices:[
{text:"İstekle katıl, gres tabancasını al",tag:"cesur",effect:{bilgi:10,sayginlik:10,dinclik:-5}},
{text:"Dikkatle izle, not al",tag:"akilli",effect:{bilgi:12,sayginlik:7}},
{text:"'Bu işi yapan ayrı biri değil mi?' de",tag:"korkak",effect:{sayginlik:-8}}]},

{id:"s39",gfx:"galley",alert:false,day:"Gün 9",time:"07:30",loc:"Yemekhane — Kahvaltı",sub:"Aşçı ile Türk kahvesi",who:"asci",
text:`Mehmet Usta Türk kahvesi yapıyordu.\n\n"${n}, denizciler çok kahve içer. Ama ölçüyü bil. Fazla kafein, gece nöbetinde uykusuzluk yapar — ama sabah nöbetinde hayat kurtarır.\n\nAl, iç."`,
choices:[
{text:"Al, keyifle iç — güzel bir an",tag:"sosyal",effect:{sayginlik:8,dinclik:5}},
{text:"Teşekkür et ama içme — kendi programın var",tag:"itaatkar",effect:{sayginlik:3}},
{text:"İç ve Mehmet Usta'ya gemi hikayeleri sor",tag:"akilli",effect:{sayginlik:10,bilgi:5}}]},

{id:"s40",gfx:"bridge",alert:false,day:"Gün 10",time:"14:00",loc:"Köprüüstü — Öğleden Sonra Nöbeti",sub:"3. Zabiti ile emniyet denetimi",who:"z3",
text:`3. Zabiti Kemal Bey nöbet devrine girdi.\n\n"${n}, sana SOLAS'tan bir soru: Gemide dört terk-i sefine bölgesi var. Her birinin birincil ve ikincil tahliye yolu nedir?\n\nBu soruyu bilmeden kaza anında ne yapacaksın?"`,
choices:[
{text:"Hatırladığın kadarını söyle, bilmediğini de söyle",tag:"akilli",effect:{bilgi:10,sayginlik:8}},
{text:"Muster listeni çıkar, oradan oku",tag:"itaatkar",effect:{bilgi:8,sayginlik:5}},
{text:"Tahmin et, yanlış olsa da",tag:"cesur",effect:{bilgi:3,sayginlik:-5,cesaret:3}}]},

{id:"s41",gfx:"cargo",alert:false,day:"Gün 11",time:"10:00",loc:"Yük Sahası — Ambar Kontrolü",sub:"1. Zabiti ile nem kontrolü",who:"z1",
text:`1. Zabiti ${n}'yi ambar 3'e götürdü.\n\n"Bak şu nem ölçere — 74%. Tahıl için sınır 65%, paketli yük için 70%. Yüksek nem kargoda küfe, sızdırmaya, ağırlık artışına yol açar.\n\nNe yaparsın?"`,
choices:[
{text:"'Havalandırma sistemini kontrol ederim, kapı güvertesini incelerim' de",tag:"akilli",effect:{bilgi:14,sayginlik:10}},
{text:"'Çarkçıbaşı'ya bildiririm, yük sorumluluğu zabitlerin' de",tag:"itaatkar",effect:{bilgi:7,sayginlik:5}},
{text:"'Yüzde dört fark önemli değil' de",tag:"korkak",effect:{sayginlik:-8,bilgi:-5}}]},

{id:"s42",gfx:"sea",alert:false,day:"Gün 12",time:"17:00",loc:"Güverte — Akşam Üzeri",sub:"Tayfa Musa ile dertleşme",who:"musa",
text:`Tayfa Musa güverte korkuluğuna yaslandı, sesi yorgun:\n\n"${n}, ben evleneceğim önümüzdeki yıl. Kız arkadaşım 'ya denizi bırak ya beni' diyor. Sen ne düşünürsün?"`,
choices:[
{text:"Dürüstçe anlat — denizin fedakarlıklarını da söyle",tag:"sosyal",effect:{sayginlik:10,bilgi:5}},
{text:"'Seç — iki şeyi de yarım yapamazsın' de",tag:"cesur",effect:{sayginlik:5,cesaret:3}},
{text:"'Bu çok kişisel, ben karışamam' de",tag:"itaatkar",effect:{sayginlik:3}}]},

{id:"s43",gfx:"compass",alert:false,day:"Gün 6",time:"11:00",loc:"Köprüüstü — Seyir Dersi",sub:"2. Zabiti ile derinlik ölçümü",who:"z2",
text:`2. Zabiti ECDIS'te bir noktayı işaret etti.\n\n"${n}, şu kanaldan geçeceğiz. Su derinliği 18 metre. ${sn}'nin maksimum tahliyesi 9.2 metre. Güvenli mi?\n\nHesapla."`,
choices:[
{text:"'18-9.2=8.8m kıç boşluğu, IACS standardı minimum 3.5m, güvenli' de",tag:"akilli",effect:{bilgi:15,sayginlik:12}},
{text:"'Süvari karar vermeli' de",tag:"korkak",effect:{sayginlik:-5}},
{text:"Hesabı yap ama yüksek sesle yanlış söyle",tag:"cesur",effect:{bilgi:-3,sayginlik:-5}}]},

{id:"s44",gfx:"night",alert:false,day:"Gün 9",time:"01:00",loc:"Köprüüstü — Gece Seyri",sub:"Yıldızlı gece — huzurlu nöbet",who:"anlatici",
text:`Saat 01:00. Nöbet sakin geçiyor.\n\nDeniz ışıl ışıl — biyolüminesans. Dalgalar yeşil parlıyor. ${sn}'nin pruvasından akan su her seferinde bir ışık saçıyor.\n\nBu manzaraya hayran kaldın. Hayatında böyle bir şey görmemiştin.`,
choices:[
{text:"Radyodan 2. Zabiti'yi ara, görmesini söyle",tag:"sosyal",effect:{sayginlik:10,dinclik:5}},
{text:"Nöbet günlüğüne yaz, radarı izlemeyi bırakma",tag:"akilli",effect:{bilgi:5,sayginlik:5}},
{text:"İzle, içini çek — bu an sadece sana ait",tag:"itaatkar",effect:{dinclik:8,sayginlik:3}}]},

{id:"s45",gfx:"storm",alert:false,day:"Gün 4",time:"16:00",loc:"İç Koridor — Alt Güverte",sub:"Fırtınada iç güverte kontrolü",who:"z1",
text:`"${n}, dış güverte yasak. Ama ambar kapılarını kontrol edeceksin — su sızdırmazlık. 12 kapı. Her birini tek tek işaretle."`,
choices:[
{text:"Tüm kapıları titizlikle kontrol et",tag:"akilli",effect:{bilgi:10,sayginlik:10,dinclik:-8}},
{text:"Hızlıca bak, 'tamam' de",tag:"korkak",effect:{sayginlik:-8,bilgi:-3}},
{text:"Lostromo'yu da al, birlikte kontrol et",tag:"cesur",effect:{sayginlik:7,bilgi:8,dinclik:-5}}]},

{id:"s46",gfx:"harbor",alert:false,day:"Gün 2",time:"11:00",loc:"İskenderiye Limanı — Giriş",sub:"İlk yabancı liman girişi",who:"z2",
text:`${sn} İskenderiye'ye yaklaşıyor.\n\n2. Zabiti:\n\n"${n}, yabancı limanda gümrük prosedürü farklı. Bayrak idaresi, liman devleti kontrolü, sağlık belgesi, ISPS güvenlik bildirimi.\n\nPilot kalkana geldi. Gözlemle."`,
choices:[
{text:"Her prosedürü not al",tag:"akilli",effect:{bilgi:14,sayginlik:8}},
{text:"Pilota yardım et — el işaretleri ver",tag:"cesur",effect:{cesaret:8,sayginlik:10}},
{text:"Arka planda izle",tag:"itaatkar",effect:{bilgi:5}}]},

{id:"s47",gfx:"galley",alert:false,day:"Gün 7",time:"12:00",loc:"Yemekhane — Öğle Arası",sub:"Silici ile felsefe sohbeti",who:"silici",
text:`Silici Ramazan öğle arasında sessizce yiyor.\n\n"${n}, sana bir şey soracağım. Gemi personeline çok zaman harcadın — kim seni en çok etkiledi?"`,
choices:[
{text:"Lostromo'yu söyle ve neden etkilendiğini anlat",tag:"sosyal",effect:{sayginlik:10,bilgi:5}},
{text:"Silici Ramazan'ı söyle — 14 yıl aynı işi yapmak",tag:"sosyal",effect:{sayginlik:12}},
{text:"Süvariyi söyle — liderlik",tag:"cesur",effect:{sayginlik:8,cesaret:3}}]},

{id:"kriz13",gfx:"fire",alert:true,day:"Gün 10",time:"11:00",loc:"A Güvertesi — GERÇEK YANGIN",sub:"Elektrik panosu yangını — MAYDAY değil SECURITE",who:"z3",
text:`Alarm çaldı — bu sefer gerçek.\n\nSiyah duman görünüyor. A güvertesinde elektrik panosu yandı.\n\n3. Zabiti radyoda:\n"Tüm mürettebat muster istasyonlarına! Bu tatbikat değil!\n\n${n}! Sen B tahliye sorumlusun. Oradaki iki kişiyi çıkar. 90 saniye!"`,
choices:[
{text:"Koş, B güvertedeki iki kişiyi bul ve yönlendir",tag:"kritik",effect:{cesaret:15,sayginlik:15,dinclik:-10}},
{text:"3. Zabiti'ye 'B güverte kaç kişi?' diye sor",tag:"akilli",effect:{sayginlik:5,bilgi:5}},
{text:"Duman göründü — dondun",tag:"korkak",effect:{sayginlik:-15,cesaret:-12}}]},

{id:"kriz14",gfx:"fire",alert:true,day:"Gün 10",time:"11:05",loc:"Muster İstasyonu — B Güverte",sub:"Tahliye tamamlandı — 87 saniye",who:"z3",
text:`87 saniyede B güvertedekileri topladın.\n\n3. Zabiti krono baktı:\n\n"87 saniye. İyi. Standart 90 saniye.\n\nBir sorun: Listede 2 kişi yazıyordu ama sen 2 kişi getirdin. Doğru. Ama AMbar 3'ten çıkan Musa nerede?\n\nMuster listeni tam okudun mu?"`,
choices:[
{text:"'Musa'yı da almalıydım, muster listemde yoktu — hata bende' de",tag:"akilli",effect:{bilgi:12,sayginlik:10}},
{text:"'Ama listedeki herkesi aldım' de — savun",tag:"cesur",effect:{sayginlik:-3,cesaret:3}},
{text:"Sessiz kal, ne diyeceğini bil(e)miyorsun",tag:"korkak",effect:{sayginlik:-8}}]},

{id:"kriz15",gfx:"sea",alert:false,day:"Gün 3",time:"22:00",loc:"Açık Deniz — Gece",sub:"Gece denizinde adam düştü tatbikatı",who:"suvari",
text:`Süvari ani bir tatbikat başlattı.\n\n"ADAM DÜŞTÜ — SANCAK TARAF!"

Gemi manevra yapıyor. Deniz işaret feneri atıldı. Zabitler positione koştu.\n\nSüvari ${n}'ye:\n"Sen ne yapıyorsun? Söyle!"`,
choices:[
{text:"'Düşenin yerini gösteririm, gözden ayırmam' de — doğru",tag:"akilli",effect:{bilgi:15,sayginlik:12,cesaret:8}},
{text:"Bağırarak yardım çağır",tag:"cesur",effect:{cesaret:5,sayginlik:5}},
{text:"Dondun",tag:"korkak",effect:{sayginlik:-12,cesaret:-8}}]},


{id:"s48",gfx:"bridge",alert:false,day:"Gün 3",time:"10:00",loc:"Köprüüstü — Trafik Ayrım Şeridi",sub:"TSS geçişi — yoğun trafik",who:"z2",
text:`2. Zabiti radarı işaret etti:\n\n"${n}, şu an Çanakkale TSS'sine giriyoruz. Trafik ayrım şeridi — tek yönlü geçiş zorunlu. Seyir hızı minimum 8 knot.\n\nŞu kırmızı nokta — 3 mil önümüzde, yavaş gemi. CPA hesabı yap."`,
choices:[
{text:"CPA hesapla, yeterli mesafe varsa rahatla bildir",tag:"akilli",effect:{bilgi:14,sayginlik:10}},
{text:"Süvariyi ara — TSS'de dikkatli olmak şart",tag:"cesur",effect:{cesaret:5,sayginlik:7,bilgi:5}},
{text:"2. Zabiti halleder diye düşün",tag:"korkak",effect:{sayginlik:-5,bilgi:-3}}]},

{id:"s49",gfx:"galley",alert:false,day:"Gün 5",time:"11:30",loc:"Yemekhane — Öğle Arası",sub:"Tayfa Hasan ile uzun denizcilik sohbeti",who:"hasan",
text:`Tayfa Hasan öğle arasında bira gibi kahvesini yudumluyor:\n\n"${n}, sana bir şey söyleyeyim. Ben 18 yıldır gemideyim. Üç süvari altında çalıştım. Her biri farklıydı.\n\nBirincisi her şeyi ezberletti. İkincisi hiçbir şey öğretmedi. Üçüncüsü — şu andaki — sen ne öğrenmek istersen sorusunu sordu.\n\nHangisi en iyi öğreticiydi sence?"`,
choices:[
{text:"'Üçüncüsü — merakı öldürmeyen' de",tag:"akilli",effect:{bilgi:8,sayginlik:10}},
{text:"'Birincisi — temel olmadan ilerlenmez' de",tag:"itaatkar",effect:{sayginlik:5,bilgi:5}},
{text:"Hepsinden bir şey var deyip dengeli cevap ver",tag:"sosyal",effect:{sayginlik:12,bilgi:5}}]},

{id:"s50",gfx:"harbor",alert:false,day:"Gün 4",time:"13:00",loc:"Cenova Limanı — Konteyner Sahası",sub:"İtalyan limanda yükleme denetimi",who:"z1",
text:`Cenova'da yükleme başladı. 1. Zabiti ${n}'ye döndü:\n\n"İtalyan liman yetkilileri gelecek. Portföy denetimi. Belgeleri hazır tut.\n\nBir sorun var — konteyner numarası 14 manifesto ile uyuşmuyor. Yetkili gelecek ve soracak."`,
choices:[
{text:"Numarayı yeniden kontrol et, doğruysa bildir, yanlışsa düzelt",tag:"akilli",effect:{bilgi:14,sayginlik:12,cesaret:5}},
{text:"1. Zabiti'ye bırak, senin işin değil",tag:"korkak",effect:{sayginlik:-8}},
{text:"Yanlış bile olsa geçiştirilir herhalde de",tag:"korkak",effect:{sayginlik:-12,bilgi:-5}}]},

{id:"s51",gfx:"night",alert:false,day:"Gün 8",time:"03:00",loc:"Köprüüstü — Derin Gece",sub:"03:00-06:00 nöbeti — en zor saat",who:"anlatici",
text:`Saat 03:00. Gece nöbetinin en ağır saati.\n\nGöz kapanmak istiyor. Deniz sakin. Radar sessiz. Hiçbir şey olmuyor.\n\nEn tehlikeli an bu — tehlikenin olmadığı an. Dikkat dağılır. Reflex körleşir.\n\nNe yapacaksın?`,
choices:[
{text:"Ayağa kalk, yüzünü yıka, güverteye çık — aktif kal",tag:"cesur",effect:{dinclik:-5,cesaret:8,bilgi:5}},
{text:"Radyo kontrolü yap, log yaz, ayakta dur",tag:"akilli",effect:{bilgi:10,sayginlik:8}},
{text:"Sadece birkaç dakika otururum diyerek otur",tag:"korkak",effect:{dinclik:-10,sayginlik:-8}}]},

{id:"s52",gfx:"engine",alert:false,day:"Gün 6",time:"14:00",loc:"Makine Dairesi — Sabo Sistemi",sub:"Çarkçıbaşı ile sintine sistemi",who:"carkci",
text:`Çarkçıbaşı ${n}'yi sintine pompası odasına götürdü.\n\n"${n}, MARPOL 73/78 biliyor musun? Denize yağlı su boşaltmak yasak. Sintine suyu sistemi var — yağ-su ayırıcı, 15 ppm monitör.\n\nKontrol düzeneği bozulsa bile denize basamayız. Cezası gemi alıkonması."`,
choices:[
{text:"MARPOL bilgini ortaya koy, sistemi incele",tag:"akilli",effect:{bilgi:14,sayginlik:10}},
{text:"'15 ppm ne demek?' diye sor",tag:"itaatkar",effect:{bilgi:10,sayginlik:5}},
{text:"Anlamadım ama anladım hissini ver",tag:"korkak",effect:{sayginlik:-5,bilgi:-3}}]},

{id:"s53",gfx:"sea",alert:false,day:"Gün 9",time:"16:30",loc:"Ana Güverte — Sancak Bordasında",sub:"Lostromo ile pas sökme",who:"lostromo",
text:`Lostromo ${n}'yi sancak bordaya götürdü. Elinde çekiç ve paslanmış panel.\n\n"Güvertede bakım bitmez. Pas görmezse gemi çürür. Boya altında ne var biliyor musun?"\n\nÇekiçle vurdu — ses boş geldi. "İşte bu. Pasta boya altında hava boşluğu. Burası çürük."`,
choices:[
{text:"Çekiçle dene, ses farkını anlamaya çalış",tag:"akilli",effect:{bilgi:12,sayginlik:10,dinclik:-5}},
{text:"Not al, tüm gözlemleri kaydet",tag:"itaatkar",effect:{bilgi:10,sayginlik:7}},
{text:"'Bu çok ağır iş' diye düşün ama söyleme",tag:"korkak",effect:{sayginlik:-3}}]},

{id:"s54",gfx:"compass",alert:false,day:"Gün 7",time:"11:00",loc:"Köprüüstü — AIS Terminali",sub:"2. Zabiti ile AIS ve sahte hedef tartışması",who:"z2",
text:`2. Zabiti AIS ekranını açtı:\n\n"${n}, şu gemilere bak. Hepsi AIS yayıyor. Ama dikkat — bazı gemiler kasıtlı olarak yanlış pozisyon yayıyor.\n\nNeden böyle yapar bir gemi?"`,
choices:[
{text:"'Kaçakçılık, yaptırımlardan kaçma, balık avı gizleme' de",tag:"akilli",effect:{bilgi:14,sayginlik:10}},
{text:"'Bilmiyorum ama tehlikeli olmalı' de",tag:"itaatkar",effect:{bilgi:7,sayginlik:5}},
{text:"'AIS kapatmak yasak değil mi?' diye sor",tag:"sosyal",effect:{bilgi:10,sayginlik:7}}]},

{id:"s55",gfx:"galley",alert:false,day:"Gün 10",time:"19:00",loc:"Yemekhane — Akşam",sub:"Aşçı ile hamur kültürü",who:"asci",
text:`Mehmet Usta bugün baklava yapıyor. Hamur açıyor, tereyağı sürüyor.\n\n"${n}, gel yardım et. Gemide baklava yapmak şart mı? Değil. Ama mürettebat moralini ayakta tutar. Ben 25 yıldır gemideyim. Herkes 'aşçı önemsiz' der. Ama mutfak kötüyse gemi kötüdür."`,
choices:[
{text:"Yardım et, hamur aç",tag:"sosyal",effect:{sayginlik:10,dinclik:5}},
{text:"Sohbet et, Mehmet Usta'nın denizcilik gözlemlerini dinle",tag:"akilli",effect:{bilgi:8,sayginlik:10}},
{text:"Gülerek otur, izle",tag:"itaatkar",effect:{sayginlik:7,dinclik:5}}]},

{id:"s56",gfx:"storm",alert:false,day:"Gün 6",time:"08:00",loc:"Güverte — Fırtına Sonrası Kontrol",sub:"Her şey yerli yerinde mi?",who:"lostromo",
text:`Fırtına geçti. Lostromo güverte turuna çıktı, ${n}'yi yanına aldı.\n\n"Fırtına sonrası kontrol rutini. Her halat, her bağlantı, her kapak. Hasarlı varsa not et.\n\nSen kıç tarafını al."`,
choices:[
{text:"Listeyi al, her noktayı titizce kontrol et",tag:"akilli",effect:{bilgi:10,sayginlik:10,dinclik:-5}},
{text:"Lostromo ile birlikte git, gözlemle",tag:"itaatkar",effect:{bilgi:8,sayginlik:7}},
{text:"'Her şey tamam görünüyor' diyip hızlıca geç",tag:"korkak",effect:{sayginlik:-8,bilgi:-5}}]},

{id:"s57",gfx:"sea",alert:false,day:"Gün 11",time:"14:00",loc:"Açık Deniz — Öğleden Sonra",sub:"2. Başmakinist ile karşılaşma",who:"bas2",
text:`2. Başmakinist Serdar Bey güverte geçidinde seni durdurdu.\n\n"${n}, bir hafta daha geçtik. Makine odasından söylemeliyim — sen güverte stajyeri olarak en meraklısıydın.\n\nSana şunu sorayım: Eğer makine dairesi kariyeri düşünsen, başlangıç noktası ne olurdu?"`,
choices:[
{text:"'Yağcı olarak başlardım, sistemi temelden öğrenirim' de",tag:"akilli",effect:{bilgi:10,sayginlik:10}},
{text:"'Güverte daha ilgimi çekiyor ama teşekkürler' de",tag:"itaatkar",effect:{sayginlik:7}},
{text:"'Hem güverte hem makineyi öğrenmek istiyorum' de",tag:"sosyal",effect:{sayginlik:10,bilgi:8}}]},

{id:"s58",gfx:"bridge",alert:false,day:"Gün 12",time:"09:00",loc:"Köprüüstü — Sabah Brifing",sub:"Süvari ile liderlik dersi",who:"suvari",
text:`Süvari sabah brifinginde mürettebata döndü:\n\n"Bir süvari gemide en yalnız insandır. Her karar ona aittir. Başarı mürettebatın, hata süvarinin."\n\nSonra ${n}'ye baktı:\n"Sen bunu anlamak için erken. Ama düşün: Bir stajyer en fazla neyle katkı sağlar?"`,
choices:[
{text:"'Sormak — her şeyi sormak' de",tag:"akilli",effect:{bilgi:8,sayginlik:10}},
{text:"'İş yapmak — öğrenmek için çalışmak' de",tag:"cesur",effect:{cesaret:5,sayginlik:8}},
{text:"'Hata yapmak ve öğrenmek' de",tag:"sosyal",effect:{sayginlik:10,bilgi:5}}]},

{id:"s59",gfx:"sea",alert:false,day:"Gün 2",time:"16:00",loc:"Pruva Güverte — Açık Deniz",sub:"İlk açık deniz hissi",who:"anlatici",
text:`Gemi açık denize çıktı. Kıyılar artık görünmüyor.\n\nSadece su. Her yanda. Ufuk her yönde eşit.\n\nBu his — sonsuzluk hissi — ilk kez görenin içini ürpertir. Küçüklük hissi. Ama bir yandan da özgürlük.\n\nNe hissediyorsun?`,
choices:[
{text:"Pruvaya git, rüzgarı hisset",tag:"cesur",effect:{cesaret:8,dinclik:5}},
{text:"Not defterini aç, bu anı yaz",tag:"akilli",effect:{bilgi:5,sayginlik:3}},
{text:"Görevi kontrol et — hissedecek vakit yok",tag:"itaatkar",effect:{sayginlik:5,bilgi:3}}]},

{id:"s60",gfx:"cargo",alert:false,day:"Gün 8",time:"10:00",loc:"Yük Sahası — Stowage Planı",sub:"Konteyner ağırlık dengesi hesabı",who:"z1",
text:`1. Zabiti stowage planını açtı:\n\n"${n}, bu gemide 340 konteyner var. Ağır olanlar altta, hafifler üste. Ama sorun: Şu 3 ağır konteyner son anda eklendi, sancak tarafa konuldu.\n\nGemi hafif sancak yatık. Trim hesabı yap — güvenli mi?"`,
choices:[
{text:"Hesabı yap: GM değeri, serbest yüzey, baş/kıç farkı",tag:"akilli",effect:{bilgi:15,sayginlik:12}},
{text:"'Süvari bilmeli, bildir' de",tag:"itaatkar",effect:{sayginlik:7,bilgi:5}},
{text:"'Hafif yatış normal' de",tag:"korkak",effect:{sayginlik:-8,bilgi:-5}}]},

{id:"s61",gfx:"harbor",alert:false,day:"Gün 1",time:"11:00",loc:startPort.office,sub:"ISPS güvenlik kodu — giriş prosedürü",who:"z3",
text:`3. Zabiti ${n}'yi limancı ofisine götürdü:\n\n"ISPS kodu. Her gemi Güvenlik Düzeyi 1, 2 veya 3'te çalışır. Şu an Düzey 1 — normal. Düzey 3 acil durum demek.\n\nSen stajyer olarak hangi ISPS belgesini taşımalısın?"`,
choices:[
{text:"'Continuous Synopsis Record ve SSAS bilinci' de",tag:"akilli",effect:{bilgi:14,sayginlik:10}},
{text:"'Bilmiyorum, öğretir misiniz?' de",tag:"itaatkar",effect:{bilgi:8,sayginlik:5}},
{text:"'Kimlik belgen yeterli değil mi?' de",tag:"korkak",effect:{sayginlik:-5,bilgi:-3}}]},

{id:"s62",gfx:"night",alert:false,day:"Gün 5",time:"00:30",loc:"Köprüüstü — Gece Yarısı",sub:"Lostromo ile tuhaf bir gece",who:"lostromo",
text:`Lostromo gece nöbet devrini yaparken köprüde durdu.\n\n"${n}. Uyku yok mu?"\n\nOturdu yanına. Denize baktı.\n\n"Ben bu gemide 14 yıldır çalışıyorum. İlk gece nöbetimde sana ne söyleseydim? Deniz seni test eder. Her zaman. Geçmek zorunda değilsin — ama dürüst olmak zorundasın."`,
choices:[
{text:"Sessizce dinle — bu anı hisset",tag:"sosyal",effect:{sayginlik:10,dinclik:5}},
{text:"'Siz geçtiniz mi tüm testleri?' diye sor",tag:"cesur",effect:{sayginlik:8,bilgi:5,cesaret:5}},
{text:"'Teşekkürler' de ve göreve dön",tag:"itaatkar",effect:{sayginlik:7}}]},

{id:"s63",gfx:"compass",alert:false,day:"Gün 10",time:"15:00",loc:"Köprüüstü — GMDSS Testi",sub:"Telsiz güvenlik sistemi test",who:"z3",
text:`3. Zabiti ${n}'ye GMDSS panelini gösterdi:\n\n"Global Maritime Distress and Safety System. Bu cihaz kaza anında otomatik distress sinyali gönderir.\n\nTest günü — sinyali test modunda çalıştır. Adım adım."`,
choices:[
{text:"Test prosedürünü oku, adım adım uygula",tag:"akilli",effect:{bilgi:14,sayginlik:10}},
{text:"3. Zabiti'nin yapmasını izle, not al",tag:"itaatkar",effect:{bilgi:10,sayginlik:7}},
{text:"'Yanlış yaparım, siz yapın' de",tag:"korkak",effect:{sayginlik:-8,cesaret:-5}}]},

{id:"s64",gfx:"engine_fault",alert:true,day:"Gün 9",time:"22:00",loc:"Makine Dairesi — Gece Arızası",sub:"Jeneratör 2 devre dışı — yük transferi",who:"bas2",
text:`Gece 22:00. Alarm çaldı.\n\n2. Başmakinist acil radyoda:\n"Jeneratör 2 arıza! Otomatik transfer başarısız. Jeneratör 1'e manuel yük transferi yapıyorum.\n\n${n} makine odasına — gözlemle ve log tut!"`,
choices:[
{text:"Hemen in, log defterini al, her adımı kaydet",tag:"kritik",effect:{bilgi:14,sayginlik:12,cesaret:8}},
{text:"Köprüdeki 2. Zabiti'yi bilgilendir önce",tag:"akilli",effect:{bilgi:8,sayginlik:10}},
{text:"Alarm kesilene kadar bekle",tag:"korkak",effect:{sayginlik:-10,cesaret:-8}}]},

{id:"s66",gfx:"bridge",alert:false,day:"Gün 4",time:"20:30",loc:"Köprüüstü — Vardiya Devri",sub:"STCW vardiya tutma standartları",who:"z2",
text:`2. Zabiti vardiya devrine hazırlanıyor.\n\n"${n}, STCW sadece diploma işi değil. Vardiya devri eksiksiz bilgi devridir: rota, trafik, hava, arıza, görüş, alarm, seyir cihazları.\n\nŞimdi bana devri sen yapacakmış gibi kısa bir özet ver."`,
choices:[
{text:"Rota, trafik, hava, ekipman ve açık riskleri sırayla özetle",tag:"akilli",effect:{bilgi:14,sayginlik:10}},
{text:"'Her şey normal' diyerek kısa kes",tag:"korkak",effect:{bilgi:-6,sayginlik:-8}},
{text:"Önce bilmediklerini söyle, sonra notlardan devret",tag:"itaatkar",effect:{bilgi:9,sayginlik:7}}]},

{id:"s67",gfx:"harbor",alert:false,day:"Gün 6",time:"09:30",loc:"Serdümen Güvertesi — Borda Hattı",sub:"LOADLINE ve Plimsoll işareti",who:"z1",
text:`1. Zabiti seni sancak bordaya götürdü.\n\n"Şu daire ve çizgiler var ya, Plimsoll mark. LOADLINE Sözleşmesi burada can bulur.\n\nYaz yükleme hattı ayrı, tropik ayrı, kış ayrı. Deniz suyu yoğunluğu ve mevsim fark eder.\n\nLiman memuru birazdan sorarsa ne dersin?"`,
choices:[
{text:"'Geminin serbest bordasını ve mevsimsel güvenli yükleme sınırını gösterir' de",tag:"akilli",effect:{bilgi:14,sayginlik:10}},
{text:"'Aşırı yüklemeyi önler' de — kısa ama doğru",tag:"itaatkar",effect:{bilgi:8,sayginlik:6}},
{text:"'Sadece boya işareti' de",tag:"korkak",effect:{bilgi:-8,sayginlik:-8}}]},

{id:"s68",gfx:"engine",alert:false,day:"Gün 8",time:"13:30",loc:"Makine Kontrol Odası — Bunker Planı",sub:"BUNKERS 2001 ve yakıt kirliliği sorumluluğu",who:"carkci",
text:`Çarkçıbaşı bir dosya açtı.\n\n"${n}, bunker spill olursa sadece temizlik yapmayız; hukuki sorumluluk da doğar. BUNKERS Sözleşmesi tam burada devreye girer.\n\nŞirket sigortası, P&I bildirimi, liman otoritesi raporu. Bir damla denize gitse tutanak tutulur.\n\nİlk refleksin ne olur?"`,
choices:[
{text:"Sızıntıyı durdur, SOPEP prosedürünü aç, zabit ve makineyi aynı anda haberdar et",tag:"kritik",effect:{bilgi:15,sayginlik:12,cesaret:6}},
{text:"Önce fotoğraf çeker, sonra birine söylerim",tag:"korkak",effect:{bilgi:-5,sayginlik:-10}},
{text:"Amire sorar, adım adım ilerlerim",tag:"itaatkar",effect:{bilgi:8,sayginlik:7}}]},

{id:"s69",gfx:"cargo",alert:false,day:"Gün 11",time:"09:00",loc:"Liman — Kuru Havuz Planı",sub:"AFS ve karina boyası kuralları",who:"suvari",
text:`Süvari kuru havuz planına baktı.\n\n"Bu sefer sonunda karina boyası yenilenecek. Eskiden kimi boyalarda zararlı organotin vardı; şimdi AFS bunu sınırlandırıyor.\n\nBir boya sadece iyi tuttu diye kullanılmaz. Mevzuata da uygun olacak.\n\nTedarikçi sana 'eski stok ucuz boya' önerse ne dersin?"`,
choices:[
{text:"AFS uygunluk sertifikasını ve teknik veri sayfasını isterim",tag:"akilli",effect:{bilgi:14,sayginlik:10}},
{text:"Ucuzsa şirket karar verir der geçerim",tag:"korkak",effect:{bilgi:-6,sayginlik:-7}},
{text:"Önce 1. Zabiti ve teknik ofisi bilgilendiririm",tag:"itaatkar",effect:{bilgi:8,sayginlik:7}}]},

{id:"s70",gfx:"bridge",alert:false,day:"Gün 9",time:"15:00",loc:"Süvari Kamarası — Evrak Masası",sub:"Charter Party ve işletme modeli",who:"suvari",
text:`Süvari masadaki dosyaları gösterdi.\n\n"Denizde sadece seyir yok; kontrat da var. Time Charter, Voyage Charter, Bareboat Charter farklı şeyler.\n\nTime Charter'da ticari emir charterer'dan gelir ama geminin nautik emniyeti yine kaptandadır. Bareboat'ta işletme neredeyse tamamen kiracıya geçer.\n\nSana soruyorum: hangisinde ticari kontrol daha yoğundur?"`,
choices:[
{text:"Time Charter ile Bareboat farkını açıklayıp Bareboat'ta işletme kontrolünün çok daha geniş olduğunu söyle",tag:"akilli",effect:{bilgi:15,sayginlik:10}},
{text:"'Hepsi aynı kiralama' de",tag:"korkak",effect:{bilgi:-8,sayginlik:-8}},
{text:"Voyage ile Time Charter'ın yük ve rota etkisini ayırarak cevap ver",tag:"cesur",effect:{bilgi:10,sayginlik:8,cesaret:4}}]},

{id:"s71",gfx:"bogaz",alert:false,day:"Gün 6",time:"12:00",loc:"İstanbul Boğazı — Transit",sub:"Montreux ve boğaz geçiş rejimi",who:"z2",
text:`2. Zabiti boğaz geçiş evraklarını kapattı.\n\n"Montreux deyince herkes savaş gemisini hatırlar. Ama ticaret gemileri için de geçiş rejiminin omurgası odur. Bildirim, pilotaj uygulaması, trafik düzeni, egemenlik alanı.\n\nPeki bu bizim günlük işimize nasıl yansır?"`,
choices:[
{text:"'Boğaz geçişinde yerel trafik rejimine ve otorite talimatlarına uymamızı gerektirir' de",tag:"akilli",effect:{bilgi:13,sayginlik:10}},
{text:"'Sadece askeri gemileri ilgilendirir' de",tag:"korkak",effect:{bilgi:-7,sayginlik:-7}},
{text:"'Ticaret gemisi olarak serbest geçiş hakkımız var ama emniyet düzeni devam eder' de",tag:"itaatkar",effect:{bilgi:9,sayginlik:7}}]},

{id:"s72",gfx:"harbor",alert:false,day:"Gün 10",time:"08:30",loc:"Ro-Ro Terminali Yanı",sub:"Atina Sözleşmesi ve yolcu bagaj sorumluluğu",who:"z3",
text:`Limanın yan iskelesinde bir yolcu feribotu yanaşıyor. 3. Zabiti sana işaret etti.\n\n"Biz yük gemisiyiz ama deniz hukukunu parça parça öğreneceksin. Atina Sözleşmesi, yolcu ve bagaj zararında taşıyanın sorumluluğunu düzenler.\n\nFeribotta bir yolcu yaralansa veya bagajı kaybolsa mesele sadece nezaket olmaz; hukuki sorumluluk doğar.\n\nSence bu niye önemli?"`,
choices:[
{text:"Taşıyanın sorumluluğu, tazminat ve yolcu haklarını belirlediği için de",tag:"akilli",effect:{bilgi:12,sayginlik:9}},
{text:"'Yolcu gemilerini ilgilendirir, bize uzak' de",tag:"korkak",effect:{bilgi:-5,sayginlik:-4}},
{text:"'Farklı gemi tiplerinde farklı hukuk rejimlerini bilmek denizciyi güçlendirir' de",tag:"sosyal",effect:{bilgi:9,sayginlik:9}}]},

{id:"s73",gfx:"bridge",alert:false,day:"Gün 11",time:"18:00",loc:"Köprüüstü — Akşam Brifingi",sub:"SOLAS ve ISM ilişkisi",who:"suvari",
text:`Süvari akşam brifinginde gemi klasörünü açtı.\n\n"SOLAS sana neyi yapman gerektiğini söyler; ISM ise bunun gemide nasıl yönetileceğini düzene koyar. Checklist, raporlama, near-miss, iç tetkik, emniyet kültürü.\n\nBir emniyet aksaklığı gördüğünde susmak mı sadakat, bildirmek mi profesyonellik?"`,
choices:[
{text:"Bildirmek profesyonelliktir; emniyet yönetimi sessizlikle yürümez de",tag:"kritik",effect:{bilgi:14,sayginlik:12,cesaret:7}},
{text:"Önce arkadaşını korumak gerekir de",tag:"korkak",effect:{bilgi:-7,sayginlik:-8}},
{text:"Önce amire söyler, prosedürle ilerlerim de",tag:"itaatkar",effect:{bilgi:8,sayginlik:8}}]},

{id:"s74",gfx:"harbor",alert:false,day:"Gun 12",time:"06:30",loc:"Kuru Havuz Girisi",sub:"Geminin suyu bosaltiliyor",who:"z1",
text:`1. Zabiti seni kuru havuz planina goturdu.

"Bugun gemi karaya oturacak gibi gorunecek ama kontrollu bir operasyon bu. Bloklarin ustune tam oturmazsa govde zarar gorur.

Stajyer gozlem yapar, not alir, acele etmez. Ilk neye bakarsin?"`,
choices:[
{text:"Iskele-sancak oturusunu, draft farkini ve blok hizasini izlerim",tag:"akilli",effect:{bilgi:14,sayginlik:10}},
{text:"Fotograf cekip sadece uzaktan izlerim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Bu sadece tersane isi diye dusunur gecerim",tag:"korkak",effect:{bilgi:-6,sayginlik:-5}}]},

{id:"s75",gfx:"cargo",alert:false,day:"Gun 12",time:"10:00",loc:"Kuru Havuz - Karina Alti",sub:"Sac kalinligi ve deniz sandigi kontrolu",who:"lostromo",
text:`Kuru havuzda geminin karinasini ilk kez tam goruyorsun. Lostromo saci tokmakla yokladi.

"Boya ustu guzel olabilir ama asil hikaye burada. Pitting, sac incelmesi, deniz sandigi izgara durumu, anot erimesi.

Neyi once rapora yazarsin?"`,
choices:[
{text:"Anot, deniz sandigi, pas cepleri ve sac incelmesini onceliklendiririm",tag:"akilli",effect:{bilgi:15,sayginlik:11}},
{text:"Boya rengini ve genel gorunusu yazarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:3}},
{text:"Govde saglam gorunuyor deyip gecistiririm",tag:"korkak",effect:{bilgi:-7,sayginlik:-6}}]},

{id:"s76",gfx:"engine",alert:false,day:"Gun 12",time:"13:30",loc:"Kuru Havuz - Pervane ve Dumen",sub:"Pervane kanadi ve rudder clearence olcumu",who:"carkci",
text:`Carkcibasi seni pervane tarafina cagirdi.

"Denizdeyken bunu bu kadar net goremezsin. Pervane kanadinda deformasyon, rudder boslugu, stern tube sizintisi izi... hepsi burada ortaya cikar.

Bir anormallik gorursen ne yaparsin?"`,
choices:[
{text:"Olcuyu teyit eder, fotografla kayda alir, amire bildiririm",tag:"kritik",effect:{bilgi:14,sayginlik:12,cesaret:5}},
{text:"Once ustalara sorar, sonra not alirim",tag:"itaatkar",effect:{bilgi:8,sayginlik:6}},
{text:"Kucuk bir izdir deyip onemsemem",tag:"korkak",effect:{bilgi:-8,sayginlik:-7}}]},

{id:"s77",gfx:"bridge",alert:false,day:"Gun 12",time:"16:00",loc:"Kuru Havuz - Tersane Toplantisi",sub:"Hot work permit ve emniyet zinciri",who:"z3",
text:`3. Zabiti tersane ekibiyle permit toplantisinda.

"Kuru havuzda en buyuk hata, tersane calismasini normal liman isi sanmaktir. Sicak is izni, gaz olcumu, izole hatlar, confined space kontrolu... biri atlanirsa yangin cikar.

Sana permit dosyasini uzatsam ilk neyi kontrol edersin?"`,
choices:[
{text:"Gaz olcumu, izolasyon, yangin nobetcisi ve izin saatini kontrol ederim",tag:"kritik",effect:{bilgi:15,sayginlik:12,cesaret:4}},
{text:"Imzalar tam mi diye ustten bakarim",tag:"itaatkar",effect:{bilgi:6,sayginlik:5}},
{text:"Tersane ekibi biliyordur deyip karismam",tag:"korkak",effect:{bilgi:-7,sayginlik:-8}}]},

{id:"s78",gfx:"harbor",alert:false,day:"Gun 5",time:"07:15",loc:"Liman - Acente Ofisi",sub:"PSC oncesi evrak hazirligi",who:"z1",
text:`1. Zabiti klasorleri masaya yaydi.

"Bugun PSC cikabilir. Sertifikalar, Crew List, Muster List, Last Port Clearance, Garbage Record Book, Oil Record Book, drill kayitlari... hepsi duzgun olacak.

Stajyer dedigin burada da is gorur. Su klasorde ilk neyi kontrol edersin?"`,
choices:[
{text:"Sertifika gecerlilik tarihleri ve imza eksiklerini bastan tararim",tag:"akilli",effect:{bilgi:14,sayginlik:10}},
{text:"Klasorleri tarih sirasina dizer, sonra zabite sorarim",tag:"itaatkar",effect:{bilgi:8,sayginlik:7}},
{text:"Nasil olsa zabit bakar diye geri cekilirim",tag:"korkak",effect:{sayginlik:-6,bilgi:-5}}]},

{id:"s79",gfx:"bridge",alert:false,day:"Gun 5",time:"09:40",loc:"Kaptan Kosku - Evrak Masasi",sub:"Oil Record Book ve Garbage Record Book",who:"z3",
text:`3. Zabiti iki defteri acti.

"PSC memuru cogu zaman once gemiye degil kayda bakar. Tarih, saat, operasyon tipi, imza, tank numarasi... bir satir hataliysa butun ekip terler.

Su iki kayittan biri uyumsuz. Ne yaparsin?"`,
choices:[
{text:"Uyumsuz satiri isaretler, zabite hemen bildirir, resmi duzeltme prosedurunu sorarim",tag:"kritik",effect:{bilgi:15,sayginlik:12,cesaret:4}},
{text:"Sessizce not alir, memur gelmeden once tekrar kontrol isterim",tag:"akilli",effect:{bilgi:10,sayginlik:8}},
{text:"Kucuk yazim hatasidir diye onemsemem",tag:"korkak",effect:{bilgi:-7,sayginlik:-8}}]},

{id:"s80",gfx:"harbor",alert:true,day:"Gun 5",time:"11:10",loc:"Gangway - PSC Boarding",sub:"Port State Control memuru gemiye cikti",who:"suvari",
text:`Acente telsizden haber verdi: "PSC geliyor."

Bir dakika sonra memur gangway'den cikti. Sert bakisli, kisa konusuyor. Suvari sakin.

"Stajyer, sen de kal. Gerekirse evrak getirirsin."

PSC memuru ilk sorusunu sordu: "Fire drill records? Last abandon ship drill? OWS familiarization?"`,
choices:[
{text:"Istenen klasorleri hizlica bulur, dogru sirayla masaya koyarim",tag:"kritik",effect:{sayginlik:15,bilgi:12,cesaret:5}},
{text:"Once 3. Zabiti'ye gozle sorar, onun isaretiyle hareket ederim",tag:"itaatkar",effect:{sayginlik:7,bilgi:6}},
{text:"Panik olur, yanlis klasoru getiririm",tag:"korkak",effect:{sayginlik:-10,bilgi:-6}}]},

{id:"s81",gfx:"bridge",alert:false,day:"Gun 5",time:"11:45",loc:"Kopruustu - PSC Sorgusu",sub:"Acil haberlesme ve drill kaydi kontrolu",who:"z3",
text:`PSC memuru GMDSS paneline bakti.

"Last weekly VHF test? DSC routine test? Emergency battery log? Show me."

3. Zabiti sana dondu: "Simdi sakin kalip dogru logu bulman lazim."`,
choices:[
{text:"GMDSS test kayitlarini, batarya logunu ve haftalik test satirlarini birlikte cikaririm",tag:"akilli",effect:{bilgi:14,sayginlik:11}},
{text:"Once GMDSS klasorunu verip kalan loglari zabite danisirim",tag:"itaatkar",effect:{bilgi:8,sayginlik:7}},
{text:"Testler yapilmistir diye sozlu gecistirmeye calisirim",tag:"korkak",effect:{bilgi:-8,sayginlik:-9}}]},

{id:"s82",gfx:"fire",alert:false,day:"Gun 6",time:"15:30",loc:"Muster Istasyonu - Tatbikat Hazirligi",sub:"Abandon ship drill briefingi",who:"z3",
text:`3. Zabiti can filikasi istasyonunda ekibi topladi.

"Tatbikat basliyor. Alarm, muster, kisi sayimi, can yele?i kontrolu, filika hazirligi. Kagit ustunde kolay; karisiklik cikinca herkes birbirine bakar."

Sana gorev verdi: "Muster listesi ve kisi sayimini sen teyit edeceksin."`,
choices:[
{text:"Isim isim sayim yapar, eksik kisiyi hemen isaretlerim",tag:"kritik",effect:{bilgi:14,sayginlik:12,cesaret:5}},
{text:"Listeyi takip eder, emin olmadigimda tekrar sayarim",tag:"akilli",effect:{bilgi:10,sayginlik:8}},
{text:"Kalabaliga bakip tamam sanirim derim",tag:"korkak",effect:{sayginlik:-9,bilgi:-6}}]},

{id:"s83",gfx:"compass",alert:true,day:"Gun 6",time:"16:10",loc:"Kopruustu - Acil Haberlesme",sub:"PAN-PAN / MAYDAY ayrimi",who:"suvari",
text:`Suvari seni VHF basina cagirdi.

"Tatbikat sorusu: Makine var, dumen var, gemi yuzuyor; ama tayfalardan biri ciddi yarali ve tahliye gerekebilir. Hangi cagri onceligini dusunursun? PAN-PAN mi, MAYDAY mi?

Yanlis cagri gereksiz kaos yaratir. Dogru cagri hayat kurtarir."`,
choices:[
{text:"Durumu degerlendirir, hayati ama gemi batmiyorsa once PAN-PAN Medical dusunurum derim",tag:"kritik",effect:{bilgi:15,sayginlik:12,cesaret:4}},
{text:"Once zabitten teyit ister, sonra cagriyi tekrarlarim",tag:"itaatkar",effect:{bilgi:8,sayginlik:7}},
{text:"Her acilde direkt MAYDAY basarim derim",tag:"korkak",effect:{bilgi:-8,sayginlik:-8}}]},

{id:"s84",gfx:"engine_fault",alert:true,day:"Gun 7",time:"18:20",loc:"Makine Dairesi - Blackout Drill",sub:"Tam guc kaybi ve ic haberlesme",who:"bas2",
text:`Blackout drill basladi. Bir anda isiklar sondu.

2. Basmakinist karanlikta bagirdi: "Emergency generator devreye girecek. Kopruyle ic haberlesme kopmasin. Saat tut, olay sirasini kaydet!"

Karanlikta duzen bozulursa tatbikat bile gercek kazaya doner.`,
choices:[
{text:"Saat, alarm sirasi, emergency generator devreye giris suresi ve haberlesmeyi loglarim",tag:"kritik",effect:{bilgi:15,sayginlik:12,cesaret:5}},
{text:"Once isik gelmesini bekler, sonra not tutarim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Karanlikta afallar, neyi izleyecegimi kaybederim",tag:"korkak",effect:{sayginlik:-9,bilgi:-7}}]},

{id:"s65",gfx:"sea",alert:false,day:"Gün 13",time:"10:00",loc:"Açık Deniz — Son Seyir",sub:"Silici ile veda sohbeti",who:"silici",
text:`Silici Ramazan güverteyi son kez siliyordu.\n\n"${n}, yarın İzmir'e giriyoruz. Sen de ineceksin.\n\nSana şunu söyleyeyim: Gemide en zor şey ayrılmak. Her seferinde yeni insanlar, yeni gemi. Ama bir şey değişmez — deniz aynı deniz.\n\nTekrar gelecek misin?"`,
choices:[
{text:"'Evet, kesinlikle' de — kararın açık",tag:"cesur",effect:{cesaret:8,sayginlik:10}},
{text:"'Henüz bilmiyorum ama bu yolculuk beni etkiledi' de",tag:"akilli",effect:{sayginlik:8,bilgi:5}},
{text:"Gülerek 'Bakacağız' de",tag:"sosyal",effect:{sayginlik:7}}]},

{id:"kriz16",gfx:"storm",alert:true,day:"Gün 7",time:"05:00",loc:"Güverte — Fırtınada Halat Kopması",sub:"Beaufort 10 — güverte halatı koptu",who:"lostromo",
text:`Fırtına doruk noktasında. Lostromo radyoda:\n\n"Pruva sol bağlantı halatı koptu! Konteyner kayma riski var. Güverteye çıkmak yasak ama müdahale şart.\n\n${n} — sen emniyet halatın var. Gönüllü var mı?"\n\nSessizlik.`,
choices:[
{text:"'Ben giderim' — emniyet halatını tak, güverteye çık",tag:"kritik",effect:{cesaret:18,sayginlik:15,dinclik:-15}},
{text:"'Deneyimli birisi gitmeli' de — haklısın",tag:"akilli",effect:{sayginlik:5,cesaret:-3}},
{text:"Gözleri kaçır",tag:"korkak",effect:{sayginlik:-15,cesaret:-12}}]},

{id:"kriz17",gfx:"bogaz",alert:true,day:"Gün 5",time:"14:00",loc:"İstanbul Boğazı — Karşıdan Gemi",sub:"VHF iletişimi — çarpışma riski",who:"suvari",
text:`İstanbul Boğazı, en dar nokta. Karşıdan büyük tanker geliyor.\n\nSüvari:\n"Dar kanal. COLREG 9 unutulmayacak: sancak sınırına yakın kal, geçişi engelleme. Tanker VHF 16'dan çağırıyor — İngilizce konuşuyor. Radyoya kim girecek?"\n\nHerkes sessiz. Süvari ${n}'ye baktı.`,
choices:[
{text:"'Ben girerim' — radyoya atla, İngilizce konuş",tag:"kritik",effect:{cesaret:15,sayginlik:15,bilgi:8}},
{text:"'İngilizcem yeterli değil' de — dürüst",tag:"itaatkar",effect:{sayginlik:3,cesaret:-5}},
{text:"Süvariye yardım teklif et, o konuşsun",tag:"akilli",effect:{sayginlik:7,bilgi:5}}]},


{id:"kriz18",gfx:"cabin",alert:true,day:"Gün 6",time:"02:00",loc:"Tayfa Kabini — ACİL",sub:"Tayfa Musa ciddi hastalandı — gemi doktoru yok",who:"musa",
text:`Gece 02:00. Kapı çalındı.\n\nTayfa Musa yatakta, yüzü sarı, ateş 39.5.\n\n3. Zabiti:\n"${n}, sen ilk yardım eğitimi gördün. Şüpheli karın ağrısı — apandisit olabilir. En yakın liman 18 saat. Köprüyle radyo bağlantısı var.\n\nSen ne yaparsın?"`,
choices:[
{text:"Vital bulguları al, köprüdeki tıbbi kit prosedürünü aç, radyoyla kıyı doktorunu ara",tag:"kritik",effect:{cesaret:12,sayginlik:15,bilgi:10}},
{text:"3. Zabiti'yi ara, o halletsin",tag:"itaatkar",effect:{sayginlik:5,bilgi:5}},
{text:"Ateş düşürücü ver ve bekle",tag:"korkak",effect:{sayginlik:-5,bilgi:-3}}]},

{id:"kriz19",gfx:"cargo",alert:true,day:"Gün 5",time:"16:30",loc:"Ambar 2 — Kaçak Yolcu",sub:"Ambarda insan bulundu — ISPS ihlali",who:"z1",
text:`Güverte turu sırasında Tayfa Hasan ambarda birini buldu.\n\nGenç bir adam — Suriyeli, İngilizce bilmiyor. Korkmuş, aç.\n\n1. Zabiti:\n"${n}, sen ISPS eğitimini gördün. Prosedür nedir? Süvariyi habersiz bırakamayız — bu uluslararası suç."`,
choices:[
{text:"Süvariyi ve 1. Zabiti'yi haber ver, ISPS protokolünü başlat",tag:"akilli",effect:{bilgi:14,sayginlik:12,cesaret:5}},
{text:"Adamı önce dinle, sonra karar ver",tag:"sosyal",effect:{sayginlik:8,bilgi:5}},
{text:"Görmedim de, devam et",tag:"korkak",effect:{sayginlik:-15,bilgi:-8}}]},

{id:"kriz20",gfx:"engine",alert:true,day:"Gün 9",time:"08:00",loc:"Köprüüstü — Yakıt Krizi",sub:"Yakıt hesabı yanlış — en yakın limana?",who:"suvari",
text:`Süvari sesi gergin:\n\n"Yakıt hesabı hatası. Mevcut yakıt planlanan rotayı tamamlamaya yetmeyecek — 340 ton açık var.\n\nİki seçenek: Cenova'yı atlayıp doğrudan Barselona'ya git, yakıt al. Ya da Cenova'ya git ama hız düşür — %60 güçte.\n\n${n}, sen ne düşünürsün?"`,
choices:[
{text:"'Her iki rotanın yakıt hesabını yapayım, rakamla konuşalım' de",tag:"akilli",effect:{bilgi:15,sayginlik:12}},
{text:"'Cenova'yı atlayalım, güvenli' de",tag:"cesur",effect:{cesaret:5,sayginlik:5}},
{text:"'Süvari bilir en iyisini' de",tag:"korkak",effect:{sayginlik:-5,cesaret:-3}}]},

{id:"kriz21",gfx:"storm",alert:true,day:"Gün 7",time:"13:00",loc:"Ambar 3 — Yük Kayması",sub:"Fırtınada ağır konteynerler kaydı — dengesizlik",who:"z1",
text:`Fırtına sırasında alarm çaldı.\n\n1. Zabiti:\n"Ambar 3'te yük kayması! Gemi 8 derece sancak yatık. Dengesizlik artarsa devrilme riski var.\n\nKarşı tarafa balast suyu basıyoruz — ama ambar 3'ün kapısını da kontrol etmek lazım.\n\n${n}! Seninle gidiyorum. Hazır mısın?"`,
choices:[
{text:"'Hazırım' — emniyet halatını tak ve git",tag:"kritik",effect:{cesaret:15,sayginlik:15,dinclik:-12}},
{text:"'Deneyimli biri daha güvenli' de",tag:"akilli",effect:{sayginlik:3,cesaret:-5}},
{text:"Git ama eline geçen şeyi tut",tag:"cesur",effect:{cesaret:10,sayginlik:8,dinclik:-8}}]},

{id:"kriz22",gfx:"sea",alert:true,day:"Gün 10",time:"07:30",loc:"Açık Deniz — SOS Kurtarma",sub:"Yakın mesafede SOS — küçük tekne",who:"suvari",
text:`Radar alarm verdi. SOS sinyali: 3.2 mil güneyde.\n\nSüvari radarı inceledi:\n"Küçük tekne — 8 metrelik yelkenli. DSC sinyali sürüyor.\n\nBölgeye gittiğimizde tahminen 45 dakika gecikiriz. Şirket onayı lazım ama hayat tehlikesi öncelikli.\n\n${n}, şu an VHF'desin. Deniz Kuvvetleri'ni ara."`,
choices:[
{text:"VHF'ye atla: 'SECURITE — SAR kurtarma olayı, koordinatlar...' de",tag:"kritik",effect:{cesaret:15,sayginlik:15,bilgi:10}},
{text:"Süvariyi kaptana bağla, o konuşsun",tag:"itaatkar",effect:{sayginlik:5,bilgi:5}},
{text:"Sahil güvenlik zaten duymuştur diye devam et",tag:"korkak",effect:{sayginlik:-15,cesaret:-10}}]},

...createStabilityScenes(n,sn),

{id:"s103",gfx:"bridge",alert:false,day:"Gun 8",time:"10:40",loc:"Suvari Kamarasi - Evrak Masasi",sub:"Notice of Readiness nedir?",who:"suvari",
text:`Suvari dosyayi kapatip sana baktı.

"Stajyer, Notice of Readiness nedir? Limana geldik diye her zaman kendiliginden sayilmaz. Yuk operasyonu ve laytime burada baslar."

Kaptan bekliyor. Cevabin?"`,
choices:[
{text:"Geminin yuklemeye veya tahliyeye hazir oldugunu charter tarafa resmi bildiren evraktir derim",tag:"kritik",effect:{bilgi:15,sayginlik:12}},
{text:"Limanin gemiye pilot verdigini gosteren kagittir derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Sadece acentenin ic yazismasidir diye gecistiririm",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s104",gfx:"cargo",alert:false,day:"Gun 8",time:"11:25",loc:"Yuk Ofisi",sub:"Konisimento / Bill of Lading sorgusu",who:"suvari",
text:`Suvari bu kez konisimentoyu masaya koydu.

"Peki konisimento nedir? Sadece bir kagit dersen olmaz. Yuk makbuzu mudur, tasima sozlesmesi midir, mulkiyetle iliskisi var midir?"

Tek cümlede kurtaramazsin; ozunu soyle."`,
choices:[
{text:"Yuk makbuzu, tasima sozlesmesinin delili ve ciroyla devredilebilen belge niteliği tasir derim",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
{text:"Sadece gumruk kagididir derim",tag:"itaatkar",effect:{bilgi:4,sayginlik:3}},
{text:"Manifestoyla ayni seydir diye cevaplarim",tag:"korkak",effect:{bilgi:-10,sayginlik:-8}}]},

{id:"s105",gfx:"bridge",alert:false,day:"Gun 8",time:"12:10",loc:"Suvari Kamarasi - Evrak Dersi",sub:"Mate's Receipt, manifest ve NOR farklari",who:"suvari",
text:`Kaptan kalemiyle uc belgeyi ayirdi.

"Mate's Receipt, cargo manifest ve Notice of Readiness. Bunlari birbirine karistiran adam limanda kendi ayagina kursun sikar."

Hangisini nasil ayirirsin?"`,
choices:[
{text:"Mate's Receipt teslim alinan yuk kaydi, manifest toplu yuk listesi, NOR ise operasyon hazirlik bildirimi derim",tag:"kritik",effect:{bilgi:15,sayginlik:11}},
{text:"Manifest ile NOR ayni, Mate's Receipt ise gemi ici not derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Hepsi yuk evraki, fark etmez diye gecistiririm",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s309",gfx:"bridge",alert:false,day:"Gun 8",time:"12:45",loc:"Suvari Kamarasi - NOR Taslagi",sub:"NOR ne zaman verilir, ne zaman tartisma cikar?",who:"suvari",
text:`Suvari NOR taslagini acip saati isaret etti.

"Geminin limana gelmesi yetmez. Hazir olma hali, free pratique, customs, berth condition ve charter party dili birlikte okunur. NOR'u yanlis anda verirsen laytime kavgasini kendin acarsin."

Sence en profesyonel tutum hangisi?`,
choices:[
{text:"Geminin fiilen hazirlik durumunu, charter party sartlarini ve liman formalitelerini birlikte teyit ederim",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
{text:"Rihitma yanaşır yanasmaz NOR veririm, sonra bakariz derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"NOR saatinin onemi yoktur diye dusunurum",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s310",gfx:"harbor",alert:false,day:"Gun 8",time:"14:10",loc:"Acenta Ofisi - Statement of Facts",sub:"SOF nasil dogru tutulur?",who:"z1",
text:`Acenta SOF satirlarini bir bir sayiyordu.

"All fast, notice tendered, hose connected, rain stop, hatch open, surveyor onboard... Bunlar sadece not degil; yarin tartisma cikarsa hafiza yerine gececek satirlar."

Neyi savunursun?`,
choices:[
{text:"Saatleri logbook, operasyon akisi ve tanik olaylarla uyumlu sekilde yazarim",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
{text:"Yuvarlak saatlerle de idare edilir derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"SOF'u acenta ne yazarsa oyle birakirim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s311",gfx:"cargo",alert:false,day:"Gun 8",time:"15:25",loc:"Yuk Ofisi - Mate's Receipt",sub:"Mate's Receipt'e hangi cekince dusulur?",who:"z1",
text:`Yukten bir kisim islak ve ambalaji zayif gorunuyordu. 1. Zabiti sana bakti.

"Mate's Receipt temiz yazildi mi, cekinceli mi yazildi; bazen butun dosyanin tonu degisir. Gordugunu dogru yazmazsan sonra daha buyuk kagitlar yanlis uzerine kurulur."

Ne yaparsin?`,
choices:[
{text:"Gordugum hasari veya supheli durumu acik ve tarafsiz cekince olarak kayda gecerim",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
{text:"Teslim alinsin da sonra bakariz diye temiz receipt dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Mate's Receipt'e ayrinti yazmanin gereksiz oldugunu sanirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},

{id:"s312",gfx:"cargo",alert:false,day:"Gun 8",time:"16:20",loc:"Yuk Ofisi - Cargo Manifest",sub:"Manifest ile fiili yuk uyumu",who:"suvari",
text:`Suvari manifesti stowage planiyla yan yana koydu.

"Manifest kagit, yuk gercek. Tehlike, miktar, paket, container no, hold dagilimi ve bazen DG ayrimi burada uyusacak. Biri digerini sadece kabaca andiriyorsa yetmez."

Hangi kontrol daha saglam?`,
choices:[
{text:"Manifesti stowage plani, fiili yuk ve ozel notlarla capraz kontrol ederim",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
{text:"Toplam ton tutuyorsa manifest yeterlidir derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Manifest sadece gumruge giden kagit diye dusunurum",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s313",gfx:"storm",alert:true,day:"Gun 9",time:"18:40",loc:"Kaptan Kosku - Sea Protest",sub:"Hangi durumda sea protest dusunulur?",who:"suvari",
text:`Kaptan kotu hava, gecikme ve liman tartismasi notlarini masaya yaydi.

"Sea protest her canin istediginde yazilan dramatik kagit degil. Kotu hava, zorlayici deniz, gecikme veya hasar ihtimalinde ileride hak kaybini onlemek icin dusunulur."

Sence dogru refleks ne olur?`,
choices:[
{text:"Olayin niteligini, hava/seyir kayitlarini ve ileride dogabilecek hak ihtilafini birlikte degerlendiririm",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
{text:"Gecikme varsa otomatik sea protest yazariz derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Sea protest'in artik onemsiz oldugunu dusunurum",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},

{id:"s314",gfx:"bridge",alert:true,day:"Gun 9",time:"19:15",loc:"Kaptan Kosku - Letter of Protest",sub:"Letter of protest nasil ve ne icin verilir?",who:"suvari",
text:`Bu kez dosyada ton daha sertti.

"Terminal gecikmesi, shore ekipman aksagi, uygunsuz yukleme hizi, hasarli yuk teslimi... Bazen sadece jurnal yetmez; resmi itiraz kaydi gerekir. Letter of protest duygusal cikis degil, kontrollu resmi bildiridir."

Nasil ilerlersin?`,
choices:[
{text:"Somut olayi, saati, mahal ve itiraz konusunu net yazip resmi dille kayda gecerim",tag:"kritik",effect:{bilgi:17,sayginlik:13,cesaret:3}},
{text:"Sert bir sitem mektubu gibi yazar gecirim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Bu tur belgelerin gereksiz oldugunu dusunurum",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},

{id:"s106",gfx:"galley",alert:true,day:"Gun 9",time:"20:15",loc:"Yemekhane",sub:"Gemide kavga cikti",who:"asci",
text:`Yemekte bir anda sandalye geriye surttü. Guverte tayfasindan biri ile yagci sert sekilde tartismaya girdi.

Sesler buyuyor. Asci bile kasigini birakti. Herkes birbirine bakiyor.

Gemide kavga sadece gurultu degil; vardiya emniyetini de bozar. Ne yaparsin?"`,
choices:[
{text:"Taraf olmayip amire haber verir, ortamı sakince ayirmaya yardim ederim",tag:"kritik",effect:{sayginlik:14,cesaret:5,bilgi:6}},
{text:"Kendi bolumumden olana sessizce destek veririm",tag:"itaatkar",effect:{sayginlik:4}},
{text:"Laf atip kavgayi buyuturum",tag:"korkak",effect:{sayginlik:-12,dinclik:-5}}]},

{id:"s107",gfx:"cabin",alert:false,day:"Gun 9",time:"22:30",loc:"Koridor - Kamaralar",sub:"Kavga sonrasi ifade ve disiplin",who:"z1",
text:`Kavga dagildi ama is bitmedi. 1. Zabiti ifadeleri topluyor.

"Gemide huzur bozulursa yarin vardiyada bunun bedelini hepimiz oderiz. Goren ne gorduyse net soyleyecek."

Sana da ne gordugunu sordu."`,
choices:[
{text:"Abartmadan, tarafsiz ve kronolojik anlatirim",tag:"akilli",effect:{bilgi:10,sayginlik:12}},
{text:"Amir ne derse onu tekrar ederim",tag:"itaatkar",effect:{sayginlik:5,bilgi:4}},
{text:"Arkadasimi korumak icin gercegi egerim",tag:"korkak",effect:{sayginlik:-10,bilgi:-6}}]},

{id:"s107b",gfx:"cabin",alert:true,day:"Gun 10",time:"06:50",loc:"Koridor - Kamaralar",sub:"Gemide hirsizlik suphelesi",who:"z1",
text:`Sabah bir kamaradan sert bir ses geldi. Tayfalardan biri dolabindaki paranin ve kulakliginin kayip oldugunu soyluyor.

Koridorda hava bir anda gerildi. Herkes birbirine bakiyor ama kimse acik acik bir sey demiyor.

1. Zabiti seni gorunce kisik sesle konustu:

"Gemide hirsizlik suphelesi, sadece esya meselesi degil; ekip guveni meselesidir. Kimseyi gelisiguzel suclamayacagiz. Ne gorduysek kayda uygun ilerleyecegiz."

Sen nasil ilerlersin?`,
choices:[
{text:"Sakin kalir, gordugum-son duydugum ne varsa tarafsiz aktarir; amirin talimatiyla kontrollu ilerlerim",tag:"kritik",effect:{bilgi:16,sayginlik:14,cesaret:3}},
{text:"Koridorda duyduklarimi digerlerine de anlatip kimden suphelendigimi soylerim",tag:"itaatkar",effect:{sayginlik:3,bilgi:2}},
{text:"Hemen birini suclayip ustune giderim",tag:"korkak",effect:{sayginlik:-13,bilgi:-9,cesaret:-3}}]},

{id:"s108",gfx:"harbor",alert:true,day:"Gun 6",time:"13:20",loc:"Gangway - PSC Reinspection",sub:"Eksikler buyudu, detention ihtimali",who:"suvari",
text:`PSC memuru ikinci turda daha sert geldi.

"Drill kayitlari tutarsiz, bir emniyet ekipmani etiketsiz, bir prosedur personel tarafindan bilinmiyor. Bu haliyle detention degerlendirmesi masada."

Suvari sakin ama yuzü tas gibi. Senden ne ister?"`,
choices:[
{text:"Eksikleri ve duzeltici adimlari dosya halinde toparlar, memura net sirayla sunarim",tag:"kritik",effect:{bilgi:15,sayginlik:13,cesaret:4}},
{text:"Sadece istenen klasoru getirir, arka planda kalirim",tag:"itaatkar",effect:{bilgi:7,sayginlik:6}},
{text:"Memurun gozunden kacmasini umar, daginik davranirim",tag:"korkak",effect:{bilgi:-9,sayginlik:-10}}]},

{id:"s109",gfx:"harbor",alert:true,day:"Gun 6",time:"15:00",loc:"Rıhtım - Detention",sub:"Gemi limanda baglandi",who:"suvari",
text:`Karar aciklandi: detention.

Sefer durdu. Acentenin telefonu susmuyor. Sirket mail istiyor, liman bekliyor, herkesin omzuna agirlik bindi.

Suvari sana kisa baktı: "Bugun denizciligin sadece deniz olmadigini ogreniyorsun."`,
choices:[
{text:"Eksik listesi, sorumlu kisimlar ve kapanis sirasini not edip ekibe dagitirim",tag:"kritik",effect:{bilgi:14,sayginlik:12,cesaret:4}},
{text:"Verilen isi yapar, sessizce kosustururum",tag:"itaatkar",effect:{sayginlik:6,bilgi:5}},
{text:"Moral bozup kenara cekilirim",tag:"korkak",effect:{sayginlik:-8,dinclik:-6}}]},

{id:"s110",gfx:"compass",alert:false,day:"Gun 7",time:"09:20",loc:"Kopruustu - ECDIS Konsolu",sub:"Route check ve safety contour",who:"z2",
text:`2. Zabiti ECDIS route check ekranini acti.

"GPS nokta verir; ama seyri ECDIS ustunde akilla kurarsin. Safety depth, safety contour, no-go area ve isolated danger ayarlari bos is degil."

Sana sordu: route check'te once neye bakarsin?"`,
choices:[
{text:"Safety contour, cross track limit ve chart warning listesini birlikte kontrol ederim",tag:"kritik",effect:{bilgi:15,sayginlik:11}},
{text:"Sadece rotanin cizili olmasina bakarim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"GPS cizgisi varsa kalanina gerek yok derim",tag:"korkak",effect:{bilgi:-10,sayginlik:-8}}]},

{id:"s111",gfx:"compass",alert:false,day:"Gun 7",time:"17:10",loc:"Kopruustu - GPS Alarmi",sub:"GPS ile kağıt/visual cross-check",who:"z2",
text:`Bir anda GPS quality alarmi geldi. Pozisyon akiyor gibi.

2. Zabiti derin bir nefes aldi: "Iste simdi elektronik rahatlik bitti. Radar range, visual mark, echo sounder ve kagit harita dusuncesi geri gelir."

Ilk refleksin?"`,
choices:[
{text:"Pozisyonu ikinci kaynaklarla cross-check eder, ECDIS'e kor gibi guvenmem",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
{text:"GPS duzelir diye biraz beklerim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Alarmi susturup rota ayni diye devam ederim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s112",gfx:"bridge",alert:false,day:"Gun 10",time:"18:40",loc:"Kopruustu - Harita Duzeltmesi",sub:"Weekly chart correction",who:"z2",
text:`Masa kagit haritalarla dolu. 2. Zabiti elindeki Notice to Mariners'i salladi.

"Elektronik var diye kâğıt harita disiplini olmez. Duzeltme tarihi, correction number, yeni tehlike, yeni sığlık... hepsi tek tek islenir."

Sana bir not verdi. Ne yaparsin?"`,
choices:[
{text:"Notu ilgili haritaya isler, correction numarasini ve tarihi kayda gecerim",tag:"kritik",effect:{bilgi:15,sayginlik:11}},
{text:"Sadece haritanin kenarina ufak not dusup birakirim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"ECDIS varken buna gerek yok derim",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s112b",gfx:"bridge",alert:false,day:"Gun 10",time:"19:05",loc:"Chart Room",sub:"Kagit haritada correction tracing ve record tutma",who:"z2",
text:`2. Zabiti bu kez tracing kagidini ve correction record klasorunu onune koydu.

"Duzeltmeyi cizmek kadar nasil kaydettigin de onemli. Hangi chart, hangi kaynak, hangi correction number, hangi tarih... sonradan bakan zabit neyin ne zaman islendigini gorebilmeli."

Sence en dogru disiplin hangisi?`,
choices:[
{text:"Duzeltmeyi temiz isler, chart correction record'a numara ve tarih ile kaydederim",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
{text:"Haritada degisiklik gorunuyorsa ayri kayda cok gerek olmadigini dusunurum",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Tracing ve record isini gereksiz evrak kalabaligi sayarim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s112c",gfx:"ecdis_panel",alert:false,day:"Gun 10",time:"19:40",loc:"Kopruustu - ECDIS Admin",sub:"ENC update ve cell status kontrolu",who:"z2",
text:`Bu kez ECDIS update penceresi acildi.

"Elektronik harita da kendi kendine guncel kalmaz. Permit, cell status, latest update package, overdue area ve warning listesi birlikte kontrol edilir. 'Harita aciliyor' demek 'up to date' demek degildir."

Ne yaparsin?`,
choices:[
{text:"Cell status, permit, son update tarihi ve overdue alanlari birlikte kontrol ederim",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
{text:"Ekranda harita gorunuyorsa guncel kabul ederim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Alarm yoksa update ihtiyaci da yoktur diye dusunurum",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s112d",gfx:"compass",alert:false,day:"Gun 10",time:"20:05",loc:"Kopruustu - Rota Duzeltmesi",sub:"Kagit harita ve ECDIS'e birlikte isleme",who:"z2",
text:`Sonra rota degisikligi geldi. 2. Zabiti kalemi ve ECDIS plan ekranini ayni anda gosterdi.

"Iyi zabit duzeltmeyi tek yerde birakmaz. Passage plan, kagit harita, ECDIS route, ilgili notlar ve logbook birbirini tamamlar. Biri eski kalirsa hata sessizce buyur."

Dogru siralama hangisi?`,
choices:[
{text:"Rota degisikligini ECDIS, kagit harita, passage plan ve log kayitlarina tutarli sekilde islerim",tag:"kritik",effect:{bilgi:17,sayginlik:13}},
{text:"ECDIS'i guncelleyip kagit haritayi daha sonra halletmeyi yeterli gorurum",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Iki sistemden birinin guncel olmasi yeterlidir diye dusunurum",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},

{id:"s113",gfx:"sea",alert:false,day:"Gun 10",time:"06:50",loc:"Valensiya Aciklari",sub:"Farkli rota ve trafik plani",who:"suvari",
text:`Suvari yeni rotayi acikladı.

"Bu sefer Barselona yerine Valensiya aciklarindan asagi inip sonra Malta rotasina kiracagiz. Hava, trafik ve yakit bunu gerektiriyor."

Farkli rota, farkli risk demek. Ilk dusuncen ne olur?"`,
choices:[
{text:"Weather routing, trafik yogunlugu ve ETA etkisini birlikte degerlendiririm",tag:"akilli",effect:{bilgi:14,sayginlik:10}},
{text:"Suvari cizdiyse tamamdir derim",tag:"itaatkar",effect:{sayginlik:5,bilgi:4}},
{text:"Eski rotadan gitsek daha kolay olur diye diretirirm",tag:"korkak",effect:{sayginlik:-6,bilgi:-4}}]},

{id:"s114",gfx:"sea",alert:false,day:"Gun 11",time:"08:30",loc:"Malta Gecisi",sub:"Yeni rota, yeni raporlama disiplini",who:"z2",
text:`Malta gecisinde trafik yogun ama duzenli.

2. Zabiti plotter'a dokundu: "Her rota degisikligi sadece cizgi degildir; logbook, noon report, ECDIS annotation ve bazen charter bilgilendirmesi ister."

Bu degisiklikte neyi unutmazsin?"`,
choices:[
{text:"Logbook, rota degisikligi saati ve ilgili raporlamayi birlikte guncellerim",tag:"kritik",effect:{bilgi:14,sayginlik:11}},
{text:"Sadece rota cizgisine bakarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Resmi rapora gerek yok, herkes goruyor diye dusunurum",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s115",gfx:"cabin",alert:false,day:"Gun 12",time:"00:40",loc:"Stajyer Kabini",sub:"Aile ozlemi ve ic ses",who:"anlatici",
text:`Gece ilerledikce gemi sesi buyuyor, oda ise kuculuyor gibi.

Telefon ekrani karanlik. Mesaj yok. Bir an icinde kendi sesinle bas basa kaldin:

"Dayan diye geldin. Peki ne kadar dayanacaksin? Herkes uyuyor, sen neden bu kadar uzaksin?"

Icinden kendine ne dersin?`,
choices:[
{text:"'Bu da gecer. Sabah olunca isime tutunacagim' der, nefesimi duzenlerim",tag:"akilli",effect:{dinclik:8,cesaret:4}},
{text:"Musa'ya yazmayi dusunur, sonra vazgecmeden iki kelime atarim",tag:"sosyal",effect:{sayginlik:7,dinclik:5}},
{text:"'Burada ne isim var?' diye icime kapanirim",tag:"korkak",effect:{dinclik:-10,cesaret:-6}}]},

{id:"s116",gfx:"cabin",alert:false,day:"Gun 12",time:"23:55",loc:"Stajyer Kabini",sub:"Derin yalnizlik ve ic monolog",who:"anlatici",
text:`Aile fotogrfina uzun uzun baktin. Gemi bir yere gidiyor ama sen sanki icinde sabit kalmissin.

Ic sesin yine geldi:

"Herkes seni calisirken goruyor ama kimse ne kadar yoruldugunu bilmiyor. Eve donsen rahatlar misin, yoksa bunu yarim birakmak daha mi agir gelir?"

Bu gece o sesle nasil konusursun?`,
choices:[
{text:"'Bitirmeden donmeyecegim, ama yardim istemeyi de ogrenecegim' derim",tag:"kritik",effect:{cesaret:6,dinclik:6,sayginlik:4}},
{text:"Sessizce gunluk yazar, icimdekini kagida dokerim",tag:"akilli",effect:{bilgi:5,dinclik:7}},
{text:"Battaniyeyi cekip kimseyle konusmadan kapanirim",tag:"korkak",effect:{dinclik:-9,sayginlik:-5}}]},

{id:"s117",gfx:"cargo",alert:false,day:"Gun 7",time:"13:50",loc:"Ambar 3",sub:"Ambar temizleme isine talip olmak",who:"lostromo",
text:`Lostromo ambar agzinda asagi bakti.

"Yuk bosaldi ama is bitmedi. Toz, kirik palet parcasi, bag, pas, su birikintisi... biri inip el atacak."

Bir an sessizlik oldu. Sen one cikarsan herkes duyacak.`,
choices:[
{text:"'Ben inerim usta, ama once havalandirma ve emniyet kontrolunu yapalim' derim",tag:"kritik",effect:{cesaret:9,sayginlik:13,bilgi:8}},
{text:"Gorev verilirse yaparim diyerek beklerim",tag:"itaatkar",effect:{sayginlik:5,bilgi:4}},
{text:"Ses cikarmayip goz kaciririm",tag:"korkak",effect:{sayginlik:-8,cesaret:-6}}]},

{id:"s118",gfx:"pirate",alert:true,day:"Gun 8",time:"01:10",loc:"Yuksek Riskli Bolge Girisi",sub:"Savas/korsan bolgesi tedbirleri",who:"suvari",
text:`Suvari gece brifinginde kapilari gosterdi.

"Yuksek riskli bolgeye giriyoruz. ISPS seviyesi, citadel hazirligi, dis aydinlatma, razor wire, yangin hortumu, ekstra gozcü, AIS kullanimi... hepsi yeniden gozden gececek."

Sana gore ilk odak ne olmali?`,
choices:[
{text:"Citadel, erisim kontrolu, vardiya takviyesi ve acil haberlesme zincirini birlikte teyit ederim",tag:"kritik",effect:{bilgi:15,sayginlik:12,cesaret:5}},
{text:"Kapilar kapaliysa yeterli sanirim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Tehlike ciktiginda bakariz diye dusunurum",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s119",gfx:"pirate",alert:true,day:"Gun 8",time:"02:40",loc:"Ana GÃ¼verte - Aksaklik",sub:"Tedbir sirasinda ekipman sorunu",who:"z3",
text:`Ekstra tedbirler kurulurken sorun cikti: sancak taraftaki projektor biri acik kalmis, bir yangin hortumunun baglantisi da tam oturmamis.

3. Zabiti sertce dondu: "Tehdit bazen saldiran degil, hazirliktaki bosluktur."

Ne yaparsin?`,
choices:[
{text:"Aksakligi aninda rapor eder, dogru ekibi cagirir ve not alirim",tag:"kritik",effect:{bilgi:14,sayginlik:12,cesaret:4}},
{text:"Once kendi basima duzeltmeye calisir, sonra haber veririm",tag:"cesur",effect:{cesaret:5,sayginlik:4,bilgi:5}},
{text:"Baska biri gormustur diye karismam",tag:"korkak",effect:{bilgi:-8,sayginlik:-8}}]},

{id:"s120",gfx:"bridge",alert:false,day:"Gun 7",time:"10:05",loc:"Suvari Kamarasi - Evrak Kontrolu",sub:"Evrak hatasini fark edip bildirmek",who:"suvari",
text:`Klasor tasirken bir ayrinti gozune takildi: Statement of Facts saatleri ile logbook girislerinden biri uyusmuyor.

Bu kucuk gibi gorunen sey yarin ciddi soruya donebilir. Suvari baska evraga bakiyor; fark etmemis olabilir.

Ne yaparsin?`,
choices:[
{text:"Hemen sakin bir dille uyumsuzlugu gosterir, duzeltme prosedurunu sorarim",tag:"kritik",effect:{bilgi:15,sayginlik:13,cesaret:5}},
{text:"Once 1. Zabiti'ye soyleyip onunla suvariye cikarim",tag:"akilli",effect:{bilgi:10,sayginlik:9}},
{text:"Gormemis gibi davranirim",tag:"korkak",effect:{bilgi:-9,sayginlik:-10}}]},

{id:"s121",gfx:"harbor",alert:false,day:"Gun 6",time:"09:15",loc:"Gangway - ISPS Kontrol Noktasi",sub:"ISPS Code ziyaretci ve erisim kontrolu",who:"z3",
text:`Gangway'de bir karisiklik var. Liman iscilerinden biri ziyaretci listesinde yok ama aceleyle iceri girmek istiyor.

3. Zabiti seni durdurdu: "ISPS kodu bazen kibarca hayir diyebilmektir. Kimlik, liste, refakat ve kayit olmadan gecis olmaz."

Sen nasil hareket edersin?`,
choices:[
{text:"Kimlik ve liste kontrolu yapar, amire haber verir, kayitsiz gecise izin vermem",tag:"kritik",effect:{bilgi:15,sayginlik:12,cesaret:4}},
{text:"Bir ust gelene kadar sahsi gangway'de bekletirim",tag:"itaatkar",effect:{bilgi:8,sayginlik:7}},
{text:"Liman iscisi diye gecmesine goz yumarim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s122",gfx:"harbor",alert:true,day:"Gun 6",time:"18:10",loc:"Kic GÃ¼verte",sub:"ISPS seviyesi yukseliyor",who:"z3",
text:`Aksam uzeri limandan bildirim geldi: bolgede guvenlik olayi var, ISPS seviyesi gecici olarak yukseltiliyor.

Ekstra devriye, kisitli erisim ve ekipman sayimi isteniyor. Gemide hava hemen degisti.

Sana verilen ilk gorev?`,
choices:[
{text:"Erisim noktalarini, anahtar/kilit durumunu ve kritik alan sayimini kontrol ederim",tag:"kritik",effect:{bilgi:14,sayginlik:12,cesaret:4}},
{text:"Devriyeye katilir, ne dendigse onu not alirim",tag:"itaatkar",effect:{bilgi:7,sayginlik:6}},
{text:"Bu kadarina gerek yok diye soylenirim",tag:"korkak",effect:{bilgi:-7,sayginlik:-8}}]},

{id:"s123",gfx:"compass",alert:false,day:"Gun 5",time:"06:15",loc:"Kopruustu - Sabah Ufku",sub:"Sextant okuma pratiği",who:"z2",
text:`Gunes yeni dogarken 2. Zabiti sextant'i eline verdi.

"GPS var diye gokyuzu degersiz olmadi. Ufku sabit tut, aynayi indir, aciyi al, sonra saati not et. Hata burada aceleden dogar."

Ilk tavrin ne olur?`,
choices:[
{text:"Ufku sakin sabitler, aciyi tekrar alip zamanla birlikte kaydederim",tag:"kritik",effect:{bilgi:15,sayginlik:11}},
{text:"Bir kez okur, sonucu zabite teyit ettiririm",tag:"itaatkar",effect:{bilgi:7,sayginlik:5}},
{text:"Bu devirde buna gerek yok derim",tag:"korkak",effect:{bilgi:-8,sayginlik:-7}}]},

{id:"s124",gfx:"cargo",alert:false,day:"Gun 9",time:"16:20",loc:"VinÃ§ Operasyonu",sub:"Yuk ellecleme ve isaretlesme",who:"lostromo",
text:`VinÃ§ operasyonda. Sapanlar gergin, isaretler net olmak zorunda.

Lostromo sert ama sakindi: "Elleclemede en buyuk hata yarim bilgiyle el hareketi vermektir. Tag line, sling acisi, altina girmeme, stop komutu... hepsi bir dil."

Sana isaret istiyor.`,
choices:[
{text:"Yuku durdurur, alanin bos oldugunu teyit edip net ve dogru isaret veririm",tag:"kritik",effect:{bilgi:14,sayginlik:12,cesaret:4}},
{text:"Tecrübeli tayfayi izleyip aynisini tekrarlarim",tag:"itaatkar",effect:{bilgi:8,sayginlik:6}},
{text:"Emin olmadan el hareketi veririm",tag:"korkak",effect:{bilgi:-10,sayginlik:-10}}]},

{id:"s124b",gfx:"cargo",alert:true,day:"Gun 9",time:"16:45",loc:"Vinc Operasyonu - Ambar Ustu",sub:"Lifting sirasinda halat/sling kopuyor",who:"lostromo",
text:`Yuk havadayken bir anda kuru bir ses duyuldu. Slinglerden biri bosaldi, yuk yana sertce salindi ve guvertedeki herkes bir an dondu.

Lostromo bagirdi: "STOP! Kimse yuk altina girmesin. Alan bosaltilacak, ekip sayilacak, kimse kopan hatta yaklasmayacak."

Bu anda ilk ne yaparsin?`,
choices:[
{text:"Operasyonu durdurur, personeli yuk hattindan uzaklastirir ve olayi lostromo ile zabite net raporlarim",tag:"kritik",effect:{bilgi:16,sayginlik:14,cesaret:6}},
{text:"Kendi emniyetimi alir, emir gelene kadar kenarda beklerim",tag:"itaatkar",effect:{bilgi:7,sayginlik:5}},
{text:"Yuku elle sabitlemeye ya da kopan halata yaklasmaya calisirim",tag:"korkak",effect:{bilgi:-12,sayginlik:-12,cesaret:-5}}]},
{id:"s125",gfx:"bogaz",alert:false,day:"Gun 6",time:"21:40",loc:"Çanakkale Boğazı - Jurnal Masasi",sub:"Jurnale not dusmek",who:"z2",
text:`Bogaz geride kalirken kopruustu ilk kez biraz gevsedi. 2. Zabiti jurnal defterini sana uzatti.

"Saat, mevki, rota tamam. Bir satir da denizcinin kalbinden duser bazen."

Kalemi eline aldiginda icinden sadece bir cümle geldi: "Çanakkale Geçilmez."

Ne yaparsin?`,
choices:[
{text:"Resmi kaydi bozmadan jurnal notuna 'Çanakkale Geçilmez' diye duserim",tag:"sosyal",effect:{sayginlik:10,dinclik:4,bilgi:3}},
{text:"Sadece resmi seyir kaydini yazar, icimde tutarim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Boyle seyler gereksiz deyip gecistiririm",tag:"korkak",effect:{sayginlik:-5,dinclik:-3}}]},

(()=>{const alt=58+Math.floor(Math.random()*9);const dec=16+Math.floor(Math.random()*7);const lat=(90-alt)+dec;return {id:"s126",gfx:"compass",alert:false,day:"Gun 5",time:"12:05",loc:"Kopruustu - Noon Sight",sub:"Sextant ile yaklasik enlem hesabi",who:"z2",
text:`2. Zabiti noon sight notunu onune koydu.\n\n"Gunes meridyen gecisinde sextant altitude ${alt}°. Gunluk deklinasyon ${dec}° Kuzey.\n\nBasit yaklasimla latitude = 90 - altitude + declination. Bana yaklasik enlemi soyle."\n\nKagit sende.`,
choices:[
{text:`Yaklasik ${lat}° Kuzey`,tag:"kritik",effect:{bilgi:16,sayginlik:12}},
{text:`Yaklasik ${lat+8}° Kuzey`,tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"GPS varken bu hesapla ugrasmaya gerek yok",tag:"korkak",effect:{bilgi:-10,sayginlik:-8}}
]};})(),


{id:"s127",gfx:"harbor",alert:true,day:"Gun 6",time:"19:10",loc:"Suvari Kamarasi - ISPS Maili",sub:"Security breach sonrasi resmi rapor",who:"suvari",
text:`Security olayi buyuyunce bu kez is gemi icinde kalmadi. Suvari ekrani sana cevirdi.

"Company Security Officer rapor istiyor. Olay saati, erisim noktasi, kimlik eksigi, alinmis aksiyon, duzeltici onlem. ISPS'te soz ucmuyor; kayit kaliyor."

Sana taslak actiriyor. Ilk satira ne girersin?`,
choices:[
{text:"Olay zamani, yer, ihlal tipi ve alinan acil aksiyonu net ve kronolojik yazarim",tag:"kritik",effect:{bilgi:15,sayginlik:12}},
{text:"Genel bir ozet gecip ayrintiyi sonra dusunurum",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Sorun buyumesin diye metni yumusatirim",tag:"korkak",effect:{bilgi:-9,sayginlik:-9}}]},

(()=>{const lat=28+Math.floor(Math.random()*8);const lon=12+Math.floor(Math.random()*10);return {id:"s128",gfx:"compass",alert:false,day:"Gun 5",time:"16:20",loc:"Kopruustu - DR Plot",sub:"Sextant sonrasi yaklasik mevki",who:"z2",
text:`2. Zabiti cetveli yeniden acip noktayi isaret etti.\n\n"Noon sight'tan enlemi yaklasik ${lat}?K bulduk. Son DR plot'umuz ${lon}?D civarinda. Tam astronomi cozmuyoruz; sadece yaklasik mevki hissi kuruyoruz. Bana kabaca hangi bolgeyi isaretlemen gerektigini soyle."\n\nHarita sende.`,
choices:[
{text:`Yaklasik ${lat}?K ve ${lon}?D civarini isaretlerim`,tag:"kritik",effect:{bilgi:16,sayginlik:12}},
{text:"Sadece enlemi yazar, boylami eski haliyle birakirim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"GPS yoksa mevki de yoktur diye dusunurum",tag:"korkak",effect:{bilgi:-10,sayginlik:-8}}
]};})(),

{id:"s129",gfx:"cargo",alert:false,day:"Gun 9",time:"17:40",loc:"Yuk Ofisi - Rapor Masasi",sub:"Near-miss report doldurma",who:"z1",
text:`Yuk ellecleme sirasindaki son anda durdurulan olay dosyaya dondu.

1. Zabiti formu uzatti: "Near-miss raporu ceza kagidi degil; ayni hatanin ikinci kez olmasini engelleyen kayittir. Olay tanimi, potansiyel sonuc, kok neden, duzeltici faaliyet."

Ilk nasil yazarsin?`,
choices:[
{text:"Olayi net tanimlar, potansiyel yaralanma riskini ve dogru duzeltici adimi acik yazarim",tag:"kritik",effect:{bilgi:14,sayginlik:12}},
{text:"Kisa bir not duser, ayrintiyi amire birakirim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Raporu hafifletip neredeyse olay yokmus gibi yazarim",tag:"korkak",effect:{bilgi:-9,sayginlik:-9}}]},

{id:"s130",gfx:"cabin",alert:false,day:"Gun 13",time:"03:20",loc:"Stajyer Kabini - Uykusuzluk",sub:"Moral dusunce gece uzuyor",who:"anlatici",
text:`Uyuyamiyorsun. Gemi duzenli calisiyor ama icin duzensiz.

Ic sesin bu kez daha yorgun:

"Bugun birine normal gorundun diye gercekten iyi misin? Yarin vardiyada ayakta durabilecek misin?"

Sabah olmadan once kendine ne yaparsin?`,
choices:[
{text:"Kalkip yuzumu yikar, kisa not yazar, uykuya geri donmeye calisirim",tag:"akilli",effect:{dinclik:6,bilgi:3}},
{text:"Koridora cikip sessizce bir amire ya da tayfaya gorunmeyi denerim",tag:"sosyal",effect:{sayginlik:6,dinclik:4}},
{text:"Sabaha kadar doner durur, zihnimi daha da yorarim",tag:"korkak",effect:{dinclik:-10,cesaret:-4}}]},

{id:"s131",gfx:"harbor",alert:false,day:"Gun 10",time:"05:40",loc:"Liman Yaklasmasi - Römorkör İstasyonu",sub:"Römorkör alma hazirligi",who:"suvari",
text:`Liman yaklasirken suvari disari bakip kisa kesti.

"Birazdan romorkor alacagiz. Bu is sadece halat vermek degil; hangi taraftan gelecek, hangi bitt'e alinacak, itme mi cekme mi yapacak, ne zaman komut verilecek hepsi duzen ister."

Sana ilk gorevi verdi. Ne yaparsin?`,
choices:[
{text:"Romorkorun gelecegi taraf, messenger line, bitt hazirligi ve haberlesme zincirini teyit ederim",tag:"kritik",effect:{bilgi:15,sayginlik:12,cesaret:4}},
{text:"Lostromo ne derse onu tekrarlar, pozisyonumu korurum",tag:"itaatkar",effect:{bilgi:7,sayginlik:6}},
{text:"Romorkor yanaşınca bakarız diye rahat davranirim",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s132",gfx:"harbor",alert:true,day:"Gun 10",time:"06:05",loc:"Pruva - Römorkör Hatti",sub:"Heaving line ve tow line aktarimi",who:"lostromo",
text:`Romorkor bordaya geldi. Heaving line suya dustu, tayfa gerildi.

Lostromo bagirdi: "Acele eden elini halata verir. Hat gerginlesmeden yerini, kimin ne tutacagini ve stop komutunu bileceksin."

O an neye odaklanirsin?`,
choices:[
{text:"Personelin güvenli durusu, heaving line yolu ve tow line gerginlesme anini izlerim",tag:"kritik",effect:{bilgi:14,sayginlik:12,cesaret:5}},
{text:"Yardim ederim ama surekli lostromoya bakarim",tag:"itaatkar",effect:{bilgi:7,sayginlik:5}},
{text:"Halata fazla yaklasip hizli davranmaya calisirim",tag:"korkak",effect:{bilgi:-10,sayginlik:-10}}]},

{id:"s133",gfx:"bogaz",alert:false,day:"Gun 6",time:"07:10",loc:"Kanal Girisi - Pilot Merdiveni",sub:"Bogaz/kanal icin pilot kaptan alma",who:"z2",
text:`Kanal girisinde pilot botu pruvasindan yukseliyor.

2. Zabiti sessiz ama net: "Pilot ladder, manrope, can simidi, ışık, VHF irtibati, freeboard. Pilot alma rutini boğazda hata kabul etmez."

Sana kontrol listesi uzatti. Ilk bakacagin?`,
choices:[
{text:"Pilot ladder baglari, spreader, aydinlatma ve standby personeli kontrol ederim",tag:"kritik",effect:{bilgi:15,sayginlik:12,cesaret:4}},
{text:"Sadece ladder inmis mi ona bakarim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Pilot profesyonel, sorun cikmaz diye dusunurum",tag:"korkak",effect:{bilgi:-9,sayginlik:-9}}]},

{id:"s134",gfx:"bridge",alert:false,day:"Gun 6",time:"07:35",loc:"Köprüüstü - Pilot Brifingi",sub:"Master-pilot information exchange",who:"suvari",
text:`Pilot kopruustu'ne cikti. Suvari chart'i ve passage plan'i acip kisa bir brifing baslatti.

"Pilot gemiyi yerel olarak bilir; kaptan ise geminin nihai sorumlusudur. Draft, ariza, manevra karakteri, rota ve cekinceler acik konusulur."

Sana soruldu: bu degisimde ne eksik kalmamali?`,
choices:[
{text:"Draft, manevra sinirlari, rota, yerel risk ve haberlesme dili net paylasilmali derim",tag:"kritik",effect:{bilgi:14,sayginlik:11}},
{text:"Pilot geldiyse artik o bilir derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Brifinge gerek yok, rota zaten belli diye dusunurum",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s135",gfx:"bridge",alert:false,day:"Gun 4",time:"09:00",loc:"Köprüüstü - GMDSS Konsolu",sub:"Gunluk haberlesme cihazi bakimi",who:"z3",
text:`3. Zabiti paneli gosterdi.

"Gunluk bakim sadece tuslara bakmak degil. VHF CH16 dinleme, DSC self-test durumu, el telsizlerinin sarji, printer kağıdi ve alarm paneli gorunurlugu kontrol edilir."

Gunluk turda neyi once yaparsin?`,
choices:[
{text:"VHF/DSC panel durumu, el telsiz sarjlari ve alarm gorunurlugunu birlikte kontrol ederim",tag:"kritik",effect:{bilgi:14,sayginlik:11}},
{text:"Sadece VHF'nin acik olduguna bakarim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Cihazlar dunden calisiyordu diye gecistiririm",tag:"korkak",effect:{bilgi:-8,sayginlik:-8}}]},

{id:"s136",gfx:"compass",alert:false,day:"Gun 4",time:"16:10",loc:"Köprüüstü - Haftalik Test",sub:"Haftalik haberlesme cihazi bakimi",who:"z3",
text:`Haftalik test gunu. 3. Zabiti check-list'i acmis.

"DSC routine test kaydi, NAVTEX kontrolu, EPIRB goz muayenesi, SART durum gosterge kontrolu, VHF kontrol cagrisi ve emergency battery logu haftalik disiplin ister."

Ilk adimin ne olur?`,
choices:[
{text:"DSC test kaydi ve emergency battery logunu acip diger ekipman durumlariyla karsilastiririm",tag:"kritik",effect:{bilgi:15,sayginlik:12}},
{text:"Sadece test satirini doldurup kalanini sonra dusunurum",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Kayit yaziliysa cihazlari tek tek gormeye gerek yok derim",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s137",gfx:"bridge",alert:false,day:"Gun 12",time:"14:30",loc:"Köprüüstü - Aylik Bakim",sub:"Aylik GMDSS ve acil haberlesme bakimi",who:"z3",
text:`Aylik bakimda is biraz daha agir.

"Reserve battery kapasite kontrolu, el telsizi pil durumu, can filikasi VHF setleri, anten baglantilari, Inmarsat/uydu terminal durumu ve test sertlarinin kaydi aylik ciddiyet ister."

Bu seviyede en buyuk hata nedir?`,
choices:[
{text:"Kayit var diye fiziksel durumu gormeden onay vermek derim",tag:"kritik",effect:{bilgi:15,sayginlik:12,cesaret:3}},
{text:"Aylik isi sadece zabit yapar diye uzakta kalirim",tag:"itaatkar",effect:{bilgi:6,sayginlik:5}},
{text:"Batarya ve can filikasi setleri aylarca degismez diye dusunurum",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s138",gfx:"bogaz",alert:false,day:"Gun 9",time:"01:40",loc:"Demir Sahasi - Anchor Watch",sub:"Demirde bekleme ve vardiya disiplini",who:"z2",
text:`Gece vardiyasinda gemi demirde. Ruzgar hafif artiyor, akinti ise hic susmuyor.

2. Zabiti seni ECDIS ve radar arasina cekti: "Anchor watch'ta rahatlayan adam suruklenmeyi gec gorur. Demir mevkii, swing circle, transit kontrolu, zincir acisi ve makinelerin hazirlik durumu birlikte izlenir."

Ilk kontrol zincirin ne olur?`,
choices:[
{text:"Demir mevkii, swing circle, transit, zincir ve makinelerin stand-by durumunu birlikte izlerim",tag:"kritik",effect:{bilgi:15,sayginlik:12}},
{text:"Sadece ECDIS'teki gemi izine bakarim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Demirdeyiz diye rahatlarsim",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s139",gfx:"storm",alert:true,day:"Gun 9",time:"02:25",loc:"Demir Sahasi - Suruklenme Riski",sub:"Anchor watch alarmi",who:"suvari",
text:`Anchor alarm kisa ama sert caldi. Mevki beklenen dairenin disina yaslanmaya basliyor.

Suvari kopruye geldi: "Suruklenme basliyorsa saniye bile degerli. Makine hazirligi, ikinci demir, VHF ihbari ve mevki teyidi birlikte dusunulur."

Sana ne yaptirsa en faydali olur?`,
choices:[
{text:"Mevkiyi ikinci kaynakla teyit eder, zincir durumunu ve VHF hazirligini ayni anda raporlarim",tag:"kritik",effect:{bilgi:15,sayginlik:13,cesaret:4}},
{text:"Sadece alarmi tekrar kontrol eder, emri beklerim",tag:"itaatkar",effect:{bilgi:7,sayginlik:5}},
{text:"Yanlis alarm olabilir diye oyalanirim",tag:"korkak",effect:{bilgi:-10,sayginlik:-10}}]},

{id:"s140",gfx:"harbor",alert:true,day:"Gun 10",time:"06:20",loc:"Mooring Station - Snap-back Hatti",sub:"Halat kopma tehlikesi",who:"lostromo",
text:`Mooring station kalabalik ama herkes gergin. Bir spring hattı asiri gergin.

Lostromo bagirdi: "Snap-back zone oyuncak degil. Halat koparsa cizdigi hat insan secmez. Kim nerede duruyor, kim hatta fazla yakin, hepsini gormelisin."

Ne yaparsin?`,
choices:[
{text:"Snap-back hattini bosalttirir, personeli güvenli alana ceker ve lostromoya bildiririm",tag:"kritik",effect:{bilgi:15,sayginlik:13,cesaret:5}},
{text:"Sadece kendim geri cekilir, digerlerini izlerim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Gergin halata yaklasip yardim etmeye calisirim",tag:"korkak",effect:{bilgi:-10,sayginlik:-10,cesaret:-4}}]},

{id:"s141",gfx:"bogaz",alert:true,day:"Gun 6",time:"07:05",loc:"Pilot Ladder - Ramak Kala",sub:"Pilot boarding near-miss",who:"z2",
text:`Pilot botu dalgayla bir an sert kalkti. Pilot ayagi ladder'a gelir gelmez alt bastamaklardan biri savruldu.

Kimse dusmedi ama herkesin yuregi agzina geldi. 2. Zabiti bir adim atip dondu:

"Near-miss bazen kaza kadar ogreticidir. Simdi neyi sabitleriz?"`,
choices:[
{text:"Ladder durumu, personel pozisyonu ve pilotla haberlesmeyi aninda yeniden stabilize ederim",tag:"kritik",effect:{bilgi:15,sayginlik:12,cesaret:5}},
{text:"Pilot cikinca sonra bakariz diye dusunurum",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Korkup tamamen geri cekilirim",tag:"korkak",effect:{bilgi:-8,sayginlik:-8,cesaret:-5}}]},

{id:"s142",gfx:"compass",alert:false,day:"Gun 4",time:"16:45",loc:"Köprüüstü - NAVTEX Printer",sub:"Safety mi warning mi?",who:"z3",
text:`NAVTEX printer yeni bir mesaj cikardi. 3. Zabiti kagidi sana uzatti.

"Her mesaj ayni agirlikta degil. Biri navigational warning, biri meteorological warning, biri search and rescue bilgisi olabilir. Olayin seyir emniyetine etkisini anlayacaksin."

Mesaji ilk nasil siniflarsin?`,
choices:[
{text:"Mesajin tipini ayirir, seyir emniyetine dogrudan etkisi varsa warning olarak onceliklendiririm",tag:"kritik",effect:{bilgi:14,sayginlik:11}},
{text:"Hepsini sadece genel safety notu gibi gorurum",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"NAVTEX mesaji gelmis ama rota uzakta diye okumam",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s143",gfx:"bridge",alert:false,day:"Gun 7",time:"11:20",loc:"Köprüüstü - Manevra Brifingi",sub:"Turning circle ve crash stop",who:"suvari",
text:`Suvari manevra kitabini acip kalemiyle iki cizgi cekti.

"Manevra turleri kagitta basit durur: turning circle, crash stop, zig-zag test, Williamson turn, parallel indexing ile donus. Ama her biri geminin karakterini baska yerden yakalar."

Sana sordu: turning circle ile crash stop farkini nasil anlatirsin?`,
choices:[
{text:"Biri dönüş karakterini, digeri tam yol sonrası durma mesafesi ve zamanini gosterir derim",tag:"kritik",effect:{bilgi:15,sayginlik:11}},
{text:"Ikisi de sadece dönme testi derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Detay fark etmez, manevra manevradir derim",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s144",gfx:"sea",alert:false,day:"Gun 7",time:"12:00",loc:"Açık Deniz - Manevra Uygulamasi",sub:"Williamson turn ne zaman?",who:"z2",
text:`2. Zabiti dumen komutlarini sesli tekrar etti.

"Insan denize dustu senaryosunda bazen ilk refleks panik olur. Oysa uygun manevra tipi zamani kazandirir. Williamson turn, Anderson turn, Scharnow turn farkli kosullarda kullanilir."

Williamson turn'u neyle hatirlarsin?`,
choices:[
{text:"Ozellikle MOB durumunda eski iz hattina donmeye yarayan kontrollu geri donus manevrasi olarak",tag:"kritik",effect:{bilgi:15,sayginlik:11}},
{text:"Liman icinde romorkor beklerken yapilan kucuk donus olarak",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Adini duydum ama kullanimi onemsiz diye dusunurum",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s145",gfx:"bridge",alert:false,day:"Gun 7",time:"13:10",loc:"Köprüüstü - Berthing Manevrasi",sub:"Baş-kıç itici, dümen ve makine koordinasyonu",who:"suvari",
text:`Liman yanaşmasi oncesi suvari son kez anlatti.

"Berthing manevrasi dumenle tek basina olmaz. Ruzgar, akinti, bas-kic itici varsa onun etkisi, varsa romorkor itisi, makine komutlari ve pilot tavsiyesi birlikte okunur."

Sana gore burada en buyuk hata nedir?`,
choices:[
{text:"Tek bir komuta guvenip tum dis etkileri yok saymak derim",tag:"kritik",effect:{bilgi:15,sayginlik:12}},
{text:"Pilot ne derse aynisini dusunmeden yapmak derim",tag:"itaatkar",effect:{bilgi:7,sayginlik:5}},
{text:"Ruzgar ve akintiyi ikinci planda gormek derim ama onemsemem",tag:"korkak",effect:{bilgi:-8,sayginlik:-8}}]},

{id:"s146",gfx:"cabin",alert:false,day:"Gun 8",time:"22:15",loc:"Stajyer Kabini",sub:"Kesintisiz uyku firsati",who:"anlatici",
text:`Nadir bir gece. Ne alarm var ne ekstra cagri. Kabin ilk kez sessiz sayilir.

Yastiga basini koyunca dusunuyorsun: denizde bazen en buyuk luks, kesintisiz dort bes saat uyumak.

Bu firsati nasil kullanirsin?`,
choices:[
{text:"Telefonu bir kenara birakir, hemen uykuya teslim olurum",tag:"akilli",effect:{dinclik:20,sayginlik:3}},
{text:"Kisa bir not yazip sonra uyurum",tag:"itaatkar",effect:{dinclik:16,bilgi:4}},
{text:"Bos zamani harcayip yine gec yatarim",tag:"korkak",effect:{dinclik:-5}}]},

{id:"s147",gfx:"galley",alert:false,day:"Gun 9",time:"18:30",loc:"Yemekhane",sub:"Sicak yemek, sakin masa",who:"asci",
text:`Asci bu aksam masayi sessizce topladi.

"Bugun ortalik yorucuydu. Karnin duzgun doyarsa kafan da toparlar."

Sicak corba, taze ekmek, cay. Kucuk seyler ama gemide bazen insani toparlayan da bunlar.`,
choices:[
{text:"Sakin sakin yer, acele etmeden biraz nefes alirim",tag:"sosyal",effect:{dinclik:16,sayginlik:6}},
{text:"Yemegi bitirip erkenden kabine cekilirim",tag:"itaatkar",effect:{dinclik:14}},
{text:"Aklim baska yerde diye yemegi gecistiririm",tag:"korkak",effect:{dinclik:-4,sayginlik:-2}}]},

{id:"s148",gfx:"sea",alert:false,day:"Gun 10",time:"06:20",loc:"Açık Güverte - Sabah Havası",sub:"Vardiya oncesi kisa toparlanma",who:"hasan",
text:`Hasan seni vardiya oncesi disari cagirdi.

"Iki dakika temiz hava da denizcinin ilaci bazen. Kafayi acmadan ekrana bakarsan her sey daha zor gelir."

Ufuk acik, ruzgar yumusak. Ne yaparsin?`,
choices:[
{text:"Derin nefes alir, ufka bakip zihnimi toplarim",tag:"akilli",effect:{dinclik:14,cesaret:3}},
{text:"Hasanla iki laf eder, sonra goreve donerim",tag:"sosyal",effect:{dinclik:12,sayginlik:5}},
{text:"Bos is deyip dogrudan ise dalarim",tag:"korkak",effect:{dinclik:-3}}]},

{id:"s149",gfx:"cabin",alert:false,day:"Gun 11",time:"13:40",loc:"Stajyer Kabini",sub:"Kisa ogle uykusu",who:"anlatici",
text:`Oglen kisa bir bosluk yakaladin. Tam tamina yirmi dakika.

Denizde uzun dinlenme her zaman bulunmaz ama bazen kisa uyku bile insanin gozunu ve dengesini yerine getirir.

Bu arayi nasil degerlendirirsin?`,
choices:[
{text:"Alarm kurup yirmi dakikalik power nap yaparim",tag:"kritik",effect:{dinclik:18,bilgi:3}},
{text:"Uzanir, gozlerimi kapatip bedenimi dinlendiririm",tag:"itaatkar",effect:{dinclik:13}},
{text:"Uyursam sersem olurum deyip hic dinlenmem",tag:"korkak",effect:{dinclik:-4}}]},

{id:"s150",gfx:"harbor",alert:false,day:"Gun 12",time:"17:20",loc:"Kıç Güverte",sub:"İş bitti, omuzlar düştü",who:"lostromo",
text:`Uzun bir isin ardindan lostromo ilk kez "tamam" dedi.

"Bugun iyi kosturdun. Simdi bir bardak su ic, omuzlarini birak. Gemi insani sadece zorlamaz; bazen biraktiginda da ogretir."

Kendine kucuk bir mola verir misin?`,
choices:[
{text:"Su icer, oturup kisa bir toparlanma molasi veririm",tag:"akilli",effect:{dinclik:14,sayginlik:6}},
{text:"Etrafi son kez kontrol edip sonra dinlenirim",tag:"itaatkar",effect:{dinclik:11,bilgi:3}},
{text:"Dinlenmeden yeni is aramaya devam ederim",tag:"korkak",effect:{dinclik:-5,cesaret:2}}]},

{id:"s151",gfx:"harbor",alert:false,day:"Gun 11",time:"05:50",loc:"Cebelitarık Gecisi",sub:"Gel-git ve tidal set",who:"z2",
text:`2. Zabiti gel-git cetvelini acip rotayi isaret etti.

"Tidal stream bazen motor kadar etkilidir. Set ve drift'i okumazsan haritadaki rota ile gercekteki iz farkli olur. Dar gecitte bu fark buyur."

Ilk neye bakarsin?`,
choices:[
{text:"Tidal set yonu, drift hizi ve ETA saatindeki akinti penceresini birlikte kontrol ederim",tag:"kritik",effect:{bilgi:15,sayginlik:11}},
{text:"Sadece derinlige bakarim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Akintiyi goz karariyla gecistiririm",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s152",gfx:"compass",alert:false,day:"Gun 11",time:"07:30",loc:"Köprüüstü - Matematiksel Seyir",sub:"Set-drift ile course to steer",who:"z2",
text:`2. Zabiti kâğıda iki ok cizdi.

"Matematiksel seyir bazen bir problem cozmektir: Istenen COG ayridir, verdigin HDG ayridir. Akinti seni doguya itiyorsa rota tutmak icin kurs duzeltirsin."

Sana gore burada asil mantik nedir?`,
choices:[
{text:"Istenen rota icin akintiyi vektorel dusunup course to steer duzeltmesi yapmak derim",tag:"kritik",effect:{bilgi:16,sayginlik:11}},
{text:"Pruvayi hedefe cevirmenin her zaman yeterli oldugunu soylerim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Akinti olsa da olmasa da aynı kursu veririm",tag:"korkak",effect:{bilgi:-10,sayginlik:-8}}]},

{id:"s153",gfx:"sea",alert:false,day:"Gun 8",time:"14:40",loc:"Açık Deniz - Yarım Daire Seyri",sub:"Tehlikeli yarım daire mantigi",who:"suvari",
text:`Suvari hava haritasini acip firtina merkezini isaret etti.

"Yarım daire seyri ezber değil mantiktir. Tehlikeli yarim daire ile sevk edici yarim daire farkli davranir. Ruzgar yonu, alçak basinc merkezi ve geminin hangi tarafta kaldigi birlikte okunur."

En temel refleks ne olmali?`,
choices:[
{text:"Firtina merkezine gore hangi yarim dairede oldugunu okuyup rotayi ona gore acmak derim",tag:"kritik",effect:{bilgi:15,sayginlik:11}},
{text:"Sadece ruzgar siddetine bakarim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Yarim daire ayriminin onemsiz oldugunu dusunurum",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s154",gfx:"compass",alert:true,day:"Gun 7",time:"18:50",loc:"Köprüüstü - Acil Haberleşme",sub:"Distress relay ve urgency cagrisi",who:"z3",
text:`VHF'de zayif bir acil cagrı duyuldu. Mesaj tam degil ama bir teknenin yardım istedigi belli.

3. Zabiti sordu: "MAYDAY relay ne zaman, PAN-PAN ne zaman, hangi bilgi zinciriyle? Acil haberlesmede dogru kategori kadar net tekrar da onemlidir."

Ilk adimin ne olur?`,
choices:[
{text:"Mesaji teyit eder, durum acilse uygun relay/urgency formatini bilgi sirasi ile hazirlarim",tag:"kritik",effect:{bilgi:15,sayginlik:12,cesaret:4}},
{text:"Bir ust gelsin diye beklerim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Anlamadigim mesaji yok sayarim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s155",gfx:"cargo",alert:false,day:"Gun 8",time:"09:10",loc:"Ana Güverte - Raspa Hazırlığı",sub:"Raspa-boya isi planlama",who:"lostromo",
text:`Lostromo pasli bir alanı çizdi.

"Raspa-boya sadece fırça vurmak değil. Yüzey hazırlığı, pas derecesi, maskeleme, kişisel koruyucu, hava durumu ve boya karışım oranı birlikte düşünülür."

İlk doğru adım nedir?`,
choices:[
{text:"Yüzeyi değerlendirir, raspa seviyesi ve emniyet ekipmanını hazırlayarak işe başlarım",tag:"kritik",effect:{bilgi:14,sayginlik:12}},
{text:"Boyayı açıp doğrudan üstüne geçerim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Pasın üstüne boya tutar diye acele ederim",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s156",gfx:"cargo",alert:false,day:"Gun 8",time:"16:30",loc:"Ana Güverte - Boya İşi",sub:"Katlar arasi bekleme ve boya disiplini",who:"lostromo",
text:`İlk kat atildi ama is bitmedi.

Lostromo fırçayı omzuna koydu: "Katlar arası bekleme süresi, yüzey kuruluğu ve tuz kalıntısı görülmeden boya işi bitmiş sayılmaz. Denizcilikte acele pası geri çağırır."

Ne yaparsin?`,
choices:[
{text:"Kuruma süresi, hava durumu ve yüzey temizliğini tekrar kontrol ederim",tag:"kritik",effect:{bilgi:14,sayginlik:11}},
{text:"İlk kat güzel duruyorsa ikinciyi hemen atmak isterim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Tutar herhalde diye kontrolsüz devam ederim",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s157",gfx:"sea",alert:false,day:"Gun 10",time:"10:10",loc:"Algeciras Açıkları",sub:"Yeni rota ve trafik ayırımı",who:"suvari",
text:`Suvari rotayi bu kez batıya çevirdi.

"Valensiya'dan sonra Algeciras aciklarina iniyoruz. Trafik yogun, akinti farkli, raporlama dili daha sert."

Yeni rotada ilk once neyi hesaba katarsin?`,
choices:[
{text:"Trafik ayrim düzeni, tidal set ve VTS haberlesmesini birlikte düşünürüm",tag:"kritik",effect:{bilgi:15,sayginlik:11}},
{text:"Eski rota mantığıyla devam ederim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Yeni rota ama eski alışkanlıklarla giderim",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s158",gfx:"sea",alert:false,day:"Gun 12",time:"11:25",loc:"Kıbrıs Açıkları",sub:"Doğu Akdeniz yeni seyir hattı",who:"z2",
text:`Kıbrıs açıklarında deniz sakin ama trafik karisik.

2. Zabiti plotter'a dokundu: "Her yeni rota yeni referans noktası ister. Kıyıdan uzaklık, raporlama noktaları, hava penceresi ve seyir notları baştan düşünülür."

İlk refleksin?`,
choices:[
{text:"Referans noktaları ve raporlama geçişlerini yeni hatta göre tekrar kurarım",tag:"kritik",effect:{bilgi:14,sayginlik:11}},
{text:"Eski waypoint düzenini olduğu gibi taşırım",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Deniz açıksa detay gerekmez derim",tag:"korkak",effect:{bilgi:-8,sayginlik:-8}}]},

{id:"s159",gfx:"engine",alert:false,day:"Gun 9",time:"08:40",loc:"Ballast Kontrol Paneli",sub:"Ballast / deballast operasyon zinciri",who:"carkci",
text:`Çarkçıbaşı ballast panelini açtı.

"Bu gemi bazen yükten çok suyla düzeltilir. Ama hangi tanktan ne zaman alıp ne zaman basacağını bilmezsen listeyi düzeltirken başka sorunu doğurursun. Sounding, valf sırası, pompa yükü, serbest yüzey... hepsi birlikte düşünülür."

İlk kontrolün ne olur?`,
choices:[
{text:"Tank planı, mevcut sounding, valf hattı ve hedef trim/list durumunu birlikte kontrol ederim",tag:"kritik",effect:{bilgi:15,sayginlik:12}},
{text:"Sadece pompaları çalıştırmaya odaklanırım",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Hangi tanka su gittiği çok fark etmez diye düşünürüm",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s160",gfx:"cargo",alert:false,day:"Gun 9",time:"09:30",loc:"Yük Ofisi - Trim/List Hesabi",sub:"Trim-list correction mini hesap",who:"z1",
text:`1. Zabiti hesabı önüne itti.

"Gemi sancağa 1.2 derece yatık. Çift dip tanklardan birine 60 ton ballast alırsak listedeki farkı azaltabiliriz; ama serbest yüzey ve trim etkisini de unutmayacaksın."

Sana göre doğru yaklaşım ne?`,
choices:[
{text:"Balastı karşı tarafa kontrollü alır, listeyi soundingle ve serbest yüzey etkisiyle birlikte izlerim",tag:"kritik",effect:{bilgi:16,sayginlik:11}},
{text:"Yatıklığı görünce en yakın tanka hemen su basarım",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Gözle düzelmiş gibi görünüyorsa hesabı bırakırım",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s161",gfx:"cargo",alert:false,day:"Gun 10",time:"14:15",loc:"Ana Güverte - Lashing Turu",sub:"Cargo securing / lashing kararları",who:"lostromo",
text:`Lostromo lashing turnbucklelere tek tek vurdu.

"Deniz sakinken gevşek lashing fark edilmez. İlk sert havada yük konuşur. Twist-lock, turnbuckle, rod, chock, wedge... hepsi yerinde olacak."

Sana göre en kritik disiplin nedir?`,
choices:[
{text:"Lashing gerginliği, kilitlerin oturuşu ve hava öncesi tekrar kontrolü derim",tag:"kritik",effect:{bilgi:15,sayginlik:12,cesaret:3}},
{text:"Yük yerindeyse lashinge çok dokunmam derim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"İlk gün sağlamlandıysa tekrar bakmaya gerek yok derim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s162",gfx:"storm",alert:true,day:"Gun 10",time:"22:10",loc:"Ambar Üstü - Hava Öncesi Kontrol",sub:"Lashing gevşemesi riski",who:"z1",
text:`Hava sertleşmeden önce 1. Zabiti son bir tur istiyor.

"Bir rod gevşekse, bir kilit yarım oturduysa, bunu limanda değil havada anlarsın. O zaman da seçenek azalır."

Sana hangi işi verdi?`,
choices:[
{text:"Kritik sıralardaki lashingi tek tek göz ve el kontrolüyle teyit ederim",tag:"kritik",effect:{bilgi:14,sayginlik:12}},
{text:"Uzaktan genel görüntüye bakarım",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Bu saatte tura gerek yok diye düşünürüm",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s163",gfx:"engine",alert:false,day:"Gun 4",time:"07:20",loc:"Makine Dairesi - Sabah Turu",sub:"Günlük tur ve arıza önleme",who:"bas2",
text:`2. Başmakinist günlük turu başlattı.

"Arıza çoğu zaman alarm çalmadan önce koku, sıcaklık, titreşim, sızıntı veya ses olarak haber verir. Makineci gözü bunu erken yakalarsa gemi rahat eder."

Turda ilk refleksin ne olur?`,
choices:[
{text:"Sızıntı, sıcak yüzey, anormal ses ve titreşimi birlikte tararım",tag:"kritik",effect:{bilgi:15,sayginlik:11}},
{text:"Sadece göstergelere bakarım",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Alarm yoksa sorun da yok diye düşünürüm",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s164",gfx:"engine",alert:false,day:"Gun 4",time:"08:10",loc:"Makine Dairesi - Yardımcı Sistemler",sub:"Separator, bilge ve cooling water kontrolü",who:"yagci",
text:`Yağcı Mehmet Ali seni yardımcı sistemlere çekti.

"Ana makine kadar separator, bilge, cooling water ve günlük yağ seviyeleri de hayatidir. Küçük ihmal büyük arızaya çıkar."

İlk neyi not alırsın?`,
choices:[
{text:"Yağ seviyeleri, soğutma suyu durumu, separator sesi ve bilge temizliğini birlikte not ederim",tag:"kritik",effect:{bilgi:14,sayginlik:11}},
{text:"Sadece yağ seviyesine bakarım",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Hepsi dönüyorsa ayrıntıya girmem",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s165",gfx:"engine_fault",alert:true,day:"Gun 4",time:"10:30",loc:"Makine Dairesi - Önleyici Müdahale",sub:"Küçük belirtiyi erken yakalamak",who:"carkci",
text:`Kontrol turunda hafif bir yanık kokusu fark edildi. Henüz alarm yok.

Çarkçıbaşı durup baktı: "İşte arıza önleme burada başlar. Küçük belirtiyi ciddiye alırsan gemi seni sonra ödüllendirir."

Ne önerirsin?`,
choices:[
{text:"Kaynağı izole eder, sıcaklık/ yük durumu ile birlikte kontrollü inceleme isterim",tag:"kritik",effect:{bilgi:15,sayginlik:12,cesaret:4}},
{text:"Bir süre daha izleyip sonra bakarız derim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Koku geçer diye önemsemem",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s166",gfx:"compass",alert:true,day:"Gun 9",time:"19:35",loc:"Koprustu - Acil Haberlesme Defteri",sub:"MAYDAY cagrisi nasil kurulur?",who:"z3",
text:`3. Zabiti VHF protokol kartini onune koydu.

"Acil durumda panik ilk dusmandir. Mesajin sirasi bozulursa yardim gecikir. MAYDAY cagrisi; gemi adi, callsign, pozisyon, olayin cinsi, istenen yardim ve bordadaki kisi sayisi gibi bilgilerle kurulur."

Mikrofon eline verilse ilk disiplini nasil korursun?`,
choices:[
{text:"MAYDAY kelimesini net tekrar eder, kim oldugumuzu, pozisyonu ve tehlikeyi duzenli sirayla veririm",tag:"kritik",effect:{bilgi:15,sayginlik:12,cesaret:4}},
{text:"Once sadece bagirip yardim ister, detaylari sonra dusunurum",tag:"itaatkar",effect:{bilgi:6,sayginlik:4,cesaret:2}},
{text:"Yanlis soylerim diye hic konusmam",tag:"korkak",effect:{bilgi:-10,sayginlik:-9,cesaret:-4}}]},

{id:"s167",gfx:"harbor",alert:false,day:"Gun 10",time:"04:55",loc:"Pilotaj Istasyonu - Tidal Tablo",sub:"Gel-git tablosuyla under keel clearance",who:"z2",
text:`Dar suya girmeden once 2. Zabiti tidal atlas ile tabloyu yan yana acti.

"Sadece gel-git saati yetmez. High water saati, beklenen range, chart datum ve geminin drafti birlikte okunur. Limana emniyetli giris bazen yarim saat pencereye bakar."

Ilk hesap mantigin ne olur?`,
choices:[
{text:"Charted depth, gel-git yuksekligi ve gemi draftini birlikte dusunup UKC kontrol ederim",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
{text:"Sadece high water saatine bakarim, yeter derim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Derinlik kagitta yaziyorsa ekstra hesaba gerek yok derim",tag:"korkak",effect:{bilgi:-10,sayginlik:-8}}]},

{id:"s168",gfx:"compass",alert:false,day:"Gun 10",time:"06:40",loc:"Harita Masasi",sub:"Matematiksel seyir - current triangle",who:"z2",
text:`Harita masasinda uc oklu kucuk bir ucgen cizdin. 2. Zabiti basiyla onayladi.

"Matematiksel seyir ezber degil; vektor okumaktir. Ship's speed bir sey, akintinin set ve drift'i baska sey. Istenen COG'u yakalamak icin bunlari ucgen gibi toplarsin."

Bu problemde asil amac nedir?`,
choices:[
{text:"Akinti vektorunu hesaba katip course to steer ile gercek iz farkini kapatmak",tag:"kritik",effect:{bilgi:15,sayginlik:11}},
{text:"Pruvayi varis noktasina dondurmenin tek basina yetecegini dusunmek",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Set-drift hesabini tamamen gereksiz gormek",tag:"korkak",effect:{bilgi:-10,sayginlik:-8}}]},

{id:"s169",gfx:"storm",alert:false,day:"Gun 11",time:"16:10",loc:"Kaptan Kamarasi - Hava Haritasi",sub:"Yarim daire seyri karar ani",who:"suvari",
text:`Kaptan meteoroloji fax'ini cizerek anlatti.

"Tropik sistem olsun ya da kuvvetli alcak basinc, once merkeze gore hangi tarafta oldugunu anlayacaksin. Tehlikeli yarim dairede rota acmakla sevk edici yarim dairede davranis ayni olmaz."

Kaptan sana tek cumlelik mantigi soruyor. Ne dersin?`,
choices:[
{text:"Firtina merkezine gore hangi yarim dairede kaldigimizi belirleyip ruzgarla birlikte guvenli kacis rotasi kurarim",tag:"kritik",effect:{bilgi:15,sayginlik:11}},
{text:"Sadece barometreye bakar, baska veriyi ikincil gorurum",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Yarim daire mantiginin teoride kaldigini dusunurum",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s170",gfx:"cargo",alert:false,day:"Gun 8",time:"10:20",loc:"Ana Guverte - Raspa Noktasi",sub:"Raspa, astar ve boya disiplini",who:"lostromo",
text:`Lostromo elindeki celik fircayi gosterdikten sonra astar kutusunu yere koydu.

"Raspa-boya isi sabir ister. Yuzey tuzluysa tutmaz, pas gevsekse tutmaz, astar ile son kat arasi pencere kacarsa yine tutmaz. Emniyet kemeri ve gozluk olmadan da bu is olmaz."

Isi nasil siralarsin?`,
choices:[
{text:"Yuzeyi temizler, pas derecesini kontrol eder, uygun astar ve bekleme suresiyle devam ederim",tag:"kritik",effect:{bilgi:14,sayginlik:12}},
{text:"Pasli alana hizlica boya gecip goruntuyu toparlarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Koruyucu ekipmansiz ve kontrolsuz calismaya baslarim",tag:"korkak",effect:{bilgi:-9,sayginlik:-9}}]},

{id:"s171",gfx:"harbor",alert:false,day:"Gun 6",time:"21:25",loc:"Liman Girisi - Samandiralar",sub:"IALA lateral markalari okumak",who:"z2",
text:`Gece vardiyasinda liman girisinin iki yaninda samandiralar belirdi.

"Lateral markalari gozunle okuyacaksin" dedi 2. Zabiti. "Renk, tepe isareti, isik karakteri ve hangi bolgede oldugun birlikte anlam tasir."

Liman girisine yaklasirken ilk neyi netlestirirsin?`,
choices:[
{text:"Hangi IALA bolgesinde oldugumu ve sancak/iskele markalarinin renk-ritmini birlikte kontrol ederim",tag:"kritik",effect:{bilgi:15,sayginlik:11}},
{text:"Sadece isik gorduysem yeter diye dusunurum",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Samandira sekline dikkat etmeden rotayi surdururum",tag:"korkak",effect:{bilgi:-10,sayginlik:-8}}]},

{id:"s172",gfx:"night",alert:false,day:"Gun 6",time:"22:05",loc:"Koprustu Kanadi",sub:"Fener karakterleri ve sektor isiklari",who:"z2",
text:`Uzakta beyaz, sonra kirmiziya donen bir isik gordun. 2. Zabiti hemen sordu:

"Her fener sadece yanmaz; yazar. Fl(2), Oc, Iso, sectors... Her karakter sana nerede oldugunu, neye yaklastigini ve hangi taraftan gecmemen gerektigini soyler."

Bu isigi okurken nasil dusunursun?`,
choices:[
{text:"Renk degisimiyle sektor feneri ihtimalini, karakterle birlikte haritadaki isik listesine karsilastiririm",tag:"kritik",effect:{bilgi:16,sayginlik:11}},
{text:"Beyaz gorunuyorsa her yerden emniyetlidir diye varsayarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Fener karakterlerini ezber gereksiz sayarim",tag:"korkak",effect:{bilgi:-10,sayginlik:-8}}]},

{id:"s173",gfx:"harbor",alert:false,day:"Gun 5",time:"13:15",loc:"Ana Direk",sub:"Flamalar ne soyler?",who:"z1",
text:`1. Zabiti signal book'u acip diregi isaret etti.

"Her flama bir harf olabilir, bazen de tek basina bir mesaj. Alfa sualtinda dalgic var der, Quebec gemi saglik bildirimini anlatir, Hotel pilot bordada anlamina gelir."

Bir signal flag gorunce ilk refleksin ne olmali?`,
choices:[
{text:"Tek harf anlami mi, kombinasyon mu diye kontrol eder ve signal book ile teyit ederim",tag:"kritik",effect:{bilgi:15,sayginlik:11}},
{text:"Rengine bakip tahmin etmeye calisirim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Flamalar artik kimse kullanmiyor diye onemsemem",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s174",gfx:"night",alert:false,day:"Gun 5",time:"23:10",loc:"Koprustu - Aldis Lambasi",sub:"Mors kodu ve SOS",who:"z3",
text:`Aldis lambasi egitiminde 3. Zabiti isigi kisa-kisa, uzun-uzun yakti.

"Mors kodu bugun her yerde ilk arac olmayabilir ama denizcilik hafizasi orada. S-O-S uc kisa, uc uzun, uc kisa. Ritmi bozarsan kelime degisir."

Mors calisirken nasil yaklasirsin?`,
choices:[
{text:"Kisa ve uzun vurus ritmini sakin sayar, temel kodlari not ederek tekrar ederim",tag:"kritik",effect:{bilgi:15,sayginlik:10,cesaret:3}},
{text:"Sadece SOS'u duymus olmakla yetinirim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Isikla haberlesmeyi modasi gecmis diye kucumserim",tag:"korkak",effect:{bilgi:-8,sayginlik:-7}}]},

{id:"s175",gfx:"sea",alert:false,day:"Gun 13",time:"09:40",loc:"Messina Aciklari",sub:"Yeni rota, yeni traffic separation",who:"suvari",
text:`Messina civarinda trafik yogun, akis sert ve raporlama disiplini farkli.

Suvari sakin bir sesle anlatti: "Yeni rota sadece yeni manzara degildir. Separation scheme, lokal akinti ve pilotaj teamulleri birlikte okunur."

Bu yeni hatta ilk neyi guncellersin?`,
choices:[
{text:"Trafik ayrim duzeni, akinti notlari ve raporlama noktalarini seyir planina islerim",tag:"kritik",effect:{bilgi:15,sayginlik:11}},
{text:"Eski rota mantigini buyuk oranda korurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Harita degisti ama aliskanlik yetistirir diye dusunurum",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s176",gfx:"harbor",alert:false,day:"Gun 14",time:"07:50",loc:"Suveys Girisi",sub:"Kanal yaklasmasi ve raporlama",who:"z2",
text:`Suveys yaklasmasinda trafik, raporlama ve bekleme penceresi sikidir.

2. Zabiti haritaya egildi: "Kanal yaklasmasi liman yaklasmasina benzemez. Konvoy saati, pilot talebi, draft beyani ve haberlesme disiplini bir aradadir."

Neyi once toparlarsin?`,
choices:[
{text:"Raporlama saati, pilot/konvoy bilgisi ve draft verisini dogrulayip bridge team'e aktaririm",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
{text:"Sadece vardiya gelince duyariz diye beklerim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Kanal prosedurunu normal liman girisi gibi gorurum",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s177",gfx:"compass",alert:false,day:"Gun 9",time:"05:35",loc:"Koprustu - NAVTEX Printer",sub:"NAVTEX mesajinda hangisi kritik?",who:"z3",
text:`NAVTEX kagidi bu kez daha uzun. Uyarida hem meteorological warning hem de bir atesleme sahasi notu var.

3. Zabiti kağıdı masaya bıraktı: "Her NAVTEX mesajı aynı ağırlıkta değil. Bazen bir satır rota değiştirir, bazen sadece dosyaya girer."

Ilk neyi ayirirsin?`,
choices:[
{text:"Seyir emniyetine dogrudan etkisi olan warning kismini ayirir, rota ile karsilastiririm",tag:"kritik",effect:{bilgi:15,sayginlik:11}},
{text:"Mesaji genel bilgi sayip sadece dosyalarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"NAVTEX'i vardiya sonuna birakirim",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s178",gfx:"harbor",alert:false,day:"Gun 10",time:"17:10",loc:"Demir Sahasi Yaklasmasi",sub:"Demirlemeden once son kontrol",who:"z2",
text:`Geminin hizi dusuyor. 2. Zabiti checklisti acmis.

"Demirleme sakin gorunur ama daginik zihin istemez. Derinlik, taban cinsi, ruzgar, akinti, swing circle, diger gemiler, kablo-pipeline alanlari ve makine hazirligi birlikte dusunulur."

Sen olsan ilk sirayi neye verirsin?`,
choices:[
{text:"Derinlik, taban cinsi ve swing alani ile chart uyarilarini birlikte kontrol ederim",tag:"kritik",effect:{bilgi:15,sayginlik:12}},
{text:"Sadece su anki derinlige bakarim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Bos yer gorduysem demir atilabilir diye dusunurum",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s179",gfx:"harbor",alert:false,day:"Gun 10",time:"17:45",loc:"Demir Sahasi Haritasi",sub:"Nerede demirlenmez?",who:"suvari",
text:`Suvari parmagini haritada gezdirdi.

"Herkes uygun gorunen suya demir atamaz. Subsea cable, pipeline, TSS kenari, askeri saha, yasak anchorage, dar kanal agzi ve kotu tutan dip ayridir. Demir sahasi secimi denizcilik karakterini belli eder."

Hangi alan seni hemen durdurmali?`,
choices:[
{text:"Chartta kablo, pipeline veya yasak anchorage isareti gordugum alan",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
{text:"Yakinda gemi yoksa yeter diye dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Trafik disiysa her yerde demir tutar derim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s180",gfx:"bogaz",alert:false,day:"Gun 10",time:"18:20",loc:"Pruva Ustu",sub:"Kac kilit ve nasil birakilir?",who:"lostromo",
text:`Lostromo zincir sesi olmadan once donup sordu:

"Demir sadece suya dusmez; kontrollu verilir. Derinlik, ruzgar ve bekleme suresine gore kac shackles salacagini, gemiyi ne zaman stop edecegini ve zinciri ne kadar frenleyecegini bilmezsen is karisir."

En saglam stajyer refleksi hangisi?`,
choices:[
{text:"Derinlik ve saha kosullarina gore zabit komutunu takip eder, zincir davranisini dikkatle izlerim",tag:"kritik",effect:{bilgi:14,sayginlik:11}},
{text:"Shackle sayisini kabaca tahmin etmenin yetecegini dusunurum",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Zincir hizini onemsemem, birak gitsin derim",tag:"korkak",effect:{bilgi:-9,sayginlik:-9}}]},

{id:"s180b",gfx:"bogaz",alert:false,day:"Gun 10",time:"18:28",loc:"Pruva Ustu - Zincir Markalari",sub:"Hangi bakla hangi renge boyanir?",who:"lostromo",
text:`Lostromo zincirin ustune egildi, parmagiyla boyali baklalari gosterdi.

"Zinciri sadece sayarak degil, markasindan da okursun. Bir kilit 15 fathom yani yaklasik 27.5 metre. Joining shackle cevresindeki boyali baklalar ve tel sargilari hangi kilidin suda oldugunu hizlica anlaman icindir. Sistem gemiden gemiye ufak degisebilir ama mantik hep aynidir."

Sana gore dogru denizci tavri hangisi?`,
choices:[
{text:"Gemide uygulanan marking sistemini ogrenir; boyali bakla ile tel sargisini birlikte okuyarak kilit sayarim",tag:"kritik",effect:{bilgi:15,sayginlik:12}},
{text:"Sadece zincirin ne kadar hizli aktigina bakmanin yeterli oldugunu dusunurum",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Bakla renklerinin pratikte onemli olmadigini sanirim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s180c",gfx:"bogaz",alert:false,day:"Gun 10",time:"18:34",loc:"Pruva Ustu - Kaloma Takibi",sub:"Kacinci zincir suda nasil anlasilir?",who:"z3",
text:`3. Zabiti kilit sayimini bir daha sordurdu:

"Mesela bir joining shackle kirmizi, yanindaki iki bakla beyaz ise bu gemide birinci kilit olabilir; ikinci kilitte uc bakla, ucuncude dort bakla gibi ilerler. Ama ezber degil, geminin marking plani esastir. Onemli olan suya giden kilidi dogru seslendirmek."

Pruva ustunde en dogru rapor nasil verilir?`,
choices:[
{text:"Marking planina gore okuyup 'ucuncu kilit suya girdi' gibi net ve yuksek sesle rapor veririm",tag:"kritik",effect:{bilgi:16,sayginlik:12,cesaret:3}},
{text:"Kaptan nasil olsa duyar diye sayiyi icimden takip ederim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Renkler karisik diye tahmini bir kilit sayisi soylerim",tag:"korkak",effect:{bilgi:-10,sayginlik:-10}}]},

{id:"s181",gfx:"storm",alert:true,day:"Gun 10",time:"22:40",loc:"Demir Sahasi - Ruzgar Dondu",sub:"Holding ground ve suruklenme ihtimali",who:"suvari",
text:`Gece ruzgar dondu, gemi hafifce baska bir aciya oturdu.

Suvari AIS, radar ve mevki kaydina ayni anda bakti: "Kotu dipte ya da kisa zincirde sorun sessiz baslar. Bearingler akiyorsa, zincir davranisi degisiyorsa ve mevki kayiyorsa anchor dragging'e hazir olursun."

Ne yaparsin?`,
choices:[
{text:"Bearing, radar mevki, zincir istikameti ve makine hazirligini birlikte teyit ederim",tag:"kritik",effect:{bilgi:15,sayginlik:12,cesaret:4}},
{text:"Biraz daha bekleyip farkin buyumesine bakarim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Demirdeysek hareket etmez diye varsayarim",tag:"korkak",effect:{bilgi:-10,sayginlik:-10}}]},

{id:"s182",gfx:"sea",alert:false,day:"Gun 12",time:"09:10",loc:"Trieste - Haifa Hatti",sub:"Yeni rota, yeni harita mantigi",who:"z2",
text:`2. Zabiti yeni rota klasorunu acti.

"Her deniz ayni haritayla dusunulmez. Trieste cikisi ile Haifa yaklaşması aynı dikkatleri istemez. Bir yerde trafik ayırımı, bir yerde askeri saha, bir yerde anchorage limiti öne çıkar."

Bu rota degisikliginde en dogru tavir nedir?`,
choices:[
{text:"Yeni bolgenin pilotaj, warning ve chart notlarini bastan okurum",tag:"kritik",effect:{bilgi:15,sayginlik:11}},
{text:"Eski notlarla idare etmeye calisirim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Ayni deniz ayni denizdir diye dusunurum",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s183",gfx:"galley",alert:false,day:"Gun 13",time:"20:10",loc:"Yemekhane",sub:"Sessiz cay molasi",who:"asci",
text:`Aksam yemegi dagildiktan sonra ortalik ilk kez sakinledi. Asci onune ince belli bardakta cay koydu.

"Bugun herkes yoruldu. Bazen gemide en buyuk luks, kimsenin senden bir sey istemedigi on dakikadir."

Bu kisa molayi nasil degerlendirirsin?`,
choices:[
{text:"Cayimi sakin sakin icip kafami toplarim",tag:"akilli",effect:{dinclik:14,sayginlik:4}},
{text:"Asciyla iki laf eder, sonra kabine gecerim",tag:"sosyal",effect:{dinclik:12,sayginlik:6}},
{text:"Mola vermeden yeni is ararim",tag:"korkak",effect:{dinclik:-4}}]},

{id:"s184",gfx:"cabin",alert:false,day:"Gun 14",time:"21:35",loc:"Stajyer Kabini",sub:"Duzenli kabin, duzenli zihin",who:"anlatici",
text:`Kabin daginmis ama gece ilk kez sakin. Yataga oturunca fark ettin: daginiklik bazen yorgunlugu daha da buyutuyor.

Kucuk bir toparlama yapsan hem oda hem zihin rahatlayacak.

Ne yaparsin?`,
choices:[
{text:"Kabinimi toparlar, su icip erken uykuya hazirlanirim",tag:"akilli",effect:{dinclik:16,bilgi:3}},
{text:"Sadece yatagi duzeltip biraz nefes alirim",tag:"itaatkar",effect:{dinclik:11}},
{text:"Bosverip telefona gomulurum",tag:"korkak",effect:{dinclik:-5}}]},

{id:"s185",gfx:"sea",alert:false,day:"Gun 11",time:"05:55",loc:"Acik Güverte - Gunes Dogarken",sub:"Ufka bakip toparlanmak",who:"hasan",
text:`Hasan omzunla hafifce dokundu.

"Gel," dedi, "iki dakika sadece ufka bak. Denizde bazen insanin kafasini yine deniz toplar."

Gunes daha yeni cizgiye degiyor. Geminin sesi bile daha yumusak geliyor.

Ne yaparsin?`,
choices:[
{text:"Sessizce ufka bakip nefesimi duzenlerim",tag:"akilli",effect:{dinclik:13,cesaret:3}},
{text:"Hasanla kisa bir sohbet edip rahatlarim",tag:"sosyal",effect:{dinclik:11,sayginlik:5}},
{text:"Buna vakit yok deyip geri donerim",tag:"korkak",effect:{dinclik:-3}}]},

{id:"s186",gfx:"harbor",alert:false,day:"Gun 12",time:"15:50",loc:"Kic Güverte",sub:"Is bitti, su molasi",who:"lostromo",
text:`Zor bir isin ardindan lostromo ilk kez acele etmedi. Sadece su uzatti.

"Kahramanlik sonra. Once su ic. Yorgun adam hatayi fark etmez."`
,
choices:[
{text:"Suyu icip kisa mola veririm",tag:"itaatkar",effect:{dinclik:13,sayginlik:5}},
{text:"Mola sirasinda bugunku isi kafamda toparlarim",tag:"akilli",effect:{dinclik:11,bilgi:4}},
{text:"Dinlenmeden devam ederim",tag:"korkak",effect:{dinclik:-4,cesaret:2}}]},

{id:"s187",gfx:"cabin",alert:false,day:"Gun 10",time:"13:20",loc:"Stajyer Kabini",sub:"Yirmi dakikalik gercek dinlenme",who:"anlatici",
text:`Bu kez elinde gercek bir bosluk var: ne alarm bekleniyor ne de hemen cagrilacaksin.

Gemide uzun tatil yok ama dogru kullanilan yirmi dakika bazen yarim gece kadar degerli gelir.

Bu arayi nasil kullanirsin?`,
choices:[
{text:"Alarm kurup kisa ama derin bir uyku alirim",tag:"kritik",effect:{dinclik:18,bilgi:2}},
{text:"Uzanir, gozlerimi kapatip bedenimi dinlendiririm",tag:"itaatkar",effect:{dinclik:13}},
{text:"Dinlenmek yerine telefonda oyalanirim",tag:"korkak",effect:{dinclik:-5}}]},

{id:"s187b",gfx:"sea",alert:false,day:"Gun 9",time:"07:05",loc:"Acik GÃ¼verte - Serin Sabah",sub:"Vardiya once kisa esneme",who:"hasan",
text:`Hasan seni korkuluga yaslanmis gorunce guldu.

"Iki dakika omuz ac, sirtini ac, derin nefes al. Denizde bedenini ihmal edenin dikkati de dagilir."

Sabah serin ama temiz. Kisa bir toparlanma sansin var.`,
choices:[
{text:"Kisa esneme yapip nefesimi duzenlerim",tag:"akilli",effect:{dinclik:13,cesaret:2}},
{text:"Hasanla birlikte kisa tur atarim",tag:"sosyal",effect:{dinclik:8,sayginlik:4}},
{text:"Buna da vakit yok diyip gecerim",tag:"korkak",effect:{dinclik:-3}}]},

{id:"s187c",gfx:"galley",alert:false,day:"Gun 8",time:"05:40",loc:"Yemekhane",sub:"Erken kahvalti toparlanmasi",who:"asci",
text:`Asci erken kalkmis olanlara sessiz bir masa birakti.

"Bos mideyle vardiya tutulmaz," dedi. "Duzgun bir sey ye, bir cay ic; sonra ne dusuneceksen dusunursun."

Onunde sicak cay, peynir, ekmek ve zeytin var.`,
choices:[
{text:"Yavas yiyip bedenimi vardiyaya hazirlarim",tag:"akilli",effect:{dinclik:14,sayginlik:3}},
{text:"Kisa ama duzgun bir kahvalti yapip cikiyorum",tag:"itaatkar",effect:{dinclik:12}},
{text:"Aceleyle gecistirip neredeyse hic yemem",tag:"korkak",effect:{dinclik:-4}}]},

{id:"s187d",gfx:"cabin",alert:false,day:"Gun 11",time:"21:50",loc:"Stajyer Kabini",sub:"Ilik dus ve erken toparlanma",who:"anlatici",
text:`Gun boyunca uzerine sinen tuz, yag ve yorgunluk tenine yapismis gibi.

Bazen uzun konusmalar degil, ilik bir dus ve temiz tisort insanin zihnini de sifirlar.

Gece seni yormadan toparlanma sansi veriyor.`,
choices:[
{text:"Ilk is dus alip temiz kiyafetle erkenden uzanirim",tag:"kritik",effect:{dinclik:17,sayginlik:3}},
{text:"Yuzumu yikayip kisa bir toparlanma yaparim",tag:"itaatkar",effect:{dinclik:11}},
{text:"Ugrasmak istemeyip oldugu gibi yatağa girerim",tag:"korkak",effect:{dinclik:-3}}]},

{id:"s187e",gfx:"harbor",alert:false,day:"Gun 12",time:"10:45",loc:"Kic GÃ¼verte",sub:"Golgede on dakikalik nefes",who:"lostromo",
text:`Lostromo bu kez seni daha sert ise surmedi. Sadece eliyle golgeyi isaret etti.

"Gunes tepene bindiginde kafa da agirlasir. On dakika golge, su ve sessizlik bazen ikinci kahve gibidir."

Nadir gelen kisa bir ara bu.`,
choices:[
{text:"Golgeye gecip su icer, kendimi toplarim",tag:"akilli",effect:{dinclik:13,sayginlik:4}},
{text:"Otuz saniye dinlenip yine ise donerim",tag:"itaatkar",effect:{dinclik:10}},
{text:"Mola vermeden devam etmeyi marifet sayarim",tag:"korkak",effect:{dinclik:-4,cesaret:2}}]},

{id:"s187f",gfx:"night",alert:false,day:"Gun 10",time:"23:10",loc:"Kopruustu - Gece Sonu",sub:"Nobet cikisi sessiz toparlanma",who:"z2",
text:`Nobet cikisinda 2. Zabit seni hemen yollamadi.

"Kabinine kosmadan once bir dakika ritmini dusur," dedi. "Gece vardiyasindan sonra zihin hala tam gaz giderse uyku da gec gelir."

Kopruustunde sessizce nefes alacak kadar zamanin var.`,
choices:[
{text:"Bir dakika yavaslayip sonra kabine inerim",tag:"akilli",effect:{dinclik:12,bilgi:2}},
{text:"Kisa bir tesekkur edip sakin adimla cikarim",tag:"itaatkar",effect:{dinclik:10,sayginlik:3}},
{text:"Hizli hizli telefona gomulup ritmimi daha da bozarim",tag:"korkak",effect:{dinclik:-4}}]},

{id:"s187g",gfx:"sea",alert:false,day:"Gun 12",time:"16:40",loc:"Acik GÃ¼verte - Pruva Tarafi",sub:"Bes dakikalik temiz hava molasi",who:"hasan",
text:`Hasan bu kez seni sadece korkuluga yasladi.

"Bazen insanin ihtiyaci tavsiye degil, bes dakikalik temiz hava," dedi.

Ruzgar sert degil. Kisa bir nefes arasi var.`,
choices:[
{text:"Basimi toparlayip ufka bakar, ritmimi sakinlestiririm",tag:"akilli",effect:{dinclik:13,cesaret:2}},
{text:"Hasanla iki laf edip gulerek rahatlarim",tag:"sosyal",effect:{dinclik:11,sayginlik:4}},
{text:"Buna da vakit kaybi der, hemen donerim",tag:"korkak",effect:{dinclik:-3}}]},

{id:"s187h",gfx:"galley",alert:false,day:"Gun 9",time:"21:15",loc:"Yemekhane",sub:"Geceye sicak corbayla girmek",who:"asci",
text:`Asci ses etmeden bir kase corba koydu.

"Yorgunken mide de, kafa da cabuk dagilir," dedi. "Sicak bir sey ic, geceyi daha duzgun gecirirsin."

Masa sakin, ortam yumusak.`,
choices:[
{text:"Corbayi yavas yavas icip bedenimi toplarim",tag:"akilli",effect:{dinclik:15,sayginlik:3}},
{text:"Kisa bir tesekkur edip sessizce bitiririm",tag:"itaatkar",effect:{dinclik:11}},
{text:"Acele edip yari birakir, cikarim",tag:"korkak",effect:{dinclik:-3}}]},

{id:"s187i",gfx:"cabin",alert:false,day:"Gun 13",time:"14:05",loc:"Stajyer Kabini",sub:"Perdeyi cekip gozleri dinlendirmek",who:"anlatici",
text:`Kabinin ici bu kez nispeten sessiz. Disarisi hala calisiyor ama senin gozlerin ve kafan yorulmus.

Tam uyumasan bile, perdeyi cekip birkaç dakika karanlikta kalmak bile fark yaratabilir.`,
choices:[
{text:"Telefonu ters cevirip gozlerimi gercekten dinlendiririm",tag:"kritik",effect:{dinclik:17,bilgi:2}},
{text:"Yataga uzanip bedenimi gevsetirim",tag:"itaatkar",effect:{dinclik:12}},
{text:"Yine ekrana bakip zihnimi daha da yoruyorum",tag:"korkak",effect:{dinclik:-4}}]},

{id:"s187j",gfx:"harbor",alert:false,day:"Gun 14",time:"11:30",loc:"Iskele Ustu",sub:"Guneşten cekilip kisa oturma molasi",who:"lostromo",
text:`Lostromo bu kez seni kosusturmak yerine bir baba kenarina oturttu.

"Mola da is kadar ciddidir," dedi. "Yorulan adam once gozden, sonra kafadan kacar."

Liman sakin. Uzerindeki baski bir anligina gevseyebilir.`,
choices:[
{text:"Suyu yudumlayip iki dakika hicbir sey yapmam",tag:"akilli",effect:{dinclik:13,sayginlik:4}},
{text:"Etrafi izleyip sonra toplu sekilde ise donerim",tag:"itaatkar",effect:{dinclik:10,bilgi:2}},
{text:"Oturmaya utanip hemen kalkarim",tag:"korkak",effect:{dinclik:-3,cesaret:1}}]},

{id:"s188",gfx:"harbor",alert:false,day:"Gun 9",time:"06:25",loc:"Iskele Bordi - Draft Marklari",sub:"Draft okuma disiplini",who:"z1",
text:`1. Zabit seni bordaya aldi. Su sakin ama markalar gozu aldatiyor.

"Draft okumak sadece rakam gormek degil. Meniskus, dalga, boya izleri ve markanin tam ortasi seni kandirabilir. Forward, aft ve gerekirse midship birlikte okunur."

Sana gore en dogru stajyer yaklasimi nedir?`,
choices:[
{text:"Meniskusu dogru yerden okuyup iskele-sancak, bas-kic farklarini karsilastiririm",tag:"kritik",effect:{bilgi:15,sayginlik:12}},
{text:"Tek taraftaki rakami gorup yeterli sayarim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Dalga varken tam okumaya gerek yok derim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s189",gfx:"bridge",alert:false,day:"Gun 9",time:"06:50",loc:"Koprustu - Draft Raporu",sub:"Mean draft nasil yorumlanir?",who:"z1",
text:`Okumayi bitirince 1. Zabit notlarini istedi.

"Sadece sayiyi soylemek yetmez. Forward draft, aft draft ve gerekiyorsa mean draft yorumu gerekir. Bazen ukc, bazen loadicator, bazen PSC icin bu veri hayatidir."

Raporu nasil toparlarsin?`,
choices:[
{text:"Bas ve kic drafti net verip trim yorumunu ekler, gerekiyorsa mean draft hesabi dusunurum",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
{text:"En buyuk gordugum rakami soyler gecerim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Rakamlar yakin zaten diye ayrinti vermem",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}]},

{id:"s190",gfx:"bogaz",alert:false,day:"Gun 7",time:"06:45",loc:"Pilot Station",sub:"Pilot alma oncesi son emniyet kontrolu",who:"z2",
text:`Pilot botu gorundu ama daha is bitmedi.

2. Zabit tekrar etti: "Pilot ladder acildi diye is tamam sanma. Secured side, spreader kullanimi, manrope, can simidi, can kurtarma isigi, heaving line hazirligi ve freeboard uyumu son kez gozden gecirilir."

En kritik son bakisin ne olur?`,
choices:[
{text:"Ladder baglari, spreader duzeni, aydinlatma ve standby personeli birlikte son kez kontrol ederim",tag:"kritik",effect:{bilgi:15,sayginlik:12,cesaret:4}},
{text:"Bir kez kurulduysa tekrar bakmaya gerek yok derim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Pilot profesyonel, eksigi kendi idare eder diye dusunurum",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s191",gfx:"bridge",alert:false,day:"Gun 7",time:"07:20",loc:"Koprustu - Pilot Geldi",sub:"Pilot varken nelere dikkat edilir?",who:"suvari",
text:`Pilot kopruustu'ne cikti ama suvari sesi sakindi:

"Pilot bordada diye sorumluluk devrolmaz. Bridge team hala aktif olur. Komutlar tekrar edilir, pozisyon izlenir, tug ve VTS haberlesmesi dinlenir, geminin manevrasi capraz kontrol edilir."

Bu anda en dogru tutum hangisi?`,
choices:[
{text:"Pilotu izlerken rota, komut tekrar ve bridge team cross-check disiplinini surdururum",tag:"kritik",effect:{bilgi:15,sayginlik:12}},
{text:"Pilot geldiyse artik sadece izlemek yeter sanirim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Pilot varken kopruustunde dikkat dagitacak sekilde rahatlarim",tag:"korkak",effect:{bilgi:-9,sayginlik:-9}}]},

{id:"s192",gfx:"harbor",alert:false,day:"Gun 8",time:"11:15",loc:"Iskele Bordi - Load Line",sub:"Summer mark mi tropical mark mi?",who:"z1",
text:`1. Zabit load line markasini gosterdikten sonra sordu:

"Plimsoll cizgisi sus olsun diye vurulmaz. Summer mark, tropical mark, winter mark, fresh water mark... hepsi emniyet payinin baska hali. Hangi hatta kadar yukleyebilecegin rota, bolge ve suyun ozelligiyle ilgilidir."

Sana gore burada temel mantik nedir?`,
choices:[
{text:"Yukleme hattinin mevsim, bolge ve su yogunluguna gore degistigini; markalarin serbest bordayi korudugunu soylerim",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
{text:"Gemide tek bir yukleme siniri vardir derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Markalar daha cok boyanin parcasi gibi gelir",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s193",gfx:"compass",alert:false,day:"Gun 8",time:"12:05",loc:"Yuk Ofisi - Draft Survey",sub:"Mini draft survey hesabi",who:"z1",
text:`1. Zabit kagida iki not birakti:

"Ilk survey 12480 ton, son survey 13195 ton deplasmana denk geldi. Basitlestirilmis haliyle aradaki fark bize yuklenen miktarin cekirdegini verir. Tabii gercekte density, ballast, constant ve diger duzeltmeler de girer."

Bu mini hesapta ilk sonuc ne cikar?`,
calc:buildCalcPrompt(715,'ton','yukleme farki = son survey - ilk survey',2,'5 ton icinde'),
choices:[
{text:"Yaklasik 715 ton fark oldugunu, bunun da temel yukleme farki olarak yorumlanacagini soylerim",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
{text:"Rakamlar buyuk diye kafadan kesin yorum yapmam derim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Ikisini toplayip sonuc ararim",tag:"korkak",effect:{bilgi:-11,sayginlik:-8}}]},

{id:"s194",gfx:"bridge",alert:false,day:"Gun 7",time:"06:58",loc:"Koprustu - Pilot Card",sub:"Pilot card doldurma disiplini",who:"z2",
text:`Pilot station oncesi 2. Zabit pilot card'i onune koydu.

"Pilot card, geminin kendini tanittigi kisa ozettir. LOA, beam, draft, air draft, ana makine tipi, pervane yonu, bow thruster, rudder bilgisi, maneuvering notlari... bunlar pilot icin laf degil emniyettir."

Bu kartta en dogru tavrin ne olur?`,
choices:[
{text:"Boyut, draft, manevra karakteri ve mevcut kisitlari net ve guncel bilgilerle doldururum",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
{text:"Eski bir pilot card varsa onu degistirmeden kullanmak yeter derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Pilot zaten gemiyi gorur, karta fazla gerek yok diye dusunurum",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s195",gfx:"harbor",alert:false,day:"Gun 8",time:"13:10",loc:"Yuk Ofisi - Fresh Water Allowance",sub:"Tatli suya girince draft nasil degisir?",who:"z1",
text:`1. Zabit loadicator yaninda bir not daha acti.

"Gemi deniz suyundan tatli suya girince biraz daha batar. Fresh Water Allowance dedigimiz fark bu yuzden onemli. Bazen kanal girisinde, bazen nehir limaninda bu payi dusunmeden rapor veremezsin."

Temel mantigi nasil anlatirsin?`,
choices:[
{text:"Tatli suyun yogunlugu daha dusuk oldugu icin geminin ayni yukte biraz daha fazla draft yapacagini soylerim",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
{text:"Su tatliysa draft ayni kalir derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Bu farkin pratikte onemsiz oldugunu dusunurum",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s196",gfx:"bridge",alert:false,day:"Gun 9",time:"17:25",loc:"Koprustu - Alcak Kopru Gecisi",sub:"Air draft ve kopru altı acikligi",who:"suvari",
text:`Suvari nehir gecisi brifinginde eliyle yukariyi isaret etti.

"Herkes drafti dusunur; iyi zabit air draft'i da dusunur. Mast, anten, crane boom, ballast durumu ve gel-git birlikte okunmadan alcak kopru altina girilmez."

Sana gore en dogru hesap mantigi ne?`,
choices:[
{text:"Geminin mevcut air draftini su seviyesi ve kopru altı acikligi ile karsilastirir, emniyet payi birakirim",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
{text:"Charttaki yukseklik yaziyorsa dogrudan yeter derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Sadece goz karariyla sigar diye dusunurum",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s197",gfx:"compass",alert:false,day:"Gun 9",time:"18:05",loc:"Stability Booklet - Trim Correction",sub:"Trim correction ve hog-sag farki",who:"z1",
text:`1. Zabit cetveli masaya koydu.

"Draft okumak tek basina yetmez. Trim correction, bazen hog-sag etkisi, bazen de ortalama draft yorumunu degistirir. Ozellikle survey'de 'gordugum rakam budur' demek yerine neyi neden duzelttigini bilirsin."

Buradaki temel zabit refleksi ne olmali?`,
choices:[
{text:"Gorulen draftlari dogrudan almak yerine trim etkisi ve gerekiyorsa hog-sag farkini dikkate alirim",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
{text:"Bas ve kic yakin gorunuyorsa duzeltmeye gerek yok derim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Survey hesaplarinin fazla ayrinti oldugunu dusunurum",tag:"korkak",effect:{bilgi:-11,sayginlik:-9}}]},

{id:"s198",gfx:"compass",alert:false,day:"Gun 9",time:"18:35",loc:"Yuk Ofisi - TPC / MCTC",sub:"Ton basina cokus ve trim momenti",who:"z1",
text:`1. Zabit kagidin kenarina iki kisaltma yazdi: TPC ve MCTC.

"Bir limanda 120 ton daha yuk alirsan gemi kac santim daha coker, trim ne kadar degisir; bunu hisle degil tabloyla dusunursun. TPC ton basina cokus, MCTC ise 1 cm trim degisimi icin gereken momenttir."

Sana gore bu iki deger neyi saglar?`,
choices:[
{text:"Ek yuklemenin draft ve trim etkisini onceden ongormeyi saglar derim",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
{text:"Sadece survey sonunda lazim olur derim",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Pratikte tablolar yerine goz karari yeter derim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s199",gfx:"engine",alert:false,day:"Gun 10",time:"08:25",loc:"Tank Sounding Defteri",sub:"Sounding ve ullage tablosu",who:"carkci",
text:`Bascarkci tank defterini acti.

"Ayni tanki iki kisi farkli gozle okuyabilir; ama tablo bir tanedir. Sounding dipten yuksekligi, ullage ise tank ustunden boslugu anlatir. Kalibrasyon tablosu olmadan hacim yorumu eksik kalir."

En dogru stajyer refleksi hangisi?`,
choices:[
{text:"Okumayi tabloyla eslestirip sounding/ullage farkini net ayiririm",tag:"kritik",effect:{bilgi:15,sayginlik:11}},
{text:"Rakam varsa tabloya her zaman gerek olmadigini dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Sounding ile ullage ayni seydir diye gecerim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},

{id:"s200",gfx:"bridge",alert:true,day:"Gun 10",time:"09:40",loc:"Loadicator Terminali",sub:"Yanlis veri girildi alarmi",who:"z1",
text:`Loadicator ekrani sari uyari verdi. Girilen ballast verilerinden biri rapordaki sounding ile tutusmuyor.

1. Zabit sana bakti: "Loadicator'a güven ama kör güvenme. Yanlis veri girersen en guzel hesap bile seni yaniltir. Alarm susturmak cozum degil; hatayi bulmak gerekir."

Ilk ne yaparsin?`,
choices:[
{text:"Girilen sounding, tank secimi ve raporlanan degerleri tek tek capraz kontrol ederim",tag:"kritik",effect:{bilgi:16,sayginlik:12,cesaret:3}},
{text:"Alarmi gecici kapatip sonra bakariz derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Loadicator sasirmistir diye dusunurum",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},

{id:"s201",gfx:"compass",alert:false,day:"Gun 10",time:"10:20",loc:"Stability Booklet - Free Surface",sub:"Free surface effect mini hesap",who:"z1",
text:`1. Zabit onceki notlara bir satir daha ekledi.

"Baslangic GM 1.60 metre. Slack tanklardan gelen free surface correction 0.22 metre. Bunu kafanda duseceksin; cunku serbest yuzey bazen hic gorunmeden stabiliteyi yer."

Bu mini hesapta corrected GM kac olur?`,
calc:buildCalcPrompt(1.38,'m','corrected GM = baslangic GM - free surface correction',2,'0.05 m icinde'),
choices:[
{text:"1.38 metre civari olur derim",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
{text:"1.82 metre olur derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Free surface GM'i etkilemez diye dusunurum",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},

{id:"s202",gfx:"engine",alert:false,day:"Gun 11",time:"07:45",loc:"Ballast Kontrol Paneli",sub:"Ballast exchange ve MARPOL disiplini",who:"carkci",
text:`Bascarkci ballast planini acip cizgi cekti.

"Ballast exchange bazen prosedur, bazen zorunluluktur. Ama rastgele yapilmaz. Gemi emniyeti, tank sirasi, deniz durumu ve ilgili MARPOL / ballast water gereklilikleri birlikte okunur. Kayitsiz is, yapilmamis is sayilir."

En dogru zabit refleksi hangisi?`,
choices:[
{text:"Exchange planini emniyet, tank sirasi, hava durumu ve resmi kayitlarla birlikte yuruturum",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
{text:"Sadece pompalar calissin yeter diye dusunurum",tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
{text:"Kural kismi ikinci planda, once hizli bitirelim derim",tag:"korkak",effect:{bilgi:-10,sayginlik:-10}}]},

{id:"s203",gfx:"storm",alert:false,day:"Gun 11",time:"19:10",loc:"Koprustu - Heavy Weather Plan",sub:"Agir hava ballast plani karari",who:"suvari",
text:`Hava raporu sertlesiyor. Suvari ballast planinin uzerine egildi.

"Agir havada sadece rotayi degil, geminin oturusunu da dusunursun. Fazla serbest yuzey istemezsin, gereksiz yuksekte agirlik istemezsin, ama her tanki da kafana gore dolduramazsin. Heavy weather ballast plani denge ile emniyet arasindadir."

Ne dersin?`,
choices:[
{text:"Serbest yuzeyi azaltan, emniyetli trim veren ve yapisal sinirlari koruyan bir plan dusunurum",tag:"kritik",effect:{bilgi:17,sayginlik:12,cesaret:3}},
{text:"Hava sertse rastgele daha cok su almak yeter sanirim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
{text:"Ballast planinin havayla ciddi ilgisi olmadigini dusunurum",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},

{id:"FINAL",gfx:"bridge",alert:false,day:"Son Gün",time:"15:00",loc:"Konferans Salonu",sub:"Staj değerlendirme — kontrat sona erdi",who:"z1",
text:`Son değerlendirme toplantısı.\n\n1. Zabiti, 2. Zabiti, Lostromo. Önlerinde staj formu.\n\n"${n}. ${yr} yılında, ${sn}'de. Fırtına, yük denetimi, gece nöbetleri, yangın tatbikatı, liman operasyonları, krizler.\n\nRaporun birinci satırına ne yazayım?"`,
choices:[
{text:"'Öğrenmeye hazır bir denizci' — alçakgönüllü",tag:"akilli",effect:{bilgi:10,sayginlik:15},next:'end'},
{text:"'Bu hayatı seçiyorum — her zorluğuyla'",tag:"cesur",effect:{cesaret:15,sayginlik:12},next:'end'},
{text:"'Henüz tam emin değilim ama devam edeceğim'",tag:"itaatkar",effect:{sayginlik:8,bilgi:5},next:'end'}]},
  ];
}

// ===== KONTRAT SİSTEMİ =====
const KONTRAT_DEFS={
  kuru:[{ay:6,izin:1,ucret:"Orta",bonus:"Kuru yük sertifikası"},{ay:9,izin:2,ucret:"Orta+",bonus:"Uzun seyir tecrübesi"}],
  tanker:[{ay:4,izin:1,ucret:"Yüksek",bonus:"Tanker sertifikası (OOW)"},{ay:6,izin:1,ucret:"Yüksek+",bonus:"MARPOL uzmanlığı"}],
  kont:[{ay:4,izin:1,ucret:"Yüksek",bonus:"Hızlı lojistik deneyimi"},{ay:6,izin:2,ucret:"Çok Yüksek",bonus:"Konteyner planlaması"}],
  roro:[{ay:3,izin:1,ucret:"Orta",bonus:"Araç operasyon sertifikası"},{ay:5,izin:1,ucret:"Orta+",bonus:"Trim uzmanlığı"}],
  bulk:[{ay:6,izin:2,ucret:"Orta",bonus:"Dökme yük sertifikası"},{ay:9,izin:2,ucret:"Orta+",bonus:"Trim ve stabilite"}],
  lng:[{ay:4,izin:1,ucret:"Çok Yüksek",bonus:"IGF temel sertifikası"},{ay:6,izin:2,ucret:"Maksimum",bonus:"LNG uzman sertifikası"}],
};

// ===== OYUN DEĞİŞKENLERİ =====
let pn="Stajyer", sn="M/V Ege Meltem";
let selYear=2018, selType="kuru", selKontrat=0;
let stats={cesaret:40,bilgi:22,sayginlik:32,dinclik:68};
let scenes=[], currentIdx=0, choicesMade=[];
let contractDays=0, contractTotal=6;
let sceneQueue=[], usedScenes=new Set();
const START_PORTS=[
  {name:"İzmir", dock:"İzmir Limanı — İskele", office:"İzmir Limanı — Limancı Ofisi", departureLine:"İzmir Körfezi geride kaldı", x:85, y:130},
  {name:"İstanbul", dock:"İstanbul Limanı — Rıhtım", office:"İstanbul Limanı — Limancı Ofisi", departureLine:"Marmara ufku geride kaldı", x:180, y:85},
  {name:"Çanakkale", dock:"Çanakkale Limanı — Rıhtım", office:"Çanakkale Limanı — Limancı Ofisi", departureLine:"Boğaz geride kaldı", x:130, y:100},
  {name:"Pire", dock:"Pire Limanı — Terminal", office:"Pire Limanı — Limancı Ofisi", departureLine:"Pire rıhtımı geride kaldı", x:120, y:160},
  {name:"İskenderiye", dock:"İskenderiye Limanı — Yük İskelesi", office:"İskenderiye Limanı — Limancı Ofisi", departureLine:"İskenderiye mendireği geride kaldı", x:200, y:210},
  {name:"Cenova", dock:"Cenova Limanı — Konteyner Rıhtımı", office:"Cenova Limanı — Limancı Ofisi", departureLine:"Ligurya kıyısı geride kaldı", x:60, y:80},
  {name:"Marsilya", dock:"Marsilya Limanı — Terminal", office:"Marsilya Limanı — Limancı Ofisi", departureLine:"Provence kıyıları geride kaldı", x:40, y:92},
  {name:"Napoli", dock:"Napoli Limanı — Rıhtım", office:"Napoli Limanı — Limancı Ofisi", departureLine:"Napoli Körfezi yavaşça geride kaldı", x:88, y:120},
  {name:"Hamburg", dock:"Hamburg Limanı — Rıhtım", office:"Hamburg Limanı — Limancı Ofisi", departureLine:"Elbe hattı arkada kaldı", x:42, y:10},
  {name:"Limasol", dock:"Limasol Limanı — Terminal", office:"Limasol Limanı — Limancı Ofisi", departureLine:"Kıbrıs kıyısı iskelede kaldı", x:176, y:172},
  {name:"Cidde", dock:"Cidde Limanı — Ticari Rıhtım", office:"Cidde Limanı — Limancı Ofisi", departureLine:"Kızıldeniz hattı açılmaya başladı", x:260, y:210},
  {name:"Dubai", dock:"Dubai Limanı — Jebel Ali Terminali", office:"Dubai Limanı — Limancı Ofisi", departureLine:"Basra Körfezi trafiği arkada kaldı", x:336, y:218},
  {name:"Tanger Med", dock:"Tanger Med — Konteyner Terminali", office:"Tanger Med — Limancı Ofisi", departureLine:"Cebelitarık trafiği kıç omuzlukta kaldı", x:6, y:118},
  {name:"Anvers", dock:"Anvers Limanı — Ticari Rıhtım", office:"Anvers Limanı — Limancı Ofisi", departureLine:"Scheldt hattı kıçta kaldı", x:28, y:14},
  {name:"Singapur", dock:"Singapur Limanı — Terminal", office:"Singapur Limanı — Limancı Ofisi", departureLine:"Malakka trafiği arkada kaldı", x:350, y:166},
  {name:"Şanghay", dock:"Şanghay Limanı — Konteyner Rıhtımı", office:"Şanghay Limanı — Limancı Ofisi", departureLine:"Yangtze ağzı kıçta kaldı", x:392, y:78},
  {name:"Panama", dock:"Balboa Terminali — Panama", office:"Panama Acentesi", departureLine:"Panama Kanalı geçişi ufukta kaldı", x:18, y:170},
  {name:"New Orleans", dock:"New Orleans Limanı — Mississippi Rıhtımı", office:"New Orleans Acentesi", departureLine:"Mississippi deltası arkada kaldı", x:36, y:128},
  {name:"Santos", dock:"Santos Limanı — Terminal", office:"Santos Acentesi", departureLine:"Brezilya kıyısı kıç omuzlukta kaldı", x:58, y:236},
  {name:"Yokohama", dock:"Yokohama Limanı — Rıhtım", office:"Yokohama Acentesi", departureLine:"Japon kıyıları yavaşça geride kaldı", x:414, y:86},
];
const START_SCENARIOS=[
  {time:"05:30", subPrefix:"Sabah sisi", intro:"Sabah erken, rıhtımın üstünde ince sis var.", bridgeCall:"Rampadan biri indi: \"Sen stajyer ${n} misin? 1. Zabiti köprüde bekliyor.\""},
  {time:"06:10", subPrefix:"Yağmurlu vardiya", intro:"Yagmur ciseliyor. Rihtim islak, halatlar koyu renk kesilmis gibi parliyor.", bridgeCall:"Vardiya devrinden cikan bir tayfa seni gorunce bagirdi: \"Stajyer sensen cabuk ol, kopru seni bekliyor.\""},
  {time:"04:50", subPrefix:"Gece sonu telaşı", intro:"Gece daha tam dağılmamış. Projektörler güverteyi beyaz kesiyor, liman yarı uykuda.", bridgeCall:"Nöbetçi zabit merdiven ağzından seslendi: \"Geç kalmadın. Belgelerinle yukarı çık.\""},
  {time:"07:00", subPrefix:"Liman uğultusu", intro:"Forklift sesleri, vinç alarmları ve martı çığlıkları birbirine karışıyor.", bridgeCall:"Ajans görevlisi seni gemiye teslim ederken fısıldadı: \"İlk günün sert geçer, dikkatli ol.\""},
];
let selectedStartPort=START_PORTS[0];
let selectedStartScenario=START_SCENARIOS[0];
function buildBirthdaySurpriseScene(){
  return {
    id:"s_birthday_surprise",
    gfx:"galley",
    alert:false,
    day:"Gun 14",
    time:"20:40",
    loc:"Yemekhane",
    sub:"Murettebattan surpriz dogum gunu",
    who:"asci",
text:`Aksam yemeginden sonra ortalik bir anda sakinlesti. Sonra isiklar kisildi.

Mehmet Usta elinde kucuk ama ciddi emek verilmis bir pasta ile ortaya cikti. Lostromo, 1. Zabiti ve tayfalar bir agizdan gulerek sana bakti.

"Dogum gununu sonunda bizden saklayamadin stajyer," dedi Asci. "Denizde dogum gunu sessiz gecmez."

Bir anligina gemi, vardiya ve yorgunluk geri cekildi. Bu kez sira sendeydi.`,
    choices:[
      {text:"Gulup herkese tesekkur et, pastayi birlikte kes",tag:"sosyal",effect:{sayginlik:16,dinclik:12,cesaret:4}},
      {text:"Ozellikle emegi gecenleri tek tek anip sakin bir tesekkur konusmasi yap",tag:"kritik",effect:{sayginlik:18,bilgi:4,dinclik:9}},
      {text:"Utanip kisa bir tesekkurle yerine gec",tag:"itaatkar",effect:{sayginlik:9,dinclik:8}}
    ]
  };
}
const DIFFICULTY={
  positiveGainMult:0.72,
  negativeLossMult:1.18,
  highStatThreshold:70,
  extremeStatThreshold:85,
  highStatGainMult:0.55,
  extremeStatGainMult:0.5,
  passiveFatigue:1,
  periodicStressEvery:5,
  periodicStressLoss:1,
};
const SYSTEM_STATE={
  consecutiveMistakes:0,
  totalMistakes:0,
  hiddenFailures:{bridge:0,deck:0,engine:0,compliance:0},
  triggeredChains:new Set(),
};

const ECDIS_ROUTE_PLANS={
  izmir_messina_south:{
    label:'IZMIR-MESSINA GUNEY',
    line:'118,92 156,86 198,90 238,80 278,84 318,74 354,78',
    waypoints:[
      {x:118,y:92,name:'WP1'},
      {x:156,y:86,name:'WP2'},
      {x:198,y:90,name:'TSS'},
      {x:238,y:80,name:'WP3'},
      {x:278,y:84,name:'MALTA'},
      {x:318,y:74,name:'WP4'},
      {x:354,y:78,name:'MSN'}
    ],
    warning:'SAFETY 30m'
  },
  canakkale_pire_direct:{
    label:'CANAKKALE-PIRE DIRECT',
    line:'102,86 146,74 188,70 228,78 266,90 304,102 344,106',
    waypoints:[
      {x:102,y:86,name:'CNK'},
      {x:146,y:74,name:'WP1'},
      {x:188,y:70,name:'TSS'},
      {x:228,y:78,name:'WP2'},
      {x:266,y:90,name:'WP3'},
      {x:304,y:102,name:'AEG'},
      {x:344,y:106,name:'PIR'}
    ],
    warning:'XTD 0.50'
  },
  iskenderiye_suveys_north:{
    label:'ISKENDERIYE-SUVEYS',
    line:'120,108 156,98 188,92 222,88 262,82 304,76 346,66',
    waypoints:[
      {x:120,y:108,name:'ALX'},
      {x:156,y:98,name:'WP1'},
      {x:188,y:92,name:'TIDE'},
      {x:222,y:88,name:'WP2'},
      {x:262,y:82,name:'SEP'},
      {x:304,y:76,name:'WP3'},
      {x:346,y:66,name:'SUE'}
    ],
    warning:'UKC MON'
  }
};
let activeEcdisPlanKey='izmir_messina_south';
const RADAR_TRAINING_MODES={
  cpa_watch:{
    label:'RADAR WATCH',
    targets:[
      {x:266,y:48,r:3.2,color:'#1aff50',tag:'TGT A',meta:'CPA 1.2'},
      {x:282,y:86,r:2.8,color:'#d4a017',tag:'TGT B',meta:'TCPA 14'},
      {x:208,y:60,r:2.3,color:'#6fa8dc',tag:'ECHO',meta:'2.8 NM'},
      {x:252,y:106,r:2.1,color:'#1aff50',tag:'AFT',meta:'3.6 NM'}
    ],
    vector:'240,72 266,48',
    footer:'RNG 6 NM  RM UP'
  },
  parallel_index:{
    label:'PARALLEL INDEX',
    targets:[
      {x:258,y:58,r:3,color:'#1aff50',tag:'SAFE',meta:'PI'},
      {x:286,y:77,r:2.7,color:'#d4a017',tag:'COAST',meta:'0.6'},
      {x:216,y:82,r:2.2,color:'#6fa8dc',tag:'XTD',meta:'0.3'}
    ],
    vector:'240,72 286,77',
    piLine:'188,92 292,54',
    footer:'PI SET 0.8 NM'
  },
  xtd_alarm:{
    label:'XTD MONITOR',
    targets:[
      {x:272,y:56,r:3.2,color:'#c93030',tag:'ALM',meta:'XTD'},
      {x:290,y:84,r:2.8,color:'#d4a017',tag:'SET',meta:'1.8 KT'},
      {x:222,y:50,r:2.1,color:'#1aff50',tag:'WP',meta:'ACT'}
    ],
    vector:'240,72 272,56',
    footer:'ALARM 0.52 NM'
  },
  arpa_acquire:{
    label:'ARPA ACQUIRE',
    targets:[
      {x:270,y:52,r:3.1,color:'#1aff50',tag:'ACQ',meta:'TGT 01'},
      {x:286,y:88,r:2.7,color:'#d4a017',tag:'MAN',meta:'TGT 02'},
      {x:222,y:64,r:2.2,color:'#6fa8dc',tag:'RAW',meta:'ECHO'}
    ],
    vector:'240,72 270,52',
    footer:'ARPA 2/10 TRK'
  },
  arpa_lost:{
    label:'LOST TARGET',
    targets:[
      {x:274,y:54,r:3.1,color:'#c93030',tag:'LOST',meta:'ARPA'},
      {x:292,y:92,r:2.7,color:'#d4a017',tag:'SET',meta:'2.1 KT'},
      {x:218,y:66,r:2.2,color:'#6fa8dc',tag:'RAW',meta:'ECHO'}
    ],
    vector:'240,72 274,54',
    footer:'TRACK DROP'
  },
  trial_maneuver:{
    label:'TRIAL MANEUVER',
    targets:[
      {x:268,y:52,r:3,color:'#1aff50',tag:'CPA',meta:'SIM'},
      {x:286,y:86,r:2.6,color:'#d4a017',tag:'ALT',meta:'1.8 NM'},
      {x:226,y:88,r:2.1,color:'#6fa8dc',tag:'NOW',meta:'LIVE'}
    ],
    vector:'240,72 268,52',
    piLine:'220,96 292,48',
    footer:'TRIAL STBD 20'
  },
  clutter_tune:{
    label:'CLUTTER TUNE',
    targets:[
      {x:262,y:56,r:2.8,color:'#1aff50',tag:'ECHO',meta:'CLEAR'},
      {x:302,y:78,r:2.4,color:'#8ab0c8',tag:'RAIN',meta:'NOISE'},
      {x:226,y:94,r:2.4,color:'#8ab0c8',tag:'SEA',meta:'NOISE'}
    ],
    vector:'240,72 262,56',
    footer:'SEA 42  RAIN 18'
  },
  guard_zone:{
    label:'GUARD ZONE',
    targets:[
      {x:271,y:59,r:3.1,color:'#c93030',tag:'GZ',meta:'INBOUND'},
      {x:297,y:84,r:2.5,color:'#d4a017',tag:'EDGE',meta:'1.4 NM'},
      {x:226,y:70,r:2.1,color:'#6fa8dc',tag:'SAFE',meta:'OUT'}
    ],
    vector:'240,72 271,59',
    footer:'GUARD 0.8-2.0 NM'
  },
  ebl_vrm:{
    label:'EBL / VRM',
    targets:[
      {x:274,y:58,r:3,color:'#1aff50',tag:'TGT',meta:'045'},
      {x:246,y:36,r:2.3,color:'#8ab0c8',tag:'VRM',meta:'1.6 NM'},
      {x:300,y:74,r:2.2,color:'#d4a017',tag:'ALT',meta:'3.1 NM'}
    ],
    vector:'240,72 274,58',
    footer:'EBL 045  VRM 1.6'
  },
  display_mode:{
    label:'DISPLAY MODES',
    targets:[
      {x:268,y:54,r:3,color:'#1aff50',tag:'N-UP',meta:'TRUE'},
      {x:292,y:88,r:2.5,color:'#d4a017',tag:'H-UP',meta:'REL'},
      {x:226,y:88,r:2.3,color:'#6fa8dc',tag:'C-UP',meta:'ROUTE'}
    ],
    vector:'240,72 268,54',
    footer:'MODE COMPARE'
  },
  blind_sector:{
    label:'BLIND SECTOR',
    targets:[
      {x:274,y:52,r:2.9,color:'#d4a017',tag:'EDGE',meta:'SEEN'},
      {x:314,y:70,r:2.4,color:'#c93030',tag:'MASK',meta:'LOST'},
      {x:226,y:94,r:2.1,color:'#6fa8dc',tag:'SAFE',meta:'CLEAR'}
    ],
    vector:'240,72 274,52',
    footer:'MAST SHADOW'
  },
  interference:{
    label:'INTERFERENCE',
    targets:[
      {x:268,y:56,r:2.8,color:'#1aff50',tag:'REAL',meta:'TRACK'},
      {x:302,y:56,r:2.4,color:'#8ab0c8',tag:'INTF',meta:'FALSE'},
      {x:302,y:88,r:2.4,color:'#8ab0c8',tag:'INTF',meta:'FALSE'}
    ],
    vector:'240,72 268,56',
    footer:'RADAR INT'
  },
  shadow_sector:{
    label:'SHADOW SECTOR',
    targets:[
      {x:270,y:52,r:2.9,color:'#1aff50',tag:'OPEN',meta:'CLEAR'},
      {x:320,y:72,r:2.1,color:'#c93030',tag:'SHDW',meta:'WEAK'},
      {x:236,y:102,r:2.2,color:'#d4a017',tag:'AFT',meta:'2.4 NM'}
    ],
    vector:'240,72 270,52',
    footer:'FUNNEL SHDW'
  },
  rain_small_target:{
    label:'SMALL TARGET',
    targets:[
      {x:258,y:58,r:2.1,color:'#1aff50',tag:'SMALL',meta:'WEAK'},
      {x:300,y:82,r:2.5,color:'#8ab0c8',tag:'RAIN',meta:'CLUTTER'},
      {x:220,y:84,r:2.3,color:'#8ab0c8',tag:'SEA',meta:'NOISE'}
    ],
    vector:'240,72 258,58',
    footer:'RAIN CELL'
  },
  ais_mismatch:{
    label:'AIS / RADAR',
    targets:[
      {x:270,y:54,r:3,color:'#1aff50',tag:'RAD',meta:'2.2 NM'},
      {x:286,y:62,r:2.6,color:'#d4a017',tag:'AIS',meta:'OFFSET'},
      {x:226,y:90,r:2.2,color:'#6fa8dc',tag:'RAW',meta:'LIVE'}
    ],
    vector:'240,72 270,54',
    footer:'AIS OFF 0.3 NM'
  },
  target_swap:{
    label:'TARGET SWAP',
    targets:[
      {x:266,y:52,r:2.9,color:'#1aff50',tag:'TGT 01',meta:'SWAP?'},
      {x:286,y:76,r:2.8,color:'#d4a017',tag:'TGT 02',meta:'CROSS'},
      {x:250,y:98,r:2.3,color:'#6fa8dc',tag:'ARPA',meta:'TRACK'}
    ],
    vector:'240,72 286,76',
    footer:'TRACK MIX'
  },
  false_echo:{
    label:'FALSE ECHO',
    targets:[
      {x:268,y:54,r:2.9,color:'#1aff50',tag:'REAL',meta:'CPA 1.4'},
      {x:314,y:54,r:2.5,color:'#8ab0c8',tag:'FALSE',meta:'MIRROR'},
      {x:314,y:90,r:2.5,color:'#8ab0c8',tag:'FALSE',meta:'MIRROR'}
    ],
    vector:'240,72 268,54',
    footer:'MULTI ECHO'
  },
  multi_crossing:{
    label:'MULTI CROSSING',
    targets:[
      {x:268,y:52,r:3,color:'#c93030',tag:'CROSS A',meta:'CPA 0.8'},
      {x:296,y:74,r:2.8,color:'#d4a017',tag:'CROSS B',meta:'TCPA 12'},
      {x:250,y:102,r:2.5,color:'#1aff50',tag:'OVTK',meta:'AFT'},
      {x:214,y:70,r:2.2,color:'#6fa8dc',tag:'SAFE',meta:'PASS'}
    ],
    vector:'240,72 268,52',
    footer:'4 TGT WATCH'
  }
};
let activeRadarMode='cpa_watch';
const EXTRA_ROUTE_SCENES=[
  {id:"s204",gfx:"compass",alert:false,day:"Gun 11",time:"20:05",loc:"Koprustu - ECDIS Planning Station",sub:"Seyir plani cizimi ve waypoint secimi",who:"z2",
  text:`2. Zabiti ECDIS planning ekranini acti.

"Bu kez sadece cizgi cekmeyeceksin. Rota; waypoint, wheel-over mantigi, TSS saygisi, emniyet konturu ve raporlama noktasi ister. Yanlis bir donus acisi kagit ustunde guzel gorunse de denizde bela cikarir.

Simdi bana bu gecis icin hangi seyir planini cizecegini soyle."`,
  choices:[
  {text:"Trafik ayirim duzenini ve emniyetli suyu koruyan guneyli plani cizerim",tag:"kritik",effect:{bilgi:17,sayginlik:12},routePlanKey:"izmir_messina_south"},
  {text:"Canakkale-Pire direct gibi daha kisa ama trafik baskili bir plan denerim",tag:"akilli",effect:{bilgi:12,sayginlik:8},routePlanKey:"canakkale_pire_direct"},
  {text:"Iskenderiye-Suveys hattina benzer raporlama agirlikli bir plan kurarim",tag:"sosyal",effect:{bilgi:11,sayginlik:9},routePlanKey:"iskenderiye_suveys_north"}]},
  {id:"s205",gfx:"compass",alert:false,day:"Gun 11",time:"20:40",loc:"Koprustu - Route Check",sub:"ECDIS uzerinde cizilen rotayi dogrulama",who:"z2",
  text:`Cizdigin rota artik ekranda. 2. Zabiti parmagiyla waypoint hattini takip etti.

"Route planning'in yarisi cizmekse diger yarisi route check'tir. Safety contour, no-go alanlar, wheel-over noktasi, XTD ve reporting point'ler kontrol edilmeden bu rota canli sayilmaz."

Hangi kontrolden baslarsin?"`,
  choices:[
  {text:"Safety contour, no-go area ve wheel-over noktalarini birlikte kontrol ederim",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
  {text:"Way-pointler gorunuyorsa route hazirdir diye dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Sadece varis limanina uzaniyor olmasi yeter derim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},
  {id:"s206",gfx:"bridge",alert:false,day:"Gun 12",time:"06:20",loc:"Koprustu - Sabah Seyir Brifingi",sub:"Seyir planini ekibe anlatma ve ECDIS briefing",who:"suvari",
  text:`Sabah brifinginde suvari seni ekrana cagirdi.

"Plani cizmek kadar anlatmak da zabitliktir. ECDIS'te aktif rotayi gostereceksin; hangi waypoint'te donus var, hangi noktada reporting yapilacak, hangi kesimde emniyet payi daraliyor, hepsini ekibe net aktaracaksin."

Brifingi nasil acarsin?"`,
  choices:[
  {text:"Way-point sirasi, riskli donusler, safety contour ve reporting pointleri net anlatirim",tag:"kritik",effect:{bilgi:16,sayginlik:13,cesaret:4}},
  {text:"Rotayi acip ekip ekrandan kendi anlar diye birakirim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"ECDIS'te ciziliyse sozlu brifinge gerek yok derim",tag:"korkak",effect:{bilgi:-10,sayginlik:-10}}]},
  {id:"s207",gfx:"compass",alert:false,day:"Gun 12",time:"07:10",loc:"Koprustu - Turn Planning",sub:"Wheel-over point mantigi",who:"z2",
  text:`2. Zabiti rota donus noktasini buyuttu.

"Waypoint tek basina donus emri degildir. Wheel-over point; hiz, donus acisi, dumen karakteri ve emniyet payiyla dusunulur. Gec kalirsan rotayi kesersin, erken donersen baska riske girersin."

Ilk zabit refleksin ne olur?"`,
  choices:[
  {text:"Donusu waypoint ustunde degil, geminin donus davranisina gore wheel-over mantigiyla planlarim",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"Waypoint gorununce direkt dumen basmak yeterlidir derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Donusleri goz karariyla aliriz diye dusunurum",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},
  {id:"s208",gfx:"bridge",alert:false,day:"Gun 12",time:"07:45",loc:"Koprustu - Kiyiya Paralel Seyir",sub:"Parallel indexing ile emniyet takibi",who:"suvari",
  text:`Suvari radar ve ECDIS'i ayni anda acik tuttu.

"Parallel indexing sadece sinav konusu degil; bogazda, liman yaklasmasinda ve kiyidan geciste gozunun ikinci emniyet cizgisidir. Ekrana bakarken kiyiyla aran aciliyor mu, daraliyor mu hemen anlarsin."

Bu teknigi nasil kullanirsin?"`,
  choices:[
  {text:"Tehlikeli kiyi veya izobata paralel emniyet cizgisi kurup sapmayi onunla izlerim",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
  {text:"Sadece merkez rota cizgisini izlemek yeter derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Parallel indexing eski usuldur diye onemsemem",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},
  {id:"s209",gfx:"compass",alert:true,day:"Gun 12",time:"08:20",loc:"Koprustu - ECDIS Alarmi",sub:"XTD alarmi ve rota disina tasma riski",who:"z2",
  text:`ECDIS kisa bir alarm verdi. Cross Track Distance sinirina yaklasiyorsun.

2. Zabiti hemen sordu: "Bu sadece sesi susturup gecilecek bir alarm degil. Akinti, gec donus, yanlis heading ya da sensor kaymasi olabilir. Once sebebi anlarsin, sonra duzeltirsin."

Ne yaparsin?"`,
  choices:[
  {text:"XTD nedenini akinti, heading ve aktif waypoint ile birlikte kontrol eder, sonra rota duzeltirim",tag:"kritik",effect:{bilgi:17,sayginlik:12,cesaret:3}},
  {text:"Alarmi susturup biraz izlerim, sonra bakarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Kisa tasmalar normaldir diye dusunup devam ederim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s210",gfx:"radar",alert:false,day:"Gun 12",time:"08:50",loc:"Koprustu - Radar Konsolu",sub:"Radar hedef takibi ve CPA/TCPA okuma",who:"z2",radarMode:"cpa_watch",
  text:`2. Zabiti radar ekranini buyuttu.

"AIS faydali ama radar zabitin kendi gozudur. Hedefi acquire edersin, relative movement'i okursun, CPA/TCPA'yi yorumlarsin. Sayi gorup gecmek degil; tehdidi erken fark etmek onemlidir."

Ilk neye bakarsin?"`,
  choices:[
  {text:"Relative movement, vector ve CPA/TCPA bilgisini birlikte yorumlarim",tag:"kritik",effect:{bilgi:17,sayginlik:12},radarMode:"cpa_watch"},
  {text:"Sadece en buyuk parlak hedefe bakarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"cpa_watch"},
  {text:"AIS varsa radar detayina gerek yok derim",tag:"korkak",effect:{bilgi:-10,sayginlik:-10},radarMode:"cpa_watch"}]},
  {id:"s211",gfx:"radar",alert:false,day:"Gun 12",time:"09:20",loc:"Koprustu - Radar/PI",sub:"Parallel indexing radar uzerinde nasil okunur?",who:"suvari",radarMode:"parallel_index",
  text:`Suvari radar ekranina paralel bir emniyet cizgisi acti.

"Parallel indexing ECDIS'te de olur ama radar ustunde ayri bir guven hissi verir. Kiyi ya da tehlike bu cizgiye gore sana yaklasiyorsa erken anlarsin. Ozellikle gece ve dusuk goruste cok ise yarar."

Hangi yorum dogruya daha yakindir?"`,
  choices:[
  {text:"PI cizgisini emniyet mesafesi olarak kurup hedeflerin ona gore acilip daralmasini izlerim",tag:"kritik",effect:{bilgi:16,sayginlik:12},radarMode:"parallel_index"},
  {text:"Sadece merkez sweep'i izlemek yeterlidir derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"parallel_index"},
  {text:"PI sadece kagit ustu bir teoridir diye dusunurum",tag:"korkak",effect:{bilgi:-10,sayginlik:-9},radarMode:"parallel_index"}]},
  {id:"s212",gfx:"radar",alert:true,day:"Gun 12",time:"09:55",loc:"Koprustu - Radar Alarmi",sub:"XTD sonrasi radar capraz kontrolu",who:"z2",radarMode:"xtd_alarm",
  text:`ECDIS alarmindan sonra 2. Zabiti radar capraz kontrolu istedi.

"Sadece tek ekrana bakarsan kayarsin. Akinti seni disari itiyorsa radar echo'su, PI hattin ve aktif hedef vektoru da bunu soyler. Simdi ayni sapmayi radar ustunde de okumani istiyorum."

Ne yaparsin?"`,
  choices:[
  {text:"Radar vector, PI hatti ve echo mesafesini birlikte okuyup sapmanin dogrulugunu teyit ederim",tag:"kritik",effect:{bilgi:17,sayginlik:12,cesaret:3},radarMode:"xtd_alarm"},
  {text:"ECDIS alarmi varsa radar bakmadan da yeter derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"xtd_alarm"},
  {text:"Radar ile ECDIS ayni seydir diye dusunup capraz kontrol etmem",tag:"korkak",effect:{bilgi:-11,sayginlik:-10},radarMode:"xtd_alarm"}]},
  {id:"s213",gfx:"radar",alert:false,day:"Gun 12",time:"10:20",loc:"Koprustu - ARPA Konsolu",sub:"ARPA acquire ve target tracking",who:"z2",radarMode:"arpa_acquire",
  text:`2. Zabiti hedeflerden birini isaretledi.

"Ham echo gormek bir seydir, ARPA ile hedefi acquire edip takip etmek baska bir sey. Dogru hedefi sectiginde CPA/TCPA yorumun da guclenir. Ama her parlak hedefe de sorgusuz yapisilmaz."

Ilk refleksin ne olur?"`,
  choices:[
  {text:"Tehlikeli gorunen hedefi acquire eder, raw echo ile ARPA verisini birlikte izlerim",tag:"kritik",effect:{bilgi:17,sayginlik:12},radarMode:"arpa_acquire"},
  {text:"ARPA secilince gerisini sistem halleder diye dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"arpa_acquire"},
  {text:"Acquire islemini gereksiz bulur sadece ekrana bakarim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9},radarMode:"arpa_acquire"}]},
  {id:"s214",gfx:"radar",alert:true,day:"Gun 12",time:"10:55",loc:"Koprustu - Radar Uyarisi",sub:"Lost target ve track dusmesi",who:"z2",radarMode:"arpa_lost",
  text:`Takipteki hedeflerden biri bir anda kararsizlasti. ARPA hedefi kaybetmeye basladi.

2. Zabiti hemen uyardi: "Lost target seni rehavete dusurmesin. Hedef yok olmadi; sadece takip zinciri koptu olabilir. Raw echo, sweep ve ikinci sensorlerle yeniden degerlendirmen gerekir."

Ne yaparsin?"`,
  choices:[
  {text:"Lost target'i raw echo, sweep ve diger seyir araclariyla yeniden teyit ederim",tag:"kritik",effect:{bilgi:17,sayginlik:12,cesaret:3},radarMode:"arpa_lost"},
  {text:"ARPA dusurdiyse tehdit de kalmamistir diye dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"arpa_lost"},
  {text:"Alarmi kapatip ekrandaki diger hedeflere dalarim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10},radarMode:"arpa_lost"}]},
  {id:"s215",gfx:"radar",alert:false,day:"Gun 12",time:"11:20",loc:"Koprustu - Trial Maneuver",sub:"Manevra denemesi ve CPA etkisi",who:"suvari",radarMode:"trial_maneuver",
  text:`Suvari trial maneuver penceresini acti.

"Gercekte dumen basmadan once bazen ekranda deneriz. 20 derece sancak versem CPA nasil degisir, hizi dusersem hedefle mesafe acilir mi? Trial maneuver dogru kullanilirsa son dakika telasini azaltir."

Burada en dogru yaklasim hangisi?"`,
  choices:[
  {text:"Manevra secenegini simule edip yeni CPA/TCPA sonucuna gore karar veririm",tag:"kritik",effect:{bilgi:16,sayginlik:12},radarMode:"trial_maneuver"},
  {text:"Trial ekranini gorup yine de denemeden ayni planla devam ederim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"trial_maneuver"},
  {text:"Boyle seyler vakit kaybi, dogrudan dumen basilir derim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9},radarMode:"trial_maneuver"}]},
  {id:"s216",gfx:"radar",alert:false,day:"Gun 12",time:"11:50",loc:"Koprustu - Radar Ayarlari",sub:"Rain clutter, sea clutter ve gain ayari",who:"z2",radarMode:"clutter_tune",
  text:`Yagis hafif basladi, deniz yuzeyi de parlama yapiyor. Radar ekrani kirlenmeye basladi.

2. Zabiti eliyle dugmeleri gosterdi: "Gain, sea clutter ve rain clutter ayari ince istir. Fazla acarsan hedefi bogarsin, fazla kisarsan yalanci echo icinde kaybolursun."

Ne yaparsin?"`,
  choices:[
  {text:"Sea clutter ve rain clutter'i hedefi oldurmeyecek sekilde ince ayarla, raw echo'yu temizlerim",tag:"kritik",effect:{bilgi:17,sayginlik:12},radarMode:"clutter_tune"},
  {text:"Parazit azalsin diye clutter'i sonuna kadar acmak isterim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"clutter_tune"},
  {text:"Gain ayarina hic dokunmadan ayni goruntuyla devam ederim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10},radarMode:"clutter_tune"}]},
  {id:"s217",gfx:"radar",alert:true,day:"Gun 12",time:"12:20",loc:"Koprustu - Guard Zone Alarmi",sub:"Guard zone alarmi calmaya basladi",who:"z2",radarMode:"guard_zone",
  text:`Radar paneli kisa ama sert bir alarm verdi. Bir hedef guard zone icine girmeye basladi.

2. Zabiti hemen sordu: "Guard zone sadece sesi susturup unutacagin bir sey degil. Hedef sana mi geliyor, sen ona mi donuyorsun, yalanci echo mu var; bunu ayirman gerekir."

Bu alarm geldiginde ilk refleksin ne olur?"`,
  choices:[
  {text:"Hedefi radar vector, CPA/TCPA ve gerçek echo ile teyit eder, guard zone nedenini anlarim",tag:"kritik",effect:{bilgi:17,sayginlik:12,cesaret:3},radarMode:"guard_zone"},
  {text:"Alarmi susturup biraz daha yaklasmasini beklerim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"guard_zone"},
  {text:"Guard zone alarmlarinin cogunun gereksiz oldugunu dusunurum",tag:"korkak",effect:{bilgi:-11,sayginlik:-10},radarMode:"guard_zone"}]},
  {id:"s218",gfx:"radar",alert:false,day:"Gun 12",time:"12:45",loc:"Koprustu - Radar Olcumu",sub:"EBL ve VRM ile kerteriz ve mesafe alma",who:"suvari",radarMode:"ebl_vrm",
  text:`Suvari radar ekraninda bir hedefe EBL ve VRM acti.

"Gozle gordugun hedefi sayiya cevirmedikce takip yarim kalir. EBL sana kerterizi, VRM mesafeyi verir. Bunu dogru okuyabilirsen hedefin zaman icindeki davranisini da daha iyi anlarsin."

En dogru kullanimin hangisi oldugunu dusunursun?"`,
  choices:[
  {text:"EBL ile kerterizi, VRM ile mesafeyi olcer; zaman icindeki degisimi ard arda kontrol ederim",tag:"kritik",effect:{bilgi:17,sayginlik:12},radarMode:"ebl_vrm"},
  {text:"Sadece ekrandaki genel konumdan fikir yurutmeyi yeterli gorurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"ebl_vrm"},
  {text:"EBL/VRM'yi eski usul bulup hic kullanmam",tag:"korkak",effect:{bilgi:-10,sayginlik:-10},radarMode:"ebl_vrm"}]},
  {id:"s219",gfx:"radar",alert:false,day:"Gun 12",time:"13:15",loc:"Koprustu - Radar Display Modes",sub:"Head-up, north-up ve course-up farki",who:"z2",radarMode:"display_mode",
  text:`2. Zabiti radar sunum modlarini birer birer degistirdi.

"Head-up rahat hissettirir ama kuzey referansi kayar. North-up haritaya yakindir ama ilk bakista yabanci gelir. Course-up ise rota dusuncesinde guclu olabilir. Hangi modu ne zaman kullandigini bilirsen yorum hatasi azalir."

Bu uc mod icin en saglam yaklasimin ne olur?"`,
  choices:[
  {text:"Duruma gore modu secer; trafik yorumunda north-up, manevra hissinde head-up, rota takibinde course-up dusunurum",tag:"kritik",effect:{bilgi:18,sayginlik:12},radarMode:"display_mode"},
  {text:"Bir moda alisip hep onu kullanmak yeterlidir derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"display_mode"},
  {text:"Display modlarinin pratikte ciddi fark yaratmadigini dusunurum",tag:"korkak",effect:{bilgi:-11,sayginlik:-10},radarMode:"display_mode"}]},
  {id:"s220",gfx:"radar",alert:false,day:"Gun 12",time:"13:45",loc:"Koprustu - Radar Yorum",sub:"Blind sector ve direk golgesi",who:"z2",radarMode:"blind_sector",
  text:`2. Zabiti ekranin sancak tarafini isaret etti.

"Her gorunmeyen hedef denizde yok anlamina gelmez. Mast, kreyn, ust bina veya tarama acisi bazen sana blind sector yaratir. Hedef bir an var bir an yoksa once kendi radar geometrinden suphelenirsin."

Ne dersin?"`,
  choices:[
  {text:"Gorunmeyen kesiti blind sector ihtimaliyle degerlendirir, sensor geometriisini aklimda tutarim",tag:"kritik",effect:{bilgi:17,sayginlik:12},radarMode:"blind_sector"},
  {text:"Ekranda yoksa tehdit de yoktur diye dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"blind_sector"},
  {text:"Hedef kaybolduysa kesin uzaklasmistir derim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10},radarMode:"blind_sector"}]},
  {id:"s221",gfx:"radar",alert:false,day:"Gun 12",time:"14:10",loc:"Koprustu - Radar Paraziti",sub:"Interference paternini ayirt etmek",who:"suvari",radarMode:"interference",
  text:`Suvari ekrandaki tekrar eden izleri gosterdi.

"Bazi izler hedef degil, komsu radarlarin veya sistem girisiminin yansimasidir. Interference kendini ritmiyle, duzensizligiyle ve gercek hareket mantigina oturmayan sekliyle ele verir."

Bu durumda hangi yaklasim daha saglamdir?"`,
  choices:[
  {text:"Interference paternini gercek hedef hareketinden ayirir, ikinci radar ve sweep mantigiyla teyit ederim",tag:"kritik",effect:{bilgi:17,sayginlik:12},radarMode:"interference"},
  {text:"Parlak her izi hedef saymak daha guvenlidir derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"interference"},
  {text:"Parazitleri tamamen yok sayip hic yorum yapmam",tag:"korkak",effect:{bilgi:-10,sayginlik:-9},radarMode:"interference"}]},
  {id:"s222",gfx:"radar",alert:false,day:"Gun 12",time:"14:35",loc:"Koprustu - Radar Gecisleri",sub:"Shadow sector ve baca arkasi kayip",who:"z2",radarMode:"shadow_sector",
  text:`Bir hedef baca hizasina gelince zayifladi.

2. Zabiti sakince anlatti: "Shadow sector bazen ust yapinin ardinda hedefi inceltir veya gecici dusurur. Bu durumlarda hedefi tamamen silmek yerine kayboldugu aci sektorunu bilmek gerekir."

Ilk yorumun ne olur?"`,
  choices:[
  {text:"Zayiflamayi shadow sector ile iliskilendirir, hedefin aci sektorunu kayda alirim",tag:"kritik",effect:{bilgi:17,sayginlik:12},radarMode:"shadow_sector"},
  {text:"Echo zayifladiysa hedef kucuk ve onemsizdir derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"shadow_sector"},
  {text:"Bir an kaybolan hedefi tamamen listeden cikaririm",tag:"korkak",effect:{bilgi:-11,sayginlik:-10},radarMode:"shadow_sector"}]},
  {id:"s223",gfx:"radar",alert:true,day:"Gun 12",time:"15:05",loc:"Koprustu - Yagmur Hattı",sub:"Yagmur icinde kucuk hedefi ayirt etmek",who:"suvari",radarMode:"rain_small_target",
  text:`Yagmur hatti ekranin bir tarafini kirletirken zayif bir echo tik diye belirdi.

"Kucuk balikci, pilot botu ya da isiksiz bir servis teknesi bazen yagmur icinde kaynar gider," dedi suvari. "Asil ustalik clutter ile hedefi birbirinden ayirmakta."

Ne yaparsin?"`,
  choices:[
  {text:"Zayif echo'yu clutter ayari, sweep takibi ve diger sensorlerle birlikte ayirmaya calisirim",tag:"kritik",effect:{bilgi:18,sayginlik:12,cesaret:3},radarMode:"rain_small_target"},
  {text:"Yagmur icindeki zayif izleri guvensiz bulup hepsini kapatirim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"rain_small_target"},
  {text:"Kucuk hedefler bu kadar yagmurda zaten okunmaz diye vazgecerim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10},radarMode:"rain_small_target"}]},
  {id:"s224",gfx:"radar",alert:true,day:"Gun 12",time:"15:35",loc:"Koprustu - Sensor Capraz Kontrol",sub:"AIS ile radar verisi neden tam otusmuyor?",who:"z2",radarMode:"ais_mismatch",
  text:`2. Zabiti ayni hedefin AIS ve radar izlerini yanyana gosterdi.

"Bazen AIS ile radar bire bir ust uste oturmaz. Anten ofseti, gecikme, zayif GPS, yanlis sensor kaynagi ya da hedefin kendi verisi problemli olabilir. Bu durumda tek kaynaga asik olmazsin."

Ilk ne yaparsin?"`,
  choices:[
  {text:"AIS-radar farkini sensor, ofset ve gerçek echo mantigiyla capraz kontrol ederim",tag:"kritik",effect:{bilgi:18,sayginlik:12},radarMode:"ais_mismatch"},
  {text:"AIS bilgisi yaziyorsa radardan daha guvenlidir derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"ais_mismatch"},
  {text:"Uyusmazlik varsa iki sistemi de bosveririm",tag:"korkak",effect:{bilgi:-11,sayginlik:-10},radarMode:"ais_mismatch"}]},
  {id:"s225",gfx:"radar",alert:true,day:"Gun 12",time:"16:00",loc:"Koprustu - ARPA Stresi",sub:"Target swap ve karisan takip zinciri",who:"z2",radarMode:"target_swap",
  text:`Iki hedef birbirine yaklasirken ARPA tracklerinden biri karismaya basladi.

2. Zabiti hemen uyardi: "Target swap, ekrandaki ismin gercekte baska hedefe atlamasi demektir. Ozellikle yakin crossing'de raw echo ile takip numarasini ayri dusunmezsen yanilirsin."

Ne dersin?"`,
  choices:[
  {text:"Track numarasina kor guvenmem; raw echo ve relatif hareketle target swap ihtimalini kontrol ederim",tag:"kritik",effect:{bilgi:18,sayginlik:12,cesaret:3},radarMode:"target_swap"},
  {text:"ARPA etiketi degismediyse ayni hedef sayarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"target_swap"},
  {text:"Track karistiysa tum radar takibini birakirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10},radarMode:"target_swap"}]},
  {id:"s226",gfx:"radar",alert:false,day:"Gun 12",time:"16:25",loc:"Koprustu - Echo Yorumu",sub:"False echo mu, gercek hedef mi?",who:"suvari",radarMode:"false_echo",
  text:`Suvari ekrandaki simetrik iki izden birini gosterdi.

"Bazi ekolar gercek hedef degildir; multipath ya da yansima ile sahte hedef olusabilir. Yanlis hedefe manevra yaparsan dogru tehlikeyi kacirirsin."

En saglam yaklasim hangisi?"`,
  choices:[
  {text:"False echo ihtimalini sweep, aci, tekrar paterni ve diger sensorlerle test ederim",tag:"kritik",effect:{bilgi:17,sayginlik:12},radarMode:"false_echo"},
  {text:"Parlak olan her izi esit tehdit kabul ederim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"false_echo"},
  {text:"Sahte olabilir diye hepsini onemsiz sayarim",tag:"korkak",effect:{bilgi:-10,sayginlik:-10},radarMode:"false_echo"}]},
  {id:"s227",gfx:"radar",alert:true,day:"Gun 12",time:"16:55",loc:"Koprustu - Yogun Trafik",sub:"Multi-target crossing vardiya baskisi",who:"suvari",radarMode:"multi_crossing",
  text:`Radar bir anda kalabaliklasti. Bir crossing hedefi CPA daraltiyor, biri sancaga aciliyor, kiçtan gelen baska bir hedef de hizla yaklasiyor.

Suvari sesi sert ama sakindi: "Tek hedefli deniz kolaydir. Asil vardiya; birden fazla tehdidi onceliklendirip hangisinin gercek carpışma riski oldugunu ayirdiginda baslar."

Ilk disiplinin ne olur?"`,
  choices:[
  {text:"Hedefleri onceliklendirir; en kritik CPA/TCPA tehdidini ayirip digerlerini tablo halinde izlerim",tag:"kritik",effect:{bilgi:19,sayginlik:13,cesaret:4},radarMode:"multi_crossing"},
  {text:"En parlak hedefe bakip digerlerini ikinci plana atarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"multi_crossing"},
  {text:"Bu kadar hedefte saglikli yorum yapilmaz diye dagilirim",tag:"korkak",effect:{bilgi:-12,sayginlik:-11},radarMode:"multi_crossing"}]}
];
const DOCUMENT_CHAIN_SCENE_IDS = new Set(['s309','s310','s311','s312','s313','s314']);
const EXTRA_EQUIPMENT_SCENES=[
  {id:"s228",gfx:"gyro_panel",alert:false,day:"Gun 4",time:"10:30",loc:"Koprustu - Gyro Repeater",sub:"Gyro compass neyi verir?",who:"z2",
  text:`2. Zabiti seni gyro repeater'in onune cekti.

"Bu cihaz manyetige bakmaz; gercek kuzey referansi uzerinden yone oturur. Ama her zaman kor guven de istemez. Settling, error ve cross-check disiplini gerekir."

Gyro ile ilgili en dogru yorum hangisi?`,
  choices:[
  {text:"Gyro'nun true heading referansi verdigini, ama hata ve cross-check gerektirdigini soylerim",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
  {text:"Gyro varsa baska pusulaya hic gerek kalmaz derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Gyro ile magnetic compass ayni seydir diye dusunurum",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},
  {id:"s229",gfx:"magnetic_panel",alert:false,day:"Gun 4",time:"11:00",loc:"Koprustu - Standard Compass",sub:"Magnetic compass neden hala var?",who:"suvari",
  text:`Suvari standard pusulayi gosterdikten sonra sordu.

"Elektrik gider, gyro sapar, sensor susar; ama magnetic compass hala konusur. Deviation'i vardir, variation'i vardir, ama denizcilik yedek dusunce ister."

Sana gore magnetic compass'in asil degeri nedir?`,
  choices:[
  {text:"Elektronik sistemlere karsi guvenilir bir yedek yon referansi oldugunu soylerim",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
  {text:"Sadece eski gemilerde lazimdir derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Magnetic compass artik tamamen gereksizdir diye dusunurum",tag:"korkak",effect:{bilgi:-10,sayginlik:-10}}]},
  {id:"s230",gfx:"echo_panel",alert:false,day:"Gun 5",time:"08:10",loc:"Koprustu - Echo Sounder",sub:"Echo sounder ile neyi takip ederiz?",who:"z2",
  text:`2. Zabiti echo sounder trendini acti.

"Bu cihaz sadece anlik rakam vermez; altindaki suyun trendini de soyler. Kanal girisinde, demirde, sığ suda veya beklenmeyen shoal suphelerinde gozun buraya da kayar."

En dogru refleks hangisi?`,
  choices:[
  {text:"Anlik derinlik kadar trendi ve chart/UKC ile iliskisini birlikte izlerim",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
  {text:"Bir kez rakam gorduysem kalanina bakmam",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Echo sounder'i sadece limanda lazim sanirim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},
  {id:"s231",gfx:"speedlog_panel",alert:false,day:"Gun 5",time:"09:00",loc:"Koprustu - Speed Log",sub:"SOG ile STW neden ayni olmayabilir?",who:"z2",
  text:`Speed log ekraninda iki farkli hiz degeri akiyordu.

"Biri suya gore hiz, biri yere gore hiz. Akinti varsa ayni olmazlar. Seyirci adam burada yanilmaz; farki gorur ve yorumlar."

Ne dersin?`,
  choices:[
  {text:"STW ile SOG farkinin akinti ve set-drift yorumunda cok onemli oldugunu soylerim",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"Iki hiz degeri her zaman ayni sayilir derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Speed log varsa akintiyi ayrica dusunmeye gerek yok derim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},
  {id:"s232",gfx:"autopilot_panel",alert:false,day:"Gun 5",time:"09:35",loc:"Koprustu - Autopilot",sub:"Autopilot ne zaman rahatlik, ne zaman risk?",who:"suvari",
  text:`Suvari autopilot paneline hafifce vurdu.

"Autopilot yardimcidir ama zabitin yerini almaz. Dar kanal, yogun trafik, boğaz manevrasi veya pilotajda moda ve response ayarina dikkat etmezsen rahatlik sandigin sey risk olur."

En dogru yorum hangisi?`,
  choices:[
  {text:"Autopilot modunu trafik ve manevraya gore kullanir, gerektiğinde hand steering'e gecmeye hazir olurum",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"AUTO yaziyorsa her durumda daha emniyetlidir derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Autopilot acikken dumen ve rota takibini gevsetirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s233",gfx:"bnwas_panel",alert:false,day:"Gun 5",time:"10:10",loc:"Koprustu - BNWAS",sub:"BNWAS neden var?",who:"z3",
  text:`3. Zabiti BNWAS panelini gosterdi.

"Bridge Navigational Watch Alarm System, vardiya zabiti cevap vermeyi keserse zinciri buyutur. Once seni uyandirir, sonra gerekirse baskalarina haber verir. Ama bu cihaz konfor degil emniyet dusuncesidir."

Sana gore asil amaci ne?`,
  choices:[
  {text:"Nobette dalginlik veya incapacitation halinde kopruustu emniyet zincirini devreye sokmaktir derim",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
  {text:"Sadece gereksiz bir sesli hatirlaticidir derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"BNWAS varsa gozculuk disiplini ikinci plana duser diye dusunurum",tag:"korkak",effect:{bilgi:-10,sayginlik:-10}}]},
  {id:"s234",gfx:"gmdss_panel",alert:false,day:"Gun 5",time:"10:50",loc:"Koprustu - GMDSS Konsolu",sub:"GMDSS cihazlarinin yerini tanimak",who:"z3",
  text:`3. Zabiti tum GMDSS panelini tek tek gosterdi.

"VHF DSC, MF/HF, EPIRB, SART, handheld VHF... adlarini ezberlemek yetmez. Acil durumda elin nereye gidecek bilmiyorsan bilgi yarim kalir."

Ilk stajyer refleksi ne olmali?`,
  choices:[
  {text:"Cihazlari yer, islev ve hangi acilde kullanilacaklariyla birlikte tanirim",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"Sadece VHF'nin yerini bilsem yeter derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Acil durumda biri nasil olsa gosterir diye dusunurum",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s235",gfx:"ais_panel",alert:false,day:"Gun 5",time:"11:25",loc:"Koprustu - AIS Terminali",sub:"AIS ekraninda neyi goruyoruz?",who:"z2",
  text:`2. Zabiti AIS terminalini acip hedef listesini kaydirdi.

"AIS sana isim, rota, hiz, cagrı isareti gibi bir pencere acabilir. Ama bu pencere her zaman tertemiz degildir. Yine de hedef tanimlama ve trafik farkindaligi icin buyuk yardimdir."

Asil zabit disiplini nedir?`,
  choices:[
  {text:"AIS'i tanimlama yardimcisi olarak kullanir ama radar ve gorsel teyidi birakmam",tag:"kritik",effect:{bilgi:16,sayginlik:12}},
  {text:"AIS listesi varsa radar yorumuna gerek kalmaz derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"AIS bilgisini tamamen gereksiz bulurum",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},
  {id:"s236",gfx:"ecdis_panel",alert:false,day:"Gun 5",time:"12:00",loc:"Koprustu - ECDIS Ekrani",sub:"ECDIS ekrani ustunde neye bakiyoruz?",who:"z2",
  text:`ECDIS ekraninda rota, emniyet konturu ve aktif waypoint bir aradaydi.

"Oyuncak gibi gorunebilir ama burada birden fazla katman ayni anda okunur: route line, chart warning, safety contour, XTD ve sensor overlay. Goz sadece sari cizgide kalirsa eksik kalir."

Ilk bakisin nereye dagilir?`,
  choices:[
  {text:"Aktif rota kadar warning, safety contour ve aktif waypoint bilgisini birlikte okurum",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"Sadece sari rota cizgisine bakmak yeter derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"ECDIS ekrani karmasik diye yorumlamayi birakirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s271",gfx:"gmdss_panel",alert:false,day:"Gun 5",time:"12:20",loc:"Koprustu - VHF DSC",sub:"VHF DSC ve CH16 disiplini",who:"z3",
  text:`3. Zabiti VHF setinin ustune dokundu:

"VHF sadece konusma kutusu degil. CH16 nobeti, DSC distress/urgency/safety mantigi, low power / high power secimi ve net tekrar disiplini burada baslar."

VHF icin en dogru zabit dusuncesi hangisi?`,
  choices:[
  {text:"CH16 nobetini, DSC fonksiyonunu ve kisa/net haberlesme disiplinini birlikte dusunurum",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"VHF'yi sadece liman icinde kullanilan basit bir telsiz gibi gorurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"DSC mantigini bilmeden sadece mikrofona konusmanin yetecegini sanirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s272",gfx:"gmdss_panel",alert:false,day:"Gun 5",time:"12:45",loc:"Koprustu - MF/HF Console",sub:"MF/HF ne zaman devreye girer?",who:"z3",
  text:`MF/HF setinin altindaki frekans listesi gozunu korkutuyor.

"Menzil buyudukce cihaz dusuncesi de degisir." dedi 3. Zabiti. "MF/HF, DSC distress frekanslari, propagation ve uygun band secimiyle VHF'den ayrilir."

En saglam yorum hangisi?`,
  choices:[
  {text:"MF/HF'nin daha uzak haberlesme ve uygun frekans/band secimi gerektirdigini soylerim",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"VHF cekmiyorsa rastgele MF/HF tuslarina basmanin yeterli oldugunu dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"MF/HF'nin artik fiilen gereksiz hale geldigini sanirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s273",gfx:"gmdss_panel",alert:false,day:"Gun 5",time:"13:10",loc:"Koprustu - NAVTEX Unit",sub:"NAVTEX mesaji nasil okunur?",who:"z2",
  text:`Printerdan yeni kagit cikiyor. 2. Zabiti mesaji eline vermeden once sordu:

"NAVTEX'i sadece kagit sayma. Mesaj tipi, gecerlilik alani, warning/safety ayrimi ve rota etkisi birlikte okunur. Yaziciya baktin diye mesaji anladin sanma."

Ilk zabit refleksi ne olmali?`,
  choices:[
  {text:"Mesaj tipini, rota ilgisini ve warning onceligini birlikte ayiririm",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"Printerdan ciktiysa genel bilgi sayip sonra bakarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"NAVTEX mesajlarini cogunlukla gereksiz kalabalik gibi gorurum",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s274",gfx:"gmdss_panel",alert:false,day:"Gun 5",time:"13:35",loc:"Koprustu - Inmarsat C / EGC",sub:"EGC ve SafetyNET ne verir?",who:"z3",
  text:`3. Zabiti Inmarsat-C terminalindeki mesaj kutusunu acti:

"EGC dedigin genelde Enhanced Group Call. SafetyNET uzerinden MSI, weather warning, SAR ve guvenlik mesajlari gelebilir. Bu cihaz konfor degil; bilgi zinciridir."

Sence en dogru dusunce hangisi?`,
  choices:[
  {text:"EGC/SafetyNET'i seyir emniyeti ve meteorolojik guvenlik yayini olarak gorurum",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"Inmarsat-C varsa sadece sirket mesajlasmasi icindir diye dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"EGC ile NAVTEX arasinda pratikte hic fark olmadigini sanirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s275",gfx:"gmdss_panel",alert:false,day:"Gun 5",time:"14:05",loc:"Bridge Wing - SART",sub:"SART ne ise yarar?",who:"z3",
  text:`SART setini eline alinica 3. Zabiti acikladi:

"Bu cihaz kendi basina MAYDAY cihazi gibi dusunulmez. Arama-kurtarma radarina cevap vererek seni daha gorunur yapar. Can sali ve abandon ship dusuncesinin bir parcasidir."

En dogru yorum hangisi?`,
  choices:[
  {text:"SART'in arama-kurtarmada radar cevaplayici olarak bulunurlugu artirdigini soylerim",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"SART'i normal VHF yerine gececek bir konusma cihazi sanirim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"EPIRB varken SART'in onemsiz kaldigini dusunurum",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s276",gfx:"gmdss_panel",alert:true,day:"Gun 5",time:"14:40",loc:"Emergency Locker - EPIRB",sub:"EPIRB ve COSPAS-SARSAT baglantisi",who:"z3",
  text:`3. Zabiti EPIRB braketinin yaninda durdu:

"EPIRB denize dusunce veya manuel aktive olunca sadece yakindaki gemiye bagirmez; COSPAS-SARSAT uydu zincirine distress beacon yollar. Bu yuzden bracket, HRU, battery ve registration bilgisi ciddidir."

Bu cihazi nasil yorumlarsin?`,
  choices:[
  {text:"EPIRB'in uydu tabanli distress beacon oldugunu, bracket/HRU/battery kaydiyla birlikte dusunurum",tag:"kritik",effect:{bilgi:18,sayginlik:13}},
  {text:"EPIRB'i sadece isik yakan bir can sali aksesuarina indirgerim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"COSPAS-SARSAT mantigini bilmeden butun isi VHF'ye birakmanin yeterli oldugunu sanirim",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s277",gfx:"gmdss_panel",alert:false,day:"Gun 5",time:"15:10",loc:"Koprustu - Inmarsat C Terminal",sub:"Inmarsat-C ile mesaj / rapor mantigi",who:"z2",
  text:`Terminalde sirketten bir metin, altta da raporlama sayfasi acik.

2. Zabiti anlatti: "Inmarsat-C bazen weather, bazen reporting, bazen security ya da sirket mesaji tasir. Distress fonksiyonu ayri bir disiplin ister; her metin ayni onemde degildir."

En profesyonel refleks hangisi?`,
  choices:[
  {text:"Mesaj tipini ayirir, reporting/distress/safety farkini anlayarak terminali kullanirim",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"Inmarsat-C'yi sadece ofisten gelen mail kutusu gibi gorurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Terminal karmasik diye hic ilgi gostermem",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s278",gfx:"ais_panel",alert:false,day:"Gun 5",time:"15:45",loc:"Koprustu - AIS Ayrintisi",sub:"AIS static ve dynamic data farki",who:"z2",
  text:`AIS terminali bu kez daha ayrintili acik. 2. Zabiti hedef listesine kaydirdi:

"Bir kisim bilgi static ya da voyage-related'dir; MMSI, callsign, draft, destination gibi. Bir kisim da dynamic akar; heading, COG, SOG, ROT gibi. Yanlis veri girisi trafik farkindaligini bozar."

Sana gore en dogru yorum hangisi?`,
  choices:[
  {text:"AIS'te static, voyage-related ve dynamic veriyi ayirir; radar/gorsel teyidi surdururum",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"AIS'te isim ve hedef gorunuyorsa diger alanlari ikinci planda tutarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"AIS verisinin dogrulugunu hic sorgulamadan oldugu gibi kabul ederim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s279",gfx:"gmdss_panel",alert:false,day:"Gun 5",time:"16:10",loc:"Koprustu - GMDSS Sea Areas",sub:"A1-A2-A3-A4 neyi degistirir?",who:"z3",
  text:`3. Zabiti GMDSS kitabinin kenarina dort satir yazdi:

"A1, A2, A3, A4 ezber satiri degil. Hangi kapsamada oldugunu bilirsen hangi cihaza, hangi istasyona ve hangi distress yoluna guvenecegini anlarsin."

En dogru zabit dusuncesi hangisi?`,
  choices:[
  {text:"Sea area'yi cihaz kapsamasiyla birlikte okur; VHF, MF/HF ve uydu imkanini ona gore dusunurum",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"A1-A4 ayriminin pratikte cihaz secimini cok etkilemedigini dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Her denizde ayni GMDSS refleksi yeterli olur sanirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s280",gfx:"gmdss_panel",alert:false,day:"Gun 5",time:"16:35",loc:"Koprustu - Coast Station Listesi",sub:"Hangi sahil istasyonuna bakilir?",who:"z2",
  text:`2. Zabiti radio signals yayininin ilgili sayfasini acti:

"Sahil istasyonu secimi gelisiguzel olmaz. Cagri isareti, calisma frekansi, DSC bilgisi, NAVTEX coverage ve MRCC baglantisi birlikte okunur. Yanlis istasyon, geciken haberlesme demektir."

Ilk refleksin ne olur?`,
  choices:[
  {text:"Bolgeye uygun coast station, frekans ve hizmet turunu yayindan teyit ederim",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"En yakin ulke adini gorup direkt onu secmenin yetecegini dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Sahil istasyonu bilgisini acil durumda rastgele denemenin sorun olmayacagini sanirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s281",gfx:"gmdss_panel",alert:false,day:"Gun 5",time:"17:00",loc:"Koprustu - MRCC / RCC Mantigi",sub:"Rescue Coordination Centre ne yapar?",who:"z3",
  text:`3. Zabiti distress zincirini bir daha anlatti:

"Her mesaj dogrudan yardim botuna gitmez. Cogu durumda RCC/MRCC koordinasyonu devreye girer. Senin net pozisyon, olay tipi ve durum raporun arama-kurtarma duzenini hizlandirir."

Bu zinciri nasil yorumlarsin?`,
  choices:[
  {text:"RCC/MRCC'nin yardim organizasyonunu koordine ettigini bilir, mesaji net ve tam kurarim",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"Distress gecildikten sonra detayli bilgi vermenin ikincil kaldigini dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"RCC kavramini bilmeden sadece yakindaki gemilerin yardiminin yeterli olacagini sanirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s282",gfx:"gmdss_panel",alert:false,day:"Gun 5",time:"17:25",loc:"Koprustu - Radio Log",sub:"GMDSS istasyon ve mesaj kaydi",who:"z3",
  text:`Radio log acik. 3. Zabiti kalemi sana uzatti:

"Istasyonla gorustun, DSC alert teyit edildi, NAVTEX warning alindi ya da Inmarsat-C report gitti. Bunlar kafada tutulmaz; saat, istasyon, frekans ve mesaj ozeti kayda girer."

En profesyonel disiplin hangisi?`,
  choices:[
  {text:"Saat, istasyon adi/callsign, frekans ve mesaj ozetini radio log'a duzenli gecerim",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"Onemli bir sey olursa sonra hatirlar yazarim diye dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Radio log'un pratikte gereksiz ayrinti oldugunu sanirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s283",gfx:"gmdss_panel",alert:true,day:"Gun 5",time:"17:50",loc:"Koprustu - DSC Controller",sub:"DSC alert sequence nasil ilerler?",who:"z3",
  text:`3. Zabiti DSC controller'a bakip sordu:

"Distress alert bir tus degil, bir zincirdir. Kimlik, pozisyon, nature of distress ve uygun kanal disiplini birbirini tamamlar. Sirayi bozarsan yardim gecikebilir."

En dogru refleks hangisi?`,
  choices:[
  {text:"DSC alert sequence'i kimlik, pozisyon ve distress bilgisi mantigiyla duzenli dusunurum",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"Once tusa basip ayrintiyi sonra duzeltmenin yeterli oldugunu dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"DSC zincirini bilmeden dogrudan sesli cagrinin her zaman yetecegini sanirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s284",gfx:"gmdss_panel",alert:false,day:"Gun 5",time:"18:15",loc:"Koprustu - Test Modu",sub:"Test ile gercek distress farki",who:"z3",
  text:`3. Zabiti test prosedurunu gosterdi:

"Test baska, gercek distress baska. Cihazi sinarken yanlis yerde, yanlis modda ya da yanlis istasyona gercek alarm atmak basit hata sayilmaz."

Bu ayrimi nasil korursun?`,
  choices:[
  {text:"Test prosedurunu yalnizca uygun mod, uygun zaman ve uygun kayitla uygularim",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"Test ile gercek alarm mantiginin ekranda kolayca ayristigini varsayarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Deneme icin kisa bir gercek alertin buyuk sorun olmayacagini sanirim",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s285",gfx:"gmdss_panel",alert:true,day:"Gun 5",time:"18:40",loc:"Koprustu - Yanlis Alarm Sonrasi",sub:"False alert iptali nasil yapilir?",who:"suvari",
  text:`Suvari bu kez yuzu ciddileserek sordu:

"Yanlis distress alert atildi diyelim. Saklamak daha buyuk hatadir. Iptal proseduru, ilgili istasyona bildirim ve radio log kaydi bir arada yurur."

En saglam zabit tavri hangisi?`,
  choices:[
  {text:"False alert'i hemen uygun prosedurle iptal eder, ilgili istasyona bildirir ve log'a gecerim",tag:"kritik",effect:{bilgi:19,sayginlik:13,cesaret:3}},
  {text:"Biraz bekleyip kimsenin fark etmeyecegini umarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Yanlis alarmi gizlemenin daha az sorun cikaracagini sanirim",tag:"korkak",effect:{bilgi:-13,sayginlik:-12}}]},
  {id:"s286",gfx:"gmdss_panel",alert:false,day:"Gun 5",time:"19:05",loc:"Koprustu - Radio Log Uygulamasi",sub:"Mesaji dogru kayda gecmek",who:"z3",
  text:`Radio log bu kez bos satirla onunde:

"Saat UTC mi local mi, istasyon kim, frekans ne, mesaj tipi ne, hangi aksiyon alindi? GMDSS'te 'konusuldu bitti' diye bir sey yok."

Kaydi nasil tutarsin?`,
  choices:[
  {text:"Saat, istasyon, frekans, mesaj tipi ve sonucu acik-sekilde kayda gecerim",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"Kisa bir notla gecistirir, detayi gerekirse sonra eklerim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Mesaji duyduysam ayrica yazmanin cok da onemli olmadigini dusunurum",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s287",gfx:"fire",alert:false,day:"Gun 8",time:"18:10",loc:"Fire Locker - Ekipman Turu",sub:"Gemideki yangin ekipmanlarini tanimak",who:"z3",
  text:`Fire locker acildi. 3. Zabiti tek tek gosterdi:

"Hydrant, hose, nozzle, branch pipe, BA set, fireman's outfit, portable extinguisher, fire blanket... Bir yanginda neyin nerede oldugunu dusunmek icin gec kalinmaz."

Ilk profesyonel refleksin ne olur?`,
  choices:[
  {text:"Ekipmani yer, kullanim amaci ve hangi mahalde ise yarayacagiyla birlikte tanirim",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"Sadece hortum dolabinin yerini bilmenin yetecegini dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Yangin ekipmanini acil durumda bakarak ogrenmenin yeterli olacagini sanirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s288",gfx:"fire",alert:false,day:"Gun 8",time:"18:35",loc:"CO2 Room / Fire Plan",sub:"Otomatik ve fixed yangin sistemleri",who:"z3",
  text:`3. Zabiti fire plan ustunde fixed sistemleri gosterdi:

"Sprinkler, fixed CO2, local application, fire damper, quick-closing valve... Bunlar hortumun buyuk hali degil; farkli mantikla calisir. Ozellikle CO2'de sayim ve mahal izolasyonu hayati."

En dogru dusunce hangisi?`,
  choices:[
  {text:"Fixed sistemleri mahal, izolasyon, sayim ve release disipliniyle birlikte dusunurum",tag:"kritik",effect:{bilgi:19,sayginlik:13}},
  {text:"Otomatik sistem varsa yangin ekibine daha az gerek oldugunu dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"CO2 salmadan once mahal kontrolunun ikincil oldugunu sanirim",tag:"korkak",effect:{bilgi:-13,sayginlik:-12}}]},
  {id:"s289",gfx:"fire",alert:false,day:"Gun 8",time:"19:05",loc:"Muster Station - Sondurucu Secimi",sub:"Hangi yangina hangi sondurucu?",who:"z3",
  text:`3. Zabiti bu kez sadece isim sormadi; senaryo verdi:

"Kati madde, yanici sivi, elektrik panosu, mutfak yagi... Her birinde ayni refleks kurulmaz. En yakin sondurucuyu degil, en dogru sondurucuyu sececeksin."

En saglam ozet hangisi?`,
  choices:[
  {text:"Yangin sinifina gore su, foam, CO2, dry powder veya wet chemical mantigini ayiririm",tag:"kritik",effect:{bilgi:19,sayginlik:13}},
  {text:"Ilk elime gelen sondurucunun buyuk ihtimalle yeterli olacagini dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Elektrik ve yag yanginlarinda da suyun genelde guvenli oldugunu sanirim",tag:"korkak",effect:{bilgi:-13,sayginlik:-12}}]},
  {id:"s315",gfx:"bridge",alert:false,day:"Gun 9",time:"06:20",loc:"Panama Kanali - Gatun Yaklasmasi",sub:"Panama gecisinde ilk profesyonel dusunce",who:"suvari",
  text:`Suvari passage plan'i acip parmagini Panama kanal hattina basti.

"Burada denizden limana girer gibi davranilmaz. Pilotaj, lock sirasi, draft limiti, taze su etkisi ve makine hazirligi birlikte dusunulur. Kanal seni gecirmez; sen kanala uygun hale gelirsin."

Ilk hangi disipline tutunursun?`,
  choices:[
  {text:"Pilotaj, lock sirasi, draft/FWA ve makine-halat hazirligini birlikte kontrol ederim",tag:"kritik",effect:{bilgi:19,sayginlik:13}},
  {text:"Kanala girdikten sonra pilot ne derse o an dusunmenin yeterli oldugunu sanirim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Panama gecisini siradan bir bogaz gecisi gibi gorurum",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s316",gfx:"radar",alert:true,day:"Gun 10",time:"22:10",loc:"Malakka Bogazi - Gece Trafigi",sub:"Yogun trafik, balikci hedefleri ve dar CPA",who:"z2",radarMode:"multi_crossing",
  text:`Malakka gecesinde radar kalabalik. Buyuk ticari trafik bir yanda, zayif echo veren balikci hedefleri baska yanda akiyor.

2. Zabiti kisa konustu: "Burada bir hedefe kilitlenmek yetmez. Kucuk hedef, hizli crossing, AIS uyumsuzlugu ve safe speed ayni anda okunur."

Once neyi kurarsin?`,
  choices:[
  {text:"Safe speed'i dusurur, radar/visual/AIS capraz kontrolu ile kucuk hedefleri de tabloya alirim",tag:"kritik",effect:{bilgi:20,sayginlik:13,cesaret:3},radarMode:"multi_crossing"},
  {text:"Sadece buyuk hedefleri takip edip kucuk echo'lari ikinci plana atarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"multi_crossing"},
  {text:"Bu kadar hedefte yorum zor diye neredeyse sadece AIS listesine guvenirim",tag:"korkak",effect:{bilgi:-12,sayginlik:-11},radarMode:"multi_crossing"}]},
  {id:"s317",gfx:"bridge",alert:true,day:"Gun 11",time:"15:40",loc:"Hurmuz Bogazi - Guvenlik Brifingi",sub:"Guvenlik baskisi altinda gecis",who:"suvari",
  text:`Gecis oncesi kopruustunde hava degisti. Suvari rota uzerine guvenlik notlari birakti:

"Burada sadece seyir yapmiyoruz; guvenlik seviyesi, raporlama disiplini, gozculuk ve citadel hazirligi de dusunuluyor. Panik degil, kontrollu sertlik ister."

En saglam zabit tavri hangisi?`,
  choices:[
  {text:"Seyir planiyla birlikte security level, ek gozculuk, raporlama ve restricted area disiplinini uygularim",tag:"kritik",effect:{bilgi:18,sayginlik:13,cesaret:4}},
  {text:"Askeri/güvenlik baskisinin seyir vardiyasini cok degistirmedigini dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Baskidan dolayi asiri VHF ve gereksiz manevrayla durumu karistiririm",tag:"korkak",effect:{bilgi:-11,sayginlik:-11}}]},
  {id:"s318",gfx:"harbor",alert:false,day:"Gun 12",time:"07:25",loc:"Mississippi Nehri - Pilotaj Hatti",sub:"Nehir pilotajinda akis ve squat dusuncesi",who:"z2",
  text:`Nehir hattinda su kahverengiye donmus gibi. 2. Zabiti draft notuna bir daha bakti:

"Nehir limani deniz limani gibi okunmaz. Akis, dar donus, squat, bank effect, tug ihtiyaci ve lokal pilot bilgisi birlikte dusunulur."

Senin ilk profesyonel yorumun ne olur?`,
  choices:[
  {text:"Akis, squat/bank effect, tug ihtiyaci ve pilot bilgisini birlikte okuyarak nehir pilotajina hazirlanirim",tag:"kritik",effect:{bilgi:19,sayginlik:13}},
  {text:"Derinlik varsa nehir gecisinin normal liman yaklasmasindan cok farkli olmadigini sanirim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Nehirde sadece dumen komutlarini takip etmenin yeterli oldugunu dusunurum",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s319",gfx:"bridge",alert:false,day:"Gun 12",time:"10:40",loc:"Suveys Kanali - Konvoy Hatti",sub:"Konvoy, raporlama ve kanal disiplini",who:"suvari",
  text:`Suvari kanal kitabini masaya birakti:

"Suveys'te sadece duz su var diye rahatlanmaz. Konvoy zamani, pilot, speed restriction, meeting arrangement ve raporlama disiplini birlikte yurur."

Sen once neye tutunursun?`,
  choices:[
  {text:"Konvoy sirasi, raporlama noktasi, speed limiti ve pilot talimatini birlikte takip ederim",tag:"kritik",effect:{bilgi:19,sayginlik:13}},
  {text:"Kanal duz oldugu icin esas zorlayici tarafin az oldugunu dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Sadece onundeki gemiyi izleyip geri kalani ikincil gorurum",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s320",gfx:"bridge",alert:false,day:"Gun 12",time:"13:05",loc:"Kiel Kanali - Dar Gecis",sub:"Karsilasmalarda hiz ve bank effect",who:"z2",
  text:`2. Zabiti Kiel hattindaki notlara dokundu:

"Kanal sadece rota cizgisi degil; emme-etme etkisi, bank effect, karsilasmalarda hiz ayari ve lokal kurallar demek. Buyuk gemiler birbirini su gibi ceker."

En dogru dusunce hangisi?`,
  choices:[
  {text:"Karsilasmalarda hiz, bank effect ve lokal kanal talimatlarini birlikte dikkate alirim",tag:"kritik",effect:{bilgi:18,sayginlik:13}},
  {text:"Dar kanal ama duz oldugu icin sadece rota merkezini korumak yeterli sanirim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Bank effect'i teorik bilgi sayip pratikte onemsiz gorurum",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s321",gfx:"radar",alert:true,day:"Gun 12",time:"18:50",loc:"Dover Bogazi - Ayrim Duzeni",sub:"TSS, crossing trafik ve fog riski",who:"z2",radarMode:"guard_zone",
  text:`Dover hattinda trafik akiyor ama hava bozmaya baslamis.

2. Zabiti alti cizili anlatti: "Burada ayrim duzeni kagitta kalmaz. TSS disiplini, crossing ferries, fog riski ve guard zone alarmi ayni anda dusunulur."

Ilk disiplinin ne olur?`,
  choices:[
  {text:"TSS seridini korur, crossing trafik ve fog riskine gore radar/guard zone takibini siklastiririm",tag:"kritik",effect:{bilgi:19,sayginlik:13},radarMode:"guard_zone"},
  {text:"Seritte kaldikca crossing hedefleri ikinci planda kalir diye dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"guard_zone"},
  {text:"Dover trafigini AIS isimlerinden takip etmenin yeterli oldugunu sanirim",tag:"korkak",effect:{bilgi:-12,sayginlik:-11},radarMode:"guard_zone"}]},
  {id:"s322",gfx:"bridge",alert:true,day:"Gun 13",time:"04:35",loc:"Babulmendep - Dar Gecis",sub:"Security ve traffic separation birlikte",who:"suvari",
  text:`Gecis daraliyor. Suvari bir yanda security notu, bir yanda passage plan tutuyor.

"Burada dar gecit, trafik ayrimi ve security dusuncesi birbirinden ayrilmaz. Birini abartip oburunu ihmal edersen zincir kirilir."

Sen neyi birlikte tutarsin?`,
  choices:[
  {text:"Traffic separation, raporlama, ek gozculuk ve security farkindaligini ayni masada tutarim",tag:"kritik",effect:{bilgi:18,sayginlik:13,cesaret:3}},
  {text:"Dar gecit oldugu icin guvenlik tarafini ikinci plana atmanin sorun olmayacagini dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Guvenlik baskisiyla seyir disiplinini fazla bozup gereksiz VHF ve manevra yaratirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-11}}]},
  {id:"s323",gfx:"radar",alert:true,day:"Gun 13",time:"23:20",loc:"Torres Bogazi - Resif Gecisi",sub:"Sığ su, yerel akinti ve hassas rota",who:"z2",radarMode:"parallel_index",
  text:`Torres tarafinda harita adeta daraldi. Sığlıklar ve resifler rota hattina yaklasti.

2. Zabiti sakin ama sert: "Burada bir iki kablo hata romantik sayilmaz. Parallel index, local current, visual mark ve safe speed birlikte calisir."

En dogru refleks hangisi?`,
  choices:[
  {text:"Parallel indexing, yerel akinti, visual mark ve emniyetli hizi birlikte kullanirim",tag:"kritik",effect:{bilgi:20,sayginlik:13},radarMode:"parallel_index"},
  {text:"ECDIS rotasi acik oldugu surece ek cross-check'e daha az gerek oldugunu dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"parallel_index"},
  {text:"Bolgede pilot varsa kalan takibin cok kritik olmadigini sanirim",tag:"korkak",effect:{bilgi:-12,sayginlik:-11},radarMode:"parallel_index"}]},
  {id:"s324",gfx:"storm",alert:true,day:"Gun 14",time:"05:10",loc:"Macellan Bogazi - Sert Hava",sub:"Ruzgar, akis ve dar gecit baskisi",who:"suvari",
  text:`Macellan hattinda ruzgar gemiyi itiyor, akis baska yone cekiyor.

Suvari sesi kisik ama nettir: "Bazi yerlerde harita bir cizgi degildir; ruzgarin, akintinin ve dumen cevabinin pazarligidir. Burada aceleci rahatlik istemem."

Senin ilk profesyonel yorumun ne olur?`,
  choices:[
  {text:"Ruzgar, akis, dar gecit manevrasi ve makine hazirligini birlikte dusunerek daha konservatif giderim",tag:"kritik",effect:{bilgi:19,sayginlik:13,cesaret:4}},
  {text:"Macellan'i sadece biraz daha sert hava gibi gorup rutin vardiya mantigini korurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Baskidan dolayi ya asiri yavaslayip durumu tikarim ya da gereksiz risk alirim",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s325",gfx:"harbor",alert:false,day:"Gun 14",time:"10:10",loc:"St. Lawrence - Nehir Sistemi",sub:"Pilotaj, akinti ve tatli su dusuncesi",who:"z2",
  text:`St. Lawrence hattinda deniz mantigi bir anda nehir pilotajina donuyor.

2. Zabiti not etti: "Burada tatli su etkisi, akinti, dar alanlar ve yerel pilotaj bilgisi beraber gider. Draft raporu ve manevra hissi birlikte okunur."

En dogru yorumun ne olur?`,
  choices:[
  {text:"Tatli su etkisi, nehir akintisi, pilotaj ve dar manevra alanini birlikte degerlendiririm",tag:"kritik",effect:{bilgi:18,sayginlik:13}},
  {text:"St. Lawrence'i daha uzun bir liman yaklasmasi gibi dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Nehir pilotajinda draft ve su yogunlugunu ikincil gorurum",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s326",gfx:"bridge",alert:false,day:"Gun 14",time:"12:30",loc:"Korint Kanali - Dar Hiza",sub:"Dar kanal ama kisa gecis",who:"suvari",
  text:`Korint hattinda her sey yakin gorunuyor; kaya, duvar ve su.

Suvari omzunun ustunden bakti: "Kisa gecis diye rehavete izin yok. Dar kanal disiplini, hiz kontrolu ve bank etkisini kucuk diye hafife alani su affetmez."

Ilk refleksin ne olur?`,
  choices:[
  {text:"Dar gecit, hiz kontrolu ve duvar etkisini birlikte dusunup daha temiz bir vardiya kurarim",tag:"kritik",effect:{bilgi:18,sayginlik:13}},
  {text:"Gecis kisa oldugu icin risk penceresinin de kucuk oldugunu sanirim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Korint'i dar ama basit bir kanal gibi gorup cross-check'i gevsetirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s327",gfx:"bridge",alert:true,day:"Gun 15",time:"03:50",loc:"Sunda Bogazi - Akinti Hatti",sub:"Volkanik ada gecisi ve trafik karisimi",who:"z2",
  text:`Sunda hattinda trafik daginik, akinti ise beklediginden daha oyunlu.

2. Zabiti anlatti: "Burada sadece iki nokta arasindan gecmiyorsun. Yerel akinti, balikci hareketi ve sinirli gorus bazen dar bogazdan daha zor olur."

En dogru disiplin hangisi?`,
  choices:[
  {text:"Yerel akinti, daginik trafik ve visual/radar cross-check'i birlikte siklastiririm",tag:"kritik",effect:{bilgi:19,sayginlik:13}},
  {text:"Ana rota aciksa daginik yerel hedefleri ikinci planda tutarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Akinti yorumunu buyuk gemiler icin o kadar kritik gormem",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s328",gfx:"bridge",alert:true,day:"Gun 15",time:"06:15",loc:"Lombok Bogazi - Derin Gecis",sub:"Alternatif rota ama guclu akis",who:"suvari",
  text:`Lombok bazen Malakka yerine rahat rota gibi duyulur. Suvari hemen kesti:

"Derin diye kolay sayma. Guclu akis, dar pencereli trafik ve rota uzerindeki enerji hissi burada farklidir. Alternatif olmak risksiz olmak degil."

Neye dikkat edersin?`,
  choices:[
  {text:"Guclu akis, ETA kaymasi, rota kontrolu ve traffic picture'i birlikte izlerim",tag:"kritik",effect:{bilgi:18,sayginlik:13}},
  {text:"Lombok'u daha acik ve rahat su sayip vardiya baskisini azaltirim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Alternatif rota diye manevra ve akinti takibini gevsetirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s329",gfx:"radar",alert:true,day:"Gun 15",time:"19:10",loc:"Kerch Bogazi - Sira Bekleme",sub:"Dar gecit, raporlama ve trafik yogunlugu",who:"z2",radarMode:"ebl_vrm",
  text:`Kerch hattinda bekleyen trafik zincir gibi uzaniyor.

2. Zabiti dedi ki: "Burada bazen gecisin zorlugu manevradan cok raporlama, bekleme ve dar hedef ayrimidir. Mesafe ve kerterizi temiz okumak gerekir."

Ilk profesyonel tavrin ne olur?`,
  choices:[
  {text:"Raporlama disipliniyle birlikte EBL/VRM kullanir, dar hedef ayrimini net tutarim",tag:"kritik",effect:{bilgi:19,sayginlik:13},radarMode:"ebl_vrm"},
  {text:"Sira bekleniyorsa ayrintili hedef ayrimi daha az kritik diye dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"ebl_vrm"},
  {text:"Bekleme trafiginde radar mesafe/kerteriz disiplinini gevsetirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10},radarMode:"ebl_vrm"}]},
  {id:"s330",gfx:"storm",alert:true,day:"Gun 16",time:"02:40",loc:"Bering Bogazi - Soguk Hava Gecisi",sub:"Soguk, akinti ve gorus baskisi",who:"suvari",
  text:`Bering tarafinda hava sadece soguk degil; sert ve inatci.

Suvari not dusuyor: "Burada soguk hava sadece personeli degil, ekipmani ve gorusu de etkiler. Akinti, buz riski ve sis bir araya gelirse disiplin daha da sertlesir."

Sen nasil yaklasirsin?`,
  choices:[
  {text:"Soguk hava, gorus, ekipman etkisi ve akintiyi birlikte okuyup daha muhafazakar giderim",tag:"kritik",effect:{bilgi:19,sayginlik:13,cesaret:3}},
  {text:"Soguk havayi esasen personel konforu konusu gibi gorurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Bering gecisinde sis ve ekipman etkisini ikinci plana iterim",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s331",gfx:"harbor",alert:false,day:"Gun 16",time:"11:20",loc:"Yangtze Nehri - Yogun Ticari Hat",sub:"Nehir trafigi, pilot ve raporlama baskisi",who:"z2",
  text:`Yangtze hattinda nehir sanki durmuyor; trafik akiyor, terminal akiyor, anons akiyor.

2. Zabiti sesini alcatti: "Burada sadece nehir pilotaji yok. Yogun ticari trafik, raporlama disiplini, lokal kurallar ve zaman baskisi birlikte isler."

En dogru yorumun ne olur?`,
  choices:[
  {text:"Pilotaj, lokal raporlama, nehir trafigi ve operasyon baskisini birlikte yonetirim",tag:"kritik",effect:{bilgi:19,sayginlik:13}},
  {text:"Pilot varken yerel kural yogunlugunu ikinci planda tutarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Nehir hattinda anons ve lokal kural kalabaligini cok da onemli gormem",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s237",gfx:"bridge",alert:true,day:"Gun 6",time:"05:55",loc:"Koprustu - Sabah Vardiyasi",sub:"MOB proseduru ilk dakikalar",who:"z2",
  text:`Sancak taraftan bir cisim denize dustu. 2. Zabiti sesi sertlestirdi:

"MOB diye bagir, tarafi isaretle, goz temasini kaybetme, alarm zincirini baslat. Ilk dakika paniye degil prosedure aittir."

Ilk hareketin ne olur?`,
  choices:[
  {text:"MOB diye bagirir, sancak MOB'u isaret eder, goz temasini korur ve nobet zabitine net rapor veririm",tag:"kritik",effect:{bilgi:18,sayginlik:13,cesaret:4}},
  {text:"Once ne dustugunu anlamaya calisir sonra haber veririm",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Tek basima kosup bordaya egilirim",tag:"korkak",effect:{bilgi:-12,sayginlik:-10,cesaret:-2}}]},
  {id:"s238",gfx:"fire",alert:true,day:"Gun 6",time:"11:10",loc:"Accommodation - Koridor",sub:"Fire alarm calmaya basladi",who:"z3",
  text:`Yangin alarmi caldi. 3. Zabiti telsizde kisa konustu:

"Bu bir drill de olabilir, gercek de. Ama ilk refleks hep ayni: muster, rapor, tehlike bolgesine bilincli yaklasim."

Senin ilk davranisin ne olur?`,
  choices:[
  {text:"Muster station'ini ve gorevini esas alip alarm yerini teyit ederek rapor zincirine girerim",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"Dumana bakmak icin tek basima olay yerine yonelirim",tag:"cesur",effect:{cesaret:4,sayginlik:-5,bilgi:-4}},
  {text:"Gercek mi drill mi diye beklerim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s239",gfx:"engine",alert:false,day:"Gun 7",time:"14:20",loc:"Steering Gear Room",sub:"Emergency steering devreye alma",who:"carkci",
  text:`Ana kumanda zincirinde ariza varsayimi verildi. Basmuhendis bakisini sana cevirdi:

"Emergency steering oyalanarak acilacak bir sey degil. Haberlesme, yerel kumanda ve kopru-makine koordinasyonu birlikte dusunulur."

En dogru yaklasim hangisi?`,
  choices:[
  {text:"Yerel steering kontrolunu hazirlar, haberlesme zincirini kurar ve komut tekrarlarini netlestiririm",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"Sadece yerel dumeni acmanin yetecegini dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Kopru halleder diye steering room'dan uzak dururum",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s240",gfx:"deck",alert:true,day:"Gun 7",time:"16:40",loc:"Ana GÃ¼verte - Bunker Tarafi",sub:"Oil spill response ilk dakikalar",who:"z3",
  text:`Kucuk bir yag sizintisi scupper'a dogru yuruyor. 3. Zabiti sert bir sesle:

"Spill response gecikirse kucuk olay buyur. Kaynak kesilecek, yayilim sinirlanacak, SOPEP dusuncesi devreye girecek."

Ilk ne yaparsin?`,
  choices:[
  {text:"Kaynak akisini durdurmaya calisir, scupper'i korur ve amire spill bilgisi veririm",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"Once bez bulup biraz silerim, sonra soylerim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Dalga alir goturur diye onemsemem",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s241",gfx:"cargo",alert:false,day:"Gun 8",time:"00:40",loc:"Ambar Ustu - Cargo Watch",sub:"Gece cargo watch disiplini",who:"z1",
  text:`Gece yuk operasyonu devam ediyor. 1. Zabiti seni cargo watch'a birakti:

"Stajyer cargo watch sadece bakmak degil; draft, liste, trim, vinÃ§ ritmi, ambar ici emniyet ve evrak akisina kulak vermektir."

Neye odaklanirsin?`,
  choices:[
  {text:"Yukleme temposu kadar liste/trim, hatch emniyeti ve operasyon anonslarini birlikte takip ederim",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"Sadece vincin calisip calismadigina bakarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Cargo watch'i pasif bekleyis sanirim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}]},
  {id:"s242",gfx:"cargo",alert:false,day:"Gun 8",time:"09:25",loc:"Ambar Ustu",sub:"Hatch cover islemleri ve emniyet",who:"lostromo",
  text:`Lostromo hatch cover operasyonunda seni yanina cekti:

"Burada elini, ayagini, gozunu kaybeden cok oldu. Hatch cover hareket etmeden once alan bos mu, kilitler serbest mi, herkes nerede; bunlar net olacak."

Senin disiplinin ne olur?`,
  choices:[
  {text:"Hareket oncesi alan boslugunu, kilitleri ve personel konumunu tek tek teyit ederim",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"Makine hareket veriyorsa alanin da emniyetli oldugunu varsayarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Daha iyi gormek icin cover'a fazla yaklasirim",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s243",gfx:"engine",alert:false,day:"Gun 8",time:"10:50",loc:"Tank Table - Sounding Sheet",sub:"Tank sounding mantigi",who:"carkci",
  text:`Sounding cetveli acildi. Basmuhendis sakin anlatti:

"Sadece rakam okumazsin; hangi tank, hangi referans, bos mu dolu mu, trim etkisi var mi, tabloya nasil cevrilecek bunlari birlikte dusunursun."

En dogru yorum hangisi?`,
  choices:[
  {text:"Sounding degerini tablo, tank adi ve gemi durumuyla birlikte yorumlarim",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"Cetvelden bir rakam bulunca gerisi otomatik sanirim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Sounding ile ullage farkini onemsemem",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s244",gfx:"deck",alert:false,day:"Gun 8",time:"13:15",loc:"Work Permit Board",sub:"Permit to Work mantigi",who:"z3",
  text:`3. Zabiti permit board onunde durdu:

"Permit to Work kagit degil; isi, riski, izolasyonu, PPE'yi ve sorumluyu ayni cizgide toplar. Permit imzalandi diye risk bitmez, ama izinsiz is baslatmak daha buyuk hatadir."

Sana gore permit'in omurgasi nedir?`,
  choices:[
  {text:"Izin, risk degerlendirmesi, izolasyon, gaz/PPE kontrolu ve sorumluluk zincirinin birlikte kurulmasidir",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"Imza varsa isi baslatmak icin tek basina yeterlidir derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Kucuk islerde permit gereksiz diye dusunurum",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s245",gfx:"fire",alert:false,day:"Gun 8",time:"17:00",loc:"Muster Station - Emniyet Dersi",sub:"Fire classes ve yangin ekipmanlari",who:"z3",
  text:`Yangin panosu acildi. 3. Zabiti eliyle isaret etti:

"Class A, B, C, D, F yanginlari ayni degildir. Yanlis sondurucu iyi niyeti de tehlikeye cevirir. Yangin ekipmani sinifla birlikte dusunulur."

Dogru zabit refleksi hangisi?`,
  choices:[
  {text:"Yangin sinifini once tanir, sonra uygun ekipman ve medyayi secerim",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"En yakin sondurucuyu alip tum yanginlarda ayni sekilde kullanirim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Sondurucu cesitlerini ayirmanin gereksiz oldugunu dusunurum",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s246",gfx:"harbor",alert:false,day:"Gun 9",time:"08:35",loc:"Can Filikasi Mahalli",sub:"LSA / FFA ve muster list okuma",who:"z3",
  text:`Can kurtarma ve yanginla mucadele ekipmanlari basinda kisa brifing verildi.

"LSA ve FFA sadece sayim listesi degil. Muster listte kimin nereye gidecegi, hangi ekipmani kimin kullanacagi yazar. Gercek karga?a aninda insanlar bu kagida doner."

Ne yaparsin?`,
  choices:[
  {text:"Muster listte kendi gorevimi, toplanma yerimi ve yakindaki LSA/FFA ekipmanlarini birlikte ogrenirim",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"Sadece kendi can yelegimin yerini bilmem yeter derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Muster listin esasen tatbikat icin oldugunu sanirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s246b",gfx:"harbor",alert:false,day:"Gun 9",time:"09:10",loc:"Can Sali Mahalli",sub:"Can sali dis muayenesi ve servis takibi",who:"z3",
  text:`3. Zabiti can salinin yaninda durdu:

"Can sali sadece kutu degil. Hydrostatic release, painter, lash, container condition, embarkation area ve servis tarihi birlikte kontrol edilir. Tarihi gecmis bir can sali acil durumda var sayilmaz."

En dogru kontrol disiplini hangisi?`,
  choices:[
  {text:"Servis tarihi, HRU baglantisi, painter, lash ve konteyner kondisyonunu birlikte kontrol ederim",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"Disardan temiz gorunuyorsa yeterli sayarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Can sali bakiminin sadece tersanede onemli oldugunu dusunurum",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s246c",gfx:"harbor",alert:false,day:"Gun 9",time:"10:00",loc:"Can Filikasi Ustu",sub:"Can filikasi haftalik kontrol ve hazirlik",who:"z3",
  text:`Can filikasi kapagi acildi. 3. Zabiti eliyle tek tek gosterdi:

"Drain plug yerinde mi, inventory tamam mi, engine test mantikli mi, battery, su, ration, release gear ve communication set hazir mi? Filika bakimi liste okumak degil, gercekten kullanilabilir oldugunu anlamaktir."

Sana gore profesyonel yaklasim nedir?`,
  choices:[
  {text:"Filika inventory, drain plug, engine readiness, battery ve release gear'i sistemli kontrol ederim",tag:"kritik",effect:{bilgi:18,sayginlik:13}},
  {text:"Sadece motor bir kez calissin, gerisi sonra bakilir derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Filika kapali duruyorsa zaten hazirdir diye dusunurum",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s246d",gfx:"cabin",alert:false,day:"Gun 9",time:"11:20",loc:"Muster Station Locker",sub:"Can yelekleri ve immersion suit kontrolu",who:"z3",
  text:`Locker acildiginda 3. Zabiti can yeleklerini ve immersion suitleri one cikardi:

"Whistle, light, retro-reflective tape, buddy line, size, donning instructions ve genel kondisyon birlikte okunur. Paket acik, light zayif ya da kemer hasarliysa sorun buyuktur."

Ne yaparsin?`,
  choices:[
  {text:"Can yeleklerinin isik, dugun/kemer, duduk ve kondisyonunu; suitlerin de size ve kapanisini kontrol ederim",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"Sadece sayi tam mi diye bakarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Can yeleklerinde ayrintili kontrole gerek olmadigini sanirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s246e",gfx:"deck",alert:false,day:"Gun 9",time:"14:30",loc:"Matafora ve Irgat Basi",sub:"Matafora, winch ve launching appliance bakimi",who:"lostromo",
  text:`Lostromo matafora rayini ve launching winch'i isaret etti:

"Telin gozlemi, grease noktasi, limit switch, brake, sheave, fall condition ve hareketli kisimlar birlikte dusunulur. Burada kucuk ihmal tatbikatta bile buyuk risk olur."

Hangi refleks daha dogru?`,
  choices:[
  {text:"Fall condition, sheave, brake, grease noktasi ve limit/serbest hareketi birlikte kontrol ederim",tag:"kritik",effect:{bilgi:18,sayginlik:12,cesaret:3}},
  {text:"Matafora bir kere asagi yukari hareket etsin, o bana yeter derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Yuk altindaki sistemlerde detayli bakimin gereksiz oldugunu dusunurum",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s246f",gfx:"harbor",alert:false,day:"Gun 9",time:"16:10",loc:"Emergency Equipment Round",sub:"Pyro, line-throwing appliance, EPIRB ve SART kontrolu",who:"z2",
  text:`Aksamustu emniyet turunda 2. Zabiti dosyayi acip sordu:

"Pyrotechnics expiry, line-throwing appliance inventory, EPIRB bracket durumu, SART self-test, handheld VHF battery ve muster station readiness ayni turun parcasi. Kimi ekipman kullanilmadigi icin unutulur; en tehlikelisi de budur."

En dogru zabit disiplini hangisi?`,
  choices:[
  {text:"Expiry tarihleri, bracket/ready durumu, self-test ve inventory kaydini birlikte kontrol ederim",tag:"kritik",effect:{bilgi:18,sayginlik:13}},
  {text:"Sadece EPIRB'in yerinde olmasi bana yeter",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Kullanilmayan acil ekipmanlarin kontrolunu ertelerim",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s246g",gfx:"harbor",alert:false,day:"Gun 9",time:"16:45",loc:"Can Filikasi Mahalli",sub:"Rescue boat launch drill",who:"z3",
  text:`Bu kez tatbikat filika bakmakla kalmadi; rescue boat launch akisi anlatildi.

"Hook, painter, engine readiness, crew PPE, communication ve recovery plani birlikte dusunulmezse drill bile kazaya doner." dedi 3. Zabiti.

Ilk profesyonel disiplinin ne olur?`,
  choices:[
  {text:"PPE, communication, hook/painter kontrolu ve recovery planini birlikte teyit ederim",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"Bot suya iniyorsa kalan detaylar ekip icinde halledilir diye dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Launch drillinde asil riskin operasyon sonrasi toplamada oldugunu dusunmeyip acele ederim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s246h",gfx:"deck",alert:false,day:"Gun 9",time:"17:15",loc:"Ana Guverte - SOPEP Locker",sub:"Oil spill drill akisi",who:"z3",
  text:`SOPEP tatbikatinda kucuk bir sizinti senaryosu verildi.

"Scupper kapama, absorbent, spill kit, raporlama ve kaynak izolasyonu ayni anda dusunulur. Bez alip silmek tatbikat sayilmaz." dedi 3. Zabiti.

Sen neyi once kurarsin?`,
  choices:[
  {text:"Kaynak izolasyonu, scupper korumasi ve spill kit yerlesimini birlikte baslatirim",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"Once zemini silip sonra yayilima bakarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"SOPEP drillini formalite gorur, rapor zincirini ikincil sayarim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s246i",gfx:"engine",alert:false,day:"Gun 9",time:"17:50",loc:"Steering Gear Room - Drill",sub:"Emergency steering drill",who:"carkci",
  text:`Steering gear room'da bu kez tam tatbikat akisi kuruldu.

"Kopru komutu, yerel tekrar, dumen aci teyidi ve haberlesme net degilse emergency steering gercek anda kaosa doner." dedi basmuhendis.

En dogru uygulama hangisi?`,
  choices:[
  {text:"Komut tekrarini, dumen aci teyidini ve kopru-yerel haberlesmeyi disiplinle kurarim",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"Yerel kol hareket ediyorsa drillin basarili sayilacagini dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Emergency steering drillinde yazili tekrar ve teyidin o kadar gerekli olmadigini sanirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s246j",gfx:"deck",alert:false,day:"Gun 9",time:"18:25",loc:"Kapali Mahal Girisi",sub:"Enclosed space rescue drill",who:"gazsubay",
  text:`Gaz Kontrol Subayi Elif bu kez kapali mahal kurtarma tatbikati acti.

"Permit, gas reading, attendant, communication, rescue set ve standby ekip ayni zincirin halkalari. Iceri girmek kadar yanlis kurtarma denemesi de oldurur."

Senin ilk dogru refleksin ne olur?`,
  choices:[
  {text:"Permit, gaz olcumu, attendant ve rescue hazirligini birlikte teyit ederim",tag:"kritik",effect:{bilgi:19,sayginlik:13}},
  {text:"Iceride biri bayildiysa ilk refleks olarak hizla iceri atlamayi dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Kapali mahal rescue drillinde attendant ve communication rolunu ikinci plana atarim",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s247",gfx:"compass",alert:false,day:"Gun 9",time:"19:10",loc:"Koprustu - Gece Seyri",sub:"Fenerler, sekiller ve sis isaretleri",who:"z2",
  text:`Gece vardiyasinda 2. Zabiti disariyi isaret etti:

"Fenerler ve sekiller geminin ne yaptigini soyler; sis isaretleri de gormedigin durumda sana onun niyetini hissettirir. Renk, ritim, sekil ve ses birlikte okunur."

Dogru yorum disiplini hangisi?`,
  choices:[
  {text:"Renk, isik karakteri, gunduz sekli ve sis isaretini birlikte dusunurum",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"Sadece gordugum rengin gemiyi anlamaya yettigini dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Sis isaretlerini pratikte gereksiz bulurum",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s248",gfx:"bridge",alert:false,day:"Gun 10",time:"01:15",loc:"Koprustu - COLREG Sorgusu",sub:"Head-on, crossing ve overtaking ayrimi",who:"suvari",
  text:`Suvari radar ve dis gorusu birlikte gosterdi:

"Bir hedef tam karsidan geliyorsa head-on, sancaginda riskli acida belirdiyse crossing, kiÃ§ omuzlugundan yetisiyorsa overtaking dusunursun. Karari dogru koymadan manevra dusuncesi kurulmaz."

Hangi ozet en dogru?`,
  choices:[
  {text:"Head-on'da iki taraf sanca?a duser; crossing'de sancaginda hedef varsa sen give-way olursun; overtaking yapan gemi yol verir",tag:"kritik",effect:{bilgi:19,sayginlik:13,cesaret:4}},
  {text:"Bu uc durumda da once diger geminin ne yapacagini beklemek yeterlidir",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Overtaking ile crossing'i pratikte ayirmanin cok da onemli olmadigini dusunurum",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s248b",gfx:"bridge",alert:false,day:"Gun 10",time:"01:35",loc:"Koprustu - COLREG Rule 5",sub:"Look-out sadece disari bakmak degildir",who:"suvari",
  text:`Suvari kopruustu camindan disari bakarken kisa kesti:

"Rule 5. Proper look-out. Bu sadece gozunu denize cevirmek degil; gorus, isitsel takip, radar, AIS, hava, trafik ve geminin durumunu birlikte izlemektir. Tek kaynaga yaslanan zabit gec fark eder."

En dogru vardiya refleksi hangisi?`,
  choices:[
  {text:"Dis gorus, isitsel dikkat, radar/ECDIS cross-check ve trafik trendini birlikte tutarim",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"Radar aciksa disariyi daha az kontrol etmenin sorun olmayacagini dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"AIS etiketleri varken look-out'un buyuk olcude tamamlandigini sanirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s248c",gfx:"radar",alert:false,day:"Gun 10",time:"02:05",loc:"Koprustu - COLREG Rule 6",sub:"Safe speed ve duruma gore emniyetli hiz",who:"z2",radarMode:"multi_crossing",
  text:`2. Zabiti radar resmi, yagmur perdesi ve trafik yogunlugunu gosterdi:

"Rule 6. Safe speed sabit bir rakam degil. Gorus, trafik yogunlugu, manevra kabiliyeti, draft, fon isiklari, deniz durumu ve radar sinirlari birlikte dusunulur. Ayni knot her durumda emniyetli degildir."

Sence en dogru yorum nedir?`,
  choices:[
  {text:"Safe speed'i gorus, trafik, manevra ve sensor limitleriyle birlikte degerlendiririm",tag:"kritik",effect:{bilgi:18,sayginlik:12},radarMode:"multi_crossing"},
  {text:"Pilot booktaki ortalama hizi dogrudan emniyetli hiz kabul ederim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"multi_crossing"},
  {text:"Makine elveriyorsa yuksek hiz her zaman daha kontrolludur diye dusunurum",tag:"korkak",effect:{bilgi:-12,sayginlik:-11},radarMode:"multi_crossing"}]},
  {id:"s248d",gfx:"radar",alert:true,day:"Gun 10",time:"02:40",loc:"Koprustu - COLREG Rule 7/8",sub:"Risk of collision ve erken, belirgin action",who:"suvari",radarMode:"cpa",
  text:`CPA dusuyor ama hedefin kerterizi neredeyse sabit. Suvari sakin sesle sordu:

"Rule 7 risk of collision, Rule 8 action. Suphe varsa risk var kabul edilir. Manevra erken, belirgin ve iyi denizcilige uygun olacak; son anda kucuk oynamalar degil."

Dogru davranis hangisi?`,
  choices:[
  {text:"Kerteriz/CPA trendini risk sayar, erken ve belirgin manevra dusuncesini zabite tasirim",tag:"kritik",effect:{bilgi:19,sayginlik:13,cesaret:4},radarMode:"cpa"},
  {text:"Karsidaki son ana kadar bir sey yapmazsa ben de beklerim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"cpa"},
  {text:"Supheyi risk saymayip son dakikaya kadar izlemekle yetinirim",tag:"korkak",effect:{bilgi:-12,sayginlik:-11},radarMode:"cpa"}]},
  {id:"s248e",gfx:"bridge",alert:false,day:"Gun 10",time:"03:20",loc:"Koprustu - COLREG Rule 18",sub:"Hangi gemi hangisine gore yol durumunda?",who:"suvari",
  text:`Suvari ufku isaret etti:

"Rule 18 hiyerarsiyi bilmeden tablo kurulmaz. Not under command, restricted in ability to manoeuvre, constrained by draft, fishing, sailing ve power-driven vessel iliskisi ezber degil; oncelik ve sorumluluk mantigidir."

Asagidaki ozetlerden hangisi daha saglam?`,
  choices:[
  {text:"Hiyerarsiyi kurar; ozel durumdaki gemilere karsi kendi gemimin gorevini turune gore degerlendiririm",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"Buyuk gemi kucuk gemiye her zaman yol verir ya da alir gibi tek cizgili dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Yelkenli, balikci ve manevrasi kisitli gemi ayrimlarini cok da onemli bulmam",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s248f",gfx:"night",alert:false,day:"Gun 10",time:"04:10",loc:"Koprustu - COLREG Rule 19",sub:"Restricted visibility ve sis icinde davranis",who:"z2",
  text:`Sis cokerken disarisi sut gibi oldu. 2. Zabiti sesini alcatti:

"Rule 19. Restricted visibility'de gordugun kadarini degil, gormedigini de yonetirsin. Safe speed, engine readiness, radar yorum, fog signal ve ani sancak on hedeflerine karsi ozenli davranis gerekir."

Bu durumda en dogru zabit dusuncesi hangisi?`,
  choices:[
  {text:"Hizi duruma gore sorgular, radar cross-check yapar, fog signal ve ani hedef riskini birlikte dusunurum",tag:"kritik",effect:{bilgi:19,sayginlik:13},radarMode:"small_target"},
  {text:"Radar iyi goruyorsa sisin pratikte oyunu cok degistirmedigini varsayarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4},radarMode:"small_target"},
  {text:"Sis kurallarini ancak hedef ciktiktan sonra dusunmenin yeterli oldugunu sanirim",tag:"korkak",effect:{bilgi:-12,sayginlik:-11},radarMode:"small_target"}]},
  {id:"s249",gfx:"fire",alert:false,day:"Gun 10",time:"10:30",loc:"Hospital Room",sub:"Ilk yardimda ilk oncelik",who:"z3",
  text:`Tayfalardan biri guvertede kayip dizini ve on kolunu vurdu. 3. Zabiti seni yanina aldi:

"Ilk yardim kahramanlik degil; sahayi emniyete almak, bilinci, solunumu ve kanamayi dogru sirayla degerlendirmektir. Panikle atlanan en basit adim bile buyuk hata olur."

Ilk refleksin ne olur?`,
  choices:[
  {text:"Sahayi emniyete alir, bilinc-solunum-kanama sirasiyla kontrol eder ve amire haber veririm",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"Yaraliya hemen su icirmeye calisirim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Durumu tam anlamadan yaraliyi hizla ayaga kaldiririm",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s250",gfx:"fire",alert:false,day:"Gun 10",time:"14:20",loc:"Muster Station - Fire Party Brief",sub:"Ileri yanginla mucadele dusuncesi",who:"z3",
  text:`3. Zabiti fire party ekipmanini kontrol ederken acikladi:

"Ileri yanginla mucadele sadece hortum tutmak degil. Siniri kapatirsin, havalandirmayi dusunursun, boundary cooling, entry control, ekip guvenligi ve haberlesme zinciri birlikte yurur."

Bu seviyede en dogru dusunce hangisi?`,
  choices:[
  {text:"Yangin sinifini, mahal izolasyonunu, boundary cooling'i ve ekip haberlesmesini birlikte dusunurum",tag:"kritik",effect:{bilgi:18,sayginlik:13,cesaret:3}},
  {text:"Yangina en hizli kosanin isi bitirecegini dusunurum",tag:"cesur",effect:{cesaret:4,sayginlik:-4,bilgi:-4}},
  {text:"Sadece sondurucuyu alip iceri dalmanin yeterli oldugunu sanirim",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s251",gfx:"fire",alert:false,day:"Gun 10",time:"15:10",loc:"Fire Locker",sub:"Hangi yangini ne sondurur?",who:"z3",
  text:`3. Zabiti fire locker onunde seni sinadi:

"Class A katilar, Class B yanici sivilar, Class C gazlar, Class D metaller, Class F mutfak yagi. Simdi kritik kisim: her yangina ayni ekipman gidemez. Bunu ezber degil mantik olarak oturt."

En dogru secim hangisi?`,
  choices:[
  {text:"A sinifinda su/foam dusunur, B'de foam veya uygun kuru kimyevi toz dusunur, elektrikte once enerjiyi ve uygun CO2 mantigini sorgularim",tag:"kritik",effect:{bilgi:19,sayginlik:13}},
  {text:"Su varsa her yanginda ilk tercih odur derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Yangin siniflari ile sondurucu seciminin cok da bagli olmadigini dusunurum",tag:"korkak",effect:{bilgi:-13,sayginlik:-12}}]},
  {id:"s252",gfx:"fire",alert:true,day:"Gun 10",time:"16:00",loc:"Galley Girisi",sub:"Yag yangini ve elektrik panosu farki",who:"z3",
  text:`Ayni gun iki senaryo soruldu:

"Galley'de kizgin yag tavasi alev aldi. Bir baska odada da elektrik panosu duman veriyor. Iyi stajyer bu ikisini ayni gormez; yanlis medyayla yangini buyutmez."

Ne dersin?`,
  choices:[
  {text:"Yag yangininda uygun kapatma/blanket veya uygun medyayi dusunur; elektrik panosunda enerjiyi kestirmeden suya kosmam",tag:"kritik",effect:{bilgi:19,sayginlik:13,cesaret:3}},
  {text:"Ikisinde de en hizli cozum olarak su basarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Pano yanginiyla yag yangininin pratikte ayni oldugunu dusunurum",tag:"korkak",effect:{bilgi:-13,sayginlik:-12}}]},
  {id:"s253",gfx:"fire",alert:false,day:"Gun 10",time:"16:35",loc:"Fire Locker",sub:"SCBA kullanimi ve kontrolu",who:"z3",
  text:`3. Zabiti SCBA setini onune koydu:

"Tup var diye hazir sayilmaz. Basinc, maske, demand valve, harness, alarm ve buddy check birlikte dusunulur. SCBA ile kahramanlik degil disiplin yapilir."

En dogru refleksin ne olur?`,
  choices:[
  {text:"Basinc, maske sizdirmazligi, alarm, harness ve buddy check'i tamamlayip oyle hazir sayarim",tag:"kritik",effect:{bilgi:18,sayginlik:13}},
  {text:"Set sirtta duruyorsa ayrintili kontrole gerek olmadigini dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Maskeyi hizli takmanin tum emniyet kontrolunden daha onemli oldugunu sanirim",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s254",gfx:"fire",alert:false,day:"Gun 10",time:"17:05",loc:"Safety Office",sub:"Fire plan okuma ve mahal bulma",who:"z3",
  text:`Safety office duvarinda fire control plan asiliydi. 3. Zabiti kalemiyle isaretledi:

"Yangin planinda mahal, bulkhead, escape route, hydrant, damper, fire station ve fixed system yerleri okunur. Plani okuyamayan adam gemiyi ezbere arar."

Sence en profesyonel yaklasim hangisi?`,
  choices:[
  {text:"Plan ustunde yangin mahallini, en yakin hydrant'i, kacis yolunu ve izolasyon noktalarini birlikte okurum",tag:"kritik",effect:{bilgi:19,sayginlik:13}},
  {text:"Sadece mahal adini bilmek yeter derim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Fire planin gercek olayda cok zaman kazandirmadigini dusunurum",tag:"korkak",effect:{bilgi:-13,sayginlik:-12}}]},
  {id:"s255",gfx:"meteo_panel",alert:false,day:"Gun 7",time:"15:10",loc:"Koprustu - Acik Ufuk",sub:"Cumulus bulutu neye donusebilir?",who:"z2",
  text:`2. Zabiti sancak omuzluktaki bulutlara bakip sordu:

"Her pamuk gibi bulut masum degildir. Cumulus gun icinde dikey gelisim gosterirse shower'a, hatta uygun kosulda CB'ye kadar gidebilir. Bulutu tek kare degil, zaman icinde okuyacaksin."

Ilk profesyonel yorumun ne olur?`,
  choices:[
  {text:"Bulutun dikey gelisimini, ruzgar degisimini ve basinc trendini birlikte izlerim",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"Pamuksuysa havanin guzel kalacagini varsayarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Bulut tipiyle havanin gidisati arasinda ciddi bag olmadigini dusunurum",tag:"korkak",effect:{bilgi:-12,sayginlik:-10}}]},
  {id:"s256",gfx:"meteo_panel",alert:false,day:"Gun 7",time:"17:40",loc:"Koprustu - Aksam Ustu",sub:"Cirrus ve yaklasan front ipucu",who:"z2",
  text:`Aksam ustu gokyuzunde ince, tuy gibi izler belirdi.

2. Zabiti gulumsemeden anlatti: "Cirrus sadece guzel goruntu degil. Ust seviyede buz kristali bulutudur; bazen yaklasan warm front'un ilk habercilerinden biri olur. Hava daha bozmadan ipucu verir."

Ne dersin?`,
  choices:[
  {text:"Cirrus'u ust seviye bulutu olarak okur, diger isaretlerle birlikte front yaklasimini sorgularim",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"Ince bulutlarin hava tahmininde onemsiz kaldigini dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Bulut yuksekliginin pratikte bir sey fark ettirmedigini sanirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s257",gfx:"meteo_panel",alert:false,day:"Gun 8",time:"06:50",loc:"Koprustu - Yagisli Sabah",sub:"Nimbostratus ve surekli yagis",who:"z2",
  text:`Sabah acildiginda gokyuzu tek parca griye donmustu. Yagis ince ama kalici.

"Nimbostratus bagirmaz; uzatir." dedi 2. Zabiti. "Gorus, islak guverte, yuk operasyonu ve vardiya konforu ayni anda etkilenir. Her yagis saganak karakterli degildir."

Bu tabloyu nasil okursun?`,
  choices:[
  {text:"Uzun sureli yaygin yagis, dusen gorus ve guverte etkisini birlikte dusunurum",tag:"kritik",effect:{bilgi:17,sayginlik:12}},
  {text:"Saganak kadar sert degilse operasyonu pek etkilemeyecegini dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Yagis turlerinin operasyonel fark yaratmadigini sanirim",tag:"korkak",effect:{bilgi:-11,sayginlik:-10}}]},
  {id:"s258",gfx:"meteo_panel",alert:true,day:"Gun 8",time:"13:20",loc:"Koprustu - Squall Hatti",sub:"Cumulonimbus ve ani ruzgar riski",who:"suvari",
  text:`Ufukta kule gibi buyuyen koyu bir bulut duvari var. Alti daha da karanlik.

Suvari eliyle isaret etti: "CB. Burada sadece yagmur yok; ani ruzgar, yildirim, sert gorus dususu ve squall olabilir. Guverteyi, radar yorumunu ve rota dusuncesini bir anda etkiler."

En dogru refleks hangisi?`,
  choices:[
  {text:"CB'yi ani ruzgar ve saganak riski olarak gorur, guverte ve seyir emniyetini once sorgularim",tag:"kritik",effect:{bilgi:18,sayginlik:13,cesaret:3}},
  {text:"Bulut gecene kadar sadece izlemeyi yeterli bulurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Yildirim olmadikca CB'nin fazla fark yaratmayacagini dusunurum",tag:"korkak",effect:{bilgi:-13,sayginlik:-11}}]},
  {id:"s263",gfx:"meteo_panel",alert:false,day:"Gun 8",time:"18:10",loc:"Koprustu - Barometre Kosesi",sub:"Barometre dususu ne anlatir?",who:"z2",
  text:`2. Zabiti barometre kaydini gunluk cizelgeyle yan yana koydu:

"Tek bir deger degil, trend onemli. BasinÃ§ hizli dusuyorsa yaklasan alcak basinc, squall line ya da bozan hava dusunursun. Yavas toparlaniyorsa sistem geciyor olabilir."

Bu kaydi nasil yorumlarsin?`,
  choices:[
  {text:"Tek sayidan cok basinc trendine, ruzgar donusune ve bulut davranisina birlikte bakarim",tag:"kritik",effect:{bilgi:18,sayginlik:12}},
  {text:"Anlik basinc normal gorunuyorsa trendi ikinci planda tutarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Barometrenin pratik seyirde ciddi fark yaratmadigini dusunurum",tag:"korkak",effect:{bilgi:-12,sayginlik:-10}}]},
  {id:"s264",gfx:"meteo_panel",alert:false,day:"Gun 9",time:"04:40",loc:"Koprustu - Sisli Sabah",sub:"Sis tipi ve gorus yonetimi",who:"suvari",
  text:`Sabaha karsi gorus kapandi. Denizin ustu sut gibi.

Suvari kisa kesti: "Her sis ayni degil. Advection fog, radiation fog, sea smoke... Ama vardiyada ilk sorumuz ayni: gorus ne kadar dustu, rota ve hiz ne olacak, hangi ek tedbirler devreye girecek?"

Sence en dogru dusunce ne?`,
  choices:[
  {text:"Sis tipini anlamaya calisir ama once gorus, hiz, fog signal ve radar cross-check'i birlikte dusunurum",tag:"kritik",effect:{bilgi:18,sayginlik:13}},
  {text:"Sis tipini bilmiyorsam diger tedbirlerin de cok fark etmeyecegini dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Sis olsa da rota ayniysa hiz ve vardiya mantiginin cok degismeyecegini sanirim",tag:"korkak",effect:{bilgi:-13,sayginlik:-11}}]},
  {id:"s265",gfx:"meteo_panel",alert:false,day:"Gun 9",time:"11:30",loc:"Koprustu - Synoptic Chart",sub:"Isobar ve front cizgilerini okuma",who:"z2",
  text:`Masada synoptic chart acik. 2. Zabiti kalemiyle cizgilerin uzerinden gecti:

"Isobarlarin siklasmasi ruzgar potansiyelini hissettirir. Warm front, cold front, occlusion; bunlar hava degisiminin dilidir. Haritayi okuyamayan zabit sadece geleni karsilar."

Ne yaparsin?`,
  choices:[
  {text:"Isobar sikligi, front tipi ve geminin goreli mevkiini birlikte okumaya calisirim",tag:"kritik",effect:{bilgi:19,sayginlik:13}},
  {text:"Sadece ruzgar oklarini okuyup front detayini ikinci plana atarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Synoptic chartin ancak karadaki meteorologlar icin anlamli oldugunu dusunurum",tag:"korkak",effect:{bilgi:-13,sayginlik:-11}}]},
  {id:"s266",gfx:"meteo_panel",alert:false,day:"Gun 9",time:"14:10",loc:"Yuk Ofisi - Havalandirma Karari",sub:"Dew point ve cargo sweat riski",who:"z1",
  text:`1. Zabiti hava cetveliyle ambar kaydini yan yana koydu:

"Meteoroloji sadece kopruustunun isi degil. Dew point'i yanlis okursan havalandirma diye ambari terletirsin. Sicak-nemli hava soguk yukle bulusursa zarar buyur."

En saglam yorum hangisi?`,
  choices:[
  {text:"Dis hava, ambar ici hava ve dew point farkini birlikte okuyup sonra havalandirma karari veririm",tag:"kritik",effect:{bilgi:19,sayginlik:13}},
  {text:"Disarisi temiz gorunuyorsa havalandirmanin her zaman iyi oldugunu dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Meteoroloji verisiyle ambar kondisyonu arasinda ciddi bag olmadigini sanirim",tag:"korkak",effect:{bilgi:-13,sayginlik:-11}}]},
  {id:"s267",gfx:"cargo",alert:false,day:"Gun 10",time:"09:20",loc:"Ambar Ustu - Tropik Gecis",sub:"Sicak bolgede yuk terlemesini onleme",who:"z1",
  text:`Tropik hatta hava agirlasti. 1. Zabiti ambar havalandirma kaydini acip sordu:

"Sicak ve nemli bolgede hatali havalandirma ambari ferahlatmaz; bazen yukun ustune su indirir. Ozellikle celik urunler, kagit, paketli yuk ve hassas torbali yukler terleme ve pasla hizli zarar gorur."

Ne yaparsin?`,
  choices:[
  {text:"Dis hava/ambar ici hava farkini, dew point'i ve yuk cinsini birlikte okuyup kontrollu havalandirma dusunurum",tag:"kritik",effect:{bilgi:18,sayginlik:13}},
  {text:"Kapaklari acip ne kadar hava girerse o kadar iyi olacagini dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Sicak bolgede yuk zaten terler diye tedbiri gereksiz gorurum",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s268",gfx:"cargo",alert:false,day:"Gun 10",time:"18:25",loc:"Ambar Ustu - Soguk Hava Gecisi",sub:"Soguk bolgede yogusma ve ship sweat riski",who:"z1",
  text:`Kuzeye cikildikca saclar sogudu. 1. Zabiti ambar kapagini eliyle yokladi:

"Soguk sac, daha sicak nemli havayla bulusursa damlama icerde baslar. Bazen yuk terlemez; gemi terler. O su yukun ustune duser."

Bu durumda en dogru refleks hangisi?`,
  choices:[
  {text:"Soguyan yuzeyleri, ambar ic sicakligini ve ship sweat ihtimalini birlikte dusunurum",tag:"kritik",effect:{bilgi:18,sayginlik:13}},
  {text:"Yagis yoksa ambar icinde nem sorunu da olmayacagini varsayarim",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Soguk havanin yuk icin otomatik olarak daha guvenli oldugunu sanirim",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s269",gfx:"cargo",alert:false,day:"Gun 11",time:"07:45",loc:"Reefer Kontrol Koridoru",sub:"Sicak bolgede reefer yuk disiplini",who:"z1",
  text:`Reefer konteyner sirasi boyunca fan sesleri ayni degil. 1. Zabiti seni yanina cagiriyor:

"Sicak bolgede reefer sadece prizde dursun yeter diye dusunulmez. Setpoint, return air, supply air, alarm kaydi ve kapak muhuru birlikte okunur. Kucuk fark buyuk hasar dogurur."

Ilk kontrol ne olur?`,
  choices:[
  {text:"Setpoint, alarm kaydi, return/supply air degerleri ve fiziksel durumunu birlikte kontrol ederim",tag:"kritik",effect:{bilgi:19,sayginlik:13}},
  {text:"Elektrik geliyorsa reeferin guvende oldugunu dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Disaridan soguk hissediliyorsa ayrintiya gerek olmadigini sanirim",tag:"korkak",effect:{bilgi:-12,sayginlik:-11}}]},
  {id:"s270",gfx:"cargo",alert:false,day:"Gun 11",time:"16:40",loc:"Yuk Ofisi - Gecis Plani",sub:"Sicak-soguk geciste yuk selameti plani",who:"suvari",
  text:`Suvari rota ustunde iki farkli iklimi isaret etti:

"Asil hata bir bolgenin tedbirini digerine tasimaktir. Sicaktan soguga, soguktan neme gecislerde havalandirma, lashing, reefer takibi, ambar turu ve jurnal notu birlikte planlanir."

Sence profesyonel plan nasil kurulur?`,
  choices:[
  {text:"Bolge degisiminden once yuk cinsine gore havalandirma, kontrol turu ve jurnal planini birlikte kurarim",tag:"kritik",effect:{bilgi:19,sayginlik:14}},
  {text:"Deniz sakin oldugu surece iklim gecisinin buyuk fark yaratmayacagini dusunurum",tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
  {text:"Yuk selametini sadece limanda dusunmenin yeterli oldugunu sanirim",tag:"korkak",effect:{bilgi:-13,sayginlik:-11}}]}
];

function getEcdisRouteOverlay(sc){
  const key=(sc&&sc.ecdisPlanKey)||activeEcdisPlanKey;
  const plan=ECDIS_ROUTE_PLANS[key];
  if(!plan) return '';
  const points=plan.waypoints.map(p=>`
    <circle cx="${p.x}" cy="${p.y}" r="3" fill="#1aff50" stroke="#b5ffd0" stroke-width=".6"/>
    <text x="${p.x+5}" y="${p.y-5}" fill="#81f7b8" font-size="6" font-family="monospace">${p.name}</text>`).join('');
  return `<g opacity=".98">
    <rect x="282" y="34" width="160" height="78" rx="3" fill="#03111c" stroke="#0d2a48" stroke-width="1.1"/>
    <path d="M290 44 h144 M290 58 h144 M290 72 h144 M290 86 h144 M290 100 h144" stroke="#10304e" stroke-width=".6" opacity=".45"/>
    <path d="M302 38 v68 M330 38 v68 M358 38 v68 M386 38 v68 M414 38 v68" stroke="#10304e" stroke-width=".6" opacity=".45"/>
    <polyline points="${plan.line}" fill="none" stroke="#d4a017" stroke-width="2.2" stroke-dasharray="5,3"/>
    ${points}
    <circle cx="294" cy="100" r="4.2" fill="#6fa8dc"/>
    <path d="M294 100 l10 -5 l-3 9 z" fill="#6fa8dc"/>
    <text x="290" y="30" fill="#6fa8dc" font-size="6" font-family="monospace">ECDIS ROUTE PLAN</text>
    <text x="290" y="118" fill="#d4a017" font-size="6" font-family="monospace">${plan.label}</text>
    <text x="386" y="118" fill="#81f7b8" font-size="6" font-family="monospace">${plan.warning}</text>
  </g>`;
}

function getRadarTrainingOverlay(sc){
  const key=(sc&&sc.radarMode)||activeRadarMode;
  const mode=RADAR_TRAINING_MODES[key];
  if(!mode) return '';
  const targets=mode.targets.map(t=>`
    <circle cx="${t.x}" cy="${t.y}" r="${t.r}" fill="${t.color}" opacity=".95"/>
    <circle cx="${t.x}" cy="${t.y}" r="${t.r+3.8}" fill="none" stroke="${t.color}" opacity=".18"/>
    <rect x="${t.x+6}" y="${t.y-10}" width="${Math.max(28,(t.tag.length*4.4)+10)}" height="8" rx="2" fill="rgba(4,18,16,.88)" stroke="rgba(65,132,112,.55)" stroke-width=".5"/>
    <text x="${t.x+10}" y="${t.y-4}" fill="${t.color}" font-size="5.8" font-family="monospace">${t.tag}</text>
    <text x="${t.x+8}" y="${t.y+8}" fill="#9bc9d1" font-size="5.2" font-family="monospace">${t.meta}</text>`).join('');
  return `<g opacity=".98">
    ${mode.piLine?`<line x1="${mode.piLine.split(' ')[0].split(',')[0]}" y1="${mode.piLine.split(' ')[0].split(',')[1]}" x2="${mode.piLine.split(' ')[1].split(',')[0]}" y2="${mode.piLine.split(' ')[1].split(',')[1]}" stroke="#d4a017" stroke-width="1.1" stroke-dasharray="4,3" opacity=".9"/>`:''}
    ${mode.vector?`<line x1="${mode.vector.split(' ')[0].split(',')[0]}" y1="${mode.vector.split(' ')[0].split(',')[1]}" x2="${mode.vector.split(' ')[1].split(',')[0]}" y2="${mode.vector.split(' ')[1].split(',')[1]}" stroke="#6fa8dc" stroke-width="1.1" stroke-dasharray="3,2" opacity=".85"/>`:''}
    ${targets}
    <rect x="326" y="24" width="124" height="12" rx="3" fill="rgba(4,18,16,.88)" stroke="#1f6f5b" stroke-width=".7"/>
    <text x="334" y="32.5" fill="#81f7b8" font-size="5.8" font-family="monospace">${mode.label}</text>
    <rect x="326" y="118" width="124" height="10" rx="3" fill="rgba(4,18,16,.88)" stroke="#1f6f5b" stroke-width=".7"/>
    <text x="334" y="125.5" fill="#9bc9d1" font-size="5.6" font-family="monospace">${mode.footer}</text>
  </g>`;
}

function getShipVisualType(type){
  if(type==='bulk') return 'kuru';
  return type || 'kuru';
}

function getShipPalette(type){
  const shipType=getShipVisualType(type);
  const palettes={
    kuru:{hull:'#0a1727', hullEdge:'#183656', deck:'#d8dee6', glass:'#8fc6ef', accent:'#c9952a', shadow:'#07111d', funnel:'#d17a24', funnelBand:'#203754'},
    tanker:{hull:'#101a28', hullEdge:'#8b2e2e', deck:'#d8dee6', glass:'#9cc8ef', accent:'#d48e2a', shadow:'#08111b', funnel:'#a3362d', funnelBand:'#e5d7ba'},
    kont:{hull:'#0c1726', hullEdge:'#205890', deck:'#dae2ea', glass:'#97c8f0', accent:'#d4a017', shadow:'#08121e', funnel:'#1f5f94', funnelBand:'#f2cc4d'},
    roro:{hull:'#0f1b2a', hullEdge:'#2d6f8d', deck:'#e3e8ee', glass:'#9ac9ef', accent:'#d4a017', shadow:'#09121c', funnel:'#2e7f96', funnelBand:'#f1f4f7'},
    lng:{hull:'#0c1523', hullEdge:'#28728e', deck:'#e2e8ef', glass:'#9fd6ff', accent:'#9ed4f4', shadow:'#09111b', funnel:'#35a3b8', funnelBand:'#dff8ff'}
  };
  return palettes[shipType] || palettes.kuru;
}

function getShipDeckDetails(type){
  const shipType=getShipVisualType(type);
  if(shipType==='kont'){
    return `
      <rect x="22" y="-6" width="112" height="3" rx="1" fill="#5c6d82" opacity=".7"/>
      <rect x="18" y="-22" width="17" height="15" rx="1.4" fill="#8f3d34"/>
      <rect x="37" y="-22" width="17" height="15" rx="1.4" fill="#295f93"/>
      <rect x="56" y="-22" width="17" height="15" rx="1.4" fill="#3a6f47"/>
      <rect x="75" y="-22" width="17" height="15" rx="1.4" fill="#b16d2d"/>
      <rect x="94" y="-22" width="17" height="15" rx="1.4" fill="#7a485d"/>
      <rect x="113" y="-22" width="17" height="15" rx="1.4" fill="#3f667f"/>
      <rect x="18" y="-39" width="17" height="15" rx="1.4" fill="#6f2f28"/>
      <rect x="37" y="-39" width="17" height="15" rx="1.4" fill="#224b74"/>
      <rect x="56" y="-39" width="17" height="15" rx="1.4" fill="#315f3e"/>
      <rect x="75" y="-39" width="17" height="15" rx="1.4" fill="#935821"/>
      <rect x="94" y="-39" width="17" height="15" rx="1.4" fill="#663c4d"/>
      <rect x="113" y="-39" width="17" height="15" rx="1.4" fill="#33536a"/>
      <path d="M18 -24 h112" stroke="rgba(235,240,248,.18)" stroke-width=".8"/>
      <path d="M18 -7 h112" stroke="rgba(235,240,248,.18)" stroke-width=".8"/>
      <rect x="134" y="-28" width="28" height="28" rx="2.5" fill="#dce4eb"/>
      <rect x="146" y="-42" width="14" height="14" rx="2" fill="#dce4eb"/>
      <rect x="140" y="-18" width="7" height="6" rx="1" fill="#8fc6ef"/>
      <rect x="148" y="-18" width="7" height="6" rx="1" fill="#8fc6ef"/>
      <rect x="154" y="-34" width="10" height="18" rx="1.5" fill="#3a4758"/>
      <rect x="154" y="-29" width="10" height="3" fill="#f2cc4d"/>
      <line x1="153" y1="-54" x2="153" y2="-42" stroke="#7994ae" stroke-width="1.3"/>
      <line x1="153" y1="-50" x2="165" y2="-44" stroke="#7994ae" stroke-width="1"/>
    `;
  }
  if(shipType==='tanker'){
    return `
      <rect x="20" y="-8" width="92" height="3" rx="1.5" fill="#8190a1"/>
      <rect x="28" y="-13" width="76" height="2.2" rx="1" fill="#677789"/>
      <rect x="30" y="-4" width="80" height="1.6" rx=".8" fill="#92a2b0" opacity=".75"/>
      <line x1="54" y1="-13" x2="54" y2="-28" stroke="#6a7a8d" stroke-width="1.2"/>
      <line x1="78" y1="-13" x2="78" y2="-28" stroke="#6a7a8d" stroke-width="1.2"/>
      <line x1="54" y1="-28" x2="78" y2="-28" stroke="#6a7a8d" stroke-width="1.2"/>
      <line x1="66" y1="-13" x2="66" y2="-24" stroke="#6a7a8d" stroke-width="1"/>
      <path d="M38 -10 h54" stroke="#a1b0bf" stroke-width="1" opacity=".8"/>
      <circle cx="38" cy="-7" r="1.4" fill="#d48e2a"/>
      <circle cx="106" cy="-7" r="1.4" fill="#d48e2a"/>
      <rect x="132" y="-24" width="26" height="24" rx="2.5" fill="#dde5ec"/>
      <rect x="143" y="-38" width="13" height="14" rx="2" fill="#dde5ec"/>
      <rect x="138" y="-15" width="6" height="5" rx="1" fill="#9cc8ef"/>
      <rect x="145" y="-15" width="6" height="5" rx="1" fill="#9cc8ef"/>
      <rect x="145" y="-34" width="10" height="17" rx="1.5" fill="#a3362d"/>
      <rect x="145" y="-28" width="10" height="3" fill="#e5d7ba"/>
      <line x1="149" y1="-50" x2="149" y2="-38" stroke="#7a92a8" stroke-width="1.2"/>
    `;
  }
  if(shipType==='lng'){
    return `
      <ellipse cx="42" cy="-10" rx="12" ry="9" fill="#8fc6ef"/>
      <ellipse cx="66" cy="-10" rx="12" ry="9" fill="#a8dafd"/>
      <ellipse cx="90" cy="-10" rx="12" ry="9" fill="#8fc6ef"/>
      <path d="M30 -10 h72" stroke="rgba(223,248,255,.28)" stroke-width="1"/>
      <path d="M42 -19 v18 M66 -19 v18 M90 -19 v18" stroke="rgba(223,248,255,.15)" stroke-width=".8"/>
      <rect x="130" y="-24" width="26" height="24" rx="2.5" fill="#e3e9ef"/>
      <rect x="142" y="-38" width="13" height="14" rx="2" fill="#e3e9ef"/>
      <rect x="136" y="-15" width="6" height="5" rx="1" fill="#9fd6ff"/>
      <rect x="144" y="-15" width="6" height="5" rx="1" fill="#9fd6ff"/>
      <rect x="144" y="-34" width="10" height="17" rx="1.5" fill="#35a3b8"/>
      <rect x="144" y="-28" width="10" height="3" fill="#dff8ff"/>
      <line x1="149" y1="-50" x2="149" y2="-38" stroke="#7ea2bc" stroke-width="1.2"/>
    `;
  }
  if(shipType==='roro'){
    return `
      <path d="M18 -30 L112 -30 L128 -18 L142 -18 L142 0 L18 0 Z" fill="#dfe6ed"/>
      <rect x="28" y="-24" width="52" height="7" rx="1.5" fill="#95a7b8"/>
      <rect x="30" y="-14" width="88" height="5" rx="1.5" fill="#7f90a2"/>
      <path d="M24 -5 h102" stroke="rgba(120,138,154,.45)" stroke-width="1"/>
      <path d="M146 -6 L162 -6 L162 5 L148 5 Z" fill="#7e3b34"/>
      <path d="M148 5 L162 5 L158 10 L148 10 Z" fill="#5c2420"/>
      <rect x="142" y="-30" width="10" height="14" rx="1.5" fill="#2e7f96"/>
      <rect x="142" y="-25" width="10" height="3" fill="#f1f4f7"/>
      <line x1="146" y1="-34" x2="146" y2="-18" stroke="#7a92a8" stroke-width="1.1"/>
    `;
  }
  return `
    <rect x="18" y="-13" width="24" height="10" rx="1.5" fill="#52687c"/>
    <rect x="46" y="-13" width="24" height="10" rx="1.5" fill="#52687c"/>
    <rect x="74" y="-13" width="24" height="10" rx="1.5" fill="#52687c"/>
    <rect x="102" y="-13" width="24" height="10" rx="1.5" fill="#52687c"/>
    <rect x="22" y="-4" width="108" height="2" rx="1" fill="#728597" opacity=".7"/>
    <line x1="46" y1="-13" x2="46" y2="-30" stroke="#7a8ea2" stroke-width="1.2"/>
    <line x1="78" y1="-13" x2="78" y2="-30" stroke="#7a8ea2" stroke-width="1.2"/>
    <line x1="110" y1="-13" x2="110" y2="-30" stroke="#7a8ea2" stroke-width="1.2"/>
    <line x1="46" y1="-30" x2="54" y2="-18" stroke="#7a8ea2" stroke-width="1.2"/>
    <line x1="78" y1="-30" x2="86" y2="-18" stroke="#7a8ea2" stroke-width="1.2"/>
    <line x1="110" y1="-30" x2="118" y2="-18" stroke="#7a8ea2" stroke-width="1.2"/>
    <path d="M18 -1 h116" stroke="rgba(215,226,238,.12)" stroke-width="1"/>
    <rect x="138" y="-26" width="24" height="26" rx="2.5" fill="#dbe3ea"/>
    <rect x="148" y="-40" width="12" height="14" rx="2" fill="#dbe3ea"/>
    <rect x="144" y="-17" width="6" height="5" rx="1" fill="#8fc6ef"/>
    <rect x="151" y="-17" width="6" height="5" rx="1" fill="#8fc6ef"/>
    <rect x="150" y="-34" width="10" height="17" rx="1.5" fill="#d17a24"/>
    <rect x="150" y="-28" width="10" height="3" fill="#203754"/>
    <line x1="154" y1="-52" x2="154" y2="-40" stroke="#7994ae" stroke-width="1.2"/>
  `;
}

function getModernShipSvg(type, opts={}){
  const p=getShipPalette(type);
  const shipType=getShipVisualType(type);
  const x=opts.x ?? 280;
  const y=opts.y ?? 98;
  const scale=opts.scale ?? 1;
  const opacity=opts.opacity ?? 1;
  const light=opts.light || p.accent;
  const wakeOpacity=opts.wakeOpacity ?? 0.18;
  const portLight=opts.portLight ?? '#c93030';
  const starboardLight=opts.starboardLight ?? '#5dbf8a';
  const mastLight=opts.mastLight ?? '#f2d889';
  const vesselName=(opts.name || sn || 'M/V HORIZON').toUpperCase().slice(0,18);
  const imoText=opts.imo || (shipType==='kont' ? 'IMO 9482714' : shipType==='tanker' ? 'IMO 9374402' : shipType==='lng' ? 'IMO 9651180' : shipType==='roro' ? 'IMO 9226405' : 'IMO 9142058');
  const typeMark=shipType==='kont'
    ? `<text x="26" y="-44" fill="rgba(235,242,248,.62)" font-size="4.8" font-family="monospace">BAY 14 / STACK 82</text>`
    : shipType==='tanker'
      ? `<text x="34" y="-18" fill="rgba(235,242,248,.62)" font-size="4.6" font-family="monospace">MANIFOLD  MIDSHIP</text>`
      : shipType==='lng'
        ? `<text x="34" y="-24" fill="rgba(235,242,248,.62)" font-size="4.6" font-family="monospace">LNG CARGO TANKS</text>`
        : shipType==='roro'
          ? `<text x="34" y="-34" fill="rgba(235,242,248,.62)" font-size="4.6" font-family="monospace">RAMP DECK 05</text>`
          : `<text x="28" y="-34" fill="rgba(235,242,248,.62)" font-size="4.6" font-family="monospace">HATCH 1   HATCH 2   HATCH 3</text>`;
  const details=getShipDeckDetails(type);
  return `<g transform="translate(${x} ${y}) scale(${scale})" opacity="${opacity}">
    <path d="M-18 10 Q-10 2 8 0 L126 0 Q145 0 160 5 L176 6 L188 12 L180 15 L-14 15 Q-22 14 -24 11 Z" fill="${p.hull}"/>
    <path d="M6 11 L180 11 L184 14 L-6 14 Z" fill="${p.shadow}" opacity=".9"/>
    <path d="M10 1.5 L134 1.5" stroke="${p.hullEdge}" stroke-width="2.2" opacity=".95"/>
    <path d="M18 12 h158" stroke="rgba(70,110,140,.35)" stroke-width="1.1"/>
    <path d="M26 -1 L120 -1" stroke="rgba(200,220,235,.12)" stroke-width="1.1"/>
    ${details}
    <path d="M136 0 v16" stroke="rgba(120,68,40,.28)" stroke-width="1.3"/>
    <path d="M148 2 v16" stroke="rgba(120,68,40,.22)" stroke-width="1.1"/>
    <path d="M160 4 v14" stroke="rgba(120,68,40,.2)" stroke-width="1"/>
    <g opacity=".78">
      <text x="0" y="8" fill="#dfe6ee" font-size="4.8" font-family="monospace">8</text>
      <text x="0" y="13" fill="#dfe6ee" font-size="4.8" font-family="monospace">6</text>
      <text x="164" y="10" fill="#dfe6ee" font-size="4.8" font-family="monospace">8</text>
      <text x="164" y="15" fill="#dfe6ee" font-size="4.8" font-family="monospace">6</text>
    </g>
    <circle cx="84" cy="7.5" r="5.5" fill="none" stroke="#dfe6ee" stroke-width=".8" opacity=".75"/>
    <line x1="90" y1="7.5" x2="98" y2="7.5" stroke="#dfe6ee" stroke-width=".8" opacity=".75"/>
    <line x1="84" y1="2" x2="84" y2="13" stroke="#dfe6ee" stroke-width=".6" opacity=".55"/>
    <text x="18" y="9.3" fill="rgba(228,236,244,.82)" font-size="5.1" font-family="monospace">${vesselName}</text>
    <text x="110" y="9.3" fill="rgba(228,236,244,.58)" font-size="4.3" font-family="monospace">${imoText}</text>
    ${typeMark}
    <circle cx="14" cy="3.4" r="1.6" fill="${portLight}" opacity=".92"/>
    <circle cx="170" cy="5" r="1.6" fill="${starboardLight}" opacity=".92"/>
    <circle cx="152" cy="-18" r="1.9" fill="${mastLight}" opacity=".96"/>
    <circle cx="156" cy="-54" r="1.5" fill="${light}" opacity=".96"/>
    <path d="M152 -18 l11 -4" stroke="rgba(242,216,137,.35)" stroke-width="1"/>
    <path d="M156 -54 L156 -40" stroke="rgba(122,146,170,.55)" stroke-width="1.1"/>
    <path d="M156 -48 L168 -42" stroke="rgba(122,146,170,.45)" stroke-width="1"/>
    <path d="M-22 13 q-14 -5 -27 1" fill="none" stroke="rgba(180,220,245,${wakeOpacity})" stroke-width="2"/>
    <path d="M-14 16 q-18 -3 -31 3" fill="none" stroke="rgba(180,220,245,${wakeOpacity*0.8})" stroke-width="1.6"/>
  </g>`;
}

function getSceneFleetOverlay(gfx){
  const lightColor = gfx==='night' ? '#e7b75e' : (gfx==='storm' ? '#8fb7d8' : '#d4a017');
  const support = {
    harbor: getModernShipSvg('tanker',{x:338,y:108,scale:.34,opacity:.58,light:'#9cc8ef',wakeOpacity:.08}),
    sea: getModernShipSvg('tanker',{x:88,y:116,scale:.26,opacity:.46,light:'#7fb3d8',wakeOpacity:.08}),
    night: getModernShipSvg('lng',{x:92,y:118,scale:.22,opacity:.35,light:'#9fc8f0',wakeOpacity:.06}),
    sunrise: getModernShipSvg('kont',{x:92,y:96,scale:.3,opacity:.42,light:'#d4a017',wakeOpacity:.08}),
    port_arrival: getModernShipSvg('roro',{x:334,y:104,scale:.36,opacity:.56,light:'#d4a017',wakeOpacity:.08}),
    bogaz: getModernShipSvg('tanker',{x:354,y:110,scale:.3,opacity:.48,light:'#d4a017',wakeOpacity:.08}),
    storm: ''
  };
  const mainMap = {
    harbor:{x:246,y:102,scale:.52,opacity:.96},
    sea:{x:292,y:102,scale:.48,opacity:.94},
    night:{x:284,y:108,scale:.48,opacity:.84},
    storm:{x:304,y:114,scale:.42,opacity:.74},
    sunrise:{x:22,y:80,scale:.56,opacity:.95},
    port_arrival:{x:180,y:88,scale:.56,opacity:.96},
    bogaz:{x:270,y:102,scale:.46,opacity:.92}
  };
  if(!mainMap[gfx]) return '';
  const main = getModernShipSvg(selType,{...mainMap[gfx], light:lightColor});
  return `<g>${main}${support[gfx] || ''}</g>`;
}

function getChartWorkOverlay(sc){
  if(!sc) return '';
  if(sc.id==='s112' || sc.id==='s112b'){
    return `<g opacity=".98">
      <rect x="234" y="18" width="214" height="108" rx="6" fill="#08131e" stroke="#113457" stroke-width="1.2"/>
      <rect x="246" y="28" width="190" height="86" rx="4" fill="#e6d8ab" stroke="#a89256" stroke-width="1.2"/>
      <path d="M256 44 L424 44 M256 60 L424 60 M256 76 L424 76 M256 92 L424 92" stroke="#b39a5c" stroke-width=".8" opacity=".45"/>
      <path d="M262 96 Q294 80 322 82 Q350 84 380 68 Q398 60 420 58" fill="none" stroke="#c93030" stroke-width="2.2"/>
      <circle cx="322" cy="82" r="3.2" fill="#c93030"/>
      <circle cx="380" cy="68" r="3.2" fill="#c93030"/>
      <rect x="356" y="94" width="58" height="10" rx="2" fill="#f1e6bf" stroke="#a89256" stroke-width=".8"/>
      <text x="360" y="101" fill="#7d6122" font-size="6" font-family="monospace">NTM 2421/26</text>
      <polygon points="428,102 442,114 437,118 423,107" fill="#c93030"/>
      <rect x="434" y="112" width="10" height="4" rx="1" fill="#f0d3b2"/>
      <rect x="252" y="24" width="66" height="10" rx="2" fill="#0f2842"/>
      <text x="258" y="31" fill="#d9e3ea" font-size="6" font-family="monospace">PAPER CHART CORR</text>
    </g>`;
  }
  if(sc.id==='s112c'){
    return `<g opacity=".98">
      <rect x="266" y="18" width="176" height="104" rx="6" fill="#071828" stroke="#12395b" stroke-width="1.3"/>
      <rect x="278" y="30" width="152" height="16" rx="3" fill="#0d2840"/>
      <text x="288" y="41" fill="#d9e3ea" font-size="7" font-family="monospace">ENC UPDATE MANAGER</text>
      <rect x="278" y="52" width="152" height="58" rx="4" fill="#04111b" stroke="#0d2a48" stroke-width="1"/>
      <text x="286" y="66" fill="#81f7b8" font-size="7" font-family="monospace">TR 540122   UPDATED</text>
      <text x="286" y="79" fill="#81f7b8" font-size="7" font-family="monospace">GR 340088   UPDATED</text>
      <text x="286" y="92" fill="#d4a017" font-size="7" font-family="monospace">EG 420551   OVERDUE</text>
      <text x="286" y="105" fill="#c97070" font-size="7" font-family="monospace">PERMIT CHECK REQUIRED</text>
      <rect x="278" y="114" width="68" height="8" rx="2" fill="#113050"/>
      <rect x="278" y="114" width="49" height="8" rx="2" fill="#5dbf8a"/>
      <text x="352" y="121" fill="#6fa8dc" font-size="6" font-family="monospace">PKG 26.5 / CELL STATUS</text>
    </g>`;
  }
  if(sc.id==='s112d'){
    return `<g opacity=".98">
      <rect x="234" y="18" width="102" height="104" rx="6" fill="#08131e" stroke="#113457" stroke-width="1.2"/>
      <rect x="244" y="28" width="82" height="74" rx="4" fill="#e6d8ab" stroke="#a89256" stroke-width="1"/>
      <path d="M250 88 Q268 80 282 82 Q294 84 314 70" fill="none" stroke="#c93030" stroke-width="1.8"/>
      <text x="248" y="110" fill="#d9e3ea" font-size="6" font-family="monospace">PAPER CHART</text>
      <rect x="344" y="18" width="104" height="104" rx="6" fill="#071828" stroke="#12395b" stroke-width="1.2"/>
      <rect x="354" y="28" width="84" height="74" rx="4" fill="#03111c" stroke="#0d2a48" stroke-width="1"/>
      <polyline points="360,88 380,82 398,78 420,62" fill="none" stroke="#d4a017" stroke-width="2" stroke-dasharray="5,3"/>
      <circle cx="398" cy="78" r="2.8" fill="#1aff50"/>
      <text x="360" y="110" fill="#81f7b8" font-size="6" font-family="monospace">ECDIS ROUTE</text>
      <path d="M330 70 L350 70" stroke="#6fa8dc" stroke-width="2" stroke-dasharray="3,2"/>
      <polygon points="350,70 344,66 344,74" fill="#6fa8dc"/>
    </g>`;
  }
  return '';
}

function getMeteorologyOverlay(sc){
  if(!sc || sc.gfx!=='meteo_panel') return '';
  const focusMap = {
    s255:{cx:88,cy:46,rx:40,ry:20,label:'CUMULUS - dikey gelisim basliyor'},
    s256:{cx:214,cy:36,rx:52,ry:18,label:'CIRRUS - ust seviye ince buz bulutu'},
    s257:{cx:332,cy:58,rx:64,ry:24,label:'NIMBOSTRATUS - yaygin yagis bulutu'},
    s258:{cx:434,cy:58,rx:46,ry:34,label:'CUMULONIMBUS - firtina bulutu'},
    s263:{cx:60,cy:24,rx:34,ry:12,label:'BAROMETER TREND - basinc duserken dikkat'},
    s264:{cx:240,cy:64,rx:150,ry:26,label:'FOG / VISIBILITY - gorusu yonet'},
    s265:{cx:240,cy:34,rx:160,ry:26,label:'SYNOPTIC CHART - isobar / front okuma'},
    s266:{cx:126,cy:116,rx:58,ry:18,label:'DEW POINT - cargo sweat riski'}
  };
  const f = focusMap[sc.id];
  if(!f) return '';
  let detail = '';
  if(sc.id==='s263'){
    detail = `
    <rect x="24" y="20" width="92" height="54" rx="4" fill="rgba(3,17,28,.72)" stroke="#7fc3ff" stroke-width=".9"/>
    <text x="34" y="33" fill="#cfeaff" font-size="7" font-family="monospace">BARO 1004 hPa</text>
    <text x="34" y="45" fill="#ffd45a" font-size="7" font-family="monospace">3h trend: -4.0</text>
    <text x="34" y="57" fill="#ffb0b0" font-size="6.5" font-family="monospace">LOW APPROACH?</text>
    <polyline points="32,64 48,58 64,52 80,46 98,38" fill="none" stroke="#ffb0b0" stroke-width="2"/>
    `;
  }else if(sc.id==='s264'){
    detail = `
    <rect x="88" y="80" width="304" height="22" rx="5" fill="rgba(220,235,245,.16)" stroke="rgba(255,255,255,.24)" stroke-width=".8"/>
    <text x="102" y="95" fill="#eef8ff" font-size="7" font-family="monospace">VISIBILITY REDUCED - SAFE SPEED / FOG SIGNAL / RADAR</text>
    <path d="M40 94 q20 -6 42 0 q22 6 44 0 q22 -6 44 0" fill="none" stroke="rgba(230,242,248,.7)" stroke-width="2"/>
    <path d="M250 90 q20 -6 42 0 q22 6 44 0 q22 -6 44 0" fill="none" stroke="rgba(230,242,248,.65)" stroke-width="2"/>
    `;
  }else if(sc.id==='s265'){
    detail = `
    <path d="M42 34 q40 -20 88 -8 q54 14 96 2 q40 -12 86 6 q34 14 70 4" fill="none" stroke="#9fd6ff" stroke-width="1.4"/>
    <path d="M42 46 q40 -20 88 -8 q54 14 96 2 q40 -12 86 6 q34 14 70 4" fill="none" stroke="#9fd6ff" stroke-width="1.4"/>
    <path d="M42 58 q40 -20 88 -8 q54 14 96 2 q40 -12 86 6 q34 14 70 4" fill="none" stroke="#9fd6ff" stroke-width="1.4"/>
    <path d="M118 18 l16 0 l8 8 l16 0 l8 8 l16 0" fill="none" stroke="#d95b5b" stroke-width="2"/>
    <path d="M250 20 l18 10 l18 -10 l18 10 l18 -10" fill="none" stroke="#6fa8dc" stroke-width="2"/>
    <text x="54" y="78" fill="#fff1b0" font-size="6.5" font-family="monospace">ISOBARLAR SIKLASIYOR = RUZGAR ARTABILIR</text>
    `;
  }else if(sc.id==='s266'){
    detail = `
    <rect x="26" y="96" width="196" height="30" rx="4" fill="rgba(3,17,28,.78)" stroke="#7fc3ff" stroke-width=".8"/>
    <text x="36" y="109" fill="#cfeaff" font-size="6.5" font-family="monospace">OUTSIDE AIR DP : 18C</text>
    <text x="36" y="119" fill="#fff0b0" font-size="6.5" font-family="monospace">HOLD TEMP     : 14C</text>
    <text x="36" y="129" fill="#ffb0b0" font-size="6.5" font-family="monospace">VENT? THINK BEFORE OPEN</text>
    `;
  }
  return `
  <ellipse cx="${f.cx}" cy="${f.cy}" rx="${f.rx}" ry="${f.ry}" fill="none" stroke="#ffd45a" stroke-width="2.4" opacity=".95"/>
  <ellipse cx="${f.cx}" cy="${f.cy}" rx="${f.rx+7}" ry="${f.ry+6}" fill="none" stroke="#fff2b0" stroke-width="1" opacity=".45" class="blink"/>
  <rect x="20" y="118" width="248" height="16" rx="4" fill="rgba(3,17,28,.72)" stroke="#ffd45a" stroke-width=".8"/>
  <text x="28" y="129" fill="#fff4bf" font-size="8" font-family="monospace">${f.label}</text>
  ${detail}`;
}

function getPanelChromeOverlay(gfx, sc){
  if(!gfx) return '';
  const panelGfx = new Set(['radar','ecdis_panel','ais_panel','gyro_panel','magnetic_panel','echo_panel','speedlog_panel','autopilot_panel','bnwas_panel','gmdss_panel','engine','engine_fault']);
  const panelScenes = /stability booklet|loadicator|fire plan|enc update|route check|ecdis|radar/i.test(`${sc?.loc||''} ${sc?.sub||''}`);
  if(!panelGfx.has(gfx) && !panelScenes) return '';
  const label = (sc?.sub || sc?.loc || gfx).replace(/`/g,'').slice(0,34).toUpperCase();
  const status = sc?.alert ? 'ALERT' : (gfx==='radar' ? 'TRACK' : gfx==='ecdis_panel' ? 'ROUTE' : gfx==='gmdss_panel' ? 'COMMS' : 'READY');
  return `<g opacity=".98">
    <rect x="10" y="10" width="460" height="125" rx="10" fill="rgba(3,10,18,.12)" stroke="rgba(120,170,210,.28)" stroke-width="1.2"/>
    <rect x="18" y="16" width="170" height="14" rx="3" fill="rgba(3,17,28,.78)" stroke="rgba(111,168,220,.24)" stroke-width=".8"/>
    <circle cx="28" cy="23" r="2.1" fill="${sc?.alert ? '#c97070' : '#5dbf8a'}"/>
    <text x="36" y="26" fill="#d9e3ea" font-size="6" font-family="monospace">${label}</text>
    <rect x="390" y="16" width="62" height="14" rx="3" fill="rgba(3,17,28,.78)" stroke="rgba(111,168,220,.24)" stroke-width=".8"/>
    <text x="404" y="26" fill="${sc?.alert ? '#ffb0b0' : '#81f7b8'}" font-size="6" font-family="monospace">${status}</text>
    <rect x="18" y="116" width="212" height="10" rx="3" fill="rgba(3,17,28,.72)" stroke="rgba(111,168,220,.16)" stroke-width=".6"/>
    <text x="26" y="123" fill="#8ab0c8" font-size="5.5" font-family="monospace">${(sc?.loc||gfx).slice(0,38).toUpperCase()}</text>
  </g>`;
}

function getCargoIncidentOverlay(sc){
  if(!sc || sc.id!=='s124b') return '';
  return `<g opacity=".98">
    <rect x="18" y="18" width="320" height="92" rx="6" fill="rgba(2,8,14,.18)" stroke="rgba(201,112,112,.22)" stroke-width="1"/>
    <line x1="210" y1="14" x2="182" y2="44" stroke="#c97070" stroke-width="2.4" stroke-dasharray="5,3"/>
    <line x1="210" y1="14" x2="240" y2="39" stroke="#566a82" stroke-width="2"/>
    <line x1="240" y1="39" x2="268" y2="62" stroke="#8aa6c2" stroke-width="1.6" opacity=".55"/>
    <rect x="248" y="58" width="28" height="18" rx="2" fill="#a55d2a" stroke="#e7b180" stroke-width=".8" transform="rotate(18 262 67)"/>
    <path d="M267 78 q17 5 28 -6" fill="none" stroke="rgba(191,225,245,.5)" stroke-width="1.6"/>
    <path d="M274 84 q20 6 34 -7" fill="none" stroke="rgba(191,225,245,.34)" stroke-width="1.2"/>
    <rect x="38" y="90" width="132" height="12" rx="3" fill="rgba(201,48,48,.18)" stroke="#c93030" stroke-width="1.1"/>
    <text x="48" y="99" fill="#ffd1d1" font-size="7" font-family="monospace">STOP - LOAD SWING / BROKEN SLING</text>
    <path d="M204 48 l8 -14 l8 14 z" fill="#ffd45a" stroke="#5a4710" stroke-width=".8"/>
    <rect x="198" y="48" width="12" height="18" rx="2" fill="#ffd45a" stroke="#5a4710" stroke-width=".8"/>
    <text x="200" y="61" fill="#402f05" font-size="7" font-family="monospace" font-weight="bold">!</text>
    <path d="M140 88 L320 88" stroke="#c97070" stroke-width="2" stroke-dasharray="7,5" opacity=".85"/>
    <text x="146" y="84" fill="#ffb0b0" font-size="6" font-family="monospace">DANGER ZONE - CLEAR PERSONNEL</text>
  </g>`;
}

function getCommsDeviceOverlay(sc){
  if(!sc) return '';
  const map = {
    s271:`<g opacity=".98">
      <rect x="48" y="50" width="100" height="58" rx="6" fill="none" stroke="#ffd45a" stroke-width="2.4"/>
      <rect x="56" y="108" width="124" height="12" rx="3" fill="rgba(3,17,28,.75)" stroke="#ffd45a" stroke-width=".7"/>
      <text x="62" y="116" fill="#fff4bf" font-size="6.5" font-family="monospace">VHF DSC / CH16 WATCH</text>
    </g>`,
    s272:`<g opacity=".98">
      <rect x="156" y="50" width="100" height="58" rx="6" fill="none" stroke="#ffd45a" stroke-width="2.4"/>
      <rect x="164" y="108" width="126" height="12" rx="3" fill="rgba(3,17,28,.75)" stroke="#ffd45a" stroke-width=".7"/>
      <text x="170" y="116" fill="#fff4bf" font-size="6.5" font-family="monospace">MF/HF / DSC BAND</text>
    </g>`,
    s273:`<g opacity=".98">
      <rect x="48" y="30" width="92" height="18" rx="4" fill="rgba(3,17,28,.82)" stroke="#7fc3ff" stroke-width=".8"/>
      <text x="58" y="41" fill="#cfeaff" font-size="6.5" font-family="monospace">NAVTEX MSG SELECT</text>
      <rect x="286" y="58" width="118" height="24" rx="4" fill="rgba(3,17,28,.68)" stroke="#7fc3ff" stroke-width=".8"/>
      <text x="294" y="73" fill="#cfeaff" font-size="6.5" font-family="monospace">WX / NAV WARNING</text>
    </g>`,
    s274:`<g opacity=".98">
      <rect x="282" y="30" width="132" height="32" rx="4" fill="rgba(3,17,28,.75)" stroke="#5dbf8a" stroke-width="1"/>
      <text x="292" y="43" fill="#81f7b8" font-size="7" font-family="monospace">INMARSAT-C / EGC</text>
      <text x="292" y="54" fill="#d9e3ea" font-size="6" font-family="monospace">SAFETYNET / MSI FEED</text>
    </g>`,
    s275:`<g opacity=".98">
      <rect x="350" y="50" width="80" height="58" rx="6" fill="none" stroke="#ffd45a" stroke-width="2.4"/>
      <rect x="314" y="108" width="118" height="12" rx="3" fill="rgba(3,17,28,.75)" stroke="#ffd45a" stroke-width=".7"/>
      <text x="322" y="116" fill="#fff4bf" font-size="6.5" font-family="monospace">SART / RADAR RESPONDER</text>
    </g>`,
    s276:`<g opacity=".98">
      <rect x="264" y="50" width="80" height="58" rx="6" fill="none" stroke="#ffb0b0" stroke-width="2.4"/>
      <rect x="248" y="24" width="148" height="16" rx="4" fill="rgba(58,11,11,.72)" stroke="#c97070" stroke-width=".8"/>
      <text x="258" y="35" fill="#ffd1d1" font-size="6.5" font-family="monospace">EPIRB -> COSPAS-SARSAT</text>
    </g>`,
    s277:`<g opacity=".98">
      <rect x="280" y="76" width="144" height="30" rx="4" fill="rgba(3,17,28,.72)" stroke="#6fa8dc" stroke-width=".9"/>
      <text x="292" y="89" fill="#cfeaff" font-size="6.5" font-family="monospace">REPORT / MSG / DISTRESS MENU</text>
      <text x="292" y="100" fill="#81f7b8" font-size="6.5" font-family="monospace">INMARSAT-C TERMINAL</text>
    </g>`,
    s278:`<g opacity=".98">
      <rect x="36" y="24" width="166" height="18" rx="4" fill="rgba(3,17,28,.78)" stroke="#ffd45a" stroke-width=".8"/>
      <text x="46" y="36" fill="#fff4bf" font-size="6.5" font-family="monospace">STATIC / VOYAGE / DYNAMIC DATA</text>
      <rect x="252" y="28" width="168" height="18" rx="4" fill="rgba(3,17,28,.72)" stroke="#7fc3ff" stroke-width=".8"/>
      <text x="262" y="40" fill="#cfeaff" font-size="6.5" font-family="monospace">MMSI / COG / SOG / ROT / DEST</text>
    </g>`
  };
  return map[sc.id] || '';
}

function getFireTrainingOverlay(sc){
  if(!sc) return '';
  const map = {
    s283:`<g opacity=".98">
      <rect x="54" y="24" width="146" height="18" rx="4" fill="rgba(58,11,11,.72)" stroke="#c97070" stroke-width=".8"/>
      <text x="64" y="36" fill="#ffd1d1" font-size="6.5" font-family="monospace">DISTRESS -> POSITION -> NATURE</text>
      <path d="M210 64 L286 64" stroke="#ffd45a" stroke-width="2" stroke-dasharray="5,3"/>
      <polygon points="286,64 278,60 278,68" fill="#ffd45a"/>
    </g>`,
    s284:`<g opacity=".98">
      <rect x="58" y="92" width="126" height="16" rx="4" fill="rgba(3,17,28,.75)" stroke="#7fc3ff" stroke-width=".8"/>
      <text x="68" y="103" fill="#cfeaff" font-size="6.5" font-family="monospace">TEST MODE / NO LIVE ALERT</text>
    </g>`,
    s285:`<g opacity=".98">
      <rect x="240" y="24" width="140" height="18" rx="4" fill="rgba(58,11,11,.72)" stroke="#c97070" stroke-width=".8"/>
      <text x="250" y="36" fill="#ffd1d1" font-size="6.5" font-family="monospace">FALSE ALERT CANCEL</text>
      <rect x="256" y="88" width="118" height="16" rx="4" fill="rgba(3,17,28,.75)" stroke="#ffd45a" stroke-width=".8"/>
      <text x="264" y="99" fill="#fff4bf" font-size="6.5" font-family="monospace">REPORT / LOG / CONFIRM</text>
    </g>`,
    s286:`<g opacity=".98">
      <rect x="250" y="88" width="170" height="22" rx="4" fill="rgba(3,17,28,.75)" stroke="#7fc3ff" stroke-width=".8"/>
      <text x="260" y="101" fill="#cfeaff" font-size="6.5" font-family="monospace">UTC / STATION / FREQ / MSG TYPE</text>
    </g>`,
    s287:`<g opacity=".98">
      <rect x="64" y="58" width="42" height="54" rx="4" fill="none" stroke="#ffd45a" stroke-width="2"/>
      <rect x="114" y="52" width="86" height="26" rx="4" fill="none" stroke="#7fc3ff" stroke-width="2"/>
      <rect x="304" y="42" width="120" height="34" rx="4" fill="none" stroke="#5dbf8a" stroke-width="2"/>
      <text x="310" y="90" fill="#fff4bf" font-size="6.5" font-family="monospace">EXT / HOSE / BA SET</text>
    </g>`,
    s288:`<g opacity=".98">
      <rect x="286" y="26" width="144" height="18" rx="4" fill="rgba(58,11,11,.72)" stroke="#c97070" stroke-width=".8"/>
      <text x="294" y="38" fill="#ffd1d1" font-size="6.5" font-family="monospace">FIXED CO2 / ISOLATE / COUNT</text>
      <rect x="50" y="102" width="126" height="14" rx="4" fill="rgba(3,17,28,.75)" stroke="#7fc3ff" stroke-width=".8"/>
      <text x="60" y="112" fill="#cfeaff" font-size="6.5" font-family="monospace">SPRINKLER / DAMPER / QCV</text>
    </g>`,
    s289:`<g opacity=".98">
      <rect x="54" y="46" width="84" height="20" rx="4" fill="rgba(3,17,28,.75)" stroke="#7fc3ff" stroke-width=".8"/>
      <text x="66" y="59" fill="#cfeaff" font-size="6.5" font-family="monospace">WATER / FOAM</text>
      <rect x="54" y="74" width="84" height="20" rx="4" fill="rgba(3,17,28,.75)" stroke="#ffd45a" stroke-width=".8"/>
      <text x="72" y="87" fill="#fff4bf" font-size="6.5" font-family="monospace">CO2 / DCP</text>
      <rect x="54" y="102" width="112" height="20" rx="4" fill="rgba(58,11,11,.72)" stroke="#c97070" stroke-width=".8"/>
      <text x="64" y="115" fill="#ffd1d1" font-size="6.5" font-family="monospace">WET CHEMICAL / GALLEY</text>
    </g>`
  };
  return map[sc.id] || '';
}

function getDrillTrainingOverlay(sc){
  if(!sc) return '';
  const map = {
    s246g:`<g opacity=".98">
      <rect x="42" y="26" width="120" height="18" rx="4" fill="rgba(3,17,28,.78)" stroke="#7fc3ff" stroke-width=".8"/>
      <text x="52" y="38" fill="#cfeaff" font-size="6.5" font-family="monospace">RESCUE BOAT / READY</text>
      <rect x="54" y="78" width="116" height="24" rx="5" fill="rgba(3,17,28,.72)" stroke="#ffd45a" stroke-width=".9"/>
      <text x="64" y="92" fill="#fff4bf" font-size="6.3" font-family="monospace">HOOK / PAINTER / PPE</text>
      <path d="M204 96 L260 96" stroke="#6fa8dc" stroke-width="2" stroke-dasharray="5,3"/>
      <polygon points="260,96 252,92 252,100" fill="#6fa8dc"/>
      <rect x="268" y="82" width="134" height="24" rx="5" fill="rgba(3,17,28,.72)" stroke="#5dbf8a" stroke-width=".9"/>
      <text x="280" y="96" fill="#81f7b8" font-size="6.3" font-family="monospace">ENGINE / COMMS / RECOVERY</text>
    </g>`,
    s246h:`<g opacity=".98">
      <rect x="44" y="28" width="126" height="18" rx="4" fill="rgba(58,11,11,.72)" stroke="#c97070" stroke-width=".8"/>
      <text x="54" y="40" fill="#ffd1d1" font-size="6.5" font-family="monospace">SOPEP / SPILL RESPONSE</text>
      <rect x="56" y="88" width="88" height="20" rx="4" fill="rgba(3,17,28,.75)" stroke="#ffd45a" stroke-width=".8"/>
      <text x="66" y="101" fill="#fff4bf" font-size="6.3" font-family="monospace">SCUPPER COVER</text>
      <rect x="162" y="84" width="90" height="24" rx="4" fill="rgba(3,17,28,.75)" stroke="#7fc3ff" stroke-width=".8"/>
      <text x="172" y="98" fill="#cfeaff" font-size="6.3" font-family="monospace">ABSORBENT / KIT</text>
      <path d="M274 90 q18 -10 38 -2 q16 6 28 0" fill="none" stroke="#c97070" stroke-width="3"/>
      <text x="322" y="98" fill="#ffb0b0" font-size="6.3" font-family="monospace">SOURCE ISOLATE</text>
    </g>`,
    s246i:`<g opacity=".98">
      <rect x="42" y="24" width="148" height="18" rx="4" fill="rgba(3,17,28,.78)" stroke="#7fc3ff" stroke-width=".8"/>
      <text x="52" y="36" fill="#cfeaff" font-size="6.5" font-family="monospace">EMERGENCY STEERING DRILL</text>
      <rect x="56" y="82" width="132" height="22" rx="5" fill="rgba(3,17,28,.72)" stroke="#ffd45a" stroke-width=".9"/>
      <text x="66" y="96" fill="#fff4bf" font-size="6.3" font-family="monospace">LOCAL CONTROL / REPEAT</text>
      <path d="M212 94 L258 94" stroke="#6fa8dc" stroke-width="2" stroke-dasharray="5,3"/>
      <polygon points="258,94 250,90 250,98" fill="#6fa8dc"/>
      <rect x="270" y="82" width="136" height="24" rx="5" fill="rgba(3,17,28,.72)" stroke="#5dbf8a" stroke-width=".9"/>
      <text x="280" y="96" fill="#81f7b8" font-size="6.3" font-family="monospace">RUDDER ANGLE CONFIRM</text>
    </g>`,
    s246j:`<g opacity=".98">
      <rect x="38" y="24" width="166" height="18" rx="4" fill="rgba(58,11,11,.72)" stroke="#c97070" stroke-width=".8"/>
      <text x="48" y="36" fill="#ffd1d1" font-size="6.5" font-family="monospace">ENCLOSED SPACE RESCUE DRILL</text>
      <rect x="52" y="84" width="96" height="22" rx="4" fill="rgba(3,17,28,.75)" stroke="#7fc3ff" stroke-width=".8"/>
      <text x="64" y="98" fill="#cfeaff" font-size="6.3" font-family="monospace">GAS TEST / PERMIT</text>
      <rect x="164" y="84" width="104" height="22" rx="4" fill="rgba(3,17,28,.75)" stroke="#ffd45a" stroke-width=".8"/>
      <text x="174" y="98" fill="#fff4bf" font-size="6.3" font-family="monospace">ATTENDANT / COMMS</text>
      <rect x="286" y="80" width="116" height="26" rx="4" fill="rgba(3,17,28,.75)" stroke="#5dbf8a" stroke-width=".8"/>
      <text x="296" y="95" fill="#81f7b8" font-size="6.3" font-family="monospace">RESCUE SET / STANDBY</text>
    </g>`
  };
  return map[sc.id] || '';
}

function getSceneOverlay(gfx,sc){
  let extra = getSceneFleetOverlay(gfx);
  extra += getPanelChromeOverlay(gfx, sc);
  extra += getChartWorkOverlay(sc);
  extra += getMeteorologyOverlay(sc);
  extra += getCargoIncidentOverlay(sc);
  extra += getCommsDeviceOverlay(sc);
  extra += getFireTrainingOverlay(sc);
  extra += getDrillTrainingOverlay(sc);
  if((gfx==='compass'||gfx==='bridge') && sc && (sc.ecdisPlanKey || sc.sub?.toLowerCase().includes('ecdis') || sc.sub?.toLowerCase().includes('seyir plani') || sc.loc?.toLowerCase().includes('ecdis'))){
    extra += getEcdisRouteOverlay(sc);
  }
  if(gfx==='radar' && sc){
    extra += getRadarTrainingOverlay(sc);
  }
  return extra;
}
function getSafeSceneMarkup(sc){
  const key = sc?.gfx || 'sea';
  const safeKey = GFX[key] ? key : 'sea';
  const base = GFX[safeKey] || GFX.sea;
  try{
    return base + getSceneOverlay(safeKey, sc);
  }catch(err){
    console.warn('Scene render fallback:', safeKey, err);
    return base;
  }
}
const tagL={cesur:"Cesur",akilli:"Akıllı",itaatkar:"İtaatkar",korkak:"Korkak",sosyal:"Sosyal",kritik:"KRİTİK"};
let mood=58;
let delayedConsequences=[];
let playerFlags={securityBreach:0,nearMiss:0,sextantGood:0,lowMoodSpiral:0};

function clampMood(v){return Math.max(0,Math.min(100,Math.round(v)));}
function adjustMood(delta,reason=''){
  const old=mood;
  mood=clampMood(mood+delta);
  if(reason&&old!==mood){
    setTimeout(()=>showNotif(delta>=0?':)':'...','Ruh Hali',reason+' ('+mood+')'),250);
    addJournalEntry(`[RUH HALI] ${reason} (${mood})`);
  }
  if(mood<=25&&old>25){
    stats.dinclik=clamp(stats.dinclik-4);
    stats.sayginlik=clamp(stats.sayginlik-2);
    setTimeout(()=>showNotif('!','Icine Kapaniyorsun','Dusuk moral vardiyada dikkatini ve enerjini zorluyor.'),400);
    updateStats({});
    playerFlags.lowMoodSpiral++;
    queueDelayedConsequence({dinclik:-4,bilgi:-2},'Uykusuz Gece','Dusuk moral gece uykunu bozdu; sabah daha dagin uyandin.',2,-4);
  }
}
function queueDelayedConsequence(effect,title,body,delayScenes=2,moodDelta=0){
  delayedConsequences.push({effect,title,body,delayScenes,moodDelta});
}
function resolveDelayedConsequences(sc){
  if(!delayedConsequences.length) return null;
  const keep=[];
  let crisisKey=null;
  delayedConsequences.forEach(item=>{
    item.delayScenes--;
    if(item.delayScenes<=0){
      const crisis=applyEffect(item.effect||{},{skipContractTick:true});
      if(item.moodDelta) adjustMood(item.moodDelta,item.title);
      showNotif('! ',item.title,item.body);
      addJournalEntry(`[GECIKMELI] ${item.body}`, sc.day, sc.time);
      if(crisis&&!crisisKey) crisisKey=crisis;
    }else keep.push(item);
  });
  delayedConsequences=keep;
  return crisisKey;
}
function scheduleAdvancedConsequences(sc,c2){
  const id=sc.id||'';
  const tag=c2.tag||'akilli';
  if(id==='s115'){
    if(tag==='korkak') adjustMood(-12,'Aile ozlemi icine coktu');
    else if(tag==='sosyal') adjustMood(6,'Birine yazmak iyi geldi');
    else adjustMood(4,'Kendini toparlamaya calistin');
  }
  if(id==='s116'){
    if(tag==='korkak'){
      adjustMood(-14,'Yalnizlik agirlasti');
      queueDelayedConsequence({dinclik:-5,sayginlik:-3},'Yorgun Sabah','Geceki dusuk moral ertesi gun vardiyasina da sindi.',2,-2);
    }else if(tag==='kritik') adjustMood(8,'Kendine karsi daha durust oldun');
    else adjustMood(5,'Icindekini kagida dokmek iyi geldi');
  }
  if(id==='s121'&&tag==='korkak'){
    playerFlags.securityBreach++;
    queueDelayedConsequence({sayginlik:-8,bilgi:-6},'Security Breach','Kayitsiz gecis sonrasi ISPS sorgusu buyudu.',2,-4);
  }
  if(id==='s122'&&tag==='korkak'){
    playerFlags.securityBreach++;
    queueDelayedConsequence({sayginlik:-9,dinclik:-4},'Guvenlik Ihlali','Yuksek ISPS seviyesinde gevseklik ekipte ciddi rahatsizlik yaratti.',2,-3);
  }
  if(id==='s127'&&tag==='korkak'){
    playerFlags.securityBreach++;
    queueDelayedConsequence({sayginlik:-10,bilgi:-7},'CSO Baskisi','Company Security Officer eksik ISPS raporu yuzunden gemiye sert geri donus yapti.',1,-3);
  }
  if(id==='s124'&&tag==='korkak'){
    playerFlags.nearMiss++;
    queueDelayedConsequence({sayginlik:-10,cesaret:-4,dinclik:-4},'Near-Miss','Yanlis ellecleme isareti yuzunden yuk son anda durduruldu.',1,-3);
  }
  if(id==='s126'&&tag==='kritik') playerFlags.sextantGood++;
  if(id==='s128'&&tag==='kritik') playerFlags.sextantGood++;
  if(id==='s129'&&tag==='korkak'){
    playerFlags.nearMiss++;
    queueDelayedConsequence({sayginlik:-8,bilgi:-5},'Near-Miss Report','Olay resmi rapora donustu; detay vermen beklendi.',1,-2);
  }
}

// ===== GİRİŞ EKRANI =====
function buildIntro(){
  refreshShipSpecs();
  // Yıl seçimi
  const ys=document.getElementById('yearsel');
  YEARS.forEach(y=>{
    const d=document.createElement('div');
    d.className='ysel'+(y.year===selYear?' active':'');
    d.innerHTML=`<div class="ys-yr">${y.year}</div><div class="ys-era">${y.era}</div>`;
    d.onclick=()=>{selYear=y.year;document.querySelectorAll('.ysel').forEach(x=>x.classList.remove('active'));d.classList.add('active');};
    ys.appendChild(d);
  });
  // Gemi türü
  const st=document.getElementById('shiptype');
  STYPES.forEach(t=>{
    const konts=KONTRAT_DEFS[t.key]||[];
    const kontStr=konts.map(k=>`${k.ay}+1`).join(' / ');
    const spec=getShipSpec(t.key);
    const d=document.createElement('div');
    d.className='selb'+(t.key===selType?' active':'');
    d.innerHTML=`<span class="sb-ico">${t.ico}</span><span class="sb-nm">${t.nm}</span><span class="sb-kont">${spec.tonLabel}<br>${kontStr} ay</span>`;
    d.onclick=()=>{selType=t.key;document.querySelectorAll('.selb').forEach(x=>x.classList.remove('active'));d.classList.add('active');updateKontrat();updateSugs();};
    st.appendChild(d);
  });
  updateKontrat();
  updateSugs();
}

function updateKontrat(){
  const konts=KONTRAT_DEFS[selType]||[];
  const c=document.getElementById('kontratsel');
  c.innerHTML='';
  konts.forEach((k,i)=>{
    const d=document.createElement('div');
    d.className='kont-card'+(i===selKontrat?' active':'');
    d.innerHTML=`<div class="kc-ay">${k.ay}+1</div><div class="kc-lbl">ay seyir + ${k.izin} ay izin</div><div class="kc-ucret">Ücret: ${k.ucret}</div><div class="kc-izin">✓ ${k.bonus}</div>`;
    d.onclick=()=>{selKontrat=i;document.querySelectorAll('.kont-card').forEach(x=>x.classList.remove('active'));d.classList.add('active');};
    c.appendChild(d);
  });
}

function updateSugs(){
  const names=SNAMES[selType]||[];
  const c=document.getElementById('shipsugs');c.innerHTML='';
  names.forEach(n=>{const d=document.createElement('div');d.className='ssug';d.textContent=n;d.onclick=()=>{document.getElementById('shipnameinp').value=n;};c.appendChild(d);});
  if(!document.getElementById('shipnameinp').value||!names.includes(document.getElementById('shipnameinp').value))
    document.getElementById('shipnameinp').value=names[0]||'';
}

// ===== STAT YÖNETİMİ =====
function clamp(v){return Math.min(100,Math.max(0,Math.round(v)));}

function tuneDelta(key,current,delta){
  if(delta===0) return 0;
  if(delta>0){
    let mult=DIFFICULTY.positiveGainMult;
    if(current>=DIFFICULTY.highStatThreshold) mult*=DIFFICULTY.highStatGainMult;
    if(current>=DIFFICULTY.extremeStatThreshold) mult*=DIFFICULTY.extremeStatGainMult;
    if(key==='dinclik') mult*=0.8;
    return Math.max(1,Math.round(delta*mult));
  }
  let mult=DIFFICULTY.negativeLossMult;
  if(key==='dinclik') mult+=0.07;
  return Math.min(-1,Math.round(delta*mult));
}

function addEffectDelta(effect,key,delta){
  if(!delta) return;
  effect[key]=(effect[key]||0)+delta;
}

function getSceneDomain(sc){
  const blob=`${sc.gfx||''} ${sc.loc||''} ${sc.sub||''} ${sc.who||''}`.toLowerCase();
  if(/engine|makine|carkci|bas2|yagci/.test(blob)) return 'engine';
  if(/solas|marpol|stcw|loadline|bunker|bunkers|afs|atina|montreux|charter|isps|gmdss|compliance/.test(blob)) return 'compliance';
  if(/bridge|radar|compass|bogaz|tss|köprü|kopru|vhf|night/.test(blob)) return 'bridge';
  return 'deck';
}

function evaluateDecisionPressure(sc,c2){
  const extra={};
  const notes=[];
  const tag=c2.tag||'akilli';
  const domain=getSceneDomain(sc);
  const isMistake=tag==='korkak';

  if(isMistake){
    SYSTEM_STATE.consecutiveMistakes++;
    SYSTEM_STATE.totalMistakes++;
    SYSTEM_STATE.hiddenFailures[domain]=(SYSTEM_STATE.hiddenFailures[domain]||0)+1;
  }else{
    if(tag==='akilli'||tag==='kritik') SYSTEM_STATE.consecutiveMistakes=0;
    if(tag==='cesur') SYSTEM_STATE.consecutiveMistakes=Math.max(0,SYSTEM_STATE.consecutiveMistakes-1);
    SYSTEM_STATE.hiddenFailures[domain]=Math.max(0,(SYSTEM_STATE.hiddenFailures[domain]||0)-(tag==='kritik'?2:1));
  }

  if(SYSTEM_STATE.consecutiveMistakes>=2){
    addEffectDelta(extra,'sayginlik',-2);
    notes.push('Ayni tip hatalar ekipte guven asindirdi.');
  }
  if(SYSTEM_STATE.consecutiveMistakes>=3){
    addEffectDelta(extra,'dinclik',-3);
    addEffectDelta(extra,'bilgi',-1);
    notes.push('Ust uste hatalar baski ve dalginlik yaratti.');
  }

  const hiddenLevel=SYSTEM_STATE.hiddenFailures[domain]||0;
  const warnKey=`${domain}-warn`;
  const breakKey=`${domain}-break`;
  if(hiddenLevel>=3&&!SYSTEM_STATE.triggeredChains.has(warnKey)){
    SYSTEM_STATE.triggeredChains.add(warnKey);
    addEffectDelta(extra,'sayginlik',-2);
    notes.push('Gorunmeyen kucuk hatalar birikmeye basladi.');
  }
  if(hiddenLevel>=5&&!SYSTEM_STATE.triggeredChains.has(breakKey)){
    SYSTEM_STATE.triggeredChains.add(breakKey);
    addEffectDelta(extra,'bilgi',-2);
    addEffectDelta(extra,'dinclik',-4);
    notes.push('Gizli basarisizlik zinciri patladi; ekip seni daha yakin izliyor.');
  }

  if(stats.cesaret>=78&&tag==='cesur'){
    addEffectDelta(extra,'dinclik',-4);
    addEffectDelta(extra,'sayginlik',-2);
    notes.push('Yuksek cesaret kontrolsuz riske kaydi.');
  }
  if(stats.sayginlik>=78&&(tag==='sosyal'||tag==='itaatkar')){
    addEffectDelta(extra,'dinclik',-3);
    notes.push('Herkese yetismeye calismak seni yipratiyor.');
  }
  if(stats.bilgi>=82&&(tag==='akilli'||tag==='kritik')){
    addEffectDelta(extra,'cesaret',-2);
    addEffectDelta(extra,'sayginlik',-1);
    notes.push('Asiri analiz karar hizini dusurdu.');
  }

  return {extra,notes};
}

function applyEffect(e,opts={}){
  const old={...stats};
  Object.keys(e).forEach(k=>{
    if(k==='yorgunluk'){
      const tuned=tuneDelta('dinclik',stats.dinclik,-e[k]); // yorgunluk artarsa dinclik azalir
      stats.dinclik=clamp(stats.dinclik+tuned);
    }
    else if(k==='dinclik'){
      const tuned=tuneDelta('dinclik',stats.dinclik,e[k]);
      stats.dinclik=clamp(stats.dinclik+tuned);
    }
    else if(stats[k]!==undefined){
      const tuned=tuneDelta(k,stats[k],e[k]);
      stats[k]=clamp(stats[k]+tuned);
    }
  });
  stats.dinclik=clamp(stats.dinclik-DIFFICULTY.passiveFatigue);
  if(choicesMade.length>0&&choicesMade.length%DIFFICULTY.periodicStressEvery===0){
    stats.sayginlik=clamp(stats.sayginlik-DIFFICULTY.periodicStressLoss);
  }
  updateStats(old,opts);
  // Tehlike bolgesi bildirimi
  const dangerChecks = [
    {val:stats.cesaret, name:'Cesaret', prev:old.cesaret},
    {val:stats.bilgi,   name:'Bilgi',   prev:old.bilgi},
    {val:stats.sayginlik,name:'Sayginlik',prev:old.sayginlik},
    {val:stats.dinclik, name:'Dinclik', prev:old.dinclik},
  ];
  dangerChecks.forEach(d=>{
    if(d.val<=20 && d.prev>20){
      setTimeout(()=>showNotif('!','TEHLIKE!', d.name+' kritik seviyede - '+d.val+' kaldi!'), 300);
    }
  });
  return checkCrisis();
}

function updateStats(old,opts={}){
  // Tehlike bölgesi uyarısı
  const dangerStats = [
    {key:'cesaret', elId:'s-cesaret', val:stats.cesaret, name:'Cesaret'},
    {key:'bilgi',   elId:'s-bilgi',   val:stats.bilgi,   name:'Bilgi'},
    {key:'sayginlik',elId:'s-sayginlik',val:stats.sayginlik,name:'Saygınlık'},
    {key:'dinclik', elId:'s-yorgunluk',val:stats.dinclik, name:'Dinçlik'},
  ];
  dangerStats.forEach(d=>{
    const el = document.getElementById(d.elId);
    if(!el) return;
    if(d.val<=20 && d.val>0){
      el.style.animation='fls .6s ease-in-out infinite';
      el.style.color='#ff4444';
    } else {
      el.style.animation='';
    }
  });
  ['cesaret','bilgi','sayginlik'].forEach(k=>{
    const el=document.getElementById('s-'+k);
    const v=Math.round(stats[k]);
    el.textContent=v;
    document.getElementById('b-'+k).style.width=v+'%';
    document.getElementById('b-'+k).style.background=v>=70?'#1a7a3c':v>=40?'#c9952a':'#8b2222';
    document.getElementById('s-'+k).style.color=v>=70?'#5dbf8a':v>=40?'#d4a017':'#c97070';
    if(old&&old[k]!==stats[k]){el.classList.add('sf');setTimeout(()=>el.classList.remove('sf'),400);}
  });
  // Dinçlik (ters — yüksek = iyi)
  const dv=Math.round(stats.dinclik);
  document.getElementById('s-yorgunluk').textContent=dv;
  document.getElementById('b-yorgunluk').style.width=dv+'%';
  document.getElementById('b-yorgunluk').style.background=dv>=70?'#1a7a3c':dv>=40?'#c9952a':'#8b2222';
  document.getElementById('s-yorgunluk').style.color=dv>=70?'#5dbf8a':dv>=40?'#d4a017':'#c97070';

  const s=stats.sayginlik;
  document.getElementById('repstars').textContent=s>=80?'⭐⭐⭐⭐⭐':s>=60?'⭐⭐⭐⭐':s>=40?'⭐⭐⭐':s>=20?'⭐⭐':'⭐';

  // Kontrat bar
  contractDays++;
  const pct=Math.round((contractDays/contractTotal)*100);
  document.getElementById('contract-days').textContent=`${contractDays} / ${contractTotal} GÜN`;
  document.getElementById('contract-fill').style.width=Math.min(pct,100)+'%';
}

function checkCrisis(){
  // Herhangi bir stat 0'a düşünce oyun biter
  if(stats.cesaret<=0)  return 'cesaret_0';
  if(stats.bilgi<=0)    return 'bilgi_0';
  if(stats.sayginlik<=0)return 'sayginlik_0';
  if(stats.dinclik<=0)  return 'dinclik_dusuk';
  return null;
}

function showNotif(icon,title,body){
  document.getElementById('notifico').textContent=icon;
  document.getElementById('notiftt').textContent=title;
  document.getElementById('notifbd').textContent=body;
  const o=document.getElementById('notifover');
  o.classList.add('show');
  setTimeout(()=>o.classList.remove('show'),2200);
}

function getCalcOutcomeChoice(sc, numericAnswer){
  const calc = sc?.calc;
  if(!calc || !Array.isArray(sc.choices)) return sc?.choices?.[0] || null;
  const diff = Math.abs(Number(numericAnswer) - Number(calc.answer));
  const critical = sc.choices.find(c=>c.tag==='kritik') || sc.choices[0];
  const medium = sc.choices.find(c=>c.tag==='itaatkar' || c.tag==='akilli') || sc.choices[1] || critical;
  const weak = sc.choices.find(c=>c.tag==='korkak') || sc.choices[sc.choices.length-1] || medium;
  const tightTol = calc.unit==='m' ? 0.05 : calc.unit==='cm' ? 0.5 : calc.unit==='ton' ? 5 : 0.3;
  const softTol = calc.unit==='m' ? 0.15 : calc.unit==='cm' ? 2 : calc.unit==='ton' ? 30 : 1.2;
  if(diff <= tightTol) return critical;
  if(diff <= softTol) return medium;
  return weak;
}

function handleSceneChoice(sc, c2, ch){
  sfxClick();
  const calcPanel = document.getElementById('calc-panel');
  if(calcPanel) calcPanel.className='';
  if(ch){
    ch.querySelectorAll('.cbtn').forEach(x=>{x.disabled=true;x.style.opacity='.4';});
  }
  const pressure=evaluateDecisionPressure(sc,c2);
  const resolvedEffect={...(c2.effect||{})};
  Object.entries(pressure.extra).forEach(([k,v])=>{resolvedEffect[k]=(resolvedEffect[k]||0)+v;});
  if(c2.routePlanKey&&ECDIS_ROUTE_PLANS[c2.routePlanKey]){
    activeEcdisPlanKey=c2.routePlanKey;
    addJournalEntry(`[SEYIR PLANI] ${ECDIS_ROUTE_PLANS[c2.routePlanKey].label} ECDIS uzerinde aktif edildi.`, sc.day, sc.time);
  }
  if(c2.radarMode&&RADAR_TRAINING_MODES[c2.radarMode]){
    activeRadarMode=c2.radarMode;
    addJournalEntry(`[RADAR] ${RADAR_TRAINING_MODES[c2.radarMode].label} ekran duzeni aktif edildi.`, sc.day, sc.time);
  }
  choicesMade.push({tag:c2.tag,domain:getSceneDomain(sc),extraPressure:Object.keys(pressure.extra).length>0});
  scheduleAdvancedConsequences(sc,c2);
  applyCrewEffect(sc.who, c2.tag);
  const crisis=applyEffect(resolvedEffect);

  const pos=Object.entries(resolvedEffect).filter(([k,v])=>v>0&&k!=='yorgunluk').map(([k,v])=>'+'+v+' '+k).join(' ');
  const neg=Object.entries(resolvedEffect).filter(([k,v])=>v<0&&k!=='yorgunluk').map(([k,v])=>v+' '+k).join(' ');
  const parts=[];if(pos)parts.push(pos);if(neg)parts.push(neg);
  const icon=c2.tag==='kritik'?'!':c2.tag==='cesur'?'^':c2.tag==='akilli'?'i':'~';
  if(parts.length)showNotif(icon,'Stat degisimi',parts.join(' | '));
  if(pressure.notes.length){
    setTimeout(()=>showNotif('!','Baski Artiyor',pressure.notes[0]),900);
    addJournalEntry('[BASKI] '+pressure.notes.join(' '), sc.day, sc.time);
  }

  addJournalEntry(c2.text, sc.day, sc.time);
  const nextFn=()=>{
    if(c2.next==='end'||currentIdx>=sceneQueue.length-1){showEnd();}
    else if(crisis){showCrisis(crisis);}
    else{currentIdx++;renderScene(currentIdx);}
  };
  setTimeout(nextFn, parts.length?2200:300);
}

function renderCalcPanel(sc, ch){
  const panel = document.getElementById('calc-panel');
  if(!panel) return;
  const calc = sc?.calc;
  if(!calc){
    panel.className='';
    panel.innerHTML='';
    return;
  }
  let attemptsLeft = calc.attempts || 2;
  panel.className='calc-panel show';
  panel.innerHTML = `<div class="calc-box">
    <div class="calc-title">Mini Hesap Ekrani</div>
    <div class="calc-hint">${calc.formula || 'Hesabi yap ve sonucu gir.'}</div>
    <div class="calc-row">
      <input id="calc-input" class="calc-input" type="number" step="0.01" placeholder="Sonucu yaz...">
      <span class="calc-unit">${calc.unit || ''}</span>
      <button id="calc-submit" class="calc-btn">Hesapla</button>
    </div>
    <div class="calc-meta"><span>${calc.toleranceText || ''}</span><span id="calc-attempts">Hak: ${attemptsLeft}</span></div>
    <div id="calc-feedback" class="calc-feedback"></div>
  </div>`;
  const input = document.getElementById('calc-input');
  const submit = document.getElementById('calc-submit');
  const feedback = document.getElementById('calc-feedback');
  const attempts = document.getElementById('calc-attempts');
  const tryResolve = ()=>{
    const val = Number(input.value);
    if(Number.isNaN(val)){
      feedback.className='calc-feedback bad';
      feedback.textContent='Once sayisal bir sonuc gir.';
      return;
    }
    const picked = getCalcOutcomeChoice(sc, val);
    const isCritical = picked && picked.tag==='kritik';
    attemptsLeft--;
    attempts.textContent = `Hak: ${attemptsLeft}`;
    if(isCritical || attemptsLeft<=0){
      feedback.className = isCritical ? 'calc-feedback' : 'calc-feedback warn';
      feedback.textContent = isCritical ? 'Hesap oturdu. Sonucu zabite iletiyorsun.' : 'Tam oturmadi; yine de mevcut hesabinla ilerliyorsun.';
      submit.disabled = true;
      input.disabled = true;
      setTimeout(()=>handleSceneChoice(sc, picked, ch), 700);
      return;
    }
    feedback.className='calc-feedback warn';
    feedback.textContent='Yaklastin ama tekrar kontrol et. Birim ve formulu yeniden dusun.';
  };
  submit.onclick = tryResolve;
  input.addEventListener('keydown',e=>{ if(e.key==='Enter') tryResolve(); });
}

// ===== RASTGELE SENARYO SIRASI =====
function buildSceneQueue(pool, totalDays){
  // Zorunlu sahneler: s01 (başlangıç), FINAL (son)
  const mandatory_start = pool.filter(s=>s.id==='s01');
  const final = pool.filter(s=>s.id==='FINAL');
  const crisis_scenes = pool.filter(s=>s.id.startsWith('kriz'));
  const regular = pool.filter(s=>!s.id.startsWith('kriz')&&s.id!=='s01'&&s.id!=='FINAL'&&!DOCUMENT_CHAIN_SCENE_IDS.has(s.id));
  const documentChain = ['s309','s310','s311','s312','s313','s314'].map(id=>pool.find(s=>s.id===id)).filter(Boolean);

  // Kriz sahnelerini grupla
  const crisisGroups=[
    ['kriz01','kriz02','kriz03'], // makine arızası
    ['kriz04','kriz05','kriz05b','kriz06'], // fırtına
    ['kriz07','kriz08','kriz09'], // boğaz
    ['kriz10','kriz11','kriz12'], // korsan
  ];

  // Rastgele 2-3 kriz grubu seç
  const shuffledGroups=[...crisisGroups].sort(()=>Math.random()-0.5);
  const selectedCrisisGroups=shuffledGroups.slice(0,Math.min(2+Math.floor(Math.random()*2),shuffledGroups.length));
  const selectedCrisis=[];
  selectedCrisisGroups.forEach(g=>{
    g.forEach(id=>{
      const sc=pool.find(s=>s.id===id);
      if(sc) selectedCrisis.push(sc);
    });
  });

  // Düzenli sahneleri karıştır ve totalDays - (başlangıç+kriz+final) kadar seç
  const shuffledRegular=[...regular].sort(()=>Math.random()-0.5);
  const needed=Math.max(5, totalDays - selectedCrisis.length - 2 - EXTRA_ROUTE_SCENES.length - EXTRA_EQUIPMENT_SCENES.length - documentChain.length);
  let selectedRegular=shuffledRegular.slice(0,needed);

  // Dinclik toparlanma sahneleri kuyrukta gercekten yer bulsun.
  const minRecoveryCount = Math.min(6, Math.max(3, Math.floor(totalDays/7)));
  const currentRecoveryCount = selectedRegular.filter(s=>RECOVERY_SCENE_IDS.has(s.id)).length;
  if(currentRecoveryCount < minRecoveryCount){
    const recoveryPool = shuffledRegular.filter(s=>RECOVERY_SCENE_IDS.has(s.id) && !selectedRegular.some(x=>x.id===s.id));
    const needMore = minRecoveryCount - currentRecoveryCount;
    const extras = recoveryPool.slice(0, needMore);
    if(extras.length){
      selectedRegular = [
        ...selectedRegular.filter(s=>!RECOVERY_SCENE_IDS.has(s.id)).slice(0, Math.max(0, selectedRegular.length - extras.length)),
        ...selectedRegular.filter(s=>RECOVERY_SCENE_IDS.has(s.id)),
        ...extras
      ];
    }
  }

  // Sıralamayı oluştur: başlangıç + (karışık regular + kriz) + final
  const middle=[...selectedRegular,...selectedCrisis].sort(()=>Math.random()-0.5);

  return [...mandatory_start, ...middle, ...documentChain, ...EXTRA_ROUTE_SCENES, ...EXTRA_EQUIPMENT_SCENES, ...final];
}

const RECOVERY_SCENE_IDS = new Set(['s146','s147','s148','s149','s150','s183','s184','s185','s186','s187','s187b','s187c','s187d','s187e','s187f','s187g','s187h','s187i','s187j']);
const HARBOR_RECOVERY_SCENE_IDS = new Set(['s147','s150','s186','s187c','s187e','s187h','s187j']);

function maybePrioritizeRecoveryScene(){
  if(currentIdx >= sceneQueue.length-1) return;
  if(stats.dinclik > 62) return;
  const nextScene = sceneQueue[currentIdx];
  if(nextScene && RECOVERY_SCENE_IDS.has(nextScene.id)) return;

  const prevScene = currentIdx > 0 ? sceneQueue[currentIdx-1] : null;
  const prevBlob = `${prevScene?.id||''} ${prevScene?.gfx||''} ${prevScene?.loc||''} ${prevScene?.sub||''}`.toLowerCase();
  const afterCrisis = !!(prevScene && (prevScene.alert || prevScene.id?.startsWith('kriz') || /firtina|storm|acil|yangin|korsan|suruklenme|alarm/.test(prevBlob)));
  const harborWindow = !!(nextScene && /harbor|port_arrival/.test(nextScene.gfx||'')) || /liman|iskele|rihtim|romorkor|pilot station|mooring/.test(prevBlob);

  let foundIdx = -1;
  const nearSpan = afterCrisis ? (stats.dinclik <= 25 ? 9 : 7) : (harborWindow ? 11 : (stats.dinclik <= 25 ? 18 : 14));
  const nearLimit = Math.min(sceneQueue.length - 2, currentIdx + nearSpan);

  for(let i=currentIdx+1; i<=nearLimit; i++){
    const sc = sceneQueue[i];
    if(sc && RECOVERY_SCENE_IDS.has(sc.id) && (!harborWindow || HARBOR_RECOVERY_SCENE_IDS.has(sc.id))){
      foundIdx = i;
      break;
    }
  }

  if(foundIdx === -1){
    for(let i=nearLimit+1; i<sceneQueue.length-1; i++){
      const sc = sceneQueue[i];
      if(sc && RECOVERY_SCENE_IDS.has(sc.id) && (!harborWindow || HARBOR_RECOVERY_SCENE_IDS.has(sc.id))){
        foundIdx = i;
        break;
      }
    }
  }

  if(foundIdx > currentIdx){
    const [recoveryScene] = sceneQueue.splice(foundIdx, 1);
    sceneQueue.splice(currentIdx, 0, recoveryScene);
  }
}

// ===== SAHNE RENDER =====
function renderScene(idx){
  if(idx>='end'||currentIdx>=sceneQueue.length){showEnd();return;}
  maybePrioritizeRecoveryScene();
  const sc=sceneQueue[currentIdx];
  if(!sc){showEnd();return;}
  const delayedCrisis=resolveDelayedConsequences(sc);
  if(delayedCrisis){showCrisis(delayedCrisis);return;}
  if(sc.id==='FINAL'&&currentIdx<sceneQueue.length-1){
    // Henüz son değilse atla, yoksa göster
  }

  const c=CREW[sc.who]||CREW.anlatici;
  document.getElementById('dbd').textContent=sc.day;
  document.getElementById('tbd').textContent=sc.time;
  document.getElementById('lbd').textContent=sc.loc;
  document.getElementById('scene-sub').textContent=sc.sub||'';
  document.getElementById('spkico').textContent=c.icon;
  document.getElementById('spknm').textContent=c.name;
  document.getElementById('spktl').textContent=c.title;
  document.getElementById('text').textContent=typeof sc.text==='function'?sc.text(pn,sn):sc.text;
  document.getElementById('charname').textContent=pn;
  document.getElementById('charrole').textContent='GÜV. STAJYERİ · '+sc.day.toUpperCase();
  const stObj=STYPES.find(x=>x.key===selType);
  const shipSpec=getShipSpec(selType);
  document.getElementById('shipinfo').textContent=sn+' · '+(shipSpec.tonLabel||stObj.ton)+' · '+stObj.nm+' · '+selYear;
  document.getElementById('contract-type').textContent=stObj.nm+' '+contractTotal+'+'+(KONTRAT_DEFS[selType]?.[selKontrat]?.izin||1)+'ay';

  const pct=Math.round((currentIdx/sceneQueue.length)*100);
  document.getElementById('progbar').style.width=pct+'%';
  document.getElementById('chaplbl').textContent='SAHNE '+(currentIdx+1)+'/'+sceneQueue.length;

  const ab=document.getElementById('alert-banner');
  if(sc.alert){ab.style.display='block';ab.textContent='⚠ ACİL DURUM — '+sc.sub;ab.style.color='#ffcccc';}
  else ab.style.display='none';

  const svg=document.getElementById('gfx-svg');
  svg.innerHTML=getSafeSceneMarkup(sc);

  playSceneAudio(sc);
  updateSceneNoteHints(sc);
  onSceneRender(sc);

  const ch=document.getElementById('choices');ch.innerHTML='';
  renderCalcPanel(sc, ch);
  sc.choices.forEach(c2=>{
    const b=document.createElement('button');b.className='cbtn';
    b.innerHTML='<span class="ctag tag-'+(c2.tag||'akilli')+'">'+tagL[c2.tag||'akilli']+'</span>'+c2.text;
    b.onclick=()=>handleSceneChoice(sc,c2,ch);
    ch.appendChild(b);
  });
  if(sc.calc){
    ch.style.display='none';
  }else{
    ch.style.display='';
  }
}

// ===== KRİZ =====
function showCrisis(key){
  stopAllMusic();sfxFail();
  document.getElementById('game').style.display='none';
  const cs=document.getElementById('crisis');cs.style.display='flex';
  const c=CRISIS_ENDS[key];
  if(!c){showEnd();return;}
  document.getElementById('crise').textContent=c.emoji;
  document.getElementById('crist').textContent=c.title;
  document.getElementById('crisx').textContent=typeof c.text==='function'?c.text(pn,sn):c.text;
  document.getElementById('criss').textContent=c.stat;
}

// ===== SON =====
function showEnd(){
  stopAllMusic();
  document.getElementById('game').style.display='none';
  document.getElementById('endscr').style.display='flex';

  const avg=(stats.cesaret+stats.bilgi+stats.sayginlik)/3;
  const cesurC=choicesMade.filter(c=>c.tag==='cesur').length;
  const kritikC=choicesMade.filter(c=>c.tag==='kritik').length;
  const stObj=STYPES.find(x=>x.key===selType);
  const kont=KONTRAT_DEFS[selType]?.[selKontrat]||{ay:6,bonus:'—'};

  let emoji,title,flavor,desc,verdict;
  if(kritikC>=2&&stats.cesaret>=60&&avg>=60){
    emoji='🛡️';title='Krizlerin Denizcisi';
    flavor=`"Bu stajyer dört krizde donmadı." — Süvari, ${selYear}`;
    desc=`${pn}, ${contractTotal} aylık ${stObj.nm} kontratında makine arızası, boğazda sürüklenme ve korsan alarmında doğru kararlar aldı.`;
    verdict=`<strong>Staj Raporu (${selYear}):</strong> Kriz yönetimi olağanüstü. ${kont.bonus} kazanıldı. İleri kademe eğitim tavsiye edilir.`;
    setTimeout(sfxSuccess,300);
  }else if(stats.sayginlik>=70&&avg>=65){
    emoji='🏆';title='Geleceğin Süvarisi';
    flavor=`"Bu stajyer 10 yıl içinde köprüye çıkar." — Süvari, ${selYear}`;
    desc=`${pn}, ${sn}'da kendini kanıtladı. Mürettebat seninle gurur duyuyor.`;
    verdict=`<strong>Staj Raporu (${selYear}):</strong> Teknik bilgi üstün. Mürettebat uyumu mükemmel. ${kont.bonus} kazanıldı.`;
    setTimeout(sfxSuccess,300);
  }else if(stats.bilgi>=65&&avg>=55){
    emoji='🧭';title='Yetenekli Denizci';
    flavor=`"Teknik kafası güçlü." — 1. Zabiti`;
    desc=`${pn} bilgi konusunda üstün. Saha gelişiyor.`;
    verdict=`<strong>Staj Raporu (${selYear}):</strong> Teorik bilgi kuvvetli. ${kont.bonus} kazanıldı.`;
    setTimeout(sfxSuccess,300);
  }else if(cesurC>=5&&stats.cesaret>=60){
    emoji='⚓';title='Cesur Güverte Adamı';
    flavor=`"Korkmuyor." — Lostromo`;
    desc=`${pn} öne çıktı, risk üstlendi.`;
    verdict=`<strong>Staj Raporu (${selYear}):</strong> Liderlik potansiyeli yüksek. Teknik bilgi geliştirilmeli.`;
  }else{
    emoji='📖';title='Öğrenme Yolculuğu';
    flavor=`"Her büyük süvari ilk seferinde kaybolmuştur."`;
    desc=`${pn} zor bir ilk seferden geçti. Ama bitirmedi.`;
    verdict=`<strong>Staj Raporu (${selYear}):</strong> Potansiyel mevcut. ${kont.ay}+${kont.izin} aylık kontrat tamamlandı.`;
  }

  const moodLabel=mood>=75?'Saglam durdu':mood>=50?'Dalgalandi ama tuttu':mood>=30?'Zorlandi':'Icine kapandi';
  if(playerFlags.securityBreach>0) verdict+=` Security breach riski ${playerFlags.securityBreach} kez buyudu.`;
  if(playerFlags.nearMiss>0) verdict+=` Yuk elleclemede ${playerFlags.nearMiss} near-miss kaydi olustu.`;
  if(playerFlags.sextantGood>0) verdict+=` Sextant disiplininde de kendini gosterdi.`;
  verdict+=` <br><strong>Ruh Hali:</strong> ${mood}/100 - ${moodLabel}.`;
  document.getElementById('ende').textContent=emoji;
  document.getElementById('endt').textContent=title;
  document.getElementById('endf').textContent=flavor;
  document.getElementById('endd').textContent=desc;
  document.getElementById('endv').innerHTML=verdict;
  document.getElementById('endgrid').innerHTML=
    '<div class="ecard"><div class="ecv" style="color:#6fa8dc;">'+Math.round(stats.cesaret)+'</div><div class="ecl">CESARET</div></div>'+
    '<div class="ecard"><div class="ecv" style="color:#d4a017;">'+Math.round(stats.bilgi)+'</div><div class="ecl">BİLGİ</div></div>'+
    '<div class="ecard"><div class="ecv" style="color:#5dbf8a;">'+Math.round(stats.sayginlik)+'</div><div class="ecl">SAYGINLIK</div></div>'+
    '<div class="ecard"><div class="ecv" style="color:#5dbf8a;">'+Math.round(stats.dinclik)+'</div><div class="ecl">DİNÇLİK</div></div>';
}

// ===== BAŞLAT =====
function beginGame(){
  const ni=document.getElementById('nameinp').value.trim();
  const si=document.getElementById('shipnameinp').value.trim();
  pn=ni||'Stajyer';
  sn=si||(SNAMES[selType]||['M/V Ege Meltem'])[0];

  const kont=KONTRAT_DEFS[selType]?.[selKontrat]||{ay:6,izin:1};
  contractTotal=(kont.ay+kont.izin)*4; // Her ay ~4 sahne
  contractDays=0;

  // Kontrat uzunluğuna göre sahne pool'u oluştur
  selectedStartPort=START_PORTS[Math.floor(Math.random()*START_PORTS.length)];
  selectedStartScenario=START_SCENARIOS[Math.floor(Math.random()*START_SCENARIOS.length)];
  const pool=buildScenePool(pn,sn,selYear,selType,selectedStartPort,selectedStartScenario);
  sceneQueue=buildSceneQueue(pool, contractTotal);
  const birthdayScene = buildBirthdaySurpriseScene();
  const insertAt = Math.min(sceneQueue.length-1, Math.max(4, 6 + Math.floor(Math.random()*Math.max(2, Math.floor(sceneQueue.length/3)))));
  sceneQueue.splice(insertAt, 0, birthdayScene);
  currentIdx=0;

  stats={cesaret:40,bilgi:22,sayginlik:32,dinclik:68};
  mood=58;
  activeEcdisPlanKey='izmir_messina_south';
  activeRadarMode='cpa_watch';
  delayedConsequences=[];
  playerFlags={securityBreach:0,nearMiss:0,sextantGood:0};
  choicesMade=[];
  SYSTEM_STATE.consecutiveMistakes=0;
  SYSTEM_STATE.totalMistakes=0;
  SYSTEM_STATE.hiddenFailures={bridge:0,deck:0,engine:0,compliance:0};
  SYSTEM_STATE.triggeredChains.clear();
  seenColregHints.clear();
  journalEntries=[];
  photos=[];
  seenPhotoMoments.clear();
  routeHistory=[{x:selectedStartPort.x,y:selectedStartPort.y}];
  visitedPorts=new Set([selectedStartPort.name]);
  shipPosition={x:selectedStartPort.x,y:selectedStartPort.y};
  scenesSinceEvent=0;
  nextEventAt=5+Math.floor(Math.random()*4);
  randomizeCrewRoster();
  initCrewSystem();

  document.getElementById('intro').style.display='none';
  const g=document.getElementById('game');g.style.display='flex';g.style.flexDirection='column';
  setTimeout(()=>{if(window._drawClock)window._drawClock();},50);
  setTimeout(()=>{if(window._drawClock)window._drawClock();},300);
  setTimeout(()=>{if(window._drawClock)window._drawClock();},600);
  updateStats({});
  document.getElementById('contract-fill').style.width='0%';
  document.getElementById('tb-photos-count').textContent='0';
  document.getElementById('contract-days').textContent=`0 / ${contractTotal} GÜN`;
  renderScene(0);
  setTimeout(()=>{const cv=document.getElementById('clock-canvas');if(cv){const ev=new Event('resize');window.dispatchEvent(ev);}},100);
}

function restartGame(){
  stopAllMusic();
  document.getElementById('crisis').style.display='none';
  document.getElementById('endscr').style.display='none';
  document.getElementById('game').style.display='none';
  document.getElementById('intro').style.display='flex';
}

document.getElementById('nameinp').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('shipnameinp').focus();});
document.getElementById('shipnameinp').addEventListener('keydown',e=>{if(e.key==='Enter')beginGame();});

// ===== MÜRETTEBAT İLİŞKİ SİSTEMİ =====
const CREW_DEFS = {
  lostromo: {name:"Lostromo", icon:"🪢", title:"Güverte Ustası", trust:50,
    secrets:["Denizde 22 yıl. İlk gemisi İzmir'den İskenderiye hattıydı.","Oğlu da denizcilik okulu okuyor — bilmiyor bunu.","Ellerindeki yara izi bir halat kazasından: 1998, Kızıldeniz."],
    tips:["Güverte kontrol listesini hiç atlamama","Halat bağlama tekniklerini sormaya devam et","Sabah turuna zamanında çık"]},
  suvari: {name:"Kaptan Serra", icon:"🎖️", title:"Süvari", trust:40,
    secrets:["Emekliliğine 3 yıl kaldı. Bilmiyor bunu henüz.","Her seferin başında gemisine 5 dakika yalnız bakıyor.","İki dil biliyor — ama İngilizce konuşmayı sevmiyor."],
    tips:["Zor sorulara dürüst cevap ver","Köprüde konuşmak için izin iste","Sorduğunda görüşünü söyle"]},
  z1: {name:"1. Zabit Ece", icon:"🧭", title:"Güverte Ops.", trust:45,
    secrets:["Hukuk okumak istiyordu. Ailesi denizci çıkardı onu.","Her sabah 04:45'te kalkar — kimse bilmez.","Raporlarda her virgülü kontrol eder."],
    tips:["Belgeleri eksiksiz tut","Hata yaptıysan hemen bildir","Görev devrine zamanında hazır ol"]},
  z2: {name:"2. Zabit Derya", icon:"🗺️", title:"Seyir Subayı", trust:40,
    secrets:["Yıldızları tanıyor — eski usul sextant hâlâ masasında.","Mühendislik fonu var, seyire geçiş hikayesi ilginç.","Gece nöbetinde caz müziği dinliyor — sessizce."],
    tips:["ECDIS notlarını düzenli tut","Radar olaylarını logla","Nöbet devrine eksiksiz brifinle"]},
  z3: {name:"3. Zabit Selin", icon:"🚒", title:"Emniyet Subayı", trust:45,
    secrets:["Her tatbikat öncesi 10 dakika hazırlık yapıyor — görmeden.","SOLAS kitabını ezberden biliyor.","İlk gemisinde gerçek yangın yaşadı."],
    tips:["Muster listeni ezberle","Tatbikatlara ciddi katıl","Emniyet raporlarını atlatma"]},
  carkci: {name:"Baş Mühendis Nermin", icon:"⚙️", title:"Çarkçıbaşı", trust:35,
    secrets:["Bu gemide 11 yıldır — şirketi tanıdığından beter tanıyor.","Makine dairesini kapalı gözle dolaşabilir.","İki çocuğunun fotoğrafı kontrol panelinde."],
    tips:["Makine dairesine meraklı in","Teknik soruları çekinmeden sor","Arıza loglarını takip et"]},
  bas2: {name:"2. Mühendis Aylin", icon:"🔧", title:"Makine 2. Amiri", trust:40,
    secrets:["Gece nöbetlerinde şiir yazıyor — kimse bilmiyor.","Jeneratör arızasını bir kez tek başına çözdü — 4 saatte.","İstanbul Teknik mezunu, master yarıda bıraktı."],
    tips:["Makine loglarını birlikte incele","Pompa sistemlerini öğren","Alarm gelince hemen bildir"]},
  lostromo2: {name:"Silici Ramazan", icon:"🧹", title:"Güverte Temizlik", trust:50,
    secrets:["14 yıl aynı gemide. Şirket birkaç kez transfer teklif etti, hep reddetti.","Güverte şemasını yönetimden iyi biliyor.","Her sabah 05:30'da güvertede — hiç gecikmeden."],
    tips:["Güverte temizliğine katıl","Kimyasal kullanımını öğren","Ramazan'ın gözlemlerine kulak ver"]},
  yagci: {name:"Yağcı Mehmet Ali", icon:"🛢️", title:"Makine Yağlama", trust:45,
    secrets:["Yağ analizini kendi kendine öğrendi — kurs almadı.","Ana makineyi 'dinleyerek' sorun tespit edebiliyor.","Üç gemide çalıştı, üçünü de sever ama bu en iyisi der."],
    tips:["Yağ numune analizini birlikte yap","Titreşim değişimlerine dikkat et","Yağcı'nın günlük kontrollerini izle"]},
  asci: {name:"Aşçı Mehmet Usta", icon:"🍳", title:"Yemekhane", trust:55,
    secrets:["25 yıldır gemide. İlk gemisi yelkenliydi.","Sabah 04:00'te kalkar, kahvaltıyı hazırlar.","Ekibin moralini menüyle okur — kötü gün geçirmişlerse et yapar."],
    tips:["Yemeğe zamanında gel","Teşekkür etmeyi unutma","Ara sıra yardım teklif et"]},
  hasan: {name:"Tayfa Hasan", icon:"👷", title:"Deneyimli Tayfa", trust:50,
    secrets:["18 yıl denizde, hiç zam istemedi — şirket her zaman verdi.","İki çocuğu var, ikisi de denizci değil — sevinç mi üzüntü mü bilmiyor.","Fırtınada en sakin o olur."],
    tips:["Hasan'ın el işaretlerini öğren","Zor anlarda yanında dur","Gözlemlerini paylaş"]},
  musa: {name:"Tayfa Musa", icon:"👷", title:"Genç Tayfa", trust:55,
    secrets:["İlk gemisi bu. Sen de ilk stajyersin — benzer his.","Evleneceği kız denizden korkuyor.","Gece vardiyasında yıldız sayıyor."],
    tips:["Musa ile deneyim paylaş","Zor anlarda yanında dur","Birlikte öğrenin"]},
};

const CREW_NAME_POOLS = {
  suvari:["Kaptan Serra","Kaptan Leyla","Kaptan Murat","Kaptan Defne","Kaptan Onur","Kaptan Selda"],
  z1:["1. Zabit Ece","1. Zabit Arda","1. Zabit Melis","1. Zabit Cem","1. Zabit Selen","1. Zabit Bora"],
  z2:["2. Zabit Derya","2. Zabit Emre","2. Zabit İpek","2. Zabit Kerem","2. Zabit Nil","2. Zabit Baran"],
  z3:["3. Zabit Selin","3. Zabit Elif","3. Zabit Mert","3. Zabit Yağmur","3. Zabit Kaan","3. Zabit Zeynep"],
  carkci:["Baş Mühendis Nermin","Baş Mühendis Hakan","Baş Mühendis Pınar","Baş Mühendis Tolga","Baş Mühendis Ayşe","Baş Mühendis Erdem"],
  bas2:["2. Mühendis Aylin","2. Mühendis Burcu","2. Mühendis Emrah","2. Mühendis Ozan","2. Mühendis Eylül","2. Mühendis Deniz"],
  lostromo:["Lostromo İbrahim","Lostromo Kemal","Lostromo Erhan","Lostromo Yusuf","Lostromo Nejat","Lostromo Cihan"],
  lostromo2:["Silici Ramazan","Silici Ali","Silici Furkan","Silici Tahir","Silici Kadir","Silici Serhat"],
  yagci:["Yağcı Mehmet Ali","Yağcı Volkan","Yağcı Samet","Yağcı Ferhat","Yağcı Oğuz","Yağcı Kaan"],
  asci:["Aşçı Mehmet Usta","Aşçı Fikret Usta","Aşçı Nihat Usta","Aşçı Sevim Hanım","Aşçı Hüseyin Usta","Aşçı Dilek Hanım"],
  hasan:["Tayfa Hasan","Tayfa Eren","Tayfa Barış","Tayfa Ahmet","Tayfa Merve","Tayfa Gökhan"],
  musa:["Tayfa Musa","Tayfa Emir","Tayfa Deniz","Tayfa Sarp","Tayfa Cansu","Tayfa Yiğit"]
};

function pickRandom(list){
  return list[Math.floor(Math.random()*list.length)];
}

function randomizeCrewRoster(){
  Object.keys(CREW_NAME_POOLS).forEach(key=>{
    if(CREW_DEFS[key]) CREW_DEFS[key].name = pickRandom(CREW_NAME_POOLS[key]);
  });
}

let crewTrust = {};
let crewUnlocked = {};

function initCrewSystem(){
  Object.keys(CREW_DEFS).forEach(k => {
    crewTrust[k] = CREW_DEFS[k].trust;
    crewUnlocked[k] = 0;
  });
  renderCrewCards();
}

function updateCrewTrust(crewKey, delta){
  if(!crewKey || !CREW_DEFS[crewKey]) return;
  crewTrust[crewKey] = Math.min(100, Math.max(0, (crewTrust[crewKey]||50) + delta));
  // Unlock secrets at 60, 75, 90
  const unlockThresholds = [60,75,90];
  unlockThresholds.forEach((t,i) => {
    if(crewTrust[crewKey] >= t && (crewUnlocked[crewKey]||0) <= i){
      crewUnlocked[crewKey] = i+1;
      const def = CREW_DEFS[crewKey];
      if(def.secrets[i]){
        showNotif('🔓', def.name + ' — Güven Kazanıldı', def.secrets[i]);
        addJournalEntry(`${def.name} hakkında yeni bir şey öğrendim: ${def.secrets[i]}`);
      }
    }
  });
  renderCrewCards();
}

function getCrewKeyFromWho(who){
  const map = {
    lostromo:'lostromo', silici:'lostromo2', yagci:'yagci', asci:'asci',
    hasan:'hasan', musa:'musa', suvari:'suvari', z1:'z1', z2:'z2',
    z3:'z3', carkci:'carkci', bas2:'bas2'
  };
  return map[who] || null;
}

function renderCrewCards(){
  const c = document.getElementById('crew-cards');
  if(!c) return;
  c.innerHTML = '';
  Object.entries(CREW_DEFS).forEach(([key,def]) => {
    const trust = crewTrust[key] || def.trust;
    const unlocked = crewUnlocked[key] || 0;
    const color = trust>=70?'#5dbf8a':trust>=50?'#d4a017':'#c97070';
    const label = trust>=70?'Güvenir':'GÜVEN'+trust>=50?'Tanışıyor':'Mesafeli';
    const div = document.createElement('div');
    div.className = 'crew-card';
    div.innerHTML = `<div class="crew-card-top">
      <span class="crew-ico portrait-chip small">${def.icon}</span>
      <div><div class="crew-name">${def.name}</div><div class="crew-title-small">${def.title}</div></div>
      <span style="margin-left:auto;font-size:11px;font-family:'Share Tech Mono',monospace;color:${color};">${trust}</span>
    </div>
    <div class="crew-trust-bar"><div class="crew-trust-fill" style="width:${trust}%;background:${color};"></div></div>
    <div class="crew-trust-lbl"><span>${trust>=70?'Güveniyor':trust>=50?'Tanışıyor':'Mesafeli'}</span><span>🔓 ${unlocked}/3</span></div>
    ${unlocked>0?`<div class="crew-unlocked">💬 "${def.secrets[unlocked-1]?.substring(0,50)}..."</div>`:''}`;
    c.appendChild(div);
  });
}

function toggleCrew(){
  const p = document.getElementById('crew-panel');
  p.classList.toggle('open');
}

// Apply crew trust changes based on scene choices
function applyCrewEffect(who, tag){
  const key = getCrewKeyFromWho(who);
  if(!key) return;
  const delta = tag==='sosyal'?5:tag==='akilli'?3:tag==='cesur'?2:tag==='korkak'?-5:tag==='itaatkar'?2:-2;
  updateCrewTrust(key, delta);
}

// ===== ROTA HARİTASI =====
const ROUTE_PORTS = [
  {name:"İzmir", x:85, y:130, visited:true, kind:"port"},
  {name:"Çanakkale", x:130, y:100, visited:false, kind:"port"},
  {name:"İstanbul", x:180, y:85, visited:false, kind:"port"},
  {name:"Ambarli", x:172, y:92, visited:false, kind:"port"},
  {name:"Pire", x:120, y:160, visited:false, kind:"port"},
  {name:"Malta", x:95, y:175, visited:false, kind:"port"},
  {name:"Valensiya", x:22, y:108, visited:false, kind:"port"},
  {name:"Cebelitarık", x:8, y:120, visited:false, kind:"waterway"},
  {name:"Algeciras", x:10, y:125, visited:false, kind:"port"},
  {name:"İskenderiye", x:200, y:210, visited:false, kind:"port"},
  {name:"Kıbrıs", x:170, y:170, visited:false, kind:"port"},
  {name:"Port Said", x:228, y:200, visited:false, kind:"port"},
  {name:"Cenova", x:60, y:80, visited:false, kind:"port"},
  {name:"Barselona", x:30, y:100, visited:false, kind:"port"},
  {name:"Trieste", x:102, y:52, visited:false, kind:"port"},
  {name:"Messina", x:78, y:145, visited:false, kind:"waterway"},
  {name:"Haifa", x:212, y:188, visited:false, kind:"port"},
  {name:"Suveys", x:245, y:212, visited:false, kind:"waterway"},
  {name:"Rotterdam", x:25, y:18, visited:false, kind:"port"},
  {name:"Mersin", x:180, y:180, visited:false, kind:"port"},
  {name:"Marsilya", x:40, y:92, visited:false, kind:"port"},
  {name:"Napoli", x:88, y:120, visited:false, kind:"port"},
  {name:"Hamburg", x:42, y:10, visited:false, kind:"port"},
  {name:"Limasol", x:176, y:172, visited:false, kind:"port"},
  {name:"Cidde", x:260, y:210, visited:false, kind:"port"},
  {name:"Dubai", x:336, y:218, visited:false, kind:"port"},
  {name:"Tanger Med", x:6, y:118, visited:false, kind:"port"},
  {name:"Anvers", x:28, y:14, visited:false, kind:"port"},
  {name:"Malaga", x:18, y:132, visited:false, kind:"port"},
  {name:"Bari", x:112, y:96, visited:false, kind:"port"},
  {name:"Civitavecchia", x:74, y:108, visited:false, kind:"port"},
  {name:"Split", x:110, y:72, visited:false, kind:"port"},
  {name:"Ravenna", x:92, y:64, visited:false, kind:"port"},
  {name:"Burgaz", x:205, y:55, visited:false, kind:"port"},
  {name:"Varna", x:214, y:48, visited:false, kind:"port"},
  {name:"Batum", x:258, y:58, visited:false, kind:"port"},
  {name:"Novorossiysk", x:250, y:34, visited:false, kind:"port"},
  {name:"Abu Dhabi", x:348, y:214, visited:false, kind:"port"},
  {name:"Doha", x:362, y:208, visited:false, kind:"port"},
  {name:"Singapur", x:350, y:166, visited:false, kind:"port"},
  {name:"Şanghay", x:392, y:78, visited:false, kind:"port"},
  {name:"Panama", x:18, y:170, visited:false, kind:"port"},
  {name:"New Orleans", x:36, y:128, visited:false, kind:"port"},
  {name:"Santos", x:58, y:236, visited:false, kind:"port"},
  {name:"Yokohama", x:414, y:86, visited:false, kind:"port"},
  {name:"Panama Kanali", x:22, y:172, visited:false, kind:"waterway"},
  {name:"Kiel Kanali", x:46, y:8, visited:false, kind:"waterway"},
  {name:"Korint Kanali", x:118, y:154, visited:false, kind:"waterway"},
  {name:"St. Lawrence", x:46, y:56, visited:false, kind:"waterway"},
  {name:"Hurmuz Bogazi", x:342, y:206, visited:false, kind:"waterway"},
  {name:"Babulmendep", x:282, y:218, visited:false, kind:"waterway"},
  {name:"Malakka Bogazi", x:344, y:162, visited:false, kind:"waterway"},
  {name:"Sunda Bogazi", x:350, y:186, visited:false, kind:"waterway"},
  {name:"Lombok Bogazi", x:360, y:194, visited:false, kind:"waterway"},
  {name:"Dover Bogazi", x:34, y:24, visited:false, kind:"waterway"},
  {name:"Bonifacio Bogazi", x:68, y:138, visited:false, kind:"waterway"},
  {name:"Kerch Bogazi", x:234, y:38, visited:false, kind:"waterway"},
  {name:"Tayvan Bogazi", x:386, y:116, visited:false, kind:"waterway"},
  {name:"Tsugaru Bogazi", x:414, y:66, visited:false, kind:"waterway"},
  {name:"Kore Bogazi", x:404, y:84, visited:false, kind:"waterway"},
  {name:"Torres Bogazi", x:396, y:210, visited:false, kind:"waterway"},
  {name:"Macellan Bogazi", x:34, y:252, visited:false, kind:"waterway"},
  {name:"Bering Bogazi", x:430, y:12, visited:false, kind:"waterway"},
  {name:"Mississippi Nehri", x:36, y:128, visited:false, kind:"waterway"},
  {name:"Amazon Nehri", x:48, y:214, visited:false, kind:"waterway"},
  {name:"Ren Nehri", x:30, y:20, visited:false, kind:"waterway"},
  {name:"Tuna Nehri", x:146, y:72, visited:false, kind:"waterway"},
  {name:"Elbe Nehri", x:40, y:12, visited:false, kind:"waterway"},
  {name:"Hudson Nehri", x:60, y:64, visited:false, kind:"waterway"},
  {name:"Yangtze Nehri", x:392, y:78, visited:false, kind:"waterway"},
  {name:"Mekong Nehri", x:368, y:154, visited:false, kind:"waterway"},
  {name:"Nijer Nehri", x:88, y:178, visited:false, kind:"waterway"},
  {name:"Basra Korfezi", x:344, y:214, visited:false, kind:"waterway"},
  {name:"Aden Korfezi", x:274, y:218, visited:false, kind:"waterway"},
  {name:"Akabe Korfezi", x:240, y:194, visited:false, kind:"waterway"},
  {name:"Meksika Korfezi", x:24, y:134, visited:false, kind:"waterway"},
  {name:"Gine Korfezi", x:88, y:188, visited:false, kind:"waterway"},
  {name:"Finlandiya Korfezi", x:92, y:12, visited:false, kind:"waterway"},
  {name:"Biskay Korfezi", x:10, y:70, visited:false, kind:"waterway"},
  {name:"Aslan Korfezi", x:34, y:96, visited:false, kind:"waterway"},
  {name:"Umman Korfezi", x:352, y:198, visited:false, kind:"waterway"},
];

let shipPosition = {x:85, y:130};
let routeHistory = [{x:85,y:130}];
let visitedPorts = new Set(["İzmir"]);

function openMap(){
  document.getElementById('map-panel').classList.add('show');
  renderMap();
}
function closeMap(){ document.getElementById('map-panel').classList.remove('show'); }

function updateShipPosition(sceneLoc){
  const locMap = {
    'İzmir':{x:85,y:130}, 'Çanakkale Boğazı':{x:130,y:100},
    'İstanbul Boğazı':{x:180,y:85}, 'Pire':{x:120,y:160},
    'Ambarli':{x:172,y:92}, 'Malta':{x:95,y:175}, 'Valensiya':{x:22,y:108},
    'Cebelitarık':{x:8,y:120}, 'Algeciras':{x:10,y:125},
    'İskenderiye':{x:200,y:210}, 'Port Said':{x:228,y:200},
    'Kıbrıs':{x:170,y:170},
    'Cenova':{x:60,y:80}, 'Barselona':{x:30,y:100}, 'Trieste':{x:102,y:52},
    'Haifa':{x:212,y:188}, 'Rotterdam':{x:25,y:18}, 'Mersin':{x:180,y:180},
    'Aden':{x:300,y:230}, 'Süveyş':{x:250,y:195}, 'Suveys':{x:245,y:212},
    'Marsilya':{x:40,y:92}, 'Napoli':{x:88,y:120}, 'Hamburg':{x:42,y:10},
    'Limasol':{x:176,y:172}, 'Cidde':{x:260,y:210}, 'Dubai':{x:336,y:218},
    'Tanger Med':{x:6,y:118}, 'Anvers':{x:28,y:14}, 'Singapur':{x:350,y:166},
    'Şanghay':{x:392,y:78}, 'Panama':{x:18,y:170}, 'New Orleans':{x:36,y:128},
    'Santos':{x:58,y:236}, 'Yokohama':{x:414,y:86}, 'Panama Kanali':{x:22,y:172},
    'Kiel Kanali':{x:46,y:8}, 'Korint Kanali':{x:118,y:154}, 'St. Lawrence':{x:46,y:56},
    'Hurmuz Bogazi':{x:342,y:206}, 'Babulmendep':{x:282,y:218}, 'Malakka Bogazi':{x:344,y:162},
    'Sunda Bogazi':{x:350,y:186}, 'Lombok Bogazi':{x:360,y:194}, 'Dover Bogazi':{x:34,y:24},
    'Bonifacio Bogazi':{x:68,y:138}, 'Kerch Bogazi':{x:234,y:38}, 'Tayvan Bogazi':{x:386,y:116},
    'Tsugaru Bogazi':{x:414,y:66}, 'Kore Bogazi':{x:404,y:84}, 'Torres Bogazi':{x:396,y:210},
    'Macellan Bogazi':{x:34,y:252}, 'Bering Bogazi':{x:430,y:12}, 'Mississippi Nehri':{x:36,y:128},
    'Amazon Nehri':{x:48,y:214}, 'Ren Nehri':{x:30,y:20}, 'Tuna Nehri':{x:146,y:72},
    'Elbe Nehri':{x:40,y:12}, 'Hudson Nehri':{x:60,y:64}, 'Yangtze Nehri':{x:392,y:78},
    'Mekong Nehri':{x:368,y:154}, 'Nijer Nehri':{x:88,y:178}, 'Basra Korfezi':{x:344,y:214},
    'Aden Korfezi':{x:274,y:218}, 'Akabe Korfezi':{x:240,y:194}, 'Meksika Korfezi':{x:24,y:134},
    'Gine Korfezi':{x:88,y:188}, 'Finlandiya Korfezi':{x:92,y:12}, 'Biskay Korfezi':{x:10,y:70},
    'Aslan Korfezi':{x:34,y:96}, 'Umman Korfezi':{x:352,y:198},
  };
  for(const [key,pos] of Object.entries(locMap)){
    if(sceneLoc && sceneLoc.includes(key)){
      shipPosition = {x:pos.x, y:pos.y};
      routeHistory.push({...pos});
      visitedPorts.add(key);
      break;
    }
  }
}

function renderMap(){
  const svg = document.getElementById('map-svg');
  const legend = document.getElementById('map-legend');
  const region =
    shipPosition.x >= 405 ? 'KUZEY PASIFIK / JAPONYA' :
    shipPosition.x >= 372 ? 'DOGU ASYA' :
    shipPosition.x >= 330 && shipPosition.y < 190 ? 'GUNEYDOGU ASYA' :
    shipPosition.x >= 320 ? 'BASRA KORFEZI / ARAP DENIZI' :
    shipPosition.x >= 245 ? 'KIZILDENIZ / HINT OKYANUSU GIRISI' :
    shipPosition.x < 70 && shipPosition.y > 220 ? 'GUNEY AMERIKA' :
    shipPosition.x < 70 && shipPosition.y > 120 ? 'AMERIKA / KARAYIPLER' :
    shipPosition.x < 70 && shipPosition.y <= 120 ? 'ATLANTIK / BATI AVRUPA' :
    (shipPosition.y <= 22 || (shipPosition.x < 95 && shipPosition.y < 30)) ? 'KUZEY DENIZI / BALTIK' :
    shipPosition.y < 62 && shipPosition.x >= 180 ? 'KARADENIZ / AZAK' :
    shipPosition.y < 88 && shipPosition.x >= 120 ? 'TURK BOGAZLARI / ADRIYATIK' :
    shipPosition.x < 150 ? 'ORTA AKDENIZ' :
    'DOGU AKDENIZ';
  const regionFill =
    region==='ORTA AKDENIZ' ? '#03101d' :
    region==='TURK BOGAZLARI / ADRIYATIK' ? '#041320' :
    region==='KARADENIZ / AZAK' ? '#061626' :
    region==='KUZEY DENIZI / BALTIK' ? '#071725' :
    region==='ATLANTIK / BATI AVRUPA' ? '#031420' :
    region==='AMERIKA / KARAYIPLER' ? '#041726' :
    region==='GUNEY AMERIKA' ? '#071724' :
    region==='KIZILDENIZ / HINT OKYANUSU GIRISI' ? '#10161f' :
    region==='BASRA KORFEZI / ARAP DENIZI' ? '#121722' :
    region==='GUNEYDOGU ASYA' ? '#071a20' :
    region==='DOGU ASYA' ? '#081821' :
    region==='KUZEY PASIFIK / JAPONYA' ? '#0a1824' :
    '#04111b';
  let s = `<rect width="440" height="260" fill="${regionFill}" rx="6"/>`;
  // Sea texture
  for(let i=0;i<8;i++){
    s+=`<path d="M${i*60} ${80+i*20} Q${i*60+30} ${75+i*20} ${i*60+60} ${80+i*20}" fill="none" stroke="#0a2448" stroke-width="1" opacity=".4"/>`;
  }
  // Land masses (simplified Mediterranean)
  s+=`<path d="M0 60 Q50 40 100 50 Q150 45 200 60 Q250 55 300 70 Q350 65 400 80 L440 85 L440 0 L0 0 Z" fill="#071828" opacity=".7"/>`;
  s+=`<path d="M0 260 Q60 240 120 250 Q180 245 240 255 Q300 248 360 258 L440 255 L440 160 Q400 170 350 165 Q300 160 250 170 Q200 175 150 168 Q100 162 50 170 Q20 175 0 168 Z" fill="#071828" opacity=".5"/>`;
  // Italy/Greece simplified
  s+=`<path d="M120 90 Q130 100 125 115 Q120 125 115 120 Q110 110 115 95 Z" fill="#0a1e2e" opacity=".6"/>`;
  s+=`<path d="M80 70 Q95 65 100 75 Q98 85 90 82 Q82 78 80 70 Z" fill="#0a1e2e" opacity=".6"/>`;
  s+=`<path d="M18 118 Q68 98 132 110 Q210 126 272 120 Q346 112 420 124" fill="none" stroke="#184878" stroke-width="1.2" stroke-dasharray="6,5" opacity=".45"/>`;
  s+=`<path d="M152 82 Q194 70 236 76 Q286 83 348 78" fill="none" stroke="#1c5a92" stroke-width="1" stroke-dasharray="4,4" opacity=".35"/>`;
  s+=`<circle cx="${120*4.4}" cy="${160*2.6}" r="11" fill="none" stroke="#d4a017" stroke-width="1" opacity=".18"/>`;
  s+=`<circle cx="${200*4.4}" cy="${210*2.6}" r="11" fill="none" stroke="#d4a017" stroke-width="1" opacity=".18"/>`;
  s+=`<circle cx="${95*4.4}" cy="${175*2.6}" r="11" fill="none" stroke="#d4a017" stroke-width="1" opacity=".18"/>`;

  // Route line
  if(routeHistory.length > 1){
    let d = `M${routeHistory[0].x*4.4} ${routeHistory[0].y*2.6}`;
    for(let i=1;i<routeHistory.length;i++){
      d += ` L${routeHistory[i].x*4.4} ${routeHistory[i].y*2.6}`;
    }
    s+=`<path d="${d}" fill="none" stroke="#2e6bbf" stroke-width="1.5" stroke-dasharray="5,3" opacity=".7"/>`;
  }

  // Ports
  ROUTE_PORTS.forEach(p => {
    const px = p.x*4.4, py = p.y*2.6;
    const visited = visitedPorts.has(p.name);
    const color = p.kind==='waterway' ? (visited ? '#d4a017' : '#6cbbe0') : (visited ? '#5dbf8a' : '#2e6bbf');
    if(p.kind==='waterway'){
      const sz = visited ? 5 : 3.5;
      s+=`<path d="M${px} ${py-sz} L${px+sz} ${py} L${px} ${py+sz} L${px-sz} ${py} Z" fill="${color}" opacity="${visited?1:.75}"/>`;
    }else{
      s+=`<circle cx="${px}" cy="${py}" r="${visited?5:3}" fill="${color}" opacity="${visited?1:.6}"/>`;
    }
    s+=`<text x="${px+7}" y="${py+4}" fill="${color}" font-size="8" font-family="monospace" opacity="${visited?1:.7}">${p.name}</text>`;
    if(visited){
      s+=`<circle cx="${px}" cy="${py}" r="9" fill="none" stroke="${color}" stroke-width="1" opacity=".3"/>`;
    }
  });

  // Ship position
  const sx = shipPosition.x*4.4, sy = shipPosition.y*2.6;
  s+=`<circle cx="${sx}" cy="${sy}" r="5" fill="#d4a017"/>`;
  s+=`<path d="M${sx-4} ${sy} L${sx} ${sy-8} L${sx+4} ${sy} Z" fill="#d4a017"/>`;
  s+=`<circle cx="${sx}" cy="${sy}" r="10" fill="none" stroke="#d4a017" stroke-width="1" opacity=".5" class="blink"/>`;
  s+=`<text x="${sx+12}" y="${sy+4}" fill="#d4a017" font-size="8" font-family="monospace">${sn||'Gemi'}</text>`;
  s+=`<text x="12" y="16" fill="#8ab0c8" font-size="8" font-family="monospace" opacity=".85">${region}</text>`;
  s+=`<path d="M28 214 h26 l7 3 h7 v2 h-40 z" fill="#0c1b2d" opacity=".8"/>`;
  s+=`<rect x="35" y="207" width="10" height="7" rx="1" fill="#184878" opacity=".9"/>`;
  s+=`<path d="M362 68 h22 l7 3 h6 v2 h-35 z" fill="#0c1b2d" opacity=".65"/>`;

  svg.innerHTML = s;
  legend.textContent = `🟢 Uğranan liman  🔵 Planlanan liman  🔷 Kanal/bogaz/nehir/korfez  🟡 ${sn||'Gemimiz'}  — ${visitedPorts.size} nokta işlendi`;
}

// ===== SEYİR GÜNLÜĞİ =====
let journalEntries = [];
const seenColregHints = new Set();
const STUDENT_NOTES = [
  {head:"KOPRUUSTU VARDIYASI", body:"Look-out, COLREG, rota takibi, ECDIS kontrolu, radar cross-check ve logbook disiplini vardiyanin omurgasidir.<br>Vardiya devrinde rota, trafik, hava, makina durumu ve beklenen manevra net aktarilir.<br>Master'in standing orders ve night orders'i bilinmeden vardiya tutulmaz.", tip:"Once gozlem, sonra yorum."},
  {head:"ANA KURALLAR", body:"Sormadan varsayma.<br>Gormeden dogru kabul etme.<br>Hata gordugunde saklama, amire bildir.<br>PPE'siz ise baslama.<br>Snap-back zone'a girme.<br>Kapali mahalde permitsiz girme.<br>Stop komutu duyuldugunda herkes durur.<br>Near-miss de raporlanir.", tip:"Denizcilikte disiplin tekrar degil, hayatta kalma bicimidir."},
  {head:"OLCU BIRIMLERI - DENIZCILIK", body:"<b>1 deniz mili (NM)</b> = 1852 metre<br><b>1 knot (kt)</b> = saatte 1 deniz mili = 1.852 km/saat<br><b>1 kablo (cable)</b> = 0.1 deniz mili = 185.2 metre<br><b>1 kulac (fathom)</b> = 6 feet = 1.8288 metre<br><b>1 feet (ft)</b> = 0.3048 metre<br><b>1 inch</b> = 2.54 cm<br><b>1 metre</b> = 100 cm<br><b>1 santimetre</b> = 10 mm<br><b>1 ton</b> = 1000 kg<br><b>1 long ton</b> = 1016 kg yaklasik<br><b>1 short ton</b> = 907 kg yaklasik<br><b>DWT</b> = Deadweight tonnage; geminin tasiyabilecegi toplam agirlik kapasitesi<br><b>GT</b> = Gross Tonnage; hacim esasli tonaj olcusudur, agirlik degildir<br><b>TEU</b> = 20 feet'lik bir konteyner birimi<br><b>20 ft</b> = 6.096 metre<br><b>40 ft</b> = 12.192 metre<br><b>m3</b> = hacim birimi; tank, ambar ve stowage hesaplarinda kullanilir<br><b>t/m3</b> veya <b>kg/m3</b> = yogunluk birimi; draft survey, ballast ve yakit hesaplarinda gorulur<br><b>ppm</b> = millionda bir; OWS, su kalitesi ve gaz olcumlerinde gorulur<br><b>%LEL</b> = patlayici alt limit yuzdesi; gaz olcumlerinde kullanilir<br><b>bar</b> = basinÃ§ birimi; 1 bar yaklasik 100 kPa'dir<br><b>kW</b> = guc birimi; makine ve jeneratorde kullanilir<br><b>RPM</b> = dakikadaki devir sayisi; ana makine ve pompada gorulur<br><br><b>Pratik not:</b> Seyirde mesafe deniz miliyle, hiz knot ile, draft metre veya feet ile, yuk agirligi ton ile okunur.", tip:"Ayni soruda metre, feet, ton ve deniz mili bir araya gelebilir; birim karisinca hesap da karar da bozulur."},
  {head:"COLREG OZETI", body:"<b>Rule 5</b> proper look-out: goz, kulak, radar/AIS ve tum mevcut imkanlarla takip yapilir.<br><b>Rule 6</b> safe speed: gorus, trafik, draft, manevra ve sensor sinirlariyla birlikte degerlendirilir.<br><b>Rule 7</b> risk of collision: suphe varsa risk var kabul edilir; sabit kerteriz ve dusen CPA ciddiye alinir.<br><b>Rule 8</b> action to avoid collision: manevra erken, belirgin ve iyi denizcilige uygun olur.<br><b>Rule 9</b> dar kanal: sancak sinirina yakin seyredilir, gecis gereksiz engellenmez.<br><b>Rule 10</b> traffic separation scheme: serit disiplini korunur, akisi bozacak gecislerden kacinilir.<br><b>Rule 13</b> overtaking: yetisen gemi yol verir.<br><b>Rule 14</b> head-on: iki gemi de sancaga duser.<br><b>Rule 15</b> crossing: sancaginda gemi goruyorsan give-way sensin.<br><b>Rule 18</b> sorumluluk hiyerarsisi: NUC, RAM, CBD, fishing, sailing ve power-driven iliskisi birlikte okunur.<br><b>Rule 19</b> restricted visibility: safe speed, radar yorumu ve fog signal disiplini artar.", tip:"COLREG ezber listesi degil; durumu dogru okuyup erken davranma sanatidir."},
  {head:"ECDIS / HARITA", body:"Route check, safety contour, safety depth, no-go area, isolated danger ve alarm ayarlari seyirden once gozden gecirilir.<br>GPS bilgisi radar, gorusel mevki ve diger sensorlerle capraz kontrol edilir.<br><b>GPS quality control</b>: pozisyon kaynagi saglikli mi; DGPS/GNSS durumu, HDOP/PDOP, RAIM uyari mantigi, anten ofseti, sensor input secimi, position jump, COG/SOG tutarliligi ve secondary position source birlikte izlenir.<br>Waypoint'ler, parallel indexing, XTD ve chart correction mantigi bilinmelidir.<br>Kagit haritada NtM, correction number, tracing ve correction record disiplini; ECDIS'te ise ENC permit, cell status, latest update ve overdue area kontrolu birlikte dusunulur.<br>Rota degisikligi varsa passage plan, kagit harita, ECDIS route ve logbook ayni mantikla guncellenir.", tip:"ECDIS yardimcidir; kagit harita dusuncesiyle birlikte kullanildiginda daha guclu olur."},
  {head:"FENER VE SAMANDIRA", body:"IALA lateral markalarda renk, tepe isareti ve isik karakteri birlikte okunur.<br>Fl, Oc, Iso, Q, VQ, LFl ve sektor renkleri fenerleri ayirt etmeyi saglar.<br>Cardinal marklarda kuzey-gu ney-dogu-bati tepe isaretleri ve siyah-sari renk dizilimi ezberlenmelidir.", tip:"Renk kadar ritmi de oku."},
  {head:"PILOT / ROMORKOR / LIMAN", body:"Pilot ladder durumu, can simidi ve isik kontrolu, personel konumu ve haberlesme disiplini kritik konulardir.<br>Master-pilot exchange yapilir; snap-back zone bos tutulur.<br>Heaving line, tug line, berthing plan, current-rüzgar etkisi ve mooring team konumlari net olmalidir.<br><br><b>Tipik yanasma halat sirasi</b> (gemi plani, ruzgar/akinti ve kaptan-pilot talimatina gore degisebilir):<br><b>1.</b> Ilk emniyet halati genelde <b>fore spring</b> ya da bazen <b>head line</b> olur; geminin ileri-geri kacmasini erken kontrol etmek icin.<br><b>2.</b> Ardindan <b>head line</b> veya karsilikli olarak <b>stern line</b> verilir.<br><b>3.</b> Sonra <b>aft spring</b> tamamlanir; geminin boyuna hareketi daha iyi tutulur.<br><b>4.</b> Daha sonra <b>breast line</b>lar verilir; gemiyi rihtima paralel ve yakinda tutar.<br><b>5.</b> En sonda ince ayar yapilip tum halatlar esit yuk dagitacak sekilde bos alinir, volta edilir ve <b>all fast</b> durumu kurulur.<br><br><b>Halatlarin gorevi</b>:<br><b>Head line / stern line</b> basi ve kici ileri-geri tutar.<br><b>Spring</b> geminin boyuna kaymasini keser.<br><b>Breast line</b> gemiyi rihtima dogru ceker ve borda acisini tutar.", tip:"Mooring station saka kabul etmez; ama halat sirasi da ezber degil, plan isidir."},
  {head:"DUNYA GECITLERI / SU YOLLARI", body:"<b>Kanallar</b>: Suveys, Panama, Kiel, Korint, St. Lawrence.<br><b>Bogazlar</b>: Cebelitarik, Istanbul, Canakkale, Hurmuz, Babulmendep, Malakka, Sunda, Lombok, Dover, Bonifacio, Kerch, Tayvan, Kore, Tsugaru, Torres, Macellan, Bering.<br><b>Nehirler</b>: Mississippi, Amazon, Ren, Tuna, Elbe, Hudson, Yangtze, Mekong, Nijer.<br><b>Korfezler</b>: Basra, Aden, Akabe, Meksika, Gine, Finlandiya, Biskay, Aslan, Umman.<br><br>Her gecitte draft, akinti, pilotaj, VTS, reporting point, tug gereksinimi ve hava penceresi farklidir.", tip:"Her su yolu ayni degil; bazisi draft ister, bazisi raporlama, bazisi da sadece iyi zamanlama ister."},
  {head:"GEMININ KISIMLARI", body:"<b>Pruva</b> geminin on tarafidir; <b>Kic</b> arka tarafidir.<br><b>Iskele</b> sol, <b>Sancak</b> sag bordadir.<br><b>Bas bodoslama</b> on dikey/egik uc yapisidir; <b>Kic bodoslama</b> arka uc yapisidir.<br><b>Ana guverte</b> ana yuru yus ve calisma guvertesidir.<br><b>Bas kasarasi / forecastle</b> pruva tarafindaki yuksek bolumdur; <b>Kic ustu / poop deck</b> kic tarafindaki yuksek bolumdur.<br><b>Kopruustu</b> geminin sevk ve idaresinin yapildigi mahaldir.<br><b>Ambar</b> yukun tasindigi kapali hacimdir; <b>Hatch cover</b> ambar kapagidir.<br><b>Makine dairesi</b> ana makine ve yardimci sistemlerin bulundugu mahaldir.<br><b>Borda</b> geminin yan tarafidir; <b>alabanda</b> bunun ic yuzune verilen addir.<br><b>Omurga</b> teknenin ana boyuna omurgasal tasiyici hattidir.<br><b>Draft markalari</b> bas ve kicta su cekimini okumaya yarar.<br><b>Bulwark / sancaklik</b> guverte kenarindaki koruyucu yukselti veya korkuluk hattidir.<br><b>Hawse pipe / demir locasi</b> demir zincirinin gectigi yapidir.<br><br>"+buildShipPartsDiagram(), tip:"Gemi dili once yone, sonra mahale, sonra ekipmana oturur."},
  {head:"LIMAN VE EVRAK", body:"Notice of Readiness, Bill of Lading, Mate's Receipt, Statement of Facts, manifest, stowage plan, Oil Record Book ve Garbage Record Book temel evraklardandir.<br>Uyumsuzluk gordugunde amire hemen bildirilir.<br>Laytime, demurrage, dispatch, arrival condition ve sea protest temel kavramlardir.", tip:"Saklanan hata buyur."},
  {head:"PSC / ISPS / SOLAS / STCW", body:"PSC denetiminde evrak, emniyet ekipmani, drill kayitlari, GMDSS testleri ve gemi kondisyonu birlikte incelenir.<br>ISPS tarafinda gangway kontrolu, ziyaretci kaydi ve security level takibi esastir.<br>SOLAS can emniyeti, STCW yeterlilik ve vardiya standartlarini kurar.", tip:"Denetime her gun hazir olunur."},
  {head:"LSA / FILIKA / MATAFORA BAKIMI", body:"Can salinda servis tarihi, hydrostatic release unit (HRU), painter, lash ve konteyner kondisyonu kontrol edilir.<br>Can filikasinda inventory, drain plug, battery, engine readiness, communication set, water/ration ve release gear gozden gecirilir.<br>Can yeleklerinde light, whistle, tape, buddy line ve genel kondisyon; immersion suitte size, zipper ve sizdirmazlik mantigi okunur.<br>Matafora ve launching appliance tarafinda fall, sheave, brake, grease noktasi, limit switch ve hareket testi birlikte dusunulur.<br>Pyrotechnics, line-throwing appliance, EPIRB, SART ve handheld VHF tarih/kayit/ready durumu unutulmaz.", tip:"Acil durum ekipmani en cok lazim oldugu gun surpriz cikarmamali."},
  {head:"TATBIKATLAR / DRILL MANTIGI", body:"<b>Fire drill</b>: alarm, muster, mahal teyidi, boundary cooling, fire party, communication ve sayim zinciri kurulur.<br><b>Abandon ship drill</b>: muster list, can yelekleri, kisi sayimi, filika/can sali hazirligi ve komut zinciri uygulanir.<br><b>MOB drill</b>: bagir, tarafi isaretle, goz temasini kaybetme, alarm ve manevra zincirini baslat.<br><b>Rescue boat drill</b>: hook, painter, PPE, engine readiness ve recovery plani birlikte kontrol edilir.<br><b>Oil spill drill</b>: kaynak izolasyonu, scupper kapama, spill kit, absorbent ve raporlama birlikte gider.<br><b>Emergency steering drill</b>: kopru komutu, yerel tekrar, dumen aci teyidi ve haberlesme temiz olmali.<br><b>Enclosed space rescue drill</b>: permit, gas reading, attendant, rescue set ve standby ekip hazir tutulur.", tip:"Tatbikat ezber degil; gercek olay gelmeden koordinasyonu kas hafizasina indirme isidir."},
  {head:"YANGIN EKIPMANI NASIL KULLANILIR", body:"<b>Hydrant / hose / nozzle</b>: once uygun hydrant secilir, hortum serilir, nozzle ayari verilir, su hattina kademeli basinilir; ekip asla kontrolsuz su yemez.<br><b>Portable extinguisher</b>: pimi cek, tabana yonel, sweep hareketiyle kullan; ruzgar ve kacis yolu dusunulmeden girilmez.<br><b>CO2</b>: canli mahal veya enerjili panelde prosedursuz acilmaz; mahal izolasyonu ve personel sayimi hayati onemdedir.<br><b>Foam</b>: yanici sivilarda yuzeyi orterek oksijeni keser; kopugu dagitacak sert jet kullanilmaz.<br><b>Dry Powder</b>: hizli knock-down saglar ama gorusu bozar; elektrik ve gaz risklerinde senaryoya gore kullanilir.<br><b>Wet Chemical / Fire Blanket</b>: mutfak yag yanginlarinda ilk akla gelen medyalardandir; suyla tepki buyutulmez.<br><b>SCBA</b>: basinc, maske sizdirmazligi, demand valve, harness, alarm ve buddy check tamamlanmadan entry baslamaz.", tip:"Yanginda hiz onemlidir ama dogru medya ve dogru prosedur daha onemlidir."},
  {head:"ILK YARDIMDA ILK ADIMLAR", body:"<b>1. Sahayi emniyete al</b>: once kendini ve ortamı koru; elektrik, duman, gaz, dusme riski varsa kontrolsuz yaklasma.<br><b>2. Bilinc kontrolu</b>: sesli ve hafif dokunsal uyariyla tepki var mi bak.<br><b>3. Solunum ve hava yolu</b>: hava yolunu ac, normal solunum var mi degerlendir.<br><b>4. Yardim cagir</b>: amire, bridge'e veya medical support zincirine net bilgi ver.<br><b>5. Kanama kontrolu</b>: dogrudan basiyla durdurmaya calis; buyuk kanamada zaman kaybetme.<br><b>6. Yanikta</b>: uygun sogutma yap, yag/kimyasal/elektrik ayrimini dusun, rastgele krem-surme hatasina dusme.<br><b>7. Dumandan etkilenmede</b>: temiz hava, bilinç-solunum takibi ve ileri yardim zinciri onceliklidir.<br><b>8. Supheli kirik / dusme</b>: gereksiz oynatma; omurga veya boyun riski varsa sabitleyerek bekle.<br><b>9. Kayit</b>: saat, belirti ve yapilan ilk mudahale not edilir; gemide bilgi kaybolmasin.", tip:"Ilk yardim kahramanlik degil; sirayi bozmadan hayat fonksiyonlarini koruma isidir."},
  {head:"DEMIR ZINCIRI / KILIT MARKALARI", body:"Bir kilit / shackle genelde <b>15 fathom</b> yani yaklasik <b>27.5 metre</b> kabul edilir.<br>Zincir marking sisteminde joining shackle cevresindeki boyali baklalar ve tel sargilari hangi kilidin suda oldugunu hizlica anlamak icin kullanilir.<br>Gemiden gemiye renk ve tel duzeni degisebilir; esas olan geminin kendi <b>chain marking plan</b>ini bilmektir.<br>Pruva ustunde rapor verirken 'birinci kilit suya girdi', 'ucuncu kilit suya girdi' gibi net ve yuksek sesli ifade kullanilir.<br>Kaloma verirken sadece sayi degil; zincirin hizi, fren durumu ve davranisi da izlenir.", tip:"Ezber renk degil, gemide uygulanan marking sistemi esastir."},
  {head:"ACIL HABERLESME", body:"MAYDAY distress, PAN-PAN urgency, SECURITE emniyet yayini icindir.<br>Mesajda gemi adi, callsign, pozisyon, tehlikenin cinsi, yardim ihtiyaci ve kisi sayisi acik verilir.<br>GMDSS, EPIRB, SART, NAVTEX, DSC, handheld VHF ve emergency battery kayitlari bilinir.", tip:"Netlik hiz kadar onemlidir."},
  {head:"GMDSS / HABERLESME CIHAZLARI", body:"<b>VHF DSC</b> kisa mesafe distress / urgency / safety ve CH16 nobet disiplininin temelidir.<br><b>MF/HF DSC</b> daha uzak mesafe haberlesme ve uygun frekans secimiyle dusunulur.<br><b>NAVTEX</b> navigational ve meteorological warning alir; baski / printer / mesaj secimi onemlidir.<br><b>EGC / SafetyNET</b> genelde Inmarsat-C uzerinden MSI ve safety message alir.<br><b>Inmarsat-C</b> text tabanli haberlesme, distress, reporting ve mesajlasmada kullanilir.<br><b>EPIRB</b> acil durumda COSPAS-SARSAT uydu sistemine distress beacon gonderir.<br><b>SART</b> arama-kurtarmada radar cevaplayici olarak hedef bulunurlugunu artirir.<br><b>AIS</b> trafik farkindaligi ve hedef tanimlamada yardimcidir; radar ve gorsel teyidin yerine gecmez.<br><br><b>GMDSS Sea Areas</b>:<br><b>A1</b> VHF DSC kapsamasinda yakin denizler<br><b>A2</b> MF DSC kapsamasina kadar uzayan bolgeler<br><b>A3</b> Inmarsat kapsamasindaki acik denizler<br><b>A4</b> kutup / Inmarsat disi yuksek enlem alanlari; HF dusuncesi agir basar.<br><br><b>RCC/MRCC</b> distress sonrasinda arama-kurtarma koordinasyon zincirini yurutur.<br><b>Pratik mantik:</b> Hangi cihazin ne zaman, hangi menzilde ve hangi maksatla kullanilacagini bilmek gerekir.", tip:"Cihazi tanimak yetmez; hangi acilde hangisine uzanacagini da bil."},
  {head:"METEOROLOJI / BULUTLAR", body:"<b>Cumulus</b> gun icinde dikey gelisebilen pamuksu buluttur; hava iyi de olabilir ama buyurse shower'a gider.<br><b>Cirrus</b> ince ve tuy gibi ust seviye buz bulutudur; yaklasan front'un habercisi olabilir.<br><b>Stratus</b> alcak, yaygin ve tek katman gibi gorunur; gorus ve drizzle etkisi yaratabilir.<br><b>Nimbostratus</b> uzun sureli ve yaygin yagisin bulutudur.<br><b>Cumulonimbus (CB)</b> dikey gelisimi cok guclu firtina bulutudur; saganak, yildirim, squall ve ani ruzgar bekletir.<br><b>Barometer trendi</b>, ruzgar donusu ve bulut tipi birlikte okunur; tek bir buluta bakip kesin hukum verilmez.", tip:"Bulut gormek yetmez; hangi seviyede oldugunu ve neye donusebilecegini de dusun."},
  {head:"FORMULLER - HIZ / MESAFE / ZAMAN", body:"Mesafe = Hiz x Zaman<br>Hiz = Mesafe / Zaman<br>Zaman = Mesafe / Hiz<br>1 knot = 1 deniz mili / saat<br>Gece ETA hesaplari icin once kalan mesafe, sonra mevcut SOG kullanilir.<br><br><b>Ornek:</b> 48 mil yol, 12 knot hizla yaklasik 4 saatte biter.", tip:"Basit formuller vardiyada en cok kullanilanlardir."},
  {head:"FORMULLER - SET / DRIFT / CTS", body:"Course to Steer mantigi: istenen COG icin akinti vektorunu hesaba kat.<br>Drift = akintinin hizi<br>Set = akintinin yonu<br>Gercek iz = verilen rota + akinti etkisi<br>Yaklasik kapanis mantigi: Verilen HDG + akinti vektoru = gercek COG/SOG<br>Running fix / DR duzeltmelerinde set-drift sure ile birlikte okunur.<br><b>Yaklasik akis:</b> Akinti mesafesi = drift x zaman<br><b>ETA</b> icin kalan mesafe / gercek SOG mantigi kullanilir.<br><b>Kullanilan tablo / kaynaklar:</b> Tidal stream atlas, current tables, pilot book, chart notlari, ECDIS current overlay, sailing directions.<br><br><b>Ornek:</b> 090 rota tutmak isterken akinti seni kuzeye 2 knot itiyorsa bir miktar guneye pruva verip CTS duzeltmesi yaparsin.", tip:"Pruva baska, iz baska olabilir."},
  {head:"FORMULLER - KLASIK SEYIR / PLANE SAILING", body:"<b>D'Lat = Dist x cos C</b><br><b>Departure = Dist x sin C</b><br><b>D'Long (dakika) = Departure / cos orta enlem</b><br><b>Orta enlem = (Lat1 + Lat2) / 2</b><br>Plane sailing kisa mesafelerde kullanilir; Mercator sailing ve middle latitude mantigi burada devreye girer.<br><br><b>Kuzey/Guney, Dogu/Bati isaretleri</b> hesap kadar onemlidir.<br><b>Traverse table</b> kullanilirken cos/sin sonucu North-South ve East-West olarak okunur.<br><br><b>Ornek:</b> 120 mil, rota 060 ise D'Lat = 120 x cos60 = 60 mil; Departure = 120 x sin60 yaklasik 104 mildir.", tip:"Kisa rota problemlerinde en klasik omurga budur."},
  {head:"FORMULLER - MERCATOR / MIDDLE LATITUDE", body:"<b>Middle Latitude Sailing</b>: D'Long = Departure / cos orta enlem mantigiyla kurulur.<br><b>Mercator Sailing</b>: True course icin meridional parts kullanilir.<br><b>Tan C = D'Long in meridional parts / D'Lat</b> benzeri mantikla rota bulunur.<br><b>Distance = D'Lat / cos C</b> veya uygun trigonometrik yoldan geri cozulur.<br>Yuksek enlemlerde plain plane sailing yerine Mercator dusuncesi daha saglamdir.<br><br><b>Kullanilan tablo / kaynaklar:</b> meridional parts tables, traverse table, chartwork plotting sheet, nautical tables.", tip:"Formul kadar hangi seyir turunu sececegin de onemlidir."},
  {head:"FORMULLER - GREAT CIRCLE / COMPOSITE", body:"<b>Great circle</b> iki nokta arasindaki en kisa mesafeyi verir; ama rota acisi surekli degisir.<br><b>Rhumb line</b> sabit rota ile gider; genelde daha pratiktir ama mesafe biraz uzayabilir.<br><b>Composite sailing</b> yuksek enlem buz/tehlike siniri nedeniyle sinirli enlem uzerinden great circle dusuncesinin parcali uygulanmasidir.<br><b>Vertex</b> great circle rotasinin en yuksek enleme ciktigi noktadir.<br><b>Pratik kullanilan degerler</b>: initial course, final course, vertex latitude, great circle distance.<br><br><b>Kullanilan kaynaklar:</b> great circle sailing tables, routeing software, gnomonic chart, nautical almanac yardimci cetveller, ECDIS route planning tools.<br><br><b>Pratik not:</b> Uzun okyanus gecislerinde 'en kisa rota' her zaman 'en guvenli rota' anlamina gelmez; hava, akinti ve restricted area birlikte okunur.", tip:"Buyuk daire formulu kadar hangi rotanin uygulanabilir oldugu da denizciliktir."},
  {head:"FORMULLER - PUSULA / KERTERIZ DUZELTMELERI", body:"<b>T = M + Var</b> ve <b>M = C + Dev</b> mantigi temel omurgadir.<br><b>True = Compass + Deviation + Variation</b> kisaca <b>T = C + d + v</b> diye tutulabilir; isaretler East/West olarak dogru uygulanir.<br><b>Relative bearing</b> = hedef kerterizi gemi basina gore acidir; <b>True bearing = heading + relative bearing</b> mantigiyle acilir ve 360 icinde normalize edilir.<br><b>Gyro error</b> varsa <b>True = Gyro + Gyro error</b> mantigi kurulur.<br><br><b>Ornek:</b> Compass 072, deviation 2E, variation 3W ise True = 72 + 2 - 3 = 071 bulunur.<br><br><b>Kullanilan tablo / kaynaklar:</b> deviation card, compass observation book, azimuth tables, amplitude tables, pelorus/bearing repeater.", tip:"Hesaptaki en klasik hata dogu-bati isaretini ters okumaktir."},
  {head:"FORMULLER - MANEVRA / DONUS", body:"<b>ROT (deg/dk)</b> yaklasik donus hizidir; buyudukce donus daha serttir.<br><b>Radyan/saniye</b> cinsinden ROT biliniyorsa <b>Turn radius R ~ V / omega</b> mantigi kullanilir.<br><b>Advance</b>: gemi donuse basladiktan sonra eski rota dogrultusunda ileri gittigi mesafe.<br><b>Transfer</b>: donus sirasinda rota dikine yan otelenme mesafesi.<br><b>Tactical Diameter</b>: gemi 180 dereceye yakin dondugunde ilk rota hattina gore olusan toplam transfer buyuklugu.<br><b>Stopping distance</b> sabit tek sayi degil; hiz, draft, yuk, ruzgar, akinti ve makina cevabina baglidir.<br><b>Squat</b> yaklasik olarak hiz arttikca ve su siglastikca artar; pratikte UKC hesabina ceza gibi eklenir.<br><br><b>Ornek:</b> Ayni gemi 8 knot ile baska, 14 knot ile baska advance ve transfer verir; bu yüzden wheel-over point sabit ezberlenmez.", tip:"Manevra formulu kadar geminin pilot card / turning circle verisi de esastir."},
  {head:"FORMULLER - RADAR / CPA / TCPA", body:"<b>Yaklasik kapanma hizi</b> = bagil hareketten gelir; sadece senin hizina bakilmaz.<br><b>TCPA</b> hedefin en yakin gecise kac dakika kaldigini verir.<br><b>CPA</b> en yakin gecis mesafesidir.<br>Daha analitik gosteri ile <b>TCPA = - (r.v) / |v|²</b> mantigi, <b>CPA</b> ise bagil vektorun o andaki en yakin uzakligidir.<br>Pratik vardiyada ise ARPA trendi, sabit kerteriz ve dusen CPA birlikte okunur.<br><b>NM/dk</b> icin hiz/60 kullanilabilir; 12 knot = dakikada 0.2 mil gibi.<br><br><b>Ornek:</b> 12 dakikada CPA 0.6 nm ise hedefi 'uzak' sanmak yerine trendi ciddiye almak gerekir.", tip:"Radar formulu kağıtta biter; asıl karar trend yorumunda başlar."},
  {head:"FORMULLER - GEL-GIT / UKC", body:"UKC = Mevcut su derinligi - gemi drafti<br>Mevcut su derinligi = charted depth + tide height<br>Tide height high water ve low water verisiyle bulunur.<br>Dar suda squat de hesaba katilmalidir.<br>Air draft mantigi: kopru alti acikligi - mevcut air draft = emniyet payi<br><br><b>Ornek:</b> Harita derinligi 12.0 m, gel-git 1.4 m ve draft 10.2 m ise UKC = 13.4 - 10.2 = 3.2 m olur.", tip:"Kagittaki derinlik her zaman o anki derinlik degildir."},
  {head:"FORMULLER - STABILITE", body:"tan(theta) = heeling moment / (displacement x GM)<br>Trim change = trimming moment / MCTC<br>Corrected GM = GM - FSC/displacement veya GM - FSC (metre cinsinden verilmisse)<br>Shift of G formu: GG1 = (w x d) / Delta<br>FWA mantigi: tatli suya girince draft artar; yogunluk dusunce gemi daha fazla batar<br><br><b>Ornek:</b> 20 ton yuk 4 m kayar, deplasman 8000 ton ve GM 1.0 m ise tan(theta) = 80 / 8000 = 0.01, yani yatma acisi yaklasik 0.57 derece olur.", tip:"Stabilite rakam degil, geminin davranisidir."},
  {head:"FORMULLER - GM", body:"GM = KM - KG<br>KG yuk merkezi yuksekligidir; yuk yukari cikarsa KG artar, GM genelde dusme egilimi gosterir.<br>GG1 = (w x d) / Delta ile agirlik kaydirmasinin G noktasini ne kadar oynattigi bulunur.<br>Kucuk aci yaklasiminda GZ ~ GM x sin(theta) dusunulebilir.<br><br><b>Ornek:</b> KM 7.4 m ve KG 6.1 m ise GM = 1.3 m olur. 10 tonluk bir yuk 5 m kayarsa, deplasman 5000 ton icin GG1 = 50 / 5000 = 0.01 m bulunur.", tip:"GM tek basina her seyi anlatmaz ama ilk stabilitenin kalbidir."},
  {head:"FORMULLER - ILERI STABILITE", body:"Heeling moment = w x d<br>Righting moment = displacement x GZ<br>Trim moment = w x boyuna mesafe<br>Trim change = trimming moment / MCTC<br>Free surface correction buyudukce corrected GM duser.<br><br><b>Ornek:</b> 30 ton yuk 20 m basa alinirsa trimming moment 600 ton-metre olur. MCTC 120 ise trim degisimi yaklasik 5 cm olur.", tip:"Moment dili oturunca stabilite sorulari daha okunur hale gelir."},
  {head:"FORMULLER - HYDROSTATIC / DRAFT", body:"<b>TPC</b> = Tonnes Per Centimetre immersion; 1 cm draft degisimi icin gereken ton miktari.<br><b>Draft degisimi (cm) = yuk miktari / TPC</b><br><b>MCTC</b> = 1 cm trim degisikligi icin gereken trimming moment.<br><b>Trim degisimi (cm) = trimming moment / MCTC</b><br><b>FWA</b> tatli suya girince draft artisini anlatir.<br><b>DWA</b> gercek yogunluk farkina gore FWA'nin oransal uygulanmasidir.<br><b>Parallel rise/fall</b> tum draftlarin birlikte artip azalmasi gibi dusunulur.<br><br><b>Ornek:</b> TPC 18 ise 180 ton yuk drafti yaklasik 10 cm arttirir.", tip:"Draft survey ve loading plan tarafinda bu kart cebinde olmali."},
  {head:"FORMULLER - YARIM DAIRE SEYRI", body:"Yarim daire seyri, firtina/sirocco/tropical revolving storm merkezinin hareket yonu ile senin goreli konumunu birlikte yorumlama isidir.<br><b>Kuzey yarimkure:</b> ruzgari yuzune aldiginda dusuk basinc merkezi genel olarak sancak on tarafta dusunulur (Buys Ballot mantigi).<br><b>Guney yarimkure:</b> ayni mantik ters yone kayar; merkez daha cok iskele on tarafta dusunulur.<br><b>Tehlikeli yarim daire</b> genelde firtinanin ilerleme hizi ile donus hizinin birbirini besledigi taraftir; ruzgar ve deniz daha siddetli algilanabilir.<br><b>Sevk edici / manageable yarim daire</b> kacis kararinin nispeten daha kontrollu kurulabildigi taraftir.<br><b>Prensip:</b> once merkez yonu, sonra firtinanin hareket yonu, sonra senin DR mevkin ayni kagit ustunde dusunulur.<br><b>Kacis rotasi mantigi:</b> tehlikeli tarafta merkezin hareketine gore gemiyi emniyetli yarim daireye cikaracak pruva dusunulur; sevk edici tarafta ise merkeze gereksiz yaklasmadan denizi uygun acida almak hedeflenir.<br><b>Buys Ballot</b> tek basina formÃ¼l degil; ruzgar yonu + basinÃ§ dususu + deniz davranisinin birlikte yorumudur.<br><br><b>Kucuk tablo:</b><br>Kuzey yarimkure + merkezin saginda kalma -> tehlikeli yarim daire supheli<br>Kuzey yarimkure + merkezin solunda kalma -> sevk edici yarim daire supheli<br>Guney yarimkurede bu genel taraf mantigi ters okunur<br><br><b>Bakilan tablolar / kaynaklar:</b> weather routing chartlari, pilot chart, tropical cyclone warning message, barometer trend kaydi, synoptic weather chart, facsimile weather chart, weather routing / EGC-NAVTEX-METAREA yayinlari.<br><br><b>Ornek:</b> Kuzey yarimkurede firtina merkezi doguya ilerlerken sen merkezin saginda kaliyorsan genelde tehlikeli yarim dairede oldugun varsayilir ve kacis rotasi daha kritik hale gelir.", tip:"Yarim daire seyri ezber cizgisi degil; ruzgar, basinÃ§, merkez ve kendi mevkinin birlikte okunmasidir."},
  {head:"SEYIRDE KULLANILAN TABLOLAR / YAYINLAR", body:"<b>Nautical Almanac</b> -> goksel seyir, GHA, SHA, declination, sunrise/sunset, meridian passage<br><b>HO 229 / HO 249</b> -> sight reduction, Hc ve Zn bulma<br><b>Increments and Corrections Tables</b> -> dakika/saniye artimi ve goksel duzeltmeler<br><b>Altitude Correction Tables</b> -> dip, refraction, semi-diameter, parallax<br><b>Tide Tables</b> -> high water, low water, tidal height<br><b>Tidal Stream Atlas / Current Tables</b> -> akinti yonu ve hizi<br><b>Pilot Book / Sailing Directions</b> -> bogaz, kanal, liman yaklasma, akinti ve yerel uyarilar<br><b>List of Lights</b> -> fenerlerin karakteri, menzili, sektoru ve kimligi<br><b>Admiralty List of Radio Signals / benzeri yayinlar</b> -> sahil istasyonlari, VTS, reporting, pilotaj ve haberlesme bilgileri<br><b>Chart Catalogue</b> -> hangi harita/yayinin nerede kullanilacagi<br><b>Distance Tables</b> -> limanlar arasi yaklasik mesafeler<br><b>Load line / hydrostatic tables</b> -> draft, displacement, TPC, MCTC, KM, immersion bilgileri<br><b>Tank sounding / ullage tables</b> -> tank hacmi ve agirlik cevirileri<br><b>Stability booklet</b> -> GM, GZ, loading guidance, limitler<br><b>Weather chart / synoptic chart / pilot chart</b> -> basinÃ§ sistemi, mevsimsel ruzgar, yarim daire seyri, rota planlama<br><br><b>Kisa mantik:</b> Seyir zabiti sadece formulu degil, veriyi hangi tablodan cekecegini ve hangi yayina guvenecegini de bilir.", tip:"Dogru tabloyu secmek, dogru formulu secmek kadar onemlidir."},
  {head:"FORMULLER - YUK / HESAP", body:"Yukleme miktari = son draft survey - ilk draft survey<br>Density correction, TPC, MCTC ve displacement tablolarla birlikte kullanilir.<br>Yuk merkezi yukseldikce GM dusme egilimindedir.<br>Sounding-ullage tablolarinda tank kalibrasyonu esas alinir.<br><br><b>Ornek:</b> Ilk survey 12850 ton, son survey 13620 ton ise yukleme miktari yaklasik 770 ton kabul edilir.", tip:"Hesap yaparken birimi karistirma."},
  {head:"FORMULLER - ISTIF / STOWAGE", body:"Stowage factor = Yuk hacmi / Yuk agirligi<br>Gerekli hacim = Yuk miktari x stowage factor<br>Broken stowage, istifte bosluklardan dogan hacim kaybidir.<br>Uniform load mantigi: bir yuzeye binen toplam yuk / alan.<br>Agir yukte merkez hattina yakinlik ve yapisal limitler birlikte dusunulur.<br><br><b>Ornek:</b> 500 ton yuk ve stowage factor 1.6 m3/ton ise gerekli hacim 800 m3 olur. Ambar 760 m3 ise tam sigmaz.", tip:"Istif hesabi sadece nereye koyariz degil, ne kadar yerlestirebiliriz sorusudur."},
  {head:"FORMULLER - SEXTANT / ASTRONOMI", body:"Yaklasik meridian altitude mantigi: Latitude ~ 90 - Ho + Dec (ayni isimdeyse) veya 90 - Ho - Dec (ters isimdeyse).<br>Temel akis: Hs -> Ic duzeltmesi -> Ha -> dip/refraction vb. ile Ho -> almanactan Dec/GHA -> sight reduction ile Hc ve Zn -> Intercept = Ho - Hc.<br>Local Hour Angle mantigi: LHA = GHA +/- boylam (isim ve yon dogru okunur).<br>Meridian passage'da noon sight ile yaklasik enlem; intercept method'da AP/DR uzerinden mevki hatti dusunulur.<br>Index error, dip, refraction, semi-diameter ve gerekirse parallax duzeltmeleri unutulmaz.<br><br><b>Bakilan temel yayinlar / tablolar:</b><br><b>Nautical Almanac</b> -> GHA, SHA, Declination, sunrise/sunset, meridian passage bilgileri<br><b>HO 249 / Pub.249</b> -> Air navigation sight reduction tables, pratik Hc/Zn icin kullanilir<br><b>HO 229 / Pub.229</b> -> Marine sight reduction tables, daha klasik denizcilik kullanimidir<br><b>Increments and Corrections Tables</b> -> dakika/saniye artimlari ve duzeltmeler<br><b>Altitude correction tables</b> -> dip, refraction, semi-diameter, parallax duzeltmeleri<br><b>Chronometer / UTC kaydi</b> -> goksel seyirde zaman hatasi mevki hatasina donusur<br><br><b>Ornek:</b> Ho 63 derece, deklinasyon 15 derece Kuzey ve ayni isimliyse latitude yaklasik 90 - 63 + 15 = 42 derece Kuzey bulunur.", tip:"Goksel seyirde formulu bilmek yetmez; hangi degeri hangi tablodan alacagini da bilmen gerekir."},
  {head:"GOKSEL SEYIRDE GEREKLI YAYINLAR", body:"<b>Sextant</b> aciyi olcer.<br><b>Chronometer</b> dogru UTC'yi verir.<br><b>Nautical Almanac</b> gunun goksel verilerini saglar: GHA, SHA, Declination, meridian passage, twilight.<br><b>HO 229 / HO 249</b> tahmini mevki veya assumed position uzerinden Hc ve Zn bulmak icin kullanilir.<br><b>Altitude correction tables</b> ile Hs'den Ho'ya gecilir.<br><b>Plotting sheet / harita</b> uzerinde mevki hatti cizilir.<br><b>Azimuth diagram veya sight reduction worksheet</b> hesap akisinin duzenli tutulmasina yardim eder.<br><br><b>Kisa sira:</b> Gok cismi sec -> Hs al -> saat/UTC not et -> duzeltmelerle Ho bul -> Almanac'tan GHA/Dec cek -> HO 229/249 ile Hc/Zn bul -> intercept ciz -> mevkiyi yorumla.", tip:"En cok hata zaman, boylam isareti ve duzeltme tablosunu karistirmaktan cikar."},
  {head:"YUK OPERASYONU / LASHING", body:"Yuk ellecleme sirasinda isaretlesme, guvenli alan, vinc altina girmeme ve stop komutunun netligi esastir.<br>Lashing gerginligi, twist lock, turnbuckle, rod ve hava oncesi son kontrol ihmal edilmez.<br>Cargo securing manual referans dokumandir.", tip:"Near-miss de raporlanir."},
  {head:"GEMICI BAGLARI", body:buildKnotGallery(), tip:"Bag secimi kadar bagi dogru yere atmak da denizciliktir."},
  {head:"STABILITE / BALLAST", body:"GM, trim, list, free surface effect, displacement ve MCTC kavramlari temel bilinmelidir.<br>Ballast operasyonunda sounding, valf sirasi, tank secimi ve hedef trim/list birlikte dusunulur.<br>Slack tank bazen gizli dusmandir.<br>Ballast exchange ve ilgili MARPOL / ballast water kayit disiplini plansiz yurutulmez.<br>Heavy weather ballast planinda serbest yuzey, yapisal limit ve emniyetli trim birlikte ele alinir.", tip:"Bir tanki duzeltirken baska sorunu yaratma."},
  {head:"RASPA - BOYA / GUVERTELIK", body:"Yuzey hazirligi, pas derecesi, tuz kalintisi, astar secimi, katlar arasi bekleme ve PPE kullanimi boya isin temelidir.<br>Chipping hammer, needle gun, wire brush, primer ve top coat ne icin kullanildigi bilinmelidir.", tip:"Pasin ustunu kapatmak pasi bitirmez."},
  {head:"DENIZCILIK SOZLUGU A-F", body:"Abeam: tam yan omuzluk<br>Abaft: kicin gerisi<br>Aft: kic tarafi<br>Alongside: borda bordaya yanaşık<br>Astern: kıç tarafa dogru / geriye<br>All fast: baglama tamam<br>Air draft: su hattindan en yuksek noktaya kadar yukseklik<br>Freeboard: su hattindan guverteye olan yukseklik", tip:"Terimler kulaga oturdukca vardiya dili hizlanir."},
  {head:"DENIZCILIK SOZLUGU G-M", body:"GM: metasantrik yukseklik<br>Heading: geminin pruvasinin baktigi yon<br>COG: yer uzerindeki gercek gidis istikameti<br>SOG: yer uzerindeki hiz<br>Leeway: ruzgarla yan kayma<br>List: yan yatma<br>Trim: bas-kic oturuş farki<br>Mooring: baglama operasyonu", tip:"Ayni sey sanilan bircok kelime aslinda farkli anlama gelir."},
  {head:"DENIZCILIK SOZLUGU N-Z", body:"NOR: Notice of Readiness<br>PSC: Port State Control<br>SOF: Statement of Facts<br>ETA: Tahmini varis zamani<br>ETD: Tahmini kalkis zamani<br>UKC: Under Keel Clearance<br>Waypoint: rota uzerindeki donus / referans noktasi<br>Watchkeeping: vardiya tutma", tip:"Kisaltmalar denizciligin ikinci dilidir."}
];
const GLOSSARY_TERMS = [
  {term:"Abeam", meaning:"Bir cismin geminin tam yan omuzlugunda kalmasi.", example:"Pilot botu bir sure sancak abeam seyretti."},
  {term:"All Fast", meaning:"Geminin tum halatlarla emniyetli sekilde baglanmis olmasi.", example:"Son spring de alindiktan sonra lostromo 'all fast' dedi."},
  {term:"COG", meaning:"Course Over Ground; geminin yer uzerindeki gercek gidis istikameti.", example:"Akinti sebebiyle heading farkli ama COG rota hattina yakin olabilir."},
  {term:"SOG", meaning:"Speed Over Ground; geminin yer uzerindeki hizi.", example:"ETA hesaplarken SOG genelde ilk baktigin degerdir."},
  {term:"GM", meaning:"Metasantrik yukseklik; ilk stabiliteyi gosteren temel deger.", example:"Slack tank arttiginda GM dusup gemi daha yumusak yatabilir."},
  {term:"Trim", meaning:"Basin ve kicin suya oturus farki.", example:"Balast transferinden sonra gemi hafif kica trimli kaldi."},
  {term:"List", meaning:"Geminin iskele veya sancaga surekli yatik durmasi.", example:"Yuk kaymasi list yaratabilir."},
  {term:"UKC", meaning:"Under Keel Clearance; omurga alti su payi.", example:"Dar suya girmeden once UKC mutlaka hesaplanir."},
  {term:"Iskele", meaning:"Geminin sol bordasi.", example:"Iskele tarafta trafik yogunlasinca gozlem arttirildi."},
  {term:"Sancak", meaning:"Geminin sag bordasi.", example:"Sancak omuzlukta bir hedef belirdi."},
  {term:"Kic", meaning:"Geminin arka tarafi.", example:"Kic tarafa spring alinirken ekip dikkatle calisti."},
  {term:"Borda", meaning:"Geminin yan tarafi.", example:"Borda boyunca boya kalkmalari kayda gecti."},
  {term:"Alabanda", meaning:"Geminin bordasinin ic yuzu veya dumenin bir tarafa tam basilmasi.", example:"Alabanda komutunda dumen tam sancağa alindi."},
  {term:"Ana Guverte", meaning:"Geminin ana yuru yus ve calisma guvertesi.", example:"Ana guvertede sabah turu hic atlanmaz."},
  {term:"Kopruustu", meaning:"Seyir ve gemi idaresinin yapildigi ust mahal.", example:"Kopruustunde vardiya devri her zaman sozlu yapildi."},
  {term:"Bas Kasarasi", meaning:"Pruva tarafindaki yuksek guverte bolumu; forecastle.", example:"Bas kasarasinda demir ekipmani kontrol edildi."},
  {term:"Kic Ustu", meaning:"Kic taraftaki yuksek guverte bolumu; poop deck.", example:"Kic ustunde palamar hazirligi yapildi."},
  {term:"Ambar", meaning:"Yuklerin tasindigi kapali hacim.", example:"Ambar ici nem kontrolu zabit tarafindan tekrarlandi."},
  {term:"Hatch Cover", meaning:"Ambar kapagi sistemi.", example:"Hatch cover drain kanallari tikaliysa su alma riski buyur."},
  {term:"Head Line", meaning:"Geminin bas tarafindan ileriye dogru verilen baglama halati.", example:"Head line erken alininca pruva ileri kacmadan tutuldu."},
  {term:"Makine Dairesi", meaning:"Ana makine ve yardimci sistemlerin bulundugu mahal.", example:"Makine dairesine kulakliksiz girilmezdi."},
  {term:"Bas Bodoslama", meaning:"Geminin en on yapisal ucu; stem.", example:"Bas bodoslama vuruk kontrolunde dikkatle incelendi."},
  {term:"Kic Bodoslama", meaning:"Geminin arka yapisal ucu; sternpost.", example:"Kic bodoslama civarinda dumen baglantilari kontrol edildi."},
  {term:"Omurga", meaning:"Geminin boyuna ana tasiyici yapisi; keel.", example:"Omurga hattindaki hasar her zaman ciddiye alinir."},
  {term:"Bulwark", meaning:"Guverte kenarindaki koruyucu sac/parapet hattı; sancaklik.", example:"Bulwark ustunde pas izleri belirgindi."},
  {term:"Hawse Pipe", meaning:"Demir zincirinin gemi yapisindan gectigi loca/boru.", example:"Hawse pipe civarinda zincir surtunme izi vardi."},
  {term:"Kavitasyon", meaning:"Pervane veya pompa etrafinda basinç dususune bagli kabarcik olusup patlamasi sonucu olusan titreşim, ses ve performans kaybi durumu.", example:"Kicta ani titreşim artinca baskaptan pervanede kavitasyon ihtimalini dusundu."},
  {term:"Cavitation", meaning:"Kavitasyonun Ingilizce karsiligi; pervane, pompa ve akiskan sistemlerde kabarcik olusumu ve patlamasi ile iliskilidir.", example:"Chief engineer raporunda cavitation izleri icin kuru havuz kontrolu istedi."},
  {term:"Pitting", meaning:"Metal yuzeyde noktasal oyuklar ve lokal korozyon olusmasi.", example:"Tank ic kaplamasinda pitting gorulunce sac kalinligi takibe alindi."},
  {term:"Hogging", meaning:"Geminin orta kismi yukari kalkik, bas ve kic nispeten asagi kalmis gibi davranan boyuna bükülme durumu.", example:"Uzun dalgada hogging etkisi yapisal gerilmeleri artirabilir."},
  {term:"Sagging", meaning:"Geminin orta kismi asagi coker gibi, bas ve kic nispeten yukarida kalan boyuna bükülme durumu.", example:"Yuk dagilimi ve deniz durumu birlikte sagging riskini buyutebilir."},
  {term:"Slamming", meaning:"Geminin dip ya da on alt kisimlarinin dalgaya sert vurmasiyla olusan siddetli carpma etkisi.", example:"Firtinada hiz dusurulmezse slamming hem konforu hem yapisal omru vurur."},
  {term:"Panting", meaning:"Ozellikle pruva saclarinda dalga etkisiyle iceri-disari nefes alir gibi zorlanma ve titreşim gorulmesi.", example:"Panting bolgesindeki takviyeler kuru havuzda dikkatle kontrol edildi."},
  {term:"Broaching", meaning:"Agir havada geminin dalga ve ruzgar etkisiyle istemsiz sekilde rota disina savrulup yan donmeye meyletmesi.", example:"Following sea altinda broaching riski varsa dumen ve hiz daha dikkatli yonetilir."},
  {term:"Yawing", meaning:"Geminin rota etrafinda saga-sola salinimli sekilde bas atmasi.", example:"Dar kanalda asiri yawing vardiya zabitini hemen rahatsiz eder."},
  {term:"Compression Bar", meaning:"Hatch cover veya benzeri kapak sistemlerinde contanin esit baski alip sizdirmaz oturmasina yardim eden temas yuzeyi.", example:"Compression bar kirli veya bozuksa chalk test izi duzensiz cikar."},
  {term:"Cleat", meaning:"Kapak, hatch cover veya cesitli donanimlari bastirip sabitleyen kilitleme/sikma parcasi.", example:"Bir cleat esit baski vermiyorsa sizdirmazlik kontrolden gecemez."},
  {term:"Chalk Test", meaning:"Conta ve temas hattina tebesir/iz verilip kapak kapatildiktan sonra baskinin esit dagilip dagilmadigini anlamak icin yapilan test.", example:"Chalk test cizgisi bir noktada kiriliyorsa baski veya conta problemi suphelenilir."},
  {term:"Hose Test", meaning:"Kapak, pencere veya sizdirmaz alanlara kontrollu su tutularak sizdirmazlik kontrolu yapilan test.", example:"Hose test sonrasinda ambar icinde damla gorulurse nokta yeniden incelenir."},
  {term:"Ultrasonic Test", meaning:"Ozellikle hatch cover sizdirmazligini ses dalgasi/receiver yardimiyla kontrol etmekte kullanilan modern test yontemi.", example:"Ultrasonic test, gozle gorunmeyen kacaklari bulmada cok faydali oldu."},
  {term:"Forecastle", meaning:"Pruva tarafindaki yuksek guverte bolumu; bas kasarasi.", example:"Forecastle tarafinda romorkor hattina hazirlik yapildi."},
  {term:"Fore Spring", meaning:"Bas taraftan kica dogru capraz verilen spring halati; geminin boyuna hareketini tutar.", example:"Fore spring ilk alindigi icin gemi rihtim boyunca kaymadi."},
  {term:"Poop Deck", meaning:"Kic taraftaki yuksek guverte bolumu; kic ustu.", example:"Poop deck tarafinda vardiya devir notu verildi."},
  {term:"NOR", meaning:"Notice of Readiness; geminin yuke hazir oldugunu bildiren resmi ihbar.", example:"Charter taraftan laytime tartismasi cikarsa NOR saati kritik olur."},
  {term:"SOF", meaning:"Statement of Facts; liman operasyon zamanlarini kaydeden belge.", example:"SOF ile logbook uyumsuzsa PSC veya charter sorusu dogabilir."},
  {term:"Stowage Plan", meaning:"Yukun ambar, tank veya bay bazinda nereye yerlestirilecegini gosteren yuk plani.", example:"Stowage plan ile manifest uyusmuyorsa zabit yeniden kontrol ister."},
  {term:"Manifesto", meaning:"Cargo manifest icin gunluk dilde kullanilan ad; gemide tasinan yuklerin toplu listesini anlatir.", example:"Acenta, manifesto ile fiili yuk listesinin bire bir uyusmasini istedi."},
  {term:"Cargo Manifest", meaning:"Gemide tasinan yuklerin toplu listesini veren belge.", example:"Cargo manifest ile fiili yuk uyumu limanda sorgulanabilir."},
  {term:"Manifest", meaning:"Yuklerin, yolcularin ya da belirli bir sevkiyat grubunun resmi listesini gosteren genel belge adi.", example:"Dangerous goods manifest PSC denetiminde ayrica istendi."},
  {term:"Mate's Receipt", meaning:"Geminin teslim aldigi yuk icin duzenlenen ve gorulen cekinceleri de tasiyabilen teslim kaydi.", example:"Islak colli temiz receipt ile gecilmez."},
  {term:"Bill of Lading", meaning:"Tasima sozlesmesinin delili, yuk makbuzu ve belirli durumlarda mulkiyetle iliskili belge.", example:"Bill of Lading uzerindeki detaylar ticari ihtilafta kritik olur."},
  {term:"Sea Protest", meaning:"Kotu hava veya zorlayici olaylar sonrasi hak kaybini onlemek icin duzenlenen resmi deniz raporu.", example:"Siddetli havadan sonra sea protest dusunulup dusunulmeyecegi kaptanla degerlendirilir."},
  {term:"Letter of Protest", meaning:"Terminale, yuk ilgilisine veya ilgili tarafa resmi itiraz bildiren belge.", example:"Dusuk yukleme hizi icin letter of protest verilebilir."},
  {term:"Laytime", meaning:"Yukleme veya tahliye icin charter ile taninan sure.", example:"NOR saati laytime hesabinin baslangicinda tartisma cikarabilir."},
  {term:"Demurrage", meaning:"Verilen laytime asildiginda dogan gecikme ucreti.", example:"SOF saatleri demurrage hesabinda para demektir."},
  {term:"Dispatch", meaning:"Yukleme/tahliye verilen sureden erken biterse dogabilecek zaman kazanci odemesi.", example:"Dispatch hesaplari bazen demurrage kadar tartisilir."},
  {term:"Arrival Condition", meaning:"Geminin limana varistaki kondisyonunu anlatan rapor veya kontrol butunu.", example:"Arrival condition zayifsa PSC ve charter sorulari buyuyebilir."},
  {term:"Draft Survey", meaning:"Draft, yogunluk ve hidrostatik tablolarla yuk miktari hesaplama yontemi.", example:"Draft survey sonucu ile belge uymuyorsa yeniden olcum istenir."},
  {term:"Ullage", meaning:"Tank icinde sivi seviyesinin ustunde kalan bos mesafe.", example:"Ullage tablosu yanlis okunursa tank miktari da yanlis bulunur."},
  {term:"Sounding", meaning:"Tank veya mahalde dipten sivi seviyesine kadar olan olcu.", example:"Ballast sounding degeri plana gore beklenenden dusuktu."},
  {term:"Lashing", meaning:"Yuklerin hareket etmemesi icin sabitlenmesi ve baglanmasi.", example:"Agir hava oncesi lashing turu hayat kurtarir."},
  {term:"Cargo Securing Manual", meaning:"Yuklerin nasil sabitlenecegini ve hangi ekipmanin nasil kullanilacagini gosteren referans dokuman.", example:"Lashing karari cargo securing manual olmadan kafaya gore verilmez."},
  {term:"Loadicator", meaning:"Yukleme, draft, trim, kesme kuvveti ve bending moment gibi verileri hesaplayan sistem.", example:"Loadicator alarmi varsa veri girisi yeniden kontrol edilir."},
  {term:"TPC", meaning:"Tonnes Per Centimetre immersion; drafti 1 cm degistirmek icin gereken ton.", example:"TPC bilinmeden hizli draft hesabina guvenilmez."},
  {term:"MCTC", meaning:"1 cm trim degisikligi icin gereken trimming moment.", example:"MCTC trim planinda en cok acilan tablolardan biridir."},
  {term:"Free Surface Effect", meaning:"Yari dolu tanklardaki serbest sivi yuzeyinin stabiliteyi olumsuz etkilemesi.", example:"Slack tank arttikca free surface effect GM'i dusurebilir."},
  {term:"Ballast Exchange", meaning:"Ozellikle belirli kurallar altinda ballast suyunun degistirilmesi islemi.", example:"Ballast exchange hem emniyet hem MARPOL/ballast water disiplini ister."},
  {term:"Reefer", meaning:"Sicakligi kontrollu tasima yapan sogutuculu konteyner veya yuk unitesi.", example:"Reefer alarmi bazen tek bir konteynerden butun vardiyayi mesgul eder."},
  {term:"Waypoint", meaning:"Seyir planindaki donus veya referans noktasi.", example:"Yanlis waypoint aktif olursa rota butununden sapma baslar."},
  {term:"Watchkeeping", meaning:"Vardiya tutma disiplini ve sorumluluklari.", example:"Watchkeeping sadece ayakta durmak degil, surekli degerlendirmedir."},
  {term:"A (Alfa-Aydin)", meaning:"Uluslararasi isaret sancaklarinda A harfi; dalgicim var, agir yolla ve neta bulununuz anlamindadir.", example:"Su alti calismasi varken A sanca gi gosterilir."},
  {term:"Abaso", meaning:"Asagi veya alt anlaminda kullanilan sozcuk.", example:"Lostromo abasodaki gabyayi gosterdi."},
  {term:"Abaso Babafingo", meaning:"Cift babafingolardan altta olan babafingo.", example:"Eski arma tarifinde abaso babafingo geciyordu."},
  {term:"Abaso Gabya Yelkeni", meaning:"Cift gabyalardan alttaki gabya uzerindeki yelken.", example:"Yelken planinda abaso gabya yelkeni ayri isaretlenir."},
  {term:"Abaso Yakasi", meaning:"Yelkenin alt yakasi.", example:"Abaso yakasi gergin degilse yelken duzgun acmaz."},
  {term:"Abis", meaning:"Denizlerin buyuk derinligi.", example:"Chartta abis bolgesi daha koyu tonla gosterildi."},
  {term:"Abli", meaning:"Bumba veya yarim serenleri iki yana cevirmeye ve tutmaya yarayan donanim.", example:"Abli iyi ayarlanmazsa bumba kontrolsuz kalir."},
  {term:"Abli Palangasi", meaning:"Palanga seklindeki abli donanimi.", example:"Abli palangasi yuk altinda daha kontrollu calisir."},
  {term:"Abluka", meaning:"Bir liman veya kiyinin ustun kuvvetlerle kusatilarak dis baglantisinin kesilmesi.", example:"Tarih dersinde abluka uygulamalari incelenirdi."},
  {term:"Aborda", meaning:"Bir teknenin digerine ya da iskeleye bordasini tamamen vererek yanasmasi.", example:"Rıhtıma aborda olduktan sonra halatlar verildi."},
  {term:"Abosa", meaning:"Dur, tut veya gecici olarak durdur kumandasi.", example:"Irgatta zincir hizlaninca 'abosa' komutu geldi."},
  {term:"Abramak", meaning:"Tekneyi zor hava sartlarinda en iyi sekilde kontrol altinda tutmak.", example:"Firtinada iyi abrayan serdumen cok sey degistirir."},
  {term:"Acenta", meaning:"Gemi veya yuk sahibinin islerini takip eden yetkili araci kisi.", example:"Liman formalitelerinde acenta sureci hizlandirdi."},
  {term:"Acentelik", meaning:"Acentanin gemi ve yuk sahibi adina yaptigi isler.", example:"Acentelik hizmeti olmadan liman islemleri aksar."},
  {term:"Acevele", meaning:"Bir cismin carpmasini onlemek icin yapilan donanim ya da serenleri iyice pirasya etme hali.", example:"Botu yanas tirirken acevele tuttular."},
  {term:"Aci Sekstanti", meaning:"Yatay aci olcmek icin kullanilan ozel sekstant.", example:"Sörvey ekibi aci sekstanti ile olcu aldi."},
  {term:"Aciga Cikmak", meaning:"Bulundugu yerden ayrilip daha aciga gitmek.", example:"Sahil guvenlik teknesi mendirekten aciga cikti."},
  {term:"Acik Barinakli Gemi", meaning:"Barinak guverte acikliklari nedeniyle alt hacmi tonaja tam girmeyen gemi tipi.", example:"Tonaj hesabinda acik barinakli gemi fark yaratir."},
  {term:"Acik Demir Yeri", meaning:"Bazi ruzgarlara acik olan demir yeri.", example:"Acik demir yerinde hava bozarsa rahat edilmez."},
  {term:"Acik Deniz", meaning:"Ulke karasulari disindaki serbest deniz alanlari.", example:"Acik denizde seyir kurallari yine dikkat ister."},
  {term:"Acik Deniz Gemisi", meaning:"Acik denizde calisabilecek sekilde yapilmis ve donatilmis gemi.", example:"Bu tekne acik deniz gemisi klasinda degil."},
  {term:"Acik Deniz Platformu", meaning:"Deniz dibi petrol veya dogal gaz arastirmalari icin kullanilan platform.", example:"ECDIS uzerinde offshore platform tehlike gibi izlenir."},
  {term:"Acik Dusmek", meaning:"Istenen yerden veya mevkiden daha uzakta kalmak.", example:"Akinti yuzunden rota hattinin disina acik dustuk."},
  {term:"Acik Gecmek", meaning:"Bir sahil, samandira veya deniz aracindan neta gecmek.", example:"Seli kayaligini acik gectik."},
  {term:"Acik Kira Anlasmasi", meaning:"Yukun cinsi ya da varis limani tam yazilmamis charter party.", example:"Acik kira anlasmasi ticari risk tasir."},
  {term:"Acikta Eglenmek", meaning:"Demir atmadan sahil aciginda beklemek.", example:"Pilot saati gelene kadar acikta eglendik."},
  {term:"Acilmak", meaning:"Sahilden veya bir yerden uzaklasmak.", example:"Kiyidan acildikca deniz kabarmaya basladi."},
  {term:"Ada", meaning:"Sularla cevrili dogal kara parcasi.", example:"Rota plani adanin sancagindan geciyordu."},
  {term:"Adi Iskarmoz", meaning:"Kurekleri kayisliklariyla tutmaya yarayan iskarmoz.", example:"Filikadaki adi iskarmoz gevsemisti."},
  {term:"Admiralti Demiri", meaning:"Ciposu kollara dik eski tip demir cinsi.", example:"Egitimde admiralti demirinin yapisini gosterdiler."},
  {term:"Aganta", meaning:"Halat veya zinciri kisa sure elde tut, birakma komutu.", example:"Aganta iskota denince herkes halati tuttu."},
  {term:"Agiz Kusagi", meaning:"Borda kaplamasinin en ustteki siras i.", example:"Agiz kusagi darbe alinca hemen kontrol edildi."},
  {term:"Alabanda", meaning:"Dumenin bir tarafa sonuna kadar basilmasi veya borda ic yuzeyi.", example:"Kaptan 'iskele alabanda' diye bagirdi."},
  {term:"Alabura", meaning:"Teknenin yan yatip devrilmesi.", example:"Asiri list alabura riskini buyuttu."},
  {term:"Alama Kurek", meaning:"Kurek cekmeyi durdurma emri.", example:"Komutla birlikte alama kurek yapildi."},
  {term:"Alarga", meaning:"Bir yere yanasmadan acikta bulunma hali.", example:"Römorkor alarga bekliyordu."},
  {term:"Alesta", meaning:"Hazir ol, stand by komutu.", example:"Pilot laddere alesta bekledik."},
  {term:"Altabaso", meaning:"Bir yelkenin alt yakasi; alt kisim.", example:"Altabaso yakasi toplanirken kumas kiristi."},
  {term:"Ana Guverte", meaning:"Uzerinde yurutulen en ust ana guverte.", example:"Ana guvertede raspa-boya isi vardi."},
  {term:"Ana Omurga", meaning:"Postalarin baglandigi, bastan kica uzanan ana omurga.", example:"Ana omurga geminin belkemigidir."},
  {term:"Anele", meaning:"Hareketli demir halka veya goz.", example:"Can halatini aneleye bagladilar."},
  {term:"Anele Bagi", meaning:"Halati demir ya da samandira anelesine baglamakta kullanilan bag.", example:"Anele bagi filikada tekrar calisildi."},
  {term:"Apazlama", meaning:"Teknenin bordasina dik esen ruzgar ve bu ruzgarla yapilan seyir.", example:"Apazlamada yelken dengesi farkli olur."},
  {term:"Apiko", meaning:"Demirin deniz dibinden kurtulup zincir ustune geldig i durum; hazir bekleme hali.", example:"Demir apiko olunca vira daha dikkatli surdu."},
  {term:"Arma", meaning:"Geminin direk, seren, yelken ve bunlara ait donaniminin butunu.", example:"Okul gemisinin armasi oldukca karmasikti."},
  {term:"Armuz", meaning:"Kaplama tahtalari veya levhalari arasindaki birlesim cizgisi.", example:"Armuz kaciriyorsa kalafat ister."},
  {term:"Arya", meaning:"Sancak, yelken veya serenin asagi indirilmesi.", example:"Gun batiminda arya sancak yapildi."},
  {term:"Asirtma Yelken", meaning:"Ruzgara gore bir taraftan digerine kavanca ettirilebilen yelken.", example:"Asirtma yelken eski teknelerde gorulur."},
  {term:"Avara", meaning:"Yanasik olunan yerden ayrilmak; bunun icin verilen komut.", example:"Avara komutuyla halatlar sira ile alindi."},
  {term:"Avarya", meaning:"Kaza sonucu gemi veya yukte olusan hasar ve ilgili giderler.", example:"Avarya dosyasi icin belgeler toplandi."},
  {term:"Ayberi", meaning:"Ayin dunyaya en cok yaklastigi nokta.", example:"Astronomi notunda ayberi de geciyordu."},
  {term:"Aybocu", meaning:"Demir irgatini geri calistirarak zinciri bosaltmak.", example:"Demir manevrasinda aybocu verildi."},
  {term:"Ayi Bacagi", meaning:"Pupadan ruzgarla iki yan yelken acilarak yapilan seyir.", example:"Ayi bacaginda yelken dengesi hassastir."},
  {term:"Aynalik", meaning:"Kic bodoslama uzerindeki tahta levha; ayna kic yapidaki parca.", example:"Aynalikta dumen ignesinin oturusu kontrol edildi."},
  {term:"B (Bravo-Burak)", meaning:"Uluslararasi isaret sancaklarinda B harfi; tehlikeli yuk yukluyorum, tahliye ediyorum veya tasiyorum.", example:"B sancagi iskeledeyken bunker veya tehlikeli yuk akla gelir."},
  {term:"Baba", meaning:"Halat volta etmek icin gemide veya rıhtımda bulunan silindirik donanim.", example:"Spring halati babaya iki volta edildi."},
  {term:"Badarna Etmek", meaning:"Bir halati asinmaya karsi koruyucu malzemeyle sarmak.", example:"Surtunme noktasi icin halat badarna edildi."},
  {term:"Bakla", meaning:"Zinciri olusturan her bir halka.", example:"Bir baklada catlak gorulurse zincir degisir."},
  {term:"Bandira", meaning:"Geminin milliyetini gosteren milli sancak.", example:"Bandira cekimi gunluk rutinin parcasi."},
  {term:"Barbariska", meaning:"Halati tutmak icin yapilan stopper tipi bosa.", example:"Yuk altinda barbariska cok is gorur."},
  {term:"Bas Bodoslama", meaning:"Omurganin bas tarafta yukselen dikey veya egik kismi.", example:"Bas bodoslama vuruk kontrolunde incelendi."},
  {term:"Bas Kasara", meaning:"Geminin bas tarafindaki yuksek kisim; irgat ve baglama donanimi burada bulunur.", example:"Bas kasarada demir vardiyasi tutuldu."},
  {term:"Bas Omuzluk", meaning:"Borda kaplamasinin bas bodoslamaya dogru egilmeye basladigi kisim.", example:"Bas omuzlukta boya asindi."},
  {term:"Bas Ustu", meaning:"Bas kasaradaki ust platform veya guverte.", example:"Bas ustunde demir kuresi hazirlandi."},
  {term:"Basa Trimli", meaning:"Basi kica gore daha fazla su ceken gemi durumu.", example:"Basa trimli gemi kanalda dikkat ister."},
  {term:"Bindirme Kaplama", meaning:"Ahsap teknelerde kaplamalarin ust uste bindirilerek yapilmasi.", example:"Bindirme kaplama geleneksel teknelerde sik gorulur."},
  {term:"Bita", meaning:"Kucuk madeni baba ya da eski tip irgatta zinciri kontrol eden silindir.", example:"El incesi bitaya volta edildi."},
  {term:"Bocurum", meaning:"Yelkenli teknelerde kicta acilan dort kose yelken.", example:"Bocurum acilinca tekne daha dengeli surdu."},
  {term:"Borda", meaning:"Geminin yan tarafi.", example:"Borda fenerleri gece seyri icin hayati."},
  {term:"Borda Fenerleri", meaning:"Sancakta yesil, iskelede kirmizi olan 112.5 derecelik seyir fenerleri.", example:"Borda fenerleri arizaliysa geceye cikilmaz."},
  {term:"Borda Iskelesi", meaning:"Gemiden inip cikmak icin bordadan indirilen merdiven.", example:"Borda iskelesinin emniyeti vardiya defterine yazildi."},
  {term:"Bosa Tutmak", meaning:"Halat veya zinciri durdurmak ve emniyete almak.", example:"Bosa tutmayan ekip halati kacirabilir."},
  {term:"Bos Alamak", meaning:"Gevsemis halatin fazlasini alip germek.", example:"Mooring esnasinda spring biraz bos alandi."},
  {term:"Bos Koymak", meaning:"Halati kontrollu sekilde laska etmek.", example:"Komutla birlikte biraz bos koyduk."},
  {term:"Branda", meaning:"Makine ve esyalari korumak icin kullanilan ortu; yelken bezine de denir.", example:"Raspa sonrasi alan brandayla kapatildi."},
  {term:"Bumba", meaning:"Yuk operasyonu veya yelken kontrolu icin kullanilan seren/dikme.", example:"Eski general cargolarda bumba cok onemliydi."},
  {term:"Burgata", meaning:"Halat cevresi icin kullanilan olcu birimi.", example:"Halatin burgatasi raporda yaziyordu."},
  {term:"Bukum", meaning:"Bir halatin kollarinin saga veya sola bukulmus hali.", example:"Ters bukum halatta gamba yaratabilir."},
  {term:"C (Charlie-Cemal)", meaning:"Uluslararasi isaret sancaklarinda C harfi; onceki grubun anlami olumlu okunacaktir.", example:"Signal kitabi acik olmadan C sancagini yorumlamak zordur."},
  {term:"Camadan", meaning:"Yelken alanini kucultmek icin yelkeni bogma islemi.", example:"Ruzgar artinca camadana vuruldu."},
  {term:"Can Filikasi", meaning:"Tehlikede gemidekileri kurtarmak icin bulundurulan can kurtarma araci.", example:"Can filikasi drillinde personel sayimi yapildi."},
  {term:"Can Halati", meaning:"Emniyet ve kurtarma amacli donatilan halat.", example:"Can halati iskele ustunde hazir tutuldu."},
  {term:"Can Kurtarma Araclari", meaning:"Can filikasi, can sallari, can simitleri gibi tum life saving appliances.", example:"PSC once can kurtarma araclarini kontrol etti."},
  {term:"Can Simidi", meaning:"Denize dusen kisiyi yuzdurmek ve kurtarmak icin kullanilan halka bicimli arac.", example:"Can simidinin isik ve savlosu tamdi."},
  {term:"Cayro Pusula", meaning:"Dunyanin manyetik yapisindan etkilenmeyen elektrikli pusula.", example:"Gyro arizalaninca manyetik pusulayla cross-check yapildi."},
  {term:"Ceviz", meaning:"Halat uclarina yapilan dugum veya agirlikli el incesi basi.", example:"El incesinin cevizli ucu rıhtıma atildi."},
  {term:"Civadra", meaning:"Yelkenli teknede bas bodoslama ustunden one uzanan sabit seren.", example:"Floklar civadra uzerine acilir."},
  {term:"Cunda", meaning:"Seren, gonder veya bumbanin serbest ucu.", example:"Cunda donanimi zorlaninca ekip geri cekildi."},
  {term:"Capa riz", meaning:"Manevra veya isin engellenmesi; zincirlerin birbirine dolanmasi.", example:"Demirlerde capariz olursa is uzar."},
  {term:"Carmik", meaning:"Direkleri yanlardan tutan kalin sabit arma.", example:"Carmiklarin gerginligi tek tek kontrol edildi."},
  {term:"Cima", meaning:"Halatin ucu.", example:"Cima yipranmissa selvis gerekir."},
  {term:"Cimaci", meaning:"Rıhtıma yanasan geminin halatini alip volta eden kisi.", example:"Cimaci springi babaya iyi aldi."},
  {term:"Cipo", meaning:"Ozellikle admiralti demirinde kollara dik baglanan kol parca.", example:"Cipolu demir egitimlerde anlatilir."},
  {term:"Curuk Su", meaning:"Geminin dumenine yakin olusan ve pervanenin icinde calistigi bozuk su.", example:"Curuk su bazen dumen etkisini degistirir."},
  {term:"D (Delta-Deniz)", meaning:"Uluslararasi isaret sancaklarinda D harfi; benden acik bulununuz, manevra yapmakta gucluk cekiyorum.", example:"Dar manevrada D sancagi anlamlidir."},
  {term:"Double Bottom", meaning:"Geminin karinasi yirtilsa da su almamasi icin yapilan ikinci dip bolmesi.", example:"Double bottom tanklari yakit veya ballast tutabilir."},
  {term:"Dalgakiran", meaning:"Limanlari dalga ve akintidan koruyan yapi.", example:"Mendirek disinda deniz sertti ama dalgakiran ici sakindi."},
  {term:"Dalgic", meaning:"Deniz dibinde arastirma ve is yapabilen kisi.", example:"A sancagi cekiliyse dalgic vardir."},
  {term:"Datum", meaning:"Harita uzerindeki derinlik referans seviyesi.", example:"Chart datum bilinmeden UKC yorumu eksik kalir."},
  {term:"Dedveyt", meaning:"Geminin tasiyabilecegi toplam agirlik kapasitesi.", example:"Yuk planinda dedveyt siniri asilmadi."},
  {term:"Demir Almak", meaning:"Demirli geminin demirini ve zincirini gemiye almak.", example:"Pilot saati yaklasinca demir alma basladi."},
  {term:"Demir Kaloma", meaning:"Demir zincirini bos birakma komutu veya verilen zincir miktari.", example:"Bir sancak daha demir kaloma edildi."},
  {term:"Demir Kampanasi", meaning:"Demirleme ve sis isaretlerinde kullanilan bas taraftaki can.", example:"Demir kampanasi anchor watchta duyuldu."},
  {term:"Demir Kuresi", meaning:"Demirli geminin gunduz gosterdigi siyah kure.", example:"Limanda demir kuresi gunduz cekildi."},
  {term:"Demir Locasi", meaning:"Demir zincirinin ve demirin gectigi boru.", example:"Demir locasi cevresi pas icin kontrol edildi."},
  {term:"Demir Taramasi", meaning:"Demirin iyi tutmayip deniz dibinde suruklenmesi.", example:"GPS izinde demir taramasi fark edildi."},
  {term:"Demir Yeri", meaning:"Geminin guvenle demirleyebilecegi alan.", example:"Haritada anchorage isaretli demir yeri secildi."},
  {term:"Demirde Yatmak", meaning:"Geminin demirli durumda bulunmasi.", example:"Geceyi dis limanda demirde yattik."},
  {term:"Demiri Fundo Etmek", meaning:"Demiri kendi agirligi ile denize birakmak.", example:"Kaptan uygun mevkide demiri fundo ettirdi."},
  {term:"Demiri Vira Etmek", meaning:"Demir ve zinciri irgatla iceri almak.", example:"Demiri vira etmeden once bas ustu hazirlandi."},
  {term:"Demuraj", meaning:"Starya asimi nedeniyle dogan gecikme ucreti; surastarya.", example:"Tahliye gecikirse demuraj tartismasi cikar."},
  {term:"Deniz Demiri", meaning:"Teknenin dalgaya borda vermesini azaltmak icin denize atilan konik duzenek.", example:"Makine arizasinda deniz demiri hayat kurtarabilir."},
  {term:"Deniz Raporu", meaning:"Sea protest.", example:"Firtina sonrasi deniz raporu hazirlandi."},
  {term:"Deniz Sigortasi", meaning:"Marine insurance.", example:"Hasar dosyasinda deniz sigortasi klozlari acildi."},
  {term:"Denize Elverisli", meaning:"Bir geminin deniz tehlikelerine karsi sefere uygun durumda olmasi.", example:"Denize elverisli olmayan gemi sefere cikamaz."},
  {term:"Denize Elverislilik Belgesi", meaning:"Geminin ilgili seyir ve hizmete uygun oldugunu gosteren belge.", example:"Denize elverislilik belgesinin suresi kontrol edildi."},
  {term:"Deplasman", meaning:"Geminin yuzdurdugu suyun agirligina esit toplam agirligi.", example:"Stabilite hesabinda deplasman temel girdidir."},
  {term:"Dese Etmek", meaning:"Halat veya zincirin iyice gerilmesi.", example:"Spring bir anda dese oldu."},
  {term:"Dingi", meaning:"Kucuk filika veya servis teknesi.", example:"Dingi iskeleye personel tasidi."},
  {term:"Dirisa", meaning:"Yon degistirmek; ruzgarin yon degistirmesi.", example:"Ruzgar dirisa ettigi icin rota duzeltildi."},
  {term:"Dispacor", meaning:"Avaryada taraflara dusen payi hesaplayan kisi.", example:"Dispacor belgeleri istemeye basladi."},
  {term:"Dispec", meaning:"Starya suresinin tamaminin kullanilmamasiyla kazanilan zaman.", example:"Kiraci dispec bekliyordu."},
  {term:"Doblin", meaning:"Halatin iki cimas i arasindaki bight.", example:"Volta atmadan once halatta dobline aldik."},
  {term:"Dokuz Oturak Oturmak", meaning:"Geminin sert sekilde karaya oturmasi.", example:"Yanlis yaklaşmada gemi dokuz oturak oturdu."},
  {term:"Dosek", meaning:"Geminin en alt kisminda postalari baglayan taban elemani.", example:"Havuzda dosek bolgesi de incelendi."},
  {term:"Draft Survey", meaning:"Yukleme markalari ve draftlar uzerinden yapilan yuk miktari denetimi/hesabi.", example:"Draft survey sonucu tahmini tonaj netlesti."},
  {term:"Dumen", meaning:"Gemiyi istenen yone cevirmeye yarayan parca.", example:"Dumen cevaplari kanalda cok kritik hale geldi."},
  {term:"Dumen Donanimi", meaning:"Dumen dolabi ile dumen arasindaki steering gear sistemi.", example:"Steering gear drillinde dumen donanimi test edildi."},
  {term:"Dumen Zaviyesi", meaning:"Dumen yelpazesinin omurgayla yaptigi aci.", example:"35 derece dumen zaviyesi manevrayi degistirir."},
  {term:"Dumenci Pusulasi", meaning:"Serdumenin komut verirken baktigi pusula.", example:"Manyetik hata dumenci pusulasinda not edildi."},
  {term:"E (Echo-Engin)", meaning:"Uluslararasi isaret sancaklarinda E harfi; rotami sancaga degistiriyorum.", example:"Karsidan gelen trafik icin E sanca gi acik bir niyettir."},
  {term:"Eglenmek", meaning:"Bas rüzgari alarak ayni yerde kalmaya veya cok agir yol gitmeye calismak.", example:"Hava sertlesince bir sure eglendik."},
  {term:"El Incesi", meaning:"Bir tekneden digerine veya sahile atilan ince halat.", example:"Ilk once el incesi cimaciya atildi."},
  {term:"El Iskandili", meaning:"Elektrikli cihaz olmayan teknelerde derinlik olcmek icin kullanilan kursunlu salvo.", example:"El iskandili klasik ama ogreticidir."},
  {term:"Ellecleme", meaning:"Yukun yuklenmesi, istifi ve bosaltilmasi islemleri.", example:"Ellecleme sirasinda guvenli alan korunur."},
  {term:"Enspektor", meaning:"Geminin sefere hazirligini takip eden armatör gorevlisi.", example:"Enspektor PSC oncesi gemiye cikti."},
  {term:"ETA", meaning:"Estimated Time of Arrival; tahmini varis zamani.", example:"ETA degisirse acenta hemen haberdar edilir."},
  {term:"ETD", meaning:"Estimated Time of Departure; tahmini kalkis zamani.", example:"Pilot saati ETD'yi etkiledi."},
  {term:"ETS", meaning:"Estimated Time of Sailing; tahmini seyire baslama zamani.", example:"Kanal gecisi ertelenince ETS kaydi degisti."},
  {term:"Evaporator", meaning:"Deniz suyundan tatli su elde etmeye yarayan aygit.", example:"Evaporator devrede degilse freshwater kısıtlanir."},
  {term:"F (Foxtrot-Felenk)", meaning:"Uluslararasi isaret sancaklarinda F harfi; hareket kabiliyetine sahip degilim, benimle irtibat kurunuz.", example:"Ariza halinde F sancagi cok sey anlatir."},
  {term:"Faca", meaning:"Yelkenin ters kuntradan dolmasi; boot top bolgesi.", example:"Faca alan yelken kontrol kaybettirebilir."},
  {term:"Facuna Etmek", meaning:"Badarnanin tel veya murnel ile siki sarilmasi.", example:"Tel halatin korunan yeri facuna edildi."},
  {term:"Farsa Tahtalari", meaning:"Ahsap teknede sintine ustundeki aralikli tahtalar.", example:"Fars tahtalari kaldirilinca alt kısım temizlendi."},
  {term:"Feeder", meaning:"500 TEU'dan az kapasitedeki konteyner gemisi tipi.", example:"Bu hatta feeder tipi gemiler calisiyor."},
  {term:"Feedermax", meaning:"Yaklasik 500-999 TEU arasi konteyner gemisi tipi.", example:"Feedermax liman kisitlarina daha rahat uyar."},
  {term:"Feribot", meaning:"Arac ve bazen vagon tasiyan gemi.", example:"Feribot trafigi bogaz planini etkileyebilir."},
  {term:"Fersah", meaning:"Uc deniz mili civarinda eski mesafe birimi.", example:"Eski kayitlarda mesafe fersahla geciyor."},
  {term:"Firdondu", meaning:"Zincirin gamba almamasi icin araya konan doner baglanti.", example:"Firdondu donmuyorsa zincir toplanir."},
  {term:"Firishka", meaning:"Cok hafif ruzgar.", example:"Firishkada yelkenler tam dolmaz."},
  {term:"Filika", meaning:"Gemide bulunan kucuk servis veya can kurtarma teknesi.", example:"Filika donanimi haftalik kontrol edildi."},
  {term:"Filo", meaning:"Ayni hizmette veya ayni sahiplikte toplanmis gemi grubu.", example:"Sirketin kuru yuk filosu buyudu."},
  {term:"Fribord", meaning:"Su yuzeyinden ana guverte cizgisine kadar olan yukseklik.", example:"Yuk arttikca fribord azalir."},
  {term:"Fribord Markasi", meaning:"Geminin bordasindaki yukleme sinir isaretleri; Plimsoll mark.", example:"Yaz yukleme hattini gecmek yasaktir."},
  {term:"Fundo", meaning:"Demirlemek icin demiri birakma komutu.", example:"Kaptan uygun anda 'fundo' dedi."},
  {term:"G (Golf-Gabya)", meaning:"Uluslararasi isaret sancaklarinda G harfi; kilavuz istiyorum.", example:"Pilot ihtiyacinda G sancagi anlamlidir."},
  {term:"Gabya", meaning:"Ana direk ile babafingo arasindaki parca veya yelken.", example:"Eski arma planinda gabya ayri gosterilir."},
  {term:"Gabyar", meaning:"Yelken ve seren bakimindan sorumlu usta gemici.", example:"Okul gemisinde gabyar herkesin saygi duydugu kisiydi."},
  {term:"Gamba", meaning:"Halatin ters bukulmesi veya zincirin dolasmasi.", example:"Virada gamba oldugunu hemen fark ettik."},
  {term:"Genova", meaning:"Buyuk flok tipi yelken.", example:"Apazda genova cok guzel cekiyordu."},
  {term:"Giriva", meaning:"Goz demirini yatagina oturtmak icin kullanilan donanim.", example:"Demir vira sonunda giriva kontrol edildi."},
  {term:"Giz", meaning:"Yan yelkenlerin ust yakasini baglayan yarim seren.", example:"Giz acisi bozulunca yelken verimi dustu."},
  {term:"Gladora", meaning:"Kuru yuk gemisinde ara kat veya tweendeck.", example:"Gladora seviyesinde kargo ayirimi yapildi."},
  {term:"Gomina", meaning:"Bir deniz milinin onda biri; 185.2 metre.", example:"Mesafe hesabinda gomina eski kayitlarda gecer."},
  {term:"Gonder", meaning:"Bayrak cekilen kucuk direk ya da cubuk.", example:"Kic gondere bandira cekildi."},
  {term:"Goz Demiri", meaning:"Geminin sancak ve iskele bas omuzlugundaki ana demir.", example:"Iskele goz demiri bakimdaydi."},
  {term:"Grandi Diregi", meaning:"Birden fazla direkli gemide en yuksek direk.", example:"Grandi diregi uzaktan hemen seciliyordu."},
  {term:"GRT/GT", meaning:"Geminin kapali hacmine dayali gross tonaj birimi.", example:"GT liman ucretlerini etkileyebilir."},
  {term:"Gurcata", meaning:"Direkte crosstree/spreader gorevi yapan kollar.", example:"Gurcata gerginligi sabit armayi acar."},
  {term:"Gucvertenin Hatti", meaning:"Guvertenin bordadaki izdusumu olan deck line.", example:"Load line markasi guverte hattiyla birlikte okunur."},
  {term:"Guverte", meaning:"Gemide bastan kica uzanan platform.", example:"Guvertede calisirken PPE zorunlu."},
  {term:"Guverte Lostromosu", meaning:"Ticaret gemisinde gemicilerin basi; boatswain.", example:"Guverte lostromosu is dagitimini yapti."},
  {term:"Guverte Zabiti", meaning:"Kaptandan sonra gelen zabitler grubu.", example:"Guverte zabiti vardiya planini duzenledi."},
  {term:"H (Hotel-Halat)", meaning:"Uluslararasi isaret sancaklarinda H harfi; gemide kilavuz kaptan var.", example:"Pilot ciktiktan sonra H sancagi anlam kazanir."},
  {term:"Halat", meaning:"Bitkisel, sentetik veya celikten yapilan cekmeye uygun urgan.", example:"Halatin cimasinda asinma vardi."},
  {term:"Halat Bosa", meaning:"Volta edilecek halati tutmakta kullanilan kisa stopper.", example:"Halat bosa olmadan yuk altina girilmedi."},
  {term:"Handy", meaning:"Yaklasik 1000-1999 TEU arasi konteyner gemisi tipi.", example:"Bu terminal handy segmentini iyi ceviriyor."},
  {term:"Handymax", meaning:"Yaklasik 35.000-49.999 DWT arasi gemi segmenti.", example:"Handymax drafti bu limana sınırda uyuyor."},
  {term:"Handysize", meaning:"Yaklasik 20.000-34.999 DWT arasi gemi segmenti.", example:"Handysize kuru yuk gemileri cok yaygindir."},
  {term:"Havuz Sorveyi", meaning:"Geminin havuza alinarak su alti kisimlarinin kontrol edilmesi.", example:"Havuz sorveyinde deniz sandigi da incelendi."},
  {term:"Hazirlik Mektubu", meaning:"Notice of Readiness; geminin yuklemeye veya tahliyeye hazir oldugunu bildiren mektup.", example:"NOR zamani laytime hesabini etkiler."},
  {term:"Hedefe", meaning:"Pusula ustune takilarak kerteriz almaya yarayan alet.", example:"Hedefe ile fener kerterizi alindi."},
  {term:"Hirca", meaning:"Zincirin zincirlikteki ucu; bitter end.", example:"Hirca baglantisi emniyet kontrolunden gecti."},
  {term:"Hisa Etmek", meaning:"Bir seyi yukariya veya karsi tarafa kuvvetle cekmek.", example:"Mataforayi biraz daha hisa ettiler."},
  {term:"IMO", meaning:"International Maritime Organization.", example:"SOLAS ve MARPOL gibi kurallar IMO catisinda yurur."},
  {term:"ILO", meaning:"International Labour Organization.", example:"MLC tarafinda ILO belgeleri de onemlidir."},
  {term:"Irgat", meaning:"Demir alma ve baglama islerinde kullanilan mekanizma; windlass.", example:"Irgat freni kontrol edilmeden demir verilmez."},
  {term:"Iskandil", meaning:"Deniz derinligini olcmek icin kullanilan alet.", example:"Pilot oncesi iskandil verisi tekrar alindi."},
  {term:"Iskandil Kursunu", meaning:"Iskandil savlosunun ucundaki agir kursun.", example:"El iskandilinde kursun dibin cinsini de hissettirir."},
  {term:"ISM", meaning:"International Safety Management Code.", example:"ISM kulturu sadece evrak degil, emniyet davranisidir."},
  {term:"India (Istif)", meaning:"Uluslararasi isaret sancaklarinda I harfi; rotami iskeleye degistiriyorum.", example:"Manevrada India sancagi niyet bildirir."},
  {term:"Iskele", meaning:"Geminin sol tarafi veya giris-cikis merdiveni/jetty.", example:"Iskele bordada trafik daha yogundu."},
  {term:"Iskota", meaning:"Yelkenin iskota yakasini kullanmaya yarayan halat donanimi.", example:"Iskota bosalinca yelken guc kaybetti."},
  {term:"J (Juliet-Jale)", meaning:"Uluslararasi isaret sancaklarinda J harfi; yaniyorum ve gemide tehlikeli yuk var, benden neta bulununuz.", example:"Yangin senaryolarinda J sancagi anlatilir."},
  {term:"Jurnal", meaning:"Gemiyle ilgili bilgilerin yazildigi seyir defteri.", example:"Bogaz gecisinde jurnale saat saat not dusuldu."},
  {term:"K (Kilo-Kalyon)", meaning:"Uluslararasi isaret sancaklarinda K harfi; sizinle haberlesmek istiyorum.", example:"Isaret sancagiyla K gosterildiginde telsiz de acik tutulur."},
  {term:"Kabotaj", meaning:"Bir ulkenin kendi karasularinda kendi bayrakli gemilerine tanidigi tasimacilik hakki.", example:"Kabotaj kurallari hatta gore degisir."},
  {term:"Kalafat", meaning:"Kaplama ve doseme aralarini ustupu ve ziftle sizdirmaz yapma islemi.", example:"Ahsap teknede kalafat iyi degilse armuzdan su alir."},
  {term:"Kaloma", meaning:"Demirdeki zincir mesafesi; bosluk veya tolerans.", example:"Ruzgar artinca biraz daha kaloma verildi."},
  {term:"Kamara", meaning:"Gemiadami veya yolcularin kaldigi oda.", example:"Uzun vardiyadan sonra kamaraya cekildik."},
  {term:"Kamarot", meaning:"Servis ve kamara duzeniyle ilgilenen gemiadami.", example:"Kamarot mesaide salona cay getirdi."},
  {term:"Kana Rakamlar i", meaning:"Geminin draftini gosteren draft marks.", example:"Kana rakamlari dalga arasinda dikkatle okunur."},
  {term:"Kancello", meaning:"Geminin yuklemeye hazir olmasi gereken son tarih.", example:"Kancello kacarsa charter feshe gidebilir."},
  {term:"Kandilisa", meaning:"Yelkenleri yukariya kaldirmakta kullanilan halat.", example:"Flok kandilisasi asindiysa yenilenir."},
  {term:"Kaplama", meaning:"Postalar uzerine boyuna kaplanan sac veya tahta.", example:"Kaplama sacinda ezik goruldu."},
  {term:"Kaporta", meaning:"Guverteden asagi inis cikisin uzerindeki kapali kisim; skylight/companionway.", example:"Yagmur baslayinca kaportalar kapatildi."},
  {term:"Lashing", meaning:"Yuku yerinde tutmak icin kullanilan baglama ve sabitleme duzeni.", example:"Agir hava oncesi lashing gerginligi yeniden kontrol edildi."},
  {term:"Laytime", meaning:"Yukleme veya tahliye icin charter party ile verilen sure.", example:"NOR saati laytime hesabinda baslangic noktasi olabilir."},
  {term:"Leeway", meaning:"Ruzgar etkisiyle geminin yan kaymasi.", example:"Kuvvetli ruzgarda leeway rota hattini bozmaya basladi."},
  {term:"Loadicator", meaning:"Geminin yukleme ve stabilite bilgisini hesaplayan yazilim veya sistem.", example:"Loadicator alarm verince veri girisi tekrar kontrol edildi."},
  {term:"GPS Quality Control", meaning:"GPS/GNSS pozisyonunun sagligini; DOP, RAIM, sensor source, position jump ve cross-check mantigiyla degerlendirme disiplini.", example:"GPS quality control zayifsa ECDIS pozisyonunu radar ve visual ile capraz kontrol ederiz."},
  {term:"Load Line", meaning:"Geminin mevsim ve su yogunluguna gore yukleme sinirini gosteren isaret.", example:"Tropical mark ustune cikmak ciddi ihlaldir."},
  {term:"Logbook", meaning:"Seyir, olay ve vardiya kayitlarinin tutuldugu resmi defter.", example:"Kaptan jurnal ve logbook kayitlarini birlikte kontrol etti."},
  {term:"Lostromo", meaning:"Guverte tayfasinin basi olan boatswain.", example:"Lostromo mooring station dagilimini net verdi."},
  {term:"Lumboz", meaning:"Gemilerdeki yuvarlak veya oval pencere acikligi.", example:"Lumbozlar agir havada tam kapali tutuldu."},
  {term:"Magnetic Compass", meaning:"Manyetik kuzeye gore yon gosteren klasik pusula.", example:"Gyro saptiginda magnetic compass ile capraz kontrol yapildi."},
  {term:"Mapa", meaning:"Halat, sapan veya donanim baglamak icin kullanilan metal goz.", example:"Sapan mapasi yuk altina girmeden kontrol edildi."},
  {term:"Matafora", meaning:"Filika veya bot indirip kaldirmada kullanilan kol sistemi.", example:"Matafora pimi drill oncesi kontrol edildi."},
  {term:"Mayday", meaning:"Hayati tehlike veya ciddi tehlikede kullanilan distress cagrisi.", example:"Yangin yayilsa MAYDAY mesaji gecilmesi gerekirdi."},
  {term:"Mevki", meaning:"Geminin o anki pozisyonu.", example:"Mevki raporu verilmeden trafik yorumlanmaz."},
  {term:"Mizana", meaning:"Kic tarafa yakin direk veya ona ait yelken.", example:"Mizana acisi teknenin dengesini etkiledi."},
  {term:"Mooring", meaning:"Geminin iskeleye, rıhtıma veya babalara halatlarla baglanmasi.", example:"Mooring station snap-back zone konusunda uyarildi."},
  {term:"Breast Line", meaning:"Gemiyi rihtima dogru ceken ve bordayi paralel tutan baglama halati.", example:"Breast line gevsek kalinca gemi ruzgarla disari acmaya basladi."},
  {term:"Aft Spring", meaning:"Kic taraftan basa dogru capraz verilen spring halati.", example:"Aft spring gerginlestirilince kic tarafi daha sakin oturdu."},
  {term:"Stern Line", meaning:"Geminin kic tarafindan geriye veya uygun babaya verilen baglama halati.", example:"Stern line gec verilince kic ruzgarla acmaya meyletti."},
  {term:"Mors", meaning:"Nokta ve cizgilerle yapilan isaretlesme sistemi.", example:"SOS mors kodu hala temel bilgi sayilir."},
  {term:"NAVTEX", meaning:"Seyir uyarilari, hava ve emniyet mesajlarini alan otomatik sistem.", example:"Yeni NAVTEX mesaji warning mi safety mi diye yorumlandi."},
  {term:"No-Go Area", meaning:"Girilmesi emniyetsiz veya yasak kabul edilen harita alani.", example:"ECDIS route check no-go area uyarisi verdi."},
  {term:"Oil Record Book", meaning:"Yagli operasyon ve transferlerin kaydedildigi resmi defter.", example:"PSC once Oil Record Book satirlarini inceledi."},
  {term:"Omurga", meaning:"Geminin ana tasiyici ekseni olan keel.", example:"Omurga hattindaki hasar cok ciddiye alinir."},
  {term:"ORB", meaning:"Oil Record Book kisaltmasi.", example:"ORB ile tank operasyon saatleri uyusmaliydi."},
  {term:"PAN-PAN", meaning:"Acil ama hayati tehlike seviyesine cikmamis durumlar icin urgency cagrisi.", example:"Tibbi danisma ihtiyacinda PAN-PAN tercih edilebilir."},
  {term:"Parakete", meaning:"Hiz veya derinlik gibi bilgileri olcmekte kullanilan hat/duzenek; geleneksel seyir araci.", example:"Eski denizcilikte parakete ile hiz tutulurdu."},
  {term:"Pilot Card", meaning:"Pilota verilen, geminin manevra ve teknik ozelliklerini ozetleyen kart.", example:"Pilot card guncel draft ve makine bilgisini icermelidir."},
  {term:"Pruva", meaning:"Geminin on tarafi, baktigi yon.", example:"Pruvadan gelen deniz guverteyi islatmaya basladi."},
  {term:"Pruva Hatti", meaning:"Geminin bas eksen cizgisi.", example:"Hedef pru va hattina yakin gorunuyorsa dikkat artar."},
  {term:"Radar Conning", meaning:"Radar yardimiyla seyir ve trafik degerlendirmesi yapma disiplini.", example:"Sis bastiginda radar conning daha kritik hale geldi."},
  {term:"Rota", meaning:"Geminin takip edecegi planli gidis hatti.", example:"Yeni rota ECDIS ve kagit haritada ayni mantikla kontrol edildi."},
  {term:"Ruzgaralti", meaning:"Ruzgarin geldigi yonun tersi tarafta kalan kisim.", example:"Can filikasi ruzgaralti tarafta daha rahat hazirlandi."},
  {term:"Safety Contour", meaning:"ECDIS uzerinde gemi draftina gore emniyetli derinlik siniri.", example:"Safety contour yanlis girilirse gereksiz ya da eksik alarm alirsin."},
  {term:"Salpa", meaning:"Demirin deniz dibinden kurtulup zincire bindigi veya denizde serbest durumda oldugu hal.", example:"Demir salpa olunca zincir dogruldu."},
  {term:"Samandira", meaning:"Seyir veya isaret amaciyla denizde bulunan yuzer isaret.", example:"Iskele sancak lateral samandiralari dogru okumak gerekir."},
  {term:"Sancak", meaning:"Geminin sag tarafi.", example:"Sancak bordada yesil seyir feneri yanar."},
  {term:"Sancak Alabanda", meaning:"Dumenin tam sancaga basilmasi.", example:"Kaptan sancak alabanda komutunu net verdi."},
  {term:"SART", meaning:"Search and Rescue Transponder; arama kurtarmada radar hedefi veren cihaz.", example:"SART test tarihi can kurtarma denetiminde sorulabilir."},
  {term:"SECURITE", meaning:"Seyir veya hava emniyetiyle ilgili mesajlari duyurmakta kullanilan emniyet cagrisi.", example:"Firtina uyarisi yayinlanirken SECURITE on eki kullanilir."},
  {term:"Sekstant", meaning:"Gok cisimleri veya cisimler arasi aci olcmeye yarayan seyir aleti.", example:"Sekstantla meridian altitude denemesi yaptik."},
  {term:"Serbest Yuzey Etkisi", meaning:"Slack tanklardaki serbest sivinin stabiliteyi azaltan etkisi.", example:"Serbest yuzey etkisi corrected GM degerini dusurdu."},
  {term:"SOPEP", meaning:"Shipboard Oil Pollution Emergency Plan.", example:"Bunker oncesi SOPEP ekipmani hazir edildi."},
  {term:"Spring", meaning:"Geminin ileri-geri hareketini tutmak icin capraz verilen baglama halati.", example:"Son spring gergin degilse gemi kayabilir."},
  {term:"STCW", meaning:"Standards of Training, Certification and Watchkeeping sozlesmesi.", example:"STCW vardiya ve yeterlilik tarafini belirler."},
  {term:"Statement of Facts", meaning:"Liman operasyon saatlerini ve olaylarini kaydeden belge.", example:"SOF ile logbook saatleri birbirini desteklemelidir."},
  {term:"Twist Lock", meaning:"Konteynerleri yerinde kilitleyen baglanti parcasi.", example:"Twist lock eksigi lashing kadar kritik olabilir."},
  {term:"Ullage", meaning:"Tankta sivi seviyesinin tavana olan bos mesafesi.", example:"Ullage tablosu sounding kadar dikkat ister."},
  {term:"Vardiya", meaning:"Belirli saat araliginda gemi gorev ve nobet duzeni.", example:"00-04 vardiyasi yorgunluk yonetimi ister."},
  {term:"VHF", meaning:"Cok kullanilan deniz telsizi haberlesme sistemi.", example:"Pilotla ilk temas genelde VHF uzerinden kurulur."},
  {term:"Vira", meaning:"Halat, zincir veya demiri iceri alma, yukari cekme komutu.", example:"Demiri vira ederken fren sicakligi izlendi."},
  {term:"Volta", meaning:"Halati baba veya mapaya uygun sekilde dolama ve emniyete alma.", example:"Yanlis volta altinda halat kayabilir."},
  {term:"Weather Routing", meaning:"Hava durumuna gore rota optimizasyonu yapma.", example:"Agir hava oncesi weather routing tavsiyesi dikkate alindi."},
  {term:"X-Band Radar", meaning:"Kisa dalga boylu, detayli hedef gosterebilen radar tipi.", example:"Yakin trafik icin X-band radar daha net goruntu verdi."},
  {term:"Yeke", meaning:"Dumeni elle cevirmeye yarayan kol veya duzenek.", example:"Acil durumda yeke kontrolu anlatildi."},
  {term:"Yukleme Hatti", meaning:"Geminin mevsim ve su yogunluguna gore yukleme siniri.", example:"Yukleme hatti asilmadan operasyon durduruldu."},
  {term:"Zabit", meaning:"Gemide zabit sinifindaki gorevli denizci.", example:"Vardiya zabiti rota degisikligini kaptana aktardi."},
  {term:"Zincirlik", meaning:"Demir zincirinin toplandigi bolme.", example:"Zincirlik temiz ve neta tutulmazsa sorun cikar."}
];
let notesTab = 'kurallar';
let notesSearch = '';
let selectedGlossaryTerm = GLOSSARY_TERMS[0]?.term || '';
let selectedGlossaryCategory = 'tum';
let currentNoteTopics = new Set();
const GLOSSARY_CATEGORIES = ['tum','seyir','demirleme','yelken','evrak','emniyet','yapi','yuk'];

function getNoteCategory(note){
  if(note.head.includes('FORMULLER')) return 'formuller';
  if(note.head.includes('SOZLUGU')) return 'sozluk';
  return 'kurallar';
}

function knotSvg(type){
  const wrap=(inner,label='')=>`<svg class="knot-svg" viewBox="0 0 220 110" xmlns="http://www.w3.org/2000/svg">${inner}${label?`<text x="12" y="100">${label}</text>`:''}</svg>`;
  switch(type){
    case 'kazik':
      return wrap(`<rect class="post" x="148" y="18" width="18" height="74" rx="4"/><path class="rope-a" d="M18 58 C56 58,74 58,103 58 C118 58,132 56,148 54 C173 52,176 76,149 74 C126 73,118 48,147 43 C168 39,183 49,200 58"/><path class="rope-b" d="M18 58 C56 58,74 58,103 58 C118 58,132 56,148 54 C173 52,176 76,149 74 C126 73,118 48,147 43 C168 39,183 49,200 58"/>`,'Kaziga hizli sabitleme');
    case 'izbarco':
      return wrap(`<path class="rope-a" d="M22 68 C42 34,84 24,111 44 C134 61,127 90,95 90 C66 90,52 68,68 50 C86 29,131 33,166 62"/><path class="rope-a" d="M146 55 C120 48,104 60,101 76"/><path class="rope-b" d="M22 68 C42 34,84 24,111 44 C134 61,127 90,95 90 C66 90,52 68,68 50 C86 29,131 33,166 62"/><path class="rope-b" d="M146 55 C120 48,104 60,101 76"/>`,'Gecici kasa / sabit halka');
    case 'camadan':
      return wrap(`<path class="rope-a" d="M18 42 C48 42,60 44,84 56 C104 66,126 68,200 66"/><path class="rope-a" d="M18 68 C50 68,64 66,86 54 C109 42,126 40,200 42"/><path class="rope-b" d="M18 42 C48 42,60 44,84 56 C104 66,126 68,200 66"/><path class="rope-b" d="M18 68 C50 68,64 66,86 54 C109 42,126 40,200 42"/>`,'Ayni capta iki halati birlestirir');
    case 'sancak':
      return wrap(`<circle class="ring" cx="54" cy="55" r="20"/><path class="rope-a" d="M198 50 C148 50,128 50,100 51 C83 52,74 49,54 35 C37 25,26 32,34 46 C45 65,72 73,101 69 C126 66,156 64,198 64"/><path class="rope-b" d="M198 50 C148 50,128 50,100 51 C83 52,74 49,54 35 C37 25,26 32,34 46 C45 65,72 73,101 69 C126 66,156 64,198 64"/>`,'Kasaya veya halkaya baglanir');
    case 'kropi':
      return wrap(`<path class="rope-a" d="M18 56 C66 56,94 56,120 56"/><path class="rope-a" d="M118 56 C132 36,148 36,159 56 C145 76,129 76,118 56"/><path class="rope-b" d="M18 56 C66 56,94 56,120 56"/><path class="rope-b" d="M118 56 C132 36,148 36,159 56 C145 76,129 76,118 56"/>`,'Cimanin kacmasini onler');
    case 'dulger':
      return wrap(`<circle class="ring" cx="82" cy="54" r="22"/><path class="rope-a" d="M198 36 C155 36,130 36,108 42 C88 48,76 61,90 72 C106 83,134 78,198 78"/><path class="rope-a" d="M104 42 C100 58,104 67,118 74"/><path class="rope-b" d="M198 36 C155 36,130 36,108 42 C88 48,76 61,90 72 C106 83,134 78,198 78"/><path class="rope-b" d="M104 42 C100 58,104 67,118 74"/>`,'Mapa / anele icin guvenli bag');
    case 'cifte_sancak':
      return wrap(`<circle class="ring" cx="48" cy="55" r="18"/><path class="rope-a" d="M200 46 C147 46,126 46,96 50 C79 53,70 48,50 37 C35 28,28 37,35 46 C43 56,55 62,71 64 C58 68,50 75,58 82 C70 90,94 84,200 72"/><path class="rope-b" d="M200 46 C147 46,126 46,96 50 C79 53,70 48,50 37 C35 28,28 37,35 46 C43 56,55 62,71 64 C58 68,50 75,58 82 C70 90,94 84,200 72"/>`,'Sancak baginin daha emniyetli hali');
    case 'cifte_kazik':
      return wrap(`<rect class="post" x="148" y="18" width="18" height="74" rx="4"/><path class="rope-a" d="M18 58 C60 58,82 58,110 58 C122 58,134 55,148 52 C172 49,178 66,160 70 C147 73,136 69,130 58 C136 46,149 42,160 43 C177 44,180 61,166 65 C157 68,151 67,148 66 C134 64,123 62,110 62 C82 62,60 62,18 62"/><path class="rope-b" d="M18 58 C60 58,82 58,110 58 C122 58,134 55,148 52 C172 49,178 66,160 70 C147 73,136 69,130 58 C136 46,149 42,160 43 C177 44,180 61,166 65 C157 68,151 67,148 66 C134 64,123 62,110 62 C82 62,60 62,18 62"/>`,'Kazik baginin cift dolamasi');
    case 'curuk':
      return wrap(`<path class="rope-a" d="M18 56 C58 56,86 56,106 56"/><path class="rope-a" d="M104 56 C120 35,144 34,159 56 C144 78,120 77,104 56"/><path class="rope-a" d="M156 56 C171 56,183 56,200 56"/><path class="rope-b" d="M18 56 C58 56,86 56,106 56"/><path class="rope-b" d="M104 56 C120 35,144 34,159 56 C144 78,120 77,104 56"/><path class="rope-b" d="M156 56 C171 56,183 56,200 56"/><path d="M86 38 L94 74" stroke="#c97070" stroke-width="3"/><path d="M90 38 L98 74" stroke="#c97070" stroke-width="3" opacity=".6"/>`,'Zayif kismi by-pass eder');
    case 'balikci':
      return wrap(`<path class="rope-a" d="M18 44 C46 44,60 46,76 58 C88 67,102 70,122 70"/><path class="rope-a" d="M202 66 C174 66,160 64,144 52 C132 43,118 40,98 40"/><path class="rope-b" d="M18 44 C46 44,60 46,76 58 C88 67,102 70,122 70"/><path class="rope-b" d="M202 66 C174 66,160 64,144 52 C132 43,118 40,98 40"/><path class="rope-a" d="M70 56 C79 43,92 42,100 54 C92 66,79 67,70 56"/><path class="rope-a" d="M120 54 C129 41,142 40,150 52 C142 64,129 65,120 54"/><path class="rope-b" d="M70 56 C79 43,92 42,100 54 C92 66,79 67,70 56"/><path class="rope-b" d="M120 54 C129 41,142 40,150 52 C142 64,129 65,120 54"/>`,'Iki cimanin karsilikli emniyet bagi');
    default:
      return wrap(`<path class="rope-a" d="M18 55 C62 55,92 55,202 55"/><path class="rope-b" d="M18 55 C62 55,92 55,202 55"/>`);
  }
}

function buildKnotGallery(){
  const intro = `<b>Dugum</b>: Denizcilikte kullanilan baglara bazen yanlis olarak dugum denir; dugum aslinda bir bag formudur.<br><br>`;
  const knots = [
    {name:'Kazik Bagi', type:'kazik', desc:'Bir halati kaziga ya da ince bir halati kalin bir halata baglamak icin kullanilir. Cabuk yapilir; yuk altinda guzel sikisir.'},
    {name:'Izbarco', type:'izbarco', desc:'Halatin cimasinda gecici bir kasa olusturur. Yelken iskolalari, mandar ve sayisiz baglama isinde gorulur.'},
    {name:'Camadan', type:'camadan', desc:'Ayni capta iki halati birlestirmek icin kullanilir. Yuk binince krozu icinde guzel kilitlenir.'},
    {name:'Sancak Bagi', type:'sancak', desc:'Iskota bagi olarak da anilir. Bir halatin cimasini kasaya ya da baska bir halata baglamakta kullanilir.'},
    {name:'Kropi', type:'kropi', desc:'Halatin cimasinin delik, koÃ§ boya ya da makaradan kacmasini onlemek icin cimanin ucuna atilir.'},
    {name:'Dulger', type:'dulger', desc:'Mapaya, analeye ya da bir guverte yapisina baglamak icin teknelerde en cok gorulen baglardandir.'},
    {name:'Cifte Sancak', type:'cifte_sancak', desc:'Sancak bagi ile ayni amaca hizmet eder ama daha guclu ve daha emniyetli bir tutus verir.'},
    {name:'Cifte Kazik', type:'cifte_kazik', desc:'Kazik baginin cift dolamali daha saglam versiyonudur; daha emniyetli tutar.'},
    {name:'Curuk Bagi', type:'curuk', desc:'Halat bedeni uzerindeki curuk ya da zayif kismi by-pass etmek icin kullanilir.'},
    {name:'Balikci Bagi', type:'balikci', desc:'Iki halatin cimalarini, ozellikle misina ve ince ipleri birbirine baglamak icin kullanilir.'}
  ];
  return intro + `<div class="knot-grid">${knots.map(k=>`<div class="knot-card">${knotSvg(k.type)}<div class="knot-name">${k.name}</div><div class="knot-desc">${k.desc}</div></div>`).join('')}</div>`;
}

function buildShipPartsDiagram(){
  return `<div class="shipparts-card">
    <svg class="shipparts-svg" viewBox="0 0 420 240" xmlns="http://www.w3.org/2000/svg" aria-label="Geminin kisimlari">
      <defs>
        <linearGradient id="shipSky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#0d2238"/>
          <stop offset="100%" stop-color="#08121d"/>
        </linearGradient>
        <linearGradient id="shipHull" x1="0" x2="1">
          <stop offset="0%" stop-color="#1f4467"/>
          <stop offset="55%" stop-color="#15344f"/>
          <stop offset="100%" stop-color="#294d72"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="420" height="240" rx="12" fill="url(#shipSky)"/>
      <circle cx="350" cy="38" r="16" fill="#d3aa54" opacity=".15"/>
      <path d="M0 168 Q54 160 108 168 T216 168 T324 168 T420 168 V240 H0 Z" fill="#0c2946"/>
      <path d="M0 182 Q35 176 70 182 T140 182 T210 182 T280 182 T350 182 T420 182 V240 H0 Z" fill="#103554" opacity=".92"/>
      <path d="M22 160 L62 138 L96 128 L318 128 L342 133 L368 145 L392 161 L388 172 L30 172 Z" fill="url(#shipHull)" stroke="#5f86aa" stroke-width="1.6"/>
      <path d="M64 132 L112 132 L124 118 L188 118 L188 128 L64 128 Z" fill="#244e73" stroke="#6f93b5" stroke-width="1"/>
      <path d="M112 123 L120 98 L252 98 L252 128 L112 128 Z" fill="#2b567d" opacity=".4"/>
      <rect x="120" y="118" width="52" height="14" rx="2" fill="#4f697f"/>
      <rect x="176" y="118" width="52" height="14" rx="2" fill="#4f697f"/>
      <rect x="232" y="118" width="52" height="14" rx="2" fill="#4f697f"/>
      <rect x="288" y="118" width="30" height="14" rx="2" fill="#4f697f"/>
      <rect x="274" y="72" width="56" height="26" rx="3" fill="#dde5ec" stroke="#67829d" stroke-width="1"/>
      <rect x="286" y="56" width="30" height="16" rx="2" fill="#dde5ec" stroke="#67829d" stroke-width="1"/>
      <rect x="282" y="80" width="8" height="7" fill="#4b657f"/>
      <rect x="293" y="80" width="8" height="7" fill="#4b657f"/>
      <rect x="304" y="80" width="8" height="7" fill="#4b657f"/>
      <rect x="315" y="80" width="8" height="7" fill="#4b657f"/>
      <rect x="336" y="58" width="13" height="40" rx="2" fill="#304b64"/>
      <rect x="341" y="35" width="3" height="23" fill="#8eb2d1"/>
      <rect x="349" y="70" width="21" height="9" rx="2" fill="#c88a3b"/>
      <path d="M72 135 L80 119" stroke="#7f9ebb" stroke-width="2"/>
      <path d="M132 117 L132 94" stroke="#90aeca" stroke-width="1.8"/>
      <path d="M188 117 L188 94" stroke="#90aeca" stroke-width="1.8"/>
      <path d="M244 117 L244 94" stroke="#90aeca" stroke-width="1.8"/>
      <path d="M300 117 L300 94" stroke="#90aeca" stroke-width="1.8"/>
      <path d="M28 171 L19 190" stroke="#bfd2df" stroke-width="2"/>
      <circle cx="16" cy="198" r="8" fill="none" stroke="#bfd2df" stroke-width="2"/>
      <path d="M390 171 Q396 178 395 188" stroke="#a9c0d3" stroke-width="2" fill="none"/>
      <path d="M392 170 Q404 177 403 191" stroke="#a9c0d3" stroke-width="1.6" fill="none" opacity=".8"/>
      <rect x="48" y="126" width="14" height="5" rx="1" fill="#c5d2de"/>
      <rect x="58" y="122" width="5" height="11" rx="1" fill="#c5d2de"/>
      <path d="M376 167 q9 4 12 12 q-12 3 -19 -3 q2 -7 7 -9Z" fill="#9eb8cc" stroke="#c9d9e5" stroke-width="1"/>
      <path d="M381 168 L381 182" stroke="#dce7ef" stroke-width="1"/>
      <path d="M365 153 L371 153 L371 170 L365 170 Z" fill="#7f9fbb"/>
      <path d="M74 139 L77 126 L89 126 L86 139 Z" fill="#5d7890"/>
      <path d="M64 138 L76 129 L83 129 L71 138 Z" fill="#8aa7c2"/>
      <path d="M41 151 L41 168" stroke="#d6e2ec" stroke-width="1.5"/>
      <path d="M41 151 L46 147" stroke="#d6e2ec" stroke-width="1.5"/>
      <path d="M41 159 L46 155" stroke="#d6e2ec" stroke-width="1.5"/>
      <path d="M384 152 L384 168" stroke="#d6e2ec" stroke-width="1.5"/>
      <path d="M384 152 L389 148" stroke="#d6e2ec" stroke-width="1.5"/>
      <path d="M384 160 L389 156" stroke="#d6e2ec" stroke-width="1.5"/>
      <text x="14" y="23" fill="#8ab0c8" font-size="8" font-family="monospace">ISKELE</text>
      <text x="349" y="23" fill="#8ab0c8" font-size="8" font-family="monospace">SANCAK</text>
      <g class="shipparts-hotspot" data-part="bas" tabindex="0">
        <circle cx="70" cy="154" r="11" fill="rgba(212,160,23,.18)" stroke="#d4a017" stroke-width="1.6"/>
        <text x="65" y="158" fill="#f4e7b4" font-size="10" font-family="monospace">1</text>
      </g>
      <g class="shipparts-hotspot" data-part="forecastle" tabindex="0">
        <circle cx="104" cy="126" r="11" fill="rgba(212,160,23,.18)" stroke="#d4a017" stroke-width="1.6"/>
        <text x="99" y="130" fill="#f4e7b4" font-size="10" font-family="monospace">2</text>
      </g>
      <g class="shipparts-hotspot" data-part="cargo" tabindex="0">
        <circle cx="206" cy="125" r="11" fill="rgba(212,160,23,.18)" stroke="#d4a017" stroke-width="1.6"/>
        <text x="201" y="129" fill="#f4e7b4" font-size="10" font-family="monospace">3</text>
      </g>
      <g class="shipparts-hotspot" data-part="bridge" tabindex="0">
        <circle cx="302" cy="71" r="11" fill="rgba(212,160,23,.18)" stroke="#d4a017" stroke-width="1.6"/>
        <text x="297" y="75" fill="#f4e7b4" font-size="10" font-family="monospace">4</text>
      </g>
      <g class="shipparts-hotspot" data-part="funnel" tabindex="0">
        <circle cx="344" cy="78" r="11" fill="rgba(212,160,23,.18)" stroke="#d4a017" stroke-width="1.6"/>
        <text x="339" y="82" fill="#f4e7b4" font-size="10" font-family="monospace">5</text>
      </g>
      <g class="shipparts-hotspot" data-part="engine" tabindex="0">
        <circle cx="320" cy="142" r="11" fill="rgba(212,160,23,.18)" stroke="#d4a017" stroke-width="1.6"/>
        <text x="315" y="146" fill="#f4e7b4" font-size="10" font-family="monospace">6</text>
      </g>
      <g class="shipparts-hotspot" data-part="poop" tabindex="0">
        <circle cx="348" cy="141" r="11" fill="rgba(212,160,23,.18)" stroke="#d4a017" stroke-width="1.6"/>
        <text x="343" y="145" fill="#f4e7b4" font-size="10" font-family="monospace">7</text>
      </g>
      <g class="shipparts-hotspot" data-part="stern" tabindex="0">
        <circle cx="382" cy="157" r="11" fill="rgba(212,160,23,.18)" stroke="#d4a017" stroke-width="1.6"/>
        <text x="377" y="161" fill="#f4e7b4" font-size="10" font-family="monospace">8</text>
      </g>
      <g class="shipparts-hotspot" data-part="hawse" tabindex="0">
        <circle cx="24" cy="192" r="11" fill="rgba(138,176,200,.18)" stroke="#8ab0c8" stroke-width="1.6"/>
        <text x="19" y="196" fill="#dceaf4" font-size="10" font-family="monospace">9</text>
      </g>
      <g class="shipparts-hotspot" data-part="deck" tabindex="0">
        <circle cx="230" cy="151" r="11" fill="rgba(138,176,200,.18)" stroke="#8ab0c8" stroke-width="1.6"/>
        <text x="222" y="155" fill="#dceaf4" font-size="9" font-family="monospace">10</text>
      </g>
      <g class="shipparts-hotspot" data-part="keel" tabindex="0">
        <circle cx="220" cy="186" r="11" fill="rgba(138,176,200,.18)" stroke="#8ab0c8" stroke-width="1.6"/>
        <text x="212" y="190" fill="#dceaf4" font-size="9" font-family="monospace">11</text>
      </g>
      <g class="shipparts-hotspot" data-part="windlass" tabindex="0">
        <circle cx="58" cy="118" r="10" fill="rgba(212,160,23,.18)" stroke="#d4a017" stroke-width="1.5"/>
        <text x="53" y="122" fill="#f4e7b4" font-size="9" font-family="monospace">12</text>
      </g>
      <g class="shipparts-hotspot" data-part="bulwark" tabindex="0">
        <circle cx="155" cy="140" r="10" fill="rgba(138,176,200,.18)" stroke="#8ab0c8" stroke-width="1.5"/>
        <text x="150" y="144" fill="#dceaf4" font-size="9" font-family="monospace">13</text>
      </g>
      <g class="shipparts-hotspot" data-part="draftmarks" tabindex="0">
        <circle cx="34" cy="160" r="10" fill="rgba(138,176,200,.18)" stroke="#8ab0c8" stroke-width="1.5"/>
        <text x="29" y="164" fill="#dceaf4" font-size="9" font-family="monospace">14</text>
      </g>
      <g class="shipparts-hotspot" data-part="rudder" tabindex="0">
        <circle cx="364" cy="175" r="10" fill="rgba(212,160,23,.18)" stroke="#d4a017" stroke-width="1.5"/>
        <text x="359" y="179" fill="#f4e7b4" font-size="9" font-family="monospace">15</text>
      </g>
      <g class="shipparts-hotspot" data-part="propeller" tabindex="0">
        <circle cx="392" cy="183" r="10" fill="rgba(212,160,23,.18)" stroke="#d4a017" stroke-width="1.5"/>
        <text x="387" y="187" fill="#f4e7b4" font-size="9" font-family="monospace">16</text>
      </g>
    </svg>
    <div class="shipparts-legend">
      <button class="shipparts-chip" type="button" data-part="bas">1 Pruva / Bas</button>
      <button class="shipparts-chip" type="button" data-part="forecastle">2 Bas Kasarasi</button>
      <button class="shipparts-chip" type="button" data-part="cargo">3 Ambar / Hatch</button>
      <button class="shipparts-chip" type="button" data-part="bridge">4 Kopruustu</button>
      <button class="shipparts-chip" type="button" data-part="funnel">5 Baca / Ust Yapi</button>
      <button class="shipparts-chip" type="button" data-part="engine">6 Makine Dairesi</button>
      <button class="shipparts-chip" type="button" data-part="poop">7 Kic Ustu</button>
      <button class="shipparts-chip" type="button" data-part="stern">8 Kic</button>
      <button class="shipparts-chip" type="button" data-part="hawse">9 Demir Locasi</button>
      <button class="shipparts-chip" type="button" data-part="deck">10 Ana Guverte</button>
      <button class="shipparts-chip" type="button" data-part="keel">11 Omurga</button>
      <button class="shipparts-chip" type="button" data-part="windlass">12 Irgat / Windlass</button>
      <button class="shipparts-chip" type="button" data-part="bulwark">13 Bulwark / Sancaklik</button>
      <button class="shipparts-chip" type="button" data-part="draftmarks">14 Draft Markalari</button>
      <button class="shipparts-chip" type="button" data-part="rudder">15 Rudder</button>
      <button class="shipparts-chip" type="button" data-part="propeller">16 Pervane</button>
    </div>
    <div class="shipparts-detail" data-active-ship-part="bridge">
      <div class="shipparts-detail-head">Kopruustu</div>
      <div class="shipparts-detail-body">Geminin sevk ve idaresinin yapildigi mahaldir. Radar, ECDIS, pusulalar, VHF/GMDSS ekipmanlari ve vardiya zabitinin ana kontrol noktasi burada bulunur.</div>
    </div>
  </div>`;
}

const SHIP_PARTS_INFO = {
  bas:{
    head:'Pruva / Bas',
    body:'Geminin ileri ucudur. Denizleri ilk karsilayan kisim oldugu icin sekli denize girisi, vuruntuyu ve dalgayi nasil yardigini etkiler.'
  },
  forecastle:{
    head:'Bas Kasarasi',
    body:'Pruva tarafindaki yuksek bolumdur. Irgat, palamar ekipmani, zincir ve demir operasyonlari burada yogunlasir.'
  },
  cargo:{
    head:'Ambar / Hatch Cover',
    body:'Yukun tasindigi kapali hacim ambar, ustundeki kapak sistemi hatch cover olarak anilir. Yukun emniyeti, su gecirmezlik ve ventilasyon burada kritik olur.'
  },
  bridge:{
    head:'Kopruustu',
    body:'Geminin sevk ve idaresinin yapildigi mahaldir. Radar, ECDIS, pusulalar, VHF/GMDSS ekipmanlari ve vardiya zabitinin ana kontrol noktasi burada bulunur.'
  },
  funnel:{
    head:'Baca / Ust Yapi',
    body:'Makine egzoz cikisi, havalandirma ve bazi servis mahalleri ust yapida toplanir. Geminin dis siluetinde tipini en hizli veren bolgelerden biridir.'
  },
  engine:{
    head:'Makine Dairesi',
    body:'Ana makine, jeneratörler, separatorler, pompalar ve yardimci sistemler burada bulunur. Sicaklik, gürültü ve vardiya disiplini genelde en yogun mahaldir.'
  },
  poop:{
    head:'Kic Ustu / Poop Deck',
    body:'Kic taraftaki yuksek calisma/alansal bolumdur. Palamar operasyonlari, kic manevralari ve ekipman depolari acisindan onemlidir.'
  },
  stern:{
    head:'Kic',
    body:'Geminin arka ucudur. Manevrada pervane akimi, rudder etkisi ve iz suyu davranisi burada daha belirgin hissedilir.'
  },
  hawse:{
    head:'Demir Locasi / Hawse Pipe',
    body:'Demir zincirinin gemi icinden gectigi yapidir. Demirleme, vira/fundo ve zincir markasi takibinde bu bolgeye cok dikkat edilir.'
  },
  deck:{
    head:'Ana Guverte',
    body:'Gemi uzerindeki ana yuruyus ve calisma hattidir. Yuk operasyonu, lashing, raspa-boya, kontrol turlari ve emniyetli gecis burada yurutulur.'
  },
  keel:{
    head:'Omurga',
    body:'Teknenin ana boyuna tasiyici eksenidir. Yapisal butunlugun temeli kabul edilir; trim, hog-sag ve genel tekne davranisi anlatilirken referans olur.'
  },
  windlass:{
    head:'Irgat / Windlass',
    body:'Basta bulunan demir alma-verme makinesidir. Zincirin vira edilmesi, kaloma kontrolu ve demir operasyonlarinin emniyetli yurutulmesi icin kritik ekipmandir.'
  },
  bulwark:{
    head:'Bulwark / Sancaklik',
    body:'Guverte kenarindaki koruyucu yukselti ya da korkuluk hattidir. Personelin disariya dusmesini azaltir, dalga ve suyun guverte uzerindeki etkisini kismen keser.'
  },
  draftmarks:{
    head:'Draft Markalari',
    body:'Bas ve kicta su cekimini okumaya yarayan rakamlar ve isaretlerdir. Draft survey, yukleme kontrolu ve su cekimi raporlamasinda bunlar esas alinir.'
  },
  rudder:{
    head:'Rudder',
    body:'Geminin yone cevirmesini saglayan duzendir. Pervane akisiyla birlikte calisarak manevra kabiliyetini dogrudan etkiler; ozellikle dusuk suratte etkisi dikkatle izlenir.'
  },
  propeller:{
    head:'Pervane',
    body:'Ana makine gucunu itkiye ceviren parcadir. Gemiye ileri ya da geri yol verir; cavitation, titreşim, cekis ve iz suyu davranisi bu bolgede hissedilir.'
  }
};

function activateShipPart(part){
  const info = SHIP_PARTS_INFO[part];
  if(!info) return;
  document.querySelectorAll('.shipparts-hotspot.active,.shipparts-chip.active').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll(`.shipparts-hotspot[data-part="${part}"], .shipparts-chip[data-part="${part}"]`).forEach(el=>el.classList.add('active'));
  document.querySelectorAll('.shipparts-detail').forEach(box=>{
    box.setAttribute('data-active-ship-part', part);
    box.innerHTML = `<div class="shipparts-detail-head">${info.head}</div><div class="shipparts-detail-body">${info.body}</div>`;
  });
}

function bindShipPartsDiagram(){
  document.querySelectorAll('.shipparts-hotspot,.shipparts-chip').forEach(el=>{
    if(el.dataset.boundShipPart === '1') return;
    el.dataset.boundShipPart = '1';
    el.addEventListener('click', ()=> activateShipPart(el.dataset.part));
    el.addEventListener('keydown', ev=>{
      if(ev.key === 'Enter' || ev.key === ' '){
        ev.preventDefault();
        activateShipPart(el.dataset.part);
      }
    });
  });
  if(document.querySelector('.shipparts-detail')) activateShipPart('bridge');
}

function getGlossaryCategory(entry){
  const hay = `${entry.term} ${entry.meaning} ${entry.example}`.toLowerCase();
  if(/nor|sof|statement of facts|laytime|demuraj|oil record book|orb|stcw|imo|ilo|load line|pilot card|jurnal|logbook|evrak|kancello/.test(hay)) return 'evrak';
  if(/mayday|pan-pan|securite|sart|sopep|can |life |emniyet|yangin|tehlike|dalgic|f harfi|j harfi/.test(hay)) return 'emniyet';
  if(/demir|zincir|kaloma|fundo|vira|anchor|anchorage|mooring|spring|baba|bosa|volta|samandira|aborda|alarga|salpa|zincirlik|matafora/.test(hay)) return 'demirleme';
  if(/yelken|seren|gabya|babafingo|civadra|mizana|iskota|kandilisa|camadan|apazlama|ayi bacagi|genova|bocurum|giz|arma|cunda/.test(hay)) return 'yelken';
  if(/cargo|yuk|draft survey|lashing|twist lock|ullage|loadicator|stowage|dedveyt|ellecleme/.test(hay)) return 'yuk';
  if(/omurga|borda|guverte|kaplama|lumboz|kaporta|dumen|yeke|double bottom|bodoslama|yapi|zincirlik|mapa/.test(hay)) return 'yapi';
  return 'seyir';
}

function getGlossaryCategoryLabel(cat){
  return ({
    tum:'Tum',
    seyir:'Seyir',
    demirleme:'Demirleme',
    yelken:'Yelken',
    evrak:'Evrak',
    emniyet:'Emniyet',
    yapi:'Yapi',
    yuk:'Yuk'
  })[cat] || cat;
}

function getRelevantNoteTopics(sc){
  const hay = `${sc.sub||''} ${sc.loc||''} ${sc.text||''} ${sc.gfx||''}`.toLowerCase();
  const topics = new Set();
  if(/colreg|crossing|head-on|dar kanal|look-?out|safe speed|restricted visibility|fog signal|risk of collision|overtaking|tss/.test(hay)) topics.add('COLREG OZETI');
  if(/ecdis|harita|radar|waypoint|gps|route/.test(hay)) topics.add('ECDIS / HARITA');
  if(/fener|isik|samandira|iala|sector/.test(hay)) topics.add('FENER VE SAMANDIRA');
  if(/pilot|romorkor|mooring|snap-back|heaving line|berthing/.test(hay)) topics.add('PILOT / ROMORKOR / LIMAN');
  if(/psc|isps|solas|stcw|security|gangway/.test(hay)) topics.add('PSC / ISPS / SOLAS / STCW');
  if(/mayday|pan-pan|securite|vhf|gmdss|navtex|epirb|sart|egc|inmarsat|cospas|safetynet|ais/.test(hay)) topics.add('ACIL HABERLESME');
  if(/vhf|mf\/hf|mfhf|navtex|egc|inmarsat|epirb|sart|cospas|safetynet|ais/.test(hay)) topics.add('GMDSS / HABERLESME CIHAZLARI');
  if(/demir|anchor|anchorage|holding ground|dragging|shackle/.test(hay)) topics.add('KOPRUUSTU VARDIYASI');
  if(/stabil|gm|trim|list|ballast|heel|fsc|mctc/.test(hay)) topics.add('STABILITE / BALLAST');
  if(/gel-git|tidal|ukc|under keel|draft/.test(hay)) topics.add('FORMULLER - GEL-GIT / UKC');
  if(/set|drift|course to steer|cog|sog|seyir/.test(hay)) topics.add('FORMULLER - SET / DRIFT / CTS');
  if(/plane sailing|departure|d'lat|d'long|orta enlem|middle latitude|mercator|meridional/.test(hay)) {
    topics.add('FORMULLER - KLASIK SEYIR / PLANE SAILING');
    topics.add('FORMULLER - MERCATOR / MIDDLE LATITUDE');
  }
  if(/great circle|gnomonic|composite sailing|vertex|buyuk daire|composite/.test(hay)) topics.add('FORMULLER - GREAT CIRCLE / COMPOSITE');
  if(/manevra|turning circle|advance|transfer|tactical diameter|rot|wheel-over|squat|stopping distance/.test(hay)) topics.add('FORMULLER - MANEVRA / DONUS');
  if(/cpa|tcpa|arpa|relative motion|trial maneuver|guard zone|ebl|vrm|radar/.test(hay)) topics.add('FORMULLER - RADAR / CPA / TCPA');
  if(/compass|gyro|magnetic|bearing|kerteriz|variation|deviation|gyro error|pusula/.test(hay)) topics.add('FORMULLER - PUSULA / KERTERIZ DUZELTMELERI');
  if(/tpc|mctc|fwa|dwa|hydrostatic|parallel rise|parallel fall|loadicator/.test(hay)) topics.add('FORMULLER - HYDROSTATIC / DRAFT');
  if(/mesafe|hiz|eta|zaman/.test(hay)) topics.add('FORMULLER - HIZ / MESAFE / ZAMAN');
  if(/sextant|latitude|meridian altitude|astronomi/.test(hay)) topics.add('FORMULLER - SEXTANT / ASTRONOMI');
  if(/raspa|boya|primer|pas/.test(hay)) topics.add('RASPA - BOYA / GUVERTELIK');
  if(/lashing|cargo|yuk|ambar|stowage|vinc/.test(hay)) topics.add('YUK OPERASYONU / LASHING');
  if(/evrak|bill of lading|notice of readiness|sof|manifest|oil record/.test(hay)) topics.add('LIMAN VE EVRAK');
  if(/vardiya|watch|kopru/.test(hay)) topics.add('KOPRUUSTU VARDIYASI');
  return topics;
}

function updateSceneNoteHints(sc){
  currentNoteTopics = getRelevantNoteTopics(sc);
  const btn = document.querySelector('#toolbar button[onclick="openNotes()"]');
  if(btn){
    btn.style.borderColor = currentNoteTopics.size ? 'var(--gold)' : '';
    btn.style.color = currentNoteTopics.size ? 'var(--text)' : '';
  }
  const panel = document.getElementById('notes-panel');
  if(panel && panel.classList.contains('show')) renderNotes();
}

function addJournalEntry(text, day, time){
  journalEntries.push({text, day: day||'—', time: time||'—', ts: Date.now()});
}

function openJournal(){
  document.getElementById('journal-panel').classList.add('show');
  renderJournal();
}
function closeJournal(){ document.getElementById('journal-panel').classList.remove('show'); }
function openNotes(){
  document.getElementById('notes-panel').classList.add('show');
  renderNotes();
}
function closeNotes(){ document.getElementById('notes-panel').classList.remove('show'); }
function setNotesTab(tab){
  notesTab = tab;
  renderNotes();
}
function filterNotes(value){
  notesSearch = (value||'').toLowerCase();
  renderNotes();
}
function setGlossaryCategory(cat){
  selectedGlossaryCategory = cat;
  renderNotes();
}
function openColreg(){ document.getElementById('colreg-panel').classList.add('show'); }
function closeColreg(){ document.getElementById('colreg-panel').classList.remove('show'); }

function renderJournal(){
  const c = document.getElementById('journal-entries');
  if(journalEntries.length === 0){
    c.innerHTML = '<div style="color:var(--text3);font-size:12px;padding:10px;">Henüz günlük girişi yok. Sahnelerdeki kararların burada görünecek.</div>';
    return;
  }
  c.innerHTML = journalEntries.slice().reverse().map(e => `
    <div class="journal-entry">
      <div class="journal-entry-day">${e.day} · ${e.time}</div>
      ${e.text}
    </div>`).join('');
}

function renderNotes(){
  const c = document.getElementById('notes-entries');
  const detail = document.getElementById('notes-glossary-detail');
  const search = document.getElementById('notes-search');
  const glossaryFilters = document.getElementById('notes-glossary-filters');
  if(!c || !detail) return;
  if(search && search.value !== notesSearch) search.value = notesSearch;
  document.querySelectorAll('.notes-tab').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase() === notesTab);
  });
  if(glossaryFilters){
    glossaryFilters.classList.toggle('show', notesTab === 'sozluk');
    glossaryFilters.innerHTML = notesTab === 'sozluk'
      ? GLOSSARY_CATEGORIES.map(cat => `<button class="glossary-filter ${cat===selectedGlossaryCategory?'active':''}" onclick="setGlossaryCategory('${cat}')">${getGlossaryCategoryLabel(cat)}</button>`).join('')
      : '';
  }
  if(notesTab === 'sozluk'){
    const terms = GLOSSARY_TERMS
      .filter(g => selectedGlossaryCategory === 'tum' || getGlossaryCategory(g) === selectedGlossaryCategory)
      .filter(g => (`${g.term} ${g.meaning} ${g.example}`).toLowerCase().includes(notesSearch));
    c.innerHTML = terms.length ? `<div class="glossary-list">${terms.map(g => `<button class="glossary-term ${g.term===selectedGlossaryTerm?'active':''}" onclick="selectGlossaryTerm('${g.term.replace(/'/g,"\\'")}')">${g.term}</button>`).join('')}</div>` : '<div class="notes-empty">Aramana uyan sozluk terimi bulunamadi.</div>';
    renderGlossaryDetail(terms);
    return;
  }
  detail.innerHTML = '';
  const notes = STUDENT_NOTES.filter(n => getNoteCategory(n) === notesTab).filter(n => (`${n.head} ${n.body} ${n.tip}`).toLowerCase().includes(notesSearch));
  c.innerHTML = notes.length ? notes.map(n => `
    <div class="notes-section ${currentNoteTopics.has(n.head)?'related':''}">
      <div class="notes-head">${n.head}${currentNoteTopics.has(n.head)?' · ILGILI':''}</div>
      <div class="notes-body">${n.body}</div>
      <div class="notes-tip">${n.tip}</div>
    </div>`).join('') : '<div class="notes-empty">Bu sekmede aramana uyan not bulunamadi.</div>';
  bindShipPartsDiagram();
}

function selectGlossaryTerm(term){
  selectedGlossaryTerm = term;
  renderNotes();
}

function renderGlossaryDetail(visibleTerms){
  const detail = document.getElementById('notes-glossary-detail');
  if(!detail) return;
  const active = visibleTerms.find(g => g.term === selectedGlossaryTerm) || visibleTerms[0];
  if(!active){
    detail.innerHTML = '';
    return;
  }
  selectedGlossaryTerm = active.term;
  detail.innerHTML = `<div class="glossary-detail">
    <div class="glossary-detail-head">${active.term}</div>
    <div class="glossary-detail-body">${active.meaning}</div>
    <div class="glossary-detail-example">Ornek: ${active.example}</div>
  </div>`;
}

// ===== HAVA SİSTEMİ =====
const WEATHER_STATES = [
  {ico:"☀️", desc:"Açık hava — mükemmel seyir", bft:1, color:"#d4a017"},
  {ico:"🌤️", desc:"Hafif bulutlu — sakin deniz", bft:2, color:"#d4a017"},
  {ico:"⛅", desc:"Parçalı bulutlu — hafif dalga", bft:3, color:"#c9952a"},
  {ico:"🌥️", desc:"Kapalı — orta deniz", bft:4, color:"#8aabcc"},
  {ico:"🌬️", desc:"Rüzgarlı — düzensiz dalga", bft:5, color:"#6fa8dc"},
  {ico:"🌧️", desc:"Yağmurlu — kuvvetli dalga", bft:6, color:"#4a7098"},
  {ico:"⛈️", desc:"Fırtınalı — gemi yatıyor", bft:8, color:"#c97070"},
  {ico:"🌀", desc:"Şiddetli fırtına — ACİL", bft:10, color:"#c93010"},
];

let currentWeather = 1;

function updateWeather(sceneGfx){
  const weatherMap = {
    'sea':1, 'harbor':0, 'night':2, 'compass':2, 'bridge':2,
    'storm':6, 'engine_fault':3, 'pirate':4, 'bogaz':3, 'fire':3,
    'galley':1, 'cabin':2, 'cargo':2, 'radar':3, 'engine':2,
    'port_arrival':1, 'sunrise':1,
  };
  const idx = weatherMap[sceneGfx] ?? currentWeather;
  currentWeather = idx;
  const w = WEATHER_STATES[Math.min(idx, WEATHER_STATES.length-1)];
  const ico = document.getElementById('weather-ico');
  const info = document.getElementById('weather-info');
  const bft = document.getElementById('weather-bft');
  const temp = document.getElementById('weather-temp');
  if(ico) ico.textContent = w.ico;
  if(bft){ bft.textContent = w.bft; bft.style.color = w.color; }
  if(info) info.innerHTML = `Beaufort <span id="weather-bft" style="color:${w.color};font-weight:600;">${w.bft}</span> — ${w.desc}`;
  if(temp) temp.textContent = `${18+Math.floor(Math.random()*10)}°C`;
}

// ===== FOTOĞRAF ALBÜMİ =====
let photos = [];
let seenPhotoMoments = new Set();

const OCEAN_PHOTO_EVENTS = [
  {key:'dolphins', title:'Yunuslar', caption:'Bas omuzluk boyunca bize eslik eden yunuslari cektim.', svgKey:'dolphins', gfx:['sea','sunrise']},
  {key:'whale', title:'Uzakta Balina', caption:'Ufuk hattinda su atan iri bir balina gorduk.', svgKey:'whale', gfx:['sea','sunrise']},
  {key:'shark', title:'Kopekbaligi Golgesi', caption:'Sakin suda karinaya yakin dolasan koyu golgeyi hemen cektim.', svgKey:'shark', gfx:['sea']},
  {key:'ocean_view', title:'Acik Deniz Manzarasi', caption:'Okyanusun tam ortasinda kartpostallik bir goruntu yakaladim.', svgKey:'ocean_postcard', gfx:['sea','sunrise','night']},
  {key:'moon_watch', title:'Gece Vardiyasi', caption:'Ay isigi altinda deniz cam gibi uzaniyordu.', svgKey:'night', gfx:['night']}
];

function addPhoto(title, caption, svgKey){
  photos.push({title, caption, svgKey, day: currentDay});
  document.getElementById('tb-photos-count').textContent = photos.length;
}

function tryAddMomentPhoto(key, title, caption, svgKey){
  if(seenPhotoMoments.has(key)) return false;
  seenPhotoMoments.add(key);
  addPhoto(title, caption, svgKey);
  return true;
}

function maybeAddOceanPhoto(sc){
  if(!sc || !sc.gfx || sc.alert || sc.id==='FINAL') return;
  const chances = {sea:0.22, sunrise:0.34, night:0.16, storm:0.08};
  const chance = chances[sc.gfx];
  if(!chance || Math.random() > chance) return;
  const available = OCEAN_PHOTO_EVENTS.filter(ev => ev.gfx.includes(sc.gfx) && !seenPhotoMoments.has(`ocean-${ev.key}`));
  if(!available.length) return;
  const pick = available[Math.floor(Math.random()*available.length)];
  tryAddMomentPhoto(`ocean-${pick.key}`, pick.title, pick.caption, pick.svgKey);
}

function openAlbum(){
  const p = document.getElementById('album-panel');
  p.classList.add('show');
  // Rebuild album content
  // Remove old photo cards
  const oldCards = p.querySelectorAll('.album-photo');
  oldCards.forEach(c => c.remove());
  
  if(photos.length === 0){
    const empty = document.createElement('div');
    empty.style.cssText = 'color:var(--text3);font-size:13px;padding:20px;text-align:center;width:100%;';
    empty.textContent = 'Henüz fotoğraf yok. Önemli anlarda otomatik çekilecek.';
    p.appendChild(empty);
    return;
  }
  photos.forEach(ph => {
    const div = document.createElement('div');
    div.className = 'album-photo';
    const mini = GFX[ph.svgKey] || GFX.sea;
    div.innerHTML = `<svg class="photo-img" viewBox="0 0 480 145" xmlns="http://www.w3.org/2000/svg">${mini}</svg>
      <div style="font-size:10px;font-weight:600;color:var(--text);margin-bottom:2px;">${ph.title}</div>
      <div class="photo-cap">${ph.caption}</div>
      <div style="font-size:8px;color:var(--text3);margin-top:2px;">Gün ${ph.day}</div>`;
    p.appendChild(div);
  });
}
function closeAlbum(){ document.getElementById('album-panel').classList.remove('show'); }

// ===== ANİ OLAY SİSTEMİ =====
const RANDOM_EVENTS = [
  {icon:"🤒",title:"Musa Hastalandı!",text:"Tayfa Musa aniden mide bulantısı şikayeti. Gemi doktoru yok.",timer:15,
    choices:[
      {text:"İlk yardım kutusunu al, ilaç ver",effect:{sayginlik:8,bilgi:5}},
      {text:"Mehmet Usta'ya git, bişeyler pişirsin",effect:{sayginlik:10}},
      {text:"Kendi haline bırak",effect:{sayginlik:-8}}]},
  {icon:"💧",title:"Tatlı Su Azaldı!",text:"Tatlı su tankı beklenenden hızlı tükeniyor. Hesap hatası mı?",timer:12,
    choices:[
      {text:"Tüketim kısıtlaması öner — herkesi bilgilendir",effect:{bilgi:8,sayginlik:7}},
      {text:"Çarkçıbaşı'ya bildir",effect:{bilgi:5,sayginlik:5}},
      {text:"Görmezden gel",effect:{sayginlik:-10,bilgi:-5}}]},
  {icon:"🐟",title:"Balık Sürüsü!",text:"Dev balık sürüsü geminin önünden geçiyor. Güverte herkes toplandı.",timer:20,
    choices:[
      {text:"Anı yaşa, mürettebatla beraber izle",effect:{sayginlik:10,dinclik:5}},
      {text:"Fotoğrafla — belgesel değeri var",effect:{bilgi:3,sayginlik:5}},
      {text:"Göreve dön",effect:{sayginlik:2}}]},
  {icon:"📡",title:"İletişim Kesildi!",text:"Uydu sistemi çöktü. VHF dışında hiçbir iletişim yok. 6 saat.",timer:10,
    choices:[
      {text:"Sakin kal, VHF prosedürünü uygula",effect:{bilgi:10,sayginlik:8,cesaret:5}},
      {text:"Süvariyi bilgilendir, bekleme moduna geç",effect:{sayginlik:7,bilgi:5}},
      {text:"Panikle",effect:{sayginlik:-12,cesaret:-8}}]},
  {icon:"🚢",title:"SOS Sinyali!",text:"Yakın mesafede SOS sinyali alındı. Küçük tekne mi?",timer:15,
    choices:[
      {text:"Süvariyi hemen çağır, pozisyona yönel",effect:{cesaret:10,sayginlik:12,bilgi:8}},
      {text:"Sahil güvenliği ara, konumlarını bil",effect:{bilgi:8,sayginlik:10}},
      {text:"Yanlış sinyal olabilir, devam et",effect:{sayginlik:-15,cesaret:-10}}]},
  {icon:"🪳",title:"Ambar İhlali!",text:"Ambar 2'de insan izine benzer şeyler var. Kaçak yolcu mu?",timer:12,
    choices:[
      {text:"Lostromo ve süvariyi bilgilendir",effect:{bilgi:10,sayginlik:12,cesaret:8}},
      {text:"Tek başına araştır",effect:{cesaret:8,sayginlik:-3}},
      {text:"Hayal görüyorum de, unut",effect:{sayginlik:-10}}]},
];

let eventTimer = null;
let eventActive = false;

function triggerRandomEvent(){
  if(eventActive) return;
  const ev = RANDOM_EVENTS[Math.floor(Math.random()*RANDOM_EVENTS.length)];
  showEventCard(ev);
}

function showEventCard(ev){
  eventActive = true;
  document.getElementById('event-icon').textContent = ev.icon;
  document.getElementById('event-title').textContent = ev.title;
  document.getElementById('event-text').textContent = ev.text;
  const ec = document.getElementById('event-choices');
  ec.innerHTML = '';
  ev.choices.forEach(c => {
    const b = document.createElement('button');
    b.className = 'event-choice';
    b.textContent = c.text;
    b.onclick = () => {
      clearInterval(eventTimer);
      applyEffect(c.effect);
      addJournalEntry(`Ani olay: ${ev.title} — "${c.text}" seçildi.`);
      document.getElementById('event-card').classList.remove('show');
      eventActive = false;
    };
    ec.appendChild(b);
  });
  document.getElementById('event-card').classList.add('show');
  let t = ev.timer;
  document.getElementById('event-timer').textContent = t;
  eventTimer = setInterval(() => {
    t--;
    const el = document.getElementById('event-timer');
    if(el) el.textContent = t;
    if(t<=0){
      clearInterval(eventTimer);
      // Time's up — worst choice by default
      applyEffect({sayginlik:-5, dinclik:-5});
      addJournalEntry(`Ani olay: ${ev.title} — süre doldu, hareketsiz kalındı.`);
      document.getElementById('event-card').classList.remove('show');
      eventActive = false;
    }
  }, 1000);
}

// Rastgele olay tetikleyici — her 5-8 sahnede bir
let scenesSinceEvent = 0;
let nextEventAt = 5 + Math.floor(Math.random()*4);

function maybeTrigerEvent(){
  scenesSinceEvent++;
  if(scenesSinceEvent >= nextEventAt){
    scenesSinceEvent = 0;
    nextEventAt = 5 + Math.floor(Math.random()*4);
    setTimeout(triggerRandomEvent, 1500);
  }
}

// Mevcut gün takibi
let currentDay = 1;
const COLREG_HINTS = {
  s23:{icon:'âš“', title:'COLREG - Crossing', body:'Sancakta hedef varsa give-way sensin. Erken fark et, riski dogru raporla, nobet zabitini hemen haberdar et.'},
  s23b:{icon:'ğŸ§­', title:'COLREG Ozeti', body:'Crossing, head-on ve dar kanal kurallari burada birlikte sinaniyor.'},
  s48:{icon:'ğŸ—ºï¸', title:'COLREG - TSS', body:'Trafik ayrim seridinde rota disiplinini koru ve diger gemilerin emniyetli gecisini zorlastirma.'},
  kriz17:{icon:'ğŸ“¡', title:'COLREG - Dar Kanal', body:'VHF yardimcidir; asil olan sancak sinirina yakin kalmak ve gecisi engellememektir.'}
};

// ===== SİSTEMLERİ ENTEGRE ET =====
// Bu fonksiyon mevcut renderScene'e ek olarak çalışır
function onSceneRender(sc){
  const sceneArea = document.getElementById('scene-area');
  if(sceneArea){
    sceneArea.classList.remove('scene-fade-once');
    void sceneArea.offsetWidth;
    sceneArea.classList.add('scene-fade-once');
  }
  // Hava güncelle
  updateWeather(sc.gfx);
  // Harita pozisyonunu güncelle
  updateShipPosition(sc.loc);
  // Gün sayacını güncelle
  if(sc.day) {
    const m = sc.day.match(/\d+/);
    if(m) currentDay = parseInt(m[0]);
  }
  // Crew trust güncelle (sahne gösteriminde +1 tanışma)
  const crewKey = getCrewKeyFromWho(sc.who);
  if(crewKey) updateCrewTrust(crewKey, 1);
  // Önemli anlarda fotoğraf çek
  if(sc.alert) tryAddMomentPhoto(`scene-${sc.id}`, `ACIL: ${sc.sub}`, sc.day+' · '+sc.time, sc.gfx);
  else if(sc.id==='s01') tryAddMomentPhoto('scene-s01', 'Ilk Adim', 'Iskeleye ilk kez ayak basiyorum...', 'harbor');
  else if(sc.id==='FINAL') tryAddMomentPhoto('scene-final', 'Son Gun', 'Bu yolculugun son sahnesi.', 'bridge');
  else maybeAddOceanPhoto(sc);
  const hint = COLREG_HINTS[sc.id];
  if(hint && !seenColregHints.has(sc.id)){
    seenColregHints.add(sc.id);
    setTimeout(()=>{
      showNotif(hint.icon, hint.title, hint.body);
      addJournalEntry(`[COLREG] ${hint.body}`, sc.day, sc.time);
    }, 250);
  }
  // Rastgele olay
  maybeTrigerEvent();
}


// ===== SES SİSTEMİ (Web Audio API) =====
let audioCtx = null;
let currentMusic = null;
let musicGain = null;


let soundEnabled = true;
function toggleSound(){
  soundEnabled = !soundEnabled;
  document.getElementById('sound-btn').textContent = soundEnabled ? '🔊' : '🔇';
  if(!soundEnabled) stopAllMusic();
}

const _origPlayTone = playTone;
// Wrap functions to respect soundEnabled - handled by checking at call sites

function getAudioCtx(){
  if(!soundEnabled) return null;
  if(!audioCtx){
    try{
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }catch(e){ return null; }
  }
  if(audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// Basit ses efekti üreticisi - Web Audio API ile synthtic sesler
function playTone(freq, type, duration, vol, delay=0){
  const ctx = getAudioCtx();
  if(!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = freq;
  osc.type = type;
  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration + 0.1);
}

function playNoise(duration, vol, delay=0){
  const ctx = getAudioCtx();
  if(!ctx) return;
  const bufSize = ctx.sampleRate * duration;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for(let i=0;i<bufSize;i++) data[i] = (Math.random()*2-1);
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;
  src.buffer = buf;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  src.start(ctx.currentTime + delay);
  src.stop(ctx.currentTime + delay + duration + 0.1);
}

// Müzik/ambians döngü sistemi
let ambianceNodes = [];
function stopAllMusic(){
  ambianceNodes.forEach(n=>{ try{ n.stop(); }catch(e){} });
  ambianceNodes = [];
  if(musicGain) musicGain.gain.setTargetAtTime(0, getAudioCtx()?.currentTime||0, 0.3);
}

function playDroneNote(freq, vol, ctx){
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.value = vol;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  ambianceNodes.push(osc);
  return osc;
}

// === ÖZEL SES FONKSİYONLARI ===

// VHF tıkırtısı
function sfxVHF(){
  playTone(800, 'square', 0.08, 0.3);
  setTimeout(()=>playTone(1200, 'square', 0.06, 0.2), 100);
  setTimeout(()=>playTone(800, 'square', 0.08, 0.25), 200);
}

// Alarm sesi (yangın/acil)
function sfxAlarm(){
  for(let i=0;i<5;i++){
    playTone(880, 'square', 0.15, 0.4, i*0.35);
    playTone(660, 'square', 0.15, 0.3, i*0.35+0.175);
  }
}

// Radar bip
function sfxRadarBip(){
  playTone(1200, 'sine', 0.12, 0.25);
}

// Dalga/fırtına ambians
function sfxStormAmbiance(){
  stopAllMusic();
  const ctx = getAudioCtx();
  if(!ctx) return;
  // Düşük frekanslı dalga uğultusu
  playDroneNote(40, 0.08, ctx);
  playDroneNote(55, 0.06, ctx);
  playDroneNote(80, 0.04, ctx);
  // Periyodik buhran notları
  let beat = 0;
  function stormBeat(){
    if(ambianceNodes.length === 0) return;
    playTone(120+Math.random()*60, 'sawtooth', 0.4+Math.random()*0.3, 0.06+Math.random()*0.04);
    if(Math.random() > 0.7) playNoise(0.3, 0.08);
    beat++;
    if(beat < 40) setTimeout(stormBeat, 400+Math.random()*600);
  }
  setTimeout(stormBeat, 500);
}

// Korsan gerilim müziği
function sfxPirateAmbiance(){
  stopAllMusic();
  const ctx = getAudioCtx();
  if(!ctx) return;
  // Gerilim dronu - düşük, tehditkar
  playDroneNote(55, 0.1, ctx);
  playDroneNote(82, 0.07, ctx);
  // Hızlı ritim
  let beat = 0;
  const pirateMelody = [220, 196, 185, 165, 196, 220, 233];
  function pirateBeat(){
    if(ambianceNodes.length === 0) return;
    // Darbuka ritmi
    playTone(80, 'square', 0.15, 0.12);
    if(beat%2===0) playNoise(0.08, 0.06, 0.15);
    // Gerilim melodisi
    if(beat%7===0){
      const note = pirateMelody[Math.floor(Math.random()*pirateMelody.length)];
      playTone(note, 'triangle', 0.3, 0.08, 0.2);
    }
    beat++;
    if(beat < 80) setTimeout(pirateBeat, 250);
  }
  setTimeout(pirateBeat, 200);
}

// Boğaz gerilimi — sessiz, tehlikeli
function sfxBogazAmbiance(){
  stopAllMusic();
  const ctx = getAudioCtx();
  if(!ctx) return;
  playDroneNote(65, 0.08, ctx);
  playDroneNote(97, 0.05, ctx);
  let beat = 0;
  function bogazBeat(){
    if(ambianceNodes.length === 0) return;
    if(beat%4===0) playTone(130+Math.random()*20, 'sine', 0.5, 0.04, Math.random()*0.2);
    if(beat%8===0) playTone(196, 'triangle', 0.4, 0.06);
    beat++;
    if(beat < 60) setTimeout(bogazBeat, 600+Math.random()*400);
  }
  setTimeout(bogazBeat, 300);
}

// Makine arızası — metalik, alarm
function sfxEngineAlarm(){
  stopAllMusic();
  // Metal titreşim
  for(let i=0;i<3;i++){
    playTone(150+i*30, 'sawtooth', 0.3, 0.15, i*0.4);
    playTone(300+i*20, 'square', 0.2, 0.1, i*0.4+0.15);
  }
  setTimeout(()=>{
    const ctx = getAudioCtx();
    if(!ctx) return;
    playDroneNote(40, 0.06, ctx);
    let beat = 0;
    function engineBeat(){
      if(ambianceNodes.length === 0) return;
      playTone(60, 'sawtooth', 0.2, 0.08);
      playNoise(0.15, 0.05, 0.1);
      beat++;
      if(beat < 30) setTimeout(engineBeat, 800);
    }
    engineBeat();
  }, 1500);
}


// Deniz dalgası arka plan sesi
function sfxOceanAmbiance(){
  const ctx = getAudioCtx();
  if(!ctx) return;
  stopAllMusic();
  // Düşük frekanslı dalga uğultusu
  const createWave = (freq, amp, delay=0) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.15 + Math.random()*0.1;
    lfoGain.gain.value = amp * 0.5;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = amp;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    lfo.start(ctx.currentTime + delay);
    ambianceNodes.push(osc); ambianceNodes.push(lfo);
  };
  createWave(48, 0.06);
  createWave(72, 0.04, 0.3);
  createWave(95, 0.03, 0.7);
  // Periyodik kıyı çarpma efekti
  let waveT = 0;
  function waveImpact(){
    if(ambianceNodes.length === 0) return;
    const ctx2 = getAudioCtx();
    if(!ctx2) return;
    // Gürültü patlaması (dalga kıyıya çarptı)
    const bufSize = ctx2.sampleRate * 0.8;
    const buf = ctx2.createBuffer(1, bufSize, ctx2.sampleRate);
    const data = buf.getChannelData(0);
    for(let i=0; i<bufSize; i++){
      const env = Math.pow(1 - i/bufSize, 2);
      data[i] = (Math.random()*2-1) * env * 0.15;
    }
    const src = ctx2.createBufferSource();
    const filt = ctx2.createBiquadFilter();
    const g = ctx2.createGain();
    filt.type = 'bandpass';
    filt.frequency.value = 300 + Math.random()*200;
    filt.Q.value = 0.5;
    g.gain.value = 0.3 + Math.random()*0.2;
    src.buffer = buf;
    src.connect(filt); filt.connect(g); g.connect(ctx2.destination);
    src.start();
    src.stop(ctx2.currentTime + 0.8);
    waveT++;
    if(ambianceNodes.length > 0){
      const nextWave = 3000 + Math.random()*4000;
      setTimeout(waveImpact, nextWave);
    }
  }
  setTimeout(waveImpact, 2000);
}

// Gemi sesi — motor uğultusu (normal)
function sfxShipEngine(){
  stopAllMusic();
  const ctx = getAudioCtx();
  if(!ctx) return;
  playDroneNote(50, 0.05, ctx);
  playDroneNote(100, 0.03, ctx);
  playDroneNote(150, 0.02, ctx);
}

// Liman sesi — kalabalık, canlı
function sfxHarbor(){
  stopAllMusic();
  // Vinç sesleri
  setTimeout(()=>playTone(600, 'sawtooth', 0.15, 0.06), 200);
  setTimeout(()=>playTone(800, 'square', 0.1, 0.05), 700);
  setTimeout(()=>playNoise(0.2, 0.04), 1200);
}

// İyi sonuç fanfarı
function sfxSuccess(){
  const notes = [523, 659, 784, 1047];
  notes.forEach((n,i)=> playTone(n, 'triangle', 0.4, 0.15, i*0.15));
  setTimeout(()=>{
    [784, 1047, 1568].forEach((n,i)=> playTone(n, 'sine', 0.5, 0.2, i*0.1));
  }, 700);
}

// Kötü sonuç sesi
function sfxFail(){
  playTone(300, 'sawtooth', 0.5, 0.2);
  playTone(220, 'sawtooth', 0.5, 0.2, 0.3);
  playTone(160, 'sawtooth', 0.5, 0.25, 0.6);
}

// Seçim click sesi
function sfxClick(){
  playTone(800, 'sine', 0.05, 0.08);
}

let lastSceneGfx = '';
function sfxSceneTransition(gfx){
  if(!gfx || gfx===lastSceneGfx) return;
  if(gfx==='storm') playNoise(0.12, 0.018);
  else if(gfx==='harbor') playTone(520, 'triangle', 0.08, 0.05);
  else if(gfx==='night') playTone(420, 'sine', 0.1, 0.04);
  else if(gfx==='sea'||gfx==='sunrise'||gfx==='port_arrival') playTone(610, 'sine', 0.07, 0.035);
  else if(/radar|ecdis_panel|ais_panel|gyro_panel|magnetic_panel|echo_panel|speedlog_panel|autopilot_panel|bnwas_panel|gmdss_panel/.test(gfx)) playTone(980, 'square', 0.045, 0.05);
  lastSceneGfx = gfx;
}

function sfxPanelWake(){
  playTone(880, 'square', 0.04, 0.045);
  setTimeout(()=>playTone(1180, 'sine', 0.05, 0.03), 60);
}

function sfxHomesickCry(){
  const ctx = getAudioCtx();
  if(!ctx) return;
  playNoise(0.45, 0.015, 0.1);
  [262, 220, 196].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = i === 1 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(freq - 18, ctx.currentTime + 0.9);
    filter.type = 'lowpass';
    filter.frequency.value = 620;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.018 - i*0.003, ctx.currentTime + 0.18 + i*0.04);
    gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.2 + i*0.08);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i*0.08);
    osc.stop(ctx.currentTime + 1.35 + i*0.08);
  });
}

function sfxHomesickSigh(){
  const ctx = getAudioCtx();
  if(!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(210, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(132, ctx.currentTime + 1.25);
  filter.type = 'lowpass';
  filter.frequency.value = 540;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.22);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.4);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 1.45);
  playNoise(0.6, 0.008, 0.05);
}

function sfxLonelyShipCreak(){
  const ctx = getAudioCtx();
  if(!ctx) return;
  for(let i=0;i<3;i++){
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180 + Math.random()*70, ctx.currentTime + i*0.65);
    osc.frequency.linearRampToValueAtTime(95 + Math.random()*35, ctx.currentTime + i*0.65 + 0.55);
    filter.type = 'bandpass';
    filter.frequency.value = 260 + Math.random()*140;
    filter.Q.value = 0.8;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + i*0.65);
    gain.gain.linearRampToValueAtTime(0.007 + Math.random()*0.004, ctx.currentTime + i*0.65 + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i*0.65 + 0.7);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i*0.65);
    osc.stop(ctx.currentTime + i*0.65 + 0.75);
  }
}

function sfxDistantEngineHum(){
  const ctx = getAudioCtx();
  if(!ctx) return;
  const oscA = ctx.createOscillator();
  const oscB = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  oscA.type = 'sine';
  oscB.type = 'triangle';
  oscA.frequency.value = 46;
  oscB.frequency.value = 69;
  filter.type = 'lowpass';
  filter.frequency.value = 180;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.014, ctx.currentTime + 0.4);
  gain.gain.linearRampToValueAtTime(0.009, ctx.currentTime + 1.8);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.4);
  oscA.connect(filter);
  oscB.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  oscA.start(ctx.currentTime);
  oscB.start(ctx.currentTime);
  oscA.stop(ctx.currentTime + 3.5);
  oscB.stop(ctx.currentTime + 3.5);
}

function playHomesickAmbiance(sc){
  if(!sc) return;
  const sadScene = ['s115','s116','s130','kriz05b'].includes(sc.id) || /aile ozlemi|yalnizlik|ic ses|uykusuzluk|ozlem|arkadas|aglamaya basladin|ilk buyuk firtina/.test(`${sc.sub||''} ${sc.text||''}`.toLowerCase());
  if(!sadScene) return;
  sfxDistantEngineHum();
  setTimeout(sfxLonelyShipCreak, 260);
  const sfx = Math.random() > 0.45 ? sfxHomesickCry : sfxHomesickSigh;
  setTimeout(sfx, 420);
}

// Sahneye göre ses çal
function playSceneAudio(sc){
  const gfx = sc.gfx || '';
  const alert = sc.alert || false;
  sfxSceneTransition(gfx);
  
  if(alert){
    if(gfx === 'pirate') { setTimeout(sfxPirateAmbiance, 300); sfxAlarm(); }
    else if(gfx === 'bogaz') { sfxBogazAmbiance(); setTimeout(()=>playTone(440,'square',0.1,0.3),500); }
    else if(gfx === 'engine_fault') { sfxEngineAlarm(); }
    else { sfxAlarm(); }
  } else {
    if(gfx === 'storm') sfxStormAmbiance();
    else if(gfx==='fire') { stopAllMusic(); sfxAlarm(); }
    else if(gfx === 'radar') { stopAllMusic(); sfxRadarBip(); sfxPanelWake(); }
    else if(gfx === 'engine') { stopAllMusic(); sfxShipEngine(); }
    else if(gfx==='harbor') { sfxHarbor(); sfxOceanAmbiance(); }
    else if(gfx==='sea'||gfx==='night'||gfx==='sunrise'||gfx==='port_arrival') { sfxShipEngine(); sfxOceanAmbiance(); }
    else if(gfx==='cabin'||gfx==='galley') {
      sfxOceanAmbiance();
      playHomesickAmbiance(sc);
    }
    else if(/ecdis_panel|ais_panel|gyro_panel|magnetic_panel|echo_panel|speedlog_panel|autopilot_panel|bnwas_panel|gmdss_panel/.test(gfx)) {
      stopAllMusic();
      sfxPanelWake();
    }
    else { stopAllMusic(); }
  }
}


// ===== BAŞLATMA =====
document.getElementById('nameinp').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('shipnameinp').focus();});
document.getElementById('shipnameinp').addEventListener('keydown',e=>{if(e.key==='Enter')beginGame();});
buildIntro();







