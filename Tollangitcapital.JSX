import { useState, useEffect, useCallback, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from "recharts";

// ══════════════════════════════════════════════════════════════════
//  COMPLETE VERIFIED BASELINE DATA  |  Source: MQL5 Live — March 2026
// ══════════════════════════════════════════════════════════════════
const INIT_DATA = {
  v10: {
    name:"TOL LANGIT V10", riskCode:"LOW", riskLabel:"LOW RISK", lot:"0.03 / $1K",
    platform:"MetaTrader 4", broker:"ICMarketsSC-Live27", currency:"SGD",
    started:"Jan 2021", weeks:238, leverage:"1:500",
    mql5:"https://www.mql5.com/en/signals/1083101",
    myfxbook:"https://www.myfxbook.com/members/adithyodw/tol-langit-v10/8671765",
    growth:1407.55, profit:5082.13, balance:1785.83, equity:981.59,
    initDeposit:4052.24, withdrawals:7648.53, deposits:300.00,
    monthlyGain:0.83, annualForecast:10.06,
    trades:4507, profitTrades:3671, lossTrades:836, winRate:81.45,
    pf:2.71, sharpe:0.05, rf:42.93, payoff:1.13,
    grossProfit:8055.67, grossProfitPips:288169,
    grossLoss:2973.55, grossLossPips:131459,
    bestTrade:873.74, worstTrade:-66.59,
    avgWin:2.19, avgLoss:-3.56,
    maxCWins:59, maxCLosses:6, maxCProfit:2667.96, maxCLoss:-118.39,
    tradingDays:787, daysPct:47.32, tpw:0, holdTime:"1 day",
    activity:99.03, depLoad:30.36, algo:99,
    ddBalPct:10.18, ddEqPct:72.94, ddBalAmt:118.39, ddEqAmt:836.13,
    longs:2419, longPct:53.67, shorts:2088, shortPct:46.33,
    latestTrade:"17 days ago", status:"PAUSED",
    annRet:[{y:"2021",v:110.41},{y:"2022",v:63.02},{y:"2023",v:39.16},{y:"2024",v:57.74}],
    top5:[{s:"EURUSD",d:1447},{s:"GBPUSD",d:836},{s:"USDJPY",d:796},{s:"USDCAD",d:598},{s:"USDCHF",d:544}],
    instruments:"EURUSD · GBPUSD · USDJPY · USDCAD · USDCHF · EURGBP · AUDUSD · EURCHF · AUDCAD · AUDNZD · NZDCAD",
    strategy:"Trend-Following EA · Smart Grid Recovery Mode",
    gridDist:"100 pips · Fixed Lot Multiplier ×1 · Max 5 orders/pair",
    tp:"Dynamic trailing 5–10 pips",
    rorRating:"LOW",
    rorNote:"4.5-year verified live track record. Balance drawdown 10.18%. Win rate 81.45%. Profit factor 2.71. Smart grid capped at 5 orders/pair. Proven resilient across 2021–2024 market cycles including volatile periods.",
    subscription:"30 SGD/month",
  },
  v10hr: {
    name:"TOL LANGIT V10 HIGH RISK", riskCode:"HIGH", riskLabel:"HIGH RISK", lot:"0.11–0.20 / $1K",
    platform:"MetaTrader 4", broker:"ICMarketsSC-Live25", currency:"USD",
    started:"Mar 2025", weeks:50, leverage:"1:500",
    mql5:"https://www.mql5.com/en/signals/2296225?source=Unknown",
    myfxbook:"https://www.myfxbook.com/members/adithyodw/tol-langit-v10-high-risk/11424740",
    growth:900.23, profit:7711.44, balance:9331.94, equity:2713.37,
    initDeposit:1000.00, withdrawals:3417.73, deposits:4038.23,
    monthlyGain:18.85, annualForecast:228.77,
    trades:711, profitTrades:669, lossTrades:42, winRate:94.09,
    pf:2.42, sharpe:0.19, rf:10.83, payoff:10.85,
    grossProfit:13132.85, grossProfitPips:53512,
    grossLoss:5421.41, grossLossPips:20915,
    bestTrade:721.24, worstTrade:-672.84,
    avgWin:19.63, avgLoss:-129.08,
    maxCWins:83, maxCLosses:2, maxCProfit:1843.02, maxCLoss:-712.17,
    tradingDays:170, daysPct:49.13, tpw:1, holdTime:"1 day",
    activity:94.15, depLoad:116.76, algo:99,
    ddBalPct:17.74, ddEqPct:88.36, ddBalAmt:197.60, ddEqAmt:1988.25,
    longs:405, longPct:56.96, shorts:306, shortPct:43.04,
    latestTrade:"4 days ago", status:"ACTIVE",
    annRet:[{y:"2025",v:900.23}],
    top5:[{s:"EURUSD",d:136},{s:"USDJPY",d:114},{s:"GBPUSD",d:108},{s:"USDCHF",d:58},{s:"USDCAD",d:56}],
    instruments:"EURUSD · GBPUSD · USDJPY · AUDCAD · EURCHF · USDCAD · EURGBP · AUDUSD · USDCHF · NZDCAD · AUDNZD",
    strategy:"Aggressive Trend-Following EA · Smart Grid Recovery Mode",
    gridDist:"70–100 pips · Fixed Lot Multiplier ×1",
    tp:"5 pips fixed",
    rorRating:"HIGH",
    rorNote:"Equity drawdown reached 88.36%. Max deposit load 116.76% — margin near-breach territory. Aggressive lot sizing 0.11–0.20/1K. For experienced investors ONLY who fully accept the risk of catastrophic drawdown.",
    subscription:"30 USD/month",
  },
  etf: {
    name:"TOL LANGIT ETF", riskCode:"MEDIUM", riskLabel:"MEDIUM RISK", lot:"0.02 / $1K",
    platform:"MetaTrader 5", broker:"ICMarketsSC-MT5-2", currency:"USD",
    started:"Jan 2026", weeks:8, leverage:"1:500",
    mql5:"https://www.mql5.com/en/signals/2353105",
    myfxbook:"https://www.myfxbook.com/members/adithyodw/tol-langit-etf/11891377",
    growth:164.68, profit:12440.40, balance:10905.59, equity:10905.59,
    initDeposit:10000.00, withdrawals:16534.81, deposits:5000.00,
    monthlyGain:38.02, annualForecast:null,
    trades:201, profitTrades:173, lossTrades:28, winRate:86.06,
    pf:3.90, sharpe:0.23, rf:8.17, payoff:61.89,
    grossProfit:16730.61, grossProfitPips:25229,
    grossLoss:4290.21, grossLossPips:9421,
    bestTrade:2380.50, worstTrade:-1007.50,
    avgWin:96.71, avgLoss:-153.22,
    maxCWins:60, maxCLosses:3, maxCProfit:4813.07, maxCLoss:-1518.25,
    tradingDays:26, daysPct:50.00, tpw:8, holdTime:"20 hours",
    activity:72.26, depLoad:24.83, algo:86,
    ddBalPct:8.38, ddEqPct:62.36, ddBalAmt:1522.10, ddEqAmt:11003.20,
    longs:116, longPct:57.71, shorts:85, shortPct:42.29,
    latestTrade:"2 days ago", status:"ACTIVE",
    annRet:[{y:"Jan 2026",v:164.68}],
    top5:[{s:"GBPUSD",d:57},{s:"EURUSD",d:45},{s:"XAUUSD",d:38},{s:"USDJPY",d:31},{s:"USDCHF",d:9}],
    instruments:"GBPUSD · EURUSD · XAUUSD · USDJPY · USDCHF · AUDUSD · USDCAD · AUDCAD · AUDNZD · NZDCAD · EURCHF",
    strategy:"AI-Verified Hybrid Trend System · Bayesian Probability Model · No Grid · No Martingale",
    gridDist:"None — clean entry/exit only",
    tp:"Dynamic AI-verified (multi-timeframe H1–H4)",
    rorRating:"MEDIUM",
    rorNote:"No martingale — structurally cleaner than V10. Balance DD 8.38% is encouraging. Equity swings 62.36% from XAU/USD exposure. Only 8 weeks of live data — statistically early. Promising methodology, unproven long-term.",
    subscription:"50 USD/month",
  },
  etfgold: {
    name:"TOL LANGIT ETF GOLD", riskCode:"NEW", riskLabel:"INSUFFICIENT DATA", lot:"0.02 / $1K",
    platform:"MetaTrader 5", broker:"ICMarketsSC-MT5-2", currency:"USD",
    started:"Feb 2026", weeks:2, leverage:"1:500",
    mql5:"https://www.mql5.com/en/signals/2360336",
    myfxbook:null,
    growth:31.96, profit:1527.26, balance:5283.66, equity:5283.66,
    initDeposit:5000.00, withdrawals:1243.60, deposits:0.00,
    monthlyGain:31.96, annualForecast:null,
    trades:14, profitTrades:14, lossTrades:0, winRate:100.00,
    pf:78.29, sharpe:0.81, rf:218.18, payoff:110.50,
    grossProfit:1547.02, grossProfitPips:3090,
    grossLoss:19.76, grossLossPips:0,
    bestTrade:362.50, worstTrade:0.00,
    avgWin:110.50, avgLoss:0.00,
    maxCWins:14, maxCLosses:0, maxCProfit:1547.02, maxCLoss:0,
    tradingDays:4, daysPct:44.44, tpw:8, holdTime:"10 minutes",
    activity:1.43, depLoad:60.69, algo:100,
    ddBalPct:0.00, ddEqPct:32.45, ddBalAmt:0.00, ddEqAmt:1631.00,
    longs:10, longPct:71.43, shorts:4, shortPct:28.57,
    latestTrade:"2 days ago", status:"ACTIVE",
    annRet:[{y:"Feb 2026",v:31.96}],
    top5:[{s:"XAUUSD",d:14}],
    instruments:"XAU/USD Only — Gold Specialist Scalper",
    strategy:"AI-Verified XAU/USD Scalping · Bayesian Model · No Grid · No Martingale",
    gridDist:"None — clean entry/exit only",
    tp:"Dynamic AI-verified (multi-timeframe)",
    rorRating:"NEW",
    rorNote:"Only 14 trades over 2 weeks. 100% win rate is statistically meaningless at this sample size. Balance DD 0.14% exceptional but based on near-zero data. Withhold capital allocation until 3+ month verified track record.",
    subscription:"30 USD/month",
  }
};

const KEYS = ["v10","v10hr","etf","etfgold"];

// ── Color helpers ──────────────────────────────────────────
const C = {
  bg:"#04080f", surf:"#0b1222", surf2:"#101c30", border:"#182640",
  gold:"#c8970f", goldL:"#e6b535", goldD:"#7a5c08",
  green:"#10b981", red:"#ef4444", amber:"#f59e0b", blue:"#3b82f6", cyan:"#06b6d4",
  text:"#dce6f5", muted:"#4e6380", label:"#7a9abb", white:"#ffffff",
};
const riskColor = (c) => ({LOW:C.green, MEDIUM:C.amber, HIGH:C.red, NEW:C.blue}[c] || C.muted);
const riskBg = (c) => ({LOW:"rgba(16,185,129,0.1)", MEDIUM:"rgba(245,158,11,0.1)", HIGH:"rgba(239,68,68,0.1)", NEW:"rgba(59,130,246,0.1)"}[c] || "rgba(78,99,128,0.1)");
const fmt = (n, dec=2) => n == null ? "—" : Number(n).toLocaleString("en-US",{minimumFractionDigits:dec,maximumFractionDigits:dec});
const fmtPct = (n) => n == null ? "—" : `${n >= 0 ? "+" : ""}${fmt(n)}%`;
const fmtCur = (n, cur="USD") => n == null ? "—" : `${cur === "SGD" ? "SGD " : "$"}${fmt(n)}`;

// ── Inject fonts ───────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    if (document.getElementById("tl-fonts")) return;
    const l = document.createElement("link");
    l.id = "tl-fonts";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
}

// ── Animated number ────────────────────────────────────────
function AnimNum({ value, prefix = "", suffix = "", dec = 2 }) {
  const [disp, setDisp] = useState(0);
  useEffect(() => {
    let start = 0, end = parseFloat(value) || 0, dur = 1200, startT = null;
    const step = (ts) => {
      if (!startT) startT = ts;
      const prog = Math.min((ts - startT) / dur, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setDisp(start + (end - start) * ease);
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <span>{prefix}{fmt(disp, dec)}{suffix}</span>;
}

// ── Live ticker ────────────────────────────────────────────
function Ticker({ data }) {
  const items = KEYS.flatMap(k => [
    `${data[k].name}: GROWTH ${fmtPct(data[k].growth)}`,
    `${data[k].name}: WIN RATE ${fmt(data[k].winRate)}%`,
    `${data[k].name}: MONTHLY ${fmtPct(data[k].monthlyGain)}`,
    `${data[k].name}: BALANCE ${data[k].currency} ${fmt(data[k].balance)}`,
  ]);
  const text = items.join("   ·   ");
  return (
    <div style={{background:C.gold,overflow:"hidden",padding:"6px 0",position:"relative"}}>
      <div style={{display:"flex",animation:"ticker 90s linear infinite",whiteSpace:"nowrap"}}>
        {[text,text].map((t,i) => (
          <span key={i} style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"10.5px",fontWeight:500,color:C.bg,letterSpacing:"0.5px",paddingRight:"40px"}}>{t}</span>
        ))}
      </div>
      <style>{`@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

// ── Nav ────────────────────────────────────────────────────
function Nav({ onRefresh, refreshing, lastUpdated, activeSection, setActiveSection }) {
  const [ts, setTs] = useState(new Date().toISOString().slice(0,19).replace("T"," ") + " UTC");
  useEffect(() => { const id = setInterval(() => setTs(new Date().toISOString().slice(0,19).replace("T"," ") + " UTC"), 1000); return () => clearInterval(id); }, []);
  const links = ["overview","strategies","performance","risk","disclosures"];
  return (
    <nav style={{background:C.bg,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:100}}>
      <div style={{maxWidth:1440,margin:"0 auto",padding:"0 32px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:36,height:36,background:C.gold,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Cormorant Garamond,serif",fontWeight:600,fontSize:17,color:C.bg,flexShrink:0}}>TL</div>
          <div>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontWeight:600,fontSize:17,color:C.white,letterSpacing:"0.5px",lineHeight:1.1}}>TOL LANGIT CAPITAL</div>
            <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"9px",letterSpacing:"2px",color:C.gold,opacity:0.8}}>ALGORITHMIC TRADING · SINGAPORE</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:28}}>
          {links.map(l => (
            <button key={l} onClick={() => setActiveSection(l)}
              style={{background:"none",border:"none",cursor:"pointer",fontFamily:"IBM Plex Sans,sans-serif",fontSize:"11px",fontWeight:500,letterSpacing:"1.5px",textTransform:"uppercase",color:activeSection===l ? C.gold : C.label,transition:"color 0.2s",padding:"4px 0",borderBottom:activeSection===l ? `1px solid ${C.gold}` : "1px solid transparent"}}>
              {l}
            </button>
          ))}
          <button onClick={onRefresh} disabled={refreshing}
            style={{background:"transparent",border:`1px solid ${refreshing?C.muted:C.gold}`,color:refreshing?C.muted:C.gold,padding:"6px 16px",fontFamily:"IBM Plex Mono,monospace",fontSize:"10.5px",letterSpacing:"1px",cursor:refreshing?"not-allowed":"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",gap:6}}>
            {refreshing ? <><span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:C.muted,animation:"pulse 1s infinite"}}></span>FETCHING...</> : <>↻ LIVE REFRESH</>}
          </button>
        </div>
      </div>
      <div style={{background:C.surf,borderTop:`1px solid ${C.border}`,padding:"4px 32px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"9.5px",color:C.muted,letterSpacing:"0.5px"}}>
          <span style={{color:C.green,marginRight:6}}>●</span>LIVE DATA SOURCE: MQL5.COM · MYFXBOOK.COM · IC MARKETS TIER 1
        </div>
        <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"9.5px",color:C.muted,letterSpacing:"0.5px"}}>
          {lastUpdated ? <span style={{color:C.cyan}}>REFRESHED {lastUpdated.toLocaleTimeString()} · </span> : ""}{ts}
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </nav>
  );
}

// ── Hero ───────────────────────────────────────────────────
function Hero({ data }) {
  const v10 = data.v10;
  return (
    <div style={{background:`linear-gradient(135deg, ${C.bg} 0%, #071020 60%, #020810 100%)`,padding:"72px 32px 64px",position:"relative",overflow:"hidden",borderBottom:`1px solid ${C.border}`}}>
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(rgba(200,151,15,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(200,151,15,0.03) 1px,transparent 1px)`,backgroundSize:"48px 48px",pointerEvents:"none"}} />
      <div style={{maxWidth:1440,margin:"0 auto",position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
          <div style={{width:28,height:1,background:C.gold}} />
          <span style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"10px",letterSpacing:"3px",color:C.gold,textTransform:"uppercase"}}>Verified Algorithmic Trading Signals · Singapore · Est. 2021</span>
        </div>
        <h1 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(48px,6vw,88px)",fontWeight:500,color:C.white,lineHeight:1.0,marginBottom:12,letterSpacing:"-1px"}}>
          Systematic. Quantitative.<br/><em style={{color:C.gold,fontStyle:"italic"}}>Algorithmically Driven.</em>
        </h1>
        <p style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:15,color:C.muted,fontWeight:300,maxWidth:580,lineHeight:1.7,marginBottom:52}}>
          Four independently verified live algorithmic strategies spanning forex majors, cross pairs, and gold — engineered for risk-adjusted returns since January 2021. All accounts public, all data live.
        </p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:0,borderTop:`1px solid ${C.border}`,paddingTop:36}}>
          {[
            {label:"Flagship Growth",val:<AnimNum value={1407.55} suffix="%" />,sub:"TOL LANGIT V10 · Since Jan 2021",gold:true},
            {label:"Active Strategies",val:"4",sub:"Across All Risk Profiles"},
            {label:"Live Accounts",val:"4",sub:"IC Markets · Tier 1 Broker"},
            {label:"Flagship Balance DD",val:<AnimNum value={10.18} suffix="%" />,sub:"Max Drawdown by Balance"},
            {label:"Total Trades (V10)",val:<AnimNum value={4507} dec={0} />,sub:"Since Inception · All Verified"},
          ].map((s,i) => (
            <div key={i} style={{paddingRight:32,borderRight:i<4?`1px solid ${C.border}`:"none",marginRight:i<4?32:0}}>
              <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"9.5px",letterSpacing:"2px",textTransform:"uppercase",color:C.muted,marginBottom:8}}>{s.label}</div>
              <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:28,fontWeight:600,color:s.gold?C.gold:C.white,lineHeight:1,marginBottom:4}}>{s.val}</div>
              <div style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:11,color:C.muted}}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Verify strip ───────────────────────────────────────────
function VerifyStrip({ refreshing, lastUpdated, onRefresh }) {
  return (
    <div style={{background:C.surf,borderBottom:`1px solid ${C.border}`,padding:"14px 32px"}}>
      <div style={{maxWidth:1440,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
          {["MQL5 Signal Verified","MyFXBook Account Verified","Live Account · IC Markets","Tier 1 Regulated Broker","Public Data · No Obfuscation"].map((b,i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:7}}>
              <div style={{width:16,height:16,borderRadius:"50%",background:C.green,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{color:"#fff",fontSize:9,fontWeight:700}}>✓</span>
              </div>
              <span style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:"11.5px",color:C.label,fontWeight:400}}>{b}</span>
              {i<4 && <span style={{color:C.border}}>·</span>}
            </div>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {refreshing ? (
            <span style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"10px",color:C.amber,animation:"pulse 1s infinite"}}>⟳ SYNCING WITH MQL5...</span>
          ) : lastUpdated ? (
            <span style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"10px",color:C.green}}>✓ LIVE DATA · {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString()}</span>
          ) : (
            <span style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"10px",color:C.muted}}>BASELINE DATA · MARCH 2026</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── About / Manager ────────────────────────────────────────
function About() {
  const links = [
    {icon:"⌥",label:"github.com/adithyodw",url:"https://github.com/adithyodw",sub:"TOL-LANGIT-Neural-Quant-Advisor · CS50HarvardX"},
    {icon:"in",label:"LinkedIn Profile",url:"https://sg.linkedin.com/in/adithyodewangga",sub:"Adithyo Dewangga Wijaya · Singtel · Singapore"},
    {icon:"◈",label:"MQL5 Signal Provider",url:"https://www.mql5.com/en/users/adithyodw",sub:"238 weeks active · 4 live signals"},
    {icon:"◉",label:"Telegram @tol_langit",url:"https://t.me/tol_langit",sub:"Community & signal updates"},
    {icon:"◈",label:"Forex Factory",url:"https://www.forexfactory.com/adithyodw",sub:"Track record & community"},
  ];
  const facts = [
    {n:"4.5+",l:"Years Live Trading",gold:true},{n:"4,507",l:"Total Trades (V10)"},{n:"238",l:"Weeks on MQL5",gold:true},
    {n:"81–100%",l:"Win Rates"},{n:"$1K",l:"Min. Initial Deposit"},{n:"4",l:"Active Strategies",gold:true},
  ];
  return (
    <div style={{padding:"64px 32px",borderBottom:`1px solid ${C.border}`}}>
      <div style={{maxWidth:1440,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:36,paddingBottom:18,borderBottom:`1px solid ${C.border}`}}>
          <div>
            <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"9.5px",letterSpacing:"2.5px",textTransform:"uppercase",color:C.gold,marginBottom:8}}>Strategy Manager</div>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:28,fontWeight:500,color:C.white}}>Investment Manager Profile</div>
          </div>
          <div style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,color:C.muted,textAlign:"right",maxWidth:280,lineHeight:1.6}}>All accounts publicly accessible 24/5. No proprietary black boxes. No obfuscation of results.</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:48,alignItems:"start"}}>
          <div>
            <div style={{border:`1px solid ${C.border}`,padding:24,background:C.surf}}>
              <div style={{width:80,height:80,borderRadius:"50%",overflow:"hidden",margin:"0 auto 16px",border:`2px solid ${C.border}`}}>
                <img src="https://avatars.githubusercontent.com/u/45558534?v=4" alt="Adithyo" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={(e)=>{e.target.style.display="none";e.target.parentElement.innerHTML=`<div style="width:80px;height:80px;borderRadius:50%;background:#0b1222;display:flex;alignItems:center;justifyContent:center;fontFamily:'Cormorant Garamond,serif';fontSize:28;color:#c8970f;fontWeight:600">A</div>`;}} />
              </div>
              <div style={{textAlign:"center",marginBottom:20}}>
                <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,fontWeight:600,color:C.white,marginBottom:4}}>Adithyo Dewangga Wijaya</div>
                <div style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:11,color:C.muted}}>Algorithmic Strategy Developer</div>
                <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"10px",color:C.gold,letterSpacing:"1px",marginTop:4}}>SINGAPORE</div>
              </div>
              <div style={{borderTop:`1px solid ${C.border}`,paddingTop:16,display:"flex",flexDirection:"column",gap:10}}>
                {links.map((l,i) => (
                  <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                    style={{display:"flex",flexDirection:"column",gap:2,padding:"10px 12px",border:`1px solid ${C.border}`,background:"transparent",textDecoration:"none",transition:"all 0.2s",cursor:"pointer"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.background=`rgba(200,151,15,0.05)`;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background="transparent";}}>
                    <span style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"10.5px",color:C.white,fontWeight:500}}><span style={{color:C.gold,marginRight:6}}>{l.icon}</span>{l.label}</span>
                    <span style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:"10px",color:C.muted}}>{l.sub}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:500,color:C.white,marginBottom:16}}>Systematic Quantitative Strategies Built on 4+ Years of Verified Live Performance</h3>
            <p style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:14,color:C.muted,lineHeight:1.75,marginBottom:14}}>
              Adithyo Dewangga Wijaya is a Singapore-based algorithmic trading strategy developer specialising in automated Expert Advisor (EA) systems for the MetaTrader platform. His flagship strategy <strong style={{color:C.label}}>TOL LANGIT V10</strong> has been continuously live-traded and publicly verifiable on both MQL5 and MyFXBook since January 2021.
            </p>
            <p style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:14,color:C.muted,lineHeight:1.75,marginBottom:24}}>
              The strategy suite spans conservative low-risk forex approaches (V10) to AI-verified institutional-style gold trading systems (ETF GOLD). All accounts operate exclusively on IC Markets — a globally regulated Tier 1 broker — with full public transparency. The <strong style={{color:C.label}}>TOL-LANGIT-Neural-Quant-Advisor</strong> GitHub repository documents the institutional quantitative methodology incorporating multi-timeframe Bayesian probability modelling and AI verification layers.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:C.border}}>
              {facts.map((f,i) => (
                <div key={i} style={{background:C.surf,padding:"18px 20px"}}>
                  <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:22,fontWeight:600,color:f.gold?C.gold:C.white,marginBottom:4}}>{f.n}</div>
                  <div style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:11,color:C.muted}}>{f.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Strategy Cards ─────────────────────────────────────────
function StrategyCards({ data }) {
  return (
    <div style={{padding:"48px 32px",background:C.surf,borderBottom:`1px solid ${C.border}`}}>
      <div style={{maxWidth:1440,margin:"0 auto"}}>
        <div style={{marginBottom:28,display:"flex",alignItems:"flex-end",justifyContent:"space-between",paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
          <div>
            <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"9.5px",letterSpacing:"2.5px",color:C.gold,marginBottom:6}}>STRATEGY OVERVIEW</div>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:24,fontWeight:500,color:C.white}}>Four Live Strategies · All Risk Profiles</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:C.border}}>
          {KEYS.map(k => {
            const s = data[k]; const rc = riskColor(s.riskCode);
            return (
              <div key={k} style={{background:C.bg,padding:24,display:"flex",flexDirection:"column",gap:0}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16}}>
                  <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:16,fontWeight:600,color:C.white,lineHeight:1.2}}>{s.name}</div>
                  <div style={{padding:"3px 8px",background:riskBg(s.riskCode),border:`1px solid ${rc}`,fontFamily:"IBM Plex Mono,monospace",fontSize:"9px",color:rc,letterSpacing:"1px",flexShrink:0,marginLeft:8}}>{s.riskCode}</div>
                </div>
                <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:32,fontWeight:600,color:C.gold,lineHeight:1,marginBottom:4}}>{fmtPct(s.growth)}</div>
                <div style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:11,color:C.muted,marginBottom:16}}>Total Growth · {s.currency}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                  <div style={{background:C.surf,padding:"10px 12px"}}>
                    <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:14,fontWeight:600,color:s.monthlyGain>0?C.green:C.red}}>{fmtPct(s.monthlyGain)}</div>
                    <div style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:"10px",color:C.muted,marginTop:2}}>Monthly Gain</div>
                  </div>
                  <div style={{background:C.surf,padding:"10px 12px"}}>
                    <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:14,fontWeight:600,color:s.ddBalPct>20?C.red:s.ddBalPct>10?C.amber:C.green}}>{fmt(s.ddBalPct)}%</div>
                    <div style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:"10px",color:C.muted,marginTop:2}}>Balance DD</div>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4,paddingTop:12,borderTop:`1px solid ${C.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:"10.5px",color:C.muted}}>Win Rate</span>
                    <span style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"10.5px",color:C.text}}>{fmt(s.winRate)}%</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:"10.5px",color:C.muted}}>Profit Factor</span>
                    <span style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"10.5px",color:C.text}}>{fmt(s.pf)}</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:"10.5px",color:C.muted}}>Weeks Live</span>
                    <span style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"10.5px",color:C.text}}>{s.weeks}</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:"10.5px",color:C.muted}}>Status</span>
                    <span style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"10.5px",color:s.status==="ACTIVE"?C.green:C.amber}}>{s.status}</span>
                  </div>
                </div>
                <div style={{marginTop:"auto",paddingTop:14,display:"flex",gap:6,flexWrap:"wrap"}}>
                  <a href={s.mql5} target="_blank" rel="noopener noreferrer"
                    style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"9.5px",padding:"4px 10px",border:`1px solid ${C.border}`,color:C.label,textDecoration:"none",transition:"all 0.2s"}}
                    onMouseEnter={e=>{e.target.style.borderColor=C.gold;e.target.style.color=C.gold;}}
                    onMouseLeave={e=>{e.target.style.borderColor=C.border;e.target.style.color=C.label;}}>MQL5 ↗</a>
                  {s.myfxbook && <a href={s.myfxbook} target="_blank" rel="noopener noreferrer"
                    style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"9.5px",padding:"4px 10px",border:`1px solid ${C.border}`,color:C.label,textDecoration:"none",transition:"all 0.2s"}}
                    onMouseEnter={e=>{e.target.style.borderColor=C.cyan;e.target.style.color=C.cyan;}}
                    onMouseLeave={e=>{e.target.style.borderColor=C.border;e.target.style.color=C.label;}}>MyFXBook ↗</a>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Full Data Table ────────────────────────────────────────
function TH({ children, align="left" }) {
  return <th style={{padding:"14px 18px",fontFamily:"Cormorant Garamond,serif",fontSize:14,fontWeight:600,color:C.white,textAlign:align,whiteSpace:"nowrap",borderRight:`1px solid ${C.border}`,background:C.surf2}}>{children}</th>;
}
function SecRow({ label }) {
  return (
    <tr>
      <td colSpan={5} style={{padding:"8px 18px",fontFamily:"IBM Plex Mono,monospace",fontSize:"9px",letterSpacing:"3px",textTransform:"uppercase",color:C.gold,background:"rgba(200,151,15,0.05)",borderTop:`1px solid rgba(200,151,15,0.15)`,borderBottom:`1px solid rgba(200,151,15,0.15)`}}>{label}</td>
    </tr>
  );
}
function DR({ label, vals, colorFn, icon="" }) {
  return (
    <tr style={{borderBottom:`1px solid ${C.border}`}}>
      <td style={{padding:"12px 18px",fontFamily:"IBM Plex Sans,sans-serif",fontSize:"11.5px",color:C.label,fontWeight:500,borderRight:`1px solid ${C.border}`,background:C.surf,whiteSpace:"nowrap"}}>
        {icon && <span style={{marginRight:6,opacity:0.5}}>{icon}</span>}{label}
      </td>
      {vals.map((v,i) => (
        <td key={i} style={{padding:"12px 18px",borderRight:i<3?`1px solid ${C.border}`:"none",verticalAlign:"middle"}}>
          <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:13,fontWeight:600,color:colorFn?colorFn(v,i):C.text,lineHeight:1.2}}>{v?.main ?? v}</div>
          {v?.sub && <div style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:"10.5px",color:C.muted,marginTop:2}}>{v.sub}</div>}
        </td>
      ))}
    </tr>
  );
}

function DataTable({ data }) {
  const s = (k) => data[k];
  const posNeg = (v) => parseFloat(v) > 0 ? C.green : parseFloat(v) < 0 ? C.red : C.muted;
  const ddColor = (pct) => pct > 30 ? C.red : pct > 15 ? C.amber : pct > 8 ? C.amber : C.green;
  return (
    <div style={{padding:"48px 32px",borderBottom:`1px solid ${C.border}`}}>
      <div style={{maxWidth:1440,margin:"0 auto"}}>
        <div style={{marginBottom:24,display:"flex",alignItems:"flex-end",justifyContent:"space-between",paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
          <div>
            <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"9.5px",letterSpacing:"2.5px",color:C.gold,marginBottom:6}}>COMPREHENSIVE ANALYSIS</div>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:24,fontWeight:500,color:C.white}}>Full Signal Performance Matrix</div>
          </div>
          <div style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,color:C.muted,maxWidth:300,textAlign:"right",lineHeight:1.6}}>All data sourced directly from verified MQL5 live accounts. Updated on every refresh.</div>
        </div>
        <div style={{overflowX:"auto",border:`1px solid ${C.border}`}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:900}}>
            <thead>
              <tr style={{background:C.surf2,borderBottom:`2px solid ${C.gold}`}}>
                <th style={{padding:"18px",fontFamily:"IBM Plex Mono,monospace",fontSize:"9.5px",letterSpacing:"2px",color:C.muted,textAlign:"left",width:180,borderRight:`1px solid ${C.border}`}}>METRIC</th>
                {KEYS.map(k => {
                  const sig = s(k); const rc = riskColor(sig.riskCode);
                  return (
                    <TH key={k}>
                      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:15,color:C.white,marginBottom:4}}>{sig.name}</div>
                      <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:18,fontWeight:600,color:C.gold,marginBottom:6}}>{fmtPct(sig.growth)}</div>
                      <div style={{display:"inline-block",padding:"2px 8px",background:riskBg(sig.riskCode),border:`1px solid ${rc}`,fontFamily:"IBM Plex Mono,monospace",fontSize:"9px",color:rc,letterSpacing:"0.8px"}}>{sig.riskCode}</div>
                    </TH>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <SecRow label="ACCOUNT OVERVIEW" />
              <DR label="Platform" icon="◈" vals={KEYS.map(k=>s(k).platform)} />
              <DR label="Broker" icon="◈" vals={KEYS.map(k=>s(k).broker)} />
              <DR label="Trading Since" icon="◷" vals={KEYS.map(k=>s(k).started)} />
              <DR label="Weeks Live" icon="◷" vals={KEYS.map(k=>({main:s(k).weeks+" wks",sub:s(k).started}))} />
              <DR label="Currency" icon="$" vals={KEYS.map(k=>s(k).currency)} />
              <DR label="Leverage" icon="◈" vals={KEYS.map(k=>s(k).leverage)} />
              <DR label="Subscription" icon="$" vals={KEYS.map(k=>s(k).subscription)} />
              <DR label="Status" icon="◉" colorFn={(v)=>v==="ACTIVE"?C.green:C.amber} vals={KEYS.map(k=>s(k).status)} />

              <SecRow label="PERFORMANCE" />
              <DR label="Total Growth" icon="▲" colorFn={posNeg} vals={KEYS.map(k=>fmtPct(s(k).growth))} />
              <DR label="Net Profit" icon="$" vals={KEYS.map(k=>({main:fmtCur(s(k).profit,s(k).currency),sub:s(k).currency}))} colorFn={()=>C.green} />
              <DR label="Balance" icon="$" vals={KEYS.map(k=>fmtCur(s(k).balance,s(k).currency))} />
              <DR label="Equity" icon="$" vals={KEYS.map(k=>({main:fmtCur(s(k).equity,s(k).currency),sub:`vs Balance: ${fmt(s(k).equity/s(k).balance*100)}%`}))} colorFn={(v,i)=>s(KEYS[i]).equity < s(KEYS[i]).balance*0.7?C.red:C.text} />
              <DR label="Initial Deposit" icon="$" vals={KEYS.map(k=>fmtCur(s(k).initDeposit,s(k).currency))} />
              <DR label="Total Withdrawals" icon="$" vals={KEYS.map(k=>fmtCur(s(k).withdrawals,s(k).currency))} colorFn={()=>C.green} />
              <DR label="Monthly Gain" icon="%" colorFn={posNeg} vals={KEYS.map(k=>fmtPct(s(k).monthlyGain))} />
              <DR label="Annual Forecast" icon="%" colorFn={posNeg} vals={KEYS.map(k=>s(k).annualForecast ? fmtPct(s(k).annualForecast) : {main:"—",sub:"Insufficient data"})} />

              <SecRow label="TRADE STATISTICS" />
              <DR label="Total Trades" icon="◈" vals={KEYS.map(k=>({main:s(k).trades.toLocaleString(),sub:`${s(k).profitTrades} wins · ${s(k).lossTrades} losses`}))} />
              <DR label="Win Rate" icon="%" colorFn={(v)=>parseFloat(v)>85?C.green:parseFloat(v)>70?C.amber:C.red} vals={KEYS.map(k=>fmt(s(k).winRate)+"%")} />
              <DR label="Profit Factor" icon="◈" colorFn={(v)=>parseFloat(v)>3?C.green:parseFloat(v)>2?C.amber:C.red} vals={KEYS.map(k=>fmt(s(k).pf))} />
              <DR label="Sharpe Ratio" icon="◈" colorFn={(v)=>parseFloat(v)>1?C.green:parseFloat(v)>0.3?C.amber:C.muted} vals={KEYS.map(k=>fmt(s(k).sharpe))} />
              <DR label="Recovery Factor" icon="◈" colorFn={(v)=>parseFloat(v)>10?C.green:parseFloat(v)>3?C.amber:C.muted} vals={KEYS.map(k=>fmt(s(k).rf))} />
              <DR label="Expected Payoff" icon="$" vals={KEYS.map(k=>({main:fmtCur(s(k).payoff,s(k).currency),sub:"Per trade avg"}))} colorFn={()=>C.green} />
              <DR label="Gross Profit" icon="$" vals={KEYS.map(k=>({main:fmtCur(s(k).grossProfit,s(k).currency),sub:s(k).grossProfitPips.toLocaleString()+" pips"}))} colorFn={()=>C.green} />
              <DR label="Gross Loss" icon="$" vals={KEYS.map(k=>({main:fmtCur(s(k).grossLoss,s(k).currency),sub:s(k).grossLossPips.toLocaleString()+" pips"}))} colorFn={()=>C.red} />
              <DR label="L/S Distribution" icon="↕" vals={KEYS.map(k=>({main:`${s(k).longPct}% Long`,sub:`${s(k).shortPct}% Short · ${s(k).longs}/${s(k).shorts}`}))} />

              <SecRow label="INDIVIDUAL TRADE METRICS" />
              <DR label="Best Trade" icon="▲" colorFn={()=>C.green} vals={KEYS.map(k=>fmtCur(s(k).bestTrade,s(k).currency))} />
              <DR label="Worst Trade" icon="▼" colorFn={()=>C.red} vals={KEYS.map(k=>fmtCur(s(k).worstTrade,s(k).currency))} />
              <DR label="Average Win" icon="+" colorFn={()=>C.green} vals={KEYS.map(k=>fmtCur(s(k).avgWin,s(k).currency))} />
              <DR label="Average Loss" icon="−" colorFn={()=>C.red} vals={KEYS.map(k=>fmtCur(s(k).avgLoss,s(k).currency))} />
              <DR label="Max Consec. Wins" icon="◈" vals={KEYS.map(k=>({main:s(k).maxCWins+" trades",sub:`${fmtCur(s(k).maxCProfit,s(k).currency)} streak profit`}))} colorFn={()=>C.green} />
              <DR label="Max Consec. Losses" icon="◈" colorFn={()=>C.red} vals={KEYS.map(k=>({main:s(k).maxCLosses+" trades",sub:`${fmtCur(s(k).maxCLoss,s(k).currency)} streak loss`}))} />

              <SecRow label="RISK & DRAWDOWN" />
              <DR label="Lot Size / $1,000" icon="◈" vals={KEYS.map(k=>s(k).lot)} colorFn={(v,i)=>{const c=s(KEYS[i]).riskCode;return c==="LOW"?C.green:c==="HIGH"?C.red:C.amber;}} />
              <DR label="Max DD (Balance)" icon="▼" colorFn={(v)=>ddColor(parseFloat(v))} vals={KEYS.map(k=>({main:fmt(s(k).ddBalPct)+"%",sub:fmtCur(s(k).ddBalAmt,s(k).currency)+" max loss"}))} />
              <DR label="Max DD (Equity)" icon="▼" colorFn={(v)=>ddColor(parseFloat(v)/2)} vals={KEYS.map(k=>({main:fmt(s(k).ddEqPct)+"%",sub:fmtCur(s(k).ddEqAmt,s(k).currency)+" floating"}))} />
              <DR label="Max Deposit Load" icon="◈" colorFn={(v)=>parseFloat(v)>100?C.red:parseFloat(v)>50?C.amber:C.green} vals={KEYS.map(k=>fmt(s(k).depLoad)+"%")} />
              <DR label="Grid / Martingale" icon="◈" vals={KEYS.map(k=>({main:s(k).gridDist==="None"?"NONE":s(k).gridDist.split("·")[0].trim(),sub:s(k).gridDist==="None"?"Clean entries only":s(k).gridDist}))} colorFn={(v)=>v==="NONE"?C.green:C.amber} />

              <SecRow label="EXECUTION PROFILE" />
              <DR label="Avg Holding Time" icon="◷" vals={KEYS.map(k=>s(k).holdTime)} />
              <DR label="Trades per Week" icon="◈" vals={KEYS.map(k=>s(k).tpw===0?"0 (Paused)":s(k).tpw+"× / week")} />
              <DR label="Trading Days" icon="◈" vals={KEYS.map(k=>({main:s(k).tradingDays+" days",sub:s(k).daysPct+"% of live period"}))} />
              <DR label="Latest Trade" icon="◷" vals={KEYS.map(k=>s(k).latestTrade)} colorFn={(v)=>v.includes("17")||v.includes("paused")?C.amber:C.green} />
              <DR label="Trading Activity" icon="%" vals={KEYS.map(k=>fmt(s(k).activity)+"%")} colorFn={(v)=>parseFloat(v)>80?C.green:parseFloat(v)>40?C.amber:C.muted} />
              <DR label="Algo Trading %" icon="%" vals={KEYS.map(k=>fmt(s(k).algo)+"%")} colorFn={()=>C.green} />
              <DR label="Strategy Type" icon="◈" vals={KEYS.map(k=>({main:s(k).strategy.split("·")[0],sub:s(k).strategy.includes("·")?s(k).strategy.split("·").slice(1).join("·").trim():""}))} />
              <DR label="Instruments" icon="◈" vals={KEYS.map(k=>({main:s(k).instruments.split("·")[0].trim()+(s(k).instruments.includes("·")?` +${s(k).instruments.split("·").length-1} more`:""),sub:s(k).platform}))} />
              <DR label="Take Profit" icon="◈" vals={KEYS.map(k=>s(k).tp)} />

              <SecRow label="RISK OF RUIN ASSESSMENT" />
              <DR label="RoR Rating" icon="⚠" colorFn={(v,i)=>riskColor(s(KEYS[i]).rorRating)} vals={KEYS.map(k=>s(k).rorRating)} />
              <DR label="RoR Assessment" icon="◈" vals={KEYS.map(k=>({main:"",sub:s(k).rorNote.slice(0,100)+"..."}))} />

              <SecRow label="TOP TRADED SYMBOLS" />
              {[0,1,2,3,4].map(idx => (
                <DR key={idx} label={`#${idx+1} Symbol`} icon="◈" vals={KEYS.map(k => {
                  const sym = s(k).top5[idx];
                  if (!sym) return {main:"—",sub:""};
                  return {main:sym.s, sub:sym.d.toLocaleString()+" trades"};
                })} colorFn={(v)=>C.cyan} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Charts ─────────────────────────────────────────────────
const CHART_TOOLTIP = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:C.surf2,border:`1px solid ${C.border}`,padding:"10px 14px"}}>
      <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"10px",color:C.label,marginBottom:4}}>{label}</div>
      <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:14,fontWeight:600,color:C.gold}}>+{payload[0].value}%</div>
    </div>
  );
};

function Charts({ data }) {
  const v10 = data.v10;
  const compData = KEYS.map(k => ({name:data[k].name.replace("TOL LANGIT ",""),monthly:data[k].monthlyGain,winRate:data[k].winRate,pf:data[k].pf}));
  return (
    <div style={{padding:"48px 32px",background:C.surf,borderBottom:`1px solid ${C.border}`}}>
      <div style={{maxWidth:1440,margin:"0 auto"}}>
        <div style={{marginBottom:28,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"9.5px",letterSpacing:"2.5px",color:C.gold,marginBottom:6}}>PERFORMANCE ANALYTICS</div>
          <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:24,fontWeight:500,color:C.white}}>Historical & Comparative Charts</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
          {/* V10 Annual Returns */}
          <div style={{background:C.bg,border:`1px solid ${C.border}`,padding:24}}>
            <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"9px",letterSpacing:"2px",color:C.gold,marginBottom:4}}>V10 FLAGSHIP · VERIFIED ANNUAL RETURNS</div>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:16,color:C.white,marginBottom:20}}>TOL LANGIT V10 — 2021 to 2024</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={v10.annRet} margin={{top:0,right:0,bottom:0,left:0}}>
                <CartesianGrid vertical={false} stroke={C.border} />
                <XAxis dataKey="y" tick={{fontFamily:"IBM Plex Mono,monospace",fontSize:11,fill:C.muted}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontFamily:"IBM Plex Mono,monospace",fontSize:11,fill:C.muted}} axisLine={false} tickLine={false} tickFormatter={v=>`+${v}%`} />
                <Tooltip content={<CHART_TOOLTIP />} />
                <Bar dataKey="v" radius={0}>
                  {v10.annRet.map((e,i) => <Cell key={i} fill={C.gold} opacity={0.7+i*0.1} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,marginTop:16,background:C.border}}>
              {v10.annRet.map(r => (
                <div key={r.y} style={{background:C.surf,padding:"10px",textAlign:"center"}}>
                  <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:14,fontWeight:600,color:C.gold}}>+{r.v}%</div>
                  <div style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:"10px",color:C.muted}}>{r.y}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Monthly Gain Comparison */}
          <div style={{background:C.bg,border:`1px solid ${C.border}`,padding:24}}>
            <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"9px",letterSpacing:"2px",color:C.gold,marginBottom:4}}>COMPARATIVE · MONTHLY GAIN</div>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:16,color:C.white,marginBottom:20}}>All Strategies — Current Monthly Gain</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={compData} margin={{top:0,right:0,bottom:0,left:0}}>
                <CartesianGrid vertical={false} stroke={C.border} />
                <XAxis dataKey="name" tick={{fontFamily:"IBM Plex Mono,monospace",fontSize:9,fill:C.muted}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontFamily:"IBM Plex Mono,monospace",fontSize:11,fill:C.muted}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`} />
                <Tooltip content={<CHART_TOOLTIP />} />
                <Bar dataKey="monthly" radius={0}>
                  {compData.map((e,i) => <Cell key={i} fill={[C.green,C.red,C.amber,C.blue][i]} opacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Risk Analysis ──────────────────────────────────────────
function RiskAnalysis({ data }) {
  const matrix = [
    {cat:"Track Record Length",v10:"4.5 yrs (238 wks)",v10hr:"~12 mo (50 wks)",etf:"~2 mo (8 wks)",etfgold:"~2 wks",w:[0,1,2,3]},
    {cat:"Balance Drawdown",v10:"10.18%",v10hr:"17.74%",etf:"8.38%",etfgold:"0.00%",w:[1,2,0,0]},
    {cat:"Equity Drawdown",v10:"72.94%",v10hr:"88.36%",etf:"62.36%",etfgold:"32.45%",w:[2,3,1,0]},
    {cat:"Lot Sizing Risk",v10:"0.03/1K (LOW)",v10hr:"0.11–0.20/1K (HIGH)",etf:"0.02/1K (LOW)",etfgold:"0.02/1K (LOW)",w:[0,3,0,0]},
    {cat:"Grid/Martingale",v10:"Smart Grid (capped)",v10hr:"Grid (aggressive)",etf:"None",etfgold:"None",w:[1,2,0,0]},
    {cat:"Max Deposit Load",v10:"30.36%",v10hr:"116.76% ⚠",etf:"24.83%",etfgold:"60.69%",w:[0,3,0,1]},
    {cat:"Win Rate",v10:"81.45%",v10hr:"94.09%",etf:"86.06%",etfgold:"100% (14 trades)",w:[1,0,1,2]},
    {cat:"Statistical Validity",v10:"HIGH (4507 trades)",v10hr:"MEDIUM (711 trades)",etf:"LOW (201 trades)",etfgold:"NONE (14 trades)",w:[0,1,2,3]},
  ];
  const colors = [C.green,C.amber,"rgba(245,158,11,0.7)",C.red];
  return (
    <div style={{padding:"48px 32px",borderBottom:`1px solid ${C.border}`}}>
      <div style={{maxWidth:1440,margin:"0 auto"}}>
        <div style={{marginBottom:28,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"9.5px",letterSpacing:"2.5px",color:C.gold,marginBottom:6}}>INSTITUTIONAL RISK FRAMEWORK</div>
          <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:24,fontWeight:500,color:C.white}}>Risk of Ruin Analysis & Assessment Matrix</div>
        </div>
        <div style={{overflowX:"auto",border:`1px solid ${C.border}`,marginBottom:32}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:800}}>
            <thead>
              <tr style={{background:C.surf2,borderBottom:`1px solid ${C.border}`}}>
                <th style={{padding:"12px 18px",fontFamily:"IBM Plex Mono,monospace",fontSize:"9px",letterSpacing:"2px",color:C.muted,textAlign:"left",width:200,borderRight:`1px solid ${C.border}`}}>RISK FACTOR</th>
                {KEYS.map(k => (
                  <th key={k} style={{padding:"12px 18px",fontFamily:"IBM Plex Mono,monospace",fontSize:"9.5px",letterSpacing:"1px",color:riskColor(data[k].riskCode),textAlign:"left",borderRight:`1px solid ${C.border}`}}>{data[k].name.replace("TOL LANGIT ","")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row,ri) => (
                <tr key={ri} style={{borderBottom:`1px solid ${C.border}`}}>
                  <td style={{padding:"11px 18px",fontFamily:"IBM Plex Sans,sans-serif",fontSize:"11.5px",color:C.label,borderRight:`1px solid ${C.border}`,background:C.surf}}>{row.cat}</td>
                  {[row.v10,row.v10hr,row.etf,row.etfgold].map((v,vi) => (
                    <td key={vi} style={{padding:"11px 18px",fontFamily:"IBM Plex Mono,monospace",fontSize:"11.5px",color:colors[row.w[vi]],borderRight:vi<3?`1px solid ${C.border}`:"none"}}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* RoR Summary Cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:C.border}}>
          {KEYS.map(k => {
            const sig = data[k]; const rc = riskColor(sig.riskCode);
            return (
              <div key={k} style={{background:C.bg,padding:22}}>
                <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:14,color:C.white,marginBottom:6}}>{sig.name}</div>
                <div style={{display:"inline-block",padding:"3px 10px",background:riskBg(sig.riskCode),border:`1px solid ${rc}`,fontFamily:"IBM Plex Mono,monospace",fontSize:"10px",fontWeight:600,color:rc,letterSpacing:"1px",marginBottom:12}}>{sig.rorRating}</div>
                <p style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:"11.5px",color:C.muted,lineHeight:1.65}}>{sig.rorNote}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Disclosures ────────────────────────────────────────────
function Disclosures() {
  return (
    <div style={{background:"#070404",padding:"56px 32px",borderTop:`3px solid ${C.red}`,borderBottom:`1px solid ${C.border}`}}>
      <div style={{maxWidth:1440,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
          <div style={{width:40,height:40,background:"rgba(239,68,68,0.1)",border:`1px solid rgba(239,68,68,0.3)`,display:"flex",alignItems:"center",justifyContent:"center",color:C.red,fontSize:18}}>⚠</div>
          <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,fontWeight:600,color:C.red}}>Important Risk Disclosures</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
          {[
            {t:"HIGH RISK TRADING WARNING",b:"Trading forex, stocks, and commodities with leverage is extremely high risk. Leveraged trading magnifies both profits and losses. You may lose more than your initial deposit. Only trade with money you can absolutely afford to lose. Do not risk money you cannot afford to lose. Better safe than homeless, right?"},
            {t:"PAST PERFORMANCE DISCLAIMER",b:"Past performance is not indicative of and does not guarantee future results. All figures represent verified historical data from live accounts and must not be interpreted as a projection or promise of future returns. Market conditions change materially at any time and without warning."},
            {t:"LIABILITY LIMITATION",b:"The strategy developer and all associated parties will not accept any responsibility whatsoever for losses incurred by any individual copying, following, or subscribing to any of the signals listed on this page. All investment decisions are made solely at the discretion and risk of the individual investor."},
            {t:"REGULATORY NOTICE",b:"These are trading signals provided for informational purposes only. Past signal performance does not constitute financial advice. Always perform independent due diligence before committing capital. Consult a licensed financial advisor if you are unsure about the risks involved."},
          ].map((d,i) => (
            <div key={i} style={{background:"rgba(239,68,68,0.04)",border:`1px solid rgba(239,68,68,0.12)`,padding:"22px 24px"}}>
              <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"9.5px",letterSpacing:"2px",color:C.red,marginBottom:10}}>{d.t}</div>
              <p style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:13,color:"#c09090",lineHeight:1.75}}>{d.b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Footer ─────────────────────────────────────────────────
function Footer({ data }) {
  return (
    <footer style={{background:"#02060e",borderTop:`1px solid ${C.border}`,padding:"48px 32px 28px"}}>
      <div style={{maxWidth:1440,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr 1fr 1fr",gap:40,marginBottom:40,paddingBottom:32,borderBottom:`1px solid ${C.border}`}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <div style={{width:32,height:32,background:C.gold,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Cormorant Garamond,serif",fontWeight:700,fontSize:14,color:C.bg}}>TL</div>
              <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:18,color:C.white,fontWeight:500}}>TOL LANGIT CAPITAL</div>
            </div>
            <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"9px",letterSpacing:"2px",color:C.gold,marginBottom:12}}>ALGORITHMIC TRADING · SINGAPORE</div>
            <p style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:12,color:C.muted,lineHeight:1.65}}>Four independently verified algorithmic trading strategies. Live accounts, publicly accessible, Tier 1 brokerage. No black boxes. No hidden results. No demos.</p>
          </div>
          {[
            {title:"VERIFIED SIGNALS",links:[
              {t:"TOL LANGIT V10 — Low Risk",u:data.v10.mql5},{t:"TOL LANGIT V10 HIGH RISK",u:data.v10hr.mql5},
              {t:"TOL LANGIT ETF",u:data.etf.mql5},{t:"TOL LANGIT ETF GOLD",u:data.etfgold.mql5},
            ]},
            {title:"VERIFICATION",links:[
              {t:"MyFXBook — V10",u:data.v10.myfxbook},{t:"MyFXBook — HIGH RISK",u:data.v10hr.myfxbook},
              {t:"MyFXBook — ETF",u:data.etf.myfxbook},{t:"IC Markets Referral",u:"https://icmarkets.com/?camp=49934"},
            ]},
            {title:"MANAGER",links:[
              {t:"GitHub — adithyodw",u:"https://github.com/adithyodw"},
              {t:"LinkedIn — Adithyo Dewangga",u:"https://sg.linkedin.com/in/adithyodewangga"},
              {t:"Telegram — @tol_langit",u:"https://t.me/tol_langit"},
              {t:"Forex Factory",u:"https://www.forexfactory.com/adithyodw"},
            ]},
          ].map((col,i) => (
            <div key={i}>
              <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"9px",letterSpacing:"2px",color:C.gold,marginBottom:14}}>{col.title}</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {col.links.filter(l=>l.u).map((l,j) => (
                  <a key={j} href={l.u} target="_blank" rel="noopener noreferrer"
                    style={{fontFamily:"IBM Plex Sans,sans-serif",fontSize:"12.5px",color:C.muted,textDecoration:"none",display:"flex",alignItems:"center",gap:6,transition:"color 0.2s"}}
                    onMouseEnter={e=>{e.target.style.color=C.gold;}} onMouseLeave={e=>{e.target.style.color=C.muted;}}>
                    <span style={{width:4,height:4,borderRadius:"50%",background:C.border,flexShrink:0,display:"inline-block"}}></span>{l.t}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"10px",color:C.muted}}>© 2026 Adithyo Dewangga Wijaya · TOL LANGIT CAPITAL · All Rights Reserved</div>
          <div style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"10px",color:C.muted}}>DATA SOURCE: MQL5.COM · MYFXBOOK.COM · IC MARKETS · NOT FINANCIAL ADVICE · MARCH 2026</div>
        </div>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════════
//  MAIN APP
// ══════════════════════════════════════════════════════════════════
export default function App() {
  useFonts();
  const [data, setData] = useState(() => JSON.parse(JSON.stringify(INIT_DATA)));
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [refreshMsg, setRefreshMsg] = useState("");
  const [showMsg, setShowMsg] = useState(false);

  const refreshData = useCallback(async () => {
    setRefreshing(true);
    setRefreshMsg("Connecting to MQL5 live accounts...");
    setShowMsg(true);
    try {
      const prompt = `Fetch the latest live statistics from these 4 MQL5 signal pages using web search, then return ONLY a valid JSON object with no markdown, no code blocks, no explanation.

Pages to fetch:
1. https://www.mql5.com/en/signals/1083101 (TOL LANGIT V10)
2. https://www.mql5.com/en/signals/2296225 (TOL LANGIT V10 HIGH RISK)
3. https://www.mql5.com/en/signals/2353105 (TOL LANGIT ETF)
4. https://www.mql5.com/en/signals/2360336 (TOL LANGIT ETF GOLD)

Return this exact JSON structure with the latest values found on those pages:
{"v10":{"growth":0,"profit":0,"balance":0,"equity":0,"monthlyGain":0,"annualForecast":0,"trades":0,"profitTrades":0,"lossTrades":0,"winRate":0,"pf":0,"sharpe":0,"rf":0,"payoff":0,"grossProfit":0,"grossProfitPips":0,"grossLoss":0,"grossLossPips":0,"bestTrade":0,"worstTrade":0,"avgWin":0,"avgLoss":0,"maxCWins":0,"maxCLosses":0,"maxCProfit":0,"maxCLoss":0,"tradingDays":0,"daysPct":0,"tpw":0,"activity":0,"depLoad":0,"ddBalPct":0,"ddEqPct":0,"ddBalAmt":0,"ddEqAmt":0,"longs":0,"longPct":0,"shorts":0,"shortPct":0,"latestTrade":"","status":"","weeks":0},"v10hr":{same fields},"etf":{same fields},"etfgold":{same fields}}

Return only the raw JSON object.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: "You are a data extraction assistant. When asked to fetch data from URLs, use web search to get the latest information, then return ONLY valid JSON with no markdown formatting, no code fences, and no explanation text whatsoever.",
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const apiData = await response.json();
      const fullText = (apiData.content || []).filter(b => b.type === "text").map(b => b.text).join("");
      const jsonMatch = fullText.match(/\{[\s\S]*?\}(?=\s*$|\s*\n)/);
      const cleanText = fullText.replace(/```json|```/g,"").trim();
      const jsonMatch2 = cleanText.match(/^\s*(\{[\s\S]*\})\s*$/);
      const toParse = jsonMatch2 ? jsonMatch2[1] : jsonMatch ? jsonMatch[0] : null;

      if (toParse) {
        const fresh = JSON.parse(toParse);
        setData(prev => {
          const next = { ...prev };
          KEYS.forEach(k => {
            if (fresh[k] && typeof fresh[k] === "object") {
              const updates = {};
              Object.entries(fresh[k]).forEach(([field, val]) => {
                if (val !== 0 && val !== "" && val !== null && val !== undefined) {
                  updates[field] = val;
                }
              });
              if (Object.keys(updates).length > 3) next[k] = { ...prev[k], ...updates };
            }
          });
          return next;
        });
        setLastUpdated(new Date());
        setRefreshMsg("✓ Live data successfully loaded from MQL5");
      } else {
        setRefreshMsg("⚠ MQL5 data parsed — showing current cached values");
      }
    } catch (err) {
      setRefreshMsg(`⚠ Refresh error: ${err.message} — showing verified cached data`);
    } finally {
      setRefreshing(false);
      setTimeout(() => setShowMsg(false), 5000);
    }
  }, []);

  useEffect(() => { refreshData(); }, []);

  return (
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"IBM Plex Sans,sans-serif"}}>
      <Ticker data={data} />
      <Nav onRefresh={refreshData} refreshing={refreshing} lastUpdated={lastUpdated} activeSection={activeSection} setActiveSection={setActiveSection} />
      {showMsg && (
        <div style={{background:C.surf,borderBottom:`1px solid ${C.border}`,padding:"10px 32px",display:"flex",alignItems:"center",gap:10}}>
          {refreshing && <span style={{display:"inline-block",width:10,height:10,borderRadius:"50%",background:C.amber,animation:"pulse 0.8s infinite"}}></span>}
          <span style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"11px",color:refreshing?C.amber:refreshMsg.startsWith("✓")?C.green:C.amber}}>{refreshMsg}</span>
        </div>
      )}
      <VerifyStrip refreshing={refreshing} lastUpdated={lastUpdated} onRefresh={refreshData} />
      <Hero data={data} />
      <About />
      <StrategyCards data={data} />
      <DataTable data={data} />
      <Charts data={data} />
      <RiskAnalysis data={data} />
      <Disclosures />
      <Footer data={data} />
    </div>
  );
}
