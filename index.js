
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
    // Distant ships
    const shipBob = Math.sin(t*0.02)*2;
    const drawShip = (x,y,scale,hull,deck,light) => {
      cx.save();
      cx.translate(x, y + shipBob*scale*0.2);
      cx.scale(scale, scale);
      cx.fillStyle = hull;
      cx.beginPath();
      cx.moveTo(0,0); cx.lineTo(44,0); cx.lineTo(56,6); cx.lineTo(68,6); cx.lineTo(68,10); cx.lineTo(-4,10); cx.closePath();
      cx.fill();
      cx.fillStyle = deck;
      cx.fillRect(22,-10,18,10);
      cx.fillRect(30,-16,8,6);
      cx.fillRect(35,-26,2,10);
      cx.strokeStyle = 'rgba(140,180,220,0.35)';
      cx.lineWidth = 1;
      cx.beginPath(); cx.moveTo(36,-26); cx.lineTo(46,-18); cx.stroke();
      cx.fillStyle = light;
      cx.beginPath(); cx.arc(41,-7,1.5,0,Math.PI*2); cx.fill();
      cx.restore();
    };
    drawShip(W*0.18, H*0.71, 0.8, '#091523', '#15385d', `rgba(111,168,220,${0.55+Math.sin(t*0.03)*0.15})`);
    drawShip(W*0.64, H*0.78, 1.05, '#08111f', '#133252', `rgba(212,160,23,${0.5+Math.cos(t*0.025)*0.18})`);
    drawShip(W*0.82, H*0.69, 0.62, '#0a1624', '#163a61', `rgba(201,112,112,${0.45+Math.sin(t*0.04)*0.18})`);
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
<path d="M24 88 L182 88 L204 96 L226 96 L226 102 L16 102 L16 95 Z" fill="#0b1728"/>
<path d="M28 82 L186 82 L200 88 L28 88 Z" fill="#163250"/>
<rect x="84" y="58" width="74" height="24" rx="3" fill="#d9e3ea"/>
<rect x="124" y="46" width="28" height="14" rx="2" fill="#d9e3ea"/>
<rect x="133" y="34" width="10" height="12" rx="1" fill="#173454"/>
<line x1="138" y1="18" x2="138" y2="34" stroke="#617f9b" stroke-width="1.5"/>
<line x1="138" y1="22" x2="149" y2="29" stroke="#617f9b" stroke-width="1"/>
<rect x="92" y="64" width="8" height="6" rx="1" fill="#6fa8dc"/>
<rect x="104" y="64" width="8" height="6" rx="1" fill="#6fa8dc" opacity=".9"/>
<rect x="116" y="64" width="8" height="6" rx="1" fill="#6fa8dc"/>
<rect x="128" y="64" width="8" height="6" rx="1" fill="#6fa8dc" opacity=".85"/>
<rect x="140" y="64" width="8" height="6" rx="1" fill="#6fa8dc"/>
<rect x="160" y="88" width="34" height="4" fill="#4b637b" opacity=".5"/>
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
<path d="M292 66 L390 66 L408 72 L424 72 L424 77 L284 77 L284 71 Z" fill="#081320"/>
<path d="M300 60 L392 60 L404 66 L300 66 Z" fill="#173451"/>
<rect x="344" y="43" width="28" height="17" rx="2" fill="#d9e3ea"/>
<rect x="364" y="32" width="16" height="12" rx="2" fill="#d9e3ea"/>
<rect x="370" y="22" width="8" height="10" rx="1" fill="#173454"/>
<line x1="374" y1="14" x2="374" y2="22" stroke="#607d99" stroke-width="1.2"/>
<rect x="350" y="49" width="7" height="5" rx="1" fill="#6fa8dc"/>
<rect x="360" y="49" width="7" height="5" rx="1" fill="#6fa8dc"/>
<rect x="370" y="49" width="7" height="5" rx="1" fill="#6fa8dc"/>
<circle cx="407" cy="69" r="1.8" fill="#d4a017"/>`,

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
<path d="M196 70 L286 70 L302 76 L314 76 L314 80 L188 80 L188 75 Z" fill="#050b14"/>
<path d="M204 64 L286 64 L296 70 L204 70 Z" fill="#112844"/>
<rect x="240" y="49" width="22" height="15" rx="2" fill="#d9e3ea"/>
<rect x="254" y="40" width="12" height="10" rx="2" fill="#d9e3ea"/>
<line x1="260" y1="30" x2="260" y2="40" stroke="#5c7895" stroke-width="1"/>
<circle cx="230" cy="68" r="2" fill="#c93030" opacity=".95"/>
<circle cx="290" cy="68" r="2" fill="#5dbf8a" opacity=".9"/>
<circle cx="260" cy="45" r="1.6" fill="#6fa8dc" opacity=".85"/>`,

storm:`<rect width="480" height="145" fill="#020a14"/>
<ellipse cx="100" cy="18" rx="80" ry="24" fill="#0a1828" opacity=".95"/>
<ellipse cx="200" cy="10" rx="100" ry="21" fill="#081420" opacity=".9"/>
<ellipse cx="320" cy="16" rx="90" ry="23" fill="#0a1828" opacity=".95"/>
<ellipse cx="430" cy="9" rx="70" ry="19" fill="#060f18"/>
<polyline points="200,13 190,43 198,43 183,73" fill="none" stroke="#d4d8e0" stroke-width="1.5" opacity=".8"/>
<polyline points="340,8 330,36 338,36 322,63" fill="none" stroke="#c0c8d8" stroke-width="1" opacity=".5"/>
<line x1="40" y1="48" x2="34" y2="68" stroke="#0d3060" stroke-width="1" opacity=".6"/>
<line x1="80" y1="43" x2="74" y2="63" stroke="#0d3060" stroke-width="1" opacity=".5"/>
<line x1="130" y1="48" x2="124" y2="68" stroke="#0d3060" stroke-width="1" opacity=".6"/>
<line x1="200" y1="46" x2="194" y2="66" stroke="#0d3060" stroke-width="1" opacity=".5"/>
<line x1="280" y1="50" x2="274" y2="70" stroke="#0d3060" stroke-width="1" opacity=".6"/>
<line x1="360" y1="44" x2="354" y2="64" stroke="#0d3060" stroke-width="1" opacity=".5"/>
<line x1="430" y1="48" x2="424" y2="68" stroke="#0d3060" stroke-width="1" opacity=".6"/>
<rect y="70" width="480" height="75" fill="#041020"/>
<path d="M0 78 Q20 66 40 78 Q60 90 80 78 Q100 66 120 78 Q140 90 160 78 Q180 66 200 78 Q220 90 240 78 Q260 66 280 78 Q300 90 320 78 Q340 66 360 78 Q380 90 400 78 Q420 66 440 78 Q460 90 480 78" fill="none" stroke="#0d3060" stroke-width="2.5" opacity=".8"/>
<path d="M0 96 Q25 82 50 96 Q75 110 100 96 Q125 82 150 96 Q175 110 200 96 Q225 82 250 96 Q275 110 300 96 Q325 82 350 96 Q375 110 400 96 Q425 82 450 96 Q475 110 480 96" fill="none" stroke="#0a2848" stroke-width="2" opacity=".7"/>
<path d="M20 80 Q28 76 36 80" fill="none" stroke="#8ab0c8" stroke-width="1.5" opacity=".5"/>
<path d="M100 76 Q108 72 116 76" fill="none" stroke="#8ab0c8" stroke-width="1.5" opacity=".4"/>
<path d="M220 82 Q228 78 236 82" fill="none" stroke="#8ab0c8" stroke-width="1.5" opacity=".5"/>
<path d="M340 78 Q348 74 356 78" fill="none" stroke="#8ab0c8" stroke-width="1.5" opacity=".4"/>`,

radar:`<rect width="480" height="145" fill="#020d08"/>
<circle cx="240" cy="72" r="66" fill="#030f06"/>
<circle cx="240" cy="72" r="66" fill="none" stroke="#0d3a18" stroke-width="1.5"/>
<circle cx="240" cy="72" r="22" fill="none" stroke="#0d3a18" stroke-width="1" opacity=".6"/>
<circle cx="240" cy="72" r="44" fill="none" stroke="#0d3a18" stroke-width="1" opacity=".5"/>
<circle cx="240" cy="72" r="64" fill="none" stroke="#0d3a18" stroke-width="1" opacity=".4"/>
<line x1="174" y1="72" x2="306" y2="72" stroke="#0d3a18" stroke-width="1" opacity=".5"/>
<line x1="240" y1="6" x2="240" y2="138" stroke="#0d3a18" stroke-width="1" opacity=".5"/>
<g class="radar-sweep" style="transform-origin:240px 72px">
<line x1="240" y1="72" x2="240" y2="8" stroke="#1aff50" stroke-width="1.5" opacity=".8"/>
<path d="M240 72 L240 8 A64 64 0 0 1 296 102 Z" fill="#1aff50" opacity=".06"/>
</g>
<circle cx="266" cy="48" r="3" fill="#1aff50" opacity=".9" class="blink"/>
<circle cx="280" cy="88" r="2.5" fill="#1aff50" opacity=".7"/>
<circle cx="207" cy="60" r="2" fill="#1aff50" opacity=".5"/>
<circle cx="250" cy="106" r="2" fill="#1aff50" opacity=".6"/>
<circle cx="240" cy="72" r="3" fill="#6fa8dc"/>
<line x1="240" y1="72" x2="266" y2="48" stroke="#d4a017" stroke-width="1" stroke-dasharray="3,2" opacity=".7"/>
<text x="243" y="10" fill="#0d3a18" font-size="8" font-family="monospace">N</text>
<text x="304" y="75" fill="#0d3a18" font-size="8" font-family="monospace">E</text>
<text x="243" y="140" fill="#0d3a18" font-size="8" font-family="monospace">S</text>
<text x="166" y="75" fill="#0d3a18" font-size="8" font-family="monospace">W</text>`,

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
<rect x="185" y="54" width="110" height="18" rx="3" fill="#0a1e30"/>
<rect x="245" y="42" width="30" height="14" rx="2" fill="#081828"/>
<line x1="260" y1="32" x2="260" y2="42" stroke="#0a1828" stroke-width="1.5"/>
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
<path d="M20 68 L112 68 L126 73 L138 73 L138 77 L14 77 L14 72 Z" fill="#08111d"/>
<path d="M28 62 L112 62 L121 68 L28 68 Z" fill="#16314c"/>
<rect x="70" y="49" width="20" height="13" rx="2" fill="#d9e3ea"/>
<rect x="84" y="39" width="10" height="10" rx="1" fill="#173454"/>
<line x1="89" y1="30" x2="89" y2="39" stroke="#607d99" stroke-width="1"/>
<circle cx="118" cy="70" r="1.6" fill="#d4a017"/>`,
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
    choices:shuffleChoices([
      {text:`Yaklasik ${heelDeg.toFixed(1)} derece sancaga yatma beklerim`,tag:"kritik",effect:{bilgi:16,sayginlik:12,cesaret:4}},
      {text:`Yaklasik ${(heelDeg*2.2).toFixed(1)} derece`,tag:"itaatkar",effect:{bilgi:6,sayginlik:4}},
      {text:"Yuk kaydi var ama hesap gereksiz, gozle karar verelim",tag:"korkak",effect:{bilgi:-10,sayginlik:-9}}
    ])},
    {id:"s101",gfx:"cargo",alert:false,day:"Gun 9",time:"15:10",loc:"Yuk Plani Masasi",sub:"Trim degisimi ve MCTC hesabi",who:"z1",
    text:`1. Zabiti cetveli itip seni sandalyeye cekti.

"Pruvaya dogru agirlik kaydiriyoruz. ${weight2} tonluk agirlik ${shift2} metre for'a alinacak. Geminin MCTC degeri ${mctc} ton-metre/santim.

Trim degisimi = trimming moment / MCTC. Bana kac santim trim degisimi bekledigini soyle; sonra kaptana birlikte cikalim."`,
    choices:shuffleChoices([
      {text:`Yaklasik ${trimCm.toFixed(1)} cm trim degisimi olur`,tag:"kritik",effect:{bilgi:15,sayginlik:11}},
      {text:`Yaklasik ${(trimCm/2).toFixed(1)} cm olur`,tag:"itaatkar",effect:{bilgi:5,sayginlik:4}},
      {text:"Trim cetveline bakmadan operasyonu baslatalim",tag:"korkak",effect:{bilgi:-9,sayginlik:-8}}
    ])},
    {id:"s102",gfx:"bridge",alert:false,day:"Gun 9",time:"19:40",loc:"Kopruustu - Aksam Brifingi",sub:"Serbest yuzey etkisiyle GM duzeltmesi",who:"suvari",
    text:`Aksamustu suvari kahvesini bir kenara koydu.

"Son hesap bu. Baslangic GM ${gm3.toFixed(2)} metre. Slack tanklarin free surface correction toplami ${fsc} ton-metre. Deplasman ${disp3} ton.

Duzeltilmis GM = GM - FSC / displacement. Gercek GM'yi bul; sonra bu gemi gece vardiyasina rahat cikar mi konusalim."`,
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
  const startSub=`${startScenario.subPrefix} - ${yr}`;

  // Sahneler: her biri bağımsız, next kullanılmayacak (rastgele sıra sistemi)
  // next:null → sistem sonrakini kendisi seçecek
  // next:'end' → oyun biter
  // alert:true → ACİL banner + ses efekti

  return [
// ---- GÜN 1 SAHNELERİ ----
{id:"s01",gfx:"harbor",alert:false,day:"Gun 1",time:startScenario.time,loc:startPort.dock,sub:startSub,who:"anlatici",
text:`${startPort.name}, ${yr} yili.\n\n${startScenario.intro}\n\nCantan sirtinda, staj belgelerin avucunda iskeleye geldin. Onunde ${sn} - ${st.ton} ${st.nm} gemisi.\n\n${startScenario.bridgeCall.replace('${n}',n)}`,
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
text:`Şafak sökerken makine devreye girdi. Kurtarma gemisi yanı başında.\n\nSüvari:\n"Bu gece VHF'ye atlayan senin. İyi yaptın. Boğazda sürüklenme — en kötü senaryo. Ama sen paniklemeden aradın."`,
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
{text:"Telefonu bir kenara birakir, hemen uykuya teslim olurum",tag:"akilli",effect:{dinclik:16,sayginlik:3}},
{text:"Kisa bir not yazip sonra uyurum",tag:"itaatkar",effect:{dinclik:12,bilgi:4}},
{text:"Bos zamani harcayip yine gec yatarim",tag:"korkak",effect:{dinclik:-5}}]},

{id:"s147",gfx:"galley",alert:false,day:"Gun 9",time:"18:30",loc:"Yemekhane",sub:"Sicak yemek, sakin masa",who:"asci",
text:`Asci bu aksam masayi sessizce topladi.

"Bugun ortalik yorucuydu. Karnin duzgun doyarsa kafan da toparlar."

Sicak corba, taze ekmek, cay. Kucuk seyler ama gemide bazen insani toparlayan da bunlar.`,
choices:[
{text:"Sakin sakin yer, acele etmeden biraz nefes alirim",tag:"sosyal",effect:{dinclik:12,sayginlik:6}},
{text:"Yemegi bitirip erkenden kabine cekilirim",tag:"itaatkar",effect:{dinclik:10}},
{text:"Aklim baska yerde diye yemegi gecistiririm",tag:"korkak",effect:{dinclik:-4,sayginlik:-2}}]},

{id:"s148",gfx:"sea",alert:false,day:"Gun 10",time:"06:20",loc:"Açık Güverte - Sabah Havası",sub:"Vardiya oncesi kisa toparlanma",who:"hasan",
text:`Hasan seni vardiya oncesi disari cagirdi.

"Iki dakika temiz hava da denizcinin ilaci bazen. Kafayi acmadan ekrana bakarsan her sey daha zor gelir."

Ufuk acik, ruzgar yumusak. Ne yaparsin?`,
choices:[
{text:"Derin nefes alir, ufka bakip zihnimi toplarim",tag:"akilli",effect:{dinclik:11,cesaret:3}},
{text:"Hasanla iki laf eder, sonra goreve donerim",tag:"sosyal",effect:{dinclik:9,sayginlik:5}},
{text:"Bos is deyip dogrudan ise dalarim",tag:"korkak",effect:{dinclik:-3}}]},

{id:"s149",gfx:"cabin",alert:false,day:"Gun 11",time:"13:40",loc:"Stajyer Kabini",sub:"Kisa ogle uykusu",who:"anlatici",
text:`Oglen kisa bir bosluk yakaladin. Tam tamina yirmi dakika.

Denizde uzun dinlenme her zaman bulunmaz ama bazen kisa uyku bile insanin gozunu ve dengesini yerine getirir.

Bu arayi nasil degerlendirirsin?`,
choices:[
{text:"Alarm kurup yirmi dakikalik power nap yaparim",tag:"kritik",effect:{dinclik:14,bilgi:3}},
{text:"Uzanir, gozlerimi kapatip bedenimi dinlendiririm",tag:"itaatkar",effect:{dinclik:9}},
{text:"Uyursam sersem olurum deyip hic dinlenmem",tag:"korkak",effect:{dinclik:-4}}]},

{id:"s150",gfx:"harbor",alert:false,day:"Gun 12",time:"17:20",loc:"Kıç Güverte",sub:"İş bitti, omuzlar düştü",who:"lostromo",
text:`Uzun bir isin ardindan lostromo ilk kez "tamam" dedi.

"Bugun iyi kosturdun. Simdi bir bardak su ic, omuzlarini birak. Gemi insani sadece zorlamaz; bazen biraktiginda da ogretir."

Kendine kucuk bir mola verir misin?`,
choices:[
{text:"Su icer, oturup kisa bir toparlanma molasi veririm",tag:"akilli",effect:{dinclik:10,sayginlik:6}},
{text:"Etrafi son kez kontrol edip sonra dinlenirim",tag:"itaatkar",effect:{dinclik:8,bilgi:3}},
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
{text:"Cayimi sakin sakin icip kafami toplarim",tag:"akilli",effect:{dinclik:11,sayginlik:4}},
{text:"Asciyla iki laf eder, sonra kabine gecerim",tag:"sosyal",effect:{dinclik:9,sayginlik:6}},
{text:"Mola vermeden yeni is ararim",tag:"korkak",effect:{dinclik:-4}}]},

{id:"s184",gfx:"cabin",alert:false,day:"Gun 14",time:"21:35",loc:"Stajyer Kabini",sub:"Duzenli kabin, duzenli zihin",who:"anlatici",
text:`Kabin daginmis ama gece ilk kez sakin. Yataga oturunca fark ettin: daginiklik bazen yorgunlugu daha da buyutuyor.

Kucuk bir toparlama yapsan hem oda hem zihin rahatlayacak.

Ne yaparsin?`,
choices:[
{text:"Kabinimi toparlar, su icip erken uykuya hazirlanirim",tag:"akilli",effect:{dinclik:12,bilgi:3}},
{text:"Sadece yatagi duzeltip biraz nefes alirim",tag:"itaatkar",effect:{dinclik:8}},
{text:"Bosverip telefona gomulurum",tag:"korkak",effect:{dinclik:-5}}]},

{id:"s185",gfx:"sea",alert:false,day:"Gun 11",time:"05:55",loc:"Acik Güverte - Gunes Dogarken",sub:"Ufka bakip toparlanmak",who:"hasan",
text:`Hasan omzunla hafifce dokundu.

"Gel," dedi, "iki dakika sadece ufka bak. Denizde bazen insanin kafasini yine deniz toplar."

Gunes daha yeni cizgiye degiyor. Geminin sesi bile daha yumusak geliyor.

Ne yaparsin?`,
choices:[
{text:"Sessizce ufka bakip nefesimi duzenlerim",tag:"akilli",effect:{dinclik:10,cesaret:3}},
{text:"Hasanla kisa bir sohbet edip rahatlarim",tag:"sosyal",effect:{dinclik:8,sayginlik:5}},
{text:"Buna vakit yok deyip geri donerim",tag:"korkak",effect:{dinclik:-3}}]},

{id:"s186",gfx:"harbor",alert:false,day:"Gun 12",time:"15:50",loc:"Kic Güverte",sub:"Is bitti, su molasi",who:"lostromo",
text:`Zor bir isin ardindan lostromo ilk kez acele etmedi. Sadece su uzatti.

"Kahramanlik sonra. Once su ic. Yorgun adam hatayi fark etmez."`
,
choices:[
{text:"Suyu icip kisa mola veririm",tag:"itaatkar",effect:{dinclik:10,sayginlik:5}},
{text:"Mola sirasinda bugunku isi kafamda toparlarim",tag:"akilli",effect:{dinclik:8,bilgi:4}},
{text:"Dinlenmeden devam ederim",tag:"korkak",effect:{dinclik:-4,cesaret:2}}]},

{id:"s187",gfx:"cabin",alert:false,day:"Gun 10",time:"13:20",loc:"Stajyer Kabini",sub:"Yirmi dakikalik gercek dinlenme",who:"anlatici",
text:`Bu kez elinde gercek bir bosluk var: ne alarm bekleniyor ne de hemen cagrilacaksin.

Gemide uzun tatil yok ama dogru kullanilan yirmi dakika bazen yarim gece kadar degerli gelir.

Bu arayi nasil kullanirsin?`,
choices:[
{text:"Alarm kurup kisa ama derin bir uyku alirim",tag:"kritik",effect:{dinclik:14,bilgi:2}},
{text:"Uzanir, gozlerimi kapatip bedenimi dinlendiririm",tag:"itaatkar",effect:{dinclik:9}},
{text:"Dinlenmek yerine telefonda oyalanirim",tag:"korkak",effect:{dinclik:-5}}]},

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
];
const START_SCENARIOS=[
  {time:"05:30", subPrefix:"Sabah sisi", intro:"Sabah erken, rıhtımın üstünde ince sis var.", bridgeCall:"Rampadan biri indi: \"Sen stajyer ${n} misin? 1. Zabiti köprüde bekliyor.\""},
  {time:"06:10", subPrefix:"Yağmurlu vardiya", intro:"Çiseliyor. Rıhtım ıslak, halatlar koyu renk kesilmiş gibi parlıyor.", bridgeCall:"Vardiya devrinden çıkan bir tayfa seni görünce bağırdı: \"Stajyer sensen çabuk ol, köprü seni bekliyor.\""},
  {time:"04:50", subPrefix:"Gece sonu telaşı", intro:"Gece daha tam dağılmamış. Projektörler güverteyi beyaz kesiyor, liman yarı uykuda.", bridgeCall:"Nöbetçi zabit merdiven ağzından seslendi: \"Geç kalmadın. Belgelerinle yukarı çık.\""},
  {time:"07:00", subPrefix:"Liman uğultusu", intro:"Forklift sesleri, vinç alarmları ve martı çığlıkları birbirine karışıyor.", bridgeCall:"Ajans görevlisi seni gemiye teslim ederken fısıldadı: \"İlk günün sert geçer, dikkatli ol.\""},
];
let selectedStartPort=START_PORTS[0];
let selectedStartScenario=START_SCENARIOS[0];
const DIFFICULTY={
  positiveGainMult:0.72,
  negativeLossMult:1.18,
  highStatThreshold:70,
  extremeStatThreshold:85,
  highStatGainMult:0.55,
  extremeStatGainMult:0.5,
  passiveFatigue:2,
  periodicStressEvery:5,
  periodicStressLoss:1,
};
const SYSTEM_STATE={
  consecutiveMistakes:0,
  totalMistakes:0,
  hiddenFailures:{bridge:0,deck:0,engine:0,compliance:0},
  triggeredChains:new Set(),
};

function getSceneOverlay(gfx){
  const overlays = {
    harbor:`<g opacity=".95">
      <path d="M250 90 h46 l12 5 h18 v4 h-78 z" fill="#0a1526"/>
      <rect x="266" y="78" width="26" height="12" rx="1.5" fill="#102948"/>
      <rect x="272" y="72" width="9" height="8" rx="1" fill="#143459"/>
      <circle cx="332" cy="98" r="1.6" fill="#d4a017"/>
      <path d="M388 100 h34 l9 4 h10 v3 h-53 z" fill="#101a2a" opacity=".8"/>
      <rect x="398" y="91" width="16" height="9" rx="1" fill="#16365f" opacity=".9"/>
    </g>`,
    sea:`<g opacity=".88">
      <path d="M300 95 h72 l16 6 h18 v5 h-106 z" fill="#081422"/>
      <rect x="332" y="81" width="26" height="14" rx="2" fill="#14365e"/>
      <rect x="338" y="74" width="11" height="8" rx="1" fill="#1a4a7f"/>
      <circle cx="357" cy="89" r="1.2" fill="#6fa8dc"/>
      <path d="M52 108 h38 l9 4 h12 v3 h-59 z" fill="#0a1422" opacity=".7"/>
      <rect x="63" y="100" width="14" height="8" rx="1" fill="#0f2c4c" opacity=".8"/>
    </g>`,
    night:`<g opacity=".9">
      <path d="M286 102 h84 l14 6 h14 v5 h-112 z" fill="#040b14"/>
      <rect x="322" y="89" width="22" height="13" rx="2" fill="#112746"/>
      <circle cx="347" cy="93" r="1.5" fill="#6fa8dc"/>
      <circle cx="354" cy="93" r="1.5" fill="#d4a017"/>
      <circle cx="360" cy="93" r="1.5" fill="#c93030"/>
      <path d="M72 112 h24 l7 3 h8 v2 h-39 z" fill="#060d18" opacity=".6"/>
    </g>`,
    storm:`<g opacity=".72">
      <path d="M312 108 h52 l12 5 h12 v4 h-76 z" fill="#091220"/>
      <rect x="328" y="97" width="18" height="11" rx="1.5" fill="#113050"/>
      <line x1="382" y1="90" x2="390" y2="108" stroke="#9bb0c8" stroke-width="1" opacity=".6"/>
    </g>`,
    bogaz:`<g opacity=".9">
      <path d="M276 96 h68 l13 5 h16 v4 h-97 z" fill="#091523"/>
      <rect x="304" y="83" width="22" height="13" rx="2" fill="#163457"/>
      <circle cx="348" cy="98" r="1.4" fill="#d4a017"/>
      <circle cx="352" cy="98" r="1.4" fill="#c93030"/>
    </g>`
  };
  return overlays[gfx] || '';
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
    const d=document.createElement('div');
    d.className='selb'+(t.key===selType?' active':'');
    d.innerHTML=`<span class="sb-ico">${t.ico}</span><span class="sb-nm">${t.nm}</span><span class="sb-kont">${kontStr} ay</span>`;
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

// ===== RASTGELE SENARYO SIRASI =====
function buildSceneQueue(pool, totalDays){
  // Zorunlu sahneler: s01 (başlangıç), FINAL (son)
  const mandatory_start = pool.filter(s=>s.id==='s01');
  const final = pool.filter(s=>s.id==='FINAL');
  const crisis_scenes = pool.filter(s=>s.id.startsWith('kriz'));
  const regular = pool.filter(s=>!s.id.startsWith('kriz')&&s.id!=='s01'&&s.id!=='FINAL');

  // Kriz sahnelerini grupla
  const crisisGroups=[
    ['kriz01','kriz02','kriz03'], // makine arızası
    ['kriz04','kriz05','kriz06'], // fırtına
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
  const needed=Math.max(5, totalDays - selectedCrisis.length - 2);
  const selectedRegular=shuffledRegular.slice(0,needed);

  // Sıralamayı oluştur: başlangıç + (karışık regular + kriz) + final
  const middle=[...selectedRegular,...selectedCrisis].sort(()=>Math.random()-0.5);

  return [...mandatory_start, ...middle, ...final];
}

const RECOVERY_SCENE_IDS = new Set(['s146','s147','s148','s149','s150','s183','s184','s185','s186','s187']);

function maybePrioritizeRecoveryScene(){
  if(currentIdx >= sceneQueue.length-1) return;
  if(stats.dinclik > 40) return;
  const nextScene = sceneQueue[currentIdx];
  if(nextScene && RECOVERY_SCENE_IDS.has(nextScene.id)) return;

  let foundIdx = -1;
  const nearLimit = Math.min(sceneQueue.length - 2, currentIdx + (stats.dinclik <= 25 ? 12 : 8));

  for(let i=currentIdx+1; i<=nearLimit; i++){
    const sc = sceneQueue[i];
    if(sc && RECOVERY_SCENE_IDS.has(sc.id)){
      foundIdx = i;
      break;
    }
  }

  if(foundIdx === -1){
    for(let i=nearLimit+1; i<sceneQueue.length-1; i++){
      const sc = sceneQueue[i];
      if(sc && RECOVERY_SCENE_IDS.has(sc.id)){
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
  document.getElementById('shipinfo').textContent=sn+' · '+stObj.nm+' · '+selYear;
  document.getElementById('contract-type').textContent=stObj.nm+' '+contractTotal+'+'+(KONTRAT_DEFS[selType]?.[selKontrat]?.izin||1)+'ay';

  const pct=Math.round((currentIdx/sceneQueue.length)*100);
  document.getElementById('progbar').style.width=pct+'%';
  document.getElementById('chaplbl').textContent='SAHNE '+(currentIdx+1)+'/'+sceneQueue.length;

  const ab=document.getElementById('alert-banner');
  if(sc.alert){ab.style.display='block';ab.textContent='⚠ ACİL DURUM — '+sc.sub;ab.style.color='#ffcccc';}
  else ab.style.display='none';

  const svg=document.getElementById('gfx-svg');
  svg.innerHTML=(GFX[sc.gfx]||GFX.sea)+getSceneOverlay(sc.gfx);

  playSceneAudio(sc);
  updateSceneNoteHints(sc);
  onSceneRender(sc);

  const ch=document.getElementById('choices');ch.innerHTML='';
  sc.choices.forEach(c2=>{
    const b=document.createElement('button');b.className='cbtn';
    b.innerHTML='<span class="ctag tag-'+(c2.tag||'akilli')+'">'+tagL[c2.tag||'akilli']+'</span>'+c2.text;
    b.onclick=()=>{
      sfxClick();
      ch.querySelectorAll('.cbtn').forEach(x=>{x.disabled=true;x.style.opacity='.4';});
      const pressure=evaluateDecisionPressure(sc,c2);
      const resolvedEffect={...(c2.effect||{})};
      Object.entries(pressure.extra).forEach(([k,v])=>{resolvedEffect[k]=(resolvedEffect[k]||0)+v;});
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
    };
    ch.appendChild(b);
  });
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
  currentIdx=0;

  stats={cesaret:40,bilgi:22,sayginlik:32,dinclik:68};
  mood=58;
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
  routeHistory=[{x:selectedStartPort.x,y:selectedStartPort.y}];
  visitedPorts=new Set([selectedStartPort.name]);
  shipPosition={x:selectedStartPort.x,y:selectedStartPort.y};
  scenesSinceEvent=0;
  nextEventAt=5+Math.floor(Math.random()*4);
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
      <span class="crew-ico">${def.icon}</span>
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
  {name:"İzmir", x:85, y:130, visited:true},
  {name:"Çanakkale", x:130, y:100, visited:false},
  {name:"İstanbul", x:180, y:85, visited:false},
  {name:"Ambarli", x:172, y:92, visited:false},
  {name:"Pire", x:120, y:160, visited:false},
  {name:"Malta", x:95, y:175, visited:false},
  {name:"Valensiya", x:22, y:108, visited:false},
  {name:"Cebelitarık", x:8, y:120, visited:false},
  {name:"Algeciras", x:10, y:125, visited:false},
  {name:"İskenderiye", x:200, y:210, visited:false},
  {name:"Kıbrıs", x:170, y:170, visited:false},
  {name:"Port Said", x:228, y:200, visited:false},
  {name:"Cenova", x:60, y:80, visited:false},
  {name:"Barselona", x:30, y:100, visited:false},
  {name:"Trieste", x:102, y:52, visited:false},
  {name:"Messina", x:78, y:145, visited:false},
  {name:"Haifa", x:212, y:188, visited:false},
  {name:"Suveys", x:245, y:212, visited:false},
  {name:"Rotterdam", x:25, y:18, visited:false},
  {name:"Mersin", x:180, y:180, visited:false},
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
    'Aden':{x:300,y:230}, 'Süveyş':{x:250,y:195},
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
  const region = shipPosition.x < 60 ? 'BATI AKDENIZ' : shipPosition.x < 150 ? 'ORTA AKDENIZ' : shipPosition.y < 110 ? 'TURK BOGAZLARI' : 'DOGU AKDENIZ';
  const regionFill = region==='BATI AKDENIZ' ? '#02111f' : region==='ORTA AKDENIZ' ? '#03101d' : region==='TURK BOGAZLARI' ? '#041320' : '#04111b';
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
    const color = visited ? '#5dbf8a' : '#2e6bbf';
    s+=`<circle cx="${px}" cy="${py}" r="${visited?5:3}" fill="${color}" opacity="${visited?1:.6}"/>`;
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
  legend.textContent = `🟢 Uğranan liman  🔵 Planlanan liman  🟡 ${sn||'Gemimiz'}  — ${visitedPorts.size} liman uğrandı`;
}

// ===== SEYİR GÜNLÜĞİ =====
let journalEntries = [];
const seenColregHints = new Set();
const STUDENT_NOTES = [
  {head:"KOPRUUSTU VARDIYASI", body:"Look-out, COLREG, rota takibi, ECDIS kontrolu, radar cross-check ve logbook disiplini vardiyanin omurgasidir.<br>Vardiya devrinde rota, trafik, hava, makina durumu ve beklenen manevra net aktarilir.<br>Master'in standing orders ve night orders'i bilinmeden vardiya tutulmaz.", tip:"Once gozlem, sonra yorum."},
  {head:"ANA KURALLAR", body:"Sormadan varsayma.<br>Gormeden dogru kabul etme.<br>Hata gordugunde saklama, amire bildir.<br>PPE'siz ise baslama.<br>Snap-back zone'a girme.<br>Kapali mahalde permitsiz girme.<br>Stop komutu duyuldugunda herkes durur.<br>Near-miss de raporlanir.", tip:"Denizcilikte disiplin tekrar degil, hayatta kalma bicimidir."},
  {head:"COLREG OZETI", body:"Head-on durumda iki gemi de sancaga duser.<br>Crossing'de sancaginda gemi goruyorsan give-way sensin.<br>Overtaking yapan gemi yol verir.<br>Dar kanalda sancak tarafina yakin seyredilir.<br>Rule 5 lookout, Rule 7 risk, Rule 8 action, Rule 9 narrow channel, Rule 13 overtaking, Rule 14 head-on, Rule 15 crossing, Rule 18 hierarchy.", tip:"Erken ve belirgin manevra altin degerindedir."},
  {head:"ECDIS / HARITA", body:"Route check, safety contour, safety depth, no-go area, isolated danger ve alarm ayarlari seyirden once gozden gecirilir.<br>GPS bilgisi radar, gorusel mevki ve diger sensorlerle capraz kontrol edilir.<br>Waypoint'ler, parallel indexing, XTD ve chart correction mantigi bilinmelidir.", tip:"ECDIS yardimcidir; seyir sorumlulugu zabittedir."},
  {head:"FENER VE SAMANDIRA", body:"IALA lateral markalarda renk, tepe isareti ve isik karakteri birlikte okunur.<br>Fl, Oc, Iso, Q, VQ, LFl ve sektor renkleri fenerleri ayirt etmeyi saglar.<br>Cardinal marklarda kuzey-gu ney-dogu-bati tepe isaretleri ve siyah-sari renk dizilimi ezberlenmelidir.", tip:"Renk kadar ritmi de oku."},
  {head:"PILOT / ROMORKOR / LIMAN", body:"Pilot ladder durumu, can simidi ve isik kontrolu, personel konumu ve haberlesme disiplini kritik konulardir.<br>Master-pilot exchange yapilir; snap-back zone bos tutulur.<br>Heaving line, tug line, berthing plan, current-rüzgar etkisi ve mooring team konumlari net olmalidir.", tip:"Mooring station saka kabul etmez."},
  {head:"LIMAN VE EVRAK", body:"Notice of Readiness, Bill of Lading, Mate's Receipt, Statement of Facts, manifest, stowage plan, Oil Record Book ve Garbage Record Book temel evraklardandir.<br>Uyumsuzluk gordugunde amire hemen bildirilir.<br>Laytime, demurrage, dispatch, arrival condition ve sea protest temel kavramlardir.", tip:"Saklanan hata buyur."},
  {head:"PSC / ISPS / SOLAS / STCW", body:"PSC denetiminde evrak, emniyet ekipmani, drill kayitlari, GMDSS testleri ve gemi kondisyonu birlikte incelenir.<br>ISPS tarafinda gangway kontrolu, ziyaretci kaydi ve security level takibi esastir.<br>SOLAS can emniyeti, STCW yeterlilik ve vardiya standartlarini kurar.", tip:"Denetime her gun hazir olunur."},
  {head:"ACIL HABERLESME", body:"MAYDAY distress, PAN-PAN urgency, SECURITE emniyet yayini icindir.<br>Mesajda gemi adi, callsign, pozisyon, tehlikenin cinsi, yardim ihtiyaci ve kisi sayisi acik verilir.<br>GMDSS, EPIRB, SART, NAVTEX, DSC, handheld VHF ve emergency battery kayitlari bilinir.", tip:"Netlik hiz kadar onemlidir."},
  {head:"FORMULLER - HIZ / MESAFE / ZAMAN", body:"Mesafe = Hiz x Zaman<br>Hiz = Mesafe / Zaman<br>Zaman = Mesafe / Hiz<br>1 knot = 1 deniz mili / saat<br>Gece ETA hesaplari icin once kalan mesafe, sonra mevcut SOG kullanilir.", tip:"Basit formuller vardiyada en cok kullanilanlardir."},
  {head:"FORMULLER - SET / DRIFT / CTS", body:"Course to Steer mantigi: istenen COG icin akinti vektorunu hesaba kat.<br>Drift = akintinin hizi<br>Set = akintinin yonu<br>Gercek iz = verilen rota + akinti etkisi<br>Pratikte radar, ECDIS ve DR karsilastirilir.", tip:"Pruva baska, iz baska olabilir."},
  {head:"FORMULLER - GEL-GIT / UKC", body:"UKC = Mevcut su derinligi - gemi drafti<br>Mevcut su derinligi = charted depth + tide height<br>Tide height high water ve low water verisiyle bulunur.<br>Dar suda squat de hesaba katilmalidir.", tip:"Kagittaki derinlik her zaman o anki derinlik degildir."},
  {head:"FORMULLER - STABILITE", body:"tan(theta) = heeling moment / (displacement x GM)<br>Trim change = trimming moment / MCTC<br>Corrected GM = GM - FSC/displacement<br>Shift of G formu: GG1 = (w x d) / Delta", tip:"Stabilite rakam degil, geminin davranisidir."},
  {head:"FORMULLER - YUK / HESAP", body:"Yukleme miktari = son draft survey - ilk draft survey<br>Density correction, TPC, MCTC ve displacement tablolarla birlikte kullanilir.<br>Yuk merkezi yukseldikce GM dusme egilimindedir.<br>Sounding-ullage tablolarinda tank kalibrasyonu esas alinir.", tip:"Hesap yaparken birimi karistirma."},
  {head:"FORMULLER - SEXTANT / ASTRONOMI", body:"Yaklasik meridian altitude mantigi: Latitude ~ 90 - Ho + Dec (ayni isimdeyse) veya 90 - Ho - Dec (ters isimdeyse).<br>Index error, dip ve refraction duzeltmeleri unutulmaz.<br>Sextant klasik bir alettir ama denizcilik zihnini keskinlestirir.", tip:"Sextant sadece nostalji degil, geometri disiplinidir."},
  {head:"YUK OPERASYONU / LASHING", body:"Yuk ellecleme sirasinda isaretlesme, guvenli alan, vinc altina girmeme ve stop komutunun netligi esastir.<br>Lashing gerginligi, twist lock, turnbuckle, rod ve hava oncesi son kontrol ihmal edilmez.<br>Cargo securing manual referans dokumandir.", tip:"Near-miss de raporlanir."},
  {head:"STABILITE / BALLAST", body:"GM, trim, list, free surface effect, displacement ve MCTC kavramlari temel bilinmelidir.<br>Ballast operasyonunda sounding, valf sirasi, tank secimi ve hedef trim/list birlikte dusunulur.<br>Slack tank bazen gizli dusmandir.", tip:"Bir tanki duzeltirken baska sorunu yaratma."},
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
  {term:"NOR", meaning:"Notice of Readiness; geminin yuke hazir oldugunu bildiren resmi ihbar.", example:"Charter taraftan laytime tartismasi cikarsa NOR saati kritik olur."},
  {term:"SOF", meaning:"Statement of Facts; liman operasyon zamanlarini kaydeden belge.", example:"SOF ile logbook uyumsuzsa PSC veya charter sorusu dogabilir."},
  {term:"Waypoint", meaning:"Seyir planindaki donus veya referans noktasi.", example:"Yanlis waypoint aktif olursa rota butununden sapma baslar."},
  {term:"Watchkeeping", meaning:"Vardiya tutma disiplini ve sorumluluklari.", example:"Watchkeeping sadece ayakta durmak degil, surekli degerlendirmedir."}
];
let notesTab = 'kurallar';
let notesSearch = '';
let selectedGlossaryTerm = GLOSSARY_TERMS[0]?.term || '';
let currentNoteTopics = new Set();

function getNoteCategory(note){
  if(note.head.includes('FORMULLER')) return 'formuller';
  if(note.head.includes('SOZLUGU')) return 'sozluk';
  return 'kurallar';
}

function getRelevantNoteTopics(sc){
  const hay = `${sc.sub||''} ${sc.loc||''} ${sc.text||''} ${sc.gfx||''}`.toLowerCase();
  const topics = new Set();
  if(/colreg|crossing|head-on|dar kanal|look-?out/.test(hay)) topics.add('COLREG OZETI');
  if(/ecdis|harita|radar|waypoint|gps|route/.test(hay)) topics.add('ECDIS / HARITA');
  if(/fener|isik|samandira|iala|sector/.test(hay)) topics.add('FENER VE SAMANDIRA');
  if(/pilot|romorkor|mooring|snap-back|heaving line|berthing/.test(hay)) topics.add('PILOT / ROMORKOR / LIMAN');
  if(/psc|isps|solas|stcw|security|gangway/.test(hay)) topics.add('PSC / ISPS / SOLAS / STCW');
  if(/mayday|pan-pan|securite|vhf|gmdss|navtex|epirb|sart/.test(hay)) topics.add('ACIL HABERLESME');
  if(/demir|anchor|anchorage|holding ground|dragging|shackle/.test(hay)) topics.add('KOPRUUSTU VARDIYASI');
  if(/stabil|gm|trim|list|ballast|heel|fsc|mctc/.test(hay)) topics.add('STABILITE / BALLAST');
  if(/gel-git|tidal|ukc|under keel|draft/.test(hay)) topics.add('FORMULLER - GEL-GIT / UKC');
  if(/set|drift|course to steer|cog|sog|seyir/.test(hay)) topics.add('FORMULLER - SET / DRIFT / CTS');
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
  if(!c || !detail) return;
  if(search && search.value !== notesSearch) search.value = notesSearch;
  document.querySelectorAll('.notes-tab').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase() === notesTab);
  });
  if(notesTab === 'sozluk'){
    const terms = GLOSSARY_TERMS.filter(g => (`${g.term} ${g.meaning} ${g.example}`).toLowerCase().includes(notesSearch));
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

function addPhoto(title, caption, svgKey){
  photos.push({title, caption, svgKey, day: currentDay});
  document.getElementById('tb-photos-count').textContent = photos.length;
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
  if(sc.alert) addPhoto(`ACİL: ${sc.sub}`, sc.day+' · '+sc.time, sc.gfx);
  else if(sc.id==='s01') addPhoto('İlk Adım', 'İskeleye ilk kez ayak basıyorum...', 'harbor');
  else if(sc.id==='FINAL') addPhoto('Son Gün', 'Bu yolculuğun son sahnesi.', 'bridge');
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

// Sahneye göre ses çal
function playSceneAudio(sc){
  const gfx = sc.gfx || '';
  const alert = sc.alert || false;
  
  if(alert){
    if(gfx === 'pirate') { setTimeout(sfxPirateAmbiance, 300); sfxAlarm(); }
    else if(gfx === 'bogaz') { sfxBogazAmbiance(); setTimeout(()=>playTone(440,'square',0.1,0.3),500); }
    else if(gfx === 'engine_fault') { sfxEngineAlarm(); }
    else { sfxAlarm(); }
  } else {
    if(gfx === 'storm') sfxStormAmbiance();
    else if(gfx==='fire') { stopAllMusic(); sfxAlarm(); }
    else if(gfx === 'radar') { stopAllMusic(); sfxRadarBip(); }
    else if(gfx === 'engine') { stopAllMusic(); sfxShipEngine(); }
    else if(gfx==='harbor') { sfxHarbor(); sfxOceanAmbiance(); }
    else if(gfx==='sea'||gfx==='night'||gfx==='sunrise'||gfx==='port_arrival') { sfxShipEngine(); sfxOceanAmbiance(); }
    else if(gfx==='cabin'||gfx==='galley') {
      sfxOceanAmbiance();
      if(sc.id==='s115'||sc.id==='s116') setTimeout(sfxHomesickCry, 450);
    }
    else { stopAllMusic(); }
  }
}


// ===== BAŞLATMA =====
document.getElementById('nameinp').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('shipnameinp').focus();});
document.getElementById('shipnameinp').addEventListener('keydown',e=>{if(e.key==='Enter')beginGame();});
buildIntro();

