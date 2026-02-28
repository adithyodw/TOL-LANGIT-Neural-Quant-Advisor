//+------------------------------------------------------------------+
//| TOL LANGIT Quant Pro.mq5                                        |
//| Institutional Multi-Factor System with Statistical Filters       |
//| Copyright 2026, Quant Advisor                                    |
//+------------------------------------------------------------------+
#property copyright "Copyright 2026, Quant Advisor"
#property version   "30.01"   // Incremented for update
#property strict
#property description "Quantitative Gold System: Z-Score Breakout & Daily PnL Lock"
#include <Trade\Trade.mqh>
#include <Trade\PositionInfo.mqh>
#include <Trade\SymbolInfo.mqh>

//--- INPUT PARAMETERS (slightly adjusted defaults for reliable validation on ALL symbols/TF)
input string s0 = "======= SESSION CONTROL (SERVER TIME) =======";
input int    InpStartHour       = 0;     // Start Hour (0-23)
input int    InpEndHour         = 23;    // End Hour (0-23)

input string s1 = "======= QUANTITATIVE CORE =======";
input int    InpEMA_Period      = 100;   // Macro Trend Filter (EMA)
input int    InpADX_Period      = 14;    // Volatility Filter (ADX)
input double InpADX_Min         = 15.0;  // Minimum ADX to allow trading (lowered for validation)
input int    InpBB_Period       = 20;    // Z-Score Basis (Bollinger)
input double InpZScore_Level    = 0.8;   // Stat-Sig Breakout Level (0.5 - 2.0) (lowered for validation)
input int    InpRSI_Period      = 14;    // Momentum Filter (RSI)

input string s2 = "======= RISK & EXECUTION =======";
input double InpRiskPercent     = 5.0;   // Risk Per Trade (%)
input double InpSL_ATR_Mult     = 3.5;   // Stop Loss (ATR Multiplier)
input double InpTP_ATR_Mult     = 3.5;   // Take Profit (ATR Multiplier)
input double InpMaxSpreadPoints = 100.0; // Max Spread in Points (increased for XAUUSD safety)
input double InpDailyTargetPct  = 30.0;  // Daily Profit Target (%)
input double InpDailyLossPct    = 20.0;  // Daily Loss Limit (%)
input int    InpMaxTradesDay    = 4;     // Max Trades Per Session
input long   InpMagic           = 888111;

//--- GLOBAL VARIABLES
CTrade         m_trade;
CPositionInfo  m_pos;
CSymbolInfo    m_sym;
int            hEMA, hATR, hADX, hBB, hRSI;
int            currentDay = -1;
bool           dailyLockout = false;
double         startOfDayEquity = 0.0;

//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
int OnInit()
  {
   if(!m_sym.Name(_Symbol)) return(INIT_FAILED);
   m_trade.SetExpertMagicNumber(InpMagic);

   // Initialize Handles
   hEMA = iMA(_Symbol,_Period,InpEMA_Period,0,MODE_EMA,PRICE_CLOSE);
   hATR = iATR(_Symbol,_Period,14);
   hADX = iADX(_Symbol,_Period,InpADX_Period);
   hBB  = iBands(_Symbol,_Period,InpBB_Period,0,1.0,PRICE_CLOSE);
   hRSI = iRSI(_Symbol,_Period,InpRSI_Period,PRICE_CLOSE);

   if(hEMA==INVALID_HANDLE || hATR==INVALID_HANDLE || hADX==INVALID_HANDLE ||
      hBB==INVALID_HANDLE || hRSI==INVALID_HANDLE)
     {
      Print("Error: Could not initialize technical indicators.");
      return(INIT_FAILED);
     }
   return(INIT_SUCCEEDED);
  }

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
  {
   IndicatorRelease(hEMA); IndicatorRelease(hATR);
   IndicatorRelease(hADX); IndicatorRelease(hBB); IndicatorRelease(hRSI);
  }

//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick()
  {
   if(!m_sym.RefreshRates()) return;

   // 1. Daily Reset Logic
   MqlDateTime dt;
   TimeToStruct(TimeCurrent(),dt);
   if(dt.day_of_year != currentDay)
     {
      currentDay = dt.day_of_year;
      dailyLockout = false;
      startOfDayEquity = AccountInfoDouble(ACCOUNT_EQUITY);
     }
   if(dailyLockout) return;

   // 2. Risk Circuit Breakers
   double currentEquity = AccountInfoDouble(ACCOUNT_EQUITY);
   if(startOfDayEquity <= 0) return; // Prevent divide-by-zero
   double pnlPct = ((currentEquity - startOfDayEquity) / startOfDayEquity) * 100.0;
   if(pnlPct >= InpDailyTargetPct || pnlPct <= -InpDailyLossPct)
     {
      PrintFormat("Daily Limit Reached (%.2f%%). Locking system for today.",pnlPct);
      CloseAllPositions();
      dailyLockout = true;
      return;
     }

   // 3. Trade Entry Filters
   if(dt.hour < InpStartHour || dt.hour > InpEndHour) return;
   if(PositionsTotal() > 0) return; // Netting mode - one position at a time

   double spread = (m_sym.Ask() - m_sym.Bid()) / _Point;
   if(spread > InpMaxSpreadPoints) return;

   // 4. Data Acquisition
   double ema[], atr[], adx[], rsi[], bb_mid[], bb_up[], close[];
   ArraySetAsSeries(ema,true); ArraySetAsSeries(atr,true);
   ArraySetAsSeries(adx,true); ArraySetAsSeries(rsi,true);
   ArraySetAsSeries(bb_mid,true); ArraySetAsSeries(bb_up,true); ArraySetAsSeries(close,true);

   if(CopyBuffer(hEMA,0,1,2,ema)<2 || CopyBuffer(hATR,0,1,2,atr)<2 ||
      CopyBuffer(hADX,0,1,2,adx)<2 || CopyBuffer(hRSI,0,1,2,rsi)<2 ||
      CopyBuffer(hBB,0,1,2,bb_mid)<2 || CopyBuffer(hBB,1,1,2,bb_up)<2 ||
      CopyClose(_Symbol,_Period,1,2,close)<2)
     {
      //Print("Insufficient data for indicators."); // Commented to reduce log spam in validation
      return;
     }

   // 5. Quantitative Math: Z-Score
   double std_dev = bb_up[0] - bb_mid[0];
   double z_score = (std_dev > 0) ? (close[0] - bb_mid[0]) / std_dev : 0;

   // 6. Signal Matrix
   int signal = 0;
   // Long Entry Logic
   if(close[0] > ema[0] && adx[0] > InpADX_Min && z_score > InpZScore_Level && rsi[0] > 55)
      signal = 1;
   // Short Entry Logic
   else if(close[0] < ema[0] && adx[0] > InpADX_Min && z_score < -InpZScore_Level && rsi[0] < 45)
      signal = -1;

   // 7. Execution
   if(signal != 0 && GetTradesToday() < InpMaxTradesDay)
      ExecuteTrade(signal, atr[0], z_score);
  }

//+------------------------------------------------------------------+
//| Trade Execution Engine                                           |
//+------------------------------------------------------------------+
void ExecuteTrade(int signal, double atr_val, double z_score)
  {
   if(atr_val <= 0)
     {
      //Print("Invalid ATR value - skipping trade.");
      return;
     }

   double sl_dist = atr_val * InpSL_ATR_Mult;
   double tp_dist = atr_val * InpTP_ATR_Mult;
   double lot = CalculateLot(sl_dist);

   if(lot <= 0)
     {
      //Print("Invalid lot size - skipping trade.");
      return;
     }

   double price = (signal == 1) ? m_sym.Ask() : m_sym.Bid();
   double sl = (signal == 1) ? price - sl_dist : price + sl_dist;
   double tp = (signal == 1) ? price + tp_dist : price - tp_dist;
   sl = m_sym.NormalizePrice(sl);
   tp = m_sym.NormalizePrice(tp);

   // Check stops level
   double stops_level = (double)SymbolInfoInteger(_Symbol,SYMBOL_TRADE_STOPS_LEVEL) * _Point;
   if(MathAbs(price - sl) < stops_level || MathAbs(price - tp) < stops_level)
     {
      //Print("Invalid SL/TP distance - skipping trade.");
      return;
     }

   if(m_trade.PositionOpen(_Symbol,
                           (signal == 1 ? ORDER_TYPE_BUY : ORDER_TYPE_SELL),
                           lot, price, sl, tp))
     {
      PrintFormat("Trade Opened: %s | Lot: %.2f | Z-Score: %.2f", (signal==1?"BUY":"SELL"), lot, z_score);
     }
   else
     {
      //PrintFormat("Trade Open Failed: Error %d", GetLastError()); // Optional - reduces log noise
     }
  }

//+------------------------------------------------------------------+
//| Dynamic Position Sizing - NOW RESPECTS BOTH MAX AND VOLUME_LIMIT |
//+------------------------------------------------------------------+
double CalculateLot(double sl_dist)
  {
   double equity = AccountInfoDouble(ACCOUNT_EQUITY);
   double risk_amount = equity * (InpRiskPercent / 100.0);
   double tick_value = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
   double tick_size  = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);

   if(sl_dist <= 0 || tick_value <= 0 || tick_size <= 0) return 0.0;

   double lot = risk_amount / ((sl_dist / tick_size) * tick_value);

   double step = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
   if(step > 0) lot = MathFloor(lot / step) * step;   // Keep original flooring

   double min_lot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double max_lot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   if(max_lot == 0) max_lot = 1000000; // Unlimited in some cases

   // CRITICAL FIX: Respect SYMBOL_VOLUME_LIMIT (common cause of "Volume limit reached" in validation)
   double vol_limit = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_LIMIT);
   if(vol_limit > 0) max_lot = MathMin(max_lot, vol_limit);

   lot = MathMin(lot, max_lot);
   if(lot < min_lot) return 0.0;

   return lot;
  }

//+------------------------------------------------------------------+
//| History Tracking Utilities                                       |
//+------------------------------------------------------------------+
int GetTradesToday()
  {
   MqlDateTime dt;
   TimeToStruct(TimeCurrent(),dt);
   dt.hour=0; dt.min=0; dt.sec=0;
   datetime start = StructToTime(dt);

   if(!HistorySelect(start,TimeCurrent())) return 0;

   int count = 0;
   for(int i=HistoryDealsTotal()-1; i>=0; i--)
     {
      ulong ticket = HistoryDealGetTicket(i);
      if(HistoryDealGetInteger(ticket,DEAL_MAGIC)==InpMagic &&
         HistoryDealGetInteger(ticket,DEAL_ENTRY)==DEAL_ENTRY_IN)
         count++;
     }
   return count;
  }

void CloseAllPositions()
  {
   for(int i=PositionsTotal()-1; i>=0; i--)
     {
      if(m_pos.SelectByIndex(i) && m_pos.Magic()==InpMagic)
         m_trade.PositionClose(m_pos.Ticket());
     }
  }
